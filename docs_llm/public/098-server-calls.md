# Calling the server: `dataRpc` and endpoints

Document ID: **GC-098**.

<!-- The section moved here from Writing pages keeps its block ID and anchor. -->

An endpoint is a page method the browser calls for a value. Server fragments and lazy values:
[Remote content and lazy Data](099-remote-content.md). Gallery: Controllers family of
[gramlot-examples](https://gramlot-examples.readthedocs.io/en/latest/).

<a id="gc-095-100"></a>

## 100 · `dataRpc` and endpoints

`dataRpc(method, result_path=None, timeout=None, **params)` calls an endpoint of the
page and writes the value at `result_path` (absent → not written; no `?attr`).
`method` = endpoint name, path from the page (`orders.total`) or `^`/`=` pointer
([method name and warning](099-remote-content.md#gc-095-105)). `timeout` in ms → abort, error `name`
`TimeoutError`. Other kwargs = endpoint arguments (`^` triggers, `=` read only);
control attributes of `dataController` ([GC-095 055](097-data-binding.md#gc-095-055)) apply (`_init`, `_onBuilt`, `_onStart`, `_delay`, `_timing`,
`_userChanges`, `_if`; false `_if` → no call, `_else` runs as inline code). Inline
callbacks: `_onCalling` (arguments; `false` → no call), `_onResult` (arguments + `result`, after the
write), `_onError` (arguments + `error`: `RpcError` with `code`/`remoteName`/`message`,
transport error or `TimeoutError`); without `_onError` the failure is an unhandled
rejection. [Request rule](099-remote-content.md#gc-095-105): one call in flight, answer always written, the first
trigger during the flight waits with its arguments, later ones do nothing; removal
aborts. Nested in `button` = click mechanism ([GC-095 075](097-data-binding.md#gc-095-075)).
Declaration: Python `@endpoint` / `@endpoint(auth="rule")`; JS
`Page.registerEndpoint(name, {auth})` after the class. Arguments by name (Python) or
one object (JS); returns a scalar, a Bag or null (data, never code). `dataRpc` sends
every author argument: Python calls with keywords (an unaccepted keyword →
`application_error`), JS ignores unread keys, so a Python endpoint called from
`dataRpc` declares `**kwargs` (legacy `rpc_*` convention). Example:
`root.dataRpc("with_vat", result_path=".gross", price="^.price")` with
`@endpoint def with_vat(self, price, **kwargs)`; JS
`root.dataRpc({method: 'with_vat', result_path: '.gross', price: '^.price'})` and
`Page.registerEndpoint('with_vat')`. `auth` on a server without the `auth`
capability → `not_authenticated`, method not run. `auth="rule"` on an element of
`main` or of a `@source` fragment: the server drops the element and its children when
it refuses the rule; the element never reaches the client and an accepted one is sent without `auth` (a server without the `auth`
capability refuses every rule). Non-string rule → `application_error`; a page built in
the browser does not evaluate `auth`. Declared names `[A-Za-z][A-Za-z0-9_]*`, `main`
reserved, not both endpoint and `@source`; a request names them directly or by a path ([GC-095 105](099-remote-content.md#gc-095-105)). Unknown endpoint → `not_found`; raised
exception → `application_error` with `name`/`message`; both reach `_onError`. A string
argument with a TYTX suffix (`"x::D"`) is decoded by TYTX, not passed as text
(genro-tytx decodes only text it encoded): endpoints do not rely on it. Wire:
one envelope on `POST /gramlot/rpc` ([Server protocol](101-server-protocol.md#gc-101-020)).
From code: `gramlot.rpc.call('data', name, params, {signal})` resolves with the value, rejects with
`RpcError`; `signal` and page disposal abort; in `Logic` `this.page.rpc.call(...)`.
`gramlot.rpc.callSync('data', name, params)` waits and returns the value (legacy `genro.serverCall`
without callback), blocks the page, only on a transport with synchronous calls (HTTP), throws on any
other (serverless Worker); browsers deprecate synchronous requests. Arguments are data: live Source
nodes and DOM elements are refused.
