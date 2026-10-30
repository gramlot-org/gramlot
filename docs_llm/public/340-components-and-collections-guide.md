# 340 · How components and collections work

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

<a id="gc-340-105"></a>
## 105 · Further reading

See GC-105 for existing components, GC-097 for binding, GC-096 for styles, GC-325
§150 for implemented preparation, GC-335 for provisional menus and GC-225 for
naming. In this development checkout GC-325 §150 and this guide supersede GC-105's
older URL-only collection activation paragraphs; no stable-release claim follows.


Environment collections (2026-10-30): declare once on the environment Page base
or host `collections` option; examples inherit all configured collections. Extra
Page.gramlots still accumulate. Both hosts cache environment Page composition and
grammar without mutating imported classes. Components' dynamic import() boundaries
produce separate verified ESM files; external engines load on first use, shared
within the document. File-origin derived bundles still embed engines eagerly.
