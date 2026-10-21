# PORT-0021 · Markdown editor and preview

Owner scope (2026-10-21): “bene procediamo anche con markdown editor e anteprima nella ide e mettiamo l'esempio nella gallery”.

Evidence: gramlot-poc revision `10478b57ce3f22e6445eb6b72eba343520cbebac`, `js/dom/src/collections/markdown-editor.js`, `js/dom/src/editor-dependencies.js`, IDE composition. Bounded transfer: Markdown as Data, Code/Preview/Rich text views, ProseMirror Bold/Italic/Code/Undo/Redo, markdown-it preview with HTML disabled, opaque source blocks for unsupported rich syntax. Core owns reusable controls and IDE coordination; examples own Python/JS pages. Existing host filesystem services retain read/write enforcement.

Destination review: port uses current control binding, readonly/disabled/live parameters, lifecycle-owned engine, per-instance history and scoped save/historyChanged publications. External Data replacements reset history; undo to the initial rich document restores the original string. Supported Markdown is normalized after rich edits. Source blocks preserve tables, HTML, strikethrough and task lists; frontmatter/reference documents remain whole. Atomic source blocks can be selected/deleted as blocks, as in the PoC; their internals are edited in Code. No HTML execution, Markdown dialect plugins, server execution, language server, filesystem changes or new persistence layer.

Dependency review: PoC markdown-it 14.1.0 and prosemirror-view 1.33.8 have npm audit advisories. Use corrected markdown-it 14.3.3 and prosemirror-view 1.42.6; prosemirror-model 1.25.12 satisfies View's model requirement, and the remaining ProseMirror packages use PoC versions. Audit after installation: zero vulnerabilities. No dependency source changes or first-party pins.

Status: implemented and locally verified; owner trial/acceptance pending. No publication or deployment.

Final verification: 55 focused JS tests; 48 Python tests plus 47 subtests; core/gallery builds; public docs check. Browser: native rich typing, synchronized preview, initial clean undo, redo, keyboard save, Revert/history reset, readonly and light/dark themes. Saved temporary Markdown retains table, strikethrough and HTML source. No new console errors after dependency repair; old entries remain timestamped. Screenshot: /tmp/gramlot-markdown-gallery.png.

Review feedback: upgrading View while retaining model 1.22.3 installed two incompatible model copies. Transaction-only unit tests passed, but native browser typing failed. A DOM-mutation regression test first reproduced the failure; aligning model to 1.25.12 removes the duplicate and makes it pass. Keep one ProseMirror model identity; no bundler alias or consumer fallback. Initial focused suite after repair: 30 passed.


Embedded HTML follow-up — owner 2026-10-21: “ok” confirms optional sanitized HTML in Markdown, disabled by default. markdownPreview.allowHtml is a live Boolean read parameter; enabled Markdown output is sanitized with DOMPurify and remains inside the existing sandbox/CSP. HTML-disabled parsing stays separate and unchanged for the rich editor. IDE Preview and gallery checkbox bind document-local state without modifying source or editor history. HTML source blocks retain their original markup and remain editable in Code. This supersedes the initial preview-only HTML-disabled limitation above; scripts/event handlers remain excluded.

Verification: 30 core editor/IDE tests pass, including sanitizer checks and bound toggle preservation; the 12 IDE tests were rerun with a real Source checkbox assertion, confirming immediate rendering and unchanged clean state. Python builder/resources: 48 tests and 47 subtests. Gallery Python/JS parity: 35/35. Core and gallery builds pass; core public docs verify 11 pages. Browser gallery verifies escaped markup with the option off and formatted HTML immediately on; screenshot /tmp/gramlot-markdown-embedded-html.png. No real file was edited, and no release/deployment was performed.
