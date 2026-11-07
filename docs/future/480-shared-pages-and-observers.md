# 480 · Shared pages and observers

Document ID: **GC-480**. Updated: **2026-11-07**. Status: **design notes for discussion; nothing decided, nothing implemented**.

Owner question, 2026-11-07: can user X share a page, or a part of it, with user Y
through data binding, with server-to-client changes sent to several pages and
changes received from several pages, like the legacy shared objects?

This document collects the facts found in the legacy source and in the current
Gramlot code, and the questions they raise. The earlier legacy investigation is
in [GC-070](../internal/070-work-status.md) ("Legacy shared objects
investigation", 2026-10-27) together with the owner's proposal of the same date
to use the same mechanism for ordinary per-page state.

<a id="gc-480-010"></a>
## 010 · What Gramlot already has

`PageStore` (`src/gramlot/page/page_store.py`) holds one server Bag per page ID.

- `subscribe(binder_id, path, send)` registers a client binder on a server path.
- `_snapshot(binder_id, path)` gives the subscriber the current content of its branch.
- `change(binder_id, message)` applies a client change to the server Bag.
- `_on_change` sends every Bag change to all subscribers whose path intersects the
  changed path (`_intersects`). The originating binder receives no echo.

The client side is `DataBinder` (`js/src/binding/data-binder.js`) over the page's
WebSocket connection (`js/src/page-store-connection.js`). A binder links a client
Data path (`destination_path`) to a literal server path (`server_path`) in both
directions: `receive()` sends local changes with `op: 'change'`.

The fan-out to N subscribers and the reception from N senders already exist.
The missing piece is identity: a `PageStore` belongs to one page ID. Sharing
requires a store identified independently of any page, so that binders of
different pages, and of different users, subscribe to the same store. Legacy
used `shared_id` for this. In Gramlot `shared_id` is currently an excluded
declaration that raises an error ([GC-095 §085](../public/097-data-binding.md#gc-095-085)).

Sharing a part of a page needs no extra concept: a binder subscribes to a branch
(`path`), not to the whole page.

<a id="gc-480-020"></a>
## 020 · Legacy facts

Source: `gnrpy/gnr/web/gnrasync.py` (`SharedObject`) and
`gnrjs/gnr_d11/js/gnrsharedobjects.js` (`GnrSharedObjectHandler`), current
asyncio version and historical Tornado version `b5ffa9fa`.

### 021 · Join, changes, persistence

- `subscribe` returns `dict(privilege=privilege, data=self.data)`: the whole
  current Bag. A page that joins later receives the current state, then new
  changes only.
- `datachange` applies `setItem`/`popNode` to the central Bag;
  `_on_data_trigger` broadcasts the change. The event is not stored afterwards.
  Only `self.changes = True` remains, used by `autoSave`.
- No event log exists. No undo/redo exists.
- Versions exist only for database persistence: `sql_save` with
  `dbSaveKw['backup']=N` keeps the last N full copies (`v_0`, `v_1`, … with
  timestamp); `sql_load(version=…)` reloads one. Copies are taken at each save,
  not at each event.
- `SharedLogger` only writes debug lines for init, subscribe and unsubscribe.
- Permissions: `read_tags`/`write_tags` select forbidden, readonly or readwrite
  at subscription only. `datachange` does not recheck them.
- Concurrency: one `asyncio.Lock` per object serializes `datachange`, save and
  load. No version check, no conflict resolution.

### 022 · Focus lock

- Client: capture-phase `focus`/`blur` listeners on `window` compute the path of
  the focused widget's `value`. When the path is under the shared object, the
  client sends `som.onPathFocus` with `focused: true|false`.
- Server: `onPathFocus` stores `focusedPaths[curr_path] = page_id` and
  broadcasts `som.onPathLock` (`locked`, `lock_path`) to the other pages.
- Receiving client: `do_onPathLock` walks the Source for the node whose `value`
  equals `lock_path` and calls `setDisabled(locked)`.

Defects visible in the code:

1. `datachange` does not read `focusedPaths`. A write to a locked path through
   the WebSocket is accepted. The lock exists only in the UI.
2. `do_onPathLock` reads `user` from the message; the server does not send it.
   The UI cannot tell who holds the lock.
3. `subscribe` does not return `focusedPaths`. A page that joins later does not
   see the existing locks.
4. `unsubscribe` neither clears `focusedPaths` nor broadcasts an unlock. A page
   closed without `blur` leaves the field disabled for the others.
5. The `walk` returns the first matching node. With two widgets on the same
   path, only the first is disabled.
6. The lock matches one exact path. A widget bound to a parent or child path is
   not locked.

<a id="gc-480-030"></a>
## 030 · Porting the focus lock

Points required to port the lock without the defects of §022:

1. The shared store records each lock by path, with the binder and the user that hold it.
2. `change()` refuses writes to a path locked by another binder. The lock is enforced on the server.
3. Path comparison uses `_intersects`: a lock on `a.b` also covers `a` and `a.b.c`.
4. `subscribe` returns the current locks together with the snapshot.
5. `unsubscribe` and `close` release the binder's locks and broadcast the unlock.
6. The client disables every node bound to the locked path, not only the first.
7. The lock message carries the user.

<a id="gc-480-040"></a>
## 040 · Freeze — open

Owner request, 2026-11-07: include a freeze.

In Gramlot `freeze` already exists with another meaning:
`app.src.renderer.freeze(node)` suspends structural rebuilding of a branch while
bindings keep reacting ([Writing pages §030](../public/095-writing-pages.md#gc-095-030)). In the
sharing context two meanings are possible:

- **a.** A user freezes a whole shared branch: nobody else can modify it until
  it is released. This is an explicit lock, not tied to focus; the lock registry
  of §030 covers it with a wider path and a different duration.
- **b.** A user suspends reception of the others' changes on their own view and
  receives them all at release.

Open: which meaning is intended. Using the word `freeze` for (a) overlaps the
renderer's `freeze`.

<a id="gc-480-050"></a>
## 050 · RPC results that depend on the caller

The result of an RPC depends on who calls it: user, permissions, locale, time
zone, `dbenv`, time of the call. If X and Y run the same RPC and write the
result into the shared branch, the last writer overwrites the other and the
state depends on arrival order.

Proposed rule, not decided: **each shared path has a single computing party.**

1. A shared value derived from an RPC is computed once, on the server, by the
   shared store: a `dataController`/`dataFormula` declared in its `main()`. The
   result reaches the participants as an ordinary change.
2. Clients do not write their own RPC results into the shared branch. A
   personal result goes into a non-shared branch of the user's page.
3. The shared store runs RPCs with an identity fixed when the store is created:
   the owner (X) or a service identity. Never the identity of whoever triggered
   the event.

The rule requires server-side execution of controllers and formulas, which
GC-070 (2026-10-27) records as a separate open design decision.

<a id="gc-480-060"></a>
## 060 · Observer as the first step

Owner proposal, 2026-11-07: start with sharing as an observer. The guest sees
the whole page of the host, or only the shared branch, entirely read-only: no
RPC, no formulas run, no entry into widgets, no button presses.

The guest receives Data already computed by the host and executes nothing. The
lock (§030) and caller-dependent RPC (§050) problems do not arise. Requirements
in terms of the current code:

1. **One direction.** `DataBinder.receive()` sends local changes. The guest needs
   a binder that receives and never sends. The server refuses any `change` from
   an observer binder; the client is not trusted.
2. **No execution in the guest page.** The guest runtime applies Data to the DOM
   without activating `dataController`, `dataFormula` and `dataRpc`. Otherwise it
   would run them again with its own identity.
3. **No interaction.** The standard HTML `inert` attribute on the root of the
   shared area blocks focus, clicks and input on all descendants. Widgets and
   buttons stay visible and do not respond.
4. **Shared branch.** The shared store holds the branch. The host subscribes
   read-write, the guest read-only, receiving the snapshot then the changes.
   This case uses mostly existing parts (§010).
5. **Whole page.** Two parts are missing today:
   - The host's whole Data must reach the server. Today only branches linked
     with `dataBinder` and `server_path` do. Full server synchronisation of Data
     is listed among the legacy features not provided
     ([GC-095 §085](../public/097-data-binding.md#gc-095-085)).
   - The guest needs the host's Source. A guest that rebuilds the page with its
     own recipe can obtain a different Source, since Source depends on user,
     permissions and locale. The alternative is to send the host's Source; the
     protocol already distinguishes `gramlot-content-type: data|source`.
6. **Not transmitted.** State that is neither in Data nor in Source does not
   reach the guest: scroll position, open tab, selected row, text being typed in
   an input not yet written to Data. To show it, it must be put in Data.

<a id="gc-480-070"></a>
## 070 · Invitation with collaboration

Owner request, 2026-11-07: an invitation where the guest collaborates instead of
observing. The points below are proposals, not decisions.

1. **Legacy fact to avoid.** A legacy client receives shared changes with reason
   `serverChange`, and its local bindings and controllers still react. With two
   participants the same formula or RPC runs twice, with two identities (§050).
2. **One executor.** Two options:
   - **a. The server.** The shared store runs controllers, formulas and RPCs
     (§050). It keeps working when the host leaves. It requires server-side
     execution, still an open decision.
   - **b. The host's page.** Guests write inputs only; the host computes and the
     result reaches everybody. No server-side execution needed. It stops when
     the host closes the page.

   Recommended: (a), because (b) ties shared state to the host's presence. In
   both cases collaborator clients run no controllers on the shared branch.
3. **Inputs and derived values.** Paths written by the executor's formulas and
   controllers are derived. The server refuses client writes to derived paths.
   Clients write inputs only.
4. **Conflicts.** The server serializes writes in arrival order. The focus lock
   (§030) prevents two people from editing the same field. Without a lock, the
   last write wins.
5. **Buttons.** A button pressed by a collaborator declares where its action runs:
   - acting on the shared branch: on the executor, with the store's identity;
   - personal: in the presser's page, writing to a non-shared branch.
6. **Permissions per participant.** Each subscription has a privilege: observer =
   read-only, collaborator = read-write, possibly per branch. The server checks it
   on every `change`, not only at subscription (legacy defect, §021).
7. **Invitation.** A token bound to store, privilege and expiry. The guest must be
   authenticated. The host can revoke the invitation; the server then closes the
   guest's subscriptions.
8. **Presence.** List of connected participants; each lock carries its user.
9. **Late join and leave.** A joining participant receives snapshot and current
   locks. A leaving participant releases its locks. The host's departure matters
   only in option (b).

<a id="gc-480-090"></a>
## 090 · Open questions

1. Identity of a shared store: name, who creates it, who may subscribe.
2. Meaning of freeze (§040).
3. Execution identity of RPCs run by a shared store (§050).
4. Lifecycle: expiry with no subscribers, persistence (legacy `expire`,
   `autoSave`/`autoLoad`).
5. Observer scope for the first step: shared branch only, or whole page (§060.4–5).
6. Event log: not present in legacy; whether undo/redo or replay is wanted.
7. Collaboration executor: server or host page (§070.2).
8. How a button declares where its action runs (§070.5).
