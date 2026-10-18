# PORT-0015-selected-containers

- Status: implemented and verified; owner visual acceptance pending
- Constitution checked: retained Source/Data/DOM, explicit structural close, Python-first examples, no dependency edits.
- Owner approval (2026-10-18): "si confermo: closable elimina il pannello dalla Source ma conserva i Data. aggiorna il contratto e procedi con tab e stack, con esempi nella gallery python".

## Evidence and scope

GM-035 §§085–100 records inspected Genropy genro_widgets.js StackContainer/TabContainer, genro_patch.js close-button override, Dojo StackContainer and gramlot-poc/js/dom/src/collections/layout.js. Port behavior, not the PoC inverse inheritance and hidden stack tab strip. GC-105 §110 defines selection, event order, synchronous close veto and Source-only removal. Border/selection compose with existing components and bindings. FramePane and command topics remain separate.

## Destination review

Shared SelectedContainer owns panel visibility and transitions. Tab adds only strip interaction; the renderer supplies Source publishing, binding writes and removal through explicit callbacks. Parent-owned panel metadata is resolved from Source, not scraped from the DOM. No alternate Data cache or bus. Verification: 3,555 core JS tests; Python 167 passed / one existing expected failure, 266 subtests; gallery 18 Python tests. Chromium/WebKit Python l07/l08 and border l06 regression pass, including touch-emulated taps, event order, veto, Source deletion and retained Data/drafts/DOM. Screenshots reviewed. No release; JS/serverless example alignment deferred.

Reusable feedback: preserve selection independently of tab-strip presentation, qualify close versus hide separately, consume activated onClose at the renderer boundary rather than emitting a native event attribute, and keep tests for optional Python Logic modules independent of JavaScript page parity.


Presentation extension (owner-approved 2026-10-18): tabMode, four tabPosition values, text icons and reactive badge/badge_color. All presentation updates preserve the selected panel and its draft. CSS theme tokens and strip-axis keyboard handling are shared, with no application DOM wiring. Verified in Python l07 for mimi/joanna light/dark and narrow touch layouts in Chromium/WebKit; core 3,556 JS and 168 Python tests, 18 gallery tests pass. See GC-105 §115 and GC-070 §1325. Visual acceptance pending; no publication.


Adversarial destination review, 2026-10-18: GC-070 §1365 R02 reproduces keyboard order remaining stale after Source reordering, although the visual tab order is correct. R06/R07 record unfinished gallery consolidation and renderer coupling. Fixes are pending; preserve the shared selection implementation and retained-panel contract.
