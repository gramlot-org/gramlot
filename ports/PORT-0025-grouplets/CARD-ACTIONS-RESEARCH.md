# GroupletCard menu and Clear research — 2026-10-28

## Requested increment and decision status

Owner: “ok procediamo con menu e Clear dei grouplet card, sempre guardando i test
legacy e aggiungendo casi completi nella gallery”. The increment and connected
gallery work are requested. Owner subsequently answers “Confermo questo contratto” to the concrete proposal
below. Implementation and verification are recorded in CARD-CONTRACT.md and
verification/card-qualification.md. The research below preserves its original
evidence and proposed qualification scope.

## Legacy evidence

Evidence revision: genropy a135c9d949d0b014a22f57c418e83b315f85e7bf,
preserved in `evidence/legacy-sources.tar.gz`.

- `resources/common/gnrcomponents/grouplet/grouplet_card.js:294–321`:
  `buildKebab` translates the legacy editmenu dictionary into ordinary menu lines.
  Entries may reference presets, override a caption or supply an action.
- The same file, lines 493–524: `_mountKebab` adds the Clear preset when delitem
  is present. Custom entries without actions publish the card's action topic.
- Lines 526–544: Clear availability depends on delitem and the legacy form's
  disabled state. Availability refreshes on opening; activation checks it before
  asking for confirmation. The legacy callback does not recheck it after the
  asynchronous confirmation.
- Lines 546–561: `clearFields` walks static Source descendants, collects unique
  `value` pointers beginning with `^`, resolves their absolute Data paths and
  sets only strict descendants of the card scope to null. With useForm the root
  is the inner form record. It does not delete the entire card Data Bag.
- `gnrjs/tests/grouplet_card.test.js:376–395`: asserts card/form root selection,
  an internal field set to null, and exclusion of an external pointer and an
  `=` pointer. This test does not qualify cancellation or locking after a prompt.
- `projects/gnrcore/packages/test/webpages/gnrwdg/test_grouplet_card.py:89–106`:
  test_4_bound_state shows custom Call/Write entries and a visible action result.
- The same file, lines 150–160: test_8_clear preserves the order number while
  clearing shipping fields; invoicing disables Clear dynamically.
- `gnrpy/tests/web/grouplet_card_test.py` supplies card-profile precedence and
  tools evidence; its editmenu normalization tests concern groupletGrid, not
  groupletCard. They are not card behavior tests.

## Existing Gramlot mechanisms to reuse

- `menu` / `menuline` Source already supply popup layout, focus, keyboard,
  submenus, disabled entries and normal action/controller/fire execution.
  Registered commands additionally require the existing frame recipient; a
  card must not silently invent one. The dictionary editmenu form is not the
  current Gramlot authoring representation.
- `MenuContainer.open(opener)` already handles popup placement and focus return.
  The card header needs an opener; authored body menus must remain distinct from
  the direct card menu. Remote replacement must not accumulate header controls.
- `AskDialog.show` supplies a Source/Data-based confirmation and cancels when
  its owning NodeBinding closes. Reuse it rather than window.confirm or a second
  dialog service.
- `HtmlElement.writeParameter` defines writable value bindings: plain reactive
  `^` pointers, excluding transformed suffixes and `=` pointers. Clear must use
  this rule, with an additional card-subtree boundary, rather than scraping DOM
  inputs or replacing a Data Bag.

## Confirmed owner decision

Use `card.menu()` / `menuline` for custom header entries, and a Data-bindable
boolean `delitem` to enable Clear. Ask for confirmation before clearing writable
value-bound fields within the card, including nested card fields; retain external
Data and header fold/review state. Check the current gate again after confirmation
and cancel pending work on removal. The existing form-engine integration remains
outside this increment.

The gallery scenario is a complete shipping workbench: order/customer context,
remote address/contact fields, meaningful custom actions with visible results,
an invoice lock and Clear cancellation/confirmation. Its explanation and Python
@source methods must show what changes and what remains intact.

## Qualification scope established before implementation

Core checks must cover custom-menu isolation, keyboard/focus, native Clear,
confirmation/cancellation, bound lock changes (including while confirming),
removal, remote rebuild, nested scope, duplicate paths, external/read-only/
transformed pointers, and preservation of non-field Data and card UI state.
Use core fixtures independent of examples. Verify Python authoring and matching
gallery Source/remote endpoints, then the full workflow in the real Python
gallery at desktop and narrow widths. No new runtime verification is claimed by
this research note.
