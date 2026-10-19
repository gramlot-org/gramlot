# Tests and coverage

Document ID: **GC-030**.

<a id="gc-030-005"></a>

## 005 · Read badges in context

README badges: tests (`Core tests` on `main`: runtime build, Python, core JS with the quiet-write and symbolic-attribute contracts, Chromium checks on core fixture pages; pushes to main/develop, PRs, dispatch; no other repository checked out, example pages tested in gramlot-examples), documentation build, two Codecov badges (JavaScript, Python; section 010), PyPI and JSR versions, status (current release), license label: eight badges. Core unit suites do not verify adapters in a server, standalone exports or real browsers. `gramlot-py-server` tests its five adapters and `gramlot-js-server` Node.js, Bun and `@gramlot/gramlot-serverless`, each in its own CI; each adapter runs the [conformance check](101-server-protocol.md#gc-101-150) against itself. Gallery pages are checked in gramlot-examples; the experimental runtime in gramlot-poc.

<a id="gc-030-010"></a>

## 010 · JavaScript is the primary runtime measure

CI measures `js/src` with `c8 --all` (every file, unimported ones included; lines/branches/functions; no vendors, `js/dist` or tests) and `src/gramlot` separately with coverage.py on the source tree. Codecov flags `javascript` and `python` (`codecov.yml`), never merged; the README badges show the current figures.

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

Review a lesson's prerequisites, expected result and exercises against the running
page, in Python and JavaScript. Coverage is not a production-readiness guarantee.
