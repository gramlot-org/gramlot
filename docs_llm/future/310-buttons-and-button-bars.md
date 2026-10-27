# 310 · Buttons and button bars: legacy analysis and 0.3 proposal

> **Menu follow-up, 2026-10-22:** [GC-330](330-menus-and-commands.md) records
> the legacy/core inventory and proposed command sharing between bars and menus.
> The owner reaffirmed flex bars with ordinary Source children. A shared registry
> and unnamed slotButton spacers remain proposals; unknown-name behavior is open.

Document ID: **GC-310**. Date: **2026-10-17**.

> Current scope: see [§040](#gc-310-040). One unified dropdown; button bars are deferred to containers.

Status: source analysis complete; button component direction accepted; extended
APIs/sequence proposed, not implemented. Full evidence in the paired document.

<a id="gc-310-005"></a>
## 005 · Owner scope and evidence

Owner confirms button → gramlot-button, html_button stays plain; requests the
whole legacy syntax, dropdown and button-with-LED, then adds adjacent alternative/
sticky commands, dropdowns, dynamic add/remove and leading/trailing objects.
This authorizes analysis, not every legacy feature/API. Legacy revision:
fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea.
Evidence: gnrwebstruct dojo11.py/base.py; genro_widgets.js _ButtonLogic, Button,
LightButton, RadioButton, Menu/Menuline/DropDownButton; genro_components.js
SlotButton/MultiButton/StackButtons/SlotBar; Dojo Button.js ToggleButton/ComboButton;
test html/button.py, dojo/menu.py, components/multibutton.py and test15 revised/gui/
multibutton.py. Typed dijit.py declarations and PoC census are not runtime proof.
Current core ButtonBinding and PoC HTML/stack-button code inspected. No live
legacy execution or new runtime verification claimed.

<a id="gc-310-010"></a>
## 010 · Actual legacy family

button/lightButton share command logic; lightButton is a div, not pure HTML.
toggleButton has boolean checked/pressed state, no custom _ButtonLogic adapter
found. radioButton is an exclusive radio input (group/name, value→checked), not
the command Button. dropDownButton opens one child popup; comboButton separates
main action and arrow. slotButton adds toolbar/publish routing. multiButton is a
command/selection strip; stackButtons controls stack panes; slotBar lays out
arbitrary content. No dedicated public LED parameter found: LED is a proposed
visualization of state, distinct from exclusive group semantics.

<a id="gc-310-015"></a>
## 015 · Command syntax and execution order

Legacy: label/caption wrappers, iconClass/showLabel/iconRight, inherited action,
current attributes, event/_counter/modifiers, nested controller/RPC, ask with
askIf/askOn/skipOn, fire then publish then fire_*, inherited _delay, disabled,
parentDisabled, _shortcut/_shortcut_activeForm. Ask conditions combine; do not
infer askIf as universal veto. Legacy can execute child and action together.
Immediate clicks get a 200ms guard; tabindex defaults to 32767. These differ from
Gramlot's approved single-mechanism/no-200ms-guard contract. Preserve current
Gramlot rules. Its attachment gate requires native button today: tag replacement
alone breaks behavior. Reuse the engine; test submit/reset/type/bubbling explicitly.

<a id="gc-310-020"></a>
## 020 · Dropdown and menu syntax

Legacy dropDownButton(...).menu().menuline(...); '-' separates; nested menu is
submenu. Inherited/item action receives item attrs/context/event; selected and
selected_* write selection. checked/favorite indicators, nested controllers/RPCs.
values/storepath/resolvers, callbacks, context menus extend scope beyond triggers.
Popup refresh before opening, minimum button width, placement, destroy and versioned
onOpeningPopup/onOpenedPopup hooks observed. Proposed first scope: local Source
menus, nesting/disabled/checked, command/selection, focus/keyboard/close; retain
arbitrary-popup requirement in design. Store/context breadth not yet accepted.
Split arrow must never execute main action.

<a id="gc-310-025"></a>
## 025 · MultiButton and the expanded button-bar request

Observed: multiButton(value, values='a:Alpha,b:Beta') or items='^.items'; identifier
defaults code, caption defaults caption. sticky=True selects persistently;
sticky=False fires command payload. multivalue uses Shift-click and comma codes;
ordinary click selects one. mandatory defaults sticky. item(code,caption,prev=True)
is fixed leading content; explicit other items trail the Bag items. Item action
overrides inherited selection. plusitem(ask=...,selectLast=True) publishes appendItem;
appendItem updates Bag and optionally selects. deleteAction, per-item False,
deleteSelectedOnly, readonly rows; itemsMaxWidth central scrolling and fixed arrows;
content_* and caption_format/dtype. store() uses SelectionStore; storepath deprecated.

Limitations: runtime generates lightButton and keeps explicit item attributes,
not arbitrary subtrees/dropdowns. Mixed dropdowns and arbitrary leading/trailing
objects are new requested composition requirements, informed by slotBar named slots,
elastic '*', separator '|' and numeric spacers. Group deleteAction=True maps to DB
deleteAsk, per-item true can delete local Bag; do not copy this ambiguity. Rebuild
clears all controls and selection repair is weak for multivalue. Per-item sticky
does not prove independent toggle behavior: group click captures group sticky.
Propose Source/Data-owned central items with stable identity and real Source side
subtrees; no separate DOM state. Touch multiple selection cannot require Shift.
Public composition names and selection semantics remain to be settled.

<a id="gc-310-030"></a>
## 030 · Proposed Gramlot implementation boundaries

Accepted button → gramlot-button; html_button stays native. JS descriptions,
generated Python metadata, same names per GC-225. No automatic labelbox proposed
for caption, but preserve unlabeled command alignment in formlet.
Proposed: native inner button + explicit engine integration; boolean LED/exclusive
choice reuse Data writers; popup/split reuse popup services; bar composes shared
controls with stable identity/add/remove/fixed sides. Existing radioButton and
radioButtonText value semantics stay intact. Keep default button available to
existing pages without silently imposing a new collection prerequisite; loading
design still to settle. No automatic DB/store/form-save/frame/stack port.

<a id="gc-310-035"></a>
## 035 · Required qualification and decisions

Settle toggle/exclusive presentation API, mixed bar selection/composition and popup
scope before implementation. No repeat confirmation of accepted component direction
or requested bar analysis. Test exactly-once clicks/keyboard/touch; ask/cancel/delay/
disposal and disabled-after-await; native html_button; typed state; accessible names;
popup close/focus and split action separation; dynamic deletion/selection/focus;
side content preservation; lifecycle; themes/touch; portable grammar and activation.
Analysis does not claim runtime completion or test passage.


<a id="gc-310-040"></a>
## 040 · Revised scope and unified dropdown — owner, 2026-10-17

This section supersedes the earlier proposed two-widget dropdown/combo split and
button-bar delivery sequence; the preceding sections remain legacy evidence.

Owner: “per il momento lasciamo fuori dal perimetro la bottoniera. di fatto
rientra poi nei containers”. Defer multiButton/mixed bars, dynamic item addition/
removal and leading/trailing regions to the container workstream. Retain the
analysis, but do not implement those features in this button increment.

Owner: “farei un unico widget dropdown con una azione default che viene fatta
cliccando sul bottone; il bottone da solo non apre menu; però deve essere previsto
di cambiare azione principale cambiando etichetta e magari con opzione persist”
(spelling normalized). One dropdown widget has distinct main-command and menu-arrow
surfaces. The main surface executes the current default action and never opens the
menu; only the arrow opens it. The selected main command and its displayed label
can change together. Optional persistence of that choice belongs in the design.
No separate comboButton is planned. This is a deliberate simplification relative
to legacy, not an alias or compatibility mode.

The authoring name and exact parameter spellings remain to be finalized; keep the
existing dropDownButton proposal as a proposal. The owner has not yet specified
whether selecting a menu item also executes it immediately, nor the persistence
scope/key/default. Suggested next contract: selecting a command executes it and
makes it the main command; opt-in persistence restores the selected command by a
stable identifier (not serialized executable code). These details are proposals,
not implementation authorization or claims of available behavior.


<a id="gc-310-045"></a>
## 045 · Approved implementation contract — 2026-10-17

Owner: “ok aggiorna il contratto e procedi con button, toggle con led e dropdown unico con questa logica e persist, lasciando fuori la bottoniera. aggiungi gli esempi nella gallery”. This supersedes the open execution/API questions of §040.

- `button(caption, action=...)` renders `gramlot-button`; `html_button` is pure HTML.
- `toggleButton(caption, value="^enabled", action=...)` renders `gramlot-toggle-button`, with boolean Data and a visible LED/aria-pressed state.
- `dropDownButton(caption, action=..., persist=True, id="export")` renders `gramlot-drop-down-button`. Its main surface executes the current command; its arrow alone opens the menu.
- Author menu children as `menu().menuline(caption, code="csv", action=...)`. A normal selection executes only. Shift+selection executes and sets that item as the main command, including its caption. Keyboard activation carries the same Shift rule.
- Persistence is opt-in, scoped to the page URL and explicit dropdown `id`; it stores only the item code. A missing saved item restores the authored default. Storage unavailability leaves the current in-memory selection usable.
- The family is built in, preserving availability of `button` without an opt-in collection. Definitions and generated portable metadata remain shared between JS and Python.
- All command surfaces use the existing single action/controller/fire engine, ask and delay handling. Toggle state uses the existing component Data adapter. Readonly/disabled block user toggles; external Data remains authoritative.
- The first menu is a local declarative command list with disabled entries and separators (`menuline("-")`). Nested menus, button bars, add/remove APIs and leading/trailing bar objects remain outside this increment.
- Caption content is slotted Source; parameter `icon` is optional text/emoji. Shared theme and touch tokens govern the internal native buttons. Native form buttons belong to `html_button`; the Gramlot command surfaces do not implicitly submit a form.

Internal implementation choices: descriptor `command` explicitly requests ButtonBinding. Component hooks `commandTarget`, `prepareCommand`, `attachCommand`, `releaseCommand` coordinate selection and lifecycle; `activateCommand` is installed by ButtonBinding and dispatches through that same engine. No second evaluator or application DOM wiring is introduced.
