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


def test_catalogue_scope_is_serialized_and_upload_rejects_nested_components():
    from gramlot import SourceImport
    root=Path(__file__).parents[1]/'src/gramlot/collections'
    builder=GramlotBuilder(collections=[json.loads((root/name/'grammar.json').read_text()) for name in ('inputs','layout','tree','uploads')])
    editor=VisualEditor(builder.root,catalogue='html',file_commands=False,canvas_css=['body { color: red; }'])
    assert any(n.attr.get('hidden') is True for n in editor.toolbar.static_value.nodes)
    scope=next(n for n in editor.pane.static_value.nodes if n.attr.get('destination_path')=='.catalogueScope')
    assert scope.attr['value']=='html'
    assert 'catalogueScope' not in editor.design.static_value.get_node('pageRoot').attr
    for tag,allowed in [('a',True),('button',False)]:
        source=GramlotBuilder()
        page=source.root.div(node_label='pageRoot')
        getattr(page.div(node_label='nested'),tag)('Example')
        upload=SourceImport(catalogue='html')
        upload.write(source.to_tytx().encode())
        if allowed:
            assert upload.finish()['state']=='completed'
        else:
            with pytest.raises(ValueError,match='outside the editor catalogue'):
                upload.finish()
            assert upload.status()['state']!='completed'
    for scope in ('all',{},['a']):
        with pytest.raises((ValueError,TypeError),match='catalogue'):
            SourceImport(catalogue=scope)
