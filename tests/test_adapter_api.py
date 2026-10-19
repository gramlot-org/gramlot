"""The API of ``GramlotServer`` and ``GramlotFileServer`` shared by every adapter (review plan p4, d-adapter-api):
body decoding, close message, ``index.html``, companion and theme files, identity per call, name syntax, server
adapter and base theme. The JavaScript counterpart is ``js/tests/adapter-api.test.js``, with the same inputs and
outcomes.
"""
import asyncio
import json
import re
import tempfile
import unittest
from pathlib import Path

from genro_tytx import from_tytx, to_tytx
from gramlot import Page, endpoint, source
from gramlot.server import (NAME_SYNTAX, GramlotFileServer, GramlotServer, InvalidRequest, InvalidResourceName,
                            NameSyntax)

PAGE = '''from gramlot import Page as Base, endpoint, source


class Page(Base):
    css = {css}
    css_theme = {theme}

    def main(self, root):
        root.div("ok")

    @endpoint
    def echo(self, value):
        return value
'''


def bootstrap(html):
    """The argument the server writes into ``new PageBootstrap(…)``."""
    return json.loads(re.search(r"await new PageBootstrap\((.*)\)\.run\(\);</script>", html, re.S).group(1))


def call(server, page_id, content_type, name, params=None, owner=None):
    text = to_tytx({"id": "r1", "pageId": page_id, "contentType": content_type, "name": name, "params": params or {}})
    return from_tytx(asyncio.run(server.call(text, owner=owner)))


class Folder(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.root = Path(directory.name)

    def write(self, relative, text=""):
        filename = self.root / relative
        filename.parent.mkdir(parents=True, exist_ok=True)
        filename.write_text(text)
        return filename

    def page(self, relative, css=(), theme=None):
        return self.write(relative, PAGE.format(css=repr(tuple(css)), theme=repr(theme)))


class BodyAndCloseTests(Folder):
    def test_decode_body_removes_a_leading_byte_order_mark_and_refuses_bytes_that_are_not_utf8(self):
        server = GramlotServer()
        self.assertEqual(server.decode_body('{"a":"è"}'.encode()), '{"a":"è"}')
        self.assertEqual(server.decode_body(b"\xef\xbb\xbf{}"), "{}")
        # Only one leading mark is removed, as the decoder of the browser does.
        self.assertEqual(server.decode_body(b"\xef\xbb\xbf\xef\xbb\xbf{}"), "﻿{}")
        for data in (b"\xff", b'{"a":"\xff"}', b"\xef\xbb"):
            with self.subTest(data=data), self.assertRaisesRegex(InvalidRequest, "not UTF-8"):
                server.decode_body(data)

    def test_close_closes_the_owned_page_of_the_close_message(self):
        self.page("index.py")
        server = GramlotFileServer(self.root)
        page_id = asyncio.run(server.open_page("/", owner="one")).page_id
        server.close(json.dumps({"pageId": page_id}), owner="two")
        self.assertEqual(call(server, page_id, "data", "echo", {"value": 1}, owner="one")["value"], 1)
        server.close(json.dumps({"pageId": "0" * 32}), owner="one")
        server.close(json.dumps({"pageId": page_id, "other": 1}), owner="one")
        self.assertEqual(call(server, page_id, "data", "echo", {"value": 1}, owner="one")["error"]["code"],
                         "page_expired")

    def test_a_close_message_that_is_not_a_page_id_object_is_invalid(self):
        server = GramlotServer()
        for text in ("{", "[]", "null", '{"pageId": 3}', "{}", "﻿{}"):
            with self.subTest(text=text), self.assertRaises(InvalidRequest):
                server.close(text)


class FileTests(Folder):
    def test_index_html_opens_the_page_of_its_folder(self):
        self.page("index.py")
        self.page("area/area.py")
        server = GramlotFileServer(self.root)
        for path in ("/index.html", "/area/index.html"):
            with self.subTest(path=path):
                opened = asyncio.run(server.open_page(path))
                self.assertEqual(call(server, opened.page_id, "source", "main")["value"].nodes[0].value, "ok")
        with self.assertRaises(LookupError):
            asyncio.run(server.open_page("/area/index.htm"))

    def test_companion_file_is_a_css_or_js_file_below_the_pages_folder(self):
        self.page("index.py")
        for name in ("index.css", "index.js", "area/a.css", "index.md"):
            self.write(name)
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        outside = Path(directory.name)
        (outside / "secret.css").write_text("")
        (self.root / "link.css").symlink_to(outside / "secret.css")
        server = GramlotFileServer(self.root)
        real = self.root.resolve()
        self.assertEqual(server.companion_file("/index.css"), real / "index.css")
        self.assertEqual(server.companion_file("/area/a.css"), real / "area/a.css")
        self.assertEqual(server.companion_file("/index.js"), real / "index.js")
        for path in ("/index.py", "/index.md", "/missing.css", "/../index.css", "/area/../../x.css", "/link.css",
                     "/a\x00.css", "/area"):
            with self.subTest(path=path):
                self.assertIsNone(server.companion_file(path))

    def test_theme_file_is_a_file_of_the_core_themes_of_every_server(self):
        self.assertIs(GramlotFileServer.theme_file, GramlotServer.theme_file)
        for name, server in (("GramlotServer", GramlotServer()), ("custom", memory_server(Home)),
                             ("GramlotFileServer", GramlotFileServer(self.root))):
            with self.subTest(server=name):
                theme = server.theme_file("/themes/gramlot-base/theme.css")
                self.assertEqual(theme.parts[-3:], ("themes", "gramlot-base", "theme.css"))
                self.assertTrue(theme.is_file())
                for path in ("/themes/missing.css", "/themes/../gramlot.js", "/themes/gramlot-base", "/theme/x.css",
                             "/themes/a\x00.css"):
                    with self.subTest(server=name, path=path):
                        self.assertIsNone(server.theme_file(path))


class ThemeTests(Folder):
    def links(self, server, path="/"):
        return bootstrap(asyncio.run(server.open_page(path)).html)["resources"]["css"]

    def test_the_base_theme_comes_first_and_a_listed_base_theme_loads_once(self):
        self.page("index.py", css=["/themes/gramlot-base/theme.css", "/local.css"])
        self.page("plain.py", css=["/local.css"])
        server = GramlotFileServer(self.root)
        self.assertEqual(self.links(server), ["/themes/gramlot-base/theme.css", "/local.css"])
        self.assertEqual(self.links(server, "/plain"), ["/themes/gramlot-base/theme.css", "/local.css"])

    def test_the_page_replaces_the_theme_or_loads_none(self):
        self.page("mimi.py", theme="mimi")
        self.page("none.py", css=["/local.css"], theme=False)
        server = GramlotFileServer(self.root)
        self.assertEqual(self.links(server, "/mimi"), ["/themes/mimi/theme.css"])
        self.assertEqual(self.links(server, "/none"), ["/local.css"])
        self.assertEqual(self.links(GramlotFileServer(self.root, css_theme="joanna"), "/none"), ["/local.css"])

    def test_the_theme_link_of_the_bootstrap_of_a_custom_server_is_a_file_it_serves(self):
        server = memory_server(Home)
        links = self.links(server)
        self.assertEqual(links, ["/themes/gramlot-base/theme.css"])
        self.assertTrue(server.theme_file(links[0]).is_file())

    def test_the_server_option_chooses_the_base_theme(self):
        self.page("index.py")
        self.assertEqual(self.links(GramlotFileServer(self.root, css_theme="gramlot-compact")),
                         ["/themes/gramlot-compact/theme.css"])
        self.assertEqual(self.links(GramlotFileServer(self.root, css_theme=False)), [])

    def test_a_theme_that_is_not_a_name_is_refused(self):
        for value in (None, "", "a/b", "../x", "a.css", 3, True):
            with self.subTest(value=value), self.assertRaises(ValueError):
                GramlotServer(css_theme=value)
        for value in ("", "a/b", 3, True):
            self.page("index.py", theme=value)
            with self.subTest(page=value), self.assertRaisesRegex(InvalidResourceName, "css_theme"):
                asyncio.run(GramlotFileServer(self.root, reload=True).open_page("/"))


class NameSyntaxTests(unittest.TestCase):
    def test_the_core_syntax_is_dotted_segments_and_its_descriptor_is_portable(self):
        self.assertEqual(NAME_SYNTAX.to_dict(), {"kind": "regex",
                                                 "pattern": r"[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)*",
                                                 "flags": 0})
        self.assertEqual(NameSyntax.from_dict(NAME_SYNTAX.to_dict()), NAME_SYNTAX)
        self.assertIs(GramlotServer().name_syntax, NAME_SYNTAX)
        self.assertEqual([NAME_SYNTAX.matches(name) for name in ("a", "a.b", "a/b", "a\n", "", None, 3)],
                         [True, True, False, False, False, False, False])

    def test_a_regex_that_python_and_javascript_read_differently_is_refused(self):
        for pattern, flags in ((r"\w+", 0), (r"(?i)a", 0), ("a", 2), ("(?P<x>a)", 0)):
            with self.subTest(pattern=pattern, flags=flags), self.assertRaises(ValueError):
                NameSyntax(pattern, flags)
        for descriptor in ({"kind": "range", "pattern": "a", "flags": 0}, {"pattern": "a", "flags": 0}, "a"):
            with self.subTest(descriptor=descriptor), self.assertRaises(ValueError):
                NameSyntax.from_dict(descriptor)

    def test_a_server_syntax_reaches_the_bootstrap_the_builder_and_the_resolution(self):
        refused = []

        class Orders:
            @endpoint
            def total(self):
                return 3

        class Segments(Page):
            orders = Orders()

            def main(self, root):
                root.div().remote("details")
                try:
                    root.div().remote("orders.details")
                except ValueError as error:
                    refused.append(str(error))

            @source
            def details(self, root):
                root.span("details")

            @endpoint
            def one(self):
                return 1

        class OneSegment(GramlotServer):
            """A server whose names have one segment."""

            @property
            def name_syntax(self):
                return NameSyntax("[a-z]+")

            def resolve_page(self, path):
                return Segments

            def resolve_resources(self, path, cls):
                return {"css": [], "js": []}

        server = OneSegment()
        opened = asyncio.run(server.open_page("/"))
        self.assertEqual(bootstrap(opened.html)["config"]["nameSyntax"], {"kind": "regex", "pattern": "[a-z]+",
                                                                          "flags": 0})
        # The builder of the page refuses a dotted name; the other element keeps its remote.
        self.assertEqual(len(call(server, opened.page_id, "source", "main")["value"].nodes), 2)
        self.assertEqual(refused, ["div 'div_1': remote name must be a pointer or match [a-z]+, not 'orders.details'"])
        self.assertEqual(call(server, opened.page_id, "data", "one")["value"], 1)
        self.assertEqual(call(server, opened.page_id, "data", "orders.total")["error"]["code"], "not_found")
        core = memory_server(Segments)
        self.assertEqual(call(core, asyncio.run(core.open_page("/")).page_id, "data", "orders.total")["value"], 3)


class Home(Page):
    def main(self, root):
        root.div("ok")


def memory_server(page_class):
    """A GramlotServer of ``page_class`` with no resources and the core name syntax."""
    class Memory(GramlotServer):
        def resolve_page(self, path):
            return page_class

        def resolve_resources(self, path, cls):
            return {"css": [], "js": []}

    return Memory()


class ServerAdapterTests(unittest.TestCase):
    def test_the_server_names_the_module_of_its_adapter_in_the_resources(self):
        class Empty(Page):
            def main(self, root):
                pass

        class Adapted(GramlotServer):
            @property
            def server_adapter(self):
                return "/assets/adapter.js"

            def resolve_page(self, path):
                return Empty

            def resolve_resources(self, path, cls):
                return {"css": [], "js": []}

        self.assertIsNone(GramlotServer().server_adapter)
        self.assertNotIn("serverAdapter", bootstrap(asyncio.run(memory_server(Empty).open_page("/")).html)["resources"])
        resources = bootstrap(asyncio.run(Adapted().open_page("/", prefix="/app")).html)["resources"]
        self.assertEqual(resources["serverAdapter"], "/app/assets/adapter.js")


if __name__ == "__main__":
    unittest.main()
