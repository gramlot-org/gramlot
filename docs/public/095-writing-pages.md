# Writing pages

Document ID: **GC-095**. Native 0.1.0 APIs; future capabilities remain explicitly deferred.

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

<a id="gc-095-020"></a>

## 020 · Deferred capabilities

Recipes, Data bindings, controllers, resolvers and shared components are outside
this native HTML Source-live increment. They are not available page APIs.

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


<a id="gc-095-035"></a>

## 035 · Changing an element type

To replace a live `div` with a `section`, delete its Source node and insert a new
`section` through the builder. Deletion releases the old DOM and owned resources;
insertion renders the new node. Choose the insertion position explicitly when
sibling order matters. In-place tag-only mutation is outside this increment's
live contract; do not use an extended BagNode.setValue tag argument. Ordinary
value and attribute updates continue through their existing Source methods.
