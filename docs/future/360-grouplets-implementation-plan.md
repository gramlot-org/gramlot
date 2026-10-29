# 360 · Legacy grouplets and proposed Gramlot implementation plan

> **Worktree update, 2026-10-28:** P0 is complete on current development. The original draft used identifiers now occupied by other work. This active guide is **GC-360**, port **PORT-0025**; the original plan is retained as historical evidence. Current remote semantics supersede its fixed-name/latest-wins assumptions. See [§055](#gc-360-055).

Document ID: **GC-360**. Research date: **2026-10-28**.

**Base Grouplet and GroupletCard are integrated in the local common base.** See [§110](#gc-360-110). Full legacy-family parity, resource integration and further form composition remain open; the upstream Python authoring limitation is recorded below.
Grouplets are reusable fragments with an explicit data context, plus a family of
form, navigation and collection compositions. The proposed transfer starts with
resource resolution, instance isolation and the existing Source lifecycle. Forms
and grids depend on shared form/store contracts; they must not grow private
substitutes inside the grouplet implementation.

[Concise counterpart](../../docs_llm/future/360-grouplets-implementation-plan.md).
[Evidence and transfer instructions](../../ports/PORT-0025-grouplets/README.md).
[Complete source catalogue](../../ports/PORT-0025-grouplets/evidence/SOURCE-INDEX.md).

<a id="gc-360-005"></a>
## 005 · Assignment and authority

Owner request in this chat, 2026-10-28:

> recupera TUTTO il materiale relativo ai grouplet dekl genropy legacy e prepara un piano di imlementazione in gramlot che metteremo in un qworktree diverso

This authorizes investigation and a concrete implementation proposal to carry to
a separate worktree. It does not approve the proposed API, start implementation,
select a release, publish anything or authorize edits to dependency repositories.
The separate worktree is now prepared; see §055 for the current baseline. GC-110 remains the completed
0.1.0 execution plan; this is a future workstream, not a replacement for it.

The constitution remains authoritative: §§3–7 for Source, shared behavior and
ownership; §13 for one agreed path; §14 for dependency boundaries; 11.43 for
explicit decisions; 11.56 for examples; the current 11.85–11.87 for remote calls (superseding 11.60); §13 for
reuse. Every new language name, class, proxy or marker must be reviewed against
GC-225 before implementation. Legacy names below describe evidence unless
explicitly identified as an existing Gramlot API.

<a id="gc-360-010"></a>
## 010 · Recovered material and provenance

The reference is **genropy/genropy@a135c9d949d0b014a22f57c418e83b315f85e7bf**, the
GitHub `develop` tip verified on 28 October, committed on 27 October. The local
legacy checkout is at `fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea` (14 September);
it cannot establish current behavior. The September PoC audit is retained and
compared with the October source rather than silently updated.

| Material | Recovered coverage | Evidence |
| --- | --- | --- |
| Current source | Repository-wide case-insensitive content search plus grouplet paths: **196 files**; **226 archived files** including runtime/test dependencies and license | `source-manifest.json`, `legacy-sources.tar.gz`, `SOURCE-INDEX.md` |
| Local legacy snapshot | **135** matching/path files from the September-based local checkout, retained independently of upstream with actual working-file hashes | `local-legacy-manifest.json`, `local-legacy-sources.tar.gz` |
| Main implementation | `grouplet.py` (1,751 lines), `grouplet.js` (396), `grouplet_grid.js` (5,631), `grouplet_card.js` (561), `grouplet.css` (2,705) | `resources/common/gnrcomponents/grouplet/` in the snapshot |
| Framework integration | Grouplet/GroupletForm widgets, dialog editors, resource loader, mixin routing, form and collection stores, Source/remote machinery, grid change manager, field widgets and styling | Manifest and archived `gnrjs/gnr_d11/js/`, `gnrpy/gnr/` matches |
| Author examples | Fourteen grouplet pages and seventeen grid pages, their resource trees, table resources, custom roots, transforms, nested/RPC/deferred collision cases, card/doc assets and real consumers | `python-surface.json` and source catalogue |
| Automated regression material | JS grouplet/card/grid/mandatory/wizard suites; memory/Item stores, remote reentry, field teardown; Python card/panel/resource-routing tests | Source archive and verification receipt in §045 |
| GitHub issue and PR discussion | **74 results: 35 issues, 39 PRs**; search includes title/body/comments, `incomplete_results=false`; **45 conversation comments**, **36 inline PR comments** | `github-search.json`, `github-comments.json`, `github-review-comments.json` |
| Indexed history | **247 Genropy commit records**, plus 33 indexed issues and 36 indexed PRs, retrieved with pagination | `indexed-history.json`; supplementary to direct GitHub results |
| Historical branch documents | `docs/groupletgrid_architecture.md` and `docs/groupletgrid_store_integration.html`, from `feat-grouplet-grid`, tree `b6f22d446180a0c32114bcf0e16ddc0e57ae960c` | Original documents and blob identities in `historical-provenance.json` |
| PoC and secondary local evidence | Six full PoC notes/cards in an archive; **39** local/archive text references indexed with hashes and matching lines | `historical-poc-notes.tar.gz`, `secondary-inventory.json` |
| Meeting context | Thirty available “Genropy Developers” summaries searched; one matching AI summary of 29 September about GroupPanel/layout corrections; no indexed transcript hit for `grouplet` | `meeting-extracts.json`; secondary evidence, never an owner decision |
| Gramlot comparison | Exact inspected working-file hashes, including existing local changes | `gramlot-baseline.json`; a commit ID alone does not reproduce that baseline |

The search covers the current upstream tree, referenced historical branch documents,
available indexed history and the local Genropy/PoC/meta/documentation roots.
It is not an assertion that deleted branches, inaccessible customer repositories,
unindexed conversations or private documentation databases were exhaustively
recovered. Historical files inside the evidence archives remain **Historical
record**, not maintained product contracts. Repository snapshots are evidence,
not dependency pins or code to bulk-copy into Gramlot.

<a id="gc-360-015"></a>
## 015 · What the legacy family actually contains

The source paths in this section are relative to the immutable Genropy snapshot.
The catalogue gives permanent links; `python-surface.json` retains complete Python
signatures and line ranges, including the example methods.

| Family | Observed responsibilities | Primary entry points |
| --- | --- | --- |
| Basic grouplet | Resolve resource or public handler; mount a dedicated content boundary; bind to an absolute value path; pass parameters; run a post-remote validation check | `genro_components.js:3250` (`gnr.widgets.Grouplet`); `grouplet.py:18` (`gr_loadGrouplet`) |
| Resource catalogue | Discover ordinary/table resources, topic folders and custom roots; read metadata; sort by priority/caption; filter tags, table permissions and `is_enabled` | `grouplet.py:1036–1167`; resource-loader mixins |
| Nested topic composition | Build nested expandboxes and CSS-grid layouts; recursively build leaf fragments in the same server invocation, with separate relative data paths | `grouplet.py:73` (`_loadGroupletTopic`) |
| GroupletForm | Wrap a BoxForm; default memory/Item store; separate widget, record, controller, identity and origin paths; replace load/save transformations when location changes | `genro_components.js:1061` (`gnr.widgets.GroupletForm`) |
| Dialog editors and chunk | Memory/document/record editors; summary template plus edit action; record-mode chunk uses its own workspace, record load and refresh after save | `genro_dlg.js` editor helpers; `grouplet.py:244` |
| Panel | Tree or topic-button navigation; dynamic resource/location; startup selection; pending-change handling; mark mandatory groups including unopened ones; draft-aware outer-form blocking | `grouplet.py:378`; `grouplet.js:224–396` |
| Wizard and wizard form | Ordered steps, validation, step save, selected-step outer saves, resume progress, summaries, horizontal/left stepper, draft/confirmation/read-only policy, per-step remote parameters | `grouplet.py:566,913`; `grouplet.js:2–223` |
| Choice | Single-value tiles from explicit rows or a DB query; glyph/title/note templates, groups, optional caption output, required validation and wizard advance | `grouplet.py:324` |
| Card | Resource metadata profile plus explicit overrides; title, chrome, collapse, tools, deletion/edit menus, checkbox, inline documentation; optional copy/edit/save form | `grouplet.py:1176`; `grouplet_card.js` |
| GroupletGrid | Repeated fragments from one resource, handler, per-row resource or struct; cards/tabs/vertical-tabs layouts; collection editing and selection; shared card presentation | `grouplet.py:1368`; `grouplet_grid.js` |

Metadata includes `caption`, `code`, `priority`, `tags`, `permissions`, `locationpath`,
`onLoading`, `onSaving`, `mandatory`, template/virtual columns, wizard summaries and
the `card` profile. There are multiple legacy metadata representations
(`Grouplet.__info__`, `GroupletTopic.__info__`, module `info`); their existence does
not authorize three destination representations. Choose one primary contract.

The grid includes responsive columns/fill-parent sizing, insertion/deletion/copy,
min/max rows, default rows, edit menus, counters, phantom rows, entry rows, row
templates, multiselection and grouped selection, clipboard operations, drag/drop
within or between grids, per-resource template caching, title/collapsed templates,
sorting, formulas, totals/counts and per-entry visibility. These are separate
acceptance slices, not implicit promises of the first grouplet implementation.

Its classes separate `GroupletGridStructAdapter`, `GroupletGridDnD`,
`GroupletDataStore`, `GroupletGridController` and tile variants, with shared
`GroupletCard` presentation. This is useful responsibility evidence, not an
approved Gramlot class diagram. The current facade still has filter no-ops and
direct `Bag._nodes` mutation for movement/sorting. Do not port those mechanisms,
claim complete generic-store support, or replicate its dtype-to-editor table.

<a id="gc-360-020"></a>
## 020 · History that changes the implementation requirements

| Evidence | Consequence for Gramlot qualification |
| --- | --- |
| [#1665](https://github.com/genropy/genropy/issues/1665), shared function metadata corrupted RPC routes after another mixin | Two resources with the same method names, nested templates and deferred callbacks must retain their own dispatch identity. Separate data paths alone do not establish isolation. |
| [#1436](https://github.com/genropy/genropy/issues/1436), remote reentry race | Reuse current request ownership, the current single-flight/first-pending request behavior; test reentrant callbacks and removal while loading. |
| [#1464](https://github.com/genropy/genropy/issues/1464), Item-store writeback destroyed change tracking; [#1619](https://github.com/genropy/genropy/issues/1619), protection attributes lost | Preserve metadata, relation nodes and unchanged values. A copied form cannot rewrite an entire origin record on every save. |
| [#1466](https://github.com/genropy/genropy/issues/1466), mandatory groups | Validation must account for unopened groups and invalid edits still held in an inner form. Draft/confirm policy is a separate contract. |
| [#1496](https://github.com/genropy/genropy/issues/1496), [#1498](https://github.com/genropy/genropy/issues/1498), wizard dismissal and save bypass | Save/Discard/Cancel and child-form registration cannot bypass the wizard's transition rules or silently lose the current step. |
| [#1506](https://github.com/genropy/genropy/issues/1506), selected-step saves and summaries | Distinguish step commit, outer persistence, insert/reload and progress. Confirmation is not successful merely because save was called. |
| [#1537](https://github.com/genropy/genropy/issues/1537), phantom/entry/template rows; [#1613](https://github.com/genropy/genropy/issues/1613), empty-grid drop | Temporary input rows must not become stored records before their defined commit, and empty collections remain valid drop targets when allowed. |
| [#1763](https://github.com/genropy/genropy/issues/1763), [PR #1764](https://github.com/genropy/genropy/pull/1764), double wrapping after rebuild | Template reuse and store replacement must not duplicate labels, providers, listeners or Source decoration. |

The September audit's statement that wizard Next immediately advances after
`save()` is historical: October `wizardNext` uses `onReload` for a changed step,
and `wizardConfirm` handles blocked/deferred saves. October Back and the valid
panel-switch path still call `save()` and continue in their current memory-store
context. This is a reason to test asynchronous stores explicitly, not proof that
every legacy path loses data.

Open issues must stay distinct from shipped behavior:

- [#1714](https://github.com/genropy/genropy/issues/1714): multiple choice is a
  proposal; the inspected `gr_groupletChoice` implements single selection.
- [#1095](https://github.com/genropy/genropy/issues/1095): terminal resource and
  broader initial-step/reload semantics remain open; some self-save/reload handling
  exists already. Do not mark the whole request delivered.
- [#897](https://github.com/genropy/genropy/issues/897) versus closed
  [#900](https://github.com/genropy/genropy/issues/900): the model facade exists,
  but the historical three-mode adapter/filter design is not complete.
- [#899](https://github.com/genropy/genropy/issues/899): shared editor resolution;
  [#909](https://github.com/genropy/genropy/issues/909): silent failures/identity;
  [#910](https://github.com/genropy/genropy/issues/910): client-side handler RFC;
  [#794](https://github.com/genropy/genropy/issues/794): ordinary-resource package
  overrides. These are evidence of unresolved boundaries, not approved additions.
- [#1439](https://github.com/genropy/genropy/issues/1439) remains open although
  formulas/totals are visibly implemented in current source. Issue state alone
  does not define runtime availability or acceptance.

<a id="gc-360-025"></a>
## 025 · Existing Gramlot mechanisms and ownership

| Need | Existing foundation | Missing contract or boundary |
| --- | --- | --- |
| Python-authored structure | `Page`, `@source`, `GramlotBuilder`, typed SourceBag/SourceBagNode | Resource composition must produce ordinary typed Source, not a new Source transport or imported legacy tree |
| Remote fragment replacement | `RemoteBinding`, `SourceHandler.remoteSource`, existing RPC envelope, node-owned single-flight/first-pending requests, validation before replacement | A grouplet owns a dedicated body boundary; loading/error/readiness semantics still need a grouplet contract |
| Dynamic selection | Server-declared NameSyntax and public dotted paths from Page; reactive method/parameters | Current 11.85 supersedes 11.60: method pointers are supported. Reuse existing dispatch and node.requests; do not introduce a grouplet-specific request queue |
| Named browser behavior | `LogicRegistry`, grouped `Logic`, `invokeHook`, Source activation boundary | Existing groups are page/resource namespaces, not a demonstrated per-grouplet instance lifecycle. Review collisions/state/cleanup before adding anything |
| Data and notifications | Data Bags, bindings, controllers, subscriptions, symbolic references | Define instance data ownership, write semantics and teardown using these mechanisms; no parallel bus or state container |
| Catalogue and assets | Resource-name validation and load order in core; `grouplets` is listed as a planned optional capability in GC-230 §040 | Current declaration is not an implemented catalogue. Resource search/import, package precedence and authentication belong to an appropriate resource host; no arbitrary filesystem or Genropy dependency in core |
| Form presentation | Existing formlet/groupBox, typed controls, validation and dialogs | Formlet is layout, not GroupletForm. Full draft/origin/dirty/save/discard/child-form orchestration needs a shared contract |
| Collection views | Existing Bag, tree, layout and drag/drop mechanisms; the archived collection-store research direction | Shared collection API, row identity/layout and persistence semantics remain to be finalized. GroupletGrid must consume that work, not create a competing store |
| Calculations | The archived owner direction: for now follow legacy grid formulas/totals; the archived updated grid evidence | Coordinate with the separate grid/store workstream: declarations and calculation writing into the shared store. Do not require a new Bag JS engine; exact grammar and execution remain to be decided |
| DB-backed resources | Integration/service layer; shared core remains DB independent | Table-specific discovery, permissions, record persistence and relations belong outside core. Current Kajenn/Asqueel database access does not automatically approve grouplet catalogue/discovery services |
| Examples | `gramlot-examples`, Python first | Core qualification uses its own fixtures and does not import examples or adapters |

The proposed base grouplet is a composition capability built on Source/remote,
not automatically a new visual Web Component. A genuinely reusable visual card
may justify a component after its contract is approved. Dojo/contentPane/framePane,
legacy mixin implementation, manual application DOM wiring, hidden validation
inputs and private Bag mutation are not destination requirements.

<a id="gc-360-030"></a>
## 030 · Decisions to settle before the affected implementation

These are proposed decision questions, not approved alternatives to implement
together. Ask the owner **one at a time**, only when needed, and record the exact
answer and scope. Do not reopen decisions already settled in the constitution.

| Decision | Concrete proposal to review | Blocks |
| --- | --- | --- |
| D1 · First delivery | Basic reusable resource fragment with explicit Data path, two isolated instances, reactive resource parameters and deterministic teardown; defer form and grid compositions | P1–P2 |
| D2 · Resource host | Separate portable rendering from resource catalogue/discovery; identify the first resource-providing host and the supported registration/metadata representation | P1, connected adapter scope |
| D3 · Identity and dispatch | Distinguish resource definition, Source instance and data location; use existing named logic/RPC rules where sufficient; specify duplicate explicit IDs and same-named methods | P1–P2 |
| D4 · Loading and lifecycle | Define old-body retention/replacement on failure, parameter changes, post-install hook versus nested readiness, and whether inactive bodies are retained | P2–P3 |
| D5 · Forms | Define direct binding versus an explicitly requested working copy, commit/discard, transforms, dirty/invalid state, async save and parent/child ownership | P4 onward |
| D6 · Navigation | Define pending-change prompts, mandatory unopened groups, draft confirmation, step completion and persistence order | P5–P6 |
| D7 · Grid contract | Agree shared-store requirements with the separate grid/store workstream and select the first row representation and layout; explicitly sequence optional grid features | P7–P8 |
| D8 · Public language | Review concrete Python/JS declarations, metadata, hooks and names through GC-225; document supported cases and reject the rest | Each public API increment |

No new `grouplet` spelling, proxy, handler marker, registration format, callback
alias or store protocol is approved merely by appearing in this plan.

<a id="gc-360-035"></a>
## 035 · Proposed implementation sequence

Each phase starts only after its required contract decisions and prerequisites are
available. A phase closes with code, meaningful tests, paired documentation,
explicit omissions and destination review under PORT-0025. Do not treat an entire
family as delivered because its simplest fixture renders.

| Phase | Concrete work and affected responsibilities | Completion evidence |
| --- | --- | --- |
| P0 · Prepare isolated baseline | Transfer this dossier; select the current verified `develop`-derived baseline and required accepted increments; inspect the target worktree's instructions and dependency versions | Reproducible baseline receipt, existing focused tests, no accidental reliance on unrelated local modifications |
| P1 · Resource contract | Resolve D1–D3/D8; write resource/instance/data distinctions, metadata, dispatch, authorization and error contract; assign catalogue host; review existing logic/resource extension points | Approved examples of two resources and two simultaneous instances; explicit not-found/denied/unsupported cases; provider contract fixtures |
| P2 · Basic grouplet | Compose a dedicated typed Source body through existing `@source`/RPC/remote; implement only necessary shared gaps; bind explicit Data scope; support selected resource parameters and cleanup | Isolation, nested/deferred dispatch, reentrant load, A→B→A, first pending snapshot, applied in-flight answer, removed target, failure and teardown tests; Python authoring fixture |
| P3 · Catalogue, topics and card shell | Add approved metadata catalogue and nested topic presentation; basic card title/collapse/tools using shared layout/presentation; precise parent/child Data paths | Ordering, permission filtering plus direct-load authorization, custom root/precedence as approved, nested empty/error topics, card state and cleanup; no form persistence yet |
| P4 · Shared form integration | First settle/reuse shared form/store lifecycle; compose GroupletForm and memory dialog editor; implement transforms, draft/origin separation and async commit/discard through that contract | No-op save, unchanged metadata/relations, pending invalid edits, save failure, child cleanup, parent reload and cancel/discard tests; no private grouplet form engine |
| P5 · Panel and chunk | Add tree/topic navigation, startup selection, mandatory status and form-aware switching; memory chunk/edit/refresh; record variant only after approved service prerequisites | Old resource saves to old location before switch; Cancel restores selection; invalid edits survive appropriate outer saves; unopened mandatory groups; independent chunk workspace |
| P6 · Wizard and choice | Step navigation/validation, step/outer save sequencing, progress/resume, summaries and confirmation; compose single-choice tiles with existing selection mechanisms | Forward/back/direct-step/close matrix; deferred editor/save, failed/blocked confirmation and first insert/reload; readonly/draft state; choice keyboard/focus behavior. Multiple choice/terminal resource require their own decisions |
| P7 · Basic GroupletGrid | After shared-store gate, render stable row identities through repeated Source/card bodies; one agreed row shape/layout; add/delete/defaults/limits, selection and complete disposal | External store edits, parent store replacement, row deletion with validation, duplicate identity, nested grids, locked state and min/max boundaries; no hidden store fallback |
| P8 · Advanced grid slices | Separately approve layouts/lazy tabs, heterogeneous resources/struct, phantom/entry/template rows, multiselection/clipboard, drag/drop/reorder, formulas/totals/docs | Tests and explicit acceptance per slice; temporary rows do not leak into persistent data; layout change retains correct edits; calculations agree with the separate grid/store workstream and shared-store observers |
| P9 · Integration and acceptance | Add Python-first examples in the examples repository; qualify approved resource/DB host and core contract fixtures; complete manual, API exports and lifecycle/accessibility checks | End-to-end evidence, negative paths, resource-host capability matrix, accepted omissions, paired docs and owner acceptance; release/deployment remain separate |

Dependencies: **P0 → P1 → P2 → P3**; **shared form contract → P4 → P5 → P6**;
**shared collection-store contract + P2/P3 → P7 → P8**; the accepted slices meet
at P9. The basic resource fragment need not wait for grids, database services or a
full record form. Topic and card UI do not by themselves authorize those layers.

Expected core inspection/edit locations, subject to the approved design, are
`src/gramlot/page/`, `js/src/binding/remote.js`, `js/src/binding/logic.js`,
`js/src/handlers/source-handler.js`, shared component/collection definitions and
their Python metadata exports. Extend them only for proven gaps. Host-specific
discovery lives in the chosen integration/resource project; its exact location
is not decided here. Tests belong in core `tests/`, `js/tests/` and own fixtures;
public demos belong in `gramlot-examples`. Do not preallocate imaginary classes.

<a id="gc-360-040"></a>
## 040 · Required destination qualification matrix

| Area | Required scenarios |
| --- | --- |
| Resource boundary | Known/unknown/denied resource; malformed identifier; custom root/table override only when approved; hidden menu item cannot be loaded by bypassing the menu |
| Instance isolation | Same resource twice with different Data paths; different resources exporting same methods; nested and deferred callbacks; explicit Source IDs; page teardown during pending work |
| Source transport | Literal or pointer-valued method under server-declared NameSyntax; public dotted dispatch; typed Source only; a Source-shaped value received as Data does not activate code; response validation before replacement |
| Remote lifetime | A in flight, first B captured as pending, later C ignored until the next trigger; apply A then B; false _if retains in-flight work and mounted content; reentrant `_onRemote`; removal/disposal; failure/retry; absence of duplicate providers/subscriptions |
| Form/store | Direct versus copy contract; dirty/invalid child; no-op save; scalar/node metadata and relation preservation; async save success/failure; transform ordering; origin replacement and parent reload |
| Panel/wizard | Unopened mandatory group; draft versus confirmation; valid/invalid change switching; Cancel/Discard; delayed grid editor; backward/forward/stepper/close; first insert; reload same/new record; readonly and resume |
| Card/chunk | Bound title/collapse/checkbox; clearing scope; doc escaping/resource policy; independent chunk record workspace; edit/save refresh; resource rebuild without duplicate decoration |
| Grid/store | Row identity versus position; one agreed row shape; external insert/delete/change; whole-store replacement; pending templates; min/max/locked actions; nested row teardown; zero-row state |
| Advanced grid | Phantom defaults and promotion; entry commit/validation; template-row selection; multi-grid selection isolation; clipboard constraints; empty-grid drop and cross-grid identity; stable source on layout/sort changes |
| Calculation | Formula declaration/execution ownership, changed value visible through another consumer of the same store, totals/count and hidden entries, filtered scope explicitly defined, no extra Bag engine |
| UI and integration | Keyboard/focus/selection, narrow layouts, loading/error feedback, reduced motion where animated, supported browsers and chosen host; no application-local DOM/event/request workaround |

Use the retained legacy tests as behavioral inputs, not by importing Dojo or
Genropy into the Gramlot core test suite. Each accepted difference needs a named
destination test and documentation. Tests involving remote or save timing must
control completion order; a screenshot alone cannot verify those contracts.

<a id="gc-360-045"></a>
## 045 · Verification completed for this investigation

Executed on the exact upstream source snapshot with Node's test runner:
`grouplet*.test.js`, `wizard_save_paths.test.js`, `item_formstore_record.test.js`,
`memory_store_writeback.test.js`, `remote_content_reentry.test.js` and
`form_torn_down_field.test.js`: **188 passed, 0 failed, 0 skipped**.
The tests include VM/stubbed browser surfaces. This is isolated legacy regression
evidence, not browser/DB/end-to-end qualification or Gramlot implementation.

Attempted the actual Python `grouplet_card_test.py` and `grouplet_panel_test.py`
using the current source on `PYTHONPATH`. Both stopped during collection because
the available environment lacks `unidecode`. No Python pass is claimed and no
installed legacy/dependency source was modified to compensate. Full output is in
`python-tests.log`; a correctly provisioned legacy test environment is still needed.

Source archive hashes, evidence checksums, paired document anchors/local links
and the existing public-documentation build boundary are checked at delivery.
The new plan stays outside the public manual allowlist. No runtime change is
part of this investigation.

<a id="gc-360-050"></a>
## 050 · Transfer to a different worktree

The portable handoff comprises this guide and its mirror, PORT-0025 including
evidence archives, and the current-status entry. See the port's `HANDOFF.md` for
the ordered reading list, baseline hazards and verification commands.

At implementation start, reuse or create the requested separate worktree from a
verified development baseline. A plain checkout of the inspected HEAD will not
contain all the working changes inspected here: verify `gramlot-baseline.json`
and the current contracts, then bring only the required accepted increments.
Do not copy the whole current working tree, silently rebase other work or claim
the snapshot is current after a later upstream change.

Keep work on the development line until verified and accepted; `main` remains
the consolidated reference. Follow the app's managed-worktree procedure if the
worktree is created there. A worktree name or path is an operational choice, not
an architectural decision. This research does not create a new chat, start a
background workflow, change dependencies or authorize publication.

The next product decision is D1: accept or revise the bounded first delivery of a
basic isolated resource fragment. The rest of the plan can then be refined one
decision at a time without losing the recovered material.


<a id="gc-360-055"></a>
## 055 · Isolated worktree baseline and first contract proposal

Owner follow-up, 2026-10-28: “procedi”. Authorizes proceeding with the requested
worktree and plan. Preparation is complete; unresolved API choices are not
recorded as approved merely by this instruction.

The managed worktree is `/Users/gporcari/.codex/worktrees/grouplets/gramlot`,
branch `codex/grouplets`, based on freshly fetched `origin/develop` at
`b268c9960736324d62a75dbd2dde61807f19e9d1`. No unrelated working changes were copied.
The source comparison records two unchanged, eight changed and four absent paths
relative to the research working tree. Current constitution/contracts take priority.

The initial draft's GC-350 and PORT-0024 collide with the current public menu
guide and mobile-gallery port. They are corrected to GC-360 and PORT-0025 here;
the original draft remains in `evidence/pre-transfer-plan.tar.gz`, with identity
mapping in `worktree-baseline.json`. This is a draft identity correction, not a
rename of either established public document. Earlier grid/store notes also used
IDs now occupied by other guides; their originals and mirrors are preserved in
`evidence/historical-planning-context.tar.gz`. References to the separate grid/store
workstream mean those source discussions, not the current menu-expansion port.

Current baseline changes relevant to the plan:

- Current constitution 11.85 supersedes 11.60. Literal or pointer method names
  resolve public dotted paths from Page. Python ordinary objects can expose a
  final @source/@endpoint method; JavaScript uses Exposed. Reuse this dispatch.
- Requests have one in flight and the first pending change. The running answer
  is applied; the captured pending request follows; later intermediate changes
  do not replace that pending snapshot. False _if makes no call and does not
  cancel the running request or clear the content. Node removal/page close and
  declared cancellation retain the current contract. Do not port latest-wins.
- Page.gramlots and the existing collection preparation/asset registry are
  implemented. Reuse them for grammar/assets if needed; they do not establish
  Python fragment discovery or per-grouplet method/state isolation.
- PageStore, dataBinder and host database access now exist. Review them before
  any new server state/persistence mechanism. They do not automatically establish
  the full GroupletForm dirty/copy/invalid/save/discard lifecycle.

Verification with freshly installed unpinned first-party dependencies:
87 existing JavaScript tests pass (remote, dataRemote, named Logic, cleanup);
56 existing Python tests plus 95 subtests pass (Source server, resources,
collection discovery). No full browser/host or new grouplet feature claim.
Evidence integrity and paired plan links/anchors are checked independently.

The initial Page-owned-object proposal was not approved. The owner subsequently
requested saving the grouplet with loading options through Kajenn's resource
integration; see §060 and the revised
[P1 contract](../../ports/PORT-0025-grouplets/P1-CONTRACT.md).


<a id="gc-360-060"></a>
## 060 · Saved grouplet and Kajenn resource integration — 2026-10-28

Owner: “a me servirebbe salvare il grouplet con ke sue opzioni di caricamento poi
nel adapter kajenn. possiamo integrarlo col sistema tisorse”.

The initial design includes saving the grouplet and its loading options through
the resource system and Kajenn adapter. This supersedes the agent's unapproved
proposal to defer catalogue/Kajenn integration. D2 now identifies the requested
integration; storage representation, lookup/override rules and write API remain
open. P1 must address these before a fragment-only implementation is selected.

Proposed boundary: the resource host stores and resolves the definition and
loading configuration; the adapter connects it to Gramlot's existing Source,
Data and remote lifecycle. Keep reusable configuration separate from mounted
instance Data. A Python-definition reference plus loading configuration is a
proposal, not an approved representation or a decision to store executable code.

Read-only inspection of local gramlot-py-server kajenn.py and
collection_resources.py confirms existing collection asset serving with a fixed
registry and immutable resources. It does not implement writable grouplet
storage. Core server/resources.py validates names/orders resources, not storage.
Constitution 11.57 places named resource hosting in genro-kajenn. Determine the
concrete resource-host extension point rather than creating a duplicate registry
or treating browser assets as a writable grouplet catalogue.

Next: settle what is saved and its concrete resource loading contract, then
qualify configuration round-trip, missing/denied resources and isolated mounted
instances. No runtime implementation or new test result is claimed by this
planning update. See the revised P1 contract for acceptance cases.


<a id="gc-360-065"></a>
## 065 · First implemented increment: independent collection — 2026-10-28

Owner: “ok allora su worktree separato comincia ad implementare i grouplet come
collezione autonoma”, following confirmation of components using the existing
remote Source calls. The base component is implemented in the separate worktree;
acceptance of the delivered increment and the remaining families is not implied.

### Implemented authoring

The optional `grouplets` collection defines `grouplet` (`gramlot-grouplet` in DOM).
It is prepared by the ordinary runtime build, ships alongside the other optional
collections and is never activated by the base runtime. “Independent collection”
means a separate descriptor/grammar/browser artifact selected through Page.gramlots;
it does not introduce a separate distribution or repository.

```python
from gramlot import Page as BasePage, source
from gramlot.collections.grouplets import mygramlot


class Page(BasePage):
    gramlots = [mygramlot]

    def main(self, root):
        root.dataSetter("customer.name", "Ada")
        root.grouplet(datapath="customer", remote="details", remote_title="Customer")

    @source
    def details(self, root, title):
        root.h3(title)
        root.input(value="^.name")
```

JavaScript collection import: `@gramlot/gramlot/components/grouplets` (default
export), following the existing family export convention. The prepared Python
package exports `mygramlot`, generated from the JS definition. No handwritten
Python component class or parallel grammar is introduced.

`remote` names the existing Source method, including public dotted paths or a
pointer. `remote_*` passes arguments; `datapath` supplies the existing Data scope.
The component uses the shared slotted Container; Source owns its content and
RemoteBinding owns request timing, parameters, first-pending queue, hooks and
cleanup. `_if`, `_cachedRemote`, `_delay`, `_timing`, `_onCalling` and `_onRemote`
retain their current meanings. With no remote there is no remote request; static
children use ordinary Source. This is not a second loading mode or resource loader.
The explicit Data paths in examples distinguish instances; no automatic path,
implicit Bag, instance registry or copy/save behavior is introduced.

A remote replacement preserves the Source node and its semantic binding, and can
reconstruct the container DOM under the existing renderer contract. Do not store
application state on the element or assume DOM identity across a remote update.

### Verification and boundaries

- Runtime build passes with Node 22 and the normal collection generator.
- Seven new JS tests cover optional activation/grammar, two-instance Data editing,
  reactive loads, nested fragments/dotted targets, first-pending queue, removal
  during a request, readiness/cache, and a prepared browser artifact rendering
  actual Python Page and remote Source responses under JSDOM.
- Two new Python tests cover the generated verified descriptor, optional grammar,
  Page bootstrap, real dotted Source dispatch and denied/missing methods.
- Focused regression run: 100 JS tests; 64 Python tests plus 95 subtests pass.
- Generated Python and npm collection files have matching bytes. No real-browser,
  adapter/Kajenn integration or publication qualification is claimed.

The first increment implements the base component only. Card, form, panel,
wizard, topic, chunk, choice and grid compositions are not supplied by this
collection yet. Saved definitions/loading options and Kajenn resource resolution
remain required follow-up work; their representation and write API are still
open. A remote method argument is not silently treated as a resource identifier.


<a id="gc-360-070"></a>
## 070 · Incremental gallery qualification — 2026-10-28

Owner: “si :farei un pezzettino per volta e farei nela. galleri dei casi con i
@source necessari”. Start with the implemented base before adding more families.
The connected examples worktree is
`/Users/gporcari/Sviluppo/gramlot/worktrees/grouplets-gallery`, branch
`codex/grouplets-gallery`, based on develop
519ef3e76d2b2ea634114404c780e052aa8351b5.

Gallery section Grouplets, pages/09-grouplets: g01 remote parameters, g02 two
instances of the same method with independent Data, g03 nested Source fragments
with relative Data. Every case includes Python @source definitions, equivalent
JavaScript registered methods, a README and standard sample-Data companion.
Collection preparation/resource inventory and existing navigation/behavior/parity
checks include the new family. No new core behavior is needed by these examples.

Gallery build and targeted Source/endpoint parity, JSDOM interactions, catalogue
and navigation checks pass. Chromium verifies all three through the real Python
gallery: navigation, actual requests, field edits, isolated/nested Data and
complete @source code in the Code tab, with no page/HTTP errors.
The old mutable adapter checkout could not load a companion without Logic; use
the existing committed adapter develop b75f33a10db84328deff56e75499928458846a87
(read-only snapshot), which already supports it and sample Data. No adapter
source fix or runtime workaround was introduced.

Local review: http://127.0.0.1:8795/ while the preview process is running.
No deployment or release. Remaining work: review this base increment, then
introduce composed families in small slices with their own gallery cases.
Saved resource/loading options through Kajenn remain a separate unresolved
contract, not implied by these direct @source examples.


<a id="gc-360-075"></a>
## 075 · Useful legacy-derived gallery scenarios — 2026-10-28

Owner feedback: “per il grouplet guarda i test del legacy e vorrei che non facessi
esempi cosi scarni se non non si capiscea che diavlo servano”. The initial gallery
cases in §070 were considered too sparse; their pedagogical design is superseded
by the scenarios below. This requests an examples revision, not a new runtime API.

Read the archived legacy test pages 01_grouplet_basics.py and
08_grouplet_edge_cases.py, plus examples/address_fields.py and
examples/recursive_grouplet.py, from the PORT-0025 evidence snapshot. Their
complete addresses, contact fields, isolated instances and nested composition
inform three revised lessons:

- g01 Customer onboarding: switch between person/company fields, edit shared
  contact details and retain the draft when switching back; live contact preview.
- g02 Order addresses: one complete address editor reused for independent billing
  and shipping Data, with invoice/delivery routing summaries.
- g03 Service visit: a site dossier with nested contact/address grouplets, access
  instructions and a live visit briefing; reloading the outer Source preserves
  edits in the existing Data paths.

Each includes realistic sample Data, task instructions, complete Python @source
methods, JavaScript parity, explanatory README and ordinary layout/style. The
panels do not implement the separate GroupletCard or GroupletForm contracts.
No database save, automatic resource catalogue, recursive lazy tabs or legacy
remote queue semantics are claimed.

Verified: seven targeted Source-parity/behavior/naming tests and six endpoint-
parity/navigation tests pass. Chromium exercises all three on the actual Python
gallery, including remote arguments, editing, independent Data, repeated outer
reload, complete Code-tab sources and narrow-view overflow checks; no page/HTTP
errors. Screenshots visually reviewed. Receipts:
[gallery revision](../../ports/PORT-0025-grouplets/verification/gallery-revision.md).
No core runtime change. Revision implemented and locally verified; owner
acceptance remains pending. Remaining collection families and the Kajenn saved-
resource contract retain their existing scope and unresolved decisions.


<a id="gc-360-080"></a>
## 080 · GroupletCard first increment — 2026-10-28

Owner requests the card next, with legacy tests and complete gallery examples,
and confirms the concrete scope with “Confermo questo primo incremento”. The
paired constitution records the complete decision. Implemented in the optional
collection: groupletCard, bindable title, chromeSide top/left/right, boolean
collapsible/collapsed, nullable checkbox, authored or remote children and nested
cards. GC-225 records the names; [card contract](../../ports/PORT-0025-grouplets/CARD-CONTRACT.md)
records legacy mappings, state ownership and intentional differences.

```python
root.dataSetter("shipping.ui.closed", False)
root.dataSetter("shipping.ui.checked", False)
root.groupletCard(
    datapath="shipping", title="Delivery", chromeSide="right",
    collapsible=True, collapsed="^.ui.closed", checkbox="^.ui.checked",
    remote="address_fields",
)
```

Use ordinary ^ Data bindings for interactive states. Paths resolve relative to
the card datapath, not the legacy caller pane. Literals/= pointers do not write
or acquire private state. No implicit workspace or alternate template engine.
A fold hides the retained body, makes no RPC, preserves edits and moves focus
out of hidden fields. Native header buttons support keyboard activation. A
folded title opens the card; nested cards keep independent states. A disabled
collapsible parameter displays the body without erasing the stored collapsed flag.
Remote replacement follows existing Source semantics and can reconstruct DOM;
Data restores the card states. Titles are rendered as text. Invalid header sides
or boolean states fail explicitly at the component boundary.

The new g04 gallery lesson is a complete order-review dossier: customer contact,
invoice address, delivery plan and nested workshop address, all three header
sides, review checkboxes with a live counter, outside state controls, a dispatch
briefing and reload. The customer card has authored fields; address/delivery use
reusable @source bodies. All Python definitions are visible in Code with JS twins.

Verification: 20 archived legacy JS tests; 15 grouplet/card JS tests; 71 related
core regressions; 4 Python tests pass. Three strict expected failures retain an
upstream genro-builders Python defect: Regex inside a union is not enforced, so
invalid literal state strings can be authored. The browser rejects them; no
compatibility normalization or dependency-source change is introduced. Gallery:
9 parity/behavior/naming tests, 6 endpoint/navigation tests and all 4 real Python
lessons in Chromium pass (including keyboard, reload, independent nested state,
Code and narrow-view overflow); desktop/narrow screenshots reviewed. Builds pass.
See [qualification receipt](../../ports/PORT-0025-grouplets/verification/card-qualification.md).

Implemented and locally verified, awaiting owner acceptance. Follow-up scopes
remain menu/Clear, documentation, shared form integration, other grouplet families
and Kajenn saved resources/loading options. No full legacy card parity, form
validation/save, publication or release is claimed.


<a id="gc-360-085"></a>
## 085 · Card readability correction — 2026-10-28

Owner rejects the initial visual treatment (“sono css illeggibili”) with a gallery
screenshot. Revised the existing presentation: side headers take their content
height instead of filling the whole card, collapse chevrons and hit areas are
larger, labels/fields have explicit spacing and toolbar labels sit beside their
checkboxes. The gallery uses the existing formlet col_min_width parameter to
reduce the number of columns when space narrows. CSS sources are expanded into
readable rule blocks. Header theme color pairs, Data and remote contracts remain
unchanged. This is a styling correction, not a new card API or family increment.

Core/gallery builds and the eight existing card tests pass. Chromium rechecks
the complete g04 workflow, keyboard, nested collapse, review states and reload;
no page errors or horizontal overflow at 390px. Three gallery checks (main Source
parity, endpoint parity and interaction) also pass. New desktop/narrow captures
supersede the original presentation in the receipt; owner visual review pending.


<a id="gc-360-090"></a>
## 090 · Explicit checkbox labels — 2026-10-28

Owner requests checkboxLabel and clear adjacent text in the gallery. Implemented
as a read-bound, translatable text parameter (default empty). A native label wraps
the checkbox and text caption, so clicking either writes the same Data parameter.
The caption supplies the accessible name and disappears with an absent checkbox;
it is rendered as text. Existing unlabeled declarations retain their prior naming.
No new state, event protocol or application-specific meaning enters the component.

The order lesson declares checkboxLabel="Reviewed" on customer, billing and
delivery cards; its existing review counter follows those states. Python/JS twins
and explanation are updated. Core/gallery builds, 16 grouplet/card JS tests,
4 Python tests and 3 gallery checks pass; the 3 existing upstream Python validation
xfails are unchanged. Chromium verifies label clicks, accessible names, counter,
keyboard/nesting/reload and 390px overflow. Desktop/narrow captures inspected.
Implemented and verified; owner visual acceptance pending.


<a id="gc-360-095"></a>
## 095 · Card menu/Clear and shipping workbench — 2026-10-28

Owner requests the increment with legacy tests and complete gallery cases, then
answers “Confermo questo contratto” to the concrete card.menu()/menuline and
Data-bound delitem proposal. This supersedes the pending decision recorded in
GC-070 §2480.

Legacy evidence: test_4_bound_state supplies meaningful custom menu actions;
test_8_clear retains the order while clearing shipping and disables Clear when
invoiced. The JS clearFields test checks scoped writes and excludes external/=
pointers. [Research](../../ports/PORT-0025-grouplets/CARD-ACTIONS-RESEARCH.md)
distinguishes that baseline from the additional Gramlot lifecycle qualification.

Implemented: a direct popup menu opens from the card header, using existing
menu/menuline execution, keyboard and placement. delitem is nullable and read-bound:
null/omission hides Clear, false disables it, true enables it. Clear asks through
AskDialog and nulls only unique writable value paths in the card Data subtree,
including nested/folded fields. External/non-field Data and header state pointers
are retained. Removal, a lock acquired during confirmation or replacement of the
body/scope invalidate the action. Source/Data remain authoritative; there is no
editmenu dictionary, input scraping, Bag replacement or form engine.

Gallery g05, Shipping desk, includes a real order/invoice overview, complete
delivery/contact fields, a remote nested six-field address editor, custom morning
delivery and contact-note actions, invoice lock, retained tracking reference,
reload and live briefing. Its explanation supplies the full cancel/confirm and
isolation walkthrough; Python/JS twins include both @source definitions.

Core/gallery builds, 62 JS regressions, 4 Python checks and 3 gallery checks pass.
Four strict Python xfails retain the existing upstream Regex-in-union defect,
including delitem; no dependency source edit. Chromium verifies the complete
Python lesson, keyboard/focus, nested/full Clear, locks, cancellation, retained
state/reload, Code and narrow overflow. Captures visually inspected.
[Receipt](../../ports/PORT-0025-grouplets/verification/card-qualification.md).
Implemented and verified; owner UI acceptance pending. Other family/resource/form
contracts remain separate increments, without publication.


<a id="gc-360-100"></a>
## 100 · Card inline guide and customer handover — 2026-10-28

Owner requests documentation with legacy tests and a complete gallery case, then
chooses “Primo incremento: guida nella card” over immediate shared-archive work.
This settles the scope question recorded in GC-070 §2490.

Legacy evidence: card icon click/keyboard, contextual filling, missing values and
preservation of original row Data; four focused JS tests replay successfully.
The legacy Python tests and full inline-docs demo/manual distinguish local guides
from shared addresses, manuals and editable notes.
[Research](../../ports/PORT-0025-grouplets/CARD-DOC-RESEARCH.md).

Implemented: doc is read-bound Markdown text (default empty), displayed by an
accessible information button in a nonmodal popup, also while the card is folded.
Use the shared Markdown renderer and popup geometry, with theme-aware readable
type, scrolling and viewport bounds. Raw HTML remains text and unsafe link schemes
are rejected. Empty content hides the button; title/content follow Data. Native
keyboard activation, Escape/Close focus return, outside focus/pointer dismissal,
menu interaction and listener cleanup are handled by the component. No template
engine, doc_kw, implicit workspace, archive or new request path is introduced.

The complete g06 customer handover lesson has useful customer/contact, delivery
and six-field address instructions. An ordinary formula supplies contextual
delivery Markdown from the current draft. Three @source methods, summary, review
marks, nested/folded cards, optional guide visibility and reload are included in
Python/JavaScript twins and explained step by step.

Core/gallery builds, 66 JS tests, 4 Python tests and 3 gallery checks pass. Four
pre-existing boolean-union validation xfails remain; doc introduces none. The real
Python gallery passes keyboard/focus, live-context/reopen, folded/nested guides,
empty content, reload, no guide RPC, full Code and narrow geometry checks.
Desktop/narrow captures are inspected.
[Receipt](../../ports/PORT-0025-grouplets/verification/card-qualification.md).

Implemented and verified; owner UI acceptance pending. The shared documentation
address/archive, manual sections, editable notes, languages and permissions remain
a distinct resources/Kajenn contract under the owner's explicit scope choice.
Shared form integration and other families remain separate increments. No release.


<a id="gc-360-105"></a>
## 105 · Card form integration: prerequisite and scope choice — 2026-10-28

The next requested increment is form integration with legacy evidence and a
complete gallery case. Legacy behavior covers both descendant-field error
indication and a composed GroupletForm with an independent draft, validation,
autosave/writeback, outer load synchronization and disabled Clear.
Three focused legacy JS tests pass; Python tests and example pages were inspected.

Gramlot currently supplies field validation, not the shared record form/store
lifecycle required by useForm. A card-local replacement would violate this plan's
shared ownership boundary. Owner decision, 2026-10-28:
“attendiamo di mettere l gestore di form in gramlot che per ora non c'pè ancora”.
Defer this increment until the shared form manager is available in Gramlot.
Do not start the field-error-only alternative or implement the manager within
this card task. Preserve the legacy research for subsequent integration and its
complete gallery example. No form implementation or gallery claim is made.
[Research and receipt](../../ports/PORT-0025-grouplets/CARD-FORM-RESEARCH.md).


<a id="gc-360-110"></a>
## 110 · Common-base integration — 2026-10-29

Owner: “Bene, passiamo ai Grouplets: verifica il worktree e integra nella base
comune quello che approvi, preservando il lavoro originale e aggiungendo le
verifiche necessarie. Invoice resta fuori.”

The optional grouplets collection and the six Python/JavaScript gallery lessons
are integrated into the local common release base. This includes grouplet remote
fragments and groupletCard headers, nested bodies, bound fold/check states,
authored menus, confirmed scoped Clear and inline Markdown guides. Existing Grid,
chat, mobile, selector and initial form work is retained. This is not publication
or acceptance of complete legacy-family parity.

The form prerequisite in §105 describes the original worktree on 28 October.
The common base now contains the first shared Source-owned form registers.
A new regression verifies that Clear participates in those registers: the old
value is retained, required-field errors block acceptance, restore recovers the
baseline, and the input instance remains unchanged. This does not implement the
separate Grouplet form/store lifecycle or invent a save protocol. Shared saved
resources/Kajenn, document storage and the other composed families remain future
work under their own contracts.

See [integration receipt](../../ports/PORT-0025-grouplets/verification/common-base-20261029.md)
for checks, upstream limitations and original-worktree preservation.
