# Gramlot developer manual

Gramlot is a declarative web-interface library: Python or JavaScript authors a
Page, and the browser runtime renders it and maintains Data bindings. Core is
server- and database-independent; an adapter supplies hosting. Applications own
domain rules, authorization and durable storage.

## How a page works

`Page.main(root)` builds the **Source** declaration tree. **Data** is a separate
Bag; `^` binds an attribute reactively to a path. **Logic** contains browser
behavior, formulas and controllers. The server opens pages and handles requests.
Start with [Inside Gramlot](017-inside-gramlot.md), then see [family](055-family.md), [writing pages](095-writing-pages.md),
[Data binding](097-data-binding.md) and [server calls](098-server-calls.md).

## The library and the servers

Core provides page authoring, browser runtime, binding, components and neutral
server contracts. [Classes and hosts](090-classes-and-hosts.md) and the
[server protocol](101-server-protocol.md) describe the boundary.
[Python server](https://gramlot-py-server.readthedocs.io/en/latest/) hosts Python
pages through Uvicorn, Django, Flask, FastAPI and Kajenn.
[JavaScript server](https://gramlot-js-server.readthedocs.io/en/latest/) provides
Node/Bun hosting and a serverless exporter. Static exports do not execute Python.

## Widget and collection reference

Environment Page bases can supply collections; pages add missing collections.
Guides: [inputs](410-inputs.md), [buttons](415-buttons.md), [layout](420-layout.md),
[tree](425-tree.md), [editors](430-editors.md), [typst](435-typst.md),
[uploads](440-uploads.md), [grid](445-grid.md), [chat](450-chat.md),
[grouplets](455-grouplets.md). See the [widget reference](345-widget-reference.md),
[collection authoring](340-components-and-collections-guide.md),
[components](105-components.md), [themes](096-themes-and-css.md),
[menus and windows](350-menus-toolbars-and-windows.md), and
[agent guides](llm/index.md).

## Appendix: examples

The [visual tour](355-examples-and-visual-tour.md) and separate
[examples manual](https://gramlot-examples.readthedocs.io/en/latest/) supplement
this manual. Python endpoints require a Python host; match installed packages.
The [core README](https://github.com/gramlot-org/gramlot/blob/main/README.md)
identifies the release.
