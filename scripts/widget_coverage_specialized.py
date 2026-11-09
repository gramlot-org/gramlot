"""Source and test evidence for specialized widgets."""
import json
from pathlib import Path

def _record(data, events, children, limits, sources, tests, examples, example_note):
    return dict(data=data, events=events, children=children, limits=limits,
                sources=sources.split(), tests=tests.split(),
                examples=[f"src/gramlot_examples/{path}" for path in examples.split()],
                example_note=example_note)


COVERAGE = {
    "codeMirror": _record(
        "Bind value two ways to source text. Live writes are the default. Deferred edits commit when focus leaves the editor. External value and configuration changes update the retained CodeMirror state.",
        "Undo, redo and historyChanged expose editor history. Ctrl/Cmd+S publishes local save while editable. Ctrl/Cmd+F opens search. Tab indents, Shift+Tab outdents and Escape followed by Tab exits.",
        "Leaf control. Place a toolbar or preview beside it. Wait for ready before using engine-dependent methods such as diagnostics and position revelation.",
        "Language names are enumerated and completion uses local language support. Readonly prevents changes and replacement. Disabled also prevents focus. The application owns persistence.",
        "js/src/components/code-mirror.js js/src/components/code-mirror-engine.js",
        "js/tests/code-mirror.test.js",
        "pages/06-editors/01-base.md pages/06-editors/02-options.md",
        "Text editing and runtime options.",
    ),
    "terminal": _record(
        "Reads session, the name of an @terminal method of the page store. Writes connected, rows and columns when the socket opens, closes or the screen is resized. Terminal bytes never pass through Data.",
        "Keys go to the session as typed, including arrows, Tab and Ctrl-C. Output is written to the screen as it arrives. input(text) sends text as if typed.",
        "Leaf control. It fills its box and resizes the server terminal with it.",
        "Requires a server with a PageStore channel (websocket). One page opens a session name once. The server stops sending output while 1 MB is unacknowledged by the screen.",
        "js/src/components/terminal.js src/gramlot/server/terminal.py",
        "js/tests/terminal.test.js tests/test_terminal_session.py",
        "",
        "Keystroke sessions on the server.",
    ),
    "htmlEditor": _record(
        "Bind value two ways to HTML source. Live writes are the default and deferred edits commit on blur. Rich edits can normalize markup, while undo to the initial snapshot restores the original source.",
        "The rich toolbar edits supported body content. Undo, redo and the local save shortcut follow the editor history contract.",
        "Leaf control. Pair it with a preview or source editor through the same Data string.",
        "The document head, doctype and protected body regions stay outside the editable content. Removing or duplicating a protected placeholder rejects the edit. Use source editing for protected regions.",
        "js/src/components/html-editor.js js/src/components/jodit-engine.js",
        "js/tests/html-editor.test.js", "pages/06-editors/03-html.md",
        "Rich editing, source and preview in one lesson.",
    ),
    "htmlPreview": _record(
        "The read-bound value supplies the HTML string projected to the iframe document. A Data change replaces the displayed document.",
        "Displays the iframe document without edit, save or completion callbacks.",
        "Leaf control. Bind it to the same Data path as a separate HTML editor.",
        "The iframe sandbox has no allow tokens, so scripts cannot execute. The Data string stays intact.",
        "js/src/components/html-preview.js", "js/tests/html-editor.test.js",
        "pages/06-editors/03-html.md", "Preview of the shared HTML source.",
    ),
    "markdownEditor": _record(
        "Bind value two ways to Markdown. Live writes are the default and deferred edits commit on blur. Incoming Data updates retain the ProseMirror engine and plugins. Undo to the initial snapshot recovers the exact source.",
        "The toolbar and native edits go through the same document model. Undo, redo and local save use the shared editor contract.",
        "Leaf control. Pair it with markdownPreview or a source editor through the same text path.",
        "Rich editing covers ordinary paragraphs, headings, lists, quotes and fenced code. Tables, embedded HTML, strikethrough and task lists remain opaque source blocks. Frontmatter and reference definitions preserve the whole document as a source block. Rich edits can normalize supported syntax.",
        "js/src/components/markdown-editor.js js/src/components/prose-mirror-engine.js",
        "js/tests/markdown-editor.test.js", "pages/06-editors/04-markdown.md",
        "Editing and preview of a shared draft.",
    ),
    "markdownPreview": _record(
        "Reads Markdown through value. Changing allowHtml alters rendering only. By default embedded HTML appears as text. With allowHtml enabled, rendered HTML is sanitized.",
        "Updates as read inputs change. It declares no save, edit or render-completion callback.",
        "Leaf control. Pair it with a Markdown editor through the same Data string.",
        "The renderer loads on demand. The sandboxed preview policy blocks external image requests and rendering leaves the source intact.",
        "js/src/components/html-preview.js js/src/components/markdown-document.js",
        "js/tests/markdown-editor.test.js", "pages/06-editors/04-markdown.md",
        "Preview of a shared Markdown draft.",
    ),
    "typstPreview": _record(
        "Reads the Typst source from value and the download name from filename. SVG, PDF and diagnostics stay inside the browser preview. The current Worker produces SVG and PDF for each successful preview revision.",
        "Changes schedule compilation after a short pause. The current result enables download and diagnostics appear in the widget. It declares no completion callback.",
        "Leaf control. Pair it with codeMirror from the separate editors collection to edit the same draft.",
        "The browser Worker uses a bundled compiler and fonts. Includes, custom assets and external packages are outside the browser preview contract. Source changes invalidate prior output immediately. Removing the last preview releases the shared Worker.",
        "js/src/components/typst-preview.js js/src/components/typst-client.js js/src/components/typst-worker.js",
        "js/tests/typst.test.js", "pages/06-editors/05-typst.md",
        "Source editing, browser preview and PDF download.",
    ),
    "uploader": _record(
        "Initialize a Bag at storepath for queue rows and progress. selectedPath writes the queue-relative row label and clears when that row is removed. Files and temporary grants stay outside Data. Preparation snapshots row metadata fields and the optional contextPath Bag separately.",
        "Selection and drop add files. autoUpload starts queued files, including when enabled after selection. In deferred mode manualUpload controls the Upload action. onComplete names Page Logic receiving item and result after confirmed completion.",
        "Leaf control. Place ordinary metadata controls beside it and bind them to the selected row's metadata Bag. Give them an empty scope when no row is selected.",
        "The host and application operation own authorization and storage. Check status reconciles uncertain outcomes before retry. Local preview covers safe text and raster images. File-origin WebKit Workers can fail to read selected File objects.",
        "js/src/components/uploader.js js/src/components/upload-engine.js src/gramlot/server/upload.py",
        "js/tests/uploader.test.js js/tests/uploader-metadata.test.js tests/test_upload_server.py",
        "pages/01-uploader/02-upload_queue.md", "Deferred transfer and row metadata.",
    ),
    "imageUploader": _record(
        "Bind value two ways and initialize a queue Bag at storepath. Crop confirmation writes a PNG data URL in browser-only mode or a displayable URL returned by the application operation in transfer mode. External value changes supersede open edits.",
        "Select or drop one image, move, zoom or rotate the crop, then confirm or cancel. Camera and screen capture feed the same crop path when available. Server-mode onComplete receives item and result after confirmed transfer.",
        "Leaf control with its own crop dialog. Compose surrounding form controls normally and share contextPath when the upload operation needs it.",
        "Input supports PNG, JPEG and WebP. Positive integer crop and output dimensions must have the same aspect ratio. Remote editing requires canvas-compatible URL access. Camera needs a capable device provider and permission, with a secure context for browser capture. Screen capture depends on browser support and permission. Stored files remain under application control after value is cleared.",
        "js/src/components/image-uploader.js js/src/components/upload-engine.js",
        "js/tests/image-uploader.test.js", "pages/01-uploader/04-editable_image.md",
        "Crop confirmation. Device capture depends on the environment.",
    ),
    "attachmentManager": _record(
        "Initialize queue and record context Bags at storepath and contextPath. Update context before ready enables queued uploads. selectedPath addresses a queue row for metadata editing. The list endpoint provides opaque attachment IDs and captions.",
        "The manager refreshes its list after confirmed upload, calls readMethod for preview and removeMethod for deletion. Context changes clear the old selection and discard stale responses. Failed removal retains selection and reports an error. It declares no public onComplete.",
        "Leaf control composing its own multiple-file queue, list and preview. External metadata fields can bind to the selected queue row.",
        "The application supplies operation, listMethod, readMethod and removeMethod and owns authorization and persistence. Preview responses distinguish text, image and message. Removal requires a true result.",
        "js/src/components/attachment-manager.js js/src/components/uploader.js",
        "js/tests/attachment-manager.test.js", "pages/01-uploader/03-attachment_manager.md",
        "Queued files before record save and attachment operations after the context becomes ready.",
    ),
    "grid": _record(
        "storepath identifies the row Bag. Explicit rowMode selects nested value Bags or row-node attributes. Resident grids share row identity and own independent order and filter. A windowed provider supplies windowInfo and loading and can consume viewport and sortRequest writes.",
        "Headers support ordering and column manipulation. Optional row headers, resizing and self-drag expose row operations. Double-click or Enter/F2 opens an editable cell, Enter commits, Tab moves and Escape discards unfinished text.",
        "Provide one inline struct or an external structure Bag via structpath. The frameGrid recipe supplies toolbar and search composition. Local editors use ordinary Source controls in an enclosing form session or a standalone session.",
        "Resident virtualization bounds rendered rows while the Bag stays resident. Windowed data needs a provider and local editing is resident-only. Local changes, drafts and errors survive viewport recycling. footer displays the footer row; column totals cover every resident row. Database queries and durable writes belong to the application integration.",
        "js/src/components/grid.js js/src/components/grid-structure.js js/src/stores/bag-collection-view.js js/src/components/grid-cell-editor.js",
        "js/tests/grid-components.test.js js/tests/grid-editing.test.js js/tests/bag-collection-store.test.js",
        "pages/05-grid/01_basic.md pages/05-grid/05_shared_store.md pages/05-grid/08_virtual_scroll.md pages/05-grid_editable/10_editing.md",
        "Basic resident grid, independent shared-store views, virtualization and local editing.",
    ),
    "searchBox": _record(
        "searchOn chooses eligible columns. searchLiteral=True uses literal case-insensitive text matching; the default retains regular expressions. Accepted queries update only the target view's search contribution, in AND with its base filter and setFilter; clearing search preserves both. Bind searchTime to record elapsed filter evaluation time. The input draft stays local until it can be applied.",
        "Typing starts a short debounce and Enter applies immediately. Changing columns, Escape or Clear removes the filter. Invalid or incomplete expressions retain the last accepted filter.",
        "Leaf control that resolves the grid through its FrameGrid recipient. Put it in the FrameGrid search composition.",
        "Works against the resident view. Number and date syntax depends on the column type and locale. Removal cancels the timer and releases view subscriptions.",
        "js/src/components/grid-search-box.js js/src/components/grid-search.js",
        "js/tests/frame-grid.test.js", "pages/05-grid/07_search.md",
        "FrameGrid search and filter syntax.",
    ),
    "struct": _record(
        "An inline declaration projects to a structure Bag before rendering. Use structpath to read a separately maintained structure instead.",
        "Grid header interactions can update the projected structure. Other grids sharing that Bag observe its changes. The declaration has no callback.",
        "Grid declaration containing columns and column groups. It has no separate browser element.",
        "Use one inline struct or an external structpath. Duplicate fields, unknown attributes and nested groups are rejected. External sets use check=multiple, checked=^DataPath and checkedField=identityField. Initialize the Data value to an empty string; nonempty text IDs without commas are stored as comma-separated strings. Literal comma-wrapped includes checks membership. Each toggle writes Data and refreshes all views without editing records. Dynamic columns observe the structure Bag; removing a column keeps its set. Offscreen IDs survive. External set columns cannot have editors and are excluded from ordinary field sorting/search; check=single uses a radio and writes one scalar ID to checked without editing supplier rows. It supports partial stores, retains filtered/offscreen choices and never toggles off the selected radio. Text and numeric identities retain their type. Bulk actions are not implemented. A read-bound setFilter string names external check columns: john,fred means intersection, empty removes only the set contribution. Base filter, search and setFilter combine with AND. Set Data changes immediately update the view. Nonempty setFilter requires a complete resident store; windowInfo and unknown check columns are rejected. Column title retains the full tooltip/accessibility name when name is abbreviated. columnFilters=True enables distinct-value header popups on complete resident stores: OR within each column, AND across columns/base/search/sets. Counts exclude only their own column selection. Empty groups null and empty text; zero-count selections persist. None differs from Reset. The popup reuses the shared grid and menu toolbar; its literal search filters only the choices and preserves hidden selections. All/None apply to the entire choice list. Accepted criteria live in the Source-owned collection view; row edits update counts. Date columns add inclusive From/To and period entry; range AND values is one column criterion. Changing range selects all matching dates; clearing From clears To but preserves selected dates. Reset clears both. Invalid drafts retain the accepted filter.",
        "js/src/binding/grid-struct.js js/src/components/grid-structure.js js/src/components/grid-grammar.json",
        "tests/test_grid_authoring.py js/tests/grid-components.test.js",
        "pages/05-grid/01_basic.md pages/05-grid/03_colgroups.md",
        "Ordinary and grouped structures.",
    ),
    "column": _record(
        "The required field identifies a row field under the chosen rowMode. Metadata configures caption, type and presentation. Enable local editing with edit=True or an editor options dictionary.",
        "The grid handles header and cell interactions. The column supplies configuration for the projected header, cells and optional editor.",
        "Leaf declaration inside struct or colgroup, without a separate browser element.",
        "Field identity must be unique. Attribute names and values are validated. formula, formula_<name>, calculated and hidden compute row fields (# and += per grid on its visible rows, never written; sorting, filtering or searching them is an error); totalize, footer_value and footer_format configure totals. Other unknown keywords are rejected. Formulas and totals are an intermediate implementation whose final placement (data level or grid) is under review.",
        "js/src/binding/grid-struct.js js/src/components/grid-structure.js js/src/components/grid-grammar.json js/src/components/grid-formulas.js js/src/components/grid-footer.js",
        "tests/test_grid_authoring.py js/tests/grid-components.test.js js/tests/grid-editing.test.js js/tests/grid-formulas.test.js",
        "pages/05-grid/01_basic.md pages/05-grid_editable/10_editing.md",
        "Field mapping and optional cell editing.",
    ),
    "colgroup": _record(
        "Supplies identity, caption and optional colors for a header band. Column membership belongs to the structure Bag.",
        "Moving columns can split or join contiguous header bands while preserving group membership. The group declares no callback.",
        "Place directly under struct and put column declarations inside. The grid renders the group.",
        "Groups cannot nest. Each member column still identifies its own row field.",
        "js/src/binding/grid-struct.js js/src/components/grid-structure.js js/src/components/grid-grammar.json",
        "tests/test_grid_authoring.py js/tests/grid-components.test.js",
        "pages/05-grid/03_colgroups.md", "Grouped headers.",
    ),
    "chatMessages": _record(
        "Displays its Source children. The separate ChatPane recipe creates and binds conversation, message and draft Data. Page Logic renders strings literally and gives Source messages independent scopes.",
        "The viewport is a focusable scroll region with polite log announcements. ChatPane Logic owns sending, request correlation, message rendering and conditional follow-on-scroll. ChatPageStore's processing hook may return text or Gramlot Source.",
        "Accepts ordinary Source children. Python ChatPane composes the viewport with frame regions, composer, toolbar, actions and controllers.",
        "The viewport declares no send, provider or persistence parameters. The recipe needs the supporting collections, Page Logic and a working PageStore. Application code owns authorization and provider integration.",
        "js/src/components/chat.js js/src/chat.js src/gramlot/page/chat.py",
        "js/tests/chat.test.js tests/test_chat.py",
        "trials/chat_base/pages/92-chat/01-echo.md",
        "The opt-in echo trial demonstrates the composed recipe and PageStore.",
    ),
    "grouplet": _record(
        "The read-bound remote name selects a reusable Source endpoint. datapath gives each instance a scope for relative child bindings. Shared remote binding governs readiness and caching.",
        "Remote loading and replacement use ordinary Source lifecycle. Removal cancels pending work and suppresses late results. It declares no additional completion or save callback.",
        "Accepts ordinary authored Source children and remote fragments, including nested fragments. Activate collections used by the children.",
        "Uses the standard remote Source endpoint contract. Record loading, editing policy and persistence belong to the composed application.",
        "js/src/components/grouplets.js", "js/tests/grouplets.test.js tests/test_grouplets.py",
        "pages/09-grouplets/01-remote_fragment.md pages/09-grouplets/02-independent_instances.md pages/09-grouplets/03-nested_fragments.md",
        "Reusable remote Source, independent scopes and nesting.",
    ),
    "groupletCard": _record(
        "Bind collapsed and checkbox two ways to retain changes in Data. Null checkbox hides it and false shows it unchecked. Title, label, header side, collapsible, delitem and doc are read inputs. Body bindings use the card's instance scope.",
        "Header controls fold and toggle the checkbox. An authored menu can supply actions. Clear asks for confirmation and rechecks its gate before clearing eligible values. The information button opens the Markdown guide. It declares no additional save or completion callback.",
        "Accepts authored or remote Source body children, including nested cards. An authored menu supplies header actions.",
        "Header side accepts top, left or right. Null delitem hides Clear, false disables it and true enables it. Clear affects direct untransformed reactive body value bindings within scope, preserving header state. Body replacement or removal invalidates pending confirmation.",
        "js/src/components/grouplet-card.js js/src/view/grouplet-card.js",
        "js/tests/grouplet-card.test.js tests/test_grouplets.py",
        "pages/09-grouplets/04-order_cards.md pages/09-grouplets/05-card_actions.md pages/09-grouplets/06-card_guides.md",
        "Independent state, header actions, Clear and inline guides.",
    ),
}

COVERAGE['chartPane'] = _record('storepath and configpath identify original Data Bags. rowMode selects attributes or values.', 'Shared settings, playback controls and engines retain configuration in Data.', 'Composes the shared frame and chart controls.', 'Business aggregation stays upstream; unsupported types are not emulated.', 'js/src/components/chart-pane.js', 'js/tests/chart-engines.test.js', 'pages/05-grid/13_charts.md', 'Shared chart configuration and time.')

COVERAGE['chartView'] = _record('Reads store and bound chart configuration; selectedTerritory writes the chosen name.', 'Observes rows and grid filtering, updates the engine and releases it on removal.', 'Rendering surface composed by chartPane.', 'Numeric X is required by uPlot; mapBar3D is ECharts-only.', 'js/src/components/charts.js', 'js/tests/chart-renderer.test.js', 'pages/05-grid/13_charts.md', 'Shared chart configuration and time.')

COVERAGE['chartFields'] = _record('Reads store metadata and writes available chart fields to configuration.', 'Rebuilds field choices when the original Bag changes.', 'Internal shared chart settings component.', 'Does not query a database or infer business aggregates.', 'js/src/components/chart-fields.js', 'js/tests/chart-fields.test.js', 'pages/05-grid/13_charts.md', 'Shared chart configuration and time.')

COVERAGE['chartGeoJSON'] = _record('value binds a plain GeoJSON feature collection or null.', 'Validates supplied geography and displays its summary.', 'Shared geography input for chart configuration.', 'Named Polygon/MultiPolygon features only; host owns territorial matching.', 'js/src/components/chart-geojson.js', 'js/tests/chart-geojson.test.js', 'pages/05-grid/13_charts.md', 'Shared chart configuration and time.')

COVERAGE['chartTimeline'] = _record('Reads store/time parameters and writes timeline state under configpath.', 'Tracks bounds and prepared snapshots; removal releases observation.', 'Used by chartPane with its playback controls.', 'No business aggregation; calendar periods and empty policy are explicit.', 'js/src/components/chart-timeline.js', 'js/tests/chart-time.test.js', 'pages/05-grid/13_charts.md', 'Shared chart configuration and time.')

COVERAGE['gauge'] = _record('The node value is the single value, a Data pointer with optional ?attr. min, max, mask, thresholds, presentation and caption read Data. Nothing is written.', 'Redraws when the value or a parameter changes and follows the light or dark theme; removal releases the engine.', 'Leaf rendering surface; no children.', 'One numeric value; an empty value shows the information notice No value, never zero. Errors show an error notice with More info. Values outside min and max are clamped on the dial, the text shows the real value. Threshold colors are names or hex codes.', 'js/src/components/chart-gauge.js js/src/components/chart-gauge-options.js', 'js/tests/chart-gauge.test.js', 'pages/86-chart-types/gauges.md', 'Live gauge settings: value, presentation, range, thresholds and mask.')

COVERAGE['vizabiBubble'] = _record('Reads the original rows and configuration Bag.', 'Retains supported session configuration and releases engine resources on removal.', 'Specialized external bubble view.', 'Requires host-supplied libraryUrl; not a chartPane engine.', 'js/src/components/vizabi.js', 'tools/gramlot-tools-inspector/tests/vizabi-trial-browser.mjs', '', 'Host-only integration; no common gallery lesson.')

COVERAGE['audioAnalyser'] = _record(
    'running controls capture; waveform and spectrum write numeric arrays as individual Data values. sampleRate, status and error report the session.',
    'Changes to supported configuration update the analyser. Capture failure clears running and reports error.',
    'Invisible leaf component; compose ordinary controls and charts around its bindings.',
    'Requires microphone permission and a secure context. Stop, pagehide and disposal release resources. No recording or persistence.',
    'js/src/components/audio.js js/src/components/audio-analysis-session.js',
    'js/tests/audio-component.test.mjs js/tests/audio-analysis-session.test.mjs', '',
    'Microphone analysis is an optional live gallery example.')
COVERAGE['drawingPane'] = _record(
    'annotations reads and mutates the original Data Bag; image reads an optional background URL.',
    'Shared toolbar actions select, draw, edit text and delete shapes. Bag changes redraw the surface.',
    'Composes a shared Source menu and an SVG drawing surface.',
    'Requires an initialized annotation Bag. Coordinates follow image dimensions or a 1000 by 1000 empty surface. Disposal releases subscriptions; persistence belongs to the application.',
    'js/src/components/drawing.js', 'js/tests/drawing.test.js tests/test_drawing_pane.py',
    'pages/06-editors/06-drawing.md', 'Drawing annotations retained in Data.')


# One element per chart type (chartBar, chartCandlestick, ...), generated from the chart type syntax.
_CHART_ELEMENTS = json.loads((Path(__file__).resolve().parents[1] / 'src/gramlot/collections/charts.json').read_text())['elements']
for _name, _element in _CHART_ELEMENTS.items():
    if _element['_meta']['render_tag'].startswith('gramlot-chart-') and _name not in COVERAGE \
            and _name not in ('chartPane', 'chartFields', 'chartGeoJSON', 'chartTimeline'):
        COVERAGE[_name] = _record(
            'Reads the rows of storepath and the columns named by its attributes, which are the roles of the chart type syntax. A fixed measure is its own attribute; a list of measures is measures. Nothing is written except selectedTerritory on maps.',
            'Same as chartView: observes rows, grid filtering and series options; removal releases the engine.',
            'Leaf rendering surface: chartView with a fixed chartType.',
            'The Builders reject the element without a required role. A misspelt attribute is accepted by the Builders: the missing role then shows the syntax diagnosis in place of the chart.',
            'js/src/components/charts.js js/src/components/chart-types/index.js', 'js/tests/chart-type-elements.test.js', '', '')
