# Initial Data: implementation gate

> **Complete browser-flow correction:** [Legacy Data trace](legacy-data-declaration-flow.md) and its executable probe supersede the earlier parameter-only characterization. See GC-070 §450 for verification and limits.

> **Legacy parameter correction, 2026-09-25:** [GC-070 §445](../../docs/internal/070-work-status.md#gc-070-445)
> records the original data(*args, **kwargs) dispatch, Source tag data/path/child
> value, special server/shared/remote parameters and null preservation on existing
> Data nodes. PoC dataSetter is not exact legacy parity; its representation and
> null overwrite are historical differences, now resolved by the R1 contract below.

> **Supersession — owner, 2026-09-25:** the historical `.data(path, value, ...)`
> choice in [GC-070 §440](../../docs/internal/070-work-status.md#gc-070-440) is
> replaced by `dataSetter(destination_path, value=None, **attr)` (no alias).
> [GC-210](../../docs/internal/210-binding-contract.md) and constitution 11.47
> settle Source-carried declarations, one outer main/document Bag and R1.
> Existing null preserves value and applies attributes; missing null creates;
> non-null writes. This intentionally differs from legacy skipped attributes.
> A2 installs the entire branch before DOM, not legacy per-level stripping.

> **Authority review:** [GC-170](../../docs/internal/170-binding-source-audit.md)
> supersedes normative inferences in this dated report. Code observations are
> evidence, not approved requirements. In particular, volume paths, fired metadata
> and expression differences do not establish upstream defects or required ports.

Baseline evidence date: 2026-09-24; contract updated 2026-09-25. The concrete
execution below is historical observed behavior. GC-210 replaces the B3 proposal
in GC-165; no alternate transport representation is approved.

## Current concrete execution

- Python `src/gramlot/server/host.py::_source` creates a Page and its source_builder,
  invokes the selected Page method with builder.root, and returns TYTX(builder.source).
- JavaScript `js/src/adapters/host.js::buildSource` follows the same route. WorkerHost
  delegates main/source to that Host; it has no independent initialization protocol.
- Both GramlotBuilder.create implementations call builder.setup(builder.data), then
  builder.main(builder.root). The Host route does **not** call builder.create.
- Neither Page base defines setup. Adding Page.setup is therefore an API decision,
  not simply wiring a currently forgotten Page hook.
- Browser Gramlot already owns builder.data and creates a main Bag before Source
  insertion. Host-built Data is not transmitted by the current Source-only response.

## Confirmed declaration contract, pending implementation

`dataSetter(destination_path, value=None, **attr)`,
`dataFormula(result_path, formula=None, func=None, **params)` and
`dataController(script=None, func=None, **params)` are the single Gramlot signatures.
Inline formula/script and named func are mutually exclusive. data remains native
HTML5. Destination/result paths reject ?attr; pointers may read attributes.
Source attributes carry destination_path/value; no second initial Data envelope
or new Page.setup hook. Bag payload transfers to Data without copy and loses its
Source value attribute silently. Rebuild/thaw never reinstall; removal keeps Data.

The generic packaged grammar's old destination/value and func signatures are
baseline observations, not alternate Gramlot APIs. S02 supplies binding.json;
S03 semantic NodeBinding ownership; S04 routing; S05 A2/R1/default installation.
Current runtimeValues projection alone is not reactive binding or provider lifetime.

## Remaining gates

Follow GC-210, not historical GC-165 B3: S01 verifies dependency hooks including
null-attribute transport. Upstream fixes are forbidden (owner, 2026-09-25):
variable datapath (S04) and silent PUT/marked FIRE/FIRE_AFTER (S08) come from
GramlotBuilderBag/GramlotBuilderBagNode (GC-210 §018), planned for S01.
Q2 provider cycles, Q3 CSP profiles, Q4 adapter authorization and Q5 control
conversion remain open for their phases. Initial ownership, authoring, R1 and
Source-only transport are not open choices. R3 is provisional for S12 evidence.

The concrete Host route and absence of Page.setup above remain observed baseline
facts. No runtime or wire-format change is made in S00.
