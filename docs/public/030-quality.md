# Tests and coverage

Document ID: **GC-030**.

<a id="gc-030-005"></a>

## 005 · Read badges in context

The README documentation badge links to this repository's GitHub Actions workflow
on `main`. It becomes useful once the workflow has been pushed and run; it measures
documentation build health, not application correctness. The status and license
badges are labels, not test results.

The full experimental runtime is tested in `gramlot-poc`. This development
checkout contains Python and JS foundation tests. A current local packaged
Chromium matrix passes seven profiles: Uvicorn, FastAPI, Kajenn, Flask, Node, Bun
and Worker. This is bounded native HTML evidence, not release acceptance or
Safari/Firefox verification.
During consolidation, runtime coverage should identify that repository and the
revision measured. Move the tests and coverage collection with the implementation
as it enters this repository. No runtime percentage is measured here yet.
Hosted documentation and Codecov badges require a verified project connection.

The `Core and runner tests` workflow runs Python, core JavaScript and runner
unit tests on main/develop pushes, the CI integration branch, pull requests and
manual dispatch. It builds browser resources, installs the Python package and
explicitly selects that interpreter for JS interop. Runner dependencies use the
public Minimal and JS Server main branches alongside this repository, following
the examples' declared file dependencies. The runner unit suite does not verify
adapter behavior, standalone exports or the browser matrix. Coverage collection
is not yet included. [GitHub run 36058922420](https://github.com/gramlot-org/gramlot/actions/runs/36058922420)
passed Python 18/18, JavaScript 76/76 and runner 8/8 on the CI integration revision
`edce6cb`. The workflow is now integrated into main/develop; their first branch-specific
runs are pending. Main excludes unfinished binding tests, so its core JS count
is expected to be 72 while develop retains 76.

<a id="gc-030-010"></a>

## 010 · JavaScript is the primary runtime measure

Python describes applications, but the browser runtime is JavaScript. When runtime
code is accepted here, its coverage should include first-party JavaScript sources,
including files that no test imports. Report lines, branches and functions; exclude
third-party libraries, generated bundles and test helpers from that denominator.

Measure Python authoring and serialization separately. A combined total or a high
Python percentage can hide untested rendering, binding, controller or cleanup paths.
Use separate JavaScript and Python report flags in Codecov, with a visible
JavaScript result. These are requirements for future runtime CI, not implemented
coverage collection in this repository.

<a id="gc-030-015"></a>

## 015 · Coverage is not a browser acceptance test

The PoC currently runs its JavaScript suite with Node's test runner and uses jsdom
for DOM tests. That evidence is useful but does not establish behavior in real
browsers, visual quality, accessibility or every server/database combination.

For adoption decisions, look for tests of observable binding behavior, lifecycle
cleanup and request failures, together with real-browser checks for the components
you intend to use. Do not interpret a coverage percentage as a compatibility or
production-readiness guarantee.
