# Grids

Document ID: **GC-445**.

<a id="gc-445-start"></a>
## Start here

A grid displays rows from a Bag and columns from a Source struct or a separate structure Bag. Loading records is the responsibility of a selection store/provider. The grid itself is independent of SQL and Asqueel.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-grid).

Load `customers` with a Bag whose row nodes contain Bags with `name` and `seats` fields. `storepath` and `rowMode` are required. Use `values` for nested row Bags or `attributes` for rows whose fields are node attributes; these representations are explicit, not guessed. Declare an inline `struct` or use `structpath`, not both.

`frameGrid(...)` is a Python composition helper: it returns a frame with `.grid`, `.top`, `.bottom`, `.left` and `.right` for ordinary Source controls. `searchBox` requires a grid Source context; place it in that composition's toolbar.

Columns are described below, including nested column groups and validation constraints. Column editing uses the shared field/form contract; see [local editing](340-components-and-collections-guide.md#gc-340-110). A resident Bag, server-backed cached selection and database query are different store capabilities. Generic endpoints remain application-owned; Asqueel-only query options require the Asqueel host and its authorization policy. No DB access is implied by `grid`. Viewport output is for the configured store/provider, not an instruction to fetch every row.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)

## Separate rows, columns and the data provider

`grid` renders a Bag through a virtualized viewport. Choose it for tabular rows requiring declarative columns, ordering, filtering or local cell editing. It does not load database records by itself. Initialize `storepath` with the appropriate Bag and explicitly select `rowMode="values"` for nested row Bags or `rowMode="attributes"` for fields stored on row-node attributes. The representation is required and is not inferred.

Columns come from one inline `struct` or a structure Bag addressed by `structpath`; do not declare both. `struct`, `column` and `colgroup` are Source declarations, not additional browser widgets. A `column` requires its `field`; `name` is its caption and `dtype` describes field type. Widths, alignment and formatting configure presentation. A `colgroup` groups columns beneath a named header and may set group colors. The [structure reference](445-grid.md#gc-445-390) lists the exact permitted names and value formats.

[Code for this composition is in the appendix](465-widget-examples.md#gc-465-setup-grid).

### Viewport outputs and editing events

`rowHeaders`, `rowResize` and `selfDragRows` enable their respective row affordances. `sortedBy` and `filter` are read inputs. For a windowed store, `windowInfo` and `loading` describe provider state, while bound `viewport` writes requested `{start, count}` and `sortRequest` writes an ordering request. Wire these outputs to the intended store/provider rather than loading every record in response to scrolling. A resident Bag, a cached remote selection and an authorized database query have different capabilities. Neither the grid nor an ordinary endpoint implies SQL or Asqueel access.

Enable local editing with `column(..., edit=True)` or an editor-options dictionary. Cells use ordinary Source controls and share the enclosing form session; a standalone editable grid owns its session. Double-click or Enter/F2 opens a cell; Enter confirms, Tab/Shift+Tab moves and Escape discards unfinished text. Scrolling can release editor DOM while preserving drafts, validation errors and pending checks in the session. Local `load`, `accept` and `restore` do not save database records. This remains a development-preview contract: remote-window editing, autosave, undo/redo and DB writes are not supplied by this local editing slice. See [forms and grids editing](340-components-and-collections-guide.md#gc-340-110).

### `searchBox` and `frameGrid`

Use `searchBox` for the grid's filtering UI. It requires a FrameGrid target resolved through Source context; it is not a free-standing text field with a `value` binding. The Python `frameGrid(...)` composition exposes `.grid`, `.top`, `.bottom`, `.left` and `.right`; put the search control in its toolbar. `frameGrid` is a helper, not another widget tag.

`searchOn=True` exposes the available columns. An explicit column list can restrict choices; unknown fields are rejected. Typing applies filtering after a short pause and Enter applies immediately. Escape or the clear button clears it, and changing column clears the query. Invalid/incomplete expressions report an error and preserve the last accepted filter. Bind `searchTime` if the application wants the measured filter duration; this is an output, not the search text. The active view owns filtering and supplies the rows, so this control does not independently issue application database requests. Start with [grid composition and store responsibilities](445-grid.md#gc-445-start).

## Choose a component

- [`grid`](#gc-445-grid): Virtualized Bag rows with a declarative column structure; database access belongs to the store/provider.
- [`searchBox`](#gc-445-searchbox): Search control connected to the enclosing grid Source context.


<a id="gc-445-005"></a>
<a id="gc-445-010"></a>
Types: T text, B Boolean, L integer, R real, X structured value; other codes are TYTX. Binding: read = Data to widget; write = widget to Data; twoWay = both. A dash means no declared default/binding. None is a declared value. Constraints include enum, qualification, target and annotations. Tables describe component contracts; ordinary Source/CSS attributes are shared.


## Shared parameter contracts

Each widget below links only the shared contracts it supports. A shared name can have different types, defaults or bindings; separate rows preserve those differences.


<a id="gc-445-430"></a>
## Grids and search


<a id="gc-445-365"></a>
<a id="gc-445-grid"></a>
### `grid`

Virtualized Bag rows with a declarative column structure; database access belongs to the store/provider.

Collection: **grid**. Browser element: `gramlot-grid`.

[Bag rows, column structure and selection stores](445-grid.md#gc-445-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-grid).


**Data contract.** storepath identifies the row Bag. Explicit rowMode selects nested value Bags or row-node attributes. Resident grids share row identity and own independent order and filter. A windowed provider supplies windowInfo and loading and can consume viewport and sortRequest writes.


**Interaction and events.** Headers support ordering and column manipulation. Optional row headers, resizing and self-drag expose row operations. Double-click or Enter/F2 opens an editable cell, Enter commits, Tab moves and Escape discards unfinished text.


**Composition.** Provide one inline struct or an external structure Bag via structpath. The frameGrid recipe supplies toolbar and search composition. Local editors use ordinary Source controls in an enclosing form session or a standalone session.


**Limits and lifecycle.** Resident virtualization bounds rendered rows while the Bag stays resident. Windowed data needs a provider and local editing is resident-only. Local changes, drafts and errors survive viewport recycling. Database queries and durable writes belong to the application integration.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `windowInfo` | X or None | None | read | — |
| `loading` | B | False | read | — |
| `viewport` | X or None | None | write | — |
| `sortRequest` | T | '' | write | — |
| `storepath` | T | — | — | — |
| `structpath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `rowHeaders` | B | False | read | — |
| `rowResize` | B | False | read | — |
| `selfDragRows` | B | False | read | — |
| `sortedBy` | T | '' | read | — |
| `filter` | dict or None | None | read | annotation={"kind": "type", "module": "builtins", "name": "dict"} |

Child grammar: `struct,div`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-445-370"></a>
<a id="gc-445-searchbox"></a>
### `searchBox`

Search control connected to the enclosing grid Source context.

Collection: **grid**. Browser element: `gramlot-search-box`.

[Bag rows, column structure and selection stores](445-grid.md#gc-445-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-searchbox).


**Data contract.** searchOn chooses eligible columns. Accepted queries update the target view's filter. Bind searchTime to record elapsed filter evaluation time. The input draft stays local until it can be applied.


**Interaction and events.** Typing starts a short debounce and Enter applies immediately. Changing columns, Escape or Clear removes the filter. Invalid or incomplete expressions retain the last accepted filter.


**Composition.** Leaf control that resolves the grid through its FrameGrid recipient. Put it in the FrameGrid search composition.


**Limits and lifecycle.** Works against the resident view. Number and date syntax depends on the column type and locale. Removal cancels the timer and releases view subscriptions.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `searchOn` | B / T | True | read | — |
| `searchTime` | R or None | None | write | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-445-390"></a>
## Grid structure declarations

These are Source declarations, not additional browser components. Parameters below are the complete Python authoring signature; annotations retain regex restrictions. A missing default denotes a required argument.

### `struct`

Children: `column,colgroup`. Parents: `grid`.


**Data contract.** An inline declaration projects to a structure Bag before rendering. Use structpath to read a separately maintained structure instead.


**Interaction and events.** Grid header interactions can update the projected structure. Other grids sharing that Bag observe its changes. The declaration has no callback.


**Composition.** Grid declaration containing columns and column groups. It has no separate browser element.


**Limits and lifecycle.** Use one inline struct or an external structpath. Duplicate fields, unknown attributes and nested groups are rejected.

Additional positional arguments: `False`; additional keyword arguments: `False`.

No parameters.


### `column`

Children: `''`. Parents: `struct,colgroup`.


**Data contract.** The required field identifies a row field under the chosen rowMode. Metadata configures caption, type and presentation. Enable local editing with edit=True or an editor options dictionary.


**Interaction and events.** The grid handles header and cell interactions. The column supplies configuration for the projected header, cells and optional editor.


**Composition.** Leaf declaration inside struct or colgroup, without a separate browser element.


**Limits and lifecycle.** Field identity must be unique. Attribute names and values are validated. Formulas are outside the structure contract.

Additional positional arguments: `False`; additional keyword arguments: `False`.

| Parameter | Passing | Type | Default | Constraints |
| --- | --- | --- | --- | --- |
| `field` | positional_or_keyword | T | **required** | [{"kind":"regex","pattern":"^[A-Za-z_][A-Za-z0-9_]*$","flags":0}] |
| `name` | keyword_only | T | None | [] |
| `dtype` | keyword_only | T | None | [{"kind":"regex","pattern":"^(T&#124;B&#124;L&#124;R&#124;N&#124;D&#124;H&#124;DHZ)$","flags":0}] |
| `width` | keyword_only | T | None | [{"kind":"regex","pattern":"^[0-9]+([.][0-9]+)?(px&#124;em&#124;rem&#124;ch&#124;%)$","flags":0}] |
| `max_height` | keyword_only | T | None | [{"kind":"regex","pattern":"^[0-9]+([.][0-9]+)?(px&#124;em&#124;rem)$","flags":0}] |
| `align` | keyword_only | T | None | [{"kind":"regex","pattern":"^(start&#124;center&#124;end)$","flags":0}] |
| `format` | keyword_only | T | None | [] |
| `white_space` | keyword_only | T | None | [{"kind":"regex","pattern":"^(normal&#124;nowrap&#124;pre-wrap)$","flags":0}] |
| `edit` | keyword_only | B / dict | False | [] |

### `colgroup`

Children: `column`. Parents: `struct`.


**Data contract.** Supplies identity, caption and optional colors for a header band. Column membership belongs to the structure Bag.


**Interaction and events.** Moving columns can split or join contiguous header bands while preserving group membership. The group declares no callback.


**Composition.** Place directly under struct and put column declarations inside. The grid renders the group.


**Limits and lifecycle.** Groups cannot nest. Each member column still identifies its own row field.

Additional positional arguments: `False`; additional keyword arguments: `False`.

| Parameter | Passing | Type | Default | Constraints |
| --- | --- | --- | --- | --- |
| `code` | positional_or_keyword | T | **required** | [{"kind":"regex","pattern":"^[A-Za-z_][A-Za-z0-9_]*$","flags":0}] |
| `name` | keyword_only | T | None | [] |
| `background` | keyword_only | T | None | [] |
| `color` | keyword_only | T | None | [] |
