# Try Gramlot: the quick route

Document ID: **GC-018**.

Open the examples, change a value, and see how the page works. You do not need
to read the architecture guides first.

<a id="gc-018-005"></a>

## 005 · Choose where to run it

Block ID: **GC-018-005**.

If you are unsure, start with **Python and Uvicorn**. Uvicorn runs the Python
server; it is not another part of the example to learn.

| I want to… | Use | Start here |
| --- | --- | --- |
| Write pages in Python | **gramlot-py-server**, with Python 3.11 or later. Uvicorn is the simplest starting point; Django, Flask, FastAPI and Kajenn are also supported. | [Installation and Python CLI](https://github.com/gramlot-org/gramlot-py-server/blob/main/docs/020-command.md#gp-020-010). Install the `uvicorn` and `gallery` extras, then run `gramlot uvicorn gallery`. |
| Write pages in JavaScript with a server | **gramlot-js-server**, with Node.js 22 or later and npm. Bun is another supported runtime. | [Installation and gallery commands](https://github.com/gramlot-org/gramlot-js-server#the-gallery-of-examples). After installation, run `npx gramlot node gallery`. |
| Open JavaScript examples without an application server | **@gramlot/gramlot-serverless**, in the **gramlot-js-server** repository. Node.js and npm build the export; people opening it only need a browser. | [Installation](https://github.com/gramlot-org/gramlot-js-server#the-gallery-of-examples) and [serverless CLI](https://github.com/gramlot-org/gramlot-js-server/blob/main/docs/130-reference.md#gs-130-030). Run `npx gramlot-serverless gallery gallery`, then open `gallery/index.html`. Keep the exported folder together. |

For a server, open the address printed in the terminal and leave the process
running while you try the pages. Serverless runs JavaScript pages in the browser;
it does not run Python. The two server repositories own the complete installation,
CLI options and troubleshooting instructions.

<a id="gc-018-010"></a>

## 010 · Try three examples

Block ID: **GC-018-010**.

1. **HTML / SVG → Hello World:** compare the visible heading with its declaration.
   **Source** is the tree that describes the page.
2. **HTML / SVG → Forms:** type in a field and try Reset. This first section uses
   Source and ordinary HTML controls, before introducing Data binding.
3. **Binding → Native editing:** edit fields, then toggle **live**. Watch the
   displayed values change. **Data** holds the values; a **binding** connects a
   control or text to a Data path.

Each section says which part of Gramlot it uses. Continue in section order:
[the learning route](025-try.md) follows the releases and revisits
examples as new features simplify them.

The gallery shows the result, explanation and source together. Python environments
show Python; JavaScript environments show JavaScript. A separate **Logic** tab,
when present, contains browser behavior. The source viewer is not a file editor.

<a id="gc-018-015"></a>

## 015 · Make a page of your own

Block ID: **GC-018-015**.

Use the CLI to create a project, then follow the commands it prints:

- **Python:** [create a project with `gramlot uvicorn new hello`](https://github.com/gramlot-org/gramlot-py-server/blob/main/docs/020-command.md#gp-020-005).
- **JavaScript:** [create a page or site with `npm create @gramlot`](https://github.com/gramlot-org/gramlot-js-server/blob/main/docs/135-serverless-tutorial.md).
  The generated project explains how to run it on Node.js or export it without a server.

Change a heading in the page file and reload, restart or rebuild as the chosen
guide explains. Then try a bound field using [Writing pages](095-writing-pages.md).

<a id="gc-018-020"></a>

## 020 · Optional: inspect Data and Source in Chrome

Block ID: **GC-018-020**.

[Download the DevTools ZIP from the latest release](https://github.com/gramlot-org/gramlot-devtools/releases/latest).
It is already built; no compilation is needed.

1. Extract the ZIP into a folder you will keep.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Choose **Load unpacked** and select the extracted folder containing `manifest.json`.
4. Open Chrome DevTools on the gallery and select **Gramlot**. Choose the gallery
   frame or the example in the panel's selector, then explore **Data** and **Source**.

For a gallery opened from disk, enable **Allow access to file URLs** in the
extension's details. After updating its files, reload the extension and reopen
DevTools. See the [extension guide](https://github.com/gramlot-org/gramlot-devtools/blob/main/docs/010-usage.md)
for editing and breakpoints. This optional Chrome extension is separate from the
gallery's in-page inspector, opened from its footer.
