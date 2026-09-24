import asyncio
import json
from pathlib import Path
import tempfile
import unittest

from genro_tytx import from_tytx, to_tytx
from gramlot import GramlotBuilder
from gramlot.server import Host, PageExpired

PAGES = Path(__file__).parent / "fixtures/pages"


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
                Host(PAGES, page_ttl=page_ttl)
        for max_pages in (float("inf"), 1.5, "2", 0):
            with self.subTest(max_pages=max_pages), self.assertRaises(ValueError):
                Host(PAGES, max_pages=max_pages)

    async def test_bootstrap_and_main_are_separate_and_owned(self):
        host = Host(PAGES)
        bootstrap = await host.open_page("/", owner="one")
        self.assertIn('id="gramlot-root"', bootstrap.html)
        self.assertNotIn("homer", bootstrap.html)
        self.assertIn('"closeUrl": "/gramlot/close"', bootstrap.html)
        with self.assertRaises(PageExpired):
            await host.main(bootstrap.page_id, owner="two")
        result = from_tytx(await host.main(bootstrap.page_id, owner="one"))
        self.assertEqual(result.nodes[0].attr["_text"], "homer")
        host.close_page(bootstrap.page_id, owner="one")
        with self.assertRaises(PageExpired):
            await host.main(bootstrap.page_id, owner="one")

    async def test_paths_expiry_capacity_and_async_page(self):
        host = Host(PAGES, max_pages=1)
        for path in ("/../index", "/missing", "/index.py", "/%2e%2e/index"):
            with self.assertRaises(LookupError):
                await host.open_page(path)
        first = await host.open_page("/index")
        with self.assertRaises(RuntimeError):
            await host.open_page("/index")
        host._pages[first.page_id] = (0, host._pages[first.page_id][1], None)
        with self.assertRaises(PageExpired):
            await host.main(first.page_id)
        with tempfile.TemporaryDirectory() as directory:
            Path(directory, "index.py").write_text(
                'from gramlot import Page as Base\nclass Page(Base):\n'
                '    title = "</title><script>bad</script>"\n'
                '    async def main(self, root): root.div("async")\n')
            host = Host(directory, runtime_url="/x</script>.js")
            opened = await host.open_page("/")
            self.assertNotIn("<script>bad", opened.html)
            self.assertNotIn("/x</script>", opened.html)
            self.assertIn("async", await host.main(opened.page_id))


if __name__ == "__main__":
    unittest.main()
