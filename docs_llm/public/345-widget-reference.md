# Widget and parameter reference

Document ID: **GC-345**.

Grouped by purpose; shared parameters are documented once. The full counterpart
and this compact view both preserve types, defaults, bindings and child contracts.
Development reference; no maturity or release acceptance is implied.

<a id="gc-345-005"></a>
<a id="gc-345-010"></a>

Ordinary Source/CSS attributes remain in Writing pages and Themes and CSS.
Pages inherit environment collections; Page.gramlots adds missing ones. Buttons are built in.
Contract JSON omits only undeclared keys: no default is not the same as null. dtype: T text, B Boolean, L integer, R real, X structured value; remaining codes are TYTX. binding: read = Data to widget, write = widget to Data, twoWay = both. nullable permits None; enum restricts values; annotation preserves type/regex constraints. Parameters sharing a table row have exactly the same contract. Child grammar: * allows arbitrary Source children; empty permits none. Parent None means no declared restriction.


<a id="gc-345-220"></a>
<a id="gc-345-shared-value"></a>
## Values and bindings

The value type and writeback behavior depend on the control. Use a Data pointer for binding; see [Data binding](097-data-binding.md).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `value` | `{"binding":"twoWay","dtype":"T","nullable":true}` | textbox, radioButtonText, textBoxArea, passwordbox, filteringSelect, callbackSelect, comboBox, dbComboBox, checkBoxText |
| `value` | `{"binding":"twoWay","dtype":"B"}` | checkbox |
| `value` | `{"binding":"twoWay","default":false,"dtype":"B"}` | radioButton, toggleButton |
| `value` | `{"binding":"twoWay","default":"#000000","dtype":"T"}` | colorpicker |
| `value` | `{"binding":"twoWay","default":0,"dtype":"R"}` | horizontalSlider, verticalSlider |
| `value` | `{"binding":"twoWay","dtype":["L","R","N"],"nullable":true}` | numberTextBox |
| `value` | `{"binding":"twoWay","dtype":"D","nullable":true}` | dateTextBox, dateCalendar |
| `value` | `{"binding":"twoWay","dtype":"H","nullable":true}` | timeTextBox |
| `value` | `{"binding":"twoWay","dtype":["T","L"],"nullable":true}` | dbSelect |
| `value` | `{"binding":"twoWay","default":"","dtype":"T"}` | codeMirror, htmlEditor, markdownEditor |
| `value` | `{"binding":"read","default":"","dtype":"T"}` | htmlPreview, markdownPreview, typstPreview |
| `value` | `{"binding":"twoWay","default":null,"dtype":"T","nullable":true}` | imageUploader |
| `value` | `{"binding":"twoWay","default":null,"dtype":"X","nullable":true}` | chartGeoJSON |

<a id="gc-345-225"></a>
<a id="gc-345-shared-state"></a>
## Disabled, readonly and live updates

Disabled prevents interaction; readonly preserves reading without accepting edits. live controls when edits reach Data. See [Field behavior](105-components.md#gc-105-040).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `disabled` | `{"binding":"read","default":false,"dtype":"B"}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, button, toggleButton, dropDownButton, menuline, codeMirror, htmlEditor, markdownEditor, uploader, imageUploader, attachmentManager |
| `readonly` | `{"binding":"read","default":false,"dtype":"B"}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, toggleButton, codeMirror, htmlEditor, markdownEditor |
| `live` | `{"binding":"read","default":false,"dtype":"B"}` | textbox, checkbox, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox |
| `live` | `{"binding":"read","default":true,"dtype":"B"}` | codeMirror, htmlEditor, markdownEditor |

<a id="gc-345-230"></a>
<a id="gc-345-shared-labels"></a>
## Labels and field presentation

lbl supplies a field label; lbl_position places it. The lbl_* and box_* style families are described in [Themes and CSS](096-themes-and-css.md).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `lbl` | `{"binding":"read","dtype":"T","nullable":true,"qualification":"intl_str"}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, groupBox, codeMirror, htmlEditor, markdownEditor, searchBox |
| `lbl_position` | `{"binding":"read","default":"TL","dtype":"T","enum":["TL","TC","TR","L","R","BL","BC","BR"]}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, groupBox, codeMirror, htmlEditor, markdownEditor |
| `lbl_position` | `{"binding":"read","default":"L","dtype":"T"}` | searchBox |

<a id="gc-345-235"></a>
<a id="gc-345-shared-placeholder"></a>
## Placeholders

Placeholder text is a hint, not a value or a replacement for a field label.

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `placeholder` | `{"default":"","dtype":"T","qualification":"intl_str","target":"control"}` | textbox, textBoxArea, passwordbox, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox |

<a id="gc-345-240"></a>
<a id="gc-345-shared-validation"></a>
## Validation

The validate_* family belongs to the shared validation contract, not to each widget. See [Validation rules, callbacks and messages](105-components.md#gc-105-076). Rule conditions and messages use the documented _if, _iswarning, _error and _warning suffixes. For example: root.textbox(value="^customer.email", lbl="Email", validate_email=True).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `validate_select, validate_email, validate_select_iswarning, validate_notnull_iswarning, validate_empty_iswarning, validate_case_iswarning, validate_len_iswarning, validate_min_iswarning, validate_max_iswarning, validate_email_iswarning, validate_regex_iswarning, validate_call_iswarning, validate_remote_iswarning` | `{"binding":"read","dtype":"B","nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, codeMirror, htmlEditor, markdownEditor |
| `validate_notnull` | `{"binding":"read","default":false,"dtype":"B","nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, codeMirror, htmlEditor, markdownEditor |
| `validate_empty, validate_min, validate_max` | `{"binding":"read","dtype":["T","L","N","R","B","D","H","DH","DHZ"],"nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, codeMirror, htmlEditor, markdownEditor |
| `validate_case` | `{"binding":"read","dtype":"T","enum":["upper","lower","title","capitalize","u","l","t","c"],"nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, codeMirror, htmlEditor, markdownEditor |
| `validate_len, validate_regex, validate_remote` | `{"binding":"read","dtype":"T","nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, codeMirror, htmlEditor, markdownEditor |
| `validate_call, validate_onAccept, validate_onReject, validate__onResult` | `{"dtype":"T","nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, codeMirror, htmlEditor, markdownEditor |
| `validate_timeout` | `{"binding":"read","dtype":"L","nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, codeMirror, htmlEditor, markdownEditor |
| `validate_select_if, validate_notnull_if, validate_empty_if, validate_case_if, validate_len_if, validate_min_if, validate_max_if, validate_email_if, validate_regex_if, validate_call_if, validate_remote_if` | `{"dtype":["T","B"],"nullable":true}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, codeMirror, htmlEditor, markdownEditor |
| `validate_select_error, validate_select_warning, validate_notnull_error, validate_notnull_warning, validate_empty_error, validate_empty_warning, validate_case_error, validate_case_warning, validate_len_error, validate_len_warning, validate_min_error, validate_min_warning, validate_max_error, validate_max_warning, validate_email_error, validate_email_warning, validate_regex_error, validate_regex_warning, validate_call_error, validate_call_warning, validate_remote_error, validate_remote_warning` | `{"binding":"read","dtype":"T","nullable":true,"qualification":"intl_str"}` | textbox, checkbox, radioButtonText, textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider, verticalSlider, numberTextBox, dateTextBox, timeTextBox, filteringSelect, callbackSelect, comboBox, dbSelect, dbComboBox, checkBoxText, dateCalendar, codeMirror, htmlEditor, markdownEditor |

<a id="gc-345-245"></a>
<a id="gc-345-shared-icons"></a>
## Icons and label presentation

icon holds text or an emoji; iconSrc loads an image such as SVG. iconSize sizes the icon; labelPosition controls label presentation on menus and toolbars. See [Menus and toolbars](350-menus-toolbars-and-windows.md).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `icon, iconSrc` | `{"binding":"read","default":"","dtype":"T"}` | button, toggleButton, dropDownButton, menuline |
| `labelPosition` | `{"binding":"read","default":"beside","dtype":"T","enum":["beside","below","tooltip"]}` | menu |
| `iconSize` | `{"binding":"read","default":24,"dtype":"R"}` | menu |
| `labelPosition` | `{"binding":"read","dtype":"T","enum":["beside","below","tooltip"],"nullable":true}` | menuline |
| `iconSize` | `{"binding":"read","dtype":"R","nullable":true}` | menuline |

<a id="gc-345-250"></a>
<a id="gc-345-shared-formatting"></a>
## Locale and formatting

Data retains its typed value; locale and format affect presentation and parsing. workdate supplies date-editing context. See [Typed controls](105-components.md#gc-105-040).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `locale` | `{"binding":"read","dtype":"T","nullable":true}` | numberTextBox, dateTextBox, timeTextBox, dateCalendar |
| `format` | `{"binding":"read","dtype":"T","nullable":true}` | numberTextBox, dateTextBox, timeTextBox |
| `workdate` | `{"binding":"read","dtype":"T","nullable":true}` | dateTextBox, dateCalendar |

<a id="gc-345-255"></a>
<a id="gc-345-shared-windows"></a>
## Window behavior and geometry

Dialog and floatingPane share controls, geometry and state. Their movement, resize and collapse defaults differ as shown below. Dialog remains modal, including when collapsed or maximized. See [Windows](350-menus-toolbars-and-windows.md).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `title` | `{"binding":"read","default":"","dtype":"T"}` | dialog, floatingPane |
| `open, collapsed, maximized` | `{"binding":"twoWay","default":false,"dtype":"B"}` | dialog, floatingPane |
| `closable` | `{"binding":"read","default":true,"dtype":"B"}` | dialog, floatingPane |
| `movable, resizable, collapsible` | `{"binding":"read","default":false,"dtype":"B"}` | dialog |
| `maximizable` | `{"binding":"read","default":false,"dtype":"B"}` | dialog, floatingPane |
| `beforeClose` | `{"dtype":"T","nullable":true}` | dialog, floatingPane |
| `width, height, left, top` | `{"binding":"twoWay","dtype":"T","nullable":true}` | dialog, floatingPane |
| `minWidth, minHeight` | `{"binding":"read","dtype":"T","nullable":true}` | dialog, floatingPane |
| `movable, resizable, collapsible` | `{"binding":"read","default":true,"dtype":"B"}` | floatingPane |
| `docked` | `{"binding":"read","default":false,"dtype":"B"}` | floatingPane |

<a id="gc-345-260"></a>
<a id="gc-345-shared-regions"></a>
## Border and frame regions

BorderContainer and framePane share region arrangement and persistence. Child region parameters stay with each parent below. See [Containers](105-components.md#gc-105-085).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `design` | `{"binding":"read","default":"headline","dtype":"T","enum":["headline","sidebar"]}` | framePane, borderContainer |
| `persist` | `{"binding":"read","default":false,"dtype":"B"}` | framePane, borderContainer |

<a id="gc-345-265"></a>
<a id="gc-345-shared-selection"></a>
## Panel selection

StackContainer and tabContainer select one child panel; selectedPage uses its page name and selected its index. See [Containers](105-components.md#gc-105-085).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `selectedPage` | `{"binding":"twoWay","default":null,"dtype":"T","nullable":true}` | stackContainer, tabContainer |
| `selected` | `{"binding":"twoWay","default":null,"dtype":"L","nullable":true}` | stackContainer, tabContainer |

<a id="gc-345-490"></a>
## Audio and drawing


<a id="gc-345-480"></a>
<a id="gc-345-audioanalyser"></a>
### `audioAnalyser`

Collection: audio. Live microphone waveform and spectrum arrays written into Data.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-audioanalyser).


**Data contract.** running controls capture; waveform and spectrum write numeric arrays as individual Data values. sampleRate, status and error report the session.


**Interaction and events.** Changes to supported configuration update the analyser. Capture failure clears running and reports error.


**Composition.** Invisible leaf component; compose ordinary controls and charts around its bindings.


**Limits and lifecycle.** Requires microphone permission and a secure context. Stop, pagehide and disposal release resources. No recording or persistence.


| Parameters | Contract |
| --- | --- |
| `running` | `{"binding":"twoWay","default":false,"dtype":"B"}` |
| `fftSize` | `{"binding":"read","default":1024,"dtype":"L"}` |
| `frameRate` | `{"binding":"read","default":20,"dtype":"N"}` |
| `minimumDb` | `{"binding":"read","default":-100,"dtype":"N"}` |
| `spectrum, waveform` | `{"binding":"twoWay","dtype":"X","nullable":true}` |
| `sampleRate` | `{"binding":"twoWay","default":0,"dtype":"N"}` |
| `status` | `{"binding":"twoWay","default":"stopped","dtype":"T"}` |
| `error` | `{"binding":"twoWay","default":"","dtype":"T"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-485"></a>
<a id="gc-345-drawingpane"></a>
### `drawingPane`

Collection: drawing. SVG annotation editing over an original Data Bag.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-drawingpane).


**Data contract.** annotations reads and mutates the original Data Bag; image reads an optional background URL.


**Interaction and events.** Shared toolbar actions select, draw, edit text and delete shapes. Bag changes redraw the surface.


**Composition.** Composes a shared Source menu and an SVG drawing surface.


**Limits and lifecycle.** Requires an initialized annotation Bag. Coordinates follow image dimensions or a 1000 by 1000 empty surface. Disposal releases subscriptions; persistence belongs to the application.


| Parameters | Contract |
| --- | --- |
| `image` | `{"binding":"read","default":null,"dtype":"T","nullable":true}` |
| `annotations` | `{"binding":"read","dtype":"X"}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-445"></a>
## Charts


<a id="gc-345-450"></a>
<a id="gc-345-chartpane"></a>
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

<a id="gc-345-455"></a>
<a id="gc-345-chartview"></a>
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

<a id="gc-345-460"></a>
<a id="gc-345-chartfields"></a>
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

<a id="gc-345-465"></a>
<a id="gc-345-chartgeojson"></a>
### `chartGeoJSON`

Collection: charts. Validated GeoJSON input and geographic data summary.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chartgeojson).


**Data contract.** value binds a plain GeoJSON feature collection or null.


**Interaction and events.** Validates supplied geography and displays its summary.


**Composition.** Shared geography input for chart configuration.


**Limits and lifecycle.** Named Polygon/MultiPolygon features only; host owns territorial matching.

Shared contracts: [Values and bindings](#gc-345-shared-value).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-470"></a>
<a id="gc-345-charttimeline"></a>
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

<a id="gc-345-475"></a>
<a id="gc-345-vizabibubble"></a>
### `vizabiBubble`

Collection: vizabi. Specialized host-provided Vizabi bubble session observing Data Bags.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-vizabibubble).


**Data contract.** Reads the original rows and configuration Bag.


**Interaction and events.** Retains supported session configuration and releases engine resources on removal.


**Composition.** Specialized external bubble view.


**Limits and lifecycle.** Requires host-supplied libraryUrl; not a chartPane engine.


| Parameters | Contract |
| --- | --- |
| `storepath, libraryUrl` | `{"dtype":"T"}` |
| `rowMode` | `{"default":"attributes","dtype":"T"}` |
| `configuration` | `{"binding":"read","dtype":"X"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-430"></a>
## Grids and search


<a id="gc-345-365"></a>
<a id="gc-345-grid"></a>
### `grid`

Collection: grid. Virtualized Bag rows with a declarative column structure; database access belongs to the store/provider.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-grid).


**Data contract.** storepath identifies the row Bag. Explicit rowMode selects nested value Bags or row-node attributes. Resident grids share row identity and own independent order and filter. A windowed provider supplies windowInfo and loading and can consume viewport and sortRequest writes.


**Interaction and events.** Headers support ordering and column manipulation. Optional row headers, resizing and self-drag expose row operations. Double-click or Enter/F2 opens an editable cell, Enter commits, Tab moves and Escape discards unfinished text.


**Composition.** Provide one inline struct or an external structure Bag via structpath. The frameGrid recipe supplies toolbar and search composition. Local editors use ordinary Source controls in an enclosing form session or a standalone session.


**Limits and lifecycle.** Resident virtualization bounds rendered rows while the Bag stays resident. Windowed data needs a provider and local editing is resident-only. Local changes, drafts and errors survive viewport recycling. Database queries and durable writes belong to the application integration.


| Parameters | Contract |
| --- | --- |
| `columnFilters, loading, rowHeaders, rowResize, selfDragRows` | `{"binding":"read","default":false,"dtype":"B"}` |
| `setFilter, sortedBy` | `{"binding":"read","default":"","dtype":"T"}` |
| `windowInfo` | `{"binding":"read","default":null,"dtype":"X","nullable":true}` |
| `viewport` | `{"binding":"write","default":null,"dtype":"X","nullable":true}` |
| `sortRequest` | `{"binding":"write","default":"","dtype":"T"}` |
| `storepath, structpath, rowMode` | `{"dtype":"T"}` |
| `filter` | `{"annotation":{"kind":"type","module":"builtins","name":"dict"},"binding":"read","default":null,"nullable":true}` |

Child grammar: `struct,div`; parent grammar: `None`.

<a id="gc-345-370"></a>
<a id="gc-345-searchbox"></a>
### `searchBox`

Collection: grid. Search control connected to the enclosing grid Source context.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-searchbox).


**Data contract.** searchOn chooses eligible columns. searchLiteral=True uses literal case-insensitive text matching; the default retains regular expressions. Accepted queries update only the target view's search contribution, in AND with its base filter and setFilter; clearing search preserves both. Bind searchTime to record elapsed filter evaluation time. The input draft stays local until it can be applied.


**Interaction and events.** Typing starts a short debounce and Enter applies immediately. Changing columns, Escape or Clear removes the filter. Invalid or incomplete expressions retain the last accepted filter.


**Composition.** Leaf control that resolves the grid through its FrameGrid recipient. Put it in the FrameGrid search composition.


**Limits and lifecycle.** Works against the resident view. Number and date syntax depends on the column type and locale. Removal cancels the timer and releases view subscriptions.

Shared contracts: [Labels and field presentation](#gc-345-shared-labels).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |
| `searchLiteral, searchHelp` | `{"binding":"read","default":false,"dtype":"B"}` |
| `searchOn` | `{"binding":"read","default":true,"dtype":["B","T"]}` |
| `searchTime` | `{"binding":"write","default":null,"dtype":"R","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-435"></a>
## Conversations


<a id="gc-345-375"></a>
<a id="gc-345-chatmessages"></a>
### `chatMessages`

Collection: chat. Scrollable live Source message viewport; ChatPane composes the conversation interface around it.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chatmessages).


**Data contract.** Displays its Source children. The separate ChatPane recipe creates and binds conversation, message and draft Data. Page Logic renders strings literally and gives Source messages independent scopes.


**Interaction and events.** The viewport is a focusable scroll region with polite log announcements. ChatPane Logic owns sending, request correlation, message rendering and conditional follow-on-scroll. ChatPageStore's processing hook may return text or Gramlot Source.


**Composition.** Accepts ordinary Source children. Python ChatPane composes the viewport with frame regions, composer, toolbar, actions and controllers.


**Limits and lifecycle.** The viewport declares no send, provider or persistence parameters. The recipe needs the supporting collections, Page Logic and a working PageStore. Application code owns authorization and provider integration.

No additional component-specific parameters.


Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-440"></a>
## Reusable fragments


<a id="gc-345-380"></a>
<a id="gc-345-grouplet"></a>
### `grouplet`

Collection: grouplets. Reusable Source fragment loaded through the existing remote binding.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-grouplet).


**Data contract.** The read-bound remote name selects a reusable Source endpoint. datapath gives each instance a scope for relative child bindings. Shared remote binding governs readiness and caching.


**Interaction and events.** Remote loading and replacement use ordinary Source lifecycle. Removal cancels pending work and suppresses late results. It declares no additional completion or save callback.


**Composition.** Accepts ordinary authored Source children and remote fragments, including nested fragments. Activate collections used by the children.


**Limits and lifecycle.** Uses the standard remote Source endpoint contract. Record loading, editing policy and persistence belong to the composed application.


| Parameters | Contract |
| --- | --- |
| `remote` | `{"binding":"read","dtype":"T","nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-385"></a>
<a id="gc-345-groupletcard"></a>
### `groupletCard`

Collection: grouplets. A titled, foldable remote-content card with bound controls and an optional Markdown guide.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-groupletcard).


**Data contract.** Bind collapsed and checkbox two ways to retain changes in Data. Null checkbox hides it and false shows it unchecked. Title, label, header side, collapsible, delitem and doc are read inputs. Body bindings use the card's instance scope.


**Interaction and events.** Header controls fold and toggle the checkbox. An authored menu can supply actions. Clear asks for confirmation and rechecks its gate before clearing eligible values. The information button opens the Markdown guide. It declares no additional save or completion callback.


**Composition.** Accepts authored or remote Source body children, including nested cards. An authored menu supplies header actions.


**Limits and lifecycle.** Header side accepts top, left or right. Null delitem hides Clear, false disables it and true enables it. Clear affects direct untransformed reactive body value bindings within scope, preserving header state. Body replacement or removal invalidates pending confirmation.


| Parameters | Contract |
| --- | --- |
| `remote` | `{"binding":"read","dtype":"T","nullable":true}` |
| `title, checkboxLabel` | `{"binding":"read","default":"","dtype":"T","qualification":"intl_str"}` |
| `chromeSide` | `{"binding":"read","default":"top","dtype":"T","enum":["top","left","right"]}` |
| `collapsible` | `{"binding":"read","default":false,"dtype":"B"}` |
| `collapsed` | `{"binding":"twoWay","default":false,"dtype":"B"}` |
| `checkbox` | `{"binding":"twoWay","default":null,"dtype":"B","nullable":true}` |
| `delitem` | `{"binding":"read","default":null,"dtype":"B","nullable":true}` |
| `doc` | `{"binding":"read","default":"","dtype":"T"}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-300"></a>
## Text fields


<a id="gc-345-015"></a>
<a id="gc-345-textbox"></a>
### `textbox`

Collection: inputs. Single-line text with label, validation and optional live updates.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-textbox).


**Data contract.** A nullable two-way string. Null displays as empty, while clearing an edited field writes an empty string.


**Interaction and events.** Change commits the string. With `live=True`, input commits outside IME composition. There is no component-specific change callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** Single-line plain text. Outside an editing session, rejected validation can leave a visible draft while Data retains its previous value. In a shared editing session, parseable edits can update Data while validation records errors and blocks acceptance.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-035"></a>
<a id="gc-345-passwordbox"></a>
### `passwordbox`

Collection: inputs. Masked text entry; masking does not encrypt or persist the value.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-passwordbox).


**Data contract.** A nullable two-way string. The native password control masks its display while the binding carries the entered string.


**Interaction and events.** Change commits the string. With `live=True`, input commits outside IME composition. There is no component-specific change callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** The component supplies visual masking. Credential handling and storage remain application responsibilities.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-030"></a>
<a id="gc-345-textboxarea"></a>
### `textBoxArea`

Collection: inputs. Multiline plain text with the same field and validation contract.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-textboxarea).


**Data contract.** A nullable two-way string can include line breaks. Reactive row and column counts change the presentation of the same Data.


**Interaction and events.** Change commits the string. With `live=True`, input commits outside IME composition. There is no component-specific change callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** The textarea handles plain text. Changing the row count preserves the existing control and caret.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |
| `rows` | `{"binding":"read","default":4,"dtype":"L","target":"control"}` |
| `cols` | `{"binding":"read","default":24,"dtype":"L","target":"control"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-305"></a>
## Choices and selectors


<a id="gc-345-020"></a>
<a id="gc-345-checkbox"></a>
### `checkbox`

Collection: inputs. Boolean value, displayed as a checkbox or a switch.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-checkbox).


**Data contract.** A two-way Boolean is shared by checkbox and switch modes. The option caption and switch color affect presentation.


**Interaction and events.** Changing the checked state commits a Boolean. There is no component-specific toggle callback.


**Composition.** A field leaf. Use `label` for the inline option caption and `lbl` for the shared field label.


**Limits and lifecycle.** Only `checkbox` and `switch` are valid modes. Readonly prevents activation while external Data can still update the check.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |
| `mode` | `{"binding":"read","default":"checkbox","dtype":"T","enum":["checkbox","switch"]}` |
| `switch_color` | `{"binding":"read","default":null,"dtype":"T","nullable":true}` |
| `label` | `{"default":"","dtype":"T","qualification":"intl_str","target":"optionCaption"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-040"></a>
<a id="gc-345-radiobutton"></a>
### `radioButton`

Collection: inputs. One Boolean radio option; the Source-scoped group keeps its members mutually exclusive.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-radiobutton).


**Data contract.** Each member owns a two-way Boolean path. Selecting a member of a Source-scoped group clears the other members' Boolean values.


**Interaction and events.** Native activation and group keyboard navigation select a member. Writes go through the member bindings. There is no component-specific group callback.


**Composition.** A field leaf. Declare group members as separate Source nodes with their own labels and bindings.


**Limits and lifecycle.** Use `disabled` to lock interaction. Removing a member releases its group membership.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values, group` | `{"binding":"read","dtype":"T","nullable":true}` |
| `label` | `{"default":"","dtype":"T","qualification":"intl_str","target":"optionCaption"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-025"></a>
<a id="gc-345-radiobuttontext"></a>
### `radioButtonText`

Collection: inputs. A group of local radio choices storing one option code.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-radiobuttontext).


**Data contract.** A nullable string stores the selected code from the `code:Caption` pairs in `values`.


**Interaction and events.** A native radio change commits the code. There is no component-specific selection callback.


**Composition.** The field generates options from `values` and arranges them in `cols` columns. It takes no Source option children.


**Limits and lifecycle.** The column count must be positive. Readonly and disabled lock the options. Caption updates can retain the selected code.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |
| `values` | `{"binding":"read","dtype":"T"}` |
| `cols` | `{"binding":"read","default":1,"dtype":"L"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-100"></a>
<a id="gc-345-checkboxtext"></a>
### `checkBoxText`

Collection: inputs. Multiple choices from text, a Bag, a remote list or the shared checkbox tree.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-checkboxtext).


**Data contract.** A nullable string stores comma-separated codes, or null for no selection. Editing preserves the order of retained codes and appends newly selected ones.


**Interaction and events.** A native check change commits the code list. Arrows, Home and End move focus among options. There is no component-specific selection callback.


**Composition.** The field generates options from text or Bag `values`, or a complete `dbtable`/`method` result. `popup=True` puts the same choices behind a caption button; `cols` arranges them. It takes no Source option children.


**Limits and lifecycle.** The column count must be positive. Readonly and disabled lock the options. An edit preserves stored codes that have no current visible option.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |
| `values` | `{"binding":"read","default":"","dtype":["T","X"]}` |
| `cols` | `{"binding":"read","default":1,"dtype":"L"}` |
| `popup, hierarchical` | `{"binding":"read","default":false,"dtype":"B"}` |
| `checkChildren` | `{"binding":"read","default":true,"dtype":"B"}` |
| `identifier, labelAttribute, dbtable, method, caption_field, order_by, condition` | `{"binding":"read","dtype":"T"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-045"></a>
<a id="gc-345-colorpicker"></a>
### `colorpicker`

Collection: inputs. Browser color input, with a bound color value.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-colorpicker).


**Data contract.** A two-way color string projects to a native color input, with `#000000` as the component default.


**Interaction and events.** The native chooser commits on change, or on input with `live=True`. There is no component-specific color callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** The browser supplies the chooser and its accepted color representation. Use `disabled` to lock it.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-075"></a>
<a id="gc-345-filteringselect"></a>
### `filteringSelect`

Collection: inputs. Search a closed set of local choices; Data stores the selected code.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-filteringselect).


**Data contract.** A nullable string code resolves to a caption in local `values`. Search matches captions case-insensitively and identity lookup compares codes.


**Interaction and events.** Mouse or keyboard choice commits the code. Clearing commits null and Escape cancels the draft. There is no component-specific selection callback.


**Composition.** The control builds its own popup. Declare choices through the provider, with no Source option children.


**Limits and lifecycle.** An unmatched caption remains a draft even in live mode. Codes must be nonempty and unique. `separator` changes the delimiter between declared options.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |
| `values` | `{"binding":"read","default":"","dtype":"T"}` |
| `separator` | `{"binding":"read","default":",","dtype":"T"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-080"></a>
<a id="gc-345-callbackselect"></a>
### `callbackSelect`

Collection: inputs. Choices supplied by a page callback.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-callbackselect).


**Data contract.** A nullable string code. The named browser Logic provider returns `{rows, identifier, caption}` with unique nonempty string codes and string captions.


**Interaction and events.** The provider receives `_querystring` or `_id` and can return a Promise. Mouse or keyboard choice commits the code. There is no component-specific selection notification.


**Composition.** The control builds its own popup. Declare choices through the provider, with no Source option children.


**Limits and lifecycle.** The provider owns filtering. The editor discards obsolete results on superseding edits and release and reports lookup failures in its choice error state.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |
| `callback` | `{"dtype":"T"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-085"></a>
<a id="gc-345-combobox"></a>
### `comboBox`

Collection: inputs. Suggestions with free text allowed.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-combobox).


**Data contract.** A nullable string stores the entered text or selected caption. Supply `values` (which may be empty) or a `store` Bag whose node values are unique string codes and whose `caption` attributes are strings.


**Interaction and events.** Mouse or keyboard choice commits the caption. Free text also commits through the editor, including live input outside composition. There is no component-specific selection callback.


**Composition.** The control builds its own popup. Declare choices through the provider, with no Source option children.


**Limits and lifecycle.** The bound value distinguishes null from an edited empty string. Malformed or duplicate Bag choices are rejected.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |
| `values` | `{"binding":"read","default":"","dtype":"T"}` |
| `separator` | `{"binding":"read","default":",","dtype":"T"}` |
| `store` | `{"binding":"read","default":null,"dtype":"X","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-090"></a>
<a id="gc-345-dbselect"></a>
### `dbSelect`

Collection: inputs. Remote choices through an application method or the configured Asqueel integration; the component itself supplies no database adapter.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-dbselect).


**Data contract.** A nullable string or safe integer key identifies the selection. The endpoint returns `{rows, identifier, caption}`. Caption, record and requested `selected_*` projections are separate from the key.


**Interaction and events.** The page's remote service uses `method` for searches and identity lookup. Accepted selection writes the outputs and calls optional named Logic `selectedCb` with `{value, record}`. Identity resolution can refresh outputs without notifying that callback.


**Composition.** A field leaf with an internal popup. Its optional sanitized row template supports record placeholders in text.


**Limits and lifecycle.** Unmatched drafts cannot write a key. `autoSelect` checks for a sole candidate with a two-row request. Selections using `validate_notnull` have a condition-change check. Database behavior and required response fields belong to the provider.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |
| `dbtable, caption_field, condition, columns, hiddenColumns, auxColumns, template, order_by` | `{"binding":"read","dtype":"T"}` |
| `weakCondition` | `{"binding":"read","default":false,"dtype":["B","T"]}` |
| `method` | `{"binding":"read","default":"dbSelect","dtype":"T"}` |
| `templateNull` | `{"binding":"read","default":"","dtype":"T"}` |
| `limit` | `{"binding":"read","default":10,"dtype":"L"}` |
| `searchDelay` | `{"binding":"read","default":300,"dtype":"L"}` |
| `ignoreCase, hasDownArrow` | `{"binding":"read","default":true,"dtype":"B"}` |
| `emptyLabel` | `{"binding":"read","default":"Clear selection","dtype":"T","qualification":"intl_str"}` |
| `selectedCaption, selectedRecord, selectedCb` | `{"dtype":"T"}` |
| `autoSelect` | `{"binding":"read","default":false,"dtype":"B"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-095"></a>
<a id="gc-345-dbcombobox"></a>
### `dbComboBox`

Collection: inputs. Remote suggestions with free text; the application owns authorization and persistence.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-dbcombobox).


**Data contract.** A nullable string stores a selected caption or free text. Selection can populate caption, record and field projections. Free-text or clear commits remove the previous selection outputs.


**Interaction and events.** The remote service supplies suggestions. Choosing a row or committing free text goes through validation. Optional named Logic `selectedCb` receives the accepted value and a record or null.


**Composition.** A field leaf with an internal suggestion popup and optional sanitized row template.


**Limits and lifecycle.** The editor waits for a complete edit even with `live=True`. Condition changes preserve free text and do not auto-select a sole candidate. The provider runs in the configured host.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |
| `dbtable, caption_field, condition, columns, hiddenColumns, auxColumns, template, order_by` | `{"binding":"read","dtype":"T"}` |
| `weakCondition` | `{"binding":"read","default":false,"dtype":["B","T"]}` |
| `method` | `{"binding":"read","default":"dbSelect","dtype":"T"}` |
| `templateNull` | `{"binding":"read","default":"","dtype":"T"}` |
| `limit` | `{"binding":"read","default":10,"dtype":"L"}` |
| `searchDelay` | `{"binding":"read","default":300,"dtype":"L"}` |
| `ignoreCase, hasDownArrow` | `{"binding":"read","default":true,"dtype":"B"}` |
| `emptyLabel` | `{"binding":"read","default":"Clear selection","dtype":"T","qualification":"intl_str"}` |
| `selectedCaption, selectedRecord, selectedCb` | `{"dtype":"T"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-310"></a>
## Numbers, dates and time


<a id="gc-345-060"></a>
<a id="gc-345-numbertextbox"></a>
### `numberTextBox`

Collection: inputs. Locale-aware numeric editing; Data keeps the declared numeric type.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-numbertextbox).


**Data contract.** A nullable typed number. Use the default finite real entry, `dtype='L'` for safe integers or `dtype='N'` for exact Decimal entry. Empty input commits null.


**Interaction and events.** Enter, change and blur attempt a commit. Live editing commits parseable input. Escape restores the accepted value. There is no component-specific change callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** Entry accepts the locale decimal symbol but rejects grouping separators, incomplete numbers and input outside configured bounds. Exact editing requires a Decimal backend and also follows an existing Decimal value. A rejected parse leaves the last typed Data value in place.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation), [Locale and formatting](#gc-345-shared-formatting).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |
| `dtype` | `{"default":"R","dtype":"T"}` |
| `min, max` | `{"binding":"read","dtype":"R","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-050"></a>
<a id="gc-345-horizontalslider"></a>
### `horizontalSlider`

Collection: inputs. A bounded numeric range displayed horizontally.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-horizontalslider).


**Data contract.** A two-way real number uses the native range grid defined by reactive `min`, `max` and `step`.


**Interaction and events.** Native range interaction commits on change, or on input with `live=True`. There is no component-specific slider callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** A finite incoming value that the range clamps or snaps can write a correction through a plain reactive value binding. Shared controls need compatible ranges. Use `disabled` to lock it.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |
| `min` | `{"binding":"read","default":0,"dtype":"R","target":"control"}` |
| `max` | `{"binding":"read","default":100,"dtype":"R","target":"control"}` |
| `step` | `{"binding":"read","default":1,"dtype":"R","target":"control"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-055"></a>
<a id="gc-345-verticalslider"></a>
### `verticalSlider`

Collection: inputs. A bounded numeric range displayed vertically.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-verticalslider).


**Data contract.** A two-way real number uses the same range grid as the horizontal slider.


**Interaction and events.** Native range interaction commits on change, or on input with `live=True`. There is no component-specific slider callback.


**Composition.** A field leaf with an internal range that exposes a vertical accessibility orientation.


**Limits and lifecycle.** Browser range rules can clamp or snap incoming finite Data and write the correction through a plain reactive value binding. Use `disabled` to lock it.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |
| `min` | `{"binding":"read","default":0,"dtype":"R","target":"control"}` |
| `max` | `{"binding":"read","default":100,"dtype":"R","target":"control"}` |
| `step` | `{"binding":"read","default":1,"dtype":"R","target":"control"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-065"></a>
<a id="gc-345-datetextbox"></a>
### `dateTextBox`

Collection: inputs. Civil date editing with an optional calendar popup.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-datetextbox).


**Data contract.** A nullable civil date (`D`). Formatting and text drafts are separate from Data. Relative entry uses `workdate` or local today as its reference.


**Interaction and events.** Enter, change and blur attempt a commit. Live mode commits parseable input, and selecting a calendar day commits the typed date directly. Escape cancels the draft. There is no component-specific date callback.


**Composition.** A field leaf with an internal trigger and popup unless `calendar=False`.


**Limits and lifecycle.** The parser requires a single date unless period_to declares a relative Data output path. An accepted period writes its start to value and its end to period_to; ordinary dates leave that output unchanged. Empty input commits null, while an invalid expression preserves both typed values. Disabling the calendar or releasing the editor closes its popup.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation), [Locale and formatting](#gc-345-shared-formatting).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |
| `period_to` | `{"dtype":"T","nullable":true}` |
| `calendar` | `{"binding":"read","default":true,"dtype":"B"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-105"></a>
<a id="gc-345-datecalendar"></a>
### `dateCalendar`

Collection: inputs. An inline civil-date calendar.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-datecalendar).


**Data contract.** A two-way nullable civil date (`D`). `workdate` can supply the reference day for the calendar view.


**Interaction and events.** Month and keyboard navigation move the view or focus without a Data write. Selecting a day or using Clear commits a date or null. There is no component-specific day callback.


**Composition.** An inline field leaf with internal navigation, day grid and clear control.


**Limits and lifecycle.** Readonly and disabled lock interaction. The control checks for civil dates and locks its view when released.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation), [Locale and formatting](#gc-345-shared-formatting).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-070"></a>
<a id="gc-345-timetextbox"></a>
### `timeTextBox`

Collection: inputs. Civil time editing with locale-aware text parsing.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-timetextbox).


**Data contract.** A nullable civil time (`H`) uses the TYTX time epoch and preserves seconds and milliseconds without a timezone conversion. Clearing commits null.


**Interaction and events.** Enter, change and blur attempt a commit. Live editing commits parseable input. Escape restores the accepted value. There is no component-specific change callback.


**Composition.** The component renders its own control and optional field label. It takes no Source children.


**Limits and lifecycle.** Entry uses a 24-hour clock with minutes, optional seconds and optional fractional seconds. Display formats leave the entry grammar unchanged.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Placeholders](#gc-345-shared-placeholder), [Validation](#gc-345-shared-validation), [Locale and formatting](#gc-345-shared-formatting).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-315"></a>
## Buttons, menus and toolbars


<a id="gc-345-110"></a>
<a id="gc-345-button"></a>
### `button`

Collection: buttons. An application action button using the existing action/Logic contract.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-button).


**Data contract.** A button has no editable value. Disabled state and icon presentation can read Data. A fire action pulses a Data path with the modifier string or true, attaches modifier and _counter metadata, and returns the value to null.


**Interaction and events.** Click or keyboard activation runs one command mechanism. Inline action receives _evt, _counter and modifier flags. A nested dataController receives _evt, button_counter and the modifier flags. A confirmation can gate execution, and _delay groups a burst from its last click.


**Composition.** Use caption content and optionally one direct dataController as the click mechanism. The controller keeps its own reactive Data inputs and initialization behavior.


**Limits and lifecycle.** Competing mechanisms or multiple direct dataControllers raise an error. Disabled or removed buttons drop pending clicks. A Gramlot button never implicitly submits its containing form.

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state), [Icons and label presentation](#gc-345-shared-icons).


| Parameters | Contract |
| --- | --- |
| `action` | `{"dtype":"T","nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-115"></a>
<a id="gc-345-togglebutton"></a>
### `toggleButton`

Collection: buttons. A command button with a bound Boolean selected state.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-togglebutton).


**Data contract.** Bind the boolean value two ways. Data updates the LED and pressed state. Activation commits the new boolean before invoking the command.


**Interaction and events.** Activation flips the boolean and dispatches the change used for binding, then runs the shared button command. Disabled and readonly prevent the flip and command.


**Composition.** Uses the same caption and direct controller composition as button. The LED is provided by the component.


**Limits and lifecycle.** The value represents two states. Removing the Source releases the button command binding.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Icons and label presentation](#gc-345-shared-icons).


| Parameters | Contract |
| --- | --- |
| `action` | `{"dtype":"T","nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-120"></a>
<a id="gc-345-dropdownbutton"></a>
### `dropDownButton`

Collection: buttons. Separate main-action and submenu surfaces; distinct from a menu bar.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-dropdownbutton).


**Data contract.** The default command occurrence is local to the button. With persist enabled, local storage saves the occurrence code for the page URL and explicit button id. It does not store command text or a Data value.


**Interaction and events.** The main segment runs the default command. The arrow opens the menu. Ordinary item activation runs that item. Shift activation also makes it the main command and updates its caption and icon.


**Composition.** Author the main caption and command on the button and place the alternatives in its child menu.


**Limits and lifecycle.** Persistent buttons require an explicit id and menu occurrence codes must be unique. A missing saved code falls back to the authored default. Storage failure leaves in-memory selection usable.

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state), [Icons and label presentation](#gc-345-shared-icons).


| Parameters | Contract |
| --- | --- |
| `action` | `{"dtype":"T","nullable":true}` |
| `persist` | `{"default":false,"dtype":"B"}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-125"></a>
<a id="gc-345-menu"></a>
### `menu`

Collection: buttons. A hierarchy presented as a popup or a permanent horizontal/vertical toolbar.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-menu).


**Data contract.** Menu presentation and resolver inputs can reflect Data. A resolver supplies entries through its named Logic method, with caching governed by cacheTime. The menu has no selected value of its own.


**Interaction and events.** A popup can open from its attached owner or a submenu trigger. Keyboard movement skips unavailable entries and separators. A bar distributes eligible units into overflow and returns them as space becomes available.


**Composition.** Use menuline for commands or submenus, spacer for spacing and contentPane for grouped or embedded content. A bar can be horizontal or vertical.


**Limits and lifecycle.** Opening modifiers match exactly. Popup resolver work can wait for the first opening. Invalid results preserve existing entries and superseded replies cannot replace newer results.

Shared contracts: [Icons and label presentation](#gc-345-shared-icons).


| Parameters | Contract |
| --- | --- |
| `presentation` | `{"default":"popup","dtype":"T","enum":["popup","bar"]}` |
| `orientation` | `{"default":"horizontal","dtype":"T","enum":["horizontal","vertical"]}` |
| `modifiers, resolver` | `{"dtype":"T","nullable":true}` |
| `cacheTime` | `{"default":-1,"dtype":"R"}` |
| `sync` | `{"default":false,"dtype":"B"}` |

Child grammar: `menuline,spacer,contentPane`; parent grammar: `None`.

<a id="gc-345-130"></a>
<a id="gc-345-menuline"></a>
### `menuline`

Collection: buttons. A command, separator, submenu parent or indivisible toolbar group.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-menuline).


**Data contract.** A menu occurrence can read disabled, hidden and checked presentation from Data. Checked is a display binding. Application Logic changes its underlying state.


**Interaction and events.** A line dispatches its command or opens its submenu. Command occurrences can carry distinct parameters. Delayed delivery captures the parameters at activation and is cancelled if the occurrence becomes unavailable.


**Composition.** Use a caption and optional icon, or give the line a child menu for a submenu. A separator or grouped presentation does not dispatch a command from its padding.


**Limits and lifecycle.** A command and submenu on the same occurrence are mutually exclusive. An unknown command does not dispatch, and nested frames keep their own command recipients.

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state), [Icons and label presentation](#gc-345-shared-icons).


| Parameters | Contract |
| --- | --- |
| `action, command, caption, code, tooltip` | `{"dtype":"T","nullable":true}` |
| `checked` | `{"binding":"read","dtype":"B","nullable":true}` |
| `group, favorite` | `{"default":false,"dtype":"B"}` |
| `parameters` | `{"annotation":{"kind":"type","module":"builtins","name":"dict"},"nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-135"></a>
<a id="gc-345-spacer"></a>
### `spacer`

Collection: buttons. Fixed or elastic space in a menu/toolbar; it does not publish a command.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-spacer).


**Data contract.** size specifies fixed space in pixels. flex assigns a positive share of remaining layout space. Neither parameter represents application Data.


**Interaction and events.** The spacer is decorative and has no activation. A toolbar consumes elastic space before moving trailing units to its popup.


**Composition.** Place it between menu or toolbar items as a leaf.


**Limits and lifecycle.** size and flex are mutually exclusive. A fixed size must be finite and nonnegative. A flex factor must be finite and positive.


| Parameters | Contract |
| --- | --- |
| `size, flex` | `{"dtype":"R","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-320"></a>
## Forms and containers


<a id="gc-345-355"></a>
<a id="gc-345-editingstatus"></a>
### `editingStatus`

Collection: inputs. Changes and validation feedback from the nearest Source form state.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-editingstatus).


**Data contract.** Reads the nearest shared editing session's errors and baseline-relative changes. It declares no value binding or separate change journal.


**Interaction and events.** Errors and Changes open live reports. Selecting an entry asks the session to focus the Data path and closes the report on success. There is no public report callback.


**Composition.** Place this leaf within a Source scope that provides a shared editing session. Its internal report controls take no Source children.


**Limits and lifecycle.** Mounting without a session raises an error. A field that cannot be focused leaves a notice without changing the grid filter. Disconnecting releases the session subscription and closes the popup.

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-155"></a>
<a id="gc-345-formlet"></a>
### `formlet`

Collection: layout. Responsive field layout with shared label alignment.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-formlet).


**Data contract.** Fields retain their own Data bindings. Resolved lbl_* and box_* defaults are inherited by descendants from the declaring scope, and explicit child values override them.


**Interaction and events.** The grid and label projection update when presentation inputs change, keeping field drafts and focus with their existing controls.


**Composition.** Place fields or nested layout children inside the formlet. columns can specify a positive integer or CSS track list. col_min_width switches to an auto-fitting grid.


**Limits and lifecycle.** Invalid numeric column counts raise an error. This layout does not create an editing session. Label measurement observers are released on detach.


| Parameters | Contract |
| --- | --- |
| `columns` | `{"binding":"read","default":1,"dtype":["L","T"]}` |
| `col_min_width` | `{"binding":"read","dtype":"T","nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-160"></a>
<a id="gc-345-groupbox"></a>
### `groupBox`

Collection: layout. A labelled content group with an optional scoped Data copy command.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-groupbox).


**Data contract.** Descendants use the enclosing Source Data scope. Copy reads the current scoped Bag. TYTX retains types and attributes, and JSON contains values only.


**Interaction and events.** With copy enabled, the header action copies TYTX and the format menu offers TYTX or JSON. The header reports clipboard success or failure.


**Composition.** Place arbitrary Source content under the labeled group. Choose bar, underline or card presentation through lbl_variant.


**Limits and lifecycle.** Copy requires a usable browser clipboard. The box disables its copy actions while a copy is pending and ignores late feedback after detaching. The heading has no collapse control or state.

Shared contracts: [Labels and field presentation](#gc-345-shared-labels).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |
| `copy` | `{"binding":"read","default":false,"dtype":"B"}` |
| `lbl_variant` | `{"binding":"read","default":"bar","dtype":"T","enum":["bar","underline","card"]}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-165"></a>
<a id="gc-345-contentpane"></a>
### `contentPane`

Collection: layout. A content area or a child region/panel of a layout container.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-contentpane).


**Data contract.** The pane has no value binding. Content and its Data scope follow the Source composition. Authored flex layout is projected into the wrapper containing the slotted children.


**Interaction and events.** The pane scrolls its content when needed. In a frame or border container the parent owns region events and chrome.


**Composition.** Accepts arbitrary Source children. Use it as a direct framePane region or as a standalone scrollable pane.


**Limits and lifecycle.** Flex projection covers direction, wrapping, alignment and gaps. Region sizing and splitter writeback are provided by the owning container.

No additional component-specific parameters.


Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-170"></a>
<a id="gc-345-bordercontainer"></a>
### `borderContainer`

Collection: layout. Five regions with optional splitters, drawers and nested layouts.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-bordercontainer).


**Data contract.** Numeric regional width or height with a writable binding receives live splitter updates. Literal, read-only, CSS string and transformed dimensions do not gain writeback. With persist enabled, sizes can be restored by stable container id.


**Interaction and events.** Splitters support pointer and keyboard resizing. Drawer activation can call drawer_onclick with evt and show. Region events include closable_change on the child and splitter_resize on the parent.


**Composition.** Give each direct child a distinct top, bottom, left, right or center region. Side children can opt into splitters, drawers or detachment while retaining their Source content.


**Limits and lifecycle.** Splitters are always live. Invalid or duplicate regions, inconsistent size limits and persistence without a stable id raise errors.

Shared contracts: [Border and frame regions](#gc-345-shared-regions).

No additional component-specific parameters.


Child grammar: `*`; parent grammar: `None`.

Child parameters projected by the parent:

| Parameters | Contract |
| --- | --- |
| `detachable` | `{"default":false,"dtype":"B"}` |
| `title` | `{"default":"","dtype":"T"}` |
| `region` | `{"enum":["top","bottom","left","right","center"],"required":true,"unique":true}` |
| `width, height` | `{}` |
| `drawer_onclick` | `{"inline":["evt","show"]}` |

<a id="gc-345-150"></a>
<a id="gc-345-framepane"></a>
### `framePane`

Collection: layout. A border composition exposing top, bottom, left, right and center region builders.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-framepane).


**Data contract.** Uses the border layout sizing and persistence contract. Frame regions keep their field bindings, and a nested frame keeps an independent command recipient boundary.


**Interaction and events.** Regional splitters and drawers behave as in borderContainer. Commands composed in a frame can address its own recipient.


**Composition.** Direct children are contentPane regions. Frame helpers create or retrieve Source regions without duplicating them. Compose toolbars or working content inside those regions.


**Limits and lifecycle.** There is at most one direct contentPane per region. Frame sizing and persistence follow the same validation and stable-id requirements as borderContainer.

Shared contracts: [Border and frame regions](#gc-345-shared-regions).

No additional component-specific parameters.


Child grammar: `contentPane`; parent grammar: `None`.

Child parameters projected by the parent:

| Parameters | Contract |
| --- | --- |
| `detachable` | `{"default":false,"dtype":"B"}` |
| `title` | `{"default":"","dtype":"T"}` |
| `region` | `{"enum":["top","bottom","left","right","center"],"required":true,"unique":true}` |
| `width, height` | `{}` |
| `drawer_onclick` | `{"inline":["evt","show"]}` |

<a id="gc-345-175"></a>
<a id="gc-345-stackcontainer"></a>
### `stackContainer`

Collection: layout. One selected panel at a time, without a tab strip.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-stackcontainer).


**Data contract.** selectedPage identifies a panel by its Source pageName. selected is its zero-based position among direct panels. Both support two-way binding, and a valid named selection takes precedence when both values change together.


**Interaction and events.** On a selection change, hiding and showing announce the outgoing and incoming panels before selected reports their resulting active states. A close uses the child onClose guard and publishes closing and closed when accepted.


**Composition.** Direct Source children are panels. Give panels stable pageName values when selecting by name. The stack has no built-in tab strip. External controls can set its selection.


**Limits and lifecycle.** Duplicate non-null page names and negative or noninteger indices raise errors. An out-of-range index leaves the current available panel selected or uses the normal fallback. Inactive panels stay mounted, and closing a panel removes its Source while retaining application Data.

Shared contracts: [Panel selection](#gc-345-shared-selection).

No additional component-specific parameters.


Child grammar: `*`; parent grammar: `None`.

Child parameters projected by the parent:

| Parameters | Contract |
| --- | --- |
| `pageName` | `{"dtype":"T","nullable":true,"unique":true}` |
| `title` | `{"default":"","dtype":"T"}` |
| `onClose` | `{"inline":[]}` |

<a id="gc-345-180"></a>
<a id="gc-345-tabcontainer"></a>
### `tabContainer`

Collection: layout. Selected panels with shaped or underlined tabs on any side.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-tabcontainer).


**Data contract.** selectedPage identifies a panel by its Source pageName. selected is its zero-based position among direct panels. Both support two-way binding, and a valid named selection takes precedence when both values change together.


**Interaction and events.** On a selection change, hiding and showing announce the outgoing and incoming panels before selected reports their resulting active states. A close uses the child onClose guard and publishes closing and closed when accepted. The tab strip adds pointer and keyboard selection. An eligible detachable tab can open in a floating window and reattach when that window closes.


**Composition.** Author a titled direct Source child for each tab. Child metadata can supply a name, icon, badge, closability and detachment. Inactive panel controls remain mounted.


**Limits and lifecycle.** Hidden, disabled and detached panels are skipped for strip selection. onClose must return a synchronous boolean. Detaching moves the slot presentation while preserving the controls.

Shared contracts: [Panel selection](#gc-345-shared-selection).


| Parameters | Contract |
| --- | --- |
| `tabMode` | `{"binding":"read","default":"tabs","dtype":"T","enum":["tabs","underline"]}` |
| `tabPosition` | `{"binding":"read","default":"top","dtype":"T","enum":["top","bottom","left","right"]}` |
| `tabAlign` | `{"binding":"read","default":"start","dtype":"T","enum":["start","center","end"]}` |

Child grammar: `*`; parent grammar: `None`.

Child parameters projected by the parent:

| Parameters | Contract |
| --- | --- |
| `pageName` | `{"dtype":"T","nullable":true,"unique":true}` |
| `title` | `{"default":"","dtype":"T","required":true}` |
| `onClose` | `{"inline":[]}` |
| `detachable` | `{"dtype":"B"}` |

<a id="gc-345-405"></a>
<a id="gc-345-traypane"></a>
### `trayPane`

Collection: layout. Data-owned arrangement of labelled live cards with selection, movement, resize, layers, rotation, zoom and snapping.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-traypane).


**Data contract.** storepath resolves to a Bag keyed by direct child Source labels. Each position Bag holds x, y, width, height, rotation, scale, selected and layer. Gesture changes write geometry and selection to those rows while the existing controls stay mounted.


**Interaction and events.** Drag, resize and rotation handles edit geometry. Shift applies configured snapping. Click and marquee gestures select blocks, and selected blocks can move together. Opt-in close removes the block Source and its geometry row.


**Composition.** Give each direct child a Labelbox with lbl. Child options include minWidth, minHeight and closable. A tray can contain interactive fields and nested trays.


**Limits and lifecycle.** Bounds and same-layer contact constrain edits. Lock hides editing chrome while external Data still projects. Cancellation restores the gesture state, and store replacement ends the old gesture without overwriting the replacement.


| Parameters | Contract |
| --- | --- |
| `storepath` | `{"dtype":"T"}` |
| `locked, gridVisible` | `{"binding":"read","default":false,"dtype":"B"}` |
| `gridStep` | `{"binding":"read","default":10,"dtype":"L"}` |
| `rotationStep` | `{"binding":"read","default":15,"dtype":"N"}` |

Child grammar: `*`; parent grammar: `None`.

Child parameters projected by the parent:

| Parameters | Contract |
| --- | --- |
| `closable` | `{"default":false,"dtype":"B"}` |
| `minWidth` | `{"default":100,"dtype":"N"}` |
| `minHeight` | `{"default":64,"dtype":"N"}` |

<a id="gc-345-410"></a>
<a id="gc-345-transformpane"></a>
### `transformPane`

Collection: layout. Tracks translation, rotation and scale gestures; child Source bindings own the visual transform. Gestures write simple reactive pointers despite read-only binding metadata; onEnd reports final values.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-transformpane).


**Data contract.** x and y express translation, rotate is an angle in degrees, and zoom is a scale factor. Gestures write these values to Data through plain reactive pointers without a transform. min, max and step constrain zoom.


**Interaction and events.** One pointer translates. Two touches also rotate and zoom. When the last pointer is released after a changed gesture, onEnd Logic receives x, y, rotate and zoom.


**Composition.** Place arbitrary Source content inside the gesture surface. The pane tracks gesture values. Bind the child presentation separately to apply a CSS transform from those Data values.


**Limits and lifecycle.** Parameters must be finite, min and step positive, and max at least min. An external parameter change cancels the gesture. A stationary gesture or cancellation does not call onEnd.


| Parameters | Contract |
| --- | --- |
| `x, y, rotate` | `{"binding":"read","default":0,"dtype":"R"}` |
| `zoom` | `{"binding":"read","default":1,"dtype":"R"}` |
| `min` | `{"binding":"read","default":0.5,"dtype":"R"}` |
| `max` | `{"binding":"read","default":3,"dtype":"R"}` |
| `step` | `{"binding":"read","default":0.01,"dtype":"R"}` |
| `onEnd` | `{"dtype":"T","nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-345-325"></a>
## Dialogs and floating windows


<a id="gc-345-140"></a>
<a id="gc-345-dialog"></a>
### `dialog`

Collection: layout. A modal window containing a framePane; remains modal when collapsed or maximized.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-dialog).


**Data contract.** Bind open, collapsed and maximized to retain window state in Data. Width, height, left and top accept CSS lengths and support writeback for user geometry changes. The expanded geometry is retained across collapse and maximize.


**Interaction and events.** The window publishes opened and closed. A close request calls the optional beforeClose Logic with reason and waits for its boolean decision. A pending decision deduplicates close requests, and an obsolete decision cannot close a later window session. Escape requests closure through the same guard.


**Composition.** Provide exactly one framePane child. Closing and reopening preserves the mounted frame, its controls and bindings.


**Limits and lifecycle.** The window remains modal while collapsed or maximized. Movement, resizing, collapse and maximize are opt-in. A non-boolean guard result leaves the dialog open and reports a diagnostic.

Shared contracts: [Window behavior and geometry](#gc-345-shared-windows).

No additional component-specific parameters.


Child grammar: `framePane`; parent grammar: `None`.

<a id="gc-345-145"></a>
<a id="gc-345-floatingpane"></a>
### `floatingPane`

Collection: layout. A nonmodal window containing a framePane.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-floatingpane).


**Data contract.** Bind open, collapsed and maximized to retain window state in Data. Width, height, left and top accept CSS lengths and support writeback for user geometry changes. The expanded geometry is retained across collapse and maximize.


**Interaction and events.** The window publishes opened and closed. A close request calls the optional beforeClose Logic with reason and waits for its boolean decision. A pending decision deduplicates close requests, and an obsolete decision cannot close a later window session. Activating a floating window raises it above its peers.


**Composition.** Provide exactly one framePane child. Closing and reopening preserves the mounted frame, its controls and bindings.


**Limits and lifecycle.** This window is nonmodal. Movement, resize and collapse default on, while maximize is opt-in. Disposal invalidates pending close decisions and releases interaction resources.

Shared contracts: [Window behavior and geometry](#gc-345-shared-windows).

No additional component-specific parameters.


Child grammar: `framePane`; parent grammar: `None`.

<a id="gc-345-330"></a>
## Trees


<a id="gc-345-185"></a>
<a id="gc-345-tree"></a>
### `tree`

Collection: tree. Hierarchical Bag presentation with selection, disclosure and declared drag behavior.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-tree).


**Data contract.** storepath selects a live Bag in Data or a Source tree through the store routing contract. Bind selectedPath two ways for selection and checkedPaths for joined checkbox paths. Selection paths are relative to the store. External selection can resolve missing ancestors.


**Interaction and events.** Disclosure, keyboard navigation and selection operate on visible rows. Named label and icon Logic can customize row presentation. onChecked receives item and path and can veto the change. Optional drag callbacks prepare a typed snapshot for the internal drop pipeline.


**Composition.** The Bag supplies the hierarchy and can contain lazy resolver nodes. Source may declare one rowActions child for shared commands. A rendered scalar child selects its owning Bag node.


**Limits and lifecycle.** Ordinary rendering does not evaluate unloaded resolvers. Failed branches remain retryable and stale asynchronous results cannot change later selection. Search stops at marked loops, and drag preparation is opt-in, synchronous and does not evaluate a lazy row.


| Parameters | Contract |
| --- | --- |
| `storepath` | `{"dtype":"T"}` |
| `draggable, internalNames, hideValues, autoCollapse` | `{"binding":"read","default":false,"dtype":"B"}` |
| `labelAttribute, excludeRoot` | `{"binding":"read","default":null,"dtype":"T","nullable":true}` |
| `labelCb, getLabel, getLabelClass, getIconClass` | `{"default":null,"dtype":"T","nullable":true}` |
| `labelState, favorites` | `{"binding":"read","default":null,"dtype":"X","nullable":true}` |
| `selectedLabelClass, searchText, searchAttributes` | `{"binding":"read","default":"","dtype":"T"}` |
| `searchEager, resolveLazy, checkChildren` | `{"binding":"read","default":true,"dtype":"B"}` |
| `favoritesLabel` | `{"binding":"read","default":"Favorites","dtype":"T"}` |
| `selectedPath, checkedPaths` | `{"binding":"twoWay","default":null,"dtype":"T","nullable":true}` |
| `onChecked` | `{"default":null,"dtype":["B","T"],"nullable":true}` |
| `checkedPaths_joiner` | `{"default":",","dtype":"T"}` |

Child grammar: `rowActions[:1]`; parent grammar: `None`.

<a id="gc-345-360"></a>
<a id="gc-345-rowactions"></a>
### `rowActions`

Collection: tree. Shared contextual row actions for the tree presentation.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-rowactions).


**Data contract.** state is an optional read binding passed to actionState. Command context carries the focused or hovered row item and path independently of selectedPath.


**Interaction and events.** A child command runs in the current row context without selecting the row. actionState receives item, path, action and state and returns hidden, icon and title for each coded action.


**Composition.** Place one shared bar inside tree, at start or end of the row. Compose button and dropDownButton children. Use rowAction to identify an action for presentation Logic.


**Limits and lifecycle.** The bar hides when it has no row context. Invalid position or an incomplete actionState result raises an error. Menu commands use the same active row context as the bar.


| Parameters | Contract |
| --- | --- |
| `position` | `{"default":"end","dtype":"T"}` |
| `actionState` | `{"default":null,"dtype":"T","nullable":true}` |
| `state` | `{"binding":"read","default":null,"dtype":"X","nullable":true}` |

Child grammar: `button,dropDownButton`; parent grammar: `None`.

<a id="gc-345-335"></a>
## File uploads


<a id="gc-345-340"></a>
<a id="gc-345-uploader"></a>
### `uploader`

Collection: uploads. Shared file queue with progress, preview, selected-file metadata and application-owned upload targets.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-uploader).


**Data contract.** Initialize a Bag at storepath for queue rows and progress. selectedPath writes the queue-relative row label and clears when that row is removed. Files and temporary grants stay outside Data. Preparation snapshots row metadata fields and the optional contextPath Bag separately.


**Interaction and events.** Selection and drop add files. autoUpload starts queued files, including when enabled after selection. In deferred mode manualUpload controls the Upload action. onComplete names Page Logic receiving item and result after confirmed completion.


**Composition.** Leaf control. Place ordinary metadata controls beside it and bind them to the selected row's metadata Bag. Give them an empty scope when no row is selected.


**Limits and lifecycle.** The host and application operation own authorization and storage. Check status reconciles uncertain outcomes before retry. Local preview covers safe text and raster images. File-origin WebKit Workers can fail to read selected File objects.

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state).


| Parameters | Contract |
| --- | --- |
| `operation, storepath` | `{"dtype":"T"}` |
| `contextPath, onComplete` | `{"default":null,"dtype":"T","nullable":true}` |
| `accept` | `{"binding":"read","default":"","dtype":"T"}` |
| `multiple` | `{"binding":"read","default":false,"dtype":"B"}` |
| `autoUpload, manualUpload` | `{"binding":"read","default":true,"dtype":"B"}` |
| `selectedPath` | `{"binding":"twoWay","default":null,"dtype":"T","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-345"></a>
<a id="gc-345-imageuploader"></a>
### `imageUploader`

Collection: uploads. Editable image value with local crop or an application-owned upload destination.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-imageuploader).


**Data contract.** Bind value two ways and initialize a queue Bag at storepath. Crop confirmation writes a PNG data URL in browser-only mode or a displayable URL returned by the application operation in transfer mode. External value changes supersede open edits.


**Interaction and events.** Select or drop one image, move, zoom or rotate the crop, then confirm or cancel. Camera and screen capture feed the same crop path when available. Server-mode onComplete receives item and result after confirmed transfer.


**Composition.** Leaf control with its own crop dialog. Compose surrounding form controls normally and share contextPath when the upload operation needs it.


**Limits and lifecycle.** Input supports PNG, JPEG and WebP. Positive integer crop and output dimensions must have the same aspect ratio. Remote editing requires canvas-compatible URL access. Camera needs a capable device provider and permission, with a secure context for browser capture. Screen capture depends on browser support and permission. Stored files remain under application control after value is cleared.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state).


| Parameters | Contract |
| --- | --- |
| `storepath` | `{"dtype":"T"}` |
| `contextPath, operation, onComplete` | `{"default":null,"dtype":"T","nullable":true}` |
| `cropWidth, cropHeight` | `{"default":256,"dtype":"L"}` |
| `outputWidth, outputHeight` | `{"default":512,"dtype":"L"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-350"></a>
<a id="gc-345-attachmentmanager"></a>
### `attachmentManager`

Collection: uploads. Reusable attachment queue and list backed by application operations.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-attachmentmanager).


**Data contract.** Initialize queue and record context Bags at storepath and contextPath. Update context before ready enables queued uploads. selectedPath addresses a queue row for metadata editing. The list endpoint provides opaque attachment IDs and captions.


**Interaction and events.** The manager refreshes its list after confirmed upload, calls readMethod for preview and removeMethod for deletion. Context changes clear the old selection and discard stale responses. Failed removal retains selection and reports an error. It declares no public onComplete.


**Composition.** Leaf control composing its own multiple-file queue, list and preview. External metadata fields can bind to the selected queue row.


**Limits and lifecycle.** The application supplies operation, listMethod, readMethod and removeMethod and owns authorization and persistence. Preview responses distinguish text, image and message. Removal requires a true result.

Shared contracts: [Disabled, readonly and live updates](#gc-345-shared-state).


| Parameters | Contract |
| --- | --- |
| `operation, storepath, contextPath, listMethod, readMethod, removeMethod` | `{"dtype":"T"}` |
| `ready` | `{"binding":"read","default":false,"dtype":"B"}` |
| `accept` | `{"binding":"read","default":"","dtype":"T"}` |
| `selectedPath` | `{"binding":"twoWay","default":null,"dtype":"T","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-425"></a>
## Editors and document previews


<a id="gc-345-190"></a>
<a id="gc-345-codemirror"></a>
### `codeMirror`

Collection: editors. Code/text editor with composed language and editor options.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-codemirror).


**Data contract.** Bind value two ways to source text. Live writes are the default. Deferred edits commit when focus leaves the editor. External value and configuration changes update the retained CodeMirror state.


**Interaction and events.** Undo, redo and historyChanged expose editor history. Ctrl/Cmd+S publishes local save while editable. Ctrl/Cmd+F opens search. Tab indents, Shift+Tab outdents and Escape followed by Tab exits.


**Composition.** Leaf control. Place a toolbar or preview beside it. Wait for ready before using engine-dependent methods such as diagnostics and position revelation.


**Limits and lifecycle.** Language names are enumerated and completion uses local language support. Readonly prevents changes and replacement. Disabled also prevents focus. The application owns persistence.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |
| `language` | `{"binding":"read","default":"text","dtype":"T","enum":["text","python","javascript","typescript","json","html","css","xml","markdown","sql","typst"]}` |
| `lineNumbers, lineWrapping, folding, bracketMatching, autoCloseBrackets, autoIndent, autocompletion, highlightActiveLine, highlightSelectionMatches` | `{"binding":"read","default":true,"dtype":"B"}` |
| `indentUnit` | `{"binding":"read","default":4,"dtype":"L"}` |
| `fontSize` | `{"binding":"read","default":14,"dtype":"L"}` |
| `fontFamily` | `{"binding":"read","default":"monospace","dtype":"T"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-195"></a>
<a id="gc-345-htmleditor"></a>
### `htmlEditor`

Collection: editors. Rich HTML editing using the supported engine configuration.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-htmleditor).


**Data contract.** Bind value two ways to HTML source. Live writes are the default and deferred edits commit on blur. Rich edits can normalize markup, while undo to the initial snapshot restores the original source.


**Interaction and events.** The rich toolbar edits supported body content. Undo, redo and the local save shortcut follow the editor history contract.


**Composition.** Leaf control. Pair it with a preview or source editor through the same Data string.


**Limits and lifecycle.** The document head, doctype and protected body regions stay outside the editable content. Removing or duplicating a protected placeholder rejects the edit. Use source editing for protected regions.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-200"></a>
<a id="gc-345-htmlpreview"></a>
### `htmlPreview`

Collection: editors. Read-only HTML preview with the component sanitization contract.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-htmlpreview).


**Data contract.** The read-bound value supplies the HTML string projected to the iframe document. A Data change replaces the displayed document.


**Interaction and events.** Displays the iframe document without edit, save or completion callbacks.


**Composition.** Leaf control. Bind it to the same Data path as a separate HTML editor.


**Limits and lifecycle.** The iframe sandbox has no allow tokens, so scripts cannot execute. The Data string stays intact.

Shared contracts: [Values and bindings](#gc-345-shared-value).

No additional component-specific parameters.


Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-205"></a>
<a id="gc-345-markdowneditor"></a>
### `markdownEditor`

Collection: editors. Markdown editing with the supported editor modes.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-markdowneditor).


**Data contract.** Bind value two ways to Markdown. Live writes are the default and deferred edits commit on blur. Incoming Data updates retain the ProseMirror engine and plugins. Undo to the initial snapshot recovers the exact source.


**Interaction and events.** The toolbar and native edits go through the same document model. Undo, redo and local save use the shared editor contract.


**Composition.** Leaf control. Pair it with markdownPreview or a source editor through the same text path.


**Limits and lifecycle.** Rich editing covers ordinary paragraphs, headings, lists, quotes and fenced code. Tables, embedded HTML, strikethrough and task lists remain opaque source blocks. Frontmatter and reference definitions preserve the whole document as a source block. Rich edits can normalize supported syntax.

Shared contracts: [Values and bindings](#gc-345-shared-value), [Disabled, readonly and live updates](#gc-345-shared-state), [Labels and field presentation](#gc-345-shared-labels), [Validation](#gc-345-shared-validation).


| Parameters | Contract |
| --- | --- |
| `lbl_value` | `{"binding":"twoWay","dtype":"T","nullable":true}` |
| `lbl_values` | `{"binding":"read","dtype":"T","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-210"></a>
<a id="gc-345-markdownpreview"></a>
### `markdownPreview`

Collection: editors. Rendered Markdown preview.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-markdownpreview).


**Data contract.** Reads Markdown through value. Changing allowHtml alters rendering only. By default embedded HTML appears as text. With allowHtml enabled, rendered HTML is sanitized.


**Interaction and events.** Updates as read inputs change. It declares no save, edit or render-completion callback.


**Composition.** Leaf control. Pair it with a Markdown editor through the same Data string.


**Limits and lifecycle.** The renderer loads on demand. The sandboxed preview policy blocks external image requests and rendering leaves the source intact.

Shared contracts: [Values and bindings](#gc-345-shared-value).


| Parameters | Contract |
| --- | --- |
| `allowHtml` | `{"binding":"read","default":false,"dtype":"B"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-215"></a>
<a id="gc-345-typstpreview"></a>
### `typstPreview`

Collection: typst. Typst document preview with client SVG and PDF compilation; compiler resources are separate from ordinary forms.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-typstpreview).


**Data contract.** Reads the Typst source from value and the download name from filename. SVG, PDF and diagnostics stay inside the browser preview. The current Worker produces SVG and PDF for each successful preview revision.


**Interaction and events.** Changes schedule compilation after a short pause. The current result enables download and diagnostics appear in the widget. It declares no completion callback.


**Composition.** Leaf control. Pair it with codeMirror from the separate editors collection to edit the same draft.


**Limits and lifecycle.** The browser Worker uses a bundled compiler and fonts. Includes, custom assets and external packages are outside the browser preview contract. Source changes invalidate prior output immediately. Removing the last preview releases the shared Worker.

Shared contracts: [Values and bindings](#gc-345-shared-value).


| Parameters | Contract |
| --- | --- |
| `filename` | `{"binding":"read","default":"document.pdf","dtype":"T"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-345-390"></a>
## Grid structure declarations

These are Source declarations, not additional browser components. Parameters below are the complete Python authoring signature; annotations retain regex restrictions. A missing default denotes a required argument.

### `struct`

Children: `column,colgroup`. Parents: `grid`.


**Data contract.** An inline declaration projects to a structure Bag before rendering. Use structpath to read a separately maintained structure instead.


**Interaction and events.** Grid header interactions can update the projected structure. Other grids sharing that Bag observe its changes. The declaration has no callback.


**Composition.** Grid declaration containing columns and column groups. It has no separate browser element.


**Limits and lifecycle.** Use one inline struct or an external structpath. Duplicate fields, unknown attributes and nested groups are rejected. External sets use check=multiple, checked=^DataPath and checkedField=identityField. Initialize the Data value to an empty string; nonempty text IDs without commas are stored as comma-separated strings. Literal comma-wrapped includes checks membership. Each toggle writes Data and refreshes all views without editing records. Dynamic columns observe the structure Bag; removing a column keeps its set. Offscreen IDs survive. External set columns cannot have editors and are excluded from ordinary field sorting/search; check=single uses a radio and writes one scalar ID to checked without editing supplier rows. It supports partial stores, retains filtered/offscreen choices and never toggles off the selected radio. Text and numeric identities retain their type. Bulk actions are not implemented. A read-bound setFilter string names external check columns: john,fred means intersection, empty removes only the set contribution. Base filter, search and setFilter combine with AND. Set Data changes immediately update the view. Nonempty setFilter requires a complete resident store; windowInfo and unknown check columns are rejected. Column title retains the full tooltip/accessibility name when name is abbreviated. columnFilters=True enables distinct-value header popups on complete resident stores: OR within each column, AND across columns/base/search/sets. Counts exclude only their own column selection. Empty groups null and empty text; zero-count selections persist. None differs from Reset. The popup reuses the shared grid and menu toolbar; its literal search filters only the choices and preserves hidden selections. All/None apply to the entire choice list. Accepted criteria live in the Source-owned collection view; row edits update counts. Date columns add inclusive From/To and period entry; range AND values is one column criterion. Changing range selects all matching dates; clearing From clears To but preserves selected dates. Reset clears both. Invalid drafts retain the accepted filter.

```json
{"parameters":[],"accepts_var_keyword":false,"accepts_var_positional":false}
```

### `column`

Children: `''`. Parents: `struct,colgroup`.


**Data contract.** The required field identifies a row field under the chosen rowMode. Metadata configures caption, type and presentation. Enable local editing with edit=True or an editor options dictionary.


**Interaction and events.** The grid handles header and cell interactions. The column supplies configuration for the projected header, cells and optional editor.


**Composition.** Leaf declaration inside struct or colgroup, without a separate browser element.


**Limits and lifecycle.** Field identity must be unique. Attribute names and values are validated. Formulas are outside the structure contract.

```json
{"parameters":[{"name":"field","kind":"positional_or_keyword","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^[A-Za-z_][A-Za-z0-9_]*$","flags":0}]},"has_default":false},{"name":"name","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null},{"name":"dtype","kind":"keyword_only","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^(T|B|L|R|N|D|H|DHZ)$","flags":0}]},"has_default":true,"default":null},{"name":"width","kind":"keyword_only","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^[0-9]+([.][0-9]+)?(px|em|rem|ch|%)$","flags":0}]},"has_default":true,"default":null},{"name":"max_height","kind":"keyword_only","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^[0-9]+([.][0-9]+)?(px|em|rem)$","flags":0}]},"has_default":true,"default":null},{"name":"align","kind":"keyword_only","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^(start|center|end)$","flags":0}]},"has_default":true,"default":null},{"name":"format","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null},{"name":"white_space","kind":"keyword_only","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^(normal|nowrap|pre-wrap)$","flags":0}]},"has_default":true,"default":null},{"name":"edit","kind":"keyword_only","role":"attribute","annotation":{"kind":"union","items":[{"kind":"dtype","dtype":"B"},{"kind":"type","module":"builtins","name":"dict"}]},"has_default":true,"default":false},{"name":"check","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null},{"name":"checked","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null},{"name":"checkedField","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null},{"name":"title","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null}],"accepts_var_keyword":false,"accepts_var_positional":false}
```

### `colgroup`

Children: `column`. Parents: `struct`.


**Data contract.** Supplies identity, caption and optional colors for a header band. Column membership belongs to the structure Bag.


**Interaction and events.** Moving columns can split or join contiguous header bands while preserving group membership. The group declares no callback.


**Composition.** Place directly under struct and put column declarations inside. The grid renders the group.


**Limits and lifecycle.** Groups cannot nest. Each member column still identifies its own row field.

```json
{"parameters":[{"name":"code","kind":"positional_or_keyword","role":"attribute","annotation":{"kind":"annotated","base":{"kind":"dtype","dtype":"T"},"metadata":[{"kind":"regex","pattern":"^[A-Za-z_][A-Za-z0-9_]*$","flags":0}]},"has_default":false},{"name":"name","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null},{"name":"background","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null},{"name":"color","kind":"keyword_only","role":"attribute","annotation":{"kind":"dtype","dtype":"T"},"has_default":true,"default":null}],"accepts_var_keyword":false,"accepts_var_positional":false}
```
