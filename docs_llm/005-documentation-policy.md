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
gramlot-js-server **GN**/**GS** (server/browser); gramlot-examples **GE**;
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
   Update links; stable IDs do not redirect URLs.
5. Run local docs checks; verify mirrors, links, anchors. Never strengthen claims.

Owner decision, 2026-09-25: version-specific core guides use the hundreds digit
as the release series: 0.2 uses **210–295**, 0.3 starts at **310**. **190–205**
remain reserved for guides not tied to a release. Verify availability before
allocation; existing/retired document IDs are never reused. The first 0.2.0 contract
is [GC-210](internal/210-binding-contract.md); section IDs inside older documents
(such as GC-070-210) do not occupy document ID GC-210. Preserve paired anchors and
five-step spacing. This extends allocation policy without renumbering older guides.

<a id="gc-005-015"></a>

## 015 · Adoption status

Block ID: **GC-005-015**.

Django policy exists; mirror coverage remains partial. This core policy is paired
with matching IDs/anchors. Core 00-constitution/01-overview/02-documentation retain
legacy paths/references; three-digit/stable-block migration is pending and must
preserve constitutional references. FastAPI must inventory guides and adopt GF
with paired paths while preserving existing references; adoption is unverified.
Track actual gaps; add missing mirrors on substantial revision. New architecture
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
and downloadable sources. The public guides GC-020, GC-025, GC-030, GC-090, GC-095 and GC-100 have paired
paths and stable block anchors. Existing legacy migration gaps remain unchanged.

Present Gramlot as one framework: this repository contains the typed Source development core. The richer `gramlot-poc` remains evidence and a laboratory, not the current 0.1.0 implementation or operating plan. Keep
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
