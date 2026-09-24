# Legacy Source lifecycle: root integration audit

> **Authority review:** [GC-170](../../docs/internal/170-binding-source-audit.md)
> supersedes normative inferences in this dated report. Code observations are
> evidence, not approved requirements. In particular, volume paths, fired metadata
> and expression differences do not establish upstream defects or required ports.

Read-only investigation, 2026-09-24. Legacy paths below are relative to
`/Users/gporcari/Sviluppo/Genropy/genropy`; inspect the local working tree, not an
assumed pristine historical release. No runtime port was made.

## Startup and mount call chain

1. `gnrjs/gnr_d11/js/genro_src.js:506`: startUp inserts Source under main.
2. `genro_src.js:166-207`: Source nodeTrigger checks building/frozen conditions,
   queues source changes and dispatches `_trigger_<evt>`.
3. `genro_src.js:437-446`: buildNode creates an after-build queue and calls
   SourceNode.build. The queue is drained with pop, not FIFO.
4. `gnrdomsource.js:964-996`: build calls stripData before visual construction;
   handles form/context, special build handlers, then dynamic attributes.
5. `genro_src.js:552-565,602-632`: stripData visits data declarations;
   moveData handles the data tag and writes its resolved destination. This is
   observable initialization behavior, not arbitrary render-time computation.
6. `gnrdomsource.js:906-924`: registerNodeDynAttr resets old registrations,
   evaluates pointer attributes and records reactive ^ attributes and formulas.
7. `gnrdomsource.js:1198-1268`: _setDynAttributes creates subscriptions owned by
   SourceNode. Stable effective paths can enter the trigger trie; movable paths
   return no stable key and remain in the floating set.
8. `genro_src.js:28-103`: GnrTriggerIndex snapshots targets before dispatch,
   then calls each SourceNode.trigger_data(attr,event). The index is a routing
   optimization; final semantic filtering remains with SourceNode.

The legacy implementation's pendingBuild and afterBuildCalls use pop. Current
Gramlot explicitly owns synchronous FIFO Source processing. Do not silently
replace this approved core contract merely to copy legacy data structures;
record observable ordering differences and recover required behavior in tests.

## Removal and freeze

`genro_src.js:167-207` checks both a deleted node and the former parent Bag's
owner when determining frozen ancestry, because a removed node can already be
detached. Freeze postpones rebuilding but not disposal of discarded content.
`genro_src.js:337-357` invokes node deletion cleanup recursively and tears down
external widgets. `gnrdomsource.js:1040-1058` releases dynamic subscriptions and
other owned resources; exact timer categories require the separate delay audit.
`gnrdomsource.js:1162-1173` drops subscriptions from the source-handler registry.

This establishes two distinct obligations: live Data routing must stop for
removed nodes, and resource teardown must not wait for a future rebuild that
will never revisit the discarded branch.

## Executed verification

Command:
`node --test /Users/gporcari/Sviluppo/Genropy/genropy/gnrjs/tests/trigger_index_frozen_discard.test.js`

Result: 8 passed, 0 failed. Log: `/private/tmp/gramlot-legacy-lifecycle-tests.log`.
The existing suite executes legacy sources inside a Node vm with Dojo/browser
stubs. It checks stable registration, clear/pop/replacement during freeze and
same-Bag/no-discard preservation. It is not a full browser or legacy app test.

## Destination implications, not an implementation decision

- Keep effective Data context and public relative-data operations on SourceNode.
- Binding routing cannot cache every path permanently as a static absolute key.
- Preserve prepare-data-before-view, Source declarations and node-owned lifecycle.
- Separate Source freeze from Data batching and delayed callback scheduling.
- Tests must include removed branches during freeze, not only normal unmount.
