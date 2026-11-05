"""Python delegates composition to the shared JavaScript chartPane component."""
import json
from pathlib import Path
import pytest
from genro_bag import Bag
from gramlot import ChartPane, GramlotBuilder


def builder():
    path = Path(__file__).parents[1] / 'src/gramlot/collections'
    return GramlotBuilder(collections=[json.loads((path / f'{name}.json').read_text())
        for name in ('layout', 'grid', 'inputs', 'charts')])


@pytest.mark.parametrize('mode', ['attributes', 'values'])
def test_python_authors_shared_component_without_gui_or_calculation(mode):
    rows = Bag(); config = Bag(dict(chartType='line'))
    config.set_item('seriesOptions.hours', Bag(dict(axis='right', color='#123456', selected=False)))
    pane = ChartPane(builder().root, store=rows, configuration=config,
        storepath='metrics.rows', datapath='metrics.config', rowMode=mode)
    assert pane.pane.attr['storepath'] == 'metrics.rows'
    assert pane.pane.attr['configpath'] == 'metrics.config'
    assert pane.pane.attr['rowMode'] == mode
    assert not pane.pane.value
    assert config.get_item('seriesOptions.hours.selected') is False
    assert 'aggregation' not in config


def test_two_instances_use_independent_configuration_paths():
    b = builder(); rows = Bag()
    first = ChartPane(b.root, store=rows, configuration=Bag(), storepath='rows', datapath='first.config')
    second = ChartPane(b.root, store=rows, configuration=Bag(), storepath='rows', datapath='second.config')
    assert first.pane.attr['configpath'] == 'first.config'
    assert second.pane.attr['configpath'] == 'second.config'
