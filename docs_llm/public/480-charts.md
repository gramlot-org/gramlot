# Charts

Document ID: **GC-480**.

<a id="gc-480-start"></a>
## Start here

Configure a chart over an existing Data Bag; engines load on demand.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-charts).

Supply rows and a configuration Bag in Data. chartPane composes the shared controls; chartView renders supported types using ECharts, Plotly, Vega or uPlot; one element per chart type, such as chartCandlestick, declares its columns as attributes. Temporal playback selects prepared rows; it does not calculate business aggregates. Map territories must match GeoJSON names. Geographic 3D bars are ECharts-only.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)


<a id="gc-480-005"></a>
<a id="gc-480-010"></a>

Ordinary Source/CSS attributes remain in Writing pages and Themes and CSS.
Pages inherit environment collections; Page.gramlots adds missing ones. Buttons are built in.
Contract JSON omits only undeclared keys: no default is not the same as null. dtype: T text, B Boolean, L integer, R real, X structured value; remaining codes are TYTX. binding: read = Data to widget, write = widget to Data, twoWay = both. nullable permits None; enum restricts values; annotation preserves type/regex constraints. Parameters sharing a table row have exactly the same contract. Child grammar: * allows arbitrary Source children; empty permits none. Parent None means no declared restriction.


<a id="gc-480-220"></a>
<a id="gc-480-shared-value"></a>
## Values and bindings

The value type and writeback behavior depend on the control. Use a Data pointer for binding; see [Data binding](097-data-binding.md).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `value` | `{"binding":"twoWay","default":null,"dtype":"X","nullable":true}` | chartGeoJSON |

<a id="gc-480-445"></a>
## Charts


<a id="gc-480-450"></a>
<a id="gc-480-chartpane"></a>
### `chartPane`

Collection: charts. Shared chart configuration, rendering surface and temporal playback over Data Bags.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartpane).


**Data contract.** storepath and configpath identify original Data Bags. rowMode selects attributes or values.


**Interaction and events.** Shared settings, playback controls and engines retain configuration in Data.


**Composition.** Composes the shared frame and chart controls.


**Limits and lifecycle.** Business aggregation stays upstream; unsupported types are not emulated.


| Parameters | Contract |
| --- | --- |
| `configDefaults` | `{"dtype":"X","nullable":true}` |
| `storepath, configpath` | `{"dtype":"T"}` |
| `rowMode` | `{"default":"attributes","dtype":"T"}` |
| `gridId` | `{"dtype":"T","nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-480-455"></a>
<a id="gc-480-chartview"></a>
### `chartView`

Collection: charts. Engine adapter rendering the original rows and observing configuration and grid filters.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartview).


**Data contract.** Reads store and bound chart configuration; selectedTerritory writes the chosen name.


**Interaction and events.** Observes rows and grid filtering, updates the engine and releases it on removal.


**Composition.** Rendering surface composed by chartPane.


**Limits and lifecycle.** Numeric X is required by uPlot; mapBar3D is ECharts-only.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField, secondCaptionField, chartType, captionField` | `{"binding":"read","dtype":"T"}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |
| `valueFields` | `{"binding":"read","dtype":"T","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-460"></a>
<a id="gc-480-chartfields"></a>
### `chartFields`

Collection: charts. Store field discovery for the shared chart configuration controls.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartfields).


**Data contract.** Reads store metadata and writes available chart fields to configuration.


**Interaction and events.** Rebuilds field choices when the original Bag changes.


**Composition.** Internal shared chart settings component.


**Limits and lifecycle.** Does not query a database or infer business aggregates.


| Parameters | Contract |
| --- | --- |
| `timeFieldId, storepath, rowMode, configpath, categoryId, mapMeasureId, mapLabelId, secondCategoryId, geometryId, measureMenuId, measureRoleIds` | `{"dtype":"T"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-465"></a>
<a id="gc-480-chartgeojson"></a>
### `chartGeoJSON`

Collection: charts. Validated GeoJSON input and geographic data summary.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartgeojson).


**Data contract.** value binds a plain GeoJSON feature collection or null.


**Interaction and events.** Validates supplied geography and displays its summary.


**Composition.** Shared geography input for chart configuration.


**Limits and lifecycle.** Named Polygon/MultiPolygon features only; host owns territorial matching.

Shared contracts: [Values and bindings](#gc-480-shared-value).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-470"></a>
<a id="gc-480-charttimeline"></a>
### `chartTimeline`

Collection: charts. Prepared calendar snapshots and playback bounds from the original store.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-charttimeline).


**Data contract.** Reads store/time parameters and writes timeline state under configpath.


**Interaction and events.** Tracks bounds and prepared snapshots; removal releases observation.


**Composition.** Used by chartPane with its playback controls.


**Limits and lifecycle.** No business aggregation; calendar periods and empty policy are explicit.


| Parameters | Contract |
| --- | --- |
| `storepath, rowMode, configpath` | `{"dtype":"T"}` |
| `timeField, timeStep` | `{"binding":"read","dtype":"T"}` |
| `timeIndex` | `{"binding":"read","dtype":"R"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-500"></a>
<a id="gc-480-gauge"></a>
### `gauge`

Collection: charts. One value of the node on a needle dial, a progress ring or a half-circle arc.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-gauge).


**Data contract.** The node value is the single value, a Data pointer with optional ?attr. min, max, mask, thresholds, presentation and caption read Data. Nothing is written.


**Interaction and events.** Redraws when the value or a parameter changes and follows the light or dark theme; removal releases the engine.


**Composition.** Leaf rendering surface; no children.


**Limits and lifecycle.** One numeric value; an empty value shows the information notice No value, never zero. Errors show an error notice with More info. Values outside min and max are clamped on the dial, the text shows the real value. Threshold colors are names or hex codes.


| Parameters | Contract |
| --- | --- |
| `min` | `{"binding":"read","default":0,"dtype":"R"}` |
| `max` | `{"binding":"read","default":100,"dtype":"R"}` |
| `mask` | `{"binding":"read","default":"{}","dtype":"T"}` |
| `thresholds, caption` | `{"binding":"read","default":"","dtype":"T","nullable":true}` |
| `presentation` | `{"binding":"read","default":"needle","dtype":"T"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-640"></a>
## Chart types


<a id="gc-480-505"></a>
<a id="gc-480-chartbar"></a>
### `chartBar`

Collection: charts. Compares values across categories with vertical bars. chartView with chartType 'bar'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartbar).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |
| `captionField, measures` | `{"binding":"read","dtype":"T","required":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-510"></a>
<a id="gc-480-chartline"></a>
### `chartLine`

Collection: charts. Shows how values change along an ordered category, such as time. chartView with chartType 'line'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartline).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |
| `captionField, measures` | `{"binding":"read","dtype":"T","required":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-515"></a>
<a id="gc-480-chartarea"></a>
### `chartArea`

Collection: charts. Shows how values change along an ordered category, filling the area under each line. chartView with chartType 'area'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartarea).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |
| `captionField, measures` | `{"binding":"read","dtype":"T","required":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-520"></a>
<a id="gc-480-chartstackedbar"></a>
### `chartStackedBar`

Collection: charts. Shows the parts of a total for each category, with the measures stacked in one bar. chartView with chartType 'stackedBar'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartstackedbar).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |
| `captionField, measures` | `{"binding":"read","dtype":"T","required":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-525"></a>
<a id="gc-480-chartstackedarea"></a>
### `chartStackedArea`

Collection: charts. Shows the parts of a total along an ordered category, with the areas stacked. chartView with chartType 'stackedArea'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartstackedarea).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |
| `captionField, measures` | `{"binding":"read","dtype":"T","required":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-530"></a>
<a id="gc-480-charthorizontalbar"></a>
### `chartHorizontalBar`

Collection: charts. Compares values across categories with horizontal bars; suited to long category names. chartView with chartType 'horizontalBar'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-charthorizontalbar).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |
| `captionField, measures` | `{"binding":"read","dtype":"T","required":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-535"></a>
<a id="gc-480-chartpie"></a>
### `chartPie`

Collection: charts. Shows the share of each category in a total. chartView with chartType 'pie'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartpie).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |
| `captionField, measure` | `{"binding":"read","dtype":"T","required":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-540"></a>
<a id="gc-480-chartdonut"></a>
### `chartDonut`

Collection: charts. Shows the share of each category in a total, as a ring. chartView with chartType 'donut'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartdonut).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |
| `captionField, measure` | `{"binding":"read","dtype":"T","required":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-545"></a>
<a id="gc-480-chartscatter"></a>
### `chartScatter`

Collection: charts. Shows each row as a point, to reveal relations and clusters. chartView with chartType 'scatter'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartscatter).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |
| `captionField, measures` | `{"binding":"read","dtype":"T","required":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-550"></a>
<a id="gc-480-chartbar3d"></a>
### `chartBar3D`

Collection: charts. Shows a value for each pair of two dimensions as 3D columns. chartView with chartType 'bar3D'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartbar3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField` | `{"binding":"read","dtype":"T"}` |
| `secondCaptionField, captionField, measures` | `{"binding":"read","dtype":"T","required":true}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-555"></a>
<a id="gc-480-chartline3d"></a>
### `chartLine3D`

Collection: charts. Shows values along two dimensions as lines in 3D space. chartView with chartType 'line3D'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartline3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField` | `{"binding":"read","dtype":"T"}` |
| `secondCaptionField, captionField, measures` | `{"binding":"read","dtype":"T","required":true}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-560"></a>
<a id="gc-480-chartscatter3d"></a>
### `chartScatter3D`

Collection: charts. Shows each row as a point in 3D space. chartView with chartType 'scatter3D'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartscatter3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField` | `{"binding":"read","dtype":"T"}` |
| `secondCaptionField, captionField, measures` | `{"binding":"read","dtype":"T","required":true}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-565"></a>
<a id="gc-480-chartsurface"></a>
### `chartSurface`

Collection: charts. Shows a measured surface over a grid of two numeric dimensions. chartView with chartType 'surface'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartsurface).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField` | `{"binding":"read","dtype":"T"}` |
| `secondCaptionField, captionField, measures` | `{"binding":"read","dtype":"T","required":true}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-570"></a>
<a id="gc-480-chartmap"></a>
### `chartMap`

Collection: charts. Colours each territory of a GeoJSON map by one measure. chartView with chartType 'map'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartmap).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, captionField` | `{"binding":"read","dtype":"T","required":true}` |
| `mapLabelField, geometryField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-575"></a>
<a id="gc-480-chartmapbar3d"></a>
### `chartMapBar3D`

Collection: charts. Raises 3D columns on the territories of a GeoJSON map. chartView with chartType 'mapBar3D'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartmapbar3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |
| `captionField, measures` | `{"binding":"read","dtype":"T","required":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-580"></a>
<a id="gc-480-chartmap3d"></a>
### `chartMap3D`

Collection: charts. Draws the territories of a GeoJSON map in 3D, one map per measure. chartView with chartType 'map3D'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartmap3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |
| `captionField, measures` | `{"binding":"read","dtype":"T","required":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-585"></a>
<a id="gc-480-chartlines3d"></a>
### `chartLines3D`

Collection: charts. Draws paths of coordinates on a 3D map. chartView with chartType 'lines3D'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartlines3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `geometryField, captionField, measures` | `{"binding":"read","dtype":"T","required":true}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-590"></a>
<a id="gc-480-chartpolygons3d"></a>
### `chartPolygons3D`

Collection: charts. Draws polygons of coordinates as 3D shapes. chartView with chartType 'polygons3D'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartpolygons3d).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `geometryField, captionField, measures` | `{"binding":"read","dtype":"T","required":true}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-595"></a>
<a id="gc-480-chartfunnel"></a>
### `chartFunnel`

Collection: charts. Shows how a quantity shrinks through ordered stages. chartView with chartType 'funnel'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartfunnel).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |
| `captionField, measure` | `{"binding":"read","dtype":"T","required":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-600"></a>
<a id="gc-480-chartradar"></a>
### `chartRadar`

Collection: charts. Compares items on several measures; each measure is an axis, each row a polygon. chartView with chartType 'radar'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartradar).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |
| `captionField, measures` | `{"binding":"read","dtype":"T","required":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-605"></a>
<a id="gc-480-chartparallel"></a>
### `chartParallel`

Collection: charts. Compares rows on several measures; each measure is a vertical axis, each row a line across them. chartView with chartType 'parallel'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartparallel).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |
| `captionField, measures` | `{"binding":"read","dtype":"T","required":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-610"></a>
<a id="gc-480-chartheatmap"></a>
### `chartHeatmap`

Collection: charts. Colours each cell of a grid of two categories by one measure. chartView with chartType 'heatmap'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartheatmap).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField` | `{"binding":"read","dtype":"T"}` |
| `secondCaptionField, captionField, measure` | `{"binding":"read","dtype":"T","required":true}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-615"></a>
<a id="gc-480-chartsankey"></a>
### `chartSankey`

Collection: charts. Shows flows between nodes; the width of each link is its value. chartView with chartType 'sankey'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartsankey).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField` | `{"binding":"read","dtype":"T"}` |
| `secondCaptionField, captionField, measure` | `{"binding":"read","dtype":"T","required":true}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-620"></a>
<a id="gc-480-chartcandlestick"></a>
### `chartCandlestick`

Collection: charts. Shows the open, high, low and close of each period, as used for prices. chartView with chartType 'candlestick'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartcandlestick).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |
| `captionField, open, high, low, close` | `{"binding":"read","dtype":"T","required":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-625"></a>
<a id="gc-480-chartboxplot"></a>
### `chartBoxplot`

Collection: charts. Shows the spread of each group with five statistics: minimum, quartiles, median and maximum. chartView with chartType 'boxplot'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartboxplot).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |
| `captionField, min, q1, median, q3, max` | `{"binding":"read","dtype":"T","required":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-630"></a>
<a id="gc-480-charttreemap"></a>
### `chartTreemap`

Collection: charts. Shows a hierarchy as nested rectangles whose area is the value. chartView with chartType 'treemap'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-charttreemap).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |
| `captionField, measure` | `{"binding":"read","dtype":"T","required":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-480-635"></a>
<a id="gc-480-chartsunburst"></a>
### `chartSunburst`

Collection: charts. Shows a hierarchy as rings; the angle of each sector is the value. chartView with chartType 'sunburst'.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartsunburst).


**Data contract.** Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.


**Interaction and events.** Same as chartView: observes rows, grid filtering and series options; removal releases the engine.


**Composition.** Leaf rendering surface: chartView with a fixed chartType.


**Limits and lifecycle.** The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.


| Parameters | Contract |
| --- | --- |
| `sampleMin, sampleMax` | `{"binding":"read","dtype":"R","nullable":true}` |
| `sampleStep` | `{"binding":"read","default":1,"dtype":"R"}` |
| `sampleStart` | `{"binding":"read","default":0,"dtype":"R"}` |
| `mapLabelMode` | `{"binding":"read","default":"value","dtype":"T"}` |
| `mapBarScale` | `{"binding":"read","default":"zero","dtype":"T"}` |
| `selectedTerritory` | `{"binding":"twoWay","default":"","dtype":"T"}` |
| `configpath, storepath, rowMode, gridId` | `{"dtype":"T"}` |
| `timeEmpty` | `{"binding":"read","default":"previous","dtype":"T"}` |
| `timeField` | `{"binding":"read","default":"","dtype":"T"}` |
| `timeValue, geoJSON` | `{"binding":"read","dtype":"X","nullable":true}` |
| `timeStep` | `{"binding":"read","default":"month","dtype":"T"}` |
| `engine` | `{"binding":"read","default":"echarts","dtype":"T"}` |
| `mapValueField, mapLabelField, geometryField, secondCaptionField` | `{"binding":"read","dtype":"T"}` |
| `seriesOptions` | `{"binding":"read","dtype":"X"}` |
| `captionField, measure` | `{"binding":"read","dtype":"T","required":true}` |

Child grammar: `''`; parent grammar: `None`.
