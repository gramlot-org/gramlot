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
[![npm](https://img.shields.io/npm/v/@gramlot/gramlot)](https://www.npmjs.com/package/@gramlot/gramlot)
[![Status: 0.3.10 released](https://img.shields.io/badge/status-0.3.10%20released-green)](https://github.com/gramlot-org/gramlot/releases/tag/v0.3.10)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue)](https://github.com/gramlot-org/gramlot/blob/main/LICENSE)

**Describe application interfaces in Python; let a JavaScript runtime handle
interaction in the browser.** Gramlot's model connects a declared interface
(Source) to structured application state (Data Bags), using bindings, controllers
and reusable components.

Gramlot is intended for Python developers building interactive forms, data tools
and application interfaces. Server adapters connect it to a web server; the core is
independent of server and database technology.

> **Release status.** The current release is **0.3.10**, published on
> [PyPI](https://pypi.org/project/gramlot/) (`gramlot`), on
> [npm](https://www.npmjs.com/package/@gramlot/gramlot) (`@gramlot/gramlot`) and as the
> [GitHub release v0.3.10](https://github.com/gramlot-org/gramlot/releases/tag/v0.3.10).
> JavaScript releases are distributed through npm; JSR publication is suspended.

## What a page contains

- **Source and Data.** A page builds its HTML and SVG elements in Python or
  JavaScript; the Data Bag holds the values. Pointers (`^`, `=`, `==`) bind
  attributes, text and form controls to Data in both directions.
- **Behaviour.** `dataSetter`, `dataFormula` and `dataController`, with named
  logic in the `Logic` class of the page module; buttons, events, messages between
  nodes and frames, and confirmations before an action.
- **Server calls.** Endpoints called with `dataRpc`, Source fragments built on the
  server and mounted with `remote`, values loaded when read with `dataRemote`.
- **Components.** Input components with labelbox and validation, command buttons,
  and border, tab and stack containers, with the same names in Python and
  JavaScript.
- **Application shell.** `IndexPage` gives grouped navigation and iframe tabs; the
  root page can make the application installable.
- **Themes.** A base theme on every page, overlays, light and dark mode.

Database-backed controls and form persistence are not provided.

## JavaScript package

The JavaScript distribution is `@gramlot/gramlot`, on npm. Install it with
`npm install @gramlot/gramlot`.
Node.js 22 or later and Bun are supported server runtimes; the browser runtime
is bundled separately. The entry points are listed in
[Classes and server adapters](docs/public/090-classes-and-hosts.md#gc-090-024).
Standalone startup, `GramlotWorkerServer` and `WorkerTransport` belong to
`@gramlot/gramlot-serverless` (in the `gramlot-js-server` repository).
Python pages require the Python distribution and a Python server.

A page is a module in the pages folder that exports a `Page` subclass. `GramlotFileServer`
serves that folder; an adapter passes each request to the server:

```js
// pages/hello.js
import {Page as GramlotPage} from '@gramlot/gramlot/page';

// GramlotFileServer reads the export named `Page`.
export class Page extends GramlotPage {
    static title = 'Hello';
    main(root) {
        root.div('Hello from Gramlot', {id: 'greeting'});
    }
}
```

```js
// server.js
import {GramlotFileServer} from '@gramlot/gramlot/server';

const server = new GramlotFileServer('./pages');
// `owner` identifies the browser, for example by the `gramlot_owner` cookie.
const {pageId, html, nonce} = await server.openPage('hello', {owner});
// Answer the browser with `html`; it then sends its envelopes to `POST /gramlot/rpc`,
// which the adapter answers with `server.call(server.decodeBody(body), {owner})`.
```

The rules an adapter follows are in [Server protocol](docs/public/101-server-protocol.md).
The example pages and their gallery are the separate package `gramlot-examples`.

## Can I use it today?

- **Python:** `pip install gramlot`.
- **JavaScript:** `npm install @gramlot/gramlot`.
- **Archives:** each [GitHub release](https://github.com/gramlot-org/gramlot/releases)
  carries the wheel, the sdist, the npm package of `js/` and `SHA256SUMS`.
- **Adapters:** `pip install "gramlot-py-server[uvicorn]"` (also `django`, `flask`,
  `fastapi`, `kajenn`) for Python pages; `npm install @gramlot/gramlot-js-server`
  (Node.js and Bun) or `@gramlot/gramlot-serverless` (no server) for JavaScript pages;
  `npm create @gramlot page|site` starts a JavaScript project.

For a first look, use [Try Gramlot: the quick route](docs/public/018-quickstart.md):
choose Python, Node.js or serverless, open the gallery, then create your own page.
It also explains how to install the optional [Chrome DevTools extension](https://github.com/gramlot-org/gramlot-devtools/releases/latest)
and how to update an existing installation. Continue with
[the learning route](docs/public/025-try.md) and
[Writing pages](docs/public/095-writing-pages.md). The broader experimental
implementation remains in [gramlot-poc](https://github.com/gramlot-org/gramlot-poc).

## Start here

- [Try Gramlot: the quick route](docs/public/018-quickstart.md) — choose an environment, try three examples and create a project with its CLI.
- [The Gramlot family](docs/public/055-family.md) — what Gramlot is, the core and the adapters, and which one to choose.
- [Is Gramlot a fit?](docs/public/020-evaluate.md) — the development model and its current limits.
- [Try Gramlot](docs/public/025-try.md) — the complete learning route, by topic.
- [Tests and coverage](docs/public/030-quality.md) — what the badges mean and why JavaScript coverage matters.
- [Classes and server adapters](docs/public/090-classes-and-hosts.md) — repository map, classes, package entry points and server boundaries.
- [Writing pages](docs/public/095-writing-pages.md) — page structure, SVG, live Source, data exchange, the application index, messages, dates and formatting.
- [Data binding and controllers](docs/public/097-data-binding.md) — pointers, initial values, formulas, controllers, named logic, bound controls, buttons and lifecycle.
- [Calling the server](docs/public/098-server-calls.md) — endpoints and `dataRpc`.
- [Remote content and lazy Data](docs/public/099-remote-content.md) — `remote`, `dataRemote` and the request rule.
- [Themes and CSS](docs/public/096-themes-and-css.md) — Python examples, complete variable and class catalogues, light/dark customization and practical styling advice.
- [Components](docs/public/105-components.md) — input components, labelbox, validation, command buttons and containers.
- [Extending Gramlot](docs/public/100-extensions.md) — current extension points and contracts still to define.
- [Server protocol](docs/public/101-server-protocol.md) — for adapter authors: bootstrap, envelopes, outcomes, HTTP and Worker rules, conformance check.

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
adapter repositories `gramlot-uvicorn`, `gramlot-django`, `gramlot-fastapi`,
`gramlot-flask`, `gramlot-kajenn`, `gramlot-minimal` and the repository
`gramlot-serverless` are archived; the package `@gramlot/gramlot-serverless` is
current and lives in gramlot-js-server. The published 0.1.0 archives keep their
original names.


## Runtime and security corrections

Repairs sanitized drawer labels, script and native form-action checks, shared Bag identity in hosted input components, binding/remote lifecycle, SVG publication and Python page-module loading. See the [release notes](https://github.com/gramlot-org/gramlot/releases/tag/v0.3.10) for changes and remaining audit limitations.
