# 340 · How components and collections work

**Page-authoring rule:** GramlotServer automatically provides every packaged
standard collection to every site's Page base, in Python and JavaScript. Do not
import `gramlot.collections.*` or repeat `gramlots = [...]` for these collections.
Write component declarations directly. Explicit imports and collection declarations
are for custom additions. A missing standard component is a server/package defect,
not a reason for a one-off page import. The packaged inventory drives grammar and
bootstrap resources; it does not scan installed packages. External engines load on
first use in hosted pages. File exports embed the required resource bytes.

Document ID: **GC-340**.

[Full guide](../../docs/public/340-components-and-collections-guide.md).

Development-checkout teaching guide, not a new API or a publication/stability
claim. Prepared collections and menu integration include provisional work. The
full guide contains executable component, collection, Python and override examples.

<a id="gc-340-005"></a>
## 005 · Three different objects

A JS definition describes a component. A Builder call creates one typed Source
occurrence. The browser instantiates the selected component and binds it to Data.
There is no Python widget class per call. Collections package definitions,
dependencies, CSS, assets and optional command registrations.

<a id="gc-340-010"></a>
## 010 · Preparation and execution

Preparation imports DOM-free JS definitions, exports grammar, bundles resources
and writes an importable Python package. Execution selects its descriptor, loads
grammar/resources and realizes Source in the browser. Collection developers need
Node and the generator; consumers of prepared Python packages do not.

<a id="gc-340-015"></a>
## 015 · Builder, grammar, Source and Data

Grammar validates names, parameters and structure. Source describes occurrences
and behavior; Data holds state; not every Source node creates DOM. Setters leave
Source after writing Data; controllers remain for later events. `^` subscribes,
`=` reads without subscribing. A plain reactive value pointer supports writeback.
Component values reject presentation transforms. Defaults need not appear in
Source; component parameter projection supplies omitted defaults.

<a id="gc-340-020"></a>
## 020 · Definition

`defineComponent` contains `name`, `tag`, `base`, ordered `mixins`, `parameters`,
`implementation` and optional `subTags`. It returns a descriptor, not a class.
Authoring names are case-insensitive; collection names do not namespace them.
Tags identify browser custom elements. Advanced family flags require the owning
runtime contract. Source children and private component DOM are distinct;
`subTags` authorizes children but does not implement slots or layout.

<a id="gc-340-025"></a>
## 025 · Parameters

`dtype`, `nullable`, `binding`, `default` and qualifications export the portable
contract. `NativeControl` projects `target: 'control'` to control properties.
`childParameter: true` offers the value, or the default when the Source omits it,
to a parent child parameter of the same name; the child keeps it (a tile
`aspectRatio` for trayPane).
`intl_str` is metadata, not translation. Arbitrary metadata does not implement
validation. Open extra attributes do not guarantee typo detection. The recorded
Python nested-regex union limitation remains; no permissive input contract follows.

<a id="gc-340-030"></a>
## 030 · Composition

Classes compose base → mixins in order → implementation. Metadata starts with
base parameters; conflicting mixin parameters fail; explicit concrete parameters
replace full inherited specifications. Method overrides must preserve required
`super` projection and cleanup. Public primitives are `NativeControl`,
`ChoiceGroup`, `Labelbox`, `FieldState`; internal helpers are not automatically
public APIs. FieldState alone does not add the full validation engine.

<a id="gc-340-035"></a>
## 035 · Complete component

The full guide defines `searchbox`/`acme-searchbox` with a text input, nullable text
value, placeholder, Labelbox and FieldState. `createControl`, `readControlValue`
and `writeControlValue` bridge the shared adapter. Equal-value writes preserve the
caret; null displays empty without writing Data. Existing change/live input and
composition handling apply. It edits text; it does not execute a search.

<a id="gc-340-040"></a>
## 040 · Collection and resources

`defineCollection` groups components, CSS URL objects, named asset URL objects
and `registerCommands`. Top-level CSS styles hosts/light DOM; inner shadow DOM
needs component styles or supported variables/projection. The generator bundles
CSS imports/files and relocates emitted URLs. Asset declaration does not display
an image. Command hooks run during generation and page activation: deterministic
registration only, no DOM/network/Data/business actions. Commands supply metadata
and topics, not the business handler itself.

<a id="gc-340-045"></a>
## 045 · Generation

The Python command `gramlot-builder build|check --config gramlot.build.json`
launches project-local `@gramlot/builder/cli`; generator source is in
`tools/gramlot-builder`, with Node 22/24/26. No npm publication is implied.
Configuration maps JS `entry` to `pythonPackage`, with `output` and optional
`externals`. Generated output: `__init__.py` exporting `mygramlot`, grammar,
commands, module wrapper/build ID, collection bundle, CSS and assets.

Use ordinary Python package configuration and include all generated resource
files in the wheel. Edit authored inputs, not generated files. Python verifies
staging and owns replacement/recovery. Exit 0 success/current; 1 stale check;
2 error/recovery. Preserve recovery evidence; recovery and the next requested
build can need separate invocations. POSIX locking; Windows unverified.

<a id="gc-340-050"></a>
## 050 · Python consumption

Import `mygramlot` and select it with `Page.gramlots = [mygramlot]`. Import alone
does not activate it. Selection provides grammar and bootstrap resources; base
Gramlot remains. The sample uses `searchbox(value='^.query', live=True)` and a
paragraph sharing that Data path. A raw grammar document is not a prepared Page
descriptor. Built-in prepared collections use the same selection shape.

`gramlot.getCollection(name)` returns the page's activated component collection,
or `undefined`. Optional tools can pass that object to their own Gramlot instance
and reuse the existing registrations; bootstrap retains the verified object.

<a id="gc-340-055"></a>
## 055 · Host and bootstrap

Each Python process imports candidate pages at startup, derives and verifies a
dependency-first registry, then keeps it fixed. Module imports must be safe;
rebuilds require restart. Bootstrap records are exactly `{name,url,buildId}`.
Only inventoried browser resources are exposed. Import maps precede execution;
theme, collection and page CSS have cascade order; startup awaits successful CSS
and module loading and identity checks. Then components, runtime, commands, Logic
and Source start. Fingerprints ensure consistency, not publisher authenticity.

<a id="gc-340-060"></a>
## 060 · Dependencies and external packages

Declare semantic dependency edges once in JS `dependencies`. Build configuration
maps every collection to an output `pythonPackage` or external
`{entry,pythonImport:'package:mygramlot'}`. Generated Python imports preserve the
graph. Dependencies precede consumers and shared dependencies load once; cycles,
missing mappings and identity conflicts fail. Helper imports are not collection
selection. External packages are verified/referenced, not regenerated. The host
import map supplies the selected browser artifact.

<a id="gc-340-065"></a>
## 065 · Page inheritance

Class-local `gramlots` declarations accumulate in base-to-derived MRO order;
`gramlots=[]` does not remove inherited selections. Equal descriptors coalesce;
conflicting identities with one name fail. Explicit dependency ordering should
express required override precedence.

<a id="gc-340-070"></a>
## 070 · Different meanings of override

Occurrence attributes override defaults; new descriptors specialize behavior;
later grammar entries replace whole named declarations. Neither a registered
custom-element tag nor a command/group supports last-one-wins replacement.
CSS cascading is separate and does not pierce shadow DOM.

<a id="gc-340-075"></a>
## 075 · Specialize under another name

The example `quickSearchbox` reuses the exported implementation factory and full
parameter specifications, with its own DOM tag, `live=True` default and changed
placeholder. Both names can coexist when exported. Explicit occurrence attributes
still win. A behavior override uses class factories and preserves base contracts;
it is not descriptor mutation. Prefer ordinary Source composition for page layout;
there is no general recipe API.

<a id="gc-340-080"></a>
## 080 · Replace the authoring name

The `site-ui` example depends on acme and defines `name:'searchbox'` with the
distinct tag `site-searchbox`, carrying a complete specialized descriptor. Both
Python and browser resolve acme first, then site-ui. The later grammar element
replaces the earlier one wholly; other names remain. Same-collection duplicate
names/tags fail. Different definitions cannot reuse a registered DOM tag; the
same collection object may be registered again harmlessly. No hot replacement of
mounted instances is promised: rebuild, restart and reload.

<a id="gc-340-085"></a>
## 085 · Loading is not activation

Builder `collections` adds declarations; raw grammar has no executable factory.
JS Gramlot can register supplied component collections, but does not perform the
whole prepared-page pipeline (dependency discovery, resources, CSS, command
hooks). PageBootstrap orchestrates that path. Prefer Page descriptors in Python
applications; reserve low-level construction for explicit integrations/tests.

<a id="gc-340-090"></a>
## 090 · Lifecycle

Projection consumes owned attributes and returns the rest. Value hooks delegate
writeback to the binding adapter; programmatic writes must not simulate edits.
Page context and release hooks support component work. Release observers,
listeners and asynchronous jobs, ignore stale results and preserve base cleanup.
Do not equate every DOM disconnection with Source removal or infer an unapproved
Live Object Tree model.

For component HTML sanitization, import `createDOMPurify` from
`@gramlot/gramlot`. It is the upstream DOMPurify factory shared by the runtime,
not a shared mutable sanitizer. Create a separate instance with
`createDOMPurify(this.ownerDocument.defaultView)` for the consumer, retaining its
own configuration and hooks. Prepared collections externalize the runtime import;
they should not bundle their own DOMPurify implementation. This does not replace
the component's HTML policy or enable HTML in plain-text fields.

<a id="gc-340-095"></a>
## 095 · Troubleshooting

Check selection/generation for unknown names, browser activation for inert tags,
identity collisions for registration errors, whole-declaration replacement for
lost parameters, MRO accumulation for inherited collections, graph mappings for
missing dependencies, coherent artifacts/restart for fingerprint errors, and
shadow boundaries for ineffective CSS. Do not bypass validation or load an
alternate unverified runtime to suppress an error.

<a id="gc-340-100"></a>
## 100 · Verification

Verify DOM-free metadata, generation/check, installed artifact bytes, Python Source,
runtime two-way edits/defaults/cleanup, replacement ordering/isolation, real-browser
layout/focus and wheel package data. The guide's focused checks are recorded in
GC-070; they do not qualify arbitrary extensions or all browsers.

Document each collection with its source: descriptor, dependencies, setup,
component purpose, parameters/defaults, bindings/writeback, events, children,
resources, lifecycle, limits and actual verification. Core's collection guides
combine maintained explanations with generated grammar tables. The core owns its
generator and publication list; preparing or installing a third-party collection
does not automatically publish its guide on this site. Its owner publishes and
links its own documentation.

<a id="gc-340-105"></a>
## 105 · Further reading

See GC-105 for existing components, GC-097 for binding, GC-096 for styles, GC-325
§150 for implemented preparation, GC-335 for provisional menus and GC-225 for
naming. Use the prepared-package activation path in this guide.


Standard collections (2026-11-05): GramlotServer includes the packaged inventory
for every site. Host `collections` supplies custom additions. Extra
Page.gramlots still accumulate. Both hosts cache environment Page composition and
grammar without mutating imported classes. Components' dynamic import() boundaries
produce separate verified ESM files; external engines load on first use, shared
within the document. File-origin derived bundles still embed engines eagerly.


<a id="gc-340-shared-markdown"></a>
## Optional Markdown engine

The runtime exports `loadMarkdown()`, which resolves the module exported by
`@gramlot/gramlot/markdown`. That module re-exports the markdown-it constructor:

```javascript
import {loadMarkdown} from '@gramlot/gramlot';
const {default: MarkdownIt} = await loadMarkdown();
const parser = new MarkdownIt({html: false});
const html = parser.render('# Heading');
```

The library code loads once per window, only when requested. Each consumer owns
its parser options, rules and sanitizer policy; do not mutate another consumer's
parser. The collection generator maps imports of `markdown-it`, including those
inside ProseMirror, to this shared subpath. Core Markdown previews and Grouplet
guides load their rendering module on use; an unopened guide does not request
the parser. `markdownPreview.ready` and `groupletCard.docReady` settle after their
first asynchronous load. Subsequent Data updates keep the existing content host.

The Python and JavaScript hosts map the subpath to the packaged
`gramlot-markdown.js` asset beside the runtime URL. It must be served together
with the corresponding runtime and prepared collections. The file-origin
serverless exporter embeds the library in the runtime output once, then imports
it through a local blob on first use. No CDN or network access is required.

Parsing is not sanitization: consumers allowing HTML must still sanitize the
rendered output before inserting it into the DOM. The shared engine does not
change `allowHtml`, safe URL checks, editor history or component Data semantics.


<a id="gc-340-110"></a>
## 110 · Local editing shared by forms and grids

Development preview: resident grids can use the same local editing session as
form controls. Mark a column with edit=True or provide editor options:

```python
form = root.div(form=True, datapath='record')
grid = form.grid(storepath='.rows', rowMode='values', height='320px')
struct = grid.struct()
struct.column('description', edit=True)
struct.column('quantity', dtype='L', edit=dict(validate_min=0))
form.button('Accept locally', action='validateAndAccept')
form.button('Restore', action='this.formState.restore();')
```

The form scope and rows must already contain Bags. values and attributes row
modes use the same session. Include the inputs and grid collections when using
the raw JavaScript authoring/runtime API; prepared grid collections declare the
inputs dependency through the normal collection mechanism.

The Source formState accessor owns baseline, changes, errors, pending checks
and drafts. A grid inside the form shares these registers, while a standalone
editable grid owns its scope. load(Bag) establishes local working data and its
baseline; accept() accepts a validated local snapshot; restore() restores that
snapshot. These are local operations, not database load/save or server replies.

Cell editors are ordinary Source controls. Enter confirms, Tab/Shift+Tab moves
between editable cells, and Escape discards unfinished text. Double-click or
Enter/F2 opens an editable cell. Scrolling releases editor DOM while preserving
incomplete drafts and errors in the session. Reopening restores the draft.
Typed invalid values stay in working Data; unparseable text stays in the session.
Both block acceptance. Validation belongs to the session: a check already running
continues after scrolling removes the editor. Its result updates Data and errors,
and clears pending state without reopening the cell. Reopening during a check
does not repeat the request. A new candidate, changed rules, removed/replaced row
or session reset invalidates obsolete replies.

The first tranche does not add DB writes, autosave, remote-window editing,
a configurator or undo/redo. Complete resident-cell validation is described in §125.
See [the editing contract](https://github.com/gramlot-org/gramlot/blob/main/docs/future/380-forms-and-validation-recovery.md#gc-380-065).


<a id="gc-340-115"></a>
## 115 · Editing reports and keyboard navigation

Add `form.editingStatus()` from the inputs collection inside a form scope. Its
compact Errors and Changes buttons open reports from that same session, including
both form controls and resident grid cells. Errors display the validation messages;
Changes display original → current values since the accepted snapshot. Repeated
edits update one entry, returning to the original value removes it, and local
accept/restore clears the outstanding changes. This is not a chronological audit
log or undo/redo stack. The presentation owns no copy of the editing registers.

Selecting an entry focuses its form field or reveals and opens its grid cell,
including rows outside the rendered window. A filtered-out or removed target is
reported as unavailable; navigation does not change filters. Session validation
continues while reports are open and after editor disposal.

While editing a single-line grid cell, Up/Down commits its candidate and opens the
same column in the previous/next row of the current sorted/filtered view. Invalid
drafts and errors remain in the session and do not prevent navigation. Left/Right
move the caret within text. With a collapsed selection, Left at the beginning
opens the previous editable cell (caret at its end); Right at the end opens the
next editable cell (caret at its beginning), even if that field is already filled.
Selected text and controls without a text caret keep their own keys.
Tab/Shift+Tab advances through editable cells. Textareas,
date/time fields and open choice menus retain their own vertical arrows; Down
opens a choice menu. IME composition and modified arrow keys are not intercepted.


<a id="gc-340-120"></a>
## 120 · Bounded text cells and textarea editors

Declare one limit on the column struct for display and editing:

```python
struct.column('notes', name='Notes', white_space='pre-wrap', max_height='96px',
              edit=dict(tag='textBoxArea'))
```

`max_height` accepts a nonnegative CSS length in px, em or rem. Omit it for the
existing natural-height behavior. Wrapped text uses a stable internal viewport
with automatic scrollbars; the complete value remains in the Bag. The textarea
uses the same maximum and scrolls internally when its value exceeds its visible
height. The limit also works for noneditable text columns.

The limit bounds the content box (including its padding), rather than forcing all
cells in the row to the same maximum. Another column or manual row sizing can
make the row taller, while this column's display/editor remains bounded. Opening
an editor does not grow its row; adding text uses the editor's internal scroll.
Theme padding and typography still apply. No separate editor-only max-height
setting or additional editing state is needed.


<a id="gc-340-125"></a>
## 125 · Validate every declared cell before acceptance

The development editing session validates the complete resident Bag at confirmation,
including cells never opened and rows hidden by a filter. Define the named Logic
method used by the Python `action='validateAndAccept'` button:

```javascript
export class Logic {
    async validateAndAccept(node) {
        const session = node.formState;
        if (await session.validate()) session.accept();
    }
}
```

`validate()` awaits local and asynchronous rules without constructing cell editors.
Errors appear in the same `editingStatus` report used by form fields. Correct a
reported cell and confirm again. Unparseable drafts continue to block acceptance.
`accept()` records a local baseline only when complete validation is current;
it does not save to a database. Changes during validation invalidate that attempt,
so the user must confirm again. Edited cells still validate immediately.

Remote rules run for each applicable cell, with bounded concurrency; validation
cost therefore depends on row count and endpoint latency. No remote batch protocol
or cross-cell result cache is introduced.
