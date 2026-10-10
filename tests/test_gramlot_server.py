"""The 0.2.14 envelope of ``GramlotServer.call``; the JavaScript counterpart is ``js/tests/gramlot-server.test.js``."""
import asyncio
import datetime
import json
import os
from pathlib import Path
import unittest
from unittest import mock

from genro_builders.builder import SourceBag
from genro_tytx import from_tytx, to_tytx
from gramlot import Page, endpoint, source
from gramlot.page.base import endpoint_methods, source_methods
from gramlot.server import GramlotFileServer, GramlotServer, InvalidRequest

PAGES = Path(__file__).parent / "fixtures/pages"


def call(server, page_id, content_type, name, params=None, owner=None):
    """The decoded response envelope of one ``call``."""
    text = to_tytx({"id": "r1", "pageId": page_id, "contentType": content_type, "name": name,
                    "params": params or {}})
    return from_tytx(asyncio.run(server.call(text, owner=owner)))


def open_page(server, owner=None):
    return asyncio.run(server.open_page("/", owner=owner)).page_id


def memory_server(page_class):
    """A GramlotServer that serves ``page_class`` with no resources."""
    class MemoryServer(GramlotServer):
        def resolve_page(self, path):
            return page_class

        def resolve_resources(self, path, cls):
            return {"css": [], "js": []}

    return MemoryServer()


def server_and_page(server):
    return server, open_page(server)


class ElementAuthPage(Page):
    def main(self, root):
        root.p("public")
        root.div(auth="admin").span("nested")


class NumberAuthPage(Page):
    def main(self, root):
        root.p("number", auth=3)


class CallTests(unittest.TestCase):
    def test_bootstrap_config_carries_rpc_url_close_url_and_capabilities(self):
        opened = asyncio.run(GramlotFileServer(PAGES).open_page("/"))
        self.assertIn(f'"config":{{"pageId":"{opened.page_id}","rpcUrl":"/gramlot/rpc",'
                      '"closeUrl":"/gramlot/close","rootId":"gramlot-root","capabilities":[]}', opened.html)
        self.assertNotIn("mainUrl", opened.html)
        self.assertNotIn("sourceUrl", opened.html)

    def test_main_and_fragments_build_their_source(self):
        server = GramlotFileServer(PAGES)
        page_id = open_page(server)
        text = asyncio.run(server.call(to_tytx({"id": "r1", "pageId": page_id, "contentType": "source",
                                                "name": "main", "params": {}})))
        envelope = json.loads(text)
        self.assertEqual(list(envelope), ["id", "contentType", "value"])
        self.assertEqual((envelope["id"], envelope["contentType"]), ("r1", "source"))
        # The value is the fragment text of 0.2.12, carried as a string in the envelope.
        main = from_tytx(envelope["value"])
        self.assertIsInstance(main, SourceBag)
        self.assertEqual(main.nodes[0].attr["_text"], "homer")
        self.assertEqual(from_tytx(text)["value"].nodes[0].attr["_text"], "homer")
        for params, expected in (({}, "check"), ({"text": "other"}, "other")):
            self.assertEqual(call(server, page_id, "source", "check_fragment", params)["value"].nodes[0].value, expected)

    def test_unknown_names_are_not_found_for_both_content_types(self):
        server = GramlotFileServer(PAGES)
        page_id = open_page(server)
        for content_type, name, error_name in (("source", "nope", "SourceNotFound"), ("source", "check_endpoint", "SourceNotFound"),
                                               ("data", "nope", "EndpointNotFound"), ("data", "main", "EndpointNotFound"),
                                               ("data", "check_fragment", "EndpointNotFound")):
            with self.subTest(content_type=content_type, name=name):
                error = call(server, page_id, content_type, name)["error"]
                self.assertEqual((error["code"], error["name"]), ("not_found", error_name))
        self.assertEqual(call(server, page_id, "data", "nope")["error"],
                         {"code": "not_found", "name": "EndpointNotFound", "message": "Unknown endpoint: nope"})

    def test_endpoints_return_typed_values_and_page_expired_covers_owner_and_close(self):
        server = GramlotFileServer(PAGES)
        page_id = open_page(server, owner="one")
        # The date crosses the envelope typed (::D) and comes back as the same typed value.
        for value in (3, "x", datetime.date(2020, 1, 1)):
            with self.subTest(value=value):
                response = call(server, page_id, "data", "check_endpoint", {"value": value}, owner="one")
                self.assertEqual(response, {"id": "r1", "contentType": "data", "value": value})
                self.assertIs(type(response["value"]), type(value))
        self.assertEqual(call(server, page_id, "data", "check_endpoint", {"value": 3}, owner="two")["error"]["code"],
                         "page_expired")
        server.close_page(page_id, owner="one")
        self.assertEqual(call(server, page_id, "data", "check_endpoint", {"value": 3}, owner="one")["error"]["code"],
                         "page_expired")

    def test_auth_is_closed_by_default_and_evaluate_auth_decides(self):
        server = GramlotFileServer(PAGES)
        page_id = open_page(server)
        self.assertEqual(call(server, page_id, "data", "check_endpoint_auth")["error"],
                         {"code": "not_authenticated", "name": "NotAuthenticated", "message": "Access refused: check_endpoint_auth"})
        self.assertEqual(call(server, page_id, "data", "check_endpoint", {"value": 1})["value"], 1)
        for outcome in (None, "not_authorized"):
            rules = []

            class Custom(GramlotFileServer):
                def evaluate_auth(self, rule, *, owner):
                    rules.append((rule, owner))
                    return outcome

            custom = Custom(PAGES)
            response = call(custom, open_page(custom, owner="one"), "data", "check_endpoint_auth", owner="one")
            with self.subTest(outcome=outcome):
                if outcome is None:
                    self.assertEqual(response["value"], "allowed")
                else:
                    self.assertEqual(response["error"]["code"], "not_authorized")
                self.assertEqual(rules, [("admin", "one")])

    def test_evaluate_auth_outside_its_three_outcomes_is_application_error(self):
        class Unsure(GramlotFileServer):
            def evaluate_auth(self, rule, *, owner):
                return "maybe"

        server = Unsure(PAGES)
        self.assertEqual(call(server, open_page(server), "data", "check_endpoint_auth")["error"],
                         {"code": "application_error", "name": "TypeError",
                          "message": "evaluate_auth must return None, 'not_authenticated' or 'not_authorized'"})

    def test_an_element_whose_auth_rule_is_refused_never_reaches_the_client(self):
        main = call(*server_and_page(memory_server(ElementAuthPage)), "source", "main")["value"]
        self.assertEqual([(node.node_tag, node.value) for node in main], [("p", "public")])
        server = GramlotFileServer(PAGES)
        fragment = call(server, open_page(server), "source", "check_fragment_auth")["value"]
        self.assertEqual([(node.node_tag, node.value) for node in fragment], [("span", "check-public")])

    def test_an_evaluator_that_allows_keeps_every_element(self):
        rules = []

        class Allowing(GramlotServer):
            def resolve_page(self, path):
                return ElementAuthPage

            def resolve_resources(self, path, cls):
                return {"css": [], "js": []}

            def evaluate_auth(self, rule, *, owner):
                rules.append((rule, owner))
                return None

        server = Allowing()
        main = call(server, open_page(server, owner="one"), "source", "main", owner="one")["value"]
        self.assertEqual([node.node_tag for node in main], ["p", "div"])
        self.assertNotIn("auth", main.nodes[1].attr)
        self.assertEqual(main.nodes[1].value.nodes[0].value, "nested")
        self.assertEqual(rules, [(None, "one"), ("admin", "one")])

    def test_a_non_string_auth_attribute_is_application_error(self):
        self.assertEqual(call(*server_and_page(memory_server(NumberAuthPage)), "source", "main")["error"],
                         {"code": "application_error", "name": "TypeError",
                          "message": "p 'p_0': 'auth' must be a string rule, not int"})

    def test_a_value_tytx_cannot_serialise_is_application_error(self):
        class SetPage(Page):
            def main(self, root):
                pass

            @endpoint
            def numbers(self):
                return {1, 2}

        server = memory_server(SetPage)
        error = call(server, open_page(server), "data", "numbers")["error"]
        self.assertEqual((error["code"], error["name"]), ("application_error", "TypeError"))

    def test_a_failing_method_is_application_error_with_details_only_under_debug(self):
        server = GramlotFileServer(PAGES)
        page_id = open_page(server)
        with mock.patch.dict(os.environ):
            os.environ.pop("GRAMLOT_DEV", None)
            self.assertEqual(call(server, page_id, "data", "check_endpoint_raise")["error"],
                             {"code": "application_error", "name": "ValueError", "message": "check"})
            os.environ["GRAMLOT_DEV"] = "DEBUG"
            error = call(server, page_id, "data", "check_endpoint_raise")["error"]
        self.assertEqual(error["code"], "application_error")
        self.assertIn("check", error["details"])

    def test_invalid_request_is_the_only_exception(self):
        server = GramlotFileServer(PAGES)
        page_id = open_page(server)
        valid = {"id": "r1", "pageId": page_id, "contentType": "data", "name": "check_endpoint", "params": {"value": 1}}
        changes = ({"id": None}, {"pageId": 1}, {"contentType": "other"}, {"name": None},
                   {"params": None}, {"params": [1]}, {"params": "x"})
        texts = ["not json", "[1, 2]", '"x"', "null", '{"value":"a::N"}', to_tytx({k: v for k, v in valid.items() if k != "params"}),
                 *(to_tytx({**valid, **change}) for change in changes)]
        for text in texts:
            with self.subTest(text=text), self.assertRaises(InvalidRequest):
                asyncio.run(server.call(text))


class DeclarationTests(unittest.TestCase):
    def test_main_cannot_be_declared(self):
        def main(self, root):
            pass

        for decorator, label in ((source, "@source"), (endpoint, "@endpoint"),
                                 (source(auth="x"), "@source"), (endpoint(auth="x"), "@endpoint")):
            with self.subTest(label=label), self.assertRaisesRegex(TypeError, f"^{label} cannot declare main$"):
                decorator(main)

    def test_a_name_is_a_source_method_or_an_endpoint_not_both(self):
        class Both(Page):
            @source
            @endpoint
            def both(self):
                pass

        for lookup in (source_methods, endpoint_methods):
            with self.subTest(lookup=lookup.__name__), self.assertRaisesRegex(
                    TypeError, "^both is declared both as Source method and endpoint$"):
                lookup(Both)

    def test_markers_carry_the_auth_rule(self):
        class Marked(Page):
            @source
            def plain(self, root):
                pass

            @endpoint(auth="admin")
            def guarded(self):
                pass

        self.assertEqual(source_methods(Marked)["plain"].__gramlot_source__, {"auth": None})
        self.assertEqual(endpoint_methods(Marked)["guarded"].__gramlot_endpoint__, {"auth": "admin"})

    def test_a_name_outside_ascii_letters_and_word_characters_is_not_declared(self):
        class Accented(Page):
            def main(self, root):
                pass

            @endpoint
            def caffè(self):
                return "x"

        self.assertEqual(endpoint_methods(Accented), {})
        server = memory_server(Accented)
        self.assertEqual(call(server, open_page(server), "data", "caffè")["error"]["code"], "not_found")


if __name__ == "__main__":
    unittest.main()
