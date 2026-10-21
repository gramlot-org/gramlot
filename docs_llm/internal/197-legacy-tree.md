# 197 · Tree investigation and proposed port

Document ID: **GC-197**. Investigation date: **2026-10-20**.

[Expanded counterpart](../../docs/internal/197-legacy-tree.md).

<a id="gc-197-005"></a>

## 005 · Status, authority and scope

Block ID: **GC-197-005**.

**Investigation plus a bounded first implementation (§060); no acceptance or release assignment.**
Owner requested a separate tree investigation, plan, PoC IDE reference and all
legacy options. Small useful scope: Bag hierarchy, expansion, selection,
keyboard, resolver-backed branches and reliable updates. The directory/IDE tree
is a consumer of the same general tree.
Checkbox/search/DND/treegrid/DB/storage are separate, fully inventoried families.
Constitution §§3–8,13–14 and 11.62/11.76/11.77 apply: provisional inspector scope
is not a public tree; JS descriptions generate Python metadata; modern differences
need explicit review. GC-225 governs names. No dependency-source changes,
inferred LOT model, publication or deployment.


**Confirmed store contract — 2026-10-20:** owner: “di fatto un tree ha sempre una
bag come store”, following clarification that any Bag with resolvers includes
disk-directory data. The store is always a Bag; resolvers belong to its nodes.
Directory/database providers supply Bag data, not alternative store types.
Resolver support belongs to the general tree. This supersedes the proposed
local-tree/lazy-tree split, without approving implementation, remaining APIs,
provider services or delivery sequence.

<a id="gc-197-010"></a>

## 010 · Evidence and completeness boundary

Block ID: **GC-197-010**.

Baseline HEADs (working files may differ): legacy
`fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`, PoC
`10478b57ce3f22e6445eb6b72eba343520cbebac`, core
`d01bf3dc6389ad9bca91ef0f4bdbaafbfcc10242`.
Expanded §010 maps source paths: genro_tree, GnrStoreBag, Dojo 1.1 Tree, tree
patches, wrapper components, dev FieldsTree, th_tree/htablehandler, storagetree,
GNRIde; PoC storetree/IDE/filesystem; core inspector tree and current components/
RpcResolver. AST census parsed 1,649 rg-visible Python files without errors:
75 tree, 5 paletteTree, 7 treeGrid, 3 fieldsTree calls. Expanded §050 preserves
all literal keyword names. Dynamic kwargs, callback-generated options, generic
Source properties and third-party extensions remain open; no universal
compatibility claim or independent qualification of other Dojo versions.

<a id="gc-197-015"></a>

## 015 · The IDE reference

Block ID: **GC-197-015**.

No current PoC implementation is named gnride. Matching tool:
`tools/gramlot-ide/pages/index.py` and `js/dom/src/collections/gramlot-ide.js`;
confirm another historical reference if intended. It uses filesystemtree,
directory_tree Bag, lazy directory resolvers, SVG icons, selection, double-click/
Enter file activation. Filename labels are UTF-8 hex; file metadata is separate.
Generic roots are allowlisted; local IDE explicitly accepts absolute directories.
No tree create/move/delete/upload. Provider/document service owns permissions/save.
Legacy GNRIde has directory **and database** trees. Directory adds search,
nodecaption labels, openOnClick/hideValues, extension filters/exclusions/dropext/
cacheTime and declares ineffective persist. The PoC IDE has no DB drawer.

<a id="gc-197-020"></a>

## 020 · Complete tree runtime option map

Block ID: **GC-197-020**.

Expanded §020 distinguishes observed, disabled and open inherited behavior:

- Python model/store/query/label/showRoot versus forced Bag ForestStoreModel and
  hidden root; storepath, *D/*S, notifications and dynamic replacement.
- identifier #id/#k/#i/#p/##/.child/attribute; labelAttribute/labelCb/getLabel;
  hideValues synthetic scalar child (different from PoC showValues); nodeFilter,
  hasChildrenCb, child_count and resolvers.
- Open/closed/selected label classes, getLabelClass/getIconClass, node_class/tip,
  innerHTML labels; openOnClick/autoCollapse; expand/collapse/Shift and transient
  saveExpanded/restoreExpanded.
- persist/cookie save disabled, load commented; not a working parity feature.
- selectedPath inbound reveal and output; selectedLabel/Item/selected_* with
  _record; _isSelectable/modifiers/onSelectedFire/published selection; popup target.
- Checkbox tri-state, disabled:on/off, onChecked veto, checked/checkedPaths/
  checked_*, checkChildren/eagerCheck, joiners/_valuelabel and checked topic.
- searchOn/searchOn_*/searchCode, searchColumn/searchMode static/async, regex and
  #attribute search, highlighting/ancestors, root search_*/RPC/cache/cancellation.
  Bare # mode is a stub.
- popup/popup_*/closeEvent, tooltip_*, inspect/editable modifier-driven editor.
- Generic Genro drag/drop attributes/callbacks and payloads; inherited Dojo DND
  controller hooks are not proof of working Bag mutation.
- Dojo arrow/Home/End/Enter/letter/RTL focus behavior; generic Source styles,
  connections/subscriptions/lifecycle; structural Dojo overrides.
- Authored excludeRoot/table/fired/_fired/device_mode/isTree/xisTree require
  owning-consumer classification; no established tree consumer for xisTree.

No row multi-selection, virtualization or general inline editing is established.

<a id="gc-197-025"></a>

## 025 · Compositions and specialist trees

Block ID: **GC-197-025**.

Expanded §025 inventories all families and separates ownership:
TreeFrame/PaletteTree (tree_*, editor/info/search/layout/columns);
QuickTree (value-to-storepath convenience); TreeGrid (columns, headers/footers,
cell field/size/dtype/format/contentCb/emptyValue/hidden/class/style and scrolling);
FieldsTree (table/relationExplorer, permissions, record context, trash/drag);
hdbselect/treemenu and hTableTree/htableViewStore (conditions, roots, related
records, search, moves, DB refresh); hierarchical forms/pickers/related operations;
older htablehandler provider parameters; storageTreeFrame (tree_/preview_/store_,
mkdir/download/upload/move); GNRIde and PoC relationTree. DB, storage, form and
document operations are not generic tree responsibilities. Prefixed options and
callbacks remain open extension boundaries.

<a id="gc-197-030"></a>

## 030 · PoC and current core: reuse and gaps

Block ID: **GC-197-030**.

PoC keeps expansion/selection paths over full redraws and store replacement;
selection writes out but has no base inbound setter. `_selectedEl` stays detached
after redraw, permitting stale selected styling: a focused existing-DOM-harness
reproduction selected `a`, inserted `c`, selected `b` and found both rows highlighted
while selectedPath was `b` (not browser qualification). Base mixes DB badges,
inspector attributes and nav CSS. Row actions
are JS-only; native disclosure is not a complete keyboard tree.

Core inspector shows node labels only, with no inline scalar values; it enforces
Bag/null, resets state on replacement, exposes selectedPath/
revealPath/change, queues redraw/focus recovery and has conditional row actions,
hidden/fixed paths and same-instance DND intent. **It never evaluates resolvers.**
Do not replace it without preserving that passive contract.

Current core RpcResolver reads cachedValue synchronously and loads separately;
PoC await-node.getValue expects a Bag immediately. Integrate with the actual
resolver contract; do not add fallback inputs, duplicate loading/cache or alter
dependencies. Nested wire resolver descriptors require verification.
Current component metadata/Source callbacks/Data binding/theme infrastructure is
available, but tree Bag subscription and multi-output selection are not established
public contracts. Remove PoC renderer/registry/gnr-set coupling.

<a id="gc-197-035"></a>

## 035 · Proposed bounded plan

Block ID: **GC-197-035**.

Proposed increments, no approved workflow or GC-110 change:

1. General Bag tree including resolvers: captions, expansion, bidirectional
   selection, keyboard, updates, lifecycle, loading/error/retry and stale-result
   handling. Bag as sole store and `storepath` are confirmed; component name, selection API, identity,
   outputs and integration with the current resolver contract remain to decide.
2. Python directory/IDE-like example using the same tree and resolver-backed Bag:
   filesystem-provider ownership, icons, metadata, dot/Unicode names and separate
   file-open intent. This adds no alternative store or tree type.
3. Row presentation/actions and optional inspector parity.
4. Checkbox propagation and lazy-state/output policy.
5. Local search; remote search/popup separately scoped.
6. DND intent/constraints/mutation owner/keyboard alternative.
7. TreeGrid, relations, hierarchy selectors, storage/form/editor compositions.

Later order follows concrete consumers. Each implementation needs explicit scope
approval and bounded PORT/destination review. Do not ask again about Bag as store
or resolver inclusion, or about `storepath` and its absolute/relative paths; these are confirmed. Delivery sequence, selection/keyboard
scope, naming and remaining API decisions still need review, one at a time.


<a id="gc-197-040"></a>

## 040 · Qualification and intentional differences

Block ID: **GC-197-040**.

Document migration differences for model/store/query, scalar children, callbacks,
selection/identity/replacement, persistence, HTML labels, search, eager checking/
joiners, DND and passive inspection. Unsupported options must not be silently
ignored. Verify Bag mutations/replacement/disposal, bindings/instances, keyboard/
focus/RTL/touch/accessibility, resolver failures/caching/staleness/ownership,
generated metadata/Python examples and browser/theme behavior. Core fixtures remain
independent of examples/adapters. WebKit does not establish Safari acceptance.

Coordinator-run evidence: PoC storetree + values 20/20
(`/tmp/gramlot-tree-poc-tests.log`); core
`tools/gramlot-tools-inspector/tests/poc-tree.test.mjs` 6/6 on existing dist, no fresh
rebuild/browser (`/tmp/gramlot-tree-inspector-tests.log`). AST census: 1,649 files,
90 direct calls, zero parse failures. Focused PoC DOM-harness probe confirmed the
selection/redraw defect above without source changes. No new implementation/browser
qualification.

<a id="gc-197-045"></a>

## 045 · Risks and unresolved questions

Block ID: **GC-197-045**.

Complete option coverage does not approve internal hooks. Main risks: resolver
contract mismatch, identity/replacement conflict, missing full keyboard evidence,
redraw cost, disabled legacy persistence/search stubs, and leaking filesystem/DB/
document responsibilities into core. Measure before proposing virtualization.
Literal legacy transfer needs ordinary provenance/license review; no relicensing
is approved.

<a id="gc-197-050"></a>

## 050 · Literal declaration census

Block ID: **GC-197-050**.

Expanded §050 preserves every literal keyword from the 90 direct Python calls,
including selected_*/checked_*/onDrag_*/onDrop_* variants, prefixed wrapper options
and suspicious xisTree. Reproduce with rg enumeration plus Python AST Call/
Attribute/keyword.arg collection, casefolding the six tree-family method names.
Zero treeFrame/quickTree direct calls in this corpus does not mean absent runtime
implementations. Dynamic dictionaries/strings and kwargs remain outside this
finite call-site inventory; never normalize observed spellings into an approved API.

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


**2026-10-20 — Sourcerer evidence, pending decision.** Owner: “dipende dall uso nel codebase: guarda con sourcerer”. Queries `getLabel=` / `getLabel =` found nine distinct Python declaration sites after deduplicating repository/path/symbol (observed set, not an exhaustive census). Consumers: Genropy foundation menu (HTML links), admin frame menu (icons/badges; `_menutree_getLabel` source inspected), documentation viewer/editor (multilingual titles); Genropynet feature/gallery/index and Erpy `profilo_spese` (multilingual titles); Genropy mail dashboard (HTML counters). Documentation and feature trees explicitly call `updateLabels()` on language changes. Paginated `labelCb` search covered 64 indexed module entries: exact-case tree matches are TreeGrid and tree/store plumbing plus historical copies; lowercase `quickThermo` matches are unrelated. Duplicate versions are not consumers; the batch-count endpoint failed and supplies no evidence. Excluding `getLabel` as redundant is premature; inclusion is now proposed but remains unapproved. Callback signatures, HTML and refresh contracts remain open. No runtime implementation.


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


**2026-10-20 — search deferred; badge evidence.** Owner: “no. ma vedi invece i badge nelle label”. Interactive tree search is excluded from the first port (search box, matching/highlighting, search-driven resolver/backend traversal); approved `nodeFilter` remains. Badges are under investigation, not approved for implementation/inclusion.

Sourcerer (`badgeContent`, `badgeClass`) plus local review: legacy menu `_menutree_getLabel` appends badgeContent in a badgeClass span (default menuline_badge) and returns innerHTML; this is menu composition through getLabel, not base-tree badge support. Renderer hides null/undefined/empty, retains zero; some count providers suppress zero explicitly. MenuResolver supplies counts/provider values; menu handlers update Bag node attributes. Indexed Anaci menu usage exists. Legacy tests include numeric/text/HTML badges; inspected, not run. PoC storetree has a leading typeAttribute badge with dtype/relation colors and tooltip; GnrRelationTree supplies dtype/relation_direction defaults. That is specialized presentation. Existing Gramlot tab badges use badge/badge_color, textContent, zero-visible/null-empty-hidden and in-place updates (selected-container.js; GC-225), not a shared badge component.

Proposal: generic reactive text/number tree badges as a bounded adaptation, keeping dtype/relation interpretation outside the generic tree. Inclusion, naming, placement, styling, callback composition and HTML remain open; HTML support found in legacy must not be silently dropped. Full evidence in paired GC-197 §055. No runtime changes/tests.


**2026-10-20 — badges and hover actions included, syntax pending.** Owner: “si. includi inoltre la possibilita di avere nellhover delle icone un po come quelle nel,inspector per attivare menu , bottoni e funzioni. non so come fare la sintassi: proponi”. Confirms generic reactive label badges and adds hover icons for menus/buttons/functions to first-port scope. Exact badge names/HTML and action syntax remain pending; no runtime implementation.

Inspected inspector rowActions descriptors: start/end buttons, tree-action {action,path,node}, hover/focus/touch presentation, consumer-owned effects. Gramlot already has button/dropDownButton/menu/menuline and shared ButtonBinding (one action/provider/fire mechanism). Pending proposal: tree.rowActions(position='end') as Source child composing those existing controls; row context item/path/event supplied to command execution; icon activation does not select/expand the row. New rowActions authoring derives from provisional name and component naming convention, not an existing public API. Per-row Source context/rendering/disposal/menu integration requires new work; no second bus, evaluator or generic repeater is approved. Owner must confirm the composition approach, then context/visibility/disabled details. Full evidence in paired GC-197 §055.


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
