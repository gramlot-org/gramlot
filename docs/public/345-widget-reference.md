# Widget and parameter reference

Document ID: **GC-345**.

This reference covers all **89 component declarations** in the 13 packaged
component collections covered here. It is regenerated from their effective
metadata. Widgets are grouped by purpose; inherited and shared parameters are
documented once and linked from each applicable widget. Use the manual matching your installed packages when comparing available features.
It does not assign a maturity level or imply that every component is production-ready.

<a id="gc-345-005"></a>
## 005 · How to read this reference

- `T`: text; `B`: Boolean; `L`: integer; `R`: real number; other codes are TYTX types.
- **read**: a reactive parameter; `^path` updates the presentation from Data.
- **write**: the component publishes state through the bound path.
- **twoWay**: the component also writes accepted edits/state back through the binding.
- **—**: no binding/default declared in component metadata. This is not a claim that
  the surrounding Source binding system has no behavior for the attribute.
- **None** is a declared nullable/default value, not the text `"None"`.
- **Constraints** preserves enumerations, qualifications and annotation restrictions declared in metadata. Extra semantic
  validation is explained in the linked family guide and enforced by the runtime.

Ordinary Source attributes (such as `id`, `class_`, `hidden`, `datapath`, `color`,
`padding`, `width`, `height`, event declarations and bindings) are described in
[Writing pages](095-writing-pages.md) and [Themes and CSS](096-themes-and-css.md).
The tables below list component parameters, not an exhaustive HTML/CSS whitelist.
A parent's region/panel attributes belong to that parent; they are shown separately.
Dynamic families such as `lbl_*`, `box_*`, `validate_*`, `resolver_*` and
`condition_*` have additional contracts in the narrative guides.

<a id="gc-345-010"></a>
## 010 · Use the environment collections

Declare collections once on your environment's Page base. Pages inherit its
grammars and browser descriptors. `Page.gramlots` adds collections missing from
that environment; merely installing a package does not activate it.

The following is environment setup, not boilerplate to repeat in every lesson:

[Collection setup code](465-widget-examples.md#gc-465-environment) is in the appendix.

Buttons, menu, menuline and spacer belong to the built-in `buttons` grammar.
The other families have prepared descriptors at `gramlot.collections.<name>`.
The base HTML/SVG grammar remains available. `dialog` is the window component;
`html_dialog` explicitly requests the browser's HTML tag.

[Collection loading, generation and overrides](340-components-and-collections-guide.md)
explains the complete package lifecycle. [Examples and visual tour](355-examples-and-visual-tour.md)
connects these controls to runnable lessons and screenshots.

| Collection | Components |
| --- | --- |
| [inputs](410-inputs.md) | [editingStatus](#gc-345-editingstatus), [textbox](#gc-345-textbox), [checkbox](#gc-345-checkbox), [radioButtonText](#gc-345-radiobuttontext), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [radioButton](#gc-345-radiobutton), [colorpicker](#gc-345-colorpicker), [horizontalSlider](#gc-345-horizontalslider), [verticalSlider](#gc-345-verticalslider), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox), [checkBoxText](#gc-345-checkboxtext), [dateCalendar](#gc-345-datecalendar) |
| [buttons](415-buttons.md) | [button](#gc-345-button), [toggleButton](#gc-345-togglebutton), [dropDownButton](#gc-345-dropdownbutton), [menu](#gc-345-menu), [menuline](#gc-345-menuline), [spacer](#gc-345-spacer) |
| [layout](420-layout.md) | [transformPane](#gc-345-transformpane), [dialog](#gc-345-dialog), [floatingPane](#gc-345-floatingpane), [framePane](#gc-345-framepane), [trayPane](#gc-345-traypane), [formlet](#gc-345-formlet), [groupBox](#gc-345-groupbox), [contentPane](#gc-345-contentpane), [borderContainer](#gc-345-bordercontainer), [stackContainer](#gc-345-stackcontainer), [tabContainer](#gc-345-tabcontainer) |
| [tree](425-tree.md) | [tree](#gc-345-tree), [rowActions](#gc-345-rowactions) |
| [editors](430-editors.md) | [codeMirror](#gc-345-codemirror), [htmlEditor](#gc-345-htmleditor), [htmlPreview](#gc-345-htmlpreview), [markdownEditor](#gc-345-markdowneditor), [markdownPreview](#gc-345-markdownpreview), [terminal](#gc-345-terminal) |
| [typst](435-typst.md) | [typstPreview](#gc-345-typstpreview) |
| [uploads](440-uploads.md) | [uploader](#gc-345-uploader), [imageUploader](#gc-345-imageuploader), [attachmentManager](#gc-345-attachmentmanager) |
| [grid](445-grid.md) | [grid](#gc-345-grid), [searchBox](#gc-345-searchbox) |
| [chat](450-chat.md) | [chatMessages](#gc-345-chatmessages) |
| [grouplets](455-grouplets.md) | [grouplet](#gc-345-grouplet), [groupletCard](#gc-345-groupletcard) |
| [charts](480-charts.md) | [chartPane](#gc-345-chartpane), [chartView](#gc-345-chartview), [chartFields](#gc-345-chartfields), [chartGeoJSON](#gc-345-chartgeojson), [chartTimeline](#gc-345-charttimeline), [gauge](#gc-345-gauge), [chartBar](#gc-345-chartbar), [chartLine](#gc-345-chartline), [chartArea](#gc-345-chartarea), [chartStackedBar](#gc-345-chartstackedbar), [chartStackedArea](#gc-345-chartstackedarea), [chartHorizontalBar](#gc-345-charthorizontalbar), [chartPie](#gc-345-chartpie), [chartDonut](#gc-345-chartdonut), [chartScatter](#gc-345-chartscatter), [chartBar3D](#gc-345-chartbar3d), [chartLine3D](#gc-345-chartline3d), [chartScatter3D](#gc-345-chartscatter3d), [chartSurface](#gc-345-chartsurface), [chartMap](#gc-345-chartmap), [chartMapBar3D](#gc-345-chartmapbar3d), [chartMap3D](#gc-345-chartmap3d), [chartLines3D](#gc-345-chartlines3d), [chartPolygons3D](#gc-345-chartpolygons3d), [chartFunnel](#gc-345-chartfunnel), [chartRadar](#gc-345-chartradar), [chartParallel](#gc-345-chartparallel), [chartHeatmap](#gc-345-chartheatmap), [chartSankey](#gc-345-chartsankey), [chartCandlestick](#gc-345-chartcandlestick), [chartBoxplot](#gc-345-chartboxplot), [chartTreemap](#gc-345-charttreemap), [chartSunburst](#gc-345-chartsunburst) |
| [audio](490-audio.md) | [audioAnalyser](#gc-345-audioanalyser) |
| [drawing](495-drawing.md) | [drawingPane](#gc-345-drawingpane) |

## Shared parameter contracts

Each widget below links only the shared contracts it supports. A shared name can have different types, defaults or bindings; separate rows preserve those differences.


<a id="gc-345-220"></a>
<a id="gc-345-shared-value"></a>
## Values and bindings

The value type and writeback behavior depend on the control. Use a Data pointer for binding; see [Data binding](097-data-binding.md).

Applies to: [textbox](#gc-345-textbox), [checkbox](#gc-345-checkbox), [radioButtonText](#gc-345-radiobuttontext), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [radioButton](#gc-345-radiobutton), [colorpicker](#gc-345-colorpicker), [horizontalSlider](#gc-345-horizontalslider), [verticalSlider](#gc-345-verticalslider), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox), [checkBoxText](#gc-345-checkboxtext), [dateCalendar](#gc-345-datecalendar), [toggleButton](#gc-345-togglebutton), [codeMirror](#gc-345-codemirror), [htmlEditor](#gc-345-htmleditor), [htmlPreview](#gc-345-htmlpreview), [markdownEditor](#gc-345-markdowneditor), [markdownPreview](#gc-345-markdownpreview), [typstPreview](#gc-345-typstpreview), [imageUploader](#gc-345-imageuploader), [chartGeoJSON](#gc-345-chartgeojson).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `value` | T or None | — | twoWay | — | [textbox](#gc-345-textbox), [radioButtonText](#gc-345-radiobuttontext), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbComboBox](#gc-345-dbcombobox), [checkBoxText](#gc-345-checkboxtext) |
| `value` | B | — | twoWay | — | [checkbox](#gc-345-checkbox) |
| `value` | B | False | twoWay | — | [radioButton](#gc-345-radiobutton), [toggleButton](#gc-345-togglebutton) |
| `value` | T | '#000000' | twoWay | — | [colorpicker](#gc-345-colorpicker) |
| `value` | R | 0 | twoWay | — | [horizontalSlider](#gc-345-horizontalslider), [verticalSlider](#gc-345-verticalslider) |
| `value` | L / R / N or None | — | twoWay | — | [numberTextBox](#gc-345-numbertextbox) |
| `value` | D or None | — | twoWay | — | [dateTextBox](#gc-345-datetextbox), [dateCalendar](#gc-345-datecalendar) |
| `value` | H or None | — | twoWay | — | [timeTextBox](#gc-345-timetextbox) |
| `value` | T / L or None | — | twoWay | — | [dbSelect](#gc-345-dbselect) |
| `value` | T | '' | twoWay | — | [codeMirror](#gc-345-codemirror), [htmlEditor](#gc-345-htmleditor), [markdownEditor](#gc-345-markdowneditor) |
| `value` | T | '' | read | — | [htmlPreview](#gc-345-htmlpreview), [markdownPreview](#gc-345-markdownpreview), [typstPreview](#gc-345-typstpreview) |
| `value` | T or None | None | twoWay | — | [imageUploader](#gc-345-imageuploader) |
| `value` | X or None | None | twoWay | — | [chartGeoJSON](#gc-345-chartgeojson) |

<a id="gc-345-225"></a>
<a id="gc-345-shared-state"></a>
## Disabled, readonly and live updates

Disabled prevents interaction; readonly preserves reading without accepting edits. live controls when edits reach Data. See [Field behavior](105-components.md#gc-105-040).

Applies to: [textbox](#gc-345-textbox), [checkbox](#gc-345-checkbox), [radioButtonText](#gc-345-radiobuttontext), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [radioButton](#gc-345-radiobutton), [colorpicker](#gc-345-colorpicker), [horizontalSlider](#gc-345-horizontalslider), [verticalSlider](#gc-345-verticalslider), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox), [checkBoxText](#gc-345-checkboxtext), [dateCalendar](#gc-345-datecalendar), [button](#gc-345-button), [toggleButton](#gc-345-togglebutton), [dropDownButton](#gc-345-dropdownbutton), [menuline](#gc-345-menuline), [codeMirror](#gc-345-codemirror), [htmlEditor](#gc-345-htmleditor), [markdownEditor](#gc-345-markdowneditor), [uploader](#gc-345-uploader), [imageUploader](#gc-345-imageuploader), [attachmentManager](#gc-345-attachmentmanager).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `disabled` | B | False | read | — | All listed above |
| `readonly` | B | False | read | — | [textbox](#gc-345-textbox), [checkbox](#gc-345-checkbox), [radioButtonText](#gc-345-radiobuttontext), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [radioButton](#gc-345-radiobutton), [colorpicker](#gc-345-colorpicker), [horizontalSlider](#gc-345-horizontalslider), [verticalSlider](#gc-345-verticalslider), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox), [checkBoxText](#gc-345-checkboxtext), [dateCalendar](#gc-345-datecalendar), [toggleButton](#gc-345-togglebutton), [codeMirror](#gc-345-codemirror), [htmlEditor](#gc-345-htmleditor), [markdownEditor](#gc-345-markdowneditor) |
| `live` | B | False | read | — | [textbox](#gc-345-textbox), [checkbox](#gc-345-checkbox), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [radioButton](#gc-345-radiobutton), [colorpicker](#gc-345-colorpicker), [horizontalSlider](#gc-345-horizontalslider), [verticalSlider](#gc-345-verticalslider), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox) |
| `live` | B | True | read | — | [codeMirror](#gc-345-codemirror), [htmlEditor](#gc-345-htmleditor), [markdownEditor](#gc-345-markdowneditor) |

<a id="gc-345-230"></a>
<a id="gc-345-shared-labels"></a>
## Labels and field presentation

lbl supplies a field label; lbl_position places it. The lbl_* and box_* style families are described in [Themes and CSS](096-themes-and-css.md).

Applies to: [textbox](#gc-345-textbox), [checkbox](#gc-345-checkbox), [radioButtonText](#gc-345-radiobuttontext), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [radioButton](#gc-345-radiobutton), [colorpicker](#gc-345-colorpicker), [horizontalSlider](#gc-345-horizontalslider), [verticalSlider](#gc-345-verticalslider), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox), [checkBoxText](#gc-345-checkboxtext), [dateCalendar](#gc-345-datecalendar), [groupBox](#gc-345-groupbox), [codeMirror](#gc-345-codemirror), [htmlEditor](#gc-345-htmleditor), [markdownEditor](#gc-345-markdowneditor), [searchBox](#gc-345-searchbox).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `lbl` | T or None | — | read | qualification="intl_str" | All listed above |
| `lbl_position` | T | 'TL' | read | enum=['TL', 'TC', 'TR', 'L', 'R', 'BL', 'BC', 'BR'] | [textbox](#gc-345-textbox), [checkbox](#gc-345-checkbox), [radioButtonText](#gc-345-radiobuttontext), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [radioButton](#gc-345-radiobutton), [colorpicker](#gc-345-colorpicker), [horizontalSlider](#gc-345-horizontalslider), [verticalSlider](#gc-345-verticalslider), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox), [checkBoxText](#gc-345-checkboxtext), [dateCalendar](#gc-345-datecalendar), [groupBox](#gc-345-groupbox), [codeMirror](#gc-345-codemirror), [htmlEditor](#gc-345-htmleditor), [markdownEditor](#gc-345-markdowneditor) |
| `lbl_position` | T | 'L' | read | — | [searchBox](#gc-345-searchbox) |

<a id="gc-345-235"></a>
<a id="gc-345-shared-placeholder"></a>
## Placeholders

Placeholder text is a hint, not a value or a replacement for a field label.

Applies to: [textbox](#gc-345-textbox), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `placeholder` | T | '' | — | qualification="intl_str"; target="control" | All listed above |

<a id="gc-345-240"></a>
<a id="gc-345-shared-validation"></a>
## Validation

The validate_* family belongs to the shared validation contract, not to each widget. See [Validation rules, callbacks and messages](105-components.md#gc-105-076). Rule conditions and messages use the documented _if, _iswarning, _error and _warning suffixes. For example: root.textbox(value="^customer.email", lbl="Email", validate_email=True).

Applies to: [textbox](#gc-345-textbox), [checkbox](#gc-345-checkbox), [radioButtonText](#gc-345-radiobuttontext), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [radioButton](#gc-345-radiobutton), [colorpicker](#gc-345-colorpicker), [horizontalSlider](#gc-345-horizontalslider), [verticalSlider](#gc-345-verticalslider), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox), [checkBoxText](#gc-345-checkboxtext), [dateCalendar](#gc-345-datecalendar), [codeMirror](#gc-345-codemirror), [htmlEditor](#gc-345-htmleditor), [markdownEditor](#gc-345-markdowneditor).

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

<a id="gc-345-245"></a>
<a id="gc-345-shared-icons"></a>
## Icons and label presentation

icon holds text or an emoji; iconSrc loads an image such as SVG. iconSize sizes the icon; labelPosition controls label presentation on menus and toolbars. See [Menus and toolbars](350-menus-toolbars-and-windows.md).

Applies to: [button](#gc-345-button), [toggleButton](#gc-345-togglebutton), [dropDownButton](#gc-345-dropdownbutton), [menu](#gc-345-menu), [menuline](#gc-345-menuline).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `icon` | T | '' | read | — | [button](#gc-345-button), [toggleButton](#gc-345-togglebutton), [dropDownButton](#gc-345-dropdownbutton), [menuline](#gc-345-menuline) |
| `iconSrc` | T | '' | read | — | [button](#gc-345-button), [toggleButton](#gc-345-togglebutton), [dropDownButton](#gc-345-dropdownbutton), [menuline](#gc-345-menuline) |
| `labelPosition` | T | 'beside' | read | enum=['beside', 'below', 'tooltip'] | [menu](#gc-345-menu) |
| `iconSize` | R | 24 | read | — | [menu](#gc-345-menu) |
| `labelPosition` | T or None | — | read | enum=['beside', 'below', 'tooltip'] | [menuline](#gc-345-menuline) |
| `iconSize` | R or None | — | read | — | [menuline](#gc-345-menuline) |

<a id="gc-345-250"></a>
<a id="gc-345-shared-formatting"></a>
## Locale and formatting

Data retains its typed value; locale and format affect presentation and parsing. workdate supplies date-editing context. See [Typed controls](105-components.md#gc-105-040).

Applies to: [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [dateCalendar](#gc-345-datecalendar).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `locale` | T or None | — | read | — | All listed above |
| `format` | T or None | — | read | — | [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox) |
| `workdate` | T or None | — | read | — | [dateTextBox](#gc-345-datetextbox), [dateCalendar](#gc-345-datecalendar) |

<a id="gc-345-255"></a>
<a id="gc-345-shared-windows"></a>
## Window behavior and geometry

Dialog and floatingPane share controls, geometry and state. Their movement, resize and collapse defaults differ as shown below. Dialog remains modal, including when collapsed or maximized. See [Windows](350-menus-toolbars-and-windows.md).

Applies to: [dialog](#gc-345-dialog), [floatingPane](#gc-345-floatingpane).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `title` | T | '' | read | — | All listed above |
| `open` | B | False | twoWay | — | All listed above |
| `collapsed` | B | False | twoWay | — | All listed above |
| `closable` | B | True | read | — | All listed above |
| `movable` | B | False | read | — | [dialog](#gc-345-dialog) |
| `resizable` | B | False | read | — | [dialog](#gc-345-dialog) |
| `collapsible` | B | False | read | — | [dialog](#gc-345-dialog) |
| `maximizable` | B | False | read | — | All listed above |
| `maximized` | B | False | twoWay | — | All listed above |
| `beforeClose` | T or None | — | — | — | All listed above |
| `width` | T or None | — | twoWay | — | All listed above |
| `height` | T or None | — | twoWay | — | All listed above |
| `left` | T or None | — | twoWay | — | All listed above |
| `top` | T or None | — | twoWay | — | All listed above |
| `minWidth` | T or None | — | read | — | All listed above |
| `minHeight` | T or None | — | read | — | All listed above |
| `movable` | B | True | read | — | [floatingPane](#gc-345-floatingpane) |
| `resizable` | B | True | read | — | [floatingPane](#gc-345-floatingpane) |
| `collapsible` | B | True | read | — | [floatingPane](#gc-345-floatingpane) |
| `docked` | B | False | read | — | [floatingPane](#gc-345-floatingpane) |

<a id="gc-345-260"></a>
<a id="gc-345-shared-regions"></a>
## Border and frame regions

BorderContainer and framePane share region arrangement and persistence. Child region parameters stay with each parent below. See [Containers](105-components.md#gc-105-085).

Applies to: [framePane](#gc-345-framepane), [borderContainer](#gc-345-bordercontainer).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `design` | T | 'headline' | read | enum=['headline', 'sidebar'] | All listed above |
| `persist` | B | False | read | — | All listed above |

<a id="gc-345-265"></a>
<a id="gc-345-shared-selection"></a>
## Panel selection

StackContainer and tabContainer select one child panel; selectedPage uses its page name and selected its index. See [Containers](105-components.md#gc-105-085).

Applies to: [stackContainer](#gc-345-stackcontainer), [tabContainer](#gc-345-tabcontainer).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `selectedPage` | T or None | None | twoWay | — | All listed above |
| `selected` | L or None | None | twoWay | — | All listed above |

<a id="gc-345-490"></a>
## Audio and drawing


<a id="gc-345-480"></a>
<a id="gc-345-audioanalyser"></a>
### `audioAnalyser`

Live microphone waveform and spectrum arrays written into Data.

Collection: **audio**. Browser element: `gramlot-audio-analyser`.

[Microphone samples and lifecycle](490-audio.md#gc-490-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-audioanalyser).


**Data contract.** running controls capture; waveform and spectrum write numeric arrays as individual Data values. sampleRate, status and error report the session.


**Interaction and events.** Changes to supported configuration update the analyser. Capture failure clears running and reports error.


**Composition.** Invisible leaf component; compose ordinary controls and charts around its bindings.


**Limits and lifecycle.** Requires microphone permission and a secure context. Stop, pagehide and disposal release resources. No recording or persistence.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `running` | B | False | twoWay | — |
| `fftSize` | L | 1024 | read | — |
| `frameRate` | N | 20 | read | — |
| `minimumDb` | N | -100 | read | — |
| `spectrum` | X or None | — | twoWay | — |
| `waveform` | X or None | — | twoWay | — |
| `sampleRate` | N | 0 | twoWay | — |
| `status` | T | 'stopped' | twoWay | — |
| `error` | T | '' | twoWay | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-485"></a>
<a id="gc-345-drawingpane"></a>
### `drawingPane`

SVG annotation editing over an original Data Bag.

Collection: **drawing**. Browser element: `gramlot-drawing-pane`.

[Annotation Bags and drawing tools](495-drawing.md#gc-495-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-drawingpane).


**Data contract.** annotations reads and mutates the Data Bag at its pointer address; image reads an optional background URL.


**Interaction and events.** Shared toolbar actions select, draw, edit text and delete shapes. Bag changes redraw the surface.


**Composition.** Composes a shared Source menu and an SVG drawing surface.


**Limits and lifecycle.** Requires an initialized annotation Bag. Coordinates follow image dimensions or a 1000 by 1000 empty surface. Disposal releases Data registrations; persistence belongs to the application.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `image` | T or None | None | read | — |
| `annotations` | X | — | read | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-445"></a>
## Charts


<a id="gc-345-450"></a>
<a id="gc-345-chartpane"></a>
### `chartPane`

Shared chart configuration, rendering surface and temporal playback over Data Bags.

Collection: **charts**. Browser element: `gramlot-chart-pane`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartpane).


**Data contract.** storepath and configpath identify original Data Bags. rowMode selects attributes or values.


**Interaction and events.** Shared settings, playback controls and engines retain configuration in Data.


**Composition.** Composes the shared frame and chart controls.


**Limits and lifecycle.** Business aggregation stays upstream; unsupported types are not emulated.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `configDefaults` | X or None | — | — | — |
| `storepath` | T | — | — | — |
| `configpath` | T | — | — | — |
| `rowMode` | T | 'attributes' | — | — |
| `gridId` | T or None | — | — | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-455"></a>
<a id="gc-345-chartview"></a>
### `chartView`

Engine adapter rendering the original rows and observing configuration and grid filters.

Collection: **charts**. Browser element: `gramlot-chart-view`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartview).


**Data contract.** Reads store and bound chart configuration; selectedTerritory writes the chosen name.


**Interaction and events.** Observes rows and grid filtering, updates the engine and releases it on removal.


**Composition.** Rendering surface composed by chartPane.


**Limits and lifecycle.** Numeric X is required by uPlot; mapBar3D is ECharts-only.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `chartType` | T | — | read | — |
| `captionField` | T | — | read | — |
| `valueFields` | T or None | — | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-460"></a>
<a id="gc-345-chartfields"></a>
### `chartFields`

Store field discovery for the shared chart configuration controls.

Collection: **charts**. Browser element: `gramlot-chart-fields`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartfields).


**Data contract.** Reads store metadata and writes available chart fields to configuration.


**Interaction and events.** Rebuilds field choices when the original Bag changes.


**Composition.** Internal shared chart settings component.


**Limits and lifecycle.** Does not query a database or infer business aggregates.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `timeFieldId` | T | — | — | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `configpath` | T | — | — | — |
| `categoryId` | T | — | — | — |
| `mapMeasureId` | T | — | — | — |
| `mapLabelId` | T | — | — | — |
| `secondCategoryId` | T | — | — | — |
| `geometryId` | T | — | — | — |
| `measureMenuId` | T | — | — | — |
| `measureRoleIds` | T | — | — | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-465"></a>
<a id="gc-345-chartgeojson"></a>
### `chartGeoJSON`

Validated GeoJSON input and geographic data summary.

Collection: **charts**. Browser element: `gramlot-chart-geo-json`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartgeojson).


**Data contract.** value binds a plain GeoJSON feature collection or null.


**Interaction and events.** Validates supplied geography and displays its summary.


**Composition.** Shared geography input for chart configuration.


**Limits and lifecycle.** Named Polygon/MultiPolygon features only; host owns territorial matching.

Shared contracts: [Values and bindings](#gc-345-shared-value).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-470"></a>
<a id="gc-345-charttimeline"></a>
### `chartTimeline`

Prepared calendar snapshots and playback bounds from the original store.

Collection: **charts**. Browser element: `gramlot-chart-timeline`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-charttimeline).


**Data contract.** Reads store/time parameters and writes timeline state under configpath.


**Interaction and events.** Tracks bounds and prepared snapshots; removal releases observation.


**Composition.** Used by chartPane with its playback controls.


**Limits and lifecycle.** No business aggregation; calendar periods and empty policy are explicit.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `configpath` | T | — | — | — |
| `timeField` | T | — | read | — |
| `timeStep` | T | — | read | — |
| `timeIndex` | R | — | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-500"></a>
<a id="gc-345-gauge"></a>
### `gauge`

One value of the node on a needle dial, a progress ring or a half-circle arc.

Collection: **charts**. Browser element: `gramlot-gauge`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-gauge).


**Data contract.** The node value is the single value, a Data pointer with optional ?attr. min, max, mask, thresholds, presentation and caption read Data. Nothing is written.


**Interaction and events.** Redraws when the value or a parameter changes and follows the light or dark theme; removal releases the engine.


**Composition.** Leaf rendering surface; no children.


**Limits and lifecycle.** One numeric value; an empty value shows the information notice No value, never zero. Errors show an error notice with More info. Values outside min and max are clamped on the dial, the text shows the real value. Threshold colors are names or hex codes.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `min` | R | 0 | read | — |
| `max` | R | 100 | read | — |
| `mask` | T | '{}' | read | — |
| `thresholds` | T or None | '' | read | — |
| `presentation` | T | 'needle' | read | — |
| `caption` | T or None | '' | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-430"></a>
## Grids and search


<a id="gc-345-365"></a>
<a id="gc-345-grid"></a>
### `grid`

Virtualized Bag rows with a declarative column structure; database access belongs to the store/provider.

Collection: **grid**. Browser element: `gramlot-grid`.

[Bag rows, column structure and selection stores](445-grid.md#gc-445-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-grid).


**Data contract.** storepath identifies the row Bag. Explicit rowMode selects nested value Bags or row-node attributes. Resident grids share row identity and own independent order and filter. A windowed provider supplies windowInfo and loading and can consume viewport and sortRequest writes.


**Interaction and events.** Headers support ordering and column manipulation. Optional row headers, resizing and self-drag expose row operations. Double-click or Enter/F2 opens an editable cell, Enter commits, Tab moves and Escape discards unfinished text.


**Composition.** Provide one inline struct or an external structure Bag via structpath. The frameGrid recipe supplies toolbar and search composition. Local editors use ordinary Source controls in an enclosing form session or a standalone session.


**Limits and lifecycle.** Resident virtualization bounds rendered rows while the Bag stays resident. Windowed data needs a provider and local editing is resident-only. Local changes, drafts and errors survive viewport recycling. footer displays the footer row; column totals cover every resident row. Database queries and durable writes belong to the application integration.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `columnFilters` | B | False | read | — |
| `setFilter` | T | '' | read | — |
| `windowInfo` | X or None | None | read | — |
| `loading` | B | False | read | — |
| `viewport` | X or None | None | write | — |
| `sortRequest` | T | '' | write | — |
| `storepath` | T | — | — | — |
| `structpath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `rowHeaders` | B | False | read | — |
| `footer` | B / T | False | read | — |
| `selectionMode` | T | 'multi' | read | — |
| `selectedId` | T or None | None | write | — |
| `selectedIndex` | L or None | None | write | — |
| `selectedLabel` | T or None | None | write | — |
| `selectedPkeys` | X or None | None | write | — |
| `selectedRowidx` | T or None | None | write | — |
| `selectedNodes` | X or None | None | write | — |
| `selectedRowData` | X or None | None | write | — |
| `rowResize` | B | False | read | — |
| `selfDragRows` | B | False | read | — |
| `sortedBy` | T | '' | read | — |
| `filter` | dict or None | None | read | annotation={"kind": "type", "module": "builtins", "name": "dict"} |

Child grammar: `struct,div`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-370"></a>
<a id="gc-345-searchbox"></a>
### `searchBox`

Search control connected to the enclosing grid Source context.

Collection: **grid**. Browser element: `gramlot-search-box`.

[Bag rows, column structure and selection stores](445-grid.md#gc-445-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-searchbox).


**Data contract.** searchOn chooses eligible columns. searchLiteral=True uses literal case-insensitive text matching; the default retains regular expressions. Accepted queries update only the target view's search contribution, in AND with its base filter and setFilter; clearing search preserves both. Bind searchTime to record elapsed filter evaluation time. The input draft stays local until it can be applied.


**Interaction and events.** Typing starts a short debounce and Enter applies immediately. Changing columns, Escape or Clear removes the filter. Invalid or incomplete expressions retain the last accepted filter.


**Composition.** Leaf control that resolves the grid through its FrameGrid recipient. Put it in the FrameGrid search composition.


**Limits and lifecycle.** Works against the resident view. Number and date syntax depends on the column type and locale. Removal cancels the timer and releases view subscriptions.

Shared contracts: [Labels and field presentation](#gc-345-shared-labels).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |
| `searchLiteral` | B | False | read | — |
| `searchHelp` | B | False | read | — |
| `searchOn` | B / T | True | read | — |
| `searchTime` | R or None | None | write | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-435"></a>
## Conversations


<a id="gc-345-375"></a>
<a id="gc-345-chatmessages"></a>
### `chatMessages`

Scrollable live Source message viewport; ChatPane composes the conversation interface around it.

Collection: **chat**. Browser element: `gramlot-chat-messages`.

[ChatPane composition and server responsibilities](450-chat.md#gc-450-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chatmessages).


**Data contract.** Displays its Source children. The separate ChatPane recipe creates and binds conversation, message and draft Data. Page Logic renders strings literally and gives Source messages independent scopes.


**Interaction and events.** The viewport is a focusable scroll region with polite log announcements. ChatPane Logic owns sending, request correlation, message rendering and conditional follow-on-scroll. ChatPageStore's processing hook may return text or Gramlot Source.


**Composition.** Accepts ordinary Source children. Python ChatPane composes the viewport with frame regions, composer, toolbar, actions and controllers.


**Limits and lifecycle.** The viewport declares no send, provider or persistence parameters. The recipe needs the supporting collections, Page Logic and a working PageStore. Application code owns authorization and provider integration.

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-440"></a>
## Reusable fragments


<a id="gc-345-380"></a>
<a id="gc-345-grouplet"></a>
### `grouplet`

Reusable Source fragment loaded through the existing remote binding.

Collection: **grouplets**. Browser element: `gramlot-grouplet`.

[Reusable remote fragments and cards](455-grouplets.md#gc-455-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-grouplet).


**Data contract.** The read-bound remote name selects a reusable Source endpoint. datapath gives each instance a scope for relative child bindings. Shared remote binding governs readiness and caching.


**Interaction and events.** Remote loading and replacement use ordinary Source lifecycle. Removal cancels pending work and suppresses late results. It declares no additional completion or save callback.


**Composition.** Accepts ordinary authored Source children and remote fragments, including nested fragments. Activate collections used by the children.


**Limits and lifecycle.** Uses the standard remote Source endpoint contract. Record loading, editing policy and persistence belong to the composed application.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `remote` | T or None | — | read | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-385"></a>
<a id="gc-345-groupletcard"></a>
### `groupletCard`

A titled, foldable remote-content card with bound controls and an optional Markdown guide.

Collection: **grouplets**. Browser element: `gramlot-grouplet-card`.

[Reusable remote fragments and cards](455-grouplets.md#gc-455-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-groupletcard).


**Data contract.** Bind collapsed and checkbox two ways to retain changes in Data. Null checkbox hides it and false shows it unchecked. Title, label, header side, collapsible, delitem and doc are read inputs. Body bindings use the card's instance scope.


**Interaction and events.** Header controls fold and toggle the checkbox. An authored menu can supply actions. Clear asks for confirmation and rechecks its gate before clearing eligible values. The information button opens the Markdown guide. It declares no additional save or completion callback.


**Composition.** Accepts authored or remote Source body children, including nested cards. An authored menu supplies header actions.


**Limits and lifecycle.** Header side accepts top, left or right. Null delitem hides Clear, false disables it and true enables it. Clear affects direct untransformed reactive body value bindings within scope, preserving header state. Body replacement or removal invalidates pending confirmation.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `remote` | T or None | — | read | — |
| `title` | T | '' | read | qualification="intl_str" |
| `chromeSide` | T | 'top' | read | enum=['top', 'left', 'right'] |
| `collapsible` | B | False | read | — |
| `collapsed` | B | False | twoWay | — |
| `checkbox` | B or None | None | twoWay | — |
| `checkboxLabel` | T | '' | read | qualification="intl_str" |
| `delitem` | B or None | None | read | — |
| `doc` | T | '' | read | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-300"></a>
## Text fields


<a id="gc-345-015"></a>
<a id="gc-345-textbox"></a>
### `textbox`

Single-line text with label, validation and optional live updates.

Collection: **inputs**. Browser element: `gramlot-textbox`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-textbox).


**Data contract.** A nullable two-way string. Null displays as empty, while clearing an edited field writes an empty string.


**Interaction and events.** Change commits the string. With `live=True`, input commits outside IME composition. There is no component-specific change callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** Single-line plain text. Outside an editing session, rejected validation can leave a visible draft while Data retains its previous value. In a shared editing session, parseable edits can update Data while validation records errors and blocks acceptance.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-035"></a>
<a id="gc-345-passwordbox"></a>
### `passwordbox`

Masked text entry; masking does not encrypt or persist the value.

Collection: **inputs**. Browser element: `gramlot-passwordbox`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-passwordbox).


**Data contract.** A nullable two-way string. The native password control masks its display while the binding carries the entered string.


**Interaction and events.** Change commits the string. With `live=True`, input commits outside IME composition. There is no component-specific change callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** The component supplies visual masking. Credential handling and storage remain application responsibilities.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-030"></a>
<a id="gc-345-textboxarea"></a>
### `textBoxArea`

Multiline plain text with the same field and validation contract.

Collection: **inputs**. Browser element: `gramlot-text-box-area`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-textboxarea).


**Data contract.** A nullable two-way string can include line breaks. Reactive row and column counts change the presentation of the same Data.


**Interaction and events.** Change commits the string. With `live=True`, input commits outside IME composition. There is no component-specific change callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** The textarea handles plain text. Changing the row count preserves the existing control and caret.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |
| `rows` | L | 4 | read | target="control" |
| `cols` | L | 24 | read | target="control" |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-305"></a>
## Choices and selectors


<a id="gc-345-020"></a>
<a id="gc-345-checkbox"></a>
### `checkbox`

Boolean value, displayed as a checkbox or a switch.

Collection: **inputs**. Browser element: `gramlot-checkbox`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-checkbox).


**Data contract.** A two-way Boolean is shared by checkbox and switch modes. The option caption and switch color affect presentation.


**Interaction and events.** Changing the checked state commits a Boolean. There is no component-specific toggle callback.


**Composition.** A field leaf. Use `label` for the inline option caption and `lbl` for the shared field label.


**Limits and lifecycle.** Only `checkbox` and `switch` are valid modes. Readonly prevents activation while external Data can still update the check.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |
| `mode` | T | 'checkbox' | read | enum=['checkbox', 'switch'] |
| `switch_color` | T or None | None | read | — |
| `label` | T | '' | — | qualification="intl_str"; target="optionCaption" |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-040"></a>
<a id="gc-345-radiobutton"></a>
### `radioButton`

One Boolean radio option; the Source-scoped group keeps its members mutually exclusive.

Collection: **inputs**. Browser element: `gramlot-radio-button`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-radiobutton).


**Data contract.** Each member owns a two-way Boolean path. Selecting a member of a Source-scoped group clears the other members' Boolean values.


**Interaction and events.** Native activation and group keyboard navigation select a member. Writes go through the member bindings. There is no component-specific group callback.


**Composition.** A field leaf. Declare group members as separate Source nodes with their own labels and bindings.


**Limits and lifecycle.** Use `disabled` to lock interaction. Removing a member releases its group membership.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |
| `label` | T | '' | — | qualification="intl_str"; target="optionCaption" |
| `group` | T or None | — | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-025"></a>
<a id="gc-345-radiobuttontext"></a>
### `radioButtonText`

A group of local radio choices storing one option code.

Collection: **inputs**. Browser element: `gramlot-radio-button-text`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-radiobuttontext).


**Data contract.** A nullable string stores the selected code from the `code:Caption` pairs in `values`.


**Interaction and events.** A native radio change commits the code. There is no component-specific selection callback.


**Composition.** The field generates options from `values` and arranges them in `cols` columns. It takes no Source option children.


**Limits and lifecycle.** The column count must be positive. Readonly and disabled lock the options. Caption updates can retain the selected code.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |
| `values` | T | — | read | — |
| `cols` | L | 1 | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-100"></a>
<a id="gc-345-checkboxtext"></a>
### `checkBoxText`

Multiple choices from text, a Bag, a remote list or the shared checkbox tree.

Collection: **inputs**. Browser element: `gramlot-check-box-text`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-checkboxtext).


**Data contract.** A nullable string stores comma-separated codes, or null for no selection. Editing preserves the order of retained codes and appends newly selected ones.


**Interaction and events.** A native check change commits the code list. Arrows, Home and End move focus among options. There is no component-specific selection callback.


**Composition.** The field generates options from text or Bag `values`, or a complete `dbtable`/`method` result. `popup=True` puts the same choices behind a caption button; `cols` arranges them. It takes no Source option children.


**Limits and lifecycle.** The column count must be positive. Readonly and disabled lock the options. An edit preserves stored codes that have no current visible option.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |
| `values` | T / X | '' | read | — |
| `cols` | L | 1 | read | — |
| `popup` | B | False | read | — |
| `hierarchical` | B | False | read | — |
| `checkChildren` | B | True | read | — |
| `identifier` | T | — | read | — |
| `labelAttribute` | T | — | read | — |
| `dbtable` | T | — | read | — |
| `method` | T | — | read | — |
| `caption_field` | T | — | read | — |
| `order_by` | T | — | read | — |
| `condition` | T | — | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-045"></a>
<a id="gc-345-colorpicker"></a>
### `colorpicker`

Browser color input, with a bound color value.

Collection: **inputs**. Browser element: `gramlot-colorpicker`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-colorpicker).


**Data contract.** A two-way color string projects to a native color input, with `#000000` as the component default.


**Interaction and events.** The native chooser commits on change, or on input with `live=True`. There is no component-specific color callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** The browser supplies the chooser and its accepted color representation. Use `disabled` to lock it.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-075"></a>
<a id="gc-345-filteringselect"></a>
### `filteringSelect`

Search a closed set of local choices; Data stores the selected code.

Collection: **inputs**. Browser element: `gramlot-filtering-select`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-filteringselect).


**Data contract.** A nullable string code resolves to a caption in local `values`. Search matches captions case-insensitively and identity lookup compares codes.


**Interaction and events.** Mouse or keyboard choice commits the code. Clearing commits null and Escape cancels the draft. There is no component-specific selection callback.


**Composition.** The control builds its own popup. Declare choices through the provider, with no Source option children.


**Limits and lifecycle.** An unmatched caption remains a draft even in live mode. Codes must be nonempty and unique. `separator` changes the delimiter between declared options.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |
| `values` | T | '' | read | — |
| `separator` | T | ',' | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-080"></a>
<a id="gc-345-callbackselect"></a>
### `callbackSelect`

Choices supplied by a page callback.

Collection: **inputs**. Browser element: `gramlot-callback-select`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-callbackselect).


**Data contract.** A nullable string code. The named browser Logic provider returns `{rows, identifier, caption}` with unique nonempty string codes and string captions.


**Interaction and events.** The provider receives `_querystring` or `_id` and can return a Promise. Mouse or keyboard choice commits the code. There is no component-specific selection notification.


**Composition.** The control builds its own popup. Declare choices through the provider, with no Source option children.


**Limits and lifecycle.** The provider owns filtering. The editor discards obsolete results on superseding edits and release and reports lookup failures in its choice error state.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |
| `callback` | T | — | — | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-085"></a>
<a id="gc-345-combobox"></a>
### `comboBox`

Suggestions with free text allowed.

Collection: **inputs**. Browser element: `gramlot-combo-box`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-combobox).


**Data contract.** A nullable string stores the entered text or selected caption. Supply `values` (which may be empty) or a `store` Bag whose node values are unique string codes and whose `caption` attributes are strings.


**Interaction and events.** Mouse or keyboard choice commits the caption. Free text also commits through the editor, including live input outside composition. There is no component-specific selection callback.


**Composition.** The control builds its own popup. Declare choices through the provider, with no Source option children.


**Limits and lifecycle.** The bound value distinguishes null from an edited empty string. Malformed or duplicate Bag choices are rejected.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |
| `values` | T | '' | read | — |
| `separator` | T | ',' | read | — |
| `store` | X or None | None | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-090"></a>
<a id="gc-345-dbselect"></a>
### `dbSelect`

Remote choices through an application method or the configured Asqueel integration; the component itself supplies no database adapter.

Collection: **inputs**. Browser element: `gramlot-db-select`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-dbselect).


**Data contract.** A nullable string or safe integer key identifies the selection. The endpoint returns `{rows, identifier, caption}`. Caption, record and requested `selected_*` projections are separate from the key.


**Interaction and events.** The page's remote service uses `method` for searches and identity lookup. Accepted selection writes the outputs and calls optional named Logic `selectedCb` with `{value, record}`. Identity resolution can refresh outputs without notifying that callback.


**Composition.** A field leaf with an internal popup. Its optional sanitized row template supports record placeholders in text.


**Limits and lifecycle.** Unmatched drafts cannot write a key. `autoSelect` checks for a sole candidate with a two-row request. Selections using `validate_notnull` have a condition-change check. Database behavior and required response fields belong to the provider.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |
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

<a id="gc-345-095"></a>
<a id="gc-345-dbcombobox"></a>
### `dbComboBox`

Remote suggestions with free text; the application owns authorization and persistence.

Collection: **inputs**. Browser element: `gramlot-db-combo-box`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-dbcombobox).


**Data contract.** A nullable string stores a selected caption or free text. Selection can populate caption, record and field projections. Free-text or clear commits remove the previous selection outputs.


**Interaction and events.** The remote service supplies suggestions. Choosing a row or committing free text goes through validation. Optional named Logic `selectedCb` receives the accepted value and a record or null.


**Composition.** A field leaf with an internal suggestion popup and optional sanitized row template.


**Limits and lifecycle.** The editor waits for a complete edit even with `live=True`. Condition changes preserve free text and do not auto-select a sole candidate. The provider runs in the configured host.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |
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

<a id="gc-345-310"></a>
## Numbers, dates and time


<a id="gc-345-060"></a>
<a id="gc-345-numbertextbox"></a>
### `numberTextBox`

Locale-aware numeric editing; Data keeps the declared numeric type.

Collection: **inputs**. Browser element: `gramlot-number-text-box`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-numbertextbox).


**Data contract.** A nullable typed number. Use the default finite real entry, `dtype='L'` for safe integers or `dtype='N'` for exact Decimal entry. Empty input commits null.


**Interaction and events.** Enter, change and blur attempt a commit. Live editing commits parseable input. Escape restores the accepted value. There is no component-specific change callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** Entry accepts the locale decimal symbol but rejects grouping separators, incomplete numbers and input outside configured bounds. Exact editing requires a Decimal backend and also follows an existing Decimal value. A rejected parse leaves the last typed Data value in place.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation), [Locale and formatting](#gc-345-shared-formatting).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |
| `dtype` | T | 'R' | — | — |
| `min` | R or None | — | read | — |
| `max` | R or None | — | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-050"></a>
<a id="gc-345-horizontalslider"></a>
### `horizontalSlider`

A bounded numeric range displayed horizontally.

Collection: **inputs**. Browser element: `gramlot-horizontal-slider`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-horizontalslider).


**Data contract.** A two-way real number uses the native range grid defined by reactive `min`, `max` and `step`.


**Interaction and events.** Native range interaction commits on change, or on input with `live=True`. There is no component-specific slider callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** A finite incoming value that the range clamps or snaps can write a correction through a plain reactive value binding. Shared controls need compatible ranges. Use `disabled` to lock it.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |
| `min` | R | 0 | read | target="control" |
| `max` | R | 100 | read | target="control" |
| `step` | R | 1 | read | target="control" |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-055"></a>
<a id="gc-345-verticalslider"></a>
### `verticalSlider`

A bounded numeric range displayed vertically.

Collection: **inputs**. Browser element: `gramlot-vertical-slider`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-verticalslider).


**Data contract.** A two-way real number uses the same range grid as the horizontal slider.


**Interaction and events.** Native range interaction commits on change, or on input with `live=True`. There is no component-specific slider callback.


**Composition.** A field leaf with an internal range that exposes a vertical accessibility orientation.


**Limits and lifecycle.** Browser range rules can clamp or snap incoming finite Data and write the correction through a plain reactive value binding. Use `disabled` to lock it.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |
| `min` | R | 0 | read | target="control" |
| `max` | R | 100 | read | target="control" |
| `step` | R | 1 | read | target="control" |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-065"></a>
<a id="gc-345-datetextbox"></a>
### `dateTextBox`

Civil date editing with an optional calendar popup.

Collection: **inputs**. Browser element: `gramlot-date-text-box`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-datetextbox).


**Data contract.** A nullable civil date (`D`). Formatting and text drafts are separate from Data. Relative entry uses `workdate` or local today as its reference.


**Interaction and events.** Enter, change and blur attempt a commit. Live mode commits parseable input, and selecting a calendar day commits the typed date directly. Escape cancels the draft. There is no component-specific date callback.


**Composition.** A field leaf with an internal trigger and popup unless `calendar=False`.


**Limits and lifecycle.** The parser requires a single date unless period_to declares a relative Data output path. An accepted period writes its start to value and its end to period_to; ordinary dates leave that output unchanged. Empty input commits null, while an invalid expression preserves both typed values. Disabling the calendar or releasing the editor closes its popup.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation), [Locale and formatting](#gc-345-shared-formatting).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |
| `period_to` | T or None | — | — | — |
| `calendar` | B | True | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-105"></a>
<a id="gc-345-datecalendar"></a>
### `dateCalendar`

An inline civil-date calendar.

Collection: **inputs**. Browser element: `gramlot-date-calendar`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-datecalendar).


**Data contract.** A two-way nullable civil date (`D`). `workdate` can supply the reference day for the calendar view.


**Interaction and events.** Month and keyboard navigation move the view or focus without a Data write. Selecting a day or using Clear commits a date or null. There is no component-specific day callback.


**Composition.** An inline field leaf with internal navigation, day grid and clear control.


**Limits and lifecycle.** Readonly and disabled lock interaction. The control checks for civil dates and locks its view when released.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation), [Locale and formatting](#gc-345-shared-formatting).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-070"></a>
<a id="gc-345-timetextbox"></a>
### `timeTextBox`

Civil time editing with locale-aware text parsing.

Collection: **inputs**. Browser element: `gramlot-time-text-box`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-timetextbox).


**Data contract.** A nullable civil time (`H`) uses the TYTX time epoch and preserves seconds and milliseconds without a timezone conversion. Clearing commits null.


**Interaction and events.** Enter, change and blur attempt a commit. Live editing commits parseable input. Escape restores the accepted value. There is no component-specific change callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** Entry uses a 24-hour clock with minutes, optional seconds and optional fractional seconds. Display formats leave the entry grammar unchanged.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation), [Locale and formatting](#gc-345-shared-formatting).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-315"></a>
## Buttons, menus and toolbars


<a id="gc-345-110"></a>
<a id="gc-345-button"></a>
### `button`

An application action button using the existing action/Logic contract.

Collection: **buttons**. Browser element: `gramlot-button`.

[Commands, hierarchy and toolbar layout](350-menus-toolbars-and-windows.md).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-button).


**Data contract.** A button has no editable value. Disabled state and icon presentation can read Data. A fire action pulses a Data path with the modifier string or true, attaches modifier and _counter metadata, and returns the value to null.


**Interaction and events.** Click or keyboard activation runs one command mechanism. Inline action receives _evt, _counter and modifier flags. A nested dataController receives _evt, button_counter and the modifier flags. A confirmation can gate execution, and _delay groups a burst from its last click.


**Composition.** Use caption content and optionally one direct dataController as the click mechanism. The controller keeps its own reactive Data inputs and initialization behavior.


**Limits and lifecycle.** Competing mechanisms or multiple direct dataControllers raise an error. Disabled or removed buttons drop pending clicks. A Gramlot button never implicitly submits its containing form.

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state), [Icons and label presentation](#gc-345-shared-icons).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `action` | T or None | — | — | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-115"></a>
<a id="gc-345-togglebutton"></a>
### `toggleButton`

A command button with a bound Boolean selected state.

Collection: **buttons**. Browser element: `gramlot-toggle-button`.

[Commands, hierarchy and toolbar layout](350-menus-toolbars-and-windows.md).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-togglebutton).


**Data contract.** Bind the boolean value two ways. Data updates the LED and pressed state. Activation commits the new boolean before invoking the command.


**Interaction and events.** Activation flips the boolean and dispatches the change used for binding, then runs the shared button command. Disabled and readonly prevent the flip and command.


**Composition.** Uses the same caption and direct controller composition as button. The LED is provided by the component.


**Limits and lifecycle.** The value represents two states. Removing the Source releases the button command binding.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Icons and label presentation](#gc-345-shared-icons).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `action` | T or None | — | — | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-120"></a>
<a id="gc-345-dropdownbutton"></a>
### `dropDownButton`

Separate main-action and submenu surfaces; distinct from a menu bar.

Collection: **buttons**. Browser element: `gramlot-drop-down-button`.

[Commands, hierarchy and toolbar layout](350-menus-toolbars-and-windows.md).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-dropdownbutton).


**Data contract.** The default command occurrence is local to the button. With persist enabled, local storage saves the occurrence code for the page URL and explicit button id. It does not store command text or a Data value.


**Interaction and events.** The main segment runs the default command. The arrow opens the menu. Ordinary item activation runs that item. Shift activation also makes it the main command and updates its caption and icon.


**Composition.** Author the main caption and command on the button and place the alternatives in its child menu.


**Limits and lifecycle.** Persistent buttons require an explicit id and menu occurrence codes must be unique. A missing saved code falls back to the authored default. Storage failure leaves in-memory selection usable.

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state), [Icons and label presentation](#gc-345-shared-icons).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `action` | T or None | — | — | — |
| `persist` | B | False | — | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-125"></a>
<a id="gc-345-menu"></a>
### `menu`

A hierarchy presented as a popup or a permanent horizontal/vertical toolbar.

Collection: **buttons**. Browser element: `gramlot-menu`.

[Commands, hierarchy and toolbar layout](350-menus-toolbars-and-windows.md).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-menu).


**Data contract.** Menu presentation and resolver inputs can reflect Data. A resolver supplies entries through its named Logic method, with caching governed by cacheTime. The menu has no selected value of its own.


**Interaction and events.** A popup can open from its attached owner or a submenu trigger. Keyboard movement skips unavailable entries and separators. A bar distributes eligible units into overflow and returns them as space becomes available.


**Composition.** Use menuline for commands or submenus, spacer for spacing and contentPane for grouped or embedded content. A bar can be horizontal or vertical.


**Limits and lifecycle.** Opening modifiers match exactly. Popup resolver work can wait for the first opening. Invalid results preserve existing entries and superseded replies cannot replace newer results.

Shared contracts: [Icons and label presentation](#gc-345-shared-icons).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `presentation` | T | 'popup' | — | enum=['popup', 'bar'] |
| `orientation` | T | 'horizontal' | — | enum=['horizontal', 'vertical'] |
| `modifiers` | T or None | — | — | — |
| `resolver` | T or None | — | — | — |
| `cacheTime` | R | -1 | — | — |
| `sync` | B | False | — | — |

Child grammar: `menuline,spacer,contentPane`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-130"></a>
<a id="gc-345-menuline"></a>
### `menuline`

A command, separator, submenu parent or indivisible toolbar group.

Collection: **buttons**. Browser element: `gramlot-menu-line`.

[Commands, hierarchy and toolbar layout](350-menus-toolbars-and-windows.md).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-menuline).


**Data contract.** A menu occurrence can read disabled, hidden and checked presentation from Data. Checked is a display binding. Application Logic changes its underlying state.


**Interaction and events.** A line dispatches its command or opens its submenu. Command occurrences can carry distinct parameters. Delayed delivery captures the parameters at activation and is cancelled if the occurrence becomes unavailable.


**Composition.** Use a caption and optional icon, or give the line a child menu for a submenu. A separator or grouped presentation does not dispatch a command from its padding.


**Limits and lifecycle.** A command and submenu on the same occurrence are mutually exclusive. An unknown command does not dispatch, and nested frames keep their own command recipients.

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state), [Icons and label presentation](#gc-345-shared-icons).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `action` | T or None | — | — | — |
| `command` | T or None | — | — | — |
| `caption` | T or None | — | — | — |
| `code` | T or None | — | — | — |
| `checked` | B or None | — | read | — |
| `tooltip` | T or None | — | — | — |
| `group` | B | False | — | — |
| `parameters` | dict or None | — | — | annotation={"kind": "type", "module": "builtins", "name": "dict"} |
| `favorite` | B | False | — | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-135"></a>
<a id="gc-345-spacer"></a>
### `spacer`

Fixed or elastic space in a menu/toolbar; it does not publish a command.

Collection: **buttons**. Browser element: `gramlot-spacer`.

[Commands, hierarchy and toolbar layout](350-menus-toolbars-and-windows.md).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-spacer).


**Data contract.** size specifies fixed space in pixels. flex assigns a positive share of remaining layout space. Neither parameter represents application Data.


**Interaction and events.** The spacer is decorative and has no activation. A toolbar consumes elastic space before moving trailing units to its popup.


**Composition.** Place it between menu or toolbar items as a leaf.


**Limits and lifecycle.** size and flex are mutually exclusive. A fixed size must be finite and nonnegative. A flex factor must be finite and positive.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `size` | R or None | — | — | — |
| `flex` | R or None | — | — | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-320"></a>
## Forms and containers


<a id="gc-345-355"></a>
<a id="gc-345-editingstatus"></a>
### `editingStatus`

Changes and validation feedback from the nearest Source form state.

Collection: **inputs**. Browser element: `gramlot-editing-status`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-editingstatus).


**Data contract.** Reads the nearest shared editing session's errors and baseline-relative changes. It declares no value binding or separate change journal.


**Interaction and events.** Errors and Changes open live reports. Selecting an entry asks the session to focus the Data path and closes the report on success. There is no public report callback.


**Composition.** Place this leaf within a Source scope that provides a shared editing session. Its internal report controls take no Source children.


**Limits and lifecycle.** Mounting without a session raises an error. A field that cannot be focused leaves a notice without changing the grid filter. Disconnecting releases the session subscription and closes the popup.

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-155"></a>
<a id="gc-345-formlet"></a>
### `formlet`

Responsive field layout with shared label alignment.

Collection: **layout**. Browser element: `gramlot-formlet`.

[Forms, borders, panels and tabs](105-components.md#gc-105-085).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-formlet).


**Data contract.** Fields retain their own Data bindings. Resolved lbl_* and box_* defaults are inherited by descendants from the declaring scope, and explicit child values override them.


**Interaction and events.** The grid and label projection update when presentation inputs change, keeping field drafts and focus with their existing controls.


**Composition.** Place fields or nested layout children inside the formlet. columns can specify a positive integer or CSS track list. col_min_width switches to an auto-fitting grid.


**Limits and lifecycle.** Invalid numeric column counts raise an error. This layout does not create an editing session. Label measurement observers are released on detach.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `columns` | L / T | 1 | read | — |
| `col_min_width` | T or None | — | read | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-160"></a>
<a id="gc-345-groupbox"></a>
### `groupBox`

A labelled content group with an optional scoped Data copy command.

Collection: **layout**. Browser element: `gramlot-group-box`.

[Forms, borders, panels and tabs](105-components.md#gc-105-085).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-groupbox).


**Data contract.** Descendants use the enclosing Source Data scope. Copy reads the current scoped Bag. TYTX retains types and attributes, and JSON contains values only.


**Interaction and events.** With copy enabled, the header action copies TYTX and the format menu offers TYTX or JSON. The header reports clipboard success or failure.


**Composition.** Place arbitrary Source content under the labeled group. Choose bar, underline or card presentation through lbl_variant.


**Limits and lifecycle.** Copy requires a usable browser clipboard. The box disables its copy actions while a copy is pending and ignores late feedback after detaching. The heading has no collapse control or state.

Shared contracts: [Labels and field presentation](#gc-345-shared-labels).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |
| `copy` | B | False | read | — |
| `lbl_variant` | T | 'bar' | read | enum=['bar', 'underline', 'card'] |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-165"></a>
<a id="gc-345-contentpane"></a>
### `contentPane`

A content area or a child region/panel of a layout container.

Collection: **layout**. Browser element: `gramlot-content-pane`.

[Forms, borders, panels and tabs](105-components.md#gc-105-085).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-contentpane).


**Data contract.** The pane has no value binding. Content and its Data scope follow the Source composition. Authored flex layout is projected into the wrapper containing the slotted children.


**Interaction and events.** The pane scrolls its content when needed. In a frame or border container the parent owns region events and chrome.


**Composition.** Accepts arbitrary Source children. Use it as a direct framePane region or as a standalone scrollable pane.


**Limits and lifecycle.** Flex projection covers direction, wrapping, alignment and gaps. Region sizing and splitter writeback are provided by the owning container.

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-170"></a>
<a id="gc-345-bordercontainer"></a>
### `borderContainer`

Five regions with optional splitters, drawers and nested layouts.

Collection: **layout**. Browser element: `gramlot-border-container`.

[Forms, borders, panels and tabs](105-components.md#gc-105-085).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-bordercontainer).


**Data contract.** Numeric regional width or height with a writable binding receives live splitter updates. Literal, read-only, CSS string and transformed dimensions do not gain writeback. With persist enabled, sizes can be restored by stable container id.


**Interaction and events.** Splitters support pointer and keyboard resizing. Drawer activation can call drawer_onclick with evt and show. Region events include closable_change on the child and splitter_resize on the parent.


**Composition.** Give each direct child a distinct top, bottom, left, right or center region. Side children can opt into splitters, drawers or detachment while retaining their Source content.


**Limits and lifecycle.** Splitters are always live. Invalid or duplicate regions, inconsistent size limits and persistence without a stable id raise errors.

Shared contracts: [Border and frame regions](#gc-345-shared-regions).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

Parameters projected by this parent from its children:
| Child parameter | Contract |
| --- | --- |
| `detachable` | `{"default": false, "dtype": "B"}` |
| `title` | `{"default": "", "dtype": "T"}` |
| `region` | `{"enum": ["top", "bottom", "left", "right", "center"], "required": true, "unique": true}` |
| `width` | `{}` |
| `height` | `{}` |
| `drawer_onclick` | `{"inline": ["evt", "show"]}` |

<a id="gc-345-150"></a>
<a id="gc-345-framepane"></a>
### `framePane`

A border composition exposing top, bottom, left, right and center region builders.

Collection: **layout**. Browser element: `gramlot-frame-pane`.

[Window and frame composition](350-menus-toolbars-and-windows.md).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-framepane).


**Data contract.** Uses the border layout sizing and persistence contract. Frame regions keep their field bindings, and a nested frame keeps an independent command recipient boundary.


**Interaction and events.** Regional splitters and drawers behave as in borderContainer. Commands composed in a frame can address its own recipient.


**Composition.** Direct children are contentPane regions. Frame helpers create or retrieve Source regions without duplicating them. Compose toolbars or working content inside those regions.


**Limits and lifecycle.** There is at most one direct contentPane per region. Frame sizing and persistence follow the same validation and stable-id requirements as borderContainer.

Shared contracts: [Border and frame regions](#gc-345-shared-regions).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `contentPane`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

Parameters projected by this parent from its children:
| Child parameter | Contract |
| --- | --- |
| `detachable` | `{"default": false, "dtype": "B"}` |
| `title` | `{"default": "", "dtype": "T"}` |
| `region` | `{"enum": ["top", "bottom", "left", "right", "center"], "required": true, "unique": true}` |
| `width` | `{}` |
| `height` | `{}` |
| `drawer_onclick` | `{"inline": ["evt", "show"]}` |

<a id="gc-345-175"></a>
<a id="gc-345-stackcontainer"></a>
### `stackContainer`

One selected panel at a time, without a tab strip.

Collection: **layout**. Browser element: `gramlot-stack-container`.

[Forms, borders, panels and tabs](105-components.md#gc-105-085).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-stackcontainer).


**Data contract.** selectedPage identifies a panel by its Source pageName. selected is its zero-based position among direct panels. Both support two-way binding, and a valid named selection takes precedence when both values change together.


**Interaction and events.** On a selection change, hiding and showing announce the outgoing and incoming panels before selected reports their resulting active states. A close uses the child onClose guard and publishes closing and closed when accepted.


**Composition.** Direct Source children are panels. Give panels stable pageName values when selecting by name. The stack has no built-in tab strip. External controls can set its selection.


**Limits and lifecycle.** Duplicate non-null page names and negative or noninteger indices raise errors. An out-of-range index leaves the current available panel selected or uses the normal fallback. Inactive panels stay mounted, and closing a panel removes its Source while retaining application Data.

Shared contracts: [Panel selection](#gc-345-shared-selection).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

Parameters projected by this parent from its children:
| Child parameter | Contract |
| --- | --- |
| `pageName` | `{"dtype": "T", "nullable": true, "unique": true}` |
| `title` | `{"default": "", "dtype": "T"}` |
| `onClose` | `{"inline": []}` |

<a id="gc-345-180"></a>
<a id="gc-345-tabcontainer"></a>
### `tabContainer`

Selected panels with shaped or underlined tabs on any side.

Collection: **layout**. Browser element: `gramlot-tab-container`.

[Forms, borders, panels and tabs](105-components.md#gc-105-085).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-tabcontainer).


**Data contract.** selectedPage identifies a panel by its Source pageName. selected is its zero-based position among direct panels. Both support two-way binding, and a valid named selection takes precedence when both values change together.


**Interaction and events.** On a selection change, hiding and showing announce the outgoing and incoming panels before selected reports their resulting active states. A close uses the child onClose guard and publishes closing and closed when accepted. The tab strip adds pointer and keyboard selection. An eligible detachable tab can open in a floating window and reattach when that window closes.


**Composition.** Author a titled direct Source child for each tab. Child metadata can supply a name, icon, badge, closability and detachment. Inactive panel controls remain mounted.


**Limits and lifecycle.** Hidden, disabled and detached panels are skipped for strip selection. onClose must return a synchronous boolean. Detaching moves the slot presentation while preserving the controls.

Shared contracts: [Panel selection](#gc-345-shared-selection).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `tabMode` | T | 'tabs' | read | enum=['tabs', 'underline'] |
| `tabPosition` | T | 'top' | read | enum=['top', 'bottom', 'left', 'right'] |
| `tabAlign` | T | 'start' | read | enum=['start', 'center', 'end'] |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

Parameters projected by this parent from its children:
| Child parameter | Contract |
| --- | --- |
| `pageName` | `{"dtype": "T", "nullable": true, "unique": true}` |
| `title` | `{"default": "", "dtype": "T", "required": true}` |
| `onClose` | `{"inline": []}` |
| `detachable` | `{"dtype": "B"}` |

<a id="gc-345-405"></a>
<a id="gc-345-traypane"></a>
### `trayPane`

Data-owned arrangement of labelled live cards with selection, movement, resize, layers, rotation, zoom and snapping.

Collection: **layout**. Browser element: `gramlot-tray-pane`.

[Tray workspaces and shared Labelboxes](105-components.md#gc-105-970).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-traypane).


**Data contract.** storepath resolves to a Bag keyed by direct child Source labels. Each position Bag holds x, y, width, height, rotation, scale, selected and layer. Gesture changes write geometry and selection to those rows while the existing controls stay mounted.


**Interaction and events.** Drag, resize and rotation handles edit geometry. Shift applies configured snapping. Click and marquee gestures select blocks, and selected blocks can move together. Opt-in close removes the block Source and its geometry row.


**Composition.** Give each direct child a Labelbox with lbl. Child options include minWidth, minHeight and closable. A tray can contain interactive fields and nested trays.


**Limits and lifecycle.** Bounds and same-layer contact constrain edits. Lock hides editing chrome while external Data still projects. Cancellation restores the gesture state, and store replacement ends the old gesture without overwriting the replacement.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `storepath` | T | — | — | — |
| `locked` | B | False | read | — |
| `gridStep` | L | 10 | read | — |
| `gridVisible` | B | False | read | — |
| `rotationStep` | N | 15 | read | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

Parameters projected by this parent from its children:
| Child parameter | Contract |
| --- | --- |
| `closable` | `{"default": false, "dtype": "B"}` |
| `minWidth` | `{"default": 100, "dtype": "N"}` |
| `minHeight` | `{"default": 64, "dtype": "N"}` |

<a id="gc-345-410"></a>
<a id="gc-345-transformpane"></a>
### `transformPane`

Tracks translation, rotation and scale gestures; child Source bindings own the visual transform. Gestures write simple reactive pointers despite read-only binding metadata; onEnd reports final values.

Collection: **layout**. Browser element: `gramlot-transform-pane`.

[Forms, borders, panels and tabs](105-components.md#gc-105-085).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-transformpane).


**Data contract.** x and y express translation, rotate is an angle in degrees, and zoom is a scale factor. Gestures write these values to Data through plain reactive pointers without a transform. min, max and step constrain zoom.


**Interaction and events.** One pointer translates. Two touches also rotate and zoom. When the last pointer is released after a changed gesture, onEnd Logic receives x, y, rotate and zoom.


**Composition.** Place arbitrary Source content inside the gesture surface. The pane tracks gesture values. Bind the child presentation separately to apply a CSS transform from those Data values.


**Limits and lifecycle.** Parameters must be finite, min and step positive, and max at least min. An external parameter change cancels the gesture. A stationary gesture or cancellation does not call onEnd.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `x` | R | 0 | read | — |
| `y` | R | 0 | read | — |
| `rotate` | R | 0 | read | — |
| `zoom` | R | 1 | read | — |
| `min` | R | 0.5 | read | — |
| `max` | R | 3 | read | — |
| `step` | R | 0.01 | read | — |
| `onEnd` | T or None | — | — | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-325"></a>
## Dialogs and floating windows


<a id="gc-345-140"></a>
<a id="gc-345-dialog"></a>
### `dialog`

A modal window containing a framePane; remains modal when collapsed or maximized.

Collection: **layout**. Browser element: `gramlot-dialog`.

[Window and frame composition](350-menus-toolbars-and-windows.md).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-dialog).


**Data contract.** Bind open, collapsed and maximized to retain window state in Data. Width, height, left and top accept CSS lengths and support writeback for user geometry changes. The expanded geometry is retained across collapse and maximize.


**Interaction and events.** The window publishes opened and closed. A close request calls the optional beforeClose Logic with reason and waits for its boolean decision. A pending decision deduplicates close requests, and an obsolete decision cannot close a later window session. Escape requests closure through the same guard.


**Composition.** Provide exactly one framePane child. Closing and reopening preserves the mounted frame, its controls and bindings.


**Limits and lifecycle.** The window remains modal while collapsed or maximized. Movement, resizing, collapse and maximize are opt-in. A non-boolean guard result leaves the dialog open and reports a diagnostic.

Shared contracts: [Window behavior and geometry](#gc-345-shared-windows).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `framePane`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-145"></a>
<a id="gc-345-floatingpane"></a>
### `floatingPane`

A nonmodal window containing a framePane.

Collection: **layout**. Browser element: `gramlot-floating-pane`.

[Window and frame composition](350-menus-toolbars-and-windows.md).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-floatingpane).


**Data contract.** Bind open, collapsed and maximized to retain window state in Data. Width, height, left and top accept CSS lengths and support writeback for user geometry changes. The expanded geometry is retained across collapse and maximize.


**Interaction and events.** The window publishes opened and closed. A close request calls the optional beforeClose Logic with reason and waits for its boolean decision. A pending decision deduplicates close requests, and an obsolete decision cannot close a later window session. Activating a floating window raises it above its peers.


**Composition.** Provide exactly one framePane child. Closing and reopening preserves the mounted frame, its controls and bindings.


**Limits and lifecycle.** This window is nonmodal. Movement, resize and collapse default on, while maximize is opt-in. Disposal invalidates pending close decisions and releases interaction resources.

Shared contracts: [Window behavior and geometry](#gc-345-shared-windows).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `framePane`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-330"></a>
## Trees


<a id="gc-345-185"></a>
<a id="gc-345-tree"></a>
### `tree`

Hierarchical Bag presentation with selection, disclosure and declared drag behavior.

Collection: **tree**. Browser element: `gramlot-tree`.

[Tree stores, labels and selection](105-components.md#gc-105-120).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-tree).


**Data contract.** storepath selects a live Bag in Data or a Source tree through the store routing contract. Bind selectedPath two ways for selection and checkedPaths for joined checkbox paths. Selection paths are relative to the store. External selection can resolve missing ancestors.


**Interaction and events.** Disclosure, keyboard navigation and selection operate on visible rows. Named label and icon Logic can customize row presentation. onChecked receives item and path and can veto the change. Optional drag callbacks prepare a typed snapshot for the internal drop pipeline.


**Composition.** The Bag supplies the hierarchy and can contain lazy resolver nodes. Source may declare one rowActions child for shared commands. A rendered scalar child selects its owning Bag node.


**Limits and lifecycle.** Ordinary rendering does not evaluate unloaded resolvers. Failed branches remain retryable and stale asynchronous results cannot change later selection. Search stops at marked loops, and drag preparation is opt-in, synchronous and does not evaluate a lazy row.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `storepath` | T | — | — | — |
| `draggable` | B | False | read | — |
| `labelAttribute` | T or None | None | read | — |
| `internalNames` | B | False | read | — |
| `hideValues` | B | False | read | — |
| `excludeRoot` | T or None | None | read | — |
| `labelCb` | T or None | None | — | — |
| `getLabel` | T or None | None | — | — |
| `labelState` | X or None | None | read | — |
| `getLabelClass` | T or None | None | — | — |
| `getIconClass` | T or None | None | — | — |
| `selectedLabelClass` | T | '' | read | — |
| `searchText` | T | '' | read | — |
| `searchEager` | B | True | read | — |
| `searchAttributes` | T | '' | read | — |
| `favorites` | X or None | None | read | — |
| `favoritesLabel` | T | 'Favorites' | read | — |
| `autoCollapse` | B | False | read | — |
| `resolveLazy` | B | True | read | — |
| `selectedPath` | T or None | None | twoWay | — |
| `onChecked` | B / T or None | None | — | — |
| `checkedPaths` | T or None | None | twoWay | — |
| `checkedPaths_joiner` | T | ',' | — | — |
| `checkChildren` | B | True | read | — |

Child grammar: `rowActions[:1]`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-360"></a>
<a id="gc-345-rowactions"></a>
### `rowActions`

Shared contextual row actions for the tree presentation.

Collection: **tree**. Browser element: `gramlot-row-actions`.

[Tree stores, labels and selection](105-components.md#gc-105-120).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-rowactions).


**Data contract.** state is an optional read binding passed to actionState. Command context carries the focused or hovered row item and path independently of selectedPath.


**Interaction and events.** A child command runs in the current row context without selecting the row. actionState receives item, path, action and state and returns hidden, icon and title for each coded action.


**Composition.** Place one shared bar inside tree, at start or end of the row. Compose button and dropDownButton children. Use rowAction to identify an action for presentation Logic.


**Limits and lifecycle.** The bar hides when it has no row context. Invalid position or an incomplete actionState result raises an error. Menu commands use the same active row context as the bar.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `position` | T | 'end' | — | — |
| `actionState` | T or None | None | — | — |
| `state` | X or None | None | read | — |

Child grammar: `button,dropDownButton`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-335"></a>
## File uploads


<a id="gc-345-340"></a>
<a id="gc-345-uploader"></a>
### `uploader`

Shared file queue with progress, preview, selected-file metadata and application-owned upload targets.

Collection: **uploads**. Browser element: `gramlot-uploader`.

[File uploads and metadata](105-components.md#gc-105-uploader).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-uploader).


**Data contract.** Initialize a Bag at storepath for queue rows and progress. selectedPath writes the queue-relative row label and clears when that row is removed. Files and temporary grants stay outside Data. Preparation snapshots row metadata fields and the optional contextPath Bag separately.


**Interaction and events.** Selection and drop add files. autoUpload starts queued files, including when enabled after selection. In deferred mode manualUpload controls the Upload action. onComplete names Page Logic receiving item and result after confirmed completion.


**Composition.** Leaf control. Place ordinary metadata controls beside it and bind them to the selected row's metadata Bag. Give them an empty scope when no row is selected.


**Limits and lifecycle.** The host and application operation own authorization and storage. Check status reconciles uncertain outcomes before retry. Local preview covers safe text and raster images. File-origin WebKit Workers can fail to read selected File objects.

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `operation` | T | — | — | — |
| `storepath` | T | — | — | — |
| `contextPath` | T or None | None | — | — |
| `accept` | T | '' | read | — |
| `multiple` | B | False | read | — |
| `autoUpload` | B | True | read | — |
| `manualUpload` | B | True | read | — |
| `selectedPath` | T or None | None | twoWay | — |
| `onComplete` | T or None | None | — | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-345"></a>
<a id="gc-345-imageuploader"></a>
### `imageUploader`

Editable image value with local crop or an application-owned upload destination.

Collection: **uploads**. Browser element: `gramlot-image-uploader`.

[File uploads and metadata](105-components.md#gc-105-uploader).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-imageuploader).


**Data contract.** Bind value two ways and initialize a queue Bag at storepath. Crop confirmation writes a PNG data URL in browser-only mode or a displayable URL returned by the application operation in transfer mode. External value changes supersede open edits.


**Interaction and events.** Select or drop one image, move, zoom or rotate the crop, then confirm or cancel. Camera and screen capture feed the same crop path when available. Server-mode onComplete receives item and result after confirmed transfer.


**Composition.** Leaf control with its own crop dialog. Compose surrounding form controls normally and share contextPath when the upload operation needs it.


**Limits and lifecycle.** Input supports PNG, JPEG and WebP. Positive integer crop and output dimensions must have the same aspect ratio. Remote editing requires canvas-compatible URL access. Camera needs a capable device provider and permission, with a secure context for browser capture. Screen capture depends on browser support and permission. Stored files remain under application control after value is cleared.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `storepath` | T | — | — | — |
| `contextPath` | T or None | None | — | — |
| `operation` | T or None | None | — | — |
| `cropWidth` | L | 256 | — | — |
| `cropHeight` | L | 256 | — | — |
| `outputWidth` | L | 512 | — | — |
| `outputHeight` | L | 512 | — | — |
| `onComplete` | T or None | None | — | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-350"></a>
<a id="gc-345-attachmentmanager"></a>
### `attachmentManager`

Reusable attachment queue and list backed by application operations.

Collection: **uploads**. Browser element: `gramlot-attachment-manager`.

[File uploads and metadata](105-components.md#gc-105-uploader).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-attachmentmanager).


**Data contract.** Initialize queue and record context Bags at storepath and contextPath. Update context before ready enables queued uploads. selectedPath addresses a queue row for metadata editing. The list endpoint provides opaque attachment IDs and captions.


**Interaction and events.** The manager refreshes its list after confirmed upload, calls readMethod for preview and removeMethod for deletion. Context changes clear the old selection and discard stale responses. Failed removal retains selection and reports an error. It declares no public onComplete.


**Composition.** Leaf control composing its own multiple-file queue, list and preview. External metadata fields can bind to the selected queue row.


**Limits and lifecycle.** The application supplies operation, listMethod, readMethod and removeMethod and owns authorization and persistence. Preview responses distinguish text, image and message. Removal requires a true result.

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `operation` | T | — | — | — |
| `storepath` | T | — | — | — |
| `contextPath` | T | — | — | — |
| `ready` | B | False | read | — |
| `listMethod` | T | — | — | — |
| `readMethod` | T | — | — | — |
| `removeMethod` | T | — | — | — |
| `accept` | T | '' | read | — |
| `selectedPath` | T or None | None | twoWay | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-425"></a>
## Editors and document previews


<a id="gc-345-190"></a>
<a id="gc-345-codemirror"></a>
### `codeMirror`

Code/text editor with composed language and editor options.

Collection: **editors**. Browser element: `gramlot-code-mirror`.

[Editor composition and document behavior](105-components.md#gc-105-125).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-codemirror).


**Data contract.** Bind value two ways to source text. Live writes are the default. Deferred edits commit when focus leaves the editor. External value and configuration changes update the retained CodeMirror state.


**Interaction and events.** Undo, redo and historyChanged expose editor history. Ctrl/Cmd+S publishes local save while editable. Ctrl/Cmd+F opens search. Tab indents, Shift+Tab outdents and Escape followed by Tab exits.


**Composition.** Leaf control. Place a toolbar or preview beside it. Wait for ready before using engine-dependent methods such as diagnostics and position revelation.


**Limits and lifecycle.** Language names are enumerated and completion uses local language support. Readonly prevents changes and replacement. Disabled also prevents focus. The application owns persistence.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

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

<a id="gc-345-195"></a>
<a id="gc-345-htmleditor"></a>
### `htmlEditor`

Rich HTML editing using the supported engine configuration.

Collection: **editors**. Browser element: `gramlot-html-editor`.

[Editor composition and document behavior](105-components.md#gc-105-125).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-htmleditor).


**Data contract.** Bind value two ways to HTML source. Live writes are the default and deferred edits commit on blur. Rich edits can normalize markup, while undo to the initial snapshot restores the original source.


**Interaction and events.** The rich toolbar edits supported body content. Undo, redo and the local save shortcut follow the editor history contract.


**Composition.** Leaf control. Pair it with a preview or source editor through the same Data string.


**Limits and lifecycle.** The document head, doctype and protected body regions stay outside the editable content. Removing or duplicating a protected placeholder rejects the edit. Use source editing for protected regions.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-200"></a>
<a id="gc-345-htmlpreview"></a>
### `htmlPreview`

Read-only HTML preview with the component sanitization contract.

Collection: **editors**. Browser element: `gramlot-html-preview`.

[Editor composition and document behavior](105-components.md#gc-105-125).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-htmlpreview).


**Data contract.** The read-bound value supplies the HTML string projected to the iframe document. A Data change replaces the displayed document.


**Interaction and events.** Displays the iframe document without edit, save or completion callbacks.


**Composition.** Leaf control. Bind it to the same Data path as a separate HTML editor.


**Limits and lifecycle.** The iframe sandbox has no allow tokens, so scripts cannot execute. The Data string stays intact.

Shared contracts: [Values and bindings](#gc-345-shared-value).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-205"></a>
<a id="gc-345-markdowneditor"></a>
### `markdownEditor`

Markdown editing with the supported editor modes.

Collection: **editors**. Browser element: `gramlot-markdown-editor`.

[Editor composition and document behavior](105-components.md#gc-105-125).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-markdowneditor).


**Data contract.** Bind value two ways to Markdown. Live writes are the default and deferred edits commit on blur. Incoming Data updates retain the ProseMirror engine and plugins. Undo to the initial snapshot recovers the exact source.


**Interaction and events.** The toolbar and native edits go through the same document model. Undo, redo and local save use the shared editor contract.


**Composition.** Leaf control. Pair it with markdownPreview or a source editor through the same text path.


**Limits and lifecycle.** Rich editing covers ordinary paragraphs, headings, lists, quotes and fenced code. Tables, embedded HTML, strikethrough and task lists remain opaque source blocks. Frontmatter and reference definitions preserve the whole document as a source block. Rich edits can normalize supported syntax.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `lbl_value` | T or None | — | twoWay | — |
| `lbl_values` | T or None | — | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-210"></a>
<a id="gc-345-markdownpreview"></a>
### `markdownPreview`

Rendered Markdown preview.

Collection: **editors**. Browser element: `gramlot-markdown-preview`.

[Editor composition and document behavior](105-components.md#gc-105-125).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-markdownpreview).


**Data contract.** Reads Markdown through value. Changing allowHtml alters rendering only. By default embedded HTML appears as text. With allowHtml enabled, rendered HTML is sanitized.


**Interaction and events.** Updates as read inputs change. It declares no save, edit or render-completion callback.


**Composition.** Leaf control. Pair it with a Markdown editor through the same Data string.


**Limits and lifecycle.** The renderer loads on demand. The sandboxed preview policy blocks external image requests and rendering leaves the source intact.

Shared contracts: [Values and bindings](#gc-345-shared-value).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `allowHtml` | B | False | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-215"></a>
<a id="gc-345-typstpreview"></a>
### `typstPreview`

Typst document preview with client SVG and PDF compilation; compiler resources are separate from ordinary forms.

Collection: **typst**. Browser element: `gramlot-typst-preview`.

[Typst compiler and resource ownership](105-components.md#gc-105-145).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-typstpreview).


**Data contract.** Reads the Typst source from value and the download name from filename. SVG, PDF and diagnostics stay inside the browser preview. The current Worker produces SVG and PDF for each successful preview revision.


**Interaction and events.** Changes schedule compilation after a short pause. The current result enables download and diagnostics appear in the widget. It declares no completion callback.


**Composition.** Leaf control. Pair it with codeMirror from the separate editors collection to edit the same draft.


**Limits and lifecycle.** The browser Worker uses a bundled compiler and fonts. Includes, custom assets and external packages are outside the browser preview contract. Source changes invalidate prior output immediately. Removing the last preview releases the shared Worker.

Shared contracts: [Values and bindings](#gc-345-shared-value).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `filename` | T | 'document.pdf' | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-270"></a>
<a id="gc-345-terminal"></a>
### `terminal`

Interactive terminal connected to a @terminal session of the page store.

Collection: **editors**. Browser element: `gramlot-terminal`.

[Editor composition and document behavior](105-components.md#gc-105-125).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-terminal).


**Data contract.** Reads session, the name of an @terminal method of the page store. Writes connected, rows and columns when the socket opens, closes or the screen is resized. Terminal bytes never pass through Data.


**Interaction and events.** Keys go to the session as typed, including arrows, Tab and Ctrl-C. Output is written to the screen as it arrives. input(text) sends text as if typed.


**Composition.** Leaf control. It fills its box and resizes the server terminal with it.


**Limits and lifecycle.** Requires a server with a PageStore channel (websocket). A page has one open session per name: opening it again closes the open one. The server stops sending output while 1 MB is unacknowledged by the screen.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `session` | T | '' | read | — |
| `fontSize` | L | 14 | read | — |
| `fontFamily` | T | 'monospace' | read | — |
| `connected` | B | False | write | — |
| `rows` | L | 0 | write | — |
| `columns` | L | 0 | write | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-640"></a>
## Chart types


<a id="gc-345-505"></a>
<a id="gc-345-chartbar"></a>
### `chartBar`

Compares values across categories with vertical bars. chartView with chartType 'bar'.

Collection: **charts**. Browser element: `gramlot-chart-bar`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartbar).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-510"></a>
<a id="gc-345-chartline"></a>
### `chartLine`

Shows how values change along an ordered category, such as time. chartView with chartType 'line'.

Collection: **charts**. Browser element: `gramlot-chart-line`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartline).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-515"></a>
<a id="gc-345-chartarea"></a>
### `chartArea`

Shows how values change along an ordered category, filling the area under each line. chartView with chartType 'area'.

Collection: **charts**. Browser element: `gramlot-chart-area`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartarea).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-520"></a>
<a id="gc-345-chartstackedbar"></a>
### `chartStackedBar`

Shows the parts of a total for each category, with the measures stacked in one bar. chartView with chartType 'stackedBar'.

Collection: **charts**. Browser element: `gramlot-chart-stacked-bar`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartstackedbar).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-525"></a>
<a id="gc-345-chartstackedarea"></a>
### `chartStackedArea`

Shows the parts of a total along an ordered category, with the areas stacked. chartView with chartType 'stackedArea'.

Collection: **charts**. Browser element: `gramlot-chart-stacked-area`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartstackedarea).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-530"></a>
<a id="gc-345-charthorizontalbar"></a>
### `chartHorizontalBar`

Compares values across categories with horizontal bars; suited to long category names. chartView with chartType 'horizontalBar'.

Collection: **charts**. Browser element: `gramlot-chart-horizontal-bar`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-charthorizontalbar).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-535"></a>
<a id="gc-345-chartpie"></a>
### `chartPie`

Shows the share of each category in a total. chartView with chartType 'pie'.

Collection: **charts**. Browser element: `gramlot-chart-pie`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartpie).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measure` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-540"></a>
<a id="gc-345-chartdonut"></a>
### `chartDonut`

Shows the share of each category in a total, as a ring. chartView with chartType 'donut'.

Collection: **charts**. Browser element: `gramlot-chart-donut`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartdonut).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measure` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-545"></a>
<a id="gc-345-chartscatter"></a>
### `chartScatter`

Shows each row as a point, to reveal relations and clusters. chartView with chartType 'scatter'.

Collection: **charts**. Browser element: `gramlot-chart-scatter`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartscatter).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-550"></a>
<a id="gc-345-chartbar3d"></a>
### `chartBar3D`

Shows a value for each pair of two dimensions as 3D columns. chartView with chartType 'bar3D'.

Collection: **charts**. Browser element: `gramlot-chart-bar3d`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartbar3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | required=true |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-555"></a>
<a id="gc-345-chartline3d"></a>
### `chartLine3D`

Shows values along two dimensions as lines in 3D space. chartView with chartType 'line3D'.

Collection: **charts**. Browser element: `gramlot-chart-line3d`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartline3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | required=true |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-560"></a>
<a id="gc-345-chartscatter3d"></a>
### `chartScatter3D`

Shows each row as a point in 3D space. chartView with chartType 'scatter3D'.

Collection: **charts**. Browser element: `gramlot-chart-scatter3d`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartscatter3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | required=true |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-565"></a>
<a id="gc-345-chartsurface"></a>
### `chartSurface`

Shows a measured surface over a grid of two numeric dimensions. chartView with chartType 'surface'.

Collection: **charts**. Browser element: `gramlot-chart-surface`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartsurface).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | required=true |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-570"></a>
<a id="gc-345-chartmap"></a>
### `chartMap`

Colours each territory of a GeoJSON map by one measure. chartView with chartType 'map'.

Collection: **charts**. Browser element: `gramlot-chart-map`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartmap).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | required=true |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-575"></a>
<a id="gc-345-chartmapbar3d"></a>
### `chartMapBar3D`

Raises 3D columns on the territories of a GeoJSON map. chartView with chartType 'mapBar3D'.

Collection: **charts**. Browser element: `gramlot-chart-map-bar3d`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartmapbar3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-580"></a>
<a id="gc-345-chartmap3d"></a>
### `chartMap3D`

Draws the territories of a GeoJSON map in 3D, one map per measure. chartView with chartType 'map3D'.

Collection: **charts**. Browser element: `gramlot-chart-map3d`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartmap3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-585"></a>
<a id="gc-345-chartlines3d"></a>
### `chartLines3D`

Draws paths of coordinates on a 3D map. chartView with chartType 'lines3D'.

Collection: **charts**. Browser element: `gramlot-chart-lines3d`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartlines3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | required=true |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-590"></a>
<a id="gc-345-chartpolygons3d"></a>
### `chartPolygons3D`

Draws polygons of coordinates as 3D shapes. chartView with chartType 'polygons3D'.

Collection: **charts**. Browser element: `gramlot-chart-polygons3d`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartpolygons3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | required=true |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-595"></a>
<a id="gc-345-chartfunnel"></a>
### `chartFunnel`

Shows how a quantity shrinks through ordered stages. chartView with chartType 'funnel'.

Collection: **charts**. Browser element: `gramlot-chart-funnel`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartfunnel).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measure` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-600"></a>
<a id="gc-345-chartradar"></a>
### `chartRadar`

Compares items on several measures; each measure is an axis, each row a polygon. chartView with chartType 'radar'.

Collection: **charts**. Browser element: `gramlot-chart-radar`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartradar).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-605"></a>
<a id="gc-345-chartparallel"></a>
### `chartParallel`

Compares rows on several measures; each measure is a vertical axis, each row a line across them. chartView with chartType 'parallel'.

Collection: **charts**. Browser element: `gramlot-chart-parallel`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartparallel).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-610"></a>
<a id="gc-345-chartheatmap"></a>
### `chartHeatmap`

Colours each cell of a grid of two categories by one measure. chartView with chartType 'heatmap'.

Collection: **charts**. Browser element: `gramlot-chart-heatmap`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartheatmap).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | required=true |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measure` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-615"></a>
<a id="gc-345-chartsankey"></a>
### `chartSankey`

Shows flows between nodes; the width of each link is its value. chartView with chartType 'sankey'.

Collection: **charts**. Browser element: `gramlot-chart-sankey`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartsankey).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | required=true |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measure` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-620"></a>
<a id="gc-345-chartcandlestick"></a>
### `chartCandlestick`

Shows the open, high, low and close of each period, as used for prices. chartView with chartType 'candlestick'.

Collection: **charts**. Browser element: `gramlot-chart-candlestick`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartcandlestick).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `open` | T | — | read | required=true |
| `high` | T | — | read | required=true |
| `low` | T | — | read | required=true |
| `close` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-625"></a>
<a id="gc-345-chartboxplot"></a>
### `chartBoxplot`

Shows the spread of each group with five statistics: minimum, quartiles, median and maximum. chartView with chartType 'boxplot'.

Collection: **charts**. Browser element: `gramlot-chart-boxplot`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartboxplot).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `min` | T | — | read | required=true |
| `q1` | T | — | read | required=true |
| `median` | T | — | read | required=true |
| `q3` | T | — | read | required=true |
| `max` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-630"></a>
<a id="gc-345-charttreemap"></a>
### `chartTreemap`

Shows a hierarchy as nested rectangles whose area is the value. chartView with chartType 'treemap'.

Collection: **charts**. Browser element: `gramlot-chart-treemap`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-charttreemap).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measure` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-635"></a>
<a id="gc-345-chartsunburst"></a>
### `chartSunburst`

Shows a hierarchy as rings; the angle of each sector is the value. chartView with chartType 'sunburst'.

Collection: **charts**. Browser element: `gramlot-chart-sunburst`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartsunburst).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measure` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-345-390"></a>
## Grid structure declarations

These are Source declarations, not additional browser components. Parameters below are the complete Python authoring signature; annotations retain regex restrictions. A missing default denotes a required argument.

### `struct`

Children: `column,colgroup`. Parents: `grid`.


**Data contract.** An inline declaration projects to a structure Bag before rendering. Use structpath to read a separately maintained structure instead.


**Interaction and events.** Grid header interactions can update the projected structure. Other grids sharing that Bag observe its changes. The declaration has no callback.


**Composition.** Grid declaration containing columns and column groups. It has no separate browser element.


**Limits and lifecycle.** Use one inline struct or an external structpath. Duplicate fields, unknown attributes and nested groups are rejected. External sets use check=multiple, checked=^DataPath and checkedField=identityField. Initialize the Data value to an empty string; nonempty text IDs without commas are stored as comma-separated strings. Literal comma-wrapped includes checks membership. Each toggle writes Data and refreshes all views without editing records. Dynamic columns observe the structure Bag; removing a column keeps its set. Offscreen IDs survive. External set columns cannot have editors and are excluded from ordinary field sorting/search; check=single uses a radio and writes one scalar ID to checked without editing supplier rows. It supports partial stores, retains filtered/offscreen choices and never toggles off the selected radio. Text and numeric identities retain their type. Bulk actions are not implemented. A read-bound setFilter string names external check columns: john,fred means intersection, empty removes only the set contribution. Base filter, search and setFilter combine with AND. Set Data changes immediately update the view. Nonempty setFilter requires a complete resident store; windowInfo and unknown check columns are rejected. Column title retains the full tooltip/accessibility name when name is abbreviated. columnFilters=True enables distinct-value header popups on complete resident stores: OR within each column, AND across columns/base/search/sets. Counts exclude only their own column selection. Empty groups null and empty text; zero-count selections persist. None differs from Reset. The popup reuses the shared grid and menu toolbar; its literal search filters only the choices and preserves hidden selections. All/None apply to the entire choice list. Accepted criteria live in the Source-owned collection view; row edits update counts. Date columns add inclusive From/To and period entry; range AND values is one column criterion. Changing range selects all matching dates; clearing From clears To but preserves selected dates. Reset clears both. Invalid drafts retain the accepted filter.

Additional positional arguments: `False`; additional keyword arguments: `False`.

No parameters.


### `column`

Children: `''`. Parents: `struct,colgroup`.


**Data contract.** The required field identifies a row field under the chosen rowMode. Metadata configures caption, type and presentation. Enable local editing with edit=True or an editor options dictionary.


**Interaction and events.** The grid handles header and cell interactions. The column supplies configuration for the projected header, cells and optional editor.


**Composition.** Leaf declaration inside struct or colgroup, without a separate browser element.


**Limits and lifecycle.** Field identity must be unique. Attribute names and values are validated. formula, formula_<name>, calculated and hidden compute row fields (# and += per grid on its visible rows, never written; sorting, filtering or searching them is an error); totalize, footer_value and footer_format configure totals. Other unknown keywords are rejected. Formulas and totals are an intermediate implementation whose final placement (data level or grid) is under review.

Additional positional arguments: `False`; additional keyword arguments: `True`.

| Parameter | Passing | Type | Default | Constraints |
| --- | --- | --- | --- | --- |
| `field` | positional_or_keyword | T | **required** | [{"kind":"regex","pattern":"^[A-Za-z_][A-Za-z0-9_]*$","flags":0}] |
| `name` | keyword_only | T | None | [] |
| `dtype` | keyword_only | T | None | [{"kind":"regex","pattern":"^(T&#124;B&#124;L&#124;R&#124;N&#124;D&#124;H&#124;DHZ)$","flags":0}] |
| `width` | keyword_only | T | None | [{"kind":"regex","pattern":"^[0-9]+([.][0-9]+)?(px&#124;em&#124;rem&#124;ch&#124;%)$","flags":0}] |
| `max_height` | keyword_only | T | None | [{"kind":"regex","pattern":"^[0-9]+([.][0-9]+)?(px&#124;em&#124;rem)$","flags":0}] |
| `align` | keyword_only | T | None | [{"kind":"regex","pattern":"^(start&#124;center&#124;end)$","flags":0}] |
| `format` | keyword_only | T | None | [] |
| `white_space` | keyword_only | T | None | [{"kind":"regex","pattern":"^(normal&#124;nowrap&#124;pre-wrap)$","flags":0}] |
| `edit` | keyword_only | B / dict | False | [] |
| `check` | keyword_only | T | None | [] |
| `checked` | keyword_only | T | None | [] |
| `checkedField` | keyword_only | T | None | [] |
| `title` | keyword_only | T | None | [] |
| `formula` | keyword_only | T | None | [] |
| `calculated` | keyword_only | B | None | [] |
| `hidden` | keyword_only | B | None | [] |
| `totalize` | keyword_only | B / T | None | [] |
| `footer_value` | keyword_only | T | None | [] |
| `footer_format` | keyword_only | T | None | [] |
| `attr` | var_keyword | {"kind":"any"} | **required** | [] |

### `colgroup`

Children: `column`. Parents: `struct`.


**Data contract.** Supplies identity, caption and optional colors for a header band. Column membership belongs to the structure Bag.


**Interaction and events.** Moving columns can split or join contiguous header bands while preserving group membership. The group declares no callback.


**Composition.** Place directly under struct and put column declarations inside. The grid renders the group.


**Limits and lifecycle.** Groups cannot nest. Each member column still identifies its own row field.

Additional positional arguments: `False`; additional keyword arguments: `False`.

| Parameter | Passing | Type | Default | Constraints |
| --- | --- | --- | --- | --- |
| `code` | positional_or_keyword | T | **required** | [{"kind":"regex","pattern":"^[A-Za-z_][A-Za-z0-9_]*$","flags":0}] |
| `name` | keyword_only | T | None | [] |
| `background` | keyword_only | T | None | [] |
| `color` | keyword_only | T | None | [] |
