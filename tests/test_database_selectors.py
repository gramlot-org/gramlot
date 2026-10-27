"""Portable database selector authoring and endpoint contracts."""
import json
from importlib.resources import files

import pytest

from gramlot import GramlotBuilder, Page
from gramlot.db import DatabaseSelectors
from gramlot.page.base import endpoint_methods


def test_database_input_grammar_preserves_typed_keys_and_legacy_names():
    grammar = json.loads(files('gramlot').joinpath('collections/inputs.json').read_text())
    builder = GramlotBuilder(collections=[grammar])
    pane = builder.root.div(datapath='form')
    for value in (0, 12, 'code', None, '^.customer'):
        node = pane.DBSELECT(value=value, dbtable='customers', method='eligible', condition_country='^.country',
                             selected_email='.email', lbl='Customer')
        assert node.attr['_meta']['render_tag'] == 'gramlot-db-select'
        assert node.attr.get('value') == value
    assert pane.dbComboBox(value='New name').attr['_meta']['render_tag'] == 'gramlot-db-combo-box'
    with pytest.raises((TypeError, ValueError)):
        pane.dbComboBox(value=12)
    assert builder.to_tytx()


def test_default_endpoint_delegates_without_a_database_dependency():
    class Provider:
        def select(self, **parameters):
            return parameters
    class Example(DatabaseSelectors, Page):
        database = Provider()
    assert 'dbSelect' in endpoint_methods(Example)
    assert Example().dbSelect(dbtable='customers', _id=0) == {'dbtable':'customers', '_id':0}
    with pytest.raises(ValueError, match='dedicated'):
        Example().dbSelect(dbtable='customers', _id=0, where='SQL')
