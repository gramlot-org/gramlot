# 320 · Frames, slot bars and windows

> **Menu follow-up, 2026-10-22:** [GC-330](330-menus-and-commands.md) records
> the legacy/core inventory and proposed command sharing between bars and menus.
> The owner reaffirmed flex bars with ordinary Source children. A shared registry
> and unnamed slotButton spacers remain proposals; unknown-name behavior is open.

> **Authoring update, 2026-10-22:** [GC-325](325-how-to-extend-gramlot.md)
> records the owner's subsequent choice: fixed `slotButton("namespace:name")`
> and `slotSpacer(...)` elements, JS-owned registrations and page `gramlots`
> with an implicit base. Compact strings, their expansion/parser rules and
> generated per-button grammar methods below are superseded proposals, retained
> as design history rather than additional implementation paths. Related dynamic
> helper/named-slot syntax remains proposed. Unknown-name behavior is deferred;
> the free-content slot API is not settled. Window/frame requirements remain.

Document ID: **GC-320**. Date: **2026-10-22**.
Status: **complete design proposal; APIs not implemented or approved as a whole**.
[Full proposal](../../docs/future/320-frames-bars-and-windows.md).
Related: [GC-070 §1625](../internal/070-work-status.md#gc-070-1625),
[GC-225](../internal/225-naming-and-proxy-conventions.md),
[GC-310](310-buttons-and-button-bars.md).

Examples are proposed Python syntax, not current runtime claims. No publication
or dependency-source edits. This is not a replacement for GC-110.

<a id="gc-320-005"></a>
## 005 · Confirmed requirements and evidence

Python first. Dialog/floating have window chrome and an internal framePane.
Dialog stays modal even collapsed; movement/resize/collapse default off.
Floating is nonmodal with those capabilities on. X/Escape closing is interceptable,
normally allowed without a handler. Five frame regions support multiple rows or
columns; nested slotBars and multiple bars per region are explicitly confirmed.
SlotButtons publish to designated frame content and identify their sender.
Dynamic slots, spacers and beginning/end placement are requested; exact syntax
and 1/-1 semantics remain proposals. groupBox already covers labelgroup;
standalone copyButton and Catalog persistence remain separate.

Legacy evidence: GenroPy@fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea,
gnrwebstruct/base.py and dojo11.py, genro_components.js and genro_widgets.js.
Nested bars: resources/common/th/th_form.py:338–345. Multiple bars:
projects/gnrcore/packages/test15/webpages/gnrwdg/slotbar.py:75.
PoC@10478b57ce3f22e6445eb6b72eba343520cbebac has palette/clipboard evidence,
not framePane/slotBar. Core baseline 0.3.10.

<a id="gc-320-010"></a>
## 010 · One Source structure; browser-owned behavior

Recommendation: compact slot string expands once during authoring into explicit
ordered slot/spacer Source nodes. Do not retain a second authoritative slots
string. Dynamic edits, fragments and Inspector use that same canonical tree.

JS descriptors own portable metadata. Thin Python/JS authoring helpers create
Source only; shared fixtures prove equivalent results. They do not implement
DOM, layout, focus, modality or command handling. Web Components own browser
behavior; Data/bindings own values; existing messaging owns delivery; application
Logic owns operations. Application children stay renderer-owned in light DOM,
with stable shadow containers; no private toolbar tree or DOM reorder.

<a id="gc-320-015"></a>
## 015 · Component boundaries and naming proposal

Proposed authoring names: framePane, slotBar, slot, spacer, slotButton, dialog,
floatingPane. DOM tags follow gramlot-kebab-case; descriptors follow PascalCase.
Review additions in GC-225 before implementation. No floating/palette alias set.

Reuse contentPane for regions and borderContainer's layout implementation for
FramePane; retain one real Source frame inside each window. SlotButton shares
ButtonBinding/SubscriptionsHandler. Dialog/floating share geometry/chrome.

dialog and slot currently name native HTML elements. Proposed components require
html_dialog/html_slot native access and migration/qualification of internal ask
and Inspector declarations. Explicit acceptance required. Icons use the current
text/emoji icon API; an icon registry/preset catalog is not included.

<a id="gc-320-020"></a>
## 020 · Frame regions, rows and columns

```python
frame = pane.framePane(nodeId="customerFrame", height="100%")
tools = frame.top.slotBar("new,10,save,*,close", node_label="tools")
filters = frame.top.slotBar("search,*,status", node_label="filters")
frame.center.textbox(value="^.customer.name", lbl="Name")
frame.bottom.slotBar("message,*,cancel,confirm", node_label="footer")
```

Five scoped authoring accessors create missing regions once; unused regions take
no space. Runtime inspection never creates absent regions implicitly.
Top/bottom stack horizontal tracks vertically; left/right arrange vertical tracks
side by side. Direct side widgets enter one explicit implicit-default Source
track; row(name)/column(name) create additional named flex containers. A direct
slotBar is already a track. Center has ordinary content, no toolbar policy.
No automatic wrap changes semantic tracks. Existing border sizing/splitter/drawer
contracts remain authoritative; FramePage stays distinct from framePane.

<a id="gc-320-025"></a>
## 025 · Slot syntax, nesting and spacing

```python
bar = frame.top.slotBar("new,12,save,|,undo,*,close")
bar.slots["save"].slotButton("Save", publish="save", icon="💾")
actions = bar.slots["new"].slotBar("create,8,importData")
actions.slots["create"].slotButton("New", publish="new", icon="＋")
```

Primary lookup proposed as slots["name"] to avoid method/tag collisions.
Tokens: name = unique named slot; nonnegative integer = pixel spacer;
* = weight-1 elastic spacer; pipe = separator. Trim whitespace; reject empty,
duplicate, negative numeric, reserved/invalid names and unsupported punctuation.
No embedded code or dotted-path lookup. Named ready-made content and
slot@parameter are reopened for design review in §070, not rejected as features.

gap supplies regular spacing; explicit spacers add their size to gaps.
Fixed size supports nonnegative pixels or validated CSS lengths; elastic weight
must be positive. Spacers are not buttons/focus targets. Separators retain
appropriate semantics. Nested bars inherit orientation from their containing bar;
top-level bars inherit the frame side; otherwise horizontal. Explicit wins.
Multiple bars have distinct node_label values. Theme gap awaits visual review.

<a id="gc-320-030"></a>
## 030 · Dynamic insertion, ordering and identity

```python
help_slot = bar.addSlot("help", position=-1)
help_slot.slotButton("Help", publish="help", icon="?")
bar.addSpacer(flex=1, before="help")
bar.moveSlot("help", position=-1)
bar.removeSlot("undo")
```

addSlot rejects duplicates; slots[name] retrieves only existing slots; removal
disposes the subtree; moving retains identity/drafts. position/before/after are
exclusive; before/after address named siblings. Proposed positions are signed
one-based insertion gaps counting all direct children, including spacers:
1 prepends, -1 appends; for n children n+1 appends and -(n+1) prepends.
Zero/out-of-range reject; moves count after removal. Omission appends.
These are insertion coordinates, not permanent edge anchors. Use named groups
separated by * for visual ends. Repeated prepends reverse insertion order.

No runtime replaceSlots string or silent upsert/rebuild. Python builds new Source
fragments through existing remote/source services; client Logic mutates live Source.
Helpers use the existing lifecycle and Inspector-owned history, not a new general
transaction/rollback system.

<a id="gc-320-035"></a>
## 035 · Commands, sender and designated recipient

```python
editor = frame.center.contentPane(
    frameTarget=True, nodeId="customerEditor",
    selfsubscribe_save="customer.save", selfsubscribe_undo="customer.undo",
)
```

At most one designated descendant per frame, excluding nested-frame ownership.
Resolve current target on activation; missing target prevents dispatch with a
diagnostic; duplicate target is invalid. No global fallback or stale target cache.
Nested bars keep scope; nested frames change it.

Reuse Source-node publish and selfsubscribe, not handwritten topic concatenation.
Historical payload (superseded): command, sender, target, frame, parameters,
modifiers. Use the confirmed [GC-335 §080](335-common-menu-system.md#gc-335-080):
five fields, no frame, and command is the full registered key.
Node fields are local Source references; no new cross-frame/wire envelope.
Handlers are browser Logic; server work uses existing RPC. SlotButton publish is
exclusive with action/fire/executable nested provider. Window chrome operates on
the window, while application close commands go to the designated content.
Use existing icon presentation; value-copying copyButton is a separate component.

<a id="gc-320-040"></a>
## 040 · Dialog and floating Python proposal

```python
dlg = root.dialog(
    title="Customer", open="^.customerDialogOpen",
    width="640px", height="420px",
    movable=True, resizable=True, collapsible=True,
    beforeClose="customer.beforeClose",
)
frame = dlg.frame
frame.top.slotBar("title,*,save", node_label="tools")
frame.bottom.slotBar("message,*,cancel,confirm", node_label="footer")
```

Each window owns exactly one real Source framePane exposed as .frame.
Title is localized/plain text. Proposed defaults: open/collapsed false; closable
true; movement/resize/collapse off for dialog and on for floating. Boolean state
is reactive; open/collapsed support writeback. width/height/minWidth/minHeight use
explicit CSS sizes/theme defaults and viewport bounds. Initial left/top may be
authored; otherwise center dialog/place floating within viewport.

Propose retain children/drafts/geometry through close/reopen in the same lifetime,
no reload persistence. Collapse retains expanded geometry; disabling collapse
restores it. Disabling gestures releases capture; external geometry wins.
Dialog uses native showModal and stays modal through geometry/collapse changes;
open after binding/children installation, not arbitrary timers. Floating has
page-local stacking below active modal. Test shadow/slotted content and popovers.
Modal blocking is document-local, not a parent-iframe promise.
[HTML standard](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element).

Maximize remains tentative: recommend deferring first-slice support.
Fullscreen is distinct. Exact geometry retention/defaults still need approval.

<a id="gc-320-045"></a>
## 045 · Closing, async confirmation and accessibility

Propose requestClose(reason) for X/Escape/application requests and named
beforeClose guard returning boolean or Promise<boolean>. Absent guard allows;
false vetoes; true allows. Error/invalid result leaves open with diagnostic.
Existing synchronous tab onClose stays unchanged. Suppress duplicate pending
requests; teardown invalidates late completion. Nested ask keeps only top modal
interactive.

Propose external bound open=false as application state that bypasses the guard;
commands needing confirmation use requestClose. Accepted close writes once and
notifies once; veto writes nothing. Deletion is teardown. No click-outside modal
dismissal; closable controls X/Escape. Collapsed modal restore/close remains
reachable. Native accessible buttons, keyboard drag/resize equivalents, focus
restore, reduced motion and no geometry-induced focus jumps are required.

<a id="gc-320-050"></a>
## 050 · Live lifecycle and ownership details

Use current projection/binding; review bounded state-writeback extension where
container parameters exceed current control-value support. No second Data writer.
Source order equals keyboard/visual order; preserve inputs, drafts, iframe contexts.
Source-owned recipient discovery releases observers and excludes nested frames.

Transient geometry stays local except bound parameters; propose final writeback
at gesture completion, external updates authoritative. Clean observers, listeners,
pointer capture, animation tasks, subscriptions and pending close completions.
Reattachment does not replay stale work; moving across frames changes scope.
Empty slots do not create fake buttons; target removal never broadens delivery.

<a id="gc-320-055"></a>
## 055 · Feasibility gaps and required bounded extensions

Existing: typed portable metadata, Container/BorderContainer, Source publishing.
Missing: scoped region/window/slot helpers, dynamic helpers, scoped slotButton
publish mechanism and window components. Required additions remain Gramlot-owned:
authoring/canonical grammar; shared frame layout; slots/spacers; command routing;
shared chrome/geometry and modal/nonmodal behavior.

First prove supported public Builder extension points with a small fixture.
Current schema dispatch/container hooks do not prove all proposed Python/JS
routing. If a primitive is absent, report it upstream; no installed-source edits,
monkeypatches, alternate Source types or private proxy tree. Review names and
defaults in GC-225 before coding. Proposal completion is not implementation approval.

<a id="gc-320-060"></a>
## 060 · Delivery slices and meaningful verification

1. Source/frame: canonical parity, lazy regions, tracks and border reuse.
2. Bars: nested/multiple bars, spacing, dynamic identity and rejection cases.
3. Commands: sender/recipient, nested isolation, removal and no broadcast.
4. Windows: defaults, modal/nonmodal geometry, collapse and nested interactions.
5. Closing: async guard, Data updates, focus, teardown and listeners.
6. Python examples/parameter docs: connected gallery review and package artifacts.

Core tests use core fixtures; examples stay in gramlot-examples under their scoped
authorization. JS server/serverless release alignment is unnecessary here.
Focused tests during development, full qualification before a separately
authorized release. Real browsers cover geometry/focus/modality; unit tests cover
structure/state. Include two independent frames/windows, narrow viewport, touch,
keyboard, reactive capabilities, reduced motion, error paths and retained drafts.
Prepare Catalog metadata without implementing persistence or assigning maturity.

<a id="gc-320-065"></a>
## 065 · Decisions to review and completion evidence

Proposals needing confirmation: canonical slot/spacer Source with one-time DSL;
slots["name"] access; signed insertion gaps; dialog/slot native-name coexistence;
floatingPane spelling and window retention/defaults; named async close guard with
external-state bypass; deferred maximize; named ready-made content (§070), without
automatically copying legacy callback lookup or replaceSlots. Ask one decision at a time, beginning with
canonical representation. Preserve already confirmed requirements.

Checks cover Python snippet syntax, paired anchors/sections and local links.
No snippet is executed against nonexistent APIs, and no new runtime behavior is
claimed verified. Full proposal contains the complete examples and test matrix.

<a id="gc-320-070"></a>
## 070 · Named ready-made content: legacy capability to preserve in the review

Owner recalls recognized names producing ready-made content. Confirmed:
Python _addSlot tries <slotbarCode-or-frameCode>_<slot>, then
slotbar_<namespace>_<slot>, then slotbar_<slot>; loaded struct methods provide
content with per-slot options, frameCode and optional slot@parameter.
FormHandler supplies form_save/form_revert; FrameGrid addrow/delrow.
Separately JS slot_<name> handles searchOn, stackButtons, count, messageBox, etc.
These may include form/database policy, not merely icon presentation.

The proposal's earlier blanket exclusion was too broad. Reopen named reusable
content for design review: explicit definitions/scope, one deterministic resolution
rule, ordinary custom slots, parameters and collision handling. Recommended
direction: authoring expands named compositions into the same canonical Source;
browser behavior remains registered components. No competing Python/JS runtime
resolvers or automatic legacy fallback chains. Distinguishing preset names from
empty slots, runtime insertion and parameter/Catalog contracts remain undecided.
No preset registry, dependency-bearing widget or new feature is approved here.

Sources: legacy dojo11.py:690, formhandler.py:317, framegrid.py:53 and
genro_components.js:6296/6384. Full view records the rationale and boundaries.


<a id="gc-320-075"></a>
## 075 · First window increment (2026-10-23)

Owner, 2026-10-23: “Sì, confermo dialog per il componente, html_dialog per il tag nativo e floatingPane per il floating. Procedi con gli adeguamenti interni e la prima versione da provare nella gallery.”

Implemented in the layout collection: dialog and floatingPane share WindowShell;
html_dialog is a distinct native grammar declaration in both languages. Ask and
the three Inspector dialogs use it explicitly. The native showModal session owns
modal blocking, including collapse; floating uses nonmodal native dialog chrome.
The existing framePane owns layout and command targets. The .frame accessor creates
or returns exactly one Source framePane; there is no shadow-only content replica.
Historical slotBar/slotButton syntax in earlier sections is superseded by menu,
menuline and spacer. New helpers do not modify Builder or Bag dependencies.

```python
from gramlot import Page as BasePage
from gramlot.collections.layout import mygramlot as layout

class Page(BasePage):
    gramlots = [layout]

    def main(self, root):
        window = root.dialog(title="Editor", open="^editor.open",
                             movable=True, resizable=True, collapsible=True,
                             width="440px", height="360px",
                             beforeClose="beforeClose")
        frame = window.frame
        frame.top.menu(presentation="bar").menuline(caption="Action", action="handle")
        frame.center.contentPane(frameTarget=True).input(value="^editor.draft")
```

Dialog movement, resize and collapse default false; floating defaults true. open
and collapsed default false; closable defaults true. Title is text. open/collapsed
and width/height/left/top support ordinary Data bindings and writeback; geometry
lengths use CSS strings. minWidth/minHeight constrain geometry. Completed pointer
or arrow-key gestures commit once; cancellation restores the starting rectangle.
Arrow keys on title/resize handle use 10 px steps, Shift uses 1 px. Geometry fits
the document client viewport, excluding scrollbars. Pointer capture, viewport
listener, child observer and pending close completions are released on teardown.

A close/reopen retains mounted Source, controls, draft values and geometry within
the page session. Collapse hides the frame and retains expanded height. Disabling
collapse restores the frame. X/Escape use requestClose; Source requestClose(reason)
uses the same named beforeClose guard with (windowNode, {reason}). Boolean or
Promise<boolean> is required: true accepts, false vetoes; invalid/rejected results
report a diagnostic and retain the window. Pending requests coalesce. Data open=False
and Source deletion bypass the user guard; stale completion cannot close a reopened
or disposed window. The native modal restores focus; Gramlot also restores the
connected previous focus target for nonmodal windows. No maximize or reload storage.

The Python chapter now includes 09_windows, comparing defaults, an explicitly
movable modal, and a floating window. Each frame has top/bottom bars, an Actions
popup, shared draft and central save recipient. The guard can be exercised through
an internal checkbox. The standalone frame lesson remains available as 05_frame_pane.

Verification: 87 focused JavaScript tests cover windows, menus, layout, ask,
buttons and Inspector; seven core Python authoring tests; two chapter tests with
nine page subtests. All pass. Real Uvicorn/browser checks cover default modality,
collapsed modal/float distinction, close veto, focus restoration, popup commands
inside a modal, pointer move/resize, keyboard resize, background editing and retained
geometry/text after reopening. Browser-found corrections include allowing Escape
past a permanent toolbar with no open popup, scrollbar-aware viewport bounds and
using value (not checked) for the native checkbox's two-way binding. Earlier failed
checks exposed the native-prefix collision and an incorrect test helper; both were
corrected and rerun. This is implemented and verified, awaiting owner usability
acceptance. No extended release qualification, package publication or deployment.


<a id="gc-320-080"></a>
## 080. Maximize and restore trial (2026-10-23)

Owner requests maximize/restore on both windows and confirms the proposed contract
with “ok”. This supersedes the maximize exclusion in §075, not its other limits.
`maximizable` defaults false on both dialog and floatingPane; `maximized` defaults
false and uses two-way Data binding. Enable the control explicitly:

```python
window = root.dialog(title="Editor", open="^editor.open",
                     maximizable=True, maximized="^editor.maximized",
                     movable=True, resizable=True, collapsible=True)
window.frame.center.contentPane().input(value="^editor.draft")
```

The same parameters apply to floatingPane. Maximize fills the document client
viewport without a normal-window margin. Restore recovers the normal expanded
rectangle, clamped if the viewport has shrunk. Normal geometry and bound lengths
are not overwritten by maximize or collapse. Bound geometry changes while maximized
update the normal rectangle used on restore. Movement and resize are suspended
while maximized; their authored settings resume on restore. Collapsing retains
maximized state and expanding returns to the viewport size. The maximize control
can change state while collapsed without expanding the frame. Disable maximizable
to restore normal size and write maximized=False. Close/reopen retains content and
state within the page session; reload persistence remains out of scope.

All transitions reuse the same native dialog and mounted frame. A dialog stays
modal, including when collapsed; floating remains nonmodal. Distinct accessible
labels identify Maximize window / Restore size and Collapse window / Expand window.
The existing close guard and source requestClose contract are unchanged.

Verification: 90 focused JS tests pass (including 11 window tests), seven core Python
tests, two gallery tests with nine page subtests. Regressions cover both window types,
Data writeback, normal geometry retention, viewport resize, capability disabling,
collapse/reopen, pointer/keyboard suspension and externally changed geometry.
Uvicorn/browser checks confirm full viewport geometry, exact restoration, retained
input, modal continuity and editable background behind a collapsed maximized
floating. No browser console errors. The gallery lesson 09_windows explains each
operation above the examples. Implemented and verified; owner usability acceptance
and stable maturity remain pending. No release qualification or publication.


Appearance refinement (2026-10-23, owner feedback): the shared resize affordance
is a small two-stroke SVG grip with a 20px hit area, replacing the solid triangle.
Keyboard access and pointer capture remain unchanged. Window regressions and a
real browser drag pass; this does not change the window contract.
