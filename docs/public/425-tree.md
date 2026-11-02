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
Types: T text, B Boolean, L integer, R real, X structured value; other codes are TYTX. Binding: read = Data to widget; write = widget to Data; twoWay = both. A dash means no declared default/binding. None is a declared value. Constraints include enum, qualification, target and annotations. Tables describe component contracts; ordinary Source/CSS attributes are shared.


## Shared parameter contracts

Each widget below links only the shared contracts it supports. A shared name can have different types, defaults or bindings; separate rows preserve those differences.


<a id="gc-425-330"></a>
## Trees


<a id="gc-425-185"></a>
<a id="gc-425-tree"></a>
### `tree`

Hierarchical Bag presentation with selection, disclosure and declared drag behavior.

Collection: **tree**. Browser element: `gramlot-tree`.

[Tree stores, labels and selection](105-components.md#gc-105-120).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `storepath` | T | — | — | — |
| `draggable` | B | False | read | — |
| `labelAttribute` | T or None | None | read | — |
| `internalNames` | B | False | read | — |
| `hideValues` | B | False | read | — |
| `excludeRoot` | T or None | None | read | — |
| `labelCb` | T or None | None | — | — |
| `getLabel` | T or None | None | — | — |
| `getLabelClass` | T or None | None | — | — |
| `getIconClass` | T or None | None | — | — |
| `selectedLabelClass` | T | '' | read | — |
| `searchText` | T | '' | read | — |
| `favorites` | X or None | None | read | — |
| `favoritesLabel` | T | 'Favorites' | read | — |
| `autoCollapse` | B | False | read | — |
| `selectedPath` | T or None | None | twoWay | — |
| `onChecked` | B / T or None | None | — | — |
| `checkedPaths` | T or None | None | twoWay | — |
| `checkedPaths_joiner` | T | ',' | — | — |
| `checkChildren` | B | True | read | — |

Child grammar: `rowActions[:1]`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-425-360"></a>
<a id="gc-425-rowactions"></a>
### `rowActions`

Shared contextual row actions for the tree presentation.

Collection: **tree**. Browser element: `gramlot-row-actions`.

[Tree stores, labels and selection](105-components.md#gc-105-120).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `position` | T | 'end' | — | — |
| `actionState` | T or None | None | — | — |
| `state` | X or None | None | read | — |

Child grammar: `button,dropDownButton`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.
