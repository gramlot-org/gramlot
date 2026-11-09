# Trees

Document ID: **GC-425**.

The tree collection shows a Bag of Data as a hierarchy the user can open, search,
select and tick. This page answers **how to show a Bag as a tree and read back what
the user picked**. The complete list of parameters is in the
[widget reference](345-widget-reference.md).

<a id="gc-425-start"></a>

## A searchable tree

```python
def main(self, root):
    pane = root.div(datapath="catalog")
    pane.textbox(value="^.search", placeholder="Search", live=True)
    pane.tree(storepath=".items", searchText="^.search",
              selectedPath="^.selection", hideValues=True)
```

`catalog.items` must hold a Bag, loaded by the page or by a resolver. When the user
clicks a row, `catalog.selection` receives its path inside the Bag, such as
`europe.italy`. The tree never copies the Bag: change the Bag and the tree follows.
The page base of your environment already enables this collection; if it does not,
[enable it once](340-components-and-collections-guide.md#gc-340-050).

<a id="gc-425-005"></a>
<a id="gc-425-010"></a>

## Pick a component

| You want to | Use |
| --- | --- |
| Show a Bag as a hierarchy, with selection, search and checkboxes | [tree](#gc-425-tree) |
| Offer commands on the row under the pointer | [rowActions](#gc-425-rowactions) |

<a id="gc-425-330"></a>
<a id="gc-425-185"></a>
<a id="gc-425-tree"></a>

## Showing and selecting

```python
form.tree(storepath=".items", selectedPath="^.selection",
          labelAttribute="caption", autoCollapse=True)
```

[tree](345-widget-reference.md#gc-345-tree) reads the Bag at `storepath`.
`selectedPath` works both ways: a click writes the path, and writing a path from
your code selects that row, loading its missing parents first.

- **Captions.** By default a row shows its node label. `labelAttribute` shows a node
  attribute instead; `getLabel` or `labelCb` name a method of your page's `Logic`
  that returns `{text: ...}` or `{html: ...}`
  ([captions and classes](105-components.md#gc-105-120)).
- **Values.** Scalar values appear as children of their row. `hideValues=True`
  hides them, for a tree used only to navigate.
- **Opening.** Branches backed by a resolver load when the user opens them.
  `autoCollapse=True` closes the sibling branches.

## Searching

```python
form.textbox(value="^.search", live=True)
form.tree(storepath=".items", searchText="^.search",
          searchAttributes="description,tags")
```

Bind `searchText` to a field: the tree keeps the rows whose caption contains the
text, ignoring case, together with their parents. `searchAttributes` also searches
the named node attributes. The search can open unloaded branches, which may mean
many server reads on a large tree; `searchEager=False` searches only what is loaded.
Emptying the text gives the tree back as it was
([searching a tree](105-components.md#gc-105-965)).

## Ticking several rows

```python
form.tree(storepath=".items", checkedPaths="^.checked", checkChildren=True)
```

`checkedPaths` adds a checkbox to each row and stores the ticked paths, comma
separated (`checkedPaths_joiner` changes the separator). Ticking a branch ticks its
children; `checkChildren=False` turns that off. `onChecked` can name a `Logic`
method that refuses a click by returning false. Ticking and selecting are separate:
a ticked row is not the selected one
([checkboxes](105-components.md#gc-105-120)).

<a id="gc-425-360"></a>
<a id="gc-425-rowactions"></a>

## Commands on a row

```python
tree = form.tree(storepath=".items", selectedPath="^.selection")
bar = tree.rowActions(position="end")
bar.button("Open", action="this.SET('opened', path)")
```

[rowActions](345-widget-reference.md#gc-345-rowactions) is one small bar of buttons
that appears on the row under the pointer or with the focus. A tree holds at most
one. Its commands receive `item` and `path` of that row without selecting it.
`position` puts the bar at the `start` or `end` of the row. `actionState` can name a
`Logic` method that hides or relabels each button row by row
([row actions](105-components.md#gc-105-120)).

A tree can also let the user drag rows (`draggable=True`) and show a group of
`favorites`; both are described with the [tree](105-components.md#gc-105-120).
