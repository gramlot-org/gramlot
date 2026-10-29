# Grouplet resource and loading contract for owner review

Status: base component implemented as an independent opt-in collection; resource
integration required, detailed storage/loading API still proposed. See GC-360 §065.

## Owner direction — 2026-10-28

Owner: “a me servirebbe salvare il grouplet con ke sue opzioni di caricamento poi
nel adapter kajenn. possiamo integrarlo col sistema tisorse”.

Include saving a grouplet together with its loading options and integrating it
with the resource system through the Kajenn adapter in the initial design.
The preceding agent proposal to defer catalogue/Kajenn integration was not
approved and is superseded. This instruction establishes the requirement; it does
not settle the stored representation, lookup rules or write API.

## Proposed responsibility split

- The resource host owns storage, lookup and access policy for the saved grouplet
  and its loading options. The Kajenn adapter connects this capability to Gramlot.
- Gramlot owns reusable typed Source construction, per-instance Data context,
  existing remote dispatch/requests and removal/cleanup. Core imports no Kajenn
  service and contains no filesystem catalogue or persistence implementation.
- A reusable resource definition is distinct from each mounted instance and its
  editable Data. Saving loading configuration must not accidentally save live
  instance state or share it between instances.

Proposed stored content: a reference to the Python grouplet definition together
with its loading configuration. Whether the owner instead requires saving the
complete authored definition is still to be clarified. Field names, format,
configuration precedence and storage location are not approved APIs.

## Verified integration surface and gap

Read-only inspection of the local integration sources:
`gramlot-py-server/src/gramlot_py_server/kajenn.py` constructs
`GramlotCollectionResources` and passes it to `_KajennFileServer`.
`collection_resources.py` serves verified, immutable collection browser assets;
its registry is fixed and its resource objects are read-only. It does not provide
save/load of grouplet definitions and loading options.

Core `src/gramlot/server/resources.py` handles resource names and load ordering,
not file lookup or storage. Constitution 11.57 assigns named resource hosting to
genro-kajenn. The collection asset service is not evidence that this separate
resource capability is already implemented. Identify the concrete resource host
contract before adding any loader, registry or write API; reuse its facilities
where available and report missing facilities to their owning project.

## First implementation contract to settle

1. Specify what is saved: definition/reference and loading configuration, distinct
   from instance Data. Show one saved resource and its Python authoring usage.
2. Trace resolution through the existing resource system and Kajenn adapter;
   specify missing/denied resources, storage writes and configuration precedence.
3. Reuse current @source/dotted dispatch where sufficient. Explicit Page-owned
   Python objects remain an implementation candidate, not a required user API.
4. Qualify two instances of one saved resource, two resources with same-named
   methods, nested/deferred dispatch and correct cleanup. Preserve current
   single-flight/first-pending request semantics.
5. Verify saved loading options round-trip, isolation of instance Data, lookup
   errors and the actual host authorization boundary. Examples stay Python-first.

Forms/persistence of business records, topics/wizards and repeated collections
remain separate composition contracts. Saving the grouplet configuration is part
of this resource contract and must not be deferred with form persistence.


## Implemented first increment — 2026-10-28

Owner explicitly requests starting the independent collection implementation.
The base grouplet now uses existing remote/remote_* and explicit datapath through
an opt-in prepared collection. Python Page-owned helpers are exercised by fixtures
only, not required by a new public grouplet API. See
[GC-360 §065](../../docs/future/360-grouplets-implementation-plan.md#gc-360-065)
for authoring, verification and omissions. The resource requirement above remains
in scope; no persistence representation or Kajenn loader is inferred by this slice.
