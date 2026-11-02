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

Additional positional arguments: `False`; additional keyword arguments: `False`.

No parameters.


### `column`

Children: `''`. Parents: `struct,colgroup`.

Additional positional arguments: `False`; additional keyword arguments: `False`.

| Parameter | Passing | Type | Default | Constraints |
| --- | --- | --- | --- | --- |
| `field` | positional_or_keyword | T | **required** | [{"kind":"regex","pattern":"^[A-Za-z_][A-Za-z0-9_]*$","flags":0}] |
| `name` | keyword_only | T | None | [] |
| `dtype` | keyword_only | T | None | [{"kind":"regex","pattern":"^(T&#124;B&#124;L&#124;R&#124;N&#124;D&#124;H&#124;DHZ)$","flags":0}] |
| `width` | keyword_only | T | None | [{"kind":"regex","pattern":"^[0-9]+([.][0-9]+)?(px&#124;em&#124;rem&#124;ch&#124;%)$","flags":0}] |
| `align` | keyword_only | T | None | [{"kind":"regex","pattern":"^(start&#124;center&#124;end)$","flags":0}] |
| `format` | keyword_only | T | None | [] |
| `white_space` | keyword_only | T | None | [{"kind":"regex","pattern":"^(normal&#124;nowrap&#124;pre-wrap)$","flags":0}] |
| `edit` | keyword_only | B / dict | False | [] |

### `colgroup`

Children: `column`. Parents: `struct`.

Additional positional arguments: `False`; additional keyword arguments: `False`.

| Parameter | Passing | Type | Default | Constraints |
| --- | --- | --- | --- | --- |
| `code` | positional_or_keyword | T | **required** | [{"kind":"regex","pattern":"^[A-Za-z_][A-Za-z0-9_]*$","flags":0}] |
| `name` | keyword_only | T | None | [] |
| `background` | keyword_only | T | None | [] |
| `color` | keyword_only | T | None | [] |
