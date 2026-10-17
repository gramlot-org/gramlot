"""Gramlot Source classes, symmetric with ``js/src/builder/source.js``.

Python keeps authoring checks and authorization filtering. Builder owns pointer
classification and static suffix resolution; browser-only Source methods such as
PUT, FIRE, FIRE_AFTER and variable datapath remain in the JavaScript classes.
Python's ``__getattr__`` uses ``GramlotBuilder.schema_tag`` for authoring dispatch;
JavaScript uses Builder's Source proxy and ``GramlotBuilder.schemaTag``.
"""

import re
from typing import Any

from genro_builders.builder import SourceBag, SourceBagNode
from genro_tytx import get_subtype_dict, set_subtype_dict

from . import builder as builder_module
from genro_builders.builder.pointers import pointer_transform

# The control attributes of ``remote``, written on the node as they are; every other parameter becomes ``remote_<k>``.
REMOTE_CONTROLS = ("_cachedRemote", "_if", "_else", "_onRemote")
# ASCII and matched whole, as the JavaScript `/^[A-Za-z]\w*$/`.
REMOTE_NAME = re.compile(r"^[A-Za-z]\w*$", re.ASCII)


class GramlotBuilderBagNode(SourceBagNode):
    """Source node of a Gramlot document."""

    def runtime_to_evaluate(self):
        items = super().runtime_to_evaluate()
        for name, raw in items.items():
            if pointer_transform(raw):
                if name is None:
                    raise ValueError("Pointer suffixes belong to attributes; use format/mask for node text")
        return items

    def remote(self, name: str, /, **params: Any) -> "GramlotBuilderBagNode":
        """Declare the content of this element as the fragment ``name`` of a ``@source`` method.

        Writes ``remote = name`` and one ``remote_<k> = v`` per call parameter on this node;
        the control attributes ``_cachedRemote``, ``_if``, ``_else`` and ``_onRemote`` are written
        as they are. Returns this node. A bad name or another ``_`` parameter is a ``ValueError``.
        """
        if not isinstance(name, str) or not REMOTE_NAME.fullmatch(name):
            raise ValueError(f"{self.node_tag} '{self.label}': remote name must match {REMOTE_NAME.pattern}, "
                             f"not {name!r}")
        invalid = next((key for key in params if key.startswith("_") and key not in REMOTE_CONTROLS), None)
        if invalid is not None:
            raise ValueError(f"{self.node_tag} '{self.label}': remote parameter '{invalid}' is not accepted; "
                             f"the control attributes are {', '.join(REMOTE_CONTROLS)}")
        attributes = {"remote": name}
        for key, value in params.items():
            attributes[key if key in REMOTE_CONTROLS else f"remote_{key}"] = value
        self.set_attr(attributes)
        return self

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
