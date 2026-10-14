"""Generic authoring: literal code survives the wire and is consumed by rendering."""
import unittest
from gramlot import GramlotBuilder
from genro_tytx import from_tytx


class WebcomponentTests(unittest.TestCase):
    def test_nested_tag_attributes_children_and_wire(self):
        builder = GramlotBuilder()
        node = builder.root.div(node_label="pane").webcomponent(
            code="gramlot-poc-tree", node_label="tree", id="tree", title="A & B",
            connect_onchange="inspector.select")
        node.span("Fallback <text>")
        html = builder.render()
        self.assertIn('<gramlot-poc-tree id="tree" title="A &amp; B">', html)
        self.assertIn('<span>Fallback &lt;text&gt;</span></gramlot-poc-tree>', html)
        self.assertNotIn('code=', html)
        self.assertNotIn('connect_onchange=', html)
        copy = from_tytx(builder.to_tytx())
        tree = copy.get_node("pane.tree")
        self.assertEqual(tree.node_tag, "webcomponent")
        self.assertEqual(tree.attr["code"], "gramlot-poc-tree")

    def test_code_is_required_literal_and_tag_safe(self):
        for code in [None, 42, "", "div", "Tree-node", "tree-x\n", "^tree-code", "=tree-code",
                     "==tree-code", 'x-tree><script>', 'font-face', 'x-tree onclick="bad"']:
            with self.subTest(code=code):
                builder = GramlotBuilder()
                with self.assertRaises((ValueError, TypeError)):
                    builder.root.webcomponent(code=code)
                self.assertEqual(len(builder.source), 0)
        with self.assertRaises((ValueError, TypeError)):
            GramlotBuilder().root.webcomponent()

    def test_native_html_containment_remains_validated(self):
        with self.assertRaises(ValueError):
            GramlotBuilder().root.ul().div()

    def test_mutated_code_is_checked_by_static_renderer(self):
        builder = GramlotBuilder()
        node = builder.root.webcomponent(code="gramlot-poc-tree")
        node.set_attr({"code": "^some-path"})
        with self.assertRaisesRegex(ValueError, "literal"):
            builder.render()
