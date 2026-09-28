"""Gramlot Source classes, symmetric with ``js/src/builder/source.js``.

The Python classes carry no runtime methods: PUT, FIRE, FIRE_AFTER and
absDatapath stay in the browser classes. They may carry the value
classification shared with JS (``pointer_type``).
"""

from typing import Any

from genro_builders.builder import SourceBag, SourceBagNode
from genro_tytx import get_subtype_dict, set_subtype_dict


class GramlotBuilderBagNode(SourceBagNode):
    """Source node of a Gramlot document."""

    def pointer_type(self, v: Any) -> str | None:
        """Builder's ``pointer_type``, except that a string starting with ``==`` is not a pointer."""
        if isinstance(v, str) and v.startswith("=="):
            return None
        return super().pointer_type(v)


class GramlotBuilderBag(SourceBag):
    """Source Bag whose nodes are GramlotBuilderBagNode."""

    _node_class = GramlotBuilderBagNode


# GramlotBuilderBag travels on the TYTX wire as "::X" with __cls "GramlotBuilderBag":
# its name joins the subtype dictionary of its type, as Builder does for SourceBag.
# The name already owned by another class is a collision.
if get_subtype_dict(GramlotBuilderBag.__tytx_suffix__).get("GramlotBuilderBag", GramlotBuilderBag) is not GramlotBuilderBag:
    raise ValueError("TYTX subtype name 'GramlotBuilderBag' is already registered for another class")
set_subtype_dict(
    GramlotBuilderBag.__tytx_suffix__,
    {**get_subtype_dict(GramlotBuilderBag.__tytx_suffix__), "GramlotBuilderBag": GramlotBuilderBag},
)
