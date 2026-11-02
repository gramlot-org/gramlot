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

Applies bound translation, rotation and scale to its retained content.

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
