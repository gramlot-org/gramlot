# Building and publishing documentation

[Concise version](../docs_llm/02-documentation.md).

## 1. Sources and scope

The documentation site uses MkDocs with its classic Read the Docs theme and contains the repository
README, product documents, concise mirrors and port records. It describes the
current bootstrap state; it does not imply an available package or runtime API.
Documentation dependencies are separate from any future core installation.

Edit maintained Markdown in `docs/`, `docs_llm/` and `ports/`, or the root README.
Update paired product documents together. `scripts/prepare_docs.py` copies these
sources into the disposable `build/docs-source/` directory, preserving relative
links between directories. The root README becomes the home page. Never edit
generated copies. Add new navigation entries to `mkdocs.yml` where appropriate.

## 2. Local build

Run from the repository root with Python 3.12:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-docs.txt
.venv/bin/python scripts/prepare_docs.py
.venv/bin/python -m mkdocs build --strict
```

The generated site is in `build/docs-site/`. To preview it:

```sh
.venv/bin/python -m mkdocs serve
```

Open the local address printed by MkDocs. After editing maintained documents,
rerun the preparation command to refresh the staged sources. Mermaid diagrams
render in the browser through `docs/_static/mermaid.mjs`, loading Mermaid 10.9.3
from jsDelivr. Diagram rendering requires access to that CDN.

## 3. Read the Docs setup

1. Push the configuration and documentation to the branch to be built.
2. Install the Read the Docs GitHub App for `gramlot-org` and grant it access to
   `gramlot`. The importing GitHub account needs repository administration rights.
3. In Read the Docs, choose **Projects → Add project** and select
   `gramlot-org/gramlot`.
4. Use `.readthedocs.yaml` at the repository root. It selects Ubuntu 24.04 and
   Python 3.12, installs documentation requirements, stages the sources and runs
   MkDocs with warnings treated as failures.
5. Select `main` for the default public documentation version. New work belongs
   on `develop`; enable it as a separate documentation version only if a preview
   of development work is wanted.
6. Run a build and inspect its log and rendered pages. The hosted address is
   assigned by Read the Docs; it is not assumed by this configuration.

Repository preparation does not create a hosted project or authorize publication.
An actual hosted build and GitHub App access must be verified in Read the Docs.

See the official [MkDocs integration guide](https://docs.readthedocs.com/platform/stable/intro/mkdocs.html)
and [GitHub integration guide](https://docs.readthedocs.com/platform/latest/reference/git-integration.html).
