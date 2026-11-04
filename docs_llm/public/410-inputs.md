# Inputs

Document ID: **GC-410**.

<a id="gc-410-start"></a>
## Start here

Use a component when you need typed values, shared labels, validation or choices. Use `html_input` when you want the native HTML tag. Both participate in Source/Data bindings; a component adds its own parameter and editing contract.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-inputs).

`^` paths are relative to the containing datapath when they start with a dot. Put interface defaults in `default`; load record values into Data. Do not rebuild a control when its value changes.

For typed fields, incomplete text belongs to Source editing state; Data retains the last typed value. A parseable value can be invalid under validation rules: the form tracks the error and blocks saving. See [form editing state](340-components-and-collections-guide.md#gc-340-110) and [field behavior](105-components.md#gc-105-040).

`dbSelect` and `dbComboBox` describe remote choices, not a built-in database. The generic `method` contract uses an application endpoint; Asqueel query capabilities require its server integration. A file-only export cannot execute Python endpoints or provide a database integration; a JavaScript Worker endpoint may supply its own values.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)


<a id="gc-410-005"></a>
<a id="gc-410-010"></a>

Ordinary Source/CSS attributes remain in Writing pages and Themes and CSS.
Pages inherit environment collections; Page.gramlots adds missing ones. Buttons are built in.
Contract JSON omits only undeclared keys: no default is not the same as null. dtype: T text, B Boolean, L integer, R real, X structured value; remaining codes are TYTX. binding: read = Data to widget, write = widget to Data, twoWay = both. nullable permits None; enum restricts values; annotation preserves type/regex constraints. Parameters sharing a table row have exactly the same contract. Child grammar: * allows arbitrary Source children; empty permits none. Parent None means no declared restriction.


<a id="gc-410-220"></a>
<a id="gc-410-shared-value"></a>
## Values and bindings

The value type and writeback behavior depend on the control. Use a Data pointer for binding; see [Data binding](097-data-binding.md).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `value` | `{"binding":"twoWay","dtype":"T","nullable":true}` | textbox, radioButtonText, textBoxArea, passwordbox, filteringSelect, callbackSelect, comboBox, dbComboBox, checkBoxText |
| `value` | `{"binding":"twoWay","dtype":"B"}` | checkbox |
| `value` | `{"binding":"twoWay","default":false,"dtype":"B"}` | radioButton |
| `value` | `{"binding":"twoWay","default":"#000000","dtype":"T"}` | colorpicker |
| `value` | `{"binding":"twoWay","default":0,"dtype":"R"}` | horizontalSlider, verticalSlider |
| `value` | `{"binding":"twoWay","dtype":["L","R","N"],"nullable":true}` | numberTextBox |
| `value` | `{"binding":"twoWay","dtype":"D","nullable":true}` | dateTextBox, dateCalendar |
| `value` | `{"binding":"twoWay","dtype":"H","nullable":true}` | timeTextBox |
| `value` | `{"binding":"twoWay","dtype":["T","L"],"nullable":true}` | dbSelect |

<a id="gc-410-225"></a>
<a id="gc-410-shared-state"></a>
## Disabled, readonly and live updates

Disabled prevents interaction; readonly preserves reading without accepting edits. live controls when edits reach Data. See [Field behavior](105-components.md#gc-105-040).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `disabled, readonly` | `{"binding":"read","default":false,"dtype":"B"}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar |
| `live` | `{"binding":"read","default":false,"dtype":"B"}` | textbox, checkbox, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox |

<a id="gc-410-230"></a>
<a id="gc-410-shared-labels"></a>
## Labels and field presentation

lbl supplies a field label; lbl_position places it. The lbl_* and box_* style families are described in [Themes and CSS](096-themes-and-css.md).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `lbl` | `{"binding":"read","dtype":"T","nullable":true,"qualification":"intl_str"}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar |
| `lbl_position` | `{"binding":"read","default":"TL","dtype":"T","enum":["TL","TC","TR","L","R","BL","BC","BR"]}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar |

<a id="gc-410-235"></a>
<a id="gc-410-shared-placeholder"></a>
## Placeholders

Placeholder text is a hint, not a value or a replacement for a field label.

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `placeholder` | `{"default":"","dtype":"T","qualification":"intl_str","target":"control"}` | textbox, textBoxArea, passwordbox, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox |

<a id="gc-410-240"></a>
<a id="gc-410-shared-validation"></a>
## Validation

The validate_* family belongs to the shared validation contract, not to each widget. See [Validation rules, callbacks and messages](105-components.md#gc-105-076). Rule conditions and messages use the documented _if, _iswarning, _error and _warning suffixes. For example: root.textbox(value="^customer.email", lbl="Email", validate_email=True).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `validate_select, validate_email, validate_select_iswarning, validate_notnull_iswarning, validate_empty_iswarning, validate_case_iswarning, validate_len_iswarning, validate_min_iswarning, validate_max_iswarning, validate_email_iswarning, validate_regex_iswarning, validate_call_iswarning, validate_remote_iswarning` | `{"binding":"read","dtype":"B","nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar |
| `validate_notnull` | `{"binding":"read","default":false,"dtype":"B","nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar |
| `validate_empty, validate_min, validate_max` | `{"binding":"read","dtype":["T","L","N","R","B","D","H","DH","DHZ"],"nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar |
| `validate_case` | `{"binding":"read","dtype":"T","enum":["upper","lower","title","capitalize","u","l","t","c"],"nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar |
| `validate_len, validate_regex, validate_remote` | `{"binding":"read","dtype":"T","nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar |
| `validate_call, validate_onAccept, validate_onReject, validate__onResult` | `{"dtype":"T","nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar |
| `validate_timeout` | `{"binding":"read","dtype":"L","nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar |
| `validate_select_if, validate_notnull_if, validate_empty_if, validate_case_if, validate_len_if, validate_min_if, validate_max_if, validate_email_if, validate_regex_if, validate_call_if, validate_remote_if` | `{"dtype":["T","B"],"nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar |
| `validate_select_error, validate_select_warning, validate_notnull_error, validate_notnull_warning, validate_empty_error, validate_empty_warning, validate_case_error, validate_case_warning, validate_len_error, validate_len_warning, validate_min_error, validate_min_warning, validate_max_error, validate_max_warning, validate_email_error, validate_email_warning, validate_regex_error, validate_regex_warning, validate_call_error, validate_call_warning, validate_remote_error, validate_remote_warning` | `{"binding":"read","dtype":"T","nullable":true,"qualification":"intl_str"}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar |

<a id="gc-410-250"></a>
<a id="gc-410-shared-formatting"></a>
## Locale and formatting

Data retains its typed value; locale and format affect presentation and parsing. workdate supplies date-editing context. See [Typed controls](105-components.md#gc-105-040).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `locale` | `{"binding":"read","dtype":"T","nullable":true}` | numberTextBox, dateTextBox, timeTextBox, dateCalendar |
| `format` | `{"binding":"read","dtype":"T","nullable":true}` | numberTextBox, dateTextBox, timeTextBox |
| `workdate` | `{"binding":"read","dtype":"T","nullable":true}` | dateTextBox, dateCalendar |

<a id="gc-410-300"></a>
## Text fields


<a id="gc-410-015"></a>
<a id="gc-410-textbox"></a>
### `textbox`

Collection: inputs. Single-line text with label, validation and optional live updates.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-textbox).


**Data contract.** A nullable two-way string. Null displays as empty, while clearing an edited field writes an empty string.


**Interaction and events.** Change commits the string. With `live=True`, input commits outside IME composition. There is no component-specific change callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** Single-line plain text. Outside an editing session, rejected validation can leave a visible draft while Data retains its previous value. In a shared editing session, parseable edits can update Data while validation records errors and blocks acceptance.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-035"></a>
<a id="gc-410-passwordbox"></a>
### `passwordbox`

Collection: inputs. Masked text entry; masking does not encrypt or persist the value.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-passwordbox).


**Data contract.** A nullable two-way string. The native password control masks its display while the binding carries the entered string.


**Interaction and events.** Change commits the string. With `live=True`, input commits outside IME composition. There is no component-specific change callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** The component supplies visual masking. Credential handling and storage remain application responsibilities.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-030"></a>
<a id="gc-410-textboxarea"></a>
### `textBoxArea`

Collection: inputs. Multiline plain text with the same field and validation contract.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-textboxarea).


**Data contract.** A nullable two-way string can include line breaks. Reactive row and column counts change the presentation of the same Data.


**Interaction and events.** Change commits the string. With `live=True`, input commits outside IME composition. There is no component-specific change callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** The textarea handles plain text. Changing the row count preserves the existing control and caret.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation).


| Parameters | Contract |
| --- | --- |
| `rows` | `{"binding":"read","default":4,"dtype":"L","target":"control"}` |
| `cols` | `{"binding":"read","default":24,"dtype":"L","target":"control"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-305"></a>
## Choices and selectors


<a id="gc-410-020"></a>
<a id="gc-410-checkbox"></a>
### `checkbox`

Collection: inputs. Boolean value, displayed as a checkbox or a switch.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-checkbox).


**Data contract.** A two-way Boolean is shared by checkbox and switch modes. The option caption and switch color affect presentation.


**Interaction and events.** Changing the checked state commits a Boolean. There is no component-specific toggle callback.


**Composition.** A field leaf. Use `label` for the inline option caption and `lbl` for the shared field label.


**Limits and lifecycle.** Only `checkbox` and `switch` are valid modes. Readonly prevents activation while external Data can still update the check.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Validation](#gc-410-shared-validation).


| Parameters | Contract |
| --- | --- |
| `mode` | `{"binding":"read","default":"checkbox","dtype":"T","enum":["checkbox","switch"]}` |
| `switch_color` | `{"binding":"read","default":null,"dtype":"T","nullable":true}` |
| `label` | `{"default":"","dtype":"T","qualification":"intl_str","target":"optionCaption"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-040"></a>
<a id="gc-410-radiobutton"></a>
### `radioButton`

Collection: inputs. One Boolean radio option; the Source-scoped group keeps its members mutually exclusive.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-radiobutton).


**Data contract.** Each member owns a two-way Boolean path. Selecting a member of a Source-scoped group clears the other members' Boolean values.


**Interaction and events.** Native activation and group keyboard navigation select a member. Writes go through the member bindings. There is no component-specific group callback.


**Composition.** A field leaf. Declare group members as separate Source nodes with their own labels and bindings.


**Limits and lifecycle.** Use `disabled` to lock interaction. Removing a member releases its group membership.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Validation](#gc-410-shared-validation).


| Parameters | Contract |
| --- | --- |
| `label` | `{"default":"","dtype":"T","qualification":"intl_str","target":"optionCaption"}` |
| `group` | `{"binding":"read","dtype":"T","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-025"></a>
<a id="gc-410-radiobuttontext"></a>
### `radioButtonText`

Collection: inputs. A group of local radio choices storing one option code.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-radiobuttontext).


**Data contract.** A nullable string stores the selected code from the `code:Caption` pairs in `values`.


**Interaction and events.** A native radio change commits the code. There is no component-specific selection callback.


**Composition.** The field generates options from `values` and arranges them in `cols` columns. It takes no Source option children.


**Limits and lifecycle.** The column count must be positive. Readonly and disabled lock the options. Caption updates can retain the selected code.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Validation](#gc-410-shared-validation).


| Parameters | Contract |
| --- | --- |
| `values` | `{"binding":"read","dtype":"T"}` |
| `cols` | `{"binding":"read","default":1,"dtype":"L"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-100"></a>
<a id="gc-410-checkboxtext"></a>
### `checkBoxText`

Collection: inputs. A local multi-choice group storing the selected codes.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-checkboxtext).


**Data contract.** A nullable string stores comma-separated codes, or null for no selection. Editing preserves the order of retained codes and appends newly selected ones.


**Interaction and events.** A native check change commits the code list. Arrows, Home and End move focus among options. There is no component-specific selection callback.


**Composition.** The field generates inline options from `values` and arranges them in `cols` columns. It takes no Source option children.


**Limits and lifecycle.** The column count must be positive. Readonly and disabled lock the options. An edit preserves stored codes that have no current visible option.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Validation](#gc-410-shared-validation).


| Parameters | Contract |
| --- | --- |
| `values` | `{"binding":"read","dtype":"T"}` |
| `cols` | `{"binding":"read","default":1,"dtype":"L"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-045"></a>
<a id="gc-410-colorpicker"></a>
### `colorpicker`

Collection: inputs. Browser color input, with a bound color value.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-colorpicker).


**Data contract.** A two-way color string projects to a native color input, with `#000000` as the component default.


**Interaction and events.** The native chooser commits on change, or on input with `live=True`. There is no component-specific color callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** The browser supplies the chooser and its accepted color representation. Use `disabled` to lock it.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Validation](#gc-410-shared-validation).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-075"></a>
<a id="gc-410-filteringselect"></a>
### `filteringSelect`

Collection: inputs. Search a closed set of local choices; Data stores the selected code.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-filteringselect).


**Data contract.** A nullable string code resolves to a caption in local `values`. Search matches captions case-insensitively and identity lookup compares codes.


**Interaction and events.** Mouse or keyboard choice commits the code. Clearing commits null and Escape cancels the draft. There is no component-specific selection callback.


**Composition.** The control builds its own popup. Declare choices through the provider, with no Source option children.


**Limits and lifecycle.** An unmatched caption remains a draft even in live mode. Codes must be nonempty and unique. `separator` changes the delimiter between declared options.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation).


| Parameters | Contract |
| --- | --- |
| `values` | `{"binding":"read","default":"","dtype":"T"}` |
| `separator` | `{"binding":"read","default":",","dtype":"T"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-080"></a>
<a id="gc-410-callbackselect"></a>
### `callbackSelect`

Collection: inputs. Choices supplied by a page callback.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-callbackselect).


**Data contract.** A nullable string code. The named browser Logic provider returns `{rows, identifier, caption}` with unique nonempty string codes and string captions.


**Interaction and events.** The provider receives `_querystring` or `_id` and can return a Promise. Mouse or keyboard choice commits the code. There is no component-specific selection notification.


**Composition.** The control builds its own popup. Declare choices through the provider, with no Source option children.


**Limits and lifecycle.** The provider owns filtering. The editor discards obsolete results on superseding edits and release and reports lookup failures in its choice error state.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation).


| Parameters | Contract |
| --- | --- |
| `callback` | `{"dtype":"T"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-085"></a>
<a id="gc-410-combobox"></a>
### `comboBox`

Collection: inputs. Suggestions with free text allowed.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-combobox).


**Data contract.** A nullable string stores the entered text or selected caption. Supply `values` (which may be empty) or a `store` Bag whose node values are unique string codes and whose `caption` attributes are strings.


**Interaction and events.** Mouse or keyboard choice commits the caption. Free text also commits through the editor, including live input outside composition. There is no component-specific selection callback.


**Composition.** The control builds its own popup. Declare choices through the provider, with no Source option children.


**Limits and lifecycle.** The bound value distinguishes null from an edited empty string. Malformed or duplicate Bag choices are rejected.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation).


| Parameters | Contract |
| --- | --- |
| `values` | `{"binding":"read","default":"","dtype":"T"}` |
| `separator` | `{"binding":"read","default":",","dtype":"T"}` |
| `store` | `{"binding":"read","default":null,"dtype":"X","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-090"></a>
<a id="gc-410-dbselect"></a>
### `dbSelect`

Collection: inputs. Remote choices through an application method or the configured Asqueel integration; the component itself supplies no database adapter.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-dbselect).


**Data contract.** A nullable string or safe integer key identifies the selection. The endpoint returns `{rows, identifier, caption}`. Caption, record and requested `selected_*` projections are separate from the key.


**Interaction and events.** The page's remote service uses `method` for searches and identity lookup. Accepted selection writes the outputs and calls optional named Logic `selectedCb` with `{value, record}`. Identity resolution can refresh outputs without notifying that callback.


**Composition.** A field leaf with an internal popup. Its optional sanitized row template supports record placeholders in text.


**Limits and lifecycle.** Unmatched drafts cannot write a key. `autoSelect` checks for a sole candidate with a two-row request. Selections using `validate_notnull` have a condition-change check. Database behavior and required response fields belong to the provider.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation).


| Parameters | Contract |
| --- | --- |
| `dbtable, caption_field, condition, columns, hiddenColumns, auxColumns, template, order_by` | `{"binding":"read","dtype":"T"}` |
| `weakCondition` | `{"binding":"read","default":false,"dtype":["B","T"]}` |
| `method` | `{"binding":"read","default":"dbSelect","dtype":"T"}` |
| `templateNull` | `{"binding":"read","default":"","dtype":"T"}` |
| `limit` | `{"binding":"read","default":10,"dtype":"L"}` |
| `searchDelay` | `{"binding":"read","default":300,"dtype":"L"}` |
| `ignoreCase, hasDownArrow` | `{"binding":"read","default":true,"dtype":"B"}` |
| `emptyLabel` | `{"binding":"read","default":"Clear selection","dtype":"T","qualification":"intl_str"}` |
| `selectedCaption, selectedRecord, selectedCb` | `{"dtype":"T"}` |
| `autoSelect` | `{"binding":"read","default":false,"dtype":"B"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-095"></a>
<a id="gc-410-dbcombobox"></a>
### `dbComboBox`

Collection: inputs. Remote suggestions with free text; the application owns authorization and persistence.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-dbcombobox).


**Data contract.** A nullable string stores a selected caption or free text. Selection can populate caption, record and field projections. Free-text or clear commits remove the previous selection outputs.


**Interaction and events.** The remote service supplies suggestions. Choosing a row or committing free text goes through validation. Optional named Logic `selectedCb` receives the accepted value and a record or null.


**Composition.** A field leaf with an internal suggestion popup and optional sanitized row template.


**Limits and lifecycle.** The editor waits for a complete edit even with `live=True`. Condition changes preserve free text and do not auto-select a sole candidate. The provider runs in the configured host.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation).


| Parameters | Contract |
| --- | --- |
| `dbtable, caption_field, condition, columns, hiddenColumns, auxColumns, template, order_by` | `{"binding":"read","dtype":"T"}` |
| `weakCondition` | `{"binding":"read","default":false,"dtype":["B","T"]}` |
| `method` | `{"binding":"read","default":"dbSelect","dtype":"T"}` |
| `templateNull` | `{"binding":"read","default":"","dtype":"T"}` |
| `limit` | `{"binding":"read","default":10,"dtype":"L"}` |
| `searchDelay` | `{"binding":"read","default":300,"dtype":"L"}` |
| `ignoreCase, hasDownArrow` | `{"binding":"read","default":true,"dtype":"B"}` |
| `emptyLabel` | `{"binding":"read","default":"Clear selection","dtype":"T","qualification":"intl_str"}` |
| `selectedCaption, selectedRecord, selectedCb` | `{"dtype":"T"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-310"></a>
## Numbers, dates and time


<a id="gc-410-060"></a>
<a id="gc-410-numbertextbox"></a>
### `numberTextBox`

Collection: inputs. Locale-aware numeric editing; Data keeps the declared numeric type.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-numbertextbox).


**Data contract.** A nullable typed number. Use the default finite real entry, `dtype='L'` for safe integers or `dtype='N'` for exact Decimal entry. Empty input commits null.


**Interaction and events.** Enter, change and blur attempt a commit. Live editing commits parseable input. Escape restores the accepted value. There is no component-specific change callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** Entry accepts the locale decimal symbol but rejects grouping separators, incomplete numbers and input outside configured bounds. Exact editing requires a Decimal backend and also follows an existing Decimal value. A rejected parse leaves the last typed Data value in place.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation), [Locale and formatting](#gc-410-shared-formatting).


| Parameters | Contract |
| --- | --- |
| `dtype` | `{"default":"R","dtype":"T"}` |
| `min, max` | `{"binding":"read","dtype":"R","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-050"></a>
<a id="gc-410-horizontalslider"></a>
### `horizontalSlider`

Collection: inputs. A bounded numeric range displayed horizontally.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-horizontalslider).


**Data contract.** A two-way real number uses the native range grid defined by reactive `min`, `max` and `step`.


**Interaction and events.** Native range interaction commits on change, or on input with `live=True`. There is no component-specific slider callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** A finite incoming value that the range clamps or snaps can write a correction through a plain reactive value binding. Shared controls need compatible ranges. Use `disabled` to lock it.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Validation](#gc-410-shared-validation).


| Parameters | Contract |
| --- | --- |
| `min` | `{"binding":"read","default":0,"dtype":"R","target":"control"}` |
| `max` | `{"binding":"read","default":100,"dtype":"R","target":"control"}` |
| `step` | `{"binding":"read","default":1,"dtype":"R","target":"control"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-055"></a>
<a id="gc-410-verticalslider"></a>
### `verticalSlider`

Collection: inputs. A bounded numeric range displayed vertically.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-verticalslider).


**Data contract.** A two-way real number uses the same range grid as the horizontal slider.


**Interaction and events.** Native range interaction commits on change, or on input with `live=True`. There is no component-specific slider callback.


**Composition.** A field leaf with an internal range that exposes a vertical accessibility orientation.


**Limits and lifecycle.** Browser range rules can clamp or snap incoming finite Data and write the correction through a plain reactive value binding. Use `disabled` to lock it.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Validation](#gc-410-shared-validation).


| Parameters | Contract |
| --- | --- |
| `min` | `{"binding":"read","default":0,"dtype":"R","target":"control"}` |
| `max` | `{"binding":"read","default":100,"dtype":"R","target":"control"}` |
| `step` | `{"binding":"read","default":1,"dtype":"R","target":"control"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-065"></a>
<a id="gc-410-datetextbox"></a>
### `dateTextBox`

Collection: inputs. Civil date editing with an optional calendar popup.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-datetextbox).


**Data contract.** A nullable civil date (`D`). Formatting and text drafts are separate from Data. Relative entry uses `workdate` or local today as its reference.


**Interaction and events.** Enter, change and blur attempt a commit. Live mode commits parseable input, and selecting a calendar day commits the typed date directly. Escape cancels the draft. There is no component-specific date callback.


**Composition.** A field leaf with an internal trigger and popup unless `calendar=False`.


**Limits and lifecycle.** The parser requires a single date. Empty input commits null, while an invalid expression preserves the typed value. Disabling the calendar or releasing the editor closes its popup.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation), [Locale and formatting](#gc-410-shared-formatting).


| Parameters | Contract |
| --- | --- |
| `calendar` | `{"binding":"read","default":true,"dtype":"B"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-105"></a>
<a id="gc-410-datecalendar"></a>
### `dateCalendar`

Collection: inputs. An inline civil-date calendar.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-datecalendar).


**Data contract.** A two-way nullable civil date (`D`). `workdate` can supply the reference day for the calendar view.


**Interaction and events.** Month and keyboard navigation move the view or focus without a Data write. Selecting a day or using Clear commits a date or null. There is no component-specific day callback.


**Composition.** An inline field leaf with internal navigation, day grid and clear control.


**Limits and lifecycle.** Readonly and disabled lock interaction. The control checks for civil dates and locks its view when released.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Validation](#gc-410-shared-validation), [Locale and formatting](#gc-410-shared-formatting).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-070"></a>
<a id="gc-410-timetextbox"></a>
### `timeTextBox`

Collection: inputs. Civil time editing with locale-aware text parsing.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-timetextbox).


**Data contract.** A nullable civil time (`H`) uses the TYTX time epoch and preserves seconds and milliseconds without a timezone conversion. Clearing commits null.


**Interaction and events.** Enter, change and blur attempt a commit. Live editing commits parseable input. Escape restores the accepted value. There is no component-specific change callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** Entry uses a 24-hour clock with minutes, optional seconds and optional fractional seconds. Display formats leave the entry grammar unchanged.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation), [Locale and formatting](#gc-410-shared-formatting).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-320"></a>
## Forms and containers


<a id="gc-410-355"></a>
<a id="gc-410-editingstatus"></a>
### `editingStatus`

Collection: inputs. Changes and validation feedback from the nearest Source form state.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-editingstatus).


**Data contract.** Reads the nearest shared editing session's errors and baseline-relative changes. It declares no value binding or separate change journal.


**Interaction and events.** Errors and Changes open live reports. Selecting an entry asks the session to focus the Data path and closes the report on success. There is no public report callback.


**Composition.** Place this leaf within a Source scope that provides a shared editing session. Its internal report controls take no Source children.


**Limits and lifecycle.** Mounting without a session raises an error. A field that cannot be focused leaves a notice without changing the grid filter. Disconnecting releases the session subscription and closes the popup.

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.
