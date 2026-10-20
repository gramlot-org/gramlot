# Calling the server: `dataRpc` and endpoints

Document ID: **GC-098**.

<!-- The section moved here from Writing pages keeps its block ID and anchor. -->

An **endpoint** is a page method the browser calls for a value. This guide shows how
a page declares endpoints and how the Source calls them. Fragments of Source built
on the server and values loaded when they are read are in
[Remote content and lazy Data](099-remote-content.md). The Controllers family of
the gallery of [gramlot-examples](https://gramlot-examples.readthedocs.io/en/latest/)
has lessons on endpoints, calls on change and calls on click.

<a id="gc-095-100"></a>

## 100 · `dataRpc` and endpoints

The page declares an endpoint; a `dataRpc` in the Source calls it and writes the
answer into Data.

```python
dataRpc(method, result_path=None, timeout=None, **params)
```

- `method` is the endpoint name: a method of the page or a path from the page,
  `orders.total` ([the method name](099-remote-content.md#gc-095-105)). It can also
  be a `^`/`=` pointer read from Data; read the warning on method names first.
- `result_path` is where the value is written; without it the value is not
  written. It does not accept `?attr`.
- `timeout` is in milliseconds; when it expires the call is aborted and fails
  with an error whose `name` is `TimeoutError`.
- The other keyword arguments are the endpoint arguments. `^` arguments trigger
  the call, `=` arguments are only read, as for `dataController`
  ([Data binding and controllers](097-data-binding.md#gc-095-055)). The control
  attributes of `dataController` apply: `_init`, `_onBuilt`, `_onStart`, `_delay`,
  `_timing`, `_userChanges`, `_if`. A false `_if` makes no call; `_else` then runs as
  inline code.
- Inline callbacks ([inline code](097-data-binding.md#gc-095-065)): `_onCalling`
  runs before the call with the arguments, and a result `false` makes no call;
  `_onResult` runs after the value is written, with the arguments plus `result`;
  `_onError` runs on failure, with the arguments plus `error` (an `RpcError` with the
  outcome `code`, the server exception name in `remoteName` and its `message`, a
  transport error or the `TimeoutError`). Without `_onError` the failure is not
  hidden: it reaches the browser console as an unhandled rejection.
- The calls of a `dataRpc` follow [the request rule](099-remote-content.md#gc-095-105):
  one call in flight, its answer always written; the first trigger during the
  flight waits with its arguments and is sent when the answer arrives; later
  triggers do nothing while one waits. Removing the declaration aborts its call.
- A `dataRpc` nested in a `button` runs on click
  ([Buttons and events](097-data-binding.md#gc-095-075)).

The page declares an endpoint with `@endpoint` in Python and
`Page.registerEndpoint(name)` in JavaScript, called after the class. The method
receives the arguments by name (Python) or as one object (JavaScript) and returns
the value: a scalar, a Bag or null. The value is data and never runs code.
`dataRpc` sends every argument the author writes. Python calls the method with
them as keywords, and a keyword the method does not accept answers
`application_error`; JavaScript ignores the keys it does not read. A Python endpoint
called from `dataRpc` therefore declares `**kwargs`, as the legacy `rpc_*` methods
do.

```python
from gramlot import Page as BasePage
from gramlot import endpoint


class Page(BasePage):
    def main(self, root):
        root.input(type="number", value="^.price")
        root.dataRpc("with_vat", result_path=".gross", price="^.price",
                     _onError="console.warn(error.message)")
        root.span("^.gross")

    @endpoint
    def with_vat(self, price, **kwargs):
        return round((price or 0) * 1.22, 2)
```

```javascript
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        root.input({type: 'number', value: '^.price'});
        root.dataRpc({method: 'with_vat', result_path: '.gross', price: '^.price',
            _onError: 'console.warn(error.message)'});
        root.span('^.gross');
    }

    with_vat({price}) { return Math.round((price ?? 0) * 122) / 100; }
}
Page.registerEndpoint('with_vat');
```

- `@endpoint(auth="rule")` and `Page.registerEndpoint(name, {auth: 'rule'})`
  protect the endpoint with a rule over tags (`|`, `&`, `!`). A server without the
  `auth` capability knows no identity: every call of a protected endpoint answers
  the outcome `not_authenticated` and the method does not run.
- `auth="rule"` on an element of `main` or of a `@source` fragment protects the
  element with the same rule. The server drops an element whose rule it refuses,
  with all its children, when it sends the fragment: the element never reaches the
  browser, and an accepted element is sent without its `auth` attribute. A server
  without the `auth` capability refuses every rule, so the element is never sent.
  The rule is a string; any other value answers `application_error`. A page built
  in the browser does not evaluate `auth`.
- A declared method name is `[A-Za-z]` followed by ASCII letters, digits and `_`;
  `main` is reserved, and the same method cannot be both an endpoint and a `@source`
  method. A request names it directly or through a path
  ([the method name](099-remote-content.md#gc-095-105)).
- An unknown endpoint answers `not_found`; an exception raised by the method
  answers `application_error` with its `name` and `message`. Both reach
  `_onError`.
- A string argument that carries a TYTX suffix (`"x::D"`) is decoded by TYTX, not
  passed through as text: genro-tytx decodes only text it encoded, so an endpoint
  does not rely on such strings.
- The call travels as one envelope on `POST /gramlot/rpc`
  ([Server protocol](101-server-protocol.md#gc-101-020)); the page writes no `fetch`.

**From code.** `gramlot.rpc.call('data', name, params, {signal})` calls an endpoint
and resolves with its value; a failure rejects with the `RpcError` above. `signal`
and the disposal of the page abort the call. In a `Logic` method the page instance
is `this.page`: `await this.page.rpc.call('data', 'with_vat', {price: 10})`.
`gramlot.rpc.callSync('data', name, params)` waits for the answer and returns the
value, as the legacy `genro.serverCall` without callback. It blocks the page until
the answer arrives, and only a transport with synchronous calls sends it (HTTP);
on any other, such as the serverless Worker, it throws. Browsers deprecate the
synchronous request on the main thread. The arguments of both are data: live Source
nodes and DOM elements are refused.
