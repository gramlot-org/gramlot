# Grouplets common-base qualification — 2026-10-29

Port: PORT-0025. This receipt supersedes the separate-worktree qualification only
for integration into the common local base. Original research and owner decisions
remain evidence, not approval of the unimplemented family/resource APIs.

## Scope and provenance

Owner requested review and integration of the Grouplets worktree, preserving the
original work and excluding Invoice. Imported the optional collection, base
Grouplet remote container, GroupletCard, six Python/JS lessons, contracts and
regression evidence. Source worktrees are `codex/grouplets` at b268c996 and
`grouplets-gallery` at 519ef3e, including their original uncommitted work. The
common base retained current Grid, chat, mobile, selector and initial-form work.
No Invoice application work, package publication or deployment is included.

Shared-resource/Kajenn saved loading, shared documentation storage and dedicated
Grouplet form/store, wizard and grid family compositions remain unimplemented.
The first shared form manager now exists in the common base; the original form
prerequisite observation is historical. No new save/lifecycle contract is implied.

## Integration adjustments

- Merged collection/build inventories without replacing existing Grid/chat.
- Updated the gallery inventory to 154 routes (six lessons and one introduction).
- Used the common GRAMLOT_TEST_PYTHON selector instead of requiring a worktree-local
  virtualenv in the cross-language Grouplet test.
- Added a form regression: scoped Clear keeps the previous value in Source-owned
  registers, reports required-field errors, blocks acceptance, supports baseline
  restore and retains the exact field/control instances.
- Extended the full-catalogue parity test's bounded timeout from 30 to 120 seconds.
  The expanded suite takes about 33 seconds alone. The test assertions and endpoint
  coverage are unchanged; the new Grouplet endpoints remain included.

## Checks

- Core/runtime and gallery browser builds: pass.
- Local Python wheel: built; Grouplets descriptor, grammar, commands and assets present.
- Core: 44 focused tests plus 87 remote, labelbox, menu and security regressions pass.
- Core Python: 4 pass, 4 strict xfail. The known upstream Builder union/Regex gap
  still accepts unsupported state strings at Python authoring time; browser tests
  reject them. Normal boolean and pointer parameters pass. No dependency edits or
  compatibility coercion were introduced.
- Gallery JS: the complete 347-test run had 345 passes, a stale route count and the
  30-second parity timeout. After correction, all 9 catalogue tests and the complete
  endpoint parity test pass. No other failure or skipped test in that full run.
- Gallery Python: full run had 62 passes, 193 passing subtests and the same stale
  route count. The affected 9-test file passes after correction (63 tests overall).
- Browser, actual Python gallery: all six lessons load; customer-type draft
  retention, independent billing/shipping Data, nested remote reload, folded-card
  and review-state retention, menu actions, cancel/confirm scoped Clear and live
  contextual Markdown guides exercised. No captured error/warning console entries.
- 390px browser viewport: guide lesson fields remain usable and inner page
  scrollWidth equals clientWidth (361px). Desktop screenshot inspected.
- Paired maintained-document anchors and integration diff whitespace checked.
  GC-070 already duplicates gc-070-1440 in the baseline; this integration adds
  no duplicate anchor and does not rename historical IDs.
- Full RTD/serverless export is not rebuilt here: the existing local environment
  lacks the separate serverless documentation build prerequisite recorded in GC-070.

## Preservation and preview

Snapshots compare original HEAD, working status and SHA-256 of 1098 core files
and 825 examples files; originals remain unchanged. Source patches, logs and the
manifest are under `/private/tmp/gramlot-grouplets-integration-20261029/`.

The complete local preview runs at http://127.0.0.1:61509/ with Remote Edit disabled.
Grouplets appear as their own navigation branch; the existing ordinary, Grid,
Base/Asqueel, PageStore/WebSocket, chat and mobile module remain available under
their existing environment rules. Native mobile use still requires same-origin
HTTPS and a device; no native-device acceptance is claimed by this Grouplet check.

Implemented and verified locally. User visual acceptance, future increments and
public release remain separate.
