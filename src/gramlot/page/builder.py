"""Python authoring for the Gramlot Source dialect."""

from uuid import uuid4

from genro_bag import Bag
from genro_builders.builder import SourceBag, SourceBagNode
from genro_builders.contrib.html import HtmlBuilder

from ..renderer import GramlotHtmlRenderer
from ._grammar_load import load_grammar

# Loading the Gramlot Source classes adds GramlotBuilderBag to the TYTX subtype
# dictionary of X, so every GramlotBuilder user can encode and decode it.
from .source import GramlotBuilderBag

# P19: `data` is ambiguous between the legacy data-element and the HTML5 element.
DATA_FORBIDDEN = "data is forbidden: write dataSetter for a Data value or html_data for the HTML5 <data> element"
# Declarations outside Gramlot 0.2.0 that fail explicitly (source plan, section 2).
EXCLUDED_ELEMENTS = frozenset({"dataremote"})
EXCLUDED_ATTRIBUTES = frozenset({"serverpath", "dbenv", "shared_id", "remote", "_ask", "ask"})
EXCLUDED_ATTRIBUTE_PREFIXES = ("subscribe_", "selfsubscribe_", "formsubscribe_")
# P18 and B8: the Data path of each data-element, which does not accept `?attr`,
# and its inline attribute, which excludes `func` on the same node, as `_if` does (Q11.1).
DATA_PATH_ATTRIBUTES = {"dataSetter": "destination_path", "dataFormula": "result_path", "dataRpc": "result_path"}
DATA_INLINE_ATTRIBUTES = {"dataFormula": "formula", "dataController": "script"}


def data_element_error(tag, attrs):
    """The P18 violation of a data-element's attributes, or None."""
    path_name = DATA_PATH_ATTRIBUTES.get(tag)
    if path_name is not None and "?" in str(attrs.get(path_name, "")):
        return f"'{path_name}' does not accept '?attr': {attrs[path_name]!r}"
    inline_name = DATA_INLINE_ATTRIBUTES.get(tag)
    if inline_name is not None and attrs.get(inline_name) is not None and attrs.get("func") is not None:
        return f"'func' and '{inline_name}' cannot be declared on the same node"
    if inline_name is not None and attrs.get("_if") is not None and attrs.get("func") is not None:
        return "'_if' is inline and cannot be declared with 'func': write the condition in the method"
    return None


class GramlotBuilder(HtmlBuilder):
    """Describe browser Source: authoring is inert, the static render is ``GramlotHtmlRenderer``."""

    _name = "gramlot"
    _source_class = GramlotBuilderBag
    # Builder applies it on the inherited HtmlBuilder grammar; its data-elements replace Builder's.
    _grammar_documents = ("../collections/binding.json",)

    def __init__(self, name=None, *, collections=()):
        super().__init__(name)
        self._collection = None
        for collection in collections:
            self.load_collection(collection)

    def load_grammar(self, document):
        """Load a portable grammar collection on this instance, over the class grammar."""
        return load_grammar(self, document)

    def load_collection(self, document):
        """Add a builder_grammar collection to this builder instance."""
        self.load_grammar(document)
        return self

    @property
    def dialect_prefixes(self):
        """Tag prefixes of the parent dialects, from the ``_name`` of the classes above GramlotBuilder."""
        return tuple(f"{cls.__dict__['_name']}_" for cls in GramlotBuilder.__mro__[1:] if cls.__dict__.get("_name"))

    def schema_tag(self, name):
        """Resolve an authored element name, as the JS ``schemaTag``.

        A direct name gives its schema tag. A parent-dialect prefix reaches an
        element the node API shadows (``html_label``): the prefixed name is
        returned as written and ``element_call`` resolves it.
        The prefix ``gramlot_`` and the excluded declarations are errors.
        """
        lookup = name.lower()
        if lookup.startswith(f"{GramlotBuilder._name}_"):
            raise ValueError(f"{name}: the tag prefix '{GramlotBuilder._name}_' is not accepted; "
                             f"use the prefix '{self.dialect_prefixes[0]}'")
        if lookup in EXCLUDED_ELEMENTS:
            raise ValueError(f"{name}: excluded from Gramlot 0.2.0")
        tag = self._schema_tag_names.get(lookup)
        if tag is not None:
            return tag
        for prefix in self.dialect_prefixes:
            if lookup.startswith(prefix) and lookup[len(prefix):] in self._schema_tag_names:
                return lookup
        return None

    def _authored_tag(self, tag):
        """The schema tag of a ``schema_tag`` result; ``data`` is forbidden (P19)."""
        if tag == "data":
            raise ValueError(DATA_FORBIDDEN)
        if self._schema_tag_names.get(tag.lower()) == tag:
            return tag
        prefix = next(prefix for prefix in self.dialect_prefixes if tag.startswith(prefix))
        return self._schema_tag_names[tag[len(prefix):]]

    def element_call(self, target, tag):
        """The authored element call for a ``schema_tag`` result on a Source Bag or node."""
        def call(*args, **attrs):
            actual = self._authored_tag(tag)
            if isinstance(target, SourceBag):
                return self._bag_call(target, actual)(*args, **attrs)
            return self._command_on_node(target, actual, *args, **attrs)
        return call

    @property
    def renderer_html(self):
        """The string renderer of the Gramlot Source (static render; authoring stays inert)."""
        return GramlotHtmlRenderer(builder=self)

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
        """Preserve HTML mixed text when a node gains structural children.

        The promoted ``_text`` keeps its type (a boolean stays a boolean through TYTX);
        the browser renderer converts it to text once, as the JS ``promoteNodeValue``.
        """
        if value is not None:
            return {"_text": value}
        return None

    def _validate_call_args(self, info, node_value, attr, node_tag=""):
        """Enforce required parameters declared by Gramlot's loaded grammar and the excluded attributes."""
        excluded = next((name for name in attr if name in EXCLUDED_ATTRIBUTES
                         or name.startswith(EXCLUDED_ATTRIBUTE_PREFIXES)), None)
        if excluded is not None:
            raise ValueError(f"{node_tag}: attribute '{excluded}' is excluded from Gramlot 0.2.0")
        error = data_element_error(node_tag, attr)
        if error is not None:
            raise ValueError(f"{node_tag}: {error}")
        supplied = set(attr)
        if node_value is not None:
            supplied.add("node_value")
        missing = info.get("loaded_required_names", set()) - supplied
        if missing:
            raise ValueError(f"{node_tag}: missing required attributes {sorted(missing)}")
        return super()._validate_call_args(info, node_value, attr, node_tag)

    def _add_element(self, build_where, node_value=None, node_label=None, node_tag="", **attr):
        """Builder's element insertion; a dict ``value`` of ``dataSetter`` becomes ``Bag(value)`` (P25)."""
        if node_tag == "dataSetter" and isinstance(attr.get("value"), dict):
            attr["value"] = Bag(attr["value"])
        return super()._add_element(build_where, node_value, node_label, node_tag, **attr)

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
            node.attr.setdefault("_text", original_value)
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
