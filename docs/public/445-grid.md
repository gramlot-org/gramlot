# Grids

Document ID: **GC-445**.

The grid collection shows the rows of a Bag as a table. This page answers **how do I
show rows in a table, and let the user search, filter, select and edit them?** The
complete list of parameters of each component is in the
[widget reference](345-widget-reference.md).

<a id="gc-445-start"></a>

## A small grid

```python
def main(self, root):
    box = root.div(height="280px")
    grid = box.grid(storepath="customers", rowMode="values")
    columns = grid.struct()
    columns.column("name", name="Customer")
    columns.column("seats", name="Seats", dtype="L")
```

`customers` is a Bag with one node per row; each row is a Bag holding `name` and
`seats`. The grid draws only the rows that are on screen, so a long Bag scrolls
smoothly. The grid never reads a database by itself: your application puts the rows
in the Data. The page base of your environment already enables this collection; if
it does not, [enable it once](340-components-and-collections-guide.md#gc-340-050).

<a id="gc-445-005"></a>
<a id="gc-445-010"></a>

## Pick a component

| You want to | Use |
| --- | --- |
| Show rows of a Bag as a table | [grid](#gc-445-grid) |
| Let the user search the rows of a grid | [searchBox](#gc-445-searchbox) |

<a id="gc-445-430"></a>
<a id="gc-445-365"></a>
<a id="gc-445-grid"></a>

## Rows: where they live and how they are read

```python
box = root.div(height="280px")
box.grid(storepath="orders.rows", rowMode="attributes", structpath="orders.columns",
         rowHeaders=True, sortedBy="date:d")
```

[grid](345-widget-reference.md#gc-345-grid) needs two things:

- **`storepath`**, the Data path of the Bag that holds the rows. The label of each
  row node is the identity of the row.
- **`rowMode`**, how a row keeps its fields: `values` when each row is a Bag of
  fields, `attributes` when the fields are attributes of the row node. The grid
  never guesses it.

Several grids can show the same Bag: each keeps its own order and filter, and an
edit in one shows in all. `rowHeaders=True` adds row numbers, `sortedBy` sets the
starting order: `field:a` ascending, `field:d` descending, several separated by commas.

For more rows than fit in the browser, a provider loads one window at a time: it
fills `windowInfo` and `loading`, and the grid writes the rows it needs to
`viewport` and the requested order to `sortRequest`. The provider is your
application's code; the grid only asks.

<a id="gc-445-390"></a>

## Declaring the columns

```python
box = root.div(height="280px")
grid = box.grid(storepath="products", rowMode="values")
columns = grid.struct()
columns.column("code", name="Code", width="8ch")
price = columns.colgroup("price", name="Price", background="#eef4fb")
price.column("net", name="Net", dtype="N", format="0.00", align="end")
price.column("vat", name="VAT %", dtype="L", align="end")
columns.column("notes", name="Notes", white_space="pre-wrap")
```

Columns are written inside `struct()`, the grid's only structure. Each `column`
names the row field it shows; `name` is the caption, `dtype` the type of the value
(`T`, `B`, `L`, `R`, `N`, `D`, `H`, `DHZ`), and `width`, `align`, `format` and
`white_space` set how it looks. A `colgroup` puts several columns under one header
band and can color it; groups do not nest.

When the columns live in Data, for example because the user can change them, pass
`structpath` with the path of that structure Bag instead of writing a `struct`. Use
one or the other. The exact rules for each attribute are in the
[grid structure declarations](345-widget-reference.md#gc-345-390).

## Selecting rows

```python
box = root.div(height="280px", datapath="orders")
grid = box.grid(storepath=".rows", rowMode="values", selectionMode="single",
                selectedId="^.current", selectedRowData="^.currentRow")
grid.struct().column("number", name="Order")
```

`selectionMode` is `multi` (the default), `single` or `none`. In `multi` mode
Ctrl/Cmd+click toggles a row, Shift+click selects a range and Ctrl/Cmd+A selects
every visible row.

The grid writes the selection to every path you bind: `selectedId` (the current
row), `selectedIndex`, `selectedLabel`, `selectedPkeys` (all selected identities),
`selectedRowidx`, `selectedNodes`, `selectedRowData` (the values of the current row)
and `selected_<field>` (the distinct values of one field). Sorting keeps the
selection; a row hidden by a filter leaves it.

## Editing cells

```python
box = root.div(height="280px")
columns = box.grid(storepath="lines", rowMode="values").struct()
columns.column("description", name="Description", edit=True)
columns.column("quantity", name="Qty", dtype="L", edit=True)
```

`edit=True` on a column makes its cells editable with an ordinary field. Double-click,
Enter or F2 opens a cell; Enter confirms, Tab moves to the next cell and Escape
throws the typing away. Changes go into the row Bag and into the editing session of
the enclosing form, or of the grid itself when it stands alone. Saving them is up to
your application. See
[local editing shared by forms and grids](340-components-and-collections-guide.md#gc-340-110).

<a id="gc-445-230"></a>
<a id="gc-445-shared-labels"></a>
<a id="gc-445-370"></a>
<a id="gc-445-searchbox"></a>

## Search and a toolbar: frameGrid

`frameGrid` builds a frame with a grid in the centre and a toolbar on top. You
write, inside `main`:

```python
frame = root.frameGrid(storepath=".rows", rowMode="values", datapath="orders",
                       searchOn=True, export=True)
```

and then add columns with `frame.grid.struct()`. Grid parameters go to the grid,
every other keyword (`datapath`, `height`, styles) to the frame; `grid_<name>` and
`frame_<name>` force the target. [Complete examples](465-widget-examples.md#gc-465-setup-grid).

- `searchOn=True` puts a [searchBox](345-widget-reference.md#gc-345-searchbox) in the
  toolbar. The user picks a column from its label menu and types; the grid filters
  after a short pause, or at once on Enter. Escape clears it. `searchLiteral=True`
  matches the text literally instead of as a regular expression. The searchBox works
  only inside a frameGrid.
- `export=True` adds an Export menu (CSV, JSON, TYTX, XML, Excel) for the visible
  rows and columns; `export="csv,json"` limits the formats.
- `printRows=True` prints the visible rows. `advancedTools=True` adds a menu that
  also shows or hides row numbers.
- `addrow`, `duprow` and `delrow` add, copy and remove rows of the Bag; they need an
  editable column, and `duprow` and `delrow` a selection mode.
  `gridsemaphore=True` shows the [editingStatus](345-widget-reference.md#gc-345-editingstatus)
  of the grid's edits; it needs the frameGrid's own `datapath`.

## Filtering by column values

```python
box = root.div(height="280px")
box.grid(storepath="customers", rowMode="values", columnFilters=True)
```

`columnFilters=True` adds a filter button to each column header. Its popup lists the
distinct values with their row counts; the user ticks the ones to keep. Values of one
column combine with OR, different columns with AND, together with the grid's base `filter`
and the search. Date columns also offer a From/To range. Column filters need all the
rows in the Bag; a windowed grid refuses them.

A column can also tick rows into a list kept in Data, without touching the rows:

```python
grid = root.div(height="280px").grid(storepath="people", rowMode="values",
                                     setFilter="^.onlyTeam")
grid.struct().column("john", name="J", title="John", check="multiple",
                     checked="^assignments.john", checkedField="id")
```

Each click adds or removes the row's `id` in the comma-separated text at
`assignments.john` (start it as `""`). `check="single"` stores one id instead.
`setFilter` names such columns: `"john"` shows only John's rows, `"john,fred"` the
rows ticked in both.

## Row formulas and totals

```python
box = root.div(height="280px", datapath="invoice")
grid = box.grid(storepath=".lines", rowMode="values", footer="Total")
columns = grid.struct()
columns.column("quantity", dtype="L", edit=True)
columns.column("price", dtype="N", edit=True)
columns.column("total", dtype="N", formula="quantity * price * (1 + vat / 100)",
               formula_vat="^.vat", calculated=True, totalize=True)
columns.column("position", formula="#")
```

`formula` computes a field for every row and writes it into the row Bag, so every
grid and form on that Bag sees it. `formula_<name>` gives a formula a value: `^path`
recalculates when that Data changes, `=path` only reads it. `#` numbers the visible
rows, `+=field` is a running sum and `%=field` a share of the column total.

`totalize=True` sums a column over all rows and writes the total to
`.totalize.<field>`; `footer` shows a footer row with the totals.
