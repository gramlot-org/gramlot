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
| JS markers of Python decorators | A Python decorator `@x` corresponds in JS to the static method `registerX` of the base class of the declared type, called after the class: `InOut.registerRoute('sendMail', {...})`, `Page.registerSource('details')`, `Page.registerEndpoint('m')`. The method annotates the class method and wraps it with the parameter check. JS has no decorator syntax that Node and browsers run; a method named like the decorator would read as performing the action, while in Python the `@` makes the declaration recognisable. Supersedes the free function `source(Page.prototype.m)` (`js/src/adapters/page.js:11`), migrated in 0.2.10. Owner, 2026-10-06: "non mi piace la funzione volante route, preferirei avere una classe che ha vari metodi tra cui route"; "un metodo route mi pare che esegua il routing, non che lo annoti" | owner decisions 2026-10-06 |
| Example pages | A generic `div` is held in `pane`; `html_main` is held in `main_content`; an element is never named `page` | GC-210 row S14bis (`210-binding-contract.md:755`) |
| Commands | Environment, then verb: `gramlot <environment> new\|gallery`, `gramlot node\|bun gallery`, `gramlot-serverless build\|gallery`, `npm create @gramlot page\|site` | owner decisions 2026-10-02 and 2026-10-05; GC-055 |

<a id="gc-225-015"></a>

## 015 · Primary objects and proxies

Block ID: **GC-225-015**.

Decided proxies of `Gramlot`, each with the theme of its class docline:

- `gramlot.src` (`SourceHandler`): the Source and every change of it. Holds
  `builder`, `source`, `renderer`, `binding`, `logicRegistry` and the functions
  `startSource`, `mountMainSource`, `prepareSource`, `remoteSource`.
- `gramlot.rpc` (`RpcHandler`): the exchange with the host. Holds `transport` and
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

- `Host`: a primary object with proxies, or a boundary object without proxies. It
  has no legacy equivalent; it corresponds in part to a Kajenn application (page
  registry and routes).

<a id="gc-225-025"></a>

## 025 · Current code against these rules

Block ID: **GC-225-025**. State after the first pass of 0.2.10 (browser); the
server refactoring is planned for 0.2.12.

- `Gramlot` (`js/src/gramlot.js`) holds only lifecycle (`start`, `loadMain`,
  `dispose`, `abort`, `pagehide`, `loading`), data (`pageId`, `state`, `data`,
  `logic`, `window`) and the proxies `src`, `rpc`, `dom`, `utl`. No themed
  function is left on `Gramlot`.
- The handlers live in `js/src/handlers/`; the existing classes they hold keep
  their names.
- `Host` differs between the languages: the page registry and its pruning are
  private in Python (`_pages`, `_prune`) and public in JS (`pages`, `prune`);
  `registerPage` exists only in JS (`js/src/adapters/host.js:58`).
