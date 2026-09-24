# Gramlot product constitution

[Expanded version](../docs/00-constitution.md).

## 1. Authority

- **1.1** Constitution = agreed product principles; excludes proposals, examples,
  PoC behavior and open questions.
- **1.2** Check requests/ports before affected work. Cite conflicts. Resolve by adapting
  work or explicit owner amendment; LLMs/reviewers cannot amend architecture.
- **1.3** Record amendment date, changed principle and superseded decision in both docs.

## 2. Identity

- **2.1** Independent declarative UI framework: Python-first application authoring,
  JavaScript browser runtime, Apache 2.0.
- **2.2** Core is server- and database-independent. Host and DB adapters are separate.
- **2.3** No formal Live Object Tree semantics are approved; do not infer them.

## 3. Applications

- **3.1** Gramlot apps/examples/demos/PoCs use Source, Data Bags, bindings, controllers,
  resolvers and shared components for UI, state, interaction and requests.
- **3.2** No app-local DOM construction/manipulation, manual event wiring, input
  scraping, ad hoc fetch or parallel UI/state. Implement missing reusable capability.
- **3.3** Show Python first. Small local JS expressions are allowed; do not hide apps
  in large JS strings/support files.

## 4. Source and behavior

- **4.1** Source declares structure/behavior; Data Bags hold state; bindings connect
  them; controllers react; resolvers provide data. Not every Source node creates DOM.
- **4.2** Contracts define Data writes, lifecycle, cleanup, failures and isolation.
  Python/browser/server mixins are distinct. No final hierarchy/API approved.

## 5. Evidence and ports

- **5.1** GenroPy legacy is the nearly ideal behavioral reference. Preserve useful
  behavior/familiar authoring; remove Dojo and implementation complexity; record gaps.
- **5.2** Living `gramlot-poc` code/tests/inventory are evidence, not product contracts.
  Inventory distinguishes observed/proposed/agreed/verified; census is no commitment.
- **5.3** Admit small ports with bounded contract, responsibilities, code, meaningful
  tests, omissions and destination review.
- **5.4** Owner 2026-09-17 explicitly authorizes public `gramlot-org/gramlot-poc`;
  repository is public. Supersedes temporary privacy decision of 2026-09-16.
  No authorization for other repository visibility changes or product acceptance.

## 6. Building blocks

- **6.1** Component = control contract; controller = reaction; recipe = Source
  composition; service/handler = shared contract; mixin = class capability.
- **6.2** Approve concrete composition, precedence and lifecycle incrementally.

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
| `gramlot-nodejs` | Node.js and Bun |
| `gramlot-django` | Django |

`gramlot-minimal` replaces the repository name `gramlot-standalone`; standalone
remains the browser/Worker profile name. It owns the generic Python ASGI adapter
and the existing single-HTML exporter. Core retains Host/Page execution and the
Worker runtime. `gramlot-kajenn` replaces `gramlot-genro-asgi` and owns Kajenn-specific
integration, consuming the generic ASGI adapter from minimal without duplicating it.
The upstream Python distribution/import remains `genro-asgi`/`genro_asgi` until
its owning project actually renames it. Do not invent an upstream package alias.

Category membership does not establish release compatibility. The owner has
authorized bounded Django native alignment; its acceptance requires its own tests. Published 0.1.0 archives retain their original names and contents;
new development uses the reorganized package ownership. No compatibility wrappers,
registry releases, deployment or new core feature contract are implied.

## 8. Database adapters

- **8.1** Areas: `common`, `fake`, `genropy`, `sqlalchemy`; SQLite is a SQLAlchemy backend.
- **8.2** Capabilities: required minimum / common optional / implementation-specific.
  Common support implies no extensions; `auxColumns` is GenroPy-specific.
- **8.3** dbSelect direction: prefix then containment; both case modes. Exact fallback
  and results require accepted contract. dataRecord/dataSelection/protocol remain open.

## 9. Documentation

- **9.1** Product docs describe accepted behavior, not migration. Pair `docs`/`docs_llm`.
- **9.2** Compact docs remain human-readable and preserve decisions/status/open points.
- **9.3** Number references; Mermaid for useful diagrams; maintained code/docs English.
- **9.4** No unsupported API, compatibility, release or verification claims.
- **9.5** All repositories: three-digit guide prefixes initially 005/010/015;
  paired paths/order/document IDs/block IDs and explicit level-two anchors match.
  Use distinct repository namespaces; IDs are global within each repo, even across
  mirrored folders. Insert into gaps; preserve IDs/anchors across moves/reordering;
  never reuse retired IDs. Update links: IDs do not redirect URLs. Entry points,
  config, requirements, assets and historical exports are exempt. Track legacy
  gaps and add mirrors on substantial revision. See [policy](005-documentation-policy.md).
- **9.6** All current/future Gramlot doc sites use classic Read the Docs, as in
  Genro Bag: blue header, dark sidebar, light content, default typography.
  Sphinx: `sphinx_rtd_theme`; MkDocs: `readthedocs`. Preserve logos/status notices.
  Application UI themes are separate.

## 10. Acceptance

- **10.1** Across Gramlot, `main` is the consolidated public reference for code,
  docs, configuration and other maintained artifacts. New work stays on `develop`
  until verified and accepted, then joins `main`. Public docs default to `main`;
  optional development previews follow `develop`. This is a general rule, not
  specific to Read the Docs, and does not authorize publication/releases/deployment.
- **10.2** Contract, code, tests and paired docs agree before admission.
- **10.3** Relevant adapters may advance with core; first slice need not cover all pairs.
- **10.4** Real apps expose gaps; fix them in reusable layers, never local workarounds.

## 11. Amendments

- **11.1 — 2026-09-16:** Initial constitution from approved owner decisions.
- **11.2 — 2026-09-16:** Owner clarified section 10 for all Gramlot artifacts:
  `main` is the consolidated public reference; `develop` holds new work until
  verified and accepted. Supersedes the shorter "`main` consolidated; `develop`
  new work" rule. Publication/releases/deployment still require authorization.
- **11.3 — 2026-09-16:** Owner generalized Django's ordering/stable-reference
  directive. Refines section 9's generic numbered references with three-digit
  ordering, repository namespaces, shared document/block IDs, explicit anchors
  and preservation across moves. Pairing and accurate-claim rules remain.
- **11.4 — 2026-09-16:** Owner selected Genro Bag's classic Read the Docs
  appearance for all Gramlot docs. Section 9 supersedes prior Material/Furo choices.


- **11.5 — 2026-09-16:** Owner keeps PoC private. Section 5 adds visibility constraint;
  section 10's public-reference wording does not authorize exposing private repos.
  Architecture and port acceptance are unchanged.

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

- **11.8 — 2026-09-17:** Owner authorizes public `gramlot-org/gramlot-poc`.
  Section 5 supersedes amendment 11.5 privacy constraint. Architecture, port
  acceptance and other publication authorization requirements are unchanged.

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

Owner decision, 2026-09-21: subsequent work is restricted to Gramlot. Builder JS
and Bag JS are dependencies to inspect read-only, not repositories to modify
from this workstream. Do not edit their installed source copies either. Report
missing capabilities or defects to their owning projects; do not compensate with
Gramlot compatibility paths or duplicated implementations. Only an explicit owner
instruction can reopen direct changes to these dependencies.

Owner clarification, 2026-09-22: agreed Gramlot work includes connected adapter
repositories. The native HTML lifecycle may update `gramlot-nodejs`,
`gramlot-fastapi`, `gramlot-flask` and `gramlot-genro-asgi` in their owning layers.
Builder JS and Bag JS remain read-only.

Amendment 11.15 — 2026-09-22: clarifies section 14 and supersedes its narrow
central-repository-only interpretation; it does not reopen Builder/Bag edits or
authorize consumer workarounds.

Amendment 11.16 — 2026-09-22: owner assigns the 0.1.0 Python authoring fix to
Gramlot's `GramlotBuilder`, not generic Builder Python. Gramlot owns its packaged
`builder_grammar` 1.1 and extra collection loading, existing `SourceBag` typed
transport registration, mixed text and atomic child insertion. This narrowly
supersedes §13/GC-092 ownership for Python authoring only. No alternate Source,
dependency source edits or publication are authorized.

Amendment 11.17 — 2026-09-22: owner extends the 0.1.0 choice to JavaScript.
Gramlot owns fluent-handle to Source-target mapping, including native sub-builders,
and does not require generic Builder's `sourceTarget` export. Generic Builder stays
read-only and continues to own BuilderBase, SourceBag, grammars and traversal.

Amendment 11.18 — 2026-09-22: owner requires both Gramlot JS and fresh installers
to use the latest maintained generic Builder JS. This supersedes 11.17's duplicate
local handle mapping; Gramlot consumes generic `sourceTarget`. The generic source
must be available to installers before a clean 0.1.0 install. No package release
is authorized by this decision alone.

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
