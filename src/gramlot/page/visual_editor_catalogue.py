"""Tag scope shared by VisualEditor authoring and SourceImport."""
from genro_builders.contrib.html import HtmlBuilder
from genro_builders.builder import SourceBag

_HTML_TAGS = frozenset(node.label for node in HtmlBuilder()._schema.nodes
                      if not node.label.startswith('_') and not any(
                          (node.attr.get('_meta') or {}).get(key)
                          for key in ('data_element', 'subbuilder', 'container')))


def validate_catalogue(catalogue):
    if catalogue is None or catalogue == 'html':
        return
    if not isinstance(catalogue, list) or any(not isinstance(tag, str) or not tag or tag.strip() != tag for tag in catalogue):
        raise TypeError('catalogue must be "html" or a list of tag names')
    if 'div' not in catalogue:
        raise ValueError('catalogue must include div for pageRoot')


def validate_catalogue_source(catalogue, source):
    if catalogue is None:
        return

    def visit(bag, prefix=''):
        for node in bag.nodes:
            path = f'{prefix}.{node.label}' if prefix else node.label
            meta = node.attr.get('_meta') or {}
            allowed = node.node_tag in catalogue if isinstance(catalogue, list) else (
                not any(meta.get(key) for key in ('gramlot_component', 'data_element', 'subbuilder', 'container'))
                and meta.get('render_tag', node.node_tag) in _HTML_TAGS)
            if not allowed:
                raise ValueError(f'Tag {node.node_tag} is outside the editor catalogue at {path}')
            if node.resolver:
                raise ValueError(f'Catalogue scope requires materialized Source at {path}')
            if isinstance(node.static_value, SourceBag):
                visit(node.static_value, path)
    visit(source)
