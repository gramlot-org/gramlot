# Layout and windows

Document ID: **GC-420**.

<a id="gc-420-start"></a>
## Start here

Choose `formlet` for aligned fields, `borderContainer` for regions, `tabContainer` for selectable panels and `framePane` for reusable toolbar/content compositions. `dialog` is modal; `floatingPane` keeps the rest of the page usable.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-layout).

This example also uses the inputs collection. Distinct relative datapaths isolate each panel's Data. `title` is a child parameter projected by the tab container, not a textbox parameter. See [containers](105-components.md#gc-105-085).

Use the shared Labelbox (`lbl`, `lbl_*`, `box_*`) around HTML or components. A `trayPane` owns card geometry and selection through its `storepath` Bag; moving/resizing its DOM must retain content and bindings. [Tray workspaces](105-components.md#gc-105-970). `transformPane` metadata declares read bindings, but user gestures write simple reactive `^` pointers during interaction; `onEnd` receives final values. [Form state and editingStatus](340-components-and-collections-guide.md#gc-340-110) track local changes/errors/pending validation; accepting a local baseline is not a server save.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)


<a id="gc-420-005"></a>
<a id="gc-420-010"></a>

Ordinary Source/CSS attributes remain in Writing pages and Themes and CSS.
Pages inherit environment collections; Page.gramlots adds missing ones. Buttons are built in.
Contract JSON omits only undeclared keys: no default is not the same as null. dtype: T text, B Boolean, L integer, R real, X structured value; remaining codes are TYTX. binding: read = Data to widget, write = widget to Data, twoWay = both. nullable permits None; enum restricts values; annotation preserves type/regex constraints. Parameters sharing a table row have exactly the same contract. Child grammar: * allows arbitrary Source children; empty permits none. Parent None means no declared restriction.


<a id="gc-420-230"></a>
<a id="gc-420-shared-labels"></a>
## Labels and field presentation

lbl supplies a field label; lbl_position places it. The lbl_* and box_* style families are described in [Themes and CSS](096-themes-and-css.md).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `lbl` | `{"binding":"read","dtype":"T","nullable":true,"qualification":"intl_str"}` | groupBox |
| `lbl_position` | `{"binding":"read","default":"TL","dtype":"T","enum":["TL","TC","TR","L","R","BL","BC","BR"]}` | groupBox |

<a id="gc-420-255"></a>
<a id="gc-420-shared-windows"></a>
## Window behavior and geometry

Dialog and floatingPane share controls, geometry and state. Their movement, resize and collapse defaults differ as shown below. Dialog remains modal, including when collapsed or maximized. See [Windows](350-menus-toolbars-and-windows.md).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `title` | `{"binding":"read","default":"","dtype":"T"}` | dialog, floatingPane |
| `open, collapsed, maximized` | `{"binding":"twoWay","default":false,"dtype":"B"}` | dialog, floatingPane |
| `closable` | `{"binding":"read","default":true,"dtype":"B"}` | dialog, floatingPane |
| `movable, resizable, collapsible` | `{"binding":"read","default":false,"dtype":"B"}` | dialog |
| `maximizable` | `{"binding":"read","default":false,"dtype":"B"}` | dialog, floatingPane |
| `beforeClose` | `{"dtype":"T","nullable":true}` | dialog, floatingPane |
| `width, height, left, top` | `{"binding":"twoWay","dtype":"T","nullable":true}` | dialog, floatingPane |
| `minWidth, minHeight` | `{"binding":"read","dtype":"T","nullable":true}` | dialog, floatingPane |
| `movable, resizable, collapsible, titlebar` | `{"binding":"read","default":true,"dtype":"B"}` | floatingPane |
| `docked` | `{"binding":"twoWay","default":false,"dtype":"B"}` | floatingPane |
| `detachable` | `{"binding":"read","default":false,"dtype":"B"}` | floatingPane |

<a id="gc-420-260"></a>
<a id="gc-420-shared-regions"></a>
## Border and frame regions

BorderContainer and framePane share region arrangement and persistence. Child region parameters stay with each parent below. See [Containers](105-components.md#gc-105-085).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `design` | `{"binding":"read","default":"headline","dtype":"T","enum":["headline","sidebar"]}` | framePane, borderContainer |
| `persist` | `{"binding":"read","default":false,"dtype":"B"}` | framePane, borderContainer |

<a id="gc-420-265"></a>
<a id="gc-420-shared-selection"></a>
## Panel selection

StackContainer and tabContainer select one child panel; selectedPage uses its page name and selected its index. See [Containers](105-components.md#gc-105-085).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `selectedPage` | `{"binding":"twoWay","default":null,"dtype":"T","nullable":true}` | stackContainer, tabContainer |
| `selected` | `{"binding":"twoWay","default":null,"dtype":"L","nullable":true}` | stackContainer, tabContainer |

<a id="gc-420-320"></a>
## Forms and containers


<a id="gc-420-155"></a>
<a id="gc-420-formlet"></a>
### `formlet`

Collection: layout. Responsive field layout with shared label alignment.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-formlet).


**Data contract.** Fields retain their own Data bindings. Resolved lbl_* and box_* defaults are inherited by descendants from the declaring scope, and explicit child values override them.


**Interaction and events.** The grid and label projection update when presentation inputs change, keeping field drafts and focus with their existing controls.


**Composition.** Place fields or nested layout children inside the formlet. columns can specify a positive integer or CSS track list. col_min_width switches to an auto-fitting grid.


**Limits and lifecycle.** Invalid numeric column counts raise an error. This layout does not create an editing session. Label measurement observers are released on detach.


| Parameters | Contract |
| --- | --- |
| `columns` | `{"binding":"read","default":1,"dtype":["L","T"]}` |
| `col_min_width` | `{"binding":"read","dtype":"T","nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-420-160"></a>
<a id="gc-420-groupbox"></a>
### `groupBox`

Collection: layout. A labelled content group with an optional scoped Data copy command.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-groupbox).


**Data contract.** Descendants use the enclosing Source Data scope. Copy reads the current scoped Bag. TYTX retains types and attributes, and JSON contains values only.


**Interaction and events.** With copy enabled, the header action copies TYTX and the format menu offers TYTX or JSON. The header reports clipboard success or failure.


**Composition.** Place arbitrary Source content under the labeled group. Choose bar, underline or card presentation through lbl_variant.


**Limits and lifecycle.** Copy requires a usable browser clipboard. The box disables its copy actions while a copy is pending and ignores late feedback after detaching. The heading has no collapse control or state.

Shared contracts: [Labels and field presentation](#gc-420-shared-labels).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |
| `copy` | `{"binding":"read","default":false,"dtype":"B"}` |
| `lbl_variant` | `{"binding":"read","default":"bar","dtype":"T","enum":["bar","underline","card"]}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-420-165"></a>
<a id="gc-420-contentpane"></a>
### `contentPane`

Collection: layout. A content area or a child region/panel of a layout container.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-contentpane).


**Data contract.** The pane has no value binding. Content and its Data scope follow the Source composition. Authored flex layout is projected into the wrapper containing the slotted children.


**Interaction and events.** The pane scrolls its content when needed. In a frame or border container the parent owns region events and chrome.


**Composition.** Accepts arbitrary Source children. Use it as a direct framePane region or as a standalone scrollable pane.


**Limits and lifecycle.** Flex projection covers direction, wrapping, alignment and gaps. Region sizing and splitter writeback are provided by the owning container.

No additional component-specific parameters.


Child grammar: `*`; parent grammar: `None`.

<a id="gc-420-170"></a>
<a id="gc-420-bordercontainer"></a>
### `borderContainer`

Collection: layout. Five regions with optional splitters, drawers and nested layouts.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-bordercontainer).


**Data contract.** Numeric regional width or height with a writable binding receives live splitter updates. Literal, read-only, CSS string and transformed dimensions do not gain writeback. With persist enabled, sizes can be restored by stable container id.


**Interaction and events.** Splitters support pointer and keyboard resizing. Drawer activation can call drawer_onclick with evt and show. Region events include closable_change on the child and splitter_resize on the parent.


**Composition.** Give each direct child a distinct top, bottom, left, right or center region. Side children can opt into splitters, drawers or detachment while retaining their Source content.


**Limits and lifecycle.** Splitters are always live. Invalid or duplicate regions, inconsistent size limits and persistence without a stable id raise errors.

Shared contracts: [Border and frame regions](#gc-420-shared-regions).

No additional component-specific parameters.


Child grammar: `*`; parent grammar: `None`.

Child parameters projected by the parent:

| Parameters | Contract |
| --- | --- |
| `detachable` | `{"default":false,"dtype":"B"}` |
| `title` | `{"default":"","dtype":"T"}` |
| `region` | `{"enum":["top","bottom","left","right","center"],"required":true,"unique":true}` |
| `width, height` | `{}` |
| `drawer_onclick` | `{"inline":["evt","show"]}` |

<a id="gc-420-150"></a>
<a id="gc-420-framepane"></a>
### `framePane`

Collection: layout. A border composition exposing top, bottom, left, right and center region builders.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-framepane).


**Data contract.** Uses the border layout sizing and persistence contract. Frame regions keep their field bindings, and a nested frame keeps an independent command recipient boundary.


**Interaction and events.** Regional splitters and drawers behave as in borderContainer. Commands composed in a frame can address its own recipient.


**Composition.** Direct children are contentPane regions. Frame helpers create or retrieve Source regions without duplicating them. Compose toolbars or working content inside those regions.


**Limits and lifecycle.** There is at most one direct contentPane per region. Frame sizing and persistence follow the same validation and stable-id requirements as borderContainer.

Shared contracts: [Border and frame regions](#gc-420-shared-regions).

No additional component-specific parameters.


Child grammar: `contentPane`; parent grammar: `None`.

Child parameters projected by the parent:

| Parameters | Contract |
| --- | --- |
| `detachable` | `{"default":false,"dtype":"B"}` |
| `title` | `{"default":"","dtype":"T"}` |
| `region` | `{"enum":["top","bottom","left","right","center"],"required":true,"unique":true}` |
| `width, height` | `{}` |
| `drawer_onclick` | `{"inline":["evt","show"]}` |

<a id="gc-420-175"></a>
<a id="gc-420-stackcontainer"></a>
### `stackContainer`

Collection: layout. One selected panel at a time, without a tab strip.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-stackcontainer).


**Data contract.** selectedPage identifies a panel by its Source pageName. selected is its zero-based position among direct panels. Both support two-way binding, and a valid named selection takes precedence when both values change together.


**Interaction and events.** On a selection change, hiding and showing announce the outgoing and incoming panels before selected reports their resulting active states. A close uses the child onClose guard and publishes closing and closed when accepted.


**Composition.** Direct Source children are panels. Give panels stable pageName values when selecting by name. The stack has no built-in tab strip. External controls can set its selection.


**Limits and lifecycle.** Duplicate non-null page names and negative or noninteger indices raise errors. An out-of-range index leaves the current available panel selected or uses the normal fallback. Inactive panels stay mounted, and closing a panel removes its Source while retaining application Data.

Shared contracts: [Panel selection](#gc-420-shared-selection).

No additional component-specific parameters.


Child grammar: `*`; parent grammar: `None`.

Child parameters projected by the parent:

| Parameters | Contract |
| --- | --- |
| `pageName` | `{"dtype":"T","nullable":true,"unique":true}` |
| `title` | `{"default":"","dtype":"T"}` |
| `onClose` | `{"inline":[]}` |

<a id="gc-420-180"></a>
<a id="gc-420-tabcontainer"></a>
### `tabContainer`

Collection: layout. Selected panels with shaped or underlined tabs on any side.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-tabcontainer).


**Data contract.** selectedPage identifies a panel by its Source pageName. selected is its zero-based position among direct panels. Both support two-way binding, and a valid named selection takes precedence when both values change together.


**Interaction and events.** On a selection change, hiding and showing announce the outgoing and incoming panels before selected reports their resulting active states. A close uses the child onClose guard and publishes closing and closed when accepted. The tab strip adds pointer and keyboard selection. An eligible detachable tab can open in a floating window and reattach when that window closes.


**Composition.** Author a titled direct Source child for each tab. Child metadata can supply a name, icon, badge, closability and detachment. Inactive panel controls remain mounted.


**Limits and lifecycle.** Hidden, disabled and detached panels are skipped for strip selection. onClose must return a synchronous boolean. Detaching moves the slot presentation while preserving the controls.

Shared contracts: [Panel selection](#gc-420-shared-selection).


| Parameters | Contract |
| --- | --- |
| `tabMode` | `{"binding":"read","default":"tabs","dtype":"T","enum":["tabs","underline"]}` |
| `tabPosition` | `{"binding":"read","default":"top","dtype":"T","enum":["top","bottom","left","right"]}` |
| `tabAlign` | `{"binding":"read","default":"start","dtype":"T","enum":["start","center","end"]}` |

Child grammar: `*`; parent grammar: `None`.

Child parameters projected by the parent:

| Parameters | Contract |
| --- | --- |
| `pageName` | `{"dtype":"T","nullable":true,"unique":true}` |
| `title` | `{"default":"","dtype":"T","required":true}` |
| `onClose` | `{"inline":[]}` |
| `detachable` | `{"dtype":"B"}` |

<a id="gc-420-405"></a>
<a id="gc-420-traypane"></a>
### `trayPane`

Collection: layout. Data-owned arrangement of labelled live cards with selection, movement, resize, layers, rotation, zoom and snapping.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-traypane).


**Data contract.** storepath resolves to a Bag keyed by direct child Source labels. Each position Bag holds left, top, width, height, rotation, scale, selected and layer. Gesture changes write geometry and selection to those rows while the existing controls stay mounted. With autoArrange, the tray writes an even grid into the rows when children are added or removed and when the pane is resized; autoSize also writes width and height to fill the visible pane.


**Interaction and events.** Drag, resize and rotation handles edit geometry. Shift applies configured snapping. Click and marquee gestures select blocks, and selected blocks can move together. Opt-in close removes the block Source and its geometry row. A user move or resize writes autoArrange false, keeping the user arrangement; setting it true again rearranges immediately.


**Composition.** Give each direct child a Labelbox with lbl. Child options include minWidth, minHeight, aspectRatio and closable. A tray can contain interactive fields and nested trays.


**Limits and lifecycle.** Bounds and same-layer contact constrain edits. Lock hides editing chrome while external Data still projects. Cancellation restores the gesture state, and store replacement ends the old gesture without overwriting the replacement. Automatic arrangement ignores rotation and scale; minimum dimensions take precedence over the visible area.


| Parameters | Contract |
| --- | --- |
| `storepath` | `{"dtype":"T"}` |
| `locked, gridVisible, autoSize` | `{"binding":"read","default":false,"dtype":"B"}` |
| `gridStep` | `{"binding":"read","default":10,"dtype":"L"}` |
| `rotationStep` | `{"binding":"read","default":15,"dtype":"N"}` |
| `autoArrange` | `{"binding":"twoWay","default":false,"dtype":"B"}` |

Child grammar: `*`; parent grammar: `None`.

Child parameters projected by the parent:

| Parameters | Contract |
| --- | --- |
| `closable` | `{"default":false,"dtype":"B"}` |
| `minWidth` | `{"default":100,"dtype":"N"}` |
| `minHeight` | `{"default":64,"dtype":"N"}` |
| `aspectRatio` | `{"default":null,"dtype":"N","nullable":true}` |

<a id="gc-420-410"></a>
<a id="gc-420-transformpane"></a>
### `transformPane`

Collection: layout. Tracks translation, rotation and scale gestures; child Source bindings own the visual transform. Gestures write simple reactive pointers despite read-only binding metadata; onEnd reports final values.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-transformpane).


**Data contract.** x and y express translation, rotate is an angle in degrees, and zoom is a scale factor. Gestures write these values to Data through plain reactive pointers without a transform. min, max and step constrain zoom.


**Interaction and events.** One pointer translates. Two touches also rotate and zoom. When the last pointer is released after a changed gesture, onEnd Logic receives x, y, rotate and zoom.


**Composition.** Place arbitrary Source content inside the gesture surface. The pane tracks gesture values. Bind the child presentation separately to apply a CSS transform from those Data values.


**Limits and lifecycle.** Parameters must be finite, min and step positive, and max at least min. An external parameter change cancels the gesture. A stationary gesture or cancellation does not call onEnd.


| Parameters | Contract |
| --- | --- |
| `x, y, rotate` | `{"binding":"read","default":0,"dtype":"R"}` |
| `zoom` | `{"binding":"read","default":1,"dtype":"R"}` |
| `min` | `{"binding":"read","default":0.5,"dtype":"R"}` |
| `max` | `{"binding":"read","default":3,"dtype":"R"}` |
| `step` | `{"binding":"read","default":0.01,"dtype":"R"}` |
| `onEnd` | `{"dtype":"T","nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-420-325"></a>
## Dialogs and floating windows


<a id="gc-420-140"></a>
<a id="gc-420-dialog"></a>
### `dialog`

Collection: layout. A modal window containing a framePane; remains modal when collapsed or maximized.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-dialog).


**Data contract.** Bind open, collapsed and maximized to retain window state in Data. Width, height, left and top accept CSS lengths and support writeback for user geometry changes. The expanded geometry is retained across collapse and maximize.


**Interaction and events.** The window publishes opened and closed. A close request calls the optional beforeClose Logic with reason and waits for its boolean decision. A pending decision deduplicates close requests, and an obsolete decision cannot close a later window session. Escape requests closure through the same guard.


**Composition.** Provide exactly one framePane child. Closing and reopening preserves the mounted frame, its controls and bindings.


**Limits and lifecycle.** The window remains modal while collapsed or maximized. Movement, resizing, collapse and maximize are opt-in. A non-boolean guard result leaves the dialog open and reports a diagnostic.

Shared contracts: [Window behavior and geometry](#gc-420-shared-windows).

No additional component-specific parameters.


Child grammar: `framePane`; parent grammar: `None`.

<a id="gc-420-145"></a>
<a id="gc-420-floatingpane"></a>
### `floatingPane`

Collection: layout. A nonmodal window containing a framePane.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-floatingpane).


**Data contract.** Bind open, collapsed and maximized to retain window state in Data. Width, height, left and top accept CSS lengths and support writeback for user geometry changes. The expanded geometry is retained across collapse and maximize.


**Interaction and events.** The window publishes opened and closed. A close request calls the optional beforeClose Logic with reason and waits for its boolean decision. A pending decision deduplicates close requests, and an obsolete decision cannot close a later window session. Activating a floating window raises it above its peers.


**Composition.** Provide exactly one framePane child. Closing and reopening preserves the mounted frame, its controls and bindings.


**Limits and lifecycle.** This window is nonmodal. Movement, resize and collapse default on, while maximize is opt-in. Disposal invalidates pending close decisions and releases interaction resources.

Shared contracts: [Window behavior and geometry](#gc-420-shared-windows).

No additional component-specific parameters.


Child grammar: `framePane`; parent grammar: `None`.
