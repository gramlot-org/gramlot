# Widget coverage matrix

Document ID: **GC-460**.

<a id="gc-460-005"></a>
## Scope and evidence

This audit covers all **89 component declarations in 13 packaged collections**. The reviewed core baseline is `2b1f2d80`; lesson references use examples `c59a19c`. Local uncommitted work is excluded. The inventory comes from packaged grammars; the behavior paragraphs were reviewed against implementation and test assertions on 2026-11-04. The reference documents purpose, parameters/defaults, Data, interaction/events, composition and limits for each declaration. An explicitly absent callback or unsupported behavior is part of the contract, not a missing implementation to invent.

Parameter coverage is checked mechanically against metadata. Behavioral coverage is a source review, not proof that every possible interaction, failure, accessibility requirement or host/browser combination has been tested. Test files below are inspected evidence: their presence is not a new test-run result or a maturity rating. A statement that no callback is declared concerns component-specific callback parameters; ordinary Source event handling remains available. Example links are confined to the appendix and are teaching evidence, not a substitute for behavioral qualification.

HTML/SVG tags and ordinary Source/CSS attributes are shared grammar rather than additional widgets. Grid `struct`, `column` and `colgroup` declarations are covered by the structural reference; ChatPane is the composition around `chatMessages`, not a separate component declaration. Third-party collections must maintain their own inventory and documentation.

<a id="gc-460-010"></a>
## Manual coverage by component

Every linked reference contains the named dimensions. “Reviewed” means the prose exists and has source evidence, not that all edge cases have been independently exercised.

Dedicated catalogue lessons now cover `transformPane` and `rowActions`; their explanations and links remain in the appendix.

| Component | Purpose and parameters | Data and events | Composition and limits |
| --- | --- | --- | --- |
| `editingStatus` | [Reference](410-inputs.md#gc-410-editingstatus) | [Reviewed](410-inputs.md#gc-410-editingstatus) | [Reviewed](410-inputs.md#gc-410-editingstatus) |
| `textbox` | [Reference](410-inputs.md#gc-410-textbox) | [Reviewed](410-inputs.md#gc-410-textbox) | [Reviewed](410-inputs.md#gc-410-textbox) |
| `checkbox` | [Reference](410-inputs.md#gc-410-checkbox) | [Reviewed](410-inputs.md#gc-410-checkbox) | [Reviewed](410-inputs.md#gc-410-checkbox) |
| `radioButtonText` | [Reference](410-inputs.md#gc-410-radiobuttontext) | [Reviewed](410-inputs.md#gc-410-radiobuttontext) | [Reviewed](410-inputs.md#gc-410-radiobuttontext) |
| `textBoxArea` | [Reference](410-inputs.md#gc-410-textboxarea) | [Reviewed](410-inputs.md#gc-410-textboxarea) | [Reviewed](410-inputs.md#gc-410-textboxarea) |
| `passwordbox` | [Reference](410-inputs.md#gc-410-passwordbox) | [Reviewed](410-inputs.md#gc-410-passwordbox) | [Reviewed](410-inputs.md#gc-410-passwordbox) |
| `radioButton` | [Reference](410-inputs.md#gc-410-radiobutton) | [Reviewed](410-inputs.md#gc-410-radiobutton) | [Reviewed](410-inputs.md#gc-410-radiobutton) |
| `colorpicker` | [Reference](410-inputs.md#gc-410-colorpicker) | [Reviewed](410-inputs.md#gc-410-colorpicker) | [Reviewed](410-inputs.md#gc-410-colorpicker) |
| `horizontalSlider` | [Reference](410-inputs.md#gc-410-horizontalslider) | [Reviewed](410-inputs.md#gc-410-horizontalslider) | [Reviewed](410-inputs.md#gc-410-horizontalslider) |
| `verticalSlider` | [Reference](410-inputs.md#gc-410-verticalslider) | [Reviewed](410-inputs.md#gc-410-verticalslider) | [Reviewed](410-inputs.md#gc-410-verticalslider) |
| `numberTextBox` | [Reference](410-inputs.md#gc-410-numbertextbox) | [Reviewed](410-inputs.md#gc-410-numbertextbox) | [Reviewed](410-inputs.md#gc-410-numbertextbox) |
| `dateTextBox` | [Reference](410-inputs.md#gc-410-datetextbox) | [Reviewed](410-inputs.md#gc-410-datetextbox) | [Reviewed](410-inputs.md#gc-410-datetextbox) |
| `timeTextBox` | [Reference](410-inputs.md#gc-410-timetextbox) | [Reviewed](410-inputs.md#gc-410-timetextbox) | [Reviewed](410-inputs.md#gc-410-timetextbox) |
| `filteringSelect` | [Reference](410-inputs.md#gc-410-filteringselect) | [Reviewed](410-inputs.md#gc-410-filteringselect) | [Reviewed](410-inputs.md#gc-410-filteringselect) |
| `callbackSelect` | [Reference](410-inputs.md#gc-410-callbackselect) | [Reviewed](410-inputs.md#gc-410-callbackselect) | [Reviewed](410-inputs.md#gc-410-callbackselect) |
| `comboBox` | [Reference](410-inputs.md#gc-410-combobox) | [Reviewed](410-inputs.md#gc-410-combobox) | [Reviewed](410-inputs.md#gc-410-combobox) |
| `dbSelect` | [Reference](410-inputs.md#gc-410-dbselect) | [Reviewed](410-inputs.md#gc-410-dbselect) | [Reviewed](410-inputs.md#gc-410-dbselect) |
| `dbComboBox` | [Reference](410-inputs.md#gc-410-dbcombobox) | [Reviewed](410-inputs.md#gc-410-dbcombobox) | [Reviewed](410-inputs.md#gc-410-dbcombobox) |
| `checkBoxText` | [Reference](410-inputs.md#gc-410-checkboxtext) | [Reviewed](410-inputs.md#gc-410-checkboxtext) | [Reviewed](410-inputs.md#gc-410-checkboxtext) |
| `dateCalendar` | [Reference](410-inputs.md#gc-410-datecalendar) | [Reviewed](410-inputs.md#gc-410-datecalendar) | [Reviewed](410-inputs.md#gc-410-datecalendar) |
| `button` | [Reference](415-buttons.md#gc-415-button) | [Reviewed](415-buttons.md#gc-415-button) | [Reviewed](415-buttons.md#gc-415-button) |
| `toggleButton` | [Reference](415-buttons.md#gc-415-togglebutton) | [Reviewed](415-buttons.md#gc-415-togglebutton) | [Reviewed](415-buttons.md#gc-415-togglebutton) |
| `dropDownButton` | [Reference](415-buttons.md#gc-415-dropdownbutton) | [Reviewed](415-buttons.md#gc-415-dropdownbutton) | [Reviewed](415-buttons.md#gc-415-dropdownbutton) |
| `menu` | [Reference](415-buttons.md#gc-415-menu) | [Reviewed](415-buttons.md#gc-415-menu) | [Reviewed](415-buttons.md#gc-415-menu) |
| `menuline` | [Reference](415-buttons.md#gc-415-menuline) | [Reviewed](415-buttons.md#gc-415-menuline) | [Reviewed](415-buttons.md#gc-415-menuline) |
| `spacer` | [Reference](415-buttons.md#gc-415-spacer) | [Reviewed](415-buttons.md#gc-415-spacer) | [Reviewed](415-buttons.md#gc-415-spacer) |
| `transformPane` | [Reference](420-layout.md#gc-420-transformpane) | [Reviewed](420-layout.md#gc-420-transformpane) | [Reviewed](420-layout.md#gc-420-transformpane) |
| `dialog` | [Reference](420-layout.md#gc-420-dialog) | [Reviewed](420-layout.md#gc-420-dialog) | [Reviewed](420-layout.md#gc-420-dialog) |
| `floatingPane` | [Reference](420-layout.md#gc-420-floatingpane) | [Reviewed](420-layout.md#gc-420-floatingpane) | [Reviewed](420-layout.md#gc-420-floatingpane) |
| `framePane` | [Reference](420-layout.md#gc-420-framepane) | [Reviewed](420-layout.md#gc-420-framepane) | [Reviewed](420-layout.md#gc-420-framepane) |
| `trayPane` | [Reference](420-layout.md#gc-420-traypane) | [Reviewed](420-layout.md#gc-420-traypane) | [Reviewed](420-layout.md#gc-420-traypane) |
| `formlet` | [Reference](420-layout.md#gc-420-formlet) | [Reviewed](420-layout.md#gc-420-formlet) | [Reviewed](420-layout.md#gc-420-formlet) |
| `groupBox` | [Reference](420-layout.md#gc-420-groupbox) | [Reviewed](420-layout.md#gc-420-groupbox) | [Reviewed](420-layout.md#gc-420-groupbox) |
| `contentPane` | [Reference](420-layout.md#gc-420-contentpane) | [Reviewed](420-layout.md#gc-420-contentpane) | [Reviewed](420-layout.md#gc-420-contentpane) |
| `borderContainer` | [Reference](420-layout.md#gc-420-bordercontainer) | [Reviewed](420-layout.md#gc-420-bordercontainer) | [Reviewed](420-layout.md#gc-420-bordercontainer) |
| `stackContainer` | [Reference](420-layout.md#gc-420-stackcontainer) | [Reviewed](420-layout.md#gc-420-stackcontainer) | [Reviewed](420-layout.md#gc-420-stackcontainer) |
| `tabContainer` | [Reference](420-layout.md#gc-420-tabcontainer) | [Reviewed](420-layout.md#gc-420-tabcontainer) | [Reviewed](420-layout.md#gc-420-tabcontainer) |
| `tree` | [Reference](425-tree.md#gc-425-tree) | [Reviewed](425-tree.md#gc-425-tree) | [Reviewed](425-tree.md#gc-425-tree) |
| `rowActions` | [Reference](425-tree.md#gc-425-rowactions) | [Reviewed](425-tree.md#gc-425-rowactions) | [Reviewed](425-tree.md#gc-425-rowactions) |
| `codeMirror` | [Reference](430-editors.md#gc-430-codemirror) | [Reviewed](430-editors.md#gc-430-codemirror) | [Reviewed](430-editors.md#gc-430-codemirror) |
| `htmlEditor` | [Reference](430-editors.md#gc-430-htmleditor) | [Reviewed](430-editors.md#gc-430-htmleditor) | [Reviewed](430-editors.md#gc-430-htmleditor) |
| `htmlPreview` | [Reference](430-editors.md#gc-430-htmlpreview) | [Reviewed](430-editors.md#gc-430-htmlpreview) | [Reviewed](430-editors.md#gc-430-htmlpreview) |
| `markdownEditor` | [Reference](430-editors.md#gc-430-markdowneditor) | [Reviewed](430-editors.md#gc-430-markdowneditor) | [Reviewed](430-editors.md#gc-430-markdowneditor) |
| `markdownPreview` | [Reference](430-editors.md#gc-430-markdownpreview) | [Reviewed](430-editors.md#gc-430-markdownpreview) | [Reviewed](430-editors.md#gc-430-markdownpreview) |
| `terminal` | [Reference](430-editors.md#gc-430-terminal) | [Reviewed](430-editors.md#gc-430-terminal) | [Reviewed](430-editors.md#gc-430-terminal) |
| `typstPreview` | [Reference](435-typst.md#gc-435-typstpreview) | [Reviewed](435-typst.md#gc-435-typstpreview) | [Reviewed](435-typst.md#gc-435-typstpreview) |
| `uploader` | [Reference](440-uploads.md#gc-440-uploader) | [Reviewed](440-uploads.md#gc-440-uploader) | [Reviewed](440-uploads.md#gc-440-uploader) |
| `imageUploader` | [Reference](440-uploads.md#gc-440-imageuploader) | [Reviewed](440-uploads.md#gc-440-imageuploader) | [Reviewed](440-uploads.md#gc-440-imageuploader) |
| `attachmentManager` | [Reference](440-uploads.md#gc-440-attachmentmanager) | [Reviewed](440-uploads.md#gc-440-attachmentmanager) | [Reviewed](440-uploads.md#gc-440-attachmentmanager) |
| `grid` | [Reference](445-grid.md#gc-445-grid) | [Reviewed](445-grid.md#gc-445-grid) | [Reviewed](445-grid.md#gc-445-grid) |
| `searchBox` | [Reference](445-grid.md#gc-445-searchbox) | [Reviewed](445-grid.md#gc-445-searchbox) | [Reviewed](445-grid.md#gc-445-searchbox) |
| `chatMessages` | [Reference](450-chat.md#gc-450-chatmessages) | [Reviewed](450-chat.md#gc-450-chatmessages) | [Reviewed](450-chat.md#gc-450-chatmessages) |
| `grouplet` | [Reference](455-grouplets.md#gc-455-grouplet) | [Reviewed](455-grouplets.md#gc-455-grouplet) | [Reviewed](455-grouplets.md#gc-455-grouplet) |
| `groupletCard` | [Reference](455-grouplets.md#gc-455-groupletcard) | [Reviewed](455-grouplets.md#gc-455-groupletcard) | [Reviewed](455-grouplets.md#gc-455-groupletcard) |
| `chartPane` | [Reference](480-charts.md#gc-480-chartpane) | [Reviewed](480-charts.md#gc-480-chartpane) | [Reviewed](480-charts.md#gc-480-chartpane) |
| `chartView` | [Reference](480-charts.md#gc-480-chartview) | [Reviewed](480-charts.md#gc-480-chartview) | [Reviewed](480-charts.md#gc-480-chartview) |
| `chartFields` | [Reference](480-charts.md#gc-480-chartfields) | [Reviewed](480-charts.md#gc-480-chartfields) | [Reviewed](480-charts.md#gc-480-chartfields) |
| `chartGeoJSON` | [Reference](480-charts.md#gc-480-chartgeojson) | [Reviewed](480-charts.md#gc-480-chartgeojson) | [Reviewed](480-charts.md#gc-480-chartgeojson) |
| `chartTimeline` | [Reference](480-charts.md#gc-480-charttimeline) | [Reviewed](480-charts.md#gc-480-charttimeline) | [Reviewed](480-charts.md#gc-480-charttimeline) |
| `gauge` | [Reference](480-charts.md#gc-480-gauge) | [Reviewed](480-charts.md#gc-480-gauge) | [Reviewed](480-charts.md#gc-480-gauge) |
| `chartBar` | [Reference](480-charts.md#gc-480-chartbar) | [Reviewed](480-charts.md#gc-480-chartbar) | [Reviewed](480-charts.md#gc-480-chartbar) |
| `chartLine` | [Reference](480-charts.md#gc-480-chartline) | [Reviewed](480-charts.md#gc-480-chartline) | [Reviewed](480-charts.md#gc-480-chartline) |
| `chartArea` | [Reference](480-charts.md#gc-480-chartarea) | [Reviewed](480-charts.md#gc-480-chartarea) | [Reviewed](480-charts.md#gc-480-chartarea) |
| `chartStackedBar` | [Reference](480-charts.md#gc-480-chartstackedbar) | [Reviewed](480-charts.md#gc-480-chartstackedbar) | [Reviewed](480-charts.md#gc-480-chartstackedbar) |
| `chartStackedArea` | [Reference](480-charts.md#gc-480-chartstackedarea) | [Reviewed](480-charts.md#gc-480-chartstackedarea) | [Reviewed](480-charts.md#gc-480-chartstackedarea) |
| `chartHorizontalBar` | [Reference](480-charts.md#gc-480-charthorizontalbar) | [Reviewed](480-charts.md#gc-480-charthorizontalbar) | [Reviewed](480-charts.md#gc-480-charthorizontalbar) |
| `chartPie` | [Reference](480-charts.md#gc-480-chartpie) | [Reviewed](480-charts.md#gc-480-chartpie) | [Reviewed](480-charts.md#gc-480-chartpie) |
| `chartDonut` | [Reference](480-charts.md#gc-480-chartdonut) | [Reviewed](480-charts.md#gc-480-chartdonut) | [Reviewed](480-charts.md#gc-480-chartdonut) |
| `chartScatter` | [Reference](480-charts.md#gc-480-chartscatter) | [Reviewed](480-charts.md#gc-480-chartscatter) | [Reviewed](480-charts.md#gc-480-chartscatter) |
| `chartBar3D` | [Reference](480-charts.md#gc-480-chartbar3d) | [Reviewed](480-charts.md#gc-480-chartbar3d) | [Reviewed](480-charts.md#gc-480-chartbar3d) |
| `chartLine3D` | [Reference](480-charts.md#gc-480-chartline3d) | [Reviewed](480-charts.md#gc-480-chartline3d) | [Reviewed](480-charts.md#gc-480-chartline3d) |
| `chartScatter3D` | [Reference](480-charts.md#gc-480-chartscatter3d) | [Reviewed](480-charts.md#gc-480-chartscatter3d) | [Reviewed](480-charts.md#gc-480-chartscatter3d) |
| `chartSurface` | [Reference](480-charts.md#gc-480-chartsurface) | [Reviewed](480-charts.md#gc-480-chartsurface) | [Reviewed](480-charts.md#gc-480-chartsurface) |
| `chartMap` | [Reference](480-charts.md#gc-480-chartmap) | [Reviewed](480-charts.md#gc-480-chartmap) | [Reviewed](480-charts.md#gc-480-chartmap) |
| `chartMapBar3D` | [Reference](480-charts.md#gc-480-chartmapbar3d) | [Reviewed](480-charts.md#gc-480-chartmapbar3d) | [Reviewed](480-charts.md#gc-480-chartmapbar3d) |
| `chartMap3D` | [Reference](480-charts.md#gc-480-chartmap3d) | [Reviewed](480-charts.md#gc-480-chartmap3d) | [Reviewed](480-charts.md#gc-480-chartmap3d) |
| `chartLines3D` | [Reference](480-charts.md#gc-480-chartlines3d) | [Reviewed](480-charts.md#gc-480-chartlines3d) | [Reviewed](480-charts.md#gc-480-chartlines3d) |
| `chartPolygons3D` | [Reference](480-charts.md#gc-480-chartpolygons3d) | [Reviewed](480-charts.md#gc-480-chartpolygons3d) | [Reviewed](480-charts.md#gc-480-chartpolygons3d) |
| `chartFunnel` | [Reference](480-charts.md#gc-480-chartfunnel) | [Reviewed](480-charts.md#gc-480-chartfunnel) | [Reviewed](480-charts.md#gc-480-chartfunnel) |
| `chartRadar` | [Reference](480-charts.md#gc-480-chartradar) | [Reviewed](480-charts.md#gc-480-chartradar) | [Reviewed](480-charts.md#gc-480-chartradar) |
| `chartParallel` | [Reference](480-charts.md#gc-480-chartparallel) | [Reviewed](480-charts.md#gc-480-chartparallel) | [Reviewed](480-charts.md#gc-480-chartparallel) |
| `chartHeatmap` | [Reference](480-charts.md#gc-480-chartheatmap) | [Reviewed](480-charts.md#gc-480-chartheatmap) | [Reviewed](480-charts.md#gc-480-chartheatmap) |
| `chartSankey` | [Reference](480-charts.md#gc-480-chartsankey) | [Reviewed](480-charts.md#gc-480-chartsankey) | [Reviewed](480-charts.md#gc-480-chartsankey) |
| `chartCandlestick` | [Reference](480-charts.md#gc-480-chartcandlestick) | [Reviewed](480-charts.md#gc-480-chartcandlestick) | [Reviewed](480-charts.md#gc-480-chartcandlestick) |
| `chartBoxplot` | [Reference](480-charts.md#gc-480-chartboxplot) | [Reviewed](480-charts.md#gc-480-chartboxplot) | [Reviewed](480-charts.md#gc-480-chartboxplot) |
| `chartTreemap` | [Reference](480-charts.md#gc-480-charttreemap) | [Reviewed](480-charts.md#gc-480-charttreemap) | [Reviewed](480-charts.md#gc-480-charttreemap) |
| `chartSunburst` | [Reference](480-charts.md#gc-480-chartsunburst) | [Reviewed](480-charts.md#gc-480-chartsunburst) | [Reviewed](480-charts.md#gc-480-chartsunburst) |
| `audioAnalyser` | [Reference](490-audio.md#gc-490-audioanalyser) | [Reviewed](490-audio.md#gc-490-audioanalyser) | [Reviewed](490-audio.md#gc-490-audioanalyser) |
| `drawingPane` | [Reference](495-drawing.md#gc-495-drawingpane) | [Reviewed](495-drawing.md#gc-495-drawingpane) | [Reviewed](495-drawing.md#gc-495-drawingpane) |

<a id="gc-460-015"></a>
## Implementation and test evidence

These links identify the owning code and test suites examined. Shared suites can cover multiple components; they do not imply that each assertion applies to each widget. Read the component limits alongside them.


<a id="gc-460-editingstatus"></a>
### `editingStatus`

**Implementation:** [inputs.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/inputs.js), [editing-status.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/editing-status.js).

**Tests inspected:** [form-state.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/form-state.test.js), [grid-editing.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/grid-editing.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-editingstatus).


<a id="gc-460-textbox"></a>
### `textbox`

**Implementation:** [inputs.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/inputs.js), [bases.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/bases.js).

**Tests inspected:** [components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/components.test.js), [input-validation.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/input-validation.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-textbox).


<a id="gc-460-checkbox"></a>
### `checkbox`

**Implementation:** [inputs.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/inputs.js), [bases.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/bases.js).

**Tests inspected:** [components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/components.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-checkbox).


<a id="gc-460-radiobuttontext"></a>
### `radioButtonText`

**Implementation:** [inputs.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/inputs.js), [bases.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/bases.js), [choices.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/choices.js).

**Tests inspected:** [components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/components.test.js), [component-review.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/component-review.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-radiobuttontext).


<a id="gc-460-textboxarea"></a>
### `textBoxArea`

**Implementation:** [inputs.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/inputs.js), [bases.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/bases.js).

**Tests inspected:** [components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/components.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-textboxarea).


<a id="gc-460-passwordbox"></a>
### `passwordbox`

**Implementation:** [inputs.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/inputs.js), [bases.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/bases.js).

**Tests inspected:** [components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/components.test.js), [input-validation.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/input-validation.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-passwordbox).


<a id="gc-460-radiobutton"></a>
### `radioButton`

**Implementation:** [inputs.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/inputs.js), [bases.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/bases.js).

**Tests inspected:** [components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/components.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-radiobutton).


<a id="gc-460-colorpicker"></a>
### `colorpicker`

**Implementation:** [inputs.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/inputs.js), [bases.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/bases.js).

**Tests inspected:** [components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/components.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-colorpicker).


<a id="gc-460-horizontalslider"></a>
### `horizontalSlider`

**Implementation:** [inputs.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/inputs.js), [bases.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/bases.js).

**Tests inspected:** [components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/components.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-horizontalslider).


<a id="gc-460-verticalslider"></a>
### `verticalSlider`

**Implementation:** [inputs.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/inputs.js), [bases.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/bases.js).

**Tests inspected:** [components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/components.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-verticalslider).


<a id="gc-460-numbertextbox"></a>
### `numberTextBox`

**Implementation:** [inputs.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/inputs.js), [typed-editor.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/typed-editor.js).

**Tests inspected:** [typed-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/typed-components.test.js), [form-state.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/form-state.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-numbertextbox).


<a id="gc-460-datetextbox"></a>
### `dateTextBox`

**Implementation:** [inputs.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/inputs.js), [typed-editor.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/typed-editor.js), [date-calendar.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/date-calendar.js).

**Tests inspected:** [typed-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/typed-components.test.js), [calendar-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/calendar-components.test.js), [form-state.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/form-state.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-datetextbox).


<a id="gc-460-timetextbox"></a>
### `timeTextBox`

**Implementation:** [inputs.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/inputs.js), [typed-editor.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/typed-editor.js).

**Tests inspected:** [typed-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/typed-components.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-timetextbox).


<a id="gc-460-filteringselect"></a>
### `filteringSelect`

**Implementation:** [inputs.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/inputs.js), [choice-editor.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/choice-editor.js), [choices.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/choices.js).

**Tests inspected:** [choice-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/choice-components.test.js), [component-review.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/component-review.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-filteringselect).


<a id="gc-460-callbackselect"></a>
### `callbackSelect`

**Implementation:** [inputs.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/inputs.js), [choice-editor.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/choice-editor.js).

**Tests inspected:** [choice-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/choice-components.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-callbackselect).


<a id="gc-460-combobox"></a>
### `comboBox`

**Implementation:** [inputs.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/inputs.js), [choice-editor.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/choice-editor.js).

**Tests inspected:** [choice-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/choice-components.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-combobox).


<a id="gc-460-dbselect"></a>
### `dbSelect`

**Implementation:** [inputs.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/inputs.js), [choice-editor.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/choice-editor.js), [database-choices.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/database-choices.js).

**Tests inspected:** [database-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/database-components.test.js), [form-state.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/form-state.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-dbselect).


<a id="gc-460-dbcombobox"></a>
### `dbComboBox`

**Implementation:** [inputs.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/inputs.js), [choice-editor.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/choice-editor.js), [database-choices.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/database-choices.js).

**Tests inspected:** [database-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/database-components.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-dbcombobox).


<a id="gc-460-checkboxtext"></a>
### `checkBoxText`

**Implementation:** [inputs.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/inputs.js), [bases.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/bases.js), [choices.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/choices.js), [check-box-text.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/check-box-text.js).

**Tests inspected:** [choice-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/choice-components.test.js), [input-validation.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/input-validation.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-checkboxtext).


<a id="gc-460-datecalendar"></a>
### `dateCalendar`

**Implementation:** [inputs.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/inputs.js), [date-calendar.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/date-calendar.js).

**Tests inspected:** [calendar-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/calendar-components.test.js), [input-validation.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/input-validation.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-datecalendar).


<a id="gc-460-button"></a>
### `button`

**Implementation:** [buttons.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/buttons.js), [button.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/view/button.js).

**Tests inspected:** [button-controller.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/button-controller.test.js), [button-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/button-components.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-button).


<a id="gc-460-togglebutton"></a>
### `toggleButton`

**Implementation:** [buttons.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/buttons.js), [button.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/view/button.js).

**Tests inspected:** [button-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/button-components.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-togglebutton).


<a id="gc-460-dropdownbutton"></a>
### `dropDownButton`

**Implementation:** [buttons.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/buttons.js), [button.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/view/button.js).

**Tests inspected:** [button-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/button-components.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-dropdownbutton).


<a id="gc-460-menu"></a>
### `menu`

**Implementation:** [buttons.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/buttons.js), [button.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/view/button.js), [menus.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/menus.js).

**Tests inspected:** [menu-system.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/menu-system.test.js), [button-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/button-components.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-menu).


<a id="gc-460-menuline"></a>
### `menuline`

**Implementation:** [buttons.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/buttons.js), [button.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/view/button.js), [menus.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/menus.js).

**Tests inspected:** [menu-system.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/menu-system.test.js), [button-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/button-components.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-menuline).


<a id="gc-460-spacer"></a>
### `spacer`

**Implementation:** [buttons.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/buttons.js), [menus.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/menus.js).

**Tests inspected:** [menu-system.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/menu-system.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-spacer).


<a id="gc-460-transformpane"></a>
### `transformPane`

**Implementation:** [transform-pane.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/transform-pane.js).

**Tests inspected:** [transform-pane.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/transform-pane.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-transformpane).


<a id="gc-460-dialog"></a>
### `dialog`

**Implementation:** [windows.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/windows.js), [window-surface.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/window-surface.js).

**Tests inspected:** [window-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/window-components.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-dialog).


<a id="gc-460-floatingpane"></a>
### `floatingPane`

**Implementation:** [windows.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/windows.js), [window-surface.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/window-surface.js).

**Tests inspected:** [window-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/window-components.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-floatingpane).


<a id="gc-460-framepane"></a>
### `framePane`

**Implementation:** [border-container.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/border-container.js).

**Tests inspected:** [menu-system.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/menu-system.test.js), [frame-grid.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/frame-grid.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-framepane).


<a id="gc-460-traypane"></a>
### `trayPane`

**Implementation:** [tray-pane.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/tray-pane.js), [tray-geometry.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/tray-geometry.js).

**Tests inspected:** [tray-pane.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/tray-pane.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-traypane).


<a id="gc-460-formlet"></a>
### `formlet`

**Implementation:** [layout.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/layout.js), [formlet-labels.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/formlet-labels.js).

**Tests inspected:** [layout-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/layout-components.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-formlet).


<a id="gc-460-groupbox"></a>
### `groupBox`

**Implementation:** [layout.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/layout.js).

**Tests inspected:** [layout-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/layout-components.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-groupbox).


<a id="gc-460-contentpane"></a>
### `contentPane`

**Implementation:** [border-container.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/border-container.js).

**Tests inspected:** [menu-system.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/menu-system.test.js), [border-container.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/border-container.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-contentpane).


<a id="gc-460-bordercontainer"></a>
### `borderContainer`

**Implementation:** [border-container.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/border-container.js).

**Tests inspected:** [border-container.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/border-container.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-bordercontainer).


<a id="gc-460-stackcontainer"></a>
### `stackContainer`

**Implementation:** [selected-container.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/selected-container.js).

**Tests inspected:** [selected-container.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/selected-container.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-stackcontainer).


<a id="gc-460-tabcontainer"></a>
### `tabContainer`

**Implementation:** [selected-container.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/selected-container.js).

**Tests inspected:** [selected-container.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/selected-container.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-tabcontainer).


<a id="gc-460-tree"></a>
### `tree`

**Implementation:** [tree.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/tree.js), [tree-store.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/tree-store.js).

**Tests inspected:** [tree-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/tree-components.test.js), [tree-store.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/tree-store.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-tree).


<a id="gc-460-rowactions"></a>
### `rowActions`

**Implementation:** [tree.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/tree.js), [button.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/view/button.js).

**Tests inspected:** [tree-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/tree-components.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-rowactions).


<a id="gc-460-codemirror"></a>
### `codeMirror`

**Implementation:** [code-mirror.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/code-mirror.js), [code-mirror-engine.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/code-mirror-engine.js).

**Tests inspected:** [code-mirror.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/code-mirror.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-codemirror).


<a id="gc-460-htmleditor"></a>
### `htmlEditor`

**Implementation:** [html-editor.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/html-editor.js), [jodit-engine.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/jodit-engine.js).

**Tests inspected:** [html-editor.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/html-editor.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-htmleditor).


<a id="gc-460-htmlpreview"></a>
### `htmlPreview`

**Implementation:** [html-preview.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/html-preview.js).

**Tests inspected:** [html-editor.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/html-editor.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-htmlpreview).


<a id="gc-460-markdowneditor"></a>
### `markdownEditor`

**Implementation:** [markdown-editor.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/markdown-editor.js), [prose-mirror-engine.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/prose-mirror-engine.js).

**Tests inspected:** [markdown-editor.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/markdown-editor.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-markdowneditor).


<a id="gc-460-markdownpreview"></a>
### `markdownPreview`

**Implementation:** [html-preview.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/html-preview.js), [markdown-document.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/markdown-document.js).

**Tests inspected:** [markdown-editor.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/markdown-editor.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-markdownpreview).


<a id="gc-460-terminal"></a>
### `terminal`

**Implementation:** [terminal.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/terminal.js), [terminal.py](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/src/gramlot/server/terminal.py).

**Tests inspected:** [terminal.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/terminal.test.js), [test_terminal_session.py](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/tests/test_terminal_session.py).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-terminal).


<a id="gc-460-typstpreview"></a>
### `typstPreview`

**Implementation:** [typst-preview.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/typst-preview.js), [typst-client.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/typst-client.js), [typst-worker.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/typst-worker.js).

**Tests inspected:** [typst.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/typst.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-typstpreview).


<a id="gc-460-uploader"></a>
### `uploader`

**Implementation:** [uploader.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/uploader.js), [upload-engine.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/upload-engine.js), [upload.py](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/src/gramlot/server/upload.py).

**Tests inspected:** [uploader.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/uploader.test.js), [uploader-metadata.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/uploader-metadata.test.js), [test_upload_server.py](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/tests/test_upload_server.py).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-uploader).


<a id="gc-460-imageuploader"></a>
### `imageUploader`

**Implementation:** [image-uploader.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/image-uploader.js), [upload-engine.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/upload-engine.js).

**Tests inspected:** [image-uploader.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/image-uploader.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-imageuploader).


<a id="gc-460-attachmentmanager"></a>
### `attachmentManager`

**Implementation:** [attachment-manager.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/attachment-manager.js), [uploader.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/uploader.js).

**Tests inspected:** [attachment-manager.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/attachment-manager.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-attachmentmanager).


<a id="gc-460-grid"></a>
### `grid`

**Implementation:** [grid.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/grid.js), [grid-structure.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/grid-structure.js), [bag-collection-view.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/stores/bag-collection-view.js), [grid-cell-editor.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/grid-cell-editor.js).

**Tests inspected:** [grid-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/grid-components.test.js), [grid-editing.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/grid-editing.test.js), [bag-collection-store.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/bag-collection-store.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-grid).


<a id="gc-460-searchbox"></a>
### `searchBox`

**Implementation:** [grid-search-box.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/grid-search-box.js), [grid-search.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/grid-search.js).

**Tests inspected:** [frame-grid.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/frame-grid.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-searchbox).


<a id="gc-460-chatmessages"></a>
### `chatMessages`

**Implementation:** [chat.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chat.js), [chat.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/chat.js), [chat.py](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/src/gramlot/page/chat.py).

**Tests inspected:** [chat.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chat.test.js), [test_chat.py](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/tests/test_chat.py).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chatmessages).


<a id="gc-460-grouplet"></a>
### `grouplet`

**Implementation:** [grouplets.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/grouplets.js).

**Tests inspected:** [grouplets.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/grouplets.test.js), [test_grouplets.py](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/tests/test_grouplets.py).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-grouplet).


<a id="gc-460-groupletcard"></a>
### `groupletCard`

**Implementation:** [grouplet-card.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/grouplet-card.js), [grouplet-card.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/view/grouplet-card.js).

**Tests inspected:** [grouplet-card.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/grouplet-card.test.js), [test_grouplets.py](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/tests/test_grouplets.py).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-groupletcard).


<a id="gc-460-chartpane"></a>
### `chartPane`

**Implementation:** [chart-pane.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-pane.js).

**Tests inspected:** [chart-engines.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-engines.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartpane).


<a id="gc-460-chartview"></a>
### `chartView`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js).

**Tests inspected:** [chart-renderer.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-renderer.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartview).


<a id="gc-460-chartfields"></a>
### `chartFields`

**Implementation:** [chart-fields.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-fields.js).

**Tests inspected:** [chart-fields.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-fields.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartfields).


<a id="gc-460-chartgeojson"></a>
### `chartGeoJSON`

**Implementation:** [chart-geojson.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-geojson.js).

**Tests inspected:** [chart-geojson.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-geojson.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartgeojson).


<a id="gc-460-charttimeline"></a>
### `chartTimeline`

**Implementation:** [chart-timeline.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-timeline.js).

**Tests inspected:** [chart-time.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-time.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-charttimeline).


<a id="gc-460-gauge"></a>
### `gauge`

**Implementation:** [chart-gauge.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-gauge.js), [chart-gauge-options.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-gauge-options.js).

**Tests inspected:** [chart-gauge.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-gauge.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-gauge).


<a id="gc-460-chartbar"></a>
### `chartBar`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartbar).


<a id="gc-460-chartline"></a>
### `chartLine`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartline).


<a id="gc-460-chartarea"></a>
### `chartArea`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartarea).


<a id="gc-460-chartstackedbar"></a>
### `chartStackedBar`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartstackedbar).


<a id="gc-460-chartstackedarea"></a>
### `chartStackedArea`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartstackedarea).


<a id="gc-460-charthorizontalbar"></a>
### `chartHorizontalBar`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-charthorizontalbar).


<a id="gc-460-chartpie"></a>
### `chartPie`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartpie).


<a id="gc-460-chartdonut"></a>
### `chartDonut`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartdonut).


<a id="gc-460-chartscatter"></a>
### `chartScatter`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartscatter).


<a id="gc-460-chartbar3d"></a>
### `chartBar3D`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartbar3d).


<a id="gc-460-chartline3d"></a>
### `chartLine3D`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartline3d).


<a id="gc-460-chartscatter3d"></a>
### `chartScatter3D`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartscatter3d).


<a id="gc-460-chartsurface"></a>
### `chartSurface`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartsurface).


<a id="gc-460-chartmap"></a>
### `chartMap`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartmap).


<a id="gc-460-chartmapbar3d"></a>
### `chartMapBar3D`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartmapbar3d).


<a id="gc-460-chartmap3d"></a>
### `chartMap3D`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartmap3d).


<a id="gc-460-chartlines3d"></a>
### `chartLines3D`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartlines3d).


<a id="gc-460-chartpolygons3d"></a>
### `chartPolygons3D`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartpolygons3d).


<a id="gc-460-chartfunnel"></a>
### `chartFunnel`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartfunnel).


<a id="gc-460-chartradar"></a>
### `chartRadar`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartradar).


<a id="gc-460-chartparallel"></a>
### `chartParallel`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartparallel).


<a id="gc-460-chartheatmap"></a>
### `chartHeatmap`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartheatmap).


<a id="gc-460-chartsankey"></a>
### `chartSankey`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartsankey).


<a id="gc-460-chartcandlestick"></a>
### `chartCandlestick`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartcandlestick).


<a id="gc-460-chartboxplot"></a>
### `chartBoxplot`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartboxplot).


<a id="gc-460-charttreemap"></a>
### `chartTreemap`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-charttreemap).


<a id="gc-460-chartsunburst"></a>
### `chartSunburst`

**Implementation:** [charts.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/charts.js), [index.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/chart-types/index.js).

**Tests inspected:** [chart-type-elements.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/chart-type-elements.test.js).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-chartsunburst).


<a id="gc-460-audioanalyser"></a>
### `audioAnalyser`

**Implementation:** [audio.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/audio.js), [audio-analysis-session.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/audio-analysis-session.js).

**Tests inspected:** [audio-component.test.mjs](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/audio-component.test.mjs), [audio-analysis-session.test.mjs](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/audio-analysis-session.test.mjs).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-audioanalyser).


<a id="gc-460-drawingpane"></a>
### `drawingPane`

**Implementation:** [drawing.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/drawing.js).

**Tests inspected:** [drawing.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/drawing.test.js), [test_drawing_pane.py](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/tests/test_drawing_pane.py).

[Teaching coverage and remaining exercises](465-widget-examples.md#gc-465-drawingpane).


<a id="gc-460-020"></a>
## Structural declarations

The three Grid authoring declarations below are additional Source grammar, excluded from the 53-widget count. Parameters and behavior are in [the structural reference](345-widget-reference.md#gc-345-390).

### `struct`

**Implementation:** [grid-struct.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/binding/grid-struct.js), [grid-structure.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/grid-structure.js), [grid-grammar.json](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/grid-grammar.json).

**Tests inspected:** [test_grid_authoring.py](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/tests/test_grid_authoring.py), [grid-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/grid-components.test.js).

### `column`

**Implementation:** [grid-struct.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/binding/grid-struct.js), [grid-structure.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/grid-structure.js), [grid-grammar.json](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/grid-grammar.json), [grid-formulas.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/grid-formulas.js), [grid-footer.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/grid-footer.js).

**Tests inspected:** [test_grid_authoring.py](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/tests/test_grid_authoring.py), [grid-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/grid-components.test.js), [grid-editing.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/grid-editing.test.js), [grid-formulas.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/grid-formulas.test.js).

### `colgroup`

**Implementation:** [grid-struct.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/binding/grid-struct.js), [grid-structure.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/grid-structure.js), [grid-grammar.json](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/src/components/grid-grammar.json).

**Tests inspected:** [test_grid_authoring.py](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/tests/test_grid_authoring.py), [grid-components.test.js](https://github.com/gramlot-org/gramlot/blob/2b1f2d80e345ad27a90da36b53171a158a767dcb/js/tests/grid-components.test.js).


<a id="gc-460-025"></a>
## Verification of this audit

The documentation checks passed 18 tests, including exact widget inventory, parameter preservation, paired anchors, generated-file freshness and placement of collection snippets in the appendix. The strict Sphinx build and public link checker passed for 32 pages and 11 compact downloads.

Focused behavioral verification covered 76 cases in the CodeMirror, form-state, input-validation, layout, selected-container, transformPane and Typst suites. An initial checkout dependency mismatch and a missing local Python path were corrected before the affected checks passed. This run does not qualify all widgets or real-browser/native-dialog behavior; the other linked suites are inspected evidence only.
