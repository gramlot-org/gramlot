# PORT-0008-plain-and-delayed-buttons

- **Status:** accepted for release by the owner ("pubblichiamo", 2026-10-15); publication pending.
- **Evidence revision:** `genropy/genropy@fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`; no PoC promotion.
- **Destination revision:** core 0.2.19 release candidate.
- **Constitution:** §§3–5, 9–10, 13; 11.47 button mechanism and new owner decision 11.75.

## Evidence

Legacy [`_ButtonLogic.clickHandler`](https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrjs/gnr_d11/js/genro_widgets.js#L3501-L3589)
reads inherited `_delay`, restarts its timer and increments `_pendingClickCount`.
Delivery precedes action/ask, nested providers and fire/publication.
GC-196 already distinguished this button delay from the receiving provider delay;
PORT-0007 did not implement the button part.

## Scope and contract

Owner's instruction is recorded verbatim in constitution 11.75. The native
`html_button` has distinct Source identity and `render_tag: button`; both language
grammars preserve native HTML content constraints. ButtonBinding attaches only to
`button`, regardless of identical DOM tags. Explicit native events remain available.
Gramlot-only button attributes on html_button raise rather than silently dispatch.

Positive `_delay` batches clicks until that duration after the last click. The last
event supplies modifiers; arguments are read at execution. Group counts go to
`_counter` (action/fire) or existing `button_counter` (nested controller/RPC).
An ancestor may supply the delay; explicit zero stays immediate. Timers belong to
the NodeBinding and are cancelled on semantic close or DOM detachment. A disabled
button does not deliver pending work. Native event listeners run on every click.

## Verification

- Core: 608 JS tests; 137 Python tests; 32 focused button/ask checks after final cleanup.
- Covers plain submit/reset and bubbling, static output and TYTX identity, invalid
  child placement/Gramlot attributes, delayed action/fire/controller/ask, last-event
  modifiers, argument reads, burst reset, removal under freeze, rebuild and disposal.
- Examples: 66 JS tests (65 initially passed, the changed Logic-count assertion
  passed on rerun); 16 Python tests. c20/c21 exercised in Chromium and WebKit,
  each against Python and Node pages and direct-file serverless output.
- Core strict Sphinx and public-link checks passed; examples strict Sphinx and
  coverage/link/anchor checks passed for 45 lessons and two mirrored guides.
- User's Python gallery on localhost:8195 restarted with local development Source;
  both new routes and gallery navigation verified in Chromium.

## Differences and open questions

No web component or dependency modification. Preserve existing R3 and immediate
lifetime counters. Do not introduce the legacy's separate 200 ms disabled guard or
multiple simultaneous click mechanisms. Controller delay still governs Data/topic
triggers separately. No claim of branded Safari or Firefox qualification.
New functionality requires core 0.2.19; examples 0.2.15 requires that release.

## Destination review

- **Result:** verified within the owner's bounded instruction and accepted for publication.
- Plain/native identity is retained through Python/JS serialization and rendering.
- No application-side DOM wiring or timer workaround; examples use Source/Data/Logic.
- No constitutional conflict after 11.75; no package publication performed.

## Feedback for later ports

Separate implementation coverage from example coverage. Inventory button-local
preprocessing as well as provider behavior: identically named `_delay` attributes
operate at distinct stages. Qualify native HTML output independently of behavior.
