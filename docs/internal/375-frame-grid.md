# 375 · Resident grid and frameGrid composition

Document ID: **GC-375**. Date: **2026-10-28**.

<a id="gc-375-005"></a>
## 005 · Owner scope

Owner confirms the proposed frameGrid with a central grid, composable upper/lower
bars, access to the inner grid and theme-driven presentation: “si : usando il
sistema slot bar nuovo”. The existing system is menu(presentation="bar"), menuline,
groups, spacer and overflow in framePane. Implement this bounded composition;
filter controls/counts are prospective consumers, not an approved filtering API.
The resident read-only grid was separately authorized for explicit values/attributes
Bag rows, structpath or nested struct, with scrollbar below headers and shared themes.

<a id="gc-375-010"></a>
## 010 · Composition and ownership

frameGrid generates an ordinary framePane and center.grid at authoring time using
Builder's existing container mechanism. It returns that real frame Source node.
frame.grid accesses its central grid; frame.top and frame.bottom remain existing
region accessors. The grid owns storepath/structpath/rowMode, is the frameTarget,
and fills the center. Frame attributes including datapath remain on the frame.
Commands use the existing five-field frame message and Source subscriptions.
No new DOM frame, slotbar alias, command registry, state store or toolbar renderer.
Grid/layout collections must be explicitly available; no implicit loading.

The optional grid collection reuses the earlier reviewed resident grid. Current
DataInstaller consumption removes an installed struct Source node after storing its
ordinary Bag in Data, matching the updated dataSetter lifecycle. Layout keeps
headers outside the scrollable body. Grid CSS consumes palette/density tokens;
column headers use a distinct neutral palette (§045); group bands use theme tokens or explicit struct colors. Data and Source remain
owners of application state. No editing, collectionStore, filtering, totals,
quickGrid, export implementation, persistence or independent group scrolling.

<a id="gc-375-015"></a>
## 015 · Verification and disposition

Implemented and verified in the separate current-baseline checkout. [PORT-0026](../../ports/PORT-0026-frame-grid/README.md) retains origin, migration boundaries, commands and evidence. Full JS: 1284 passed; focused grid/frame/menu: 49 passed; Python: 66 tests plus 62 subtests. Chromium/WebKit pass the compiled artifacts, command isolation, reactive counts, five themes in light/dark, narrow overflow, scrolling, identity and disposal. Screenshots inspected. Owner visual acceptance remains pending; no publication or merge.

<a id="gc-375-020"></a>
## 020 · Python authoring

```python
from gramlot import Page
from genro_bag import Bag
from gramlot.collections.layout import mygramlot as layout
from gramlot.collections.grid import mygramlot as grid

class OrdersPage(Page):
    gramlots = [layout, grid]  # add the collection registering orders:refresh

    def main(self, root):
        rows = Bag()
        rows.set_item("r1", Bag(dict(code="P001", price=12.5)))
        root.dataSetter("orders", rows)
        frame = root.frameGrid(storepath="orders", rowMode="values", height="320px")
        struct = frame.grid.struct()
        struct.column("code", name="Code")
        struct.column("price", name="Price", dtype="N", format="0.00")
        frame.grid.set_attr(selfsubscribe_refresh="refreshOrders")
        bar = frame.top.menu(presentation="bar")
        bar.menuline("orders:refresh")
        bar.spacer(flex=1)
        bar.menuline(group=True).span("Orders")
        frame.bottom.menu(presentation="bar").menuline(group=True).span("Read only")
```

Register `orders:refresh` in the application's command collection; its publish
name is `refresh`. The page's named Logic method `refreshOrders(node, message)`
receives the central grid Source node. These remain ordinary commands; frameGrid
does not implement network reload. The runnable qualification fixture provides
its own small command registry and named Logic to demonstrate local Data updates.


<a id="gc-375-030"></a>
## 030 · Gallery presentation and legacy configurator evidence

2026-10-28: owner requests the gallery with external theme selection and supplies
Studio orders as the visual reference. Column headers now use the theme's subdued
surface and ink, group captions are centered, and the unused body area follows
the row background token. The frame-grid-examples worktree provides menu-15 with
normal Data, shared command bars and Python/JavaScript parity. No new struct
properties are introduced by these presentation changes.

The owner then recalls the legacy configurator and proposes opening it as a
floating window from the bar. Read-only investigation confirms the chain:
`resources/common/gnrcomponents/framegrid.py:fg_slotbar_configuratorPalette`
publishes `configuratorPalette`; the grid subscription delegates to
`resources/common/th/th_viewconfigurator.js:configuratorPalette`. The existing
palette is reopened when already present. It contains Cells, Columnsets and
Advanced configuration editors, plus copy-structure and save-view commands.

Cells expose names, formulas, columnset membership, totals, format, sorting and
style editors; columnsets expose title styles and cell styles. Edits update the
Bag at `structpath`, with separate persistence through `saveGridView`. The generic
legacy `genro.dom.styleFields` includes background, color and typography. This
is evidence for a future bounded port, not approval to copy the configurator or
its Dojo structures. At this earlier checkpoint, colors/multiline properties and the first
configurator scope remained open (styles/order are superseded by §035); the proposed floating must use existing Gramlot
floatingPane/menu/Data mechanisms. No configurator is implemented here.


<a id="gc-375-035"></a>
## 035 · Legacy column ordering, resize and presentation — 2026-10-28

Owner requests SVG and visual quality (“usiamo molto icone svg ... piu belli”),
then “le colonne devono essere drggabili e resizabioi andando a mpdoficare il dat
nella struct”. The supplied split-band screenshot clarifies that moving a column
retains its group; the owner then instructs “cerca di copiare il meccanismo legacy
senza inventare”. This supersedes the initial nested Data representation and the
open style questions in §030. It does not add the proposed floating configurator.

Read-only source evidence: genropy `gnrpy/gnr/web/gnrwebstruct/gridstruct.py`
columnset/cell authoring, `gnrjs/gnr_d11/js/genro_grid.js` mixin_moveColumn,
setCellWidth and columnsetsAndFooters_autodata; PoC `src/gramlot/grid.py` and
`js/dom/src/collections/grid-interactions.js` confirm the same Data mechanism.

The single struct Data representation now follows that legacy vocabulary:

- `view_0.rows_0`: ordered scalar cell nodes, with field/name/type/format/width.
- `info.columnsets`: scalar group definitions labelled by code.
- Each grouped cell retains `columnset=<code>` independently of its position.
- `background` and `color` style a group; `white_space` on a cell accepts normal,
  nowrap or pre-wrap. The gallery uses existing theme palette variables.

Source `grid.struct().colgroup(...).column(...)` remains unchanged. Its consumed
DataInstaller compiles to the above Bag. There is no old-shape fallback and no
new multiple-view authoring API. Arbitrary manually supplied old nested Data is
not supported; it was the earlier local proof, not a published compatibility path.

Dragging the leaf header reorders the existing cell nodes with Bag.move. Group
bands are derived from contiguous runs, so a group may appear multiple times and
rejoin when adjacent. Width commits through the original cell node's width
attribute. During pointer resize the DOM owns a temporary preview; pointerup
commits, Escape/pointercancel/disposal cancel. Replacing or externally changing the
struct cancels a stale preview. Arrow keys resize; Shift uses a one-pixel step;
Alt+Arrow on a column header reorders it. Committed widths are pixels, with a
40px default interactive minimum. Native column drag is desktop-qualified;
touch reordering has not been qualified.

Headers and body share column geometry and keep the scrollbar below the headers.
Rows remain mounted through struct changes. All column captions align on the lower
header band. SVG replaces example text-symbol icons; group bands have rounded
upper corners, multiline rows grow with their notes, and shared tokens control
striping, typography, borders and body background. No shadow persistent state.

Verified: 1288 JavaScript tests, 16 Python authoring/frameGrid tests, runtime build,
example Source parity, Chromium/WebKit pointer resize and Data write, preview
cancellation, keyboard resize/reorder, group split/join, geometry, overflow and
active-gesture disposal. Gallery checks cover five themes in both modes, retained
identity, normal commands, SVG and multiline heights. Visual acceptance remains
with the owner. Cell editing, configurator and persistence remain out of scope.


<a id="gc-375-040"></a>
## 040 · Compact group bands and icon toolbar — 2026-10-28

Owner requests shorter, more rounded group bands and borderless SVG toolbar
commands with subtle hover. Group spacers previously inherited the body-cell
height; they now share border-box sizing, zero vertical padding and the group
height with the colored bands. Theme heights are Base 24px, Compact 22px, Mimi
20px and Joanna 22px; Mela inherits Compact. Upper corners use radius-lg.
The gallery removes its explicit button surfaces/borders and selects the existing
menu labelPosition=tooltip, iconSize=20 presentation. Shared menu hover, focus,
accessible names and overflow remain the existing implementation.

Verified builds, Python/JavaScript Source parity, Chromium/WebKit grid interactions
and ten gallery theme/mode combinations. Final Mimi inspection measured a 20px
band and 5px corner radius, transparent normal button surface/border, hidden visual
caption, retained tooltip/accessible name and a 10% foreground hover. No API or
Data contract change. Owner visual acceptance remains pending.


<a id="gc-375-045"></a>
## 045 · Distinct neutral column headers — 2026-10-28

Owner asks column headers, and potentially row headers, to have a conventional
gray header appearance rather than the frame background. Column headers now use
an independent neutral light/dark background/text pair, dedicated edge color and
a subtle top highlight/relief. These live in the shared grid theme tokens;
light-dark follows the existing theme color-scheme. Group bands retain their
explicit colors. The demo number field remains an ordinary Data column; this
increment does not infer row-header semantics from its name or position.

Verified: core/gallery builds, Chromium/WebKit five themes in both modes,
retained identity and command behavior; final Mimi light/dark screenshots and
computed colors confirm gray headers distinct from the green frame surface.
No authoring API, Data shape or gesture change. Visual acceptance pending.


<a id="gc-375-050"></a>
## 050 · Generated row headers — 2026-10-28

Owner: “metti anche i numeri di riga con lo stle degli header e fai le righe che
si possano draggare in altezza se voglio aumentare altezza”; clarification:
“ogni singola riga puo avere altezza variabile”. Each row must be independently
resizable. Row-header presentation is implemented: `rowHeaders=True` generates
ordinal `scope=row` headings with the same neutral gray tokens and relief as
column headers. Numbers follow Bag order and removal, without a business-data
field. The gutter stays visible during horizontal scrolling. Column resize and
reorder account for the additional presentation column.

Manual row resizing is pending the owner's answer to whether a height change
belongs only to the current grid or is shared by grids displaying the same row.
The first clarification establishes individual row heights, not ownership across
grids. No height state, store attribute or `rowResize` parameter is implemented.
The proposed reference is the PoC's row-header bottom handle and per-grid heights;
the PoC's private map must not bypass current Source/Data ownership rules.

Verified: 20 focused grid tests; Chromium and WebKit check header/body geometry,
column gestures, themes and retained rows with generated headers. Gallery checks
also cover matching row/column header colors, sequential ordinals, commands and
five themes in both modes. Python/JavaScript menu-15 Source parity passes.
The live preview remains http://127.0.0.1:64551/; reload its FrameGrid lesson.


<a id="gc-375-055"></a>
## 055 · Per-grid row height gestures — 2026-10-28

Owner clarifies: “la riga non puo essere la stessa. se,mai mostra gli stessi dati”.
Rows are distinct presentation objects in each grid; only their displayed data
may be shared. This resolves the ownership question in §050 and supersedes its
pending resize status. Each row can have an independently adjusted height.

`rowResize=True` enables the PoC's bottom-edge handle in the numbered gutter;
it also makes row headings visible. Drag changes only that row. ArrowUp/Down
adjust by ten pixels; Home or double-click restores intrinsic content height.
Escape, pointer cancellation, disconnect or a Data projection during a gesture
cancel its preview. Capturing the pointer on the handle preserves the browser's
double-click target. A gesture without a height change keeps automatic sizing.
The native table content height remains the minimum: multiline text is not clipped.

Committed heights live in `gridRowLayout`, attached to the individual grid's
Source node through the existing internal sourceContext boundary. GridRowLayout
keys heights by BagNode identity; it prunes removed rows and clears on store
replacement. Source-owned state survives DOM detach/reattach, data value changes
and column rearrangements. Sharing a store or struct does not share row heights.
Reloading the example creates a new Source instance and resets these heights.
No business data, struct attribute or Logic instance state is written.

GridRowInteraction handles gestures and temporary DOM previews. Row projection
writes geometry without interleaving layout reads for every row; the existing
layout pass updates accessible values. Styling uses the shared header/theme tokens.

Verified: 23 focused grid tests (both row modes, shared Data with isolated heights,
preview/commit, Escape/pointercancel, keyboard/reset, removal/store replacement and
DOM reconnect), 16 Python tests, menu-15 Python/JS Source parity and builds.
Chromium and WebKit exercise real pointer/key gestures, content minimums,
neighbor-row stability, data-update retention and the existing column gestures.
Gallery qualification covers multiline resize/reset plus five themes in both
modes, header styling, toolbar commands and retained DOM identity. The complete
JS suite passes 1293 tests. Preview: http://127.0.0.1:64551/.
Implementation and checks are complete; owner visual acceptance is separate.


<a id="gc-375-060"></a>
## 060 · selfDragRows draft and movement-contract blocker — 2026-10-28

Owner: “prima vorrei il dra delle righe se si abilita il self dra rows”. The
requested name is the legacy/PoC `selfDragRows`, opt-in (false by default).
Legacy evidence: genropy/gnrjs/gnr_d11/js/genro_grid.js, selfDragRowsPrepare
(lines 665–687), mixin_moveRow (2142–2154), same-grid drop identity (2359 onward).
PoC evidence: js/dom/src/collections/grid-interactions.js, bind/move: same-grid
native dragging and before/after placement mutate the underlying Bag order.

Draft implementation adds the boolean parameter, native drag/drop and theme-token
drop indicators through GridRowInteraction, and GridRows.moveRow delegates to
Bag.move. It handles one row (selection is not implemented), rejects other grids,
clears drag state on projection/disconnect and keeps resize handles separate.
The gallery opt-in has been withheld because verification found the blocker below.
No claim of completed or accepted selfDragRows is made.

The installed Bag JS and the readable websocket-page-stores/genro-bag-js checkout
both implement move as removal → del event → insertion → ins event. During the
del callback the moved node is absent from getNodes(). Gramlot's synchronous Data
projection consequently removes the DOM row and prunes its Source-owned height.
The final Bag order is correct, but the row is recreated and its manual height is
lost. This is observable in both row modes and in grids sharing that Bag.

Evidence: verification/self-drag-move-reproducer.mjs under PORT-0026 emits
`del: [b,c]`, then `ins: [b,c,a]`. Run it with Node from the core worktree. The
focused grid suite has 24 passing and 2 failing tests, both failures asserting
that the moved DOM row must retain identity. This is a dependency contract gap;
no quiet-write/republication, duplicate row-state cache or asynchronous projection
workaround is added. Neither dependency repository nor installed sources is edited.

Constitution §§13–14 require fixing the owning library and keep Bag JS read-only
without explicit owner instruction. The owner has been asked whether to authorize
a bounded Bag JS movement-contract correction plus Gramlot integration, or receive
a handoff report. That answer is pending. Decide the concrete move-event contract
in the owning library, verify observers there, then integrate and rerun the grid
regressions and browser drag checks before enabling selfDragRows in the gallery.


<a id="gc-375-065"></a>
## 065 · Logical order, rank attributes and header sorting — investigation, 2026-10-28

Owner corrections: “non deve servire cancellare”; “vai a vedere come faceva il
legacy e tieni coto che i riordion po esweerre solo logico”; then proposes a
precomputed numeric attribute on each node depending on ordering and requests a
thorough examination including header-click sorting. This is an investigation and
ordering-contract discussion, not authorization to choose a new attribute name or
mutate Bag JS. The assertion in §060 that Bag JS must be changed before row dragging
is too broad: it applies only to the draft's physical Bag.move path. A logical
view order has no such prerequisite. The earlier Bag JS authorization question is
superseded while this contract is examined. No dependency edits have been made.

### Verified legacy evidence

Inspected local Genropy checkout HEAD fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea;
PoC HEAD 10478b57ce3f22e6445eb6b72eba343520cbebac. Paths below are repository-relative;
line numbers locate the inspected implementation, not a promise of immutable lines.

| Mechanism | Observed responsibility and evidence |
| --- | --- |
| Manual self drag | `gnrjs/gnr_d11/js/genro_grid.js:665` installs same-grid row drop. An optional onSelfDropRows overrides the default; otherwise moveRow calls storebag.moveNode with reason `movingRows` (2142). Selection is saved/restored by identifier (3267). |
| Bag movement | `gnrjs/gnr_d11/js/gnrbag.js:1379` extracts and reinserts the same node. Internal _pop/_insertNode emit del/ins carrying the reason. It is not a record deletion, but is a physical container reorder. This is not evidence that every grid order must mutate a Bag. |
| Persistent manual position | `genro_grid.js:1915` maps a counter column to counterField; updateCounterColumn (3663) renumbers only when configured. `genro_components.js:7636` forwards selection counter changes; Python apphandler/misc.py:60 updates the explicit database field. This is an optional data-writing route, not ordinary derived ordinal metadata. |
| Header click | Dojo `_grid/publicEvents.js` calls setSortIndex; `dojo_libs/dojo_11/dojo_src/dojox/grid/VirtualGrid.js:642` selects ascending for another column and toggles direction for the same column. No third “unsorted” state or modifier-key multi-sort is established by that handler. |
| Sort declaration | `genro_grid.js:2691` applies canSort / column sortable. The collection-grid patch_sort (4764) forms field:direction using field_sorter or field_getter, publishes setSortedBy and updates a bound sortedBy. The older Bag-grid path (3044) distinguishes row values from attributes and adds case-insensitive text sorting. |
| Multiple sort criteria | Struct cell.sort values are collected into comma-separated sortedBy in `genro_grid.js:2072–2094`; this is evidence of a compound sort specification, not of multi-column mouse gestures. |
| Resident and virtual stores | `genro_components.js:7230,7286` sort resident Bag data. VirtualSelection.sort (7841) deliberately does nothing locally; `genro_grid.js:4797` invalidates paged caches, and loadBagPageFromServer (genro_components.js:8100) requests the server selection using sortedBy/start/count. Sorting one loaded window cannot order a full server selection. |
| Derived numeric position | Python `gnr/sql/gnrsqldata/selection.py:206` setKey('rowidx') assigns zero-based sequential positions; sort (558–583) recomputes rowidx when it is the selection key. apphandler/get_selection.py:320 establishes it for named selections. rowidx changes with order and is not record identity. This is the closest precedent for the proposed precomputed ordinal, but the server first sorts its selection list: it does not prove a rank-only implementation. |
| Logical visible mapping | `genro_components.js:6898` absIndex maps visible positions through _filtered; filtering uses node rowidx when present (7041). Virtual row lookup uses rowidx, chunk size and page position. Thus identity, source position and visible position already differ. |
| View-only sorting | `gnrjs/gnr_d11/js/gnrstores.js:276` creates a separate result array of node references; the fetch handler (250) sorts that result, leaving the Bag container order untouched on this path. |

### PoC evidence and its limit

`js/dom/src/stores/bag-rows.js:177–205` builds row references, filters them, then
sorts a copy for its visible rows. It does not rewrite the underlying Bag for a
header sort. `grid-interactions.js:49–51` explicitly rejects manual row moves while
sorting or filtering is active. Its manual drag route still moves Bag nodes and
uses store.batch to defer projection. Those are separate mechanisms; copying its
manual movement alone missed that context. No such batching workaround is ported.

### Implications for the proposed rank attribute (proposal, not approved API)

Separate four meanings: stable identity; current derived rank; visible row number;
and optional persistent/manual order. A node's numeric rank can represent a
logical order without changing Bag membership or physical sequence. Example:
physical nodes A,B,C with derived ranks A=2,B=0,C=1 display B,C,A. Rendering moves
existing row elements and retains their heights; no removal/insertion Data event
or database record change is required.

A rank is the result of an ordering rule, not a substitute for the rule. Header
sorting supplies field(s), directions and comparison semantics; the owner of that
view computes positions. Compare actual typed values (including numeric, decimal,
date and null), not formatted cell text. Equal values need a deterministic tie
rule so ranks and pagination do not oscillate. A changed sort key invalidates
ranks; a non-sort cell change should not reorder rows. For server-owned full
collections, compute the global order there and transport positions with windows.

If two views share the same data node but have different orders, a single shared
rank attribute cannot describe both. Place it on the node belonging to the ordered
view/selection, or explicitly declare that the order belongs to the shared store.
The owner's proposed node attribute does not yet settle that ownership or name.
Do not introduce a parallel per-grid order array as an unapproved substitute.

Filtering should not confuse a collection's global rank with the visible 1..N
header number. Recompute the visible numbering independently. Removal, insertion,
store replacement and retained identities need defined behavior. Publish a newly
computed ordering coherently; avoid triggering a full sort once per rank attribute
written during renumbering.

Manual drag and field sorting require an explicit transition rule. The PoC blocks
drag under sort/filter. An alternative would let a drag establish manual order,
clearing the active field sort. That alternative is only a proposal: showing a
“price ascending” header while permitting arbitrary contradictory row positions
would be misleading. A single current rank also cannot restore a previous manual
order after sorting unless that previous ordering is represented separately.
Whether restoration is required remains open, rather than inventing a second rank.

Header implementation must distinguish a click from column drag/resize, show the
active direction, support keyboard activation and respect non-sortable columns.
Legacy canSort, sortable, sortedBy and field_sorter supply candidate vocabulary;
none of those new grid APIs or rank names is approved by this investigation.

### Current work and next decision

The existing row headers and per-grid row heights remain implemented. selfDragRows
is still a disabled draft; its physical-move regression remains 24 pass / 2 fail.
The latest work is read-only legacy/PoC analysis plus maintained documentation;
no new runtime tests or completed sort implementation are claimed. First settle
who owns the ordered view/rank and how drag interacts with active sorting, then
rewrite the draft around that contract. A Bag JS change is not a prerequisite for
the logical-order direction proposed by the owner.


<a id="gc-375-070"></a>
## 070 · Multicolumn sorting over Bag values — owner requirement, 2026-10-28

Owner: “attenzione dobbiamo consentire il sort multicolonna e il sort va fartto
considerando valori nella bag”. Sorting must accept an ordered sequence of column
criteria, each with its direction. Compare the first criterion, then subsequent
criteria only when the preceding values compare equal. A single-column-only
implementation does not satisfy the requested scope.

Comparison reads actual values from the Bag using the explicitly declared rowMode:
field values in value-backed rows, node attributes in attribute-backed rows. Cell
formatting, localized display strings and DOM text are not comparison inputs.
This applies to numbers, dates and other supported typed values. The derived rank
must reflect the complete ordered criterion sequence. Header interaction must be
able to express multiple criteria; the exact gestures and indicator treatment are
not yet selected. Null placement, text collation and equal-key tie behavior remain
contract details to settle, not implicit new coercions or fallback representations.

This confirms two requirements of §065, not a completed implementation or an
answer to its outstanding rank-ownership question. selfDragRows remains a disabled
draft; no runtime or dependency changes were made for this clarification.


<a id="gc-375-075"></a>
## 075 · One node index drives row presentation — owner decision, 2026-10-28

Owner: “in pratica al sort si mette un numero finzine dell'orcdinamentio. se invece
faccio il self drag forzo indice e il ridisegno fa il resto. ovviamente il ridisefno
non rispetta l'ordine vero ma solo l'indice”. This establishes the ordering mechanism:

- Multicolumn sorting compares actual Bag values as specified in §070 and computes
  a numeric presentation index on each row node.
- Self drag directly changes presentation indexes to express the requested order.
- Redraw follows those indexes rather than the physical Bag node sequence.
- Sort and drag share this index as the ordering authority. Do not persist a second
  independent row-order array. Temporary computation of an ordered sequence is
  not a second source of truth.
- Physical Bag.move, deletion/reinsertion and database record deletion are not
  required by this path. This supersedes the physical movement draft in §060.

Example: physical Bag sequence A,B,C and indexes A=2,B=0,C=1 produce displayed
sequence B,C,A while preserving the data nodes. Existing row presentation and
manual height remain associated with stable node identity, not the changing index.
A drop must maintain a coherent order for the affected rows, rather than assign
a duplicate index with an undefined tie. The exact metadata attribute name,
initialization/update publication contract and header gesture details are not
chosen in this statement. Sharing one indexed node necessarily shares its index;
independently ordered views require distinct ownership of their row metadata.
The owner's statement settles the index-based mechanism, without inventing the
future collection-store hierarchy or its view-node representation.

The old selfDragRows code/tests currently still exercise physical movement and
must be revised to this contract. No runtime change or completed sort behavior is
claimed by this decision record. The previous Bag JS change request is obsolete
for the agreed presentation-index implementation; dependencies remain untouched.


<a id="gc-375-080"></a>
## 080 · Exact legacy ownership of ordering — verified, 2026-10-28

Owner asks: “ora verifica nel legacy con la massima precisoome come era fatto e
se era il collection store a fornire ordinamento”. This section refines §065 and
explicitly separates observed legacy behavior from the new index contract in §075.
Genropy inspected revision: fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea.

### Modern included grid: criteria in the grid, ordered access through the store

In `gnrjs/gnr_d11/js/genro_grid.js`, NewIncludedView (4440) delegates rowByIndex to
collectionStore().gridRowByIndex, absIndex to the store, and rowFromBagNode and
identifier lookup to store methods. collectionStore() (4841) resolves the Source
store object's instance, subscribes to updateRows and identifies VirtualSelection.
The store sortedBy and the grid sortedBy are coordinated; this is not a completely
passive grid, but ordered row access is a store responsibility.

Header click → Dojo setSortIndex → NewIncludedView.patch_sort (4764) constructs
field_sorter/field_getter plus a/d, publishes setSortedBy, updates a bound sortedBy
and calls sortStore. sortStore (4797) sets store.sortedBy. For a resident store it
calls store.sort(), invalidates filtering and refreshes row count. For a virtual
store it clears cached pages and refreshes row count instead of sorting locally.
The basic header handler constructs one criterion. Multiple criteria are supported
by the store/Bag sort specification and struct defaults; this does not establish a
legacy modifier-key multicolumn header gesture or a third unsorted click state.

### Resident path

`gnrjs/gnr_d11/js/genro_components.js`:
- _Collection.getItems (6874) returns getData().getNodes().
- BagRows.itemByIdx (7139) maps through absIndex, then indexes getItems().
- _Collection.gridRowByIndex (6978) delegates to rowByIndex/itemByIdx, or reads
  getItems directly when ignoreFilter is true.
- ValuesBagRows.sort (7230) forwards its comma-separated sortedBy to data.sort.
- AttributesBagRows.sort (7286) qualifies each criterion with #a. and calls data.sort.
- Selection inherits AttributesBagRows (7372).

GnrBag.sort (`gnrbag.js:791`) sorts the actual _nodes array, retaining the node
objects. It reads field values or attributes, not formatted cell text. Comma-
separated criteria are processed from last to first. Its legacy comparator handles
Date values, nulls and optional case-insensitive text; this is evidence, not blanket
approval to copy all its coercion or runtime-dependent stability details.

Thus the resident store supplies the visual sequence by sorting its backing Bag.
It does not universally assign a rank attribute and have the grid sort on that rank.

### Virtual path and rowidx

VirtualSelection.sort (`genro_components.js:7841`) is a deliberate no-op. Its
itemByIdx (7999) applies the store's visible-index mapping, computes page and offset
from chunkSize, then retrieves that node from the cached/fetched page. A page
request (loadBagPageFromServer, 8100) carries sortedBy, row_start and row_count.

Python apphandler/get_selection.py:249–253 sorts and refreezes an existing named
selection when its sortedBy differs; its output generator at 327 slices only after
that ordering. SqlSelection.sort (`gnr/sql/gnrsqldata/selection.py:558–583`) sorts
the selection and recomputes rowidx when used as the key. setKey (206) assigns
sequential zero-based rowidx; getSelection (320) establishes it for named selections.
rowidx identifies a position within that selection/order, not stable record identity.
Some virtual lookup/filter paths use it explicitly; ordinary paged access uses the
page/offset sequence. It is not a universal renderer sort key.

### Older grid and manual self drag are distinct paths

VirtualStaticGrid.setSortedBy (`genro_grid.js:3197`) directly calls
storebag().sort, and rowByIndex (3422) reads storebag().getNodes() after its local
filter mapping. That older grid does not delegate through a collection-store object.

The common selfDragRows default (665,2142) still calls storebag.moveNode with
reason movingRows, saving/restoring selection; NewIncludedView.storebag (4585)
returns collectionStore().getData. The optional counterField route can persist a
manual position, but the default does not implement a rank-only drag algorithm.

### Executable investigation check and conclusion

PORT-0026 verification/legacy-ordering-probe.mjs reads the inspected legacy source
and executes the actual relevant JS methods with narrow fixture collaborators.
Verified for both ValuesBagRows and AttributesBagRows: full multicolumn criterion
propagation, numeric value comparison, changed Bag sequence, retained node identity,
and grid/store filtered positional access. Verified for VirtualSelection: no local
sort, cache reset and RPC parameters including full sortedBy and page coordinates.
Receipt: verification/legacy-ordering-probe.log. This is a targeted method probe,
not an end-to-end legacy browser/server qualification or a core dependency in CI.
Python selection behavior above was traced in source, not executed by this probe.

Conclusion: modern legacy grids obtained ordered positional access from the
collection store. The store used local Bag order or delegated global ordering to
the server. The owner's §075 design (one numeric node index driving redraw, set by
sort or manual drag) is the newly agreed Gramlot mechanism, not a claim that all
legacy grids already worked that way. A suitable responsibility to retain is:
grid headers/gestures request ordering; the collection/view supplies ordered rows.
This investigation neither introduces a full collectionStore API nor changes the
approved initial Bag-backed component scope. Runtime code remains unchanged.


<a id="gc-375-085"></a>
## 085 · Collection store owns indexed ordering — owner decision, 2026-10-28

Owner: “quindi facciamo gestire l'ordinamento al collection store, con l'indice sui
nodi. la grid chiede il sort multicolonna o il riordino da drag e ridisegna secondo
l'indice”. This assigns responsibility for the §075 index mechanism explicitly:

- The collection store owns the ordering operation and numeric node indexes.
- A multicolumn sort request supplies ordered criteria and directions; the store
  compares actual Bag values using the declared row representation and computes
  the indexes. Formatted cell text is not a sort input.
- A self-drag request asks that same store to reorder rows by updating indexes.
- The grid requests these operations and renders the store's indexed order. It
  must not calculate an independent order, rewrite physical Bag order or maintain
  an authoritative per-grid permutation alongside the store indexes.
- Row identity and per-grid presentation height survive changes of index. Two
  grids consuming one store consume that store's order. Independently ordered
  views require distinct store/view ownership rather than conflicting indexes
  written by independent consumers to the same shared nodes.

This supersedes the initial direct-GridRows/Bag.move implementation assumption.
It authorizes the bounded ordering responsibility in the collection-store layer;
it does not imply that remote providers, loading/saving, editing, filters or the
full collectionStore/dataProvider authoring surface already exist or are selected
for this first increment. The current core has GridRows for resident Bag reading,
not an implemented collection-store ordering service. Introduce that responsibility
before wiring header gestures and self drag; retain the existing direct storepath
entry as previously allowed while defining its resident-store integration.

No runtime changes were made in recording this responsibility decision. The old
physical selfDragRows draft remains inactive and must be replaced, not kept as a
compatibility path. Remaining implementation details include the index metadata
name, coherent index initialization/publication, the first store construction/
ownership contract, multicolumn header gestures and the drag/active-sort transition.


<a id="gc-375-090"></a>
## 090 · Bag collection store and indexed grid ordering — 2026-10-28

Owner implementation instruction: “ok procedi con il collection store sulla Bag e
collega sort multicolonna e selfDragRows della grid, usando l'indice sui nodi come
abbiamo detto”. This implements §085 and replaces the physical-move draft.

The bounded resident implementation is BagCollectionStore. BindingRuntime supplies
one resource per Data Bag identity through the component sourceContext. The shared
store requires one explicit rowMode, values or attributes. Existing storepath
therefore obtains the resident store automatically. This does not introduce the
future public collectionStore/dataProvider authoring syntax.

**Canonical Data:** each row node carries zero-based rowidx; sortedBy belongs to
the Data node containing the collection Bag, using legacy field:a,other:d syntax.
The runtime cache stores resource identity, never committed order or criteria.
Indices are not record identifiers. Initial unindexed rows follow Bag insertion
order; existing indices take precedence. Membership changes append new rows in
manual mode and compact indices; an active sort is reapplied on Data changes.
Rendering calls getRows, which reads indices only. It never reapplies sorting.
An external rowidx-only update therefore remains an index update, not a sort.

The page's existing single Data subscription forwards relevant changes to resident
stores before consumer delivery. No extra Bag subscriptions or application state
on Logic are introduced. Store index writes remain ordinary observable Data
attribute changes. A transient updating flag defers grid projection until the store
finishes publishing indices and criteria, then store listeners render the completed
order. This is not a new Bag transaction/rollback facility: ordinary Data observers
still receive the individual writes. DOM detach releases grid listeners; reattach
projects the current store. Retargeting switches the store and per-grid row layout.

**Sort:** explicit ordered criteria compare loaded raw Bag values, never formatted
cell text. Numbers and Decimal compare numerically without dropping decimal
precision; dates compare temporally; strings use deterministic case-sensitive
ordering; booleans compare false before true. Missing/null values come first in
ascending order and last in descending order. Ties retain the prior indexed order.
Mixed incompatible types, non-finite values, resolvers, duplicate/invalid criteria
and invalid indices are rejected. Sort keys are validated before metadata writes.
rowidx is reserved ordering metadata and cannot itself be a sort criterion.

**Grid interaction:** click or Enter/Space sorts one column; repeat reverses it.
Shift-click or Shift+Enter/Space adds a criterion or reverses it at its existing
priority. SVG arrows and numeric priorities describe the sort; aria-sort identifies
the primary criterion and labels describe secondary criteria. Column drag and
resize remain distinct. selfDragRows stays opt-in; it requests moveRow on the
store, updates only rowidx and clears sortedBy to enter manual order. It never
calls Bag.move, deletes/inserts nodes or writes cell values. Shared grids receive
the same order; their individual row heights remain Source-owned and independent.

Verification: 1,309 JS tests pass, including 39 focused store/grid checks; 16 Python
authoring tests pass; menu-15 Python/JS source parity passes. Core browser fixtures
verify both row representations, raw numeric and multicolumn header sorting,
physical Bag order preservation, drag, stable DOM/height, shared order (unit),
resize and disposal. Gallery verifies indexed drag and multicolumn sorting with
five themes in light/dark mode in Chromium and WebKit. Receipts are in PORT-0026.

**Browser limit:** the bundled WebKit loses the first pointerdown after a native
HTML drag, independently reproduced without Gramlot or DOM mutation. The core
browser test completes that pointer cycle on a non-draggable label before testing
pointer resize; Chromium runs the uninterrupted sequence. No browser fallback or
delayed store mutation was added. This qualifies isolated WebKit gestures, not an
uninterrupted WebKit drag-to-resize sequence. The diagnostic is retained in the
port; no Safari compatibility claim follows from this headless-engine test.

The local FrameGrid gallery enables selfDragRows. Implementation and the checks
above are complete; owner acceptance of the running result remains separate.
Remote/paged providers, filters, editing, selection and independently ordered
child stores are outside this increment. Dependencies remain unmodified.

Visual verification also reserves header space for the SVG direction and sort
priority, so narrow captions ellipsize without hiding the indicators. Final
focused, full runtime and browser checks pass after this markup/style adjustment.


<a id="gc-375-095"></a>
## 095 · Initial quality review — 2026-10-29

The owner requested a quality assessment and a way to prevent redundant or poorly
structured code. This is an initial review, not a completed audit or approval to
redesign the implementation. No runtime source changed during this review.

Adversarial probes reproduced two failure-handling defects in
BagCollectionStore.#commit: (1) a synchronous Data observer throwing on the first
rowidx write interrupts the remaining writes, leaving indices [0, 1, 0] and the
old sortedBy; (2) a throwing store listener prevents subsequent consumers from
receiving the completion notification, even when index writes have completed.
The failure/reentrancy contract needs review before selecting a correction;
this does not approve generic Bag transaction semantics or dependency workarounds.

A two-column grid probe measured 101 structure rebuilds/projectAttributes calls
for a 100-row sort and 501 for a 500-row sort, with respectively 100 and 500 index
events. These are not full DOM-render counts: the store updating guard defers row
projection. JSDOM timing is diagnostic, not a browser performance qualification.
Receipt: ports/PORT-0026-frame-grid/verification/grid-quality-probes.log.

The existing successful-path test results remain valid but do not cover these
failures. The BindingRuntime store-path traversal and repeated structure processing
need architectural/performance review. Proposed next work: review responsibility
boundaries and ordering invariants, agree any missing failure contract, reproduce
and fix defects with regression checks, measure event/render costs and lifecycle
cleanup, and repeat browser/theme qualification. These are proposals, not approved
new architecture. Consolidation readiness remains unconfirmed.


<a id="gc-375-100"></a>
## 100 · Hardening and delivery-contract boundary — 2026-10-29

Owner: “si procedi con la revisione e bonifica, senza aggiungere funzionalità.
correggi i problemi alla radice e controlla bene che non ci siano ridondanze o
workaround”. This authorizes bounded corrections and verification, not new grid
features or dependency changes.

The store completes its prevalidated index/criteria writes even if synchronous
observers throw, then calls every still-subscribed completion consumer and raises
an AggregateError containing the failures. It does not retry or replay Bag events,
silence writes, roll back application effects or introduce a Bag transaction.
Bag's own observer-delivery semantics are unchanged. Removed listeners are not
called from a stale completion snapshot. A failed initial synchronization is not
cached as a usable store.

Grid store registrations defer projection during an order commit; tree and other
Bag consumers keep ordinary Data delivery. Struct processing follows actual
struct-path changes, including ancestor replacement; row changes no longer rebuild
column definitions. Static path traversal uses Bag.node instead of copying and
scanning siblings. Duplicate Source column validation was removed; required
preflight and installation validation remain distinct. Row gesture naming now
reflects its store dependency. Python frameGrid validates grid parameters before
creating its frame, matching the existing JavaScript preflight. Geometry, theme
palettes, Source-owned row heights and native gestures retain their owners.

A broader routing probe found that a failing normal Data recipient prevents later
recipients from updating. However, tests binding-writes.test.js explicitly require
this fail-fast behavior for SET and FIRE (P12/R10). A proposed continue-delivery
change was withdrawn from active runtime source and tests, pending owner decision.
The owner asked for the mechanism and implications to be explained before deciding;
no approval is inferred. Independent view failures and failures in dependent
application controllers must be distinguished. FIRE cleanup resets its temporary
value; it is not rollback of recipient effects. The existing router contract and
its tests remain unchanged. This remains an open quality/design boundary, not a
completed generic error-isolation fix.

New regression checks cover observer/consumer errors, reentrant order requests,
unsubscription during completion, 500-row shared-grid projection counts, ancestor
replacement/clear, disposal, failed initialization and invalid frame parameters.
Browser measurement is reproducible with minimal-frame-grid-browser.mjs
--measure-ordering (100, 1,000 and 10,000 rows). Timing is diagnostic, not a promised
performance bound or a virtualized-grid qualification. Final receipts are kept in
PORT-0026 verification. Full review closure remains pending the delivery decision.


Final hardening checks: 1,316 JavaScript tests and 18 Python tests pass. Prepared
runtime assets were rebuilt and checked against source. Chromium and WebKit pass
the existing interaction/theme qualification and ordering measurements. At 100,
1,000 and 10,000 rows both engines report zero struct rebuilds and zero component
attribute projections during sort, preserved DOM row identity and unchanged
physical Bag order. Ordinary index event counts remain linear (one per changed
row). On this local run, 10,000-row sort/settled times were 514/1,089 ms in Chromium
and 1,595/6,551 ms in WebKit. These measurements expose the remaining cost of a
fully resident DOM; they are not a large-dataset responsiveness claim. Virtualized
rendering remains outside scope. The previously documented WebKit native-drag /
first-pointerdown qualification limit is unchanged.


<a id="gc-375-105"></a>
## 105 · Legacy external database changes and store refresh — 2026-10-29

Owner requested recovery of the legacy JS mechanism and an assessment of its
relevance to the pending error-delivery discussion. Evidence only: no runtime
port, new provider API or change to P12/R10 is approved by this analysis.

Source: local Genropy checkout /Users/gporcari/Sviluppo/Genropy/genropy,
revision fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea. The inspected files have no local
modifications. References below are repository-relative paths and method anchors.
This is source inspection, not a live database/end-to-end qualification.

### Transport and dispatch

1. gnrpy/gnr/web/gnrwebapp.py, onDbCommitted/_compress_dbevents (lines 131–187):
   accumulated DB events are grouped by table and compressed by primary key after
   commit. Updates merge into an earlier event; insert followed by delete is removed.
   Events carry I/U/D, pkey, optional old_pkey and declared broadcast fields.
2. gnrpy/gnr/web/daemon/siteregister.py, notifyDbEvents (line 706): only subscribed
   pages receive gnr.dbchanges.<table_code>, with from_page_id and dbevent_reason.
   Hidden transactions use the local-page notification path instead.
3. gnrjs/gnr_d11/js/genro_rpc.js, setDatachangesInData (line 535): received changes
   are applied to client Data. Both RPC envelopes and gnrwebsocket.js do_datachanges
   (line 163) call this path. A controller authored in gnrwebpage.py (line 2409)
   decodes typed event fields and publishes dbevent_<table_code> with changelist
   and changeattr. This is distinct from applying record contents to a grid.

### Per-store collection and relevance check

Selection in genro_components.js (line 7372) subscribes to its table topic.
liveUpdate defaults to LOCAL; NO disables it, PAGE accepts its own page, LOCAL
uses isLocalPageId. liveUpdateExcludeReason and freezedStore can reject events.
Accepted events are marked for external origin and appended to pendingChanges.
The named watch externalChangesDisabled is replaced on another incoming batch;
watch itself runs immediately when eligible, otherwise polls every 200 ms
(gnrdomsource.js:1875). This is conditional accumulation, not an unconditional
fixed debounce or a global dependency graph.

Eligibility considers window/client visibility, form state, separate local/external
delays and user activity. Specifically, _editingForm or loadInvisible takes the
window-visibility branch; otherwise form.opStatus can block, then delay/activity
and hasVisibleClients apply. Do not simplify this to “all editing blocks refresh”.
When eligible, pendingChanges is drained before querying; groupByStore reloads.

Selection.onExternalChange (line 7578) deduplicates deletion and insert/update keys.
For inserts/updates it calls runQuery with the existing selection query and an
additional pkey IN changed-keys condition (applymethod disabled for this check).
The result defines willBeInSelection. checkExternalChange (line 7641) compares it
with current membership:

| Previously present | Present in new query result | Action |
| --- | --- | --- |
| yes | yes | refresh row attributes |
| yes | no | remove row from selection |
| no | yes | insert row into selection |
| no | no | no membership change |

Deletes remove existing members. A primary-key change updates the old identity
when found. A nonzero changeCount causes full reload when it exceeds
len()*reload_treshold (default .3), or totals/applymethod/fullReloadOnChange require
it. changeCount sums several membership counts; it is not an exact unique-row
percentage. The event payload is an invalidation hint, not a complete row snapshot.

### Linked views, ordering and editing

_Collection.linkedGrids (genro_components.js:7067) scans Source widgets and caches
those whose store/nodeId + '_store' matches the store nodeId. gridBroadcast simply
iterates this list. It is the store-to-view association, not a database query
planner or a generic relationship-dependency graph.

checkExternalChange saves selections by record identity, updates store contents,
marks mustBeSorted, sorts when a grid is not editing, invalidates filters when
needed, updates row counts and restores selection. Editing grids get pendingSort.
It publishes updatedSelectedRow/onExternalChanged and notifies gridEditor.
For edited fields it can retain the incoming value in _loadedValue instead of
replacing the local editable cell; this is evidence for the earlier baseline /
conflict discussion, not proof of a complete conflict-resolution protocol.

Important implementation limit: batchUpdating(true/false) around this particular
external-change path is commented out. Bag events can still cause intermediate
view work; do not describe it as an atomic “one redraw per batch” implementation.
BagRows.loadData(selfUpdate) separately uses _batchUpdating, showing the intent
without establishing a universal batch contract.

### Virtual selection

VirtualSelection inherits event accumulation but overrides onExternalChange
(genro_components.js:7944). It asks app.checkFreezedSelection using selectionName
and changelist. The server implementation in
gnrpy/gnr/web/gnrwebpage_proxy/apphandler/misc.py, checkFreezedSelection (line 625),
checks deleted/updated keys against the full frozen selection and queries possible
new members against the selection's where/condition. If affected, onExternalChangeResult saves selected keys and reloads; its sort is
server-owned. Changes outside the currently loaded client window can therefore
invalidate the selection. This is directly relevant to the proposed hierarchy of
complete server collection, client window and grid views.

### Relevance to Gramlot — proposal, not implementation

Preserve the responsibility sequence: external change intake → relevant provider /
store → membership/value/order reconciliation → dependent views. Keep this distinct
from arbitrary controller/FIRE execution. A future provider should own database
query relevance; the core store and grid must remain database-technology neutral.
The existing resident store already owns order and a completion notification; this
is the natural boundary to study for coherent view refresh, not a reason to change
all DataRouter error delivery.

The legacy does NOT settle error isolation: linkedGrids/gridBroadcast loops have
no per-view exception boundary; pendingChanges is cleared before async completion;
this path has no demonstrated general rollback, replay or stale-response guarantee.
Reuse the ownership and invalidation model, not these omissions. Independent view
error handling and dependent controller semantics remain the open owner decision.


<a id="gc-375-110"></a>
## 110 · Per-grid deferred pull and invalidation — 2026-10-29

Owner clarifies “uso comunque dei set timeout per disaccoppiare e ogni grid funziona
pull”, then proposes subscribe/publish with affected rows or a complete redraw,
and authorizes “procedi alla revisione tenendo conto di questi aspetti”. This
resolves the open direction in §§100–105: keep generic DataRouter/P12/R10 delivery
unchanged; isolate view rendering through each grid's deferred pull.

BagCollectionStore publishes immutable {full, rows} invalidations to its subscribers.
Rows are stable BagNode identities, not display positions or cell snapshots. The
existing page Data subscription identifies the owning row while traversing the
Data path. Ordinary unsorted row changes publish that row without scanning the
collection. Sorted data reconciles its order first; changed order/criteria,
membership changes and explicit rowidx edits invalidate the full view. Store
replacement remains a binding operation; it releases the old subscription.

Each connected Grid maintains at most one setTimeout(0). Pending row identities
are deduplicated; a full invalidation clears/subsumes partial requests. On the timer
it reads current store values and formats the affected rows or the full projection.
No polling, pushed row-value copies, animation-frame substitute, extra Bag
subscription or alternate ordering representation is introduced. Existing keyed
rows/cells retain their DOM identity. The separate animation-frame callback still
owns geometry measurement, not data refresh.

Struct validation/projection also occurs in the deferred callback; the declared
Source schema remains validated before installation. Partial refresh validates all
requested cell text before touching those cells. Full refresh retains the existing
keyed layout path. Render errors go to the existing error notification channel and
leave the preceding valid cell projection intact; other grid timers continue. A
later notification requests a complete pull after failure. There is no automatic
retry loop or quiet error suppression. Renderer state is only transient dirty work.

Disconnect/removal cancels the timer, clears pending identities and unsubscribes.
Reconnect requests a complete pull. Retargeting cancels the old pending work and
subscribes to the new store. Header reconstruction preserves keyboard focus on the
same field/resize handle. GridRows.read is shared by full and partial formatting;
cell text application is shared, avoiding a second formatting/rendering policy.
The previous isCollectionStoreUpdating predicate is removed: row subtree events
reach grid through invalidations; the binding route still handles replacements.
Tree and other Bag consumers retain ordinary event handling.

Regression coverage includes values/attributes, burst coalescing, one timer per
shared grid, no DOM change before callback, affected-row-only reads, full dominance,
format/struct errors and recovery, removal, retargeting/stale notices, direct index
changes, ordering/drag/resize and stable DOM. Timer-aware tests explicitly advance
the callback boundary; they do not make production notification synchronous.
Browser tests await the deferred boundary and retain the previously documented
WebKit native-drag/first-pointerdown limitation. Large full-DOM render cost remains;
this is not virtualization. No provider/database refresh feature was added.


Verified final revision: 1,323 JavaScript tests pass (including 56 focused
store/grid/frame checks and unchanged P12/R10 tests); 18 Python tests pass.
Prepared runtime bundles were rebuilt and verified against source. Chromium and
WebKit pass interaction/theme checks and 100/1,000/10,000-row ordering measurements:
zero struct rebuilds/component-attribute projections during sort, retained DOM
identities and unchanged physical Bag order. Timings separate synchronous store
work from deferred rendering; the latter still carries full resident-DOM cost.
Receipts: PORT-0026 verification/grid-pull-*.log. Implementation and review checks
complete; owner visual acceptance and any subsequent feature remain separate.


<a id="gc-375-115"></a>
## 115 · Collection filtering and FrameGrid search — 2026-10-29

Owner: “si procedi con filtered nel collection store e collega il searchOn della
framegrid, mantenendo separati filtro e ordinamento e seguendo il legacy”, with
an explicit reminder of the all/column menu and numeric input syntax.

Legacy evidence (Genropy fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea):
`genro_components.js:2027` builds caption:field menus; `genro_grid.js:1354`
builds Auto plus struct columns, optionally restricted by dtype; `:1046` connects
search publications to applyFilter; `:2716` selects the column type;
`genro_components.js:6985` compiles case-insensitive regex or typed comparisons;
`:7024` builds `_filtered` from rowidx; `:6898` maps visible indices. The legacy
store combines filtersets/exclusions as well; those are not ported in this slice.

Implemented responsibilities:

- BagCollectionStore owns the accepted filter in the containing Data node's
  `filter` attribute: `{value, columns, dtype, locale, timeZone}`. `filtered` is
  a derived ordered list of logical rowidx values: null means no filter, [] an
  active filter with no matches. This list is not a copied Bag or a second order.
- getRows() reads the filtered indexed order; getRows(false) reads all nodes.
  Filtering does not write rowidx/sortedBy. Sorting and self-drag operate on the
  full collection, rebuild filtered membership and publish a full invalidation.
  Self-drag retains hidden nodes and clears sortedBy as before. Clearing the
  filter restores the current full order, not physical Bag insertion order.
- Data changes recompute membership before notification; entering/leaving the
  result requires a full redraw. Hidden unchanged-membership rows are omitted
  from partial refreshes. Grids still coalesce notifications and pull later.
  Manual row heights are retained for hidden rows and pruned only on removal.
- FrameGrid searchOn=True composes an ordinary top menu bar/group/SearchBox;
  false keeps the previous composition. A caption:field list or *dtype restriction
  reuses legacy selection syntax. The automatic menu lists all declared columns
  and each column individually. No legacy punctuation-to-field-name coercion is
  introduced: names are the actual declared Bag fields.
- Text/all searches use case-insensitive regex over localized scalar text. A
  selected L/R/N or D field uses =, ==, !=, !, #, <, <=, >, >= with a localized
  numeric operand or a date parsed by the existing date library. Decimal
  comparisons retain precision. H/DHZ and B remain textual searches; this slice
  does not add a typed time/timestamp comparison parser.
- SearchBox owns a 100 ms cancellable draft timer and an inline error. Accepted
  criteria live in the store; shared grids see the same filter. Invalid or
  incomplete drafts preserve the last accepted result. This explicitly improves
  the legacy's missing-operator/no-predicate behavior; it is not claimed as
  byte-for-byte input compatibility. Clear and Escape remove the filter only;
  changing the selected column clears the previous query, as in legacy.
- GridSearch attaches the current store/model resource to the grid Source node;
  the toolbar subscribes to resource replacement and store notices. It contains
  no row copies or independent filter/order state. Core sourceContext resolves
  the existing frame recipient: importing menu-command into an optional bundle
  was rejected because it duplicated Builder identity. No duck typing fallback
  or dependency edit was used.

Verification: full suite 1,336 JS tests on the final implementation;
final targeted/compiled-artifact checks 75 tests, including the added shared-grid
filter regression and Python/JS search composition parity; 19 Python tests.
Chromium and WebKit pass regex/numeric/date search, invalid-draft retention,
clear-with-sort, existing grid gestures, themes, responsive layout and disposal.
The live gallery was also checked with browser locale and an all-column search.
Receipts: PORT-0026 verification/grid-filter-*.log.

Preview: http://127.0.0.1:64552/ → Grid → FrameGrid. Port 64551 currently serves a
separate release worktree and was left untouched. The FrameGrid lesson enables
searchOn and documents its syntax; core remains independent of examples.

Limits: resident Bag scan for filtering and a fully resident DOM; no remote
filtering, filterset UI, editing, totals-on-filter or new tree behavior. Verification
is complete for this slice; owner visual acceptance and publication are separate.


<a id="gc-375-120"></a>
## 120 · Independent collection views — 2026-10-29

Owner confirmation: “si confermo, ogni grid deve avere ordinamento e filtered
propri condividendo gli stessi dati. procedi e metti in gallery un esempio con
due grid ordinate e filtrate diversamente”. See constitution
[Independent grid collection views](../00-constitution.md#gc-000-grid-view-ownership)
and GC-225 for the recorded ownership and names.

**Historical record:** the shared rowidx/sortedBy/filter ownership in earlier
sections is superseded by this section. The shared BagCollectionStore now owns
resident data access and change publication. Each grid Source owns a
BagCollectionView with a node-identity index, sortedBy, filter and derived filtered
positions. Views reference the original BagNodes and values; sorting, filtering
and dragging never reorder the physical Bag or write business attributes.
Existing attributes named rowidx, sortedBy or filter are ordinary data, not view
state. A field named rowidx can be sorted like any other loaded scalar field.

A view connects/disconnects its parent subscription with its grid. Data changes
reconcile every connected view using that view's criteria and publish immutable
full/row invalidations. One failing subscriber cannot skip sibling views; errors
are propagated after collection delivery. Each grid still coalesces its deferred
pull redraw. The general DataRouter/P12/R10 contract is unchanged. Replacement
Bags preserve the grid's criteria and rebuild its identity index. Manual drag
clears only that view's sort, retaining its filter and hidden records.

Grid sortedBy and filter are read-bound declarative requests, suitable for initial
criteria or subsequent reactive requests. Unchanged requests do not reset
interactive choices during unrelated projection. There is no implicit writeback.
Filter locale/timeZone inherit the page context. Declared component parameters
are validated by their builder schema rather than the scalar-only HTML attribute
rule; ordinary DOM attributes retain scalar validation. No dict-to-string
coercion or special-case filter bypass was added.

Click an unsorted header for ascending order; another click reverses it and uses
that column alone. Shift-click adds an ascending criterion or reverses an
existing criterion in place, preserving all other criteria and priorities. For
Category ascending / Quantity descending: click Category, Shift-click Quantity,
then Shift-click Quantity again. Header arrows and priority numbers expose the
result; tooltips and gallery instructions explain the gestures.

The gallery's fifth Grid lesson, Two grids, independent views, uses one attributes
Bag with separate search bars. First: Furniture, category:a,quantity:d. Second:
quantity >= 2, quantity:d,price:a. A shared quantity update visibly reorders the
first and changes membership in the second. Both Python and JS author the same
Source; browser locale is inherited.

Verification: 1,331 full JS tests, including 64 focused collection/grid/frame tests;
19 Python tests; six grid Python/JS Source parity checks; prepared artifacts;
Chromium and WebKit interaction/theme/search checks; live gallery initial mixed
sorts, shared update and independent search. Receipts: PORT-0026
verification/grid-view-*.log. Preview: http://127.0.0.1:64552/ → Grid → Two grids,
independent views. No dependency edits, remote-store behavior or publication.
Resident filtering scans and fully resident DOM remain the existing limits.
Implementation and verification complete; owner visual acceptance is separate.


<a id="gc-375-125"></a>
## 125 · Search presentation and dedicated lesson — 2026-10-29

Owner requested a substantially more polished search tool: “arrotonfato con la
lente come sottofobdo, la crocetta per svuotae interna che compare solo se c’è
testo”, plus a dedicated gallery example explaining search.

SearchBox now presents one rounded capsule with an integrated native column
selector, muted SVG lens inside the input area, and an internal SVG clear button.
CSS :placeholder-shown hides the clear button for empty input without storing a
second visibility state or shifting geometry. Keyboard clearing/focus, native
column selection, filter parsing, debounce and collection-view ownership remain
unchanged. Shared field/surface/text/border/focus/error tokens drive colors and
height across themes. Hover and focus are subtle; reduced-motion disables the
transition. Styling follows the existing gridStyles module convention in
components/grid-search-styles.js (gridSearchStyles), not page-local overrides.
The capsule has a bounded responsive width and stays visible in a narrow toolbar.

The seventh Grid lesson, Search · text, numbers and dates, uses one FrameGrid and
eight typed sample rows. Three short guide cards explain text, numeric and date
queries. Its Explanation tab includes expected results, all-column versus typed
search, invalid drafts, clearing, sort preservation and restricted searchOn
menus. The Python-first page and its JS equivalent contain no custom filtering or
DOM logic and inherit browser locale and gallery themes.

Verification: 52 focused grid/frame tests, seven Grid Python/JS Source parity
checks, eight gallery navigation/sample-data checks, rebuilt core/gallery bundles.
Chromium and WebKit pass the existing interaction/search suite and ten theme/mode
combinations, plus internal clear visibility/geometry/focus and 390px toolbar
checks. Live gallery verifies the new lesson, lamp search (two rows), ISO date
comparison (five rows), and clearing. Receipts: PORT-0026
verification/grid-search-design-*.log. Implementation and checks complete; owner
visual acceptance remains separate. No filtering API, dependency or router change.

Fixture preparation note: this environment's Bag.to_tytx convenience method
produced an invalid ::JS::X suffix. The canonical genro_tytx.to_tytx serializer
produces the correct Data Bag wire format and was used to author the static sample.
No dependency patch or consumer normalization was introduced; the convenience
method defect belongs to the Bag/TYTX owning projects.


<a id="gc-375-130"></a>
## 130 · Search visual correction and contextual instructions — 2026-10-29

Owner rejected the previous appearance: “il bordo blu attorno è orrendisimo”,
requested no syntax examples inside the field, a small circled information icon
that opens instructions, and a background distinguishing the column label.
This supersedes §125's outer focus halo and visible syntax placeholder.

The capsule is shorter, flat and uses a neutral focus border. Its column selector
has the shared subtle-surface background; the query area contains only the muted
lens until typing. The internal clear remains conditional. A circled SVG info
button opens contextual text/numeric/date instructions in a native auto popover,
positioned with the existing positionPopup helper. Escape/outside click dismiss
it. The control exposes an accessible label, dialog association and expanded state;
keyboard focus on buttons/select remains visible without the blue halo. No new
filter logic, parallel visibility state or application workaround is introduced.
The dedicated gallery lesson remains and its Explanation describes the info icon.

Verification: 12 FrameGrid tests and the rebuilt bundle pass. Chromium/WebKit
check native instructions open/close, numeric context, accessible expanded state,
no outer focus shadow, empty placeholder, conditional clear and narrow layout,
alongside the existing theme/interaction suite. Live gallery appearance and info
click verified. Receipts: PORT-0026 verification/grid-search-info-*.log.
