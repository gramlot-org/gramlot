# 250 · Shared WebSocket PageStore proof of concept

Document ID: **GC-250**.

<a id="gc-250-005"></a>

## 005 · Scope and status

Block ID: **GC-250-005**.

Experimental branch implementation, not a released API. Owner decisions and
confirming words are recorded in GC-070 §1615 and the constitution's shared
WebSocket amendment. The Uvicorn trial now includes iframe and opened-window
descendants sharing the primary page's socket, including asynchronous RPC.
Kajenn and a distributed store service remain later work.

The serving module declares two separate classes: Page builds browser Source;
PageStore builds a server recipe in its own main(root). A new PageStore instance
belongs to each pageId, even when two pages share the same owner cookie.
The generic Gramlot server owns the recipe and Bag lifecycle; the Uvicorn adapter
owns the ASGI socket, authentication context and message delivery.

<a id="gc-250-010"></a>

## 010 · Authoring

Block ID: **GC-250-010**.

```python
from gramlot import Page as BasePage, PageStore as BasePageStore

class Page(BasePage):
    def main(self, root):
        pane = root.div(datapath="view")
        pane.dataBinder(".order", "order")
        pane.dataBinder(".mirror", "order")
        pane.input(value="^.order.quantity")

class PageStore(BasePageStore):
    def main(self, root):
        root.dataController(func="calculate", quantity="^order.quantity")

    def calculate(self, node, quantity):
        self.data.set_item("order.total", int(quantity) * 10)
```

The complete runnable fixture lives in gramlot-py-server at
tests/fixtures/page_store/index.py, including input validation. The spelling
dataBinder is the Source grammar tag in both languages, like dataController.
JavaScript authoring uses the existing attributes-object convention:
pane.dataBinder({destination_path: '.order', server_path: 'order'}).

Declaring a PageStore subclass in the Page module automatically activates its
GramlotBuilder server runtime when the page opens, even without a WebSocket
or any binder. Ordinary Page construction remains inert: its declarations
are still executed in the browser. Closing a PageStore releases its runtime.

The runtime supports initial dataSetter declarations, synchronous named
dataController methods (the recipe Source node plus bound keyword arguments),
and synchronous named dataFormula methods (bound keyword arguments, returned
value written to result_path). A ^ pointer registers a reactive dependency;
an = pointer is read fresh when a method runs. _onStart=True invokes the
method at initialization. _userChanges=True accepts only direct node triggers.
These two controls require literal booleans.

Controllers and formulas can explicitly accept _node, _reason and _triggerpars
as keyword parameters (or receive them through **kwargs):

```python
def calculate(self, node, quantity, *, _reason, _triggerpars):
    change = _triggerpars["kw"]
    # node is the recipe Source node; change.node is the changed Data node.
    # _reason is node/child/container; change.reason is the write's origin.
    self.data.set_item("order.total", int(quantity) * 10)
```

_node is the changed Data node. _triggerpars contains kw (a DataChange) and
trigger_reason (the same level as _reason). DataChange carries path, evt,
reason, fired, oldvalue, attrs_diff, value, attr, index, level and registration.
The registration identifies the Source node, authored parameter, watched path
and optional attribute. At _onStart, _node and kw are None and _reason is start.
Only reserved context fields are selected by callable signature; unknown
authored arguments still raise ordinary Python errors.

Routing follows the current browser contract: node for the exact dependency,
child for a descendant mutation, container for an ancestor mutation. Value
dependencies ignore attribute-only events; ?attr dependencies react only to
that attribute's changes or insertion/deletion/ancestor replacement. A local
fired event is not propagated to value dependencies at child level; fired
delivery over the binder protocol remains unsupported. Each matching
dependency receives its own context, so overlapping dependencies on one
provider can cause multiple executions, as in the browser runtime.

Data events are collected from Bag.subscribe and drained in order. Controller
writes enqueue subsequent events rather than recursively replacing the active
trigger context. Event value/attribute/oldvalue/diff data are captured when the
event arrives; live parameters are read when its provider executes. The Data
node reference remains the actual node, not a copied substitute.

This is a fixed, top-level server recipe: dynamic Source rebinding, inline
browser code, Source self-topic subscriptions, timers, async methods and server
dataRpc/dataResolver execution are not implemented. Unsupported provider
controls fail explicitly. There is no transaction rollback or cycle detector.
The runtime uses current Source and Data classes; it does not restore the old
BuiltBag layer or modify generic Builder/Bag dependencies.

<a id="gc-250-015"></a>

## 015 · Synchronization and lifetime

Block ID: **GC-250-015**.

Enable the Uvicorn trial with create_application(pages, websocket=True).
The optional bootstrap websocketUrl points to /gramlot/store below the mount
prefix. The default browser adapter selects WebSocketTransport when this channel
is configured, otherwise HttpTransport. The HTTP endpoints retain their contracts;
the HTTP close notification also releases pages whose channel never attached.
RPC never falls back to HTTP or retries after disconnect.

A binder has a unique subscription ID for each registration. It subscribes to
its literal server_path and maps relative changes onto destination_path resolved
through the SourceNode's client datapath. Source removal unsubscribes; rebind
uses a new ID and ignores deliveries from the former registration.

Registration synchronously queues a typed Bag snapshot before subsequent
changes. That snapshot supplies the initial client content. Client changes
before receipt of the initial snapshot are not sent. After initialization,
insert/value/attribute/delete changes flow in both directions. Attribute-only
changes retain the receiving side's current value. Replacing or deleting an
ancestor refreshes the affected subscribed branch. Bag values and node attributes
use TYTX; index is carried for insertions.

The server excludes only the sending binder from the original write's delivery.
Other subscribers, including those on the same page, receive it. A server
controller's writes are new changes and can return to the original binder.
Client application of incoming changes carries a remote reason that suppresses
direct retransmission; writes generated by local controllers remain new changes.
Overlapping bindings are allowed; this PoC supplies no general cycle detection,
deduplication, transactions or exactly-once side effects.

The Uvicorn adapter checks same-origin handshake, owner cookie and primary
pageId before accepting the socket. Every additional page must attach under
the same authenticated owner; a page cannot join two sockets. Binder IDs are
scoped to the attached page. Messages cannot select an unattached page or an
unregistered binder. No login system is introduced. A bounded outgoing queue
closes a channel if its client cannot keep up. Registration and changes run
sequentially on one event loop; controller functions must not block it.

Socket disconnect closes all attached pages and stores, extending the first
trial's GC-230 §305 lifetime. Explicit page close, expiration and server shutdown
also dispose the store. There is no reconnect, replay, persistence, replacement
primary election or worker migration.

<a id="gc-250-017"></a>

## 017 · Parent and child channels

Block ID: **GC-250-017**.

PageStoreConnection opens a WebSocket only when the window has neither a parent
frame nor an opener. Otherwise it connects through that direct parent using
postMessage. Each intermediate page forwards both directions, retaining the
original pageId. dataBinder and dataRpc declarations do not change.

FrameMessages now owns one family registry and one gramlot:message protocol,
shared by publish/subscribe and the server channel. Each Gramlot has its direct
Gramlot children (Source-owned iframes and same-origin popups with a retained
opener), plus its direct parent. The internal gramlot._frames.children snapshot
contains those child records, including pageId, kind and readiness. It includes
neither unrelated tabs nor ordinary non-Gramlot windows.

The common hello/ready/close handshake owns session/recipient validation and
peer lifecycle. Its metadata separates page readiness (needed for publication)
from server-channel readiness (needed before the initial Source RPC). All data
uses kind=message, channel and one typed TYTX wire. publish carries topic and
payload; server carries the existing binder/RPC/lifecycle envelope.
PageStoreConnection has no independent window listener, peer registry, session,
handshake or lifecycle timer. Its routes map only server page IDs through
already registered direct children. It uses the common channel callbacks for
readiness and disconnection.

The server channel additionally requires an identical WebSocket endpoint and
same-origin peers. It does not support cross-origin or opaque sandboxed children, unrelated
tabs, or an embedding parent without the store channel. A child never silently
opens its own socket when that connection is unavailable. A link opening a
connected window uses target="_blank", rel="opener"; noopener intentionally
creates an independent primary.

The primary sends attach/detach for descendant page IDs over its socket.
Every server delivery includes pageId; each hop forwards it only along the
registered child route. Other siblings and the primary's own binders never
receive that page's data. Multiple bindings within a page continue to share its
server Bag. Sharing a socket does not share the pages' Bags.

Removing a Source iframe or closing a child detaches that entire branch and
closes its registered popup descendants, recursively. The same hierarchy and
closure work without any WebSocket. Closing the primary closes the entire
Gramlot family; ordinary non-Gramlot windows remain untouched.
Reloading a child creates a new page ID and new snapshots; it does not recover
the old store. Close notifications propagate down the tree; a 500ms lifecycle
check of window.closed catches parent/child contexts destroyed before their
last postMessage is delivered. Browsers may throttle this check in background
windows. The common family registry owns this check and removes its listeners
and timers on disposal. Actual popup closure uses window.close on registered
opener-linked windows; it is not a browser-tab management facility.
HTTP close beacons racing
detach do not close the primary's channel.

Run the existing serve_page_store.py script, then open /py/family. It declares
one direct iframe, an intermediate iframe with its own child, and connected
window links. The order page's link can also open a window from a descendant.
Each order starts at quantity 2; changing it updates that page's second binder
and server-calculated total independently of other orders.

The ordinary publication API also uses this connection: parent=true addresses
the frame parent or opener; iframe retains its HTML-ID/Source-reference selector.
pageId selects a registered direct Gramlot child, including a popup. This adds
no recursive broadcast or arbitrary-window addressing. Server channel loss
rejects pending RPCs but does not destroy the still-live publication connection;
window closure, rather than network failure, governs family lifetime.

<a id="gc-250-018"></a>

## 018 · RPC on the shared channel

Block ID: **GC-250-018**.

The owner requested RPC over the existing channel on 2026-10-27. This changes
transport selection, not application syntax or the two programming models:
dataBinder synchronizes Data; dataRpc awaits an endpoint outcome and writes its
result_path through the existing provider. Source requests, including main,
also use the same RpcHandler transport. An explicitly injected transport keeps
its existing precedence; transport=false still disables RPC.

For example, in Page.main:

```python
pane.input(value="^.customer_key")
pane.dataRpc("load_customer", result_path=".customer", pkey="^.customer_key")
```

The Page declares load_customer with @endpoint as before. A state-based
PageStore controller and binders remain an independent alternative.

An RPC is one unchanged TYTX request envelope with id, pageId, contentType,
name and params, without op. Its response carries id/contentType/value or
error, plus pageId for routing through parents. Binder and lifecycle messages
keep their op discriminator. Calls queued during connection setup are sent
only after the child's attach. Each logical page correlates its own calls by
id; responses may arrive out of order and binder deltas may interleave.

Uvicorn checks attached-page membership before dispatch, then invokes the same
GramlotServer.call used by HTTP. It preserves endpoint declaration checks,
authorization, typed outcomes and application errors. Up to 256 calls per
physical connection can be in flight; duplicate active (pageId, id) pairs or
malformed requests close the channel. Awaitable endpoints run concurrently;
synchronous endpoints still run on the event loop and must not block it.
Application errors are RPC error envelopes and leave the socket usable.

AbortSignal, provider timeout and node disposal reject the local request and
send op=cancel with pageId/id if already sent. Unsent calls are simply removed.
The server cooperatively cancels the matching task; it also cancels tasks for
detached pages and on disconnect. Cancellation cannot undo completed writes or
guarantee termination of code that blocks or suppresses cancellation. Late
responses are ignored. Disconnect rejects every pending call without replay.

There is no synchronous WebSocket RPC: supportsCallSync is false and an explicit
callSync fails. Existing providers that consult this capability use their async
path. HTTP remains available for pages without websocketUrl. No new browser
dependency, second physical socket, reconnect policy or server-side recipe
dataRpc implementation is introduced.

<a id="gc-250-019"></a>

## 019 · Publications to PageStore topics

Block ID: **GC-250-019**.

Owner-confirmed scope, 2026-10-27: server publications without a pageId target
the sender's PageStore; an explicit pageId can target another live store of the
same owner. This is process-local routing through the existing GramlotServer
registry, including stores served by different WebSockets. It is not a broker
or cross-owner permission mechanism.

```javascript
gramlot.publish({topic: 'set_quantity', server: true}, {quantity: '6'});
gramlot.publish({topic: 'set_quantity', server: true, pageId: otherPageId},
                {quantity: '8'});
```

server=true cannot be combined with parent, iframe or nodeId. Without server,
the existing pageId selector still addresses a direct browser child through
the family protocol. Server publication requires a configured, ready channel;
there is no HTTP fallback or startup queue. Like other publication descriptors,
it captures a typed payload before local delivery, invokes local subscribers,
then forwards. A local callback failure prevents forwarding. The target
PageStore's subscribers run locally there; delivery does not publish the topic
in that target's browser. Its Data changes reach the browser through binders.

The same family protocol carries an op=publish envelope through the primary
socket. pageId always identifies the verified sending page; optional
targetPageId selects the destination. topic is nonempty and payload is one
mapping of named data. Each publication has an id using the existing RPC
correlation mechanism. Uvicorn first checks
sender membership in the socket, then GramlotServer.prepare_publish verifies that both
the live sender and destination belong to the authenticated owner. It never
uses a client-supplied owner. An unknown, expired or foreign destination is
refused before any subscriber runs. The response goes to the sending page,
including through its parent chain, and contains id/contentType=data plus
value="ok" or error={code,name,message}, as for RPC. An invalid publication
payload, refused destination or subscriber exception affects only that message:
the shared socket, attached stores, binders and other pending calls remain live.
Malformed channel identity, missing correlation ids and transport failures are
still channel errors. The source pageId is never replaced by targetPageId.

Server-targeted Gramlot.publish returns a Promise resolving to "ok" on validation
and acceptance, or rejecting with RpcError if acceptance is refused. The adapter
sends this response before invoking the prepared subscribers. It uses the existing
pending-call map, not a second acknowledgement registry. Local/window
publications retain their synchronous behavior. An unknown topic succeeds
without retained delivery. No retries or rollback are implied.
There is no wait/nowait/sync flag. Subscriber failures after acceptance are logged
on the server and never become a second response. Controllers expose business
outcomes through Data and binders. They still execute synchronously on the event
loop, without worker threads: acceptance is not a promise of nonblocking execution
or of completion. Local subscribers still run before browser forwarding.

```javascript
try {
    await gramlot.publish({topic: 'load_customer', server: true}, {pkey: 27});
} catch (error) {
    // Acceptance was refused; other operations on the shared channel continue.
    console.error(error.code, error.message);
}
```

The PageStore recipe uses the existing subscription syntax:

```python
class PageStore(BasePageStore):
    def main(self, root):
        root.dataController(func="set_quantity", subscribe_set_quantity=True)

    def set_quantity(self, node, quantity):
        self.data.set_item("order.quantity", quantity)
```

Synchronous named controllers and formulas subscribe by attribute presence,
including a false value, as in the browser. One topic may have several
subscribers, run in recipe order; unknown topics do nothing. Payload fields
become keyword arguments; resolved declared parameters take precedence and
are read fresh for each invocation. Reserved context is computed by the
runtime: _node=None, _reason=topic, _triggerpars has kw=None and
trigger_reason=topic; _subscription_kwargs holds the original payload.
_subscription_metadata holds a separate mapping whose pageId is the validated
sending page for a server publication, including a child sharing the primary
socket. It is not the destination page ID. Payload fields cannot override this
reserved context, and each subscriber receives a fresh metadata mapping.
These optional context keywords follow the existing callable-signature rule.
_userChanges retains the browser filter: a topic other than node is skipped.

PageStore.publish(topic, payload, metadata=...) performs the same delivery locally;
omitting metadata supplies an empty mapping, including for nested publications.
It returns no controller result. All topic registrations exist before _onStart
providers run, and close removes them. Controller writes activate ordinary
Data dependencies and binder propagation. Local PageStore.publish exceptions
propagate; the adapter logs them after acceptance without rollback or channel
closure. The acknowledgement carries no controller result or database commit
guarantee. Applications still write their business outcomes into Data.

No topic retention, deduplication, replay, cross-process routing, dynamic
subscription rebinding, Source self-topics, asynchronous Python providers or
new server-to-browser topic push API is included. The existing PageStore
subscribe/unsubscribe methods remain the binder transport registration API;
topic subscriptions in this increment are declarative recipe attributes.

<a id="gc-250-020"></a>

## 020 · Verification and published dependency correction

Block ID: **GC-250-020**.

Bag JS popNode passed reason as the third argument of _onNodeDeleted, whose
third argument is pathlist. The owning repository now passes null in that slot
and reason fourth. Six regression cases cover popNode/pop/delItem at root and
nested paths; all 793 Bag tests pass.

The owner explicitly authorized this bounded correction and its publication on
2026-10-27. [Bag JS 0.11.1](https://github.com/genro-org/genro-bag-js/releases/tag/v0.11.1)
is published on npm and JSR; both trusted publishing jobs succeeded. Gramlot
requires @genrojs/bag >=0.11.1 and uses the registry package. No installed source
patch or local dependency substitution is needed.

From gramlot-py-server with both local Python packages installed:

```sh
python scripts/serve_page_store.py 8765
# Open http://127.0.0.1:8765/py/
node scripts/verify_page_store.mjs /path/to/python /path/to/playwright/index.mjs chromium webkit
```

The browser check exercises initial snapshots, two binders, a Python controller,
a typed calculated result, insertion/deletion, declarative WebSocket RPC and disposal.
It also verifies reverse-order RPC completion, application errors, cancellation,
and RPC from a nested popup, with no HTTP RPC request throughout either scenario.
Unit and ASGI contracts cover owner isolation, mounted routing, subscription
identity, overlapping server paths, origin exclusion, Source disposal and rebind.
Verification counts and pre-existing adapter baseline failures are recorded in
GC-070 §1615. This PoC is not a claim of full server recipe or adapter parity.



Server-to-browser topics (owner-approved extension, 2026-10-27):

```python
self.publish("customer_loaded", {"pkey": pkey, "record": record},
             page_id=_subscription_metadata["pageId"])
```

An explicit page_id selects the browser page. Omission still publishes to the
current PageStore's recipe. The server verifies source and destination ownership
and requires a live registered channel; missing, expired, foreign or disconnected
destinations raise PageExpired. There is no offline queue or retry. The adapter
registers its send callback with connect_page_channel for the primary and each
attached child; page closure clears that registration. Core routes without any
ASGI or WebSocket dependency. A typed op=publish event carries recipient pageId,
topic and payload, without a correlation id. The existing family channel reaches
the target window, where the existing subscriptions service activates ordinary
subscribe_<topic> controllers. It does not forward the event back to the server.
Browser subscriber exceptions are logged without closing the channel. Server
publication returns after enqueueing, not after browser execution. Its event is
independent of the original acceptance and binder changes. The server supplies metadata.pageId as the verified source PageStore identity;
the outer pageId still identifies the recipient. Browser dataController and
dataFormula subscribers receive _subscription_metadata separately from payload.
Each subscriber receives a fresh mapping; a local publication receives an empty
mapping and does not inherit metadata from its caller. Application payload cannot
replace this reserved context. Ordinary subscriber callbacks receive metadata
as their second argument. Gramlot.publish retains its two-argument API.
