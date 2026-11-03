# The Gramlot family

Document ID: **GC-055**.

<a id="gc-055-005"></a>

## 005 · What Gramlot is

Gramlot lets you describe a web interface as a tree of declarations, in Python or in
JavaScript, and keeps it bound to the application state in the browser.

- **Page.** A class with a `main(root)` method. It builds the interface by calling
  element methods on `root`: `root.div(...)`, `pane.input(...)`, `pane.svg(...)`.
- **Source.** The tree the Page builds: HTML5 and SVG elements and components with
  their attributes, held in a Bag. The browser renders the DOM from it, and a change to
  the Source changes only the affected DOM.
- **Data.** A second Bag with the values of the page. Attributes point into it:
  `value='^.name'` follows `name`, `'=.name'` reads it without subscribing, and `'==...'` computes an
  expression. Form controls write back into the Data when the user edits them.
- **Logic.** `dataFormula` computes a value, `dataController` runs code when the Data
  changes, buttons and `connect_on<event>` react to the user. The code is a method of
  the `Logic` class exported by the page module `foo.js` (beside `foo.py` for a Python
  page), or of `class Logic` in `foo_aux.js`, or an inline expression where the page's
  Content Security Policy allows it.
- **Server (`GramlotServer`).** The part that opens a page for a browser: it finds
  the Page, sends the bootstrap document, serves the Source and closes the page. An
  adapter connects a `GramlotServer` to a web server, or packages pages without a
  web server.

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

### The interface and its values are separate

The page author describes **what the interface contains** in Source. The page's
Data Bag holds **the values the interface works with**. In the example, `pane`,
the input and the paragraph are Source declarations; `person.name` is Data.
An application can show the same Data in several places without maintaining a
separate value for each display.

The leading dot in `^.name` makes the path relative to the surrounding
`datapath`. The `^` makes this a reactive binding: when the value changes, the
bound presentation follows. An `=` pointer reads without subscribing. A widget
with a write or two-way contract can also write a user edit back to Data. The
details depend on the component and its parameters; see
[Data and pointers](097-data-binding.md#gc-095-040) and the
[widget reference](345-widget-reference.md).

Source is not the browser DOM. The browser runtime renders Source and manages the
corresponding DOM; Data changes do not require page code to find and edit DOM
elements. Source rendering requires the framework's SourceBag and SourceBagNode
classes; an ordinary Bag is suitable for Data, not as a replacement Source tree.
See [Writing pages](095-writing-pages.md) and
[Classes and hosts](090-classes-and-hosts.md#gc-090-015).

### Where behavior runs

Bindings connect values and presentation. Use a `dataFormula` for a derived Data
value, a `dataController` to react to a change, or a named JavaScript Logic method
for browser-side behavior. Python page code builds Source and can expose methods
for requests to the server. When the browser needs a server result, `dataRpc`
calls an exposed endpoint and can put the returned value in Data. Remote Source
and lazy Data have separate contracts. This distinction matters: a static export
does not execute a Python Page or Python endpoint.

Start with [formulas and controllers](097-data-binding.md#gc-095-055), then read
[Calling the server](098-server-calls.md) and
[Remote content and lazy Data](099-remote-content.md). The server is responsible
for enforcing the authorization it provides; a hidden button is not a substitute
for server-side authorization.

### Components and collections

HTML and SVG declarations cover familiar browser elements. Gramlot components
provide additional behavior such as typed editing, validation, layouts, trees or
grids. Their definitions are grouped into collections. An environment Page base
can configure the collections shared by its pages; a page may declare additional
ones. Installing a package alone does not activate its collection on a page.

Begin with [Components](105-components.md), then use the
[collection index](345-widget-reference.md#gc-345-010) for individual controls
and [collection setup](340-components-and-collections-guide.md#gc-340-050) for
their prerequisites. A grid displays rows; it does not itself provide a database.
An upload component does not supply the application's storage destination.

<a id="gc-055-010"></a>

## 010 · The repositories

| Repository | What it is | Use it when | Status |
| --- | --- | --- | --- |
| [gramlot](https://github.com/gramlot-org/gramlot) | The core: Page, Source, Data, binding, the browser runtime, the minimal `GramlotServer` contract and `GramlotFileServer`. PyPI `gramlot`, npm `@gramlot/gramlot`. | Always: every page and every adapter depends on it. | Published |
| [gramlot-py-server](https://github.com/gramlot-org/gramlot-py-server) | Adapters for Python pages, one extra each: `uvicorn` (Uvicorn or any ASGI server), `django`, `flask`, `fastapi`, `kajenn`. PyPI `gramlot-py-server`, commands `gramlot <environment> new` and `gramlot <environment> gallery`. | Your pages are in Python and you serve them from a Python web server. | Published |
| [gramlot-js-server](https://github.com/gramlot-org/gramlot-js-server) | Three packages for JavaScript pages: `@gramlot/gramlot-js-server`, the HTTP adapter on Node.js 22 and Bun; `@gramlot/gramlot-serverless`, the exporter to one HTML file, or one static folder, that opens from disk, with the Page in a Web Worker; `@gramlot/create`, new projects. | Your pages are in JavaScript: you serve them from Node.js or Bun, or you want a page without any server, a file to open, send or host as static content. | Published |
| [gramlot-examples](https://github.com/gramlot-org/gramlot-examples) | The example pages, in Python and JavaScript, and the gallery. PyPI `gramlot-examples`, npm `@gramlot/gramlot-examples`. | You want guided examples of supported features, with their source and stated limits. | Published |
| [gramlot-devtools](https://github.com/gramlot-org/gramlot-devtools) | Chrome DevTools extension that shows and edits the Data and the Source of a page. | You develop pages and want to inspect them. | Development tool |
| [gramlot-poc](https://github.com/gramlot-org/gramlot-poc) | The earlier experimental runtime, with a different scope. | Research only. | Experimental |

The earlier adapter repositories `gramlot-uvicorn`, `gramlot-django`,
`gramlot-fastapi`, `gramlot-flask` and `gramlot-kajenn`, and the repository
`gramlot-serverless`, are archived: their adapters are in `gramlot-py-server` and
`gramlot-js-server`, which also holds the current package `@gramlot/gramlot-serverless`.

Every adapter implements the same [server protocol](101-server-protocol.md); the
core's [classes and server adapters](090-classes-and-hosts.md) guide describes the
classes, the mount prefix, the page companions and the Content Security Policy
profiles. Each
adapter repository documents its installation, configuration and deployment.

<a id="gc-055-015"></a>

## 015 · Choosing a path

- **Python pages:** the core plus the adapter of your framework in `gramlot-py-server`.
- **JavaScript pages with a server:** the core plus `@gramlot/gramlot-js-server`.
- **JavaScript pages without a server:** the core plus `@gramlot/gramlot-serverless`.
- **Trying it first:** the gallery of `gramlot-examples`, served by the gallery
  command of each environment, shows every example in Python and JavaScript, with
  its source; see [Try Gramlot](025-try.md).

The [examples manual](https://gramlot-examples.readthedocs.io/en/latest/)
presents the shared lessons by topic, with Python and JavaScript source.

### From page to browser

For a Python application, install the core and a Python server adapter, then
create or supply page modules to that adapter. When a browser opens a page, the
host resolves the Page and returns bootstrap information. The shared browser
runtime obtains and renders Source and manages Data and bindings. Calls to exposed
server methods travel through the adapter. The host guide covers startup, routing
and deployment; the core guide covers page declarations and the protocol.

For a JavaScript page, the Node/Bun adapter provides hosted execution. The
serverless exporter provides a different deployment: it packages a JavaScript Page
for a Worker and the browser runtime for the window. A file-only export has no
Python process or application database merely because the interface contains a
button or a grid. See the [Python server manual](https://gramlot-py-server.readthedocs.io/en/latest/),
the [JavaScript server manual](https://gramlot-js-server.readthedocs.io/en/latest/)
and [Classes and hosts](090-classes-and-hosts.md).
