# Menus, toolbars, frames and windows

Document ID: **GC-350**.

> These interfaces are implemented in the development checkout. Their interaction
> design remains provisional while applications try it. This chapter documents
> that implementation; it does not promise availability in every released package.

<a id="gc-350-005"></a>
## 005 · Choose a presentation, keep one command hierarchy

A **menu** is a hierarchy of `menuline` entries. A popup displays compact rows;
`presentation="bar"` displays the first level as a toolbar. Submenus still open
as menus. A `dropDownButton` is a separate split action control, not the definition
of a menu.

| Need | Declaration | What opens |
| --- | --- | --- |
| Context menu on an area | `area.menu()` | Right-click or keyboard context action |
| Popup opened by a normal click | `area.menu(modifiers="*")` | The attached popup |
| Popup opened by Shift+click | `area.menu(modifiers="Shift")` | Only an exact matching modifier combination |
| Horizontal toolbar | `frame.top.menu(presentation="bar")` | First level remains visible |
| Vertical toolbar | `frame.left.menu(presentation="bar", orientation="vertical")` | First level is a vertical rail |
| Classic named menu bar | Add captioned menulines, each with `.menu()` | File, Edit, View open their hierarchies |

The opening modifiers are separate from the activation modifiers carried in a
command message. The same command definition can appear in several presentations;
each occurrence has its own Source node and sender identity.

<a id="gc-350-010"></a>
## 010 · Register commands once in JavaScript

Commands belong to a collection. Python selects its prepared package; it does not
repeat command labels or implement a second command registry.

```javascript
import {defineCollection} from '@gramlot/gramlot/components';

export default defineCollection({
    name: 'document-tools',
    components: [],
    registerCommands(gramlot) {
        const documents = gramlot.commands.registerGroup('documenti', {
            author: 'Example application',
            description: 'Document editing commands'
        });
        documents.register('save', {
            label: 'Save', publish: 'save', tooltip: 'Save the draft'
        });
        documents.register('toggleDetails', {
            label: 'Details', publish: 'toggleDetails'
        });
    }
});
```

The generated descriptor is imported through `Page.gramlots`; see the complete
[collection build tutorial](340-components-and-collections-guide.md#gc-340-045).
A namespace identifies a group: `documenti:save` and `save` are not interchangeable.
Duplicate namespaces or command names are errors. `icon` is text/emoji;
`iconSrc` is an image URL, including an SVG image. SVG is not injected as HTML.

<a id="gc-350-015"></a>
## 015 · One Python helper, popup and toolbar

The following Page assumes that the collection above has been generated as
`document_tools.widgets`. The helper declares the same hierarchy twice; it does
not move a single Source node between parents.

```python
from gramlot import Page as GramlotPage
from gramlot.collections.layout import mygramlot as layout
from document_tools.widgets import mygramlot as commands

class Page(GramlotPage):
    gramlots = [layout, commands]

    def main(self, root):
        root.dataSetter("document", dict(title="Draft", locked=False,
                                         details=False, hideSave=False, notice=""))
        frame = root.framePane(height="360px")
        bar = frame.top.menu(presentation="bar", iconSize=24,
                             background="var(--gramlot-surface-subtle)",
                             border_bottom="1px solid var(--gramlot-border-control)")
        self.document_menu(bar)
        center = frame.center.contentPane(
            frameTarget=True, node_label="document_editor", padding="12px",
            selfsubscribe_save="save", selfsubscribe_toggleDetails="toggleDetails")
        center.p("Right-click this area for the same commands.")
        center.input(value="^document.title", live=True)
        center.p("Details", hidden="^document.details:=!{}")
        center.p("^document.notice", role="status")
        self.document_menu(center.menu())

    def document_menu(self, menu):
        menu.menuline("documenti:save", disabled="^document.locked",
                      hidden="^document.hideSave")
        menu.menuline("-")
        view = menu.menuline(caption="View").menu()
        view.menuline("documenti:toggleDetails", checked="^document.details")
```

Place the handlers in the page's JavaScript Logic module, for example `editor_aux.js`:

```javascript
export class Logic {
    save(node, message) {
        node.SET('document.notice', `Save requested for ${node.GET('document.title')}`);
    }
    toggleDetails(node, message) {
        node.SET('document.details', !node.GET('document.details'));
    }
}
```

This example reports an action; it does not write to a database. The recipient owns
application behavior. For real persistence, call a declared endpoint and update
Data after the server accepts the change.

<a id="gc-350-020"></a>
## 020 · Command message and frame recipient

Exactly five fields are delivered:

| Field | Meaning |
| --- | --- |
| `sender` | The Source node of the activated entry |
| `target` | The selected recipient Source node in the nearest frame's center |
| `command` | Qualified registry identity, such as `documenti:save` |
| `parameters` | A snapshot of the entry's mapping, with pointer values resolved |
| `modifiers` | Boolean `shift`, `ctrl`, `alt`, `meta` activation keys |

Mark exactly one central descendant `frameTarget=True`. A nested frame establishes
its own recipient scope. Missing/ambiguous recipients or unknown commands do not
silently invoke a global action: dispatch is rejected with a console diagnostic.
The command definition's `publish` names the recipient's message. Messages are
captured before delivery and the runtime checks that sender and recipient still
belong to the live frame.

<a id="gc-350-025"></a>
## 025 · Groups, spacers and overflow priority

```python
bar = frame.top.menu(presentation="bar", iconSize=24, labelPosition="tooltip")
editing = bar.menuline(group=True, priority=80)
editing.menuline("documenti:save")
editing.menuline("documenti:toggleDetails", checked="^document.details")
bar.spacer(size=12)
bar.spacer(flex=1)
search = bar.menuline(group=True, overflowable=False)
search.input(value="^document.search", placeholder="Search", width="12rem")
```

Initialize `document.search` in the Page Data before using this fragment. Lower
priority units enter overflow first; equal priorities move from the end. A group
moves as a unit, preserving entry order. `overflowable=False` retains the unit.
When retained units cannot fit, the bar scrolls without splitting the groups.
Spacers provide layout, not fake commands. Input values and bindings survive
transfer to overflow. A submenu is a hierarchy; a group is a layout unit.

| `labelPosition` | Toolbar presentation |
| --- | --- |
| `beside` | Icon and text side by side |
| `below` | Icon above a smaller caption |
| `tooltip` | Icon with accessible name and tooltip |

`iconSize` controls the icon separately from the entry's `width`, `height`,
`class_`, `color` and other ordinary Source styles. A line can override its menu's
presentation. Overflow always uses side-by-side icons and labels. Its double
chevron is distinct from the small submenu chevron: downward on horizontal
bars, rightward on vertical bars. Selection uses the toolbar's highlighted
background; popup checked entries retain their check indication.

<a id="gc-350-030"></a>
## 030 · Load a submenu directly from a resolver

The menu owns the resolver; no auxiliary `dataRemote` or artificial Data scope
is necessary. The application must provide the declared endpoint.

```python
menu.menuline(caption="More").menu(
    resolver="document_menu", resolver_document_id="^document.id", cacheTime=30)
```

A Python endpoint returns a Bag, with stable node labels identifying entries:

```python
from gramlot import endpoint
from genro_bag import Bag

@endpoint
def document_menu(self, document_id):
    result = Bag()
    result.setItem("save", None, kind="command", command="documenti:save",
                   parameters=dict(id=document_id), disabled="^document.locked",
                   hidden="^document.hideSave")
    result.setItem("separator", None, kind="separator")
    view = Bag()
    view.setItem("details", None, kind="command", command="documenti:toggleDetails",
                 checked="^document.details")
    result.setItem("view", view, kind="submenu", caption="View")
    return result
```

This method belongs inside the Page class. Initialize the referenced Data paths.
`command` entries have no child Bag; separators contain only `kind`; a submenu
has a caption and exactly one content source: a child Bag **or** another resolver.
`checked`, `disabled` and `hidden` accept literal Booleans or live `^` bindings.
Their bindings stay reactive after the resolver returns. The result must be an
acyclic Bag; unsupported record fields are rejected. Empty, loading and error states
are represented in the menu, with retry after failure. Changed resolver arguments
invalidate the active request/projection; a late response must not replace newer content.

<a id="gc-350-035"></a>
## 035 · Frame regions and multiple bars

`framePane` exposes `frame.top`, `.bottom`, `.left`, `.right` and `.center`.
You can place several bars in a region and nest bars. Top/bottom regions stack
bars in rows; lateral regions can place vertical bars side by side. Ordinary
content and inputs remain Source children, with the same binding rules.

Use a borderContainer directly when you want explicit region declarations and
sizes. A framePane provides the prearranged region builders and command recipient
scope. Neither container saves documents automatically.

[Border regions, splitters and drawers](105-components.md#gc-105-100) describes
region sizes, clipping, nested layouts, drawer labels and pointer/keyboard use.
The [parameter reference](345-widget-reference.md#gc-345-framepane) lists the
actual frame declaration and inherited parent contract.

<a id="gc-350-040"></a>
## 040 · Dialog and floatingPane

| Behavior | `dialog` default | `floatingPane` default |
| --- | --- | --- |
| Modal | Yes, including collapsed/maximized | No |
| Close button | Enabled | Enabled |
| Movement | Disabled | Enabled |
| Resize | Disabled | Enabled |
| Collapse | Disabled | Enabled |
| Maximize button | Disabled | Disabled |

```python
window = root.dialog(title="Edit document", open="^editor.open",
                     movable=True, resizable=True, collapsible=True,
                     maximizable=True, maximized="^editor.maximized",
                     width="620px", height="380px")
frame = window.frame
frame.top.menu(presentation="bar")
center = frame.center.contentPane(frameTarget=True, padding="12px", overflow="auto")
center.input(value="^editor.draft.title", live=True, width="100%")
footer = frame.bottom.menu(presentation="bar")
footer.spacer(flex=1)
footer.menuline("documenti:save")
```

This fragment assumes initialized editor Data, a selected layout collection,
registered commands and the corresponding central handlers. The full gallery
editor includes Save and Cancel, validation, separate saved/draft Data and reset.
Replacing `root.dialog` with `root.floatingPane` gives the nonmodal version.

`open`, `collapsed`, `maximized`, position and dimensions can bind to Data.
Maximize uses the viewport; Restore recovers normal geometry. Move and resize
are suspended while maximized. Collapsing a maximized window retains that state.
`beforeClose` can veto a user close; application code owns save/discard semantics.
`html_dialog` remains available for the HTML tag, distinct from this window shell.

<a id="gc-350-045"></a>
## 045 · Try and compare

See [the visual tour](355-examples-and-visual-tour.md) for screenshots and the
Python gallery chapters. Try changing a bound field, opening a submenu, hiding
a command, narrowing the toolbar, maximizing/restoring a window and closing it
with unsaved Data. The example tells you which actions commit or discard its draft.

Check [all parameters and defaults](345-widget-reference.md) before adding an
option. Unknown slot names, client persistence, server persistence and custom
keyboard shortcuts are not implicit features of the menu system.
