# Initial Data: implementation gate

> **Authority review:** [GC-170](../../docs/internal/170-binding-source-audit.md)
> supersedes normative inferences in this dated report. Code observations are
> evidence, not approved requirements. In particular, volume paths, fired metadata
> and expression differences do not establish upstream defects or required ports.

Evidence date: 2026-09-24. This document distinguishes current behavior from the
proposed B3 contract in GC-165; it does not approve a new transport representation.

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

## Declaration contract that needs resolution

The paired packaged HTML collections contain nonvisual dataSetter(destination,value),
dataFormula(destination,func) and dataController(func), marked data_element. They
also contain the native HTML `data` element. Current `root.data` must not silently
be reinterpreted as a Data initializer: that would change existing HTML vocabulary.
Legacy/PoC authoring and these generic declarations differ; recover the owning
vocabulary explicitly rather than adding aliases or using permissive dispatch.

Initial projection currently relies on RendererBase.runtimeValues. Data declarations
are transparent in generic rendering, but Gramlot's validation/mount tracking is
built around visual nodes and structural fragments. B4 needs a real nonvisual
lifecycle owner; returning null alone cannot manage execution or cleanup.

## Recommended next implementation decision

Keep one canonical Source and initial-Data delivery contract across Python, JS and
Worker. Resolve the authoring vocabulary first, then determine whether initial
Data travels entirely in declarations or requires a typed initial payload. Do not
implement both shapes to avoid choosing. Existing builder.setup Data must remain in
the recovery inventory even if Page authoring chooses a distinct supported entry.

The chosen contract must specify: root namespace; setup/declaration order; explicit
null versus absent node; overwrite policy; inserted/remote branch initialization;
remount behavior; isolation between pages; and when formula/controller startup runs.
No server synchronization or persistent page Data follows from this initial snapshot.

No runtime or wire-format modification was made by this inspection.
