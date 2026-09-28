"""Gramlot Source classes, symmetric with ``js/src/builder/source.js``.

The runtime methods (PUT, FIRE, FIRE_AFTER, absDatapath) exist only in the
browser classes; Python authoring stays inert.
"""

from genro_builders.builder import SourceBag, SourceBagNode
from genro_tytx import get_subtype_dict, set_subtype_dict


class GramlotBuilderBagNode(SourceBagNode):
    """Source node of a Gramlot document."""


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
