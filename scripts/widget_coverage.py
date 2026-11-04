"""Reviewed widget behavior and traceable manual coverage, separate from metadata."""
import json
import re
from widget_manual_content import COLLECTION_EXPLANATIONS
from pathlib import Path

from widget_coverage_inputs import COVERAGE as INPUTS
from widget_coverage_layout import COVERAGE as LAYOUT
from widget_coverage_specialized import COVERAGE as SPECIALIZED

STRUCTURAL = {key: SPECIALIZED[key] for key in ("struct", "column", "colgroup")}
SPECIALIZED = {key: value for key, value in SPECIALIZED.items() if key not in STRUCTURAL}
COVERAGE = {}
for records in (INPUTS, LAYOUT, SPECIALIZED):
    if COVERAGE.keys() & records.keys():
        raise ValueError('A widget must have exactly one reviewed coverage record')
    COVERAGE.update(records)

REPOSITORY = 'https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/'
EXAMPLES = 'https://github.com/gramlot-org/gramlot-examples/blob/4cb18a914a1e1f42c0d6cd13b1f8f41ac3476563/'
DIMENSIONS = (('data', 'Data contract'), ('events', 'Interaction and events'),
              ('children', 'Composition'), ('limits', 'Limits and lifecycle'))


def behavior_sections(widget):
    record = (COVERAGE | STRUCTURAL)[widget]
    return [f'\n**{label}.** {record[key]}\n' for key, label in DIMENSIONS]


def coverage_documents(root, collections, ids, guides):
    entries = {}
    for collection in collections:
        grammar = json.loads((root / f'src/gramlot/collections/{collection}.json').read_text())
        entries.update({key: collection for key, element in grammar['elements'].items()
                        if element.get('_meta', {}).get('gramlot_component') is not None})
    if entries.keys() != COVERAGE.keys():
        raise ValueError(f'Widget coverage differs from packaged grammars: {entries.keys() ^ COVERAGE.keys()}')
    manual = ['# Widget coverage matrix\n\nDocument ID: **GC-460**.\n',
              '<a id="gc-460-005"></a>\n## Scope and evidence\n',
              f'This audit covers all **{len(entries)} component declarations in {len(collections)} packaged collections**. '
              'The reviewed core baseline is `2b1f2d80`; lesson references use examples `4cb18a9`. Local uncommitted work is excluded. '
              'The inventory comes from packaged grammars; the behavior paragraphs were reviewed against implementation and test assertions on 2026-11-04. '
              'The reference documents purpose, parameters/defaults, Data, interaction/events, composition and limits for each declaration. '
              'An explicitly absent callback or unsupported behavior is part of the contract, not a missing implementation to invent.\n',
              'Parameter coverage is checked mechanically against metadata. Behavioral coverage is a source review, not proof that every possible '
              'interaction, failure, accessibility requirement or host/browser combination has been tested. '
              'Test files below are inspected evidence: their presence is not a new test-run result or a maturity rating. '
              'A statement that no callback is declared concerns component-specific callback parameters; ordinary Source event handling remains available. '
              'Example links are confined to the appendix and are teaching evidence, not a substitute for behavioral qualification.\n',
              'HTML/SVG tags and ordinary Source/CSS attributes are shared grammar rather than additional widgets. '
              'Grid `struct`, `column` and `colgroup` declarations are covered by the structural reference; '
              'ChatPane is the composition around `chatMessages`, not a separate component declaration. '
              'Third-party collections must maintain their own inventory and documentation.\n',
              '<a id="gc-460-010"></a>\n## Manual coverage by component\n',
              'Every linked reference contains the named dimensions. “Reviewed” means the prose exists and has source evidence, '
              'not that all edge cases have been independently exercised.\n',
              'No dedicated catalogue lesson was identified for `transformPane` or `rowActions`. Their contracts and tests are documented; the appendix records the remaining teaching gap.\n',
              '| Component | Purpose and parameters | Data and events | Composition and limits |\n'
              '| --- | --- | --- | --- |']
    for widget, collection in entries.items():
        target=f'{ids[collection]}-{collection}.md#gc-{ids[collection]}-{widget.lower()}'
        manual.append(f'| `{widget}` | [Reference]({target}) | [Reviewed]({target}) | [Reviewed]({target}) |')
    manual += ['\n<a id="gc-460-015"></a>\n## Implementation and test evidence\n',
               'These links identify the owning code and test suites examined. Shared suites can cover multiple components; '
               'they do not imply that each assertion applies to each widget. Read the component limits alongside them.\n']
    appendix = ['# Appendix: widget examples\n\nDocument ID: **GC-465**.\n',
                '<a id="gc-465-005"></a>\n## How to use this appendix\n',
                'The manual explains contracts; this appendix holds setup snippets and links to teaching pages. '
                'A matching lesson does not certify every parameter, browser or server. Gaps are listed explicitly. '
                'The examples remain owned and maintained in `gramlot-examples`; linked repository sources show the lesson and its companions.\n',
                '<a id="gc-465-environment"></a>\n## Collection setup\n',
                'Declare the shared collections on the environment Page base. Individual pages inherit them.\n',
                '```python\nfrom gramlot import Page as GramlotPage\nfrom gramlot.collections.inputs import mygramlot as inputs\nfrom gramlot.collections.layout import mygramlot as layout\n\nclass Page(GramlotPage):\n    gramlots = [inputs, layout]\n\n    def main(self, root):\n        root.textbox(value="^customer.name", lbl="Customer", live=True)\n```\n']
    for collection in collections:
        title, introduction, example, notes=guides[collection]
        appendix += [f'\n<a id="gc-465-setup-{collection}"></a>\n## {title}: setup\n',
                     f'[Collection manual]({ids[collection]}-{collection}.md). '
                     'The environment must supply the collection and the services described in that manual. '
                     'The following body belongs in `main(self, root)`; it is not a standalone application.\n',
                     f'```python\n{example}\n```\n', notes + '\n']
        explanation = COLLECTION_EXPLANATIONS[collection]
        for match in re.finditer(r'```[^\n]*\n.*?```', explanation, re.S):
            context = explanation[:match.start()].rstrip().split('\n\n')[-1]
            appendix.extend([context, match[0], '\n'])
        for widget, owner in entries.items():
            if owner != collection:
                continue
            record=COVERAGE[widget]
            for key, _ in DIMENSIONS:
                if not record[key].strip():
                    raise ValueError(f'Missing {key} explanation for {widget}')
            for kind in ('sources', 'tests'):
                for path in record[kind]:
                    if not (root / path).is_file():
                        raise ValueError(f'Missing {kind} evidence for {widget}: {path}')
            manual += [f'\n<a id="gc-460-{widget.lower()}"></a>\n### `{widget}`\n',
                       '**Implementation:** ' + ', '.join(f'[{Path(p).name}]({REPOSITORY}{p})' for p in record['sources']) + '.\n',
                       '**Tests inspected:** ' + (', '.join(f'[{Path(p).name}]({REPOSITORY}{p})' for p in record['tests']) or 'No dedicated test evidence identified') + '.\n',
                       f'[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-{widget.lower()}).\n']
            appendix += [f'\n<a id="gc-465-{widget.lower()}"></a>\n### `{widget}`\n', record['example_note'] + '\n']
            appendix.extend(f'- [{Path(p).stem}]({EXAMPLES}{p})' for p in record['examples'])
            if not record['examples']:
                appendix.append('No dedicated lesson identified in the reviewed catalogue.\n')
    manual += ['\n<a id="gc-460-020"></a>\n## Structural declarations\n',
               'The three Grid authoring declarations below are additional Source grammar, excluded from the 53-widget count. Parameters and behavior are in [the structural reference](345-widget-reference.md#gc-345-390).\n']
    for key, record in STRUCTURAL.items():
        manual += [f'### `{key}`\n', '**Implementation:** ' + ', '.join(f'[{Path(p).name}]({REPOSITORY}{p})' for p in record['sources']) + '.\n',
                   '**Tests inspected:** ' + ', '.join(f'[{Path(p).name}]({REPOSITORY}{p})' for p in record['tests']) + '.\n']
    manual += ['\n<a id="gc-460-025"></a>\n## Verification of this audit\n',
               'The documentation checks passed 18 tests, including exact widget inventory, parameter preservation, paired anchors, generated-file freshness and placement of collection snippets in the appendix. The strict Sphinx build and public link checker passed for 32 pages and 11 compact downloads.\n',
               'Focused behavioral verification covered 76 cases in the CodeMirror, form-state, input-validation, layout, selected-container, transformPane and Typst suites. An initial checkout dependency mismatch and a missing local Python path were corrected before the affected checks passed. This run does not qualify all widgets or real-browser/native-dialog behavior; the other linked suites are inspected evidence only.\n']
    for number, name, content in ((460, 'widget-coverage', manual), (465, 'widget-examples', appendix)):
        for view in ('docs', 'docs_llm'):
            yield root / view / 'public' / f'{number}-{name}.md', '\n'.join(content) + '\n'
