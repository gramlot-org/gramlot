# Tests and coverage

Document ID: **GC-030**.

> **Release status.** This page describes Gramlot **0.2.0 (HTML/SVG data
> binding), in development**. 0.2.0 is an approved plan: its code is not yet
> implemented, tested or released. The latest published release is **0.1.2**.
> Text without a *0.2.0* mark describes 0.1.2 behavior.

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
is not yet included. Verified GitHub runs on 2026-09-24:

- [main](https://github.com/gramlot-org/gramlot/actions/runs/36059477892), revision
  `76321ac`: Python 18/18, JavaScript 72/72 and runner 8/8.
- [develop](https://github.com/gramlot-org/gramlot/actions/runs/36059479696), revision
  `361dcca`: Python 18/18, JavaScript 76/76 and runner 8/8.

Both branches also passed their documentation workflow. The four extra JS tests
on develop cover the unfinished binding prerequisite reserved for 0.2.0; their
success does not imply full binding implementation or acceptance.

*0.2.0:* the plan's qualification runs the complete suites with dependencies
installed in clean environments, in Chromium, Firefox and WebKit, on eight hosts:
Minimal ASGI/Uvicorn, FastAPI, Kajenn, Flask, Django, Node, Bun and Minimal
standalone. An unavailable environment is reported as not verified and blocks
qualification unless the owner records an explicit exception. Qualification is
separate from acceptance and publication.

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

*0.2.0:* real-browser binding tests use a separate runner; jsdom does not replace
them.
