# 330 · Legacy menus and a Gramlot port proposal

> **Design continuation:** [GC-335](335-common-menu-system.md) develops the full
> common menu system at the owner's request. This inventory remains evidence;
> the earlier incremental recommendation does not limit the new design's coverage.

Document ID: **GC-330**. Date: **2026-10-22**.
Status: **analysis complete; no new runtime implementation approved**.
[Full guide](../../docs/future/330-menus-and-commands.md).
[Port record](../../ports/PORT-0023-menu-expansion/README.md).
Owner asks to examine legacy menus and discuss porting. Earlier owner statement
keeps slotBar as flex with ordinary Source children, not storepath rendering.

<a id="gc-330-005"></a>
## 005 · Findings

Core already has local menu/menuline under dropDownButton (PORT-0012).
General nested/context/store/resolver menus are missing. Share command definitions
with bars is proposed; popup and flex layout/focus remain distinct.
Legacy menuFromBag converts data to menu Source, unlike the current tree renderer.

<a id="gc-330-010"></a>
## 010 · Evidence

GenroPy revision fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea:
dojo11.py:852 menuline; genro_widgets.js:40 Bag conversion, 2993 menuline,
3120 Menu, 5657 dropdown; genro_components.js:180 MenuDiv, 4500 SlotButton,
5513 ComboArrow, 5648 ComboMenu/TextboxMenu. Paths are under
gnrpy/gnr/web/gnrwebstruct and gnrjs/gnr_d11/js respectively.
Dojo keyboard: dojo_libs/dojo_11/dojo_src/dijit/Menu.js.
Examples: projects/gnrcore/packages/test/webpages/dojo/menu.py.
Read-only source findings, not fresh legacy browser qualification.

PoC 10478b57ce3f22e6445eb6b72eba343520cbebac src/gramlot/menu.py is a
branch/webpage navigation recipe, not a command-menu port.
Core HEAD afd5a78: components/buttons.js, view/button.js, generated grammar,
focused button JS tests and tests/test_components.py.

<a id="gc-330-015"></a>
## 015 · Legacy inventory

Local entries/separators; recursive submenus; checked/favorite indicators;
Menu.setChecked single-current tracking; inherited/item/context-overridden action;
sole nested controller/RPC; selected/selected_* Data writes; values and storepath
conversion; hierarchical Bags/fullpath; resolver refresh on opening; contextual
parent/connectId/connectedMenu/attachTo attachment; modifier/class filters;
opening callbacks/disabled/hidden policies; singleOption execute/ask; popup
geometry/cleanup; keyboard and hover.

MenuDiv combines trigger and optional value selection; ComboMenu attaches an
arrow, TextboxMenu writes/appends selected values. SlotButton.menupath changes to
MenuDiv and publishes item attributes: strong evidence for common commands.
Rich slider popup examples and PoC navigation menus are separate use cases.

Do not copy label fallback chains, global last-context state, implicit action
precedence, action-plus-provider execution or arbitrary coercions. Checked icons
do not prove automatic checkbox/radio binding; storepath rebuild does not prove
subtree-reactive updates. Full capability dispositions are in the full guide.

<a id="gc-330-020"></a>
## 020 · Existing core

menu/menuline are built-in Web Components. Stable code required for nonseparator
entries; "-" separator. Shared ButtonBinding executes one action/provider/fire.
Dropdown main executes; arrow opens; selection executes; Shift also remembers
default; optional persistence stores code under page URL/id.

Current dropdown owns popover/geometry, navigation, disabled filtering,
focus/close and cleanup. MenuLine.prepareCommand directly calls nearest
dropDownButton.selectCommand; direct-child menuItems lookup and simple
MenuContainer cannot provide standalone/nested ownership. Grammar admitting
children does not prove submenu runtime. Registry publishing, context hosts,
storepath and checked/radio contracts are absent.

<a id="gc-330-025"></a>
## 025 · Shared model proposal

JS command definitions provide namespaced key/presentation/publish defaults.
Source instances retain identity, bindings and allowed overrides. slotBar owns
flex; menu owns popup hierarchy/focus; ButtonBinding remains sole executor.
Registry name/API extension is not approved.

Proposed syntax only:

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

command is a proposed registry reference; code remains local selection identity.
No per-command grammar or parallel executor. Submenu opener must not implicitly
dispatch. Distinguish sender, frame recipient and opening item/context; missing
targets and context lifetime need decisions, never global fallbacks.
Free controls keep ordinary bar composition and their own keyboard behavior.

<a id="gc-330-030"></a>
## 030 · Standards

HTML menu is a list-of-commands container, not automatic popup behavior;
menuitem/contextmenu are obsolete. No forced tag/component renaming.
[HTML](https://html.spec.whatwg.org/multipage/grouping-content.html#the-menu-element),
[obsolete](https://html.spec.whatwg.org/multipage/obsolete.html).

Review menu/menubar focus, submenu direction, Escape/Tab and disabled focus policy;
current core skips disabled items, so do not claim full pattern conformance.
Mixed-control toolbar navigation must preserve controls' own keys; triggers
expose menu expanded state.
[Menu](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/),
[toolbar](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/),
[trigger](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/).
These are test inputs, not implementation claims. Any HTML label contract needs
explicit sanitization design; do not carry raw legacy HTML behavior.

<a id="gc-330-035"></a>
## 035 · Delivery proposal and open points

Proposed slices: shared-definition decision; explicit local menu/submenu ownership;
registry invocation in menu/bar; context attachment/opening context; later
checked/radio, selection recipes, Bag/resolver input. No broad packaging rewrite
as an assumed prerequisite and no temporary alternative registry.

Open: registry/API, popup-only trigger versus existing split dropdown, context
attachment, submenu execution, unknown references, free-content slots, spacer
syntax (unnamed slotButton as spacer remains proposed).
Owner's dialog/floating priority remains. New names need GC-225 confirmation.
No runtime/dependency work or release authorization.

<a id="gc-330-040"></a>
## 040 · Verification and lessons

35 existing JS tests and one Python test pass. JS popovers are JSDOM stubs;
no fresh real-browser/legacy qualification or new behavior tested.
Document checks recorded in GC-070.

Future regressions: split/Shift/persistence, once-only dispatch, submenu openers,
focus/disabled policy, independent contexts, removal during pending execution,
bindings, registry isolation, modal/collapsed windows, positioning/touch, cleanup;
resolver refresh/loading/error/disposal separately. Retain missing capabilities
under PORT-0023; reuse the shared executor and distinguish context from recipient.
