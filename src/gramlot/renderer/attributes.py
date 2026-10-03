"""Attribute rules shared by GramlotHtmlRenderer and GramlotSvgRenderer.

Same table and same functions as ``js/src/renderer/attributes.js`` (source plan §1 rule 10).
"""

import re

XHTML_NS = "http://www.w3.org/1999/xhtml"
SVG_NS = "http://www.w3.org/2000/svg"

# Binding attributes are read by the Gramlot runtime and never reach the output (source plan, S02).
# The names are the resolved ones: runtime_values turns the keyword names ``_if``/``_else`` into ``if``/``else``.
BINDING_ATTRIBUTES = frozenset({
    "default", "default_value", "live", "group", "visible", "action", "fire",
    "if", "else", "_init", "_onStart", "_onBuilt", "_delay", "_timing", "_userChanges",
})
BINDING_ATTRIBUTE_PREFIXES = ("default_", "attr_", "fire_", "connect_on")

# Legacy noConvertStyle (genro_wdg.js:102-108): these attributes stay native attributes, never style.
NATIVE_ATTRIBUTES = {
    "table": ("width", "border"),
    "editor": ("height",),
    "embed": ("width", "height"),
    "img": ("width", "height"),
    "canvas": ("width", "height"),
}

# A ``${name}`` template reference; ``\${`` stays text (Builder's runtime_values rule).
TEMPLATE_REFERENCE = re.compile(r"(?<!\\)\$\{([a-zA-Z_][a-zA-Z0-9_]*)\}")

# Display directives of the node text: consumed by the renderer, never written as attributes.
DISPLAY_ATTRIBUTES = ("format", "mask", "locale", "places", "dtype")

# Output attributes whose ``javascript:`` value the browser runs as code (``action`` never reaches the output).
URL_ATTRIBUTES = frozenset({"href", "src", "formaction", "xlink:href", "xlink_href"})

# The form of a native event handler: ``on`` followed by at least one character.
EVENT_HANDLER = re.compile(r"^on.", re.IGNORECASE)

# A ``javascript:`` URL as the URL parser reads it: tabs and newlines removed, leading controls and spaces trimmed.
URL_TABS_AND_NEWLINES = re.compile(r"[\t\n\r]")
URL_LEADING_CONTROLS = re.compile(r"^[\x00-\x20]+")
JAVASCRIPT_SCHEME = re.compile(r"^javascript:", re.IGNORECASE)


def without_binding_attributes(attrs):
    """The attributes of ``attrs`` that are not binding attributes."""
    return {name: value for name, value in attrs.items()
            if name not in BINDING_ATTRIBUTES and not name.startswith(BINDING_ATTRIBUTE_PREFIXES)}


def require_no_script_attributes(node, attrs, prefixes=()):
    """No attribute of ``attrs`` (resolved, ``==`` handled) makes the browser run a text outside InlineCompiler.

    A name starting with ``on`` and longer than it, the form of the native event handlers, is an error
    pointing to ``connect_on<event>``; a ``javascript:`` URL is an error pointing to ``connect_onclick``.
    Every such name is refused, not a list of events, so an event a browser adds is refused too. The
    names are read without the dialect ``prefixes`` (``html_``).
    """
    for name, value in without_null_values(without_binding_attributes(attrs)).items():
        prefix = next((candidate for candidate in prefixes if name.startswith(candidate)), None)
        bare = name[len(prefix):] if prefix else name
        if EVENT_HANDLER.match(bare):
            raise ValueError(f"{node.node_tag} '{node.label}': '{name}' has the form of a native event handler, run by "
                             f"the browser outside Gramlot; write connect_{bare} for an event, or rename the attribute")
        if bare.lower() in URL_ATTRIBUTES and is_javascript_url(value):
            raise ValueError(f"{node.node_tag} '{node.label}': '{name}' holds a javascript: URL, run by the browser "
                             "as code; write connect_onclick or the action of a button instead")


def is_javascript_url(value):
    """Whether ``value`` is a ``javascript:`` URL as the URL parser reads it."""
    if not isinstance(value, str):
        return False
    return bool(JAVASCRIPT_SCHEME.match(URL_LEADING_CONTROLS.sub("", URL_TABS_AND_NEWLINES.sub("", value))))


def with_data_srcdoc_sandbox(node, attrs, prefixes=()):
    """``attrs`` of an ``iframe`` whose ``srcdoc`` comes from Data, with an empty ``sandbox`` first.

    The browser shows the HTML of a datum and runs nothing of it. ``srcdoc`` comes from Data when it is
    a ``^``/``=`` pointer, a ``==`` expression or a ``${…}`` template reading one, or when the node value
    is a pointer, whose datum can carry ``srcdoc`` in its ``_wdg``. The declaration decides, so the iframe
    has ``sandbox`` while ``srcdoc`` is still None. A ``sandbox`` declared in the Source stays as declared;
    a literal ``srcdoc`` gets none. The names are read without the dialect ``prefixes`` (``html_``);
    ``sandbox`` takes the prefix of ``srcdoc``.
    """
    if node.node_tag != "iframe":
        return attrs

    def bare(name):
        prefix = next((candidate for candidate in prefixes if name.startswith(candidate)), "")
        return prefix, name[len(prefix):].lower()

    declared = dict(node.fixed_attr_items())
    srcdoc = next((name for name in [*declared, *attrs] if bare(name)[1] == "srcdoc"), None)
    if srcdoc is None or any(bare(name)[1] == "sandbox" for name in declared):
        return attrs

    def from_data(name, seen):
        raw = declared[name]
        seen.add(name)
        return node.pointer_type(raw) is not None or is_expression(raw) or any(
            param in declared and param not in seen and from_data(param, seen) for param in template_parameters(raw))

    if node.pointer_type(node.value) is None and not (srcdoc in declared and from_data(srcdoc, set())):
        return attrs
    rest = {name: value for name, value in attrs.items() if bare(name)[1] != "sandbox"}
    return {f"{bare(srcdoc)[0]}sandbox": "", **rest}


def without_null_values(attrs):
    """The attributes of ``attrs`` whose value is not None."""
    return {name: value for name, value in attrs.items() if value is not None}


def dom_names(attrs):
    """DOM attribute names: ``data_*``/``aria_*`` → ``data-*``/``aria-*``, ``xmlns_x`` → ``xmlns:x``."""
    result = {}
    for name, value in attrs.items():
        if name.startswith("xmlns_"):
            name = f"xmlns:{name[len('xmlns_'):]}"
        elif name.startswith(("data_", "aria_")):
            name = name.replace("_", "-")
        result[name] = value
    return result


def boundary_attributes(attrs):
    """The attributes of a sub-builder boundary node: no dialect adaptation, only the Gramlot filters and names."""
    rest = {name: value for name, value in attrs.items() if name != "_meta"}
    return dom_names(without_null_values(without_binding_attributes(rest)))


def split_native_attributes(tag, attrs):
    """``(attrs, native)``: the noConvertStyle attributes of ``tag`` taken out of ``attrs``."""
    names = NATIVE_ATTRIBUTES.get(str(tag).lower(), ())
    rest = {name: value for name, value in attrs.items() if name not in names}
    native = {name: value for name, value in attrs.items() if name in names}
    return rest, native


def text_value(value):
    """The node text of a scalar value: booleans as ``true``/``false``, as in JavaScript."""
    if value is True:
        return "true"
    if value is False:
        return "false"
    return str(value)


def display_item(item, attrs):
    """``(item, attrs)`` with the display directives consumed (HTML only).

    ``format``, ``places``, ``locale`` and ``dtype`` do not format the text in 0.2.0. ``mask``
    follows the legacy rule (gnrlang.js asText): ``%s`` replaced by the value, no mask when the
    value is empty.
    """
    rest = dict(attrs)
    mask = rest.get("mask")
    for name in DISPLAY_ATTRIBUTES:
        rest.pop(name, None)
    if isinstance(item, list):
        return item, rest
    if isinstance(item, bool):
        item = text_value(item)
    if mask is None:
        return item, rest
    text = "" if item is None else text_value(item)
    return (str(mask).replace("%s", text) if text else text), rest


def is_expression(value):
    """Whether ``value`` is a ``==`` expression (Q11.2)."""
    return isinstance(value, str) and value.startswith("==")


def template_parameters(value):
    """The parameter names of the ``${name}`` templates of ``value``, in order; none for a value that is not a string."""
    return TEMPLATE_REFERENCE.findall(value) if isinstance(value, str) else []


def require_no_expression_template(node):
    """Templates and ``==`` expressions do not mix (Q11.2).

    A template that uses a ``==`` attribute of the same node is an error naming both attributes;
    a ``${…}`` inside a ``==`` attribute or node value is an error naming it.
    """
    if is_expression(node.value) and template_parameters(node.value):
        raise ValueError(f"{node.node_tag} '{node.label}': the == node value contains a ${{…}} template, "
                         "not accepted in a == expression")
    attrs = dict(node.fixed_attr_items())
    for name, raw in attrs.items():
        if is_expression(raw) and template_parameters(raw):
            raise ValueError(f"{node.node_tag} '{node.label}': '{name}' contains a ${{…}} template, "
                             "not accepted in a == expression")
        for param in template_parameters(raw):
            if is_expression(attrs.get(param)):
                raise ValueError(f"{node.node_tag} '{node.label}': the template of '{name}' uses '{param}', a == expression")
