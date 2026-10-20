# Writing pages

Document ID: **GC-095**.

This guide covers the structure of a page: its Source, the way it reaches the
browser, SVG, live Source changes, data exchange, the application index, messages,
dates and formatting. The Data of a page and its bindings are in
[Data binding and controllers](097-data-binding.md); endpoints are in
[Calling the server](098-server-calls.md); Source and Data loaded from the server
are in [Remote content and lazy Data](099-remote-content.md). For appearance, use
[Themes and CSS](096-themes-and-css.md). Start with [Try Gramlot](025-try.md) and
an editable page from your adapter's setup guide.

**Execution model.** Page/main and exposed methods run on the server (or the JS
Worker). Logic runs in the browser. Source describes what to build; Data holds
the values; bindings connect them to the rendered DOM. Each server call creates
a fresh Page, so its fields are not persistent application state.

**Examples.** The gallery of gramlot-examples shows these guides in Python and
JavaScript, in families by topic, from HTML and SVG structure to binding,
controllers, server calls, input components and containers. Choose a lesson in the
[examples manual](https://gramlot-examples.readthedocs.io/en/latest/), or open the
hosted gallery for [Python](https://gallery-py.gramlot.dev/) or
[JavaScript](https://gallery-js.gramlot.dev/). The gallery runs on servers without a
resource system and without an identity system: `js_requires` groups and the allow
and deny of an `auth` rule need a server that has them.

<a id="gc-095-005"></a>

## 005 · A first HTML page

This is an authoring example, not a standalone server command. A server loads the
module and supplies `root`.

```python
from gramlot import Page as BasePage

class Page(BasePage):
    title = "People"

    def main(self, root):
        panel = root.div("People", id="people")
        panel.p("Choose a person")
```

`root.div(...)` returns a real SourceBagNode, so nested calls create child Source
nodes. Text is literal text, not parsed HTML. HTML attributes such as `id` are
supported; `class_` escapes the Python keyword. The exported HTML5 collection
defines the vocabulary; its open signatures accept any HTML attribute.

The legacy style shortcuts become CSS styling in the browser: `color='red'`,
`font_size='12px'`, `margin_top='4px'`, `style_aspect_ratio='16/9'`, `rounded=8`. They
compose one `style` attribute with `style='…'`, as the static Builder
`HtmlRenderer` does. `_class` is `class`. They react to Data like any attribute
([Data binding and controllers](097-data-binding.md#gc-095-070)). A length is written
with its CSS unit, except in `rounded`; the rule is in
[Themes and CSS](096-themes-and-css.md#gc-096-040).

<a id="gc-095-010"></a>

## 010 · From a page to the browser

1. The server returns a document with a root element, default `gramlot-root`, and
   the runtime bootstrap.
2. `Gramlot` prepares Data and Source roots and subscribes before requesting main.
3. The server executes `main(root)` and sends a typed SourceBag through TYTX.
4. The generic builder decodes and associates the Source, then Gramlot validates it
   before insertion.
5. Inserting the completed block under Source `main` triggers the renderer.

Later Source insertions, removals and updates use the same subscription. Attribute
updates can update an existing element; structural changes rebuild the affected
subtree and release its owned objects. Framework code owns this work.

The bootstrap document carries a script that creates `PageBootstrap` with the
page's resources. In the browser it writes the stylesheet links (the theme, the
`Page.css` URLs, then the same-name `foo.css`), imports the page's JavaScript
modules, creates the `Gramlot` instance, registers the named logic and then starts
the page ([Classes and server adapters](090-classes-and-hosts.md#gc-090-030)).
Between validation and DOM construction, each branch installs its Data
declarations ([lifecycle](097-data-binding.md#gc-095-080)).

Every page loads a theme before its own CSS: Gramlot Base, unless the server or
the page chooses another ([Themes and CSS](096-themes-and-css.md#gc-096-005)).
**Base** has the original spacing. **Compact** is an overlay with smaller headings,
gaps, card padding and form controls; load it after Base with `Page.css`:

```python
class Page(BasePage):
    css = ("/themes/gramlot-compact/theme.css",)
```

In JavaScript, write `static css = ['/themes/gramlot-compact/theme.css']`. Put the
list on a shared application Page base class to avoid repeating it in every page.
HTML elements and classes in `main` stay the same. Application CSS can override
theme rules. Color mode is separate: `data-theme="light"` or `data-theme="dark"` on
the document root, or the system preference when absent. There is no `root.css()`
API.

<a id="gc-095-015"></a>

## 015 · Source built on the server

`main` builds the whole page on the server. A page can declare more Source
fragments with `@source` / `registerSource(...)` and endpoints with `@endpoint` /
`registerEndpoint(...)`. The `remote` attribute mounts a fragment as the content of
an element; from code a fragment is requested with
`gramlot.src.remoteSource(target, method, params)`. See
[Remote content and lazy Data](099-remote-content.md) and
[Calling the server](098-server-calls.md).

<a id="gc-095-020"></a>

## 020 · Where to find the other capabilities

- Data, pointers, formulas, controllers, named logic, bound controls and buttons:
  [Data binding and controllers](097-data-binding.md).
- Endpoints and `dataRpc`: [Calling the server](098-server-calls.md).
- `remote` and `dataRemote`: [Remote content and lazy Data](099-remote-content.md).
- Input components, command buttons and containers:
  [Components](105-components.md).

Recipes, record and form management, stores, grids, trees and database services are
not provided; do not infer them from an HTML form or an endpoint-backed resolver.
[Excluded declarations](097-data-binding.md#gc-095-085) lists the legacy
declarations that raise an error.

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
attribute changes preserve the DOM element. `stroke_width` becomes the SVG
`stroke-width` attribute. This is SVG attribute adaptation, not general CSS
styling. JavaScript page authoring has equivalent `root.svg({...}).circle({...})`
calls.

SVG presentation attributes (`fill`, `stroke`, `stroke-width`, `opacity`,
`transform` and the others) accept `^` pointers like every other attribute. A null
value removes the attribute
([Data binding and controllers](097-data-binding.md#gc-095-070)).

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
Python page event declarations or generic SourceBag methods.

Freeze suspends only structural rebuilding. Elements already built inside a frozen
branch still react to Data changes. A branch inserted under a freeze installs its
Data declarations at once; its DOM and `_onBuilt` wait for the thaw
([lifecycle](097-data-binding.md#gc-095-080)).

<a id="gc-095-035"></a>

## 035 · Changing an element type

To replace a live `div` with a `section`, delete its Source node and insert a new
`section` through the builder. Deletion releases the old DOM and owned resources;
insertion renders the new node. Choose the insertion position explicitly when
sibling order matters. Changing only the tag in place is not supported; do not use
an extended `BagNode.setValue` tag argument. Ordinary value and attribute updates
continue through their Source methods.

<a id="gc-095-095"></a>

## 095 · Sending and saving data: `gramlot.utl.inout`

`gramlot.utl.inout` holds what a page sends, receives, saves and downloads. It is part
of the browser runtime, so Python and JavaScript pages use it alike: from inline
code (`action="gramlot.utl.inout.sendMail('modulo', 'office@example.org')"`) or from a
`Logic` method (`this.page.utl.inout`). Each function takes the Data path of a Bag
branch, here `modulo`.

```python
root.button("Send by email", action="gramlot.utl.inout.sendMail('modulo', 'office@example.org')")
root.button("Save", action="gramlot.utl.inout.save('modulo', 'registration.json')")
root.button("Reload", action="gramlot.utl.inout.restore('modulo')")
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
  `gramlot.utl.inout: no data Bag at '<path>'`.
- `restore` opens a file dialog, so it runs from a user action such as a button.
- JSON and XML are export formats only: `restore` reads back the files of `save`.
  The decoded root must be a typed Bag; plain objects, lists and scalar roots
  are rejected without replacing the existing Data branch.
- Inline code needs a Content Security Policy that allows `'unsafe-eval'`
  ([Classes and server adapters](090-classes-and-hosts.md#gc-090-035)); under a
  strict policy call the functions from `Logic`.
- `sendHttp` reaches the addresses that the Content Security Policy of the page
  allows in `connect-src`.

Gallery lesson: *Data exchange*.

<a id="gc-095-110"></a>

## 110 · A reusable application index and an installable root

Block ID: **GC-095-110**.

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
standard footer remembers the theme (Base, Compact, mimi, joanna), Light/Dark and
sidebar width in local storage; the keyboard checkbox is a per-page choice. A replacement footer need
not contain the standard controls. The default `panel(parent, item)` creates an
iframe; `behavior(shell)` activates `IndexLogic` through a named controller.

The optional `header(shell)` hook declares an application toolbar before navigation
and content. It is empty by default; the application supplies its Source and layout.
The example gallery uses it for its title and Navigation/Code toggles. Its code
viewer is a full-height right sidebar: both sidebars can be hidden and resized
without reloading the selected example. Widths and visibility are saved alongside
theme preferences when browser local storage is available. Introduction and category
pages hide the code sidebar automatically; returning to an example restores its
visibility preference and selected source tab.

The shell's theme does not automatically style arbitrary iframe documents.
The gallery supplies the corresponding frame-side theme receiver for its examples.
The browser behavior of the index, `IndexLogic` and `mountIndexPage`, is also
exported alone as `@gramlot/gramlot/index-page-runtime`
([Classes and server adapters](090-classes-and-hosts.md#gc-090-024)).

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

<a id="gc-095-115"></a>

## 115 · Messages, authored references and ask

Page and Source-node topics use the controller pipeline of
[Data binding and controllers](097-data-binding.md#gc-095-055). Gallery lessons:
*Publish and subscribe*, *Parent and child messages* and *Actions, confirmations and
references*.

### Reuse a controller from a click or a message

```python
from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        pane = root.main(datapath="messages")
        pane.p("^.summary")
        pane.dataController("this.SET('.summary', text)", subscribe_saved=True)
        pane.button("Publish").dataController(
            "gramlot.publish('saved', {text: 'Hello'})")
```

`subscribe_saved=True` activates that controller whenever the page publishes
`saved`. No Data trigger path is needed. Repeating the same message delivers it
again. Use `func` with a named Logic method for reusable behavior and a strict
Content Security Policy; the inline snippets here require the permissive profile.

A message adds named arguments. Declared controller arguments take precedence;
`_reason` is the topic and `_subscription_kwargs` is the original payload.
Data triggers and messages share the same controller/formula/RPC implementation,
including `_delay`, `_if`/`_else` and lifecycle. As in legacy, a provider subscription
registers by declaration presence, even with `False`. `_userChanges` retains its
exact-level filter: ordinary topic names do not pass that filter.

For an imperative subscription:

```javascript
const handle = gramlot.subscribe('saved', payload => console.log(payload.text));
gramlot.publish('saved', {text: 'Hello'});
gramlot.unsubscribe(handle);
```

Callbacks run synchronously in registration order; equal payloads are not suppressed.
Exceptions stop the remaining callbacks. Nested publication is allowed. A registration
added during delivery starts with the next publication; removal is immediate.
Unsubscribe handles belong to their page. Declarative subscriptions disappear with
the Source node; imperative subscriptions last until unsubscribed or page disposal.
Returned callback promises are not awaited by `publish`.

### Address an individual Source node

```python
target = pane.div(selfsubscribe_refresh="this.SET('.summary', p_0.text)")
pane.button("Refresh", target=target,
            action="target.publish('refresh', {text: 'Updated'})")
```

Passing the Source node directly as a Python or JS attribute creates a
`$gramlotRef` descriptor. At execution Gramlot resolves the current mounted node.
An explicit `builder.reference(node, kind="dom")` requests its DOM element.
Conversion applies to direct authored arguments, not arbitrary nested data.
Removed references fail explicitly, including after an ask wait.

`target.publish` addresses its `selfsubscribe_refresh` handler. Rendered-node inline
handlers receive the single payload as `p_0`; dotted named Logic handlers receive
`(node, payload)`. Providers use their usual argument signatures. A node with
`node_id="editor"` can also receive
`gramlot.publish({topic: 'refresh', nodeId: 'editor'}, {text: 'Updated'})`.
Source `subscribe`/`unsubscribe` keep their Bag-observation meaning;
they are not topic APIs. Node self-topics retain legacy qualified topic naming.

### Ask before executing

```python
pane.button("Send").dataController(
    "gramlot.publish('saved', {text})",
    _ask=dict(title="Message", fields=[
        dict(name="text", lbl="Message", required=True)
    ]),
    text="Hello")
```

The dialog is built with Gramlot Source, Data and HTML controls. Confirm
runs the controller once; Cancel or Escape runs no action. Values entered in the
dialog override current arguments and are also available as `_askResult`. A node
removed while waiting cannot execute later. Temporary Source and Data are removed
when the dialog closes. Repeated activations create separate prompts.

Use `ask` for a button `action`, `_ask` for a controller, formula or RPC. A string
`_ask="Proceed?"` accepts `_ask_title`, `_ask_if` and `_ask_onCancel`. A false
`_ask_if` skips the prompt and continues execution. A dictionary accepts `title`,
`msg`, `fields`, `_if` and legacy `askIf`; dictionary `_if` controls prompting.
The legacy `askIf` option by itself does **not** suppress the dialog when false;
its modifier options are not supported. Provider `_if` is evaluated after ask, as in
legacy. There is no fluent `.ask()` method.

Each field requires a unique simple `name`; optional `lbl` is its label. Supported
fields: HTML `input` or `textarea`, input types `text`, `number`, `date`,
`checkbox`, `email`, `password`, `url`, `tel`; options `default_value`, `required`,
`min`, `max`, `step`, `placeholder`. Current arguments supply initial values before
field defaults. The validity checks of the browser apply. Unsupported legacy widgets
or options raise an error; no general widget collection is implied.

### Publish to a parent or selected child

```javascript
gramlot.publish({topic: 'refresh', iframe: 'detail'}, {text: 'Hello'});
gramlot.publish({topic: 'refresh', parent: true}, {text: 'Reply'});
```

The `iframe` selector accepts its HTML ID or a local iframe Source reference passed
from Python. `parent` addresses the direct parent. The descriptor replaces the
first topic argument, as in legacy; there is no third routing argument.

Local subscribers run first, then forwarding uses `postMessage`, even for same-origin
frames. The receiving page activates its ordinary subscriptions and does not forward
again automatically. The target must be a connected, ready Gramlot page. Invalid or
unready targets fail before local delivery; no queue, replay or acknowledgement is
provided. A local callback error prevents forwarding. Reloading a child establishes
a new session; disposed/stale sessions are rejected.

The connection checks the exact parent/owned iframe window, expected origin and
session. Opaque sandbox/file origins use wildcard targetOrigin with the exact
window/session checks retained. Payloads cross as TYTX data. Live Source/DOM
objects remain local and are rejected by frame and RPC transport; the iframe
reference selects a local destination, not a remote live object.

Recursive `iframe:'*'`, unrelated windows, forms, server/user recipients and combined
remote `nodeId` routing are not supported. Unsupported descriptor keys fail explicitly.

<a id="gc-095-120"></a>
## 120 · Natural-language dates and periods

`parseDateExpression` uses the built-in Italian/English semantics of Toolbox
Python `parse_period`, with structured JavaScript results. It interprets complete
expressions; it does not format values, edit a widget or write a Data Bag.

```javascript
import {parseDateExpression} from '@gramlot/gramlot';

const context = {locale: 'it-IT', workdate: '2026-10-16'};
parseDateExpression('domani', context);
// {ok: true, kind: 'date', date: '2026-10-17'}
parseDateExpression('10 gennaio 2026', context);
// {ok: true, kind: 'date', date: '2026-01-10'}
parseDateExpression('mese scorso', context);
// {ok: true, kind: 'period', start: '2026-09-01', end: '2026-09-30'}
parseDateExpression('dicembre;marzo', context);
// {ok: true, kind: 'period', start: '2026-12-01', end: '2027-03-31'}
parseDateExpression('', context);
// {ok: true, kind: 'period', start: null, end: null}
parseDateExpression('31/02/2026', context);
// {ok: false, error: {code: 'INVALID_DATE', message: '...'}}
```

Use the named export from page JavaScript Logic, Node or Worker code. The normal
browser runtime also exports it. No Python Builder method, symbolic date editor
or calendar is introduced. The parser implementation has no dependencies, network,
DOM, clock or timezone conversion. The caller supplies the working date, checks
`ok`, distinguishes `date`/`period`, and owns conversion and any Data write.

### Context, dates and outcomes

- `workdate` is required: a Gregorian civil ISO string `YYYY-MM-DD`, years
  `0001`–`9999`. JavaScript `Date`/timestamp objects are not accepted.
- `locale` defaults to `it-IT`. Built-in languages are `it` and `en`; region and
  case variants and hyphen/underscore separators use Toolbox's interpretation.
  Italian defaults to DMY, English to MDY; English GB/AU/IE/NZ/IN use DMY.
  Other regions use their language's default, rather than loading another locale.
  Unsupported languages fail. Custom Python `locale_dir` packs have no JavaScript counterpart.
- English **keywords** are accepted in Italian too (`today`, `from`, `to`, etc.).
  Month and weekday names still belong to the selected language.
- `twoDigitYearAhead` retains the JS name but has Python `pivot_year` semantics:
  integer 0–99, default 20; inclusive window
  `[workdate.year + value - 100, workdate.year + value - 1]`.
  In 2026 the default is **1946–2045**: `46` means 1946, `45` means 2045.
- A single day returns `{ok:true, kind:'date', date}`; a period returns
  `{ok:true, kind:'period', start, end}`. Endpoints are inclusive civil ISO strings,
  with `null` for an open bound. An explicit range remains a period even if its
  endpoints are equal. TypeScript declarations expose this discriminated union.
- Empty/whitespace-only input means a fully open period, as in Toolbox. A field
  that requires a date must reject this result; the parser does not decide whether
  empty input should clear a field or remove a filter.

### Supported expressions

| Meaning | Italian | English |
| --- | --- | --- |
| Relative days | `oggi`, `ieri`, `domani`, `oggi-3` | `today`, `yesterday`, `tomorrow`, `today+7` |
| Weeks | `questa settimana`, `la settimana scorsa`, `settimana prossima+2` | `this week`, `last week`, `next week+2` |
| Months | `questo mese`, `il mese scorso`, `mese prossimo` | `this month`, `last month`, `next month` |
| Named month | `marzo`, `mar`, `m3`, `marzo 26` | `march`, `mar`, `m3`, `march 2026` |
| Last/next named month | `lo scorso ottobre`, `marzo prossimo` | `last october`, `next march` |
| Named date | `10 gennaio 2026`, `10 gennaio` | `january 10, 2026`, `10 january 2026` |
| Quarter | `q1`, `t1`, `1º trimestre`, `2024Q1` | `q1`, `1st quarter`, `Q1 2024` |
| Weekday | `lunedì`, `lun` | `monday`, `mon` |
| Year | `2026`, `26` | `2026`, `26` |
| Closed range | `dal gennaio al marzo`, `tra gennaio e marzo`, `oggi;domani` | `from january to march`, `between january and march` |
| Open range | `da oggi`, `a marzo`, `oggi;`, `;marzo` | `from today`, `to march` |
| Fully open | empty text, `sempre`, `senza periodo`, `-`, `;` | empty text, `always`, `no period`, `;` |

Weeks run Monday–Sunday. A weekday means that weekday in the reference week.
Offsets are integer days/weeks/months according to the keyword. A named month
without a year starts from the working year. `scorso`/`last` selects the latest
such month, including the current month; `prossimo`/`next` selects the first such
month from the current month, also including it.

Month and quarter endpoints are resolved together using Toolbox's year inference:
`dicembre;marzo` crosses into the next year, and `from december to march 2025`
with locale `en` and workdate in 2026 gives December 2024 through March 2025.
Toolbox can also adjust the year of explicitly named month endpoints against the
opposite bound: `da 2025 a gennaio 2024` gives January 2025. Use complete ISO dates
when endpoints must stay literal. Explicit complete-date ranges are preserved even
when reversed (`2026-10-17;2026-10-16`); consumers requiring an ordered interval
must validate `start <= end`. No automatic clipping or swapping of these bounds.

Numeric forms include exact ISO `2026-01-10`, locale-ordered `10/1/26`, `10-1-2026`
and compact six/eight-digit forms (`100126` in Italian). Separated numeric dates
follow Toolbox: mixed/repeated separators are accepted; if the parsed month is over
12 and the day is at most 12, the two are exchanged. Thus Italian `1/13/08` means
13 January 2008, while compact `011308` fails. Two-part dates such as `1/3` fail.
A bare two/four-digit number is a year period, not an unfinished day.

Input is lowercased and outer whitespace trimmed; commas are removed, allowing
`january 10, 2026` but not making a comma a range separator. Articles such as
`il`, `lo`, `la`, `the` are discarded within bounds; unknown words remain errors.
Accents and abbreviations must be in the language dictionary (`lunedì` or `lun`,
not `lun.`). There is no implicit accent removal or editor `/` prefix.

### Errors and migration

Failures return `{ok:false, error:{code, message}}`. Codes are `INVALID_CONTEXT`,
`INVALID_INPUT`, `UNRECOGNIZED_EXPRESSION`, `INVALID_DATE`, `INVALID_RANGE`.
Messages are English diagnostics; an application can map codes to localized text.
Impossible dates and arithmetic outside years 0001–9999 fail without rollover.
Times, timezones and partial input such as `oggi+` are not parsed.

The semantics follow Toolbox Python, including empty input. The forms `/oggi`,
`1/3`, `mar.`, `LUNEDI` and `2 trimestre` are not accepted; write `oggi`, a complete
numeric date, `mar`, `LUNEDÌ` and `2º trimestre` respectively.

The shipped tests run all **2,796 Toolbox reference cases**, applying its declared
legacy divergences unchanged. Differences retained at the API boundary:
Python returns `DatePeriod` with Python dates and raises exceptions; JS distinguishes
single dates from periods, returns civil ISO strings and structured errors. JS has
a default locale, a validated 0–99 pivot option and no filesystem locale loader.
This is not a claim that the two APIs have identical types or extension mechanisms.

<a id="gc-095-125"></a>
## 125 · Formatting values: numbers and temporal styles

The page instance exposes `gramlot.format(value, options)`. It supports finite
JavaScript numbers, TYTX Decimal objects, Date objects and null. Numeric values need an
explicit `pattern`. Locale and instant timezone come from the page unless the call
overrides them.
Use this method from page Logic or a controller expression:

```javascript
gramlot.format(12345.5, {pattern: '#,##0.00', locale: 'it-IT'})
// "12.345,50"
gramlot.format(-12.5, {pattern: '0.00;-;(0.00)', locale: 'it-IT'})
// "(12,50)"
gramlot.format(1234.5, {pattern: '0.00', locale: 'it-IT', mask: 'Totale: {} €'})
// "Totale: 1234,50 €"
gramlot.format(0, {pattern: '0.00;;(0.00)', locale: 'it-IT', mask: '{} €'})
// ""
gramlot.format(null) // ""
```

Supported numeric skeletons contain one or more integer `0` digits, or `#,##0`
for grouping, optionally followed by a decimal point and required `0` / optional
`#` fractional digits (required digits come first). Examples: `0000`, `0.00`,
`0.0##`, `#,##0.00`. Decimal rounding and locale symbols use
[Intl.NumberFormat](https://tc39.es/ecma402/#sec-intl.numberformat).
This is a bounded [Unicode pattern](https://unicode.org/reports/tr35/tr35-numbers.html#Number_Format_Patterns)
subset, not full LDML support.

Two sections mean **positive;negative**; zero uses the positive section. Three
mean **positive;zero;negative**, a Gramlot extension. The negative section can
have a minus prefix or enclosing parentheses; its digit settings come from the
positive section, as in Unicode. The zero section can be a numeric section, the
literal `-`, or empty. Empty suppresses zero and skips the mask. Negative zero
uses the zero case. Null always returns empty text without pattern or mask.

Mask composition follows formatting and substitutes each `{}` with the formatted
text. Other brace forms are not implemented. Legacy `%s` has no placeholder
meaning. In migrating legacy numeric formats, review two-section patterns: legacy
used positive/zero, whereas Gramlot uses Unicode positive/negative.

**Limits:** no implicit numeric pattern,
strings/booleans, BigInt, explicit temporal patterns, currency/percent/scientific patterns,
quoted pattern literals, arbitrary affixes, named/optional mask slots or brace
escaping. Unsupported inputs/options/patterns raise errors. String pattern shorthand uses the page context. JavaScript Number precision
still applies.

**Temporal values and dtype:** `dtype` overrides type inference. Without it,
Date inference follows TYTX: a non-midnight time on 1970-01-01 UTC is H, UTC
midnight on another day is D, otherwise DHZ. These are interpretation rules, not
a recovery of the original wire type. Explicit `dtype` disambiguates midnight
instants and date/time values on the epoch day. Numeric L/R/N require finite JS
numbers (L requires an integer); N/R also format finite TYTX Decimal values without converting them to Number. Decimal inference selects N. Strings are not implicitly parsed. Decimal output requires Intl exact decimal-string support; otherwise it raises explicitly.

D formats the UTC calendar fields without shifting them. H formats the UTC time
fields without shifting them. DHZ displays an instant in the explicit `timeZone`,
from the call or page context. If neither supplies it, formatting raises an error.
D/H are unaffected by `timeZone`. Styles `short` (the default), `medium`, `long`,
and `full` use Intl.DateTimeFormat: D includes the date, H the time, DHZ both.

```javascript
const value = new Date('2026-10-16T00:00:00Z');
gramlot.format(value, {dtype: 'D', locale: 'it-IT'})
// "16/10/26"
gramlot.format(value, {
    dtype: 'DHZ', pattern: 'short', locale: 'it-IT',
    timeZone: 'America/Los_Angeles'
})
// "15/10/26, 17:00"
gramlot.format(value, {dtype: 'D', pattern: 'long', locale: 'it-IT'})
// "16 ottobre 2026"
```

Locale data may affect punctuation and wording. Formatting leaves the Date
unchanged. Null still bypasses all formatting and masks. Invalid Dates, incompatible
dtypes and missing instant timezone raise errors. The old DH alias is not included
in this formatter; use DHZ for instants. Timezone-free datetimes and explicit date
patterns such as `dd/MM/yyyy` are not supported.

### Page context and declarative text

Declare the page context in Python:

```python
class Page(BasePage):
    locale = "it-IT"
    time_zone = "Europe/Rome"

    def main(self, root):
        root.dataSetter(destination_path="amount", value=1234.5)
        root.p("^amount", format="0.00", mask="Total: {} €")
```

Equivalent JavaScript Page metadata is `static locale = 'it-IT'` and
`static timeZone = 'Europe/Rome'`. The HTTP bootstrap and serverless Worker
carry these values to the browser instance as `gramlot.locale` and
`gramlot.timeZone`. A direct `new Gramlot({locale, timeZone, ...})` uses the
same context. Metadata is applied at startup; changing those properties later
does not automatically refresh existing text. For omitted page settings, startup uses the browser locale and timezone from
`Intl.DateTimeFormat().resolvedOptions()`. Precedence is call/node, then Page,
then browser. Each iframe has its own context; the host server timezone is not
used as an implicit default.

`gramlot.format(1234.5, '0.00')` uses the page locale. Explicit call `locale` or
`timeZone` takes precedence. D/H keep their civil fields; only DHZ shifts zones.

In live HTML text, Source `format` supplies `pattern` to that same method; node
`locale`, `timeZone` and `dtype` options override the page. Format and mask are
applied to the resolved scalar node text or `_text` before child elements, not
to a form control's editable `value`. Data, format, mask, locale, timezone and
dtype pointers participate in the reactive projection. Formatting does
not write the transformed string back into Data. These directives are consumed
and do not appear as DOM attributes. Unsupported `places` with active formatting
raises an error; express precision in the pattern.

A mask without `format` wraps ordinary text, preserving booleans/zero and
skipping null/empty text, with the same `{}` composition. This also works in
Python and JavaScript static HTML rendering. SVG text is not formatted.

Migration from legacy: replace mask `%s` with `{}`; `%s` stays literal text. A
legacy `format` pattern outside the supported patterns raises an error in the
browser: rewrite it. Attribute pointer suffixes and the expression-local `_F` are
described in [pointer templates](097-data-binding.md#gc-095-130).

### Static rendering

The Python and JavaScript static renderers apply the same attribute and style
rules, so `style_*`, `color` and the other shortcuts compose a `style` attribute in
both. Static rendering consumes `format` but does not apply it: the Intl formatter
runs only in the live renderer of the browser, and Python has no formatter. The
node text of a number differs: Python writes `str(value)`, so `1.0` stays `1.0`,
while JavaScript writes `String(value)`, which gives `1`. The live page always
writes the text in JavaScript; there `format` gives the same exact text from either
authoring language. `mask` only wraps the text: a static page that needs an exact
number text passes it as a string.
