# Widget and parameter reference

Document ID: **GC-345**.

Grouped by purpose; shared parameters are documented once. The full counterpart
and this compact view both preserve types, defaults, bindings and child contracts.
Development reference; no maturity or release acceptance is implied.

<a id="gc-345-005"></a>
<a id="gc-345-010"></a>

Ordinary Source/CSS attributes remain in Writing pages and Themes and CSS.
Pages inherit environment collections; Page.gramlots adds missing ones. Buttons are built in.
Contract JSON omits only undeclared keys: no default is not the same as null. dtype: T text, B Boolean, L integer, R real, X structured value; remaining codes are TYTX. binding: read = Data to widget, write = widget to Data, twoWay = both. nullable permits None; enum restricts values; annotation preserves type/regex constraints. Parameters sharing a table row have exactly the same contract. Child grammar: * allows arbitrary Source children; empty permits none. Parent None means no declared restriction.


<a id="gc-345-220"></a>
<a id="gc-345-shared-value"></a>
## Values and bindings

The value type and writeback behavior depend on the control. Use a Data pointer for binding; see [Data binding](097-data-binding.md).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `value` | `{"binding":"twoWay","dtype":"T","nullable":true}` | textbox, radioButtonText, textBoxArea, passwordbox, filteringSelect, callbackSelect, comboBox, dbComboBox, checkBoxText |
| `value` | `{"binding":"twoWay","dtype":"B"}` | checkbox |
| `value` | `{"binding":"twoWay","default":false,"dtype":"B"}` | radioButton, toggleButton |
| `value` | `{"binding":"twoWay","default":"#000000","dtype":"T"}` | colorpicker |
| `value` | `{"binding":"twoWay","default":0,"dtype":"R"}` | horizontalSlider, verticalSlider |
| `value` | `{"binding":"twoWay","dtype":["L","R","N"],"nullable":true}` | numberTextBox |
| `value` | `{"binding":"twoWay","dtype":"D","nullable":true}` | dateTextBox, dateCalendar |
| `value` | `{"binding":"twoWay","dtype":"H","nullable":true}` | timeTextBox |
| `value` | `{"binding":"twoWay","dtype":["T","L"],"nullable":true}` | dbSelect |
| `value` | `{"binding":"twoWay","default":"","dtype":"T"}` | codeMirror, htmlEditor, markdownEditor |
| `value` | `{"binding":"read","default":"","dtype":"T"}` | htmlPreview, markdownPreview, typstPreview |
| `value` | `{"binding":"twoWay","default":null,"dtype":"T","nullable":true}` | imageUploader |

<a id="gc-345-225"></a>
<a id="gc-345-shared-state"></a>
## Disabled, readonly and live updates

Disabled prevents interaction; readonly preserves reading without accepting edits. live controls when edits reach Data. See [Field behavior](105-components.md#gc-105-040).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `disabled` | `{"binding":"read","default":false,"dtype":"B"}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, button, toggleButton, dropDownButton, menuline, codeMirror, htmlEditor, markdownEditor, uploader, imageUploader, attachmentManager |
| `readonly` | `{"binding":"read","default":false,"dtype":"B"}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, toggleButton, codeMirror, htmlEditor, markdownEditor |
| `live` | `{"binding":"read","default":false,"dtype":"B"}` | textbox, checkbox, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox |
| `live` | `{"binding":"read","default":true,"dtype":"B"}` | codeMirror, htmlEditor, markdownEditor |

<a id="gc-345-230"></a>
<a id="gc-345-shared-labels"></a>
## Labels and field presentation

lbl supplies a field label; lbl_position places it. The lbl_* and box_* style families are described in [Themes and CSS](096-themes-and-css.md).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `lbl` | `{"binding":"read","dtype":"T","nullable":true,"qualification":"intl_str"}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, groupBox, codeMirror, htmlEditor, markdownEditor |
| `lbl_position` | `{"binding":"read","default":"TL","dtype":"T","enum":["TL","TC","TR","L","R","BL","BC","BR"]}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, groupBox, codeMirror, htmlEditor, markdownEditor |

<a id="gc-345-235"></a>
<a id="gc-345-shared-placeholder"></a>
## Placeholders

Placeholder text is a hint, not a value or a replacement for a field label.

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `placeholder` | `{"default":"","dtype":"T","qualification":"intl_str","target":"control"}` | textbox, textBoxArea, passwordbox, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox |

<a id="gc-345-240"></a>
<a id="gc-345-shared-validation"></a>
## Validation

The validate_* family belongs to the shared validation contract, not to each widget. See [Validation rules, callbacks and messages](105-components.md#gc-105-076). Rule conditions and messages use the documented _if, _iswarning, _error and _warning suffixes. For example: root.textbox(value="^customer.email", lbl="Email", validate_email=True).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `validate_select, validate_email, validate_select_iswarning, validate_notnull_iswarning, validate_empty_iswarning, validate_case_iswarning, validate_len_iswarning, validate_min_iswarning, validate_max_iswarning, validate_email_iswarning, validate_regex_iswarning, validate_call_iswarning, validate_remote_iswarning` | `{"binding":"read","dtype":"B","nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, codeMirror, htmlEditor, markdownEditor |
| `validate_notnull` | `{"binding":"read","default":false,"dtype":"B","nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, codeMirror, htmlEditor, markdownEditor |
| `validate_empty, validate_min, validate_max` | `{"binding":"read","dtype":["T","L","N","R","B","D","H","DH","DHZ"],"nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, codeMirror, htmlEditor, markdownEditor |
| `validate_case` | `{"binding":"read","dtype":"T","enum":["upper","lower","title","capitalize","u","l","t","c"],"nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, codeMirror, htmlEditor, markdownEditor |
| `validate_len, validate_regex, validate_remote` | `{"binding":"read","dtype":"T","nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, codeMirror, htmlEditor, markdownEditor |
| `validate_call, validate_onAccept, validate_onReject, validate__onResult` | `{"dtype":"T","nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, codeMirror, htmlEditor, markdownEditor |
| `validate_timeout` | `{"binding":"read","dtype":"L","nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, codeMirror, htmlEditor, markdownEditor |
| `validate_select_if, validate_notnull_if, validate_empty_if, validate_case_if, validate_len_if, validate_min_if, validate_max_if, validate_email_if, validate_regex_if, validate_call_if, validate_remote_if` | `{"dtype":["T","B"],"nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, codeMirror, htmlEditor, markdownEditor |
| `validate_select_error, validate_select_warning, validate_notnull_error, validate_notnull_warning, validate_empty_error, validate_empty_warning, validate_case_error, validate_case_warning, validate_len_error, validate_len_warning, validate_min_error, validate_min_warning, validate_max_error, validate_max_warning, validate_email_error, validate_email_warning, validate_regex_error, validate_regex_warning, validate_call_error, validate_call_warning, validate_remote_error, validate_remote_warning` | `{"binding":"read","dtype":"T","nullable":true,"qualification":"intl_str"}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, codeMirror, htmlEditor, markdownEditor |

<a id="gc-345-245"></a>
<a id="gc-345-shared-icons"></a>
## Icons and label presentation

icon holds text or an emoji; iconSrc loads an image such as SVG. iconSize sizes the icon; labelPosition controls label presentation on menus and toolbars. See [Menus and toolbars](350-menus-toolbars-and-windows.md).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `icon, iconSrc` | `{"binding":"read","default":"","dtype":"T"}` | button, toggleButton, dropDownButton, menuline |
| `labelPosition` | `{"binding":"read","default":"beside","dtype":"T","enum":["beside","below","tooltip"]}` | menu |
| `iconSize` | `{"binding":"read","default":24,"dtype":"R"}` | menu |
| `labelPosition` | `{"binding":"read","dtype":"T","enum":["beside","below","tooltip"],"nullable":true}` | menuline |
| `iconSize` | `{"binding":"read","dtype":"R","nullable":true}` | menuline |

<a id="gc-345-250"></a>
<a id="gc-345-shared-formatting"></a>
## Locale and formatting

Data retains its typed value; locale and format affect presentation and parsing. workdate supplies date-editing context. See [Typed controls](105-components.md#gc-105-040).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `locale` | `{"binding":"read","dtype":"T","nullable":true}` | numberTextBox, dateTextBox, timeTextBox, dateCalendar |
| `format` | `{"binding":"read","dtype":"T","nullable":true}` | numberTextBox, dateTextBox, timeTextBox |
| `workdate` | `{"binding":"read","dtype":"T","nullable":true}` | dateTextBox, dateCalendar |

<a id="gc-345-255"></a>
<a id="gc-345-shared-windows"></a>
## Window behavior and geometry

Dialog and floatingPane share controls, geometry and state. Their movement, resize and collapse defaults differ as shown below. Dialog remains modal, including when collapsed or maximized. See [Windows](350-menus-toolbars-and-windows.md).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `title` | `{"binding":"read","default":"","dtype":"T"}` | dialog, floatingPane |
| `open, collapsed, maximized` | `{"binding":"twoWay","default":false,"dtype":"B"}` | dialog, floatingPane |
| `closable` | `{"binding":"read","default":true,"dtype":"B"}` | dialog, floatingPane |
| `movable, resizable, collapsible` | `{"binding":"read","default":false,"dtype":"B"}` | dialog |
| `maximizable` | `{"binding":"read","default":false,"dtype":"B"}` | dialog, floatingPane |
| `beforeClose` | `{"dtype":"T","nullable":true}` | dialog, floatingPane |
| `width, height, left, top` | `{"binding":"twoWay","dtype":"T","nullable":true}` | dialog, floatingPane |
| `minWidth, minHeight` | `{"binding":"read","dtype":"T","nullable":true}` | dialog, floatingPane |
| `movable, resizable, collapsible` | `{"binding":"read","default":true,"dtype":"B"}` | floatingPane |

<a id="gc-345-260"></a>
<a id="gc-345-shared-regions"></a>
## Border and frame regions

BorderContainer and framePane share region arrangement and persistence. Child region parameters stay with each parent below. See [Containers](105-components.md#gc-105-085).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `design` | `{"binding":"read","default":"headline","dtype":"T","enum":["headline","sidebar"]}` | framePane, borderContainer |
| `persist` | `{"binding":"read","default":false,"dtype":"B"}` | framePane, borderContainer |

<a id="gc-345-265"></a>
<a id="gc-345-shared-selection"></a>
## Panel selection

StackContainer and tabContainer select one child panel; selectedPage uses its page name and selected its index. See [Containers](105-components.md#gc-105-085).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `selectedPage` | `{"binding":"twoWay","default":null,"dtype":"T","nullable":true}` | stackContainer, tabContainer |
| `selected` | `{"binding":"twoWay","default":null,"dtype":"L","nullable":true}` | stackContainer, tabContainer |

<a id="gc-345-430"></a>
## Grids and search


<a id="gc-345-365"></a>
<a id="gc-345-grid"></a>
### `grid`

Collection: grid. Virtualized Bag rows with a declarative column structure; database access belongs to the store/provider.


| Parameters | Contract |
| --- | --- |
| `windowInfo` | `{"binding":"read","default":null,"dtype":"X","nullable":true}` |
| `loading, rowHeaders, rowResize, selfDragRows` | `{"binding":"read","default":false,"dtype":"B"}` |
| `viewport` | `{"binding":"write","default":null,"dtype":"X","nullable":true}` |
| `sortRequest` | `{"binding":"write","default":"","dtype":"T"}` |
| `storepath, structpath, rowMode` | `{"dtype":"T"}` |
| `sortedBy` | `{"binding":"read","default":"","dtype":"T"}` |
| `filter` | `{"annotation":{"kind":"type","module":"builtins","name":"dict"},"binding":"read","default":null,"nullable":true}` |

Child grammar: `struct,div`; parent grammar: `None`.

<a id="gc-345-370"></a>
<a id="gc-345-searchbox"></a>
### `searchBox`

Collection: grid. Search control connected to the enclosing grid Source context.


| Parameters | Contract |
| --- | --- |
| `searchOn` | `{"binding":"read","default":true,"dtype":["B","T"]}` |
| `searchTime` | `{"binding":"write","default":null,"dtype":"R","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-435"></a>
## Conversations


<a id="gc-345-375"></a>
<a id="gc-345-chatmessages"></a>
### `chatMessages`

Collection: chat. Scrollable live Source message viewport; ChatPane composes the conversation interface around it.

No additional component-specific parameters.


Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-440"></a>
## Reusable fragments


<a id="gc-345-380"></a>
<a id="gc-345-grouplet"></a>
### `grouplet`

Collection: grouplets. Reusable Source fragment loaded through the existing remote binding.


| Parameters | Contract |
| --- | --- |
| `remote` | `{"binding":"read","dtype":"T","nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-385"></a>
<a id="gc-345-groupletcard"></a>
### `groupletCard`

Collection: grouplets. A titled, foldable remote-content card with bound controls and an optional Markdown guide.


| Parameters | Contract |
| --- | --- |
| `remote` | `{"binding":"read","dtype":"T","nullable":true}` |
| `title, checkboxLabel` | `{"binding":"read","default":"","dtype":"T","qualification":"intl_str"}` |
| `chromeSide` | `{"binding":"read","default":"top","dtype":"T","enum":["top","left","right"]}` |
| `collapsible` | `{"binding":"read","default":false,"dtype":"B"}` |
| `collapsed` | `{"binding":"twoWay","default":false,"dtype":"B"}` |
| `checkbox` | `{"binding":"twoWay","default":null,"dtype":"B","nullable":true}` |
| `delitem` | `{"binding":"read","default":null,"dtype":"B","nullable":true}` |
| `doc` | `{"binding":"read","default":"","dtype":"T"}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-300"></a>
## Text fields


<a id="gc-345-015"></a>
<a id="gc-345-textbox"></a>
### `textbox`

Collection: inputs. Single-line text with label, validation and optional live updates.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-035"></a>
<a id="gc-345-passwordbox"></a>
### `passwordbox`

Collection: inputs. Masked text entry; masking does not encrypt or persist the value.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-030"></a>
<a id="gc-345-textboxarea"></a>
### `textBoxArea`

Collection: inputs. Multiline plain text with the same field and validation contract.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `rows` | `{"binding":"read","default":4,"dtype":"L","target":"control"}` |
| `cols` | `{"binding":"read","default":24,"dtype":"L","target":"control"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-305"></a>
## Choices and selectors


<a id="gc-345-020"></a>
<a id="gc-345-checkbox"></a>
### `checkbox`

Collection: inputs. Boolean value, displayed as a checkbox or a switch.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `mode` | `{"binding":"read","default":"checkbox","dtype":"T","enum":["checkbox","switch"]}` |
| `switch_color` | `{"binding":"read","default":null,"dtype":"T","nullable":true}` |
| `label` | `{"default":"","dtype":"T","qualification":"intl_str","target":"optionCaption"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-040"></a>
<a id="gc-345-radiobutton"></a>
### `radioButton`

Collection: inputs. One Boolean radio option; the Source-scoped group keeps its members mutually exclusive.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `label` | `{"default":"","dtype":"T","qualification":"intl_str","target":"optionCaption"}` |
| `group` | `{"binding":"read","dtype":"T","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-025"></a>
<a id="gc-345-radiobuttontext"></a>
### `radioButtonText`

Collection: inputs. A group of local radio choices storing one option code.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `values` | `{"binding":"read","dtype":"T"}` |
| `cols` | `{"binding":"read","default":1,"dtype":"L"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-100"></a>
<a id="gc-345-checkboxtext"></a>
### `checkBoxText`

Collection: inputs. A local multi-choice group storing the selected codes.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `values` | `{"binding":"read","dtype":"T"}` |
| `cols` | `{"binding":"read","default":1,"dtype":"L"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-045"></a>
<a id="gc-345-colorpicker"></a>
### `colorpicker`

Collection: inputs. Browser color input, with a bound color value.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-075"></a>
<a id="gc-345-filteringselect"></a>
### `filteringSelect`

Collection: inputs. Search a closed set of local choices; Data stores the selected code.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `values` | `{"binding":"read","default":"","dtype":"T"}` |
| `separator` | `{"binding":"read","default":",","dtype":"T"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-080"></a>
<a id="gc-345-callbackselect"></a>
### `callbackSelect`

Collection: inputs. Choices supplied by a page callback.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `callback` | `{"dtype":"T"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-085"></a>
<a id="gc-345-combobox"></a>
### `comboBox`

Collection: inputs. Suggestions with free text allowed.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `values` | `{"binding":"read","default":"","dtype":"T"}` |
| `separator` | `{"binding":"read","default":",","dtype":"T"}` |
| `store` | `{"binding":"read","default":null,"dtype":"X","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-090"></a>
<a id="gc-345-dbselect"></a>
### `dbSelect`

Collection: inputs. Remote choices through an application method or the configured Asqueel integration; the component itself supplies no database adapter.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).


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

<a id="gc-345-095"></a>
<a id="gc-345-dbcombobox"></a>
### `dbComboBox`

Collection: inputs. Remote suggestions with free text; the application owns authorization and persistence.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).


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

<a id="gc-345-310"></a>
## Numbers, dates and time


<a id="gc-345-060"></a>
<a id="gc-345-numbertextbox"></a>
### `numberTextBox`

Collection: inputs. Locale-aware numeric editing; Data keeps the declared numeric type.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation), [Locale and formatting](#gc-345-shared-formatting).


| Parameters | Contract |
| --- | --- |
| `dtype` | `{"default":"R","dtype":"T"}` |
| `min, max` | `{"binding":"read","dtype":"R","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-050"></a>
<a id="gc-345-horizontalslider"></a>
### `horizontalSlider`

Collection: inputs. A bounded numeric range displayed horizontally.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `min` | `{"binding":"read","default":0,"dtype":"R","target":"control"}` |
| `max` | `{"binding":"read","default":100,"dtype":"R","target":"control"}` |
| `step` | `{"binding":"read","default":1,"dtype":"R","target":"control"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-055"></a>
<a id="gc-345-verticalslider"></a>
### `verticalSlider`

Collection: inputs. A bounded numeric range displayed vertically.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `min` | `{"binding":"read","default":0,"dtype":"R","target":"control"}` |
| `max` | `{"binding":"read","default":100,"dtype":"R","target":"control"}` |
| `step` | `{"binding":"read","default":1,"dtype":"R","target":"control"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-065"></a>
<a id="gc-345-datetextbox"></a>
### `dateTextBox`

Collection: inputs. Civil date editing with an optional calendar popup.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation), [Locale and formatting](#gc-345-shared-formatting).


| Parameters | Contract |
| --- | --- |
| `calendar` | `{"binding":"read","default":true,"dtype":"B"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-105"></a>
<a id="gc-345-datecalendar"></a>
### `dateCalendar`

Collection: inputs. An inline civil-date calendar.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation), [Locale and formatting](#gc-345-shared-formatting).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-070"></a>
<a id="gc-345-timetextbox"></a>
### `timeTextBox`

Collection: inputs. Civil time editing with locale-aware text parsing.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation), [Locale and formatting](#gc-345-shared-formatting).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-315"></a>
## Buttons, menus and toolbars


<a id="gc-345-110"></a>
<a id="gc-345-button"></a>
### `button`

Collection: buttons. An application action button using the existing action/Logic contract.

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state), [Icons and label presentation](#gc-345-shared-icons).


| Parameters | Contract |
| --- | --- |
| `action` | `{"dtype":"T","nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-115"></a>
<a id="gc-345-togglebutton"></a>
### `toggleButton`

Collection: buttons. A command button with a bound Boolean selected state.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Icons and label presentation](#gc-345-shared-icons).


| Parameters | Contract |
| --- | --- |
| `action` | `{"dtype":"T","nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-120"></a>
<a id="gc-345-dropdownbutton"></a>
### `dropDownButton`

Collection: buttons. Separate main-action and submenu surfaces; distinct from a menu bar.

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state), [Icons and label presentation](#gc-345-shared-icons).


| Parameters | Contract |
| --- | --- |
| `action` | `{"dtype":"T","nullable":true}` |
| `persist` | `{"default":false,"dtype":"B"}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-125"></a>
<a id="gc-345-menu"></a>
### `menu`

Collection: buttons. A hierarchy presented as a popup or a permanent horizontal/vertical toolbar.

Shared contracts: [Icons and label presentation](#gc-345-shared-icons).


| Parameters | Contract |
| --- | --- |
| `presentation` | `{"default":"popup","dtype":"T","enum":["popup","bar"]}` |
| `orientation` | `{"default":"horizontal","dtype":"T","enum":["horizontal","vertical"]}` |
| `modifiers, resolver` | `{"dtype":"T","nullable":true}` |
| `cacheTime` | `{"default":-1,"dtype":"R"}` |
| `sync` | `{"default":false,"dtype":"B"}` |

Child grammar: `menuline,spacer,contentPane`; parent grammar: `None`.

<a id="gc-345-130"></a>
<a id="gc-345-menuline"></a>
### `menuline`

Collection: buttons. A command, separator, submenu parent or indivisible toolbar group.

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state), [Icons and label presentation](#gc-345-shared-icons).


| Parameters | Contract |
| --- | --- |
| `action, command, caption, code, tooltip` | `{"dtype":"T","nullable":true}` |
| `checked` | `{"binding":"read","dtype":"B","nullable":true}` |
| `group, favorite` | `{"default":false,"dtype":"B"}` |
| `priority` | `{"default":0,"dtype":"R"}` |
| `overflowable` | `{"default":true,"dtype":"B"}` |
| `parameters` | `{"annotation":{"kind":"type","module":"builtins","name":"dict"},"nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-135"></a>
<a id="gc-345-spacer"></a>
### `spacer`

Collection: buttons. Fixed or elastic space in a menu/toolbar; it does not publish a command.


| Parameters | Contract |
| --- | --- |
| `size, flex` | `{"dtype":"R","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-320"></a>
## Forms and containers


<a id="gc-345-355"></a>
<a id="gc-345-editingstatus"></a>
### `editingStatus`

Collection: inputs. Changes and validation feedback from the nearest Source form state.

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-155"></a>
<a id="gc-345-formlet"></a>
### `formlet`

Collection: layout. Responsive field layout with shared label alignment.


| Parameters | Contract |
| --- | --- |
| `columns` | `{"binding":"read","default":1,"dtype":["L","T"]}` |
| `col_min_width` | `{"binding":"read","dtype":"T","nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-160"></a>
<a id="gc-345-groupbox"></a>
### `groupBox`

Collection: layout. A labelled content group, optionally collapsible, with an optional Data copy command.

Shared contracts: [Labels and field presentation](#gc-345-shared-labels).


| Parameters | Contract |
| --- | --- |
| `copy` | `{"binding":"read","default":false,"dtype":"B"}` |
| `lbl_variant` | `{"binding":"read","default":"bar","dtype":"T","enum":["bar","underline","card"]}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-165"></a>
<a id="gc-345-contentpane"></a>
### `contentPane`

Collection: layout. A content area or a child region/panel of a layout container.

No additional component-specific parameters.


Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-170"></a>
<a id="gc-345-bordercontainer"></a>
### `borderContainer`

Collection: layout. Five regions with optional splitters, drawers and nested layouts.

Shared contracts: [Border and frame regions](#gc-345-shared-regions).

No additional component-specific parameters.


Child grammar: `*`; parent grammar: `None`.

Child parameters projected by the parent:

| Parameters | Contract |
| --- | --- |
| `detachable` | `{"default":false,"dtype":"B"}` |
| `title` | `{"default":"","dtype":"T"}` |
| `region` | `{"enum":["top","bottom","left","right","center"],"required":true,"unique":true}` |
| `width, height` | `{}` |
| `drawer_onclick` | `{"inline":["evt","show"]}` |

<a id="gc-345-150"></a>
<a id="gc-345-framepane"></a>
### `framePane`

Collection: layout. A border composition exposing top, bottom, left, right and center region builders.

Shared contracts: [Border and frame regions](#gc-345-shared-regions).

No additional component-specific parameters.


Child grammar: `contentPane`; parent grammar: `None`.

Child parameters projected by the parent:

| Parameters | Contract |
| --- | --- |
| `detachable` | `{"default":false,"dtype":"B"}` |
| `title` | `{"default":"","dtype":"T"}` |
| `region` | `{"enum":["top","bottom","left","right","center"],"required":true,"unique":true}` |
| `width, height` | `{}` |
| `drawer_onclick` | `{"inline":["evt","show"]}` |

<a id="gc-345-175"></a>
<a id="gc-345-stackcontainer"></a>
### `stackContainer`

Collection: layout. One selected panel at a time, without a tab strip.

Shared contracts: [Panel selection](#gc-345-shared-selection).

No additional component-specific parameters.


Child grammar: `*`; parent grammar: `None`.

Child parameters projected by the parent:

| Parameters | Contract |
| --- | --- |
| `pageName` | `{"dtype":"T","nullable":true,"unique":true}` |
| `title` | `{"default":"","dtype":"T"}` |
| `onClose` | `{"inline":[]}` |

<a id="gc-345-180"></a>
<a id="gc-345-tabcontainer"></a>
### `tabContainer`

Collection: layout. Selected panels with shaped or underlined tabs on any side.

Shared contracts: [Panel selection](#gc-345-shared-selection).


| Parameters | Contract |
| --- | --- |
| `tabMode` | `{"binding":"read","default":"tabs","dtype":"T","enum":["tabs","underline"]}` |
| `tabPosition` | `{"binding":"read","default":"top","dtype":"T","enum":["top","bottom","left","right"]}` |
| `tabAlign` | `{"binding":"read","default":"start","dtype":"T","enum":["start","center","end"]}` |

Child grammar: `*`; parent grammar: `None`.

Child parameters projected by the parent:

| Parameters | Contract |
| --- | --- |
| `pageName` | `{"dtype":"T","nullable":true,"unique":true}` |
| `title` | `{"default":"","dtype":"T","required":true}` |
| `onClose` | `{"inline":[]}` |
| `detachable` | `{"dtype":"B"}` |

<a id="gc-345-405"></a>
<a id="gc-345-traypane"></a>
### `trayPane`

Collection: layout. Data-owned arrangement of labelled live cards with selection, movement, resize, layers, rotation, zoom and snapping.


| Parameters | Contract |
| --- | --- |
| `storepath` | `{"dtype":"T"}` |
| `locked, gridVisible` | `{"binding":"read","default":false,"dtype":"B"}` |
| `gridStep` | `{"binding":"read","default":10,"dtype":"L"}` |
| `rotationStep` | `{"binding":"read","default":15,"dtype":"N"}` |

Child grammar: `*`; parent grammar: `None`.

Child parameters projected by the parent:

| Parameters | Contract |
| --- | --- |
| `closable` | `{"default":false,"dtype":"B"}` |
| `minWidth` | `{"default":100,"dtype":"N"}` |
| `minHeight` | `{"default":64,"dtype":"N"}` |

<a id="gc-345-410"></a>
<a id="gc-345-transformpane"></a>
### `transformPane`

Collection: layout. Applies bound translation, rotation and scale to its retained content.


| Parameters | Contract |
| --- | --- |
| `x, y, rotate` | `{"binding":"read","default":0,"dtype":"R"}` |
| `zoom` | `{"binding":"read","default":1,"dtype":"R"}` |
| `min` | `{"binding":"read","default":0.5,"dtype":"R"}` |
| `max` | `{"binding":"read","default":3,"dtype":"R"}` |
| `step` | `{"binding":"read","default":0.01,"dtype":"R"}` |
| `onEnd` | `{"dtype":"T","nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-325"></a>
## Dialogs and floating windows


<a id="gc-345-140"></a>
<a id="gc-345-dialog"></a>
### `dialog`

Collection: layout. A modal window containing a framePane; remains modal when collapsed or maximized.

Shared contracts: [Window behavior and geometry](#gc-345-shared-windows).

No additional component-specific parameters.


Child grammar: `framePane`; parent grammar: `None`.

<a id="gc-345-145"></a>
<a id="gc-345-floatingpane"></a>
### `floatingPane`

Collection: layout. A nonmodal window containing a framePane.

Shared contracts: [Window behavior and geometry](#gc-345-shared-windows).

No additional component-specific parameters.


Child grammar: `framePane`; parent grammar: `None`.

<a id="gc-345-330"></a>
## Trees


<a id="gc-345-185"></a>
<a id="gc-345-tree"></a>
### `tree`

Collection: tree. Hierarchical Bag presentation with selection, disclosure and declared drag behavior.


| Parameters | Contract |
| --- | --- |
| `storepath` | `{"dtype":"T"}` |
| `draggable, internalNames, hideValues, autoCollapse` | `{"binding":"read","default":false,"dtype":"B"}` |
| `labelAttribute, excludeRoot` | `{"binding":"read","default":null,"dtype":"T","nullable":true}` |
| `labelCb, getLabel, getLabelClass, getIconClass` | `{"default":null,"dtype":"T","nullable":true}` |
| `selectedLabelClass, searchText` | `{"binding":"read","default":"","dtype":"T"}` |
| `favorites` | `{"binding":"read","default":null,"dtype":"X","nullable":true}` |
| `favoritesLabel` | `{"binding":"read","default":"Favorites","dtype":"T"}` |
| `selectedPath, checkedPaths` | `{"binding":"twoWay","default":null,"dtype":"T","nullable":true}` |
| `onChecked` | `{"default":null,"dtype":["B","T"],"nullable":true}` |
| `checkedPaths_joiner` | `{"default":",","dtype":"T"}` |
| `checkChildren` | `{"binding":"read","default":true,"dtype":"B"}` |

Child grammar: `rowActions[:1]`; parent grammar: `None`.

<a id="gc-345-360"></a>
<a id="gc-345-rowactions"></a>
### `rowActions`

Collection: tree. Shared contextual row actions for the tree presentation.


| Parameters | Contract |
| --- | --- |
| `position` | `{"default":"end","dtype":"T"}` |
| `actionState` | `{"default":null,"dtype":"T","nullable":true}` |
| `state` | `{"binding":"read","default":null,"dtype":"X","nullable":true}` |

Child grammar: `button,dropDownButton`; parent grammar: `None`.

<a id="gc-345-335"></a>
## File uploads


<a id="gc-345-340"></a>
<a id="gc-345-uploader"></a>
### `uploader`

Collection: uploads. Shared file queue with progress, preview, selected-file metadata and application-owned upload targets.

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state).


| Parameters | Contract |
| --- | --- |
| `operation, storepath` | `{"dtype":"T"}` |
| `contextPath, onComplete` | `{"default":null,"dtype":"T","nullable":true}` |
| `accept` | `{"binding":"read","default":"","dtype":"T"}` |
| `multiple` | `{"binding":"read","default":false,"dtype":"B"}` |
| `autoUpload, manualUpload` | `{"binding":"read","default":true,"dtype":"B"}` |
| `selectedPath` | `{"binding":"twoWay","default":null,"dtype":"T","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-345"></a>
<a id="gc-345-imageuploader"></a>
### `imageUploader`

Collection: uploads. Editable image value with local crop or an application-owned upload destination.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state).


| Parameters | Contract |
| --- | --- |
| `storepath` | `{"dtype":"T"}` |
| `contextPath, operation, onComplete` | `{"default":null,"dtype":"T","nullable":true}` |
| `cropWidth, cropHeight` | `{"default":256,"dtype":"L"}` |
| `outputWidth, outputHeight` | `{"default":512,"dtype":"L"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-350"></a>
<a id="gc-345-attachmentmanager"></a>
### `attachmentManager`

Collection: uploads. Reusable attachment queue and list backed by application operations.

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state).


| Parameters | Contract |
| --- | --- |
| `operation, storepath, contextPath, listMethod, readMethod, removeMethod` | `{"dtype":"T"}` |
| `ready` | `{"binding":"read","default":false,"dtype":"B"}` |
| `accept` | `{"binding":"read","default":"","dtype":"T"}` |
| `selectedPath` | `{"binding":"twoWay","default":null,"dtype":"T","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-425"></a>
## Editors and document previews


<a id="gc-345-190"></a>
<a id="gc-345-codemirror"></a>
### `codeMirror`

Collection: editors. Code/text editor with composed language and editor options.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `language` | `{"binding":"read","default":"text","dtype":"T","enum":["text","python","javascript","typescript","json","html","css","xml","markdown","sql","typst"]}` |
| `lineNumbers, lineWrapping, folding, bracketMatching, autoCloseBrackets, autoIndent, autocompletion, highlightActiveLine, highlightSelectionMatches` | `{"binding":"read","default":true,"dtype":"B"}` |
| `indentUnit` | `{"binding":"read","default":4,"dtype":"L"}` |
| `fontSize` | `{"binding":"read","default":14,"dtype":"L"}` |
| `fontFamily` | `{"binding":"read","default":"monospace","dtype":"T"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-195"></a>
<a id="gc-345-htmleditor"></a>
### `htmlEditor`

Collection: editors. Rich HTML editing using the supported engine configuration.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-200"></a>
<a id="gc-345-htmlpreview"></a>
### `htmlPreview`

Collection: editors. Read-only HTML preview with the component sanitization contract.

Shared contracts: [Values and bindings](#gc-345-shared-value).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-205"></a>
<a id="gc-345-markdowneditor"></a>
### `markdownEditor`

Collection: editors. Markdown editing with the supported editor modes.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-210"></a>
<a id="gc-345-markdownpreview"></a>
### `markdownPreview`

Collection: editors. Rendered Markdown preview.

Shared contracts: [Values and bindings](#gc-345-shared-value).


| Parameters | Contract |
| --- | --- |
| `allowHtml` | `{"binding":"read","default":false,"dtype":"B"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-215"></a>
<a id="gc-345-typstpreview"></a>
### `typstPreview`

Collection: typst. Typst document preview and optional client PDF compilation; compiler resources are separate from ordinary forms.

Shared contracts: [Values and bindings](#gc-345-shared-value).


| Parameters | Contract |
| --- | --- |
| `filename` | `{"binding":"read","default":"document.pdf","dtype":"T"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-390"></a>
## Grid structure declarations

These are Source declarations, not additional browser components. Parameters below are the complete Python authoring signature; annotations retain regex restrictions. A missing default denotes a required argument.

### `struct`

Children: `column,colgroup`. Parents: `grid`.

```json
{"parameters":[],"accepts_var_keyword":false,"accepts_var_positional":false}
```

### `column`

Children: `''`. Parents: `struct,colgroup`.

```json
{"parameters":[{"name":"field","kind":"positional_or_keyword","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^[A-Za-z_][A-Za-z0-9_]*$","flags":0}]},"has_default":false},{"name":"name","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null},{"name":"dtype","kind":"keyword_only","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^(T|B|L|R|N|D|H|DHZ)$","flags":0}]},"has_default":true,"default":null},{"name":"width","kind":"keyword_only","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^[0-9]+([.][0-9]+)?(px|em|rem|ch|%)$","flags":0}]},"has_default":true,"default":null},{"name":"max_height","kind":"keyword_only","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^[0-9]+([.][0-9]+)?(px|em|rem)$","flags":0}]},"has_default":true,"default":null},{"name":"align","kind":"keyword_only","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^(start|center|end)$","flags":0}]},"has_default":true,"default":null},{"name":"format","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null},{"name":"white_space","kind":"keyword_only","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^(normal|nowrap|pre-wrap)$","flags":0}]},"has_default":true,"default":null},{"name":"edit","kind":"keyword_only","role":"attribute","annotation":{"kind":"union","items":[{"kind":"dtype","dtype":"B"},{"kind":"type","module":"builtins","name":"dict"}]},"has_default":true,"default":false}],"accepts_var_keyword":false,"accepts_var_positional":false}
```

### `colgroup`

Children: `column`. Parents: `struct`.

```json
{"parameters":[{"name":"code","kind":"positional_or_keyword","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^[A-Za-z_][A-Za-z0-9_]*$","flags":0}]},"has_default":false},{"name":"name","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null},{"name":"background","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null},{"name":"color","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null}],"accepts_var_keyword":false,"accepts_var_positional":false}
```
