# Tests and coverage

Document ID: **GC-030**.

> **Scope.** This is the maintained authoring guide. The repository README states
> the current release. Dated release notes below describe when behavior entered;
> they are not a list of current exclusions. Development-only differences are marked.

<a id="gc-030-005"></a>

## 005 · Read badges in context

README badges: tests (`Core tests` on `main`: runtime build, Python, core JS with the quiet-write and symbolic-attribute contracts, Chromium checks on core fixture pages; pushes to main/develop, PRs, dispatch; no other repository checked out, example pages tested in gramlot-examples), documentation build, two Codecov badges (JavaScript, Python; section 010), PyPI and JSR versions, status (current release), license label: eight badges. Unit suites do not verify adapters in a server, standalone exports or real browsers: that is the 0.2.0 qualification (GC-215: clean environments, Chromium/WebKit/Firefox, §8.1 story through the real bootstrap, served runtime vs fresh build, acceptance pages on `gramlot-uvicorn`, `gramlot-js-server` Node/Bun, `gramlot-serverless`, the repositories of that date). Today `gramlot-py-server` tests its five adapters and `gramlot-js-server` Node.js, Bun and `@gramlot/gramlot-serverless`, each in its own CI. The experimental runtime is tested in gramlot-poc.

<a id="gc-030-010"></a>

## 010 · JavaScript is the primary runtime measure

CI measures `js/src` with `c8 --all` (every file, unimported ones included; lines/branches/functions; no vendors, `js/dist` or tests) and `src/gramlot` separately with coverage.py on the source tree. Codecov flags `javascript` and `python` (`codecov.yml`), never merged. Local run 2026-10-01: JS 99.2% lines, 95.6% branches, 99.0% functions; Python 90% statements.

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

Teaching follows release milestones. Verify each repeated example's earlier and
later stages, the code replaced by the new feature and the stated result. Preserve
historical context, but label unsupported historical syntax instead of presenting
it as runnable current code. Prerequisites, expected results and explained exercises
are part of the review. Coverage is not a production-readiness guarantee.
