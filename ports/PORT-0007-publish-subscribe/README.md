# PORT-0007-publish-subscribe

- **Status:** accepted and published in core 0.2.18.
- **Legacy evidence:** genropy/genropy@fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea.
- **Destination revision:** release tag v0.2.18.
- **Authority:** constitution 11.68–11.72, GC-225 §040; GM-030 release plan.

## Scope and contract

Preserve legacy topic/object publish syntax and local delivery before forwarding.
Public Gramlot publish/subscribe/unsubscribe delegate to private _subscriptions.
Reuse authored references, Provider pipeline, Source lifetime and CSP; retain
single button action mechanism. Page/node declarations, parent/child delivery,
actions/ask and qualification follow the bounded plan. No form/widget framework,
unrelated windows or server/user delivery. No Builder/Bag library changes.

## Evidence and differences

GC-196 and GM-025 record exact legacy behavior. Single object payload was selected
by the owner. Auto direct-Source parameters use existing $gramlotRef descriptors,
not pyref expressions. Fluent .ask is not selected. Interframe uses postMessage only, including same-origin and opaque/file frames; source-node subscribe still means Bag observation, not topics.

## Verification

Core: 601 JavaScript tests; 139 Python tests and 250 subtests. Examples: 64 JS,
16 Python and 55 subtests. scripts/verify_messaging_browser.mjs verifies HTTP/file,
opaque frames, both directions, typed payloads, Source references, native dialog,
Escape, disposal and reload in Chromium and Playwright WebKit. The equivalent
examples harness passes c18/c19 through Python/Uvicorn, Node and serverless file
exports on both engines. Strict core and examples Sphinx builds and public-document checks pass.
Other Python adapters, Bun and the installed Safari application were not exercised.

Fixes from qualification: explicit opaque file origin, symmetric ready handshake,
transport rejection of live Source/DOM, semantic references for data controllers,
and binding-owned frame disconnect. Covered by regression tests. Existing public
reference registry is reused; no application DOM/request bypass or dependency patch.

## Destination review

Implementation reviewed against the approved boundary; tests and documentation aligned.
Owner authorized closing release 0.2.18 with the completed inspector on 2026-10-15. Publication is recorded separately in GC-070. Deferred capabilities
are explicit in GC-095 §115 and GM-020; no fallback APIs were introduced.
