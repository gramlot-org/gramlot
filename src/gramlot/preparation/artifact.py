"""Generated initializer validation without executing candidate Python."""

import ast
import json
from pathlib import Path

from ..collection import _commands, _fingerprint, _path, _wrapper
from ..page._collection import Collection


def initializer(record, imports):
    text = lambda value: json.dumps(value, ensure_ascii=False)
    tuple_text = lambda values: "(" + ", ".join(values) + ("," if values else "") + ")"
    lines = ["from gramlot import GramlotCollection"]
    dependencies = []
    for index, name in enumerate(record["dependencies"]):
        module, symbol = imports[name].split(":")
        lines.append(f"from {module} import {symbol} as _dependency_{index}")
        dependencies.append(f"_dependency_{index}")
    lines.extend(
        [
            "",
            "mygramlot = GramlotCollection(",
            f"    name={text(record['name'])},",
            "    package=__package__,",
        ]
    )
    for key in ("grammar", "commands", "module"):
        lines.append(f"    {key}={text(record[key])},")
    lines.extend(
        [
            f"    css={tuple_text([text(v) for v in record['css']])},",
            f"    dependencies={tuple_text(dependencies)},",
            f"    build_id={text(record['buildId'])},",
            f"    files={tuple_text([text(v) for v in record['files']])},",
            ")",
            "",
        ]
    )
    return "\n".join(lines)


def parse_initializer(source, dependency_name):
    """Read only the fixed generated template, resolving dependency identity as data."""
    tree = ast.parse(source)
    statement = tree.body[-1]
    if not isinstance(statement, ast.Assign) or not isinstance(
        statement.value, ast.Call
    ):
        raise ValueError("Unrecognized generated initializer")  # noqa: TRY004 — invalid syntax, not a caller type.
    fields = {item.arg: item.value for item in statement.value.keywords}
    if set(fields) != {
        "name",
        "package",
        "grammar",
        "commands",
        "module",
        "css",
        "dependencies",
        "build_id",
        "files",
    }:
        raise ValueError("Invalid generated descriptor fields")
    imports, names = {}, []
    for item in tree.body[1:-1]:
        if not isinstance(item, ast.ImportFrom) or item.level or len(item.names) != 1:
            raise ValueError("Invalid generated dependency import")
        reference = f"{item.module}:{item.names[0].name}"
        name = dependency_name(reference)
        if name in imports:
            raise ValueError("Duplicate dependency import")
        imports[name] = reference
        names.append(name)
    record = {
        key: ast.literal_eval(fields[key])
        for key in ("name", "grammar", "commands", "module", "css", "files")
    }
    record["css"], record["files"] = list(record["css"]), list(record["files"])
    record.update(buildId=ast.literal_eval(fields["build_id"]), dependencies=names)
    if source != initializer(record, imports):
        raise ValueError("Initializer differs from the generated template")
    return record, imports


def verify(directory, record, imports):
    from ..collection import GramlotCollection

    # Reuse strict resource/inventory validation; dependency identity is verified by the caller's graph.
    GramlotCollection(
        name=record["name"],
        package="candidate",
        grammar=record["grammar"],
        commands=record["commands"],
        module=record["module"],
        css=tuple(record["css"]),
        files=tuple(record["files"]),
        build_id=record["buildId"],
        dependencies=(),
    )
    root = Path(directory).resolve()
    content = {}
    for name in record["files"]:
        _path(name)
        target = root / name
        if not target.resolve().is_relative_to(root) or not target.is_file():
            raise ValueError(f"Missing or escaping candidate file: {name}")
        content[name] = target.read_bytes()
    if content[record["module"]] != _wrapper(record["buildId"]):
        raise ValueError(f"{record['name']}: invalid generated wrapper")
    if _fingerprint(record, content) != record["buildId"]:
        raise ValueError(f"{record['name']}: fingerprint mismatch")
    Collection(json.loads(content[record["grammar"]]))
    _commands(json.loads(content[record["commands"]]))
    init = (root / "__init__.py").read_bytes()
    if init != initializer(record, imports).encode():
        raise ValueError(f"{record['name']}: unexpected initializer")
    return {**content, "__init__.py": init}
