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
