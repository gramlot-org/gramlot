# 325 · How to extend Gramlot

> Implementation status and operational instructions: [§150](#gc-325-150). Earlier “pending” statements describe the design-stage historical record.

> **Generator toolchain confirmed (2026-10-23):** §140 fixes @gramlot/builder/cli,
> Node 22/24/26 and esbuild. Section 145 now confirms the bounded first Uvicorn
> integration and its behavior. Design is ready; implementation has not started.

> **Generator protocol confirmed (2026-10-23):** §130 fixes version 1, exact
> request/result fields, structured diagnostics and process/CLI exit codes.
> Output replacement recovery is separately confirmed in §135. Both remain design.

> **Source assets confirmed (2026-10-23):** §125 defines ordered css URL entries
> and named assets in defineCollection, with generated references/inventories.
> Owner confirms css/assets in the JS definition; implementation remains pending.

> **Page discovery confirmed (2026-10-23):** §120 defines reuse of current file
> routing/loading with Page-export classification. Importing candidate helpers
> at startup is explicitly approved; implementation remains pending.

> **Current readiness (2026-10-23):** §115 consolidates settled contracts and the
> remaining specifications. Older open-point notes are historical where later
> sections resolve them; no implementation phase has started.

> **Registry lifecycle confirmed (2026-10-23):** §110 defines startup enumeration
> of trusted page classes and a complete, fixed resource catalogue in each process.
> Owner explicitly confirms initialization from pages and a process-lifetime
> fixed registry. Page.gramlots is not declared again elsewhere.

> **Python adapter API confirmed (2026-10-23):** §105 defines the integration-owned
> GramlotCollectionResources service and a neutral GramlotServer.collection_url
> hook, approved by owner "Sì, confermo." Section 110 settles registration lifecycle.

> **Bootstrap fields confirmed (2026-10-23):** owner "ok" approves collection records
> {name, url, buildId} and descriptor-backed exposure of inventory-listed browser
> assets (§100). Route examples remain illustrative; implementation is pending.

> **Bootstrap CSS policy confirmed (2026-10-23):** §095 records theme → collections
> → page ordering, waiting for declared stylesheets before startup and blocking
> startup on load failure. Section 100 settles the bootstrap fields and asset
> exposure contract; concrete adapter integration remains to implement.

> **Launcher contract confirmed (2026-10-23):** §090 defines project discovery,
> versioned JSON process communication and Python/JS responsibilities. Section
> 130 now settles exact protocol fields; runtime implementation remains pending.

> **CLI confirmed (2026-10-23):** owner "ok" approves gramlot-builder build/check,
> independent of the existing server-owned gramlot launcher, with verified
> generated-file ownership and a non-mutating check (§080). Exit codes are
> confirmed in §130 and recovery in §135; implementation remains pending.
> The toolchain distribution split is confirmed in §085.

> **Fingerprint confirmed (2026-10-22):** §075 fixes SHA-256 coverage, generated
> build_id/files and buildId metadata, wrapper normalization, verification stages
> and fingerprinted asset bases. Runtime implementation is pending.

> **Build correspondence confirmed (2026-10-22):** §070 requires a shared
> descriptor/module fingerprint and startup failure on mismatch. §075 now settles
> its calculation, fields and verification stages; runtime is pending.

> **Browser linking confirmed (2026-10-22):** §065 uses generated collection
> specifiers and a host-generated import map. Artifact checks and asset delivery
> details remain open; runtime is pending.

> **External-package mapping confirmed (2026-10-22):** §060 maps external JS
> entries to installed Python descriptors without regenerating their packages.
> §065 fixes browser linking; artifact checks remain open. Runtime is pending.

> **Generation mapping confirmed (2026-10-22):** §055 maps JS entries to Python
> package destinations and derives imports from dependencies. §060 covers external
> packages; §065 fixes symbolic browser linking. No generator is implemented.

> **Catalogue confirmed (2026-10-22):** §050 fixes commands.json for namespaced
> extension groups and the empty group "" reserved to unqualified base commands.

> **Package confirmed (2026-10-22):** §045 fixes the GramlotCollection fields
> and generated package structure. Command catalogue is fixed in §050; dependency mapping
> and build/asset consistency remain open; runtime is pending.

> **Loading lifecycle confirmed (2026-10-22):** §040 uses registerCommands
> during preparation for catalogue export and before page startup for activation.
> Collection name identity, deduplication and same-name conflict errors are also
> confirmed. Duplicate full command keys are errors; distinct namespaces coexist.
> Each command namespace has one owning collection. Package layout is confirmed;
> gramlots inheritance is cumulative, with deduplication. Required collections
> are included automatically before their consumers; missing/cyclic dependencies
> are errors. The confirmed dependencies field holds imported collection objects;
> generated package metadata derives from it. Runtime is pending.

> **Menu follow-up, 2026-10-22:** [GC-330](330-menus-and-commands.md) records
> the legacy/core inventory and proposed command sharing between bars and menus.
> The owner reaffirmed flex bars with ordinary Source children. A shared registry
> and unnamed slotButton spacers remain proposals; unknown-name behavior is open.

Document ID: **GC-325**. Date: **2026-10-22**.
Status: **design guide; extension packaging and slotButton APIs are not implemented**.
[Concise view](../../docs_llm/future/325-how-to-extend-gramlot.md).
Related: [component contract](245-components-0-3-plan.md),
[frames and bars](320-frames-bars-and-windows.md),
[naming conventions](../internal/225-naming-and-proxy-conventions.md).

This guide separates existing mechanisms, owner-selected contracts and proposed
details. It is future repository documentation, not an executable tutorial for
the released package. No package publication or runtime implementation is
authorized by the request to write this guide.

<a id="gc-325-005"></a>
## 005 · Define once in JavaScript, consume from Python

A project can contribute reusable browser components and named slotButton
definitions through an extension called a gramlot. JavaScript owns component
definitions and their grammar metadata. Python consumes that grammar to construct
SourceBag/SourceBagNode trees; it does not independently define the same widgets.

The owner-selected Python declaration is:

```python
from xxx.yyy import mygramlot

class Page(GramlotPage):
    gramlots = [mygramlot]
```

This is a contract sketch: the page base import and the generated package API are
not a claim about current exports. Importing makes the extension object available;
the page declaration identifies the extensions it uses. The Gramlot base is
included by default, so this list contains additions rather than replacing the
base. The exact contents of that default base remain to be inventoried.

The intended preparation and consumption path is:

```text
JS component and slotButton definitions
                  |
        gramlot CLI preparation
                  |
importable Python extension + generated grammar + JS/CSS assets
                  |
            Page.gramlots
             /         \
Python Builder grammar   browser bootstrap and asset URLs
```

Core remains independent of hosting technology. Serving packaged files and mapping
them to URLs belong to the server/host integration. Browser behavior belongs to
shared components; applications use Source, Data Bags, bindings and controllers.

<a id="gc-325-010"></a>
## 010 · What exists already

| Existing mechanism | Evidence and boundary |
| --- | --- |
| JS component declarations | `js/src/components/registry.js` provides `defineComponent` and `defineCollection`; declarations contain parameters and browser implementation. |
| Portable grammar | `ComponentCollection.toDocument()` exports a Builder grammar document consumed in Python and JavaScript. It is not a Python-code generator. |
| Python grammar loading | `src/gramlot/page/builder.py` accepts collection documents and exposes `load_collection`. |
| Application collection configuration | `src/gramlot/server/gramlot_server.py` accepts entries pairing `grammar` with `module`; Source construction loads grammar and bootstrap includes collection module URLs. |
| Browser activation | `js/src/bootstrap.js` imports collection modules, calls `collection.register(window)`, and supplies their grammar before starting the application. |
| CSS and page Logic | `src/gramlot/server/gramlot_file_server.py` resolves `Page.css`, companion CSS and a companion Logic module. Bootstrap handles CSS links and JS Logic imports. |

The new importable gramlot object, `Page.gramlots`, generation command and
slotButton registry are not supplied by those existing mechanisms. They require
bounded implementation and tests.

`css_requires` and `js_requires` currently address named resources through a
resource-capable Host. Under constitution amendment 11.57, the common FileHost/
file-server path does not resolve them; that resource system belongs to
genro-kajenn. This guide does not redefine those attributes or silently add that
resource system to a generic adapter. A Logic import is not the collection loader.

<a id="gc-325-015"></a>
## 015 · Prepare an extension with the CLI

The owner proposes using the `gramlot` CLI for generation. A possible command
shape, **not an available or approved command spelling**, is:

```sh
gramlot collection build ./widgets/index.js --out ./dist/widgets
```

The desired result is an importable Python package/object connected to the
generated grammar and browser assets. Proposed build outputs are:

- the portable grammar produced from JS declarations;
- browser component modules and any required CSS/assets;
- the Python-facing extension object;
- metadata connecting those resources, including named slotButton groups.

The CLI implementation, entry-module contract, bundling versus copying, output
layout, Python packaging backend and metadata/manifest format remain open.
Keeping the existing JSON grammar and using a thin Python object around it is a
proposal; the owner chose an importable object, not a second Python grammar source.

The tool should validate the generated declarations and packaged references before
delivery. Duplicate-name rules, group collisions and exact diagnostics require
a confirmed contract. Merely copying JS into a served directory does not provide
Python with its grammar.

<a id="gc-325-020"></a>
## 020 · Activate a gramlot on a page

The chosen public declaration is `gramlots = [mygramlot]`, with the base implicit.
The implementation must connect three responsibilities:

1. Make the selected grammar available before constructing the page Source.
2. Expose the corresponding packaged browser assets through the host integration.
3. Include the selected collection modules and CSS in bootstrap before use.

The existing application-level `collections` mechanism provides building blocks;
it does not yet implement page-level `gramlots`. §040 records the confirmed
cumulative inheritance, collection deduplication and collision rules. Exact object
fields and adapter packaging remain design questions. The dependencies field
contains imported collection objects; generated dependency metadata derives from it.
§040 confirms automatic dependencies and dependency-before-consumer activation.
Do not introduce import-time global activation.

An extension must not depend on the page being opened in a particular order.
Python and browser activation must use matching definitions. The detailed rules
and tests for these invariants are implementation gates, not current guarantees.

<a id="gc-325-025"></a>
## 025 · Register custom slotButtons in JavaScript

A custom slotButton definition supplies presentation defaults and a published
command. Instances use the shared slotButton component. The designated content
of the enclosing frame handles the command; the message identifies the originating
button. The button definition does not perform saving, exporting or database work.

The reviewed API shape is:

```javascript
const grp = gramlot.commands.registerGroup("invoices", {
    author: "My project",
    description: "Invoice commands"
});

grp.register("issue", {
    icon: "send",
    label: "Issue",
    tooltip: "Issue the invoice",
    publish: "issue"
});
```

The owner confirmed the shared entry-point name on 2026-10-22 (GC-225 §005).
This is a design example, not an implemented global object or callable API.
The namespace makes `invoices:issue` distinct from an unqualified standard
name. Group ownership by an extension, module exports and the build-time registry
entry point must still be specified; the snippet does not require an active browser
page while generating grammar.

The owner requires registration in JS only: Python receives the generated
descriptions. The gramlot must carry the definitions needed by its consumers;
the exact metadata representation is open. Author/description and icon identifiers
above illustrate the API, not a verified icon set or localization implementation.

At use sites the selected fixed grammar is:

```python
bar = frame.top.slotBar()
bar.slotButton("invoices:issue", disabled="^.locked")
bar.slotSpacer(size=12)
bar.slotButton("undo")
bar.slotSpacer(flex=1)
bar.slotButton("close")
```

These are design examples. The bound `disabled` override is proposed; allowed
overrides and their merge/validation rules need specification. A button publishing
`close` targets the application content; it does not automatically close a window.

The component names stay in the base grammar. Registered keys are parameter
values: no `bar.invoices_issue()` methods or grammar switching per button.
The component's fixed parameters can be checked by the grammar without treating
every registration as a new grammar element.

<a id="gc-325-030"></a>
## 030 · Compose bars and handle unknown names

Nested bars and multiple bars in a frame region remain confirmed requirements.
An ordinary content slot for nesting is still an API proposal:

```python
extra = bar.slot("extra")
nested = extra.slotBar()
nested.slotButton("invoices:issue")
```

The owner's earlier sketch used `bar.slotButton("extra")` as the container.
The assistant suggested `slot("extra")` to distinguish free content from a
registered button. That exact distinction/name has not received separate owner
confirmation. Do not invent a fallback from an unknown button to a content slot.

Unknown registered names are **unresolved**. The owner considered a `???`
placeholder and/or a console warning, then explicitly said "decidiamo poi".
Do not present strict rejection, skipping the button, disabled placeholders,
warning frequency or a particular tooltip/Inspector message as approved behavior.
The Builder still checks the fixed element and parameter contract; the unknown
registry-key policy is a separate decision.

The earlier compact slot string, automatic per-button grammar methods and Python
registration API are not the selected authoring path. They are retained only as
superseded proposals in the discussion history.

<a id="gc-325-035"></a>
## 035 · Decisions, evidence and implementation gates

Owner evidence from the current conversation, 2026-10-22:

| Decision or request | Owner evidence | Scope |
| --- | --- | --- |
| JS owns registration and grammar | "io la registrazione la farei solo js. python 'riceve' da js la grammatica, non la produce" | Supersedes the Python registration proposal. |
| Importable page extensions | Owner supplies `from xxx.yyy import mygramlot` and `gramlots = [mygramlot]`. | Selected Python surface; object and loader not implemented. |
| Implicit base | "di default c'è il gramlot base" | Additive extensions; exact base inventory open. |
| Fixed button grammar | Owner supplies `bar.slotButton("xxx:save")`/`bar.slotSpacer(...)`, then "i nomi sono solo quelli della grammtica base". | Supersedes compact strings and generated button methods as the chosen path. |
| Unknown names deferred | "decidiamo poi" after placeholder/warning alternatives. | No final diagnostic/rendering policy. |
| Guide request | "ok quindi potremmo fare un doc 'how to extend gramlot ?" following the custom-button proposal. | Authorizes this design guide, not runtime work. |

Group registration, namespaced keys and CLI preparation are the discussed direction.
Exact packaging, registry scoping and method/field details remain proposals unless
covered by the explicit choices above. New final names must enter GC-225 before
implementation, with owner confirmation; these snippets do not amend it implicitly.

Before implementation, settle one decision at a time: the extension object and
packaging contract; integration with page construction/bootstrap; registry metadata
and activation; custom content slots and unknown-name behavior. Preserve the
fixed grammar and JS ownership already chosen.

Focused qualification should then cover: generated grammar parity, importable
packaged resources, implicit base plus selected extensions, unrelated-page
isolation, URL mapping under mount prefixes, component activation before use,
namespaced button defaults and instance bindings, sender/target routing, nested
bars and the finally chosen unknown-name policy. Test the owning implementations;
do not patch Builder/Bag dependencies from this repository or add consumer
workarounds for missing contracts.

Document checks establish syntax, links and paired anchors only. Full release
qualification belongs before a release; no runtime validation is claimed here.

<a id="gc-325-040"></a>
## 040 · Confirmed collection entry point and activation sequence

Owner request, 2026-10-22: start the registry/collection loading design and show
how JavaScript registration reaches Page.gramlots, Python and bootstrap.
Owner confirms the shared preparation/bootstrap lifecycle with "ok".
registerCommands, gramlot.commands.registerGroup and Page.gramlots are confirmed.
Concrete packaging details and remaining policies below are not yet approved.

### Author one JavaScript collection

```javascript
import {defineCollection} from "@gramlot/gramlot/components";

export default defineCollection({
    name: "documenti",
    components: [],
    registerCommands(gramlot) {
        const group = gramlot.commands.registerGroup("documenti", {
            author: "Document project",
            description: "Document commands"
        });
        group.register("save", {
            label: "Save",
            icon: "save",
            tooltip: "Save the document",
            publish: "save"
        });
        group.register("toggleDetails", {
            label: "Show details",
            icon: "info",
            tooltip: "Show or hide document details",
            publish: "toggleDetails"
        });
    }
});
```

defineCollection and its components export exist. The registerCommands hook does
not exist yet; it is the confirmed extension design. An empty components list represents
a commands-only collection. A collection with custom components supplies their
normal defineComponent declarations in the same list.

Importing the module creates a definition; it does not mutate window.gramlot or
register commands in a process-global registry. The hook declares static command
metadata only: no DOM, Data reads, network operations or business handlers.
The preparation tool runs it against an isolated commands registry; bootstrap
runs it against the page's commands registry. Thus the same source declares both
catalogues, without requiring a browser page during generation.

### Generated Python-facing package

The preparation step exports the existing portable component grammar, a command
catalogue, the browser entry module and its assets, plus an importable Python
descriptor. Directory names, descriptor class, manifest format and CLI spelling
are still open; this proposal introduces no second hand-authored grammar.

The descriptor identifies one collection and its packaged resources. Python reads
the generated command keys and metadata; it never executes the registration JS.
For a commands-only collection, no new Python component methods are generated:
menu/menuline remain base grammar and documenti:save remains a registered key.

```python
from gramlot import Page as GramlotPage
from documenti.widgets import mygramlot

class Page(GramlotPage):
    gramlots = [mygramlot]

    def main(self, root):
        menu = root.dropDownButton("Actions").menu()
        menu.menuline("documenti:save")
        menu.menuline(
            "documenti:toggleDetails",
            checked="^document.detailsVisible",
        )
```

This fragment illustrates loading/authoring only; the complete frame recipient,
Data initialization and handlers remain the reviewed full-page example.
The import itself has no activation side effect. The page declaration selects
the extension. The command catalogue makes introspection and diagnostics possible;
the still-deferred unknown-key policy is not decided by this proposal.

### One selected collection set, two consumers

1. Resolve implicit base plus the page's declared extensions before building
   Source. Use that same selection for every source-method call on this page.
2. Load their generated grammar into that page's Python Builder and expose their
   command metadata to page validation/introspection. Do not mutate global grammar.
3. The host maps only declared packaged resources to URLs. Core defines the
   descriptor/bootstrap contract; integration owns serving, not a new core
   resource host or a redefinition of js_requires/css_requires.
4. Bootstrap receives selected collection module URLs and declared CSS through
   the existing resource channels. Resource/descriptor wire details remain open.
5. Import modules and register component classes through the existing collection
   mechanism; create the Gramlot instance with the selected grammars.
6. Before app.start(), invoke the selected collections' registerCommands hooks
   against that page instance, then start normal Source loading/rendering.
   Command activation is per page instance, distinct from custom-element class
   registration per window. A second page gets its own command registry.

Python descriptors, command catalogues and browser modules must come from the
same prepared artifact. How to verify this identity at activation remains to
specify. A partial or failed extension activation must not start a page that
appears successfully configured.

No manual js_requires or css_requires entry is required by this proposed packaged
extension path. Assets still require host integration; gramlots is not a promise
that an arbitrary adapter can already serve package files.

### Remaining policies

Owner confirms with "ok": name identifies the collection; repeated inclusion
of the same collection activates it once; different collections with the same
name produce an explicit error, never an overwrite. Apply this to the page's
selected collection set before invoking registration hooks. A matching name alone
does not prove that two artifacts are the same collection.

Owner also confirms with "ok": documenti:save and fatture:save coexist, but
registering the same full command key twice is an explicit error without
overwrite. Repeated collection inclusion is deduplicated before activation,
so it does not create repeated command registrations.

Owner then confirms with "confermo": each command namespace has one owning
collection. Other collections may reference its commands but cannot add commands
to that group; their definitions use another namespace. A different collection
cannot claim an already-owned namespace even with disjoint command names.
Collection name and command namespace need not be equal.

Owner confirms with "ok" that Page.gramlots is cumulative across inheritance:
BasePage declaring [documenti] and Page(BasePage) declaring [report] select base
Gramlot, documenti and report, deduplicated. Subclass declarations add rather
than replace. No removal syntax or new multiple-inheritance precedence is implied.

Owner confirms with "ok": required collections are included automatically and
loaded before the requiring collection. Missing dependencies and dependency
cycles fail explicitly. Pages need only list direct choices; the existing
deduplication and same-name collision rules apply to the resolved collection set.
Use that same set for Python grammar/catalogue and browser bootstrap.

Owner subsequently confirms with "ok" the dependency declaration:

```javascript
import common from "./common.js";
import {defineCollection} from "@gramlot/gramlot/components";

export default defineCollection({
    name: "documenti",
    dependencies: [common],
    components: [],
    registerCommands(gramlot) {
        // Declare this collection's commands here.
    }
});
```

dependencies contains imported collection objects. Preparation derives package
dependency metadata from these references; Python does not repeat the list.
The concrete generated dependency representation remains to define.

Owner confirms with "ok": registerGroup creates each namespace once per registry;
a second call errors even for the owning collection. Modules of that collection
may share the returned group to add commands, keeping full-key uniqueness.
Preparation and page activation use separate registries, as already confirmed.

Generated dependency representation, artifact-consistency
checks, asset packaging and host URL mapping remain to confirm. These policies
must preserve the existing component-grammar composition contract; command
registry collision rules do not silently change Builder grammar merge rules.
No registry overwrite, auto-discovery or fallback loading is implied.

Evidence: ComponentCollection currently accepts name/components, exports
toDocument() and registers component classes per window. GramlotServer loads
application-level collection grammar before Source construction; PageBootstrap
imports collection modules and constructs Gramlot before app.start(). Page.gramlots,
the command registry/hook and preparation tool remain implementation work.

<a id="gc-325-045"></a>
## 045 · Confirmed generated package and Python descriptor

Owner requests the concrete package/descriptor design after confirming the
loading lifecycle and JS dependencies. The owner confirms the lightweight
GramlotCollection name/role, then replies "ok" to the full fields and package
layout example below. These are approved design, not implemented runtime API.

A generated collection package contains an importable descriptor, portable
grammar, command catalogue and browser assets:

```text
documenti/
    __init__.py
    widgets/
        __init__.py
        grammar.json
        commands.json
        assets/
            index.js
            documenti.css
            icons/
```

Confirmed Python descriptor, generated in documenti/widgets/__init__.py:

```python
from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="documenti",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=("assets/documenti.css",),
    dependencies=(),
)
```

This particular example has no collection dependencies. A collection with the
confirmed JS dependencies field receives generated imports/references to the
corresponding Python descriptors instead of an empty dependencies tuple.
The mapping from JS modules to Python package locations remains to specify;
do not invent package paths from a command namespace. No handwritten dependency
list is required in Python.

The descriptor is inert and immutable in the proposed contract. Its fields mean:

| Field | Meaning |
| --- | --- |
| name | Confirmed collection identity, derived from the JS collection name |
| package | Importable Python resource package containing the generated files |
| grammar | Package-relative portable Builder grammar document |
| commands | Package-relative generated command metadata catalogue |
| module | Package-relative browser collection entry module |
| css | Ordered package-relative stylesheet references; empty when none |
| dependencies | Generated references to required collection descriptors |

Python resource access should use package-resource APIs, independent of the
working directory; package paths are not browser URLs. The host maps declared
packaged assets to URLs for bootstrap. The descriptor is not a server and does
not register routes or globally activate resources at import.

grammar.json reuses the existing portable grammar format. commands.json is
generated from registerCommands; it contains metadata, not Python callbacks or
browser business handlers. Its namespaced schema is confirmed in §050. The Python descriptor
is the single confirmed resource map; do not add a second manifest repeating its
fields. Assets and catalogues are shipped together in the Python distribution.
A project can include the generated package in its own distribution; this does
not require publishing a separate package per collection.

The browser module keeps the confirmed collection contract and static command
hook. Module packaging must resolve all JS/CSS asset references; simply copying
an unresolved source entry module is not a complete build. Core-runtime sharing,
cross-package dependency mapping, asset allowlisting and consistency checks
remain explicit design/implementation gates, not guessed fallbacks.

Consumption stays unchanged:

```python
from gramlot import Page as GramlotPage
from documenti.widgets import mygramlot

class Page(GramlotPage):
    gramlots = [mygramlot]
```

Python loads generated grammar/catalogue before Source construction. Bootstrap
loads the module and CSS, then registers commands before app.start(), using the
confirmed per-page activation contract. No new Python methods are generated for
registered command names. GramlotCollection is not currently exported; syntax
checks do not prove this example executable.

<a id="gc-325-050"></a>
## 050 · Confirmed generated command catalogue

Owner requests commands.json after accepting the package layout, then replies
"ok" to this format for namespaced collection groups. Schema design is approved;
runtime implementation remains pending.

```json
{
    "document_format": {
        "name": "gramlot_commands",
        "version": "1.0"
    },
    "groups": {
        "documenti": {
            "author": "Document project",
            "description": "Document commands",
            "commands": {
                "save": {
                    "label": "Save",
                    "icon": "save",
                    "tooltip": "Save the document",
                    "publish": "save"
                },
                "toggleDetails": {
                    "label": "Show details",
                    "icon": "info",
                    "tooltip": "Show or hide document details",
                    "publish": "toggleDetails"
                }
            }
        }
    }
}
```

document_format follows the existing portable-document convention with a separate
format name gramlot_commands. version identifies this catalogue schema, not the
Gramlot/library/package release. groups is keyed by command namespace; each
group contains optional author/description metadata and a commands mapping keyed
by local command name. The complete identity derives from namespace and local
name, e.g. documenti:save. Do not repeat code, namespace or full-key fields inside
each definition. Collection identity/resources/dependencies remain in the Python
descriptor, not a duplicate catalogue manifest.

For this confirmed schema, each command requires label and publish strings;
icon and tooltip are optional strings, omitted when absent. Groups always have a
commands mapping, even when empty. A collection without commands has groups: {}.
No callbacks, executable expressions, DOM/Source references, application Data or
per-instance bindings are catalogue values. checked/disabled/hidden and command
arguments belong to menu entries/activation, not state captured at build time.
This does not settle new registry-state defaults or arbitrary instance overrides.

The catalogue contains only definitions owned by this collection. Required
collections supply their own catalogues, loaded via the confirmed dependency
graph; do not flatten them into every consumer's output. Duplicate keys or a
second namespace owner are errors under the already approved contracts, not
last-write-wins JSON behavior. The producer must detect duplicates before object
serialization can lose them. Consumers validate the declared format and fields;
unsupported formats/fields are diagnosed, not normalized into another schema.

Python uses the catalogue for names/metadata, diagnostics and future Catalog or
editor forms. The final policy for an unknown command reference remains deferred;
catalogue availability does not silently choose strict rejection or placeholders.
Parameter-form schemas are not introduced by this catalogue.

Browser activation still executes the confirmed registerCommands hook. It does
not register the same commands again from commands.json. Matching generated
metadata and browser definitions must be checked by the eventual build/activation
consistency contract; this section does not introduce another runtime registry.

Owner confirms with "ok" the empty group "" reserved to the base collection:
registerGroup("", metadata) declares standard commands. In commands.json its
definitions live under groups[""]. A local save becomes the full key save;
documenti's save remains documenti:save. Resolution is exact, without aliases
or cross-namespace fallback. Non-base collections cannot own the empty group.
Group creation is once per registry, including for its owner; share the returned
group across the owner's modules instead of calling registerGroup again.
Localization and
parameter metadata remain open, not implicitly accepted schema extensions.

Verification here checks the JSON example's structure and correspondence to the
two reviewed registration definitions; it is not a runtime loader test.

<a id="gc-325-055"></a>
## 055 · Confirmed dependency-to-package generation

Owner requests a concrete dependency-generation example without duplicate
declarations, then confirms this destination map with "ok". Configuration syntax
and generation responsibility are approved; the CLI/generator is not implemented.

### Authored JavaScript

ui/common/index.js:

```javascript
import {defineCollection} from "@gramlot/gramlot/components";

export default defineCollection({
    name: "common",
    components: [],
    registerCommands(gramlot) {
        const group = gramlot.commands.registerGroup("common", {});
        group.register("refresh", {label: "Refresh", publish: "refresh"});
    }
});
```

ui/documenti/index.js:

```javascript
import {defineCollection} from "@gramlot/gramlot/components";
import common from "../common/index.js";

export default defineCollection({
    name: "documenti",
    dependencies: [common],
    components: [],
    registerCommands(gramlot) {
        const group = gramlot.commands.registerGroup("documenti", {});
        group.register("save", {label: "Save", publish: "save"});
    }
});
```

dependencies: [common] is the sole authored dependency edge. Importing a module
does not by itself make it a collection dependency; the explicit descriptor field
does. Imported helpers and other modules are not auto-discovered collections.

### Build destinations

Confirmed gramlot.build.json:

```json
{
    "output": "./src",
    "collections": [
        {
            "entry": "./ui/common/index.js",
            "pythonPackage": "acme.widgets.common"
        },
        {
            "entry": "./ui/documenti/index.js",
            "pythonPackage": "acme.widgets.documenti"
        }
    ]
}
```

This is a location map, not another dependency graph. Each entry identifies a
collection module's default export and its generated Python package. output and
entry paths resolve relative to the configuration file, not the current working
directory. The name still comes from the JS descriptor; do not repeat or infer
it from the Python package name or command namespace.

The example emits acme/widgets/common and acme/widgets/documenti under src,
each with the confirmed __init__.py, grammar.json, commands.json and assets.
The export name is mygramlot, as in the reviewed package example. Package-parent
handling and distribution-backend integration remain separate build details;
the generator must not overwrite user-authored parent package initializers.

### Generated Python

src/acme/widgets/common/__init__.py:

```python
from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="common",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
)
```

src/acme/widgets/documenti/__init__.py:

```python
from gramlot import GramlotCollection
from acme.widgets.common import mygramlot as common_gramlot

mygramlot = GramlotCollection(
    name="documenti",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(common_gramlot,),
)
```

Generation resolves each configured JS entry through the module loader, walks
the explicitly declared dependency objects, and maps each dependency to its
configured Python destination. In this example the common object imported by
documenti is the same collection default export provided by the common entry.
Validate object/module correspondence and the approved collection identity rules;
matching a name alone must not merge two different definitions.

The edge to common generates the Python import and dependency tuple. Page authors
still write only gramlots = [mygramlot] for documenti; runtime resolution includes
common first in both Python loading and browser activation. No dependency list is
copied into the build mapping, page or another handwritten Python declaration.

### Boundaries and checks

- A required collection without a configured destination is a build error;
  do not guess package names, namespace mappings or download a missing dependency.
- Duplicate/ambiguous destinations or conflicting collection definitions fail.
  Dependency cycles and missing modules follow the already approved error policy.
- This example packages both collections in one application distribution.
  References to separately distributed Python extensions use the confirmed §060
  external map; do not regenerate or vendor those packages.
- Browser imports must retain dependency identity. Packaging must share the
  already selected core runtime and preserve/map the common module reference,
  rather than embedding a second independent copy into each consumer. The exact
  emitted JS link/URL mechanism remains to define with asset delivery.
- A build must not silently overwrite application-owned source files. Generated
  destination ownership, stale-file cleanup and atomic output are implementation
  gates; this example does not authorize filesystem mutations.
- This mapping creates no Python or JavaScript release pins/lockfiles.

Documentation checks verify the JSON and code snippets only. They do not prove
module packaging, import execution, bootstrap behavior or a working generator.

<a id="gc-325-060"></a>
## 060 · Confirmed external collection references

Owner requests an example referencing an already distributed collection without
regenerating it, then replies "ok" to externals with entry and pythonImport.
The mapping is approved design; unresolved browser linking and artifact checks
are not implicitly approved or implemented.

Assume the development environment can resolve the JS package export
@acme/common/widgets and the Python environment can import the already generated
descriptor acme_common.widgets.mygramlot. These are example names, not verified
public packages. Installing/publishing them is outside this example.

### Authored dependency remains in JavaScript

```javascript
import {defineCollection} from "@gramlot/gramlot/components";
import common from "@acme/common/widgets";

export default defineCollection({
    name: "documenti",
    dependencies: [common],
    components: [],
    registerCommands(gramlot) {
        const group = gramlot.commands.registerGroup("documenti", {});
        group.register("save", {label: "Save", publish: "save"});
    }
});
```

### Build map distinguishes outputs from existing packages

```json
{
    "output": "./src",
    "collections": [
        {
            "entry": "./ui/documenti/index.js",
            "pythonPackage": "acme.widgets.documenti"
        }
    ],
    "externals": [
        {
            "entry": "@acme/common/widgets",
            "pythonImport": "acme_common.widgets:mygramlot"
        }
    ]
}
```

collections retains the approved entries generated below output. externals is a
separate map of module entries to existing Python descriptor imports; it has no
output destination. pythonImport uses an exact module:attribute reference,
not an expression or an inferred distribution name. For the example this means
from acme_common.widgets import mygramlot. The target must be a GramlotCollection
descriptor, not a module, factory or alternate representation.

The build follows the JS dependencies graph, resolves common against externals
and emits only the local documenti package:

```python
from gramlot import GramlotCollection
from acme_common.widgets import mygramlot as common_gramlot

mygramlot = GramlotCollection(
    name="documenti",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(common_gramlot,),
)
```

The configuration does not repeat the documenti → common dependency edge. The
external row states where an already selected dependency lives. Mere presence
in externals does not activate a collection absent from the JS dependency graph.

### Ownership and activation

- Do not regenerate, copy or modify the external Python package, its grammar,
  command catalogue or browser assets. The generated local descriptor references
  its installed descriptor.
- The external descriptor supplies its own grammar/catalogue/module/CSS and
  dependencies. Page selection still resolves implicit base, common, documenti
  in dependency order with the confirmed deduplication and collision policy.
- Host integration serves the external descriptor's declared packaged assets;
  bootstrap must use its browser module rather than a private embedded copy in
  documenti. The emitted JS import specifier-to-host-URL mechanism remains an
  explicit open design step; externals alone does not implement browser linking.
- Reject unresolved JS modules, missing Python imports, wrong descriptor types,
  and ambiguous local/external ownership of the same entry. Apply existing
  collection identity rules; matching name strings alone does not establish
  artifact equivalence. The exact cross-language build-consistency check remains
  open, not silently replaced by a name-only comparison.
- The consuming application's Python distribution must declare its external
  package requirements through normal packaging. pythonImport is not a PyPI
  distribution name and does not install/download packages. JS build dependencies
  likewise belong to normal JS packaging. No first-party pins or lockfiles.
- A missing external mapping is a build error, never permission to vendor an
  external dependency into the local generated tree.

Registration, generation and deployment are distinct. This example verifies
configuration/code syntax only; the external packages were not installed or run.

<a id="gc-325-065"></a>
## 065 · Confirmed browser import linking

Owner agrees to review browser linking after accepting external Python references.
The owner then confirms with "ok" the generated specifier convention and
host-built import map below. This is approved design, not implemented behavior;
the illustrative URLs do not prescribe new core resource-host routes.

### Compile declared collection references to one symbolic form

The authored documenti module may import common from @acme/common/widgets, or
from a local ../common/index.js. The preparator resolves that module to the
declared dependency object and emits its collection import as:

```javascript
import {defineCollection} from "@gramlot/gramlot/components";
import common from "@gramlot/collections/common";
```

@gramlot/collections/<name> denotes the confirmed collection identity, not its
Python package or command namespace and not an npm package to install.
The exact name is escaped injectively when necessary; no name normalization or
fallback lookup is introduced. The user-authored source is not rewritten.
Only resolved collection dependencies are transformed this way; ordinary helper
imports remain part of that collection's packaged module graph.

This is the single generated form for both local and external collections.
Do not retain parallel fallback imports using original package specifiers.

### Host emits the page's import map before module execution

Illustrative URLs, not newly implemented core routes:

```json
{
    "imports": {
        "@gramlot/gramlot": "/app/_gramlot/runtime.js",
        "@gramlot/gramlot/page": "/app/_gramlot/runtime.js",
        "@gramlot/gramlot/components": "/app/_gramlot/components.js",
        "@gramlot/collections/common": "/app/_packages/acme_common/widgets/assets/index.js",
        "@gramlot/collections/documenti": "/app/_packages/acme/widgets/documenti/assets/index.js"
    }
}
```

The selected GramlotCollection descriptors and their resolved dependency graph
supply the collection entries. The host converts package-relative module paths
to URLs; the map includes only the selected graph, with implicit core entries.
There is no handwritten page import map and no browser request to npm/PyPI.

Keep the existing CSP nonce/escaping treatment. Emit the complete map before the
bootstrap module or collection imports run. Dynamic extension activation after
startup is outside this contract; do not invent late import-map mutation.

The @gramlot/gramlot/components entry must expose shared authoring primitives
including defineCollection. Source inspection shows the npm components export
exists, but the current core browser import map only includes the root/page
entries. A hosted shared components entry and correct shared-runtime linkage are
implementation gaps, not existing support or permission to bundle private core
copies into every extension.

### Module identity and activation

Use exactly the same resolved absolute URL for a collection in resources.collections
and in the import map, including any cache identity. This allows all imports to
refer to the same browser module instance within a page. No duplicate copies,
different per-import query strings or alternate URLs for the same selected artifact.

Bootstrap imports the selected modules, registers component classes through the
existing mechanism, constructs the page and invokes registerCommands in the
confirmed dependency-before-consumer order before app.start(). Importing a module
is not command registration: common may be imported by several consumers but
its hook is invoked once for this page registry. CSS resources follow descriptor
ordering and dependency order without copying an external package's files.

The import map is the generated bootstrap view of the selected graph; do not add
another hand-maintained dependency list or redundant Python descriptor imports
field. Existing name collisions fail before bootstrap is emitted.

### Explicit remaining gates

Asset URL/mount policy belongs to the host integration. Symbolic mappings do not
themselves implement package serving. External packages must already satisfy
the agreed generated-module contract; incompatible packages fail validation,
without consumer rewriting or regeneration. Exact JS/Python artifact consistency,
cache identity and allowed package-asset serving remain to settle.

Evidence: current Python/JS servers emit a nonce-bearing import map for the
root/page runtime names before bootstrap; PageBootstrap imports collection URLs.
Current code does not provide the proposed collection import-map entries,
dependency rewriting, commands hook or hosted components entry. Verification
here covers code/JSON syntax and cross-reference consistency, not a browser run.

<a id="gc-325-070"></a>
## 070 · Confirmed build correspondence principle

Owner, 2026-10-22: "ok", answering the proposal for a common build fingerprint
in the Python descriptor and browser JS module, checked at startup, with a clear
error blocking the page when they differ.

The generator must associate the descriptor and browser module from one build
with the same fingerprint. Startup compares the expected Python-side identity
with the loaded module's identity. A mismatch prevents page startup rather than
allowing grammar/metadata and runtime from different builds to be used together.
The diagnostic must identify the affected collection and the conflicting values.

This initial decision confirmed the correspondence check. The following design
questions were subsequently resolved by the approved scheme in §075; this list
records the questions addressed, not additional unresolved decisions:

- Fingerprint calculation and input coverage, including generated grammar,
  commands, JS/CSS/assets and the treatment of collection dependencies.
- Reproducibility rules and how to avoid a self-reference when embedding the
  fingerprint in a module that contributes to the fingerprint calculation.
- Descriptor/module/bootstrap field names and transport of the expected value.
- Exact check placement in startup, missing-fingerprint handling, and how to
  keep packaged resources internally consistent before serving them.
- Relationship to cache URLs and host resource delivery.

That initial approval did not select a checksum or metadata fields; §075 now
selects them. Existing first-party dependency policy stays unchanged.
This is a build-correspondence check, not a claim of API compatibility between
independently built dependencies. No runtime implementation or test is supplied
by this document update.

<a id="gc-325-075"></a>
## 075 · Confirmed fingerprint calculation and verification

Owner requests a concrete calculation/verification scheme, then replies "ok"
to the reviewed SHA-256, inventory, wrapper and validation proposal. This is
approved design; no runtime implementation or publication is authorized.

### Covered artifact

Use SHA-256 over the generated files owned by one collection: grammar, command
catalogue, emitted JavaScript, stylesheets and their packaged assets. Extend the
generated Python descriptor with build_id (sha256:<lowercase hex>) and files
(a sorted tuple of package-relative generated file paths). The existing descriptor
remains the resource map; no second manifest is introduced.

Include the collection name, relative grammar/commands/module references, ordered
CSS references, ordered direct dependency names and file inventory in the hash
input. Do not include timestamps, absolute build/install paths, host URLs or
dependency fingerprints. Dependencies remain independent selected artifacts and
are verified separately; this is not a version lock or an API compatibility
claim. A change to a dependency does not by itself invalidate the consumer's
own unchanged generated artifact.

All referenced local runtime assets must appear in files, including emitted
chunks and CSS resources. Validate relative package paths, uniqueness and full
declared-resource coverage. Do not hash Python interpreter files, arbitrary
package neighbours or build caches. The generated __init__.py descriptor is
represented by the listed resource/dependency metadata, not recursively hashed.
Its build_id is deliberately outside the hash input.

### Avoid self-reference in the JS entry

Generate assets/index.js as an exact wrapper, with no application logic:

```javascript
export {default} from "./collection.js";
export * from "./collection.js";
export const buildId = "sha256:<generated digest>";
```

assets/collection.js contains the generated collection implementation; any chunks
belong to files as well. Both wrapper and implementation are covered. For hashing
only, generate the wrapper from the same fixed template with __GRAMLOT_BUILD_ID__
in the string literal. Compute the digest and emit the final wrapper containing
it. Verification requires the installed wrapper to match the fixed template with
the descriptor's digest, then hashes the placeholder form. Do not search/replace
arbitrary source text or strip all buildId-like strings from other files.
The named-export line was approved on 2026-10-29 for issue #80. Prepared
collections using the earlier wrapper must be regenerated for this verifier.

### Deterministic input

Use a tagged, length-framed sequence of UTF-8 records:
tag, NUL, decimal byte length, NUL, payload bytes. Start with the literal
gramlot-build-v1 followed by NUL. Record scalar metadata in fixed order:
name, grammar, commands, module; then each css and dependency entry in declared
order. For every files path sorted by its UTF-8 bytes, append a path record and
a content record with the exact bytes (normalized wrapper as above).
Empty strings have length zero; missing fields are invalid, not alternate encodings.
The fields in this calculation are fixed by the algorithm version, not arbitrary
JSON object order. A file rename changes the digest even if bytes are unchanged.

Generated outputs must be reproducible for identical inputs: do not embed
timestamps/random IDs/absolute directories. Canonical JSON generation and output
toolchain behavior require corresponding implementation tests. This proposal
does not claim independent toolchains will emit identical bytes automatically.

### Verification stages

1. Preparation produces and validates the inventory, digest, descriptor and
   wrapper together. Do not publish partially assembled output.
2. The host checks the installed artifact against its descriptor before serving
   it or constructing Source with its metadata. This includes wrapper-template
   validation and digest recomputation; copying a digest string into inconsistent
   files is not sufficient. Cache successful checks only while those package
   bytes remain unchanged; development changes invalidate the check.
3. Bootstrap carries the expected name/buildId per selected module URL. After
   importing modules, compare their named buildId exports to the expected values
   for the entire selected graph, before component/command activation or app.start.
   Missing/malformed/mismatched fingerprints stop startup with the collection
   name and useful expected/received diagnostics.
4. The host's collection resource base URL includes the fingerprint as a path
   segment, so relative JS/CSS references share that versioned base. A URL for an
   old fingerprint must never serve new bytes. This is generated resource identity,
   not a package-version pin. Exact host route shape remains its responsibility.

No extra page-author configuration is required. Descriptor build_id, inventory
files, module buildId and bootstrap expectation are generated by the preparation/
host machinery. Emitted mapping values remain identical between import maps and
resources.collections. files is not blanket authorization to serve arbitrary
Python package files; host asset serving remains bounded to the declared assets.

The current bootstrap discards module namespaces after extracting default;
retaining buildId and checking all expectations before activation is new work.
No such check currently exists. Documentation verification uses a temporary
in-memory hash probe and syntax checks, not a framework/browser test.

<a id="gc-325-080"></a>
## 080 · Preparation CLI and output lifecycle

Owner "ok" (2026-10-23) confirms the command name, build/check verbs, --config
option/default and generated-output policy described below. This is design
approval, not implementation. Sections 085–090 and 130 subsequently settle
toolchain discovery/process responsibilities, exact protocol and exit codes.
Recovery policy is separately confirmed in §135; its implementation is pending.

### CLI ownership and commands

Read-only inspection finds the current gramlot executable declared by
gramlot-py-server/pyproject.toml and dispatched by gramlot_py_server/cli.py as
gramlot <environment> <verb>. Core currently declares no Python console script.
Do not register a competing gramlot executable or make core generation depend
on the server integration to obtain its launcher.

The approved independent preparation command is gramlot-builder, with two verbs:

```sh
gramlot-builder build
gramlot-builder check
gramlot-builder build --config ./tools/gramlot.build.json
```

This supersedes the older unapproved gramlot collection build sketch.
GC-225 records the owner's bounded naming decision, separately from the
environment-command convention. Existing server commands remain outside this change.

Both verbs default to gramlot.build.json in the invocation directory; --config
selects another file. Paths declared inside configuration resolve relative to
that file as already designed. output stays in configuration, not a competing
--out option. The first increment processes the complete configured collection
set and dependency graph; selective build, watch and automatic installation are
not implied.

The Python launcher belongs to core and invokes the JS preparation machinery for
the imported collection definitions. Building requires the JS toolchain and
resolvable declared dependencies; ordinary page consumption of prepared Python
packages does not invoke Node or the builder. Section 085 now settles the
distribution split; §§090/130 settle discovery/protocol. Missing prerequisites
produce a clear error; do not install/download or pin first-party dependencies.

### build

1. Resolve the selected local/external graph, destinations and owned command
   namespaces; validate definitions and all configured references.
2. Prepare complete candidate packages in temporary storage: grammar, catalogues,
   descriptors, linked modules/assets, inventories and fingerprints.
3. Validate every candidate and all existing destination ownership before writing
   project output. Definition/dependency/validation failures leave it untouched.
4. Update only recognized generated files. Unchanged bytes remain untouched.
   Remove obsolete files only when present in the previous generated inventory
   and still matching their recorded artifact; never delete a whole source tree
   or infer ownership from a .py/.js extension.
5. Report created/updated/unchanged packages and concrete failures. Packaging,
   installing, publishing and starting a server are separate operations.

A generated package's prior descriptor/inventory plus valid build fingerprint
establish which payload belongs to the previous build. The generated __init__.py
also requires exact generator-template validation; it is not authorized merely
by its filename. If existing owned output was edited or cannot be verified,
stop with paths and instructions to fix the source definition; do not overwrite.
A pre-existing unowned file at a candidate path is a conflict. Preserve unrelated
files and user-authored parent __init__.py files.

When a collection is removed from configuration, report its old output if known;
do not scan/delete arbitrary packages to infer removed ownership. Explicit removal
policy remains separate. No destructive clean or force override is introduced.

Temporary generation is not a promise of one filesystem transaction across
multiple output directories. Commit I/O failures require explicit recovery
reporting, retained prior content and implementation tests; do not claim complete
rollback unless tested. Source/configuration inputs are never generation targets.

### check

Regenerate candidates into temporary storage and compare them to the prepared
outputs, checking fingerprints, graph and resource completeness. Check is stale
when generated output differs or is absent, even if an old package is internally
consistent. It does not update project files or install dependencies. Temporary
files are cleaned up by the tool.

Exit codes confirmed in §130: 0 success (or current output for check), 1 stale/missing
generated output in check, 2 configuration/dependency/validation/build/I/O error.
Report affected collections and paths concisely; do not collapse all diagnostics
into a generic failure. No release qualification is implied by a successful check.

### Required implementation checks

Cover absent/unchanged/changed outputs, stale generated assets, manual edits,
unowned path collisions, incomplete external references, missing toolchain,
configuration-relative paths, check write-freedom and interrupted output updates.
Use local core-owned fixtures; tests must not depend on adapters or examples.
This document change verifies commands as design text only. No CLI was run,
installed or implemented.

<a id="gc-325-085"></a>

## 085 · Collection development toolchain

Owner, 2026-10-23: "Sì, confermo: comando Python in gramlot e generatore npm
separato, installato nel progetto solo per chi sviluppa le collezioni."
This confirms the preceding proposal, including the @gramlot/builder package
name. These are planned interfaces, not available commands or published packages.

### Distribution and responsibilities

- The Python gramlot package provides the gramlot-builder launcher.
- The separate npm package @gramlot/builder, maintained in the same core
  repository, provides the JavaScript generator and its build dependencies.
- Collection authors install the npm package in their project as a development
  dependency. Build tooling is not added to the browser runtime.
- The launcher uses Node and the generator installed in the project associated
  with the selected configuration. Missing prerequisites produce actionable
  installation instructions; execution does not download or install them.
- Consumers install the prepared Python collection package and use its descriptor
  and bundled resources. They need neither Node nor the generator.

Proposed-use example for the approved distribution (not executable today):

```sh
npm install --save-dev @gramlot/builder
gramlot-builder build
gramlot-builder check
```

The first-party dependency policy still applies: no version pin/cap or lockfile
freezing Genro/Gramlot dependencies. The example expresses the package role, not
authorization to add a lockfile or publish a package.

### Remaining design and verification

Sections 090/130 define project discovery, local generator resolution and the
exact process protocol/exit codes; §135 confirms interrupted-write recovery.
Section 140 now confirms the concrete generator entry/export, supported Node
lines and generation tooling; the earlier distribution decision alone did not.

Implementation checks must cover a project-local generator, missing prerequisites,
configuration outside the invocation directory, and consumption of a prepared
Python collection without invoking Node. All checks use core-owned fixtures.

<a id="gc-325-090"></a>

## 090 · Launcher/generator contract

Owner, 2026-10-23: "Sì, confermo questo contratto. Aggiorna il progetto e poi
vediamo come collegare le risorse al bootstrap." Approval covers the preceding
discovery, process communication and responsibility proposal.

### Project discovery

Start at the selected configuration's directory and ascend to the first
package.json. That directory is the JS project root. Paths inside the
configuration remain relative to the configuration file, not the project root
or invocation directory.

Use Node from the environment and resolve @gramlot/builder from that project,
including normal npm workspace dependency resolution. Do not fall back to a
globally installed generator or download missing prerequisites. Missing project,
Node or generator must yield actionable diagnostics.

### Process communication

Run one Node process per build/check invocation. Send a JSON request on standard
input, receive a JSON result on standard output, and reserve standard error for
diagnostics. The request carries the operation, configuration, temporary directory
and metadata of external Python collections. The result includes the generated
inventory and diagnostics.

The protocol has its own version, independent of Python/npm release numbers.
Reject incompatible protocols explicitly; equal package release numbers are not
required. Section 130 now fixes exact envelope fields and protocol version 1
with GC-225 naming approval. Section 140 now confirms the concrete generator
entry/export; implementation remains pending.

### Responsibilities

Python reads configuration and imports external Python descriptors, starts the
generator, validates candidates and existing output ownership, then performs
build updates or check comparisons. JavaScript loads JS definitions, resolves
dependencies and generates candidates in temporary storage. It does not directly
modify project outputs. Generator failure therefore leaves those outputs
untouched. Output-commit I/O recovery is separately confirmed in §135.

Required checks cover invocation-directory independence, nested configuration,
workspace dependencies, missing prerequisites, protocol incompatibility,
separation of JSON and diagnostics, generator failure before output updates,
and build/check responsibilities. No subprocess implementation is included in
this design update.

<a id="gc-325-095"></a>

## 095 · Collection resource bootstrap integration

Owner, 2026-10-23: "Sì, confermo: tema, collezioni e poi pagina. Aspettiamo i CSS
prima dell’avvio e blocchiamo se un caricamento fallisce. Aggiorna il progetto."
Confirms CSS ordering and stylesheet readiness/failure handling below. This
section connects those decisions and the already approved graph, import-map and
fingerprint contracts to the existing bootstrap. Section 100 now settles fields
and asset exposure; concrete routes and adapter APIs remain open. No resource
route or runtime is implemented.

Read-only evidence: GramlotServer currently loads application-level collection
grammars before Source execution and emits collection module URLs, page CSS/Logic
resources and a nonce-protected root/page import map. PageBootstrap imports
collection default exports and registers components before app.start(). It
currently appends CSS links without awaiting their load and does not validate
collection buildId or activate per-page command registries.

Integration flow (approved contracts with host/protocol details still open):

1. Resolve the page's implicit base and gramlots dependency graph once for that
   page, validating installed descriptors/resources and fingerprints. Use the
   same resolved graph for Python grammar loading and browser bootstrap.
2. The host exposes only declared browser assets from those installed packages,
   preserving relative asset paths under fingerprinted bases. Filesystem serving,
   route shape and mount prefixes belong to the integration. Core does not acquire
   a resource host or reinterpret css_requires/js_requires.
3. Emit the complete import map before module execution. Each collection module
   uses the same URL in the map and bootstrap, with expected identity/fingerprint;
   include the shared components entry already required by §065. No handwritten
   duplicate JS dependency list in page code.
4. Compose CSS in order: theme, collection dependencies before their dependents
   (each descriptor's declared CSS order), then page resources. Retain the existing
   one-URL/last-position deduplication rule.
5. Load modules and stylesheets, verify all collection module identities before
   component/command activation, then activate collections once in dependency
   order and register page Logic before app.start(). All declared stylesheet loads
   must also succeed before startup; this adds a load/error gate to current CSS
   handling. It is not a transactional rollback of module evaluation.
6. A missing asset, failed stylesheet/module load or identity mismatch blocks
   startup with collection/resource diagnostics and closes the server page through
   existing failure cleanup. No silently degraded startup.

CSS ordering and stylesheet readiness/failure policy are approved design.
Section 100 now settles bootstrap fields; concrete host routes/APIs remain to specify.
Existing accepted graph/import-map/fingerprint decisions do not need reconfirmation.
Implementation tests must cover shared dependencies, mount prefixes, relative
assets, CSS precedence/load errors, module mismatch and failure cleanup using
core-owned fixtures. Specifically verify that stylesheet insertion order remains
theme → collections → page regardless of completion order, app.start() waits for
every declared stylesheet, and a stylesheet load failure prevents app.start().
These are required future tests, not verification of an implemented runtime.

<a id="gc-325-100"></a>

## 100 · Bootstrap fields and packaged browser assets

Owner, 2026-10-23: "ok", answering "Confermi questi campi e questa modalità
di esposizione degli asset?" Confirms the record fields and descriptor-backed
asset exposure described below. Route examples remain illustrative; this is
approved design, not implemented bootstrap or adapter behavior.

### Wire shape

Retain PageBootstrap({config, resources}); config keeps its existing page/runtime
contract. Confirmed resources members:

| Field | Shape | Meaning |
| --- | --- | --- |
| css | string[] | Final ordered stylesheet URLs: theme, collections, page; existing deduplication applies. |
| js | {url: string, group: string or null}[] | Existing page Logic modules, not collection entry modules. |
| collections | {name: string, url: string, buildId: string}[] | Selected packaged extension modules in dependency order, including transitive extensions, each once. Empty when no extensions are selected. |
| serverAdapter | optional string | Existing transport adapter module URL; presence semantics unchanged. |

For every collection record, name is the confirmed collection identity, url is
its host-resolved browser entry, and buildId is the expected sha256:<64 hex>
fingerprint from the verified Python descriptor. Retain the module namespace
during import: compare its buildId and default collection's name before activating
any collection. These records replace the current string-array extension format;
no string/object compatibility branch is part of the agreed primary path.

Base Gramlot is already supplied by the runtime; the extension list does not load
a second copy. A collection with commands but no components still has a record.
CSS is emitted once in resources.css, not repeated inside collection records.
Dependencies are represented by the resolved ordered list and generated module
imports, not a second browser-authored graph. Grammar, command catalogues, Python
package names, filesystem paths and complete file inventories are not new
bootstrap fields.

Example resources fragment (all URLs illustrative; repeated a characters are a
syntactically shaped sample fingerprint, not a real build; config remains omitted):

```json
{
  "resources": {
    "css": [
      "/app/themes/gramlot-base/theme.css",
      "/app/gramlot/collections/documenti/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/assets/documenti.css",
      "/app/pages/editor.css"
    ],
    "js": [
      {
        "url": "/app/pages/editor.js",
        "group": null
      }
    ],
    "collections": [
      {
        "name": "documenti",
        "url": "/app/gramlot/collections/documenti/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/assets/index.js",
        "buildId": "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      }
    ]
  }
}
```

The corresponding import-map entry @gramlot/collections/documenti has exactly the
same resolved URL as resources.collections[0].url. The map remains an HTML
importmap script emitted before module execution, not another field inside
resources. Existing root/page mappings and the planned shared components mapping
remain required. Apply the mount prefix once, with current CSP nonce/JSON escaping.

### Host exposure of packaged assets

The integration takes verified descriptors from the selected page graph and maps
their packaged browser files to URLs. It does not import a Python package named
by an incoming URL. The lookup key is collection identity, build
fingerprint and package-relative asset path, resolved only against known verified
descriptors.

For the generated layout already specified in §045, expose only inventory-listed
files under assets/: entry, chunks, CSS and referenced images/fonts/other browser
assets. Do not expose generated __init__.py, grammar.json, commands.json or other
package files merely because they are installed. Check exact inventory membership
and containment in the package asset area; invalid paths, unknown identities or
fingerprints and non-exposed files fail with 404.

A possible route layout is:
<mount>/gramlot/collections/<encoded-name>/<digest>/assets/<relative-path>.
This is illustrative, not a prescribed cross-adapter route. The digest is the
hex part of build_id; collection-name escaping must preserve identity. Relative
JS/CSS URLs stay inside that fingerprinted asset tree. An unavailable old digest
must not resolve to newer bytes. The route never runs the builder or installs
anything.

The Python integration reads packaged resources through the package-resource
mechanism, independent of the process working directory, and owns HTTP GET/HEAD,
media types and mount-prefix routing. Core retains descriptor validation, graph
and bootstrap contracts; it gains no HTTP server or generalized resource host.
Do not reinterpret js_requires/css_requires. The inspected Uvicorn integration
already has asset response handling, but automatic collection exposure is absent;
that is connected integration work, not a capability claimed by this design.

No new adapter method names, caching policy or asset retention period are settled
here. Required implementation checks: metadata/URL consistency, module-name and
buildId mismatch before activation, transitive/shared extensions, commands-only
collections, no-extension pages, relative chunks/CSS assets, mount prefixes,
inventory exclusion, invalid paths and old fingerprints, plus approved CSS gates.

<a id="gc-325-105"></a>

## 105 · Python adapter resource APIs

Owner, 2026-10-23: "Sì, confermo. Ora vediamo come popolare il registro in tutti
i processi del server senza dover ripetere le dichiarazioni di Page.gramlots."
Confirms the preceding API and responsibility proposal. The later confirmation
recorded in §110 also settles the registration lifecycle.
Read-only inspection finds per-adapter asset response
handling in gramlot-py-server, but no common collection-resource service. The
core already separates resource resolution from HTTP handling through
GramlotServer.resolve_resources and runtime_asset/theme_file responsibilities.
This approved design changes no runtime or integration code.

### Shared integration service

GramlotCollectionResources belongs in gramlot-py-server, shared by its Python
adapters. It owns the verified descriptor-to-browser-resource mapping, not page
grammar, command activation or an HTTP engine. Core must not import this concrete
service.

The following are approved design signatures, not yet importable APIs:

```python
class GramlotCollectionResources:
    def __init__(self, *, base_url: str):
        ...

    def register(self, collections) -> None:
        ...

    def url(self, collection, path: str) -> str:
        ...

    def asset(self, name: str, build_id: str, path: str):
        ...
```

- base_url is the mount-relative, root-relative collection route base, for example
  "/gramlot/collections"; the adapter mounts the route and the existing bootstrap
  prefix handling adds the deployment prefix exactly once.
- register receives the resolved collection descriptor sequence, including
  dependencies. Validate resources/fingerprints and register only verified
  descriptors. Repeated registration of the same collection is idempotent;
  conflicting collection identities fail under the already approved rules.
  Registration does not publish commands or construct a page.
- url requires a registered descriptor and an inventory-listed browser asset
  path, such as collection.module or one of collection.css. Return a root-relative
  URL without the mount prefix, under base_url with collection identity, digest
  and package-relative assets/ path. Invalid/unregistered input is a configuration
  error, not a fallback. Preserve injective name encoding and relative asset paths.
- asset receives the logical name, full build_id ("sha256:<hex>") and a decoded,
  package-relative path, for example "assets/index.js". Return the verified
  package-resource Traversable, or None for unknown/non-exposed/nonmatching
  resources. Reuse the §100 inventory/containment/fingerprint rules; never import
  a package from an incoming name. The HTTP layer parses the route and decodes
  once before this call. Returning a Traversable does not require a permanent
  filesystem Path.

### Core-facing URL hook

The approved neutral GramlotServer hook is:

```python
def collection_url(self, collection, path: str) -> str:
    ...
```

The integration implements this hook by calling its shared service's url method.
Core uses it to form collection entry records, the generated import map and CSS
URLs from the same selected graph. Existing mount-prefix/CSP rules remain in core
bootstrap composition. No integration module import or collection file-serving
route is added to core. A core server without this capability must report the
missing integration when an extension needs an asset URL; it must not invent a
route. No permissive method-presence probes or legacy-shape fallback are proposed.

### HTTP responsibilities

Each adapter dispatches its mounted collection route to asset. None maps to 404;
a resource is streamed/read through its package-resource interface. The adapter
owns GET/HEAD, media types and framework responses. Unsupported methods produce
405 with GET/HEAD in Allow. It must not pass an arbitrary Traversable to a
framework API that only accepts filesystem paths. Protocol errors/internal I/O
failures must not be swallowed as successful resource responses.

### Registration lifecycle

Section 110 now settles how the host obtains permitted descriptors: enumerate
trusted page classes before each process accepts requests and resolve their
Page.gramlots. No second handwritten collection list is introduced. Lazy
registration when a page opens cannot alone support multi-process hosting;
an asset request may reach another process. Do not assume worker affinity or
introduce import-by-URL. Per-page selection/activation remains distinct from
application asset availability.

Required future checks: same mapping across adapters, duplicate/conflicting
registration, registered-only URL creation, mount applied once, inventory/path
rejection, package resources without filesystem paths, GET/HEAD/405/404 and
multi-process initialization. No API or behavior is claimed implemented.

<a id="gc-325-110"></a>

## 110 · Registry initialization in every Python process

Owner, 2026-10-23: "Sì, confermo: ricaviamo il registro dalle pagine all’avvio e
lo manteniamo fisso per la durata del processo. Aggiorna il progetto e dimmi cosa
resta da definire prima di implementare." Confirms the preceding page-catalogue
initialization proposal, including earlier module imports and the fixed registry.
Current GramlotFileServer resolves/imports a page lazily and has no
page-class enumeration hook; Uvicorn startup currently acknowledges readiness
without constructing a collection resource catalogue. Source inspection is not
implementation evidence for the approved design below.

### One source of declarations

The neutral provider hook is GramlotServer.iter_page_classes(), returning
an iterable of all trusted page classes the application serves. GramlotFileServer
would implement it from its configured page directory using the same routing,
containment, precedence and loading rules as resolve_page. Other page providers
implement the same hook from their existing page/route catalogue. Do not scan
arbitrary installed packages, parse Page.gramlots with AST heuristics or introduce
a separate handwritten list of collection descriptors.

The provider must enumerate its page classes, including classes serving dynamic
URLs. Identifying filesystem page modules rather than helper modules and custom
provider enumeration require implementation contracts; they are not a license
to import arbitrary files. Imports execute module-level Python code, so this
changes when that trusted code runs. No page instance, main/Source method,
resolver or RPC endpoint is executed merely to discover a declaration.

### Per-process initialization

Before the process serves page or collection-asset requests:

1. Obtain the trusted page-class catalogue in deterministic order.
2. Read each page's effective gramlots using the already agreed inheritance/base
   rules; resolve all transitive dependencies with the shared collection rules.
3. Validate the union, deduplicate identical collections and reject identity or
   fingerprint conflicts. Call GramlotCollectionResources.register with the
   resolved descriptors; build in isolation from request handling.
4. Mark the application ready only after the complete catalogue is verified.
   Errors identify the offending page/collection and prevent readiness; do not
   expose a partly initialized registry.

Each serving process performs this initialization from the same deployment's
code/packages. There is no cross-process registration message, database, worker
affinity requirement or first-page side effect. A new process may serve an asset
as its first request. The asset catalogue is an application-wide availability
set; each page still includes/activates only its own selected dependency graph.

Adapters place preparation in their application lifecycle before accepting
requests. Exact startup entry points vary with their framework; for Uvicorn,
successful lifespan startup must follow preparation. No constructor/startup
method names besides the provider hook are chosen here.

### Lifetime and limits

The catalogue is fixed for the lifetime of the serving process. Changes to
page classes, Page.gramlots, selected dependency sets or collection build
fingerprints require coordinated restart/reinitialization before serving the
new deployment. Development page reload must not silently append an unregistered
collection; report the need to restart. No hot registry mutation, source watcher
or fallback import on an asset request is introduced.

This assumes the processes have the same deployed inputs and declarations are
deterministic. It does not solve cross-version rolling deployments, asset
retention or synchronization of application Data. Newly introduced dynamic page
classes require catalogue refresh/restart under this first contract; a provider
that cannot enumerate its class set has an explicit unsupported capability,
not permission to lazily expose unknown collections.

### Verification and tradeoff

Tests must compare independently initialized processes, serve an asset before
opening a page, verify inheritance/transitive deduplication, detect conflicting
declarations and fail readiness on an invalid page/package. Verify collection
availability does not activate all collections on every page and that discovery
does not invoke page methods. Development declaration/build changes must be
reported instead of mutating the active catalogue.

Startup imports and validation cost move to process initialization and may make
errors in an otherwise unused page visible earlier. No time estimate is claimed;
measure on the supported page catalogue during implementation. The fixed-catalogue
policy, enumeration hook and earlier imports are approved design, not implemented
behavior. Detailed page-file discovery remains to specify.

<a id="gc-325-115"></a>

## 115 · Current readiness and remaining implementation prerequisites

Current review, 2026-10-23. Later confirmations supersede earlier dated open-point
statements. This is design status, not implementation or release qualification.

### Settled design

- JS definitions, command registration, page-local activation, collection identity,
  namespaces and dependency graph (§040).
- Generated Python packages/catalogues, local/external mapping, shared browser
  imports and fingerprints (§045–075).
- Python CLI, separate npm development package, project discovery and process
  responsibilities (§080–090).
- CSS readiness/order, bootstrap fields, adapter APIs and fixed per-process
  registry derived from page classes (§095–110).
- Page discovery, JS css/assets declarations, exact protocol/exit codes and
  replacement recovery (§120–135).
- Concrete generator entry @gramlot/builder/cli, Node 22/24/26 and esbuild (§140).

These decisions need no renewed approval. They do not establish implemented or
verified runtime behavior. Uvicorn is now the owner's selected first integration
to design, rather than an unresolved adapter choice.

### Approved scope and next phase

Owner confirmation of §145 settles the bounded first increment: shared core/
generator work plus startup, collection resource serving and bootstrap wiring
in gramlot-py-server's Uvicorn adapter. No product decision remains open for this
increment under the agreed contracts. The next phase is implementation and its
regression/end-to-end verification; it has not started. Do not reopen accepted
contracts merely because their code is absent. Approval of the design/scope is
not evidence of implemented or accepted runtime behavior.

Journal encoding/layout, locking primitives, replacement temporaries, filenames
within the agreed generated structure and test organization are engineering work
under the accepted contracts. They need no separate product-approval rounds.
Verify filesystem guarantees and report gaps before weakening recovery behavior.
New exposed names follow GC-225; do not add alternate paths or consumer workarounds.

### Separate or deferred work

Other adapters, cache optimization, old-build retention/rolling deployment and
whole-collection cleanup are outside this first proposed increment. Old hashes
must never serve new bytes; no clean/force or hot registry path is implied.
Menu/toolbar/window interaction remains separate in GC-335 §085: instance command
arguments/overrides, unknown commands, resolver projection/refresh/error handling,
focus/submenus, frame regions, rich bars and window close/maximize behavior.
Localization and parameter-form metadata remain outside the command catalogue.

### Verification once code exists

Core-owned fixtures cover descriptors, graph conflicts, grammars/catalogues,
fingerprints, shared imports, CSS gates and isolated activation. Generator tests
cover the supported Node lines, installed externals, source assets, protocol
failures, unchanged output and recovery fault injection. Integration tests cover
independent startup, asset-first requests, mount prefixes, packaged resources,
containment and HTTP semantics. Core tests do not depend on adapters/examples;
checks live in the repository owning the behavior. Extended release qualification
remains a release gate, not a test repeated for documentation changes.

<a id="gc-325-120"></a>

## 120 · Python page discovery rules

Owner, 2026-10-23: "Sì, confermo questo criterio, compresa l’importazione dei
moduli candidati. Aggiorna il progetto e poi vediamo come dichiarare CSS e altri
asset nella collezione JS." Confirms the discovery contract below; no algorithm
is implemented by this documentation update.

### File-backed provider

Use only the configured pages directory and Python files reachable under the
existing GramlotFileServer routing rules. Reuse locate_page/resolve_page path
syntax, real-path containment, reserved _aux suffix and file-before-folder
precedence. Do not invent a new filename prefix, page marker, decorator or a
second manually maintained page/collection list.

Enumerate candidate logical paths in deterministic lexicographic order by their
relative slash-separated spelling. Use the existing loader and deduplicate real
file paths during enumeration, so route aliases do not reload the same file.
Reuse route containment rules for links and avoid directory traversal cycles;
never broaden discovery to arbitrary installed packages or paths outside the
configured pages directory. Python helpers outside this area are imported only
through ordinary trusted Python imports.

Inspect the imported candidate's Page export:

| Export | Discovery result |
| --- | --- |
| No Page export | Support module; no page class is yielded. |
| Page is exactly the gramlot.Page base class | Support module importing the base; no page class is yielded. |
| Page is a class inheriting from gramlot.Page and is not the base itself | Yield the page class. A valid re-export follows the same rule. |
| Page exists but is any other value, including None or a non-Page class | Configuration error with the module path; fail startup. |

Deduplicate repeated occurrences of the same class object in the yielded
catalogue; collection identity/dependency deduplication remains the separate
approved graph step. Do not infer class equivalence from class names.

If importing any candidate fails, fail initialization with its path and original
cause. Do not treat an import error as proof that a file is a helper or silently
skip it. No class instance, main/Source method, resolver or endpoint is invoked.

The new enumeration filter does not change direct route handling: requesting a
module without a valid page still fails under the existing page contract.
The filename-to-route behavior is preserved; this proposal defines catalogue
classification, not a compatibility layer or a new route alias.

### Import cost and non-file providers

All route-eligible Python candidates must be imported to inspect their exports,
including helpers located among pages. Module-level code therefore executes
during startup, not just for files ultimately recognized as pages. This is a
real consequence of avoiding a second declaration/filename marker, explicitly
approved by the owner. There is no AST-based interpretation of
Python class or gramlots expressions.

A non-file provider implements the approved iter_page_classes hook from its
trusted route/page catalogue and yields the same valid Page subclasses in a
deterministic order. Dynamic URLs need no enumeration of every URL: enumerate
their possible page classes. If the provider cannot enumerate that set, report
the capability gap before serving rather than discovering resource ownership
from incoming requests.

### Required implementation checks

Cover nested file/folder routes and precedence, route aliases, valid re-exports,
helper modules, base-class-only imports, invalid Page values, candidate import
errors, stable ordering and containment/link cycles. Verify helpers outside the
page root are not scanned and that page methods are not invoked. Non-file
provider fixtures cover deterministic class catalogues and dynamic URL families.
These checks are planned, not executed runtime tests.

<a id="gc-325-125"></a>

## 125 · CSS and named asset declarations in JavaScript

Owner, 2026-10-23: "Bene, torniamo alle collezioni: confermo css e assets nella
definizione JS. Aggiorna il progetto e poi vediamo il protocollo del generatore."
Confirms the preceding declaration/behavior proposal. Current
defineCollection/ComponentCollection accepts
name and components; source CSS/asset metadata is not implemented. The generated
Python descriptor already has an approved ordered css field and file inventory.
This approved design defines its authored inputs without duplicating Python declarations.

### Collection declaration

```javascript
import {defineCollection} from "@gramlot/gramlot/components";

const documenti = defineCollection({
    name: "documenti",
    components: [],
    css: [
        new URL("./styles/base.css", import.meta.url),
        new URL("./styles/documenti.css", import.meta.url),
    ],
    assets: {
        logo: new URL("./images/logo.svg", import.meta.url),
        template: new URL("./templates/document.html", import.meta.url),
    },
});

export default documenti;
```

Confirmed fields:

- css: an ordered array of URL objects identifying stylesheet entry files.
- assets: a map of collection-local names to URL objects for resources referenced
  by JavaScript, such as images, templates or other browser-readable files.

Both fields may be omitted for collections without those resources. An omitted
css/assets field means no explicit entries. Use one input representation: URL
objects; relative paths are resolved through new URL(..., import.meta.url), not
against the invocation directory. No string-path alias or URL factory callback
is introduced by this proposal.

Existing components, dependencies and registerCommands declarations keep their
contracts. The resource fields are static collection metadata, not page Data,
resource-server URLs or commands.

### CSS entry points versus referenced resources

The order of css becomes the generated descriptor's css order and therefore
participates in the approved theme → dependency collections → page load order.
Only declared stylesheet entry points are added to the automatic stylesheet list.
The builder follows their local @import and url(...) references recursively,
includes reachable local stylesheets/fonts/images, and preserves or rewrites
relative references so they resolve to the packaged files. Do not turn every
transitively imported CSS file into an extra top-level stylesheet.

For example, a font referenced by a declared CSS entry needs no second assets
entry merely to ship it. Explicitly naming that same file in assets is useful
only if JS also needs a named URL. Repeated references to the same resource do
not require duplicate physical copies; different resources must not collide
because they share a basename. Ordering/cascade must not change during packaging.

The initial contract concerns packaged local files. There are no automatic
network downloads during generation. CDN/host-root resource references are
outside this source-input contract; their policy must be specified
separately if needed. Inline CSS data/fragment references do not themselves
declare files to copy.

### Named runtime access and generated output

A named asset is accessible through the collection, for example
documenti.assets.logo.href. The generated JS exposes URLs relative to the
generated module, rewritten by the builder from source coordinates to packaged
coordinates. Source file: URLs must never leak into the browser build.
assets entries are packaged and made available, not automatically fetched,
applied as CSS or executed as modules. The consumer chooses when to use them.

The builder derives Python css entries, module/resource paths, the complete
files inventory and fingerprints from these inputs and the module graph.
No handwritten Python asset catalogue or extra bootstrap asset map is added.
All shipped browser resources remain under the approved assets/ area and are
subject to the same inventory/host allowlist.

Missing local files or unsupported/unresolved references produce build
diagnostics before project output replacement. The exact emitted filenames,
bundler choice, resource graph implementation and machine protocol remain
engineering/specification work under §115; this declaration proposal does not
claim a particular bundler or an automatic stylesheet facility already exists.
Named Python access to individual assets is not introduced here.

Required future checks: declaration-relative resolution independent of cwd,
ordered CSS entries, recursive local CSS dependencies, named asset URL rewriting,
shared-reference deduplication and same-basename distinction, commands-only
collections with resources, absent optional fields, missing files and absence
of source filesystem URLs from emitted browser artifacts.

<a id="gc-325-130"></a>

## 130 · Generator process protocol

Owner confirmation, 2026-10-23: "Sì, confermo il protocollo e i codici di uscita.
Aggiorna il progetto e poi vediamo come gestire un errore durante la sostituzione
degli output." Confirms the complete protocol below, including version/schema,
diagnostics and exits. This settles §090; examples remain illustrative and no
runtime implementation or output-recovery policy is approved by this decision.

### Framing and version

One invocation sends exactly one UTF-8 JSON object on stdin, then closes stdin.
The generator emits exactly one JSON result object on stdout after generation.
Whitespace around the JSON is allowed; logs/progress belong on stderr. No
line-delimited event stream, multiple responses or request ID is needed for
this one-operation process. Stray stdout text invalidates the result.

protocolVersion is the integer 1. Compatibility requires the exact same protocol
version, independent of Python/npm release versions. Missing/malformed messages,
unknown fields or incompatible versions are errors, without coercion or alternate
representations. Message structure changes require a protocol revision.
The JSON encodes data, not executable Python references or live JS objects.

### Request fields

All top-level request fields below are required:

| Field | Type | Meaning |
| --- | --- | --- |
| protocolVersion | integer | 1 |
| operation | string | build or check |
| configPath | string | Absolute path of the selected configuration; base for its relative paths and diagnostics. |
| projectRoot | string | Absolute root already found by the approved nearest-package.json rule. |
| stagingDirectory | string | Absolute isolated candidate directory created by Python. |
| config | object | The configuration already parsed/validated by Python, using §055/060 fields; the generator does not reread a competing config snapshot. |
| externals | array | Verified metadata for configured external collections; empty when there are none. |

Each externals item has exactly entry, pythonImport, name, buildId and dependencies.
entry and pythonImport reuse the configured external mapping; name/buildId come
from its verified installed descriptor; dependencies is an array of collection
names from descriptor references. These are derived transport metadata, not
another authored dependency list or a Python import path invented from name.
Include the needed configured external mappings and validate graph consistency;
do not guess missing external entries or copy external packages into staging.

build and check run identical candidate generation. The operation may identify
diagnostics but does not authorize JS to inspect/update final output ownership or
declare that a check is current. Source/config paths are never output targets.

### Result fields and staged packages

Success has exactly protocolVersion, status ("ok"), collections and diagnostics.
Each collections item has exactly name, pythonPackage, buildId, grammar, commands,
module, css, dependencies and files. These represent the generated descriptor:
resource paths/files are package-relative, css retains declared ordering,
dependencies contains collection names and files is the §075 fingerprint inventory.
The package directory within stagingDirectory is derived from pythonPackage
segments. No arbitrary destination supplied in a response is accepted.

The generated package initializer is also present at that derived location.
It is validated against the generator template and structured metadata under
§080; it is not added to the self-referential fingerprint inventory. Python
validates files, paths, metadata and fingerprint, reconstructs descriptor imports
from the approved mapping and compares the initializer to that template without
executing generated Python. Only validated candidate outputs may be committed.
The response metadata is transient protocol data, not a second on-disk manifest.

Error has exactly protocolVersion, status ("error") and diagnostics. It contains
at least one error diagnostic and no candidate collections that a caller could
mistake for committable output. Temporary files from failed generation are
unusable candidates; final project output remains untouched.

### Diagnostics and exits

A diagnostic requires level ("warning" or "error"), code and message; optional
collection and path identify context. code is an uppercase underscore-separated
machine identifier; message is readable text, not a field callers must parse.
ASSET_NOT_FOUND illustrates the convention; the full diagnostic-code catalogue
belongs to implementation. Success has no error diagnostics; error has at least
one. Progress on stderr does not replace structured outcome diagnostics.

The generator process exits 0 only for a successful result and 2 for failure.
Python accepts a success only when both JSON and process status agree. Crash,
signal, malformed/truncated JSON, incompatible protocol or contradictory status
is a launcher error; never salvage partial output.

The gramlot-builder CLI exits 0 after a successful build or an up-to-date check,
1 only when check finds absent/different generated output, and 2 for any
configuration, dependency, generation, validation or I/O error. JS does not
return check's freshness exit code: comparison belongs to Python.

### Request example

```json
{
  "protocolVersion": 1,
  "operation": "build",
  "configPath": "/project/gramlot.build.json",
  "projectRoot": "/project",
  "stagingDirectory": "/tmp/gramlot-build-example",
  "config": {
    "output": "./src",
    "collections": [
      {
        "entry": "./ui/documenti/index.js",
        "pythonPackage": "acme.widgets.documenti"
      }
    ]
  },
  "externals": []
}
```

### Success example

The digest is illustrative, not calculated for these sample paths.

```json
{
  "protocolVersion": 1,
  "status": "ok",
  "collections": [
    {
      "name": "documenti",
      "pythonPackage": "acme.widgets.documenti",
      "buildId": "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "grammar": "grammar.json",
      "commands": "commands.json",
      "module": "assets/index.js",
      "css": [
        "assets/documenti.css"
      ],
      "dependencies": [],
      "files": [
        "assets/collection.js",
        "assets/documenti.css",
        "assets/index.js",
        "commands.json",
        "grammar.json"
      ]
    }
  ],
  "diagnostics": []
}
```

### Error example

```json
{
  "protocolVersion": 1,
  "status": "error",
  "diagnostics": [
    {
      "level": "error",
      "code": "ASSET_NOT_FOUND",
      "message": "Declared stylesheet does not exist.",
      "collection": "documenti",
      "path": "/project/ui/documenti/styles/documenti.css"
    }
  ]
}
```

### Remaining implementation boundaries

Section 140 now settles Node support and concrete toolchain/export entry;
§135 settles recovery. This protocol by itself does not pick a bundler or promise
cross-directory atomicity. Required tests cover exact versions/schema, log
separation, inherited config-relative paths, empty/external graphs, error
diagnostics, process/result disagreement, unsafe response paths, initializer/
fingerprint verification and Python-owned check freshness. No runtime test has
run for this design contract.

<a id="gc-325-135"></a>

## 135 · Recovery from output replacement failure

Owner confirmation, 2026-10-23: "Sì, confermo questa politica di recupero.
Aggiorna il progetto e dimmi cosa resta da definire prima di implementare."
The recovery policy below is approved design; implementation remains pending.
Python owns the lifecycle. No JS protocol change, new CLI verb or force option.

### Prepare before replacing

After candidate and destination-ownership validation, prepare one recovery record
for the entire build, not a separate success decision per collection. Preserve
verified copies of every old file to be replaced/deleted, including generated
initializers. Record previously absent paths, expected old/new content digests
and the complete operation list. Backups are independent copies, not hard links.
Unchanged and unrelated files remain untouched under §080.

Keep recovery data in a persistent tool-owned transaction area associated with
the output location, discoverable by later invocations rather than relying on an
automatically deleted temporary directory. Validate its ownership and containment;
do not overwrite an unrelated existing path to create it. The on-disk layout is
an internal implementation detail, not a second collection manifest or public API.

Prepare replacement files on the destination filesystem before changing outputs.
Verify backups and persist recovery instructions before any mutation. Failure
here leaves generated output unchanged. Serialize builder mutations for affected
output locations, including overlapping destinations from different configs;
fail clearly if another builder owns them. Recheck expected file state before
mutation. This does not promise to lock editors or arbitrary external writers.

### Commit and caught failure

Replace each changed file atomically on its own filesystem. Journal intended
operations before execution, so recovery does not rely only on a completion
record that might be missing after a crash. New files and obsolete owned files
are included in this record. There is no global atomic rename across packages.

After all operations, verify the complete installed candidate and persist a
commit-complete marker before discarding backups. Readers must not use the
output during replacement/recovery; this is build preparation, not live deployment.

If replacement or final verification fails before commit completion, stop and
attempt to restore the whole build's previous state, in reverse operation order:
restore replaced/deleted files and remove newly created files only when their
current state matches this transaction's recorded result. A path already in its
old state needs no write. Verify restoration before declaring rollback complete.
Empty directories created by this transaction may be removed only if still empty;
never recursively remove a package directory.

Restoration failures or content conflicting with both recorded states stop the
affected recovery action. Preserve that file and all remaining recovery evidence;
report restored, unresolved and conflicting paths plus the backup location.
Never overwrite a subsequent independent edit or infer success from partial
rollback. A caught build failure returns exit 2 even if restoration succeeds.
Cleanup failure after a durable commit does not undo the verified new output:
report that output is committed, retain remaining cleanup evidence and return 2.

### Interrupted process and next invocation

A killed process cannot necessarily return an exit code or run rollback. On the
next invocation, inspect persistent recovery evidence before generating candidates
or trusting the current package descriptor, which may be only partly updated.

- build, with the same verified output mapping, first resumes rollback of an
  incomplete transaction. Recovery is repeatable after another interruption.
  Report its outcome and exit 2; require an explicit second build invocation
  before starting a fresh generation. If the commit-complete marker is valid,
  verify committed output and finish only leftover transaction cleanup instead.
- check reports the outstanding transaction and exits 2, without changing project
  output, backups or the recovery record. It must not return stale-output code 1
  for an unresolved interrupted update.
- Missing/corrupt backup data, conflicting file contents or an incompatible
  destination mapping block automatic recovery. Keep evidence, list exact paths
  and explain the required manual resolution. Do not guess ownership or introduce
  a clean/force escape hatch. No candidate promotion from partial output.

An incomplete transaction always restores the previous build, even if all new
bytes happened to be written before the process died without a commit marker.
A completed transaction never falls back to old bytes merely because backup
cleanup was interrupted. No automatic builder restart or server restart is added.

### Verification and limits

Future fault-injection tests must cover preparation failure, interruption before/
after each mutation and journal transition, obsolete-file deletion, new outputs,
initializer changes, multi-collection rollback, rollback failure/retry, external
edits, corrupt evidence, overlapping builders, unchanged-file preservation,
commit-marker/cleanup interruption and check write-freedom. Verify actual bytes
and inventories after recovery, not only diagnostics or return codes.

The implementation must document and test filesystem durability/atomic-replace
support; backup/journal ordering must use the required persistence operations.
This design does not promise recovery from disk loss, corrupted backups or
unsupported storage semantics, or visibility of an atomic whole-build switch.
No recovery behavior has been implemented or tested by this documentation update.

<a id="gc-325-140"></a>

## 140 · Concrete generator entry and toolchain

Owner, 2026-10-23: "Bene, torniamo al generatore: confermo punto d’ingresso,
versioni Node ed esbuild. Aggiorna il progetto e poi definiamo la prima
integrazione con Uvicorn." Confirms the preceding concrete toolchain proposal.
Design approval only; no implementation or publication is authorized.

### Stable package entry

The separate npm package exposes this ESM entry:

```json
{
  "name": "@gramlot/builder",
  "type": "module",
  "exports": {
    "./cli": "./src/cli.js"
  }
}
```

The stable contract is @gramlot/builder/cli. src/cli.js is the initial internal
mapping, not a path hard-coded by Python. This is the process-protocol entry,
not a second user-facing npm command or a new in-process JS generation API.

Users retain gramlot-builder build/check. Python starts one Node process; its
bootstrap resolves the explicit package export from the discovered project
(using ordinary workspace resolution) and loads it. Resolution does not consume
the JSON stdin request. No separate Node discovery subprocess, global fallback
or automatic installation is introduced. The entry implements §130 unchanged:
one request/result, stderr diagnostics, Node 0/2 exits, isolated staged writes.
Python alone validates, checks freshness and commits or recovers output under §080/135.

### Supported Node lines

Support Node 22.x, 24.x and 26.x; Node 24 is the recommended collection-development
line in this decision. Verify all three on their latest available patches. New
major lines require qualification before joining the supported set; unsupported
lines produce an actionable launcher error (exit 2). This is the generator's
support policy, not a new restriction on already released runtime packages.
Prepared Python collection consumers do not need Node or the generator.

Do not pin/cap first-party Genro/Gramlot dependencies. Selection of third-party
esbuild dependency versions follows the repository's third-party policy and
implementation qualification; this approval does not select an exact release.

### JS, CSS and resources

Use esbuild for browser ESM generation with target es2022, consistent with the
existing core build. A Gramlot linking pass maps collection dependencies to the
approved @gramlot/collections/<name> specifiers and preserves shared Gramlot entry
imports; it must not bundle another private copy of core into each collection.

Use esbuild for declared CSS entry points in their agreed order, processing local
@import and url() references. Configure file loaders/copying for images, fonts
and other resources so they remain separate packaged files with rewritten URLs.
Named assets are copied and exposed through the generated collection references,
without automatic execution/loading. Resource identity/containment and ordering
remain the §125 contract; esbuild defaults do not override it.

The Gramlot exporter reads the approved collection metadata, coordinates resource
mapping/URL relocation, exports grammar and commands, and produces Python package
descriptors, inventories and fingerprints. esbuild does not itself understand
defineCollection, Page.gramlots or Gramlot dependency identity. The implementation
must supply and test that linking/export layer, including new URL references
relative to their declaring source module and emitted browser module.

All generation targets staging. Python's validation and replacement policy is
unchanged. No bundler configuration, file-copy pass or generated helper may bypass
shared-runtime identity or invent alternate declaration forms.

### Evidence and required verification

Read-only inspection: js/package.json already declares esbuild and Node >=22;
js/scripts/build-runtime.mjs already builds ESM/es2022 artifacts. This establishes
reuse potential, not an existing collection generator. Official esbuild references:
[CSS and resource loaders](https://esbuild.github.io/content-types/#css),
[build/plugin API](https://esbuild.github.io/plugins/).

Required checks: project-local/workspace entry resolution, unsupported/missing
Node, each supported Node line, strict stdout protocol, CSS order/imports/URLs,
named assets, external collection references, no private core copy, reproducible
outputs for identical supported inputs/toolchain, fingerprints and build/check
behavior. No generator implementation or runtime verification is claimed here.

<a id="gc-325-145"></a>

## 145 · First integration with Uvicorn

Owner, 2026-10-23: "ok", replying to "Confermi questo perimetro e il comportamento
proposto?" after the concrete Uvicorn proposal. Confirms the bounded core/generator/
Python adapter scope and behavior below. Design/scope approval is recorded; the
implementation phase and its verification have not started. Publication remains
separate and unauthorized.

### Existing integration evidence

Read-only inspection of gramlot-py-server/src/gramlot_py_server/uvicorn.py finds
Application/create_application/serve, a lifespan startup/shutdown handler,
mount_path handling, GET/HEAD resource dispatch and the integration-owned HTTP
response helper. Application currently constructs GramlotFileServer; startup
currently reports completion without the proposed page-derived catalogue scan.
The new registration/resource behavior is absent. Existing assets dispatch expects
filesystem Paths, so it cannot stand in for the approved Traversable service.

### Bounded implementation scope

Core owns collection descriptors/grammar/catalogue activation, page discovery
contracts, neutral resource URL hooks, bootstrap/import-map identity and CSS gates.
It also owns the Python launcher and separate npm generator in §140. Implement
these approved dependencies as part of the end-to-end increment; do not assume
they already exist or reproduce them in the adapter.

gramlot-py-server owns the shared GramlotCollectionResources service and the
Uvicorn wiring. Other adapters are not modified in this increment. A small trusted
Python test page imports a generated mygramlot and declares gramlots = [mygramlot];
the base remains implicit. Neither create_application nor deployment configuration
requires another authored list of that page's collections.

### Startup and serving

1. During ASGI lifespan startup, enumerate trusted page classes, derive the full
   effective collection/dependency union and verify/register packaged artifacts.
   Do not call page methods, execute the generator or wait for a first page visit.
2. Report startup completion only after the fixed catalogue is ready. On failure,
   report startup failure with the collection/path cause and expose no partial
   catalogue. HTTP received before readiness returns 503; it must not initialize
   lazily. This integration therefore requires ASGI lifespan to be enabled.
3. Each serving process initializes independently from the same deployed inputs.
   Changed declarations/artifacts require process restart/reinitialization. The
   existing development page reload option does not authorize registry mutation.
4. Use the reserved resource base /gramlot/collections, following the existing
   /gramlot/rpc and /gramlot/close host namespace. Example:
   /gramlot/collections/documenti/<sha256-hex>/assets/index.js. The name occupies
   one encoded URL segment; the digest reconstructs the logical sha256: build ID.
   Validate decoded identity/path and inventory membership; malformed or unknown
   names/digests/resources return 404 without falling through to page routes.
5. GET returns the registered Traversable bytes and appropriate MIME type. HEAD
   verifies the same resource and returns corresponding headers without a body;
   other methods return 405 with Allow: GET, HEAD. The initial no-store policy is superseded by the owner's 2026-10-24 performance
   approval: verified build-ID assets use public, max-age=31536000, immutable;
   the process retains its verified bytes until restart. Reserve the prefix against conflicting custom assets.
6. Apply the existing mount_path once to emitted browser URLs. Route dispatch
   removes the mount prefix; collection_url delegates to the service. Bootstrap
   and import-map entries use the same final URL. Core still imports no adapter.

No new resource URL may expose a Python initializer, grammar/catalogue metadata,
unregistered package or file outside its verified browser-resource inventory.
Startup blocks on invalid descriptors; source modules must be importable under
§120. Resource reads must support Traversable without requiring an ordinary path.

### Acceptance checks for the approved increment

A fixture collection includes a component, registered command, CSS and a named
asset; another collection exercises dependency-first ordering. Generate packages,
import them from Python and open a page through the real Uvicorn integration.
Verify component activation, command registration and resource URLs without
requiring the not-yet-implemented menu/window UI. Consumers start without invoking
Node; the build developer environment still requires it.

Test startup failure and readiness, two independently initialized processes,
asset request before any page visit, mount prefixes, GET/HEAD/MIME/405/404,
Traversable resources, path containment, wrong hashes, shared-runtime identity,
CSS readiness/failure and page-local activation. Include restart after artifact
changes and regression coverage for pages without extension declarations.
Core fixtures stay in core; adapter HTTP/lifespan tests stay in gramlot-py-server.
No gallery edits, other adapters, menu/window implementation or publication are
included. This is approved design; none of these implementation checks has run yet.


<a id="gc-325-150"></a>
## 150 · Implemented preparation and hosting path (2026-10-23)

Block ID: **GC-325-150**.

This section supersedes the earlier sections' dated “not implemented” statements
and §145's exclusion of existing consumers. The owner explicitly approved their
migration, the verified derived serverless bundle, and shared core fingerprint APIs.
Earlier design discussion remains a historical record of the decisions.

A collection developer installs the core and the separate project-local
`@gramlot/builder` package. The Python environment installs `gramlot`; consumers of
already prepared Python packages do not require Node or the generator. Supported
generator majors are Node 22, 24 and 26. The generator uses esbuild and its exported
`@gramlot/builder/cli` entry, invoked once per Python command using protocol 1.
In this unreleased source tree the npm generator lives in tools/gramlot-builder;
no public package availability is implied.

```json
{
  "output": "./src",
  "collections": [
    {"entry": "./ui/documenti.js", "pythonPackage": "myapp.ui.documenti"}
  ],
  "externals": []
}
```

```sh
gramlot-builder build --config gramlot.build.json
gramlot-builder check --config gramlot.build.json
```

`build` reports created, updated or unchanged packages with their paths. `check`
reports stale or unchanged output without updating it. Exit 0 means success/current,
1 means stale check output, 2 means an error or outstanding recovery. Do not delete
recovery evidence to force an update: the next build recovers the previous operation
only, exits 2 and requires a separate invocation for the requested new build.
Foreign changes and corrupt evidence stop recovery and retain the journal/backups.
Current replacement locking uses POSIX file locking; Windows execution is not verified.

```python
from gramlot import Page as GramlotPage
from myapp.ui.documenti import mygramlot

class Page(GramlotPage):
    gramlots = [mygramlot]

    def main(self, root):
        root.collectionText(value="^name")  # a component declared by documenti.js
```

The Python integration discovers page declarations at startup, verifies the full
graph and freezes its registry for the process. Resources are available before a
page visit under `/gramlot/collections/<name>/<digest>/assets/...`, with any mount
prefix added once. Changing an artifact requires restart; old identities never
serve new bytes. Only inventoried browser files are exposed; Python initializers,
grammar and command metadata remain private. GET/HEAD and MIME/length are tested.

The bootstrap receives exactly `{name, url, buildId}` records. It waits for theme,
collection and page CSS in that order and verifies every imported module identity
before activation. Failure closes the registered page and prevents startup. Page
commands are populated by the same JS hook used to generate their catalogue.

The core's asynchronous `collectionBuildId(metadata, files)` computes the §075
fingerprint; `verifyCollectionArtifact(metadata, files)` checks the inventory,
fixed wrapper and identity. `files` is a Map of relative paths to Uint8Array bytes.
The APIs use Web Crypto and know nothing about filesystem or host routing. Hosts
read confined package files and pass a byte snapshot. File-origin serverless export
verifies that original snapshot before esbuild creates the approved derived module;
its buildId remains a reference to the original artifact. HTTP serves original bytes.

Current test evidence and remaining integration limitations are tracked in
[GC-070 §1655](../internal/070-work-status.md#gc-070-1655). No menus, toolbar/window
UI, public package release or deployment is part of this implementation.


<a id="gc-325-environment-collections-20261030"></a>
## Environment inclusion and dynamic engines (2026-10-30)

The owner-approved environment selection supersedes repeating standard collection
imports in every example. A shared Page base (or host `collections`) includes the
prepared descriptors. Extra page collections still accumulate. Component engines
are declared through dynamic import(); generation preserves that boundary with
ESM splitting and includes all chunks in the verified inventory. Their relative
URLs require no new bootstrap field. Activating a collection does not fetch the
engine. The existing file-origin derived bundle is still eager; deferred loading
for that profile remains unresolved. See GC-070 environment checkpoint for sizes
and verification, and GC-340 for application authoring.
