"""Explanatory prose for the generated collection manuals."""

COLLECTION_EXPLANATIONS = {
    "inputs": """
## Choose the value contract before the appearance

Use `textbox` for a single string, `textBoxArea` for multiline plain text and
`passwordbox` for masked text. All bind their value to Data; password masking is
only visual and does not encrypt that value. `checkbox` stores a Boolean, including
when `mode="switch"` changes its appearance. A single `radioButton` also stores a
Boolean: its Source-scoped `group` clears the other member values. In contrast,
`radioButtonText` stores the chosen option code in one string, and `checkBoxText`
stores comma-separated codes, or null for no selection. Their captions are not
record values. Use `cols` to arrange these inline option groups; `checkBoxText`
also offers `popup=True`, Bag options and complete remote option lists. See [native variants](105-components.md#gc-105-040)
and [multiple choices](105-components.md#gc-105-065).

`filteringSelect` is for a closed local set, `callbackSelect` for a set supplied by
a named browser Logic method, and `comboBox` for suggestions that also allow free
text. Local `values` uses `code:Caption` pairs. The constrained selectors store a
code; `comboBox` stores the caption/text itself, including unlisted text. A query
in a constrained field is an editing draft and never becomes Data merely because
`live=True`. The callback receives `_querystring` or `_id` and returns
`{rows, identifier, caption}`, synchronously or as a Promise. It owns filtering;
the control discards obsolete replies. Selection can use mouse or keyboard;
Escape cancels the draft, and an arbitrary unmatched caption remains invalid.
See [choice editing](105-components.md#gc-105-055) and
[free text suggestions](105-components.md#gc-105-060).

`dbSelect` and `dbComboBox` obtain remote suggestions through `method`; they do
not add a database to the core. `dbSelect` stores the selected key (text or integer),
while `dbComboBox` accepts free text. `caption_field` controls display separately
from identity; `selectedCaption`, `selectedRecord` and `selectedCb` expose the
selection contract. Database query features require the relevant server
integration. A file-only export cannot execute a Python endpoint or provide a
database integration; a JavaScript Worker endpoint may supply its own values. Declare the provider
and its authorization in the host rather than introducing application requests.

`numberTextBox`, `dateTextBox` and `timeTextBox` separate localized editing text
from typed Data. Numbers use finite real values by default; `dtype="L"` requests
safe integers and `dtype="N"` exact Decimal support. Dates are civil `D` values,
times civil `H` values; formatting does not change them into strings. Incomplete
or unparseable drafts retain the last typed Data value. Enter/change/blur commits
valid text, `live=True` commits valid input as it is entered, Escape restores the
accepted value, and clearing writes null. `dateCalendar` edits the same date type
inline; `dateTextBox` provides its calendar popup unless `calendar=False`.
`workdate` sets the reference day for relative date editing, not the field value.
Set `period_to=".end"` to accept periods too: the start becomes the value and the
end is written to that relative Data path after acceptance. Invalid drafts write neither bound.
See [typed editors](105-components.md#gc-105-045) and
[calendar interaction](105-components.md#gc-105-070).

`colorpicker` uses the browser's color chooser and stores a color string.
`horizontalSlider` and `verticalSlider` store numbers within `min`, `max`, `step`.
The native range also corrects finite incoming Data to that grid through a plain
reactive value pointer; controls sharing a path need compatible ranges. This
correction is independent of `live`. Native range keyboard details can vary by
browser. Use `disabled` to lock radios, colors and ranges: native `readonly` does
not lock those controls. Text, password, multiline, color and range controls commit
on change by default and on input with `live=True`.

Bind `value="^.field"` within the intended datapath, load record values into Data,
and reserve `default` for interface defaults. Labels (`lbl`, `lbl_position`) and
`validate_*` are shared field services, not persistence. Parseable values can still
fail validation and block form saving. `editingStatus` presents the nearest shared
editing session's errors and changes; it requires that session and creates neither
a record store nor a save implementation. See [editing sessions](340-components-and-collections-guide.md#gc-340-110),
[validation](105-components.md#gc-105-076) and the parameter contracts below.
""",
    "buttons": """
## Separate commands, selected state and command presentation

Choose `button` for an application action, `toggleButton` when that action also has
a bound Boolean state, and `dropDownButton` for separate main-action and submenu
surfaces. Actions use Gramlot's existing action/Logic services. These components
do not implicitly submit an HTML form; use `html_button` for native submit/reset.
A toggle updates Data before its optional action; confirmation of that action does
not reverse the toggle. `readonly` and `disabled` prevent user toggling while
external Data continues to update its LED. See [button behavior](105-components.md#gc-105-095).

A dropdown's main surface runs its current command; its arrow opens choices.
Ordinary selection executes a command. Shift+selection executes it and installs
it as the new default, including through the keyboard. Each actionable entry needs
a unique `code`; `menuline("-")` declares a separator. With `persist=True`, provide
a stable explicit `id`: browser storage remembers the selected code for this page
URL/id, not application Data or command results. An absent saved code falls back
to the authored default. Changing the default on touch still requires Shift.

Use `menu` for the command hierarchy and `menuline` for commands, submenu parents,
separators or toolbar groups. `presentation="bar"` makes the first level a toolbar;
`orientation="vertical"` makes a rail. The same hierarchy can be authored separately
for a context popup and a toolbar. A normal context menu opens by right-click or
keyboard context action; `modifiers` declares click-based opening. Opening modifiers
are distinct from command activation modifiers. A named registry command inherits
its label/icon and publishes to its frame recipient; it does not itself save Data.
The message contains `sender`, `target`, `command`, resolved `parameters` and
activation `modifiers`. Mark exactly one central descendant `frameTarget=True`;
a nested frame has its own scope. Missing/ambiguous targets are rejected, rather
than dispatched to an implicit global action. See [command registration and routing](350-menus-toolbars-and-windows.md#gc-350-010).

Use `spacer(size=...)` for fixed separation or `spacer(flex=1)` for elastic space.
It has no command or Data write. A `menuline(group=True)` keeps embedded controls
and commands together. The visible prefix stays in declaration order; the
complete non-fitting suffix enters the vertical popup.
`icon` is text/emoji; use `iconSrc` for an SVG/image URL. `labelPosition` and
`iconSize` govern presentation independently of command identity. Bind `disabled`,
`checked` and ordinary visibility to Data as needed; `checked` on a menuline is
presentation, not an implicit toggle writer. Resolver menus require an application
endpoint and own their loading/cache contract. See [groups and overflow](350-menus-toolbars-and-windows.md#gc-350-025)
and [resolver submenus](350-menus-toolbars-and-windows.md#gc-350-030).
""",
    "layout": """
## Compose retained content and bind only the state you need

`formlet` arranges labelled fields on a grid; choose a positive `columns` count,
a CSS track list or `col_min_width` for fitting columns. It controls presentation,
not record persistence. `groupBox` supplies a labelled Data scope and visual grouping
with bar, underline or card headers; its `copy` capability is separate from saving
a record. `contentPane` is the general content holder used by region compositions.
See [forms and groups](105-components.md#gc-105-085).

A selectable heading uses `lbl_values="internal:Internal note,public:Public note"`
and `lbl_value="^note.kind"`. The existing menu displays captions and writes the
selected code; both attributes can follow Data. Without a binding, the selected
code is retained on the Source node. A plain `lbl` stays fixed. The same renderer
Labelbox supplies this capability to HTML, fields and groupBox, without replacing
their contents. The small chevron inherits the label's size and theme color.

`borderContainer` arranges content panes in unique top, bottom, left, right and
center regions. `framePane` adds convenient region builders (`frame.top`,
`frame.center`, etc.) and is the frame used for command recipients. Put `region`
and the relevant width/height on its children. Splitters and drawers belong to
this shared layout, preserving child Source and bindings during resizing or
opening. `design="headline"` and `design="sidebar"` select region precedence;
`persist` concerns layout state, not the application document. See
[border layout](105-components.md#gc-105-100) and
[frames](350-menus-toolbars-and-windows.md#gc-350-035).

Choose `stackContainer` to show one panel without a tab strip, or `tabContainer`
to expose the selection as tabs. Bind `selectedPage` to a child's unique
`pageName`, or `selected` to its index. Normal selection preserves Source, editor
instances and Data. Tabs add titles, `tabPosition`, `tabAlign` and `tabMode`.
Selection publications use the same contract for clicks, keyboard and Data-driven
changes. A closable direct panel may provide synchronous Boolean `onClose`:
false vetoes the close. An accepted close removes the panel Source, keeps its
application Data and emits `closing`/`closed`; ordinary switching does not remove
it. An asynchronous close guard is not provided. See
[panel lifecycle](105-components.md#gc-105-110).

Use `dialog` for a modal window and `floatingPane` for a nonmodal window; each
contains a `framePane`. Bind `open`, `collapsed`, `maximized` and geometry when
application state must reflect those operations. A dialog remains modal when
collapsed or maximized. Floating panes default to movable/resizable/collapsible;
dialogs do not. Set `floatingPane.docked` to present its existing contents inline; set it to false to restore its floating geometry. `closable`, `maximizable`, minimum dimensions and `beforeClose`
express the window contract; closing a window is not a record save. See
[windows](350-menus-toolbars-and-windows.md) and the shared window parameters below.

`trayPane` is a workspace for labelled direct children with stable `node_label`
keys. Its `storepath` points to a layout Bag containing position, dimensions,
layer, selection, rotation and scale. The tray owns move/resize; do not add a
second movable/resizable system to the cards. Pointer operations retain content
and editor bindings. Same-layer transformed rectangles stop at contact; separate
layers may overlap. Shift enables `gridStep` and `rotationStep` snapping;
`gridVisible` only changes presentation. `locked` disables layout editing while
keeping card contents usable. Closing a closable card removes its Source and its
layout row. Saving/restoring the layout is an explicit application Data operation.
See [tray workspaces](105-components.md#gc-105-970).

`transformPane` tracks `x`, `y`, `rotate` and `zoom` gestures; child Source bindings apply the visual transform to retained content. Their
metadata declares read bindings, but gestures also write changes through simple
reactive `^` pointers as they happen. `onEnd` receives `{x, y, rotate, zoom}` after
a changed gesture completes; it is not required for those Data updates. `min`,
`max` and `step` configure zoom. Use the component for transformed content and the
tray for multi-card arrangement; neither implies automatic durable persistence.
""",
    "tree": """
## Present a Bag and keep identity in its paths

`tree(storepath=...)` reads a Data Bag; `selectedPath` is a two-way path relative
to that store. Rendering reads already loaded values. Explicit expansion evaluates
branch resolvers; external selection can load missing ancestors. `autoCollapse`
closes sibling branches on opening. `hideValues=False` also displays scalar values
as visual children, including zero, false and null; selecting such a row reports
the owning BagNode path, without inserting another Bag node. Use `hideValues=True`
for a navigation-only view. See [tree contracts](105-components.md#gc-105-120).

Captions resolve through `getLabel`, `labelAttribute`, `labelCb`, then the node
label. Callback names refer to synchronous browser Logic, receiving the real
BagNode with path/opened/selected context. A label callback returns exactly
`{text: ...}` or `{html: ...}`; HTML is sanitized and cannot supply form controls
or executable behavior. `getLabelClass`, `getIconClass` and `selectedLabelClass`
control appearance without changing store identity. Callbacks are not asynchronous
caption providers. Bag attributes can supply badges and checked state.

Bind `searchText` to an input for case-insensitive literal caption search. After
a short debounce it may load unresolved branches, retaining matches and ancestors;
large remote trees can therefore issue many branch reads. Search is not server-side
pagination. Clearing it restores the previous expansion set and does not change
selection or replace the Bag. Nodes marked `loop=True` stop recursive search.
See [search lifetime](105-components.md#gc-105-965).

`checkedPaths` binds serialized checked paths; `checkedPaths_joiner` chooses the
separator. The actual state is each node's `checked` attribute, including mixed
and disabled states. `checkChildren=True` propagates through loaded descendants
and is inherited as unresolved descendants load. A synchronous `onChecked`
callback can veto a click by returning false; `onChecked=True` enables ordinary
checks without that callback. Selection and checked paths are separate state.
`favorites` is a Bag of references retaining `originalPath`, not copied tree data.

The experimental `rowActions` child supplies one shared contextual action bar,
containing `button`/`dropDownButton`. Commands receive `{item, path, event}` for
the hovered or focused row. `position` chooses the bar edge; a named synchronous
`actionState` callback derives `{hidden, icon, title}` per identified `rowAction`
from row context and reactive `state`. It is not another store. `draggable` enables
the tree's declared drag behavior; application mutations and authorization still
belong to their owners. Resolver endpoints must authorize client-supplied paths
and attributes. The current store/row-action increment does not claim full legacy
parity or complete visual acceptance.
""",
    "editors": """
## Keep the document in Data and the editing engine retained

`codeMirror` edits source text, `htmlEditor` edits rich HTML and `markdownEditor`
edits Markdown. All store a string with a two-way `value` binding. `htmlPreview`
and `markdownPreview` read that value without editing it. Connect editor and
preview to the same Data path rather than copying content between engine instances.
Engines/resources are bundled in the optional editors collection and load when
needed. Include that graph in a serverless export; no CDN or Python endpoint is
implied. See [editor composition](105-components.md#gc-105-125).

Editors write live by default; `live=False` commits on blur. `readonly` retains
reading/selection while preventing edits, and `disabled` also prevents focus.
Incoming Data still updates the existing engine through supported transactions or
setters, preserving its configuration/history instead of rebuilding the widget.
`undo()`, `redo()` and `historyChanged` expose editor history; Ctrl/Cmd+S publishes
local `save` with the current value. The application owns persistence, permissions,
server errors and a saved/dirty record baseline.

Choose `codeMirror` when exact code/text editing is needed. `language` selects a
supported language, while line numbers, wrapping, folding, indentation, completion
and font settings affect editing/presentation without reformatting the document.
Completion uses local language support rather than an LSP. Ctrl/Cmd+F opens
search/replace; readonly disables replacement. Tab indents, Shift+Tab outdents,
and Escape then Tab leaves the editor. After `ready`, diagnostics and position
revelation use the documented engine API. Unknown language names fail explicitly.

`htmlEditor` uses the supported Jodit engine and protects active/embedded document
content outside the editable DOM. It edits the body while retaining head, doctype
and document attributes. Removing or duplicating protected placeholders rejects
the edit: use Code for those changes. Rich serialization can normalize markup;
undo to the initial snapshot restores the original source. `htmlPreview` uses an
empty-sandbox iframe where scripts do not run. The editor's document guard,
sanitization and content policy are essential; these components are HTML views,
not execution previews for Python applications. See
[HTML behavior](105-components.md#gc-105-135).

`markdownEditor` uses ProseMirror for the supported rich schema: paragraphs,
headings, lists, quotes, fenced code, links/images and basic emphasis. Tables,
embedded HTML, strikethrough and task lists remain preserved source blocks whose
internals are edited in Code. Frontmatter/reference definitions preserve the
whole document as a source block. This is not full GitHub-flavored Markdown visual
editing, and rich edits may normalize supported syntax. `markdownPreview` renders
Markdown in a sandboxed iframe. `allowHtml=False` shows embedded HTML as text;
True sanitizes rendered HTML before insertion, without rewriting original Markdown.
External image requests remain blocked by preview policy. See
[Markdown behavior](105-components.md#gc-105-140).
""",
    "typst": """
## Choosing and using the preview

`typstPreview` is a document reader/compiler surface, rather than a text editor. Use it when a Data string already contains Typst source and the user needs to inspect the document or download its PDF. To edit that string, place `codeMirror` from the separate `editors` collection beside the preview and bind both to the same Data path. The editor writes the draft; `typstPreview.value` reads it. `filename` controls the download name and can also read a binding; downloading does not save the source document.

```python
pane.codeMirror(value="^.content", language="typst", height="360px")
pane.typstPreview(value="^.content", filename="report.pdf", height="480px")
```

Initialize `.content` as text. Include both collections in the environment Page when using this pair; importing a collection descriptor alone does not activate it. See [collection setup](340-components-and-collections-guide.md#gc-340-050) and [the Typst contract](105-components.md#gc-105-145).

### Updates, diagnostics and resource limits

Changes to the Typst text schedule browser compilation after a short pause. The current Worker compiles both SVG and PDF for every successful revision; downloading retrieves that PDF rather than starting a separate compilation. The widget immediately hides the previous SVG and disables the previous PDF link, so a user cannot download an apparently current document while a newer draft is compiling. Diagnostics appear in the widget. Late compilation results cannot replace a newer revision. There is no declared completion callback or Data writeback parameter: use the bound source as application state, rather than treating the downloaded PDF as a saved Data value.

The collection bundles its compiler, renderer and five fonts, and shares a browser Worker between previews. Self-contained documents can compile offline; the initial component does not supply includes, custom assets or external packages. Missing resources produce diagnostics. Removing the last preview releases the Worker. The module is large, so select this optional collection only where needed. A browser preview declaration does not create a server compilation endpoint or execute Python recipes. Compiler-version differences and export restrictions are documented in [compiler and resource ownership](105-components.md#gc-105-145).
""",
    "uploads": """
## Choose the control by the stored result

Use `uploader` for a file queue whose progress and per-file metadata matter; use `imageUploader` for one editable image value; use `attachmentManager` for queued uploads combined with an existing attachment list, preview and removal. All three read `disabled`. Initialize each `storepath` as a Data Bag before rendering. A queue contains serializable metadata and progress, not browser File objects or upload authorization. Storage destinations, access checks and cleanup belong to the application's upload operation, not to a browser-selected path. See [upload operations and metadata](105-components.md#gc-105-uploader).

### `uploader`: prepare metadata before starting

`operation` names the application's upload operation and `storepath` identifies the queue. `accept` guides file selection, while `multiple` enables several files; server validation remains necessary. Selection and drop start uploads when `autoUpload=True`. With `autoUpload=False`, `manualUpload=True` leaves an Upload action for the user. Setting `manualUpload=False` hides and disables that action; a later transition of `autoUpload` to true starts queued files too.

`selectedPath` is a two-way binding to a row label relative to `storepath`, not an absolute filesystem path. Removing that selected row clears the selection. Each row's `metadata` Bag can back ordinary bound controls. Give an unselected metadata editor its own empty Data scope, so it does not create accidental queue rows. Edit metadata while a row is queued: automatic upload takes its snapshot immediately.

```python
pane.uploader(operation="receive", storepath=".queue",
              selectedPath="^.selected", multiple=True,
              autoUpload=False, onComplete="fileReceived")
```

Here `.queue` must already be a Bag and `receive` must be implemented by the application. `onComplete` names a Page Logic method receiving `item` and `result`; it is not Python source embedded in the attribute. Optional `contextPath` resolves to another Data Bag whose current contents are sent as `metadata["context"]` during preparation, separately from the row's `metadata["fields"]`. Set record context before enabling deferred uploads. Context is client input, not proof of identity.

The queue supports removal, progress and safe local text/raster previews. A connection failure with an uncertain outcome requires status reconciliation before retry; Check status exposes that step. Host recovery capabilities vary. In particular, file-origin WebKit Workers have a documented File-reading limitation; browser automation does not establish universal native chooser support. See [host and browser limitations](105-components.md#gc-105-uploader).

### `imageUploader`: confirm one cropped PNG

Bind `value` two ways to the displayed image. Without `operation`, confirmation writes a browser data URL. With an operation, the application stores the PNG and returns the displayable URL written to `value`. The required queue Bag still tracks transfer state; `contextPath` and `onComplete` serve the same upload-context/completion roles described above.

PNG, JPEG and WebP input can be selected or dropped, but confirmed output is PNG. Set positive integer `cropWidth`, `cropHeight`, `outputWidth` and `outputHeight` with matching aspect ratios. The crop editor supports moving, zooming and rotating, with keyboard and touch alternatives described in [editable images](105-components.md#gc-105-uploader). Original image/framing are retained while mounted. Editing an existing remote image requires canvas-compatible URL access, including CORS where applicable. Clearing `value` does not delete the application's stored image.

Camera capture appears only with an attached device provider supporting `camera`; browser capture requires an explicitly attached browser provider, a secure context and permission. Screen capture depends on browser support and permission. Both feed the same crop/confirmation path; cancellation preserves the current image. These are capabilities to configure, not guarantees created by an `imageUploader` declaration.

### `attachmentManager`: gate transfer on saved context

Supply `operation`, queue `storepath`, context Bag `contextPath`, and the three application endpoint names `listMethod`, `readMethod`, `removeMethod`. Bind `ready` to whether the record is ready for attachment operations. While false, selected files stay queued; update the context Bag before setting it true. The manager internally uses multiple-file automatic upload gated by `ready`, and refreshes the attachment list after completion. It has no public `onComplete` parameter. Its `selectedPath` concerns the upload queue's metadata editor, not an arbitrary persisted attachment identifier.

The list endpoint receives `context` and returns a Bag: node labels are opaque attachment IDs and `caption` attributes provide display text. Read and remove receive `context` and `selected`. Read returns a Bag with `kind` equal to `text`, `image` or `message`, plus the appropriate `text` or `src`; remove returns true after deletion. A false remove result retains selection and reports an error. Context changes clear the previous displayed selection and invalidate late results. Application endpoints own authorization, transactions and durable storage. See [the complete attachment endpoint contract](105-components.md#gc-105-uploader).
""",
    "grid": """
## Separate rows, columns and the data provider

`grid` renders a Bag through a virtualized viewport. Choose it for tabular rows requiring declarative columns, ordering, filtering or local cell editing. It does not load database records by itself. Initialize `storepath` with the appropriate Bag and explicitly select `rowMode="values"` for nested row Bags or `rowMode="attributes"` for fields stored on row-node attributes. The representation is required and is not inferred.

Columns come from one inline `struct` or a structure Bag addressed by `structpath`; do not declare both. `struct`, `column` and `colgroup` are Source declarations, not additional browser widgets. A `column` requires its `field`; `name` is its caption and `dtype` describes field type. Widths, alignment and formatting configure presentation. A `colgroup` groups columns beneath a named header and may set group colors. The [structure reference](445-grid.md#gc-445-390) lists the exact permitted names and value formats.

```python
grid = pane.grid(storepath=".customers", rowMode="values", height="280px")
struct = grid.struct()
struct.column("name", name="Customer")
struct.column("seats", name="Seats", dtype="L", edit=True)
```

### External checkbox sets

A column can project an external Data string instead of editing a record:

```python
struct.column("john", name="John", check="multiple",
              checked="^assignments.john", checkedField="id")
```

Initialize `assignments.john` to `""`. `checked` is a required reactive Data path, resolved relative to the grid Source; `checkedField` is the row identity field. IDs are nonempty strings without commas. Each click adds or removes the ID in comma-separated text using literal wrapped `includes` membership; ordinary Data writes refresh all views. There is no regex or parallel Set cache. Customer records and their editing history are unchanged. A checked column cannot also declare an editor.

Add columns at runtime by inserting ordinary cell nodes with these attributes into the structure Bag. Removing a column retains its set. Offscreen and unloaded IDs remain in the string; individual-row toggles do not require a complete store. Ordinary search and field sorting exclude these external columns. Radio selection and bulk actions are not part of this increment. Set column `title` to the full name when `name` uses a compact caption such as J.

### Filter by external sets

Bind `setFilter` to a text value: `john` selects members of that checkbox column, `john,fred` intersects both sets, and an empty string removes only the set contribution. Names refer to external check column fields already declared in the structure. The view applies base `filter` AND the current search AND every selected set. Clearing search keeps the base and set criteria; clearing `setFilter` keeps base and search. Changes to a bound set immediately recompute the view without modifying records or memberships.

Set filtering requires a complete resident store: a grid with `windowInfo` rejects nonempty `setFilter`. There is no implicit fetch-all or filtering of only a loaded window. Unknown check columns are configuration errors. Unions, differences and remote set predicates remain outside this increment.

### Column value filters

Date columns additionally provide From/To using the shared date editor. Both bounds are inclusive, open ends are allowed, and From accepts periods through `period_to`. Changing the range selects all dates inside it; checkboxes refine that range. Clearing From clears To and preserves checked dates as explicit values. Reset removes both range and values. Invalid drafts and reversed bounds retain the accepted criterion. Datetime days follow the display convention (D/DH civil, DHZ page timezone).

Set `columnFilters=True` to add a compact filter button to ordinary column headers. The compact popup composes a shared grid (checkbox, value, row count), a search field and a shared menu toolbar. Search values filters only the inner grid using literal case-insensitive text; it never changes hidden selections or the main grid search. Click Value or Rows to sort the choices. Multiple values in one column combine with OR; columns combine with AND, together with the base filter, search and external set criteria.

Counts apply all criteria except the popup column's own selection. Selected values remain available even at zero rows. Null and empty text share the Empty choice. None accepts an empty selection (zero rows); Reset removes only that column's restriction. All explicitly selects all column values, including those hidden by the popup search. Row edits and set changes update counts without editing source records or rebuilding the grid.

Selections live in the Source-owned collection view: `columnFilter(field)` reads them, `applyColumnFilter(field, values)` accepts an array or null to remove the criterion, and `columnFacets(field)` returns `{key, value, count, selected}` entries. Numeric and text identities remain distinct. Only loaded scalar fields in complete resident stores are supported; windowed grids are rejected. Date periods, aggregate-cell membership and remote facets remain separate work.

### Row formulas and footer totals

This is an intermediate implementation. The final placement of row formulas and totals, at the data level or in the grid, is under review; the attributes below may move.

A data formula computes its field for every resident row and writes the result into the row Bag, so every grid and form on the same Bag sees it. Formula identifiers resolve to row fields and to `formula_<name>` parameters. A parameter written `^path` recalculates the formula when that Data changes; `=path` reads the current value without triggering; any other value is a literal. Paths resolve relative to the grid Source.

```python
struct.column("quantity", dtype="L", edit=True)
struct.column("price", dtype="N")
struct.column("total", dtype="N", formula="quantity * price * (1 + vat / 100)",
              formula_vat="^.vat", calculated=True, totalize=True)
struct.column("position", formula="#")
struct.column("running", dtype="N", formula="+=total")
struct.column("share", dtype="N", formula="%=total", footer_format="0.00")
```

- `calculated=True` computes a data formula when the grid configures; otherwise it first runs when a dependency changes.
- Formulas run in dependency order; a dependency cycle rejects the structure.
- A formula recalculates when a committed value reaches the row Bag. Editing drafts do not trigger it.
- `hidden=True` hides a column; its formula still calculates.
- `#` (row number, from 1) and `+=field` (running sum) are view values: each grid computes them on the visible rows of its own view, in view order, and never writes them into the row Bag. A formula depending on a `#` or `+=` column is a view value too. While a filter, column filter or search is active, these cells and the `rowHeaders` numbers get the `filtered-numbering` class, with the `--gramlot-grid-filtered-numbering-background` theme color, because the numbering covers only the visible rows.
- Sorting, column-filtering or searching by a view value is an error: it derives from the order and has no stored field. View columns get no column filter button and are not offered by search. Totals of a view column sum its visible values.
- `%=field` (percentage of the column total over every resident row) is a data value written into the row Bag.
- An arithmetic formula (fields, numeric literals, `+ - * / % **` and parentheses) is evaluated without compiling code: with JavaScript number semantics on plain numbers, exactly when a referenced value is a Decimal. It works from an inline `struct` and from a `structpath` Bag.
- Any other formula is a JavaScript expression compiled as inline code: it runs only when declared in an inline `struct` received with the Source, and a page CSP without `'unsafe-eval'` blocks it. Over Decimal values only arithmetic formulas are supported.
- A null referenced value gives null. A failing formula writes null and keeps its error per field (`formulaErrors` of the grid element). An unchanged result is not written.
- A column accepts its declared attributes and `formula_<name>` keywords only; any other keyword is rejected while authoring.

Set grid `footer=True`, or a caption text, to display a footer row. A column `totalize=True` sums its field over every resident row, not only the displayed ones, and publishes the total to `.totalize.<field>` relative to the grid Source; a text value is the Data path to use. Booleans count as 0/1. Totals are published also without the footer row. `footer_value` is a fixed footer text, `footer_format` the footer number format. A total that cannot be computed is published as null, shows `—` with the error as tooltip and is kept in `totalErrors` of the grid element. Filtered totals are not published.

### Viewport outputs and editing events

`rowHeaders`, `rowResize` and `selfDragRows` enable their respective row affordances. `sortedBy` and `filter` are read inputs. For a windowed store, `windowInfo` and `loading` describe provider state, while bound `viewport` writes requested `{start, count}` and `sortRequest` writes an ordering request. Wire these outputs to the intended store/provider rather than loading every record in response to scrolling. A resident Bag, a cached remote selection and an authorized database query have different capabilities. Neither the grid nor an ordinary endpoint implies SQL or Asqueel access.

Enable local editing with `column(..., edit=True)` or an editor-options dictionary. Cells use ordinary Source controls and share the enclosing form session; a standalone editable grid owns its session. Double-click or Enter/F2 opens a cell; Enter confirms, Tab/Shift+Tab moves and Escape discards unfinished text. Scrolling can release editor DOM while preserving drafts, validation errors and pending checks in the session. Local `load`, `accept` and `restore` do not save database records. This remains a development-preview contract: remote-window editing, autosave, undo/redo and DB writes are not supplied by this local editing slice. See [forms and grids editing](340-components-and-collections-guide.md#gc-340-110).

### `searchBox` and `frameGrid`

Use `searchBox` for the grid's filtering UI. It requires a FrameGrid target resolved through Source context; it is not a free-standing text field with a `value` binding. The Python `frameGrid(...)` composition exposes `.grid`, `.top`, `.bottom`, `.left` and `.right`; put the search control in its toolbar. `frameGrid` is a helper, not another widget tag.

`frameGrid(...)` routes its keywords by list. An unprefixed keyword that the grid declares as a parameter (`footer`, `rowHeaders`, `rowResize`, `selfDragRows`, `sortedBy`, `filter`, `columnFilters`, …) goes to the grid; `storepath`, `rowMode` and `structpath` also go to the grid. Every other keyword (`datapath`, `node_label`, `id`, `height`, style attributes, …) goes to the frame, as does a name that the frame also accepts. `grid_<name>` forces any attribute onto the grid (for example `grid_datapath`, `grid_height`, `grid_class` or a style attribute) and `frame_<name>` onto the frame; the prefix is removed. Giving the same name twice (`footer` and `grid_footer`, `storepath` and `grid_storepath`) is an error. `grid_node_label`, `grid_frameTarget` and `grid_nodeId` are errors because frameGrid composes those grid attributes. The list follows the grid's declared parameters, so a new grid parameter is routed without changing `frameGrid`.

```python
frame = pane.frameGrid(storepath=".rows", rowMode="values", datapath="orders",
                       footer=True, rowHeaders=True, grid_class="compact", frame_height="300px")
```

`searchLiteral=True` treats text punctuation literally instead of as a regular expression; accepted queries keep their original text. The column-filter popup uses this same searchBox and its shared theme CSS inside a frameGrid, without a separate input or search handler.

The column caption is an external Labelbox menu, not part of the input capsule. It uses the shared `lbl_value`/`lbl_values` mechanism.

`searchOn=True` exposes the available columns. An explicit column list can restrict choices; unknown fields are rejected. Typing applies filtering after a short pause and Enter applies immediately. Escape or the clear button clears it, and changing column clears the query. Invalid/incomplete expressions report an error and preserve the last accepted filter. Bind `searchTime` if the application wants the measured filter duration; this is an output, not the search text. The active view owns filtering and supplies the rows, so this control does not independently issue application database requests. Start with [grid composition and store responsibilities](445-grid.md#gc-445-start).
""",
    "chat": """
## A live Source viewport and a conversation composition

`chatMessages` is the collection's browser widget: a scrolling container for live Source message children. It allows ordinary Source content and declares no component-specific value, provider or send parameters. Its log role and polite live announcement support conversation reading. Choose it alone when the surrounding application already owns the composition; choose the Python `ChatPane` helper when you need the provided message area, composer, status and toolbar.

```python
from gramlot import ChatPane

chat = ChatPane(root, datapath="assistant", chat_id="main", height="480px")
chat.frame.top.strong("Assistant")
```

`ChatPane` requires `datapath`. It builds real Source controls and initializes conversation, draft, pending/error and attachment state in that Data scope. `.frame`, `.composer`, `.messages` and `.toolbar` expose those existing containers for composition. `chat_id` is a literal identifier starting with a letter and continuing with letters, digits or underscores. Separate panes need separate datapaths and IDs; the companion `ChatPageStore.chat_ids` must allow those IDs. The default allowed conversation is `main`.

### Sending requires Logic delegates, a PageStore and WebSocket

The Page Logic module delegates `chatRender`, `chatSend`, `chatCompleted`, `chatReset`, `chatResize`, `chatPickAttachments`, `chatRenderAttachments` and `chatRemoveAttachment` to the exported core functions. Controllers react to conversation changes, render Source children and update status; conversation state stays in Data/Source. This delegation is required wiring, not a second message store. The composer writes its draft through ordinary bindings and disables sending while pending, while picking attachments, before the conversation is ready, or when neither text nor attachments are available.

ChatPane uses `dataBinder`, which requires a PageStore WebSocket. Enable the host capability explicitly: for example, Uvicorn `create_application(pages, websocket=True)`. The default HTTP-only application cannot run this composition.

A Python PageStore subclassing `ChatPageStore` supplies processing. Its default `process_message(self, text)` echoes text; override it for application behavior. Return a string or Gramlot SourceBag, not HTML or a plain Data Bag. During processing, `request_attachments` exposes the active request's attachments and `feedback(text)` updates transient status. Applications own provider integration, credentials, authorization and persistence. There are no model, provider or temperature widget parameters, and selecting the collection does not supply an AI service.

Use the complete [ChatPane, Logic and PageStore example](465-widget-examples.md#gc-465-setup-chat) when assembling the page. It needs the chat and layout collections and the normal supporting controls. A file-only export cannot execute this Python PageStore; a viewport appearing successfully does not establish that sending has a working backend.
""",
    "grouplets": """
## Choose a plain fragment host or a card

`grouplet` hosts reusable Source content through the existing remote binding. Use it when the parent layout supplies all visual framing. `groupletCard` adds a title, optional folding, a checkbox, actions and an in-card Markdown guide. Both accept ordinary Source children and a read-bound `remote` endpoint name. A relative `datapath` lets the same Source-building method bind different records without duplicating its implementation.

```python
root.groupletCard(title="Billing", remote="address", datapath="billing",
                  collapsible=True, collapsed="^.folded")
```

Implement `address` as a Page method decorated with `@source`; inside it, controls such as `pane.textbox(value="^.city")` resolve against that instance's Data scope. Include the collections used by those controls. The existing [remote Source mechanism](099-remote-content.md) owns requests, replacing children and cleanup. Do not add parallel requests in DOM lifecycle hooks. Neither fragment host establishes database loading or a save operation.

### Card state and user actions

`title` and `checkboxLabel` are read-bound internationalizable text. `chromeSide` accepts only `top`, `left` or `right`. `collapsible` enables folding; `collapsed` reads and writes the folded state, so bind it when the application needs that state in Data. `checkbox=None` hides the checkbox, whereas `checkbox=False` displays an unchecked control. Its two-way binding writes user changes. These states do not themselves define record acceptance or persistence.

`delitem=None` hides Clear, `False` shows it disabled and `True` enables it. Clear asks for confirmation and works through Source/Data bindings. It clears direct, untransformed reactive `value` pointers within the card's Data scope, preserving bound card checkbox/collapse state; it does not scrape DOM fields, remove the remote fragment or delete an application record. Do not rely on it as a general reset of unrelated Data or an undoable form operation.

`doc` reads Markdown for the card's information popup; empty text hides the information button. User changes to folding and checkbox state use their declared writeback, while `remote`, `title`, `chromeSide`, `collapsible`, `delitem` and `doc` remain read inputs. There is no additional public completion or save callback declared for these widgets. Use ordinary Source controllers for application behavior that follows bound Data changes. The [card guide](455-grouplets.md#gc-455-start) describes these controls; full form/save lifecycles and legacy GroupletForm APIs are separate responsibilities and must not be inferred from a card.
""",
}


COLLECTION_EXPLANATIONS.update({
    'charts': """### Data and configuration

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
""",
    'vizabi': """### Specialized host integration

The host provides the compatible library at libraryUrl and the configuration Bag. A session observes
rows and writes supported configuration changes into Data. It releases subscriptions and the external
view on removal. Do not treat this as an additional chartPane engine or infer database access.
""",
})

COLLECTION_EXPLANATIONS.update({
    'audio': """### Sample values and lifecycle

waveform contains fftSize numeric samples; spectrum contains fftSize / 2 decibel values,
clamped to minimumDb. Each output is one array value in Data. sampleRate is measured in Hz.
fftSize must be a power of two from 256 to 8192; frameRate must be between 1 and 30. minimumDb must be finite,
at least -160 and strictly below 0.
The analyser is invisible; compose controls and charts around its bindings. Starting requests
microphone permission. Stopping releases browser resources; errors clear running and write error.
This is not an audio recorder, and no persistence is implied.
""",
    'drawing': """### Original annotation Bag

annotations must resolve to a Bag. The component subscribes to that original Bag and writes
shape records there. image changes the background without replacing the annotation store.
Without an image, coordinates use a 1000 by 1000 surface; an image uses its natural dimensions.
The toolbar is a shared menu, with tool state under _gramlot.drawing. Removing the component
releases event handlers and Bag subscriptions. Save annotations through the application's own
persistence contract; the drawing component does not perform a server save.
""",
})
