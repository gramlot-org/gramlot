# The Gramlot family

Document ID: **GC-055**.

> **Release status.** This page describes Gramlot **0.2.0 (HTML/SVG data binding)**,
> released on 2026-09-30, and is published on PyPI (`gramlot`) and on npm and JSR
> (`@gramlot/gramlot`); the README states the current release.

<a id="gc-055-005"></a>

## 005 · What Gramlot is

Gramlot lets you describe a web interface as a tree of declarations, in Python or in
JavaScript, and keeps it bound to the application state in the browser.

- **Page.** A class with a `main(root)` method. It builds the interface by calling
  element methods on `root`: `root.div(...)`, `pane.input(...)`, `pane.svg(...)`.
- **Source.** The tree the Page builds: native HTML5 and SVG elements with their
  attributes, held in a Bag. The browser renders the DOM from it, and a change to
  the Source changes only the affected DOM.
- **Data.** A second Bag with the values of the page. Attributes point into it:
  `value='^.name'` follows `name`, `'=.name'` reads it once, `'==...'` computes an
  expression. Native controls write back into the Data when the user edits them.
- **Logic.** `dataFormula` computes a value, `dataController` runs code when the Data
  changes, buttons and `connect_on<event>` react to the user. The code is a method of
  the `Logic` class exported by the page module `foo.js` (beside `foo.py` for a Python
  page), or of `class Logic` in `foo_aux.js`, or an inline expression where the page's
  Content Security Policy allows it.
- **Host.** The part that opens a page for a browser: it finds the Page, sends the
  bootstrap document, serves the Source and closes the page. An adapter connects a
  Host to a web server, or packages pages without a server.

A complete page, in Python:

```python
from gramlot import Page as BasePage


class Page(BasePage):
    title = "Hello"

    def main(self, root):
        pane = root.div(datapath="person")
        pane.html_label("Name", for_="name")
        pane.input(id="name", value="^.name", live=True)
        pane.p("^.greeting")
        pane.dataFormula(".greeting", "'Hello, ' + name", name="^.name", _init=True)
        pane.dataSetter(".name", "Ada")
```

The page shows a field with `Ada` and the text `Hello, Ada`; typing `Grace` in the
field changes the text to `Hello, Grace` at every keystroke. The same page in
JavaScript calls the same methods; data-elements take an object
(`pane.dataSetter({destination_path: '.name', value: 'Ada'})`).
[Writing pages](095-writing-pages.md) explains every part.

<a id="gc-055-010"></a>

## 010 · The repositories

| Repository | What it is | Use it when | Status |
| --- | --- | --- | --- |
| [gramlot](https://github.com/gramlot-org/gramlot) | The core: Page, Source, Data, binding, the browser runtime, the minimal Host contract and `FileHost`. PyPI `gramlot`, npm and JSR `@gramlot/gramlot`. | Always: every page and every adapter depends on it. | Published |
| [gramlot-py-server](https://github.com/gramlot-org/gramlot-py-server) | Adapters for Python pages, one extra each: `uvicorn` (Uvicorn or any ASGI server), `django`, `flask`, `fastapi`, `kajenn`. PyPI `gramlot-py-server`, commands `gramlot <environment> new` and `gramlot <environment> gallery`. | Your pages are in Python and you serve them from a Python web server. | Published |
| [gramlot-js-server](https://github.com/gramlot-org/gramlot-js-server) | Three packages for JavaScript pages: `@gramlot/gramlot-js-server`, the HTTP adapter on Node.js 22 and Bun; `@gramlot/gramlot-serverless`, the exporter to one HTML file, or one static folder, that opens from disk, with the Page in a Web Worker; `@gramlot/create`, new projects. | Your pages are in JavaScript: you serve them from Node.js or Bun, or you want a page without any server, a file to open, send or host as static content. | Published |
| [gramlot-examples](https://github.com/gramlot-org/gramlot-examples) | The example pages, in Python and JavaScript, and the gallery. PyPI `gramlot-examples`, npm `@gramlot/gramlot-examples`. | You want to see every feature at work, with its source. | Published |
| [gramlot-devtools](https://github.com/gramlot-org/gramlot-devtools) | Chrome DevTools extension that shows and edits the Data and the Source of a page. | You develop pages and want to inspect them. | Development tool |
| [gramlot-poc](https://github.com/gramlot-org/gramlot-poc) | The earlier experimental runtime, with a different scope. | Research only. | Experimental |

The earlier adapter repositories `gramlot-uvicorn`, `gramlot-django`,
`gramlot-fastapi`, `gramlot-flask`, `gramlot-kajenn` and `gramlot-serverless` are
archived: their adapters are now in `gramlot-py-server` and `gramlot-js-server`.

Every adapter implements the same contract: the core's
[classes and server adapters](090-classes-and-hosts.md) guide describes it, with the
mount prefix, the page companions and the Content Security Policy profiles. Each
adapter repository documents its installation, configuration and deployment.

<a id="gc-055-015"></a>

## 015 · Choosing a path

- **Python pages:** the core plus the adapter of your framework in `gramlot-py-server`.
- **JavaScript pages with a server:** the core plus `@gramlot/gramlot-js-server`.
- **JavaScript pages without a server:** the core plus `@gramlot/gramlot-serverless`.
- **Trying it first:** the gallery of `gramlot-examples`, served by the gallery
  command of each environment, shows every example in Python and JavaScript, with
  its source; see [Try Gramlot](025-try.md).
