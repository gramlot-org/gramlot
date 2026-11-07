# Charts

Document ID: **GC-480**.

<a id="gc-480-start"></a>
## Start here

Configure a chart over an existing Data Bag; engines load on demand.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-charts).

Supply rows and a configuration Bag in Data. chartPane composes the shared controls; chartView renders supported types using ECharts, Plotly, Vega or uPlot; one element per chart type, such as chartCandlestick, declares its columns as attributes. Temporal playback selects prepared rows; it does not calculate business aggregates. Map territories must match GeoJSON names. Geographic 3D bars are ECharts-only.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)

### Data and configuration

Keep the original rows at storepath and configuration at configpath. Attribute rows and value rows
use their explicit rowMode. Bind selected measures, colors and axes through the configuration Bag.
A gridId links the chart to an existing grid view, so filtering remains the grid's responsibility.

### Engines and time

Only supported types are offered. uPlot requires numeric X values. Engine changes recreate the
external engine, not the Data. Playback uses prepared calendar snapshots with stable domains;
previous and empty policies distinguish missing periods. Disposal stops playback and subscriptions.

### Geography

GeoJSON requires named Polygon/MultiPolygon features. The host performs matching and aggregation.
Missing territories are not zero values. ECharts geographic bars offer zero or explicitly truncated
extent baselines; their invisible range reference is a documented renderer-only exception.

### One element per chart type

Each chart type has its own element: chartBar, chartLine, chartPie, chartFunnel, chartCandlestick
and the others listed below. The element is chartView with a fixed chartType. Its attributes are the
columns the type reads. A fixed measure is its own attribute: chartCandlestick takes open, high, low
and close; chartBoxplot takes min, q1, median, q3 and max; the types with one measure, such as
chartPie, chartFunnel or chartTreemap, take measure. A type that reads a list of measures takes
measures, comma separated. The Python and JavaScript Builders reject the element without a required
attribute. A misspelt attribute is accepted by the Builders, because every element also accepts
presentation attributes: the missing column then shows the diagnosis described below. chartView with
chartType and valueFields remains for a type chosen at run time, as chartPane does.

[Code for this composition is in the appendix](465-widget-examples.md#gc-465-setup-charts).

### The syntax of a chart type

Each chart type declares its syntax: the columns it reads, the chartView parameter of each column,
how many it takes, whether it is required and whether it must be numeric. One check compares the
parameters with this syntax before any engine reads the data. Measures in excess are an error, never
dropped. A missing required column, a repeated code and a second dimension equal to the first are
errors. A chart that takes a list of measures needs at least one. A parameter the type does not
declare is not read: a configuration shared by several types keeps the values of the others.

### When a chart is not drawn

A chart that is not drawn always says why. In its place it shows an icon, one line and More info.
The red icon marks an error: the configuration does not match the syntax, the data break a rule of
the type, or the chart type is unknown. The grey icon informs: there are no rows to draw. More info
opens a dialog. For a syntax error it lists what is wrong, what was expected, what was received and
how to fix it, then what the type shows and the columns it reads. For no data it says where the rows
come from: storepath, the filter of the grid in gridId, the date field of the animation. The notice
follows the --gramlot-* theme colours; the drawn chart area stays white.

### Fixed measures in chartPane

The configurator shows the sections a type declares. A type with fixed measures shows one select per
measure (Open, High, Low, Close; the five boxplot statistics; Measure for the one-measure types). The
choice is stored in configpath.measureRoles and shared by the types that declare the same measure. An
empty measure takes the numeric column at its position. valueFields is read from these selects for
the types with fixed measures and from the measure toggles for the others, so changing type never
sends measures in excess.

### Rules of the data for each type

- Funnel: one measure, drawn in row order; a negative value is an error, an empty one is skipped.
- Radar: one axis per measure, one polygon per row. A row with an empty measure is left out, because
  an empty vertex would read as zero. The axis runs from 0, or the lowest value, to the highest value;
  min and max in the seriesOptions of a measure fix them.
- Parallel coordinates: one vertical axis per measure, one line per row; min and max in seriesOptions
  fix an axis.
- Heatmap: captionField and secondCaptionField index the cells. Two rows for the same cell are an
  error: prepare one row per pair upstream.
- Sankey: links go from captionField to secondCaptionField. A negative value is an error; a cycle is
  an error that names its nodes.
- Candlestick: one candle per row; a row with an empty price is skipped. upColor and downColor in the
  seriesOptions of the open measure set the colours.
- Boxplot: the host supplies the five statistics; raw data is not accepted. Equal values are valid; a
  row whose values decrease is an error naming the row.
- Treemap and sunburst: a nested Bag with rowMode attributes. A node with children is a parent, its
  value is the sum of its children, so a parent carrying the measure is an error. A negative leaf is
  an error, an empty leaf is skipped. Each top-level node takes one palette colour.

Only the ECharts engine draws these nine types.

### Gauge

gauge shows one number: the value of its node, a Data pointer such as ^.cpu.load. min and max set the
range. mask sets the text, with {} for the number rounded to two decimals. thresholds lists ascending
bands as value:colour pairs, for example 65:#e6a23c,85:#c23531; the band colours the needle dial, the
ring or the arc. presentation is needle, ring or arc; caption is a label under the value. An empty
value shows the information notice No value, never zero. The gauge follows the --gramlot-* theme
colours and writes nothing back.

## Choose a component

- [`chartPane`](#gc-480-chartpane): Shared chart configuration, rendering surface and temporal playback over Data Bags.
- [`chartView`](#gc-480-chartview): Engine adapter rendering the original rows and observing configuration and grid filters.
- [`chartFields`](#gc-480-chartfields): Store field discovery for the shared chart configuration controls.
- [`chartGeoJSON`](#gc-480-chartgeojson): Validated GeoJSON input and geographic data summary.
- [`chartTimeline`](#gc-480-charttimeline): Prepared calendar snapshots and playback bounds from the original store.
- [`gauge`](#gc-480-gauge): One value of the node on a needle dial, a progress ring or a half-circle arc.
- [`chartBar`](#gc-480-chartbar): Compares values across categories with vertical bars. chartView with chartType 'bar'.
- [`chartLine`](#gc-480-chartline): Shows how values change along an ordered category, such as time. chartView with chartType 'line'.
- [`chartArea`](#gc-480-chartarea): Shows how values change along an ordered category, filling the area under each line. chartView with chartType 'area'.
- [`chartStackedBar`](#gc-480-chartstackedbar): Shows the parts of a total for each category, with the measures stacked in one bar. chartView with chartType 'stackedBar'.
- [`chartStackedArea`](#gc-480-chartstackedarea): Shows the parts of a total along an ordered category, with the areas stacked. chartView with chartType 'stackedArea'.
- [`chartHorizontalBar`](#gc-480-charthorizontalbar): Compares values across categories with horizontal bars; suited to long category names. chartView with chartType 'horizontalBar'.
- [`chartPie`](#gc-480-chartpie): Shows the share of each category in a total. chartView with chartType 'pie'.
- [`chartDonut`](#gc-480-chartdonut): Shows the share of each category in a total, as a ring. chartView with chartType 'donut'.
- [`chartScatter`](#gc-480-chartscatter): Shows each row as a point, to reveal relations and clusters. chartView with chartType 'scatter'.
- [`chartBar3D`](#gc-480-chartbar3d): Shows a value for each pair of two dimensions as 3D columns. chartView with chartType 'bar3D'.
- [`chartLine3D`](#gc-480-chartline3d): Shows values along two dimensions as lines in 3D space. chartView with chartType 'line3D'.
- [`chartScatter3D`](#gc-480-chartscatter3d): Shows each row as a point in 3D space. chartView with chartType 'scatter3D'.
- [`chartSurface`](#gc-480-chartsurface): Shows a measured surface over a grid of two numeric dimensions. chartView with chartType 'surface'.
- [`chartMap`](#gc-480-chartmap): Colours each territory of a GeoJSON map by one measure. chartView with chartType 'map'.
- [`chartMapBar3D`](#gc-480-chartmapbar3d): Raises 3D columns on the territories of a GeoJSON map. chartView with chartType 'mapBar3D'.
- [`chartMap3D`](#gc-480-chartmap3d): Draws the territories of a GeoJSON map in 3D, one map per measure. chartView with chartType 'map3D'.
- [`chartLines3D`](#gc-480-chartlines3d): Draws paths of coordinates on a 3D map. chartView with chartType 'lines3D'.
- [`chartPolygons3D`](#gc-480-chartpolygons3d): Draws polygons of coordinates as 3D shapes. chartView with chartType 'polygons3D'.
- [`chartFunnel`](#gc-480-chartfunnel): Shows how a quantity shrinks through ordered stages. chartView with chartType 'funnel'.
- [`chartRadar`](#gc-480-chartradar): Compares items on several measures; each measure is an axis, each row a polygon. chartView with chartType 'radar'.
- [`chartParallel`](#gc-480-chartparallel): Compares rows on several measures; each measure is a vertical axis, each row a line across them. chartView with chartType 'parallel'.
- [`chartHeatmap`](#gc-480-chartheatmap): Colours each cell of a grid of two categories by one measure. chartView with chartType 'heatmap'.
- [`chartSankey`](#gc-480-chartsankey): Shows flows between nodes; the width of each link is its value. chartView with chartType 'sankey'.
- [`chartCandlestick`](#gc-480-chartcandlestick): Shows the open, high, low and close of each period, as used for prices. chartView with chartType 'candlestick'.
- [`chartBoxplot`](#gc-480-chartboxplot): Shows the spread of each group with five statistics: minimum, quartiles, median and maximum. chartView with chartType 'boxplot'.
- [`chartTreemap`](#gc-480-charttreemap): Shows a hierarchy as nested rectangles whose area is the value. chartView with chartType 'treemap'.
- [`chartSunburst`](#gc-480-chartsunburst): Shows a hierarchy as rings; the angle of each sector is the value. chartView with chartType 'sunburst'.


<a id="gc-480-005"></a>
<a id="gc-480-010"></a>
Types: T text, B Boolean, L integer, R real, X structured value; other codes are TYTX. Binding: read = Data to widget; write = widget to Data; twoWay = both. A dash means no declared default/binding. None is a declared value. Constraints include enum, qualification, target and annotations. Tables describe component contracts; ordinary Source/CSS attributes are shared.


## Shared parameter contracts

Each widget below links only the shared contracts it supports. A shared name can have different types, defaults or bindings; separate rows preserve those differences.


<a id="gc-480-220"></a>
<a id="gc-480-shared-value"></a>
## Values and bindings

The value type and writeback behavior depend on the control. Use a Data pointer for binding; see [Data binding](097-data-binding.md).

Applies to: [chartGeoJSON](#gc-480-chartgeojson).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `value` | X or None | None | twoWay | — | All listed above |

<a id="gc-480-445"></a>
## Charts


<a id="gc-480-450"></a>
<a id="gc-480-chartpane"></a>
### `chartPane`

Shared chart configuration, rendering surface and temporal playback over Data Bags.

Collection: **charts**. Browser element: `gramlot-chart-pane`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartpane).


**Data contract.** storepath and configpath identify original Data Bags. rowMode selects attributes or values.


**Interaction and events.** Shared settings, playback controls and engines retain configuration in Data.


**Composition.** Composes the shared frame and chart controls.


**Limits and lifecycle.** Business aggregation stays upstream; unsupported types are not emulated.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `configDefaults` | X or None | — | — | — |
| `storepath` | T | — | — | — |
| `configpath` | T | — | — | — |
| `rowMode` | T | 'attributes' | — | — |
| `gridId` | T or None | — | — | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-455"></a>
<a id="gc-480-chartview"></a>
### `chartView`

Engine adapter rendering the original rows and observing configuration and grid filters.

Collection: **charts**. Browser element: `gramlot-chart-view`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartview).


**Data contract.** Reads store and bound chart configuration; selectedTerritory writes the chosen name.


**Interaction and events.** Observes rows and grid filtering, updates the engine and releases it on removal.


**Composition.** Rendering surface composed by chartPane.


**Limits and lifecycle.** Numeric X is required by uPlot; mapBar3D is ECharts-only.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `chartType` | T | — | read | — |
| `captionField` | T | — | read | — |
| `valueFields` | T or None | — | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-460"></a>
<a id="gc-480-chartfields"></a>
### `chartFields`

Store field discovery for the shared chart configuration controls.

Collection: **charts**. Browser element: `gramlot-chart-fields`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartfields).


**Data contract.** Reads store metadata and writes available chart fields to configuration.


**Interaction and events.** Rebuilds field choices when the original Bag changes.


**Composition.** Internal shared chart settings component.


**Limits and lifecycle.** Does not query a database or infer business aggregates.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `timeFieldId` | T | — | — | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `configpath` | T | — | — | — |
| `categoryId` | T | — | — | — |
| `mapMeasureId` | T | — | — | — |
| `mapLabelId` | T | — | — | — |
| `secondCategoryId` | T | — | — | — |
| `geometryId` | T | — | — | — |
| `measureMenuId` | T | — | — | — |
| `measureRoleIds` | T | — | — | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-465"></a>
<a id="gc-480-chartgeojson"></a>
### `chartGeoJSON`

Validated GeoJSON input and geographic data summary.

Collection: **charts**. Browser element: `gramlot-chart-geo-json`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartgeojson).


**Data contract.** value binds a plain GeoJSON feature collection or null.


**Interaction and events.** Validates supplied geography and displays its summary.


**Composition.** Shared geography input for chart configuration.


**Limits and lifecycle.** Named Polygon/MultiPolygon features only; host owns territorial matching.

Shared contracts: [Values and bindings](#gc-480-shared-value).

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-470"></a>
<a id="gc-480-charttimeline"></a>
### `chartTimeline`

Prepared calendar snapshots and playback bounds from the original store.

Collection: **charts**. Browser element: `gramlot-chart-timeline`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-charttimeline).


**Data contract.** Reads store/time parameters and writes timeline state under configpath.


**Interaction and events.** Tracks bounds and prepared snapshots; removal releases observation.


**Composition.** Used by chartPane with its playback controls.


**Limits and lifecycle.** No business aggregation; calendar periods and empty policy are explicit.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `configpath` | T | — | — | — |
| `timeField` | T | — | read | — |
| `timeStep` | T | — | read | — |
| `timeIndex` | R | — | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-500"></a>
<a id="gc-480-gauge"></a>
### `gauge`

One value of the node on a needle dial, a progress ring or a half-circle arc.

Collection: **charts**. Browser element: `gramlot-gauge`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-gauge).


**Data contract.** The node value is the single value, a Data pointer with optional ?attr. min, max, mask, thresholds, presentation and caption read Data. Nothing is written.


**Interaction and events.** Redraws when the value or a parameter changes and follows the light or dark theme; removal releases the engine.


**Composition.** Leaf rendering surface; no children.


**Limits and lifecycle.** One numeric value; an empty value shows the information notice No value, never zero. Errors show an error notice with More info. Values outside min and max are clamped on the dial, the text shows the real value. Threshold colors are names or hex codes.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `min` | R | 0 | read | — |
| `max` | R | 100 | read | — |
| `mask` | T | '{}' | read | — |
| `thresholds` | T or None | '' | read | — |
| `presentation` | T | 'needle' | read | — |
| `caption` | T or None | '' | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-640"></a>
## Chart types


<a id="gc-480-505"></a>
<a id="gc-480-chartbar"></a>
### `chartBar`

Compares values across categories with vertical bars. chartView with chartType 'bar'.

Collection: **charts**. Browser element: `gramlot-chart-bar`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartbar).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-510"></a>
<a id="gc-480-chartline"></a>
### `chartLine`

Shows how values change along an ordered category, such as time. chartView with chartType 'line'.

Collection: **charts**. Browser element: `gramlot-chart-line`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartline).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-515"></a>
<a id="gc-480-chartarea"></a>
### `chartArea`

Shows how values change along an ordered category, filling the area under each line. chartView with chartType 'area'.

Collection: **charts**. Browser element: `gramlot-chart-area`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartarea).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-520"></a>
<a id="gc-480-chartstackedbar"></a>
### `chartStackedBar`

Shows the parts of a total for each category, with the measures stacked in one bar. chartView with chartType 'stackedBar'.

Collection: **charts**. Browser element: `gramlot-chart-stacked-bar`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartstackedbar).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-525"></a>
<a id="gc-480-chartstackedarea"></a>
### `chartStackedArea`

Shows the parts of a total along an ordered category, with the areas stacked. chartView with chartType 'stackedArea'.

Collection: **charts**. Browser element: `gramlot-chart-stacked-area`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartstackedarea).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-530"></a>
<a id="gc-480-charthorizontalbar"></a>
### `chartHorizontalBar`

Compares values across categories with horizontal bars; suited to long category names. chartView with chartType 'horizontalBar'.

Collection: **charts**. Browser element: `gramlot-chart-horizontal-bar`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-charthorizontalbar).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-535"></a>
<a id="gc-480-chartpie"></a>
### `chartPie`

Shows the share of each category in a total. chartView with chartType 'pie'.

Collection: **charts**. Browser element: `gramlot-chart-pie`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartpie).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measure` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-540"></a>
<a id="gc-480-chartdonut"></a>
### `chartDonut`

Shows the share of each category in a total, as a ring. chartView with chartType 'donut'.

Collection: **charts**. Browser element: `gramlot-chart-donut`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartdonut).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measure` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-545"></a>
<a id="gc-480-chartscatter"></a>
### `chartScatter`

Shows each row as a point, to reveal relations and clusters. chartView with chartType 'scatter'.

Collection: **charts**. Browser element: `gramlot-chart-scatter`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartscatter).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-550"></a>
<a id="gc-480-chartbar3d"></a>
### `chartBar3D`

Shows a value for each pair of two dimensions as 3D columns. chartView with chartType 'bar3D'.

Collection: **charts**. Browser element: `gramlot-chart-bar3d`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartbar3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | required=true |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-555"></a>
<a id="gc-480-chartline3d"></a>
### `chartLine3D`

Shows values along two dimensions as lines in 3D space. chartView with chartType 'line3D'.

Collection: **charts**. Browser element: `gramlot-chart-line3d`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartline3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | required=true |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-560"></a>
<a id="gc-480-chartscatter3d"></a>
### `chartScatter3D`

Shows each row as a point in 3D space. chartView with chartType 'scatter3D'.

Collection: **charts**. Browser element: `gramlot-chart-scatter3d`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartscatter3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | required=true |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-565"></a>
<a id="gc-480-chartsurface"></a>
### `chartSurface`

Shows a measured surface over a grid of two numeric dimensions. chartView with chartType 'surface'.

Collection: **charts**. Browser element: `gramlot-chart-surface`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartsurface).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | required=true |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-570"></a>
<a id="gc-480-chartmap"></a>
### `chartMap`

Colours each territory of a GeoJSON map by one measure. chartView with chartType 'map'.

Collection: **charts**. Browser element: `gramlot-chart-map`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartmap).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | required=true |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-575"></a>
<a id="gc-480-chartmapbar3d"></a>
### `chartMapBar3D`

Raises 3D columns on the territories of a GeoJSON map. chartView with chartType 'mapBar3D'.

Collection: **charts**. Browser element: `gramlot-chart-map-bar3d`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartmapbar3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-580"></a>
<a id="gc-480-chartmap3d"></a>
### `chartMap3D`

Draws the territories of a GeoJSON map in 3D, one map per measure. chartView with chartType 'map3D'.

Collection: **charts**. Browser element: `gramlot-chart-map3d`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartmap3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-585"></a>
<a id="gc-480-chartlines3d"></a>
### `chartLines3D`

Draws paths of coordinates on a 3D map. chartView with chartType 'lines3D'.

Collection: **charts**. Browser element: `gramlot-chart-lines3d`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartlines3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | required=true |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-590"></a>
<a id="gc-480-chartpolygons3d"></a>
### `chartPolygons3D`

Draws polygons of coordinates as 3D shapes. chartView with chartType 'polygons3D'.

Collection: **charts**. Browser element: `gramlot-chart-polygons3d`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartpolygons3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | required=true |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-595"></a>
<a id="gc-480-chartfunnel"></a>
### `chartFunnel`

Shows how a quantity shrinks through ordered stages. chartView with chartType 'funnel'.

Collection: **charts**. Browser element: `gramlot-chart-funnel`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartfunnel).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measure` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-600"></a>
<a id="gc-480-chartradar"></a>
### `chartRadar`

Compares items on several measures; each measure is an axis, each row a polygon. chartView with chartType 'radar'.

Collection: **charts**. Browser element: `gramlot-chart-radar`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartradar).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-605"></a>
<a id="gc-480-chartparallel"></a>
### `chartParallel`

Compares rows on several measures; each measure is a vertical axis, each row a line across them. chartView with chartType 'parallel'.

Collection: **charts**. Browser element: `gramlot-chart-parallel`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartparallel).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measures` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-610"></a>
<a id="gc-480-chartheatmap"></a>
### `chartHeatmap`

Colours each cell of a grid of two categories by one measure. chartView with chartType 'heatmap'.

Collection: **charts**. Browser element: `gramlot-chart-heatmap`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartheatmap).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | required=true |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measure` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-615"></a>
<a id="gc-480-chartsankey"></a>
### `chartSankey`

Shows flows between nodes; the width of each link is its value. chartView with chartType 'sankey'.

Collection: **charts**. Browser element: `gramlot-chart-sankey`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartsankey).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | required=true |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measure` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-620"></a>
<a id="gc-480-chartcandlestick"></a>
### `chartCandlestick`

Shows the open, high, low and close of each period, as used for prices. chartView with chartType 'candlestick'.

Collection: **charts**. Browser element: `gramlot-chart-candlestick`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartcandlestick).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `open` | T | — | read | required=true |
| `high` | T | — | read | required=true |
| `low` | T | — | read | required=true |
| `close` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-625"></a>
<a id="gc-480-chartboxplot"></a>
### `chartBoxplot`

Shows the spread of each group with five statistics: minimum, quartiles, median and maximum. chartView with chartType 'boxplot'.

Collection: **charts**. Browser element: `gramlot-chart-boxplot`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartboxplot).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `min` | T | — | read | required=true |
| `q1` | T | — | read | required=true |
| `median` | T | — | read | required=true |
| `q3` | T | — | read | required=true |
| `max` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-630"></a>
<a id="gc-480-charttreemap"></a>
### `chartTreemap`

Shows a hierarchy as nested rectangles whose area is the value. chartView with chartType 'treemap'.

Collection: **charts**. Browser element: `gramlot-chart-treemap`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-charttreemap).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measure` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-480-635"></a>
<a id="gc-480-chartsunburst"></a>
### `chartSunburst`

Shows a hierarchy as rings; the angle of each sector is the value. chartView with chartType 'sunburst'.

Collection: **charts**. Browser element: `gramlot-chart-sunburst`.

[Shared charts, engines and temporal snapshots](480-charts.md#gc-480-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartsunburst).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `sampleMin` | R or None | — | read | — |
| `sampleMax` | R or None | — | read | — |
| `sampleStep` | R | 1 | read | — |
| `sampleStart` | R | 0 | read | — |
| `mapLabelMode` | T | 'value' | read | — |
| `mapBarScale` | T | 'zero' | read | — |
| `selectedTerritory` | T | '' | twoWay | — |
| `configpath` | T | — | — | — |
| `timeEmpty` | T | 'previous' | read | — |
| `timeField` | T | '' | read | — |
| `timeValue` | X or None | — | read | — |
| `timeStep` | T | 'month' | read | — |
| `engine` | T | 'echarts' | read | — |
| `mapValueField` | T | — | read | — |
| `mapLabelField` | T | — | read | — |
| `geoJSON` | X or None | — | read | — |
| `geometryField` | T | — | read | — |
| `secondCaptionField` | T | — | read | — |
| `seriesOptions` | X | — | read | — |
| `storepath` | T | — | — | — |
| `rowMode` | T | — | — | — |
| `gridId` | T | — | — | — |
| `captionField` | T | — | read | required=true |
| `measure` | T | — | read | required=true |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.
