# Routes

A minimal routes package: declared functions reached through paths. It is the subset of the Python
`genro-routes` package that `Gramlot` handlers and gramlot-js-server need, with the same API translated
mechanically from snake_case to camelCase.

```js
import {RoutingClass, Signature, ReturnValue} from '@gramlot/gramlot/routes';

class Mailer extends RoutingClass {
    static docline = 'Sends mail.';
    sendMail({email, weight}) { return `${email}:${weight}`; }
}
Mailer.registerRoute('sendMail', {
    signature: new Signature({email: 'T', weight: ['L', 0]}),
    docline: 'Send one mail.',
    result: new ReturnValue({type: 'T', mediaType: 'text/plain'}),
});

const mailer = new Mailer();
mailer.route.node('sendMail/a@b.it/3').call();   // 'a@b.it:3'
mailer.route.node('sendMail').call({email: 'x'}); // 'x:0'
```

The package imports nothing from the rest of Gramlot: only files inside `js/src/routes/` and `@genrojs/tytx`.
`js/tests/routes/independence.test.js` enforces it.

## Name correspondence

| Python (`genro_routes`) | JavaScript (`@gramlot/gramlot/routes`) |
|---|---|
| `@route(...)` decorator | `Class.registerRoute(methodName, options)` static call after the class body |
| `route(name=...)` | `registerRoute(..., {name})` |
| `route(meta_*=...)` | `registerRoute(..., {meta: {...}})` |
| method docstring | `registerRoute(..., {docline})` |
| `RoutingClass` | `RoutingClass` |
| `RoutingClass.route` | `RoutingClass.route` (getter, created on first access) |
| `RoutingClass.add_branches(specs)` | `RoutingClass.addBranches(specs)` |
| `RoutingClass.result_wrapper(value, **metadata)` | `RoutingClass.resultWrapper(value, metadata = {})` |
| `ResultWrapper(value, metadata)` | `ResultWrapper(value, metadata)` |
| `is_result_wrapper(obj)` | `isResultWrapper(obj)` |
| `Router` / `BaseRouter` | `Router` |
| `Router.add_branches(specs)` | `Router.addBranches(specs)` |
| `Router.node(path)` | `Router.node(path)` |
| `Router.nodes()` | `Router.nodes()` |
| `Router.default_entry` | `Router.defaultEntry` |
| `Router.description` | `Router.description` |
| `Router.name` | `Router.name` (`'route'`) |
| `RouterNode` | `RouterNode` |
| `RouterNode.path` | `RouterNode.path` |
| `RouterNode.error` | `RouterNode.error` |
| `RouterNode.metadata` | `RouterNode.metadata` |
| `RouterNode.__call__(*args, **kwargs)` | `RouterNode.call(kw)` |
| `NotFound` | `NotFound` |
| `nodes()` key `owner_doc` | `ownerDoc` |
| `nodes()` entry key `doc` | `doc` |
| `nodes()` entry key `meta` | `meta` |
| entry result block `media_type` | `mediaType` |
| entry input schema (from type hints) | `parameters`: `[{name, type, required, default}]` |
| (new) | `Signature`, `ReturnValue` |

Behaviors kept from Python: the most derived class wins and an unmarked override hides the inherited entry;
a second marker on one method is an error; the entry named by `defaultEntry` (default `'index'`) is the target of a path
ending on a router; `nodes()` omits `entries` and `routers` when empty; a handler exception propagates untouched.

## Deliberate differences

- **One `kw` object.** A function reached through routes receives one object of named values. There are no positional arguments.
- **`Signature` and `ReturnValue` instead of type hints.** JavaScript has no annotations. `new Signature({name: 'T', weight: ['L', 0]})`
  declares parameters in order: a string is a required parameter with that TYTX code, `[code, default]` is optional.
  Accepted codes: `T`, `L`, `R`, `N`, `B`, `D`, `DHZ`, `H`. `ReturnValue` is documentation only and is never checked against the result.
- **`registerRoute` instead of `@route`.** JavaScript has no stable method decorators. The static call replaces the method with a wrapper
  that validates `kw` against the signature, so a direct call is validated too.
- **`call(kw)` instead of `__call__`.** A name given both as a path segment and in `kw` takes the value of the path, as Python.
- **`_extraPath` string instead of `_extra_args` list.** Path segments beyond the declared parameters are joined with `/` and passed as
  `_extraPath`; with no leftover the key is absent. A path with extra segments is not `not_found`.
- **`docline` instead of docstrings.** Entries take `docline` in `registerRoute`; the owner doc is the static `docline` field of the class
  (own property, not inherited).
- **`mediaType` on `ReturnValue`.** The Python result block uses `media_type`.
- **`nodes()` shape.** `{name, description, ownerDoc, entries, routers}`; each entry has `name`, `doc`, `parameters`, `meta` and, when a
  `ReturnValue` was given, `result`. Python keys `router`, `instance`, `plugin_info`, `callable` and the JSON Schema `params` block are absent.
- **`RouterNode.metadata`** returns `{name, docline, meta, result}`; Python returns only the `meta` dictionary.
- **`resultWrapper(value, metadata)`** takes the metadata as an object, not as keyword arguments.
- **Errors.** `router.errors` of the router `node()` is called on applies to the whole path, as Python's `errors=` of `node()`. It maps `not_found` to `NotFound` and `signature_error` to `TypeError`. The default `TypeError` re-raises the
  bind error itself; a replacement class is raised as `new Class(selector, {cause})`.
- **Segment decoding.** Each path segment must match the text form of its parameter's code (`L` digits, `B` `true`/`false`, `D` `YYYY-MM-DD`, ...),
  then it is decoded with `fromTytx('<segment>::<code>')`; a segment out of format or that the code rejects makes the node `not_found`.
- **State.** Per-instance and per-function state lives under module-level `Symbol` keys; there are no `#private` fields.

## Python features not implemented

- lazy `cls` + `params` branches
- `remove_branch`
- aliases
- `include`
- `router_at_path`
- `Section`
- `endpoint_id`
- `get_url`
- contexts (`RoutingContext`)
- prefix stripping
- plugins
- capabilities
- authorization, environment and channel handling (`NotAuthorized`, `NotAuthenticated`, `NotAvailable`)
- command line
