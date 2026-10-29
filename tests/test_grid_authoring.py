"""Public Python grammar contracts for the bounded, read-only Bag grid."""
import json
from pathlib import Path

import pytest
from gramlot import GramlotBuilder

COLLECTION = json.loads((Path(__file__).parents[1] / "src/gramlot/collections/grid.json").read_text())


def builder():
    return GramlotBuilder(collections=[COLLECTION])


def test_nested_struct_and_groups_have_explicit_field_identity():
    b = builder()
    g = b.root.grid(storepath="rows", rowMode="attributes")
    s = g.struct()
    s.column("code", name="Code")
    group = s.colgroup("amounts", name="Amounts")
    group.column("price", dtype="N", format="0.00")
    assert group.attr["code"] == "amounts"
    assert "price" in b.to_tytx()
    assert b.data.get_node("rows") is None


def test_external_structure_requires_no_builder_content():
    b = builder()
    grid = b.root.grid(storepath="rows", structpath="columns", rowMode="values")
    assert grid.attr["structpath"] == "columns"


@pytest.mark.parametrize("attrs", [{"storepath": "rows"}, {"rowMode": "values"},
                                  {"storepath": "rows", "rowMode": "auto"}])
def test_row_representation_and_data_path_are_explicit(attrs):
    with pytest.raises((TypeError, ValueError)):
        builder().root.grid(**attrs)


def test_struct_rejects_undeclared_formula_in_this_increment():
    s = builder().root.grid(storepath="rows", rowMode="values").struct()
    with pytest.raises((TypeError, ValueError)):
        s.column("total", formula="quantity * price")


@pytest.mark.parametrize("attrs", [{"dtype": "UNKNOWN"}, {"align": "left"}, {"width": "wide"}])
def test_column_options_are_checked_during_authoring(attrs):
    s = builder().root.grid(storepath="rows", rowMode="values").struct()
    with pytest.raises((TypeError, ValueError)):
        s.column("code", **attrs)


def test_legacy_style_names_remain_explicit_in_source():
    group = builder().root.grid(storepath="rows", rowMode="attributes").struct().colgroup(
        "delivery", background="var(--gramlot-success)", color="var(--gramlot-success-background)")
    column = group.column("notes", white_space="pre-wrap")
    assert column.attr["white_space"] == "pre-wrap"
    assert group.attr["background"] == "var(--gramlot-success)"
    with pytest.raises((TypeError, ValueError)):
        group.column("bad", white_space="unknown")
