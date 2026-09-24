# 088 · continua revisioneNative HTML implementation plan


> Historical review/plan. Current execution: [GC-110](110-native-html-readiness.md#gc-110-020); status: [GC-070](070-work-status.md).
> This document retains earlier decisions and checkpoints. Statements about pending
> extraction or completed verification refer to their recorded stage, not current
> architectural acceptance. GC-087's agreed ownership remains binding; GC-094 does
> not promote later review proposals into owner decisions.

Document ID: **GC-088**. Date: **2026-09-19**.
Status: **local implementation and final verification complete; owner review and upstream consolidation pending**.

[Concise counterpart](../../docs_llm/internal/088-native-html-plan.md).
[Agreed layer boundaries](087-javascript-layer-boundaries.md).
[Current work status](070-work-status.md).

<a id="gc-088-005"></a>

## 005 · Delivery boundary

Deliver one equivalent Hello World page in Python and JavaScript in
`gramlot-examples/apps/hello-world`, using native HTML only. Demonstrate that the
same Source renderer supports subsequent insert, delete, attribute updates and
structural replacement. Exercise dynamic behavior through framework contract
fixtures; do not add application DOM manipulation or extra demo pages.

The requested operating profiles become executable incrementally:

| Page authoring | Profile | Execution boundary |
| --- | --- | --- |
| Python | Uvicorn | A reusable ASGI adapter, run by Uvicorn |
| Python | FastAPI | FastAPI integration, commonly run by Uvicorn |
| Python | Kajenn | Actual Kajenn integration, separately verified |
| Python | Flask | WSGI integration |
| JavaScript | Node.js | Native JS page and reusable Node HTTP bridge |
| JavaScript | Bun | Native JS page and reusable Bun HTTP bridge |
| Python | Standalone | Execute authoring at build time; embedded Source in browser |
| JavaScript | Standalone | Run JS authoring at build time; embed Source and browser runtime |

Uvicorn is a runner, not a second web framework. Node/Bun do not require a Python
worker. These are eight bounded profiles, not every cross-language/server/database
combination. All eight bounded profiles passed the final local installed-artifact browser
matrix; database folders remain placeholders.

Excluded: database access (including BagDB), SQL dialect/ORM implementation,
custom widgets, convenience CSS attributes, application bindings/controllers,
resolver systems, GitHub app functionality, production authentication/session
infrastructure, multipage offline editing/printing/export. Native HTML attributes
and literal text are in scope. There is no package publication/deployment step.

<a id="gc-088-010"></a>

## 010 · Baseline and ownership

Reuse reviewed code and tests; do not restart from the PoC or bulk-copy it.
Bag/TYTX already supplies registered types and nested event propagation. Python
and JS registered SourceBag transport, recipe preprocessing and a native renderer
are locally verified. Example package/host tests exist. Physical extraction is now locally verified; clean upstream consumption remains
open. The following mixed-package description records the pre-extraction baseline.

The historical `genro-dom-js` combines generic and DOM behavior; its RendererBase
still performs DOM finalization. Gramlot currently owns the concrete reactive
renderer and depends on that mixed package. Generic changes are uncommitted local
work. Core also contains unrelated documentation work; preserve it.

Ownership follows GC-087:

- Bag/TYTX: structure, parent references, events and typed codecs.
- Builder JS: declaration grammar, SourceBag, builder association, recipes and
  DOM-neutral RendererBase; no concrete HTML/SQL renderer.
- DOM JS: HTML dialect, native element creation, DOM rendering/update/cleanup.
- Gramlot: specialized builder/renderer, page and host coordination, remote/main
  pipelines and framework transport selection.
- Host repositories: framework/engine-specific HTTP and lifecycle integration.
- Standalone: project validation and offline packaging; no substitute runtime.
- Examples: page declarations, configuration and usage tests only.

<a id="gc-088-012"></a>

## 012 · Execution ledger — 2026-09-19

| Phase | Current result |
| --- | --- |
| 0 | Local generic repository `genro-builders-js` on develop; DOM re-scoped; SOURCE selected; plain ESM declarations and renderer APIs implemented. Remote consolidation pending. |
| 1 | Python↔JS JSON/MessagePack typed root/branch tests, native events, references, render failure and cleanup verified. |
| 2 | Generic package installed and tested without DOM globals in Node/Bun. |
| 3 | Concrete DOM renderer, metadata hooks and single-use detached candidate preparation implemented and tested. |
| 4 | Installed wheel/npm graph and packaged runtime assets verified; owner TYTX browser loading and unconstrained transitive first-party metadata are fixed and included in the final rebuilt graph. |
| 5 | Real listeners and Chromium pass for Python Uvicorn/FastAPI/Kajenn/Flask and JS Node/Bun; actual installed Hello World JS launchers pass. No DB provider initialized. |
| 6 | Python/JS native-html-v1 artifacts built from installed packages pass Chromium with network blocked, typed mutations, cleanup and no external request. |
| 7 | Documentation/maps and bounded review record updated; fresh floating upstream installation, develop/main consolidation and owner acceptance remain open. |

The final transitive graph was rebuilt and all eight profiles reverified. Owner
instruction: keep all work local for review; no commit, push or remote creation.
Local archive success is not fresh upstream installation or owner acceptance.
See [GC-089](089-native-html-handoff.md) for final counts and durable worktrees.

The phase specifications below preserve the original plan and pre-extraction
inventory. Their future tense and baseline observations are historical; the
execution ledger above records completed local delivery.

<a id="gc-088-015"></a>

## 015 · Phase 0 — Freeze the extraction contract

**Deliverables:** a source/destination inventory for existing files and tests;
actual repository/package names; public entry points; dependency graph; minimal
JavaScript declaration syntax and semantics for the HTML dialect.

Recommended naming, not yet an executed decision: a separate generic
`genro-builders-js` project, a re-scoped `genro-dom-js` for HTML/DOM, and Gramlot as
consumer. Confirm whether to reactivate/rename existing repositories or create a
new generic home. Record how the September 9 retirement decision is superseded.
Do not equate a folder move with accepted independent packages.

Resolve the registered SourceBag suffix across Python and JS: local integration
uses `SOURCE`, while a separate Python branch uses `XS`. Select one interoperable
contract and test it; do not support both silently as a workaround. Settle the
JS decorator syntax/build requirements for browser, Node and Bun. The proposed
first authoring surface includes element/abstract declarations; container/component
parity is separately inventoried and must not be silently inferred. Confirm meanings
against Python `element`, `abstract`, `container`, `component`; persistent recipe
expansion before mount must not be confused with render-time component expansion.

**Done gate:** explicit ownership and public API contracts, all destinations
identified, no unresolved format or declaration-semantic ambiguity for the HTML
slice. No speculative SQL implementation or broad component hierarchy.

**Execution evidence, 2026-09-19:** the first Sol inventory confirms two concrete
browser dependencies in the current mixed package: `src/renderer/base.js:finalize`
creates a global `document` fragment; `src/builder-base.js` imports `getCollection`
and `injectCollectionCss` from `collections.js`. Both must move behind dialect-owned
implementations before the generic import graph is neutral.

| Existing mixed-package files | Proposed destination responsibility |
| --- | --- |
| `source-bag.js`, `recipe.js`, generic `pointer.js`/`utils.js` | Builder: typed Source and composition |
| `builder-base.js`, `renderer/base.js` | Builder, after removing browser dependencies |
| `contrib/html/`, `target-wrapper.js`, browser collections | DOM dialect; only native HTML accepted by this milestone |
| Gramlot `renderer/gramlot-renderer.js`, `view/html.js` | Split generic DOM mechanics from Gramlot references/application hooks |
| `builder-handler.js`, existing SVG/application helpers | Review separately; not automatically accepted by extraction |

The recommended first change makes `RendererBase.finalize` abstract and preserves
fragment/target delivery in a DOM-specific renderer base. A second change separates
collection resolution from browser custom-element/CSS setup. Only then should the
generic package be extracted. Plain ESM declaration helpers are the recommended
initial syntax; no decorator transpiler is necessary for the native HTML slice.
These are implementation recommendations pending the phase-0 API record, not
claims that the split already exists.


<a id="gc-088-020"></a>

## 020 · Phase 1 — Lock the observable contracts

**Deliverables:** behavior fixtures shared across extraction work and recorded
baseline results from actual installed artifacts. Existing test counts are history,
not acceptance of a changed package graph.

Cover typed root/branch reconstruction in Python↔JS, JSON and MessagePack, native
node tags/scalars, builder association without copying, root subscription before
first insertion, later nested events, ordered siblings, native setters, structural
replacement, references and recursive cleanup. Test recipes on main and remote
blocks, failed detached expansion, duplicate references, stale replies and owner
disposal. Test rejects ordinary Bag coercion and unknown registered types.

**Done gate:** tests express behavior at package boundaries, identify current
failures without compensating shims, and assign any failure to its owning layer.
Bag changes are permitted only for a demonstrated Bag-owned defect.

<a id="gc-088-025"></a>

## 025 · Phase 2 — Extract the generic Builder JS

**Deliverables:** independently installable generic package with grammar/authoring,
SourceBag registration, typed transport integration, in-place builder association,
recipe expansion and neutral RendererBase. Move tests with their implementation;
retain provenance and original notices. Keep first-party dependencies floating.

Provide the agreed declarative authoring surface rather than forcing application
authors to assemble internal grammar objects. Test inheritance, abstracts, defaults,
validation and declaration discovery needed by the native HTML vocabulary. Document
any decorator family deliberately deferred; do not claim full Python parity until
its semantic contract is implemented and tested.

Remove DOM finalization, HTML collections, browser globals and application state
from the base package. A tiny test dialect with a concrete string/object renderer
must demonstrate that the base works without a browser; it is a test fixture, not
a new production SQL dialect.

**Done gate:** generic suite passes in Node and Bun without a DOM shim, JSON/
MessagePack interop passes, and an installed package can author/render the test
dialect without importing Gramlot or DOM JS. Inspect the runtime dependency graph and
source for browser-only APIs; exercise traversal and finalization with browser
globals absent, not merely module import.

<a id="gc-088-030"></a>

## 030 · Phase 3 — Establish the HTML/DOM dialect

**Deliverables:** the HTML grammar, concrete renderer and native element handler
in DOM JS, consuming Builder JS. Move browser-specific finalize and generic DOM
mutation/lifecycle behavior out of the base and out of Gramlot where appropriate.
Agree renderer hooks for Gramlot references and cleanup instead of duplicating
rendering code. Preserve public behavior while reducing responsibilities.

**Done gate:** DOM JS alone renders native HTML Source and handles insert/delete/
update, ordering, fragments, scalar text, void elements and cleanup. Subscriber
callbacks see a complete tagged node. Tests use jsdom plus real Chromium; generic
Builder tests still run without a DOM. No CSS shorthand or widgets added.

<a id="gc-088-035"></a>

## 035 · Phase 4 — Reconnect Gramlot and verify distribution boundaries

**Deliverables:** thin GramlotBuilder and GramlotRenderer specializations over the
agreed public packages; retained Python `page/`, `server/`, `db/` ownership; main
and remote Source preprocessing before observed insertion. Remove obsolete mixed
imports, duplicate implementation and transitional snapshot/hydration code if any
is found. Keep the same declared browser behavior across Python and JS pages.

Expose server/browser package entry points and include shared vocabulary/assets
in distributions. Settle how a clean consumer obtains the JS package currently
located under core `js/`; a Git dependency must not pretend the root contains an
installable package when it does not. Python remains installable by pip.

**Done gate:** wheels and npm archives install into clean consumer environments,
without sibling source paths, symlinks or editing dependencies inside node_modules.
During extraction, install a complete isolated artifact dependency graph. Final
source consolidation must then permit a fresh floating-dependency install from
accepted upstream sources. No lockfile/version cap for first-party packages and
no package release is implied. Re-run core, cross-language and browser tests.

<a id="gc-088-040"></a>

## 040 · Phase 5 — Make the six hosted profiles executable

Start with one vertical slice: Python ASGI + Uvicorn and JS Node. Once those work,
add FastAPI, Kajenn, Flask and Bun using the same neutral contracts. Framework
adapters live in their owning repositories, not in example page code. Confirm
Kajenn's actual integration protocol instead of relabeling the ASGI fixture.

**Initial inventory:** the FastAPI, Genro ASGI/Kajenn and Flask repositories
contain real adapters, but they use the older PoC hosting APIs. Node owns a real
listener using the old embedded-Source/runtime protocol; Bun has no reusable
bridge yet. All six example server profile directories remain placeholders.
Port these adapters to the clean Host contracts rather than relabeling their old
coverage. The generic ASGI adapter destination remains to be assigned; the Node
repository is a proposed home for both Node and Bun bridges.

Distribution work must include a public installed browser asset: the current npm
archive includes source/resources but not the generated `build/assets/gramlot.js`,
and the Python wheel does not contain a browser runtime. The FastAPI first-party
wheel pin/PoC source override and Node's sibling-PoC runtime lookup must not be
carried into the new profiles. The inventory is source evidence, not a fresh host
compatibility test.


Each profile needs an application-owned configuration and documented start/stop
command that invokes reusable adapter code. Host behavior covers route→Page,
bootstrap/assets, prepared roots→main→typed Source, remote @source where supported
by this HTML slice, page-ID ownership/expiry errors, shutdown and cleanup.

**Done gate:** for every profile, start a real loopback listener; open Chromium;
assert one Hello World h1 and no console errors; exercise dynamic Source and a
remote HTML block in framework tests; stop without leaked server/worker processes.
Python page source is unchanged across its hosts; JS page source is unchanged
across Node/Bun. No database initializes; profile checks also verify that no DB dependency or
provider is loaded by the page. jsdom-only tests do not close this phase.

<a id="gc-088-045"></a>

## 045 · Phase 6 — Add bounded standalone HTML output

**Deliverables:** a narrowly defined native-HTML offline profile in core and
standalone, reusing the same builder/renderer and example declarations. For Python,
run authoring during build; for JS, the proposed first profile also executes
authoring during build and embeds its result in the browser bundle. Runtime
browser authoring is not required by this first offline profile. Embed typed Source,
required recipes, assets and runtime, with notices/provenance and no external
imports. Select an explicit offline transport/bootstrap contract; do not fake an
HTTP response in application code.

The current standalone compiler gate requires multipage, data import/export,
printing and other capabilities outside this milestone. Introduce an explicit,
versioned native-HTML capability profile, rather than advertising those unsupported
capabilities or weakening the broader profile's checks. Revise the old ordinary-Bag
hydration requirement to native typed SourceBag. Reject unavailable remote/server
operations clearly; do not simulate a backend.

**Done gate:** generate Python-authored and JS-authored artifacts, open via file://
in Chromium with network blocked, render the same Hello World, apply native Source
mutations in framework tests, dispose cleanly and observe zero network requests.
No Python or Node process is needed when opening the generated artifact.

<a id="gc-088-050"></a>

## 050 · Phase 7 — Close the native HTML milestone

Run the full fresh-install matrix and retain commands, source revisions and test
results. Update the two repository maps and paired guides: internal operations,
user class/host/page documentation, supported profiles and explicit omissions.
Complete destination port reviews. Consolidate verified and accepted work on
develop, then main under the owner's policy; keep pushes/releases/deployment
separate from this planning request.

**Done gate:** a developer can follow documented installation and profile commands
without private checkout paths, ad hoc patches or manually replacing installed
packages. Host/offline limits are honest. The same small Python/JS application is
usable and database-free. An unfinished profile stays marked incomplete; it is
not hidden by an aggregate green test count.

<a id="gc-088-055"></a>

## 055 · Sequence and agent allocation

```text
0 Contracts / repository decisions
└── 1 Behavioral baseline
    └── 2 Generic Builder JS
        └── 3 HTML / DOM JS
            └── 4 Gramlot + package consumers
                ├── 5 Host adapters + example profiles
                └── 6 Standalone profile
                    └── 7 Full matrix + documentation + acceptance
                        (requires both 5 and 6)
```

Use Sol agents for bounded implementation streams; the coordinating agent reviews
changes and integration results. A Bag agent is only warranted when a failing
contract identifies a Bag defect. Assign one agent to generic Builder, then one
to DOM once the generic API is fixed; avoid simultaneous edits to an unsettled
shared contract. Core integration and package consumers are reviewed centrally.
After phase 4, Python hosts, JS hosts and standalone can run independently with
separate owned files. Maps and documentation follow each completed phase.

The first actionable work is phase 0 and the baseline, not more application pages
or database scaffolding. No implementation is executed merely by writing this plan.
