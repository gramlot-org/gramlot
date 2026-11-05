"""Source and test coverage for command, layout and tree widgets."""

_JS = 'js/src/components/'
_TEST = 'js/tests/'
_LESSON = 'src/gramlot_examples/pages/'
_BUTTONS = '01-inputs/08-buttons/'
_CONTAINERS = '05-containers/'
_MENUS = '05-menus/'
_TREES = '01-inputs/09-tree/'


def _record(data, events, children, limits, sources, tests, examples, example_note):
    return dict(
        data=data, events=events, children=children, limits=limits,
        sources=list(sources),
        tests=[f'{_TEST}{name}.test.js' for name in tests],
        examples=[f'{_LESSON}{name}.md' for name in examples],
        example_note=example_note,
    )


_COMMAND = (_JS + 'buttons.js', 'js/src/view/button.js')
_MENU = (*_COMMAND, _JS + 'menus.js')
_BORDER = (_JS + 'border-container.js',)
_SELECTION = (_JS + 'selected-container.js',)
_WINDOW = (_JS + 'windows.js', _JS + 'window-surface.js')
_WINDOW_DATA = (
    'Bind open, collapsed and maximized to retain window state in Data. Width, height, left and top '
    'accept CSS lengths and support writeback for user geometry changes. The expanded geometry is '
    'retained across collapse and maximize.'
)
_WINDOW_CHILDREN = 'Provide exactly one framePane child. Closing and reopening preserves the mounted frame, its controls and bindings.'
_WINDOW_EVENTS = (
    'The window publishes opened and closed. A close request calls the optional beforeClose Logic '
    'with reason and waits for its boolean decision. A pending decision deduplicates close requests, '
    'and an obsolete decision cannot close a later window session.'
)
_SELECTION_DATA = (
    'selectedPage identifies a panel by its Source pageName. selected is its zero-based position among '
    'direct panels. Both support two-way binding, and a valid named selection takes precedence when '
    'both values change together.'
)
_SELECTION_EVENTS = (
    'On a selection change, hiding and showing announce the outgoing and incoming panels before '
    'selected reports their resulting active states. A close uses the child onClose guard and '
    'publishes closing and closed when accepted.'
)

COVERAGE = {
    'button': _record(
        'A button has no editable value. Disabled state and icon presentation can read Data. '
        'A fire action pulses a Data path with the modifier string or true, attaches modifier and '
        '_counter metadata, and returns the value to null.',
        'Click or keyboard activation runs one command mechanism. Inline action receives _evt, '
        '_counter and modifier flags. A nested dataController receives _evt, button_counter and '
        'the modifier flags. A confirmation can gate execution, and _delay groups a burst from its last click.',
        'Use caption content and optionally one direct dataController as the click mechanism. '
        'The controller keeps its own reactive Data inputs and initialization behavior.',
        'Competing mechanisms or multiple direct dataControllers raise an error. Disabled or removed '
        'buttons drop pending clicks. A Gramlot button never implicitly submits its containing form.',
        _COMMAND, ('button-controller', 'button-components'),
        (_BUTTONS + '01-button', '03-controllers/02-actions/03-plain_and_delayed_buttons'),
        'Covers commands and the difference between native form submission and delayed Gramlot activation.',
    ),
    'toggleButton': _record(
        'Bind the boolean value two ways. Data updates the LED and pressed state. Activation commits '
        'the new boolean before invoking the command.',
        'Activation flips the boolean and dispatches the change used for binding, then runs the shared '
        'button command. Disabled and readonly prevent the flip and command.',
        'Uses the same caption and direct controller composition as button. The LED is provided by the component.',
        'The value represents two states. Removing the Source releases the button command binding.',
        _COMMAND, ('button-components',), (_BUTTONS + '02-toggle_button',),
        'Demonstrates the boolean binding and LED.',
    ),
    'dropDownButton': _record(
        'The default command occurrence is local to the button. With persist enabled, local storage '
        'saves the occurrence code for the page URL and explicit button id. It does not store command text or a Data value.',
        'The main segment runs the default command. The arrow opens the menu. Ordinary item activation '
        'runs that item. Shift activation also makes it the main command and updates its caption and icon.',
        'Author the main caption and command on the button and place the alternatives in its child menu.',
        'Persistent buttons require an explicit id and menu occurrence codes must be unique. A missing '
        'saved code falls back to the authored default. Storage failure leaves in-memory selection usable.',
        _COMMAND, ('button-components',), (_BUTTONS + '03-dropdown_button',),
        'Demonstrates main versus menu activation, Shift selection and persistence.',
    ),
    'menu': _record(
        'Menu presentation and resolver inputs can reflect Data. A resolver supplies entries through '
        'its named Logic method, with caching governed by cacheTime. The menu has no selected value of its own.',
        'A popup can open from its attached owner or a submenu trigger. Keyboard movement skips '
        'unavailable entries and separators. A bar distributes eligible units into overflow and returns '
        'them as space becomes available.',
        'Use menuline for commands or submenus, spacer for spacing and contentPane for grouped or '
        'embedded content. A bar can be horizontal or vertical.',
        'Opening modifiers match exactly. Popup resolver work can wait for the first opening. Invalid '
        'results preserve existing entries and superseded replies cannot replace newer results.',
        _MENU, ('menu-system', 'button-components'),
        (_MENUS + '02_toolbar', _MENUS + '04_menu_bar', _MENUS + '07_resolver'),
        'Shows bar and popup composition, then resolver-owned entries and their refresh behavior.',
    ),
    'menuline': _record(
        'A menu occurrence can read disabled, hidden and checked presentation from Data. Checked is '
        'a display binding. Application Logic changes its underlying state.',
        'A line dispatches its command or opens its submenu. Command occurrences can carry distinct '
        'parameters. Delayed delivery captures the parameters at activation and is cancelled if the occurrence becomes unavailable.',
        'Use a caption and optional icon, or give the line a child menu for a submenu. A separator '
        'or grouped presentation does not dispatch a command from its padding.',
        'A command and submenu on the same occurrence are mutually exclusive. An unknown command does '
        'not dispatch, and nested frames keep their own command recipients.',
        _MENU, ('menu-system', 'button-components'),
        (_MENUS + '04_menu_bar', _MENUS + '05_live_states'),
        'Shows submenu composition and live command state. Resolver and overflow cases are covered in the menu lessons.',
    ),
    'spacer': _record(
        'size specifies fixed space in pixels. flex assigns a positive share of remaining layout space. '
        'Neither parameter represents application Data.',
        'The spacer is decorative and has no activation. A toolbar consumes elastic space before moving '
        'trailing units to its popup.',
        'Place it between menu or toolbar items as a leaf.',
        'size and flex are mutually exclusive. A fixed size must be finite and nonnegative. A flex '
        'factor must be finite and positive.',
        (_JS + 'buttons.js', _JS + 'menus.js'), ('menu-system',),
        (_MENUS + '02_toolbar',),
        'Uses spacing in a toolbar composition.',
    ),
    'formlet': _record(
        'Fields retain their own Data bindings. Resolved lbl_* and box_* defaults are inherited by '
        'descendants from the declaring scope, and explicit child values override them.',
        'The grid and label projection update when presentation inputs change, keeping field drafts '
        'and focus with their existing controls.',
        'Place fields or nested layout children inside the formlet. columns can specify a positive '
        'integer or CSS track list. col_min_width switches to an auto-fitting grid.',
        'Invalid numeric column counts raise an error. This layout does not create an editing session. '
        'Label measurement observers are released on detach.',
        (_JS + 'layout.js', _JS + 'formlet-labels.js'), ('layout-components',),
        ('01-inputs/07-forms_and_validation/02-formlet',),
        'Shows field layout and inherited presentation defaults.',
    ),
    'groupBox': _record(
        'Descendants use the enclosing Source Data scope. Copy reads the current scoped Bag. '
        'TYTX retains types and attributes, and JSON contains values only.',
        'With copy enabled, the header action copies TYTX and the format menu offers TYTX or JSON. '
        'The header reports clipboard success or failure.',
        'Place arbitrary Source content under the labeled group. Choose bar, underline or card '
        'presentation through lbl_variant.',
        'Copy requires a usable browser clipboard. The box disables its copy actions while a copy '
        'is pending and ignores late feedback after detaching. The heading has no collapse control or state.',
        (_JS + 'layout.js',), ('layout-components',),
        (_CONTAINERS + '06-group_box',),
        'Shows labeled grouping and scoped copy.',
    ),
    'contentPane': _record(
        'The pane has no value binding. Content and its Data scope follow the Source composition. '
        'Authored flex layout is projected into the wrapper containing the slotted children.',
        'The pane scrolls its content when needed. In a frame or border container the parent owns '
        'region events and chrome.',
        'Accepts arbitrary Source children. Use it as a direct framePane region or as a standalone '
        'scrollable pane.',
        'Flex projection covers direction, wrapping, alignment and gaps. Region sizing and splitter '
        'writeback are provided by the owning container.',
        _BORDER, ('menu-system', 'border-container'),
        (_MENUS + '06_frame_pane', _CONTAINERS + '01-border/01-border'),
        'Shows panes in frame and border regions. The lessons teach the enclosing layouts.',
    ),
    'borderContainer': _record(
        'Numeric regional width or height with a writable binding receives live splitter updates. '
        'Literal, read-only, CSS string and transformed dimensions do not gain writeback. With persist '
        'enabled, sizes can be restored by stable container id.',
        'Splitters support pointer and keyboard resizing. Drawer activation can call drawer_onclick '
        'with evt and show. Region events include closable_change on the child and splitter_resize '
        'on the parent.',
        'Give each direct child a distinct top, bottom, left, right or center region. Side children '
        'can opt into splitters, drawers or detachment while retaining their Source content.',
        'Splitters are always live. Invalid or duplicate regions, inconsistent size limits and '
        'persistence without a stable id raise errors.',
        _BORDER, ('border-container',),
        (_CONTAINERS + '01-border/01-border', _CONTAINERS + '01-border/06-border_events'),
        'Shows regional layout, sizing and region notifications.',
    ),
    'framePane': _record(
        'Uses the border layout sizing and persistence contract. Frame regions keep their field bindings, '
        'and a nested frame keeps an independent command recipient boundary.',
        'Regional splitters and drawers behave as in borderContainer. Commands composed in a frame '
        'can address its own recipient.',
        'Direct children are contentPane regions. Frame helpers create or retrieve Source regions '
        'without duplicating them. Compose toolbars or working content inside those regions.',
        'There is at most one direct contentPane per region. Frame sizing and persistence follow the '
        'same validation and stable-id requirements as borderContainer.',
        _BORDER, ('menu-system', 'frame-grid'), (_MENUS + '06_frame_pane',),
        'Shows frame regions as both layout and command boundaries.',
    ),
    'stackContainer': _record(
        _SELECTION_DATA, _SELECTION_EVENTS,
        'Direct Source children are panels. Give panels stable pageName values when selecting by name. '
        'The stack has no built-in tab strip. External controls can set its selection.',
        'Duplicate non-null page names and negative or noninteger indices raise errors. An out-of-range '
        'index leaves the current available panel selected or uses the normal fallback. Inactive panels '
        'stay mounted, and closing a panel removes its Source while retaining application Data.',
        _SELECTION, ('selected-container',), (_CONTAINERS + '03-stack',),
        'Shows selection driven outside a tab strip.',
    ),
    'tabContainer': _record(
        _SELECTION_DATA,
        _SELECTION_EVENTS + ' The tab strip adds pointer and keyboard selection. An eligible detachable '
        'tab can open in a floating window and reattach when that window closes.',
        'Author a titled direct Source child for each tab. Child metadata can supply a name, icon, '
        'badge, closability and detachment. Inactive panel controls remain mounted.',
        'Hidden, disabled and detached panels are skipped for strip selection. onClose must return '
        'a synchronous boolean. Detaching moves the slot presentation while preserving the controls.',
        _SELECTION, ('selected-container',), (_CONTAINERS + '02-tabs',),
        'Shows tab navigation and selection. Detachment and closure are covered by the component tests.',
    ),
    'trayPane': _record(
        'storepath resolves to a Bag keyed by direct child Source labels. Each position Bag holds x, y, '
        'width, height, rotation, scale, selected and layer. Gesture changes write geometry and '
        'selection to those rows while the existing controls stay mounted.',
        'Drag, resize and rotation handles edit geometry. Shift applies configured snapping. Click '
        'and marquee gestures select blocks, and selected blocks can move together. Opt-in close '
        'removes the block Source and its geometry row.',
        'Give each direct child a Labelbox with lbl. Child options include minWidth, minHeight and '
        'closable. A tray can contain interactive fields and nested trays.',
        'Bounds and same-layer contact constrain edits. Lock hides editing chrome while external Data '
        'still projects. Cancellation restores the gesture state, and store replacement ends the old '
        'gesture without overwriting the replacement.',
        (_JS + 'tray-pane.js', _JS + 'tray-geometry.js'), ('tray-pane',),
        (_CONTAINERS + '07-tray', _CONTAINERS + '08-gallery_tray'),
        'Shows geometry Data, editable cards and a larger gallery composition.',
    ),
    'transformPane': _record(
        'x and y express translation, rotate is an angle in degrees, and zoom is a scale factor. '
        'Gestures write these values to Data through plain reactive pointers without a transform. '
        'min, max and step constrain zoom.',
        'One pointer translates. Two touches also rotate and zoom. When the last pointer is released '
        'after a changed gesture, onEnd Logic receives x, y, rotate and zoom.',
        'Place arbitrary Source content inside the gesture surface. The pane tracks gesture values. '
        'Bind the child presentation separately to apply a CSS transform from those Data values.',
        'Parameters must be finite, min and step positive, and max at least min. An external parameter '
        'change cancels the gesture. A stationary gesture or cancellation does not call onEnd.',
        (_JS + 'transform-pane.js',), ('transform-pane',), (_CONTAINERS + '09-transform_pane',),
        'The dedicated lesson shares pose Data between gestures and numeric controls, applies a separate child CSS transform, records onEnd and preserves editable content on reset.',
    ),
    'dialog': _record(
        _WINDOW_DATA, _WINDOW_EVENTS + ' Escape requests closure through the same guard.',
        _WINDOW_CHILDREN,
        'The window remains modal while collapsed or maximized. Movement, resizing, collapse and '
        'maximize are opt-in. A non-boolean guard result leaves the dialog open and reports a diagnostic.',
        _WINDOW, ('window-components',), (_CONTAINERS + '04-dialog', _MENUS + '10_dialog_editor'),
        'Shows modal composition and a dialog hosting a mounted editor.',
    ),
    'floatingPane': _record(
        _WINDOW_DATA, _WINDOW_EVENTS + ' Activating a floating window raises it above its peers.',
        _WINDOW_CHILDREN,
        'This window is nonmodal. Movement, resize and collapse default on, while maximize is opt-in. '
        'Disposal invalidates pending close decisions and releases interaction resources.',
        _WINDOW, ('window-components',), (_CONTAINERS + '05-floating', _MENUS + '14_floating_editor'),
        'Shows a floating window alongside its working page and an editor hosted inside it.',
    ),
    'tree': _record(
        'storepath selects a live Bag in Data or a Source tree through the store routing contract. '
        'Bind selectedPath two ways for selection and checkedPaths for joined checkbox paths. '
        'Selection paths are relative to the store. External selection can resolve missing ancestors.',
        'Disclosure, keyboard navigation and selection operate on visible rows. Named label and icon '
        'Logic can customize row presentation. onChecked receives item and path and can veto the '
        'change. Optional drag callbacks prepare a typed snapshot for the internal drop pipeline.',
        'The Bag supplies the hierarchy and can contain lazy resolver nodes. Source may declare one '
        'rowActions child for shared commands. A rendered scalar child selects its owning Bag node.',
        'Ordinary rendering does not evaluate unloaded resolvers. Failed branches remain retryable and '
        'stale asynchronous results cannot change later selection. Search stops at marked loops, and '
        'drag preparation is opt-in, synchronous and does not evaluate a lazy row.',
        (_JS + 'tree.js', 'js/src/tree-store.js'), ('tree-components', 'tree-store'),
        tuple(_TREES + lesson for lesson in (
            '01-basics', '02-labels_and_classes', '03-callbacks_and_icons', '04-internal_drag', '05-checkboxes',
        )),
        'Covers hierarchy, labels, callbacks, internal drag and checking. The tests also inspect resolver errors, live Source stores and favorites.',
    ),
    'rowActions': _record(
        'state is an optional read binding passed to actionState. Command context carries the focused '
        'or hovered row item and path independently of selectedPath.',
        'A child command runs in the current row context without selecting the row. actionState '
        'receives item, path, action and state and returns hidden, icon and title for each coded action.',
        'Place one shared bar inside tree, at start or end of the row. Compose button and '
        'dropDownButton children. Use rowAction to identify an action for presentation Logic.',
        'The bar hides when it has no row context. Invalid position or an incomplete actionState '
        'result raises an error. Menu commands use the same active row context as the bar.',
        (_JS + 'tree.js', 'js/src/view/button.js'), ('tree-components',), (_TREES + '06-row_actions',),
        'The dedicated lesson contrasts selected and acted-on paths, changes action presentation per row, and demonstrates both a button and a menu command.',
    ),
}
