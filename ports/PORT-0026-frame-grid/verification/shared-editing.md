# Shared local editing verification — 2026-11-01

- Standard build: `npm --prefix js run build` passed.
- Full JS suite: 1,492 passed, zero failures/skips.
- Python grid/frameGrid authoring: 20 passed.
- Public documentation check: 19 pages and paired anchors passed.
- `js/tests/form-state.test.js`: existing semantics and independent validator contributions.
- `js/tests/grid-editing.test.js`: values/attributes, shared session, 1,000 rows,
  actual editor disposal, draft/error reopening, local acceptance/restoration/load,
  node removal, attribute originals, incremental changes, Tab/Escape and stale
  async completion rejection.
- `tools/gramlot-tools-inspector/tests/grid-editing-browser.mjs`: Python-authored
  fixture against prepared bundles, Chromium and WebKit, 1,000 variable-height
  rows in each representation, bounded rendered rows and no uncaught page errors.
- Existing `minimal-frame-grid-browser.mjs`: Chromium and WebKit passed theme,
  search/sort, drag/resize, virtual scrolling and delayed loading regressions.

No DB or adapter was modified. Existing form remote-validation tests use mocked
RPC replies; they are not DB integration or autosave qualification. The previously
reported cancelled-validation limitation was rejected by the owner and superseded
by session-owned validation; current verification is recorded below.
Screenshots were visually inspected locally; no customer data is involved.


## Session-owned validation correction

Owner correction: GC-000 session-validation-20261101. The rejected cancelled-check
behavior has been removed, not treated as an approved restriction.

- Full JS suite: 1,508 tests passed, zero failures/skips.
- Python grid/frameGrid authoring: 20 passed.
- Standard build and 19-page public documentation check passed.
- Chromium and WebKit: prepared core and collection bundles, Python-authored
  fixture, 1,000 variable-height rows in both representations. Success and errors
  settle after the editor DOM is removed; local acceptance needs no reopening;
  reopening an error does not call the validator again.
- Existing FrameGrid browser qualification passed both engines.
- Focused regressions cover callbacks and Bag patches in the actual Source scope,
  new candidates and external values, bound rules and Source rule changes while
  unmounted, invalid drafts, row removal/replacement, load/restore/disposal,
  timeout, typed normalization and independent form controls on the same Data.
- The session retains semantic field resources, not an adapter or a hidden DOM
  input. Clean suspended fields release their Source declarations. A pending
  field remounts onto the same request, without duplicate RPC.
- Full-suite import-cycle and real-browser cross-bundle identity defects found
  during qualification were fixed at their ownership boundaries. sourceTarget
  is re-exported unchanged by core; no Builder/Bag source was modified.

RPC replies in these tests are controlled validation fixtures, not database writes.
Whole-selection schema validation and persistence remain outside this local tranche.


## Shared reports and vertical arrows

Owner: GC-000 editing-reports-20261101 and grid-editing-arrows-20261101. PoC
references: `js/dom/src/collections/grid-status.js` and `grid-editor.js`.
Destination uses EditingSession registers instead of a grid-owned changes/errors
model. Changes retain baseline/current semantics; no audit journal is implied.
The existing session remains the owner of pending validation after navigation.

- 48 focused form/grid tests passed: values/attributes, shared reports, original
  values, return to clean, accept/restore, subscriptions, offscreen/filtered/removed
  targets, sorted vertical navigation, invalid drafts and control-owned arrows.
- Full JS core suite: 1,516 passed, zero failures.
- Core and gallery builds passed.
- Live Python gallery in Chromium/WebKit: original/current report values, shared
  form and grid entries, offscreen focus restoration, pending validation completing
  in an open report, vertical arrows, multiline caret behavior and local acceptance.
- Prior live draft/error/scroll/remote-validation browser checks still passed.


## Horizontal caret-boundary navigation

Owner clarification: GC-000 grid-caret-boundaries-20261101. Previous Left/Right
caret-only behavior is superseded at collapsed text boundaries. Uses the existing
navigation path, without additional editing state or empty-field search.
51 focused tests passed (including both row representations, modifiers, selected
text, dataset edges, incomplete drafts and non-text controls). Live Chromium and
WebKit checks cover native caret/selection behavior, adjacent-cell movement,
restored invalid drafts, reports and asynchronous validation. Core/gallery builds
passed; the updated lesson is active on port 61509.


## Bounded text content and textarea — 2026-11-02

GC-000 grid-cell-max-height-20261102 authorizes one column max_height for text
presentation and the editor, with internal scroll. Structural validation and
Source projection share the attribute. The display viewport is stable across
updates and does not duplicate Data; the editor reuses the same CSS limit.
101 focused JS tests, full 1,697-test JS suite and 28 Python authoring tests passed.
Core/gallery builds passed. Chromium/WebKit live checks verify genuine inner
wheel scroll, the shared 96px limit, complete committed text, taller manually
resized rows, virtualization and editing/report regressions. Existing FrameGrid
qualification passed both engines and its 10 theme/mode combinations.


## Complete validation at confirmation — 2026-11-02

Scope/provenance: GC-000 complete-validation-20261102, owner timing confirmation
“Alla conferma/salvataggio”. Session.validate() scans the complete resident data
and form fields using existing ValidationRun, policies and registers. Lazy real
Source declarations preserve scope and are never mounted for unopened cells;
clean declarations are released and errors remain navigable. No hidden editors,
synthetic Source contexts or independent grid validation journal were added.

Acceptance requires a current successful complete pass; changed Data, choice/rule
bindings or struct invalidate coverage. Eight workers bound asynchronous work;
restore/dispose cancel stale requests. Selector providers and type policies are
shared with mounted controls. Error reveal now measures previously unseen rows
and accounts for fractional geometry when setting the scroll position.

Verified final full core suite: 1,710 JS tests passed; 28 Python authoring tests.
Chromium/WebKit running-gallery tests instrument element creation and observe zero
unopened editors; they report row 801, navigate/correct it, then accept successfully.
Core values/attributes editing, reports/arrows and cell-height browser regression
checks passed both engines. Evidence: js/tests/grid-editing.test.js,
tools/gramlot-tools-inspector/tests/grid-editing-browser.mjs and connected gallery
scripts/verify_complete_grid_validation_browser.mjs. Gallery remains active at
61509/pages/05-grid/10_editing. Implemented/verified; no owner acceptance inferred.
