"""Page formatting metadata reaches the browser without using the server locale."""
import asyncio
import json
import re
import unittest

from gramlot import Page
from gramlot.server import GramlotServer


class FormatContextTests(unittest.TestCase):
    def test_python_page_metadata_reaches_bootstrap_with_browser_names(self):
        class Localized(Page):
            devices = ("desktop", "phone")
            locale = "it-IT"
            time_zone = "Europe/Rome"

            def main(self, root):
                root.p("hello")

        class Server(GramlotServer):
            def resolve_page(self, path):
                return Localized

            def resolve_resources(self, path, cls):
                return {"css": [], "js": []}

        page = asyncio.run(Server().open_page("/"))
        bootstrap = json.loads(re.search(r"new PageBootstrap\((.*)\)\.run\(\)", page.html, re.S)[1])
        self.assertEqual(bootstrap["config"]["devices"], ["desktop", "phone"])
        self.assertEqual(bootstrap["config"]["locale"], "it-IT")
        self.assertEqual(bootstrap["config"]["timeZone"], "Europe/Rome")
