# Tests and coverage

Document ID: **GC-030**.

> **Release status.** Describes **0.2.0 (HTML/SVG data binding)**: released 2026-09-30
> (PyPI `gramlot` 0.2.0, JSR `@genro/gramlot` 0.2.0, GitHub `v0.2.0`). Previous release:
> **0.1.2**. Unmarked text is behavior from 0.1.2.

<a id="gc-030-005"></a>

## 005 · Read badges in context

README badges: tests (`Core and runner tests` on `main`: runtime build, Python, core JS with the quiet-write and symbolic-attribute contracts, runner; pushes to main/develop, PRs, dispatch; runner uses the public main of `gramlot-serverless` and `gramlot-js-server`), documentation build, two Codecov badges (JavaScript, Python; section 010), PyPI and JSR versions, license label. Unit suites do not verify adapters in a server, standalone exports or real browsers: that is the 0.2.0 qualification (GC-215: clean environments, Chromium/WebKit/Firefox, §8.1 story through the real bootstrap, served runtime vs fresh build, acceptance pages on `gramlot-uvicorn`, `gramlot-js-server` Node/Bun, `gramlot-serverless`; django, fastapi, flask, kajenn deferred). The experimental runtime is tested in gramlot-poc.

<a id="gc-030-010"></a>

## 010 · JavaScript is the primary runtime measure

CI measures `js/src` with `c8 --all` (every file, unimported ones included; lines/branches/functions; no vendors, `js/dist` or tests) and `src/gramlot` separately with coverage.py on the source tree. Codecov flags `javascript` and `python` (`codecov.yml`), never merged. Local run 2026-10-01: JS 99.2% lines, 95.6% branches, 99.0% functions; Python 90% statements.

<a id="gc-030-015"></a>

## 015 · Coverage is not a browser acceptance test

PoC JavaScript uses Node tests and jsdom. These do not establish real-browser behavior, visual quality, accessibility or all host/database combinations. Assess binding, cleanup and failure tests plus real-browser checks of the components you need. Coverage does not guarantee production readiness. *0.2.0:* real-browser binding tests use a separate runner, not jsdom.
