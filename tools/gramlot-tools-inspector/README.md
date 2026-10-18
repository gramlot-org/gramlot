# gramlot-tools-inspector

Optional in-page inspector for a live Gramlot instance. It opens a movable,
resizable palette with Data and Source trees, Styles, a property editor and path breakpoints.
The Chrome DevTools extension imports this same component with `embedded` presentation.
It remains a specific tool, separate from Gramlot's future general component architecture.

Build and test from the repository root:

```sh
npm install --prefix js --package-lock=false
npm install --prefix tools/gramlot-tools-inspector --package-lock=false
npm run build --prefix tools/gramlot-tools-inspector
npm test --prefix tools/gramlot-tools-inspector
npm run test:browser --prefix tools/gramlot-tools-inspector
```

Browser checks need the Playwright Chromium, Firefox and WebKit installations.
To run a named engine, append `-- chromium`, `-- firefox` or `-- webkit`.

The build produces one JS module with its styles embedded. It imports `@gramlot/gramlot`:
map that name to **the exact runtime URL already used by the page**, so the page
and tool share the same classes. Do not bundle a second core into the tool.
The core npm package ships the optional `@gramlot/gramlot/tools/inspector` entry.
Its runtime entry never imports the tool.

In the host HTML/bootstrap, after registering the module:

```html
<gramlot-tools-inspector id="inspector"></gramlot-tools-inspector>
```

```js
import '@gramlot/gramlot/tools/inspector';
document.getElementById('inspector').gramlot = window.gramlot;
```

The boolean `docked` attribute switches an existing floating inspector to fill
its parent's height, without a title bar, collapse control or resize grip. It is
dynamic: removing it restores floating presentation. The parent must provide a
height. Use `hidden` to suspend its presentation without detaching the component;
selection, connections and live updates remain. The gallery uses this for its
separate mobile Inspector view. This differs from `embedded`, which chooses the
initial DevTools structure when the component connects.

A bundler or import map must resolve the optional package entry.
Assign the instance explicitly once it exists; the component does not discover
frames or read a global automatically. Assign `null` to detach the target. Close
removes the component and emits `close`; reattaching that element recreates its UI and subscriptions.

The left-aligned title bar moves by dragging or arrow keys; Home returns it to the upper left.
Use the right −/+ button beside Close to collapse/expand the palette. Its size, selection and
breakpoints are retained, and live updates continue while collapsed.
The lower-right corner resizes it. Use the disclosure arrows to collapse branches
and click a node to edit its value and attributes in the panel below the tree.
The Properties grid saves when you leave a row or press Enter; Escape reloads
the selected node. The + button adds an attribute and the row’s trash icon removes
it. Existing property names and types stay fixed. Drag the divider to resize the
tree and properties areas, or focus it and use the arrow keys.
An external change blocks an old draft rather than overwriting it.

The scalar editor supports strings, finite numbers, safe integers, booleans, null,
and dates/times/datetimes in UTC. Native date/time controls are interpreted in UTC. Bag branches,
arrays, other objects (including Decimal), resolver values and `_meta` remain
preserved; unsupported values are read-only, Bag value rows and `_meta` are omitted. Inspection never executes deferred resolvers. Attribute edits can add,
remove scalar attributes; null attributes are preserved.

Click the dot beside a Data/Source node to choose Debugger or Console for that
path. On the left, an inactive grey outlined circle appears on hover or keyboard focus.
Active breakpoints stay visible: red without a condition, yellow with one; the Properties
counter opens the active list,
including breakpoints on deleted nodes.
Conditions are optional JavaScript expressions over `evt`, `node`, `value`,
`oldvalue`, `attrs_diff`, `reason` and `path`. Compilation obeys the page CSP;
blocked/invalid conditions are reported and do not replace an existing breakpoint.
Console mode logs the event; Debugger pauses through the browser developer tools,
with the Bag writer still on the stack. The palette is not a browser debugger:
resume, stepping and call-stack inspection remain in those developer tools.
Breakpoints match exact paths, report hit counts and can be removed individually.
For a local `.gramlot` target, closing or retargeting releases subscriptions and clears breakpoints.

The gallery footer opens one palette in the shell. Its selector offers the shell
and the visible example, follows gallery tab changes and works on Introduction.
Read/edit/breakpoint commands use dedicated MessagePorts to explicitly registered
pages; `attachInspectorAgent` runs in each target and `InspectorConnection` keeps
passive panel copies. Set `targets` to `{id, title, connection}` records and
`selectedTarget` to one offered id. Conditions and debugger execution remain in
the inspected page. The gallery closes connections on palette close and replaces
them on frame reload; switching targets preserves page-specific breakpoints.

Python, Node and direct-file serverless share this integration. No shortcut is
assigned. Run `node tests/bridge-browser.mjs` for the independent opaque-frame
fixture (Chromium and WebKit). See GC-070 for integrated checks; WebKit does not
qualify branded Safari.

Architecture, qualification and remaining limits:
[GC-195](../../docs/internal/195-tools-inspector.md#gc-195-005).


## CSS variables

Open **Styles** to edit the selected document's `--gramlot-*` root variables.
Use the colour picker or enter CSS text and press Enter/leave the field. Changes
preview immediately; reset one row or **Reset all** to reveal the current theme.
**Refresh** reloads values after external theme changes. Escape discards the field
draft. The preview is temporary: local close/retarget clears it; with connected
pages it remains until that page connection closes. **Download CSS** saves only the applied overrides as `theme-overrides.css`;
load it after the theme stylesheet. Expressions and preview `!important` priorities
are retained. The link is unavailable without changes or during pending operations.
No endpoint is needed.

Native pickers cover hexadecimal RGB values; other CSS values remain editable as
text. The computed value appears in the field tooltip. The usual cascade still
applies to descendant or inline-important overrides. Only root variables are
shown; theme selection, element styling and persistence are deferred.

Run `node tools/gramlot-tools-inspector/tests/styles-browser.mjs` from the repository
root for Chromium/WebKit checks, or append `--serve` to open the local Source-based
fixture interactively at the printed URL. Stop the fixture server when finished.


## Embedded DevTools presentation

Set `embedded` before attaching the element to fill its parent panel without the
movable palette. Supply explicit `targets` connections as above; the component
still owns every Data/Source/Styles interaction. Chrome discovery and routing
remain in `gramlot-devtools`, which imports this tool rather than copying it.

The optional `@gramlot/gramlot/tools/inspector-agent` entry exports the same
`attachInspectorAgent` without a runtime dependency, for page-side injection.
It uses the target's own Bag class. The panel imports `InspectorConnection` from
`tools/inspector` and adapts Chrome messages to its MessagePort. No extension
code or discovery hook is added to the core runtime.


## Source structure and Undo/Redo

Hover or focus a Source row: **+** adds a child through a dialog (HTML tag or installed
widget/container); **−** removes the whole branch. The root is protected. Drag onto
the middle of a row to reparent, or its top/bottom edge to reorder. The outline/line
shows the drop position. Data has no structural controls.

**Undo / Redo** reverse Source/Data value and attribute edits and every structural
operation above. Ctrl/Cmd-Z and Shift-Ctrl/Cmd-Z or Ctrl/Cmd-Y work outside editable
fields. Undo restores a deleted subtree and its original position. External changes
that conflict with the recorded operation are reported instead of overwritten.
Reparenting can recreate rendered components; controller/network side effects are
not rolled back. Edits are live runtime changes, not saved Python definitions.

History clears when a local target is detached or a page connection closes; connected
targets retain their own history when switching the selector. Breakpoints and Styles
retain their separate configuration/reset lifecycle. See GC-195 §055 for details.
Run `node tools/gramlot-tools-inspector/tests/structure-browser.mjs` for the complete
Source editing sequence in Chromium/WebKit, both local and over a MessagePort.
