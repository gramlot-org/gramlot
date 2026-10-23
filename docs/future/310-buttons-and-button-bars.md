# 310 · Buttons and button bars: legacy analysis and 0.3 proposal

> **Menu follow-up, 2026-10-22:** [GC-330](330-menus-and-commands.md) records
> the legacy/core inventory and proposed command sharing between bars and menus.
> The owner reaffirmed flex bars with ordinary Source children. A shared registry
> and unnamed slotButton spacers remain proposals; unknown-name behavior is open.

Document ID: **GC-310**. Inspected: **2026-10-17**.

> Current scope: see [§040](#gc-310-040). One unified dropdown; button bars are deferred to containers.

Status: source analysis complete; button Web Component direction accepted;
extended family/API and implementation sequence proposed, not implemented.

<a id="gc-310-005"></a>
## 005 · Owner scope and evidence

The owner proposes moving `button` to `gramlot-button`, retaining `html_button`
as plain HTML, and confirms “si” before requesting analysis of the whole legacy
syntax, including dropdown buttons and “un button con un led”. Follow-up expands
the analysis to the button bar: adjacent alternative/sticky buttons, dropdowns,
addition/removal and leading/trailing objects. That expansion does not silently
approve every legacy database/store feature or a final new API.

Source evidence in `genropy/genropy`, revision
`fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`:

| Reference | Repository path and inspected lines |
| --- | --- |
| L1 · Python declarations | `gnrpy/gnr/web/gnrwebstruct/dojo11.py`, 780–865; `base.py`, 413–430 and 758–762 |
| L2 · Command buttons | `gnrjs/gnr_d11/js/genro_widgets.js`, 3501–3695 (`_ButtonLogic`, LightButton, Button) |
| L3 · Radio | Same file, 3763–3810 |
| L4 · Popup/menu | Same file, 2993–3100, 3120 onward, 5657 onward |
| L5 · Toggle/split button | `dojo_libs/dojo_11/dojo_src/dijit/form/Button.js`, ComboButton at 281, ToggleButton at 378 |
| L6 · Generic widget dispatch | `gnrjs/gnr_d11/js/genro_wdg.js`, 130–156, 285–301; `genro_widgets.js`, 1514–1529 |
| L7 · Bar recipes | `gnrjs/gnr_d11/js/genro_components.js`, SlotButton at 4500, MultiButton at 4567, StackButtons at 4933, SlotBar at 6155 |
| L8 · Working examples | `projects/gnrcore/packages/test/webpages/html/button.py`, `dojo/menu.py`, `components/multibutton.py`; `projects/gnrcore/packages/test15/webpages/revised/gui/multibutton.py` and `gnrwdg/slotbar.py` |
| L9 · Typed declarations (not runtime proof) | `gnrpy/gnr/web/widgets/dijit.py`, 335–395 |

Gramlot references: `js/src/view/button.js`, `js/src/binding/ask-dialog.js`,
`js/src/components/inputs.js`, component registry and collections; constitution
11.75/11.84. PoC evidence: `js/dom/src/contrib/html/html-builder.js` still marks
native buttons for command dispatch; `js/dom/src/collections/layout.js` includes
stack-button composition. Census cards alone do not prove a working component port.
This was source inspection, not an interactive legacy/browser execution test.

<a id="gc-310-010"></a>
## 010 · Actual legacy family

| Name | Meaning and syntax | Important boundary |
| --- | --- | --- |
| `button(label, ...)` | Momentary command; `iconClass`, `showLabel`, `iconRight`, `disabled`, `focusOnTab`, `_shortcut`, styles | Python base also has a caption wrapper; active Dojo declaration uses label |
| `lightButton(...)` | Lighter presentation, rendered as a div; label/innerHTML, same `_ButtonLogic` | Not a pure HTML button and not a distinct action engine |
| `toggleButton(label, checked=...)` | Two-state pressed button, Dojo toggles checked and exposes pressed state | No custom `_ButtonLogic` subclass found; do not assume every Button extension applies |
| `radioButton(label, group=..., value=...)` | Exclusive radio control; group becomes native name, value projects to checked; label_* styling, inherited action | This is the actual radio input family, not the momentary Button class |
| `dropDownButton(label, ...)` | Opens one child popup (menu or other popup-capable content), optional `arrow=False` | Does not inherit `_ButtonLogic`; extracting action/fire does not prove dispatch |
| `comboButton(label, ...)` | Main command surface plus separate dropdown arrow | Dojo split-button behavior; generic legacy handler, not the custom Button handler |
| `slotButton(...)` | Recipe for icon-only/toolbars, optional label, publish target/command/opt_*, menupath | Frame/slotbar targeting and store menus are additional services |
| `multiButton(...)` | Adjacent item commands or persistent single/multiple selection | Includes local Bag items and optional database SelectionStore |
| `stackButtons(...)` | Buttons representing stack children and closing/selecting panes | Requires a stack container; not merely a synonym for multiButton |
| `slotBar` / `slotToolbar` | Named content regions, spacers, arbitrary controls | Layout composition, not a selection group |

The requested LED is a visual state indicator. The inspected toggle code exposes
`checked` and pressed state, with a check-mark/icon in the Dojo template, not a
dedicated public `led` parameter. A modern LED appearance is therefore a proposed
presentation of state, not a claim of exact legacy API parity. A boolean toggle
and an exclusive radio group must retain different value semantics.

<a id="gc-310-015"></a>
## 015 · Command syntax and execution order

Legacy `_ButtonLogic` supports:

- `action`: inherited action, evaluated with current node attributes, `event`,
  `_counter` and `modifiers`; attributes may carry `=`/`^` values and references.
- A single nested `dataController` or `dataRpc` can be fired by the click. Legacy
  can then also run action/fire: it does not enforce Gramlot's one-mechanism rule.
- `ask={title, fields, ...}` on actions, including `askIf`, `askOn`, `skipOn`.
  `askIf` participates in a combined OR condition; it is not simply a universal
  veto of every other ask condition. Preserve Gramlot's already documented rules.
- `fire`, otherwise `publish`, otherwise `fire_*`, after the action branch.
  `fire` carries modifiers or true; `fire_*` carries its suffix; event attributes
  include modifier and counter. The literal `publish` convenience is observed in
  legacy, not promised for the current Gramlot button.
- `_delay` inherited from ancestors: restart the timer and execute once after the
  click burst, passing its count. The immediate legacy path temporarily disables
  the node for 200 ms. Gramlot deliberately did not port that guard (11.75).
- `disabled`, plus `parentDisabled` for multiButton items; `_shortcut` checks
  visibility, active layer, disabled state and optional `_shortcut_activeForm`.

Legacy button styling explicitly moves height/width/padding/background properties
to the inner Dojo button; iconClass can change dynamically. Its unusual default
tabindex of 32767 unless focusOnTab is enabled is not a modern keyboard contract.

Gramlot already owns action/ask/fire, nested provider dispatch, delayed cancellation,
references and one-mechanism enforcement in ButtonBinding. Moving to a custom
element must preserve this engine rather than copy the legacy click handler.
Its current attachment gate explicitly requires an HTML element named `button`:
changing only the rendered tag would silently lose behavior. Native submit/reset,
type defaults and prevention/bubbling also require an explicit migration test.

<a id="gc-310-020"></a>
## 020 · Dropdown and menu syntax

Observed legacy declaration:

```python
menu = pane.dropDownButton('Commands', iconClass='iconbox gear').menu(
    action='alert($1.code)')
menu.menuline('Open', code='open')
menu.menuline('Save', code='save', disabled='^.locked')
menu.menuline('-')
submenu = menu.menuline('Export').menu()
submenu.menuline('JSON', action='alert("JSON")')
```

`menuline('-')` is a separator; nested menu content is a submenu. Item action can
override inherited menu action. The callback receives item attributes, context
Source node and event. `selected` writes the item node label; `selected_*` writes
corresponding item attributes. `checked` gives an indicator; `favorite` supplies
a star. A nested single controller/RPC is another path.

Menus also accept `values`, Bag-backed `storepath`, resolver-backed content,
`menuItemCb`, `disabledItemCb`, `hiddenItemCb`, context-menu modifiers/validclass,
and attachment to other targets. These are broader than a dropdown trigger.
Dropdown refreshes content before opening, sets minimum popup width from the
button, positions around it, and destroys its popup with the owner. Versioned
hooks include `onOpeningPopup`/`onOpenedPopup`; Dojo-specific patches are evidence,
not APIs to reproduce mechanically.

For 0.3, propose declarative local menu content, nested items, disabled/checked
state, selection/action and consistent keyboard/focus/close lifecycle first.
Arbitrary popup content must be kept in the design rather than treating every
dropdown as a selection input. Store/resolver/context-menu breadth remains a
separate scope decision. A combo button's arrow must not run its main action.

<a id="gc-310-025"></a>
## 025 · MultiButton and the expanded button-bar request

Actual legacy syntax:

```python
pane.multiButton(value='^.mode', values='list:List,grid:Grid')
pane.multiButton(value='^.selected', values='a:Alpha,b:Beta,c:Gamma',
                 multivalue=True, mandatory=False)

bar = pane.multiButton(value='^.command', sticky=False)
bar.item('refresh', caption='Refresh')
bar.item('special', caption='Special', action='alert("special")', _delay=400)

bar = pane.multiButton(value='^.selected', items='^.items', itemsMaxWidth='300px')
bar.item('previous', caption='Previous', prev=True, action='alert("previous")')
bar.plusitem(ask=dict(title='Add item', fields=[dict(name='code'),
                                             dict(name='caption')]),
             selectLast=True)
```

The last example illustrates the recovered recipe spelling; it is not executable
Gramlot 0.3 API. Legacy `multibutton_item`/`multibutton_plusitem` implement the
child `item`/`plusitem` recipe dispatch.

| Feature | Observed legacy behavior |
| --- | --- |
| `sticky=True` (default) | Click writes an item identifier to value and keeps it selected |
| `sticky=False` | Momentary command uses fire semantics with action code in the event payload |
| `multivalue=True` | Shift-click toggles codes in a comma-separated string; ordinary click selects one |
| `mandatory` | Defaults to sticky; guards removal of the last multiple selection and may choose the first item on rebuild |
| `values` | Comma-separated code:caption choices, can be reactive |
| `items` | Local Bag, `identifier='code'`, `caption='caption'`; captions may use caption_format/caption_dtype |
| `item(..., prev=True)` | Fixed leading item; other explicit items are trailing, surrounding Bag-generated buttons |
| Item action | Overrides the inherited group selection action; allows commands beside sticky choices |
| `plusitem` | Nonsticky '+' recipe; ask result is published as appendItem, optional selectLast |
| `appendItem` | Adds/updates the local Bag using identifier and optionally selects it |
| `deleteAction` | Close affordance, per-item override/False, deleteSelectedOnly and readonly-row handling |
| `itemsMaxWidth` | Scrollable middle section with leading/trailing scroll buttons; selected item scrolled into view |
| `content_*` | Caption styling; group disabled state also checked by item clicks |
| `store()` / storepath | SelectionStore/database integration; storepath is marked deprecated in runtime |

Important source qualifications:

- The inspected makeButtons path constructs **lightButton** items, not arbitrary
  dropdown children. Fixed items are captured as attributes, not general child
  subtrees. Mixed dropdowns and arbitrary leading/trailing objects are requirements
  from this request; they must be explicitly designed, not claimed already supported
  by legacy MultiButton. SlotBar is the complementary composition reference.
- SlotBar's `slots='leading,*,buttons,|,trailing'` expresses named arbitrary content,
  elastic `*`, separator `|` and numeric pixel spacers. Use modern layout rather
  than porting its table construction.
- Group-level `deleteAction=True` is converted to a SelectionStore deleteAsk call.
  A per-item boolean true can reach local defaultDeleteAction. Do not copy this
  ambiguous local/DB behavior; local removal must stay independent of databases.
- Rebuilding clears every item; current-selection validation checks an identifier
  and is not a robust specification for a comma-separated multiple selection.
  Stable item identity, focus preservation and selection reconciliation need tests.
- `sticky=False` on an explicit item is not in itself proof of independent toggle
  semantics: the click branch is captured from the group; plusitem works through
  its own action. Preserve desired behavior, not accidental attribute permissiveness.

For Gramlot propose one compositional bar with leading content, ordered central
items and trailing content. Items can be commands, boolean toggles, exclusive
choices or dropdowns. Selection belongs to Data; item identity belongs to Source/
the declared Bag; add/remove modifies that owned model, not a parallel DOM array.
Leading/trailing content must accept actual Source subtrees (text, counts, search,
buttons, menus), and remain independent of central selection and scrolling.
Final public method/slot names and the multiple-selection touch interaction are
not fixed by this analysis. A Shift-only multiple-selection path is insufficient
for the requested touch mode.

<a id="gc-310-030"></a>
## 030 · Proposed Gramlot implementation boundaries

Accepted direction: `button` renders `gramlot-button`; `html_button` remains native
and free of implicit Gramlot command dispatch. JS owns descriptions and behavior;
Python consumes generated collection metadata. Names remain the same in both
languages under GC-225. No automatic Labelbox is needed for a button's own caption;
formlet alignment must nevertheless retain a space for unlabeled command controls.

Proposed implementation, pending API review:

1. Native-button-backed component with theme/touch styling, caption/icon and state;
   reuse ButtonBinding through an explicit component contract, not DOM tag guessing.
   Do not create a second click executor or duplicate events across shadow boundaries.
2. Boolean pressed/LED presentation and exclusive-choice presentation reuse the
   existing Data writer and radio-group semantics. Existing radioButton and
   radioButtonText must not change value type or lose input behavior.
3. Dropdown/split command surfaces reuse popup geometry and lifecycle services,
   with Source-authored content and accessible focus handling.
4. Compositional bar reuses those components: selected/group state is orthogonal
   to visual joining, command execution and popup opening. Add/remove and fixed
   side regions do not recreate unaffected controls or lose draft/focus state.
5. Python-first compact lessons show all variants, Data changes and dynamic items
   across Python, Node and serverless, four themes, normal/touch, light/dark.

Collection placement and loading require deliberate compatibility treatment:
`button` currently works without opting into inputs/layout. Converting it must not
silently break every existing page by requiring an undeclared collection.
The split of infrastructure/common base versus optional extended controls remains
an implementation decision to propose, not a reason to invent aliases or fallback.

Full stores/DB deletion, form save orchestration, frame-aware toolbar routing and
stack navigation are not automatically included. Existing action/ask/ref/publish
services should be reused; porting a presentation family does not reopen them.

<a id="gc-310-035"></a>
## 035 · Required qualification and decisions

Before implementation, settle the family authoring API (toggle/LED versus exclusive
radio presentation), mixed bar composition/selection ownership, and minimal popup
content scope. Do not ask again whether button becomes a Web Component or whether
the bar is part of the analysis: both are explicit owner requests.

Tests must demonstrate: one command invocation for keyboard/mouse/touch; existing
ask/cancel, delay and disposal behavior; disabled state before and after an await;
native html_button semantics; typed boolean/group state without feedback loops;
accessible names when captions are hidden; popup Escape/outside close/focus return;
split arrow/main-action separation; dynamic add/remove and selected-item deletion;
fixed side content and focus retained; no duplicate listeners on reconnect;
theme-token dimensions and touch sizes; generated Python/JS grammar parity and
clean collection activation. Use existing core fixtures, not a core dependency on
the gallery. Local source analysis alone is not a claim of these tests passing.


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
