# Copyright 2025 Softwell S.r.l. - SPDX-License-Identifier: Apache-2.0
"""Safe, atomic loader for portable ``builder_grammar`` v1.1 documents."""

from __future__ import annotations

import json
import re
from collections.abc import Callable
from typing import Annotated, Any, Literal, Union

from genro_bag import Bag

from genro_builders.builder._utilities import (
    SIGNATURE_SKIP_PARAMS, _parse_parent_tags_spec, _parse_sub_tags_spec,
    _split_annotated,
)
from genro_builders.builder._validators import Range, Regex

from ._collection import Collection


_ENTRY_KEYS = {"doc", "sub_tags", "parent_tags", "inherits_from", "ns", "attributes", "_meta"}
_ELEMENT_KEYS = _ENTRY_KEYS | {"node_label", "collection_key"}
_PARAM_KINDS = {"positional_only", "positional_or_keyword", "keyword_only", "var_positional", "var_keyword"}
_PARAM_ROLES = {"framework", "value", "attribute"}
_SAFE_TYPES = {
    ("builtins", "str"): str, ("builtins", "int"): int,
    ("builtins", "float"): float, ("builtins", "bool"): bool,
    ("builtins", "list"): list, ("builtins", "dict"): dict,
    ("builtins", "tuple"): tuple, ("builtins", "set"): set,
    ("builtins", "object"): object, ("builtins", "NoneType"): type(None),
    ("collections.abc", "Callable"): Callable,
}


def _fail(path: str, message: str) -> None:
    raise ValueError(f"{path}: {message}")


def _object(value: Any, path: str) -> dict[str, Any]:
    if type(value) is not dict:
        _fail(path, "must be an object")
    return value


def _json_copy(value: Any, path: str) -> Any:
    try:
        return json.loads(json.dumps(value, allow_nan=False))
    except (TypeError, ValueError) as exc:
        _fail(path, f"must contain only finite JSON values ({exc})")


def _annotation(desc: Any, path: str) -> Any:
    if desc is None:
        return None
    item = _object(desc, path)
    kind = item.get("kind")
    if kind == "any":
        return Any
    if kind == "ellipsis":
        return Ellipsis
    if kind == "type":
        key = (item.get("module"), item.get("name"))
        if key not in _SAFE_TYPES:
            _fail(path, f"unsupported named type {key[0]}.{key[1]}; implicit imports are forbidden")
        return _SAFE_TYPES[key]
    if kind == "literal":
        values = item.get("values")
        if type(values) is not list or not values:
            _fail(path, "literal.values must be a non-empty array")
        return Literal[tuple(_json_copy(values, path + ".values"))]
    if kind == "union":
        items = item.get("items")
        if type(items) is not list or not items:
            _fail(path, "union.items must be a non-empty array")
        args = tuple(_annotation(v, f"{path}.items[{i}]") for i, v in enumerate(items))
        if None in args:
            _fail(path, "an unannotated null descriptor cannot be a union member")
        return Union[args]
    if kind == "generic":
        origin = _annotation(item.get("origin"), path + ".origin")
        if origin not in (list, dict, tuple, set):
            _fail(path, "only list, dict, tuple and set generic origins are supported")
        raw_args = item.get("arguments")
        if type(raw_args) is not list:
            _fail(path, "generic.arguments must be an array")
        args = tuple(_annotation(v, f"{path}.arguments[{i}]") for i, v in enumerate(raw_args))
        if any(v is None for v in args):
            _fail(path, "generic arguments cannot be unannotated")
        try:
            return origin[args[0] if len(args) == 1 else args]
        except (TypeError, IndexError) as exc:
            _fail(path, f"invalid generic arguments ({exc})")
    if kind == "annotated":
        base = _annotation(item.get("base"), path + ".base")
        if base is None:
            _fail(path, "annotated.base cannot be null")
        metadata = item.get("metadata")
        if type(metadata) is not list or not metadata:
            _fail(path, "annotated.metadata must be a non-empty array")
        decoded = [_metadata(v, f"{path}.metadata[{i}]") for i, v in enumerate(metadata)]
        return Annotated[base, *decoded]
    if kind == "arguments":
        _fail(path, "Callable argument-list descriptors are not supported by Python validation")
    _fail(path, f"unsupported annotation descriptor kind {kind!r}")


def _metadata(desc: Any, path: str) -> Any:
    item = _object(desc, path)
    kind = item.get("kind")
    if kind == "regex":
        pattern, flags = item.get("pattern"), item.get("flags")
        if type(pattern) is not str or type(flags) is not int:
            _fail(path, "regex requires string pattern and integer flags")
        try:
            re.compile(pattern, flags)
        except re.error as exc:
            _fail(path, f"invalid regex ({exc})")
        return Regex(pattern, flags)
    if kind == "range":
        values = {}
        for key in ("ge", "le", "gt", "lt"):
            value = item.get(key)
            if value is not None and (type(value) not in (int, float) or type(value) is bool):
                _fail(path + "." + key, "must be a number or null")
            values[key] = value
        return Range(**values)
    if kind == "value":
        return _json_copy(item.get("value"), path + ".value")
    _fail(path, f"unsupported annotation metadata kind {kind!r}")


def _signature(desc: Any, path: str, *, component: bool = False) -> tuple[dict[str, tuple[Any, list, Any]], set[str], bool, set[str]]:
    if desc is None:
        return {}, set(), True, set()
    item = _object(desc, path)
    if set(item) - {"parameters", "accepts_var_keyword", "accepts_var_positional"}:
        _fail(path, "must contain exactly parameters, accepts_var_keyword and accepts_var_positional")
    params = item.get("parameters", [])
    if type(params) is not list:
        _fail(path, "parameters must be an array")
    for index, param in enumerate(params):
        _object(param, f"{path}.parameters[{index}]")
    item = {"parameters": params,
            "accepts_var_keyword": any(p.get("kind") == "var_keyword" for p in params),
            "accepts_var_positional": any(p.get("kind") == "var_positional" for p in params), **item}
    if type(item["parameters"]) is not list or type(item["accepts_var_keyword"]) is not bool or type(item["accepts_var_positional"]) is not bool:
        _fail(path, "invalid signature descriptor field types")
    component_root = next((p["name"] for p in item["parameters"]
                           if p.get("role") != "framework" and p.get("kind") in ("positional_only", "positional_or_keyword")), None) if component else None
    validations: dict[str, tuple[Any, list, Any]] = {}
    declared: set[str] = set()
    seen: set[str] = set()
    required_names: set[str] = set()
    found_var_kw = found_var_pos = False
    for index, param in enumerate(item["parameters"]):
        ppath = f"{path}.parameters[{index}]"
        required = {"name", "kind", "role", "annotation", "has_default"}
        if not required <= set(param) or set(param) - (required | {"default"}):
            _fail(ppath, "invalid parameter shape")
        name, pkind, role = param["name"], param["kind"], param["role"]
        if type(name) is not str or not name.isidentifier() or name in seen:
            _fail(ppath + ".name", "must be a unique identifier")
        if pkind not in _PARAM_KINDS or role not in _PARAM_ROLES or type(param["has_default"]) is not bool:
            _fail(ppath, "invalid kind, role or has_default")
        if ("default" in param) is not param["has_default"]:
            _fail(ppath, "default presence must match has_default")
        seen.add(name)
        found_var_kw |= pkind == "var_keyword"
        found_var_pos |= pkind == "var_positional"
        annotation = _annotation(param["annotation"], ppath + ".annotation")
        if role == "framework" and name not in SIGNATURE_SKIP_PARAMS:
            _fail(ppath, f"unknown framework parameter {name!r}")
        if role == "value" and name != "node_value":
            _fail(ppath, "value role is reserved for node_value")
        if name == component_root:
            continue  # The renderer supplies the expansion root positionally.
        if role == "attribute" and pkind not in ("var_keyword", "var_positional"):
            declared.add(name)
        if pkind not in ("var_keyword", "var_positional") and role != "framework":
            # Loaded signatures carry the full declaration contract, so even
            # an unannotated parameter participates in the existing required
            # check.  ``Any`` adds no type restriction.
            base, validators = _split_annotated(annotation or Any)
            if param["has_default"]:
                default = _json_copy(param["default"], ppath + ".default")
            else:
                # Presence is checked separately so explicit JSON null is a
                # supplied value: Any accepts it, a non-nullable annotation
                # rejects it, and a nullable union accepts it.
                required_names.add(name)
                default = None
            validations[name] = (base, validators, default)
    if found_var_kw != item["accepts_var_keyword"] or found_var_pos != item["accepts_var_positional"]:
        _fail(path, "variadic summary flags do not match parameters")
    return validations, declared, found_var_kw, required_names


def _entry(raw: Any, path: str, *, abstract: bool) -> dict[str, Any]:
    item = _object(raw, path)
    fields = _ENTRY_KEYS if abstract else _ELEMENT_KEYS
    if set(item) - fields:
        _fail(path, f"unknown fields {sorted(set(item) - fields)!r}")
    item = {**dict.fromkeys(fields), **item}
    for key in ("doc", "sub_tags", "parent_tags", "inherits_from", "ns", "node_label", "collection_key"):
        if key in item and item[key] is not None and type(item[key]) is not str:
            _fail(path + "." + key, "must be a string or null")
    if item["_meta"] is not None and type(item["_meta"]) is not dict:
        _fail(path + "._meta", "must be an object or null")
    sub_tags = item["sub_tags"]
    if sub_tags is not None:
        _parse_sub_tags_spec(sub_tags)
    if item["parent_tags"] is not None:
        _parse_parent_tags_spec(item["parent_tags"])
    attrs = {
        "sub_tags": sub_tags, "parent_tags": item["parent_tags"],
        "inherits_from": item["inherits_from"] or "", "_meta": _json_copy(item["_meta"], path + "._meta"),
        "documentation": item["doc"],
    }
    if item.get("ns") is not None:
        attrs["ns"] = item["ns"]
    if not abstract:
        validations, declared, accepts, required_names = _signature(item["attributes"], path + ".attributes", component=bool((item["_meta"] or {}).get("component")))
        attrs.update(call_args_validations=validations, declared_names=declared,
                     accepts_var_keyword=accepts, loaded_required_names=required_names,
                     loaded_strict_json_primitives=True,
                     node_label=item["node_label"],
                     collection_key=item["collection_key"])
    return attrs


def _parents(raw: str | None) -> list[str]:
    return [part.strip() for part in (raw or "").split(",") if part.strip()]


def load_grammar(builder: Any, document: Any, *, replace: bool = False) -> Any:
    """Validate and atomically load or merge one v1.1 grammar collection."""
    current = builder._collection
    collection = Collection(document) if replace or current is None else Collection(current.to_document()).update(document)
    doc = collection.to_document()
    # Collection validates the document envelope before composition; compile its declarations here.
    grammar = doc["grammar"]
    if set(grammar) != {"name", "version", "title", "description"} or type(grammar.get("name")) is not str or not grammar["name"]:
        _fail("grammar", "must contain name (non-empty string), version, title and description")
    for key in ("version", "title", "description"):
        if grammar[key] is not None and type(grammar[key]) is not str:
            _fail("grammar." + key, "must be a string or null")
    abstracts, elements = _object(doc["abstracts"], "abstracts"), _object(doc["elements"], "elements")
    for section_name, section in (("abstracts", abstracts), ("elements", elements)):
        for key in section:
            if type(key) is not str or not key or key.startswith("_"):
                _fail(section_name, f"invalid public name {key!r}")
    parsed_abs = {name: _entry(raw, f"abstracts.{name}", abstract=True) for name, raw in abstracts.items()}
    parsed_elements = {name: _entry(raw, f"elements.{name}", abstract=False) for name, raw in elements.items()}

    schema = Bag()
    schema.set_item("_abstracts", Bag())
    abs_bag = schema["_abstracts"]
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
