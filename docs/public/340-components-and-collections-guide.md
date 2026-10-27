# 340 · How components and collections work

Document ID: **GC-340**.


Use a prepared collection through `Page.gramlots` when writing an application.
Read this guide when you need to **create, package or deliberately override** a
component. It describes the implemented contract; experimental plans and past
release decisions are kept in internal documents.

- Sections 005–030 explain Source, component instances and metadata.
- Sections 035–065 cover packaging and bootstrap resources.
- Sections 070–085 explain extension and replacement.
- Sections 090–105 cover lifecycle, troubleshooting and verification.

Collection generation is a development tool. Follow the installation prerequisites
in §045 rather than assuming a generator package is available on npm.

<a id="gc-340-005"></a>
## 005 · Start with three different objects

Consider this Python declaration:

```python
pane.textbox(value="^.name", lbl="Name", live=True)
```

There is no Python `Textbox` instance behind that call. The Builder recognizes a
name in its grammar and adds a typed node to **Source**. Source describes what
should exist. When the browser receives it, Gramlot creates an instance of the
component associated with that name and connects it to **Data**.

| Object | What it holds | Where it is used |
| --- | --- | --- |
| Component definition | Name, DOM tag, parameters, base, mixins and implementation factory | Authored in JavaScript; inspected during generation; activated in a browser |
| Source node | One occurrence, its parameters, pointers and children | Authored by a Builder; serialized and rendered |
| Browser component instance | The actual control and transient presentation; application state stays in Source/Data | Created in the destination document; connected to Data by the runtime |

Calling `pane.textbox(...)` twice creates two Source nodes and eventually two
component instances. Both instances use the same definition. They share Data
only when their bindings deliberately resolve to the same path.

A **collection** groups definitions, their dependencies, CSS, assets and optional
command registrations. A prepared collection also has a Python descriptor and
verified browser files. It is the unit selected by `Page.gramlots`.

<a id="gc-340-010"></a>
## 010 · Two phases: preparation and page execution

```text
JavaScript collection → generator → Python descriptor + grammar + browser assets
Python Page → typed Source → browser runtime → component instances ↔ Data Bag
```

**Preparation happens when developing the collection.** The generator imports
its JavaScript definitions without a DOM, exports the effective grammar, bundles
browser code and resources, and writes an importable Python package. You do not
maintain a second handwritten Python declaration for every component.

**Execution happens for every page.** The host reads the selected Python
collection descriptors, makes the packaged browser resources available, and gives
Python the grammar. The browser loads those resources before starting Source.
The component implementation runs there, not inside the Python Builder.

A Python application consuming an already prepared package needs that package and
the appropriate Gramlot environment. It does not need Node or the generator.
The collection developer does need them.

<a id="gc-340-015"></a>
## 015 · Builder, grammar, Source and Data

The grammar answers questions such as “does `searchbox` exist?”, “which parameters
are declared?” and “which children are allowed?”. The Builder uses it while
constructing Source. Source is a typed Bag tree, not a string of HTML and not the
browser DOM. `dataSetter` and controllers create no visible control. A setter is consumed
after writing Data and leaves Source; a controller remains to handle later events.

Data is a separate Bag. A component's `value="^.query"` is a declaration that the
runtime resolves against the node's Data context. The literal `"^.query"` is not
assigned to the native input's value.

For an existing `textbox`, under `datapath="form"`:

1. `value="^.name"` resolves to `form.name`.
2. The runtime reads that Data value and calls the component's value-writing hook.
3. An accepted user edit is read through the component's value-reading hook.
4. The shared binding machinery writes Data and updates other bound consumers.
5. A label or `disabled` binding can update without reconstructing the input.

`^` is reactive; `=` reads without subscribing. A plain reactive value pointer is
what enables a two-way editor to write back. A literal is a value, not a writable
Data destination. Component values do not accept the presentation transforms
used by labels and other read attributes.

A grammar default and a rendered default are different things. The Builder does
not insert all descriptive defaults into each Source node. The component's
parameter projection supplies defaults when the runtime receives no authored
value. Therefore an omitted attribute may be absent from Source and still have a
default in `element.parameters`.

<a id="gc-340-020"></a>
## 020 · What a component definition contains

`defineComponent` and `defineCollection` are exported by
`@gramlot/gramlot/components`. Importing them does not register browser tags.

| Field | Meaning |
| --- | --- |
| `name` | Builder authoring name, such as `searchbox` |
| `tag` | Custom-element tag, such as `acme-searchbox` |
| `base` | Factory receiving the destination realm's `HTMLElement` and returning a class |
| `mixins` | Ordered class-transforming functions, each with parameter metadata |
| `parameters` | The concrete component's parameter declarations |
| `implementation` | Factory receiving the composed base class and returning the final class |
| `subTags` | Builder child-content rule; default is no declared children |

Names and tags are separate identities. Authoring names contain letters and
numbers and start with a letter. Builder lookup is case-insensitive; underscores
are not alternative spellings. DOM tags follow the custom-element naming rules.
Collection names do not automatically namespace authoring names: a collection
called `acme` does not turn `searchbox` into `acme:searchbox`.

The definition is a descriptor, **not a constructor**. Do not write
`new Searchbox()` or `class Special extends Searchbox` when `Searchbox` is the
return value of `defineComponent`. Class composition happens through the factories.

Other descriptor fields, such as `dataScope`, `command`, `sourceContext`,
`bagStore`, `dragSource`, `childParameters` and `presentationDefaults`, connect
specific component families to existing runtime capabilities. They are not
switches that implement a feature automatically. A simple input needs none of
them; a container, editor or command surface must satisfy its owning runtime
contract before opting in.

A container has two structures to consider: its declared Source children and its
private browser implementation. `subTags` authorizes Source children; it does not
create a shadow DOM slot or arrange those children. The implementation must
provide the corresponding presentation. Private input/label/wrapper elements
inside a component are not extra authored Source nodes. Conversely, a toolbar's
menulines are actual Source children, not private button markup invented by the
component. Grammar, rendering and lifecycle must agree on that distinction.

<a id="gc-340-025"></a>
## 025 · Parameters are a contract, not just HTML attributes

```javascript
value: {dtype: 'T', nullable: true, binding: 'twoWay'},
placeholder: {
    dtype: 'T', qualification: 'intl_str',
    default: 'Search', binding: 'read', target: 'control'
}
```

`dtype` describes the accepted data type using TYTX's vocabulary; for example,
`T` is text and `B` is boolean. `nullable` adds null explicitly. `binding` records
read or two-way intent and allows the supported pointer forms in exported
metadata. These declarations feed both the portable grammar and runtime behavior.
They do not themselves implement parsing or a new editor commit policy.

`default` is the component default. `target: 'control'` is understood by
`NativeControl`: after values have been resolved, it projects the parameter to a
property of the inner control. It is not a universal DOM selector. A different
base must implement its own projection contract.

`qualification: 'intl_str'` marks text for localization metadata. It does not
translate the string. Nor should a component author assume that an arbitrary
metadata key automatically becomes validation: for example, label positions have
an `enum` annotation and explicit runtime validation in `Labelbox`.

The exported grammar includes inherited parameters and their effective types.
Its open `**attr` allowance retains Gramlot's ordinary attribute/style support;
it is not a guarantee that every misspelled extra attribute will be caught.
There is also a recorded upstream Python limitation for some boolean-or-pointer
union signatures: nested regex validation is weaker than in JavaScript. Do not
rely on that discrepancy as an accepted input format.

<a id="gc-340-030"></a>
## 030 · Base classes and mixins: metadata and methods

For a definition using `NativeControl`, `[Labelbox, FieldState]` and an
implementation factory, the runtime constructs:

```text
NativeControl(destinationWindow.HTMLElement)
    → Labelbox(Base)
    → FieldState(Base)
    → implementation(Base)
```

The metadata has a related but distinct composition rule:

1. Start with `base.parameters`.
2. Add each mixin's parameters in order. A name already present is an error.
3. Apply the concrete `parameters`. These may explicitly replace inherited
   parameter specifications.

Replacing a specification replaces that specification as a whole: include its
`dtype`, `binding` and other required properties, not only a changed `default`.

Methods follow JavaScript class inheritance. An outer mixin or implementation can
override a method. Use `super` to preserve the responsibilities of earlier layers.
Overriding `projectAttributes` without calling the base can silently lose label,
readonly or disabled handling. Keep and return the remaining attributes for the
outer renderer to project.

The current public primitives are `NativeControl`, `ChoiceGroup`, `Labelbox` and
`FieldState`. Several built-in families use additional internal bases and helpers;
their presence in source code is not a promise that they are exported extension
APIs. `FieldState` presents invalid/pending state; adding it alone does not add the
full validation engine used by built-in editors.

<a id="gc-340-035"></a>
## 035 · A complete small component

Create `ui/searchbox.js` in the collection-authoring project:

<!-- example-file: ui/searchbox.js -->
```javascript
import {
    defineComponent, NativeControl, Labelbox, FieldState
} from '@gramlot/gramlot/components';

export function searchImplementation(Base) {
    return class extends Base {
        createControl() {
            const input = this.ownerDocument.createElement('input');
            input.type = 'text';
            return input;
        }
        readControlValue() {
            return this.control.value;
        }
        writeControlValue(value) {
            const text = value ?? '';
            if (this.control.value !== text) this.control.value = text;
        }
    };
}

export const Searchbox = defineComponent({
    name: 'searchbox',
    tag: 'acme-searchbox',
    base: NativeControl,
    mixins: [Labelbox, FieldState],
    parameters: {
        value: {dtype: 'T', nullable: true, binding: 'twoWay'},
        placeholder: {
            dtype: 'T', default: 'Search', binding: 'read',
            qualification: 'intl_str', target: 'control'
        }
    },
    implementation: searchImplementation
});
```

This is a text editor with a search-oriented default. It does not execute a
search, contact a server or own application Data. That behavior belongs to the
page's controllers/Logic or a separately specified reusable service.

`NativeControl` calls `createControl` during construction and supplies the wrapper,
control identity, disabled/readonly projection and editing integration. The two
value hooks bridge browser state and the shared binding adapter. Comparing before
assigning prevents unnecessary text/caret replacement. Displaying null as empty
does not write an empty string back until the user commits an edit.

Because the inner control is a text input, the existing `live` contract applies:
`change` by default and `input` when `live=True`, with the shared composition
handling. There is no second listener writing Data in this component.

Creating DOM here is appropriate: this is reusable component implementation.
Python application code continues to describe Source.

<a id="gc-340-040"></a>
## 040 · Put it in a collection

Create `ui/acme.js`:

<!-- example-file: ui/acme.js -->
```javascript
import {defineCollection} from '@gramlot/gramlot/components';
import {Searchbox} from './searchbox.js';

export default defineCollection({
    name: 'acme',
    components: [Searchbox],
    css: [new URL('./acme.css', import.meta.url)],
    assets: {searchIcon: new URL('./search.svg', import.meta.url)},
    registerCommands(gramlot) {
        const group = gramlot.commands.registerGroup('acme', {
            author: 'Acme',
            description: 'Document commands'
        });
        group.register('save', {
            label: 'Save', icon: '↓', publish: 'save',
            tooltip: 'Save the current document'
        });
    }
});
```

Create `ui/acme.css`:

<!-- example-file: ui/acme.css -->
```css
acme-searchbox {
    display: block;
    max-width: 28rem;
}
```

Create `ui/search.svg` as a small example packaged asset:

<!-- example-file: ui/search.svg -->
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <circle cx="10" cy="10" r="6" fill="none" stroke="currentColor"/>
  <path d="m15 15 6 6" stroke="currentColor"/>
</svg>
```

The named asset is included to demonstrate packaging; the sample component does
not display it. `collection.assets.searchIcon` is a `URL` for reusable browser
code that needs it. Declaring an asset does not automatically insert an image or
change a command icon.

Top-level collection CSS styles the custom-element host and ordinary light DOM.
It cannot select arbitrary elements inside the component's shadow root. Inner
styling belongs to the component or to its supported CSS custom properties.
`lbl_*` and `box_*` are additional documented projection channels for `Labelbox`.

During preparation CSS entry points are bundled, local `@import` and referenced
files are included, and named assets are emitted with content-derived filenames.
URLs are relocated in the generated artifact. Author declarations use local
`new URL(..., import.meta.url)` values, not host-specific public paths.

The command hook is executed at build time against a registry and again for each
page at activation. Keep it deterministic and confined to command registration:
no DOM, network request, Data reads or business action. The `save` definition
supplies metadata and a publish topic; it does not save a record by itself.
Python receives the generated command catalogue, but does not author it.

<a id="gc-340-045"></a>
## 045 · Generate the Python-facing package

Use a project with an ESM `package.json` (`"type": "module"`), a Python environment
containing this development version of `gramlot`, and project-local installations
of the matching `@gramlot/gramlot` and `@gramlot/builder` source packages. The latter
currently lives at `tools/gramlot-builder` in the core repository. Node major 22,
24 or 26 is required. This is a development setup prerequisite, not an instruction
to install an unpublished npm version.

Create `gramlot.build.json`:

<!-- example-file: gramlot.build.json -->
```json
{
  "output": "./src",
  "collections": [
    {"entry": "./ui/acme.js", "pythonPackage": "acme_ui.widgets"}
  ],
  "externals": []
}
```

Run the **Python-provided command** in that project:

```sh
gramlot-builder build --config gramlot.build.json
gramlot-builder check --config gramlot.build.json
```

Despite the command's name, Python owns configuration validation, invocation,
output verification and replacement. It launches the project-local npm generator
through `@gramlot/builder/cli`. That generator imports JS, exports metadata and
bundles with esbuild into staging. The Python launcher verifies the staged output
before replacing managed files.

The generated directory contains:

```text
src/acme_ui/widgets/
    __init__.py          exports mygramlot
    grammar.json         effective Builder declarations
    commands.json        command metadata
    assets/
        index.js         entry wrapper exporting the buildId
        collection.js    prepared browser collection
        styles/...      prepared CSS
        files/...       named and CSS-referenced assets
```

Ensure the package is importable: use `PYTHONPATH=src` for a local trial, or include
it in your ordinary Python package configuration. The generator does not write a
complete application `pyproject.toml` or promise that an arbitrary packaging backend
will include every asset. When distributing a wheel, include the generated JSON,
JS, CSS and resource files and verify the installed package.

Treat generated files as outputs. Edit the JS/CSS/assets and rebuild; do not patch
`grammar.json` or its wrapper by hand. `check` reports stale output without
updating it. Exit codes are 0 for success/current, 1 for stale check output and 2
for an error or recovery condition. An interrupted replacement may require a
recovery invocation and then a separate build. Preserve the journal/backups when
reporting a recovery error; do not delete them to force success. Current locking
uses POSIX facilities; Windows execution is not verified.

<a id="gc-340-050"></a>
## 050 · Use the prepared collection from Python

Create a page such as `pages/search.py`:

<!-- example-file: pages/search.py -->
```python
from gramlot import Page as GramlotPage
from acme_ui.widgets import mygramlot


class Page(GramlotPage):
    gramlots = [mygramlot]

    def main(self, root):
        pane = root.div(datapath="form", padding="16px")
        pane.searchbox(value="^.query", lbl="Search", live=True)
        pane.p("^.query")
```

`from ... import mygramlot` imports a `GramlotCollection` descriptor. Import alone
does not activate a page or install a browser script. `gramlots = [mygramlot]`
selects it for this Page; that selection drives both authoring grammar and
bootstrap resources. The base Gramlot grammar remains available.

The paragraph and input share one Data path. Typing updates Data through the
existing binding machinery, and the paragraph displays the same value. The Python
page contains no JS registration code and does not need to know the asset URL.

For prepared built-in collections, the same shape applies, for example
`from gramlot.collections.inputs import mygramlot`. The host integration must be
using the matching prepared-collection implementation. A grammar-only JSON file
is not a substitute for this package descriptor in `Page.gramlots`.

<a id="gc-340-055"></a>
## 055 · What the host and bootstrap do for you

The Python integration derives a dependency-first registry from page declarations
at process startup, verifies the packages and keeps the registry fixed for that
process. Page discovery imports candidate modules, so module import should be
safe and should not start application jobs. Each worker initializes its own
registry. Rebuilds require restarting the server; visiting a page is not the
mechanism for registering a new artifact.

A page bootstrap names a collection with exactly:

```json
{"name": "acme", "url": "/gramlot/collections/acme/<digest>/assets/index.js", "buildId": "sha256:<digest>"}
```

The digest placeholders above are explanatory, not valid literal IDs. The adapter
creates the actual URLs, including its mount prefix. Only inventoried browser
assets are exposed, not Python initializers or grammar/command JSON.

The host emits the import map before modules execute. Theme CSS, dependency-first
collection CSS and page CSS have that cascade order. Loads may overlap; startup
waits for CSS and module completion. The browser checks imported collection names
and build IDs, registers custom-element classes, creates the runtime with the
selected grammars, registers collection commands and page Logic, then starts the
page. A failed stylesheet, module import or identity check prevents normal startup.

The build ID ties generated grammar, command metadata and files to one artifact.
It is a consistency fingerprint, not a digital signature establishing who wrote
or trusted the package. Python and browser environments must use coherent
artifacts; copying a newer JS file over an old generated package is not an update.

<a id="gc-340-060"></a>
## 060 · Add a dependency without duplicating its declaration

Declare the semantic dependency in JavaScript:

```javascript
import baseUi from './acme.js';
import {defineCollection} from '@gramlot/gramlot/components';

export default defineCollection({
    name: 'reports',
    dependencies: [baseUi],
    components: []
});
```

The build configuration maps entry modules to package destinations:

```json
{
  "output": "./src",
  "collections": [
    {"entry": "./ui/acme.js", "pythonPackage": "acme_ui.widgets"},
    {"entry": "./ui/reports.js", "pythonPackage": "acme_ui.reports"}
  ]
}
```

The dependency edge appears only in JS. The generated reports descriptor imports
the base descriptor; Python does not maintain a second dependency graph by hand.
Selecting only reports in `Page.gramlots` includes acme first. Shared dependencies
are used once; cycles, missing build mappings and conflicting collection
identities fail.

An ordinary JS import and a collection dependency have different roles. Importing
a helper function bundles code; declaring `dependencies` selects another
collection's grammar, resources and registrations. Importing a collection object
without declaring the dependency does not establish that selection contract.

For a dependency already shipped as a Python package, put it in `externals`:

```json
{
  "output": "./src",
  "collections": [
    {"entry": "./ui/reports.js", "pythonPackage": "myapp.ui.reports"}
  ],
  "externals": [
    {"entry": "@acme/widgets", "pythonImport": "acme_ui.widgets:mygramlot"}
  ]
}
```

Here the reports JS imports the installed `@acme/widgets` collection and declares
it as a dependency. These package names are illustrative. The generator verifies
the mapped JS/Python identity and dependency names; it does not regenerate or
replace the external package. Both sides must be installed in the developer's
build environment. Python consumers install the prepared Python packages.
Browser references to declared collections are linked through the host import map,
so the page uses one selected dependency artifact rather than bundling a second
copy into every dependent collection.

<a id="gc-340-065"></a>
## 065 · Inherit page selections deliberately

Python collects class-local `gramlots` declarations in base-to-derived MRO order,
then resolves their dependency graph:

```python
class ApplicationPage(GramlotPage):
    gramlots = [base_ui]

class ReportsPage(ApplicationPage):
    gramlots = [reports_ui]
```

The derived page receives both selections. `gramlots = []` in the derived class
does **not** erase the base declaration. This is accumulation, not ordinary
replacement of the effective class attribute. Repeated equal descriptors are
coalesced; a different descriptor with the same collection name is a conflict.

If two selected collections intentionally redefine an authoring name, their
resolved order matters. Express a dependency when one requires the other to
precede it; do not rely on incidental import timing.

<a id="gc-340-070"></a>
## 070 · “Override” can mean five different things

| Desired change | Mechanism | Important boundary |
| --- | --- | --- |
| Change one occurrence's label, placeholder or size | Pass attributes in Python, possibly bound to Data | No new component or registration |
| Change defaults or reusable browser behavior | Define a new descriptor using shared bases/mixins/implementation | A descriptor is not a class to subclass directly |
| Keep an authoring name but select another component | Load a later grammar declaration mapping that name to a distinct custom-element tag | Replaces the complete grammar element, not a parameter patch |
| Redefine an existing custom-element tag | Not supported | A conflicting tag in the same browser realm raises |
| Replace an already registered command/group | Not supported by the current registry | Duplicate namespace or command raises; use a distinct command identity |

A sixth case is ordinary CSS cascading. Later page CSS can override applicable
host styles; it cannot reach private shadow DOM internals without an exposed
mechanism. Do not confuse styling a component with replacing its implementation.

<a id="gc-340-075"></a>
## 075 · Specialize a component while keeping both names

Reuse the sample's implementation and explicitly composed metadata:

<!-- example-file: ui/quick-searchbox.js -->
```javascript
import {
    defineComponent, NativeControl, Labelbox, FieldState
} from '@gramlot/gramlot/components';
import {Searchbox, searchImplementation} from './searchbox.js';

export const QuickSearchbox = defineComponent({
    name: 'quickSearchbox',
    tag: 'acme-quick-searchbox',
    base: NativeControl,
    mixins: [Labelbox, FieldState],
    parameters: {
        ...Searchbox.parameters,
        live: {dtype: 'B', default: true, binding: 'read'},
        placeholder: {
            ...Searchbox.parameters.placeholder,
            default: 'Search immediately'
        }
    },
    implementation: searchImplementation
});
```

Export it in a collection's `components` list and rebuild. Python can then use
both `pane.searchbox(...)` and `pane.quickSearchbox(...)`. An explicit
`live=False` still overrides QuickSearchbox's default for that occurrence.

This example reuses a factory that the collection author deliberately exports.
For a behavior change, a factory may return a class extending the class returned
by `searchImplementation(Base)` and override a hook, preserving `super` where
necessary. That is ordinary class composition, not mutation of a registered class.
Changing read/write semantics requires its own contract and tests; it is more than
changing a label or a default.

Prefer occurrence attributes or page-level Source composition when that meets the
need. A reusable Python method can declare ordinary nodes, but there is no general
recipe declaration/expansion API to invoke. A new Web Component is justified when
it owns reusable browser behavior or a control contract, not merely to avoid
writing two lines of page authoring.

<a id="gc-340-080"></a>
## 080 · Keep the Python name and replace its implementation

Suppose a site wants its own `searchbox` wherever that name is authored. Define a
second collection with a **different collection name and DOM tag**, while keeping
the same Builder name:

<!-- example-file: ui/site.js -->
```javascript
import {defineComponent, defineCollection} from '@gramlot/gramlot/components';
import acme from './acme.js';
import {QuickSearchbox} from './quick-searchbox.js';

const SiteSearchbox = defineComponent({
    ...QuickSearchbox,
    name: 'searchbox',
    tag: 'site-searchbox'
});

export default defineCollection({
    name: 'site-ui',
    dependencies: [acme],
    components: [SiteSearchbox]
});
```

Add `ui/site.js` to the build mapping with, for example, the package
`acme_ui.site`. Selecting its generated `mygramlot` brings in acme first and
site-ui second. Both Python and browser load the declarations in that order.
A newly authored `pane.searchbox(...)` selects the complete site declaration and
renders `site-searchbox`. The base custom element `acme-searchbox` can remain
registered under its distinct tag; it has not been redefined.

The override is a whole element declaration. Parameters, child rules and render
metadata are those of the replacement. This example deliberately carries the
full descriptor through `...QuickSearchbox`. A replacement missing a base
parameter does not inherit it merely because the authoring name is the same.
Other names from earlier collections remain available.

Two components in one collection cannot have the same case-insensitive authoring
name or the same tag. Separate collections can replace a grammar name in order,
but still cannot register the same DOM tag twice with different definitions.
Reusing the exact same collection object in the same document is harmless;
creating a different collection object with an already registered tag is not.

This is startup selection for newly constructed Source. It does not promise hot
replacement of existing component instances. Rebuild, restart the host registry
and reload the page after changing prepared artifacts. Do not patch
`customElements`, mutate component metadata or modify another package's generated
files to force an override.

<a id="gc-340-085"></a>
## 085 · Grammar loading is not browser activation

There are three levels that are easy to confuse:

| API/input | What it does |
| --- | --- |
| `GramlotBuilder(collections=[grammar_document])` in Python | Adds portable declarations to that Builder |
| JS `new GramlotBuilder(null, {collections: [collection]})` | Reads a JS collection's `toDocument()` or a grammar document |
| Python `Page.gramlots = [prepared_descriptor]` | Selects the coherent package for page grammar, dependency resolution and host/bootstrap resources |

A raw grammar document contains no executable component factory. It can tell the
renderer which DOM tag to create without providing that tag's behavior. Conversely,
registering a custom element alone does not teach the Python Builder its name.
The prepared-package path supplies both halves from the same source definition.

The lower-level JS `new Gramlot({collections: [...]})` can register passed component
collections for a manually constructed runtime. It is not the whole prepared-page
pipeline: it does not discover dependencies, host their assets, load their CSS or
invoke every collection command hook for you. `PageBootstrap` owns that orchestration.
Use the low-level API for an explicit test/integration fixture; use Page selection
for the Python application path taught here.

<a id="gc-340-090"></a>
## 090 · Lifecycle and ownership when behavior grows

`projectAttributes(attrs, adapt)` receives resolved runtime attributes. The base
populates `this.parameters`, applies its owned properties and returns the rest.
Mixins consume their own attributes and return the remaining set. The renderer
handles ordinary host attributes and styles. Keep this chain intact.

`readControlValue` returns the component's accepted data representation;
`writeControlValue` projects a value into the control. Do not emit a user edit
from a programmatic write or independently call `SET` on the same value path.
The binding adapter owns writeback, listener disposal and subscriptions. A custom
control that does not behave like a native text input needs a specified event and
commit contract; a `value` parameter alone is insufficient.

The runtime supplies page context through `setPageContext` and releases a bound
control through `releaseControl`. A component allocating observers, document-level
listeners, asynchronous work or third-party editors must release them through its
appropriate lifecycle and ignore stale completion. Preserve base cleanup when
overriding it. Do not allocate per-instance mutable state on a shared descriptor.

A standard DOM `disconnectedCallback` and binding cleanup have related but
separate responsibilities. Do not assume a constructor runs again on reconnection,
or that a temporary DOM move is always equivalent to Source removal. Verify the
actual lifecycle of the base you extend; this guide does not invent a universal
mixin teardown order beyond the implemented class chain.

The runtime maintains typed Source and Data. There is no approved formal “Live
Object Tree” model to substitute for those contracts.

<a id="gc-340-095"></a>
## 095 · Common failures and what they mean

| Symptom | First check |
| --- | --- |
| Python does not recognize a component name | The generated package is current and the Page selects its descriptor |
| A custom tag appears without behavior | Only grammar was loaded, or browser activation failed |
| `Custom element already registered` | Two definitions used one DOM tag; use a distinct tag for a replacement |
| `Duplicate mixin parameter` | Base/mixins claim the same parameter; concrete overrides belong in `parameters` |
| A replacement lost attributes or child rules | Grammar replacement is whole-declaration, not a deep merge |
| An inherited collection remains selected | Page `gramlots` declarations accumulate through the MRO |
| A dependency is missing | It is declared in JS and mapped as output or external in build configuration |
| Generated output is stale | Edit sources, run build/check, then restart the host |
| Fingerprint or identity mismatch | JS, grammar, metadata and descriptor came from different builds or were edited |
| Component CSS has no effect internally | The selector targets shadow DOM; use the component's supported channels |
| A command name collides | Namespaces are page-local registry identities, not last-one-wins overrides |
| A new attribute is accepted but has no effect | Grammar acceptance does not implement projection or behavior |

A failed preparation, verification or bootstrap is an actionable error. Do not
work around it by loading a second runtime, fetching an unverified alternate
module, disabling grammar validation or hand-editing generated output.

<a id="gc-340-100"></a>
## 100 · How to verify an extension

A useful verification sequence follows the boundary you changed:

1. **Definition:** import the module without a browser; inspect `toDocument()`;
   check inherited parameters, duplicate errors and child rules.
2. **Preparation:** build, then check; confirm that all declared files are present,
   the generated Python package imports and `mygramlot.verify()` succeeds.
3. **Python authoring:** construct Source using the generated grammar; exercise
   valid values and relevant invalid types/structure.
4. **Runtime binding:** mount that Python-produced Source with the selected JS
   definition; check initial value, Data-to-control updates, user-to-Data edits,
   defaults, disabled/readonly behavior and removal cleanup.
5. **Composition/override:** select base and replacement; verify which authoring
   name maps to which DOM tag, without altering an unrelated Builder instance.
6. **Real browser/host:** check actual CSS, focus, keyboard, sizing and packaged
   URLs through the integration you use. A JSDOM assertion is not visual QA.
7. **Distribution:** install the wheel in a clean consuming environment and verify
   resources there. A source checkout can hide missing wheel package-data rules.

The sample's focused checks are recorded in GC-070; they are not a blanket claim
that every custom component or every browser has been qualified. Broader release
qualification remains a separate activity.

<a id="gc-340-105"></a>
## 105 · Where to read next

- [Existing component families](105-components.md): controls, labels,
  typed editing, layout and validation contracts.
- [Data binding and controllers](097-data-binding.md): application Data
  and named behavior.
- [Themes and CSS](096-themes-and-css.md): host styles and supported
  presentation conventions.
- [Collection design and implemented preparation path](https://github.com/gramlot-org/gramlot/blob/main/docs/future/325-how-to-extend-gramlot.md#gc-325-150): protocol, build IDs, recovery and host integration.
- [Common menu system](350-menus-toolbars-and-windows.md): provisional command,
  menu and frame behavior.
- [Naming conventions](https://github.com/gramlot-org/gramlot/blob/main/docs/internal/225-naming-and-proxy-conventions.md): terminology and
  boundaries for new APIs.

For application loading, use the prepared-package path in this guide.
The lower-level Builder grammar API remains useful for authoring and serialization tools.
