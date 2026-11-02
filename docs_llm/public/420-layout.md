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

Use the shared Labelbox (`lbl`, `lbl_*`, `box_*`) around HTML or components. A `trayPane` owns card geometry and selection through its `storepath` Bag; moving/resizing its DOM must retain content and bindings. [Tray workspaces](105-components.md#gc-105-970). [Form state and editingStatus](340-components-and-collections-guide.md#gc-340-110) track local changes/errors/pending validation; accepting a local baseline is not a server save.

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
| `movable, resizable, collapsible` | `{"binding":"read","default":true,"dtype":"B"}` | floatingPane |

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


| Parameters | Contract |
| --- | --- |
| `columns` | `{"binding":"read","default":1,"dtype":["L","T"]}` |
| `col_min_width` | `{"binding":"read","dtype":"T","nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-420-160"></a>
<a id="gc-420-groupbox"></a>
### `groupBox`

Collection: layout. A labelled content group, optionally collapsible, with an optional Data copy command.

Shared contracts: [Labels and field presentation](#gc-420-shared-labels).


| Parameters | Contract |
| --- | --- |
| `copy` | `{"binding":"read","default":false,"dtype":"B"}` |
| `lbl_variant` | `{"binding":"read","default":"bar","dtype":"T","enum":["bar","underline","card"]}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-420-165"></a>
<a id="gc-420-contentpane"></a>
### `contentPane`

Collection: layout. A content area or a child region/panel of a layout container.

No additional component-specific parameters.


Child grammar: `*`; parent grammar: `None`.

<a id="gc-420-170"></a>
<a id="gc-420-bordercontainer"></a>
### `borderContainer`

Collection: layout. Five regions with optional splitters, drawers and nested layouts.

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


| Parameters | Contract |
| --- | --- |
| `storepath` | `{"dtype":"T"}` |
| `locked, gridVisible` | `{"binding":"read","default":false,"dtype":"B"}` |
| `gridStep` | `{"binding":"read","default":10,"dtype":"L"}` |
| `rotationStep` | `{"binding":"read","default":15,"dtype":"N"}` |

Child grammar: `*`; parent grammar: `None`.

Child parameters projected by the parent:

| Parameters | Contract |
| --- | --- |
| `closable` | `{"default":false,"dtype":"B"}` |
| `minWidth` | `{"default":100,"dtype":"N"}` |
| `minHeight` | `{"default":64,"dtype":"N"}` |

<a id="gc-420-410"></a>
<a id="gc-420-transformpane"></a>
### `transformPane`

Collection: layout. Applies bound translation, rotation and scale to its retained content.


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

Shared contracts: [Window behavior and geometry](#gc-420-shared-windows).

No additional component-specific parameters.


Child grammar: `framePane`; parent grammar: `None`.

<a id="gc-420-145"></a>
<a id="gc-420-floatingpane"></a>
### `floatingPane`

Collection: layout. A nonmodal window containing a framePane.

Shared contracts: [Window behavior and geometry](#gc-420-shared-windows).

No additional component-specific parameters.


Child grammar: `framePane`; parent grammar: `None`.
