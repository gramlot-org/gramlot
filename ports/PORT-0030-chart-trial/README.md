# PORT-0030 · Chart trial

- **Status:** experimental local trial implemented and verified; owner review pending. Not a public component contract or release.
- **Owner direction:** 2026-11-04 requests a quick visible ECharts chart from a grid toolbar, with a configuration palette, source Data and structure separated. Grid and chart are views of a collection store. Owner selects filtered grid rows first and postpones row highlighting; confirms the chart retains the last filter after grid closes and confirms bars and lines for the first visual trial. See GC-470 §055.
- **PoC evidence:** `gramlot-poc@10478b57ce3f22e6445eb6b72eba343520cbebac`, `js/dom/src/collections/chart.js`, `src/gramlot/grammar/chart.py` and chart tests. The trial uses ECharts instead of the PoC D3 renderer; PoC field names are evidence, not an accepted public API.
- **Boundary:** core's own Python-authored fixture and local browser harness; no dependency on examples or adapters. Source/Data, shared grid collection view, standard floatingPane and ECharts. No DOM construction or manual wiring in application fixture; chart rendering is framework component behavior. No release or deployment.

## Trial behavior

The grid toolbar opens a floating chart; its Configure button opens a separate floating palette. Bar/line choice and category/value field names are bound to a Data Bag. The chart uses a separate view of the shared resident collection store, follows the grid's current filter, and on grid removal releases that connection while retaining the last filter and observing remaining store changes. Both values and attributes modes are qualified at store/renderer level. The visible fixture uses attribute rows. A fixed finite-number and text/date category subset is explicitly validated; advanced chart types, aggregation, Decimal and general date/time conversion, remote/windowed stores, highlighting and saved chart definitions are outside this slice.

The experimental component reuses the existing Source-owned `gridSearch` resource to observe its view, and a trial `gridId` reference. These are provisional trial wiring, not an accepted chart API; the search-specific resource is not approved as the general chart/store integration. Store replacement, grid replacement/reattachment, zero-sized/hidden chart behavior, comprehensive accessibility, theme integration, full error recovery, asset packaging and production lifecycle require design and qualification before promotion. The trial requires an existing grid initially; independent chart construction is not yet delivered. The grid's lifecycle now notifies its existing resource on disconnect, so trial detachment can retain the last filter; broader consumers require regression coverage.

## Verification

- 79 focused Node tests pass across chart, real grid, frame-grid and collection view tests using `.venv/bin/python`. An initial test invocation used system Python and failed to import Gramlot; the corrected environment passes.
- Chromium and WebKit pass against a temporary chart bundle and grid bundle built from current source plus the existing prepared core/layout/inputs artifacts. Checks cover toolbar, palette, bar-to-line SVG change, filter, grid Source removal, continued matching Data insertion and absence of page errors. They do not qualify packaged/released charts, Firefox, file-origin, performance or live streaming.
- Local preview: `node tools/gramlot-tools-inspector/tests/chart-trial-browser.mjs --serve --port 8899`. The harness builds experimental assets under `/private/tmp/gramlot-chart-visible`; it uses the existing `.venv`, JS dependencies and Playwright browsers.
- npm install reported four moderate audit advisories. A follow-up `npm audit` could not run without a lockfile; their provenance is unverified. ECharts is Apache-2.0 and its zrender dependency identifies BSD-3-Clause; release artifact licensing/notices and the full dependency graph remain to be reviewed.

## Destination review

Owner visual acceptance and review of the provisional grid/chart ownership are pending. The PoC cannot yet be deleted on the strength of this trial. Record scope and explicit approval before promoting any public chart API or feature set.

## Expanded local trial — 2026-11-04

Owner requests more columns and temporal references, then requests a white chart background independent of theme. The fixture now uses twelve typed dates and seven columns (order, date, region, product, units, revenue, margin). The palette chooses date/order and revenue/units/margin; dates use an ECharts time axis with UTC. White is applied to the chart itself, not the Gramlot palette. 81 focused Node tests pass; Chromium and WebKit verify typed date transport, dimension/measure changes, filtering, retained filter and white chart background under dark theme. The local trial remains experimental and does not establish full date/time, localization, grouping, chart types or product acceptance.

## Palette button — 2026-11-04

Owner requests an icon instead of the Configure text button. The Python trial uses a gear button with accessible label and title; Chromium and WebKit verify opening the palette and the existing chart interactions. Local preview restarted on port 8899.

## Configuration drawer — 2026-11-04

Owner suggests a CodeMirror-style side drawer, optionally detachable. The trial replaces the earlier separate floating configuration window with the existing borderContainer right drawer and its existing detachable region; the chart window remains separate. The drawer configuration stays bound to the same Data Bag. Chromium and WebKit exercise opening, type and field changes, detachment, configuration while detached, reattachment without replacing the control, filtering and continued chart updates after grid removal. The earlier palette-button text is historical. Owner visual acceptance remains pending.

## Icon-only drawer and window title-bar review — 2026-11-04

Owner requests an icon-only chart drawer and asks whether dialog/floating title bars support custom tools. The fixture uses an empty drawer label, the existing gear icon and a tooltip; Chromium/WebKit verify the button label, tooltip, opening, detachment and reattachment. The current shared WindowSurface title bar renders only its title and built-in collapse, maximize and close controls; neither dialog nor floatingPane exposes an authorable title-bar tools slot. The existing framePane top region is below the window title bar. No new title-bar API or runtime behavior was added.


Chart frame toolbar — 2026-11-04: owner confirms “Sì, proviamo a mettere l’ingranaggio nella toolbar superiore del framePane per aprire il drawer di configurazione.” The private Python trial now places the gear in frame.top; demo.configDrawer binds the existing drawer parameter (true / close). The existing drawer_style hides the edge handle. No new runtime API is introduced. Chromium and WebKit passed opening/closing from the toolbar, configuration changes, detachment/reattachment, filtering and retained-filter updates after grid removal. Earlier runs timed out at existing filter/label assertions; the final full run passed both browsers. Visual owner acceptance remains pending.


Shared icon-only defaults — 2026-11-04: owner explicitly requested implementation in the shared component and removal of chart-local corrections. Command now derives icon-only presentation from rendered icon/caption content, updates on caption/icon changes and releases its observer on disconnection/disposal. Defaults are a 24 px icon, 36 px minimum target, transparent border/background at rest, theme hover/focus/selection and the existing touch minimum. Toggle/check/expanded states remain visible; popup menu rows and text commands keep their layout. Toolbar iconSize overrides remain effective. The chart fixture no longer supplies button classes, font size or padding overrides. GC-415 documents the shared tokens and scope.

Verified: 72 command/button/menu tests, canonical npm runtime build, Chromium and WebKit chart trial with real 24 px/36 px geometry, theme size override, 44 px touch minimum, keyboard activation, drawer detachment/reattachment, filtering and updates after grid removal. Full-page screenshots triggered intermittent window geometry collapse during earlier browser runs; viewport screenshots avoid resizing the page and the final runs passed. No window-geometry fix is claimed. Shared implementation and local artifacts are ready for owner visual review; no publication or release.


Shared FrameGrid toolbar — 2026-11-04: owner confirms one toolbar with automatic standard searchOn and the chart icon in the same bar. Python/JS frameGrid now compose top.bar once, expose it as frame.toolbar, and populate a retained right-hand search group. Commands use the existing menu system; no slotbar DSL or chart runtime is promoted. Shared search sizing no longer inherits generic field height. The chart uses the reusable packaged SVG via iconSrc. The core frame-grid fixture also uses the shared toolbar. Existing application code that deliberately creates a new top menu needs to use frame.toolbar instead; external galleries were not edited.

Verified: 45 JavaScript frame-grid/menu cases, 10 Python cases, Python/JS Source parity, Chromium/WebKit one-toolbar geometry, command/search alignment, 32 px search sizing independent of an 80 px generic field height, chart activation, drawer configuration/detachment, filters and grid removal. Owner visual acceptance is pending. No release or deployment.


Shared search capsule refinement — 2026-11-04: implemented the owner's rounded compact control, darker selector segment and explicit-only information button. Defaults are 26 px input height, 240 px width and 12 px type, preserving touch target. searchHelp=False is forwarded by frameGrid to searchBox; true opts in and reactive disabling closes the help popover. Hidden help no longer reserves input/clear-button space. Verified 13 JS frame-grid cases, 11 Python cases and Chromium/WebKit geometry, default absence, explicit help opening/closing, chart configuration/filter lifecycle. The local harness now maps the current inputs collection's tree dependency. Owner visual review pending; no release/publication.


Toolbar overflow correction — 2026-11-04: owner requests Chart after Search and reports a flashing overflow chevron. Reproduced before the fix with a fractional toolbar width: the auto margin was counted as intrinsic content, causing alternating overflow every animation frame. Shared ToolbarOverflow now measures in an intrinsic-size viewport synchronously before paint, excluding flex-distributed spare space while retaining fixed margins and priority rules. FrameGrid search no longer forces CSS order; subsequent commands follow it in Source order. Verified: 32 menu tests, canonical runtime build, Chromium/WebKit at three viewport widths with 24-frame stability sampling each, genuine narrow-width overflow and recovery, chart/drawer/filter lifecycle. Local implementation complete; owner visual review pending; no release/publication.


Multiple chart measures — 2026-11-04: owner confirms multiple curves or bars and says “procedi”. The private chart structure now binds valueFields to shared checkBoxText (comma-separated measure codes or null), replacing the single valueField with no compatibility alias. ECharts receives one named series per selected measure, a distinct palette color, legend and axis tooltip. Bars are unstacked/adjacent; lines share the existing X dimension and Y scale. Initial selection is revenue and margin. Empty selection removes all series; invalid numeric data is still rejected. The chart continues to follow grid filters and retain the final filter after grid removal.

Verified: 11 chart renderer/view/integration tests, Chromium and WebKit selection/deselection, two measures, empty selection and restoration, legend changes, bar/line switching, detached configuration and filtered updates. SVG screenshot inspected after entrance animation to confirm both curves render. Chart API remains experimental; no row selection, independent Y axes or release implied. Local preview refreshed for owner review.


Chart per-measure axes and colors — 2026-11-04: implemented owner-confirmed independent right axis for Units and per-measure color/axis controls. The trial starts with revenue, units and margin selected; revenue/margin use left, units right. seriesOptions is a Data Bag keyed by field, with axis and color; the experimental component observes nested changes and releases the subscription on disconnect. ECharts binds each series to its chosen axis with explicit line/item colors and labels each active axis with its measures. Deselection and chart-type changes preserve presentation settings.

Verified: 12 renderer/view/grid tests, Chromium/WebKit changes through actual axis/color controls, deselection/reselection, bar/line switching, drawer detach, filtering and grid removal. A rendered screenshot confirms Units spans its own 0–30 scale alongside Margin's independent scale. Invalid axis/color settings are rejected. All scales remain linear; this does not add normalization, mixed chart types or additional Y axes. Preview refreshed; owner acceptance pending, no publication.


Compact chart configuration grid — 2026-11-04: replaced the checkbox list and repeated color/axis controls with a Measures toggle menu and the shared editable grid (Measure, Color, Axis). Per-measure selected in the options Data Bag owns selection; the grid filters selected rows and a dataFormula derives valueFields for the chart. Menu choices add/remove the visible row without losing color/axis settings. Default axes remain Units right, Revenue/Margin left. Existing colorpicker and filteringSelect cell editors open on double-click; the current grid display shows the hex color code (not a custom swatch renderer). Compact layout uses existing field/grid density tokens.

Verified Chromium/WebKit: menu removal/re-addition, empty selection, row counts, actual grid axis/color editing, retained settings, chart updates, drawer detachment and filtered data after source grid removal. Visual screenshot confirms the compact three-column layout and untruncated color codes. No new framework editing capability, DOM wiring, release or deployment. Owner visual review pending.


Shared grid color swatches — 2026-11-04: owner requests showing the color instead of the hex value. Grid columns with colorpicker editors now display a swatch at rest, with the original value in tooltip/accessible text; Data and editor lifecycle remain unchanged. Verified 49 grid-editing tests, canonical runtime build and Chromium/WebKit editing, swatch update, selection toggling, chart and detached drawer lifecycle. Visual screenshot checked. Preview refreshed; no publication.


Chart exploration — 2026-11-04: owner confirms “Sì procedi: tutte le colonne dello store, compresi Product e Region, scelta dell’aggregazione e più tipi di grafico. Voglio poter provare davvero le possibilità senza limiti messi nell’esempio.” The trial derives dimension choices from all store attribute names and measure choices from numeric columns, rather than a hand-picked allowlist. Private aggregation uses none/sum/avg/min/max/count (count means rows per category); chartData prepares the filtered view without mutating source rows. Chart types: bar, line, area, stackedBar, stackedArea, horizontalBar, pie, donut, scatter. These names follow existing chartType and ECharts series vocabulary. Configuration remains in Data Bags. Pie/donut require one nonnegative measure, stacked series a common axis, scatter a numeric/date dimension; visible messages explain incompatible selections and recover when configuration changes. This extends the experiment, not the public API. Category discovery runs when the Python fixture is built; it is not a runtime schema observer.


Chart exploration — 2026-11-04: implemented the owner-confirmed extension to all store columns as dimensions (including Product/Region), numeric measures discovered from the store, six aggregation choices and nine chart types. Aggregation operates on the filtered view; raw store data is unchanged. Visible configuration messages replace silent failures for incompatible pie/stack/scatter selections. Verified 21 unit/integration renderer/view tests, Chromium and WebKit browser flows (all dimension choices, Product sum, new types, message recovery, measure toggles, axes/colors, detached drawer and source grid removal); screenshot reviewed. Local preview refreshed. The field catalogue is derived at fixture construction, not dynamically rebuilt after schema changes. Experimental API only; owner visual acceptance pending, no publication.


Chart full-height resize — 2026-11-04: owner asks “ho ampliato la finestra per migliorar la visualizzazioen e il grafico dovrebbe andare al 100 %”. Removed the experimental chart's fixed 320px drawing height. Host, control box and ECharts surface now fill the available container height; the existing ResizeObserver updates the chart on window/drawer geometry changes. Verified Chromium and WebKit resizing through the actual window resize control: SVG width/height grow with the window and match the chart host within 2px; full chart/filter/drawer regression flows pass. No public API change.


Radial chart legend and measure selection — 2026-11-04: owner requests a separate responsive legend area and says “se ci sono grafici cone pye che hanno una solo misura scegli la prima di quelle correntamte selezionate”. Pie/donut now render the first field in valueFields without changing the selection Bag. This supersedes the earlier multi-measure rejection for radial charts; other chart types retain all selected fields. Their horizontal scroll legend occupies a reserved bottom band, while the pie series and outside labels use a separate viewport above it. ECharts recalculates both on resize; long legends paginate instead of wrapping into slice labels. No new API names or public component contract.


Shared chart configurator — 2026-11-04: implemented the owner-authorized reusable ChartPane composition, exported from gramlot, and canonical charts collection/chartView. Renderer/data-view/aggregation code moved from experiments into shared components without aliases. The Python composition owns default configuration, field discovery, toolbar, detachable drawer and measure/color/axis controls; the sales fixture now supplies data/defaults and a window. Added a second, independent values-mode store without grid. Optional gridId retains filter following; standalone charts use their own collection view. Canonical build succeeded and includes charts in Python/JS prepared artifacts and JS exports. Verified 3 Python composition tests, 23 JS chart tests, Chromium/WebKit complete UI flows plus independent configuration and live standalone store updates. Browser tests use the installed charts collection. Fields are discovered at authoring time; schema changes require reconstruction. Implementation and verification complete; owner acceptance pending, no release/publication.


Reactive chart schema — 2026-11-04: completed the owner-authorized removal of authoring-time column discovery. Shared chartFields subscribes to the resident collection store, discovers the union of columns and consistently finite numeric measures, and updates standard Source controls plus configuration Data. Existing numeric series retain color/axis/selection. New numeric fields receive defaults; removed/non-numeric fields leave the measures, while textual columns remain dimensions. Removed dimensions select the first available column. Empty stores repopulate without recreating the chart. Full-store discovery is independent of grid filters. Named Logic handles generated measure commands; subscriptions release on disconnect. Verified canonical build, 25 JS tests, 3 Python tests and Chromium/WebKit: both row modes, added columns, retained custom color/deselection, new menu interaction, numeric-to-text change, selected-dimension removal, empty/repopulated store with a different schema, and identical chart DOM instance. Existing chart/drawer/filter/resize flows pass. Preview refreshed; owner acceptance pending. Entire store Bag replacement remains outside this bounded schema-mutation change.


3D bars — 2026-11-04: implemented the owner-authorized bar3D chart in shared ChartPane. The drawer exposes reactive second-dimension and single-measure selectors, with Product/Region/Revenue and sum in the sales fixture. Pair aggregation supports all existing aggregation choices without adding zero rows for absent pairs. ECharts GL 2.1.0 uses the same distributed ECharts instance as the renderer; GL loads on demand, Canvas/WebGL switches back to SVG for 2D, and async render revisions protect disposal/type switching. Browser camera controls rotate/zoom; pane resize updates the canvas. ECharts GL BSD LICENSE and ClayGL LICENSE are shipped as collection assets; GL package.json MIT versus BSD LICENSE discrepancy retained in GC-470. Canonical build and 27 JS / 3 Python tests pass. Browser verification covers field selection, GL rendering, rotation, resize, 2D return and previous chart/filter/reactive-schema flows in Chromium and WebKit. Visual 3D screenshots inspected. Preview refreshed; owner visual acceptance pending, no release/publication.


Chart measure grid sizing — 2026-11-04: owner reports that the measure grid does not widen with the configurator. Shared ChartPane columns now use existing percentage-width support (40/30/30) instead of fixed pixel widths, filling the available grid viewport in the drawer and detached pane. Verified Chromium/WebKit detached window resizing increases the grid width and keeps its table within 3px of the available viewport; existing editing, chart and drawer flows pass. No grid sizing API change.


Grouped 3D measures — 2026-11-04: implemented owner-confirmed multiple measures per dimension pair/plane with adjacent non-overlapping bars, explicit per-measure color, common Z scale and measure legend. Removed the 3D-only measure selector/parameter; shared selection/color grid is the sole control for 2D and 3D measures. Numeric category-center projection provides within-group spacing, with original category labels/tooltips. Legend viewport separation checked visually. Verified canonical build, 29 JS tests and 3 Python tests; Chromium/WebKit flows cover 3D selection toggling, empty selection, color editing, resize/rotation, 2D return, filters, reactive schema and detached configurator. Unit tests verify independent pair aggregation, non-overlapping footprints, same-plane coordinates, color/legend mapping, single/empty selections and filters in both row modes. Preview refreshed; owner acceptance pending, no publication.


Additional 3D charts — 2026-11-04: implemented line3D, scatter3D, surface,
map3D, lines3D and polygons3D in the shared ChartPane/renderer. Numeric/date
Cartesian coordinates, independent measure colors, surface holes and pair
aggregation are supported. Geographic input follows the owner's approved GeoJSON
and store coordinate lists; multiple measures have separate panels. Owner also
explicitly approved map3D rendering of generated polygon GeoJSON, replacing the
broken native polygons3D/geo3D path without modifying ECharts GL. Coordinate/name
validation reports incompatible input visibly. Shared selectors remain reactive;
geometry selectors and aggregation controls follow chart type.

Verified: canonical build, 31 JavaScript chart tests, 3 Python composition tests,
and complete Chromium/WebKit browser flows including all six new types, schema
updates, measures, colors, resize, detached drawer and source-grid removal.
Reviewed rendered maps, paths, polygons and Cartesian screenshots; polygon
extrusions are visible in both browsers. The localhost:8899 preview now includes
numeric fields and synthetic geographic fixtures. Implementation and verification
complete; owner visual acceptance pending. No package release or deployment.


GeoJSON configurator import — 2026-11-04: implemented the owner's requested
local file loading in shared chartGeoJSON/ChartPane, with two-way configuration
binding, territory summary, strict FeatureCollection/name/ring validation and
preservation of the previous map on failure. The existing reactive captionField
selector is labeled Category / territory field and links store values to
properties.name. File reading stays client-side; no application DOM or server
upload was added. Verified canonical build, 32 JavaScript chart tests, 3 Python
tests and Chromium/WebKit flows. Browser coverage includes importing territories
into the sales chart, choosing Region + Sum, replacement, malformed JSON retaining
the old geometry, and retrying the same file. Local preview refreshed on port8899.
Implementation and verification complete; owner visual acceptance pending.
No release or publication.


2D choropleth configuration — 2026-11-04: implemented the owner-approved map
chart type in shared ChartPane/charts. Reactive mapValueField and mapLabelField
selectors choose a numeric store measure and compact labels; captionField joins
GeoJSON names. Continuous numeric legend, contrasting borders, outlined labels,
overlap suppression, tooltip values and native preserved aspect ratio replace
the unreadable uniform 3D presentation for comparisons. Positive values use a
sequential scale; signed values use a symmetric zero-centered diverging scale.
Unmatched geography remains gray, distinct from measured zero. 3D options and
their multi-series selections remain available independently.

The Australian snapshot defaults to 2025 billed per distinct customer. Its host
supplies per-state/year customer counts and derives 2025 totals, billed per 2025
customer and percentage change against 2024. No business arithmetic, inferred
baseline or database dependency was introduced into core. The store supplies
numeric columns to the generic map selector. Unsupported zero/missing comparison
denominators are explicitly rejected in the host helper.

Verified canonical build, 34 JavaScript chart tests, 3 Python composition tests,
2 business-formula tests, full Chromium/WebKit chart regressions and dedicated
2D map browser checks. Checks cover negative/zero/constant ranges, absent data,
SVG rendering in both row modes, file import, measure switching, live column
addition/removal and 2D/3D return. Screenshots reviewed in both browsers. Local
previews refreshed on 8899/8900; owner visual acceptance pending. Existing 3D
framing limitations remain outside this 2D change. No release/publication.


Chart integration reuse qualification — 2026-11-04. Owner request: "prova a
lavorarci per avere qualcosa di riusabile e da testare in vari casi".
ChartView and chartFields now reconnect when the bound store Bag is replaced by
an ordinary dataRpc result. The chart view retains its filter and releases old
subscriptions; column discovery follows the new nonempty schema. Empty results
show a status and retain configuration and the last field catalogue. A failed
RPC retains the previous Data result. A linked grid must resolve the same
storepath. Multiple charts keep independent configuration Bags.

The reusable ChartReportPage and deterministic attributes/values pages live in
gramlot-examples, base/pages/85-chart-reports. The Python environment owns the
read-only SalesCharts query and chart_reports launcher; core has no environment,
database or examples dependency. The live route queries annual state aggregates,
revenue per customer and annual percentage change, not a saved snapshot.
Verified 36 JavaScript chart tests, six Python composition/provider/fixture tests,
and Chromium/WebKit regressions plus three endpoint-driven pages in each engine.
Cases include store replacement, old-store isolation, shared filtering, independent
configuration, changed columns, empty recovery and failed-request retention.
Local preview: localhost:8901/index; fixture routes: /attributes and /values.
Owner visual acceptance remains pending; no release or publication. Existing 3D
framing refinements are outside this integration qualification.

Documentation qualification note: the server-wide check_docs.py stops before
Sphinx on an existing, unrelated GP-010 identity conflict: the checkbox option
section repeats gp-010-040 and lacks its Block ID. That guide was not changed by
this chart work. The runtime tests above pass; the global docs build is not a
passing receipt.


Modular chart collection — 2026-11-05. Implemented the owner's approved per-type
organization and JS configurator. Seventeen descriptor modules share controls,
rendering helpers and the same catalogue dispatch. chartPane composes ordinary
Source frame/toolbar/drawer; the Python ChartPane entry only supplies the Data
Bags and component. Removed aggregation from parameters, GUI and chart data
projection following the owner's correction; input measures are not calculated.
Maps/surfaces report duplicate keys requiring upstream preparation. Examples now
use the shared JS composition and precomputed provider measures. Verified 43 JS
tests, Python composition/provider/fixture checks, full Chromium/WebKit chart
regressions, direct JS component creation/disposal, and the three server example
routes in both engines. Local preview refreshed at localhost:8901/index.
Implementation is verified; owner visual acceptance remains pending. No release,
publication or dependency source changes. Prior server documentation identity
conflict in GP-010 remains outside this change.


Targeted chart cleanup — 2026-11-05. Owner approved removal of real duplication
without additional components. The identical finite 2D/3D coordinate and closed
polygon-ring checks now live in two pure chart-geometry predicates, shared by
GeoJSON import, store polygon conversion and geographic paths. Existing validation
policies/messages and all component interfaces remain unchanged. No configuration,
rendering, aggregation or Python behavior was added. Verified canonical build,
43 JavaScript chart tests and full Chromium/WebKit browser regressions, including
GeoJSON import/replacement/error recovery, 3D types and direct JS creation/disposal.
Implementation verified; no release/publication.


Chart engine adapter qualification — 2026-11-05. EChartsAdapter exposes all 17
render_<type> methods; PlotlyAdapter exposes bar/line/pie. Capabilities are derived
from the method inventory. Engine-independent chart descriptors and the shared
Source configurator use this inventory to disable unavailable choices without
rewriting the selected type or any existing settings. Adapter validation reports
incompatible data/options, including Plotly's repeated-pie-label summation, rather
than silently altering values. Plotly basic 4.2.0 is lazy, MIT license packaged.
Engine lifecycle, asynchronous update/disposal and shadow-root SVG styles belong
to the adapters. No aggregation or database logic was added.
Verified canonical build, 46 JS tests, six Python tests, full ECharts browser
regressions, engine comparison in Chromium/WebKit and three server-loaded examples
in both engines' test browsers. Visual inspection confirmed legend and axis titles.
Local previews refreshed on 8898 and 8901. Plotly coverage is limited to the three
approved types; owner visual acceptance pending. No release or publication.

Additional integration verification: verify_chart_reports now exercises an
ECharts map and a Plotly line concurrently on every route (attributes, values,
Australian invoices) in Chromium and WebKit. All six runs pass shared filtering,
dataRpc result replacement, empty/error recovery and retained engine/configuration.


Vega adapter qualification — 2026-11-05. VegaAdapter adds render_bar,
render_line and render_pie to the existing shared engine inventory/configurator.
Vega 6.4.0 is loaded lazily, directly without Vega-Lite; its BSD-3-Clause license
is packaged with the collection. Raw store values remain unchanged; pie angles
are graphical layout only. Data-only updates reuse the Vega View; structural
changes rebuild it, with queued updates, resize and disposal owned by the adapter.
Lines include points so a filtered single row remains visible. Unsupported chart
types stay unavailable without rewriting configuration. No Python GUI, business
aggregation or 3D support was added.
Verified canonical build and 49 JavaScript tests; three-engine comparisons and
existing ECharts regressions pass in Chromium/WebKit. All three server examples
(attributes, values, Australian invoices) pass in both browsers with an ECharts
map and Vega line, including reload, filtering, empty/error recovery and schema
changes. Visual inspection confirmed bars and pie labels/legend. Local previews
refreshed on 8898 and 8901. Implementation verified; owner visual acceptance
pending. No release or publication.


Chart capability choice filtering — 2026-11-05. Owner requested incompatible
choices not be offered. Shared Source bindings now hide and disable unsupported
types for the current engine and unsupported engines for the current type, using
the existing method inventory. External incompatible configuration remains intact
and reports an error. No new component or automatic configuration rewrite.
Verified build and Chromium/WebKit three-engine tests, including reactive hiding
and restoration, the 3D-to-2D engine-selection flow, retained external settings,
resizing, store replacement and filtering. Local previews refreshed on 8898/8901.
Implementation verified; owner visual acceptance pending. No publication.


uPlot integration and streaming qualification — 2026-11-05. UPlotAdapter adds
render_line to the shared configurator/capability inventory, with lazy uPlot
1.6.32 plus CSS, packaged MIT license, numeric/date ascending-X validation,
shared colors/dual axes, canvas reuse, resizing and disposal. No new shared
component, fallback, aggregation or WebSocket. The Python-first canonical
streaming example uses named Logic and dataController _timing with a bounded
600-row Bag, two sine curves, 2/10/30/60 Hz controls and pause/reset/resume.
All four engines can be compared with the same settings and data.
Verified build, 52 JS tests, six Python tests, four-engine Chromium/WebKit checks
and the streaming example in both browsers. Visual checks confirm plot, legend
and drawer fit. Observed timer updates: 2 Hz in both, and 62.5/50 Hz at requested
60 Hz (Chromium/WebKit), not rendered FPS. Preview: localhost:8901/streaming;
core qualification remains localhost:8898. Implementation verified; owner visual
acceptance pending. No release, publication or dependency source changes.


Streaming line presentation corrections — 2026-11-05. Owner reported ECharts
coordinate scaling and Vega's point-heavy appearance. Numeric ECharts coordinate
axes now use scale=true so their visible domain does not force zero; measure
axes retain their zero baseline. Vega and ECharts lines/areas show markers only
for an isolated sample, retaining its visibility after filtering. Multi-sample
curves draw without point markers; data values and configuration are unchanged.
This refines the earlier always-visible Vega symbol presentation.
Verified canonical build, 54 JS chart tests (actual ECharts scale extents across
positive/negative/moving domains and Vega symbol size through data changes),
Chromium/WebKit moving-window and marker checks, visual screenshots, and all six
Vega/ECharts server report cases including reload/filter/schema/empty/error
recovery. Previews on 8898 and 8901 refreshed. Implementation verified; owner
visual acceptance pending. No release or publication.


Plotly native coverage expansion — 2026-11-05. The owner's request for ECharts
coverage is implemented for 13 native types: bar, line, area, stackedBar,
stackedArea, horizontalBar, pie, donut, scatter, line3D, scatter3D, surface and
map. The adapter uses the lazy full Plotly 4.2.0 bundle and the same shared
configurator, data and measure settings. Unsupported combinations raise explicit
errors without rewriting configuration. Surface coordinates must be unique;
stacked areas with negative values and duplicate rendered pie labels are rejected.
Neutral map-data preparation is shared with ECharts; Plotly receives a render-only
copy with spherical polygon winding, preserving the input GeoJSON. Maps use no
external basemap service. The chart layer performs no business aggregation.
Build and 58 JS chart tests pass. The 13 native types passed Chromium and WebKit,
including WebGL, GeoJSON, resizing and no external map requests; screenshots were
inspected. Full parity and end-to-end acceptance are not complete.
Remaining: bar3D, map3D, lines3D and polygons3D need the pending owner decision on
mesh geometry instead of native equivalents. The general browser regression also
revealed a grid-filter integration failure: ChartDataView's bundled
BagCollectionView calls copyFiltersFrom on a runtime-created view from another
class instance definition; private #filters access fails across those definitions.
The grid filters but the chart does not update. This shared integration defect is
recorded separately and has not been bypassed in the Plotly adapter. No release
or publication; owner visual acceptance remains pending.


Shared chart filter transfer repaired — 2026-11-05. Owner explicitly requested
“sì procedi a sistemare il trasferimento dei filtri dalla grid al grafico, nel
componente condiviso e per tutti i motori”. BagCollectionView.copyFiltersFrom now
reads the immutable filterContributions snapshot instead of accessing another
view's private #filters. This corrects cross-bundle class identity failures in
the shared collection view; engine adapters and application examples are unchanged.
Accepted base/search/set predicates are transferred atomically into an independent
Map. The chart retains its accepted filters after detachment and continues to
filter subsequent data; reattachment follows the grid again. No row snapshot,
normalization fallback or business aggregation was introduced.
Verified canonical build and 76 chart/collection tests, including separately
loaded class definitions, both row modes, combined base/search/set criteria,
immutable snapshots, detachment and reattachment. The four-engine browser suite
passes Chromium and WebKit, exercising filtering and clearing with ECharts,
Plotly, Vega and uPlot as well as existing switching/resize/reload checks.
The previously recorded cross-bundle filter blocker is resolved. Implementation
verified; owner visual acceptance pending. No release or publication.
Owner separately answered “Solo tipi nativi per ora”: Plotly scope is the 13
implemented native types; custom mesh3d geometry is excluded for now, not pending.


### Temporal chart snapshots — 2026-11-05

Owner authorized: “Sì procedi con una prova nel configuratore condiviso: scegliamo il campo temporale e facciamo scorrere le fotografie dei dati con slider e Play/Pausa, usando i motori che abbiamo già.” This supersedes the preceding proposed Vizabi follow-up: the owner abandoned that trial; no upstream Vizabi fix is authorized or pursued.

Implemented and verified in the shared charts collection. ChartFields discovers Date columns reactively. ChartTimeline derives the complete store's UTC day/month/year range and keeps the current period, bounds and playback state in the configuration Bag. A standard Source controller advances it; the shared slider pauses on manual input, playback stops at the end and on component removal. Earlier inserted data preserve the selected date. ChartTimeView intersects the current period with the existing grid-filtered view while retaining original row nodes. No aggregation, interpolation, cumulative window or gesture is introduced. Empty periods remain selectable. Existing engine capabilities, including uPlot's numeric-X requirement, remain unchanged.

Verification: canonical build and 83 chart/collection unit tests passed. Chromium and WebKit passed temporal snapshots and playback for ECharts, Plotly, Vega and uPlot, manual pause, calendar period changes, bounds changes, end/restart, Off and removal cleanup. The existing four-engine browser suite also passed filtering, capabilities, incompatible options, resizing and reload. Visual inspection confirmed a full-width slider and visible period label. The Python-first canonical time_snapshots example lives in gramlot-examples; its syntax was checked. Core qualification uses its own independent fixture. Local proof: http://127.0.0.1:8898/#temporal-demo . Implementation verified; owner visual acceptance pending. No release or publication.


<a id="temporal-chart-stable-domains-2026-11-05"></a>
### Stable temporal chart domains — 2026-11-05

Owner: “Sì procedi: assi e colori stabili su tutto l’intervallo temporale, nel componente condiviso e per tutti i motori. Ricalcolali solo quando cambiano dati, filtri o configurazione.” Implemented shared chartDomains cached by ChartTimeView over dated rows in the accepted non-temporal filtered view. Period changes reuse the same domain object. Store/filter notifications invalidate it; relevant configuration changes recompute it. No application state or engine-specific calculation is added to examples.

ECharts, Plotly, Vega and uPlot consume fixed numeric ranges and ordered category domains for their supported charts. Left/right measure scales remain independent; stacked bounds account for positive and negative series totals for drawing only. Cartesian 3D keeps full coordinate domains and Z bounds, including category indices when a category is absent from a frame. Pie/donut category colors use a shared stable palette; configured measure colors remain unchanged. ECharts/Plotly 2D maps share a fixed complete-interval color extent and signed palette. Geographic geometry and camera behavior retain their existing contracts; this does not introduce time interpolation of territories or paths. Empty temporal frames retain Cartesian axes; disabling animation restores ordinary automatic domains. Date intervals remain UTC. Source values are never aggregated or rewritten.

Verified canonical build and 89 chart/collection tests. Tests cover cache reuse, invalidation, independent axes, missing categories, category colors, signed maps, empty periods, stack bounds and 3D coordinate stability. Chromium and WebKit verify fixed axis/legend labels during playback with all four engines, and future data insertion/removal updates Plotly's visible range immediately. Existing four-engine browser regression passed filters, capabilities, incompatible configuration, resize and reload. Local proof remains http://127.0.0.1:8898/#temporal-demo . Implementation verified; owner visual acceptance pending. No release or publication.


### Expandable temporal configuration and granular periods — 2026-11-05

Owner authorized “settimane da lunedì a domenica in UTC” and “la sezione espandibile e i passi temporali in funzione del tipo di dato, lasciandoli modificabili”. Implemented standard Source details/summary around the shared temporal controls, initially closed. Slider and Play/Pause remain outside the disclosure. Date columns offer day/week/month/year; Date values classified as time-bearing by the existing TYTX getDateType additionally enable hour/minute. This is observed value precision, not an independent declared schema: all-midnight values generally classify as date-only. Explicit period settings are never silently rewritten.

Absent timeStep now defaults to auto. Automatic selects the finest applicable unit with at most 36 transitions, or year for longer spans; the resolved timeUnit is displayed. Existing explicit month/day/year configurations retain their values. timeHasClock and timeUnit are derived configuration Bag outputs. ChartTimeline caches the precision/range profile until the field or store changes; timer ticks do not rescan it. Weeks use Monday 00:00 through Sunday in UTC, including cross-year and pre-epoch dates. Hour/minute labels show time and UTC; weekly labels show both endpoints. All existing fixed-domain and filter behavior is retained.

Verified build and 92 chart/collection tests. Chromium and WebKit passed disclosure visibility, date-only intraday disabling, timestamp enablement, week/hour/minute/automatic changes, playback/manual pause, fixed axes, data-change invalidation, Off and removal cleanup across the four engines. Existing engine regression also passed filtering, capabilities, resize and reload. Visual inspection confirmed the shared disclosure layout. The independent Python qualification adds recorded_at timestamps to permit direct intraday trials. Local proof: http://127.0.0.1:8898/#temporal-demo . Implemented and verified; owner visual acceptance pending. No release or publication.


### Sparse temporal periods — 2026-11-05

Owner confirmed keeping the last available snapshot by default, with an explicit Show empty alternative. Implemented timeEmpty=previous/empty in the shared configurator and temporal view. The projection selects the most recent occupied period at or before the cursor from the currently filtered rows; it is deterministic when scrubbing backwards, reacts to inserted data and does not resurrect filtered-out rows. It never borrows future data before the first eligible period, merges entities across periods or interpolates measures. New periods with data replace the whole snapshot. This supersedes blank-by-default gaps.

The slider retains the requested date; a secondary Showing label identifies the retained snapshot's period only when different. The derived timeSnapshotLabel lives in the existing configuration Bag. Explicit empty mode preserves empty-frame axes. Shared fixed domains, UTC granularity, playback and engine capabilities are unchanged.

Verified build, 93 chart/collection tests and the targeted domain tests after explicitly selecting empty policy. Chromium and WebKit passed previous/empty switching on weekly gaps for all four engines, retained-date labeling, existing playback, granular periods, fixed axes, Off and cleanup. The existing engine regression passed filters, resize, reload and compatibility controls. Local proof: http://127.0.0.1:8898/#temporal-demo . Implemented and verified; owner visual acceptance pending. No release or publication.


<a id="gc-070-australian-temporal-real-data"></a>
### Australian temporal qualification — 2026-11-05

Implemented the owner-authorized connected trial in gramlot-examples and gramlot-py-server. The shared chart/search core is unchanged. Source contains 410,429 invoice lines and 60,179 invoices, 2022–2025. Read-only repeatable-read preparation reconciles invoice totals with line totals and grouped revenue/counts, then returns 384 monthly or 11,612 daily territory rows. The Python page uses frameGrid(searchOn=True), shared ChartPane, standard RPC and configuration Bags. Three measures and all four engines pass territory filtering and clearing, temporal changes and store replacement in Chromium/WebKit. Five sales-provider tests pass. No raw invoice/customer records or credentials are persisted in the repository.

Local measurement (20 cursor changes per case; 16 browser/grain/engine cases): initial monthly load 1.58–1.95 s; daily reload 0.81–0.97 s. Daily update median 33–34 ms, p95 up to 51 ms, including two animation-frame callbacks; this is not animation completion or isolated rendering CPU time. Synchronous dispatch median 3–7 ms; daily territorial filtering 259–433 ms. Tests render at most eight territories per frame, so they do not establish throughput for hundreds of thousands of drawn points. The source line count must not be confused with browser store size. Some preliminary SQL timings varied up to 3.63 s; published figures above describe the measured browser run, not a service guarantee.

The search question was answered with a scoped guarantee: shared FrameGrid/searchBox and facet search reuse standard controls; the Australian page uses them without local search code. No whole-gallery migration audit is claimed. Local preview: http://127.0.0.1:8902/australian_timeline . Implementation and qualification complete; owner visual acceptance pending. No release or publication.


<a id="gc-070-chart-playback-presentation"></a>
### Shared playback presentation — 2026-11-05

Owner accepted the visible trial (“direi che va bene”) and requested classic playback icons and improved appearance. ChartPane now uses the shared icon-only button presentation: Play becomes Pause while running; Stop pauses and resets to the first period. Accessible names and tooltips follow state. A compact themed toolbar groups the controls, full-width slider and tabular date label; the retained snapshot date remains secondary. The row can wrap on narrow layouts. No application-local button styling, alternate state or renderer change.

Build passed. Chromium and WebKit passed the temporal suite with all four engines, including accessible Play/Pause names, Stop reset/no subsequent ticking, manual pause, empty-period policy and component cleanup. Visual inspection confirmed proportional monochrome controls and the compact toolbar. The Australian preview was refreshed and the in-app browser verified both controls after loading 384 monthly rows. Local preview remains http://127.0.0.1:8902/australian_timeline . Implemented and verified; no release or publication.


<a id="gc-070-chart-period-arrows"></a>
### Temporal previous/next controls — 2026-11-05

Owner requested two arrows to move one period without the slider. Shared ChartPane now groups Previous period, Play/Pause, Stop and Next period using the existing icon-only buttons. A step pauses playback, changes timeIndex by exactly one and clamps at the current bounds. Previous is disabled at zero; Next uses derived timeAtEnd, recalculated from both timeIndex and timeMax. Single-period ranges disable both arrows. Empty periods retain their configured previous/empty behavior; arrows do not skip them.

Build and Chromium/WebKit temporal qualification passed, including forward/backward movement, pause-on-step, start/end and single-period disabling, Stop and the existing four-engine checks. The Australian in-app preview was refreshed: Previous is disabled initially and Next is available. No local example implementation, new component or publication.


<a id="gc-070-australian-geography"></a>
### Australian geographic navigation — 2026-11-05

Owner approved the Australia → State → suburbs demo. Shared chartView now writes selectedTerritory on a 2D map click, with ECharts/Plotly adapters and a binding through ChartPane configuration. No application DOM/event wiring is used. Python gallery composition uses ordinary dataRpc, FrameGrid/search and ChartPane; the host owns exact locality matching, read-only invoice aggregation and lazy per-State geometry loading. The year (2022–2025), measure and grid filter remain unchanged across navigation. Suburb names use hover rather than overlapping labels. The shared GeoJSON summary displays a count for large files.

ABS SAL 2021 geometries were downloaded from the official service with outSR=4326, precision=4 and maxAllowableOffset=0.001. Nonspatial ABS records have no displayed geometry. All eight States validate (15,329 spatial features); their 2025 sales totals reconcile with Australia. Exact name matching deliberately leaves unmatched/ambiguous localities in the table and totals, with visible counts. Owner approved the State-suffix rule afterward; only standalone official parenthesized State labels are removed for matching within that State. Ambiguous cases remain unmatched. Coverage for 2025 is 553/681 active locality pairs, including 93/97 in Tasmania.

Verified: runtime build, 72 chart tests, ten host sales tests; Chromium and WebKit exercise actual map clicks in both engines, back navigation and year/measure/search retention. The browser receives only the selected State's boundaries. Local preview: http://127.0.0.1:8903/australian_geography . No release/publication; implemented and verified, awaiting owner visual acceptance. Host/provider metrics and screenshots are local under /tmp/australian-drilldown; no raw customer identifiers were exported.


<a id="gc-070-geographic-values-bars"></a>
### Geographic values and 3D columns — 2026-11-05

Owner approved map color/value verification and overlaid 3D bars, then requested the height baseline as a configuration option. Rendering checks confirmed that the existing grey regions mostly had no matched sales; low-value colors and thick borders made populated regions difficult to distinguish. The shared positive palette now has a visible blue low endpoint and thinner boundaries. mapLabelMode offers none/name/value/nameValue; compact numeric labels retain exact tooltip values and zero remains a value. ECharts uses native overlap layout; Plotly hides overlapping/offscreen text after render/relayout and enables geographic wheel zoom. Large GeoJSON summaries stay compact.

New mapBar3D is ECharts GL-only and appears through render_ capability discovery. Interior display anchors respect polygon holes and choose the largest island. Selected measures have grouped bars, configured colors and one common altitude scale; values are unmodified and unmatched territories have no bar. mapBarScale chooses zero or extent (explicitly truncated baseline). The owner-approved invisible scatter reference fixes the chosen range, including cached temporal extents, and never appears in store, legend or tooltip. No Plotly mesh emulation or data aggregation was added.

Verified: runtime build and 75 chart tests, including actual ECharts color assignment, zero/missing labels, interior anchors, grouped raw measures, and zero/extent references. Chromium and WebKit verified graduated colors, numeric labels and zoom in 2D, Plotly matched rows, ECharts GL two-measure rendering, capability hiding, baseline selection and return to 2D. Screenshots/logs are local under /tmp/map-values. The Australian demo remains at http://127.0.0.1:8903/australian_geography; local data matches 93/97 Tasmania localities with 2025 sales. Core rendering is reusable; the gallery only supplies configuration/data. No release or publication; visual acceptance remains with the owner.
