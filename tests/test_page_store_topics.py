"""Topic execution and same-owner PageStore routing on the neutral server."""
import asyncio
from datetime import date
from decimal import Decimal
import unittest

from genro_bag import Bag
from genro_tytx import from_tytx, to_tytx
from gramlot import Page, PageStore
from gramlot.server import GramlotServer, InvalidRequest


class TopicStore(PageStore):
    def __init__(self):
        super().__init__()
        self.calls = []

    def main(self, root):
        self.data.set_item("factor", 2)
        root.dataController(func="receive", subscribe_load=True, fixed="declared", factor="=factor")
        root.dataController(func="observe", record="^record")

    def receive(self, node, value, fixed, factor, *, _node, _reason, _triggerpars, _subscription_kwargs,
                _subscription_metadata):
        self.calls.append((value, fixed, factor, _node, _reason, _triggerpars, _subscription_kwargs,
                           _subscription_metadata))
        self.data.set_item("record", value)

    def observe(self, node, record):
        self.data.set_item("seen", record)


class EmptyPage(Page):
    def main(self, root):
        root.div("Topic test")


class TopicServer(GramlotServer):
    def resolve_page(self, path):
        return EmptyPage

    def resolve_page_store(self, page_class):
        return TopicStore

    def resolve_resources(self, path, cls):
        return {"css": [], "js": []}


class PageStoreTopicTests(unittest.TestCase):
    def store(self, cls=TopicStore):
        store = cls()
        self.addCleanup(store.close)
        store.start()
        return store

    def test_payload_context_precedence_fresh_arguments_and_data_cascade(self):
        store = self.store()
        store.data.set_item("factor", 7)
        payload = {"value": Bag(dict(price=Decimal("12.50"), day=date(2026, 10, 27))), "fixed": "payload"}
        store.publish("load", payload)
        call = store.calls[0]
        self.assertEqual(call[1:6], ("declared", 7, None, "load", {"kw": None, "trigger_reason": "load"}))
        self.assertIs(call[6], payload)
        self.assertEqual(call[7], {})
        self.assertEqual(store.data.get_item("seen.price"), Decimal("12.50"))
        self.assertEqual(store.data.get_item("seen.day"), date(2026, 10, 27))

    def test_multiple_subscribers_false_declarations_and_formula(self):
        class Store(PageStore):
            def main(self, root):
                root.dataController(func="first", subscribe_run=False)
                root.dataFormula("total", func="second", subscribe_run=True, factor="=factor")

            def first(self, node, value):
                self.data.set_item("factor", value)

            def second(self, value, factor):
                return value * factor

        store = self.store(Store)
        store.publish("unknown", {"value": 9})
        self.assertIsNone(store.data.get_node("total"))
        store.publish("run", {"value": 3})
        self.assertEqual(store.data.get_item("total"), 9)
        store.publish("run", {"value": 4})
        self.assertEqual(store.data.get_item("total"), 16)

    def test_metadata_is_separate_isolated_per_subscriber_and_not_inherited_by_nested_publish(self):
        class Store(PageStore):
            def main(self, root):
                root.dataController(func="first", subscribe_run=True)
                root.dataController(func="second", subscribe_run=True)
                root.dataController(func="nested", subscribe_nested=True)

            def first(self, node, _subscription_metadata):
                _subscription_metadata["pageId"] = "changed"
                self.publish("nested")

            def second(self, node, _subscription_metadata):
                self.seen = _subscription_metadata

            def nested(self, node, _subscription_metadata):
                self.nested_seen = _subscription_metadata

        store = self.store(Store)
        metadata = {"pageId": "source"}
        store.publish("run", {"_subscription_metadata": {"pageId": "forged"}}, metadata=metadata)
        self.assertEqual(store.seen, {"pageId": "source"})
        self.assertEqual(metadata, {"pageId": "source"})
        self.assertEqual(store.nested_seen, {})

    def test_start_can_publish_after_all_subscriptions_are_registered(self):
        class Store(PageStore):
            def main(self, root):
                root.dataController(func="initialize", _onStart=True)
                root.dataController(func="receive", subscribe_ready=True)

            def initialize(self, node):
                self.publish("ready", {"value": 42})

            def receive(self, node, value):
                self.data.set_item("result", value)

        self.assertEqual(self.store(Store).data.get_item("result"), 42)

    def test_errors_do_not_retain_messages_and_disposal_removes_topics(self):
        store = self.store()
        with self.assertRaises(TypeError):
            store.publish("load", {"unexpected": 1})
        store.publish("load", {"value": 42})
        self.assertEqual(len(store.calls), 1)
        for topic, payload in [("", {}), (42, {}), ("load", []), ("load", {1: 2})]:
            with self.assertRaises((ValueError, TypeError)):
                store.publish(topic, payload)
        runtime = store.builder._binding_runtime
        store.close()
        self.assertFalse(runtime.topics)
        with self.assertRaises(RuntimeError):
            store.publish("load", {"value": 99})
        unstarted = TopicStore()
        self.addCleanup(unstarted.close)
        with self.assertRaisesRegex(RuntimeError, "not active"):
            unstarted.publish("load", {})

    def test_user_changes_topic_filter_matches_browser(self):
        class Store(PageStore):
            def main(self, root):
                root.dataController(func="receive", subscribe_run=True, subscribe_node=True, _userChanges=True)

            def receive(self, node, value):
                self.data.set_item("value", value)

        store = self.store(Store)
        store.publish("run", {"value": 1})
        self.assertIsNone(store.data.get_node("value"))
        store.publish("node", {"value": 2})
        self.assertEqual(store.data.get_item("value"), 2)


class PageStorePublicationRoutingTests(unittest.TestCase):
    def setUp(self):
        self.server = TopicServer(websocket_url="/gramlot/store", css_theme=False)
        self.addCleanup(self.server.close_all)
        self.source = self.open("alice")
        self.target = self.open("alice")
        self.foreign = self.open("bob")

    def open(self, owner):
        return asyncio.run(self.server.open_page("/", owner=owner)).page_id

    def message(self, **extra):
        return to_tytx(dict(op="publish", id="pub-one", pageId=self.source, topic="load", payload={"value": 42}, **extra))

    def reject(self, text, owner="alice"):
        wire, dispatch = self.server.prepare_publish(text, owner=owner)
        self.assertIsNone(dispatch)
        return from_tytx(wire)

    def test_acceptance_precedes_implicit_self_explicit_self_and_other_store_execution(self):
        for target in [None, self.source, self.target]:
            text = self.message() if target is None else self.message(targetPageId=target)
            store = self.server.page_store(target or self.source, owner="alice")
            before = len(store.calls)
            wire, dispatch = self.server.prepare_publish(text, owner="alice")
            self.assertEqual(from_tytx(wire), {"id": "pub-one", "contentType": "data", "value": "ok"})
            self.assertEqual(len(store.calls), before)
            dispatch()
            self.assertEqual(len(store.calls), before + 1)
            self.assertEqual(store.data.get_item("record"), 42)
            self.assertEqual(store.calls[-1][7], {"pageId": self.source})

    def test_payload_cannot_spoof_validated_sender_metadata(self):
        payload = {"value": 42, "_subscription_metadata": {"pageId": self.foreign}}
        wire, dispatch = self.server.prepare_publish(to_tytx(dict(
            op="publish", id="metadata", pageId=self.source, targetPageId=self.target,
            topic="load", payload=payload)), owner="alice")
        self.assertEqual(from_tytx(wire)["value"], "ok")
        dispatch()
        call = self.server.page_store(self.target, owner="alice").calls[-1]
        self.assertEqual(call[6], payload)
        self.assertEqual(call[7], {"pageId": self.source})

    def test_browser_publication_is_typed_targeted_and_separate_from_local_subscribers(self):
        received = []
        self.server.connect_page_channel(self.source, received.append, owner="alice")
        store = self.server.page_store(self.target, owner="alice")
        record = Bag(dict(price=Decimal("12.50")))
        self.assertIsNone(store.publish("loaded", {"record": record, "_subscription_metadata": {"pageId": "forged"}}, page_id=self.source))
        record.set_item("price", Decimal("99"))
        message = from_tytx(received[0])
        self.assertEqual((message["op"], message["pageId"], message["topic"]),
                         ("publish", self.source, "loaded"))
        self.assertEqual(message["payload"]["record"].get_item("price"), Decimal("12.50"))
        self.assertEqual(message["metadata"], {"pageId": self.target})
        self.assertNotIn("id", message)
        self.assertFalse(store.calls)
        with self.assertRaises(ValueError):
            self.server.connect_page_channel(self.source, received.append, owner="alice")

    def test_browser_publication_checks_owner_connection_lifetime_and_payload(self):
        from gramlot.server import PageExpired
        store = self.server.page_store(self.source, owner="alice")
        received = []
        self.server.connect_page_channel(self.foreign, received.append, owner="bob")
        for target in (self.foreign, self.target, "missing"):
            with self.assertRaises(PageExpired):
                store.publish("loaded", {}, page_id=target)
        self.server.connect_page_channel(self.target, received.append, owner="alice")
        for topic, payload, target in (("", {}, self.target), ("loaded", [], self.target),
                                       ("loaded", {}, "")):
            with self.assertRaises(InvalidRequest):
                store.publish(topic, payload, page_id=target)
        self.server.close_page(self.target, owner="alice")
        self.assertNotIn(self.target, self.server._page_channels)
        with self.assertRaises(PageExpired):
            store.publish("loaded", {}, page_id=self.target)
        self.assertFalse(received)
        self.server.close_all()
        self.assertFalse(self.server._page_channels)
        with self.assertRaises(RuntimeError):
            store.publish("loaded", {}, page_id=self.foreign)

    def test_foreign_missing_expired_and_forged_sender_are_rejected_before_execution(self):
        for target in [self.foreign, "missing"]:
            self.assertEqual(self.reject(self.message(targetPageId=target))["error"]["code"], "page_expired")
        self.assertEqual(self.reject(self.message(targetPageId=self.foreign), owner="bob")["error"]["code"], "page_expired")
        self.assertFalse(self.server.page_store(self.foreign, owner="bob").calls)
        self.server.close_page(self.target, owner="alice")
        self.assertEqual(self.reject(self.message(targetPageId=self.target))["error"]["code"], "page_expired")
        self.server.close_page(self.source, owner="alice")
        self.assertEqual(self.reject(self.message())["error"]["code"], "page_expired")

    def test_malformed_publications_are_not_dispatched(self):
        base = dict(op="publish", id="pub-one", pageId=self.source, topic="load", payload={"value": 42})
        for patch in [{"payload": []}, {"payload": None}, {"topic": ""}, {"pageId": None},
                      {"targetPageId": None}, {"targetPageId": ""}, {"owner": "alice"},
                      {"wait": True}, {"sync": True}, {"nowait": False},
                      {"metadata": {"pageId": self.foreign}}]:
            with self.subTest(patch=patch):
                response = self.reject(to_tytx({**base, **patch}))
                self.assertEqual(response["id"], "pub-one")
                self.assertEqual(response["error"]["code"], "invalid_request")
        for bad_id in (None, "", 12):
            with self.assertRaises(InvalidRequest):
                self.server.prepare_publish(to_tytx({**base, "id": bad_id}), owner="alice")
        with self.assertRaises(InvalidRequest):
            self.server.prepare_publish("not TYTX", owner="alice")
        self.assertFalse(self.server.page_store(self.source, owner="alice").calls)

    def test_subscriber_failure_does_not_replace_acceptance(self):
        wire, dispatch = self.server.prepare_publish(to_tytx(dict(
            op="publish", id="accepted", pageId=self.source, topic="load", payload={})), owner="alice")
        with self.assertRaises(TypeError):
            dispatch()
        self.assertEqual(from_tytx(wire), {"id": "accepted", "contentType": "data", "value": "ok"})
