"""Provisional menu/frame authoring consumes the JS-generated grammar."""
import json
from importlib.resources import files
import pytest
from gramlot import GramlotBuilder


def builder():
    return GramlotBuilder(collections=[json.loads(files('gramlot').joinpath('collections/layout.json').read_text())])


def test_regions_are_created_once_and_remain_real_source_nodes():
    frame = builder().root.framePane()
    assert frame.top is frame.top
    assert len(frame.static_value) == 1
    assert frame.top.attr['region'] == 'top'
    assert frame.top.attr['flex_direction'] == 'column'
    assert frame.left.attr['flex_direction'] == 'row'
    frame.center.contentPane(frameTarget=True)
    assert len(frame.static_value) == 3


def test_registered_occurrences_composition_and_resolver_bindings():
    b = builder()
    frame = b.root.framePane()
    bar = frame.top.menu(presentation='bar', orientation='horizontal')
    first = bar.menuline('documenti:save', parameters={'id': '^document.id'}, checked='^checked', disabled='^locked', hidden='^hidden')
    second = bar.menuline('documenti:save', caption='Save a copy')
    assert first.attr['command'] == 'documenti:save'
    assert first.label != second.label
    assert first.static_value is None
    bar.spacer(size=12)
    bar.spacer(flex=1)
    bar.contentPane().menu(presentation='bar', orientation='vertical').menuline('documenti:undo')
    submenu = bar.menuline(caption='Export').menu(resolver='export_menu', resolver_id='^document.id', cacheTime=30)
    assert submenu.attr['resolver'] == 'export_menu'
    assert submenu.attr['resolver_id'] == '^document.id'
    assert len(submenu.static_value) == 0
    assert first.root_builder is b


def test_command_must_not_be_declared_twice():
    with pytest.raises((TypeError, ValueError), match='command'):
        builder().root.menu().menuline('documenti:save', command='documenti:undo')


def test_toolbar_groups_keep_source_ownership_and_overflow_metadata():
    b = builder()
    bar = b.root.framePane().top.menu(presentation='bar')
    editing = bar.menuline(group=True, priority=80)
    save = editing.menuline('documenti:save', disabled='^locked')
    search = bar.menuline(group=True, overflowable=False)
    field = search.input(value='^query', live=True)
    assert editing.attr['group'] is True
    assert editing.attr['priority'] == 80
    assert search.attr['overflowable'] is False
    assert save.parent_node is editing
    assert field.parent_node is search
    assert save.attr['command'] == 'documenti:save'
    assert field.attr['value'] == '^query'



def test_toolbar_label_modes_and_group_overrides_use_generated_grammar():
    b = builder()
    bar = b.root.menu(presentation='bar', labelPosition='below', iconSize=28)
    group = bar.menuline(group=True, labelPosition='tooltip', iconSize=32)
    item = group.menuline('documenti:save', labelPosition='beside')
    assert bar.attr['labelPosition'] == 'below'
    assert bar.attr['iconSize'] == 28
    assert group.attr['labelPosition'] == 'tooltip'
    assert group.attr['iconSize'] == 32
    assert item.attr['labelPosition'] == 'beside'
    assert item.attr['command'] == 'documenti:save'


def test_svg_icon_and_entry_presentation_are_distinct():
    bar = builder().root.menu(presentation='bar', iconSize=28)
    item = bar.menuline('documenti:save', iconSrc='^save_icon', caption='Save copy',
                        class_='save-copy', color='blue', width='140px', height='52px')
    assert item.attr['iconSrc'] == '^save_icon'
    assert item.attr['caption'] == 'Save copy'
    assert item.attr['width'] == '140px'
    assert bar.attr['iconSize'] == 28
