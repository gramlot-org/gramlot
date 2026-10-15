# Gramlot product constitution

[Concise version](../docs_llm/00-constitution.md).

> **Naming (2026-10-02):** in the dated text of this document, "native" as the label of a release, profile, milestone, adapter, module, API or pages names the scope of the 0.1.0 milestone (no web components, no recipes). That label has no technical meaning; current documents do not use it ([GC-005 §030](005-documentation-policy.md#gc-005-030)). "native" for browser controls, DOM events, HTML attributes, DOM operations, Bag events or platform APIs keeps its technical meaning. Dated text is not rewritten.

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
does not authorize framework implementation. Amendment 11.44 provided a bounded
exception for the provisional example runner, using ordinary HTML IDs; the runner
left the core with amendment 11.56.

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
| `gramlot-py-server` | Python pages: one PyPI package, `gramlot-py-server`, with five adapters as extras: `uvicorn` (Uvicorn or any ASGI server), `django`, `flask`, `fastapi` and `kajenn` (Kajenn, the new product name for Genro ASGI) |
| `gramlot-js-server` | JavaScript pages: `@gramlot/gramlot-js-server` (Node.js and Bun), `@gramlot/gramlot-serverless` (JavaScript in a browser Worker without a server, standalone; amendments 11.50 and 11.52) and `@gramlot/create` (new projects) |

`gramlot-examples` holds the example pages, their READMEs and the gallery; each
integration serves them with its gallery command (amendment 11.56). Standalone remains
the browser/Worker profile name. Core retains shared Host/Page execution and
rendering. Kajenn is published on PyPI as `kajenn`; the `kajenn` adapter depends only
on Kajenn besides the core.

The repositories `gramlot-fastapi`, `gramlot-flask`, `gramlot-django`,
`gramlot-kajenn` (formerly `gramlot-genro-asgi`), `gramlot-uvicorn`,
`gramlot-serverless` and `gramlot-minimal` (formerly `gramlot-standalone`, retired on
2026-09-28) are archived (amendment 11.57). Amendments 11.19, 11.46, 11.48, 11.50 and
11.52 record their history.

Category membership does not establish release compatibility. Published 0.1.0
archives retain their original names and contents. No compatibility wrappers,
deployment or new core feature contract are implied.

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


Current reading order (2026-09-22): §13 is the primary-path rule; §14 includes approved Gramlot adapter work while Builder/Bag remain read-only for this workstream. Amendments 11.14 and 11.16 assign ordered Collection composition and bounded Python authoring; 11.18 supersedes 11.17 for JavaScript `sourceTarget`. Dated Builder corrections below were bounded exceptions, not general permission. The active release plan is [GC-110](internal/110-0-1-0-readiness.md#gc-110-020), with current status in [GC-070](internal/070-work-status.md).

<a id="gc-000-140"></a>

## 14. Current repository work boundary

**Current naming clarification — 2026-09-24:** In the dated decisions below,
`gramlot-nodejs` is now `gramlot-js-server` (11.32), and `gramlot-standalone` is now
`gramlot-minimal` (11.19); `gramlot-minimal` was then retired (11.48 item 5) and its
heirs are `gramlot-uvicorn` and `gramlot-serverless`; `gramlot-serverless` is now
`@gramlot/gramlot-serverless` in `gramlot-js-server` (11.50, 11.52). `gramlot-genro-asgi` is now
`gramlot-kajenn` (repository renamed 2026-09-26). Since 11.57 the integration
repositories are `gramlot-py-server` and `gramlot-js-server`; `gramlot-uvicorn`,
`gramlot-kajenn`, `gramlot-serverless` and the other adapter repositories are
archived. Historical names preserve the original decision scope and do not identify
additional repos.

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
**Superseded in part by 11.48 item 8:** Gramlot no longer registers a `SourceBag`
suffix of its own; the builder declares the Source class (`GramlotBuilderBag`), a Bag
of any class travels as `::X` and `__cls` names it. The `SOURCE` suffix is gone.

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

**Superseded in part by 11.57:** the integration repositories are `gramlot-py-server` and
`gramlot-js-server`; the six repositories of this amendment are archived.

**Superseded in part by 11.48:** `gramlot-minimal` is retired; its ASGI/Uvicorn part
belongs to `gramlot-uvicorn` and its standalone part to `gramlot-serverless`.

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

**Superseded in part by 11.56:** the example pages, their READMEs and the gallery (heir of the runner) live in `gramlot-examples`; the core keeps theme and logo.

Owner authorizes a local, usable HTML/SVG teaching suite in core: twelve paired
Python/JavaScript pages under `examples/html_svg`, each with its own README,
progressing from Hello World to methods and loops. Python remains the first
explanation; equivalent JavaScript is explicitly part of this suite. This supersedes
GC-140's earlier Hello-World-only example scope and its blanket allocation of all
example pages to the separate integration example repository. The existing
`gramlot-examples` integration smoke application remains separate and unchanged.

**Layout note (2026-09-30):** since S06 each example is a file page (`NN_name.py`,
`NN_name.js`, `NN_name.md`, with a same-name `NN_name.css` and logic companion
`NN_name_aux.js` where needed) and `Page.css` stays (Q10); the original layout was one
folder per example. Amendment 11.48 adds the families `examples/binding` and
`examples/controllers`.

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

**Superseded in part by 11.56:** the example pages, their READMEs and the gallery (heir of the runner) live in `gramlot-examples`; the core keeps theme and logo.

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

**Superseded in part by 11.56:** the example pages, their READMEs and the gallery (heir of the runner) live in `gramlot-examples`; the core keeps theme and logo.

**Superseded in part by 11.48:** `gramlot-minimal` is retired; the exporter and the
generated distribution belong to its heir `gramlot-serverless`.

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

**Superseded in part by 11.56:** the example pages, their READMEs and the gallery (heir of the runner) live in `gramlot-examples`; the core keeps theme and logo.

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
**Superseded in part by 11.48:** `gramlot-minimal` is retired; standalone startup
belongs to its heir `gramlot-serverless`.

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

**Superseded in part by 11.48:** `gramlot-minimal` is retired; Worker messaging,
WorkerHost and standalone mount belong to its heir `gramlot-serverless`.

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

**Superseded in part by 11.48:** items 2, 5, 7, 8, 9, 10 and 11 as listed there;
**superseded in part by 11.49:** item 1; **clarified by 11.64:** item 2's
recursive Bag population; the text below stays as history.

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
8. Source/DOM lookup uses getBaseSourceNode/getDomNode on GramlotHtmlRenderer and Gramlot;
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
    these classes, without prototype mutation or Builder/Bag changes. Owner rule,
    2026-09-26 (symmetry): Python has empty counterparts, `GramlotBuilderBagNode(
    SourceBagNode)` and `GramlotBuilderBag(SourceBag)` with `_node_class`, to be used by
    the Python GramlotBuilder for the Source; runtime methods stay in JS. This supersedes
    "Python needs no counterpart". S04 and S08 wait for no external release. S01 measures the
    Bag.fromTytx null-attribute loss; any solution needs owner approval and goes into
    these classes. This supersedes the P17 wording "no SourceBagNode subclass".
11. Owner rule, 2026-09-25: Gramlot reuses Builder by inheritance and never
    re-implements it. The live renderer becomes `GramlotHtmlRenderer extends
    HtmlRenderer` (renamed from `GramlotRenderer extends RendererBase`) with its DOM
    renderedItem, and `GramlotSvgRenderer extends SvgRenderer` serves SvgBuilder
    nodes. Builder's inherited adaptAttrs brings the legacy style shortcuts into 0.2.0;
    Gramlot adds `_meta` removal, null style drop, data_/aria_/xmlns_ names and the
    legacy noConvertStyle attributes. HtmlElement keeps DOM application only. Phase
    S03bis, before S04. This supersedes the P6 exclusion of color/font_size/_class
    shortcuts. Owner rule, 2026-09-26: asymmetries between Python and JS are errors.
    The Python GramlotBuilder may render static HTML/SVG through Python
    GramlotHtmlRenderer/GramlotSvgRenderer with the same naming rule, delivered in
    S03bis; authoring stays inert. A render option adds `<!doctype html>` and `<html>`
    when missing. This supersedes "Python describes Source without rendering it".

This supersedes obsolete authoring/ownership/initialization gates in GC-155–175 and
PORT-0005; preserve their dated evidence and legacy assertions. GC-210 replaces
GC-165 for 0.2.0 execution. Each later phase still needs owner authorization.
S00 is documentation/baseline work only. No runtime, dependency-source edit,
connected-repository migration, push, publication or deployment is authorized here.


### Amendment 11.48 — 0.2.0 scope, minimal Host contract and plan revisions 7–10 — 2026-09-28

**Superseded in part by 11.57:** the resource host of items 1 and 4 is genro-kajenn, part of
Genro, not `gramlot-kajenn`; the heirs of item 5 are archived (`gramlot-py-server` and
`@gramlot/gramlot-serverless` hold their adapters).

Owner decisions of 2026-09-26 and 2026-09-28, recorded in the owner-decision register
kept outside this repository (`analisi-claude/binding-legacy-analisi.md`), and
transcribed in the unified plan, revisions 7–10. Owner instruction R03 (2026-09-28):
the new decisions enter the authoritative documents before S06, in a documents-only
phase S00bis. The retrievable evidence and source hashes are recorded in
[GC-210 §005](internal/210-binding-contract.md#gc-210-005); the per-decision register
is [GC-210 §§010–018](internal/210-binding-contract.md#gc-210-010). "Register" below
names the section of the owner-decision register. This amendment records decisions;
it claims no runtime implementation and no owner acceptance of this transcription.

1. Scope. Register: "Perimetro della 0.2.0 (owner, 2026-09-28) — DECISIONE DI
   RIFERIMENTO" and "Perimetro: Gramlot libreria JS, adapter minimi", 2026-09-28.
   Gramlot is primarily a JavaScript library; server and database adapters are
   optional. 0.2.0 contains only what holds for every adapter. The Gramlot folder with
   `pages`/`resources`, `_resources` levels, `resource_dirs`, `/<page>/_rsrc/<name>`,
   `resolve_rsrc`, `ResourceNotFound`, the reserved names `config`/`packages`,
   application packages, `mainpackage` and config belong to gramlot-kajenn after
   0.2.0. The S06 register entries of 2026-09-26 remain theory for gramlot-kajenn.
   Supersedes, for the core, the hierarchical resource levels of 11.47 item 7.
2. Minimal Host contract. Register: same sections; S06 names, 2026-09-26. Python and
   JavaScript Host: `resolve_page`/`resolvePage` returns the Page class;
   `resolve_resources`/`resolveResources` returns ready URLs
   `{css: [url], js: [{url, group}]}`, in load order, without mount prefix. The core
   never searches files. Server method names follow each language's convention; the
   page vocabulary (`css_requires`, `js_requires`) is identical. Every page opening
   takes an optional mount prefix (default `""`), whose source the adapter chooses.
   The prefix is added once, only to root-relative URLs (`/…`, not `//…`): CSS links,
   JS module URLs, runtime, main, source and close; relative and absolute URLs stay as
   written, as in HTML (Q12.1, D8). The nonce is separate from page_id and new at each
   opening; standalone hashes final bytes. A repeated URL loads once, in its last
   position. The same JS URL with two different groups is an error in the core, before
   any import, in Python and JavaScript (C03).
3. Minimal FileHost. Register: perimeter section, 2026-09-28; S06 companion entries,
   2026-09-26. `FileHost(pages_dir)`/`new FileHost(pagesDir)` takes one argument, the
   pages folder. For page path `foo` the file page `foo.py`/`foo.js` is tried first,
   then the folder `foo/foo.*`; if both exist the file wins, without error. Same-name
   files beside the file page or in the folder: `foo.css` (CSS), `foo_aux.js`
   (auxiliary JS module exporting `Logic`, group null), `foo.md` (README). The `_aux`
   suffix is reserved: a `*_aux.js` file is never a page and no page is named `*_aux`.
   Page path segments use letters, digits, `_` and `-`. A symlink is rejected only when
   its real path leaves the pages folder. No resource levels. Load order: `Page.css` URLs
   as written, then the companions. Supersedes 11.47 item 7 "both together error", the
   companion `foo.js`, the revision 6 §13 exception for one file exporting both Page and
   Logic, and the Gramlot-folder argument of FileHost (S06 decision C, 2026-09-26).
4. `Page.css` and requires. Register: "Revisione 8 del piano — decisioni sui rilievi
   di Astra", Q10, 2026-09-28. `Page.css` is DOM syntax, a list of URLs as in
   `<link href>`, and stays in the core for every adapter. `css_requires` and
   `js_requires` remain Page attributes in Python and JavaScript (P23), one
   comma-separated string (P13), interpreted by a Host with a resource system
   (gramlot-kajenn). The core offers the common parser `parse_requires`/`parseRequires`,
   with one explicit Unicode White_Space set (U+FEFF excluded) in both languages, and
   `InvalidResourceName`. The minimal FileHost raises an error for any name in
   `css_requires`/`js_requires`. Supersedes, for the core, "Supersedes Page.css" of
   11.47 item 7 and the 2026-09-25 rule that css_requires replaces Page.css; both still
   hold for gramlot-kajenn.
5. `gramlot-minimal` retired. Register: "gramlot-minimal da dividere", 2026-09-26, and
   "gramlot-minimal morto", 2026-09-28. `gramlot-minimal` is dead. Its heirs are
   `gramlot-serverless` (browser/Worker standalone) and `gramlot-uvicorn` (ASGI
   adapter served by Uvicorn). The core dependency was removed in `61f2c9b`.
   `gramlot-kajenn` depends only on Kajenn besides the core. Supersedes the
   `gramlot-minimal` destination of 11.45 and 11.46: standalone startup, Worker
   messaging, WorkerHost and standalone mount belong to `gramlot-serverless`.
6. Data declarations. Register: "S01 chiusa con debito", 2026-09-28, and revision 8
   section (R17, Q7). `data` is forbidden (P19): any `data(...)` call raises an error
   naming `dataSetter` and `html_data`; the HTML5 `<data>` element is written
   `html_data(...)`, in Python and JavaScript. `dataSetter` is literal: `value` and
   attributes are written as authored, without pointer resolution, `==` expression or
   template; a computed value uses `dataFormula`. A null attribute in a `dataSetter`
   counts as omitted (R17). A relative variable datapath `datapath='^.foo'` reads
   `.foo` in the context of the node's parent, and the value read acts as if written
   in place of the pointer; an absolute or symbolic value acts as an absolute or
   symbolic datapath. An empty variable datapath gives a null path (Q7): reads
   (projection, GET, provider arguments) give null; no registration on the null path;
   defaults and setters are skipped; writes (SET, PUT, FIRE, user input) raise
   "write on a null path" with node and attribute. The check lives in
   `getRelativeData`/`setRelativeData` and `PUT` of `GramlotBuilderBagNode`.
   The Gramlot renderers, live and static, Python and JavaScript, set data-elements
   aside before `runtime_values`/`runtimeValues`, so a literal `dataSetter` such as
   `value='^.literal'` renders without resolution or error (R08, plan revision 10).
   Supersedes "data remains HTML5" of 11.47 item 2 and the P19 condition.
7. Template `${name}`. Register: "S01 chiusa con debito" and revision 8 section, Q6,
   2026-09-28. On visual elements, identical in Python and JavaScript: `${name}` is the
   attribute `name` of the same node after pointer resolution; it is computed at
   rendering and follows Data changes; the parameter does not reach the DOM; `\${`
   stays text; a missing name raises "Unknown template parameter 'name'". Attributes
   only, never the node value; not on data-elements; `${…}` in dataFormula and
   dataController scripts is JavaScript and passes unchanged. genro-builders 0.26.0
   aligns Python with genro-builders-js.
8. Source class and wire. Register: "Prova 11 — classe delle Bag nel wire" (2026-09-26)
   and "Prova 11 — chiusura" (2026-09-28). The builder declares the Source class, as
   legacy `domSrcFactory`: `_source_class`/`static _sourceClass = GramlotBuilderBag`;
   the Source declares the node class. The TYTX suffix stays the type (`::X`). `__cls`
   names the class on a branch row only when it differs from the parent, and on a root
   payload; only the payload decides the root class; an unknown name is an error;
   `__cls` is reserved; names are the real class names. The `SOURCE` suffix is gone.
   Python `GramlotBuilderBagNode` redefines `pointer_type`, as JavaScript
   `pointerType`, so a value starting with `==` is not a pointer (Q13); it is not a
   runtime method.
9. Writes. Register: revision 8 section, Q8, Q9, R13, 2026-09-28; plan revision 9, D4.
   FIRE always fires, also with an equal value: `GramlotBuilderBagNode.FIRE` resets
   the value silently, then writes with fired; `FIRE(path, null)` becomes
   `FIRE(path, true)`; the reset is guaranteed in finally (P12, R10). No FIRE mark:
   the Data event carries `fired`, as legacy, and the router reads `event.fired`.
   This needs genro-bag 0.27.0, genro-bag-js 0.10.0 and genro-builders-js 0.3.1,
   published on 2026-09-28; the declared constraints rise in S08. Silent PUT means
   Gramlot does not react; autocreate `ins` events of missing branches reach the
   router, which discards them, without suppression (R13). Supersedes the
   router-marked FIRE of 11.47 items 5 and 10, the unchanged inherited GET/SET of item
   10, and "S04 and S08 wait for no external release" of item 10.
10. Routing. Register: revision 8 section, R06 and R15, 2026-09-28. `#<node_id>` is
    translated in `absDatapath` through a `node_id → node` map on the Gramlot
    instance; a registration uses the path translated when it is made. One delivery
    per registration: two attributes of one node hit by one event give two calls, as
    legacy.
11. Attribute evaluation, `==` and `mask`. Register: revision 8 section, Q11.2, `mask`,
    and the `==` template-chain decision, 2026-09-28. Order: `pointerType` excludes
    `==`; Builder `runtimeValues` resolves `^`/`=` and templates; Gramlot computes `==`
    with the other resolved attributes, excluding other `==`; `mask`; projection. An
    argument of `==` is the `runtimeValues` result of that attribute; an attribute
    consumed by a template, absent from that result, is the pointer resolved from the
    Source. A `==` using a consumed attribute that is itself a template raises an error
    naming both attributes; a template using an `==` attribute raises an error. `mask`
    applies to the node text only, as legacy `gnrlang.js:1130-1139` (`%s` replaced; no
    mask on an empty formatted value), in the live and static renderers, Python and
    JavaScript. `_if`/`_else` are inline only, as legacy; with `func=` they do not
    exist (Q11.1). Supersedes the `mask` exclusion of GC-210 §030.
12. Renderer chain. Register: "Render a stringa in JS", 2026-09-28.
    `GramlotHtmlRenderer extends HtmlRenderer` renders strings, same name as the Python
    class, new file `gramlot-html-renderer.js`; `GramlotRenderer extends
    GramlotHtmlRenderer` is the live DOM renderer and keeps its name and file.
    `getBaseSourceNode`/`getDomNode` live on `GramlotRenderer` and `Gramlot`.
    Supersedes 11.47 item 8 (lookup on `GramlotHtmlRenderer`) and the rename of item 11.
13. Native controls. Register: revision 8 section, C04.1, C04.2 and Q5, 2026-09-28.
    An attribute change the element cannot apply rebuilds the element, with the
    NodeBinding kept (`type`, `multiple`, `group`); `live` changes only the write
    timing. A `true` written by code on a radio of a group writes `false` on the other
    buttons of the group, with the same code as the click. The Q5 conversion matrix of
    GC-210 §060 is confirmed.
14. Open questions closed. Register: revision 8 section, 2026-09-28. Q2: provider
    cycles as legacy, no limit, loops stop on equal values; reviewed after 0.2.0. Q3:
    the application chooses and sends the CSP through the adapter; Gramlot adds nonce
    and hash; strict profile (nonce, no `'unsafe-eval'`, named logic only) and
    permissive profile (`'unsafe-eval'`, inline active); inline under the strict
    profile raises a clear error with node and attribute. Q4: all seven adapters are in
    0.2.0 (`gramlot-uvicorn`, `gramlot-serverless`, `gramlot-js-server`,
    `gramlot-django`, `gramlot-fastapi`, `gramlot-flask`, `gramlot-kajenn` with the
    minimal contract only), authorized per delivery: each repository is worked in its
    own chat with its own brief, and the owner authorizes it there when that delivery
    starts; no repository is authorized by this amendment. R02: S06 has a linked
    delivery in `gramlot-uvicorn` and closes only after it. Q12.2: `PageBootstrap.run`
    checks the Logic rules after the imports and before `new Gramlot(config)`. D9: from
    S07 the CSS links are emitted by `PageBootstrap`.
15. General rule. Register: revision 8 section, 2026-09-28: when in doubt, follow the
    legacy behavior, because it is field-tested.

Explicit supersessions, with the superseded text kept as history: 11.47 item 2 (data
remains HTML5) by item 6; item 5 (router-marked FIRE) by item 9; item 7 (hierarchical
JS levels, Page.css replaced, companion, both page forms together an error) by items
1–4; item 8 by item 12; item 9 (Q2–Q5 open) by items 13–14; item 10 (FIRE marked for
the router, inherited GET/SET unchanged, no external release, empty Python classes)
by items 6, 8 and 9; item 11 (renderer rename) by item 12; 11.45 and 11.46, for the
assignment of standalone and Worker integration to `gramlot-minimal`, by item 5.
Decision checklist transcribed: R02, R03, R06, R13, R15, R17, C03, C04.1, C04.2,
Q2–Q13, `mask`, renderer chain, "when in doubt, follow legacy". Each later phase
still needs its own owner authorization. No runtime, dependency-source edit,
connected-repository migration, push, publication or deployment is authorized here.


### Amendment 11.49 — Builder owns the outer Data root — 2026-09-29

Owner decision of 2026-09-29 (unified plan, revision 11; genro-builders#37 decision
comment, genro-builders-js#11), released in genro-builders 0.27.0 and
genro-builders-js 0.4.0. The per-decision register is
[GC-210 §010](internal/210-binding-contract.md#gc-210-010). This amendment records a
decision; it claims no runtime implementation and no owner acceptance.

1. Data root. Builder owns the outer Data root: the private wrapper `_dataroot`
   holds the content node `_root_`, whose value is the document Data Bag, in the same
   shape as the Source (`_sourceroot` → `_root_`). `gramlot.data === builder.data`
   (the content Bag). Authored paths never contain `_root_`. Builder makes no Data
   subscription and never replaces the content; sub-builders share the content and
   the wrapper.
2. Subscription. Gramlot owns one Data subscription, on Builder's wrapper, and the
   routing. `BindingRuntime.attach()` only subscribes: it creates no root and no
   `main` node. `BindingRuntime.root` reads the wrapper through the public getter
   `builder.data.parent`. The line `this.data.setItem('main', new Bag())` of
   `Gramlot` is removed. The router strips the first path segment `_root_`.

Explicit supersession, with the superseded text kept as history: 11.47 item 1 (one
stable outer root with `main`, built by Gramlot) by items 1–2.


### Amendment 11.50 — The standalone exporter joins gramlot-js-server — 2026-10-01

Owner decisions of 2026-10-01, to reduce the number of downstream repositories:
"va bene js server in effetti il worker è uj server"; on the names, "accetto il tuo
suggerimento" (two packages, `server` and `browser`, without the `native` prefix).

1. Repository. `gramlot-serverless` joins `gramlot-js-server` with its history
   (`git subtree`) and is archived after the merge on `main`.
2. Packages. `gramlot-js-server` is an npm workspace with two packages:
   `@gramlot/gramlot-js-server` in `server/` (Node.js and Bun host adapter, entry
   points `/node` and `/bun`, function `startServer`) and `@gramlot/gramlot-browser`
   in `browser/` (single-HTML and static-directory exporter, standalone Worker
   integration and startup, command `gramlot-browser`).
3. Ownership. What 11.46 and 11.48 item 5 assign to `gramlot-serverless` belongs to
   `@gramlot/gramlot-browser`, unchanged in scope.
4. Names. The `native` prefix of the 0.1.0 profile leaves the JavaScript server
   adapter (`/native`, `startNativeServer`). `@gramlot/serverless`,
   `gramlot-serverless` and `/native` are not compatibility aliases.

The §7 table and the §14 naming clarification are updated; dated decisions keep
their original names as history.

### Amendment 11.51 — The native label is removed — 2026-10-02

Owner decision of 2026-10-02: the label "native HTML" "è completamente fuorviante".

1. Meaning. As the name of the 0.1.0 profile, "native" recorded only that the first
   milestone (GC-088, 2026-09-19) planned no web components and no recipes. It has no
   technical meaning.
2. Rule. "native" names no release, profile, milestone, adapter, module, API or pages.
   It keeps the technical meanings listed in
   [GC-005 §030](005-documentation-policy.md#gc-005-030).
3. Renames. `docs/internal/088-native-html-plan.md` → `088-0-1-0-plan.md`,
   `089-native-html-handoff.md` → `089-0-1-0-handoff.md`,
   `110-native-html-readiness.md` → `110-0-1-0-readiness.md`,
   `ports/PORT-0001-native-html/` → `ports/PORT-0001-0-1-0/`,
   `ports/PORT-0004-native-html-delivery/` → `ports/PORT-0004-0-1-0-delivery/`, with
   their mirrors; document IDs and anchors are unchanged. `js/tests/native-html.test.js`
   → `source-contract.test.js`, `tests/test_native_html.py` → `test_source_host.py`,
   `scripts/verify_native_html_browser.mjs` → `verify_page_browser.mjs`.
4. History. Dated decisions and records keep their text and carry a naming note.
   Published artifacts keep their names (`gramlot-native-0.1.0.zip`,
   `gramlot-native-html-0.2.0.tgz`).
5. Other repositories. The Python adapter names leave with gramlot-py-server; the
   example pages change with their move to gramlot-examples.

### Amendment 11.52 — The standalone exporter becomes @gramlot/gramlot-serverless; theme and logo in every package — 2026-10-02

Owner decisions of 2026-10-02: on the name, "gramlot-serverless forse è il piu
semplice" ("browser" reads as the package for the interface, while every Gramlot page
uses the browser; what sets the package apart is that nothing runs on a server); on
the timing, "forse di anticiparlo così chiudiamo tutta la parte js"; the core 0.2.2
carries the theme and the logo files in the npm and PyPI packages, as JSR does.

1. Name. The exporter of 11.50 item 2 is `@gramlot/gramlot-serverless`, in
   `serverless/` of `gramlot-js-server`, command `gramlot-serverless`, from
   gramlot-js-server 0.2.2. Scope unchanged (11.50 item 3). The name of 11.50 is not a
   compatibility alias; it was removed from npm.
2. Packages. The npm, PyPI and JSR packages of the core carry the same theme and logo
   files: `themes/` and, of `assets/branding/`, the four stable entry points and
   `svg/` (paths in [GC-090 §023](public/090-classes-and-hosts.md#gc-090-023)). The
   sources stay at the repository root; the rest of the identity kit is not packaged.
3. History. Dated decisions and records keep the name of 11.50.

The §7 table, the §7 heirs paragraph and the §14 naming clarification are updated.

### Amendment 11.53 — Inline code is activated by the received Source; the single file allows 'unsafe-eval' — 2026-10-03

Owner decisions of 2026-10-03: inline code stays and is available everywhere, also in
the file without a server: "credo sia necessario accettare unsafe e fare il possibile
per prevenire"; the code is activated in one place only, the decoding of the Source, in
the Gramlot Source classes, with no new wire type; connections of the single file stay
open until the CSP grammar arrives.

1. Activation. Inline code runs only as received with the Source: `main`, a remote
   Source, or a `GramlotBuilderBag` given to `startSource`. `Gramlot.prepareSource`
   activates it in `GramlotBuilderBag`/`GramlotBuilderBagNode`; Builder, Bag and TYTX
   are not modified. A code text written later in the Source, or arrived through Data
   or RPC, is an error naming node and attribute, never run. A code attribute holding
   a `^`/`=` pointer is an error at reception. This narrows item 5 of 11.48 (inline
   compilation only in the page runtime): the runtime compiles only activated text.
2. Browser-run attributes. The Python and JavaScript renderers refuse attributes with
   the form of a native event handler (`on` followed by at least one character) and
   `javascript:` URLs in `href`, `src`, `formaction` and `xlink:href`, written or
   resolved from Data. `connect_on<event>` is the event mechanism.
3. Single file. The CSP of the `@gramlot/gramlot-serverless` file is
   `script-src '<sha256>' 'unsafe-eval' blob:` without `'unsafe-inline'`, and
   `connect-src *`, from gramlot-js-server 0.2.3. This supersedes, for the export, the
   statement of 11.48 item 14 (Q3) that only the permissive server profile runs inline
   code. The server profiles of Q3 are unchanged.
4. Python. Python compiles no inline code and has no activation: a Python Source
   carries its code attributes as plain strings, activated by the page on reception.
   The asymmetry has a technical reason: Python does not run JavaScript.

Rules: [GC-090 §035](public/090-classes-and-hosts.md#gc-090-035),
[GC-095 §065](public/095-writing-pages.md#gc-095-065). Record: GC-070 §660.

### Amendment 11.54 — An iframe srcdoc from Data is sandboxed — 2026-10-03

Owner decision of 2026-10-03 ("ok"): an `iframe` whose `srcdoc` comes from Data gets
`sandbox=""`; the author's `sandbox` is kept; a literal `srcdoc` gets none. Rejected: a
`srcdoc` accepted only as a literal, which removes the HTML preview, and sanitizing with
DOMPurify, a runtime dependency with rules to maintain. This extends item 2 of 11.53
(browser-run attributes): a `srcdoc` is a whole document whose scripts the browser
runs, and the `on*`/`javascript:` refusal does not reach them.

1. Rule. The Python and JavaScript renderers add `sandbox=""` to an `iframe` whose
   `srcdoc` is declared as a `^`/`=` pointer, a `==` expression or a `${…}` template
   reading a pointer, or whose node value is a pointer, since Builder applies the
   `_wdg` of that datum over a literal `srcdoc`. The declaration decides, not the
   value, so the iframe has its `sandbox` before `srcdoc` has one.
2. Author. A `sandbox` declared in the Source, with any value, is kept as declared and
   turns the rule off; a literal `srcdoc` gets no `sandbox`.
3. Order. The live element writes `sandbox` before every other attribute, because the
   browser reads `sandbox` when `src` or `srcdoc` starts a navigation.
4. Examples 10 and 13. Amendments 11.38 and 11.39 approved a native `onclick` in
   examples 10 (card removal) and 13 (live Source playground); since 11.53 the
   renderers refuse it. Both examples, Python and JavaScript, pass to
   `connect_onclick` with the same text and the same behavior through Gramlot. The
   core CI runs their browser checks (`verify_live_cards.mjs`,
   `verify_live_playground.mjs`) on the runner.

Rules: [GC-090 §035](public/090-classes-and-hosts.md#gc-090-035),
[GC-095 §065](public/095-writing-pages.md#gc-095-065). Record: GC-070 §665.

### Amendment 11.55 — One page module with Page and Logic; gramlot.inout — 2026-10-03

Owner decisions of 2026-10-03, in the coordinating chat and in the execution of brief 1:
a JavaScript page is one module that exports `Page` and `Logic` ("io farei lo skeleton con
2 classi nella new"); beside a Python page the logic module is `foo.js`, not `foo_aux.js`
("non index_aux.js ma solo index.js in python perché non c'è ambiguità"); `foo_aux.js`
stays admitted; the core import is resolved in the browser by an import map ("ok" to the
phase A proposal); both logic modules together are an error ("ok"); the data functions
live in `gramlot.inout` ("sendMail", "post troppo generico, sendHttp", reload "solo
interno"), part of the browser runtime for Python and JavaScript pages alike (owner
correction of 2026-10-03). Rejected: a bundle built by the server for each page module,
which needs esbuild (Node) in a Python host and sends a second copy of the core to the
browser.

1. Page logic of `FileHost`. JavaScript: the `Logic` export of the page module `foo.js`
   is the page logic (group null), else `foo_aux.js`; a module that exports `Logic` with
   `foo_aux.js` beside it raises an `Error`. Python: `foo.js` beside `foo.py` is the
   logic module, whose `Logic` export is the logic and whose `Page` export (the
   JavaScript version of the same page) stays unused; else `foo_aux.js`; both raise
   `ValueError`. Python cannot read the exports of `foo.js`, so beside a Python page it
   exports `Logic`: the browser rejects a module without it, naming the file. The page
   module reaches the browser, so its imports resolve there too; a `Page` with
   server-only imports keeps its logic in `foo_aux.js`. The `_aux` suffix stays
   reserved.
2. Import map. The bootstrap HTML of both hosts carries, before the bootstrap script,
   `<script type="importmap">` with the bootstrap nonce, mapping
   `@gramlot/gramlot/page` to the runtime URL with the mount prefix. The runtime exports
   `Page` and `source`. Bootstrap and page module import the same URL: one runtime
   instance in the page.
3. Adapters. GET and HEAD serve `.css` and `.js` files whose real path is inside the
   pages folder (until now `.css` and `_aux.js`), so a page module and its relative
   imports reach the browser.
4. `gramlot.inout`. Each `Gramlot` instance carries `inout`, part of the browser runtime
   and available to Python and JavaScript pages, from inline code or from `Logic`. Every
   function takes the Data path of a Bag branch; a missing path or a value that is not
   a Bag raises an Error naming the path. `sendMail(path, email)` prepares a `mailto:`
   email, subject the page title, one `path: value` line per leaf, refused over 2000
   characters; `sendHttp(path, url)` POSTs the branch as a JSON object; `save(path,
   name)` writes TYTX and `restore(path)` reads a file chosen by the user back with exact
   types; `download(path, name, 'json' | 'xml')` exports `Bag.toJson` or `Bag.toXml`
   inside one root element named after the last segment of the path. No upload of
   external JSON or XML.
5. Examples. The core `examples/` pass to the module form: every `NN_name.js` exports
   `Page` and `Logic`, the four `NN_name_aux.js` are removed, and the Python pages take
   `Logic` from `NN_name.js`.

Explicit supersession, with the superseded text kept as history: 11.48 item 3 (the
companion `foo_aux.js` as the only page logic of `FileHost`) and the layout note of 11.22
(`NN_name_aux.js` where needed).

Rules: [GC-090 §030](public/090-classes-and-hosts.md#gc-090-030),
[GC-095 §060](public/095-writing-pages.md#gc-095-060),
[GC-095 §095](public/095-writing-pages.md#gc-095-095). Record: GC-070 §670.

### Amendment 11.56 — The examples and their runner leave the core — 2026-10-04

Owner decisions: "tutti gli esempi vanno messi nel repo esempi e collegati opportunamente"
(2026-10-02); the gallery model of 2026-10-02: examples without a runner, a gallery command
per environment, gramlot-examples published on PyPI and npm ("si mi garba"). On 2026-10-04
the owner approved, phase by phase ("vai"), the removal plan of the core: the workflow is
renamed `Core tests`; the `file:` branch of the live checks is removed; the four Worker
checks of `verify_worker_host_browser.mjs` move to `verify_export_browser.mjs` of
`@gramlot/gramlot-serverless` instead of opening an issue.

1. Placement. The example pages (`html_svg`, `binding`, `controllers`), their READMEs, the
   gallery page and its catalogue live in `gramlot-examples`. Each environment serves them
   with its own gallery command (gramlot-py-server, gramlot-js-server,
   `@gramlot/gramlot-serverless`). The core keeps the `gramlot-base` theme and the logo,
   shipped in its packages (11.52).
2. Dependencies run one way: core ← gramlot-examples ← environments. The core does not
   depend on gramlot-examples or on any adapter, not even in CI or for tests.
3. Core tests. The core tests itself on its own fixtures. The end-to-end story of GC-210
   §065 runs on `js/tests/fixtures/qualification/09_end_to_end`. The browser checks of
   examples 10 and 13 run on `js/tests/fixtures/live/` through the Python and JavaScript
   FileHost of the core (`scripts/fixture_hosts.mjs`).
4. Packages. From the next release the JSR package of the core no longer includes
   `examples/html_svg/**`. Releases up to 0.2.5 remain as published.

Explicit supersession, with the superseded text kept as history: 11.22 (placement under
`examples/` and the runner in `examples/00-runner`); 11.31 and 11.37 (Gramlot as the sole
maintained source of example pages, runner and READMEs; Gramlot remains the source of
framework documentation, logo and theme); 11.44 (provisional runner in
`examples/00-runner` and its bounded exception, section 3); 11.54 item 4 (checks "on the
runner"); 11.55 item 5 (core `examples/` converted to the module form; the conversion
now applies to gramlot-examples).

Rules: [GC-025 §020](public/025-try.md#gc-025-020),
[GC-090 §010](public/090-classes-and-hosts.md#gc-090-010). Record: GC-070 §680.

### Amendment 11.57 — Current integration repositories; release version in the README; historical banners; resource host — 2026-10-05

Owner decisions of 2026-10-05 for the documentation coherence pass, approved in the
coordinating chat with the goal "l'insieme Gramlot deve essere pulito, coerente e senza
doc che possano creare confusione".

1. Integration repositories. §7 names the current integration repositories:
   `gramlot-py-server` (Python pages: one PyPI package, five adapters as the extras
   `uvicorn`, `django`, `flask`, `fastapi` and `kajenn`) and `gramlot-js-server`
   (JavaScript pages: `@gramlot/gramlot-js-server`, `@gramlot/gramlot-serverless`,
   `@gramlot/create`). `gramlot-examples` holds the example pages and the gallery
   (11.56). `gramlot-fastapi`, `gramlot-flask`, `gramlot-django`, `gramlot-kajenn`,
   `gramlot-uvicorn`, `gramlot-serverless` and `gramlot-minimal` are archived. Kajenn,
   formerly Genro ASGI, is published on PyPI as `kajenn`; its adapter is the `kajenn`
   extra of `gramlot-py-server`.
2. Release version. Each repository writes its current release version in one place:
   the README and its badge. Guides do not state the current patch release.
3. Historical documents. A document that records a past state keeps its dated text and
   opens with a banner: "Historical record (<dates>): describes <what>; not the current
   state. Current: <pointer>." Only broken links inside it are fixed.
4. Resource host. `css_requires` and `js_requires` need a Host with a resource system.
   `FileHost` and the current adapters have none and raise an error for any name. The
   resource system comes with genro-kajenn, part of Genro, the framework that succeeds
   GenroPy, built on Kajenn, Gramlot and Asqueel. genro-kajenn replaces
   `gramlot-kajenn` as the named resource host.

Explicit supersession, with the superseded text kept as history: the §7 table and its
paragraphs as last updated by 11.52 (quoted below); 11.19 (the six integration
repositories) and 11.48 item 5 (`gramlot-uvicorn` and `gramlot-serverless` as current
heirs of `gramlot-minimal`), for the current repository names; 11.48 items 1 and 4, for
the name of the resource host (`gramlot-kajenn`). The §14 naming clarification is
updated; dated decisions keep their original names.

Superseded §7 text, as updated by 11.52:

> | Repository | Integration environment |
> | --- | --- |
> | `gramlot-fastapi` | FastAPI |
> | `gramlot-flask` | Flask |
> | `gramlot-kajenn` | Kajenn, the new product name for Genro ASGI |
> | `gramlot-uvicorn` | Python with Uvicorn through the generic ASGI adapter |
> | `gramlot-js-server` | Node.js and Bun (`@gramlot/gramlot-js-server`); JavaScript in a browser Worker without a server, standalone (`@gramlot/gramlot-serverless`, amendments 11.50 and 11.52) |
> | `gramlot-django` | Django |
>
> `gramlot-minimal` replaced the repository name `gramlot-standalone` (amendment 11.19)
> and was retired on 2026-09-26/28 (amendment 11.48 item 5). Its heirs are
> `gramlot-uvicorn`, which owns the generic Python ASGI adapter, and
> `gramlot-serverless`, which owns the single-HTML exporter, standalone Worker
> integration and startup (amendment 11.46, as reassigned by 11.48); since
> 2026-10-01 it is a package in `gramlot-js-server` (amendment 11.50), named
> `@gramlot/gramlot-serverless` since 2026-10-02 (amendment 11.52). Standalone
> remains the browser/Worker profile name. Core retains shared Host/Page execution and
> rendering. `gramlot-kajenn` (formerly `gramlot-genro-asgi`) owns
> Kajenn-specific integration and depends only on Kajenn besides the core (amendment
> 11.48 item 5). The Kajenn adapter is not migrated yet: its `pyproject.toml` still
> declares the retired repository; the migration is deferred to after 0.2.0. The
> GitHub repository, local checkout and configured origin were renamed to
> `gramlot-kajenn` on 2026-09-26.
> The upstream Python distribution/import remains `genro-asgi`/`genro_asgi` until
> its owning project actually renames it. Do not invent an upstream package alias.
>
> Category membership does not establish release compatibility. The owner has
> authorized bounded Django alignment with the Host contract; its acceptance requires its own tests. Published 0.1.0 archives retain their original names and contents;
> new development uses the reorganized package ownership. No compatibility wrappers,
> registry releases, deployment or new core feature contract are implied.

Rules: [GC-005 §005](005-documentation-policy.md#gc-005-005),
[GC-090 §030](public/090-classes-and-hosts.md#gc-090-030). Record: GC-070 §690.

### Amendment 11.58 — The client/server contract of 0.2.14: one envelope, two gramlot-content-types, endpoints, `auth` closed by default — 2026-10-09

Owner decisions D1-D5 of 2026-10-09 for 0.2.14, taken in the coordinating chat:
Gramlot is a JS rendering library plus the rules a server MUST or MAY satisfy; the
contract is one and logical, realised separately per kind of server.

1. Contract. GC-230 states the contract (Part A) and its realisations over HTTP
   (Part B), inside a Worker (Part C) and over WebSocket (Part D). Every call is one
   envelope `{id, pageId, contentType, name, params}` answered by
   `{id, contentType, value}` or `{id, contentType, error: {code, name, message}}`.
   The gramlot-content-type `source` carries a fragment (`main` is the whole page);
   `data` carries the value of an endpoint. Outcomes travel inside the envelope;
   status codes are for transport failures only.
2. Server. `GramlotServer.call` (Python and JS) answers every envelope and raises only
   `InvalidRequest`. Over HTTP every envelope goes to `POST /gramlot/rpc`, which
   replaces `/gramlot/main` and `/gramlot/source`; the close message stays on
   `/gramlot/close`. The bootstrap config is `{pageId, rpcUrl, closeUrl, rootId,
   capabilities}`. `MAX_REQUEST_BYTES` and the mandatory 413 of 0.2.12 are removed.
3. Endpoints. A page declares an endpoint with `@endpoint` (Python) or
   `Page.registerEndpoint(name)` (JS), optionally with an `auth` rule. The base
   `evaluate_auth`/`evaluateAuth` knows no identity and refuses every rule with
   `not_authenticated` (closed by default); a server with an identity system
   overrides it and announces the `auth` capability.
4. Client. `gramlot.rpc.call(contentType, name, params, {signal})` sends the envelope
   through `HttpTransport` (formerly `MainTransport`) or an injected transport;
   `main` and the remote fragments go through it.
5. `dataRpc`. The data-element `dataRpc(method, result_path, timeout)` enters the
   binding grammar in Python and JS and leaves the exclusion list; `dataRemote` and
   the attribute `remote` stay excluded. The latest call of a node wins; the inline
   callbacks are `_onCalling`, `_onResult` and `_onError`; a `dataRpc` nested in a
   `button` is a click mechanism.
6. Deferred. The element-side `auth` (an element whose rule is unsatisfied is dropped
   by `GramlotBuilderBag` when the fragment is serialised) is
   gramlot-org/gramlot#34, after 0.2.14. The named form of the `dataRpc` callbacks
   waits for a written naming convention (GC-225).

Amendment of 11.53 item 1, by addition only: a `GramlotBuilderBag` inside a `data`
value is a value and activates nothing (GC-230 §015). The rest of 11.53 is unchanged.

Rules: [GC-095 §100](public/095-writing-pages.md#gc-095-100),
[GC-090 §020](public/090-classes-and-hosts.md#gc-090-020). Contract: GC-230,
`docs/internal/230-server-protocol.md`.

### Amendment 11.59 — `remote` and `dataRemote` realised in 0.2.16 — 2026-10-12

Amendment of 11.58 item 5: the sentence "`dataRemote` and the attribute `remote` stay
excluded" is superseded. In 0.2.16 both enter the grammar in Python and JS and leave
the exclusion lists. The attribute `remote`, written by the node method
`remote(name, …)`, makes the content of an element the fragment of a `@source`
method, requested at the element's start and on every change of a `^` parameter.
The data-element `dataRemote(destination_path, method, cacheTime, …)` installs at a
Data path a resolver that calls an endpoint when the path is read. The client/server
contract of 11.58 is unchanged. Out of 0.2.16: `lazy` loading by visibility,
`_waitingMessage`, the `tbody` merge, `_resolved`, `_fired` and the legacy alias
`data(path, remote=…)`.

Rules: [GC-095 §105](public/095-writing-pages.md#gc-095-105).

### Amendment 11.60 — Fixed method name for declarative `remote` — 2026-10-13

Owner confirmation: "il metodo per il momento NON puo essere variabile: non lo ea nel legacy e se un domani lo volessimo ammettere sar5a per una decisione esplicita".
Scope: the fragment method named by declarative `remote`, including the
`remote(name, ...)` authoring helper. The method name is a fixed literal identifier;
it cannot be supplied or varied by a Data pointer. Parameters may remain bound:
`^` parameters trigger calls; `=` parameters are read when a call is triggered.
The owner identifies the fixed method as the legacy contract. A future variable
method requires a separate explicit owner decision; it is not a pending feature
or an authoring capability to add implicitly.

This clarifies 11.59 and supersedes GC-095 §105's earlier description of reactive
fragment names, GC-070's proposed name-change exercise and its classification as
blocked by a missing helper capability. Rejection of pointer-valued names by the
helper is correct. Existing runtime behavior/tests permitting reactive fragment
names are implementation nonconformities, not evidence of an approved contract.
The old Q1 about clearing a reactive remote name is outside the current contract;
no clearing/cancellation semantics are newly approved. Other APIs and the open Q2
about live Source declaration edits are outside this clarification.

Rules: [GC-095 §105](public/095-writing-pages.md#gc-095-105).
Decision and remaining implementation work: GC-070 §755.

### Amendment 11.61 — A dedicated optional inspector Web Component — 2026-10-14

Owner decisions in the coordinating chat: "la mia idea era di metterlo nel repo di
gramlot come tool", clarified by "un conto è devtool un conto è un webcomponent
particolare"; the owner confirmed the distinction with "esatto" and proposed the
name "gramlot-tools-inspector". Implementation was authorized with "si metterei un
agente a parte a realizzare questo mentre noi procediamo sul nostro lavoro"; the
owner subsequently requested a dedicated worktree.

1. Scope. A specific optional Web Component, `gramlot-tools-inspector`, lives as
   a tool in this repository and opens an in-page floating palette to inspect
   Gramlot Data and Source across browsers, including the Safari use case.
2. Separation. The Chrome DevTools extension stays in its separate repository.
   This component neither transfers that extension nor imports its PoC runtime.
   The core has no dependency on or automatic activation of this tool.
3. Boundary. The palette uses current Gramlot Source, Data and named logic.
   This approval covers this particular browser tool, not a general component
   framework, widget grammar, component registry, or the future component series.
   No dependency-source edits, publication, release or deployment are authorized.
4. Verification. Cross-browser usability is an objective; claims name the engines
   actually tested. Playwright WebKit does not establish branded Safari support.

Bounded supersession: the Inspector exclusion in 11.22–11.24 and the separate-
approval requirement for future web components associated with 11.44/11.56 are
satisfied for this specific tool only. The extension's ownership is unchanged.
Implementation and remaining qualification are recorded in GC-070 §780;
[GC-195](internal/195-tools-inspector.md#gc-195-005) describes the tool.


Owner integration authorization, 2026-10-14: "si procedi con la revisione e
integrazione del componente e metti l'icona nel footer per aprire l'inspector
sull'esempio selezionato". This authorizes the optional tool artifact in the core
npm package, the gallery footer launcher, and explicit targeting of the selected
example. The runtime entry point does not import the tool. The gallery frame
bundle binds the tool's core import to the public constructors of its already
running Gramlot instance; it must not bundle a second core. Parent/frame messages
carry only open/close state, validate their source, and work for hosted and static
galleries. No keyboard shortcut or editing capability is introduced.

Owner scope correction, 2026-10-14: after reporting "nell inspectorb manca la
parte di editing sotto", the owner added "anche i breakpoint" to the proposal
for a Data/Source editor below the tree. This supersedes the initial read-only
and no-breakpoint limits for this specific tool. The component may edit the
selected node's scalar value and attributes through public Bag APIs and configure
path breakpoints (debugger/console, optional expression condition) as in DevTools.
The editor and breakpoint controls remain Source/Data/named Logic. Conditional
expressions are explicitly authored debug code subject to the inspected page's
CSP; errors must be shown rather than bypassing that policy. Pause/resume and
stepping remain browser debugger functions. No general component framework,
dependency-source edits or changes to the Chrome extension are authorized.


### Amendment 11.62 — Provisional inspector components — 2026-10-14

Owner: "si facciamo pane.webcomponent(code='gramlot-poc-tree'). pianifica come
usarlo per i componenti provvisori dell'inspector mantenendo l'aspetto dei devtools",
followed by "ok" to the five-step plan. The plan starts with the generic declaration
and one tree, to be validated before composing the full inspector. Owner then
confirmed "ok" to the clarified first-step connection: inspector JavaScript assigns
the actual Bag to the tree's `storeBag`; selection is received through Gramlot's
existing `connect_on...` event mechanism. Python can declare the component.

1. Introduce `webcomponent(code=...)` in Gramlot's Python and JS vocabulary. `code`
   is a required literal custom-element tag; its module is explicitly loaded.
   It does not automatically load or select a provisional implementation.
2. Confine the temporary `gramlot-poc-*` components to `tools/poc/`. Transfer only
   the inspector's needed tree, tabs, split containers and palette, with provenance,
   contracts and omissions recorded under PORT-0006-inspector-components.
3. Preserve the DevTools interface and interactions, including the properties grid
   and breakpoints. The previous custom palette appearance was rejected by the owner.
4. The first slice passes a Bag by JavaScript property; generic declarative Bag
   properties and selection writeback are not introduced. Current Gramlot Source,
   Data and named Logic compose the tool. PoC Application, renderer and registry
   are not imported; no second Bag or Gramlot runtime is bundled.
5. Replace provisional components progressively under their verified contracts.
   The first tree must be reviewed before completing the full inspector composition.

This supersedes 11.61's exclusion of a generic component declaration and bounded
PoC component transfers, only within this scope. Dependency-source edits, the
Chrome extension, publication and deployment remain outside this authorization.

Owner first-slice review, 2026-10-14: after the first tree/declaration qualification
and the proposed next step (layout/splitter, Properties grid, editing and
breakpoints), the owner answered "ok". This satisfies 11.62(5)'s first-tree gate
and authorizes full composition within the already stated boundary. It does not
constitute advance visual acceptance of the completed inspector.


Owner frame-selection extension, 2026-10-14: "deve funzionare esattamente come il
dev tools" and explicit confirmation "Sì, palette unica e collegamento completo"
to a single palette in the gallery shell with read/edit/breakpoint communication
to each example. This supersedes 11.61’s open/close-only gallery message boundary
for this tool. Explicitly registered gallery frames may receive a dedicated
MessagePort; only those channels carry inspection snapshots and validated commands.
The shell itself is also an explicit target, including on Introduction. The tool
uses current Bags and Source/named Logic for its UI; no extension privilege, PoC
runtime, arbitrary frame discovery, dependency-source edit or package publication
is authorized. Breakpoint execution and condition compilation stay in the selected
page, preserving its CSP and synchronous writer stack. The red breakpoint action
belongs on the left and is shown only on hover/keyboard focus, never pinned by
selection or an active breakpoint.


Owner breakpoint-indicator correction, 2026-10-14: "il pallino deve essere un
cerchietto grigio con l'hover ma se lo setto deve diventare rosso se non è
cindiziuonato e giallo se è condizionato e non essere con hover". This supersedes
the hover-only active-breakpoint appearance above: inactive actions are grey
outlined circles on hover/keyboard focus; active breakpoints stay visible, red
without a condition and yellow with a condition. Position remains on the left.


Owner palette correction, 2026-10-14: "palette collassabile e titolo centarto
nella floating e dimensione font sopra (ad esempio tab) proporxioanta". This
supersedes the provisional palette's no-collapse scope: the dedicated tool may
collapse to its title bar and restore its contents and size. Center the title
and use compact, proportionate header/tab typography. No persistence or general
layout framework is added.


Owner header alignment correction, 2026-10-14: "metti collapse e chiudi a destra
e titolo a sinistra" supersedes the preceding centered-title/left-toggle layout.
The title is left-aligned; collapse and close are adjacent on the right.


### Amendment 11.63 — Installable root and reusable index page — 2026-10-14

Owner confirms the default overridable Page manifest method, explicitly enabled
through page properties: "mi piace molto e lo metterei solo in radice"; then
"puoi provvedere a tutto ?" authorizes implementation with the reusable index.
This replaces the proposed manifest-file URL property, which was not implemented.
The root opts in with `installable` and supplies `title` and `app_icon` (JS
`appIcon`). A default `manifest` method returns the standard JSON; it may be
overridden. HTTP integrations expose it by GET at the application root; directory
exports materialize the same result as a file. No RPC envelope, offline cache,
service worker, publication or deployment is authorized. Non-root pages do not
expose their own manifest. Python, Node and serverless galleries are consumers.

The reusable Page subclass owns a fixed logo position, navigation, resizable
sidebar, iframe tabs and a customizable footer. Owner confirms: "Sì, schede con
iframe come nella galleria"; reopening a navigation item selects its existing tab.
The application chooses its logo, contents and footer. An app icon may derive from
the logo, but a separate icon remains possible. This bounded extraction supersedes
11.44/11.56's gallery-only placement for these reusable responsibilities; gallery
catalogues, Markdown and source viewers remain in gramlot-examples. Core tests
use independent fixtures. This does not approve a general widget/mixin framework.

The proposed `_gramlot` system Data branch, fire-driven services and system mixins
are deferred design work, at the owner's explicit request; they are not introduced
by this change. The legacy window-title investigation is evidence, not an approved
port of automatic frame-title synchronization.


### Amendment 11.64 — Recursive Bag population in authoring — 2026-10-14

Owner clarification: "se inizializzi una bag da un json è perche vuoi creare una
bag dello stesso contenuto logico. per questo il default e recursive".
Implementation scope confirmed: "ok procedi ad aggiornare documentazione e test
per il comportamento ricorsivo".

This supersedes 11.47 item 2 and GC-210 P25 only where they say that lists nested
inside an authoring dictionary/plain object, and dictionaries within those lists,
remain native containers. Gramlot delegates dictionary/plain-object conversion to
`Bag(value)` with its default recursive population. Nested dictionaries and lists
become Bags; sequence order and scalar leaf values are preserved. Empty nested
containers become empty Bags. No Gramlot converter or opt-out from recursion is
introduced.

A list supplied directly as a `dataSetter` value is still a literal list: this
amendment does not widen the existing dictionary/plain-object conversion trigger.
A JSON string supplied directly is still a string; it is not implicitly parsed.
The change aligns documentation and tests with Bag's recursive contract. It does
not authorize dependency-source changes or claim cross-language qualification
while the separate Builders JS/Bag dependency alignment remains unresolved.


### Amendment 11.65 — Bounded Builders JS dependency correction — 2026-10-14

Owner authorization: "ok procedi, ti autorizzo a correggere la dipendenza in
Builders JS e poi aggiorna Gramlot e verifica i test". This is a bounded exception
to the dependency-edit boundary: correct Builders JS's Bag requirement for the
current Bag, align dependency installation metadata and verification, then refresh
Gramlot and run the relevant suites. No Bag source changes, dependency runtime
workarounds, package publication or deployment are authorized. The general
dependency-source restriction remains in force outside this correction.


Owner release authorization, 2026-10-14: "ok fai bump versione, commit e push di
Builders JS e pubblica la versione corretta" authorizes the patch release of the
11.65 dependency correction, including commit/push and npm/JSR publication. This
supersedes 11.65's no-publication scope for Builders JS only; it does not authorize
a Gramlot release or deployment.


Owner JSR-only exception, 2026-10-14: "Sì, eccezione solo per JSR", in response
to the explicit proposal to use Bag `^0.11.0` and TYTX `^0.16.2` because JSR
rejects both `>=` and `*`. This supersedes the no-upper-cap rule only for JSR
import specifiers needed by this dependency alignment. npm retains minimum-only
requirements; no version lockfile or cap is introduced there. Builders JS 0.5.2
completes the previously authorized patch release, without rewriting v0.5.1.


### Amendment 11.66 — Defer additional remote-method enforcement — 2026-10-14

Owner clarification: "inoltre non è strettamente necessario proteggersi. basta
anche solo dirlo per oa che non è anmesso", followed by "inoltre potremmo pi
decidere che inece accettamo" and "allora lascia stare questo punto e prcedi
col resto". The current authoring contract remains a literal `remote` method
with reactive parameters. Existing helper checks stay in place; additional
runtime/received-Source enforcement and CustomTypes integration are deferred.
The proposed common-attribute extension to Builders is not approved and is
withdrawn from this work. No dependency extension or replacement validator is
required to finish the remaining responsibility review.

This supersedes the immediate enforcement requirement associated with 11.60 and
GC-070 §760, not the documented literal-method contract. Incidental runtime
acceptance of dynamic names is not a supported API; a future decision may allow
it. Live Source declaration mutation semantics (Q2) remain undecided and unchanged.
No new trigger, cancellation or rollback behavior is approved.


### Amendment 11.67 — Optional DevTools download in core documentation — 2026-10-15

Owner confirmation: "ok per collegamento e istruzioni", followed by the request
for a practical page for readers in a hurry to try and understand Gramlot.
The core README and public manual may link to the Chrome extension's releases
and explain ZIP extraction, unpacked installation, file-URL permission and reload.
The extension remains owned, built and released by `gramlot-devtools`; no extension
code, ZIP copy, runtime dependency or automatic installation enters core.

This narrowly supersedes the former external-tool rule forbidding any mention
or documentation of the extension in Gramlot (also recorded in the DevTools
repository instructions). Amendment 11.61's separation of the Chrome extension
and the optional in-page inspector remains in force. The practical entry page
points to `gramlot-py-server` and `gramlot-js-server` for their installation and
CLI instructions; the chronological teaching route remains separate and unchanged.


### Amendment 11.68 — Subscriptions access point approved — 2026-10-15

**Superseded access-point placement:** see 11.70; payload decisions remain in force.

Owner asked whether publish/subscribe would use an object on Gramlot and answered
"si" to: "Ti convince `gramlot.subscriptions` come nome e punto di accesso?".
The dedicated instance-owned access point is named `gramlot.subscriptions`.
This is a bounded exception to GC-225 §015's three-letter proxy naming rule for
this access point only; the other proxy conventions remain in force.

This approves the name and access point, not the illustrative method signatures,
payload format, declaration syntax, delivery semantics or release scope. Page-local,
interframe and cross-user coverage still require explicit decisions. This record
adds no runtime implementation or general application bridge; existing inspector
bridge approval remains tool-specific. No earlier runtime exclusion is lifted by
this naming decision. Record the name in both GC-225 views before implementation.


Owner follow-up on 2026-10-15: "sei tu che sai come funzionava. quindi se ti sembra
corretto procedi pure", answering the single-object `publish(topic, payload)`
proposal. Under that explicit delegation, retain one object of named message data;
there is no variadic positional-message form. This settles that base publication
shape only, not routing options, declaration syntax or provider merge behavior.
The next owner instruction requests documentation of the complete syntax even
though only part will be implemented initially. Complete-syntax proposals remain
separate from accepted implementation scope and available runtime behavior.


### Amendment 11.69 — Object references belong to the subscription port — 2026-10-15

Owner: "questo meccanismo era molto utile e va ripristrinato e lo metterei nel
perimetro della subxscribe", referring to the investigated legacy Python-to-browser
references, including explicit Source/widget/DOM/form references and automatic
conversion of a directly supplied Python Source object.

Restore that useful authoring capability within the publish/subscribe workstream,
including references among the declared arguments of subscription-triggered
controllers. The plan must include it in the initial local-controller slice for
existing Source/DOM targets, with corresponding JavaScript authoring behavior.
Component/widget and framework-form targets belong to the complete design and
must be connected to their own approved object/lifecycle contracts as available;
this does not authorize creating a general widget/form framework in this port.

Existing Gramlot `GramlotBuilder.reference`, `$gramlotRef` descriptors and renderer
`References` / `gramlot.dom.reference` already implement Source/DOM identity,
transport and explicit resolution. Reuse the existing primary representation and
lifecycle rather than introducing a parallel registry or expression protocol.
Automatic author-argument conversion/resolution is the missing integration to
qualify. Detailed public helper names and resolution timing/error semantics must
be finalized before implementation; the existing mounted-reference contract is
not silently changed.

This supersedes the earlier deferred/no-approved-port status of the object-reference
objective in GM-025, not the historical evidence or existing runtime contract.
It does not approve arbitrary `==` expression evaluation, Dojo imports, automatic
payload-string evaluation or transporting live objects across pages/users. A
serializable descriptor is not by itself a cross-page identity or authorization.


### Amendment 11.70 — Public publish command, internal subscriptions — 2026-10-15

Owner correction: "poi ho detto che preferisco che il comando sia gramlot publish e poi lui usi subscriptions o addirittura _sunscriptrios per ditre che è privato".

The public publication command is `gramlot.publish(topic, payload)`. It delegates
to the instance-owned subscription service; callers do not need to access that
service. This supersedes 11.68's public `gramlot.subscriptions` access point and
the proposal excluding a primary `gramlot.publish` method. It is the primary
command, not an alias for a second public publication API. The accepted single
object payload and 11.69's reference scope remain unchanged.

The owner also suggested `_subscriptions` to mark the service private. Its exact
internal spelling is not a public contract; record the final implementation name
before introducing it. Public subscribe/unsubscribe placement and signatures
remain proposals. This correction does not implement messaging or accept the
pending routing, delivery or release-scope decisions.


Owner follow-up (2026-10-15): "anche subscribe e unsubscribe li metterei direttamente su gramlot, con _subscriptions privato. poi vediamo come fare il publish verso un nodo specifico".
The public methods are `gramlot.publish`, `gramlot.subscribe` and
`gramlot.unsubscribe`; all delegate to the private instance-owned `_subscriptions`
service. This confirms the exact private property spelling and supersedes the
pending placement/name statements above. Subscription signatures, return handles
and lifecycle details remain proposed. Publication to a specific node is explicitly
left for the next design discussion; existing node-routing examples are proposals,
not accepted syntax. No runtime implementation is introduced by this decision.


### Amendment 11.71 — Actions, controllers and ask share the messaging design — 2026-10-15

Owner: "fa sempre parte del giro controller aioni ecc. tieni anche conto della
opzione ask e della sintassi button().dataController(....).ask()".

Prepare button `action`, the `ask` option and chained
`button().dataController(...).ask()` within the controller/action/messaging design,
including authored object references and subscription-triggered execution. Do not
exclude ask from that design as an unrelated feature. The chain is a requested
authoring form to specify, not a claim of an existing Gramlot or legacy helper.

Define confirmation, parameter collection, cancellation, argument precedence,
trigger eligibility, delay and disposal together with the existing provider
pipeline. Preserve the single button execution mechanism; this does not approve
running a child controller and a separate action on the same click. Dialog/input
presentation must respect approved component boundaries. Detailed ask signatures,
UI dependencies and implementation slice remain to be settled. This design scope
does not yet lift the existing runtime rejection of unsupported ask declarations.


### Amendment 11.72 — Legacy-shaped messaging port authorized — 2026-10-15

Owner: "ok aggiorna il piano mantenendo il più possibile la sintassi legacy e poi
procedi con l'implementazione", following explicit examples of
`gramlot.publish('refresh', data)`,
`gramlot.publish({topic: 'refresh', parent: true}, data)` and
`gramlot.publish({topic: 'refresh', iframe: 'detail'}, data)`, and the confirmation
that local publication precedes forwarding as in legacy. An authored iframe
reference is an extension of the existing `iframe` selector. This supersedes the
third-argument/options/targets publication proposal and its no-local-echo rule.

Proceed with the bounded port in GM-030: references, page/node subscriptions and
provider integration, parent/child communication, actions and ask, qualification
and teaching. Use legacy `subscribe_<topic>`, `selfsubscribe_<topic>`, `action`,
`ask`/`_ask` as the baseline, instead of inventing an alternate authoring language.
The proposed fluent `.ask()` has not been selected. Keep the accepted single
object payload and the direct Gramlot methods/private service of 11.70.

This lifts earlier subscription/ask exclusions only as each bounded capability
is implemented and tested. Existing single button mechanism, CSP and lifecycle
contracts remain in force. Record exact supported variants and unsupported ones;
form/widget frameworks, cross-user/server delivery and unrelated windows are not
approved by this instruction. Interframe transport across isolated/file frames
requires a concrete connection and async behavior decision, not reuse of the
inspector bridge by inference. No dependency patch or package publication.


11.72 transport follow-up: owner "le chiamate interfreame le farei solo con post".
All parent/child calls use browser postMessage, including same-origin pages. Local
publication remains synchronous and first; forwarding is asynchronous. Implement
an explicit direct-frame connection with instance identity, source/origin checks
and readiness/disposal, including opaque file/srcdoc frames; no direct calls into
another page's Gramlot instance. This is separate from the inspector protocol.


11.72 ask follow-up: owner explicitly accepted "Sì, dialog e campi nativi" to a
Gramlot Source/Data dialog using native controls for confirmation and base fields,
retaining ask/_ask, title, fields, name and lbl. Unsupported legacy widgets error.
This authorizes that bounded internal UI, not a general component collection.


### Amendment 11.73 — Inspector CSS variable trial — 2026-10-15

Owner request: "si ma anche solo un modo di editare le variabili css", followed
by "proviamo" after the proposal of a third Styles tab, grouped --gramlot-*
variables, colour controls, value fields, live preview and individual/all reset.
This authorizes that bounded trial in the optional inspector, including its
existing explicit page connections. General CSS editing, individual-element
styling, theme switching, downloads and persistence are deferred. The earlier
endpoint discussion does not authorize implementing a persistence service.

Extends 11.61–11.62 only for this tool's document-root variable editor. UI remains
Source/Data/named Logic; browser CSS operations belong to tool internals. Core
runtime, dependency sources, integrations, publication and deployment are unchanged.
Implementation/verification and owner visual acceptance remain distinct.

Owner layout clarification (same trial, 2026-10-15): "metti in colonna 1 il nome
var in 2 il valore in 3 il picker". Each variable occupies one compact row with
aligned name, value and colour-picker columns; this supersedes the initial
stacked presentation and the proposed multi-column wrapping of variable rows.

Owner follow-up (2026-10-15): "metti il reset dopo il picker, così le prime tre
colonne sono proprio nome, valore e picker". Reset occupies a fourth column
after the picker, including rows without a colour picker.

Owner download approval (2026-10-15): "ok" to the proposal "esporterei le sole
variabili modificate in un file theme-overrides.css, pronto da aggiungere dopo
il CSS del tema" and "Partiamo dal download CSS?". This supersedes the download
deferral in 11.73 only. Export the selected target's applied overrides through
the optional inspector, with no persistence endpoint or theme selection.

### Amendment 11.74 — Shared inspector in DevTools — 2026-10-15

Owner: "sì facciamo un unico inspector condiviso anche nei devtools", confirming
the proposal of one shared inspector with a DevTools-specific page connection.
This authorizes bounded connected work in gramlot-devtools and the optional
Gramlot inspector: shared Data/Source/Styles UI, editing, breakpoints and CSS
download, an embedded panel presentation, and shared page-side inspection
behavior behind the existing Chrome frame routing. DevTools imports Gramlot;
Gramlot never depends on, imports or distributes the extension. Supersedes the
separate inspector implementation described in 11.61/11.67; no application
runtime discovery hook, upstream dependency edit, release or deployment.
