# 185 · Detachable panes and floating palettes in legacy GenroPy: investigation

Document ID: **GC-185**. Date: **2026-09-25**. Status: investigated, not implemented.
[Concise counterpart](../../docs_llm/internal/185-legacy-detachable.md).

<a id="gc-185-005"></a>
## 005 · Scope and evidence

Block ID: **GC-185-005**.

This document records how legacy GenroPy detaches a pane into a floating
palette and how the palette works. It compares both with native HTML. It
contains observations only. It records no owner decision.

Inspected sources:

- GenroPy working tree `Genropy/genropy`, HEAD
  `fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`. All line numbers below refer to it.
- Dojo 1.1 in the same tree: `dojo_libs/dojo_11/dojo/dojox/layout/FloatingPane.js`.
- `genropy_refactor` HEAD `63667e593` was read first. `onDetach` and the
  `detachable` setup are identical in both trees.

Paths without a prefix are under `gnrjs/gnr_d11/js/`.

<a id="gc-185-010"></a>
## 010 · Result

Block ID: **GC-185-010**.

- Legacy detach does not open a browser window.
- It moves the pane DOM node into a `floatingPane` inside the same page.
- The sourceNode is not rebuilt. Widgets, subscriptions and data bindings of the
  pane stay the same objects.
- Minimizing the palette puts the DOM node back in its original place.

<a id="gc-185-015"></a>
## 015 · Activation

Block ID: **GC-185-015**.

The attribute is `detachable`. It is read with
`sourceNode.getAttributeFromDatasource('detachable')`, so it can be a data path.

`_created` in `genro_widgets.js:326-347` adds four listeners on the widget DOM node:

- `mousemove` with Shift → adds CSS class `detachable`.
- `mousedown` with Shift → adds class `detachable` and sets `domNode.draggable = true`.
  Without Shift → sets `draggable = false`.
- `mouseup` → sets `draggable = false`.
- `mouseout` → removes class `detachable`.

`domNode` at line 328 is the local variable declared at line 259 in the same
function. It is not a global.

CSS in `gnrjs/gnr_d11/css/gnrbase_css/06_gnr_forms.css`:

- `.detachable` rule at line 114 is commented out.
- `.detacher` (line 118) is an absolute box at `top/bottom/left/right: 0` with a
  1s transition.
- `.detachable .detacher` (line 132) moves the box to 20px from each side. The
  exposed 20px border is where the drag starts.

CSS for the placeholder: `.detached_placeholder`, `.detached_placeholder_content`,
`.detached_placeholder_title` in `gnrbase_css/17_gnr_mobile_gallery.css:36-49`.

<a id="gc-185-020"></a>
## 020 · Drag and drop

Block ID: **GC-185-020**.

The gesture uses native HTML5 drag and drop.

- `onDragStart` (`genro_dom.js:1275`): for a detachable node the drag is
  cancelled without Shift, or when `sourceNode.attr.isDetached` is true.
- `setDragSourceInfo` (`genro_dom.js:1343`): writes `detachable: true` and the
  sourceNode `_id` into the drag data.
- `canBeDropped` (`genro_dom.js:899`): returns `'detach'` for detachable drag
  data. It skips `dropTypes` checks. Any drop target accepts it.
- `getDragDropInfo` (`genro_dom.js:1053`): returns early for detachable data.
- `onDragEnter` (`genro_dom.js:1086`): skips the drop outline when the result is `'detach'`.
- `onDrop` (`genro_dom.js:1182`): calls
  `genro.dom.onDetach(genro.src.nodeBySourceNodeId(_id), dropInfo)`.

<a id="gc-185-025"></a>
## 025 · onDetach

Block ID: **GC-185-025**.

`genro.dom.onDetach(sourceNode, dropInfo)` in `genro_dom.js:1119`:

1. Reads the pane coordinates with `dojo.coords(domnode)`.
2. Reads the inherited `title`, default `'Untitled'`. A pointer-path title is
   resolved to an absolute path and keeps its pointer prefix.
3. Calls `genro.dlg.floating` with `nodeId='floating_' + sourceNode._id`, the
   title, `top`/`left` at the drop point, `resizable:true`, `dockable:true`,
   `closable:false`, `dockTo:'dummyDock'`, `autoSize:false`.
4. Removes the first child of the palette `containerNode`.
5. Builds a placeholder div in the palette source with the pane size,
   class `detached_placeholder`, id `detached_<_id>` and `persist:false`. The
   placeholder shows the title.
6. Replaces the pane DOM node with the placeholder in the original parent.
7. Appends the pane DOM node to the palette `containerNode` and sets
   `position: relative` on it.
8. Sets `sourceNode.attr.isDetached = true`.
9. Connects to the palette `hide`:
   - puts the pane DOM node back where the placeholder is, with `setContent`
     when the placeholder parent is a widget `domNode`, else with `replaceChild`;
   - sets `isDetached = false`;
   - closes the palette after 1000 ms.
10. Shows the palette, brings it to top and resizes it to the pane size plus the
    palette title height.

`dockTo:'dummyDock'` and `closable:false` leave the minimize button as the
only way back. Dojo `FloatingPane.minimize` calls `hide`
(`FloatingPane.js:123`). `hide` fires the listener of step 9.

<a id="gc-185-030"></a>
## 030 · Floating palette

Block ID: **GC-185-030**.

`genro.dlg.floating(kw)` (`genro_dlg.js:842`) creates a div
`_gnr_float_<nodeId>` under the page source root and adds a `floatingPane` to it.

`gnr.widgets.FloatingPane` (`genro_widgets.js:2813`) wraps
`dojox.layout.FloatingPane` (Dojo 1.1):

- Title bar with close, maximize, restore and minimize buttons.
- Drag by title bar through Dojo `Moveable`. A `/dnd/move/stop` subscription
  moves the palette back to `top: 0` if it went above the viewport.
- Resize handle when `resizable`.
- `_startZ = 700`. `bringToTop` raises the palette.
- `patch_show` → `restoreRect`, `onShowing`, show, `bringToTop`.
- `patch_hide` and `patch_close` → `saveRect`. `close` also removes the source node.
- `saveRect` (`genro_widgets.js:2919`) stores `dojo.coords` in local storage
  under `palette_rect_<pagename>_<nodeId>`. It skips palettes without `nodeId`,
  hidden palettes, maximized palettes and `persist=false`.
- `restoreRect` (`genro_widgets.js:2886`) reads that key. Without a stored rect,
  or with `persist=false` or `fixedPosition`, it uses `left/top/width/height`
  (or `right`). It clamps the rect inside the parent with a 10px margin.
- `maximize` resizes to `t:0, l:0`.
- `_onDeleting` of the sourceNode destroys the widget.

`PalettePane` without `groupCode` (`genro_components.js:778`) builds a
`floatingPane` with `nodeId=<paletteCode>_floating`, dock button options and a
`<paletteCode>_show` subscription.

<a id="gc-185-035"></a>
## 035 · Uses of detachable

Block ID: **GC-185-035**.

- `PalettePane` with `groupCode` (`genro_components.js:783`): the palette content
  pane is detachable. Shift+drag takes one palette out of a palette group.
- `BagNodeEditor` (`genro_components.js:1944`): root `BorderContainer`.
- Chat component (`resources/common/gnrcomponents/chat_component/chat_component.js:77`):
  each room `BorderContainer`.
- `th_relatedIframeForm` (`resources/common/th/th.py:559-560`): `contentPane`
  with `detachable=True`, class `detachablePane`, and an inner `.detacher` div
  holding the iframe.
- `th_thIframe` (`th.py:529-530`): the same two lines are commented out.
- `dygraph` (`genro_extra.js:547`): a detachable chart defaults its title to
  `'Untiled Graph'`.

<a id="gc-185-040"></a>
## 040 · Native HTML

Block ID: **GC-185-040**.

Native HTML has no detachable pane concept and no floating palette element.

Floating palette parts:

- `<dialog>` opened with `show()` is non-modal. The page stays interactive.
  Several non-modal dialogs can be open together. It is not in the top layer.
  Esc does not close it. `closedby` changes that in Chrome 134+.
- `popover="manual"` puts an element in the top layer without light dismiss.
- CSS `resize` gives one resize handle at the bottom-right corner.
- Drag, resize on all sides, dock, bring-to-top and rect persistence need JS.

Detach in the same page:

- Moving the DOM node into a non-modal `<dialog>` or a popover reproduces
  `onDetach` without Dojo.

Detach into a separate browser window:

- Document Picture-in-Picture API: `documentPictureInPicture.requestWindow()`.
  Nodes moved with `append()` keep state and listeners. Needs a user gesture.
  One window at a time. Chrome and Edge desktop only.
- `window.open()` on a same-origin page, then `adoptNode()` or `append()`.
  Works in all browsers. Stylesheets must be copied. Needs a user gesture.
- Code inside a moved pane must use `node.ownerDocument` and
  `ownerDocument.defaultView`, not the global `document` and `window`.
- The return on window close (`pagehide`) needs JS.

<a id="gc-185-045"></a>
## 045 · Open points

Block ID: **GC-185-045**.

- No owner decision exists on a Gramlot detachable or palette grammar.
- No owner decision exists on same-page detach versus separate-window detach.
- `gnr_d20` code is not analysed here.
- The Dock widget created for `dockTo:'dummyDock'` is not analysed here.
