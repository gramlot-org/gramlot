"""Third-party libraries: the library source in the bootstrap, the import map integrity and the CSP (GC-325 §160).

The JavaScript counterpart is ``js/tests/third-party-libraries.test.js``.
"""
import asyncio
import json
import re
import unittest
from pathlib import Path

from gramlot import Page
from gramlot.server import GramlotServer

ORIGIN = "https://cdn.jsdelivr.net"
MANIFEST = Path(__file__).parents[1] / "js/dist/libraries.json"


class Hello(Page):
    def main(self, root):
        root.div("hi")


def server(**options):
    class MemoryServer(GramlotServer):
        def resolve_page(self, path):
            return Hello

        def resolve_resources(self, path, cls):
            return {"css": [], "js": []}

    return MemoryServer(**options)


class LibrarySourceTests(unittest.TestCase):
    def test_the_python_manifest_is_the_javascript_one(self):
        self.assertEqual(server().libraries, json.loads(MANIFEST.read_text(encoding="utf-8")))

    def test_cdn_bootstrap_carries_the_source_and_the_integrity_of_the_cdn_modules(self):
        cdn = server()
        html = asyncio.run(cdn.open_page("/")).html
        self.assertIn('<html data-gramlot-library-source="cdn">', html)
        imports = json.loads(re.search(r'<script type="importmap"[^>]*>(.*?)</script>', html).group(1))
        modules = {entry["url"]: entry["integrity"] for entry in cdn.libraries.values()
                   if entry["url"] is not None and entry["format"] == "module"}
        self.assertEqual(imports["integrity"], modules)
        self.assertEqual(set(modules), {cdn.libraries["echarts"]["url"], cdn.libraries["uplot"]["url"]})

    def test_local_bootstrap_names_no_cdn(self):
        html = asyncio.run(server(library_source="local").open_page("/")).html
        self.assertIn('<html data-gramlot-library-source="local">', html)
        self.assertNotIn("integrity", html)
        self.assertNotIn("jsdelivr", html)

    def test_an_unknown_source_is_refused(self):
        with self.assertRaisesRegex(ValueError, "library source must be 'cdn' or 'local'"):
            server(library_source="unpkg")

    def test_content_security_policy_adds_the_cdn_origin_to_scripts_and_connections(self):
        cdn = server()
        self.assertEqual(cdn.library_origins, (ORIGIN,))
        self.assertEqual(cdn.content_security_policy("script-src 'nonce-{nonce}'; object-src 'none'; base-uri 'none'", "n1"),
                         f"script-src 'nonce-n1' {ORIGIN}; object-src 'none'; base-uri 'none'")
        self.assertEqual(cdn.content_security_policy("default-src 'self'; script-src 'nonce-{nonce}'", "n1"),
                         f"default-src 'self' {ORIGIN}; script-src 'nonce-n1' {ORIGIN}")
        self.assertEqual(cdn.content_security_policy(f"script-src 'nonce-{{nonce}}' {ORIGIN}; connect-src 'self'", "n1"),
                         f"script-src 'nonce-n1' {ORIGIN}; connect-src 'self' {ORIGIN}")
        local = server(library_source="local")
        self.assertEqual(local.library_origins, ())
        self.assertEqual(local.content_security_policy("script-src 'nonce-{nonce}'", "n1"), "script-src 'nonce-n1'")


if __name__ == "__main__":
    unittest.main()
