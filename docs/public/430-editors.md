# Editors and previews

Document ID: **GC-430**.

<a id="gc-430-start"></a>
## Start here

Editors bind a retained editing instance to Data; previews display a value without editing it. Engine resources load when needed, independently of collection availability.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-editors).

Both controls share one value. External Data updates use supported engine setters rather than recreating the editor. Editor instances are not application state. HTML/Markdown rendering uses the runtime sanitization/Markdown services, with component-specific policies; do not bypass them by inserting generated HTML yourself. [Modes and engine options](105-components.md#gc-105-125).

A serverless export opened from file must include the required engine resources in its exported module graph. Do not replace imports with CDN requests or assume a Python endpoint exists in a file-only page.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)

## Keep the document in Data and the editing engine retained

`codeMirror` edits source text, `htmlEditor` edits rich HTML and `markdownEditor`
edits Markdown. All store a string with a two-way `value` binding. `htmlPreview`
and `markdownPreview` read that value without editing it. Connect editor and
preview to the same Data path rather than copying content between engine instances.
Engines/resources are bundled in the optional editors collection and load when
needed. Include that graph in a serverless export; no CDN or Python endpoint is
implied. See [editor composition](105-components.md#gc-105-125).

Editors write live by default; `live=False` commits on blur. `readonly` retains
reading/selection while preventing edits, and `disabled` also prevents focus.
Incoming Data still updates the existing engine through supported transactions or
setters, preserving its configuration/history instead of rebuilding the widget.
`undo()`, `redo()` and `historyChanged` expose editor history; Ctrl/Cmd+S publishes
local `save` with the current value. The application owns persistence, permissions,
server errors and a saved/dirty record baseline.

Choose `codeMirror` when exact code/text editing is needed. `language` selects a
supported language, while line numbers, wrapping, folding, indentation, completion
and font settings affect editing/presentation without reformatting the document.
Completion uses local language support rather than an LSP. Ctrl/Cmd+F opens
search/replace; readonly disables replacement. Tab indents, Shift+Tab outdents,
and Escape then Tab leaves the editor. After `ready`, diagnostics and position
revelation use the documented engine API. Unknown language names fail explicitly.

`htmlEditor` uses the supported Jodit engine and protects active/embedded document
content outside the editable DOM. It edits the body while retaining head, doctype
and document attributes. Removing or duplicating protected placeholders rejects
the edit: use Code for those changes. Rich serialization can normalize markup;
undo to the initial snapshot restores the original source. `htmlPreview` uses an
empty-sandbox iframe where scripts do not run. The editor's document guard,
sanitization and content policy are essential; these components are HTML views,
not execution previews for Python applications. See
[HTML behavior](105-components.md#gc-105-135).

`markdownEditor` uses ProseMirror for the supported rich schema: paragraphs,
headings, lists, quotes, fenced code, links/images and basic emphasis. Tables,
embedded HTML, strikethrough and task lists remain preserved source blocks whose
internals are edited in Code. Frontmatter/reference definitions preserve the
whole document as a source block. This is not full GitHub-flavored Markdown visual
editing, and rich edits may normalize supported syntax. `markdownPreview` renders
Markdown in a sandboxed iframe. `allowHtml=False` shows embedded HTML as text;
True sanitizes rendered HTML before insertion, without rewriting original Markdown.
External image requests remain blocked by preview policy. See
[Markdown behavior](105-components.md#gc-105-140).

## Choose a component

- [`codeMirror`](#gc-430-codemirror): Code/text editor with composed language and editor options.
- [`htmlEditor`](#gc-430-htmleditor): Rich HTML editing using the supported engine configuration.
- [`htmlPreview`](#gc-430-htmlpreview): Read-only HTML preview with the component sanitization contract.
- [`markdownEditor`](#gc-430-markdowneditor): Markdown editing with the supported editor modes.
- [`markdownPreview`](#gc-430-markdownpreview): Rendered Markdown preview.


<a id="gc-430-005"></a>
<a id="gc-430-010"></a>
Types: T text, B Boolean, L integer, R real, X structured value; other codes are TYTX. Binding: read = Data to widget; write = widget to Data; twoWay = both. A dash means no declared default/binding. None is a declared value. Constraints include enum, qualification, target and annotations. Tables describe component contracts; ordinary Source/CSS attributes are shared.


## Shared parameter contracts

Each widget below links only the shared contracts it supports. A shared name can have different types, defaults or bindings; separate rows preserve those differences.


<a id="gc-430-220"></a>
<a id="gc-430-shared-value"></a>
## Values and bindings

The value type and writeback behavior depend on the control. Use a Data pointer for binding; see [Data binding](097-data-binding.md).

Applies to: [codeMirror](#gc-430-codemirror), [htmlEditor](#gc-430-htmleditor), [htmlPreview](#gc-430-htmlpreview), [markdownEditor](#gc-430-markdowneditor), [markdownPreview](#gc-430-markdownpreview).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `value` | T | '' | twoWay | — | [codeMirror](#gc-430-codemirror), [htmlEditor](#gc-430-htmleditor), [markdownEditor](#gc-430-markdowneditor) |
| `value` | T | '' | read | — | [htmlPreview](#gc-430-htmlpreview), [markdownPreview](#gc-430-markdownpreview) |

<a id="gc-430-225"></a>
<a id="gc-430-shared-state"></a>
## Disabled, readonly and live updates

Disabled prevents interaction; readonly preserves reading without accepting edits. live controls when edits reach Data. See [Field behavior](105-components.md#gc-105-040).

Applies to: [codeMirror](#gc-430-codemirror), [htmlEditor](#gc-430-htmleditor), [markdownEditor](#gc-430-markdowneditor).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `disabled` | B | False | read | — | All listed above |
| `readonly` | B | False | read | — | All listed above |
| `live` | B | True | read | — | All listed above |

<a id="gc-430-230"></a>
<a id="gc-430-shared-labels"></a>
## Labels and field presentation

lbl supplies a field label; lbl_position places it. The lbl_* and box_* style families are described in [Themes and CSS](096-themes-and-css.md).

Applies to: [codeMirror](#gc-430-codemirror), [htmlEditor](#gc-430-htmleditor), [markdownEditor](#gc-430-markdowneditor).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `lbl` | T or None | — | read | qualification="intl_str" | All listed above |
| `lbl_position` | T | 'TL' | read | enum=['TL', 'TC', 'TR', 'L', 'R', 'BL', 'BC', 'BR'] | All listed above |

<a id="gc-430-240"></a>
<a id="gc-430-shared-validation"></a>
## Validation

The validate_* family belongs to the shared validation contract, not to each widget. See [Validation rules, callbacks and messages](105-components.md#gc-105-076). Rule conditions and messages use the documented _if, _iswarning, _error and _warning suffixes. For example: root.textbox(value="^customer.email", lbl="Email", validate_email=True).

Applies to: [codeMirror](#gc-430-codemirror), [htmlEditor](#gc-430-htmleditor), [markdownEditor](#gc-430-markdowneditor).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `validate_select` | B or None | — | read | — | All listed above |
| `validate_notnull` | B or None | False | read | — | All listed above |
| `validate_empty` | T / L / N / R / B / D / H / DH / DHZ or None | — | read | — | All listed above |
| `validate_case` | T or None | — | read | enum=['upper', 'lower', 'title', 'capitalize', 'u', 'l', 't', 'c'] | All listed above |
| `validate_len` | T or None | — | read | — | All listed above |
| `validate_min` | T / L / N / R / B / D / H / DH / DHZ or None | — | read | — | All listed above |
| `validate_max` | T / L / N / R / B / D / H / DH / DHZ or None | — | read | — | All listed above |
| `validate_email` | B or None | — | read | — | All listed above |
| `validate_regex` | T or None | — | read | — | All listed above |
| `validate_call` | T or None | — | — | — | All listed above |
| `validate_remote` | T or None | — | read | — | All listed above |
| `validate_onAccept` | T or None | — | — | — | All listed above |
| `validate_onReject` | T or None | — | — | — | All listed above |
| `validate__onResult` | T or None | — | — | — | All listed above |
| `validate_timeout` | L or None | — | read | — | All listed above |
| `validate_select_if` | T / B or None | — | — | — | All listed above |
| `validate_select_iswarning` | B or None | — | read | — | All listed above |
| `validate_select_error` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_select_warning` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_notnull_if` | T / B or None | — | — | — | All listed above |
| `validate_notnull_iswarning` | B or None | — | read | — | All listed above |
| `validate_notnull_error` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_notnull_warning` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_empty_if` | T / B or None | — | — | — | All listed above |
| `validate_empty_iswarning` | B or None | — | read | — | All listed above |
| `validate_empty_error` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_empty_warning` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_case_if` | T / B or None | — | — | — | All listed above |
| `validate_case_iswarning` | B or None | — | read | — | All listed above |
| `validate_case_error` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_case_warning` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_len_if` | T / B or None | — | — | — | All listed above |
| `validate_len_iswarning` | B or None | — | read | — | All listed above |
| `validate_len_error` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_len_warning` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_min_if` | T / B or None | — | — | — | All listed above |
| `validate_min_iswarning` | B or None | — | read | — | All listed above |
| `validate_min_error` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_min_warning` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_max_if` | T / B or None | — | — | — | All listed above |
| `validate_max_iswarning` | B or None | — | read | — | All listed above |
| `validate_max_error` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_max_warning` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_email_if` | T / B or None | — | — | — | All listed above |
| `validate_email_iswarning` | B or None | — | read | — | All listed above |
| `validate_email_error` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_email_warning` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_regex_if` | T / B or None | — | — | — | All listed above |
| `validate_regex_iswarning` | B or None | — | read | — | All listed above |
| `validate_regex_error` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_regex_warning` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_call_if` | T / B or None | — | — | — | All listed above |
| `validate_call_iswarning` | B or None | — | read | — | All listed above |
| `validate_call_error` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_call_warning` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_remote_if` | T / B or None | — | — | — | All listed above |
| `validate_remote_iswarning` | B or None | — | read | — | All listed above |
| `validate_remote_error` | T or None | — | read | qualification="intl_str" | All listed above |
| `validate_remote_warning` | T or None | — | read | qualification="intl_str" | All listed above |

<a id="gc-430-425"></a>
## Editors and document previews


<a id="gc-430-190"></a>
<a id="gc-430-codemirror"></a>
### `codeMirror`

Code/text editor with composed language and editor options.

Collection: **editors**. Browser element: `gramlot-code-mirror`.

[Editor composition and document behavior](105-components.md#gc-105-125).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-codemirror).


**Data contract.** Bind value two ways to source text. Live writes are the default. Deferred edits commit when focus leaves the editor. External value and configuration changes update the retained CodeMirror state.


**Interaction and events.** Undo, redo and historyChanged expose editor history. Ctrl/Cmd+S publishes local save while editable. Ctrl/Cmd+F opens search. Tab indents, Shift+Tab outdents and Escape followed by Tab exits.


**Composition.** Leaf control. Place a toolbar or preview beside it. Wait for ready before using engine-dependent methods such as diagnostics and position revelation.


**Limits and lifecycle.** Language names are enumerated and completion uses local language support. Readonly prevents changes and replacement. Disabled also prevents focus. The application owns persistence.

Shared contracts: [Values and bindings](#gc-430-shared-value), [Disabled, readonly and live updates](#gc-430-shared-state), [Labels and field presentation](#gc-430-shared-labels), [Validation](#gc-430-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |
| `language` | T | 'text' | read | enum=['text', 'python', 'javascript', 'typescript', 'json', 'html', 'css', 'xml', 'markdown', 'sql', 'typst'] |
| `lineNumbers` | B | True | read | — |
| `lineWrapping` | B | True | read | — |
| `indentUnit` | L | 4 | read | — |
| `fontSize` | L | 14 | read | — |
| `fontFamily` | T | 'monospace' | read | — |
| `folding` | B | True | read | — |
| `bracketMatching` | B | True | read | — |
| `autoCloseBrackets` | B | True | read | — |
| `autoIndent` | B | True | read | — |
| `autocompletion` | B | True | read | — |
| `highlightActiveLine` | B | True | read | — |
| `highlightSelectionMatches` | B | True | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-430-195"></a>
<a id="gc-430-htmleditor"></a>
### `htmlEditor`

Rich HTML editing using the supported engine configuration.

Collection: **editors**. Browser element: `gramlot-html-editor`.

[Editor composition and document behavior](105-components.md#gc-105-125).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-htmleditor).


**Data contract.** Bind value two ways to HTML source. Live writes are the default and deferred edits commit on blur. Rich edits can normalize markup, while undo to the initial snapshot restores the original source.


**Interaction and events.** The rich toolbar edits supported body content. Undo, redo and the local save shortcut follow the editor history contract.


**Composition.** Leaf control. Pair it with a preview or source editor through the same Data string.


**Limits and lifecycle.** The document head, doctype and protected body regions stay outside the editable content. Removing or duplicating a protected placeholder rejects the edit. Use source editing for protected regions.

Shared contracts: [Values and bindings](#gc-430-shared-value), [Disabled, readonly and live updates](#gc-430-shared-state), [Labels and field presentation](#gc-430-shared-labels), [Validation](#gc-430-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-430-200"></a>
<a id="gc-430-htmlpreview"></a>
### `htmlPreview`

Read-only HTML preview with the component sanitization contract.

Collection: **editors**. Browser element: `gramlot-html-preview`.

[Editor composition and document behavior](105-components.md#gc-105-125).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-htmlpreview).


**Data contract.** The read-bound value supplies the HTML string projected to the iframe document. A Data change replaces the displayed document.


**Interaction and events.** Displays the iframe document without edit, save or completion callbacks.


**Composition.** Leaf control. Bind it to the same Data path as a separate HTML editor.


**Limits and lifecycle.** The iframe sandbox has no allow tokens, so scripts cannot execute. The Data string stays intact.

Shared contracts: [Values and bindings](#gc-430-shared-value).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-430-205"></a>
<a id="gc-430-markdowneditor"></a>
### `markdownEditor`

Markdown editing with the supported editor modes.

Collection: **editors**. Browser element: `gramlot-markdown-editor`.

[Editor composition and document behavior](105-components.md#gc-105-125).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-markdowneditor).


**Data contract.** Bind value two ways to Markdown. Live writes are the default and deferred edits commit on blur. Incoming Data updates retain the ProseMirror engine and plugins. Undo to the initial snapshot recovers the exact source.


**Interaction and events.** The toolbar and native edits go through the same document model. Undo, redo and local save use the shared editor contract.


**Composition.** Leaf control. Pair it with markdownPreview or a source editor through the same text path.


**Limits and lifecycle.** Rich editing covers ordinary paragraphs, headings, lists, quotes and fenced code. Tables, embedded HTML, strikethrough and task lists remain opaque source blocks. Frontmatter and reference definitions preserve the whole document as a source block. Rich edits can normalize supported syntax.

Shared contracts: [Values and bindings](#gc-430-shared-value), [Disabled, readonly and live updates](#gc-430-shared-state), [Labels and field presentation](#gc-430-shared-labels), [Validation](#gc-430-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-430-210"></a>
<a id="gc-430-markdownpreview"></a>
### `markdownPreview`

Rendered Markdown preview.

Collection: **editors**. Browser element: `gramlot-markdown-preview`.

[Editor composition and document behavior](105-components.md#gc-105-125).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-markdownpreview).


**Data contract.** Reads Markdown through value. Changing allowHtml alters rendering only. By default embedded HTML appears as text. With allowHtml enabled, rendered HTML is sanitized.


**Interaction and events.** Updates as read inputs change. It declares no save, edit or render-completion callback.


**Composition.** Leaf control. Pair it with a Markdown editor through the same Data string.


**Limits and lifecycle.** The renderer loads on demand. The sandboxed preview policy blocks external image requests and rendering leaves the source intact.

Shared contracts: [Values and bindings](#gc-430-shared-value).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `allowHtml` | B | False | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.
