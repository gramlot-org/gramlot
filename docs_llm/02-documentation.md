# Developer documentation build

[Full version](../docs/02-documentation.md).

## 1. Audience and sources

Sphinx + MyST + sphinx_rtd_theme build a developer evaluation manual. Chapters cover classes, server adapters, page authoring and extension gaps. Public guides describe 0.2.0 (HTML/SVG data binding), released 2026-09-30, and mark 0.2.0 behavior; only the README states the current release version. `prepare_docs.py` stages README, seven explicit `PUBLIC_PAGES`
guides and two logo assets. New files are not automatically public. Constitution,
architecture, ports and docs_llm are excluded from pages, source downloads and
search, but remain readable in the public Git repository. Pair guides and preserve
IDs; public guides do not link internal mirrors.

## 2. Build and checks

Use Python 3.12; install `requirements-docs.txt`, run
`python scripts/prepare_docs.py`, then
`python -m sphinx -W --keep-going -n -b html build/docs-source build/docs-site`
and `python scripts/check_public_docs.py`. Preparation removes previous staging
and site output, including stale MkDocs pages. Edit originals only. Preview with
`python -m http.server 8000 --directory build/docs-site`; rebuild after edits.
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
is the public guide The Gramlot family (`docs/public/055-family.md`), its only current holder.
