# Charts

Document ID: **GC-480**.

<a id="gc-480-start"></a>
## Start here

Configure a chart over an existing Data Bag; engines load on demand.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-charts).

Supply rows and a configuration Bag in Data. chartPane composes the shared controls; chartView renders supported types using ECharts, Plotly, Vega or uPlot. Temporal playback selects prepared rows; it does not calculate business aggregates. Map territories must match GeoJSON names. Geographic 3D bars are ECharts-only.

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
| `timeFieldId, storepath, rowMode, configpath, categoryId, mapMeasureId, mapLabelId, secondCategoryId, geometryId, measureMenuId` | `{"dtype":"T"}` |

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
