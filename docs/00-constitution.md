# Gramlot product constitution

[Concise version](../docs_llm/00-constitution.md).

## 1. Authority and amendments

This constitution contains agreed product principles. Proposals, examples, PoC
behavior and open questions are not constitutional merely because they are recorded.
Later explicit owner decisions supersede earlier statements.

Every decision requires explicit owner confirmation before implementation or
recording it as approved. Agent proposals and interpretations remain proposals;
silence, existing code and successful tests are not confirmation. Record the
concrete decision, its scope and the owner's confirming words or a retrievable
reference. An agent-authored record is not independent evidence of owner approval.
Ask one decision question at a time and wait for the answer; address the owner's
questions before proceeding. An explicit owner instruction establishes that
decision without requiring a redundant confirmation. See amendment 11.43.

Every request and port is checked against these principles. On conflict, identify
the affected principle before implementing the conflicting part. Resolve the conflict
by adapting the work or through an explicit owner amendment. An amendment records its
date, changed principle and superseded decision in this document and its concise
mirror. Port preparers, reviewers and LLMs cannot amend architecture independently.

## 2. Product identity and boundaries

Gramlot is an independent framework for declarative application interfaces. Python
is the primary application-authoring language; a JavaScript runtime implements
browser behavior. The intended license is Apache 2.0.

The Gramlot core is independent of server and database technology. Server adapters
connect pages and services to hosts. Database adapters implement shared database
contracts. Hosting and database selection are independent choices.

No formal semantics for the term **Live Object Tree** have been approved. The name
does not authorize an inferred object model, lifecycle or protocol.

## 3. Application authoring

Anything presented as a Gramlot application, example, demo or PoC uses Gramlot
Source, Data Bags, bindings, controllers, resolvers and shared components for its
interface, state, interactions and requests.

Application code does not bypass the framework with direct DOM construction or
manipulation, manual DOM event wiring, input scraping, ad hoc fetch calls or parallel
UI/state machinery. Native browser operations belong inside reusable framework
internals and components. When a capability is missing, record the gap and stop
the affected work pending explicit owner confirmation; an application assignment
does not authorize framework implementation. Amendment 11.44 provides a bounded
exception for the provisional example runner, using ordinary HTML IDs.

Application examples show Python first. Small local JavaScript expressions may be
used where appropriate; large JavaScript strings or support files must not hide the
application from Python authors.

## 4. Source, Data and behavior

Source describes interface structure and declared behavior. Data Bags hold state.
Bindings connect declarations to Data; controllers react to changes and events;
resolvers provide data through explicit contracts. Not every Source node creates DOM.

Useful behavior must define ownership of Data writes, lifecycle, cleanup and failure
handling. Reusable classes composed from bases, mixins and collaborators state their
requirements, conflicts and instance-isolation rules. Python-authoring, browser and
server mixins are separate mechanisms.

These principles do not approve a final class hierarchy or mixin composition API.

## 5. Legacy and PoC evidence

GenroPy legacy is the nearly ideal behavioral reference because it contains a broad,
proven feature set. Preserve useful mental models, familiar authoring and behavior
where possible. Do not reproduce Dojo constraints or complicated implementation
mechanisms merely because they existed. Record intentional incompatibilities.

The living `gramlot-poc` repository contains history, pages, tests, inventory and new
experiments. Its code and successful tests are evidence, not automatic product
contracts. The inventory distinguishes observed, proposed, agreed and verified
behavior; an inventory entry is not an implementation commitment.

Gramlot grows through small, reviewed ports. Each accepted increment has a bounded
contract, assigned responsibilities, implementation, meaningful verification,
documented omissions and destination review.

The owner explicitly authorized making `gramlot-org/gramlot-poc` public on
2026-09-17, superseding the temporary privacy decision of 2026-09-16. The
repository is public. This specific authorization does not authorize visibility
changes for other repositories or imply product acceptance of PoC evidence.

## 6. Components, recipes and composition

A component exposes a control through parameters, values, events and lifecycle. A
controller reacts to Data and events. A recipe composes ordinary Source nodes. A
service or handler provides shared behavior behind a contract. A mixin adds a
reusable capability to a class.

These responsibility categories guide review. Concrete bases, mixins, collaborators,
method precedence and initialization/cleanup order are approved incrementally rather
than inferred from prototypes.

## 7. Integration repositories

**Integration repositories** (short: **integration repos**) own the adapters and
instructions needed to install, configure and try Gramlot in specific execution
environments. Gramlot core owns shared contracts and remains independent of server
and database technology; an integration may depend on core, never the reverse.

| Repository | Integration environment |
| --- | --- |
| `gramlot-fastapi` | FastAPI |
| `gramlot-flask` | Flask |
| `gramlot-kajenn` | Kajenn, the new product name for Genro ASGI |
| `gramlot-minimal` | Python with Uvicorn through the generic ASGI adapter; JavaScript in a browser Worker without a server |
| `gramlot-js-server` | Node.js and Bun |
| `gramlot-django` | Django |

`gramlot-minimal` replaces the repository name `gramlot-standalone`; standalone
remains the browser/Worker profile name. It owns the generic Python ASGI adapter
and the existing single-HTML exporter. Core retains shared Host/Page execution and rendering. Minimal owns standalone
Worker integration and startup (amendment 11.46). `gramlot-kajenn` is the approved destination name for `gramlot-genro-asgi` and owns
Kajenn-specific integration, consuming the generic ASGI adapter from Minimal. The
inspected local checkout and configured origin still use `gramlot-genro-asgi`;
the remote rename is not verified. This clarification does not rename a repository.
The upstream Python distribution/import remains `genro-asgi`/`genro_asgi` until
its owning project actually renames it. Do not invent an upstream package alias.

Category membership does not establish release compatibility. The owner has
authorized bounded Django native alignment; its acceptance requires its own tests. Published 0.1.0 archives retain their original names and contents;
new development uses the reorganized package ownership. No compatibility wrappers,
registry releases, deployment or new core feature contract are implied.

## 8. Database adapters

Database work is divided into:

- `common`: shared contracts and behavior;
- `fake`: controlled contract verification without a real database;
- `genropy`: GenroPy-specific implementation and capabilities;
- `sqlalchemy`: SQLAlchemy-specific implementation and capabilities.

SQLite is a backend usable through SQLAlchemy, not a separate adapter category.
Capabilities are classified as required minimum, common optional or
implementation-specific. Supporting the common contract does not imply supporting
extensions. Advanced GenroPy capabilities retain their boundary; `auxColumns` is
GenroPy-specific.

The agreed standard dbSelect direction is prefix search followed by containment,
with case-sensitive and case-insensitive modes. Exact fallback and result contracts
must be stated by the accepted component/adapter port. `dataRecord`, `dataSelection`
and the general capability protocol remain unapproved until their contracts land.

## 9. Documentation and claims

Product documentation describes accepted Gramlot behavior rather than the migration
journey. Pair `docs/<path>` with `docs_llm/<path>` and update them together. Concise
documents use fewer words while retaining decisions, constraints, status and open
questions in human-readable sections.

Use numbered sections and points for stable references. Use Mermaid when a diagram
clarifies architecture or application flow; use text for folder trees. Maintained
technical documentation and code are in English.

Across Gramlot repositories, maintained guides use three-digit filename prefixes,
initially spaced by five (`005`, `010`, `015`). Expanded and concise views share
paths, ordering prefixes, logical document IDs and section block IDs. Each
repository uses a distinct namespace; IDs remain repository-wide across folders.
Level-two sections have explicit stable HTML anchors shared by both views.
Insert into numbering gaps without renumbering or reusing existing IDs. Reordering
or moving content preserves IDs and anchors and requires link updates; IDs do not
redirect old URLs. Mirror any folder structure between the two documentation trees.
Entry points, configuration, requirements, assets and historical standalone exports
are exempt from guide numbering. Record legacy coverage gaps explicitly and add
missing mirrors when guides are substantially revised. See the
[documentation policy](005-documentation-policy.md) for namespaces and migration status.

All Gramlot documentation sites share the classic Read the Docs theme illustrated
by Genro Bag: blue header, dark sidebar and light content with default theme
typography. Use `sphinx_rtd_theme` for Sphinx or the `readthedocs` port for MkDocs.
Preserve each project's logo and accurate status notices. This applies to current
and future documentation sites; application UI themes remain a separate concern.

Do not claim an API, implementation, compatibility level, release or verification
before the corresponding artifact and meaningful tests exist in its owning repository.

## 10. Development and acceptance

Across Gramlot, `main` is the consolidated, public reference line for code,
documentation, configuration and other maintained artifacts. `develop` carries new
work until it is verified and accepted, then that work is consolidated into `main`.
Public documentation uses `main` by default; a development preview may follow
`develop` separately. This is a general project rule, not a Read the Docs exception,
and does not itself authorize package publication, releases or deployment.

A port advances
only after its contract, code, tests and paired documentation agree. Relevant server
or database adapters may advance alongside a core increment; acceptance does not
require every host/backend combination in the first slice.

Framework gaps exposed by real Gramlot applications are valuable evidence. They are
resolved in the appropriate reusable layer and are never hidden by application-local
workarounds.

## 11. Amendment record

- **11.1 — 2026-09-16:** Initial clean-repository constitution, consolidated from
  approved owner decisions. No prior product-constitution document is superseded.
- **11.2 — 2026-09-16:** Owner clarified the branch policy in section 10 for all
  Gramlot artifacts: `main` is the consolidated public reference; `develop` holds
  new work until verified and accepted. This supersedes the shorter section 10
  statement, "`main` is the consolidated line; `develop` carries new development."
  Separate publication, release and deployment authorization remains required.
- **11.3 — 2026-09-16:** Owner extended Django's documentation ordering and stable
  reference directive to Gramlot generally. Section 9's generic numbered-reference
  instruction is refined by three-digit guide ordering, repository namespaces,
  shared document/block IDs, explicit anchors and preservation across moves.
  Existing pairing and claim-accuracy requirements remain in force.
- **11.4 — 2026-09-16:** Owner selected the Genro Bag classic Read the Docs
  appearance for all Gramlot documentation. Section 9 now mandates that shared
  theme, superseding the earlier per-repository Material/Furo selections.


- **11.5 — 2026-09-16:** Owner keeps the PoC private until further instruction.
  Section 5 records this visibility constraint; section 10's public-reference
  wording does not grant permission to expose private repositories. No product
  architecture or port acceptance rule is superseded.

- **11.6 — 2026-09-16:** The owner explicitly authorizes JavaScript-first page
  authoring for the local/private `gramlot-nodejs` PoC, hosted with native
  `node:http` and without database integration. For this bounded experiment only,
  this supersedes sections 2–3's Python-first requirement. Source, Data Bags,
  bindings, controllers, resolvers, shared components and host independence remain
  mandatory. The exception does not change the primary language of other Gramlot
  applications or authorize publication, deployment or core port acceptance.

- **11.7 — 2026-09-16:** Owner requires every demo to expose a Show source button
  and the shared Inspector launcher in a bottom corner, with polished, engaging
  visual presentation. This adds a demo presentation requirement to section 3;
  it does not supersede Gramlot-only authoring or change documentation-site themes.
  Existing demos outside gramlot-nodejs have not yet been audited for compliance.

- **11.8 — 2026-09-17:** Owner explicitly authorizes public visibility for
  `gramlot-org/gramlot-poc`. Section 5 supersedes the temporary privacy constraint
  recorded in amendment 11.5. Architecture, port acceptance and authorization
  requirements for other publications remain unchanged.

- **11.9 — 2026-09-17:** Owner authorizes public repositories and source pushes
  for `gramlot-standalone`, `gramlot-flask` and `gramlot-nodejs` in gramlot-org.
  This supersedes the local/private restriction for the Node.js PoC in amendment
  11.6; its bounded authoring exception remains unchanged. No package release
  or application deployment is authorized by this source-publication decision.


## 12. First-party dependency updates

Owner decision, 2026-09-19: never pin or cap dependencies owned by the Genro/Gramlot
team. Do not freeze them through exact versions, bounded version ranges, Git tags,
commit hashes or lockfiles. Follow the upstream default/development branch for Git
dependencies and unconstrained published versions for package dependencies.
Setup/update must refresh them; installed environments do not update themselves.
Detect regressions with tests and fix/report them rather than silently restoring
an old pin. Third-party dependency policy is unchanged.

Amendment 11.10 — 2026-09-19: adds this first-party dependency rule; supersedes
first-party pins introduced during PORT-0001 preparation. No earlier constitutional
rule is superseded. Test records may retain exact revisions as historical evidence.


<a id="gc-000-130"></a>

## 13. One agreed primary path

Owner decision, 2026-09-20: implement only the agreed primary path. An agent must
not independently add compatibility layers, parallel input representations, aliases,
coercion/normalization fallbacks or permissive dispatch for unsupported inputs.
Use the declared classes and their methods directly. Reject inputs outside the
contract at the relevant boundary; do not silently adapt them to make them work.
This does not forbid expressly agreed adapters, dialects or extension points.

For Gramlot rendering, Source is a `SourceBag` containing `SourceBagNode` objects.
Their additional methods are required. Ordinary Bags remain valid Data containers,
but are not an alternative Source representation. Reading `attr.tag` as a fallback
for `node.nodeTag`, accepting any object with `getNodes`, or converting a plain Bag
into Source to hide a caller defect is outside this contract.

A missing capability belongs to its owning library. Fix it there when the agreed
contract is clear. Otherwise report the gap and ask the owner before implementing
an alternative; unaffected agreed work can continue. Tests passing, existing code,
PoC behavior and imagined future consumers do not authorize an extra path.

Every new class, stored state or execution path must have an agreed responsibility
and a concrete consumer. Review the actual diff against those decisions before
acceptance, including delegated work. Unrequested compatibility is a design defect,
not an optional cleanup. Tests for a corrected boundary must establish both the
supported behavior and rejection of unsupported representations; tests alone do
not establish architectural necessity.

Only an explicit owner decision may authorize an exception or relax this rule.
Record its scope and amendment here before implementation; agents cannot grant
exceptions to themselves or their delegates. This is a maintained project contract,
not a claim that instructions technically prevent every possible agent mistake.

Amendment 11.11 — 2026-09-20: adds §13 at the owner's direction. It reinforces
§4 and §10 and supersedes earlier preservation of ordinary-Bag Source compatibility
and the open SourceBag-versus-Bag choice in GC-093/GC-094. It does not authorize
new compatibility elsewhere. Recipes and their related defects remain deferred.


Current reading order (2026-09-22): §13 is the primary-path rule; §14 includes approved Gramlot adapter work while Builder/Bag remain read-only for this workstream. Amendments 11.14 and 11.16 assign ordered Collection composition and bounded Python authoring; 11.18 supersedes 11.17 for JavaScript `sourceTarget`. Dated Builder corrections below were bounded exceptions, not general permission. The active release plan is [GC-110](internal/110-native-html-readiness.md#gc-110-020), with current status in [GC-070](internal/070-work-status.md).

<a id="gc-000-140"></a>

## 14. Current repository work boundary

**Current naming clarification — 2026-09-24:** In the dated decisions below,
`gramlot-nodejs` is now `gramlot-js-server` (11.32), and `gramlot-standalone` is now
`gramlot-minimal` (11.19). Kajenn's approved destination name is `gramlot-kajenn`;
the inspected checkout/configured origin remain `gramlot-genro-asgi`. Historical
names preserve the original decision scope and do not identify additional repos.

Owner decision, 2026-09-21: subsequent work is restricted to Gramlot. Builder JS
and Bag JS are dependencies to inspect read-only, not repositories to modify
from this workstream. Do not edit their installed source copies either. Report
missing capabilities or defects to their owning projects; do not compensate with
Gramlot compatibility paths or duplicated implementations. Only an explicit owner
instruction can reopen direct changes to these dependencies.

Owner clarification, 2026-09-22: for agreed Gramlot work, "Gramlot" includes its
connected adapter repositories. The native HTML lifecycle work may update
`gramlot-nodejs`, `gramlot-fastapi`, `gramlot-flask` and `gramlot-genro-asgi` in
their owning layers. Builder JS and Bag JS remain read-only dependencies under
this work boundary.

Amendment 11.15 — 2026-09-22: clarifies the scope of section 14 and supersedes
its interpretation as restricting all work to the central `gramlot` repository.
It does not reopen direct Builder JS or Bag JS edits or permit consumer workarounds.

Amendment 11.16 — 2026-09-22: the owner directs that the Python authoring fix for
0.1.0 be implemented in Gramlot's `GramlotBuilder`, not generic Builder Python.
For this bounded dialect, Gramlot owns loading its packaged `builder_grammar` 1.1
HTML collection and additional collections, registering the existing `SourceBag`
for typed transport, and preserving mixed text and atomic child insertion. This
supersedes section 13's generic-library ownership rule and the prior GC-092
assignment only for these Python authoring responsibilities. It does not authorize
alternate Source representations, dependency source edits or publication.

Amendment 11.17 — 2026-09-22: the owner extends the same 0.1.0 ownership choice
to Gramlot's JavaScript builder. Gramlot owns the mapping from its fluent authoring
handles to their Source targets, including handles created by native sub-builders.
Gramlot must not require the generic Builder's `sourceTarget` export for this task.
This narrowly extends amendment 11.16; generic Builder source remains read-only and
its BuilderBase, SourceBag, grammars and render traversal remain dependencies.

Amendment 11.18 — 2026-09-22: the owner requires Gramlot JavaScript and fresh
installers to consume the latest maintained generic Builder JS implementation.
This supersedes amendment 11.17's local handle mapping: Gramlot uses the generic
`sourceTarget` export and does not maintain a duplicate. The maintained generic
source must be made available to installers before 0.1.0 can pass a clean install.
This decision alone does not authorize package publication or a release.

Amendment 11.12 — 2026-09-21: supersedes earlier authorization to modify Builder JS
and Bag JS directly during consolidation. This narrows execution scope without
changing their architectural responsibilities or the no-workaround rule in §13.


Amendment 11.13 — 2026-09-21: the owner reopens Builder JS solely to remove
functionality outside the Python-port contract and verify remaining implementation
against Python and explicitly accepted adaptations. Keep version 0.1.1 unchanged.
This bounded exception supersedes section 14 only for that correction; Bag JS
remains read-only. No publication or general dependency-development authorization
is implied.


Amendment 11.14 — 2026-09-21: the owner authorizes changes to both Python and
JavaScript Builder JSON loading for ordered Collection composition. Additional
collections contain only additions and changes. Omitted/null fields preserve
previous definitions; matching declarations merge, named attributes/child rules
are added or updated. No removal marker or replacement marker is introduced.
Collection owns the JSON document, composition and export in both languages;
removal methods and HTML documentation generation are deferred. This supersedes
the earlier full-declaration replacement proposal and reopens section 14 solely
for this shared implementation. No version bump, Bag changes or publication.


### Local version refresh authorization — 2026-09-21

Owner authorizes patch bumps to Builder Python 0.23.3 and Builder JS 0.1.2 and
local installation in Gramlot. This supersedes only the unchanged-version
constraints of the preceding Builder cleanup and Collection amendments. It does
not authorize publication, unrelated Builder changes or Bag changes.


### Event-driven rendering decision — 2026-09-21

Owner explicitly removes speculative DOM construction and whole-Source validation
on each mutation. Gramlot consumes native Bag events and updates the affected
node/subtree. Incoming main/remote Source is validated at reception. No Source
projection, prepared-DOM token cache, renderer pre-write veto or Source rollback
is part of this contract. This supersedes the provisional pre-write DOM guarantee
recorded in earlier review documents; it adds no binding or Bag/Builder changes.


### Explicit branch freeze/unfreeze — 2026-09-21

Owner approves synchronous FIFO rendering normally and explicit branch-local
freeze/unfreeze. While frozen, Source continues changing and rendering events for
the branch are discarded, not deferred for replay. Unfreeze releases the branch
and all descendants and renders its current Source once; a still-frozen ancestor
keeps rendering suspended until its own unfreeze. There is no automatic timer,
transaction, rollback or Data binding. This settles the overlap question in GC-070.
Implementation belongs to Gramlot's live renderer, not generic Bag or Builder.


Binding extension confirmed 2026-09-25: freeze suspends structural Source rebuilding,
not Data reactivity. Formulas/controllers and Data-driven binding updates to already
built elements remain active; discarded nodes are cleaned up immediately even while
frozen. Owner confirmation: "ok" after the legacy code trace and the explicit
recommendation to freeze structural rebuilding while retaining controllers and
bindings on existing elements. This extends the previously unassigned Data-binding
behavior; it preserves the existing Source FIFO, frozen-event discard and nested
unfreeze rules. It supersedes only an unapproved independent proposal to suspend all visual
updates, not an earlier owner decision. This is an approved 0.2.0 contract, not a
claim that binding has been implemented.


### Standalone execution language and host direction — 2026-09-21

Owner chooses Python pages on Python servers only. JavaScript pages can execute
on Node, Bun or a browser-local standalone host using the same Page/main/remote
Source contracts. This supersedes Python-to-static-standalone compilation as the
target architecture; the existing implementation has not yet been migrated.
A Worker is a candidate for that local host, authorized for feasibility evaluation.
IndexedDB persistence is exploratory; no database adapter or universal file://
compatibility is approved or implied.


### Worker standalone implementation approved — 2026-09-21

Owner approves implementing the dedicated Worker as the standalone JS host, with
database work excluded. This supersedes the feasibility-only scope above. Reuse
Host/Page/main/remote Source execution; replace build-time Python/JS page compilation.
Python pages require a Python server. Single-HTML packaging remains unresolved where
it requires a missing generic Builder capability; this does not authorize dependency
changes, handwritten production HTML generation or a compatibility fallback.


### Attribute templates and explicit raw HTML — 2026-09-21

Owner explicitly authorizes changes and patch bumps in both Builder Python and JS,
overriding section14 for this scope. Explicit later owner authorization is an
override, not a reason to ask for repeated approval. `${name}` substitution applies
only to attributes; a preceding backslash escapes the token and is removed. Node
values retain template text verbatim (pointer/resolver resolution is unchanged).
In static HTML rendering, a terminal `::HTML` marks raw markup and is stripped;
it does not enable template evaluation. Update Gramlot's local dependencies after
bumping both libraries; no publication is authorized.


### Standalone packaging command — 2026-09-21

Owner approves one Node/npm exporter replacing the Python packaging command.
No Python-to-Node compatibility bridge is retained. Standalone owns bundling and
HTML packaging using HtmlBuilder; core owns Worker hosting and Page execution.
This supersedes the provisional Python compiler-provider/complete-v1 packaging
path, without authorizing database, multipage or recipe implementations.


### Source subclass ownership correction approved — 2026-09-21

Owner explicitly authorizes applying the verified Python-inspired ownership
correction to Builder JS. This reopens §14 solely to initialize SourceBagNode
ownership through upstream Bag's existing nodeClass construction and remove
Builder's dependency on the local Bag._createNode hook. Bag remains unchanged.
No compatibility fallback, unrelated tag API, version bump or publication is
authorized. This supersedes the inspection-only boundary for this correction.


### Live element-type replacement — 2026-09-21

Owner approves deletion followed by insertion when changing an element's type
in this step. In-place tag-only mutation is outside the current live contract,
matching the absence of tag-only notification in Python and upstream JS Bag.
This supersedes tests relying on the local extended BagNode.setValue tag argument;
it does not authorize changing Bag or introducing a Source tag-mutation API.


### Builder validator-test cleanup approved — 2026-09-21

Owner authorizes the reviewed Builder JS cleanup: remove tests/parts requiring
the unapproved local Bag mutation-validator API, preserve insertion ownership and
subscriber-error checks, and assess pre-insertion ownership restoration against
actual upstream failures. This extends the bounded §14 exception to that cleanup;
Bag remains unchanged. No new validation API, bump or publication is authorized.


### JavaScript Host / HTTP boundary approved — 2026-09-21

Owner approves separating HTTP request parsing, endpoint routing, request identity
extraction and response mapping from neutral JS Host execution. The Node/Bun
adapter shares that HTTP implementation; Host retains page registration, bootstrap,
main/source execution and owner checks. Worker uses the same neutral methods.
This supersedes Host.fetch/ownerForRequest ownership; no compatibility forwarding
method or new class is required. No page-close protocol or grammar policy change.


### Amendment 11.19 — Integration repositories — 2026-09-24

Owner defines the six integration repositories in section 7, accepts the names
`gramlot-minimal` and `gramlot-kajenn`, and authorizes their reorganization with Sol
agents. This supersedes section 7's earlier three-repository server-only list and
the standalone repository's browser-only scope: minimal also owns generic Python
ASGI/Uvicorn integration, transferred from the Kajenn repository. Core host
independence, the Worker runtime boundary and section 13 remain unchanged.


### Amendment 11.20 — Django native integration — 2026-09-24

Owner explicitly adds alignment, correction and publication of `gramlot-django`
to the integration-repository work. This authorizes its native HTML/Host/Page
integration and GitHub source/archive delivery, superseding the earlier decision
to leave Django entirely outside this implementation phase. It does not expand
the immutable core 0.1.0 release evidence, approve migration of PoC ORM/features,
authorize registry publication or application deployment, or change core ownership.


### Amendment 11.21 — Integration publication deferred — 2026-09-24

Owner clarifies that GitHub publication of the integration repositories is
premature and must follow additional reviewed transfer and cleanup steps from
`gramlot-poc`. This supersedes the publication authorization in 11.20 and any
inferred permission to publish the current minimal/Kajenn reorganization. Continue
agreed implementation, documentation and verification locally only. Do not push,
rename GitHub repositories, create tags/releases or publish packages until the
owner explicitly reopens publication. The already published core 0.1.0 release
remains unchanged. This does not authorize bulk ports of unapproved PoC behavior.


### Amendment 11.22 — Core examples, runner and shared theme — 2026-09-24

Owner authorizes a local, usable HTML/SVG teaching suite in core: twelve paired
Python/JavaScript pages under `examples/html_svg`, each with its own README,
progressing from Hello World to methods and loops. Python remains the first
explanation; equivalent JavaScript is explicitly part of this suite. This supersedes
GC-140's earlier Hello-World-only example scope and its blanket allocation of all
example pages to the separate integration example repository. The existing
`gramlot-examples` integration smoke application remains separate and unchanged.

The owner separates examples from their runner: code viewing and Inspector access
are runner responsibilities, superseding amendment 11.7's interpretation as controls
inside every example. The initial runner lives in `examples/00-runner`, with an
example list, native HTML/CSS language panels containing iframes, and an initial
HTML element catalogue. This does not approve a new Gramlot tab component or
application-local DOM events, fetches or parallel state. Missing Inspector APIs
remain explicit gaps, not permission to import the PoC or invent an Inspector.

The shared application theme lives outside examples in `themes/gramlot-base`, uses
the approved Gramlot palette, modern CSS and semantic tokens, and documents the
model for future themes. Runner and examples consume the same theme. HTML/SVG
construction, native browser controls and static local data are the bounded scope;
bindings, controllers, databases and PoC transfers remain excluded. Host adapters
remain in their owning integration repositories; development launch composition
belongs to the runner, never to the core runtime. All work stays local; no new
publication, release, dependency-source edits or deployment is authorized.


### Amendment 11.23 — Runner example tabs and integration-owned language — 2026-09-24

The owner rejects the language-tab interpretation in 11.22 and directs a compact
list of titles on the left, with one opened/active example tab on the right. Each
tab contains a description and explanation above its iframe. Selecting another
example keeps previously opened tabs; selecting an existing tab reactivates it.
The serving integration determines Python or JavaScript, with no language selector.
The subsequent instruction is to implement this correction.

This supersedes 11.22's language-panel design and, solely for the requested
open/reactivate behavior, its exclusion of a shared HTML tab implementation.
The implementation belongs to Gramlot's reusable browser layer: HTML Source
declares the buttons/panels/frames, a bounded tab component owns its active/open
state in a Bag and updates Source attributes, and renderer cleanup owns listeners.
Runner pages contain no application-local DOM handlers or fetch. This is not
a generic binding/controller API, a new grammar dialect, a component registry,
closeable/reorderable tabs or an Inspector. Existing runtime/dependency/publication
boundaries remain unchanged; no PoC code is involved.


### Amendment 11.24 — Runner introduction, split preview and source — 2026-09-24

The owner requests an initial introduction tab containing only a brief explanation
of the runner and its use, without an iframe. All example titles remain in the
left navigation. Example panels keep their explanation above a horizontally split
area: preview iframe on the left and the integration-selected source code on the
right. The divider is adjustable. Syntax highlighting uses `hljs.highlightAuto`;
the owner explicitly withdrew the accidental `th_symbo` reference.

This supersedes the automatic catalogue opening in 11.22–11.23. A bounded shared
HTML splitter and code-highlighting view belong to the reusable browser runtime;
Source declares their content, the splitter keeps its position in a Bag, and the
renderer owns their lifecycle. Runner pages read their own example source on the
host and declare it as text; they do not add browser requests or event handlers.
This does not authorize an Inspector, general component registry, dependency-source
edits or publication.


### Amendment 11.25 — Remove catalogue from runner — 2026-09-24

The owner explicitly rejects the HTML catalogue as confusing. Remove it from the
runner navigation and host routes. The runner exposes only its introduction and
the twelve numbered examples. This supersedes 11.24's catalogue list entry; the
old specimen files remain historical material, not a served example.


### Amendment 11.26 — Compact runner and rendered README — 2026-09-24

The owner requests compact typography and spacing, each README rendered above
the preview/code panes, removal of redundant source/README links, and an opt-in
keyboard-navigation checkbox at the bottom of the sidebar. Shared tab behavior
owns the checkbox state in a Bag and Source attributes; keyboard navigation and
its sidebar focus decoration are initially disabled. A reusable Markdown view
renders host-provided README text, with sanitization, under renderer lifecycle
ownership. This bounded view is not application-local DOM construction. Theme
colors must follow the existing approved brand and application palette.


### Amendment 11.27 — Runner theme selector and logo — 2026-09-24

The owner adds the Gramlot logo above the example list and a light/dark selector
at its bottom. Shared theme behavior owns the selection in a Bag, projects it
to Source and applies the theme to the runner document and its same-origin example
iframes, including frames opened later. This is bounded presentation behavior
with renderer-owned listener cleanup; no application event wiring or persistence.


### Amendment 11.28 — Example categories and preview proportion — 2026-09-24

The owner requests a 65% preview / 35% source default and slightly smaller code
type. The sidebar groups the current examples below an HTML / SVG category.
Selecting the category opens its folder README as a Markdown-only tab, without
an iframe. Shared tab behavior explicitly supports category panels. Future
binding categories will use the same structure; no binding examples are added
in this increment.


### Amendment 11.29 — Static-directory runner export — 2026-09-24

The owner requests the complete examples runner standalone and explicitly selects
a static directory rather than a single offline HTML file. This authorizes a
bounded multi-page static export in the Minimal integration: a runner document,
one document/Worker per JavaScript example, and local theme/source/README/logo
assets. It supersedes the earlier exclusion of multi-page packaging only for
this directory profile. A plain HTTP file server is sufficient; no application
server, Node/Bun execution at runtime, database or file:// guarantee is implied.

Core keeps Worker/Page/main ownership and loads declared Page.css stylesheets
in standalone documents. Minimal owns bundling and HTML generation via HtmlBuilder.
Runner UI is shared by hosted and standalone configuration, with README/source
text supplied before bundling rather than filesystem access inside the Worker.
Do not strip Page.css, simulate Node APIs in the browser, precompute Page Source
or modify Builder/Bag dependencies. Connected Minimal adapter edits are within
this request; all publication restrictions remain in force.


### Amendment 11.30 — Direct local-file standalone directory — 2026-09-24

The owner corrects 11.29: selecting a directory did not mean accepting a server
requirement. The standalone export must open directly from its local index.html.
This supersedes the static-HTTP-only restriction. Minimal packages classic
bootstrap scripts containing bundled Worker text and starts Blob Workers, using
relative asset/page URLs rather than fetching Worker source or using file Workers.
Core standalone accepts an explicit export asset root for declared CSS resolution;
Page.css remains unchanged. Runner host configuration supplies its logo and frame
URLs without a second UI implementation.

File documents may have opaque origins. Shared core theme synchronization uses
a bounded parent/owned-frame postMessage protocol with sender-window checks and
light/dark values, for hosted and local-file execution alike. No application
event wiring, disabled browser security, dependency-source edits or protocol
fallback is authorized. Verify direct file URLs in the tested browsers and report
the actual evidence without claiming universal browser compatibility.


### Amendment 11.31 — Shared teaching sources and downstream integrations — 2026-09-24

The owner confirms Gramlot as the single source of framework documentation,
teaching pages, example READMEs, runner, logo and theme. Integration repositories
consume this material through their Gramlot dependency and own only their
environment-specific adapters, configuration, launch instructions and commands.
Do not maintain copied teaching suites downstream. Generated package/export
assets are permitted outputs, not independent sources. Update the dependency
and restart or regenerate exports to receive upstream changes; no automatic
refresh of installed environments is implied. This refines section 7 and
supersedes any interpretation that teaching examples should be independently
maintained per integration. Uniform packaging/launch implementation remains
pending; documentation of this decision does not authorize publication or
claim rollout completion. Historical fixtures remain separate evidence.


### Amendment 11.32 — JavaScript server integration name — 2026-09-24

Owner renames gramlot-nodejs to gramlot-js-server to describe both Node.js and
Bun. The repository, development package and current consumer imports use the
new name; native and bun entry-point responsibilities are unchanged. This
supersedes the name in section 7 and earlier development integration records.
Historical published archives remain unchanged. No compatibility alias, source
push, package release or deployment is authorized by this rename.


### Amendment 11.33 — JSR ecosystem migration authorized — 2026-09-24

The owner explicitly authorizes publishing TYTX to JSR and then migrating the
remaining Genro JavaScript packages in dependency order to remove GitHub package
dependencies. This supersedes section 14's read-only restriction for Bag/Builder
only for JSR packaging, necessary compatibility corrections, verification and
consumer dependency updates. First-party dependencies remain unpinned. This is
not approval for unrelated architecture changes, source pushes or application
deployments. Validate actual JSR artifacts before migrating downstream consumers.


### Amendment 11.34 — JSR minimum versions — 2026-09-24

Owner approves an exception to section 12 for JSR dependencies: declare a tested
minimum version without an upper bound when the registry rejects unconstrained
wildcards. TYTX starts at >=0.15.1, excluding the defective 0.15.0 artifact.
Exact pins, upper caps and first-party lockfiles remain prohibited. Owner also
approves Node.js 22 as the minimum supported Node runtime for the JSR packages,
alongside Bun and modern browsers.


### Amendment 11.35 — Compatible JSR dependency ranges — 2026-09-24

Owner approves compatible caret ranges for dependencies distributed through JSR,
e.g. ^0.15.1 for TYTX. This supersedes section 12 and amendment 11.34's prohibition
of upper bounds only for these dependencies: the publisher rejects minimum-only
native specifiers. When a new dependency series falls outside the range, update
the range, run the consumer tests and publish a new consumer version. Exact pins
and first-party lockfiles remain prohibited. Other dependency policy is unchanged.


### Amendment 11.36 — Genro JSR cooldown exemption — 2026-09-24

Owner approves a persistent minimumDependencyAge policy with age P1D and
exclusions jsr:@genro/* and npm:@jsr/genro__* for present and future Genro JSR
packages. External dependencies retain the 24-hour cooldown. The npm pattern
is JSR's compatibility distribution, not authorization to publish on npmjs.com.
Publish only to JSR in this migration. Published-artifact verification remains
required before downstream adoption. This supersedes the pending authorization
and waiting requirement in GC-070-150/155; no global protection disablement.


### Amendment 11.37 — Standalone example download ownership — 2026-09-24

The owner confirms that the ready-to-use standalone example ZIP belongs in
GitHub releases of gramlot-minimal, not core Gramlot releases. Gramlot remains
the sole maintained source of example pages, runner, READMEs, logo and theme.
Minimal owns the exporter and generated distribution, identifying the Gramlot
version used. Core documentation links to the Minimal download. This clarifies
section 7 and amendment 11.31; generated archives are not a separately maintained
example suite. The download is not yet published.


### Amendment 11.38 — Bounded live card removal example — 2026-09-24

The owner requests an × button on example cards to remove them using the browser
Builder/Source APIs, following the discussion of JavaScript-only actions. This
approves a short native onclick expression in both Python and JavaScript versions
of example 10. The action uses the existing browser Gramlot instance and labelled
Source path, calling SourceBag.popNode; only the renderer removes DOM nodes.
This narrowly supersedes section 3 and amendment 11.22's exclusion of application
DOM events for this demonstration. It does not authorize a general event/controller
API, Data binding, direct DOM manipulation, application listeners, timers, server
synchronization or a script-loading framework. No script import is needed for
this single expression. Hosted and standalone browser behavior must be verified.


### Amendment 11.39 — Richer live Source example with animation — 2026-09-24

Owner extends the live Source trial with a richer page and explicitly requests a
small setInterval animation. Example 13 uses paired Python/JavaScript declarations,
short native onclick actions for list creation/deletion/clear and text/SVG changes,
and a script that updates a circle's Source cx attribute every 50 ms. Browser
Builder.wrapSource creates elements; Source Bag/node APIs perform mutations.
The script registers clearInterval with renderer.onDispose on the animation
section; removing the section or disposing its page clears the timer. A microtask
lets the initial Source mount finish before registering cleanup. This extends
11.38's bounded exception to this example, including its script and timer. No
Data binding, general controller API, direct DOM updates, server synchronization
or relaxed standalone CSP is authorized. Hosted profiles are the verified target;
standalone inline-script restrictions remain a documented gap.


### Amendment 11.40 — Remove directory-export CSP — 2026-09-24

Owner explicitly requests removing the CSP introduced by the directory exporter:
the examples execute our own JavaScript. Minimal's generated directory documents
therefore omit that CSP meta tag. This supersedes the CSP-preservation wording in
11.39 and the pending CSP limitations in GC-070-210/215. Browser security settings
are unchanged. Standalone exposes its existing global Gramlot instance before
starting main, matching hosted bootstrap so inserted page scripts can access it.
Verify trusted inline actions, animation and cleanup from local files offline.


### Amendment 11.41 — Binding implementation requested — 2026-09-24

Following the legacy/PoC investigation, the owner requests a detailed plan and
Sol agents implementing the necessary binding work for 0.2.0. This opens core
implementation beyond the HTML/SVG-only scope of the 0.1.0 examples. SourceNode
context, relative/symbolic pointers, Data operations, dataFormula, dataController
and delayed execution belong together in this effort. GC-165 records execution
packages and gates. Preserve the existing public syntax decisions and owning-library
boundaries; unresolved transport, namespace and vocabulary differences are not
authorization to introduce alternate representations or aliases. Section 14's
Bag/Builder write restriction remains pending a specific binding scope extension.
No package publication, release or deployment is authorized by this instruction.


### Amendment 11.42 — Specialization versus upstream defects — 2026-09-24

Owner clarifies that Gramlot uses the Python and JavaScript Builder base classes
and is free to specialize them for its framework semantics. Differences from
GenroPy are not by themselves upstream defects or prerequisites for modifying
Builder/Bag. Implement Gramlot-specific behavior in its subclasses using the
existing public dependency APIs; this is the primary integration path, not a
compatibility workaround. Genuine dependency defects require a minimal executable
test and an issue in the owning repository. This clarifies sections 13–14 and
supersedes the blanket upstream-change gate in the initial GC-165 plan. Direct
dependency-source changes remain unauthorized for binding.


### Amendment 11.43 — Explicit confirmation of every decision — 2026-09-24

Owner instruction in the current review: "ogni decisione deve essere esplicitamente
confermata" (every decision must be explicitly confirmed). This strengthens section
1 and supersedes any interpretation that allows agents to turn proposals or
implementation choices into approved decisions without explicit owner confirmation.
Record the confirmed scope and its owner evidence; unresolved attribution remains
pending rather than being treated as approval merely because it appears here.
This rule does not retroactively approve or reject all earlier recorded decisions.

The owner's preceding clarification states that an assignment to create examples
authorizes work only on examples. If the frozen 0.1.0 framework cannot support a
requested example, report the missing capability and stop the affected work;
the request does not authorize framework changes or reopen the frozen release.
This clarifies sections 3 and 13: identifying a missing capability does not itself
authorize implementing it. In particular, do not infer approval for core components
from a request for runner behavior. Attribution of earlier runner/core decisions
requires review against explicit owner confirmation, not agent-written amendments
alone. No runtime change, release or publication is authorized by this rule.

### Amendment 11.44 — Remove runner-specific behavior from core — 2026-09-24

Owner explicitly directs removal of the core changes introduced for the current
runner, retaining their implementation inside the provisional runner where possible.
The runner will simplify when web components become available; this does not
approve a web-component API or authorize implementing those future components now.
Owner confirmation is the current task message following the reopening provenance
check (GC-070-260): remove those changes and keep the implementation in the runner.

Supersedes the core placement of runner tabs, splitter, highlighting, Markdown,
keyboard navigation and theme synchronization in amendments 11.23–11.28 and the
core placement of the frame-theme bridge in 11.30. Preserve historical records as
evidence, not approval for continued core ownership. The bounded exception to
section 3 permits these existing provisional browser behaviors, listeners and
sanitized text views in `examples/00-runner`, including runner-owned launch wrappers
for its frames. Keep HTML authoring in Gramlot Source and retain Bag state, Source
updates and existing lifecycle APIs. The owner additionally confirms using ordinary HTML `id` attributes to connect
runner behavior or embedded events. Use those IDs instead of introducing special
framework markers. This is not a general application-authoring exception or a new
marker/component contract in the framework.

If a behavior cannot be retained there with existing capabilities, report the gap
and stop that affected change rather than adding framework support. Preserve the
separately requested binding work and unrelated source changes. No dependency-source
edit, package publication or deployment is authorized. Future general components
require their own explicitly confirmed design.


### Amendment 11.45 — Standalone startup belongs in Minimal — 2026-09-24

**Superseded in part by 11.46:** Worker integration also moves to Minimal; the
proposal to export WorkerTransport from core was not approved.

Owner corrects the proposed destination of standalone integration support:
“più che nel runner, nel gramlot minimal” (current task, 2026-09-24).
The approved destination for stylesheet loading, export asset-root resolution and
making the app available during standalone startup is `gramlot-minimal`, rather
than the example runner or Gramlot core. This authorizes bounded connected adapter
work in Minimal under section 14 and refines amendment 11.44. It supersedes the
core placement of these additions in amendments 11.29, 11.30 and 11.40.

Core retains Source, rendering, Host/Page execution and Worker communication;
Minimal orchestrates standalone startup using core capabilities, without copying
or replacing the runtime. Runner UI behavior remains in the example runner.
The current core does not export WorkerTransport. Exposing that existing class
is a proposal requiring separate owner confirmation, not an approval implied by
this ownership decision. Implementation of this relocation remains pending that
contract decision. No publication, deployment or dependency-source edit is approved.


### Amendment 11.46 — Standalone Worker integration belongs in Minimal — 2026-09-24

Owner resolves the proposal left open by 11.45: “quindi a tutti gli effetti è il
server dello standalone e nello standalone deve stare”, followed by the explicit
instruction to perform the work (current task, 2026-09-24). Inspection finds no
operational consumer of WorkerTransport other than standalone mount. Hypothetical
future reuse does not justify retaining it in core.

Move WorkerTransport, its WorkerHost counterpart and standalone mount into
gramlot-minimal. Minimal owns Worker messaging, request correlation, termination,
startup and CSS/export asset handling. Shared Host/Page execution, Source, Data and
rendering stay in core. The neutral Host is exposed through a browser-safe `/host`
entry so Minimal consumes the existing execution class without Node filesystem
imports. No replacement runtime or duplicated page execution is introduced.

This supersedes section 7, the 2026-09-21 standalone packaging ownership, and
amendments 11.29, 11.30, 11.40 and 11.45 where inconsistent. The proposal to expose
WorkerTransport from core is withdrawn. Remove the development core standalone
and Worker-specific entries; Minimal provides its own `/standalone` and
`/worker-host` entries. Published 0.1.0 artifacts are unchanged. The new development
integration requires the matching development core; no compatibility alias is
introduced. This is bounded connected Minimal work, not a general framework
reopening. Runner-local UI ownership from 11.44 remains unchanged.


### Amendment 11.47 — HTML/SVG binding 0.2.0 contract — 2026-09-25

Owner confirms the unified plan's section 2 decisions and section 3 proposals
“per ora” (for now), and explicitly authorizes S00 transcription through the S00 brief, kept outside the
repository, and the owner's instruction to execute S00.
The retrievable evidence and source hashes are recorded in
[GC-210 §005](internal/210-binding-contract.md#gc-210-005).
[GC-210 §§010–015](internal/210-binding-contract.md#gc-210-010) are the paired
per-decision register: owner/date, concrete scope, superseded proposal, phase and
required test. This amendment incorporates those tables as the 0.2.0 contract;
it does not claim runtime implementation or acceptance of the S00 transcription.

1. Data: one stable outer root with main containing the document Bag, shared by
   Gramlot and Builder; authored paths omit main. Gramlot owns one subscription
   and routing. Source carries initial values, without a second Data envelope.
2. Canonical declarations: `dataSetter(destination_path, value=None, **attr)`,
   `dataFormula(result_path, formula=None, func=None, **params)`,
   `dataController(script=None, func=None, **params)`. Named func and inline
   formula/script are mutually exclusive. No legacy dispatch or data alias;
   data remains HTML5. This supersedes `.data(path, value)`, setter destination
   and formula destination. Destination/result paths reject ?attr. `_path`
   fields contain bare paths; strip an authored pointer prefix with one warning.
   Variable datapath follows its Data value and rebinds the branch, through
   `GramlotBuilderBagNode.absDatapath` (item 10).
   Authoring dictionaries/plain objects use Bag(value); lists stay lists and JSON
   strings stay strings. These are bounded confirmed conversions, not general fallbacks.
3. A2 installs every setter of the initial/inserted branch before DOM in document
   order, superseding per-level installation. R1: non-null writes; existing null
   declaration keeps value and applies attributes; missing null creates a node.
   This supersedes null-overwrite and legacy attribute loss, not runtime setData.
   Defaults follow setters; only null/missing are empty. attr_* follows the legacy
   rule: after the node's own defaults, only on the existing Data node of the
   control's value/src (correcting the earlier P15 clause). No duplicate warning.
4. Boolean checkbox/radio use value pointers, radio also group; this supersedes
   checked='^x'. visible=false sets visibility hidden; hidden stays native; live
   defaults false. Freeze suspends structural rebuilding only; existing Data
   reactions continue, semantic removal cleanup is immediate, rebuild/thaw never
   reinstall. Keep the earlier separately recorded freeze decision unchanged.
5. Named logic is primary; inline compilation only in the page runtime, never
   Python/JS Host, WorkerHost or DevTools. This is a bounded §13 exception.
   Both forms use Source-node methods; no Gramlot operations layer. SET, GET,
   setRelativeData and getRelativeData are Builder's; silent PUT, router-marked
   FIRE and FIRE_AFTER come from GramlotBuilderBagNode (item 10).
   Legacy macros become a deprecated regex compatibility preprocessor with one
   warning, superseding macro-only inline writes. FIRE_AFTER defaults to 10 ms
   with explicit delay; its timer is tracked on the NodeBinding and cancelled at close.
6. Nested button controller is ordinary reactive logic plus click (B7), with
   button-prefixed counter/modifiers. One click mechanism; connect_onclick follows.
   R3 remains provisional: implicit type=button only for Gramlot-enabled buttons,
   explicit type preserved, stopPropagation, no preventDefault; plain buttons
   native. S12 must report form/keyboard/parent/native-listener effects to owner.
7. Both Page languages use css_requires/js_requires. All hierarchical JS levels
   register generic-to-specific, last wins; CSS cascades; public same-name companion
   last. Supersedes Page.css, camelCase and legacy first-JS-only selection. Parsing
   trims comma-separated names, ignores empty/duplicate entries, allows valid slash
   segments and rejects colon/traversal/extensions. File or same-name-folder pages
   are explicitly allowed (§13 exception), both together error; supersedes folder-only.
   Logic groups are per instance/resource, this.page accesses page, no static holder
   or page mixin. Nonce differs from page_id; standalone hashes final bytes.
8. Source/DOM lookup uses getBaseSourceNode/getDomNode on renderer and Gramlot;
   no added object properties. NodeBinding owns semantic lifetime separately from
   DOM, in a BindingRuntime Map keyed by the actual node (P17, see item 10). FIFO semantics precede freeze filtering;
   complete builds before queued mutations, ignore changes to currently building
   nodes. Anti-echo suppresses only redundant origin value, never other attributes
   or providers. remoteSource follows semantic lifetime, latest request wins.
9. All remaining P1–P25 rules, exclusions and exact startup/routing/provider/resource
   sequences are as registered in GC-210. Explicit errors cover unsupported
   server/shared/remote Data, subscriptions, PUBLISH and ask declarations, not
   same-named keys in user Data. Q2 cycles, Q3 CSP profiles, Q4 connected writes
   and Q5 native conversions remain open at their phases; no new decision implied.
10. Owner rule, 2026-09-25: no upstream fixes for Gramlot; missing Builder/Bag
    behavior goes into GramlotBuilderBag/GramlotBuilderBagNode. The earlier planned
    genro-builders/genro-bag fixes are withdrawn. `js/src/builder/source.js` (S01)
    holds `GramlotBuilderBag extends SourceBag`, whose nodeClass returns
    `GramlotBuilderBagNode extends SourceBagNode`, with silent PUT, FIRE marked for
    the router, FIRE_AFTER with a NodeBinding-tracked timer and absDatapath with
    variable datapath and symbolic ?attr. S01 proves every browser path produces
    these classes, without prototype mutation or Builder/Bag changes; Python needs
    no counterpart. S04 and S08 wait for no external release. S01 measures the
    Bag.fromTytx null-attribute loss; any solution needs owner approval and goes into
    these classes. This supersedes the P17 wording "no SourceBagNode subclass".

This supersedes obsolete authoring/ownership/initialization gates in GC-155–175 and
PORT-0005; preserve their dated evidence and legacy assertions. GC-210 replaces
GC-165 for 0.2.0 execution. Each later phase still needs owner authorization.
S00 is documentation/baseline work only. No runtime, dependency-source edit,
connected-repository migration, push, publication or deployment is authorized here.
