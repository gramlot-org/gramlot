import json
from pathlib import Path
import pytest
from gramlot import GramlotBuilder, VisualEditor


def test_composition_uses_independent_roots_and_exposes_source_regions():
    root=Path(__file__).parents[1]/'src/gramlot/collections'
    builder=GramlotBuilder(collections=[json.loads((root/name/'grammar.json').read_text()) for name in ('inputs','layout','tree','uploads','editors')])
    first=VisualEditor(builder.root,editor_id='one',datapath='editors.one',data_root='pages.one',height='400px')
    second=VisualEditor(builder.root.section(node_label='nested'),editor_id='two',datapath='editors.two',data_root='pages.two',
                        code_document=dict(language='python',key='page',path='page.py',content='# Draft',revision='r1',writable=True))
    assert first.frame.node_tag=='framePane'
    assert second.design.static_value.get_node('pageRoot').attr['datapath']=='pages.two'
    assert first.pane.attr['visualEditorId']=='one'
    assert second.pane.attr['codeDocumentKey']=='page'
    def trees(node):
        for child in node.static_value.nodes:
            if child.node_tag=='tree': yield child
            if hasattr(child.static_value,'nodes'): yield from trees(child)
    assert next(t.attr['storepath'] for t in trees(second.pane) if t.attr['id']=='two-source-tree')=='*S.nested.two.layout.center.design'
    assert builder.to_tytx()
    with pytest.raises(ValueError): VisualEditor(builder.root,editor_id='bad.id',datapath='bad',data_root='data')


def test_default_editor_uses_real_data_root_and_excludes_reserved_state():
    root=Path(__file__).parents[1]/'src/gramlot/collections'
    builder=GramlotBuilder(collections=[json.loads((root/name/'grammar.json').read_text()) for name in ('inputs','layout','tree','uploads')])
    editor=VisualEditor(builder.root)
    assert editor.pane.attr['datapath']=='__editor'
    assert 'datapath' not in editor.design.static_value.get_node('pageRoot').attr
    def nodes(node):
        for child in node.static_value.nodes:
            yield child
            if hasattr(child.static_value,'nodes'): yield from nodes(child)
    data_tree=next(n for n in nodes(editor.pane) if n.attr.get('id')=='visual-data-tree')
    assert data_tree.attr['storepath']=='*D'
    assert data_tree.attr['excludeRoot']=='__editor'
    with pytest.raises(ValueError,match='__editor'):
        VisualEditor(builder.root,datapath='outside')
