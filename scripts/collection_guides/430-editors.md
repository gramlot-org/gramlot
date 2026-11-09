# Editors and previews

Document ID: **GC-430**.

The editors collection edits whole documents held in a Data string: source code,
HTML and Markdown, each with a matching read-only preview. This page answers
**which editor to use for a document, and how to show it beside its preview**. The
complete list of parameters is in the [widget reference](345-widget-reference.md).

<a id="gc-430-start"></a>

## An editor and its preview

```python
def main(self, root):
    pane = root.div(datapath="draft")
    pane.markdownEditor(value="^.text", lbl="Text")
    pane.markdownPreview(value="^.text")
```

Both components point at the same path, `draft.text`. The editor writes the
Markdown there as the user types; the preview reads it and redraws. Load or replace
`draft.text` from your code and the editor shows the new text without being rebuilt.
The page base of your environment already enables this collection; if it does not,
[enable it once](340-components-and-collections-guide.md#gc-340-050).

<a id="gc-430-005"></a>
<a id="gc-430-010"></a>

## Pick a component by the document

| You want to | Use |
| --- | --- |
| Edit source code or plain text | [codeMirror](#gc-430-codemirror) |
| Edit an HTML page with a rich toolbar | [htmlEditor](#gc-430-htmleditor) |
| Show an HTML page | [htmlPreview](#gc-430-htmlpreview) |
| Edit Markdown with a rich toolbar | [markdownEditor](#gc-430-markdowneditor) |
| Show Markdown rendered | [markdownPreview](#gc-430-markdownpreview) |
| Give the user a terminal on the server | [terminal](#gc-430-terminal) |

The editors and previews store and read a plain string. To edit a Typst document, use
codeMirror with the [Typst preview](435-typst.md).

<a id="gc-430-220"></a>
<a id="gc-430-shared-value"></a>
<a id="gc-430-225"></a>
<a id="gc-430-shared-state"></a>
<a id="gc-430-230"></a>
<a id="gc-430-shared-labels"></a>
<a id="gc-430-240"></a>
<a id="gc-430-shared-validation"></a>

## What every editor has

```python
form.codeMirror(value="^.source", lbl="Source", live=False,
                readonly="^.locked", validate_notnull=True)
```

- **When it writes.** An editor writes at every change; `live=False` writes when
  the user leaves it.
- **Locking.** `readonly=True` lets the user read, select and copy but not change
  the text; `disabled=True` also keeps the focus out. Data changes still reach the
  editor in both states.
- **A label and checks.** `lbl`, `lbl_position` and the `validate_*` attributes
  work as on any field ([labels and validation](105-components.md#gc-105-020)).
- **History and saving.** Each editor keeps its own undo history, which survives
  Data changes. Ctrl/Cmd+S
  publishes a local `save` topic with the current value: storing the document is
  up to your application ([editor history](105-components.md#gc-105-125)).

The previews only read `value`: they have none of these.

<a id="gc-430-425"></a>
<a id="gc-430-190"></a>
<a id="gc-430-codemirror"></a>

## Source code

```python
form.codeMirror(value="^.script", language="python", lineNumbers=True,
                indentUnit=4, fontSize=14)
```

[codeMirror](345-widget-reference.md#gc-345-codemirror) edits text exactly as
written. `language` chooses the highlighting and completion: `text`, `python`,
`javascript`, `typescript`, `json`, `html`, `css`, `xml`, `markdown`, `sql` or
`typst`. The other options (line numbers, wrapping, folding, brackets, font) change
how the editor behaves, never the text. Ctrl/Cmd+F opens search and replace; Tab
indents, and Escape then Tab leaves the editor
([CodeMirror options](105-components.md#gc-105-125)).

<a id="gc-430-195"></a>
<a id="gc-430-htmleditor"></a>
<a id="gc-430-200"></a>
<a id="gc-430-htmlpreview"></a>

## HTML

```python
form.htmlEditor(value="^.page")
form.htmlPreview(value="^.page")
```

[htmlEditor](345-widget-reference.md#gc-345-htmleditor) edits the body of an HTML
document and keeps its head untouched. Scripts, styles, embedded content and form
controls appear as protected blocks: the editor refuses to remove them, so change
them in a code editor. Rich editing can reformat the markup.
[htmlPreview](345-widget-reference.md#gc-345-htmlpreview) shows the document in a
sandbox where scripts do not run
([HTML editor and preview](105-components.md#gc-105-135)).

<a id="gc-430-205"></a>
<a id="gc-430-markdowneditor"></a>
<a id="gc-430-210"></a>
<a id="gc-430-markdownpreview"></a>

## Markdown

```python
form.markdownEditor(value="^.notes")
form.markdownPreview(value="^.notes", allowHtml="^.allowHtml")
```

[markdownEditor](345-widget-reference.md#gc-345-markdowneditor) edits headings,
paragraphs, lists, quotes, code, links, images and emphasis with a toolbar. Tables,
embedded HTML, strikethrough and task lists stay as source blocks, kept intact; edit
their insides in a code editor.
[markdownPreview](345-widget-reference.md#gc-345-markdownpreview) renders the text.
Embedded HTML appears as plain text unless `allowHtml=True`, which renders it after
removing scripts, frames and form controls
([Markdown editor and preview](105-components.md#gc-105-140)).

<a id="gc-430-270"></a>
<a id="gc-430-terminal"></a>

## A terminal on the server

```python
form.terminal(session="shell", connected="^.online", fontSize=13)
```

[terminal](345-widget-reference.md#gc-345-terminal) opens an interactive terminal
connected to a method of your page's PageStore marked `@terminal`; `session` names
that method. What the user types goes to the server as typed, Ctrl-C and arrows
included, and the output appears as it arrives. It never passes through the Data.

- `connected`, `rows` and `columns` are written by the terminal: whether the session
  is open and the size of the screen, which follows the size of its box.
- A page has one open session per name: opening it again closes the previous one.
- It needs a host that runs PageStore over WebSocket
  ([terminal socket](101-server-protocol.md#gc-101-325)). What the session may run
  on the server is your application's decision.
