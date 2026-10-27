# Your first page

Document ID: **GC-018**.

Start with a running page. You can learn the architecture after seeing a value change.

<a id="gc-018-005"></a>
## 005 · Open the gallery

Open the [Python gallery](https://gallery-py.gramlot.dev/) with no installation.
Choose a lesson in the navigation tree. **Example** runs it, **Explanation** tells
you what to try, and **Code** shows the source files. The **Inspector** in the
navigation toolbar shows the current page's Data and Source.

To run the same gallery locally, use Python 3.11 or later in a virtual environment:

```sh
python -m venv .venv
source .venv/bin/activate
python -m pip install 'gramlot-py-server[uvicorn,gallery]'
gramlot uvicorn gallery
```

Open the address printed in the terminal and leave the process running.
The Python wheel includes the browser runtime; Node.js is not needed for this route.
For Windows activation and other hosts, follow the
[Python CLI guide](https://gramlot-py-server.readthedocs.io/en/latest/020-command.html).
JavaScript authors can use the [Node/Bun guide](https://gramlot-js-server.readthedocs.io/en/latest/010-tutorial.html)
or [serverless exporter](https://gramlot-js-server.readthedocs.io/en/latest/135-serverless-tutorial.html).

<a id="gc-018-010"></a>
## 010 · Try three ideas

1. **HTML, SVG and page structure:** compare a heading and paragraph with the
   Python declarations. Each call adds a Source node.
2. **Fields and input widgets:** type in a labelled field. A Gramlot component
   adds editing, labels and validation to a browser control.
3. **Data and bindings:** edit one value and watch another part of the page
   update. The two declarations share a Data path.

Use the search box to find a topic. You do not need to read every lesson in order;
[the learning route](025-try.md#gc-025-015) names the next concept for each section.

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
