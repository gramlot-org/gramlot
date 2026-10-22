# Tests and coverage

Document ID: **GC-030**.

<a id="gc-030-005"></a>

## 005 · Read badges in context

The README shows eight badges. The tests badge reports the `Core tests`
workflow on `main`: it builds the browser runtime, installs the Python package, and
runs the Python suite, the core JavaScript suite (with the quiet-write and
symbolic-attribute contracts) and the browser checks in Chromium on core fixture
pages, on pushes to `main` and `develop`, pull requests and manual dispatch. It
checks out no other repository: the example pages are tested in gramlot-examples. The documentation
badge reports the documentation build. The two coverage badges report Codecov, one
per runtime (section 010). The PyPI and npm badges show the published versions.
The status badge shows the current release; the license badge is a label.

The unit suites of the core do not verify adapter behavior in a server, standalone
exports or real browsers. The adapters are tested in their own repositories:
`gramlot-py-server` runs its five adapters (Uvicorn, Django, Flask, FastAPI, Kajenn)
in its CI, and `gramlot-js-server` runs Node.js, Bun and
`@gramlot/gramlot-serverless` in its CI. Each adapter runs the conformance check of
the [server protocol](101-server-protocol.md#gc-101-150) against itself. The pages
of the gallery are checked in `gramlot-examples`. The experimental runtime is tested
in `gramlot-poc`.

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
cleanup paths. The two coverage badges of the README show the current figures.

<a id="gc-030-015"></a>

## 015 · Runtime coverage and teaching coverage

Core tests use core-owned fixtures. The integrations and gramlot-examples test
their own delivery and pages; results from gramlot-poc do not qualify this core.
Unit/DOM tests do not establish real-browser behavior, visual quality,
accessibility or every server/database combination. Check observable binding,
cleanup and request failures in the environments you intend to use.

The example catalogue and a passing load check are not proof that every feature
is taught. Record the installed catalogue, actions and environments checked. A
count of mounted fragments cannot prove that no transport request occurred.

When you review a lesson, check its prerequisites, its expected result and its
exercises against the running page, in Python and JavaScript. Coverage is not a
production-readiness guarantee.
