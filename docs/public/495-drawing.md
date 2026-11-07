# Drawing and annotations

Document ID: **GC-495**.

<a id="gc-495-start"></a>
## Start here

Annotate an image or an empty surface using the shared drawingPane. Annotation records stay in the supplied Data Bag.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-drawing).

Initialize the annotations Bag before mounting. image supplies an optional image URL. The component observes and edits the original Bag; saving to a server is a separate application operation. Its shared menu offers selection, arrows, circles, freehand, text, color, pen width and deletion.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)

### Original annotation Bag

annotations must resolve to a Bag. The component subscribes to that original Bag and writes
shape records there. image changes the background without replacing the annotation store.
Without an image, coordinates use a 1000 by 1000 surface; an image uses its natural dimensions.
The toolbar is a shared menu, with tool state under _gramlot.drawing. Removing the component
releases event handlers and Bag subscriptions. Save annotations through the application's own
persistence contract; the drawing component does not perform a server save.

## Choose a component

- [`drawingPane`](#gc-495-drawingpane): SVG annotation editing over an original Data Bag.


<a id="gc-495-005"></a>
<a id="gc-495-010"></a>
Types: T text, B Boolean, L integer, R real, X structured value; other codes are TYTX. Binding: read = Data to widget; write = widget to Data; twoWay = both. A dash means no declared default/binding. None is a declared value. Constraints include enum, qualification, target and annotations. Tables describe component contracts; ordinary Source/CSS attributes are shared.


## Shared parameter contracts

Each widget below links only the shared contracts it supports. A shared name can have different types, defaults or bindings; separate rows preserve those differences.


<a id="gc-495-490"></a>
## Audio and drawing


<a id="gc-495-480"></a>
<a id="gc-495-drawingpane"></a>
### `drawingPane`

SVG annotation editing over an original Data Bag.

Collection: **drawing**. Browser element: `gramlot-drawing-pane`.

[Annotation Bags and drawing tools](495-drawing.md#gc-495-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-drawingpane).


**Data contract.** annotations reads and mutates the original Data Bag; image reads an optional background URL.


**Interaction and events.** Shared toolbar actions select, draw, edit text and delete shapes. Bag changes redraw the surface.


**Composition.** Composes a shared Source menu and an SVG drawing surface.


**Limits and lifecycle.** Requires an initialized annotation Bag. Coordinates follow image dimensions or a 1000 by 1000 empty surface. Disposal releases subscriptions; persistence belongs to the application.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `image` | T or None | None | read | — |
| `annotations` | X | — | read | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.
