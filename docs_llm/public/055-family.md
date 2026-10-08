# The Gramlot family

Document ID: **GC-055**.

> **Release status.** Describes **0.2.0 (HTML/SVG data binding)**: released 2026-09-30
> (PyPI `gramlot`, npm and JSR `@gramlot/gramlot`; current release in the README).

<a id="gc-055-005"></a>

## 005 · What Gramlot is

A web interface described as a tree of declarations in Python or JavaScript, bound to application state in the browser. Page: class with `main(root)` calling element methods. Source: the tree (native HTML5/SVG elements in a Bag); the DOM follows it. Data: a Bag of values; `^` follows, `=` reads once, `==` computes; native controls write back. Logic: `dataFormula`, `dataController`, buttons, `connect_on<event>`; code as methods of the `Logic` export of the page module `foo.js` (beside `foo.py` for Python), else of `class Logic` in `foo_aux.js`, or inline where the CSP allows. Server (`GramlotServer`): opens a page for a browser (Page, bootstrap, Source, close); an adapter connects it to a web server or packages pages without one.

Example (Python): `pane = root.div(datapath="person")`; `pane.input(id="name", value="^.name", live=True)`; `pane.p("^.greeting")`; `pane.dataFormula(".greeting", "'Hello, ' + name", name="^.name", _init=True)`; `pane.dataSetter(".name", "Ada")` → shows `Hello, Ada`, and `Hello, Grace` while typing `Grace`. JavaScript: same methods, data-elements with an object. See [Writing pages](095-writing-pages.md).

<a id="gc-055-010"></a>

## 010 · The repositories

- [gramlot](https://github.com/gramlot-org/gramlot): core (Page, Source, Data, binding, runtime, minimal `GramlotServer` contract, `GramlotFileServer`); PyPI `gramlot`, npm and JSR `@gramlot/gramlot`; always needed; published.
- [gramlot-py-server](https://github.com/gramlot-org/gramlot-py-server): adapters for Python pages, one extra each (`uvicorn` for Uvicorn or any ASGI server, `django`, `flask`, `fastapi`, `kajenn`); PyPI `gramlot-py-server`, command `gramlot <environment> new|gallery`; published.
- [gramlot-js-server](https://github.com/gramlot-org/gramlot-js-server): three packages for JavaScript pages, `@gramlot/gramlot-js-server` (HTTP adapter on Node.js 22 and Bun), `@gramlot/gramlot-serverless` (export to one HTML file or a static folder opened from disk, Page in a Web Worker) and `@gramlot/create` (new projects); published.
- [gramlot-examples](https://github.com/gramlot-org/gramlot-examples): example pages in Python and JavaScript and the gallery; PyPI `gramlot-examples`, npm `@gramlot/gramlot-examples`; published.
- [gramlot-devtools](https://github.com/gramlot-org/gramlot-devtools): Chrome DevTools extension showing and editing Data and Source; development tool.
- [gramlot-poc](https://github.com/gramlot-org/gramlot-poc): earlier experimental runtime.

Archived: `gramlot-uvicorn`, `gramlot-django`, `gramlot-fastapi`, `gramlot-flask`, `gramlot-kajenn`, `gramlot-serverless`; their adapters are in `gramlot-py-server` and `gramlot-js-server`.

Shared contract: [classes and server adapters](090-classes-and-hosts.md) (mount prefix, companions, CSP profiles). Each adapter documents install, configuration, deployment.

<a id="gc-055-015"></a>

## 015 · Choosing a path

Python pages: core + the adapter of your framework in gramlot-py-server. JavaScript with a server: core + @gramlot/gramlot-js-server. JavaScript without a server: core + @gramlot/gramlot-serverless. To try first: the gallery of gramlot-examples, served by each environment ([Try Gramlot](025-try.md)).
