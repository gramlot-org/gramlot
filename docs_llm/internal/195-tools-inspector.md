# 195 · Dedicated inspector Web Component

Document ID: **GC-195**. Constitution 11.61 approves this specific tool only.
[Expanded counterpart](../../docs/internal/195-tools-inspector.md).

<a id="gc-195-005"></a>

## 005 · Purpose and boundary

Block ID: **GC-195-005**.

`tools/gramlot-tools-inspector/` is an optional in-page Web Component, separate from
the Chrome extension and the future general component architecture. Its palette shows Data/Source trees, cached values and attributes with live updates,
selection, collapsed branches, move, resize and close/reconnect, plus the editor and
path breakpoints in §025. It does not execute deferred resolvers, discover frames
or provide browser-debugger privileges.
The gallery integration is described below; gallery qualification and remaining platform limits are recorded in GC-070 §780.

<a id="gc-195-010"></a>

## 010 · Ownership and lifecycle

Block ID: **GC-195-010**.

A platform `HTMLElement` creates only a Shadow DOM mounting boundary; a private
Gramlot instance renders all UI through Source, Data and named logic. Embedded CSS
is a Source-declared style. Pointer capture, keyboard movement and resize belong to the provisional palette/splitter internals.
The UI needs no inline compilation or new core service; optional breakpoint
conditions use the distinct, CSP-bound contract in §025.

Assign a live `Gramlot` instance or `null` to `gramlot`. Plain lookalikes and already
disposed instances are rejected. Page and component must import the same core URL.
No implicit global lookup. Two tool subscriptions observe Data/Source; each tree also owns its store subscription;
queued refreshes coalesce events and read `getValue(true)` without resolving data.
Node identity preserves tool selection; relative paths preserve expansion across sibling changes; removal clears
selection details. Display values remain text, including Source pointers.

Retargeting unsubscribes first; disconnect unsubscribes and disposes the UI. Stale
refreshes cannot affect a later connection/target. Multiple palettes are isolated.
Reconnect retains the target but rebuilds UI. The inspected instance is never
owned/disposed by the component. Its lifecycle status is read on refresh, without
polling or a new lifecycle-event API.

<a id="gc-195-015"></a>

## 015 · Build and qualification

Block ID: **GC-195-015**.

Private development package and separate build; the core runtime has no tool dependency/import.
The npm package ships `@gramlot/gramlot/tools/inspector`, built from the same source.
The bundle leaves `@gramlot/gramlot` external. Local setup uses `file:../../js`, an
unconstrained peer and no first-party lockfile. See the
[tool README](../../tools/gramlot-tools-inspector/README.md).

Node tests cover live values/attributes, literal markup/pointers, lifecycle,
multiple palettes, no resolver execution/target writes, selection, collapsed state
and target rejection. Browser tests cover Data/Source, move/drag/resize/reconnect and
script CSP without unsafe-eval/unsafe-inline; inline styles are allowed for bound
position. Results and limitations: GC-070 §780. WebKit is not branded Safari.
Passing tests do not imply publication or owner acceptance.


<a id="gc-195-020"></a>

## 020 · Gallery integration

Block ID: **GC-195-020**.

The gallery footer's Inspector button opens one palette in the gallery shell.
The selector offers the shell (`top`) and the visible example, as in DevTools.
Changing the visible example selects it; choosing the shell manually leaves that
example visible. On Introduction the shell remains inspectable. Hidden examples
retain their connections and breakpoints until reload or palette close.
Close updates the footer; no shortcut or persisted open preference is assigned.

The shell and example bundles resolve the tool's core imports to their own running
Gramlot, Data Bag and SourceHandler builder constructors, without another core.
Each registered frame announces readiness; the shell validates the sending window
and transfers a dedicated MessagePort. The agent in that frame owns the real Bags,
executes edits and evaluates breakpoints. The single palette displays passive Bag
copies through `InspectorConnection`; its private UI never enters the inspected
Source. The channel contract is in §040.

The gallery owns the connections: closing disconnects all agents; reloading a frame
replaces its connection. Frame Source disposal releases listeners and the agent.
Python, Node and direct-file serverless use these same gallery assets. No adapter
implementation, automatic core import or extra CSS URL is required.


<a id="gc-195-025"></a>

## 025 · Property editing and path breakpoints

Block ID: **GC-195-025**. Owner correction: constitution 11.61, 2026-10-14.

The selected node's editor sits below the tree. Its fields and draft live in Source
and the inspector's own Data Bag; named Logic applies edits through `setValue` and
`setAttr`. Leaving a row or pressing Enter validates the draft before writing.
Escape reloads the snapshot. Existing property names and types are fixed; only new
attributes expose a name and type field. The + button adds a row; the trash icon
removes a scalar attribute. There are no Apply/Revert form buttons.
A changed/removed node blocks stale drafts. Unedited values retain their identity.
There is no multi-operation transaction: a runtime error during application is
reported, and Escape reloads any already accepted changes.

Editable scalar types are string, finite number, safe integer, boolean, null and
Date values (native date/time/datetime inputs interpreted in UTC). A second
Backspace in an empty cell sets null; in a boolean cell Backspace sets null.
The current editor does not edit Decimal or other object types, arrays, Bag branches,
resolver-backed values or `_meta`. Unsupported scalar/object values are read-only;
Bag value rows and `_meta` rows are omitted and their values preserved. It can add
and remove scalar attributes, preserving null attributes and schema metadata.
Typing an invalid value never silently coerces it or writes another valid draft cell.

For local targets, breakpoint configuration lives in the tool's Data Bag; connected targets use the owning agent (§040). An exact Data or Source path
can pause (`debugger`) or log (`console`) on value/attribute changes, insertion or
deletion. Checks run synchronously in the target Bag subscription, before queued UI
refreshes, retaining the writer on the debugger stack. Structural events use the
parent path plus each affected node label; Bag's documented null root-deletion path
means the empty parent path. The dot on a tree row opens that path’s breakpoint
dialog without changing selection. The left gutter shows a grey outlined circle on hover or keyboard focus when no breakpoint is set. Active breakpoints remain visible: red without a condition, yellow with a condition. The Properties
header counter opens a removable list, including paths whose node was deleted;
the selected path’s hit count appears above its grid.

Optional conditions receive `evt`, `node`, `value`, `oldvalue`, `attrs_diff`, `reason`
and `path`, matching DevTools. They are explicitly authored JavaScript expressions,
compiled in the inspected page's realm under its CSP. Compilation failure leaves
the previous configuration intact; evaluation errors are reported without aborting
the target write. With strict CSP, unconditional breakpoints and all editor features
remain available; blocked conditions are not bypassed or silently ignored.

For the local `.gramlot` API, closing or retargeting unsubscribes and clears breakpoints. Connected targets follow §040: selector changes retain page-specific breakpoints. Conditions, configuration and editor state are not persisted. Pausing needs the browser debugger; the palette
cannot provide resume, stepping or privileged browser APIs. No extension dependency
or general component framework is introduced. Coverage includes real Chromium
Debugger pause/resume with the writer frame present, and Chromium/WebKit editing,
console hits and strict-CSP condition rejection. WebKit does not qualify Safari.


<a id="gc-195-030"></a>

## 030 · Generic declaration and provisional tree

Block ID: **GC-195-030**. Development work under constitution 11.62. The owner
accepted proceeding after the first-tree review with "ok" on 2026-10-14. The full
composition now replaces the previously rejected gallery palette; final owner
visual acceptance remains separate from implementation and verification.

`pane.webcomponent(code="gramlot-poc-tree")` is inert Python authoring. JavaScript
uses `pane.webcomponent({code: 'gramlot-poc-tree'})`. The node keeps its Source tag
`webcomponent`; Python/JS static rendering and browser rendering emit the custom
element named by `code`, consume `code`, and retain ordinary child Source and
scalar-attribute binding. Code is required and literal, never a pointer/expression.
The implementation validates custom-element names, including rejecting reserved
names, before emitting markup. The browser module is explicitly registered by its
consumer; no name-to-module lookup or automatic import is provided.

The native HTML child catalogue cannot list application-defined elements.
`webcomponent` is exempt from that catalogue through the builder's dialect
containment extension; other native HTML containment checks remain in force.
Placement of a custom element is the author's responsibility. This is not a
static Builder `component` expansion and does not set its `_meta.component` flag.

The provisional implementation is confined to `tools/poc/` and imports Bag from the
consumer's `@gramlot/gramlot`. The first tree contract is:

- `storeBag`: the actual Bag or null, assigned explicitly by tool JavaScript.
  Replacing it clears selection/expansion and moves the subscription.
- `selectedPath`: relative Bag path or null. Click/keyboard selection dispatches
  `change`, with `{path, node}`; named Logic receives it via `connect_onchange`.
  Removing the selected path clears it and notifies the consumer.
- `rowActions`: PoC `{id, label, icon}` declarations, with optional `activePaths` and `conditionalPaths`,
  emitting `tree-action` with `{action, path, node}`. Named Logic opens the
  breakpoint dialog for that path; active-path metadata survives refreshes and keeps the indicator visible; conditional paths use yellow.
- Rows display node labels only. Open branches and selection survive updates. Bag event bursts are rendered once per microtask; disconnect cancels a queued redraw.
  Resolver values are inspected without running them. Cyclic Bags are rejected.
- Disconnect releases all Bag event subscriptions with `unsubscribe(id, {any:true})`;
  reconnect restores one subscription. Instances do not share selection or stores.

This transfers only the inspector subset of the PoC tree/CSS, excluding database
relations, navigation, favorites, resolver loading, WidgetLabel and the PoC
Application, renderer and registry. It does not add generic object-property binding.
See [PORT-0006](../../ports/PORT-0006-inspector-components/README.md).

The proof is `tools/poc/tree-fixture.py` plus the browser fixture in
`tools/gramlot-tools-inspector/tests/poc-tree-browser.mjs`. Its surrounding tabs and
path display are a test fixture, not the completed inspector. Run the tool's
`npm test`, then `node tests/poc-tree-browser.mjs` from its directory. The build
emits a separate tree fixture artifact; the optional inspector entry bundles the
four provisional components and leaves the core external.

<a id="gc-195-035"></a>

## 035 · Completed composition and replacement boundary

Block ID: **GC-195-035**.

The inspector declares four provisional components through `webcomponent`:

- `gramlot-poc-palette`: light floating shell, title/close, pointer and keyboard
  movement/resizing, collapse to the title bar and restore via `collapsed`. Slotted Source supplies its contents and remains connected while hidden. Size, selection and breakpoints survive collapse. The title is left-aligned, with collapse and close on the right; header and tabs use compact 11px text. No persistence,
  WidgetLabel, application discovery or PoC runtime.
- `gramlot-poc-tabs`: compact underline tabs. Source owns button labels, selection
  and handlers; the component supplies appearance and arrow/Home/End navigation.
- `gramlot-poc-splitter`: one vertical split, `top`/`bottom` slots, pointer resizing
  and a keyboard-accessible separator. No general layout manager.
- `gramlot-poc-tree`: the Bag contract in §030, used for Data and Source.

The properties grid, breakpoint dialogs/list and path footer remain Source and
named Logic in `gramlot-tools-inspector`; they do not introduce another generic
component. Cell edits preserve focus when moving between existing rows. Existing
scalar coverage is retained; Decimal/object editing is still outside this tool’s
implemented contract, so this is not a claim of complete DevTools API parity.

Replace provisional components individually against these contracts. The target
runtime, Python declarations and public `webcomponent(code=...)` vocabulary need
not change when an implementation is replaced. Qualification is recorded in
GC-070 §780 and PORT-0006. Branded Safari qualification and final owner visual
acceptance are distinct from the tested WebKit engine and implementation checks.
No package release, deployment, dependency-source change or Chrome extension change
is part of this work.

<a id="gc-195-040"></a>

## 040 · Explicit page connection

Block ID: **GC-195-040**. Owner confirmation, 2026-10-14:
"Sì, palette unica e collegamento completo" (constitution 11.62 extension).

`attachInspectorAgent(gramlot, port)` binds one live instance to an explicitly
transferred MessagePort. `new InspectorConnection(port)` exposes passive `data`
and `source` Bag copies, connection state, errors and breakpoint records.
The palette's `targets` accepts unique `{id, title, connection}` records;
`selectedTarget` chooses an offered id. The existing `.gramlot` local API remains
for an explicitly supplied same-realm instance. There is no automatic frame discovery.

Snapshots read cached values only and omit `_meta`. Supported scalar values use
TYTX inside the descriptor protocol to preserve types across realms. Bag branches
are structural descriptors; unsupported objects are read-only display descriptors,
never editable substitutes. The copies are not renderer Source input. Stable agent
node identities preserve panel selection across ordinary updates.

An edit carries the node identity, revision and only the changed scalar value or
attribute patches. The agent checks identity/revision and validates all patches
before writing through the real node. Unedited objects, Dates, null attributes and
schema metadata retain their original identity. Replies acknowledge real writes;
there is no optimistic mutation of the inspected page. Concurrent changes reject
a stale draft. Runtime errors during application are reported, not rolled back.

Breakpoint configuration and synchronous checks live in the owning page's agent.
Conditions compile under that page's CSP, and debugger pauses retain the actual
writer stack. Switching the selector does not move or clear another page's
breakpoints. Closing the gallery palette or reloading the target releases them.
Snapshots/commands travel only over the explicitly transferred ports, including
opaque-origin file previews; window messages are limited to readiness/connection
and checked against the registered frame's WindowProxy.

Qualification includes a core-only opaque-origin iframe fixture, typed snapshots,
revision conflicts, metadata/identity preservation, agent disposal, Data/Source
editing, target CSP and synchronous writer-stack checks. Integrated gallery
results are recorded in GC-070; core tests do not depend on gallery repositories.
