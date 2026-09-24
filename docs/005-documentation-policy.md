# 005 · Documentation policy

Document ID: **GC-005**.

[Concise counterpart](../docs_llm/005-documentation-policy.md).

<a id="gc-005-005"></a>

## 005 · Shared policy and ownership

Block ID: **GC-005-005**.

Constitution section 9 governs documentation across Gramlot, including host
adapters. This policy generalizes the owner-approved Django directive recorded in
`gramlot-django` commit `902fcbd`, document **GD-055**, block **GD-055-020**.
Each repository retains ownership of its technical content and documentation
builder. All Gramlot documentation sites use the classic Read the Docs visual
theme shown by Genro Bag: blue header, dark navigation sidebar, light content
area and the theme's default typography. Sphinx uses `sphinx_rtd_theme`; MkDocs
uses its `readthedocs` port. Preserve project logos and accurate status notices.
This owner decision supersedes the earlier Material/Furo choices. Future
documentation sites follow the same rule; application UI themes are separate.

Use **GC** for the clean Gramlot core, preserve **GD** for Django, and use **GF**
for FastAPI. Other repositories must choose distinct namespaces before assigning
IDs. Public consolidated documentation follows `main`; new work stays on `develop`
until verified and accepted. Publishing still requires authorization.

<a id="gc-005-010"></a>

## 010 · Pairing, ordering and identity

Block ID: **GC-005-010**.

1. Pair `docs/<path>` with `docs_llm/<path>`, including future folder structure.
   Update both views together, preserving decisions, constraints, status,
   limitations and open questions. Both remain readable and written in English.
2. Start guide filename prefixes at `005`, then `010`, `015`, and so on. Use gaps
   for insertions, such as `011`. Entry points, build configuration, requirements,
   assets and historical standalone exports are not numbered guides.
3. Assign a repository-wide document ID, such as `GF-005`, and level-two block IDs,
   such as `GF-005-010`. Initially space section numbers by five. Both views share
   logical IDs and explicit lowercase HTML anchors, such as `gf-005-010`.
4. Cite the ID plus a link to the intended view. Preserve IDs and anchors when
   moving files or changing display order, even if filename prefixes change.
   Never reuse retired IDs or restart IDs in a subfolder. Update inbound links;
   stable IDs alone do not redirect old URLs.
5. Run the owning repository's documentation checks and verify paired coverage,
   links and anchors. A concise view must never strengthen an implementation claim.

<a id="gc-005-015"></a>

## 015 · Adoption status

Block ID: **GC-005-015**.

Django has recorded this convention in its local policy; its documented mirror
coverage remains partial. This core policy has matching paths, IDs and anchors in
both views. The existing core `00-constitution.md`, `01-overview.md` and
`02-documentation.md` pairs retain their current paths and references for now;
their three-digit naming and explicit stable-block migration remains pending.
Do not silently invalidate existing constitutional references during that migration.

FastAPI must inventory its guides, choose matching human/concise paths and apply
the `GF` namespace while preserving any existing stable references. Its adoption
is not verified here. Each repository records actual coverage and outstanding
migration, adding missing mirrors when existing guides are substantially revised.
New architecture and product-contract guides require both views immediately.

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

Present Gramlot as one framework: this repository contains the bounded native HTML/typed Source development core. The richer `gramlot-poc` remains evidence and a laboratory, not the current 0.1.0 implementation or operating plan. Keep
implementation and verification claims tied to the repository and revision that
contain the evidence; transfer tests and guides with reviewed code.
