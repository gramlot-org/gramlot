# PORT-0026-frame-grid

**2026-10-28: implemented and verified; owner visual acceptance pending.**

Owner confirms a central grid, composable top/bottom bars, access to the inner
grid and themes: “si : usando il sistema slot bar nuovo”. This explicitly selects
the current menu(presentation="bar") system. [GC-375](../../docs/internal/375-frame-grid.md)
defines the bounded implementation; GC-225 records naming before implementation.

## Origin and destination review

Legacy frameGrid composes framePane/includedView and exposes frame.grid. bagGrid
adds its store and automatic commands separately. Reviewed legacy source:
genropy/genropy a135c9d949d0b014a22f57c418e83b315f85e7bf,
resources/common/gnrcomponents/framegrid.py, SHA-256
9193952dc6ddf711eac6b5a9270701456171ad1e1f94dfae8d7a1c069e57ed28.
No legacy code was bulk-copied. The reviewed resident Bag grid developed in the
older local core is transferred onto baseline 1be04a2, which has the actual shared
menu/frame/command system. Its earlier PORT-0023-grid-and-stores identifier collides
with this baseline's PORT-0023-menu-expansion, so this destination record uses the
new PORT-0026 identifier; the earlier receipt is not overwritten or reinterpreted.

frameGrid uses Builder's existing Source-generating container mechanism. It returns
a real framePane, containing center.grid with frameTarget=True. No new frame DOM,
slotBar alias, toolbar renderer, recipient resolver or command dispatch path.
The grid remains optional, explicitly loaded alongside layout. Its original
storepath/structpath/rowMode contract and separate GridRows/GridStructure/Grid
responsibilities are retained. Current DataInstaller removes the installed struct
Source declaration, matching the current dataSetter lifecycle. Grid column headers use
the shared subdued surface/ink pair; group bands use the theme header color pair. No dependency source edits or compatibility
layer were introduced.

## Verification

- `npm --prefix js run build`: passed; includes the prepared grid collection in both distributions and the wheel asset gate.
- `cd js && PATH=../.venv/bin:$PATH GRAMLOT_TEST_PYTHON=../.venv/bin/python npm test`: 1284 passed, zero failures/skips on this baseline, confirmed with Node 22.14.0 ([summary](verification/full-js-summary.log)).
- Focused grid/frameGrid/menu tests: 49 passed ([log](verification/focused-js.log)).
- Python frameGrid/grid/builder/page-resource tests: 66 passed plus 62 subtests ([log](verification/python.log)).
- `node tools/gramlot-tools-inspector/tests/minimal-frame-grid-browser.mjs`: Chromium and WebKit pass against the **compiled runtime and prepared collection modules**, using the Python-generated Source ([log](verification/browser.log)). Covers two independent frame recipients, live counts, stable rows, five themes × light/dark, header/body alignment, scrolling, narrow viewport, overflow command execution and disposal. No browser page errors.
- Desktop Compact light, Joanna dark and mobile WebKit screenshots inspected (in verification). The initial fixture used a header background under toolbar items which own their foreground; it now uses the normal toolbar surface token. No palette workaround or toolbar implementation change.
- Core JavaScript/Python dependencies installed afresh in this isolated work area without first-party pins or lockfiles; browser/build tooling reuses local read-only dependency installations. Initial Python editable install correctly refused missing browser assets; build followed by installation succeeded.

The fixture's commands demonstrate ordinary Data updates; they are not built-in
frameGrid editing or persistence commands. The row count is authored through a
Data formula. Filters, quickGrid, selection, column resizing, editing, store paging,
export and totalizers remain outside this increment. No release, deployment or
merge is included. Actual screen-reader/large-data qualification is not claimed.

[Source fingerprints](verification/source-sha256.tsv) identify the implementation,
fixture and tests. Keep the local review server with:
`node tools/gramlot-tools-inspector/tests/minimal-frame-grid-browser.mjs --serve --port 64550`.

Paired internal-document anchors, local links and source fingerprints verified. The public-site checker requires a previously generated Sphinx staging/site; its direct invocation in this fresh checkout stopped at missing staging. No public guide changed, and no public-site build is claimed by this receipt.


Gallery follow-up (2026-10-28): core build and 53 focused tests pass after the
presentation adjustments in GC-375 §030. The connected examples preview verifies
the shared toolbar and external five-theme/two-mode controls in both Chromium
and WebKit, retaining grid/row identity. See verification/gallery-browser.log.
Legacy configurator inspection is evidence only; its port and new struct styles
remain open. The earlier full-suite result belongs to the pre-gallery baseline.


Legacy interaction follow-up (2026-10-28): the owner's split-band screenshot and
explicit instruction to copy the legacy mechanism supersede nested struct Data.
GC-375 §035 specifies the single legacy flat-cell/columnset schema and retained
Source syntax. Actual pointer and keyboard gestures update Data; group membership
survives reordering. SVG/theme styling and legacy background/color/white_space
names replace the earlier open style proposal. No wrap alias or persisted order
array. Current checks: 1288 JS tests, 16 Python tests, builds, Source parity and
Chromium/WebKit including resize cancellation, split/join and active disposal.
The initial non-escalated full run could not bind fixture-server localhost sockets;
the complete permitted rerun passed. Earlier check counts above are historical.
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


Logical-order correction (2026-10-28): GC-375 §065 supersedes the unconditional
Bag-change prerequisite in the prior blocker. Owner proposes a derived numeric
node position and requests thorough legacy/header-sort analysis. The evidence
and open contract are recorded there; dependencies remain untouched and the
physical self-drag draft is inactive. No logical-order API has yet been approved.


Owner ordering decision (2026-10-28), GC-375 §075: sort computes a numeric node
index; self drag changes that index; redraw follows the index rather than Bag
sequence. This replaces the physical movement draft and makes the pending Bag JS
change request unnecessary for this implementation. Runtime revision remains TODO.


Legacy ordering verification (2026-10-28): GC-375 §080 traces exact grid/store/
server boundaries and corrects any implication that legacy uniformly rendered by
a rank attribute. Read-only actual-method probe passes; see verification/legacy-
ordering-probe.mjs and legacy-ordering-probe.log. The new index-based contract
remains the owner's Gramlot direction; no runtime implementation changed here.


Owner responsibility decision (2026-10-28), GC-375 §085: indexed multicolumn sort
and drag reorder belong to the collection store. Grid is the requester/renderer.
Replace the inactive physical movement draft with that contract; no implementation
or verification of a new collection-store layer is claimed yet.


Resident store implementation (2026-10-28), GC-375 §090: owner's explicit “ok
procedi” implemented. BagCollectionStore replaces the physical row-move draft;
rowidx and sortedBy own order in Data. Grid renders indices, sends multicolumn
sort and opt-in selfDragRows requests, and retains row identity/heights. Gallery
enables the feature. Verified 1,309 JS / 16 Python tests, source parity and core /
gallery Chromium-WebKit checks. See collection-store-* receipts. The bundled
WebKit's missing first pointerdown after native drag is reproduced independently
in native-drag-pointer-probe.mjs; browser qualification separates that cycle before
pointer resize, without a runtime fallback. No dependency changes. Implementation
and verification complete; this does not assert owner's final visual acceptance.


### Hardening review — 2026-10-29

Owner authorized corrections without new features. GC-375 §100 records the review,
store failure handling, projection deduplication and lifecycle/authoring fixes.
Receipts: verification/grid-hardening-full-js.log (1,316 pass),
verification/grid-hardening-python.log (18 pass), and
verification/grid-hardening-browser-profile.log (Chromium/WebKit interactions,
themes and 100/1,000/10,000-row measurements). No Bag/Builder dependency edits,
notification replay, rollback, alternate Data representation or browser workaround.

Open decision: existing P12/R10 routing stops subsequent recipients when SET/FIRE
handlers fail. General continue-delivery was investigated and withdrawn, not
silently substituted or accepted by changing tests. Owner requested context before
deciding. Keep this boundary visible in subsequent reviews. Native WebKit drag /
first-pointerdown limitation remains. Large resident DOM measurements are diagnostic,
not a virtualization or responsiveness qualification. Review closure pending.


### Legacy external-change evidence — 2026-10-29

GC-375 §105 traces the committed DB event → per-table publication → per-store
pendingChanges → query relevance → linked-grid refresh path, including server-side
checks for VirtualSelection. Genropy revision fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea.
This informs provider/store ownership without approving new APIs or changing the
router failure policy. Preserve the distinction between intended batching and the
commented-out batchUpdating calls in the inspected external-change implementation;
legacy gridBroadcast does not isolate consumer failures. No runtime port performed.


### Deferred pull revision — 2026-10-29

Owner selected per-grid setTimeout, subscribe/publish invalidations and pull of
current store values. GC-375 §110 records the implemented contract. This resolves
the pending generic-router proposal: no DataRouter/P12/R10 change. Grid work is
coalesced, affected rows read independently, full invalidation dominates, render
errors are reported per view, and removal/retargeting cancels old work. No polling,
extra Bag subscriptions, copied business data or provider feature.

Verification: 1,323 JS tests including 56 focused; 18 Python tests; prepared bundle
identity; Chromium/WebKit interactions, themes and ordering measurements. Receipts:
verification/grid-pull-*.log. Existing native WebKit gesture qualification limit
and large fully resident-DOM costs remain documented. Revision checks complete;
owner visual acceptance separate. No publication or dependency edits.


### Collection filtering and searchOn — 2026-10-29

Owner explicitly authorizes filtered in the collection store, separate from
ordering, and the legacy all/column search menu and typed input. Implemented scope,
exact legacy anchors, intentional invalid-draft behavior and exclusions: GC-375
§115. No remote filtersets, dependency modifications or generic router change.
Verified full JS 1,336, final focused/artifact checks 75, Python 19, Chromium and
WebKit, and the live gallery. The optional-bundle Builder identity issue was fixed
at the core context boundary, without permissive type checks. Preview uses 64552;
the unrelated release-worktree server on 64551 was not restarted. Owner visual
acceptance remains separate. No publication.


### Independent grid views — 2026-10-29

Owner explicitly confirmed per-grid sort and filtered sharing identical data.
GC-375 §120 supersedes earlier shared metadata: one parent data store and one
Source-owned indexed view per grid. Declarative presets, independent search bars,
manual drag, shared updates and lifecycle are verified. No business attributes
are written; no dependency/general-router changes. Full JS 1,331; focused 64;
Python 19; six examples parity checks; Chromium/WebKit and live gallery pass.
Receipts: verification/grid-view-*.log. Owner visual acceptance remains separate.


### Search visual refinement and lesson — 2026-10-29

Owner requested a rounded field, muted internal lens, conditional internal clear
button and a dedicated search example. GC-375 §125 records implementation, shared
theme tokens and unchanged filtering contract. Verified: 52 focused core tests,
seven Grid Source parity checks, eight gallery navigation/data tests; Chromium and
WebKit theme/search/clear/narrow-toolbar checks; live dedicated lesson. Receipts:
verification/grid-search-design-*.log. Visual acceptance remains with the owner.
The local Bag.to_tytx convenience-method serialization defect is recorded in
GC-375 §125 for its owning dependency; no dependency edit or runtime workaround.


### Owner visual revision: search instructions — 2026-10-29

The owner rejected the previous blue halo and visible examples in the input.
GC-375 §130 records the neutral flat capsule, shaded label and contextual info
popover. The rejected §125 appearance remains historical evidence. Twelve
FrameGrid tests, compiled bundle, Chromium/WebKit and live gallery pass.
Receipts: verification/grid-search-info-*.log. Visual acceptance pending owner.
