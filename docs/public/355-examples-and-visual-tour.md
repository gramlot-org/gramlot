# Examples and visual tour

Document ID: **GC-355**.

<a id="gc-355-005"></a>
## 005 · Read, run and inspect

The [example manual](https://gramlot-examples.readthedocs.io/en/latest/) contains
one page per catalogue lesson, complete Python/JavaScript source and an embedded
Gramlot playground. Open the playground in its own tab for more room. These are
real framework pages exported by the serverless package, not imitation HTML demos.
The embedded application is JavaScript; showing Python source does not mean the
Read the Docs host executes a Python server.

For Python endpoints, resolver round trips, filesystem tools use the Python gallery when a lesson requires its server. The server adapter owns startup;
see [Try Gramlot](025-try.md). No public localhost URL is embedded in this manual.
The selected lessons below link to the current example manual. Use matching
core, examples and host packages when running them locally.

Use Gallery Settings to choose **Theme**, **Colors**, and **Color mode** separately.
Compact is a practical starting point; Mimi is denser and Joanna more spacious.
The Guide drawer is closed initially and can be opened from its visible handle.

<a id="gc-355-010"></a>
## 010 · Forms, regions and panels

![Compact drawer example, with the guide collapsed to leave the center usable](assets/showcase/drawers.png)

Try the four drawer handles, their labels and splitters. Enter a value, close its
region and reopen it: layout changes should preserve the Data. In nested layouts,
close or resize side regions when the central area becomes too narrow.

![Shaped and underline tabs with compact comparison panels](assets/showcase/tabs.png)

Tabs can be top, bottom, left or right. The label strip has independent start,
center and end alignment. A badge belongs to its tab even while the panel is hidden.

<a id="gc-355-015"></a>
## 015 · Commands and editing windows

![A classic menu bar with three levels of side-opening submenus](assets/showcase/menus.png)

A toolbar exposes the first level of a menu. Submenus stay hierarchical, while
an overflow menu collects lower-priority units when the available space shrinks.

![A complete dialog with a command toolbar, fields and footer actions](assets/showcase/dialog.png)

![The corresponding nonmodal floating editor](assets/showcase/floating.png)

Both editors use a framePane. The dialog blocks the page; the floating editor
allows background interaction. The example commits only to local page Data;
it is not a database save tutorial.

<a id="gc-355-020"></a>
## 020 · Density and color

![Compact fields and interaction states](assets/showcase/compact.png)

![Independent theme, color and light/dark selection in the gallery](assets/showcase/colors.png)

Use [Themes and CSS](096-themes-and-css.md) for application CSS declarations,
semantic variables, field labels, touch sizing and accessibility considerations.
Screenshots show specific viewports and states; they complement the live examples.

![A live field draft beside its last accepted Data value](assets/showcase/validation.png)

An invalid draft stays local to its editor. Another view of the accepted Data
keeps its last valid value. This distinction matters when composing validation,
Save actions and shared fields.

![Bag tree with expanded branches and lazy catalogue content](assets/showcase/tree.png)

The tree reads a Bag; disclosure, selection and lazy branches are separate from
application data editing. Its appearance follows the same theme variables.

![Markdown source shared by Code, Preview and Rich text views](assets/showcase/markdown.png)

Editors share the document value across views. Use the editing guide to distinguish
preserved Markdown blocks, rich-text editing, HTML sanitization and code options.

<a id="gc-355-025"></a>
## 025 · A small selection to start with

Each lesson explains what to do and what should change. Start with the first
three, then choose the feature you need. This is a reading route, not a second
copy of the catalogue.

| Lesson | Observe |
| --- | --- |
| [Your first page: headings and text](https://gramlot-examples.readthedocs.io/en/latest/lessons/html_svg/01-html_basics/01-hello_world.html) | One call creates one element. |
| [Native form controls](https://gramlot-examples.readthedocs.io/en/latest/lessons/html_svg/02-native_controls/01-forms.html) | Start with familiar HTML controls. |
| [Bind values with absolute and relative paths](https://gramlot-examples.readthedocs.io/en/latest/lessons/binding/01-paths_and_updates/01-pointers.html) | Edit one value and watch its bound views. |
| [Calculate a value with dataFormula](https://gramlot-examples.readthedocs.io/en/latest/lessons/controllers/01-logic/01-formula.html) | Change a subscribed argument; compare a non-subscribed pointer. |
| [One hierarchical menu, four presentations](https://gramlot-examples.readthedocs.io/en/latest/lessons/menus/01_presentations.html) | Use the same hierarchy as popup, toolbar and contextual menu. |
| [Toolbar: groups, priority and overflow](https://gramlot-examples.readthedocs.io/en/latest/lessons/menus/02_toolbar.html) | Shrink the bar and observe grouped overflow. |
| [Dialog: modal editing](https://gramlot-examples.readthedocs.io/en/latest/lessons/layout/04-dialog.html) | Edit a draft while the rest of the page is blocked. |
| [Floating: keep the page usable](https://gramlot-examples.readthedocs.io/en/latest/lessons/layout/05-floating.html) | Keep using the background while the editor stays open. |
| [Tray workspace](https://gramlot-examples.readthedocs.io/en/latest/lessons/layout/07-tray.html) | Move and resize cards, then save and restore their layout Bag. |
| [Color Maker: one block, three contexts](https://gramlot-examples.readthedocs.io/en/latest/lessons/composition/01-color_maker.html) | Reuse one helper under independent Data paths. |

The [complete catalogue](https://gramlot-examples.readthedocs.io/en/latest/lessons/index.html)
also covers validation, typed fields, remote data, editors and application tools.

<a id="gc-355-030"></a>
## 030 · Menus, toolbars and composed windows

These examples are in the main gallery's **Menus and toolbars** section. Choose
one hierarchy first, then study toolbar groups and overflow, then a complete
frame with top, side and bottom bars. Dialog and floating examples also appear
under **Containers and layout**.

The [menu guide](350-menus-toolbars-and-windows.md) explains the shared command
message and receiver. Use the gallery's **Code** tab to compare the Python
structure with its browser Logic. Saving a draft in these examples updates local
Data; durable server persistence is a separate application responsibility.
