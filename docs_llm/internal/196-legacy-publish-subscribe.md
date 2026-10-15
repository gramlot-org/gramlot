# 196 · Legacy publish/subscribe and controller execution

Document ID: **GC-196**.

[Expanded research, source inventory and reproduction programs](../../docs/internal/196-legacy-publish-subscribe.md).
[Future-work inventory](../future/README.md).

**Research snapshot — 2026-10-15.** Evidence about GenroPy, not a Gramlot contract or
porting plan. Owner asked for an extremely detailed legacy analysis, including
controllers, before deciding the port. Release direction 0.2.18 is selected; scope,
API, transport, implementation and publication are not authorized by this report.

<a id="gc-196-005"></a>
## 005 · Scope, authority and evidence

Inspected `genropy/genropy` at
`fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`, local checkout
`/Users/gporcari/Sviluppo/Genropy/genropy`. Relevant inspected runtime files were
unmodified. Expanded source references pin this revision.

This is the living legacy: Dojo topics, a newer indexed Data trigger dispatcher,
and an aiohttp/asyncio server replacing Tornado. Bag loading defaults to legacy
`gnrbag.js`; alternative adapter/mixin modes exist. Probes use the default Bag;
the alternative adapter also contains fire/reset, but all modes were not qualified.
The neutral `gnrasync_session.py` notify/request/events API and its tests are
separate evidence, not proof that legacy PUBLISH uses that protocol.

Distinguish source observations, isolated probes, existing tests actually rerun,
and unresolved/end-to-end claims. Constitution §§2, 4, 5 and 11.43 apply. No runtime
source changes, new API names, version changes or publication were performed.

<a id="gc-196-010"></a>
## 010 · Separate mechanisms

- Page topics: exact names, JS arguments, Dojo listeners, no message retention.
- Node/form topics: explicit string prefixes over the same page bus.
- Data pointers: Bag changes matched by path; `^` subscribes, `=` reads only.
- FIRE: triggering Data write followed by silent null, not topic publication.
- Direct Bag/BagNode subscriptions: object/event callbacks, not topic registry.
- Window messages and WebSocket commands: delivery mechanisms that can republish
  locally; they do not create a single global bus.
- Register/user-store datachanges: server queues/offsets → client Data → controllers.
- Shared objects: server state, membership and change propagation, distinct from topics.
- Python `_publish_event`: server lifecycle hooks, separate from client messages.

Controllers converge topic and Data activations into one execution pipeline while
retaining different trigger contexts.

<a id="gc-196-015"></a>
## 015 · Page-local bus

String `genro.publish(topic, ...args)` forwards all positional arguments to
`dojo.publish(topic, args)`. Low-level subscription is `dojo.subscribe(topic,
scope, handler)` with a removable handle; no general GenroClient.subscribe wrapper
was found in this implementation.

Delivery is synchronous, exact-match, per window, with no replay, equality filter,
priority API, result aggregation or promise/acknowledgement. Missing listeners do
nothing. Payload objects are shared references. Nested publication is immediate;
a thrown subscriber error interrupts remaining listeners and escapes the caller.
These central behaviors were probed. Dojo uses a mutable listener array and
`for...in`, not a snapshot; do not infer a portable mutation-during-dispatch order.

<a id="gc-196-020"></a>
## 020 · Python declarations

Legacy dataController/dataFormula/dataRpc construct Source children; Python does
not execute their JS or register browser subscribers. `subscribe_*` travels as
Source attributes. The expanded document gives Python-first explanatory examples;
they are legacy syntax, not proposed/current Gramlot examples.

Basic button `publish='topic'` emits one true argument; button handling selects
action, fire, publish, then fire_* after separately invoking a single nested
controller/RPC. Contextual slot buttons instead synthesize prefixed topics with
command/modifiers/options/event/counter objects. Button click debounce and receiving
controller debounce are separate. These source observations are not new Gramlot APIs.

The actual `projects/gnrcore/packages/test/webpages/datastore/publish.py` demonstrates
positional publication, PUBLISH, multiple subscriptions and `_ask` with PUBLISH/FIRE.
It was inspected, not launched.

<a id="gc-196-025"></a>
## 025 · Subscription declarations

Rendered nodes use `subscribe_topic` as a callback; selfsubscribe uses node-scoped
registration and formsubscribe uses the associated form prefix. `connect_*` is
processed separately for DOM/widget connections.

Providers use subscription **keys**, ignoring values; their body stays the declared
script/formula/RPC. `_dataControllerSubscription` calls
`setDataNodeValue(null, {}, topic, arguments)`. Consequently False still subscribes
(probed), and a string value is not an alternate controller body.

Self topics use the provider's own nodeId/generated ID. Form topics are registered
after build when the form can be resolved. This is not a reactive topic selector or
boolean subscription enablement mechanism.

<a id="gc-196-030"></a>
## 030 · Controller arguments and precedence

For `publish('refresh', {amount:7})`, the controller receives:

- `this`: receiving Source node; `_node`: undefined, no changed Data node.
- `_reason`: `refresh`; `_triggerpars`: `{kw:{}, trigger_reason:'refresh'}`.
- `refresh`: callback arguments object, not a newly constructed Array.
- `amount`: promoted field, `_subscription_kwargs`: original payload reference.
- `_kwargs`: merged payload/author/run kwargs, without automatically adding every
  internal trigger field or topic arguments object.

Promotion occurs only for exactly one argument with `typeof === 'object'`.
Multiple/primitive arguments remain accessible as `topic[0]`, etc. A multi-topic
controller gets the active topic's variable; branch on `_reason` before reading it.

Order: trigger fields → stripped placeholders → topic arguments → payload fields
and `_subscription_kwargs` → resolved declarations → runKwargs/_runKwargs. Later
values shadow earlier ones; declaration and run-argument precedence was probed.
`_kwargs` is passed to the body, not automatically to `_if`.

Topic names and payload keys become generated function parameter names. Dots/hyphens
in topics, and numeric keys from a single nonempty Array payload, cause compilation
errors (probed). Inherited enumerable keys and reserved-name collisions are not
filtered. Null/non-enumerable objects do not behave like ordinary keyword payloads.
`$1` is positional function rewriting and has different meaning in a controller
with leading internal arguments than in a raw rendered-node handler.

<a id="gc-196-035"></a>
## 035 · Shared controller pipeline

Topic and Data triggers enter setDataNodeValue/setDataNodeValueDo: delay/ask,
autocreate and `_userChanges` filtering, destination and expression resolution,
argument construction, `_if`/`_else`, body and result effects.

`_userChanges` accepts only reason `node`, so ordinary topic names are rejected
(probed). `_delay` is one debounce timer per node: different topics, and other
activations using the same path, can replace each other. Arguments from Data are
read at execution; payload references can also be mutated before execution. Two-topic
coalescing and late Data reads were probed. `'auto'` currently disables special delay.

Delay takes precedence over `_ask` and schedules Do directly, bypassing Ask. Ask
checks ordinary subscribe keys/direct node reasons; self/form prefixes do not
implicitly have identical eligibility. Dialog behavior was not browser-tested.

`_init` executes before the provider installs topic subscriptions; `_onStart`
uses `^gnr.onStart`, `_onBuilt` uses after-build scheduling, `_timing` uses an
interval. Startup topics and Data startup triggers remain distinct. Startup explicitly fires gnr.onStart before publishing onPageStart. Early publications
can be missed; there is no message replay/build barrier in the bus.

<a id="gc-196-040"></a>
## 040 · Formula, RPC and resolver behavior

Ordinary provider setup also registers formula and RPC topics. A subscribed formula
can read `=` arguments on demand and write its result; adding `^` adds independent
Data activations. Legacy controllers with a path can also write a returned result;
an empty expression builds a Bag of kwargs in that pipeline.

A subscribed dataRpc merges arguments, runs `_onCalling` (which can alter kwargs or
cancel), strips underscore kwargs, starts the call, tracks Deferreds, writes results
and runs result/error hooks. Positional topic arguments are not an automatic RPC
parameter map. Tracking Deferreds is not publisher awaiting or automatic latest-wins;
several legacy calls can remain outstanding.

DataRemote takes a separate early setup branch and does not run ordinary topic
registration. Do not extrapolate identical subscription support to every data tag.

<a id="gc-196-045"></a>
## 045 · Data paths and fire/reset

Data Bag → dataTrigger → shared/server-store handling → trigger index → trigger_data
→ provider or rendered binding. `_trigger_data` is still published for direct Dojo
subscribers. The index snapshots candidate registrations and skips removed ones.
Matching distinguishes node/container/child, attribute/value cases and autocreate;
an `evt:'fired'` child match is skipped.

A Data activation supplies its changed Bag node and change metadata; a topic supplies
message arguments and topic-name reason. Both execute through the provider pipeline.

FIRE expands to a relative fired write. Bag.fireItem performs a triggering write
then a silent null reset; equal repeated payloads notify twice (probed). Delayed
reads can see null, and retaining a Bag node is not capturing its old value. Source
fireEvent uses `value || true`, unlike Bag's null check; fireDataTrigger synthesizes
an event, and FIRE_AFTER delays. These helpers are not semantically identical.
A subscriber exception can prevent reset because fireItem lacks finally (probed).
Direct dataSubscribe/dataNodeSubscribe remain Bag APIs with separate ownership.

<a id="gc-196-050"></a>
## 050 · Lifecycle and cleanup

Source owns Dojo/trigger-index handles in `_subscribedNodes`; reset/delete/replacement
remove them through the proper dispatcher. A separate subscriberNode can own a
handle while callback scope belongs to the target node/form. Raw Dojo subscriptions
need their own removal.

Frozen/discarded content and retained same-Bag rebuilds have explicit handling;
8 upstream focused teardown tests were rerun and passed. Two bounded probes expose:

- Repeated custom `reason !== topic` registrations overwrite remembered handles
  because the test uses topic while storage uses reason; one listener can leak.
- `_onDeleting` does not cancel pendingFire; its queued callback can still run.

Timers, intervals, subscriptions and RPCs are separate resources. The analysis does
not establish universal cancellation across every widget/browser deletion route.

<a id="gc-196-055"></a>
## 055 · Scoped topics

Source publish prefixes nodeId/generated ID, sends one payload argument and can
walk descendants. Source subscribe adds positional p_0 etc., current attributes,
source scope and optional separate cleanup owner. Probed ownership behavior.
Recursive publication returns true at an unbuilt node; Bag.walk treats it as stop,
so later built siblings can be missed (probed).

Forms prefix `form_<id>_<command>` and can publish to parent through routing options.
Default callback/scope/owner are the form method/form/form Source node. Comma-separated
form.subscribe does not forward explicit callback/scope in its recursive calls.
Prefixes are names, not security or transport identities.

<a id="gc-196-060"></a>
## 060 · Descriptor routing and frames

Object-form publish uses `topic.kw || suppliedPayload`; locally it tests presence
of nodeId, then form, otherwise global topic. An empty/missing target with nodeId
present suppresses global dispatch (probed).

Local delivery precedes forwarding. iframe ID uses a DOM iframe lookup; `'*'` visits
accessible frames. Forwarded child descriptors remove parent but retain iframe,
so wildcard propagation continues to descendants. Parent routing removes both
iframe and parent; it does not automatically broadcast to siblings/all ancestors.
External-window routing precedes iframe/parent and returns early.

Direct frame calls are synchronous and depend on access/readiness; child boundary
exceptions are swallowed. No queue for unready/inaccessible frames is present.
getParentGenro can mean parent iframe or associated root external window.
`_publish_new` target comments describe incomplete inactive code, not an API.

<a id="gc-196-065"></a>
## 065 · Window messages and frame Data

extWin sends locally first, adds topic to the caller's payload, then postMessages;
mutation/early return were probed. Sender uses target origin `'*'`; receiver copies
e.data, removes topic (default windowMessage), and republishes locally without
origin/source validation in that helper. This is a bounded source observation,
not a deployment security audit. PostMessage serialization is not a Bag identity
or arbitrary-object transport guarantee.

Frame startup separately exposes live Data through `_frames._parent` and named
`_frames.<frameName>` resolvers and publishes node-scoped pageStarted. That is
cross-frame Data access, not automatic topic replication.

<a id="gc-196-070"></a>
## 070 · Server publishing through Data

Without WebSocket, Python clientPublish converts Bag-valued kwargs to typed text,
creates topic/kw/routing fields, and fires `gnr.publisher`. The standard system
controller watches `^gnr.publisher` and calls genro.publish. This directly confirms
the owner's system-Data/controller recollection.

Register datachanges → response/poll collection → browser setDatachangesInData →
Data trigger → publisher controller → local/routed topic → silent fired reset.
Page queues drain; user-store subscriptions have offsets. This is not a durable
topic broker. Incoming change handling has a comparison guard and does not use
Bag.fireItem, so low-level flags are not automatically identical. Transport selection
can fall back from WebSocket to queued Data on errors; no Gramlot fallback approved.

<a id="gc-196-075"></a>
## 075 · WebSocket commands

Browser publishToClient wraps topic/data in a publish envelope, serializes the Bag
as XML inside a JSON command, and routes to target_page_id. Server channels select
one recipient; incoming command is parsed and do_publish calls the local bus.
Local subscribe declarations are not registered remotely.

Python can send via WSGI Unix/HTTP proxy or in-process async sender. HTTP proxy
supports comma lists/`'*'`; async sender and browser route select one channel. Missing
channels are skipped. Connected/page ID, ping and close manage sessions. The bundled
ReconnectingWebSocket queues outgoing messages while disconnected and flushes on
open; this is not persistence/replay/exactly-once delivery or full state restoration.
RPC token/Deferred correlation is separate from publish acknowledgements.

Reproduced asymmetries:

1. clientPublish accepts parent but omits it in the WebSocket call; queued Data retains it.
2. WebSocket setInClientData accepts fired but omits it from its Bag; separate fire
   helper uses a fired set command.
3. do_publish inserts empty nodeId when another routing option is present; key-presence
   dispatch then suppresses normal local global delivery. Parent-only case probed.

Remote subscriber errors cannot synchronously propagate back across the network.
No end-to-end delivery acknowledgement is established by these routes.

<a id="gc-196-080"></a>
## 080 · Users, stores and shared state

Cross-user delivery is server recipient selection, not an intrinsic topic property.
Registry enumeration selects pages/connections/users; string filters use re.match,
not exact equality. Chat composes local topics, subscribed dataRpc, per-user fired
Data changes and room alerts, client controllers and optional faster polling.
User-store offsets are per-page, with global offsets marking new user notifications.

Shared objects subscribe by ID, send initial data/privilege, map a Data path and
publish local readiness. Later changes travel through som.datachange; recipients
write with serverChange to avoid echo. Server broadcasts exclude the origin page.
Transient fired changes do not persist in the shared Bag. A probe confirms the
lock decorator awaits the broadcast coroutine returned by synchronous datachange;
this is not a multi-browser transport test.

Shared objects add read/write membership checks, expiry, save/load and focus locks.
Mutation entry points do not visibly repeat the subscription privilege check.
Generic do_route has no explicit sender/recipient check in that method; the inspected
WebSocket handler does not itself validate origin. RPC tag checks elsewhere do not
prove route authorization. Deployment/proxy protection was not audited.

<a id="gc-196-085"></a>
## 085 · Worked traces

Expanded analysis walks through: formula-on-topic with read-only pointers; one
controller activated by both Data and message; delayed FIRE versus retained message
payload; child-to-parent delivery; server publisher through Data versus WebSocket;
and cross-user chat through stores. Snippets are explanatory legacy reconstructions,
not launched Gramlot examples or approved porting syntax.

<a id="gc-196-090"></a>
## 090 · Limits are evidence, not approved behavior

Retain all distinctions above when interpreting legacy: synchronous exception and
reference behavior; generated-signature restrictions; argument precedence; False
subscriptions; userChanges/delay/ask/startup semantics; handle/timer cleanup gaps;
fire exception/reset; recursive-walk termination; local-before-forward and routing
key presence; postMessage trust boundary; transport wrapper asymmetries; reconnect
queue versus delivery guarantees; filter matching and shared-state permissions.

The expanded table labels each finding as probed or source-only. Inactive proposed
code, alternative Bag modes and neutral-session tests cannot fill gaps by inference.
No automatic bug-fix or porting backlog is authorized by recording them.

<a id="gc-196-095"></a>
## 095 · Gramlot comparison boundary

Current Python and JS Gramlot builders explicitly exclude the three subscription
prefixes. Provider already owns Data registration, lifecycle and existing trigger
contexts, with named/inline Logic. This does not make messaging implemented.
Gramlot's latest-wins RPC cancellation is not the legacy multiple-Deferred behavior.
The inspector's bounded frame bridge is not automatically a general application bus.
Core remains host/DB independent; no server, Builder/Bag changes or new naming contract
follow from this research.

<a id="gc-196-100"></a>
## 100 · Verification and limits

Executed: **21 JS probes** on Node v23.11.0, **4 extracted Python-method probes**,
and **8/8 existing Source lifecycle tests**. Probes use exact legacy methods with
controlled environment/timers/frame/sender objects. Expanded §110 preserves programs.
Reviewed but did not execute async network/session tests.

Not end-to-end verified: browser rendering, actual iframe origins, structured clone,
reconnect, authentication, multiple deployed users, real startup timing, all Bag modes.
No whole-product or future Gramlot qualification claim. Research adds no core runtime
or CI dependency on legacy.

<a id="gc-196-105"></a>
## 105 · Owner decisions still open

After reading, decide scope; Python declarations and named Logic integration;
payload/context/collision contract; trigger/filter/delay compatibility and deliberate
corrections; routing/local delivery/readiness; teardown and pending work; recipient
authorization and delivery guarantees if network scope is included; separation from
stores/DB work. These are questions, not ordered phases or approved defaults.

Next: owner reviews the document, then decides a bounded porting plan. No implementation.

<a id="gc-196-110"></a>
## 110 · Reproduction programs

Expanded counterpart includes the complete isolated JavaScript and Python programs.
They read the pinned legacy checkout and run without browser/network operations.
Copy outside the core test suite. Assertions characterize observed behavior, including
quirks, and do not bless it as desired product semantics.

<a id="gc-196-115"></a>
## 115 · Source inventory

Expanded counterpart provides pinned source links for Dojo dispatch; GenroClient;
Source/provider setup/execution/cleanup; Python declarations; macros; Bag fire/walk;
form/window/frame helpers; system publisher; queues/offsets/registry; WebSocket
client/proxy/session/reconnect; shared objects/lock; chat; actual examples; Bag
selection; separate neutral sessions; and executed versus merely reviewed tests.
