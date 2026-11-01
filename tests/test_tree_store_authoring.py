"""The tree store is authored in Source; branches stay deferred on the wire."""
import json
from pathlib import Path

from genro_bag import Bag
from genro_tytx import to_tytx
from gramlot import GramlotBuilder
from gramlot.page import tree_store
from gramlot.tree_store import TreeStoreResolver


def test_tree_store_python_source_and_branch_descriptor():
    grammar = json.loads((Path(__file__).parents[1] / 'src/gramlot/collections/tree.json').read_text())
    builder = GramlotBuilder(collections=[grammar])
    tree_store(builder.root, datapath='model', method='children', params={'table': 'app.customer'})
    wire = builder.to_tytx()
    assert 'treeStoreMount' in wire
    assert 'children' in wire
    bag = Bag()
    bag.set_item('lazy', TreeStoreResolver(), child_count=0)
    wire = to_tytx(bag)
    assert 'TreeStoreResolver' in wire
    assert 'child_count' in wire
