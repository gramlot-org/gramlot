"""frameGrid composes the current frame and optional grid without a second runtime."""
import json
from pathlib import Path

import pytest
from gramlot import GramlotBuilder

COLLECTIONS = [json.loads((Path(__file__).parents[1] / f'src/gramlot/collections/{name}.json').read_text())
               for name in ('layout', 'grid')]


def test_frame_grid_keeps_real_nodes_and_shared_frame_accessors():
    builder = GramlotBuilder(collections=COLLECTIONS)
    frame = builder.root.frameGrid(storepath='.rows', rowMode='attributes', datapath='orders', height='320px')
    assert frame.node_tag == 'framePane'
    assert frame.grid is frame.grid
    assert frame.grid.parent_node is frame.center
    assert frame.grid.attr['storepath'] == '.rows'
    assert frame.grid.attr['frameTarget'] is True
    assert 'storepath' not in frame.attr
    frame.grid.struct().column('name')
    frame.top.menu(presentation='bar').menuline('orders:refresh')
    frame.bottom.menu(presentation='bar').menuline(group=True).span('Ready')
    wire = builder.to_tytx()
    assert 'frameGrid' not in wire
    assert 'framePane' in wire and 'orders:refresh' in wire


def test_external_structure_and_nested_frames_have_independent_grids():
    b = GramlotBuilder(collections=COLLECTIONS)
    outer = b.root.framePane()
    one = outer.center.frameGrid(storepath='a', rowMode='values', structpath='columns')
    two = outer.center.frameGrid(storepath='b', rowMode='attributes', structpath='columns')
    assert one.grid is not two.grid
    assert one.grid.attr['structpath'] == 'columns'
    assert two.grid.attr['rowMode'] == 'attributes'


@pytest.mark.parametrize('collections', [[], COLLECTIONS[:1], COLLECTIONS[1:]])
def test_required_collections_are_explicit(collections):
    b = GramlotBuilder(collections=collections)
    with pytest.raises(ValueError, match='frameGrid requires'):
        b.root.frameGrid(storepath='rows', rowMode='values')
    assert len(b.source) == 0


def test_an_ordinary_frame_without_grid_does_not_gain_an_implicit_grid():
    b = GramlotBuilder(collections=COLLECTIONS)
    with pytest.raises(AttributeError, match='no central grid'):
        _ = b.root.framePane().grid


@pytest.mark.parametrize('attrs', [dict(storepath=None, rowMode='values'),
                                   dict(storepath='rows', rowMode='invalid')])
def test_invalid_grid_parameters_do_not_leave_a_partial_frame(attrs):
    b = GramlotBuilder(collections=COLLECTIONS)
    with pytest.raises(ValueError):
        b.root.frameGrid(**attrs)
    assert len(b.source) == 0


def test_search_on_composes_a_real_toolbar_and_keeps_store_binding_on_the_grid():
    b = GramlotBuilder(collections=COLLECTIONS)
    frame = b.root.frameGrid(storepath='.rows', rowMode='values', searchOn='Name:name,Count:qty')
    wire = b.to_tytx()
    assert 'searchBox' in wire and 'Name:name,Count:qty' in wire
    assert 'searchOn' not in frame.attr
    assert frame.grid.attr['storepath'] == '.rows'
