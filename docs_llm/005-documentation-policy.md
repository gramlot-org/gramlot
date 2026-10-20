# 005 · Documentation policy

Document ID: **GC-005**.

[Expanded counterpart](../docs/005-documentation-policy.md).

<a id="gc-005-005"></a>

## 005 · Shared policy and ownership

Block ID: **GC-005-005**.

Constitution §9 generalizes owner-approved Django `902fcbd`, **GD-055-020**, to all
Gramlot repositories. Content/builders remain locally owned. All documentation
sites use the classic Read the Docs appearance from Genro Bag: blue header, dark
sidebar, light content, default typography. Use `sphinx_rtd_theme` for Sphinx or
`readthedocs` for MkDocs; preserve logos/status notices. Supersedes Material/Furo;
applies to future doc sites, not application UI. Namespaces: core **GC**;
gramlot-js-server **GN**/**GS** (server/serverless); gramlot-examples **GE**;
gramlot-py-server **GP** (owner, 2026-10-02). Frozen, never reused: **GD** Django,
**GF** FastAPI, **GA** Kajenn, **GS** of gramlot-uvicorn (archive only);
gramlot-flask has none. Other repos choose distinct ones. Public reference = `main`; new work = `develop` until
verified/accepted. Publication still needs authorization.

<a id="gc-005-010"></a>

## 010 · Pairing, ordering and identity

Block ID: **GC-005-010**.

1. Mirror `docs/<path>` and `docs_llm/<path>`, including folders; update together.
   Both readable/English; preserve decisions, constraints, status, limits, questions.
2. Guide prefixes initially 005/010/015; insert in gaps. Exempt entry points,
   config, requirements, assets and historical standalone exports.
3. Repository-wide document IDs (GF-005), level-two block IDs (GF-005-010), initially
   sections spaced by five; shared logical IDs and explicit lowercase HTML anchors.
4. Cite ID + view link. Preserve IDs/anchors across moves/reordering, even if
   filename prefixes change. Never reuse retired IDs or restart per folder.
   Update links; stable IDs do not redirect URLs. Explicit exception (owner,
   2026-10-05): GC-055, retired 2026-09-25, stays with The Gramlot family
   (`docs/public/055-family.md`, assigned 2026-10-01); no other retired ID is reused. Split of Writing pages, 2026-10-19 (review phase p8): the blocks
   GC-095-040 to GC-095-090 and GC-095-130 moved to GC-097, GC-095-100 to GC-098 and
   GC-095-105 to GC-099 with their block IDs and anchors; their links name the new files.
   Duplicate ID, 2026-10-19 (review phase p4c): the internal register of Python and JavaScript
   Builder differences carried GC-105 like the public guide Components. The register is
   renumbered GC-106 (`docs/internal/106-builder-python-js-differences.md`, anchors `gc-106-NNN`);
   the public guide keeps GC-105. 106 was never used; every document ID is unique.
5. Run local docs checks; verify mirrors, links, anchors. Never strengthen claims.

Owner decision, 2026-09-25: version-specific core guides use the hundreds digit
as the release series: 0.2 uses **210–295**, 0.3 starts at **310**. **190–205**
remain reserved for guides not tied to a release. Verify availability before
allocation; existing/retired document IDs are never reused. The first 0.2.0 contract
is [GC-210](internal/210-binding-contract.md); section IDs inside older documents
(such as GC-070-210) do not occupy document ID GC-210. Preserve paired anchors and
five-step spacing. This extends allocation policy without renumbering older guides.

Owner clarification, 2026-10-13: teaching sections follow the chronological
sequence of product releases. The same example may return in a later release's
section to show how a new feature reduces the necessary code. Preserve the earlier
learning stage, label the release and prerequisites of each later comparison,
identify the code replaced and explain whether the observable result stays the
same. Topic indexes are supplementary, not a replacement for this progression.
Maintained examples use supported APIs; historical snippets must be labelled and
do not require pinned or downgraded dependencies. This is product learning history,
not a migration-work log. Owner's words and delivery scope: GC-070 §745.

Owner decision, 2026-10-19 (review of the 0.3.5 releases, decision d-course, chosen
by Giovanni Porcari over "keep the chronological order": "Tutta la galleria adeguata
alla versione attuale, con un percorso didattico e non storico"): the gallery follows a
teaching path for the current version. Lesson numbers follow the menu order; lessons
carry no version labels, release history or process text; prerequisites point only
backwards; one lesson teaches one concept; links from the core, the adapters and the
site are updated in the same round. The approved review plan applies the same rule to
the public guides of the core (phase p8): they describe the current version. This
supersedes the chronological sequence of the 2026-10-13 clarification above.

<a id="gc-005-015"></a>

## 015 · Adoption status

Block ID: **GC-005-015**.

gramlot-py-server (GP), gramlot-js-server (GN, GS) and gramlot-examples (GE) apply it
with paired docs/docs_llm; archived Django, FastAPI and Kajenn repos keep records and
namespaces frozen (§005). This core policy is paired
with matching IDs/anchors. Core 00-constitution/01-overview/02-documentation retain
legacy paths/references; three-digit/stable-block migration is pending and must
preserve constitutional references. Track actual gaps; add missing mirrors on substantial revision. New architecture
and product-contract guides require both forms immediately.

<a id="gc-005-020"></a>

## 020 · Public manual selection

Block ID: **GC-005-020**.

Owner direction, 2026-09-18: the public manual addresses developers deciding
whether and how to try Gramlot. Architecture decisions, working documents,
concise mirrors and port records remain repository documentation rather than
public manual pages. This does not make files in a public repository private.

Core now uses Sphinx with the classic Read the Docs theme. The staging script's
explicit page and asset allowlists define the site boundary, including search
and downloadable sources. The public guides GC-018, GC-020, GC-025, GC-030, GC-055, GC-090, GC-095, GC-096, GC-097, GC-098, GC-099, GC-100, GC-101 and GC-105 have paired
paths and stable block anchors. Existing legacy migration gaps remain unchanged.

Present Gramlot as one framework: this repository contains the typed Source development core. The richer `gramlot-poc` remains evidence and a laboratory, not the core implementation or its operating plan. Keep
implementation and verification claims tied to the repository and revision that
contain the evidence; transfer tests and guides with reviewed code.


<a id="gc-005-025"></a>
## 025 · Evidence provenance before implementation

Owner direction, 2026-09-24: verify documents used as implementation inputs before
they propagate incorrect assumptions. Historical manuals, PoC tests, agent reports
and conversation summaries are evidence/indexes, not independent authority.
Distinguish current owner decisions, observed runtime facts, proposals and unresolved
claims. When a summary attributes a decision to the owner, check the original user
message and its scope; an assistant recommendation or a request for explanation is
not approval. Later owner corrections take precedence.

For each consequential requirement record its source, date/revision, verification
and status. A dependency defect requires a contract-based reproducer; a difference
from legacy alone does not establish a defect. Mark superseded interpretations
where readers enter the affected document and correct active plans in place.
Preserve historical evidence without silently rewriting external archives.
See [GC-170](internal/170-binding-source-audit.md) for the first binding source audit
and its explicitly limited coverage.

<a id="gc-005-030"></a>
## 030 · The word "native"

Block ID: **GC-005-030**.

Owner, 2026-10-02: "native" never names a release, profile, milestone, adapter,
module, API or pages. As the 0.1.0 profile name it meant only "no web components,
no recipes"; no technical meaning. Allowed meanings only:

1. browser behavior/controls (form controls, Reset, implicit submission, `<details>`);
2. DOM events/listeners (`NativeEventBinding`, `connect_on<event>`);
3. HTML attributes that do not become style (`NATIVE_ATTRIBUTES`, `splitNativeAttributes`);
4. DOM properties/operations;
5. genro-bag events/subscriptions;
6. platform/runtime APIs (`node:http`, `Bun.serve`);
7. standard HTML/SVG element versus custom element.

Two readings: keep "native" only if the sentence names the opposed alternative
(custom element, style conversion, snapshot, browser behavior); else use the precise
term ("HTML elements", "typed SourceBag", "attribute projection"). Dated records keep
their text with a naming note (§025). See [constitution](00-constitution.md) 11.51.
