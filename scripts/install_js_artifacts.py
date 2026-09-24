"""Install a local development archive graph without persisting dependency pins.

This is an artifact verification/setup command, not an upstream release installer.
The maintained package manifest is restored even when npm fails or is interrupted.
"""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import signal
import subprocess
import tarfile
import tempfile


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archives", nargs="+", type=Path)
    parser.add_argument("--cache", type=Path)
    args = parser.parse_args()
    package = Path(__file__).resolve().parents[1] / "js" / "package.json"
    original = package.read_text()
    manifest = json.loads(original)
    archives = {}
    for archive in args.archives:
        archive = archive.resolve(strict=True)
        with tarfile.open(archive, "r:gz") as contents:
            metadata = json.load(contents.extractfile("package/package.json"))
        name = metadata["name"]
        if name not in manifest["dependencies"] or not name.startswith("genro-"):
            raise ValueError(f"Not a declared Genro dependency: {name}")
        if name in archives:
            raise ValueError(f"Duplicate dependency archive: {name}")
        # npm can otherwise reuse an older tarball with the same name/version.
        digest = hashlib.sha256(archive.read_bytes()).hexdigest()
        cache = Path(tempfile.gettempdir()) / "gramlot-artifact-cache"
        cache.mkdir(exist_ok=True)
        content_archive = cache / f"{digest}.tgz"
        if not content_archive.exists():
            shutil.copyfile(archive, content_archive)
        archives[name] = content_archive.as_uri()
    manifest["dependencies"].update(archives)
    manifest["overrides"] = {**manifest.get("overrides", {}), **{name: "$" + name for name in archives}}
    def interrupted(_signal, _frame):
        raise KeyboardInterrupt
    signal.signal(signal.SIGTERM, interrupted)
    try:
        package.write_text(json.dumps(manifest, indent=2) + "\n")
        command = ["npm", "install", "--ignore-scripts", "--package-lock=false", "--no-audit", "--no-fund"]
        if args.cache:
            command += ["--cache", str(args.cache)]
        subprocess.run(command, cwd=package.parent, check=True)
    finally:
        package.write_text(original)
    print("Local archive graph installed. Maintained floating dependencies restored; upstream availability remains a separate check.")


if __name__ == "__main__":
    main()
