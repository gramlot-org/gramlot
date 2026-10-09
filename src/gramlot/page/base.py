"""Base page contract and explicitly exposed Source methods and endpoints."""

import re
from inspect import isfunction

from .builder import GramlotBuilder

MARKERS = {"__gramlot_source__": "@source", "__gramlot_endpoint__": "@endpoint"}
# The name of a declared method, as in JS page.js: an ASCII letter, then ASCII word characters.
DECLARED_NAME = re.compile(r"^[A-Za-z]\w*$", re.ASCII)


def _mark(function, marker, auth):
    def mark(function):
        if not isfunction(function):
            raise TypeError(f"{MARKERS[marker]} can decorate only an instance method")
        if function.__name__ == "main":
            raise TypeError(f"{MARKERS[marker]} cannot declare main")
        setattr(function, marker, {"auth": auth})
        return function
    return mark if function is None else mark(function)


def source(function=None, *, auth=None):
    """Mark an instance method as an explicitly exposed Source method: ``@source`` or
    ``@source(auth="rule")``.

    Source methods (`@source`, `registerSource`, `remoteSource`) are not yet part of the page-writing API:
    they arrive together with the `remote` grammar attribute.
    """
    return _mark(function, "__gramlot_source__", auth)


def endpoint(function=None, *, auth=None):
    """Mark an instance method as an endpoint called with ``contentType: 'data'``:
    ``@endpoint`` or ``@endpoint(auth="rule")``."""
    return _mark(function, "__gramlot_endpoint__", auth)


class Page:
    title = "Gramlot"
    css = ()
    css_requires = ""
    js_requires = ""
    source_builder = GramlotBuilder

    def main(self, root):
        """Populate a Source; implementations may be synchronous or async."""
        raise NotImplementedError


def _declared(page_class, marker):
    methods, shadowed = {}, set()
    for owner in page_class.__mro__:
        for name, value in vars(owner).items():
            if name in shadowed:
                continue
            shadowed.add(name)
            # A marked value that is not an instance method, or whose name is not
            # DECLARED_NAME, is not declared: requesting it is not found, as in JS.
            if not DECLARED_NAME.fullmatch(name) or not isfunction(value):
                continue
            marks = [key for key in MARKERS if getattr(value, key, None) is not None]
            if len(marks) > 1:
                raise TypeError(f"{name} is declared both as Source method and endpoint")
            if marks == [marker]:
                methods[name] = value
    return methods


def source_methods(page_class):
    return _declared(page_class, "__gramlot_source__")


def endpoint_methods(page_class):
    return _declared(page_class, "__gramlot_endpoint__")
