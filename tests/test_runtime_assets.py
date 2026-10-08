"""Installed host assets must resolve without another checkout."""
from contextlib import contextmanager
import os
import unittest
from unittest import mock

from gramlot.server import gramlot_dev, runtime_asset


@contextmanager
def environ(value):
    """``GRAMLOT_DEV`` set to ``value`` (unset for ``None``) for the duration of a ``with``."""
    with mock.patch.dict(os.environ):
        os.environ.pop("GRAMLOT_DEV", None)
        if value is not None:
            os.environ["GRAMLOT_DEV"] = value
        yield


class RuntimeAssetTests(unittest.TestCase):
    def test_packaged_runtime(self):
        content = runtime_asset("gramlot.js").read_text(encoding="utf-8")
        self.assertIn("Gramlot", content)
        self.assertGreater(len(content), 1000)

    def test_only_known_assets(self):
        with self.assertRaises(ValueError):
            runtime_asset("../server/gramlot_server.py")

    def test_minified_runtime_is_packaged_and_smaller(self):
        minified = runtime_asset("gramlot.min.js").read_bytes()
        self.assertIn(b"Gramlot", minified)
        self.assertLess(len(minified), len(runtime_asset("gramlot.js").read_bytes()))


class GramlotDevTests(unittest.TestCase):
    def test_unset_yes_debug(self):
        for value in (None, "YES", "DEBUG"):
            with environ(value):
                self.assertEqual(gramlot_dev(), value)

    def test_any_other_value_raises(self):
        for value in ("", "yes", "1", "NO"):
            with environ(value), self.assertRaises(ValueError):
                gramlot_dev()

    def test_runtime_selection(self):
        for value, name in ((None, "gramlot.min.js"), ("YES", "gramlot.min.js"), ("DEBUG", "gramlot.js")):
            with environ(value):
                self.assertEqual(runtime_asset().name, name)
                self.assertEqual(runtime_asset("runtime-notices.json").name, "runtime-notices.json")
        with environ("other"), self.assertRaises(ValueError):
            runtime_asset()
