# Drawing and annotations

Document ID: **GC-495**.

The drawing collection lets the user draw arrows, circles, freehand lines and text
over an image or a blank sheet. This page answers **how do I let users annotate an
image, and where do their drawings end up?** The parameters are in the
[widget reference](345-widget-reference.md).

<a id="gc-495-start"></a>

## An annotated image

```python
from genro_bag import Bag

def main(self, root):
    pane = root.div(datapath="drawing", height="360px")
    pane.dataSetter(".annotations", Bag())
    pane.drawingPane(annotations="^.annotations", image="^.photo")
```

The pane shows a toolbar beside the drawing surface, with tools to select, draw,
make arrows, circles and text, a color, a pen size and Delete. Every shape the user
draws is written into the Bag at `drawing.annotations`. The page base of your
environment already enables this collection; if it does not,
[enable it once](340-components-and-collections-guide.md#gc-340-050).

<a id="gc-495-005"></a>
<a id="gc-495-010"></a>
<a id="gc-495-490"></a>
<a id="gc-495-485"></a>
<a id="gc-495-drawingpane"></a>

## The annotations and the image

[drawingPane](345-widget-reference.md#gc-345-drawingpane) is the only component of
the collection. It has two parameters.

**`annotations`** must point to a Bag that already exists when the pane appears:
create it first, as in the example. The pane edits that Bag directly, one node per
shape, and redraws whenever it changes, so you can also add or remove shapes from
code. Each shape is a Bag with its `type` (`arrow`, `circle`, `freehand` or `text`),
its coordinates, its `color` and its pen `width`.

**`image`** is the address of the background picture. Without it the surface
measures 1000 by 1000; with it, coordinates follow the image's own pixel size.
Changing the image keeps the annotations.

The pane never saves anything: to keep the drawings, save the annotations Bag the way
your application saves its other Data.
