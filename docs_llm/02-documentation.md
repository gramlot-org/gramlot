# Developer documentation build

[Full version](../docs/02-documentation.md).

## 1. Audience and sources

Sphinx + MyST + sphinx_rtd_theme build a developer evaluation manual. Chapters cover classes, server adapters and their protocol, page authoring, data binding, server calls, remote Source and lazy Data, components, themes/CSS and extension gaps. Public guides describe the current version, without release history or process material (review plan of the 0.3.5 releases, d-course and p8, 2026-10-19). Only the README
states the current release version. `prepare_docs.py` stages README, fourteen explicit `PUBLIC_PAGES`
guides and explicit logo/theme-guide image assets. New files are not automatically public. Constitution,
architecture, ports and docs_llm are excluded from pages, source downloads and
search, but remain readable in the public Git repository. Pair guides and preserve
IDs; public guides do not link internal mirrors.


Cross-page anchor links (`page.md#gc-…`) are raw HTML ids MyST cannot resolve: `docs/conf.py`
suppresses `myst.xref_missing`; `check_public_docs.py` verifies every local link and anchor in the
built HTML.

HTML omits standalone document/block identity paragraphs and three-digit heading
prefixes, before table-of-contents collection; source metadata and section/explicit
anchors remain. Downloadable Markdown stays numbered. MyST colon containers pair
code/results in GC-096: 1:3 columns from 1600px, full-width results below that,
1440px content cap and no image enlargement beyond 1080px;
Read the Docs colours and typography remain.

## 2. Build and checks

Use Python 3.12; install `requirements-docs.txt`, run
`python scripts/prepare_docs.py`, then
`python -m sphinx -W --keep-going -n -b html build/docs-source build/docs-site`
and `python scripts/check_public_docs.py`. Preparation removes previous staging
and site output, including stale MkDocs pages. Edit originals only. Preview with
`python -m http.server 8000 --directory build/docs-site`; rebuild after edits.

GC-096 screenshots are browser captures of its Python/CSS through the core test
host, using temporary pages outside the repository. Explicit `PUBLIC_ASSETS`
stages them; Sphinx provides full-size image links. Refresh from the documented
Base/companion, Compact, Summary, larger-text, light/dark surface and reactive
variants. Reactive captures use Success/Narrow/checked then Warning/Wide/unchecked.
Use matching viewport/crops per pair; 2026-10-15: 1280×720, crop x=100/y=0,
1080px wide, 400–520px high. Modes are set by the test host. Preserve browser
pixels, alt text and captions; inspect the built guide. No core example app/runner.

CI runs the strict build and boundary check on main/develop pushes and PRs and
uploads an HTML artifact without deploying. The README badge tracks main and
needs an actual workflow run; it does not represent runtime correctness.

## 3. Hosting and coverage

Read the Docs uses root `.readthedocs.yaml`, Python 3.12, pinned docs requirements,
staging and strict Sphinx. Public docs follow main, with optional develop preview.
Hosted identity, GitHub App access and builds must be verified before adding its
badge; configuration is not publication. `Core tests` collects coverage: JavaScript
with `c8 --all` on `js/src` (unimported files included), Python with coverage.py on
`src/gramlot`; separate Codecov flags `javascript` and `python` (`codecov.yml`), never
merged. Do not attribute PoC results to core. See [quality](public/030-quality.md).

## 4. Retired collaborator guide

GC-055 (earlier Italian explanatory guide with HTML exports) was removed on
2026-09-25 by owner decision; superseded by the 0.2.0 docs. Since 2026-10-01 GC-055
is the public guide The Gramlot family (`docs/public/055-family.md`); owner decision of 2026-10-05:
it keeps the ID, an explicit exception to [GC-005 §010](005-documentation-policy.md#gc-005-010) item 4.


## 5. Future-work notes

[Future work](future/README.md) is the internal backlog for deferred ideas and
next-phase candidates. Separate cards record owner requirements, proposals,
dependencies and opportunities for parallel work. GC-070 remains the current
delivery checkpoint. This directory is excluded from the public manual; listing
an item does not approve implementation or reopen a completed phase.


## 6. Component and collection authoring guide

[GC-340 · How components and collections work](public/340-components-and-collections-guide.md)
explains definitions, Builder grammar, Source/Data, bases and mixins, complete JS
and Python examples, prepared packages, resources, dependencies and explicit
override rules. It describes the current development implementation, including
provisional prepared-collection behavior. It is a repository guide, outside the
public site's allowlist; adding it does not publish or promote a stable API.
