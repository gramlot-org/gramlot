# Grids

Document ID: **GC-445**.

<a id="gc-445-start"></a>
## Start here

A grid displays rows from a Bag and columns from a Source struct or a separate structure Bag. Loading records is the responsibility of a selection store/provider. The grid itself is independent of SQL and Asqueel.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). Example body for `main(self, root)`:

```python
grid = root.grid(storepath="customers", rowMode="values", height="280px")
columns = grid.struct()
columns.column("name", name="Customer")
columns.column("seats", name="Seats", dtype="L")
```

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

```json
{"parameters":[],"accepts_var_keyword":false,"accepts_var_positional":false}
```

### `column`

Children: `''`. Parents: `struct,colgroup`.

```json
{"parameters":[{"name":"field","kind":"positional_or_keyword","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^[A-Za-z_][A-Za-z0-9_]*$","flags":0}]},"has_default":false},{"name":"name","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null},{"name":"dtype","kind":"keyword_only","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^(T|B|L|R|N|D|H|DHZ)$","flags":0}]},"has_default":true,"default":null},{"name":"width","kind":"keyword_only","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^[0-9]+([.][0-9]+)?(px|em|rem|ch|%)$","flags":0}]},"has_default":true,"default":null},{"name":"align","kind":"keyword_only","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^(start|center|end)$","flags":0}]},"has_default":true,"default":null},{"name":"format","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null},{"name":"white_space","kind":"keyword_only","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^(normal|nowrap|pre-wrap)$","flags":0}]},"has_default":true,"default":null},{"name":"edit","kind":"keyword_only","role":"attribute","annotation":{"kind":"union","items":[{"kind":"dtype","dtype":"B"},{"kind":"type","module":"builtins","name":"dict"}]},"has_default":true,"default":false}],"accepts_var_keyword":false,"accepts_var_positional":false}
```

### `colgroup`

Children: `column`. Parents: `struct`.

```json
{"parameters":[{"name":"code","kind":"positional_or_keyword","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^[A-Za-z_][A-Za-z0-9_]*$","flags":0}]},"has_default":false},{"name":"name","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null},{"name":"background","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null},{"name":"color","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null}],"accepts_var_keyword":false,"accepts_var_positional":false}
```
