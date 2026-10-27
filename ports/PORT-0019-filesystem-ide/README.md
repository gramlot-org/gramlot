# PORT-0019 · Filesystem tree and initial IDE

Status: implemented and locally verified; owner trial/acceptance pending.

Owner scope (2026-10-21): “si procediamo con il componente filesystem e usiamolo nella ide con il combo delle ultime 6 directory”. Earlier confirmations require explicit saving, revision conflict rejection, Python syntax validation and sessionStorage for recent directory preferences. PoC evidence: gramlot-poc commit `10478b57ce3f22e6445eb6b72eba343520cbebac`, `src/gramlot/filesystem.py`, `src/gramlot/ide.py`, `js/dom/src/services/ide-documents.js`, `tools/gramlot-ide/pages/index.py`.

Core composes the existing tree, FramePage, tabContainer and CodeMirror; the server integration owns filesystem operations. Directory requests return one Bag level; browser resolvers resolve children only on expansion and abort at disposal/workspace replacement. File paths remain metadata, encoded node keys avoid Bag-path collisions. Documents are Data Bags with draft, saved snapshot, revision and root identity. Six recent successfully opened roots are a separate sessionStorage preference. Directory changes retain open documents. Source dynamically creates document panes; no application DOM, direct fetch, or parallel document model.

Destination differences: no unrestricted server filesystem, no symlinks below workspace, only bounded UTF-8 text, no legacy editor implementation. Explicit host roots constrain all endpoint operations. Remote editing defaults off. Python validation compiles but does not execute submitted text; revision conflicts reject and retain drafts. Atomic file replacement follows the PoC's process-local serialized writer contract; cross-process filesystem transactions are not claimed.

Not included: directory/file creation, renaming, deletion, filesystem drag actions, watches, rich Markdown/HTML editing, Typst, language servers, editable gallery preview reload, serverless filesystem support, new CLI grammar, package release or deployment. Source composition and host services are separate reusable units.

Review feedback: do not import gallery assets into the IDE; optional collection bundles are shipped independently by core. Inline callbacks created in the browser are prohibited by the current Source trust contract; The owner confirmed using Logic methods and clarified that this belongs to all such hooks; shared dispatch is now implemented without activating generated inline code. Keyboard save uses declared controller subscriptions to the editor's scoped publication.

Verification: complete core JavaScript suite 3,645 passed at the shared-hook checkpoint; final focused filesystem/IDE lifecycle 7/7 and hook checks 5/5. Python core 174 passed (conformance rerun with localhost permission), one existing expected failure. Python filesystem integration 3/3; paired documentation checks/builds passed. Browser checks cover lazy hierarchy, actual project files, recent preferences surviving reload, Python syntax rejection, keyboard save, dirty veto, clean closure and reopening under CSP without unsafe-eval. No source file in the real project was modified through the browser; save tests used the temporary fixture workspace.


Follow-up, 2026-10-21: owner requested per-document Save/Revert icons, opening workspaces on focus-out and Undo/Redo. Implemented a Source toolbar per document, disabled-state bindings and CodeMirror history commands/publications. Revert uses the saved baseline without writing or closing; external replacement resets history. Replaced the IDE’s empty relative editor scope with its concrete document path. Verified 16 focused JS tests, 28 Python tests (one existing xfailed, 46 subtests), runtime build and public docs. Real browser exercised all four commands and focus-out opening; only temporary fixture content was saved and restored. The owner separately approved unrestricted directory read/write for this localhost trial; the local launcher uses `/` as its configured root. The provider still requires explicit host roots and remote_edit.


Theme/gallery follow-up, 2026-10-21: owner requests standard theme buttons and the IDE in the gallery. The shared button’s existing quiet variant now reaches the shadow control; IDE command icons are Source SVG. The integration’s optional IDE catalogue is staged with explicit host roots and remote_edit, preserving default gallery behavior. Verified 32 JS tests, 12 gallery tests, both builds and documentation views, plus real iframe theme propagation, file opening and revert in the local gallery. No release or deployment.


HTML follow-up — 2026-10-21: PORT-0020 now adds HTML Code/Preview/Rich text views over the existing document Bag, sharing Save/Revert and routing Undo/Redo to the active editor. This supersedes the initial slice's HTML exclusion only; Markdown and Typst remain outside it.


New-document increment, 2026-10-21: owner confirms “si” to type selection, blank tab and directory/name on first save, with preview before persistence. The existing IDE Source/Data composition now shares document rendering between loaded files and temporary drafts. document_create belongs to the Python host, gated by remote_edit, rejecting overwrite and validating Python before atomic creation. Tab identity remains stable; subsequent saves retain revision checks. Nine core IDE/filesystem tests, six Python host tests and Python builder/resources (48 tests, 47 subtests) pass; browser Typst preview before save and first-save flow verified at the local gallery. Drafts remain in memory only; directory creation and overwriting existing destinations are not included. Implemented/verified, awaiting owner trial.


### Gallery source editing follow-through — 2026-10-21

Owner requested and confirmed editable Python gallery sources and preview reload after saving. The integration reuses this port's FileSystemPageMixin read/save checks behind a catalogue-key endpoint. The gallery authors CodeMirror, Save/Revert and status in Python Source, keeps drafts/revisions in Data, and uses ordinary Logic/RPC. The original file is written; staged wrappers are never edited. Successful saves reload only the affected iframe from initial state; failures retain draft/preview, and concurrent new edits remain dirty. Default read-only and the shared remote_edit gate remain intact.

Verified by nine host tests, three Python-authored live Source/CodeMirror tests and real browser syntax rejection/recovery/save/two-tab isolation. Wrapper compilation now bypasses stale bytecode, and all five hosts forward the existing reload option. This completes the previously deferred gallery save/reload slice; helper-module hot reload, JS companion editing and serverless filesystem writes remain outside scope. No release or deployment. Full receipts: GC-070's editable Python gallery entry.

Gallery follow-up — 2026-10-24: owner requests an IDE over sample documents,
with draft editing allowed and persistence gated by Remote Edit. The Python
integration now stages the existing IDE with verified Page.gramlots and the agreed
filesystem endpoints from the local integration trial. It exposes a disposable
copy of the examples package's documents, outside route-eligible paths. No native
recipe execution endpoint is ported. Core IDE no longer derives editor readonly
from host writable; Save/create remain gated and new drafts inherit workspace
write permission. Regression evidence: 13 core IDE tests; 12 host staging/live RPC
tests including all five adapters with Remote Edit off/on; actual browser typing,
Undo/Revert and disabled Save verified. Implemented and verified locally, awaiting
owner trial and a separate publication decision.


### Source ownership review — 2026-10-25

Owner requires instance state to belong to Data or Source and relative Data access.
Shared Logic groups must not retain a current IDE. The local correction attaches
coordination and request resources to each owning Source node, derives panels from
Source, and gives editors per-instance identities. Reusable lesson for later ports:
multiple mounts must be tested with identical external document keys and delayed
completion, not merely with different pages. A two-IDE Python composition verifies
isolation and DOM-only detach/dock. The 62-test focused suite and runtime build pass;
owner trial and publication remain separate. See GC-365 §035 and GC-070 §2180.
