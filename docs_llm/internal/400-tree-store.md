# 400 · Lazy tree store

Document ID: **GC-400**. Status: implemented in the relation-tree worktree; owner acceptance pending.
[Full counterpart](../../docs/internal/400-tree-store.md).

<a id="gc-400-005"></a>
## 005 · Contract

Block ID: **GC-400-005**.

Owner requested a single root store resolver for lazy tree levels, current node
path/label/attributes, Bag-valued or resolver branches, optional `child_count`,
and the generic store plus Asqueel/Kajenn tree. `checked` is ordinary metadata.
Python `tree_store` composes Data and tree; Page Logic supplies `TreeStoreLogic`
by direct re-export as `Logic` or delegation, not inheritance.
The root request uses empty path, null label and empty attributes. Each branch
calls the same endpoint with its store-relative dot path, label, attributes and
configured params; path/label/attributes are reserved. Endpoint returns a Bag;
`TreeStoreResolver` descriptions use Bag wire registration, decode inertly and
bind to the owning store. Loads cache, share a pending request and cancel on
scope disposal. Loaded Bag children determine disclosure; zero `child_count`
hides unloaded branches; absent count leaves them expandable. Endpoint arguments
are untrusted and require server-side validation.
Deferred resolvers inside returned static Bag groups are bound recursively and
retain their current store-relative path without loading during binding.
Mouse/keyboard expansion and external selection load marked loops without a
prompt. Selection loads missing ancestors sequentially; failed loads or changed
selection stop traversal, though an already started load may finish.

Search stops at `loop` nodes. With `checkChildren`, checkbox state passes to
descendants as they load; `checkedPaths` holds unresolved checked branch paths
until replaced by descendant paths. Marked resolvers load without a prompt;
disabled nodes retain their state.
Bag-node `badge` (text/number) and `badge_color` render a reactive badge before
the caption; zero remains visible and null/empty is hidden. The Asqueel adapter
maps type and direction to these generic attributes.
A `favorites` Bag renders as a collapsible group in the same tree and selects
the original path. Trial `tree.rowActions(position='start'|'end')` supplies a single Source bar;
actions/controllers receive row `item`, `path`, `event`. `treeInspect` opens a
Source attribute dialog and disposes it with its invoking Source.

The reactive `internalNames` option shows technical labels for model fields and
relations and field paths for favorites, preserving descriptive group captions.

<a id="gc-400-010"></a>
## 010 · Destination and limits

Block ID: **GC-400-010**.

Kajenn's `AsqueelRelations` permits explicit root tables, follows actual Asqueel
resolvers one level per call and uses the request database; fields cannot be
traversed. Applications own endpoint/root authorization. Core has no host or SQL
dependency. Browser-persistent favorites use a Data Bag and select their original
path. A named row-action presentation callback receives row context and reactive
state; Asqueel hides the favorite action on branches and fills saved-field hearts.
Complete PoC visual presentation remains incomplete;
browser visual acceptance and filesystem/navigation migration remain pending.
Connected adapter is an isolated development clone at `worktrees/relation-tree-py-server`. See PORT-0027.
