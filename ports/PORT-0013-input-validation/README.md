# PORT-0013 — Input validation

Owner scope: 2026-10-17, “tutte le validazioni”; “Motore completo; DB/grid nel loro filone”.

Evidence: Genropy `gnrjs/gnr_d11/js/genro_frm.js`, revision fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea; gramlot-poc `js/dom/src/forms/validator.js`, revision 10478b57ce3f22e6445eb6b72eba343520cbebac.

Status: implemented and locally verified; owner acceptance remains pending.

Bounded port: ordered local rules, transformations, conditions, warnings, callbacks, async remote validation and exit hooks. Existing constrained selectors own selection parsing. Python declares rules in Source; the browser executes them. Legacy DB/grid validators and form-save orchestration are excluded. Gramlot retains its approved null/empty-string semantics: false, zero and whitespace are present. Legacy synchronous remote calls become abortable asynchronous existing RPC calls. Invalid/stale candidates must never update Data. No prototype runtime or alternate Data writer is copied.


Destination review: no copied prototype runtime, alternate event system or second primary-value writer. FieldState handles validation lifecycle/presentation; ControlAdapter retains Data commits; named Logic, activated InlineCompiler and existing RPC supply execution. Generated metadata is shared by JS/Python. Existing typed parsing/selection integrity remains component-owned.

Verification and review corrections are recorded in GC-070 §1165; public contract and intentional legacy differences in GC-105 §076. New tests cover the ordered rules, exact Decimal/date bounds, metadata, notification order, delayed replies, failures, timeout, Escape, changed scope/rules/Data, disposal and selection integrity. Gallery w25 and browser checks qualify actual Python RPC and the shared JS endpoint path.

Reusable feedback: test async acceptance before mutating editor-private state, preserve typed candidate values through the single adapter writer, and test literal patterns in Source (not just the standalone rule function). Legacy synchronous RPC and side effects from rejected values must not be copied.
