# Developer documentation build

[Full version](../docs/02-documentation.md).

## 1. Audience and sources

Sphinx + MyST + sphinx_rtd_theme build a developer evaluation manual. Core contains a development native HTML foundation; draft API chapters distinguish it from a stable release. Public guides describe 0.2.0 (HTML/SVG data binding), in development, state that 0.1.2 is the latest published release, and mark planned 0.2.0 behavior without implementation claims. `prepare_docs.py` stages README, six explicit `PUBLIC_PAGES`
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
badge; configuration is not publication. Core has no runtime coverage yet. Future
CI must report first-party JavaScript (including unimported files) and Python
separately, excluding vendors/generated code/helpers. Do not attribute PoC results
to core. See [quality](public/030-quality.md).

## 4. Italian collaborator guide

Owner-requested Italian internal GC-055 has paired Markdown/HTML under internal/.
Full HTML includes inventory appendices; both embed 17 Mermaid SVGs, RTD styling,
fonts/logo for offline use. English remains the default for other technical docs.
Build with `scripts/build_collaborator_guide.py --tools <node-tools> --browser
<chromium> --sphinx-python <docs-python>`. Runner: BeautifulSoup; Node tools:
Mermaid/playwright-core; docs Python: requirements-docs.txt. The renderer helper
is render_guide_diagrams.mjs; staging is build/collaborator-guide. No change to
public allowlist. Verify strict builds, anchors/mirrors, links/assets and visual
readability plus desktop/mobile navigation.

The repository documentation entry is `docs/README.md`; GC-085 is the internal operating guide. Public draft chapters GC-090/095/100 cover the repository/classes/host map, page authoring and extension points. They are explicitly allowlisted; internal guides remain excluded.
