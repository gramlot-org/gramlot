# Writing pages

Document ID: **GC-095**.

> **Scope.** This is the maintained authoring guide. The repository README states
> the current release. Dated release notes below describe when behavior entered;
> they are not a list of current exclusions. Development-only differences are marked.

Start with [the learning route](025-try.md) and an editable page from
your adapter's setup guide. The sections retain their release progression: 0.1.x structure (005–035),
0.2.0 Data and local behavior (040–090), with the 0.2.5 page module in 060;
0.2.5 data exchange (095, its public path since 0.2.10), 0.2.14 endpoint calls
(100), and 0.2.16 remote Source and lazy Data (105). Later additions within an
earlier section are marked. The same example may return at a later stage to
show which new declaration replaces earlier code; topic links are a secondary index.

**Execution model.** Page/main and exposed methods run on the server (or the JS
Worker). Logic runs in the browser. Source describes what to build; Data holds
the values; bindings connect them to the rendered DOM. Each server call creates
a fresh Page, so its fields are not persistent application state.

**Examples and limits.** gramlot-examples has HTML/SVG e01–e13, binding b01–b11 and
controllers c01–c17, in Python and JavaScript. c09–c11 cover dataRpc, c12–c13 remote
Source and c14 dataRemote. In chronological menu order, c15 (0.2.0 lifecycle),
c16 (0.2.0 projection, then 0.2.3 sandbox) and c17 (0.2.5 local Data exchange)
precede the endpoint lessons. b01 adds anchor/parent paths, c02 path filtering,
and c11 a separately labelled 0.2.15 Source-auth step. c08 retains the local
0.2.0 story and adds a distinct 0.2.14 quote/result/error exercise after c09/c11;
editing the form alone never requests that quote. A successful basic trial
is not exhaustive qualification. c17's nested-Date initialization extension is
blocked by a detected JavaScript object-to-Bag conversion defect; it does not
demonstrate dates/decimals. Mail/HTTP require environment-owned checks. Named connect_on handlers and js_requires groups need a resource host;
the common FileServer gallery cannot demonstrate that environment. Authentication
allow/deny belongs to an identity-aware adapter; c11 shows default refusal.

The examples use maintained APIs, not frozen installations of those releases.
Earlier/later code comparisons must be labelled; completeness of such teaching
comparisons remains work in progress.

Use [the catalogue and explanations](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/README.md)
to choose a lesson; the current walkthrough improvements are still in progress.

<a id="gc-095-005"></a>

## 005 · A first HTML page

Server-supplied authoring example, not a standalone server command:

```python
from gramlot import Page as BasePage

class Page(BasePage):
    title = "People"
    def main(self, root):
        root.div("People", id="people").p("Choose a person")
```

Python calls return real SourceBagNode objects; JS uses the generic builder handles. Text is literal, not parsed HTML.
Native attributes work; `class_` escapes the keyword. Use the exported HTML5 collection; its open signatures accept native attributes.
CSS style shortcuts are described in section 070.
*0.2.0:* legacy style shortcuts (`color=`, `font_size=`, `margin_top=`, `style_*`,
`rounded=`) compose one `style` with `style='…'`, as static Builder `HtmlRenderer`;
`_class` is `class`; all react to Data (070).

<a id="gc-095-010"></a>

## 010 · From a page to the browser

The server returns bootstrap; `Gramlot` prepares/subscribes Data and Source; server runs
`main(root)` and sends typed SourceBag/TYTX; generic builder associates it; Gramlot
validates incoming Source before insertion; one insertion under Source `main`
triggers rendering. Later mutations use the same subscription. Native attribute
updates may retain elements; structural changes rebuild the subtree and clean up.
*0.2.0:* the bootstrap document holds a script that creates `PageBootstrap` with the
page resources; in the browser it writes the CSS links (`Page.css` URLs, then the
same-name `foo.css`), imports the JS modules, creates `Gramlot`, registers named logic
and starts the page ([GC-090 030](090-classes-and-hosts.md));
each branch installs Data declarations between validation and DOM (080).

Choose **Base** for the original spacing, or **Compact** for smaller headings,
gaps, card padding and form controls. Both support light and dark mode. Compact
uses Base followed by its size overrides, through the existing resource list:

```python
class Page(BasePage):
    css = (
        "/themes/gramlot-base/theme.css",
        "/themes/gramlot-compact/theme.css",
    )
```

In JavaScript, use the same ordered URLs in `static css = [...]`. Put the list on
a shared application Page base class to avoid repeating it in every page. Native
elements and classes in `main` stay the same. Load only Base for its original
appearance. Application CSS can override theme rules. Color mode remains separate:
`data-theme="light"` or `data-theme="dark"` on the document root, or the system
preference when absent. These are CSS themes; no `Page.theme` or `root.css()` API
is introduced.

<a id="gc-095-015"></a>

## 015 · Remote Source

The declarative `remote` and lazy Data lesson belongs to the later **0.2.16**
stage (§105); this early section is a reference pointer, not a 0.1.x capability claim.

`@source` / `registerSource(...)` declare Source fragments and `@endpoint` / `registerEndpoint(...)` declare endpoints (GC-230 §035; §100 below). The `remote` attribute mounts a fragment declaratively as the content of an element (§105); from code a fragment is requested with `gramlot.src.remoteSource(target, method, params)`.

<a id="gc-095-020"></a>

## 020 · Capabilities outside this guide

Data bindings, formulas/controllers, endpoint calls, remote Source and
`dataRemote` are available in the sections linked above. Recipes, shared widgets,
record/form management and database services remain separate future capabilities;
do not infer them from a native HTML form or an endpoint-backed resolver.
Section 085 lists rejected declarations and deferred work.

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
*0.2.0:* SVG presentation attributes accept `^`; null removes them (070).

Next: [Extending Gramlot](100-extensions.md).


<a id="gc-095-030"></a>

## 030 · Freeze a rendered branch

The runtime offers `app.src.renderer.freeze(node)` and `app.src.renderer.unfreeze(node)`
for a mounted SourceNode. Freeze is an idempotent flag, not a counter. Source
changes normally; the branch's existing DOM remains visible and its rendering
events are discarded. Other branches continue updating synchronously in FIFO order.

```javascript
const root = app.src.builder.wrapSource(app.src.source.getItem('main'));
const panel = root.section();
panel.span('Old content');
app.src.renderer.freeze(panel);
panel.value.clear();
app.src.builder.wrapSource(panel).span('Final content');
app.src.renderer.unfreeze(panel);
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
*0.2.0:* freeze suspends only structural rebuilding; built elements still react to
Data. A branch inserted under freeze installs Data at once; DOM and `_onBuilt`
wait for thaw (080).


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

One Data Bag per page instance: `app.data === app.src.builder.data`. Author paths never
contain the internal `_root_` wrapper. A user field called `main` is ordinary Data. One Gramlot subscription routes changes by path.
Pointers in attributes or node values: `^path` reads and reacts; `=path` reads at
call time without triggering; `==expr` is an inline JS expression compiled only in
the page runtime and evaluated at each projection; `^path?attr` points to a Data node attribute. `.path` is relative
to the branch `datapath`; Source or context changes re-register pointers.
Symbolic origins (Builder): `#FORM` (first ancestor with
`formId`/`form=True`), `#ANCHOR` (first ancestor with `_anchor`), `#<node_id>`;
e.g. `value='^#FORM.customer.name'`. `#WORKSPACE`, `#ROW`, `#DATA` and aliases are
outside 0.2.0. `#parent` is a Data-path cancellation segment: in `contexts.child`,
`^.#parent.name` resolves to `contexts.name`; bare `^#parent.name` is not a symbolic
node origin. b01 demonstrates this alongside #ANCHOR.
Example: `panel = root.div(datapath=".customer")`; `panel.h2("^.name")`;
`panel.input(value="^.name", live=True)`. Examples: `binding/01_pointers`
(`b01`), `02_variable_datapath` (`b02`).

Variable datapath: `datapath='^.foo'` uses the value at `.foo` as the branch
datapath and re-registers when it changes; empty value = null path. Implemented by
`absDatapath` of Gramlot's `GramlotBuilderBagNode`, which also keeps `?attr` on
symbolic paths; Builder and Bag unchanged.
Attributes ending in `_path` hold a bare path; a written `^`/`=` is removed with one
`console.warn` per declaration. `foopath` is ordinary; `datapath` has its own rule.

<a id="gc-095-045"></a>

## 045 · Initial values: `dataSetter` (0.2.0)

`dataSetter(destination_path, value=None, **attr)` replaces legacy `data(path, value)`,
without alias; `root.data(...)` raises an error naming `dataSetter` and `html_data`; on
other Source nodes `data` is the genro-builders Data Bag property (no declaration, no such
error). The HTML5 element is `html_data(...)` (Python and JS):
`root.html_data("one", value="1")` → `<data value="1">`. In JS the parameters go in one
object (`root.dataSetter({destination_path: '.a', value: 1})`, same for `dataFormula`,
`dataController`); JS positional arguments of data elements are not available yet.
`destination_path` is
relative or absolute; `?` is a validation error. `value` is optional; other keywords
become Data node attributes. A `dict`/plain object becomes a `Bag` with default recursive population:
nested dictionaries and lists, including dictionaries inside lists, become Bags.
Sequence order and scalar leaf values are preserved; empty nested containers
become empty Bags. A list passed directly as `value` remains a literal list;
a JSON string passed directly remains a string and is not implicitly parsed.

All `dataSetter` of a branch (initial Source or inserted branch) install before its
DOM, in document order including ones nested after visual siblings; earlier
elements see final values at first render. Same path: later wins; no duplicate
warning. R1, installation only: non-null writes; null on an existing path keeps the
value and applies attributes; null on a missing path creates null plus attributes.
`dataSetter('x', 7)` then `dataSetter('x', None)` leaves 7. Runtime writes are not
affected. `value` and attributes are stored as written (`'^y'`, `'==a+b'`, `'a${b}'`
stay strings; computed values use `dataFormula`). Removing the declaration keeps Data;
rebuild/thaw do not reinstall. A Bag value moves into Data without copy and leaves the
Source node. Example: `binding/03_setters_and_defaults` (`b03`).

<a id="gc-095-050"></a>

## 050 · Build-time defaults and data defaults (0.2.0)

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
"newrecord" that owns record defaults. Forms, records and newrecord are outside
0.2.0; do not model record defaults with build-time defaults. Example: `b03`.

<a id="gc-095-055"></a>

## 055 · Formulas and controllers (0.2.0)

`dataFormula(result_path, formula=None, func=None, **params)` writes its result at
`result_path` (no `?attr`). `dataController(script=None, func=None, **params)` writes
Data itself. `func` = named logic (recommended, 060); `formula`/`script`
= inline (065); both together = error. `^` keywords trigger, `=` only
read. Legacy `dataFormula('.total', 'a + b', a='^.a', b='^.b')` still works inline.
Examples: `controllers/01_formula` (`c01`), `02_controller` (`c02`).

Controls: `_if`/`_else` (false → `_else` if present, then stop); `_init` once before
DOM; `_onBuilt` after first successful build; `_onStart` at readiness (number = ms
delay, `true`/`0` = none, negative/non-finite = error; the three lifecycle attributes
accept only true, false, null or a number); `_delay` ms debounce, last
wins; `_timing` interval in seconds; `_userChanges` runs only when the changed path
is the registered path (containing and child paths skipped). `_userChanges`
separates edits from structure loading, not user from program. Removal stops timers.

<a id="gc-095-060"></a>

## 060 · Named logic (0.2.0)

Named Logic begins in 0.2.0; the Page/Logic module shown here is the **0.2.5**
arrangement. The `business` resource-group example requires genro-kajenn
resources. For the common FileServer gallery and a first editable page, use the
root-group method `func="add"` as in c03; `js_requires` is not available there.

Primary path. Each logic file exports `class Logic`; its methods are copied into a
per-instance group. Companion methods live in `page.logic`; each `js_requires` name
is a group (`page.logic.business`); `/` makes nested groups. Source:
`func='business.discount'` or `func='add'` (page logic). Formula: `method(kwargs)`
returns the value; controller: `method(node, kwargs)`. `kwargs` = resolved author
attributes plus `_node`, `_triggerpars`, `_reason` and, for buttons, `_evt` and
`button_*`; control attributes (`destination_path`, `result_path`, `func`, `formula`, `script`,
`_if`, `_else`, `_init`, `_onStart`, `_onBuilt`, `_delay`, `_timing`,
`_userChanges`) are excluded. `this` = group, `this.page` = page instance. Page logic
= the page module's `Logic` export: `orders.js` (JS page), `orders.js` beside `orders.py`
(Python page; its `Page` unused); `orders_aux.js` stays admitted; both = error. The
browser imports the page module, so its imports must resolve there: a `Page` with
server-only imports keeps `orders_aux.js`. Beside a Python page `orders.js` exports
`Logic` (else the browser rejects it, naming the file). The same
resource at several levels fills one group from generic to specific; specific wins.
Errors: explicit `Logic` constructor; method named `page` or like a child group;
missing name (never an inline fallback). State lives on group or page. Works
without `'unsafe-eval'`. Lookup/layout: [GC-090 030](090-classes-and-hosts.md). With the
minimal `GramlotFileServer` only the page logic exists, as the root group (`func='add'`); a dotted
name (`business.discount`) needs a `js_requires` group (a `GramlotServer` with a resource system).
The same method name registered twice in a group: the last registration wins; the
page logic registers after `js_requires`. Example: `controllers/03_named_logic` (`c03`).

<a id="gc-095-065"></a>

## 065 · Writing Data from code and inline code (0.2.0)

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
Python `GramlotServer`, JS `GramlotServer`, GramlotWorkerServer or DevTools panel. Inline pages need `'unsafe-eval'`
under a server CSP; without it the browser refuses compilation and Gramlot raises an
`EvalError` naming node and attribute and pointing to named logic or the permissive
profile ([GC-090 035](090-classes-and-hosts.md)); covers `formula`, `script`,
`_if`/`_else`, `==`, `action`, `connect_on<event>`. Examples: `controllers/04_inline_expressions`
(`c04`), `05_node_methods` (`c05`). The `@gramlot/gramlot-serverless` file allows
`'unsafe-eval'`: inline runs there too. Inline code runs only as written in the
received Source (`main`, a remote Source, a `GramlotBuilderBag` given to `startSource`),
as literal strings. Errors naming node and attribute ([GC-090 035](090-classes-and-hosts.md)):
a code attribute changed after the start or a node with inline code inserted in the live
Source (not run; use named logic); a code attribute holding a pointer
(`formula='^.code'`), refused at reception (data reaches inline code as parameters,
never as text); an attribute of the form `onclick` (write `connect_onclick`); a
`javascript:` URL in `href`, `src`, `formaction`, `xlink:href`, written or from Data.
An `iframe` `srcdoc` from Data (pointer, `==`, `${…}` template reading a pointer, or a
pointer node value whose datum carries `srcdoc` in `_wdg`) gets `sandbox=""`: HTML shown,
nothing runs. Literal `srcdoc`: no `sandbox`. A `sandbox` written in the Source is kept
(`sandbox='allow-scripts'` runs scripts) and turns the rule off (GC-090 §035).
Legacy macros (`GET`, `SET`, `PUT`, `FIRE`, `FIRE_AFTER`, `$1`)
only via a deprecated preprocessor with legacy regexes → `this.GET(...)` etc.,
`$1` → `arguments[0]`; macros in strings/comments are translated as in legacy; one
`console.warn` per declaration. `this.SET(...)` passes unchanged, no warning.

<a id="gc-095-070"></a>

## 070 · Native controls and reactive attributes (0.2.0)

`value='^path'` binds native controls both ways. Data representation: text/textarea
(and password, email, url, tel, search) string or null (shown empty; empty string kept;
Data change during IME composition shown at its end); number finite number or null
(empty → null; invalid draft stays in the DOM, writes nothing, never `NaN`); range
finite number or null (browser clamp writes nothing); single select string or null
(missing option: nothing selected, Data unchanged); multiple select array of strings
(`[]` included) or null (nothing selected; any other value = error); date/time/month/week/datetime-local native lexical
string or null (no `Date`, no time zone); color string as serialized by the browser
(normalization writes nothing). `hidden` and `file` inputs have no adapter; button
inputs stay native; an unknown type is text. A literal or `=` value sets the control and
never writes; a literal `value` (neither `^` nor `=`) is also the control default
(`defaultValue` of an input, text of a textarea), so a native form Reset restores it; a
`^` value sets the property only; select, checkbox and radio keep the default of their
authored `selected`/`checked`. `live=False` (default) writes on `change`; `live=True` on `input` for
text, textarea, number, range; select, color and temporal types always write on
`change`. A controller correction returns to the originating control; other attributes
on the same path update while typing. Changing `type`, `multiple` or `group` rebuilds
the element and keeps its binding. Examples: `binding/04_native_editing`
(`b04`), `05_checkbox_radio` (`b05`), `06_style_and_visibility` (`b06`), `07_bound_svg` (`b07`).
Checkbox `input(type='checkbox', value='^.flag')`: Data only `true`/`false`, never
`'on'`. Radio `input(type='radio', group='size', value='^.small')`: one boolean per
button; choosing one sets it `true`, the others `false`; `group` yields an
instance-scoped DOM `name`; several initial `true` = error. `radioButtonText` comes
with components in 0.3.0.

Reactive attributes: `style`/`class` strings (null removes; other types error);
`visible=false` → `style.visibility='hidden'`, keeps space, null restores current
`style`; `hidden` native boolean; style shortcuts compose `style`, win over the same
property in `style`, null removes that property; `width`/`height` on img/canvas/embed
and `width`/`border` on table stay attributes (legacy); SVG presentation attributes,
no style shortcuts on SVG (null removes); `data_*`/`aria_*` → `data-*`/`aria-*`; other
other HTML attributes as in 0.1.2. Excluded: style as Bag/dict, a runtime theme API, `root.css()`.

### Attribute templates and text masks

An attribute template `${name}` uses another attribute of the same Source node
after pointer resolution. It is not a Python f-string or a JavaScript template
literal. For example:

```python
root.div("Preview", title="Customer: ${customer}", customer="^.name")
root.p("^.name", mask="Hello, %s")
```

The title follows `.name`; `customer` supplies the template and is not projected
to the DOM. A preceding backslash escapes `${`. An unknown parameter is an error.
Templates apply to visual attributes, not node text or data-element declarations.
`${...}` in a controller script remains JavaScript syntax. A template cannot use
an `==` attribute as its parameter, and an `==` expression cannot contain a
`${...}` template. An `==` expression can read a resolved template and its consumed
pointer parameter; it cannot read a template-valued attribute that another
template has itself consumed. Those unsupported combinations raise errors. `mask` formats the node's text, replacing
`%s`; an empty formatted value stays empty. It does not enable raw HTML.

Development correction: Python static, JavaScript static and live rendering now
reject non-string, non-null `style` and `class` values before attribute composition.
This includes resolved pointers and live `==` results; static renderers still defer
`==` expressions. A rejected live projection leaves the displayed attribute unchanged;
it does not undo the Data/Source write. Correct the value to resume projection.
The same check applies to SVG and literal `html_style`/`html_class` attributes.
Numeric style shortcuts such as `width=10` retain their existing contract.

<a id="gc-095-075"></a>

## 075 · Buttons and events (0.2.0)

Main click path: a `dataController` nested in `button`, e.g.
`root.button("Save").dataController(func="orders.save", total="=.total")`. It is an
ordinary controller (also `^`, `_init`, `_onStart`, `_timing`); the click is one more
trigger. It receives `_evt`, `button_counter`, `button_shift`, `button_ctrl`,
`button_alt`, `button_meta`; the counter lives as long as the Source node, across
rebuilds. Alternatives: `action='…'` = inline code on click, `this` = button node,
receives current button attributes plus `event`, `_counter`, `modifiers` (inline
rules apply); `fire='.path'` = `FIRE` with the modifier string (`'Shift'`,
`'CtrlAlt'`, …) or `true`, Data node gets `modifier` and `_counter`;
`fire_<name>='.path'` = `FIRE` with value `'<name>'`. A nested `dataRpc` is also a click mechanism
(§100). One mechanism per button:
several `dataController` or `dataRpc` children or any combination of nested controller, `action`
and the `fire` family = error; several `fire_*` all fire in attribute order; `fire`
with `fire_*` is one mechanism (`fire` wins, `fire_*` ignored, as legacy); `fire_*`
also write `modifier` and `_counter`. `connect_on<event>` attaches native listeners on
any element; on a button it runs after the Gramlot mechanism; a value of dotted names
(`group.method`) is named logic, any other value inline; event name = text after
`connect_on`, lower-cased.

R3, only for `<button>` tags with a Gramlot mechanism: `type="button"` if the author
wrote no `type` (an authored `type` stays; `type="button"` stays if the mechanism is
removed); `stopPropagation`; no `preventDefault`; a disabled button does nothing and
does not count. Other buttons stay native, also under a parent `dataController`;
`input` button types stay native. No 200 ms disable, bursts or LightButton. Known
effect: in a form with one text field whose only button has a mechanism
(`type="button"`), Enter submits the form natively and the mechanism does not run. The
owner accepted R3 as built for 0.2.0 and reviews it after the release. Examples:
`controllers/06_button_controller` (`c06`), `07_events` (`c07`).
`gramlot.dom.getBaseSourceNode(domNode)` → Source node of the first rendered ancestor
or null; `getDomNode(sourceNode)` → element or null (fragment, data element, removed
or unbuilt node). No properties are added to DOM elements or Source nodes.

<a id="gc-095-080"></a>

## 080 · Lifecycle order (0.2.0)

Unfrozen branch: 1 validation without effects; 2 `dataSetter` in document order;
3 defaults; 4 registration of pointers/formulas/controllers; 5 `_init` once per
node; 6 DOM with current values; 7 `_onBuilt` after first successful build;
8 `_onStart` after page readiness (initial Source) or right after 7 (later branch).
Applies to initial Source, `remoteSource` and every inserted branch. Active
observers see `dataSetter` writes synchronously; the new branch's providers wait for
steps 2-3. On error new registrations close; no Data rollback.
Each build runs to completion; Source changes during it queue in arrival order;
changes to a node being built are ignored. Freeze: inserted branch runs 1-5 at once;
DOM and `_onBuilt` at thaw; `_onStart` waits for the first build. Thaw builds once,
no reinstallation, no repeated `_init`/`_onStart`. Removal closes registrations and
timers, also under freeze. Example: `binding/08_freeze` (`b08`).

Cleanup: removing a Source node closes its providers, timers, registrations, listeners
and pending requests and the renderer removes its DOM; closing the page disposes the
`Gramlot` instance for the whole page. Handlers of a node removed under freeze do
nothing. A callback that removes its own node runs to its end (a later `SET` writes);
only the Gramlot handlers stop (`fire_*` loop, radio peer loop, listeners). A failing
disposer does not stop the others: removal completes, then the closing errors are
thrown (one as is, several as `AggregateError`). A failed first render removes the
records its children created (listeners, controls, radio groups, references); no Data
rollback. Example: `controllers/08_end_to_end` (`c08`).

<a id="gc-095-085"></a>

## 085 · Exclusions and deferred work (0.2.0)

Explicit error: `serverpath`, `dbenv`, `shared_id`,
`subscribe_*`, `selfsubscribe_*`, `formsubscribe_*`, `PUBLISH`,
`_ask`, `ask` (same keys inside user Data stay data). Outside 0.2.0 without a
dedicated error: components/widgets; store, grid, tree; form, record, newrecord;
server sync; CSS beyond `css_requires`; rich editing; async scheduling and
transactions; developer warning Bag. Components (incl. `radioButtonText`) planned
for 0.3.0. Source `script` stays native HTML5, not evaluated. `dataRpc` left the
list in 0.2.14 (§100); `remote` and `dataRemote` in 0.2.16 (§105).

<a id="gc-095-090"></a>

## 090 · Differences from legacy GenroPy and migration (0.2.0)

Intentional differences: `dataSetter` replaces `data`, no alias; R1 applies
attributes on null (legacy skipped the whole write); all branch `dataSetter` before
DOM (legacy: node and direct children); no `?attr` in `destination_path`/`result_path`;
R3: `stopPropagation` without `preventDefault` plus `type="button"` (legacy: both calls, no type; one-field form: Enter submits natively, 075);
`css_requires`/`js_requires` need a `GramlotServer` with a resource system (genro-kajenn, part of Genro, the GenroPy successor built on Kajenn, Gramlot and Asqueel), minimal `GramlotFileServer` and current adapters error on any name, last registration of a method name wins; `name:media`
error; `data(...)` is no declaration (`root.data` raises, on other nodes `data` is the Data Bag property), `html_data(...)` is the HTML5 element; controller/`action`/`fire` combinations are errors (legacy chained them and
also ran the nested controller); no `#WORKSPACE`/`#ROW`/`#DATA`; methods instead of `domNode`/`sourceNode` properties; Source `script` without
`dojo.eval`; macros only via the deprecated preprocessor.
Migration from legacy pages: `data(...)` → `dataSetter(...)`; `Page.css` URL list
stays, a page-only stylesheet can move to same-name `foo.css`; inline controllers →
named logic; macros → `node.SET(...)` etc.
Migration from 0.1.x: pages without binding run unchanged (HTML/SVG, `Page.css`);
`@source` / `registerSource(...)` declare Source fragments and `@endpoint` / `registerEndpoint(...)` declare endpoints (§100); the `remote` attribute mounts a fragment declaratively (§105); `data(...)` created the HTML5 `<data>` element; on `root` it now
raises, on other nodes `data` is the Data Bag property: write `html_data(...)`; custom servers implement `resolve_page`/`resolvePage` and
`resolve_resources`/`resolveResources`, pass the mount prefix to `open_page` and serve
the companions, and the bootstrap writes the CSS links in the browser
([GC-090](090-classes-and-hosts.md)); standalone and ASGI integrations moved from the
retired `gramlot-minimal` to `@gramlot/gramlot-serverless` (gramlot-js-server) and the `uvicorn` adapter of `gramlot-py-server`; Python and JS
static renderers share the attribute/style rules (`style_*`, `color`, … compose `style`
in both). Check migrated pages for `data(` calls.

<a id="gc-095-095"></a>

## 095 · Sending and saving data: `gramlot.utl.inout` (0.2.5, path since 0.2.10)

`gramlot.utl.inout`: what the page sends, receives, saves, downloads. Browser runtime, so
Python and JS pages alike, from inline code (`action="gramlot.utl.inout.sendMail('modulo',
'office@example.org')"`) or `Logic` (`this.page.utl.inout`). Argument: Data path of a Bag
branch.
- `sendMail(path, email)`: `mailto:` in the user's mail program; subject = page title;
  one `name: Rossi` line per value (`address.street: …` nested); sent when the user
  presses send.
- `sendHttp(path, url)`: branch as a JSON object, HTTP `POST`; resolves with the
  response, rejects outside 200–299.
- `save(path, name)`: TYTX file. `restore(path)`: file dialog, reads a `save` file
  into `path` with exact types (dates, decimals).
- `download(path, name, 'json' | 'xml')`: `Bag.toJson`, or `Bag.toXml` in one root
  element named after the last path segment; types become text.
Dates in the email `1990-05-02`, datetimes ISO. Email > 2000 characters (`mailto:`
limit) → error naming the length. Missing path or not a Bag →
`gramlot.utl.inout: no data Bag at '<path>'`. `restore` needs a user action. JSON/XML are
export only. Restore requires a typed Bag root and rejects plain objects, lists
and scalars without replacing the existing branch. Inline code needs `'unsafe-eval'` ([GC-090 §035](090-classes-and-hosts.md));
strict CSP → call from `Logic`. `sendHttp` reaches what `connect-src` allows.

<a id="gc-095-100"></a>

## 100 · Calling the server: `dataRpc` and endpoints (0.2.14)

`dataRpc(method, result_path=None, timeout=None, **params)` calls an endpoint of the
page and writes the value at `result_path` (absent → not written; no `?attr`).
`method` = endpoint name or `^`/`=` pointer. `timeout` in ms → abort, error `name`
`TimeoutError`. Other kwargs = endpoint arguments (`^` triggers, `=` read only);
control attributes of §055 apply (`_init`, `_onBuilt`, `_onStart`, `_delay`, `_timing`,
`_userChanges`, `_if`; false `_if` → no call, `_else` runs as inline code). Inline
callbacks: `_onCalling` (arguments), `_onResult` (arguments + `result`, after the
write), `_onError` (arguments + `error`: `RpcError` with `code`/`remoteName`/`message`,
transport error or `TimeoutError`); without `_onError` the failure is an unhandled
rejection. Latest call wins (a new trigger aborts the one in flight; removal aborts
too). Nested in `button` = click mechanism (§075).
Declaration: Python `@endpoint` / `@endpoint(auth="rule")`; JS
`Page.registerEndpoint(name, {auth})` after the class. Arguments by name (Python) or
one object (JS); returns a scalar, a Bag or null (data, never code). `dataRpc` sends
every author argument: Python calls with keywords (an unaccepted keyword →
`application_error`), JS ignores unread keys, so a Python endpoint called from
`dataRpc` declares `**kwargs` (legacy `rpc_*` convention). Example:
`root.dataRpc("with_vat", result_path=".gross", price="^.price")` with
`@endpoint def with_vat(self, price, **kwargs)`; JS
`root.dataRpc({method: 'with_vat', result_path: '.gross', price: '^.price'})` and
`Page.registerEndpoint('with_vat')`. `auth` on a server without the `auth`
capability → `not_authenticated`, method not run. **0.2.15 addition:** `auth="rule"` on an element of
`main` or of a `@source` fragment: the server drops the element and its children when
it refuses the rule; the element never reaches the client and an accepted one is sent without `auth` (a server without the `auth`
capability refuses every rule). Non-string rule → `application_error`; a page built in
the browser does not evaluate `auth`. Names `[A-Za-z][\w]*`, `main`
reserved, not both endpoint and `@source`. Unknown endpoint → `not_found`; raised
exception → `application_error` with `name`/`message`; both reach `_onError`. A string
argument with a TYTX suffix (`"x::D"`) is decoded by TYTX, not passed as text
(genro-tytx decodes only text it encoded): endpoints do not rely on it. Wire:
one envelope on `POST /gramlot/rpc` ([GC-090](090-classes-and-hosts.md)).

<a id="gc-095-105"></a>

## 105 · Remote content and lazy Data: `remote` and `dataRemote` (0.2.16)

> **Development note (2026-10-13):** the last-successful-result cache and
> cancellation corrections described below are locally implemented and tested,
> but are not a new published release. An installed package may still have the
> earlier cache behavior; the repository README identifies published releases.

`remote`: the content of an element is the fragment of a `@source` method (JS
`Page.registerSource(name)`). Node method `remote(name, **params)` (JS
`remote(name, params)`) writes `remote = name` and `remote_<k>` per parameter; returns
the node. **Fixed method:** `name` is a literal identifier, never a Data pointer
or a method varied through Data. `"^method"` is rejected by the `remote(...)` helper during Source construction
in both languages. Direct or edited Source is not yet checked consistently;
dynamic names are still outside the supported contract. A future variable method requires an explicit owner decision.
Requested at the element's start (§080) and on every change of a `^`
pointer of a `remote_<k>` parameter (`=` read only), through
`gramlot.src.remoteSource` (latest wins, removal cancels). The fragment replaces the
content; authored children stay until it arrives. Controls: `_cachedRemote` (name
and parameters equal the last successfully mounted request → no request; cancel
any pending request so its late response cannot replace the fragment; compare
TYTX parameters captured before sending, so mutations cannot change the cache;
different object-key order may request again), `_if` (inline, parameters as locals; false → no request, the request in
flight cancelled, `_else` runs), `_onRemote` (inline after the mount). Name `[A-Za-z][\w]*`; another
`_` parameter → error; a failed request → unhandled rejection naming the element.
Nested `remote` inside a fragment works. Example:
`root.div().remote("details", record_id="^.record_id", _cachedRemote=True)` with
`@source def details(self, root, record_id=None, **kwargs)`; JS
`root.div().remote('details', {record_id: '^.record_id'})`, method
`details(root, {record_id})` and `Page.registerSource('details')`.
`dataRemote(destination_path, method, cacheTime=None, **params)` installs at
`destination_path` (no `?attr`) a resolver that calls the endpoint `method` (name or
`^`/`=` pointer) when the path is read. `cacheTime` in seconds: negative/`None` → once,
`0` → every read, positive → again on the first read after it. A read never waits:
it returns the current value (`None` before the first call) and starts the call when
expired; a read during a call starts no other. The answer is written at the path and
projects every `^` consumer; with `cacheTime=0` it is written without notifying them
(legacy: a value per explicit read). `^` argument change → new resolver, which calls at
once when the previous one had called. False `_if` → resolver removed, last value kept,
`_else` runs; true again → the new resolver calls at once if the removed one had
called; `_delay`/`_timing`/`_userChanges` as `dataRpc`; `_init`/`_onBuilt`/`_onStart`
→ error. Removal removes the resolver and aborts the call (an aborted call writes
nothing); endpoint failure → value unchanged, unhandled rejection naming the
declaration. Example: `root.dataRemote(".menu", "load_menu", cacheTime=5,
table="dishes")`; JS `root.dataRemote({destination_path: '.menu', method:
'load_menu', cacheTime: 5, table: 'dishes'})`.
Intended legacy differences: `remote` is an attribute of the element (legacy: a child
element writing on its parent); no `lazy` by visibility, `_waitingMessage`, `tbody`
merge, `_resolved`, `_fired`; the alias `data(path, remote=…)` is not accepted.


<a id="gc-095-110"></a>

## 110 · A reusable application index and an installable root

Block ID: **GC-095-110**. Development addition; not yet a published release.

`IndexPage` supplies grouped navigation, a resizable sidebar and iframe tabs. A
page opens on first selection; selecting it again reuses the same iframe and its
state. The gallery extends this class with its explanations, source viewer and
inspector. Your application does not need the gallery package.

For a Python application, put this in `pages/index.py`:

```python
from gramlot import IndexPage


class Page(IndexPage):
    title = "My application"
    logo_url = "/app-icon.png"
    installable = True
    app_icon = "/app-icon.png"
    navigation = (
        {"key": "work", "title": "Work", "children": [
            {"key": "hello", "title": "Hello", "url": "hello"},
        ]},
    )

    def introduction(self, pane):
        pane.h2("Welcome")
        pane.p("Choose Hello in the sidebar to open your first page.")

    def footer(self, pane):
        super().footer(pane)
        pane.span("My application")
```

Its companion `pages/index.js` connects the standard browser behavior:

```javascript
export {IndexLogic as Logic} from '@gramlot/gramlot/page';
```

Finally, create `pages/hello.py`:

```python
from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        root.h1("Hello")
        root.p("This page keeps its own Data and Source inside its iframe.")
```

Serve a square **512×512 PNG** at `/app-icon.png` using the environment's asset
map. The default manifest declares precisely that size and media type; it does
not convert images. The same image can be the sidebar logo, or `logo_url` can
point to a separate logo. A mounted application must use the mounted URL for
`logo_url`; `app_icon` is an application-relative asset path, and the manifest
method adds the mount prefix itself. Leading `/` on `app_icon` is accepted.

Each navigation group has `key`, `title` and `children`; each child has `key`,
`title` and `url`. Use unique keys across groups and children, and reserve `intro`
for the introduction. URLs are those of the environment: for example `hello` on
a Python server, or `hello/index.html` for a static directory route. Use one
index shell per document. `shell_id` defaults to `index` and separates its saved
preferences from other index shells at the same origin and path.

Override `introduction(pane)` and `group_panel(pane, group)` for introductory
content. Override `footer(pane)` to replace the footer, or call `super()` to keep
its theme, color mode, keyboard-navigation and installation controls. The
standard footer remembers Base/Compact, Light/Dark and sidebar width in local
storage; the keyboard checkbox is a per-page choice. A replacement footer need
not contain the standard controls. The default `panel(parent, item)` creates an
iframe; `behavior(shell)` activates `IndexLogic` through a named controller.

The shell's theme does not automatically style arbitrary iframe documents.
The gallery supplies the corresponding frame-side theme receiver for its examples.

The JavaScript equivalent exports both classes from the page module:

```javascript
import {IndexPage} from '@gramlot/gramlot/page';
export {IndexLogic as Logic} from '@gramlot/gramlot/page';

export class Page extends IndexPage {
    static title = 'My application';
    static logoUrl = '/app-icon.png';
    static installable = true;
    static appIcon = '/app-icon.png';
    static navigation = [{key: 'work', title: 'Work', children: [
        {key: 'hello', title: 'Hello', url: 'hello/index.html'},
    ]}];

    footer(pane) {
        super.footer(pane);
        pane.span('My application');
    }
}
```

### The manifest belongs to the root

Installation is also available to an ordinary `Page`: it does not require
`IndexPage`. `installable` defaults to false. Only the application's root page
can advertise `/app.webmanifest`; enabling it on a child page has no effect.
The root's default `manifest` method builds `id`, `name`, `short_name`,
`start_url`, `scope`, `display: "standalone"` and `icons` from its properties.
It uses the application's mount prefix for identity, scope and launch URL.

Override the method to customize standard manifest fields:

```python
def manifest(self, *, base_url="./"):
    return {
        **super().manifest(base_url=base_url),
        "description": "My team's workspace",
        "background_color": "#ffffff",
    }
```

In JavaScript the signature is `manifest({baseUrl = './'} = {})`, with
`super.manifest({baseUrl})`. The result must be a JSON object. An override may
supply additional icon sizes or replace the icons. The manifest is public
application metadata: keep user/session data out of it.

Python and Node serve this method as a plain HTTP GET/HEAD resource, without a
Gramlot RPC envelope, `@endpoint` or `registerEndpoint`. A disabled root returns
404. Serverless directory export writes the method's result to
`app.webmanifest`, with relative scope and start URL. A single-file export rejects
an installable root: choose directory export for installation.

### Open the application in its own window

Serve the application over HTTPS, or on localhost for development. The index
footer offers installation instructions and, when the browser supplies its
installation prompt, an **Install** button. Dismissing the prompt leaves the
browser's own installation menu available. On Safari for macOS Sonoma or later,
use **File → Add to Dock**; see [Apple's web-app guide](https://support.apple.com/en-gb/104996).

The Python and Node servers must remain available. Serverless runs its application
in the browser, but installation still needs a static HTTP(S) origin. Opening
`index.html` directly from disk remains supported for running a directory export;
it is not the installation path. This feature adds no service worker or offline
cache, and does not install anything without the user's browser confirmation.
