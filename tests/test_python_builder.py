import tempfile
import unittest
import json
from pathlib import Path

from genro_builders.builder import SourceBag
from genro_builders import BuilderBase
from genro_tytx import from_tytx, to_tytx

from gramlot import GramlotBuilder
from gramlot.server import Host

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
'''
        with tempfile.TemporaryDirectory() as directory:
            Path(directory, "index.py").write_text(source)
            host = Host(directory)
            opened = await host.open_page("/")
            self.assertIn('"sourceUrl": "/gramlot/source"', opened.html)
            first = from_tytx(await host.source(
                opened.page_id, "fragment", {"label": "one"}))
            second = from_tytx(await host.source(
                opened.page_id, "fragment", {"label": "two"}))
            self.assertEqual(first.nodes[0].attr["_text"], "one")
            self.assertEqual(first.nodes[0].value.nodes[0].node_tag, "span")
            self.assertEqual(second.nodes[0].attr["_text"], "two")
            with self.assertRaises(LookupError):
                await host.source(opened.page_id, "hidden")
            with self.assertRaises(LookupError):
                await host.source(opened.page_id, "main")
            with self.assertRaises(TypeError):
                await host.source(opened.page_id, "fragment", [])

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
            host = Host(directory)
            opened = await host.open_page("/")
            with self.assertRaises(TypeError):
                await host.source(opened.page_id, "bad")


if __name__ == "__main__":
    unittest.main()
