# PORT-0014 — Border container and drawers

Owner scope, 2026-10-18: “ok procedi con borderContainer per la 0.3.2, con splitter sempre live, splitter_ e drawer come nel legacy. aggiungi esempi nella gallery e verifica i test”.

Status: implemented; destination verification recorded in GC-070 §1235. Owner visual acceptance and publication are separate.

Evidence: GenroPy fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea, gnrjs/gnr_d11/js/genro_widgets.js BorderContainer/Drawer and genro_patch.js BorderContainer/Splitter replacement; vendored Dojo layout/BorderContainer.js; PoC inventory and pinned revisions in GM-035. No prototype implementation was bulk-copied.

Scope: borderContainer, minimal contentPane, headline/sidebar CSS grids, nested regions, four always-live splitters and pixel bounds, splitter_* presentation, drawer open/close and drawer_* presentation/callback, opt-in size cookies with stable id. Shared layout collection grammar supplies both languages. Parent-owned regional metadata is projected from resolved Source, not read from rendered DOM. Existing compiler activates drawer_onclick. Reusable slotted Container base extracted unchanged from existing layout components.

Differences: liveSplitters omitted (always live); splitter_* is deliberately new. Legacy geometry recursion replaced by CSS tracks/slots; no content reparenting, snapshotting or parallel Data model. Tab/stack/framePane, regions-Bag orchestration and automatic mobile drawer policy are outside this first increment. Unavailable styling cannot be simulated by application DOM wiring.

Destination review: inline callback activation and dynamic projection use existing framework services. Native pointer capture, keyboard operation, drag cleanup and CSS visibility retain content. Real-browser qualification covers all four drag directions, limits via unit tests, invalid drafts, nested geometry and iframe identity; gallery checks cover Python/JavaScript pages. Details and exact results in GC-070 §1235.

Reusable feedback: verify patched legacy behavior, not only stock Dojo; qualify pointer geometry in real browsers; hiding a region must not remove its reopening handle; aria-disabled on a separator ancestor also disables a nested drawer button. Keep regional parameters parent-owned and theme values overridable.

Rounded follow-up (owner, 2026-10-18): l03 and GC-070 §1240 qualify four corner clipping, nested independent radii, four drawer/splitter directions and native top-layer popup interaction on Python/Node/serverless, Chromium/WebKit. Existing runtime behavior passed; no extra rounded-mode implementation was needed.

Visual follow-up: GC-070 §1245 records the owner feedback, verified legacy drawer CSS, attached-tab presentation, region contrast, neutral choice focus/inset popup and shared reactive rounded example. No dependency modifications or implicit radius inheritance.

Discreet controls follow-up: GC-070 §1250 records the owner's replacement of gallery text tabs with thin tooltip grips, 1px default splitters and explicit region borders. Reusable feedback: examples must not override shared defaults with large labels when qualifying default appearance; enlarge touch hit areas independently of painted geometry.

Handle dragging follow-up: GC-070 §1255 records the owner's request to drag the splitter from its label/grip. The shared pointer lifecycle distinguishes click jitter from live resizing and suppresses the release click after dragging; no new public parameters. Verify the gallery collection bundle as well as the core runtime.

Closed-handle/hover refinement: GC-070 §1265 supersedes the closed-drawer click-only restriction when splitter=True. Pulling inward opens and sizes the same region; hover grows only its handle, with reduced-motion support. Verified on all four sides in Chromium/WebKit and in the rebuilt gallery.

Theme/label variants: owner-authorized follow-up and verification in GC-070 §1270. Shared CSS tokens and drawer_class presentations provide icons, rotated text and hover reveal, with visible touch labels and unchanged content geometry. Reusable feedback: separately qualify keyboard modality in WebKit, reduced-motion precedence on the inner label, and the gallery's Mobile-preview token in addition to native touch media.

2026-10-18 owner visual correction: reveal labels should start as ordinary small gray grips, with no border or blue outline when expanded. Captions contrast automatically with dark/light fills. Python l04 applies reveal to all four handles and removes duplicate region/splitter strokes. Future iteration checks are Python-only until owner satisfaction and final release qualification.

Follow-up: rotated reveal labels use 8px 2px padding; Python l04 shows 20px × 88px grips and 11px text. This reduces cross-axis bulk, adds space at text ends and preserves hit areas.

2026-10-18 owner-approved drawer_icon separation: persistent icon slot, independent drawer_label caption, drawer-reveal affects caption only. Existing zoom token works independently (1 disables scaling), with no new boolean mode. Python l04 demonstrates this API.

2026-10-18 owner confirms drawer_minimize=False default. Small captions rotate automatically by side; True reveals text on hover/focus, keeps icons visible, and exposes captions on touch. This replaces manually authored presentation classes. Python l04 now requires no classes or CSS dimensions. Python Chromium/WebKit checks passed; final Node/serverless qualification deferred.

2026-10-18: owner-requested Python l05 adds five nested containers, region-size Data sliders and retained widgets. Chromium/WebKit verify slider min/max geometry, retained invalid draft/Data/DOM and ancestor drawer toggles. JS/serverless example alignment is pending final qualification.


### 2026-10-18 — compact touch caption correction

Owner explicitly requests compact labels at rest on mobile while keeping interaction zoom/transitions. Fixed touch reveal geometry was a presentation defect, not a request to collapse regions or introduce overlays. Captions now use intrinsic text dimensions with existing reveal bounds; pressed presentation survives touch capture and clears on release/cancel. Python-only Chromium/WebKit checks cover l04 and nested l05, touch/preview, themes, zoom, return to rest, retained Data/iframe and drag/keyboard. See GC-070 §1305. No publication.


### 2026-10-18 — border notifications

Owner explicitly approves closable_change for drawers and splitter_resize. Existing Source subscriptions carry pane visibility and container resize-completion payloads; live movement remains silent, and cleanup precedes completion notification. Python l06 demonstrates dataController subscriptions without application event wiring. Chromium/WebKit qualification covers payloads, Data changes, no-ops, keyboard/drag/cancel and retained draft/Data/DOM. Nested/handle regressions pass. See GC-105 §105 and GC-070 §1310. Tab/stack remain separate planning; no regions-Bag writeback or release.


Adversarial destination review, 2026-10-18: GC-070 §1365 records reproduced drawer contrast and font-clipping gaps (R03/R04), plus the inspector insertion constraint gap (R01). Earlier successful default-presentation checks do not cover these combinations. Fixes are pending; no new API or release is approved.


Destination feedback resolved, 2026-10-18 (owner-authorized GC-070 §1375): parent childParameters declares required/unique regions for pre-mutation inspector checks. Drawer Source background and foreground contrast now share one effective color; reveal bounds derive from natural content, including customized font/padding. Internal measurements survive Source attribute projection. Chromium/WebKit Python-l04 regressions cover both orientations, explicit color, touch and closed dragging. Reusable lesson: validate structural constraints before mutating Source and derive presentation geometry from content instead of coordinating independent fixed caps. Prior review evidence remains above; no publication.
