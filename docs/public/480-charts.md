# Charts

Document ID: **GC-480**.

The charts collection draws rows that are already in the Data. This page helps you
**pick the chart element for what you want to show** and tells you which columns
each one reads. The complete list of parameters of each element is in the
[widget reference](345-widget-reference.md).

<a id="gc-480-start"></a>

## A first chart

```python
def main(self, root):
    pane = root.div(datapath="sales")
    pane.chartBar(storepath=".rows", rowMode="values",
                  captionField="month", measures="income,costs")
```

`sales.rows` holds one row per month. The chart draws one group of bars per
`month` and one bar for each measure listed in `measures`. Each chart type has its
own element, and its attributes name the columns it reads. A chart only draws: it
never totals or groups your rows, so prepare them upstream. Charts belong to the
standard collections, so every page already has them
([collections](340-components-and-collections-guide.md#gc-340-050)).

The rows live at `storepath`. `rowMode` says where a row keeps its fields:
`values` when each row node holds a Bag of fields, `attributes` (the default) when
the fields are attributes of the row node, as for a [grid](445-grid.md).

<a id="gc-480-005"></a>
<a id="gc-480-010"></a>

## Pick a chart by what you want to show

| You want to show | Use | The rows need |
| --- | --- | --- |
| Values compared across categories | [chartBar](#gc-480-chartbar), [chartHorizontalBar](#gc-480-charthorizontalbar) | a category, one or more measures |
| A trend along time or another ordered category | [chartLine](#gc-480-chartline), [chartArea](#gc-480-chartarea) | a category, one or more measures |
| The parts of a total, per category | [chartStackedBar](#gc-480-chartstackedbar), [chartStackedArea](#gc-480-chartstackedarea) | a category, one or more measures |
| The share of each category in one total | [chartPie](#gc-480-chartpie), [chartDonut](#gc-480-chartdonut) | a category, one measure |
| Relations and clusters | [chartScatter](#gc-480-chartscatter) | a horizontal position, one or more measures |
| A quantity shrinking through stages | [chartFunnel](#gc-480-chartfunnel) | a stage, one measure |
| Items compared on several measures | [chartRadar](#gc-480-chartradar), [chartParallel](#gc-480-chartparallel) | a name, several measures |
| A grid of two categories, coloured | [chartHeatmap](#gc-480-chartheatmap) | two categories, one measure |
| Flows between nodes | [chartSankey](#gc-480-chartsankey) | a source, a target, one measure |
| Prices over periods | [chartCandlestick](#gc-480-chartcandlestick) | a period, open, high, low, close |
| The spread of each group | [chartBoxplot](#gc-480-chartboxplot) | a group and its five statistics |
| A hierarchy by size | [chartTreemap](#gc-480-charttreemap), [chartSunburst](#gc-480-chartsunburst) | a nested Bag, one measure on the leaves |
| Values over two dimensions, in 3D | [chartBar3D](#gc-480-chartbar3d), [chartLine3D](#gc-480-chartline3d), [chartScatter3D](#gc-480-chartscatter3d), [chartSurface](#gc-480-chartsurface) | two dimensions, one or more measures |
| Territories coloured or raised by a value | [chartMap](#gc-480-chartmap), [chartMapBar3D](#gc-480-chartmapbar3d), [chartMap3D](#gc-480-chartmap3d) | a territory name, measures, a GeoJSON |
| Paths or shapes from coordinates | [chartLines3D](#gc-480-chartlines3d), [chartPolygons3D](#gc-480-chartpolygons3d) | a name, coordinates, measures |
| One number on a dial | [gauge](#gc-480-gauge) | a single value, no rows |
| A chart the user configures | [chartPane](#gc-480-chartpane) | any rows |

<a id="gc-480-640"></a>
<a id="gc-480-505"></a>
<a id="gc-480-chartbar"></a>
<a id="gc-480-510"></a>
<a id="gc-480-chartline"></a>
<a id="gc-480-515"></a>
<a id="gc-480-chartarea"></a>
<a id="gc-480-520"></a>
<a id="gc-480-chartstackedbar"></a>
<a id="gc-480-525"></a>
<a id="gc-480-chartstackedarea"></a>
<a id="gc-480-530"></a>
<a id="gc-480-charthorizontalbar"></a>

## Categories and trends

These charts take a category in `captionField` and a list of measures in
`measures`, comma separated. Each measure becomes one series with its own colour.

```python
form.chartLine(storepath=".rows", rowMode="values",
               captionField="day", measures="visits,orders")
form.chartStackedBar(storepath=".rows", rowMode="values",
                     captionField="region", measures="online,shop")
```

- [chartBar](345-widget-reference.md#gc-345-chartbar) draws vertical bars,
  [chartHorizontalBar](345-widget-reference.md#gc-345-charthorizontalbar)
  horizontal ones, which leave room for long category names.
- [chartLine](345-widget-reference.md#gc-345-chartline) and
  [chartArea](345-widget-reference.md#gc-345-chartarea) follow the category in row
  order or time order; the area fills the space under each line.
- [chartStackedBar](345-widget-reference.md#gc-345-chartstackedbar) and
  [chartStackedArea](345-widget-reference.md#gc-345-chartstackedarea) stack the
  measures, so each bar or column shows a total and its parts.

<a id="gc-480-535"></a>
<a id="gc-480-chartpie"></a>
<a id="gc-480-540"></a>
<a id="gc-480-chartdonut"></a>
<a id="gc-480-545"></a>
<a id="gc-480-chartscatter"></a>

## Shares and points

A pie takes one measure, in `measure`; a scatter takes a list, in `measures`.

```python
form.chartPie(storepath=".rows", rowMode="values",
              captionField="product", measure="revenue")
form.chartScatter(storepath=".rows", rowMode="values",
                  captionField="age", measures="income")
```

[chartPie](345-widget-reference.md#gc-345-chartpie) draws one slice per row, and
[chartDonut](345-widget-reference.md#gc-345-chartdonut) the same as a ring. Slice
values must not be negative.
[chartScatter](345-widget-reference.md#gc-345-chartscatter) places each row at
`captionField` across and at each measure up, one series of points per measure.

<a id="gc-480-595"></a>
<a id="gc-480-chartfunnel"></a>
<a id="gc-480-600"></a>
<a id="gc-480-chartradar"></a>
<a id="gc-480-605"></a>
<a id="gc-480-chartparallel"></a>
<a id="gc-480-610"></a>
<a id="gc-480-chartheatmap"></a>
<a id="gc-480-615"></a>
<a id="gc-480-chartsankey"></a>

## Stages, profiles and flows

```python
form.chartFunnel(storepath=".steps", rowMode="values",
                 captionField="stage", measure="people")
form.chartRadar(storepath=".players", rowMode="values",
                captionField="name", measures="speed,strength,skill")
form.chartSankey(storepath=".flows", rowMode="values",
                 captionField="source", secondCaptionField="target", measure="amount")
```

- [chartFunnel](345-widget-reference.md#gc-345-chartfunnel) draws one stage per
  row, in row order. A negative value is an error, an empty one is skipped.
- [chartRadar](345-widget-reference.md#gc-345-chartradar) gives each measure an
  axis and each row a polygon. A row with an empty measure is left out, because an
  empty corner would read as zero.
- [chartParallel](345-widget-reference.md#gc-345-chartparallel) gives each measure
  a vertical axis and each row a line across them.
- [chartHeatmap](345-widget-reference.md#gc-345-chartheatmap) colours the cell of
  `captionField` and `secondCaptionField` by `measure`. Supply one row per cell:
  two rows for the same cell are an error.
- [chartSankey](345-widget-reference.md#gc-345-chartsankey) draws a link from
  `captionField` to `secondCaptionField`, as wide as `measure`. Negative values
  and cycles are errors.

<a id="gc-480-620"></a>
<a id="gc-480-chartcandlestick"></a>
<a id="gc-480-625"></a>
<a id="gc-480-chartboxplot"></a>

## Prices and spreads

These two types read named measures, each with its own attribute.

```python
form.chartCandlestick(storepath=".prices", rowMode="values", captionField="day",
                      open="open", high="high", low="low", close="close")
form.chartBoxplot(storepath=".groups", rowMode="values", captionField="team",
                  min="min", q1="q1", median="median", q3="q3", max="max")
```

[chartCandlestick](345-widget-reference.md#gc-345-chartcandlestick) draws one
candle per row; a row with an empty price is skipped.
[chartBoxplot](345-widget-reference.md#gc-345-chartboxplot) draws one box per row
from five statistics you compute upstream: it does not accept raw data. A row whose
statistics decrease is an error.

<a id="gc-480-630"></a>
<a id="gc-480-charttreemap"></a>
<a id="gc-480-635"></a>
<a id="gc-480-chartsunburst"></a>

## Hierarchies

```python
form.chartTreemap(storepath=".budget", rowMode="attributes",
                  captionField="name", measure="amount")
```

[chartTreemap](345-widget-reference.md#gc-345-charttreemap) draws nested
rectangles, [chartSunburst](345-widget-reference.md#gc-345-chartsunburst) rings of
sectors. Both read a nested Bag with `rowMode="attributes"`: `captionField` names
the attribute that labels each node, and only the leaves carry the measure. A
parent is the sum of its children, so a parent with its own measure is an error.

<a id="gc-480-550"></a>
<a id="gc-480-chartbar3d"></a>
<a id="gc-480-555"></a>
<a id="gc-480-chartline3d"></a>
<a id="gc-480-560"></a>
<a id="gc-480-chartscatter3d"></a>
<a id="gc-480-565"></a>
<a id="gc-480-chartsurface"></a>

## Two dimensions in 3D

These types take a second dimension in `secondCaptionField`; it must differ from
`captionField`. The measures give the height.

```python
form.chartBar3D(storepath=".rows", rowMode="values", captionField="year",
                secondCaptionField="region", measures="sales")
```

[chartBar3D](345-widget-reference.md#gc-345-chartbar3d) raises columns,
[chartLine3D](345-widget-reference.md#gc-345-chartline3d) draws lines and
[chartScatter3D](345-widget-reference.md#gc-345-chartscatter3d) points on the grid
of the two dimensions. [chartSurface](345-widget-reference.md#gc-345-chartsurface)
draws one surface per measure over two numeric or date dimensions; each pair of
coordinates appears once.

<a id="gc-480-570"></a>
<a id="gc-480-chartmap"></a>
<a id="gc-480-575"></a>
<a id="gc-480-chartmapbar3d"></a>
<a id="gc-480-580"></a>
<a id="gc-480-chartmap3d"></a>
<a id="gc-480-585"></a>
<a id="gc-480-chartlines3d"></a>
<a id="gc-480-590"></a>
<a id="gc-480-chartpolygons3d"></a>
<a id="gc-480-220"></a>
<a id="gc-480-shared-value"></a>
<a id="gc-480-465"></a>
<a id="gc-480-chartgeojson"></a>

## Maps

A map needs the territories, as a GeoJSON in `geoJSON`, and one row per territory.
`captionField` must match the `name` property of a GeoJSON feature.

```python
form.chartMap(storepath=".rows", rowMode="values", captionField="region",
              mapValueField="sales", geoJSON="^.regions",
              selectedTerritory="^.chosen")
```

- [chartMap](345-widget-reference.md#gc-345-chartmap) colours each territory by
  `mapValueField`; `mapLabelField` adds a text on it. A click writes the name of the
  territory to `selectedTerritory`.
- [chartMapBar3D](345-widget-reference.md#gc-345-chartmapbar3d) raises one column per
  measure on each territory; `mapBarScale` starts them from `zero` or from the data
  range (`extent`). [chartMap3D](345-widget-reference.md#gc-345-chartmap3d) draws one
  3D map per measure.
- [chartLines3D](345-widget-reference.md#gc-345-chartlines3d) and
  [chartPolygons3D](345-widget-reference.md#gc-345-chartpolygons3d) read their
  coordinates from a column of each row, named in `geometryField`.
- [chartGeoJSON](345-widget-reference.md#gc-345-chartgeojson) is the field where the
  user loads a GeoJSON; its `value` holds the feature collection, or null.

A territory without a row stays empty: it is not drawn as zero. The GeoJSON accepts
named Polygon and MultiPolygon features only.

<a id="gc-480-445"></a>
<a id="gc-480-450"></a>
<a id="gc-480-chartpane"></a>
<a id="gc-480-460"></a>
<a id="gc-480-chartfields"></a>
<a id="gc-480-470"></a>
<a id="gc-480-charttimeline"></a>

## A chart the user configures

```python
def main(self, root):
    pane = root.div(datapath="sales")
    pane.chartPane(storepath=".rows", configpath=".chart", rowMode="values")
```

[chartPane](345-widget-reference.md#gc-345-chartpane) puts a chart next to a
settings drawer, opened by the gear button. The user picks the chart type, the
engine, the columns and the measures; every choice is kept in the Bag at
`configpath`, so it survives a redraw. `configDefaults` fills that Bag the first
time. With `gridId`, the chart shows only the rows that pass the filter of that
grid.

When the user picks a date column, the pane shows playback controls. They step
through the rows period by period (`timeStep`: a day, a month, a year…); a period
without rows keeps the previous picture or shows an empty one (`timeEmpty`).
Playback selects rows, it never totals them.

The pane builds two helpers you do not place yourself:
[chartFields](345-widget-reference.md#gc-345-chartfields) lists the columns of the
rows for the settings, and
[chartTimeline](345-widget-reference.md#gc-345-charttimeline) prepares the periods
for playback.

<a id="gc-480-455"></a>
<a id="gc-480-chartview"></a>

## A type chosen at run time

```python
form.chartView(storepath=".rows", rowMode="values", chartType="^.type",
               captionField="month", valueFields="income,costs", engine="echarts")
```

[chartView](345-widget-reference.md#gc-345-chartview) is the element behind every
chart type: `chartType` names the type and `valueFields` the measures. Use it when
the type comes from the Data, as chartPane does; otherwise prefer the element of
the type.

`engine` chooses the library that draws: `echarts` (the default) draws every type,
`plotly` most two-dimensional types plus
`chartLine3D`, `chartScatter3D`, `chartSurface` and `chartMap`, `vega` bars, lines and pies, `uplot` lines with a
numeric horizontal axis. Asking an engine for a type it cannot draw shows an error
and keeps the configuration.

<a id="gc-480-500"></a>
<a id="gc-480-gauge"></a>

## One number on a dial

```python
form.gauge("^.cpu_load", min=0, max=100, mask="{} %",
           thresholds="65:#e6a23c,85:#c23531", presentation="ring", caption="CPU")
```

[gauge](345-widget-reference.md#gc-345-gauge) shows the value of its node: here the
Data at `cpu_load`. `presentation` is `needle` (the default), `ring` or `arc`.
`mask` sets the text, with `{}` for the value rounded to two decimals.
`thresholds` lists ascending `value:colour` bands. A value outside `min` and `max`
stops at the edge of the dial while the text shows the real number. An empty value
shows "No value", never zero. The gauge writes nothing back.

## When a chart is not drawn

A chart that cannot draw always says why. In its place it shows an icon, one line
and More info. A red icon is an error: a required column is missing, the data
break a rule of the type, or the type is unknown. A grey icon means there are no
rows; More info tells where the rows were expected (`storepath`, the grid filter,
the playback period). Measures in excess are an error too, never silently dropped.
