# Trees

Document ID: **GC-425**.

<a id="gc-425-start"></a>
## Start here

A tree presents a Data Bag. Nodes can carry captions and child resolvers; the tree owns disclosure and selection, while the Bag remains the data source.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-tree).

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


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-tree).


**Data contract.** storepath selects a live Bag in Data or a Source tree through the store routing contract. Bind selectedPath two ways for selection and checkedPaths for joined checkbox paths. Selection paths are relative to the store. External selection can resolve missing ancestors.


**Interaction and events.** Disclosure, keyboard navigation and selection operate on visible rows. Named label and icon Logic can customize row presentation. onChecked receives item and path and can veto the change. Optional drag callbacks prepare a typed snapshot for the internal drop pipeline.


**Composition.** The Bag supplies the hierarchy and can contain lazy resolver nodes. Source may declare one rowActions child for shared commands. A rendered scalar child selects its owning Bag node.


**Limits and lifecycle.** Ordinary rendering does not evaluate unloaded resolvers. Failed branches remain retryable and stale asynchronous results cannot change later selection. Search stops at marked loops, and drag preparation is opt-in, synchronous and does not evaluate a lazy row.


| Parameters | Contract |
| --- | --- |
| `storepath` | `{"dtype":"T"}` |
| `draggable, internalNames, hideValues, autoCollapse` | `{"binding":"read","default":false,"dtype":"B"}` |
| `labelAttribute, excludeRoot` | `{"binding":"read","default":null,"dtype":"T","nullable":true}` |
| `labelCb, getLabel, getLabelClass, getIconClass` | `{"default":null,"dtype":"T","nullable":true}` |
| `labelState, favorites` | `{"binding":"read","default":null,"dtype":"X","nullable":true}` |
| `selectedLabelClass, searchText, searchAttributes` | `{"binding":"read","default":"","dtype":"T"}` |
| `searchEager, resolveLazy, checkChildren` | `{"binding":"read","default":true,"dtype":"B"}` |
| `favoritesLabel` | `{"binding":"read","default":"Favorites","dtype":"T"}` |
| `selectedPath, checkedPaths` | `{"binding":"twoWay","default":null,"dtype":"T","nullable":true}` |
| `onChecked` | `{"default":null,"dtype":["B","T"],"nullable":true}` |
| `checkedPaths_joiner` | `{"default":",","dtype":"T"}` |

Child grammar: `rowActions[:1]`; parent grammar: `None`.

<a id="gc-425-360"></a>
<a id="gc-425-rowactions"></a>
### `rowActions`

Collection: tree. Shared contextual row actions for the tree presentation.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-rowactions).


**Data contract.** state is an optional read binding passed to actionState. Command context carries the focused or hovered row item and path independently of selectedPath.


**Interaction and events.** A child command runs in the current row context without selecting the row. actionState receives item, path, action and state and returns hidden, icon and title for each coded action.


**Composition.** Place one shared bar inside tree, at start or end of the row. Compose button and dropDownButton children. Use rowAction to identify an action for presentation Logic.


**Limits and lifecycle.** The bar hides when it has no row context. Invalid position or an incomplete actionState result raises an error. Menu commands use the same active row context as the bar.


| Parameters | Contract |
| --- | --- |
| `position` | `{"default":"end","dtype":"T"}` |
| `actionState` | `{"default":null,"dtype":"T","nullable":true}` |
| `state` | `{"binding":"read","default":null,"dtype":"X","nullable":true}` |

Child grammar: `button,dropDownButton`; parent grammar: `None`.
