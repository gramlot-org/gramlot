"""Resource names and bootstrap load order; no file lookup and no HTTP engine.

The JavaScript counterpart is ``js/src/adapters/resources.js``; both apply the
same rules. ``css_requires``/``js_requires`` names are interpreted by a Host with
a resource system, not by the core.
"""
import json
import re

# One segment of a resource or page name.
SEGMENT = re.compile(r"[A-Za-z0-9_-]+")
_EXTENSION = re.compile(r"[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)+")
# Unicode White_Space property (U+FEFF excluded); the JavaScript parser strips the same characters.
SPACES = ("\u0009\u000a\u000b\u000c\u000d \u0085  "
          "           "
          "    　")


class InvalidResourceName(ValueError):
    """A page declares its resources in an invalid way."""


def _check_name(name):
    if ":" in name:
        raise InvalidResourceName(f"Resource name \"{name}\": 'name:media' is not supported")
    segments = name.split("/")
    if any(_EXTENSION.fullmatch(segment) for segment in segments):
        raise InvalidResourceName(f"Resource name \"{name}\": names have no extension")
    if not all(SEGMENT.fullmatch(segment) for segment in segments):
        raise InvalidResourceName(f"Invalid resource name \"{name}\": use '/'-separated segments "
                                  "of letters, digits, '_' or '-'")


def parse_requires(text):
    """Parse ``css_requires``/``js_requires``: comma-separated resource names.

    Spaces around a name (``SPACES``), empty tokens and later duplicates are ignored.
    """
    if not isinstance(text, str):
        raise InvalidResourceName("Resource requirements must be a comma-separated string")
    names = []
    for token in text.split(","):
        name = token.strip(SPACES)
        if not name or name in names:
            continue
        _check_name(name)
        names.append(name)
    return tuple(names)


def _last_occurrence(items, key):
    """Keep each key once, in its last position."""
    last = {key(item): index for index, item in enumerate(items)}
    return [item for index, item in enumerate(items) if last[key(item)] == index]


def load_order(resources):
    """Return ``{"css": [url], "js": [{url, group}]}`` with each URL once, in its last position.

    The same JS URL with two different groups raises ``InvalidResourceName`` (C03):
    it is the same file declared under two names.
    """
    groups = {}
    for entry in resources["js"]:
        group = groups.setdefault(entry["url"], entry["group"])
        if group != entry["group"]:
            raise InvalidResourceName(f"JS resource \"{entry['url']}\" is declared with two groups: "
                                      f"{json.dumps(group)} and {json.dumps(entry['group'])}")
    return {"css": _last_occurrence(resources["css"], lambda url: url),
            "js": _last_occurrence(resources["js"], lambda entry: entry["url"])}
