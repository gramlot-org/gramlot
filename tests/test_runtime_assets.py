"""Installed host assets must resolve without another checkout."""
import unittest
from gramlot.server import runtime_asset


class RuntimeAssetTests(unittest.TestCase):
    def test_packaged_runtime(self):
        content = runtime_asset().read_text(encoding="utf-8")
        self.assertIn("Gramlot", content)
        self.assertGreater(len(content), 1000)

    def test_only_known_assets(self):
        with self.assertRaises(ValueError):
            runtime_asset("../server/host.py")
