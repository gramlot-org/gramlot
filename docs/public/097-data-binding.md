# Data binding and controllers

Document ID: **GC-097**.

<!-- The sections moved here from Writing pages keep their block IDs and anchors. -->

This guide covers the Data of a page and its connection to the Source: pointers,
initial values, formulas and controllers, named logic, bound controls, buttons and
the lifecycle of a branch. Page structure is in [Writing pages](095-writing-pages.md);
calls to the server are in [Calling the server](098-server-calls.md) and
[Remote content and lazy Data](099-remote-content.md).

The Binding and Controllers families of the gallery of
[gramlot-examples](https://gramlot-examples.readthedocs.io/en/latest/) show each
section in Python and JavaScript.

<a id="gc-095-040"></a>

## 040 · Data and pointers

Each page instance has one Data Bag, `app.data`. It is the same Bag as
`app.src.builder.data`. Paths written by the author never contain the internal
`_root_` wrapper segment; a user Data field named `main` is ordinary data. Gramlot
owns one subscription to the Data and routes each change to the declarations that
use the changed path.

An HTML attribute or a node value can hold a pointer to a Data path:

| Form | Meaning |
| --- | --- |
| `'^.name'` | Reads the value and reacts when it changes |
| `'=.name'` | Reads the value when the declaration runs; a change does not trigger it |
| `'==expression'` | Inline JavaScript expression, compiled only by the page runtime in the browser and evaluated at each projection of the node |
| `'^.name?color'` | Pointer to the `color` attribute of the Data node at `.name` |

A path starting with `.` is relative to the `datapath` of the enclosing branch.
A change of the Source or of the context registers the affected pointers again.

**Symbolic paths.** A path can start from a symbolic origin resolved by Builder:

- `#FORM` is the first ancestor with `formId` or `form=True`;
- `#ANCHOR` is the first ancestor with `_anchor`;
- `#<node_id>` is the node with that `node_id`.

Example: `value='^#FORM.customer.name'`. The legacy origins `#WORKSPACE`, `#ROW`
and `#DATA` and their aliases are not available.

`#parent` is instead a path segment cancelling the previous Data-path segment.
For a node in `contexts.child`, `^.#parent.name` resolves to `contexts.name`; a
bare leading `^#parent.name` is not a symbolic node origin.

Gallery lessons: *Pointers* (with `#ANCHOR` and parent paths) and *Variable datapath*.

```python
panel = root.div(datapath=".customer")
panel.h2("^.name")                      # shows customer.name
panel.input(value="^.name", live=True)  # edits customer.name
```

**Variable datapath.** `datapath='^.foo'` makes the value stored at `.foo` the
datapath of the branch. When `.foo` changes, every relative path of the branch
changes and its registrations are redone. An empty value gives a null path.
Gramlot implements this rule in `absDatapath` of `GramlotBuilderBagNode`, which
also keeps `?attr` on symbolic paths. Builder and Bag are not modified.

**Attributes ending in `_path`.** An attribute whose name ends in `_path`, such
as `destination_path` or `result_path`, holds a bare path without `^` or `=`. If
the author writes a pointer there, the symbol is removed and a `console.warn`
appears once per declaration. A name ending in `path` without the underscore,
such as `foopath`, is an ordinary attribute. `datapath` follows its own rule
above.

<a id="gc-095-045"></a>

## 045 · Initial values: `dataSetter`

```python
dataSetter(destination_path, value=None, **attr)
```

`dataSetter` writes an initial value into the Data. It replaces the legacy
`data(path, value)` declaration. There is no alias. `root.data(...)` raises an
error that names `dataSetter` and `html_data`. On any other Source node `data` is
the genro-builders property that returns the Data Bag; it does not declare a value
and a call does not raise that error. The HTML5 `<data>` element is written
`html_data(...)`, in Python and JavaScript: `root.html_data("one", value="1")`
gives `<data value="1">`.

In JavaScript the parameters go in one object:
`root.dataSetter({destination_path: '.settings.caption', value: 'Orders'})`. The
same rule holds for `dataFormula` and `dataController`; JavaScript has no
positional form for these parameters.

```python
def main(self, root):
    root.h1("^.settings.caption")
    root.dataSetter(".settings.caption", "Orders")
    root.dataSetter(".settings", None, theme="light")   # attributes only
    root.dataSetter(".filters", {"year": 2026, "tags": ["open"]})
```

- `destination_path` is a Data path, relative or absolute. It does not accept
  `?attr`: a `destination_path` with `?` is a validation error.
- `value` is optional. The remaining keyword arguments become attributes of the
  Data node.
- A Python `dict` or a plain JavaScript object becomes a `Bag` using the default
  recursive population. Nested dictionaries and lists, including dictionaries
  inside lists, become Bags too. This preserves the logical content: sequence
  order and scalar leaf values stay the same; empty nested containers become
  empty Bags. In the example, both `filters` and its `tags` child are Bags.
- A list passed directly as `value` remains a literal list. A JSON string passed
  directly remains a string: `dataSetter` does not parse JSON.

**Installation order.** For the initial Source, and for every branch inserted
later, all `dataSetter` declarations of the branch are installed before its DOM
is built. They run in document order, including a `dataSetter` nested after a
visual sibling. An element declared before a `dataSetter` therefore shows the
final value at the first render. For the same path, the later declaration wins.
Duplicate declarations produce no warning.

**Null values (rule R1).** Only during installation:

- a non-null value is written; the later one wins;
- a null value on an existing path leaves the value and applies the attributes;
- a null value on a missing path creates the path with null and the attributes.

So `dataSetter('x', 7)` followed by `dataSetter('x', None)` leaves 7. Writes at
run time are not affected by R1.

`value` and the attributes are stored as written: `'^y'`, `'==a+b'` and
`'a${b}'` stay strings. A computed value comes from `dataFormula`.

Removing a `dataSetter` from the Source does not delete its Data. A rebuild or a
thaw does not install it again. A `Bag` value moves into the Data without a copy;
the Source node then no longer carries it. Gallery lesson: *Setters and defaults*.

<a id="gc-095-050"></a>

## 050 · Build-time defaults and data defaults

A declaration can give a default to its own pointers:

- `default` and `default_value` give the default of the `value` pointer;
  `default_value` prevails over `default`;
- `default_<attr>` gives the default of the pointer in attribute `<attr>`;
- `attr_<name>=v` sets the attribute `<name>` on the Data node of the control's
  `value` (or `src`). `v` can be a pointer.

Defaults are applied after all `dataSetter` declarations of the branch, and only
on empty paths. Null and a missing path count as empty. `false`, `0` and the
empty string are values. A default never overrides a `dataSetter`, even one
declared later.

`attr_*` follows the legacy rule. It applies only if the Data node of the
`value` exists, and without an emptiness check. It applies after the node's own
defaults, so a default that has just created the Data node receives the
attribute.

```python
root.input(type="number", value="^.font_size", default_value=14)
root.input(value="^.price", attr_dtype="N")   # dtype='N' on the Data node .price
```

These are **build-time defaults**: parameters of the page structure, such as a
font size or a colour. They are not the defaults of application records. Most
page Data arrives after construction, in a cycle of loading (for example from a
remote call), editing, saving and loading again. When a user inserts a new
record, a "newrecord" is loaded, and the record defaults belong to it. Forms,
records and newrecord are not provided, so the core offers only build-time
defaults. Do not use them to model record defaults. Gallery lesson: *Setters and
defaults*.

<a id="gc-095-055"></a>

## 055 · Formulas and controllers

```python
dataFormula(result_path, formula=None, func=None, **params)
dataController(script=None, func=None, **params)
```

- `dataFormula` computes a value and writes it at `result_path`. `result_path`
  does not accept `?attr`.
- `dataController` runs code; the code writes Data itself.
- `func` names a registered logic method (section 060). This is the recommended
  form.
- `formula` and `script` hold inline code (section 065).
- A declaration uses either `func` or inline code: both together are an error.

Keyword arguments with `^` trigger the declaration; with `=` they are only read.
The legacy form `dataFormula('.total', 'a + b', a='^.a', b='^.b')` keeps working
as inline code. Gallery lessons: *Formula* and *Controller*.

Control attributes:

| Attribute | Effect |
| --- | --- |
| `_if`, `_else` | If `_if` is false, `_else` runs when present, then execution stops |
| `_init` | Runs once, before the DOM is built |
| `_onBuilt` | Runs after the first successful build |
| `_onStart` | Runs when the page is ready; a number is a delay in ms; `true` and `0` mean no delay; a negative or non-finite number is an error |
| `_delay` | Debounce in ms; the last call wins |
| `_timing` | Repeats every given number of seconds |
| `_userChanges` | Runs only when the changed path is the registered path itself; changes of a containing path or of a path below it are skipped |

`_init`, `_onBuilt` and `_onStart` accept `true`, `false`, null or a number; any
other value, a pointer included, is an error naming node and attribute.

`_userChanges` separates edits from the loading of a whole structure. It does not
distinguish the user from the program. Removing the declaration stops its timers.

<a id="gc-095-060"></a>

## 060 · Named logic

Named logic is the primary way to attach behavior. A logic module that has logic
methods exports a class called `Logic`. Its methods are copied into a group of the
page instance. A module without `Logic` has no logic methods.

```python
class Page(BasePage):
    js_requires = "business"

    def main(self, root):
        root.input(type="number", value="^.price")
        root.dataFormula(".discounted", func="business.discount", price="^.price")
        root.dataFormula(".total", func="add", a="^.a", b="^.b")
```

```javascript
// _resources/business.js
export class Logic {
    discount(kwargs) { return round(kwargs.price * 0.9); }
}
function round(x) { return Math.round(x * 100) / 100; }   // private to the file
```

```javascript
// orders.js: the page module, with the page's name. The JavaScript page uses Page and
// Logic; the Python page orders.py beside it takes Logic only.
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) { root.dataFormula({result_path: '.total', func: 'add', a: '^.a', b: '^.b'}); }
}

export class Logic {
    add(kwargs) { return kwargs.a + kwargs.b; }
    reset(node, kwargs) { this.page.logic.business.discount(kwargs); }
}
```

- The page logic is the `Logic` export of the page module: `orders.js` for the
  JavaScript page, and `orders.js` beside `orders.py` for the Python page, whose
  `Page` export stays unused. A separate companion `orders_aux.js` that exports
  `Logic` is also accepted; a page with both raises an error. Use the companion when
  the JavaScript `Page` imports server-only modules: the page module is imported by
  the browser too, so all its imports must resolve there. A page module without
  `Logic`, also beside a Python page, gives no logic methods: write `Logic` only when
  the page has methods. A misspelt export (`logic`) is not an error at load; it shows
  when a `func="..."` looks for its method, and the error names the method and the
  resources of the group.
- The page logic's methods live in `page.logic`. Each name in `js_requires`
  becomes a group: `page.logic.business`. A name with `/` becomes a nested group.
- `func='business.discount'` calls a group method; `func='add'` calls a
  method of the page logic.
- A formula method is called as `method(kwargs)` and returns the value. A
  controller method is called as `method(node, kwargs)`.
- `kwargs` contains the resolved author attributes, plus `_node`, `_triggerpars`,
  `_reason` and, for a button, `_evt` and the `button_*` arguments. Control
  attributes (`destination_path`, `result_path`, `func`, `formula`, `script`, `_if`,
  `_else`, `_init`, `_onStart`, `_onBuilt`, `_delay`, `_timing`, `_userChanges`) are
  not in `kwargs`.
- Inside a method, `this` is the group and `this.page` is the page instance.
- The same resource found at several levels fills the same group, from the
  generic to the specific; for the same method name the specific one wins.

These cases are errors: a `Logic` class with an explicit constructor; a method
named `page` or named like a child group; a missing name. A missing name never
falls back to inline code. State lives on the group or on the page, assigned by
the methods.

Named logic works under a Content Security Policy without `'unsafe-eval'`.
[Classes and server adapters](090-classes-and-hosts.md#gc-090-030) describes
resource lookup and file layout. With `GramlotFileServer`, which the current
adapters and the gallery use, only the page logic exists (the `Logic` of `foo.js`,
or `foo_aux.js`), and its methods are the root group: `func='add'`. A dotted name
such as `business.discount` needs a `js_requires` group, that is a `GramlotServer`
with a resource system, which comes with genro-kajenn. Gallery lesson: *Named
logic*.

The same method name registered twice in the same group: the last registration
wins. The page logic registers after the `js_requires` names.

<a id="gc-095-065"></a>

## 065 · Writing Data from code and inline code

Code writes Data through the methods of the Source node. Gramlot adds no
separate set of operations.

| Method | Effect |
| --- | --- |
| `node.GET(path)` / `getRelativeData` | Reads a value |
| `node.SET(path, value)` / `setRelativeData` | Writes and triggers reactions |
| `node.PUT(path, value)` | Writes without triggering reactions |
| `node.FIRE(path, value=true)` | Triggers even with an equal value, then resets the path to null silently |
| `node.FIRE_AFTER(path, value=true, delay=10)` | Fires after `delay` ms; 10 ms is the legacy default |

In the browser every Source node is a `GramlotBuilderBagNode`, in a
`GramlotBuilderBag`. These Gramlot classes extend Builder's `SourceBagNode` and
`SourceBag`. `GET`, `SET`, `getRelativeData` and `setRelativeData` are Builder's.
Gramlot's node class provides the silent `PUT`, the `FIRE` that marks its write
for the Data router, `FIRE_AFTER` with its timer tied to the node, and
`absDatapath`. Builder and Bag are not modified.

**Inline code** is allowed but discouraged, and may be deprecated. `formula` and
`script` strings are compiled only in the page runtime in the browser, with
`this` bound to the Source node:

```python
root.dataController("this.SET('.count', 0)", _fired="^.reset")
```

No server compiles code: not the Python `GramlotServer`, the JavaScript
`GramlotServer`, the `GramlotWorkerServer` nor the DevTools panel. A page with
inline code needs `'unsafe-eval'` when its server sets a Content Security Policy.
Under a policy without it, the browser refuses the compilation and Gramlot raises an
`EvalError` that names the node and the attribute and points to named logic or to
the permissive profile ([Classes and server adapters](090-classes-and-hosts.md#gc-090-035)).
The error covers every inline declaration: `formula`, `script`, `_if`/`_else`, `==`,
`action` and `connect_on<event>`. Gallery lessons: *Inline expressions* and *Node
methods*. The file exported by `@gramlot/gramlot-serverless` allows
`'unsafe-eval'`, so inline code runs there too.

Inline code runs only as written in the Source the page receives: `main`, a remote
Source, or a `GramlotBuilderBag` given to `startSource`. Write it in `main` or in the
method of a remote Source, as a literal string. These are errors that name the node
and the attribute ([Classes and server adapters](090-classes-and-hosts.md#gc-090-035)):

- a code attribute changed by page code after the start, or a node with inline code
  inserted in the live Source: its text is not run. Code that must change at run time
  belongs in named logic;
- inline code built from data: a code attribute that holds a pointer
  (`formula='^.code'`) is refused when the Source is received. Data reaches inline
  code as parameters (`a='^.a'`), never as text;
- an attribute with the form of an HTML event handler (`onclick='…'`): write
  `connect_onclick` instead;
- a `javascript:` URL in `href`, `src`, `formaction` or `xlink:href`, written or
  from Data.

An `iframe` whose `srcdoc` comes from Data gets `sandbox=""`: the HTML is shown and
runs nothing, no script, form, popup or access to the page. `srcdoc` comes from Data
when it is a pointer (`srcdoc='^.preview'`), a `==` expression or an explicit
pointer template, or when the node value is a pointer, whose datum can carry
`srcdoc` in its `_wdg`. A literal `srcdoc` gets no `sandbox`. A `sandbox` written in
the Source is kept as written: `sandbox='allow-scripts'` lets the HTML run scripts,
and is the way to turn the rule off ([Classes and server adapters](090-classes-and-hosts.md#gc-090-035)).

```python
pane.dataFormula(".total", "price * quantity", price="^.price", quantity="^.quantity")
pane.button("Save", action="this.FIRE('.save')")
pane.span("x", connect_onclick="this.SET('.clicked', true)")
```

**Legacy macros** (`GET .a`, `SET .a = v`, `PUT`, `FIRE`, `FIRE_AFTER`, `$1`)
are accepted only by a deprecated compatibility preprocessor for inline code. It
uses the legacy regular expressions and translates to `this.GET(...)`,
`this.SET(...)` and the matching methods; `$1` becomes `arguments[0]`. Like the
legacy, it also translates a macro inside a string or a comment. A
`console.warn` appears once per declaration and shows the new form. Code already
written as `this.SET(...)` passes unchanged and without warning. The `PUBLISH`
macro is an error: use `gramlot.publish` ([Writing pages](095-writing-pages.md#gc-095-115)).

<a id="gc-095-070"></a>

## 070 · Bound controls and reactive attributes

`value='^path'` binds an HTML form control to a Data path in both directions. The
Data representation of each control:

| Control | Data value | Boundary behavior |
| --- | --- | --- |
| text, textarea (and `password`, `email`, `url`, `tel`, `search`) | string, or null shown empty | an empty string is kept; a Data change during an IME composition is shown when it ends |
| number | finite number, or null | an empty field writes null; an invalid draft stays in the DOM and writes nothing, never `NaN` |
| range | finite number, or null | the browser clamp writes nothing |
| select (single) | string, or null | a missing option selects nothing and leaves the Data unchanged |
| select (multiple) | array of strings, `[]` included, or null | null selects nothing; no delimiter strings; any other value is an error |
| date, time, month, week, datetime-local | string in the lexical form of the browser control, or null | no `Date` object, no time-zone conversion |
| color | string as serialized by the browser | a browser normalization writes nothing |

`hidden` and `file` inputs have no adapter; checkbox and radio are below; button
inputs keep the browser behavior. An input type the browser does not know behaves
as text. A literal or `=` value sets the control and never writes. A literal
`value` (neither `^` nor `=`) is also written as the control's default:
`defaultValue` for an input, the text for a textarea, so a form Reset restores the
value written in the page. A `^` value sets the property only. Select, checkbox and
radio keep the default of their authored `selected` or `checked` attribute.

- `live=False` is the default: the Data is written on `change`. `live=True`
  writes on every `input`, for text, textarea, number and range. Select, color
  and the temporal types always write on `change`.
- A correction written by a controller is shown on the control that produced the
  edit. Other attributes bound to the same path update while the user types.
- Changing `type`, `multiple` or `group` rebuilds the element and keeps its
  binding.

Gallery lessons: *Native editing*, *Checkbox and radio*, *Style and visibility*
and *Bound SVG*. The input components of [Components](105-components.md) use the
same binding with their own Data values.

**Checkbox:** `input(type='checkbox', value='^.flag')` holds a boolean. Data
receives only `true` or `false`, never `'on'`.

**Radio:** `input(type='radio', group='size', value='^.small')`. Each button
has its own boolean. When the user chooses a button, it becomes `true` and the
other buttons of the group become `false`. `group` produces the generated `name`
in the DOM, scoped to the page instance. More than one initial `true` in a group
is an error. A radio group bound to a single value is the component
`radioButtonText` ([Components](105-components.md#gc-105-005)).

**Reactive attributes:**

| Attribute | Effect | Null |
| --- | --- | --- |
| `style='…'` | `style` attribute, a string | removes `style` |
| `class='…'` | `class` attribute, a string | removes `class` |
| `visible=…` | `false` sets `style.visibility='hidden'`; the element keeps its space | the current `style` returns |
| `hidden=…` | HTML boolean attribute | as any HTML boolean attribute |
| style shortcuts: `style_*`, `color`, `width`, `background_*`, `font_*`, `margin_*`, `padding_*`, `border_*`, …; `rounded`, `shadow`, `transform`, `filter`, `transition`, `zoom`, `gradient` | one CSS property in the composed `style`; a shortcut wins over the same property in `style='…'` | removes that property only |
| `width`/`height` on `img`, `canvas`, `embed`; `width`/`border` on `table` | HTML attribute, not CSS, as in legacy GenroPy | removes the attribute |
| SVG presentation attributes | SVG attribute; no style shortcuts on SVG | removes the attribute |
| `data_*`, `aria_*` | `data-*`, `aria-*` attribute | removes the attribute |
| other HTML attributes | the attribute, as written | removes the attribute |

For `style` and `class`, a value other than a string or null is an error. The check
runs in the Python and JavaScript static renderers and in the live renderer, before
the attributes are composed, also on resolved pointers and on live `==` results;
the static renderers leave `==` expressions to the browser. A rejected live value
leaves the displayed attribute unchanged and does not undo the Data or Source write;
correct the value to resume the projection. The same check applies to SVG and to
literal `html_style`/`html_class` attributes. Numeric style shortcuts such as
`width=10` are accepted. `style` as a Bag or dictionary and `root.css()` are not
supported; themes are described in [Themes and CSS](096-themes-and-css.md).

### Attribute templates and text masks

An explicit pointer template reads its leading Data value with `{}` and other
current attributes of the same Source node with `{name}`. For example:

```python
root.div("Preview", title="^.name:Customer: {customer}", customer="^.name")
root.p("^.name", mask="Hello, {}")
```

The title follows `.name`; `customer` remains a normal projected attribute.
Ordinary `${customer}` text is literal, including any preceding backslash. To
migrate `title="Customer: ${customer}"`, write the explicit pointer template above.
An unknown Source attribute is an error. `:=` evaluates an activated JavaScript
expression using typed slots; `:` only composes text. JavaScript template literals
inside scripts or `==` expressions retain normal JavaScript semantics. Section 130
describes templates and expressions in full.

`mask` formats node text using `{}` and never enables raw HTML. Live `format` uses
`gramlot.format` before applying the mask
([Writing pages](095-writing-pages.md#gc-095-125)). The old `%s` placeholder is not
interpreted. Widget `value` keeps an ordinary pointer without a suffix.

<a id="gc-095-075"></a>

## 075 · Buttons and events

A `dataController` nested in a `button` is the main way to handle a click:

```python
btn = root.button("Save")
btn.dataController(func="orders.save", total="=.total")
```

`button` renders the component `gramlot-button`, with an internal HTML button
([Components](105-components.md#gc-105-095)); `toggleButton`, `dropDownButton` and
`menuline` use the same command engine. `html_button` renders an HTML `<button>`
(below).

- The nested controller is an ordinary `dataController`: it also reacts to `^`
  pointers, `_init`, `_onStart` and `_timing`. The click is one more trigger.
- It receives `_evt`, `button_counter`, `button_shift`, `button_ctrl`,
  `button_alt` and `button_meta`. The counter lasts as long as the Source node,
  including across rebuilds.
- `action`, `fire` and `fire_*` are alternatives to the nested controller:
  - `action='…'` is inline code run on click, with `this` bound to the button
    node. It receives the current button attributes plus `event`, `_counter` and
    `modifiers`. The inline code rules of section 065 apply;
  - `fire='.path'` calls `FIRE` on `.path` at each click. The value is the
    modifier string (`'Shift'`, `'CtrlAlt'`, …), or `true` without modifiers.
    The Data node receives the attributes `modifier` and `_counter`;
  - `fire_<name>='.path'` calls `FIRE` on `.path` with the value `'<name>'`, for
    example `fire_save='.action', fire_close='.closing'`.
- A `dataRpc` nested in a `button` is a click mechanism like a nested
  `dataController`: the click calls the endpoint
  ([Calling the server](098-server-calls.md#gc-095-100)).
- A button has one mechanism only. Several `dataController` or `dataRpc` children,
  or any combination of nested controller, `action` and the `fire` family, produce
  an error. Several `fire_*` attributes on the same button all fire, in attribute
  order. `fire` together with `fire_*` is one mechanism: `fire` wins and the
  `fire_*` are ignored, as in the legacy chain. The `fire_*` attributes also
  write `modifier` and `_counter` on their Data nodes.
- `connect_on<event>`, for example `connect_onclick`, attaches a DOM event
  listener to any element. On a button it runs after the Gramlot mechanism.

**Rule R3.** For a `button` with a Gramlot mechanism:

- without a `type` written by the author, the framework sets `type="button"`; an
  author's `type` stays, and `type="button"` stays if the mechanism is removed
  later;
- the click calls `stopPropagation`, as in legacy;
- no `preventDefault`;
- a disabled button does nothing and does not count the click.

A `button` without a mechanism runs nothing and lets the click propagate; a
`dataController` of a parent node is not its mechanism. A `button` never submits or
resets a form. `input` elements of type button, submit, reset and image, and
`html_button`, keep the browser behavior. The legacy 200 ms disable after a click
and `LightButton` are not provided.

Known effect: in a form with one text field and no HTML submit button, Enter submits
the form through the browser, and the mechanism of a `button` does not run.

Gallery lessons: *Button controller* and *Events*. A `connect_on<event>` value made
of dotted names (`group.method`) is named logic; any other value is inline code.
The event name is the text after `connect_on`, lower-cased.

`gramlot.dom` relates Source and DOM through two methods with the legacy names.
`getBaseSourceNode(domNode)` climbs the DOM to the first rendered element and
returns its Source node, or null. `getDomNode(sourceNode)` returns the element of
the node, or null for a fragment, a data element, a removed node or a node not
yet built. Gramlot adds no properties to DOM elements or Source nodes.

### Plain HTML buttons and delayed clicks

`html_button` is a distinct Source element that renders an HTML `<button>`. It
keeps the form submit and reset of the browser and event bubbling, without an
implicit `type`; its click runs no Gramlot action, ask, fire or nested controller. Use
`type="button"` when it should not submit a form; events use `connect_onclick`.
Declare `action`, `ask`, `fire` and `_delay` on `button`, not on `html_button`.

```python
form.html_button("Reset", type="reset")
pane.button("Run", _delay=300).dataController(func="run")
```

With a positive button `_delay` (milliseconds), each click restarts the wait.
One execution follows the last click, using its event and modifiers and the number
of clicks in that group: `_counter` for action and fire, `button_counter` for the
nested controller or RPC. The next group starts again at 1. Arguments are read
when the mechanism runs. With no delay or zero, each click runs at once and the
counter lasts as long as the node. An ancestor may supply `_delay`; a button's zero
overrides it. The delay runs before ask and before the click mechanism. A
provider's own `_delay` stays separate, for Data and message triggers. Explicit
event listeners still run at each click, without waiting. Removal, page disposal
or DOM detachment cancels pending work; a disabled button cannot deliver it. R3 and
the one-mechanism rule stay the same. Gallery lesson: *Plain and delayed buttons*.

<a id="gc-095-080"></a>

## 080 · Lifecycle order

For a branch that is not frozen:

1. validation of the whole branch, without effects;
2. `dataSetter` installation, in document order;
3. defaults;
4. registration of pointers, formulas and controllers;
5. `_init`, once per node;
6. DOM construction with the current values;
7. `_onBuilt`, after the first successful build;
8. `_onStart`: after page readiness for the initial Source; right after step 7
   for a branch inserted later.

This order applies to the initial Source, to `remoteSource` and to every branch
inserted into the Source. Observers already active see the `dataSetter` writes
synchronously; the new branch's formulas and controllers wait until steps 2 and 3
end. On error, the new registrations are closed; Data is not rolled back.

**Source changes during a build.** Each build runs from start to end. A Source
change made during a build is queued and runs after it, in arrival order. A
change to a node that is being built is ignored.

**Freeze.** Freeze suspends only structural rebuilding
([Writing pages](095-writing-pages.md#gc-095-030)). Elements already built inside a
frozen branch still react to Data changes. A branch inserted under a freeze runs
steps 1–5 at once; its DOM and `_onBuilt` wait for the thaw; `_onStart` waits for
the first build. A thaw performs one build of the current Source, without
installing Data again and without repeating `_init` or `_onStart`. Removing a
branch closes its registrations and timers, also under freeze. Gallery lesson:
*Freeze*.

**Cleanup.** Removing a Source node closes its bindings: providers, timers,
registrations, event listeners and pending requests stop, and the renderer removes
the DOM. Closing the page disposes the `Gramlot` instance and does the same for
the whole page.

- Handlers of a node removed under freeze do nothing: a control does not write
  the Data, a button and a `connect_on<event>` do not run.
- A callback that removes its own node runs to its end: a `SET` after the removal
  still writes. Only the Gramlot handlers stop: the `fire_*` loop, the radio peer
  loop and the listeners.
- A failing disposer does not stop the others. The renderer completes the removal
  and then throws the closing errors: one error as it is, several as an
  `AggregateError`.
- A first render that fails removes the records its children created before the
  error (listeners, controls, radio groups, references); the Data is not rolled
  back.

Gallery lessons: *End-to-end story*, from the first render to the close, and
*Lifecycle*.

<a id="gc-095-085"></a>

## 085 · Excluded declarations

These attributes produce an explicit error: `serverpath`, `dbenv`, `shared_id` and
every name that starts with `formsubscribe_`. The `PUBLISH` macro in inline code is
an error too. The same keys inside a user Data Bag remain ordinary data.

These legacy features are not provided, without a dedicated error: store, grid and
tree; form, record and newrecord; server synchronisation of Data; rich text
editing; asynchronous scheduling and transactions; the developer warning Bag.
`script` in the Source is the HTML5 element and is not evaluated.

<a id="gc-095-090"></a>

## 090 · Differences from legacy GenroPy and migration

Intended differences:

- `dataSetter(destination_path, …)` replaces `data(path, value)`, without alias.
- R1: a null `dataSetter` value keeps an existing value but applies its
  attributes. Legacy skipped the whole write, attributes included.
- All `dataSetter` declarations of a branch are installed before its DOM. Legacy
  prepared only a node and its direct children before building it.
- `destination_path` and `result_path` do not accept `?attr`.
- R3: a Gramlot button calls `stopPropagation` but not `preventDefault`, and gets
  `type="button"` when the author wrote none. Legacy called both and set no
  type (section 075).
- `css_requires` and `js_requires` need a `GramlotServer` with a resource system,
  which comes with genro-kajenn, part of Genro, the framework that succeeds GenroPy
  (built on Kajenn, Gramlot and Asqueel); `GramlotFileServer` and the current
  adapters raise an error for any name. When the same method name is registered
  twice in a group, the last registration wins.
- `data(...)` is not a declaration: `root.data(...)` raises an error naming
  `dataSetter` and `html_data`; on other nodes `data` is the Data Bag property. The
  HTML5 `<data>` element is `html_data(...)`.
- `name:media` in `css_requires` is an error.
- Combining a nested controller, `action` and the `fire` family on one button is
  an error. Legacy chained them (`action`, then `fire`, then `fire_*`) and also
  ran the nested controller.
- `#WORKSPACE`, `#ROW` and `#DATA` are not available.
- No `sourceNode.domNode` or `element.sourceNode` properties: use
  `getBaseSourceNode` and `getDomNode`.
- `script` in the Source is the HTML5 element, without `dojo.eval`.
- Legacy macros work only through the deprecated preprocessor.

Migration from legacy pages:

- replace each `data(path, value, …)` with `dataSetter(path, value, …)`;
- `Page.css` (a list of URLs) stays; a stylesheet of the page alone can move to
  the same-name file `foo.css` beside the page;
- move inline controller code to named logic in the page module's `Logic` or in
  a `js_requires` resource;
- write Data with `node.SET(...)` and the matching methods instead of macros.

Check migrated pages for remaining `data(` calls.

<a id="gc-095-130"></a>

## 130 · Attribute pointer templates and expressions

Start with the simple cases; use an expression only when the result must keep a
type or call a function.

```python
# Text: the number 38 becomes the CSS length "38px".
pane.div(width="^width:{}px")

# Boolean: editing is disabled when draft is false.
pane.input(value="^name", readonly="^draft:=!{}")

# Text content: format the number, then wrap the formatted text.
pane.p("^amount", format="0.00", mask="Total: {} €")
```

The runtime reads the pointer up to the first `:` in the normal Data context.
Without a suffix it returns the original value. `:` applies a text template;
`:=` evaluates a JavaScript expression and keeps its result type. Further colons
belong to that template or expression. Data is never rewritten by this
transformation. A plain literal containing a colon does not become a pointer.

`{}` supplies the pointer value. `{name}` reads another attribute on the same
Source node, including its binding, without removing that attribute from its normal
projection. First the runtime brings all Source attribute inputs current;
references and projection reuse that same set of values. It never reads these
values from DOM attributes or computed CSS. Reactive `^` dependencies update the
result; `=` remains a read without its own subscription. Relative paths, symbolic
paths and Bag attribute selectors keep their usual addressing rules.

```python
pane.div(width="^width:{}{unit}", unit="^settings.unit")
pane.div(title="^name:Customer: {}")
```

For a tooltip that needs formatting, the expression-local `_F` calls this page's
`gramlot.format`. It uses the same options and locale and time-zone precedence as
[formatting](095-writing-pages.md#gc-095-125); it does not install a global
function.

```python
pane.p("Hover here",
       title="^amount:=_F({}, {pattern: '0.00', mask: '{} €'})")
```

The first `{}` is a typed expression argument. The quoted `'{} €'` stays the mask
passed to the formatter. Data values are passed as arguments, never pasted into
JavaScript code. Expressions use the inline compiler, the Source activation rules
and the Content Security Policy requirements of inline code (section 065);
templates do not require JavaScript evaluation. `_F` is also available in the `==`
expression form.

A template returns null if its leading value or any required slot is null or an
empty string. Use `{?}` / `{?name}` to admit an empty string explicitly; null still
blocks the whole result. Zero and false are valid, and whitespace is not trimmed.
A missing Data path follows the null behavior. A missing Source attribute or a
circular attribute dependency raises an error rather than inventing a value.
Expressions receive typed null and empty strings and decide their own result.

```python
pane.div(title="^name:Customer: {?}")  # "" → "Customer: "; null → null
```

Suffixes are not allowed in the `value` of HTML inputs, textareas, selects and
components. Keep ordinary value bindings for editing; no inverse conversion is
defined. Node text uses `format` and `mask`, as above. Other attributes, including
live `datapath` and computed `*_path` attributes, use the same read-then-transform
rule, followed by the destination's checks. Data-path segment names use letters,
digits and underscore; dots and addressing operators remain path syntax.

Python authoring sends the same Source declarations as JavaScript authoring. Static
Python and JavaScript rendering resolve templates from the available Data;
expressions stay inert until the page starts in the browser. The Python static
renderer does not resolve variable contexts. Ordinary `${name}` text is literal; use explicit
pointer suffixes for interpolation. Gallery lesson: *Pointer templates and
expressions*.

Placeholder tokens in expressions are recognized outside quoted strings, template
literals, comments and regular-expression literals. An empty object or a shorthand
object such as `{name}` conflicts with the placeholder syntax: write explicit object
members when an object is intended. Template braces must form supported slots;
there is no escape for a literal brace.
