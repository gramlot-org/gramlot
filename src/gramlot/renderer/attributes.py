"""Attribute rules shared by GramlotHtmlRenderer and GramlotSvgRenderer.

Same table and same functions as ``js/src/renderer/attributes.js`` (source plan §1 rule 10).
"""

import re

XHTML_NS = "http://www.w3.org/1999/xhtml"
SVG_NS = "http://www.w3.org/2000/svg"

# Binding attributes are read by the Gramlot runtime and never reach the output (source plan, S02).
# The names are the resolved ones: runtime_values turns the keyword names ``_if``/``_else`` into ``if``/``else``.
BINDING_ATTRIBUTES = frozenset({
    "default", "default_value", "live", "group", "visible", "action", "fire", "ask", "_ask", "_ask_if", "_ask_title", "_ask_onCancel",
    "if", "else", "_init", "_onStart", "_onBuilt", "_delay", "_timing", "_userChanges",
    "remote", "_cachedRemote", "_onRemote", "_onCalling", "onClose",
})
BINDING_ATTRIBUTE_PREFIXES = ("default_", "attr_", "fire_", "connect_on", "subscribe_", "selfsubscribe_", "formsubscribe_", "remote_")

# Legacy noConvertStyle (genro_wdg.js:102-108): these attributes stay native attributes, never style.
NATIVE_ATTRIBUTES = {
    "table": ("width", "border"),
    "editor": ("height",),
    "embed": ("width", "height"),
    "img": ("width", "height"),
    "canvas": ("width", "height"),
}



# Display directives of the node text: consumed by the renderer, never written as attributes.
DISPLAY_ATTRIBUTES = ("format", "mask", "locale", "timeZone", "places", "dtype")

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
            if not (isinstance(value, dict) and "$gramlotRef" in value)
            and name not in BINDING_ATTRIBUTES and not name.startswith(BINDING_ATTRIBUTE_PREFIXES)}


def require_style_class_attributes(node, attrs, prefixes=()):
    """Validate resolved style/class before style composition, including literal dialect attributes."""
    for name, value in attrs.items():
        prefix = next((candidate for candidate in prefixes if name.startswith(candidate)), "")
        bare = name[len(prefix):]
        if bare in ("style", "class", "_class") and value is not None and not isinstance(value, str):
            raise TypeError(f"{node.node_tag} '{node.label}': '{name}' must be a string or null")


def require_no_script_attributes(node, attrs, prefixes=()):
    """No attribute of ``attrs`` (resolved, ``==`` handled) makes the browser run a text outside InlineCompiler.

    A name starting with ``on`` and longer than it, the form of the native event handlers, is an error
    pointing to ``connect_on<event>``; a ``javascript:`` URL is an error pointing to ``connect_onclick``.
    Every such name is refused, not a list of events, so an event a browser adds is refused too. The
    names are read without the dialect ``prefixes`` (``html_``).
    """
    if attrs.get("onClose") is not None and (node.parent_node is None or not (node.parent_node._get_meta("gramlot_component") or {}).get("childParameters", {}).get("onClose")):
        raise ValueError("onClose is only supported on a tab/stack panel")
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
    a ``^``/``=`` pointer or a ``==`` expression, or when the node value
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

    if node.pointer_type(node.value) is None and not (srcdoc in declared and (
            node.pointer_type(declared[srcdoc]) is not None or is_expression(declared[srcdoc]))):
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
    """Consume display directives; static output supports {} masks, not Intl formatting."""
    rest = dict(attrs)
    mask = rest.get("mask")
    for name in DISPLAY_ATTRIBUTES:
        rest.pop(name, None)

    def display(value):
        if isinstance(value, bool):
            value = text_value(value)
        if mask is None:
            return value
        text = "" if value is None else text_value(value)
        if not text:
            return text
        if not isinstance(mask, str) or re.search(r"[{}]", mask.replace("{}", "")):
            raise ValueError("This formatter mask supports only {} placeholders")
        return mask.replace("{}", text)

    if isinstance(item, list):
        if "_text" in rest:
            rest["_text"] = display(rest["_text"])
        return item, rest
    return display(item), rest


def is_expression(value):
    """Whether ``value`` is a ``==`` expression (Q11.2)."""
    return isinstance(value, str) and value.startswith("==")
