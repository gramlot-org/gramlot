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
Status: **design; extension packaging and slotButton APIs not implemented**.
[Full guide](../../docs/future/325-how-to-extend-gramlot.md).
[Frame/bar design](320-frames-bars-and-windows.md).
Future documentation, not an executable released tutorial or implementation permission.

<a id="gc-325-005"></a>
## 005 · JS ownership and Python consumption

JS defines components and their grammar. Python consumes the generated grammar
and constructs SourceBag/SourceBagNode trees. Owner-selected surface:

```python
from xxx.yyy import mygramlot

class Page(GramlotPage):
    gramlots = [mygramlot]
```

Contract sketch, not current exports. Import exposes an object; the declaration
activates extensions. Base Gramlot is implicit; its exact component inventory
remains open. Intended flow: JS definitions → CLI preparation → importable Python
object, grammar, JS/CSS → page grammar and browser bootstrap. Hosting/asset URLs
belong to integrations; reusable behavior to components.

<a id="gc-325-010"></a>
## 010 · Existing foundations

Existing: JS `defineComponent`/`defineCollection` and `toDocument()` in
`js/src/components/registry.js`; Python `GramlotBuilder.load_collection`;
server application-level `collections` pairing grammar/module; PageBootstrap
imports/registers collections and supplies grammar before startup.
File server supports `Page.css`, companion CSS and companion Logic modules.

Not implemented: importable gramlot object, `Page.gramlots`, extension generator,
slotButton registry. Named `css_requires`/`js_requires` need the resource host
assigned to genro-kajenn (constitution 11.57); generic file hosting does not
provide it. Logic imports and collection loading have distinct contracts.

<a id="gc-325-015"></a>
## 015 · CLI preparation

Proposed spelling only, not an available/approved command:

```sh
gramlot collection build ./widgets/index.js --out ./dist/widgets
```

Desired package: portable grammar, JS/CSS assets, Python extension object and
connecting metadata including button groups. Existing JSON grammar plus a thin
Python object is proposed; Python must not duplicate component definitions.
Entry exports, tool ownership, bundling/copying, packaging backend/layout,
manifest and duplicate diagnostics remain open. Validate generated declarations
and resource references; copied JS alone cannot provide the Python grammar.

<a id="gc-325-020"></a>
## 020 · Page activation

`gramlots` adds to the implicit base. Load grammar before Source construction,
expose packaged resources through the host and supply collection modules/CSS to
bootstrap. Existing application `collections` is a foundation, not page support.
No global import-time activation. Fields, inheritance, ordering, deduplication,
dependencies, collisions and adapter details remain open. Matching definitions
and independence from page opening order need implementation/tests.

<a id="gc-325-025"></a>
## 025 · Custom slotButtons

Proposed JS registration surface; not an existing runtime global:

```javascript
const grp = gramlot.commands.registerGroup("invoices", {
    author: "My project",
    description: "Invoice commands"
});
grp.register("issue", {
    icon: "send", label: "Issue",
    tooltip: "Issue the invoice", publish: "issue"
});
```

The owner confirmed gramlot.commands.registerGroup on 2026-10-22 (GC-225 §005);
the runtime API is not implemented. Registry scoping, module exports and build-time entry point remain open; generation
must not imply an active browser page. Namespaced keys distinguish definitions;
icon identifiers/localization are illustrative, not verified features.
JS owns registration; Python receives descriptions.

Fixed grammar selected by owner:

```python
bar = frame.top.slotBar()
bar.slotButton("invoices:issue", disabled="^.locked")
bar.slotSpacer(size=12)
bar.slotButton("undo")
bar.slotSpacer(flex=1)
bar.slotButton("close")
```

Instance override rules/bindings remain proposed. Buttons publish to designated
frame content with originating identity; that recipient performs the operation.
Publishing close does not itself close a window. Keys are values, never generated
methods or per-button grammar switches.

<a id="gc-325-030"></a>
## 030 · Composition and unknown names

Nested bars/multiple regional bars confirmed. Proposed free-content API:

```python
extra = bar.slot("extra")
nested = extra.slotBar()
nested.slotButton("invoices:issue")
```

Owner's sketch used slotButton("extra"); assistant's separate slot container was
not explicitly accepted. Do not silently turn unknown buttons into containers.
Unknown keys: owner said "decidiamo poi" after ???/console-warning alternatives.
Rejection, skipping, placeholder rendering and diagnostic details remain open.
Fixed grammar validation is distinct from unknown registry-key policy.
Compact string authoring, Python registration and generated button grammar
methods are superseded proposals, not alternate implementation paths.

<a id="gc-325-035"></a>
## 035 · Evidence and gates

Owner, current conversation 2026-10-22:
- "io la registrazione la farei solo js. python 'riceve' da js la grammatica, non la produce";
- supplied import mygramlot / Page.gramlots;
- "di default c'è il gramlot base";
- supplied slotButton/slotSpacer calls and "i nomi sono solo quelli della grammtica base";
- "decidiamo poi" for unknown keys;
- requested this how-to guide after custom-button discussion.

Exact group/CLI/packaging details remain proposed. Record final new names in
GC-225 with confirmation before implementation. Settle object/packaging,
page/bootstrap integration, registry metadata, content slots and diagnostics
one decision at a time; do not reopen confirmed JS ownership/fixed grammar.

Focused future checks: grammar parity, packaged imports/assets, implicit base,
page isolation, prefixed URLs, activation order, namespaced definitions,
bindings, sender/target routing, nesting and chosen unknown-key policy.
No Builder/Bag dependency edits or workarounds; report missing owning contracts.
Documentation checks verify syntax/links/anchors, not runtime behavior.
Full qualification before release; no runtime or publication authorization.

<a id="gc-325-040"></a>
## 040 · Confirmed collection entry point and activation sequence

Owner requests a concrete JS registration → Page.gramlots → Python/bootstrap
example on 2026-10-22, then confirms the shared preparation/bootstrap hook with
"ok". registerCommands, registerGroup, gramlots and this lifecycle are confirmed;
concrete packaging formats and remaining policies are still open.

Extend existing defineCollection({name, components}) with registerCommands(gramlot).
The hook calls gramlot.commands.registerGroup("documenti", metadata), then
group.register("save", {label, icon, tooltip, publish: "save"}) and the corresponding
toggleDetails definition. components: [] permits a commands-only collection.
The full guide contains the complete code example.

Import creates a definition without global registration. The hook declares static
metadata, without DOM/Data/network/business actions. Preparation runs it against
an isolated commands registry; bootstrap runs it against the page registry.
One JS source produces both command catalogues.

Preparation emits portable component grammar, command metadata, the JS module/
assets and an importable Python descriptor. Python reads generated metadata;
it does not execute JS or generate save/toggleDetails grammar methods.
Descriptor class, filenames/manifest format and CLI spelling remain open.

```python
from gramlot import Page as GramlotPage
from documenti.widgets import mygramlot

class Page(GramlotPage):
    gramlots = [mygramlot]
```

Import does not activate the extension. Page selection activates implicit base
plus additions before Source building, for initial and subsequent source calls.
The same selection supplies per-page Builder grammar/command metadata and
bootstrap module/CSS resources. The host maps declared package assets to URLs;
core does not become a resource host or redefine js_requires/css_requires.

Bootstrap imports selected modules, uses existing component registration and
constructs Gramlot with their grammar. Before app.start(), it runs registerCommands
against that page's registry. Commands are per page; custom-element registration
is per window. Do not start an apparently configured page after partial failure.
Python descriptors and browser modules must come from one prepared artifact;
activation consistency checks remain to specify.

Owner confirms with "ok": name identifies the collection; repeated inclusion
activates the same collection once; different collections sharing a name fail
explicitly without overwrite. Resolve the selected set before registration.
A matching name alone does not prove artifact identity.

Owner confirms with "ok": full command keys are unique. Different namespaces
may reuse a local name; duplicate full keys fail without overwrite. Collection
deduplication prevents repeated activation.

Owner confirms with "confermo": each namespace has one owning collection.
Others may use its commands, but register their own under another namespace;
disjoint command names do not permit a second owner. No equality between
collection name and namespace is required.

Owner confirms with "ok": Page.gramlots is cumulative. BasePage selecting
[documenti] and Page(BasePage) selecting [report] yield implicit base, documenti
and report, deduplicated. Subclasses add rather than replace; no removal syntax
or new multiple-inheritance precedence is implied.

Owner confirms with "ok": required collections are automatically included before
their consumers; missing or cyclic dependencies are explicit errors. Pages list
direct choices. Existing deduplication/collision rules cover the resolved set,
shared by Python grammar/catalogue loading and browser bootstrap.

Owner confirms with "ok" the JS syntax dependencies: [common], with common
imported from a collection module. Preparation derives package dependencies
from these object references; there is no separately authored Python list.

Owner confirms with "ok": registerGroup creates a namespace once per registry;
repeating the call errors even for its owner. The owner's modules may share
the returned group to add commands, retaining full-key uniqueness. Preparation
and pages use separate registries.

Remaining choices: generated dependency representation, artifact checks,
asset packaging/URL mapping.
Do not change existing component-grammar merge rules as a side effect of registry
collision policy; no overwrite, auto-discovery or fallback loading is implied.
No manual requires entry is needed in the proposed packaged path, but serving
package assets still requires integration work.

Verified by source inspection: defineCollection/name/components/toDocument,
per-window component registration, server grammar loading and pre-start browser
construction exist. Page.gramlots, registerCommands, registry and generation tool
remain implementation work. Full frame recipient/handlers are separate from
this loading-only Python fragment.

<a id="gc-325-045"></a>
## 045 · Confirmed generated package and Python descriptor

The owner requests an example, then replies "ok" to the commentary proposing
a lightweight GramlotCollection descriptor. A subsequent "ok" confirms the full
constructor fields and package layout below. Design is approved; runtime is pending.

Generated package: documenti/widgets/__init__.py exports mygramlot; sibling
grammar.json and commands.json contain generated metadata; assets/index.js,
assets/documenti.css and assets/icons/ contain browser resources.

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

Proposed descriptor is inert and immutable. name comes from JS; package locates
Python package resources, not working-directory files or URLs. Remaining paths
are package-relative; css is ordered. dependencies contains generated descriptor
references. This example has none; JS-to-Python-package mapping remains open,
not inferred from namespaces or maintained in a second handwritten list.

Grammar uses the existing portable format; the namespaced command catalogue
schema is confirmed in §050. The descriptor is the sole resource map, without a duplicate
manifest. Metadata/assets ship in the project's Python distribution or a separate
extension distribution; separate publication is not required. Host URL mapping
is distinct from package-resource access. Import does not activate routes/registry.

Packaging must resolve JS/CSS references and share core runtime. Cross-package
mapping, asset serving and artifact checks remain gates. Page usage stays
from documenti.widgets import mygramlot, then gramlots = [mygramlot].
Python loads grammar/catalogue; bootstrap loads module/CSS and registers commands
before app.start(). GramlotCollection is not yet exported; syntax checks do not
prove runtime behavior.

<a id="gc-325-050"></a>
## 050 · Confirmed generated command catalogue

Owner requests commands.json after accepting package layout, then confirms the
namespaced-group schema with "ok". Design is approved; runtime remains pending.

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

document_format uses the portable-document convention; gramlot_commands / 1.0
identifies schema, not a package release. groups keys are namespaces; commands
keys are local names, deriving full identity without repeated key/code fields.
Optional group author/description; required command label/publish; optional
icon/tooltip strings. Empty groups/commands are explicit mappings. Descriptor
retains package/resource/dependency mapping; catalogue is not a second manifest.

Only collection-owned definitions are emitted. Dependencies keep separate
catalogues. Already approved duplicate-key/namespace-owner errors apply before
serialization can discard duplicates. Unsupported formats/fields are diagnosed.

No executable code, live Source/Data, instance bindings or parameters are stored.
checked/disabled/hidden remain live entry state. Registry defaults/overrides,
parameter-form schema and localization are not settled here.

Python consumes metadata for lookup/diagnostics/future forms; unknown-reference
policy remains deferred. Browser still runs registerCommands, never double
registers from JSON. Generated/browser correspondence checks remain to design.
Owner confirms with "ok": group "" is reserved to the base collection. Register
with registerGroup("", metadata), serialize under groups[""]; local save has full
key save, versus documenti:save in documenti. No aliases or fallback lookup.
Non-base collections cannot own "". Repeated registerGroup calls error even
within the owner; its modules share the returned group to add commands.

JSON structure/registration correspondence checked; no runtime loader test.

<a id="gc-325-055"></a>
## 055 · Confirmed dependency-to-package generation

Owner asks for a concrete example without duplicate declarations, then confirms
the destination map with "ok". Design is approved; the generator is not implemented.

Authored JS: ui/common/index.js default-exports defineCollection({name: "common",
components: [], registerCommands(gramlot) {...}}). ui/documenti/index.js imports
common from ../common/index.js and declares dependencies: [common]. That field
is the only authored dependency edge; imports of arbitrary helpers are not edges.

Confirmed gramlot.build.json:

```json
{
    "output": "./src",
    "collections": [
        {"entry": "./ui/common/index.js", "pythonPackage": "acme.widgets.common"},
        {"entry": "./ui/documenti/index.js", "pythonPackage": "acme.widgets.documenti"}
    ]
}
```

Paths resolve relative to the config file. The map declares destinations, not
dependency lists or duplicated collection names. Each JS entry's default export
maps to one Python package with the confirmed metadata/assets and mygramlot export.

Generated documenti descriptor:

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

The common descriptor has the same resource fields, name="common" and empty
dependencies. Full guide shows both authored modules and generated descriptors.
The generator walks declared dependency objects and resolves their configured
destinations; identity comes from the resolved modules/definitions, not a name
guess. Page gramlots lists only documenti; common activates first on both sides.

Missing mappings/modules, cycles, ambiguous destinations or conflicting
definitions are explicit errors. Example covers two collections in one Python
distribution. External extension-package mapping is confirmed in §060;
no automatic download, vendoring or dependency pins.

Browser packaging must preserve/share dependency module identity and the selected
core runtime; exact output links/host URLs remain open. Do not silently overwrite
application files or parent __init__.py; ownership, cleanup and atomic generation
remain build gates. Code/JSON syntax checks do not prove a working generator.

<a id="gc-325-060"></a>
## 060 · Confirmed external collection references

Owner requests an existing-package example, then confirms externals with entry
and pythonImport with "ok". Design is approved; loader/build is not implemented.
Example names @acme/common/widgets and acme_common.widgets are illustrative.

JS documenti imports common from @acme/common/widgets and declares
dependencies: [common]. That is the only authored dependency edge.

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

collections lists outputs; externals maps existing modules to exact
module:attribute Python descriptor imports. Presence in the map is not activation.
The target must be GramlotCollection, not an alternate module/factory input.

Generated local documenti descriptor:

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

Only documenti is generated. Do not regenerate/copy/modify the external package,
catalogue, grammar or assets. Its descriptor supplies those resources and its
dependencies; existing page resolution includes common before documenti.

Host/bootstrap must use the external packaged browser module, without embedding
another copy. Exact emitted-import/URL linking and cross-language artifact
verification remain open. Name equality alone is insufficient.

Missing JS/Python imports, invalid descriptors and ambiguous local/external entry
ownership are errors. No fallback vendoring, downloads or automatic installation.
The application's packaging declares normal JS/Python distribution dependencies;
pythonImport is not a distribution name. No first-party pins/lockfiles.
Checks cover syntax only; no external package was installed or executed.

<a id="gc-325-065"></a>
## 065 · Confirmed browser import linking

Owner confirms with "ok" the generated import convention and host-built map:
@gramlot/collections/<name>, derived from collection identity (escaped injectively
when needed), not Python package/command namespace. The build resolves declared
dependency objects and rewrites only their emitted imports, never authored source.
Local/external collections use this one form; no alternative/fallback resolution.

```javascript
import {defineCollection} from "@gramlot/gramlot/components";
import common from "@gramlot/collections/common";
```

The host generates the selected graph's import map before module execution,
preserving CSP nonce/escaping. Example paths are illustrative, not core routes:

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

Descriptors/dependency resolution supply all mappings; no manual page map,
extra descriptor imports field, registry alias or browser package download.
Use the same resolved URL/cache identity in resources.collections and the map
to retain one module instance per collection in the page. Commands registration
remains one hook call per page in dependency order, independent of module import.
CSS follows descriptor/dependency ordering. Late collection activation is out
of scope.

Existing core map provides root/page entries, not hosted components/collection
entries. The npm components export exists; its shared browser entry/linkage
must be implemented without private core copies. Source inspection confirms
nonce-bearing map before bootstrap and current collection URL imports only.

Host asset serving, cache identity and cross-language artifact validation remain
open. External modules must satisfy the agreed generated-module contract; do not
rewrite/regenerate incompatible external packages. Syntax/JSON/reference checks
do not demonstrate runtime or browser behavior.

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

Owner confirms with "ok" the scheme: SHA-256 for each collection's own
generated grammar/catalogue/JS/CSS/assets; generated descriptor adds build_id
(sha256:<hex>) and files (sorted relative-file inventory). No second manifest.

Hash metadata in fixed order: name, grammar, commands, module; ordered css and
direct dependency names; then each UTF-8-byte-sorted file path and exact content.
Exclude timestamps, absolute paths, host URLs, dependency fingerprints and the
descriptor's own build_id. Python initializer is represented by resource metadata.
Dependencies are verified independently, without locks or compatibility claims.

Stream format: gramlot-build-v1 plus NUL; then records encoded as tag, NUL,
decimal UTF-8/payload byte length, NUL, payload. Scalar/list tags follow the order
above; file records use path then content. Rename/byte changes affect the digest.
Inventory must cover all generated local runtime resources/chunks, with unique
valid relative paths. Reproducible generator output remains a required test.

Generated assets/index.js wrapper:

```javascript
export {default} from "./collection.js";
export const buildId = "sha256:<generated digest>";
```

The implementation is in assets/collection.js. Hash the fixed wrapper template
with __GRAMLOT_BUILD_ID__ as its literal value; then emit the digest. Host verifies
the exact installed wrapper with descriptor digest before hashing the placeholder
template. No arbitrary source replacement. Both files are covered by files.

Prepare inventory/digest/descriptor/wrapper together. Host recomputes and validates
before serving or using metadata for Source; cached validation requires unchanged
bytes. Bootstrap receives expected name/buildId per module URL and compares every
named export before component/command activation or app.start. Missing, malformed
or mismatched values block startup with collection-specific diagnostics.

Use the fingerprint in the host's resource base path, so relative JS/CSS imports
stay within the same artifact. Old paths never serve new bytes; route shape stays
host-owned. Identical URLs are used in import map and collection imports.
This is artifact identity, not release pinning. fields are generated, not authored.

Current runtime lacks these checks. A temporary in-memory probe and syntax checks
verify the proposal mechanics only; no framework/browser behavior is claimed.

<a id="gc-325-080"></a>
## 080 · Preparation CLI and output lifecycle

Owner "ok" (2026-10-23) confirms CLI syntax and output policy as design.
Sections 085–090/130 settle toolchain discovery, protocol and exits; §135 settles
recovery policy. Implementation remains pending.
Current gramlot console script belongs
to gramlot-py-server, dispatching environment/verb. Core must not overwrite that
entry point or depend on its adapter launcher. Approved independent command:

```sh
gramlot-builder build
gramlot-builder check
gramlot-builder build --config ./tools/gramlot.build.json
```

This supersedes the earlier unapproved gramlot collection build sketch.
Default config is gramlot.build.json in the invocation directory;
internal paths are config-relative. output stays in config. Process the full
configured graph; no watch/selective build/install implied.

Python launches JS preparation; building needs the JS toolchain/resolvable
dependencies, ordinary prepared-page consumption does not. Section 085 settles
the distribution split; §§090/130 settle discovery/protocol. Missing prerequisites
fail without automatic downloads or pins.

build validates graph/definitions and stages all candidates before modifying
output. Update only recognized generated files, leave unchanged bytes untouched,
and remove stale files only from a verified previous inventory. Validate the
generated initializer template as well as payload fingerprint. Manual edits,
unowned candidate-path collisions or unverifiable old output block replacement.
Preserve unrelated files and parent package initializers; never delete a whole
source tree or rewrite source/config inputs. Removed collection cleanup is separate.

No claim of a single atomic transaction across output directories. Commit I/O
failure needs retained prior content, explicit recovery and implementation tests.
No force/clean, server start, package installation or publication in this scope.

check regenerates into temporary storage, validates and compares to existing
output without project mutations. Internally consistent but source-stale outputs
still fail check. Exits confirmed in §130: 0 success/current, 1 check stale/missing,
2 other errors. Temporary output cleaned up; meaningful collection/path diagnostics.
A successful check is not release qualification.

Tests must cover ownership/manual edits, stale files, unchanged output, failed
validation/I/O, missing dependencies/toolchain and check write-freedom using
core-local fixtures. This update is design text, not an executed CLI.

<a id="gc-325-085"></a>

## 085 · Collection development toolchain

Owner, 2026-10-23: "Sì, confermo: comando Python in gramlot e generatore npm
separato, installato nel progetto solo per chi sviluppa le collezioni."
Confirms the preceding proposal, including the @gramlot/builder name.

Python gramlot supplies gramlot-builder; separate npm @gramlot/builder in the same
core repository supplies the JS generator/build dependencies. Collection authors
install it locally as a development dependency. The launcher uses Node and the
generator in the selected configuration's project; missing prerequisites produce
installation guidance, never automatic downloads. Browser runtime does not acquire
build tooling. Prepared Python collection consumers need neither Node nor generator.

Planned usage (not available commands/packages today):

```sh
npm install --save-dev @gramlot/builder
gramlot-builder build
gramlot-builder check
```

First-party dependencies remain unpinned/uncapped, including through lockfiles.
Sections 090/130 settle discovery, lookup, exact protocol and exits; §135 settles
recovery. Section 140 now settles concrete generator entry/export, Node support
and generation tooling. Core-local tests must cover local generator lookup, missing
prerequisites, configuration outside the invocation directory and prepared-package
consumption without invoking Node. No implementation or publication is implied.

<a id="gc-325-090"></a>

## 090 · Launcher/generator contract

Owner, 2026-10-23: "Sì, confermo questo contratto. Aggiorna il progetto e poi
vediamo come collegare le risorse al bootstrap."

Ascend from the selected configuration's directory to the first package.json:
that is the JS project. Configuration paths stay relative to the configuration,
independent of the invocation directory. Use environment Node and resolve
@gramlot/builder from the project, including normal npm workspace dependencies.
Missing project/Node/generator yields diagnostics, no global generator fallback
or automatic downloads.

One Node process per command. JSON request on stdin carries operation,
configuration, temporary directory and external Python collection metadata.
JSON result on stdout returns inventory/diagnostics; stderr carries diagnostic
messages. Version the protocol independently of package releases and reject
incompatibility; equal Python/npm versions are not required. Section 130 now
settles exact fields/version under GC-225; §140 settles the concrete entry/export.

Python reads configuration/imports external descriptors, invokes JS, validates
candidates/existing ownership, then updates for build or compares for check.
JS loads definitions, resolves dependencies and generates temporary candidates;
it never directly updates project outputs. Generator failure leaves them intact.
Output-commit I/O recovery is separately confirmed in §135.

Tests must cover nested configuration/invocation independence, workspaces,
missing prerequisites, protocol mismatch, JSON/diagnostic separation, generator
failure and build/check ownership. This is approved design, not implementation.

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
asset nella collezione JS." Discovery is approved design, not implemented.

Scan only route-eligible Python files in the configured pages directory.
Reuse locate_page/resolve_page syntax, containment, reserved _aux suffix and
file-before-folder rules. No new filename prefix/marker/decorator or handwritten
page/collection list. Sort relative logical paths lexicographically, use the
existing loader and deduplicate real files so route aliases do not reload them.
Preserve link containment and avoid traversal cycles; no installed-package scan.

After importing a candidate, classify its Page export:

- Missing or exactly gramlot.Page: support module, yield no page.
- A proper subclass of gramlot.Page: yield it, including valid re-exports.
- Any other exported value (including None/non-Page classes): startup error.

Deduplicate identical class objects, not class-name strings. Collection graph
deduplication stays separate. Candidate import errors fail initialization with
path/cause; never silently treat failure as a helper. Do not instantiate or call
main, Source, resolver or endpoint methods. Direct route validation is unchanged.

Explicitly approved consequence: candidate helpers among pages are imported too,
so their module-level code runs at startup. No AST interpretation or alternate
marker is introduced to avoid that cost. Helpers outside the configured page
root are not scanned, though normal Python imports may load them.

Non-file providers implement iter_page_classes from their trusted route/page
catalogue, yielding valid classes deterministically. Dynamic URLs require
enumerating possible classes, not all URLs. A non-enumerable provider is a
capability gap, not permission for request-driven resource discovery.

Future tests cover nested routing/precedence, aliases/re-exports, helpers/base
imports/invalid exports, import errors, ordering, containment/link cycles,
no page-method execution and dynamic-provider catalogues. No runtime tests run.

<a id="gc-325-125"></a>

## 125 · CSS and named asset declarations in JavaScript

Owner, 2026-10-23: "Bene, torniamo alle collezioni: confermo css e assets nella
definizione JS. Aggiorna il progetto e poi vediamo il protocollo del generatore."
Approves the preceding declaration/behavior proposal; implementation is pending.
Current defineCollection only accepts name/components;
the approved Python descriptor css/files outputs do not define source inputs.

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

Confirmed css is an ordered URL-object array; assets maps collection-local names to
URL objects. Omitted fields mean no explicit entries. new URL(..., import.meta.url)
makes paths declaration-relative, independent of cwd. No string-path alias or
callback representation. Existing component/dependency/command contracts remain.

Declared CSS entry order generates descriptor.css. Follow local @import and
url(...) recursively to package reachable stylesheets/fonts/images, preserving
cascade and relative references. Do not load imported stylesheets again as
top-level entries. Fonts/images referenced by CSS need no repeated assets entry;
named access may reference the same file without duplicating its bytes. Distinct
files with equal basenames must remain distinct.

assets entries are packaged, not automatically fetched/executed/applied.
JS accesses documenti.assets.logo.href; generated URL expressions point relative
to emitted modules, never to source filesystem URLs. Generate Python css,
module paths, complete inventory/fingerprint automatically; no extra handwritten
Python catalogue or bootstrap asset map. Browser files stay under assets/.

Initial scope is local packaged files with no generation-time downloads.
CDN/host-root reference policy is outside this contract; CSS inline data/fragment
references do not add files. Missing/unsupported/unresolved inputs fail before
output replacement. Exact emitted names, bundler, graph mechanics and machine
protocol remain to specify/implement (§115). No named Python asset API is added.

Future checks cover cwd independence, CSS order/transitive references, URL
rewriting, shared-resource deduplication/basename collisions, optional fields,
commands-only resources, missing files and no source-path leakage.

<a id="gc-325-130"></a>

## 130 · Generator process protocol

Owner confirmation, 2026-10-23: "Sì, confermo il protocollo e i codici di uscita.
Aggiorna il progetto e poi vediamo come gestire un errore durante la sostituzione
degli output." Confirms the complete protocol below, including version/schema,
diagnostics and exits. This settles §090; examples remain illustrative and no
runtime implementation or output-recovery policy is approved by this decision.

One UTF-8 JSON request on stdin then EOF; one JSON result on stdout. Surrounding
whitespace is allowed, logs/progress use stderr. No event stream/request ID.
protocolVersion is integer 1, exact-match compatibility independent of package
versions. Unknown fields, wrong/missing types or malformed/version-mismatched
messages fail without coercion.

Required request fields: protocolVersion, operation (build/check), configPath
(absolute), projectRoot (absolute, already discovered), stagingDirectory
(absolute, Python-created), config (parsed §055/060 snapshot, not reread), externals.
Each external row has entry, pythonImport, name, buildId, dependencies (names),
derived from configured mapping and verified descriptor references. No invented
mappings or duplicate authored dependency graph. build/check generate the same
candidates; Python alone updates output or checks freshness.

Success fields: protocolVersion, status="ok", collections, diagnostics.
Each collection record has name, pythonPackage, buildId, grammar, commands,
module, css, dependencies (names), files (§075 inventory). Resource paths are
package-relative; staging location derives from pythonPackage. The generated
initializer is present but excluded from its self-referential fingerprint.
Python validates records/files/fingerprint and compares the initializer against
the known template/import mapping without executing generated Python. Response
metadata is transient, not a second on-disk manifest.

Error fields: protocolVersion, status="error", diagnostics; no candidate records.
Diagnostic fields: level (warning/error), code (uppercase underscore-separated),
message; optional collection/path. Success has no error diagnostics; failure
has at least one. The full code catalogue remains implementation work.

Node exits 0 for success, 2 for failure; Python requires agreement with the JSON.
Crash/truncated JSON/protocol mismatch/contradictory status invalidates candidates.
CLI exits: 0 successful build/current check; 1 check absent/different output;
2 configuration/dependency/generation/validation/I/O error. Only Python determines
check freshness; no project-output updates after generator failure.

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

Paths/digest are illustrative. Section 140 settles Node/toolchain/export choice;
§135 confirms recovery. Future tests cover framing/schema/version, diagnostics/status
agreement, empty/external graphs, config-relative paths, candidate containment,
initializer/fingerprint validation and Python-owned freshness. No runtime tests.

<a id="gc-325-135"></a>

## 135 · Recovery from output replacement failure

Owner confirmation, 2026-10-23: "Sì, confermo questa politica di recupero.
Aggiorna il progetto e dimmi cosa resta da definire prima di implementare."
The recovery policy below is approved design; implementation remains pending.
Python owns the lifecycle. No JS protocol change, new CLI verb or force option.

Before mutation, validate all candidates/ownership, prepare independently copied
old bytes (including initializers), old/new digests, absent-path records and the
complete build operation list. Persist verified recovery evidence in a tool-owned
area associated with output, discoverable on later runs; do not rely on temporary
cleanup or overwrite an unrelated path. Validate ownership/containment. Internal
layout is not a public API or another collection manifest. Prepare replacements
on destination filesystems. Failure here leaves output intact. Serialize affected
builder destinations across configs, including overlap; fail on another builder,
recheck expected states. Editors/external writers are not locked by that guarantee.

Use per-file atomic replacement, journal intent before mutation, include new and
obsolete files. No atomic multi-package switch; readers must not use output during
commit/recovery. Verify the whole installed candidate, persist commit completion,
then remove backups. Before completion, any caught mutation/verification error
stops commit and attempts whole-build rollback in reverse order. Restore old bytes
or remove transaction-created files only if state matches the recorded transaction;
already-old bytes need no write. Remove only empty transaction-created directories.
Verify rollback. Preserve conflicting edits/evidence, report restored/unresolved/
conflicting paths and backup location. Failure returns 2 even after full rollback.
Cleanup failure after durable commit retains verified new output and evidence,
reports committed output plus cleanup error and returns 2.

After a crash, inspect evidence before generation or trusting partial descriptors:
- build with verified same output mapping resumes incomplete rollback, reports
  and exits 2; a separate explicit build invocation starts fresh work. Recovery
  is repeatable if interrupted again. A valid committed transaction instead
  verifies new output and finishes leftover cleanup only.
- check reports outstanding recovery and exits 2 with no changes to outputs,
  backups or records; not freshness exit 1.
- Corrupt/missing backups, unexpected contents or incompatible mapping block
  automatic recovery. Preserve evidence, report paths/manual resolution, never
  guess ownership or overwrite subsequent edits. No clean/force or partial
  promotion. Without a commit marker restore old output even if new bytes were
  fully written; with a valid marker never roll back for cleanup interruption.

Required future fault injection: precommit failures, each mutation/journal boundary,
new/deleted/initializer files, multiple collections, rollback failure/retry,
external edits, bad evidence, concurrent overlapping builders, unchanged files,
commit marker/cleanup and check write-freedom. Assert bytes/inventories, not just
messages. Document/test storage atomicity/durability and required persistence
ordering. No guarantee against lost/corrupt storage or unsupported filesystem
semantics, no live deployment or automatic process restart. No implementation
or runtime checks have occurred.

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
   other methods return 405 with Allow: GET, HEAD. Preserve this adapter's current
   no-store policy for the first increment; fingerprinting alone does not add a
   cache-retention promise. Reserve the prefix against conflicting custom assets.
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
