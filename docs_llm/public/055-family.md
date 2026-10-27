# The Gramlot family

Document ID: **GC-055**.

<a id="gc-055-005"></a>

## 005 · What Gramlot is

A web interface described as a tree of declarations in Python or JavaScript, bound to application state in the browser. Page: class with `main(root)` calling element methods. Source: the tree (HTML5/SVG elements and components in a Bag); the DOM follows it. Data: a Bag of values; `^` follows, `=` reads without subscribing, `==` computes; form controls write back. Logic: `dataFormula`, `dataController`, buttons, `connect_on<event>`; code as methods of the `Logic` export of the page module `foo.js` (beside `foo.py` for Python), else of `class Logic` in `foo_aux.js`, or inline where the CSP allows. Server (`GramlotServer`): opens a page for a browser (Page, bootstrap, Source, close); an adapter connects it to a web server or packages pages without one.

A complete Python page:

```python
from gramlot import Page as BasePage

class Page(BasePage):
    title = "Hello"

    def main(self, root):
        pane = root.div(datapath="person")
        pane.input(value="^.name", lbl="Name", live=True)
        pane.p("^.name", mask="Hello, {}")
```

Type `Ada` in the field: the paragraph shows `Hello, Ada`. Both declarations
use `person.name`; the input writes Data and the paragraph follows it. `lbl`
uses the shared Labelbox presentation, also available to components. No formula
or initialization script is needed here. See [Data binding](097-data-binding.md).

<a id="gc-055-010"></a>

## 010 · The repositories

- [gramlot](https://github.com/gramlot-org/gramlot): core (Page, Source, Data, binding, runtime, minimal `GramlotServer` contract, `GramlotFileServer`); PyPI `gramlot`, npm `@gramlot/gramlot`; always needed; published.
- [gramlot-py-server](https://github.com/gramlot-org/gramlot-py-server): adapters for Python pages, one extra each (`uvicorn` for Uvicorn or any ASGI server, `django`, `flask`, `fastapi`, `kajenn`); PyPI `gramlot-py-server`, command `gramlot <environment> new|gallery`; published.
- [gramlot-js-server](https://github.com/gramlot-org/gramlot-js-server): three packages for JavaScript pages, `@gramlot/gramlot-js-server` (HTTP adapter on Node.js 22 and Bun), `@gramlot/gramlot-serverless` (export to one HTML file or a static folder opened from disk, Page in a Web Worker) and `@gramlot/create` (new projects); published.
- [gramlot-examples](https://github.com/gramlot-org/gramlot-examples): example pages in Python and JavaScript and the gallery; PyPI `gramlot-examples`, npm `@gramlot/gramlot-examples`; published.
- [gramlot-devtools](https://github.com/gramlot-org/gramlot-devtools): Chrome DevTools extension showing and editing Data and Source; development tool.
- [gramlot-poc](https://github.com/gramlot-org/gramlot-poc): earlier experimental runtime.

Archived: the adapter repositories `gramlot-uvicorn`, `gramlot-django`, `gramlot-fastapi`, `gramlot-flask`, `gramlot-kajenn` and the repository `gramlot-serverless`; their adapters are in `gramlot-py-server` and `gramlot-js-server`, which holds the current package `@gramlot/gramlot-serverless`.

Shared [server protocol](101-server-protocol.md); classes, mount prefix, companions, CSP profiles: [classes and server adapters](090-classes-and-hosts.md). Each adapter documents install, configuration, deployment.

<a id="gc-055-015"></a>

## 015 · Choosing a path

Python pages: core + the adapter of your framework in gramlot-py-server. JavaScript with a server: core + @gramlot/gramlot-js-server. JavaScript without a server: core + @gramlot/gramlot-serverless. To try first: the gallery of gramlot-examples, served by each environment ([Try Gramlot](025-try.md)).

The [examples manual](https://gramlot-examples.readthedocs.io/en/latest/)
presents the shared lessons by topic, with Python and JavaScript source.
