# Data binding and controllers

Document ID: **GC-097**.

<!-- The sections moved here from Writing pages keep their block IDs and anchors. -->

Data and its connection to the Source: pointers, initial values, formulas, controllers, named logic,
bound controls, buttons, lifecycle. Page structure: [Writing pages](095-writing-pages.md); server
calls: [Calling the server](098-server-calls.md), [Remote content and lazy Data](099-remote-content.md).
Gallery families Binding and Controllers of [gramlot-examples](https://gramlot-examples.readthedocs.io/en/latest/).

<a id="gc-095-040"></a>

## 040 · Data and pointers

One Data Bag per page instance: `app.data === app.src.builder.data`. Author paths never
contain the internal `_root_` wrapper. A user field called `main` is ordinary Data. One Gramlot subscription routes changes by path.
Pointers in attributes or node values: `^path` reads and reacts; `=path` reads at
call time without triggering; `==expr` is an inline JS expression compiled only in
the page runtime and evaluated at each projection; `^path?attr` points to a Data node attribute. `.path` is relative
to the branch `datapath`; Source or context changes register pointers again.
Symbolic origins (Builder): `#FORM` (first ancestor with
`formId`/`form=True`), `#ANCHOR` (first ancestor with `_anchor`), `#<node_id>`;
e.g. `value='^#FORM.customer.name'`. `#WORKSPACE`, `#ROW`, `#DATA` and aliases are
not available. `#parent` is a Data-path cancellation segment: in `contexts.child`,
`^.#parent.name` resolves to `contexts.name`; bare `^#parent.name` is not a symbolic
node origin. Example: `panel = root.div(datapath=".customer")`; `panel.h2("^.name")`;
`panel.input(value="^.name", live=True)`. Gallery lessons: *Pointers* (with `#ANCHOR`
and parent paths), *Variable datapath*.

Variable datapath: `datapath='^.foo'` uses the value at `.foo` as the branch
datapath and re-registers when it changes; empty value = null path. Implemented by
`absDatapath` of Gramlot's `GramlotBuilderBagNode`, which also keeps `?attr` on
symbolic paths; Builder and Bag unchanged.
Attributes ending in `_path` hold a bare path; a written `^`/`=` is removed with one
`console.warn` per declaration. `foopath` is ordinary; `datapath` has its own rule.

<a id="gc-095-045"></a>

## 045 · Initial values: `dataSetter`

`dataSetter(destination_path, value=None, **attr)` replaces legacy `data(path, value)`,
without alias; `root.data(...)` raises an error naming `dataSetter` and `html_data`; on
other Source nodes `data` is the genro-builders Data Bag property (no declaration, no such
error). The HTML5 element is `html_data(...)` (Python and JS):
`root.html_data("one", value="1")` → `<data value="1">`. In JS the parameters go in one
object (`root.dataSetter({destination_path: '.a', value: 1})`, same for `dataFormula`,
`dataController`); JS has no positional form for these parameters.
`destination_path` is
relative or absolute; `?` is a validation error. `value` is optional; other keywords
become Data node attributes. A `dict`/plain object becomes a `Bag` with default recursive population:
nested dictionaries and lists, including dictionaries inside lists, become Bags.
Sequence order and scalar leaf values are preserved; empty nested containers
become empty Bags. A list passed directly as `value` remains a literal list;
a JSON string passed directly remains a string and is not implicitly parsed.

Typed values keep their TYTX type from Source to Data. Python → JavaScript: Decimal `N`
`Decimal("12.75")` → `createDecimal('12.75')`; date `D` `date(2026, 10, 17)` →
`new Date(Date.UTC(2026, 9, 17))`; time `H` `time(9, 30)` → `new Date('1970-01-01T09:30:00Z')`;
date and time `DHZ` `datetime(..., tzinfo=timezone.utc)` → `new Date(Date.UTC(2026, 9, 17, 9, 30))`;
`Bag()` (`genro_bag`) → `new Bag()`. A `Date` is typed by content: midnight UTC is a date, a time on
1970-01-01 is a time, else date and time. A JS page imports `Bag` and `createDecimal` from
`@gramlot/gramlot/page`: the server runs `main` of the module and the browser imports it for its `Logic`;
the import map resolves only that name there and the runtime exports the same names as the server
entry point, so the module loads in both ([Classes and hosts](090-classes-and-hosts.md#gc-090-024)).

All `dataSetter` of a branch (initial Source or inserted branch) install before its
DOM, in document order including ones nested after visual siblings; earlier
elements see final values at first render. Same path: later wins; no duplicate
warning. R1, installation only: non-null writes; null on an existing path keeps the
value and applies attributes; null on a missing path creates null plus attributes.
`dataSetter('x', 7)` then `dataSetter('x', None)` leaves 7. Runtime writes are not
affected. `value` and attributes are stored as written (`'^y'`, `'==a+b'`, `'a${b}'`
stay strings; computed values use `dataFormula`). Removing the declaration keeps Data;
rebuild/thaw do not reinstall. A Bag value moves into Data without copy and leaves the
Source node. Gallery lesson: *Setters and defaults*.

<a id="gc-095-050"></a>

## 050 · Build-time defaults and data defaults

`default`/`default_value` (for `value`; `default_value` prevails), `default_<attr>`
(pointer in `<attr>`) apply after all `dataSetter`, only on empty paths. Empty =
null or missing; `false`, `0`, `''` are values. A default never overrides any
`dataSetter`. Example: `input(type="number", value="^.font_size", default_value=14)`.
`attr_<name>=v` (legacy rule; `v` may be a pointer) sets `<name>` on the Data node
of the control's `value` (or `src`), only if that node exists, without emptiness
check, after the node's own defaults: `input(value="^.price", attr_dtype="N")` puts
`dtype='N'` on `.price`.

These are build-time defaults for structure parameters (font size, colour). Record
data arrives after construction through load/edit/save/reload; a new record loads a
"newrecord" that owns record defaults. Forms, records and newrecord are not
provided; do not model record defaults with build-time defaults. Gallery: *Setters and defaults*.

<a id="gc-095-055"></a>

## 055 · Formulas and controllers

`dataFormula(result_path, formula=None, func=None, **params)` writes its result at
`result_path` (no `?attr`). `dataController(script=None, func=None, **params)` writes
Data itself. `func` = named logic (recommended, 060); `formula`/`script`
= inline (065); both together = error. `^` keywords trigger, `=` only
read. Legacy `dataFormula('.total', 'a + b', a='^.a', b='^.b')` still works inline.
Gallery lessons: *Formula*, *Controller*.

Controls: `_if`/`_else` (false → `_else` if present, then stop); `_init` once before
DOM; `_onBuilt` after first successful build; `_onStart` at readiness (number = ms
delay, `true`/`0` = none, negative/non-finite = error; the three lifecycle attributes
accept only true, false, null or a number); `_delay` ms debounce, last
wins; `_timing` interval in seconds; `_userChanges` runs only when the changed path
is the registered path (containing and child paths skipped). `_userChanges`
separates edits from structure loading, not user from program. Removal stops timers.

<a id="gc-095-060"></a>

## 060 · Named logic

Primary path. A logic file with logic methods exports `class Logic`; its methods are
copied into a per-instance group; a module without `Logic` has none. Companion methods live in `page.logic`; each `js_requires` name
is a group (`page.logic.business`); `/` makes nested groups. Source:
`func='business.discount'` or `func='add'` (page logic). Formula: `method(kwargs)`
returns the value; controller: `method(node, kwargs)`. `kwargs` = resolved author
attributes plus `_node`, `_triggerpars`, `_reason` and, for buttons, `_evt` and
`button_*`; control attributes (`destination_path`, `result_path`, `func`, `formula`, `script`,
`_if`, `_else`, `_init`, `_onStart`, `_onBuilt`, `_delay`, `_timing`,
`_userChanges`) are excluded. `this` = group, `this.page` = page instance. Page logic
= the page module's `Logic` export: `orders.js` (JS page), `orders.js` beside `orders.py`
(Python page; its `Page` unused); `orders_aux.js` also accepted; both = error. The
browser imports the page module, so its imports must resolve there: a `Page` with
server-only imports keeps `orders_aux.js`. A page module without `Logic`, also beside
a Python page, gives no methods: write `Logic` only when needed; a misspelt export
(`logic`) shows when a `func` looks for its method. The same
resource at several levels fills one group from generic to specific; specific wins.
Errors: explicit `Logic` constructor; method named `page` or like a child group;
missing name (never an inline fallback). State lives on group or page. Works
without `'unsafe-eval'`. Lookup/layout: [GC-090 030](090-classes-and-hosts.md#gc-090-030). With
`GramlotFileServer` (current adapters, gallery) only the page logic exists, as the root group (`func='add'`); a dotted
name (`business.discount`) needs a `js_requires` group (a `GramlotServer` with a resource system, genro-kajenn).
The same method name registered twice in a group: the last registration wins; the
page logic registers after `js_requires`. Gallery lesson: *Named logic*.

<a id="gc-095-065"></a>

## 065 · Writing Data from code and inline code

Source node methods, no Gramlot operation set: `GET`/`getRelativeData`
read; `SET`/`setRelativeData` write and trigger; `PUT` writes silently; `FIRE(path, value=true)`
triggers even with an equal value then resets to null silently;
`FIRE_AFTER(path, value=true, delay=10)` fires after `delay` ms (legacy default 10).
Browser Source nodes are `GramlotBuilderBagNode` in `GramlotBuilderBag` (extending
Builder `SourceBagNode`/`SourceBag`). `GET`/`SET`/`get|setRelativeData` are Builder's;
Gramlot provides silent `PUT`, `FIRE` marking its write for the router, `FIRE_AFTER`
(timer tied to the node) and `absDatapath`. Builder and Bag are not modified.

Inline code is allowed, discouraged, possibly deprecated: compiled only in the
browser page runtime with `this` = Source node, e.g.
`dataController("this.SET('.count', 0)", _fired="^.reset")`. No compilation in
Python `GramlotServer`, JS `GramlotServer`, `GramlotWorkerServer` or DevTools panel. Inline pages need `'unsafe-eval'`
under a server CSP; without it the browser refuses compilation and Gramlot raises an
`EvalError` naming node and attribute and pointing to named logic or the permissive
profile ([GC-090 035](090-classes-and-hosts.md#gc-090-035)); covers `formula`, `script`,
`_if`/`_else`, `==`, `action`, `connect_on<event>`. Gallery lessons: *Inline expressions*, *Node methods*. The `@gramlot/gramlot-serverless` file allows
`'unsafe-eval'`: inline runs there too. Inline code runs only as written in the
received Source (`main`, a remote Source, a `GramlotBuilderBag` given to `startSource`),
as literal strings. Errors naming node and attribute ([GC-090 035](090-classes-and-hosts.md#gc-090-035)):
a code attribute changed after the start or a node with inline code inserted in the live
Source (not run; use named logic); a code attribute holding a pointer
(`formula='^.code'`), refused at reception (data reaches inline code as parameters,
never as text); an attribute of the form `onclick` (write `connect_onclick`); a
`javascript:` URL in `href`, `src`, `formaction`, `xlink:href`, written or from Data.
An `iframe` `srcdoc` from Data (pointer, `==`, explicit pointer template, or a
pointer node value whose datum carries `srcdoc` in `_wdg`) gets `sandbox=""`: HTML shown,
nothing runs. Literal `srcdoc`: no `sandbox`. A `sandbox` written in the Source is kept
(`sandbox='allow-scripts'` runs scripts) and turns the rule off ([GC-090 035](090-classes-and-hosts.md#gc-090-035)).
Legacy macros (`GET`, `SET`, `PUT`, `FIRE`, `FIRE_AFTER`, `$1`)
only via a deprecated preprocessor with legacy regexes → `this.GET(...)` etc.,
`$1` → `arguments[0]`; macros in strings/comments are translated as in legacy; one
`console.warn` per declaration. `this.SET(...)` passes unchanged, no warning. The `PUBLISH`
macro is an error: use `gramlot.publish` ([Writing pages](095-writing-pages.md#gc-095-115)).

<a id="gc-095-070"></a>

## 070 · Bound controls and reactive attributes

`value='^path'` binds HTML form controls both ways. Data representation: text/textarea
(and password, email, url, tel, search) string or null (shown empty; empty string kept;
Data change during IME composition shown at its end); number finite number or null
(empty → null; invalid draft stays in the DOM, writes nothing, never `NaN`); range
finite number or null (browser clamp writes nothing); single select string or null
(missing option: nothing selected, Data unchanged); multiple select array of strings
(`[]` included) or null (nothing selected; any other value = error); date/time/month/week/datetime-local lexical
string of the browser control or null (no `Date`, no time zone); color string as serialized by the browser
(normalization writes nothing). `hidden` and `file` inputs have no adapter; button
inputs keep the browser behavior; an unknown type is text. A literal or `=` value sets the control and
never writes; a literal `value` (neither `^` nor `=`) is also the control default
(`defaultValue` of an input, text of a textarea), so a form Reset restores it; a
`^` value sets the property only; select, checkbox and radio keep the default of their
authored `selected`/`checked`. `live=False` (default) writes on `change`; `live=True` on `input` for
text, textarea, number, range; select, color and temporal types always write on
`change`. A controller correction returns to the originating control; other attributes
on the same path update while typing. Changing `type`, `multiple` or `group` rebuilds
the element and keeps its binding. Gallery lessons: *Native editing*, *Checkbox and radio*,
*Style and visibility*, *Bound SVG*; input components ([Components](105-components.md)) use the same binding.
Checkbox `input(type='checkbox', value='^.flag')`: Data only `true`/`false`, never
`'on'`. Radio `input(type='radio', group='size', value='^.small')`: one boolean per
button; choosing one sets it `true`, the others `false`; `group` yields an
instance-scoped DOM `name`; several initial `true` = error. A radio group bound to one value is the
component `radioButtonText` ([Components](105-components.md#gc-105-005)).

Reactive attributes: `style`/`class` strings (null removes; other types error);
`visible=false` → `style.visibility='hidden'`, keeps space, null restores current
`style`; `hidden` HTML boolean; style shortcuts compose `style`, win over the same
property in `style`, null removes that property; `width`/`height` on img/canvas/embed
and `width`/`border` on table stay attributes (legacy); SVG presentation attributes,
no style shortcuts on SVG (null removes); `data_*`/`aria_*` → `data-*`/`aria-*`; other
other HTML attributes: written as is, null removes. `style`/`class` other than string or null = error in the
Python and JS static renderers and the live renderer, before composition, also for resolved pointers and live
`==` results (static renderers leave `==` to the browser); a rejected live value leaves the displayed
attribute and the Data/Source write as they are; same check on SVG and literal `html_style`/`html_class`;
a shortcut value is not checked for a unit (`width=10` gives `width: 10`, ignored by the browser; write
`width="10px"`; rule and `rounded` exception in [GC-096 040](096-themes-and-css.md#gc-096-040)). Not supported: style as Bag/dict, `root.css()`; themes:
[Themes and CSS](096-themes-and-css.md).

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
inside scripts or `==` expressions retain normal JavaScript semantics. Full rules: section 130.

`mask` formats node text using `{}` and never enables raw HTML. Live `format` uses
`gramlot.format` before applying the mask ([formatting](095-writing-pages.md#gc-095-125)). The
old `%s` placeholder is not interpreted. Widget `value` keeps an ordinary pointer without a suffix.

<a id="gc-095-075"></a>

## 075 · Buttons and events

Main click path: a `dataController` nested in `button`, e.g.
`root.button("Save").dataController(func="orders.save", total="=.total")`. `button` renders the
component `gramlot-button` with an internal HTML button ([Components](105-components.md#gc-105-095));
`toggleButton`, `dropDownButton`, `menuline` share the command engine; `html_button` renders an HTML
`<button>` (below). The nested controller is an
ordinary controller (also `^`, `_init`, `_onStart`, `_timing`); the click is one more
trigger. It receives `_evt`, `button_counter`, `button_shift`, `button_ctrl`,
`button_alt`, `button_meta`; the counter lives as long as the Source node, across
rebuilds. Alternatives: `action='…'` = inline code on click, `this` = button node,
receives current button attributes plus `event`, `_counter`, `modifiers` (inline
rules apply); `fire='.path'` = `FIRE` with the modifier string (`'Shift'`,
`'CtrlAlt'`, …) or `true`, Data node gets `modifier` and `_counter`;
`fire_<name>='.path'` = `FIRE` with value `'<name>'`. A nested `dataRpc` is also a click mechanism
([Calling the server](098-server-calls.md#gc-095-100)). One mechanism per button:
several `dataController` or `dataRpc` children or any combination of nested controller, `action`
and the `fire` family = error; several `fire_*` all fire in attribute order; `fire`
with `fire_*` is one mechanism (`fire` wins, `fire_*` ignored, as legacy); `fire_*`
also write `modifier` and `_counter`. `connect_on<event>` attaches DOM listeners on
any element; on a button it runs after the Gramlot mechanism; a value of dotted names
(`group.method`) is named logic, any other value inline; event name = text after
`connect_on`, lower-cased.

R3, for a `button` with a Gramlot mechanism: `type="button"` if the author
wrote no `type` (an authored `type` stays; `type="button"` stays if the mechanism is
removed); `stopPropagation`; no `preventDefault`; a disabled button does nothing and
does not count. A `button` without a mechanism runs nothing and lets the click propagate
(a parent `dataController` is not its mechanism); a `button` never submits or resets a form;
`input` button types and `html_button` keep the browser behavior. No legacy 200 ms disable or
LightButton. Known effect: in a form with one text field and no HTML submit button, Enter
submits the form through the browser and the `button` mechanism does not run. Gallery
lessons: *Button controller*, *Events*.
`gramlot.dom.getBaseSourceNode(domNode)` → Source node of the first rendered ancestor
or null; `getDomNode(sourceNode)` → element or null (fragment, data element, removed
or unbuilt node). No properties are added to DOM elements or Source nodes.


### Plain HTML buttons and delayed clicks

`html_button` is a distinct Source element that renders an HTML `<button>`: browser
submit/reset and bubbling, no implicit `type`; its click runs no Gramlot action/ask/fire/nested controller.
Use `type="button"` when it should not submit a form; events use `connect_onclick`.
Declare `action`, `ask`, `fire` and `_delay` on `button`, not `html_button`.

```python
form.html_button("Reset", type="reset")
pane.button("Run", _delay=300).dataController(func="run")
```

With a positive button `_delay` (milliseconds), each click restarts the wait.
One execution follows the last click, using its event/modifiers and the number
of clicks in that group: `_counter` for action/fire, `button_counter` for the
nested controller/RPC. The next group starts again at 1. Arguments are read
when the mechanism runs. With no delay or zero, each click runs at once and the
counter lasts as long as the node. An ancestor may supply `_delay`; a button's zero overrides it.
The delay runs before ask and before the selected click mechanism. A provider's
own `_delay` remains separate for Data/message triggers. Explicit event listeners
still run at each click, without waiting. Removal, page
disposal or DOM detachment cancels pending work; a disabled button cannot deliver
it. R3 and the one-mechanism rule stay the same. Gallery lesson: *Plain and delayed buttons*.

<a id="gc-095-080"></a>

## 080 · Lifecycle order

Unfrozen branch: 1 validation without effects; 2 `dataSetter` in document order;
3 defaults; 4 registration of pointers/formulas/controllers; 5 `_init` once per
node; 6 DOM with current values; 7 `_onBuilt` after first successful build;
8 `_onStart` after page readiness (initial Source) or right after 7 (later branch).
Applies to initial Source, `remoteSource` and every inserted branch. Active
observers see `dataSetter` writes synchronously; the new branch's providers wait for
steps 2-3. On error new registrations close; no Data rollback.
Each build runs to completion; Source changes during it queue in arrival order;
changes to a node being built are ignored. Freeze ([Writing pages](095-writing-pages.md#gc-095-030))
suspends only structural rebuilding; built elements still react to Data; an inserted branch runs 1-5 at once;
DOM and `_onBuilt` at thaw; `_onStart` waits for the first build. Thaw builds once,
no reinstallation, no repeated `_init`/`_onStart`. Removal closes registrations and
timers, also under freeze. Gallery lesson: *Freeze*.

Cleanup: removing a Source node closes its providers, timers, registrations, listeners
and pending requests and the renderer removes its DOM; closing the page disposes the
`Gramlot` instance for the whole page. Handlers of a node removed under freeze do
nothing. A callback that removes its own node runs to its end (a later `SET` writes);
only the Gramlot handlers stop (`fire_*` loop, radio peer loop, listeners). A failing
disposer does not stop the others: removal completes, then the closing errors are
thrown (one as is, several as `AggregateError`). A failed first render removes the
records its children created (listeners, controls, radio groups, references); no Data
rollback. Gallery lessons: *End-to-end story*, *Lifecycle*.

<a id="gc-095-085"></a>

## 085 · Excluded declarations

Explicit error: the attributes `serverpath`, `dbenv`, `shared_id` and every name starting with
`formsubscribe_`; the `PUBLISH` macro in inline code (same keys inside user Data stay data).
Not provided, without a dedicated error: store, grid, tree; form, record, newrecord; server
synchronisation of Data; rich text editing; async scheduling and transactions; developer
warning Bag. Source `script` is the HTML5 element, not evaluated.

<a id="gc-095-090"></a>

## 090 · Differences from legacy GenroPy and migration

Intentional differences: `dataSetter` replaces `data`, no alias; R1 applies
attributes on null (legacy skipped the whole write); all branch `dataSetter` before
DOM (legacy: node and direct children); no `?attr` in `destination_path`/`result_path`;
R3: `stopPropagation` without `preventDefault` plus `type="button"` (legacy: both calls, no type; section 075);
`css_requires`/`js_requires` need a `GramlotServer` with a resource system (genro-kajenn, part of Genro, the GenroPy successor built on Kajenn, Gramlot and Asqueel), `GramlotFileServer` and current adapters error on any name, last registration of a method name wins; `name:media`
error; `data(...)` is no declaration (`root.data` raises, on other nodes `data` is the Data Bag property), `html_data(...)` is the HTML5 element; controller/`action`/`fire` combinations are errors (legacy chained them and
also ran the nested controller); no `#WORKSPACE`/`#ROW`/`#DATA`; methods instead of `domNode`/`sourceNode` properties; Source `script` is the HTML5
element, without `dojo.eval`; macros only via the deprecated preprocessor.
Migration from legacy pages: `data(...)` → `dataSetter(...)`; `Page.css` URL list
stays, a page-only stylesheet can move to same-name `foo.css`; inline controllers →
named logic; macros → `node.SET(...)` etc.
Check migrated pages for `data(` calls.

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
