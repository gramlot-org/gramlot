"""Base page contract and explicitly exposed Source methods."""

from inspect import isfunction

from .builder import GramlotBuilder


def source(function):
    if not isfunction(function):
        raise TypeError("@source can decorate only an instance method")
    function.__gramlot_source__ = True
    return function


class Page:
    title = "Gramlot"
    css = ()
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
