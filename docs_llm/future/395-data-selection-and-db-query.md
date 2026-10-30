# 395 · Data selection, query definitions and PageStore validation

Document ID: **GC-395**. Discussion checkpoint: **2026-10-30**.

[Full counterpart](../../docs/future/395-data-selection-and-db-query.md).

This document preserves the owner's design discussion. It is not an implemented
API, a completed security design, or authorization to modify the Bag dependency.
No implementation agent has been assigned to this port yet. The separate agent
working on environment collections and deferred engines has a different scope.

<a id="gc-395-005"></a>
## 005 · Purpose and teaching constraint

The resident customer-grid example currently writes its own `load_customers`
endpoint, builds result Bags and includes floating-window and benchmark controls.
The owner wants a small example that communicates the actual grid/data contract;
instructions belong in the gallery description. Hiding boilerplate in example
helpers is not a substitute for providing the missing framework capability.

Owner: “Allora portiamo dataSelection come nel legacy. Prima definiamo il
contratto … senza una RPC scritta apposta.” The requested sequence is legacy
inspection, responsibility/design discussion, then an implementation agent.
The later `method` distinction below refines when a custom endpoint is necessary.

<a id="gc-395-010"></a>
## 010 · Verified legacy and current evidence

Read-only inspection of `/Users/gporcari/Sviluppo/Genropy/genropy` established:

- `gnrpy/gnr/web/gnrwebstruct/dojo11.py::dataSelection` emits `dataRpc`, normally
  targeting `app.getSelection`, with table, columns, conditions and ordering.
- `gnrpy/gnr/web/gnrwebpage_proxy/apphandler/get_selection.py::getSelection`
  prepares/executes a selection, produces grid rows and metadata, and also
  handles named frozen selections and output slices. Query `limit/offset` and
  selection-output `row_start/row_count` are different operations.
- `gnrjs/gnr_d11/js/genro_components.js::SelectionStore` coordinates loading,
  notifications and linked grids; it can derive columns from grid structure.
  `Selection` and `VirtualSelection` distinguish resident and partial results.
- `resources/common/gnrcomponents/framegrid.py::fg_viewConfigurator` checks
  `configure_view`, exposes `fieldsTree(checkPermissions=True)` and saved views.
  `resources/common/th/th_viewconfigurator.js` accepts dragged model fields.
  These checks are evidence of intended permission handling, not a security audit
  proving that every legacy execution path is protected.

The PoC has a `dataSelection(destination, adapter, dbtable, ...)` declaration and
database dispatch. Its contract is not automatically the destination contract.
See its `docs/development/datarecord-dataselection-legacy-audit-2026-09-15.md`.

Current Gramlot has `dataRpc`, resident `BagCollectionStore`/`BagCollectionView`,
and experimental JSONL/window-selection loading. It does not yet provide the
public `dataSelection`/`dbQuery` contract discussed here. The dbSelect service is
for choosing a value, not a replacement for loading a grid selection.

<a id="gc-395-015"></a>
## 015 · Owner-defined responsibilities

Owner: “è una dataRpc specializzata per letture di record da database … puo
incorporare parametri di lettura parziale ed altri specifici del db”.

- **dataSelection:** specialized database-read RPC declaration, reusing RPC
  transport, bindings, triggers and callbacks. Partial-reading parameters and
  database-specific capabilities belong in its selected contract.
- **Database endpoint/provider:** executes reads and supplies the agreed result.
- **Collection store/view:** consumes resident data and provides views; do not
  introduce a duplicate copy of the rows or confuse query declaration with store.
- **Grid:** presents data and structure. A configurable database grid must be
  able to request additional authorized model fields, not only rearrange the
  columns present in its initial example.

Exact store-to-loader integration, metadata placement and partial-fetch protocol
are still open. Application state remains in Source or Data, never Logic.

<a id="gc-395-020"></a>
## 020 · Endpoint mode and framework mode

Owner: “se non sei asqueel allora usi method … se sei asqueel e usi il framework
completo ci pensa il framework (in 'new genropy') oppure metti le chiamate negli
endpoint, usi method e non hai la configurabilita runtime”.

The generic route is `dataSelection(method=...)`: application endpoints own
database access and authorization. Asqueel can also be used inside such endpoints.
Full model-aware query configurability belongs to a supporting framework, not
to an implicit universal database service in the GUI core. Presentation changes
to already returned grid columns are distinct from configurable database queries.

The owner subsequently proposed an open `dbQuery` contract mapped to Asqueel
syntax: “poi se qualcuno la vuole usare e scrivere il traduttore dipende da lui”.
Thus the current direction is an Asqueel-shaped definition with an initial
Asqueel implementation; other integrations may provide translators. This refines
the earlier Asqueel-only proposal rather than promising SQLAlchemy support.
FastAPI is an HTTP framework, not an alternative query language.

<a id="gc-395-025"></a>
## 025 · Server-side dbQuery definition

Owner introduces `pane.dbQuery('myqueries.customers.fooquery', ...)`: query
parameters are kept in the server PageStore and the page refers to their path.
The query-definition path is separate from the browser Data destination for rows.
The exact `dataSelection` keyword for referencing that path is **not decided**.

Owner: “posso configurare la query ma su quel percorso abilito i controlli …
solo se modifico una dbQuery”. The intended flow is:

1. Register a query definition in a protected server PageStore branch.
2. Submit configuration changes through the controls enabled on that path.
3. Execute the accepted definition repeatedly by reference, avoiding a repeated
   structural authorization pass for unchanged definitions.

Do not silently freeze all columns to the initial Python declaration: that would
remove the required TableHandler-style configurability. Do not expose an
unrestricted alternative write path to the protected definition either.

Not yet settled: definition schema, translator interface, registration lifecycle,
parameter binding, definition revision, and validation transaction boundaries.

<a id="gc-395-030"></a>
## 030 · Security ownership and unresolved safeguards

Owner assigns privilege policy to the application/framework server layer, not
Gramlot's GUI layer. The discussion considered page table scopes, application
authorization, and database users/roles. No universal `dbSandbox`, mandatory
hook API, default-deny setting, or database-role strategy was approved.

The following are assistant recommendations to resolve, not accepted APIs:

- Distinguish structural query edits from bound runtime values; define validation
  for values and ownership of mandatory conditions such as tenant restrictions.
- Check page/session ownership when dereferencing a definition or cached result.
- Include fields used in filters, joins, sorting and aggregates in structural
  authorization, not just returned columns.
- Revalidate/invalidate accepted definitions if applicable permissions change.
- Keep rejected changes from altering the executable definition; preserve the
  previous accepted definition and avoid partial updates or premature events.
- Translators should reject unsupported capabilities explicitly.

Moving parameters to PageStore alone is not a security guarantee. The mutation
and execution boundaries must be specified and tested before claiming one.

<a id="gc-395-035"></a>
## 035 · Reconsidering Python Bag validation

Owner explains that legacy Python Bag validators were unused and intentionally
not ported, and asks whether PageStore now justifies restoring them.

Legacy `gnr/core/gnrbag.py::BagNode.setValue` calls validators with new and old
values before assignment; the chain can transform values or raise an error.
The installed new `genro_bag` explicitly rejects legacy `_validators`.
Current `PageStore.change` applies supported changes directly; `_on_change`
observes changes after mutation, so that subscription is not a preventive veto.

Proposal under discussion: a general pre-mutation branch control in Bag, with
PageStore supplying request context and the application supplying policy.
It would need to cover nested writes, attributes, insertions, deletion and ancestor
replacement, not merely assignment to the root query node. Multi-field query
edits need an explicit atomic acceptance contract. None of this is implemented
or approved as a Bag API; dependency edits require their own authorization.

This is separate from form validation: invalid user-entered values may remain
in form Data under the approved form contract, while a rejected query definition
must not become executable. Async validation, transformations, transactions,
rollback semantics and error reporting remain undecided.

<a id="gc-395-040"></a>
## 040 · Next decisions and implementation handoff

Before assigning the implementation agent, settle:

1. Protected PageStore mutation contract and whether Bag supplies the primitive.
2. `dbQuery` schema, translator ownership and application validation integration.
3. `dataSelection` signatures for `method` and query-reference modes, trigger
   behavior, result Bag shape, identity and metadata.
4. Relationship to existing collection stores/views; resident loading first and
   how partial selection/cachedFetch capabilities extend it without duplication.
5. Error/stale-response handling, cleanup, permissions changes and cache ownership.

The teaching acceptance case is a small resident grid with a declarative loading
statement and a short column structure. No benchmark or floating boilerplate in
the introductory example. Generic endpoint and framework query examples must be
distinguished. No publication is authorized by this design checkpoint.

Related exploration: [database-managed permissions (GC-396)](396-database-managed-permissions.md). This compares database identities and roles without adopting that option.
