# Charts

Document ID: **GC-480**.

<a id="gc-480-start"></a>
## Start here

Configure a chart over an existing Data Bag; engines load on demand.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-charts).

Supply rows and a configuration Bag in Data. chartPane composes the shared controls; chartView renders supported types using ECharts, Plotly, Vega or uPlot. Temporal playback selects prepared rows; it does not calculate business aggregates. Map territories must match GeoJSON names. Geographic 3D bars are ECharts-only.

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

## Choose a component

- [`chartPane`](#gc-480-chartpane): Shared chart configuration, rendering surface and temporal playback over Data Bags.
- [`chartView`](#gc-480-chartview): Engine adapter rendering the original rows and observing configuration and grid filters.
- [`chartFields`](#gc-480-chartfields): Store field discovery for the shared chart configuration controls.
- [`chartGeoJSON`](#gc-480-chartgeojson): Validated GeoJSON input and geographic data summary.
- [`chartTimeline`](#gc-480-charttimeline): Prepared calendar snapshots and playback bounds from the original store.
- [`gauge`](#gc-480-gauge): One value of the node on a needle dial, a progress ring or a half-circle arc.


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


**Limits and lifecycle.** One numeric value; an empty value shows an empty dial, never zero. Values outside min and max are clamped on the dial, the text shows the real value. Threshold colors are names or hex codes.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `min` | R | 0 | read | — |
| `max` | R | 100 | read | — |
| `mask` | T | '{}' | read | — |
| `thresholds` | T or None | '' | read | — |
| `presentation` | T | 'needle' | read | — |
| `caption` | T or None | '' | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.
