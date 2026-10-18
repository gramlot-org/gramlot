# PORT-0006-inspector-components

- **Status:** full composition implemented and verified; final owner visual acceptance pending
- **Evidence revision:** `gramlot-org/gramlot-devtools@cdef847616158012c2f6e5f46a5e9a0e35c48523`,
  its vendored `gramlot-poc/js/dom/src/collections/storetree.js` and
  `gramlot-poc/js/pages/src/inspector.css`. The reference is the DevTools version,
  not an assumption of equivalence with the separate current PoC checkout.
- **Destination revision:** uncommitted development work
- **Constitution points checked:** §3–6, §10, §13–14, amendments 11.61–11.62

## Evidence

The owner requires the DevTools interface, not the earlier large form-based
palette. The reference tree supplies label-only rows, chevrons, blue bold selected
labels and optional row actions. Its editor uses a compact Properties grid beneath
a splitter and a path footer. The owner accepted proceeding from the first tree
to full composition with "ok" on 2026-10-14 (constitution 11.62 review record).

## Scope and contract

The first slice adds `webcomponent(code=...)` and `tools/poc/gramlot-poc-tree`.
Code is a required literal custom-element name. The element is not a static
Builder component expansion. Current scalar binding and native event handling are
retained; a general object-property binding system is not introduced.

The tree receives the actual Bag through `storeBag`; click/keyboard selection
emits `change` with `{path,node}` for named Logic via `connect_onchange`.
`rowActions` retains the PoC `tree-action` event. Labels, expansion and selection
are rendered inside the reusable component. Disconnect, replacement and reconnect
own the Bag subscription. No resolver is executed; cyclic Bags are rejected.

## Included contents and omissions

The transferred tree subset and CSS live in `tools/poc/`. Its external Bag import
is the consuming `@gramlot/gramlot`; no PoC Application, renderer or registry is
imported, and no Bag copy/runtime is bundled. Removed unrelated relation-tree,
favorites, navigation, lazy-loading, tooltip and WidgetLabel code.

The initial separate tree proof remains available. The inspector now imports the
four provisional components and composes them through Source. Additional evidence
at the same DevTools revision: `collections/palette.js`, `collections/layout.js`,
`src/panel-tabs.css` and `src/inspector/panel-editor.js`.

`gramlot-poc-palette` retains the bounded light shell, title/close and pointer/keyboard
movement/resizing and, following the owner correction of 2026-10-14, collapse/restore. Omitted persistence, WidgetLabel and runtime discovery.
`gramlot-poc-tabs` supplies DevTools tab styling and keyboard navigation over
Source-declared buttons. `gramlot-poc-splitter` retains only the vertical inspector
split with two slots and an accessible pointer/keyboard separator. They import no
PoC classes; platform DOM inside these components is separate from the inspector's
Source-authored composition and named Logic.

The grid uses fixed names/types for existing properties, editable value cells,
row-exit/Enter commit and Escape reload, plus add/remove attributes. Bag value and
`_meta` rows are omitted. The tree dot opens the chosen path's breakpoint dialog;
active dots/counter, selected-path hits and the removable active list are connected
to the existing synchronous Bag breakpoint logic. Unsupported scalar/object type
editing remains read-only; no new general component API was introduced.

## Verification

- Core: 570 JavaScript and 133 Python tests pass, including the new declaration.
- Inspector/tool: 20 unit tests pass, including live updates, subscription cleanup,
  SourceBag identity, non-execution of resolvers and selection/event handling.
- Browser proof: Chromium and Playwright WebKit pass with Python TYTX and JS Source.
- Full inspector: Chromium and WebKit pass Source/Data editing, real typed-attribute
  addition/removal and row-exit commit, CSP rejection, console breakpoints,
  keyboard/pointer move/resize/splitter and reconnect. Chromium verifies a real
  debugger pause with the writer still on its stack.
- Five core runtime-bundle checks pass after rebuilding the optional artifact.
- Python 8185, Node 8187 and direct-file serverless (42-example export): Chromium
  and WebKit pass Data/Source editing, breakpoint hit and footer closure.
- Screenshots reviewed: `/private/tmp/gramlot-poc-tree-python.png` and
  `/private/tmp/gramlot-inspector-devtools-style.png`.
- Firefox qualification was attempted but its installed Playwright browser exits
  before page load with "Could not find profile folder", including with a real
  `/private/tmp` profile path. This is an environment failure, not a passed check.
  Branded Safari has not been tested; WebKit does not establish Safari support.

Reproduce from the inspector tool directory with `npm test` and
`node tests/poc-tree-browser.mjs`. The latter requires the repository's `.venv`
and installed Playwright browsers and binds a temporary loopback server.

## Differences and open questions

Selection uses a standard `change` event instead of the PoC `gnr-set` protocol;
the consumer owns Data writeback through existing named Logic. The tree cannot
load resolver branches. Attribute captions and database/navigation features are
outside this inspector slice. Decimal/object editing remains outside the implemented
scalar editor contract. Full DevTools API parity is not claimed. Visual acceptance
of the completed palette belongs to the owner, separately from implementation checks.

## Destination review

- **Result:** first slice reviewed by owner; full composition and integration checks
  pass. Final owner visual acceptance remains pending.
- **Next boundary:** replace provisional components individually against the recorded
  contracts; do not import additional PoC features implicitly.
- **Constitution conflict:** amendment 11.62 authorizes the bounded transfer.

## Feedback for later ports

Copying PoC lifecycle calls unchanged is unsafe: current Bag `unsubscribe` needs
`{any:true}` to remove all three event subscriptions. Test actual subscription
counts across replacement and disconnect. Do not import unrelated features from
the same PoC collection, or reuse `_meta.component` to bypass containment: that
marker invokes static Builder expansion, not a browser custom element.


## 2026-10-14 · Single palette and frame selector

Owner: "Sì, palette unica e collegamento completo". Constitution 11.62 now extends
the previous open/close-only bridge. GC-195 §040 records the explicit MessagePort
agent/client protocol for shell and registered examples, including opaque origins.
This is dedicated tool communication, not another PoC port or core discovery API.
The row action is red in the left gutter, visible only on hover or keyboard focus;
selected nodes and active breakpoints do not pin it. The component replacement
contracts and dependency ownership remain unchanged.

Owner correction, 2026-10-14: the preceding hover-only active-state rule is
superseded. Inactive indicators are grey outlined circles on hover/keyboard focus;
active indicators stay visible, red without a condition and yellow with one.
`conditionalPaths` extends the existing row-action descriptor (GC-225 §035).


## Owner-approved structural tree extension — 2026-10-18

The explicit Source +/−, add dialog, branch drag and Undo/Redo instruction extends
this bounded tree contract (constitution, Source inspector structural editing).
`rowActions` can occupy the row end and hide actions on fixed paths; `dragEnabled`
and `fixedPaths` control native Source dragging, and `revealPath` exposes selection.
The `tree-drop` event carries path, destination and before/inside/after intent.
No additional PoC subsystem is imported. The tree never performs Bag mutations:
the existing inspector and target agent own Builder/Source edits and their history.
See GC-195 §055 for behavior, limits and qualification.
