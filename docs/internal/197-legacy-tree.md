# 197 · Tree investigation and proposed port

Document ID: **GC-197**. Investigation date: **2026-10-20**.

[Concise counterpart](../../docs_llm/internal/197-legacy-tree.md).

<a id="gc-197-005"></a>

## 005 · Status, authority and scope

Block ID: **GC-197-005**.

**Investigation plus a bounded first implementation (§060). Port acceptance, release
assignment and unconfirmed architecture decisions remain unauthorized.** The owner
asked for a separate agent to investigate trees, prepare a plan, use the PoC IDE
tree as an example, and consider **all** legacy tree options. The request approves
analysis; subsequent confirmed decisions are recorded in §005 and §055.


**Owner-confirmed store contract — 2026-10-20.** After clarifying that the
Bag tree includes any Bag with resolvers, including disk-directory data, the owner
stated: “di fatto un tree ha sempre una bag come store”. The tree always has a Bag
as its store. Resolvers belong to Bag nodes; directory/database access produces
Bag data through the owning resolver/provider contract, never an alternative tree
store representation. Resolver-backed branches are part of the general tree
contract, not a separate tree type or an IDE-only capability. This corrects the
initial local-tree/lazy-tree split below. It does not approve implementation,
remaining API choices, provider services or the proposed delivery sequence.

The useful small port is a general Bag-backed hierarchy with selection,
expansion, resolver-backed branches, accessible navigation and reliable updates. The PoC filesystem browser
is a concrete acceptance scenario. A complete legacy tree family also includes
checkbox propagation, search, popup integration, drag/drop, tree grids, database
hierarchies, relation explorers and storage operations. Calling that entire family
a simple copy would hide substantial contracts and dependencies.

Constitution §§3–8 and 13–14 apply. Legacy is behavioral evidence; PoC is not the
destination architecture. Amendment 11.62 approves only provisional inspector
components; it does not make their API a public tree contract. Amendment 11.76
requires JS-owned component descriptions with generated Python metadata.
Amendment 11.77 permits modern implementations with documented differences, not
silent compatibility changes. Names must follow [GC-225](225-naming-and-proxy-conventions.md).
No Builder/Bag source edits, new host dependencies, inferred Live Object Tree
semantics, releases or deployment are part of this work.

<a id="gc-197-010"></a>

## 010 · Evidence and completeness boundary

Block ID: **GC-197-010**.

The source readings use the checked-out files. These HEADs identify the historical
baseline; concurrent working changes are not implied to be contained in a commit:

| Repository | HEAD at investigation |
|---|---|
| `genropy/genropy` | `fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea` |
| `gramlot-org/gramlot-poc` | `10478b57ce3f22e6445eb6b72eba343520cbebac` |
| `gramlot-org/gramlot` | `d01bf3dc6389ad9bca91ef0f4bdbaafbfcc10242` |

Primary evidence, with paths relative to the named repository:

| Key | Source |
|---|---|
| L1 | GenroPy `gnrpy/gnr/web/widgets/dijit.py`, `DijitWidgets.tree`; Python declaration recorded also in the PoC census |
| L2 | GenroPy [`gnrjs/gnr_d11/js/genro_tree.js`](https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrjs/gnr_d11/js/genro_tree.js): actual wrapper, all methods |
| L3 | GenroPy `gnrjs/gnr_d11/js/gnrstores.js`, `GnrStoreBag` |
| L4 | GenroPy `dojo_libs/dojo_11/dojo_src/dijit/Tree.js`, tree/model and keyboard implementation |
| L5 | GenroPy `gnrjs/gnr_d11/js/genro_patch.js`, tree patches around line 1422 |
| L6 | GenroPy `gnrjs/gnr_d11/js/genro_components.js`, TreeFrame, PaletteTree, QuickTree, TreeGrid and FieldsTree |
| L7 | GenroPy `gnrjs/gnr_d11/js/genro_dev.js`, `fieldsTree` and inspector composition |
| L8 | GenroPy `resources/common/th/th_tree.py` and `th_tree.js`; `resources/common/gnrcomponents/htablehandler.py` |
| L9 | GenroPy `resources/common/gnrcomponents/storagetree.py` |
| L10 | GenroPy `resources/common/gnrcomponents/gnride/gnride.py`, especially directory and database drawers |
| P1 | PoC [`js/dom/src/collections/storetree.js`](https://github.com/gramlot-org/gramlot-poc/blob/10478b57ce3f22e6445eb6b72eba343520cbebac/js/dom/src/collections/storetree.js) and `file-icons.js` |
| P2 | PoC `tools/gramlot-ide/pages/index.py`, `src/gramlot/ide.py`, `js/dom/src/collections/gramlot-ide.js`, `src/gramlot/filesystem.py` |
| P3 | PoC `docs/guides/tree-row-actions.md`, `tree-values.md`, `gramlot-ide.md`, and `gramlot_inventory/legacy-census/cards/` |
| C1 | Core `tools/poc/gramlot-poc-tree.js`, `tools/gramlot-tools-inspector/tests/poc-tree.test.mjs`, PORT-0006 and GC-195 |
| C2 | Core `js/src/components/registry.js`, `parameters.js`, `layout.js`, `selected-container.js`; `js/src/binding/rpc-resolver.js` |

An AST census parsed all **1,649 Python files returned by `rg --files -g '*.py'`**
in the legacy checkout, with zero parse errors. It found 75 direct `.tree(...)`,
5 `.paletteTree(...)`, 7 `.treeGrid(...)` and 3 `.fieldsTree(...)` calls,
case-insensitively. No direct `.treeFrame(...)` or `.quickTree(...)` call occurred
in that corpus. Literal keywords are preserved in §050.

This covers the tree-specific runtime, store, platform inheritance, wrapper
families and observed direct declarations. It does **not** prove an exhaustive
list of every application's dynamically generated option: `**kwargs`, computed
names, callbacks, generic Source attributes and third-party extensions are open
boundaries. Every discovered option is classified below, including inert or
unverified ones. “Observed in source” is not a browser compatibility claim.
Older Dojo distributions bundled beside dojo_11 are not independently qualified.

<a id="gc-197-015"></a>

## 015 · The IDE reference

Block ID: **GC-197-015**.

There is no implementation named `gnride` in the current PoC file inventory.
The matching runnable PoC tool is **Gramlot IDE** at
`tools/gramlot-ide/pages/index.py`, historically `/ide/index/`; the example is
`docs/examples/triangle-rpc/pages/gramlot-ide.py`. This identification should be
confirmed if the owner meant another historical checkout or screen.

Its Python page chooses a directory and declares `gramlotIde`. The component
creates `gnr-filesystemtree`, obtains the initial Bag with `directory_tree`, and
sets `storeBag`. Each directory node has a resolver; files have metadata
`path`, `caption`, `is_directory`, `size`, `modified`. Labels encode the filename
as UTF-8 hex, so dots in filenames do not become Bag path separators. Directories
sort before files, then by case-insensitive caption. A double click or Enter on a
file emits `filesystem-open`; `IdeDocuments.open(path)` owns document opening.
Selection and opening are distinct actions. Folder/file SVG glyphs are specialized
presentation. No rename, move, delete, upload or create action is implemented by
this filesystem tree.

Generic PoC filesystem pages use named allowed roots; the autonomous local IDE
deliberately accepts a user-entered absolute directory. These are different
application policies, not alternate inputs to a future general tree component.
The provider rejects traversal and symbolic links. Document permissions,
revision checks and saving belong to the document/provider service.

The actual **legacy GNRIde** in L10 has **two** trees:

1. Directory tree: search toolbar, `storepath='.directories'`,
   `labelAttribute='nodecaption'`, `hideValues=True`, `openOnClick=True`,
   double-click file opening and `persist=True`. Its DirectoryResolver uses an
   extension allowlist, `exclude='_*,.*'`, `dropext=True`, `readOnly=False`,
   `cacheTime=10` and `processors={'xml': False}`. These are provider options.
   The `persist` declaration does not establish effective persistence: L2
   disables the cookie implementation.
2. Database-structure tree: `.dbstructure`, `hideValues=True`, `openOnClick=True`,
   search toolbar and a separate database service. This has no equivalent drawer
   in the inspected PoC IDE.

Do not port the IDE shell together with the tree. Editor, tabs, document state,
filesystem access and tree presentation have separate owners.

<a id="gc-197-020"></a>

## 020 · Complete tree runtime option map

Block ID: **GC-197-020**.

**O** = implementation observed; **D** = disabled/overridden/stub;
**E** = open extension or inherited platform contract requiring qualification.
All entries are legacy evidence, not approved Gramlot APIs.

| Area and names | Effective legacy behavior and qualification | Evidence |
|---|---|---|
| `model`, `store`, `query`, `label`, `showRoot`, `persist`, `**kwargs` | Python advertises these. Wrapper creates its own store/model and forces `showRoot=false`; signature defaults are not effective runtime guarantees. `label` has no visible synthetic-root effect with the root hidden. | L1–L4, O/D/E |
| `storepath`, dynamic store path, `*D`, `*S` | Bag hierarchy, relative Data resolution, dynamic subscriptions; special Data/Source inspector stores. Root store replacement may rebuild; update/insert/delete use notifications. | L2–L3, O |
| `identifier` | Defaults `#id`; alternatives `#k` label, `#i` position, `#p` path, `##` numeric path, `.child` child value, attribute name. Identity affects mapping/reveal/refresh, not merely captions. | L3, O |
| `labelAttribute`, `labelCb`, `getLabel` | Attribute then label fallback; store callback when no label attribute; widget callback can override. Callback context/arguments differ. | L2–L3, O |
| `hideValues` | False exposes a synthetic scalar child (`id + 'c'`); true makes scalars leaves. This is **not** PoC `showValues` inline presentation. | L3, O |
| `hasChildrenCb`, `nodeFilter`, `child_count` | Branch eligibility, child filtering, unloaded resolver child hint. Not identical to interactive search. | L2–L3, O |
| Resolver-backed children | Bag/store resolves children on demand; expired resolver resets Dojo expansion state. Empty, cached and unresolved branches differ. Store also converts dict-like values: this is legacy evidence, not an authorized Gramlot fallback. | L3, L5, O |
| `getLabelClass`, `labelClass`, `labelClassOpened`, `labelClassClosed`, `selectedLabelClass` | Default per-node open/closed label classes, custom callbacks and selected class. | L2, O |
| `getIconClass`, `treeWithIcon` | Custom icon callback; checkbox mode supersedes the icon callback. Internal CSS marker is not an independent public feature. | L2, O |
| `innerHTML:` labels, `node_class`, `tip` | HTML label sentinel, row CSS class and native tooltip. Text/HTML boundary must be explicitly redesigned or preserved; no automatic adoption. | L5, O |
| `openOnClick`, `autoCollapse` | Click expansion; opening collapses siblings except during search. `child_count` plus `openOnClick` can suppress branch selection. | L2, L4, O |
| Expand/collapse commands | `collapseAll`, `expandAll`, Shift expansion/collapse, `saveExpanded`/`restoreExpanded`; save/restore is transient identity-based state. | L2, L5, O |
| `persist`, `cookieName`, `loadState`, `_saveState` | Save method returns immediately; cookie reading is commented out. The Dojo cookie feature is disabled by the wrapper. | L2, D |
| `selectedPath` | Inbound reveal/focus/selection plus outbound relative store path, with loop-origin guards. Null clears current selected node; do not infer complete output clearing from that branch. | L2, O |
| `selectedLabel`, `selectedItem`, `selected_*` | Write label, live BagNode, selected node attributes; `selected_*` falls back to `_record`. `selectedPath` output carries item attributes. | L2, O |
| `_isSelectable`, `_modifiers`, `onSelectedFire`, `onSelected` | Row selection veto, event modifier metadata, fired Data event and published `{path,item,node}`. Popup selection can write relative to the invoking Source node. | L2, O |
| `onChecked`, `checked`, `checkedPaths`, `checked_*` | Any enables checkbox mode. Node checked state is true/false/-1; `disabled:on/off` suppresses changes. `onChecked(node,event)` may veto. | L2, O |
| `checkChildren`, `eagerCheck` | Descendant and ancestor propagation; static traversal by default versus resolver traversal for eager mode. Pending/unresolved descendants require precise semantics. | L2, O |
| `checkedPaths_joiner`, joiner suffix in `checked_*` destination, `_valuelabel` | Joined path and deduplicated attribute outputs; with propagation, nonempty branches are omitted. Inbound paths clear and reapply checks; node-specific `_checked` publication. | L2, O |
| `searchOn`, `searchOn_*`, `searchCode` | Composed SearchBox plus scroll area; frame/node inheritance; explicit false disables connection. Dynamic delay by search length and stop-search topic. | L2, O/E |
| `searchColumn`, `searchMode` | Search labels or an attribute; default `async`, alternative `static`. Match highlighting, ancestor visibility and expanded matches. | L2, O |
| Regex and `#attribute=value` search | Regex construction and attribute mode exist; the bare `#` mode is a `console.log` stub. Invalid regex handling and special-character semantics need tests, not assumption. | L2, O/D |
| Root `search_*`, `search_method`, `search_kw.rpcmethod` | Optional RPC narrows candidate lazy paths; prefix-like search cache and cancellable pending resolver loads. Backend search is not a tree-owned query engine. | L2, O/E |
| `popup`, `popup_*`, `closeEvent` | Lazy menu wrapper, context target and optional close hook; default size constraints and forwarding of search options. | L2, O/E |
| `tooltip_callback`, `tooltip_modifiers`, other `tooltip_*` | Tooltip composition; only callback/modifiers are consumed directly here. | L2, O/E |
| `inspect`, `editable` | Attribute inspector tooltip and modifier-triggered BagNode editor palette; `editable=True` means Shift. Not inline rename or a general tree editing API. | L2, O |
| `draggable`, `dragClass`, `dragTags`, `dropTags`, `dropTypes`, `dropTarget`, `dropTargetCb`, `onDrag`, `onDrag_*`, `onDrop`, `onDrop_*` | Shared Genro DND plus tree hit context. Default payloads include text/plain, text/xml, nodeattr and treenode full/relative paths. Mutation belongs to callbacks/providers. | L2, L5, L8–L9, O/E |
| `dndController`, `onDndDrop`, `itemCreator`, `onDndCancel`, `checkAcceptance`, `checkItemAcceptance` | Inherited Dojo controller hooks. Dojo model advertises new/paste operations; this does not prove these operations work through GnrStoreBag or a particular application. | L4, E |
| Keyboard/focus | Dojo supports arrows, Home/End, Enter, letter navigation, RTL direction handling and focus state. This is substantially more than native disclosure toggling. | L4, O |
| Generic Source/widget options | `datapath`, `nodeId`, IDs, styles, `connect_*`, `selfsubscribe_*`, lifecycle callbacks, modifiers and common widget properties are inherited surfaces. Do not duplicate those services inside a new tree. | L2/L4 and declarations, E |
| `childrenAttr`, `isExpandable`, `isTree`, `templateString` | Dojo structural properties exist; wrapper fixes model `childrenAttrs=['#v']`. Arbitrary Dojo internal overrides are not automatically product features. | L2, L4, O/E |
| `excludeRoot`, `table`, `fired`, `_fired`, `device_mode`, `xisTree` on direct declarations | Found in applications, not all consumed as tree-specific options. `excludeRoot` is implemented by hierarchical wrappers by selecting a different store branch; `table` is provider context. `xisTree` has no established tree consumer. Generic activation/platform interpretation must be traced per use. | §050, L8, E |

Multiple selection is not established by this implementation: checked nodes are
not selected rows. Neither virtualization nor arbitrary-row editing is established.
Do not advertise either from the words “tree” or “tree grid”.

<a id="gc-197-025"></a>

## 025 · Compositions and specialist trees

Block ID: **GC-197-025**.

| Family | Observed option/behavior surface | Proposed ownership, not an approved port |
|---|---|---|
| `TreeFrame` | `frameCode`, `paletteCode`, `treeId`, `storepath`, `draggableFolders`, `tree_*`, `searchOn`, `editable`, `infoPanel`/`infoPanel_*`, `column` children. Defaults caption labels and drag payload. Editing adds BagNodeEditor; info panel may be remote; columns choose TreeGrid. | Composition of tree, search, layout and inspector/editor. No new general tree state. |
| `PaletteTree` | TreeFrame plus PalettePane/Dock properties, including observed `dockButton`, title and palette placement. | Palette/layout composition. |
| `QuickTree` | `value` is translated to an absolute `storepath`; forwards remaining attributes. | Legacy convenience wrapper; no automatic alias in core. |
| `TreeGrid` | `columns` Data Bag or `column` children, `labelAttribute`, `headers`, `footers`, `headers_*`, `footers_*`, `box_*`; main column and horizontally synchronized extra columns. | Separate multi-column presentation contract using shared tree behavior. |
| TreeGrid columns | `field`, `size`, `dtype`, `format`, `contentCb`, `emptyValue`, `hidden`, `cellClass`, `_style`/style attributes, `header`/`footer`, named header/footer values and prefixed overrides. Node `_customClasses`; computed level/folder classes. Dynamic columns are registered, but complete reconfiguration behavior needs qualification. | Formatting and column metadata belong to the grid presentation; no editable-cell guarantee. |
| `FieldsTree` | `table`, `trash`, `box_*`, `explorerPath`, `checkPermissions`, `currRecordPath`, `dragCode`; remote relationExplorer with `omit='_'`, `item_type='FTREE'`, dtype icons, relation-specific drag restrictions, `onTrashed`. | Database relation service plus tree presentation. |
| `hdbselect`, `treemenu` | `caption_field`, `treeMode` (signature; no effective use observed), `folderSelectable`, `cacheTime`, `connectedMenu`, `tree_*`; table/condition/condition parameters, dbstore, modifiers, size, menuId, columns, selected fields and selection restore by identifier. | Hierarchical database selector, menu and backend service. |
| `htableViewStore`, `hTableTree` | table/storepath, caption/caption_field, condition/condition_*, dbstore, root_id/root_id_delay, columns, store_*, related_*, subtable, resolved, nodeId, draggable, moveTreeNode, excludeRoot, searchCode and remaining tree options. Live database refresh, root change, hierarchy search and move/sibling sorting. | Database capability with explicit backend implementation; generic tree only renders/expresses intent. |
| Hierarchical form/tree tools | treeViewer/hviewTree, picker, treeSortingTool, form_hbreadcrumb, relatedTableHandler, child creation, related/alias row updates and structureTree. Form load/cancel, permissions, DB events and transactions. | TableHandler/form/database family; not part of a small tree port. |
| Older `htablehandler` | `rootpath`, root caption/code/pkey, limit_rec_type, related_table/relation_path, extra columns, related columns/order/fullrecord, storename, conditions; childTypes, editMode, picker, dragCode and legacy moves. | Historical behavior still visible in source; not evidence that this is the preferred new backend contract. |
| `storageTreeFrame` | frameCode, datapath, storagepath, title, `tree_*`, `preview_*`, `store_*`; create directory, download, preview, file upload/drop, storage-node move and reload. | Storage provider and application composition. UI tree must not implement filesystem privileges or mutations. |
| GNRIde | Directory provider, file-open intent and separate DB-structure tree (§015). | IDE recipe/application plus tree, editor and provider services. |
| PoC `relationTree` | dtype and relation badges; generic versus Genro model metadata; field groups, virtual/formula/Python/composite hints, attributes, internal names, favorite selection/presentation. | Specialist relation-model presentation; do not leak it into generic tree. |

Open `tree_*`, `box_*`, `infoPanel_*`, `store_*`, `preview_*`, `related_*`,
`condition_*`, column formatting and arbitrary callback families are deliberately
recorded as extensible. Their possible payloads cannot be replaced by a falsely
closed parameter list.

<a id="gc-197-030"></a>

## 030 · PoC and current core: reuse and gaps

Block ID: **GC-197-030**.

| Concern | PoC storeTree / filesystemTree | Current core provisional inspector |
|---|---|---|
| Input | PoC renderer injects `storeBag` from `store`; loose property setter | Strict actual Bag or null, assigned by inspector JS |
| Rendering | Native details/summary and leaves; whole tree redraw for Bag events | Whole redraw queued in microtask, with focus recovery |
| Values | `showValues` inline on scalar leaves | Row captions use `node.label` only; no inline scalar values |
| Selection | Internal path and outward `gnr-set`; no base inbound selectedPath setter | selectedPath property, revealPath, change event |
| Replacement | Expansion and selection paths retained | New Bag resets selection and expansion |
| Lazy | `await node.getValue()`, pending-load coalescing, busy/error and reopen-to-retry | Never evaluates resolvers, even expanded; inspection must remain passive |
| Row actions | JS property `{id, icon, label}`; `tree-action`; no behavior owned by tree | Start/end, conditional/active actions, hidden paths and same-instance drag intent |
| DND | Generic base has no completed legacy DND layer | Before/after/inside, fixed paths and descendant rejection; no direct application mutation |
| Navigation | Native disclosure; filesystem rows add tab stop and Enter | Basic Enter/Space selection and focus restoration; not a full Dojo keyboard replacement |
| Specialization | Base mixes relation badges, inspector attributes and tutorial nav CSS | Tool contract tied to Source/Data inspector |

Concrete cleanup before a destination port:

1. Remove PoC Application, renderer, registry, `gnr-set` and data-widget coupling;
   use the current component declaration, Source projection and Data writer.
   Publish generated metadata for Python; do not duplicate a Python definition.
2. Separate generic rows from relation-model badges, filesystem icons, attribute
   inspector and tutorial navigation styling. Adopt existing theme/touch conventions.
3. Decide canonical selection and identity semantics. PoC paths, legacy identifiers
   and current inspector reset behavior are not interchangeable. Mutation of a
   selected node, deletion, same-path replacement and store replacement need rules.
4. Correct the PoC stale selection-element design: `_render()` removes every row
   but leaves `_selectedEl` pointing at the removed element. The next selection
   removes the old class from that detached element while the newly drawn old row
   can remain selected. A focused reproduction using the PoC DOM test harness
   confirmed selection `b` with both `a` and `b` highlighted after a Bag insertion.
   This is a DOM-harness reproduction, not a browser qualification.
5. Define focus and keyboard navigation, selected-versus-focused rows, row actions,
   screen-reader semantics, touch and operation cancellation. Native `<details>`
   alone does not implement a complete keyboard tree.
6. Match **current resolver semantics**. Core RpcResolver returns its cached value
   immediately and exposes a separate pending load; the Data event publishes the
   result. Copying PoC `await node.getValue()` can receive null and fail its Bag
   check. Use the owning resolver contract; do not create a second request cache,
   add promise/object fallbacks or alter Bag dependencies from this workstream.
   Nested wire resolver descriptors also need independent contract verification.
7. Do not turn passive inspector expansion into an implicit endpoint invocation.
   Replacing the provisional inspector requires a separately reviewed equivalent
   contract; a general lazy tree does not automatically satisfy it.

Existing registry, Source callback boundary, Data bindings, theme tokens and
dataRemote are evidence of useful infrastructure. They do not yet establish a
public Bag parameter with tree subscription ownership or a multi-output
selection contract. Those integration points are prerequisites to verify.

<a id="gc-197-035"></a>

## 035 · Proposed bounded plan

Block ID: **GC-197-035**.

These are reviewable increments, **not an approved execution workflow** and not
an amendment to GC-110. Each implementation increment needs explicit owner
confirmation and its own bounded PORT record with destination feedback.

| Increment | Concrete result | Required decisions/dependencies | Acceptance evidence |
|---|---|---|---|
| 1. General Bag tree, including resolvers | One component renders a Bag store, loaded and resolver-backed branches, captions, expand/collapse and one selection with external selection updates. | Bag as sole store is confirmed. `storepath` with absolute/datapath-relative paths is confirmed (§055). Remaining decisions: canonical component name, selection declaration, identity/replacement, outputs, keyboard, current resolver integration, loading/error/retry and cancellation ownership. | Python declaration and generated metadata; selection round trips; updates/disposal/isolation; closed branches do not load; first/expired/coalesced resolution, empty results, failure/retry and stale results after removal/replacement. |
| 2. Directory/IDE usage example | The same general tree displays a directory Bag with resolvers, file icons and activation in a Python-authored example. | Filesystem-provider placement, metadata and application actions; no second store type or whole-IDE transfer. | Qualify the general resolver behavior against directory data, including dot/Unicode filenames, empty directories and explicit file opening distinct from selection. |
| 3. Row presentation and commands | Agreed icons/classes, tooltips, row actions and event payloads; optional inspector integration only after parity review. | Text versus authored HTML; command/Source callback contract; passive inspector policy. | No arbitrary HTML from data by accident; focus and touch action reachability; no duplicate Data writer; inspector regression if selected. |
| 4. Checkbox tree | Tri-state, disabled entries, propagation and outputs. | Lazy descendants, eager traversal, joiner/output policy, `checked` ownership and event/veto rules. | Full state matrix including unloaded/empty branches, disabled descendants, external updates, parent recomputation and no feedback loops. |
| 5. Search and popup | Local search first if approved; remote search and popup are separately scoped. | Literal/regex syntax, match semantics, static/lazy scope, provider contract, cancellation, menu target and close policy. | Ancestor visibility, highlight safety, clear/restore, invalid syntax, stale results, keyboard focus and popup write destination. |
| 6. Drag/drop | Generic gestures express intent with agreed position and payload. | Same/cross-instance scope, keyboard alternative, cycle rejection, mutation owner, constraints. | Before/after/inside, forbidden targets, cancellation, touch/keyboard alternative; no implicit filesystem/DB mutation. |
| 7. Advanced families | TreeGrid, relation/FieldsTree, hierarchy selectors, storage and editing recipes. | Separate column, database, storage/form/editor contracts and capable providers. | Family-specific backend and UI integration suites; no invented common denominator. |

Increments 3–7 can be reordered by the owner's concrete consumer. Increment 1
includes resolver-backed Bag nodes; increment 2 is a concrete consumer and
provider qualification of that same tree. Checkbox/search/treegrid coverage
remains visible even if their implementation is deferred.

Do not ask again about Bag as store, Bag-node resolvers or the `storepath` name
and absolute/datapath-relative paths: the owner has confirmed these. The proposed delivery
sequence, selection/keyboard scope, names and parameters still require review,
one decision at a time, before implementation.


<a id="gc-197-040"></a>

## 040 · Qualification and intentional differences

Block ID: **GC-197-040**.

Before implementation acceptance, specify the old/new behavior and migration
guidance for each changed legacy option: model/store/query replacement; synthetic
scalar children versus inline values; callback naming/context; selection payloads
and `_record`; identity/path behavior; persistence; HTML labels; static/asynchronous
search; checkbox eager evaluation and joins; DND payloads; passive inspection.
An unimplemented option is explicitly unsupported, never silently ignored.

Tests must exercise actual contracts rather than only internal helpers:

- Real Bag insert/update/delete, scalar-to-Bag and Bag-to-scalar changes; store
  replacement; selected node removal/rename/move; batched changes and disposal.
- Root/relative paths, node attributes, read-only and writable bindings, literal
  parameters, multiple instances and no secondary state/Data writer.
- Arrow keys, Home/End, type-ahead if agreed, Enter/Space semantics, visible focus,
  row actions, long labels, RTL, pointer/touch and screen-reader tree semantics.
- Resolvers: current synchronous-read/asynchronous-load behavior, caching,
  coalescing, error, retry, abort ownership, supersession and passive inspection.
- Source/grammar generation and Python-first examples in `gramlot-examples`.
  Core tests use core fixtures and do not depend on the gallery or adapters.
- Chromium, Firefox and WebKit qualification plus visual review in current themes;
  WebKit testing does not establish branded Safari acceptance.

Already-run evidence supplied by the coordinating investigation:

| Check | Result and limit |
|---|---|
| PoC `node --test tests/storetree.test.js tests/storetree-values.test.js` in `js/dom` | 20/20 passed; `/tmp/gramlot-tree-poc-tests.log`. Does not prove keyboard, accessibility or legacy parity. |
| Core `node --test tests/poc-tree.test.mjs` in `tools/gramlot-tools-inspector` | 6/6 passed; `/tmp/gramlot-tree-inspector-tests.log`. Existing dist, not a fresh rebuild or browser run. |
| Legacy Python direct-call AST census | 1,649 files parsed, 90 matching calls, zero syntax errors; static evidence only. |
| Focused PoC selection/redraw reproduction | Select `a`, insert `c`, select `b`: selectedPath is `b` but both `a` and `b` retain `.selected`. Confirmed using the existing DOM harness; no source changes. |

No implementation or browser qualification was performed by this proposal.
No external editor dependency or current browser compatibility recommendation
is made here.

<a id="gc-197-045"></a>

## 045 · Risks and unresolved questions

Block ID: **GC-197-045**.

1. “All options” is a coverage obligation, not permission to import every old
   internal hook. Dynamic extension surfaces remain open and require concrete uses.
2. Lazy loading is a real integration change because current core and PoC resolver
   reads differ. Filesystem or relation services cannot be disguised as tree code.
3. Identity and selection retention must be decided before redraw/refresh work;
   PoC and inspector have conflicting behavior.
4. Complete keyboard/accessibility and focus behavior are not established by PoC
   tests. Whole redraw on every event may also be costly; measure real fixtures
   before proposing virtualization or a new state cache.
5. Legacy persistence and bare-`#` search are disabled/stubbed. Restoring them
   would be new implementation work, not compatibility already supplied.
6. Filesystem provider access policy, database permissions, record transactions,
   document saving and editor lifecycle remain outside generic tree ownership.
7. Legacy source contains its own license notices. Behavioral reimplementation
   and any literal code transfer need the normal provenance/destination review;
   this investigation approves no relicensing.

<a id="gc-197-050"></a>

## 050 · Literal declaration census

Block ID: **GC-197-050**.

Reproduction: enumerate `rg --files -g '*.py'` in the legacy checkout, parse with
Python `ast`, visit `Call` nodes whose `func` is an `Attribute`, casefold the method
name against `tree/treeFrame/paletteTree/quickTree/treeGrid/fieldsTree`, and collect
`keyword.arg`; null names are `**kwargs`. This captures direct declarations only,
not calls constructed by strings or dictionaries.

**tree (75):**

```text
**kwargs, _class, _fired, autoCollapse, border, checkChildren, checkedPaths,
checkedPaths_joiner, checked_abs_path, checked_id, childname, connect_onClick,
connect_ondblclick, cursor, datapath, device_mode, dragClass, dragTags, draggable,
dropTags, dropTarget, dropTargetCb, dropTypes, eagerCheck, excludeRoot, fired,
font_size, getIconClass, getLabel, getLabelClass, height, hideValues, id,
identifier, inspect, isTree, labelAttribute, lbl, margin, margin_top, nodeId,
onChecked, onDrag, onDrag_fsource, onDrag_msource, onDrop, onDrop_gridrow,
onDrop_text_plain, onDrop_treenode, openOnClick, parentMenu, persist, popup,
searchOn, selectedItem, selectedLabelClass, selectedPath, selected_abs_path,
selected_account_id, selected_caption, selected_child_count, selected_code,
selected_connection_id, selected_editing_path, selected_fieldpath, selected_file,
selected_file_ext, selected_formlet_caption, selected_hierarchical_pkey,
selected_pkey, selected_rec_type, selected_rel_path, selected_resource,
selfsubscribe_selectMenuItem, showRoot, storepath, table, tooltip_callback,
width, xisTree
```

**paletteTree (5):**

```text
dockButton, editable, infoPanel, infoPanel_border_left, infoPanel_width,
paletteCode, searchOn, storepath, title, tree__class, tree_connect_ondblclick,
tree_dragTags, tree_getLabelClass, tree_hideValues, tree_onCreated,
tree_openOnClick, tree_selectedLabelClass
```

**treeGrid (7):**

```text
**kwargs, _class, autoCollapse, checked_abs_path, checked_fieldpath,
connect_ondblclick, dragClass, draggable, dropTarget, dropTargetCb,
dropTargetCb_fsource, headers, hideValues, nodeId, onDrag, onDrag_fsource,
onDrop_fsource, onDrop_msource, onDrop_selfdrag_path, selectedLabelClass,
selectedPath, selected_abs_path, selected_file_ext, storepath
```

**fieldsTree (3):**

```text
bottom, box_bottom, box_datapath, box_left, box_position, box_right, box_top,
checkPermissions, dragCode, left, position, right, searchMode, searchOn,
searchOn_searchCode, table, top, trash
```

These are spellings observed in source, including suspicious or inert ones.
They must not be normalized into an invented accepted API.

<a id="gc-197-055"></a>

## 055 · First-port decisions

Block ID: **GC-197-055**.

**2026-10-20 — `storepath` confirmed.** The owner answered “si” to the proposal
“mantenere nell’authoring il nome legacy `storepath`, con percorsi assoluti o
relativi al `datapath`, senza introdurre anche `store` come sinonimo”.
`storepath` is the sole authoring parameter identifying the store Bag. Paths may
be absolute or relative to the component's `datapath`. The component works with
the actual Bag and follows its changes. The Bag-only/resolver contract in §005
remains in force. Naming is recorded in GC-225 §070.

This settles this parameter for the first port, not implementation authorization
or the remaining tree options. Missing-path handling, runtime changes of the
store path and other lifecycle details still need their own explicit review.

**2026-10-20 — `labelAttribute` confirmed.** The owner answered “si” to including
`labelAttribute` in the first port with this behavior: without the parameter,
display the Bag node label; with `labelAttribute='caption'`, display that node's
`caption` attribute; if the chosen attribute is absent, display the node label.
The node key and displayed caption can therefore differ. The exact proposal and
confirmation are in this chat immediately after the `storepath` decision.
This approves the option and stated behavior only, not implementation. Treatment
of present empty/falsy attribute values was not specified by this confirmation.

**2026-10-20 — `hideValues` inclusion confirmed.** Owner: “la hide values va prevista”. Include the legacy-named `hideValues` option in the first port. The preceding proposal described legacy synthetic scalar children and default `False`; the owner's words explicitly confirm inclusion. Final presentation/default details remain to be settled rather than inferred from this short confirmation. The owner also asked whether label callbacks exist: legacy `labelCb` and widget `getLabel` are inventoried in §020; their first-port inclusion and callback contract are still open. No runtime work is authorized by this record.

**2026-10-20 — `labelCb` inclusion confirmed.** The owner answered “ok” to “Propongo di includere `labelCb` nel primo port. Confermi?”. Include the legacy-named callback for computed node captions. The preceding explanation identified the legacy precedence: `labelCb` is used when `labelAttribute` is not set; `getLabel` is a separate widget override. Inclusion of `getLabel` has not been approved. The concrete Gramlot callback signature, invocation context and declaration mechanism remain to be reviewed; this confirmation does not authorize copying legacy callback evaluation or implementing the port.


**2026-10-20 — Sourcerer follow-up on `getLabel` (evidence, not approval).** The owner requested an actual-use check before deciding whether to exclude the option: “dipende dall uso nel codebase: guarda con sourcerer”. Sourcerer `code.search_code` queries `getLabel=` and `getLabel =` returned nine distinct Python declaration sites after collapsing duplicate indexed results by repository, module path and containing symbol. This is an observed set, not a complete census of every possible assignment syntax or deployed application:

- `genropy/common/foundation/menu.py`, `MenuLink.menu_menuPane`: HTML links inside tree captions.
- `genropy/resources/frameplugin_menu/frameplugin_menu.py`, `MenuIframes.menu_iframemenuPane` and `_menutree_getLabel`: captions with icons and optional badges; the helper returns `innerHTML:` when needed.
- `genropy/resources/docu_components.py`, `DocumentationViewer.dc_left_toc`, and `resources/tables/documentation/th_documentation.py`, `Form.th_form`: language-dependent titles with caption fallback; controllers call `updateLabels()` when the language changes.
- `genropynet/webpages/clientpages/feature.py`, `feature_tree`; `webpages/gallery.py`, `main`; `webpages/index.py`, `left_menu`; and `erpy/webpages/profilo_spese.py`, `main`: further multilingual caption consumers. The feature tree subscribes to language changes and calls `updateLabels()`.
- `genropy/webpages/mail_dashboard.py`, `maildashboard_left`: HTML captions with mailbox counters.

The case-insensitive `labelCb` search was paginated (offsets 0 and 50; 50 and 14 indexed modules scanned). Its exact-case tree matches were the TreeGrid callback and tree/store plumbing, plus historical inventory copies; lowercase `quickThermo` callbacks are unrelated. Duplicate indexed versions are not independent consumers. `code.get_symbol_source` confirmed the menu helper implementation. Sourcerer's batch-count endpoint failed, so no counts from that endpoint are used.

Assessment: the proposal to exclude `getLabel` as redundant is premature. Existing application-facing use justifies proposing its inclusion. These findings do not establish that two independent rendering implementations are necessary, nor approve HTML handling, refresh semantics or callback signatures. `getLabel` inclusion still awaits the owner's decision; no implementation has started.


**2026-10-20 — `getLabel` inclusion confirmed.** Following the Sourcerer usage review, the owner answered “ok” to “Propongo di includere anche `getLabel` nel primo port, lasciando da precisare il contratto della callback e la gestione delle etichette HTML. Confermi?”. Include the legacy-named widget caption override alongside the already confirmed `labelCb`. This resolves the previous inclusion question; the concrete callback contract and HTML-label handling remain open. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `getLabelClass` inclusion confirmed.** The owner answered “si” to including `getLabelClass`, described as a callback computing caption CSS classes from the node and its open/closed state. Retain that option in the first tree port. This confirms inclusion and purpose; the concrete Gramlot callback invocation contract, default class attributes and selected-class composition still require review. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `getIconClass` inclusion confirmed.** The owner answered “si” to “Propongo di includere `getIconClass`. Confermi?”, described as a callback choosing icon CSS classes from the node and its open/closed state. Include this option in the first port. The preceding explanation noted that legacy checkbox mode replaces the icon callback; the Gramlot interaction with checkboxes remains to be reviewed with checkbox options. The concrete callback invocation contract remains open. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `labelClass` inclusion confirmed.** The owner answered “si” to “Propongo di includere `labelClass`. Confermi?”. Include the Bag node attribute assigning CSS classes to its caption without a callback. As described in the confirmed proposal, the default label-class calculation reads this attribute; a custom `getLabelClass` replaces that calculation. Open/closed-specific attributes remain separate pending options. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `labelClassOpened` inclusion confirmed.** The owner answered “ok” to including the Bag node attribute `labelClassOpened`, described as caption CSS classes used when the branch is open. In the default label-class calculation it replaces `labelClass` when populated; otherwise `labelClass` is used. This does not change the previously described custom `getLabelClass` override. The closed-state counterpart remains pending. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `labelClassClosed` inclusion confirmed.** The owner answered “ok” to including the Bag node attribute `labelClassClosed`, described as caption CSS classes used when the branch is closed. In the default label-class calculation it replaces `labelClass` when populated; otherwise `labelClass` is used. This does not change the previously described custom `getLabelClass` override. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `selectedLabelClass` inclusion confirmed.** The owner answered “ok” to including `selectedLabelClass`, described as a tree parameter adding CSS classes to the selected node caption. These classes are added to the already calculated caption classes, including those returned by a custom `getLabelClass`. Include this option and composition behavior in the first port. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `node_class` inclusion confirmed.** The owner answered “ok” to including `node_class`, described as a Bag node attribute applying CSS classes to the node container, for example to style its background. Include this option in the first port; `labelClass` separately targets the caption. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `tip` belongs to shared Gramlot behavior, if adopted.** Owner: “tip se si usa dovrebbe essere trasversale a tutto gramlot”. Do not treat `tip` as a tree-specific feature to implement. Its adoption and contract must be reviewed as a shared Gramlot capability; the tree should consume the resulting common mechanism. This conditional direction does not approve a `tip`/`title` alias, a custom tooltip renderer or a new shared API. The tree-specific inclusion proposal remains superseded by this cross-component review requirement. Read-only inspection found no `tip` occurrence in current `js/src` JavaScript sources; existing validation tooltip presentation is not evidence of a generic `tip` API. No runtime implementation.


**2026-10-20 — `openOnClick` inclusion confirmed.** The owner answered “si” to including `openOnClick`, described as allowing a branch to be opened or closed by clicking its label as well as its expansion control. Include this option in the first port. Its default and interaction with selection remain to be reviewed; this confirmation does not adopt additional legacy selection suppression behavior. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `autoCollapse` inclusion confirmed.** The owner answered “ok” to including `autoCollapse`, described as automatically closing other branches with the same parent when a branch is opened. The proposal also stated that legacy filtering suspends this behavior to keep results visible. Include the option with that interaction if filtering is included; this does not independently approve filtering. The default remains to be reviewed. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `selectedPath` inclusion confirmed.** The owner answered “si” to including `selectedPath`, described as a two-way selection binding: selecting a node writes its path relative to the store Bag; changing the bound data value selects the corresponding node and opens the branches needed to show it. Include this behavior in the first port. Missing paths, selection clearing and asynchronous resolver failure/cancellation remain to be specified. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `selectedLabel` inclusion confirmed.** The owner answered “si” to including `selectedLabel`, described as an output binding writing the selected Bag node label into data. This label can differ from the displayed caption calculated through `labelAttribute` or a callback. Changing the output data value does not select another node. Include this option in the first port. Selection clearing remains to be specified with the other selection outputs. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `selected_*` direct attributes confirmed; `_record` must remain under review.** Owner: “ok ma non lasciamo cadere_ record prima di aver capito”, responding to the proposal to include direct node-attribute outputs and decide `_record` separately. Include `selected_<attribute>` output bindings for direct attributes. Do not treat `_record` as excluded or silently defer it out of scope.

Read-only follow-up, using Sourcerer and local legacy sources:

- `genro_tree.js:978–987` reads `item.attr[sel]` first, then `item.attr._record[sel]` when the first result is null, undefined or the empty string. `gnrlang.js:578` confirms that zero and false do not trigger this fallback.
- Sourcerer `HTableResolver.load` (`common/gnrcomponents/htablehandler.py:83–146`) confirms that the hierarchy resolver stores the fetched row as `_record=dict(row)`, while promoting selected structural/caption fields to direct attributes. Related rows carry `_record` only when `related_fullrecord` is enabled.
- Current local `gnrpy/gnr/sql/gnrsqltable_proxy/hierarchical.py:135–175`, `TableHandlerTreeResolver.setChildren`, similarly stores the fetched row as `_record`; direct attributes include caption, child_count, pkey, parent_id, hierarchical_pkey and treeIdentifier. `applyOnTreeNodeAttr` may promote additional fields.
- Not every `selected_*` declaration proves fallback use: `selected_hierarchical_pkey` has a direct attribute in that resolver; mailbox `selected_account_id` has a direct attribute from MailboxResolver. Genropynet gallery uses `selected_title_<language>`, but the documentation table hook promotes those titles to direct attributes. These examples must not be counted as proven fallback-dependent consumers.

Conclusion: `_record` is a producer convention carrying fetched row fields, and fallback enables selection outputs for fields not promoted to direct node attributes. The read itself requires no database access in the tree. This establishes purpose and exact lookup behavior, but is not a complete census of fallback-dependent applications or runtime verification. Proposal pending owner confirmation: preserve this explicit legacy lookup contract in the first port. No implementation, arbitrary nested lookup, normalization or other fallback is approved.


**2026-10-20 — `selected_*` lookup in `_record` confirmed.** The owner answered “ok” to “Propongo di mantenere questa precisa regola su `_record` nel primo port. Confermi?”, following the producer and lookup investigation above. For `selected_<field>`, read `node.attr[field]` first; when absent, null or the empty string, read `node.attr._record[field]` if `_record` is present. Preserve direct zero and false values. This explicitly approves the bounded legacy lookup previously pending review, using data already carried by the Bag node; it does not authorize database access, arbitrary nested lookup, normalization or additional fallback paths. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `selectedItem` inclusion confirmed.** The owner answered “ok” to including `selectedItem`, described as exposing the complete selected BagNode in data, with its label, attributes and access to its value. The proposal explicitly stated that the node itself is passed without copying. Include this output and reference behavior in the first port. Selection clearing and lifecycle behavior remain to be specified; this does not approve automatic resolver loading or serialization of live node references. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `onSelected` and publication confirmed.** The owner answered “si : e includi anche il fatto diu fare dei publish” to including the `onSelected` notification after selection outputs are updated. Include the notification and explicitly include publication through the existing Gramlot messaging system. Reuse the established Source-node `publish(topic, payload)` and application `gramlot.publish(topic, payload)` contracts as appropriate; do not introduce a tree-specific bus, registry or unreviewed declarative publish parameter. Legacy payload evidence remains `{path,item,node}`; the Gramlot representation of the visual-node reference is still open. This approval covers notification/publication, not automatic publication for every other tree interaction. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `onSelectedFire` inclusion confirmed.** The owner answered “ok” to including `onSelectedFire`, described as generating a FIRE event on a Data path upon selection, for example to activate a controller. Include this option in the first port, using the existing Gramlot FIRE contract. This is distinct from the already confirmed `onSelected` topic publication. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `_isSelectable` inclusion confirmed.** The owner answered “ok” to including `_isSelectable`, described as a Bag node attribute whose boolean false value prevents selection, for example on grouping nodes. Retain the legacy name and this selection veto in the first port. The separate legacy `openOnClick`/`child_count` guard remains to be reviewed. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `hasChildrenCb` inclusion confirmed.** The owner answered “si” to “Propongo di includere `hasChildrenCb`, tenendo aperta la regola sui resolver. Confermi?”. Include the callback described as vetoing expansion when it returns false; true allows the ordinary child check to continue rather than manufacturing children. The legacy bypass for never-loaded resolvers, which consults child_count when present, remains an explicit pending interaction decision. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `nodeFilter` inclusion confirmed.** The owner answered “si” to including `nodeFilter`, described as a callback filtering which nodes are displayed without removing them from the Bag. The filter also participates in checking for visible children. Include this option in the first port. This approval does not independently include interactive text search; callback invocation, refresh triggers and interaction with unloaded resolvers remain to be specified. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `child_count` inclusion confirmed.** The owner answered “ok” to including the Bag node attribute `child_count` with the proposed rules for an unloaded resolver: zero presents the node as non-expandable; a positive count presents it as expandable; an absent count treats it as potentially expandable. This supports showing the expansion control without preloading children. Interaction with `hasChildrenCb` and `nodeFilter` remains explicitly open, as stated in the proposal. This does not approve the separate legacy selection-suppression behavior involving `child_count` and `openOnClick`. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `collapseAll` inclusion confirmed.** The owner answered “si” to including `collapseAll`, described as closing all expanded branches in the whole tree or within a specified branch, without loading unresolved children. Include this command in the first port. Its concrete invocation and target representation remain to be specified using the existing Gramlot command mechanisms; no legacy widget reference API is implied. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `expandAll` inclusion confirmed.** The owner answered “si expand all” to including `expandAll`, described as opening branches across the whole tree or within a specified branch, with resolver traversal depth to be decided immediately afterwards. Include this command in the first port. Whether it recursively loads unresolved descendants remains the next explicit decision; the inclusion alone does not settle resolver traversal, cancellation, failure handling or interaction with `autoCollapse`. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `expandAll` depth correction.** After suggesting the `level` parameter, the owner rejected the proposed unlimited default: “no : se non metto è lazi se metto -1 è infinito”. For `expandAll`, omitted `level` means lazy behavior; `level=-1` means unlimited expansion depth. This supersedes the agent proposal that omission means full recursive expansion. The exact operational meaning of lazy behavior (which already-loaded branches are expanded and whether expansion may start a resolver) remains to be clarified rather than inferred. Positive-depth counting was proposed but has not received explicit confirmation. Cancellation, failures and autoCollapse interaction remain open. No runtime implementation.


**2026-10-20 — lazy expansion and resolver levels clarified.** The owner answered “esatto. level 1 espande solo il prio resolver ecc” to the question whether lazy means expanding already-loaded branches without activating resolvers. Omitted `level` therefore expands only already-loaded branches and starts no resolver. Positive `level` values limit resolver expansion levels: 1 expands the first resolver level, 2 includes the next, and so forth. Retain the previously confirmed -1 for unlimited resolver depth. This replaces the earlier proposal counting ordinary tree levels; depth is expressed in resolver expansion levels. Traversal details for branching, expired caches, cancellation and failures still require specification. Interaction with `autoCollapse` remains pending. No runtime implementation.


**2026-10-20 — `expandAll` temporarily suspends `autoCollapse`.** The owner answered “si” to suspending `autoCollapse` during `expandAll` so expanded sibling branches do not close one another, while retaining the configured behavior for subsequent manual expansion. Include this interaction in the first port. This does not permanently change the configured `autoCollapse` value. Cancellation, failures and traversal edge cases remain to be specified. No runtime implementation.


**2026-10-20 — `saveExpanded` inclusion confirmed.** The owner answered “ok” to including `saveExpanded`, described as temporarily remembering which branches are open for later restoration with `restoreExpanded`. The proposal identified legacy in-memory node-identity storage, not cross-session persistence. Include this command in the first port. The identity contract and the complementary restore command remain to be reviewed; this does not approve browser storage or session persistence. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `restoreExpanded` inclusion confirmed.** The owner answered “ok” to including `restoreExpanded`, described as reopening branches remembered by `saveExpanded`. The proposal described the legacy behavior of skipping nodes absent from the visual-node map and deleting the temporary snapshot after restoration; behavior for branches requiring resolver reload was explicitly left open. Include the command in the first port. The identity contract, resolver reload behavior and interaction with autoCollapse remain to be specified. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `identifier` inclusion confirmed.** The owner answered “si” to including `identifier`, described as selecting how the tree identifies nodes, with individual supported modes to be reviewed separately. The proposal explained the legacy default `#id` and attribute-based identities such as `pkey`, including their different behavior when a Bag is reconstructed. Include the parameter in the first port; specific modes, default, uniqueness requirements and replacement semantics are not yet approved by this inclusion decision. No runtime implementation is authorized by this scope decision.


**2026-10-20 — `identifier="#id"` and default confirmed.** The owner answered “ok” to including `#id` and retaining it as the default when `identifier` is omitted. The proposal described the BagNode internal identity as independent of position; recreating a node with the same label does not preserve that identity. Use the owning Bag library identity contract; this scope decision does not authorize generating substitute identities in Gramlot. Other identifier modes remain to be reviewed. No runtime implementation is authorized by this scope decision.


**2026-10-20 — all legacy `identifier` modes included.** The owner first answered “si” to attribute-based identity (for example `identifier='pkey'`), then instructed “mettile tutte” while reviewing the remaining identifier modes. Include the complete legacy identifier mode set in the first port, without further per-mode inclusion questions:

| Mode | Identity source |
| --- | --- |
| `#id` | BagNode internal identity; confirmed default |
| `#k` | Node label |
| `#i` | Node position among siblings |
| `#p` | Label path relative to the store root |
| `##` | Numeric-index path relative to the store root |
| `.child` | Value at the specified child path in the node value Bag |
| Attribute name, e.g. `pkey` | Named node attribute |

Rechecked against legacy `GnrStoreBag.getIdentity`. The instruction includes these modes, not every remaining tree option. It does not authorize copying legacy implementation defects or adding substitute identities. Duplicate/missing identities, changes after move/reorder/replacement and resolver access required by child-value identity still require concrete contracts. Use the owning Bag library APIs; report dependency gaps rather than adding consumer workarounds. No runtime implementation.


**2026-10-20 — checkbox support deferred beyond the first port.** The owner answered “no  i check box arrivano dopo” to including node checkboxes with multiple checked nodes distinct from the current selection. Exclude checkbox support from the first port and retain it as subsequent work. This defers the checkbox-specific option group: activation/state (`onChecked`, `checked`, `checkedPaths`, `checked_*`), propagation (`checkChildren`, `eagerCheck`), tri-state/disabled states, output joiners and checkbox-specific publications. Interaction between checkboxes and `getIconClass` is consequently a later design decision. Previously confirmed ordinary selection, selection outputs and icon callbacks remain in the first-port scope. This is a deferral, not rejection of future checkbox functionality; no later implementation is authorized yet. No runtime implementation.


**2026-10-20 — text search excluded from first port; label badges under investigation.** Owner: “no. ma vedi invece i badge nelle label”, responding to inclusion of text search (`searchOn`). Exclude interactive tree search from the first port, including its search-box integration, matching/highlighting and search-driven resolver/backend traversal; retain the previously approved application `nodeFilter`. Badge investigation is requested, not yet badge implementation or first-port inclusion approval.

Sourcerer searches `badgeContent` and `badgeClass`, deduplicated for inspection, and local source review establish:

- Legacy `MenuIframes._menutree_getLabel` (`projects/gnrcore/packages/adm/resources/frameplugin_menu/frameplugin_menu.py:74–93`) reads node attributes `badgeContent` and `badgeClass` (default CSS `menuline_badge`), appends a span after the caption, and returns an `innerHTML:` label. This is menu-level composition through the tree callback, not a dedicated badge API in the base tree. Null/undefined/empty content is omitted; numeric zero passes the renderer's test.
- `MenuResolver.load` and `nodeType_tableBranch` supply badge content from menu providers or child counts. Menu table-change handlers update `badgeContent` via node `updAttributes`, demonstrating dynamic content. Count providers may explicitly replace zero with null: provider policy is distinct from rendering. Sourcerer also finds application menu configuration using `menuLineBadge` and `badgeClass` in Anaci.
- Legacy tests `tests/web/gnrmenu_tablebranch_test.py` include numeric counts, text and HTML content (a nested dot span). Those tests were inspected through search results, not executed. HTML content must not be silently discarded or implicitly adopted; the label HTML contract remains open.
- PoC `js/dom/src/collections/storetree.js:148–164` has a type badge before the caption, enabled by `typeAttribute`; it reads a dtype and relation direction, sets tooltip/accessibility text and direction-dependent colors. `GnrRelationTree` supplies `dtype`/`relation_direction` defaults. This is specialized relation-tree presentation, not a generic `badgeContent` implementation. No badge matches were found in the inspected provisional core inspector tree.
- Existing Gramlot `js/src/components/selected-container.js` already renders tab `badge`/`badge_color` metadata as text, retains zero, hides null/empty and updates badge content in place. GC-225 records these names as tab metadata, not as a universal badge API.

Assessment/proposal: generic text/number badges beside tree captions, updated from Bag attributes, are a bounded adaptation rather than a direct PoC copy. Existing tab presentation supplies a consistency reference, not an already shared badge component. Dtype/relation interpretation belongs to the supplying application/component, not generic tree domain logic. First-port inclusion, node attribute names (legacy badgeContent/badgeClass versus existing tab conventions), placement, styling, callback composition and HTML remain pending owner decisions. No runtime implementation or new runtime tests.


**2026-10-20 — badges and hover row actions included; syntax requested.** Owner: “si. includi inoltre la possibilita di avere nellhover delle icone un po come quelle nel,inspector per attivare menu , bottoni e funzioni. non so come fare la sintassi: proponi”. This confirms generic reactive badges beside tree captions and adds row action icons revealed on hover, capable of activating menus, buttons and functions, to the first-port feature scope. Exact badge names/HTML behavior and row-action authoring syntax remain unapproved. No runtime implementation is authorized by this scope discussion.

Evidence reviewed: provisional `tools/poc/gramlot-poc-tree.js:155–180` renders `rowActions` descriptor buttons at start/end and emits `tree-action` with action/path/node. Its CSS reveals actions on hover/focus, retains active indicators and exposes actions on touch. Inspector descriptors provide breakpoint/add/remove actions, and consumer callbacks own their effects. `js/src/components/buttons.js` already provides button, dropDownButton, menu and menuline; `js/src/view/button.js` centralizes one click mechanism (action, nested provider or fire). Current rowActions descriptors do not provide composed Source menus or generic per-row command contexts.

**Pending syntax/design proposal, not implemented:** author a `rowActions` Source child of the tree, using existing button/dropDownButton/menu/menuline children and ordinary action/dataController execution. `rowActions` derives from the inspected provisional descriptor name and existing camel-case component conventions; extending it to a Source authoring component requires owner confirmation before application. `position='end'` (or 'start') derives from the inspected descriptor convention. The container is a reusable row-action declaration, not an entry in the data-store Bag. Supply the activated row context as named item (BagNode), path (store-relative) and event arguments to its command execution, without changing current tree selection. Proposed presentation: hover/focus reveal, touch access and no caption movement. Clicking an action should not implicitly select or expand the row. Menus should use the existing command components and stable menuline codes; application effects and publish calls should run through existing Gramlot command/messaging boundaries.

The required integration of Source declarations, per-row command context, rendering/disposal and shared menus is new work, not an already supported API or a direct PoC copy. No ad hoc callback evaluator, second event bus, application DOM wiring or speculative generic repeat/template API is approved. First design decision requested: use this Source composition approach. Detailed context propagation, per-node visibility/disabled state, badge naming and HTML remain to be reviewed.


**2026-10-20 — Source-composed `rowActions` accepted for a trial.** Owner: “proviamola”, responding to the concrete Python proposal with tree.rowActions(position='end'), standard button/dropDownButton/menu/menuline, action/dataController, and item/path/event row context. Adopt this syntax experimentally, not as a verified/final public API. The authoring specimen is `tools/poc/tree-row-actions-fixture.py`; it is a qualification input, explicitly not a runnable page. Python syntax compilation passes. No tree rendering or command behavior has been implemented or tested by this check.

Read-only implementation assessment: the provisional inspector tree supports action descriptors, not Source-composed row controls. Shared ButtonBinding executes actions from authored runtime arguments and nested providers through the current provider contract; automatic item/path row context is not present. Existing command/menu components can be reused, but source-to-row placement and command-context lifetime must be integrated explicitly. No runtime workaround was added.

Next proposed trial design (pending): keep one Source action bar per tree, show it at the hovered/focused row, and retain that row's context while a menu or initiated command is active. This avoids introducing cloned Source subtrees for every data node. It is a proposed ownership/lifecycle contract, not an already approved generic repeater or toolbar projection mechanism. A browser trial remains outstanding until the context/placement contract and implementation are completed.


**2026-10-20 — minimum working tree takes priority.** After accepting a shared row-action bar provisionally (“si per ora si”), the owner redirected work: “per ora facciamo funzionare u tree mi imale e poi aggiungiamo pian paino tutto”. Suspend rowActions runtime work and implement a bounded first working tree. The initial implementation scope is a loaded Bag at storepath, label/labelAttribute, manual branch expansion/collapse and selectedPath binding, with live store updates and disposal. Previously reviewed features remain future increments; no checkbox/search or rowActions implementation is included. Resolver activation is deferred to the next resolver-specific increment. Qualification uses Python-authored core fixtures rather than a new core example runner. PORT-0017-bag-tree will retain evidence and destination review; implementation/testing do not constitute owner acceptance.


<a id="gc-197-060"></a>

## 060 · First working increment — 2026-10-20

Block ID: **GC-197-060**.

Implemented for the owner's minimum-first instruction in §055; destination acceptance is pending. PORT-0017-bag-tree records the bounded implementation and qualification. The tree component reads a loaded Bag from a plain absolute or datapath-relative storepath. It renders node labels or labelAttribute (fallback only when the attribute is absent), opens/closes loaded branches, and binds selectedPath in both directions. External selection reveals its loaded ancestors. A missing selected path selects no substitute and does not rewrite Data. Without a selection pointer, user selection remains local to the component. Empty Bags and scalar nodes are leaves. Resolver-backed nodes are not evaluated by this increment.

NodeBinding owns a subtree registration on the existing DataRouter, including descendant attribute updates. The renderer supplies the Bag through the bagStore capability; the component has no separate Bag subscription. Live inserts/removals, caption attributes, store replacement and Source storepath changes reproject the tree. Open branches retain BagNode object identity while the store is unchanged; replacing the store resets expansion. Source removal/disposal releases registrations. Keyboard arrows, Home/End and Enter/Space support focus and selection. Labels are text, not HTML. storepath must resolve to a Bag; pointers in storepath and attribute selectors are rejected. No alternative store representations or dependency edits were introduced.

Verified: nine tree integration tests; 51 tests across tree, router, component, conformance and rebuilt runtime checks. A Python-authored fixture passes Chromium and WebKit for disclosure, two-way selection, live insert/caption updates, clear, keyboard and disposal. Desktop and mobile screenshots were inspected. The full repository suite also exposes four unresolved Source-identity failures outside the tree (nodeId DOM leakage twice and symbolic #target resolution twice); it is not reported as fully green. See GC-070 §1515 for the run accounting.

The owner asks “prevediamo icona vero ?”. Node icons remain in the already-confirmed scope via getIconClass (§055), distinct from disclosure arrows. This first increment still has only arrows and captions. Icons are the next proposed increment; callback invocation/styling details still need the bounded design. Resolver activation, hideValues, the remaining callbacks/selection outputs/publishes, expansion commands/identifier modes, badges and rowActions remain recorded future increments. No checkbox/search implementation, full legacy compatibility, owner acceptance or release is implied.


<a id="gc-197-065"></a>

## 065 · Styled tree and resolver-backed gallery — 2026-10-20

Block ID: **GC-197-065**.

Owner direction: “ok: fai subito attenzioena mettere classi opportune e mostramelo nella gallery . anzi l'optimum è usare per la navigazione della gallery proiprio il tree nostro”, followed by “nella galleri le sections possono essere resolvers”. This authorizes the connected gramlot-examples integration and the next bounded tree increment. It supersedes the no-icons/no-resolver implementation boundary of §060, not the remaining option-by-option decisions.

Implemented: separate folder/file icons, including open-folder state; structural/state classes and CSS parts for tree/group/node, branch/leaf, row, caption, icon and disclosure. Parts also distinguish selected rows and branch/leaf/opened/closed icons. Existing --gramlot-tree- tokens include row height, hover and selected colors. The gallery and example style those parts through their host classes; no application DOM construction or icon-action descriptors are involved. getIconClass callback execution, node-provided custom classes and hover actions remain separate unimplemented increments.

Manual expansion reads the branch BagNode through getValue; rendering continues to use staticValue. Synchronous and asynchronous node-backed Bag resolvers populate their own store; duplicate pending reads by one tree are suppressed. Collapse while loading is retained, errors returned by getValue are shown on the row and can be retried, and detached components do not render late results. The tree neither owns requests nor aborts a resolver shared with another consumer. dataRemote/RpcResolver retains its existing asynchronous notification and error contract. This qualifies cacheTime=-1 gallery sections; cacheTime=0 reactive stores, readOnly results, resolver-driven external-path traversal and complete resolver error/loading UI are not claimed by this increment.

The gallery declares a navigation Bag and one dataRemote(cacheTime=-1) per section in Python and JavaScript. The navigation tree binds selectedPath to galleryIndex.navigationSelection. The existing index runtime accepts that Bag for deferred container entries, reading only loaded values; it retains tabs, lazy Source/code/explanation loading, retry and mobile behavior. Selecting an existing tab updates tree selection. Remount reconstructs entries from loaded Bag nodes without evaluating unresolved sections. Failed lesson loads restore the active navigation selection, allowing an ordinary second click to retry.

Independent tree collection bundles import Bag from the existing @gramlot/gramlot module. Both server import maps now map that module and @gramlot/gramlot/page to the same runtime URL (including mount prefix); this preserves the real Bag constructor identity without bundling a second runtime or adding duck typing. Example w26 (Input components → Bag tree) supplies Python/JS authoring, a lazy Catalog endpoint, bound selection, live caption/insertion controls and CSS-part styling.

Verification: 12 tree tests; 66 focused core tests; 22 gallery integration tests; six Python gallery and 22 Python resource tests. Real Python and Node galleries pass Chromium/WebKit for unresolved initial sections, one first-load call, cached reopening, example resolver, selection, caption updates, retained tabs and mobile navigation. Desktop/mobile screenshots reviewed. Wider suite limitations are tracked in GC-070 §1520. The work is implemented and specifically verified, pending owner visual acceptance; no publication or deployment.


<a id="gc-197-070"></a>

## 070. Navigation autoCollapse — implemented increment, 2026-10-20

Block ID: **GC-197-070**.

Owner request: “fai nella navigaxione il tree auto collapse”. This authorizes the bounded implementation of the sibling-collapse behavior included in §055 and its use in the gallery. The shared tree now exposes the already approved `autoCollapse` spelling, enabled explicitly in both Python and JavaScript gallery navigation. Omission preserves the existing independent expansion behavior (`false`); this is an opt-in increment, not adoption of the remaining legacy defaults or filtering contract.

Opening a branch by disclosure or keyboard closes expanded siblings in the same parent Bag. Ancestors stay open, and a collapsed sibling retains its descendants' expansion state, selection and cached Bag values. Revealing ancestors for a changed external selectedPath applies the same sibling rule. A resolver completing after its branch was closed cannot reopen it. Collapse does not cancel shared resolver work. Filtering and expandAll are still unimplemented and receive no inferred behavior here.

Verified: all 14 tree tests and 21 focused tree/index-runtime tests; 22 gallery integration tests; six Python gallery tests. The dedicated browser sequence passes Chromium and WebKit on both Python and Node galleries, including sibling collapse, external tab reveal, lazy/cache behavior and mobile selection. The in-app Python gallery was refreshed and sibling collapse observed. Broader known limitations remain in GC-070 §1520; no full-suite success, owner visual acceptance, publication or deployment is claimed.


Tree presentation increment — owner confirmations, 2026-10-20. Owner requests implementing labels, icons, classes and hideValues with gallery examples, and investigating legacy drag/drop eligibility and callbacks. On hideValues the owner chooses “Default False, come nel legacy”: false exposes a scalar value as a visual child; true hides scalar children. Gallery navigation explicitly uses true. Existing component Logic invocation supplies named synchronous callbacks as method(sourceNode, {item, path, opened, selected}); getLabel overrides normal label calculation, otherwise labelAttribute precedes labelCb. Owner adds “Voglio includere anche label HTML ora” and chooses “Preferisco un risultato strutturato testo/HTML” over the legacy string sentinel. Label callbacks return either {text: string} or {html: string}; raw labelAttribute remains text. HTML is sanitized with no scripts/event handlers; it does not execute application actions. Class callbacks return CSS class strings; default node labelClass/Opened/Closed and selectedLabelClass follow the already approved precedence. Custom classes are also exposed as CSS part tokens so application styles can reach the shadow-tree presentation. Scalar child rows are visual content only and select their owning BagNode/path, preserving the Bag as the sole store. Source-scoped callLogic reuses the existing LogicRegistry, without an alternate evaluator. No drag/drop API or implementation is approved by its investigation request.


<a id="gc-197-075"></a>

## 075. Presentation increment implemented — 2026-10-20

Block ID: **GC-197-075**.

The preceding owner-confirmed presentation contract is implemented: hideValues defaults false; scalar visual rows preserve the owning node/path; labelAttribute/labelCb/getLabel precedence; structured text/HTML results; synchronous Logic callbacks; node and open/closed/selected caption classes; custom icons and shadow CSS parts. DOMPurify sanitizes explicit HTML. Navigation declares hideValues true. Gallery w26 is now under components/tree/01_basics; w27 covers attribute labels and classes, w28 covers callbacks, HTML and icons. Route keys stay stable. The catalogue has 83 lessons and 22 directory groups. This does not implement the remaining approved tree roadmap.

<a id="gc-197-080"></a>

## 080. Legacy drag/drop investigation and proposed port

Block ID: **GC-197-080**. Proposal only; not an approved API or implementation.

Read-only legacy evidence: gnrjs/gnr_d11/js/genro_dom.js (canBeDropped, getDragDropInfo, onDragStart, onDrop_standard, onDragEnd), genro_tree.js (fillDragInfo/fillDropInfo and onDragStart), and resources/common/gnrcomponents/storagetree.py. Sourcerer usage search for dropTargetCb confirms consumer-specific directory-only acceptance, hierarchy checks involving source identity, and other component consumers. Drag/drop belongs to shared interaction machinery; tree adds node context.

| Responsibility | Legacy contract | Port implication |
| --- | --- | --- |
| Source eligibility | draggable and handler rejection | Explicit opt-in with dynamic veto |
| Payload | onDrag(dragValues, dragInfo, treeItem), onDrag_*; tree text/plain, text/xml, nodeattr, treenode | Named Logic prepares typed data with item/path context |
| Type eligibility | dropTypes plus onDrop_* types, pattern matching | Shared type matching; settle supported matching syntax |
| Tags | dragTags/dropTags; comma OR, AND and negation | Preserve the capability; grammar needs an explicit decision |
| Node eligibility | dropTargetCb and dropTargetCb_* inspect context/data and can reject | Evaluate per hovered node, then validate again at drop |
| Action | onDrop and onDrop_* receive accepted data | Application owns copy/move/link or published intent |
| Feedback/lifecycle | accepted/rejected outlines, dragClass, dragImageNode, dropEffect, drag end cleanup | Shared lifecycle and cleanup, tree-specific row feedback |
| External files | Separate Files path | Explicit additional scope, not implied by internal tree transfer |

The storage tree rejects non-directories via treeItem.attr.file_ext. A generic hierarchy tree does not infer filesystem permissions or execute moves. Legacy generic onDrag false-veto interacts inconsistently with onDrag_* dispatch; this quirk is evidence, not a behavior to copy.

Proposed implementation sequence: (1) approve a shared Gramlot drag/drop contract, with named synchronous Logic for payload and eligibility, and Logic/publish for the drop action; (2) add tree item/path context and gallery examples for accepted/rejected targets and inter-tree transfer; (3) qualify cancellation, cleanup, detached targets and revalidation; (4) decide separately ordering positions, tag-expression grammar, external Files and keyboard/touch gestures. No automatic Bag, disk or database mutation. The first decision is whether the common source/target/payload/acceptance/action machinery belongs to Gramlot generally, with tree supplying its node context.


Shared drag/drop ownership confirmed — 2026-10-20. Owner: “si, facciamolo comune a gramlot. vediamo le opzioni del drag and drop una alla volta come abbiamo fatto per il tree”. The common drag/drop mechanism belongs to Gramlot; tree contributes its node/path context. This confirms shared ownership, not the detailed API, defaults or implementation sequence proposed in GC-197 §080. Review each option separately and wait for the owner decision. First pending option: explicit draggable enablement, proposed false default with reactive binding; no runtime change.


Drag/drop option 1 confirmed — 2026-10-20. Owner replies “ok” to the proposal: draggable defaults False, True enables the component as a drag source (its rows for a tree), and supports reactive binding such as draggable="^.canDrag". This confirms enablement only; individual-node veto, payload and remaining options are still pending. No runtime implementation in this contract-review step. Next option to review: per-drag dynamic eligibility/veto.


Drag/drop option 2 confirmed — 2026-10-20. After clarification that legacy draggable enables dragging and onDrag prepares data and may veto it, the owner replies “si” to retaining the veto. With draggable enabled, the named Logic onDrag callback can cancel the drag by returning false; draggable=False still prevents dragging. Legacy evidence: genro_patch.js applies the tree Source draggable to BagNode rows; genro_components.js fieldsTree uses draggable:true and onDrag to reject folders when draggableFolders is disabled. This confirms veto behavior, not the still-pending payload representation, callback signature or typed-handler dispatch. No runtime implementation. Next option: typed drag payload and its preparation through onDrag.


Drag/drop option 3 confirmed — 2026-10-20. Owner replies “si” to keeping dragValues as a dictionary of simultaneous typed payloads, mutable by onDrag. The callback can add or change plain text and structured application data; a destination can accept the types it knows. The example app/record key illustrates an application-defined type, not a built-in Gramlot type. Serialization and automatic tree payloads remain pending. No runtime implementation. Next option: the payload supplied automatically by tree before onDrag.


Drag/drop option 4 confirmed — 2026-10-20. Owner replies “si” to the tree's automatic payload before onDrag: text/plain is the displayed caption as plain text, including when the caption is HTML; nodeattr carries the dragged BagNode attributes; treenode carries fullpath and relpath, with relpath relative to the store Bag. onDrag can change or remove these entries and add others. Preparing the payload must not resolve lazy nodes. Omit legacy text/xml, which duplicated the caption without producing XML. Serialization details remain pending. No runtime implementation. Next option to review: explicit destination enablement through dropTarget, independently of subsequent type and dynamic eligibility checks.


Drag/drop option 5 legacy clarification — 2026-10-20. Owner conditionally answers “se è come illegacy si”. Read-only verification in genro_dom.js getDragDropInfo shows dropTarget is not an unconditional false gate: dropTarget OR dropTargetCb OR dropTargetCbExtra can establish a target; grid selfDragRows/selfDragColumns also contribute. canBeDropped separately requires a matching dropTypes/onDrop_* type and optional dropTags. Therefore the proposed unconditional dropTarget=False rejection is not confirmed by this conditional answer. Clarify with the owner before recording option 5 as approved. Proposed legacy-faithful ordinary behavior: dropTarget=True enables candidacy, false/omitted does not enable it alone, and declared target callbacks can establish candidacy; acceptance still requires type/tag/callback checks. Grid self-drag special cases and exact reactive semantics remain separate. No runtime change.


Drag/drop option 5 confirmed after legacy clarification — 2026-10-20. Owner replies “ok” to preserving legacy target enablement: dropTarget=True establishes a potential destination; declared dropTargetCb or dropTargetCb_* callbacks can also establish it without dropTarget=True. dropTarget=False is consequently not an unconditional prohibition. Type eligibility and target callbacks still determine acceptance. This supersedes the earlier proposed unconditional False gate, which was never approved. Grid self-drag special cases and exact reactive semantics are not settled here. No runtime implementation. Next option: accepted payload types through dropTypes and typed onDrop_* handlers.


Drag/drop option 6 confirmed — 2026-10-20. Owner replies “ok” to legacy type eligibility: dropTypes is a comma-separated list; at least one dragged type must match an accepted type; an onDrop_<type> handler implicitly contributes its type; without declared types or typed handlers a drop is rejected even with dropTarget=True. Pattern semantics remain a separate pending decision. No runtime implementation. Legacy pattern evidence: gnrlang.js arrayMatch replaces only the first asterisk with (.*), then uses item.match(matchString), giving regex and unanchored matching semantics. The next proposal is explicit whole-type wildcard matching, with * representing any sequence, rather than implicitly inheriting those regex/substring behaviors; this difference requires owner approval.


Drag/drop option 7 confirmed — 2026-10-20. Owner replies “ok” to whole-type matching in dropTypes with * as the only wildcard, matching any sequence: text/plain is exact, text/* and app/* match their respective prefixes, and * accepts any type. No implicit regular expressions or substring matching. This is an explicitly approved departure from legacy arrayMatch, which used unanchored regex matching after replacing the first asterisk. No runtime implementation. Next option: source dragTags; target tag-expression rules will be reviewed separately.


Drag/drop option 8 confirmed — 2026-10-20. Owner replies “ok” to legacy dragTags: comma-separated source tags, declared on the component or inherited; onDrag can add per-drag tags through dragValues['dragTags']; these are combined with declared tags. The reserved entry is treated as drag metadata, not a payload type. No runtime implementation. Next option: target dropTags filtering, including comma alternatives, AND conjunction and ! negation; absence of source tags with an active tag filter must follow the explicitly reviewed rule.


Drag/drop option 9 confirmed — 2026-10-20. Owner replies “ok” to dropTags filtering: comma-separated alternatives (OR), uppercase AND conjunction and ! negation; tag names match source tags. Examples: documenti; documenti,immagini; documenti AND archivio; documenti AND !bloccato. Type eligibility and tag eligibility must both pass. Omitted dropTags imposes no tag filter; a configured filter rejects a source with no tags, even for a purely negative condition, matching legacy behavior. No parentheses, alternate NOT syntax or further expression grammar is approved here. No runtime implementation. Next option: dynamic target eligibility through dropTargetCb.


Drag/drop option 10 confirmed — 2026-10-20. Owner replies “ok” to dropTargetCb as a synchronous named Logic method receiving source/destination context, including target item/path for tree. It returns true to allow or false to reject; it cannot override a dropTypes or dropTags rejection. Evaluate during drag-over for feedback and revalidate at drop. It only determines eligibility; onDrop owns the resulting action. The exact callback argument schema and availability of external payload data during hover remain to be specified; no runtime implementation. Next option: typed target callbacks dropTargetCb_<type>, their dispatch and combination with the general callback.


Drag/drop option 11 confirmed — 2026-10-20. Owner replies “ok” to typed eligibility callbacks dropTargetCb_<type>, naming Logic methods (example dropTargetCb_nodeattr="canReceiveNode"). Each receives the relevant typed data and determines eligibility through true/false; these checks supplement dropTargetCb and any rejection vetoes the drop. They do not implicitly add accepted dropTypes. Invoke a typed eligibility callback only when its type is present in the drag. This explicitly differs from legacy getDragDropInfo, which invokes all declared typed checks even when their payload is absent. Exact argument schema and hover payload availability remain pending. No runtime implementation. Next option: the general onDrop action after successful validation; typed action dispatch and publish details will be reviewed separately.


Drag/drop option 12 confirmed — 2026-10-20. Owner replies “ok” to general onDrop as a named Logic action receiving accepted data and source/destination context, invoked once after all eligibility checks when unhandled accepted data remains. Data already handled by an onDrop_<type> handler is excluded from the general callback; if none remains, onDrop is not called, following legacy onDrop_standard. Application Logic owns Bag changes, application operations and publishing; tree does not automatically copy or move nodes. Exact argument schema, async completion and declarative publishing remain pending. No runtime implementation. Next decision: when multiple present types have specific handlers, dispatch all matching handlers once per type, as legacy does, rather than selecting one preferred representation.


Drag/drop option 13 confirmed — 2026-10-20. Owner replies “ok” to invoking every onDrop_<type> handler whose type is present, once per matching type with its own data, as in legacy onDrop_standard. No preferred representation is chosen automatically. An application needing one aggregate operation uses general onDrop without typed handlers. This does not settle handler ordering, async/error policy or MIME-to-handler-name encoding. No runtime implementation. Next option to review: selfdrop context identifying a drag within the same component, distinct from a drop onto the same tree item; application eligibility callbacks decide whether to permit it.


Drag/drop option 14 confirmed — 2026-10-20. Owner replies “ok” to selfdrop in callback context: true when source and destination are the same component, false for another component. It does not mean the same tree item; source and target item/path distinguish that case. selfdrop does not automatically reject a drop; target eligibility callbacks decide whether to permit internal reordering, external transfers or reject invalid moves. No runtime implementation. Next option: publishing as a drop action through Gramlot's shared messaging contract.


Drag/drop option 15 confirmed — 2026-10-20. Owner replies “ok” to an automatic Source-local onDrop notification on the destination through the existing Gramlot messaging system. Publish once per accepted drop, including when multiple typed handlers run; carry accepted data, source/destination context and selfdrop. Rejected drops emit no such notification. This reports acceptance, not completion of asynchronous application work. Explicit publish calls from application Logic remain available. Exact payload schema and ordering relative to action handlers remain to be specified; no runtime implementation. Next option: dragClass presentation of the drag preview.


Drag/drop option 16 confirmed — 2026-10-20. Owner replies “ok” to dragClass for drag-preview presentation, retaining the legacy name and default draggedItem. Applications can supply a custom CSS class; default styling follows light/dark themes. The source appearance must not remain modified after preview preparation. For tree, the preview represents the dragged row. Fully custom preview content is a separate next decision. No runtime implementation.


Drag/drop option 17 confirmed — 2026-10-20. Owner replies “ok” to custom drag previews authored in Gramlot Source. Default remains the dragged row with dragClass. An application can reference alternative Source content composed of ordinary components and bindings (icon, text, counter, etc.); framework owns temporary preview handling and cleanup. This requires adaptation from legacy grid dragImageNode, which builds DOM directly. Exact Source-reference syntax, preview context and rendering lifecycle remain pending; no new parameter spelling or runtime implementation is approved here. Next option: accepted/rejected destination feedback.


Drag/drop option 18 confirmed — 2026-10-20. Owner replies “ok” to common destination feedback retaining canBeDropped and cannotBeDropped classes, with theme-aware shared styling and CSS parts for shadow components. Tree highlights the target row without changing selection. Feedback reflects the combined type, tag and callback eligibility result and is removed on leaving the destination, cancellation or drag completion. No runtime implementation. Next option: dropEffect semantics for copy, move or link; legacy genro_dom.js onDragEnter sets move for accepted drags and none for rejected ones, rather than exposing this choice in that path.


Drag/drop option 19 confirmed — 2026-10-20. Owner replies “ok” to configurable dropEffect: move (default), copy or link. Report the chosen effect to the browser for cursor feedback and include it in callback and publish context. Application actions perform the actual operation; move never implies automatic Bag mutation. Rejection applies none. This is an approved extension beyond the reviewed legacy onDragEnter path, which sets move/none. Exact effect context field and per-node customization remain pending. No runtime implementation. Next option: source effectAllowed and its intersection with the destination's requested dropEffect.


Drag/drop option 20 confirmed — 2026-10-20. Owner replies “ok” to source effectAllowed: all (default), copy, move, link, copyMove, copyLink, linkMove, or none. A drop is valid only when the destination's requested dropEffect is permitted by the source. No implicit substitution: a copy-only source is rejected by a destination requesting move. This is an approved explicit extension relative to the reviewed legacy path. Modifier-key effect negotiation remains unapproved. No runtime implementation. Next option: additional onDrag_* payload-preparation callbacks, as distinct from typed onDrop handlers.


Drag/drop option 21 confirmed — 2026-10-20. Owner replies “ok” to additional synchronous named Logic onDrag_* callbacks: run general onDrag first, then additional callbacks sharing the same mutable dragValues. The suffix identifies a callback; it neither filters already-present payload types nor creates data automatically. Any callback returning false cancels the drag and stops the sequence. This explicitly fixes legacy behavior that ignores extra callbacks' return values and can bypass the general onDrag veto when extras exist. Relative ordering among additional callbacks and argument schema remain pending. No runtime implementation. Next option: end-of-drag lifecycle notification and cleanup, including cancellation/rejection.


Drag/drop option 22 confirmed — 2026-10-20. Owner replies “ok” to end-of-drag lifecycle: optional named Logic onDragEnd on the source and one automatic Source-local endDrag publish per actually started drag, including cancellation or rejected drop. Context includes origin and the browser-reported final effect, not application-operation success. Framework guarantees preview/class/feedback cleanup even if a callback throws. An attempt vetoed by onDrag before actual start emits no endDrag. Exact argument schema, callback/publish ordering and async handling remain pending. No runtime implementation. Next option: external desktop file drops, distinct from automatic uploads or filesystem changes.


Drag/drop option 23 confirmed — 2026-10-20. Owner replies “ok” to external desktop file drops through a dedicated legacy-style path. Example destination: dropTarget=True, dropTypes="Files", dropEffect="copy". General onDrop receives files (browser File objects) plus destination context. Tree dropTargetCb can restrict reception to folders. Application Logic owns reading, previewing or uploading; no automatic upload or filesystem mutation. This confirms the dedicated files argument, not serialization of File objects across transports. File-type matching interactions with generic patterns/typed handlers and external hover metadata remain to be specified. No runtime implementation. Next option: drop_ext file-extension filtering.


Drag/drop option 24 confirmed — 2026-10-20. Owner replies “ok” to drop_ext with legacy file-extension filtering: comma-separated extensions without leading dots; case-insensitive comparison; omission permits all extensions. A mixed file drop discards disallowed files and supplies the remaining files to onDrop. When none remain, invoke neither onDrop nor an accepted-drop publish. Final filtering occurs at drop based on filenames. No content/MIME verification or extra file limits are implied. No runtime implementation. Next option: routing among nested eligible destination components.


Drag/drop option 25 confirmed — 2026-10-20. Owner replies “ok” to nested-destination routing: the innermost enabled destination under the pointer owns the gesture. If its type/tag/callback checks reject the drop, do not fall through to an outer destination. An inner element that is not a destination does not prevent an enclosing destination from receiving the drop. Each drop has one destination action sequence and one automatic accepted-drop publish. This is an explicit Gramlot contract, not a claim of complete legacy nested-widget equivalence. No runtime implementation. Next option: legacy dragOverCb as a named Logic hover notification, distinct from acceptance checks.


Drag/drop option 26 confirmed — 2026-10-20. Owner replies “ok” to optional synchronous named Logic dragOverCb. It receives drag context, destination and the current eligibility result; tree supplies the hovered row context. It can update interface information/state, but its return value does not determine acceptance (dropTargetCb retains that responsibility). It may run repeatedly during a gesture and is not the final copy/move action. This adapts the legacy raw-event callback to Gramlot Logic; exact argument schema remains pending. No runtime implementation. Next option: structured-payload serialization using the existing typed-data contract, separate from local callback object context and the dedicated File path.


Drag/drop option 27 confirmed — 2026-10-20. Owner replies “ok” to payload serialization: text/* formats carry text; structured Gramlot payloads use the existing shared TYTX contract and preserve supported types. Payload is a snapshot after onDrag preparation, not a mutable reference to the original Bag. Live objects such as Source nodes remain local callback context. Files use the separately approved path. Unsupported nonserializable values cause explicit errors, without arbitrary conversion. Exact wire envelope and external-format handling remain pending; no new codec or dependency workaround is authorized. No runtime implementation. Next option: payload availability during hover, particularly for drags originating outside the current Gramlot instance.


Drag/drop option 28 confirmed — 2026-10-20. Owner replies “ok” to hover data availability: within the same Gramlot instance, retain the prepared payload in per-drag memory so eligibility callbacks can inspect it during hover; clear it at gesture completion. For drags from other instances/tabs/applications, hover checks are preliminary and payload-dependent checks complete at drop. Callback context exposes dataAvailable, distinguishing unreadable-yet data from missing data. Typed data-receiving callbacks run only when the payload is available. This qualifies the previously approved hover checks for external drags. Browser evidence: MDN Working with the drag data store, Protected mode (https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_data_store#protected_mode). No persistent localStorage transfer cache is approved. Exact preliminary-feedback representation and external metadata envelope remain pending. No runtime implementation. Next option: asynchronous drop actions and sequencing.


Drag/drop option 29 confirmed — 2026-10-20. Owner replies “ok” to asynchronous named Logic onDrop and onDrop_<type> actions. Capture payload data before any await. Execute multiple action handlers sequentially, awaiting each before the next; exact ordering among typed handlers remains pending. Automatic onDrop publish still reports acceptance without awaiting application-operation completion. Drag preparation and acceptance checks remain synchronous. Error handling is the next separate decision. No runtime implementation.


Drag/drop design review requested — 2026-10-20. Before answering option 30 (error policy), the owner asks whether the legacy approach could be simpler/more natural and how drag/drop is normally designed. Option 30 remains unconfirmed; suspend the option-by-option sequence while answering. Options 1–29 remain recorded approvals, not implemented runtime behavior. Read-only comparison: browser HTML DND exposes dragstart/DataTransfer/dragover/drop/dragend; Atlassian Pragmatic DND separates source/target data, canDrop, effect and events; React Aria exposes getItems, acceptedDragTypes and collection intents such as onReorder/onMove, plus keyboard/touch/screen-reader support. These libraries are evidence, not a decision to add dependencies. Recommendation under discussion: reduce normal application authoring to payload preparation, acceptance and one drop action; keep gesture mechanics in common Gramlot, and give tree explicit target/position context. Multiple data formats can describe the same logical item, so dispatching all type handlers is a legacy-specific approved policy worth explicitly reconsidering, not a universal requirement. No approval is inferred to supersede existing decisions, add compatibility layers, adopt a library or implement a new API. Sources: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API ; https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_data_store ; https://atlassian.design/components/pragmatic-drag-and-drop/core-package/drop-targets ; https://react-aria.adobe.com/dnd .


Drag/drop comparison and data-first clarification — 2026-10-20. Owner emphasizes acting on data and letting rendering reflect the result, then asks which capabilities React Aria/Pragmatic DND have beyond the proposed Gramlot mechanism and vice versa. Data-first updates are not exclusive to Gramlot: React Aria's documented useListData/useTreeData examples mutate collection state and React renders it. Gramlot's distinct integration is Bag paths/attributes, existing bindings/Source, Python-first authoring, TYTX and Source-local messaging. Built-in declarative Bag move/copy actions remain a proposal, not an approved implementation contract.

Documented gaps in the current Gramlot DND design: full keyboard/touch/screen-reader interaction (React Aria supplies it; Pragmatic's core instead requires accessible alternative controls to be composed), multiple selected drag items, explicit root/on/before/after collection destinations and reorder/move events, external directory traversal, modifier-key copy/move interaction; Pragmatic provides optional auto-scroll/hitbox/drop-indicator packages and core sticky-target behavior. These are absent or undecided in our contract, not claims that they cannot be added. Gramlot's planned tag-expression grammar, typed Logic dispatch and automatic Source publishes are framework conveniences rather than capabilities impossible to reproduce with other libraries' callbacks. Neither external library supplies Gramlot Bag/TYTX/Python/Source integration out of the box. No adoption decision, supersession of options 1–29 or runtime implementation. Option 30 remains unconfirmed.

Sources: https://react-aria.adobe.com/dnd ; https://atlassian.design/components/pragmatic-drag-and-drop/optional-packages/ ; https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines/ ; https://atlassian.design/components/pragmatic-drag-and-drop/core-package/drop-targets .


<a id="gc-197-085"></a>

## 085. Internal drag/drop first implementation — 2026-10-20

Owner: “cominciamo a implementare il drag interno e non quello esterno. pero prevederei il drag tra finestre divrese della stessa radice forse”. Internal drag implementation is authorized; external desktop/application drag is excluded from this increment. The suggested cross-window extension remains under clarification: panels in one Gramlot instance, iframe pages and independent browser windows have different lifecycles. Existing FrameMessages supports direct parent/child publishing with peer sessions; it does not establish a shared root identity across browser windows. No new root protocol, global transfer cache or external acceptance is implemented.

Implemented: the internal DragDropPolicy collaborator evaluates approved declarative destination eligibility: dropTarget/callback candidacy, whole-type * matching, exact typed-handler contributions, reserved dragTags exclusion, comma OR / AND / ! tag filtering, effect intersection and no implicit effect substitution. It is stateless, so it can be evaluated again using current attributes at drop. It does not invoke callbacks, decode handler names or decide action order. It is not yet connected to renderer events or tree rows, and does not make drag/drop available in the gallery.

Verification: 28 tests pass (9 eligibility tests and 19 existing tree tests), zero failures/skips. Coverage includes callback-established candidacy with dropTarget=False, no type match, literal regex metacharacters, negative-only tag filters on untagged sources, all approved effect combinations, reserved metadata and changed destination rules. No browser DND or full-suite qualification is claimed for this increment.

Remaining contract work: exact Logic callback arguments, typed-handler encoding/order, publish ordering/schema and the unconfirmed error policy (option 30). The pending root question does not approve cross-window behavior. No public callback schema has been invented to bypass these open decisions.

Dependency evidence, read-only: installed @genrojs/tytx 0.16.3 serializes {record:{handler:()=>1}} as {"record":{}} and [()=>1] as [null], rather than raising the explicit error required by option 27. assertTransportData currently rejects live Source/DOM references and cycles, but does not reject function values. Strict unsupported-value rejection is therefore not yet guaranteed by the shared transport path. Resolve the serialization gap in its owning project before claiming the approved snapshot contract; no TYTX source or installed dependency was changed, and no local replacement codec or consumer workaround was added.

Next: settle callback arguments and the meaning of shared root, then connect the shared gesture lifecycle and tree payload/row adapter, qualify data-only actions in gallery examples, and recheck snapshot behavior after the transport gap is resolved. This is implemented/tested foundational work, not a completed or owner-accepted drag/drop port.


Cross-window scope clarified — 2026-10-20. In reply to the explicit scope question, the owner chooses “Schede/finestre browser della stessa applicazione”. The authorized internal-drag scope therefore includes separate browser tabs/windows belonging to the same application, beyond panels in one instance. This resolves the scope question in the first implementation checkpoint; it does not establish the application/root membership identifier or cross-window transport protocol. External desktop/application drags remain excluded. Payloads crossing window boundaries must follow the approved serialization contract; local live Source/DOM objects do not become transferable. Existing FrameMessages is evidence for direct parent/child lifecycle only. No cross-window runtime implementation or new test result is claimed by this clarification.

Next callback decision, proposal only: the first onDrag preparation callback follows existing named Logic invocation as method(sourceNode, {dragValues, item, path}). sourceNode is the local declaring Source node; tree item is the local BagNode and path is relative to its store; dragValues is the mutable typed payload dictionary. This preserves approved preparation/veto behavior and keeps live context separate from transferable payload. Exact general/typed drop callback schemas remain pending. No callback signature is recorded as owner-approved yet.


Drag preparation callback signature confirmed — 2026-10-20. Owner replies “ok” to prepareDrag(sourceNode, {dragValues, item, path}): a named synchronous Logic method, with a mutable typed payload dictionary, the local dragged tree BagNode and its store-relative path; false vetoes preparation. Live context remains local. This settles the general onDrag signature only; it does not settle onDrag_* ordering, drop/end callback schemas, cross-window membership or the outstanding serialization gap.


<a id="gc-197-090"></a>

## 090. General drag preparation implemented — 2026-10-20

The approved general onDrag signature is implemented in local preparation. DragPreparation is shared by ordinary Source elements and components declaring the dragSource capability; GramlotRenderer.prepareDrag uses current resolved draggable attributes and the existing HtmlElement/LogicRegistry invocation. Disabled/unmounted sources and absent tree rows return no prepared result, false vetoes, and asynchronous callback results are rejected. onDrag is consumed as runtime metadata in both renderers rather than emitted as inline HTML.

The tree exposes getDragContext for its current rendered rows. It supplies the real BagNode, store-relative path, displayed caption as text/plain (HTML reduced to visible text), a fresh top-level attributes dictionary and treenode fullpath/relpath. fullpath is the BagNode's actual fullpath, including the Data root label; it is not a rewritten path. Capturing context does not inspect resolver values, expand branches or change selection. Obsolete row mappings are discarded on rerender. Python's tree metadata is regenerated with draggable default False and reactive read binding.

Boundary: this increment implements and tests preparation through the real renderer/Logic/component path. It does not install native drag event listeners, commit a browser gesture, serialize payload snapshots, dispatch drop/end callbacks, or enable cross-window drag. No gallery drag demonstration is claimed. A copied top-level nodeattr dictionary is not the serialized payload snapshot; that remains pending the transport gap recorded in GC-197 §085. Additional onDrag_* ordering is still open.

Verification: runtime build passes; the 3,606 JavaScript tests are verified across the main run (3,603 passing, three localhost server tests blocked by sandbox permissions) and the permitted focused conformance rerun (all three passing). Builder Python: 26 tests pass, including onDrag wire/HTML separation. Component Python: seven tests, OK with the pre-existing expected upstream Regex/Union failure. No new expected failures or skipped tests were introduced. The earlier full-run invocation without the repository Python environment failed interoperability imports; the reported run uses the repository virtual environment. Preparation-specific checks cover dynamic enablement, real Logic invocation, payload edits/veto, HTML labels, nested paths, lazy resolvers, component isolation, stale/detached rows and asynchronous-result rejection.

Next required decision: the general onDrop argument schema. Proposed only: method(sourceNode, {dropValues, item, path, source, selfdrop, dropEffect, dataAvailable}). sourceNode/item/path describe the receiving Source and tree node; dropValues contains the accepted payload entries not already handled by typed callbacks. source is a serializable descriptor {pageId, sourcePath, itemPath}: originating page identity, Source node fullpath and tree store-relative path (null for an ordinary element). No live source object crosses windows. This proposal is not approved by the owner's onDrag confirmation. Cross-window application/root membership, typed handler ordering/encoding, publish/end schema/order and the broader error policy remain open.


General onDrop signature confirmed — 2026-10-20. Owner replies “ok” to receiveDrop(sourceNode, {dropValues, item, path, source, selfdrop, dropEffect, dataAvailable}). item/path identify the destination tree node; dropValues contains accepted data not already consumed by typed actions; source identifies the originating page/Source/item without transferring live objects across windows. This confirms the callback envelope, not the exact source-descriptor member names or the cross-window membership protocol. General onDrop invocation can be implemented independently; native routing, typed-handler dispatch/order, acceptance callbacks, automatic publish ordering and end-of-gesture schema are still separate open work.


General dropTargetCb signature confirmed after explanation — 2026-10-20. The owner first answers “non so decidere” to the proposed common onDrop/dropTargetCb context. After the assistant recommends the same data/context for acceptance and action, explaining that dropTargetCb returns yes/no while onDrop changes Data, the owner replies “ok”. Adopt method(sourceNode, {dropValues, item, path, source, selfdrop, dropEffect, dataAvailable}) for the synchronous general target check. dropValues contains available candidate data before typed actions; only a boolean result is valid. This does not settle typed callback signatures, cross-window source-descriptor fields or the broader error policy.


<a id="gc-197-095"></a>

## 095. General drop action and target check implemented — 2026-10-20

Owner-approved general onDrop and dropTargetCb callback envelopes are implemented as separate renderer steps using existing named Logic invocation. invokeDrop receives {dropValues, item, path, source, selfdrop, dropEffect, dataAvailable}, skips empty residual data or an unavailable handler/destination, and awaits asynchronous application work. checkDropTarget receives the same envelope and requires a synchronous boolean. A missing dynamic callback adds no restriction; a detached destination rejects. Each call reads the current renderer record and application Data, rather than caching the eligibility result.

Both attributes remain runtime metadata in Python/JavaScript and do not become inline DOM event attributes. The source descriptor is passed through, without inventing its cross-window identity fields. These helpers do not perform the full drop pipeline: declarative type/tag/effect eligibility, native routing, typed dispatch, accepted-drop publishes, snapshot serialization and cleanup remain separate responsibilities. In particular, a successful checkDropTarget alone is not complete acceptance, and invokeDrop assumes already accepted data with typed-handled entries removed. No automatic Bag move/copy or DOM reparenting is introduced.

Verification: 57 focused JavaScript tests pass (tree, preparation, declarative policy, renderer and runtime bundle); 26 Python Builder tests pass. The runtime build succeeds. New checks verify the exact callback envelope and real destination Source, ordinary elements as well as tree, application Bag attribute writes reflected through normal tree rendering, awaited async actions, empty residual data, handler changes, detached destinations, propagated application errors, boolean-only target checks, dataAvailable propagation and reevaluation after destination Data changes. The earlier 3,606-test suite checkpoint belongs to §090; the whole suite was not rerun after this bounded increment. No browser gesture or gallery drag demonstration is claimed.

Next decision requested: the broader gesture error policy (formerly option 30, still unconfirmed at this checkpoint): preparation errors cancel startup; eligibility errors reject; action errors stop subsequent actions; report errors and clean transient feedback/session state in every case; no automatic rollback of application Data writes already made. Propagating application exceptions from these standalone invocation helpers does not itself establish the complete pipeline policy. Other open contracts include typed callback/handler dispatch and ordering, source descriptor membership across windows, automatic publish/end ordering/schema and the TYTX strict-serialization gap. Native gesture and gallery integration remain unfinished.


Gesture error policy confirmed — 2026-10-20. Owner answers “Sì, questo comportamento” to the explicit policy question: preparation errors cancel drag startup, eligibility errors reject the drop, and action errors stop subsequent actions. In every case report the error and clean transient feedback/session state; do not automatically roll back application Data writes already performed. This confirms the previously open option 30. It does not claim that native gesture routing or its cleanup lifecycle is implemented yet.


Serialization boundary recheck after option 30 — 2026-10-20. Read-only inspection confirms that Gramlot assertTransportData owns rejection of live Source/DOM references and cycles; GC-225 describes that bounded responsibility. It does not validate the complete TYTX registered-type encoding contract. Installed TYTX JSON encoding recursively retains unsupported function values until JSON.stringify silently drops object fields or replaces array entries with null. The confirmed drag error policy requires an explicit preparation error rather than silently altered payloads. No alternate encoder, duplicated type registry or dependency patch has been added. Request a bounded owner authorization for work in genro-tytx to verify and correct unsupported-value loss, with regression coverage; constitution §§13–14 keep this dependency work outside the current Gramlot-only scope until authorized. Native gesture integration remains affected; the already implemented callback steps and their 57 JS / 26 Python verification remain intact.


Unsupported-payload edge deferred by owner — 2026-10-20. In reply to the request to edit genro-tytx, the owner says “no cerchiamo di aspettare: se è un edge case lo valutiamo dopo”. Do not edit TYTX or its installed source. Defer strict unsupported-value rejection and continue the internal-drag primary path using the existing TYTX supported payload types. The known function/undefined loss remains an explicit limitation; this is not a claim that the codec is fixed or that arbitrary JavaScript values can be transported. Existing live Source/DOM and cycle guards remain in force. This supersedes treating that edge as a blocker for the first internal-drag increment, not the eventual strict contract of option 27.


End-of-drag callback/publication confirmed — 2026-10-20. Owner answers “Sì, questo contratto” to onDragEnd(sourceNode, {source, dropEffect}), followed by the local endDrag publication carrying the same data even if the callback fails. dropEffect reports the browser gesture, not success of the application action. Cleanup is performed independently of these notifications. This closes the previously pending basic end-context/order choice; typed handlers, cross-window membership and custom preview authoring remain separate work.


<a id="gc-197-100"></a>

## 100. Native internal gesture increment — 2026-10-21

The confirmed onDragEnd/endDrag contract is implemented after native dragend, independently of application-action success. Cleanup precedes notification; callback failures still allow the Source-local publication. The canonical local topic is captured at startup through the existing subscription mechanism so Source removal can still publish completion. Disposal releases all listeners and transient state. Vetoed/failed preparation is not a started drag.

Within one renderer, DragDrop connects native dragstart/dragover/dragleave/drop/dragend to DragPreparation, DragDropPolicy and the general named Logic methods. Tree getDragContext supplies the actual row and BagNode; ordinary HTML supplies its Source element. The snapshot uses the existing TYTX codec and guard, with text/* kept as text. No resolver is invoked, and DataTransfer carries no live Source/DOM object. Preview classes apply to a temporary clone, never the original. Feedback uses canBeDropped/cannotBeDropped classes and CSS parts. Type/tag/effect policy precedes the dynamic check; drop revalidates against current destination Data. The innermost enabled target owns the decision; a rejected inner target cannot fall through to its parent. Accepted onDrop publication precedes the awaited general action. The action alone changes Data. Error cleanup does not roll back those changes or reinterpret browser dropEffect as action success.

Verification and exact limits are recorded in GC-070 §1560. Gallery w29 supplies Python and JavaScript pages plus shared Logic for copy into an accepting folder and rejection by a locked one. Both Bags and their normal rendering are exercised in integration tests. Browser page loading is verified, but automated gestures delivered dragover only to the origin and ended with none; successful real-browser drop and preview remain unverified. Do not treat synthetic event tests as that qualification.

Not implemented by this increment: cross-window membership/transfer, additional onDrag_* and typed drop dispatch, dragOverCb, custom Source preview, external files, touch or keyboard drag. The existing tree keyboard selection behavior is unchanged. Nested unsupported TYTX values retain the expressly deferred edge case. This is implementation/check evidence, not owner visual acceptance or completion of the full option list.
