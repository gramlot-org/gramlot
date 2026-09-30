# Legacy data declaration: browser execution trace

> **Legacy characterization, not the 0.2.0 contract:** preserve data/path,
> Source-node-value payload and the null/attribute skip exactly as observed.
> [GC-210](../../docs/internal/210-binding-contract.md) records owner-approved R1,
> which fixes that attribute loss, and A2's new full-branch order. The associated
> legacy-data-installation-probe.cjs is unchanged and is not an acceptance test.


Evidence date: 2026-09-25. Read-only checkout:
`/Users/gporcari/Sviluppo/Genropy/genropy`, HEAD
`fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`.
This identifies the inspected checkout, not a clean-tree guarantee or every
historical GenroPy version. Observations do not automatically approve a port.

## Python declaration and delivery

`gnrpy/gnr/web/gnrwebstruct/base.py:793`, `data(*args, **kwargs)`, emits
`child('data', childcontent=value, path=path, __cls=className, _returnStruct=False,
**kwargs)`. The Python dispatch and dict conversion are recorded in GC-070 §445.
The child construction at line 209 also handles structure-level arguments and
records null kwargs in `_strippedKwargs`; kwargs are not all ordinary Data metadata.
A Bag is marked `__cls='bag'`, distinguishing it from a Source subtree.

`genro_src.js:getMainSource` calls RPC main in Bag mode. The inspected
`genro_rpc.js:resultHandler` decodes typed TYTX or XML envelopes, applies returned
Data changes and extracts the result. `genro.clsdict` maps `domsource` and `bag`
to distinct classes. This records legacy transport, not a proposal for Gramlot.

## Source insertion and initial order

`GenroClient.start` creates `_dataroot`, enables backrefs and inserts `_data`
beneath `main`. `dostart` loads context and calls `src.startUp(mainBagPage)`.
The Source handler already subscribes to its own `_main` root; startUp inserts
the page under main. Source insertion flows through `nodeTrigger`, `_trigger_ins`,
`buildNode`, and SourceNode.build.

Every build calls `stripData(this)` first. That processes the node and immediate
Source children; further levels are visited as build descends. It is not a global
pass that executes all page setters before all widgets. Non-data nodes are also
processed here for default/default_value/default_<attribute>, dtype conversion
of textual defaults, and attr_* metadata on their bound Data node. Ordering of
these siblings is observable; do not replace it with the PoC's global setter-first
preparation and claim exact legacy parity.

`stripDataNode` guards with `_alreadyStripped`. The data node has an empty
`_bld_data` handler and produces no visual object. Plain rebuilding the same
stripped declaration does not reseed it. A new inserted declaration is processed.
The initial global Data subscription is installed in dostart AFTER src.startUp;
`gnr.onStart` is fired later. Thus initial seeding does not go through that global
subscription as later dynamic insertions do.

## Moving the payload and attributes

`moveData` registers nodeId and calls `registerNodeDynAttr(false)`. This copies
attributes and registers ^ dependencies without evaluating their current values.
It pops tag/path from the copy and resolves path using the SourceNode's inherited,
relative or symbolic context.

For ordinary data, it reads static Source value and sets the Source node's raw
value to null. If that payload is a Bag, clearBackRef detaches its former ancestry;
setData subsequently attaches that SAME Bag into Data. It is not cloned or left
owned by both trees. Nested writes then bubble to `_dataroot`, including main in
the internal event path. Authored absolute paths still omit main.

A literal value '^record' remains that string. A data attribute caption='^record'
is initially stored as that raw string; the Source declaration also registers
caption as dynamic. No generic evaluateOnNode call materializes all these metadata
values during moveData. Do not describe ordinary data as a formula/provider.

The write guard is `!genro.getDataNode(path) || value !== null`:

- Missing node and null: create the null node with attributes.
- Existing node and null: skip the ENTIRE write, including metadata changes.
- Non-null: write even over an existing node.

The underlying genro.setData calls Bag.setItem with lazySet. Equal value AND
unchanged attributes generate no update; changed attributes alone generate an
attribute event. Ordinary replacement uses Bag's replacement attribute mode,
whereas `path?attribute` updates an attribute via Bag's attribute-update branch.
An omitted path resolves from the Source context; an empty root path with a Bag
causes Bag.setItem to insert its top-level entries, not replace the outer root.

## Special parameters and provider boundaries

- serverpath is removed from the copied Data attributes and registers the
  client/server path mapping. Python also accepts _serverpath and registers
  initial context. Later dataTrigger records eligible changes, and RPC carries
  queued serverstore changes. This is more than ordinary node metadata.
- shared_id and shared_* are removed and passed to deferred shared-object
  registration. Subsequent changes can flow through the shared-object service.
- A truthy remote selects the dataRemote branch. Direct dataRemote declares a
  provider, supports an already resolved `_resolved` payload, and calls
  setDataNodeValue. The provider path includes _delay, _if, current arguments,
  cacheTime (default -1), isGetter, sync and SourceNode context. It installs a
  remote resolver; its request parameters are evaluated at request time through
  dynamicParameters. RPC/remote services were inspected, not integration-tested.
- _init, _timing, _onStart, _onBuilt and topic subscriptions are processed in
  moveData's OTHER provider branch. They must not be presented as ordinary
  data-initializer controls simply because kwargs accepts their names.

A bounded executable probe exposes a handoff anomaly: data(remote='fetch_example')
reaches remoteResolver with an undefined method, whereas a dataRemote declaration
with method='fetch_example' passes it correctly. moveData changes the COPY of
attributes, but provider evaluation reads node.attr. No real request was made;
do not assert the remote spelling works end to end or add a Gramlot workaround.

## Events, reactions and cleanup

Data Bag events bubble through backrefs to `_dataroot`. GenroClient.dataTrigger
handles server/shared mappings and invokes publishDataTrigger. That publishes to
the Source handler's trigger index and the legacy topic. In this checkout, stable
paths use a segment index and moving contexts remain floating subscriptions.
SourceNode.getTriggerReason distinguishes exact, ancestor and descendant changes,
filters autocreate and distinguishes attribute-only updates from value changes.
SourceNode.trigger_data either executes a provider or updates the bound object;
the originating SourceNode is skipped for ordinary attribute updates.

Dynamic dependencies are installed by _setDynAttributes and removed by
_resetDynAttributes and Source handler cleanup on removal/replacement. Source
removal cleans subscriptions; it does not imply deleting the seeded Data value.
The current legacy Source queue is LIFO and has freeze/rebuild cleanup logic;
Gramlot's approved FIFO/freeze contract must not be replaced by that observation.

## Executable evidence and limits

Run `GNR_LEGACY_ROOT=/path/to/genropy node ports/PORT-0005-data-binding/legacy-data-installation-probe.cjs`.
The probe loads the original JS classes using the legacy test harness and executes
22 assertions: existing/missing null and metadata, payload identity and backrefs,
nested event path, strip-once, literal values, attribute destinations, raw dynamic
metadata registration, serverpath removal/mapping, root Bag merge, actual Data
subscription-to-SourceNode dispatch, origin suppression and subscription cleanup.
It also reports the remote alias/direct-provider method observations above.

All 22 assertions passed. DOM updates are intercepted at the final update hook;
Dojo topic publication and RPC are stubbed. This is not a browser, server, network,
full lifecycle or full startup-order test. The remaining flow above is source
inspection, with no upstream modifications.

## Corrections to the earlier PoC comparison

The PoC uses dataSetter plus destination/value attributes, unconditional null
writes, a preparation pass for fresh setters, and retains the Source value in
attributes. Legacy uses data plus path and node payload, consumes that payload,
preserves existing values AND metadata when payload is null, and processes data
while traversing the build. These are concrete differences requiring review;
working PoC tests do not establish exact legacy equivalence.
