# Widget and parameter reference

Document ID: **GC-345**.

This reference covers all **41 component declarations** in the six packaged
component grammars in this checkout. It is regenerated from their effective
metadata. Widgets are grouped by purpose; inherited and shared parameters are
documented once and linked from each applicable widget. It describes the development checkout;
consult the installed package before relying on a feature in a released application.
It does not assign a maturity level or imply that every component is production-ready.

<a id="gc-345-005"></a>
## 005 · How to read this reference

- `T`: text; `B`: Boolean; `L`: integer; `R`: real number; other codes are TYTX types.
- **read**: a reactive parameter; `^path` updates the presentation from Data.
- **twoWay**: the component also writes accepted edits/state back through the binding.
- **—**: no binding/default declared in component metadata. This is not a claim that
  the surrounding Source binding system has no behavior for the attribute.
- **None** is a declared nullable/default value, not the text `"None"`.
- **Allowed** lists only enumerations explicitly present in metadata. Extra semantic
  validation is explained in the linked family guide and enforced by the runtime.

Ordinary Source attributes (such as `id`, `class_`, `hidden`, `datapath`, `color`,
`padding`, `width`, `height`, event declarations and bindings) are described in
[Writing pages](095-writing-pages.md) and [Themes and CSS](096-themes-and-css.md).
The tables below list component parameters, not an exhaustive HTML/CSS whitelist.
A parent's region/panel attributes belong to that parent; they are shown separately.
Dynamic families such as `lbl_*`, `box_*`, `validate_*`, `resolver_*` and
`condition_*` have additional contracts in the narrative guides.

<a id="gc-345-010"></a>
## 010 · Select the right collection

```python
from gramlot import Page as GramlotPage
from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout

class Page(GramlotPage):
    gramlots = [inputs, layout]

    def main(self, root):
        root.dataSetter("customer.name", "Ada")
        root.textbox(value="^customer.name", lbl="Customer", live=True)
```

Buttons, menu, menuline and spacer belong to the built-in `buttons` grammar.
The other families have prepared descriptors at `gramlot.collections.<name>`.
The base HTML/SVG grammar remains available. `dialog` is the window component;
`html_dialog` explicitly requests the browser's HTML tag.

[Collection loading, generation and overrides](340-components-and-collections-guide.md)
explains the complete package lifecycle. [Examples and visual tour](355-examples-and-visual-tour.md)
connects these controls to runnable lessons and screenshots.

| Collection | Components |
| --- | --- |
| `inputs` | [textbox](#gc-345-textbox), [checkbox](#gc-345-checkbox), [radioButtonText](#gc-345-radiobuttontext), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [radioButton](#gc-345-radiobutton), [colorpicker](#gc-345-colorpicker), [horizontalSlider](#gc-345-horizontalslider), [verticalSlider](#gc-345-verticalslider), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox), [checkBoxText](#gc-345-checkboxtext), [dateCalendar](#gc-345-datecalendar) |
| `buttons` | [button](#gc-345-button), [toggleButton](#gc-345-togglebutton), [dropDownButton](#gc-345-dropdownbutton), [menu](#gc-345-menu), [menuline](#gc-345-menuline), [spacer](#gc-345-spacer) |
| `layout` | [dialog](#gc-345-dialog), [floatingPane](#gc-345-floatingpane), [framePane](#gc-345-framepane), [formlet](#gc-345-formlet), [groupBox](#gc-345-groupbox), [contentPane](#gc-345-contentpane), [borderContainer](#gc-345-bordercontainer), [stackContainer](#gc-345-stackcontainer), [tabContainer](#gc-345-tabcontainer) |
| `tree` | [tree](#gc-345-tree) |
| `editors` | [codeMirror](#gc-345-codemirror), [htmlEditor](#gc-345-htmleditor), [htmlPreview](#gc-345-htmlpreview), [markdownEditor](#gc-345-markdowneditor), [markdownPreview](#gc-345-markdownpreview) |
| `typst` | [typstPreview](#gc-345-typstpreview) |

## Shared parameter contracts

Each widget below links only the shared contracts it supports. A shared name can have different types, defaults or bindings; separate rows preserve those differences.


<a id="gc-345-220"></a>
<a id="gc-345-shared-value"></a>
## Values and bindings

The value type and writeback behavior depend on the control. Use a Data pointer for binding; see [Data binding](097-data-binding.md).

Applies to: [textbox](#gc-345-textbox), [checkbox](#gc-345-checkbox), [radioButtonText](#gc-345-radiobuttontext), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [radioButton](#gc-345-radiobutton), [colorpicker](#gc-345-colorpicker), [horizontalSlider](#gc-345-horizontalslider), [verticalSlider](#gc-345-verticalslider), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox), [checkBoxText](#gc-345-checkboxtext), [dateCalendar](#gc-345-datecalendar), [toggleButton](#gc-345-togglebutton), [codeMirror](#gc-345-codemirror), [htmlEditor](#gc-345-htmleditor), [htmlPreview](#gc-345-htmlpreview), [markdownEditor](#gc-345-markdowneditor), [markdownPreview](#gc-345-markdownpreview), [typstPreview](#gc-345-typstpreview).

| Parameter | Type | Default | Binding | Allowed | Applies to |
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

<a id="gc-345-225"></a>
<a id="gc-345-shared-state"></a>
## Disabled, readonly and live updates

Disabled prevents interaction; readonly preserves reading without accepting edits. live controls when edits reach Data. See [Field behavior](105-components.md#gc-105-040).

Applies to: [textbox](#gc-345-textbox), [checkbox](#gc-345-checkbox), [radioButtonText](#gc-345-radiobuttontext), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [radioButton](#gc-345-radiobutton), [colorpicker](#gc-345-colorpicker), [horizontalSlider](#gc-345-horizontalslider), [verticalSlider](#gc-345-verticalslider), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox), [checkBoxText](#gc-345-checkboxtext), [dateCalendar](#gc-345-datecalendar), [button](#gc-345-button), [toggleButton](#gc-345-togglebutton), [dropDownButton](#gc-345-dropdownbutton), [menuline](#gc-345-menuline), [codeMirror](#gc-345-codemirror), [htmlEditor](#gc-345-htmleditor), [markdownEditor](#gc-345-markdowneditor).

| Parameter | Type | Default | Binding | Allowed | Applies to |
| --- | --- | --- | --- | --- | --- |
| `disabled` | B | False | read | — | All listed above |
| `readonly` | B | False | read | — | [textbox](#gc-345-textbox), [checkbox](#gc-345-checkbox), [radioButtonText](#gc-345-radiobuttontext), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [radioButton](#gc-345-radiobutton), [colorpicker](#gc-345-colorpicker), [horizontalSlider](#gc-345-horizontalslider), [verticalSlider](#gc-345-verticalslider), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox), [checkBoxText](#gc-345-checkboxtext), [dateCalendar](#gc-345-datecalendar), [toggleButton](#gc-345-togglebutton), [codeMirror](#gc-345-codemirror), [htmlEditor](#gc-345-htmleditor), [markdownEditor](#gc-345-markdowneditor) |
| `live` | B | False | read | — | [textbox](#gc-345-textbox), [checkbox](#gc-345-checkbox), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [radioButton](#gc-345-radiobutton), [colorpicker](#gc-345-colorpicker), [horizontalSlider](#gc-345-horizontalslider), [verticalSlider](#gc-345-verticalslider), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox) |
| `live` | B | True | read | — | [codeMirror](#gc-345-codemirror), [htmlEditor](#gc-345-htmleditor), [markdownEditor](#gc-345-markdowneditor) |

<a id="gc-345-230"></a>
<a id="gc-345-shared-labels"></a>
## Labels and field presentation

lbl supplies a field label; lbl_position places it. The lbl_* and box_* style families are described in [Themes and CSS](096-themes-and-css.md).

Applies to: [textbox](#gc-345-textbox), [checkbox](#gc-345-checkbox), [radioButtonText](#gc-345-radiobuttontext), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [radioButton](#gc-345-radiobutton), [colorpicker](#gc-345-colorpicker), [horizontalSlider](#gc-345-horizontalslider), [verticalSlider](#gc-345-verticalslider), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox), [checkBoxText](#gc-345-checkboxtext), [dateCalendar](#gc-345-datecalendar), [groupBox](#gc-345-groupbox), [codeMirror](#gc-345-codemirror), [htmlEditor](#gc-345-htmleditor), [markdownEditor](#gc-345-markdowneditor).

| Parameter | Type | Default | Binding | Allowed | Applies to |
| --- | --- | --- | --- | --- | --- |
| `lbl` | T or None | — | read | — | All listed above |
| `lbl_position` | T | 'TL' | read | 'TL', 'TC', 'TR', 'L', 'R', 'BL', 'BC', 'BR' | All listed above |

<a id="gc-345-235"></a>
<a id="gc-345-shared-placeholder"></a>
## Placeholders

Placeholder text is a hint, not a value or a replacement for a field label.

Applies to: [textbox](#gc-345-textbox), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox).

| Parameter | Type | Default | Binding | Allowed | Applies to |
| --- | --- | --- | --- | --- | --- |
| `placeholder` | T | '' | — | — | All listed above |

<a id="gc-345-240"></a>
<a id="gc-345-shared-validation"></a>
## Validation

The validate_* family belongs to the shared validation contract, not to each widget. See [Validation rules, callbacks and messages](105-components.md#gc-105-076). Rule conditions and messages use the documented _if, _iswarning, _error and _warning suffixes. For example: root.textbox(value="^customer.email", lbl="Email", validate_email=True).

Applies to: [textbox](#gc-345-textbox), [checkbox](#gc-345-checkbox), [radioButtonText](#gc-345-radiobuttontext), [textBoxArea](#gc-345-textboxarea), [passwordbox](#gc-345-passwordbox), [radioButton](#gc-345-radiobutton), [colorpicker](#gc-345-colorpicker), [horizontalSlider](#gc-345-horizontalslider), [verticalSlider](#gc-345-verticalslider), [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [filteringSelect](#gc-345-filteringselect), [callbackSelect](#gc-345-callbackselect), [comboBox](#gc-345-combobox), [dbSelect](#gc-345-dbselect), [dbComboBox](#gc-345-dbcombobox), [checkBoxText](#gc-345-checkboxtext), [dateCalendar](#gc-345-datecalendar), [codeMirror](#gc-345-codemirror), [htmlEditor](#gc-345-htmleditor), [markdownEditor](#gc-345-markdowneditor).

| Parameter | Type | Default | Binding | Allowed | Applies to |
| --- | --- | --- | --- | --- | --- |
| `validate_select` | B or None | — | read | — | All listed above |
| `validate_notnull` | B or None | False | read | — | All listed above |
| `validate_empty` | T / L / N / R / B / D / H / DH / DHZ or None | — | read | — | All listed above |
| `validate_case` | T or None | — | read | 'upper', 'lower', 'title', 'capitalize', 'u', 'l', 't', 'c' | All listed above |
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
| `validate_select_error` | T or None | — | read | — | All listed above |
| `validate_select_warning` | T or None | — | read | — | All listed above |
| `validate_notnull_if` | T / B or None | — | — | — | All listed above |
| `validate_notnull_iswarning` | B or None | — | read | — | All listed above |
| `validate_notnull_error` | T or None | — | read | — | All listed above |
| `validate_notnull_warning` | T or None | — | read | — | All listed above |
| `validate_empty_if` | T / B or None | — | — | — | All listed above |
| `validate_empty_iswarning` | B or None | — | read | — | All listed above |
| `validate_empty_error` | T or None | — | read | — | All listed above |
| `validate_empty_warning` | T or None | — | read | — | All listed above |
| `validate_case_if` | T / B or None | — | — | — | All listed above |
| `validate_case_iswarning` | B or None | — | read | — | All listed above |
| `validate_case_error` | T or None | — | read | — | All listed above |
| `validate_case_warning` | T or None | — | read | — | All listed above |
| `validate_len_if` | T / B or None | — | — | — | All listed above |
| `validate_len_iswarning` | B or None | — | read | — | All listed above |
| `validate_len_error` | T or None | — | read | — | All listed above |
| `validate_len_warning` | T or None | — | read | — | All listed above |
| `validate_min_if` | T / B or None | — | — | — | All listed above |
| `validate_min_iswarning` | B or None | — | read | — | All listed above |
| `validate_min_error` | T or None | — | read | — | All listed above |
| `validate_min_warning` | T or None | — | read | — | All listed above |
| `validate_max_if` | T / B or None | — | — | — | All listed above |
| `validate_max_iswarning` | B or None | — | read | — | All listed above |
| `validate_max_error` | T or None | — | read | — | All listed above |
| `validate_max_warning` | T or None | — | read | — | All listed above |
| `validate_email_if` | T / B or None | — | — | — | All listed above |
| `validate_email_iswarning` | B or None | — | read | — | All listed above |
| `validate_email_error` | T or None | — | read | — | All listed above |
| `validate_email_warning` | T or None | — | read | — | All listed above |
| `validate_regex_if` | T / B or None | — | — | — | All listed above |
| `validate_regex_iswarning` | B or None | — | read | — | All listed above |
| `validate_regex_error` | T or None | — | read | — | All listed above |
| `validate_regex_warning` | T or None | — | read | — | All listed above |
| `validate_call_if` | T / B or None | — | — | — | All listed above |
| `validate_call_iswarning` | B or None | — | read | — | All listed above |
| `validate_call_error` | T or None | — | read | — | All listed above |
| `validate_call_warning` | T or None | — | read | — | All listed above |
| `validate_remote_if` | T / B or None | — | — | — | All listed above |
| `validate_remote_iswarning` | B or None | — | read | — | All listed above |
| `validate_remote_error` | T or None | — | read | — | All listed above |
| `validate_remote_warning` | T or None | — | read | — | All listed above |

<a id="gc-345-245"></a>
<a id="gc-345-shared-icons"></a>
## Icons and label presentation

icon holds text or an emoji; iconSrc loads an image such as SVG. iconSize sizes the icon; labelPosition controls label presentation on menus and toolbars. See [Menus and toolbars](350-menus-toolbars-and-windows.md).

Applies to: [button](#gc-345-button), [toggleButton](#gc-345-togglebutton), [dropDownButton](#gc-345-dropdownbutton), [menu](#gc-345-menu), [menuline](#gc-345-menuline).

| Parameter | Type | Default | Binding | Allowed | Applies to |
| --- | --- | --- | --- | --- | --- |
| `icon` | T | '' | read | — | [button](#gc-345-button), [toggleButton](#gc-345-togglebutton), [dropDownButton](#gc-345-dropdownbutton), [menuline](#gc-345-menuline) |
| `iconSrc` | T | '' | read | — | [button](#gc-345-button), [toggleButton](#gc-345-togglebutton), [dropDownButton](#gc-345-dropdownbutton), [menuline](#gc-345-menuline) |
| `labelPosition` | T | 'beside' | read | 'beside', 'below', 'tooltip' | [menu](#gc-345-menu) |
| `iconSize` | R | 24 | read | — | [menu](#gc-345-menu) |
| `labelPosition` | T or None | — | read | 'beside', 'below', 'tooltip' | [menuline](#gc-345-menuline) |
| `iconSize` | R or None | — | read | — | [menuline](#gc-345-menuline) |

<a id="gc-345-250"></a>
<a id="gc-345-shared-formatting"></a>
## Locale and formatting

Data retains its typed value; locale and format affect presentation and parsing. workdate supplies date-editing context. See [Typed controls](105-components.md#gc-105-040).

Applies to: [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox), [dateCalendar](#gc-345-datecalendar).

| Parameter | Type | Default | Binding | Allowed | Applies to |
| --- | --- | --- | --- | --- | --- |
| `locale` | T or None | — | read | — | All listed above |
| `format` | T or None | — | read | — | [numberTextBox](#gc-345-numbertextbox), [dateTextBox](#gc-345-datetextbox), [timeTextBox](#gc-345-timetextbox) |
| `workdate` | T or None | — | read | — | [dateTextBox](#gc-345-datetextbox), [dateCalendar](#gc-345-datecalendar) |

<a id="gc-345-255"></a>
<a id="gc-345-shared-windows"></a>
## Window behavior and geometry

Dialog and floatingPane share controls, geometry and state. Their movement, resize and collapse defaults differ as shown below. Dialog remains modal, including when collapsed or maximized. See [Windows](350-menus-toolbars-and-windows.md).

Applies to: [dialog](#gc-345-dialog), [floatingPane](#gc-345-floatingpane).

| Parameter | Type | Default | Binding | Allowed | Applies to |
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

<a id="gc-345-260"></a>
<a id="gc-345-shared-regions"></a>
## Border and frame regions

BorderContainer and framePane share region arrangement and persistence. Child region parameters stay with each parent below. See [Containers](105-components.md#gc-105-085).

Applies to: [framePane](#gc-345-framepane), [borderContainer](#gc-345-bordercontainer).

| Parameter | Type | Default | Binding | Allowed | Applies to |
| --- | --- | --- | --- | --- | --- |
| `design` | T | 'headline' | read | 'headline', 'sidebar' | All listed above |
| `persist` | B | False | read | — | All listed above |

<a id="gc-345-265"></a>
<a id="gc-345-shared-selection"></a>
## Panel selection

StackContainer and tabContainer select one child panel; selectedPage uses its page name and selected its index. See [Containers](105-components.md#gc-105-085).

Applies to: [stackContainer](#gc-345-stackcontainer), [tabContainer](#gc-345-tabcontainer).

| Parameter | Type | Default | Binding | Allowed | Applies to |
| --- | --- | --- | --- | --- | --- |
| `selectedPage` | T or None | None | twoWay | — | All listed above |
| `selected` | L or None | None | twoWay | — | All listed above |

<a id="gc-345-300"></a>
## Text fields


<a id="gc-345-015"></a>
<a id="gc-345-textbox"></a>
### `textbox`

Single-line text with label, validation and optional live updates.

Collection: **inputs**. Browser element: `gramlot-textbox`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


<a id="gc-345-035"></a>
<a id="gc-345-passwordbox"></a>
### `passwordbox`

Masked text entry; masking does not encrypt or persist the value.

Collection: **inputs**. Browser element: `gramlot-passwordbox`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


<a id="gc-345-030"></a>
<a id="gc-345-textboxarea"></a>
### `textBoxArea`

Multiline plain text with the same field and validation contract.

Collection: **inputs**. Browser element: `gramlot-text-box-area`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `rows` | L | 4 | read | — |
| `cols` | L | 24 | read | — |

<a id="gc-345-305"></a>
## Choices and selectors


<a id="gc-345-020"></a>
<a id="gc-345-checkbox"></a>
### `checkbox`

Boolean value, displayed as a checkbox or a switch.

Collection: **inputs**. Browser element: `gramlot-checkbox`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `mode` | T | 'checkbox' | read | 'checkbox', 'switch' |
| `switch_color` | T or None | None | read | — |
| `label` | T | '' | — | — |

<a id="gc-345-040"></a>
<a id="gc-345-radiobutton"></a>
### `radioButton`

One Boolean radio option; the Source-scoped group keeps its members mutually exclusive.

Collection: **inputs**. Browser element: `gramlot-radio-button`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `label` | T | '' | — | — |
| `group` | T or None | — | read | — |

<a id="gc-345-025"></a>
<a id="gc-345-radiobuttontext"></a>
### `radioButtonText`

A group of local radio choices storing one option code.

Collection: **inputs**. Browser element: `gramlot-radio-button-text`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `values` | T | — | read | — |
| `cols` | L | 1 | read | — |

<a id="gc-345-100"></a>
<a id="gc-345-checkboxtext"></a>
### `checkBoxText`

A local multi-choice group storing the selected codes.

Collection: **inputs**. Browser element: `gramlot-check-box-text`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `values` | T | — | read | — |
| `cols` | L | 1 | read | — |

<a id="gc-345-045"></a>
<a id="gc-345-colorpicker"></a>
### `colorpicker`

Browser color input, with a bound color value.

Collection: **inputs**. Browser element: `gramlot-colorpicker`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


<a id="gc-345-075"></a>
<a id="gc-345-filteringselect"></a>
### `filteringSelect`

Search a closed set of local choices; Data stores the selected code.

Collection: **inputs**. Browser element: `gramlot-filtering-select`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `values` | T | '' | read | — |
| `separator` | T | ',' | read | — |

<a id="gc-345-080"></a>
<a id="gc-345-callbackselect"></a>
### `callbackSelect`

Choices supplied by a page callback.

Collection: **inputs**. Browser element: `gramlot-callback-select`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `callback` | T | — | — | — |

<a id="gc-345-085"></a>
<a id="gc-345-combobox"></a>
### `comboBox`

Suggestions with free text allowed.

Collection: **inputs**. Browser element: `gramlot-combo-box`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `values` | T | '' | read | — |
| `separator` | T | ',' | read | — |
| `store` | X or None | None | read | — |

<a id="gc-345-090"></a>
<a id="gc-345-dbselect"></a>
### `dbSelect`

Endpoint-backed choices. Requires an application endpoint implementing the choice response contract; it supplies no database adapter.

Collection: **inputs**. Browser element: `gramlot-db-select`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `dbtable` | T | — | read | — |
| `method` | T | 'dbSelect' | read | — |
| `columns` | T | — | read | — |
| `hiddenColumns` | T | — | read | — |
| `order_by` | T | — | read | — |
| `limit` | L | 10 | read | — |
| `searchDelay` | L | 300 | read | — |
| `ignoreCase` | B | True | read | — |
| `hasDownArrow` | B | True | read | — |
| `emptyLabel` | T | '' | read | — |
| `selectedCaption` | T | — | — | — |
| `selectedRecord` | T | — | — | — |
| `selectedCb` | T | — | — | — |
| `autoSelect` | B | False | read | — |

<a id="gc-345-095"></a>
<a id="gc-345-dbcombobox"></a>
### `dbComboBox`

Endpoint-backed suggestions with free text; the application owns the endpoint and persistence.

Collection: **inputs**. Browser element: `gramlot-db-combo-box`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `dbtable` | T | — | read | — |
| `method` | T | 'dbSelect' | read | — |
| `columns` | T | — | read | — |
| `hiddenColumns` | T | — | read | — |
| `order_by` | T | — | read | — |
| `limit` | L | 10 | read | — |
| `searchDelay` | L | 300 | read | — |
| `ignoreCase` | B | True | read | — |
| `hasDownArrow` | B | True | read | — |
| `emptyLabel` | T | '' | read | — |
| `selectedCaption` | T | — | — | — |
| `selectedRecord` | T | — | — | — |
| `selectedCb` | T | — | — | — |

<a id="gc-345-310"></a>
## Numbers, dates and time


<a id="gc-345-060"></a>
<a id="gc-345-numbertextbox"></a>
### `numberTextBox`

Locale-aware numeric editing; Data keeps the declared numeric type.

Collection: **inputs**. Browser element: `gramlot-number-text-box`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation), [Locale and formatting](#gc-345-shared-formatting).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `dtype` | T | 'R' | — | — |
| `min` | R or None | — | read | — |
| `max` | R or None | — | read | — |

<a id="gc-345-050"></a>
<a id="gc-345-horizontalslider"></a>
### `horizontalSlider`

A bounded numeric range displayed horizontally.

Collection: **inputs**. Browser element: `gramlot-horizontal-slider`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `min` | R | 0 | read | — |
| `max` | R | 100 | read | — |
| `step` | R | 1 | read | — |

<a id="gc-345-055"></a>
<a id="gc-345-verticalslider"></a>
### `verticalSlider`

A bounded numeric range displayed vertically.

Collection: **inputs**. Browser element: `gramlot-vertical-slider`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `min` | R | 0 | read | — |
| `max` | R | 100 | read | — |
| `step` | R | 1 | read | — |

<a id="gc-345-065"></a>
<a id="gc-345-datetextbox"></a>
### `dateTextBox`

Civil date editing with an optional calendar popup.

Collection: **inputs**. Browser element: `gramlot-date-text-box`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation), [Locale and formatting](#gc-345-shared-formatting).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `calendar` | B | True | read | — |

<a id="gc-345-105"></a>
<a id="gc-345-datecalendar"></a>
### `dateCalendar`

An inline civil-date calendar.

Collection: **inputs**. Browser element: `gramlot-date-calendar`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation), [Locale and formatting](#gc-345-shared-formatting).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


<a id="gc-345-070"></a>
<a id="gc-345-timetextbox"></a>
### `timeTextBox`

Civil time editing with locale-aware text parsing.

Collection: **inputs**. Browser element: `gramlot-time-text-box`.

[Field behavior, typed values, choices and validation](105-components.md#gc-105-040).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation), [Locale and formatting](#gc-345-shared-formatting).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


<a id="gc-345-315"></a>
## Buttons, menus and toolbars


<a id="gc-345-110"></a>
<a id="gc-345-button"></a>
### `button`

An application action button using the existing action/Logic contract.

Collection: **buttons**. Browser element: `gramlot-button`.

[Commands, hierarchy and toolbar layout](350-menus-toolbars-and-windows.md).

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state), [Icons and label presentation](#gc-345-shared-icons).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `*`. This is a grammar expression, not a list of browser tags.

<a id="gc-345-115"></a>
<a id="gc-345-togglebutton"></a>
### `toggleButton`

A command button with a bound Boolean selected state.

Collection: **buttons**. Browser element: `gramlot-toggle-button`.

[Commands, hierarchy and toolbar layout](350-menus-toolbars-and-windows.md).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Icons and label presentation](#gc-345-shared-icons).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `*`. This is a grammar expression, not a list of browser tags.

<a id="gc-345-120"></a>
<a id="gc-345-dropdownbutton"></a>
### `dropDownButton`

Separate main-action and submenu surfaces; distinct from a menu bar.

Collection: **buttons**. Browser element: `gramlot-drop-down-button`.

[Commands, hierarchy and toolbar layout](350-menus-toolbars-and-windows.md).

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state), [Icons and label presentation](#gc-345-shared-icons).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `persist` | B | False | — | — |

Child grammar: `*`. This is a grammar expression, not a list of browser tags.

<a id="gc-345-125"></a>
<a id="gc-345-menu"></a>
### `menu`

A hierarchy presented as a popup or a permanent horizontal/vertical toolbar.

Collection: **buttons**. Browser element: `gramlot-menu`.

[Commands, hierarchy and toolbar layout](350-menus-toolbars-and-windows.md).

Shared contracts: [Icons and label presentation](#gc-345-shared-icons).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `presentation` | T | 'popup' | — | 'popup', 'bar' |
| `orientation` | T | 'horizontal' | — | 'horizontal', 'vertical' |
| `modifiers` | T or None | — | — | — |
| `resolver` | T or None | — | — | — |
| `cacheTime` | R | -1 | — | — |
| `sync` | B | False | — | — |

Child grammar: `menuline,spacer,contentPane`. This is a grammar expression, not a list of browser tags.

<a id="gc-345-130"></a>
<a id="gc-345-menuline"></a>
### `menuline`

A command, separator, submenu parent or indivisible toolbar group.

Collection: **buttons**. Browser element: `gramlot-menu-line`.

[Commands, hierarchy and toolbar layout](350-menus-toolbars-and-windows.md).

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state), [Icons and label presentation](#gc-345-shared-icons).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `command` | T or None | — | — | — |
| `caption` | T or None | — | — | — |
| `code` | T or None | — | — | — |
| `checked` | B or None | — | read | — |
| `tooltip` | T or None | — | — | — |
| `group` | B | False | — | — |
| `priority` | R | 0 | — | — |
| `overflowable` | B | True | — | — |
| `parameters` | dict or None | — | — | — |
| `favorite` | B | False | — | — |

Child grammar: `*`. This is a grammar expression, not a list of browser tags.

<a id="gc-345-135"></a>
<a id="gc-345-spacer"></a>
### `spacer`

Fixed or elastic space in a menu/toolbar; it does not publish a command.

Collection: **buttons**. Browser element: `gramlot-spacer`.

[Commands, hierarchy and toolbar layout](350-menus-toolbars-and-windows.md).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `size` | R or None | — | — | — |
| `flex` | R or None | — | — | — |

<a id="gc-345-320"></a>
## Forms and containers


<a id="gc-345-155"></a>
<a id="gc-345-formlet"></a>
### `formlet`

Responsive field layout with shared label alignment.

Collection: **layout**. Browser element: `gramlot-formlet`.

[Forms, borders, panels and tabs](105-components.md#gc-105-085).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `columns` | L / T | 1 | read | — |
| `col_min_width` | T or None | — | read | — |

Child grammar: `*`. This is a grammar expression, not a list of browser tags.

<a id="gc-345-160"></a>
<a id="gc-345-groupbox"></a>
### `groupBox`

A labelled content group, optionally collapsible, with an optional Data copy command.

Collection: **layout**. Browser element: `gramlot-group-box`.

[Forms, borders, panels and tabs](105-components.md#gc-105-085).

Shared contracts: [Labels and field presentation](#gc-345-shared-labels).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `copy` | B | False | read | — |
| `lbl_variant` | T | 'bar' | read | 'bar', 'underline' |

Child grammar: `*`. This is a grammar expression, not a list of browser tags.

<a id="gc-345-165"></a>
<a id="gc-345-contentpane"></a>
### `contentPane`

A content area or a child region/panel of a layout container.

Collection: **layout**. Browser element: `gramlot-content-pane`.

[Forms, borders, panels and tabs](105-components.md#gc-105-085).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `*`. This is a grammar expression, not a list of browser tags.

<a id="gc-345-170"></a>
<a id="gc-345-bordercontainer"></a>
### `borderContainer`

Five regions with optional splitters, drawers and nested layouts.

Collection: **layout**. Browser element: `gramlot-border-container`.

[Forms, borders, panels and tabs](105-components.md#gc-105-085).

Shared contracts: [Border and frame regions](#gc-345-shared-regions).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `*`. This is a grammar expression, not a list of browser tags.

Parameters projected by this parent from its children:
| Child parameter | Contract |
| --- | --- |
| `region` | {"enum": ["top", "bottom", "left", "right", "center"], "required": true, "unique": true} |
| `width` | Declared by parent |
| `height` | Declared by parent |
| `drawer_onclick` | {"inline": ["evt", "show"]} |

<a id="gc-345-150"></a>
<a id="gc-345-framepane"></a>
### `framePane`

A border composition exposing top, bottom, left, right and center region builders.

Collection: **layout**. Browser element: `gramlot-frame-pane`.

[Window and frame composition](350-menus-toolbars-and-windows.md).

Shared contracts: [Border and frame regions](#gc-345-shared-regions).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `contentPane`. This is a grammar expression, not a list of browser tags.

Parameters projected by this parent from its children:
| Child parameter | Contract |
| --- | --- |
| `region` | {"enum": ["top", "bottom", "left", "right", "center"], "required": true, "unique": true} |
| `width` | Declared by parent |
| `height` | Declared by parent |
| `drawer_onclick` | {"inline": ["evt", "show"]} |

<a id="gc-345-175"></a>
<a id="gc-345-stackcontainer"></a>
### `stackContainer`

One selected panel at a time, without a tab strip.

Collection: **layout**. Browser element: `gramlot-stack-container`.

[Forms, borders, panels and tabs](105-components.md#gc-105-085).

Shared contracts: [Panel selection](#gc-345-shared-selection).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `*`. This is a grammar expression, not a list of browser tags.

Parameters projected by this parent from its children:
| Child parameter | Contract |
| --- | --- |
| `onClose` | {"inline": []} |

<a id="gc-345-180"></a>
<a id="gc-345-tabcontainer"></a>
### `tabContainer`

Selected panels with shaped or underlined tabs on any side.

Collection: **layout**. Browser element: `gramlot-tab-container`.

[Forms, borders, panels and tabs](105-components.md#gc-105-085).

Shared contracts: [Panel selection](#gc-345-shared-selection).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `tabMode` | T | 'tabs' | read | 'tabs', 'underline' |
| `tabPosition` | T | 'top' | read | 'top', 'bottom', 'left', 'right' |
| `tabAlign` | T | 'start' | read | 'start', 'center', 'end' |

Child grammar: `*`. This is a grammar expression, not a list of browser tags.

Parameters projected by this parent from its children:
| Child parameter | Contract |
| --- | --- |
| `onClose` | {"inline": []} |

<a id="gc-345-325"></a>
## Dialogs and floating windows


<a id="gc-345-140"></a>
<a id="gc-345-dialog"></a>
### `dialog`

A modal window containing a framePane; remains modal when collapsed or maximized.

Collection: **layout**. Browser element: `gramlot-dialog`.

[Window and frame composition](350-menus-toolbars-and-windows.md).

Shared contracts: [Window behavior and geometry](#gc-345-shared-windows).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `framePane`. This is a grammar expression, not a list of browser tags.

<a id="gc-345-145"></a>
<a id="gc-345-floatingpane"></a>
### `floatingPane`

A nonmodal window containing a framePane.

Collection: **layout**. Browser element: `gramlot-floating-pane`.

[Window and frame composition](350-menus-toolbars-and-windows.md).

Shared contracts: [Window behavior and geometry](#gc-345-shared-windows).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `framePane`. This is a grammar expression, not a list of browser tags.

<a id="gc-345-330"></a>
## Trees


<a id="gc-345-185"></a>
<a id="gc-345-tree"></a>
### `tree`

Hierarchical Bag presentation with selection, disclosure and declared drag behavior.

Collection: **tree**. Browser element: `gramlot-tree`.

[Tree stores, labels and selection](105-components.md#gc-105-120).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `storepath` | T | — | — | — |
| `draggable` | B | False | read | — |
| `labelAttribute` | T or None | None | read | — |
| `hideValues` | B | False | read | — |
| `labelCb` | T or None | None | — | — |
| `getLabel` | T or None | None | — | — |
| `getLabelClass` | T or None | None | — | — |
| `getIconClass` | T or None | None | — | — |
| `selectedLabelClass` | T | '' | read | — |
| `autoCollapse` | B | False | read | — |
| `selectedPath` | T or None | None | twoWay | — |

<a id="gc-345-335"></a>
## Editors and document previews


<a id="gc-345-190"></a>
<a id="gc-345-codemirror"></a>
### `codeMirror`

Code/text editor with composed language and editor options.

Collection: **editors**. Browser element: `gramlot-code-mirror`.

[Editor composition and document behavior](105-components.md#gc-105-125).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `language` | T | 'text' | read | 'text', 'python', 'javascript', 'typescript', 'json', 'html', 'css', 'xml', 'markdown', 'sql', 'typst' |
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

<a id="gc-345-195"></a>
<a id="gc-345-htmleditor"></a>
### `htmlEditor`

Rich HTML editing using the supported engine configuration.

Collection: **editors**. Browser element: `gramlot-html-editor`.

[Editor composition and document behavior](105-components.md#gc-105-125).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


<a id="gc-345-200"></a>
<a id="gc-345-htmlpreview"></a>
### `htmlPreview`

Read-only HTML preview with the component sanitization contract.

Collection: **editors**. Browser element: `gramlot-html-preview`.

[Editor composition and document behavior](105-components.md#gc-105-125).

Shared contracts: [Values and bindings](#gc-345-shared-value).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


<a id="gc-345-205"></a>
<a id="gc-345-markdowneditor"></a>
### `markdownEditor`

Markdown editing with the supported editor modes.

Collection: **editors**. Browser element: `gramlot-markdown-editor`.

[Editor composition and document behavior](105-components.md#gc-105-125).

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


<a id="gc-345-210"></a>
<a id="gc-345-markdownpreview"></a>
### `markdownPreview`

Rendered Markdown preview.

Collection: **editors**. Browser element: `gramlot-markdown-preview`.

[Editor composition and document behavior](105-components.md#gc-105-125).

Shared contracts: [Values and bindings](#gc-345-shared-value).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `allowHtml` | B | False | read | — |

<a id="gc-345-215"></a>
<a id="gc-345-typstpreview"></a>
### `typstPreview`

Typst document preview and optional client PDF compilation; compiler resources are separate from ordinary forms.

Collection: **typst**. Browser element: `gramlot-typst-preview`.

[Typst compiler and resource ownership](105-components.md#gc-105-145).

Shared contracts: [Values and bindings](#gc-345-shared-value).

| Specific parameter | Type | Default | Binding | Allowed |
| --- | --- | --- | --- | --- |
| `filename` | T | 'document.pdf' | read | — |
