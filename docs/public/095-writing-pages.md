# Writing pages

Document ID: **GC-095**. 0.1.2 APIs plus the 0.2.0 data binding.

> **Release status.** This page describes Gramlot **0.2.0 (HTML/SVG data
> binding)**, released on 2026-09-30 (GitHub release `v0.2.0`); the current patch release is **0.2.5**
> (2026-10-03: PyPI `gramlot`, npm and JSR `@gramlot/gramlot`). The previous release is **0.1.2**.
> Sections 005-035 describe behavior that comes from 0.1.2, with explicit *0.2.0*
> notes where 0.2.0 changes it. Sections 040-090 describe 0.2.0 behavior; section 060
> includes the page module of 0.2.5, and section 095 describes `gramlot.inout` (0.2.5).

**Examples.** Two example families run the features of sections 040-080, each
page in Python with its JavaScript equivalent, in the package gramlot-examples:
[`binding/`](https://github.com/gramlot-org/gramlot-examples/tree/main/src/gramlot_examples/pages/binding) (routes `b01`-`b11` in the gallery) and
[`controllers/`](https://github.com/gramlot-org/gramlot-examples/tree/main/src/gramlot_examples/pages/controllers) (routes `c01`-`c09`).
The sections below name the example they illustrate. These features have no
example: `js_requires` groups, `connect_on<event>` by name, `_userChanges`,
`_onBuilt`, `#ANCHOR` and `gramlot.inout`. The `html_svg` family is
HTML and SVG without binding. A reader follows the Python-first example
using only the functions documented here.

<a id="gc-095-005"></a>

## 005 · A first HTML page

This is an authoring example for the development foundation, not a standalone
server command. A host loads the module and supplies `root`.

```python
from gramlot import Page as BasePage, source

class Page(BasePage):
    title = "People"

    def main(self, root):
        panel = root.div("People", id="people")
        panel.p("Choose a person")

    @source
    def details(self, root, name="Homer"):
        root.p(name)
```

`root.div(...)` returns a real SourceBagNode, so nested calls create child Source
nodes. Text is literal text, not parsed HTML. Native attributes such as `id` are
supported; `class_` escapes the Python keyword. Convenience attributes such as
`color` and `background` are not implemented. The vocabulary comes from the exported HTML5 collection. Its open signatures
accept attributes without a separate Gramlot whitelist; accepting `color` as a
literal attribute does not turn it into CSS styling.

*0.2.0:* the legacy style shortcuts become CSS styling in the browser:
`color='red'`, `font_size='12px'`, `margin_top=4`, `style_aspect_ratio='16/9'`,
`rounded=8`. They compose one `style` attribute with `style='…'`, as the static
Builder `HtmlRenderer` already does. `_class` is `class`. They react to Data like
any attribute (section 070).

<a id="gc-095-010"></a>

## 010 · From a page to the browser

1. The host returns a document with a root element, default `gramlot-root`, and runtime bootstrap.
2. `Gramlot` prepares Data and Source roots and subscribes before requesting main.
3. The server executes `main(root)` and sends a typed SourceBag through TYTX.
4. The generic builder decodes and associates the Source, then Gramlot validates it before insertion.
5. Inserting the completed block under Source `main` triggers the renderer.

Later Source insertions, removals and updates use the same subscription. Native
attribute updates can update an existing element; structural changes rebuild the
affected subtree and release its owned objects. Framework code owns this work.

*0.2.0:* the bootstrap document carries a script that creates `PageBootstrap`
with the page's resources. In the browser it writes the stylesheet links (the
`Page.css` URLs, then the same-name `foo.css`), imports the page's JavaScript
modules, creates the `Gramlot` instance, registers the named logic and then
starts the page ([GC-090 section 030](090-classes-and-hosts.md)). Between
validation and DOM construction, each branch installs its Data declarations
(section 080).

<a id="gc-095-015"></a>

## 015 · Remote blocks

`@source` explicitly exposes a public Python method for remote Source generation.
Both `main` and Source methods may be synchronous or asynchronous; they populate
`root` and return `None`. An unmarked override hides an inherited exposed method.
Arguments arrive as the method's keyword parameters.

The browser framework currently exposes
`app.remoteSource(targetNode, "details", {name: "Marge"})`. It replaces the mounted
target's body after incoming Source validation. Invalid incoming Source is rejected before
insertion; rendering errors after insertion do not roll back Source; stale responses and removed targets are ignored.

This is the runtime API, not a declarative page API. A page example must not
fill that gap with manual DOM events or fetches.

*0.2.0:* a branch received through `remoteSource` installs its own `dataSetter`
declarations before its DOM is built, like the initial Source. A button
controller (section 075) can call `this.page.remoteSource(...)` from its named
logic; 0.2.0 defines no declarative remote Source request. The pending request
lives as long as its target: if the target is removed first, the late answer is
ignored, and of two overlapping requests the latest wins. Example:
`controllers/08_remote_source` (`c08`).

<a id="gc-095-020"></a>

## 020 · Deferred capabilities

Recipes, Data bindings, controllers, resolvers and shared components are outside
this Source-live increment. They are not available page APIs.

*0.2.0:* Data bindings, `dataSetter`, `dataFormula` and `dataController` enter
with 0.2.0 (sections 040-090). Recipes, resolvers and shared components remain
deferred; components are planned for 0.3.0. Section 085 lists
all exclusions.

<a id="gc-095-025"></a>

## 025 · SVG inside a page

The exported SVG collection provides the element declarations. Enter its dialect
with `svg`; return to HTML with `html`:

```python
class Page(BasePage):
    def main(self, root):
        drawing = root.svg(viewBox="0 0 100 100", width=100, height=100)
        drawing.circle(cx=20, cy=20, r=10, stroke="red", stroke_width=2)
        drawing.html(width=80, height=25).div("A label")
```

`html` creates an SVG `foreignObject` whose children are HTML. The same Source
subscription handles SVG insertions, attribute changes and removals; ordinary
attribute changes preserve the DOM element. `stroke_width` becomes the native
SVG `stroke-width` attribute. This is SVG attribute adaptation, not general CSS
styling or a new Data-binding API. JavaScript page authoring has equivalent
`root.svg({...}).circle({...})` calls.

*0.2.0:* SVG presentation attributes (`fill`, `stroke`, `stroke-width`,
`opacity`, `transform` and the others) accept `^` pointers like every native
attribute. A null value removes the attribute (section 070).

Next: [Extending Gramlot](100-extensions.md).


<a id="gc-095-030"></a>

## 030 · Freeze a rendered branch

The runtime offers `app.renderer.freeze(node)` and `app.renderer.unfreeze(node)`
for a mounted SourceNode. Freeze is an idempotent flag, not a counter. Source
changes normally; the branch's existing DOM remains visible and its rendering
events are discarded. Other branches continue updating synchronously in FIFO order.

```javascript
const root = app.builder.wrapSource(app.source.getItem('main'));
const panel = root.section();
panel.span('Old content');
app.renderer.freeze(panel);
panel.value.clear();
app.builder.wrapSource(panel).span('Final content');
app.renderer.unfreeze(panel);
```

Unfreeze releases that branch and all descendants, then rebuilds from current
Source. If an ancestor remains frozen, it only releases the flags; rendering waits
for that ancestor. Releasing a parent therefore also releases frozen children.
There is no event replay, timer or Source rollback. Rendering errors propagate.

Old DOM records and their references/cleanup callbacks remain until rebuild or
renderer disposal, even for descendants removed from Source during freeze. If the
frozen root itself was deleted, unfreeze removes its old DOM without recreating it.
An ancestor removed/rebuilt outside that frozen branch disposes its records normally;
freeze/unfreeze require a currently mounted record. These are runtime APIs, not
new Python page event declarations or generic SourceBag methods.

*0.2.0:* freeze suspends only structural rebuilding. Elements already built
inside a frozen branch still react to Data changes. A branch inserted under a
freeze installs its Data declarations at once; its DOM and `_onBuilt` wait for
the thaw (section 080).


<a id="gc-095-035"></a>

## 035 · Changing an element type

To replace a live `div` with a `section`, delete its Source node and insert a new
`section` through the builder. Deletion releases the old DOM and owned resources;
insertion renders the new node. Choose the insertion position explicitly when
sibling order matters. In-place tag-only mutation is outside this increment's
live contract; do not use an extended BagNode.setValue tag argument. Ordinary
value and attribute updates continue through their existing Source methods.


<a id="gc-095-040"></a>

## 040 · Data and pointers (0.2.0)

Each page instance has one Data Bag, `app.data`. It is the same Bag as
`app.builder.data`. Paths written by the author never contain the internal
`main` segment. Gramlot owns one subscription to the Data and routes each change
to the declarations that use the changed path.

A native attribute or a node value can hold a pointer to a Data path:

| Form | Meaning |
| --- | --- |
| `'^.name'` | Reads the value and reacts when it changes |
| `'=.name'` | Reads the value when the declaration runs; a change does not trigger it |
| `'==expression'` | Inline JavaScript expression, compiled only by the page runtime in the browser and evaluated at each projection of the node |
| `'^.name?color'` | Pointer to the `color` attribute of the Data node at `.name` |

A path starting with `.` is relative to the `datapath` of the enclosing branch.
A change of the Source or of the context re-registers the affected pointers.

**Symbolic paths.** A path can start from a symbolic origin resolved by Builder:

- `#parent` goes up one level;
- `#FORM` is the first ancestor with `formId` or `form=True`;
- `#ANCHOR` is the first ancestor with `_anchor`;
- `#<node_id>` is the node with that `node_id`.

Example: `value='^#FORM.customer.name'`. The legacy origins `#WORKSPACE`, `#ROW`
and `#DATA` and their aliases are outside 0.2.0.

Examples: `binding/01_pointers` (`b01`, every pointer form and symbolic
origin) and `02_variable_datapath` (`b02`).

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

## 045 · Initial values: `dataSetter` (0.2.0)

```python
dataSetter(destination_path, value=None, **attr)
```

`dataSetter` writes an initial value into the Data. It replaces the legacy
`data(path, value)` declaration. There is no alias. `root.data(...)` raises an error that names
`dataSetter` and `html_data`. On any other Source node `data` is the
genro-builders property that returns the Data Bag; it does not declare a value and a
call does not raise that error. The HTML5
`<data>` element is written `html_data(...)`, in Python and JavaScript:
`root.html_data("one", value="1")` gives `<data value="1">`.

In JavaScript the parameters go in one object:
`root.dataSetter({destination_path: '.settings.caption', value: 'Orders'})`. The
same rule holds for `dataFormula` and `dataController`; JavaScript positional
arguments of the data elements are not available yet.

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
- A Python `dict` or a plain JavaScript object becomes a `Bag`. Read it as a JSON
  structure: nested dictionaries become nested Bags; lists stay lists, and
  dictionaries inside lists stay dictionaries. A JSON string stays a string.

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
runtime are not affected by R1.

`value` and the attributes are stored as written: `'^y'`, `'==a+b'` and
`'a${b}'` stay strings. A computed value comes from `dataFormula`.

Removing a `dataSetter` from the Source does not delete its Data. A rebuild or a
thaw does not install it again. A `Bag` value moves into the Data without a copy;
the Source node then no longer carries it. Example:
`binding/03_setters_and_defaults` (`b03`).

<a id="gc-095-050"></a>

## 050 · Build-time defaults and data defaults (0.2.0)

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
records and newrecord are outside 0.2.0, so 0.2.0 offers only build-time defaults.
Do not use build-time defaults to model record defaults. Example:
`binding/03_setters_and_defaults` (`b03`).

<a id="gc-095-055"></a>

## 055 · Formulas and controllers (0.2.0)

```python
dataFormula(result_path, formula=None, func=None, **params)
dataController(script=None, func=None, **params)
```

- `dataFormula` computes a value and writes it at `result_path`. `result_path`
  does not accept `?attr`.
- `dataController` runs code; the code writes Data itself.
- `func` names a registered logic method (section 060). This is
  the recommended form.
- `formula` and `script` hold inline code (section 065).
- A declaration uses either `func` or inline code: both together are an error.

Keyword arguments with `^` trigger the declaration; with `=` they are only read.
The legacy form `dataFormula('.total', 'a + b', a='^.a', b='^.b')` keeps working
as inline code. Examples: `controllers/01_formula` (`c01`) and
`02_controller` (`c02`).

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

`_init`, `_onBuilt` and `_onStart` accept `true`, `false`, null or a number; any other
value, a pointer included, is an error naming node and attribute.

`_userChanges` separates edits from the loading of a whole structure. It does not
distinguish the user from the program. Removing the declaration stops its timers.

<a id="gc-095-060"></a>

## 060 · Named logic (0.2.0)

Named logic is the primary way to attach behavior. Each logic file exports a
class called `Logic`. Its methods are copied into a group of the page instance.

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
  `Logic` stays admitted; a page with both raises an error. Use the companion when
  the JavaScript `Page` imports server-only modules: the page module is imported by
  the browser too, so all its imports must resolve there. Beside a Python page,
  `orders.js` exports `Logic`; the browser rejects it otherwise, naming the file.
- The page logic's methods live in `page.logic`. Each name in `js_requires`
  becomes a group: `page.logic.business`. A name with `/` becomes a nested group.
- `func='business.discount'` calls a group method; `func='add'` calls a
  method of the page logic.
- A formula method is called as `method(kwargs)` and returns the value. A
  controller method is called as `method(node, kwargs)`.
- `kwargs` contains the resolved author attributes, plus `_node`, `_triggerpars`,
  `_reason` and, for a button, `_evt` and the `button_*` arguments. Control
  attributes (`destination_path`, `result_path`, `func`, `formula`, `script`, `_if`, `_else`,
  `_init`, `_onStart`, `_onBuilt`, `_delay`, `_timing`, `_userChanges`) are not
  in `kwargs`.
- Inside a method, `this` is the group and `this.page` is the page instance.
- The same resource found at several levels fills the same group, from the
  generic to the specific; for the same method name the specific one wins.

These cases are errors: a `Logic` class with an explicit constructor; a method
named `page` or named like a child group; a missing name. A missing name never
falls back to inline code. State lives on the group or on the page, assigned by
the methods.

Named logic works under a Content Security Policy without `'unsafe-eval'`.
[GC-090 section 030](090-classes-and-hosts.md) describes resource
lookup and file layout. With the minimal `FileHost` only the page logic exists
(the `Logic` of `foo.js`, or `foo_aux.js`), and its methods are the root group:
`func='add'`. A dotted name such as `business.discount` needs a `js_requires`
group, that is a Host with a resource system. Example:
`controllers/03_named_logic` (`c03`).

The same method name registered twice in the same group: the last registration
wins. The page logic registers after the `js_requires` names.

<a id="gc-095-065"></a>

## 065 · Writing Data from code and inline code (0.2.0)

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

No host compiles code: not the Python Host, the JavaScript Host, the WorkerHost
nor the DevTools panel. A page with inline code needs `'unsafe-eval'` when its
host sets a Content Security Policy. Under a policy without it, the browser
refuses the compilation and Gramlot raises an `EvalError` that names the node and
the attribute and points to named logic or to the permissive profile
([GC-090 section 035](090-classes-and-hosts.md)). The error covers every inline
declaration: `formula`, `script`, `_if`/`_else`, `==`, `action` and
`connect_on<event>`. Examples: `controllers/04_inline_expressions`
(`c04`) and `05_node_methods` (`c05`). The file exported by
`@gramlot/gramlot-serverless` allows `'unsafe-eval'`, so inline code runs there too.

Inline code runs only as written in the Source the page receives: `main`, a remote
Source, or a `GramlotBuilderBag` given to `startSource`. Write it in `main` or in the
method of a remote Source, as a literal string. These are errors that name the node
and the attribute ([GC-090 section 035](090-classes-and-hosts.md)):

- a code attribute changed by page code after the start, or a node with inline code
  inserted in the live Source: its text is not run. Code that must change at run time
  belongs in named logic;
- inline code built from data: a code attribute that holds a pointer
  (`formula='^.code'`) is refused when the Source is received. Data reaches inline
  code as parameters (`a='^.a'`), never as text;
- an attribute with the form of a native event handler (`onclick='…'`): write
  `connect_onclick` instead;
- a `javascript:` URL in `href`, `src`, `formaction` or `xlink:href`, written or
  from Data.

An `iframe` whose `srcdoc` comes from Data gets `sandbox=""`: the HTML is shown and
runs nothing, no script, form, popup or access to the page. `srcdoc` comes from Data
when it is a pointer (`srcdoc='^.preview'`), a `==` expression or a `${…}` template
reading a pointer, or when the node value is a pointer, whose datum can carry
`srcdoc` in its `_wdg`. A literal `srcdoc` gets no `sandbox`. A `sandbox` written in
the Source is kept as written: `sandbox='allow-scripts'` lets the HTML run scripts,
and is the way to turn the rule off ([GC-090 section 035](090-classes-and-hosts.md)).

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
written as `this.SET(...)` passes unchanged and without warning.

<a id="gc-095-070"></a>

## 070 · Native controls and reactive attributes (0.2.0)

`value='^path'` binds a native control to a Data path in both directions. The
Data representation of each control:

| Control | Data value | Boundary behavior |
| --- | --- | --- |
| text, textarea (and `password`, `email`, `url`, `tel`, `search`) | string, or null shown empty | an empty string is kept; a Data change during an IME composition is shown when it ends |
| number | finite number, or null | an empty field writes null; an invalid draft stays in the DOM and writes nothing, never `NaN` |
| range | finite number, or null | the browser clamp writes nothing |
| select (single) | string, or null | a missing option selects nothing and leaves the Data unchanged |
| select (multiple) | array of strings, `[]` included, or null | null selects nothing; no delimiter strings; any other value is an error |
| date, time, month, week, datetime-local | string in the native lexical form, or null | no `Date` object, no time-zone conversion |
| color | string as serialized by the browser | a browser normalization writes nothing |

`hidden` and `file` inputs have no adapter; checkbox and radio are below; button
inputs stay native. An input type the browser does not know behaves as text. A
literal or `=` value sets the control and never writes. A literal `value` (neither
`^` nor `=`) is also written as the control's default: `defaultValue` for an input,
the text for a textarea, so a native form Reset restores the value written in the
page. A `^` value sets the property only. Select, checkbox and radio keep the
default of their authored `selected` or `checked` attribute.

- `live=False` is the default: the Data is written on `change`. `live=True`
  writes on every `input`, for text, textarea, number and range. Select, color
  and the temporal types always write on `change`.
- A correction written by a controller is shown on the control that produced the
  edit. Other attributes bound to the same path update while the user types.
- Changing `type`, `multiple` or `group` rebuilds the element and keeps its
  binding.

Examples: `binding/04_native_editing` (`b04`), `05_checkbox_radio`
(`b05`), `06_style_and_visibility` (`b06`) and `07_bound_svg` (`b07`).

**Checkbox:** `input(type='checkbox', value='^.flag')` holds a boolean. Data
receives only `true` or `false`, never `'on'`.

**Radio:** `input(type='radio', group='size', value='^.small')`. Each button
has its own boolean. When the user chooses a button, it becomes `true` and the
other buttons of the group become `false`. `group` produces the generated `name`
in the DOM, scoped to the page instance. More than one initial `true` in a group
is an error. A radio group bound to a single value (`radioButtonText`) arrives
with the components in 0.3.0.

**Reactive attributes:**

| Attribute | Effect | Null |
| --- | --- | --- |
| `style='…'` | `style` attribute, a string | removes `style` |
| `class='…'` | `class` attribute, a string | removes `class` |
| `visible=…` | `false` sets `style.visibility='hidden'`; the element keeps its space | the current `style` returns |
| `hidden=…` | native boolean attribute | as any native boolean |
| style shortcuts: `style_*`, `color`, `width`, `background_*`, `font_*`, `margin_*`, `padding_*`, `border_*`, …; `rounded`, `shadow`, `transform`, `filter`, `transition`, `zoom`, `gradient` | one CSS property in the composed `style`; a shortcut wins over the same property in `style='…'` | removes that property only |
| `width`/`height` on `img`, `canvas`, `embed`; `width`/`border` on `table` | native attribute, not CSS, as in legacy GenroPy | removes the attribute |
| SVG presentation attributes | SVG attribute; no style shortcuts on SVG | removes the attribute |
| `data_*`, `aria_*` | `data-*`, `aria-*` attribute | removes the attribute |
| other HTML attributes | existing attribute projection | as in 0.1.2 |

For `style` and `class`, a value other than a string or null is an error.
Excluded: `style` as a Bag or dictionary, themes and `root.css()`.

<a id="gc-095-075"></a>

## 075 · Buttons and events (0.2.0)

A `dataController` nested in a `button` is the main way to handle a click:

```python
btn = root.button("Save")
btn.dataController(func="orders.save", total="=.total")
```

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
- A button has one mechanism only. Several `dataController` children, or any
  combination of nested controller, `action` and the `fire` family, produce an
  error. Several `fire_*` attributes on the same button all fire, in attribute
  order. `fire` together with `fire_*` is one mechanism: `fire` wins and the
  `fire_*` are ignored, as in the legacy chain. The `fire_*` attributes also
  write `modifier` and `_counter` on their Data nodes.
- `connect_on<event>`, for example `connect_onclick`, attaches a native event
  listener to any element. On a button it runs after the Gramlot mechanism.

**Rule R3.** For a button with a Gramlot mechanism only:

- without a `type` written by the author, the framework sets `type="button"`; an
  author's `type` stays, and `type="button"` stays if the mechanism is removed
  later;
- the click calls `stopPropagation`, as in legacy;
- no `preventDefault`;
- a disabled button does nothing and does not count the click.

A button without a Gramlot mechanism stays native, also when a parent node holds
a `dataController`. Only the `<button>` tag gets this behavior: `input`
elements of type button, submit, reset and image stay native. The 200 ms
automatic disable, click bursts and LightButton are not part of 0.2.0.

Known effect of R3: in a form with a single text field whose only button has a
Gramlot mechanism (and so `type="button"`), Enter submits the form natively and
the mechanism does not run. A form with a native submit button keeps the native
behavior. The owner accepted R3 as built for 0.2.0 and reviews it after the
release.

Examples: `controllers/06_button_controller` (`c06`) and `07_events`
(`c07`). A `connect_on<event>` value made of dotted names (`group.method`) is
named logic; any other value is inline code. The event name is the text after
`connect_on`, lower-cased.

`Gramlot` relates Source and DOM through two methods with the legacy names.
`getBaseSourceNode(domNode)` climbs the DOM to the first rendered element and
returns its Source node, or null. `getDomNode(sourceNode)` returns the element of
the node, or null for a fragment, a data element, a removed node or a node not
yet built. Gramlot adds no properties to DOM elements or Source nodes.

<a id="gc-095-080"></a>

## 080 · Lifecycle order (0.2.0)

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

**Freeze.** Freeze suspends only structural rebuilding. A branch inserted under a
freeze runs steps 1-5 at once; its DOM and `_onBuilt` wait for the thaw; `_onStart`
waits for the first build. A thaw performs one build of the current Source,
without installing Data again and without repeating `_init` or `_onStart`.
Removing a branch closes its registrations and timers, also under freeze.
Example: `binding/08_freeze` (`b08`).

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

Example: `controllers/09_end_to_end` (`c09`) walks the lifecycle from
the first render to the close.

<a id="gc-095-085"></a>

## 085 · Exclusions and deferred work (0.2.0)

These declarations produce an explicit error in 0.2.0: `serverpath`, `dbenv`,
`shared_id`, `remote`, `dataRpc`, `dataRemote`, `subscribe_*`,
`selfsubscribe_*`, `formsubscribe_*`, `PUBLISH`, `_ask`, `ask`. The same keys
inside a user Data Bag remain ordinary data.

Outside 0.2.0, without a dedicated error: components and widgets; store, grid and
tree; form, record and newrecord; server synchronisation; the CSS system beyond
`css_requires`; rich editing; asynchronous scheduling and transactions; the
developer warning Bag. Components, including `radioButtonText`, are planned for
0.3.0. `script` in the Source stays the native HTML5 element and is not evaluated.

<a id="gc-095-090"></a>

## 090 · Differences from legacy GenroPy and migration (0.2.0)

Intentional differences:

- `dataSetter(destination_path, …)` replaces `data(path, value)`, without alias.
- R1: a null `dataSetter` value keeps an existing value but applies its
  attributes. Legacy skipped the whole write, attributes included.
- All `dataSetter` declarations of a branch are installed before its DOM. Legacy
  prepared only a node and its direct children before building it.
- `destination_path` and `result_path` do not accept `?attr`.
- R3: a Gramlot button calls `stopPropagation` but not `preventDefault`, and gets
  `type="button"` when the author wrote none. Legacy called both and set no
  type. In a one-field form Enter then submits natively (section 075).
- `css_requires` and `js_requires` need a Host with a resource system
  (gramlot-kajenn); the minimal `FileHost` raises an error for any name. When
  the same method name is registered twice in a group, the last registration
  wins.
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
- `script` in the Source is native HTML5, without `dojo.eval`.
- Legacy macros work only through the deprecated preprocessor.

Migration from legacy pages:

- replace each `data(path, value, …)` with `dataSetter(path, value, …)`;
- `Page.css` (a list of URLs) stays; a stylesheet of the page alone can move to
  the same-name file `foo.css` beside the page;
- move inline controller code to named logic in the page module's `Logic` or in
  a `js_requires` resource;
- write Data with `node.SET(...)` and the matching methods instead of macros.

Migration from 0.1.x:

- a 0.1.x page without binding runs unchanged: HTML and SVG, `Page.css`,
  `@source` methods and `remoteSource` keep their behavior;
- a call `data(...)` in a 0.1.x page created the HTML5 `<data>` element; on `root`
  it now raises an error, on other nodes `data` is the Data Bag property. Write
  `html_data(...)` for the element;
- custom hosts implement `resolve_page`/`resolvePage` and
  `resolve_resources`/`resolveResources`, pass the mount prefix to `open_page`
  and serve the page companions; the bootstrap now writes the stylesheet links
  in the browser ([GC-090](090-classes-and-hosts.md));
- the standalone integration and the ASGI integration moved from
  `gramlot-minimal` (retired) to `gramlot-serverless` and `gramlot-uvicorn`;
- the Python and JavaScript renderers of the static HTML now share the attribute
  and style rules, so `style_*`, `color` and the other shortcuts compose a
  `style` attribute in both.

Check migrated pages for remaining `data(` calls.

<a id="gc-095-095"></a>

## 095 · Sending and saving data: `gramlot.inout` (0.2.5)

`gramlot.inout` holds what a page sends, receives, saves and downloads. It is part
of the browser runtime, so Python and JavaScript pages use it alike: from inline
code (`action="gramlot.inout.sendMail('modulo', 'office@example.org')"`) or from a
`Logic` method (`this.page.inout`). Each function takes the Data path of a Bag
branch, here `modulo`.

```python
root.button("Send by email", action="gramlot.inout.sendMail('modulo', 'office@example.org')")
root.button("Save", action="gramlot.inout.save('modulo', 'registration.json')")
root.button("Reload", action="gramlot.inout.restore('modulo')")
```

| Function | Effect |
|---|---|
| `sendMail(path, email)` | Prepares an email in the mail program of the user (`mailto:`): recipient `email`, subject the page title, one line `name: Rossi` per value, `address.street: …` for a nested value. The email leaves when the user presses send. |
| `sendHttp(path, url)` | Sends the branch as a JSON object with an HTTP `POST` to `url`; resolves with the response, rejects on a status outside 200–299. |
| `save(path, name)` | Saves the branch as a TYTX file named `name`. |
| `restore(path)` | Opens the choice of a local file and loads a file written by `save` into `path`, with the exact types: dates and decimals come back as dates and decimals. |
| `download(path, name, 'json' \| 'xml')` | Exports the branch for other programs: `Bag.toJson`, or `Bag.toXml` inside one root element named after the last segment of `path`. Types become text. |

- A date is written `1990-05-02` in the email; a date with a time keeps its ISO text.
- An email longer than 2000 characters, the practical limit of a `mailto:` link,
  raises an error that names its length; use `sendHttp` or `save` instead.
- A missing path, or a value that is not a Bag, raises
  `gramlot.inout: no data Bag at '<path>'`.
- `restore` opens a file dialog, so it runs from a user action such as a button.
- JSON and XML are export formats only: `restore` reads back the files of `save`.
- Inline code needs a Content Security Policy that allows `'unsafe-eval'`
  ([GC-090 §035](090-classes-and-hosts.md)); under a strict policy call
  the functions from `Logic`.
- `sendHttp` reaches the addresses that the Content Security Policy of the page
  allows in `connect-src`.
