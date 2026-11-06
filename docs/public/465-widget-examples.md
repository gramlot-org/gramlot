# Appendix: widget examples

Document ID: **GC-465**.

<a id="gc-465-005"></a>
## How to use this appendix

The manual explains contracts; this appendix holds setup snippets and links to teaching pages. A matching lesson does not certify every parameter, browser or server. Gaps are listed explicitly. The examples remain owned and maintained in `gramlot-examples`; linked repository sources show the lesson and its companions.

<a id="gc-465-environment"></a>
## Collection setup

Declare the shared collections on the environment Page base. Individual pages inherit them.

```python
from gramlot import Page as GramlotPage
from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout

class Page(GramlotPage):
    gramlots = [inputs, layout]

    def main(self, root):
        root.textbox(value="^customer.name", lbl="Customer", live=True)
```


<a id="gc-465-setup-inputs"></a>
## Inputs: setup

[Collection manual](410-inputs.md). The environment must supply the collection and the services described in that manual. The following body belongs in `main(self, root)`; it is not a standalone application.

```python
pane = root.div(datapath="customer")
pane.textbox(value="^.name", lbl="Name", live=True)
pane.numberTextBox(value="^.seats", lbl="Seats")
```

`^` paths are relative to the containing datapath when they start with a dot. Put interface defaults in `default`; load record values into Data. Do not rebuild a control when its value changes.

For typed fields, incomplete text belongs to Source editing state; Data retains the last typed value. A parseable value can be invalid under validation rules: the form tracks the error and blocks saving. See [form editing state](340-components-and-collections-guide.md#gc-340-110) and [field behavior](105-components.md#gc-105-040).

`dbSelect` and `dbComboBox` describe remote choices, not a built-in database. The generic `method` contract uses an application endpoint; Asqueel query capabilities require its server integration. A file-only export cannot execute Python endpoints or provide a database integration; a JavaScript Worker endpoint may supply its own values.


<a id="gc-465-editingstatus"></a>
### `editingStatus`

Shows shared form and grid reports, offscreen editor recovery and filtered rows.

- [10_editing](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-grid_editable/10_editing.md)

<a id="gc-465-textbox"></a>
### `textbox`

Compares the component with a native HTML input and shows shared labels and styles.

- [01-textbox](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/01-text/01-textbox.md)

<a id="gc-465-checkbox"></a>
### `checkbox`

Shows Boolean binding in the standard checkbox and switch presentations.

- [01-checkbox](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/02-checks_and_switches/01-checkbox.md)
- [03-switch](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/02-checks_and_switches/03-switch.md)

<a id="gc-465-radiobuttontext"></a>
### `radioButtonText`

Shows one selected code behind a group of captions.

- [01-radio_button_text](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/03-selection/01-radio_button_text.md)

<a id="gc-465-textboxarea"></a>
### `textBoxArea`

Demonstrates a multiline string and textarea dimensions.

- [02-text_box_area](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/01-text/02-text_box_area.md)

<a id="gc-465-passwordbox"></a>
### `passwordbox`

Shows masked entry and the bound string.

- [03-passwordbox](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/01-text/03-passwordbox.md)

<a id="gc-465-radiobutton"></a>
### `radioButton`

Demonstrates individually declared radios with Boolean bindings.

- [02-radio_button](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/03-selection/02-radio_button.md)

<a id="gc-465-colorpicker"></a>
### `colorpicker`

Demonstrates a native color choice reflected in bound Data.

- [04-colorpicker](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/04-colorpicker.md)

<a id="gc-465-horizontalslider"></a>
### `horizontalSlider`

Shows a horizontal numeric range and its step size.

- [01-horizontal_slider](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/05-numbers_and_sliders/01-horizontal_slider.md)

<a id="gc-465-verticalslider"></a>
### `verticalSlider`

Shows the vertical presentation and its numeric value.

- [02-vertical_slider](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/05-numbers_and_sliders/02-vertical_slider.md)

<a id="gc-465-numbertextbox"></a>
### `numberTextBox`

Demonstrates numeric formats and bounds. Typed-editor tests cover exact Decimal entry.

- [03-number_textbox](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/05-numbers_and_sliders/03-number_textbox.md)

<a id="gc-465-datetextbox"></a>
### `dateTextBox`

Shows formatted date entry and the shared calendar presentation.

- [01-date_textbox](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/06-dates_and_times/01-date_textbox.md)
- [03-date_calendar](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/06-dates_and_times/03-date_calendar.md)

<a id="gc-465-timetextbox"></a>
### `timeTextBox`

Shows civil times with different display formats.

- [02-time_textbox](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/06-dates_and_times/02-time_textbox.md)

<a id="gc-465-filteringselect"></a>
### `filteringSelect`

Shows caption search and the stored identity from a closed local set.

- [03-filtering_select](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/03-selection/03-filtering_select.md)

<a id="gc-465-callbackselect"></a>
### `callbackSelect`

Shows a named browser Logic provider. Choice tests cover request races and failures.

- [04-callback_select](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/03-selection/04-callback_select.md)

<a id="gc-465-combobox"></a>
### `comboBox`

Shows suggestions alongside free text. Choice tests cover the Bag-backed provider.

- [05-combo_box](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/03-selection/05-combo_box.md)

<a id="gc-465-dbselect"></a>
### `dbSelect`

Shows search, clearing, projected locality and state, and auxiliary columns in a database-backed gallery.

- [01-customers](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/base/pages/80-database/01-customers.md)

<a id="gc-465-dbcombobox"></a>
### `dbComboBox`

Shows Enter accepting free text and arrows or clicking choosing a customer suggestion.

- [01-customers](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/base/pages/80-database/01-customers.md)

<a id="gc-465-checkboxtext"></a>
### `checkBoxText`

Shows inline and popup choices sharing their bound code list.

- [02-checkbox_text](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/02-checks_and_switches/02-checkbox_text.md)

<a id="gc-465-datecalendar"></a>
### `dateCalendar`

Shows inline and popup calendars sharing typed date Data.

- [03-date_calendar](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/06-dates_and_times/03-date_calendar.md)

<a id="gc-465-setup-buttons"></a>
## Menus and buttons: setup

[Collection manual](415-buttons.md). The environment must supply the collection and the services described in that manual. The following body belongs in `main(self, root)`; it is not a standalone application.

```python
bar = root.menu(presentation="bar")
bar.menuline("documents:save")
bar.spacer(flex=1)
bar.menuline("documents:close")
```

This body assumes the environment has registered `documents:save` and `documents:close`. The entries inherit the registered captions/icons; commands publish to the configured target. A Save command does not itself persist Data. [Register commands and choose targets](350-menus-toolbars-and-windows.md).

The same guide covers resolver submenus, context/modifier opening, grouped overflow, priorities and icon-only presentation. Use `iconSrc` for SVG images; `icon` is text/emoji. The buttons collection is built into the base grammar.


<a id="gc-465-button"></a>
### `button`

Covers commands and the difference between native form submission and delayed Gramlot activation.

- [01-button](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/08-buttons/01-button.md)
- [03-plain_and_delayed_buttons](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/03-controllers/02-actions/03-plain_and_delayed_buttons.md)

<a id="gc-465-togglebutton"></a>
### `toggleButton`

Demonstrates the boolean binding and LED.

- [02-toggle_button](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/08-buttons/02-toggle_button.md)

<a id="gc-465-dropdownbutton"></a>
### `dropDownButton`

Demonstrates main versus menu activation, Shift selection and persistence.

- [03-dropdown_button](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/08-buttons/03-dropdown_button.md)

<a id="gc-465-menu"></a>
### `menu`

Shows bar and popup composition, then resolver-owned entries and their refresh behavior.

- [02_toolbar](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-menus/02_toolbar.md)
- [04_menu_bar](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-menus/04_menu_bar.md)
- [07_resolver](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-menus/07_resolver.md)

<a id="gc-465-menuline"></a>
### `menuline`

Shows submenu composition and live command state. Resolver and overflow cases are covered in the menu lessons.

- [04_menu_bar](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-menus/04_menu_bar.md)
- [05_live_states](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-menus/05_live_states.md)

<a id="gc-465-spacer"></a>
### `spacer`

Uses spacing in a toolbar composition.

- [02_toolbar](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-menus/02_toolbar.md)

<a id="gc-465-setup-layout"></a>
## Layout and windows: setup

[Collection manual](420-layout.md). The environment must supply the collection and the services described in that manual. The following body belongs in `main(self, root)`; it is not a standalone application.

```python
tabs = root.tabContainer(height="240px")
for key, title in (("details", "Details"), ("notes", "Notes")):
    panel = tabs.contentPane(node_label=key, title=title, datapath=key)
    panel.textbox(value="^.text", lbl=title)
```

This example also uses the inputs collection. Distinct relative datapaths isolate each panel's Data. `title` is a child parameter projected by the tab container, not a textbox parameter. See [containers](105-components.md#gc-105-085).

Use the shared Labelbox (`lbl`, `lbl_*`, `box_*`) around HTML or components. A `trayPane` owns card geometry and selection through its `storepath` Bag; moving/resizing its DOM must retain content and bindings. [Tray workspaces](105-components.md#gc-105-970). `transformPane` metadata declares read bindings, but user gestures write simple reactive `^` pointers during interaction; `onEnd` receives final values. [Form state and editingStatus](340-components-and-collections-guide.md#gc-340-110) track local changes/errors/pending validation; accepting a local baseline is not a server save.


<a id="gc-465-transformpane"></a>
### `transformPane`

The dedicated lesson shares pose Data between gestures and numeric controls, applies a separate child CSS transform, records onEnd and preserves editable content on reset.

- [09-transform_pane](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-containers/09-transform_pane.md)

<a id="gc-465-dialog"></a>
### `dialog`

Shows modal composition and a dialog hosting a mounted editor.

- [04-dialog](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-containers/04-dialog.md)
- [10_dialog_editor](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-menus/10_dialog_editor.md)

<a id="gc-465-floatingpane"></a>
### `floatingPane`

Shows a floating window alongside its working page and an editor hosted inside it.

- [05-floating](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-containers/05-floating.md)
- [14_floating_editor](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-menus/14_floating_editor.md)

<a id="gc-465-framepane"></a>
### `framePane`

Shows frame regions as both layout and command boundaries.

- [06_frame_pane](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-menus/06_frame_pane.md)

<a id="gc-465-traypane"></a>
### `trayPane`

Shows geometry Data, editable cards and a larger gallery composition.

- [07-tray](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-containers/07-tray.md)
- [08-gallery_tray](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-containers/08-gallery_tray.md)

<a id="gc-465-formlet"></a>
### `formlet`

Shows field layout and inherited presentation defaults.

- [02-formlet](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/07-forms_and_validation/02-formlet.md)

<a id="gc-465-groupbox"></a>
### `groupBox`

Shows labeled grouping and scoped copy.

- [06-group_box](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-containers/06-group_box.md)

<a id="gc-465-contentpane"></a>
### `contentPane`

Shows panes in frame and border regions. The lessons teach the enclosing layouts.

- [06_frame_pane](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-menus/06_frame_pane.md)
- [01-border](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-containers/01-border/01-border.md)

<a id="gc-465-bordercontainer"></a>
### `borderContainer`

Shows regional layout, sizing and region notifications.

- [01-border](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-containers/01-border/01-border.md)
- [06-border_events](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-containers/01-border/06-border_events.md)

<a id="gc-465-stackcontainer"></a>
### `stackContainer`

Shows selection driven outside a tab strip.

- [03-stack](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-containers/03-stack.md)

<a id="gc-465-tabcontainer"></a>
### `tabContainer`

Shows tab navigation and selection. Detachment and closure are covered by the component tests.

- [02-tabs](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-containers/02-tabs.md)

<a id="gc-465-setup-tree"></a>
## Trees: setup

[Collection manual](425-tree.md). The environment must supply the collection and the services described in that manual. The following body belongs in `main(self, root)`; it is not a standalone application.

```python
pane = root.div(datapath="catalog")
pane.textbox(value="^.search", placeholder="Search", live=True)
pane.tree(storepath=".items", searchText="^.search", height="280px")
```

The example also uses inputs and expects `catalog.items` to contain a Bag, loaded by the page or a resolver. `searchText` filters the tree, including resolvable branches; clearing it restores the prior tree view. Resolver work may involve server requests. [Tree data, selection and drag/drop](105-components.md#gc-105-120). `rowActions` supplies contextual commands; it is not a second data store.


<a id="gc-465-tree"></a>
### `tree`

Covers hierarchy, labels, callbacks, internal drag and checking. The tests also inspect resolver errors, live Source stores and favorites.

- [01-basics](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/09-tree/01-basics.md)
- [02-labels_and_classes](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/09-tree/02-labels_and_classes.md)
- [03-callbacks_and_icons](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/09-tree/03-callbacks_and_icons.md)
- [04-internal_drag](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/09-tree/04-internal_drag.md)
- [05-checkboxes](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/09-tree/05-checkboxes.md)

<a id="gc-465-rowactions"></a>
### `rowActions`

The dedicated lesson contrasts selected and acted-on paths, changes action presentation per row, and demonstrates both a button and a menu command.

- [06-row_actions](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-inputs/09-tree/06-row_actions.md)

<a id="gc-465-setup-editors"></a>
## Editors and previews: setup

[Collection manual](430-editors.md). The environment must supply the collection and the services described in that manual. The following body belongs in `main(self, root)`; it is not a standalone application.

```python
pane = root.div(datapath="draft")
pane.markdownEditor(value="^.text", height="220px")
pane.markdownPreview(value="^.text")
```

Both controls share one value. External Data updates use supported engine setters rather than recreating the editor. Editor instances are not application state. HTML/Markdown rendering uses the runtime sanitization/Markdown services, with component-specific policies; do not bypass them by inserting generated HTML yourself. [Modes and engine options](105-components.md#gc-105-125).

A serverless export opened from file must include the required engine resources in its exported module graph. Do not replace imports with CDN requests or assume a Python endpoint exists in a file-only page.


<a id="gc-465-codemirror"></a>
### `codeMirror`

Text editing and runtime options.

- [01-base](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/06-editors/01-base.md)
- [02-options](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/06-editors/02-options.md)

<a id="gc-465-htmleditor"></a>
### `htmlEditor`

Rich editing, source and preview in one lesson.

- [03-html](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/06-editors/03-html.md)

<a id="gc-465-htmlpreview"></a>
### `htmlPreview`

Preview of the shared HTML source.

- [03-html](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/06-editors/03-html.md)

<a id="gc-465-markdowneditor"></a>
### `markdownEditor`

Editing and preview of a shared draft.

- [04-markdown](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/06-editors/04-markdown.md)

<a id="gc-465-markdownpreview"></a>
### `markdownPreview`

Preview of a shared Markdown draft.

- [04-markdown](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/06-editors/04-markdown.md)

<a id="gc-465-setup-typst"></a>
## Typst previews: setup

[Collection manual](435-typst.md). The environment must supply the collection and the services described in that manual. The following body belongs in `main(self, root)`; it is not a standalone application.

```python
root.typstPreview(value="^document.source", height="360px")
```

Load `document.source` as text before rendering, or bind an editor to the same path. Compiler resources and document assets must be available to the configured preview engine. Do not infer a server endpoint from this component declaration. [Compilation and resource contract](105-components.md#gc-105-145).

`typstPreview` is a document reader/compiler surface, rather than a text editor. Use it when a Data string already contains Typst source and the user needs to inspect the document or download its PDF. To edit that string, place `codeMirror` from the separate `editors` collection beside the preview and bind both to the same Data path. The editor writes the draft; `typstPreview.value` reads it. `filename` controls the download name and can also read a binding; downloading does not save the source document.
```python
pane.codeMirror(value="^.content", language="typst", height="360px")
pane.typstPreview(value="^.content", filename="report.pdf", height="480px")
```



<a id="gc-465-typstpreview"></a>
### `typstPreview`

Source editing, browser preview and PDF download.

- [05-typst](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/06-editors/05-typst.md)

<a id="gc-465-setup-uploads"></a>
## Uploads and attachments: setup

[Collection manual](440-uploads.md). The environment must supply the collection and the services described in that manual. The following body belongs in `main(self, root)`; it is not a standalone application.

```python
root.uploader(operation="receive", storepath="uploads",
              selectedPath="^selectedUpload")
```

Initialize `uploads` as an empty Data Bag before rendering. This body requires the host/application upload operation `receive`. Queue/progress state goes into the Data Bag at `uploads`; selecting a queued file writes the bound `selectedPath`. Declaring the control does not configure storage or permissions. [Upload operations, callbacks and limits](105-components.md#gc-105-uploader). Keep the documented WebKit limitation when qualifying file-input behavior; do not claim that browser automation validates every native chooser interaction.

`selectedPath` is a two-way binding to a row label relative to `storepath`, not an absolute filesystem path. Removing that selected row clears the selection. Each row's `metadata` Bag can back ordinary bound controls. Give an unselected metadata editor its own empty Data scope, so it does not create accidental queue rows. Edit metadata while a row is queued: automatic upload takes its snapshot immediately.
```python
pane.uploader(operation="receive", storepath=".queue",
              selectedPath="^.selected", multiple=True,
              autoUpload=False, onComplete="fileReceived")
```



<a id="gc-465-uploader"></a>
### `uploader`

Deferred transfer and row metadata.

- [02-upload_queue](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-uploader/02-upload_queue.md)

<a id="gc-465-imageuploader"></a>
### `imageUploader`

Crop confirmation. Device capture depends on the environment.

- [04-editable_image](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-uploader/04-editable_image.md)

<a id="gc-465-attachmentmanager"></a>
### `attachmentManager`

Queued files before record save and attachment operations after the context becomes ready.

- [03-attachment_manager](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/01-uploader/03-attachment_manager.md)

<a id="gc-465-setup-grid"></a>
## Grids: setup

[Collection manual](445-grid.md). The environment must supply the collection and the services described in that manual. The following body belongs in `main(self, root)`; it is not a standalone application.

```python
grid = root.grid(storepath="customers", rowMode="values", height="280px")
columns = grid.struct()
columns.column("name", name="Customer")
columns.column("seats", name="Seats", dtype="L")
```

Load `customers` with a Bag whose row nodes contain Bags with `name` and `seats` fields. `storepath` and `rowMode` are required. Use `values` for nested row Bags or `attributes` for rows whose fields are node attributes; these representations are explicit, not guessed. Declare an inline `struct` or use `structpath`, not both.

`frameGrid(...)` is a Python composition helper: it returns a frame with `.grid`, `.top`, `.bottom`, `.left` and `.right` for ordinary Source controls. `searchBox` requires a grid Source context; place it in that composition's toolbar.

Columns are described below, including nested column groups and validation constraints. Column editing uses the shared field/form contract; see [local editing](340-components-and-collections-guide.md#gc-340-110). A resident Bag, server-backed cached selection and database query are different store capabilities. Generic endpoints remain application-owned; Asqueel-only query options require the Asqueel host and its authorization policy. No DB access is implied by `grid`. Viewport output is for the configured store/provider, not an instruction to fetch every row.

Columns come from one inline `struct` or a structure Bag addressed by `structpath`; do not declare both. `struct`, `column` and `colgroup` are Source declarations, not additional browser widgets. A `column` requires its `field`; `name` is its caption and `dtype` describes field type. Widths, alignment and formatting configure presentation. A `colgroup` groups columns beneath a named header and may set group colors. The [structure reference](445-grid.md#gc-445-390) lists the exact permitted names and value formats.
```python
grid = pane.grid(storepath=".customers", rowMode="values", height="280px")
struct = grid.struct()
struct.column("name", name="Customer")
struct.column("seats", name="Seats", dtype="L", edit=True)
```


A column can project an external Data string instead of editing a record:
```python
struct.column("john", name="John", check="multiple",
              checked="^assignments.john", checkedField="id")
```


A data formula computes its field for every resident row and writes the result into the row Bag, so every grid and form on the same Bag sees it. Formula identifiers resolve to row fields and to `formula_<name>` parameters. A parameter written `^path` recalculates the formula when that Data changes; `=path` reads the current value without triggering; any other value is a literal. Paths resolve relative to the grid Source.
```python
struct.column("quantity", dtype="L", edit=True)
struct.column("price", dtype="N")
struct.column("total", dtype="N", formula="quantity * price * (1 + vat / 100)",
              formula_vat="^.vat", calculated=True, totalize=True)
struct.column("position", formula="#")
struct.column("running", dtype="N", formula="+=total")
struct.column("share", dtype="N", formula="%=total", footer_format="0.00")
```


`frameGrid(...)` routes its keywords by list. An unprefixed keyword that the grid declares as a parameter (`footer`, `rowHeaders`, `rowResize`, `selfDragRows`, `sortedBy`, `filter`, `columnFilters`, …) goes to the grid; `storepath`, `rowMode` and `structpath` also go to the grid. Every other keyword (`datapath`, `node_label`, `id`, `height`, style attributes, …) goes to the frame, as does a name that the frame also accepts. `grid_<name>` forces any attribute onto the grid (for example `grid_datapath`, `grid_height`, `grid_class` or a style attribute) and `frame_<name>` onto the frame; the prefix is removed. Giving the same name twice (`footer` and `grid_footer`, `storepath` and `grid_storepath`) is an error. `grid_node_label`, `grid_frameTarget` and `grid_nodeId` are errors because frameGrid composes those grid attributes. The list follows the grid's declared parameters, so a new grid parameter is routed without changing `frameGrid`.
```python
frame = pane.frameGrid(storepath=".rows", rowMode="values", datapath="orders",
                       footer=True, rowHeaders=True, grid_class="compact", frame_height="300px")
```



<a id="gc-465-grid"></a>
### `grid`

Basic resident grid, independent shared-store views, virtualization and local editing.

- [01_basic](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-grid/01_basic.md)
- [05_shared_store](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-grid/05_shared_store.md)
- [08_virtual_scroll](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-grid/08_virtual_scroll.md)
- [10_editing](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-grid_editable/10_editing.md)

<a id="gc-465-searchbox"></a>
### `searchBox`

FrameGrid search and filter syntax.

- [07_search](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-grid/07_search.md)

<a id="gc-465-setup-chat"></a>
## Chat: setup

[Collection manual](450-chat.md). The environment must supply the collection and the services described in that manual. The following body belongs in `main(self, root)`; it is not a standalone application.

```python
from gramlot import ChatPane

chat = ChatPane(root, datapath="assistant", height="480px")
chat.frame.top.strong("Assistant")
```

The environment needs both chat and layout. This body is the UI part; sending also requires the Page Logic delegates and PageStore below, plus a host with PageStore WebSocket enabled. For Uvicorn, pass `websocket=True` to `create_application(pages, websocket=True)`; the default HTTP-only setup is insufficient. Kajenn also supports its explicit WebSocket option. `ChatPane` accepts a required `datapath`, optional `chat_id="main"` (a literal identifier starting with a letter, then letters/digits/underscores), and frame attributes. Each conversation uses its own Data scope. `.frame`, `.composer`, `.messages` and `.toolbar` expose existing Source containers for composition.

Companion page JavaScript:

```javascript
import {chatRender, chatSend, chatCompleted, chatReset, chatResize,
        chatPickAttachments, chatRenderAttachments, chatRemoveAttachment}
    from "@gramlot/gramlot";
export class Logic {
    chatRender(node, params) { return chatRender(this.page, node, params); }
    chatSend(node) { return chatSend(this.page, node); }
    chatCompleted(node, params) { return chatCompleted(this.page, node, params); }
    chatReset(node) { return chatReset(this.page, node); }
    chatResize(node) { return chatResize(this.page, node); }
    chatPickAttachments(node) { return chatPickAttachments(this.page, node); }
    chatRenderAttachments(node, params) { return chatRenderAttachments(this.page, node, params); }
    chatRemoveAttachment(node) { return chatRemoveAttachment(this.page, node); }
}
```

A companion PageStore supplies processing; the default hook echoes the submitted message:

```python
from gramlot import ChatPageStore

class PageStore(ChatPageStore):
    pass
```

Override `process_message(self, text)` to return a string or Gramlot SourceBag; plain Data Bags and HTML response formats are not accepted. Distinct panes need distinct `datapath` and `chat_id`; declare allowed IDs in `ChatPageStore.chat_ids` (default `("main",)`). Application integrations replace the processing hook and own credentials, permissions and persistence. Logic only delegates behavior; conversation state remains in Data/Source. The component has no provider/model/temperature parameters. A file-only export cannot execute this Python PageStore.

`chatMessages` is the collection's browser widget: a scrolling container for live Source message children. It allows ordinary Source content and declares no component-specific value, provider or send parameters. Its log role and polite live announcement support conversation reading. Choose it alone when the surrounding application already owns the composition; choose the Python `ChatPane` helper when you need the provided message area, composer, status and toolbar.
```python
from gramlot import ChatPane

chat = ChatPane(root, datapath="assistant", chat_id="main", height="480px")
chat.frame.top.strong("Assistant")
```



<a id="gc-465-chatmessages"></a>
### `chatMessages`

The opt-in echo trial demonstrates the composed recipe and PageStore.

- [01-echo](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/trials/chat_base/pages/92-chat/01-echo.md)

<a id="gc-465-setup-grouplets"></a>
## Grouplets: setup

[Collection manual](455-grouplets.md). The environment must supply the collection and the services described in that manual. The following body belongs in `main(self, root)`; it is not a standalone application.

```python
for key in ("billing", "shipping"):
    root.groupletCard(title=key.title(), remote="address", datapath=key,
                      collapsible=True)
```

Define the Source endpoint on the same Page (the inputs collection supplies textbox):

```python
from gramlot import source

@source
def address(self, pane):
    pane.textbox(value="^.city", lbl="City")
```

The remote binding owns requests, children and cleanup. Do not add a second request from component DOM lifecycle hooks. [Remote Source contract](099-remote-content.md).

`collapsed` and `checkbox` support writeback. `checkbox=None` hides the control; `False` displays it unchecked. `delitem=None` hides Clear, `False` disables it, `True` enables it. The optional `doc` is bound Markdown for the in-card guide; empty text hides its information button. `chromeSide` only accepts top/left/right. Card folding, remote fragments and a full form/save lifecycle are distinct responsibilities; do not infer legacy GroupletForm APIs from this card.

`grouplet` hosts reusable Source content through the existing remote binding. Use it when the parent layout supplies all visual framing. `groupletCard` adds a title, optional folding, a checkbox, actions and an in-card Markdown guide. Both accept ordinary Source children and a read-bound `remote` endpoint name. A relative `datapath` lets the same Source-building method bind different records without duplicating its implementation.
```python
root.groupletCard(title="Billing", remote="address", datapath="billing",
                  collapsible=True, collapsed="^.folded")
```



<a id="gc-465-grouplet"></a>
### `grouplet`

Reusable remote Source, independent scopes and nesting.

- [01-remote_fragment](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/09-grouplets/01-remote_fragment.md)
- [02-independent_instances](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/09-grouplets/02-independent_instances.md)
- [03-nested_fragments](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/09-grouplets/03-nested_fragments.md)

<a id="gc-465-groupletcard"></a>
### `groupletCard`

Independent state, header actions, Clear and inline guides.

- [04-order_cards](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/09-grouplets/04-order_cards.md)
- [05-card_actions](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/09-grouplets/05-card_actions.md)
- [06-card_guides](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/09-grouplets/06-card_guides.md)

<a id="gc-465-setup-charts"></a>
## Charts: setup

[Collection manual](480-charts.md). The environment must supply the collection and the services described in that manual. The following body belongs in `main(self, root)`; it is not a standalone application.

```python
root.chartPane(storepath="sales.rows", configpath="sales.chart", height="500px")
```

Supply rows and a configuration Bag in Data. chartPane composes the shared controls; chartView renders supported types using ECharts, Plotly, Vega or uPlot. Temporal playback selects prepared rows; it does not calculate business aggregates. Map territories must match GeoJSON names. Geographic 3D bars are ECharts-only.


<a id="gc-465-chartpane"></a>
### `chartPane`

Shared chart configuration and time.

- [13_charts](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-grid/13_charts.md)

<a id="gc-465-chartview"></a>
### `chartView`

Shared chart configuration and time.

- [13_charts](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-grid/13_charts.md)

<a id="gc-465-chartfields"></a>
### `chartFields`

Shared chart configuration and time.

- [13_charts](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-grid/13_charts.md)

<a id="gc-465-chartgeojson"></a>
### `chartGeoJSON`

Shared chart configuration and time.

- [13_charts](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-grid/13_charts.md)

<a id="gc-465-charttimeline"></a>
### `chartTimeline`

Shared chart configuration and time.

- [13_charts](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/05-grid/13_charts.md)

<a id="gc-465-setup-vizabi"></a>
## Vizabi: setup

[Collection manual](485-vizabi.md). The environment must supply the collection and the services described in that manual. The following body belongs in `main(self, root)`; it is not a standalone application.

```python
root.vizabiBubble(storepath="rows", configuration="^vizabi", libraryUrl="/assets/vizabi.js", height="500px")
```

Supply a configuration Bag and the compatible external library URL. The host owns library delivery. This specialized integration is not a chartPane engine and is not enabled by the common gallery environment.


<a id="gc-465-vizabibubble"></a>
### `vizabiBubble`

Host-only integration; no common gallery lesson.

No dedicated lesson identified in the reviewed catalogue.


<a id="gc-465-setup-audio"></a>
## Audio analysis: setup

[Collection manual](490-audio.md). The environment must supply the collection and the services described in that manual. The following body belongs in `main(self, root)`; it is not a standalone application.

```python
pane = root.div(datapath="audio")
pane.checkbox(value="^.running", lbl="Microphone")
pane.audioAnalyser(running="^.running", waveform="^.waveform", spectrum="^.spectrum",
                   sampleRate="^.sampleRate", status="^.status", error="^.error")
```

Microphone access requires permission and a secure browser context. Waveform and spectrum are arrays stored as Bag values, not a node per sample. Bind status and error to display feedback. Stopping, pagehide and disposal release the microphone and audio context.


<a id="gc-465-audioanalyser"></a>
### `audioAnalyser`

Microphone analysis is an optional live gallery example.

No dedicated lesson identified in the reviewed catalogue.


<a id="gc-465-setup-drawing"></a>
## Drawing and annotations: setup

[Collection manual](495-drawing.md). The environment must supply the collection and the services described in that manual. The following body belongs in `main(self, root)`; it is not a standalone application.

```python
from genro_bag import Bag
pane = root.div(datapath="drawing")
pane.dataSetter(".annotations", Bag())
pane.drawingPane(annotations="^.annotations", height="360px")
```

Initialize the annotations Bag before mounting. image supplies an optional image URL. The component observes and edits the original Bag; saving to a server is a separate application operation. Its shared menu offers selection, arrows, circles, freehand, text, color, pen width and deletion.


<a id="gc-465-drawingpane"></a>
### `drawingPane`

Drawing annotations retained in Data.

- [06-drawing](https://github.com/gramlot-org/gramlot-examples/blob/c59a19c92af9a09d243b9547e1b75c02e5096e13/src/gramlot_examples/pages/06-editors/06-drawing.md)
