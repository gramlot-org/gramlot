# Writing pages

Document ID: **GC-095**. Native 0.1.0 APIs; future capabilities remain explicitly deferred.

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

<a id="gc-095-010"></a>

## 010 · From a page to the browser

Host returns bootstrap; `Gramlot` prepares/subscribes Data and Source; server runs
`main(root)` and sends typed SourceBag/TYTX; generic builder associates it; Gramlot
validates incoming Source before insertion; one insertion under Source `main`
triggers rendering. Later mutations use the same subscription. Native attribute
updates may retain elements; structural changes rebuild the subtree and clean up.

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
