"""Generator/launcher integration with real local npm resolution and Node process."""

import json
import sys
from pathlib import Path

import pytest

from gramlot.preparation.cli import run
from gramlot.preparation.transaction import Transaction

ROOT = Path(__file__).resolve().parents[1]


@pytest.fixture
def project(tmp_path, monkeypatch):
    (tmp_path / "package.json").write_text('{"type":"module"}')
    modules = tmp_path / "node_modules" / "@gramlot"
    modules.mkdir(parents=True)
    (modules / "gramlot").symlink_to(ROOT / "js", target_is_directory=True)
    (modules / "builder").symlink_to(
        ROOT / "tools/gramlot-builder", target_is_directory=True
    )
    ui = tmp_path / "ui"
    ui.mkdir()
    (ui / "logo.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg"/>')
    (ui / "base.css").write_text(".test {color:red}")
    (ui / "style.css").write_text(
        '@import "./base.css"; .logo {background:url("./logo.svg")}'
    )
    (
        ui / "index.js"
    ).write_text("""import {defineCollection} from '@gramlot/gramlot/components';
export default defineCollection({name:'documenti',components:[],
 css:[new URL('./style.css',import.meta.url)],assets:{logo:new URL('./logo.svg',import.meta.url)},
 registerCommands(gramlot){gramlot.commands.registerGroup('documenti').register('save',{label:'Save',publish:'save',iconSrc:'/icons/save.svg'});}});
""")
    config = tmp_path / "gramlot.build.json"
    config.write_text(
        json.dumps(
            {
                "output": "./src",
                "collections": [
                    {"entry": "./ui/index.js", "pythonPackage": "sample.widgets"}
                ],
            }
        )
    )
    return tmp_path, config


def test_real_generation_check_and_update_preserves_manual_files(project, monkeypatch):
    root, config = project
    assert run("check", config) == 1
    assert not (root / "src").exists()
    assert run("build", config) == 0
    package = root / "src/sample/widgets"
    before = {
        str(p.relative_to(package)): p.read_bytes()
        for p in package.rglob("*")
        if p.is_file()
    }
    assert run("check", config) == 0
    assert run("build", config) == 0
    assert before == {
        str(p.relative_to(package)): p.read_bytes()
        for p in package.rglob("*")
        if p.is_file()
    }
    (package / "notes.txt").write_text("manual")
    (root / "ui/base.css").write_text(".test {color:blue}")
    assert run("check", config) == 1
    assert run("build", config) == 0
    assert (package / "notes.txt").read_text() == "manual"
    monkeypatch.syspath_prepend(str(root / "src"))
    from sample.widgets import mygramlot

    content = mygramlot.verify()
    assert b"blue" in content[mygramlot.css[0]]
    assert json.loads(content[mygramlot.commands])["groups"]["documenti"]["commands"]["save"]["iconSrc"] == "/icons/save.svg"
    assert (
        json.loads(content[mygramlot.commands])["groups"]["documenti"]["commands"][
            "save"
        ]["publish"]
        == "save"
    )


def test_unowned_and_edited_files_are_never_overwritten(project):
    root, config = project
    package = root / "src/sample/widgets"
    package.mkdir(parents=True)
    (package / "grammar.json").write_text("manual")
    with pytest.raises(ValueError, match="Unowned output conflict"):
        run("build", config)
    assert (package / "grammar.json").read_text() == "manual"
    (package / "grammar.json").unlink()
    assert run("build", config) == 0
    (package / "grammar.json").write_text("edited")
    with pytest.raises(ValueError, match="fingerprint mismatch"):
        run("build", config)
    assert (package / "grammar.json").read_text() == "edited"


def test_transaction_restores_complete_prior_build_on_validation_failure(tmp_path):
    output = tmp_path / "output"
    output.mkdir()
    (output / "old.txt").write_bytes(b"old")
    tx = Transaction(output)

    def fail():
        raise ValueError("injected validation failure")

    with pytest.raises(ValueError, match="injected"):
        tx.commit({"old.txt": (b"old", b"new"), "new.txt": (None, b"new")}, fail)
    assert (output / "old.txt").read_bytes() == b"old"
    assert not (output / "new.txt").exists()
    assert not tx.pending


def test_recovery_preserves_independent_edits_and_evidence(tmp_path):
    output = tmp_path / "output"
    output.mkdir()
    (output / "old.txt").write_bytes(b"old")
    tx = Transaction(output)

    def conflict():
        (output / "old.txt").write_bytes(b"user edit")
        raise ValueError("injected failure")

    with pytest.raises(ValueError, match="Recovery unresolved"):
        tx.commit({"old.txt": (b"old", b"new")}, conflict)
    assert tx.pending and (output / "old.txt").read_bytes() == b"user edit"
    assert (tx.area / "0.old").read_bytes() == b"old"
    (output / "old.txt").write_bytes(b"new")
    tx.recover()
    assert (output / "old.txt").read_bytes() == b"old"


@pytest.mark.parametrize("point", ["replace", "validate", "committed"])
def test_process_interruption_recovers_the_recorded_decision(tmp_path, point):
    import subprocess

    output = tmp_path / "output"
    output.mkdir()
    (output / "old.txt").write_bytes(b"old")
    script = """
import os,sys
from pathlib import Path
from gramlot.preparation.transaction import Transaction
output=Path(sys.argv[1]);point=sys.argv[2]
tx=Transaction(output)
if point=='replace':
    original=os.replace
    def replace(source,target):
        original(source,target)
        if Path(target)==output/'old.txt':os._exit(77)
    os.replace=replace
if point=='committed':
    def cleanup():os._exit(77)
    tx._cleanup=cleanup
def validate():
    if point=='validate':os._exit(77)
tx.commit({'old.txt':(b'old',b'new'),'nested/new.txt':(None,b'new')},validate)
"""
    process = subprocess.run(
        [sys.executable, "-c", script, str(output), point], check=False
    )
    assert process.returncode == 77
    tx = Transaction(output)
    assert tx.pending
    tx.recover()
    assert (output / "old.txt").read_bytes() == (
        b"new" if point == "committed" else b"old"
    )
    assert (output / "nested/new.txt").exists() == (point == "committed")
    assert not list(output.rglob(".gramlot-*.tmp"))
    assert not tx.pending


def test_first_build_rollback_removes_only_created_empty_directories(tmp_path):
    output = tmp_path / "new-output"
    tx = Transaction(output)

    def fail():
        raise ValueError("injected")

    with pytest.raises(ValueError, match="injected"):
        tx.commit({"nested/value": (None, b"new")}, fail)
    assert not output.exists()


def test_check_is_read_only_and_build_only_recovers_a_pending_transaction(project):
    import subprocess

    root, config = project
    assert run("build", config) == 0
    output = root / "src"
    target = output / "sample/widgets/grammar.json"
    old = target.read_bytes()
    script = """
import os,sys
from pathlib import Path
from gramlot.preparation.transaction import Transaction
root=Path(sys.argv[1]);name='sample/widgets/grammar.json'
Transaction(root).commit({name:((root/name).read_bytes(),b'interrupted')},lambda:os._exit(77))
"""
    assert (
        subprocess.run(
            [sys.executable, "-c", script, str(output)], check=False
        ).returncode
        == 77
    )
    journal = Transaction(output).journal.read_bytes()
    with pytest.raises(ValueError, match="Recovery required"):
        run("check", config)
    assert (
        target.read_bytes() == b"interrupted"
        and Transaction(output).journal.read_bytes() == journal
    )
    with pytest.raises(ValueError, match="run build again"):
        run("build", config)
    assert target.read_bytes() == old and not Transaction(output).pending
    assert run("check", config) == 0


def test_builtin_layout_dependency_links_named_exports(project, monkeypatch):
    import importlib

    root, config = project
    config.write_text(json.dumps({"output": "./src", "collections": [
        {"entry": "@gramlot/gramlot/components/layout", "pythonPackage": "sample.layout"}
    ]}))
    assert run("build", config) == 0
    monkeypatch.syspath_prepend(str(root / "src"))
    sys.modules.pop("sample.layout", None)
    sys.modules.pop("sample", None)
    importlib.invalidate_caches()
    (root / "ui/consumer.js").write_text("""import {defineCollection} from '@gramlot/gramlot/components';
import layout, {ContentPane} from '@gramlot/gramlot/components/layout';
if (!ContentPane.base) throw new Error('missing ContentPane');
export default defineCollection({name:'consumer',components:[],dependencies:[layout]});
""")
    config.write_text(json.dumps({"output": "./consumer-output", "collections": [
        {"entry": "./ui/consumer.js", "pythonPackage": "consumer.widgets"}
    ], "externals": [{"entry": "@gramlot/gramlot/components/layout",
                       "pythonImport": "sample.layout:mygramlot"}]}))
    assert run("build", config) == 0
    emitted = (root / "consumer-output/consumer/widgets/assets/collection.js").read_text()
    assert '@gramlot/collections/layout' in emitted
    assert '@gramlot/gramlot/components/layout' not in emitted
    assert 'export * from "./collection.js";' in (root / "src/sample/layout/assets/index.js").read_text()


def test_external_collection_is_linked_and_never_regenerated(project, monkeypatch):
    import importlib

    root, config = project
    assert run("build", config) == 0
    monkeypatch.syspath_prepend(str(root / "src"))
    sys.modules.pop("sample.widgets", None)
    sys.modules.pop("sample", None)
    importlib.invalidate_caches()
    package = root / "src/sample/widgets"
    old = {p: p.read_bytes() for p in package.rglob("*") if p.is_file()}
    (
        root / "ui/consumer.js"
    ).write_text("""import {defineCollection} from '@gramlot/gramlot/components';
import dependency from './index.js';
export default defineCollection({name:'consumer',components:[],dependencies:[dependency]});
""")
    config.write_text(
        json.dumps(
            {
                "output": "./consumer-output",
                "collections": [
                    {"entry": "./ui/consumer.js", "pythonPackage": "consumer.widgets"}
                ],
                "externals": [
                    {
                        "entry": "./ui/index.js",
                        "pythonImport": "sample.widgets:mygramlot",
                    }
                ],
            }
        )
    )
    assert run("build", config) == 0
    emitted = (
        root / "consumer-output/consumer/widgets/assets/collection.js"
    ).read_text()
    assert "@gramlot/collections/documenti" in emitted
    assert "class CommandRegistry" not in emitted and "class Gramlot" not in emitted
    assert old == {p: p.read_bytes() for p in old}
    assert not (root / "consumer-output/sample").exists()


@pytest.mark.parametrize(
    "output,exit_code",
    [
        ("log before JSON\n{}", 0),
        ('{"protocolVersion":2,"status":"ok","diagnostics":[],"collections":[]}', 0),
        ('{"protocolVersion":true,"status":"ok","diagnostics":[],"collections":[]}', 0),
        ('{"protocolVersion":1,"status":"ok","diagnostics":[],"collections":[]}', 2),
        ('{"protocolVersion":1,"status":"error","diagnostics":[]}', 2),
        (
            '{"protocolVersion":1,"status":"ok","diagnostics":[],"collections":[],"extra":1}',
            0,
        ),
    ],
)
def test_generator_protocol_rejects_invalid_result_without_touching_output(
    project, monkeypatch, output, exit_code
):
    from types import SimpleNamespace

    from gramlot.preparation.cli import _generate

    root, config = project
    calls = []

    def process(*args, **kwargs):
        calls.append(json.loads(kwargs["input"]))
        return SimpleNamespace(stdout=output, stderr="", returncode=exit_code)

    monkeypatch.setattr("gramlot.preparation.cli.subprocess.run", process)
    with pytest.raises(ValueError):
        _generate(
            "check", config, {"output": "src", "collections": []}, root / "staging", []
        )
    assert len(calls) == 1 and calls[0]["operation"] == "check"
    assert not (root / "src").exists()
