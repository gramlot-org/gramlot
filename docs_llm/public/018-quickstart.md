# Your first page

**Page-authoring rule:** GramlotServer automatically provides every packaged
standard collection to every site's Page base, in Python and JavaScript. Do not
import `gramlot.collections.*` or repeat `gramlots = [...]` for these collections.
Write component declarations directly. Explicit imports and collection declarations
are for custom additions. A missing standard component is a server/package defect,
not a reason for a one-off page import. The packaged inventory drives grammar and
bootstrap resources; it does not scan installed packages. External engines load on
first use in hosted pages. File exports embed the required resource bytes.

Document ID: **GC-018**.

Create a small Python page and see how its declarations share a Data value.

<a id="gc-018-005"></a>
## 005 · Prepare a Python environment

You need Python 3.11 or later, a text editor and a browser. Create and activate a
virtual environment, then install the Uvicorn adapter:

```sh
python -m venv .venv
source .venv/bin/activate
python -m pip install 'gramlot-py-server[uvicorn]'
```

On Windows, activate with `.venv\Scripts\activate` in Command Prompt. The
adapter installs the core; Node.js is not needed to serve this Python page.
For other environments, see the
[Python CLI guide](https://gramlot-py-server.readthedocs.io/en/latest/020-command.html).
JavaScript authors can follow the [Node/Bun guide](https://gramlot-js-server.readthedocs.io/en/latest/010-tutorial.html)
or [serverless guide](https://gramlot-js-server.readthedocs.io/en/latest/135-serverless-tutorial.html).

<a id="gc-018-010"></a>
## 010 · What the page will show

The page below declares an input and a paragraph. They share a Data path: typing
in the field changes the Data value, and the paragraph follows it. The declarations
are part of Source; the browser runtime renders them and maintains the binding.

<a id="gc-018-015"></a>
## 015 · Make a page of your own

```sh
gramlot uvicorn new hello
```

Follow the generated project's install and start commands. Then replace
`hello/pages/index.py` with this page:

```python
from gramlot import Page as GramlotPage

class Page(GramlotPage):
    def main(self, root):
        pane = root.div(datapath="demo", padding="16px")
        pane.h1("Hello")
        pane.input(value="^.name", lbl="Name", live=True,
                   placeholder="Type your name")
        pane.p("^.name", mask="You typed: {}")
```

Reload after saving; restart the server if development reload is not enabled.
Type `Ada`: the paragraph becomes `You typed: Ada`. `live=True` writes each edit
to `demo.name`; the paragraph reads that same path. This example uses the HTML
`input` tag and the shared Labelbox. It needs no extra collection or inline code.
The next chapter introduces [components such as textbox](105-components.md#gc-105-010).

<a id="gc-018-020"></a>
## 020 · Inspect what changed

In the gallery, open **Inspector** from the navigation toolbar and compare Data
with Source. Editing the field changes a value in Data; the declaration remains
in Source. The toolbar is on the side or bottom according to the layout.

The optional [Chrome DevTools extension](https://github.com/gramlot-org/gramlot-devtools/releases/latest)
provides a separate Gramlot panel. Extract its ZIP, open `chrome://extensions`,
enable Developer mode and use **Load unpacked** on the folder with `manifest.json`.
For exported pages opened from disk, enable **Allow access to file URLs**.
See its [usage guide](https://github.com/gramlot-org/gramlot-devtools/blob/main/docs/010-usage.md).

<a id="gc-018-025"></a>
## 025 · Keep an installation current

Update the packages in the environment that actually starts your gallery:

- [Python packages](https://gramlot-py-server.readthedocs.io/en/latest/020-command.html#gp-020-025):
  update core, examples and adapter, then restart the server.
- [npm packages](https://gramlot-js-server.readthedocs.io/en/latest/010-tutorial.html#gn-110-035):
  update in the project directory, then restart or regenerate the export.
- [Source checkouts](https://gramlot-examples.readthedocs.io/en/latest/docs/005-repository-map.html#ge-005-010):
  rebuild core and gallery browser bundles before restarting.

Reloading a browser cannot update an installed package or rebuild JavaScript.
Compare installed versions with the repositories' READMEs. For a useful smoke
check, open **Publish and subscribe to messages**, publish once, then inspect Data.
