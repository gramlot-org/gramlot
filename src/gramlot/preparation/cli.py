"""gramlot-builder: validate configuration, invoke Node and own output updates."""

import argparse
import importlib
import json
import keyword
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from ..collection import GramlotCollection, collection_graph
from .artifact import parse_initializer, verify
from .transaction import Transaction, exclusive


def _fields(value, required, optional=()):
    if (
        type(value) is not dict
        or not set(required) <= set(value)
        or set(value) - set(required) - set(optional)
    ):
        raise ValueError(f"Expected fields: {', '.join(required)}")


def _package(value):
    if (
        type(value) is not str
        or not value
        or not all(
            part.isidentifier() and not keyword.iskeyword(part)
            for part in value.split(".")
        )
    ):
        raise ValueError(f"Invalid Python package: {value!r}")
    return value


def _config(filename):
    config = json.loads(filename.read_text())
    _fields(config, ("output", "collections"), ("externals",))
    if (
        type(config["output"]) is not str
        or not config["output"]
        or type(config["collections"]) is not list
    ):
        raise ValueError("Configuration requires output path and collection list")
    if type(config.get("externals", [])) is not list:
        raise ValueError("externals must be a list")
    packages = set()
    entries = set()
    for item in config["collections"]:
        _fields(item, ("entry", "pythonPackage"))
        package = _package(item["pythonPackage"])
        if package in packages:
            raise ValueError(f"Duplicate package destination: {package}")
        packages.add(package)
    for item in config.get("externals", []):
        _fields(item, ("entry", "pythonImport"))
        if (
            type(item["pythonImport"]) is not str
            or item["pythonImport"].count(":") != 1
        ):
            raise ValueError("Invalid external Python import")
        module, symbol = item["pythonImport"].split(":")
        _package(module)
        if not symbol.isidentifier():
            raise ValueError("Invalid external descriptor symbol")
    for item in [*config["collections"], *config.get("externals", [])]:
        if (
            type(item["entry"]) is not str
            or not item["entry"]
            or item["entry"] in entries
        ):
            raise ValueError("Invalid/duplicate collection entry")
        entries.add(item["entry"])
    return config


def _externals(config):
    metadata = []
    descriptors = {}
    for item in config.get("externals", []):
        module, symbol = item["pythonImport"].split(":")
        descriptor = getattr(importlib.import_module(module), symbol)
        if not isinstance(descriptor, GramlotCollection):
            raise TypeError("External import must be a GramlotCollection")
        for dependency in collection_graph([descriptor]):
            dependency.verify()
        descriptors[item["pythonImport"]] = descriptor
        metadata.append(
            {
                **item,
                "name": descriptor.name,
                "buildId": descriptor.build_id,
                "dependencies": [d.name for d in descriptor.dependencies],
            }
        )
    return metadata, descriptors


def _generate(operation, config_path, config, staging, externals):
    project = next(
        (
            parent
            for parent in (config_path.parent, *config_path.parent.parents)
            if (parent / "package.json").is_file()
        ),
        None,
    )
    if project is None:
        raise ValueError("No package.json found above configuration")
    node = shutil.which("node")
    if node is None:
        raise ValueError(
            "Install supported Node 22, 24 or 26 and project-local @gramlot/builder"
        )
    bootstrap = """import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
try {
 const require=createRequire(process.argv[1]);
 await import(pathToFileURL(require.resolve('@gramlot/builder/cli')));
} catch (error) {
 process.stderr.write(error.message+'\\n');process.exitCode=2;
}
"""
    request = {
        "protocolVersion": 1,
        "operation": "build",
        "configPath": str(config_path),
        "projectRoot": str(project),
        "stagingDirectory": str(staging),
        "config": config,
        "externals": externals,
    }
    request["operation"] = operation
    process = subprocess.run(
        [node, "--input-type=module", "-e", bootstrap, str(project / "package.json")],
        input=json.dumps(request),
        text=True,
        capture_output=True,
        check=False,
    )
    if process.stderr:
        sys.stderr.write(process.stderr)
    try:
        result = json.loads(process.stdout)
    except ValueError as exc:
        raise ValueError(
            "Generator returned invalid JSON; check project-local @gramlot/builder installation"
        ) from exc
    if (
        type(result) is not dict
        or type(result.get("protocolVersion")) is not int
        or result["protocolVersion"] != 1
    ):
        raise ValueError("Incompatible generator protocol")
    status = result.get("status")
    _fields(
        result,
        ("protocolVersion", "status", "diagnostics", "collections")
        if status == "ok"
        else ("protocolVersion", "status", "diagnostics"),
    )
    if status not in ("ok", "error") or type(result["diagnostics"]) is not list:
        raise ValueError("Invalid generator result")
    errors = []
    import re

    for diagnostic in result["diagnostics"]:
        _fields(diagnostic, ("level", "code", "message"), ("collection", "path"))
        if (
            diagnostic["level"] not in ("warning", "error")
            or any(type(v) is not str for v in diagnostic.values())
            or not re.fullmatch(r"[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*", diagnostic["code"])
        ):
            raise ValueError("Invalid generator diagnostic")
        if diagnostic["level"] == "error":
            errors.append(diagnostic["message"])
        else:
            sys.stderr.write(diagnostic["message"] + "\n")
    if status == "error":
        if process.returncode != 2 or not errors:
            raise ValueError("Generator status/exit disagreement")
        raise ValueError("; ".join(errors))
    if process.returncode != 0 or errors:
        raise ValueError("Generator status/exit disagreement")
    records = result["collections"]
    if type(records) is not list:
        raise ValueError("Invalid collection result list")
    expected = {r["pythonPackage"] for r in config["collections"]}
    seen = set()
    names = set()
    for record in records:
        _fields(
            record,
            (
                "name",
                "pythonPackage",
                "buildId",
                "grammar",
                "commands",
                "module",
                "css",
                "dependencies",
                "files",
            ),
        )
        if (
            record["pythonPackage"] not in expected
            or record["pythonPackage"] in seen
            or record["name"] in names
        ):
            raise ValueError("Unexpected or duplicate generated collection")
        seen.add(record["pythonPackage"])
        names.add(record["name"])
        for key in ("css", "dependencies", "files"):
            if type(record[key]) is not list or any(
                type(v) is not str for v in record[key]
            ):
                raise ValueError("Invalid descriptor arrays")
        if len(set(record["dependencies"])) != len(record["dependencies"]):
            raise ValueError("Duplicate generated dependency")
    if seen != expected:
        raise ValueError("Generator omitted configured collection")
    return records


def run(operation, filename):
    config_path = Path(filename).resolve(strict=True)
    config = _config(config_path)
    output = (config_path.parent / config["output"]).resolve()
    transaction = Transaction(output)
    if transaction.pending:
        if operation == "check":
            raise ValueError(
                f"Recovery required: {transaction.area}; run build to recover"
            )
        with exclusive():
            message = transaction.recover()
        raise ValueError(message + "; run build again to generate new output")
    external_rows, external_descriptors = _externals(config)
    with tempfile.TemporaryDirectory(prefix="gramlot-candidates-") as directory:
        staging = Path(directory)
        records = _generate(operation, config_path, config, staging, external_rows)
        imports = {r["name"]: f"{r['pythonPackage']}:mygramlot" for r in records}
        for row in external_rows:
            if row["name"] in imports:
                raise ValueError("Conflicting local/external collection identity")
            imports[row["name"]] = row["pythonImport"]
        by_name = {r["name"]: r for r in records}
        external_by_name = {
            descriptor.name: descriptor for descriptor in external_descriptors.values()
        }
        if len(external_by_name) != len(external_descriptors):
            raise ValueError("Duplicate external collection mapping")
        visited = set()
        visiting = set()

        def visit(name):
            if name in visiting:
                raise ValueError("Generated dependency cycle")
            if name in visited:
                return
            if name not in imports:
                raise ValueError(f"Unmapped generated dependency: {name}")
            visiting.add(name)
            dependencies = (
                by_name[name]["dependencies"]
                if name in by_name
                else [item.name for item in external_by_name[name].dependencies]
            )
            for dependency in dependencies:
                visit(dependency)
            visiting.remove(name)
            visited.add(name)

        for name in by_name:
            visit(name)
        candidates = {}
        groups = set()
        for descriptor in collection_graph(
            item for item in external_descriptors.values() if item.name in visited
        ):
            doc = json.loads(descriptor.verify()[descriptor.commands])
            if groups.intersection(doc["groups"]):
                raise ValueError("Duplicate external command namespace")
            groups.update(doc["groups"])
        for record in records:
            relative = Path(*record["pythonPackage"].split("."))
            content = verify(staging / relative, record, imports)
            for namespace in json.loads(content[record["commands"]])["groups"]:
                if namespace in groups:
                    raise ValueError(f"Duplicate command namespace: {namespace}")
                groups.add(namespace)
            candidates[record["pythonPackage"]] = content
        expected_files = {
            staging / Path(*package.split(".")) / name
            for package, content in candidates.items()
            for name in content
        }
        if {p for p in staging.rglob("*") if p.is_file()} != expected_files:
            raise ValueError("Generator staging inventory contains unreported files")
        if operation == "check":
            different = False
            for package, content in candidates.items():
                root = Path(*package.split("."))
                changed = any(
                    not transaction._target((root / name).as_posix()).is_file()
                    or transaction._target((root / name).as_posix()).read_bytes()
                    != data
                    for name, data in content.items()
                )
                print(
                    f"{package}: {'stale' if changed else 'unchanged'} ({output / root})"
                )
                different |= changed
            return 1 if different else 0
        with exclusive():
            if transaction.pending:
                raise ValueError("Recovery required before updating output")
            previous_cache = {}
            resolving = set()

            def old(reference):
                if reference in external_descriptors:
                    return external_descriptors[reference].name
                module, symbol = reference.split(":")
                if symbol != "mygramlot":
                    raise ValueError("Unrecognized previous descriptor import")
                if module in previous_cache:
                    return previous_cache[module][0]["name"]
                if module in resolving:
                    raise ValueError("Previous dependency cycle")
                resolving.add(module)
                folder = output / Path(*_package(module).split("."))
                record, mapping = parse_initializer(
                    (folder / "__init__.py").read_text(), old
                )
                content = verify(folder, record, mapping)
                previous_cache[module] = (record, content)
                resolving.remove(module)
                return record["name"]

            changes = {}
            reports = []
            for record in records:
                package = record["pythonPackage"]
                relative = Path(*package.split("."))
                folder = output / relative
                previous = {}
                if (folder / "__init__.py").exists():
                    old(f"{package}:mygramlot")
                    previous = previous_cache[package][1]
                candidate = candidates[package]
                state = (
                    "created"
                    if not previous
                    else "unchanged"
                    if previous == candidate
                    else "updated"
                )
                reports.append(f"{package}: {state} ({folder})")
                for name in sorted(set(previous) | set(candidate)):
                    target = folder / name
                    expected = previous.get(name)
                    if target.is_symlink() or (target.exists() and expected is None):
                        raise ValueError(f"Unowned output conflict: {target}")
                    actual = target.read_bytes() if target.exists() else None
                    if actual != expected:
                        raise ValueError(f"Edited generated output: {target}")
                    desired = candidate.get(name)
                    if actual != desired:
                        changes[(relative / name).as_posix()] = (actual, desired)

            def validate():
                for record in records:
                    verify(
                        output / Path(*record["pythonPackage"].split(".")),
                        record,
                        imports,
                    )

            if changes:
                transaction.commit(changes, validate)
            for report in reports:
                print(report)
        return 0


def main(argv=None):
    parser = argparse.ArgumentParser(prog="gramlot-builder")
    parser.add_argument("operation", choices=("build", "check"))
    parser.add_argument("--config", default="gramlot.build.json")
    args = parser.parse_args(argv)
    try:
        code = run(args.operation, args.config)
    except Exception as error:  # noqa: BLE001 — the CLI maps all preparation failures to exit 2.
        print(f"gramlot-builder: {error}", file=sys.stderr)
        return 2
    print("Output is current" if code == 0 else "Output is missing or differs")
    return code


if __name__ == "__main__":
    sys.exit(main())
