# Building the developer documentation

[Concise version](../docs_llm/02-documentation.md).

## 1. Audience and publication boundary

The public manual helps a developer assess the current Gramlot core and
distinguish richer experimental examples. It uses Sphinx, MyST Markdown and the
classic Read the Docs theme. Its chapters describe classes, server adapters,
page authoring, themes/CSS and extension gaps. The public guides follow the release sequence through the maintained authoring
surface, including RPC, remote Source and lazy Data; historical release notes and development-only
corrections are marked. The README states the current release version.

`scripts/prepare_docs.py` stages the README as the home page, an explicit
`PUBLIC_PAGES` allowlist and explicit logo/theme-guide image assets in `build/docs-source/`. Only the
nine guides under `docs/public/` are currently selected. Add a page explicitly
when it is suitable for users; merely adding a file under `docs/` does not publish it.

Architecture decisions, constitution, port records, working documents and
`docs_llm/` remain repository material. They are absent from generated pages,
downloadable Sphinx sources and site search. This is an editorial boundary, not
access control: files in the public Git repository remain publicly readable.
All guides still require paired documents and stable IDs. Public pages do not
link their internal concise counterparts.


The HTML presentation omits standalone `Document ID`/`Block ID` paragraphs and
three-digit heading prefixes. `docs/conf.py` applies this after parsing and before
Sphinx collects the table of contents, preserving section IDs and explicit anchors.
The numbered Markdown sources, concise mirrors and downloadable source copies
retain their reference metadata. This changes presentation, not document identity.
MyST colon-fenced containers pair code and result in GC-096. Its scoped CSS widens
that guide's content area to at most 1440px, uses a 1:3 code/result ratio from
1600px viewport width, and stacks the pairs below that threshold to prioritize
image readability. Images stop at their 1080px source width. The Read the Docs
theme is retained.

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


Theme-guide images in `docs/public/assets/themes/` are captured from the Python
and CSS in GC-096 using the core's loopback test host (`tests/http_server.py`)
and temporary page files outside the repository. They are explicitly listed in
`PUBLIC_ASSETS`; Sphinx copies them into `_images` and links scaled figures to
the originals. No permanent example runner or application is added to core.
To refresh them, extract the first page with and without its companion CSS;
add Compact; apply the Summary, larger-text and subtle-surface variants exactly
as described; and run the complete reactive page. Capture the latter before and
after selecting Warning/Wide and clearing Show details. Use the same viewport
for each pair and explicit host document Light/Dark modes for the surface pair.
The 2026-10-15 captures use a 1280×720 viewport and a 1080px-wide content crop
starting at x=100, y=0 (400–520px high). Keep unmodified browser pixels, descriptive
alt text and captions; visually inspect the built guide after replacing images.

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

The `Core tests` workflow collects runtime coverage: JavaScript with `c8 --all`
over `js/src`, unimported files included, and Python with coverage.py over
`src/gramlot`. It uploads separate reports to Codecov with the flags `javascript`
and `python` (`codecov.yml`); the two figures are never merged. Never substitute
Python coverage for browser-runtime coverage or import PoC percentages into the
core badge. See [the public quality guide](public/030-quality.md).

## 4. Retired collaborator guide

GC-055, an earlier Italian explanatory guide with paired HTML exports, was removed
from the maintained documentation on 2026-09-25 by owner decision. It served to
explain the project and is superseded by the 0.2.0 documentation. On 2026-10-01 the
ID GC-055 was assigned to the public guide The Gramlot family
(`docs/public/055-family.md`). By owner decision of 2026-10-05 the guide keeps GC-055:
an explicit exception to the rule that a retired ID is never reused
([GC-005 §010](005-documentation-policy.md#gc-005-010), item 4).


## 5. Future-work notes

[Future work](future/README.md) is the internal backlog for deferred ideas and
next-phase candidates. Separate cards record owner requirements, proposals,
dependencies and opportunities for parallel work. GC-070 remains the current
delivery checkpoint. This directory is excluded from the public manual; listing
an item does not approve implementation or reopen a completed phase.
