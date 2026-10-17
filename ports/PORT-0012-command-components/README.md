# PORT-0012-command-components

- **Status:** implemented and verified; owner visual acceptance pending.
- **Legacy evidence:** genropy@fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea, paths and review in GC-310.
- **Destination revision:** working tree, no release/publication in this increment.
- **Constitution checked:** Python-first Source authoring, shared Data/command ownership, explicit owner scope, native html_button distinction, dependency isolation.

## Scope and contract

Owner's 2026-10-17 implementation instruction covers button, boolean toggleButton with LED, and one dropDownButton with local menu/menuline and optional persistence. Main click executes. Normal selection executes only; Shift+selection executes and installs the default command/caption. Built-in DOM-free descriptors generate Python metadata. No opt-in collection is needed for existing button pages. ButtonBinding is the only command executor; the existing ControlAdapter owns toggle Data.

No button bar, exclusive command group, nested menu, add/remove API, database/form-save service or publication. Native form actions and shell controls use html_button. Plain button no longer means native implicit form submission; this deliberate component migration is documented in GC-105 §095.

## Verification

- Core JS: 3521 passed. Python: 164 passed, 264 subtests, one existing expected upstream failure (nested annotation validation).
- Ten focused tests cover grammar parity, case-insensitive names, toggle Data/readonly/disposal, normal/Shift selection, code-only persistence, missing saved choice, keyboard navigation, ask disabled gating, popup padding, Source code provenance and denied storage. Existing action/ask/delay/controller regressions pass.
- Chromium and WebKit core fixtures: main/arrow distinction, once-only delivery, keyboard Shift selection, reload persistence, visible LED, ask, all four themes and touch targets.
- Gallery w22–w24: six runs (Python, Node, static serverless × Chromium/WebKit), including action/ask/delay, plain HTML, shared toggle Data, dropdown selection, same-frame Mobile preview. Gallery JS: 95 passed; Python: 16 passed and 82 subtests.
- Public documentation links/anchors and Sphinx with warnings as errors pass.

## Destination review

No application DOM bypass, extra evaluator or dependency edits. The native popover owns light dismissal; the component releases viewport listeners/observer; ButtonBinding releases execution/delay on semantic disposal. Shift persistence stores a unique item code scoped to page path/query and authored id. Main execution resolves the item at click time; absent items use the authored command.

Visual review caught and corrected an overbroad empty-span selector hiding the LED. Behavioral review caught and corrected menu whitespace bubbling into the main command and a pending menu confirmation executing after disabling its parent dropdown. These are covered by regression checks.

## Feedback for later ports

Use descriptor capabilities, not tag comparisons, when adding shared behavior. Include Source code activation as well as event attachment when extending command families. Review native form and CSS selector consumers when replacing a native element with a shadow component. A theme screenshot and an assertion on actual visibility are both necessary for empty decorative indicators.
