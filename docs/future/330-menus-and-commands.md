# 330 · Legacy menus and a Gramlot port proposal

> **Design continuation:** [GC-335](335-common-menu-system.md) develops the full
> common menu system at the owner's request. This inventory remains evidence;
> the earlier incremental recommendation does not limit the new design's coverage.

Document ID: **GC-330**. Date: **2026-10-22**.
Status: **analysis complete; new menu capabilities and shared registry under review**.
[Concise view](../../docs_llm/future/330-menus-and-commands.md).
Related: [GC-310](310-buttons-and-button-bars.md),
[GC-320](320-frames-bars-and-windows.md),
[GC-325](325-how-to-extend-gramlot.md),
[PORT-0023](../../ports/PORT-0023-menu-expansion/README.md).

Owner requests: "allora i vorrei che tu esaminassi i menu legacy e mettessimo
anche in ballo come riportarli qui". This authorizes inspection and a port proposal,
not runtime implementation or automatic adoption of legacy APIs. Owner earlier
reaffirmed the Source model: "no va bene di fatto la slotbar diventa un flex e i
simfolo nodi hanno il resto". Source nodes, ordinary bindings and component
lifecycles remain the selected bar model; a bar storepath is not selected.

<a id="gc-330-005"></a>
## 005 · Findings and scope

Gramlot already contains a bounded menu implementation: menu/menuline under
dropDownButton, delivered with PORT-0012. It is incorrect to describe all menus
as absent. General nested, context and Bag-backed menus have not been delivered.

The useful commonality with slotBars is command identity, presentation defaults,
state and execution. A visible flex bar and a popup menu have different focus,
opening, layout and closing responsibilities. A shared command-definition registry
is a proposal, not approval to replace the existing command engine or to rename
every slotButton into a menuline.

Legacy menu data is not the same architecture as the current tree: menuFromBag
converts Bag items into menu/menuline Source nodes. This is evidence, not an
instruction to implement a second authoritative tree or to duplicate reconciliation.

<a id="gc-330-010"></a>
## 010 · Evidence and provenance

Read-only inspection:

| Source | Revision and paths |
| --- | --- |
| GenroPy | `fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea` |
| Python menu authoring | `gnrpy/gnr/web/gnrwebstruct/dojo11.py:852` |
| Bag conversion | `gnrjs/gnr_d11/js/genro_widgets.js:40–66` |
| Menuline / Menu | Same file, `2993–3096` / `3120–3403` |
| Dropdown trigger | Same file, `5657` onward |
| Compositions | `gnrjs/gnr_d11/js/genro_components.js`: MenuDiv at 180, SlotButton at 4500, ComboArrow at 5513, ComboMenu at 5648, TextboxMenu immediately after |
| Dojo keyboard/popup foundation | `dojo_libs/dojo_11/dojo_src/dijit/Menu.js`: key navigation, hover timer, nested popup behavior |
| Legacy authoring examples | `projects/gnrcore/packages/test/webpages/dojo/menu.py`: local/nested actions, disabled/store/resolver menus, selection fields and nested providers |
| PoC | `10478b57ce3f22e6445eb6b72eba343520cbebac`, `src/gramlot/menu.py`: MenuBuilder branch/webpage navigation recipe; not a port of the command-menu widget |
| Destination | core HEAD `afd5a78`; `js/src/components/buttons.js`, `js/src/view/button.js`, generated buttons grammar, `tests/test_components.py`, focused JS tests |

Legacy descriptions below are static source findings, not a fresh browser
qualification. Version-specific Dojo overrides affect behavior; wrapper source
alone does not prove every keyboard/browser combination.

<a id="gc-330-015"></a>
## 015 · Legacy capability inventory

| Area | Observed behavior | Port assessment |
| --- | --- | --- |
| Local Source | menu contains menuline; label "-" selects a separator. | Existing bounded core foundation. |
| Nested menus | A menuline with menu children or a resolver becomes PopupMenuItem. A sole dataController/dataRpc child is treated as a command provider instead. | Extend menu ownership and submenu lifecycle; do not classify every child Bag as a submenu. |
| Item presentation | label, iconClass, disabled; checked supplies a tick, favorite supplies a star. | Reuse component presentation. A check indicator alone is not proof of automatic checkbox/radio state binding. |
| Checked selection | Menu.setChecked tracks currentChecked and clears the prior item. | Define single-choice versus independent checked commands explicitly before porting. |
| Commands | Item/inherited action; context target action can override it. Action receives item attributes, context Source and event. | Preserve explicit context; do not copy implicit override precedence or global last-target lookup. |
| Nested providers | A sole controller/RPC can fire. Legacy code may run inherited action before the provider. | Retain Gramlot's exactly-one-execution-mechanism rule; legacy multi-dispatch is not a compatibility requirement. |
| Data selection | selected writes the item node label; selected_* copies chosen attributes relative to the context target. | Distinct selection contract, not automatically frame command publishing. |
| values | String or Bag input creates menu Source through menuFromBag. | Inventory only; do not add multiple coercion paths without approval. |
| storepath | Reads a Data Bag, converts its items to Source; changing the storepath rebuilds. | Define update ownership before adding this capability. Inspection does not prove modern subtree-reactive semantics. |
| Bag hierarchy | menuFromBag copies item attributes, derives labels/fullpath and recurses into nested Bags. | One explicit record schema is needed; do not reproduce its caption/label/value/node-label fallback chain by default. |
| Lazy content | Resolver-backed items create submenu resolvers. Expired resolvers are refreshed on opening; context opening can pass onOpeningMenu results. | Use owning resolver contracts; loading/error/disposal/context semantics remain to design. |
| Context invocation | Attach to parent or connectId; connectedMenu/attachTo attach elsewhere. Modifiers and validclass filter the opening target. | Needs explicit trigger and per-opening context; no global mutable context. |
| Dynamic opening policy | onOpen, menuItemCb, disabledItemCb, hiddenItemCb can update entries. | Prefer ordinary bindings and explicit hooks after their contract is agreed. |
| One option | singleOption button invokes the sole enabled item; ask requests confirmation. | Optional policy, defer from first expansion. |
| Positioning/lifecycle | Dojo popups, viewport orientation, attachTo width, parent links, unbind on destroy. | Reuse core popup geometry; specify full menu-chain cleanup/focus restoration. |
| Keyboard and hover | Dojo connects Up/Down, Right opens submenus, Left returns, hover schedules submenu opening. | Design and test a modern complete interaction contract, not a copy of versionpatch methods. |
| MenuDiv | Text/icon trigger; can also act as a value selector with caption_path and key/caption mappings. | Separate trigger presentation from selection state and command routing. |
| ComboMenu / TextboxMenu | Arrow attached to another widget; menu selection can write or append textbox values. | Separate integration recipe after generic menu/context contracts. |
| SlotButton.menupath | Switches construction to MenuDiv and uses selected item attributes as publish options. | Concrete legacy evidence for sharing command definitions between bars and menus. |
| Rich popup content | Legacy examples include slider content under menuItem. | Evidence of mixed popup composition, not proof that arbitrary fields should use menuitem roles. |
| Navigation menus | PoC branch/webpage describes page navigation. | Separate from action menus; do not conflate file routes with command keys. |

<a id="gc-330-020"></a>
## 020 · What Gramlot already implements

The built-in buttons collection defines gramlot-menu and gramlot-menu-line.
Menu admits menuline children. Nonseparator menulines require a stable code and
participate in the shared ButtonBinding action/provider/fire mechanism.

dropDownButton is an already-approved split interaction: the main surface executes
the current command, the arrow opens its local menu. Normal item selection executes
only; Shift-selection also remembers the item as the main command. Optional
persistence stores the code, scoped to the page URL and authored id. Preserve
that behavior when expanding menus.

The current dropdown owns popover opening, positioning, viewport listener cleanup,
Up/Down and Home/End navigation, Escape/Tab close handling and initial focus.
Existing navigation filters disabled items. This is the verified local baseline,
not automatic conformance to every broader menu pattern.

Important implementation constraints:

- MenuLine.prepareCommand calls the nearest dropDownButton.selectCommand directly.
  A general context/standalone menu needs an explicitly agreed owner contract.
- Dropdown.menuItems selects direct menu-line children. Recursive matching would
  not by itself implement nested focus, invocation or closing.
- MenuContainer sets a menu slot and role but is not a standalone popup controller.
- ButtonBinding remains the single executor, including ask, delay and disposal.
  Shared registry publishing is new work; do not add a parallel executor.
- Existing submenu-capable grammar shape does not establish working submenu
  runtime behavior.

No current support is claimed for generic context attachment, menuline command
registry references, storepath menus, resolver submenus or menu checked/radio state.

<a id="gc-330-025"></a>
## 025 · Recommended shared model

Proposed responsibilities:

| Part | Responsibility |
| --- | --- |
| Command definition | Namespaced key, label/icon/tooltip defaults and published command, registered in JS by a gramlot. |
| Source instance | Local identity, bindings, enabled/visible state and permitted overrides. |
| slotBar | Flex layout of ordinary Source children; independent of popup state. |
| slotButton | Command presentation and invocation through shared execution infrastructure. |
| menu / menuline | Popup command hierarchy, per-level focus and submenu ownership. |
| Invocation context | Explicit sender, designated recipient and optional context object/item for this opening. |
| Shared execution | ButtonBinding and existing subscription/publish contracts, with a bounded approved extension for registry commands. |

This evolves the proposed slotButton registry into a shared command-definition
registry; its final name and registration API are not chosen. Python still receives
JS-owned metadata through the gramlot packaging direction. Do not generate a
grammar method for each command.

Suggested Python shape, **not implemented and not yet owner-approved**:

```python
bar = frame.top.slotBar()
bar.slotButton("invoices:save")

dropdown = bar.dropDownButton("Export")
menu = dropdown.menu()
menu.menuline("Save", code="save", command="invoices:save")
menu.menuline("-")
formats = menu.menuline("Formats", code="formats").menu()
formats.menuline("PDF", code="pdf", command="invoices:exportPdf")
```

The proposed command parameter selects a definition; code remains local item
identity, needed by current dropdown selection/persistence. Labels above are
explicit instance examples; precedence/allowed overrides remain to be settled.
The snippet illustrates a possible API; it does not introduce a new approved
GC-225 name. A submenu opener must not also execute an implicit action.

Preserve application frame targeting for bar-originated commands. Context menus
also require the opening target/item: a tree row may be context while the frame
content is the recipient. Those are different roles. Missing-target handling,
standalone invocation, payload fields and context validity after removal require
explicit decisions; no guessed target or global last-context fallback.

Arbitrary controls continue to use the ordinary bar/container composition.
They must not inherit menu keyboard capture merely because commands share metadata.

<a id="gc-330-030"></a>
## 030 · HTML and accessibility boundaries

HTML menu still represents a list of commands, with li children; it provides no
automatic submenu or command execution system. menuitem/contextmenu from the
historical HTML model are obsolete. HTML menu and the ARIA menu role are different
contracts. Reusing a native tag internally is an implementation choice, not a
reason to rename the existing Gramlot menu widget.
[HTML menu](https://html.spec.whatwg.org/multipage/grouping-content.html#the-menu-element),
[obsolete features](https://html.spec.whatwg.org/multipage/obsolete.html).

A popup menu, persistent menubar and mixed-control toolbar have distinct keyboard
patterns. Proposed acceptance includes focus entering the opened menu, directional
submenu navigation, Escape returning to its opener and closing the menu chain
when leaving it. Disabled-item focus policy needs review: the existing core skips
disabled entries; adopting the complete menu pattern must not be claimed without
resolving that difference.
[W3C menu/menubar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/).

Toolbar navigation must account for controls that use arrow keys themselves.
Menu triggers expose expanded state and menu ownership; popup content should not
take keyboard input from unrelated fields.
[W3C toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/),
[W3C menu button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/).

These are design and test inputs, not a new compliance claim. Label HTML, if
requested, needs its own explicit sanitization contract; do not import legacy
raw innerHTML behavior. Existing text/icon rendering is the default foundation.

<a id="gc-330-035"></a>
## 035 · Proposed bounded delivery and decisions

The owner has asked to bring menus into the design discussion, not to start
these implementation slices:

1. Agree whether bar buttons and menu entries share the namespaced command
   definitions. Preserve existing action/provider/fire APIs and single dispatch.
2. Define menu ownership outside dropDownButton and nested popup lifecycle.
   Implement local Source menus/submenus with targeted regressions first.
3. Add the agreed registry invocation to menu lines and slotButtons, preserving
   frame routing, stable item codes and dropdown Shift/persistence behavior.
4. Specify context-menu attachment, keyboard opening and explicit per-opening
   context; test inside dialogs and floating windows.
5. Separately evaluate checked/radio menu state, value-selection recipes and
   Bag/resolver input. Inventory them now; no automatic full legacy port.

The registry and packaging direction in GC-325 is a dependency proposal, not
permission to block all local menu improvements on a broad packaging rewrite.
No alternate temporary registry should be introduced to bypass missing contracts.

Open choices: shared registry/API; popup-only trigger versus existing split
dropdown; explicit context attachment; submenu opener rules; unknown command
diagnostics; arbitrary content slot syntax; fixed/elastic spacer syntax. The
owner's proposed unnamed slotButton-as-spacer remains unconfirmed; GC-325's earlier
slotSpacer examples are not silently converted.

Dialog/floating remain the user's earlier delivery priority. No new release,
implementation phase, dependency edit or host-specific feature is authorized by
this inventory.

<a id="gc-330-040"></a>
## 040 · Verification and port feedback

Executed on the current core checkout, 2026-10-22:

- 35 existing JS tests passed: button-components and button-controller.
- One existing Python ButtonComponentTests test passed.
- JS tests use JSDOM with popover stubs; they do not qualify real popup positioning
  or browser accessibility. No legacy browser execution or new menu runtime tests.
- Paired-document syntax/link/anchor checks are recorded in GC-070.

Required future regressions: unchanged main/arrow and normal/Shift behavior;
exactly-one dispatch including ask/delay; submenu opener never dispatching;
focus return and disabled policy; two simultaneous menu hosts without context
leakage; target/Source removal during open or pending confirmation; binding and
Data changes; module/registry isolation; dismissal inside modal/collapsed windows;
edge positioning, scroll/resize and touch; cleanup of every popup/listener.
Bag/resolver work must separately cover refresh, latency, error/retry and disposal.

Reusable feedback: separate presentation from command definitions and execution;
distinguish invocation context from recipient; never infer a general menu from
a dropdown-only implementation; observe existing Source/Bag contracts instead
of copying legacy fallback chains. Keep deferred capabilities visible under
PORT-0023; do not erase them when the first bounded slice lands.
