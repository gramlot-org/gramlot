# The Gramlot family

Document ID: **GC-055**.

> **Release status.** Describes **0.2.0 (HTML/SVG data binding)**: released 2026-09-30
> (PyPI `gramlot`, npm and JSR `@gramlot/gramlot`; current release in the README).

<a id="gc-055-005"></a>

## 005 · What Gramlot is

A web interface described as a tree of declarations in Python or JavaScript, bound to application state in the browser. Page: class with `main(root)` calling element methods. Source: the tree (native HTML5/SVG elements in a Bag); the DOM follows it. Data: a Bag of values; `^` follows, `=` reads once, `==` computes; native controls write back. Logic: `dataFormula`, `dataController`, buttons, `connect_on<event>`; code as `class Logic` methods in the companion `foo_aux.js`, or inline where the CSP allows. Host: opens a page for a browser (Page, bootstrap, Source, close); an adapter connects it to a server or packages pages without one.

Example (Python): `pane = root.div(datapath="person")`; `pane.input(id="name", value="^.name", live=True)`; `pane.p("^.greeting")`; `pane.dataFormula(".greeting", "'Hello, ' + name", name="^.name", _init=True)`; `pane.dataSetter(".name", "Ada")` → shows `Hello, Ada`, and `Hello, Grace` while typing `Grace`. JavaScript: same methods, data-elements with an object. See [Writing pages](095-writing-pages.md).

<a id="gc-055-010"></a>

## 010 · The repositories

- [gramlot](https://github.com/gramlot-org/gramlot): core (Page, Source, Data, binding, runtime, minimal Host contract, `FileHost`); PyPI `gramlot`, npm and JSR `@gramlot/gramlot`; always needed; released 0.2.0.
- [gramlot-uvicorn](https://github.com/gramlot-org/gramlot-uvicorn): ASGI adapter for Python pages (Uvicorn or any ASGI server); verified.
- [gramlot-js-server](https://github.com/gramlot-org/gramlot-js-server): two packages for JavaScript pages, `@gramlot/gramlot-js-server` (HTTP adapter on Node.js 22 and Bun) and `@gramlot/gramlot-serverless` (export to one HTML file or a static folder opened from disk, Page in a Web Worker); verified.
- [gramlot-devtools](https://github.com/gramlot-org/gramlot-devtools): Chrome DevTools extension showing and editing Data and Source; development tool.
- gramlot-django, gramlot-fastapi, gramlot-flask, gramlot-kajenn: deferred to after 0.2.0.
- [gramlot-poc](https://github.com/gramlot-org/gramlot-poc): earlier experimental runtime.

Shared contract: [classes and server adapters](090-classes-and-hosts.md) (mount prefix, companions, CSP profiles). Each adapter documents install, configuration, deployment.

<a id="gc-055-015"></a>

## 015 · Choosing a path

Python pages: core + gramlot-uvicorn. JavaScript with a server: core + @gramlot/gramlot-js-server. JavaScript without a server: core + @gramlot/gramlot-serverless. To try first: the gallery of gramlot-examples, served by each environment ([Try Gramlot](025-try.md)).
