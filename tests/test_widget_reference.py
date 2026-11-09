"""Keep the teaching reference complete and the compact contracts lossless."""
import html
import json
from pathlib import Path
import re
import sys

import pytest
from gramlot import GramlotBuilder

ROOT = Path(__file__).parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
import generate_widget_reference as reference
from widget_reference_content import COLLECTION_GUIDES


def packaged_collections():
    result = {}
    for path in (ROOT / 'src/gramlot/collections').glob('*.json'):
        if path.name in ('standard.json', 'declared.json'):
            continue  # Collection inventories, not component grammars.
        grammar = json.loads(path.read_text())
        elements = grammar.get('elements') or {}
        if any((element.get('_meta') or {}).get('gramlot_component') is not None
               for element in elements.values()):
            result[path.stem] = grammar
    return result


def compact_contracts(text):
    """Read actual table JSON, independently of the generator's formatting helpers."""
    result = set()
    for line in text.splitlines():
        match = re.match(r'^\| `([^`]+)` \| `(\{.*\})` \|', line)
        if match:
            for name in match[1].split(', '):
                result.add((name, json.dumps(json.loads(html.unescape(match[2])), sort_keys=True)))
    return result


def test_every_packaged_component_has_both_references():
    grammars = packaged_collections()
    assert set(grammars) == set(reference.COLLECTIONS) == set(COLLECTION_GUIDES)
    full, brief = reference.render()
    for collection, grammar in grammars.items():
        number = reference.COLLECTION_IDS[collection]
        human, compact = reference.render((collection,), number)
        contracts = compact_contracts(compact)
        for name, element in grammar['elements'].items():
            meta = (element.get('_meta') or {}).get('gramlot_component')
            if meta is None:
                continue
            for document in (full, brief, human, compact):
                assert f'### `{name}`' in document
            for parameter, spec in meta['parameters'].items():
                assert (parameter, json.dumps(spec, sort_keys=True)) in contracts, (collection, name, parameter)
            for parameter, spec in meta.get('childParameters', {}).items():
                assert (parameter, json.dumps(spec, sort_keys=True)) in contracts
            for document in (human, compact):
                children = "''" if element.get('sub_tags') == '' else element.get('sub_tags')
                assert f'Child grammar: `{children}`' in document
                assert f'parent grammar: `{element.get("parent_tags")}`' in document
            section = compact.split(f'### `{name}`\n', 1)[1].split('\n### ', 1)[0].split('\n## ', 1)[0]
            own_contracts = compact_contracts(section)
            for parameter, spec in meta['parameters'].items():
                if reference.shared_group(name, parameter) is None:
                    assert (parameter, json.dumps(spec, sort_keys=True)) in own_contracts


def test_shared_contract_scope_does_not_claim_another_widgets_default():
    _, compact = reference.render(('inputs',), 410)
    rows = compact.splitlines()
    for name, element in packaged_collections()['inputs']['elements'].items():
        meta = element['_meta']['gramlot_component']
        for parameter, spec in meta['parameters'].items():
            if reference.shared_group(name, parameter) is None:
                continue
            matching = [row for row in rows if row.startswith('| `')
                        and parameter in row.split('|')[1].strip().strip('`').split(', ')
                        and name in row.split('|')[-2].strip().split(', ')]
            assert len(matching) == 1, (name, parameter)
            payload = matching[0].split('|')[2].strip().strip('`')
            assert json.loads(html.unescape(payload)) == spec


def test_struct_signatures_preserve_required_args_and_regexes():
    grammar = packaged_collections()['grid']
    human, compact = reference.render(('grid',), 445)
    for text in (compact,):
        blocks = [json.loads(body) for body in re.findall(r'```json\n(.*?)\n```', text, re.S)]
        for name in ('struct', 'column', 'colgroup'):
            assert grammar['elements'][name]['attributes'] in blocks
            for parameter in grammar['elements'][name]['attributes']['parameters']:
                assert f'`{parameter["name"]}`' in human
                assert parameter['kind'] in human
                for constraint in parameter['annotation'].get('metadata', []):
                    assert constraint['pattern'] in html.unescape(human)


def test_generated_documents_are_fresh_unique_and_paired():
    documents = dict(reference.generated_documents())
    for path, text in documents.items():
        assert path.read_text() == text, f'Regenerate {path}'
        anchors = re.findall(r'<a id="([^"]+)"', text)
        assert len(anchors) == len(set(anchors)), path
        if path.is_relative_to(ROOT / 'docs'):
            counterpart = ROOT / 'docs_llm' / path.relative_to(ROOT / 'docs')
            assert set(anchors) == set(re.findall(r'<a id="([^"]+)"', documents[counterpart]))
    full, _ = reference.render()
    for anchor in ('gc-345-220', 'gc-345-225', 'gc-345-340',
                   'gc-345-traypane', 'gc-345-transformpane', 'gc-345-uploader'):
        assert f'id="{anchor}"' in full


@pytest.mark.parametrize('collection', reference.COLLECTIONS)
def test_minimal_python_recipe_builds_source(collection):
    grammars = [grammar for name, grammar in packaged_collections().items() if name != 'buttons']
    builder = GramlotBuilder(collections=grammars)
    code = COLLECTION_GUIDES[collection][2]
    exec(compile(code, f'<{collection}-reference>', 'exec'), {'root': builder.root})
    assert builder.to_tytx()


def test_reviewed_behavior_covers_the_packaged_inventory_and_stays_out_of_examples():
    from widget_coverage import COVERAGE, STRUCTURAL, DIMENSIONS
    expected = {name for grammar in packaged_collections().values()
                for name, element in grammar['elements'].items()
                if element.get('_meta', {}).get('gramlot_component') is not None}
    assert set(COVERAGE) == expected
    assert set(STRUCTURAL) == {'struct', 'column', 'colgroup'}
    for collection in reference.COLLECTIONS:
        for text in reference.render((collection,), reference.COLLECTION_IDS[collection]):
            assert not re.search(r'^```(?:python|javascript)', text, re.M)
    full, brief = reference.render()
    for widget, record in COVERAGE.items():
        assert record['sources']
        for text in (full, brief):
            section = text.split(f'### `{widget}`\n', 1)[1].split('\n### ', 1)[0]
            for key, label in DIMENSIONS:
                assert record[key] in section, (widget, key)
                assert f'**{label}.**' in section
        for evidence in (*record['sources'], *record['tests']):
            assert (ROOT / evidence).is_file(), (widget, evidence)


@pytest.mark.parametrize('path', sorted(reference.GUIDES.glob('*.md')), ids=lambda path: path.stem)
def test_authored_collection_pages_link_every_component_and_build_their_examples(path):
    number, collection = path.stem.split('-', 1)
    assert collection in reference.COLLECTIONS
    text = path.read_text()
    grammar = packaged_collections()[collection]
    for name, element in grammar['elements'].items():
        if (element.get('_meta') or {}).get('gramlot_component') is None:
            continue
        assert f'id="gc-{number}-{name.lower()}"' in text, name
        assert f'345-widget-reference.md#gc-345-{name.lower()}' in text, name
    grammars = [grammar for name, grammar in packaged_collections().items() if name != 'buttons']
    for code in re.findall(r'```python\n(.*?)```', text, re.S):
        builder = GramlotBuilder(collections=grammars)
        scope = {'root': builder.root, 'form': builder.root.div(datapath='form')}
        exec(compile(code, f'<{path.name}>', 'exec'), scope)
        if 'main' in scope:
            scope['main'](None, builder.root)
        assert builder.to_tytx()
        # The builder accepts any keyword: check each example against the component metadata.
        for _, node in builder.root._iter_nodes_with_paths():
            meta = (node.attr.get('_meta') or {}).get('gramlot_component')
            if meta is None:
                continue
            for attribute, value in node.attr.items():
                if attribute == '_meta' or attribute.startswith(('box_', 'lbl_')):
                    continue
                spec = meta['parameters'].get(attribute)
                assert spec is not None, (path.name, node.label, attribute)
                if 'enum' in spec and not str(value).startswith('^'):
                    assert value in spec['enum'], (path.name, node.label, attribute, value)
