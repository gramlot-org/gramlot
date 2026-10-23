# PORT-0023-menu-expansion

**Current status (2026-10-23):** the first bounded trial is implemented and verified,
awaiting owner hands-on acceptance. Owner "ok" confirms GC-335 §140; implementation
and evidence are recorded in [GC-335 §145](../../docs/future/335-common-menu-system.md#gc-335-145).
Dialog/floating and the wider legacy inventory remain deferred. No release.

## Historical record — initial inventory and proposal

The following describes the earlier read-only phase; authorization and status
were subsequently superseded by the bounded trial above.

Owner subsequently requests the full common-menu design and assessment of slotBar
as an open menu. [GC-335](../../docs/future/335-common-menu-system.md) provides
the proposal, preserving the full inventory and prior execution contracts.
Design scope is expanded; runtime implementation is still not authorized.

- **Status:** proposed; read-only inventory and destination design complete.
- **Legacy revision:** genropy@fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea.
- **PoC revision:** gramlot-poc@10478b57ce3f22e6445eb6b72eba343520cbebac; navigation MenuBuilder is separate evidence, not the command-menu implementation.
- **Destination baseline:** core HEAD afd5a78, including existing PORT-0012.
- **Constitution checked:** explicit owner decisions; Source/Data and shared execution; JS-owned descriptors; host independence; no dependency edits/workarounds; no publication.

## Evidence

[GC-330](../../docs/future/330-menus-and-commands.md) and its
[concise mirror](../../docs_llm/future/330-menus-and-commands.md) contain exact
legacy paths, inventory, current-core limits and source/test provenance.
Owner asks to examine legacy menus and discuss their port; no runtime change requested.

## Scope and contract

Propose local nested menus and explicit popup ownership first, then registry
command reuse with slotButtons and contextual invocation. Preserve the existing
dropdown split interaction, Shift selection, code persistence and single
ButtonBinding executor. Command-registry/API decisions remain open.

Inventory without automatic transfer: checked/radio state, selected_*,
MenuDiv/ComboMenu/TextboxMenu, values/storepath/resolvers, opening callbacks,
singleOption and rich popup content. No bulk port or competing source tree.

## Proposed contents

Documentation only now. Later implementation candidates are core button/menu
components, shared execution/geometry where required, generated metadata and
focused tests. Examples belong to gramlot-examples under a separately authorized
phase. Grammar/dependency gaps must be fixed in their owning libraries.

## Verification

35 existing JS button-components/button-controller tests pass; one existing
Python ButtonComponentTests test passes. JSDOM stubs popovers. No fresh
legacy/browser tests or claims of implemented menu expansion.
Documentation links, anchors and examples checked in GC-070.

## Differences and open questions

General menus cannot retain mandatory nearest-dropDownButton ownership.
Resolve shared registry scope, contextual sender/recipient lifetime, submenu
opener semantics, keyboard/disabled policy and unknown-command diagnostics.
Do not copy global context fallbacks, implicit action overrides or
action-plus-controller execution. Bag conversion historically produces Source;
dynamic menu data requires its own approved update contract.

## Destination review

- **Result:** pending owner design choices; implementation not started.
- **Accepted scope/revision:** inspection and proposal only.
- **Constitution conflict:** none for documentation. No architecture change approved by this record.

## Feedback for later ports

A dropdown-local menu is not a general menu. Keep command definitions, rendering,
execution and invocation context distinct; reuse existing infrastructure.
Preserve the full deferred inventory when bounded increments land. Legacy source
findings and JSDOM tests do not establish real-browser qualification.


## Current destination review — first trial

- **Result:** implemented and verified; owner usability acceptance pending.
- **Scope:** frame regions/central recipient, popup/bar, registered commands,
  bound states, nested resolver menus and composition; Python extra-catalogue page.
- **Checks:** GC-335 §145 / GC-070 §1715; real browser on Python/Uvicorn.
- **Review corrections:** preserve menu builder ownership on empty Source Bags;
  use explicit caption migration; preserve literal resolver text; reject command
  plus submenu; keep checked accessibility in sync; focus the first entry after
  asynchronous loading; use the documented := expression suffix for negation.
- **Preserved constraints:** no dependency source edits, compatibility guesses,
  global command context, duplicate message bus, publication or stable-API claim.
- **Remaining:** hands-on owner feedback and deferred legacy capabilities listed
  in GC-335 §145. Earlier rejected approaches and inventory remain above.


Chapter follow-up (2026-10-23): six Python lessons expose the agreed frame/menu
compositions. Real-browser review caught missing flex projection through the
contentPane shadow wrapper. Owner explicitly authorized the bounded core fix;
regression covers direction/gap updates and removal without replacing children.
All 3,801 JS tests pass; adjacent side bars and stacked top bars were verified in
Uvicorn. This is a correction within the trial, not wider legacy acceptance.


Responsive toolbar follow-up (2026-10-23, GC-335 §160): owner requested a first
version using menu/menuline, grouped units, spacers, priority overflow and scrolling.
The bounded implementation keeps original light-DOM/Source ownership through named
slots; it does not clone commands/inputs or add a parallel Data store. Seven new
regressions cover priority/ties, group identity, input binding/focus, vertical sizing,
submenu keyboard/delivery, disposal and orphan separators. Gallery/browser tests
exercise real geometry and input transfer. Preserve the lesson that overflow needs
both measurement tests and actual browser qualification. User customization remains
an explicitly deferred optional increment; usability acceptance is still pending.
