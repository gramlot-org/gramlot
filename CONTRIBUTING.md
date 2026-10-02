# Contributing

## Setup

```sh
python3 -m venv .venv && .venv/bin/pip install -e '.[test]'
npm --prefix js install
npm --prefix js run build
npm --prefix examples install
.venv/bin/pip install -r requirements-docs.txt   # documentation only
```

The example runner links the `server/` and `browser/` packages of a sibling
`gramlot-js-server` checkout (`examples/package.json`).

## Checks before a commit

```sh
.venv/bin/python -m unittest discover -s tests
GRAMLOT_TEST_PYTHON="$PWD/.venv/bin/python" npm --prefix js test
npm --prefix examples test
node scripts/verify_binding_browser.mjs <playwright-core index.mjs> chromium   # when behavior changes
python3 scripts/prepare_docs.py
.venv/bin/python -m sphinx -W --keep-going -n -b html build/docs-source build/docs-site
.venv/bin/python scripts/check_public_docs.py   # when documentation changes
```

Documentation comes in pairs: every file in `docs/` has its counterpart in
`docs_llm/` with the same sections and anchors (`docs/005-documentation-policy.md`).

## Commits and branches

- New work on `develop`; `main` holds verified, owner-accepted work.
- Messages: `<type>: <subject>`, present tense, English. Types: `feat`, `fix`,
  `docs`, `refactor`, `test`, `chore`.
- Use `git switch`, never `git checkout`. Never force-push a pushed branch:
  fixes land as new commits.
- No AI, LLM or assistant references in commits, pull requests, code, comments
  or documents; no assistant `Co-Authored-By` trailers; no `Generated with …`
  lines.

## Releases

Only with owner authorization. The version in `pyproject.toml`, `jsr.json` and
`js/package.json` must match; release notes go in `.github/release-notes/v<version>.md`.
Push a tag `v<version>` on `main`, then run the `Publish release` workflow on the tag:
it runs the full CI, builds the distributions with the runtime provenance check,
creates the GitHub release and publishes to PyPI, npm and JSR (`@gramlot/gramlot`)
with trusted publishing; the npm and JSR jobs skip a version already published.
