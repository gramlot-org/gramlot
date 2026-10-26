# PORT-0020 · HTML editing and preview

Owner scope (2026-10-21): “si procedi con html, anteprima e jodit e mettili nella gallery così li proviamo”.

Evidence: gramlot-poc `js/dom/src/collections/gramlot-ide.js` and its HTML editor/Jodit dependency modules. Bounded transfer: HTML Code/Preview/Rich text over one Data document, Jodit Community 4.13.9, protected head/body document content and explicit source editing for nonvisual blocks. Core owns reusable htmlEditor/htmlPreview and IDE coordination; examples own the Python-first demonstration and JS twin. Existing integration owns reads/saves. No bulk copy, app DOM construction or direct app requests.

Destination differences: current Source, bindings, parameter projection and lifecycle; local optional collection with no CDN; iframe sandbox without scripts; Gramlot theme tokens; lifecycle-safe history publication; readonly/disabled; original source restored on undo to initial rich snapshot. Rich DOM serialization normalizes HTML. Protected content cannot be removed or duplicated visually; use Code. Head styles apply to the canvas, external resources in the editing canvas are blocked by policy.

Review feedback: initial visual undo must not leave an otherwise unchanged document dirty due solely to HTML serialization. Preserve the source at the initial rich snapshot. No byte-preserving claims for arbitrary visual edits. Markdown, Typst and executing previews remain outside this slice.

Status: implemented and locally verified; owner trial/acceptance pending. No publication or deployment.

Verification: 46 focused JS tests, 48 Python tests and 47 subtests, both core/gallery builds and public documentation checks passed. Real browser verified shared code/preview/rich content, protected script/SVG/comments retained in the saved temporary file, exact clean initial undo, redo, keyboard save, revert/history reset, readonly, light/dark toolbar and resize on hidden-tab activation. Final browser error log empty. Screenshot: /tmp/gramlot-html-gallery.png. Gallery runs locally on 8877.

Additional feedback: map Jodit's panel and icon-text tokens as well as its surface/icon tokens; otherwise the dark toolbar has insufficient contrast. Notify Jodit's resize lifecycle when a hidden Gramlot tab becomes visible; observing the host is necessary because window size did not change.


2026-10-26 follow-up (owner-approved): Jodit 4.18.10 and official sanitization,
paste/drop plugins replace the original dependency baseline. The rich canvas
retains CSP but no longer uses the WebKit-blocking sandbox; Preview still does.
External projection retains native history, superseding the original Revert reset.
Chromium/WebKit and 63 targeted Node regressions pass, as does the runtime build.
GC-365 §060 documents the remaining upstream DocumentFragment sanitizer gap;
codec rejection/CSP are retained, with no consumer workaround. No publication.
