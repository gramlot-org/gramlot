import asyncio
import json
from pathlib import Path
import tempfile
import unittest

from genro_tytx import from_tytx, to_tytx
from gramlot import GramlotBuilder, Page, source
from gramlot.server import GramlotFileServer, GramlotServer

PAGES = Path(__file__).parent / "fixtures/pages"

async def call(server, page_id, content_type="source", name="main", params=None, owner=None):
    """The decoded response envelope of one ``call``."""
    return from_tytx(await server.call(to_tytx({"id": "r1", "pageId": page_id, "contentType": content_type,
                                                "name": name, "params": params or {}}), owner=owner))


class SourceTests(unittest.TestCase):
    def test_nested_source_and_references_survive_transport(self):
        builder = GramlotBuilder()
        root = builder.root
        panel = root.div("homer", class_="family", data_name="simpson")
        panel.span("bart")
        reference = builder.reference(panel, "dom")
        self.assertEqual(reference["$gramlotRef"], builder.reference(panel)["$gramlotRef"])
        restored = from_tytx(to_tytx(builder.source))
        node = restored.nodes[0]
        self.assertEqual(node.attr["__ref"], reference["$gramlotRef"])
        self.assertEqual(node.attr["class_"], "family")
        self.assertEqual(node.value.nodes[0].value, "bart")

    def test_scope_is_explicit(self):
        builder = GramlotBuilder()
        root = builder.root
        # HTML's exported signature is open (**kwargs); no Gramlot whitelist.
        node = root.div(color="red", data_example="value")
        self.assertEqual(node.attr["color"], "red")
        with self.assertRaises(ValueError):
            root.br().span("invalid")
        with self.assertRaises(ValueError):
            builder.reference(root)
        with self.assertRaises(AttributeError):
            root.imaginary()


class HostTests(unittest.IsolatedAsyncioTestCase):
    def test_host_rejects_non_expiring_ttl_and_invalid_capacity(self):
        for page_ttl in (float("inf"), float("nan"), 10**1000, "30", 0):
            with self.subTest(page_ttl=page_ttl), self.assertRaises(ValueError):
                GramlotServer(page_ttl=page_ttl)
        for max_pages in (float("inf"), 1.5, "2", 0):
            with self.subTest(max_pages=max_pages), self.assertRaises(ValueError):
                GramlotServer(max_pages=max_pages)

    async def test_bootstrap_and_main_are_separate_and_owned(self):
        server = GramlotFileServer(PAGES)
        bootstrap = await server.open_page("/", owner="one")
        self.assertIn('id="gramlot-root"', bootstrap.html)
        self.assertNotIn("homer", bootstrap.html)
        self.assertIn('"closeUrl":"/gramlot/close"', bootstrap.html)
        self.assertIn('import {PageBootstrap} from "/assets/gramlot.js";await new PageBootstrap(', bootstrap.html)
        self.assertIn(f'<script type="module" nonce="{bootstrap.nonce}">', bootstrap.html)
        self.assertNotEqual(bootstrap.nonce, bootstrap.page_id)
        self.assertNotIn("<link", bootstrap.html)
        self.assertEqual((await call(server, bootstrap.page_id, owner="two"))["error"]["code"], "page_expired")
        result = (await call(server, bootstrap.page_id, owner="one"))["value"]
        self.assertEqual(result.nodes[0].attr["_text"], "homer")
        server.close_page(bootstrap.page_id, owner="one")
        self.assertEqual((await call(server, bootstrap.page_id, owner="one"))["error"]["code"], "page_expired")

    async def test_paths_expiry_capacity_and_async_page(self):
        server = GramlotFileServer(PAGES, max_pages=1)
        for path in ("/../index", "/missing", "/index.py", "/%2e%2e/index"):
            with self.assertRaises(LookupError):
                await server.open_page(path)
        first = await server.open_page("/index")
        with self.assertRaises(RuntimeError):
            await server.open_page("/index")
        server._pages[first.page_id] = (0, server._pages[first.page_id][1], None)
        self.assertEqual((await call(server, first.page_id))["error"]["code"], "page_expired")
        with tempfile.TemporaryDirectory() as directory:
            Path(directory, "index.py").write_text(
                'from gramlot import Page as Base\nclass Page(Base):\n'
                '    title = "</title><script>bad</script>"\n'
                '    async def main(self, root): root.div("async")\n')
            server = GramlotFileServer(directory, runtime_url="/x</script>.js")
            opened = await server.open_page("/")
            self.assertNotIn("<script>bad", opened.html)
            self.assertNotIn("/x</script>", opened.html)
            self.assertEqual((await call(server, opened.page_id))["value"].nodes[0].value, "async")


class MemoryServer(GramlotServer):
    """A GramlotServer that serves one Page class with no resources."""

    def __init__(self, page_class, **options):
        super().__init__(**options)
        self.page_class = page_class

    def resolve_page(self, path):
        return self.page_class

    def resolve_resources(self, path, cls):
        return {"css": [], "js": []}


class EmptyPage(Page):
    def main(self, root):
        pass


class AlignmentTests(unittest.IsolatedAsyncioTestCase):
    """0.2.12: the GramlotServer functionality shared with JS (js/tests/gramlot-server.test.js)."""

    async def test_close_all_empties_the_registry(self):
        server = MemoryServer(EmptyPage)
        first = await server.open_page("/", owner="one")
        await server.open_page("/", owner="two")
        self.assertIsNone(server.close_all())
        self.assertEqual(server._pages, {})
        self.assertEqual((await call(server, first.page_id, owner="one"))["error"]["code"], "page_expired")

    async def test_base_page_and_non_page_classes_are_rejected(self):
        for page_class in (Page, object, "index"):
            server = MemoryServer(page_class)
            with self.subTest(page_class=page_class), self.assertRaisesRegex(
                    TypeError, r"^Page modules must expose a subclass of gramlot\.Page$"):
                await server.open_page("/")
            self.assertEqual(server._pages, {})

    async def test_a_marked_value_that_is_not_a_method_is_not_found(self):
        class Marked:
            __gramlot_source__ = True

        class MarkedPage(EmptyPage):
            bad = Marked()

            @source
            def good(self, root):
                root.p("good")

        server = MemoryServer(MarkedPage)
        opened = await server.open_page("/")
        self.assertEqual((await call(server, opened.page_id, name="bad"))["error"],
                         {"code": "not_found", "name": "SourceNotFound", "message": "Unknown Source method: bad"})
        self.assertEqual((await call(server, opened.page_id, name="good"))["value"].nodes[0].value, "good")

    async def test_the_source_builder_is_named_after_the_method(self):
        names = []

        class RecordingBuilder(GramlotBuilder):
            def __init__(self, name=None, **options):
                super().__init__(name, **options)
                names.append(self.name)

        class RecordingPage(EmptyPage):
            source_builder = RecordingBuilder

            @source
            def details(self, root):
                pass

        server = MemoryServer(RecordingPage)
        opened = await server.open_page("/")
        await call(server, opened.page_id)
        await call(server, opened.page_id, name="details")
        self.assertEqual(names, ["main", "details"])

    async def test_no_page_is_registered_when_the_bootstrap_fails(self):
        server = MemoryServer(EmptyPage, runtime_url=object())
        with self.assertRaises(AttributeError):
            await server.open_page("/")
        self.assertEqual(server._pages, {})

    async def test_each_call_gets_a_fresh_page_with_its_page_id(self):
        class StatefulPage(Page):
            count = 0

            def main(self, root):
                self.count += 1
                root.div(str(self.count), id=self.page_id)

        server = MemoryServer(StatefulPage)
        opened = await server.open_page("/")
        for _ in range(2):
            node = (await call(server, opened.page_id))["value"].nodes[0]
            self.assertEqual((node.value, node.attr["id"]), ("1", opened.page_id))

    async def test_close_page_with_another_owner_keeps_the_page(self):
        server = MemoryServer(EmptyPage)
        opened = await server.open_page("/", owner="one")
        server.close_page(opened.page_id, owner="two")
        self.assertEqual(list(server._pages), [opened.page_id])
        server.close_page(opened.page_id, owner="one")
        self.assertEqual(server._pages, {})

    async def test_configured_urls_root_id_and_capabilities_reach_the_bootstrap(self):
        server = MemoryServer(EmptyPage, rpc_url="/r", close_url="/c", root_id="here")
        opened = await server.open_page("/", prefix="/app")
        self.assertIn(f'"config":{{"pageId":"{opened.page_id}","rpcUrl":"/app/r","closeUrl":"/app/c",'
                      '"rootId":"here","capabilities":[]}', opened.html)
        self.assertIn('<div id="here">', opened.html)
        self.assertNotIn("mainUrl", opened.html)
        self.assertNotIn("sourceUrl", opened.html)
        self.assertEqual(GramlotServer().capabilities, [])
        self.assertEqual(GramlotServer().rpc_url, "/gramlot/rpc")

    def test_pages_dir_is_the_folder_as_passed(self):
        self.assertEqual(GramlotFileServer("pages").pages_dir, Path("pages"))


if __name__ == "__main__":
    unittest.main()
