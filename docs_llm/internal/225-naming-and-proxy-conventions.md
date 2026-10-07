# 225 · Naming and proxy conventions

Document ID: **GC-225**. Started: **2026-10-06**. Register of the decisions:
`temp/perimetro-0-2-x.md` (coordinating chat, 2026-10-06). Sections marked
**Open** record a question, not a rule.

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

Decided proxies: `gramlot.utl` (`UtilitiesHandler`), with `gramlot.inout` of
2026-10-03 moving to the group `gramlot.utl.inout`. Owner, 2026-10-06:
"gramlot.utl.inout.sendMail".

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
- A handler is a `RoutingClass` of the routes package of the core
  (`js/src/routes/`, export `@gramlot/gramlot/routes`): the API subset of the
  Python `genro-routes`, with the same names and behaviour, kept ready to become a
  separate package. Owner, 2026-10-06: "gli handler sarebbero routing class";
  "lo possiamo tenere per ora in gramlot come package già pronto ad essere messo a
  parte".
- The browser primary object is `Gramlot`. On the server the same rules apply to
  `Page`. Kajenn terminology (server, application, `code`, `mount`, avatar) is the
  reference on the server side.

Owner, 2026-10-06: "i proxy server e client sono elemento definito con regole.
Quindi la scrittura del codice non è totalmente libera e di fantasia ma deve
adattarsi a regole e cercare una standardizzazione."

<a id="gc-225-020"></a>

## 020 · Open

Block ID: **GC-225-020**.

- One base class per family of proxies, holding the reference to its primary
  object. Legacy: `GnrBaseProxy` for the page (`gnrbaseproxy.py:10-23`), none for
  the site.
- Implicit delegation from a proxy to its primary object (`__getattr__`,
  `gnrbaseproxy.py:18-19`).
- Creation of a proxy: lazy or at startup. Legacy uses both (`connection` at
  startup, the others lazy).
- `Host`: a primary object with proxies, or a boundary object without proxies. It
  has no legacy equivalent; it corresponds in part to a Kajenn application (page
  registry and routes).
- Content of `src`, `rpc` and `dom` (proposal of 2026-10-06, not confirmed):
  `src` the Source and every change of it, holding builder and renderer; `rpc`
  transport to the host only; `dom` DOM utilities and the DOM↔Source lookup.
- Theme of `remoteSource`: the owner states that it can belong to `src` if every
  change of the Source goes through `src`, with `rpc` as transport only.

<a id="gc-225-025"></a>

## 025 · Current code against these rules

Block ID: **GC-225-025**. Facts of 0.2.7, input of the refactoring planned for
0.2.10 (browser) and 0.2.12 (server).

- `Gramlot` (`js/src/gramlot.js`) holds themed functions directly:
  `remoteSource` and `remoteRequests` (server exchange), `reference`,
  `getBaseSourceNode`, `getDomNode` (renderer).
- The members of `Gramlot` that delegate by theme (`builder`, `binding`,
  `renderer`, `transport`, `inout`, `logicRegistry`) are the existing classes
  themselves, not handlers; no member of `Gramlot` is a handler yet.
- `Host` differs between the languages: the page registry and its pruning are
  private in Python (`_pages`, `_prune`) and public in JS (`pages`, `prune`);
  `registerPage` exists only in JS (`js/src/adapters/host.js:58`).
