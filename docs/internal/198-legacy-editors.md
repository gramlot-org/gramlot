# 198 · Legacy editors: comparison and proposed ports

Document ID: **GC-198**.

[Concise counterpart](../../docs_llm/internal/198-legacy-editors.md).

Historical record — 2026-10-20: the initial investigation below predates implementation. See §085 for the current CodeMirror increment. The full source ledger and qualification evidence are included below; this document does not depend on temporary working reports.

<a id="gc-198-005"></a>

## 005 · Evidence keys and classification

Block ID: **GC-198-005**.

Repositories and revisions: legacy `/Users/gporcari/Sviluppo/Genropy/genropy` at `fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`; PoC `/Users/gporcari/Sviluppo/gramlot/gramlot-poc` at `10478b57ce3f22e6445eb6b72eba343520cbebac`; product `/Users/gporcari/Sviluppo/gramlot/gramlot` initially at `d01bf3dc6389ad9bca91ef0f4bdbaafbfcc10242`. Line references concern working files inspected, not a frozen snapshot of concurrent work. Stable repository baselines: [GenroPy](https://github.com/genropy/genropy/tree/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea), [Gramlot PoC](https://github.com/gramlot-org/gramlot-poc/tree/10478b57ce3f22e6445eb6b72eba343520cbebac), [Gramlot](https://github.com/gramlot-org/gramlot/tree/d01bf3dc6389ad9bca91ef0f4bdbaafbfcc10242).

Source keys below:

| Key | Repository/path |
|---|---|
| LE | legacy `gnrjs/gnr_d11/js/genro_editors.js` |
| LD | legacy `gnrjs/gnr_d11/js/gnrdomsource.js` |
| LW | legacy `gnrjs/gnr_d11/js/genro_widgets.js` |
| LC | legacy `gnrjs/gnr_d11/js/genro_components.js` |
| LB | legacy `tools/codemirror6-build/entry.js` |
| LI | legacy `resources/common/gnrcomponents/gnride/gnride.py` |
| PC | PoC `js/pages/src/codemirror-component.js` |
| PD | PoC `js/dom/src/editor-dependencies.js` |
| PM | PoC `js/dom/src/collections/markdown-editor.js` |
| PH | PoC `js/dom/src/collections/html-editor.js` |
| PI | PoC `js/dom/src/collections/gramlot-ide.js` |
| PS | PoC `js/dom/src/services/ide-documents.js` |
| PF | PoC `src/gramlot/filesystem.py` |
| PG | PoC `src/gramlot/grammar/widgets.py` |
| GC | product `js/src/view/controls.js` |

Classification is per observable capability, not a claim of a ready drop-in module:

- **S — straightforward recovery:** substantive behavior already exists in PoC and has a narrow scope; destination metadata/binding/lifecycle qualification still required.
- **A — adaptation:** existing engine or PoC machinery is relevant, but binding, configuration, semantics or lifecycle differ.
- **N — new port work:** no equivalent exposed implementation exists in PoC. The engine may have primitives; a supported Gramlot API still requires implementation/tests.
- **D — owner decision:** incompatible formats, open plugin/configuration surfaces, service ownership, legacy defects, or scope choices cannot be settled by copying code.

A row may have multiple classes. None means approved. “Absent” means absent from the inspected wrapper/API, not a claim that the upstream library cannot do it.

<a id="gc-198-010"></a>

## 010 · Completeness boundary: what “all options” means here

Block ID: **GC-198-010**.

This matrix covers all six discovered legacy editor wrappers, their explicitly consumed option groups, exposed widget methods/hooks, dynamic-update behavior, and named editor compositions/consumers. It separates actual handling from examples, dead parameters, upstream library capability and unrelated server behavior.

Three surfaces cannot honestly be turned into a closed list of options from wrapper code alone:

1. CKEditor forwards arbitrary `config_*`, including third-party plugin configuration. Its full reachable surface is the installed CKEditor version, plugin set and application configuration, not a finite wrapper whitelist.
2. Toast UI spreads residual editor attributes into upstream construction, including upstream events/hooks/plugins. CDN `latest` is unversioned: there is no single immutable full upstream option inventory represented by this checkout.
3. Dojo Editor and ordinary widget/base behavior inherit a larger framework surface. This report inventories the editor-specific handling, while generic Source/Data/events/layout remain a shared framework contract, not duplicated editor-specific switches.

Other families are bounded: CodeMirror extracts `config_*` but interprets a limited named set; ProseMirror extracts it but overwrites the used fields with top-level parameters and does not pass arbitrary plugins/extensions; TinyMCE constructs a whitelist and its own setup rather than forwarding arbitrary attributes. The open-family rows below are requirements to choose a supported contract, not declarations that every upstream option is already supported or an excuse to omit the family.

A claim of exhaustive parity with all CKEditor/Toast UI/Dojo plugins and every external application is therefore **not established**. Closing that broader scope requires selecting the exact distribution/plugin inventories and auditing their public option contracts plus real application usage; do not silently freeze or restore first-party dependencies to achieve it.

<a id="gc-198-015"></a>

## 015 · CodeMirror option and behavior matrix

Block ID: **GC-198-015**.

| Legacy option/behavior | Actual legacy contract and source | PoC equivalent or gap | Work |
|---|---|---|---|
| `value` initial text and binding | LE:520–539,818–819,882–897; resolved Data/literal, equality check before document replacement | PC:30–36,58: text property, null→empty, arbitrary values stringified; Data binding from old adapter | A: typed destination value and quiet projection |
| `_delay` write timing | LE:736–742: debounce `_delay logical OR 500`; zero is not immediate | PC:64–67 writes `change` on every doc change | A/D: choose commit/live/debounce semantics |
| External changes / user event echo | LE:882–897 dispatches replacement; listener writes through Data | PC:31–36 enters same docChanged listener, no origin guard | A: no accidental user callback/write echo |
| `readOnly` | LE:520–529,904–911: blocks editing while default `editable=true` retains focus/cursor/shortcuts | PC:58–62 couples readonly to editable false | A/D: preserve useful search/focus behavior |
| `editable` independently | LE:523–529,912–917, separate CM facet | No separate PoC parameter | N |
| `disabled` / `gnr_setDisabled` | LE:900–903 host disabled plus readonly | Absent in PC | N/A: shared control state |
| `lineWrapping` | LE:524–532,721–727,918–924: dynamic compartment | Always enabled PC:62 | A: expose boolean without destroying view |
| `config_mode` | LE:686–694; LB:237 supported language factory | `language` PD:20–37 | A/D: canonical name and explicit accepted set |
| Python, JavaScript, CSS, XML | LB:237 | PD:21–24; JS via default branch | S/A: direct language mappings, avoid catch-all |
| HTML | Legacy real nested HTML grammar, LB:237 | PoC uses XML grammar for `html`, PD:24 | N/A: add correct grammar |
| JSON | Legacy JSON factory, LB:237 | PoC `json` falls through to JavaScript | N/A |
| SQL, YAML | Legacy factories, LB:237 | No PoC packages/loaders | N |
| Markdown syntax highlighting | Legacy Markdown factory, LB:237 | `markdown` explicitly no extension PD:26 | N/A |
| Plain text | Legacy no selected language extension | Explicit `text` PD:25 | S |
| `htmlmixed`, `htmlembedded`, `text/html`, `md` aliases | LE:688–691 | No aliases, unknown language goes to JS | D: no unapproved compatibility/fallback paths |
| `config_theme` | LE:699–708 | One Dark hardwired PC:59 | A/N: accepted configurable themes |
| Bundled themes | LB:238–256: oneDark, amy, ayuLight, barf, bespin, birdsOfParadise, boysAndGirls, clouds, cobalt, coolGlow, dracula, espresso, noctisLilac, rosePineDawn, smoothy, solarizedLight, tomorrow | Only One Dark PD:11 | N/D for remaining themes and package size/theme policy |
| Theme aliases dark/twilight/night | LE:703–704 maps to oneDark/dracula | None | D |
| `config_fontSize` | LE:711–718 | CSS `--code-editor-font-size` PC:26 | A: parameter/theme mapping |
| `config_fontFamily` | LE:711–718 | Not exposed; fallback monospace only | N/A |
| `config_lineNumbers` | LE:655–657 defaults enabled | Hardwired basicSetup; no exposed toggle PC:59 | A |
| `config_keyMap='softTab'` | LE:669–683 overrides Tab insert | No PoC option/custom keymap | N/A |
| `config_indentUnit` | LE:671–673 only used for soft-tab space string | No exposed option | N/A |
| Default keymap/search/history/fold behavior | LE:659–685 explicit CM extensions | PC:59 `basicSetup`; no wrapper parity assertions | A: verify included features and keyboard semantics |
| Active line/gutter, selections/drop cursor, bracket matching, indent-on-input, fold gutter, matching selection highlighting | LE:659–667 | Engine basicSetup is relevant; no granular switches | A: behavior tests, not an all-options pass-through claim |
| Search panel position/tool styling | LE:666,695–700 explicit top search/toolsTheme | One Dark/basicSetup, different styling | A/D |
| `config_addon`, `config_gutters` | Actual Python consumers use these, but CM6 buildExtensions does not consume them | No equivalent | D/N: declared ineffective legacy options; not aliases of extraGutters |
| `config_extraGutters` | LE:751–808 consumes entry name/width (or a string name); CSS class generated; per-gutter click hooks | Absent PC | N |
| `onGutterClick_<name>` | LE:786–800 receives view,line,gutter,event | Absent | N/D: current named Logic/event contract |
| `gnr_setGutterMarker`, `gnr_clearGutter`, `gnr_lineInfo` | LE:1014–1067, DOM-backed markers + line data | Absent | N; current legacy wrapper implementation is evidence, not consumer qualification |
| `gnr_markText`, `gnr_clearMark`, `gnr_clearAllMarks` | LE:937–967, line/ch range + class; used by LI:239–245 | Absent | N: necessary if save-error highlighting included |
| `gnr_addLineClass`, `gnr_removeLineClass`, `gnr_clearAllLineClasses` | LE:968–998 | Absent | N |
| `gnr_scrollIntoView` | LE:999–1013; LI:238 actual diagnostic consumer | Absent | N/A: engine primitive plus canonical component command |
| `gnr_quoteSelection` | LE:926–936 surrounds selection | Absent | N/A |
| Selection/scroll/line-class preservation across rebuild | LE:729–750,815–870 | PC:39–40 destroys/recreates for language/readonly/provider changes, content only retained | A: preserve required state; distinguish selection from undo |
| Runtime `value`, `readOnly`, `editable`, `lineWrapping` | LE:882–924; LD:1453–1475 setters | PoC value in-place, other observed attributes rebuild | A |
| Runtime config changes | LD:1467–1475 uses gnr_<attr>, otherwise Source rebuild | PC language/provider rebuild; rest absent | A/D: define supported dynamic options |
| Loading / singleton engine identity | LE:546–575 local bundle callback queue | PD:6–18 lazy promise; explicit CDN loader alternative | S/A for local singleton; D for extra provider path |
| Load failure and fallback | Legacy loader behavior distinct from CM feature contract | PC:72 keeps textarea; separate fallback edit path | D: no inherited authorization for fallback |
| Height / focus / labels | Legacy host and common widget framework | PC:26,47,63 + WidgetLabel | A: current Labelbox/FieldState/control focus |

<a id="gc-198-020"></a>

## 020 · ProseMirror legacy compared with PoC rich editors

Block ID: **GC-198-020**.

PoC Markdown happens to use ProseMirror, while its HTML editor uses Jodit. Sharing an engine name does not supply legacy HTML/JSON/Bag format parity.

| Legacy option/behavior | Legacy evidence | PoC equivalent or gap | Work |
|---|---|---|---|
| `value`, `format='html'` | LE:1081–1088,1144–1332 | PH HTML string via Jodit; PM stores Markdown | A/D: choose HTML field/document contract and engine |
| `format='json'` | LE:1088,1144–1332; accepts JSON string or object, emits JSON string | No exposed structured-document format | N/D |
| `format='bag'` | LE:1144–1332 whole-document Bag snapshot; accepts Bag-like objects or XML strings | No equivalent | N/D; no inferred LOT semantics |
| `toBag`, `fromBag` | LE:1549–1567 | Absent | N/D: explicit conversion contract only |
| `schema='basic'` | LE:1098,1345ff | PM fixed Markdown schema; PH Jodit document DOM | N/D |
| `schema='basicWithLists'` | LE:1098,1345ff | Markdown schema has lists but no selectable HTML schema | A/N |
| `schema='basicWithListsAndTables'` | LE:1345–1508 | PM tables opaque/read-only in rich mode; PH Jodit tables | N/A/D: tables require exact model/commands |
| `setup='minimal'` | LE:1104,1345–1450 history/base keys/cursors | PM fixed history/base keymap | A: narrow overlap, not preset parity |
| `setup='example'` | LE:1104,1345–1450 input rules/list/mark keys | PM no equivalent selectable preset | N/A |
| `setup='full'` | LE:1104,1345–1450 toolbar and trailing paragraph | PM fixed 5 buttons; PH fixed Jodit toolbar | N/A |
| `menubar` override | LE:1107, derived from full if absent | No PoC toolbar toggle/config | N/A |
| `readOnly` | LE:1110–1117 overrides editable | PM readonly property, PH setReadOnly | S/A: metadata/boolean projection |
| `editable` | LE:1111–1117,1626–1632 | No independent parameter | N/A |
| `disabled` / `gnr_setDisabled` | LE:1617–1620 | Absent both rich wrappers | N/A |
| `beforeDispatch` | LE:1094,1334–1341,1529–1547 | No public hook | N/D: named Logic rather than copied JS eval |
| `afterDispatch` | Same | No public hook | N/D |
| `onChange` (doc changes only) | Same; context tr/view/steps/doc/before/genro/sourceNode | PM emits plain DOM change without transaction context | A/N |
| Debounced document serialization / write | LE:1538–1547 | PM serializes/emits each document transaction | A/D: timing and performance |
| External value projection bypasses normal transaction side effects/history | LE:1605–1615 | PM value replacement rebuilds view | A: history/selection and quiet writes |
| Table commands: insert/delete table,row,column; merge/split; header toggles; cell color | LE:1452–1508 | PM absent; PH Jodit has table UI but no proved identical commands/API | N/A/D |
| Table column resize/cell navigation | LE:1345–1508 | PM absent, PH Jodit registered table plugins PD:97–101 | A/N: qualify actual behavior |
| Undo/redo | LE setup plugins | PM history + buttons/keys PM:54–65; PH Jodit | S/A |
| Gap/drop cursors, Markdown input rules, list shortcuts, trailing paragraph | LE:1345–1450 setup-dependent | PM partial engine/schema defaults; not exposed or matched | A/N |
| `gnr_setSchema`, `gnr_setSetup`, `gnr_setMenubar`, `gnr_setFormat`, `gnr_rebuild` | LE:1633–1654 imperative methods | Absent | N/D: define declarative configuration first |
| Reactive schema/setup/menubar/format attributes | LD:1467–1475 looks for gnr_<name>; imperative gnr_set* is not same name | No equivalent metadata | A/N; do not claim in-place legacy setter |
| Format change clears data | LE:1570–1602 | No alternative format | D: destructive behavior is not an automatic requirement |
| Unknown schema/parsing fallback to empty | LE:1144–1332,1570ff | PM parse can preserve unsupported blocks; different behavior | D: reject unsupported inputs under product contract |
| `config_*` | LE:1081 then used fields overwritten by top-level parameters; no generic plugin/extension pass-through | No generic PM config | D: extracted parameter is not implemented option |
| Collaboration / changeset | Packages exist, actual widget plugins do not activate collaboration | No PoC collaboration | N/D; not a legacy implemented option to claim recovered |

<a id="gc-198-025"></a>

## 025 · Toast UI Markdown compared with PoC Markdown

Block ID: **GC-198-025**.

| Legacy option/behavior | Legacy evidence | PoC equivalent or gap | Work |
|---|---|---|---|
| Scalar Markdown `value` | LE:74–115,394–472 | PM string value | S/A |
| Bag `.text` + `.html` representation | LE:74–115,394–472 | No PoC representation | D/N: choose one primary representation |
| Bag root-value + separate HTML path | Same | No PoC representation | D/N |
| `htmlpath` derived output | Same | PM renderMarkdown returns HTML preview, no bound output path | A/N |
| `initialValue` | LE:102–115 from Data unless explicit | PM value initialized from IDE doc | A/D: precedence and single source of truth |
| `viewer` | LE:118–136 uses upstream factory | Preview iframe PI:101–115 + renderMarkdown PM:8–12; no standalone viewer parameter | A |
| `initialEditType` | Forwarded residual options LE:138–152 | PI separate Raw/Rich text panels; no equivalent parameter | A/N |
| `previewStyle` including custom `hidden` | LE:121–124,154–169 | Separate preview tab, no split/tab/hidden option | A/N |
| `hideModeSwitch` | Forwarded residual option | No standalone PoC mode switch | N/A |
| `placeholder` | Forwarded residual option | PM no placeholder | N/A |
| `height`, width/layout | Residual upstream options + host | PoC host/CSS and IDE layout | A |
| `usageStatistics` | LE:16 false default, explicit true passes | No matching telemetry option/path | D: do not introduce tracking for parity |
| `autofocus` | LE:131 viewer defaults false; LE:139 editor forces false | No explicit API | A/D |
| `colorSyntax` | LE:140–146 plugin enabled unless false | PM no color marks/toolbar | N/D: dialect/representation must support it |
| `plugins` | Residual upstream options, colorSyntax appended | Fixed ProseMirror plugins, no public extension API | N/D, open family |
| `events`/`hooks` and all other upstream options | LE:128–152 spreads residual attrs | No public equivalent | N/D, open family; no closed exhaustive upstream list at CDN latest |
| `removeToolbarItems` | LE:170–173 | Fixed PM toolbar | N/A |
| `insertToolbarItems` standard insertion object | LE:174–241 passed to editor | Absent | N/A/D |
| Custom `insertText`, `name`, `text`, `icon`, `className`, `tooltip` | LE:175–235 creates button/inserts selected text | Absent | N/A |
| Custom `groupIndex`, `itemIndex`, `moveCursorLines` | LE:199–235 positions item and moves selection | Absent | N/A |
| Default Markdown/WYSIWYG editing controls | Upstream toolbar via forwarding | PM Bold/Italic/Code/Undo/Redo only PM:63–67 | A/N: exact toolbar command matrix needed for chosen dialect |
| `maxLength` | LE:368–388 counter only, not rejection/truncation | No PoC counter/enforcement | N/D; distinguish counter from Gramlot validation |
| Blur/first-keyboard activation/whitespace dirty comparison | LE:246–313 | PM every docChanged, no whitespace normalization | A/D |
| Paste and manual drop insertion | LE:318–364 manual drop; gnr_onPaste exists at 488–493 but is not explicitly installed by attachHooks | Engine paste; no wrapper drop contract | A/N: actual browser qualification |
| `gnr_getHTML` | LE:484–487 | renderMarkdown helper, not widget command | A/N |
| `gnr_setInDatastore`, `gnr_onPaste`, `gnr_onTyped` | LE:474–493 | DOM change writer only | A/D: use shared binding; no duplicate manual writer |
| `readOnly`, `disabled`, `gnr_setDisabled` | LE:495–507 uses internal mdEditor DOM | PM property readonly; no disabled | A/N |
| Runtime config updates | LD default rebuild unless gnr_<attr> exists | No public config metadata | A/N |
| CDN resource/plugin loading | LE:22–69 latest URLs, no explicit Promise rejection | PD local lazy modules | A: packaged local path, dependency identity |
| Markdown source fidelity | Legacy upstream dialect/serializer | PM preserves tables/HTML/strike blocks as opaque, reference definitions/frontmatter whole-document opaque; normalized supported syntax | D/A: explicit compatibility/fidelity matrix before claiming parity |

<a id="gc-198-030"></a>

## 030 · CKEditor options compared with PoC Jodit

Block ID: **GC-198-030**.

Engine change means similar buttons are evidence of overlap, not API or serialization compatibility.

| Legacy option/behavior | Legacy evidence | PoC equivalent or gap | Work |
|---|---|---|---|
| HTML `value` | LE:2008–2026 | PH value string | S/A |
| External value while focused | LE:2008–2012 ignores update | PH setter destroys/reloads immediately | D/A: conflict with focus, selection and user drafts |
| `disabled` mapped to `readOnly` | LE:1676–1683 | PH readonly property only | A/N: destination semantics distinguish flags |
| `readOnly`, `gnr_setReadOnly` | LE:2060–2089 body/toolbar | PH Jodit setReadOnly | S/A |
| `toolbar='simple'\|'standard'` | LE:1660–1673,1685–1717 presets | PH fixed Jodit toolbar | A/N |
| `toolbar=False` | LE:1700–1703 hides toolbar | No PoC parameter | A/N |
| Custom toolbar/list/string expression | LE:1704–1717 | No PoC public config | N/D: no eval-based configuration inferred |
| Arbitrary `config_*` including plugin-specific configuration | LE:1686,1810–1841 forwarded config | Fixed Jodit.make configuration PH:87–99 | N/D, open family; cannot map exhaustively without version/plugins |
| `stylesheet` | LE:1687–1694 stylesheetparser + contentsCss | PH applies styles found in full HTML head | A/N: external stylesheet is distinct |
| `customStyles` name/element/styles/attributes | LE:1688,1696–1699 | No named style catalogue | N/A |
| `contentsCss` | LE:1689,1719–1721 | No public external CSS parameter | N/A |
| `contentStyles` / `gnr_contentStyles` | LE:1722,1777–1795 dynamic style node | PH original head styles on each load | A/N: independent bound CSS text |
| `enterMode` | LE:1719,1812 | Fixed Jodit behavior, no exposed Enter policy | N/D |
| `stylegroup` | Passed in CK demos; no consumer found in wrapper/Source/base | No PoC equivalent | D: unverified effect, not supported functionality |
| `bodyStyle` | LE:1719,1813 extracted, not applied | PH fixed iframeStyle | D: apparent legacy option, not working behavior to preserve |
| `constrain_*` general body styles | LE:1723,1797–1808 | Fixed iframe styling/host dimensions | A/N; open CSS-family mapping |
| `constrain_height`, `constrain_width` dynamic setters | LE:1769–1775 | No separate body dimension contract | A/N |
| `row_datasource`, `row_condition`, `row_sort` table dialog fields | LE:1727–1767 template dialog customization | No PoC equivalent | N/D: template semantics, not generic editor |
| `onStarted(editor)` | LE:1889–1891 | No public ready hook | N/A |
| `editorCreated` publication | LE:1988–2004 | No public equivalent | N/A: current messaging |
| `connect_onBlur(evt)` | LE:1919–1929 delayed callback | No public wrapper callback | A/N |
| `_inGridEditor`, Tab→cellNext, delayed focus | LE:1894–1897,1925–1927,1964–1971 | No rich editor grid integration | N/D: grid session ownership |
| Parent resize / fill parent | LE:1862–1906 Dojo resize | PH host and Jodit 100% sizing | A: native layout/resize lifecycle |
| Blur/paste/key/drop Data writes | LE:1877–1887,1917–1971 | PH Jodit change serializes once per changed HTML | A/D: coherent commit timing |
| Disabled form suppresses Data writes | LE:2014–2026 | PH readonly guard, no product form validation context | A/N |
| `gnr_onPaste`, `gnr_onTyped`, `gnr_setInDatastore` | LE:2014–2032 | No public commands, change event | A/D: shared binding, no duplicate writer |
| `onSpeechEnd` | LE:1974–1985 text insertion | Absent | N/D |
| `gnr_highlightChild` | LE:2038–2058 | Absent | N |
| Fixed toolbar formatting overlap | LE actual simple/standard presets include source, bold/italic, lists, link, templates, image/table/hr/pagebreak, alignment, styles/font/size/color, maximize/showblocks; clipboard/undo in a broader docstring is not preset evidence | PH:97 Jodit undo/redo, paragraph/font/size, bold/italic/underline/strike/brush/eraser, lists/indent/align, link/image/table/hr, find/selectall/fullsize | A: verify actual command-by-command semantics; missing presets/plugins not recovered by visual similarity |
| Full document/head/comments/executable-source preservation | Not a generic CK wrapper guarantee | PH:17–61 explicit preserved document/markers | A/D: PoC capability exceeds simple field semantics; NOT a sanitizer |
| Known implementation defects | currentInstance callback references commented-out constrainAttr; bodyStyle dead | No reason to replicate | D: record discrepancy, fix chosen primary path |

<a id="gc-198-035"></a>

## 035 · TinyMCE options compared with PoC Jodit

Block ID: **GC-198-035**.

| Legacy option/behavior | Legacy evidence | PoC equivalent or gap | Work |
|---|---|---|---|
| Required bound `value` path | LE:2106–2110 rejects absent path | PH string/property; IDE writes Data | A/D: standalone binding contract |
| `textpath` plain-text output | LE:2112–2113,2434–2590 writes on blur | No PoC bound plain-text output | N/A |
| `height`, `width` | LE:2115–2116,2250–2252,2314–2315 | PH host/Jodit sizes | A |
| `placeholders` comma list/menu | LE:2118–2119 and setup | No PoC placeholder insertion menu | N/A |
| `css_value` | Passed by legacy tpleditor.py:476, not consumed by Tiny wrapper; content_style is distinct | PI no independent CSS binding | D/N: not an alias; ExtendedCK has real separate CSS support |
| Singular `placeholder` | Present in test consumer but not forwarded into init | No PoC equivalent | D: apparent option, not proved support |
| `base_url` | LE:2120 | PD/PH local modules | A: delivery concern, not legacy URL requirement |
| `content_style` | LE:2121,2321 | PH head styles/fixed iframeStyle | A/N |
| `plugins` | LE:2122–2123 defaults link/lists/table/code/image | PD fixed Jodit plugins | N/D: open plugin names within Tiny whitelist |
| `removeToolbarItems` | LE:2126–2137,2288–2291 | No PoC option | N/A |
| `insertToolbarItems` strings | LE:2138–2149,2255–2304; known plugin strings add plugin | No PoC option | N/A/D |
| `insertToolbarItems` objects: name/text/tooltip/insertText | LE:2255–2304,2592–2630 custom HTML insertion | No PoC option | N/A |
| Permissive toolbar list representations | LE:2126–2149 arrays/JSON-ish/comma strings | No PoC equivalent | D: do not import coercion alternatives |
| `imageData` | LE:2150–2156,2336ff inline base64 | PH:98 insertImageAsBase64URI true | S/A: exact allowed MIME/size behavior needs contract |
| `uploadPath` | LE:2152–2156,2336–2398; default site:uploaded_files | No server uploads configured | N/D: host/storage service |
| `onUploadedMethod` | LE:2124,2336–2398 | Absent | N/D |
| `rpc_*` upload params | LE:2125,2336–2398 | Absent | N/D, open named service parameters |
| Explicit imageData + uploadPath exclusion | LE:2154–2156 error | PoC only inline route | D/A if upload scope approved |
| Image URL picker | LE:2331–2335 prompt callback | PH Jodit image dialog; external image policy constrained in editing iframe | A/D: URL/content policy |
| `maxLength` | LE:2157,2632–2690 counter/warning, not enforcement | No counter | N/D: distinguish actual feature from validation |
| HTML Change/Undo/Redo/SetContent Data updates | LE:2434–2590 gated activation; pushChange immediate, timers concern initialization/activation | PH change serialization with readonly guard | A |
| Whitespace dirty suppression | LE:2434–2590 | PH compares exact editor HTML string | A/D |
| `readOnly`, `disabled`, `gnr_setDisabled` | LE:2722–2759 | PH readonly only | A/N |
| External `gnr_value` | LE:2711–2721 | PH setter rebuilds | A: equality/selection/history/echo |
| Lazy initialization on show | LE:2163–2187, queued loader | PH connected/load generation guard | A: hidden panels and resize |
| Deletion cleanup | LE:2189–2192 tinymce.remove | PH:73 destruct + generation | S/A |
| URL policy / root block / paste defaults | LE:2318–2330 forces p, preserves URL strings, HTML paste etc | Different Jodit/prepareRichContent behavior | A/D: supported content/output contract |
| Public arbitrary config_/setup/events | Not forwarded; init and setup are wrapper-owned | Also not exposed | D: do not invent pass-through parity |
| Distribution licensing flag | LE:2310 local init sets gpl | PoC Jodit dependency differs | D: choose engine/distribution deliberately; no current legal/upstream claim |

<a id="gc-198-040"></a>

## 040 · Dojo Editor and shared inherited surfaces

Block ID: **GC-198-040**.

| Legacy option/behavior | Source | PoC equivalent or gap | Work |
|---|---|---|---|
| HTML `value` initial resolution | LW:1901–1906 | PH value string | A |
| `disabled` delayed application | LW:1886,1892–1898 | PH readonly property, no disabled | A/N |
| `extraPlugins` comma list | LW:1885–1889 | No public Jodit plugin list | N/D |
| AlwaysShowToolbar, FontChoice, TextColor, LinkDialog | LW:1881–1884 loaded plugins | PH fixed toolbar has analogous font/color/link controls | A; semantic match requires tests |
| Inherited Dojo editor options/events/plugins | baseDojo plus engine, outside 35-line wrapper | No Dojo dependency | D/N: enumerate selected distribution if full inherited parity requested; do not port Dojo machinery |
| Generic dimensions/classes/style/nodeId/datapath/events/validation/form behavior across all wrappers | Legacy shared bases and Source renderer | Current product has shared mechanisms | A/D: qualify common contract once, reference it from all editor components; no independent editor fallback layer |

<a id="gc-198-045"></a>

## 045 · Compositions and GNRIde flows — separate from editor option support

Block ID: **GC-198-045**.

| Consumer capability | Legacy evidence | PoC equivalent or gap | Work and ownership |
|---|---|---|---|
| GNRIde code value + dirty baseline | LI:200–223 | PS:25–29 saved/content; PI dirty tabs | S/A, document service/Data |
| File/tree opening | LI GNRIde composition; independent tree audit | PI:50–54 + PF:16–57 lazy resolver tree | A, tree/provider contract |
| Tab/document identity/isolation | Legacy workspace composition | PS:8–24 path key/Data workspace; PI tabs | S/A, composition |
| Language from document kind | LI:224–231 config_mode=editorMode | PF:90–93 suffix mapping, PC language loader gaps above | A/N, metadata plus proper grammars |
| readonly code display with focus/search | LI:230 plus LE editable default | PC disables CM editability together with readonly | A, editor behavior |
| Selection and scroll commands | LI:237–240 | No public PoC commands | N, editor command surface |
| Save failure diagnostic range | LI:235–246 computes 0-based line/ch, mark + scroll | PS error thrown; PI status text only | N, diagnostics→component bridge |
| Clear diagnostic on notification close | LI:243–245 gnr_clearMark | No equivalent | N, controller/message lifecycle |
| Save endpoint and dirty completion | LI:208–223,255ff | PS:43–56 revision-aware save snapshot | A, provider service |
| Python syntax validation before save | LI:276–282 compile only (not execution) | PF saves text without syntax validation | N/D, optional language/service contract |
| XML validation before save | LI:287–292 Bag parsing | Absent | N/D, provider validation |
| Save-as/name handling | LI:264–272 | PF only existing files; no create/save-as | N/D, filesystem service |
| Module invalidation after Python save | LI:279–280 sys.modules | No equivalent | N/D, application/server integration |
| Preview/rebuild of running page | LI:212–218 rebuild code commented out in this flow | PS:58–68 optional previewmethod for unsaved content; PI sandbox | A/D; do not describe commented code as delivered behavior |
| Save conflict/draft preservation | Legacy GNRIde no equivalent hash contract in inspected save | PF:96–122 SHA-256 check; PS save snapshot preserves newer edits | S/A, useful PoC behavior, separate from legacy parity |
| Revert/dirty close/explicit discard | GNRIde composition, not CM | PS:69–77; PI confirmation | S/A |
| In-flight/disposal/stale results | Legacy service/consumer dependent | PS pending, disposed, cancel, preview identity check | S/A |
| Workspace writes/access boundaries | Legacy source_viewer_edit_allowed | Generic PF named roots; local PoC tool accepts absolute chosen writable folder | D/A, host policy; do not generalize local-tool authorization |
| `ExtendedCkeditor` HTML+CSS+visual composition | LC:2291–2340; `value`, `css_value`, `ckeditor_*`, `html_*`, `css_*`; layout props and margin_* | PI HTML Code/Preview/Rich tabs; no independent bound CSS editor | A/N/D, reusable composition not a new engine |
| RichTextEditor | legacy foundation/macrowidgets.py:166–215 toolbar lookup/wrapper, resource requirements | No same wrapper | A/D, Python composition + chosen HTML component |
| `ExtendedTinyMCE` declaration | legacy gnrpy/gnr/web/widgets/genro.py:497–503 and gnrwebstruct/dojo11.py:76; no handler/consumer found | No PoC equivalent | N/D: declared-only, not a functioning component |
| `DynamicEditor` composition | foundation/macrowidgets.py:75–92 view/edit stack; contentPars, disabled, nodeId, editorHeight (unused), residual editor kwargs | PI separate viewing/edit modes, different composition | A/N/D |
| `QuickEditor` composition | LC:2208–2288 normal CK popup/toolbar false; grid branch contenteditable + fakeWidget, input/blur writes, connect_onBlur/connect_keydown (except Enter) | No equivalent rich-grid session | A/N/D: separate popup/grid contract, do not copy fake-widget workaround |
| `CodeEditor` composition | LC:2355–2437 `value` identifies module to load, not editor text; readOnly default true, editor_*, tree_*, rpcSourceBrowser/Getter/Saver, frameCode | PI more complete file documents; different APIs | A/D; legacy save stub and commented tree/bar are not functionality to recover |
| PagedEditor / letterhead / pagination / PDF / print | legacy resources/common/gnrcomponents/pagededitor/pagededitor.py:14–85 | No PoC editor equivalent | N/D, document/application/server services |
| Template editor: mail metadata, records, compilation, rendered previews | legacy resources/common/gnrcomponents/tpleditor.py:450–505 | Only generic HTML/Markdown preview | N/D, business/template service |
| HTML chunks / userobject persistence | Legacy consumers add application storage | No generic component equivalent | N/D, application/record layer |
| Grid cell sessions | Legacy CK `_inGridEditor`; broader grid contract | PoC grid-editor.js separate Source controls/drafts/validation | A/N/D, grid port not rich-editor wrapper |
| Bag/Source property editing | Separate legacy tool | PoC inspector-editor.js, current product inspector work | Separate accepted tool scope; not part of CodeMirror/rich-text parity |

<a id="gc-198-050"></a>

## 050 · Result and proposed sequencing

Block ID: **GC-198-050**.

The easy recovery is **a bounded CodeMirror text component**, only the already present Python/JavaScript/CSS/XML/text language paths, local loading, readonly state, labels and basic history/search after adapting the current component-control interface. Current product GC:199–235 expects `element.control`, reads disabled/readOnly and derives live input handling from native textarea/input shape. Do not fake a native control type, add a hidden field or duplicate the Data writer: agree the small real editor integration contract first.

A complete legacy comparison is larger than that first port. Missing but concrete capabilities include configurable language/theme/line numbers/keymaps, diagnostics/selection/scroll/gutters, rich editor toolbar configuration and events, derived HTML/plain-text outputs, template insertion, CSS editing, uploads and save validation. Several share engine primitives, but **none become supported merely by loading the engine**.

Proposed stages, all awaiting owner decisions before implementation:

1. Accept the inventory boundary and resolve first CodeMirror component contract, including canonical option names, nullable/text policy, readonly vs editable, user commit policy and external projection behavior.
2. Prepare first bounded port with current JS-owned metadata/collections, local module identity, lifecycle/IME/validation/label behavior and explicit omissions from the table.
3. Add GNRIde-consumed diagnostics (mark/clear/scroll) only if included in the chosen next consumer; keep files, revision checks and syntax validation in their provider/service responsibility.
4. Decide each rich content use case and primary persisted representation before choosing engine. Resolve which legacy open configuration/plugin families are intentionally supported, replaced or excluded. No silent compatibility aliases or format guessing.
5. Prepare separate Markdown, HTML, composition and server-dependent ports. Every completed stage records the remaining unsupported matrix rows and destination review; no claim of complete legacy parity before those are resolved.

Qualification must prove real typed input/IME/paste, quiet inbound changes, two editors on one Data path, undo/selection/scroll semantics, readonly/disabled/focus/search, dynamic options, disposal during load, multiple instances and portable packaged assets. Rich formats additionally need parser/serializer and toolbar-operation fixtures, unsafe content/URI/resource isolation, and full-document/fragment fidelity. IDE/provider tests independently cover conflicts, late responses, edits during save, filesystem restrictions and syntax errors.

<a id="gc-198-055"></a>

## 055 · Detailed legacy ledger and consumer coverage

Block ID: **GC-198-055**.


This detailed ledger preserves individual names, precedence and lifecycle routes behind the comparison matrix. It also distinguishes unimplemented declarations from actual behavior.

### Enumeration boundary

Every explicit extraction, attribute read, constructor option construction and public mixin in all five wrappers in `genro_editors.js` was cross-checked. Open extension objects cannot have a universal finite option list: CKEditor's `config_*` passes through the configured CKEditor API; Toast UI receives residual attributes through object spreading; Dojo receives remaining widget attributes and extensible plugins. Their upstream/plugin APIs depend on the loaded engine and are an explicit open boundary, not an omitted promise of full compatibility. This investigation inspects local wrapper semantics and named consumers; it does not certify every third-party plugin or callback combination. No upstream option is claimed merely because its name appears in a demo/docstring.

Generic framework options (Source identity, Data paths, binding expressions, size/style, generic connections/subscriptions) remain framework contracts. They are not independently reimplemented per editor. Local wrappers add the options below on top of those shared facilities.

### Dynamic attribute routing

`gnrjs/gnr_d11/js/gnrdomsource.js:1452-1475` intercepts `disabled` through Source state; for an external editor, a changing attribute invokes `externalWidget['gnr_' + attr]` when present, otherwise rebuilds the Source widget. Thus a Python reactive pointer does not imply in-place library reconfiguration.

| Editor | In-place attribute adapters found | Other dynamic options |
| --- | --- | --- |
| CodeMirror | `value`, `readOnly`, `editable`, `lineWrapping`; disabled through `gnr_setDisabled` | `config_mode/theme/lineNumbers/keyMap/indentUnit/fontSize/fontFamily/extraGutters` rebuild. Snapshot restores selection, scroll and stored line classes; no equivalent history/mark/gutter restoration was found. |
| ProseMirror | `value`, `readOnly`, `editable`; disabled through `gnr_setDisabled` | Direct `schema/setup/menubar/format` attributes have no `gnr_schema/setup/menubar/format` method and route to generic rebuild. Imperative `gnr_setSchema/Setup/Menubar/Format` instead call the wrapper's explicit rebuild routine, with its documented snapshot/format-reset behavior. Do not conflate these routes. |
| MDEditor | `value`, `readOnly`, `disabled`; disabled handler updates host and internal contenteditable | Other attributes rebuild. The engine options and generated HTML/Bag branches must be re-read during rebuild. |
| CkEditor | `value`, `readOnly`, `contentStyles`, `constrain_height`, `constrain_width`; disabled mapped to readonly | Other constrain/config/style/toolbar options can rebuild. `gnr_value` skips external updates while focused. |
| TinyMCE | `value`, `readOnly`, `disabled` | Other options rebuild; imperative readonly changes engine mode/body/toolbars. The code also subscribes separately to the value path, so its external-update behavior has multiple routes that require runtime tests. |

### Exhaustive explicit wrapper surface ledger

The main sections describe behavior and sources; this ledger lists the remaining individual names so that none is lost in family summaries. Classification here concerns the implementation observed in legacy, not destination approval.

| Wrapper surface | Exact names and behavior | Evidence |
| --- | --- | --- |
| CM constructor | `config_*`; top-level `readOnly`, `editable`, `lineWrapping`, `value`. Top-level readonly/editable override extracted config values; top-level wrapping overrides only when truthy. Initial content uses resolved value or captured value or empty string. | `genro_editors.js:520-534,815-837` |
| CM configuration | Consumed keys: `lineNumbers`, `keyMap`, `indentUnit`, `mode`, `theme`, `fontSize`, `fontFamily`, `lineWrapping`, `readOnly`, `editable`, `extraGutters`, `value`. Unknown keys extracted from config are not forwarded to EditorView. `indentUnit` constructs soft-tab text, not a general language-indent facet. | `:652-809` |
| CM gutter spec | Each entry accepts `name` and `width`, or the entry itself as a gutter name; handler is `onGutterClick_<name>` with view/zero-based line/gutter/event. Marker API accepts a DOM element; preserving this public shape would need explicit approval under Python-first authoring. | `:751-802,1014-1054` |
| CM Data timing | `_delay` defaults to 500 through `logical OR`; current text written after docChanged. Listener also snapshots selection; scroll listener snapshots scroll position. | `:728-750` |
| CM public methods | `gnr_value`, compatibility `setValue`, `gnr_setDisabled`, `gnr_readOnly`, `gnr_editable`, `gnr_lineWrapping`, `gnr_quoteSelection`; `gnr_markText`, `gnr_clearMark`, `gnr_clearAllMarks`; `gnr_addLineClass`, `gnr_removeLineClass`, `gnr_clearAllLineClasses`; `gnr_scrollIntoView`, `gnr_setGutterMarker`, `gnr_clearGutter`, `gnr_lineInfo`. Positions accept numeric offsets or `{line,ch}` depending on method. Quote end defaults to start. Mark options consume `className`, `attributes`. | `:882-1067` |
| PM constructor/config | Extracts `config_*`, then explicitly assigns `value`, `format`, `beforeDispatch`, `afterDispatch`, `onChange`, `schema`, `setup`, `menubar`, `editable` from top-level attributes. None of the other extracted config keys reaches EditorView. No user plugins/extensions pass-through was found. | `:1080-1117,1510-1567` |
| PM hook callback | `beforeDispatch`, `afterDispatch`, `onChange`; runtime arguments `tr,view,steps,doc,before,genro,sourceNode`; exceptions logged. Despite the comment saying compiled once, `_runHook` constructs `new Function` at each invocation. Return values do not veto a transaction. `_delay` controls Data serialization debounce. | `:1334-1341,1529-1547` |
| PM formats | JSON input accepts parsed objects as well as strings, output is a JSON string. Bag input accepts Bag-like objects or XML strings; HTML input stringifies. These permissive paths are legacy implementation, not proposed Gramlot acceptance. Invalid JSON/Bag can become empty document; unknown format reaches HTML path. | `:1284-1332` |
| PM public methods | `toBag`, `fromBag`; `gnr_value`, `gnr_setDisabled`, `gnr_readOnly`, `gnr_editable`; `gnr_setSchema`, `gnr_setSetup`, `gnr_setMenubar`, `gnr_setFormat`, `gnr_rebuild`. `fromBag` bypasses dispatchTransaction and therefore does not itself serialize back to Data through the normal listener. Generic rebuild accepts overrides for schema/setup/menubar/format/hooks. | `:1556-1654` |
| MD constructor | Clones all attributes; `usageStatistics` defaults false but explicit true survives; removes original attributes. Residual options spread to Toast UI; `htmlpath` removed before construction. `initialValue` supplied explicitly has precedence over scalar Data initialization; text/html Bag detection can assign it. | `:13-18,74-119` |
| MD engine switches | `viewer`, `colorSyntax`, `previewStyle`; `autofocus` forced false for editor, viewer uses authored truthy value or false. `plugins` array appended with colorSyntax when available, not replaced. Upstream `events`/`hooks` and other residual keys pass through as constructor options; their individual plugin functions were not qualified here. | `:32-69,121-154` |
| MD toolbar spec | `removeToolbarItems`; `insertToolbarItems`. Custom item reads `insertText,className,tooltip,icon,text,moveCursorLines,groupIndex,itemIndex,name`; insertion positions use `logical OR -1`, so explicit zero follows that fallback. Noncustom items forwarded to `insertToolbarItem`. | `:170-241` |
| MD events/commit | Internal keydown hook activates blur saving and length counter; blur normalized Markdown comparison; external dragover/drop reads text/plain then text and inserts text into both engine surfaces. Separate `gnr_onPaste` calls public setInDatastore; no general automatic hook for that mixin is established by its existence. | `:246-364,474-486` |
| MD public methods | `gnr_value`, `gnr_setInDatastore`, `gnr_getHTML`, `gnr_onPaste`, `gnr_onTyped` (empty), `gnr_disabled`, `gnr_readOnly`, `gnr_setDisabled`. Public setInDatastore is a simpler scalar route than internal setInDatastore's multiple Bag branches. `onTyped` helper also empty. `maxLength` counter does not enforce. | `:368-508` |
| CK constructor | `id` or generated id; disabled maps to readOnly only if readOnly absent, then disabled removed. `toolbar`, `config_*`, `stylesheet`, `customStyles`, `contentsCss`, `enterMode`, `bodyStyle`, `contentStyles`, `constrain_*`. Custom styles read `name,element,styles,attributes`. | `:1675-1725` |
| CK override order | stylesheet overwrites extraPlugins with stylesheetparser and supplies config contentsCss; customStyles sets stylesSet; top-level enterMode overrides config enterMode and defaults div; top-level contentsCss appends to global CK config CSS; toolbar defaults standard and overrides config toolbar. `bodyStyle` extracted but not applied. Config input is open, but these keys have wrapper precedence. | `:1689-1724,1810-1841` |
| CK callbacks/events | `onStarted(editor)` on instanceReady; source `editorCreated` publish; `connect_onBlur(evt)` delayed 200 ms; grid `_inGridEditor` focus/Tab/cellNext handling and suppression of periodic key sync; drop,paste,key,blur save. Focus cancels pending blur callback. Parent resize debounced 100 ms. | `:1861-1970,1988-2004` |
| CK defects/risks | `currentInstance` callback refers to `constrainAttr`, whose local declaration is commented; callback can encounter an unresolved identifier. Constructor honors authored id, but lookup later computes ckedit_<source id>, so nondefault id requires verification. Neither discrepancy is a supported feature. | `:1684,1814,1844-1846,1858-1860` |
| CK public methods | `gnr_constrain_height`, `gnr_constrain_width`, `gnr_contentStyles`, `gnr_assignConstrain`, `gnr_value`, `gnr_getFromDatastore`, `gnr_setInDatastore`, `gnr_onPaste`, `gnr_onTyped` (empty), `gnr_setDisabled`, `gnr_highlightChild`, `gnr_cancelEvent`, `gnr_readOnly`, `gnr_setReadOnly`; wrapper `onSpeechEnd`. Child highlight adds body nth-child style and scrolls; document/toolbar readonly manually managed. | `:1769-1808,1974-1985,2008-2090` |
| CK table additions | `row_datasource,row_condition,row_sort` committed on table-row/template properties; default border null and border-collapse style. These are template-engine dependencies. | `:1727-1767` |
| Tiny constructor | Required `value`; optional `textpath`; `height,width,placeholders,base_url,content_style,plugins,onUploadedMethod,rpc_*,removeToolbarItems,insertToolbarItems,imageData,uploadPath,maxLength`. No authored `config`, `config_*`, `events` or `setup` forwarding. | `:2106-2161,2306-2335` |
| Tiny toolbar options | Remove/insert accept arrays or permissively parsed strings. Custom insertion uses `name,text,tooltip,insertText`; omitted custom name generated. Known strings can add codesample/emoticons/charmap/anchor/searchreplace/visualblocks/fullscreen/insertdatetime/media/preview/help/wordcount plugins. Custom item `onAction` is internal, not an arbitrary forwarded authored callback. | `:2125-2147,2253-2299,2606-2630` |
| Tiny fixed options | GPL license marker, promotion/branding/menubar false; forced p roots, valid_children for nested links, paste_as_text false, URL conversion disabled, image picker prompts URL; these are implementation defaults, not public wrapper options. Engine plugins remain an open library-specific list. | `:2306-2335` |
| Tiny uploads | `imageData` FileReader path; otherwise uploadPath default site:uploaded_files, filename normalization, onUploadedMethod and rpc_* forwarded to uploadMultipart_oneFile/rpc.upload_file; progress/result/error/abort callbacks internal. Multiple response-shape fallbacks require destination review. | `:2148-2156,2336-2398` |
| Tiny events | onShow starts queued initialization; deletion removes TinyMCE; Change/Undo/Redo/SetContent; blur text extraction; Init loads Data and activates on first keydown/input/ExecCommand; dragenter/dragover focus and drop prefixes missing `$`; maxLength observes keyup/change/SetContent/init/paste. | `:2163-2236,2400-2704` |
| Tiny public methods | `gnr_value`, `gnr_setDisabled`, `gnr_readOnly`, `gnr_disabled`. Initial setup overwrites gnr_value with a local focused/equal-value guard; readonly supports multiple legacy engine method routes. | `:2429-2432,2711-2759` |

### Wrapper compositions, signatures and actual responsibilities

| Composition | Inputs and consumed options | Actual behavior, gaps and proposed classification |
| --- | --- | --- |
| `ExtendedCkeditor` | `value,css_value`; `height,width,region,title,margin,margin_*`; `ckeditor_*,html_*,css_*`; residual kwargs sent to CKEditor | `genro_components.js:2291-2353`. Main CK editor and lazy right HTML CodeMirror, plus optional CSS CodeMirror only when css_value supplied. HTML defaults htmlembedded/lineNumbers/softTab; CSS defaults css/lineNumbers/softTab. Fixed split/closable layout. Adaptation as Source composition after the two actual editors exist; not a third engine. Prefix forwarding is open within each child wrapper's actual API. |
| `ExtendedTinyMCE` | Python `**kwargs` declaration advertises value,height,width,config | Only declarations found at `gnrpy/gnr/web/widgets/genro.py:497-503` and tag list `gnrwebstruct/dojo11.py:76`. No JS implementation or consumer found in inspected widget/common sources. Classify declared/stub/unimplemented, not simple port or proven parity. |
| `CodeEditor` | `value,readOnly,editor_*,tree_*,frameCode,rpcSourceBrowser,rpcSourceCodeGetter,rpcSourceCodeSaver`; residual layout args | `genro_components.js:2355-2437`. value identifies a module loaded through dev.loadModuleSource; underlying CM edits workspace currentSourceElement. readonly defaults true. tree_* and source-browser UI mostly commented, saveChanges empty. Module-element loading methods depend on Genro RPC. Frame/source text composition can be adapted; loading/saving and unfinished browser need new approved services or explicit unfinished status. |
| `RichTextEditor` Python | `RichTextEditor(pane,value,disabled=None,nodeId=None,toolbar=None,**kwargs)` | `foundation/macrowidgets.py:194-215`. Makes parent overflow hidden, derives editor id, resolves named toolbar methods, delegates value/readOnly/toolbar/residual options to CK. Standard/simple toolbar methods define finite presets; named custom methods are extensible. Adaptation to selected HTML engine; do not mistake all names listed in the class docstring for installed plugins. |
| `DynamicEditor` Python | `dynamicEditor(container,value,contentPars=None,disabled=None,nodeId=None,editorHeight='',**kwargs)` | `foundation/macrowidgets.py:75-92`. View/edit stack, HTML view, Dojo Editor, disabled switches pane; resize writes iframe height. contentPars forwards stack attributes; editorHeight not consumed; remaining kwargs sent to editor. Adaptation of Source composition if needed; iframe sizing depends on chosen engine. |
| `QuickEditor` | `_inGridEditor`; layout `height,width,z_index,position,top,left,right,bottom,_class`; regular residual CK options; grid `value,connect_onBlur,connect_keydown` | `genro_components.js:2208-2288`. Regular mode CK with toolbar false and dialog expander. Grid mode instead creates contenteditable HTML div plus fakeWidget, writes Data on input/blur, delegates callbacks except Enter, and opens dialog. Grid/editor focus-navigation contract needs new bounded work; not an interchangeable CK wrapper. Test consumer `tools/ckeditor.py:28-49` includes grid usage. |
| `PagedEditor` Python | `pe_pagedEditor(pane,value,editor_kwargs,letterhead_id,pagedText,printAction,bodyStyle,datasource,extra_bottom,tpl_kwargs,**kwargs)`; extract prefixes editor_*,tpl_* | `gnrcomponents/pagededitor/pagededitor.py:18-85`. ExtendedCK + pagedHtml + HTML/PDF previews, database letterheads, htmltopdf service, storage and print RPC. Rendering component subset may be adapted; full parity requires service and business-document work, explicitly retained in comparison. |
| `TemplateEditor` / HTML chunk / userobject | Editor kwargs and application record/template/permission state | Existing recipes/components above are exercised by `tpleditor.py:450-505`, `htmlchunkeditor.py:12,51`, userobject editor. This report maps their editor boundary; it does not claim exhaustive parity of their entire business application, CRUD or template language. Their functions stay visible as work requiring separate service/domain contracts. |

Python widget signatures at `gnrpy/gnr/web/widgets/genro.py:427-514` are mostly `**kwargs`; CodeEditor explicitly has `value=None,**kwargs`. They do not constrain the actual option set. They include misleading general `config` claims for TinyMCE/CKEditor (actual wrapper APIs differ) and a ProseMirror description older than its toolbar/Bag/table implementation. Signatures are evidence of authoring entry points, not behavioral verification.

### Dojo Editor extension boundary

The Genro wrapper (`genro_widgets.js:1876-1910`) consumes `extraPlugins` as a comma-split string, removes `disabled` from initial attrs and applies disabled asynchronously, sets initial value, and forces loading of AlwaysShowToolbar, FontChoice, TextColor, LinkDialog. Remaining widget attrs reach the Dojo constructor through baseDojo (`:1409-1420`).

The locally inspected Dojo 1.1 Editor implementation (`dojo_libs/dojo_11/dojo_src/dijit/Editor.js:17-112`) consumes plugin names/objects and extraPlugins, creates or reuses a toolbar, supports dynamically adding plugins and invokes plugin cleanup. Its default command list includes undo/redo, clipboard, bold/italic/underline/strikethrough, lists, indent/outdent and alignment. `customUndo` and `editActionInterval` configure its historical undo logic (`:117-131`). RichText (`dijit/_editor/RichText.js:87-118`) exposes inheritWidth, focusOnLoad, name, styleSheets, height and minHeight; content/DOM pre/post-filter arrays and key handlers are extension points (`:45-85`), and updateInterval appears at `:884`. Exact active Dojo distribution is page-configurable (`gnrwebpage.py:209,1586`); source presence does not certify all plugin behavior in every deployment.

These options remain in the inventory as behavior to map to the chosen HTML editor or explicit new work. The plan does not remove them merely because they are old. Importing Dojo itself is not the proposed simplification. Complete parity of arbitrary user plugins cannot be decided from the wrapper alone; each nominated extension needs its implementation and a real consumer.

### Additional concrete verification cases

Include every surface selected for implementation in the contract/test matrix, especially zero-valued delay/toolbar indexes, dynamic configuration causing remount, undo and decoration retention, callback exceptions and veto expectations, external updates while focused, HTML/Markdown whitespace handling, empty/null values, Bag format alternatives, scalar/derived outputs, toolbar-only changes, initial disabled state before async load, multiple simultaneous instances, load failure/removal, template table attributes, engine source-mode edits, clipboard and paste, image URL/upload/inline data, IME, keyboard navigation and theme/locale changes. This list records necessary checks, not claimed tests or authorization to implement them all.


### Repository-wide Python call census

A final AST pass parsed all **1,649 Python files visible to `rg --files -g '*.py'`** in the local GenroPy checkout; **zero parse failures**, **68 direct attribute-call declarations** across 11 editor/composition families. The case-insensitive query monitored codemirror, proseMirrorEditor, mdeditor, ckeditor, tinymce, editor, ExtendedCkeditor, ExtendedTinyMCE, CodeEditor, RichTextEditor, DynamicEditor, QuickEditor and pagedEditor. ExtendedTinyMCE and DynamicEditor had no direct calls in this corpus. The summarized counts and explicit keyword sets are recorded below. The scan is reproducible by parsing Python files returned by `rg --files -g '*.py'` with Python AST and selecting case-insensitive attribute-call names from the listed set; count keyword arguments with no name as expansions.

| Family | Calls | Keyword expansions | Explicit keyword names |
| --- | ---: | ---: | --- |
| ckeditor | 15 | 3 | `config_contentsCss`, `config_disableNativeSpellChecker`, `config_stylesSet`, `constrain_border`, `constrain_height`, `constrain_margin`, `constrain_margin_top`, `constrain_width`, `contentsCss`, `disabled`, `height`, `nodeId`, `readOnly`, `stylegroup`, `toolbar`, `value`, `width` |
| codeeditor | 2 | 0 | `value` |
| codemirror | 21 | 1 | `config_addon`, `config_fontFamily`, `config_fontSize`, `config_gutters`, `config_indentUnit`, `config_keyMap`, `config_lineNumbers`, `config_mode`, `config_theme`, `editable`, `font_size`, `height`, `lineWrapping`, `modulePath`, `nodeId`, `parentForm`, `readOnly`, `value`, `width` |
| editor | 1 | 1 | `nodeId`, `value` |
| extendedckeditor | 2 | 2 | `constrain_height`, `constrain_width`, `css_value`, `margin`, `margin_left`, `region`, `value` |
| mdeditor | 5 | 1 | `height`, `hideModeSwitch`, `htmlpath`, `initialEditType`, `maxLength`, `nodeId`, `placeholder`, `previewStyle`, `removeToolbarItems`, `usageStatistics`, `value`, `viewer`, `width` |
| pagededitor | 1 | 0 | `border`, `editor_constrain_border`, `editor_constrain_margin`, `editor_constrain_min_height`, `editor_constrain_width`, `extra_bottom`, `letterhead_id`, `pagedText`, `value` |
| prosemirroreditor | 7 | 0 | `border`, `format`, `height`, `menubar`, `nodeId`, `padding`, `readOnly`, `schema`, `setup`, `value`, `width` |
| quickeditor | 2 | 0 | `height`, `lbl`, `nodeId`, `value`, `width` |
| richtexteditor | 2 | 0 | `height`, `toolbar`, `value` |
| tinymce | 10 | 2 | `css_value`, `height`, `imageData`, `insertToolbarItems`, `maxLength`, `nodeId`, `placeholder`, `placeholders`, `removeToolbarItems`, `textpath`, `uploadPath`, `value`, `width` |

Coverage extends to `projects/gnrcore/packages/sys`, `docu`, `test15`, current test pages and common/foundation components, not only the initially cited examples. This census is syntactic: it does not evaluate `**kwargs`, positional expressions, conditional declarations, dynamic tag strings (`_('ckeditor', ...)`), `getattr` dispatch, runtime plugin creation or external/private application repositories. JavaScript wrapper/composition declarations were separately followed as described above. Python appearances do not prove runtime viability.

Additional declared/consumed mismatches found by the census:

- `config_addon` and `config_gutters` are passed by consumers including `projects/gnrcore/packages/sys/webpages/dbadmin.py:92`, `docu/resources/docu_components.py:67,163` and client-builder examples. Current CodeMirror 6 `buildExtensions` does not read them. They must be recorded as legacy declarations without current effect, not silently promised as ported add-ons/gutters. The separately implemented `config_extraGutters` is a different API.
- `modulePath` is passed by GNRIde, but is not consumed by the editor wrapper; file/module context belongs to the IDE. `parentForm` and CSS `font_size` occur in documentation editors and belong to framework/application context, not CM engine configuration. CM font-specific override is `config_fontSize`.
- `css_value` is passed to TinyMCE by `resources/common/gnrcomponents/tpleditor.py:476`, but TinyMCE does not consume it. `content_style` is the actual TinyMCE wrapper option; these are not aliases. ExtendedCkeditor does consume `css_value` for its separate CSS field and content styles.
- `stylegroup` is passed in CKEditor demos but no consumption was found in the inspected editor wrapper or Source/base-widget files. Treat it as unverified effect, not rich-text functionality.
- Demo `placeholder` in TinyMCE is not forwarded to `tinymce.init`; `placeholders` (plural) is the implemented template token menu.

<a id="gc-198-060"></a>

## 060 · PoC qualification evidence and destination constraints

Block ID: **GC-198-060**.

No existing tests were executed in this investigation. Inspected test files are evidence of intended checks, not fresh passing receipts:

- PoC `js/dom/tests/offline-editors.test.js:13–53`: local module identity and Jodit controls/plugins. Its static source list omits codemirror-cdn.js; it does not prove absence of a remote path.
- PoC `tests/codemirror_labels.mjs:1–49`: fallback textarea, label/binding/focus/reconnect; not loaded CodeMirror behavior, and historical sibling import paths need qualification.
- PoC `js/dom/tests/ide-documents.test.js:11–65`: draft/save/conflict/disposal/preview with fake server.
- PoC `js/dom/tests/ide-toolbar.test.js:7–69`: UI state and mocked rich events; not parser/serializer fidelity.
- PoC `js/dom/tests/html-editor.test.js:7–30`: preservation helpers, including old richRegions helper not used by the current Jodit widget.
- PoC `tests/browser/ide-rich-keyboard.spec.js:5–28`: real Jodit typing/readonly/script-blocking scenario; `tests/browser/gramlot-ide.spec.js:3ff`: edit/save/dirty close.
- No dedicated Markdown codec test was found in the searched PoC test directory. Tables/HTML/strikethrough blocks are opaque; references/frontmatter can make a whole document opaque. Normal supported syntax is serialized again, not byte preserved.

Concrete destination evidence: `js/src/components/registry.js:19–78` owns descriptors and portable JSON; `js/scripts/export-components.mjs:1–15` exports metadata; `js/src/bootstrap.js:48–73` loads collection modules per realm; `js/src/components/bases.js:5–94` owns component/control responsibilities; `js/src/components/inputs.js:1–20,73–94` demonstrates Labelbox/FieldState and text values; `js/src/view/controls.js:199–235` is the concrete external-editor integration gap described above. None currently establishes CodeMirror or rich-editor availability in Gramlot.

Constitution §§3–6,13–14 and amendments 11.76–11.77 require Source/Data ownership, one accepted primary path, bounded reviewed ports, JS-owned component descriptions and explicit owner decisions. GC-225 governs names. Current collection modules/assets are distinct from legacy named css_requires/js_requires, whose resource host is genro-kajenn (amendment 11.57); do not invent a /_rsrc resource resolver in ordinary adapters. First-party dependencies remain unconstrained. Example pages belong to gramlot-examples; core tests use core fixtures. Public release/deployment and implementation are not authorized by this investigation.

Relative effort remains conditional: bounded CodeMirror is low-to-medium; configuration/diagnostics medium; Markdown fidelity medium-to-high; full HTML file editing and rich legacy parity high; complete IDE/template/uploads/PDF is multiple separate ports. The proposal does not select a new engine, accept every legacy alias, adopt alternate Bag/JSON representations, or establish formal Live Object Tree semantics.

<a id="gc-198-065"></a>

## 065 · Proposed IDE target after the intermediate release — 2026-10-21

Block ID: **GC-198-065**.

Owner resumes the CodeMirror/Markdown comparison and suggests: “il target potrebbe eswere la ide riaffta per bene e pulita”. This is a proposed application target, not approval of every editor option or of a whole-IDE port. The PoC modules inspected for this follow-up remain consistent with the preceding ledger. This follow-up is source inspection; no new runtime tests or implementation.

The proposed separation is reusable editor components; a Source/Data/Logic IDE composition; document state in Bags; and filesystem services behind the host integration. Current FramePage/IndexPage, tab containers, drawers, tree and NavigationResolver replace the corresponding prototype infrastructure. A directory-backed tree remains an ordinary Bag tree with directory resolvers; filesystem access does not enter the renderer or the editor.

CodeMirror's local loading, view lifecycle and text editing are useful recovery candidates. Its PoC wrapper still recreates the view on language/readonly/provider changes, conflates readonly and editable, lacks disabled, and does not distinguish external text projection from user edits. The released ComponentControl still selects live writes using native textarea/input shapes (`js/src/view/controls.js:197–218`); integration of a non-native editor needs an explicit shared control contract rather than a hidden input or a second Data writer. CodeMirror supports compartment-based reconfiguration; use this as implementation evidence, not as an already approved authoring API: <https://codemirror.net/examples/config/>.

For Markdown, distinguish editing the source file with CodeMirror, displaying a rendered preview, and editing through the PoC ProseMirror view. The latter reserializes supported syntax and preserves some unsupported constructs as opaque blocks; it does not establish byte-preserving source editing or full Toast UI parity. The schema/serialization boundary is also explicit in the upstream example: <https://prosemirror.net/examples/markdown/>. Rich editing therefore needs a dialect/fidelity decision and its own qualification.

The useful document-service behavior is concrete: IdeDocuments.save snapshots the submitted text and updates only its saved baseline on success, retaining newer edits; close requires explicit discard for dirty documents, and stale previews are ignored (`js/dom/src/services/ide-documents.js:44–79`). Recover these behaviors through current APIs. The PoC IDE's direct DOM/event orchestration is not the destination application design. Filesystem read/list/write and revisions belong to the host service; the generic configured-root provider must not inherit the local tool's arbitrary writable-folder behavior.

Proposed incremental target, still unapproved: a text-editor/document slice, lazy workspace reading, revision-checked saving and dirty-close behavior, then Markdown preview and separately qualified rich editing. Legacy diagnostics, gutter actions, save-as and language-specific save checks remain visible work, not implicit CodeMirror capabilities. The full option inventories above remain the basis for choosing each increment.

GNRIde legacy uses CodeMirror for Markdown files, not MDEditor. Its save condition excludes empty source, and its checker dispatch has only Python/XML implementations in the inspected corpus; do not infer save support from an available highlighting language (`resources/common/gnrcomponents/gnride/gnride.py:208–286`). These are source findings, not newly executed failure tests. Sourcerer spot searches corroborate real authoring uses of `config_mode`, line numbers and soft-tab settings in `GnrIde.gi_buildEditorTab`, and `hideModeSwitch`/`previewStyle` in `webpages/tools/mdeditor.py`. Indexed results contain multiple revisions; the local source ledger determines exact current implementation details, and those spot searches do not expand the earlier census to all external applications.


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
