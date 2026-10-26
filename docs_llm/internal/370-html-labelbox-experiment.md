# 370 · Unified Labelbox experiment

Document ID: **GC-370**. Experimental, 2026-10-26.
[Full document](../../docs/internal/370-html-labelbox-experiment.md).

<a id="gc-370-005"></a>
## 005 · Boundary
Owner authorized isolated codex/html-labelbox, then one renderer-owned Labelbox
for HTML and components. No adoption, release or deployment. Existing checkout and
port-8099 gallery remain untouched.

<a id="gc-370-010"></a>
## 010 · Composition
One Source node and Data Bag; renderer record.element remains the content target,
presentation is the shared outer Labelbox for layout/slots/insertion/disposal.
Components no longer build another box in shadow DOM. Labelbox mixin only connects
the shared label to shadow-control naming/activation. Native labelable HTML uses
for/id; shadow controls use aria-label. GroupBox actions attach to the shared
header; copy menu IDs are unique. Formlet aligns HTML and components alike.
Ordinary attrs style content; lbl_*/box_*/box_l_*/box_c_* style the presentation.
Resolved labels are literal text. Changes retain controls, focus, bindings and Data.
Python-first fixture: js/tests/fixtures/live/html-labelbox.py. Preview8101 uses
GRAMLOT_TEST_PYTHON and PYTHONPATH with js/scripts/verify-html-labelbox.mjs --serve.

<a id="gc-370-015"></a>
## 015 · Limits
HTML flow placement required: whole SVG is supported, SVG shapes/structural HTML
are not silently wrapped. Initially declare lbl/box_*; late wrapping of a bare
node remains unsupported to avoid disconnect/reload side effects. Outer layout
styles use box_*. Static HTML string export and integration with uncommitted
gallery/detachable work are not claimed.

<a id="gc-370-020"></a>
## 020 · Checks
Initial unified suite: 3,899 JS tests passed. Mixed native/component formlets,
group actions, parent tab/border slots, label safety, identity and disposal tested.
Chromium/WebKit: Python Source plus actual CodeMirror/ProseMirror/Jodit identity,
selection, undo/redo, bindings and cleanup. GC-070 records final refinement checks.
Evidence: /private/tmp/unified-labelbox-*.log, unified-editors-*.log.

<a id="gc-370-025"></a>
## 025 · Movement
Owner approved label-handle movement within parent, resize, optional grid,
Source/Data geometry and stacking, separately from floating detachment.
Legacy evidence: Genropy/genropy/gnrjs/gnr_d11/js/genro_widgets.js, baseHtml moveable
and labledbox.onBuilding. Dojo movement/published coordinates are not a port.
canvasPane/labelBox names and concrete geometry/grid syntax await confirmation;
no movement implementation is claimed.

Naming follow-up: owner asked whether canvas is confusing. canvasPane was
withdrawn as a proposal because it evokes HTML canvas. workspacePane is proposed
instead; awaiting owner confirmation. Constrained component child contracts
(window/frame, menu roles) still require qualification before general adoption.


<a id="gc-370-030"></a>
## 030 · TrayPane: confirmed behavior and save/restore

Owner selected trayPane; canvasPane/workspacePane are superseded proposals.
Blocks are selectable and have adjustable stacking levels. They move within the
tray, resize, rotate and zoom as DOM, preserving widgets, Source and bindings.
Zoom scales contents/controls; resize changes available layout space. Floating
attachment/detachment remains distinct.

Position, dimensions, stacking, rotation and scale must be saved/read to restore
the arrangement. Their canonical values belong to Source or bound Data; DOM
styles are projections, not the saved state. Selection likewise belongs to
Source/Data. User interactions must write through existing state mechanisms;
restoration projects those same values without new widget instances for existing
content. Existing Bag serialization is the foundation. No automatic browser
storage, remote persistence service or second state format is approved.

Still open before implementation: concrete parameter names and units, transform
origin and coordinate rules, single/multiple selection, grid behavior under
rotation/scale, and the exact save/restore API. These are unresolved design points,
not implemented capabilities. The Labelbox experiment remains independently
available; there is no TrayPane implementation yet.


<a id="gc-370-035"></a>
## 035 · Accepted block geometry

Owner confirmed the proposal with “ok”. Numeric left/top/width/height describe
the untransformed rectangle in tray-plane pixels. z_index is the stacking level,
rotation uses degrees, and scale is the zoom factor (1 = normal). All parameters
accept Data bindings; interactions write the same canonical Source/Data values
that rendering and save/restore read. Rotation and zoom pivot around the center.
Resize changes the rectangle; zoom scales its content visually.

This resolves the parameter names, units and transform origin listed as open in
§030. Selection cardinality, grid/constraint behavior under transforms and the
exact authoring/save-restore entry points remain open. Documentation only:
TrayPane is not yet implemented or verified.


<a id="gc-370-040"></a>
## 040 · Accepted multiple selection

Owner requested multiple selection and explicit highlighting, then confirmed
“ok” to the concrete interaction. Click selects one block; Shift+click toggles
membership; clicking empty tray space clears the selection. Every selected block
has a thin border in the theme accent color; background and content are unchanged.
Selection is canonical Source/Data state, not inferred back from DOM styles.

This resolves selection cardinality from §035. Multi-selection rotation/scale
semantics remain open: transform the entire arrangement around a shared center,
or transform each block independently around its own center. The single-block
center-origin contract remains unchanged. No runtime implementation is claimed.


<a id="gc-370-045"></a>
## 045 · Phase one only: unified Labelbox

Owner clarified on 2026-10-26: first deliver a working Labelbox, then movable,
then the remaining features; the overall vision is not one implementation block.
Sections 025–040 retain future design context. They do not expand this phase.

The live renderer now composes HTML and components with the same Labelbox.
Constrained parents keep their actual content identity behind the presentation:
window/frame validation, tab/border slots, menu ownership and toolbar overflow
priority. Runtime-owned menu slots survive label updates. The common grid gives
the label its intrinsic height and the content the remaining area; a labelled
frame fills its window without reconstructing the content.

Verification after these refinements: build passed; all 3,901 JavaScript tests
passed, none skipped. Chromium and WebKit passed desktop and 390px checks of the
Python Source fixture, including frame geometry. Real CodeMirror, ProseMirror
and Jodit checks passed on both browsers, preserving instance, bindings,
selection, undo and disposal. Logs: /private/tmp/labelbox-phase1-*.log and
/private/tmp/labelbox-window-browser.log. Isolated preview: http://127.0.0.1:8101/.

This phase is implemented and verified experimentally, awaiting owner trial.
The boundaries in §015 remain: no late wrapping, static-export adoption,
integration with the separate detachable increment or publication is claimed.
Movable and TrayPane are not implemented. The next implementation phase begins
only after the owner has tried this foundation; deferred transform questions
are not the next action now.


<a id="gc-370-050"></a>
## 050 · Movable card trial with a Data Bag

Owner confirms `lbl_variant="card"`, default for movable blocks, and then
`trayPane(storepath=...)` with `node_label` as the stable position-record key.
This is the second isolated phase: label dragging only. No close button, resize,
selection, stacking, rotation or zoom is implemented.

```python
tray = root.trayPane(storepath=".workspace", height="430px")
card = tray.div(node_label="customer", lbl="Customer", movable=True,
                datapath=".customer", box_width="220px")
card.textbox(value="^.name", lbl="Name", live=True)
```

`.workspace` must resolve to an existing Data Bag, as for other bagStore
components. Its `customer` value is a Bag containing numeric `left` and `top`
in tray pixels. Missing rows initialize to `{left: 0, top: 0}` in Data;
malformed existing rows are rejected. Keys are exact Source labels. Block
content datapaths and geometry storepath are independent. Coordinates are no
longer stored as Source literals: the owner's later storepath decision supersedes
that earlier proposal. Existing Bag TYTX serialization/restoration is sufficient;
no automatic disk/browser saving is added.

Only the label region starts movement. Header actions and fields retain their
normal interactions. Pointer capture covers movement outside the title; drag
writes live Data positions rounded to CSS pixels and constrained to the panel, without moving/recreating
DOM nodes. Cancellation restores the gesture's starting coordinates. Replacing
or externally changing the geometry Bag ends the active gesture and projects
the new Data. Removing a block or disconnecting the tray releases capture and
listeners; removing a block does not delete its saved position record. There is
no automatic resize when a panel becomes smaller: authored block dimensions
must fit, and bounds are applied during dragging. Card header colors can use
--gramlot-card-header-background/color; box_* and lbl_* customization still apply.

The preview at http://127.0.0.1:8101/ starts with two cards. Drag either title,
edit a field, change Customer left/top, or restore the initial positions. The
Python fixture uses one loop on two datapaths. Its JavaScript is test support.

Verification: build and all 3,906 JavaScript tests passed, zero skipped. Five new
regressions cover Source keys, relative paths, Data updates, identity/bindings,
all-edge bounds, cancellation, store replacement, removal, isolation and group
header actions. Real Chromium/WebKit mouse drags at desktop and 390px widths
verify coordinates, bounds and TYTX restoration, preserving control selection.
No physical touch-device test, publication or adoption into the main gallery is
claimed. Logs: /private/tmp/movable-{build,focused,full-tests,chromium,webkit}.log.


<a id="gc-370-055"></a>
## 055 · Resize trial with composed content

Owner confirmed resize before layers: width and height belong to the existing
tray geometry Bag and resizing must retain content. This increment supersedes
the resize deferral in §050; all other deferred features remain out of scope.

```python
tray = root.trayPane(storepath=".workspace", height="680px")
card = tray.div(node_label="customer", lbl="Customer", movable=True,
                resizable=True, minWidth=160, minHeight=100,
                datapath=".customer")
card.textbox(lbl="Name", value="^.name", live=True)
card.horizontalSlider(lbl="Level", value="^.level", min=0, max=100)
```

Before rendering a resizable card, initialize its geometry row in the Data Bag.
For example, `.workspace.customer` contains `left=12`, `top=14`, `width=220`,
`height=290`. Values are CSS pixels; width/height measure the entire Labelbox,
including its label and border. Both sizes must be positive finite numbers.
A movable-only row may still omit both sizes and use authored box dimensions.
`resizable` is independent of `movable` and defaults to false. `minWidth` and
`minHeight` default to 100 and 64; they govern interactive resizing. The panel
edge takes precedence if the remaining space is smaller than those minima.
Explicit external Data changes are projected as supplied, without silent
geometry normalization.

Drag the small lower-right grip, or focus it and use arrow keys (one pixel;
Shift uses ten). The gesture writes width/height live into the same row. The
existing DOM, Source, controls and bindings remain mounted; only outer geometry
changes. Small cards scroll their content without hiding the label. Cancelling
restores the starting dimensions. Replacing the store ends the gesture and
projects the restored geometry; removal/disconnection releases capture. Saved
sizes still apply when interactive resizing is disabled.

The Python trial at http://127.0.0.1:8101/ reuses one loop for Customer and Notes.
Each card has a textbox, slider, reactive value, real menu toolbar with −10/+10,
and Reset level. Their relative content datapaths are independent of the tray
geometry. Below the tray, four bound fields expose Customer geometry; Restore
layout resets both cards' positions and sizes without resetting their content.
This is a core fixture, not a deployed gallery revision.

Verification: build passed; all 3,909 JavaScript tests passed, zero skipped.
Eight tray tests cover movement and resize, limits, keyboard, cancellation,
Data/store replacement, disposal and unchanged identities/bindings. Chromium
and WebKit passed desktop and 390px runs using real pointer resize, slider,
menu actions and button reset, with TYTX geometry restoration and content
identity checks. The local preview was inspected visually. No physical touch
hardware qualification is claimed. The complete suite needs local fixture
servers; a sandbox-only attempt could not start those servers, and the normal
local-server run passed. Full log: /private/tmp/resize-full-tests.log.

Implemented and verified experimentally, awaiting owner trial. Layers,
collisions, selection, close, rotation and zoom are still deferred. No changes
to those behaviors or public deployment are included.


<a id="gc-370-060"></a>
## 060 · Layers and first contact

Owner confirms `layer` in the geometry Bag, contact blocking during both drag
and resize, and refusal of a layer change that would overlap another block on
the destination layer. This replaces the earlier proposed `z_index` field;
there is no second stacking state or alias. Each existing geometry row now has
an integer `layer`. A newly initialized position row starts at layer 0. Higher
layers render above lower layers, within the tray's isolated stacking context.

Movement and resize sweep the rectangle's edges to the requested geometry and
stop at the first contact with a same-layer block. Touching edges are valid;
sliding along an edge or moving away remains possible. Fast pointer moves
cannot tunnel through an obstacle. The same constraint applies to keyboard
resize. Different layers do not obstruct each other. At diagonal contact a
fractional CSS-pixel coordinate is retained rather than rounded into overlap.

Changing a row's layer through a binding or ordinary Data update checks the
current rectangle against the destination layer. An overlapping destination
restores the previous value from the Bag event. No block is automatically
moved. Layer subscriptions are released when the tray disconnects or changes
store. An ordinary reprojection of the same store does not interrupt a gesture;
an actual external geometry update does. A synchronous rejected component edit
must project the restored Data value even when it equals the previous cached
projection; unrelated re-projections still preserve uncommitted field drafts.

The preview places Customer layer and Notes layer above the tray. Both start at
0: drag or enlarge Customer towards Notes to reach contact. Set Customer to 1
to allow overlap; returning it to 0 while overlapping is refused in both Data
and the input. Move the cards apart and the change succeeds. Restore layout
restores positions, dimensions and both layers. Sliders are labelled Intensity
to distinguish their content values from the tray's layers.

Collision prevention constrains gestures and individual layer changes. Initial
or restored layouts and direct coordinate/dimension writes must supply a valid
layout; this increment does not auto-pack or repair arbitrary overlapping Data.
Selection, close, rotation and zoom remain deferred. Existing content identities,
Source and bindings remain unchanged.

Verification: build and all 3,915 JavaScript tests passed, zero skipped. The new
regressions cover four-direction and diagonal swept contact, grazing/sliding,
fast moves, resize/keyboard contact, distinct layers, rejected/accepted layer
changes through a bound editor, and gesture continuity across re-projection.
Chromium/WebKit passed desktop and 390px interaction tests, including rejected
layer changes, retained content and TYTX restoration. Local preview inspected;
no physical touch-device qualification, publication or deployment claimed.
Logs: /private/tmp/layers-{build,unit,full-tests,chromium,webkit}.log.


<a id="gc-370-065"></a>
## 065 · Multiple selection in the tray Data

Owner requests the next bounded increment: multiple selection, visible borders
and state in the tray Bag; rotation and zoom remain later. Each block row now
contains boolean `selected`, defaulting to false and initialized in Data when
absent. There is no separate selection set, Logic state or Source attribute.
The existing Bag TYTX save/restore includes the flags with geometry and layer.

Primary pointer press on a block selects it exclusively; Shift toggles only
that block. Pressing empty tray space clears mounted blocks' selection. Right
click does not change selection. Selection starts on pointer press so dragging
also selects the interacted block. Embedded controls keep the original event,
focus, editing and actions; their content is not reconstructed. Nested trays
handle their own interactions without selecting their containing outer block.
Selection does not change layer or add group movement/resizing: the block being
dragged is still the only block whose geometry changes.

The DOM marker `data-selected` projects the Bag flag as a 2px theme-colored
inset outline. It changes neither background nor box dimensions. External Bag
updates and full store replacement update the outline. Removing a Source block
retains its saved row, including selected, consistently with geometry retention;
no state is copied into runtime memory. Rotation, zoom, marquee selection and
group transformations are not part of this increment.

The Python trial adds Customer selected and Notes selected checkboxes alongside
the layer inputs. They bind directly to `workspace.<node_label>.selected` and
make the shared state visible/editable, including without a keyboard modifier.
Click the cards, Shift-click the second, toggle either checkbox, then click the
empty tray background. Fields, slider and toolbar continue to operate normally.
Restore layout still restores geometry/layers only; it does not reset selection
or the cards' content.

Verification: build passed; all 3,918 JavaScript tests passed, zero skipped.
New regressions cover replacement/toggle/clear selection, secondary-click
behavior, nested-tray isolation, external Data changes, TYTX restore, old-store
isolation and unchanged Source/control identities. Chromium/WebKit passed at
desktop and 390px, checking real clicks/Shift-clicks, checkbox bindings, visible
2px outline without background/size changes, restore, and the prior movement,
resize, collision and layer-change tests. Preview 8101 updated for owner trial.
No physical touch-hardware qualification or public deployment is claimed.
Logs: /private/tmp/selection-{build,unit,full-tests,chromium,webkit}.log.


<a id="gc-370-070"></a>
## 070 · Upper-right layer slider

Owner requests a layer menu in the upper-right corner of each block, correcting
the first upper-left proposal, and confirms the range -10 to +10. Each tray
Labelbox now has a transparent currentColor SVG layers button in its label bar.
It opens an anchored native popover with the canonical layer readout and a
vertical range control (integer step 1, maximum above, minimum below). This is
component chrome, as for resize and copy actions; no application DOM/event code
or extra Source nodes are introduced.

Opening the control selects the block but never starts a drag. The slider writes
the existing layer Bag node. If a collision veto restores the previous value,
the thumb and readout return to it immediately. External Data changes update the
same mounted controls. The slider edits only -10..10; the underlying layer model
still accepts any integer. Projecting a value outside that range does not write
or clamp Data: the readout retains it and the bounded thumb sits at its endpoint.
The explicit numeric fields remain available in the trial.

Use the arrow keys while the slider is focused; Escape or an outside click
closes the popup. Scroll, viewport resize, store replacement and disconnect
close it too. Popover/positionPopup are the existing modern-browser path, with
no compatibility fallback. Label changes update the accessible name without
recreating the controls. DOM references are resources, not another layer store.
Reserved header padding prevents the action from covering the centered title
or existing groupBox actions.

Verification: build and 3,919 JavaScript tests passed (none skipped).
The added regression covers Bag writes, extrema, collision veto, control
identity, caption updates, scroll and disconnect cleanup. Chromium/WebKit
passed desktop and 390px trials with opening, vertical arrow-key adjustment,
Escape, no accidental move/resize, and collision rejection in the actual popup.
Home/End retain native browser RTL semantics; the verified shared interaction
uses vertical arrow keys. Prior selection/geometry/binding tests still pass.
Local preview 8101 updated; no publication or physical-device claim.
Logs: /private/tmp/layer-menu-{build,full-tests,chromium,webkit}.log.


<a id="gc-370-075"></a>
## 075 · Rotation, zoom and floating settings

The owner confirms the transformed outer rectangle as the collision shape,
ignoring shadows and rounded corners. `rotation` (degrees, default 0) and
`scale` (positive factor, default 1) now belong to each geometry Bag row.
CSS transforms project them around the Labelbox center; left/top/width/height
continue to describe its untransformed outer box. Zoom scales the entire
content; resize changes its available layout space. DOM, Source nodes, widget
instances and bindings are retained. TYTX serialization includes these fields.

A subtle transparent gear replaces the earlier layer icon/popover (§070). It
opens the existing floatingPane with a framePane: vertical Layer slider
(-10..10), numeric Rotation in degrees and Zoom in percent. The floating is
mounted outside the transformed block and stays upright. It can be moved,
closed, and reopened; its open/position parameters live in a `settings` Bag
inside the block's geometry row. DOM references and event handlers are resources,
not another application state store. Controls reflect accepted values when a
change reaches contact. Partial negative/decimal edits are retained while
focused; invalid drafts restore the Data value on blur.

Same-layer contact uses separating axes of the actual transformed rectangles.
A fixed-orientation linear path has exact entry/exit intervals. Rotations and
combined resize/scale paths use adaptive interval certification: a corner
acceleration bound encloses its curved trajectory relative to the endpoint
chord. The first uncertified contact interval is resolved to a subpixel
tolerance (1e-7 CSS pixels); checking only endpoints would allow tunnelling.
Pure multi-turn rotations only need their first turn checked. Tray bounds
constrain the same outer vertices. Different layers may overlap; changing to
an overlapping layer is still rejected without relocating either block.

Movement and resize stop at first contact along their requested path, including
a tray edge. A diagonal request no longer independently clamps both axes to
the far corner. Pointer resize maps through inverse rotation/scale and anchors
the transformed upper-left corner; left/top are updated accordingly in the
same row. Keyboard resize retains fractional contact coordinates. Neither
selection nor transforms recreate content. Multiple selection remains
individual editing, not group transformations.

The Python trial explains a useful narrow-screen sequence: Zoom 60%, Rotation
30°, then move or resize. Toolbar, slider, editable text and buttons stay live.
Directly imported geometry must already be valid; this increment does not
add automatic layout repair, persistence services, or nested transformed-tray
qualification. Local experimental preview only; no public deployment.

Verification: 3,925 JavaScript tests passed (zero skipped), build successful.
Chromium/WebKit passed desktop and 390px tests: layer limits/rejection, rotation,
zoom, upright settings, negative-angle typing, TYTX restoration, resize,
selection and unchanged controls. The live preview was refreshed and visually
checked. Logs: /private/tmp/tray-transform-{build,full-tests,chromium,webkit}.log.
Acceptance remains the owner's interactive trial; no device/deployment claim.


<a id="gc-370-080"></a>
## 080 · Rotation grip and zoom slider

The upper-left title-bar grip rotates the existing block around its center.
Pointer-angle deltas cross the -180/+180 boundary continuously and use the
same swept contact constraints as numeric editing. Cancellation restores the
initial Data angle; arrow keys rotate by 1 degree (Shift: 10), Escape cancels
an active rotation. Grip and resize remain distinct from title dragging.

The settings floating adds a horizontal Zoom slider (10–200%, step 1%) beside
the existing precise numeric field. Both project the same positive scale in
the block's Bag. A contact-limited value is displayed numerically and the
slider follows it at its own resolution. Values outside the slider range may
still be entered numerically; projecting them does not clamp stored Data.
The title grip is transparent, uses currentColor and has an accessible name
and tooltip. No additional application state or content recreation.

Verified: build, 3,928 JavaScript tests (zero skipped), Chromium/WebKit desktop
and 390px trials. Added coverage includes angular wrap, contact, cancellation,
keyboard rotation, border-aware center, slider/numeric synchronization and
stable content. Real pointer tests allow one degree for pixel-quantized
coordinates at 60% zoom; geometry unit tests use exact coordinates. Preview
8101 updated for owner trial. Logs: /private/tmp/tray-grip-*.log.


<a id="gc-370-085"></a>
## 085 · Composed workspace and intrinsic scrolling

The Python live fixture includes a borderContainer directly inside a card
Labelbox: a top toolbar, center tabContainer with two formlets, and bottom summary.
It demonstrates independent content Data (project) and geometry Data
(composed_layout.workspace), with no application DOM manipulation. Apply updates
the bound summary; editing and switching tabs retain the mounted controls through
movement, resize, rotation and zoom.

Container hosts use border-box sizing so assigned region/tab dimensions include
authored padding and borders. The renderer-owned Labelbox control box also uses
border-box sizing. Hidden labels collapse the label track and gap for all label
positions; they do not reserve invisible space. The trial toolbar has 42px for its
38px minimum buttons and separator. No overflow:hidden patch is used on the
trial's Labelbox, regions or tab content to conceal excess content.

Browser regressions check actual client/scroll extents through nested shadow
roots in Details and Options at multiple widths, including 220px. At 430px high,
there are no unnecessary scroll areas; at 320px only the tab content scrolls and
Notes remains reachable. Re-expansion removes that overflow. The same tests
assert stable descendant and control identities, values and selected page across
transforms and movement. Verified Chromium/WebKit desktop and 390px, build and
3,928 unit/integration tests. Initial broad runs needed the configured Python
environment and regenerated runtime bundles; the final run passes without skips.
Preview: http://127.0.0.1:8101/. Experimental verification, awaiting owner trial.


<a id="gc-370-090"></a>
## 090 · One spacious playground

The preview now leads with a single tray containing four independent cards:
Workspace, Mixer, Checklist and Notes. Small Python methods compose each card;
geometry uses composed_layout rows and each content has a separate Data scope.
The page uses the available width, a viewport-height tray (minimum 620px), and a
1080px minimum plane with outer horizontal scrolling on narrow screens. This
keeps enough movement space and avoids stacking all the lessons above the tray.
Detailed instructions and earlier regression fixtures are collapsed below.
Existing Chromium/WebKit desktop and 390px checks still pass. No core behavior
or automatic responsive positioning is introduced by this example change.


<a id="gc-370-095"></a>
## 095 · Layout lock and Bag snapshots

trayPane.locked is a boolean read binding. It disables interactive geometry and
selection changes, ends active gestures at the current Data values, closes the
settings floating and hides rotate/resize/settings controls. It does not disable
content controls or prevent external geometry Data from projecting. Unlocking
restores the authored movable/resizable affordances and selection indication.

The trial toolbar stores independent Bag.deepcopy() snapshots in saved_layout;
restore installs another deep copy at composed_layout. This restores left/top,
width/height, layer, rotation, scale and the other existing row fields without
rebuilding Source or controls. The saved copy never aliases the working Bag.
Snapshot and lock state remain in Data; no Logic state or external persistence.
Save is scoped to the current page lifetime. Restore is unavailable until saved.
Verified build, 3,930 tests and Chromium/WebKit desktop/390px trials. The browser
checks invoke the real toolbar actions; unit checks cover all geometry fields,
lock during a gesture, keyboard attempts and unchanged control identities.


<a id="gc-370-100"></a>
## 100 · Separate vertical sliders

This supersedes the gear/floating UI in §§075–095. A layers SVG and an adjacent
zoom SVG open two compact native popovers, with vertical ranges -10..10 and
10..200% respectively. Values still write layer and scale in the same geometry
Bag; the left rotation grip remains unchanged. Popovers show current values,
use the existing positionPopup helper and live outside each transformed block.
Escape restores focus to the trigger; native light-dismiss updates Data.
Opening one control closes the other. Lock hides both and closes their popovers.

createTraySettings owns only DOM resources. Visibility is represented by
settings.layerOpen/settings.scaleOpen in the row, replacing the former floating
settings.open UI field. There is no new geometry format or state on Logic.
The tray no longer needs Source context solely to host these controls.
Tests cover vertical orientation, ranges, rejected layer changes, transformed
zoom limits, Data roundtrip, focus/close behavior, lock and cleanup. Chromium and
WebKit pass desktop and 390px trials; preview 8101 is available for owner trial.

Final full core suite: 3,930 passed, zero failures or skipped tests.


<a id="gc-370-105"></a>
## 105 · Stable slider placement

Anchor layer/zoom popovers when opening, then keep their position until closed.
Reprojecting scale must not reposition the slider against its moving trigger:
that creates a feedback loop during pointer dragging. Reopening uses the current
trigger geometry. Data still owns values and visibility; no extra state is stored.
The pointer regression fails before this fix and passes on Chromium/WebKit,
including 390px width. It checks fixed popup coordinates, decreasing scale while
dragging down and unchanged content instances. All 23 tray unit tests pass.


<a id="gc-370-110"></a>
## 110 · Grid and Shift gestures

Owner confirmed optional visible grid, editable steps in the toolbar and snapping
only while Shift is held during move, resize or rotation. gridStep is integer
pixels (default 10); rotationStep is degrees (default 15); zero disables that
step. gridVisible independently controls thin square grid lines when gridStep>0.
The trial binds these parameters to tray_ui, alongside locked, and saves/restores
that Data Bag with the geometry snapshot. No settings row is reserved among
node_label-keyed blocks, and no state is kept on Logic.

Movement snaps left/top in tray coordinates; resize snaps local width/height;
rotation snaps the absolute angle, accumulating pointer deltas before rounding.
Contact, bounds and minimum dimensions have priority, so the accepted geometry
can lie between grid steps at a limit. Releasing Shift during the gesture returns
to free updates. Existing keyboard shortcuts retain their previous semantics.
Content instances and bindings are preserved. The grid does not receive events.

Verification: 25 tray tests, 3,932 full core tests, and Chromium/WebKit desktop
and 390px browser trials. Tests cover releasing Shift, zero and custom steps,
contact priority, fine angular deltas and toolbar settings snapshots. Visual
inspection completed at 1440px. Preview 8101 is ready for owner trial.


<a id="gc-370-115"></a>
## 115 · Moving the selected group

Shift+click selects several blocks; drag the title of any selected movable block
to translate the selection. Preserve the selection at pointerdown; a title click
without drag still replaces/toggles it normally. Every selected block receives
one common accepted delta. For each member, use transformed rectangle contact
against unselected blocks on that member's layer and the tray bounds; choose the
minimum fraction for all. The group neither changes layers nor resizes/rotates
its members. Selected nonmovable blocks prevent the move.

Shift snapping applies to the anchor's left/top only, so initially unaligned
members retain their offsets. Cancellation restores every member's initial
position. External Data/store changes stop the gesture; no content is remounted.
The gesture holds DOM/Bag references and starting poses, not persistent selection
or a separate group model. Resize and rotation retain individual behavior.

Verified in 28 tray tests and the full 3,935-test suite, plus Chromium/WebKit
pointer trials at desktop/390px. Preview 8101 updated for owner trial.


<a id="gc-370-120"></a>
## 120 · Rectangle selection from empty space

Drag empty tray space to draw a thin translucent selection rectangle. Blocks are
selected when all transformed outer corners are enclosed, regardless of layer;
rotation/scale count, shadows and rounding do not. Ordinary dragging replaces
selection; holding Shift at gesture start adds enclosed blocks to the original
selection. Either drawing direction works. A plain empty click clears selection.
The existing selected flags update in Data during the gesture and drive outlines.

The transient rectangle lives in the shadow tree and receives no pointer events.
Pointer capture keeps the gesture active across cards. Release removes the
rectangle, while Escape/cancel restores the original selection. Lock, disposal
and external store replacement release resources without writing stale Data.
The gesture does not move focus away from an editor or recreate content.
After selection, dragging a selected title moves the group as in §115.

Verified: 31 tray tests, Chromium/WebKit desktop/390px and the full 3,938-test recheck. One initial unrelated Typst timing failure is recorded in GC-070 §2355. Preview 8101 ready for owner trial.


<a id="gc-370-125"></a>
## 125 · Implicit tray membership and frame composition

Owner removed movable/resizable flags after confirming they only applied inside
the tray. They are no longer tray child parameters: direct Labelbox children
receive movement, resize and card chrome automatically. The tray's locked state
is the editing gate. Window movable/resizable parameters are unchanged.
This supersedes older optional flags and the selected-immovable-member rule.

Authored/intrinsic dimensions remain until the first resize writes width/height
into the geometry Bag. No mandatory sizes are introduced merely by membership.
Minimum dimensions continue to constrain resizing. Existing content is preserved.
The trial now uses framePane with its menu(presentation="bar") in top and the
tray in center; frame regions and menu behavior are not reimplemented in trayPane.

Verified: 32 tray tests, full 3,939-test suite, Chromium/WebKit desktop/390px and final frame layout inspection. Preview 8101 updated for owner trial.
