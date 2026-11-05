"""Implementation and qualification evidence for the inputs manual."""

_LEAF = "The component renders its own control and optional field label. It takes no Source children."
_OPTIONS = "The control builds its own popup. Declare choices through the provider, with no Source option children."
_TEXT = "Change commits the string. With `live=True`, input commits outside IME composition. There is no component-specific change callback."
_TYPED = "Enter, change and blur attempt a commit. Live editing commits parseable input. Escape restores the accepted value. There is no component-specific change callback."
_CUSTOMERS = "base/pages/80-database/01-customers.md"

# The rows group the narrative with the implementation and test evidence.
_ROWS = {
    "textbox": (
        "A nullable two-way string. Null displays as empty, while clearing an edited field writes an empty string.",
        _TEXT, _LEAF,
        "Single-line plain text. Outside an editing session, rejected validation can leave a visible draft while Data retains its previous value. In a shared editing session, parseable edits can update Data while validation records errors and blocks acceptance.",
        ["bases"], ["components", "input-validation"], ["01-text/01-textbox.md"],
        "Compares the component with a native HTML input and shows shared labels and styles.",
    ),
    "textBoxArea": (
        "A nullable two-way string can include line breaks. Reactive row and column counts change the presentation of the same Data.",
        _TEXT, _LEAF,
        "The textarea handles plain text. Changing the row count preserves the existing control and caret.",
        ["bases"], ["components"], ["01-text/02-text_box_area.md"],
        "Demonstrates a multiline string and textarea dimensions.",
    ),
    "passwordbox": (
        "A nullable two-way string. The native password control masks its display while the binding carries the entered string.",
        _TEXT, _LEAF,
        "The component supplies visual masking. Credential handling and storage remain application responsibilities.",
        ["bases"], ["components", "input-validation"], ["01-text/03-passwordbox.md"],
        "Shows masked entry and the bound string.",
    ),
    "checkbox": (
        "A two-way Boolean is shared by checkbox and switch modes. The option caption and switch color affect presentation.",
        "Changing the checked state commits a Boolean. There is no component-specific toggle callback.",
        "A field leaf. Use `label` for the inline option caption and `lbl` for the shared field label.",
        "Only `checkbox` and `switch` are valid modes. Readonly prevents activation while external Data can still update the check.",
        ["bases"], ["components"], ["02-checks_and_switches/01-checkbox.md", "02-checks_and_switches/03-switch.md"],
        "Shows Boolean binding in the standard checkbox and switch presentations.",
    ),
    "radioButton": (
        "Each member owns a two-way Boolean path. Selecting a member of a Source-scoped group clears the other members' Boolean values.",
        "Native activation and group keyboard navigation select a member. Writes go through the member bindings. There is no component-specific group callback.",
        "A field leaf. Declare group members as separate Source nodes with their own labels and bindings.",
        "Use `disabled` to lock interaction. Removing a member releases its group membership.",
        ["bases"], ["components"], ["03-selection/02-radio_button.md"],
        "Demonstrates individually declared radios with Boolean bindings.",
    ),
    "radioButtonText": (
        "A nullable string stores the selected code from the `code:Caption` pairs in `values`.",
        "A native radio change commits the code. There is no component-specific selection callback.",
        "The field generates options from `values` and arranges them in `cols` columns. It takes no Source option children.",
        "The column count must be positive. Readonly and disabled lock the options. Caption updates can retain the selected code.",
        ["bases", "choices"], ["components", "component-review"], ["03-selection/01-radio_button_text.md"],
        "Shows one selected code behind a group of captions.",
    ),
    "checkBoxText": (
        "A nullable string stores comma-separated codes, or null for no selection. Editing preserves the order of retained codes and appends newly selected ones.",
        "A native check change commits the code list. Arrows, Home and End move focus among options. There is no component-specific selection callback.",
        "The field generates options from text or Bag `values`, or a complete `dbtable`/`method` result. `popup=True` puts the same choices behind a caption button; `cols` arranges them. It takes no Source option children.",
        "The column count must be positive. Readonly and disabled lock the options. An edit preserves stored codes that have no current visible option.",
        ["bases", "choices", "check-box-text"], ["choice-components", "input-validation"], ["02-checks_and_switches/02-checkbox_text.md"],
        "Shows inline and popup choices sharing their bound code list.",
    ),
    "colorpicker": (
        "A two-way color string projects to a native color input, with `#000000` as the component default.",
        "The native chooser commits on change, or on input with `live=True`. There is no component-specific color callback.",
        _LEAF, "The browser supplies the chooser and its accepted color representation. Use `disabled` to lock it.",
        ["bases"], ["components"], ["04-colorpicker.md"],
        "Demonstrates a native color choice reflected in bound Data.",
    ),
    "horizontalSlider": (
        "A two-way real number uses the native range grid defined by reactive `min`, `max` and `step`.",
        "Native range interaction commits on change, or on input with `live=True`. There is no component-specific slider callback.",
        _LEAF,
        "A finite incoming value that the range clamps or snaps can write a correction through a plain reactive value binding. Shared controls need compatible ranges. Use `disabled` to lock it.",
        ["bases"], ["components"], ["05-numbers_and_sliders/01-horizontal_slider.md"],
        "Shows a horizontal numeric range and its step size.",
    ),
    "verticalSlider": (
        "A two-way real number uses the same range grid as the horizontal slider.",
        "Native range interaction commits on change, or on input with `live=True`. There is no component-specific slider callback.",
        "A field leaf with an internal range that exposes a vertical accessibility orientation.",
        "Browser range rules can clamp or snap incoming finite Data and write the correction through a plain reactive value binding. Use `disabled` to lock it.",
        ["bases"], ["components"], ["05-numbers_and_sliders/02-vertical_slider.md"],
        "Shows the vertical presentation and its numeric value.",
    ),
    "numberTextBox": (
        "A nullable typed number. Use the default finite real entry, `dtype='L'` for safe integers or `dtype='N'` for exact Decimal entry. Empty input commits null.",
        _TYPED, _LEAF,
        "Entry accepts the locale decimal symbol but rejects grouping separators, incomplete numbers and input outside configured bounds. Exact editing requires a Decimal backend and also follows an existing Decimal value. A rejected parse leaves the last typed Data value in place.",
        ["typed-editor"], ["typed-components", "form-state"], ["05-numbers_and_sliders/03-number_textbox.md"],
        "Demonstrates numeric formats and bounds. Typed-editor tests cover exact Decimal entry.",
    ),
    "dateTextBox": (
        "A nullable civil date (`D`). Formatting and text drafts are separate from Data. Relative entry uses `workdate` or local today as its reference.",
        "Enter, change and blur attempt a commit. Live mode commits parseable input, and selecting a calendar day commits the typed date directly. Escape cancels the draft. There is no component-specific date callback.",
        "A field leaf with an internal trigger and popup unless `calendar=False`.",
        "The parser requires a single date unless period_to declares a relative Data output path. An accepted period writes its start to value and its end to period_to; ordinary dates leave that output unchanged. Empty input commits null, while an invalid expression preserves both typed values. Disabling the calendar or releasing the editor closes its popup.",
        ["typed-editor", "date-calendar"], ["typed-components", "calendar-components", "form-state"],
        ["06-dates_and_times/01-date_textbox.md", "06-dates_and_times/03-date_calendar.md"],
        "Shows formatted date entry and the shared calendar presentation.",
    ),
    "dateCalendar": (
        "A two-way nullable civil date (`D`). `workdate` can supply the reference day for the calendar view.",
        "Month and keyboard navigation move the view or focus without a Data write. Selecting a day or using Clear commits a date or null. There is no component-specific day callback.",
        "An inline field leaf with internal navigation, day grid and clear control.",
        "Readonly and disabled lock interaction. The control checks for civil dates and locks its view when released.",
        ["date-calendar"], ["calendar-components", "input-validation"], ["06-dates_and_times/03-date_calendar.md"],
        "Shows inline and popup calendars sharing typed date Data.",
    ),
    "timeTextBox": (
        "A nullable civil time (`H`) uses the TYTX time epoch and preserves seconds and milliseconds without a timezone conversion. Clearing commits null.",
        _TYPED, _LEAF,
        "Entry uses a 24-hour clock with minutes, optional seconds and optional fractional seconds. Display formats leave the entry grammar unchanged.",
        ["typed-editor"], ["typed-components"], ["06-dates_and_times/02-time_textbox.md"],
        "Shows civil times with different display formats.",
    ),
    "filteringSelect": (
        "A nullable string code resolves to a caption in local `values`. Search matches captions case-insensitively and identity lookup compares codes.",
        "Mouse or keyboard choice commits the code. Clearing commits null and Escape cancels the draft. There is no component-specific selection callback.",
        _OPTIONS,
        "An unmatched caption remains a draft even in live mode. Codes must be nonempty and unique. `separator` changes the delimiter between declared options.",
        ["choice-editor", "choices"], ["choice-components", "component-review"], ["03-selection/03-filtering_select.md"],
        "Shows caption search and the stored identity from a closed local set.",
    ),
    "callbackSelect": (
        "A nullable string code. The named browser Logic provider returns `{rows, identifier, caption}` with unique nonempty string codes and string captions.",
        "The provider receives `_querystring` or `_id` and can return a Promise. Mouse or keyboard choice commits the code. There is no component-specific selection notification.",
        _OPTIONS,
        "The provider owns filtering. The editor discards obsolete results on superseding edits and release and reports lookup failures in its choice error state.",
        ["choice-editor"], ["choice-components"], ["03-selection/04-callback_select.md"],
        "Shows a named browser Logic provider. Choice tests cover request races and failures.",
    ),
    "comboBox": (
        "A nullable string stores the entered text or selected caption. Supply `values` (which may be empty) or a `store` Bag whose node values are unique string codes and whose `caption` attributes are strings.",
        "Mouse or keyboard choice commits the caption. Free text also commits through the editor, including live input outside composition. There is no component-specific selection callback.",
        _OPTIONS,
        "The bound value distinguishes null from an edited empty string. Malformed or duplicate Bag choices are rejected.",
        ["choice-editor"], ["choice-components"], ["03-selection/05-combo_box.md"],
        "Shows suggestions alongside free text. Choice tests cover the Bag-backed provider.",
    ),
    "dbSelect": (
        "A nullable string or safe integer key identifies the selection. The endpoint returns `{rows, identifier, caption}`. Caption, record and requested `selected_*` projections are separate from the key.",
        "The page's remote service uses `method` for searches and identity lookup. Accepted selection writes the outputs and calls optional named Logic `selectedCb` with `{value, record}`. Identity resolution can refresh outputs without notifying that callback.",
        "A field leaf with an internal popup. Its optional sanitized row template supports record placeholders in text.",
        "Unmatched drafts cannot write a key. `autoSelect` checks for a sole candidate with a two-row request. Selections using `validate_notnull` have a condition-change check. Database behavior and required response fields belong to the provider.",
        ["choice-editor", "database-choices"], ["database-components", "form-state"], [_CUSTOMERS],
        "Shows search, clearing, projected locality and state, and auxiliary columns in a database-backed gallery.",
    ),
    "dbComboBox": (
        "A nullable string stores a selected caption or free text. Selection can populate caption, record and field projections. Free-text or clear commits remove the previous selection outputs.",
        "The remote service supplies suggestions. Choosing a row or committing free text goes through validation. Optional named Logic `selectedCb` receives the accepted value and a record or null.",
        "A field leaf with an internal suggestion popup and optional sanitized row template.",
        "The editor waits for a complete edit even with `live=True`. Condition changes preserve free text and do not auto-select a sole candidate. The provider runs in the configured host.",
        ["choice-editor", "database-choices"], ["database-components"], [_CUSTOMERS],
        "Shows Enter accepting free text and arrows or clicking choosing a customer suggestion.",
    ),
    "editingStatus": (
        "Reads the nearest shared editing session's errors and baseline-relative changes. It declares no value binding or separate change journal.",
        "Errors and Changes open live reports. Selecting an entry asks the session to focus the Data path and closes the report on success. There is no public report callback.",
        "Place this leaf within a Source scope that provides a shared editing session. Its internal report controls take no Source children.",
        "Mounting without a session raises an error. A field that cannot be focused leaves a notice without changing the grid filter. Disconnecting releases the session subscription and closes the popup.",
        ["editing-status"], ["form-state", "grid-editing"], ["pages/05-grid_editable/10_editing.md"],
        "Shows shared form and grid reports, offscreen editor recovery and filtered rows.",
    ),
}

COVERAGE = {
    name: {
        "data": data,
        "events": events,
        "children": children,
        "limits": limits,
        "sources": [f"js/src/components/{source}.js" for source in ["inputs", *sources]],
        "tests": [f"js/tests/{test}.test.js" for test in tests],
        "examples": [
            "src/gramlot_examples/" + (path if path.startswith(("base/", "pages/")) else "pages/01-inputs/" + path)
            for path in examples
        ],
        "example_note": example_note,
    }
    for name, (data, events, children, limits, sources, tests, examples, example_note) in _ROWS.items()
}
