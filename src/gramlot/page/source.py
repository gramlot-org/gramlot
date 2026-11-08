"""Gramlot Source classes, symmetric with ``js/src/builder/source.js``.

Python keeps authoring checks and authorization filtering. Builder owns pointer
classification and static suffix resolution; browser-only Source members such as
PUT, FIRE, FIRE_AFTER, variable datapath and ``requests`` (NodeRequests) remain in
the JavaScript classes.
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
REMOTE_CONTROLS = ("_cachedRemote", "_if", "_else", "_onRemote", "_onCalling", "_delay", "_timing", "_userChanges")
# Source attributes of the symbolic resolution, never rendered: the metadata of a node like ``_anchor``.
SYMBOLIC_ATTRIBUTES = frozenset({"_workspace", "_workspace_path", "childname"})


def string_hash(text):
    """The legacy ``stringHash`` of a text: 32-bit ``h * 31 + code`` over its UTF-16 units, as a positive number."""
    data = text.encode("utf-16-le")
    value = 0
    for index in range(0, len(data), 2):
        value = (((value << 5) - value) + (data[index] | data[index + 1] << 8)) & 0xFFFFFFFF
    return abs(value - 0x100000000 if value >= 0x80000000 else value)


def _named_child(bag, name):
    """The nearest node of ``bag`` whose ``childname`` is ``name``: direct children first, then unnamed children's descendants."""
    for node in bag:
        if node.attr.get("childname") == name:
            return node
    for node in bag:
        if node.attr.get("childname") is None and isinstance(node.static_value, SourceBag):
            found = _named_child(node.static_value, name)
            if found is not None:
                return found
    return None


class GramlotBuilderBagNode(SourceBagNode):
    """Source node of a Gramlot document."""

    def runtime_to_evaluate(self):
        items = super().runtime_to_evaluate()
        for name, raw in items.items():
            if pointer_transform(raw):
                if name is None:
                    raise ValueError("Pointer suffixes belong to attributes; use format/mask for node text")
        return items

    def abs_datapath(self, path: str, row: str | None = None) -> str:
        """Builder's ``abs_datapath`` with the legacy symbols; ``row`` is the row context of ``#ROW``.

        ``row`` is the key (label) of the row inside the collection at the ``storepath`` of the nearest
        node that declares one; any other path ignores it. ``#ROW`` without a row context is an error.
        """
        bare = path
        if self.pointer_type(path):
            transform = pointer_transform(path)
            bare = (transform[0] if transform else path)[1:]
        if bare == "#ROW" or bare.startswith(("#ROW.", "#ROW?")):
            return self._row_datapath(bare, row, path)
        return super().abs_datapath(path)

    def _compose_relative_datapath(self, path: str, raw: str) -> str:
        """Builder's datapath climb; a datapath that makes the path symbolic is resolved from the parent of its node."""
        current = self
        while current is not None and path.startswith("."):
            datapath = current.attr.get("datapath")
            if datapath is not None:
                path = datapath if path == "." else datapath + path
            if path.startswith("#"):
                return current.parent_node._resolve_symbolic_datapath(path, raw)
            current = current.parent_node
        if path.startswith("."):
            raise ValueError(f"unresolved relative datapath: {raw!r}")
        return path

    def _resolve_symbolic_datapath(self, path: str, raw: str) -> str:
        """Symbolic resolution of ``#<head>[.relpath]``, in the legacy order: ``#ROW``, ``#WORKSPACE``,
        ``#DATA``, then a start node (``#FORM``, ``#ANCHOR``, ``#<nodeId>``, ``#/<childpath>``, each with an
        optional ``/<childpath>``), from which ``relpath`` is resolved relatively."""
        head, _, relpath = path[1:].partition(".")
        if head == "ROW":
            raise KeyError(f"#ROW: no row context for {raw}")
        if head == "WORKSPACE":
            base = self._workspace_datapath(raw)
            return f"{base}.{relpath}" if relpath else base
        if head == "DATA":
            if not relpath:
                raise KeyError(f"#DATA requires a path: {raw}")
            return relpath
        return self._symbolic_node(head, raw).abs_datapath(f".{relpath}" if relpath else ".")

    def get_child(self, childpath: str) -> "GramlotBuilderBagNode | None":
        """The node reached by a child path from this node, as legacy ``getChild``.

        The segments are separated by ``/``: ``parent`` moves to the parent node, ``#<nodeId>`` (also
        ``#FORM``, ``#ANCHOR``) to the node of that symbol seen from the current node, any other segment
        to the nearest descendant whose ``childname`` is the segment (direct children first; a named node
        hides its descendants). None when a step finds no node.
        """
        node = self
        for segment in childpath.split("/"):
            if segment == "parent":
                node = node.parent_node
            elif segment.startswith("#"):
                node = node._symbolic_node(segment[1:], childpath)
            else:
                value = node.static_value
                node = _named_child(value, segment) if isinstance(value, SourceBag) else None
            if node is None:
                return None
        return node

    @property
    def workspace_name(self) -> str:
        """The name of the private Data area of this node: the ``_workspace`` string value, or for ``True``
        the nodeId, else the tag followed by a hash of the node's Source path, as legacy. A node that
        declares no ``_workspace`` has the name it would have with ``_workspace=True``."""
        value = self.attr.get("_workspace")
        if value is None:
            value = True
        if value is True:
            node_id = self.attr.get("nodeId")
            return node_id if node_id is not None else f"{self.node_tag}_{string_hash(self.fullpath)}"
        if isinstance(value, str) and value:
            return value
        raise TypeError(f"{self.node_tag} '{self.label}': _workspace must be true or a name, not {value!r}")

    @property
    def workspace_datapath(self) -> str:
        """The private Data area of this node, as ``#WORKSPACE`` sees it from the node that owns it:
        ``_workspace_path`` resolved from this node, else ``_gramlot.workspace.<workspace_name>``. A component
        keeps its private states under the area of its own node, addressed by path."""
        explicit = self.attr.get("_workspace_path")
        return f"_gramlot.workspace.{self.workspace_name}" if explicit is None else self.abs_datapath(explicit)

    def _workspace_datapath(self, raw: str) -> str:
        """``#WORKSPACE``: the private Data area of the nearest node with ``_workspace``."""
        owner = self.attribute_owner_node("_workspace")
        if owner is None:
            raise KeyError(f"#WORKSPACE: no ancestor with _workspace for {raw}")
        return owner.workspace_datapath

    def row_field(self, path: str) -> tuple[str, str] | None:
        """The inverse of ``#ROW.<field>``: ``(row, field)`` when the absolute Data path ``path`` is a direct
        field of a row of the collection at the ``storepath`` of the nearest node that declares one, as
        ``#ROW.<field>`` gives it for that row key and ``rowMode``; None for any other path."""
        owner = self.attribute_owner_node("storepath")
        if owner is None:
            raise KeyError(f"#ROW: no ancestor with storepath for {path}")
        prefix = f"{owner.abs_datapath(owner.attr['storepath'])}."
        match = re.fullmatch(r"([^.?]+)[.?]([^.?]+)", path[len(prefix):]) if path.startswith(prefix) else None
        if match is None:
            return None
        row, field = match.groups()
        return (row, field) if self.abs_datapath(f"#ROW.{field}", row=row) == path else None

    def _row_datapath(self, bare: str, row: str | None, raw: str) -> str:
        """``#ROW[.field][?attr]`` for the row ``row`` of the nearest node with ``storepath``, following its ``rowMode``."""
        if row is None:
            raise KeyError(f"#ROW: no row context for {raw}")
        owner = self.attribute_owner_node("storepath")
        if owner is None:
            raise KeyError(f"#ROW: no ancestor with storepath for {raw}")
        mode = owner.attr.get("rowMode")
        if mode not in ("values", "attributes"):
            raise ValueError(f"#ROW: rowMode must be 'values' or 'attributes' for {raw}")
        rowpath = f"{owner.abs_datapath(owner.attr['storepath'])}.{row}"
        rest, separator, attr = bare[len("#ROW"):].partition("?")
        if mode == "attributes" and rest:
            field = rest[1:]
            if "." in field or separator:
                raise ValueError(f"#ROW: a row in rowMode 'attributes' has only attribute fields: {raw}")
            return f"{rowpath}?{field}"
        return f"{rowpath}{rest}{'?' + attr if separator else ''}"

    def _symbolic_node(self, head: str, raw: str) -> "GramlotBuilderBagNode":
        """The start node of a symbolic head, as legacy ``nodeById``: ``/<childpath>`` from the nearest
        ancestor with a nodeId, through the ``childname`` of the nodes in between; otherwise
        ``<symbol>[/<childpath>]`` where the symbol is ``FORM``, ``ANCHOR`` or a nodeId of the page."""
        if head.startswith("/"):
            childpath = head[1:]
            node = self
            while node is not None and node.attr.get("nodeId") is None:
                if node.attr.get("childname") is not None:
                    childpath = f"{node.attr['childname']}/{childpath}"
                node = node.parent_node
            if node is None:
                raise KeyError(f"#/: no ancestor with a nodeId for {raw}")
        else:
            symbol, _, childpath = head.partition("/")
            if symbol == "FORM":
                node = self._find_marked_datapath_ancestor(form=True, anchor=False, raw=raw)
            elif symbol == "ANCHOR":
                node = self._find_marked_datapath_ancestor(form=False, anchor=True, raw=raw)
            else:
                builder = self._resolve_builder()
                if builder is None:
                    raise KeyError(f"#<id>: cannot resolve {raw} on a node without builder")
                node = builder.source.get_node_by_attr("nodeId", symbol)
                if node is None:
                    raise KeyError(f"#<id>: cannot resolve {raw}")
        if not childpath:
            return node
        child = node.get_child(childpath)
        if child is None:
            raise KeyError(f"#<id>: no child '{childpath}' for {raw}")
        return child

    def remote(self, name: str, /, **params: Any) -> "GramlotBuilderBagNode":
        """Declare the content of this element as the fragment ``name`` of a ``@source`` method.

        Writes ``remote = name`` and one ``remote_<k> = v`` per call parameter on this node;
        the control attributes ``_cachedRemote``, ``_if``, ``_else``, ``_onRemote``, ``_onCalling``,
        ``_delay``, ``_timing`` and ``_userChanges`` are written as they are. Returns this node.
        ``name`` is a method name, matched by the name syntax of the page builder (``name_syntax`` of
        ``root_builder``), or a ``^``/``=`` pointer to it; any other name, or another ``_`` parameter, is a
        ``ValueError``.
        """
        syntax = self.root_builder.name_syntax
        if not isinstance(name, str) or not (self.pointer_type(name) or syntax.matches(name)):
            raise ValueError(f"{self.node_tag} '{self.label}': remote name must be a pointer or match "
                             f"{syntax.pattern}, not {name!r}")
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
        if self.node_tag in ("dialog", "floatingPane") and name == "frame":
            children = list(self.static_value) if isinstance(self.static_value, SourceBag) else []
            if children:
                if len(children) != 1 or children[0].node_tag != "framePane":
                    raise ValueError("A window requires exactly one framePane")
                return children[0]
            return self._resolve_builder().element_call(self, "framePane")(node_label="frame")
        if self.node_tag == "framePane" and name == "toolbar":
            bar = self.static_value.get_node("top.bar") if isinstance(self.static_value, SourceBag) else None
            if bar is None or bar.node_tag != "menu":
                raise AttributeError("This frame has no toolbar")
            return bar
        if self.node_tag == "framePane" and name == "grid":
            grid = self.static_value.get_node("center.grid") if isinstance(self.static_value, SourceBag) else None
            if grid is None or grid.node_tag != "grid":
                raise AttributeError("This frame has no central grid")
            return grid
        if self.node_tag == "framePane" and name in ("top", "bottom", "left", "right", "center"):
            children = self.static_value
            if isinstance(children, SourceBag):
                existing = next((child for child in children if child.attr.get("region") == name), None)
                if existing is not None:
                    return existing
            attrs = {"region": name, "node_label": name}
            if name != "center":
                attrs.update(display="flex", flex_direction="column" if name in ("top", "bottom") else "row")
            return self._resolve_builder().element_call(self, "contentPane")(**attrs)
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
