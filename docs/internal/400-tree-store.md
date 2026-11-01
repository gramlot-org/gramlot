# 400 · Lazy tree store

Document ID: **GC-400**. Status: implemented in the relation-tree worktree; owner acceptance pending.
[Compact counterpart](../../docs_llm/internal/400-tree-store.md).

<a id="gc-400-005"></a>
## 005 · Contract

Block ID: **GC-400-005**.

Owner, 2026-10-31 and 2026-11-01: use one store-level resolver for the root and
all branches; pass the current node path, label and attributes; use a Bag-valued
node or a node with a resolver as a branch; retain optional `child_count`; proceed
with the generic store and an Asqueel/Kajenn relation tree. `checked` is an ordinary
node attribute, not a resolver parameter unless explicitly declared.

`tree_store(parent, datapath=..., method=..., params=..., tree_attributes=...)`
composes Data and the existing tree. The page Logic must provide `treeStoreMount`.
A page without other Logic can re-export `TreeStoreLogic` as `Logic` from
`@gramlot/gramlot/page`; custom Logic can delegate the method.
The root store resolver calls the page endpoint with empty `path`, null `label`,
and empty `attributes`. Branch requests use the dot-separated store-relative Bag
path, node label and a snapshot of its attributes. The configured `params` are
also passed, except `path`, `label`, and `attributes`, which are reserved.

The endpoint returns one Bag level. A `gramlot.tree_store.TreeStoreResolver` on a
returned node describes an unresolved branch; it is serialized using Bag's
registered resolver format, decoded inertly, then bound to the owning store. No
I/O occurs during decoding. Opening the branch invokes the same endpoint. A
resolver caches its result, shares an in-flight load and is cancelled with the
store's Source scope. A loaded Bag takes precedence for display; `child_count=0`
suppresses an unloaded resolver's disclosure; an absent count leaves it openable.
The endpoint must independently validate every argument; labels and attributes
from the browser are not authority to access a resource.

Returned static Bag groups may contain deferred store resolvers; the store binds
those resolvers recursively without loading them, preserving their current
store-relative path for a later expansion.

Mouse and keyboard expansion and external selection load marked loops without a
confirmation. The endpoint decides whether to mark a node. External selection
loads missing ancestors one at a time; a failed load or changed selection stops
traversal, although an already started load may finish.

Search stops at nodes marked `loop` without resolving or traversing them. With
`checkChildren`, checkbox state propagates to loaded descendants and is inherited
by descendants as they load, without automatically traversing lazy branches.
`checkedPaths` carries a checked unresolved branch's path until it is replaced by
the checked descendants' paths. Checking or opening a marked resolver does not
prompt. Disabled nodes retain their state.

Tree Bag nodes may supply `badge` (text or number) and `badge_color` (CSS color).
The badge precedes the caption, follows Data updates, preserves zero and hides
null or empty values. The Asqueel adapter supplies field and relation types as
badges; relation direction determines its badge color.

The trial `tree.rowActions(position='start'|'end')` supplies one Source-composed
bar for the hovered or focused row. Named actions and controllers receive its
`item`, `path` and `event`; button/menu invocation does not select or expand the
row. `TreeStoreLogic.treeInspect` opens a Source dialog showing the item's
attributes and releases it when closed or its invoking Source is disposed.

The relation-tree composition uses a Data Bag for browser-persistent favorites.
The `favorites` Bag appears as a collapsible group inside the same tree. Selecting
a saved entry requests its original tree path and follows ordinary selection rules. A named `rowActions` presentation callback
receives the current row and reactive state; identified buttons can change their
visibility, icon and accessible title. The Asqueel composition hides its favorite
action on branches and indicates saved fields with a filled heart.

The reactive `internalNames` option shows technical labels for model fields and
relations and field paths for favorites, preserving descriptive group captions.

<a id="gc-400-010"></a>
## 010 · Destination and limits

Block ID: **GC-400-010**.

The Kajenn adapter's `AsqueelRelations` mixin exposes `relation_tree` only for
explicit `relation_roots`, traverses actual Asqueel relation resolvers and reads
one table level per call. It uses the request's Kajenn database and rejects paths
through fields. The core has no Asqueel or Kajenn dependency. Related model
metadata is visible beneath an allowed root; an application must apply its own
authorization policy to the endpoint and root selection.

The increment shows relation and field nodes and browser-persistent favorites.
It does not yet reproduce the complete PoC relation-tree visual presentation. Browser visual
acceptance and migration of the existing filesystem/navigation stores are pending.
The core and connected adapter are integrated into the local common release base.
The original aligned worktrees remain unchanged; publication is separate.
See [PORT-0027](../../ports/PORT-0027-tree-store/README.md).
