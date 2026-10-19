# Remote content and lazy Data: `remote` and `dataRemote`

Document ID: **GC-099**.

<!-- The section moved here from Writing pages keeps its block ID and anchor. -->

`remote` makes the content of an element a Source fragment built on the server.
`dataRemote` puts at a Data path a value that an endpoint computes when the path is
read. Both name a server method, as `dataRpc` does
([Calling the server](098-server-calls.md)), and follow the same request rule. The
Controllers family of the gallery of
[gramlot-examples](https://gramlot-examples.readthedocs.io/en/latest/) has lessons on
remote content, cached remote content and remote Data.

<a id="gc-095-105"></a>

## 105 · `remote`, `dataRemote` and the request rule

**`remote`** makes the content of an element a Source fragment built on the server
by a `@source` method (Python) or a method declared with `registerSource(name)`
(JavaScript). The element carries the attribute `remote` with the method name; the
attributes `remote_<k>` are the call parameters. The node method writes them:

```python
remote(name, **params)
```

- The fragment is requested when the element starts
  ([lifecycle](097-data-binding.md#gc-095-080)) and again when a `^` pointer of
  `remote` or of a `remote_<k>` parameter changes. `=` parameters are only read. The
  fragment replaces the content of the element; the authored children stay until
  the first fragment arrives.
- The request goes through `gramlot.src.remoteSource(target, method, params)` and
  follows the request rule below. Removing the element cancels its request.
- `_cachedRemote=True` makes no request when the method name and the parameters
  equal those of the request in flight or, with none in flight, those of the
  fragment mounted last. A fragment mounted by `remoteSource` from code replaces
  that record. Parameters are compared by their TYTX serialization, captured when
  the request is made, so later mutations cannot alter the comparison. A different
  object-key order can cause another request even when the values are equal.
- `_if` is inline code with the parameters as locals. It is a readiness condition:
  false makes no request, cancels nothing and leaves the content as it is; `_else`
  then runs as inline code. Example: `_if="record_id"`. To clear the content when
  the condition turns false, write `_else="this.setValue(null)"`; when `_if` is
  true again, the fragment is mounted again.
- `_onCalling` runs as inline code at each request, with the parameters as locals,
  before the request rule below decides whether the request is sent, waits or does
  nothing; a result `false` makes no request. `_onRemote` runs as inline code after
  the fragment is mounted, with the parameters as locals.
- `_delay` (milliseconds), `_timing` (seconds) and `_userChanges` apply as for
  `dataRpc`. `_delay` delays the request after a change, and a new change in the
  meantime replaces it; it never cancels the request in flight. There is no default
  delay; set `_delay` when a parameter changes at every keystroke.
- A parameter starting with `_` other than the eight control attributes
  (`_cachedRemote`, `_if`, `_else`, `_onRemote`, `_onCalling`, `_delay`, `_timing`,
  `_userChanges`) is an error. A failed request reaches the browser console as an
  unhandled rejection that names the element.
- A fragment can carry elements with `remote` of their own.

**The method name** of `remote`, `dataRpc`, `dataRemote` and `remoteSource` is a
string:

- `"details"`: a method of the page;
- `"orders.details"` or `"a.b.c.details"`: a path read from the page. Each segment
  before the last is a public attribute: its name does not start with `_`. A
  property is read, so its getter runs when a request names it. The last segment is
  a method declared with `@source` or `@endpoint` (Python), or with
  `registerSource` or `registerEndpoint` (JavaScript), on the class of the object
  before it. Its `auth` rule is the only authorization of the request.
- The syntax of the name belongs to the server: `GramlotServer.name_syntax`
  (JavaScript `nameSyntax`) declares it as a portable regex, and the bootstrap
  carries it to the browser, where the `remote(…)` helper and a name read from Data
  are checked with it ([Server protocol](101-server-protocol.md#gc-101-015)). With
  the core server each segment is an ASCII letter followed by ASCII letters, digits
  and `_`. Any other name answers `not_found`.
- In JavaScript, every object on the path is an instance of a class that extends
  `Exposed`, the base of `Page` that holds `registerSource` and `registerEndpoint`.
  A member inherited from `Object`, such as `constructor`, never leads to a method.
  In Python the objects on the path are ordinary objects.
- The name can be a `^` or `=` pointer: the method is then read from Data. Use it
  with care: a reader of the Source no longer sees which method runs. An empty or
  `null` name rejects the request with an error, as a name outside the syntax does.
  To make no request while no method is chosen, write `_if`.
- The page decides which objects a path reaches. For an object with state, a cached
  property is the recommended form.

**The request rule** is the same for `remote`, `dataRpc`, `dataRemote` and
`gramlot.src.remoteSource`:

- one request is in flight for each Source node;
- a request in flight always finishes, and its answer is applied: the fragment is
  mounted, the value is written, `_onRemote` or `_onResult` runs;
- the first change during the flight waits, with its method and parameters of that
  moment; later changes do nothing while one waits;
- when the answer arrives, the waiting request is sent.

The content can therefore stay behind the Data until the next change. Only the
removal of the element and the close of the page abort a request; `timeout` of
`dataRpc` aborts its call.

Inline code reaches the state of the requests through `this.requests`, where `this`
is the Source node:

- `this.requests.inflight` is the request in flight, `{method, params, sentAt,
  cancel()}`, or `null`; `params` are the parameters sent and `sentAt` the send time
  in milliseconds (`Date.now()`);
- `this.requests.pending` is the waiting request, `{method, params}`, or `null`;
- `inflight.cancel()` makes the node ignore the answer of the request in flight.
  The server may still compute it. Called inside `_onCalling`, the new request is
  sent at once and replaces the waiting one; called elsewhere, the waiting request
  is sent.

```python
root.div().remote("details", record_id="^.record_id",
                  _onCalling="if (this.requests.inflight) this.requests.inflight.cancel()")
```

```python
from gramlot import Page as BasePage
from gramlot import source


class Orders:
    @source
    def details(self, root, record_id=None, **kwargs):
        root.span(f"Order {record_id}")


class Page(BasePage):
    @property
    def orders(self):
        return Orders()

    def main(self, root):
        root.input(type="number", value="^.record_id")
        root.div().remote("details", record_id="^.record_id", _cachedRemote=True)
        root.div().remote("orders.details", record_id="^.record_id")

    @source
    def details(self, root, record_id=None, **kwargs):
        root.span(f"Record {record_id}")
```

```javascript
import {Exposed, Page as BasePage} from '@gramlot/gramlot/page';

class Orders extends Exposed {
    details(root, {record_id}) { root.span(`Order ${record_id}`); }
}
Orders.registerSource('details');

export class Page extends BasePage {
    get orders() { return new Orders(); }

    main(root) {
        root.input({type: 'number', value: '^.record_id'});
        root.div().remote('details', {record_id: '^.record_id', _cachedRemote: true});
        root.div().remote('orders.details', {record_id: '^.record_id'});
    }

    details(root, {record_id}) { root.span(`Record ${record_id}`); }
}
Page.registerSource('details');
```

**`dataRemote`** installs at a Data path a resolver that computes the value with an
endpoint ([Calling the server](098-server-calls.md#gc-095-100)). The endpoint is
called when the path is read, not when the declaration is installed.

```python
dataRemote(destination_path, method, cacheTime=None, sync=True, **params)
```

- `destination_path` is the Data path of the value; it does not accept `?attr`.
  `method` is the endpoint name, a path from the page or a `^`/`=` pointer read from
  Data, as for `remote` (above, "The method name").
- `cacheTime` is in seconds: a negative value or `None` calls once; `0` calls at
  every read; a positive value calls again on the first read after that many
  seconds.
- `sync`, true by default as in the legacy, makes the read wait when the transport
  of the page sends synchronous calls (HTTP,
  [Server protocol](101-server-protocol.md#gc-101-045)): a read whose cache has
  expired calls the endpoint synchronously and returns the answer; the value is
  stored at the path without notifying the consumers, because the reader receives
  it. A failed call raises the error, naming the declaration, to the reader; the
  next read calls again. Browsers deprecate the synchronous request on the main
  thread, and the page is blocked until the answer arrives.
- With `sync=False`, and on a transport without synchronous calls (the serverless
  Worker), a read never waits. It returns the current value, `None` before the
  first call, and starts the call when the cache has expired. A read during a call
  starts no other call. On the Worker this also holds for `sync=True`.
- When an asynchronous call answers, the value is written at the path and every `^`
  consumer of the path is projected with it. With `cacheTime=0` the value is
  written without notifying the consumers, as in the legacy: it is a value per
  explicit read, and a `^` consumer would call again at each projection.
- The other keyword arguments are the endpoint arguments. A change of a `^`
  argument installs a new resolver. When the previous resolver had called, the
  new one calls at once, asynchronously also with `sync`, and the consumers receive
  the new value.
- The calls follow the request rule above: a call in flight is not aborted by a
  new resolver and writes its value; the call of the new resolver waits for it.
- `_onCalling` runs as inline code before each call, with the arguments of the
  declaration; a result `false` makes no call, and a later read tries again.
- A false `_if` removes the resolver: the path keeps its last value, and a call in
  flight still writes its own. `_else` then runs as inline code. When `_if` is true
  again, the new resolver calls at once if the removed one had called. `_delay`,
  `_timing` and `_userChanges` apply as for `dataRpc`. `_init`, `_onBuilt` and
  `_onStart` are an error on `dataRemote`.
- Removing the declaration removes the resolver and aborts its call; an aborted
  call writes nothing.
- An endpoint failure leaves the stored value unchanged. It reaches the browser
  console as an unhandled rejection that names the declaration.

```python
from gramlot import Page as BasePage
from gramlot import endpoint


class Page(BasePage):
    def main(self, root):
        root.dataRemote(".menu", "load_menu", cacheTime=5, table="dishes")

    @endpoint
    def load_menu(self, table=None, **kwargs):
        return f"menu of {table}"
```

```javascript
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        root.dataRemote({destination_path: '.menu', method: 'load_menu', cacheTime: 5,
            table: 'dishes'});
    }

    load_menu({table}) { return `menu of ${table}`; }
}
Page.registerEndpoint('load_menu');
```

Intended differences from the legacy:

- `remote` is an attribute of the element itself, written by the node method
  `remote(name, …)`. Legacy `remote` was a child element that wrote its
  attributes on the parent.
- No `lazy` loading by visibility, no `_waitingMessage`, no `tbody` merge, no
  `_resolved` and no `_fired`.
- The legacy alias `data(path, remote=…)` is not accepted: write `dataRemote`.
