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
