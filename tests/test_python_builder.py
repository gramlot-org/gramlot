import tempfile
import unittest
import json
from pathlib import Path

from genro_bag import Bag
from genro_builders.builder import SourceBag, SourceBagNode
from genro_builders import BuilderBase
from genro_tytx import from_tytx, get_subtype_dict, to_tytx

from gramlot import GramlotBuilder
from gramlot.page.source import GramlotBuilderBag, GramlotBuilderBagNode
from gramlot.server import GramlotFileServer, InvalidRequest

CONTROLS = json.loads(
    (Path(__file__).parent / "fixtures/collections/controls.json").read_text()
)


class BuilderTests(unittest.TestCase):
    def test_generic_builder_backing_and_typed_wire(self):
        builder = GramlotBuilder("test")
        self.assertIsInstance(builder, BuilderBase)
        self.assertIn("canvas", builder)
        self.assertIsInstance(builder.source, SourceBag)
        self.assertIs(builder.root, builder.source)
        panel = builder.root.div("before", id="panel")
        child = panel.span("after")
        builder.reference(child, "dom")

        wire = from_tytx(to_tytx(builder.source))
        node = wire.nodes[0]
        self.assertEqual(node.label, builder.source.nodes[0].label)
        self.assertEqual(node.node_tag, "div")
        self.assertEqual(node.attr["_text"], "before")
        self.assertEqual(node.value.nodes[0].node_tag, "span")
        self.assertEqual(node.value.nodes[0].value, "after")
        self.assertIn("__ref", node.value.nodes[0].attr)

    def test_recipe_is_outside_the_active_grammar(self):
        builder = GramlotBuilder()
        with self.assertRaises(AttributeError):
            builder.root.recipe("cards.person")

    def test_data_rpc_builds_with_result_path_and_data_remote_stays_excluded(self):
        builder = GramlotBuilder()
        builder.root.dataRpc(method="m", result_path="x", timeout=500, value="^v")
        node = builder.source.nodes[0]
        self.assertEqual(node.node_tag, "dataRpc")
        self.assertEqual((node.attr["method"], node.attr["result_path"], node.attr["timeout"], node.attr["value"]),
                         ("m", "x", 500, "^v"))
        with self.assertRaisesRegex(ValueError, r"dataRpc: 'result_path' does not accept '\?attr'"):
            builder.root.dataRpc(method="m", result_path="x?a")
        with self.assertRaisesRegex(ValueError, r"dataRemote: excluded from Gramlot 0\.2\.0"):
            builder.root.dataRemote(method="m")

    def test_create_does_not_compute_browser_logic(self):
        class PageBuilder(GramlotBuilder):
            def __init__(self):
                self.computed = False
                super().__init__()

            def main(self, root):
                root.div("safe")

            def compute_logic(self, nodes):
                self.computed = True

        builder = PageBuilder()
        builder.create()
        self.assertFalse(builder.computed)
        self.assertEqual(builder.source.nodes[0].value, "safe")

    def test_rejected_child_does_not_change_scalar_parent(self):
        builder = GramlotBuilder()
        parent = builder.root.br("fallback")
        original_value = parent.value
        original_attrs = dict(parent.attr)
        with self.assertRaises(ValueError):
            parent.span("invalid")
        self.assertEqual(parent.value, original_value)
        self.assertEqual(parent.attr, original_attrs)

    def test_rejected_attribute_does_not_promote_scalar_parent(self):
        builder = GramlotBuilder(collections=[CONTROLS])
        parent = builder.root.ratingPanel("fallback", title="Ratings")
        with self.assertRaises(ValueError):
            parent.rating(amount=11, code="IT")
        self.assertEqual(parent.value, "fallback")
        self.assertNotIn("_text", parent.attr)

    def test_promoted_text_keeps_its_type(self):
        """Phase 18 (ASTRA-07): no str(); the browser renderer converts the value once, as in JS."""
        builder = GramlotBuilder()
        for value in (True, False, 1.5, "text"):
            builder.root.p(value).span("child")
        self.assertEqual([node.attr["_text"] for node in builder.root], [True, False, 1.5, "text"])
        self.assertEqual([type(node.attr["_text"]) for node in builder.root], [bool, bool, float, str])
        self.assertIn("<p>true<span>child</span></p>", builder.render())


class GramlotSourceClassTests(unittest.TestCase):
    def test_counterparts_use_the_builder_node_class_hook(self):
        self.assertTrue(issubclass(GramlotBuilderBag, SourceBag))
        self.assertTrue(issubclass(GramlotBuilderBagNode, SourceBagNode))
        self.assertIs(GramlotBuilderBag._node_class, GramlotBuilderBagNode)
        own = {cls: {name for name in vars(cls) if not name.startswith("__")}
               for cls in (GramlotBuilderBag, GramlotBuilderBagNode)}
        self.assertEqual(own[GramlotBuilderBagNode], {"pointer_type"})
        self.assertEqual(own[GramlotBuilderBag], {"_node_class"})

    def test_a_double_equals_value_is_not_a_pointer(self):
        builder = GramlotBuilder()
        builder.data["x"] = "X"
        builder.data["y"] = "Y"
        node = builder.root.div(title="==1+1", alt="^x", lang="=y")
        self.assertIs(type(node), GramlotBuilderBagNode)
        self.assertIsNone(node.pointer_type("==1+1"))
        self.assertEqual(node.pointer_type("^x"), "^")
        self.assertEqual(node.pointer_type("=y"), "=")
        self.assertEqual(node.pointers(), [("alt", "^x")])
        self.assertEqual(builder.runtime_values(node), (None, {"title": "==1+1", "alt": "X", "lang": "Y"}))

    def test_authoring_on_a_gramlot_bag_propagates_the_classes_to_branches(self):
        builder = GramlotBuilder()
        branch = GramlotBuilderBag(builder=builder)
        panel = branch.div("before", id="panel")
        child = panel.span("after")
        self.assertIsInstance(panel, GramlotBuilderBagNode)
        self.assertIs(type(panel.value), GramlotBuilderBag)
        self.assertIsInstance(child, GramlotBuilderBagNode)
        self.assertEqual(panel.attr["_text"], "before")

    def test_bag_classes_share_the_subtype_dictionary_of_x_under_their_class_names(self):
        subtypes = get_subtype_dict("X")
        self.assertEqual(GramlotBuilderBag.__tytx_suffix__, "X")
        self.assertIs(subtypes["Bag"], Bag)
        self.assertIs(subtypes["SourceBag"], SourceBag)
        self.assertIs(subtypes["GramlotBuilderBag"], GramlotBuilderBag)

    def test_gramlot_source_travels_as_x_with_cls_and_decodes_to_gramlot_classes(self):
        builder = GramlotBuilder()
        root = GramlotBuilderBag(builder=builder)
        root.div(id="panel").span("after")
        wire = to_tytx(root)
        self.assertTrue(wire.endswith("::X"))
        payload = json.loads(wire[: -len("::X")])
        self.assertEqual(payload["__cls"], "GramlotBuilderBag")
        self.assertFalse(any("__cls" in row[4] for row in payload["rows"]))
        decoded = from_tytx(wire)
        panel = decoded.nodes[0]
        self.assertIs(type(decoded), GramlotBuilderBag)
        self.assertIs(type(panel), GramlotBuilderBagNode)
        self.assertIs(type(panel.value), GramlotBuilderBag)
        self.assertIs(type(panel.value.nodes[0]), GramlotBuilderBagNode)
        self.assertNotIn("__cls", panel.attr)
        holder = SourceBag()
        holder["branch"] = GramlotBuilderBag()
        wire = to_tytx(holder)
        self.assertEqual(json.loads(wire[: -len("::X")])["rows"][0][4]["__cls"], "GramlotBuilderBag")
        self.assertIs(type(from_tytx(wire)["branch"]), GramlotBuilderBag)

    def test_gramlot_builder_authoring_produces_gramlot_classes(self):
        self.assertIs(GramlotBuilder._source_class, GramlotBuilderBag)
        builder = GramlotBuilder()
        self.assertIs(type(builder._sourceroot), GramlotBuilderBag)
        self.assertIs(type(builder.source), GramlotBuilderBag)
        panel = builder.root.div(id="panel")
        panel.div("x").span("y")
        self.assertIs(type(panel), GramlotBuilderBagNode)
        self.assertIs(type(panel.value), GramlotBuilderBag)
        inner = panel.value.nodes[0]
        self.assertIs(type(inner), GramlotBuilderBagNode)
        self.assertEqual(inner.attr["_text"], "x")
        self.assertIs(type(inner.value), GramlotBuilderBag)
        self.assertIs(type(inner.value.nodes[0]), GramlotBuilderBagNode)
        payload = json.loads(to_tytx(builder.source)[: -len("::X")])
        self.assertEqual(payload["__cls"], "GramlotBuilderBag")
        self.assertFalse(any("__cls" in row[4] for row in payload["rows"]))


class LegacyTransportProbeTests(unittest.TestCase):
    def test_value_attribute_roundtrip_keeps_bag_scalar_and_array(self):
        builder = GramlotBuilder()
        bag = Bag()
        bag["a"] = 1
        bag["b.c"] = "x"
        for destination_path, value in ((".bag", bag), (".n", 7), (".arr", [1, "a", None]), (".nul", None)):
            builder.root.dataSetter(destination_path, value=value)
        self.assertNotIn("value", builder.source.nodes[3].attr)
        decoded = from_tytx(to_tytx(builder.source))
        attrs = {node.attr["destination_path"]: node.attr for node in decoded.nodes}
        self.assertIsInstance(attrs[".bag"]["value"], Bag)
        self.assertEqual(attrs[".bag"]["value"]["b.c"], "x")
        self.assertEqual(attrs[".n"]["value"], 7)
        self.assertEqual(attrs[".arr"]["value"], [1, "a", None])
        self.assertNotIn("value", attrs[".nul"])

    def test_from_tytx_drops_null_attributes_that_the_wire_carries(self):
        bag = Bag()
        bag["x"] = 1
        bag.get_node("x").attr.update({"keep": 1, "gone": None})
        wire = to_tytx(bag)
        self.assertIn('"gone": null', wire)
        self.assertEqual(dict(from_tytx(wire).get_node("x").attr), {"keep": 1})


async def fragment(server, page_id, name, params=None):
    """The decoded response envelope of a ``source`` call."""
    return from_tytx(await server.call(to_tytx({"id": "r1", "pageId": page_id, "contentType": "source",
                                                "name": name, "params": params or {}})))


class SourceMethodTests(unittest.IsolatedAsyncioTestCase):
    async def test_explicit_source_methods_use_fresh_builder_and_honor_mro(self):
        source = '''
from gramlot import Page as BasePage, source

class Parent(BasePage):
    @source
    def hidden(self, root): root.p("base")

class Page(Parent):
    def hidden(self, root): root.p("override")

    def main(self, root): root.h1("main")

    @source
    async def fragment(self, root, label):
        root.div(label).span("details")

    @source
    def plain(self, root):
        root.p("plain")
'''
        with tempfile.TemporaryDirectory() as directory:
            Path(directory, "index.py").write_text(source)
            server = GramlotFileServer(directory)
            opened = await server.open_page("/")
            self.assertIn('"rpcUrl":"/gramlot/rpc"', opened.html)
            first = (await fragment(server, opened.page_id, "fragment", {"label": "one"}))["value"]
            second = (await fragment(server, opened.page_id, "fragment", {"label": "two"}))["value"]
            self.assertEqual(first.nodes[0].attr["_text"], "one")
            self.assertEqual(first.nodes[0].value.nodes[0].node_tag, "span")
            self.assertEqual(second.nodes[0].attr["_text"], "two")
            # The same outcomes and messages as the JS GramlotServer (js/tests/gramlot-server.test.js).
            self.assertEqual((await fragment(server, opened.page_id, "hidden"))["error"],
                             {"code": "not_found", "name": "SourceNotFound", "message": "Unknown Source method: hidden"})
            main = (await fragment(server, opened.page_id, "main"))["value"]
            self.assertEqual([(node.node_tag, node.value) for node in main.nodes], [("h1", "main")])
            with self.assertRaises(InvalidRequest):
                await server.call(to_tytx({"id": "r1", "pageId": opened.page_id, "contentType": "source",
                                           "name": "fragment", "params": []}))
            plain = (await fragment(server, opened.page_id, "plain"))["value"]
            self.assertEqual([(node.node_tag, node.value) for node in plain.nodes], [("p", "plain")])

    async def test_source_method_must_return_none(self):
        source = '''
from gramlot import Page as BasePage, source
class Page(BasePage):
    def main(self, root): pass
    @source
    def bad(self, root): return root.div("bad")
'''
        with tempfile.TemporaryDirectory() as directory:
            Path(directory, "index.py").write_text(source)
            server = GramlotFileServer(directory)
            opened = await server.open_page("/")
            self.assertEqual((await fragment(server, opened.page_id, "bad"))["error"],
                             {"code": "application_error", "name": "TypeError",
                              "message": "Source methods must build into root and return None"})


if __name__ == "__main__":
    unittest.main()
