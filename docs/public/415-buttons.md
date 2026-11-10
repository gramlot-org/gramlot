# Buttons and menus

Document ID: **GC-415**.

The buttons collection holds the controls that start an action: buttons, menus and
toolbars. This page helps you **pick the right control for the action you offer**
and set it up. The complete list of parameters of each control is in the
[widget reference](345-widget-reference.md). Registering commands, routing them to
a frame and loading menus from the server are explained in
[menus, toolbars and windows](350-menus-toolbars-and-windows.md).

<a id="gc-415-start"></a>

## A button and a menu

```python
def main(self, root):
    root.button("Save", icon="✓", action="this.SET('document.saved', true)")
    tools = root.menu(presentation="bar")
    tools.menuline("Bold", action="this.SET('document.bold', true)")
    tools.menuline("Italic", action="this.SET('document.italic', true)")
```

The button runs its action when the user clicks it or presses Enter or Space. The
menu, shown as a toolbar, runs the action of the line the user picks. The buttons
collection is part of the base grammar: you do not need to enable it.

The examples on this page use short inline actions to stay readable. In a real page,
prefer a controller with a `Logic` method, which needs no `'unsafe-eval'` in the
Content Security Policy ([buttons and events](515-data-and-logic-reference.md#gc-515-030)).

<a id="gc-415-005"></a>
<a id="gc-415-010"></a>

## Pick a control by the action you offer

| You want to offer | Use |
| --- | --- |
| One action | [button](#gc-415-button) |
| An on/off state that the user switches | [toggleButton](#gc-415-togglebutton) |
| A main action with alternatives in a small menu | [dropDownButton](#gc-415-dropdownbutton) |
| A list of actions, as a popup, a context menu or a toolbar | [menu](#gc-415-menu) |
| One action, separator or submenu inside a menu | [menuline](#gc-415-menuline) |
| Space between the items of a toolbar | [spacer](#gc-415-spacer) |

<a id="gc-415-220"></a>
<a id="gc-415-shared-value"></a>
<a id="gc-415-225"></a>
<a id="gc-415-shared-state"></a>
<a id="gc-415-245"></a>
<a id="gc-415-shared-icons"></a>

## What every control has

```python
root.button("Delete", icon="🗑", disabled="^document.locked",
            action="this.SET('document.deleted', true)")
root.button("Print", iconSrc="/icons/print.svg",
            action="this.SET('document.print', true)")
```

- **An icon.** `icon` is text or an emoji; `iconSrc` is the address of an image,
  such as an SVG file.
- **Locking.** `disabled=True` blocks the control. Like the icon, it can follow
  Data: `disabled="^document.locked"`.
- **No form submit.** These buttons never submit an HTML form. When you need a
  native submit or reset button, use `html_button`
  ([button behavior](105-components.md#gc-105-095)).

<a id="gc-415-315"></a>
<a id="gc-415-110"></a>
<a id="gc-415-button"></a>
<a id="gc-415-115"></a>
<a id="gc-415-togglebutton"></a>

## Buttons

```python
form.button("Approve", action="this.SET('.approved', true)")
form.toggleButton("Notifications", value="^.notify", readonly="^.locked")
```

- [button](345-widget-reference.md#gc-345-button) runs one action. Write it in
  `action`, or place one `dataController` inside the button and the click runs
  that controller instead. A button takes only one of these.
- [toggleButton](345-widget-reference.md#gc-345-togglebutton) stores `true` or
  `false` in `value` and shows the state with a small light. A click flips the
  value first, then runs the optional `action`. `readonly` and `disabled` stop the
  user from flipping it; a change in the Data still updates the light.

The caption can hold other content, not only text. Asking for confirmation,
grouping fast clicks and the other options of the action are described in
[button behavior](105-components.md#gc-105-095).

<a id="gc-415-120"></a>
<a id="gc-415-dropdownbutton"></a>

## A main action with alternatives

```python
export = form.dropDownButton("Export", action="this.SET('.format', 'default')")
choices = export.menu()
choices.menuline("CSV", code="csv", action="this.SET('.format', 'csv')")
choices.menuline("PDF", code="pdf", action="this.SET('.format', 'pdf')")
```

[dropDownButton](345-widget-reference.md#gc-345-dropdownbutton) has two parts. The
main part runs the current action; the arrow opens the menu of alternatives.

- Picking a line runs that line once.
- Picking it with Shift also makes it the new main action, with its caption and icon.
- Each line needs its own `code`; `menuline("-")` draws a separator.
- `persist=True`, together with a stable `id` on the button, makes the browser
  remember the chosen line for this page. Only the line's code is remembered,
  never Data.

<a id="gc-415-125"></a>
<a id="gc-415-menu"></a>
<a id="gc-415-130"></a>
<a id="gc-415-menuline"></a>

## Menus, context menus and toolbars

```python
editor = root.div(datapath="editor")
popup = editor.menu()
popup.menuline("Copy", action="this.SET('.last', 'copy')")
popup.menuline("-")
view = popup.menuline(caption="View").menu()
view.menuline("Details", checked="^.details",
              action="this.SET('.details', !this.GET('.details'))")
```

A [menu](345-widget-reference.md#gc-345-menu) is a list of
[menuline](345-widget-reference.md#gc-345-menuline) entries. The same list can be
shown in different ways:

| You want | Write |
| --- | --- |
| A context menu, opened by right-click | `area.menu()` |
| A popup opened by a normal click | `area.menu(modifiers="*")` |
| A toolbar | `area.menu(presentation="bar")` |
| A vertical toolbar | `area.menu(presentation="bar", orientation="vertical")` |

A menuline can run an `action`, publish a registered `command`, or open a submenu
when you add a `menu()` under it. `checked` only shows a check mark: your action
changes the Data behind it. `disabled` and `hidden` can follow Data too.

Commands are registered once and reach the working area of the nearest frame:
see [commands](350-menus-toolbars-and-windows.md#gc-350-010) and
[the command message](350-menus-toolbars-and-windows.md#gc-350-020). A submenu can
also be loaded from a method on your server with `resolver`
([resolver submenus](350-menus-toolbars-and-windows.md#gc-350-030)).

<a id="gc-415-135"></a>
<a id="gc-415-spacer"></a>

## Arranging a toolbar

```python
bar = root.menu(presentation="bar", iconSize=24, labelPosition="below")
edit = bar.menuline(group=True)
edit.menuline("Undo", icon="↶", action="this.SET('editor.undo', true)")
edit.menuline("Redo", icon="↷", action="this.SET('editor.redo', true)")
bar.spacer(flex=1)
bar.menuline("Help", icon="?", action="this.SET('editor.help', true)")
```

- `labelPosition` places the caption: `beside` the icon (the default), `below` it,
  or only in a `tooltip`. `iconSize` sets the icon size in pixels. A single line
  can override both.
- [spacer](345-widget-reference.md#gc-345-spacer) adds empty space:
  `size` in pixels, or `flex` to take a share of the free space. Use one or the
  other.
- `menuline(group=True)` keeps several items together, including fields placed
  inside it.

When the toolbar is too narrow, the items that do not fit move, in order, into a
popup at its end; a group moves as a whole
([groups and overflow](350-menus-toolbars-and-windows.md#gc-350-025)).
