# Trees

Document ID: **GC-425**.

<a id="gc-425-start"></a>
## Start here

A tree presents a Data Bag. Nodes can carry captions and child resolvers; the tree owns disclosure and selection, while the Bag remains the data source.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-tree).

The example also uses inputs and expects `catalog.items` to contain a Bag, loaded by the page or a resolver. `searchText` filters the tree, including resolvable branches; clearing it restores the prior tree view. Resolver work may involve server requests. [Tree data, selection and drag/drop](105-components.md#gc-105-120). `rowActions` supplies contextual commands; it is not a second data store.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)

## Present a Bag and keep identity in its paths

`tree(storepath=...)` reads a Data Bag; `selectedPath` is a two-way path relative
to that store. Rendering reads already loaded values. Explicit expansion evaluates
branch resolvers; external selection can load missing ancestors. `autoCollapse`
closes sibling branches on opening. `hideValues=False` also displays scalar values
as visual children, including zero, false and null; selecting such a row reports
the owning BagNode path, without inserting another Bag node. Use `hideValues=True`
for a navigation-only view. See [tree contracts](105-components.md#gc-105-120).

Captions resolve through `getLabel`, `labelAttribute`, `labelCb`, then the node
label. Callback names refer to synchronous browser Logic, receiving the real
BagNode with path/opened/selected context. A label callback returns exactly
`{text: ...}` or `{html: ...}`; HTML is sanitized and cannot supply form controls
or executable behavior. `getLabelClass`, `getIconClass` and `selectedLabelClass`
control appearance without changing store identity. Callbacks are not asynchronous
caption providers. Bag attributes can supply badges and checked state.

Bind `searchText` to an input for case-insensitive literal caption search. After
a short debounce it may load unresolved branches, retaining matches and ancestors;
large remote trees can therefore issue many branch reads. Search is not server-side
pagination. Clearing it restores the previous expansion set and does not change
selection or replace the Bag. Nodes marked `loop=True` stop recursive search.
See [search lifetime](105-components.md#gc-105-965).

`checkedPaths` binds serialized checked paths; `checkedPaths_joiner` chooses the
separator. The actual state is each node's `checked` attribute, including mixed
and disabled states. `checkChildren=True` propagates through loaded descendants
and is inherited as unresolved descendants load. A synchronous `onChecked`
callback can veto a click by returning false; `onChecked=True` enables ordinary
checks without that callback. Selection and checked paths are separate state.
`favorites` is a Bag of references retaining `originalPath`, not copied tree data.

The experimental `rowActions` child supplies one shared contextual action bar,
containing `button`/`dropDownButton`. Commands receive `{item, path, event}` for
the hovered or focused row. `position` chooses the bar edge; a named synchronous
`actionState` callback derives `{hidden, icon, title}` per identified `rowAction`
from row context and reactive `state`. It is not another store. `draggable` enables
the tree's declared drag behavior; application mutations and authorization still
belong to their owners. Resolver endpoints must authorize client-supplied paths
and attributes. The current store/row-action increment does not claim full legacy
parity or complete visual acceptance.

## Choose a component

- [`tree`](#gc-425-tree): Hierarchical Bag presentation with selection, disclosure and declared drag behavior.
- [`rowActions`](#gc-425-rowactions): Shared contextual row actions for the tree presentation.


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


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-tree).


**Data contract.** storepath selects a live Bag in Data or a Source tree through the store routing contract. Bind selectedPath two ways for selection and checkedPaths for joined checkbox paths. Selection paths are relative to the store. External selection can resolve missing ancestors.


**Interaction and events.** Disclosure, keyboard navigation and selection operate on visible rows. Named label and icon Logic can customize row presentation. onChecked receives item and path and can veto the change. Optional drag callbacks prepare a typed snapshot for the internal drop pipeline.


**Composition.** The Bag supplies the hierarchy and can contain lazy resolver nodes. Source may declare one rowActions child for shared commands. A rendered scalar child selects its owning Bag node.


**Limits and lifecycle.** Ordinary rendering does not evaluate unloaded resolvers. Failed branches remain retryable and stale asynchronous results cannot change later selection. Search stops at marked loops, and drag preparation is opt-in, synchronous and does not evaluate a lazy row.

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


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-rowactions).


**Data contract.** state is an optional read binding passed to actionState. Command context carries the focused or hovered row item and path independently of selectedPath.


**Interaction and events.** A child command runs in the current row context without selecting the row. actionState receives item, path, action and state and returns hidden, icon and title for each coded action.


**Composition.** Place one shared bar inside tree, at start or end of the row. Compose button and dropDownButton children. Use rowAction to identify an action for presentation Logic.


**Limits and lifecycle.** The bar hides when it has no row context. Invalid position or an incomplete actionState result raises an error. Menu commands use the same active row context as the bar.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `position` | T | 'end' | — | — |
| `actionState` | T or None | None | — | — |
| `state` | X or None | None | read | — |

Child grammar: `button,dropDownButton`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.
