# How Gramlot works

Document ID: **GC-505**.

You write a page as a Python class. Gramlot turns it into a live interface in the
browser and keeps it in step with the page's values. JavaScript pages work the same
way.

<a id="gc-505-005"></a>

## 005 · Four ideas

Block ID: **GC-505-005**.

| Idea | In one sentence |
| --- | --- |
| **Page** | The class you write. Its `main(root)` method builds the interface. |
| **Source** | The tree of elements that `main` builds: HTML, SVG and components. |
| **Data** | The values the interface shows and edits, kept in a separate tree. |
| **Logic** | The code that runs when a value changes or the user clicks. |

A fifth piece, the **server**, delivers the page to the browser. You rarely touch it:
an adapter plugs it into Django, Flask, FastAPI or Uvicorn, or exports the page
as a file that needs no server at all.

<a id="gc-505-010"></a>

## 010 · A complete page

Block ID: **GC-505-010**.

```python
from gramlot import Page as BasePage

class Page(BasePage):
    title = "Hello"

    def main(self, root):
        pane = root.div(datapath="person")
        pane.input(value="^.name", lbl="Name", live=True)
        pane.p("^.name", mask="Hello, {}")
```

Type `Ada` in the field and the paragraph shows `Hello, Ada`.

- `root.div`, `pane.input` and `pane.p` build the **Source**: one method per element.
- `person.name` lives in the **Data**. The field writes it, the paragraph reads it.
- `^.name` means "follow `name`": when it changes, the paragraph updates by itself.
  You never look up or edit DOM elements.

<a id="gc-505-015"></a>

## 015 · Why Source and Data are separate

Block ID: **GC-505-015**.

Source says **what is on screen**; Data says **which values it works with**. The same
value can appear in many places, and each place updates when the value changes.
Loading a record means writing Data, not rebuilding the interface.

<a id="gc-505-020"></a>

## 020 · Where code runs

Block ID: **GC-505-020**.

- **In Python, on the server:** `main` builds the Source, and methods you expose
  answer calls from the browser.
- **In the browser:** bindings, formulas, controllers and the `Logic` class react to
  Data changes and user events.

A page exported without a server has no Python: everything runs in the browser.

<a id="gc-505-025"></a>

## 025 · Next steps

Block ID: **GC-505-025**.

1. [Run a page](018-quickstart.md).
2. [Data and binding](510-data-and-binding.md): the syntax you use in every page.
3. [Components](105-components.md): fields, layouts, trees and grids.
4. [Calling the server](098-server-calls.md).

The [Gramlot family](055-family.md) lists the repositories and which one to install.
