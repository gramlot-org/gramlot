"""Prepared artifact integrity and declaration inheritance regressions."""

import importlib
import json
from dataclasses import replace
from typing import ClassVar

import pytest

from gramlot import GramlotCollection, Page
from gramlot.collection import (
    _fingerprint,
    _wrapper,
    collection_graph,
    page_collections,
)


def artifact(tmp_path, monkeypatch):
    package = tmp_path / "prepared_example"
    (package / "assets").mkdir(parents=True)
    (package / "__init__.py").write_text("")
    content = {
        "grammar.json": json.dumps(
            {
                "document_format": {"name": "builder_grammar", "version": "1.1"},
                "grammar": {},
                "abstracts": {},
                "elements": {},
            }
        ).encode(),
        "commands.json": b'{"document_format":{"name":"gramlot_commands","version":"1.0"},"groups":{}}',
        "assets/collection.js": b"export default {};\n",
        "assets/style.css": b".sample {color:red}",
        "assets/index.js": _wrapper("__GRAMLOT_BUILD_ID__"),
    }
    metadata = {
        "name": "example",
        "grammar": "grammar.json",
        "commands": "commands.json",
        "module": "assets/index.js",
        "css": ["assets/style.css"],
        "dependencies": [],
        "files": sorted(content),
    }
    build_id = _fingerprint(metadata, content)
    content["assets/index.js"] = _wrapper(build_id)
    for path, data in content.items():
        (package / path).write_bytes(data)
    monkeypatch.syspath_prepend(str(tmp_path))
    importlib.invalidate_caches()
    import sys

    sys.modules.pop("prepared_example", None)
    return GramlotCollection(
        **{
            **metadata,
            "package": "prepared_example",
            "build_id": build_id,
            "css": tuple(metadata["css"]),
            "dependencies": (),
            "files": tuple(metadata["files"]),
        }
    ), package


def test_fingerprint_checks_all_bytes_and_exact_wrapper(tmp_path, monkeypatch):
    descriptor, package = artifact(tmp_path, monkeypatch)
    assert descriptor.verify()["assets/style.css"] == b".sample {color:red}"
    (package / "assets/style.css").write_text(".sample {color:blue}")
    with pytest.raises(ValueError, match="fingerprint mismatch"):
        descriptor.verify()
    (package / "assets/index.js").write_text("export default {};")
    with pytest.raises(ValueError, match="invalid build wrapper"):
        descriptor.verify()


def test_resource_paths_and_inventory_are_strict(tmp_path, monkeypatch):
    descriptor, package = artifact(tmp_path, monkeypatch)
    with pytest.raises(ValueError, match="Invalid collection resource"):
        descriptor.resource("../secret")
    with pytest.raises(ValueError, match="Unlisted"):
        descriptor.resource("__init__.py")
    with pytest.raises(ValueError, match="inventory omits"):
        replace(descriptor, files=("assets/index.js",))
    (package / "assets/style.css").unlink()
    outside = tmp_path / "outside.css"
    outside.write_text("secret")
    (package / "assets/style.css").symlink_to(outside)
    with pytest.raises(ValueError, match="leaves package"):
        descriptor.verify()


def test_dependency_first_identity_and_cumulative_inheritance(tmp_path, monkeypatch):
    base, _ = artifact(tmp_path, monkeypatch)
    derived = replace(base, name="derived", dependencies=(base,))

    class Parent(Page):
        gramlots: ClassVar[list] = [base]

    class Child(Parent):
        gramlots: ClassVar[list] = [derived, base]

    assert page_collections(Child) == (base, derived)
    with pytest.raises(ValueError, match="Conflicting collection identity"):
        collection_graph([base, replace(base, package="different")])
    object.__setattr__(derived, "dependencies", (derived,))
    with pytest.raises(ValueError, match="cycle"):
        collection_graph([derived])
