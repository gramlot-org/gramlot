# Writing pages

Document ID: **GC-095**. Native 0.1.2 APIs plus the planned 0.2.0 data binding.

> **Release status.** This page describes Gramlot **0.2.0 (HTML/SVG data
> binding), in development**. 0.2.0 is an approved plan: its code is not yet
> implemented, tested or released. The latest published release is **0.1.2**.
> Sections 005-035 describe 0.1.2 behavior, with explicit *0.2.0* notes where the
> plan changes it. Sections 040-090 describe planned 0.2.0 behavior only.

<a id="gc-095-005"></a>

## 005 · A first native HTML page

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

*0.2.0:* the legacy style shortcuts (`color=`, `font_size=`, `_class`) stay
excluded. Reactive styling uses `style`, `class` and `visible`
(section 070).

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

*0.2.0:* before the Source is mounted, the bootstrap loads the page's
`css_requires` and `js_requires` resources and its companion files, then
registers the named logic ([GC-090 section 030](090-classes-and-hosts.md)).
Between validation and DOM construction, each branch installs its Data
declarations (section 080).

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

This is the runtime API, not yet a declarative page button API. The Python
controller/binding declaration that will trigger it from an application is still
missing. A page example must not fill that gap with manual DOM events or fetches.

*0.2.0:* a branch received through `remoteSource` installs its own `dataSetter`
declarations before its DOM is built, like the initial Source. The 0.2.0 plan
adds button controllers (section 075); it does not define a
declarative remote Source request.

<a id="gc-095-020"></a>

## 020 · Deferred capabilities

Recipes, Data bindings, controllers, resolvers and shared components are outside
this native HTML Source-live increment. They are not available page APIs.

*0.2.0:* Data bindings, `dataSetter`, `dataFormula` and `dataController` enter
with 0.2.0 (sections 040-090). Recipes, resolvers and shared components remain
deferred; components are planned for 0.3.0. Section 085 lists
all exclusions.

<a id="gc-095-025"></a>

## 025 · Native SVG inside a page

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
| `'==expression'` | Inline JavaScript expression, compiled only by the page runtime in the browser |
| `'^.name?color'` | Pointer to the `color` attribute of the Data node at `.name` |

A path starting with `.` is relative to the `datapath` of the enclosing branch.
A change of the Source or of the context re-registers the affected pointers.

```python
panel = root.div(datapath=".customer")
panel.h2("^.name")                      # shows customer.name
panel.input(value="^.name", live=True)  # edits customer.name
```

**Variable datapath.** `datapath='^.foo'` makes the value stored at `.foo` the
datapath of the branch. When `.foo` changes, every relative path of the branch
changes and its registrations are redone. The plan lists a genro-builders change
as a prerequisite for this feature.

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
`data(path, value)` declaration. There is no alias: in Gramlot, `data` remains
the HTML5 `<data>` element.

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

Removing a `dataSetter` from the Source does not delete its Data. A rebuild or a
thaw does not install it again. A `Bag` value moves into the Data without a copy;
the Source node then no longer carries it.

<a id="gc-095-050"></a>

## 050 · Build-time defaults and data defaults (0.2.0)

A declaration can give a default to its own pointers:

- `default` and `default_value` give the default of the `value` pointer;
  `default_value` prevails over `default`;
- `default_<attr>` gives the default of the pointer in attribute `<attr>`;
- `attr_*` attributes belong to the same legacy default syntax.

Defaults are applied after all `dataSetter` declarations of the branch, and only
on empty paths. Null and a missing path count as empty. `false`, `0` and the
empty string are values. A default never overrides a `dataSetter`, even one
declared later. `attr_*` is evaluated on the state before the control's own
default.

```python
root.input(type="number", value="^.font_size", default_value=14)
```

These are **build-time defaults**: parameters of the page structure, such as a
font size or a colour. They are not the defaults of application records. Most
page Data arrives after construction, in a cycle of loading (for example from a
remote call), editing, saving and loading again. When a user inserts a new
record, a "newrecord" is loaded, and the record defaults belong to it. Forms,
records and newrecord are outside 0.2.0, so 0.2.0 offers only build-time defaults.
Do not use build-time defaults to model record defaults.

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
as inline code.

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
// companion file of the page, with the page's name
export class Logic {
    add(kwargs) { return kwargs.a + kwargs.b; }
    reset(node, kwargs) { this.page.logic.business.discount(kwargs); }
}
```

- The companion's methods live in `page.logic`. Each name in `js_requires`
  becomes a group: `page.logic.business`. A name with `/` becomes a nested group.
- `func='business.discount'` calls a group method; `func='add'` calls a
  companion method.
- A formula method is called as `method(kwargs)` and returns the value. A
  controller method is called as `method(node, kwargs)`.
- `kwargs` contains the resolved author attributes, plus `_node`, `_triggerpars`,
  `_reason` and, for a button, `_evt` and the `button_*` arguments. Control
  attributes (`destination_path`, `func`, `formula`, `script`, `_if`, `_else`,
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
lookup and file layout.

<a id="gc-095-065"></a>

## 065 · Writing Data from code and inline code (0.2.0)

Code writes Data through the methods of the Builder Source node. Gramlot adds no
separate set of operations.

| Method | Effect |
| --- | --- |
| `node.GET(path)` / `getRelativeData` | Reads a value |
| `node.SET(path, value)` / `setRelativeData` | Writes and triggers reactions |
| `node.PUT(path, value)` | Writes without triggering reactions |
| `node.FIRE(path, value)` | Triggers even with an equal value, then resets the path to null silently |
| `node.FIRE_AFTER(path, value=true, delay=10)` | Fires after `delay` ms; 10 ms is the legacy default |

The plan lists genro-builders and genro-bag changes as prerequisites for the
silent `PUT`, for the `FIRE` information in change events and for `FIRE_AFTER`.

**Inline code** is allowed but discouraged, and may be deprecated. `formula` and
`script` strings are compiled only in the page runtime in the browser, with
`this` bound to the Source node:

```python
root.dataController("this.SET('.count', 0)", _fired="^.reset")
```

No host compiles code: not the Python Host, the JavaScript Host, the WorkerHost
nor the DevTools panel. A page with inline code needs `'unsafe-eval'` when its
host sets a Content Security Policy.

**Legacy macros** (`GET .a`, `SET .a = v`, `PUT`, `FIRE`, `FIRE_AFTER`, `$1`)
are accepted only by a deprecated compatibility preprocessor for inline code. It
uses the legacy regular expressions and translates to `this.GET(...)`,
`this.SET(...)` and the matching methods; `$1` becomes `arguments[0]`. Like the
legacy, it also translates a macro inside a string or a comment. A
`console.warn` appears once per declaration and shows the new form. Code already
written as `this.SET(...)` passes unchanged and without warning.

<a id="gc-095-070"></a>

## 070 · Native controls and reactive attributes (0.2.0)

`value='^path'` binds a native control to a Data path in both directions: text
and textarea, number, range, select (single and multiple), date, time, month,
week, datetime-local and color. The conversion between control values and Data
types is still to be confirmed.

- `live=False` is the default: the Data is written on `change`. `live=True`
  writes on every `input`.
- A correction written by a controller is shown on the control that produced the
  edit. Other attributes bound to the same path update while the user types.

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
| SVG presentation attributes | SVG attribute | removes the attribute |
| other native attributes | existing native projection | as in 0.1.2 |

For `style` and `class`, a value other than a string or null is an error.
Excluded: `style` as a Bag or dictionary, the legacy shortcuts, themes and
`root.css()`.

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
- `action`, `fire` and `fire_*` are alternatives to the nested controller.
- A button has one mechanism only. Several `dataController` children, or two
  mechanisms together, produce an error. Several `fire_*` attributes on the same
  button all fire, in attribute order.
- `connect_on<event>`, for example `connect_onclick`, attaches a native event
  listener to any element. On a button it runs after the Gramlot mechanism.

**Provisional rule (R3)**, to be confirmed by tests. For a button with a Gramlot
mechanism only:

- without a `type` written by the author, the framework sets `type="button"`; an
  author's `type` stays;
- the click calls `stopPropagation`, as in legacy;
- no `preventDefault`.

A button without a Gramlot mechanism stays native. The 200 ms automatic disable,
click bursts and LightButton are not part of 0.2.0.

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
- R3 (provisional): a Gramlot button calls `stopPropagation` but not
  `preventDefault`. Legacy called both.
- `js_requires` loads every level found and the most specific registration wins.
  Legacy loaded only the most generic JavaScript file.
- `name:media` in `css_requires` is an error.
- No `sourceNode.domNode` or `element.sourceNode` properties: use
  `getBaseSourceNode` and `getDomNode`.
- `script` in the Source is native HTML5, without `dojo.eval`.
- Legacy macros work only through the deprecated preprocessor.

Migration from legacy pages and from 0.1.x:

- replace each `data(path, value, …)` with `dataSetter(path, value, …)`;
- in Python and JavaScript pages, replace `Page.css` (a list of URLs) with
  `css_requires` (a comma-separated string of resource names);
- move inline controller code to named logic in the companion or in a
  `js_requires` resource;
- write Data with `node.SET(...)` and the matching methods instead of macros.

The plan decides during implementation whether a legacy `data(path, value)` call
produces an error or creates an HTML5 `<data>` element. Check migrated pages for
remaining `data(` calls.
