"""Python authoring for the Gramlot Source dialect."""

import re
from uuid import uuid4

from genro_bag import Bag
from genro_builders.builder import SourceBag, SourceBagNode, container
from genro_builders.contrib.html import HtmlBuilder
from genro_tytx import to_tytx

from ..renderer import GramlotHtmlRenderer
from ..webcomponent import webcomponent_code
from ._grammar_load import load_grammar
from genro_builders.builder.pointers import pointer_transform

# Loading the Gramlot Source classes adds GramlotBuilderBag to the TYTX subtype
# dictionary of X, so every GramlotBuilder user can encode and decode it.
from .name_syntax import NAME_SYNTAX, NameSyntax
from .source import GramlotBuilderBag

# P19: `data` is ambiguous between the legacy data-element and the HTML5 element.
DATA_FORBIDDEN = "data is forbidden: write dataSetter for a Data value or html_data for the HTML5 <data> element"
# Declarations that Gramlot does not accept and that fail explicitly (source plan, section 2).
EXCLUDED_ELEMENTS = frozenset()
EXCLUDED_ATTRIBUTES = frozenset({"serverpath", "dbenv", "shared_id"})
EXCLUDED_ATTRIBUTE_PREFIXES = ("formsubscribe_",)
# P18 and B8: the Data path of each data-element, which does not accept `?attr`,
# and its inline attribute, which excludes `func` on the same node, as `_if` does (Q11.1).
DATA_PATH_ATTRIBUTES = {"dataSetter": "destination_path", "dataFormula": "result_path", "dataRpc": "result_path",
                        "dataRemote": "destination_path"}
DATA_INLINE_ATTRIBUTES = {"dataFormula": "formula", "dataController": "script"}


# Builder's framework call keywords, accepted by every element.
FRAMEWORK_ATTRIBUTES = frozenset({"node_label", "node_position", "nodeId", "target_id", "datapath",
                                  "iterate", "store", "_tag", "_meta", "ns"})
# Source meta attributes of every node (Builder JS META_ATTRS).
META_ATTRIBUTES = frozenset({"_meta", "datapath", "nodeId", "ns", "form", "formId", "_anchor", "updateOn"})
# Export formats of the grid:export command, in menu order, with their captions.
EXPORT_FORMATS = {"csv": "CSV", "json": "JSON", "tytx": "TYTX", "xml": "XML", "xlsx": "Excel"}
# frameGrid composes these grid attributes itself; its own parameters reach the grid too.
FRAME_GRID_COMPOSED = frozenset({"node_label", "frameTarget", "nodeId"})
FRAME_GRID_PARAMETERS = frozenset({"storepath", "rowMode", "structpath"})


def keyword_pattern_error(info, attrs):
    """An element with `_meta.keywordPattern` accepts only its declared attributes and matching keywords."""
    pattern = ((info.get("_meta") or {}).get("keywordPattern"))
    if not pattern:
        return None
    declared = info.get("declared_names", set())
    unknown = next((name for name in attrs if name not in declared and name not in FRAMEWORK_ATTRIBUTES
                    and not re.search(pattern, name)), None)
    return None if unknown is None else f"unknown attribute '{unknown}'"


def data_element_error(tag, attrs):
    """The P18 violation of a data-element's attributes, or None."""
    if tag in ("input", "textarea", "select", "webcomponent") and pointer_transform(attrs.get("value")):
        return "'value' does not accept pointer suffixes; use an ordinary value pointer"
    if tag == "html_button" and any(
            name in ("action", "ask", "_delay", "fire") or name.startswith("fire_") for name in attrs):
        return "plain HTML button: use button for action, ask, fire or _delay"
    if "ask" in attrs and tag not in ("button", "toggleButton", "dropDownButton", "menuline"):
        return "'ask' is supported on buttons"
    if "_ask" in attrs and tag not in ("dataController", "dataFormula", "dataRpc"):
        return "'_ask' requires a controller, formula or RPC"
    if tag in ("dataSetter", "dataRemote") and any(
            name.startswith(("subscribe_", "selfsubscribe_")) for name in attrs):
        return "topic subscriptions are supported on controllers, formulas, RPCs and rendered elements"
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
    _grammar_documents = ("../collections/binding.json", "../collections/webcomponent.json", "../collections/buttons.json")

    def __init__(self, name=None, *, collections=(), auth=None, name_syntax=NAME_SYNTAX):
        if not isinstance(name_syntax, NameSyntax):
            raise TypeError(f"name_syntax must be a NameSyntax, not {name_syntax!r}")
        super().__init__(name)
        self._binding_runtime = None
        self._collection = None
        self._auth = auth
        self._name_syntax = name_syntax
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
            raise ValueError(f"{name}: excluded from Gramlot")
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

    @container
    def frameGrid(self, parent, *, storepath, rowMode, structpath=None, searchOn=False, searchHelp=False, chart=False,
                  export=False, printRows=False, advancedTools=False, addrow=False, addrow_defaults=None,
                  duprow=False, delrow=False, gridsemaphore=False, **attrs):
        """Compose a real framePane with one central, command-target grid."""
        for tag in ("framePane", "grid"):
            if self.schema_tag(tag) is None:
                raise ValueError(f"frameGrid requires the {tag} collection")
        chart_options = {key[6:]: attrs.pop(key) for key in list(attrs) if key.startswith("chart_")}
        attrs, routed = self._frame_grid_route(attrs)
        given = {"storepath", "rowMode"} | ({"structpath"} if structpath is not None else set())
        twice = next((name for name in routed if name in given), None)
        if twice is not None:
            raise ValueError(f"frameGrid: '{twice}' is given twice")
        if chart is not False:
            if chart is not True and (not isinstance(chart, str) or not chart):
                raise ValueError("chart requires a boolean or chart type")
            if not attrs.get("datapath"):
                raise ValueError("A chart frameGrid requires its own datapath")
            if self.schema_tag("chartPane") is None:
                raise ValueError("frameGrid requires the chartPane collection")
            if isinstance(chart, str):
                chart_options["chartType"] = chart
        elif chart_options:
            raise ValueError("chart_* options require chart")
        export_formats = self._frame_grid_export_formats(export)
        for name, value in (("printRows", printRows), ("advancedTools", advancedTools),
                            ("addrow", addrow), ("duprow", duprow), ("delrow", delrow), ("gridsemaphore", gridsemaphore)):
            if type(value) is not bool:
                raise ValueError(f"frameGrid {name} requires a boolean")
        if addrow_defaults is not None and (not addrow or type(addrow_defaults) is not dict):
            raise ValueError("addrow_defaults requires addrow and a mapping")
        if gridsemaphore:
            if not attrs.get("datapath"):
                raise ValueError("A gridsemaphore frameGrid requires its own datapath")
            if self.schema_tag("editingStatus") is None:
                raise ValueError("frameGrid requires the editingStatus collection")
            attrs["form"] = True
        # Legacy frameGrid default: the current row identity at .selectedId of the frame's own datapath.
        selected = {"selectedId": "^.selectedId"} if attrs.get("datapath") else {}
        grid_attrs = {**dict(storepath=storepath, rowMode=rowMode, node_label="grid",
                             frameTarget=True, height="100%", width="100%"), **selected, **routed}
        if chart is not False:
            grid_attrs["nodeId"] = uuid4().hex
        if structpath is not None:
            grid_attrs["structpath"] = structpath
        self._validate_call_args(self._get_schema_info("grid"), None, grid_attrs, "grid")
        if searchOn is not False:
            self._validate_call_args(self._get_schema_info("searchBox"), None, dict(searchOn=searchOn, searchHelp=searchHelp), "searchBox")
        frame = parent.framePane(**attrs)
        frame.center.grid(**grid_attrs)
        bar = frame.top.menu(presentation="bar", node_label="bar", aria_label="Grid toolbar",
                             **{"class": "gramlot-grid-toolbar"})
        if searchOn is not False:
            bar.menuline(group=True, node_label="search", **{"class": "gramlot-grid-search"}).searchBox(searchOn=searchOn, searchHelp=searchHelp)
        if addrow:
            bar.menuline(command="grid:addrow", node_label="addrow",
                         **({"parameters": {"defaults": addrow_defaults}} if addrow_defaults is not None else {}))
        if duprow:
            bar.menuline(command="grid:duprow", node_label="duprow")
        if delrow:
            bar.menuline(command="grid:delrow", node_label="delrow")
        def export_menu(parent):
            menu = parent.menuline(caption="Export", icon="⇩", labelPosition="tooltip", node_label="export").menu()
            for name in export_formats:
                menu.menuline(command="grid:export", caption=EXPORT_FORMATS[name], parameters={"format": name}, node_label=name)
        if export_formats:
            export_menu(bar)
        if printRows:
            bar.menuline(command="grid:printRows", node_label="printRows")
        if advancedTools:
            tools = bar.menuline(caption="Advanced tools", icon="…", labelPosition="tooltip", node_label="advancedTools").menu()
            tools.menuline(command="grid:lineNumbers", node_label="lineNumbers")
            if export_formats:
                export_menu(tools)
            if printRows:
                tools.menuline(command="grid:printRows", node_label="printRows")
        if gridsemaphore:
            bar.menuline(group=True, node_label="semaphore").editingStatus()
        if chart is not False:
            bar.menuline(caption="Chart", icon="▥", labelPosition="tooltip", node_label="chart", action="this.SET('._chart.open',true)")
            window = frame.center.floatingPane(title="Chart", open="^._chart.open", width="820px", height="560px",
                                        movable=True, resizable=True, maximizable=True, node_label="chartWindow")
            window.frame.center.chartPane(storepath=storepath, rowMode=rowMode, gridId=grid_attrs["nodeId"],
                                          configpath="._chart", configDefaults=Bag(chart_options), height="100%")
        return frame

    @staticmethod
    def _frame_grid_export_formats(export):
        """``export``: True for every format, False for none, or a comma-separated list such as ``"csv,json"``."""
        if type(export) is bool:
            return list(EXPORT_FORMATS) if export else []
        if type(export) is not str or not export.strip():
            raise ValueError("frameGrid export requires a boolean or a list of formats")
        formats = [item.strip() for item in export.split(",")]
        unknown = next((item for item in formats if item not in EXPORT_FORMATS), None)
        if unknown is not None:
            raise ValueError(f"frameGrid export format '{unknown}' is not one of {', '.join(EXPORT_FORMATS)}")
        return formats

    def _frame_grid_route(self, attrs):
        """Split frameGrid keywords: unprefixed grid parameters go to the grid, ``grid_``/``frame_`` force any attribute."""
        declared = lambda tag: set(self._get_schema_info(tag).get("declared_names", set()))
        source = FRAMEWORK_ATTRIBUTES | META_ATTRIBUTES
        # A name the frame also accepts stays on the frame unless forced with grid_.
        routed_names = declared("grid") - declared("framePane") - source - FRAME_GRID_COMPOSED - FRAME_GRID_PARAMETERS
        pattern = self._get_schema_info("grid")["_meta"]["parameterPattern"]
        excluded = declared("framePane") | source
        frame, grid = {}, {}
        for key, value in attrs.items():
            if key.startswith("grid_"):
                name, target = key[len("grid_"):], grid
                if name in FRAME_GRID_COMPOSED:
                    raise ValueError(f"frameGrid: '{key}' is composed by frameGrid")
            elif key.startswith("frame_"):
                name, target = key[len("frame_"):], frame
            else:
                by_pattern = re.search(pattern, key) is not None and key not in excluded
                name, target = key, grid if key in routed_names or by_pattern else frame
            if name in target:
                raise ValueError(f"frameGrid: '{name}' is given twice")
            target[name] = value
        return frame, grid

    @property
    def renderer_html(self):
        """The string renderer of the Gramlot Source (static render; authoring stays inert)."""
        return GramlotHtmlRenderer(builder=self)

    @property
    def auth(self):
        """The ``auth`` evaluator, ``rule -> None | "not_authenticated" | "not_authorized"``,
        or None: without it every element is serialised."""
        return self._auth

    @property
    def name_syntax(self):
        """The ``NameSyntax`` of the method names of ``remote``: the one of the server that built this
        builder (``GramlotServer.name_syntax``), the core default ``NAME_SYNTAX`` otherwise."""
        return self._name_syntax

    def to_tytx(self):
        """The Source encoded as TYTX text, as the JS ``toTytx``. With an ``auth``
        evaluator, the elements whose ``auth`` rule it refuses are left out
        (``GramlotBuilderBag.authorized_copy``)."""
        return to_tytx(self.source if self.auth is None else self.source.authorized_copy(self.auth))

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

    def _start_reactivity(self, logic):
        """Activate this builder's server recipe explicitly, only for PageStore."""
        from .binding_runtime import BindingRuntime
        if self._binding_runtime is not None:
            raise RuntimeError("The server recipe is already active")
        runtime = self._binding_runtime = BindingRuntime(self, logic)
        try:
            runtime.start()
        except BaseException:
            self._stop_reactivity()
            raise

    def _stop_reactivity(self):
        """Release a PageStore recipe; ordinary browser Source has no runtime."""
        runtime = self._binding_runtime
        if runtime is not None:
            runtime.close()
            self._binding_runtime = None

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
        if (info.get("_meta", {}) or {}).get("gramlot_component"):
            if pointer_transform(attr.get("value")):
                raise ValueError("'value' does not accept pointer suffixes")
        if node_tag == "webcomponent":
            webcomponent_code(attr)
        excluded = next((name for name in attr if name in EXCLUDED_ATTRIBUTES
                         or name.startswith(EXCLUDED_ATTRIBUTE_PREFIXES)), None)
        if excluded is not None:
            raise ValueError(f"{node_tag}: attribute '{excluded}' is excluded from Gramlot")
        error = data_element_error(node_tag, attr) or keyword_pattern_error(info, attr)
        if error is not None:
            raise ValueError(f"{node_tag}: {error}")
        supplied = set(attr)
        if node_value is not None:
            supplied.add("node_value")
        missing = info.get("loaded_required_names", set()) - supplied
        if missing:
            raise ValueError(f"{node_tag}: missing required attributes {sorted(missing)}")
        return super()._validate_call_args(info, node_value, attr, node_tag)

    def _validate_children_tags(self, node_tag, sub_tags_compiled, children_tags):
        """Both button declarations occupy the native button slot in HTML content models."""
        return super()._validate_children_tags(node_tag, sub_tags_compiled,
                                              ["button" if tag == "html_button" else "dialog" if tag == "html_dialog" else tag for tag in children_tags])

    def custom_require_sub_tag_validation(self, node):
        """Custom elements are outside the native HTML child catalogue, as components are."""
        return node.node_tag == "button" or (node.node_tag != "webcomponent" and not node._get_meta("gramlot_component"))

    def _add_element(self, build_where, node_value=None, node_label=None, node_tag="", **attr):
        """Builder's element insertion; a dict ``value`` of ``dataSetter`` becomes ``Bag(value)`` (P25)."""
        if node_tag == "menu" and node_value is None:
            node_value = GramlotBuilderBag(builder=self)
        if node_tag == "menuline" and node_value is not None and node_value != "-":
            if "command" in attr:
                raise ValueError("menuline command must be declared once")
            attr["command"] = node_value
            node_value = None
        attr = {key: self.reference(value) if isinstance(value, SourceBagNode) else value
                for key, value in attr.items()}
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
