# Tests and coverage

Document ID: **GC-030**.

> **Release status.** This page describes Gramlot **0.2.0 (HTML/SVG data
> binding)**, released on 2026-09-30 (GitHub release `v0.2.0`); the current patch release is **0.2.1**
> (2026-10-01: PyPI `gramlot`, npm and JSR `@gramlot/gramlot`). The previous release is **0.1.2**.
> Text without a *0.2.0* mark describes behavior that comes from 0.1.2.

<a id="gc-030-005"></a>

## 005 · Read badges in context

The README shows six badges. The tests badge reports the `Core and runner tests`
workflow on `main`: it builds the browser runtime, installs the Python package, and
runs the Python suite, the core JavaScript suite (with the quiet-write and
symbolic-attribute contracts) and the runner suite, on pushes to `main` and
`develop`, pull requests and manual dispatch. The runner suite checks out the
public `main` branch of `gramlot-js-server` next to this repository, following the examples' declared file dependencies. The documentation
badge reports the documentation build. The two coverage badges report Codecov, one
per runtime (section 010). The PyPI and JSR badges show the published versions.
The license badge is a label.

The unit suites do not verify adapter behavior in a server, standalone exports or
real browsers. That evidence is the 0.2.0 qualification (GC-215 in
`docs/internal/`): complete suites in clean environments; Chromium, WebKit and
Firefox; the end-to-end story through the real Page, Host, TYTX and PageBootstrap
path; the served runtime checked against a fresh build; and the acceptance pages on
`gramlot-uvicorn`, `gramlot-js-server` (Node.js and Bun) and `gramlot-serverless`
(today `@gramlot/gramlot-serverless` in `gramlot-js-server`).
`gramlot-django`, `gramlot-fastapi`, `gramlot-flask` and `gramlot-kajenn` are
deferred to after 0.2.0 and excluded. The experimental runtime is tested in
`gramlot-poc`.

<a id="gc-030-010"></a>

## 010 · JavaScript is the primary runtime measure

Python describes applications, but the browser runtime is JavaScript. The CI
measures it with `c8 --all` on `js/src`: every first-party source file is in the
denominator, including files that no test imports; lines, branches and functions
are reported; third-party libraries, the generated bundle (`js/dist`) and the tests
are excluded. Python authoring and serialization (`src/gramlot`) are measured
separately with coverage.py, on the source tree.

Codecov receives two reports with the flags `javascript` and `python`
(`codecov.yml`); they are never merged into one figure, because a combined total
or a high Python percentage can hide untested rendering, binding, controller or
cleanup paths. On 2026-10-01 a local run of the suites measured JavaScript at 99.2%
of lines, 95.6% of branches and 99.0% of functions, and Python at 90% of
statements.

<a id="gc-030-015"></a>

## 015 · Coverage is not a browser acceptance test

The PoC currently runs its JavaScript suite with Node's test runner and uses jsdom
for DOM tests. That evidence is useful but does not establish behavior in real
browsers, visual quality, accessibility or every server/database combination.

For adoption decisions, look for tests of observable binding behavior, lifecycle
cleanup and request failures, together with real-browser checks for the components
you intend to use. Do not interpret a coverage percentage as a compatibility or
production-readiness guarantee.

*0.2.0:* real-browser binding tests use a separate runner; jsdom does not replace
them.
