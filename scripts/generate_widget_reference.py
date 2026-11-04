"""Render the public widget reference from packaged component metadata."""
import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COLLECTIONS = ('inputs', 'buttons', 'layout', 'tree', 'editors', 'typst', 'uploads', 'grid', 'chat', 'grouplets')
from widget_reference_content import COLLECTION_GUIDES
from widget_manual_content import COLLECTION_EXPLANATIONS
from widget_coverage import COVERAGE, behavior_sections, coverage_documents

COLLECTION_IDS = {
    'inputs': 410, 'buttons': 415, 'layout': 420, 'tree': 425, 'editors': 430,
    'typst': 435, 'uploads': 440, 'grid': 445, 'chat': 450, 'grouplets': 455,
}

# Human explanations complement the executable parameter contract.
DESCRIPTIONS = {
 'grid': 'Virtualized Bag rows with a declarative column structure; database access belongs to the store/provider.',
 'searchBox': 'Search control connected to the enclosing grid Source context.',
 'chatMessages': 'Scrollable live Source message viewport; ChatPane composes the conversation interface around it.',
 'grouplet': 'Reusable Source fragment loaded through the existing remote binding.',
 'groupletCard': 'A titled, foldable remote-content card with bound controls and an optional Markdown guide.',
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
 'dbSelect': 'Remote choices through an application method or the configured Asqueel integration; the component itself supplies no database adapter.',
 'dbComboBox': 'Remote suggestions with free text; the application owns authorization and persistence.',
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
 'trayPane': 'Data-owned arrangement of labelled live cards with selection, movement, resize, layers, rotation, zoom and snapping.',
 'transformPane': 'Tracks translation, rotation and scale gestures; child Source bindings own the visual transform. Gestures write simple reactive pointers despite read-only binding metadata; onEnd reports final values.',
 'framePane': 'A border composition exposing top, bottom, left, right and center region builders.',
 'formlet': 'Responsive field layout with shared label alignment.',
 'groupBox': 'A labelled content group with an optional scoped Data copy command.',
 'contentPane': 'A content area or a child region/panel of a layout container.',
 'borderContainer': 'Five regions with optional splitters, drawers and nested layouts.',
 'stackContainer': 'One selected panel at a time, without a tab strip.',
 'tabContainer': 'Selected panels with shaped or underlined tabs on any side.',
 'tree': 'Hierarchical Bag presentation with selection, disclosure and declared drag behavior.',
 'editingStatus': 'Changes and validation feedback from the nearest Source form state.',
 'rowActions': 'Shared contextual row actions for the tree presentation.',
 'attachmentManager': 'Reusable attachment queue and list backed by application operations.',
 'imageUploader': 'Editable image value with local crop or an application-owned upload destination.',
 'uploader': 'Shared file queue with progress, preview, selected-file metadata and application-owned upload targets.',
 'codeMirror': 'Code/text editor with composed language and editor options.',
 'htmlEditor': 'Rich HTML editing using the supported engine configuration.',
 'htmlPreview': 'Read-only HTML preview with the component sanitization contract.',
 'markdownEditor': 'Markdown editing with the supported editor modes.',
 'markdownPreview': 'Rendered Markdown preview.',
 'typstPreview': 'Typst document preview with client SVG and PDF compilation; compiler resources are separate from ordinary forms.',
}
DETAILS = {
 'grid': ('445-grid.md#gc-445-start', 'Bag rows, column structure and selection stores'),
 'chat': ('450-chat.md#gc-450-start', 'ChatPane composition and server responsibilities'),
 'grouplets': ('455-grouplets.md#gc-455-start', 'Reusable remote fragments and cards'),
 'inputs': ('105-components.md#gc-105-040', 'Field behavior, typed values, choices and validation'),
 'buttons': ('350-menus-toolbars-and-windows.md', 'Commands, hierarchy and toolbar layout'),
 'layout': ('105-components.md#gc-105-085', 'Forms, borders, panels and tabs'),
 'tree': ('105-components.md#gc-105-120', 'Tree stores, labels and selection'),
 'uploads': ('105-components.md#gc-105-uploader', 'File uploads and metadata'),
 'editors': ('105-components.md#gc-105-125', 'Editor composition and document behavior'),
 'typst': ('105-components.md#gc-105-145', 'Typst compiler and resource ownership'),
}

def cell(value):
    return str(value).replace('|', '&#124;').replace('\n', ' ')

def grammar_expression(value):
    return "''" if value == '' else cell(value)

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

FAMILIES = {
    'Grids and search': ('grid', 'searchBox'),
    'Conversations': ('chatMessages',),
    'Reusable fragments': ('grouplet', 'groupletCard'),
    'Text fields': ('textbox', 'passwordbox', 'textBoxArea'),
    'Choices and selectors': ('checkbox', 'radioButton', 'radioButtonText', 'checkBoxText',
                              'colorpicker', 'filteringSelect', 'callbackSelect', 'comboBox', 'dbSelect', 'dbComboBox'),
    'Numbers, dates and time': ('numberTextBox', 'horizontalSlider', 'verticalSlider',
                              'dateTextBox', 'dateCalendar', 'timeTextBox'),
    'Buttons, menus and toolbars': ('button', 'toggleButton', 'dropDownButton', 'menu', 'menuline', 'spacer'),
    'Forms and containers': ('editingStatus', 'formlet', 'groupBox', 'contentPane', 'borderContainer', 'framePane', 'stackContainer', 'tabContainer', 'trayPane', 'transformPane'),
    'Dialogs and floating windows': ('dialog', 'floatingPane'),
    'Trees': ('tree', 'rowActions'),
    'File uploads': ('uploader', 'imageUploader', 'attachmentManager'),
    'Editors and document previews': ('codeMirror', 'htmlEditor', 'htmlPreview', 'markdownEditor', 'markdownPreview', 'typstPreview'),
}
SHARED = {
    'value': ('Values and bindings', 'The value type and writeback behavior depend on the control. '
              'Use a Data pointer for binding; see [Data binding](097-data-binding.md).'),
    'state': ('Disabled, readonly and live updates', 'Disabled prevents interaction; readonly preserves reading '
              'without accepting edits. live controls when edits reach Data. See [Field behavior](105-components.md#gc-105-040).'),
    'labels': ('Labels and field presentation', 'lbl supplies a field label; lbl_position places it. '
               'The lbl_* and box_* style families are described in [Themes and CSS](096-themes-and-css.md).'),
    'placeholder': ('Placeholders', 'Placeholder text is a hint, not a value or a replacement for a field label.'),
    'validation': ('Validation', 'The validate_* family belongs to the shared validation contract, not to each widget. '
                   'See [Validation rules, callbacks and messages](105-components.md#gc-105-076). '
                   'Rule conditions and messages use the documented _if, _iswarning, _error and _warning suffixes. '
                   'For example: root.textbox(value="^customer.email", lbl="Email", validate_email=True).'),
    'icons': ('Icons and label presentation', 'icon holds text or an emoji; iconSrc loads an image such as SVG. '
              'iconSize sizes the icon; labelPosition controls label presentation on menus and toolbars. '
              'See [Menus and toolbars](350-menus-toolbars-and-windows.md).'),
    'formatting': ('Locale and formatting', 'Data retains its typed value; locale and format affect presentation '
                   'and parsing. workdate supplies date-editing context. See [Typed controls](105-components.md#gc-105-040).'),
    'windows': ('Window behavior and geometry', 'Dialog and floatingPane share controls, geometry and state. '
                'Their movement, resize and collapse defaults differ as shown below. Dialog remains modal, '
                'including when collapsed or maximized. See [Windows](350-menus-toolbars-and-windows.md).'),
    'regions': ('Border and frame regions', 'BorderContainer and framePane share region arrangement and persistence. '
                'Child region parameters stay with each parent below. See [Containers](105-components.md#gc-105-085).'),
    'selection': ('Panel selection', 'StackContainer and tabContainer select one child panel; selectedPage uses '
                  'its page name and selected its index. See [Containers](105-components.md#gc-105-085).'),
}


def shared_group(widget, parameter):
    if parameter.startswith('validate_'): return 'validation'
    if parameter == 'value': return 'value'
    if parameter in ('disabled', 'readonly', 'live'): return 'state'
    if parameter in ('lbl', 'lbl_position'): return 'labels'
    if parameter == 'placeholder': return 'placeholder'
    if parameter in ('icon', 'iconSrc', 'iconSize', 'labelPosition'): return 'icons'
    if parameter in ('locale', 'format', 'workdate'): return 'formatting'
    if widget in ('dialog', 'floatingPane'): return 'windows'
    if widget in ('borderContainer', 'framePane') and parameter in ('design', 'persist'): return 'regions'
    if widget in ('stackContainer', 'tabContainer') and parameter in ('selectedPage', 'selected'): return 'selection'
    return None


def parameter_cells(parameter, spec):
    default = literal(spec['default']) if 'default' in spec else '—'
    constraints = []
    if 'enum' in spec:
        constraints.append('enum=' + repr(spec['enum']))
    constraints.extend(f'{key}={json.dumps(value, sort_keys=True)}'
                       for key, value in spec.items()
                       if key not in ('dtype', 'nullable', 'binding', 'default', 'enum'))
    allowed = '; '.join(constraints) or '—'
    return f'`{parameter}` | {cell(type_name(spec))} | {cell(default)} | {spec.get("binding", "—")} | {cell(allowed)}'


def compact_table(rows, *, scoped=False):
    """Factor identical contracts without abbreviating or discarding their fields."""
    contracts = {}
    for parameter, spec, scope in rows:
        key = (json.dumps(spec, separators=(',', ':'), sort_keys=True), tuple(scope))
        contracts.setdefault(key, []).append(parameter)
    result = ['\n| Parameters | Contract |' + (' Applies to |' if scoped else ''),
              '| --- | --- |' + (' --- |' if scoped else '')]
    for (contract, scope), parameters in contracts.items():
        row = f'| `{", ".join(parameters)}` | `{cell(contract)}` |'
        result.append(row + (' ' + ', '.join(scope) + ' |' if scoped else ''))
    return result


def widget_links(widgets):
    return ', '.join(f'[{key}](#gc-345-{key.lower()})' for key in widgets)


def render(collections=COLLECTIONS, document_id=345):
    docs = [(name, json.loads((ROOT / f'src/gramlot/collections/{name}.json').read_text())) for name in collections]
    entries = {key: (name, element) for name, doc in docs for key, element in doc['elements'].items()
               if element.get('_meta', {}).get('gramlot_component') is not None}
    count = len(entries)
    out = [f"""# Widget and parameter reference

Document ID: **GC-345**.

This reference covers all **{count} component declarations** in the {len(collections)} packaged
component collections covered here. It is regenerated from their effective
metadata. Widgets are grouped by purpose; inherited and shared parameters are
documented once and linked from each applicable widget. Use the manual matching your installed packages when comparing available features.
It does not assign a maturity level or imply that every component is production-ready.

<a id="gc-345-005"></a>
## 005 · How to read this reference

- `T`: text; `B`: Boolean; `L`: integer; `R`: real number; other codes are TYTX types.
- **read**: a reactive parameter; `^path` updates the presentation from Data.
- **write**: the component publishes state through the bound path.
- **twoWay**: the component also writes accepted edits/state back through the binding.
- **—**: no binding/default declared in component metadata. This is not a claim that
  the surrounding Source binding system has no behavior for the attribute.
- **None** is a declared nullable/default value, not the text `"None"`.
- **Constraints** preserves enumerations, qualifications and annotation restrictions declared in metadata. Extra semantic
  validation is explained in the linked family guide and enforced by the runtime.

Ordinary Source attributes (such as `id`, `class_`, `hidden`, `datapath`, `color`,
`padding`, `width`, `height`, event declarations and bindings) are described in
[Writing pages](095-writing-pages.md) and [Themes and CSS](096-themes-and-css.md).
The tables below list component parameters, not an exhaustive HTML/CSS whitelist.
A parent's region/panel attributes belong to that parent; they are shown separately.
Dynamic families such as `lbl_*`, `box_*`, `validate_*`, `resolver_*` and
`condition_*` have additional contracts in the narrative guides.

<a id="gc-345-010"></a>
## 010 · Use the environment collections

Declare collections once on your environment's Page base. Pages inherit its
grammars and browser descriptors. `Page.gramlots` adds collections missing from
that environment; merely installing a package does not activate it.

The following is environment setup, not boilerplate to repeat in every lesson:

[Collection setup code](465-widget-examples.md#gc-465-environment) is in the appendix.

Buttons, menu, menuline and spacer belong to the built-in `buttons` grammar.
The other families have prepared descriptors at `gramlot.collections.<name>`.
The base HTML/SVG grammar remains available. `dialog` is the window component;
`html_dialog` explicitly requests the browser's HTML tag.

[Collection loading, generation and overrides](340-components-and-collections-guide.md)
explains the complete package lifecycle. [Examples and visual tour](355-examples-and-visual-tour.md)
connects these controls to runnable lessons and screenshots.

| Collection | Components |
| --- | --- |"""]
    # Numeric block IDs were allocated in collection order before the purpose-based grouping.
    stable = {'textbox': 'gc-345-015', 'passwordbox': 'gc-345-035', 'textBoxArea': 'gc-345-030', 'checkbox': 'gc-345-020', 'radioButton': 'gc-345-040', 'radioButtonText': 'gc-345-025', 'checkBoxText': 'gc-345-100', 'colorpicker': 'gc-345-045', 'filteringSelect': 'gc-345-075', 'callbackSelect': 'gc-345-080', 'comboBox': 'gc-345-085', 'dbSelect': 'gc-345-090', 'dbComboBox': 'gc-345-095', 'numberTextBox': 'gc-345-060', 'horizontalSlider': 'gc-345-050', 'verticalSlider': 'gc-345-055', 'dateTextBox': 'gc-345-065', 'dateCalendar': 'gc-345-105', 'timeTextBox': 'gc-345-070', 'button': 'gc-345-110', 'toggleButton': 'gc-345-115', 'dropDownButton': 'gc-345-120', 'menu': 'gc-345-125', 'menuline': 'gc-345-130', 'spacer': 'gc-345-135', 'formlet': 'gc-345-155', 'groupBox': 'gc-345-160', 'contentPane': 'gc-345-165', 'borderContainer': 'gc-345-170', 'framePane': 'gc-345-150', 'stackContainer': 'gc-345-175', 'tabContainer': 'gc-345-180', 'dialog': 'gc-345-140', 'floatingPane': 'gc-345-145', 'tree': 'gc-345-185', 'codeMirror': 'gc-345-190', 'htmlEditor': 'gc-345-195', 'htmlPreview': 'gc-345-200', 'markdownEditor': 'gc-345-205', 'markdownPreview': 'gc-345-210', 'typstPreview': 'gc-345-215', 'trayPane': 'gc-345-405', 'transformPane': 'gc-345-410', 'uploader': 'gc-345-340', 'imageUploader': 'gc-345-345', 'attachmentManager': 'gc-345-350', 'editingStatus': 'gc-345-355', 'rowActions': 'gc-345-360'}
    stable.update(grid='gc-345-365', searchBox='gc-345-370', chatMessages='gc-345-375',
                  grouplet='gc-345-380', groupletCard='gc-345-385')
    if not set(entries) <= set(stable):
        raise ValueError('Allocate a stable documentation ID for every new component')
    families = {family: tuple(key for key in widgets if key in entries)
                for family, widgets in FAMILIES.items()}
    families = {family: widgets for family, widgets in families.items() if widgets}
    grouped = [key for widgets in families.values() for key in widgets]
    if len(grouped) != len(entries) or set(grouped) != set(entries):
        raise ValueError('Every component must occur in exactly one purpose family')
    for name, doc in docs:
        number = COLLECTION_IDS[name]
        keys = [key for key, (collection, _) in entries.items() if collection == name]
        out.append(f'| [{name}]({number}-{name}.md) | {widget_links(keys)} |')
    brief = ['# Widget and parameter reference\n\nDocument ID: **GC-345**.\n\n'
             'Grouped by purpose; shared parameters are documented once. The full counterpart\n'
             'and this compact view both preserve types, defaults, bindings and child contracts.\n'
             'Development reference; no maturity or release acceptance is implied.\n',
             '<a id="gc-345-005"></a>\n<a id="gc-345-010"></a>\n',
             'Ordinary Source/CSS attributes remain in Writing pages and Themes and CSS.\n'
             'Pages inherit environment collections; Page.gramlots adds missing ones. Buttons are built in.\n'
             'Contract JSON omits only undeclared keys: no default is not the same as null. '
             'dtype: T text, B Boolean, L integer, R real, X structured value; remaining codes are TYTX. '
             'binding: read = Data to widget, write = widget to Data, twoWay = both. '
             'nullable permits None; enum restricts values; annotation preserves type/regex constraints. '
             'Parameters sharing a table row have exactly the same contract. Child grammar: * allows '
             'arbitrary Source children; empty permits none. Parent None means no declared restriction.\n']
    out.append('\n## Shared parameter contracts\n\nEach widget below links only the shared contracts it supports. '
               'A shared name can have different types, defaults or bindings; separate rows preserve those differences.\n')
    for index, (group, (title, explanation)) in enumerate(SHARED.items()):
        rows = {}
        scope = []
        for widget, (_, element) in entries.items():
            for parameter, spec in element['_meta']['gramlot_component']['parameters'].items():
                if shared_group(widget, parameter) != group: continue
                if widget not in scope: scope.append(widget)
                identity = (parameter, json.dumps(spec, sort_keys=True))
                if identity not in rows: rows[identity] = (spec, [])
                rows[identity][1].append(widget)
        if not rows:
            continue
        heading = f'\n<a id="gc-345-{220 + index * 5:03d}"></a>\n<a id="gc-345-shared-{group}"></a>\n## {title}\n'
        out += [heading, explanation, '\nApplies to: ' + widget_links(scope) + '.\n',
                '| Parameter | Type | Default | Binding | Constraints | Applies to |',
                '| --- | --- | --- | --- | --- | --- |']
        for (parameter, _), (spec, widgets) in rows.items():
            applies = 'All listed above' if widgets == scope else widget_links(widgets)
            out.append(f'| {parameter_cells(parameter, spec)} | {applies} |')
        brief += [heading, explanation]
        brief += compact_table(((parameter, spec, widgets) for (parameter, _), (spec, widgets) in rows.items()), scoped=True)
    family_ids = {
        'Grids and search': 430, 'Conversations': 435, 'Reusable fragments': 440,
        'Text fields': 300, 'Choices and selectors': 305, 'Numbers, dates and time': 310,
        'Buttons, menus and toolbars': 315, 'Forms and containers': 320,
        'Dialogs and floating windows': 325, 'Trees': 330, 'File uploads': 335,
        'Editors and document previews': 425,
    }
    for family, widgets in families.items():
        heading = f'\n<a id="gc-345-{family_ids[family]:03d}"></a>\n## {family}\n'
        out.append(heading)
        brief.append(heading)
        for key in widgets:
            name, element = entries[key]
            meta = element['_meta']['gramlot_component']
            guide, caption = DETAILS[name]
            if key == 'trayPane':
                guide, caption = '105-components.md#gc-105-970', 'Tray workspaces and shared Labelboxes'
            if key in ('dialog', 'floatingPane', 'framePane'):
                guide, caption = '350-menus-toolbars-and-windows.md', 'Window and frame composition'
            heading = f'\n<a id="{stable[key]}"></a>\n<a id="gc-345-{key.lower()}"></a>\n### `{key}`\n'
            out += [heading, DESCRIPTIONS[key],
                    f'\nCollection: **{name}**. Browser element: `{element["_meta"]["render_tag"]}`.\n',
                    f'[{caption}]({guide}).\n']
            brief += [heading, f'Collection: {name}. {DESCRIPTIONS[key]}\n']
            evidence = f"\n[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-{key.lower()}).\n"
            out.append(evidence)
            brief.append(evidence)
            out.extend(behavior_sections(key))
            brief.extend(behavior_sections(key))
            groups = {shared_group(key, parameter) for parameter in meta['parameters']} - {None}
            if groups:
                links = ', '.join(f'[{title}](#gc-345-shared-{group})' for group, (title, _) in SHARED.items() if group in groups)
                out.append('Shared contracts: ' + links + '.\n')
                brief.append('Shared contracts: ' + links + '.\n')
            specific = {parameter: spec for parameter, spec in meta['parameters'].items()
                        if shared_group(key, parameter) is None}
            if specific:
                out += ['| Specific parameter | Type | Default | Binding | Constraints |', '| --- | --- | --- | --- | --- |']
                out += [f'| {parameter_cells(parameter, spec)} |' for parameter, spec in specific.items()]
                brief += compact_table((parameter, spec, ()) for parameter, spec in specific.items())
            else:
                out.append('No additional component-specific parameters. Use the shared contracts above '
                           'and ordinary Source/CSS attributes.\n')
                brief.append('No additional component-specific parameters.\n')
            contract = [f'\nChild grammar: `{grammar_expression(element.get("sub_tags"))}`; '
                        f'parent grammar: `{grammar_expression(element.get("parent_tags"))}`. '
                        '`*` permits arbitrary Source children; an empty expression permits none; '
                        '`None` means no parent restriction declared.']
            if meta.get('childParameters'):
                contract += ['\nParameters projected by this parent from its children:',
                             '| Child parameter | Contract |', '| --- | --- |']
                for parameter, spec in meta['childParameters'].items():
                    contract.append(f'| `{parameter}` | `{cell(json.dumps(spec, sort_keys=True))}` |')
            out.extend(contract)
            brief.append(f'\nChild grammar: `{grammar_expression(element.get("sub_tags"))}`; '
                         f'parent grammar: `{grammar_expression(element.get("parent_tags"))}`.')
            if meta.get('childParameters'):
                brief.append('\nChild parameters projected by the parent:')
                brief += compact_table((parameter, spec, ()) for parameter, spec in meta['childParameters'].items())
    if 'grid' in collections:
        out.extend(structural_reference(dict(docs)['grid']))
        brief.extend(structural_reference(dict(docs)['grid'], compact=True))
    if len(collections) == 1:
        name = collections[0]
        title, introduction, example, notes = COLLECTION_GUIDES[name]
        selection = '\n'.join(
            f'- [`{key}`](#gc-{document_id}-{key.lower()}): {DESCRIPTIONS[key]}'
            for key, (owner, _) in entries.items() if owner == name
        )
        manual_notes = re.sub(r'```[^\n]*\n.*?```',
                              f'[See the setup code in the appendix](465-widget-examples.md#gc-465-setup-{name}).',
                              notes, flags=re.S)
        header = (f'# {title}\n\nDocument ID: **GC-{document_id}**.\n\n'
                  f'<a id="gc-{document_id}-start"></a>\n## Start here\n\n{introduction}\n\n'
                  'The environment Page base supplies the collections used below. '
                  '[Configure them once](340-components-and-collections-guide.md#gc-340-050). '
                  f'[Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-{name}).\n\n'
                  f'{manual_notes}\n\n'
                  '[All collections](345-widget-reference.md) · '
                  '[Shared labels and validation](105-components.md#gc-105-020) · '
                  '[Bindings](097-data-binding.md)\n\n')
        explanation = re.sub(r'```[^\n]*\n.*?```',
                             f'[Code for this composition is in the appendix](465-widget-examples.md#gc-465-setup-{name}).',
                             COLLECTION_EXPLANATIONS[name].strip(), flags=re.S)
        detailed_header = (header + f'{explanation}\n\n'
                           f'## Choose a component\n\n{selection}\n\n')
        # The component/parameter bodies remain generated, never maintained separately.
        out = [detailed_header, '<a id="gc-345-005"></a>\n<a id="gc-345-010"></a>\n'
               'Types: T text, B Boolean, L integer, R real, X structured value; other codes are TYTX. '
               'Binding: read = Data to widget; write = widget to Data; twoWay = both. '
               'A dash means no declared default/binding. None is a declared value. '
               'Constraints include enum, qualification, target and annotations. '
               'Tables describe component contracts; ordinary Source/CSS attributes are shared.\n',
               *out[1 + len(docs):]]
        brief = [header, *brief[1:]]
    return tuple(('\n'.join(view) + '\n').replace('gc-345-', f'gc-{document_id}-')
                 for view in (out, brief))


def annotation_type(annotation):
    kind = annotation['kind']
    if kind == 'dtype':
        return annotation['dtype']
    if kind == 'type':
        return annotation['name']
    if kind == 'union':
        return ' / '.join(annotation_type(item) for item in annotation['items'])
    return json.dumps(annotation, separators=(',', ':'))


def structural_reference(grammar, *, compact=False):
    result = ['\n<a id="gc-345-390"></a>\n## Grid structure declarations\n',
              'These are Source declarations, not additional browser components. '
              'Parameters below are the complete Python authoring signature; annotations '
              'retain regex restrictions. A missing default denotes a required argument.']
    for name, element in grammar['elements'].items():
        if element.get('_meta', {}).get('gramlot_component') is not None:
            continue
        signature = element['attributes']
        result += [f'\n### `{name}`\n',
                   f'Children: `{grammar_expression(element.get("sub_tags"))}`. Parents: `{grammar_expression(element.get("parent_tags"))}`.\n']
        result.extend(behavior_sections(name))
        if compact:
            result.append(f'```json\n{json.dumps(signature, separators=(",", ":"))}\n```')
            continue
        result.append(f'Additional positional arguments: `{signature["accepts_var_positional"]}`; '
                      f'additional keyword arguments: `{signature["accepts_var_keyword"]}`.\n')
        if not signature['parameters']:
            result.append('No parameters.\n')
            continue
        result += ['| Parameter | Passing | Type | Default | Constraints |', '| --- | --- | --- | --- | --- |']
        for parameter in signature['parameters']:
            annotation = parameter['annotation']
            base = annotation['base'] if annotation['kind'] == 'annotated' else annotation
            dtype = annotation_type(base)
            constraints = json.dumps(annotation.get('metadata', []), separators=(',', ':'))
            default = literal(parameter['default']) if parameter['has_default'] else '**required**'
            result.append(f'| `{parameter["name"]}` | {parameter["kind"]} | {cell(dtype)} | '
                          f'{cell(default)} | {cell(constraints)} |')
    return result


def generated_documents():
    for view, text in zip(('docs', 'docs_llm'), render()):
        yield ROOT / view / 'public/345-widget-reference.md', text
    yield from coverage_documents(ROOT, COLLECTIONS, COLLECTION_IDS, COLLECTION_GUIDES)
    for collection in COLLECTIONS:
        number = COLLECTION_IDS[collection]
        for view, text in zip(('docs', 'docs_llm'), render((collection,), number)):
            yield ROOT / view / f'public/{number}-{collection}.md', text

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    for path, text in generated_documents():
        if args.check:
            if not path.exists() or path.read_text() != text:
                raise SystemExit(f'Stale widget reference: {path}')
        else:
            path.write_text(text)
    print('Widget and collection references match all ten packaged component grammars.')


if __name__ == '__main__':
    main()
