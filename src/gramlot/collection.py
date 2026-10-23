"""Prepared collection descriptors and verification, independent of any host."""

import json
import re
from dataclasses import dataclass
from hashlib import sha256
from importlib.resources import files as package_files
from pathlib import PurePosixPath


def _path(value):
    if (
        type(value) is not str
        or not value
        or "\\" in value
        or "\x00" in value
        or value.startswith("/")
        or any(p in ("", ".", "..") for p in value.split("/"))
    ):
        raise ValueError(f"Invalid collection resource path: {value!r}")
    return value


def _wrapper(build_id):
    return f'export {{default}} from "./collection.js";\nexport const buildId = "{build_id}";\n'.encode()


def _fingerprint(metadata, content):
    digest = sha256(b"gramlot-build-v1\0")

    def record(tag, value):
        payload = value.encode() if isinstance(value, str) else value
        digest.update(
            tag.encode() + b"\0" + str(len(payload)).encode() + b"\0" + payload
        )

    for key in ("name", "grammar", "commands", "module"):
        record(key, metadata[key])
    for key in ("css", "dependencies"):
        for item in metadata[key]:
            record("css" if key == "css" else "dependency", item)
    for path in sorted(metadata["files"], key=lambda value: value.encode()):
        record("path", path)
        record(
            "content",
            _wrapper("__GRAMLOT_BUILD_ID__")
            if path == metadata["module"]
            else content[path],
        )
    return "sha256:" + digest.hexdigest()


def _commands(document):
    if (
        type(document) is not dict
        or set(document) != {"document_format", "groups"}
        or document["document_format"] != {"name": "gramlot_commands", "version": "1.0"}
        or type(document["groups"]) is not dict
    ):
        raise ValueError("Expected gramlot_commands version 1.0")
    for namespace, group in document["groups"].items():
        if not namespace or ":" in namespace:
            raise ValueError(
                "Extension command namespace must be nonempty and unqualified"
            )
        if (
            type(group) is not dict
            or not {"commands"} <= set(group)
            or set(group) - {"author", "description", "commands"}
            or type(group["commands"]) is not dict
        ):
            raise ValueError(f"Invalid command group: {namespace}")
        for key in ("author", "description"):
            if key in group and type(group[key]) is not str:
                raise ValueError(f"Invalid group metadata: {namespace}.{key}")
        for name, command in group["commands"].items():
            if (
                not name
                or ":" in name
                or type(command) is not dict
                or not {"label", "publish"} <= set(command)
                or set(command) - {"label", "publish", "icon", "iconSrc", "tooltip"}
                or any(type(value) is not str for value in command.values())
            ):
                raise ValueError(f"Invalid command: {namespace}:{name}")
    return document


@dataclass(frozen=True, kw_only=True)
class GramlotCollection:
    """Importable package descriptor; no routes or executable generated grammar."""

    name: str
    package: str
    grammar: str
    commands: str
    module: str
    css: tuple[str, ...]
    dependencies: tuple["GramlotCollection", ...]
    build_id: str
    files: tuple[str, ...]

    def __post_init__(self):
        if type(self.name) is not str or not self.name or "\x00" in self.name:
            raise ValueError("Collection name must be nonempty")
        if type(self.package) is not str or not all(
            p.isidentifier() for p in self.package.split(".")
        ):
            raise ValueError("Collection package must be a Python package name")
        if type(self.build_id) is not str or not re.fullmatch(
            r"sha256:[0-9a-f]{64}", self.build_id
        ):
            raise ValueError("Collection build_id must be a SHA-256 digest")
        for key in ("css", "dependencies", "files"):
            if type(getattr(self, key)) is not tuple:
                raise TypeError(f"Collection {key} must be a tuple")
        if any(not isinstance(item, GramlotCollection) for item in self.dependencies):
            raise TypeError("Collection dependencies must be descriptors")
        for path in (self.grammar, self.commands, self.module, *self.css, *self.files):
            _path(path)
        if self.module != "assets/index.js":
            raise ValueError("Collection entry must be assets/index.js")
        if (
            tuple(sorted(set(self.files), key=lambda value: value.encode()))
            != self.files
        ):
            raise ValueError("Collection files must be unique and UTF-8 sorted")
        if "__init__.py" in self.files:
            raise ValueError("Initializer cannot be in its own fingerprint inventory")
        if not {
            self.grammar,
            self.commands,
            self.module,
            "assets/collection.js",
            *self.css,
        } <= set(self.files):
            raise ValueError("Collection inventory omits declared resources")
        if any(not path.startswith("assets/") for path in self.css):
            raise ValueError("Collection CSS must be a browser asset")
        if len(set(self.css)) != len(self.css) or len(
            {d.name for d in self.dependencies}
        ) != len(self.dependencies):
            raise ValueError("Duplicate collection CSS or dependency")

    def metadata(self):
        """Fingerprint fields, independent of package location and dependency versions."""
        return {
            "name": self.name,
            "grammar": self.grammar,
            "commands": self.commands,
            "module": self.module,
            "css": list(self.css),
            "dependencies": [d.name for d in self.dependencies],
            "files": list(self.files),
        }

    def resource(self, path):
        """Locate an inventory member as a Traversable, without exposing an HTTP URL."""
        _path(path)
        if path not in self.files:
            raise ValueError(f"Unlisted collection resource: {path}")
        root = package_files(self.package)
        target = root.joinpath(*PurePosixPath(path).parts)
        # Filesystem packages additionally reject symlinks leaving the package.
        from pathlib import Path

        if isinstance(root, Path) and not target.resolve().is_relative_to(
            root.resolve()
        ):
            raise ValueError(f"Collection resource leaves package: {path}")
        return target

    def verify(self):
        """Read and verify one coherent artifact; return its verified bytes."""
        content = {path: self.resource(path).read_bytes() for path in self.files}
        if content[self.module] != _wrapper(self.build_id):
            raise ValueError(f"{self.name}: invalid build wrapper")
        actual = _fingerprint(self.metadata(), content)
        if actual != self.build_id:
            raise ValueError(
                f"{self.name}: fingerprint mismatch: expected {self.build_id}, received {actual}"
            )
        from .page._collection import Collection

        Collection(json.loads(content[self.grammar]))
        _commands(json.loads(content[self.commands]))
        return content


def collection_graph(collections):
    """Resolve dependency-first identity once; reject conflicts and cycles."""
    by_name, visiting, done, ordered = {}, set(), set(), []

    def visit(collection):
        if not isinstance(collection, GramlotCollection):
            raise TypeError("gramlots must contain GramlotCollection descriptors")
        previous = by_name.get(collection.name)
        if previous is not None and previous != collection:
            raise ValueError(f"Conflicting collection identity: {collection.name}")
        by_name[collection.name] = collection
        if collection.name in visiting:
            raise ValueError(f"Collection dependency cycle: {collection.name}")
        if collection.name in done:
            return
        visiting.add(collection.name)
        for dependency in collection.dependencies:
            visit(dependency)
        visiting.remove(collection.name)
        done.add(collection.name)
        ordered.append(collection)

    for collection in collections:
        visit(collection)
    return tuple(ordered)


def page_collections(page_class):
    """Accumulate class-local declarations in base-to-derived MRO order."""
    return collection_graph(
        item
        for cls in reversed(page_class.__mro__)
        for item in cls.__dict__.get("gramlots", ())
    )
