# 225 · Naming and proxy conventions

Document ID: **GC-225**. Started: **2026-10-06**. Each rule names the owner
decision it comes from. Sections marked **Open** record a question, not a rule.

<a id="gc-225-005"></a>

## 005 · Names come from written conventions

Block ID: **GC-225-005**.

Owner, 2026-10-22: "Direi di chiamarlo gramlot.commands.registerGroup, visto che
vale sia per menu che per toolbar." The shared command registry entry point is
gramlot.commands.registerGroup(namespace, metadata); group.register(name,
definition) retains the reviewed shape. This supersedes the provisional
gramlot.widgets.slotbutton.registerGroup spelling. Naming approval does not
claim an implemented registry. Owner, 2026-10-22: "Sì, confermo il contratto
a cinque campi." GC-335 §080 now fixes sender, target, command, parameters and
modifiers; modifier members are shift, ctrl, alt and meta. command is the full
registered key; publish remains the delivery topic. These names supersede the
earlier frame-bearing payload proposal and do not add aliases.

Collection hook confirmed — 2026-10-22: registerCommands(gramlot) on a
defineCollection descriptor follows the existing camelCase method convention and
describes the confirmed commands responsibility. Owner: "ok", answering the
explicit proposal to use the same hook for preparation/catalogue export and
bootstrap/page activation. See GC-325 §040. No Python descriptor class or CLI
command spelling is chosen by this approval; implementation remains pending.

Collection identity confirmed — owner, 2026-10-22: "ok" to name as collection
identity, single activation for repeated inclusion of the same collection, and
an explicit collision error for different collections sharing that name.
Reuse the existing defineCollection name field; no new identity alias is added.

Command-key collision rule — owner, 2026-10-22: "ok" confirms that uniqueness
uses the full registered key. documenti:save and fatture:save are distinct;
repeating documenti:save is an error without overwrite. Same-collection
deduplication prevents repeated activation; group ownership is still open.

Command namespace ownership confirmed — owner, 2026-10-22: "confermo" to one
collection owning a namespace. Other collections may reference its commands,
but their new commands use another namespace. Collection name and command
namespace retain distinct roles; no equality convention is introduced.

Collection dependency field confirmed — owner, 2026-10-22: "ok" to
dependencies: [common] on defineCollection, where common is an imported
collection object. Use dependencies as the single declaration field; generated
Python/package metadata derives from it rather than a second authored list.

Package descriptor name confirmed — 2026-10-22: GramlotCollection follows
the existing Gramlot-prefixed Python public class convention; it describes a
packaged extension, not the private grammar-only Collection helper. Confirmed
fields name, package, grammar, commands, module, css and dependencies follow
existing concept names and Python lowercase attributes. GC-325 §045 is the
reviewable proposal. Owner replies "ok" to the lightweight descriptor and name
presented in commentary, then "ok" to the complete fields/layout example:
name, package, grammar, commands, module, css and dependencies. GC-325 §045
records the accepted generated package structure; runtime remains pending.

Command-catalogue schema confirmed — 2026-10-22: owner replies "ok" to GC-325 §050:
document_format {name: "gramlot_commands", version: "1.0"}, reusing the portable
document marker convention for a distinct data schema. groups and commands name
the confirmed registry concepts; author/description/label/icon/tooltip/publish
reuse reviewed registration metadata. Schema version is not release version.
Full namespaced keys derive from group and local keys. Owner subsequently replies
"ok" to group "" reserved to the base collection: local name save maps to save,
while nonempty documenti maps it to documenti:save. The catalogue groups key is
also "". No alias or fallback lookup. These are design names, not runtime claims.

Build destination map confirmed — owner, 2026-10-22: "ok" to GC-325 §055:
gramlot.build.json with output and collections entries containing entry and
pythonPackage. pythonPackage follows the JS camelCase field convention; these
fields describe build destinations, not dependency declarations. dependencies
remains the already confirmed JS collection field. Configuration filename and
field names are approved; no CLI spelling is selected.

External collection map confirmed — owner, 2026-10-22: "ok" to GC-325 §060 externals
entries with entry and pythonImport. entry reuses the build module identifier;
pythonImport follows JS camelCase and holds an exact module:attribute reference
to an installed GramlotCollection descriptor. No distribution name is inferred.
Field names and exact descriptor reference form are approved; runtime is pending.

Browser collection specifier confirmed — owner, 2026-10-22: "ok" to GC-325 §065's
generated module key @gramlot/collections/<name>, derived from collection identity
with injective escaping if needed. This is a bootstrap import-map convention,
not a command namespace, npm dependency or alias fallback. It preserves existing
core root/page specifiers and uses a shared hosted entry for the existing
@gramlot/gramlot/components source export. The linking contract is approved;
runtime implementation and host asset-delivery details remain pending.

Build-fingerprint representation confirmed — owner, 2026-10-22: "ok" to GC-325 §075:
Python build_id and JS/module/bootstrap buildId using the existing snake_case/
camelCase convention, plus descriptor files for the generated artifact inventory.
assets/index.js stays the entry; assets/collection.js is the generated payload.
gramlot-build-v1 identifies the hash-input format, not a release.
The SHA-256/wrapper/verification scheme is approved design; implementation is pending.

Confirmed independent preparation CLI — owner, 2026-10-23: "ok" confirms
gramlot-builder build|check with --config (GC-325 §080). The tool name derives from the
existing GramlotBuilder/preparation responsibility; lowercase hyphen spelling
matches existing tool executables. This is a new bounded tool convention,
not an inferred use of the environment-first gramlot CLI. Read-only evidence:
gramlot belongs to gramlot-py-server. Do not create competing entry points or
adapter dependencies. This approves the name/verbs/option as design; implementation
and toolchain distribution remain pending.

Confirmed generator package — owner, 2026-10-23: explicit confirmation of the
preceding toolchain proposal establishes @gramlot/builder as the separate npm
development package in the core repository. The @gramlot scope follows the
existing package convention; builder denotes the already named preparation
responsibility. The Python gramlot package owns gramlot-builder; the npm package
does not introduce a competing executable. GC-325 §085 records the distribution
split, superseding the pending distribution note above. Internal export names,
package discovery and launcher/generator protocol were left open at that point.
Owner confirmation on 2026-10-23 settles discovery and process responsibilities
in GC-325 §090. Exact protocol field names, version values and internal exports
remain to specify; this confirmation introduces no new public API names.

Confirmed bootstrap record shape — owner, 2026-10-23: "ok" confirms retaining
resources.collections with entries {name, url, buildId}. name reuses collection
identity, url the existing resource URL field, and buildId the approved JS
fingerprint spelling (§075), following existing camelCase conventions.
GC-325 §100 records the approved shape; no aliases, new adapter method names
or universal route spelling are approved. Implementation remains pending.

Confirmed Python collection resource APIs — owner, 2026-10-23: "Sì, confermo"
approves GC-325 §105 and
GramlotCollectionResources for the integration-owned resource service. This
extends Gramlot-prefixed public type naming to a collection-resource service;
the bounded class name is now approved. register/url/asset describe
its three operations; base_url, build_id and collection_url follow Python
snake_case (JS counterparts baseUrl, buildId and collectionUrl where applicable).
GramlotServer.collection_url derives from the existing resource-resolution/
theme-URL responsibility and denotes URL mapping only. No adapter route spelling,
internal module path or additional registry lifecycle is approved yet.

Confirmed page catalogue hook — owner, 2026-10-23: explicit confirmation of
startup enumeration and a process-lifetime fixed registry approves GC-325 §110:
GramlotServer.iter_page_classes / iterPageClasses. iter_ denotes an iterable
result and page_classes names the returned classes, separate from resolve_page
which selects one class for a path. Python snake_case and mechanical JS camelCase
follow the existing convention. The enumeration responsibility and name are
approved; no runtime method exists yet.

Confirmed authored collection resources — owner, 2026-10-23: explicitly confirms
defineCollection fields css and assets. css reuses the approved stylesheet
concept in the descriptor/bootstrap; assets names the already agreed packaged
browser resource responsibility. Asset map keys are local to their collection,
not command namespaces. URL is the standard JS URL type, with href for string
access; no new path alias or helper API is introduced. GC-325 §125 records
approval of the declaration contract; implementation remains pending.

Approved generator wire fields — owner, 2026-10-23: GC-325 §130 fixes protocolVersion,
operation, configPath, projectRoot, stagingDirectory, config and externals in
requests; status, collections and diagnostics in results. Multiword fields use
the existing JS camelCase convention; config/externals/collections reuse the
already named responsibilities. Collection records reuse name, pythonPackage,
buildId, grammar, commands, module, css, dependencies and files; diagnostic
level/code/message/collection/path describe outcome/context. Owner confirmation
"Sì, confermo il protocollo e i codici di uscita" approves these fields, version 1,
statuses ok/error and the uppercase underscore-separated diagnostic code
convention (ASSET_NOT_FOUND). This is design approval, not implementation.
GC-325 §135 separately records owner approval of recovery behavior, 2026-10-23
("Sì, confermo questa politica di recupero"). It introduces no new public command
or wire field; transaction storage layout remains an internal implementation detail.

Approved generator entry — owner, 2026-10-23: "confermo punto d’ingresso,
versioni Node ed esbuild" confirms @gramlot/builder/cli (GC-325 §140). The existing
scoped npm package gains an explicit ./cli export for its process-protocol entry;
cli follows the existing command-line module convention. Initial ./src/cli.js is
internal mapping, not a Python hard-coded path or a second public user command.

Approved Uvicorn resource route — owner, 2026-10-23: "ok" to the concrete scope
and behavior proposal confirms /gramlot/collections (GC-325 §145), under the
adapter namespace already used by /gramlot/rpc and /gramlot/close, followed by
collection identity, SHA-256 hex and inventory-relative resource path. This
spelling remains host-owned, not a new universal core route.

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
| Helper modules | A module of functions without a class is named after what it holds, in both languages: `assets`, `resources`, `conformance` and, provisionally, `files` (`files.js`/`files.py`: `file_below`/`fileBelow`, `THEMES`; see the Source column). Not covered by the row "Files" | existing modules `assets`, `resources`, `conformance`; `files`, `file_below`/`fileBelow` and `THEMES` are a provisional implementation of review p4d, not an accepted name or design: the owner (2026-10-20) places them in the topic of pages and resources, which a dedicated study of the next cycle reorganizes, and the module will be replaced by that organization |
| Example pages | A generic `div` is held in `pane`; `html_main` is held in `main_content`; an element is never named `page` | GC-210 row S14bis (`210-binding-contract.md:755`) |
| Commands | Environment, then verb: `gramlot <environment> new\|gallery`, `gramlot node\|bun gallery`, `gramlot-serverless build\|gallery`, `npm create @gramlot page\|site` | owner decisions 2026-10-02 and 2026-10-05; GC-055 |
| Base of the JS markers | `Exposed` (`js/src/server/page-base.js`) is the base of every JS class whose methods a request names: `Page` and the classes of the objects reached from the page by a method path (`orders.list`, constitution 11.88). It holds only `registerSource` and `registerEndpoint`; `Page` extends it, so `Page.registerSource` is the inherited marker. No convention covered the name: it reuses the word "exposed" that already names `@source`/`@endpoint` methods (`page/base.py` docstring, GC-090 table "Exposed Source method"). Python has no counterpart: `@source` and `@endpoint` are functions and the objects on a path are ordinary objects (accepted asymmetry) | owner decision 2026-10-19 (review plan d-pointer-js: common base with the markers only, `Page` extends it); name chosen in p1, confirmed by the owner on 2026-10-19 |
| Proxies of the Source node | A proxy of the Source node, reached from `this` in inline code, has a free name, clear and not ambiguous; its class states its theme in its docline. `node.requests` (class `NodeRequests`, `js/src/builder/source.js`) holds the request in flight (`inflight`: `method`, `params`, `sentAt`, `cancel()`) and the waiting call (`pending`: `method`, `params`) of `remote`, `dataRpc`, `dataRemote` and `remoteSource`. Browser-only, as `PUT` and `FIRE`: no Python counterpart | owner decision 2026-10-19 (review plan d-oncalling: "i proxy del Source node hanno nomi liberi purché chiari e non ambigui"); name chosen in p1 (d-oncalling-open), confirmed by the owner on 2026-10-19 |
| Server adapter of the page | `gramlot.serverAdapter` is the object of the browser page that holds the server-dependent behaviour; the core consults it, it is not a proxy (owner decision 2026-10-19, review plan d-pointer-separator). Its class is `ServerAdapter`; a subclass names its kind of server before the word, as the transports do (`HttpTransport`, `WorkerTransport`): planned `WorkerServerAdapter`, `KajennServerAdapter`. The row "Server object" rejects `ServerAdapter` as the name of the server object (`GramlotServer`); this class is a different object, on the browser side. Its factory method is `createTransport`, after the `create<Thing>` functions of the code (`createNonce`, `createDispatch`). The module the server names in the bootstrap is `resources.serverAdapter`, read by `PageBootstrap.loadServerAdapter`; the server property is `server_adapter`/`serverAdapter` | `serverAdapter` decided by the owner on 2026-10-19; the class name, `createTransport`, `loadServerAdapter`, `resources.serverAdapter` and the server property chosen in review p4, confirmed by the owner on 2026-10-19 |
| Name syntax | `NameSyntax` holds the syntax of a method name a server declares; `NAME_SYNTAX` is the core default; the server property, the builder property and the bootstrap field are `name_syntax`/`nameSyntax`; `matches(name)` tests a name. No convention covered the name: it uses the words of the decision ("la sintassi del nome"). Its serialisation follows genro-builders `CustomTypes`: `to_dict`/`from_dict` in Python, `toJSON`/`fromJSON` in JavaScript, an exception to the mechanical camelCase translation, as in the library it extends. `NameSyntax` extends the genro-builders `Regex` in Python | chosen in review p4, confirmed by the owner on 2026-10-19 |
| Synchronous call | The synchronous variant of a call takes the suffix `Sync`, as in the JavaScript platform (`readFileSync`, `execFileSync`): `gramlot.rpc.callSync`, the transport `callSync`, `NodeBinding.callSync`, `NodeRequests.submitSync`. The capability of a transport is `supportsCallSync`. Browser only: no Python counterpart. The `dataRemote` attribute is `sync`, the legacy name | owner decision 2026-10-19 (synchronous call and `dataRemote` `sync`); `callSync`, `supportsCallSync` and `submitSync` chosen in review p4, confirmed by the owner on 2026-10-19 |
| Operations shared by the adapters | `GramlotServer.decode_body`/`decodeBody` (request body to text), `close(text)` (the close message, beside `call(text)` for the request envelope, both named after the action of their URL), `theme_css`/`themeCss` (the theme URL of a page class) and `theme_file`/`themeFile` (the file of a `/themes/` URL: it does not read the pages folder, so it is on `GramlotServer`, review p4d); `GramlotFileServer.companion_file`/`companionFile` (the file of a `.css` or `.js` URL below the pages folder; the files of GC-230 §145, the words of §145). `call` takes `identity` beside `owner`, and `evaluate_auth`/`evaluateAuth` receives it | chosen in review p4 (decision d-adapter-api), confirmed by the owner on 2026-10-19 |
| Theme of a page | The page attribute keeps the legacy name in both languages, as `css_requires` and `js_requires`: `css_theme` (`static css_theme` in JavaScript); `False`/`false` loads no theme. The `GramlotServer` option follows the camelCase translation: `css_theme` in Python, `cssTheme` in JavaScript | owner decision 2026-10-19 (d-theme: base theme as a server option, `css_theme` on the page); `css_theme`/`cssTheme` confirmed by the owner on 2026-10-19; the "no theme" value chosen in review p4, to be confirmed by the owner |
| Utility classes of the base theme | A utility class of `gramlot-base` is one lowercase word that names what the element is or does (`stack`, `grid`, `card`, `muted`, `actions`, `eyebrow`); a variant adds `--` (`button--quiet`, `status--success`); an icon class has the prefix `gramlot-icon`. `actions` is a row of actions or buttons; `eyebrow` is the small label above a heading. Both words were already the class names of the lesson stylesheets of `gramlot-examples`, which each copied the rules | the names of the lessons; written and added to the base theme in review p4e, confirmed by the owner on 2026-10-20 (they are public theme CSS) |
| Typed literals of the page entry | `Bag`, `BagNode` and `createDecimal` are exported by `@gramlot/gramlot/page` and by the runtime under the names of their libraries (Bag, TYTX), without alias; a date or a time is a `Date`. Python has no counterpart: its pages import `Decimal`, `datetime` and `Bag` from their packages | review p4e (typed literals in JS page modules), confirmed by the owner on 2026-10-20 |

Widget-name exception (owner, 2026-10-16; constitution 11.84): widget authoring
names are identical in Python and JavaScript. Do not translate a compound widget
name into snake_case in Python. Use one canonical spelling in metadata and docs;
prefer case-insensitive lookup, already supported by both installed Builders.
For example, the proposed `radioButtonText` spelling is shared by both languages;
`radiobuttontext` is a case variant, while `radio_button_text` is not. This exception
concerns widget names, not parameter names or ordinary Python/JS methods and classes.

PageStore PoC names (owner, 2026-10-27): the separate class in the Page module is
PageStore and its recipe entry is main(root), as explicitly requested. The
owner's dataBinder declaration retains the canonical Source grammar spelling
in Python and JavaScript, following the existing dataController/dataRpc family;
the earlier data_binder suggestion is withdrawn. This concerns grammar elements,
not ordinary method spelling. destination_path follows dataSetter; server_path
names the other end of that relation. The internal DataBinder and
PageStoreConnection classes name those responsibilities and introduce no
application proxy. The prototype contract is recorded in GC-250.

Shared-channel extension (owner, 2026-10-27: “ok procediamo con iframe e
finestre figlie, mantenendo una sola websocket nella pagina primaria”): retain
PageStoreConnection for each page's logical channel. Historical record, superseded
by the unified family protocol below: its private window protocol
uses gramlot:page-store, following gramlot:publish; session/recipient and
hello/ready/close follow FrameMessages. up/down describe server-bound/return
delivery, not publication. attach/detach register pageId routes on the existing
store protocol. These internal names introduce no application API or proxy.

Python PageStore reactivity (owner confirmation, 2026-10-27): BindingRuntime,
DataChange and DataRegistration mirror the existing browser responsibilities;
Python modules and fields follow snake_case. GramlotBuilder's private
_start_reactivity/_stop_reactivity own runtime activation for PageStore only.
The existing positional node remains the recipe Source node; optional named
_node, _reason and _triggerpars mirror the browser provider trigger fields
(_node is the changed Data node). Only these reserved context fields are
selected by Python callable signature; authored arguments remain strict.
No automatic browser-Source execution or new application proxy is added.

Shared WebSocket RPC (owner request, 2026-10-27): WebSocketTransport follows
HttpTransport/WorkerTransport and implements their existing call/close/dispose
contract. ServerAdapter.createTransport receives an optional channel, the
existing PageStoreConnection; no new authoring proxy is introduced. RPC uses
the unchanged id/pageId/contentType/name/params envelope, distinguished from
binder operations by absence of op. Responses retain id/contentType/value or
error and add pageId for window routing. The internal cancel operation carries
pageId/id; it follows AbortSignal cancellation and does not promise rollback.

Unified family protocol (owner, 2026-10-27): retain FrameMessages and place its
single instance privately at gramlot._frames, alongside _subscriptions and
_pageStore. children exposes that internal registry's direct-child records;
parent describes the immediate frame parent or opener. No new public proxy.
The private message marker becomes gramlot:message (gramlot:<noun> convention);
hello/ready/close retain session/recipient and carry page readiness plus channel
state. All data messages have kind=message, channel and a TYTX wire. publish and
server name their existing responsibilities; registerChannel/setChannelState/
unregisterChannel/send describe internal operations. PageStoreConnection uses
the server channel, with no second handshake. The existing pageId identity may
select a directly registered child in a publish descriptor; parent also covers
the opener, and iframe keeps its existing Source/id syntax. Recursive broadcast
and arbitrary-window targeting remain excluded.

PageStore topic publication (owner 2026-10-27): keep publish(topic, payload) for
local PageStore publication, mirroring Gramlot.publish. Existing subscribe_<topic>
grammar attributes declare Python controller/formula subscriptions; no new tag.
The browser descriptor adds server (the destination) beside existing pageId.
On the server channel, op=publish carries topic/payload and optional targetPageId;
pageId remains the sending page identity. GramlotServer.publish(text, owner=...)
mirrors call(text, owner=...) as the transport-neutral dispatcher. BindingRuntime
owns the recipe's private topics index and publication execution; the reserved
_subscription_kwargs follows the existing browser provider context. No second
window protocol or socket is added; binder registration remains separate.
The internal PageStoreConnection.preparePublish follows FrameMessages.prepare:
it validates readiness and captures the typed payload before local subscribers
run, returning the forwarding operation.

Publication acknowledgement (owner 2026-10-27): reuse RPC id, contentType=data,
value and error envelopes and the PageStoreConnection calls correlation map.
The publish request retains op=publish, topic, payload and optional targetPageId,
adding id. The response has no op and returns value="ok" or the existing
code/name/message error structure. Server-targeted Gramlot.publish returns a
Promise resolving to "ok" or rejecting with the existing RpcError. Local and
window publications retain their synchronous return. No acknowledgement proxy,
second pending index or additional transport is introduced.

Acceptance-only acknowledgement (owner 2026-10-27): rename the neutral
dispatcher to prepare_publish, following PageStoreConnection.preparePublish.
It validates and returns (response wire, dispatch callable); a refused
publication has no dispatch. The adapter sends the response before invoking
the prepared callable. Local PageStore.publish continues to run subscribers.
No wait flag, new public proxy, queue or response format is introduced.

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
  formerly `MainTransport` in `transport.js`), the shared-channel PoC's
  `WebSocketTransport`, or one injected with the same `call`.
  `call` is the one cancellation: `signal` and `gramlot.abort` abort it, it rejects at
  once; `remoteRequests` = AbortController per call in flight by envelope id, written
  only by `call`.
- Review 0.3.5 p3 names (internal, browser): `NodeBinding.call(contentType, request)`
  (as `RpcHandler.call`; node close aborts); `SubscriptionsHandler.subscribeNode(node,
  callbackFor)` (as `publishNode`); `BindingRuntime.askDialog` (as `inlineCompiler`);
  `BindingRuntime.subscriptions` = private `_subscriptions` given at construction.
  No convention covers a shared module function: `randomId()` in `js/src/random-id.js`
  is chosen by the implementation. The owner confirmed all the names of this item on 2026-10-19.
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
  `a.b.c.method`, from the page (constitution 11.88).
- `node.requests` (`NodeRequests`) is the one proxy of the Source node: the request
  rule of `remote`, `dataRpc`, `dataRemote` and `remoteSource` (constitution 11.88).
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
marker was `gramlot:publish`. Historical record: the owner-requested unified
family protocol on 2026-10-27 supersedes it with `gramlot:message`, shared by
publications and server traffic. FrameMessages now belongs privately to Gramlot
at _frames; SubscriptionsHandler consults that instance.


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
new Gramlot proxy, instance alias or Python Builder method.
Public type names follow the function: `DateExpressionOptions`,
`DateExpressionResult`, `DateExpressionErrorCode`. No alternate parser API is
introduced. See constitution 11.83 and PORT-0009-date-expression-parser.

Owner, 2026-10-25: the parser comes from `@genrojs/toolbox`; Gramlot re-exports
it with the same name, options and type names. Gramlot no longer has its own
`date-parser/` module. See the constitution entry "Date-expression parser from
Toolbox" (gc-000-toolbox-date-parser).


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


<a id="gc-225-080"></a>

## 080 · Shared Source identity

Block ID: **GC-225-080**. Owner: “Sì, nodeId in entrambi”, 2026-10-20;
constitution 11.88. Use `nodeId` in Python and JavaScript declarations and
transported Source. Migrate both Builders and Gramlot consumers together.
`node_by_id` / `nodeById`, symbolic `#editor` paths and independent DOM `id`
retain their meaning. No `node_id` alias. Regenerate previously serialized
Source. Earlier dated references below/above retain historical spellings.

<a id="gc-225-085"></a>

## 085 · Language words and system parameters

Block ID: **GC-225-085**. Constitution 11.89. CamelCase is shared by language
words in both authoring languages. Ordinary host-language methods/local variables
retain their conventions. Owner confirmed “si” to retaining `_onCalling`,
`_onResult`, `_onError`: the leading underscore marks system parameters. Their
existing behavior and per-construct availability are unchanged.

<a id="gc-225-090"></a>

## 090 · Namespace separators

Block ID: **GC-225-090**. Owner confirmed `node_label`, `node_position`,
`target_id` stay unchanged: the underscore separates namespace and member.
Do not flatten a namespace separator to camelCase. `nodeId` has its own explicit
decision. Other proposed names (`destination_path`, `result_path`,
`col_min_width`, `order_by`, `validate__onResult`, `closable_change`,
`splitter_resize`) remain unchanged: owner deferred further review and
authorized releases with the settled names on 2026-10-20.


<a id="gc-225-070"></a>

## 070 · Tree authoring names

Block ID: **GC-225-070**.

Gallery integration names, 2026-10-20: the index runtime's optional `navigation` Bag uses the existing IndexPage navigation name and existing key/title/url metadata; category/path describe its entry and store-relative path. `galleryIndex.navigationSelection` follows existing galleryIndex state ownership and binds the tree's approved selectedPath. `navigation_section` and `catalog_children` follow Python endpoint snake_case and JS registerEndpoint conventions. No aliases for storepath or tree-specific request APIs are added.


2026-10-20 — owner requests appropriate tree classes and gallery navigation through the tree, with sections as resolvers. Structural names derive from existing component conventions (`row`, `caption`, `icon`, `group`, `node`, `expander`) and explicit state tokens (`branch`, `leaf`, `opened`, `closed`, `loading`, `error`). Matching CSS parts expose these across the shadow boundary; `branch-row`, `leaf-row`, `selected-row`, `branch-icon`, `leaf-icon`, `opened-icon`, `closed-icon` compose those same names. Tree CSS tokens retain the established --gramlot-tree- prefix. Gallery navigation stays a Bag; section values use existing dataRemote resolvers, not a second lazy-loader API.



Implementation conventions for the minimum tree (2026-10-20, GC-197 §060):
`bagStore` follows existing camel-case boolean component-capability metadata;
`setStoreBag` follows component setter names. Internal router `subtree` names
its descendant-event registration scope, not a new application pointer syntax.
`--gramlot-tree-selected-background` and `--gramlot-tree-selected-color` derive
from the existing `--gramlot-<component>-<presentation>` CSS-token convention.
These are implementation names for the owner-requested first working increment,
not additional approved legacy options.

Owner confirmation, 2026-10-20: “si” to retaining the legacy `storepath` parameter
with absolute or `datapath`-relative paths, without `store` as a synonym.
For the first tree port, retain this existing legacy spelling as the sole store
path parameter. The store itself is always a Bag, including resolver-backed nodes.
See [GC-197 §055](197-legacy-tree.md#gc-197-055) for the exact proposal and scope.
No other tree names or implementation are approved by this naming decision.

Owner confirmation, 2026-10-20: “si” to the `labelAttribute` option and the label /
chosen-attribute / absent-attribute behavior recorded in GC-197 §055. Retain the
legacy camel-case spelling `labelAttribute` for this first-port parameter.
No callback name, HTML-label contract or additional tree option is implied.

Owner, 2026-10-20: “la hide values va prevista”. Retain the legacy spelling `hideValues` for the option included in the first tree port (GC-197 §055). This confirms the name/inclusion, not an additional `showValues` alias or label-callback API.

Owner confirmation, 2026-10-20: “ok” to including `labelCb` in the first tree port. Retain the legacy spelling for the computed-caption callback; see GC-197 §055. This naming/inclusion decision does not approve `getLabel`, a callback signature or a new callback execution mechanism.


Owner confirmation, 2026-10-20: “ok” to including `getLabel` after the Sourcerer usage review. Retain this legacy spelling for the caption override in the first tree port (GC-197 §055). This subsequent decision resolves the earlier pending inclusion; callback execution and HTML-label contracts remain open.


Owner confirmation, 2026-10-20: “si” to including `getLabelClass`, the caption CSS-class callback based on node and open/closed state. Retain the legacy spelling for the first tree port (GC-197 §055). Other class options and callback execution details are not implied.


Owner confirmation, 2026-10-20: “si” to including `getIconClass`, the icon CSS-class callback based on node and open/closed state. Retain the legacy spelling for the first tree port (GC-197 §055). Callback execution details and checkbox interaction remain open.


Owner confirmation, 2026-10-20: “si” to including the Bag node attribute `labelClass` for caption CSS classes. Retain the legacy spelling for the first tree port (GC-197 §055); it is read by the default label-class calculation, which a custom `getLabelClass` replaces.


Owner confirmation, 2026-10-20: “ok” to including the Bag node attribute `labelClassOpened`. Retain the legacy spelling for open-branch caption CSS classes, used by the default calculation in place of `labelClass` when populated (GC-197 §055).


Owner confirmation, 2026-10-20: “ok” to including the Bag node attribute `labelClassClosed`. Retain the legacy spelling for closed-branch caption CSS classes, used by the default calculation in place of `labelClass` when populated (GC-197 §055).


Owner confirmation, 2026-10-20: “ok” to including the tree parameter `selectedLabelClass`. Retain the legacy spelling for CSS classes added to the selected caption, including when its base classes come from `getLabelClass` (GC-197 §055).


Owner confirmation, 2026-10-20: “ok” to including the Bag node attribute `node_class`. Retain this legacy spelling for CSS classes applied to the node container (GC-197 §055).


Owner confirmation, 2026-10-20: “si” to including `openOnClick`, allowing branch expansion/collapse by clicking the label. Retain the legacy spelling for this first-port tree parameter (GC-197 §055). Default and selection interaction remain open.


Owner confirmation, 2026-10-20: “ok” to including `autoCollapse`, automatically closing sibling branches on expansion. Retain the legacy spelling for this first-port tree parameter (GC-197 §055).


Owner confirmation, 2026-10-20: “si” to including `selectedPath` for two-way selection binding using paths relative to the store Bag. Retain the legacy spelling for this first-port tree parameter (GC-197 §055).


Owner confirmation, 2026-10-20: “si” to including `selectedLabel`, the output binding for the selected Bag node label. Retain the legacy spelling for this first-port tree parameter (GC-197 §055); it is not the computed display caption or an inbound selection command.


Owner confirmation, 2026-10-20: “ok” to including `saveExpanded`, temporarily saving expanded-branch state in memory. Retain the legacy command spelling for the first tree port (GC-197 §055); node identity details remain open.


Owner confirmation, 2026-10-20: “ok” to including `restoreExpanded`, reopening branches remembered by `saveExpanded`. Retain the legacy command spelling for the first tree port (GC-197 §055). Resolver reload behavior and identity details remain open.


Owner confirmation, 2026-10-20: “si” to including `identifier`, with its supported identity modes to be examined individually. Retain the legacy parameter spelling for the first tree port (GC-197 §055); mode names and default remain pending.


Owner confirmation, 2026-10-20: “ok” to `identifier="#id"` and to `#id` as the default when `identifier` is omitted. Retain the legacy mode spelling for BagNode internal identity (GC-197 §055).


Owner confirmation, 2026-10-20: “si” to attribute-based identity, then “mettile tutte” for all remaining `identifier` modes. Retain the complete legacy mode syntax: `#id` (default), `#k`, `#i`, `#p`, `##`, `.child` and a named attribute such as `pkey`. See GC-197 §055 for meanings and unresolved edge cases. No additional identifier aliases or substitute identities are approved.


**Pending tree row-action naming proposal — 2026-10-20, not approved.** The owner included hover actions and requested syntax. Proposed `rowActions` Source child derives from the provisional inspector rowActions name and the existing identical Python/JS camel-case component convention. Proposed position values start/end reuse the inspected descriptor spelling. Existing button/dropDownButton/menu/menuline, action/dataController and publish names remain unchanged. Proposed row context item/path/event requires explicit contract approval. This entry records a proposal only; it authorizes no new component or marker. See GC-197 §055.


Owner trial acceptance, 2026-10-20: “proviamola” to the Source-composed rowActions example. The proposed authoring spelling `rowActions` and position='start'/'end' may be used for this bounded trial alongside existing command components. This supersedes the previous unapproved status of the syntax for trial purposes only. The public API is not implemented or finalized; row-context lifetime/placement details remain open (GC-197 §055).


Minimum tree implementation, owner direction 2026-10-20: “per ora facciamo funzionare u tree mi imale e poi aggiungiamo pian paino tutto”. Apply existing component conventions: authoring tree, class Tree, tag gramlot-tree, module components/tree.js, collection tree. Existing storepath/labelAttribute/selectedPath spellings retain their confirmed contracts. Internal bagStore is a boolean component capability, following dataScope/sourceContext metadata conventions: NodeBinding routes the store path and the renderer supplies the Bag through setStoreBag. It is not a public store alias. Internal node identity uses the BagNode object itself, with no fabricated IDs or dependency changes. RowActions runtime work is deferred.





Initial reusable-page naming direction — 2026-10-20: owner confirmed “si inizialmente si poi verifichiamo” to FramePage → IndexPage → gallery inheritance (GC-070 §1535). `FramePage` follows the existing Page/IndexPage PascalCase class convention in Python and JS; `IndexPage` retains its name. These are initial design names, pending contract verification. No new region-hook names, module/export paths, Data paths or browser runtime names are established here; decide those before implementation. Existing shipped IndexPage names remain descriptive of the current implementation, not automatic contracts for the proposed frame.


Confirmed frame region hooks — 2026-10-20: owner “si” to `top(pane)`, `bottom(pane)`, `left(pane)`, `right(pane)`, `center(pane)` in both Python and JS (GC-070 §1535). Names reuse the existing borderContainer region values and the Page hook convention; `pane` denotes the region contentPane authoring object. Hooks configure and populate that pane. A defined outer-region hook, including an inherited one, causes that region to exist. These names supersede the region-hook naming gap in the initial FramePage direction above; no aliases, alternate spellings or module/export names are added.


Confirmed IndexPage panel hook — 2026-10-20: owner “ok” to `panel(pane, node)` (GC-070 §1535). Retain the existing Page `panel` hook spelling in Python and JS; the agreed arguments denote the target tab contentPane and selected navigation BagNode. This is the proposed FramePage/IndexPage design's confirmed authoring contract, not a claim that the current shipped panel implementation already accepts those arguments. The invocation/transport mechanism remains unresolved; no new endpoint, wire format or alias is approved here.


Confirmed directory index-page filenames — 2026-10-20: owner “si” to `index.py` / `index.js`, according to the Python/JS environment, as the own page of a directory in filesystem-derived IndexPage navigation (GC-070 §1535). This includes intermediate directories whose child Bag is resolver-backed. These are application page filenames, distinct from the reusable `IndexPage` class and its implementation module. No info/meta filename aliases or precedence between Python and JS files is established.


Frame/index implementation names — owner implementation instruction, 2026-10-20: “bene procediamo con questa struttura e usiamo la gallery per verificarla”. Apply the existing Page module convention to FramePage: frame_page.py / frame-page.js; export it through the existing Page entries. Source labels frame, top, bottom, left, right, center and tabs identify the declared composition. The class property datapath reuses the existing Source datapath spelling to scope index Data. The existing indexMount / mountIndexPage names remain for the navigation-to-tab coordinator; gallery-specific controls and presentation stay in gramlot-examples. The Source wire method index_panel keeps the same endpoint spelling in Python and JS and invokes panel(pane, node) on a transported one-node selection Bag; this is a request snapshot, not an alternate store.


Frame navigation implementation, 2026-10-20, under the owner instruction quoted above: `NavigationResolver` follows the existing `RpcResolver` class convention; `navigation-resolver.js` follows component-independent module naming. Its `directory` argument and node attribute carry the relative directory path, while `url` retains page identity and `title` supplies the label. They do not expose filesystem access in core. Gallery endpoint `navigation_section` retains its existing wire name. Gallery Logic methods `galleryInitialize` / `galleryMount` follow existing camelCase named-controller conventions. Source lifecycle `_onBuilt` installs directory resolvers before the first tree render; `_onStart` mounts the gallery presentation.


Tree presentation increment — owner confirmations, 2026-10-20. Owner requests implementing labels, icons, classes and hideValues with gallery examples, and investigating legacy drag/drop eligibility and callbacks. On hideValues the owner chooses “Default False, come nel legacy”: false exposes a scalar value as a visual child; true hides scalar children. Gallery navigation explicitly uses true. Existing component Logic invocation supplies named synchronous callbacks as method(sourceNode, {item, path, opened, selected}); getLabel overrides normal label calculation, otherwise labelAttribute precedes labelCb. Owner adds “Voglio includere anche label HTML ora” and chooses “Preferisco un risultato strutturato testo/HTML” over the legacy string sentinel. Label callbacks return either {text: string} or {html: string}; raw labelAttribute remains text. HTML is sanitized with no scripts/event handlers; it does not execute application actions. Class callbacks return CSS class strings; default node labelClass/Opened/Closed and selectedLabelClass follow the already approved precedence. Custom classes are also exposed as CSS part tokens so application styles can reach the shadow-tree presentation. Scalar child rows are visual content only and select their owning BagNode/path, preserving the Bag as the sole store. Source-scoped callLogic reuses the existing LogicRegistry, without an alternate evaluator. No drag/drop API or implementation is approved by its investigation request.


Internal drag/drop eligibility implementation — 2026-10-20. Owner: “cominciamo a implementare il drag interno e non quello esterno”. `DragDropPolicy` / `drag-drop-policy.js` apply the existing PascalCase class and class-derived kebab-case file conventions (§010). The class is an internal renderer collaborator, not a Gramlot proxy or an application API. Its `isTarget`, `acceptedTypes`, `acceptsTags`, `acceptsEffect` and `evaluate` methods apply the existing camelCase method convention to the approved eligibility rules in GC-197 options 5–11 and 19–20. Existing authoring names (`dropTarget`, `dropTargetCb`, `dropTypes`, `dropTags`, `effectAllowed`, `dropEffect`, `onDrop_`) retain the approved spelling. This records a convention application, not approval of the still-open callback argument schema, typed-handler encoding/order or cross-window root protocol.


Drag preparation implementation — 2026-10-20. The owner confirms the named Logic onDrag signature method(sourceNode, {dragValues, item, path}). Internal DragPreparation / drag-preparation.js apply the existing PascalCase class and class-derived kebab-case file conventions. Renderer prepareDrag and component getDragContext follow camelCase internal collaborator methods. The explicit dragSource descriptor capability follows sourceContext/bagStore/command; a declaring component must implement getDragContext(event), with no method-existence fallback. Tree contributes its existing row/item/path correspondence and plain caption, without resolving nodes. These names do not add application proxies, a wire envelope or a cross-window protocol.


General drop action implementation — 2026-10-20. Owner confirms the onDrop keyword envelope {dropValues, item, path, source, selfdrop, dropEffect, dataAvailable}. Internal renderer invokeDrop applies the existing camelCase invocation-method convention (invokeScript/callLogic); it invokes the named Logic action on an already accepted, filtered payload and adds no proxy or automatic Data operation. onDrop is shared Python/JS runtime metadata, following onDrag's consumed-attribute treatment. The source descriptor is passed through unchanged; no new wire/member spelling is introduced by this increment.


General drop eligibility callback — 2026-10-20. The owner confirms sharing the onDrop context with dropTargetCb after an explanation of predicate versus action. Internal renderer checkDropTarget follows the camelCase collaborator method convention; it performs the dynamic check on a destination whose declarative policy is handled separately. dropTargetCb is consumed runtime metadata in both languages. No alternate callback representation, automatic Data action or new wire format is introduced.


Native internal drag integration — 2026-10-20. Internal DragDrop / drag-drop.js applies the established class/file convention and is owned by one renderer, alongside DragPreparation and DragDropPolicy. Transient session state, preview and feedback are renderer lifecycle state, not a second Data model. Existing standard browser event/type/effect names are reused without a private wire marker. Tree getDragContext supplies an internal element reference for row feedback/preview; only the approved callback fields are exposed to Logic. Source context uses the proposed camelCase identity spellings pageId/sourcePath/itemPath as internal descriptor construction for the first local-only integration; cross-window identity/membership is still unimplemented and these members are not a cross-window authorization protocol. Existing approved draggedItem/canBeDropped/cannotBeDropped classes and parts retain their names. No Handler proxy, fallback serializer, new library or automatic Bag operation is introduced.


Drag completion implementation — 2026-10-21. Internal endTopic captures the existing canonical Source-local endDrag topic via SubscriptionsHandler.topicFor; it is not a new subscription registry or naming scheme. The renderer endDrag method consumes the approved {source, dropEffect} context and guarantees callback-before-publication ordering even after callback failure.


Numbered gallery filesystem convention — 2026-10-21. Owner rejects a separate Page.order field and directs ordering through module/folder names, with the concrete example “01-Html Elements”. Owner adds “index è sempre 00”, confirms that filesystem browsing must expose the order, and allows a Markdown-only directory description. The agreed index basename is 00-index: executable Python/JavaScript pages or a descriptive Markdown index. Directory selection opens that index; it is not listed among the directory's children. Executable page labels come from Page.title; for 00-index.md the first level-one Markdown heading supplies the title (owner “si” in reply to that exact proposal). Numeric sibling prefixes determine hierarchy order; no Page.order metadata or renamed hyphen-only substitute for spaces is approved. These decisions concern authoring/navigation; they do not by themselves confirm a new FileServer path-validation contract or a general Markdown-page renderer.


Numbered navigation clarification — 2026-10-21. Owner clarifies “intendevo html elements -> html_elements”, requires the nested path to remain nested, and authorizes implementation with “proviamo”. Normalize authored module/folder names to lowercase with underscores instead of spaces, retaining sibling numeric prefixes and 00-index. Do not flatten paths or introduce route aliases as a substitute for nested paths. This supersedes the proposed space-preserving FileServer extension in GC-070 §1565; no core loader change is required. Page.title and the first Markdown H1 remain the agreed title sources. Gallery catalogue family folder uses the same existing folder member convention as lesson folder; key remains catalogue identity, distinct from physical path.

Drawer transition trigger refinement (owner, 2026-10-21): “al caricamento della pagina il drawer di code dovrebbe aprirsisenza effettomsolo se lo fa loperatore deve esserci la transizione.” Automatic Source/Data visibility changes are immediate; drawer-button activation retains the existing transition, including keyboard activation. The private border #render argument animate defaults to false and is true only from the drawer click handler. Reuse data-drawer-motion; clear it after the grid transition. No authoring parameter, proxy or gallery-local animation state is added.


Intermediate release resolver repair — owner, 2026-10-21: “Sì, adegua il contratto prima della release”, confirming preservation of lazy directories, cache and cancellation. Separate the shared asynchronous endpoint/cache lifecycle from the Source-specific dataRemote request policy. Internal RemoteResolver / binding/remote-resolver.js follows the existing class/file convention and owns asynchronous resolve/refresh, cache fingerprint and guarded Data writes. RpcResolver retains its real NodeBinding, sync behavior and NodeRequests policy; NavigationResolver retains its existing public gramlot/method/directory/onError constructor and independent per-directory requests. No fabricated Source/NodeBinding, previous RPC implementation, alternate wire format or dependency modification is introduced. Internal startLoad/loadAsync/prepareValue follow existing camelCase method conventions; the public navigation contract is unchanged.

CodeMirror implementation naming — 2026-10-21. Owner requests “ok procedi con CodeMirror base e quello con opzioni e metti gli esempi nella gallery così li proviamo”, following delegation of routine defaults in GC-198 §070. Apply the established identical camelCase component authoring convention to `codeMirror`, PascalCase descriptor `CodeMirror`, custom tag `gramlot-code-mirror`, module `components/code-mirror.js`, collection `editors`. Retain engine option vocabulary `language`, `lineNumbers`, `lineWrapping`, `indentUnit`, `fontSize`, `fontFamily`, `folding`, `autoCloseBrackets`, `autoIndent`, `autocompletion`, `highlightActiveLine`, `highlightSelectionMatches`; shared `value`, `readonly`, `disabled`, `live` and labelbox parameters keep their existing spelling.

The separate options component is a reusable Source composition, authored by Python `code_mirror_with_options` and JavaScript `codeMirrorWithOptions` following the mechanical function-name convention. It reuses `borderContainer`, `contentPane`, input controls and `codeMirror`; it does not introduce a duplicate editing engine or a generic template framework. Its required `datapath` scopes configuration Data, and its return value is the composed Source pane. Internal `EditorControl` follows the existing control base convention; `liveWrites` declares input-event support instead of assigning a fake native type. `setDiagnostics` and `revealPosition` name bounded component commands using document offsets; `save` is a Source publication requested by Ctrl/Cmd+S, with file persistence left to the consumer. These are implementation applications of existing conventions under the owner-authorized component scope, not a new global naming policy.

CodeMirror composition export clarification — 2026-10-21: Python imports `code_mirror_with_options` from `gramlot.page`; JavaScript imports `codeMirrorWithOptions` from `@gramlot/gramlot/page`, also re-exported by the browser runtime used for that import map. The optional `editors` collection exports only the widget descriptor/collection. This keeps Source composition available in both page authoring environments without a second browser engine import.

The delegated bracket-matching toggle is named `bracketMatching`, following the engine feature and camelCase parameter convention, with default true. It belongs to the same bounded CodeMirror configuration as active-line and selection matching.


Filesystem component and IDE implementation naming — 2026-10-21. Owner: “si procediamo con il componente filesystem e usiamolo nella ide con il combo delle ultime 6 directory”. Apply the existing Source-composition convention: Python `file_system_tree`, JavaScript `fileSystemTree`; `FileSystemLogic` and `FileSystemController` own resolver lifecycle without disk access. `DirectoryResolver` requests one directory through the declared host endpoint `directory_tree`. `IdePage` composes FramePage, the filesystem tree, a recent-workspace combo and CodeMirror tabs; `IdeLogic` and `IdeDocuments` own browser coordination and document Data. Integration `FileSystemPageMixin` exposes `workspace_open`, `directory_tree`, `document_read`, `document_save` within explicitly configured `filesystem_roots`; `remote_edit` is the host write gate. Existing endpoint, controller, parameter and module naming conventions apply; no new CLI grammar is introduced. Owner additionally requests a configurable separator including newline: `separator` defaults to comma for local choices. The combo's structured `store` is a Bag whose nodes have string values and `caption` attributes, mutually exclusive with nonempty `values`; the IDE uses it for the six recent paths. sessionStorage stores only successful recent roots, not drafts.


Shared hook dispatch — 2026-10-21. Owner asks “e non puoi mettere un. metodo di logic ?”, then clarifies “ma credo che sia cmune a tutti gli hook di quest tipo”. Named Logic dispatch is shared across callable hooks, including onClose, drawer_onclick, button action, native event handlers, rendered-node subscriptions and validation callbacks. A simple or qualified method name resolves through LogicRegistry; a missing method is an error, never inline fallback. Existing event/payload/context signatures remain unchanged, as do synchronous return requirements. Inline bodies still require activation with received Source; expressions/formulas are not reclassified as callbacks. Internal helpers isLogicMethod, callLogic and invokeHook in binding/hooks.js follow existing function/module naming. This supersedes the dotted-only handler-name restriction for native events and rendered-node subscriptions and adds named dispatch to previously inline-only hooks.


IDE document commands — 2026-10-21. Owner requests per-tab save/revert icons disabled without changes, opening the directory on focus-out without an Open button, and undo/redo where feasible. Apply existing camelCase Logic/component command conventions: `ideRevert`, `ideUndo`, `ideRedo`, `ideHistoryChanged`; CodeMirror `undo`/`redo` delegate to its existing per-editor history and publish `historyChanged` with `canUndo`/`canRedo`. Document Data holds derived `saveDisabled`, `revertDisabled`, `undoDisabled`, `redoDisabled` for declarative buttons. Revert restores the last loaded/successfully saved baseline without closing or writing the file; like other external document replacements it clears editor history. Save/revert are unavailable during a pending save; save also respects the host write gate. Each document has its own toolbar. Workspace `connect_onfocusout` invokes the existing Logic method after input commit; empty/unchanged roots do not reload the tree. This is local IDE work, not a release or deployment.


IDE theme/gallery follow-up — 2026-10-21. Owner requests standard theme styling for the IDE buttons and inclusion in the gallery. Reuse the existing `button--quiet` class inside the button shadow root with canonical action/selected/focus-ring tokens; apply it to the IDE commands. Source-authored stroked SVG replaces Unicode command glyphs. The Python integration owns an opt-in `ide` environment catalogue and the `stage(..., ide_roots=..., remote_edit=...)` host configuration. Host keyword names follow the existing Python convention and reuse the remote_edit gate; no filesystem endpoint enters examples or core, and ordinary gallery staging remains unchanged unless IDE roots are supplied.


HTML editor port — 2026-10-21. Owner: “si procedi con html, anteprima e jodit e mettili nella gallery così li proviamo”, confirming the preceding Code/Preview/Jodit proposal and protected nonvisual content. Apply existing component vocabulary to `htmlEditor` / `HtmlEditor` / `gramlot-html-editor`, `htmlPreview` / `HtmlPreview` / `gramlot-html-preview` in the optional editors collection. Shared `value` holds the HTML string; htmlEditor uses the existing live/readonly/disabled field contract. Both editors expose undo/redo and historyChanged; IDE Source attribute `editorView` distinguishes code/rich event origins and document `view` selects code/preview/rich. CodeMirror, Jodit and sandboxed preview share document Data; protected nodes/attributes must survive visual editing or the edit is rejected. Jodit Community 4.13.9 matches the PoC evidence and ships locally, with lazy initialization and no CDN. HTML is normalized by DOM serialization only after an accepted rich edit; this is not byte-preserving HTML source editing. No Markdown/Typst port or server-side page execution is included.


Markdown editor port — owner 2026-10-21: “bene procediamo anche con markdown editor e anteprima nella ide e mettiamo l'esempio nella gallery”. The next bounded PoC port uses the established editor convention: `markdownEditor` / `MarkdownEditor` / `gramlot-markdown-editor` and `markdownPreview` / `MarkdownPreview` / `gramlot-markdown-preview`, in the optional editors collection. `value` is a Markdown string, with standard readonly/disabled/live controls, undo/redo and scoped save/historyChanged publications. IDE documents use the existing code/preview/rich view state and history routing. ProseMirror and markdown-it implement the PoC path locally: Bold/Italic/Code/Undo/Redo toolbar, supported Markdown blocks edited visually, complex blocks retained as source blocks, frontmatter/reference documents retained whole. Raw HTML is not executed in either Markdown view. Rich edits normalize supported Markdown; initial undo restores exact original source. Engine-only document state remains a projection of Data. No new storage, language server, Markdown dialect plug-ins or release is included.


Typst port — owner 2026-10-21: “bene ora procediamo con typst: editor e anteprima nella ide e un esempio nella gallery, con generazione pdf anche lato client per la versione serverless”. Apply established component conventions to `typstPreview` / `TypstPreview` / `gramlot-typst-preview` in the optional `typst` collection. The source editor remains CodeMirror with `language="typst"`. The preview reads a bound string `value`; `filename` names its PDF download. SVG and PDF compile from the same draft in a shared, serialized browser Worker; changed input invalidates the preceding download immediately. Initialization is lazy, stale results are ignored and closing the last preview terminates the Worker. The initial portable source contract is a self-contained document with bundled fonts; project includes, custom assets and remote packages are not implicitly fetched. This increment adds no server compilation or storage route. Existing IDE save/revert and editor history remain authoritative.


IDE new documents — owner 2026-10-21 confirms “si” to choosing a document type, opening an empty tab and choosing directory/name on first save, with preview before saving. Apply existing names: IdeDocuments.newDocument/create, Logic ideNew/ideCreate/ideCancelCreate/ideShowDocument, host document_create. Draft Data uses isNew, createHidden, saveRoot and savePath; temporary tab identity remains stable after creation. document_create writes only a new UTF-8 file in an allowed existing directory, honors remote_edit and Python syntax checks, and rejects occupied paths. This extends the existing core/host IDE responsibility split; no overwrite, directory creation or browser filesystem API is added.


Typst Python recipe extension — owner 2026-10-21: “si” confirms the explicit proposal `.typ.py` (for example `report.typ.py`) for a Python recipe generating Typst, distinct from direct `.typ` source. The intended IDE presentation uses Python editing and Typst preview. This confirms the filename convention; recipe entry-point discovery and host execution are not implemented by this record. Read-only genro-typst evidence: examples define a TypstBuilder subclass with main(root), optionally setup(data), then call create() followed by render() to obtain a Typst string. Example class names vary; no universal exported recipe name was found in those examples.


Typst recipe entry point — owner 2026-10-21: “ok” confirms `class Recipe(TypstBuilder)` exported by each `.typ.py` module. The IDE uses Python language editing; generated Typst is derived, read-only Data. Apply existing camelCase Logic naming to ideRenderRecipe and IdeDocuments.renderRecipe; the host endpoint document_render_typst accepts the current Python content and returns a Typst source string. Recipe generation remains a host operation under remote_edit, invoked explicitly by Generate preview; ordinary Python files are never executed by opening or saving them. A short-lived Python process calls Recipe().create() then render(), with bounded execution time; it is not a security sandbox. SVG/PDF remain browser outputs. No Python execution is introduced in serverless.

Recipe integration names apply the existing conventions: new-document choice typstRecipe selects Python with .typ.py, not a new CodeMirror language. Document Data typstSource, previewHidden, rendering, renderStatus and renderDisabled belong to the derived-output lifecycle; no second source model is introduced. The Python host collaborator typst_recipe.py implements the existing snake_case module convention. The optional dependency extra typst uses the existing library name.


Embedded HTML in Markdown — owner 2026-10-21: “ok” confirms optional allowHtml=False, sanitized preview when enabled and preserved HTML source in the rich-editing flow. Apply the existing camelCase Boolean component parameter convention to markdownPreview.allowHtml, with live read binding and default false. IDE document Data allowHtml controls its preview independently of source/history; the Markdown preview panel exposes a checkbox. Existing HTML source blocks remain opaque to rich formatting and editable in Code. Markdown-it HTML mode is instance-specific; HTML-enabled output is sanitized with the existing DOMPurify dependency before entering the sandboxed preview. No scripts/event handlers, global parser toggle or change to htmlPreview is introduced.


Editable Python gallery — owner 2026-10-21: “si procediamo con la gallery editabile e la ricarica dell’anteprima python dopo il salvataggio”. Implements the previously confirmed original-source, revision-check, explicit-save and affected-iframe-only contracts (GC-198 §070). Apply existing gallery Logic naming to galleryCodeMount/Save/Revert, galleryIndex.sourceDocuments Data, and gallery-code-* presentation identities. Python source_document provides the original source snapshot; the integration endpoint gallery_source_save maps the catalogue key to its original Python file and reuses FileSystemPageMixin validation/atomic persistence. No client-supplied filesystem target is accepted. remote_edit remains the host gate; --remote-edit follows the CLI long-option spelling convention and applies to the existing gallery verb without redesigning the CLI. Host adapters forward the existing GramlotFileServer reload option; editable startup enables it. The iframe Source src gets a gallery_revision query value from the successful saved revision. Companions remain read-only; no general module hot reload or serverless write service is introduced.


Shared collection artifact verification — owner, 2026-10-23: "Confermo API condivisa nel core". The public JavaScript functions `collectionBuildId(metadata, files)` and `verifyCollectionArtifact(metadata, files)` belong to core and are shared by the generator and hosts. They use asynchronous Web Crypto, accept a Map of relative paths to Uint8Array bytes and have no filesystem or server dependency. The first returns the framed SHA-256 buildId; the second resolves only after checking the exact inventory, wrapper and fingerprint. This replaces duplicated JavaScript fingerprint implementations, without changing the artifact format or the Python verification contract.


Database selectors (owner implementation instruction, 2026-10-18; GC-315 §050):
canonical widget names dbSelect/dbComboBox and tags gramlot-db-select/
gramlot-db-combo-box follow the inputs collection conventions. The shared
DatabaseSelectors Python mixin exposes endpoint dbSelect and delegates to its
configured database object. SQLAlchemySelect is the provider in the Python
server database area; no new browser proxy is introduced. Legacy method,
dbtable, condition_*, selected_*, selectedCaption/Record/Cb, searchDelay,
ignoreCase, hasDownArrow, emptyLabel and autoSelect retain their spelling.


Provisional menu authoring syntax — owner, 2026-10-23: "ok" to GC-335 §130.
Reuse menu/menuline and their existing component names. menuline's positional
argument is the registered command key, with the explicit "-" separator exception.
caption follows the approved result-Bag caption name and is the sole spelling
for command-label overrides/submenu labels in this path. node_label reuses the
existing Source occurrence-identity convention; no mandatory duplicated code or
identity derived from the command key is introduced. Existing positional-caption
uses require explicit migration; no caption/key inference or label alias is
approved. These choices remain provisional for hands-on evaluation per GC-335 §125.


Provisional permanent-bar composition — owner, 2026-10-23: "Ok, adottiamo questa
composizione come base provvisoria" (GC-335 §135). menu retains the selected
presentation="bar" and orientation="horizontal"/"vertical" parameters.
spacer uses the ordinary lower-case component naming convention; its descriptor
name is Spacer and browser tag gramlot-spacer. size denotes fixed pixel space
and flex denotes flexible remaining space. contentPane and node_label retain
their existing meanings for free-content groups. Explicit nested menu declarations
select bar presentation; menuline-owned menu remains a popup. No slotBar,
slotButton or slot alias is introduced. Names remain provisional per GC-335 §125.


Provisional minimum frame — owner "ok", 2026-10-23 (GC-335 §140): framePane /
FramePane / gramlot-frame-pane follow component conventions. top, bottom, left,
right, center reuse border region names as framePane-only authoring accessors;
regions are actual contentPane Source nodes. frameTarget marks the designated
central content recipient. Reuse the existing border layout and Source identity,
without a new topic bus or global fallback. The first trial is authorized.


Popup presentation revision — owner, 2026-10-23: compact aligned rows and lateral
submenus follow the supplied menu reference. Internal CSS names menu-row,
menu-check, menu-caption and menu-arrow follow the existing descriptive CSS class
convention; they are not Source attributes. The geometry helper positionPopup
retains its name and gains the internal placement option (bottom/side), describing
the approved anchor relationship, alongside existing align/matchWidth options.
No public menu grammar or command field is added.


Menu attachment — owner, 2026-10-23: "Sì, manteniamo questa sintassi" confirms
area.menu() for contextual opening, modifiers="*" for ordinary click without
modifiers and modifiers="Shift" for exact Shift+click. Existing submenu opening
is retained. The public name modifiers follows the legacy menu convention and
existing event terminology; it filters opening, separate from command-message
modifiers. No context boolean is introduced. The internal popup geometry option
point is a viewport {x,y} position; it is not a new Source attribute. Shift, Ctrl,
Alt and Meta combinations match exactly (comma/space separated, case insensitive).
Context-key/Shift+F10 access accompanies contextual opening. validclass, alternate
attachment targets and automatic row/item context projection are not introduced
by this bounded increment.


Toolbar trial naming — 2026-10-23. Owner: "Esatto, procedi con la prima versione
nella gallery: sempre menu e menuline, con gruppi, spacer, priorità, overflow e
scorrimento. Poi la proviamo." Within this provisional implementation, reuse menu,
menuline and spacer; do not introduce slot/toolbar aliases. Derive menuline
parameters from the existing lowercase semantic parameter convention: group
(boolean, default false) marks an indivisible content group; priority (finite
number, default 0) orders overflow eligibility; overflowable (boolean, default
true) states whether that occurrence/group may leave the bar. These parameters
are presentation metadata and do not alter registered command identity. A group
contains ordinary Source children, including menuline and inputs, and does not
execute a command itself. Existing spacer(size/flex) remains unchanged.
ToolbarOverflow is a private presentation collaborator of MenuContainer; it owns
measurement, named-slot projection and popup/scroll cleanup, not Source, Data or
command execution. data-menu-overflow is an internal rendering marker. The browser
keeps the original light-DOM nodes and Source parents during projection. An input
moved while focused remains focused and opens its overflow panel if necessary;
this is trial behavior to verify with the owner, not stable-API acceptance.

The internal named slots overflow/suppressed are projection slots, not new Source
node types. Suppressed separators have no rendered target when they would be
leading, trailing or duplicated; content nodes are never discarded.


Toolbar labels and icon sizing — 2026-10-23. Owner: "Sì, procedi con queste tre
modalità e aggiungi gli esempi nella gallery. Nel menu di overflow manteniamo
sempre icona ed etichetta affiancate", followed by the request for larger toolbar
icons and a subtle hover background. Derive labelPosition and iconSize from the
existing camelCase component-parameter convention. menu defaults are
labelPosition="beside" and iconSize=24 (positive CSS pixels); menuline may override
either, with null meaning inherit from its enclosing group/menu. labelPosition
has exactly beside, below and tooltip. Popup and overflow rows always show the
caption beside the icon at normal menu scale; the toolbar setting never deletes
the caption. Tooltip text uses authored/registered tooltip, otherwise the caption.
Accessible button names retain the caption even in tooltip mode. Internal CSS
classes toolbar-button, toolbar-below and toolbar-tooltip and the CSS variable
--gramlot-toolbar-icon-size describe presentation only, not new Source elements.


Vertical toolbar reference — 2026-10-23. Owner requests the gallery rail with
large icons, tooltip, selected state, separators and overflow, with horizontal
chevrons for a vertical bar and vertical chevrons for a horizontal bar. Reuse
orientation and existing menu/menuline/checked parameters: no slotbar or selection
API is introduced. Overflow and submenu triggers use › on vertical bars and ▾
on horizontal bars; popup descendants retain lateral ›. This supersedes the
trial's orientation-independent » overflow glyph. The example's selected section
belongs to page Data and named Logic, not a new core radio-group contract.


Owner confirmation, 2026-10-23: “Sì, iconSrc per SVG” and “Per la voce, con icona configurabile a parte”. iconSrc follows existing camelCase component parameters and is an image URL on command surfaces and registered definitions. icon remains text/emoji; iconSrc renders an image, never injected SVG markup. iconSize remains the toolbar icon size; caption, class_, color, width and height keep existing occurrence presentation names. Internal renderIcon and entryIcon/entryIconSrc centralize image/text rendering and occurrence-over-registry resolution. A supplied occurrence icon choice replaces the registered choice; within a choice iconSrc takes precedence over icon. Owner also requests reduced horizontal padding and background-only toolbar selection; popup checks remain visible.


Window trial names — owner 2026-10-23 confirms dialog/html_dialog/floatingPane and instructs first implementation. Dialog/FloatingPane descriptors use gramlot-dialog/gramlot-floating-pane in layout. WindowShell shares chrome and native modal/nonmodal ownership; window.frame exposes one real Source framePane. Provisional GC-320 parameters title/open/closable/movable/resizable/collapsible/collapsed/beforeClose retain their proposed spelling. width/height/left/top and minWidth/minHeight are CSS lengths; open/collapsed and completed geometry changes use existing writeParameter. requestClose(reason) on window Source delegates to the mounted component; beforeClose calls named Logic with window node and {reason}, boolean/Promise<boolean>. Explicit open=False bypasses the guard. Internal setSourceContext follows selected containers. Window CSS tokens follow --gramlot-window-<role>.


Window maximize names — 2026-10-23. Owner confirms the proposed contract with
“ok”. maximizable (read boolean, default false) and maximized (twoWay boolean,
default false) follow collapsible/collapsed and the component parameter convention.
They apply identically to dialog and floatingPane. Internal data-maximized marks
presentation only. The normal expanded rectangle remains separate from viewport
presentation; neither maximize nor collapse rewrites bound geometry. Restore size
and Expand window are distinct accessible button actions.


Aesthetic revision (2026-10-23, owner asks for compact professional themes): retain
existing IDs gramlot-compact, mimi and joanna and the established --gramlot-<role>
tokens. Menu/window dimensions consume field-height, button-padding/button-gap,
space and radius tokens rather than introducing parallel density names. Appearance
choices remain provisional. PreviewPage is an examples-owned shared Page subclass.


Independent gallery colors (2026-10-23). Owner: “fai in modo che sia possibile anche scelgiere temi di colori o abbinamenti diversi”. The gallery preference palette and control index-palette follow appearance/index-appearance; generated paletteStyles follows appearanceStyles. Values reuse compact, mimi and joanna for their color combinations; default means no color override. Color-only CSS lives at themes/palettes/<profile>.css and uses established semantic tokens. The gallery-owned parent/frame message carries palette alongside appearance and theme, validated against the generated paletteStyles keys. No new component parameter or core runtime API. The initial color combinations are provisional visual choices.


Overflow indicator revision (2026-10-23). Owner prefers “>> o un icona simile rivolta a destra” at the end of the toolbar. Replace the overflow-only single orientation-dependent glyph with a right-facing double-chevron SVG and the existing More commands accessible name/tooltip. Submenu indicators retain their small orientation-dependent chevron. This supersedes the overflow glyph portion of the earlier vertical toolbar reference; no parameter or Source name changes. Local icon/path variables follow existing component SVG construction.


Tree disclosure refinement (2026-10-23). Owner requests an unfilled chevron and tighter spacing before the label. Reuse the existing expander/spacer/icon/caption parts and aria-expanded state; internal chevron/chevronPath locals follow component SVG naming. The SVG rotates on expanded branches without a parallel state attribute. No public API or icon-selection change.


Automatic Data companion — 2026-10-24. Owner confirms the additive foo_data.tytx convention. Reuse data for the optional initial-main response field alongside the unchanged value (Source). resolveData / resolve_data follows the server's existing resolveResources / resolve_resources hook convention; null means no companion. RpcHandler.callEnvelope names the existing envelope operation, shared with value-only call. mountMainSource's initialData argument names startup Data and does not replace the Builder-owned root. Gallery route data names the companion file; staged wrappers retain its _data.tytx suffix. Worker initialData holds serialized TYTX, decoded freshly for each main. These implementation names add no author-facing loader or dataSetter alias.


Mela appearance — owner-confirmed name, 2026-10-24: “tema Mela per desktop e mobile, chiaro e scuro”. Display name Mela maps to lowercase appearance key `mela` and `themes/mela/theme.css`, following mimi/joanna. Reuse existing semantic tokens; no new component parameter, theme protocol field or DOM marker.


Page-loading performance — 2026-10-24. Reuse Page.gramlots and existing collection identities. Internal Python _collection_documents, _prepared_grammars and _load_collections follow underscore-prefixed server state/method conventions; cached schemas are copied into request-local builders. Resource _content names process-fixed verified bytes. No new author-facing API.


JavaScript loading performance — 2026-10-24. Page.gramlots retains the Python declaration name; pageCollections, iterPageClasses and loadCollections are the camelCase server counterparts of the Python hooks. preparedGrammars names the server-local compilation cache. Gallery-generated descriptor.js contains the existing prepared metadata shape without importing widget implementations. These files sit outside the verified artifact inventory; runtime artifact bytes remain unchanged.

`clonePreparedSchema` copies resolved grammar metadata for the server cache, retaining compiled validators and cloning cardinality Maps and parent Sets.


Gallery toolbar placement — 2026-10-24. Owner: “consideriamo anche il rapporto larghezza altezza e fammi provare la toolbar sotto o di lato nella gallery.” Reuse the gallery Data preference convention: toolbarPosition (auto/left/bottom), control gallery-toolbar-position and subscription gallery-toolbar-position. The existing Source attribute spelling data_toolbar_position emits data-toolbar-position on gallery-frame for placement styling. This is a gallery trial, not a core device-classification API. Automatic placement uses the existing narrow-layout threshold plus portrait/square proportions; explicit choices override placement alone.


<a id="gc-225-100"></a>
## 100 · Device integration namespace and Data map

Block ID: **GC-225-100**.

Owner, 2026-10-24 (translated): “This philosophy is important. I would only change it to gramlot.dvc (device) and DeviceHandler; the reserved Data path gramlot.device is where I will map everything.” Follow-up: “If we are agnostic, in the future we could use something other than Capacitor.”

Confirmed names and scope:

- `gramlot.dvc`: the device-themed runtime proxy; `DeviceHandler`: its class. The names follow the existing three-lowercase-letter proxy and theme-plus-Handler class conventions. The derived JavaScript class filename is `device-handler.js` when implemented.
- `gramlot.device`: the reserved subtree inside the page's Data Bag for the device map. This is a Data path, not a new `gramlot.device` property on the runtime object. This decision reserves this subtree only; it does not settle the broader deferred system Data namespace.
- Application-facing contracts are provider-independent. Capacitor is the first PoC provider, owned by gramlot-capacitor; the core must not acquire a Capacitor dependency. No alternative provider or implicit capability emulation is selected.
- Reads use resolvers and their agreed cache behavior. Native state/events enter Data and triggers. A publish activates an ordinary dataController; that controller creates/enqueues work in Data. Controllers own the application orchestration, including reactive dataRpc calls. No parallel application state or queue framework is implied.

These names supersede the discussion proposals `gramlot.capacitor` and `gramlot.cap`, and the device-map roots `grmlt.capacitor` and `native.app`. The earlier App.getInfo fixture names are historical preparation evidence; the initial appinfo/location destinations are subsequently approved below. No compatibility aliases are approved.

This is an approved naming/architecture direction, not an implemented proxy, resolver or provider interface. The current runtime still constructs its existing handlers. Exact leaf schema, provider attachment/lifecycle, commands, subscription topics, queue semantics and interpage ownership remain design work. The index page was discussed as a possible owner, not established as a globally shared Data Bag. See GCP-020 in gramlot-capacitor for the bounded design record.


Owner confirmation, 2026-10-24: “ok” to the proposed initial result map. Data paths are gramlot.device.appinfo and gramlot.device.location. appinfo has string fields id, name, version and build; location has numeric latitude and longitude in degrees, accuracy in metres and timestamp in Unix-epoch milliseconds for the position measurement. GCP-020 §045 records this bounded result contract. Operational metadata belongs in node attributes (owner “puoi uaare degli atibuti”); their exact names remain undecided. These names establish no runtime implementation or aliases.


Owner confirmation, 2026-10-24: “ok” to the common device node attribute status and values idle, pending, success, error, unavailable, denied and cancelled. GCP-020 §050 defines their meanings for appinfo/location. This selects status only; the remaining operational attributes and handler methods are still design work.


Owner confirmation, 2026-10-24: “ok” to the device node attribute error, its object fields code/message and common codes UNAVAILABLE, PERMISSION_DENIED, TIMEOUT and FAILED. GCP-020 §055 defines their status mapping and null/clearing behavior. These names are provider-independent and add no runtime implementation.


Owner confirmation, 2026-10-24: “ok” to DeviceHandler.invalidate(name) and DeviceHandler.refresh(name), exposed through gramlot.dvc for appinfo and location. These method names follow the existing camelCase JavaScript method convention. GCP-020 §060 defines invalidation/refresh behavior; return values and detailed lifecycle interactions are not selected by the naming decision. No implementation or aliases are introduced.


**Historical record — public methods superseded by GCP-020 §070 below.** Owner confirmation, 2026-10-24: “ok” to DeviceHandler.watch('location') and DeviceHandler.unwatch('location'), exposed through gramlot.dvc, and the location node attribute watching. Method names follow the existing camelCase JavaScript convention. GCP-020 §065 defines the bounded monitoring contract. No appinfo monitoring, aliases or runtime implementation are introduced.


Owner, 2026-10-24 (verbatim): “ok allora usiamo enabled per il desiderio e watching per lo stato effettivo, senza watch e unwatch pubblici”. GCP-020 §070 supersedes the public watch/unwatch proposal: the location node attribute enabled expresses application intent, and watching reports the effective listening state. No public watch/unwatch methods or compatibility aliases remain in the selected contract. invalidate/refresh retain their separately approved responsibilities. No runtime implementation is claimed.


Implementation delegation, 2026-10-24: owner “mi are cge tu abbia capito,. non farmi trppo domande e vediamo cime viene” authorizes proceeding with the bounded appinfo/location PoC using the established design, resolving remaining implementation details without repeated questions. This is scoped to this device increment, not a general relaxation of constitutional confirmation requirements. Apply existing Handler/Resolver class naming and camelCase methods: DeviceResolver (device-resolver.js), DeviceHandler.attach(provider), and the provider methods readAppInfo, readLocation and startLocationUpdates. CapacitorDeviceProvider belongs to gramlot-capacitor. attach installs one explicit provider per page; no runtime discovery, monkeypatches or alternate providers. invalidate/refresh are commands returning no result; Data owns outcomes. Provider async internals may use Promises. No public watch/unwatch. Core retains no Capacitor dependency.


Implementation checkpoint, 2026-10-24: the bounded device increment now implements the delegated names above. cacheTime reuses the established Bag resolver spelling and seconds convention. DeviceProvider, DeviceName, AppInfo and DeviceLocation are TypeScript contract types following the existing PascalCase type convention; the page's deviceAttach/deviceRefresh/deviceInvalidate/deviceError Logic methods follow the existing camelCase named-logic convention. Provider installation is opt-in through dvc.attach, with no alternate discovery path. Status and test evidence are recorded in GC-070 and GCP-025; physical-device validation remains pending.


Camera increment naming, 2026-10-24: owner “proviamo ora con la fotocamera, sempre con la stessa filosofia dei dati”, followed by “continua”, extends the device PoC to camera capture. Together with the earlier request to proceed without repeated implementation questions, this authorizes the bounded implementation details below; these are scoped choices, not individually confirmed API proposals. Apply existing Data attribute and camelCase conventions: gramlot.device.camera stores a result Bag with url and format; capture is a transient attribute event issued with Source.FIRE('gramlot.device.camera?capture'). Reads never acquire a photo. Existing status/error attributes carry progress and outcomes. One pending capture per page; repeated pending commands are ignored. Cancellation and failure retain the last photo. DevicePhoto is the PascalCase result type; the explicit provider method takePhoto(signal) owns acquisition. The Python fixture uses named Logic deviceCapture/devicePending and an ordinary image src binding. No new public handler command, resolver for camera, gallery selection, upload or queue is introduced. Local photo preview lifetime is the current page/native temporary file. GCP-030 records implementation and verification.


Biometrics increment naming, 2026-10-24: owner “Funziona, vedo la foto. Proviamo ora Face ID, sempre con la stessa filosofia dei dati.” accepts native camera capture/preview and requests the next bounded device slice. The earlier instruction to proceed without repeated implementation questions covers coherent details within this request, not unrelated APIs. Reuse the Camera Data-event convention: gramlot.device.biometrics, transient verify attribute issued through Source.FIRE, and shared status/error attributes. Result is null until successful completion, then a Bag containing verified=true; every new attempt clears the prior result, and unsuccessful outcomes leave it null. This represents one local biometric check, not a durable authorization grant or server login. Existing PascalCase/camelCase conventions give DeviceBiometrics, provider verifyBiometrics(signal) and fixture Logic deviceVerifyBiometrics. Reads never prompt; there is no biometric resolver, cache or public handler verification method. No passcode fallback or web simulation. GCP-035 records the chosen implementation, checks and limits.


Local notifications increment naming, 2026-10-24: owner “Proviamo ora le notifiche, sempre con la stessa filosofia dei dati.” The announced first slice is local notifications; remote APNs push remains a separate planned gate. Scoped details follow the earlier instruction to proceed without repeated implementation questions. Under gramlot.device.notifications, request is a Bag with id (positive signed-32-bit integer), title/body (nonempty strings), delay (positive finite seconds); scheduled holds id/at (Unix milliseconds) after OS scheduling acknowledgement, received holds id/title/body, and action additionally holds actionId. Source.FIRE('gramlot.device.notifications?schedule') snapshots request and starts scheduling. Root attributes status/error describe this command; listening/listenerError separately describe event-listener readiness. Attach installs native event listeners without permission prompts; scheduling requests permission when needed. Plain reads/writes do not schedule. DeviceNotificationRequest, DeviceNotificationSchedule and DeviceNotificationEvent follow PascalCase types; provider scheduleNotification/startNotificationEvents and fixture deviceScheduleNotification follow camelCase. Events update ordinary Bag bindings with no automatic navigation, upload or executable payload. No public watch/unwatch, automatic notification queue or remote-push claim. GCP-040 records behavior and verification.


Server push increment naming, 2026-10-24: owner “Funziona, vedo la notifica e il tocco aggiorna i dati. Proviamo ora le push dal server, sempre con la stessa filosofia.” accepts local display/action and requests real APNs push. The owner says an APNs key must be created; key creation remains their action while implementation proceeds. Scoped names follow existing event/Data conventions and the earlier instruction to avoid repeated detail questions: gramlot.device.push contains registration (token), received and action; ?register triggers native registration, status/error describe its result, listening/listenerError describe page event listeners. Registration completion is the native token event, not the SDK register() acknowledgement; a 30-second wait can time out, with later genuine token updates still accepted. Provider methods registerPush/startPushEvents and types DevicePushRegistration/DevicePushEvent are generic; Core has no APNs dependency. Events carry id/title/body/messageId/destination and actionId for actions. The fixture uses deviceRegisterPush, pushRegister (Python endpoint) and view.push.serverRegistration/serverStatus/serverError. A ^token dataRpc registers the dedicated anonymous PoC device slot on the server; no send endpoint is public. Operator-only server CLI sends an alert to that slot with destination=device. Tokens/key material are not rendered or logged. No arbitrary URL execution, account login, background silent push, production environment or general routing protocol is introduced. GCP-045 records the bounded implementation and verification.


Shortcut increment, 2026-10-24: owner “ok proviamo a registrare uno shortcut che apra la gallery, sempre passando dai dati gramlot”, then explicitly “Sì, procedi con questo percorso” to gramlot.device.shortcuts.request (id/destination), a controller accepting only gallery, and the new gramlot.dom.navigate(url) with the fixed official gallery URL. This explicitly authorizes the missing core navigation capability under §13. DeviceShortcutRequest is the generic event type; startShortcutEvents(callback, signal) follows the existing provider event lifecycle and returns asynchronous cleanup. shortcuts has request=null and listening/listenerError attributes. The provider callback receives a request or null plus an error, following the location event convention. Core projects nonempty string id/destination into a Bag and suppresses duplicate current ids; it never chooses a destination. navigate accepts an absolute HTTP(S) string without embedded credentials and navigates the current document; app policy selects the URL. No arbitrary native dispatcher or automatic core routing is introduced.

Fixture names deviceOpenShortcut and view.shortcuts.error follow existing camelCase Logic/Data conventions. Native names GramlotShortcuts, ShortcutStore, OpenGalleryIntent, GramlotAppShortcuts and DeviceBridgeViewController are confined to gramlot-capacitor. One persistent native pending request (latest wins, five-minute lifetime) bridges app startup; takePending consumes it once before delivery to JavaScript, so this is not a transaction across process crashes. The App Intent has no user-supplied URL and only queues destination=gallery. A running app on another page returns to its configured Device entry point to attach the consumer; only the Data controller opens the fixed official gallery. Existing owner-specified official gallery is the single additional native navigation hostname. New native integration targets iOS 26+ App Intents supportedModes, with no legacy intent path. GCP-050 records implementation and hardware verification separately.


Barcode increment, 2026-10-24: following the feature proposal including QR/barcodes, owner “si tutte utili” and later “passiamo alle altre funzioni” authorizes continuing the device PoC. The announced next slice is QR/barcode scanning. Coherent implementation details follow the earlier scoped instruction to proceed without repeated detail questions; no new dispatcher or architecture exception is introduced. Names follow existing camera/biometrics conventions: gramlot.device.barcode holds null or a Bag with text/format; scan is a transient FIRE attribute and status/error use the shared contract. Source.FIRE('gramlot.device.barcode?scan') starts a single scan; plain writes/reads never do. A new attempt clears the previous result. DeviceBarcode and provider scanBarcode(signal) are generic; fixture Logic deviceScanBarcode and view.barcode.pending are camelCase. Native numeric symbologies are projected to their standard string names (QR_CODE, EAN_13, CODE_128, etc.) by the Capacitor provider, not exposed as SDK enum numbers. The page renders the result as text without executing URLs or sending it to a server. Cancellation is cancelled with no error; denial is denied/PERMISSION_DENIED; unavailable native plugin is unavailable/UNAVAILABLE. Disposal ignores late results; the selected native scanner has no public abort operation, so user dismissal remains the way to close an already-presented scanner. GCP-055 records tests and hardware acceptance separately.


Network/lifecycle/haptics increment, 2026-10-24: owner “Sì, Code 128 e annullamento funzionano. Passiamo a rete, ciclo di vita dell’app e feedback aptico, sempre con la stessa filosofia dei dati.” accepts those barcode checks and explicitly requests this bounded continuation. Names follow the existing event/Data conventions and scoped delegation of implementation details, without a new dispatcher or architectural exception. gramlot.device.network is null or a Bag with connected:boolean and type:none/unknown/wifi/cellular. gramlot.device.lifecycle is a Bag with active:null/boolean, event:null/pause/resume and sequence:0/increasing integer; active is independent of background entry. Both have status/error/listening attributes and page-owned automatic subscription plus an initial snapshot, never a timer or permission prompt. Provider startNetworkEvents(callback, signal) and startLifecycleEvents(callback, signal) return asynchronous cleanup. DeviceNetwork and DeviceLifecycleEvent are provider-independent types; lifecycle events are kind=state with active, or kind=pause/resume. A snapshot cannot overwrite a newer native state event. On disposal callbacks are ignored and every acquired handle is removed, including handles acquired after disposal. Listener setup errors use the shared status/error contract. Core state validation errors leave the previous valid value and report error; subsequent valid events recover. gramlot.device.haptics is null or a Bag with style and acknowledged=true; attributes style=medium (light/medium/heavy allowed), impact=null, status=idle and error=null. Only FIRE(?impact) starts provider impact(style, signal); plain writes and reads never execute it. Pending commands deduplicate, snapshot style, clear old result, and ignore late completion after disposal. Success means the SDK acknowledged the call, not proof of physical feedback on unsupported hardware. Fixture names deviceImpact, deviceLifecycleEvent and view.lifecycle.pauses/resumes follow existing Logic/Data conventions. No background JavaScript execution guarantee, Internet reachability assertion, persistent event history or browser fallback is introduced. GCP-060 records verification separately.


Vibration increment, 2026-10-24: owner “ok proviamo anche una vibrazione più lunga, sempre passando dai dati gramlot” explicitly requests a separate sustained vibration test. Existing haptics Data gains duration=600 (integer milliseconds, 1–5000 for this bounded PoC) and a transient vibrate attribute. FIRE('gramlot.device.haptics?vibrate') calls provider vibrate(duration, signal); reading or ordinary writes never execute it. The result is a Bag {duration, acknowledged:true}; impact retains {style, acknowledged:true}. Each new command clears the prior result. Both commands share one pending-request gate and the existing status/error/disposal semantics. Success is SDK acknowledgement, not elapsed vibration or proof of perception; the SDK has no cancel API and pending ends when its call resolves. No timer-based repetition or replacement of impact is introduced. Fixture Logic deviceVibrate emits FIRE; the Python page adds “Vibrazione 600 ms”. The already installed official plugin supplies vibrate, so no new native package or API bridge is needed.


Audio increment, 2026-10-24: owner “bene, proviamo ora a registrare audio, sempre passando dai dati gramlot” requests recording; “Preferisco una dipendenza con licenza MIT” selects MIT over the proposed MPL-2.0 plugin. Scoped implementation uses @independo/capacitor-voice-recorder and official Filesystem (MIT), retaining Capacitor 8/SPM. gramlot.device.audio starts null with start/stop/cancel FIRE attributes, status=idle, error=null, recording=false. Explicit start clears the previous result and releases its recording; pending covers native startup and stopping; recording indicates a confirmed open capture. Stop returns a Bag {url,mimeType,duration} and success; duration is milliseconds. Cancel, native interruption and app background discard the capture; normal reads/writes never request the microphone. Generic DeviceAudio/DeviceAudioSession and provider startAudioRecording(onInterruption, signal) provide stop() and dispose() ownership: dispose releases microphone, owned listeners and the captured file. No auto-resume, background capture, upload, transcription or arbitrary dispatcher. Commands deduplicate while pending; cancel is allowed during startup. Disposal ignores late results and awaits cleanup. Cleanup failure is reported, not swallowed. Fixture deviceAudioStart/deviceAudioStop/deviceAudioCancel only FIRE; deviceAudioBusy/deviceAudioCanStop/deviceAudioCanCancel derive button state. Python audio(src=^gramlot.device.audio.url, controls=True) provides playback without app DOM wiring. Recording output is an app-cache file; only the provider knows its file path. The result exposes a playable native URL. A later start or page disposal deletes the owned result. Abnormal process termination may leave cache files; this PoC does not claim durable file management or crash cleanup. GCP-065 records verification separately.


Audio sharing increment, 2026-10-24: owner “bene, proviamo ora a condividere la registrazione audio, sempre passando dai dati gramlot” explicitly requests sharing the current recording. The official @capacitor/share 8.0.3 is MIT and supports Capacitor 8/SPM. Scoped names follow existing audio commands: FIRE(gramlot.device.audio?share), shareStatus (idle/pending/success/cancelled/unavailable/error), shareError and shareActivity (null or string, including empty). Existing audio result and recording status are preserved by share outcomes. DeviceAudioSession gains share(signal):Promise<{activity:string}>; the provider alone knows the retained native file path. Sharing requires a completed recording and deduplicates pending commands; start/cancel do not invalidate a file while its panel is open. Missing recording is an error, not an empty panel. No arbitrary URL/file input, app-selected recipient, automatic sending, server upload or public sharing dispatcher is introduced. iOS completed means the activity completed, not recipient delivery. Exact SDK cancellation message “Share canceled” maps to CANCELLED only within the Share adapter. Disposal ignores late results and delays deletion of the audio file until the native panel settles; Share has no public dismiss API. Fixture deviceAudioShare emits FIRE; deviceAudioShareDisabled derives availability. Existing busy/cancel formulas also depend on shareStatus. A new recording or audio cancellation clears sharing metadata. GCP-070 records checks and owner acceptance separately.


Slider fixture, 2026-10-24: owner “ok proviamo uno slider collegato ai dati gramlot, con una publish al rilascio” authorizes a bounded page example using the existing horizontalSlider, live binding, connect_onchange and publish/controller subscription. Fixture names follow existing camelCase Logic and topic conventions: sliderReleased publishes sliderReleased with {value} read from view.slider.value; sliderReceived writes view.slider.lastReleased and increments view.slider.releases. view.slider.value starts at 25, releases at 0 and lastReleased at null. Native range change denotes a committed user edit (pointer/touch release or keyboard change), not every pointerup; unchanged release and programmatic Data writes do not publish. No new core API, gesture recognizer, DeviceHandler capability or native dependency.


Pinch component, 2026-10-24: owner explicitly confirms “Sì, aggiungi pinchPane nel core e prepara la prova” in response to the concrete value/min/max/step/onEnd container proposal. PinchPane / pinch-pane.js / pinchPane / gramlot-pinch-pane follow the existing descriptor, filename, authoring and DOM-tag conventions. The layout collection owns this generic slotted container. value is a reactive read projection with explicit Source-context writeParameter writes, like container parameters; it is not a native input using ControlAdapter. onEnd is a named Logic callback receiving {value}; it does not itself prescribe a global topic. Existing fixture sliderReleased publishes the same topic for slider and pinch; subscribers stay unchanged.

Two touch pointers establish an initial distance and Data value; their distance ratio produces a scale quantized by native range min/max/step semantics. Limits require finite positive min/step, max >= min and finite value. An internal detached native range provides the same quantization as horizontalSlider, not another application value store. Pointerup ends the gesture once; callback runs only for a changed value. Pointercancel, capture loss, third touch, document hiding, window blur, disconnect or an external parameter change cancels without callback or rollback. Already written Data remains authoritative. All captures/listeners are released; a new gesture needs two fresh touches. Gesture-local coordinates/baseline exist only while interacting. touch-action:none applies only to the pane, not the whole page. No global gestures, image transform logic, native dependency, application DOM wiring or compatibility fallback. Fixture photo and rectangle bind their transform to view.slider.value alongside a horizontalSlider; range 0.5–3, step 0.01, initial 1.

The approved onEnd name is a binding-owned callback, stripped from native DOM attributes and accepted only on pinchPane with its declared component metadata. Other onEnd declarations remain rejected by requireNoScriptAttributes; no generic on* bypass is introduced.


Transform extension, 2026-10-24: owner proposes “potremmo anche traslare . in pratica x y rotate zoom” and confirms “ok” to the concrete four-Data transformPane proposal. TransformPane / transform-pane.js / transformPane / gramlot-transform-pane replace the unreleased pinch-only component without aliases. Parameters x/y (CSS pixels), rotate (degrees, continuous), zoom (factor) are finite reactive read projections explicitly written through Source context. min/max/step retain their existing meaning for zoom only. onEnd receives {x,y,rotate,zoom}; the fixture uses transformReleased/transformReceived and topic transformReleased, view.transform.{x,y,rotate,zoom,last,releases,css}. Children follow a Data-derived translate(x,y) rotate(angle) scale(zoom) CSS transform; the surface itself is not transformed.

One primary pointer translates. Two touch pointers additionally rotate and zoom from their midpoint/angle/distance; movement of the midpoint translates. Pointer membership changes rebase against current Data, preserving continuity. Rotation unwraps each angular delta across ±180 degrees. A gesture ends only when all its pointers lift, publishing once when the final tuple differs from its initial tuple. Third pointer, cancellation/capture loss, blur/hiding, removal or external parameter change cancel without rollback or completion. Internal state is limited to gesture geometry/baselines, never a parallel application state store. Existing bounds/step sanitization and cleanup remain. No native plugin, release or compatibility alias.


Clipboard increment, 2026-10-24: owner “bene, proviamo ora copia e incolla con la clipboard, sempre passando dai dati gramlot” activates the previously proposed official Clipboard integration. The bounded slice exchanges text only, using official @capacitor/clipboard 8.0.1 (MIT, Capacitor 8/SPM). Names follow existing device command conventions: gramlot.device.clipboard has result null or Bag {text}, attributes text (copy input, initially empty), copy/paste (FIRE only), operation (null/copy/paste), status and error. Copy snapshots input and returns that text after the native write acknowledgement; it does not read back the clipboard. Paste returns native text. Each start clears the previous result/error. Commands share one pending gate; normal Data reads/writes never access the clipboard. Existing success/unavailable/error/denied/cancelled conventions apply when the provider supplies the corresponding code; no permission diagnosis is inferred from an empty native result.

Provider methods copyText(text,signal):Promise<void> and pasteText(signal):Promise<DeviceClipboard>, DeviceClipboard={text:string}. Empty strings are valid; no coercion or rich-format fallback. Native text/plain only is accepted from read; image/rich-only payloads fail without entering Data. The SDK rejects absent/unreadable content with a generic error; its message is preserved without fabricated empty success. Dispose aborts delivery and prevents subsequent Data writes, but cannot undo a native copy or dismiss an iOS prompt already started. No polling, resolver-triggered paste, automatic retry, server upload or clipboard logging. Fixture deviceCopyText/devicePasteText only FIRE; Python declares input, output and status. Browser remains unavailable, without Web Clipboard fallback.


Photo library increment, 2026-10-24: owner “bene, proviamo ora a scegliere foto dalla libreria, sempre passando dai dati gramlot” requests single-photo selection through the established device Data contract. Scoped implementation names follow camera conventions: transient choose attribute on gramlot.device.camera, Source.FIRE('gramlot.device.camera?choose'), provider choosePhoto(signal):Promise<DevicePhoto>, fixture Logic deviceChoosePhoto. Capture and choose share the existing pending gate and result Bag {url,format}; ordinary writes/reads never open either native panel. Both commands retain the last successful image on cancellation/failure, use existing status/error outcomes and ignore completion after disposal. The installed Camera provider supplies explicit photo-only, single-selection acquisition; actual returned format is retained. Only preview URL and format enter Data, without EXIF, private path, thumbnail or upload. No resolver, multi-photo/video flow, image editing, automatic capture or fallback is introduced. These are bounded implementation details under the requested increment, not separately confirmed API proposals. GCP-095 records implementation and verification separately.


Universal Link increment, 2026-10-25: owner “Per la prima prova usiamo https://gallery-py.gramlot.dev: un link a un esempio della gallery deve aprire quell’esempio nell’app.” The bounded destination is the verified current color example /pages/01-inputs/04-colorpicker. DeviceHandler gains links capability, gramlot.device.links.request Bag {id,url}, listening/listenerError attributes, provider startLinkEvents(callback,signal), and DeviceLinkRequest. These follow the established shortcut event naming and lifecycle. Native delivery validates the exact HTTPS URL, queues one pending public link for up to five minutes, and returns to the bundled entry Source; Data controllers perform the target navigation. The provider and entry Logic validate the same destination. The entry is Python-authored embedded Source, mounted by existing startSource without Page execution or a server transport. No login, account transfer, preferences persistence or arbitrary domain navigation is included in this first link probe. The owner also requests a gallery branch named “Mobile application”, visible “Solo nell’app Capacitor”; platform detection belongs to the gallery integration, not core. Android qualification remains pending; platform-neutral Data contracts are shared, native iOS plumbing is not claimed portable.


Mobile environment/frame increment, 2026-10-25: the owner confirms automatic framework adaptation and iframe plugin delegation (constitution mobile-device-frames). Shared exports MobileEnvironment, DeviceFrameHost and FrameDeviceProvider use PascalCase classes in mobile-environment.js and device-frames.js. The transport marker gramlot:device is separate from gramlot:publish; a transferred MessagePort carries only the established DeviceProvider method allowlist, correlated results/events, explicit resource close and cancellation. No application-level device API aliases are added. The host validates Source ownership and exact allowed origins on connection and subsequent operations; opaque/unowned frames are rejected. Links/shortcuts remain top-level entry responsibilities. DeviceHandler accepts an optional attachment lifetime callback through attach(provider, {dispose}); frame transport disposal binds to page disposal. Shared mobile document/viewport setup and touch sizing belong to core; Capacitor-specific bar style and native calls belong to gramlot-capacitor. These are bounded implementation names under the expressly approved architecture, not approval of unrelated messaging semantics.


Mobile module separation, 2026-10-25 (owner instruction, constitution mobile-examples-module): examples/mobile_application is the Python module in gramlot-capacitor, with pages/, assets/, page.py and catalog.json. The catalogue uses id/title/path/capabilities/requires entries and relative page paths; it contains no domain, credentials or deployment paths. Host mount and backend registration are integration responsibilities. DevicePage keeps its existing name and Data commands; its push_register callback is host-supplied and absent configuration produces an explicit error. This is the mobile module's handoff format, not an implemented generic gallery extension API. Theme work extends the existing mela name, existing CSS layers and tokens; no new theme alias is introduced.


Mela theme refinement, 2026-10-25: --gramlot-button-color follows the existing --gramlot-button-background/--gramlot-button-hover convention and lets a theme give filled command controls readable foregrounds. The existing button--secondary class must have the same meaning inside shared command Shadow DOM as for HTML buttons; button--quiet remains unchanged. Press, contrast and forced-color states belong to the shared command component, not application wiring. This is bounded theme/component adaptation under the owner's explicit request for the Apple-inspired Gramlot theme.


<a id="gc-225-mobile-gallery"></a>
## Mobile gallery receiver names — 2026-10-25

Owner requests integration under GCP-110 and preparation under GCP-120, explicitly
excluding deployment/TestFlight upload. Python `gallery_modules`, `modules`,
`catalog_file`, `prerequisites` and `stage_module` follow the existing snake_case
page-option/host-function convention. Browser `mountGalleryModules` follows the
existing gallery mount functions. Registration retains catalogue `id`, `title`,
`visibility`, `entries`, `path`, `capabilities`, `requires`; host-only `mount` and
`integration` select the trusted local resource. No new core proxy, provider
representation or native command alias is introduced.

MobileEnvironment uses its existing class name in the public runtime exports,
following DeviceHandler/Gramlot class exports. The provider imports that same
runtime instance instead of bundling another viewport owner. The core owns its
disposal; integration code releases only its appearance subscription. This keeps
GCP-110's single-owner viewport contract across the actual browser bundles.


<a id="gc-225-detachable-tabs"></a>
### Detachable tab presentation — 2026-10-25

Owner confirms `detachable=True`: “si e diovrebbe far comparire un icona da draggare. e quando chiudo il floating ritorna.” The parameter belongs to tab child contentPane configuration; it defaults to false. Source and content DOM ownership stay fixed. A draggable, keyboard-operable icon opens the same content in a shared nonmodal window; closing returns it to its original tab. Naming follows existing boolean child parameters and window vocabulary: internal `WindowSurface` (`components/window-surface.js`) owns shared chrome/geometry; `WindowShell` remains the custom-element adapter. No new public custom element or alternate Source representation is introduced.


<a id="gc-225-native-mobile-data"></a>
## Native mobile Data and database names — 2026-10-25

Owner requests integration of GCP-110 §050/060 and GCP-130. Retain the established owning-library names: DeviceHandler `openDatabase(name)` and its page-owned `query`, `execute`, `close` connection; `gramlot.device.database` for state/errors. Motion uses the existing `orientation`, `gyroscope`, `accelerometer` capability names and their matching `gramlot.device` Data branches. Gallery imports the compiled provider and catalogue, without renaming these APIs, declaring SQL models in core or adding plugin dispatch aliases. Database models remain in the mobile example and use Asqueel.


<a id="gc-225-tree-search"></a>
## Tree searchText — 2026-10-25

Owner confirms: “Sì, confermo searchText. Procedi con la toolbar di ricerca nella navigazione, includendo i rami non ancora caricati e il ripristino dell’albero quando svuoto il campo.” `searchText` is a read-bound text parameter, default empty. It filters caption text literally and case-insensitively after a short debounce. Ancestors remain visible; resolver branches are read on explicit search. Clearing restores the unfiltered expansion state. Search presentation does not replace the store or alter Source.


<a id="gc-225-error-notifications"></a>
### Internal error notifications — 2026-10-25

Owner selected “Notifica non modale, con dettagli espandibili” for remote and drag/drop errors, then instructed “vai”. `ErrorNotifications` names the internal presentation owner, following `AskDialog` and other responsibility-named internal classes. `BindingRuntime.reportError(error, title)` follows camelCase action naming; it is not a new Gramlot proxy or application API. Source-authored notices use the `gramlot-error-notifications` class, native manual popover presentation, and the existing named Logic close-event convention. The internal component context delegates error reporting to its binding runtime.


The follow-up review extends the same internal `reportError(error, title)` delegation to Source-context components for transformPane `onEnd`. No new public handler or proxy is introduced. The five-notice limit and dismissed-identity policy are recorded in the constitution (2026-10-25).


IDE ownership correction (2026-10-25): reuse existing `ide*` camelCase method names, passing the originating Source node explicitly wherever instance context is required. Internal non-enumerable Source object attachments `ideContext` and `fileSystemController` follow the JavaScript camelCase convention and existing class vocabulary. They own per-widget lifecycle/resources, are not authoring parameters, schema metadata or serialized Data, and introduce no new Source proxy API. `IdeDocuments` and `FileSystemController` receive their owning Source node and resolve Data relatively. Generated editor node IDs use a per-IDE prefix retained by Source to prevent collisions between identical documents in two IDEs. This implements the owner's Source/Data ownership correction, without introducing a public proxy or compatibility overload.

IndexPage ownership correction — owner implementation instruction, 2026-10-25 (GC-000 Logic/index runtime ownership): `indexContext` follows the existing `ideContext` camelCase convention for a non-enumerable, configurable object attached to the owning Source node. It owns the existing coordinator and its lifecycle; it is not a Source attribute, proxy API, serialized state or Logic field. Existing `indexMount` and `mountIndexPage` names remain. `indexMount(node)` takes the controller Source context; no DOM shell-ID lookup is needed.

IndexPage load outcomes — owner confirmation “si”, 2026-10-25 (GC-000 IndexPage
load outcomes): retain `onLoad(url, status, error)` and the existing `loading`,
`ready`, `error` values; add the approved `cancelled` terminal value. Cancellation
is distinct from failure. No new proxy, event family or request-ID API is added.

HTTP close simplification — owner approval, 2026-10-25 (GC-000 One HTTP close path):
reuse `close(pageId)` and `dispose()` without the obsolete `beacon` selector. No
new transport, fallback, public method or compatibility alias is introduced.


Editor Data projection, 2026-10-25: the existing internal engine method `replace(value)`
is reused by HTML and Markdown, matching CodeMirror. No public authoring parameter
or alternate Data representation is added. Jodit's public `value`, `history` and
selection APIs are used; CodeMirror and ProseMirror use document transactions.
The HTML protection codec's per-document context is retained with engine history:
an inert `gramlot-document-` comment uses the existing random-ID convention and
never becomes application HTML. It identifies the codec for the head/protected
content when Jodit restores a body snapshot, including head-only replacements.
These resources belong to the editor instance and are released on disposal.
The owner's editor-projection amendment supersedes the earlier Revert reset text.


Jodit security integration (2026-10-26, owner update instruction): reuse upstream
`cleanHTML.sanitizer`, DOMPurify's documented hook/configuration, and the existing
`gramlot-document-` history marker. Only a comment matching an existing instance
record is retained by the sanitizer. No new authoring parameter, marker format,
proxy or application state is introduced. Sanitizer hooks are instance-owned and
released with the editor.


Input type setter (2026-10-26): reuse the existing `type` attribute, native
`HTMLInputElement.type` setter, `ControlAdapter.classFor`, attach/detach and the
Source-owned renderer record. No public API or new state store is introduced.
Documentation distinguishes the HTML tag (`input`, `textarea`) from the input type
(`text`, `password`, `checkbox`). `multiple` and `group` remain separate follow-ups.


### HTML labelbox experiment — 2026-10-26

Reuse the §050 lbl/lbl_position/lbl_*/box_*/box_l_*/box_c_* vocabulary.
Internal createLabelbox/projectLabelbox and labelboxStyle name the shared
creation/projection/style operations; gramlot-labelbox scopes shared CSS.
Renderer record.presentation denotes the outer DOM presentation, while element
remains the actual HTML target. These are internal experimental implementation
names derived from existing Labelbox/renderer conventions, not public APIs.

Unified Labelbox experiment (2026-10-26): preserve the existing Labelbox mixin
as the component semantic integration contract, without DOM composition.
`setLabelbox(layout)` attaches the renderer-owned presentation to that integration.
The portable `labelbox` capability flag identifies that contract; plain HTML and
other components can receive the same presentation without this hook. The outer
DOM element's `labelbox` reference contains projection resources, not application
state. No public authoring alias or new movement parameter is introduced.

TrayPane naming (2026-10-26): owner selected “traypane” in response to the
trayPane proposal. Use `trayPane` (component/authoring) and `TrayPane` (definition),
following framePane/FramePane. canvasPane and workspacePane are superseded
proposals, not aliases. Geometry, rotation, scale and selection parameter names
remain undecided; this record does not introduce their public API.

TrayPane geometry (2026-10-26): owner confirmed the concrete proposal with “ok”.
Reuse left/top/width/height and z_index; add rotation (degrees) and scale (factor,
1 = normal). Geometry is numeric in tray-plane pixels, not CSS strings; this is
a tray block contract and does not redefine ordinary HTML style attributes.
All are bindable to Data; center is the rotation/scale origin, and the rectangle
is defined before transforms. Selection and additional authoring names are open.

Labelbox composition helpers (2026-10-26): `labelboxContent(presentation)` and
`labelboxPresentation(content)` are private DOM projection helpers, paired with
createLabelbox/projectLabelbox. They identify the content and layout surface of
the one renderer-created wrapper, so parent component contracts do not mistake
presentation for authored content. No alternate Source representation is added.


Labelbox movement trial (2026-10-26): reuse `trayPane`/`TrayPane` and
`gramlot-tray-pane`, in the layout collection. The owner confirms `storepath`
and `node_label` as the block's exact key in that Data Bag. Each row is a Bag
with numeric `left`/`top` in tray pixels. Missing rows initialize to zero in Data.
The direct Labelbox children reuse `movable` (default false). `lbl_variant="card"`
is the confirmed shared presentation, default for movable blocks; box_* dimensions
remain presentation attributes. TrayPane projectChild owns its direct children's
positioning. Its internal context `label` is the Source label, not a new public
identifier. Existing bagStore/setStoreBag and subtree bindings drive updates.
Gesture/capture resources belong to the mounted TrayPane, never Logic.
The owner's storepath decision supersedes the earlier literal Source geometry
proposal for tray blocks; no writeLayoutParameter implementation remains.
Shared card CSS reuses surface, border and window-radius tokens and adds
--gramlot-card-header-background/color for the approved contrasting title bar.
No new persistence format, implicit local storage or public proxy.


TrayPane resize increment (2026-10-26): reuse `resizable`, `minWidth` and
`minHeight` from window controls for direct tray children; defaults false,
100 and 64 respectively. The existing geometry row adds positive numeric
`width`/`height` (outer CSS pixels), required when resizable is enabled.
The renderer-owned Labelbox keeps a `resizeHandle` DOM reference; this is a
projection resource, not geometry state. The small corner button shares the
window resize icon and supports pointer dragging and arrow keys. Minima govern
interactive resize; the tray edge is the outer limit. `data-resizable` and
`data-resizing` are private CSS markers alongside `data-moving`.


TrayPane layer increment (2026-10-26): confirmed `layer` replaces the earlier
proposed tray `z_index` field (no alias). Existing geometry rows require an
integer layer; newly created zero-position rows start at layer 0. CSS z-index
is only the projection, isolated by the tray's stacking context. Private
`tray-geometry.js` rectangle helpers `overlaps` and `contactFraction` compute
first contact for movement and resize without state. Bag update events supply
the previous layer for rejected changes, so no parallel accepted-state cache
is introduced. Layer subscription identity is a disposable runtime resource.


TrayPane selection increment (2026-10-26): use boolean `selected` in each
node_label-keyed Data row, alongside geometry and layer. Its default false is
initialized in the Bag when absent. The private `data-selected` DOM marker is
a projection for the thin theme-colored outline, never a second state store.
Reuse the existing focus-ring/brand color tokens. Selection changes do not
alter layer, background, content, or Source topology.


Tray layer menu (2026-10-26): `createTrayLayerControl` in
`tray-layer-control.js` creates renderer chrome stored as `labelbox.layerControl`
(button, popup, slider, output DOM references). Private CSS uses `tray-layer-*`
and `data-tray-block`. Reuse positionPopup, native Popover and the vertical
range styling already used by verticalSlider. No additional public parameter,
selection state, layer cache or application event wiring is introduced.


Tray transforms (2026-10-26): use the already agreed `rotation` and `scale`
geometry fields (defaults 0 and 1). Private `tray-geometry.js` helpers operate
on transformed rectangles, without state. `createTraySettings` replaces
createTrayLayerControl; `labelbox.traySettings` holds DOM resources, with
`tray-settings-*` CSS markers. The settings floating uses the existing
floatingPane/framePane components. Its UI parameters live in the owning
geometry row's `settings` Bag; neither Logic nor a parallel state store is used.


Tray rotation grip (2026-10-26): `labelbox.rotationHandle` is a DOM resource
alongside resizeHandle; private `tray-rotate`/`data-rotating` markers mirror
tray-resize/data-resizing. It edits the existing rotation field. The settings
resource adds zoomSlider, editing scale as a percentage; no new state store.


Tray layout lock (2026-10-26): `locked` is the boolean, bindable trayPane
parameter for disabling user layout editing, following existing state adjectives
(disabled/selected). It does not disable card contents or external Data projection.
Reuse existing data-movable/data-selected and hidden handles; no new CSS marker.
Save/restore in the trial uses Bag.deepcopy() and ordinary Data paths.


Tray compact controls (2026-10-26): retain createTraySettings as the owner of
header controls, now `controls.layer` and `controls.scale`, each with button,
popup, input and output DOM references. Private tray-settings-button/popup
styles; data-kind distinguishes the two controls. UI open state uses
settings.layerOpen/settings.scaleOpen in the existing row. No geometry aliases.


Tray snapping (2026-10-26): gridStep (pixels), gridVisible (boolean) and
rotationStep (degrees) follow camelCase component parameters, bound read-only to
Data like locked. They are tray settings, not reserved geometry row labels.
The trial binds them to tray_ui and snapshots this Bag alongside composed_layout.
Private --tray-grid-size/display properties project the grid decoration only.


Tray group movement (2026-10-26): reuse selected, left/top and data-moving.
The existing private drag resource holds members (DOM/Bag references and original
poses for cancellation); no persistent group identity or duplicate selection.


Tray rectangle selection (2026-10-26): reuse per-block selected in Data.
Private tray-marquee names the transient selection rectangle DOM resource;
its original selection snapshot belongs only to the active pointer gesture.


Tray implicit controls (2026-10-26): remove movable/resizable child parameters.
Private data-movable/data-resizable markers remain renderer projections only;
no author flags or aliases. Use existing framePane/top/center/menu composition.


Surface/header color pairs (owner, 2026-10-27): "ogni tema definisce sfondo e
testo per superficie e testata, senza inversione automatica". Keep the existing
surface pair --gramlot-surface/--gramlot-ink. Name the shared title-surface pair
--gramlot-header-background/--gramlot-header-color, following the existing
--gramlot-<role>-background/color convention. Card headers and window titlebars
consume it. Existing --gramlot-card-header-background/color remain explicit
card-local overrides, not theme aliases. Light/dark values are chosen separately;
no inverse-color derivation or automatic swapping is introduced.

Publication sender metadata (owner, 2026-10-27): "sì aggiungilo come metadato della
publish e aggiorna l'esempio così il controller può sapere il pageId della
finestra mittente". Extend the reserved _subscription_ context convention with
_subscription_metadata, beside _subscription_kwargs. Its pageId key preserves
the existing envelope spelling and identifies the validated sender, never the
destination. PageStore.publish and BindingRuntime.publish carry a keyword-only
metadata argument separately from payload. Local publications without metadata
provide an empty mapping. Each subscriber receives its own metadata mapping;
payload fields cannot replace this reserved context. No new wire field is needed.


Server-to-browser publication (owner 2026-10-27, approved proposal): page_id is
the Python spelling of existing pageId, a keyword-only destination on
PageStore.publish. _publish_to_page is its injected neutral-server callback;
GramlotServer.publish_to_page names that routing operation, while
connect_page_channel registers the adapter send callback by page identity.
_page_channels parallels the existing _page_stores registry and is cleared by
the same page lifecycle. No transport implementation enters core. Server outbound
messages reuse op=publish, pageId (recipient), topic and payload, without an id;
the browser delivers locally through the existing subscriptions service.


Reverse publication metadata (owner 2026-10-27): reuse metadata, pageId and the
reserved _subscription_metadata names already established for PageStore delivery.
SubscriptionsHandler.publish receives metadata as an internal third argument,
while ordinary Gramlot.publish retains its current two-argument API. Subscriber
callbacks receive metadata separately as a second argument; providers place it
in the reserved context. Each subscriber gets a fresh mapping. Local publication
without origin metadata supplies an empty mapping and does not inherit an outer
publication's metadata. No second publication service or window protocol.


Kajenn database names, 2026-10-28: owner confirms db(name)/async_db(name) on
Page and PageStore. These mirror Kajenn's public snake_case accessors and pass
name unchanged. The private _database_access reference binds the host service;
GramlotServer._invoke is the protected execution seam used by host adapters for
sync/async page code and store reactions. _StoreChannel owns the existing
Gramlot wire rules; native transport classes retain their host's names. No
backend-specific type or import enters the core.


Gallery selector naming, 2026-10-29 (constitution 11.101): DjangoSelect follows the established SQLAlchemySelect/AsqueelSelect provider class and register/select protocol. Native model classes State, Customer, Invoice, Product and InvoiceRow apply the existing Python class convention; their field names are the source's physical identifiers. _DjangoFileServer follows the existing server-subclass convention and supplies only Django's invocation policy. No browser proxy, JS marker, compatibility alias or universal model type is added.


State-name selector naming, 2026-10-29 (constitution 11.102): `state_name` reuses the complete Invoice customer's existing relation alias; `selected_state_name` follows the approved `selected_<field>` projection convention. Django registration's `annotations` uses Django's native annotation terminology and trusted expression mapping; relation paths remain server-side. No browser API or proxy is added.


Direct auxiliary selector naming, 2026-10-29 (constitution 11.103): `auxColumns`, response `columns` and `headers` retain legacy names. Compiled Asqueel result column names are authoritative (`@state.name` yields `_state_name`); `selected__state_name` follows `selected_<returned field>`. As corrected by constitution 11.104, Asqueel auxiliary paths are model-resolved per request; `columns` registration is not a prerequisite for them. Returned names remain compiler-owned. No relation-name conversion is implemented in Gramlot. Base page `selector_parameters` is ordinary Python example configuration supplied by its runner, not a framework API.


Selector presentation, 2026-10-29: `templateNull` follows the existing camelCase
component parameter names `template`, `emptyLabel` and `selectedCaption`. It is
literal replacement text for null record values, not a new pointer syntax.
`--gramlot-choice-popup-min-width`, `--gramlot-choice-item-padding` and
`--gramlot-choice-alternate-background` follow the existing theme token prefix
and choice scope. Owner requested generic, theme-based compact choices and a
clear null value in chat 01a1874b-9446-7910-98f3-2a793361c1d5, then authorized
review and incorporation here. Wider default presentation applies to database
HTML templates; ordinary choices retain field-width presentation.

Tray card removal — 2026-10-29: owner requests a removal cross in Gallery tray
and rotation, zoom, layer controls grouped on the left. Reuse the established
child parameter `closable` (default false), as for selected-container panels;
no alias or separate close state. The renderer remove action deletes the card
Source, and trayPane removes its keyed layout row. Layout lock hides the action.
