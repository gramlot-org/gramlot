# 105 · Input components and labelbox

Document ID: **GC-105**.

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

The collection contains `textbox`, `checkbox`, `radioButtonText`, `textBoxArea`,
`passwordbox`, `radioButton`, `colorpicker`, `horizontalSlider`, `verticalSlider`,
`numberTextBox`, `dateTextBox`, `timeTextBox`, `filteringSelect`, `callbackSelect`,
`comboBox`, `checkBoxText` and `dateCalendar`.
It demonstrates a single native control and a composite group using the same
labelbox and binding contract. Localization is prepared through `intl_str`
metadata; this increment does not translate text.

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
Codes without a colon use the code as their caption. Bag options and escaping
commas/colons are outside this first increment.

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
bootstrap owns loading that entry point; automatic server discovery or a new
Page configuration property is not supplied here. Each selected collection
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

The current increment covers the seventeen controls listed above, existing Data
binding, reactive labelbox, styling prefixes, typed editing, constrained choices,
keyboard behavior and cleanup. Validation is described in §076;
other input families, native HTML form submission/reset through ElementInternals,
automatic collection discovery, theme-specific component skins and translated
messages remain subsequent work. The component value does not accept `:` or `:=`
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
## 035 · Activate a collection in an application

The application passes `collections` to its server. Each entry contains `grammar`
(the generated JSON object) and `module` (the root-relative URL of its bundled
browser ES module). The module exports the ComponentCollection as its default.
The adapter serves that asset like other application assets.

```python
import json
from importlib.resources import files

collections = [{
    "grammar": json.loads(files("gramlot").joinpath("collections/inputs.json").read_text()),
    "module": "/gallery/dist/inputs.js",
}]
# Pass collections=collections to the application/server constructor.
```

JavaScript can obtain the same grammar directly from the definition:

```javascript
import inputs from '@gramlot/gramlot/components/inputs';
const collections = [{grammar: inputs.toDocument(), module: '/gallery/dist/inputs.js'}];
```

The server loads the grammar for every Source request, including remote fragments.
It adds collection module URLs to the bootstrap with the application's mount prefix.
PageBootstrap imports them, registers their custom elements and loads their grammar
before requesting/mounting Source. The browser does not fetch the Python JSON:
the JavaScript descriptor already contains that same metadata.

The gallery declares `inputs` explicitly for Python, Node and serverless. Its build
bundles a separate `inputs.js`; no second Gramlot runtime is bundled with it.
The serverless directory exporter embeds the same JS module and passes the JSON
grammar to the Worker server, so opening the export with `file://` needs no remote
collection fetch. There is no automatic discovery or name-based fallback.

Try **Input components** in the gallery: `w01` (textbox), `w02`
(checkbox), `w03` (radioButtonText), and `w04`–`w09` (the simple input variants
below). Label positions and layout are reactive, while
all value writes use the existing Data binding engine. The examples use the shared component collection.


<a id="gc-105-040"></a>
## 040 · Simple native input variants

These controls reuse NativeControl, Labelbox, FieldState and the existing Data
binding engine. They have the same names and parameters in Python and JavaScript.
Native HTML `textarea`, `input` and `html_button` declarations keep their meaning.

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
scope uses ordinary opaque hex colors. Native normalization/clamping changes the
displayed control without rewriting Data until an editing event commits it.
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

The gallery's w13 and w14 progress from local pairs to 100 records generated once
in a Data Bag. w14's Python page declares the component and a startup controller;
shared browser Logic creates and searches the random records. There is no server
request and repeated searches preserve the records. Cards and fields have bounded
widths. Free-text comboBox and multiple selections follow in §§060–065.
Store/DB providers and regeneration remain outside this development increment.


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
See gallery w15 for two fields bound to the same city text.


<a id="gc-105-065"></a>
## 065 · Multiple choices with checkBoxText

`checkBoxText` uses the same option-group structure and labelbox as radioButtonText,
with independent checkboxes instead of exclusive radio buttons:

```python
pane.checkBoxText(value="^channels", values="email:Email,sms:SMS,push:Push",
                  lbl="Notifications", cols=2, readonly="^locked")
```

The owner-confirmed PoC value contract is a comma-separated string of codes, such
as `email,push`, or null when no choice is selected. Captions are presentation;
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
writer. Gallery w16 shows two bound groups, reactive columns, label positions
and a readonly switch in compact cards. This increment implements the inline
group; PoC popup mode, Bag/store-backed options are outside
its scope. Store/DB controls remain a later workstream.


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

Weeks start on Monday, matching the PoC. Month and weekday captions use Intl;
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

Try gallery **w17 · Date calendar**: inline calendar, popup editor and text-only
editor share one pointer. **w11 · Date editing** also compares the default popup
with `calendar=False`. Range selection, min/max date constraints, time popups and
form-save orchestration are not part of this increment.


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
(UTF-16 units, matching the PoC), not grapheme counting. For choice components it
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
on the next edit; this increment does not run form-wide or startup validation.

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
long draft. Native HTML controls outside the inputs collection keep their behavior.

Try **w18 · Required values and length** for the basics. The complete field engine is described in §076; form/save handling remains separate.

Component shadow roots inherit semantic theme variables for fields, labelbox,
choices, calendar and errors. Base, Compact, mimi and joanna are
available in light/dark mode; see [theme profiles](096-themes-and-css.md).

Text editors request `autocomplete="off"`, `autocorrect="off"`, `autocapitalize="off"` and `spellcheck="false"` on the actual internal input/textarea. These hints reduce unrelated browser/OS suggestions; they cannot force external password managers or OS services to comply. Filtering/callback selection keeps its own accessible list suggestions.


<a id="gc-105-080"></a>
## 080 · Touch interaction and device suitability

Block ID: **GC-105-080**. Development feature.

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
The gallery's w01, w17 and w18 demonstrate the declaration.

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

`button` renders `gramlot-button` with an internal native button. It retains the single command mechanism: action, one nested dataController/dataRpc, or fire/fire_*. Existing ask, references, modifiers, counters and inherited _delay use the same engine. `icon` is optional text or emoji. Theme tokens and touch sizing also apply inside the component. Its caption can contain Source children.

`toggleButton` adds a boolean value binding and a visible LED. Its internal button exposes aria-pressed. Clicking, Enter or Space updates Data before running the optional action. An action confirmation does not undo that state change. Readonly and disabled prevent user toggling; external Data changes still update the LED. No implicit exclusive group is introduced.

`dropDownButton` has separate main and arrow surfaces. Main click executes the current command and never opens the menu. Normal menu selection executes only; Shift+selection executes and also installs the selected command and its caption as the default. The same Shift rule applies to keyboard activation. Arrow keys, Home/End, Escape and native popover light-dismiss manage the menu. On touch, ordinary selection executes; changing the default currently requires Shift.

`persist=True` requires an explicit stable id. Browser storage remembers only the unique menu-item code, scoped to this page URL and id. A saved code absent from the menu uses the authored default. Storage denial leaves the current in-memory selection functional. Each actionable menuline requires code; `menuline("-")` is a separator. The first menu is flat and local; nested menus and button bars are deferred.

**Migration:** `html_button` remains a real HTML button, including type=submit/reset and explicit connect_on events. Use it for native form actions. Gramlot command components do not implicitly submit forms. Native CSS selectors targeting button no longer select the component host; theme tokens style its internal button.

The gallery lessons w22, w23 and w24 demonstrate commands/ask/delay, shared toggle Data, and dropdown selection/persistence respectively.


<a id="gc-105-076"></a>
## 076 · Validation engine: transformations, warnings and callbacks

The shared engine runs after the component parses its draft and before its single
ControlAdapter writes Data. Constrained selectors check the selected item before
this pipeline: `validate_select` does not turn a filteringSelect into free text.
Native HTML controls remain outside this component capability.

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
metadata; translation remains a future service. Messages can use the existing
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
and `validate_gridnodup` are explicit unsupported-configuration errors until their
DB/grid integrations arrive. Try **w25 · Validation rules and callbacks** alongside
**w18 · Required values and length**.

A literal regular expression starting with `^` must be enclosed, for example `(?:^[A-Z]+$)`, because a leading `^` is a Data pointer in Source. This is ordinary regex grouping, not another validation syntax; `validate_regex="^.pattern"` deliberately reads a pattern from Data.
