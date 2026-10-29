# GroupletCard: first increment — 2026-10-28

## Owner authorization

The owner requests the next groupletCard increment with legacy tests and complete
gallery examples, and confirms the concrete proposed scope with:
“Confermo questo primo incremento”. The confirmation is recorded in the paired
constitution. Implemented and locally verified; owner acceptance pending. See verification/card-qualification.md, including the upstream Python authoring-validation gap.

## Contract

- Optional grouplets collection adds GroupletCard / groupletCard /
  gramlot-grouplet-card. Existing grouplet remains unchanged.
- title: text, default empty, read binding. Ordinary binding/template mechanisms
  compute it; no card-specific titleField/titleTemplate/template engine.
- chromeSide: top (default), left or right. Invalid values are errors.
- collapsible: boolean false by default. collapsed: boolean false by default,
  two-way parameter. A collapsed card retains its Source, DOM and Data; closing
  does not load/unload remote content. Non-collapsible cards show their body.
- checkbox: nullable boolean, null/omission hides it; false/true shows unchecked/
  checked. Two-way binding writes through the existing Source parameter path.
- checkboxLabel: text, default empty, read binding; visible native label and
  accessible name for the optional checkbox (owner addition, 2026-10-28). Clicking
  the caption activates the same checkbox; it adds no state or application meaning.
- Interactive collapsed/checkbox state uses writable ^ Data pointers. Literals
  and = bindings follow the existing read-only writeParameter rule; no implicit
  workspace, hidden state Bag or alternative persistence is created.
- All pointers resolve in the card's normal datapath, unlike legacy caller-relative
  collapsed/checkbox watchers. Explicit absolute paths can share page UI state.
- Existing remote and remote_* supply the body, or authors provide static children.
  Standard remote replacement may reconstruct DOM; persisted Data restores state.
- Header controls are keyboard accessible; collapse moves focus out of the hidden
  body. Header/title, checkbox and nested controls do not toggle ancestors.
- A folded title opens the card. Repeated folding preserves drafts and sends no RPC.
- Top/left/right header layouts use existing shared surface/header theme tokens.
  The title remains visible while folded, including side headers.

## Legacy correspondence and deliberate differences

Evidence snapshot genropy a135c9d949d0b014a22f57c418e83b315f85e7bf in
`evidence/legacy-sources.tar.gz`:

| Source | Applicable cases |
| --- | --- |
| test/webpages/gnrwdg/test_grouplet_card.py | test_0_plain, test_3_sides, test_4_bound_state (states), test_5_nested |
| gnrjs/tests/grouplet_card.test.js | keyboard chevron, folded-title opening, initial collapse, checkbox projection, cleanup |
| gnrpy/tests/web/grouplet_card_test.py | plain titled body, valid header sides, independent bound states |

The webpage lives below projects/gnrcore/packages; the Python suite below gnrpy/tests/web.
All 20 archived JS card tests were rerun successfully; see
[baseline receipt](verification/legacy-card-baseline.log). This is legacy baseline
evidence, not Gramlot implementation qualification. Python tests were inspected;
no new legacy Python execution claim is made.

Legacy animation, tools filters, drag source, resource profiles,
shared inline-document storage, field-error aggregation, title sums/fallbacks and useForm
are not implemented in this increment. Shared documentation storage and shared form
integration remain later slices under the owner's explicit confirmation, not
removed requirements. Saved resources/Kajenn integration keeps its existing open
contract. The legacy union collapsible='closed' is replaced by boolean
collapsible=True, collapsed='^ui.collapsed'. No Dojo or form engine is ported.

## Verification plan and gallery

Core tests: optional metadata/preparation; default/static and remote bodies;
initial/external/two-way states; invalid values; isolation and nesting; no RPC on
fold; preservation after remote refresh; title as text; cleanup after removal;
Python generated authoring and Source dispatch. The core uses its own fixtures.

Gallery: a complete order dossier with customer contacts, invoice address and
delivery instructions, realistic sample Data, live dispatch summary, independently
foldable/checked cards and a nested address card. All three header positions,
external state controls and an explicit remote refresh are demonstrated. Python
@source methods appear in Code. Verify actual browser edits, header keyboard
interaction, state preservation and a narrow viewport in the Python gallery.


## Menu and Clear increment — owner confirmed 2026-10-28

Owner answers “Confermo questo contratto” to the concrete proposal recorded in
CARD-ACTIONS-RESEARCH.md. Implemented and locally verified; owner acceptance
of the resulting UI remains pending.

- A single direct card.menu() popup supplies ordinary menuline actions. Its
  header Actions button uses the shared menu keyboard, placement and focus rules.
  Menus inside body containers keep their existing ownership. Permanent or
  multiple direct menus are rejected. No editmenu dictionary is introduced.
- delitem is a nullable read-bound boolean. Omission/null hides built-in Clear,
  false disables it, true enables it. With no authored menu, the component
  supplies the same shared menu presentation containing Clear only.
- Clear uses the shared Source-based AskDialog, with the card title. Cancellation
  writes nothing. Locking delitem while confirming prevents execution; removal,
  renderer replacement, a replaced body or a changed Data scope invalidate the
  pending action. Repeated activation cannot open concurrent confirmations.
- On confirmation, walk current static Source descendants and null unique
  writable value pointers strictly within the resolved card Data subtree.
  Include folded/nested fields; exclude data elements, external paths, literals,
  read-only = bindings and transformed pointers. Reuse writeParameter.
- Preserve non-field Data, card collapsed/checkbox paths (also when aliased by a
  body editor), and nested header states. Do not replace/delete Bags or load lazy
  content. A card without an explicit datapath uses its ordinary inherited scope.
- Custom action execution stays in ButtonBinding. Built-in Clear's MenuLine is
  framework-owned presentation; GroupletCardActions owns its real Source binding
  and Data writes. The component owns no parallel application state/menu engine.

Gallery g05 is a complete shipping desk with meaningful custom actions, contact
fields, an independently clearable remote address, an invoice lock, live briefing
and retained order/invoice/tracking information. Both @source definitions are
visible in Code. See the qualification receipt for checks and known limitations.


## Inline guide increment — owner confirmed 2026-10-28

Owner chooses “Primo incremento: guida nella card” to the explicit Markdown guide
proposal. doc is text, default empty, with ordinary read binding. Empty/whitespace
content hides the information button. Non-text values are rejected; document
addresses, file loaders, doc_kw and card-specific templates are not interpreted.
Use ordinary Data/formulas for contextual content.

The native information button has a card-specific accessible name and opens a
nonmodal popup with the current title and shared Markdown rendering. Raw HTML
is text and unsafe link schemes are rejected by the Markdown parser. The popup
uses shared positionPopup geometry and shared theme tokens, with readable type,
viewport bounds and scrolling. It remains available on a folded card.

Enter/Space activate the native button; Close/Escape restore focus. Outside
pointer/focus movement dismisses it. Opening a menu closes the same card's guide
and vice versa. Content/title update live while open; removing the content closes
the guide and focuses the card instead of a newly hidden opener. Detachment
releases document/window events. Remote reconstruction retains content from Data
but does not persist popup-open state. Reading help does not edit fields or issue
RPC. No doc visibility state is stored in business Data.

Gallery g06 is a complete customer handover for an order of workshop lights.
Customer, delivery and nested address guides explain real fields; the delivery
guide follows the current customer/contact/destination. Three @source methods
provide the complete forms, with review/fold states, guide visibility, summary and
reload. Shared-document storage/editing/languages/permissions remain a distinct
future resources/Kajenn increment explicitly selected by the owner.
