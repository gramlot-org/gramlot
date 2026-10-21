# 198 · Legacy editors: comparison and proposed ports

Document ID: **GC-198**.

[Concise counterpart](../../docs_llm/internal/198-legacy-editors.md).

Date: 2026-10-20. Source investigation and proposed work, not an approved design. No runtime implementation, dependency update, browser execution or global test run. The full source ledger and qualification evidence are included below; this document does not depend on temporary working reports.

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
