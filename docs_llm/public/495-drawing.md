# Drawing and annotations

Document ID: **GC-495**.

<a id="gc-495-start"></a>
## Start here

Annotate an image or an empty surface using the shared drawingPane. Annotation records stay in the supplied Data Bag.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-drawing).

Initialize the annotations Bag before mounting. image supplies an optional image URL. The component observes and edits the original Bag; saving to a server is a separate application operation. Its shared menu offers selection, arrows, circles, freehand, text, color, pen width and deletion.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)


<a id="gc-495-005"></a>
<a id="gc-495-010"></a>

Ordinary Source/CSS attributes remain in Writing pages and Themes and CSS.
Pages inherit environment collections; Page.gramlots adds missing ones. Buttons are built in.
Contract JSON omits only undeclared keys: no default is not the same as null. dtype: T text, B Boolean, L integer, R real, X structured value; remaining codes are TYTX. binding: read = Data to widget, write = widget to Data, twoWay = both. nullable permits None; enum restricts values; annotation preserves type/regex constraints. Parameters sharing a table row have exactly the same contract. Child grammar: * allows arbitrary Source children; empty permits none. Parent None means no declared restriction.


<a id="gc-495-490"></a>
## Audio and drawing


<a id="gc-495-485"></a>
<a id="gc-495-drawingpane"></a>
### `drawingPane`

Collection: drawing. SVG annotation editing over an original Data Bag.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-drawingpane).


**Data contract.** annotations reads and mutates the Data Bag at its pointer address; image reads an optional background URL.


**Interaction and events.** Shared toolbar actions select, draw, edit text and delete shapes. Bag changes redraw the surface.


**Composition.** Composes a shared Source menu and an SVG drawing surface.


**Limits and lifecycle.** Requires an initialized annotation Bag. Coordinates follow image dimensions or a 1000 by 1000 empty surface. Disposal releases Data registrations; persistence belongs to the application.


| Parameters | Contract |
| --- | --- |
| `image` | `{"binding":"read","default":null,"dtype":"T","nullable":true}` |
| `annotations` | `{"binding":"read","dtype":"X"}` |

Child grammar: `*`; parent grammar: `None`.
