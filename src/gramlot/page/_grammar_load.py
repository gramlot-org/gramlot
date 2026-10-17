# Copyright 2025 Softwell S.r.l. - SPDX-License-Identifier: Apache-2.0
"""Compose instance collections; Builder owns signature and dtype decoding."""

from typing import Any
from genro_builders.builder._grammar_load import _declarations, _fail
from ._collection import Collection


def _parents(raw: str | None) -> list[str]:
    return [part.strip() for part in (raw or "").split(",") if part.strip()]


def load_grammar(builder: Any, document: Any) -> Any:
    """Validate and atomically merge one v1.1 grammar collection over the class grammar.

    The instance collections compose among themselves; each of their
    declarations replaces the class declaration of the same name whole.
    """
    current = builder._collection
    collection = Collection(document) if current is None else Collection(current.to_document()).update(document)
    doc = collection.to_document()
    parsed_abs, parsed_elements = _declarations(doc)

    schema = type(builder)._class_schema.deepcopy()
    # The copy carries the class ``_get_schema_info`` cache; a declaration below may replace an abstract.
    for node in schema:
        node.attr.pop("_cached_info", None)
    abs_bag = schema["_abstracts"]
    for node in abs_bag:
        node.attr.pop("_cached_info", None)
    for parsed, target in ((parsed_abs, abs_bag), (parsed_elements, schema)):
        for key, attrs in parsed.items():
            target.set_item(key, None, **attrs)

    known = {node.label for node in abs_bag}
    graph = {node.label: _parents(node.get_attr("inherits_from")) for node in abs_bag}
    for child, parents in graph.items():
        missing = [parent for parent in parents if parent not in known]
        if missing:
            _fail(f"abstracts.{child}.inherits_from", f"unknown abstracts {missing!r}")
    for child, attrs in parsed_elements.items():
        missing = [parent for parent in _parents(attrs["inherits_from"]) if parent not in known]
        if missing:
            _fail(f"elements.{child}.inherits_from", f"unknown abstracts {missing!r}")
    visiting: set[str] = set()
    visited: set[str] = set()
    def visit(node: str) -> None:
        if node in visiting:
            _fail(f"abstracts.{node}.inherits_from", "inheritance cycle detected")
        if node in visited:
            return
        visiting.add(node)
        for parent in graph[node]:
            visit(parent)
        visiting.remove(node)
        visited.add(node)
    for key in graph:
        visit(key)

    names: dict[str, str] = {}
    for node in schema:
        if node.label.startswith("_"):
            continue
        folded = node.label.lower()
        if folded in names:
            _fail(f"elements.{node.label}", f"case-insensitive collision with {names[folded]!r}")
        names[folded] = node.label
    builder._schema = schema
    builder._schema_tag_names = names
    builder._collection = collection
    return builder
