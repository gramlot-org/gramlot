"""Python authoring for the Gramlot Source dialect."""

import json
from importlib.resources import files
from uuid import uuid4

from genro_builders.builder import SourceBag, SourceBagNode
from genro_builders import BuilderBase
from genro_tytx import register_class

from ._grammar_load import load_grammar

HTML5_COLLECTION = json.loads(files("gramlot").joinpath("collections/html5.json").read_text())

# Gramlot owns the SOURCE wire registration for its typed transport contract.
# Register the existing Builder SourceBag class (constitution amendment 11.16).
SourceBag.__tytx_suffix__ = "SOURCE"
register_class(SourceBag)


class GramlotBuilder(BuilderBase):
    """Describe browser Source without rendering or evaluating it in Python."""

    _name = "gramlot"

    def __init__(self, name=None, *, collections=()):
        super().__init__(name)
        self._collection = None
        self.load_grammar(HTML5_COLLECTION, replace=True)
        for collection in collections:
            self.load_collection(collection)

    def load_grammar(self, document, *, replace=False):
        """Load Gramlot's portable authoring grammar on this instance."""
        return load_grammar(self, document, replace=replace)

    def load_collection(self, document):
        """Add a builder_grammar collection to this builder instance."""
        self.load_grammar(document)
        return self

    @property
    def root(self):
        """The actual document SourceBag used by page authoring."""
        return self.source

    def create(self):
        """Run authoring hooks only; browser declarations remain inert."""
        self.setup(self.data)
        self.main(self.root)

    def compute_logic(self, nodes):
        """The browser owns declarative logic execution."""

    def _promote_child_content(self, node, value):
        """Preserve HTML mixed text when a node gains structural children."""
        if value is not None:
            return {"_text": str(value)}
        return None

    def _validate_call_args(self, info, node_value, attr, node_tag=""):
        """Enforce required parameters declared by Gramlot's loaded grammar."""
        supplied = set(attr)
        if node_value is not None:
            supplied.add("node_value")
        missing = info.get("loaded_required_names", set()) - supplied
        if missing:
            raise ValueError(f"{node_tag}: missing required attributes {sorted(missing)}")
        return super()._validate_call_args(info, node_value, attr, node_tag)

    def _command_on_node(self, node, child_tag, *args, **attrs):
        """Keep a scalar parent intact if insertion fails; retain mixed text."""
        original_value = node.value
        original_attrs = dict(node.attr)
        try:
            child = super()._command_on_node(node, child_tag, *args, **attrs)
        except Exception:
            node.value = original_value
            node.attr.clear()
            node.attr.update(original_attrs)
            raise
        if original_value is not None and not isinstance(original_value, SourceBag):
            node.attr.setdefault("_text", str(original_value))
        return child

    def reference(self, node, kind="node"):
        """Create a transportable reference to an existing Source node."""
        if not isinstance(node, SourceBagNode) or kind not in ("node", "dom"):
            raise ValueError("References require an element and kind 'node' or 'dom'")
        ref = node.attr.get("__ref")
        if ref is None:
            ref = uuid4().hex
            node.set_attr({"__ref": ref})
        return {"$gramlotRef": ref, "kind": kind}
