"""The literal DOM tag of a webcomponent, also checked by the browser renderer."""
import re

_NAME = re.compile(
    r"[a-z][.0-9_a-z\-\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D"
    r"\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF"
    r"\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\U00010000-\U000EFFFF]*"
)
_RESERVED = {"annotation-xml", "color-profile", "font-face", "font-face-src",
             "font-face-uri", "font-face-format", "font-face-name", "missing-glyph"}


def webcomponent_code(attrs):
    """Return code without evaluating pointers or expressions, or raise ValueError."""
    code = attrs.get("code")
    if not isinstance(code, str) or not _NAME.fullmatch(code) or "-" not in code or code in _RESERVED:
        raise ValueError("webcomponent: code must be a literal custom-element name")
    return code
