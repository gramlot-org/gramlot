"""Verify the selected historical source archives without extracting them."""
import hashlib
import json
from pathlib import Path
import tarfile


def verify(name):
    root = Path(__file__).parent
    manifest = json.loads((root / f"{name}-manifest.json").read_text())
    expected = {entry["path"]: entry["sha256"] for entry in manifest["files"]}
    with tarfile.open(root / f"{name}-sources.tar.gz", "r:gz") as archive:
        files = [member for member in archive.getmembers() if member.isfile()]
        if len(files) != len(expected) or {member.name for member in files} != set(expected):
            raise ValueError(f"{name}: archive member mismatch")
        for member in files:
            actual = hashlib.sha256(archive.extractfile(member).read()).hexdigest()
            if actual != expected[member.name]:
                raise ValueError(f"{name}: checksum mismatch for {member.name}")
    print(f"{name}: {len(expected)} files verified")


if __name__ == "__main__":
    verify("legacy")
    verify("poc")
