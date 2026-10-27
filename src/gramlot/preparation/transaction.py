"""Persistent, conflict-preserving replacement with recoverable per-file commits."""

import json
import os
import re
import secrets
import shutil
import tempfile
from contextlib import contextmanager
from hashlib import sha256
from pathlib import Path


def _hash(data):
    return None if data is None else sha256(data).hexdigest()


def _bytes(path):
    return path.read_bytes() if path.exists() else None


def _sync(directory):
    fd = os.open(directory, os.O_RDONLY)
    try:
        os.fsync(fd)
    finally:
        os.close(fd)


def _write(path, data):
    with path.open("xb") as stream:
        stream.write(data)
        stream.flush()
        os.fsync(stream.fileno())
    _sync(path.parent)


@contextmanager
def exclusive():
    """A host-wide writer lock also serializes overlapping roots across configurations."""
    import fcntl

    path = Path(tempfile.gettempdir()) / f"gramlot-builder-{os.getuid()}.lock"
    fd = os.open(path, os.O_CREAT | os.O_RDWR | os.O_NOFOLLOW, 0o600)
    try:
        try:
            fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as exc:
            raise ValueError("Another collection builder is updating output") from exc
        yield
    finally:
        os.close(fd)


class Transaction:
    def __init__(self, output):
        self.output = Path(output).resolve()
        self.area = self.output.parent / f".{self.output.name}.gramlot-build"
        self.journal = self.area / "transaction.json"

    @property
    def pending(self):
        return self.area.exists() or self.area.is_symlink()

    def _save(self, state):
        temporary = self.area / "transaction.next"
        if temporary.exists():
            temporary.unlink()
        _write(temporary, json.dumps(state, sort_keys=True).encode())
        os.replace(temporary, self.journal)
        _sync(self.area)

    def _target(self, relative):
        from ..collection import _path

        _path(relative)
        target = self.output / relative
        if any(
            parent.is_symlink()
            for parent in (target, *target.parents)
            if parent.is_relative_to(self.output)
        ):
            raise ValueError(f"Symlink in generated output: {relative}")
        if not target.resolve().is_relative_to(self.output):
            raise ValueError(f"Output escapes root: {relative}")
        return target

    def _cleanup(self):
        # Keep the durable decision until every recovery copy has been removed.
        entries = list(self.area.iterdir())
        for child in entries:
            if child == self.journal:
                continue
            if (
                not re.fullmatch(
                    r"(?:[0-9]+\.(?:old|new)|transaction\.next)", child.name
                )
                or not child.is_file()
                or child.is_symlink()
            ):
                raise ValueError("Unexpected recovery entry")
        for child in entries:
            if child != self.journal:
                child.unlink()
        _sync(self.area)
        self.journal.unlink()
        self.area.rmdir()
        _sync(self.area.parent)

    def recover(self):
        if self.area.is_symlink():
            raise ValueError("Recovery area must not be a symlink")
        if not self.journal.exists() and not any(self.area.iterdir()):
            self.area.rmdir()
            _sync(self.area.parent)
            return "Empty preparation/cleanup completed"
        if self.journal.is_symlink():
            raise ValueError("Recovery journal must not be a symlink")
        state = json.loads(self.journal.read_text())
        if state.get("format") != 1 or state.get("output") != str(self.output):
            raise ValueError(f"Unrecognized recovery record: {self.journal}")
        if (
            set(state)
            != {"format", "output", "committed", "files", "directories", "created_root"}
            or type(state["committed"]) is not bool
            or type(state["created_root"]) is not bool
            or type(state["files"]) is not list
            or type(state["directories"]) is not list
        ):
            raise ValueError("Invalid recovery record")
        paths = set()
        for index, item in enumerate(state["files"]):
            if set(item) != {
                "path",
                "old",
                "new",
                "backup",
                "replacement",
                "temporary",
            }:
                raise ValueError("Invalid recovery operation")
            self._target(item["path"])
            self._target(item["temporary"])
            if (
                item["path"] in paths
                or item["backup"] != f"{index}.old"
                or item["replacement"] != f"{index}.new"
                or Path(item["temporary"]).parent != Path(item["path"]).parent
                or not re.fullmatch(
                    r"\.gramlot-[0-9a-f]{32}-[0-9]+\.tmp", Path(item["temporary"]).name
                )
                or any(
                    value is not None
                    and (
                        type(value) is not str
                        or not re.fullmatch(r"[0-9a-f]{64}", value)
                    )
                    for value in (item["old"], item["new"])
                )
            ):
                raise ValueError("Invalid recovery operation identity")
            paths.add(item["path"])
        for relative in state["directories"]:
            self._target(relative)
        errors = []
        committed = state["committed"]
        for item in reversed(state["files"]):
            target = self._target(item["path"])
            temporary = self._target(item["temporary"])
            if temporary.exists():
                if _hash(_bytes(temporary)) not in (item["new"], item["old"]):
                    errors.append(item["temporary"])
                    continue
                temporary.unlink()
                _sync(temporary.parent)
            actual = _hash(_bytes(target))
            if committed:
                if actual != item["new"]:
                    errors.append(item["path"])
                continue
            if actual == item["old"]:
                continue
            if actual != item["new"]:
                errors.append(item["path"])
                continue
            try:
                if item["old"] is None:
                    target.unlink()
                    _sync(target.parent)
                else:
                    backup = self.area / item["backup"]
                    if backup.is_symlink():
                        raise ValueError("Recovery backup must not be a symlink")
                    data = backup.read_bytes()
                    if _hash(data) != item["old"]:
                        raise ValueError("Corrupt recovery backup")
                    os.link(backup, temporary)
                    _sync(target.parent)
                    os.replace(temporary, target)
                    _sync(target.parent)
            except (OSError, ValueError):
                errors.append(item["path"])
        if errors:
            raise ValueError(
                f"Recovery unresolved: {', '.join(errors)}; backups retained at {self.area}"
            )
        if not committed:
            for relative in reversed(state["directories"]):
                target = self._target(relative)
                if target.exists() and not any(target.iterdir()):
                    target.rmdir()
            if (
                state["created_root"]
                and self.output.exists()
                and not any(self.output.iterdir())
            ):
                self.output.rmdir()
                _sync(self.output.parent)
        self._cleanup()
        return (
            "Committed output verified; cleanup completed"
            if committed
            else "Previous output restored"
        )

    def commit(self, changes, validate):
        """changes maps root-relative paths to (verified old bytes, new bytes or None)."""
        if self.pending:
            raise ValueError("Output has an unresolved transaction")
        self.output.parent.mkdir(parents=True, exist_ok=True)
        self.area.mkdir(mode=0o700)
        _sync(self.area.parent)
        token = secrets.token_hex(16)
        state = {
            "format": 1,
            "output": str(self.output),
            "committed": False,
            "files": [],
            "directories": [],
            "created_root": not self.output.exists(),
        }
        mutation_started = False
        try:
            for index, (relative, (old, new)) in enumerate(changes.items()):
                target = self._target(relative)
                if _bytes(target) != old:
                    raise ValueError(f"Output changed before preparation: {relative}")
                item = {
                    "path": relative,
                    "old": _hash(old),
                    "new": _hash(new),
                    "backup": f"{index}.old",
                    "replacement": f"{index}.new",
                    "temporary": str(
                        Path(relative).parent / f".gramlot-{token}-{index}.tmp"
                    ),
                }
                if old is not None:
                    _write(self.area / item["backup"], old)
                if new is not None:
                    _write(self.area / item["replacement"], new)
                state["files"].append(item)
            directories = set()
            for item in state["files"]:
                parent = self._target(item["path"]).parent
                while parent != self.output and not parent.exists():
                    directories.add(parent.relative_to(self.output).as_posix())
                    parent = parent.parent
            state["directories"] = sorted(
                directories, key=lambda value: (value.count("/"), value)
            )
            self._save(state)
            mutation_started = True
            self.output.mkdir(exist_ok=True)
            _sync(self.output.parent)
            for relative in state["directories"]:
                target = self._target(relative)
                target.mkdir(exist_ok=True)
                _sync(target.parent)
            for item in state["files"]:
                target = self._target(item["path"])
                if _hash(_bytes(target)) != item["old"]:
                    raise ValueError(f"Output changed during commit: {item['path']}")
                if item["new"] is None:
                    target.unlink()
                else:
                    replacement = self.area / item["replacement"]
                    if _hash(replacement.read_bytes()) != item["new"]:
                        raise ValueError("Corrupt staged replacement")
                    # Linking publishes a complete temporary in one filesystem operation.
                    # An interrupted write cannot leave a partial, untracked output file.
                    temporary = self._target(item["temporary"])
                    os.link(replacement, temporary)
                    _sync(target.parent)
                    os.replace(temporary, target)
                _sync(target.parent)
            validate()
            state["committed"] = True
            self._save(state)
            self.recover()
        except Exception as failure:
            if mutation_started and self.pending:
                try:
                    self.recover()
                except Exception as recovery:  # noqa: BLE001 — retain both failure causes and recovery evidence.
                    raise ValueError(f"{failure}; {recovery}") from failure
            elif self.area.exists():
                shutil.rmtree(self.area)
            raise
