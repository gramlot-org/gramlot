# Tests and coverage

Document ID: **GC-030**.

<a id="gc-030-005"></a>

## 005 · Read badges in context

The README documentation badge follows main and measures docs, not runtime correctness. Status/license badges are labels. The experimental runtime is tested in gramlot-poc. Core has Python/JS tests and a current local packaged Chromium 7/7 matrix (Uvicorn, FastAPI, Kajenn, Flask, Node, Bun, Worker), not release or Safari/Firefox evidence. Identify repository/revision in any coverage result; no runtime percentage is measured here. Verify hosted connections before adding Read the Docs or Codecov badges.

The `Core and runner tests` workflow runs Python, core JavaScript and runner
unit tests on main/develop pushes, the CI integration branch, pull requests and
manual dispatch. It builds browser resources, installs the Python package and
explicitly selects that interpreter for JS interop. Runner dependencies use the
public Minimal and JS Server main branches alongside this repository, following
the examples' declared file dependencies. The runner unit suite does not verify
adapter behavior, standalone exports or the browser matrix. Coverage collection
is not yet included. [GitHub run 36058922420](https://github.com/gramlot-org/gramlot/actions/runs/36058922420)
passed Python 18/18, JavaScript 76/76 and runner 8/8 on the CI integration revision
`edce6cb`. Integration into main/develop remains separate.

<a id="gc-030-010"></a>

## 010 · JavaScript is the primary runtime measure

Future runtime CI must measure first-party JavaScript, including unimported files, with lines/branches/functions. Exclude vendors, generated bundles and test helpers. Measure Python authoring/serialization separately and use separate Codecov flags with visible JS results. Combined or Python-only coverage can hide runtime gaps. Collection is not implemented in this core.

<a id="gc-030-015"></a>

## 015 · Coverage is not a browser acceptance test

PoC JavaScript uses Node tests and jsdom. These do not establish real-browser behavior, visual quality, accessibility or all host/database combinations. Assess binding, cleanup and failure tests plus real-browser checks of the components you need. Coverage does not guarantee production readiness.
