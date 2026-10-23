# Gramlot developer manual

Describe the interface in **Python**, keep application state in **Data Bags**, and
let the browser runtime render and update components from **Source**.

This manual combines a teaching path, component reference, runnable examples and
extension guidance. It describes the checked-out sources. Development-only features
are marked in their chapters; the [repository README](https://github.com/gramlot-org/gramlot/blob/main/README.md)
states the released package version.

## Choose your starting point

| I want to… | Start here |
| --- | --- |
| Run my first page | [Quickstart](018-quickstart.md) |
| Understand Source, Data and bindings | [Writing pages](095-writing-pages.md), then [Data binding](097-data-binding.md) |
| Find a widget or parameter | [Widget reference](345-widget-reference.md) |
| Try the examples | [Visual tour and complete lesson index](355-examples-and-visual-tour.md) |
| Build a form, tabbed view or resizable layout | [Components](105-components.md) |
| Build menus, toolbars and editing windows | [Menus, frames and windows](350-menus-toolbars-and-windows.md) |
| Choose density, colors and field styling | [Themes and CSS](096-themes-and-css.md) |
| Add a custom collection or replace a component | [Components and collections](340-components-and-collections-guide.md) |
| Call Python or load data lazily | [Server calls](098-server-calls.md) and [Remote content](099-remote-content.md) |

## A small page

```python
from gramlot import Page as GramlotPage
from gramlot.collections.inputs import mygramlot as inputs

class Page(GramlotPage):
    gramlots = [inputs]

    def main(self, root):
        root.dataSetter("customer.name", "Ada")
        root.textbox(value="^customer.name", lbl="Customer", live=True)
        root.p("^customer.name", mask="Hello, {}")
```

The input and paragraph share the same Data path. Python declares the page; the
runtime handles edits and updates without application code scraping the DOM.
The host starts the page and supplies its selected collections. Follow the
quickstart for installation and startup, and the collection guide for the
prepared-package prerequisites.

## What the examples provide

The [example manual](https://gramlot-examples.readthedocs.io/en/latest/) embeds
Gramlot playgrounds, with full Python and JavaScript source next to the explanation.
Python endpoints need a Python host; a static documentation site does not execute
server code. The visual tour identifies the development chapters and shows their
real gallery appearance.

## Framework and host responsibilities

Gramlot owns Source, Data bindings, components and shared browser behavior.
The [Python host](https://gramlot-py-server.readthedocs.io/en/latest/) and
[JavaScript hosts](https://gramlot-js-server.readthedocs.io/en/latest/) own serving,
process startup and deployment. Applications own domain logic, authorization and
persistence. A Save command alone does not implement a database transaction.
