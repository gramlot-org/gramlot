"""Phase S02: inert binding grammar and transport (decisions P18, P19, P25; R08)."""
import unittest

from genro_bag import Bag
from genro_builders.contrib.html import HtmlBuilder
from genro_tytx import from_tytx, to_tytx

from gramlot import GramlotBuilder

DATA_FORBIDDEN = "data is forbidden: write dataSetter for a Data value or html_data for the HTML5 <data> element"


class DialectPrefixTests(unittest.TestCase):
    def test_the_html_grammar_comes_by_inheritance(self):
        self.assertTrue(issubclass(GramlotBuilder, HtmlBuilder))
        self.assertEqual(GramlotBuilder().dialect_prefixes, ("html_",))

    def test_html_prefix_reaches_label_and_data_on_a_bag_and_on_a_node(self):
        builder = GramlotBuilder()
        form = builder.root.form()
        self.assertEqual(form.html_label("Name", for_="name").node_tag, "label")
        self.assertEqual(form.html_data("one", value="1").node_tag, "data")
        self.assertEqual(builder.root.html_label("Top").node_tag, "label")
        self.assertEqual(builder.root.html_data("two", value="2").node_tag, "data")

    def test_the_gramlot_prefix_is_an_error(self):
        builder = GramlotBuilder()
        form = builder.root.form()
        with self.assertRaisesRegex(ValueError, "gramlot_label: the tag prefix 'gramlot_' is not accepted; use the prefix 'html_'"):
            builder.root.gramlot_label("x")
        with self.assertRaisesRegex(ValueError, "gramlot_data: the tag prefix 'gramlot_' is not accepted"):
            form.gramlot_data("x")


class ForbiddenDeclarationTests(unittest.TestCase):
    def test_data_is_an_error_naming_datasetter_and_html_data(self):
        builder = GramlotBuilder()
        with self.assertRaises(ValueError) as error:
            builder.root.data(".nome", "Ada")
        self.assertEqual(str(error.exception), DATA_FORBIDDEN)
        with self.assertRaisesRegex(ValueError, "data is forbidden"):
            builder.root.data(value="Ada")
        with self.assertRaisesRegex(ValueError, "data is forbidden"):
            builder.root.div().DATA("x")
        self.assertEqual(len(builder.source), 1)

    def test_excluded_declarations_are_errors_naming_the_tag(self):
        builder = GramlotBuilder()
        with self.assertRaisesRegex(ValueError, r"dataRpc: excluded from Gramlot 0\.2\.0"):
            builder.root.dataRpc(destination="x")
        with self.assertRaisesRegex(ValueError, r"dataRemote: excluded from Gramlot 0\.2\.0"):
            builder.root.dataRemote(destination="x")
        for name in ("serverpath", "dbenv", "shared_id", "remote", "_ask", "ask",
                     "subscribe_x", "selfsubscribe_x", "formsubscribe_x"):
            with self.subTest(name=name), self.assertRaisesRegex(
                    ValueError, rf"div: attribute '{name}' is excluded from Gramlot 0\.2\.0"):
                builder.root.div(**{name: "v"})


class LiteralDataElementTests(unittest.TestCase):
    def test_setter_attributes_travel_literally(self):
        builder = GramlotBuilder()
        builder.root.dataSetter(".literal", value="^.unresolved", title="=.other",
                                expression="==a + b", template="${width}px")
        attrs = from_tytx(to_tytx(builder.source)).nodes[0].attr
        self.assertEqual(attrs["value"], "^.unresolved")
        self.assertEqual(attrs["title"], "=.other")
        self.assertEqual(attrs["expression"], "==a + b")
        self.assertEqual(attrs["template"], "${width}px")

    def test_a_null_setter_attribute_is_not_authored(self):
        """R17 (S05): a null attribute of a dataSetter counts as omitted, as in the JS authoring."""
        builder = GramlotBuilder()
        builder.root.dataSetter("x", None, caption=None, colore="rosso")
        attrs = from_tytx(to_tytx(builder.source)).nodes[0].attr
        self.assertEqual({k: v for k, v in attrs.items() if k != "_meta"}, {"destination_path": "x", "colore": "rosso"})


class DataElementSignatureTests(unittest.TestCase):
    """P18: the binding.json signatures, applied by Builder over the HTML grammar."""

    def test_binding_json_replaces_the_builder_data_elements_whole(self):
        builder = GramlotBuilder()
        declared = {tag: list(builder._get_schema_info(tag)["call_args_validations"])
                    for tag in ("dataSetter", "dataFormula", "dataController")}
        self.assertEqual(declared, {
            "dataSetter": ["destination_path", "value"],
            "dataFormula": ["result_path", "formula", "func"],
            "dataController": ["script", "func"],
        })
        self.assertEqual(builder.root.div().node_tag, "div")
        self.assertEqual(builder._get_schema_info("dataSetter")["_meta"], {"data_element": True})

    def test_valid_datasetter_signatures(self):
        root = GramlotBuilder().root
        cases = [
            (root.dataSetter(".a"), {"destination_path": ".a"}),
            (root.dataSetter(".b", colore="rosso"), {"destination_path": ".b", "colore": "rosso"}),
            (root.dataSetter(".c", 3), {"destination_path": ".c", "value": 3}),
            (root.dataSetter(".d", None), {"destination_path": ".d"}),
            (root.dataSetter(destination_path=".e", value="x"), {"destination_path": ".e", "value": "x"}),
        ]
        for node, expected in cases:
            with self.subTest(expected=expected):
                attrs = {k: v for k, v in node.attr.items() if k != "_meta"}
                self.assertEqual(attrs, expected)
                self.assertIsNone(node.value)

    def test_formula_and_controller_forms(self):
        root = GramlotBuilder().root
        formula = root.dataFormula(".totale", "a + b", a="^.a")
        self.assertEqual((formula.attr["result_path"], formula.attr["formula"]), (".totale", "a + b"))
        self.assertEqual(root.dataFormula(".t", func="calc.total", a="^.a").attr["func"], "calc.total")
        self.assertEqual(root.dataController("this.SET('.x', 1)", a="^.a").attr["script"], "this.SET('.x', 1)")
        self.assertEqual(root.dataController(func="calc.save", a="^.a").attr["func"], "calc.save")

    def test_invalid_signatures(self):
        root = GramlotBuilder().root
        cases = [
            (lambda: root.dataSetter(), r"dataSetter: missing required attributes \['destination_path'\]"),
            (lambda: root.dataSetter(".a?title", 1), r"dataSetter: 'destination_path' does not accept '\?attr'"),
            (lambda: root.dataFormula(), r"dataFormula: missing required attributes \['result_path'\]"),
            (lambda: root.dataFormula(".t?x", "a"), r"dataFormula: 'result_path' does not accept '\?attr'"),
            (lambda: root.dataFormula(".t", "a + b", func="calc.total"),
             "dataFormula: 'func' and 'formula' cannot be declared on the same node"),
            (lambda: root.dataController("x()", func="calc.save"),
             "dataController: 'func' and 'script' cannot be declared on the same node"),
            (lambda: root.dataController(func="calc.save", _if="a > 1"),
             "dataController: '_if' is inline and cannot be declared with 'func'"),
            (lambda: root.dataFormula(".t", func="calc.total", _if="a > 1"),
             "dataFormula: '_if' is inline and cannot be declared with 'func'"),
        ]
        for call, message in cases:
            with self.subTest(message=message), self.assertRaisesRegex(ValueError, message):
                call()
        self.assertEqual(len(root), 0)

    def test_the_string_renderer_writes_no_expression(self):
        # The same Source and string as js/tests/binding-inline.test.js: `==` belongs to the page runtime (S09).
        builder = GramlotBuilder()
        builder.root.div("==1 + 1", title="==2", alt="x")
        self.assertEqual(builder.renderer_html.render(builder.source.nodes[0]), '<div alt="x"></div>')
        builder.root.div(title="${t}", t="==1 + 1")
        with self.assertRaisesRegex(ValueError, "the template of 'title' uses 't', a == expression"):
            builder.renderer_html.render(builder.source.nodes[1])
        builder.root.div(a=1, total="==${a} * 2")
        with self.assertRaisesRegex(ValueError, r"'total' contains a \$\{…\} template, not accepted in a == expression"):
            builder.renderer_html.render(builder.source.nodes[2])

    def test_a_dict_value_becomes_a_bag_and_a_json_string_stays_a_string(self):
        root = GramlotBuilder().root
        node = root.dataSetter(".cliente", {"nome": "Ada", "indirizzo": {"citta": "Roma"}, "tag": [1, "a"]})
        value = node.attr["value"]
        self.assertIs(type(value), Bag)
        self.assertIs(type(value["indirizzo"]), Bag)
        self.assertEqual(value["indirizzo.citta"], "Roma")
        self.assertEqual(value["tag"], [1, "a"])
        self.assertEqual(root.dataSetter(".s", '{"a": 1}').attr["value"], '{"a": 1}')

    def test_values_round_trip_python_to_python(self):
        builder = GramlotBuilder()
        bag = Bag()
        bag.set_item("a", 1, colore="rosso")
        for path, value in ((".nul", None), (".f", False), (".z", 0), (".e", ""), (".bag", bag), (".arr", [1, "a", None])):
            builder.root.dataSetter(path, value)
        attrs = {node.attr["destination_path"]: node.attr for node in from_tytx(to_tytx(builder.source)).nodes}
        self.assertNotIn("value", attrs[".nul"])
        self.assertIs(attrs[".f"]["value"], False)
        self.assertEqual((type(attrs[".z"]["value"]), attrs[".z"]["value"]), (int, 0))
        self.assertEqual(attrs[".e"]["value"], "")
        self.assertEqual(attrs[".bag"]["value"].get_node("a").attr, {"colore": "rosso"})
        self.assertEqual(attrs[".arr"]["value"], [1, "a", None])

    def test_the_host_executes_no_logic(self):
        class Authoring(GramlotBuilder):
            def main(self, root):
                root.dataSetter(".x", 1)
                root.dataFormula(".y", "1 + 1")
                root.dataController("this.SET('.z', 1)")

        builder = Authoring()
        builder.create()
        self.assertEqual(len(builder.source), 3)
        self.assertEqual(len(builder.data), 0)


if __name__ == "__main__":
    unittest.main()
