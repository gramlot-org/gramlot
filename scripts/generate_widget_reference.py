"""Render the public widget reference from packaged component metadata."""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COLLECTIONS = ('inputs', 'buttons', 'layout', 'tree', 'editors', 'typst')
# Human explanations complement the executable parameter contract.
DESCRIPTIONS = {
 'textbox': 'Single-line text with label, validation and optional live updates.',
 'passwordbox': 'Masked text entry; masking does not encrypt or persist the value.',
 'textBoxArea': 'Multiline plain text with the same field and validation contract.',
 'checkbox': 'Boolean value, displayed as a checkbox or a switch.',
 'radioButton': 'One Boolean radio option; the Source-scoped group keeps its members mutually exclusive.',
 'radioButtonText': 'A group of local radio choices storing one option code.',
 'colorpicker': 'Browser color input, with a bound color value.',
 'horizontalSlider': 'A bounded numeric range displayed horizontally.',
 'verticalSlider': 'A bounded numeric range displayed vertically.',
 'numberTextBox': 'Locale-aware numeric editing; Data keeps the declared numeric type.',
 'dateTextBox': 'Civil date editing with an optional calendar popup.',
 'timeTextBox': 'Civil time editing with locale-aware text parsing.',
 'filteringSelect': 'Search a closed set of local choices; Data stores the selected code.',
 'callbackSelect': 'Choices supplied by a page callback.',
 'comboBox': 'Suggestions with free text allowed.',
 'dbSelect': 'Endpoint-backed choices. Requires an application endpoint implementing the choice response contract; it supplies no database adapter.',
 'dbComboBox': 'Endpoint-backed suggestions with free text; the application owns the endpoint and persistence.',
 'checkBoxText': 'A local multi-choice group storing the selected codes.',
 'dateCalendar': 'An inline civil-date calendar.',
 'button': 'An application action button using the existing action/Logic contract.',
 'toggleButton': 'A command button with a bound Boolean selected state.',
 'dropDownButton': 'Separate main-action and submenu surfaces; distinct from a menu bar.',
 'menu': 'A hierarchy presented as a popup or a permanent horizontal/vertical toolbar.',
 'menuline': 'A command, separator, submenu parent or indivisible toolbar group.',
 'spacer': 'Fixed or elastic space in a menu/toolbar; it does not publish a command.',
 'dialog': 'A modal window containing a framePane; remains modal when collapsed or maximized.',
 'floatingPane': 'A nonmodal window containing a framePane.',
 'framePane': 'A border composition exposing top, bottom, left, right and center region builders.',
 'formlet': 'Responsive field layout with shared label alignment.',
 'groupBox': 'A labelled content group, optionally collapsible, with an optional Data copy command.',
 'contentPane': 'A content area or a child region/panel of a layout container.',
 'borderContainer': 'Five regions with optional splitters, drawers and nested layouts.',
 'stackContainer': 'One selected panel at a time, without a tab strip.',
 'tabContainer': 'Selected panels with shaped or underlined tabs on any side.',
 'tree': 'Hierarchical Bag presentation with selection, disclosure and declared drag behavior.',
 'codeMirror': 'Code/text editor with composed language and editor options.',
 'htmlEditor': 'Rich HTML editing using the supported engine configuration.',
 'htmlPreview': 'Read-only HTML preview with the component sanitization contract.',
 'markdownEditor': 'Markdown editing with the supported editor modes.',
 'markdownPreview': 'Rendered Markdown preview.',
 'typstPreview': 'Typst document preview and optional client PDF compilation; compiler resources are separate from ordinary forms.',
}
DETAILS = {
 'inputs': ('105-components.md#gc-105-040', 'Field behavior, typed values, choices and validation'),
 'buttons': ('350-menus-toolbars-and-windows.md', 'Commands, hierarchy and toolbar layout'),
 'layout': ('105-components.md#gc-105-085', 'Forms, borders, panels and tabs'),
 'tree': ('105-components.md#gc-105-120', 'Tree stores, labels and selection'),
 'editors': ('105-components.md#gc-105-125', 'Editor composition and document behavior'),
 'typst': ('105-components.md#gc-105-145', 'Typst compiler and resource ownership'),
}

def cell(value):
    return str(value).replace('|', '&#124;').replace('\n', ' ')

def literal(value):
    if value is None: return 'None'
    if value is True: return 'True'
    if value is False: return 'False'
    return repr(value)

def type_name(spec):
    value = spec.get('dtype')
    if value is None:
        a = spec['annotation']
        value = a.get('name', json.dumps(a, sort_keys=True))
    if isinstance(value, list): value = ' / '.join(value)
    return str(value) + (' or None' if spec.get('nullable') else '')

def render():
    docs = [(name, json.loads((ROOT / f'src/gramlot/collections/{name}.json').read_text())) for name in COLLECTIONS]
    count = sum(len(doc['elements']) for _, doc in docs)
    out = [f"""# Widget and parameter reference

Document ID: **GC-345**.

This reference covers all **{count} component declarations** in the six packaged
component grammars in this checkout. It is regenerated from their effective
metadata, including inherited parameters. It describes the development checkout;
consult the installed package before relying on a feature in a released application.
It does not assign a maturity level or imply that every component is production-ready.

<a id="gc-345-005"></a>
## 005 · How to read this reference

- `T`: text; `B`: Boolean; `L`: integer; `R`: real number; other codes are TYTX types.
- **read**: a reactive parameter; `^path` updates the presentation from Data.
- **twoWay**: the component also writes accepted edits/state back through the binding.
- **—**: no binding/default declared in component metadata. This is not a claim that
  the surrounding Source binding system has no behavior for the attribute.
- **None** is a declared nullable/default value, not the text `"None"`.
- **Allowed** lists only enumerations explicitly present in metadata. Extra semantic
  validation is explained in the linked family guide and enforced by the runtime.

Ordinary Source attributes (such as `id`, `class_`, `hidden`, `datapath`, `color`,
`padding`, `width`, `height`, event declarations and bindings) are described in
[Writing pages](095-writing-pages.md) and [Themes and CSS](096-themes-and-css.md).
The tables below list component parameters, not an exhaustive HTML/CSS whitelist.
A parent's region/panel attributes belong to that parent; they are shown separately.
Dynamic families such as `lbl_*`, `box_*`, `validate_*`, `resolver_*` and
`condition_*` have additional contracts in the narrative guides.

<a id="gc-345-010"></a>
## 010 · Select the right collection

```python
from gramlot import Page as GramlotPage
from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout

class Page(GramlotPage):
    gramlots = [inputs, layout]

    def main(self, root):
        root.dataSetter("customer.name", "Ada")
        root.textbox(value="^customer.name", lbl="Customer", live=True)
```

Buttons, menu, menuline and spacer belong to the built-in `buttons` grammar.
The other families have prepared descriptors at `gramlot.collections.<name>`.
The base HTML/SVG grammar remains available. `dialog` is the window component;
`html_dialog` explicitly requests the browser's HTML tag.

[Collection loading, generation and overrides](340-components-and-collections-guide.md)
explains the complete package lifecycle. [Examples and visual tour](355-examples-and-visual-tour.md)
connects these controls to runnable lessons and screenshots.

| Collection | Components |
| --- | --- |"""]
    for name,doc in docs:
        links=', '.join(f'[{key}](#gc-345-{key.lower()})' for key in doc['elements'])
        out.append(f'| `{name}` | {links} |')
    anchors=['gc-345-005','gc-345-010']
    block=10
    for name,doc in docs:
        for key,element in doc['elements'].items():
            block+=5
            anchor=f'gc-345-{key.lower()}'; anchors.append(anchor)
            stable=f'gc-345-{block:03d}'
            meta=element['_meta']['gramlot_component']
            guide,caption=DETAILS[name]
            if key in ('dialog','floatingPane','framePane'):guide,caption='350-menus-toolbars-and-windows.md','Window and frame composition'
            out += [f'\n<a id="{stable}"></a>\n<a id="{anchor}"></a>\n## `{key}`\n', DESCRIPTIONS[key],f'\nCollection: **{name}**. Browser element: `{element["_meta"]["render_tag"]}`.\n',f'[{caption}]({guide}).\n', '| Parameter | Type | Default | Binding | Allowed |','| --- | --- | --- | --- | --- |']
            for param,spec in meta['parameters'].items():
                default=literal(spec['default']) if 'default' in spec else '—'
                allowed=', '.join(literal(v) for v in spec.get('enum',[])) or '—'
                out.append(f'| `{param}` | {cell(type_name(spec))} | {cell(default)} | {spec.get("binding","—")} | {cell(allowed)} |')
            if not meta['parameters']:out.append('| No component-specific parameters | — | — | — | — |')
            children=element.get('sub_tags')
            if children:out.append(f'\nChild grammar: `{cell(children)}`. This is a grammar expression, not a list of browser tags.')
            if meta.get('childParameters'):
                out += ['\nParameters projected by this parent from its children:', '| Child parameter | Contract |','| --- | --- |']
                for param,spec in meta['childParameters'].items():out.append(f'| `{param}` | {cell(json.dumps(spec,sort_keys=True)) if spec else "Declared by parent"} |')
            if meta.get('presentationDefaults'):out.append('\nInherited presentation defaults: '+', '.join(f'`{v}`' for v in meta['presentationDefaults'])+'.')
    brief=['# Widget and parameter reference\n\nDocument ID: **GC-345**.\n\nCompact index of the effective component metadata. The full counterpart contains\nevery declared parameter, type, default, binding and child contract. It covers this\ndevelopment checkout and does not assign maturity or release acceptance.\n']
    for anchor in anchors[:2]:brief.append(f'<a id="{anchor}"></a>\n')
    brief.append('Ordinary Source/CSS attributes and dynamic prefixes are separate from component\nmetadata. Page.gramlots selects prepared descriptors; buttons are built in.\n')
    block=10
    for name,doc in docs:
        for key in doc['elements']:
            block+=5
            brief.append(f'\n<a id="gc-345-{block:03d}"></a>\n<a id="gc-345-{key.lower()}"></a>\n## {key}\n\nCollection: {name}. {DESCRIPTIONS[key]}\n')
    return '\n'.join(out)+'\n','\n'.join(brief)+'\n'

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--check',action='store_true');args=parser.parse_args()
    for view,text in zip(('docs','docs_llm'),render()):
        path=ROOT/view/'public/345-widget-reference.md'
        if args.check:
            if not path.exists() or path.read_text()!=text:raise SystemExit(f'Stale widget reference: {path}')
        else:path.write_text(text)
    print('Widget reference matches all six packaged component grammars.')

if __name__=='__main__':main()
