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
    frame.toolbar.menuline('orders:refresh')
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


def test_frame_grid_owns_one_toolbar_with_optional_search_and_shared_command_access():
    for search in (False, True):
        b = GramlotBuilder(collections=COLLECTIONS)
        frame = b.root.frameGrid(storepath='rows', rowMode='values', searchOn=search)
        bar = frame.toolbar
        bar.menuline(caption='Chart', icon='▥')
        assert frame.toolbar is bar
        assert len(frame.top.static_value) == 1
        assert bar.attr['class'] == 'gramlot-grid-toolbar'
        assert (bar.static_value.get_node('search') is not None) == search
    with pytest.raises(AttributeError, match='no toolbar'):
        _ = b.root.framePane().toolbar


def test_search_help_requires_explicit_opt_in():
    b = GramlotBuilder(collections=COLLECTIONS)
    for enabled in (False, True):
        frame = b.root.frameGrid(storepath='rows', rowMode='values', searchOn=True, searchHelp=enabled)
        search = list(frame.toolbar.static_value.get_node('search').static_value)[0]
        assert search.attr['searchHelp'] is enabled


def test_chart_uses_frame_data_scope_and_shared_window():
    charts = json.loads((Path(__file__).parents[1] / 'src/gramlot/collections/charts.json').read_text())
    b = GramlotBuilder(collections=[*COLLECTIONS, charts])
    frame = b.root.frameGrid(datapath='report', storepath='.rows', rowMode='values',
                            searchOn=True, chart='bar', chart_engine='plotly')
    assert frame.toolbar.static_value.get_node('chart') is not None
    assert frame.grid.attr['nodeId']
    wire = b.to_tytx()
    assert '._chart' in wire and 'configDefaults' in wire and 'plotly' in wire
    assert 'chart_engine' not in wire
    assert frame.attr['datapath'] == 'report'


@pytest.mark.parametrize('options', [dict(chart=True), dict(chart=42, datapath='r'),
                                     dict(chart=False, chart_engine='echarts')])
def test_chart_invalid_options_leave_no_partial_source(options):
    b = GramlotBuilder(collections=COLLECTIONS)
    with pytest.raises(ValueError):
        b.root.frameGrid(storepath='rows', rowMode='values', **options)
    assert len(b.source) == 0


def test_grid_parameters_route_to_the_grid_and_prefixes_force_the_target():
    b = GramlotBuilder(collections=COLLECTIONS)
    frame = b.root.frameGrid(storepath='.rows', rowMode='values', datapath='orders',
                             footer=True, rowHeaders=True, sortedBy='name:a',
                             grid_datapath='.inner', grid_height='80%', grid_class='compact',
                             frame_height='300px', frame_persist=True)
    grid = frame.grid
    assert {key: grid.attr[key] for key in ('footer', 'rowHeaders', 'sortedBy', 'datapath')} == {
        'footer': True, 'rowHeaders': True, 'sortedBy': 'name:a', 'datapath': '.inner'}
    assert grid.attr['height'] == '80%'
    assert grid.attr['class'] == 'compact'
    assert frame.attr['datapath'] == 'orders'
    assert frame.attr['persist'] is True
    assert frame.attr['height'] == '300px'
    assert not {'footer', 'rowHeaders', 'sortedBy'} & set(frame.attr)


def test_frame_grid_routing_rejects_duplicates_and_composed_grid_names():
    b = GramlotBuilder(collections=COLLECTIONS)
    with pytest.raises(ValueError, match="'footer' is given twice"):
        b.root.frameGrid(storepath='rows', rowMode='values', footer=True, grid_footer=False)
    with pytest.raises(ValueError, match="'height' is given twice"):
        b.root.frameGrid(storepath='rows', rowMode='values', height='1px', frame_height='2px')
    with pytest.raises(ValueError, match="'storepath' is given twice"):
        b.root.frameGrid(storepath='rows', rowMode='values', grid_storepath='other')
    with pytest.raises(ValueError, match="'structpath' is given twice"):
        b.root.frameGrid(storepath='rows', rowMode='values', structpath='a', grid_structpath='b')
    for key in ('grid_node_label', 'grid_frameTarget', 'grid_nodeId'):
        with pytest.raises(ValueError, match=f"'{key}' is composed by frameGrid"):
            b.root.frameGrid(storepath='rows', rowMode='values', **{key: 'x'})


TOOL_COLLECTIONS = [json.loads((Path(__file__).parents[1] / f'src/gramlot/collections/{name}.json').read_text())
                    for name in ('inputs', 'layout', 'grid')]


def test_toolbar_tools_are_command_menulines_of_the_grid_namespace():
    b = GramlotBuilder(collections=TOOL_COLLECTIONS)
    frame = b.root.frameGrid(storepath='.rows', rowMode='values', datapath='orders', export=True, printRows=True,
                             advancedTools=True, addrow=True, addrow_defaults={'quantity': 1}, gridsemaphore=True)
    bar = frame.top.value.get_node('bar').value
    assert [(node.label, node.attr.get('command')) for node in bar.nodes] == [
        ('addrow', 'grid:addrow'), ('export', None), ('printRows', 'grid:printRows'),
        ('advancedTools', None), ('semaphore', None)]
    assert bar.get_node('addrow').attr['parameters'] == {'defaults': {'quantity': 1}}
    formats = bar.get_node('export').value.nodes[0].value
    assert [(node.attr['command'], node.attr['caption'], node.attr['parameters']) for node in formats.nodes] == [
        ('grid:export', caption, {'format': name}) for name, caption in
        (('csv', 'CSV'), ('json', 'JSON'), ('tytx', 'TYTX'), ('xml', 'XML'), ('xlsx', 'Excel'))]
    menu = bar.get_node('advancedTools').value.nodes[0].value
    assert [node.attr.get('command') for node in menu.nodes] == ['grid:lineNumbers', None, 'grid:printRows']
    restricted = b.root.frameGrid(storepath='rows', rowMode='values', export='csv,json')
    restricted_formats = restricted.top.value.get_node('bar').value.get_node('export').value.nodes[0].value
    assert [node.attr['parameters']['format'] for node in restricted_formats.nodes] == ['csv', 'json']
    assert bar.get_node('semaphore').value.nodes[0].node_tag == 'editingStatus'
    assert frame.attr['form'] is True


@pytest.mark.parametrize('attrs, message', [
    ({'export': 'csv,yes'}, "export format 'yes' is not one of"),
    ({'export': 1}, 'export requires a boolean or a list of formats'),
    ({'addrow_defaults': {'a': 1}}, 'addrow_defaults requires addrow'),
    ({'gridsemaphore': True}, 'gridsemaphore frameGrid requires its own datapath'),
])
def test_toolbar_tool_switches_are_checked_during_authoring(attrs, message):
    with pytest.raises(ValueError, match=message):
        GramlotBuilder(collections=TOOL_COLLECTIONS).root.frameGrid(storepath='rows', rowMode='values', **attrs)


def test_selection_parameters_are_grid_parameters_routed_by_frame_grid():
    b = GramlotBuilder(collections=TOOL_COLLECTIONS)
    frame = b.root.frameGrid(storepath='.rows', rowMode='values', datapath='orders', selectionMode='single',
                             selectedPkeys='^.pkeys', selected_kind='^.kinds', grid_selected_name='^.names', duprow=True, delrow=True)
    assert {key: frame.grid.attr[key] for key in ('selectionMode', 'selectedId', 'selectedPkeys', 'selected_kind')} == {
        'selectionMode': 'single', 'selectedId': '^.selectedId', 'selectedPkeys': '^.pkeys', 'selected_kind': '^.kinds'}
    assert frame.grid.attr['selected_name'] == '^.names'
    assert 'selected_kind' not in frame.attr, 'the declared selected_<field> family routes to the grid'
    bar = frame.top.value.get_node('bar').value
    assert [node.attr.get('command') for node in bar.nodes] == ['grid:duprow', 'grid:delrow']
    plain = b.root.frameGrid(storepath='rows', rowMode='values')
    assert 'selectedId' not in plain.grid.attr, 'the .selectedId default needs the frame datapath'
    with pytest.raises(ValueError, match='duprow requires a boolean'):
        b.root.frameGrid(storepath='rows', rowMode='values', duprow='yes')
