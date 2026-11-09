# Inputs

Document ID: **GC-410**.

The inputs collection holds the fields of a form: text, choices, numbers, dates and
times. This page helps you **pick the right field for the value you want to store**
and set it up. The complete list of parameters of each field is in the
[widget reference](345-widget-reference.md).

<a id="gc-410-start"></a>

## A small form

```python
def main(self, root):
    form = root.div(datapath="customer")
    form.textbox(value="^.name", lbl="Name")
    form.checkbox(value="^.active", label="Active")
    form.filteringSelect(value="^.delivery", lbl="Delivery",
                         values="standard:Standard,express:Express")
    form.dateTextBox(value="^.since", lbl="Customer since")
```

When the user fills it in, `customer` holds a string, a boolean, the code `express`
and a real date. A field always writes a typed value, never the text it shows. The
page base of your environment already enables this collection; if it does not,
[enable it once](340-components-and-collections-guide.md#gc-340-050).

<a id="gc-410-005"></a>
<a id="gc-410-010"></a>

## Pick a field by the value you store

| You want to store | Use | The Data receives |
| --- | --- | --- |
| One line of text | [textbox](#gc-410-textbox) | a string |
| Several lines of text | [textBoxArea](#gc-410-textboxarea) | a string with line breaks |
| A password | [passwordbox](#gc-410-passwordbox) | a string, masked on screen only |
| Yes or no | [checkbox](#gc-410-checkbox) | `true` or `false` |
| One code from a few visible options | [radioButtonText](#gc-410-radiobuttontext) | the code |
| Several codes from a list | [checkBoxText](#gc-410-checkboxtext) | the codes, comma-separated |
| One code from a list you can search | [filteringSelect](#gc-410-filteringselect) | the code |
| One code from a list your code builds | [callbackSelect](#gc-410-callbackselect) | the code |
| Free text, with suggestions | [comboBox](#gc-410-combobox) | the text |
| A record chosen from the server | [dbSelect](#gc-410-dbselect) | its key |
| Free text, with suggestions from the server | [dbComboBox](#gc-410-dbcombobox) | the text |
| A number | [numberTextBox](#gc-410-numbertextbox) | a number |
| A number in a range, by dragging | [horizontalSlider](#gc-410-horizontalslider), [verticalSlider](#gc-410-verticalslider) | a number |
| A date | [dateTextBox](#gc-410-datetextbox), [dateCalendar](#gc-410-datecalendar) | a date |
| A time | [timeTextBox](#gc-410-timetextbox) | a time |
| A color | [colorpicker](#gc-410-colorpicker) | a string such as `#ff8800` |

<a id="gc-410-220"></a>
<a id="gc-410-shared-value"></a>
<a id="gc-410-225"></a>
<a id="gc-410-shared-state"></a>
<a id="gc-410-230"></a>
<a id="gc-410-shared-labels"></a>
<a id="gc-410-235"></a>
<a id="gc-410-shared-placeholder"></a>
<a id="gc-410-240"></a>
<a id="gc-410-shared-validation"></a>
<a id="gc-410-250"></a>
<a id="gc-410-shared-formatting"></a>

## What every field has

```python
form.textbox(value="^.email", lbl="Email", lbl_position="L",
             placeholder="name@example.com",
             validate_notnull=True, validate_email=True)
```

- **A label.** `lbl` sets it, `lbl_position` places it: `TL` (the default) puts it
  above on the left, `L` beside on the left. The label can also become a menu:
  see [selectable labels](105-components.md#gc-105-selectable-labels).
- **When it writes.** A field writes when the user leaves it or confirms;
  `live=True` writes at every keystroke.
- **Locking.** `disabled=True` blocks the field; `readonly=True` shows the value
  and refuses edits. Any of them can follow Data: `disabled="^.locked"`.
- **A hint.** `placeholder` shows grey text while the field is empty. It is never
  written to the Data.
- **Checks.** The `validate_*` attributes mark a wrong value and block saving the
  form: [validation](105-components.md#gc-105-076).

<a id="gc-410-300"></a>
<a id="gc-410-015"></a>
<a id="gc-410-textbox"></a>
<a id="gc-410-030"></a>
<a id="gc-410-textboxarea"></a>
<a id="gc-410-035"></a>
<a id="gc-410-passwordbox"></a>

## Text

```python
form.textbox(value="^.name", lbl="Name")
form.textBoxArea(value="^.notes", lbl="Notes", rows=6)
form.passwordbox(value="^.password", lbl="Password")
```

[textbox](345-widget-reference.md#gc-345-textbox) holds one line,
[textBoxArea](345-widget-reference.md#gc-345-textboxarea) several, with `rows` and
`cols` for its size. [passwordbox](345-widget-reference.md#gc-345-passwordbox) hides
the characters on screen; the Data still holds the plain password, so protect it on
the server. Emptying a field writes an empty string.

<a id="gc-410-305"></a>
<a id="gc-410-020"></a>
<a id="gc-410-checkbox"></a>
<a id="gc-410-025"></a>
<a id="gc-410-radiobuttontext"></a>
<a id="gc-410-100"></a>
<a id="gc-410-checkboxtext"></a>
<a id="gc-410-040"></a>
<a id="gc-410-radiobutton"></a>

## Yes or no, and a few visible options

```python
form.checkbox(value="^.newsletter", label="Send me the newsletter", mode="switch")
form.radioButtonText(value="^.size", values="s:Small,m:Medium,l:Large", cols=3)
form.checkBoxText(value="^.days", values="mon:Monday,tue:Tuesday,wed:Wednesday")
```

- [checkbox](345-widget-reference.md#gc-345-checkbox) stores `true` or `false`;
  `mode="switch"` draws it as a switch. `label` is the text beside the box, `lbl`
  the field label above it.
- [radioButtonText](345-widget-reference.md#gc-345-radiobuttontext) shows every option
  and stores the code of the chosen one. `cols` arranges the options in columns.
- [checkBoxText](345-widget-reference.md#gc-345-checkboxtext) lets the user tick
  several options and stores their codes as `"mon,wed"`, or null when none is ticked.
  `popup=True` puts the list in a popup; the options can also come from the server
  ([multiple choices](105-components.md#gc-105-065)).
- [radioButton](345-widget-reference.md#gc-345-radiobutton) is a single option with
  its own boolean. Buttons with the same `group` exclude each other. Prefer
  radioButtonText unless each option needs its own place in the layout.

Options are always written `code:Caption`, separated by commas. The code goes to the
Data, the caption is only shown.

<a id="gc-410-075"></a>
<a id="gc-410-filteringselect"></a>
<a id="gc-410-080"></a>
<a id="gc-410-callbackselect"></a>
<a id="gc-410-085"></a>
<a id="gc-410-combobox"></a>

## Choosing from a list

```python
form.filteringSelect(value="^.country", values="it:Italy,fr:France,de:Germany")
form.callbackSelect(value="^.sample", callback="searchSamples")
form.comboBox(value="^.city", values="Rome,Milan,Turin")
```

- [filteringSelect](345-widget-reference.md#gc-345-filteringselect) is for a fixed
  list: the user types to search, and only a listed option can be chosen.
- [callbackSelect](345-widget-reference.md#gc-345-callbackselect) gets the options
  from a method of your page's `Logic`, which does the search itself
  ([local and callback choices](105-components.md#gc-105-055)).
- [comboBox](345-widget-reference.md#gc-345-combobox) suggests options but accepts any
  text, and stores the text itself
  ([free text suggestions](105-components.md#gc-105-060)).

What the user types to search is never written to the Data; `Escape` cancels it.

<a id="gc-410-090"></a>
<a id="gc-410-dbselect"></a>
<a id="gc-410-095"></a>
<a id="gc-410-dbcombobox"></a>

## Choosing from the server

```python
form.dbSelect(value="^.state", dbtable="states", caption_field="name",
              selectedCaption=".state_name")
```

[dbSelect](345-widget-reference.md#gc-345-dbselect) asks the server for the matching
records while the user types, and stores the key of the chosen one.
`selectedCaption` and `selectedRecord` copy the shown text and the whole record into
other Data paths. [dbComboBox](345-widget-reference.md#gc-345-dbcombobox) works the
same way but accepts free text.

The answers come from a method on your server: your application decides which
records a user may see. A page exported without a server cannot use these fields
([choosing the caption](105-components.md#gc-105-selector-caption-field)).

<a id="gc-410-310"></a>
<a id="gc-410-060"></a>
<a id="gc-410-numbertextbox"></a>
<a id="gc-410-050"></a>
<a id="gc-410-horizontalslider"></a>
<a id="gc-410-055"></a>
<a id="gc-410-verticalslider"></a>
<a id="gc-410-065"></a>
<a id="gc-410-datetextbox"></a>
<a id="gc-410-105"></a>
<a id="gc-410-datecalendar"></a>
<a id="gc-410-070"></a>
<a id="gc-410-timetextbox"></a>

## Numbers, dates and times

```python
form.numberTextBox(value="^.quantity", dtype="L", min=1, max=99)
form.numberTextBox(value="^.price", dtype="N", format="0.00")
form.horizontalSlider(value="^.volume", min=0, max=10, step=1)
form.dateTextBox(value="^.start", period_to=".end", lbl="Period")
form.timeTextBox(value="^.opens_at")
```

- [numberTextBox](345-widget-reference.md#gc-345-numbertextbox) stores a real number;
  `dtype="L"` an integer, `dtype="N"` an exact decimal, as for prices.
- [horizontalSlider](345-widget-reference.md#gc-345-horizontalslider) and
  [verticalSlider](345-widget-reference.md#gc-345-verticalslider) store a number
  between `min` and `max`, in steps of `step`.
- [dateTextBox](345-widget-reference.md#gc-345-datetextbox) stores a date and opens a
  calendar (`calendar=False` removes it). With `period_to`, the user can also type a
  period: the start goes to `value`, the end to the given path.
  [dateCalendar](345-widget-reference.md#gc-345-datecalendar) is the calendar alone,
  always open.
- [timeTextBox](345-widget-reference.md#gc-345-timetextbox) stores a time of day.

The user types in the local format (`locale`, `format`); the Data keeps a real number,
date or time. Text that cannot be read leaves the last good value in the Data
([typed editors](105-components.md#gc-105-045)).

<a id="gc-410-045"></a>
<a id="gc-410-colorpicker"></a>

## A color

```python
form.colorpicker(value="^.theme_color", lbl="Color")
```

[colorpicker](345-widget-reference.md#gc-345-colorpicker) opens the browser's color
chooser and stores the color as `#rrggbb`; it starts from `#000000`.

<a id="gc-410-320"></a>
<a id="gc-410-355"></a>
<a id="gc-410-editingstatus"></a>

## Showing the state of a form

```python
form.editingStatus()
```

[editingStatus](345-widget-reference.md#gc-345-editingstatus) lists the errors and
the unsaved changes of the form it sits in
([editing sessions](340-components-and-collections-guide.md#gc-340-110)). It shows
them; saving is up to your application.
