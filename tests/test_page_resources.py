"""Minimal GramlotServer contract, minimal GramlotFileServer and bootstrap resources (S06).

The JavaScript counterpart is ``js/tests/page-resources.test.js``, which also runs
the Python/JS cross test of the descriptors.
"""
import json
import os
from pathlib import Path
import re
import tempfile
import unittest
from unittest import mock

from genro_tytx import to_tytx
from gramlot import Page
from gramlot.server import (GramlotFileServer, GramlotServer, ServerCapacity, InvalidResourceName, PageNotFound,
                            parse_requires)
from gramlot.server.resources import load_order


async def main_envelope(server, page_id, owner=None):
    """The response envelope of ``main`` as plain JSON: its ``value`` is the fragment text."""
    return json.loads(await server.call(to_tytx({"id": "r1", "pageId": page_id, "contentType": "source",
                                                 "name": "main", "params": {}}), owner=owner))

PAGE = ('from gramlot import Page as Base\n'
        'class Page(Base):\n'
        '    css = {css!r}\n'
        '    css_requires = {css_requires!r}\n'
        '    js_requires = {js_requires!r}\n'
        '    def main(self, root): root.div("ok")\n')


def page(css=(), css_requires="", js_requires=""):
    return PAGE.format(css=tuple(css), css_requires=css_requires, js_requires=js_requires)


def write(root, relative, text=""):
    filename = Path(root, relative)
    filename.parent.mkdir(parents=True, exist_ok=True)
    filename.write_text(text)
    return filename


def bootstrap_arguments(html):
    """The argument the server writes into ``new PageBootstrap(…)`` (S07)."""
    match = re.search(r'import \{PageBootstrap\} from "[^"]*";await new PageBootstrap\((.*)\)\.run\(\);</script>',
                      html, re.S)
    return json.loads(match.group(1))


def links(html):
    """The CSS URLs PageBootstrap writes as links in the live page; the server HTML has none (D9)."""
    assert "<link" not in html
    return bootstrap_arguments(html)["resources"]["css"]


URL_FORMS = ("/themes/x.css", "//cdn.example.org/a.css", "https://cdn.example.org/lib.css",
             "./local.css", "theme.css")


class TestPage(Page):
    pass


class MemoryServer(GramlotServer):
    """A GramlotServer with its own resources, as a GramlotServer with a resource system provides them."""

    def __init__(self, resources, **options):
        super().__init__(**options)
        self._resources = resources

    def resolve_page(self, path):
        return TestPage

    def resolve_resources(self, path, cls):
        return self._resources


class ParseRequiresTests(unittest.TestCase):
    def test_names_spaces_empty_tokens_and_duplicates(self):
        self.assertEqual(parse_requires(""), ())
        self.assertEqual(parse_requires(" , ,"), ())
        self.assertEqual(parse_requires(" business ,gui,, business,\tgui_2 "), ("business", "gui", "gui_2"))
        self.assertEqual(parse_requires("frameplugin_menu/frameplugin_menu,a-b"),
                         ("frameplugin_menu/frameplugin_menu", "a-b"))
        self.assertEqual(parse_requires(" theme　, gui\u0085, x "), ("theme", "gui", "x"))

    def test_invalid_names_raise_invalid_resource_name(self):
        self.assertTrue(issubclass(InvalidResourceName, ValueError))
        for text in ("..", ".", "a/../b", "/a", "a/", "a//b", "a b", "à", "a\\b", "﻿theme"):
            with self.subTest(text=text), self.assertRaisesRegex(InvalidResourceName, "Invalid resource name"):
                parse_requires(text)
        for text in ("a.css", "lib/theme.min"):
            with self.subTest(text=text), self.assertRaisesRegex(InvalidResourceName, "names have no extension"):
                parse_requires(text)
        with self.assertRaisesRegex(InvalidResourceName, "name:media"):
            parse_requires("print:media")
        for value in (None, ("a",), ["a"]):
            with self.subTest(value=value), self.assertRaisesRegex(InvalidResourceName, "comma-separated string"):
                parse_requires(value)


class LoadOrderTests(unittest.TestCase):
    def test_repeated_url_loads_once_in_its_last_position(self):
        self.assertEqual(load_order({"css": ["/a.css", "/b.css", "/a.css"],
                                     "js": [{"url": "/x.js", "group": None}, {"url": "/y.js", "group": None},
                                            {"url": "/x.js", "group": None}]}),
                         {"css": ["/b.css", "/a.css"],
                          "js": [{"url": "/y.js", "group": None}, {"url": "/x.js", "group": None}]})

    def test_same_js_url_with_two_groups_is_an_error(self):
        for groups in (("calcoli", "utils"), ("calcoli", None), (None, "utils")):
            with self.subTest(groups=groups), self.assertRaisesRegex(InvalidResourceName, "two groups"):
                load_order({"css": [], "js": [{"url": "/js/comune.js", "group": group} for group in groups]})


class FileHostPageTests(unittest.IsolatedAsyncioTestCase):
    async def test_file_page_wins_over_folder_page(self):
        with tempfile.TemporaryDirectory() as root:
            write(root, "orders/orders.py", page())
            server = GramlotFileServer(root)
            real = Path(root).resolve()
            self.assertEqual(server.locate_page("/orders"), real / "orders/orders.py")
            write(root, "orders.py", page())
            self.assertEqual(server.locate_page("/orders"), real / "orders.py")
            self.assertIn("ok", (await main_envelope(server, (await server.open_page("/orders")).page_id))["value"])
            self.assertEqual(server.locate_page("/orders/orders"), real / "orders/orders.py")

    async def test_segments_aux_suffix_and_other_language(self):
        with tempfile.TemporaryDirectory() as root:
            for name in ("01_hello-world", "_private", "index", "foo_aux", "sub/foo_aux"):
                write(root, f"{name}.py", page())
            write(root, "only_js.js")
            server = GramlotFileServer(root)
            for path in ("/01_hello-world", "/_private", "/", "/index"):
                with self.subTest(path=path):
                    self.assertIn("ok", (await main_envelope(server, (await server.open_page(path)).page_id))["value"])
            for path in ("/foo_aux", "/sub/foo_aux", "/only_js", "/a.b", "/à", "/a b", "/../index", "/a//b",
                         "/index.py", "/missing", "/%2e%2e/index"):
                with self.subTest(path=path), self.assertRaises(PageNotFound):
                    await server.open_page(path)
            with self.assertRaises(PageNotFound):
                await GramlotFileServer(Path(root, "absent")).open_page("/")

    async def test_paths_leaving_the_pages_folder_are_rejected(self):
        with tempfile.TemporaryDirectory() as outside, tempfile.TemporaryDirectory() as root:
            write(outside, "evil.py", page())
            write(outside, "evil.css")
            write(root, "index.py", page())
            os.symlink(Path(outside, "evil.py"), Path(root, "escape.py"))
            server = GramlotFileServer(root)
            with self.assertRaises(PageNotFound):
                await server.open_page("/escape")
            os.symlink(Path(outside, "evil.css"), Path(root, "index.css"))
            with self.assertRaisesRegex(ValueError, "leaves the pages folder"):
                await server.open_page("/")
            self.assertEqual(server._pages, {})
            write(root, "inner.css")
            os.remove(Path(root, "index.css"))
            os.symlink(Path(root, "inner.css"), Path(root, "index.css"))
            self.assertEqual(server.resolve_resources("/", server.resolve_page("/"))["css"], ["/index.css"])


class FileHostReloadTests(unittest.TestCase):
    def titled(self, root, title):
        write(root, "index.py", page() + f"    title = {title!r}\n")

    def test_without_reload_the_module_runs_once_per_path_with_reload_again(self):
        with tempfile.TemporaryDirectory() as root:
            self.titled(root, "old")
            cached, reloading = GramlotFileServer(root, reload=False), GramlotFileServer(root, reload=True)
            for server in (cached, reloading):
                self.assertEqual(server.resolve_page("/").title, "old")
            self.titled(root, "new")
            self.assertEqual(cached.resolve_page("/").title, "old")
            self.assertEqual(reloading.resolve_page("/").title, "new")

    def test_without_reload_a_symlinked_page_runs_once_by_its_real_path(self):
        with tempfile.TemporaryDirectory() as root:
            write(root, "index.py", page())
            os.symlink(Path(root, "index.py"), Path(root, "alias.py"))
            server = GramlotFileServer(root, reload=False)
            self.assertIs(server.resolve_page("/alias"), server.resolve_page("/"))

    def test_reload_none_follows_gramlot_dev(self):
        with tempfile.TemporaryDirectory() as root:
            for value, expected in ((None, False), ("YES", True), ("DEBUG", True)):
                with mock.patch.dict(os.environ):
                    os.environ.pop("GRAMLOT_DEV", None)
                    if value is not None:
                        os.environ["GRAMLOT_DEV"] = value
                    self.assertIs(GramlotFileServer(root).reload, expected)
                    self.assertIs(GramlotFileServer(root, reload=not expected).reload, not expected)


class FileHostResourceTests(unittest.IsolatedAsyncioTestCase):
    def test_page_css_then_companions_beside_the_file_page_and_in_the_folder(self):
        with tempfile.TemporaryDirectory() as root:
            write(root, "area/invoices.py", page(css=["/themes/base.css"]))
            write(root, "area/invoices.css")
            write(root, "area/invoices_aux.js")
            write(root, "area/invoices.md")
            write(root, "orders/orders.py", page(css=["/themes/base.css", "orders.css"]))
            write(root, "orders/orders.css")
            write(root, "orders/orders_aux.js")
            write(root, "plain.py", page(css=["/themes/base.css"]))
            server = GramlotFileServer(root)
            resolve = lambda path: server.resolve_resources(path, server.resolve_page(path))
            self.assertEqual(resolve("area/invoices"), {
                "css": ["/themes/base.css", "/area/invoices.css"],
                "js": [{"url": "/area/invoices_aux.js", "group": None}]})
            self.assertEqual(resolve("orders"), {
                "css": ["/themes/base.css", "orders.css", "/orders/orders.css"],
                "js": [{"url": "/orders/orders_aux.js", "group": None}]})
            self.assertEqual(resolve("plain"), {"css": ["/themes/base.css"], "js": []})

    async def test_foo_js_beside_the_python_page_is_the_logic_else_the_aux_companion_never_both(self):
        # Python cannot read the exports of foo.js: the file itself is the logic module.
        with tempfile.TemporaryDirectory() as root:
            write(root, "single.py", page())
            write(root, "single.js", "export class Page {}\nexport class Logic {}\n")
            write(root, "nested/nested.py", page())
            write(root, "nested/nested.js", "export class Logic {}\n")
            write(root, "twice.py", page())
            write(root, "twice.js", "export class Logic {}\n")
            write(root, "twice_aux.js", "export class Logic {}\n")
            server = GramlotFileServer(root)

            def resolve(path):
                return server.resolve_resources(path, server.resolve_page(path))
            self.assertEqual(resolve("single"), {"css": [], "js": [{"url": "/single.js", "group": None}]})
            self.assertEqual(resolve("nested"), {"css": [], "js": [{"url": "/nested/nested.js", "group": None}]})
            with self.assertRaises(ValueError) as caught:
                await server.open_page("/twice")
            self.assertIs(type(caught.exception), ValueError)
            self.assertEqual(str(caught.exception), "Two logic modules for one page: /twice.js and /twice_aux.js")
            self.assertEqual(server._pages, {})
            opened = await server.open_page("/single", prefix="/app")
            self.assertEqual(bootstrap_arguments(opened.html)["resources"]["js"], [{"url": "/app/single.js", "group": None}])

    async def test_requires_names_need_a_host_with_a_resource_system(self):
        with tempfile.TemporaryDirectory() as root:
            write(root, "themed.py", page(css_requires="tema"))
            write(root, "logic.py", page(js_requires="calcoli"))
            write(root, "invalid.py", page(css_requires="../tema"))
            write(root, "blank.py", page(css_requires=" , ", js_requires=""))
            server = GramlotFileServer(root)
            for path in ("/themed", "/logic"):
                with self.subTest(path=path), self.assertRaisesRegex(
                        InvalidResourceName, "^requires need a GramlotServer with a resource system$"):
                    await server.open_page(path)
            with self.assertRaisesRegex(InvalidResourceName, "Invalid resource name"):
                await server.open_page("/invalid")
            self.assertEqual(server._pages, {})
            self.assertIn("ok", (await main_envelope(server, (await server.open_page("/blank")).page_id))["value"])

    async def test_repeated_url_loads_once_in_its_last_position(self):
        with tempfile.TemporaryDirectory() as root:
            write(root, "index.py", page(css=["/index.css", "/themes/a.css", "/themes/b.css", "/themes/a.css"]))
            write(root, "index.css")
            opened = await GramlotFileServer(root).open_page("/")
            self.assertEqual(links(opened.html), ["/themes/b.css", "/themes/a.css", "/index.css"])


class BootstrapTests(unittest.IsolatedAsyncioTestCase):
    async def test_mount_prefix_is_added_once_to_root_relative_urls(self):
        with tempfile.TemporaryDirectory() as root:
            write(root, "index.py", page(css=URL_FORMS))
            write(root, "index.css")
            server = GramlotFileServer(root)
            mounted = await server.open_page("/", prefix="/py")
            self.assertEqual(links(mounted.html), ["/py/themes/x.css", *URL_FORMS[1:], "/py/index.css"])
            self.assertIn('import {PageBootstrap} from "/py/assets/gramlot.js"', mounted.html)
            for key, url in (("rpcUrl", "/gramlot/rpc"), ("closeUrl", "/gramlot/close")):
                self.assertIn(f'"{key}":"/py{url}"', mounted.html)
            self.assertNotIn("/py/py", mounted.html)
            plain = await server.open_page("/")
            self.assertEqual(links(plain.html), [*URL_FORMS, "/index.css"])
            self.assertIn('import {PageBootstrap} from "/assets/gramlot.js"', plain.html)
            with self.assertRaisesRegex(TypeError, "Mount prefix must be a string"):
                await server.open_page("/", prefix=None)

    async def test_mount_prefix_on_js_urls_only_when_root_relative(self):
        # C02 and D8 (S07): the JS modules reach PageBootstrap with the prefix rule of the CSS links.
        js = [{"url": "/a.js", "group": "a"}, {"url": "b.js", "group": "b"}, {"url": "./c.js", "group": None},
              {"url": "https://cdn.example.org/d.js", "group": "d"}, {"url": "//cdn.example.org/e.js", "group": "e"}]
        server = MemoryServer({"css": [], "js": js})
        mounted = bootstrap_arguments((await server.open_page("/", prefix="/py")).html)
        self.assertEqual(mounted["resources"]["js"], [{**js[0], "url": "/py/a.js"}, *js[1:]])
        self.assertEqual(bootstrap_arguments((await server.open_page("/")).html)["resources"]["js"], js)
        self.assertEqual(sorted(mounted), ["config", "resources"])
        self.assertEqual(list(mounted["config"]), ["pageId", "rpcUrl", "closeUrl", "rootId", "capabilities"])

    async def test_nonce_is_new_at_each_opening_and_distinct_from_the_page_id(self):
        with tempfile.TemporaryDirectory() as root:
            write(root, "index.py", page())
            server = GramlotFileServer(root)
            first, second = [await server.open_page("/") for _ in range(2)]
            self.assertNotEqual(first.nonce, second.nonce)
            self.assertNotEqual(first.nonce, first.page_id)
            self.assertRegex(first.nonce, r"^[A-Za-z0-9_-]{22}$")
            self.assertIn(f'<script type="module" nonce="{first.nonce}">', first.html)
            self.assertNotIn(second.nonce, first.html)

    async def test_import_map_points_the_page_module_import_to_the_runtime(self):
        server = MemoryServer({"css": [], "js": []}, runtime_url="/static/gramlot.js")
        for prefix, runtime in (("", "/static/gramlot.js"), ("/app", "/app/static/gramlot.js")):
            with self.subTest(prefix=prefix):
                opened = await server.open_page("/", prefix=prefix)
                self.assertIn(f'<script type="importmap" nonce="{opened.nonce}">'
                              f'{{"imports":{{"@gramlot/gramlot/page":"{runtime}"}}}}</script></head>', opened.html)
                self.assertLess(opened.html.index('type="importmap"'), opened.html.index('type="module"'))

    async def test_js_url_with_two_groups_fails_before_registration(self):
        server = MemoryServer({"css": [], "js": [{"url": "/js/comune.js", "group": "calcoli"},
                                              {"url": "/js/comune.js", "group": "utils"}]})
        with self.assertRaisesRegex(InvalidResourceName, "two groups"):
            await server.open_page("/")
        self.assertEqual(server._pages, {})

    async def test_neutral_host_requires_the_contract(self):
        with self.assertRaises(PageNotFound):
            await GramlotServer().open_page("/")
        with self.assertRaises(PageNotFound):
            GramlotServer().resolve_resources("/", Page)

        class PagesOnly(GramlotServer):
            def resolve_page(self, path):
                return TestPage

        with self.assertRaises(PageNotFound):
            await PagesOnly().open_page("/")

    async def test_capacity_expiry_and_owner_are_unchanged(self):
        server = MemoryServer({"css": [], "js": []}, max_pages=1)
        opened = await server.open_page("/", owner="one")
        with self.assertRaises(ServerCapacity):
            await server.open_page("/", owner="one")
        self.assertEqual((await main_envelope(server, opened.page_id, owner="two"))["error"]["code"], "page_expired")
        server._pages[opened.page_id] = (0, *server._pages[opened.page_id][1:])
        self.assertEqual((await main_envelope(server, opened.page_id, owner="one"))["error"]["code"], "page_expired")


class OnePlaceTests(unittest.TestCase):
    def test_segment_rule_is_defined_once(self):
        """Phase 18 (Fable M3): the name-segment rule lives in resources.py only, public as in JS."""
        from gramlot.server import gramlot_file_server, resources
        root = Path(__file__).resolve().parents[1] / "src" / "gramlot"
        sources = [path.read_text() for path in root.rglob("*.py")]
        self.assertEqual(sum(text.count('re.compile(r"[A-Za-z0-9_-]+")') for text in sources), 1)
        self.assertEqual(sum(text.count('"http://www.w3.org/1999/xhtml"') for text in sources), 1)
        self.assertEqual(sum(text.count('"http://www.w3.org/2000/svg"') for text in sources), 1)
        self.assertIs(gramlot_file_server.SEGMENT, resources.SEGMENT)


if __name__ == "__main__":
    unittest.main()
