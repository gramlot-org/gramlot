# 360 · Legacy grouplets and proposed Gramlot implementation plan

> **Worktree update, 2026-10-28:** P0 is complete on current development. The original draft used identifiers now occupied by other work. This active guide is **GC-360**, port **PORT-0025**; the original plan is retained as historical evidence. Current remote semantics supersede its fixed-name/latest-wins assumptions. See [§055](#gc-360-055).

Document ID: **GC-360**. Research date: **2026-10-28**.

**Base Grouplet and GroupletCard are integrated in the local common base.** See [§110](#gc-360-110). Full legacy-family parity, resource integration and further form composition remain open; the upstream Python authoring limitation is recorded below.
[Expanded plan](../../docs/future/360-grouplets-implementation-plan.md).
[Evidence/handoff](../../ports/PORT-0025-grouplets/README.md).

<a id="gc-360-005"></a>
## 005 · Assignment and authority

Owner, this chat, 2026-10-28: “recupera TUTTO il materiale relativo ai grouplet dekl
genropy legacy e prepara un piano di imlementazione in gramlot che metteremo in un
qworktree diverso”. Authorizes research and a transferable plan, not implementation,
API approval, releases, dependency edits or worktree creation now. GC-110 remains
the completed 0.1.0 plan. Constitution §§3–7,13–14, 11.43, 11.56, the current 11.85–11.87 and
§13 apply; new names require GC-225 review. Legacy spellings are evidence.

<a id="gc-360-010"></a>
## 010 · Recovered material and provenance

Current reference: `genropy/genropy@a135c9d949d0b014a22f57c418e83b315f85e7bf`,
GitHub develop verified 28 October, committed 27 October. Local legacy HEAD
`fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea` is from 14 September.

- 196 current-tree grouplet path/content matches, 226 archived files with runtime/
  test dependencies/license. Main Python, controller, grid, card and CSS sources;
  loader/mixin/form/store/Source integration; 14 grouplet and 17 grid demo pages,
  resource trees, custom roots, transforms, collisions, documentation assets.
- Separate 135-file local legacy snapshot, with working-file hashes independent
  of its September HEAD; `local-legacy-manifest.json` and source archive.
- Direct GitHub search: 74 complete returned results (35 issues, 39 PRs), 45
  conversation and 36 inline review comments. Supplement: 247 indexed Genropy
  commits, 33 indexed issues, 36 indexed PRs, retrieved with pagination.
- Historical architecture Markdown and 43 KB store design HTML from
  `feat-grouplet-grid`, tree `b6f22d446180a0c32114bcf0e16ddc0e57ae960c`, with blob IDs.
- Six archived PoC notes/cards; 39 secondary local/archive references with hashes.
  Thirty known meeting summaries checked; one 29 September AI summary on
  GroupPanel/layout fixes, zero indexed transcript hits. No decision authority.
- Exact Gramlot working-file hashes; inspected local changes are not reproduced
  by HEAD alone. See `SOURCE-INDEX.md`, JSON inventories and evidence archives.

Coverage is the accessible current source, referenced historical branch, indexed
history and searched local roots. Deleted branches, inaccessible applications,
unindexed/private documentation are not claimed exhaustive. Archived sources are
**Historical record**, not active code, approved design or dependency pins.

<a id="gc-360-015"></a>
## 015 · What the legacy family actually contains

Basic Grouplet uses a dedicated remote body and data path. Resource discovery
handles ordinary/table resources, topics, custom roots, metadata, ordering,
permissions and enablement. Topic leaves are recursively built in one server call,
not necessarily one RPC per leaf. Metadata representations differ in legacy;
choose one approved destination representation.

GroupletForm wraps BoxForm with memory/Item defaults, separate record/controller/
origin paths and load/save transforms. Dialogs support memory/document/record;
record chunk uses isolated workspace and refresh after edit. Panels handle tree/
topic selection, pending edits, unopened mandatory groups and draft policy.
Wizard covers steps, saves, resume, summaries, confirmation/read-only and remote
parameters. Choice is single-value, with rows/DB query and optional auto-advance.
Card supplies chrome, title/collapse/tools/docs/checkbox and optional copy-edit form.

Grid repeats resource/handler/per-row-resource/struct fragments; cards/tabs/vtabs,
limits/defaults, row editing, phantom/entry/template rows, selection/clipboard,
DnD, sorting, formulas/totals/counts and shared card presentation. Legacy separates
struct adapter, DnD, store facade, controller and tiles. The facade still has
filter no-ops and private Bag movement; no complete generic-store claim or
authorization to reproduce those mechanisms.

<a id="gc-360-020"></a>
## 020 · History that changes the implementation requirements

Regression inputs: #1665 RPC/mixin identity; #1436 remote reentry; #1464 change
tracking and #1619 protected metadata; #1466 unopened mandatory groups;
#1496/#1498 wizard dismiss/save bypass; #1506 selected-step persistence;
#1537 temporary rows; #1613 empty drops; #1763/PR1764 duplicate decoration.

September's immediate-advance warning is superseded for October Next (onReload)
and Confirm (blocked/deferred handling). Back and valid panel-switch still save
then continue in their memory-store context: test asynchronous destination behavior;
do not infer a universal legacy data-loss defect.

Open proposals: #1714 multiple choice; #1095 terminal resource/initial-step scope;
#897 remaining adapter/filter work despite #900 facade completion; #899 shared
editor resolution; #909 diagnostics/identity; #910 client handler; #794 package
overrides. #1439 remains open although formulas/totals exist in current source.
Issue state is not the implementation contract. Full source links in expanded plan.

<a id="gc-360-025"></a>
## 025 · Existing Gramlot mechanisms and ownership

Reuse Page/@source/typed Source, RemoteBinding/SourceHandler, RPC envelope,
node-owned single-flight/first-pending requests, named Logic/hooks, Data bindings/controllers,
subscriptions/references and shared layout/components. Method pointers and public dotted paths are supported under current 11.85; reuse
server-declared NameSyntax and node.requests. Logic groups are not proven instance isolation.
Source received as Data must not activate code.

GC-230's planned `grouplets` capability is not an implemented catalogue. Resource
search/import/package policy/auth belongs to an appropriate resource host. Core
resource helpers validate names/order, not filesystem discovery. No Genropy/DB
dependency in core. Formlet is layout, not a form/save engine. Reuse/settle shared
form lifecycle and the shared collection contracts discussed in the archived research before dependent families.
The archived research records the direction of legacy grid formulas/totals for now; coordinate the separate grid/store workstream,
without a new Bag JS engine. Selector Kajenn/Asqueel scope does not approve every
grouplet DB service. Python-first examples live in gramlot-examples, core tests use
own fixtures. Base grouplet need not be a new Web Component; visual card requires
its own reviewed contract. No Dojo/application DOM/private Bag workarounds.

<a id="gc-360-030"></a>
## 030 · Decisions to settle before the affected implementation

Ask one owner decision at a time and record exact confirmation; do not reopen
settled decisions. Proposed gates:

1. D1: first slice = basic resource fragment, explicit Data, two isolated instances,
   reactive parameters and teardown; forms/grids later.
2. D2: portable versus hosted catalogue; first provider and single metadata format.
3. D3: resource/instance/location identity, method dispatch, explicit ID conflicts.
4. D4: loading/failure/old-body retention, install versus nested readiness, inactive bodies.
5. D5: direct/copy form data, commit/discard/transforms/dirty/invalid/async parent-child lifecycle.
6. D6: navigation, unopened required fields, draft/confirmation and save ordering.
7. D7: common-store requirements, first row representation/layout, optional grid slices.
8. D8: concrete language names/metadata/hooks under GC-225 before each API increment.

No proxy, class, registration format or spelling is approved by this list.

<a id="gc-360-035"></a>
## 035 · Proposed implementation sequence

| Phase | Work | Exit evidence |
| --- | --- | --- |
| P0 | Transfer dossier to verified development baseline in separate worktree | Reproducible baseline and prerequisites, no unrelated local changes |
| P1 | Approve resource/instance/dispatch/metadata/authorization contract and host | Two-resource/two-instance examples and negative provider fixtures |
| P2 | Basic typed Source/remote composition and explicit Data/cleanup | Isolation, nested/deferred routing, races, removal, failure/retry, Python fixture |
| P3 | Catalogue/topics and basic card presentation | Ordering/authorization/custom roots as approved, nested/empty/error cases, card state |
| P4 | Shared form/store lifecycle then GroupletForm and memory editor | Metadata-safe commit/discard, invalid/dirty/copy/transforms, async/parent-child cleanup |
| P5 | Panel and chunk, record variant only with service prerequisites | Save old origin before switch, Cancel, mandatory/draft and isolated chunk refresh |
| P6 | Wizard and single choice | Forward/back/stepper/close, editor/save deferral, confirmation, first insert/reload |
| P7 | Basic repeated card/Source grid consuming common store | Stable identity, external changes/replacement, nested teardown, locks/limits |
| P8 | Separate advanced grid slices | Layout/lazy/heterogeneous/struct/temporary rows/selection/clipboard/DnD/formula/doc checks |
| P9 | Python examples, chosen-host integration and acceptance | E2E, accessibility/lifecycle, paired docs, explicit omissions, owner acceptance |

P0→P1→P2→P3; shared forms→P4→P5→P6; shared collection contract + P2/P3→P7→P8;
accepted slices join P9. Basic fragments need not await full record/grid/DB work.
Each phase requires code/tests/docs/review; proposed locations are existing Page,
remote/logic/SourceHandler and shared components/collection exports. Add only
proven gaps; integration-owned discovery stays outside core. No imaginary classes
or blanket API delivery claims. Releases remain separately authorized.

<a id="gc-360-040"></a>
## 040 · Required destination qualification matrix

Test resource not-found/denied/malformed and direct-load authorization; duplicate
instances/IDs and same-named methods; typed Source versus inert Data; literal/pointer methods
and public dotted paths; single-flight/first-pending snapshot, apply both answers;
false _if preserves in-flight work/content; cache/removal/reentry;
no leaked providers/subscriptions. Verify copy/direct data and unchanged attributes/
relations; pending invalid edits/transforms/async failure; unopened mandatory groups,
Cancel/Discard, child registration, first insert, same/new record and draft/read-only.
Card/chunk: bound state, docs policy, clear scope, refresh and duplicate wrappers.
Grid: identity versus order, explicit row shape, empty/store replacement/nested
teardown/locks/limits, temporary-row promotion, clipboard/DnD/selection and stable
layout/sort changes. Formula results must be visible to another shared-store
consumer; aggregate scope is explicit. Include keyboard/focus, loading/errors,
narrow layouts, approved browsers/host. Control asynchronous completion order;
no Dojo dependency in core tests and no screenshot-only save acceptance.

<a id="gc-360-045"></a>
## 045 · Verification completed for this investigation

Exact-source legacy Node suites: **188 passed, 0 failed, 0 skipped** across
grouplet*, wizard saves, Item/memory writeback, remote reentry and field teardown.
VM/stubbed DOM evidence only; no browser/DB/E2E or Gramlot implementation claim.
Two real Python card/panel suites attempted, both blocked at collection by missing
`unidecode`; full diagnostics retained. No dependency-source workaround.
Archive hashes/checksums, paired anchors/local links and existing public-doc build
boundary are checked at delivery; plan is outside public allowlist. Runtime unchanged.

<a id="gc-360-050"></a>
## 050 · Transfer to a different worktree

Transfer paired GC-360, PORT-0025/evidence/HANDOFF and current-status entry.
Choose verified develop-derived baseline and required accepted increments at start;
HEAD alone omits inspected working changes. Re-read current instructions/contracts,
check baseline hashes, avoid copying unrelated work or editing dependencies.
Use managed-worktree tools when applicable. Work remains on development until
verified/accepted; main is consolidated. The worktree is prepared (§055); no new chat/background workflow,
release or deployment is started here. Next product decision: D1's bounded first slice.


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
collezione autonoma”. Base grouplet is implemented; owner acceptance remains open.

Opt-in `grouplets` defines `grouplet` / DOM `gramlot-grouplet`, generated through
the existing build as gramlot.collections.grouplets (`mygramlot`). Activate with
Page.gramlots = [mygramlot]. JS default import:
@gramlot/gramlot/components/grouplets. Separate collection, not a new distribution.

Python: root.grouplet(datapath="customer", remote="details", remote_title="Customer");
@source details(self, root, title) builds ordinary typed Source, e.g.
root.input(value="^.name"). remote/remote_* and explicit datapath retain existing
contracts. Shared Container renders; RemoteBinding owns requests, pointers, hooks,
queue and cleanup. No new loader, automatic Data path or duplicate state.
Remote updates preserve Source identity but can reconstruct DOM.

Build passes (Node 22). Seven new JS tests include prepared artifact + actual
Python responses in JSDOM; two new Python tests verify descriptor/bootstrap,
dispatch, denied/missing methods and grammar. Focused total: 100 JS tests,
64 Python tests + 95 subtests. Python/npm generated bytes match. No actual browser,
Kajenn integration, publication or owner acceptance claimed.

Other grouplet families and saved-resource/loading configuration remain follow-up
work; resource representation/write API unresolved. Remote method is not an
implicit resource identifier. Expanded §065 contains runnable Python authoring.


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
