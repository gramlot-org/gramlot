"""Python recipe trigger contracts, derived from legacy and Gramlot's JS router."""
import unittest

from genro_bag import Bag
from gramlot import PageStore
from gramlot.page.builder import GramlotBuilder


class TriggerStore(PageStore):
    def __init__(self):
        super().__init__()
        self.calls = []

    def main(self, root):
        root.dataSetter("form", Bag(dict(order=Bag(dict(quantity=2)), other=0)))
        root.dataController(func="record", order="^form.order")

    def record(self, node, order, *, _node, _reason, _triggerpars):
        self.calls.append((node, order, _node, _reason, _triggerpars))


class PageStoreReactivityTests(unittest.TestCase):
    def store(self, cls=TriggerStore):
        store = cls()
        self.addCleanup(store.close)
        store.start()
        return store

    def test_node_child_container_and_unrelated_paths_with_full_context(self):
        store = self.store()
        store.data.set_item("form.order.quantity", 3, _reason="binder-1")
        store.data.set_item("form.order", Bag(dict(quantity=4)))
        store.data.set_item("form", Bag(dict(order=Bag(dict(quantity=5)))))
        store.data.set_item("unrelated", 1)
        self.assertEqual([call[3] for call in store.calls], ["child", "node", "container"])
        source, _, changed, reason, context = store.calls[0]
        event = context["kw"]
        self.assertIsNot(source, changed)
        self.assertIs(context["kw"].node, changed)
        self.assertEqual(event.path, "form.order.quantity")
        self.assertEqual(event.reason, "binder-1")
        self.assertEqual((event.oldvalue, event.value), (2, 3))
        self.assertEqual(context["trigger_reason"], reason)
        self.assertEqual(event.registration.parameter, "order")
        self.assertEqual(event.registration.path, "form.order")
        self.assertIs(event.registration.source_node, source)
        # Event values are snapshots even after an ancestor is replaced.
        self.assertEqual(store.calls[1][4]["kw"].value.get_item("quantity"), 4)

    def test_insert_delete_and_ancestor_deletion_keep_the_original_path(self):
        store = self.store()
        store.data.set_item("form.order.extra", 7)
        store.data.pop_node("form.order.extra")
        store.data.pop_node("form")
        events = [call[4]["kw"] for call in store.calls]
        self.assertEqual([(e.path, e.evt, e.level) for e in events], [
            ("form.order.extra", "ins", "child"),
            ("form.order.extra", "del", "child"),
            ("form", "del", "container"),
        ])
        self.assertIsNone(store.calls[-1][1])

    def test_one_event_has_a_different_level_for_each_dependency(self):
        class Store(TriggerStore):
            def main(self, root):
                root.dataSetter("form", Bag(dict(order=Bag(dict(quantity=2)))))
                root.dataController(func="observe", parent="^form", exact="^form.order",
                                    descendant="^form.order.quantity")

            def observe(self, node, parent, exact, descendant, *, _triggerpars):
                change = _triggerpars["kw"]
                self.calls.append((change.registration.parameter, change.level))

        store = self.store(Store)
        store.data.set_item("form.order", Bag(dict(quantity=3)))
        self.assertEqual(store.calls, [("parent", "child"), ("exact", "node"), ("descendant", "container")])

    def test_attributes_only_notify_their_own_pointers(self):
        class Store(TriggerStore):
            def main(self, root):
                root.dataSetter("form", Bag(dict(order=Bag(dict(quantity=2)))))
                root.dataController(func="observe", value="^form.order.quantity",
                                    currency="^form.order.quantity?currency", tax="^form.order.quantity?tax")

            def observe(self, node, value, currency, tax, *, _triggerpars):
                self.calls.append((_triggerpars["kw"], value, currency, tax))

        store = self.store(Store)
        store.data.get_node("form.order.quantity").set_attr({"currency": "EUR"})
        event, value, currency, tax = store.calls[-1]
        self.assertEqual(len(store.calls), 1)
        self.assertEqual((event.registration.parameter, event.level, value, currency, tax),
                         ("currency", "node", 2, "EUR", None))
        self.assertEqual(event.attrs_diff["currency"], {"old": None, "new": "EUR"})
        store.calls.clear()
        store.data.set_item("form.order.quantity", 3)
        self.assertEqual([c[0].registration.parameter for c in store.calls], ["value"])
        store.calls.clear()
        store.data.get_node("form.order").set_attr({"currency": "USD"})
        self.assertEqual(store.calls, [])
        store.data.set_item("form.order", Bag(dict(quantity=4)))
        self.assertEqual([(c[0].registration.parameter, c[0].level) for c in store.calls],
                         [("value", "container"), ("currency", "container"), ("tax", "container")])
        store.calls.clear()
        store.data.pop_node("form.order.quantity")
        self.assertEqual([c[0].registration.parameter for c in store.calls], ["value", "currency", "tax"])

    def test_cascade_preserves_outer_context_and_reads_passive_values_fresh(self):
        class Store(TriggerStore):
            def main(self, root):
                root.dataSetter("input", 2)
                root.dataSetter("factor", 3)
                root.dataSetter("result", 0)
                root.dataController(func="calculate", value="^input", factor="=factor")
                root.dataController(func="result_changed", result="^result")

            def calculate(self, node, value, factor, *, _reason, _triggerpars):
                self.calls.append(("before", _triggerpars["kw"].path, _reason))
                self.data.set_item("result", value * factor)
                self.calls.append(("after", _triggerpars["kw"].path, _reason))

            def result_changed(self, node, result, *, _triggerpars):
                self.calls.append(("derived", _triggerpars["kw"].path, result))

        store = self.store(Store)
        store.data.set_item("factor", 4)
        self.assertEqual(store.calls, [])
        store.data.set_item("input", 3)
        self.assertEqual(store.calls, [("before", "input", "node"), ("after", "input", "node"), ("derived", "result", 12)])

    def test_start_formula_context_and_disposal_without_any_binders(self):
        class Store(TriggerStore):
            def main(self, root):
                root.dataSetter("quantity", 2)
                root.dataFormula("total", func="calculate", quantity="^quantity", _onStart=True)

            def calculate(self, quantity, *, _node, _reason, _triggerpars):
                self.calls.append((_node, _reason, _triggerpars))
                return quantity * 10

        store = self.store(Store)
        self.assertEqual(store.calls[0], (None, "start", {"kw": None, "trigger_reason": "start"}))
        self.assertEqual(store.data.get_item("total"), 20)
        store.data.set_item("quantity", 3)
        self.assertEqual(store.calls[-1][1], "node")
        self.assertEqual(store.data.get_item("total"), 30)
        with self.assertRaises(RuntimeError):
            store.start()
        store.close()
        store.data.set_item("quantity", 4)
        self.assertEqual(store.data.get_item("total"), 30)
        self.assertIsNone(store.builder._binding_runtime)

    def test_recipe_construction_for_the_browser_stays_inert(self):
        class BrowserBuilder(GramlotBuilder):
            def main(self, root):
                root.dataSetter("quantity", 2)
                root.dataController(func="not_a_python_method", quantity="^quantity", _onStart=True)

        builder = BrowserBuilder()
        builder.create()
        self.assertIsNone(builder.data.get_item("quantity"))
        builder.data.set_item("quantity", 3)
        self.assertEqual(builder.data.get_item("quantity"), 3)

    def test_failed_start_releases_subscriptions(self):
        class Store(TriggerStore):
            def main(self, root):
                root.dataSetter("quantity", 2)
                root.dataController(func="fail", quantity="^quantity", _onStart=True)

            def fail(self, node, quantity):
                self.calls.append(quantity)
                raise ValueError("Application error")

        store = Store()
        with self.assertRaisesRegex(ValueError, "Application error"):
            store.start()
        store.data.set_item("quantity", 3)
        self.assertEqual(store.calls, [2])
        self.assertTrue(store._closed)
        self.assertIsNone(store.builder._binding_runtime)

    def test_user_changes_filter_and_local_fired_events_follow_router_levels(self):
        class Store(TriggerStore):
            def main(self, root):
                root.dataSetter("form", Bag(dict(order=Bag(dict(quantity=2)))))
                root.dataController(func="observe", order="^form.order", _userChanges=True)
                root.dataController(func="observe", order="^form")

            def observe(self, node, order, *, _reason):
                self.calls.append((node.attr["order"], _reason))

        store = self.store(Store)
        store.data.set_item("form.order.quantity", 3)
        self.assertEqual(store.calls, [("^form", "child")])
        store.calls.clear()
        store.data.set_item("form.order", Bag(dict(quantity=4)))
        self.assertEqual(store.calls, [("^form.order", "node"), ("^form", "child")])
        store.calls.clear()
        store.data.set_item("form.order", Bag(dict(quantity=5)), _fired=True)
        self.assertEqual(store.calls, [("^form.order", "node")])


if __name__ == "__main__":
    unittest.main()
