"""Gramlot Source classes, symmetric with ``js/src/builder/source.js``.

The runtime methods (PUT, FIRE, FIRE_AFTER, absDatapath) exist only in the
browser classes; Python authoring stays inert.
"""

from genro_builders.builder import SourceBag, SourceBagNode


class GramlotBuilderBagNode(SourceBagNode):
    """Source node of a Gramlot document."""


class GramlotBuilderBag(SourceBag):
    """Source Bag whose nodes are GramlotBuilderBagNode."""

    _node_class = GramlotBuilderBagNode
