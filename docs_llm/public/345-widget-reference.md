# Widget and parameter reference

Document ID: **GC-345**.

Compact index of the effective component metadata. The full counterpart contains
every declared parameter, type, default, binding and child contract. It covers this
development checkout and does not assign maturity or release acceptance.

<a id="gc-345-005"></a>

<a id="gc-345-010"></a>

Ordinary Source/CSS attributes and dynamic prefixes are separate from component
metadata. Page.gramlots selects prepared descriptors; buttons are built in.


<a id="gc-345-015"></a>
<a id="gc-345-textbox"></a>
## textbox

Collection: inputs. Single-line text with label, validation and optional live updates.


<a id="gc-345-020"></a>
<a id="gc-345-checkbox"></a>
## checkbox

Collection: inputs. Boolean value, displayed as a checkbox or a switch.


<a id="gc-345-025"></a>
<a id="gc-345-radiobuttontext"></a>
## radioButtonText

Collection: inputs. A group of local radio choices storing one option code.


<a id="gc-345-030"></a>
<a id="gc-345-textboxarea"></a>
## textBoxArea

Collection: inputs. Multiline plain text with the same field and validation contract.


<a id="gc-345-035"></a>
<a id="gc-345-passwordbox"></a>
## passwordbox

Collection: inputs. Masked text entry; masking does not encrypt or persist the value.


<a id="gc-345-040"></a>
<a id="gc-345-radiobutton"></a>
## radioButton

Collection: inputs. One Boolean radio option; the Source-scoped group keeps its members mutually exclusive.


<a id="gc-345-045"></a>
<a id="gc-345-colorpicker"></a>
## colorpicker

Collection: inputs. Browser color input, with a bound color value.


<a id="gc-345-050"></a>
<a id="gc-345-horizontalslider"></a>
## horizontalSlider

Collection: inputs. A bounded numeric range displayed horizontally.


<a id="gc-345-055"></a>
<a id="gc-345-verticalslider"></a>
## verticalSlider

Collection: inputs. A bounded numeric range displayed vertically.


<a id="gc-345-060"></a>
<a id="gc-345-numbertextbox"></a>
## numberTextBox

Collection: inputs. Locale-aware numeric editing; Data keeps the declared numeric type.


<a id="gc-345-065"></a>
<a id="gc-345-datetextbox"></a>
## dateTextBox

Collection: inputs. Civil date editing with an optional calendar popup.


<a id="gc-345-070"></a>
<a id="gc-345-timetextbox"></a>
## timeTextBox

Collection: inputs. Civil time editing with locale-aware text parsing.


<a id="gc-345-075"></a>
<a id="gc-345-filteringselect"></a>
## filteringSelect

Collection: inputs. Search a closed set of local choices; Data stores the selected code.


<a id="gc-345-080"></a>
<a id="gc-345-callbackselect"></a>
## callbackSelect

Collection: inputs. Choices supplied by a page callback.


<a id="gc-345-085"></a>
<a id="gc-345-combobox"></a>
## comboBox

Collection: inputs. Suggestions with free text allowed.


<a id="gc-345-090"></a>
<a id="gc-345-dbselect"></a>
## dbSelect

Collection: inputs. Endpoint-backed choices. Requires an application endpoint implementing the choice response contract; it supplies no database adapter.


<a id="gc-345-095"></a>
<a id="gc-345-dbcombobox"></a>
## dbComboBox

Collection: inputs. Endpoint-backed suggestions with free text; the application owns the endpoint and persistence.


<a id="gc-345-100"></a>
<a id="gc-345-checkboxtext"></a>
## checkBoxText

Collection: inputs. A local multi-choice group storing the selected codes.


<a id="gc-345-105"></a>
<a id="gc-345-datecalendar"></a>
## dateCalendar

Collection: inputs. An inline civil-date calendar.


<a id="gc-345-110"></a>
<a id="gc-345-button"></a>
## button

Collection: buttons. An application action button using the existing action/Logic contract.


<a id="gc-345-115"></a>
<a id="gc-345-togglebutton"></a>
## toggleButton

Collection: buttons. A command button with a bound Boolean selected state.


<a id="gc-345-120"></a>
<a id="gc-345-dropdownbutton"></a>
## dropDownButton

Collection: buttons. Separate main-action and submenu surfaces; distinct from a menu bar.


<a id="gc-345-125"></a>
<a id="gc-345-menu"></a>
## menu

Collection: buttons. A hierarchy presented as a popup or a permanent horizontal/vertical toolbar.


<a id="gc-345-130"></a>
<a id="gc-345-menuline"></a>
## menuline

Collection: buttons. A command, separator, submenu parent or indivisible toolbar group.


<a id="gc-345-135"></a>
<a id="gc-345-spacer"></a>
## spacer

Collection: buttons. Fixed or elastic space in a menu/toolbar; it does not publish a command.


<a id="gc-345-140"></a>
<a id="gc-345-dialog"></a>
## dialog

Collection: layout. A modal window containing a framePane; remains modal when collapsed or maximized.


<a id="gc-345-145"></a>
<a id="gc-345-floatingpane"></a>
## floatingPane

Collection: layout. A nonmodal window containing a framePane.


<a id="gc-345-150"></a>
<a id="gc-345-framepane"></a>
## framePane

Collection: layout. A border composition exposing top, bottom, left, right and center region builders.


<a id="gc-345-155"></a>
<a id="gc-345-formlet"></a>
## formlet

Collection: layout. Responsive field layout with shared label alignment.


<a id="gc-345-160"></a>
<a id="gc-345-groupbox"></a>
## groupBox

Collection: layout. A labelled content group, optionally collapsible, with an optional Data copy command.


<a id="gc-345-165"></a>
<a id="gc-345-contentpane"></a>
## contentPane

Collection: layout. A content area or a child region/panel of a layout container.


<a id="gc-345-170"></a>
<a id="gc-345-bordercontainer"></a>
## borderContainer

Collection: layout. Five regions with optional splitters, drawers and nested layouts.


<a id="gc-345-175"></a>
<a id="gc-345-stackcontainer"></a>
## stackContainer

Collection: layout. One selected panel at a time, without a tab strip.


<a id="gc-345-180"></a>
<a id="gc-345-tabcontainer"></a>
## tabContainer

Collection: layout. Selected panels with shaped or underlined tabs on any side.


<a id="gc-345-185"></a>
<a id="gc-345-tree"></a>
## tree

Collection: tree. Hierarchical Bag presentation with selection, disclosure and declared drag behavior.


<a id="gc-345-190"></a>
<a id="gc-345-codemirror"></a>
## codeMirror

Collection: editors. Code/text editor with composed language and editor options.


<a id="gc-345-195"></a>
<a id="gc-345-htmleditor"></a>
## htmlEditor

Collection: editors. Rich HTML editing using the supported engine configuration.


<a id="gc-345-200"></a>
<a id="gc-345-htmlpreview"></a>
## htmlPreview

Collection: editors. Read-only HTML preview with the component sanitization contract.


<a id="gc-345-205"></a>
<a id="gc-345-markdowneditor"></a>
## markdownEditor

Collection: editors. Markdown editing with the supported editor modes.


<a id="gc-345-210"></a>
<a id="gc-345-markdownpreview"></a>
## markdownPreview

Collection: editors. Rendered Markdown preview.


<a id="gc-345-215"></a>
<a id="gc-345-typstpreview"></a>
## typstPreview

Collection: typst. Typst document preview and optional client PDF compilation; compiler resources are separate from ordinary forms.

