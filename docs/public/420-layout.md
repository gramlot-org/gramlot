# Layout and windows

Document ID: **GC-420**.

<a id="gc-420-start"></a>
## Start here

Choose `formlet` for aligned fields, `borderContainer` for regions, `tabContainer` for selectable panels and `framePane` for reusable toolbar/content compositions. `dialog` is modal; `floatingPane` keeps the rest of the page usable.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). Example body for `main(self, root)`:

```python
tabs = root.tabContainer(height="240px")
for key, title in (("details", "Details"), ("notes", "Notes")):
    panel = tabs.contentPane(node_label=key, title=title, datapath=key)
    panel.textbox(value="^.text", lbl=title)
```

This example also uses the inputs collection. Distinct relative datapaths isolate each panel's Data. `title` is a child parameter projected by the tab container, not a textbox parameter. See [containers](105-components.md#gc-105-085).

Use the shared Labelbox (`lbl`, `lbl_*`, `box_*`) around HTML or components. A `trayPane` owns card geometry and selection through its `storepath` Bag; moving/resizing its DOM must retain content and bindings. [Tray workspaces](105-components.md#gc-105-970). `transformPane` metadata declares read bindings, but user gestures write simple reactive `^` pointers during interaction; `onEnd` receives final values. [Form state and editingStatus](340-components-and-collections-guide.md#gc-340-110) track local changes/errors/pending validation; accepting a local baseline is not a server save.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)

## Compose retained content and bind only the state you need

`formlet` arranges labelled fields on a grid; choose a positive `columns` count,
a CSS track list or `col_min_width` for fitting columns. It controls presentation,
not record persistence. `groupBox` supplies a labelled Data scope and visual grouping
with bar, underline or card headers; its `copy` capability is separate from saving
a record. `contentPane` is the general content holder used by region compositions.
See [forms and groups](105-components.md#gc-105-085).

`borderContainer` arranges content panes in unique top, bottom, left, right and
center regions. `framePane` adds convenient region builders (`frame.top`,
`frame.center`, etc.) and is the frame used for command recipients. Put `region`
and the relevant width/height on its children. Splitters and drawers belong to
this shared layout, preserving child Source and bindings during resizing or
opening. `design="headline"` and `design="sidebar"` select region precedence;
`persist` concerns layout state, not the application document. See
[border layout](105-components.md#gc-105-100) and
[frames](350-menus-toolbars-and-windows.md#gc-350-035).

Choose `stackContainer` to show one panel without a tab strip, or `tabContainer`
to expose the selection as tabs. Bind `selectedPage` to a child's unique
`pageName`, or `selected` to its index. Normal selection preserves Source, editor
instances and Data. Tabs add titles, `tabPosition`, `tabAlign` and `tabMode`.
Selection publications use the same contract for clicks, keyboard and Data-driven
changes. A closable direct panel may provide synchronous Boolean `onClose`:
false vetoes the close. An accepted close removes the panel Source, keeps its
application Data and emits `closing`/`closed`; ordinary switching does not remove
it. An asynchronous close guard is not provided. See
[panel lifecycle](105-components.md#gc-105-110).

Use `dialog` for a modal window and `floatingPane` for a nonmodal window; each
contains a `framePane`. Bind `open`, `collapsed`, `maximized` and geometry when
application state must reflect those operations. A dialog remains modal when
collapsed or maximized. Floating panes default to movable/resizable/collapsible;
dialogs do not. `closable`, `maximizable`, minimum dimensions and `beforeClose`
express the window contract; closing a window is not a record save. See
[windows](350-menus-toolbars-and-windows.md) and the shared window parameters below.

`trayPane` is a workspace for labelled direct children with stable `node_label`
keys. Its `storepath` points to a layout Bag containing position, dimensions,
layer, selection, rotation and scale. The tray owns move/resize; do not add a
second movable/resizable system to the cards. Pointer operations retain content
and editor bindings. Same-layer transformed rectangles stop at contact; separate
layers may overlap. Shift enables `gridStep` and `rotationStep` snapping;
`gridVisible` only changes presentation. `locked` disables layout editing while
keeping card contents usable. Closing a closable card removes its Source and its
layout row. Saving/restoring the layout is an explicit application Data operation.
See [tray workspaces](105-components.md#gc-105-970).

`transformPane` applies `x`, `y`, `rotate` and `zoom` to retained content. Their
metadata declares read bindings, but gestures also write changes through simple
reactive `^` pointers as they happen. `onEnd` receives `{x, y, rotate, zoom}` after
a changed gesture completes; it is not required for those Data updates. `min`,
`max` and `step` configure zoom. Use the component for transformed content and the
tray for multi-card arrangement; neither implies automatic durable persistence.

## Choose a component

- [`transformPane`](#gc-420-transformpane): Applies translation, rotation and scale to retained content. Gestures write simple reactive pointers despite read-only binding metadata; onEnd reports final values.
- [`dialog`](#gc-420-dialog): A modal window containing a framePane; remains modal when collapsed or maximized.
- [`floatingPane`](#gc-420-floatingpane): A nonmodal window containing a framePane.
- [`framePane`](#gc-420-framepane): A border composition exposing top, bottom, left, right and center region builders.
- [`trayPane`](#gc-420-traypane): Data-owned arrangement of labelled live cards with selection, movement, resize, layers, rotation, zoom and snapping.
- [`formlet`](#gc-420-formlet): Responsive field layout with shared label alignment.
- [`groupBox`](#gc-420-groupbox): A labelled content group, optionally collapsible, with an optional Data copy command.
- [`contentPane`](#gc-420-contentpane): A content area or a child region/panel of a layout container.
- [`borderContainer`](#gc-420-bordercontainer): Five regions with optional splitters, drawers and nested layouts.
- [`stackContainer`](#gc-420-stackcontainer): One selected panel at a time, without a tab strip.
- [`tabContainer`](#gc-420-tabcontainer): Selected panels with shaped or underlined tabs on any side.


<a id="gc-420-005"></a>
<a id="gc-420-010"></a>
Types: T text, B Boolean, L integer, R real, X structured value; other codes are TYTX. Binding: read = Data to widget; write = widget to Data; twoWay = both. A dash means no declared default/binding. None is a declared value. Constraints include enum, qualification, target and annotations. Tables describe component contracts; ordinary Source/CSS attributes are shared.


## Shared parameter contracts

Each widget below links only the shared contracts it supports. A shared name can have different types, defaults or bindings; separate rows preserve those differences.


<a id="gc-420-230"></a>
<a id="gc-420-shared-labels"></a>
## Labels and field presentation

lbl supplies a field label; lbl_position places it. The lbl_* and box_* style families are described in [Themes and CSS](096-themes-and-css.md).

Applies to: [groupBox](#gc-420-groupbox).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `lbl` | T or None | — | read | qualification="intl_str" | All listed above |
| `lbl_position` | T | 'TL' | read | enum=['TL', 'TC', 'TR', 'L', 'R', 'BL', 'BC', 'BR'] | All listed above |

<a id="gc-420-255"></a>
<a id="gc-420-shared-windows"></a>
## Window behavior and geometry

Dialog and floatingPane share controls, geometry and state. Their movement, resize and collapse defaults differ as shown below. Dialog remains modal, including when collapsed or maximized. See [Windows](350-menus-toolbars-and-windows.md).

Applies to: [dialog](#gc-420-dialog), [floatingPane](#gc-420-floatingpane).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `title` | T | '' | read | — | All listed above |
| `open` | B | False | twoWay | — | All listed above |
| `collapsed` | B | False | twoWay | — | All listed above |
| `closable` | B | True | read | — | All listed above |
| `movable` | B | False | read | — | [dialog](#gc-420-dialog) |
| `resizable` | B | False | read | — | [dialog](#gc-420-dialog) |
| `collapsible` | B | False | read | — | [dialog](#gc-420-dialog) |
| `maximizable` | B | False | read | — | All listed above |
| `maximized` | B | False | twoWay | — | All listed above |
| `beforeClose` | T or None | — | — | — | All listed above |
| `width` | T or None | — | twoWay | — | All listed above |
| `height` | T or None | — | twoWay | — | All listed above |
| `left` | T or None | — | twoWay | — | All listed above |
| `top` | T or None | — | twoWay | — | All listed above |
| `minWidth` | T or None | — | read | — | All listed above |
| `minHeight` | T or None | — | read | — | All listed above |
| `movable` | B | True | read | — | [floatingPane](#gc-420-floatingpane) |
| `resizable` | B | True | read | — | [floatingPane](#gc-420-floatingpane) |
| `collapsible` | B | True | read | — | [floatingPane](#gc-420-floatingpane) |

<a id="gc-420-260"></a>
<a id="gc-420-shared-regions"></a>
## Border and frame regions

BorderContainer and framePane share region arrangement and persistence. Child region parameters stay with each parent below. See [Containers](105-components.md#gc-105-085).

Applies to: [framePane](#gc-420-framepane), [borderContainer](#gc-420-bordercontainer).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `design` | T | 'headline' | read | enum=['headline', 'sidebar'] | All listed above |
| `persist` | B | False | read | — | All listed above |

<a id="gc-420-265"></a>
<a id="gc-420-shared-selection"></a>
## Panel selection

StackContainer and tabContainer select one child panel; selectedPage uses its page name and selected its index. See [Containers](105-components.md#gc-105-085).

Applies to: [stackContainer](#gc-420-stackcontainer), [tabContainer](#gc-420-tabcontainer).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `selectedPage` | T or None | None | twoWay | — | All listed above |
| `selected` | L or None | None | twoWay | — | All listed above |

<a id="gc-420-320"></a>
## Forms and containers


<a id="gc-420-155"></a>
<a id="gc-420-formlet"></a>
### `formlet`

Responsive field layout with shared label alignment.

Collection: **layout**. Browser element: `gramlot-formlet`.

[Forms, borders, panels and tabs](105-components.md#gc-105-085).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `columns` | L / T | 1 | read | — |
| `col_min_width` | T or None | — | read | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-420-160"></a>
<a id="gc-420-groupbox"></a>
### `groupBox`

A labelled content group, optionally collapsible, with an optional Data copy command.

Collection: **layout**. Browser element: `gramlot-group-box`.

[Forms, borders, panels and tabs](105-components.md#gc-105-085).

Shared contracts: [Labels and field presentation](#gc-420-shared-labels).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `copy` | B | False | read | — |
| `lbl_variant` | T | 'bar' | read | enum=['bar', 'underline', 'card'] |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-420-165"></a>
<a id="gc-420-contentpane"></a>
### `contentPane`

A content area or a child region/panel of a layout container.

Collection: **layout**. Browser element: `gramlot-content-pane`.

[Forms, borders, panels and tabs](105-components.md#gc-105-085).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-420-170"></a>
<a id="gc-420-bordercontainer"></a>
### `borderContainer`

Five regions with optional splitters, drawers and nested layouts.

Collection: **layout**. Browser element: `gramlot-border-container`.

[Forms, borders, panels and tabs](105-components.md#gc-105-085).

Shared contracts: [Border and frame regions](#gc-420-shared-regions).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

Parameters projected by this parent from its children:
| Child parameter | Contract |
| --- | --- |
| `detachable` | `{"default": false, "dtype": "B"}` |
| `title` | `{"default": "", "dtype": "T"}` |
| `region` | `{"enum": ["top", "bottom", "left", "right", "center"], "required": true, "unique": true}` |
| `width` | `{}` |
| `height` | `{}` |
| `drawer_onclick` | `{"inline": ["evt", "show"]}` |

<a id="gc-420-150"></a>
<a id="gc-420-framepane"></a>
### `framePane`

A border composition exposing top, bottom, left, right and center region builders.

Collection: **layout**. Browser element: `gramlot-frame-pane`.

[Window and frame composition](350-menus-toolbars-and-windows.md).

Shared contracts: [Border and frame regions](#gc-420-shared-regions).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `contentPane`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

Parameters projected by this parent from its children:
| Child parameter | Contract |
| --- | --- |
| `detachable` | `{"default": false, "dtype": "B"}` |
| `title` | `{"default": "", "dtype": "T"}` |
| `region` | `{"enum": ["top", "bottom", "left", "right", "center"], "required": true, "unique": true}` |
| `width` | `{}` |
| `height` | `{}` |
| `drawer_onclick` | `{"inline": ["evt", "show"]}` |

<a id="gc-420-175"></a>
<a id="gc-420-stackcontainer"></a>
### `stackContainer`

One selected panel at a time, without a tab strip.

Collection: **layout**. Browser element: `gramlot-stack-container`.

[Forms, borders, panels and tabs](105-components.md#gc-105-085).

Shared contracts: [Panel selection](#gc-420-shared-selection).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

Parameters projected by this parent from its children:
| Child parameter | Contract |
| --- | --- |
| `pageName` | `{"dtype": "T", "nullable": true, "unique": true}` |
| `title` | `{"default": "", "dtype": "T"}` |
| `onClose` | `{"inline": []}` |

<a id="gc-420-180"></a>
<a id="gc-420-tabcontainer"></a>
### `tabContainer`

Selected panels with shaped or underlined tabs on any side.

Collection: **layout**. Browser element: `gramlot-tab-container`.

[Forms, borders, panels and tabs](105-components.md#gc-105-085).

Shared contracts: [Panel selection](#gc-420-shared-selection).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `tabMode` | T | 'tabs' | read | enum=['tabs', 'underline'] |
| `tabPosition` | T | 'top' | read | enum=['top', 'bottom', 'left', 'right'] |
| `tabAlign` | T | 'start' | read | enum=['start', 'center', 'end'] |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

Parameters projected by this parent from its children:
| Child parameter | Contract |
| --- | --- |
| `pageName` | `{"dtype": "T", "nullable": true, "unique": true}` |
| `title` | `{"default": "", "dtype": "T", "required": true}` |
| `onClose` | `{"inline": []}` |
| `detachable` | `{"dtype": "B"}` |

<a id="gc-420-405"></a>
<a id="gc-420-traypane"></a>
### `trayPane`

Data-owned arrangement of labelled live cards with selection, movement, resize, layers, rotation, zoom and snapping.

Collection: **layout**. Browser element: `gramlot-tray-pane`.

[Tray workspaces and shared Labelboxes](105-components.md#gc-105-970).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `storepath` | T | — | — | — |
| `locked` | B | False | read | — |
| `gridStep` | L | 10 | read | — |
| `gridVisible` | B | False | read | — |
| `rotationStep` | N | 15 | read | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

Parameters projected by this parent from its children:
| Child parameter | Contract |
| --- | --- |
| `closable` | `{"default": false, "dtype": "B"}` |
| `minWidth` | `{"default": 100, "dtype": "N"}` |
| `minHeight` | `{"default": 64, "dtype": "N"}` |

<a id="gc-420-410"></a>
<a id="gc-420-transformpane"></a>
### `transformPane`

Applies translation, rotation and scale to retained content. Gestures write simple reactive pointers despite read-only binding metadata; onEnd reports final values.

Collection: **layout**. Browser element: `gramlot-transform-pane`.

[Forms, borders, panels and tabs](105-components.md#gc-105-085).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `x` | R | 0 | read | — |
| `y` | R | 0 | read | — |
| `rotate` | R | 0 | read | — |
| `zoom` | R | 1 | read | — |
| `min` | R | 0.5 | read | — |
| `max` | R | 3 | read | — |
| `step` | R | 0.01 | read | — |
| `onEnd` | T or None | — | — | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-420-325"></a>
## Dialogs and floating windows


<a id="gc-420-140"></a>
<a id="gc-420-dialog"></a>
### `dialog`

A modal window containing a framePane; remains modal when collapsed or maximized.

Collection: **layout**. Browser element: `gramlot-dialog`.

[Window and frame composition](350-menus-toolbars-and-windows.md).

Shared contracts: [Window behavior and geometry](#gc-420-shared-windows).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `framePane`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-420-145"></a>
<a id="gc-420-floatingpane"></a>
### `floatingPane`

A nonmodal window containing a framePane.

Collection: **layout**. Browser element: `gramlot-floating-pane`.

[Window and frame composition](350-menus-toolbars-and-windows.md).

Shared contracts: [Window behavior and geometry](#gc-420-shared-windows).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `framePane`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.
