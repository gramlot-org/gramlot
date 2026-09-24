# Gramlot product constitution

[Concise version](../docs_llm/00-constitution.md).

## 1. Authority and amendments

This constitution contains agreed product principles. Proposals, examples, PoC
behavior and open questions are not constitutional merely because they are recorded.
Later explicit owner decisions supersede earlier statements.

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
internals and components. When a capability is missing, record the gap and implement
the reusable Gramlot capability before using it in the application.

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
