# Gramlot developer manual

Build the interface in **Python**, describe it in **Source**, and keep its values
in **Data Bags**. Bindings update the browser when those values change.

## Learn one idea at a time

1. [Run a page](018-quickstart.md): open the gallery or create a Python project.
2. [Declare HTML and SVG](095-writing-pages.md#gc-095-005): familiar elements,
   nesting, labels and separate style attributes.
3. [Use components](105-components.md#gc-105-010): richer fields and containers,
   inherited from the environment Page base.
4. [Connect Data](097-data-binding.md#gc-095-040): relative paths, defaults,
   formulas and browser Logic.
5. [Call the server](098-server-calls.md): distinguish a returned value from
   [remote interface structure](099-remote-content.md).
6. [Compose an application](350-menus-toolbars-and-windows.md): menus, toolbars,
   frames, dialogs and floating windows.

The [learning route](025-try.md#gc-025-015) connects these topics to the gallery.
Read a section, try its example, then change one value or declaration.

## A field and its result

The environment Page base supplies the inputs collection. Configure it once as
shown in [Collection setup](340-components-and-collections-guide.md#gc-340-050).
The example below belongs in a page inheriting that base:

```python
class Page(EnvironmentPage):
    def main(self, root):
        pane = root.div(datapath="demo")
        pane.textbox(value="^.name", lbl="Name", live=True,
                     placeholder="Type your name")
        pane.p("^.name", mask="Hello, {}")
```

Type in the field: the paragraph follows every edit. Both use `demo.name`.
There is no initialization script or DOM event handler to maintain. Give a second
block a different `datapath` to keep its values independent.

## Look up a detail

| Need | Guide |
| --- | --- |
| A collection and its minimal example | [Inputs](410-inputs.md), [Layout](420-layout.md), [Grids](445-grid.md), [all collections](345-widget-reference.md#gc-345-010) |
| Widget-specific parameters | [Widget reference](345-widget-reference.md) |
| Shared labels, field state and validation | [Components](105-components.md) |
| Density, palettes, light/dark mode and CSS | [Themes and CSS](096-themes-and-css.md) |
| Runnable lessons | [Examples and visual tour](355-examples-and-visual-tour.md) |
| Custom components, collections and overrides | [Components and collections](340-components-and-collections-guide.md) |
| Page files, hosts and bootstrap | [Classes and hosts](090-classes-and-hosts.md) |
| Transport and adapter contracts | [Server protocol](101-server-protocol.md) |

## Guides for agents

[Open the collection guide index](llm/index.md) for direct Markdown cards and the
`llms.txt` discovery entry. Each card preserves the component contract and links
to shared authoring rules.

## Choose the right manual

This manual explains the framework. The [Python server manual](https://gramlot-py-server.readthedocs.io/en/latest/)
and [JavaScript/serverless manual](https://gramlot-js-server.readthedocs.io/en/latest/)
cover installation and deployment. The [example manual](https://gramlot-examples.readthedocs.io/en/latest/)
contains lessons with Python and JavaScript source and runnable browser examples.
A static documentation site does not execute Python endpoints.

These guides describe the current API. The [repository README](https://github.com/gramlot-org/gramlot/blob/main/README.md)
identifies the released version; historical decisions and future proposals are
kept outside the public learning path. Applications provide domain rules,
authorization and durable persistence: a Save button alone does not save a record.
