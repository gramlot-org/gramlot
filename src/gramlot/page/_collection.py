# Copyright 2026 Softwell S.r.l. - SPDX-License-Identifier: Apache-2.0
"""Ordered composition of portable grammar documents, before schema compilation."""
from copy import deepcopy
import json

from genro_builders.builder._utilities import _parse_sub_tags_spec


def _merge(current, incoming, path=()):
    key = path[-1] if path else None
    if incoming is None:
        return deepcopy(current)
    if len(path) == 3 and path[0] in {"abstracts", "elements"} and key in {"sub_tags", "parent_tags", "inherits_from"} and isinstance(incoming, str):
        names = [s.strip().split("[", 1)[0] for s in incoming.split(",")]
        if len(names) != len(set(names)):
            raise ValueError(f"duplicate name in {key}")
        if not incoming or not current:
            return incoming
        if key == "sub_tags" and current.strip() == "*" and "[" not in incoming:
            _parse_sub_tags_spec(incoming)
            return "*"
        entries = {s.strip().split("[", 1)[0]: s.strip() for s in current.split(",")}
        entries.update({s.strip().split("[", 1)[0]: s.strip() for s in incoming.split(",")})
        return ",".join(entries.values())
    if len(path) == 4 and path[2:] == ("attributes", "parameters") and isinstance(current, list) and isinstance(incoming, list):
        entries = {p["name"]: deepcopy(p) for p in current}
        seen = set()
        for param in incoming:
            name = param["name"]
            if name in seen:
                raise ValueError(f"duplicate parameter {name!r}")
            seen.add(name)
            # A parameter is one declaration; its annotation/default are values.
            entries[name] = deepcopy(param)
        return list(entries.values())
    if isinstance(current, dict) and isinstance(incoming, dict):
        result = deepcopy(current)
        for name, value in incoming.items():
            if value is not None:
                result[name] = _merge(result.get(name), value, (*path, name))
        return result
    return deepcopy(incoming)


class Collection:
    """A JSON grammar and its metadata; update adds or updates, never deletes.

    Declarations can be partial. Omitted and null fields preserve earlier values.
    Named parameters and child rules retain order; a repeated name is updated.
    Schema compilation and semantic validation remain the builder's responsibility.
    """

    def __init__(self, document):
        # Round-trip also rejects executable values and non-finite numbers.
        self._document = json.loads(json.dumps(document, allow_nan=False))
        if type(self._document) is not dict or set(self._document) != {
            "document_format", "grammar", "abstracts", "elements"
        }:
            raise ValueError("collection requires document_format, grammar, abstracts and elements")
        if self._document["document_format"] != {"name": "builder_grammar", "version": "1.1"}:
            raise ValueError("expected builder_grammar version 1.1")
        for section in ("grammar", "abstracts", "elements"):
            if type(self._document[section]) is not dict:
                raise ValueError(f"{section} must be an object")

    def update(self, document):
        """Compose a subsequent JSON document without mutating either input."""
        incoming = Collection(document)
        self._document = _merge(self._document, incoming._document)
        return self

    def to_document(self):
        """Export independent JSON data in the same portable grammar format."""
        return deepcopy(self._document)
