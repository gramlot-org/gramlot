# Inputs

Document ID: **GC-410**.

<a id="gc-410-start"></a>
## Start here

Use a component when you need typed values, shared labels, validation or choices. Use `html_input` when you want the native HTML tag. Both participate in Source/Data bindings; a component adds its own parameter and editing contract.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). Example body for `main(self, root)`:

```python
pane = root.div(datapath="customer")
pane.textbox(value="^.name", lbl="Name", live=True)
pane.numberTextBox(value="^.seats", lbl="Seats")
```

`^` paths are relative to the containing datapath when they start with a dot. Put interface defaults in `default`; load record values into Data. Do not rebuild a control when its value changes.

For typed fields, incomplete text belongs to Source editing state; Data retains the last typed value. A parseable value can be invalid under validation rules: the form tracks the error and blocks saving. See [form editing state](340-components-and-collections-guide.md#gc-340-110) and [field behavior](105-components.md#gc-105-040).

`dbSelect` and `dbComboBox` describe remote choices, not a built-in database. The generic `method` contract uses an application endpoint; Asqueel query capabilities require its server integration. A file-only export cannot execute Python endpoints or provide a database integration; a JavaScript Worker endpoint may supply its own values.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)

## Choose the value contract before the appearance

Use `textbox` for a single string, `textBoxArea` for multiline plain text and
`passwordbox` for masked text. All bind their value to Data; password masking is
only visual and does not encrypt that value. `checkbox` stores a Boolean, including
when `mode="switch"` changes its appearance. A single `radioButton` also stores a
Boolean: its Source-scoped `group` clears the other member values. In contrast,
`radioButtonText` stores the chosen option code in one string, and `checkBoxText`
stores comma-separated codes, or null for no selection. Their captions are not
record values. Use `cols` to arrange these inline option groups; `checkBoxText`
does not provide a popup selection mode. See [native variants](105-components.md#gc-105-040)
and [multiple choices](105-components.md#gc-105-065).

`filteringSelect` is for a closed local set, `callbackSelect` for a set supplied by
a named browser Logic method, and `comboBox` for suggestions that also allow free
text. Local `values` uses `code:Caption` pairs. The constrained selectors store a
code; `comboBox` stores the caption/text itself, including unlisted text. A query
in a constrained field is an editing draft and never becomes Data merely because
`live=True`. The callback receives `_querystring` or `_id` and returns
`{rows, identifier, caption}`, synchronously or as a Promise. It owns filtering;
the control discards obsolete replies. Selection can use mouse or keyboard;
Escape cancels the draft, and an arbitrary unmatched caption remains invalid.
See [choice editing](105-components.md#gc-105-055) and
[free text suggestions](105-components.md#gc-105-060).

`dbSelect` and `dbComboBox` obtain remote suggestions through `method`; they do
not add a database to the core. `dbSelect` stores the selected key (text or integer),
while `dbComboBox` accepts free text. `caption_field` controls display separately
from identity; `selectedCaption`, `selectedRecord` and `selectedCb` expose the
selection contract. Database query features require the relevant server
integration. A file-only export cannot execute a Python endpoint or provide a
database integration; a JavaScript Worker endpoint may supply its own values. Declare the provider
and its authorization in the host rather than introducing application requests.

`numberTextBox`, `dateTextBox` and `timeTextBox` separate localized editing text
from typed Data. Numbers use finite real values by default; `dtype="L"` requests
safe integers and `dtype="N"` exact Decimal support. Dates are civil `D` values,
times civil `H` values; formatting does not change them into strings. Incomplete
or unparseable drafts retain the last typed Data value. Enter/change/blur commits
valid text, `live=True` commits valid input as it is entered, Escape restores the
accepted value, and clearing writes null. `dateCalendar` edits the same date type
inline; `dateTextBox` provides its calendar popup unless `calendar=False`.
`workdate` sets the reference day for relative date editing, not the field value.
See [typed editors](105-components.md#gc-105-045) and
[calendar interaction](105-components.md#gc-105-070).

`colorpicker` uses the browser's color chooser and stores a color string.
`horizontalSlider` and `verticalSlider` store numbers within `min`, `max`, `step`.
The native range also corrects finite incoming Data to that grid through a plain
reactive value pointer; controls sharing a path need compatible ranges. This
correction is independent of `live`. Native range keyboard details can vary by
browser. Use `disabled` to lock radios, colors and ranges: native `readonly` does
not lock those controls. Text, password, multiline, color and range controls commit
on change by default and on input with `live=True`.

Bind `value="^.field"` within the intended datapath, load record values into Data,
and reserve `default` for interface defaults. Labels (`lbl`, `lbl_position`) and
`validate_*` are shared field services, not persistence. Parseable values can still
fail validation and block form saving. `editingStatus` presents the nearest shared
editing session's errors and changes; it requires that session and creates neither
a record store nor a save implementation. See [editing sessions](340-components-and-collections-guide.md#gc-340-110),
[validation](105-components.md#gc-105-076) and the parameter contracts below.

## Choose a component

- [`editingStatus`](#gc-410-editingstatus): Changes and validation feedback from the nearest Source form state.
- [`textbox`](#gc-410-textbox): Single-line text with label, validation and optional live updates.
- [`checkbox`](#gc-410-checkbox): Boolean value, displayed as a checkbox or a switch.
- [`radioButtonText`](#gc-410-radiobuttontext): A group of local radio choices storing one option code.
- [`textBoxArea`](#gc-410-textboxarea): Multiline plain text with the same field and validation contract.
- [`passwordbox`](#gc-410-passwordbox): Masked text entry; masking does not encrypt or persist the value.
- [`radioButton`](#gc-410-radiobutton): One Boolean radio option; the Source-scoped group keeps its members mutually exclusive.
- [`colorpicker`](#gc-410-colorpicker): Browser color input, with a bound color value.
- [`horizontalSlider`](#gc-410-horizontalslider): A bounded numeric range displayed horizontally.
- [`verticalSlider`](#gc-410-verticalslider): A bounded numeric range displayed vertically.
- [`numberTextBox`](#gc-410-numbertextbox): Locale-aware numeric editing; Data keeps the declared numeric type.
- [`dateTextBox`](#gc-410-datetextbox): Civil date editing with an optional calendar popup.
- [`timeTextBox`](#gc-410-timetextbox): Civil time editing with locale-aware text parsing.
- [`filteringSelect`](#gc-410-filteringselect): Search a closed set of local choices; Data stores the selected code.
- [`callbackSelect`](#gc-410-callbackselect): Choices supplied by a page callback.
- [`comboBox`](#gc-410-combobox): Suggestions with free text allowed.
- [`dbSelect`](#gc-410-dbselect): Remote choices through an application method or the configured Asqueel integration; the component itself supplies no database adapter.
- [`dbComboBox`](#gc-410-dbcombobox): Remote suggestions with free text; the application owns authorization and persistence.
- [`checkBoxText`](#gc-410-checkboxtext): A local multi-choice group storing the selected codes.
- [`dateCalendar`](#gc-410-datecalendar): An inline civil-date calendar.


<a id="gc-410-005"></a>
<a id="gc-410-010"></a>
Types: T text, B Boolean, L integer, R real, X structured value; other codes are TYTX. Binding: read = Data to widget; write = widget to Data; twoWay = both. A dash means no declared default/binding. None is a declared value. Constraints include enum, qualification, target and annotations. Tables describe component contracts; ordinary Source/CSS attributes are shared.


## Shared parameter contracts

Each widget below links only the shared contracts it supports. A shared name can have different types, defaults or bindings; separate rows preserve those differences.


<a id="gc-410-220"></a>
<a id="gc-410-shared-value"></a>
## Values and bindings

The value type and writeback behavior depend on the control. Use a Data pointer for binding; see [Data binding](097-data-binding.md).

Applies to: [textbox](#gc-410-textbox), [checkbox](#gc-410-checkbox), [radioButtonText](#gc-410-radiobuttontext), [textBoxArea](#gc-410-textboxarea), [passwordbox](#gc-410-passwordbox), [radioButton](#gc-410-radiobutton), [colorpicker](#gc-410-colorpicker), [horizontalSlider](#gc-410-horizontalslider), [verticalSlider](#gc-410-verticalslider), [numberTextBox](#gc-410-numbertextbox), [dateTextBox](#gc-410-datetextbox), [timeTextBox](#gc-410-timetextbox), [filteringSelect](#gc-410-filteringselect), [callbackSelect](#gc-410-callbackselect), [comboBox](#gc-410-combobox), [dbSelect](#gc-410-dbselect), [dbComboBox](#gc-410-dbcombobox), [checkBoxText](#gc-410-checkboxtext), [dateCalendar](#gc-410-datecalendar).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `value` | T or None | — | twoWay | — | [textbox](#gc-410-textbox), [radioButtonText](#gc-410-radiobuttontext), [textBoxArea](#gc-410-textboxarea), [passwordbox](#gc-410-passwordbox), [filteringSelect](#gc-410-filteringselect), [callbackSelect](#gc-410-callbackselect), [comboBox](#gc-410-combobox), [dbComboBox](#gc-410-dbcombobox), [checkBoxText](#gc-410-checkboxtext) |
| `value` | B | — | twoWay | — | [checkbox](#gc-410-checkbox) |
| `value` | B | False | twoWay | — | [radioButton](#gc-410-radiobutton) |
| `value` | T | '#000000' | twoWay | — | [colorpicker](#gc-410-colorpicker) |
| `value` | R | 0 | twoWay | — | [horizontalSlider](#gc-410-horizontalslider), [verticalSlider](#gc-410-verticalslider) |
| `value` | L / R / N or None | — | twoWay | — | [numberTextBox](#gc-410-numbertextbox) |
| `value` | D or None | — | twoWay | — | [dateTextBox](#gc-410-datetextbox), [dateCalendar](#gc-410-datecalendar) |
| `value` | H or None | — | twoWay | — | [timeTextBox](#gc-410-timetextbox) |
| `value` | T / L or None | — | twoWay | — | [dbSelect](#gc-410-dbselect) |

<a id="gc-410-225"></a>
<a id="gc-410-shared-state"></a>
## Disabled, readonly and live updates

Disabled prevents interaction; readonly preserves reading without accepting edits. live controls when edits reach Data. See [Field behavior](105-components.md#gc-105-040).

Applies to: [textbox](#gc-410-textbox), [checkbox](#gc-410-checkbox), [radioButtonText](#gc-410-radiobuttontext), [textBoxArea](#gc-410-textboxarea), [passwordbox](#gc-410-passwordbox), [radioButton](#gc-410-radiobutton), [colorpicker](#gc-410-colorpicker), [horizontalSlider](#gc-410-horizontalslider), [verticalSlider](#gc-410-verticalslider), [numberTextBox](#gc-410-numbertextbox), [dateTextBox](#gc-410-datetextbox), [timeTextBox](#gc-410-timetextbox), [filteringSelect](#gc-410-filteringselect), [callbackSelect](#gc-410-callbackselect), [comboBox](#gc-410-combobox), [dbSelect](#gc-410-dbselect), [dbComboBox](#gc-410-dbcombobox), [checkBoxText](#gc-410-checkboxtext), [dateCalendar](#gc-410-datecalendar).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `disabled` | B | False | read | — | All listed above |
| `readonly` | B | False | read | — | All listed above |
| `live` | B | False | read | — | [textbox](#gc-410-textbox), [checkbox](#gc-410-checkbox), [textBoxArea](#gc-410-textboxarea), [passwordbox](#gc-410-passwordbox), [radioButton](#gc-410-radiobutton), [colorpicker](#gc-410-colorpicker), [horizontalSlider](#gc-410-horizontalslider), [verticalSlider](#gc-410-verticalslider), [numberTextBox](#gc-410-numbertextbox), [dateTextBox](#gc-410-datetextbox), [timeTextBox](#gc-410-timetextbox), [filteringSelect](#gc-410-filteringselect), [callbackSelect](#gc-410-callbackselect), [comboBox](#gc-410-combobox), [dbSelect](#gc-410-dbselect), [dbComboBox](#gc-410-dbcombobox) |

<a id="gc-410-230"></a>
<a id="gc-410-shared-labels"></a>
## Labels and field presentation

lbl supplies a field label; lbl_position places it. The lbl_* and box_* style families are described in [Themes and CSS](096-themes-and-css.md).

Applies to: [textbox](#gc-410-textbox), [checkbox](#gc-410-checkbox), [radioButtonText](#gc-410-radiobuttontext), [textBoxArea](#gc-410-textboxarea), [passwordbox](#gc-410-passwordbox), [radioButton](#gc-410-radiobutton), [colorpicker](#gc-410-colorpicker), [horizontalSlider](#gc-410-horizontalslider), [verticalSlider](#gc-410-verticalslider), [numberTextBox](#gc-410-numbertextbox), [dateTextBox](#gc-410-datetextbox), [timeTextBox](#gc-410-timetextbox), [filteringSelect](#gc-410-filteringselect), [callbackSelect](#gc-410-callbackselect), [comboBox](#gc-410-combobox), [dbSelect](#gc-410-dbselect), [dbComboBox](#gc-410-dbcombobox), [checkBoxText](#gc-410-checkboxtext), [dateCalendar](#gc-410-datecalendar).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `lbl` | T or None | — | read | qualification="intl_str" | All listed above |
| `lbl_position` | T | 'TL' | read | enum=['TL', 'TC', 'TR', 'L', 'R', 'BL', 'BC', 'BR'] | All listed above |

<a id="gc-410-235"></a>
<a id="gc-410-shared-placeholder"></a>
## Placeholders

Placeholder text is a hint, not a value or a replacement for a field label.

Applies to: [textbox](#gc-410-textbox), [textBoxArea](#gc-410-textboxarea), [passwordbox](#gc-410-passwordbox), [numberTextBox](#gc-410-numbertextbox), [dateTextBox](#gc-410-datetextbox), [timeTextBox](#gc-410-timetextbox), [filteringSelect](#gc-410-filteringselect), [callbackSelect](#gc-410-callbackselect), [comboBox](#gc-410-combobox), [dbSelect](#gc-410-dbselect), [dbComboBox](#gc-410-dbcombobox).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `placeholder` | T | '' | — | qualification="intl_str"; target="control" | All listed above |

<a id="gc-410-240"></a>
<a id="gc-410-shared-validation"></a>
## Validation

The validate_* family belongs to the shared validation contract, not to each widget. See [Validation rules, callbacks and messages](105-components.md#gc-105-076). Rule conditions and messages use the documented _if, _iswarning, _error and _warning suffixes. For example: root.textbox(value="^customer.email", lbl="Email", validate_email=True).

Applies to: [textbox](#gc-410-textbox), [checkbox](#gc-410-checkbox), [radioButtonText](#gc-410-radiobuttontext), [textBoxArea](#gc-410-textboxarea), [passwordbox](#gc-410-passwordbox), [radioButton](#gc-410-radiobutton), [colorpicker](#gc-410-colorpicker), [horizontalSlider](#gc-410-horizontalslider), [verticalSlider](#gc-410-verticalslider), [numberTextBox](#gc-410-numbertextbox), [dateTextBox](#gc-410-datetextbox), [timeTextBox](#gc-410-timetextbox), [filteringSelect](#gc-410-filteringselect), [callbackSelect](#gc-410-callbackselect), [comboBox](#gc-410-combobox), [dbSelect](#gc-410-dbselect), [dbComboBox](#gc-410-dbcombobox), [checkBoxText](#gc-410-checkboxtext), [dateCalendar](#gc-410-datecalendar).

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

<a id="gc-410-250"></a>
<a id="gc-410-shared-formatting"></a>
## Locale and formatting

Data retains its typed value; locale and format affect presentation and parsing. workdate supplies date-editing context. See [Typed controls](105-components.md#gc-105-040).

Applies to: [numberTextBox](#gc-410-numbertextbox), [dateTextBox](#gc-410-datetextbox), [timeTextBox](#gc-410-timetextbox), [dateCalendar](#gc-410-datecalendar).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `locale` | T or None | — | read | — | All listed above |
| `format` | T or None | — | read | — | [numberTextBox](#gc-410-numbertextbox), [dateTextBox](#gc-410-datetextbox), [timeTextBox](#gc-410-timetextbox) |
| `workdate` | T or None | — | read | — | [dateTextBox](#gc-410-datetextbox), [dateCalendar](#gc-410-datecalendar) |

<a id="gc-410-300"></a>
## Text fields


<a id="gc-410-015"></a>
<a id="gc-410-textbox"></a>
### `textbox`

Single-line text with label, validation and optional live updates.

Collection: **inputs**. Browser element: `gramlot-textbox`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-410-035"></a>
<a id="gc-410-passwordbox"></a>
### `passwordbox`

Masked text entry; masking does not encrypt or persist the value.

Collection: **inputs**. Browser element: `gramlot-passwordbox`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-410-030"></a>
<a id="gc-410-textboxarea"></a>
### `textBoxArea`

Multiline plain text with the same field and validation contract.

Collection: **inputs**. Browser element: `gramlot-text-box-area`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `rows` | L | 4 | read | target="control" |
| `cols` | L | 24 | read | target="control" |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-410-305"></a>
## Choices and selectors


<a id="gc-410-020"></a>
<a id="gc-410-checkbox"></a>
### `checkbox`

Boolean value, displayed as a checkbox or a switch.

Collection: **inputs**. Browser element: `gramlot-checkbox`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Validation](#gc-410-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `mode` | T | 'checkbox' | read | enum=['checkbox', 'switch'] |
| `switch_color` | T or None | None | read | — |
| `label` | T | '' | — | qualification="intl_str"; target="optionCaption" |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-410-040"></a>
<a id="gc-410-radiobutton"></a>
### `radioButton`

One Boolean radio option; the Source-scoped group keeps its members mutually exclusive.

Collection: **inputs**. Browser element: `gramlot-radio-button`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Validation](#gc-410-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `label` | T | '' | — | qualification="intl_str"; target="optionCaption" |
| `group` | T or None | — | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-410-025"></a>
<a id="gc-410-radiobuttontext"></a>
### `radioButtonText`

A group of local radio choices storing one option code.

Collection: **inputs**. Browser element: `gramlot-radio-button-text`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Validation](#gc-410-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `values` | T | — | read | — |
| `cols` | L | 1 | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-410-100"></a>
<a id="gc-410-checkboxtext"></a>
### `checkBoxText`

A local multi-choice group storing the selected codes.

Collection: **inputs**. Browser element: `gramlot-check-box-text`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Validation](#gc-410-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `values` | T | — | read | — |
| `cols` | L | 1 | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-410-045"></a>
<a id="gc-410-colorpicker"></a>
### `colorpicker`

Browser color input, with a bound color value.

Collection: **inputs**. Browser element: `gramlot-colorpicker`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Validation](#gc-410-shared-validation).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-410-075"></a>
<a id="gc-410-filteringselect"></a>
### `filteringSelect`

Search a closed set of local choices; Data stores the selected code.

Collection: **inputs**. Browser element: `gramlot-filtering-select`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `values` | T | '' | read | — |
| `separator` | T | ',' | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-410-080"></a>
<a id="gc-410-callbackselect"></a>
### `callbackSelect`

Choices supplied by a page callback.

Collection: **inputs**. Browser element: `gramlot-callback-select`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `callback` | T | — | — | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-410-085"></a>
<a id="gc-410-combobox"></a>
### `comboBox`

Suggestions with free text allowed.

Collection: **inputs**. Browser element: `gramlot-combo-box`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `values` | T | '' | read | — |
| `separator` | T | ',' | read | — |
| `store` | X or None | None | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-410-090"></a>
<a id="gc-410-dbselect"></a>
### `dbSelect`

Remote choices through an application method or the configured Asqueel integration; the component itself supplies no database adapter.

Collection: **inputs**. Browser element: `gramlot-db-select`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `dbtable` | T | — | read | — |
| `caption_field` | T | — | read | — |
| `condition` | T | — | read | — |
| `weakCondition` | B / T | False | read | — |
| `method` | T | 'dbSelect' | read | — |
| `columns` | T | — | read | — |
| `hiddenColumns` | T | — | read | — |
| `auxColumns` | T | — | read | — |
| `template` | T | — | read | — |
| `templateNull` | T | '' | read | — |
| `order_by` | T | — | read | — |
| `limit` | L | 10 | read | — |
| `searchDelay` | L | 300 | read | — |
| `ignoreCase` | B | True | read | — |
| `hasDownArrow` | B | True | read | — |
| `emptyLabel` | T | 'Clear selection' | read | qualification="intl_str" |
| `selectedCaption` | T | — | — | — |
| `selectedRecord` | T | — | — | — |
| `selectedCb` | T | — | — | — |
| `autoSelect` | B | False | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-410-095"></a>
<a id="gc-410-dbcombobox"></a>
### `dbComboBox`

Remote suggestions with free text; the application owns authorization and persistence.

Collection: **inputs**. Browser element: `gramlot-db-combo-box`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `dbtable` | T | — | read | — |
| `caption_field` | T | — | read | — |
| `condition` | T | — | read | — |
| `weakCondition` | B / T | False | read | — |
| `method` | T | 'dbSelect' | read | — |
| `columns` | T | — | read | — |
| `hiddenColumns` | T | — | read | — |
| `auxColumns` | T | — | read | — |
| `template` | T | — | read | — |
| `templateNull` | T | '' | read | — |
| `order_by` | T | — | read | — |
| `limit` | L | 10 | read | — |
| `searchDelay` | L | 300 | read | — |
| `ignoreCase` | B | True | read | — |
| `hasDownArrow` | B | True | read | — |
| `emptyLabel` | T | 'Clear selection' | read | qualification="intl_str" |
| `selectedCaption` | T | — | — | — |
| `selectedRecord` | T | — | — | — |
| `selectedCb` | T | — | — | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-410-310"></a>
## Numbers, dates and time


<a id="gc-410-060"></a>
<a id="gc-410-numbertextbox"></a>
### `numberTextBox`

Locale-aware numeric editing; Data keeps the declared numeric type.

Collection: **inputs**. Browser element: `gramlot-number-text-box`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation), [Locale and formatting](#gc-410-shared-formatting).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `dtype` | T | 'R' | — | — |
| `min` | R or None | — | read | — |
| `max` | R or None | — | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-410-050"></a>
<a id="gc-410-horizontalslider"></a>
### `horizontalSlider`

A bounded numeric range displayed horizontally.

Collection: **inputs**. Browser element: `gramlot-horizontal-slider`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Validation](#gc-410-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `min` | R | 0 | read | target="control" |
| `max` | R | 100 | read | target="control" |
| `step` | R | 1 | read | target="control" |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-410-055"></a>
<a id="gc-410-verticalslider"></a>
### `verticalSlider`

A bounded numeric range displayed vertically.

Collection: **inputs**. Browser element: `gramlot-vertical-slider`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Validation](#gc-410-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `min` | R | 0 | read | target="control" |
| `max` | R | 100 | read | target="control" |
| `step` | R | 1 | read | target="control" |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-410-065"></a>
<a id="gc-410-datetextbox"></a>
### `dateTextBox`

Civil date editing with an optional calendar popup.

Collection: **inputs**. Browser element: `gramlot-date-text-box`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation), [Locale and formatting](#gc-410-shared-formatting).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `calendar` | B | True | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-410-105"></a>
<a id="gc-410-datecalendar"></a>
### `dateCalendar`

An inline civil-date calendar.

Collection: **inputs**. Browser element: `gramlot-date-calendar`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Validation](#gc-410-shared-validation), [Locale and formatting](#gc-410-shared-formatting).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-410-070"></a>
<a id="gc-410-timetextbox"></a>
### `timeTextBox`

Civil time editing with locale-aware text parsing.

Collection: **inputs**. Browser element: `gramlot-time-text-box`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation), [Locale and formatting](#gc-410-shared-formatting).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-410-320"></a>
## Forms and containers


<a id="gc-410-355"></a>
<a id="gc-410-editingstatus"></a>
### `editingStatus`

Changes and validation feedback from the nearest Source form state.

Collection: **inputs**. Browser element: `gramlot-editing-status`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.
