"""PageStore.source_builder: Source replies use the page's collections, loaded by the server."""
import asyncio
import unittest

from gramlot import Page, PageStore
from gramlot.server import GramlotServer


class EmptyPage(Page):
    def main(self, root):
        root.div()


class ReplyStore(PageStore):
    pass


class ReplyServer(GramlotServer):
    def resolve_page(self, path):
        return EmptyPage

    def resolve_page_store(self, page_class):
        return ReplyStore

    def resolve_resources(self, path, cls):
        return {"css": [], "js": []}


class SourceBuilderTests(unittest.TestCase):
    def test_server_store_builds_with_standard_collections(self):
        server = ReplyServer(websocket_url="/gramlot/store", css_theme=False)
        self.addCleanup(server.close_all)
        page_id = asyncio.run(server.open_page("/", owner="alice")).page_id
        store = server.page_store(page_id, owner="alice")
        first, second = store.source_builder(), store.source_builder()
        self.assertIsNot(first, second)
        for tag in ("tabContainer", "formlet", "grid"):
            self.assertIsNotNone(first.schema_tag(tag), tag)
        first.root.tabContainer().contentPane(title="One").formlet()

    def test_store_outside_a_server_has_no_source_builder(self):
        store = ReplyStore()
        self.addCleanup(store.close)
        with self.assertRaisesRegex(RuntimeError, "opened by GramlotServer"):
            store.source_builder()


if __name__ == "__main__":
    unittest.main()
