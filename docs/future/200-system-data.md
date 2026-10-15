# 200 · System Data and actions

Document ID: **GC-200**. Status: **deferred discussion; no API approved here**.

<a id="gc-200-005"></a>
## 005 · Retained use case and next decisions

Block ID: **GC-200-005**.

**Goal:** let pages and framework capabilities communicate common state and actions
through Data, following the legacy system subtree pattern. The owner discussed a
reserved `_gramlot` path, server-supplied values before rendering and optional
system mixins/controllers. Window title is one example; download requests,
messages and alerts are other legacy use cases.

Owner explicitly deferred this work: "ora non dobbiamo fare tutto subito ma va
pensato e tenuto da parte. ora eravamo al manifest e al componente di pagina
riusabile". The proposed `init_gramlot_data` name was a sketch, not an implemented
hook or confirmed signature. Existing manifest/index work does not depend on this
future subtree ([checkpoint](../internal/070-work-status.md#gc-070-785)).

For repeated actions, retain the owner's explanation: "facevo una fire e quindi
mettevo il valore per far scattare il trigger e poi un null per toglierlo ma senza
trigger" (spelling normalized). Do not replace that requirement with change-only
activation: identical requests may need to fire more than once.

**Before implementation:** identify the actual legacy paths/handlers; decide the
reserved subtree's ownership, initialization/override order, optional mixins,
client/server responsibilities, cleanup, and exact fire/reset behavior. Define
which values are persistent state and which represent requests. Names and proxies
must follow GC-225. No entire legacy system subtree is automatically approved.

**Parallelism:** legacy inventory and contract design can proceed alongside the
website/component investigations. Integrating initialization and runtime listeners
must be coordinated with other changes in those same areas.

**Proposed completion evidence:** a bounded first capability, repeated identical
action tests where applicable, no trigger on silent reset, instance isolation and
cleanup, Python/JS contract coverage and paired documentation. These are planning
criteria, not tests already delivered.
