"""Build hook: a Gramlot distribution must contain its browser runtime assets."""
from pathlib import Path

from hatchling.builders.hooks.plugin.interface import BuildHookInterface


class RuntimeAssetsBuildHook(BuildHookInterface):
    REQUIRED = ("gramlot.js", "gramlot.min.js", "runtime-notices.json")

    def initialize(self, version, build_data):
        resources = Path(self.root) / "src" / "gramlot" / "resources"
        missing = [name for name in self.REQUIRED if not (resources / name).is_file()]
        if missing:
            raise RuntimeError(
                "Missing browser assets: " + ", ".join(missing) + ". Run npm --prefix js run build before building Gramlot."
            )
