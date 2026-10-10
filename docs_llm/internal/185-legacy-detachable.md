# 185 · Detachable panes and floating palettes in legacy GenroPy: investigation

Document ID: **GC-185**. Date: **2026-09-25**. Status: investigated, not implemented.
[Full counterpart](../../docs/internal/185-legacy-detachable.md). Read it for line references.

<a id="gc-185-005"></a>
## 005 · Scope and evidence

Observations only, no owner decision. Reference tree: `Genropy/genropy` HEAD
`fa35e5ad`, Dojo 1.1 `dojox/layout/FloatingPane.js`. `genropy_refactor`
`63667e593` has the same detach code.

<a id="gc-185-010"></a>
## 010 · Result

- Detach moves the pane DOM node into a `floatingPane` in the same page.
- No browser window. No rebuild: widgets and bindings stay the same objects.
- Minimizing the palette puts the node back.

<a id="gc-185-015"></a>
## 015 · Activation

- Attribute `detachable`, readable from data.
- Shift+mousedown sets `draggable=true` and class `detachable`. Mouseup and
  mouseout reset them.
- `.detachable .detacher` exposes a 20px border to start the drag.

<a id="gc-185-020"></a>
## 020 · Drag and drop

- Native HTML5 drag and drop. Drag is cancelled without Shift or when
  `isDetached` is true.
- Drag data carries `detachable` and the sourceNode `_id`.
- Any drop target accepts it. `onDrop` calls `genro.dom.onDetach`.

<a id="gc-185-025"></a>
## 025 · onDetach

- Creates `genro.dlg.floating` at the drop point: resizable, dockable,
  `closable:false`, `dockTo:'dummyDock'`, title from the inherited `title`.
- Puts a same-size placeholder with the title in the original place.
- Appends the pane node to the palette and sets `isDetached=true`.
- On palette `hide` (minimize): node back, `isDetached=false`, palette closed after 1s.

<a id="gc-185-030"></a>
## 030 · Floating palette

- `floatingPane` wraps Dojo `FloatingPane`: title bar, drag, resize handle,
  maximize, minimize to dock, `bringToTop`.
- `saveRect`/`restoreRect` persist position and size in local storage under
  `palette_rect_<pagename>_<nodeId>`, clamped inside the parent.
- `PalettePane` builds palettes with `nodeId=<paletteCode>_floating`.

<a id="gc-185-035"></a>
## 035 · Uses of detachable

- `PalettePane` with `groupCode`, `BagNodeEditor`, chat rooms,
  `th_relatedIframeForm`, `dygraph`. Commented out in `th_thIframe`.

<a id="gc-185-040"></a>
## 040 · Native HTML

- No native detachable pane and no floating palette element.
- Non-modal `<dialog>` (`show()`) or `popover="manual"` covers the base window.
  CSS `resize` gives one corner handle. Drag, full resize, dock, bring-to-top
  and persistence need JS.
- Separate window: Document Picture-in-Picture (Chrome/Edge desktop) or
  same-origin `window.open()`. Moved code must use `ownerDocument`.

<a id="gc-185-045"></a>
## 045 · Open points

- No owner decision on Gramlot detachable/palette grammar or on same-page
  versus separate-window detach.
- `gnr_d20` and the `dummyDock` Dock widget are not analysed.
