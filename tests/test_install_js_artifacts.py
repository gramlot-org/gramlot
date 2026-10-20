"""The local archive installer accepts the declared ``@genrojs/*`` dependencies."""
import io
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tarfile
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "install_js_artifacts.py"
MANIFEST = {
    "name": "@gramlot/gramlot",
    "dependencies": {"@genrojs/bag": ">=0.11.0", "@genrojs/builders": ">=0.6.0", "other-library": "^1.0.0"},
}
# Stands in for npm: it records the manifest it is asked to install.
FAKE_NPM = "#!/bin/sh\ncp package.json \"$SEEN_MANIFEST\"\n"


def archive(directory, name):
    """A gzip tar with the ``package/package.json`` layout of ``npm pack``."""
    path = directory / (name.replace("/", "-").lstrip("@") + ".tgz")
    data = json.dumps({"name": name, "version": "9.9.9"}).encode()
    with tarfile.open(path, "w:gz") as contents:
        member = tarfile.TarInfo("package/package.json")
        member.size = len(data)
        contents.addfile(member, io.BytesIO(data))
    return path


class InstallJsArtifactsTests(unittest.TestCase):
    def setUp(self):
        self.directory = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.directory)
        (self.directory / "scripts").mkdir()
        shutil.copyfile(SCRIPT, self.directory / "scripts" / SCRIPT.name)
        (self.directory / "js").mkdir()
        self.package = self.directory / "js" / "package.json"
        self.original = json.dumps(MANIFEST, indent=2) + "\n"
        self.package.write_text(self.original)
        (self.directory / "bin").mkdir()
        npm = self.directory / "bin" / "npm"
        npm.write_text(FAKE_NPM)
        npm.chmod(0o755)

    def install(self, *names):
        archives = [archive(self.directory, name) for name in names]
        env = {"PATH": f"{self.directory / 'bin'}:/usr/bin:/bin", "TMPDIR": str(self.directory),
               "SEEN_MANIFEST": str(self.directory / "seen.json")}
        return subprocess.run([sys.executable, str(self.directory / "scripts" / SCRIPT.name), *map(str, archives)],
                              env=env, capture_output=True, text=True)

    def test_declared_genrojs_archives_are_installed(self):
        result = self.install("@genrojs/bag", "@genrojs/builders")
        self.assertEqual(result.returncode, 0, result.stderr)
        seen = json.loads((self.directory / "seen.json").read_text())
        for name in ("@genrojs/bag", "@genrojs/builders"):
            self.assertTrue(seen["dependencies"][name].startswith("file://"), name)
            self.assertEqual(seen["overrides"][name], "$" + name)
        self.assertEqual(seen["dependencies"]["other-library"], "^1.0.0")

    def test_manifest_is_restored(self):
        self.install("@genrojs/bag")
        self.assertEqual(self.package.read_text(), self.original)

    def test_undeclared_genrojs_archive_is_refused(self):
        result = self.install("@genrojs/tytx")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Not a declared Genro dependency: @genrojs/tytx", result.stderr)

    def test_declared_dependency_outside_genrojs_is_refused(self):
        result = self.install("other-library")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Not a declared Genro dependency: other-library", result.stderr)

    def test_genro_prefixed_name_is_refused(self):
        result = self.install("genro-bag")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Not a declared Genro dependency: genro-bag", result.stderr)


if __name__ == "__main__":
    unittest.main()
