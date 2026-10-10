# 180 · Menus in legacy GenroPy: investigation

Document ID: **GC-180**. Date: **2026-09-25**. Status: investigated, not implemented.
[Concise counterpart](../../docs_llm/internal/180-legacy-menu.md).

<a id="gc-180-005"></a>
## 005 · Scope and evidence

Block ID: **GC-180-005**.

This document records how legacy GenroPy builds menus. It compares the legacy
model with native HTML and with the Open UI menu elements proposal. It contains
observations only. It records no owner decision.

Inspected sources:

- GenroPy working tree `Genropy/genropy`, HEAD
  `fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`. All line numbers below refer to it.
- Dojo 1.1 shipped in the same tree: `dojo_libs/dojo_11/dojo/dijit/Menu.js`.
- `genropy_refactor` HEAD `63667e593` was read first. Its menu code is identical
  except for `resolver.expired()`, which the reference tree reads as the getter
  `resolver.expired` (`gnrjs/gnr_d11/js/gnrbag.js:2355`).
- Open UI and WHATWG pages, read on 2026-09-25 (see GC-180-035).

Paths without a prefix are under `gnrjs/gnr_d11/js/`.

<a id="gc-180-010"></a>
## 010 · Tags and widget classes

Block ID: **GC-180-010**.

| Tag | Class | Location | Dojo widget |
|---|---|---|---|
| `menu` | `gnr.widgets.Menu` | `genro_widgets.js:3120` | `dijit.Menu` |
| `menuline` | `gnr.widgets.Menuline` | `genro_widgets.js:2993` | `MenuItem`, `PopupMenuItem` or `MenuSeparator` |
| `dropdownbutton` | `gnr.widgets.DropDownButton` | `genro_widgets.js:5657` | `dijit.form.DropDownButton` |
| `menudiv` | `gnr.widgets.MenuDiv` | `genro_components.js:180` | none (div + `menu`) |
| `comboMenu` | `gnr.widgets.ComboMenu` | `genro_components.js:5648` | `comboArrow` + `menu` |
| `textboxMenu` | `gnr.widgets.TextboxMenu` | `genro_components.js:5656` | `textbox` + `comboMenu` |

Python side: `menuline(label, **kwargs)` is defined in
`gnrpy/gnr/web/gnrwebstruct/dojo11.py:852`. The docstring documents
`label='-'` for a separator, `action` and `checked`.

`Menubar` is listed in `dijitNS` in `dojo11.py:57`. Dojo 1.1 has no MenuBar
file under `dojo_libs/dojo_11`. No `gnr.widgets` class implements a menubar.
A search for `menubar` in `gnr_d11/js` finds only the ProseMirror editor option
and a `window.open` feature string.

<a id="gc-180-015"></a>
## 015 · Structure and item kinds

Block ID: **GC-180-015**.

`Menuline.creating` (`genro_widgets.js:2996`) picks the Dojo class per line:

- `label == '-'` → `MenuSeparator`.
- The line has a resolver → `PopupMenuItem`.
- The line has a non-empty child Bag → `PopupMenuItem`. The child `menu` is the
  submenu. `mixin_addChild` stores it as `popup`.
- The only child is a `dataController` or `dataRpc` → `MenuItem`. On click the
  child controller is fired (`getChildController`, `patch_onClick`).
- Otherwise → `MenuItem`.

Item attributes:

- `checked` → icon class `tick_icon10`. `mixin_setChecked` toggles it.
- `favorite` → icon class `box16 star`.
- `draggable` → `draggable=true` on the item focus node.

`Menu.mixin_setChecked(menuline, val)` (`genro_widgets.js:3218`) unchecks the
previously checked line. This gives single-choice behaviour inside one menu.

<a id="gc-180-020"></a>
## 020 · Content from data

Block ID: **GC-180-020**.

`Menu.creating` extracts `modifiers`, `validclass`, `storepath` and `values`.

- `values`: a `code:label` string or a Bag. `created` converts it with
  `gnr.menuFromBag` and sets the result as the node value.
- `storepath`: a data path. The Bag found there is converted with
  `gnr.menuFromBag`. If the data node has a resolver, the menu node takes that
  resolver. `storepath` is registered as a dynamic attribute. A change calls
  `mixin_setStorepath`, which rebuilds the menu.

`gnr.menuFromBag(bag, appendTo, menuclass, basepath)` (`genro_widgets.js:40`)
creates one `menuline` per Bag node:

- label = `caption` or `label` attribute, else the string value, else the node label.
- `fullpath` = dotted path of the node from the menu root.
- A node with a resolver gets a child `menu` with `content` = that resolver.
- A node with a Bag value gets a child `menu` built recursively.

Lazy loading happens at open time:

- Root menu: `_contextMouse` (`genro_widgets.js:3236`) checks
  `resolver.expired`. If expired it reads the value. It passes the result of
  `onOpeningMenu` as resolver keyword arguments. A Bag result is converted with
  `gnr.menuFromBag`. The old DOM bindings are restored on the rebuilt widget.
- Submenu: `patch__openPopup` (`genro_widgets.js:3358`) does the same for the
  popup of the focused line.

<a id="gc-180-025"></a>
## 025 · Opening, binding and context target

Block ID: **GC-180-025**.

Binding to the owner element:

- Without `connectId`, `created` binds the menu to its parent
  (`genro_widgets.js:3174`). The target is the parent widget `domNode`, the
  parent `downArrowNode` for widgets with an arrow, the parent plain `domNode`,
  or the page root.
- A parent with `dropDown` or `popup` (for example `dropdownbutton`) is not
  bound. That parent opens the menu itself.
- `connectedMenu=<id>` on any widget calls `menu.bindDomNode(domNode)`
  (`genro_widgets.js:285`). One menu can serve many widgets.
- Combo widgets move `connectedMenu` to `connectedArrowMenu`
  (`genro_widgets.js:5169`). The menu then opens from the arrow.

Dojo 1.1 `bindDomNode` (`dijit/Menu.js:96`) connects three events on the target:
`oncontextmenu` (or `onclick` with `leftClickToOpen`), `onkeydown`
(`_contextKey`) and `onmousedown` (`_contextMouse`).

Open rules in `_contextMouse` and `_openMyself` (`genro_widgets.js:3236`, `3347`):

- Disabled targets never open the menu.
- Without `modifiers`: the menu opens on right click or Ctrl+click.
- With `modifiers`: the menu opens on a click with those modifier keys.
  `comboMenu` sets `modifiers='*'` so any click opens it.
- `validclass`: the click target must carry that CSS class.

Context target:

- `_contextMouse` stores the clicked element as `originalContextTarget`.
- It resolves the element's sourceNode and stores it as `ctxTargetSourceNode`
  and as `genro._lastCtxTargetSourceNode`.
- `onOpen` adds the class `openingMenu` to `body` and `currentContextTarget` to
  the target. `onClose` removes both.

Positioning:

- `mixin_onOpeningPopup` places the popup around `attachTo`, or around the
  widget that declared `connectedMenu` with this menu id.
- `mixin_gnrPlaceAround` (`genro_widgets.js:3396`) sets the popup width to the
  anchor width and uses orientation `BL→TL`, `BR→TR`, mirrored for RTL.

<a id="gc-180-030"></a>
## 030 · Per-open callbacks, action and selection

Block ID: **GC-180-030**.

At each open, `_contextMouse` runs over the menu children:

- `onOpen(item, evt)` on the item.
- `menuItemCb(item, evt)` on the menu.
- `disabledItemCb(item, evt)` → `item.setDisabled(result)`.
- `hiddenItemCb(item, evt)` → `item.setHidden(result)`.

`singleOption` on the menu, when the static content has exactly one line:

- `'button'` → the line runs without opening the menu.
- `'ask'` → a confirmation dialog runs the line.

Click on a line, `Menuline.patch_onClick` (`genro_widgets.js:3062`):

1. `action` is the inherited `action` attribute. If the context target sourceNode
   has its own `action`, that one wins and becomes the scope.
2. The action is called as `f.call(scope, menuAttr, ctxSourceNode, evt)`.
3. A child `dataController`/`dataRpc` is fired with `_ctxSourceNode`, `_evt` and
   `_filterEvent`.
4. Each inherited `selected_<attr>` path receives the line attribute `<attr>`.
   The context target's `selected_*` attributes are merged in.
5. `selected` receives the line label.

`menudiv` with `value` (`genro_components.js:180`) builds a button that shows the
current caption. With static `values` the caption is computed from the value.
With `storepath` or bound values the caption is stored at `caption_path`,
default `<value_path>?label`, and a click writes both value and caption.

`textboxMenu` writes the chosen `fullpath` (or `valuekey`) into the textbox. With
a `separator` it appends to the current value.

<a id="gc-180-035"></a>
## 035 · Native HTML and the Open UI proposal

Block ID: **GC-180-035**.

Native HTML on 2026-09-25:

- `<menu>` is a list of commands. It behaves as `<ul>` with ARIA role `list`.
  It has no opening, keyboard or focus behaviour.
- `<menu type="context">`, `<menuitem>` and the global `contextmenu` attribute
  were removed from the standard.
- The only context-menu support is the `contextmenu` event.
- Available building blocks: Popover API, invoker commands (`commandfor`,
  `command`), CSS anchor positioning.

Open UI menu elements proposal, state read on 2026-09-25:

- Elements: `<menubar>`, `<menulist>`, `<menuitem>`, `<submenu>`.
- WHATWG issue #11729 is at Stage 2. The HTML PR #12011 is open, marked ready
  for review on 2026-08-26, with TODOs on keyboard, events and checkable items.
- Chromium has implementation CLs. Mozilla (#1317) and WebKit (#580) have taken
  no position.
- The explainer discourages using these elements for custom context menus.
- The explainer does not discuss lazy or data-driven content.

Sources: [explainer](https://open-ui.org/components/menu.explainer/),
[whatwg/html#11729](https://github.com/whatwg/html/issues/11729),
[whatwg/html#12011](https://github.com/whatwg/html/pull/12011),
[mozilla/standards-positions#1317](https://github.com/mozilla/standards-positions/issues/1317),
[WebKit/standards-positions#580](https://github.com/WebKit/standards-positions/issues/580).

<a id="gc-180-040"></a>
## 040 · Correspondence

Block ID: **GC-180-040**.

| Legacy GenroPy | Open UI proposal | Native today |
|---|---|---|
| `menu` (`dijit.Menu`) | `<menulist>` | `popover` element with role `menu` |
| `menuline` | `<menuitem>` | element with role `menuitem` |
| `menuline` with child `menu` | `<submenu>` = `<menuitem>` + `<menulist>` | nested popover |
| `menuline('-')` | `<hr>` | `<hr>` or role `separator` |
| `checked` + `Menu.setChecked` | `<fieldset checkable=single\|multiple>` + `defaultchecked` | `menuitemradio` / `menuitemcheckbox` roles |
| `menu` child of a button, `dropdownbutton`, `menudiv` | `<button command=toggle-menu commandfor=id>` | `popovertarget` or `commandfor` |
| `gnrPlaceAround` | anchor positioning | anchor positioning |
| `Menubar` tag without implementation | `<menubar>` | role `menubar`, keyboard in JS |

Legacy features with no counterpart in the proposal:

- Content from `values`, `storepath` and `gnr.menuFromBag`.
- Resolver loading at open time for menu and submenu.
- Context menu on right click, Ctrl+click, `modifiers` and `validclass`.
- `connectedMenu`: one menu bound to many widgets.
- Context target passed to `action` and to `selected_*`.
- Per-open callbacks `onOpen`, `menuItemCb`, `disabledItemCb`, `hiddenItemCb`.
- `singleOption`.
- Data write-back through `selected` and `selected_*`.

<a id="gc-180-045"></a>
## 045 · Open points

Block ID: **GC-180-045**.

- No owner decision exists on the Gramlot menu element names or grammar.
- No owner decision exists on whether Gramlot targets the proposed elements or
  popover with ARIA roles.
- Keyboard behaviour of legacy menus comes from Dojo 1.1 `dijit.Menu`
  (`_onKeyPress`, `_contextKey`). It is not analysed here.
- `gnr_d20` menu code is not analysed here.
