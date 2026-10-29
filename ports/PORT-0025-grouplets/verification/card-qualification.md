# GroupletCard first-increment qualification — 2026-10-28

Scope and owner confirmation: [CARD-CONTRACT](../CARD-CONTRACT.md).
Implemented and locally verified, not yet accepted by the owner.

## Passing checks

- [Legacy baseline](legacy-card-baseline.log): 20 archived grouplet_card JS tests.
- [Core build](card-core-build.log), [gallery build](card-gallery-build.log).
- [Core grouplets/card](card-core-js.log): 15 tests, including 8 new card cases.
- [Core regression selection](card-core-regressions.log): 71 tests, collections,
  bootstrap/artifacts, remote, common components and layout. Initial test launch
  lacked the Python import environment; the final run uses the worktree venv and
  absolute core PYTHONPATH and passes all cases.
- [Python](card-core-python.log): 4 pass, 3 strict expected failures detailed below.
- [Gallery parity/behavior/naming](card-gallery-tests.log): 9 pass.
- [Endpoint parity and navigation](card-protocol-tests.log): 6 pass, including
  five g04 Source dispatch cases (two revisions, two address slots, delivery).
- [Real Python gallery in Chromium](card-browser.log): g01–g04 pass, no page/HTTP
  errors; actual RPC arguments and counts, editing, keyboard Enter/Space, nested
  collapse, external controls, review marks, remote rebuild and full Code checked.
  Fold/open causes no extra remote calls. Narrow viewport has no horizontal overflow.
- Visual inspection: [gallery](card-gallery.png), [desktop](card-desktop.png),
  [390px layout](card-narrow.png). The example is a full customer/invoice/delivery
  dossier; side headers remain on their authored sides on narrow screens.

The unchanged adapter snapshot remains b75f33a10db84328deff56e75499928458846a87;
preview runs at http://127.0.0.1:8795/. No deployed gallery or package release.

## Upstream Python validation defect (unresolved)

The installed genro-builders 0.30.0 Python union checker accepts an invalid string for
`bool | Annotated[str, Regex(r'^[\^=].+')]`. `_utilities._check_type` applies
_CustomType/_DType metadata but drops Regex under union alternatives. This is
reproducible directly in the dependency, with no Gramlot class involved:

```python
from typing import Annotated
from genro_builders.builder._utilities import _check_type
from genro_builders.builder._validators import Regex
assert not _check_type('closed', bool | Annotated[str, Regex(r'^[\^=].+')],
                       strict_json_primitives=True)  # currently fails
```

The three strict xfails in test_grouplets.py retain desired authoring-time
rejection for collapsed/collapsible/checkbox. They must turn into passing tests
when fixed upstream. JavaScript Builder rejects the literal and card projection
also explicitly rejects invalid resolved states; no coercion or 'closed' mode is
implemented. Supported boolean/^pointer authoring and real Python page dispatch
pass. The affected authoring validator is reported for its owning project; no
Builder source change or consumer workaround was made.

## Remaining scope

Shared documentation storage, form/error/save integration and resource profiles
remain subsequent increments. Menu/Clear was subsequently implemented below. This first card does not claim full legacy parity.


## Visual revision after owner feedback

The owner found the initial CSS unreadable. The original captures above remain
historical evidence, not an accepted presentation. Compact side headers replace
full-height dark bands; clearer chevrons, field spacing and existing responsive
formlet columns improve the revised lesson. CSS is formatted into readable blocks.

[Revised desktop](card-style-desktop.png), [revised narrow view](card-style-narrow.png).
Core/gallery builds and eight card tests pass. The complete g04 browser workflow,
keyboard, reload and 390px overflow checks pass, with no page errors. No additional
Data or remote behavior is introduced. Owner visual acceptance remains pending.


## CheckboxLabel increment

Owner requests checkboxLabel and clear adjacent captions. The gallery now displays
Reviewed next to the customer/billing/delivery header checkboxes. Native label
activation, reactive text, accessible names and absent-checkbox hiding are covered.

[Core JS: 16 passing](card-label-core-js.log), [Python: 4 passing / 3 existing xfails](card-label-core-python.log),
[gallery: 3 passing](card-label-gallery-tests.log), [Chromium workflow](card-label-browser.log).
Core/gallery builds pass. [Desktop detail](card-label-delivery.png) and
[narrow detail](card-label-narrow.png) inspected. Owner visual acceptance pending.


## Menu/Clear increment — 2026-10-28

Owner explicitly confirms the contract; implementation is complete and locally
verified, pending owner UI acceptance. The new shipping workbench is gallery g05.

- [Core JS](card-actions-core-js.log): 62 passing grouplet, menu and button tests,
  including scoped Clear, shared header-state aliases, external path prefixes,
  cancel, gate changes while confirming, removal and remote replacement.
- [Python](card-actions-core-python.log): 4 passing, 4 strict expected failures.
  The existing genro-builders Regex-in-union defect also affects delitem's boolean
  authoring; the JS boundary rejects invalid raw strings. No upstream edits.
- [Gallery](card-actions-gallery-tests.log): 3 passing checks: g05 main Source
  parity, JavaScript interaction, and all existing endpoint/fragment parity cases
  with the two shipping sources added.
- [Chromium](card-actions-browser.log): actual Python gallery navigation, custom
  actions, nested/full Clear, cancellation, lock, retained external/non-field Data,
  fold/review state, keyboard/focus, reload, Code and narrow overflow pass.
- Core/gallery builds pass. [Desktop](card-actions-desktop.png) and
  [narrow](card-actions-narrow.png) captures inspected.

The first broad JS run used system Python and failed one existing menu test on
its Python environment. Rerunning with the project's venv on PATH passed all 62;
no behavior was weakened. The existing legacy 20-test baseline remains evidence,
not a new claim of complete legacy parity or a newly executed legacy Python suite.


## Inline-guide increment — 2026-10-28

Owner chooses the card-local Markdown guide as the first increment. Implementation
is complete and locally verified, with owner UI acceptance pending.

- [Legacy guide baseline](card-doc-legacy-tests.log): 4 focused JS tests pass.
  Python legacy tests and the full inline-docs manual/demo were inspected.
- [Core JS](card-doc-core-js.log): 66 passing tests. Guide checks cover safe
  rendering, native opening, Escape/focus, folded/nested state preservation,
  reactive title/content, empty content, multiple instances, menu interaction
  and stale-handler cleanup/removal/reload.
- [Python](card-doc-core-python.log): 4 passing authoring/dispatch checks, 4
  unchanged strict xfails for upstream boolean-union validation.
- [Gallery](card-doc-gallery-tests.log): 3 passing checks: g06 main Source parity,
  its JS workflow and all endpoint/fragment parity cases, including the three
  new guided fragments.
- [Chromium](card-doc-browser.log): actual Python gallery with Enter/Space,
  Escape/focus return, contextual values, nested/folded guides, optional empty
  content, retained edits/review/fold states on reload, no RPC for reading guides,
  complete Python Code and narrow popup bounds. No page errors.
- Core/gallery builds pass; [desktop](card-doc-desktop.png),
  [narrow](card-doc-narrow.png) and [folded](card-doc-folded.png) captures inspected.

These checks qualify the chosen read-only guide, not the legacy shared document
archive/editor/permission system. That remains a separate confirmed future scope.
