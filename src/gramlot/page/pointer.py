"""Attribute pointer templates in static output; JavaScript expressions stay browser-owned."""

import re

from genro_bag.resolver import BagResolver, BagCbResolver

SLOT = re.compile(r"\{(\??[A-Za-z_][A-Za-z0-9_]*|\?)?\}")
TEMPLATE = re.compile(r"(\\)?\$\{([A-Za-z_][A-Za-z0-9_]*)\}")


def expression_slots(body):
    """Collect slots outside quoted literals/comments/regex; never evaluate JavaScript."""
    slots, index, operand = [], 0, True
    while index < len(body):
        char = body[index]
        if char in "\"'`":
            index += 1
            while index < len(body):
                if body[index] == "\\":
                    index += 2
                elif body[index] == char:
                    index += 1
                    break
                else:
                    index += 1
            operand = False
            continue
        if body.startswith("//", index):
            end = body.find("\n", index)
            index = len(body) if end < 0 else end
            continue
        if body.startswith("/*", index):
            end = body.find("*/", index + 2)
            index = len(body) if end < 0 else end + 2
            continue
        if char == "/" and operand:
            index += 1
            bracket = False
            while index < len(body):
                current = body[index]
                index += 1
                if current == "\\":
                    index += 1
                elif current == "[":
                    bracket = True
                elif current == "]":
                    bracket = False
                elif current == "/" and not bracket:
                    break
            while index < len(body) and body[index].isascii() and body[index].isalpha():
                index += 1
            operand = False
            continue
        match = SLOT.match(body, index)
        if match:
            name = match[1] or ""
            if name.startswith("?"):
                raise ValueError("Optional slots are supported in pointer templates only")
            slots.append(name)
            index = match.end()
            operand = False
            continue
        word = re.match(r"[A-Za-z_$][A-Za-z0-9_$]*", body[index:])
        if word:
            index += len(word[0])
            operand = word[0] in ("return", "typeof", "void", "delete", "new", "in", "instanceof", "yield", "await")
            continue
        index += 1
        if not char.isspace():
            operand = char in "([{,:;=!?&|+*%~<>/-"
    return slots


def pointer_transform(value):
    if not isinstance(value, str) or not value.startswith(("^", "=")) or value.startswith("=="):
        return None
    if ":" not in value:
        return None
    pointer, body = value.split(":", 1)
    expression = body.startswith("=")
    return pointer, expression, body[1:] if expression else body


def pointer_template(body, read):
    result, blocked, index = [], False, 0
    while index < len(body):
        if body[index] not in "{}":
            result.append(body[index])
            index += 1
            continue
        match = SLOT.match(body, index)
        if match is None:
            raise ValueError("Invalid pointer template placeholder")
        slot = match[1] or ""
        optional = slot.startswith("?")
        value = read(slot[1:] if optional else slot)
        if value is None or (value == "" and not optional):
            blocked = True
        else:
            result.append(str(value).lower() if isinstance(value, bool) else str(value))
        index = match.end()
    return None if blocked else "".join(result)


def prepare_pointer_items(node, items):
    transformed = [(name, raw) for name, raw in items.items() if isinstance(name, str) and pointer_transform(raw)]
    if not transformed:
        return items
    values, active, consumed = {}, [], set()
    # One current set of Source attributes, before any suffix is applied.
    current = {}
    for name, raw in items.items():
        if not isinstance(name, str):
            continue
        transform = pointer_transform(raw)
        pointer = transform[0] if transform else raw
        current[name] = (pointer() if isinstance(pointer, BagResolver)
                         else node.get_relative_data(pointer) if node.pointer_type(pointer)
                         else pointer)

    def resolve(name):
        if name in values:
            return values[name]
        if name not in items:
            raise ValueError(f"{node.node_tag} '{node.label}': '{name}': referenced Source attribute does not exist")
        if name in active:
            raise ValueError(f"{node.node_tag} '{node.label}': '{name}': cyclic attribute dependency")
        active.append(name)
        raw = items[name]
        transform = pointer_transform(raw)
        try:
            if transform:
                pointer, expression, body = transform
                if expression:
                    for key in expression_slots(body):
                        if key:
                            resolve(key)
                    result = None  # Same inert static behavior as ==; no Python JS evaluator.
                else:
                    leading = current[name]

                    def read(key):
                        if not key:
                            return leading
                        return resolve(key)

                    result = pointer_template(body, read)
                    if leading is None:
                        result = None
            elif isinstance(raw, str) and raw.startswith("=="):
                result = None
            else:
                result = current[name]
                if isinstance(result, str) and not node._get_meta("data_element"):
                    def replace(match):
                        if match[1]:
                            return match[0][1:]
                        consumed.add(match[2])
                        value = resolve(match[2])
                        return "" if value is None else str(value).lower() if isinstance(value, bool) else str(value)
                    result = TEMPLATE.sub(replace, result)
            values[name] = result
            return result
        finally:
            active.pop()

    results = {name: resolve(name) for name, _ in transformed}
    for name, raw in items.items():
        if isinstance(name, str) and not pointer_transform(raw) and (isinstance(raw, BagResolver) or node.pointer_type(raw)):
            result = current[name]
            items[name] = BagCbResolver(lambda result=result: result)
    for name, result in results.items():
        items[name] = BagCbResolver(lambda result=result: result)
    if not node._get_meta("data_element"):
        for name in consumed:
            items.pop(name, None)
    return items
