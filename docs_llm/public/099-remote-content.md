# Remote content and lazy Data: `remote` and `dataRemote`

Document ID: **GC-099**.

<!-- The section moved here from Writing pages keeps its block ID and anchor. -->

`remote`: element content = a Source fragment built on the server. `dataRemote`: a value an endpoint
computes when its path is read. Same method names and request rule as `dataRpc`
([Calling the server](098-server-calls.md)). Gallery: Controllers family of
[gramlot-examples](https://gramlot-examples.readthedocs.io/en/latest/).

<a id="gc-095-105"></a>

## 105 · `remote`, `dataRemote` and the request rule

`remote`: the content of an element is the fragment of a `@source` method (JS
`registerSource(name)`). Node method `remote(name, **params)` (JS
`remote(name, params)`) writes `remote = name` and `remote_<k>` per parameter; returns
the node. Requested at the element's start ([lifecycle](097-data-binding.md#gc-095-080)) and on every change of a `^`
pointer of `remote` or of a `remote_<k>` parameter (`=` read only), through
`gramlot.src.remoteSource` (request rule below; removal cancels). The fragment replaces
the content; authored children stay until it arrives. Controls: `_cachedRemote` (name
and parameters equal the request in flight, or with none in flight the fragment
mounted last → no request; a fragment mounted by `remoteSource` from code replaces the
record; TYTX parameters captured when the request is made; different object-key order
may request again), `_if` (inline, parameters as locals; readiness condition: false →
no request, nothing cancelled, content unchanged, `_else` runs; `_else="this.setValue(null)"`
clears the content, true again mounts the fragment again), `_onCalling` (inline
at each request, before the request rule; `false` → no request), `_onRemote` (inline after the mount),
`_delay`/`_timing`/`_userChanges` as `dataRpc` (`_delay` never cancels the request in
flight; no default delay). Another `_` parameter → error; a failed request → unhandled
rejection naming the element. Nested `remote` inside a fragment works.
**Method name** (`remote`, `dataRpc`, `dataRemote`, `remoteSource`): a string,
`"details"` (method of the page) or `"a.b.c.details"` (path from the page). Segments
before the last are public attributes (no leading `_`; a getter runs); the last is a
method declared with `@source`/`@endpoint` (JS `registerSource`/`registerEndpoint`) on
the class of the object before it; its `auth` is the only authorization. The name
syntax belongs to the server (`GramlotServer.name_syntax`/`nameSyntax`, portable
regex carried by the bootstrap; the browser checks `remote(…)` and names read from
Data with it, [Server protocol](101-server-protocol.md#gc-101-015)); core segment syntax `[A-Za-z][A-Za-z0-9_]*`; any other name →
`not_found`. JS: every object on the
path extends `Exposed` (base of `Page`, holds the two markers); an inherited member
such as `constructor` never leads to a method. Python: ordinary objects. A `^`/`=`
pointer name is read from Data: use with care, the Source no longer shows the method.
Empty or `null` name → error, as a name outside the syntax; "no method yet" is written
with `_if`. For an object with state a cached property is the recommended form.
**Request rule** (`remote`, `dataRpc`, `dataRemote`, `remoteSource`): one request in
flight per Source node; it always finishes and its answer is applied (fragment
mounted, value written, `_onRemote`/`_onResult` run); the first change during the
flight waits with its method and parameters of that moment; later changes do nothing
while one waits; at the answer the waiting request is sent. The content can stay
behind the Data until the next change. Only removal and page close abort (`dataRpc`
`timeout` too). `this.requests` (this = Source node): `inflight` =
`{method, params, sentAt, cancel()}` or `null` (`sentAt` = `Date.now()` at send);
`pending` = `{method, params}` or `null`; `inflight.cancel()` → the answer is
ignored (the server may still compute it); inside `_onCalling` the new request is
sent at once in place of the waiting one, elsewhere the waiting one is sent.
Example: `root.div().remote("details", record_id="^.record_id", _cachedRemote=True)`
and `root.div().remote("orders.details", record_id="^.record_id")` with
`@source def details(self, root, record_id=None, **kwargs)` on the page and on
`Orders` (property `orders`); JS `class Orders extends Exposed`,
`Orders.registerSource('details')`, `get orders()` on the page,
`Page.registerSource('details')`.
`dataRemote(destination_path, method, cacheTime=None, sync=True, **params)` installs at
`destination_path` (no `?attr`) a resolver that calls the endpoint `method` (name, path
or `^`/`=` pointer, as `remote`) when the path is read. `cacheTime` in seconds: negative/`None` → once,
`0` → every read, positive → again on the first read after it. `sync` (default true,
legacy) on a transport with synchronous calls (HTTP): an expired read calls
synchronously and returns the answer, stored without notifying the consumers (the
reader receives it); a failure is raised to the reader naming the declaration; the
next read calls again. Synchronous XHR is deprecated by browsers and blocks the page
([Server protocol](101-server-protocol.md#gc-101-045)). `sync=False`, or a transport without
synchronous calls (serverless Worker; there also with `sync=True`): a read never waits:
it returns the current value (`None` before the first call) and starts the call when
expired; a read during a call starts no other. The answer is written at the path and
projects every `^` consumer; with `cacheTime=0` it is written without notifying them
(legacy: a value per explicit read). `^` argument change → new resolver, which calls at
once (asynchronously, also with `sync`) when the previous one had called; request rule: a call in flight is not aborted and
writes its value, the new call waits. A synchronous and an asynchronous call fill the same cache: the first read after the
asynchronous call of a new resolver returns the stored value while the cache is valid and sends no call.
`_onCalling` before each call (`false` → no call,
a later read tries again). False `_if` → resolver removed, last value kept (a call in
flight still writes), `_else` runs; true again → the new resolver calls at once if the removed one had
called; `_delay`/`_timing`/`_userChanges` as `dataRpc`; `_init`/`_onBuilt`/`_onStart`
→ error. Removal removes the resolver and aborts the call (an aborted call writes
nothing); endpoint failure → value unchanged, unhandled rejection naming the
declaration. Example: `root.dataRemote(".menu", "load_menu", cacheTime=5,
table="dishes")`; JS `root.dataRemote({destination_path: '.menu', method:
'load_menu', cacheTime: 5, table: 'dishes'})`.
Intended legacy differences: `remote` is an attribute of the element (legacy: a child
element writing on its parent); no `lazy` by visibility, `_waitingMessage`, `tbody`
merge, `_resolved`, `_fired`; the alias `data(path, remote=…)` is not accepted.


<a id="gc-099-runtime-errors"></a>
## Runtime-triggered failures

A failed automatic `remote` load shows a nonmodal error notification. Open
**Details** for the error and its cause; the rest of the page stays usable.
Identical visible errors are coalesced. At most five distinct errors are visible; further failures increment a counter. Dismissed errors stay suppressed until the page is loaded again. Changing the remote
parameters or the next configured trigger can retry the load. Intentional
cancellation and results arriving after the owner closes do not show alerts.
Explicit programmatic requests retain their Promise rejection contract; their
caller remains responsible for handling errors.
