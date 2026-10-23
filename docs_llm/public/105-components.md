# Components

Document ID: **GC-105**.

Use the [widget and parameter reference](345-widget-reference.md) to find a control,
its collection, defaults and bindings. Read [menus, toolbars and windows](350-menus-toolbars-and-windows.md)
for the shared command model and complete frame composition.

> Input components require the selected `inputs` collection; importing a definition
> alone does not activate it. The gallery uses the application configuration below.
> The command family in §095 is built in; layout uses its separate collection.

<a id="gc-105-005"></a>
## 005 · One definition, two authoring languages

A component has one JavaScript definition: its parameters and browser behavior.
Python reads the generated JSON grammar; it does not run JavaScript and does not
need a handwritten Python class for each widget. Widget names are identical in
both languages and lookup is case-insensitive: `radioButtonText` and
`radiobuttontext` select the same declaration. Underscores are not case variants.

The inputs collection contains `textbox`, `checkbox`, `radioButtonText`, `textBoxArea`,
`passwordbox`, `radioButton`, `colorpicker`, `horizontalSlider`, `verticalSlider`,
`numberTextBox`, `dateTextBox`, `timeTextBox`, `filteringSelect`, `callbackSelect`,
`comboBox`, `dbSelect`, `dbComboBox`, `checkBoxText` and `dateCalendar`.
It demonstrates a single native control and a composite group using the same
labelbox and binding contract. Localization is prepared through `intl_str`
metadata; text is not translated.

<a id="gc-105-010"></a>
## 010 · Author the controls in Python

This complete authoring example uses the existing explicit Builder collection API.
For an application, select the collection once as described in §035.

```python
import json
from importlib.resources import files
from gramlot import GramlotBuilder
from genro_tytx import to_tytx

inputs = json.loads(
    files("gramlot").joinpath("collections/inputs.json").read_text()
)
builder = GramlotBuilder(collections=[inputs])
pane = builder.root.div(datapath="form")

pane.textbox(
    value="^.customer", placeholder="Name and surname",
    lbl="Customer", lbl_position="TL", lbl_color="navy",
    box_c_width="260px", box_margin_bottom="12px",
)
pane.checkbox(
    value="^.newsletter", lbl="Contact",
    label="Send me the newsletter", box_margin_bottom="12px",
)
pane.radioButtonText(
    value="^.shipping",
    values="standard:Standard,express:Express,pickup:Pickup",
    cols=3, lbl="Shipping", lbl_position="^label_position",
)
pane.dataSetter(destination_path="form.customer", value="Ada")
pane.dataSetter(destination_path="form.newsletter", value=False)
pane.dataSetter(destination_path="form.shipping", value="standard")
pane.dataSetter(destination_path="label_position", value="TL")
wire = to_tytx(builder.source)
```

`lbl` labels the entire field. For a checkbox, `label` is the caption beside the
box. A radio group stores one option code (`express`), not a list of booleans.
The bounded `values` syntax is `code:Caption,code:Caption`; duplicate codes fail.
Codes without a colon use the code as their caption. Options from a Bag and
escaping of commas and colons are not supported.

Textbox uses `change` by default and `input` with `live=True`, including the
existing IME composition handling. Empty input writes `""`; displaying a Data
`None` as an empty field does not rewrite it. `readonly` and `disabled` are
reactive native-control properties. Radio groups accept `disabled`.

<a id="gc-105-015"></a>
## 015 · Activate the browser collection

The browser entry point selects the collection and mounts the received Source:

```javascript
import {Gramlot} from '@gramlot/gramlot';
import inputs from '@gramlot/gramlot/components/inputs';

const app = new Gramlot({
    element: document.getElementById('gramlot-root'),
    transport: false,
    collections: [inputs]
});
app.src.startSource(wire); // TYTX produced by the Python authoring above
```

Bundle this entry point as one module graph. The existing application/runtime
bootstrap owns loading that entry point; this is a low-level runtime example. For hosted Python pages, use
`Page.gramlots` as shown in section 035. Each selected collection
registers its custom-element classes in the destination document's realm before
rendering. Reusing the same collection there is harmless. A conflicting tag
registration raises an error. There is no per-widget `customElements.define`
in application code, and no scanning of installed packages.

For JavaScript authoring, pass `[inputs]` to `GramlotBuilder` too. Methods are
`pane.textbox({...})`, `pane.checkbox({...})`, `pane.radioButtonText({...})`.

<a id="gc-105-020"></a>
## 020 · Shared labels and layout

| Parameter prefix | Destination |
| --- | --- |
| `lbl` | Field label text, qualified as `intl_str` |
| `lbl_position` | Label position; `TL` by default; can bind to Data |
| `lbl_*` | Label attributes/styles |
| `box_*` | Outer labelbox attributes/styles |
| `box_l_*` | Label container attributes/styles |
| `box_c_*` | Control container attributes/styles |

`TL`, `TC`, `TR` place the label above, aligned left/center/right. `L` and `R`
place it beside the control. `BL`, `BC`, `BR` place it below. The labelbox applies
these changes without recreating the input, preserving focus and the selection.
Specific prefixes are resolved before generic prefixes, and `lbl_position` is
consumed as layout rather than sent to the label element.

Style shortcuts use the same renderer as ordinary Source elements. For example,
`lbl_color="navy"` becomes label CSS and `box_c_width="^width:{}px"` binds the
control-container width. Removing an attribute or resolving it to null removes
its previous projection. Reading another Source attribute never consumes it.
Native script attributes remain forbidden, including under these prefixes.
See [styles and CSS](096-themes-and-css.md).

The internal shadow DOM keeps label IDs local to each instance. Text and checkbox
labels associate with their native input; radio groups use `aria-labelledby` and
native radio inputs sharing a name within that group's shadow tree. A `radioButtonText` instance owns its option group. Separate `radioButton`
instances instead join the existing Source-scoped boolean group using `group`;
the runtime maintains exclusivity and arrow navigation across their shadow roots.

<a id="gc-105-025"></a>
## 025 · Define and compose components

```javascript
import {
    defineComponent, defineCollection, NativeControl, Labelbox, FieldState
} from '@gramlot/gramlot/components';

const Searchbox = defineComponent({
    name: 'searchbox', tag: 'app-searchbox',
    base: NativeControl, mixins: [Labelbox, FieldState],
    parameters: {
        value: {dtype: 'T', nullable: true, binding: 'twoWay'},
        placeholder: {dtype: 'T', qualification: 'intl_str', default: 'Search', target: 'control'}
    },
    implementation: Base => class extends Base {
        createControl() {
            const input = this.ownerDocument.createElement('input');
            input.type = 'text';
            return input;
        }
        readControlValue() { return this.control.value; }
        writeControlValue(value) {
            if (this.control.value !== (value ?? '')) this.control.value = value ?? '';
        }
    }
});

export default defineCollection({name: 'search', components: [Searchbox]});
```

The DOM creation here belongs to framework/component implementation. Applications
continue to declare Source; they do not scrape inputs or install a second binding
system. `NativeControl` supplies lifecycle and the inner native control;
`ChoiceGroup` supplies multiple options and one selected code. `Labelbox` adds
both metadata and layout; `FieldState.setFieldState({invalid, pending})` projects
accessibility state, without deciding validation or commit policy.

Effective metadata combines the base, mixins in declared order, then explicit
component parameters. Conflicting mixin declarations fail; concrete parameters
can override an inherited declaration. The class factory runs only during browser
activation. Importing definitions and calling `collection.toDocument()` require no
DOM. JSON includes the effective parameters, including inherited label metadata.
`intl_str` is exported as a string signature plus its retained qualification.

Generate the built-in Python artifact with `node js/scripts/export-components.mjs`.
The ordinary runtime build also runs this export, and tests compare the generated
document against the JS definitions to detect drift.

<a id="gc-105-030"></a>
## 030 · Current limits and verification

The inputs collection covers the nineteen controls listed above, Data binding,
reactive labelbox, styling prefixes, typed editing, constrained choices, keyboard
behavior and cleanup. Validation is described in §076. Other input families, form
submission and reset of a component through ElementInternals, automatic collection
discovery and translated messages are not provided. The packaged density and color
profiles style components through shared CSS tokens; see [Themes and CSS](096-themes-and-css.md). The component value does not accept `:` or `:=`
transforms; those remain available on presentation attributes.

A known upstream Python Builders limitation affects a literal-type-or-pointer
signature: `Union[bool, Annotated[str, Regex(...)]]` accepts arbitrary strings
because its nested Regex is not checked. JavaScript rejects them. A direct
expected-failure regression records this discrepancy; Gramlot adds no consumer
validation workaround. Valid booleans, integers and pointers work in both languages.
The Python grammar loader also retains nullable declarations explicitly so
`textbox(value=None)` remains distinct from a boolean-only checkbox value.

The Python-first fixture is in `tests/fixtures/components/inputs.py`. Automated
browser qualification runs on Chromium and WebKit, including label click/focus,
caret preservation, typing, checkbox clicks, radio arrow-key navigation and group
isolation. WebKit qualification is not a claim of testing the Safari application.

<a id="gc-105-035"></a>
## 035 · Activate collections in a Python page

Select prepared collection descriptors through `Page.gramlots`. The import supplies
both grammar metadata and verified browser resources; the host resolves dependencies
and sends the matching descriptors in the bootstrap.

```python
from gramlot import Page as GramlotPage
from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout

class Page(GramlotPage):
    gramlots = [inputs, layout]

    def main(self, root):
        root.dataSetter("customer", {"name": "Ada", "active": True})
        form = root.formlet(datapath="customer", columns=1, max_width="28rem")
        form.textbox(value="^.name", lbl="Name", live=True)
        form.checkbox(value="^.active", label="Active", mode="switch")
```

The base grammar and command buttons remain available. Prepared descriptors are
also provided for `gramlot.collections.tree`, `editors` and `typst`. Importing a
package alone does not select it. Class-local `gramlots` selections accumulate
through the Page inheritance hierarchy, with dependencies loaded first.

Do not assemble `{grammar, module}` URL-only entries for this preparation path.
See [How components and collections work](340-components-and-collections-guide.md)
for package generation, dependencies, CSS/assets, integrity checks and deliberate
overrides. Its development-status notice applies to the prepared collection tools.

<a id="gc-105-040"></a>
## 040 · Simple native input variants

These controls reuse NativeControl, Labelbox, FieldState and the existing Data
binding engine. They have the same names and parameters in Python and JavaScript.
The HTML elements `textarea`, `input` and `html_button` keep their meaning.

| Component | Native control | Data value | Specific parameters |
| --- | --- | --- | --- |
| `textBoxArea` | `textarea` | string or null | `placeholder`, `rows=4`, `cols=24` |
| `passwordbox` | password input | string or null | `placeholder` |
| `radioButton` | radio input | boolean | `group`, `label` |
| `colorpicker` | color input | color string | initial value `#000000` |
| `horizontalSlider` | horizontal range input | number | `min=0`, `max=100`, `step=1` |
| `verticalSlider` | vertical range input | number | the same numeric parameters |

```python
pane.textBoxArea(value="^.notes", lbl="Notes", rows=4, cols=24, live=True)
pane.passwordbox(value="^.secret", lbl="Password", placeholder="Enter a password")
pane.radioButton(value="^.standard", group="delivery", label="Standard", lbl="Delivery")
pane.radioButton(value="^.express", group="delivery", label="Express")
pane.colorpicker(value="^.color", lbl="Color", live=True)
pane.horizontalSlider(value="^.level", lbl="Level", min=0, max=100, step=5, live=True)
pane.verticalSlider(value="^.level", lbl="Same level", min=0, max=100, step=5, live=True)
```

Initialize these Data paths with `dataSetter`, as in §010. Each single radio stores
its own boolean; choosing one clears the other bound radios in the same `group`
and Source form scope. This differs from `radioButtonText`, which stores one option
code. Arrow keys navigate grouped single radios across their shadow roots, skipping
disabled controls. An unrelated group remains independent.

Text, password, multiline, color and range controls write on `change` by default;
`live=True` writes on `input`. Slider writes are numbers, including fractional
steps. Color writes are the native browser's serialized color string; the initial
scope uses ordinary opaque hex colors. Color normalization remains presentation-only
until an editing event commits it.

Horizontal and vertical sliders also correct finite numeric values received from
Data: the native range applies `min`, `max` and `step`, then the slider writes the
result back through its plain reactive `value` pointer only if it differs. This
also applies initially and when reactive limits or step change. With `step=1`,
`176.73` becomes `177` in Data, so a bound panel and its label follow the same
number. This correction is independent of `live`, which governs user editing
events. Equal writes and reentrant corrections are suppressed; literal and `=`
values never write Data. Controls sharing a Data path must use compatible ranges
and step grids. Other component normalization contracts are unchanged.
`disabled` works across the family; native `readonly` applies to text/password/
multiline editing, not to radios, color pickers or sliders. Use `disabled` there.
Password masking hides the display only: its Data value remains inspectable.

Vertical sliders use CSS writing mode and direction: minimum at the bottom,
maximum at the top. ArrowUp increases and ArrowDown decreases. Home/End retain
the browser's native behavior; WebKit and Chromium can choose opposite endpoints
in this writing mode. No custom keyboard replacement is added for native ranges.

All six variants support `lbl`, reactive `lbl_position`, `lbl_*` and `box_*`.
For compact examples, place them in a card with `width="100%", max_width="24rem"`;
use `box_c_width` when a narrower control container is needed. The vertical control
starts at 10rem high. The gallery demonstrates shared values, live/commit switching,
reactive label placement and disabled state without fixed viewport-wide fields.

The bounded verification covers Python-authored TYTX, numeric metadata export,
shared values, selection preservation, radio grouping/cleanup and native editing.
Browser tests exercise Chromium and WebKit on Python, Node and serverless, including
real range drags and 360px overflow checks. Color value events are automated; the
operating-system color chooser itself is not driven by those tests.


<a id="gc-105-045"></a>
## 045 · Numeric, date and time text editors

`numberTextBox`, `dateTextBox` and `timeTextBox` reuse NativeControl, TypedEditor,
Labelbox and FieldState. They are text editors: localized presentation and typed
Data are separate. Native `input(type="number"/"date"/"time")` remains available.

```python
from datetime import date, time
from decimal import Decimal

# Page.locale = "it-IT"; omitted locale uses the page/browser context.
pane.numberTextBox(value="^.amount", lbl="Amount", format="0.00",
                   min=0, max=100, lbl_position="^position", box_c_width="14rem")
pane.numberTextBox(value="^.quantity", lbl="Quantity", dtype="L")
pane.numberTextBox(value="^.exact", lbl="Exact amount", dtype="N", format="0.00")
pane.dateTextBox(value="^.day", lbl="Date", format="long")
pane.timeTextBox(value="^.departure", lbl="Departure", format="medium")
pane.dataSetter(".amount", 12.5)
pane.dataSetter(".quantity", 3)
pane.dataSetter(".exact", Decimal("9007199254740993.25"))
pane.dataSetter(".day", date(2026, 10, 16))
pane.dataSetter(".departure", time(9, 30))
```

| Editor | Data | Editing grammar |
| --- | --- | --- |
| `numberTextBox` | finite Number; Decimal for `dtype="N"` | Locale decimal separator, sign and optional exponent; no grouping separators. `dtype="L"` requires a safe integer. Optional `min`/`max` bound accepted edits. |
| `dateTextBox` | civil `D` | Existing date parser: locale date or supported words such as `oggi`/`domani`; one complete date, not a period. Without `workdate`, relative words use the browser's current local day at each edit, not the current field value. `workdate` explicitly overrides that reference day. |
| `timeTextBox` | civil `H` | 24-hour `H:mm`/`HH:mm`, optional `:ss` and `.fff`; no timezone shift. |

Focus shows editable text; leaving shows Gramlot formatting. The component's
`format` is the formatter's `pattern`; `locale` overrides the page locale.
Numbers default to `0.####################`, dates/times to `short`. Temporal
`short`/`medium`/`long`/`full` are display styles, not parser patterns. A short time
can hide seconds without removing them from Data; focus restores full precision.
JS carries D as UTC midnight and H on 1970-01-01 UTC. Their declared dtype prevents
midnight being displayed as a timestamp. Time editing preserves milliseconds.

Valid edits commit on Enter or change/blur, or on input with `live=True`. Invalid
or partial drafts remain visible with an associated message and `aria-invalid`;
they do not overwrite Data. Escape restores the last accepted value. Empty text
writes null (unlike textbox, which writes an empty string). A new Data value
replaces the draft. Editing keeps the locale captured at focus; later presentation
uses current attributes. IME, readonly, disabled, label placement and cleanup use
the shared control path. No time popup is
introduced in this block. Decimal formatting requires an exact TYTX Decimal
backend and Intl support for exact decimal strings; unsupported precision support
raises rather than silently rounding through a Number.

<a id="gc-105-050"></a>
## 050 · Portable dtype signatures

Component parameters declare `dtype` using the TYTX registry, with independent
`nullable`, `binding`, default and presentation metadata:

```javascript
value: {dtype: 'D', nullable: true, binding: 'twoWay'}
lbl: {dtype: 'T', qualification: 'intl_str', binding: 'read'}
```

A list such as `dtype: ['L', 'R', 'N']` declares a union. Exported grammar uses
`{kind: 'dtype', dtype: 'D'}`; nullable adds `NN`, and a bound non-text parameter
also accepts a pointer string. Python uses TYTX's `SUFFIX_TO_TYPE`; JS uses
`getRegisteredType`, with TYTX's Decimal recognition for N. Unknown dtype codes
fail grammar loading. Values are never stringified or decoded just to validate
an annotation. Existing named primitive grammar descriptors remain readable.
Python's grammar exporter emits dtype descriptors for registered domain classes
such as date, time and Decimal; component JSON uses dtype for primitives too.

The internal `setPageContext` supplies formatting and Decimal operations from the
page runtime. A separately bundled collection therefore uses the same TYTX
identity as the Data; it must not bundle a second Decimal registry for editing.
`acceptControlValue` validates/parses a draft, `sameControlValue` compares typed
values, and the existing ControlAdapter remains the only Data writer.

<a id="gc-105-055"></a>
## 055 · Local and callback choices

Both controls display a caption and store its string code. They share labelbox,
readonly/disabled behavior and the existing value binding. Native `select` remains
available separately. A query is an editing draft: even with `live=True`, typing
never writes that query into Data.

```python
pane.filteringSelect(value="^delivery", values="standard:Standard,express:Express",
                     lbl="Delivery", box_c_width="16rem")
pane.callbackSelect(value="^sample", callback="searchChoices",
                    lbl="Sample", box_c_width="18rem")
```

`filteringSelect.values` accepts comma-separated `code:Caption` entries (an entry
without a colon uses the same text for both). It can itself be a pointer. Updating
it refreshes choices and the caption of the current code. Codes must be unique,
nonempty strings. A selected code absent from the list is shown with an error;
refreshing choices never silently changes Data.

`callbackSelect.callback` names an existing page Logic method, including the usual
group-qualified names. The method receives `(node, kw)` with either `_querystring`
for a search or `_id` for the caption of an already selected code:

```javascript
export class Logic {
    searchChoices(node, kw) {
        const rows = node.GET('samples').getNodes().map(item => ({
            id: item.getValue().getItem('id'),
            name: item.getValue().getItem('name')
        }));
        return {
            rows: rows.filter(row => kw._id != null ? row.id === kw._id
                : row.name.toLocaleLowerCase().includes(kw._querystring.toLocaleLowerCase())),
            identifier: 'id', caption: 'name'
        };
    }
}
```

The result is `{rows, identifier, caption}`: `rows` is an array of records, and the
other two properties name their code and caption fields. Codes and captions are
strings; codes are nonempty and unique within a result. The provider owns search
policy; the component does not filter its results a second time. The method may
return a Promise. Pending state uses `aria-busy`; a superseded response or a response
after disposal cannot replace the current results. Errors are shown beside the
field. This uses the same Logic registry as controllers, without an inline-code
fallback, separate callback registry or endpoint requirement.

Click the arrow or press Down to open choices, use Up/Down to move, then Enter or
a click to select. Enter with an open list chooses its highlighted row. A unique
exact caption can also be committed on change/blur. Arbitrary text remains an
invalid draft; the existing Data value stays intact. Escape cancels the draft.
An empty committed field writes null. A new external Data value resolves its
caption. The popup uses the browser Popover API and stays in the top layer.

The gallery lessons *Filtering select* and *Callback select* progress from local
pairs to 100 records generated once in a Data Bag. The Python page of *Callback
select* declares the component and a startup controller;
shared browser Logic creates and searches the random records. There is no server
request and repeated searches preserve the records. Cards and fields have bounded
widths. Free-text comboBox and multiple selections follow in §§060–065.
Store and database providers are not provided.


<a id="gc-105-060"></a>
## 060 · Suggestions with free text

`comboBox` uses the same popup and labelbox as filteringSelect, but accepts text
outside the list. It stores the text itself; choosing a suggestion stores its
caption rather than a separate identity code.

```python
pane.comboBox(value="^city", values="Rome,Paris,Berlin", lbl="City")
```

The `values` parameter supports the same local pairs and reactive pointer as
filteringSelect. For a `code:Caption` pair, comboBox still writes the caption.
External unlisted text is valid. Empty edits write an empty string, as textbox
does; an untouched null remains null. Change/blur or Enter commits by default;
`live=True` writes each edit through the existing binding and IME handling.
Enter with an open suggestion list chooses the highlighted item; Escape cancels
an uncommitted draft. Shared readonly, disabled and labelbox rules still apply.
See the gallery lesson *Combo box* for two fields bound to the same city text.


<a id="gc-105-065"></a>
## 065 · Multiple choices with checkBoxText

`checkBoxText` uses the same option-group structure and labelbox as radioButtonText,
with independent checkboxes instead of exclusive radio buttons:

```python
pane.checkBoxText(value="^channels", values="email:Email,sms:SMS,push:Push",
                  lbl="Notifications", cols=2, readonly="^locked")
```

The value is a comma-separated string of codes, such as `email,push`, or null when
no choice is selected. Captions are presentation;
they are not written into Data. Existing selected codes keep their order, new
selections are appended, and deselection removes that code. Two groups bound to
the same Data path synchronize through the existing binding adapter.

`values` uses the same comma-separated `code:Caption` syntax as radioButtonText;
`cols` controls the grid. Both can be Data pointers. Option, column or label
updates preserve retained controls and selection; presentation does not rewrite
Data. `readonly` or `disabled` locks the native checkboxes. Tab/arrows move focus,
Space toggles a checkbox, and Home/End focus the first/last available choice.
The group is labelled through labelbox, with the same `lbl_`, `box_`, `box_l_`
and `box_c_` routing.

The value remains dtype T with independent nullability and two-way binding,
identical in Python and JS. There is no list representation or separate Data
writer. The gallery lesson *Checkbox group* shows two bound groups, reactive
columns, label positions and a readonly switch in compact cards. The group is
inline: a popup mode and options from a Bag or a store are not provided.


<a id="gc-105-070"></a>
## 070 · Inline calendar and date field popup

```python
pane.dateTextBox(value="^.day", lbl="Appointment")  # calendar=True by default
pane.dateTextBox(value="^.day", lbl="Text only", calendar=False)
pane.dateCalendar(value="^.day", lbl="Choose a day", lbl_position="TL")
```

`dateCalendar` displays a compact calendar directly in the page. `dateTextBox`
reuses that same calendar view in a popup. Both read and write a nullable civil
`D` value through the existing control adapter; they never store a display string.
Python and JavaScript use the same names and parameter spellings. `calendar` is a
boolean read binding and may also follow a Data pointer.

Shared calendar parameters are `value`, `locale`, `workdate`, `readonly` and
`disabled`, plus Labelbox's `lbl`, `lbl_position`, `lbl_*` and `box_*` attributes.
`locale` defaults to the page locale. `workdate` is an ISO civil date (`YYYY-MM-DD`),
used by Today and as the initial view when value is null; omitted, it uses the
browser's local today. The calendar preserves the current civil-date convention:
JavaScript carries it at UTC midnight; timezone changes do not shift the day.

Weeks start on Monday. Month and weekday captions use Intl;
Today/Clear/tool captions are English until the localization service is introduced.
Previous/next browse months without changing Data. Arrow keys navigate days/weeks,
Home/End move to Monday/Sunday and PageUp/PageDown browse months (clamping the day
at month end). Enter/Space select. Clear commits null and Today commits workdate.

For dateTextBox, the button or Alt+Down opens the popup. Selecting commits
immediately and returns focus to the editor; Escape closes without selecting.
An invalid text draft is preserved when opening/cancelling: the calendar opens on
the last committed date. `calendar=False` removes the button and disables opening,
without disabling text or natural-language editing. Readonly/disabled close and
lock the popup. Removing the Source node closes it and releases window listeners.
The implementation uses the browser Popover API for top-layer placement.

Try the gallery lesson *Date calendar*: inline calendar, popup editor and text-only
editor share one pointer. *Date editing* also compares the default popup with
`calendar=False`. Range selection, min/max date constraints, time popups and
form-save orchestration are not provided.


<a id="gc-105-075"></a>
## 075 · Required values and text length

```python
pane.textbox(value="^.name", lbl="Name", validate_notnull=True,
             validate_len="2:40",
             validate_notnull_error="Enter your name.",
             validate_len_error="Use 2 to 40 characters.")
```

These parameters belong to the shared FieldState capability, not an individual
widget. Their generated signatures are the same in Python and JavaScript. Rules
and messages accept read bindings; message parameters carry intl_str qualification
without activating translation. Messages omitted or empty use the built-in text.

`validate_notnull=True` rejects null and the empty string. Zero, false and whitespace
are present values: this rule is not a checkbox consent requirement and does not
trim text. `validate_len="2:40"` gives an inclusive minimum/maximum; `"2:"` only
a minimum, `":40"` only a maximum, `"4"` an exact length. Empty optional values
pass the length rule. Length requires a string and uses JavaScript string length
(UTF-16 units), not grapheme counting. For choice components it
checks the stored code/string, not the displayed caption or the number of choices.

A failed edit remains in the control with an associated message. It does not
replace the last valid Data value. A valid edit clears the error and uses the same
ControlAdapter writer as before. Conversion errors are checked before these rules;
a missing required date, for example, is distinct from an unparsable date. Typed
editors and constrained choices do not accept the candidate into their committed
state until these rules pass.

Validation follows the existing editing events: input with live=True where the
component supports it, otherwise change/blur, plus Enter for typed editors. IME
composition completes before validation. Readonly/disabled controls do not commit.
Changing labels or projecting the unchanged Data preserves the rejected draft;
a different external Data value replaces it and clears the rule error. Direct
application writes are not filtered or silently corrected. Current rules are used
on the next edit; there is no form-wide or startup validation.

Invalid controls have an error-colored background; text editors also show their text in red. The normal focus indicator is preserved.
The message is a floating tooltip in the browser top layer, never a row in the
layout. It stays visible for 1.8 seconds and fades out over 200ms, or closes immediately on Escape, scrolling or resizing. Reduced-motion preferences disable the fade animation. Focus or
mouse entry shows the message again while invalid; hiding it does not clear the
error or change Data. Its text remains available through aria-describedby.
Correcting the value clears both the error and tooltip. Removing the component
releases the tooltip timer and window listeners.

One shared message drives aria-invalid, aria-describedby and native custom validity
for input/textarea controls. Native required is configured on compatible text
controls; it is not applied to a checkbox because false is a present boolean.
Native maxlength is not imposed: users must be able to see and correct a rejected
long draft. HTML controls outside the inputs collection keep their behavior.

Try the gallery lesson *Required values and length* for the basics. The complete field engine is described in §076; form and save handling is not provided.

Component shadow roots inherit semantic theme variables for fields, labelbox,
choices, calendar and errors. Base, Compact, mimi and joanna are
available in light/dark mode; see [theme profiles](096-themes-and-css.md).

Text editors request `autocomplete="off"`, `autocorrect="off"`, `autocapitalize="off"` and `spellcheck="false"` on the actual internal input/textarea. These hints reduce unrelated browser/OS suggestions; they cannot force external password managers or OS services to comply. Filtering/callback selection keeps its own accessible list suggestions.


<a id="gc-105-076"></a>
## 076 · Validation engine: transformations, warnings and callbacks

The shared engine runs after the component parses its draft and before its single
ControlAdapter writes Data. Constrained selectors check the selected item before
this pipeline: `validate_select` does not turn a filteringSelect into free text.
HTML controls outside the inputs collection do not use this engine.

Rules run in this order: selection integrity, notnull, empty, case, len, min, max,
email, regex, call, remote. Each rule sees the preceding rule's transformed value.
The first error stops evaluation; warnings accumulate and permit acceptance.
A required empty value fails before `validate_empty`, matching the legacy order.

| Declaration | Meaning |
| --- | --- |
| `validate_empty="Guest"` | Replace null/empty text; false and zero are valid replacement values |
| `validate_case="upper"` | `upper`, `lower`, `title`, `capitalize`; legacy `u/l/t/c` also supported |
| `validate_min=0`, `validate_max=100` | Inclusive typed numeric or temporal limits; exact Decimal comparisons |
| `validate_email=True` | Email-shape warning by default, not proof that an address exists |
| `validate_regex="(?:^[A-Z]+$)"` | JavaScript Unicode regular expression; initial `!` negates the match |
| `validate_call="checkCode"` | Named Logic method, or an activated inline body; may return a Promise |
| `validate_remote="check_code"` | Existing typed data RPC to a Page endpoint, also in a serverless Worker |

Optional null/empty values skip case/len/min/max/email/regex; remote skips null.
`validate_call` receives empty/null candidates too. Numeric/date comparisons do not
parse strings or turn Decimals into floating-point numbers. Date/time bounds are
actual typed values, not date strings. `validate_case` uses Unicode letter words
for title case and consistently normalizes capitalization; unlike legacy it does
not preserve manual capitalization by comparing against the previous Data value.
The email check is a pragmatic shape check, not Dojo's retired regular expression
or a complete RFC mailbox parser.

Every rule supports `validate_<rule>_if` (an activated expression, or boolean),
`validate_<rule>_error`, `_warning`, and `_iswarning`. A supplied warning message
without an error message makes the rule advisory; explicit `_iswarning` wins,
including `False` to make the email check blocking. Messages carry intl_str
metadata; messages are not translated. Messages can use the
`{value}`/`{name}` template grammar. Missing required message values are configuration
errors, never silently successful validation.

```python
pane.textbox(value="^.code", validate_case="upper",
             validate_regex="(?:^[A-Z]{2,6}$)",
             validate_regex_error="Use 2–6 letters.")
pane.textbox(value="^.email", validate_email=True,
             validate_email_iswarning="^.advisory")
pane.textbox(value="^.name", validate_len="4:",
             validate_len_if="enabled", validate_enabled="^.strict")
pane.textbox(value="^.nickname", validate_call="checkNickname",
             validate_onAccept="accepted", validate_onReject="rejected")
```

Named callbacks use the existing Logic registry and `(node, kwargs)` convention:

```javascript
export class Logic {
    checkNickname(node, {value, signal}) {
        return value === 'admin'
            ? {errorcode:'reserved', message:'Choose another nickname.'}
            : true;
    }
    accepted(node, {value, result}) {
        // Data already contains the accepted value here.
        node.SET('status', result.warnings.length ? 'Accepted with warning' : 'Accepted');
    }
}
```

Validation parameters are resolved from Source, never read from DOM. Their
`validate_` prefix is removed in callback/condition arguments: `validate_enabled`
becomes `enabled`. Reserved arguments are `value`, `result`, `validations`,
`userChange` and the cancellation `signal` for validators. `validations` is the
resolved rule dictionary without the prefix. Inline bodies have `this = Source
node`; they and rule conditions must have arrived with activated Source. Named
Logic avoids dynamic compilation. No global evaluator is installed.

A validator returns true/null for success, false for failure, a string error code,
or an object/Bag containing `value`, `errorcode`, `message`, `iswarning`, `required`
and/or `data`. A returned `value` transforms the candidate; typed editors check the
result type before accepting it. A constrained selector cannot replace its stored
code through normalization: change its Data explicitly instead. An optional `data`
patch must be a Bag and the field must resolve a Bag datapath; patches apply only
on acceptance, after the primary value write. Rejected or stale replies never
apply patches. This intentionally corrects legacy remote side effects on rejected
values. It is not a transactional form-save service.

Error-code-specific messages (`validate_call_reserved`, for example) override the
rule's severity message, then the returned message, then the opposite severity's
message, then the code itself. Custom message fields are ordinary validation
parameters; the standard error/warning fields are explicitly typed in the shared
grammar. `result` contains `value`, `modified`, `error`, `warnings`, `issues` and
`datachanges`; each issue records rule, code, severity and message.

`validate_remote_<name>` supplies resolved endpoint arguments; `value` is the
candidate. The suffixes `if/error/warning/iswarning` are rule controls, not endpoint
arguments. A remote endpoint has exactly the same return contract as a local
callback. The legacy `validate__onResult` hook (double underscore) observes a current
remote result before evaluation, through the same named/activated callback path.
`validate_onAccept` runs after the primary Data write and patches; `validate_onReject`
runs with unchanged Data. These are notifications, not additional validators.

Asynchronous work sets `aria-busy`. Further input/composition, changed rules,
readonly/disabled state, an external Data value, rebinding or disposal invalidates
the old result. RPC uses AbortSignal; custom callbacks receive it too. An optional
positive `validate_timeout` is measured in milliseconds. Rejection, timeout and
transport failure retain the draft and last accepted Data. Errors are blocking;
warning tooltips use a distinct severity without aria-invalid or native custom
validity. Both use the existing floating, fading message presentation.

The engine does not validate initial values or filter application Data writes,
and does not introduce a form-wide save API. `validate_nodup`, `validate_exist`
and `validate_gridnodup` are explicit unsupported-configuration errors: they need
database and grid integrations, which are not provided. Try the gallery lessons
*Validation rules and callbacks* and *Required values and length*.

A literal regular expression starting with `^` must be enclosed, for example `(?:^[A-Z]+$)`, because a leading `^` is a Data pointer in Source. This is ordinary regex grouping, not another validation syntax; `validate_regex="^.pattern"` deliberately reads a pattern from Data.

<a id="gc-105-080"></a>
## 080 · Touch interaction and device suitability

Block ID: **GC-105-080**.

Declare the devices for which a page is designed, independently of its theme:

```python
class Page(BasePage):
    devices = ("desktop", "tablet", "phone")
```

JavaScript uses `static devices = ['desktop', 'tablet', 'phone']`.
The default empty declaration means **unspecified**, not unsupported. The server
passes it to the browser as `gramlot.devices`, a frozen array. This metadata is
informational: it does not redirect users, restrict access or make an arbitrary
layout responsive. The author still checks content, navigation and overflow.
The gallery lessons *Textbox and labelbox*, *Date calendar* and *Required values
and length* declare it.

With Base loaded, a primary coarse pointer automatically activates touch sizing.
Applications can explicitly choose through the existing DOM proxy:

```javascript
gramlot.dom.setTouchMode('on');   // touch targets, independent of theme
gramlot.dom.setTouchMode('off');  // ordinary theme density
gramlot.dom.setTouchMode('auto'); // browser pointer detection again
```

This changes presentation only. Source, Data, input instances and rejected drafts
are retained. Text editors have a minimum height of 44 CSS pixels and 16px text;
labelbox labels use 14px, and checkbox/radio option labels, calendar buttons and
choice rows gain touch targets. Palette, light/dark mode, validation, keyboard
editing and Data binding retain their meaning. Validation messages remain
available on focus, so reading them does not require hover.

The gallery offers **Normal / Mobile** immediately above the example. Normal
uses available width and ordinary theme density; Mobile uses up to 390 CSS pixels
and forces touch sizing. Both views share the same iframe and preserve Data and
unaccepted editor text. A Mobile button tooltip reports the page's declaration
(or that it is unspecified). This is a layout preview, not emulation of a real
phone keyboard, gestures or operating system. Check final applications on devices.


Popup triggers appear inside the field on the right: dateTextBox reserves text
padding for its calendar icon, as the choice editors do for their dropdown icon.
The icon remains a keyboard-accessible button; touch mode enlarges its target
inside the field. With calendar=False, both the icon and its reserved space are
absent. Readonly/disabled behavior and Alt+ArrowDown/Escape are unchanged.


<a id="gc-105-085"></a>
## 085 · Formlet, groupBox and switch

Activate both the `inputs` and `layout` collections for a page using fields in
containers. Their JS modules are `@gramlot/gramlot/components/inputs` and
`@gramlot/gramlot/components/layout`; their portable Builder grammars ship as
`gramlot/collections/inputs.json` and `layout.json`. The gallery selects both.
The same case-insensitive authoring names work in Python and JavaScript.

```python
group = pane.groupBox(lbl="Customer", datapath="customer", copy=True)
fields = group.formlet(
    col_min_width="18rem", lbl_position="L", gap="8px 16px",
)
fields.textbox(value="^.name", lbl="Name")
fields.dateTextBox(value="^.date", lbl="Date")
fields.checkbox(value="^.enabled", lbl="Active", mode="switch")
fields.textBoxArea(value="^.notes", lbl="Notes", lbl_position="TL")
```

**formlet** is a slotted CSS grid, not a form state or persistence service.
`columns` accepts a positive integer (default 1) or a CSS track list.
`col_min_width` selects an auto-fitting grid instead, shrinking to one column
without overflowing a narrow container. Choose this mode for responsive forms.
`gap`, width and other container styles retain normal Gramlot CSS semantics.

`lbl_*` and `box_*` on formlet are shared presentation defaults for descendant
input components; a nested formlet can override them. Defaults resolve their
pointers in the declaring formlet's Data context. Explicit attributes on each
field win, including a field pointer resolving to null to clear an inherited style. No
attributes are written into the descendant Source. The existing labelbox owns
the field presentation: no second wrapper is created. For `lbl_position="L"`,
formlet automatically measures the widest label in each rendered column and
aligns the controls, with right-aligned labels and the theme gap plus 2px label
padding. Each column and nested formlet sizes independently. Label, font and
responsive column changes recalculate the layout, including shrinking after a
label is shortened or removed. Directly slotted labelled components participate;
ordinary wrappers are separate content, so place related fields directly in a
formlet. `lbl_width` is an optional explicit override on the formlet or field,
not a required size or a default constant. Changing columns or defaults keeps controls, focus and uncommitted
text when the bound Data value has not changed.

**groupBox** supplies an accessible group title and slotted children.
`lbl_variant="bar"` is the default; `"underline"` uses a lighter heading.
The group's labelbox styles address its own title and body, independently of
formlet defaults for fields. A group is not a database record or save service.

With `copy=True`, the header shows a copy icon and a format-menu arrow. Clicking
the icon copies TYTX text; the menu offers TYTX or JSON. Copy reads the current
Bag at the group's explicit `datapath`, including nested values, rather than
rendered DOM or editor drafts. TYTX uses Bag serialization, preserving its
supported types and node attributes. JSON exports the recursive values-only
object: it drops node attributes, can lose type distinctions, and reports values
that the standard JSON serializer cannot encode. It is not a typed round trip.
The action requires browser clipboard permission and a context where clipboard
writing is available. Failure is shown on the copy action and announced as a
status; it never changes Data. Copy is off by default. No paste or drag/drop is
introduced.

**checkbox** accepts `mode="checkbox"` (default) or `mode="switch"`, also
reactively. Switch keeps the same boolean binding and labelbox, with a native
checkbox input exposed as `role="switch"`. Space or a caption click toggles it;
readonly and disabled lock it. Theme tokens `--gramlot-switch-on`,
`--gramlot-switch-off` and `--gramlot-switch-thumb` can customize its palette.
Touch mode increases the clickable option area without changing its Data value.

Use `switch_color="purple"` to override only the active switch track, or
`switch_color="^preferences.switch_color"` for a reactive color. Omission or
`None` restores the theme; the off state remains theme-controlled. The ordinary
`color` attribute still styles text.

```python
fields.checkbox(value="^enabled", mode="switch", switch_color="purple", lbl="Active")
```

The inspector presents literal `mode` values as a dropdown populated from the
component's parameter `enum` metadata. The same mechanism covers `lbl_position`
and `groupBox.lbl_variant`. A bound attribute such as `mode="^presentation"`
remains a text editor so that inspecting it does not replace the pointer with a
literal. Enumerations are exported with the component's portable JSON metadata.


<a id="gc-105-090"></a>
## 090 · Editing, layout and theme guarantees

Presentation changes preserve an uncommitted component draft when its Data value
has not changed, including textbox, textBoxArea and passwordbox. A different Data
value still replaces the draft; IME composition defers that projection until the
composition ends. This policy applies to direct label/style bindings as well as
formlet defaults. Validation still keeps rejected text and the last valid Data.

Both radioButtonText and checkBoxText support reactive readonly. Their choices
remain visible but cannot be changed while locked. Local groups and selectors
share the same code:caption parser: an empty whole values string means no options;
empty codes, empty entries between commas and duplicate codes are errors. A colon
inside a caption is ordinary caption text after the first code separator.

Formlet defaults resolve in their declaring Source scope. Updating only columns
does not reproject fields. Changes to inherited defaults affect only consumers
without an explicit override; nested formlets can override defaults for their
branch. An inherited page/theme --gramlot-formlet-gap is honored, while an explicit
formlet gap wins.

Theme geometry is configurable without patching component code:

```css
:root {
    --gramlot-formlet-gap: 8px 16px;
    --gramlot-switch-width: 2.5em;
    --gramlot-switch-height: 1.4em;
    --gramlot-switch-inset: 2px;
    --gramlot-group-padding: .65em;
    --gramlot-group-header-padding: .35em .65em;
    --gramlot-group-action-padding: .2em .4em;
    --gramlot-group-action-size: 24px;
    --gramlot-choice-max-height: 12rem;
    --gramlot-popup-padding: 4px;
    --gramlot-slider-height: 10rem; /* vertical slider */
    --gramlot-slider-width: 1.5rem;
}
```

The switch thumb derives its size and checked position from the track dimensions.
Popup geometry respects available viewport space and the component's CSS size
limits. Choice lists, error messages and the copy menu close on viewport changes;
the date popup repositions while open. A successful copy clears earlier failure
feedback. Clipboard permissions remain controlled by the browser.


<a id="gc-105-095"></a>
## 095 · Command buttons, LED toggle and dropdown

These components are built in: no additional collection declaration is needed. Python and JavaScript use the same case-insensitive names.

```python
pane.button("Save", icon="✓", action="this.SET('saved', true)", ask="Save now?")
pane.toggleButton("Enabled", value="^enabled", disabled="^locked")

dropdown = pane.dropDownButton("Export", id="export", persist=True,
                              action="this.SET('exportKind', 'default')")
menu = dropdown.menu()
menu.menuline("CSV", code="csv", action="this.SET('exportKind', 'csv')")
menu.menuline("PDF", code="pdf", action="this.SET('exportKind', 'pdf')")
menu.menuline("-")
menu.menuline("Unavailable", code="later", disabled=True)
```

`button` renders `gramlot-button` with an internal native button. It retains the single command mechanism: action, one nested dataController/dataRpc, or fire/fire_*. Existing ask, references, modifiers, counters and inherited _delay use the same engine. `icon` is optional text or emoji; `iconSrc` supplies an image URL, including SVG. Theme tokens and touch sizing also apply inside the component. Its caption can contain Source children.

`toggleButton` adds a boolean value binding and a visible LED. Its internal button exposes aria-pressed. Clicking, Enter or Space updates Data before running the optional action. An action confirmation does not undo that state change. Readonly and disabled prevent user toggling; external Data changes still update the LED. No implicit exclusive group is introduced.

`dropDownButton` has separate main and arrow surfaces. Main click executes the current command and never opens the menu. Normal menu selection executes only; Shift+selection executes and also installs the selected command and its caption as the default. The same Shift rule applies to keyboard activation. Arrow keys, Home/End, Escape and native popover light-dismiss manage the menu. On touch, ordinary selection executes; changing the default currently requires Shift.

`persist=True` requires an explicit stable id. Browser storage remembers only the unique menu-item code, scoped to this page URL and id. A saved code absent from the menu uses the authored default. Storage denial leaves the current in-memory selection functional. Each actionable menuline requires code; `menuline("-")` is a separator. This split-button example is local. Hierarchical menus and permanent toolbars use the shared menu/menuline system described in [Menus, toolbars, frames and windows](350-menus-toolbars-and-windows.md).

**Migration:** `html_button` remains a real HTML button, including type=submit/reset and explicit connect_on events. Use it for native form actions. Gramlot command components do not implicitly submit forms. Native CSS selectors targeting button no longer select the component host; theme tokens style its internal button.

The gallery lessons *Button commands*, *Toggle button with LED* and *Dropdown commands and persistence* demonstrate commands/ask/delay, shared toggle Data, and dropdown selection/persistence respectively.


<a id="gc-105-100"></a>
## 100 · Border regions, live splitters and drawers

These containers are in the `layout` collection. The same collection declaration activates `borderContainer` and `contentPane` in Python
and JavaScript. Give the container a bounded height, or place it in a bounded
parent region. Each direct visual child has one `region`: `top`, `bottom`, `left`,
`right` or `center`, with at most one child per region.

```python
border = pane.borderContainer(height="420px", design="headline")
left = border.contentPane(region="left", width="180px", splitter=True,
                          minSize=100, maxSize=320, drawer=True,
                          drawer_label="Filters", drawer_top="12px",
                          drawer_margin_top="0", drawer_width="44px",
                          drawer_height="24px")
left.textbox(value="^.filter", lbl="Filter", width="100%")
center = border.contentPane(region="center", padding="16px")
center.textBoxArea(value="^.notes", lbl="Notes", rows=4)
border.contentPane(region="bottom", height="100px", splitter=True,
                   drawer="close", drawer_label="Output").p("^.notes")
```

`design="headline"` gives top and bottom the whole width; `"sidebar"` gives left
and right the whole height. Design and ordinary regional attributes can use Data
pointers. A nested `borderContainer(region="center")` uses the same regional
contract as a contentPane. Width controls left/right; height controls top/bottom;
the center receives the remaining space. Numeric regional dimensions are finite,
nonnegative pixel values; the component adds the CSS unit. Normal CSS lengths
remain accepted for presentation.

Use a plain pointer to a number when both a slider and the splitter control the
same size:

```python
pane.dataSetter("navigationWidth", 150)
pane.horizontalSlider(value="^navigationWidth", min=90, max=240, live=True)
border = pane.borderContainer(height="420px")
border.contentPane(region="left", width="^navigationWidth", splitter=True,
                   minSize=90, maxSize=240)
border.contentPane(region="center")
```

Dragging writes the constrained number through that same binding on every effective
resize; keyboard resizing does the same. The slider and other Data consumers update
immediately. Source pointers and mounted content are retained. There is no need for
`:{}px`, a controller, or an additional regions Bag. Literal sizes, `=` pointers,
CSS string values and transformed pointers do not write Data; templates and expressions
have no inverse conversion. Regional numeric dimensions are distinct from the
separator's own thickness (`splitter_width` / `splitter_height`).

`splitter=True` enables continuous pointer/touch resizing and arrow-key resizing.
`minSize` and `maxSize` are numeric pixel drag limits. There is no `liveSplitters`
option: resizing is always live. `splitter_width` sets a vertical separator's
thickness, `splitter_height` a horizontal separator's thickness;
`splitter_background`, `splitter_style` and other ordinary styling attributes use
the shared style projection. Explicit individual styles override the style string.
The `splitter_*` namespace is a Gramlot addition, not a claimed legacy API.

`drawer=True` starts open; `drawer="close"` starts closed. Initial configuration and later Source/Data visibility changes are immediate.
Only activation of the drawer handle starts the open/close transition; native keyboard activation follows the same path. A drawer also works
with `splitter=False`: its handle toggles a fixed-size region. `drawer_label`
provides the handle's sanitized HTML label, including when bound to Data. Safe
markup remains; scripts, event handlers, unsafe URLs, style elements and form
controls are removed with the tree-caption DOMPurify HTML policy.
`drawer_top`, `drawer_left`, `drawer_width`,
`drawer_height`, margins, `drawer_style` and `drawer_class` customize it. Keep the
handle within the container's visible bounds. `drawer_onclick` is an activated
Source script with `evt` and `show` (the new visible state), and the region's Source
node as `this`. For example, `drawer_onclick="this.setRelativeData('.open', show);"`
explicitly reports the UI state to Data. Closing does not automatically rewrite
an application's data or its authored `drawer` attribute.

Optional `persist=True` requires a stable container `id` and remembers resized
pixel sizes in same-origin session cookies, as a presentation preference. It does
not persist business Data or drawer visibility. A changed authored width/height
supersedes the previous drag size during the mounted page's lifetime.

Layout and drawer changes operate on CSS tracks and visibility. They do not
remove, move or recreate content nodes: drafts (including invalid text), Data,
nested components and iframe browsing contexts stay intact. Resizing to a narrow
viewport uses the same content and touch targets; no automatic mobile drawer
policy is imposed. Themes can set `--gramlot-splitter-size`,
`--gramlot-splitter-background`, `--gramlot-splitter-hover`,
`--gramlot-drawer-color` and `--gramlot-drawer-background`.

Try the gallery lessons *Border regions and splitters* and *Nested borders and
layout designs*. Tab/stack selection is described in §110 below; framePane and
application-level region state orchestration are not provided.

The gallery lesson *Rounded borders and popups* binds the existing `rounded="^rounded"` style macro
on both outer and nested borders to one live slider. Numeric values are pixels;
zero removes rounding. The shared value changes both outlines without replacing
their DOM or Data. This is explicit binding, not implicit inheritance of a parent
radius. Ordinary pane backgrounds are clipped at their
container's rounded outline; internal region joints remain square. Drawer handles
are placed toward the interior and remain reachable when a region closes. Calendar,
choice and validation popovers use the native top layer, so the rounded ancestor
does not clip them; the browser viewport (including an example iframe) still
limits their placement. This uses the existing CSS/popover behavior, not an extra
rounded mode or a separate mobile tree.

Drawer handles follow the legacy attached-tab shape: corners on the protruding
edge are rounded, and the edge joined to the separator has no border. Unlabelled
handles are 4px thick and 28px long, with a tooltip (`drawer_title`, or the
automatic open/close description). Splitters default to a 1px line. Invisible
hit areas retain mouse/touch usability without enlarging the visible controls.
Text is opt-in: `drawer_label` gives a compact text tab. Themes can adjust
`--gramlot-drawer-font-size` and `--gramlot-drawer-padding`, while explicit
`drawer_*` dimensions and placement still override defaults. The reference is
GenroPy's `09_gnr_dialogs_forms.css` drawerHandle rules, not the browser's default
button appearance.

Choice editors and native selects use a neutral inset focus indicator instead
of an outer blue ring. Gramlot choice popups are inset by 2px on each side of
their field; themes can set `--gramlot-choice-popup-inset`. The operating-system
popup of an HTML `select` is not restyled by this setting. Gallery border
examples use filteringSelect for consistent choice popup rendering.

A drawer handle also drags its splitter when `splitter=True`. Pulling a closed
drawer towards the content reopens and sizes it, respecting minSize/maxSize;
opening this way invokes drawer_onclick once with show=true. A click (including
small pointer jitter) still toggles the drawer; releasing a drag does not toggle
it or invoke drawer_onclick. Regions with splitter=False retain ordinary click
activation.
On hover, grips gently grow towards the content using a transform, without
changing layout dimensions. Explicit labels grow more subtly. The transition
respects prefers-reduced-motion.


Drawer authoring requires no presentation class:

```python
# Small, always-visible caption; rotation follows the region.
border.contentPane(region="left", width="120px", drawer=True,
                   drawer_label="Filters", drawer_minimize=False)
# Icon and text appear together on hover/focus.
border.contentPane(region="top", height="48px", drawer=True,
                   drawer_icon="⌕", drawer_label="Search", drawer_minimize=True)
# A slim grip without an icon, initially closed.
border.contentPane(region="right", width="120px", drawer="close",
                   drawer_label="Details", drawer_minimize=True)
```

`drawer_minimize` is boolean, defaults to True and accepts Data bindings.
With False, captions are visible and sized to their text; left/right captions
rotate automatically, top/bottom remain horizontal. With True, the handle expands
and fades in its caption on hover or keyboard focus. On touch the caption remains visible in a compact, text-sized handle at rest.
Hover, keyboard focus and pointer press retain enlargement and zoom; release restores
the compact touch presentation. The hit area remains large without enlarging the
resting label. `drawer_icon` is an upright text symbol or emoji in the same flow
as the caption. Minimize hides both together; no square icon slot remains at rest.
`drawer_title` is its tooltip. Expanded side handles stay narrow and top/bottom
handles stay shallow; their content determines length along the separator.

Handles have a solid gray fill and no border, inset stroke or outline. Caption
color is white on dark fills and dark gray on pale fills; explicit color overrides
are supported. Multicolor emoji keep their own colors. Keyboard focus reveals
minimized captions. Layout, Source, Data and content identity do not change.

`drawer-reveal` and `drawer-rotated` are internal classes derived from these
parameters, not required authoring settings. Optional CSS variables on an ancestor
or in drawer_style customize the theme; explicit drawer dimensions still override.

| CSS variable (prefix `--gramlot-drawer-`) | Default / role |
| --- | --- |
| `thickness`, `length` | `4px`, `28px`: plain resting grip |
| `icon-size` | `1em`: glyph size, without a reserved square |
| `content-gap` | `4px`: space between icon and caption |
| `opacity`, `active-opacity` | `.45`, `1`: plain grip / active or readable caption |
| `hover-cross-scale`, `hover-length-scale` | `1.75`, `1.12`: unlabelled grip zoom |
| `label-hover-scale` | `1.04`: caption/icon zoom; `1` disables zoom only |
| `duration`, `easing` | `.16s`, `ease-out`: growth and fade |
| `font-size` | `11px`: compact caption and icon text |
| `padding` | `2px 8px` horizontal, `8px 2px` vertical |
| `hit-target` | `12px`: minimum mouse target; touch sizing takes precedence |
| `reveal-width`, `reveal-height` | Intrinsic icon/text size including padding; optional explicit limits override the measured defaults |
| `reveal` | `0` normally; `1` keeps minimized captions visible, as on touch |
| `background`, `color` | Gray fill; automatic caption contrast unless overridden |

Zoom and expansion are independent. Setting
`drawer_style="--gramlot-drawer-label-hover-scale:1;"` disables zoom but still lets
a minimized handle expand to reveal its text. Reduced-motion disables transitions.
The gallery lesson *Drawers: handles, content and retained Data* demonstrates
defaults and minimized captions without custom classes or CSS dimensions.


<a id="gc-105-105"></a>
## 105 · Border notifications

`closable_change` applies to drawers and `splitter_resize` reports completed resizing. These use the Source-local publish/subscribe service, not a DOM or global event bus.

| Topic suffix | Publishing Source | Payload |
| --- | --- | --- |
| closable_change | The drawer's region/pane | open (boolean), region (top/bottom/left/right) |
| splitter_resize | The borderContainer | region, size, previousSize (CSS pixel strings) |

Give the emitter a nodeId to subscribe by its stable qualified topic: filters_closable_change or workspace_splitter_resize. selfsubscribe on a controller addresses that controller, not its containing pane.

closable_change fires after the region's effective visibility and handle state have changed. It covers handle activation, reopening through dragging, and reactive drawer/hidden changes. Initial mounting, unchanged visibility and teardown emit nothing. drawer_onclick remains the separately authored interaction callback. The notifications themselves do not write application Data. Numeric regional bindings are updated by the splitter during resizing, before the completed-resize notification.

splitter_resize fires once after a pointer gesture ends (including cancellation/lost capture when the live size is retained), or after an effective arrow-key resize. Payload sizes are the measured before/after pixel extents; unchanged size emits nothing. It does not fire for every pointermove, an authored width/height change or window resize. Pointer capture and the drag cover are released before subscribers execute. Numeric dimension writeback happens during resizing through the declared width/height binding; it does not introduce a separate regions Bag.

```python
border = pane.borderContainer(nodeId="workspace", height="360px")
border.contentPane(nodeId="filters", region="left", width="160px",
                   splitter=True, drawer=True, drawer_label="Filters")
border.contentPane(region="center")
pane.dataController("this.SET('.filtersOpen', open)",
                    subscribe_filters_closable_change=True)
pane.dataController("this.SET('.lastRegion', region); this.SET('.lastSize', size)",
                    subscribe_workspace_splitter_resize=True)
```

Payload fields are normal controller arguments; _reason is the qualified topic and _subscription_kwargs is the original payload. The synchronous delivery and exception rules of publish apply. Subscribers should not unconditionally toggle the same region back, which would create an application feedback loop. Geometry, drafts and mounted content keep their existing lifecycle.

<a id="gc-105-110"></a>
## 110 · Stack and tab selection and closing

`stackContainer` and `tabContainer` share selection. Tab adds a scrollable, touch-aware tab strip (presentation and orientation: §115); stack creates no strip. A panel can be contentPane or a nested component/container. Selection changes only shadow viewport visibility; light DOM, Source, widget instances, invalid drafts and iframe contexts remain mounted in place.

Use `selectedPage="^.page"` with a child's unique `pageName`, or `selected="^.index"` with a zero-based index. Both may be bound and are updated together without duplicate notifications. A changed named request takes precedence if both inputs change in the same turn; otherwise the changed index is honored. Omitted selection starts at the first available panel. Unknown requests leave the current available selection unchanged. Parent-owned child metadata is pageName, title, closable (default false), onClose, hidden and disabled. Hidden/disabled panels cannot be chosen; an unavailable or removed current panel selects the next available child, otherwise the previous. Empty selection writes null to both bound selection attributes. `^` writes back; literal/`=` selection is read-only from the application's perspective. The component keeps its current user selection until a declared selection input changes.

For A → B, container-local publications use the existing nodeId prefix:

| Topic | Timing | Payload |
| --- | --- | --- |
| hiding | Before hiding A | {pageName, index} |
| showing | Before showing B | {pageName, index} |
| selected | After visibility and both selection bindings are updated, once for A | {page, index, selected: false, change: "A_hide"} |
| selected | After the same update, once for B | {page, index, selected: true, change: "B_show"} |

`page` is pageName when supplied, otherwise the numeric index; change uses that identity plus _show/_hide. Initial selection publishes only selected:true once, after Source construction so controller subscriptions exist. No publications for no-op selection, resize or ancestor drawer toggling. Source/Data projections are coalesced within the current turn before resolving selection. The same notifications follow clicks, keyboard and Data-driven requests. ArrowLeft/ArrowRight and Home/End select and focus tabs, scrolling only the strip as necessary; Delete requests closing of the focused closable tab.

`closable=True` offers a close button on a tab. The shared closing operation calls the panel's activated `onClose` code first, if supplied. It must return a synchronous boolean; false vetoes without notifications. It is not a DOM event handler, is allowed only on direct tab/stack panels, and never becomes a DOM attribute. As with other inline code, later unactivated Source replacement cannot execute it.

If allowed, the container publishes closing {pageName, index, wasSelected}, removes the panel Source node, resolves selection and its normal notifications, then publishes closed with the same pre-removal identity. Closing an inactive panel has no selection notifications. Application Data is not cleared; rejected local drafts disappear with the deleted widget. Direct application Source removal also resolves selection, but is not a close-button request and does not run onClose or emit closing/closed. Ordinary switching never deletes Source. `onClose` restores the useful Dojo veto; the inspected Genropy close-button patch bypassed it. closing/closed are explicit Gramlot additions. Legacy per-binding duplicate selected publications are intentionally not reproduced.

```python
pane.dataSetter(".page", "customer")
tabs = pane.tabContainer(nodeId="editor", selectedPage="^.page", height="360px")
tabs.contentPane(pageName="customer", title="Customer").textbox(
    value="^.customer.name", lbl="Name")
tabs.contentPane(pageName="notes", title="Notes", closable=True,
                 onClose="return !this.GET('.notesDirty')").textBoxArea(
    value="^.customer.notes", lbl="Notes")
pane.dataController("if (selected) { this.SET('.lastVisited', page); }",
                    subscribe_editor_selected=True)
pane.dataController("this.SET('.lastClosed', pageName)",
                    subscribe_editor_closed=True)
```

Substitute stackContainer to retain the same selection and notification contract without tabs. Controllers receive named payload variables and the complete _subscription_kwargs object. Closing a `closable` panel removes it from the Source and keeps its Data. For region composition use [framePane](350-menus-toolbars-and-windows.md#gc-350-035). Incoming switchPage commands and asynchronous tab-close guards are not provided.


<a id="gc-105-115"></a>
## 115 · Tab presentation, icons and badges

`tabMode="tabs"` (default) displays compact tab shapes; `tabMode="underline"` displays text with a selection indicator, without tab outlines. `tabPosition="top"` (default), `"bottom"`, `"left"` or `"right"` places the strip. `tabAlign="start"` (default), `"center"` or `"end"` aligns the entries along that strip: left/center/right horizontally, top/center/bottom vertically. All three parameters accept Data pointers. If the entries overflow, alignment falls back to the start so no tab becomes unreachable. Left/right strips stack horizontally written labels vertically; their width is bounded and long captions ellipsize with a title tooltip. The strip scrolls on its own axis. ArrowLeft/Right navigate horizontal strips; ArrowUp/Down navigate vertical strips. Home/End and Delete retain their existing semantics.

Direct panels accept `icon` (text/emoji, matching button icons), `badge` (number or short text) and `badge_color` (CSS background color). These are parent-owned presentation metadata, including when the child is another container. Null/empty badges disappear; zero remains visible. A badge stays reactive while its panel is unselected; `hidden=True` hides the entire tab. Icon/caption/badge are rendered as text, never injected HTML. Icons are decorative; the tab accessible name includes its caption and badge. Badge foreground defaults to the theme's contrasting text token; authors choosing a custom fill must keep that contrast suitable.

```python
tabs = pane.tabContainer(tabMode="^.mode", tabPosition="^.position", tabAlign="^.align",
                         selectedPage="^.page", height="300px")
tabs.contentPane(pageName="profile", title="Profile", icon="👤")
tabs.contentPane(pageName="messages", title="Messages", icon="✉",
                 badge="^.unread", badge_color="crimson")
```

Changing mode, position, alignment, icons or badge values never rebuilds panels or emits selection notifications. CSS owns layout and theme presentation. Existing --gramlot-tab-* tokens cover density, shape, palette and indicator/badge styling; mimi and joanna use their own compact defaults. Touch retains larger interaction targets and scrollable strips.


<a id="gc-105-120"></a>

## 120. Bag tree presentation

Block ID: **GC-105-120**. Development increment.

Load the `tree` collection and give `tree` a Data Bag through `storepath`. The component reads loaded values without evaluating resolvers during rendering; opening a branch evaluates its node resolver. `selectedPath` is a two-way path relative to the store. `autoCollapse=True` closes sibling branches when a branch opens.

```python
pane.tree(storepath=".items", hideValues=False,
          selectedPath="^.selection", labelAttribute="caption",
          selectedLabelClass="chosen-caption")
```

`hideValues` defaults to **False**: scalar values appear as children when their owning row is expanded. `True` hides them; use it explicitly for navigation. Zero, false and null are retained. A scalar child is only a visual row: selection reports its owning BagNode path, without creating another store node.

Caption precedence is `getLabel`, then `labelAttribute`, then `labelCb`, then the BagNode label. A configured labelAttribute falls back to the node label when that attribute is absent. Attribute labels are always text.

`labelCb`, `getLabel`, `getLabelClass` and `getIconClass` name synchronous browser Logic methods. Each receives `(sourceNode, {item, path, opened, selected})`; item is the real BagNode. Label callbacks return exactly one of `{text: string}` and `{html: string}`. HTML is sanitized with DOMPurify; scripts, event handlers, unsafe URLs, styles and form controls cannot supply application behavior. Use Gramlot commands for actions. There is no `innerHTML:` string sentinel.

```javascript
export class Logic {
    caption(sourceNode, {item, opened}) {
        return {text: `${item.label}${opened ? ' (open)' : ''}`};
    }
    richCaption(sourceNode, {selected}) {
        return {html: selected ? '<strong>Selected</strong>' : '<em>Choose me</em>'};
    }
}
```

Class callbacks return a CSS class string. `getLabelClass` replaces the node's label classes; otherwise `labelClassOpened` or `labelClassClosed` overrides `labelClass`. `selectedLabelClass` is additive. `node_class` styles the node container. `getIconClass` replaces the default folder/file icon classes; an empty result hides the icon. Custom classes are also CSS parts, allowing external styles such as `gramlot-tree::part(chosen-caption) {font-weight: bold}` to reach the shadow tree.

Structural parts include tree, group, node, branch, leaf, row, caption, icon, expander, spacer, value-node, value-row and value. Default icon parts distinguish branch-icon, leaf-icon, opened-icon and closed-icon. Named callbacks and live Bag attribute changes refresh the presentation. Callback results must satisfy their contract; asynchronous results and legacy string label callbacks are unsupported.

Gallery: Input components → tree → Bag tree, Tree labels and classes, Tree callbacks, HTML and icons. Checkboxes for tree selection, filtering, badges, row actions, expansion commands and drag/drop remain subsequent increments; the example's hideValues checkbox is an ordinary bound control.

<a id="gc-105-125"></a>

## 125. CodeMirror and its options composition

Block ID: **GC-105-125**.

Activate the `editors` collection for `codeMirror`. The optional browser collection owns the locally bundled CodeMirror 6 engine; it does not fetch a CDN or create a textarea substitute. The value is a string and `value="^document.source"` uses the shared control binding. User changes write live by default. `live=False` commits on leaving the editor. External document replacement is silent and resets the undo baseline; equal values and configuration changes preserve the editor, selection and undo history.

```python
pane.codeMirror(value="^document.source", language="python", height="340px")
```

Languages: `text` (default), `python`, `javascript`, `typescript`, `json`, `html`, `css`, `xml`, `markdown`, `sql`, `typst`. Unknown languages fail explicitly. Defaults are four spaces (`indentUnit`, range 1–16), monospace 14px (`fontFamily`, `fontSize`, range 8–48), with `lineNumbers`, `lineWrapping`, `folding`, `bracketMatching`, `autoCloseBrackets`, `autoIndent`, `autocompletion`, `highlightActiveLine` and `highlightSelectionMatches` enabled. These parameters accept read bindings. Existing text is never reformatted by configuration. Completion uses local language support, without an LSP or remote project service. Theme colors use Gramlot CSS variables and update with the surrounding theme.

`readonly` prevents changes while preserving selection, copy and search. `disabled` also prevents focus. Incoming Data changes still project in either state. Tab indents, Shift+Tab outdents; Escape followed by Tab leaves the editor. Ctrl/Cmd+F opens search/replace with case and regex controls. Replacement is unavailable in read-only mode. Ctrl/Cmd+S publishes the editor's local `save` topic with `{value}`; the consuming application owns persistence and error handling. The gallery examples use a Data snapshot, not filesystem saving.

For an editor with its own right options drawer, activate `inputs`, `layout` and `editors`, and use the reusable Source composition:

```python
from gramlot.page import code_mirror_with_options

pane.dataSetter("document.source", "print('Hello')")
code_mirror_with_options(pane, datapath="document", value="^.source",
                         language="python", height="420px")
```

JavaScript exports `codeMirrorWithOptions(parent, {datapath, value, language, height, ...attributes})` from `@gramlot/gramlot/page`. Python accepts the corresponding keyword arguments. The required `datapath` scopes the composition; relative editor pointers resolve there. Settings live under `.settings` and belong to that instance. The returned Source pane is the shared `borderContainer`; the drawer uses shared inputs and the center uses the same `codeMirror` control. Read-only and disabled remain caller-owned attributes, outside the configuration drawer. No global preference store is created.

The DOM component's `ready` promise resolves after the optional engine is created. Once ready, `setDiagnostics([{from, to, severity, message}])` replaces diagnostics; an empty array clears them. `revealPosition(offset)` selects and reveals a document offset. `undo()` and `redo()` execute the corresponding editor history command, returning whether it ran; read-only and disabled editors reject them. The local `historyChanged` publication carries `{canUndo, canRedo}` when availability changes, including initial readiness and external replacement. Removing the component cancels pending creation and destroys its engine. Syntax diagnostics supplied by a host are separate from language highlighting; Python server validation, remote file save/reload, Markdown preview and the IDE are subsequent work.

Gallery: **Input components → Code editors → CodeMirror / CodeMirror with options**.


<a id="gc-105-130"></a>

## 130 · Filesystem tree and document IDE

Block ID: **GC-105-130**.

`file_system_tree` / `fileSystemTree` is a reusable Source composition over `tree`, with a scoped Data Bag. Load the `tree` collection and expose the integration's filesystem endpoints. The page Logic uses `FileSystemLogic`, exported by the browser runtime.

```python
from gramlot.page import file_system_tree

file_system_tree(pane, datapath=".files")
pane.button("Open").dataController(
    "this.SET('.files.requestedRoot', directory)", directory="^.directory")
```

The component Data contains `requestedRoot`, the successfully opened `root`, `store`, `selectedPath` and `status`. The host returns one directory level as a Bag. Directory nodes receive `DirectoryResolver` instances; expansion loads children once per opened workspace. The row attributes include `path` (relative to root), `caption`, `is_directory`, `size` and `modified`. Selection uses the normal tree Bag path; read the selected node's `path` to identify its filesystem entry. Icons and keyboard interaction belong to the shared tree. Replacing a workspace aborts the previous tree's resolvers; disposal cancels owned pending requests.

`IdePage` composes FramePage, this filesystem tree, an editable workspace combo and CodeMirror document tabs. Its companion module exports `IdeLogic as Logic` from `@gramlot/gramlot`. The first implementation is Python-authored and served with the Python integration's `stage_ide`; all filesystem access stays in that integration. Optional inputs/layout/tree/editors browser bundles ship separately under core resources/components.

The workspace combo remembers six successfully opened directories in sessionStorage, most recent first, without duplicates. It suggests the most recent directory after a reload; opening remains explicit. The values are server paths. Session storage does not persist drafts, grant file permissions, or promise sharing across browser tabs. Switching directories retains document tabs and drafts; documents with the same relative path in different roots remain distinct.

Save and Ctrl/Cmd+S submit the draft with its loaded revision. Conflicts retain the draft. Python syntax is checked before writing, without executing the file. The document's saved baseline becomes the submitted snapshot, so typing during a save remains dirty. Each document has Save, Revert, Undo and Redo icons in its own toolbar. Save and Revert are disabled without changes or while saving; Save is also disabled for read-only documents. Revert restores the last loaded or successfully saved baseline without closing the tab or writing the file, and clears editor history. Undo and Redo use the editor’s independent history and are disabled when unavailable. Closing a dirty or pending document is vetoed: save or revert before closing. The workspace combo opens a nonempty changed directory on focus-out after committing its value; no Open button is required. Executable Python preview, file creation/rename/delete and filesystem watches remain outside this increment. HTML, Markdown and Typst views are described below.

### Local-choice sources

For `comboBox`, `store="^.recent"` accepts a Bag of string-valued nodes with a string `caption` attribute. Values must be unique. `store` and nonempty `values` are mutually exclusive. The combo keeps its existing free-text/caption selection semantics; filesystem choices use the same exact path for value and caption.

Both comboBox and filteringSelect accept `separator`, default comma, for their local `values` text. For example:

```python
pane.comboBox(value="^.choice", values="First, with comma\nSecond", separator="\n")
```

The separator must be nonempty; code/caption pairs still use the first colon. Structured stores keep arbitrary directory punctuation out of this text grammar.




IDE new documents (2026-10-21): select a document type and use **New document**. Each empty draft has independent history and the matching preview before a file exists. The first **Save** opens Directory / File name fields inside that tab; **Cancel** keeps the draft. **Create file** calls the host's `document_create(root, path, content)`. The directory must already exist and be allowed by the host; an occupied destination is rejected, never overwritten. The host validates Python syntax and enforces `remote_edit` for creation just as for updates. Empty files are supported. Creation retains the tab identity and any edits made while the request is pending; reopening its path selects the same tab. Later saves use the ordinary revision-checked update. Refreshing the browser does not persist drafts.


<a id="gc-105-135"></a>
## HTML editor and preview

The optional `editors` collection provides `htmlEditor` (Jodit Community 4.13.9)
and `htmlPreview`. They share an HTML string through ordinary Data bindings:

```python
pane.htmlEditor(value="^.content", height="400px", readonly="^.readonly")
pane.htmlPreview(value="^.content", height="400px")
```

`htmlEditor` writes live by default; `live=False` commits on blur. It accepts the
standard `readonly` and `disabled` parameters. Its `undo()`/`redo()` methods and
`historyChanged` publication follow CodeMirror's control contract. Ctrl/Cmd+S
publishes `save`; the application owns persistence. Dependencies and styles are
bundled locally in the optional collection, without a CDN.

Jodit edits the body while retaining the original head, doctype and document
attributes. Scripts, styles, embedded content, SVG/MathML and comments appear as
protected placeholders. Active attributes are kept outside the editable DOM.
Removing or duplicating protected content rejects the edit with a visible message;
change that content in Code instead. Visual edits serialize the DOM and can
normalize whitespace, quoting and markup. Undo to the initial rich snapshot restores
the original source string exactly. External replacement resets editor history.

The preview is an iframe with an empty sandbox: page scripts do not execute.
The rich editor uses its own iframe without script permission and a restrictive
content policy. Original head styles apply to its editing canvas; the toolbar uses
Gramlot theme tokens. These are HTML document views, not Python execution previews.

The IDE opens HTML documents with Code, Preview and Rich text tabs over the same
Data document. Save/Revert affect that document; Undo/Redo follow the active editor
and are disabled in Preview. Filesystem permissions and remote-edit remain the
integration's responsibility. Gallery: Input components → Code editors → HTML:
code, preview and Jodit; the opt-in Document IDE also supports HTML files.


<a id="gc-105-140"></a>
## Markdown editor and preview

The optional `editors` collection includes `markdownEditor` and `markdownPreview`:

```python
pane.markdownEditor(value="^.content", height="400px", readonly="^.readonly")
pane.markdownPreview(value="^.content", height="400px")
```

The stored value is always a Markdown string. The editor uses ProseMirror with
Bold, Italic, Code, Undo and Redo controls, standard editing keys, Ctrl/Cmd+B/I,
Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z. Ctrl/Cmd+S publishes `save`; persistence remains
application-owned. `historyChanged`, `undo()` and `redo()` follow the other editors.
Edits write live by default; `live=False` commits on blur. `readonly` and `disabled`
prevent edits, while external Data updates continue to render and reset history.
Disabled editing also leaves the keyboard tab order. Removing the control releases
its engine and prevents late history publications.

Headings, paragraphs, lists, quotes, fenced code, inline links/images and basic
emphasis use the rich schema. Tables, embedded HTML, strikethrough and task lists
are preserved source blocks: edit their internals in Code. They can be selected or
deleted as whole blocks. Frontmatter or reference definitions preserve the whole
document as one source block. This is the bounded PoC dialect, not a claim of full
GitHub-flavored Markdown visual editing. Supported Markdown syntax is normalized
after rich editing; Undo back to the initial document restores its original string.

Preview uses markdown-it in a sandboxed iframe. `allowHtml=False` is the default:
embedded HTML appears as text. Set `allowHtml=True` (or bind it to Data) to render
embedded HTML, sanitized with DOMPurify before insertion. Scripts, event handlers,
unsafe link targets, embedded frames and form controls are removed. External image
requests remain blocked by the preview content policy. The original Markdown is
never sanitized or rewritten: HTML source blocks remain preserved by the rich
editor, with markup editable in Code. Switching allowHtml leaves undo history intact.
For example: `pane.markdownPreview(value="^.content", allowHtml="^.allowHtml")`.
The IDE Preview tab and gallery Markdown lesson expose an **Allow embedded HTML**
checkbox, initially off and scoped to that document. The rich toolbar and canvas use Gramlot theme tokens; preview
retains a paper-style document canvas.

Markdown IDE documents have Code, Preview and Rich text views sharing a Data draft,
Save/Revert and active-editor history, like HTML documents. The Python gallery
example is Input components → Code editors → Markdown: code, preview and rich text.
The opt-in Document IDE can open `.md` and `.markdown` files through the existing
host filesystem provider. The components require no Markdown-specific server API.


<a id="gc-105-145"></a>

## 145 · Typst editor, SVG preview and client PDF

Block ID: **GC-105-145**.

Use CodeMirror from the `editors` collection and `typstPreview` from the optional
`typst` collection. Both consume the same Data string:

```python
pane.codeMirror(value="^.content", language="typst", height="400px")
pane.typstPreview(value="^.content", filename="report.pdf", height="500px")
```

The preview includes a Download PDF link and compiler diagnostics. It compiles
after a short typing pause in a shared browser Worker; SVG and PDF are produced
from the same draft. A change immediately hides the stale preview and disables
the preceding download. Late results cannot replace a newer draft. Removing the
last preview terminates the Worker; Blob URLs are revoked on change or disposal.
The rendered SVG is displayed as an image, with renderer JavaScript disabled.
The toolbar follows Gramlot theme tokens; the document retains a white paper canvas.

The module embeds the compiler, renderer and five fonts, without CDN or runtime
network access. Self-contained documents work offline. Includes, custom assets and
external packages are not supplied by this initial component; missing resources
produce a diagnostic. The browser compiler is Typst 0.14.2 from typst.ts 0.7.0; it
is not claimed equivalent to the native 0.15.0 compiler in genro-typst. CodeMirror
uses the experimental codemirror-lang-typst 0.6.0 Lezer grammar for Typst 0.15:
highlighting a newer construct does not guarantee that it compiles.

IDE `.typ` documents have Code and Preview views. Save/Revert and undo/redo retain
their existing source-document behavior; PDF download does not save the source.
The Python filesystem provider retains its remote-edit gate. No server compile
endpoint is required.

The gallery example is Input components → Code editors → Typst: editor, preview
and PDF. Its Python and JavaScript pages author equivalent Source. Serverless
directory export includes the collection modules as shared local assets, so the
compiler is not duplicated per route. The current single-HTML export command
does not accept optional collections. The optional Typst module is about 41 MiB
uncompressed; compiler initialization is lazy, but enabling the collection still
loads its module. Hosts that do not need Typst should omit that collection.


Python Typst recipes use the compound extension `.typ.py` and export `class Recipe(TypstBuilder)`. In the IDE choose **Typst Python recipe** for a new draft, or open an existing `.typ.py`. The Code tab remains Python. **Generate preview** sends the current draft to the host, which calls `Recipe().create()` and `render()`. **Generated Typst** is read-only; **Preview** renders that output to SVG/PDF in the browser. Editing Python immediately hides the old preview and clears generated source; generation is explicit, independent of saving.

```python
from genro_typst import TypstBuilder

class Recipe(TypstBuilder):
    def main(self, root):
        doc = root.document(paper="a5")
        doc.paragraph(content="Hello from a Python recipe")
```

The Python host requires `genro-typst` and `remote_edit=True`. Recipes run as server Python code in a short-lived process, with a 15-second timeout; this is not a sandbox. Opening and saving a `.typ.py` only read/validate text and never execute it. The first slice uses self-contained generated Typst and the existing bundled browser fonts. Serverless can compile the generated `.typ` source but does not execute `.typ.py`.
