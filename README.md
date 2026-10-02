# Gramlot

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/branding/gramlot-logo-dark.svg">
    <img src="assets/branding/gramlot-logo.svg" alt="Gramlot" width="220">
  </picture>
</p>

[![Core and runner tests](https://github.com/gramlot-org/gramlot/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/gramlot-org/gramlot/actions/workflows/tests.yml)
[![Documentation build](https://github.com/gramlot-org/gramlot/actions/workflows/docs.yml/badge.svg?branch=main)](https://github.com/gramlot-org/gramlot/actions/workflows/docs.yml)
[![JavaScript coverage](https://codecov.io/gh/gramlot-org/gramlot/branch/main/graph/badge.svg?flag=javascript)](https://app.codecov.io/gh/gramlot-org/gramlot?flags%5B0%5D=javascript)
[![Python coverage](https://codecov.io/gh/gramlot-org/gramlot/branch/main/graph/badge.svg?flag=python)](https://app.codecov.io/gh/gramlot-org/gramlot?flags%5B0%5D=python)
[![PyPI](https://img.shields.io/pypi/v/gramlot)](https://pypi.org/project/gramlot/)
[![JSR](https://jsr.io/badges/@gramlot/gramlot)](https://jsr.io/@gramlot/gramlot)
[![Status: 0.2.0 released](https://img.shields.io/badge/status-0.2.0%20released-green)](docs/public/020-evaluate.md)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue)](https://github.com/gramlot-org/gramlot/blob/main/LICENSE)

**Describe application interfaces in Python; let a JavaScript runtime handle
interaction in the browser.** Gramlot's model connects a declared interface
(Source) to structured application state (Data Bags), using bindings, controllers
and reusable components.

Gramlot is intended for Python developers building interactive forms, data tools
and application interfaces. Server adapters connect it to a host; the core is
independent of server and database technology.

> **Release status.** **0.2.0 (HTML/SVG data binding)** is released (2026-09-30):
> qualified on Chromium, WebKit and Firefox, accepted by the owner, published on
> [PyPI](https://pypi.org/project/gramlot/0.2.0/) (`gramlot`), on
> [JSR](https://jsr.io/@genro/gramlot@0.2.0) (`@genro/gramlot`) and as the
> [GitHub release v0.2.0](https://github.com/gramlot-org/gramlot/releases/tag/v0.2.0).
> **0.2.1** (2026-10-01) publishes the JavaScript core as `@gramlot/gramlot` on npm and JSR.

## JavaScript package

The JavaScript distribution is `@gramlot/gramlot`, on npm and on JSR. Install it with
`npm install @gramlot/gramlot` or `npx jsr add @gramlot/gramlot`.
Node.js 22 or later and Bun are supported server runtimes; the browser runtime
is bundled separately. The core provides `server`, `host`, `page` and `runtime`.
Standalone startup, WorkerHost and WorkerTransport belong to `@gramlot/gramlot-serverless`
(in the `gramlot-js-server` repository).
Python pages require the Python distribution and a Python server.

The published version is 0.2.1, from the tag `v0.2.1`. Markdown, highlighting and
DOMPurify belong to the example runner.

## Can I use it today?

- **Python:** `pip install gramlot` (0.2.1).
- **JavaScript:** `npm install @gramlot/gramlot` or `npx jsr add @gramlot/gramlot` (0.2.1).
- **Archives:** the [GitHub release v0.2.1](https://github.com/gramlot-org/gramlot/releases/tag/v0.2.1)
  carries the wheel, the sdist, the npm package of `js/` and `SHA256SUMS`.
- **Adapters:** `gramlot-uvicorn` and `gramlot-js-server` (packages
  `@gramlot/gramlot-js-server` and `@gramlot/gramlot-serverless`) are used from their
  repositories.

Start with [Try Gramlot](docs/public/025-try.md) and
[Writing pages](docs/public/095-writing-pages.md). The broader experimental
implementation remains in [gramlot-poc](https://github.com/gramlot-org/gramlot-poc).

## Gramlot 0.2.0

0.2.0 adds HTML/SVG data binding to the Gramlot core. The DOM depends on the
Source and the Data; Data changes reach the DOM, and native controls write back.

- `dataSetter(destination_path, value=None, **attr)` writes initial Data values,
  replacing the legacy `data(path, value)`; the HTML5 `<data>` element is
  `html_data(...)`;
- `^`, `=` and `==` pointers, relative, symbolic and `?attr` paths, variable datapaths;
- `dataFormula`, `dataController` and `remoteSource`, with named logic as the primary
  path (`class Logic` in the page companion `foo_aux.js`) and inline code only under a
  permissive Content Security Policy (a clear error under a strict one);
- native controls bound with `value='^path'`, `live`, checkbox and radio groups,
  `visible`, reactive `style` and `class`, bound SVG attributes, freeze and thaw;
- buttons with a nested `dataController` and `connect_on<event>`;
- a minimal Host contract (`resolve_page`, `resolve_resources`, `open_page` with a
  mount prefix) with `FileHost` as reference; pages keep `Page.css` and same-name
  companions (`foo.css`, `foo_aux.js`).

Examples: [`examples/binding/`](https://github.com/gramlot-org/gramlot/tree/main/examples/binding) and
[`examples/controllers/`](https://github.com/gramlot-org/gramlot/tree/main/examples/controllers), each page in Python with its
JavaScript equivalent. [Writing pages](docs/public/095-writing-pages.md) and
[Classes and server adapters](docs/public/090-classes-and-hosts.md) describe the
contract, its exclusions and the differences from legacy GenroPy. Components start
with 0.3.0.

## Start here

- [The Gramlot family](docs/public/055-family.md) — what Gramlot is, the core and the adapters, and which one to choose.
- [Is Gramlot a fit?](docs/public/020-evaluate.md) — the development model and its current limits.
- [Try Gramlot](docs/public/025-try.md) — inspect the showcase, then choose a Python host.
- [Tests and coverage](docs/public/030-quality.md) — what the badges mean and why JavaScript coverage matters.

- [Classes and server adapters](docs/public/090-classes-and-hosts.md) — repository map and responsibilities.
- [Writing pages](docs/public/095-writing-pages.md) — HTML pages, lifecycle, remote blocks and the 0.2.0 data binding.
- [Extending Gramlot](docs/public/100-extensions.md) — current extension points and contracts still to define.

## Project status

The tests badge reports the `Core and runner tests` workflow on `main` (Python,
JavaScript and runner suites); the documentation badge reports the documentation
checks. Coverage is collected by the same workflow and reported on Codecov per
runtime: JavaScript (every file of `js/src`, including files no test imports) and
Python (`src/gramlot`), never merged into one figure. See
[Tests and coverage](docs/public/030-quality.md).

Maintainers keep architecture decisions, port reviews and concise working documents
in the repository, outside the public user manual. Public source files remain
readable on GitHub. New work starts from `develop`; `main` is the consolidated
reference. Gramlot is licensed under Apache 2.0.

## Integration repositories

Environment-specific adapters and setup instructions live in `gramlot-fastapi`,
`gramlot-flask`, `gramlot-kajenn`, `gramlot-uvicorn`, `gramlot-js-server` and
`gramlot-django`. `gramlot-uvicorn` covers Python/ASGI/Uvicorn; `gramlot-js-server`
holds two packages: `@gramlot/gramlot-js-server` (Node.js/Bun) and
`@gramlot/gramlot-serverless` (browser/Worker standalone, formerly the
`gramlot-serverless` repository, merged on 2026-10-01 as `@gramlot/gramlot-browser`,
renamed `@gramlot/gramlot-serverless` on 2026-10-02 (0.2.2)).
For 0.2.0, `gramlot-uvicorn`, `gramlot-js-server` and the standalone exporter are
verified; `gramlot-django`, `gramlot-fastapi`, `gramlot-flask` and `gramlot-kajenn`
are deferred to after 0.2.0. See [the ownership contract](https://github.com/gramlot-org/gramlot/blob/main/docs/00-constitution.md).
These development names do not rename the already published 0.1.0 archives.

`gramlot-uvicorn` and `gramlot-js-server` are the current local and GitHub
repository names. They replace `gramlot-minimal`, retired on 2026-09-28.
`gramlot-kajenn` was renamed from `gramlot-genro-asgi` on 2026-09-26, on GitHub
and locally.
Repository naming does not imply a package release or deployment.
