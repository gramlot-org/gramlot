# Widget and parameter reference

Document ID: **GC-345**.

Grouped by purpose; shared parameters are documented once. The full counterpart
preserves types, defaults, bindings and child contracts from all six packaged grammars.
Development reference; no maturity or release acceptance is implied.

<a id="gc-345-005"></a>
<a id="gc-345-010"></a>

Ordinary Source/CSS attributes remain in Writing pages and Themes and CSS.
Page.gramlots selects prepared collections; buttons are built in.


<a id="gc-345-220"></a>
<a id="gc-345-shared-value"></a>
## Values and bindings

The value type and writeback behavior depend on the control. Use a Data pointer for binding; see [Data binding](097-data-binding.md).

Applies to: [textbox](#gc-345-textbox), [checkbox](#gc-345-checkbox), [radioButtonText](#gc-345-radiobuttontext), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [radioButton](#gc-345-radiobutton), [colorpicker](#gc-345-colorpicker), [horizontalSlider](#gc-345-horizontalslider), [verticalSlider](#gc-345-verticalslider), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox), [checkBoxText](#gc-345-checkboxtext), [dateCalendar](#gc-345-datecalendar), [toggleButton](#gc-345-togglebutton), [codeMirror](#gc-345-codemirror), [htmlEditor](#gc-345-htmleditor), [htmlPreview](#gc-345-htmlpreview), [markdownEditor](#gc-345-markdowneditor), [markdownPreview](#gc-345-markdownpreview), [typstPreview](#gc-345-typstpreview).


<a id="gc-345-225"></a>
<a id="gc-345-shared-state"></a>
## Disabled, readonly and live updates

Disabled prevents interaction; readonly preserves reading without accepting edits. live controls when edits reach Data. See [Field behavior](105-components.md#gc-105-040).

Applies to: [textbox](#gc-345-textbox), [checkbox](#gc-345-checkbox), [radioButtonText](#gc-345-radiobuttontext), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [radioButton](#gc-345-radiobutton), [colorpicker](#gc-345-colorpicker), [horizontalSlider](#gc-345-horizontalslider), [verticalSlider](#gc-345-verticalslider), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox), [checkBoxText](#gc-345-checkboxtext), [dateCalendar](#gc-345-datecalendar), [button](#gc-345-button), [toggleButton](#gc-345-togglebutton), [dropDownButton](#gc-345-dropdownbutton), [menuline](#gc-345-menuline), [codeMirror](#gc-345-codemirror), [htmlEditor](#gc-345-htmleditor), [markdownEditor](#gc-345-markdowneditor).


<a id="gc-345-230"></a>
<a id="gc-345-shared-labels"></a>
## Labels and field presentation

lbl supplies a field label; lbl_position places it. The lbl_* and box_* style families are described in [Themes and CSS](096-themes-and-css.md).

Applies to: [textbox](#gc-345-textbox), [checkbox](#gc-345-checkbox), [radioButtonText](#gc-345-radiobuttontext), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [radioButton](#gc-345-radiobutton), [colorpicker](#gc-345-colorpicker), [horizontalSlider](#gc-345-horizontalslider), [verticalSlider](#gc-345-verticalslider), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox), [checkBoxText](#gc-345-checkboxtext), [dateCalendar](#gc-345-datecalendar), [groupBox](#gc-345-groupbox), [codeMirror](#gc-345-codemirror), [htmlEditor](#gc-345-htmleditor), [markdownEditor](#gc-345-markdowneditor).


<a id="gc-345-235"></a>
<a id="gc-345-shared-placeholder"></a>
## Placeholders

Placeholder text is a hint, not a value or a replacement for a field label.

Applies to: [textbox](#gc-345-textbox), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox).


<a id="gc-345-240"></a>
<a id="gc-345-shared-validation"></a>
## Validation

The validate_* family belongs to the shared validation contract, not to each widget. See [Validation rules, callbacks and messages](105-components.md#gc-105-076). Rule conditions and messages use the documented _if, _iswarning, _error and _warning suffixes. For example: root.textbox(value="^customer.email", lbl="Email", validate_email=True).

Applies to: [textbox](#gc-345-textbox), [checkbox](#gc-345-checkbox), [radioButtonText](#gc-345-radiobuttontext), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [radioButton](#gc-345-radiobutton), [colorpicker](#gc-345-colorpicker), [horizontalSlider](#gc-345-horizontalslider), [verticalSlider](#gc-345-verticalslider), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox), [checkBoxText](#gc-345-checkboxtext), [dateCalendar](#gc-345-datecalendar), [codeMirror](#gc-345-codemirror), [htmlEditor](#gc-345-htmleditor), [markdownEditor](#gc-345-markdowneditor).


<a id="gc-345-245"></a>
<a id="gc-345-shared-icons"></a>
## Icons and label presentation

icon holds text or an emoji; iconSrc loads an image such as SVG. iconSize sizes the icon; labelPosition controls label presentation on menus and toolbars. See [Menus and toolbars](350-menus-toolbars-and-windows.md).

Applies to: [button](#gc-345-button), [toggleButton](#gc-345-togglebutton), [dropDownButton](#gc-345-dropdownbutton), [menu](#gc-345-menu), [menuline](#gc-345-menuline).


<a id="gc-345-250"></a>
<a id="gc-345-shared-formatting"></a>
## Locale and formatting

Data retains its typed value; locale and format affect presentation and parsing. workdate supplies date-editing context. See [Typed controls](105-components.md#gc-105-040).

Applies to: [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [dateCalendar](#gc-345-datecalendar).


<a id="gc-345-255"></a>
<a id="gc-345-shared-windows"></a>
## Window behavior and geometry

Dialog and floatingPane share controls, geometry and state. Their movement, resize and collapse defaults differ as shown below. Dialog remains modal, including when collapsed or maximized. See [Windows](350-menus-toolbars-and-windows.md).

Applies to: [dialog](#gc-345-dialog), [floatingPane](#gc-345-floatingpane).


<a id="gc-345-260"></a>
<a id="gc-345-shared-regions"></a>
## Border and frame regions

BorderContainer and framePane share region arrangement and persistence. Child region parameters stay with each parent below. See [Containers](105-components.md#gc-105-085).

Applies to: [framePane](#gc-345-framepane), [borderContainer](#gc-345-bordercontainer).


<a id="gc-345-265"></a>
<a id="gc-345-shared-selection"></a>
## Panel selection

StackContainer and tabContainer select one child panel; selectedPage uses its page name and selected its index. See [Containers](105-components.md#gc-105-085).

Applies to: [stackContainer](#gc-345-stackcontainer), [tabContainer](#gc-345-tabcontainer).


<a id="gc-345-300"></a>
## Text fields


<a id="gc-345-015"></a>
<a id="gc-345-textbox"></a>
### `textbox`

Collection: inputs. Single-line text with label, validation and optional live updates.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

No additional component-specific parameters.


<a id="gc-345-035"></a>
<a id="gc-345-passwordbox"></a>
### `passwordbox`

Collection: inputs. Masked text entry; masking does not encrypt or persist the value.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

No additional component-specific parameters.


<a id="gc-345-030"></a>
<a id="gc-345-textboxarea"></a>
### `textBoxArea`

Collection: inputs. Multiline plain text with the same field and validation contract.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

Specific parameters: `rows`, `cols`.


<a id="gc-345-305"></a>
## Choices and selectors


<a id="gc-345-020"></a>
<a id="gc-345-checkbox"></a>
### `checkbox`

Collection: inputs. Boolean value, displayed as a checkbox or a switch.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

Specific parameters: `mode`, `switch_color`, `label`.


<a id="gc-345-040"></a>
<a id="gc-345-radiobutton"></a>
### `radioButton`

Collection: inputs. One Boolean radio option; the Source-scoped group keeps its members mutually exclusive.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

Specific parameters: `label`, `group`.


<a id="gc-345-025"></a>
<a id="gc-345-radiobuttontext"></a>
### `radioButtonText`

Collection: inputs. A group of local radio choices storing one option code.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

Specific parameters: `values`, `cols`.


<a id="gc-345-100"></a>
<a id="gc-345-checkboxtext"></a>
### `checkBoxText`

Collection: inputs. A local multi-choice group storing the selected codes.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

Specific parameters: `values`, `cols`.


<a id="gc-345-045"></a>
<a id="gc-345-colorpicker"></a>
### `colorpicker`

Collection: inputs. Browser color input, with a bound color value.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

No additional component-specific parameters.


<a id="gc-345-075"></a>
<a id="gc-345-filteringselect"></a>
### `filteringSelect`

Collection: inputs. Search a closed set of local choices; Data stores the selected code.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

Specific parameters: `values`, `separator`.


<a id="gc-345-080"></a>
<a id="gc-345-callbackselect"></a>
### `callbackSelect`

Collection: inputs. Choices supplied by a page callback.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

Specific parameters: `callback`.


<a id="gc-345-085"></a>
<a id="gc-345-combobox"></a>
### `comboBox`

Collection: inputs. Suggestions with free text allowed.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

Specific parameters: `values`, `separator`, `store`.


<a id="gc-345-090"></a>
<a id="gc-345-dbselect"></a>
### `dbSelect`

Collection: inputs. Endpoint-backed choices. Requires an application endpoint implementing the choice response contract; it supplies no database adapter.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

Specific parameters: `dbtable`, `method`, `columns`, `hiddenColumns`, `order_by`, `limit`, `searchDelay`, `ignoreCase`, `hasDownArrow`, `emptyLabel`, `selectedCaption`, `selectedRecord`, `selectedCb`, `autoSelect`.


<a id="gc-345-095"></a>
<a id="gc-345-dbcombobox"></a>
### `dbComboBox`

Collection: inputs. Endpoint-backed suggestions with free text; the application owns the endpoint and persistence.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

Specific parameters: `dbtable`, `method`, `columns`, `hiddenColumns`, `order_by`, `limit`, `searchDelay`, `ignoreCase`, `hasDownArrow`, `emptyLabel`, `selectedCaption`, `selectedRecord`, `selectedCb`.


<a id="gc-345-310"></a>
## Numbers, dates and time


<a id="gc-345-060"></a>
<a id="gc-345-numbertextbox"></a>
### `numberTextBox`

Collection: inputs. Locale-aware numeric editing; Data keeps the declared numeric type.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation), [Locale and formatting](#gc-345-shared-formatting).

Specific parameters: `dtype`, `min`, `max`.


<a id="gc-345-050"></a>
<a id="gc-345-horizontalslider"></a>
### `horizontalSlider`

Collection: inputs. A bounded numeric range displayed horizontally.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

Specific parameters: `min`, `max`, `step`.


<a id="gc-345-055"></a>
<a id="gc-345-verticalslider"></a>
### `verticalSlider`

Collection: inputs. A bounded numeric range displayed vertically.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

Specific parameters: `min`, `max`, `step`.


<a id="gc-345-065"></a>
<a id="gc-345-datetextbox"></a>
### `dateTextBox`

Collection: inputs. Civil date editing with an optional calendar popup.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation), [Locale and formatting](#gc-345-shared-formatting).

Specific parameters: `calendar`.


<a id="gc-345-105"></a>
<a id="gc-345-datecalendar"></a>
### `dateCalendar`

Collection: inputs. An inline civil-date calendar.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation), [Locale and formatting](#gc-345-shared-formatting).

No additional component-specific parameters.


<a id="gc-345-070"></a>
<a id="gc-345-timetextbox"></a>
### `timeTextBox`

Collection: inputs. Civil time editing with locale-aware text parsing.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation), [Locale and formatting](#gc-345-shared-formatting).

No additional component-specific parameters.


<a id="gc-345-315"></a>
## Buttons, menus and toolbars


<a id="gc-345-110"></a>
<a id="gc-345-button"></a>
### `button`

Collection: buttons. An application action button using the existing action/Logic contract.

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state), [Icons and label presentation](#gc-345-shared-icons).

No additional component-specific parameters.


<a id="gc-345-115"></a>
<a id="gc-345-togglebutton"></a>
### `toggleButton`

Collection: buttons. A command button with a bound Boolean selected state.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Icons and label presentation](#gc-345-shared-icons).

No additional component-specific parameters.


<a id="gc-345-120"></a>
<a id="gc-345-dropdownbutton"></a>
### `dropDownButton`

Collection: buttons. Separate main-action and submenu surfaces; distinct from a menu bar.

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state), [Icons and label presentation](#gc-345-shared-icons).

Specific parameters: `persist`.


<a id="gc-345-125"></a>
<a id="gc-345-menu"></a>
### `menu`

Collection: buttons. A hierarchy presented as a popup or a permanent horizontal/vertical toolbar.

Shared contracts: [Icons and label presentation](#gc-345-shared-icons).

Specific parameters: `presentation`, `orientation`, `modifiers`, `resolver`, `cacheTime`, `sync`.


<a id="gc-345-130"></a>
<a id="gc-345-menuline"></a>
### `menuline`

Collection: buttons. A command, separator, submenu parent or indivisible toolbar group.

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state), [Icons and label presentation](#gc-345-shared-icons).

Specific parameters: `command`, `caption`, `code`, `checked`, `tooltip`, `group`, `priority`, `overflowable`, `parameters`, `favorite`.


<a id="gc-345-135"></a>
<a id="gc-345-spacer"></a>
### `spacer`

Collection: buttons. Fixed or elastic space in a menu/toolbar; it does not publish a command.

Specific parameters: `size`, `flex`.


<a id="gc-345-320"></a>
## Forms and containers


<a id="gc-345-155"></a>
<a id="gc-345-formlet"></a>
### `formlet`

Collection: layout. Responsive field layout with shared label alignment.

Specific parameters: `columns`, `col_min_width`.


<a id="gc-345-160"></a>
<a id="gc-345-groupbox"></a>
### `groupBox`

Collection: layout. A labelled content group, optionally collapsible, with an optional Data copy command.

Shared contracts: [Labels and field presentation](#gc-345-shared-labels).

Specific parameters: `copy`, `lbl_variant`.


<a id="gc-345-165"></a>
<a id="gc-345-contentpane"></a>
### `contentPane`

Collection: layout. A content area or a child region/panel of a layout container.

No additional component-specific parameters.


<a id="gc-345-170"></a>
<a id="gc-345-bordercontainer"></a>
### `borderContainer`

Collection: layout. Five regions with optional splitters, drawers and nested layouts.

Shared contracts: [Border and frame regions](#gc-345-shared-regions).

No additional component-specific parameters.


<a id="gc-345-150"></a>
<a id="gc-345-framepane"></a>
### `framePane`

Collection: layout. A border composition exposing top, bottom, left, right and center region builders.

Shared contracts: [Border and frame regions](#gc-345-shared-regions).

No additional component-specific parameters.


<a id="gc-345-175"></a>
<a id="gc-345-stackcontainer"></a>
### `stackContainer`

Collection: layout. One selected panel at a time, without a tab strip.

Shared contracts: [Panel selection](#gc-345-shared-selection).

No additional component-specific parameters.


<a id="gc-345-180"></a>
<a id="gc-345-tabcontainer"></a>
### `tabContainer`

Collection: layout. Selected panels with shaped or underlined tabs on any side.

Shared contracts: [Panel selection](#gc-345-shared-selection).

Specific parameters: `tabMode`, `tabPosition`, `tabAlign`.


<a id="gc-345-220"></a>
<a id="gc-345-traypane"></a>
### `trayPane`

Collection: layout. Data-owned arrangement of labelled live cards with selection, movement, resize, layers, rotation, zoom and snapping.

Specific parameters: `storepath`, `locked`, `gridStep`, `gridVisible`, `rotationStep`.


<a id="gc-345-225"></a>
<a id="gc-345-transformpane"></a>
### `transformPane`

Collection: layout. Applies bound translation, rotation and scale to its retained content.

Specific parameters: `x`, `y`, `rotate`, `zoom`, `min`, `max`, `step`, `onEnd`.


<a id="gc-345-325"></a>
## Dialogs and floating windows


<a id="gc-345-140"></a>
<a id="gc-345-dialog"></a>
### `dialog`

Collection: layout. A modal window containing a framePane; remains modal when collapsed or maximized.

Shared contracts: [Window behavior and geometry](#gc-345-shared-windows).

No additional component-specific parameters.


<a id="gc-345-145"></a>
<a id="gc-345-floatingpane"></a>
### `floatingPane`

Collection: layout. A nonmodal window containing a framePane.

Shared contracts: [Window behavior and geometry](#gc-345-shared-windows).

No additional component-specific parameters.


<a id="gc-345-330"></a>
## Trees


<a id="gc-345-185"></a>
<a id="gc-345-tree"></a>
### `tree`

Collection: tree. Hierarchical Bag presentation with selection, disclosure and declared drag behavior.

Specific parameters: `storepath`, `draggable`, `labelAttribute`, `hideValues`, `labelCb`, `getLabel`, `getLabelClass`, `getIconClass`, `selectedLabelClass`, `searchText`, `autoCollapse`, `selectedPath`.


<a id="gc-345-335"></a>
## Editors and document previews


<a id="gc-345-190"></a>
<a id="gc-345-codemirror"></a>
### `codeMirror`

Collection: editors. Code/text editor with composed language and editor options.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

Specific parameters: `language`, `lineNumbers`, `lineWrapping`, `indentUnit`, `fontSize`, `fontFamily`, `folding`, `bracketMatching`, `autoCloseBrackets`, `autoIndent`, `autocompletion`, `highlightActiveLine`, `highlightSelectionMatches`.


<a id="gc-345-195"></a>
<a id="gc-345-htmleditor"></a>
### `htmlEditor`

Collection: editors. Rich HTML editing using the supported engine configuration.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

No additional component-specific parameters.


<a id="gc-345-200"></a>
<a id="gc-345-htmlpreview"></a>
### `htmlPreview`

Collection: editors. Read-only HTML preview with the component sanitization contract.

Shared contracts: [Values and bindings](#gc-345-shared-value).

No additional component-specific parameters.


<a id="gc-345-205"></a>
<a id="gc-345-markdowneditor"></a>
### `markdownEditor`

Collection: editors. Markdown editing with the supported editor modes.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

No additional component-specific parameters.


<a id="gc-345-210"></a>
<a id="gc-345-markdownpreview"></a>
### `markdownPreview`

Collection: editors. Rendered Markdown preview.

Shared contracts: [Values and bindings](#gc-345-shared-value).

Specific parameters: `allowHtml`.


<a id="gc-345-215"></a>
<a id="gc-345-typstpreview"></a>
### `typstPreview`

Collection: typst. Typst document preview and optional client PDF compilation; compiler resources are separate from ordinary forms.

Shared contracts: [Values and bindings](#gc-345-shared-value).

Specific parameters: `filename`.

