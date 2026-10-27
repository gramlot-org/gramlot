"""PageStore changes, origin, recipe and ownership contracts for the Uvicorn PoC."""
import tempfile
import unittest
from decimal import Decimal
from pathlib import Path

from genro_bag import Bag
from genro_tytx import from_tytx
from gramlot import PageStore
from gramlot.server import GramlotFileServer, PageExpired


class PriceStore(PageStore):
    def main(self, root):
        root.dataSetter("order", Bag(dict(quantity=2, price=Decimal("12.50"), total=Decimal("25"))))
        root.dataController(func="calculate", quantity="^order.quantity")

    def calculate(self, node, quantity):
        self.data.set_item("order.total", quantity * self.data.get_item("order.price"))


class PageStoreTests(unittest.TestCase):
    def setUp(self):
        self.store = PriceStore()
        self.store.start()
        self.messages = []
        self.addCleanup(self.store.close)

    def subscribe(self, binder, path="order"):
        self.store.subscribe(binder, path, lambda text: self.messages.append(from_tytx(text)))

    def change(self, binder, path, value=None, evt="upd_value", attr=None):
        self.store.change(binder, dict(path=path, value=value, evt=evt, attr=attr or {}))

    def test_snapshot_two_binders_and_derived_response_to_sender(self):
        self.subscribe("a")
        self.subscribe("b")
        self.change("a", "quantity", 3)
        self.assertEqual([m["op"] for m in self.messages[:2]], ["snapshot", "snapshot"])
        self.assertEqual(self.messages[0]["value"].get_item("quantity"), 2)
        self.assertEqual([(m["binderId"], m["path"]) for m in self.messages[2:]],
                         [("b", "quantity"), ("a", "total"), ("b", "total")])
        self.assertEqual(self.messages[-1]["value"], Decimal("37.50"))

    def test_overlapping_paths_attributes_deletion_and_unsubscribe(self):
        self.subscribe("a")
        self.subscribe("b", "order.price")
        self.subscribe("c")
        self.messages.clear()
        self.change("a", "price", Decimal("9.20"), attr={"currency": "EUR", "optional": None})
        self.assertEqual(self.messages[0]["path"], "")
        self.assertEqual(self.messages[0]["attr"], {"currency": "EUR", "optional": None})
        self.change("a", "price", evt="upd_attrs", attr={"currency": "USD"})
        self.assertEqual(self.store.data.get_item("order.price"), Decimal("9.20"))
        self.assertEqual(self.messages[-1]["evt"], "upd_attrs")
        self.store.unsubscribe("b")
        self.messages.clear()
        self.change("a", "price", evt="del")
        self.assertEqual([(m["binderId"], m["evt"]) for m in self.messages], [("c", "del")])

    def test_parent_replacement_reaches_child_subscription(self):
        self.subscribe("a", "order")
        self.subscribe("b", "order.price")
        self.messages.clear()
        self.change("a", "", Bag(dict(quantity=4, price=Decimal("3"))))
        self.assertEqual(self.messages[0]["binderId"], "b")
        self.assertEqual(self.messages[0]["value"], Decimal("3"))
        self.assertEqual(self.messages[0]["op"], "change")
        self.assertEqual(self.messages[0]["path"], "")

    def test_rejected_change_does_not_escape_subscription(self):
        self.subscribe("a")
        for path in ("../secret", ".secret", "price?currency", "price.#0"):
            with self.assertRaises(ValueError):
                self.change("a", path, "forbidden")
        with self.assertRaises(KeyError):
            self.change("other", "price", 0)
        with self.assertRaises(ValueError):
            self.store.change("a", dict(path="price", evt="upd_value", value=0, attr={}, fired=True))
        self.assertEqual(self.store.data.get_item("order.price"), Decimal("12.50"))

    def test_formula_start_and_reactive_vs_read_only_parameters(self):
        class FormulaStore(PageStore):
            def main(self, root):
                root.dataSetter("amount", 2)
                root.dataSetter("factor", 3)
                root.dataFormula("result", func="multiply", amount="^amount", factor="=factor", _onStart=True)

            def multiply(self, amount, factor):
                return amount * factor

        store = FormulaStore()
        self.addCleanup(store.close)
        store.start()
        self.assertEqual(store.data.get_item("result"), 6)
        store.data.set_item("factor", 4)
        self.assertEqual(store.data.get_item("result"), 6)
        store.data.set_item("amount", 3)
        self.assertEqual(store.data.get_item("result"), 12)

    def test_close_releases_recipe_and_subscriptions(self):
        self.subscribe("a")
        self.store.close()
        self.store.data.set_item("order.quantity", 99)
        self.assertEqual(self.store.data.get_item("order.total"), Decimal("25"))
        self.assertEqual(len(self.messages), 1)
        with self.assertRaises(RuntimeError):
            self.subscribe("b")

    def test_root_deletion_keeps_the_subscription_and_notifies_the_peer(self):
        store = PageStore()
        store.start()
        self.addCleanup(store.close)
        store.data.set_item("order", Bag(dict(price=10)))
        for binder in ("a", "b"):
            store.subscribe(binder, "order", lambda text: self.messages.append(from_tytx(text)))
        self.messages.clear()
        store.change("a", dict(path="", evt="del"))
        self.assertEqual([(m["binderId"], m["path"], m["evt"]) for m in self.messages],
                         [("b", "", "del")])
        self.assertIsNone(store.data.get_node("order"))


class HostingTests(unittest.IsolatedAsyncioTestCase):
    async def test_declared_store_activates_without_a_websocket_or_binders(self):
        with tempfile.TemporaryDirectory() as directory:
            Path(directory, "index.py").write_text(
                "from gramlot import Page as BasePage, PageStore as BasePageStore\n"
                "class Page(BasePage):\n"
                " def main(self, root): root.h1('Store')\n"
                "class PageStore(BasePageStore):\n"
                " def main(self, root):\n"
                "  root.dataSetter('quantity', 2)\n"
                "  root.dataFormula('total', func='calculate', quantity='^quantity', _onStart=True)\n"
                " def calculate(self, quantity): return quantity * 10\n")
            server = GramlotFileServer(directory)
            self.addCleanup(server.close_all)
            opened = await server.open_page("/", owner="owner")
            self.assertNotIn('"websocketUrl"', opened.html)
            store = server.page_store(opened.page_id, owner="owner")
            self.assertEqual(store.data.get_item("total"), 20)
            store.data.set_item("quantity", 3)
            self.assertEqual(store.data.get_item("total"), 30)
            server.close_page(opened.page_id, owner="owner")
            self.assertIsNone(store.builder._binding_runtime)

    async def test_module_class_and_owner_lifecycle(self):
        with tempfile.TemporaryDirectory() as directory:
            Path(directory, "index.py").write_text(
                "from gramlot import Page as BasePage, PageStore as BasePageStore\n"
                "class Page(BasePage):\n"
                " def main(self, root): root.h1('Store')\n"
                "class PageStore(BasePageStore):\n"
                " def main(self, root): root.dataSetter('server', {'name':'Ada'})\n")
            server = GramlotFileServer(directory, websocket_url="/gramlot/store")
            self.addCleanup(server.close_all)
            opened = await server.open_page("/", owner="owner", prefix="/py")
            self.assertIn('"websocketUrl":"/py/gramlot/store"', opened.html)
            store = server.page_store(opened.page_id, owner="owner")
            self.assertEqual(store.data.get_item("server.name"), "Ada")
            with self.assertRaises(PageExpired):
                server.page_store(opened.page_id, owner="outsider")
            other = await server.open_page("/", owner="owner")
            self.assertIsNot(store, server.page_store(other.page_id, owner="owner"))
            server.close_page(opened.page_id, owner="owner")
            self.assertTrue(store._closed)
            self.assertFalse(server.page_store(other.page_id, owner="owner")._closed)


if __name__ == "__main__":
    unittest.main()

