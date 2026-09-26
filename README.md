# Gramlot

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/branding/gramlot-logo-dark.svg">
    <img src="assets/branding/gramlot-logo.svg" alt="Gramlot" width="220">
  </picture>
</p>

[![Documentation build](https://github.com/gramlot-org/gramlot/actions/workflows/docs.yml/badge.svg?branch=main)](https://github.com/gramlot-org/gramlot/actions/workflows/docs.yml)
[![Status: consolidation in progress](https://img.shields.io/badge/status-consolidation%20in%20progress-orange)](docs/public/020-evaluate.md)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue)](https://github.com/gramlot-org/gramlot/blob/main/LICENSE)

**Describe application interfaces in Python; let a JavaScript runtime handle
interaction in the browser.** Gramlot's model connects a declared interface
(Source) to structured application state (Data Bags), using bindings, controllers
and reusable components.

Gramlot is intended for Python developers building interactive forms, data tools
and application interfaces. Server adapters connect it to a host; the core is
independent of server and database technology.

> **Release status.** The latest published release is **0.1.2**. This
> documentation also describes **0.2.0 (HTML/SVG data binding), in development**:
> an approved plan whose code is not yet implemented, tested or released.
> Planned 0.2.0 behavior is marked as such in each guide.

## JavaScript package on JSR

The JavaScript distribution is `@genro/gramlot` on JSR. Install it with
`bunx jsr add @genro/gramlot` or `npx jsr add @genro/gramlot`.
Node.js 22 or later and Bun are supported server runtimes; the browser runtime
is bundled separately. In current development, core provides `server`, `host`, `page` and `runtime`.
Standalone startup, WorkerHost and WorkerTransport belong to `@gramlot/minimal`.
Use the matching development packages; published 0.1.0 artifacts are unchanged.
Python pages still require the Python distribution and a Python server.

The JavaScript core is published on JSR as 0.1.2. Markdown, highlighting and
DOMPurify belong to the example runner; its current DOMPurify version is 3.4.16.
This development checkout includes unfinished binding work reserved for 0.2.0.
Its aligned 0.1.2 version metadata identifies the maintenance baseline, not byte
identity with the published release. The published 0.1.2 source is revision
`47de64c67151095f14744d355b494d1f4488d49e`, which excludes that binding work.

## Can I use it today?

[Download the native 0.1.0 archive set](https://github.com/gramlot-org/gramlot/releases/tag/v0.1.0).
Install all supplied Python wheels or npm archives together, following its release instructions.
This is GitHub archive delivery; no PyPI/npm release or application deployment is claimed.

**A bounded native HTML foundation is implemented in this development checkout.**
It supports Python and JavaScript page authoring, typed Source, live browser updates
and the documented host adapters. Local 0.1.0 artifacts have been built and
installed in clean environments; the owner accepted the native scope on 2026-09-24. GitHub archive delivery is the selected release channel. The broader experimental implementation and
showcase remain in [gramlot-poc](https://github.com/gramlot-org/gramlot-poc).

To evaluate the bounded foundation, start with [Try Gramlot](docs/public/025-try.md)
and [Writing pages](docs/public/095-writing-pages.md). Its current packages have
passed a local seven-host Chromium matrix; the release keeps that bounded scope. The [offline showcase](https://github.com/gramlot-org/gramlot-minimal/tree/main/examples/showcase)
demonstrates a richer experimental runtime with different scope.

## Release 0.2.0 in development

0.2.0 adds HTML/SVG data binding to the native foundation. The approved plan
includes:

- `dataSetter(destination_path, value=None, **attr)` for initial Data values,
  replacing the legacy `data(path, value)`; all `dataSetter` declarations of a
  branch are installed before its DOM is built;
- `^`, `=` and `==` pointers, relative paths and variable datapaths;
- `dataFormula` and `dataController`, with named logic as the primary path:
  `class Logic` in the page companion or in `js_requires` resources;
- native controls bound with `value='^path'`, boolean checkboxes and radios,
  `live`, `visible`, reactive `style` and `class`, bound SVG attributes;
- buttons driven by a nested `dataController`;
- `css_requires` and `js_requires` in place of `Page.css`.

None of this is available in 0.1.2. [Writing pages](docs/public/095-writing-pages.md)
describes the plan, its exclusions and the differences from legacy GenroPy.
Components are planned for 0.3.0.

## Start here

- [Is Gramlot a fit?](docs/public/020-evaluate.md) — the development model and its current limits.
- [Try Gramlot](docs/public/025-try.md) — inspect the showcase, then choose a Python host.
- [Tests and coverage](docs/public/030-quality.md) — what the badges mean and why JavaScript coverage matters.

- [Classes and server adapters](docs/public/090-classes-and-hosts.md) — repository map and responsibilities.
- [Writing pages](docs/public/095-writing-pages.md) — native HTML pages, lifecycle, remote blocks and the planned 0.2.0 data binding.
- [Extending Gramlot](docs/public/100-extensions.md) — current extension points and contracts still to define.

## Project status

The documentation badge reports this repository's documentation checks. This
checkout has Python and JavaScript foundation tests; the broader experimental
implementation has separate tests in `gramlot-poc`. Coverage must identify the
repository and revision measured, with JavaScript and Python reported separately.

Maintainers keep architecture decisions, port reviews and concise working documents
in the repository, outside the public user manual. Public source files remain
readable on GitHub. New work starts from `develop`; `main` is the consolidated
reference. Gramlot is licensed under Apache 2.0.

## Integration repositories

Environment-specific adapters and setup instructions live in `gramlot-fastapi`,
`gramlot-flask`, `gramlot-kajenn`, `gramlot-minimal`, `gramlot-js-server` (Node.js/Bun),
and `gramlot-django`. Minimal covers Python/ASGI/Uvicorn and browser/Worker
standalone. See [the ownership contract](https://github.com/gramlot-org/gramlot/blob/main/docs/00-constitution.md).
These development names do not rename the already published 0.1.0 archives.

`gramlot-minimal` and `gramlot-js-server` are the current local and GitHub repository
names. `gramlot-kajenn` was renamed from `gramlot-genro-asgi` on 2026-09-26, on GitHub
and locally.
Repository naming does not imply a package release or deployment.
