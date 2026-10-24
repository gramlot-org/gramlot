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


def test_server_reuses_compilation_but_isolates_builder_state(monkeypatch):
    from gramlot import GramlotBuilder
    from gramlot.collections.inputs import mygramlot
    from gramlot.server import GramlotServer
    from unittest.mock import patch

    server = GramlotServer()
    original = GramlotBuilder.load_collection
    loads = []
    def load(builder, document):
        loads.append(document)
        return original(builder, document)
    monkeypatch.setattr(GramlotBuilder, 'load_collection', load)
    left, right = GramlotBuilder(), GramlotBuilder()
    server._load_collections(left, (mygramlot,))
    left.root.textbox(value='^left')
    left._schema.get_node('textbox').set_attr({'test_marker': True})
    with patch.object(GramlotCollection, 'verify', side_effect=AssertionError('already verified')):
        server._load_collections(right, (mygramlot,))
    assert len(loads) == 1
    assert right._schema.get_node('textbox').attr.get('test_marker') is None
    right.root.textbox(value='^right')
    assert 'left' not in right.to_tytx()
    assert 'right' not in left.to_tytx()
    assert left._collection is not right._collection
    assert left._schema is not right._schema
    assert GramlotBuilder()._schema is not right._schema


def test_prepared_grammar_keeps_initial_overrides_and_builder_classes_separate():
    from gramlot import GramlotBuilder
    from gramlot.collections.inputs import mygramlot
    from gramlot.server import GramlotServer
    from pathlib import Path
    controls = json.loads((Path(__file__).parent / 'fixtures/collections/controls.json').read_text())
    server = GramlotServer()
    first = GramlotBuilder(collections=[controls])
    server._load_collections(first, (mygramlot,))
    first.root.statusText('OK', required_label='Status')
    second = GramlotBuilder()
    server._load_collections(second, (mygramlot,))
    with pytest.raises(AttributeError):
        second.root.statusText('unavailable')
    class SpecializedBuilder(GramlotBuilder):
        pass
    third = SpecializedBuilder()
    server._load_collections(third, (mygramlot,))
    assert len(server._prepared_grammars) == 3


def test_new_server_reverifies_changed_artifact(tmp_path, monkeypatch):
    from gramlot.server import GramlotServer
    descriptor, package = artifact(tmp_path, monkeypatch)
    server = GramlotServer()
    document = server._collection_document(descriptor)
    path = tmp_path / 'prepared_example/assets/collection.js'
    path.write_text('tampered')
    assert server._collection_document(descriptor) == document
    with pytest.raises(ValueError, match='fingerprint mismatch'):
        GramlotServer()._collection_document(descriptor)
