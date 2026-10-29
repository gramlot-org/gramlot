"""Verify the portable grouplet research dossier without network or dependencies."""
from pathlib import Path, PurePosixPath
import hashlib
import json
import tarfile


def main():
    evidence = Path(__file__).resolve().parent / "evidence"
    checksums = json.loads((evidence / "checksums.json").read_text())
    for name, digest in checksums.items():
        assert hashlib.sha256((evidence / name).read_bytes()).hexdigest() == digest, name
    manifest = json.loads((evidence / "source-manifest.json").read_text())
    entries = {"genropy/" + row["path"]: row for row in manifest["files"]}
    with tarfile.open(evidence / "legacy-sources.tar.gz") as archive:
        members = archive.getmembers()
        assert len(members) == len(entries)
        assert {member.name for member in members} == set(entries)
        for member in members:
            assert member.isfile() and not PurePosixPath(member.name).is_absolute()
            assert ".." not in PurePosixPath(member.name).parts
            data = archive.extractfile(member).read()
            row = entries[member.name]
            assert len(data) == row["bytes"], member.name
            assert hashlib.sha256(data).hexdigest() == row["sha256"], member.name
    historical = json.loads((evidence / "historical-provenance.json").read_text())
    local = json.loads((evidence / "local-legacy-manifest.json").read_text())
    local_entries = {"genropy/" + row["path"]: row for row in local["files"]}
    with tarfile.open(evidence / "local-legacy-sources.tar.gz") as archive:
        assert len(archive.getmembers()) == len(local_entries)
        assert {member.name for member in archive.getmembers()} == set(local_entries)
        for member in archive.getmembers():
            assert member.isfile() and not PurePosixPath(member.name).is_absolute()
            assert ".." not in PurePosixPath(member.name).parts
            data = archive.extractfile(member).read()
            assert hashlib.sha256(data).hexdigest() == local_entries[member.name]["sha256"]
    files = {
        "docs/groupletgrid_architecture.md": "historical-groupletgrid-architecture.md",
        "docs/groupletgrid_store_integration.html": "historical-groupletgrid-store-integration.html",
    }
    for entry in historical["files"]:
        data = (evidence / files[entry["path"]]).read_bytes()
        header = f"blob {len(data)}\0".encode()
        assert hashlib.sha1(header + data).hexdigest() == entry["sha"], entry["path"]
    search = json.loads((evidence / "github-search.json").read_text())
    assert not search["incomplete_results"]
    assert len(search["items"]) == search["total_count"]
    assert len({item["number"] for item in search["items"]}) == search["total_count"]
    numbers = {item["number"] for item in search["items"]}
    conversations = json.loads((evidence / "github-comments.json").read_text())
    assert {item["number"] for item in conversations} == numbers
    reviews = json.loads((evidence / "github-review-comments.json").read_text())
    assert {item["number"] for item in reviews} == {
        item["number"] for item in search["items"] if "pull_request" in item
    }
    print(f"Verified {len(checksums)} evidence checksums, {len(entries)} current and "
          f"{len(local_entries)} historical local source files, "
          f"2 historical Git blobs and {len(numbers)} issue/PR discussion records.")


if __name__ == "__main__":
    main()
