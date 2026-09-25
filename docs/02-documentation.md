# Building the developer documentation

[Concise version](../docs_llm/02-documentation.md).

## 1. Audience and publication boundary

The public manual helps a developer assess the current native HTML foundation and
distinguish richer experimental examples. It uses Sphinx, MyST Markdown and the
classic Read the Docs theme. Draft development chapters describe classes,
server adapters, page authoring and extension gaps. They do not claim a stable release.

`scripts/prepare_docs.py` stages the README as the home page, an explicit
`PUBLIC_PAGES` allowlist and two logo assets in `build/docs-source/`. Only the
six guides under `docs/public/` are currently selected. Add a page explicitly
when it is suitable for users; merely adding a file under `docs/` does not publish it.

Architecture decisions, constitution, port records, working documents and
`docs_llm/` remain repository material. They are absent from generated pages,
downloadable Sphinx sources and site search. This is an editorial boundary, not
access control: files in the public Git repository remain publicly readable.
All guides still require paired documents and stable IDs. Public pages do not
link their internal concise counterparts.

## 2. Local build and validation

Use Python 3.12 from the repository root:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-docs.txt
.venv/bin/python scripts/prepare_docs.py
.venv/bin/python -m sphinx -W --keep-going -n -b html build/docs-source build/docs-site
.venv/bin/python scripts/check_public_docs.py
```

Preparation deletes previous staged sources **and site output**, including pages
left by the former MkDocs build. Never edit generated copies. The boundary check
verifies the staged file allowlist, generated HTML pages and search document set.
Preview with `python3 -m http.server 8000 --directory build/docs-site` and open
`http://localhost:8000`. Rerun preparation and Sphinx after editing sources.

The `Documentation` GitHub Actions workflow runs these checks on main/develop
pushes and pull requests, and retains the HTML as an artifact. It does not deploy.
The README build badge follows `main` and may show no status until the workflow
has reached that branch and run. It is not a runtime test badge.

## 3. Read the Docs and coverage

Root `.readthedocs.yaml` selects Python 3.12, installs the documentation
requirements, stages the allowlist and runs Sphinx with warnings as failures.
Use `main` for the public version; `develop` can have a separate preview.
The repository configuration does not establish the hosted project's identity,
GitHub App access or successful remote builds. Verify these before adding a
Read the Docs status badge. Repository preparation does not publish a site.

See the official [Sphinx configuration reference](https://www.sphinx-doc.org/en/master/usage/configuration.html)
and [Read the Docs configuration reference](https://docs.readthedocs.com/platform/stable/config-file/v2.html).

There is no runtime coverage job yet. Core foundation tests exist; collect JavaScript coverage over first-party runtime sources including
unimported files, and collect Python coverage separately. Upload separate reports
and flags; never substitute Python coverage for browser-runtime coverage or import
PoC percentages into the core badge. See [the public quality guide](public/030-quality.md).

## 4. Retired collaborator guide

GC-055, an earlier Italian explanatory guide with paired HTML exports, was removed
from the maintained documentation on 2026-09-25 by owner decision. It served to
explain the project and is superseded by the 0.2.0 documentation. The ID GC-055 is
retired and is never reused.
