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


def test_formula_and_totals_are_declared_as_in_javascript():
    g = builder().root.grid(storepath="rows", rowMode="values", footer="Total")
    s = g.struct()
    total = s.column("total", formula="quantity * price * rate", formula_rate="^.rate",
                     calculated=True, totalize=True, footer_format="#,##0.00")
    s.column("position", formula="#", hidden=True)
    s.column("share", formula="%=total", totalize=".summary.share", footer_value="%")
    assert g.attr["footer"] == "Total"
    assert total.attr["formula_rate"] == "^.rate"
    assert total.attr["calculated"] is True


@pytest.mark.parametrize("attrs", [{"sum": True}, {"formula-rate": 1}, {"formulas_rate": 1}, {"formula_": 1}])
def test_column_rejects_unknown_attributes_except_formula_parameters(attrs):
    s = builder().root.grid(storepath="rows", rowMode="values").struct()
    assert s.column("total", formula="a * rate", formula_rate=2).attr["formula_rate"] == 2
    with pytest.raises((TypeError, ValueError), match="unknown attribute"):
        s.column("other", formula="a * rate", **attrs)


@pytest.mark.parametrize("attrs", [{"calculated": "yes"}, {"hidden": 1}, {"totalize": 3}, {"footer_format": 2}])
def test_formula_options_are_checked_during_authoring(attrs):
    s = builder().root.grid(storepath="rows", rowMode="values").struct()
    with pytest.raises((TypeError, ValueError)):
        s.column("total", formula="quantity * price", **attrs)


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


def test_local_editors_use_boolean_or_dictionary_options():
    s = builder().root.grid(storepath='rows', rowMode='values').struct()
    assert s.column('name', edit=True).attr['edit'] is True
    assert s.column('amount', dtype='L', edit=dict(validate_min=0)).attr['edit'] == {'validate_min': 0}
    with pytest.raises((TypeError, ValueError)):
        s.column('bad', edit='yes')


@pytest.mark.parametrize("height", ["96px", "6rem", "4.5em"])
def test_column_max_height_is_a_shared_struct_option(height):
    column = builder().root.grid(storepath="rows", rowMode="values").struct().column(
        "notes", white_space="pre-wrap", max_height=height, edit={"tag": "textBoxArea"})
    assert column.attr["max_height"] == height


@pytest.mark.parametrize("height", ["-1px", "50%", "auto", "calc(2rem)", 96])
def test_column_max_height_rejects_unsupported_lengths(height):
    with pytest.raises((TypeError, ValueError)):
        builder().root.grid(storepath="rows", rowMode="values").struct().column("notes", max_height=height)


def test_selection_mode_and_publication_paths_are_declared():
    g = builder().root.grid(storepath="rows", rowMode="values", selectionMode="multi", selectedId="^.id",
                            selectedIndex="^.index", selectedPkeys="^.pkeys", selectedNodes="^.nodes")
    assert g.attr["selectionMode"] == "multi"
    assert g.attr["selectedNodes"] == "^.nodes"
