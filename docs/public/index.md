# Gramlot developer manual

Gramlot is a framework for building web interfaces from declarations. You write a
page in Python or JavaScript; Gramlot builds its interface and connects it to the
page's data. The browser runtime keeps the visible interface in step with that data
and sends user edits back through the declared bindings.

Gramlot is a library and runtime, independent of web servers and databases. A
server adapter connects it to a hosting environment. Your application supplies its
own domain rules, authorization and durable storage.

## How a page works

- **Page** describes the interface. Its `main(root)` method creates elements and
  components by calling methods on `root` and its children.
- **Source** is the tree of declarations. Gramlot renders it in the browser;
  changing Source can change the corresponding interface.
- **Data** is a separate Bag of page values. A binding connects a Source attribute
  to a Data path; several parts of the interface can use the same value.
- **Logic** defines behavior: formulas derive values, controllers react to changes,
  and named browser methods handle application actions.
- A **server** opens the page and handles its requests. The browser runtime renders
  the interface and maintains browser Data.

The following Python page binds a field and a paragraph to the same value. The
inherited environment Page must provide the inputs collection; see
[collection setup](340-components-and-collections-guide.md#gc-340-050).

```python
class Page(EnvironmentPage):
    def main(self, root):
        pane = root.div(datapath="person")
        pane.textbox(value="^.name", lbl="Name", live=True)
        pane.p("^.name", mask="Hello, {}")
```

`datapath="person"` sets the context for the two relative bindings. Typing a name
updates `person.name`; the paragraph follows it. `live=True` requests updates as
the user edits. Read [Data binding](097-data-binding.md) for paths, defaults and
subscribed versus one-time reads.

## Read the manual

1. [Inside Gramlot](017-inside-gramlot.md) introduces Data, bindings and reusable interface declarations.
2. [The Gramlot family](055-family.md) introduces the library and its repositories.
3. [Your first page](018-quickstart.md) explains how to start a project.
4. [Writing pages](095-writing-pages.md), [Data binding and controllers](097-data-binding.md)
   and [Components](105-components.md) explain application authoring.
5. [Calling the server](098-server-calls.md) and [Remote content](099-remote-content.md)
   explain requests for values and interface fragments.
6. [Menus, toolbars and windows](350-menus-toolbars-and-windows.md) covers larger
   interfaces. [Themes and CSS](096-themes-and-css.md) explains appearance.

## The library and the servers

The **core** provides Python page authoring, the JavaScript browser runtime,
bindings, shared components and server-neutral execution contracts. See
[Classes and hosts](090-classes-and-hosts.md) and the [server protocol](101-server-protocol.md).

For Python pages, [gramlot-py-server](https://gramlot-py-server.readthedocs.io/en/latest/)
provides Uvicorn, Django, Flask, FastAPI and Kajenn adapters. For JavaScript pages,
[gramlot-js-server](https://gramlot-js-server.readthedocs.io/en/latest/) provides
Node.js/Bun hosting and a serverless exporter. A static export does not run Python endpoints.

## Widget and collection reference

Widgets belong to collections. The environment Page base can supply collections
once; a page adds any other collections it needs. Each guide describes its family
and component contracts:

[Inputs](410-inputs.md) · [Buttons and menus](415-buttons.md) ·
[Layout](420-layout.md) · [Tree](425-tree.md) · [Editors](430-editors.md) ·
[Typst](435-typst.md) · [Uploads](440-uploads.md) · [Grid](445-grid.md) ·
[Chat](450-chat.md) · [Grouplets](455-grouplets.md)

Use the [widget and parameter reference](345-widget-reference.md) to find a
component, or [How components and collections work](340-components-and-collections-guide.md)
to understand setup and authoring. [Guides for agents](llm/index.md) provides
compact Markdown counterparts.

## Appendix: examples

The [examples and visual tour](355-examples-and-visual-tour.md) links to the
separate [examples manual](https://gramlot-examples.readthedocs.io/en/latest/),
which contains lessons, source and runnable browser examples. Use the Python
gallery for lessons requiring Python endpoints. Select matching package versions.

These guides describe current APIs. The [core README](https://github.com/gramlot-org/gramlot/blob/main/README.md)
identifies the release; historical decisions and future proposals remain outside
the public learning path.
