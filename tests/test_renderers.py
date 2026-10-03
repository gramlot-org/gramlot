"""Phase S03bis: Python renderers by inheritance from Builder (P6, source plan §3.3).

The expected strings are the ones of ``js/tests/style-shortcuts.test.js``, whose symmetry test
renders the same Sources in Python and JavaScript.
"""
import unittest

from genro_builders.contrib.html import HtmlBuilder
from genro_builders.contrib.svg import SvgBuilder

from gramlot import GramlotBuilder, GramlotHtmlRenderer, GramlotSvgRenderer

SVG = "http://www.w3.org/2000/svg"
HTML = "http://www.w3.org/1999/xhtml"
XLINK = "http://www.w3.org/1999/xlink"


def rendered(authoring, **opts):
    builder = GramlotBuilder()
    authoring(builder.root, builder.data)
    return builder.render(**opts)


class RendererClassTests(unittest.TestCase):
    def test_the_builder_renders_through_gramlot_html_renderer(self):
        builder = GramlotBuilder()
        renderer = builder.renderer_html
        self.assertIsInstance(renderer, GramlotHtmlRenderer)
        self.assertIs(renderer.get_render(builder), renderer)
        self.assertIs(renderer.get_render(HtmlBuilder()), renderer)
        svg = SvgBuilder()
        svg_renderer = renderer.get_render(svg)
        self.assertIsInstance(svg_renderer, GramlotSvgRenderer)
        self.assertIs(svg_renderer.owner, renderer)
        self.assertIs(renderer.get_render(svg), svg_renderer)


class StyleShortcutTests(unittest.TestCase):
    def test_shortcuts_compose_one_style_and_the_shortcut_wins(self):
        def authoring(root, data):
            root.div(background_color="red", rounded_top=10, style_aspect_ratio="16/9")
            root.div("t", style="color: red", color="blue")
        self.assertEqual(rendered(authoring),
                         '<div style="background-color: red; aspect-ratio: 16/9; border-top-left-radius: 10px; '
                         'border-top-right-radius: 10px"></div><div style="color: blue">t</div>')

    def test_null_values_are_not_written(self):
        def authoring(root, data):
            root.div(background_color="^bg", color="blue", title="^missing")
            root.canvas(width="^missing")
        self.assertEqual(rendered(authoring), '<div style="color: blue"></div><canvas></canvas>')

    def test_no_convert_style_keeps_native_attributes(self):
        def authoring(root, data):
            root.canvas(width=300, id="c")
            root.img(width=100, height=50, alt="a")
            root.table(width="100%", border=1)
            root.embed(width=1, height=2)
            root.div(width=4)
        self.assertEqual(rendered(authoring),
                         '<canvas id="c" width="300"></canvas><img alt="a" width="100" height="50"/>'
                         '<table width="100%" border="1"></table><embed width="1" height="2"/>'
                         '<div style="width: 4"></div>')


class NameTests(unittest.TestCase):
    def test_data_aria_xmlns_class_in_html_and_svg(self):
        def authoring(root, data):
            root.div(data_role="x", aria_label="y", _class="c", html_width=3)
            svg = root.svg(xmlns_xlink=XLINK, data_kind="chart")
            svg.rect(width=10, font_size=12, data_role="r", aria_label="q")
            svg.g()
        self.assertEqual(rendered(authoring),
                         '<div data-role="x" aria-label="y" class="c" width="3"></div>'
                         f'<svg xmlns:xlink="{XLINK}" data-kind="chart"><rect width="10" font-size="12" '
                         'data-role="r" aria-label="q" /><g></g></svg>')

    def test_html_prefix_is_literal_and_gramlot_prefix_is_an_error(self):
        self.assertEqual(rendered(lambda root, data: root.div(html_width=3, html_color="x")),
                         '<div width="3" color="x"></div>')
        with self.assertRaisesRegex(ValueError, "gramlot_width: the attribute prefix 'gramlot_' is not accepted; "
                                                "use the prefix 'html_'"):
            rendered(lambda root, data: root.div(gramlot_width=1))

    def test_foreign_object_in_the_svg_namespace_with_an_xhtml_child(self):
        self.assertEqual(rendered(lambda root, data: root.svg().html(width=5).div(color="green", data_x="1")),
                         f'<svg><foreignObject width="5" xmlns="{SVG}"><div xmlns="{HTML}" data-x="1" '
                         'style="color: green"></div></foreignObject></svg>')


class TextTests(unittest.TestCase):
    def test_text_attribute_is_node_text_and_booleans_are_javascript_literals(self):
        def authoring(root, data):
            root.p(_text="hello").span("x")
            root.div(True)
            root.div(False)
        self.assertEqual(rendered(authoring), "<p>hello<span>x</span></p><div>true</div><div>false</div>")

    def test_mask_follows_the_legacy_rule_and_format_does_not_format(self):
        def authoring(root, data):
            data.set_item("m.empty", "")
            data.set_item("m.zero", 0)
            data.set_item("m.no", False)
            data.set_item("m.pct", "a%sb")
            data.set_item("m.num", 1234.5)
            for name in ("none", "empty", "zero", "no", "pct"):
                root.div(f"^m.{name}", mask="Ciao %s")
            root.div("^m.num", format="#,###.00", places=2, locale="it", dtype="N")
        self.assertEqual(rendered(authoring),
                         "<div></div><div></div><div>Ciao 0</div><div>Ciao false</div><div>Ciao a%sb</div>"
                         "<div>1234.5</div>")


class DataElementTests(unittest.TestCase):
    def test_literal_setters_are_excluded_before_runtime_values(self):
        def authoring(root, data):
            root.dataSetter(destination_path="a", value="^x")
            root.dataSetter(destination_path="b", value="=y")
            root.dataSetter(destination_path="c", value="==x+1")
            root.dataSetter(destination_path="d", value="${x}")
            root.dataSetter(destination_path="e", value="^.literal")
            root.div("ok")
        self.assertEqual(rendered(authoring), "<div>ok</div>")


class DocumentTests(unittest.TestCase):
    def test_doctype_keeps_an_html_root(self):
        def authoring(root, data):
            html = root.html()
            html.head().title("t")
            html.body().div("x")
        self.assertEqual(rendered(authoring, doctype=True),
                         "<!doctype html><html><head><title>t</title></head><body><div>x</div></body></html>")

    def test_doctype_wraps_another_root_in_html(self):
        def authoring(root, data):
            root.div("x")
            root.div("y")
        self.assertEqual(rendered(authoring, doctype=True), "<!doctype html><html><div>x</div><div>y</div></html>")
        self.assertEqual(rendered(authoring), "<div>x</div><div>y</div>")


class ScriptAttributeTests(unittest.TestCase):
    """No attribute makes the browser run a text outside InlineCompiler, as the JS renderers."""

    def test_an_on_event_attribute_is_an_error_naming_node_and_attribute(self):
        for authoring, name in [
            (lambda root, data: root.button("b", onclick="x()"), "onclick"),
            (lambda root, data: root.div(html_onMouseOver="x()"), "html_onMouseOver"),
            (lambda root, data: root.svg(width=1).circle(r=1, onload="x()"), "onload"),
        ]:
            with self.assertRaisesRegex(ValueError, rf"^\w+ '.+': '{name}' has the form of a native event handler, run by "
                                                    r"the browser outside Gramlot; write connect_on\w+ for an event, or rename the attribute$"):
                rendered(authoring)

    def test_an_attribute_named_on_and_connect_on_are_not_native_handlers(self):
        def authoring(root, data):
            root.input(on="yes", connect_onclick="void 0")
        self.assertEqual(rendered(authoring), '<input on="yes"/>')

    def test_a_javascript_url_is_an_error_written_or_from_data(self):
        for url in ["javascript:alert(1)", " JavaScript:alert(1)", "java\tscr\nipt:alert(1)", "\x01javascript:void 0"]:
            def authoring(root, data, url=url):
                data["url"] = url
                root.a("x", href="^url")
            with self.assertRaisesRegex(ValueError, r"^a '.+': 'href' holds a javascript: URL, run by the browser as code; "
                                                    r"write connect_onclick or the action of a button instead$"):
                rendered(authoring)
        for authoring, name in [
            (lambda root, data: root.iframe(src="javascript:alert(1)"), "src"),
            (lambda root, data: root.button("b", formaction="javascript:alert(1)"), "formaction"),
            (lambda root, data: root.svg(width=1).a(href="javascript:alert(1)"), "href"),
            (lambda root, data: root.svg(width=1).a(xlink_href="javascript:alert(1)"), "xlink_href"),
        ]:
            with self.assertRaisesRegex(ValueError, rf"'{name}' holds a javascript: URL"):
                rendered(authoring)

    def test_an_ordinary_url_is_written(self):
        def authoring(root, data):
            data["url"] = "https://example.org/"
            root.a("x", href="^url")
        self.assertEqual(rendered(authoring), '<a href="https://example.org/">x</a>')



class SrcdocSandboxTests(unittest.TestCase):
    """An iframe srcdoc from Data gets an empty sandbox; the same strings as ``js/tests/style-shortcuts.test.js``."""

    def test_a_srcdoc_from_data_gets_an_empty_sandbox_before_it(self):
        def authoring(root, data):
            data["doc"] = "<script>run()</script>"
            root.iframe(title="p", srcdoc="^doc")
        self.assertEqual(rendered(authoring),
                         '<iframe sandbox="" title="p" srcdoc="&lt;script&gt;run()&lt;/script&gt;"></iframe>')

    def test_the_declaration_decides_also_for_a_missing_value(self):
        for declaration in ("^missing", "=missing", "==missing"):
            self.assertEqual(rendered(lambda root, data, value=declaration: root.iframe(srcdoc=value)),
                             '<iframe sandbox=""></iframe>', declaration)

    def test_a_template_reading_data_and_a_datum_carrying_srcdoc_count_as_data(self):
        def authoring(root, data):
            data["doc"] = "d"
            data.set_item("w", "x", _attributes={"_wdg": {"srcdoc": "<b>w</b>"}})
            root.iframe(srcdoc="<p>${d}</p>", d="^doc")
            root.iframe("^w", srcdoc="<i>lit</i>")
        self.assertEqual(rendered(authoring), '<iframe sandbox="" srcdoc="&lt;p&gt;d&lt;/p&gt;"></iframe>'
                                              '<iframe sandbox="" srcdoc="&lt;b&gt;w&lt;/b&gt;">x</iframe>')

    def test_a_declared_sandbox_and_a_literal_srcdoc_are_left_alone(self):
        def authoring(root, data):
            data["doc"] = "d"
            root.iframe(srcdoc="^doc", sandbox="allow-scripts")
            root.iframe(srcdoc="<p>lit</p>")
            root.iframe(srcdoc="<p>${t}</p>", t="lit")
        self.assertEqual(rendered(authoring), '<iframe srcdoc="d" sandbox="allow-scripts"></iframe>'
                                              '<iframe srcdoc="&lt;p&gt;lit&lt;/p&gt;"></iframe>'
                                              '<iframe srcdoc="&lt;p&gt;lit&lt;/p&gt;"></iframe>')

    def test_the_html_prefix_is_read_and_kept(self):
        def authoring(root, data):
            data["doc"] = "d"
            root.iframe(html_srcdoc="^doc")
        self.assertEqual(rendered(authoring), '<iframe sandbox="" srcdoc="d"></iframe>')

if __name__ == "__main__":
    unittest.main()
