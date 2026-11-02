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

`dbSelect` and `dbComboBox` describe remote choices, not a built-in database. The generic `method` contract uses an application endpoint; Asqueel query capabilities require its server integration. They are not available in a file-only export without a server.

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

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-035"></a>
<a id="gc-410-passwordbox"></a>
### `passwordbox`

Collection: inputs. Masked text entry; masking does not encrypt or persist the value.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-030"></a>
<a id="gc-410-textboxarea"></a>
### `textBoxArea`

Collection: inputs. Multiline plain text with the same field and validation contract.

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

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Validation](#gc-410-shared-validation).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-075"></a>
<a id="gc-410-filteringselect"></a>
### `filteringSelect`

Collection: inputs. Search a closed set of local choices; Data stores the selected code.

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

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation).


| Parameters | Contract |
| --- | --- |
| `callback` | `{"dtype":"T"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-085"></a>
<a id="gc-410-combobox"></a>
### `comboBox`

Collection: inputs. Suggestions with free text allowed.

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

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation), [Locale and formatting](#gc-410-shared-formatting).


| Parameters | Contract |
| --- | --- |
| `calendar` | `{"binding":"read","default":true,"dtype":"B"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-105"></a>
<a id="gc-410-datecalendar"></a>
### `dateCalendar`

Collection: inputs. An inline civil-date calendar.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Validation](#gc-410-shared-validation), [Locale and formatting](#gc-410-shared-formatting).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-070"></a>
<a id="gc-410-timetextbox"></a>
### `timeTextBox`

Collection: inputs. Civil time editing with locale-aware text parsing.

Shared contracts: [Values and bindings](#gc-410-shared-value), [Disabled, readonly and live updates](#gc-410-shared-state), [Labels and field presentation](#gc-410-shared-labels), [Placeholders](#gc-410-shared-placeholder), [Validation](#gc-410-shared-validation), [Locale and formatting](#gc-410-shared-formatting).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-410-320"></a>
## Forms and containers


<a id="gc-410-355"></a>
<a id="gc-410-editingstatus"></a>
### `editingStatus`

Collection: inputs. Changes and validation feedback from the nearest Source form state.

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.
