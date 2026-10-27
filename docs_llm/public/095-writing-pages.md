# Writing pages

Document ID: **GC-095**.

Page structure: Source, the way to the browser, SVG, live Source changes, data exchange, the
application index, messages, dates, formatting. Data and bindings:
[Data binding and controllers](097-data-binding.md); endpoints: [Calling the server](098-server-calls.md);
server Source and lazy Data: [Remote content and lazy Data](099-remote-content.md); appearance:
[Themes and CSS](096-themes-and-css.md). Start with [Try Gramlot](025-try.md).

**Execution model.** Page/main and exposed methods run on the server (or the JS Worker); Logic in the
browser. Source = what to build; Data = values; bindings connect them to the DOM. Each server call
creates a fresh Page: its fields are not persistent state.

**Examples.** The gramlot-examples gallery shows these guides in Python and JavaScript, in families by
topic (HTML/SVG structure, binding, controllers, server calls, input components, containers):
[examples manual](https://gramlot-examples.readthedocs.io/en/latest/), hosted
[Python](https://gallery-py.gramlot.dev/) and [JavaScript](https://gallery-js.gramlot.dev/) galleries.
It runs without resource and identity systems: `js_requires` groups and `auth` allow/deny need a
server with them.

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

Python calls return real SourceBagNode objects; JS uses the generic builder handles. Text is literal, not
parsed HTML. HTML attributes work; `class_` escapes the keyword; the exported HTML5 collection's open
signatures accept any HTML attribute. Legacy style shortcuts (`color=`, `font_size=`, `margin_top=`,
`style_*`, `rounded=`) compose one `style` with `style='…'`, as static Builder `HtmlRenderer`; `_class` is
`class`; all react to Data ([GC-095 070](097-data-binding.md#gc-095-070)). A length carries its CSS unit
(`margin_top='4px'`), except in a few legacy sub-keys such as `rounded`; rule in [GC-096 040](096-themes-and-css.md#gc-096-040).

### HTML tags and Gramlot components

`input` and `html_button` declare browser HTML tags. `textbox` and `button`
declare Gramlot components with their own parameters and behavior. Select the
`inputs` collection to use `textbox`; command buttons are built in. Use the
`html_` prefix when an HTML tag's name would otherwise select a component.

Both HTML and components use the same renderer-owned Labelbox: `lbl="Name"`
adds a label, `lbl_position="L"` places it beside the content, and `box_*`
styles its surrounding box. For example, `pane.div(lbl="Summary")` can contain
a whole layout, not just a field. See [shared labels](105-components.md#gc-105-020).
Style keywords such as `color` and `padding` describe CSS independently from
HTML attributes such as `type`, `name` and `disabled`.

<a id="gc-095-010"></a>

## 010 · From a page to the browser

The server returns bootstrap; `Gramlot` prepares/subscribes Data and Source; server runs
`main(root)` and sends typed SourceBag/TYTX; generic builder associates it; Gramlot
validates incoming Source before insertion; one insertion under Source `main`
triggers rendering. Later mutations use the same subscription. Attribute updates may
retain elements; structural changes rebuild the subtree and clean up. The bootstrap
document holds a script that creates `PageBootstrap` with the page resources; in the
browser it writes the CSS links (theme, `Page.css` URLs, same-name `foo.css`), imports
the JS modules, creates `Gramlot`, registers named logic and starts the page
([GC-090 030](090-classes-and-hosts.md#gc-090-030)); each branch installs Data
declarations between validation and DOM ([lifecycle](097-data-binding.md#gc-095-080)).

Every page loads a theme before its CSS: Base unless server or page choose another
([GC-096 005](096-themes-and-css.md#gc-096-005)). Base = original spacing; Compact = overlay with
smaller headings, gaps, card padding and controls, loaded after Base with
`css = ("/themes/gramlot-compact/theme.css",)` (JS `static css = [...]`), best on a shared Page base
class. Application CSS can override theme rules. Color mode: `data-theme="light"`/`"dark"` on the
document root, else the system preference. No `root.css()` API.

<a id="gc-095-015"></a>

## 015 · Source built on the server

`main` builds the page on the server; `@source`/`registerSource(...)` declare more fragments,
`@endpoint`/`registerEndpoint(...)` endpoints; `remote` mounts a fragment as element content, from code
`gramlot.src.remoteSource(target, method, params)`. See [Remote content](099-remote-content.md) and
[Calling the server](098-server-calls.md).

<a id="gc-095-020"></a>

## 020 · Where to find the other capabilities

Data, pointers, formulas, controllers, named logic, bound controls, buttons:
[GC-097](097-data-binding.md); endpoints and `dataRpc`: [GC-098](098-server-calls.md); `remote` and
`dataRemote`: [GC-099](099-remote-content.md); input components, command buttons, containers:
[Components](105-components.md). Recipes, record/form management, stores, grids, trees and database
services are not provided; do not infer them from an HTML form or an endpoint-backed resolver.
[Excluded declarations](097-data-binding.md#gc-095-085).

<a id="gc-095-025"></a>

## 025 · SVG inside a page

`svg` enters the exported SVG collection, `html` returns to HTML (an SVG `foreignObject` with HTML
children):
`root.svg(viewBox="0 0 100 100", width=100, height=100).circle(cx=20, cy=20, r=10, stroke="red", stroke_width=2)`.
The same Source subscription handles SVG insertions, attribute changes (element preserved) and
removals; `stroke_width` → `stroke-width` (SVG attribute adaptation, not CSS). JS:
`root.svg({...}).circle({...})`. SVG presentation attributes accept `^`; null removes them
([GC-095 070](097-data-binding.md#gc-095-070)).

<a id="gc-095-030"></a>

## 030 · Freeze a rendered branch

`app.src.renderer.freeze(node)`/`unfreeze(node)` on a mounted SourceNode: idempotent flag, not a counter.
Source changes normally; the branch's DOM stays visible and its rendering events are discarded; other
branches keep updating synchronously in FIFO order. Unfreeze releases the branch and descendants and
rebuilds from current Source; under a frozen ancestor it only releases the flags. No event replay, timer
or Source rollback; rendering errors propagate. Old DOM records and their references/cleanup stay until
rebuild or renderer disposal; a deleted frozen root loses its old DOM at unfreeze without recreation; an
ancestor removed/rebuilt outside disposes normally; freeze/unfreeze need a mounted record. Runtime APIs,
not Python page events or SourceBag methods. Only structural rebuilding is suspended: built elements
still react to Data; a branch inserted under freeze installs Data at once, DOM and `_onBuilt` wait for
thaw ([lifecycle](097-data-binding.md#gc-095-080)).

<a id="gc-095-035"></a>

## 035 · Changing an element type

Replace a live `div` with a `section` by deleting its Source node and inserting a new `section` through
the builder (deletion releases DOM and owned resources; choose the insertion position when order
matters). Changing only the tag in place is not supported; no extended `BagNode.setValue` tag argument.

<a id="gc-095-095"></a>

## 095 · Sending and saving data: `gramlot.utl.inout`

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
  into `path` with exact types (dates, decimals). Cancellation rejects with `AbortError` without changing Data.
- `download(path, name, 'json' | 'xml')`: `Bag.toJson`, or `Bag.toXml` in one root
  element named after the last path segment; types become text.
Dates in the email `1990-05-02`, datetimes ISO. Email > 2000 characters (`mailto:`
limit) → error naming the length. Missing path or not a Bag →
`gramlot.utl.inout: no data Bag at '<path>'`. `restore` needs a user action. JSON/XML are
export only. Restore requires a typed Bag root and rejects plain objects, lists
and scalars without replacing the existing branch. Inline code needs `'unsafe-eval'` ([GC-090 §035](090-classes-and-hosts.md#gc-090-035));
strict CSP → call from `Logic`. `sendHttp` reaches what `connect-src` allows. Gallery lesson: *Data exchange*.

<a id="gc-095-110"></a>

## 110 · A reusable application index and an installable root

Block ID: **GC-095-110**.

Three classes separate these responsibilities: `FramePage`
provides a five-region frame, `IndexPage` adds navigation and retained page tabs,
and an application supplies its own region contents. The gallery is one such
application; the core does not depend on it.

`FramePage` always provides `center(pane)`. The optional `top(pane)`,
`bottom(pane)`, `left(pane)` and `right(pane)` hooks create their region only
when defined, including inherited implementations. Each hook receives a
contentPane and sets its dimensions, splitter/drawer attributes and contents.
An undefined outer region occupies no space and has no drawer.

For a Python application, put this in `pages/index.py`:

```python
from genro_bag import Bag
from gramlot import IndexPage


class Page(IndexPage):
    title = "My application"

    @property
    def navigation(self):
        navigation = Bag()
        navigation.set_item("work", Bag(), title="Work")
        navigation.set_item("work.hello", None, title="Hello", url="hello")
        return navigation

    def top(self, pane):
        pane.set_attr({"height": "42px"})
        pane.h1(self.title)

    def right(self, pane):
        pane.set_attr({"width": "280px", "splitter": True,
                       "drawer": "close", "drawer_label": "Tools"})
        pane.p("Application tools")
```

Its companion `pages/index.js` connects the standard browser behavior:

```javascript
export {IndexLogic as Logic} from '@gramlot/gramlot/page';
```

Create `pages/hello.py` as an ordinary Page. The navigation URL is passed to its
iframe unchanged. The same exact URL identifies the same tab, preserving its
Source, Data and iframe state. No separate application key is required and URLs
are not normalized. A node without a URL only groups children. A folder can
have both a URL and resolver-backed children: selecting its label opens its own
page; its expansion arrow loads its children.

Override `panel(pane, node)` to construct a selected page differently. It runs
on first opening; the default creates an iframe using `node.attr["url"]` and
the `title` attribute, falling back to the BagNode label for the caption. The
coordinator transports the selected node's attributes in a one-node Bag to
`index_panel`, which invokes the hook. The original navigation remains a Bag.

`IndexPage.left` declares the tree and `IndexPage.center` its tabContainer.
Call the corresponding superclass hook when adding content to either region.
`behavior(shell)` declares the standard startup controller. `datapath` defaults
to `index`; its Data contains `navigation`, `navigationSelection`, `active` and
`opened`. Active pages are identified by URL; opened records retain panel labels
and navigation paths. `shell_id` (JS `shellId`) defaults to `index`. For multiple
indexes in one document, give each shell a distinct ID and Data path. Relative
paths such as `.leftIndex` inherit the containing Source's datapath. The tree and
tabs use `.navigation`, `^.navigationSelection` and `^.active` in their own scope.
There is no tab-count or eviction policy.

The owning Source node retains the coordinator through its internal `indexContext`
attachment; Logic only supplies behavior. `IndexLogic.indexMount(node)` receives
the startup controller's Source node and mounts its parent shell, without a DOM
ID lookup or a Logic field. Subscriptions and pending entries are released through
the renderer's existing Source disposal mechanism. Each iframe page has its own
Gramlot, Source and Data. Detaching a containing panel moves DOM only: its Source,
Data scope, coordinator and iframe element are retained.

`mountIndexPage` also accepts `onLoad(url, status, error)`. Each new load emits
`loading`, followed once by `ready`, `error` or `cancelled`, including loads that
finish in a background tab. Closing a pending tab or disposing its index emits
`cancelled`; late replies are ignored, including after reopening the same URL.
Closing an already loaded tab does not emit another load outcome. `ready` reports
successful panel preparation, not completion of the iframe's own page resources.
A callback failure is reported separately without changing an outcome already sent.

Load outcomes do not select tabs. `onSelection(entries, active)` reports the current
selection, and the active entry's `loading` flag determines its indicator. Consumers
must not clear a current spinner merely because a different URL completed. During
index disposal, callbacks settle pending loads but must not update disposed UI.

The JavaScript equivalent uses `static navigation` (a Bag or a getter returning
one), `static datapath` and the same five region hooks. It exports IndexLogic as
Logic from its page module. Custom Logic delegates to the coordinator; Logic
classes themselves cannot inherit under the existing Logic contract.

The gallery builds one Bag level from the filesystem at each directory request.
Each directory has a NavigationResolver; a numbered `00-index.py` / `00-index.js`
gives it its own page URL. A descriptive `00-index.md` uses the gallery-owned
Markdown panel, with its first H1 as the title. The reusable resolver uses the ordinary RPC service and owns nested
resolver cancellation, without filesystem access in core. Discovery and URL
staging belong to the gallery and its host. Gallery themes, code, Inspector,
preferences and installation controls belong to its region hooks and browser
presentation. Arbitrary iframe documents do not inherit their shell's theme.


### Build a site with the gallery's structure

Use `IndexPage` for a navigation tree plus retained iframe tabs. Use `FramePage`
when the center is your own layout and you do not need that navigation/tab
coordinator. Both are ordinary Page base classes; region hooks belong to your
application and are the extension points.

| Region hook | A typical application supplies | Keep from IndexPage |
| --- | --- | --- |
| `top(pane)` | Branding, title, toolbar | No prescribed contents |
| `left(pane)` | Navigation width, logo, drawer presentation | Call `super().left(pane)` for the tree |
| `center(pane)` | Tab presentation | Call `super().center(pane)` for the retained tabs |
| `right(pane)` | Tools, details or a Code panel | No prescribed contents or automatic source viewer |
| `bottom(pane)` | Settings drawer or status | No prescribed contents |

Put the root Page above the pages it navigates to. A concrete numbered layout is:

```text
pages/
    index.py
    index.js
    01-work/
        00-index.py
        01-hello.py
```

`pages/index.py` is the entry point served at `/` (or at the application's mount).
`00-index.py` is the page describing a navigation directory; it is not a replacement
for the host's root `index.py`. Numbering sorts siblings and remains in the URL.
Use lowercase names with underscores inside names, such as `08-html_svg`.
Keep each nested directory in its public path.

In the root Page above, replace `navigation` with:

```python
    @property
    def navigation(self):
        navigation = Bag()
        children = Bag()
        children.set_item("hello", None, title="Hello", url="01-work/01-hello")
        navigation.set_item("work", children, title="Work", url="01-work/00-index")
        return navigation
```

The Bag label (`work`, `hello`) identifies a node within its parent. `title` is
what the tree and tab show; `url` identifies the page and the retained tab.
The folder has both children and a URL: its arrow expands the children, and its
caption opens its description. Do not add `00-index` again as a child.
For a small static menu, author this Bag directly. For generated navigation,
populate `title` from the target module's `Page.title`; the core does not import
page modules automatically to discover navigation captions.

Create `pages/01-work/00-index.py`:

```python
from gramlot import Page as BasePage


class Page(BasePage):
    title = "Work"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        page = root.main(padding="24px")
        page.h1(self.title)
        page.p("Choose a work page in the navigation tree.")
```

Create `pages/01-work/01-hello.py`:

```python
from gramlot import Page as BasePage


class Page(BasePage):
    title = "Hello"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        page = root.main(padding="24px")
        page.dataSetter("name", "Ada")
        page.h1(self.title)
        page.input(value="^name", live=True)
        page.p("^name", mask="Hello, {}")
```

Keep the root `index.js` re-export of `IndexLogic` shown above. The two child
pages need no Logic companion because their behavior is entirely declarative.
The center starts empty until a page is selected.
Select Hello, edit its name, visit Work, then select Hello again: the same iframe
is retained, so its Data and input stay unchanged. Reloading the browser document
starts a new instance; retained tabs are not cross-reload persistence.

### Configure navigation and drawers through Source

Add these hooks to the root Page to refine its navigation and bottom drawer:

```python
    def left(self, pane):
        super().left(pane)
        pane.set_attr({"width": "260px", "drawer_label": "Navigation"})
        pane.value.get_node("tree").set_attr({"autoCollapse": True})

    def bottom(self, pane):
        pane.set_attr({"height": "140px", "drawer": "close",
                       "drawer_label": "Settings", "padding": "12px"})
        pane.p("Put application settings here.")
```

Leave `center` inherited unless you need to customize it. If you override it,
keep the superclass tabContainer at `frame.center.tabs`; the standard coordinator
uses that Source structure. Region sizes, `splitter`, `drawer`, `drawer_label`,
`drawer_icon` and `drawer_minimize` are described in
[borderContainer, GC-105 §100](105-components.md).
Automatic Source/Data visibility updates are immediate. Activating a drawer
handle uses its transition (including native keyboard activation); splitter
resizing remains live. Do not simulate an operator click to initialize a drawer.

### Activate the collections and serve the pages

The shell needs the **layout** and **tree** collections. Add **inputs** when your
pages use widgets from it. Native HTML inputs in the example above need no inputs
collection. Select only the collections needed by each Page class; its remote Source methods
use that same selection, as described in [collection activation, GC-105 §035](105-components.md).
Select prepared descriptors on your IndexPage subclass:

```python
from gramlot.collections.layout import mygramlot as layout
from gramlot.collections.tree import mygramlot as tree

class Page(IndexPage):
    gramlots = [layout, tree]
```

Here `IndexPage` is the shell base described above. Select the required descriptors
on child Page classes too; an iframe is a separate page. The host resolves the
prepared dependency graph and exposes verified collection files in its bootstrap.
Do not create URL-only collection dictionaries or bundle unrelated runtime copies.
See [collection loading and resource ownership](340-components-and-collections-guide.md#gc-340-055)
for the preparation and bootstrap contract.

Navigation URLs are resolved by the iframe against the shell document URL. The
relative paths in this example work at `/` and at a mounted root such as `/app/`.
For another shell location, author the appropriate paths explicitly. `IndexPage`
passes URLs unchanged: it does not prepend `pages/`, rewrite short catalogue
keys or translate them to filesystem paths. The host must serve those exact
routes and their `.css` / Logic companions. For a static export, use the actual
nested `…/index.html` URLs produced by that exporter.

### Grow the tree with directory resolvers

A filesystem tree is application/host policy, not part of FramePage. To reproduce
the gallery convention, the server reads one directory level, orders files and
directories together by numeric filename, reads executable captions from
`Page.title`, and omits `00-index` from the returned children. It must keep requests
inside its configured pages root. Each returned node has `title` and, when
selectable, `url`; directory nodes also have `directory` and an unresolved value.

Expose that one-level reader through an `@endpoint` taking `directory` and
returning a Bag. In the root's building phase (`_onBuilt`), attach a
`NavigationResolver` to each root directory with `navigation.setResolver`:

```javascript
const resolver = new NavigationResolver({
    gramlot: this.page.src.renderer.binding.gramlot,
    method: 'navigation_section',
    directory: node.attr.directory,
    onError: error => state.setItem('navigationError', error.message),
});
navigation.setResolver(node.label, resolver);
```

This is a fragment inside the application's Logic initialization: `navigation` is
its navigation Bag, `state` is its index Data Bag and `node` is the directory node.
Import `NavigationResolver` from `@gramlot/gramlot`. Register cleanup on the
shell's disposal and call `resolver.abort()` for the installed roots. The resolver
wraps nested directory nodes returned by the endpoint, caches loaded levels and
aborts nested requests on cleanup. Expanding the arrow performs the request;
selecting the label only opens its URL. Initialize the resolvers before starting
the ordinary index coordinator. With custom Logic, delegate its `indexMount`
method to `IndexLogic.prototype.indexMount.call(this, node, params)` rather than
subclassing a Logic class.

### Own the iframe contents and optional panels

The inherited `panel(pane, node)` already creates the iframe. Override it only
when your application needs a different Source composition; for example:

```python
    def panel(self, pane, node):
        pane.iframe(src=node.attr["url"], title=node.attr["title"],
                    width="100%", height="100%", border=0)
```

Each child page has its own Page lifecycle, Source, Data and browser context.
Use <a href="#gc-095-115">frame publish</a> for explicit communication. A parent theme does
not automatically style an iframe; the child loads its own theme, and synchronized
appearance needs the application-owned message bridge demonstrated by the gallery.

A right-hand Code viewer, Inspector, automatic hiding of unused regions and
restoration of preferences are also gallery specializations. They are not added
by naming a region "Code". Build their contents through Source and keep their
state in Data; use the existing `mountIndexPage` selection/preparation callbacks
when coordinating them with the selected page. Keep the standard coordinator
as the owner of URL selection and retained tabs.

A descriptive `00-index.md` is likewise a navigation convention: the gallery
uses its first H1 for the title and renders it with its sanitized Markdown
formatter inside the selected panel. The core FileServer does not execute
Markdown as a Page. An application adopting this convention must explicitly
supply that reader and Markdown panel; otherwise use `00-index.py` as above.
See the gallery's
[filesystem and staging contract](https://github.com/gramlot-org/gramlot-examples/blob/main/docs/010-gallery.md#ge-010-310)
for the implemented reference. No dependency from core to the gallery is required.

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
Settings panel offers installation instructions and, when the browser supplies its
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
`nodeId="editor"` can also receive
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
// Development: a registered direct Gramlot child, including an opened window.
gramlot.publish({topic: 'refresh', pageId: childPageId}, {text: 'Hello'});
```

The `iframe` selector accepts its HTML ID or a local iframe Source reference passed
from Python. `parent` addresses the direct frame parent or opener. In the current
development implementation, `pageId` selects a registered direct Gramlot child,
including a popup. The descriptor replaces the
first topic argument, as in legacy; there is no third routing argument.

Local subscribers run first, then forwarding uses `postMessage`, even for same-origin
frames. The receiving page activates its ordinary subscriptions and does not forward
again automatically. The target must be a connected, ready Gramlot page. Invalid or
unready targets fail before local delivery; no queue, replay or acknowledgement is
provided. A local callback error prevents forwarding. Reloading a child establishes
a new session; disposed/stale sessions are rejected.

The common family connection checks the exact parent/owned iframe or registered
same-origin opener-linked popup, expected origin and
session. Opaque sandbox/file origins use wildcard targetOrigin with the exact
window/session checks retained. Payloads cross as TYTX data. Live Source/DOM
objects remain local and are rejected by frame and RPC transport; the iframe
reference selects a local destination, not a remote live object.

Each Gramlot manages its own direct children. Closing a page or removing a Source
iframe closes its registered descendants recursively, including their popup
windows. Ordinary non-Gramlot windows are excluded. The common family protocol
also carries binder and RPC traffic when a server WebSocket is configured;
family membership and publication do not require a WebSocket. Only the primary
opens a physical socket. Browser scheduling may delay detection of a destroyed
parent when its final close message is lost.

In the isolated Python/Uvicorn PageStore PoC, `server: true` sends a publication
through the shared WebSocket to the sender's PageStore. An optional `pageId`
selects another live PageStore of the same owner, including on another socket:

```javascript
gramlot.publish({topic: 'load_customer', server: true}, {pkey: 27});
gramlot.publish({topic: 'load_customer', server: true, pageId: otherPageId},
                {pkey: 27});
```

The server recipe declares `root.dataController(func="load_customer",
subscribe_load_customer=True)`; its Python method receives the Source node and
the named payload arguments. Declared parameters take precedence over payload
fields. A server publication returns a Promise resolving to "ok" when validated
and accepted, before executing its subscribers, or rejecting with RpcError when
acceptance is refused. There is no option to wait for completion. The controller
updates Data and binders carry the produced values back. This destination cannot combine with
parent/iframe/nodeId. Readiness and serializability are checked before local
publication; local subscribers still run before forwarding. There is no replay
or HTTP fallback. A rejected destination or invalid publication payload returns
an error for that message and leaves the shared channel open. Later subscriber
exceptions are logged on the server without a second response or channel closure;
controllers expose application outcomes in Data. The acknowledgement does not
imply completion, rollback or a database commit.
This is development behavior, not released adapter parity.

Recursive `iframe:'*'`, unrelated browser windows, forms, cross-owner/user recipients and combined
remote `nodeId` routing are not supported. Unsupported descriptor keys fail explicitly.

<a id="gc-095-120"></a>
## 120 · Natural-language dates and periods

`parseDateExpression` comes from `@genrojs/toolbox` and is re-exported by
`@gramlot/gramlot`. It uses the built-in Italian/English semantics of Toolbox
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


<a id="gc-095-155"></a>

## 155 · Automatic initial Data

Block ID: **GC-095-155**.

Place `foo_data.tytx` beside `foo.py` and/or `foo.js` to supply an optional initial Data Bag. The page needs no dataRemote or dataSetter declaration for this file. Its contents must decode to a Bag, preserving typed values, nested Bags and node attributes; ordinary JSON objects are not accepted.

The file is applied before Source installation, defaults and rendering. An explicit dataSetter can still write a value during installation; defaults fill missing values. Endpoints, dataRemote and later Data writes keep their existing behavior. No file means no automatic initialization. A malformed file fails startup rather than silently ignoring the dataset. Every page load gets a fresh Bag; client edits do not modify the file.

This convention supplies initial example/application data; it is not a dynamic query or persistence mechanism. Use default for small interface-state values and endpoints/resolvers for server-driven data. The file host reads the companion inside its pages directory and does not expose it as a public companion URL. The serverless exporter embeds it for the Worker, including file-origin exports.

The pilot is `02-binding/01-paths_and_updates/foo` in gramlot-examples (lesson b12), shared by Python, JavaScript and the executable documentation. Other lessons have not been migrated.
