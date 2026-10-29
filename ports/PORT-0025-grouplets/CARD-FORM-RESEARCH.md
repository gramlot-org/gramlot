# GroupletCard form integration research — 2026-10-28

## Request and decision status

Owner requests form integration, review of legacy tests and a complete gallery
example. Research is complete; the owner has deferred this increment until the shared
form manager is available in Gramlot. Neither a private card form engine nor a field-error-only interpretation
of full form integration is approved by this note.

## Legacy evidence

Reference: Genropy a135c9d949d0b014a22f57c418e83b315f85e7bf, preserved in
`evidence/legacy-sources.tar.gz`.

- `gnrjs/tests/grouplet_card.test.js:314–342`: descendant field errors mark the
  header, updates are coalesced and observation stops on destruction.
- The same file, lines 365–395: an inner form error marks the header even without
  visible field errors; Clear targets the inner form record when present, otherwise
  the card's Data subtree, excluding external fields.
- `gnrpy/tests/web/grouplet_card_test.py:165–191`: useForm composes GroupletForm
  with a resource/handler, loadOnBuilt, a memory writeback binding and configurable
  autosave. It subscribes to outer loads and inner form status. Inspected only.
- `projects/gnrcore/packages/test/webpages/gnrwdg/test_grouplet_card.py`, test_2_in_form:
  required customer VAT, error visibility while folded, ordinary outer form actions.
  test_9_use_form: shipping forms both within an outer record form and standalone;
  required City and a display of stored values expose draft/writeback behavior.
- `resources/common/gnrcomponents/grouplet/grouplet.py:1196–1245`: useForm edits
  a copy, saves it back and follows outer form loads. The card composes a shared
  GroupletForm rather than implementing its own record lifecycle.
- `resources/common/gnrcomponents/grouplet/grouplet_card.js:528–561`: disabled
  owning forms block Clear; inner form record scope determines Clear targets.

Replayed the three focused JS tests successfully; receipt:
`verification/card-form-legacy-tests.log`. These exercise the legacy test harness,
not Gramlot form support or the full legacy application.

## Current Gramlot capabilities and missing prerequisite

`js/src/components/field-state.js` validates candidate edits, exposes invalid and
pending presentation, retains rejected input, and handles cancellation/cleanup.
`js/src/view/controls.js` supplies validation callbacks through the existing page
context. Its form/formId radio-group scope is not a record form manager.
Targeted searches of core JS and Python source found no frameForm, formStore,
FormHandler or useForm implementation. There is therefore no shared record draft,
load/save/status/disabled lifecycle to compose into a card yet.

The existing plan already requires shared form/store contracts rather than a
private grouplet implementation. Field error indication can be a bounded first
increment but does not provide record validation, saving, useForm or form locks.

## Owner decision — 2026-10-28

One question offers: first aggregate existing field errors in card headers,
including nested/folded cards, with a complete customer/billing/delivery example;
or first define the shared record form contract required by useForm. The latter
needs decisions about draft ownership, load/save, validation and writeback before
implementation. Owner answers: “attendiamo di mettere l gestore di form in gramlot che per ora non c'pè ancora”.

The increment is deferred until that shared prerequisite exists. Neither offered
implementation is started now. This request does not authorize building the form
manager in this task. Preserve the research and gallery requirements for resumption.

After a confirmed error-indication increment, qualify correction, nested cards,
folding, instance isolation, remote replacement and cleanup against real validators.
After a shared form contract, additionally qualify invalid draft isolation, saves,
outer reloads, disabled Clear and scoped writeback. These are proposed verification
obligations, not new approved APIs.
