"""Tree check lists are authored in Python as in JavaScript: checkedPaths and checked_<attribute>."""
import json
from pathlib import Path

from gramlot import GramlotBuilder


def test_tree_accepts_checked_attribute_lists():
    grammar = json.loads((Path(__file__).parents[1] / 'src/gramlot/collections/tree.json').read_text())
    builder = GramlotBuilder(collections=[grammar])
    pane = builder.root.div(datapath='model', node_label='pane')
    tree = pane.tree(node_label='tree', storepath='.nodes', checkedPaths='^.checked',
                     checked_id='.ids', checked_code='.codes:;', checkChildren=False)
    assert tree.attr['checked_id'] == '.ids'
    assert tree.attr['checked_code'] == '.codes:;'
    assert tree.attr['checkedPaths'] == '^.checked'
    wire = builder.to_tytx()
    assert 'checked_id' in wire and '.codes:;' in wire
    element = grammar['elements']['tree']['attributes']
    assert element['accepts_var_keyword'] is True
    assert {'checkedPaths', 'checkedPaths_joiner', 'checkChildren', 'onChecked'} <= {
        parameter['name'] for parameter in element['parameters']}
