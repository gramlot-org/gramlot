# Layout and windows

Document ID: **GC-420**.

The layout collection holds the containers that arrange a page: grids of fields,
regions, panels, windows and free workspaces. This page helps you **pick the right
container for the arrangement you want** and set it up. The complete list of
parameters of each container is in the [widget reference](345-widget-reference.md).

<a id="gc-420-start"></a>

## A small form

```python
def main(self, root):
    customer = root.div(datapath="customer")
    fields = customer.groupBox(lbl="Customer").formlet(columns=2, lbl_position="L")
    fields.textbox(value="^.name", lbl="Name")
    fields.textbox(value="^.city", lbl="City")
    fields.dateTextBox(value="^.since", lbl="Customer since")
```

The group draws a titled box; the formlet lines the fields up in two columns and
aligns their labels. Neither saves anything: the fields write to `customer` as
usual. The page base of your environment already enables this collection; if it
does not, [enable it once](340-components-and-collections-guide.md#gc-340-050).

<a id="gc-420-005"></a>
<a id="gc-420-010"></a>

## Pick a container by the arrangement you want

| You want | Use |
| --- | --- |
| Fields lined up in columns | [formlet](#gc-420-formlet) |
| A titled box around related content | [groupBox](#gc-420-groupbox) |
| A plain area that scrolls its content | [contentPane](#gc-420-contentpane) |
| Top, bottom, left, right and center regions | [borderContainer](#gc-420-bordercontainer) |
| Regions ready for toolbars and commands | [framePane](#gc-420-framepane) |
| One panel at a time, switched by your code | [stackContainer](#gc-420-stackcontainer) |
| One panel at a time, switched by tabs | [tabContainer](#gc-420-tabcontainer) |
| A window that blocks the page | [dialog](#gc-420-dialog) |
| A window that leaves the page usable | [floatingPane](#gc-420-floatingpane) |
| Cards the user moves, resizes and rotates | [trayPane](#gc-420-traypane) |
| Content the user pans, rotates and zooms | [transformPane](#gc-420-transformpane) |

<a id="gc-420-320"></a>
<a id="gc-420-155"></a>
<a id="gc-420-formlet"></a>
<a id="gc-420-160"></a>
<a id="gc-420-groupbox"></a>
<a id="gc-420-230"></a>
<a id="gc-420-shared-labels"></a>

## Fields in a grid

```python
fields = form.formlet(col_min_width="18rem", lbl_position="L")
fields.textbox(value="^.name", lbl="Name")
fields.textBoxArea(value="^.notes", lbl="Notes", lbl_position="TL")
form.groupBox(lbl="Address", lbl_variant="underline", copy=True)
```

- [formlet](345-widget-reference.md#gc-345-formlet) places its fields on a grid.
  `columns` takes a number of columns or a CSS track list; `col_min_width` instead
  fits as many columns as the width allows, down to one on a narrow screen.
- The `lbl_*` and `box_*` attributes of a formlet are defaults for the fields inside
  it; a field's own attribute wins. With `lbl_position="L"` the labels of each
  column are aligned for you.
- [groupBox](345-widget-reference.md#gc-345-groupbox) puts a title over its content.
  `lbl_variant` chooses the look: `bar` (the default), `underline` or `card`.
  `copy=True` adds a button that copies the group's Data to the clipboard.

The label can also become a menu that writes a code
([selectable labels](105-components.md#gc-105-selectable-labels)). More on both
containers in [formlet and groupBox](105-components.md#gc-105-085).

<a id="gc-420-165"></a>
<a id="gc-420-contentpane"></a>
<a id="gc-420-170"></a>
<a id="gc-420-bordercontainer"></a>
<a id="gc-420-150"></a>
<a id="gc-420-framepane"></a>
<a id="gc-420-260"></a>
<a id="gc-420-shared-regions"></a>

## Regions

```python
border = root.borderContainer(height="420px")
border.contentPane(region="left", width="180px", splitter=True, drawer=True)
border.contentPane(region="center", padding="16px")
border.contentPane(region="bottom", height="100px", splitter=True)
```

A [borderContainer](345-widget-reference.md#gc-345-bordercontainer) splits its area
into `top`, `bottom`, `left`, `right` and `center`. Each child, usually a
[contentPane](345-widget-reference.md#gc-345-contentpane), takes one `region`; the
center gets the space left over. Give the container a height, or place it in a
region that has one.

- `width` sizes a left or right region, `height` a top or bottom one.
- `splitter=True` lets the user resize the region; `drawer=True` adds a handle
  that opens and closes it.
- `design="headline"` (the default) gives top and bottom the full width;
  `design="sidebar"` gives it to left and right.

Resizing and closing regions never rebuild their content: fields keep their
values and drafts. Splitters, drawers and their styles are described in
[border regions](105-components.md#gc-105-100).

```python
frame = root.framePane(height="360px")
frame.top.menu(presentation="bar")
frame.center.contentPane(frameTarget=True)
```

A [framePane](345-widget-reference.md#gc-345-framepane) is a border layout with the
regions ready to use: `frame.top`, `frame.bottom`, `frame.left`, `frame.right` and
`frame.center`. It is where toolbars go, and it delivers their commands to the
pane marked `frameTarget=True`
([frames and toolbars](350-menus-toolbars-and-windows.md#gc-350-035)).

<a id="gc-420-175"></a>
<a id="gc-420-stackcontainer"></a>
<a id="gc-420-180"></a>
<a id="gc-420-tabcontainer"></a>
<a id="gc-420-265"></a>
<a id="gc-420-shared-selection"></a>

## One panel at a time

```python
tabs = root.tabContainer(selectedPage="^.page", height="300px")
tabs.contentPane(pageName="customer", title="Customer")
tabs.contentPane(pageName="notes", title="Notes", closable=True)
```

A [tabContainer](345-widget-reference.md#gc-345-tabcontainer) shows one child at a
time and a tab for each; every child needs a `title`. A
[stackContainer](345-widget-reference.md#gc-345-stackcontainer) works the same way
without tabs, so your code chooses the panel.

- `selectedPage` holds the `pageName` of the visible panel, `selected` its
  position from zero. Bound with `^`, both follow the user and can be set by your
  code.
- Hidden panels stay in the page: their fields keep values and drafts.
- `tabPosition` puts the tabs on any side, `tabAlign` aligns them, and
  `tabMode="underline"` draws a lighter strip.

A tab can carry an `icon` and a `badge`, can be closed (`closable=True`, with
`onClose` to refuse) or detached into a floating window (`detachable=True`):
see [selection and closing](105-components.md#gc-105-110),
[tab presentation](105-components.md#gc-105-115) and
[detachable panels](105-components.md#gc-105-960).

<a id="gc-420-325"></a>
<a id="gc-420-140"></a>
<a id="gc-420-dialog"></a>
<a id="gc-420-145"></a>
<a id="gc-420-floatingpane"></a>
<a id="gc-420-255"></a>
<a id="gc-420-shared-windows"></a>

## Windows

```python
window = root.dialog(title="Edit customer", open="^editor.open",
                     width="600px", height="380px")
window.frame.center.contentPane(padding="12px")
```

A [dialog](345-widget-reference.md#gc-345-dialog) blocks the rest of the page while
it is open; a [floatingPane](345-widget-reference.md#gc-345-floatingpane) leaves it
usable. Both contain a framePane, reached as `window.frame`, so a window can have
its own toolbars.

- `open` shows and hides the window, and is set back to `false` when the user
  closes it.
- A floatingPane can be moved, resized and collapsed by default; a dialog cannot
  until you set `movable`, `resizable` and `collapsible`.
- `maximizable` adds a maximize button. `collapsed`, `maximized` and the size and
  position can be bound to Data.
- `beforeClose` can refuse a close. Closing a window never saves anything.
- `docked=True` shows a floatingPane's content in place, without its title bar.

The defaults of both windows are compared in
[dialog and floatingPane](350-menus-toolbars-and-windows.md#gc-350-040).

<a id="gc-420-405"></a>
<a id="gc-420-traypane"></a>
<a id="gc-420-410"></a>
<a id="gc-420-transformpane"></a>

## Free workspaces

```python
tray = root.trayPane(storepath="workspace.layout", gridStep=20)
tray.textbox(value="^workspace.title", lbl="Title")
tray.div("Drag me by my title", lbl="Note")
```

A [trayPane](345-widget-reference.md#gc-345-traypane) shows each child as a card
with a title, given by `lbl`. The user drags a card by its title, resizes it,
rotates it and changes its layer; holding Shift snaps to `gridStep` and
`rotationStep`. `locked=True` freezes the arrangement while the cards stay usable.

The position, size, rotation and scale of every card live in the Bag at
`storepath`. To save a layout, copy that Bag; to restore it, write a copy back
([tray workspaces](105-components.md#gc-105-970)).

```python
root.transformPane(x="^view.x", y="^view.y", rotate="^view.rotate",
                   zoom="^view.zoom", min=0.5, max=4)
```

A [transformPane](345-widget-reference.md#gc-345-transformpane) follows the user's
gestures: one finger or the mouse pans, two fingers also rotate and zoom. It writes
`x`, `y`, `rotate` (degrees) and `zoom` to the bound paths, keeping `zoom` between
`min` and `max`. It does not move its content by itself: bind the content's style to
those values. `onEnd` names a method of your page's `Logic` that receives the final
values when a gesture ends.
