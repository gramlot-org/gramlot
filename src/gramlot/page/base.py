"""Base page contract and explicitly exposed Source methods."""

from inspect import isfunction

from .builder import GramlotBuilder


def source(function):
    """Mark an instance method as an explicitly exposed Source method.

    Source methods (`@source`, `source(...)`, `remoteSource`) are not yet part of the page-writing API:
    they arrive together with the `remote` grammar attribute and `@endpoint`.
    """
    if not isfunction(function):
        raise TypeError("@source can decorate only an instance method")
    function.__gramlot_source__ = True
    return function


class Page:
    title = "Gramlot"
    css = ()
    css_requires = ""
    js_requires = ""
    source_builder = GramlotBuilder

    def main(self, root):
        """Populate a Source; implementations may be synchronous or async."""
        raise NotImplementedError


def source_methods(page_class):
    methods, shadowed = {}, set()
    for owner in page_class.__mro__:
        for name, value in vars(owner).items():
            if name in shadowed:
                continue
            shadowed.add(name)
            if name.startswith("_") or not getattr(value, "__gramlot_source__", False):
                continue
            if not isfunction(value):
                raise TypeError(f"Source method {name} must be an instance method")
            methods[name] = value
    return methods
