# PORT-0005 executable dependency probes

> **Authority review:** [GC-170](../../docs/internal/170-binding-source-audit.md)
> supersedes normative inferences in this dated report. Code observations are
> evidence, not approved requirements. In particular, volume paths, fired metadata
> and expression differences do not establish upstream defects or required ports.

Run from the Gramlot repository root after installing its JavaScript dependencies:

```sh
node ports/PORT-0005-data-binding/contract-probes.mjs
node ports/PORT-0005-data-binding/contract-probes.mjs --strict
```

The script imports the real installed Builder and Bag modules from `js/node_modules`.
It prints structured JSON. A normal run exits zero after reporting every `match`
and `gap`; `--strict` exits one while any gap remains. An unexpected exception also
exits nonzero. It is deliberately outside the normal core test suite. The script
neither changes dependency code nor substitutes a binding implementation.

The expected values are bounded compatibility targets from GC-155, GC-160 and the
legacy/PoC evidence in this port. `expression.classification` expects `null` from
the current `pointerType` method because the PoC excludes `==` from the ordinary
`^`/`=` pointer families; full expression evaluation remains a separate contract.
The probe does not establish complete legacy compatibility or a public fired-event
payload shape. It checks whether the currently emitted event exposes a `fired`
flag; a future owning-library contract may specify that flag's precise field.

On 2026-09-24, the installed modules yielded 1 match and 6 gaps: repeated FIRE
emitted two values of 42 and reset storage to null; PUT emitted an insertion event;
FIRE events exposed no `fired` flag; `==` was classified as `=`; and #FORM,
#ANCHOR and #target each discarded `?caption`. The JSON output gives exact observed
values and should be rerun after owning-library changes.

The earlier GenroPy comparison (`node --test gnrjs/tests/bag_mixin.test.js
gnrjs/tests/bagnode_legacy_audit.test.js`) reported 39 passed, 7 failed. All seven
failures have the same immediate cause: the selected `genro-bag-js` adapter invokes
`this._nodes.splice(...)` in `gnrbag_genro.js:1027`, but its selected `_nodes`
container has no `splice` method. The audit's ancestry case reaches this through
`root.setItem('branch.child', 1)`; the other six reach it through fixture `GnrBag`
construction before their selected-behavior assertions. These are adapter
construction failures, so the seven semantic comparisons remain unverified.
Repair belongs to that adapter's owning project; this port records the failure
without changing that checkout or relaxing the comparison.
