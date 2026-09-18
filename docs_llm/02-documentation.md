# Documentation build

[Full version](../docs/02-documentation.md).

## 1. Scope and sources

MkDocs + the classic Read the Docs theme publish the root README, `docs/`,
`docs_llm/` and `ports/`.
The site describes bootstrap status, not an implemented runtime or installable API.
Documentation dependencies remain separate from core. Edit maintained sources,
update paired documents together and add navigation in `mkdocs.yml` as needed.

## 2. Build and preview

Use Python 3.12 and a virtual environment. Install `requirements-docs.txt`, run
`python scripts/prepare_docs.py`, then `python -m mkdocs build --strict`.
The script regenerates disposable `build/docs-source/`, preserving relative links
and mapping the root README to `index.md`. Output is `build/docs-site/`.
Use `python -m mkdocs serve` for preview; rerun preparation after source edits.
`docs/_static/mermaid.mjs` renders diagrams using Mermaid 10.9.3 from jsDelivr;
browser access to that CDN is required.

## 3. Hosting and remaining setup

Push the files to the intended branch. Grant the Read the Docs GitHub App access
to `gramlot-org/gramlot` and import it with repository admin rights.
Root `.readthedocs.yaml` selects Ubuntu 24.04, Python 3.12, requirements,
source preparation and a strict MkDocs build. Use `main` for public documentation;
new work belongs on `develop`, with an optional separate preview version.
Read the Docs assigns the URL.
Preparation neither creates the hosted project nor authorizes publication.
App access and a successful hosted build remain to be verified in Read the Docs.

## Brand assets

The preparation step also copies `assets/` so README logos and the shared graphic
coordination guide remain available in the generated site. Edit the original
files under `assets/branding/`, not their generated copies.
