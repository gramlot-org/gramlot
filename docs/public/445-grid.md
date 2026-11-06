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

### External checkbox sets

A column can project an external Data string instead of editing a record:

[Code for this composition is in the appendix](465-widget-examples.md#gc-465-setup-grid).

Initialize `assignments.john` to `""`. `checked` is a required reactive Data path, resolved relative to the grid Source; `checkedField` is the row identity field. IDs are nonempty strings without commas. Each click adds or removes the ID in comma-separated text using literal wrapped `includes` membership; ordinary Data writes refresh all views. There is no regex or parallel Set cache. Customer records and their editing history are unchanged. A checked column cannot also declare an editor.

Add columns at runtime by inserting ordinary cell nodes with these attributes into the structure Bag. Removing a column retains its set. Offscreen and unloaded IDs remain in the string; individual-row toggles do not require a complete store. Ordinary search and field sorting exclude these external columns. Radio selection and bulk actions are not part of this increment. Set column `title` to the full name when `name` uses a compact caption such as J.

### Filter by external sets

Bind `setFilter` to a text value: `john` selects members of that checkbox column, `john,fred` intersects both sets, and an empty string removes only the set contribution. Names refer to external check column fields already declared in the structure. The view applies base `filter` AND the current search AND every selected set. Clearing search keeps the base and set criteria; clearing `setFilter` keeps base and search. Changes to a bound set immediately recompute the view without modifying records or memberships.

Set filtering requires a complete resident store: a grid with `windowInfo` rejects nonempty `setFilter`. There is no implicit fetch-all or filtering of only a loaded window. Unknown check columns are configuration errors. Unions, differences and remote set predicates remain outside this increment.

### Column value filters

Date columns additionally provide From/To using the shared date editor. Both bounds are inclusive, open ends are allowed, and From accepts periods through `period_to`. Changing the range selects all dates inside it; checkboxes refine that range. Clearing From clears To and preserves checked dates as explicit values. Reset removes both range and values. Invalid drafts and reversed bounds retain the accepted criterion. Datetime days follow the display convention (D/DH civil, DHZ page timezone).

Set `columnFilters=True` to add a compact filter button to ordinary column headers. The compact popup composes a shared grid (checkbox, value, row count), a search field and a shared menu toolbar. Search values filters only the inner grid using literal case-insensitive text; it never changes hidden selections or the main grid search. Click Value or Rows to sort the choices. Multiple values in one column combine with OR; columns combine with AND, together with the base filter, search and external set criteria.

Counts apply all criteria except the popup column's own selection. Selected values remain available even at zero rows. Null and empty text share the Empty choice. None accepts an empty selection (zero rows); Reset removes only that column's restriction. All explicitly selects all column values, including those hidden by the popup search. Row edits and set changes update counts without editing source records or rebuilding the grid.

Selections live in the Source-owned collection view: `columnFilter(field)` reads them, `applyColumnFilter(field, values)` accepts an array or null to remove the criterion, and `columnFacets(field)` returns `{key, value, count, selected}` entries. Numeric and text identities remain distinct. Only loaded scalar fields in complete resident stores are supported; windowed grids are rejected. Date periods, aggregate-cell membership and remote facets remain separate work.

### Row formulas and footer totals

This is an intermediate implementation. The final placement of row formulas and totals, at the data level or in the grid, is under review; the attributes below may move.

A data formula computes its field for every resident row and writes the result into the row Bag, so every grid and form on the same Bag sees it. Formula identifiers resolve to row fields and to `formula_<name>` parameters. A parameter written `^path` recalculates the formula when that Data changes; `=path` reads the current value without triggering; any other value is a literal. Paths resolve relative to the grid Source.

[Code for this composition is in the appendix](465-widget-examples.md#gc-465-setup-grid).

- `calculated=True` computes a data formula when the grid configures; otherwise it first runs when a dependency changes.
- Formulas run in dependency order; a dependency cycle rejects the structure.
- A formula recalculates when a committed value reaches the row Bag. Editing drafts do not trigger it.
- `hidden=True` hides a column; its formula still calculates.
- `#` (row number, from 1) and `+=field` (running sum) are view values: each grid computes them on the visible rows of its own view, in view order, and never writes them into the row Bag. A formula depending on a `#` or `+=` column is a view value too. While a filter, column filter or search is active, these cells and the `rowHeaders` numbers get the `filtered-numbering` class, with the `--gramlot-grid-filtered-numbering-background` theme color, because the numbering covers only the visible rows.
- Sorting, column-filtering or searching by a view value is an error: it derives from the order and has no stored field. View columns get no column filter button and are not offered by search. Totals of a view column sum its visible values.
- `%=field` (percentage of the column total over every resident row) is a data value written into the row Bag.
- An arithmetic formula (fields, numeric literals, `+ - * / % **` and parentheses) is evaluated without compiling code: with JavaScript number semantics on plain numbers, exactly when a referenced value is a Decimal. It works from an inline `struct` and from a `structpath` Bag.
- Any other formula is a JavaScript expression compiled as inline code: it runs only when declared in an inline `struct` received with the Source, and a page CSP without `'unsafe-eval'` blocks it. Over Decimal values only arithmetic formulas are supported.
- A null referenced value gives null. A failing formula writes null and keeps its error per field (`formulaErrors` of the grid element). An unchanged result is not written.
- A column accepts its declared attributes and `formula_<name>` keywords only; any other keyword is rejected while authoring.

Set grid `footer=True`, or a caption text, to display a footer row. A column `totalize=True` sums its field over every resident row, not only the displayed ones, and publishes the total to `.totalize.<field>` relative to the grid Source; a text value is the Data path to use. Booleans count as 0/1. Totals are published also without the footer row. `footer_value` is a fixed footer text, `footer_format` the footer number format. A total that cannot be computed is published as null, shows `—` with the error as tooltip and is kept in `totalErrors` of the grid element. Filtered totals are not published.

### Viewport outputs and editing events

`rowHeaders`, `rowResize` and `selfDragRows` enable their respective row affordances. `sortedBy` and `filter` are read inputs. For a windowed store, `windowInfo` and `loading` describe provider state, while bound `viewport` writes requested `{start, count}` and `sortRequest` writes an ordering request. Wire these outputs to the intended store/provider rather than loading every record in response to scrolling. A resident Bag, a cached remote selection and an authorized database query have different capabilities. Neither the grid nor an ordinary endpoint implies SQL or Asqueel access.

Enable local editing with `column(..., edit=True)` or an editor-options dictionary. Cells use ordinary Source controls and share the enclosing form session; a standalone editable grid owns its session. Double-click or Enter/F2 opens a cell; Enter confirms, Tab/Shift+Tab moves and Escape discards unfinished text. Scrolling can release editor DOM while preserving drafts, validation errors and pending checks in the session. Local `load`, `accept` and `restore` do not save database records. This remains a development-preview contract: remote-window editing, autosave, undo/redo and DB writes are not supplied by this local editing slice. See [forms and grids editing](340-components-and-collections-guide.md#gc-340-110).

### `searchBox` and `frameGrid`

Use `searchBox` for the grid's filtering UI. It requires a FrameGrid target resolved through Source context; it is not a free-standing text field with a `value` binding. The Python `frameGrid(...)` composition exposes `.grid`, `.top`, `.bottom`, `.left` and `.right`; put the search control in its toolbar. `frameGrid` is a helper, not another widget tag.

`frameGrid(...)` routes its keywords by list. An unprefixed keyword that the grid declares as a parameter (`footer`, `rowHeaders`, `rowResize`, `selfDragRows`, `sortedBy`, `filter`, `columnFilters`, …) goes to the grid; `storepath`, `rowMode` and `structpath` also go to the grid. Every other keyword (`datapath`, `node_label`, `id`, `height`, style attributes, …) goes to the frame, as does a name that the frame also accepts. `grid_<name>` forces any attribute onto the grid (for example `grid_datapath`, `grid_height`, `grid_class` or a style attribute) and `frame_<name>` onto the frame; the prefix is removed. Giving the same name twice (`footer` and `grid_footer`, `storepath` and `grid_storepath`) is an error. `grid_node_label`, `grid_frameTarget` and `grid_nodeId` are errors because frameGrid composes those grid attributes. The list follows the grid's declared parameters, so a new grid parameter is routed without changing `frameGrid`.

[Code for this composition is in the appendix](465-widget-examples.md#gc-465-setup-grid).

`searchLiteral=True` treats text punctuation literally instead of as a regular expression; accepted queries keep their original text. The column-filter popup uses this same searchBox and its shared theme CSS inside a frameGrid, without a separate input or search handler.

The column caption is an external Labelbox menu, not part of the input capsule. It uses the shared `lbl_value`/`lbl_values` mechanism.

`searchOn=True` exposes the available columns. An explicit column list can restrict choices; unknown fields are rejected. Typing applies filtering after a short pause and Enter applies immediately. Escape or the clear button clears it, and changing column clears the query. Invalid/incomplete expressions report an error and preserve the last accepted filter. Bind `searchTime` if the application wants the measured filter duration; this is an output, not the search text. The active view owns filtering and supplies the rows, so this control does not independently issue application database requests. Start with [grid composition and store responsibilities](445-grid.md#gc-445-start).

## Choose a component

- [`grid`](#gc-445-grid): Virtualized Bag rows with a declarative column structure; database access belongs to the store/provider.
- [`searchBox`](#gc-445-searchbox): Search control connected to the enclosing grid Source context.


<a id="gc-445-005"></a>
<a id="gc-445-010"></a>
Types: T text, B Boolean, L integer, R real, X structured value; other codes are TYTX. Binding: read = Data to widget; write = widget to Data; twoWay = both. A dash means no declared default/binding. None is a declared value. Constraints include enum, qualification, target and annotations. Tables describe component contracts; ordinary Source/CSS attributes are shared.


## Shared parameter contracts

Each widget below links only the shared contracts it supports. A shared name can have different types, defaults or bindings; separate rows preserve those differences.


<a id="gc-445-230"></a>
<a id="gc-445-shared-labels"></a>
## Labels and field presentation

lbl supplies a field label; lbl_position places it. The lbl_* and box_* style families are described in [Themes and CSS](096-themes-and-css.md).

Applies to: [searchBox](#gc-445-searchbox).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `lbl` | T or None | — | read | qualification="intl_str" | All listed above |
| `lbl_position` | T | 'L' | read | — | All listed above |

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


**Limits and lifecycle.** Resident virtualization bounds rendered rows while the Bag stays resident. Windowed data needs a provider and local editing is resident-only. Local changes, drafts and errors survive viewport recycling. footer displays the footer row; column totals cover every resident row. Database queries and durable writes belong to the application integration.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `columnFilters` | B | False | read | — |
| `setFilter` | T | '' | read | — |
| `windowInfo` | X or None | None | read | — |
| `loading` | B | False | read | — |
| `viewport` | X or None | None | write | — |
| `sortRequest` | T | '' | write | — |
| `storepath` | T | — | — | — |
| `structpath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `rowHeaders` | B | False | read | — |
| `footer` | B / T | False | read | — |
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


**Data contract.** searchOn chooses eligible columns. searchLiteral=True uses literal case-insensitive text matching; the default retains regular expressions. Accepted queries update only the target view's search contribution, in AND with its base filter and setFilter; clearing search preserves both. Bind searchTime to record elapsed filter evaluation time. The input draft stays local until it can be applied.


**Interaction and events.** Typing starts a short debounce and Enter applies immediately. Changing columns, Escape or Clear removes the filter. Invalid or incomplete expressions retain the last accepted filter.


**Composition.** Leaf control that resolves the grid through its FrameGrid recipient. Put it in the FrameGrid search composition.


**Limits and lifecycle.** Works against the resident view. Number and date syntax depends on the column type and locale. Removal cancels the timer and releases view subscriptions.

Shared contracts: [Labels and field presentation](#gc-445-shared-labels).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |
| `searchLiteral` | B | False | read | — |
| `searchHelp` | B | False | read | — |
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


**Limits and lifecycle.** Use one inline struct or an external structpath. Duplicate fields, unknown attributes and nested groups are rejected. External sets use check=multiple, checked=^DataPath and checkedField=identityField. Initialize the Data value to an empty string; nonempty text IDs without commas are stored as comma-separated strings. Literal comma-wrapped includes checks membership. Each toggle writes Data and refreshes all views without editing records. Dynamic columns observe the structure Bag; removing a column keeps its set. Offscreen IDs survive. External set columns cannot have editors and are excluded from ordinary field sorting/search; check=single uses a radio and writes one scalar ID to checked without editing supplier rows. It supports partial stores, retains filtered/offscreen choices and never toggles off the selected radio. Text and numeric identities retain their type. Bulk actions are not implemented. A read-bound setFilter string names external check columns: john,fred means intersection, empty removes only the set contribution. Base filter, search and setFilter combine with AND. Set Data changes immediately update the view. Nonempty setFilter requires a complete resident store; windowInfo and unknown check columns are rejected. Column title retains the full tooltip/accessibility name when name is abbreviated. columnFilters=True enables distinct-value header popups on complete resident stores: OR within each column, AND across columns/base/search/sets. Counts exclude only their own column selection. Empty groups null and empty text; zero-count selections persist. None differs from Reset. The popup reuses the shared grid and menu toolbar; its literal search filters only the choices and preserves hidden selections. All/None apply to the entire choice list. Accepted criteria live in the Source-owned collection view; row edits update counts. Date columns add inclusive From/To and period entry; range AND values is one column criterion. Changing range selects all matching dates; clearing From clears To but preserves selected dates. Reset clears both. Invalid drafts retain the accepted filter.

Additional positional arguments: `False`; additional keyword arguments: `False`.

No parameters.


### `column`

Children: `''`. Parents: `struct,colgroup`.


**Data contract.** The required field identifies a row field under the chosen rowMode. Metadata configures caption, type and presentation. Enable local editing with edit=True or an editor options dictionary.


**Interaction and events.** The grid handles header and cell interactions. The column supplies configuration for the projected header, cells and optional editor.


**Composition.** Leaf declaration inside struct or colgroup, without a separate browser element.


**Limits and lifecycle.** Field identity must be unique. Attribute names and values are validated. formula, formula_<name>, calculated and hidden compute row fields (# and += per grid on its visible rows, never written; sorting, filtering or searching them is an error); totalize, footer_value and footer_format configure totals. Other unknown keywords are rejected. Formulas and totals are an intermediate implementation whose final placement (data level or grid) is under review.

Additional positional arguments: `False`; additional keyword arguments: `True`.

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
| `check` | keyword_only | T | None | [] |
| `checked` | keyword_only | T | None | [] |
| `checkedField` | keyword_only | T | None | [] |
| `title` | keyword_only | T | None | [] |
| `formula` | keyword_only | T | None | [] |
| `calculated` | keyword_only | B | None | [] |
| `hidden` | keyword_only | B | None | [] |
| `totalize` | keyword_only | B / T | None | [] |
| `footer_value` | keyword_only | T | None | [] |
| `footer_format` | keyword_only | T | None | [] |
| `attr` | var_keyword | {"kind":"any"} | **required** | [] |

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
