# 198 · Legacy editors: comparison and proposed ports

Document ID: **GC-198**. Date: 2026-10-20.

[Full counterpart](../../docs/internal/198-legacy-editors.md). Source investigation and proposed work, not an approved implementation plan. No runtime changes, installation, browser execution or global tests. The full counterpart preserves per-option legacy/PoC comparisons, exact source paths/lines, all explicit wrapper names and the consumer census.

<a id="gc-198-005"></a>

## 005 · Evidence keys and classification

Block ID: **GC-198-005**.

Observed baselines: GenroPy `fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`; PoC `10478b57ce3f22e6445eb6b72eba343520cbebac`; product initially `d01bf3dc6389ad9bca91ef0f4bdbaafbfcc10242`. Working copies were inspected during concurrent work, not frozen. Legacy main source: `gnrjs/gnr_d11/js/genro_editors.js` (LE); PoC: `js/pages/src/codemirror-component.js` (PC), `js/dom/src/editor-dependencies.js` (PD), collections `markdown-editor.js` (PM), `html-editor.js` (PH), `gramlot-ide.js` (PI), service `ide-documents.js` (PS), Python `filesystem.py` (PF).

**S** = straightforward recovery from PoC, **A** = adaptation, **N** = new port work, **D** = owner decision. S still requires current Gramlot metadata/binding/lifecycle integration and qualification. It does **not** mean currently available in Gramlot, accepted or ready to copy. Engine features do not automatically become supported component options.

<a id="gc-198-010"></a>

## 010 · Completeness boundary: what “all options” means here

Block ID: **GC-198-010**.

Six implemented legacy wrappers were investigated: CodeMirror, ProseMirror, Toast UI MDEditor, CKEditor, TinyMCE and Dojo Editor. Actual extraction, attribute reads, constructor options, public mixins, dynamic routing and named consumers were checked. No active Monaco/Ace/Quill/Tiptap/Milkdown integration was found in the scoped wrapper/common-source inspection.

Open surfaces remain explicit: CK forwards arbitrary `config_*` with wrapper precedence; Toast UI spreads residual attributes including events/hooks/plugins and loads CDN `latest`; Dojo inherits engine options/plugins. No finite wrapper inventory proves all third-party plugin options or external-application parity. Closing that wider claim requires selecting exact engine/plugin distributions and auditing them. Generic Source/Data/layout/events are a shared framework contract.

CM extracts config_* but only consumes a named set; PM overwrites used config fields from top-level attributes with no general plugin pass-through; Tiny constructs its own whitelist/setup. Demo names and declarations alone are not functionality.

<a id="gc-198-015"></a>

## 015 · CodeMirror option and behavior matrix

Block ID: **GC-198-015**.

| Surface | Legacy → PoC → work |
|---|---|
| value/timing | Legacy value + `_delay logical OR 500`; PC text value and immediate change. Inbound PC replacement also hits docChanged listener. **A/D:** quiet typed projection, commit/live/debounce, null policy. |
| state | Legacy readOnly leaves editable true by default for focus/search; separate editable and disabled. PC couples readonly to noneditable and lacks disabled. **A/N/D.** |
| config | Actual keys: value, readOnly, editable, lineWrapping, lineNumbers, keyMap, indentUnit, mode, theme, fontSize, fontFamily, extraGutters. Top-level readonly/editable override; wrapping only truthy overrides config. PC fixed basicSetup/One Dark/wrapping, language selector and font-size CSS only. **A/N.** |
| languages | Legacy SQL/Python/JS/CSS/HTML/XML/JSON/Markdown/YAML. PoC Python/JS/CSS/XML/text present; HTML incorrectly XML, JSON JS fallback, Markdown no grammar; SQL/YAML absent. **S/A** existing paths; **N** missing/correct grammars. Aliases htmlmixed/htmlembedded/text-html/md require **D**. |
| themes | Legacy 17 theme exports including oneDark, plus aliases (full list in counterpart); PC only One Dark. **N/D** for extra themes, theme/size policy; no inferred aliases. |
| keys/features | Legacy softTab keyMap and indentUnit spaces, line numbers, active-line/gutter, selection/drop cursor, history, matching brackets/selections, fold, search, keymaps. PC basicSetup overlap needs verification; configurable controls absent. **A/N.** |
| decoration/commands | Legacy quoteSelection; markText/clearMark/clearAllMarks; add/remove/clearAllLineClasses; scrollIntoView; setGutterMarker/clearGutter/lineInfo; compatibility setValue. All absent as PoC public commands. **N/A**; mark/clear/scroll have GNRIde consumers. Mark options className/attributes; offsets or line/ch per method. |
| gutters | extraGutters entries consume name/width or a string name; CSS class generated. onGutterClick_<name> gets view/zero-based line/gutter/event. No PoC surface. **N/D** for commands/callback/DOM-marker shape. config_gutters/config_addon consumer declarations are NOT consumed by current legacy CM6. |
| dynamic/lifetime | Legacy value/readOnly/editable/wrapping in-place; config rebuild snapshots selection/scroll/line classes, not proven history/marks/gutters. PC observed config rebuild loses non-content state; generation guard + destroy exists. **A.** |
| assets | PoC local lazy modules plus optional CDN/textarea fallback. Recover one local module graph **S/A**; extra provider/fallback **D**. Do not port tree/layout/IDE registration dependency. |

<a id="gc-198-020"></a>

## 020 · ProseMirror legacy compared with PoC rich editors

Block ID: **GC-198-020**.

Legacy has `value`, `format`, `schema`, `setup`, `menubar`, `readOnly`, `editable`, hooks `beforeDispatch/afterDispatch/onChange`, and `_delay`. JSON input accepts string **or object**, output string; Bag accepts Bag-like/XML; HTML stringifies; parsing fallback may become empty. **D/N:** no automatic multiple representation or LOT contract. PoC PM stores Markdown; PoC HTML is Jodit, so engine-name similarity supplies no HTML/JSON/Bag compatibility.

Legacy schemas basic/basicWithLists/basicWithListsAndTables; setups minimal/example/full; toolbar override, history/gap/drop cursors, input rules/list/mark keys, trailing paragraph and table plugins/commands. Table commands include insert/delete table/row/column, merge/split, headers/cell color, resize/navigation. PoC Markdown toolbar is Bold/Italic/Code/Undo/Redo and tables are opaque; Jodit tables are a different model. **A/N/D.**

Hooks receive tr/view/steps/doc/before/genro/sourceNode, do not veto transactions and construct new Function each invocation. Use current named Logic for an accepted hook design. External legacy projection bypasses normal dispatch/history; PoC setter recreates editor. Readonly exists in PoC; disabled/independent editable do not. **A/N.**

Actual methods: `toBag`, `fromBag` (without gnr prefix), gnr_value/setDisabled/readOnly/editable/setSchema/setSetup/setMenubar/setFormat/rebuild. fromBag bypasses Data write listener. Direct schema/setup/menubar/format attributes route through generic Source rebuild, unlike imperative gnr_set* methods. Format change clears content in explicit legacy rebuild: **D**, not automatically desirable behavior. Extracted PM config_* does not establish plugins/extensions pass-through; collab/changeset package presence does not activate collaboration.

<a id="gc-198-025"></a>

## 025 · Toast UI Markdown compared with PoC Markdown

Block ID: **GC-198-025**.

Legacy surfaces: scalar value; Bag text/html or root-value variants; htmlpath; initialValue precedence; viewer, initialEditType, previewStyle (including custom hidden), hideModeSwitch, placeholder, dimensions, usageStatistics, autofocus, colorSyntax, plugins and residual upstream events/hooks/options. PoC supplies scalar Markdown, separate Raw/Preview/Rich panels and local rendering. **S/A** scalar/rendering; **N/A** outputs/modes/options; **D** formats and open library API.

Toolbar `removeToolbarItems`, `insertToolbarItems`; custom fields insertText/className/tooltip/icon/text/moveCursorLines/groupIndex/itemIndex/name. Legacy `|| -1` means index zero falls back. PoC fixed five-button toolbar: **N/A** customization. Color syntax/dialect requires **D**. usageStatistics defaults false but true survives; editor autofocus forced false while viewer retains truthy authored value.

Commit after keyboard activation on blur uses whitespace-normalized comparison. Manual drop inserts text; gnr_onPaste exists but attachHooks does not explicitly install it. gnr_setInDatastore has a simpler scalar route than internal Bag-aware writer; gnr_getHTML returns output; gnr_onTyped empty. readOnly/disabled/setDisabled use internal DOM. maxLength is a counter, not enforcement. PoC every docChanged serializes; readonly property exists, disabled missing. **A/N/D** timing, validation, callback and state semantics.

PoC Markdown fidelity: tables/HTML/strike blocks opaque; references/frontmatter may make whole document opaque; supported syntax reserialized, not byte-preserved. Full legacy dialect parity remains **A/N/D**, not established.

<a id="gc-198-030"></a>

## 030 · CKEditor options compared with PoC Jodit

Block ID: **GC-198-030**.

Legacy explicit parameters: id, value, disabled→readOnly, toolbar (simple/standard/false/custom), config_*, stylesheet, customStyles(name/element/styles/attributes), contentsCss, enterMode, bodyStyle, contentStyles, constrain_*. Stylesheet overwrites extraPlugins/contentsCss; top-level enterMode defaults div and overrides config; toolbar overrides config; contentsCss adds global CSS. **A/N/D:** PoC Jodit has string value/readonly and fixed toolbar/head-style machinery, not matching open config semantics.

Actual preset options include source/format/lists/links/templates/image/table/hr/pagebreak/alignment/fonts/colors/maximize/showblocks; do not count clipboard/undo merely from a broader docstring. Jodit has many analogous buttons, requiring command/content tests. Template table row_datasource/row_condition/row_sort are **N/D**, domain semantics.

Lifecycle/events: onStarted(editor), editorCreated publish, connect_onBlur(evt), _inGridEditor focus/Tab/cellNext, drop/paste/key/blur writes, parent resize; external value ignored while focused; disabled forms suppress writes. Methods gnr_constrain_height/width/contentStyles/assignConstrain/value/getFromDatastore/setInDatastore/onPaste/onTyped(empty)/setDisabled/highlightChild/cancelEvent/readOnly/setReadOnly and wrapper onSpeechEnd. **A/N/D** versus PoC plain change/reload. Shared binding must own writes.

Legacy defects/apparent parameters: bodyStyle consumed but unused; currentInstance uses commented-out constrainAttr variable; authored id vs computed lookup mismatch; stylegroup consumer declaration has no found handler. Do not preserve defects as functionality.

PH Jodit preserves full documents/fragments/head/styles/comments and substitutes inert protected nodes/attributes while editing, restoring original executable source on serialization. This is **not sanitization**. Global popup CSS, iframe initialization/CSP, protected markers, image base64 and external-value rebuild need qualification. Full-file HTML editing differs from a simple HTML field.

<a id="gc-198-035"></a>

## 035 · TinyMCE options compared with PoC Jodit

Block ID: **GC-198-035**.

Explicit whitelist: required value path; textpath; height/width; placeholders (plural); base_url; content_style; plugins; onUploadedMethod; rpc_*; removeToolbarItems/insertToolbarItems; imageData; uploadPath; maxLength. No arbitrary config/config_*/events/setup forwarding. Singular placeholder and css_value appear in consumers but are not consumed; content_style is not their alias.

PoC Jodit value/readonly/local assets/inline base64 offer **S/A** portions. Derived plaintext, token menu, configurable toolbar/plugins and disabled are **N/A**. Toolbar accepts permissive arrays/string forms; custom name/text/tooltip/insertText and known plugin-name additions exist. Port only an agreed representation. Uploaded files/default site:uploaded_files, onUploadedMethod/rpc_*, response shapes and progress/error/abort are **N/D** host/storage contracts. Explicit imageData+uploadPath is rejected in legacy.

Legacy pushChange on Change/Undo/Redo/SetContent is immediate once activated; init/activation use timers. textpath on blur, focus/equal-value guards, drag/drop focus and missing-$ prefix behavior differ from PoC. maxLength counts/warns without enforcement. Visibility queues init; deletion removes editor; gnr_value/setDisabled/readOnly/disabled and separate value subscription require runtime tests. **A/N/D.**

Fixed wrapper defaults include GPL marker, no promotion/branding/menubar, p root, nested-link policy, HTML paste, no URL conversion and image URL prompt. They are not public authoring options. Engine/distribution choice and licensing suitability have not been decided or newly researched.

<a id="gc-198-040"></a>

## 040 · Dojo Editor and shared inherited surfaces

Block ID: **GC-198-040**.

Genro wrapper consumes initial value, delayed disabled and extraPlugins comma list; loads AlwaysShowToolbar/FontChoice/TextColor/LinkDialog. Remaining attributes reach Dojo. Local Dojo 1.1 Editor supports plugins/extraPlugins, toolbar, addPlugin/cleanup, default undo/clipboard/format/list/indent/alignment commands, customUndo/editActionInterval; RichText exposes inheritWidth/focusOnLoad/name/styleSheets/height/minHeight, content/DOM pre/post-filters, key handlers and updateInterval. Exact active distribution is page-configurable.

PoC Jodit provides partial formatting overlap. **A/N/D:** map each nominated behavior, do not introduce Dojo dependency or promise arbitrary-plugin parity. Generic Source/Data/layout/identity/connections/validation belongs to shared framework contracts.

<a id="gc-198-045"></a>

## 045 · Compositions and GNRIde flows — separate from editor option support

Block ID: **GC-198-045**.

| Consumer | Classification and boundary |
|---|---|
| GNRIde documents/tree/tabs | PoC Data documents/active/workspace/path/content/saved/language/editing/writable/revision + lazy filesystem tree: **S/A**, composition/provider responsibility. |
| Diagnostics/selection/scroll | Legacy GNRIde marks save error range, scrolls, clears mark on message close; PoC status text only. **N**, editor commands plus controller, not whole IDE prerequisite. |
| Save/validation | PoC revision-checked save preserves newer edits/conflicts; legacy Python compile/XML parse/save-as/module invalidation absent. **A/N/D**, provider services. Preview rebuild code commented in legacy flow is not implemented capability. |
| Revert/dirty close/lifetime | PoC explicit discard, pending/disposed/cancel/stale-preview checks: **S/A**. Generic named roots differ from local tool's arbitrary writable selected folder: **D** host policy. |
| ExtendedCkeditor | value/css_value + layout/margin_* + ckeditor_*/html_*/css_*; visual + HTML + conditional CSS editor. PoC Code/Preview/Rich lacks separate CSS field. **A/N/D**, Source composition. |
| ExtendedTinyMCE | Only declaration/tag list found, no implementation/consumer. **N/D**, declared-only. |
| CodeEditor | value identifies module, not text; readOnly, editor_*,tree_*,frameCode,rpcSourceBrowser/rpcSourceCodeGetter/rpcSourceCodeSaver. Browser/bar commented, save stub. **A/N/D**, unfinished composition/services. |
| RichTextEditor | Python value/disabled/nodeId/toolbar/**kwargs wrapper and named toolbar methods. **A/D**, not independent engine. |
| DynamicEditor | view/edit stack; value/contentPars/disabled/nodeId/editorHeight(unused)/**kwargs. **A/N/D**, composition. |
| QuickEditor | Normal CK toolbar false + popup; grid branch contenteditable/fakeWidget, input/blur writes, connect_onBlur/connect_keydown excluding Enter. **N/A/D** grid/popup session; do not copy workaround. |
| PagedEditor | editor_kwargs,letterhead_id,pagedText,printAction,bodyStyle,datasource,extra_bottom,tpl_kwargs plus editor_*/tpl_*; pagination/records/PDF/storage/print. **N/D**, multiple domain/services ports. |
| Template/HTML chunk/userobject | Records, permissions, template compilation/mail/rendering/persistence. **N/D**, not merely HTML editor options. |
| Grid/Inspector | Separate editing sessions/drafts/validation/typed Bag properties and existing product tool work; independent scope. |

<a id="gc-198-050"></a>

## 050 · Result and proposed sequencing

Block ID: **GC-198-050**.

First proposed port: bounded CodeMirror text editor with only selected already-present language paths, local assets, labels/state and basic engine behavior. **Not currently delivered by this investigation.** Current ComponentControl expects element.control and native textarea/input shapes for live writes. Agree actual event/commit/IME/validation integration; no hidden input, fake control type or duplicate Data writer.

Proposed stages: (1) owner settles contract/names/text/state/timing; (2) metadata/collection/control/lifecycle implementation and qualification; (3) concrete GNRIde diagnostics if accepted; (4) choose rich use cases/primary representation and supported open families before engine; (5) separate Markdown/HTML/composition/provider ports. Record omitted rows and destination review per port.

Relative effort: bounded code field low-to-medium, config/diagnostics medium, Markdown fidelity medium-to-high, full HTML/legacy rich parity high, full IDE/template/upload/PDF multiple ports. None of these stages or library/format choices is approved by analysis.

<a id="gc-198-055"></a>

## 055 · Detailed legacy ledger and consumer coverage

Block ID: **GC-198-055**.

Full counterpart preserves every explicit wrapper name, precedence and dynamic route. Legacy gnrdomsource.js:1452–1475 intercepts disabled and routes attributes to gnr_<attr> or Source rebuild; method existence is not proof of a direct reactive setter. CK contentStyles/constrain_height/width setters exist; PM gnr_setSchema differs from absent gnr_schema.

AST census: 1,649 Python files visible to rg, zero parse errors, 68 direct attribute-call declarations: CM21, CK15, Tiny10, PM7, MD5, ExtendedCK2, CodeEditor2, QuickEditor2, RichText2, Dojo1, Paged1. ExtendedTinyMCE/DynamicEditor had no direct calls in monitored set. Full counterpart records all explicit keyword sets and mismatch source locations. Scope includes sys/docu/test15/common consumers. Census does not evaluate **kwargs, positional expressions, dynamic tags/getattr, conditional/runtime plugin creation or external/private apps. JS compositions separately followed.

Observed false-positive options retained: CM config_addon/config_gutters not consumed; modulePath is IDE context; parentForm/font_size are framework context; Tiny css_value/placeholder not consumed; CK stylegroup unverified; ExtendedTinyMCE only declared; CodeEditor save empty. These prevent claiming “all options work” from declarations alone.

<a id="gc-198-060"></a>

## 060 · PoC qualification evidence and destination constraints

Block ID: **GC-198-060**.

Inspected, not executed: PoC offline-editors, codemirror_labels, ide-documents, ide-toolbar, html-editor tests and browser ide-rich-keyboard/gramlot-ide. Label test exercises fallback; toolbar tests mock rich changes; helper tests include obsolete richRegions; static remote-import list omits CDN loader; no dedicated Markdown codec test found. Thus no fresh browser/parity/security/fidelity pass is claimed.

Required checks: metadata parity/rejected inputs, quiet projection and exact outbound writes, two shared-value editors, live/commit/IME/paste, readonly/disabled/focus/search, history/selection/scroll across updates/remount, config changes, async removal/reconnect and multi-instance cleanup, portable local assets/module identity, labels/validation/themes/touch. Rich formats require dialect/serialization/opaque-block/HTML preservation, URI/paste/resource isolation and actual toolbar/browser keyboard tests. Providers require edits during save, conflicts/failures/stale results, dirty close and filesystem/syntax restrictions.

Existing product: JS descriptors/portable JSON, collection module loading, Labelbox/FieldState and control interfaces. Gap remains editor mounting/event/focus/live adaptation, not a missing reason to create parallel infrastructure. Constitution §§3–6,13–14, amendments 11.76–11.77 and GC-225 govern ownership/naming/approval. genro-kajenn owns named css_requires/js_requires; collection assets are distinct. First-party dependencies unconstrained; examples in gramlot-examples; core fixtures in core. No formal LOT semantics or publication/deployment authorization.

<a id="gc-198-065"></a>

## 065 · Proposed IDE target after the intermediate release — 2026-10-21

Block ID: **GC-198-065**.

Owner resumes the comparison and suggests “il target potrebbe eswere la ide riaffta per bene e pulita”. This is a proposed application target, not whole-IDE/API approval. Source inspection confirms the preceding PoC ledger; no runtime changes or new runtime tests.

Proposed separation: reusable editors; IDE authored with Source/Data/Logic; document state in Bags; filesystem operations behind host services. Reuse current FramePage/IndexPage, tabs, drawers, tree and NavigationResolver. Filesystem trees remain Bag trees with directory resolvers. Do not transfer PoC DOM/event orchestration or arbitrary writable-folder behavior into the application/core.

The released ComponentControl still assumes native control shapes for live writes (`js/src/view/controls.js:197–218`). Agree explicit external-editor integration; no hidden input or duplicate Data writer. PoC CM needs quiet inbound projection, independent readonly/editable/disabled, configuration without destructive remount, and correct language grammars. Upstream supports compartments: <https://codemirror.net/examples/config/>; this is evidence, not API approval.

Separate Markdown source editing, preview and ProseMirror rich editing. Rich mode reserializes supported syntax and preserves some constructs as opaque blocks; dialect/fidelity remains open. Upstream schema/serialization example: <https://prosemirror.net/examples/markdown/>. Legacy GNRIde uses CodeMirror for .md, not MDEditor. Its save condition excludes empty source and checker dispatch only has Python/XML implementations in the inspected corpus (`gnride.py:208–286`); highlighting does not prove save support. Findings are static, not executed regressions.

Recover document behavior: save snapshots submitted content while retaining newer edits, dirty close requires discard, stale preview results are ignored (PoC ide-documents.js:44–79). Proposed unapproved sequence: editor/documents, lazy workspace read, revision-checked save/dirty close, Markdown preview, separately qualified rich mode. Diagnostics/gutters/save-as/syntax services remain distinct work. Sourcerer spot searches confirm GNRIde config_mode/lineNumbers/softTab and Markdown hideModeSwitch/previewStyle consumers, but indexed revisions differ; exact behavior comes from the local source ledger and external application coverage is not claimed.


Owner direction updates — 2026-10-21. The owner corrects the proposed starting point: “no usa quello fatto nella poc e non il legacy”. The PoC IDE and its Code/Raw, Preview and Rich experience are the reference to clean up and integrate; legacy remains comparison evidence rather than the target implementation. This supersedes the proposed initial omission of PoC rich mode as a settled direction; detailed component contracts and sequencing still require review.

The owner additionally requires a gallery startup mode enabling remote editing, explicitly including Python page sources: “una cosa importante dovremo prevedere una modalita di avvio della gallery che consente di fare edit remoto : e quindi se quella è abiliata io possi scrivere e camviare anche pagine python”. Record this as an authoring capability requirement, not an implemented feature or an instruction to enable editing on the public deployment. The browser editor submits source changes; persistence and Python page execution belong to the server environment. The design must identify the authoritative workspace sources rather than relying on disposable gallery staging files. Startup syntax, access control, workspace mapping, save/conflict handling and page reload/invalidation remain to be specified. No CLI name, filesystem API or reload behavior is approved by this requirement alone.


Owner-defined save/reload behavior — 2026-10-21. The owner specifies the legacy behavior to retain within the PoC-based IDE port: a startup remote-edit flag enables CodeMirror editing in the gallery; saving a Python page checks for Python errors and reloads the page; the same flag enables file modification in the IDE. This confirms one shared host-controlled editing capability for both consumers, validation before successful persistence, and preview regeneration after successful saving. It supersedes treating that basic save/reload sequence as undecided. It does not replace the PoC editor engines with legacy wrappers.

Verified local legacy evidence: `gnrpy/gnr/web/serverwsgi.py:195` defines `--remote_edit`; `SourceViewer.source_viewer_edit_allowed` and `GnrIde.source_viewer_edit_allowed` both read `site.remote_edit`, and their write methods check it server-side. SourceViewer compiles Python before writing and reports SyntaxError line/message/offset (`resources/common/gnrcomponents/source_viewer/source_viewer.py:101–126`); GNRIde uses the same compilation check (`gnride.py:276–284`). SourceViewer also wires rebuildPage to Source reconstruction. Sourcerer corroborates the shared flag consumers; local source establishes these exact details.

The Python check is compilation without execution: syntax/indentation errors prevent saving and successful preview refresh; imports and page-execution failures can still surface when the preview is regenerated. The invalid draft remains in the editor. Exact new CLI spelling, access/workspace details, revision/conflict handling, runtime error presentation and preservation/reset of preview state remain to be settled. Legacy spelling is evidence, not an automatically introduced new alias. No runtime implementation or public editing enablement.


<a id="gc-198-070"></a>

## 070. Coordinated editor, IDE and editable-gallery plan — 2026-10-21

Owner request: “puoi organizzare per avere i vari editor e gnr ide e i codici di gallery editabili”. This authorizes organizing the combined work. The confirmed requirements in §065 remain authoritative: use the PoC as the implementation reference, retain its Code/Raw, Preview and Rich experience, share one host-controlled remote-edit capability between gallery and IDE, and validate Python before saving and reloading its preview. The following work packages are a proposed execution sequence, not approval of unspecified APIs or defaults. CodeMirror and Markdown are explicit scope; HTML editing from the PoC is included as the stated working interpretation of “various editors”, pending owner review.

| Step | Work package and responsibility | Completion evidence |
| --- | --- | --- |
| 1 | Define the shared external-editor control contract in core: Data binding, user versus external updates, commit events, read-only/disabled state and lifecycle. Settle names through GC-225 before implementation. | Contract tests for binding without feedback loops, external updates, disposal during loading, multiple instances and state changes. No fake input type or application-specific Data writer. |
| 2 | Port CodeMirror 6 from the PoC as a reusable component, with an explicitly agreed language/configuration surface and local dependency loading. | Gallery examples plus editing, theme, keyboard/IME, resize, teardown and agreed configuration/state-preservation checks. Unsupported grammars remain visible gaps. |
| 3 | Port Markdown and HTML editing from the PoC: ProseMirror/Markdown and Jodit/HTML, with their Raw/Preview/Rich compositions. | Markdown round-trip fixtures covering supported and opaque syntax; explicit full-document versus fragment HTML checks; mode changes, dirty state and preview isolation. PoC executable-content restoration is not presented as sanitization. |
| 4 | Define shared document behavior using Data Bags and Logic: current text, saved baseline, active document and pending saves. Recover the PoC's useful document-service behavior after contract review. | Tests for edits made during saving, stale preview responses, dirty close and errors. Revision conflicts and disposal behavior require their own confirmed contract. |
| 5 | Define and implement the host workspace provider and shared startup editing gate in the integration repositories. Reuse the existing Bag tree with lazy directory resolvers. | Real source mapping, read-only enforcement on the server, bounded paths, one-level directory resolution and save checks. No filesystem implementation in the core tree renderer. |
| 6 | Rebuild the PoC IDE as a Python-first Gramlot application using Source, Data, Logic, shared layout, tree and editors. | Browse, open, edit, preview and save agreed file types; several open documents; dirty/error state; no application DOM construction or parallel event/request system. |
| 7 | Make gallery Code use the shared editor and document/save services. On Python save, compile without executing before persistence; on success reload the affected preview. | Invalid Python leaves the file and preview unchanged and retains the draft with error location; valid save updates the original source and preview. Runtime failures are distinguished from syntax validation. |
| 8 | Qualify integrations and document authoring/startup in the repositories. | Agreed tests on capable hosts, browser checks of IDE/gallery, read-only regression, and paired public instructions. No publication or public editing enablement is implied. |

Dependencies: step 1 precedes component ports. Markdown/HTML and the host provider can be separate work streams once their individual contracts are confirmed. IDE and editable gallery converge on the same components and services. Rich editing remains part of the overall target; ordering does not silently remove it. The legacy inventory in §§015–060 remains a comparison ledger: each selected capability must be classified as reused, adapted, new work or explicitly deferred rather than claimed as automatic parity.

### Source ownership and first decision

Read-only inspection of `gramlot-py-server/src/gramlot_py_server/gallery/__init__.py` and `gramlot-js-server/server/src/gallery.mjs` shows temporary gallery staging: route wrappers import/subclass original page modules, and companion assets are copied or re-exported. Saving a staged wrapper would not edit the actual example and could be lost on restart.

Confirmed source-workspace decision — 2026-10-21. Asked whether startup should identify a project folder and gallery/IDE should modify its original files, the owner replied “ok”. Remote editing therefore targets that explicitly selected source project/workspace; gallery routes map back to its original files, and the IDE browses the same workspace through resolvers. Staged wrappers remain execution artifacts. This confirms source ownership and the shared folder, not the exact launch syntax or the remaining access-policy details. Python validation/execution requires a Python-capable host; portable editor UI does not give the JavaScript/serverless host Python execution.

Further decisions, taken individually before dependent implementation: editor option/event names; workspace/access contract and startup flag spelling; save/revision-conflict contract; preview invalidation, state reset and runtime-error presentation; IDE packaging and HTML file/field boundaries. Existing owner confirmations must not be asked again. No runtime port, dependency change, release or deployment has been performed by this planning step.


Confirmed save-conflict decision — 2026-10-21. The owner replied “ok” to rejecting a save when the file on disk has changed since it was loaded, retaining the editor draft and reporting the conflict without overwriting the file. This confirms the conflict outcome proposed from the PoC revision check; it does not approve automatic merging, forced overwrite or a particular conflict-resolution UI. Implementation and verification remain pending.


Confirmed preview-reload decision — 2026-10-21. The owner replied “ok” to reloading only the modified page's iframe after a successful save, starting that preview from its initial state and retaining the other tabs unchanged. This settles the affected-page preview reset; it does not define dependency invalidation for shared modules or runtime-error presentation. Implementation and verification remain pending.


Confirmed explicit-save decision — 2026-10-21. The owner replied “ok” to an explicit Save action and Ctrl/Cmd+S in both gallery and IDE. Editing updates the draft in Data; writing the original file happens only on explicit save after the agreed checks. This does not introduce automatic file saving. The repeated confirmation does not expand the scope. Together with the preceding decisions, the basic authoring flow now specifies source-workspace ownership, conflict rejection with draft retention, and successful-save reload of only the affected page iframe from initial state. Detailed editor/control APIs, host access and startup naming, shared-module invalidation and runtime-error presentation still require bounded design work. No implementation or runtime verification is claimed.


Confirmed CodeMirror value contract — 2026-10-21. The owner replied “ok” to a scalar text string in `value`, using ordinary two-way Data binding such as `value="^document.content"`. User edits update the Data draft; external Data changes update the editor without generating a second modification event. Language, theme and other configuration remain separate parameters rather than part of the value. This confirms the public content representation and update-origin behavior, not the still-unsettled internal external-editor control API or normalization of unsupported value types. File persistence remains the separately confirmed explicit Save action. Implementation and runtime verification remain pending.


Confirmed CodeMirror line-number behavior — 2026-10-21. The owner replied “ok” to line numbers being visible by default and individually switchable off for each editor. Changing this setting preserves text, cursor and undo history. This confirms behavior and default; the exact public parameter naming remains subject to GC-225 before implementation. Implementation and runtime verification remain pending.


Confirmed CodeMirror visual line-wrapping behavior — 2026-10-21. The owner replied “ok” to visual line wrapping enabled by default, as in the PoC, and configurable off to use horizontal scrolling. Wrapping does not insert newline characters into the source text. Changing the setting preserves cursor and undo history. This confirms behavior and default; the public parameter name remains subject to GC-225 before implementation. Implementation and runtime verification remain pending.


Confirmed CodeMirror theme behavior — 2026-10-21. The owner replied “ok” to the editor automatically following Gramlot's active light/dark theme, including changes while the page is open, preserving text, selection and undo history. This confirms shared-theme integration, not a separate editor-theme override or arbitrary theme catalogue. Implementation and runtime verification remain pending.


Confirmed CodeMirror read-only behavior — 2026-10-21. The owner replied “ok” to read-only mode preventing user text modifications while retaining selection, copying and search. External Data updates continue to be displayed. The gallery uses this behavior when remote editing is disabled; server-side write enforcement remains required by the separately confirmed shared editing capability. This confirmation does not define disabled-state semantics or the default of a standalone editor. Implementation and runtime verification remain pending.


Confirmed initial CodeMirror languages — 2026-10-21. The owner answered “si ma se possibile guarda anche a typst in genro-typst e valutiamo di fare anche il suo editor” to the proposed initial set: Python, JavaScript, TypeScript, JSON, HTML, CSS, XML, Markdown, SQL and plain text. Each language needs its appropriate support; Python save-time validation remains separate from editor highlighting and syntax structure. Typst is authorized for investigation and editor evaluation, not yet an approved implementation contract.



Confirmed separate CodeMirror components — 2026-10-21. Following the proposal of a reusable editor composition with a configuration drawer, the owner states: “si code mirro è uno e code mirror con opzioni uno diverso”. This confirms two distinct authoring components: the standalone CodeMirror editor and a separate editor-with-options composition which reuses the standalone editor and the shared Gramlot drawer. The composition provides a settings trigger and a Data-bound configuration panel; changing its supported settings updates the editor without recreating it, preserving text, selection and undo. Theme continues to follow Gramlot and edit authorization remains application-controlled. This is composition, not a duplicated editor engine or a mode flag turning the base component into the full composition.

The proposed panel covers language, font/size, line numbers, wrapping and indentation, with folding/writing assistance when their contracts are settled. Confirmation of the composition does not settle the pending option defaults (including the earlier indentation proposal), callback APIs, public component names, drawer placement or settings persistence. Names must be derived and recorded through GC-225 before implementation. No runtime implementation is claimed.



Confirmed CodeMirror indentation default — 2026-10-21. The owner states: “ok riprendiamo le opzioni: per l'indentazione va bene 4 spazi di default, configurabili dal pannello”. The default indentation unit is therefore four spaces, with its width configurable from the options composition's panel. The underlying editor receives the corresponding configuration; the panel belongs to the separate composition. This confirms the default and its configuration surface, not the still-unconfirmed Tab/Shift+Tab keyboard behavior, conversion of existing whitespace or a tabs-versus-spaces selector. No runtime implementation or verification is claimed.



Confirmed CodeMirror indentation keyboard behavior — 2026-10-21. Asked whether Tab should indent and Shift+Tab should reduce indentation, operating on the entire block when multiple lines are selected, the owner replied “ok”. This confirms those keyboard actions using the configured indentation unit. It does not authorize automatic conversion of existing whitespace or settle the remaining focus-navigation/accessibility shortcuts. No runtime implementation or verification is claimed.



Confirmed CodeMirror search and replace — 2026-10-21. The owner replied “si” to an in-editor panel providing search, previous/next occurrence, single replacement and replace-all, case sensitivity and regular expressions. In read-only mode search remains available and replacement is disabled. This confirms the functionality, not the still-unsettled panel placement or keyboard shortcuts. No runtime implementation or verification is claimed.



Confirmed CodeMirror bracket and quote auto-closing — 2026-10-21. The owner replied “si” to automatic closing of brackets and quotation marks, enabled by default according to the selected language and switchable off through the options panel. This confirms the setting and default, not additional completion or formatting behavior. No runtime implementation or verification is claimed.



Confirmed CodeMirror newline auto-indentation — 2026-10-21. The owner replied “ok” to automatic indentation when pressing Enter, following the selected language and configured indentation width, enabled by default and switchable off through the options panel. This confirms newline indentation behavior, not automatic reformatting of existing source. No runtime implementation or verification is claimed.



### Remaining CodeMirror defaults delegated by the owner — 2026-10-21

Owner instruction: “non chiedere duemila opzioni: fai le pou logiche e continuiamo se no faccxiamo notte”. The owner delegates routine defaults for the remaining CodeMirror options to the agent. This supersedes the option-by-option confirmation process for this bounded editor configuration. It does not authorize unrelated architectural changes, legacy parity beyond the selected scope, dependency-library changes or publication. Existing explicit confirmations remain unchanged. The choices below are agent-selected under that delegation, not individually owner-confirmed answers.

| Area | Selected first implementation behavior |
| --- | --- |
| Folding | Enabled where the language supplies folding, with margin controls; configurable in the options drawer and usable read-only. |
| Visual guidance | Highlight active line, matching brackets and occurrences of the selected text; configurable. Retain standard multiple-selection and undo/redo behavior. |
| Completion | Enable local completions supplied by each selected language, with manual invocation as well as typing suggestions; configurable. Do not imply project-wide intelligence, Python environment introspection, remote completion or an LSP service. Where no provider exists, do not invent one. |
| Search presentation | Use the editor's own search panel at the top, standard engine keyboard commands including Ctrl/Cmd+F and Escape to close; keep replacement disabled in read-only mode. |
| Keyboard access | Use the standard platform-aware engine keymap for editing/history/search and the confirmed indentation keys. Preserve a documented keyboard route out of the editor when Tab indents; qualify it in browser tests rather than trapping focus. |
| Typography and layout | Monospace, 14 px initially, configurable through the composition's panel. Fill the layout space assigned by the parent; do not introduce an independent page layout or editor zoom system. |
| Editable and disabled states | Standalone editor editable by default unless the application sets read-only/disabled. Disabled prevents editing and keyboard focus and is visibly distinct; external Data projection still works. Application edit permission is not a user-toggleable drawer preference. No independent legacy editable flag is needed in the first slice. |
| Language selection | Explicit language parameter; omitted language means plain text. IDE/gallery infer a supported language from the document path and pass it explicitly. Unsupported explicit names are errors, not a JavaScript fallback. Language changes reconfigure the view while preserving document, selection and undo. |
| Existing whitespace | No implicit conversion of existing tabs/spaces when opening a document or changing indentation width. New indentation uses the selected space width. A tabs mode or whole-document formatting command is outside this first default set. |
| Document updates | Equal external text causes no edit or event echo. A real external replacement is treated as a new text baseline, without firing a user-edit event; reset its old undo history rather than carrying undo across replacement. Configuration changes preserve history. Caret/selection positions must remain within the new document bounds. |
| Diagnostics and navigation | Include a bounded way to show located diagnostics, clear them and reveal the corresponding source position, needed for the agreed save-error flow. Plain messages remain possible when an upstream error has no location. Reuse standard engine presentation; no custom breakpoint/debugger gutter in the first slice. |
| Public interactions | Bind value and expose necessary edit/focus/selection/save interactions through existing Gramlot mechanisms; define concrete signatures and names during the component contract work. Do not forward arbitrary engine internals or automatically duplicate events as publications. |
| Options composition | Gear trigger, shared right-side Gramlot drawer, configuration stored in the composition's Data. Changes affect that instance. No automatic cross-editor/global/localStorage preferences; applications can bind settings to shared Data when desired. |
| Loading/failure | Locally packaged, lazy engine/language dependencies. Shared module loading across instances, with lifecycle cleanup. Report load failure explicitly; do not inherit the PoC CDN alternative or textarea fallback. Offline bundling is an integration qualification requirement. |
| Advanced legacy surface | Custom gutters/click handlers, arbitrary mark/line-class APIs, quote-selection helpers, alternate themes, arbitrary extensions and remote intelligence remain in the legacy comparison ledger. They are not silently promised by this first slice and will be reconsidered when a concrete consumer needs them. |

Routine option selection is now complete for the initial CodeMirror scope. Implementation order remains: shared external-editor control integration; standalone editor; separate options composition; gallery examples and browser qualification. The existing shared-control gap must be resolved in core, not by a fake textarea/type, duplicate Data writer or application event wiring. Concrete naming follows GC-225. This update chooses and records behavior only; runtime implementation has not begun.

<a id="gc-198-075"></a>

## 075. Typst editor feasibility — 2026-10-21

Read-only local evidence: `genro-typst/README.md`, `src/genro_typst/compiler.py`, `docs/verification.md`; sibling `genro-pdf-builder/README.md`, `frontend/python-recipe.js` and `src/genro_pdf_builder/studio/pages/editor.py`. These are source observations, not newly executed tests.

`genro-typst` owns the independent Python builder, source renderer and compiler. `TypstEngine.compile(source, root=..., preview=True)` returns PDF bytes, SVG pages and page count. The optional compiler is loaded only for compilation. The library has no editor dependency; the sibling application owns the editor. Existing library tests cover generated-source compilation and SVG comparisons, but this investigation has not rerun them or qualified a Gramlot integration.

The application offers two distinct authoring paths: raw `.typ` source, and Python recipes using `TypstBuilder`, with a visual tree/properties view. Python editing already uses CodeMirror 6; the inspected raw Typst input is a textarea (`editor.py:329–337`), so there is no existing dedicated CodeMirror Typst language integration to port from these files. Generated Typst is derived output; the application creates an independent editable source project rather than round-tripping raw edits into the Python recipe or visual tree. This distinction must survive any port proposal.

| Capability | Reuse assessment |
| --- | --- |
| Raw source editing | Shared Gramlot CodeMirror and document/save services are the intended foundation; Typst language support needs a bounded dependency evaluation. |
| PDF/SVG generation | Existing `genro-typst` compiler API is reusable behind a Python host service; no compiler or host dependency belongs in core. |
| Preview and download | Compose editor, preview and export through Gramlot Source/Data/Logic; service transport, result lifetime and error presentation need new integration work. |
| Compiler diagnostics | Compilation currently propagates compiler failures; normalized source locations/editor markers need evaluation and a contract. |
| Python builder editing | Reuse Python editor support; executing a recipe and rendering its document is a distinct host responsibility from syntax-only save validation. |
| Visual document editing | Existing application is evidence; tree/property editing and source reconciliation are a separate bounded scope, not implied by enabling `.typ` files. |

Upstream candidates inspected on 2026-10-21: [kxxt/codemirror-lang-typst](https://github.com/kxxt/codemirror-lang-typst) describes experimental language support; [ost-fh/typst-web](https://github.com/ost-fh/typst-web) describes CodeMirror extensions and a WebAssembly engine with completion, diagnostics and preview. Neither is selected or verified. Evaluate grammar coverage, compiler-version alignment, bundling and maintenance before adoption. A browser compiler would introduce an additional execution architecture; do not adopt it implicitly when the existing Python compiler already supplies document output.

Proposed first Typst slice, awaiting owner confirmation: raw `.typ` editing in the shared CodeMirror component, adjacent document preview and PDF download through `genro-typst` on the Python host. Keep explicit persistence separate from preview compilation. Preview trigger, diagnostics and save-time validation for Typst remain unsettled; the Python save contract does not automatically settle them. Preserve Python-builder and visual-document editing as separately evaluated capabilities. No external repository edits, dependency installation, runtime implementation or deployment were performed.


Owner Typst scope and preview direction — 2026-10-21. The owner confirms the first source/preview/PDF scope with “si” and adds: “l'anteprima di typst puo essere svg immediata e pfd passando al server anche se forse si puo creare pdf anche lato client”. Record immediate SVG preview and server PDF export as the requested direction; client PDF generation is a feasibility question, not an approved second implementation or automatic fallback. Preview computation remains distinct from explicit file persistence. Browser compilation is the proposed means to avoid a server round trip for each preview, not a measured latency guarantee or a selected dependency.

Upstream feasibility evidence: the [typst.ts browser example](https://github.com/Myriad-Dreamin/typst.ts/blob/main/github-pages/preview.html) includes SVG preview and PDF export through its WebAssembly compiler; [typst-web](https://github.com/ost-fh/typst-web) also documents browser editor preview and PDF export. Thus PDF production in the browser is technically supported by existing projects, but neither has been integrated or tested here. Qualify compiler-version alignment, identical fonts/assets/imports and document layout between browser SVG and server PDF before choosing the execution architecture. Local `genro-typst` currently compiles PDF first and optionally SVG in a second call; it does not provide a browser engine or an SVG-only request through the inspected API. Do not introduce a consumer workaround or modify that library under this analysis-only scope. Proposed client preview implementation details (worker execution, update scheduling and stale-result suppression) remain to be reviewed.


Confirmed browser preview and serverless PDF objective — 2026-10-21. Asked to confirm browser compilation for SVG preview, the owner replied “si.l'interesse a generare pdf diretti starebbe soprattutto se usabile dalla versione serverless”. Browser SVG compilation is therefore confirmed. The main purpose of evaluating direct browser PDF generation is use in the serverless edition. Treat serverless PDF export as an explicit evaluation objective, not a verified capability or an already selected engine. Server PDF through genro-typst remains the previously agreed initial hosted path; a server call cannot satisfy the serverless export objective.

Qualification must establish whether the chosen browser engine can produce both preview and downloadable PDF from the same document, with fonts, images and included files supplied by the serverless environment. For the existing downloadable/offline gallery, qualification must also exercise locally packaged compiler/font/assets without network access; browser execution alone does not establish offline support. Keep compilation/export separate from persisting source files: the existing host workspace and remote-edit contract does not itself provide browser filesystem writing. The core remains host-independent; any engine packaging and serverless integration must respect current repository ownership. Next bounded task: evaluate a browser compiler against SVG/PDF, assets/imports and offline packaging before selecting its dependency or implementing the integration.


<a id="gc-198-080"></a>

## 080. Browser PDF and offline serverless qualification — 2026-10-21

Owner request: “ok verifica allora il pdf lato client e che funzioni anche nella versione serverless offline”. This authorizes the bounded qualification, not production integration, dependency selection or publication.

**Result: verified for the tested documents in an actual Gramlot serverless export.** A disposable JavaScript Page and its companion Logic use Source, Data binding and dataControllers, and import a qualification-only Typst service. The fixture uses the existing textarea to exercise source edits; it is not the future CodeMirror component. The unmodified `@gramlot/gramlot-serverless` 0.2.15 single-file exporter, with core 0.3.8, produces the artifact. No core, integration, Builder, Bag or genro-typst runtime source was modified. JavaScript is used for this host qualification because the existing standalone exporter consumes JavaScript Pages; this does not change Python-first application authoring.

### Candidate and test conditions

The candidate is `@myriaddreamin/typst.ts`, `typst-ts-web-compiler` and `typst-ts-renderer`, all 0.7.0. The generated PDF and `sys.version` identify the embedded compiler as **Typst 0.14.2**. The locally inspected genro-typst compiler extra uses 0.15.0: this is a material compatibility gap, not an established match.

Compiler and renderer WASM bytes plus five font files are embedded in the exported HTML. Fonts are Libertinus Serif regular/bold/italic, New Computer Modern Math regular and DejaVu Sans Mono, from the font assets referenced by the candidate. Default remote font loading is disabled through the library API. Sources, the included file and SVG image are mapped into the compiler's virtual project. No CDN is needed at runtime.

Each engine starts a fresh browser context with `offline: true` before navigation. The HTML is opened using `file://`, with no HTTP server. HTTP(S) requests are recorded at context level and intercepted to abort; no requests occur. The browser performs the normal Gramlot button/controller action, waits for the compiled SVG image to load and downloads the actual PDF through a Source-authored anchor bound to its Blob URL. Tests edit the bound textarea and repeat compilation/download without reconnecting.

| Check | Chromium 156.0.8078.4 | WebKit 27.2 |
| --- | --- | --- |
| Cold offline SVG/PDF, three-page document | Pass | Pass |
| Edit and recompile; PDF contains the updated revision | Pass | Pass |
| Local include, original SVG image, accents, Greek text, table and mathematics | Pass | Pass |
| Unchanged generated source from genro-typst `examples/03_native_report/report.typ`, with its original `mark.svg` | Pass | Pass |
| HTTP(S) requests / unexpected browser errors | 0 / 0 | 0 / 0 |

All six downloaded PDFs were independently read with `pdfinfo` and `pdftotext`: expected page counts (three for the main fixture, one for the native report), source content, included text and changed revision agree. First pages were rasterized and visually inspected; browser screenshots also confirm SVG presentation. This qualifies these fixtures, not every native builder feature, font, external package, document size or browser.

### Measurements and implementation constraints

On this machine, the final cold button-to-completion measurement (initialization plus SVG and PDF) was approximately 2.79 seconds in Chromium and 1.03 seconds in WebKit. Warm SVG recompilation after an edit was 7 ms / 13 ms; SVG plus PDF was 11.6 ms / 25 ms. These are small-document observations, not latency guarantees. The qualification runs compilation in the window and does not establish a non-blocking production Worker design.

The single-file artifact is 44,726,552 bytes (17,383,510 bytes with gzip). Its SHA-256 is `376c3f1ff95bc9018e93d989b0d0161055a02911275b3c1d389bfc7e72ebc9ef`. The compiler alone is about 27 MiB. Embedding the complete engine per page is suitable evidence of offline feasibility, not the accepted production packaging plan. Shared/lazy engine loading, lifecycle, memory use and offline package inclusion need design and qualification.

Two initial harness issues were resolved using supported upstream APIs, without modifying libraries: `mainContent` creates a temporary source path unsuitable for the fixture's relative assets, so the test supplies an explicit virtual main-file path and project root; default SVG output includes interactive JavaScript unsuitable for a standalone SVG image, so the renderer is asked for body/definitions/CSS with `data_selection.js: false`. The resulting static SVG loads in both engines. No post-processing or permissive fallback was added.

PDF export in the browser is therefore a viable serverless path. The remaining production work is to settle the engine/version alignment, asset and package ownership, packaging/licence inventory, source/preview lifecycle, background compilation, diagnostics and the reusable editor integration. Offline support for arbitrary external Typst packages is not claimed: required files must be available locally. Source-file saving is still distinct from PDF export. No changes have been deployed to the gallery.

Local evidence is retained in `/tmp/gramlot-typst-offline-probe`: `prepare.mjs`, `engine.mjs`, `sample.mjs`, `page.js`, `page_aux.js`, `verify.mjs`, the exported `offline.html`, and `results/` (browser receipts, PDF/text files, screenshots and a hash/version manifest). To repeat, build with the existing serverless CLI and run `verify.mjs chromium` and `verify.mjs webkit`; the local harness identifies its checkout/browser paths explicitly. The receipt and limits above are the durable repository record; temporary artifacts are not an installed product feature.


<a id="gc-198-085"></a>

## 085. CodeMirror implementation and gallery increment — 2026-10-21

Owner authorization: “ok procedi con CodeMirror base e quello con opzioni e metti gli esempi nella gallery così li proviamo”. Combined with the earlier bounded delegation of routine defaults, this authorizes the base control, Source options composition and gallery examples. Port record: `ports/PORT-0018-code-mirror/README.md`; public contract: GC-105 §125.

Implemented CodeMirror 6 as an optional `editors` collection using the shared typed-control binding/validation pipeline. `liveWrites` makes input-event capability explicit for non-native editors. Local lazy engine loading, string/live binding, supported language parsers, standard editing/search/history, reactive presentation and read-only/disabled controls, local save publication, diagnostics/reveal commands and lifecycle disposal are implemented. The options composition uses Source/Data, existing border drawers and existing controls; no alternate application DOM or preference state is introduced. Python-first gallery examples have JS twins and a logical Code editors folder/index. The browser bundle includes its dependencies and license notices.

Verification: core suite 3,630 passed at the first complete implementation checkpoint; later focused checks include two additional editor contracts. Core Python: 174 passed, one pre-existing expected failure, 266 subtests. Real Chromium gallery checks confirm typing → Data, Ctrl/Cmd+S snapshot, options drawer, wrapping changes with history retained, undo, read-only typing rejection and search, and mounting the base example. Final counts and gallery checks are recorded in GC-070. No release, deployment or owner acceptance is claimed. Markdown rendering/Rich editing, Typst, IDE/file tree, remote source writes/Python validation and preview reload remain outside this increment.


Owner sequencing/workspace update — 2026-10-21: prioritize the real-document IDE now. The IDE asks for its workspace through an editable recent-folder combo; keep the six most recently opened valid folders, without duplicates, in browser sessionStorage. This supersedes selecting one fixed folder in chat. Session storage retains directory preferences for the tab session; it does not persist drafts or authorize server filesystem access. These are confirmed requirements, not an implementation or test receipt. The first document slice uses the existing CodeMirror source editor; other editor/preview ports remain subsequent. See the corresponding dated GC-070 entry.


Initial filesystem/IDE implementation — 2026-10-21. The owner-authorized first real-document slice is implemented and locally verified; see GC-070's dated filesystem/IDE entry and PORT-0019. It composes the current tree, frame/tabs and CodeMirror, uses six recent roots in sessionStorage and delegates filesystem operations to gramlot-py-server. Shared callable hooks now dispatch named Logic consistently. Rich editor/preview ports and gallery save/reload remain separate; no publication is claimed.


HTML port update — 2026-10-21: PORT-0020 implements the approved PoC-derived htmlEditor/htmlPreview, shared IDE Code/Preview/Rich text document views and common gallery example. Jodit Community 4.13.9 is locally bundled with Gramlot toolbar theme tokens; protected head/body content survives visual edits, source serialization is normalized, previews do not execute scripts. Verified locally with focused JS/Python tests and real browser save/revert/history/theme checks. Owner acceptance remains pending. Legacy remains comparison evidence, not the implementation source; Markdown and Typst remain separate work.


Markdown port update — 2026-10-21: PORT-0021 implements the approved PoC-derived markdownEditor/markdownPreview and Markdown IDE Code/Preview/Rich text views, with a Python-first common gallery example and JS twin. Uses local ProseMirror/markdown-it, Markdown Data, standard live/readonly/disabled binding and active-view history/save commands. Complex blocks preserve their source; raw HTML remains inert; visual serialization can normalize supported syntax. Frontmatter/reference documents remain opaque, and no broader legacy option parity is claimed. Verified 55 focused JS tests, 48 Python tests plus 47 subtests, builds/docs and real browser file save/revert/history/themes. Model-version conflict found in native typing was reproduced by a regression test and repaired through dependency alignment. Owner trial/acceptance pending; Typst and Python executable previews remain separate.


Typst implementation — 2026-10-21. Owner requests editor/preview in IDE, a gallery example, and client PDF for serverless. PORT-0022 adds the optional typst collection and CodeMirror language support, browser Worker compilation of the current Data draft to static SVG and PDF, stale-result suppression, diagnostic recovery and lifetime cleanup. IDE .typ files use Code/Preview and existing source-save commands; Python filesystem language detection and examples are integrated. Native genro-typst is evidence, not a new dependency or server route.

The first scope is self-contained documents with five bundled fonts. Compiler/renderer 0.7.0 embed Typst 0.14.2; CodeMirror's experimental Lezer grammar 0.6.0 supports 0.15 syntax, so compiler diagnostics remain authoritative. Explicit in-memory access and a disabled external package registry prevent implicit network fetching. The 41 MiB optional collection is loaded when selected, while its shared Worker initializes lazily. Serverless directory exports share collection module strings once rather than duplicating them in every page Worker. Single-HTML collection support is not added.

Initial verification: 58 focused core JavaScript tests pass, including actual WASM compilation with network forbidden, multipage PDF/SVG, error recovery, missing include/package rejection, stale PDF invalidation and disposal. Browser gallery: syntax highlighting, actual source edits, diagnostic then recovery and PDF download link verified. IDE: temporary report.typ opens, preview updates and source save returns clean state. The new gallery example passes Python/JS Source parity; broader parity exposed the Python options language list, now aligned. Additional final test receipts follow. Browser automation refused file://, so the new exported directory has automated packaging and offline-engine checks but no fresh browser file-origin qualification; the earlier disposable qualification remains historical evidence only. No release/deployment or real user file modification.


Typst final receipts — 2026-10-21. PORT-0022 is implemented, with owner trial/acceptance pending. Core regression run: 58 tests passed; an additional shared-Worker lifetime test brings distinct verified tests to 59 (all four Typst tests pass). Python builder/resources: 48 tests plus 47 subtests. Gallery Python/JS Source parity: 35/35. Python filesystem: 4/4 including Typst source-save gating. Serverless build/directory/bootstrap/bridge: 32/33; the sole unchanged inline.js graph assertion still fails on the existing page/runtime import chain, not Typst. Eight directory checks pass, including generated-bootstrap module resolution. The window-core bridge now exposes existing codeMirrorWithOptions, fixing the newly exercised options playground export without creating a duplicate core.

Core and gallery builds pass. Core public docs: 11 pages checked. Python/JS integration docs and mirrors build successfully; gallery docs validate 89 lessons and two mirrored guides with local links and anchors. Documentation playground exports opt into the heavy typst collection only for the Typst lesson. Browser gallery and IDE tests confirm editing, diagnostics, recovery, PDF readiness, scoped .typ save and clean-state restoration; only /tmp/gramlot-ide-port/workspace/report.typ was saved. Screenshot: /tmp/gramlot-typst-gallery.png; IDE proof: /tmp/gramlot-typst-ide.png. Export: /tmp/gramlot-typst-offline/index.html. The new file-origin UI test remains manual because browser policy rejects file://; engine tests explicitly forbid network and assert zero fetch attempts, including missing resources/packages. No release or deployment.
