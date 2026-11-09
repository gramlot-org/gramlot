# Data and logic reference

Document ID: **GC-515**.

This page lists every option for Data, bindings and browser code, grouped by the job
you are doing. Each group starts with an example; the tables then give the full set.
If you are new to these ideas, read [Data and binding](510-data-and-binding.md) first.

<a id="gc-515-005"></a>

## 005 · Pointing at a value

Block ID: **GC-515-005**.

Any attribute can point at a Data value instead of holding a fixed one. The pointer
decides two things: **where** the value is, and **whether the element follows it**.

```python
panel = root.div(datapath="customer")
panel.input(value="^.name")                       # follows customer.name
panel.button("Print").dataController(func="print", name="=.name")  # reads it on click
panel.div(width="^.size:{}px")                    # 38 becomes "38px"
```

How the pointer reads the value:

| Form | Meaning |
| --- | --- |
| `^path` | Read and follow: the element updates when the value changes |
| `=path` | Read once, when the declaration runs |
| `==expr` | Evaluate a JavaScript expression in the browser |
| `^path?attr` | Read the attribute `attr` of the Data node, not its value |
| `^path:text {}` | Put the value into a text; `{name}` reads another attribute of the same element |
| `^path:=expr {}` | Put the value into a JavaScript expression and keep the result type |

Where the path starts:

| Path | Starts from |
| --- | --- |
| `.name` | the nearest `datapath` above the element |
| `name` | the root of the Data |
| `#FORM.name` | the nearest form above the element |
| `#ANCHOR.name` | the nearest element with `_anchor` |
| `#editor.name` | the element declared with `nodeId="editor"` |
| `.#parent.name` | one level up from the current `datapath` |

A `datapath` can itself follow a value: with `datapath="^.current"`, changing
`current` moves the whole panel to another branch of the Data. Attributes whose name
ends in `_path`, such as `result_path`, take a plain path without `^` or `=`.

<a id="gc-515-010"></a>

## 010 · Giving initial values

Block ID: **GC-515-010**.

Most values come from the server. Two tools cover the rest: a **default** fills a
value only if it is missing, `dataSetter` writes it in any case.

```python
root.input(type="number", value="^.font_size", default_value=14)
root.dataSetter(".filters", {"year": 2026, "tags": ["open"]})
```

| Declaration or attribute | Effect |
| --- | --- |
| `dataSetter(destination_path, value=None, **attr)` | Writes the value; extra keywords become attributes of the Data node |
| `default`, `default_value` | Default of the `value` pointer; `default_value` wins |
| `default_<attr>` | Default of the pointer held in `<attr>` |
| `attr_<name>=v` | Sets the attribute `<name>` on the Data node of `value` |

- Every `dataSetter` of a branch runs before the branch is drawn, so the first
  render already shows its values. Defaults run right after.
- A default never overwrites a value, not even `0`, `False` or `""`.
- A `dict` becomes a Bag, nested ones included. A list stays a list; a JSON string
  stays a string.

<a id="gc-515-015"></a>

## 015 · Computing and reacting

Block ID: **GC-515-015**.

A **formula** keeps one value computed from others. A **controller** runs code when
something happens. Both take their inputs as keyword arguments: `^` arguments trigger
them, `=` arguments are only read.

```python
root.dataFormula(".total", func="add", a="^.price", b="^.shipping")
root.dataController(func="autosave", doc="^.document", _delay=500)
root.dataController(func="refresh", _onStart=True, _timing=60)
```

| Declaration | Effect |
| --- | --- |
| `dataFormula(result_path, formula=None, func=None, **params)` | Writes the computed value at `result_path` |
| `dataController(script=None, func=None, **params)` | Runs code; the code writes Data itself |

`func` names a [Logic method](#gc-515-020); `formula` and `script` hold inline code.
Use one or the other. In JavaScript every parameter goes in one object:
`root.dataFormula({result_path: '.total', func: 'add', a: '^.a'})`.

These attributes control **when** a formula or controller runs:

| Attribute | Runs |
| --- | --- |
| `_if`, `_else` | Only if `_if` is true; otherwise `_else`, if present |
| `_init` | Once, before the page is drawn |
| `_onBuilt` | Once, after the first draw |
| `_onStart` | When the page is ready; a number waits that many ms |
| `_delay` | After that many ms without further changes (debounce) |
| `_timing` | Every that many seconds |
| `_userChanges` | Only when the registered path itself changes, not its parent or children |

<a id="gc-515-020"></a>

## 020 · Writing the code: `Logic`

Block ID: **GC-515-020**.

The code that `func` names lives in the `Logic` class of the JavaScript file with the
page's name: `orders.js`, beside `orders.py` for a Python page.

```javascript
// orders.js
export class Logic {
    add(kwargs) { return kwargs.a + kwargs.b; }                  // formula
    autosave(node, kwargs) { node.SET('.saved_at', new Date()); } // controller
}
```

| Item | Rule |
| --- | --- |
| Formula method | `method(kwargs)`: returns the value |
| Controller method | `method(node, kwargs)`: `node` is the declaring element |
| `kwargs` | The resolved arguments, plus `_node`, `_triggerpars` and `_reason`; a button adds `_evt` and the `button_*` values |
| `this` | The group of methods; `this.page` is the page |
| Several files | With `js_requires = "business"`, `func="business.discount"` calls a method of `business.js`. This needs a server with a resource system |

Inline code (`formula="a + b"`) works too, but the page then needs a Content
Security Policy that allows `'unsafe-eval'`. `Logic` methods do not.

<a id="gc-515-025"></a>

## 025 · Reading and writing Data from code

Block ID: **GC-515-025**.

Inside a method, the element you receive reads and writes Data with paths relative
to its own `datapath`.

```javascript
reset(node, kwargs) {
    node.SET('.count', 0);          // others react
    node.PUT('.draft', null);       // nobody reacts
    node.FIRE('.reload');           // triggers even if nothing changed
}
```

| Method | Effect |
| --- | --- |
| `node.GET(path)` | Reads |
| `node.SET(path, value)` | Writes; pointers and controllers react |
| `node.PUT(path, value)` | Writes silently |
| `node.FIRE(path, value=true)` | Triggers even with the same value, then resets it to null |
| `node.FIRE_AFTER(path, value=true, delay=10)` | Like `FIRE`, after `delay` ms |

<a id="gc-515-030"></a>

## 030 · Buttons and events

Block ID: **GC-515-030**.

A button does one thing on click. The usual way is a controller nested in it.

```python
root.button("Save").dataController(func="save", total="=.total")
root.button("Next", fire=".step")
```

| On a `button` | On click |
| --- | --- |
| nested `dataController` | Runs it; `kwargs` gets `_evt` and `button_counter`, `button_shift`, `button_ctrl`, `button_alt`, `button_meta` |
| nested `dataRpc` | Calls the server ([Calling the server](098-server-calls.md)) |
| `fire=".path"` | Fires the path with the pressed modifiers, such as `"Shift"`, or `true` |
| `fire_<name>=".path"` | Fires the path with the value `"<name>"` |
| `action="code"` | Runs inline code |
| `_delay=300` | Waits for the clicks to stop, then runs once |

- One mechanism per button: two of them on the same button is an error.
- `connect_on<event>`, such as `connect_onclick` or `connect_onkeyup`, listens to
  that browser event on any element.
- `html_button` is the plain HTML `<button>`: it can submit or reset a form and has
  none of the above.

<a id="gc-515-035"></a>

## 035 · Attributes that follow Data

Block ID: **GC-515-035**.

Any attribute can follow a value. A few have a special effect, and a null value
removes what they set.

```python
pane.div("Saved", visible="^.saved", color="^.status_color")
pane.p("^.amount", format="0.00", mask="Total: {} €")
```

| Attribute | Effect | With null |
| --- | --- | --- |
| `style`, `class` | The attribute, as a string | Removed |
| `visible` | `false` hides the element and keeps its space | Shown |
| `hidden` | The HTML attribute: hides and frees the space | Removed |
| `color`, `width`, `margin_*`, `padding_*`, `font_*`, … | One CSS property; write units, as in `"10px"` | That property removed |
| `data_*`, `aria_*` | `data-*` and `aria-*` attributes | Removed |
| `format` | Formats a number or date before display | — |
| `mask` | Puts the text where `{}` is | — |

The values each form field writes are in [Inputs](410-inputs.md).

<a id="gc-515-040"></a>

## 040 · The order things happen in

Block ID: **GC-515-040**.

When a branch is added, at page start or later, Gramlot runs these steps in order.
It explains why a `dataSetter` value is already on screen at the first draw, and why
`_init` cannot see the DOM.

1. Check the branch.
2. Run every `dataSetter`, in the order written.
3. Apply defaults.
4. Connect pointers, formulas and controllers.
5. Run `_init`.
6. Draw the DOM.
7. Run `_onBuilt`.
8. Run `_onStart`.

Removing an element stops everything attached to it: pointers, timers, listeners and
pending server calls.
