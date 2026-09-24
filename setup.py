"""Build-time check: a host wheel must contain its browser runtime assets."""
from pathlib import Path
from setuptools import setup
from setuptools.command.build_py import build_py
from setuptools.errors import SetupError


class BuildWithRuntime(build_py):
    def run(self):
        resources = Path(__file__).parent / "src" / "gramlot" / "resources"
        missing = [name for name in ("gramlot.js", "standalone.js", "runtime-notices.json") if not (resources / name).is_file()]
        if missing:
            raise SetupError(
                "Missing browser assets: " + ", ".join(missing) + ". Run npm --prefix js run build before building Gramlot."
            )
        super().run()


setup(cmdclass={"build_py": BuildWithRuntime})
