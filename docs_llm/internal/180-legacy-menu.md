# 180 · Menus in legacy GenroPy: investigation

Document ID: **GC-180**. Date: **2026-09-25**. Status: investigated, not implemented.
[Full counterpart](../../docs/internal/180-legacy-menu.md). Read it for line references.

<a id="gc-180-005"></a>
## 005 · Scope and evidence

Observations only, no owner decision. Reference tree: `Genropy/genropy` HEAD
`fa35e5ad`, Dojo 1.1 `dijit/Menu.js`. `genropy_refactor` `63667e593` has the same
menu code. Open UI/WHATWG pages read on 2026-09-25.

<a id="gc-180-010"></a>
## 010 · Tags and widget classes

- `menu` → `gnr.widgets.Menu` → `dijit.Menu`.
- `menuline` → `gnr.widgets.Menuline` → `MenuItem`, `PopupMenuItem` or `MenuSeparator`.
- `dropdownbutton`, `menudiv`, `comboMenu`, `textboxMenu` open a `menu`.
- `Menubar` is listed in Python `dijitNS`. Dojo 1.1 and `gnr.widgets` have no menubar.

<a id="gc-180-015"></a>
## 015 · Structure and item kinds

- `label='-'` → separator. Child Bag or resolver → submenu.
- Single child `dataController`/`dataRpc` → fired on click.
- `checked` → tick icon. `Menu.setChecked` keeps one checked line per menu.
- `favorite` → star icon. `draggable` → draggable item.

<a id="gc-180-020"></a>
## 020 · Content from data

- `values` (`code:label` string or Bag) and `storepath` (data path) build lines
  through `gnr.menuFromBag`. Label = `caption`/`label`/string value/node label.
  Each line gets `fullpath`.
- A resolver loads content at open time for menu and submenu. `onOpeningMenu`
  supplies resolver keyword arguments. A `storepath` change rebuilds the menu.

<a id="gc-180-025"></a>
## 025 · Opening, binding and context target

- Without `connectId` the menu binds to its parent (widget, arrow node, DOM node
  or page root). `connectedMenu=<id>` binds one menu to many widgets.
- Dojo `bindDomNode` connects `oncontextmenu`, `onkeydown`, `onmousedown`.
- Opens on right click or Ctrl+click. `modifiers` and `validclass` change the
  rule. `comboMenu` uses `modifiers='*'`.
- The clicked element's sourceNode becomes `ctxTargetSourceNode`.
- `gnrPlaceAround` sizes and places the popup around the anchor.

<a id="gc-180-030"></a>
## 030 · Per-open callbacks, action and selection

- Per open: `onOpen`, `menuItemCb`, `disabledItemCb`, `hiddenItemCb`.
- `singleOption='button'|'ask'` runs a single line without opening.
- Click: `action(menuAttr, ctxSourceNode, evt)`. The context target `action` wins.
- `selected_<attr>` receives the line attribute. `selected` receives the label.
- `menudiv value=` shows the caption. `textboxMenu` writes into a textbox.

<a id="gc-180-035"></a>
## 035 · Native HTML and the Open UI proposal

- Native `<menu>` = `<ul>`, role `list`, no behaviour. Context menu markup was
  removed. Only the `contextmenu` event remains.
- Open UI proposes `<menubar>`, `<menulist>`, `<menuitem>`, `<submenu>`.
  WHATWG Stage 2. HTML PR #12011 open. Chromium implementing. Mozilla and WebKit
  without a position. No context-menu use. No data-driven content.

<a id="gc-180-040"></a>
## 040 · Correspondence

- `menu` ↔ `<menulist>`. `menuline` ↔ `<menuitem>`. Nested `menu` ↔ `<submenu>`.
- `menuline('-')` ↔ `<hr>`. `checked`/`setChecked` ↔ `<fieldset checkable>`.
- Button parent ↔ `commandfor`. `gnrPlaceAround` ↔ anchor positioning.
- Without counterpart: Bag content, resolver loading, context menu, `connectedMenu`,
  context target, per-open callbacks, `singleOption`, `selected_*` write-back.

<a id="gc-180-045"></a>
## 045 · Open points

- No owner decision on Gramlot menu names, grammar or native target.
- Dojo keyboard behaviour and `gnr_d20` are not analysed.
