# Vizabi

Document ID: **GC-485**.

The vizabi collection shows an animated bubble chart drawn by the Vizabi library.
This page answers **how do I show rows as moving bubbles over the years, and what
must my application provide for it?** The parameters are in the
[widget reference](345-widget-reference.md).

<a id="gc-485-start"></a>

## A bubble chart

```python
from genro_bag import Bag

def main(self, root):
    pane = root.div(height="500px")
    pane.dataSetter("vizabi", Bag(dict(
        entityField="country", timeField="year", xField="income",
        yField="life", sizeField="population", colorField="region",
        year=2000, playing=False, speed=300)))
    pane.vizabiBubble(storepath="world.rows", configuration="^vizabi",
                      libraryUrl="/assets/vizabi.js")
```

The page base of your environment already enables this collection; if it does not,
[enable it once](340-components-and-collections-guide.md#gc-340-050).

<a id="gc-485-005"></a>
<a id="gc-485-010"></a>
<a id="gc-485-445"></a>
<a id="gc-485-475"></a>
<a id="gc-485-vizabibubble"></a>

## What the chart needs

[vizabiBubble](345-widget-reference.md#gc-345-vizabibubble) is the only component of
the collection. It takes three things from you.

**The library.** `libraryUrl` is the address of a JavaScript module that provides
Vizabi and its bubble chart. Gramlot does not ship it: your host serves it. Without
it, the chart shows an error message instead of the bubbles.

**The rows.** `storepath` points to a Bag with one row per entity and year; by default
(`rowMode="attributes"`) the fields are attributes of the row nodes, `values` reads
row Bags instead. The entity is text, the year an integer, the x, y and size fields
are numbers (size not negative) and the color field is a text category. The field
name `name` is reserved for the entity.

**The configuration.** `configuration` is a Bag that says which field plays each
role (`entityField`, `timeField`, `xField`, `yField`, `sizeField`, `colorField`) and
holds the animation: `year` (an integer), `playing` (true or false) and `speed`
(milliseconds per step). The chart writes the current year, the playing state and the
fields it shows back into this Bag, and follows your changes to it: bind other
controls to it to drive the animation.

The chart follows changes of the rows and of the configuration. It is separate from
the [charts](480-charts.md) collection and never reads a database.
