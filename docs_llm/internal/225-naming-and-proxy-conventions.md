# 225 · Naming and proxy conventions

Document ID: **GC-225**. Started: **2026-10-06**. Each rule names the owner
decision it comes from. Sections marked **Open** record a question, not a rule.

<a id="gc-225-005"></a>

## 005 · Names come from written conventions

Block ID: **GC-225-005**.

- Every name (class, proxy, method, attribute, file, grammar entry, command) applies
  a convention written in this document or in the document it points to.
- A name is never chosen because it is nice, descriptive or easy.
- When no convention covers a case, the convention is decided with the owner,
  written here, and then applied, in this order.
- A naming proposal cites the convention it applies, or states that none covers
  the case.

Owner, 2026-10-06: "le convenzioni sono il fondamento delle decisioni di naming.
Nessun nome deve essere bello, brutto o descrittivo e facile: deve rispettare delle
convenzioni e se per un naming mancano delle convenzioni si decidono, si scrivono e
si applicano."

<a id="gc-225-010"></a>

## 010 · Conventions in force

Block ID: **GC-225-010**.

| Scope | Convention | Source |
|---|---|---|
| Python and JS | A name exists in both languages; an asymmetry is an error | constitution, owner rule 2026-09-26 (`00-constitution.md:1054`) |
| Python and JS spelling | Python uses snake_case, JS uses camelCase; the JS name is the mechanical camelCase translation of the Python name (`load_collection` ↔ `loadCollection`, `add_branches` ↔ `addBranches`). Owner, 2026-10-06: "sì, traduzione meccanica a camel" | owner decision 2026-10-06 |
| JS markers of Python decorators | A Python decorator `@x` corresponds in JS to the static method `registerX` of the base class of the declared type, called after the class: `InOut.registerRoute('sendMail', {...})`, `Page.registerSource('details')`, `Page.registerEndpoint('m')`. The method annotates the class method. The parameter check (`Signature`) left the core with the routes package in 0.2.9 and is not part of 0.2.14 (GC-230 §015); the marker annotates only. JS has no decorator syntax that Node and browsers run; a method named like the decorator would read as performing the action, while in Python the `@` makes the declaration recognisable. Supersedes the free function `source(Page.prototype.m)`; `Page.registerSource` is in force since 0.2.12 (`js/src/server/page.js`). Owner, 2026-10-06: "non mi piace la funzione volante route, preferirei avere una classe che ha vari metodi tra cui route"; "un metodo route mi pare che esegua il routing, non che lo annoti" | owner decisions 2026-10-06 |
| Server object | The server counterpart of the browser `Gramlot` is `GramlotServer`, whatever the transport (HTTP or Worker messages); the `Gramlot` prefix separates it from the other servers (Kajenn, Node, uvicorn), as `GramlotBuilder` separates from genro-builders. Derived names keep the prefix and the word `Server`: `GramlotFileServer`, `GramlotWorkerServer`, `GramlotServerOptions`; the capacity error is `ServerCapacity`. Rejected: `Host` (owner: "host mi fa schifo e mi confonde"), `ServerAdapter` (an adapter is the code connecting a framework), `EndpointHandler` (`endpoint` is reserved to `@endpoint`, `Handler` to proxies), `GramlotMain` (`main` is already the name of the whole-page fragment; up to 0.2.12 also a URL), `Servant` | owner decision 2026-10-08 |
| Python and JS servers | `GramlotServer` in Python and JS assure the same functionality; they are not identical member by member. Accepted idioms: `params` as keywords or as an object, `ValueError`/`TypeError` on configuration, page logic in `foo.js` or as the `Logic` export. Owner, 2026-10-08: "più che uguale deve assicurare le stesse funzionalità" | owner decision 2026-10-08 |
| Attribute holding the server | An attribute, property or variable holding a `GramlotServer` is named `server`. Where `server` is already taken by the server of the framework or platform (Kajenn `BaseApplication.server`, the `http.Server`/`Bun.Server` returned by `startServer`, the HTTP server of a script), it is named after the class: `gramlot_server` in Python, `gramlotServer` in JS. Owner, 2026-10-08: "ok" | owner decision 2026-10-08 |
| Files | A file is named after the class it holds: `gramlot-server.js`/`gramlot_server.py`, `gramlot-file-server.js`/`gramlot_file_server.py`, as `gramlot-builder.js` | owner decision 2026-10-08 |
| Example pages | A generic `div` is held in `pane`; `html_main` is held in `main_content`; an element is never named `page` | GC-210 row S14bis (`210-binding-contract.md:755`) |
| Commands | Environment, then verb: `gramlot <environment> new\|gallery`, `gramlot node\|bun gallery`, `gramlot-serverless build\|gallery`, `npm create @gramlot page\|site` | owner decisions 2026-10-02 and 2026-10-05; GC-055 |
| Base of the JS markers | `Exposed` (`js/src/server/page-base.js`) is the base of every JS class whose methods a request names: `Page` and the classes of the objects reached from the page by a method path (`orders.list`, constitution 11.85). It holds only `registerSource` and `registerEndpoint`; `Page` extends it, so `Page.registerSource` is the inherited marker. No convention covered the name: it reuses the word "exposed" that already names `@source`/`@endpoint` methods (`page/base.py` docstring, GC-090 table "Exposed Source method"). Python has no counterpart: `@source` and `@endpoint` are functions and the objects on a path are ordinary objects (accepted asymmetry) | owner decision 2026-10-19 (review plan d-pointer-js: common base with the markers only, `Page` extends it); name chosen in p1, confirmed by the owner on 2026-10-19 |
| Proxies of the Source node | A proxy of the Source node, reached from `this` in inline code, has a free name, clear and not ambiguous; its class states its theme in its docline. `node.requests` (class `NodeRequests`, `js/src/builder/source.js`) holds the request in flight (`inflight`: `method`, `params`, `sentAt`, `cancel()`) and the waiting call (`pending`: `method`, `params`) of `remote`, `dataRpc`, `dataRemote` and `remoteSource`. Browser-only, as `PUT` and `FIRE`: no Python counterpart | owner decision 2026-10-19 (review plan d-oncalling: "i proxy del Source node hanno nomi liberi purché chiari e non ambigui"); name chosen in p1 (d-oncalling-open), confirmed by the owner on 2026-10-19 |
| Server adapter of the page | `gramlot.serverAdapter` is the object of the browser page that holds the server-dependent behaviour; the core consults it, it is not a proxy (owner decision 2026-10-19, review plan d-pointer-separator). Its class is `ServerAdapter`; a subclass names its kind of server before the word, as the transports do (`HttpTransport`, `WorkerTransport`): planned `WorkerServerAdapter`, `KajennServerAdapter`. The row "Server object" rejects `ServerAdapter` as the name of the server object (`GramlotServer`); this class is a different object, on the browser side. Its factory method is `createTransport`, after the `create<Thing>` functions of the code (`createNonce`, `createDispatch`). The module the server names in the bootstrap is `resources.serverAdapter`, read by `PageBootstrap.loadServerAdapter`; the server property is `server_adapter`/`serverAdapter` | `serverAdapter` decided by the owner on 2026-10-19; the class name, `createTransport`, `loadServerAdapter` and the server property chosen in review p4, to be confirmed by the owner |
| Name syntax | `NameSyntax` holds the syntax of a method name a server declares; `NAME_SYNTAX` is the core default; the server property, the builder property and the bootstrap field are `name_syntax`/`nameSyntax`; `matches(name)` tests a name. No convention covered the name: it uses the words of the decision ("la sintassi del nome"). Its serialisation follows genro-builders `CustomTypes`: `to_dict`/`from_dict` in Python, `toJSON`/`fromJSON` in JavaScript, an exception to the mechanical camelCase translation, as in the library it extends. `NameSyntax` extends the genro-builders `Regex` in Python | chosen in review p4, to be confirmed by the owner |
| Synchronous call | The synchronous variant of a call takes the suffix `Sync`, as in the JavaScript platform (`readFileSync`, `execFileSync`): `gramlot.rpc.callSync`, the transport `callSync`, `NodeBinding.callSync`, `NodeRequests.submitSync`. The capability of a transport is `supportsCallSync`. Browser only: no Python counterpart. The `dataRemote` attribute is `sync`, the legacy name | owner decision 2026-10-19 (synchronous call and `dataRemote` `sync`); `callSync`, `supportsCallSync` and `submitSync` chosen in review p4, to be confirmed by the owner |
| Operations shared by the adapters | `GramlotServer.decode_body`/`decodeBody` (request body to text), `close(text)` (the close message, beside `call(text)` for the request envelope, both named after the action of their URL), `theme_css`/`themeCss` (the theme URL of a page class); `GramlotFileServer.companion_file`/`companionFile` and `theme_file`/`themeFile` (the files of GC-230 §145, the words of §145). `call` takes `identity` beside `owner`, and `evaluate_auth`/`evaluateAuth` receives it | chosen in review p4 (decision d-adapter-api), to be confirmed by the owner |
| Theme of a page | The page attribute keeps the legacy name in both languages, as `css_requires` and `js_requires`: `css_theme` (`static css_theme` in JavaScript); `False`/`false` loads no theme. The `GramlotServer` option follows the camelCase translation: `css_theme` in Python, `cssTheme` in JavaScript | owner decision 2026-10-19 (d-theme: base theme as a server option, `css_theme` on the page); the "no theme" value chosen in review p4, to be confirmed by the owner |

Widget-name exception (owner, 2026-10-16; constitution 11.84): widget authoring
names are identical in Python and JavaScript. Do not translate a compound widget
name into snake_case in Python. Use one canonical spelling in metadata and docs;
prefer case-insensitive lookup, already supported by both installed Builders.
For example, the proposed `radioButtonText` spelling is shared by both languages;
`radiobuttontext` is a case variant, while `radio_button_text` is not. This exception
concerns widget names, not parameter names or ordinary Python/JS methods and classes.

<a id="gc-225-015"></a>

## 015 · Primary objects and proxies

Block ID: **GC-225-015**.

Decided proxies of `Gramlot`, each with the theme of its class docline:

- `gramlot.src` (`SourceHandler`): the Source and every change of it. Holds
  `builder`, `source`, `renderer`, `binding`, `logicRegistry` and the functions
  `startSource`, `mountMainSource`, `prepareSource`, `remoteSource`.
- `gramlot.rpc` (`RpcHandler`): the exchange with the server. Holds `transport` and
  `remoteRequests`.
- `gramlot.dom` (`DomHandler`): the DOM and its correspondence with the Source.
  Holds `getDomNode`, `getBaseSourceNode`, `reference`.
- `gramlot.utl` (`UtilitiesHandler`): page utilities grouped by theme. Holds the
  group `inout` (`gramlot.utl.inout.sendMail`). Owner, 2026-10-06:
  "gramlot.utl.inout.sendMail".

Decided for the first pass of 0.2.10 (owner, 2026-10-07: "va bene: è un primo
passo"):

- Every handler extends one base class `Handler`, whose constructor stores the
  `gramlot` reference and does nothing else.
- A handler has no implicit delegation to `Gramlot`: no alias, getter or
  forwarding for a moved name.
- The handlers are created at startup, in `Gramlot`'s constructor: `src`,
  `rpc`, `dom`, `utl`. The binding order is the one of source plan §4.3 — the
  builder, then the binding subscribed to its Data, then the renderer — and
  `SourceHandler` sets `gramlot.src` before creating its classes, because the
  binding reaches the builder through it. `InOut` and `gramlot.data` come after
  the renderer: nothing reads them during construction. Owner, 2026-10-07: "ok".

Decided by the owner on 2026-10-06, after the legacy `genro` object
(`genro.rpc` → `GnrRpcHandler`, `genro.src` → `GnrSrcHandler`):

- A primary object has three kinds of members only: its own lifecycle functions,
  its data, and proxies.
- A proxy is a defined element with rules. It holds one theme; every function of
  that theme lives in the proxy, never on the primary object.
- The class of a proxy states its theme in one sentence in its docline.
- A function of the browser is reached by a logical path
  `gramlot.<proxy>.<group>.<function>`: the proxy names the theme, an optional
  group names a part of it (`gramlot.utl.inout.sendMail`). Owner, 2026-10-06: "il
  punto è di avere una sorta di route logica gramlot.xxx.yy.zzz".
- The class of a proxy is the full word of its theme followed by `Handler`, with
  no product prefix: `gramlot.utl` → `UtilitiesHandler`, `gramlot.src` →
  `SourceHandler`, `gramlot.rpc` → `RpcHandler`, `gramlot.dom` → `DomHandler`
  (RPC and DOM are already full names). Owner, 2026-10-06: "preferirei che la
  classe primaria di proxy gramlot.foo si chiamasse FooHandler"; then "allora farei
  utl UtilitiesHandler", and for the general rule "sì, più o meno".
- The name of a proxy is three lowercase letters, so that a proxy is recognised
  by its name, as in the legacy (`genro.rpc`, `genro.src`, `genro.dom`). Owner,
  2026-10-06: "qualsiasi sia deve essere riconoscibile; per ora con le tre lettere
  ce la siamo cavata bene".
- A handler is a namespace branch of `gramlot`: it groups the functions of its
  theme and manages the existing classes of that theme (for example the renderer,
  the transport). It does not replace them, and their names do not change.
  Owner, 2026-10-06: "le classi vanno bene [...] le classi handler sono solo dei
  diramatori in namespace da gramlot".
- A handler is not a `RoutingClass`: in the browser the functions of a handler
  are called directly, there is no routing. The decision of 2026-10-06 is
  superseded; the routes package written for it left the core in 0.2.9 and lives,
  unpublished, in `genro-org/genro-routes-js`. Owner, 2026-10-07: "nel browser non
  c'è un vero routing ma chiamate dirette".
- The browser primary object is `Gramlot`. On the server the same rules apply to
  `Page`. Kajenn terminology (server, application, `code`, `mount`, avatar) is the
  reference on the server side.

Owner, 2026-10-06: "i proxy server e client sono elemento definito con regole.
Quindi la scrittura del codice non è totalmente libera e di fantasia ma deve
adattarsi a regole e cercare una standardizzazione."

<a id="gc-225-020"></a>

## 020 · Open

Block ID: **GC-225-020**.

- No open question. The question on `Host` (primary object with proxies or
  boundary object) is closed by the name `GramlotServer` (§010, owner 2026-10-08)
  and by the protocol rules of GC-230: the server object exposes the protocol,
  its adapters connect it to a framework.

<a id="gc-225-025"></a>

## 025 · Current code against these rules

Block ID: **GC-225-025**. State after 0.2.14 (browser in 0.2.10, server in 0.2.12,
client/server contract in 0.2.14).

- `Gramlot` (`js/src/gramlot.js`) holds only lifecycle (`start`, `loadMain`,
  `dispose`, `abort`, `pagehide`, `loading`), data (`pageId`, `state`, `data`,
  `logic`, `window`) and the proxies `src`, `rpc`, `dom`, `utl`. No themed
  function is left on `Gramlot`.
- The handlers live in `js/src/handlers/`; the existing classes they hold keep
  their names.
- `gramlot.rpc` (`RpcHandler`) has one function, `call(contentType, name, params,
  {signal})`, which sends the GC-230 envelope and resolves with the value or rejects
  with `RpcError`. It holds the transport: `HttpTransport` (`js/src/http-transport.js`,
  formerly `MainTransport` in `transport.js`) or one injected with the same `call`.
  `call` is the one cancellation: `signal` and `gramlot.abort` abort it, it rejects at
  once; `remoteRequests` = AbortController per call in flight by envelope id, written
  only by `call`.
- Review 0.3.5 p3 names (internal, browser): `NodeBinding.call(contentType, request)`
  (as `RpcHandler.call`; node close aborts); `SubscriptionsHandler.subscribeNode(node,
  callbackFor)` (as `publishNode`); `BindingRuntime.askDialog` (as `inlineCompiler`);
  `BindingRuntime.subscriptions` = private `_subscriptions` given at construction.
  No convention covers a shared module function: `randomId()` in `js/src/random-id.js`
  is chosen by the implementation, not yet confirmed by the owner.
- `GramlotServer` (`src/gramlot/server/gramlot_server.py`,
  `js/src/server/gramlot-server.js`) and `GramlotFileServer` assure the same
  functionality in both languages: `close_all`/`closeAll` empties the registry,
  the base `Page` is rejected as a page, an unknown Source method raises
  `SourceNotFound`, the Source builder carries the method name, JS errors carry
  their class `name`, `GramlotFileServer` reloads pages per `reload`/`GRAMLOT_DEV`.
  Both answer every envelope with `call` and announce `capabilities`; the
  `auth` evaluator is `evaluate_auth`/`evaluateAuth`.
  The page registry is private in Python (`_pages`, `_prune`) and public in JS
  (`pages`, `prune`); adapters call `close_all`/`closeAll` instead of reaching the
  registry. `registerPage` exists only in JS: only the
  serverless Worker uses it.
  The run of a request and its parsing are private in both languages: `_run`/`#run`,
  `_parse_request`/`parseRequest` (a module function not exported). The expiry of a
  page used now (opening and each accepted call, GC-230 §010) is `_expiry`/`#expiry`,
  private as the run, so there is one place that adds `page_ttl`/`pageTtl` to the clock.
- `Page.registerSource` replaces the free function `source` in JS; Python keeps
  `@source`. Endpoints are declared with `@endpoint` (Python) and
  `Page.registerEndpoint` (JS), both with an optional `auth` rule.
- `Exposed` is the JS base of `Page` and of the classes reached by a method path; it
  holds `registerSource` and `registerEndpoint`. `resolve_declared`/`resolveDeclared`
  (`page/base.py`, `page-base.js`) resolve a request name, `method` or
  `a.b.c.method`, from the page (constitution 11.85).
- `node.requests` (`NodeRequests`) is the one proxy of the Source node: the request
  rule of `remote`, `dataRpc`, `dataRemote` and `remoteSource` (constitution 11.85).
- The protocol of every adapter is GC-230 (contract and realisations), with the
  conformance check `check_protocol`/`checkProtocol`.

<a id="gc-225-030"></a>

## 030 · Dedicated inspector tool

Block ID: **GC-225-030**.

Owner, 2026-10-14: "esatto : ora noi dovremo fae poi molti webcomponent ma ueto è a
parte e dovrebbe evere un suo nome sesempio gramlot-tools-inspector", followed by
the explicit implementation instruction recorded in constitution 11.61.

The dedicated tool and custom-element name are `gramlot-tools-inspector`.
`GramlotToolsInspector` is the mechanical class spelling of that name; its file is
`gramlot-tools-inspector.js`, applying §010's class/file convention. Its folder is
`tools/gramlot-tools-inspector/`. The explicit target property is `gramlot`, using
the existing name for a browser `Gramlot` instance. Browser lifecycle methods use
the platform's `connectedCallback` and `disconnectedCallback` names.

This names this browser-only component; it establishes no general Web Component
naming hierarchy, Python widget grammar, registry, or server counterpart. Local
state and implementation methods follow the existing JS camelCase spelling.

The optional package entry is `@gramlot/gramlot/tools/inspector`, separate from
the core runtime entry. The component's native `close` event reports user closure.
The gallery uses `gallery:inspector-set` and `gallery:inspector-state`, following
its existing `gallery:theme-set`/`gallery:theme-ready` message convention. The
footer button is `gallery-inspector`; these are gallery-local HTML IDs/messages,
not framework proxies or a new component registry.


The owner's editing/breakpoint correction (11.61, 2026-10-14) retains the same
component name and target property. Internal editor state uses `editor` and
`breakpoints` Data paths; named Logic methods use camelCase (`applyEdit`,
`addAttribute`, `removeAttribute`, `setBreakpoint`, `removeBreakpoint`). Breakpoint
roots are `data` and `source`, modes are `debugger` and `console`, following the
DevTools tool's existing vocabulary. No new core proxy or public event is added.


The owner-approved 2026-10-18 structural inspector increment retains these conventions:
`InspectorHistory` / `inspector-history.js` follows the existing InspectorStyles class/file
pattern. Local `history` and `insert` Data paths and camelCase Logic methods describe
tool-owned state. Commands `catalog`, `insert`, `remove`, `move`, `undo`, `redo` extend
the explicit bridge protocol; `history` reports available operation labels. The tree
adds `dragEnabled`, `fixedPaths`, `revealPath` and `rowActions.position` (`start`/`end`)
and `hiddenPaths`, following its existing property vocabulary. `tree-drop` extends
`tree-action` with `{path, destination, placement}` (`before`/`inside`/`after`).
`application/x-gramlot-source` identifies an internal native drag, not a serialized
Source or a public transfer format. These are tool contracts, not core proxies.


<a id="gc-225-035"></a>

## 035 · Provisional inspector components

Block ID: **GC-225-035**. Owner decision: constitution 11.62.

The generic Source element is `webcomponent` in both languages, with the literal
`code` parameter. Temporary custom elements use `gramlot-poc-<name>`, separate from
`gramlot-tools-inspector`. Their implementation lives under `tools/poc/`; classes
and files mechanically follow the tag (`gramlot-poc-tree` → `GramlotPocTree` and
`gramlot-poc-tree.js`). Helpers follow the Python/JS spelling rule:
`webcomponent_code` ↔ `webcomponentCode`.

The tree preserves PoC property names `storeBag`, `selectedPath`, `rowActions` and
its `tree-action` event. Selection uses the browser `change` event, handled through
`connect_onchange`. No `gnr-set` compatibility route is introduced. These are
provisional component contracts, not a general property-binding convention.

The composition applies the same mechanical naming to `gramlot-poc-palette`,
`gramlot-poc-tabs` and `gramlot-poc-splitter`. Palette `title`/`close` and tab
`role`/`aria-selected` use platform vocabulary. The splitter slots are `top` and
`bottom` for its bounded vertical layout. Tree row actions retain their descriptor
and add `activePaths` (relative paths) for the DevTools breakpoint indicators.
These names describe provisional component internals, not additional core proxies.

The approved frame bridge uses `InspectorConnection` (panel-side connection),
`attachInspectorAgent` (explicit page-side binding) and `targets`/`selectedTarget`
on the tool. Target records use `id`, `title`, `connection`; these are tool-local
metadata, not application Source proxies. Files use `inspector-bridge.js`. Gallery
handshake names `gallery:inspector-ready` and `gallery:inspector-connect` extend
the existing gallery message prefix; actual inspection uses a transferred port.

The owner's 2026-10-14 indicator correction extends the existing `activePaths`
row-action descriptor with `conditionalPaths`, using the same relative-path
convention. It marks which active breakpoint indicators are conditional; the
CSS state class is `conditional`. No new core API or application state is added.

The owner's 2026-10-14 palette correction adds `collapsed` as a boolean property
and reflected attribute on `gramlot-poc-palette`, following native boolean
attribute conventions. Its toggle uses standard `aria-expanded`/`aria-controls`.


Root installation and index-page names (11.63): `installable`, `app_icon` ↔
`appIcon`, and `manifest(base_url=...)` ↔ `manifest({baseUrl})` follow the Page
property/method and mechanical snake/camel conventions. `page_manifest` ↔
`pageManifest` belongs to GramlotServer. The reusable Page is `IndexPage`, in
`index_page.py`/`index-page.js`; its authoring hooks use the same snake/camel rule.
The application-root manifest resource is `app.webmanifest`, with standard web
manifest keys (not translated to Python spelling). These names implement the
owner-confirmed root-installation and reusable-index scope of 11.63.

The index's properties are `logo_url` ↔ `logoUrl`, `shell_id` ↔ `shellId`, and
`navigation`; navigation records use `key`, `title`, `children` and `url`.
The Page hooks are `introduction`, `group_panel` ↔ `groupPanel`, `panel`, `header`, `footer`
and `behavior`. `IndexLogic.indexMount` and `mountIndexPage` name the browser
implementation, exported through the Page entry; the runtime subpath is
`index-page-runtime`. Shell DOM classes use `index-`; the owned-frame theme
messages use `index:theme-ready` and `index:theme-set`. These are index internals,
not new builder attributes or markers. Gallery-specific content keeps its names.

Phase 4 uses `require_style_class_attributes` ↔ `requireStyleClassAttributes`
for the shared renderer guard, following existing `require_no_script_attributes`
↔ `requireNoScriptAttributes`. This is an internal validation function for the
already approved string/null contract, not a new authoring API.


<a id="gc-225-040"></a>

## 040 · Public messaging methods and private subscriptions

Block ID: **GC-225-040**. Owner decisions: constitution 11.68, superseded in
access-point placement by 11.70 (2026-10-15).

The primary command is `gramlot.publish(topic, payload)`, with one object of named
data. It delegates to an instance-owned subscription service. Applications do not
publish through `gramlot.subscriptions.publish`; there is no second public alias.
The owner corrected the earlier access-point decision: "poi ho detto che preferisco che il comando sia gramlot publish e poi lui usi subscriptions o addirittura _sunscriptrios per ditre che è privato".

Owner follow-up (constitution 11.70): "anche subscribe e unsubscribe li metterei direttamente su gramlot, con _subscriptions privato. poi vediamo come fare il publish verso un nodo specifico".
The public methods are `gramlot.publish`, `gramlot.subscribe` and
`gramlot.unsubscribe`. Their instance-owned service is named `_subscriptions`,
a private property, not a public proxy. The earlier long public proxy exception
is superseded. Internal class/file names still require a naming record before
implementation.

Subscription signatures, further publication options, Source declarations and
delivery/lifecycle/routing semantics remain proposals. The syntax for publishing
to a specific node is explicitly left for a subsequent design discussion.
The object payload was selected under the owner's explicit delegation in 11.68;
reference restoration remains in scope under 11.69. No new runtime API is claimed.


Implementation follow-up (11.72): preserve the legacy topic string or object
containing `topic`, `nodeId`, `parent`, `iframe` as appropriate; no third routing
argument. `nodeId` is the legacy descriptor key and refers to Gramlot's existing
`node_id` Source identity. `SubscriptionsHandler` / `subscriptions-handler.js`
follow the established Handler/class-file convention and are private behind
`_subscriptions`; public `subscribe(topic, callback)` returns a registration for
`unsubscribe(registration)`, as the legacy topic subscription API. Source-node
`publish(topic, payload)` retains the legacy self-topic operation. Source-node
`subscribe`/`unsubscribe` already belong to Bag change observation and must not be
overridden. Declaration prefixes retain the legacy spelling. No public alias or
second registry is introduced for authored references.


Interframe implementation naming (11.72 postMessage follow-up): internal
`FrameMessages` in `frame-messages.js` describes the transport responsibility,
following existing PascalCase class / kebab-case file convention. The protocol
marker `gramlot:publish` is namespaced to this application messaging feature,
separate from inspector messages. No new public proxy or page authoring API.


Native ask implementation: internal `AskDialog` / `ask-dialog.js` follows the
class/file convention. One generated `ask_<id>` named Logic group per page owns
its request lifecycle. Each dialog has a temporary `ask_<id>` Source branch and
Data context, removed on completion/disposal; these are private generated names,
not the deferred reserved `_gramlot` system Data contract. Existing `ask`/`_ask`,
`_ask_if`, `_ask_title`, `_ask_onCancel`, `askIf`, `_if` and `_askResult` retain
legacy spelling. Fluent `.ask()` remains unimplemented rather than an alias.


Transport boundary: internal `assertTransportData` in `references.js` rejects live
Source nodes and DOM objects before TYTX serialization for RPC or frame messages.
It validates named payload content, including Bag values/attributes; it does not
convert live objects to alternate addresses or resolve descriptors remotely.


Inspector CSS trial (11.73): `InspectorStyles` / `inspector-styles.js` follows
§010's class/file spelling and §030's browser-only tool boundary. The tab and its
private Data branch are `styles`; named Logic and explicit port commands use
camelCase (`setStyle`, `resetStyle`, `resetStyles`). Existing CSS variables keep
their `--gramlot-` names. No core proxy, JS marker or Python authoring API is added.

Inspector CSS download (11.73 follow-up): private `styleDownloadUrl` and
`styles.downloadUrl` / `styles.noDownload` follow the tool's camelCase field
and Data conventions. The downloaded artifact is `theme-overrides.css`, as
approved in the owner's download proposal. No new public API or port command.

Shared DevTools inspector (11.74): `inspector-agent.js` holds the existing
`attachInspectorAgent` responsibility without importing a page runtime. The
optional package entry is `@gramlot/gramlot/tools/inspector-agent`, alongside
`tools/inspector`. The `embedded` attribute selects panel presentation. The
extension retains its existing namespaced envelope and uses `connectionId` to
isolate each explicit inspection connection. No core proxy or discovery marker.

The existing `inspector-bridge-` subscription prefix has a random per-connection
suffix, avoiding collisions between separately loaded copies of the shared agent.


Plain button (11.75): `html_button` uses the existing `html_` authoring convention
but is a distinct Source tag in both languages; grammar `render_tag: button`
maps it to native HTML. `button` keeps its Gramlot identity. `_delay`, `_counter`
and `button_counter` retain their existing/legacy spelling. No new proxy or marker.


<a id="gc-225-045"></a>
## 045 · Localization type and shared page metadata

Owner, 2026-10-16: proposes `intl_str` for localizable parameters in Builder/Routes
signatures, distinguishes SQL `name: str` from `name_long`/`name_plural: intl_str`,
and confirms that display `label` must be typed accordingly. The name denotes a
semantic string type. Owner follow-up accepts the design alias
`intl_str = Annotated[str, "intl_str"]`: the same spelling identifies the annotation
marker. Concrete text stays in arguments/defaults; values stay strings. The shared
Genro owning package/import path and Routes/JS descriptor details remain undecided.
Do not invent additional public aliases, a string subclass or a TYTX value tag.

Owner names `pages/_metadata` and confirms it holds common page properties, including
source language. Preserve `_metadata` as the chosen location/name direction; no
extension, file format or specific source-language metadata key has been chosen.
See [GC-240](../future/240-localization-decisions.md) and constitution 11.78.
These names are recorded for design; no API implementation is claimed.

<a id="gc-225-050"></a>
## 050 · Shared labelbox presentation

Owner-approved contract, 2026-10-16 (GC-205 §090; constitution 11.79): `labelbox`
names shared label/control presentation, not yet a standalone Builder method or
custom-element tag. `lbl` is its localizable label text. `lbl_` addresses label
attributes; `box_` addresses the outer container; `box_l_` and `box_c_` address
the label and control containers. Specific groups take precedence over `box_`.
The explicit parameter `lbl_position` takes precedence over generic `lbl_` routing.
Its resolved values are `TL`, `TC`, `TR`, `L`, `R`, `BL`, `BC`, `BR`; omission defaults
to `TL`. It accepts a literal or reactive pointer, including `^position`.

Use `lbl_position` instead of legacy `lbl_side`; no alias, `lbl:position` syntax or
`lbl_c_` group is introduced. This settles these contract names only; JS descriptor
keys, classes, DOM tags and the input's authoring name remain proposals.

<a id="gc-225-055"></a>
## 055 · Pointer templates, expressions and placeholders

Owner confirmation, 2026-10-16: "ok teniamo : per i template e := per le espressioni,
con {} per il valore e {nome} per gli altri attributi. aggiorna il contratto".
Use `pointer:template` for text interpolation and `pointer:=expression` for a typed
JavaScript expression result. Recognize the explicit delimiter; do not infer mode
from content. In both modes `{}` denotes the resolved pointer value and `{name}`
another resolved attribute of the same Source node. `#` is not a placeholder.

Examples: `width="^width:{}px"`, `width="^width:{}{unit}"` with `unit="^settings.unit"`,
and `readonly="^draft:=!{}"`. This is shared attribute-pointer syntax, not CSS-only.
Owner clarification excludes widget `value`: neither suffix mode is permitted there;
ordinary `value="^name"` remains unchanged. See GC-210 §095 for the exact boundary.
`mask` uses `{}` instead of `%s` in the new design; no `msk` or legacy placeholder
alias is approved. The intervening `#`, automatic mode-detection and always-evaluate
proposals are superseded. Historical scope: that decision did not remove `${...}` templates. The owner-authorized Builder alignment of 2026-10-17 now makes ordinary `${...}` text literal; use explicit pointer suffixes.

Owner follow-up accepts required-by-default template slots: `{}` / `{name}` block
composition and return null on an empty string, while `{?}` / `{?name}` explicitly
allow empty-string interpolation. The `?`
marker does not allow null or nonexistent attributes. This scope is text templates;
expression-mode optional slots and standalone mask behavior are not inferred.

See GC-210 §095 and constitution 11.81 follow-up for scope, typed-value handling and
remaining grammar/consumer details. These names now have a development implementation, not a published release; expression evaluation must not paste data contents into executable code.

Owner path-name correction (2026-10-16, constitution 11.81): every path segment
name matches `[A-Za-z0-9_]+`; dots separate segments. Existing addressing operators
remain syntax rather than part of a segment name. Thus `:` cannot be a name
character: the first `:` opens the suffix and a following `=` selects expression
mode. Further colons are part of the template/expression. No escape for colons in
path names is needed. This is the intended Gramlot contract; the currently permissive
Bag implementation is not changed by this record. Owner follow-up does not require
runtime validation: callers using other characters are outside the supported contract
and may encounter side effects. Documentation alignment for both Python and JavaScript
is requested in [genro-bag #73](https://github.com/genro-org/genro-bag/issues/73).

Implementation naming (2026-10-16): internal `binding/pointer.js` owns
`pointerTransform`, `pointerDependencies`, `preparePointerItems` and
`resolvePointerAttribute`; these are
module functions, not new application proxies. Python static authoring uses
`page/pointer.py` with snake_case equivalents. Source uses Builder's existing
runtime-value resolver hook to supply transformed, typed attribute values. A
per-resolution `current` map holds all Source attribute inputs, shared by named
references and projection; it is neither DOM-derived nor persistent page state.
`InlineCompiler.compilePointerExpression` uses the existing activated-code compiler.
Typed expression inputs use the compiler-local parameter `_pointerValues`; it is
not a Source attribute or a public variable. Existing datapath/timer registration
fields become private registration sets to include named reactive dependencies.
Owner confirms "Sì, _F locale alle espressioni": `_F` is an expression-local helper
calling the owning page's `gramlot.format`; it is not installed on window/globalThis.

<a id="gc-225-060"></a>
## 060 · Formatting entry point

Owner-confirmed direction, 2026-10-16 (constitution 11.82): use `gramlot.format`
for formatting a value. Do not introduce the competing `gramlot.formatter.format`
proxy or a formatter-factory meaning for this entry point. Recover the useful
legacy `_F` calling model with a modern implementation; the exact overloads,
supported patterns and helper exposure are still to be documented and confirmed.
Natural-language date parsing remains a separate responsibility. This is an
accepted API name and implementation assignment, not a claim of shipped support.

<a id="gc-225-065"></a>
## 065 · Date-expression parser port

Owner, 2026-10-16: "allora portiamola subito in gramlot" after the demonstrated
PoC `parseDateExpression(text, options)` API. Preserve this function name and its
`workdate`, `locale`, `twoDigitYearAhead` options and result keys. It is a named
JavaScript package export, usable by page Logic, Node and Workers. It is not a
new Gramlot proxy, instance alias or Python Builder method. Keep the bounded
PoC `date-parser/index.js`, `civil.js` and `locales.js` module organization.
Public type names follow the function: `DateExpressionOptions`,
`DateExpressionResult`, `DateExpressionErrorCode`. No alternate parser API is
introduced. See constitution 11.83 and PORT-0009-date-expression-parser.


Toolbox alignment, owner "o procedi", 2026-10-16: retain this JS API, but
`twoDigitYearAhead` has the same numerical meaning as Python `pivot_year`.
The window is now [work year + value - 100, work year + value - 1].
Empty input returns an open period; `EMPTY_EXPRESSION` and `REVERSED_RANGE`
are no longer parser error codes. No alternate spelling or compatibility option.

Formatter option follow-up — 2026-10-16: owner "ok" confirms the second argument
as a pattern string or options object using `pattern`. The short string form means
`{pattern: string}`. `format` remains the operation name; no `format` option alias
is approved. See GC-235 §085 and constitution 11.82 follow-up.

Incremental formatter implementation, 2026-10-16 (owner "per ora impostalo anche
se incompletom"): retain the sole public method `gramlot.format(value, options)`.
`FormatOptions` names its TypeScript options, following the method's name.
Internal `format.js`/`formatValue` implement that method without another package
export or public proxy. Initial options are the agreed `pattern`, `locale` and
`mask`; no page-locale configuration name or `_F` alias is introduced yet.

Formatter dtype follow-up — 2026-10-16: owner "ok" approves `dtype` as the
explicit override of inferred type, retaining the legacy spelling. Temporal
codes follow TYTX: D, H, DHZ; numeric codes L, R, N are accepted for matching
finite JavaScript numbers, without conversion of strings or Decimal objects.
The explicit instant timezone option uses the standard Intl spelling `timeZone`;
no synonym or page-context storage API is introduced. These extend FormatOptions
for the bounded formatter implementation authorized under constitution 11.82.

Page formatting context — 2026-10-16: owner authorizes "procedi con locale e
timezone della pagina e poi collega format e mask al motore", for an intermediate
release before 0.3 web components. Page metadata uses `locale` and Python
`time_zone` / JavaScript `timeZone`, following existing Page snake/camel naming.
Bootstrap and browser instance use `locale` / `timeZone`; individual call and
Source display attributes override page context. Source's existing `format`
attribute supplies the formatter's `pattern`, while `mask` composes the result
using `{}`. No new `_gramlot` Data initialization protocol or pointer suffix
implementation is implied. Missing-page-context policy is under owner discussion.


Component increment (owner approval, 2026-10-16; constitution 11.84):
`defineComponent`, `defineCollection`, `NativeControl`, `ChoiceGroup`, `Labelbox`,
`FieldState`; descriptor keys `name`, `tag`, `base`, `mixins`, `parameters`,
`implementation`; hooks `createControl`, `readControlValue`, `writeControlValue`.
Widget names: `textbox`, `checkbox`, `radioButtonText`; DOM tags:
`gramlot-textbox`, `gramlot-checkbox`, `gramlot-radio-button-text`.
Internal collection wrapper `ComponentCollection`, DOM projection `projectAttributes`
and control adapter `ComponentControl` describe their existing responsibilities.
Portable `_meta.gramlot_component` carries effective parameter descriptors and
`_meta.render_tag` carries the DOM name; it does not use Builder's recipe marker
`component`. Module files follow kebab-case. These internal names add no proxy.


Component gallery loading — 2026-10-16: the approved application option is
`collections` in both Python and JS, with entries `grammar` (portable JSON object)
and `module` (browser ES module URL). Bootstrap `resources.collections` carries
these module URLs. This uses the existing collection vocabulary; component names
remain textbox, checkbox and radioButtonText in both languages.

Gallery toolbar follow-up (owner, 2026-10-16): `header(shell)` follows the existing
`footer` hook spelling in both languages; `code_panel` ↔ `codePanel` follows the
ordinary snake/camel method rule. Optional shell controls and sidebars retain the
`index-` internal DOM prefix; gallery markup and styling retain `gallery-`.

Simple input family (2026-10-16 owner scope, GC-245 inventory): canonical widget
names are `textBoxArea`, `passwordbox`, `radioButton`, `colorpicker`,
`horizontalSlider`, `verticalSlider`, identical in Python/JS with existing
case-insensitive Builder lookup. `textBoxArea` preserves the inventoried PoC/legacy
name and leaves native `textarea` unchanged. DOM tags are respectively
`gramlot-text-box-area`, `gramlot-passwordbox`, `gramlot-radio-button`,
`gramlot-colorpicker`, `gramlot-horizontal-slider`, `gramlot-vertical-slider`.
Descriptor exports use the existing PascalCase convention. Native parameters
keep `rows`, `cols`, `min`, `max`, `step`; radio keeps the existing `group` and
boolean `value` contract. `number` in component metadata exports Python `float`.


Component dtype correction — owner confirmed, 2026-10-16: portable parameter
metadata uses `dtype` with the shared Gramlot/TYTX codes. `nullable` and `binding`
retain their existing meanings. Do not represent portable domain types with Python
module/class names. This supersedes the component-specific primitive type mapping
as the implemented component contract. Existing
`intl_str` qualification must remain distinguishable from underlying text type.


Typed editor implementation, 2026-10-16: canonical names numberTextBox, dateTextBox, timeTextBox follow GC-245's PoC inventory; tags gramlot-number-text-box, gramlot-date-text-box, gramlot-time-text-box. Portable annotation shape is {kind: 'dtype', dtype: code}. Component dtype metadata exports that shape, with nullable/binding union branches. Internal typed-editor.js owns draft/commit presentation; TypedEditor composes NativeControl. acceptControlValue, setPageContext and sameControlValue extend the shared control protocol without an application proxy.

The runtime page context passes the existing TYTX names createDecimal, isDecimal and getDecimalLibrary unchanged; it is not a second registry or public proxy. A dtype array declares a union.


Choice inputs — owner-confirmed API, 2026-10-16: filteringSelect and callbackSelect retain identical canonical Python/JS names; descriptor exports FilteringSelect and CallbackSelect; tags gramlot-filtering-select and gramlot-callback-select. Parameters value, values, callback and placeholder retain PoC roles; callback names existing Logic, whose (node, keywords) signature is unchanged. Keywords _querystring/_id and result rows/identifier/caption retain the PoC spelling. Internal ChoiceEditor composes NativeControl and owns popup/draft/identity presentation in choice-editor.js; page context callLogic invokes the existing registry, isActive checks binding lifetime. Internal commitOnChange prevents query text from live-writing Data; releaseControl invalidates async work when the binding detaches. These are component/runtime protocol members, not public application proxies.


Remaining local choices — 2026-10-16 owner scope: canonical names comboBox and
checkBoxText retain the GC-245 inventory and same Python/JS spelling, with
ComboBox/CheckBoxText descriptor exports and gramlot-combo-box/gramlot-check-box-text
DOM tags. comboBox composes the existing ChoiceEditor and localChoices, using its
internal constrained policy (the PoC term) to distinguish free text from code
selection. checkBoxText extends the existing ChoiceGroup multiple policy. Reuse
value, values, cols, lbl and box_* rather than adding public aliases.


checkBoxText value — 2026-10-16 owner confirmation: value has dtype T, nullable,
and twoWay binding; it contains comma-separated codes or null. Reuse ChoiceGroup's
multiple/choiceType policies and values/cols declarations. No new value wrapper,
list representation or application proxy is added.


Calendar increment — owner, 2026-10-16: canonical widget `dateCalendar`, export `DateCalendar`, DOM tag `gramlot-date-calendar`; dateTextBox parameter `calendar` defaults true. Internal `CalendarView` composes the shared day/month UI, while `CalendarControl` implements the existing control protocol. These names follow the component descriptor and collaborator conventions above; there is no new public proxy or event protocol.

Calendar typed-editor collaboration uses `readDraftValue` and `selectControlValue`, following the existing read/write/accept control hooks. They are internal component methods, not a new Source or page API.


Basic validation — owner, 2026-10-17: approved legacy parameter names are `validate_notnull`, `validate_len`, `validate_notnull_error`, `validate_len_error`, identical in Python/JS; message parameters carry intl_str qualification. Internal `validateInput` evaluates these rules, `validateControlValue` gates a candidate before acceptance, and `shouldProjectControlValue` preserves a rejected draft on equal Data echoes. FieldState owns the shared message and ARIA/native validity presentation. No new application proxy or form service is introduced.

Validation presentation correction (2026-10-17): FieldState keeps the existing
field-message identity. Private #showMessage / #hideMessage own the transient
popover and its lifecycle; no public parameter, proxy or service is added.

Theme families (owner 2026-10-17): genropy-mimi and genropy-gioanna are appearance
IDs and themes/<id>/theme.css paths; the latter references legacy joanna. Generated
appearanceStyles maps IDs to canonical CSS for index/frame use. Shared CSS tokens
follow --gramlot-<role>: field-height, field-padding, field-font-size,
field-background, field-readonly-background and label-size. Existing semantic
palette/focus/error tokens also apply inside component shadow roots. No new builder
parameters or component aliases are introduced.


Gallery settings (owner 2026-10-17) follow the existing gallery-local conventions: gallery-settings and gallery-label-position DOM IDs; gallery:settings-set postMessage, with labelPosition payload. The example sentinel restores authored lbl_position; no new component parameter or core protocol. mountGallerySettings / mountFrameSettings name the gallery-owned lifecycle helpers.

Live invoice theme refinement (owner 2026-10-17): existing semantic token naming also covers field-line-height, label-gap and label-color. They control the same input/labelbox presentation in native HTML and component shadow roots; no new Source API.

Theme naming correction — owner 2026-10-17: “per i temi chiamali mimi e joanna ma non mettere genropy davanti”. Canonical IDs, selector captions and themes/<id>/theme.css paths are now mimi and joanna. This supersedes the earlier genropy-mimi/genropy-gioanna naming; no compatibility aliases.

Validation presentation refinement, owner 2026-10-17: FieldState reuses the error-background token and its existing message timer. Internal data-fading marks only the tooltip opacity transition; no public parameters are added. NativeControl sets standard assistance attributes on its internal text editor.


Touch preview (2026-10-17): Page.devices uses desktop/tablet/phone identifiers in both languages (empty means undeclared), passed as bootstrap devices and frozen gramlot.devices. The existing DOM proxy exposes setTouchMode('auto'|'on'|'off'); data-gramlot-touch and --gramlot-touch-target follow the DOM marker and semantic token conventions. Gallery-owned preview controls use gallery-preview-* identities and the existing settings-set message, with touchMode. This implements the owner's touch/page/preview request without another proxy or component alias.


Layout increment — owner-approved scope, 2026-10-17: `formlet`, `groupBox` and `checkbox(variant="switch")` keep identical Python/JS authoring names. Descriptor exports Formlet/GroupBox use gramlot-formlet/gramlot-group-box tags in the layout collection. Existing columns, col_min_width, lbl_*, box_*, lbl_variant and copy retain the reviewed PoC roles. `subTags` on a component definition maps to the existing portable `sub_tags` field (default empty, containers `*`). Internal Container owns the slotted content; readDataScope is the renderer-installed Data-reading capability used by groupBox, not an application proxy. Formlet defaults resolve on their declaring Source node and never mutate descendant Source. Shared labelbox remains the field presentation owner. Switch tokens follow --gramlot-switch-<role>.


Review cleanup (owner-authorized R1–R10, 2026-10-17): descriptor `presentationDefaults` lists Source presentation prefixes supplied by a container; `dataScope` requests renderer-installed `readDataScope`. These fields travel in gramlot_component metadata. A `value` parameter with binding="twoWay" identifies a control independently of subTags. Internal `projectParameters`, `parseChoices` and `positionPopup` name the shared parameter, local-choice and geometry operations; they introduce no application proxies. ControlAdapter `preservesUnchangedValue` gates unchanged-value projection for component drafts. Theme roles follow --gramlot-<component>-<role>: formlet-gap; switch-width/height/inset; group-padding/header-padding/action-padding/action-size; choice-max-height; slider-width/height. Popup viewport margin/gap and feedback timings are named internal constants, not new page parameters.

Shared popup geometry writes internal --gramlot-popup-available-width/height properties; these are calculated viewport constraints, not author configuration. --gramlot-popup-padding is a theme token. Local options use one strict parseChoices contract: empty whole list is allowed, empty/duplicate codes or comma entries are rejected, and caption colons are retained. This resolves the R10 divergence under the owner's complete-review correction instruction.


Button naming direction (owner, 2026-10-17): retain authoring name `button` in
Python and JS and use custom-element tag `gramlot-button`; `html_button` retains
the native HTML button. The owner confirms this direction before requesting
GC-310's legacy-family analysis. Other family/bar names in GC-310 are legacy
evidence or proposals, not additional approved runtime APIs.


Button family implementation (owner authorization, 2026-10-17; GC-310 §045): canonical names button, toggleButton, dropDownButton, menu, menuline are shared by Python/JS; tags gramlot-button, gramlot-toggle-button, gramlot-drop-down-button, gramlot-menu, gramlot-menu-line follow the existing component convention. The built-in buttons collection uses generated portable metadata. Descriptor command explicitly requests the shared ButtonBinding. Internal commandTarget/prepareCommand/attachCommand/releaseCommand and binding-installed activateCommand follow the existing capability/lifecycle convention; they are not page proxies. persist stores a code under the page URL and authored id, not executable content. Button presentation tokens use --gramlot-button-<role>.


Component enumerations (owner, 2026-10-17: “se ci sono valori predefiniti l'inspector dovrebbe avere una tendina”): parameter metadata `enum` lists the admitted literal strings, following the conventional schema name. It travels in the existing generated `gramlot_component.parameters` metadata. Inspector `parameterEnums` carries only these lists across its existing bridge; `readParameterEnums` reads them from Source metadata, never from rendered controls. The inspector uses native selects for literal enum attributes and preserves authored pointers as text.

Checkbox naming refinement (owner, 2026-10-17: “piu che variant forse mi piacerebbe 'mode'”): `mode` replaces `variant` for checkbox presentation, identically in Python/JS; literals remain checkbox/switch. Existing `lbl_variant` for groupBox is a separate parameter.

Checkbox color (owner, 2026-10-17: `switch_color?`, confirmed “ok perfetto”): `switch_color` is the shared Python/JS parameter for the active switch track. It supports read binding and overrides the existing --gramlot-switch-on token on the internal control only; null restores theme inheritance. `color` keeps its text/CSS meaning.


Automatic formlet alignment (owner, 2026-10-17): internal FormletLabels owns slotted-field measurement and observer cleanup. Labelbox emits gramlot-label-layout after projection; data-formlet-aligned and --gramlot-formlet-label-width are internal calculated layout state. The existing --gramlot-label-width represents only explicit lbl_width. No new authoring parameters or application proxy.

FormletLabels identifies the existing Labelbox composition by its owned fieldLabel property, independent of constructor identity across separately bundled collections. It operates on that composition directly; ordinary slotted content is not a labelled field.


### Input validation engine (owner scope, 2026-10-17)

Retain legacy `validate_<rule>`, `validate_<rule>_if`, `_error`, `_warning`, `_iswarning`, `validate_onAccept` and `validate_onReject`. Rules: `select`, `notnull`, `empty`, `case`, `len`, `min`, `max`, `email`, `regex`, `call`, `remote`; DB/grid names are reserved and explicitly unsupported. `validate_timeout` is an optional millisecond bound for asynchronous validation. Named Logic callbacks use the existing method-name convention; inline bodies/conditions use activated Source and InlineCompiler. Internal `validateInput` returns a validation result; FieldState owns `validateCandidate`, `cancelValidation`, `finishValidation` and `validationResult`. Component acceptance stays `acceptControlValue`; adapters remain the sole Data writers. No new page-level form/save API is introduced.

The legacy remote observation callback retains `validate__onResult` (double underscore); it follows the same activated/named callback policy. Internal `validationRules` and `validationParameters` share rule ordering and generated grammar. `componentContext` connects controls to existing services; `commitComponent` handles synchronous/asynchronous acceptance without adding a Data writer.

`validateSelection` is the component-owned selection-integrity check; constrained choice editors implement it, and other controls reject an explicit validate_select rather than silently ignoring it.


Border layout (owner-authorized, 2026-10-18): BorderContainer/contentPane declarations use borderContainer/contentPane and gramlot-border-container/gramlot-content-pane in layout. Container is the existing shared slotted base, extracted to container.js. border-container.js owns region geometry and separators. projectBorderChild is the renderer projection boundary for parent-owned region metadata; borderRegions is an internal WeakMap, not a public DOM/Data proxy. projectRegion refreshes a region from resolved Source attributes. splitter_* and drawer_* use the existing style adaptation; drawer_class is the verified legacy spelling. Theme roles use --gramlot-splitter-size/background/hover and --gramlot-drawer-background/color; existing touch target and radius/focus tokens apply. Internal region and separator elements use ordinary shadow classes/data attributes, with no new application events or stores.

Border projection crosses independently bundled runtime/collection modules through `BorderContainer`'s registered DOM class static `projectChild` method. Its internal `borderRegions` WeakMap remains collection-owned; the renderer never imports a second copy of that state. `projectBorderChild` is an internal collection helper, not a public export.

Border visual refinement (owner, 2026-10-18): existing `rounded` style macro remains the single authoring API, with ordinary Data bindings. Drawer theme roles add `--gramlot-drawer-font-size` and `--gramlot-drawer-padding`; labeled handles use internal `data-labelled`. Shared popup geometry accepts internal `inset` (pixels, default zero); choice menus use the theme token `--gramlot-choice-popup-inset` (2px default). These are presentation settings, not new Data stores or widget modes.

Owner refinement, 2026-10-18: drawer_title uses the existing native title attribute through drawer_* projection. Unlabelled defaults use a thin grip and a tooltip; theme touch targets enlarge hit areas rather than visible geometry. No new public parameters.

Drawer drag refinement: internal captureTarget is the pointer capture owner (separator or drawer); suppressDrawerClick distinguishes the release click from ordinary activation. Both belong to the existing per-region pointer lifecycle, with no new authoring parameters or Data state.

Drawer reopening/hover refinement (owner, 2026-10-18): internal data-resizable on the existing drawer reflects splitter capability independently of open/closed geometry. Hover growth uses CSS transforms anchored at the joined edge, with reduced-motion support; no public parameter or Data proxy is added.

Owner-authorized drawer presentations (2026-10-18): drawer_class accepts shared presentation classes drawer-rotated and drawer-reveal. Existing drawer_label supplies text/markup, including an emoji; internal drawer-label span separates label clipping/fade from the pointer target. Theme roles under --gramlot-drawer- add thickness, length, opacity, active-opacity, hover-cross-scale, hover-length-scale, label-hover-scale, duration, easing, hit-target, label-offset, reveal-width, reveal-height and reveal. The numeric reveal token is 1 for always-visible touch labels and 0 for hover-only labels; existing page touch mode supplies it. Internal --drawer-open and --drawer-closed-width/height compute presentation only. No extra widget parameter or application state.

Drawer contrast refinement (owner, 2026-10-18): internal --drawer-background resolves the existing public background token once; CSS relative HSL derives white captions on dark fills and dark gray on light fills. The existing color token remains an explicit override. Reveal grips have no border, inset stroke or focus outline; keyboard focus reveals/enlarges the caption.

Owner-approved icon separation (2026-10-18): drawer_icon is independent from drawer_label, follows drawer_* Source projection, and uses a stable internal drawer-icon span with data-icon presence marker. --gramlot-drawer-icon-size sets its visible square and resting handle size. drawer-reveal hides only the label. Existing --gramlot-drawer-label-hover-scale also controls reveal zoom; 1 disables scaling without disabling expansion.

Owner-confirmed drawer defaults (2026-10-18): drawer_minimize is a boolean parent-owned Source parameter, default true (owner revision 2026-10-18), consumed alongside drawer_label/icon. Internal drawer-reveal and drawer-rotated classes are now derived from minimize and region axis; applications need neither class for normal authoring. Internal --drawer-reveal-width/height resolve orientation-specific defaults before existing public theme overrides.


Drawer mobile correction (owner, 2026-10-18): the existing reveal token controls caption availability, not forced expanded dimensions at rest. Intrinsic caption geometry is bounded by the existing reveal dimensions; hover/focus/press retain expanded geometry and zoom. Internal data-active on the drawer is transient pointer-pressed presentation, cleared on release/cancel/lost capture or uncaptured leave; it compensates for touch browsers clearing :active during capture. No new authoring parameter, Data state or layout policy.


Border notifications (owner-confirmed 2026-10-18): closable_change retains the legacy topic spelling and extends it to drawers; splitter_resize is the explicitly approved completion topic. Source node_id prefixes topics through existing publishNode routing. Payload names open/region and region/size/previousSize are the reviewed contract. Internal projectBorderChild notification callbacks closableChange/splitterResize follow the existing camelCase callback boundary; the component has no subscription service dependency. #commitResize shares keyboard/pointer completion, and per-region visibility records the last projected open/drawer state to suppress initial/no-op notifications. No new global event bus or proxy.


Tab/stack (owner-approved 2026-10-18): authoring names tabContainer/stackContainer and tags gramlot-tab-container/gramlot-stack-container follow the established component naming. SelectedContainer is the shared slotted container factory; StackContainer and TabContainer are declarations. Parent-owned pageName/title/closable/onClose describe child panels. selectedPage and selected retain legacy selection spelling; hiding/showing/selected retain legacy topics, closing/closed are reviewed additions. Internal selectionPanels WeakMap and static projectChild follow border projection across bundles. setSelectionContext supplies Source-only publish/writeSelection/remove/allowClose callbacks; the component owns visibility, selection and tab interaction. Named shadow slots and panel viewport records preserve light DOM identity. No alternate event bus, application state cache or new public proxy. --gramlot-tab-* CSS tokens cover strip gap, padding, background, selected background/color and border.

Tab presentation refinement (owner request, 2026-10-18): extend the existing --gramlot-tab-* family with height, radius, strip-padding, color and hover-background. Themes own density and palette; the selected entry is styled through its existing aria-selected tab, including its close control. No selection protocol or public component parameter changes.

Tab presentation (owner-confirmed 2026-10-18): tabMode/tabPosition are read-bound enum parameters of tabContainer. Panel icon/badge/badge_color are resolved parent-owned metadata; badge accepts a number or text, null/empty hides it and zero remains visible. Internal data-mode/data-position on the selection wrapper drive CSS geometry; icon/caption/badge spans update in place. aria-orientation follows the strip axis. Extend --gramlot-tab-* theme tokens with content-gap, side-width, indicator-color, indicator-size, badge-background, badge-color, badge-size and badge-padding. No selection-state cache or new publication.


Gallery container composition (owner request, 2026-10-18): mountIndexPage accepts the explicit internal option containerLayout for indexes whose Navigation and Code panes belong to a borderContainer. data-index-regions identifies that container; pane node_id values scope the existing closable_change subscriptions. No new component parameter or event is introduced. The Python gallery uses the existing gallery-/index- DOM prefixes; Example and Explanation are tabContainer panel titles.


Guided gallery preview (owner-authorized 2026-10-18): gallery-guide.js and GuidedDemo are gallery-owned teaching support, not a core service. galleryGuide is the gallery Data scope; steps carry title, text, changes and seconds. Changes map explicit example Data paths to values. galleryGuidePlay/Pause/Stop/Previous/Next node_id values publish the existing Source-local command topic. galleryGuidePanel_closable_change pauses when the teaching drawer closes; galleryGuidePreview_selected observes the existing selected event to pause on Explanation. Source IDs and CSS use gallery-guide-; no new application proxy, synthetic DOM event or arbitrary-code step.

Drawer content grouping (owner 2026-10-18): internal drawer-content wraps drawer-icon and drawer-label as one clipped/revealed presentation. Both follow drawer_minimize. The existing --gramlot-drawer-icon-size controls glyph size (default 1em), not a reserved square/hit area. Thickness and hit-target tokens retain their separate responsibilities.


Review consolidation (owner instruction, 2026-10-18): internal component declaration metadata childParameters describes parent-owned child constraints (required, enum, unique) and inline callback arguments. sourceContext marks components using the existing Source callback boundary, renamed setSourceContext; projectChild receives one context object (adapt, invoke, publish, publishParent, remove). This consolidates the approved container-specific callbacks, without adding an authoring API. Internal drawer-viewport clips the intrinsic drawer-content while preserving the outer hit target; ResizeObserver supplies --drawer-content-width/height, and explicit reveal limits remain overrides. galleryGuide.executed tracks the last applied step separately from position (the explanation being reviewed). Inspector insertion fields are generated from required childParameters, with no implicit region choice.


Gallery selection consolidation (owner-approved review repair, 2026-10-18): galleryIndex is the single Data scope for active page, opened pages, mobile view/menu and appearance/label preferences. mountIndexPage receives it through the explicit state option. Open-page and source-file tabs use tabContainer/contentPane. --gallery-narrow is the gallery-owned CSS breakpoint flag read by responsive presentation; --gramlot-tab-strip-display controls the outer strip without hiding nested preview strips. The existing HTML IndexPage remains supported by its own declared composition.


Tab alignment (owner-confirmed 2026-10-18): tabAlign follows tabMode/tabPosition camelCase authoring conventions; enum start/center/end, default start, read-bound. The internal selection wrapper uses data-align to drive strip justification. Overflow uses safe alignment, preserving access to the first entry when the strip is too small. No new proxy or selection state.


Numeric border binding (owner, 2026-10-18): reuse width/height as parent-owned
childParameters so projection receives their typed resolved values. Reuse the
existing writeParameter callback spelling at the projectChild Source boundary;
HtmlElement.writeParameter applies the existing plain reactive pointer write with
no inverse transformation. No new public attribute, proxy or regions Data structure.


Slider external quantization (owner, 2026-10-18): horizontalSlider/verticalSlider
reuse descriptor sourceContext and setSourceContext/writeParameter. The existing
rangeEditor owns projection; private #sourceContext and #correcting hold only the
callback boundary and a synchronous reentrancy guard, not a parallel value. Native
range min/max/step remain the canonical parameter names and numeric semantics.
