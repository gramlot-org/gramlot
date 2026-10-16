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
  `_parse_request`/`parseRequest` (a module function not exported).
- `Page.registerSource` replaces the free function `source` in JS; Python keeps
  `@source`. Endpoints are declared with `@endpoint` (Python) and
  `Page.registerEndpoint` (JS), both with an optional `auth` rule.
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
The Page hooks are `introduction`, `group_panel` ↔ `groupPanel`, `panel`, `footer`
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
proposals are superseded. Existing `${...}` templates are not removed by this decision.

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
