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


<a id="gc-445-005"></a>
<a id="gc-445-010"></a>

Ordinary Source/CSS attributes remain in Writing pages and Themes and CSS.
Pages inherit environment collections; Page.gramlots adds missing ones. Buttons are built in.
Contract JSON omits only undeclared keys: no default is not the same as null. dtype: T text, B Boolean, L integer, R real, X structured value; remaining codes are TYTX. binding: read = Data to widget, write = widget to Data, twoWay = both. nullable permits None; enum restricts values; annotation preserves type/regex constraints. Parameters sharing a table row have exactly the same contract. Child grammar: * allows arbitrary Source children; empty permits none. Parent None means no declared restriction.


<a id="gc-445-430"></a>
## Grids and search


<a id="gc-445-365"></a>
<a id="gc-445-grid"></a>
### `grid`

Collection: grid. Virtualized Bag rows with a declarative column structure; database access belongs to the store/provider.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-grid).


**Data contract.** storepath identifies the row Bag. Explicit rowMode selects nested value Bags or row-node attributes. Resident grids share row identity and own independent order and filter. A windowed provider supplies windowInfo and loading and can consume viewport and sortRequest writes.


**Interaction and events.** Headers support ordering and column manipulation. Optional row headers, resizing and self-drag expose row operations. Double-click or Enter/F2 opens an editable cell, Enter commits, Tab moves and Escape discards unfinished text.


**Composition.** Provide one inline struct or an external structure Bag via structpath. The frameGrid recipe supplies toolbar and search composition. Local editors use ordinary Source controls in an enclosing form session or a standalone session.


**Limits and lifecycle.** Resident virtualization bounds rendered rows while the Bag stays resident. Windowed data needs a provider and local editing is resident-only. Local changes, drafts and errors survive viewport recycling. Database queries and durable writes belong to the application integration.


| Parameters | Contract |
| --- | --- |
| `windowInfo` | `{"binding":"read","default":null,"dtype":"X","nullable":true}` |
| `loading, rowHeaders, rowResize, selfDragRows` | `{"binding":"read","default":false,"dtype":"B"}` |
| `viewport` | `{"binding":"write","default":null,"dtype":"X","nullable":true}` |
| `sortRequest` | `{"binding":"write","default":"","dtype":"T"}` |
| `storepath, structpath, rowMode` | `{"dtype":"T"}` |
| `sortedBy` | `{"binding":"read","default":"","dtype":"T"}` |
| `filter` | `{"annotation":{"kind":"type","module":"builtins","name":"dict"},"binding":"read","default":null,"nullable":true}` |

Child grammar: `struct,div`; parent grammar: `None`.

<a id="gc-445-370"></a>
<a id="gc-445-searchbox"></a>
### `searchBox`

Collection: grid. Search control connected to the enclosing grid Source context.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-searchbox).


**Data contract.** searchOn chooses eligible columns. Accepted queries update the target view's filter. Bind searchTime to record elapsed filter evaluation time. The input draft stays local until it can be applied.


**Interaction and events.** Typing starts a short debounce and Enter applies immediately. Changing columns, Escape or Clear removes the filter. Invalid or incomplete expressions retain the last accepted filter.


**Composition.** Leaf control that resolves the grid through its FrameGrid recipient. Put it in the FrameGrid search composition.


**Limits and lifecycle.** Works against the resident view. Number and date syntax depends on the column type and locale. Removal cancels the timer and releases view subscriptions.


| Parameters | Contract |
| --- | --- |
| `searchOn` | `{"binding":"read","default":true,"dtype":["B","T"]}` |
| `searchTime` | `{"binding":"write","default":null,"dtype":"R","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-445-390"></a>
## Grid structure declarations

These are Source declarations, not additional browser components. Parameters below are the complete Python authoring signature; annotations retain regex restrictions. A missing default denotes a required argument.

### `struct`

Children: `column,colgroup`. Parents: `grid`.


**Data contract.** An inline declaration projects to a structure Bag before rendering. Use structpath to read a separately maintained structure instead.


**Interaction and events.** Grid header interactions can update the projected structure. Other grids sharing that Bag observe its changes. The declaration has no callback.


**Composition.** Grid declaration containing columns and column groups. It has no separate browser element.


**Limits and lifecycle.** Use one inline struct or an external structpath. Duplicate fields, unknown attributes and nested groups are rejected.

```json
{"parameters":[],"accepts_var_keyword":false,"accepts_var_positional":false}
```

### `column`

Children: `''`. Parents: `struct,colgroup`.


**Data contract.** The required field identifies a row field under the chosen rowMode. Metadata configures caption, type and presentation. Enable local editing with edit=True or an editor options dictionary.


**Interaction and events.** The grid handles header and cell interactions. The column supplies configuration for the projected header, cells and optional editor.


**Composition.** Leaf declaration inside struct or colgroup, without a separate browser element.


**Limits and lifecycle.** Field identity must be unique. Attribute names and values are validated. Formulas are outside the structure contract.

```json
{"parameters":[{"name":"field","kind":"positional_or_keyword","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^[A-Za-z_][A-Za-z0-9_]*$","flags":0}]},"has_default":false},{"name":"name","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null},{"name":"dtype","kind":"keyword_only","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^(T|B|L|R|N|D|H|DHZ)$","flags":0}]},"has_default":true,"default":null},{"name":"width","kind":"keyword_only","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^[0-9]+([.][0-9]+)?(px|em|rem|ch|%)$","flags":0}]},"has_default":true,"default":null},{"name":"max_height","kind":"keyword_only","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^[0-9]+([.][0-9]+)?(px|em|rem)$","flags":0}]},"has_default":true,"default":null},{"name":"align","kind":"keyword_only","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^(start|center|end)$","flags":0}]},"has_default":true,"default":null},{"name":"format","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null},{"name":"white_space","kind":"keyword_only","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^(normal|nowrap|pre-wrap)$","flags":0}]},"has_default":true,"default":null},{"name":"edit","kind":"keyword_only","role":"attribute","annotation":{"kind":"union","items":[{"kind":"dtype","dtype":"B"},{"kind":"type","module":"builtins","name":"dict"}]},"has_default":true,"default":false}],"accepts_var_keyword":false,"accepts_var_positional":false}
```

### `colgroup`

Children: `column`. Parents: `struct`.


**Data contract.** Supplies identity, caption and optional colors for a header band. Column membership belongs to the structure Bag.


**Interaction and events.** Moving columns can split or join contiguous header bands while preserving group membership. The group declares no callback.


**Composition.** Place directly under struct and put column declarations inside. The grid renders the group.


**Limits and lifecycle.** Groups cannot nest. Each member column still identifies its own row field.

```json
{"parameters":[{"name":"code","kind":"positional_or_keyword","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^[A-Za-z_][A-Za-z0-9_]*$","flags":0}]},"has_default":false},{"name":"name","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null},{"name":"background","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null},{"name":"color","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null}],"accepts_var_keyword":false,"accepts_var_positional":false}
```
