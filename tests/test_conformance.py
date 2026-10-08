"""The conformance check of GC-230 against the reference adapter ``tests/http_server.py``."""
import os
import subprocess
import sys
import unittest
from pathlib import Path

from gramlot.server.conformance import check_protocol

ROOT = Path(__file__).resolve().parents[1]


class ConformanceTests(unittest.TestCase):
    def serve(self, *options):
        """Start the reference adapter on the test pages and return its base URL."""
        environment = {**os.environ, "PYTHONPATH": os.pathsep.join([str(ROOT / "src"), os.environ.get("PYTHONPATH", "")])}
        process = subprocess.Popen([sys.executable, str(ROOT / "tests/http_server.py"), str(ROOT / "tests/fixtures/pages"),
                                    *options], stdout=subprocess.PIPE, text=True, env=environment)
        self.addCleanup(process.wait)
        self.addCleanup(process.stdout.close)
        self.addCleanup(process.kill)
        return process.stdout.readline().strip()

    def test_reference_adapter_conforms(self):
        check_protocol(self.serve(), "/")

    def test_reference_adapter_conforms_below_a_mount_prefix_with_a_policy(self):
        check_protocol(self.serve("--prefix", "/mount", "--csp", "script-src 'nonce-{nonce}'"), "/")

    def test_failure_names_the_rule(self):
        with self.assertRaisesRegex(AssertionError, r"^GC-230-020: "):
            check_protocol(self.serve(), "/gramlot-conformance-missing-page")

    def test_policy_without_the_nonce_fails(self):
        with self.assertRaisesRegex(AssertionError, r"^GC-230-045: "):
            check_protocol(self.serve("--csp", "script-src 'self'"), "/")


if __name__ == "__main__":
    unittest.main()
