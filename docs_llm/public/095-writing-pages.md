# Writing pages

Document ID: **GC-095**. Native 0.1.2 APIs plus the planned 0.2.0 data binding.

> **Release status.** Describes **0.2.0 (HTML/SVG data binding), in development**:
> an approved plan, not yet implemented, tested or released. Latest published
> release: **0.1.2**. Sections 005-035 are 0.1.2 behavior with *0.2.0* notes;
> sections 040-090 are planned 0.2.0 behavior only.

<a id="gc-095-005"></a>

## 005 · A first native HTML page

Host-supplied authoring example, not a standalone server command:

```python
from gramlot import Page as BasePage, source

class Page(BasePage):
    title = "People"
    def main(self, root):
        root.div("People", id="people").p("Choose a person")
    @source
    def details(self, root, name="Homer"):
        root.p(name)
```

Python calls return real SourceBagNode objects; JS uses the generic builder handles. Text is literal, not parsed HTML.
Native attributes work; `class_` escapes the keyword. Use the exported HTML5 collection; its open signatures accept native attributes.
CSS conveniences such as `color`/`background` are absent.
*0.2.0:* legacy shortcuts (`color=`, `font_size=`, `_class`) stay excluded;
reactive styling uses `style`, `class`, `visible` (070).

<a id="gc-095-010"></a>

## 010 · From a page to the browser

Host returns bootstrap; `Gramlot` prepares/subscribes Data and Source; server runs
`main(root)` and sends typed SourceBag/TYTX; generic builder associates it; Gramlot
validates incoming Source before insertion; one insertion under Source `main`
triggers rendering. Later mutations use the same subscription. Native attribute
updates may retain elements; structural changes rebuild the subtree and clean up.
*0.2.0:* before mounting, bootstrap loads `css_requires`/`js_requires` resources and
companions and registers named logic ([GC-090 030](090-classes-and-hosts.md));
each branch installs Data declarations between validation and DOM (080).

<a id="gc-095-015"></a>

## 015 · Remote blocks

`@source` explicitly exposes a public method. Main/source methods may be sync or
async, build into root, return `None`, and accept keyword arguments. An unmarked
override hides inherited exposure. Browser runtime
`app.remoteSource(targetNode, "details", {name: "Marge"})` validates incoming Source
then replaces the body. Rendering follows the Bag event, without Source rollback.
Stale responses and removed targets are ignored.

This runtime call is not a declarative page-button API. Controller/binding
declarations are missing; applications must not substitute manual DOM events/fetch.
*0.2.0:* a `remoteSource` branch installs its own `dataSetter` before its DOM.
The plan adds button controllers (075), not a declarative remote request.

<a id="gc-095-020"></a>

## 020 · Deferred capabilities

Recipes, Data bindings, controllers, resolvers and shared components are outside
this native HTML Source-live increment. They are not available page APIs.
*0.2.0:* bindings, `dataSetter`, `dataFormula`, `dataController` enter (040-090).
Recipes, resolvers, shared components stay deferred; components planned for 0.3.0.
Exclusions: 085.

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
*0.2.0:* SVG presentation attributes accept `^`; null removes them (070).

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

One Data Bag per page instance: `app.data === app.builder.data`. Author paths never
contain the internal `main`. One Gramlot subscription routes changes by path.
Pointers in attributes or node values: `^path` reads and reacts; `=path` reads at
call time without triggering; `==expr` is an inline JS expression compiled only in
the page runtime and evaluated at each projection; `^path?attr` points to a Data node attribute. `.path` is relative
to the branch `datapath`; Source or context changes re-register pointers.
Symbolic origins (Builder): `#parent` (one level up), `#FORM` (first ancestor with
`formId`/`form=True`), `#ANCHOR` (first ancestor with `_anchor`), `#<node_id>`;
e.g. `value='^#FORM.customer.name'`. `#WORKSPACE`, `#ROW`, `#DATA` and aliases are
outside 0.2.0.
Example: `panel = root.div(datapath=".customer")`; `panel.h2("^.name")`;
`panel.input(value="^.name", live=True)`.

Variable datapath: `datapath='^.foo'` uses the value at `.foo` as the branch
datapath and re-registers when it changes; empty value = null path. Implemented by
`absDatapath` of Gramlot's `GramlotBuilderBagNode`, which also keeps `?attr` on
symbolic paths; Builder and Bag unchanged.
Attributes ending in `_path` hold a bare path; a written `^`/`=` is removed with one
`console.warn` per declaration. `foopath` is ordinary; `datapath` has its own rule.

<a id="gc-095-045"></a>

## 045 · Initial values: `dataSetter` (0.2.0)

`dataSetter(destination_path, value=None, **attr)` replaces legacy `data(path, value)`,
without alias; `data` stays the HTML5 `<data>` element. `destination_path` is
relative or absolute; `?` is a validation error. `value` is optional; other keywords
become Data node attributes. A `dict`/plain object becomes a `Bag` (read as JSON:
nested dicts → Bags, lists stay lists, dicts in lists stay dicts); a JSON string stays
a string.

All `dataSetter` of a branch (initial Source or inserted branch) install before its
DOM, in document order including ones nested after visual siblings; earlier
elements see final values at first render. Same path: later wins; no duplicate
warning. R1, installation only: non-null writes; null on an existing path keeps the
value and applies attributes; null on a missing path creates null plus attributes.
`dataSetter('x', 7)` then `dataSetter('x', None)` leaves 7. Runtime writes are not
affected. Removing the declaration keeps Data; rebuild/thaw do not reinstall. A Bag
value moves into Data without copy and leaves the Source node.

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
0.2.0; do not model record defaults with build-time defaults.

<a id="gc-095-055"></a>

## 055 · Formulas and controllers (0.2.0)

`dataFormula(result_path, formula=None, func=None, **params)` writes its result at
`result_path` (no `?attr`). `dataController(script=None, func=None, **params)` writes
Data itself. `func` = named logic (recommended, 060); `formula`/`script`
= inline (065); both together = error. `^` keywords trigger, `=` only
read. Legacy `dataFormula('.total', 'a + b', a='^.a', b='^.b')` still works inline.

Controls: `_if`/`_else` (false → `_else` if present, then stop); `_init` once before
DOM; `_onBuilt` after first successful build; `_onStart` at readiness (number = ms
delay, `true`/`0` = none, negative/non-finite = error); `_delay` ms debounce, last
wins; `_timing` interval in seconds; `_userChanges` runs only when the changed path
is the registered path (containing and child paths skipped). `_userChanges`
separates edits from structure loading, not user from program. Removal stops timers.

<a id="gc-095-060"></a>

## 060 · Named logic (0.2.0)

Primary path. Each logic file exports `class Logic`; its methods are copied into a
per-instance group. Companion methods live in `page.logic`; each `js_requires` name
is a group (`page.logic.business`); `/` makes nested groups. Source:
`func='business.discount'` or `func='add'` (companion). Formula: `method(kwargs)`
returns the value; controller: `method(node, kwargs)`. `kwargs` = resolved author
attributes plus `_node`, `_triggerpars`, `_reason` and, for buttons, `_evt` and
`button_*`; control attributes (`destination_path`, `result_path`, `func`, `formula`, `script`,
`_if`, `_else`, `_init`, `_onStart`, `_onBuilt`, `_delay`, `_timing`,
`_userChanges`) are excluded. `this` = group, `this.page` = page instance. The same
resource at several levels fills one group from generic to specific; specific wins.
Errors: explicit `Logic` constructor; method named `page` or like a child group;
missing name (never an inline fallback). State lives on group or page. Works
without `'unsafe-eval'`. Lookup/layout: [GC-090 030](090-classes-and-hosts.md).

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
Python Host, JS Host, WorkerHost or DevTools panel. Inline pages need `'unsafe-eval'`
under a host CSP. Legacy macros (`GET`, `SET`, `PUT`, `FIRE`, `FIRE_AFTER`, `$1`)
only via a deprecated preprocessor with legacy regexes → `this.GET(...)` etc.,
`$1` → `arguments[0]`; macros in strings/comments are translated as in legacy; one
`console.warn` per declaration. `this.SET(...)` passes unchanged, no warning.

<a id="gc-095-070"></a>

## 070 · Native controls and reactive attributes (0.2.0)

`value='^path'` binds text, textarea, number, range, select (single/multiple),
date, time, month, week, datetime-local and color both ways; the per-type
conversion is still to be confirmed. `live=False` (default) writes on `change`;
`live=True` on `input`. A controller correction returns to the originating control;
other attributes on the same path update while typing.
Checkbox `input(type='checkbox', value='^.flag')`: Data only `true`/`false`, never
`'on'`. Radio `input(type='radio', group='size', value='^.small')`: one boolean per
button; choosing one sets it `true`, the others `false`; `group` yields an
instance-scoped DOM `name`; several initial `true` = error. `radioButtonText` comes
with components in 0.3.0.

Reactive attributes: `style`/`class` strings (null removes; other types error);
`visible=false` → `style.visibility='hidden'`, keeps space, null restores current
`style`; `hidden` native boolean; SVG presentation attributes (null removes); other
native attributes as in 0.1.2. Excluded: style as Bag/dict, legacy shortcuts,
themes, `root.css()`.

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
`fire_<name>='.path'` = `FIRE` with value `'<name>'`. One mechanism per button:
several `dataController` children or any combination of nested controller, `action`
and the `fire` family = error; several `fire_*` all fire in attribute order. `connect_on<event>` attaches native listeners on any
element; on a button it runs after the Gramlot mechanism.

R3, provisional pending tests, only for buttons with a Gramlot mechanism: set
`type="button"` if the author wrote no `type`; `stopPropagation`; no
`preventDefault`. Other buttons stay native. No 200 ms disable, bursts or
LightButton.
`Gramlot.getBaseSourceNode(domNode)` → Source node of the first rendered ancestor
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
timers, also under freeze.

<a id="gc-095-085"></a>

## 085 · Exclusions and deferred work (0.2.0)

Explicit error: `serverpath`, `dbenv`, `shared_id`, `remote`, `dataRpc`,
`dataRemote`, `subscribe_*`, `selfsubscribe_*`, `formsubscribe_*`, `PUBLISH`,
`_ask`, `ask` (same keys inside user Data stay data). Outside 0.2.0 without a
dedicated error: components/widgets; store, grid, tree; form, record, newrecord;
server sync; CSS beyond `css_requires`; rich editing; async scheduling and
transactions; developer warning Bag. Components (incl. `radioButtonText`) planned
for 0.3.0. Source `script` stays native HTML5, not evaluated.

<a id="gc-095-090"></a>

## 090 · Differences from legacy GenroPy and migration (0.2.0)

Intentional differences: `dataSetter` replaces `data`, no alias; R1 applies
attributes on null (legacy skipped the whole write); all branch `dataSetter` before
DOM (legacy: node and direct children); no `?attr` in `destination_path`/`result_path`;
R3 provisional, `stopPropagation` without `preventDefault` (legacy both); `js_requires`
loads all levels, specific wins (legacy: only the most generic JS); `name:media`
error; controller/`action`/`fire` combinations are errors (legacy chained them and
also ran the nested controller); no `#WORKSPACE`/`#ROW`/`#DATA`; methods instead of `domNode`/`sourceNode` properties; Source `script` without
`dojo.eval`; macros only via the deprecated preprocessor.
Migration: `data(...)` → `dataSetter(...)`; `Page.css` URL list → `css_requires`
name string (Python and JS); inline controllers → named logic; macros →
`node.SET(...)` etc. Whether legacy `data(path, value)` errors or creates `<data>`
is decided during implementation; check migrated pages for `data(` calls.
