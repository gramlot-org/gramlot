# Editors and previews

Document ID: **GC-430**.

<a id="gc-430-start"></a>
## Start here

Editors bind a retained editing instance to Data; previews display a value without editing it. Engine resources load when needed, independently of collection availability.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-editors).

Both controls share one value. External Data updates use supported engine setters rather than recreating the editor. Editor instances are not application state. HTML/Markdown rendering uses the runtime sanitization/Markdown services, with component-specific policies; do not bypass them by inserting generated HTML yourself. [Modes and engine options](105-components.md#gc-105-125).

A serverless export opened from file must include the required engine resources in its exported module graph. Do not replace imports with CDN requests or assume a Python endpoint exists in a file-only page.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)


<a id="gc-430-005"></a>
<a id="gc-430-010"></a>

Ordinary Source/CSS attributes remain in Writing pages and Themes and CSS.
Pages inherit environment collections; Page.gramlots adds missing ones. Buttons are built in.
Contract JSON omits only undeclared keys: no default is not the same as null. dtype: T text, B Boolean, L integer, R real, X structured value; remaining codes are TYTX. binding: read = Data to widget, write = widget to Data, twoWay = both. nullable permits None; enum restricts values; annotation preserves type/regex constraints. Parameters sharing a table row have exactly the same contract. Child grammar: * allows arbitrary Source children; empty permits none. Parent None means no declared restriction.


<a id="gc-430-220"></a>
<a id="gc-430-shared-value"></a>
## Values and bindings

The value type and writeback behavior depend on the control. Use a Data pointer for binding; see [Data binding](097-data-binding.md).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `value` | `{"binding":"twoWay","default":"","dtype":"T"}` | codeMirror, htmlEditor, markdownEditor |
| `value` | `{"binding":"read","default":"","dtype":"T"}` | htmlPreview, markdownPreview |

<a id="gc-430-225"></a>
<a id="gc-430-shared-state"></a>
## Disabled, readonly and live updates

Disabled prevents interaction; readonly preserves reading without accepting edits. live controls when edits reach Data. See [Field behavior](105-components.md#gc-105-040).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `disabled, readonly` | `{"binding":"read","default":false,"dtype":"B"}` | codeMirror, htmlEditor, markdownEditor |
| `live` | `{"binding":"read","default":true,"dtype":"B"}` | codeMirror, htmlEditor, markdownEditor |

<a id="gc-430-230"></a>
<a id="gc-430-shared-labels"></a>
## Labels and field presentation

lbl supplies a field label; lbl_position places it. The lbl_* and box_* style families are described in [Themes and CSS](096-themes-and-css.md).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `lbl` | `{"binding":"read","dtype":"T","nullable":true,"qualification":"intl_str"}` | codeMirror, htmlEditor, markdownEditor |
| `lbl_position` | `{"binding":"read","default":"TL","dtype":"T","enum":["TL","TC","TR","L","R","BL","BC","BR"]}` | codeMirror, htmlEditor, markdownEditor |

<a id="gc-430-240"></a>
<a id="gc-430-shared-validation"></a>
## Validation

The validate_* family belongs to the shared validation contract, not to each widget. See [Validation rules, callbacks and messages](105-components.md#gc-105-076). Rule conditions and messages use the documented _if, _iswarning, _error and _warning suffixes. For example: root.textbox(value="^customer.email", lbl="Email", validate_email=True).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `validate_select, validate_email, validate_select_iswarning, validate_notnull_iswarning, validate_empty_iswarning, validate_case_iswarning, validate_len_iswarning, validate_min_iswarning, validate_max_iswarning, validate_email_iswarning, validate_regex_iswarning, validate_call_iswarning, validate_remote_iswarning` | `{"binding":"read","dtype":"B","nullable":true}` | codeMirror, htmlEditor, markdownEditor |
| `validate_notnull` | `{"binding":"read","default":false,"dtype":"B","nullable":true}` | codeMirror, htmlEditor, markdownEditor |
| `validate_empty, validate_min, validate_max` | `{"binding":"read","dtype":["T","L","N","R","B","D","H","DH","DHZ"],"nullable":true}` | codeMirror, htmlEditor, markdownEditor |
| `validate_case` | `{"binding":"read","dtype":"T","enum":["upper","lower","title","capitalize","u","l","t","c"],"nullable":true}` | codeMirror, htmlEditor, markdownEditor |
| `validate_len, validate_regex, validate_remote` | `{"binding":"read","dtype":"T","nullable":true}` | codeMirror, htmlEditor, markdownEditor |
| `validate_call, validate_onAccept, validate_onReject, validate__onResult` | `{"dtype":"T","nullable":true}` | codeMirror, htmlEditor, markdownEditor |
| `validate_timeout` | `{"binding":"read","dtype":"L","nullable":true}` | codeMirror, htmlEditor, markdownEditor |
| `validate_select_if, validate_notnull_if, validate_empty_if, validate_case_if, validate_len_if, validate_min_if, validate_max_if, validate_email_if, validate_regex_if, validate_call_if, validate_remote_if` | `{"dtype":["T","B"],"nullable":true}` | codeMirror, htmlEditor, markdownEditor |
| `validate_select_error, validate_select_warning, validate_notnull_error, validate_notnull_warning, validate_empty_error, validate_empty_warning, validate_case_error, validate_case_warning, validate_len_error, validate_len_warning, validate_min_error, validate_min_warning, validate_max_error, validate_max_warning, validate_email_error, validate_email_warning, validate_regex_error, validate_regex_warning, validate_call_error, validate_call_warning, validate_remote_error, validate_remote_warning` | `{"binding":"read","dtype":"T","nullable":true,"qualification":"intl_str"}` | codeMirror, htmlEditor, markdownEditor |

<a id="gc-430-425"></a>
## Editors and document previews


<a id="gc-430-190"></a>
<a id="gc-430-codemirror"></a>
### `codeMirror`

Collection: editors. Code/text editor with composed language and editor options.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-codemirror).


**Data contract.** Bind value two ways to source text. Live writes are the default. Deferred edits commit when focus leaves the editor. External value and configuration changes update the retained CodeMirror state.


**Interaction and events.** Undo, redo and historyChanged expose editor history. Ctrl/Cmd+S publishes local save while editable. Ctrl/Cmd+F opens search. Tab indents, Shift+Tab outdents and Escape followed by Tab exits.


**Composition.** Leaf control. Place a toolbar or preview beside it. Wait for ready before using engine-dependent methods such as diagnostics and position revelation.


**Limits and lifecycle.** Language names are enumerated and completion uses local language support. Readonly prevents changes and replacement. Disabled also prevents focus. The application owns persistence.

Shared contracts: [Values and bindings](#gc-430-shared-value), [Disabled, readonly and live updates](#gc-430-shared-state), [Labels and field presentation](#gc-430-shared-labels), [Validation](#gc-430-shared-validation).


| Parameters | Contract |
| --- | --- |
| `language` | `{"binding":"read","default":"text","dtype":"T","enum":["text","python","javascript","typescript","json","html","css","xml","markdown","sql","typst"]}` |
| `lineNumbers, lineWrapping, folding, bracketMatching, autoCloseBrackets, autoIndent, autocompletion, highlightActiveLine, highlightSelectionMatches` | `{"binding":"read","default":true,"dtype":"B"}` |
| `indentUnit` | `{"binding":"read","default":4,"dtype":"L"}` |
| `fontSize` | `{"binding":"read","default":14,"dtype":"L"}` |
| `fontFamily` | `{"binding":"read","default":"monospace","dtype":"T"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-430-195"></a>
<a id="gc-430-htmleditor"></a>
### `htmlEditor`

Collection: editors. Rich HTML editing using the supported engine configuration.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-htmleditor).


**Data contract.** Bind value two ways to HTML source. Live writes are the default and deferred edits commit on blur. Rich edits can normalize markup, while undo to the initial snapshot restores the original source.


**Interaction and events.** The rich toolbar edits supported body content. Undo, redo and the local save shortcut follow the editor history contract.


**Composition.** Leaf control. Pair it with a preview or source editor through the same Data string.


**Limits and lifecycle.** The document head, doctype and protected body regions stay outside the editable content. Removing or duplicating a protected placeholder rejects the edit. Use source editing for protected regions.

Shared contracts: [Values and bindings](#gc-430-shared-value), [Disabled, readonly and live updates](#gc-430-shared-state), [Labels and field presentation](#gc-430-shared-labels), [Validation](#gc-430-shared-validation).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-430-200"></a>
<a id="gc-430-htmlpreview"></a>
### `htmlPreview`

Collection: editors. Read-only HTML preview with the component sanitization contract.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-htmlpreview).


**Data contract.** The read-bound value supplies the HTML string projected to the iframe document. A Data change replaces the displayed document.


**Interaction and events.** Displays the iframe document without edit, save or completion callbacks.


**Composition.** Leaf control. Bind it to the same Data path as a separate HTML editor.


**Limits and lifecycle.** The iframe sandbox has no allow tokens, so scripts cannot execute. The Data string stays intact.

Shared contracts: [Values and bindings](#gc-430-shared-value).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-430-205"></a>
<a id="gc-430-markdowneditor"></a>
### `markdownEditor`

Collection: editors. Markdown editing with the supported editor modes.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-markdowneditor).


**Data contract.** Bind value two ways to Markdown. Live writes are the default and deferred edits commit on blur. Incoming Data updates retain the ProseMirror engine and plugins. Undo to the initial snapshot recovers the exact source.


**Interaction and events.** The toolbar and native edits go through the same document model. Undo, redo and local save use the shared editor contract.


**Composition.** Leaf control. Pair it with markdownPreview or a source editor through the same text path.


**Limits and lifecycle.** Rich editing covers ordinary paragraphs, headings, lists, quotes and fenced code. Tables, embedded HTML, strikethrough and task lists remain opaque source blocks. Frontmatter and reference definitions preserve the whole document as a source block. Rich edits can normalize supported syntax.

Shared contracts: [Values and bindings](#gc-430-shared-value), [Disabled, readonly and live updates](#gc-430-shared-state), [Labels and field presentation](#gc-430-shared-labels), [Validation](#gc-430-shared-validation).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-430-210"></a>
<a id="gc-430-markdownpreview"></a>
### `markdownPreview`

Collection: editors. Rendered Markdown preview.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-markdownpreview).


**Data contract.** Reads Markdown through value. Changing allowHtml alters rendering only. By default embedded HTML appears as text. With allowHtml enabled, rendered HTML is sanitized.


**Interaction and events.** Updates as read inputs change. It declares no save, edit or render-completion callback.


**Composition.** Leaf control. Pair it with a Markdown editor through the same Data string.


**Limits and lifecycle.** The renderer loads on demand. The sandboxed preview policy blocks external image requests and rendering leaves the source intact.

Shared contracts: [Values and bindings](#gc-430-shared-value).


| Parameters | Contract |
| --- | --- |
| `allowHtml` | `{"binding":"read","default":false,"dtype":"B"}` |

Child grammar: `''`; parent grammar: `None`.
