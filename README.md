# Gramlot

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/branding/gramlot-logo-dark.svg">
    <img src="assets/branding/gramlot-logo.svg" alt="Gramlot" width="220">
  </picture>
</p>

[![Core tests](https://github.com/gramlot-org/gramlot/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/gramlot-org/gramlot/actions/workflows/tests.yml)
[![Documentation build](https://github.com/gramlot-org/gramlot/actions/workflows/docs.yml/badge.svg?branch=main)](https://github.com/gramlot-org/gramlot/actions/workflows/docs.yml)
[![JavaScript coverage](https://codecov.io/gh/gramlot-org/gramlot/branch/main/graph/badge.svg?flag=javascript)](https://app.codecov.io/gh/gramlot-org/gramlot?flags%5B0%5D=javascript)
[![Python coverage](https://codecov.io/gh/gramlot-org/gramlot/branch/main/graph/badge.svg?flag=python)](https://app.codecov.io/gh/gramlot-org/gramlot?flags%5B0%5D=python)
[![PyPI](https://img.shields.io/pypi/v/gramlot)](https://pypi.org/project/gramlot/)
[![JSR](https://jsr.io/badges/@gramlot/gramlot)](https://jsr.io/@gramlot/gramlot)
[![Status: 0.2.11 released](https://img.shields.io/badge/status-0.2.11%20released-green)](https://github.com/gramlot-org/gramlot/releases/tag/v0.2.11)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue)](https://github.com/gramlot-org/gramlot/blob/main/LICENSE)

**Describe application interfaces in Python; let a JavaScript runtime handle
interaction in the browser.** Gramlot's model connects a declared interface
(Source) to structured application state (Data Bags), using bindings, controllers
and reusable components.

Gramlot is intended for Python developers building interactive forms, data tools
and application interfaces. Server adapters connect it to a host; the core is
independent of server and database technology.

> **Release status.** The current release is **0.2.11**, published on
> [PyPI](https://pypi.org/project/gramlot/) (`gramlot`), on
> [npm](https://www.npmjs.com/package/@gramlot/gramlot) and
> [JSR](https://jsr.io/@gramlot/gramlot) (`@gramlot/gramlot`) and as the
> [GitHub release v0.2.11](https://github.com/gramlot-org/gramlot/releases/tag/v0.2.11).
> **0.2.0 (HTML/SVG data binding)**, released on 2026-09-30, was qualified on
> Chromium, WebKit and Firefox and accepted by the owner; the patch releases that
> follow it keep its contract.

## JavaScript package

The JavaScript distribution is `@gramlot/gramlot`, on npm and on JSR. Install it with
`npm install @gramlot/gramlot` or `npx jsr add @gramlot/gramlot`.
Node.js 22 or later and Bun are supported server runtimes; the browser runtime
is bundled separately. The core provides `server`, `host`, `page` and `runtime`.
Standalone startup, WorkerHost and WorkerTransport belong to `@gramlot/gramlot-serverless`
(in the `gramlot-js-server` repository).
Python pages require the Python distribution and a Python server.

A page is a module in the pages folder that exports a `Page` subclass. `FileHost`
serves that folder; an adapter passes each request to the host:

```js
// pages/hello.js
import {Page as GramlotPage} from '@gramlot/gramlot/page';

// FileHost reads the export named `Page`.
export class Page extends GramlotPage {
    static title = 'Hello';
    main(root) {
        root.div('Hello from Gramlot', {id: 'greeting'});
    }
}
```

```js
// server.js
import {FileHost} from '@gramlot/gramlot/server';

const host = new FileHost('./pages');
const {pageId, html, nonce} = await host.openPage('hello');
// Answer the browser with `html`; it then requests `host.main(pageId)`.
```

The example pages and their gallery are the separate package `gramlot-examples`.

## Can I use it today?

- **Python:** `pip install gramlot`.
- **JavaScript:** `npm install @gramlot/gramlot` or `npx jsr add @gramlot/gramlot`.
- **Archives:** each [GitHub release](https://github.com/gramlot-org/gramlot/releases)
  carries the wheel, the sdist, the npm package of `js/` and `SHA256SUMS`.
- **Adapters:** `pip install "gramlot-py-server[uvicorn]"` (also `django`, `flask`,
  `fastapi`, `kajenn`) for Python pages; `npm install @gramlot/gramlot-js-server`
  (Node.js and Bun) or `@gramlot/gramlot-serverless` (no server) for JavaScript pages;
  `npm create @gramlot page|site` starts a JavaScript project.

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
- `dataFormula` and `dataController`, with named logic as the primary
  path (since 0.2.5 the `Logic` class exported by the page module `foo.js`, beside
  `foo.py` for a Python page, or `class Logic` in `foo_aux.js`) and inline code only
  under a permissive Content Security Policy (a clear error under a strict one);
- native controls bound with `value='^path'`, `live`, checkbox and radio groups,
  `visible`, reactive `style` and `class`, bound SVG attributes, freeze and thaw;
- buttons with a nested `dataController` and `connect_on<event>`;
- a minimal Host contract (`resolve_page`, `resolve_resources`, `open_page` with a
  mount prefix) with `FileHost` as reference; pages keep `Page.css` and same-name
  companions (`foo.css`, and `foo.js` or `foo_aux.js` for the logic).

Examples: the families [`binding`](https://github.com/gramlot-org/gramlot-examples/tree/main/src/gramlot_examples/pages/binding) and
[`controllers`](https://github.com/gramlot-org/gramlot-examples/tree/main/src/gramlot_examples/pages/controllers) of
[gramlot-examples](https://github.com/gramlot-org/gramlot-examples), each page in Python with its
JavaScript equivalent. [Writing pages](docs/public/095-writing-pages.md) and
[Classes and server adapters](docs/public/090-classes-and-hosts.md) describe the
contract, its exclusions and the differences from legacy GenroPy. Components start
with 0.3.0.

## Start here

- [The Gramlot family](docs/public/055-family.md) — what Gramlot is, the core and the adapters, and which one to choose.
- [Is Gramlot a fit?](docs/public/020-evaluate.md) — the development model and its current limits.
- [Try Gramlot](docs/public/025-try.md) — open the gallery of examples, then choose a host.
- [Tests and coverage](docs/public/030-quality.md) — what the badges mean and why JavaScript coverage matters.

- [Classes and server adapters](docs/public/090-classes-and-hosts.md) — repository map and responsibilities.
- [Writing pages](docs/public/095-writing-pages.md) — HTML pages, lifecycle and the 0.2.0 data binding.
- [Extending Gramlot](docs/public/100-extensions.md) — current extension points and contracts still to define.

## Project status

The tests badge reports the `Core tests` workflow on `main` (Python and
JavaScript suites and the browser checks in Chromium); the documentation badge reports the documentation
checks. Coverage is collected by the same workflow and reported on Codecov per
runtime: JavaScript (every file of `js/src`, including files no test imports) and
Python (`src/gramlot`), never merged into one figure. See
[Tests and coverage](docs/public/030-quality.md).

Maintainers keep architecture decisions, port reviews and concise working documents
in the repository, outside the public user manual. Public source files remain
readable on GitHub. New work starts from `develop`; `main` is the consolidated
reference. Gramlot is licensed under Apache 2.0.

## Integration repositories

Environment-specific adapters and setup instructions live in two repositories:

- [gramlot-py-server](https://github.com/gramlot-org/gramlot-py-server) (PyPI
  `gramlot-py-server`) serves Python pages. One package holds five adapters, one
  extra each: `uvicorn` (any ASGI server), `django`, `flask`, `fastapi` and `kajenn`.
  Its command `gramlot <environment> new|gallery` creates a project or serves the
  gallery.
- [gramlot-js-server](https://github.com/gramlot-org/gramlot-js-server) serves
  JavaScript pages with three npm packages: `@gramlot/gramlot-js-server` (Node.js
  and Bun, command `gramlot`), `@gramlot/gramlot-serverless` (pages in a browser
  Worker without a server, command `gramlot-serverless`) and `@gramlot/create`
  (`npm create @gramlot page|site`).

The example pages and the gallery are in
[gramlot-examples](https://github.com/gramlot-org/gramlot-examples). The earlier
adapter repositories (`gramlot-uvicorn`, `gramlot-django`, `gramlot-fastapi`,
`gramlot-flask`, `gramlot-kajenn`, `gramlot-serverless`, `gramlot-minimal`) are
archived. See [the ownership contract](https://github.com/gramlot-org/gramlot/blob/main/docs/00-constitution.md).
The published 0.1.0 archives keep their original names.
