# Trees

Document ID: **GC-425**.

<a id="gc-425-start"></a>
## Start here

A tree presents a Data Bag. Nodes can carry captions and child resolvers; the tree owns disclosure and selection, while the Bag remains the data source.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). Example body for `main(self, root)`:

```python
pane = root.div(datapath="catalog")
pane.textbox(value="^.search", placeholder="Search", live=True)
pane.tree(storepath=".items", searchText="^.search", height="280px")
```

The example also uses inputs and expects `catalog.items` to contain a Bag, loaded by the page or a resolver. `searchText` filters the tree, including resolvable branches; clearing it restores the prior tree view. Resolver work may involve server requests. [Tree data, selection and drag/drop](105-components.md#gc-105-120). `rowActions` supplies contextual commands; it is not a second data store.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)


<a id="gc-425-005"></a>
<a id="gc-425-010"></a>

Ordinary Source/CSS attributes remain in Writing pages and Themes and CSS.
Pages inherit environment collections; Page.gramlots adds missing ones. Buttons are built in.
Contract JSON omits only undeclared keys: no default is not the same as null. dtype: T text, B Boolean, L integer, R real, X structured value; remaining codes are TYTX. binding: read = Data to widget, write = widget to Data, twoWay = both. nullable permits None; enum restricts values; annotation preserves type/regex constraints. Parameters sharing a table row have exactly the same contract. Child grammar: * allows arbitrary Source children; empty permits none. Parent None means no declared restriction.


<a id="gc-425-330"></a>
## Trees


<a id="gc-425-185"></a>
<a id="gc-425-tree"></a>
### `tree`

Collection: tree. Hierarchical Bag presentation with selection, disclosure and declared drag behavior.


| Parameters | Contract |
| --- | --- |
| `storepath` | `{"dtype":"T"}` |
| `draggable, internalNames, hideValues, autoCollapse` | `{"binding":"read","default":false,"dtype":"B"}` |
| `labelAttribute, excludeRoot` | `{"binding":"read","default":null,"dtype":"T","nullable":true}` |
| `labelCb, getLabel, getLabelClass, getIconClass` | `{"default":null,"dtype":"T","nullable":true}` |
| `selectedLabelClass, searchText` | `{"binding":"read","default":"","dtype":"T"}` |
| `favorites` | `{"binding":"read","default":null,"dtype":"X","nullable":true}` |
| `favoritesLabel` | `{"binding":"read","default":"Favorites","dtype":"T"}` |
| `selectedPath, checkedPaths` | `{"binding":"twoWay","default":null,"dtype":"T","nullable":true}` |
| `onChecked` | `{"default":null,"dtype":["B","T"],"nullable":true}` |
| `checkedPaths_joiner` | `{"default":",","dtype":"T"}` |
| `checkChildren` | `{"binding":"read","default":true,"dtype":"B"}` |

Child grammar: `rowActions[:1]`; parent grammar: `None`.

<a id="gc-425-360"></a>
<a id="gc-425-rowactions"></a>
### `rowActions`

Collection: tree. Shared contextual row actions for the tree presentation.


| Parameters | Contract |
| --- | --- |
| `position` | `{"default":"end","dtype":"T"}` |
| `actionState` | `{"default":null,"dtype":"T","nullable":true}` |
| `state` | `{"binding":"read","default":null,"dtype":"X","nullable":true}` |

Child grammar: `button,dropDownButton`; parent grammar: `None`.
