"""Gramlot Source classes, symmetric with ``js/src/builder/source.js``.

The Python classes carry no runtime methods: PUT, FIRE, FIRE_AFTER and
absDatapath stay in the browser classes. They may carry the value
classification shared with JS (``pointer_type``), the copy without the
elements refused by an ``auth`` evaluator (``authorized_copy``, JS
``authorizedCopy``) and the authoring dispatch of a GramlotBuilder (``GramlotBuilder.schema_tag``), which the JS classes get
from Builder's Proxy calling ``GramlotBuilder.schemaTag``.
"""

from typing import Any

from genro_builders.builder import SourceBag, SourceBagNode
from genro_tytx import get_subtype_dict, set_subtype_dict

from . import builder as builder_module


class GramlotBuilderBagNode(SourceBagNode):
    """Source node of a Gramlot document."""

    def pointer_type(self, v: Any) -> str | None:
        """Builder's ``pointer_type``, except that a string starting with ``==`` is not a pointer."""
        if isinstance(v, str) and v.startswith("=="):
            return None
        return super().pointer_type(v)

    def __getattr__(self, name: str) -> Any:
        """Builder's element dispatch; a GramlotBuilder resolves the name with ``schema_tag``."""
        if not name.startswith("_"):
            builder = self._resolve_builder()
            if isinstance(builder, builder_module.GramlotBuilder):
                tag = builder.schema_tag(name)
                if tag is not None:
                    return builder.element_call(self, tag)
        return super().__getattr__(name)


class GramlotBuilderBag(SourceBag):
    """Source Bag whose nodes are GramlotBuilderBagNode."""

    _node_class = GramlotBuilderBagNode

    def authorized_copy(self, auth):
        """A copy of this Source without the elements whose ``auth`` rule ``auth`` refuses.

        ``auth`` is a callable ``rule -> None | "not_authenticated" | "not_authorized"``.
        An element whose ``auth`` attribute ``auth`` answers with a code is left out
        with its subtree; an accepted element is copied without its ``auth`` attribute
        (the rule belongs to the server); nested Source branches are copied the same
        way. This Bag is not changed. A non-string ``auth`` attribute is a ``TypeError``.
        """
        result = self.__class__()
        for node in self:
            rule = node.attr.get("auth")
            if rule is not None:
                if not isinstance(rule, str):
                    raise TypeError(f"{node.node_tag} '{node.label}': 'auth' must be a string rule, "
                                    f"not {type(rule).__name__}")
                if auth(rule) is not None:
                    continue
            value = node.static_value
            if isinstance(value, GramlotBuilderBag):
                value = value.authorized_copy(auth)
            attributes = {name: attr for name, attr in node.attr.items() if name != "auth"}
            copied = result.set_item(node.label, value, _attributes=attributes,
                                     _remove_null_attributes=False, node_tag=node.node_tag)
            copied.xml_tag = node.xml_tag
        return result

    def __getattribute__(self, name: str) -> Any:
        """Builder's grammar-first lookup; a GramlotBuilder resolves the name with ``schema_tag``."""
        if not name.startswith(("_", "bag_")):
            builder = super().__getattribute__("__dict__").get("_builder")
            if isinstance(builder, builder_module.GramlotBuilder):
                tag = builder.schema_tag(name)
                if tag is not None:
                    return builder.element_call(self, tag)
        return super().__getattribute__(name)


# GramlotBuilderBag travels on the TYTX wire as "::X" with __cls "GramlotBuilderBag":
# its name joins the subtype dictionary of its type, as Builder does for SourceBag.
# The name already owned by another class is a collision.
if get_subtype_dict(GramlotBuilderBag.__tytx_suffix__).get("GramlotBuilderBag", GramlotBuilderBag) is not GramlotBuilderBag:
    raise ValueError("TYTX subtype name 'GramlotBuilderBag' is already registered for another class")
set_subtype_dict(
    GramlotBuilderBag.__tytx_suffix__,
    {**get_subtype_dict(GramlotBuilderBag.__tytx_suffix__), "GramlotBuilderBag": GramlotBuilderBag},
)
