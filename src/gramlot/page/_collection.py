# Copyright 2026 Softwell S.r.l. - SPDX-License-Identifier: Apache-2.0
"""Ordered composition of portable grammar documents, before schema compilation."""
from copy import deepcopy
import json


def _merge(current, incoming, path=()):
    """The composition rule of genro-builders JS (source revision 11, genro-builders#50).

    An ``elements`` or ``abstracts`` entry named by the later document replaces
    the earlier entry whole; the entries it does not name are kept. ``grammar``
    metadata merges key by key and a null value keeps the earlier one.
    """
    if incoming is None:
        return deepcopy(current)
    if len(path) == 2 and path[0] in {"abstracts", "elements"}:
        return deepcopy(incoming)
    if isinstance(current, dict) and isinstance(incoming, dict):
        result = deepcopy(current)
        for name, value in incoming.items():
            if value is not None:
                result[name] = _merge(result.get(name), value, (*path, name))
        return result
    return deepcopy(incoming)


class Collection:
    """A JSON grammar and its metadata; update adds or replaces, never deletes.

    A later document replaces whole every element or abstract it names and keeps
    the others; ``grammar`` metadata merges, a null value keeping the earlier one.
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
