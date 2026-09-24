**Native 0.1.0 acceptance — 2026-09-24:** owner accepted the bounded result recorded
in GC-110/GC-130 and authorized GitHub archives. Acceptance covers only the current
typed Source, native HTML, Page/Host, live lifecycle and seven-profile contract.
Earlier recipes, retired compilers, speculative rendering and broader PoC behavior
remain superseded or excluded; dated records below retain their original status.

# PORT-0002-host-foundations

**Historical port record.** Contracts, review feedback, rejected paths and dated test evidence remain here. The current 0.1.0 state is [GC-070](../../docs/internal/070-work-status.md) and the sole release plan is [GC-110](../../docs/internal/110-native-html-readiness.md#gc-110-020). Past “current”, “open” and “next” statements are local to their dated checkpoint; old eight-profile checks do not verify the seven-profile release matrix. No port acceptance is implied.

- **Status:** implemented; owner acceptance pending
- **PoC evidence:** gramlot-org/gramlot-poc@10478b57ce3f22e6445eb6b72eba343520cbebac
- **Destination revision:** uncommitted development working tree
- **Constitution checked:** sections 2–7, 9–10; no conflict identified

## Evidence and contract

Owner directions 2026-09-19: host owns Page base in Python and JS; bootstrap and
main are separate; Node and Bun must share the framework responsibilities.
This is a bounded new implementation, not a bulk PoC copy. Python stays primary.

Legacy evidence at genropy/genropy@fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea:
gnrpy/gnr/web/gnrwsgisite_proxy/gnrresourceloader.py resolves paths and page classes;
gnrwebpage.py registers page IDs; gnrjs/gnr_d11/js/genro.js start/dostart and
genro_src.js getMainSource/startUp implement deferred main and Source insertion.

## Contents and verification

Shared Python adapter Page; JS Page, neutral Host, FileHost and Source authoring.
Host owns bootstrap, owner-associated expiring registry, main and Web HTTP boundary.
Node/Bun engine bridges are test fixtures only. See paired GC-065 for paths,
contracts, reproducible commands and limitations.

Five host tests pass on Node23.11.0 and Bun1.3.14, four Python tests on Python3.12.
Chromium HTTP bootstrap/main checks pass using both Node and Bun. No publication.

## Differences and open questions

No legacy page mixins, package loader, sessions, RPC dispatcher or database port.
Registry is process-local; production adapters own authentication, asset serving,
shared storage and server lifecycle. No hot reload. Bun compatibility is established
for this tested slice, not for every future dependency. Initial browser checks used the native HTML workaround. On 2026-09-19 the
dependency was upgraded to v0.7.1 and the workaround removed; Node and Bun
browser checks passed again. See PORT-0001's dependency update.

## Destination review

- **Result:** pending owner acceptance
- **Observed scope:** local host contracts and test engines verified
- **Constitution conflict:** none identified

## Feedback for later ports

Keep server entry points separate from browser imports. Reuse one Request/Response
boundary across JS engines; do not fork page construction for Bun. Carry explicit
owner identity from bootstrap through main; never treat page IDs as authentication.
