# PORT-0025-base-chat

- **Status:** implemented; verification recorded below; owner acceptance pending
- **Evidence:** example-owned conversation-poc, GE-040 §§025–045 and explicit
  owner request to implement the base echo chat plus interactive Source example.
- **Destination:** conversation-poc core worktree; no release/publication.
- **Constitution points checked:** §§3, 4, 6, 7, 13 and 14.

## Bounded contract

GC-390 defines the confirmed nested-frame composition, synchronous echo hook,
string/SourceBag replies, per-message Data isolation and Page-owned controllers.
Core owns composition and reusable rendering/protocol behavior. Applications own
provider logic and the demo; the existing adapter owns WebSocket transport.
There are no changes to Builder or Bag dependencies, no alternate HTML response
format and no manual application DOM construction.

## Destination review

Implementation uses ordinary Source insertion, dataBinder, PageStore reactive controllers,
and the existing renderer lifecycle. Core tests use core fixtures only. Typed
Source is cloned before mounting so its Data-owned original remains untouched.
Earlier messages preserve DOM and local Data on append. Removal/reset releases
Source controls and local Data. The response ID is correlated with the pending request Data. Voice capture, streaming and persistence are omitted.
No constitutional conflict identified. Owner acceptance is pending; this record
is not an agent-authored claim of owner acceptance.

## Verification

Focused Python/browser tests and the real local WebSocket example verify echo,
Source replies, button/controller execution, per-message isolation and cleanup.
GC-390 §025 records live evidence. Final command totals are in the work-status
receipt. The application and gallery remain in gramlot-examples.

## Reusable feedback

Use Builder setChild when adding a typed node: a generic Bag setItem does not
supply its Source nodeTag. Native text in a chat must be authored as a literal,
so pointer/expression-like user strings are not interpreted by Source bindings.
Do not place host attributes in a custom-element constructor; set them when
connected. PageStore named controller methods cannot start with an underscore.

Final verification receipt: 69 JavaScript tests passed across chat, PageStore
connection, live Source validation, controller lifecycle and Source extension
contracts; 67 Python tests plus 36 subtests passed across chat, PageStore,
prepared collections and Builder. The first mixed-language JS run used system
Python without Gramlot; rerunning with the configured environment passed all
69 tests. Runtime/prepared collection build passed. The earlier provider-backed
example's 21 Python tests also passed against this core. Live final verification
confirmed reset removes the old interactive reply and a new reply starts at
counter zero with an empty note. The new example remains available at port 8773.
No release, deployment or owner acceptance is claimed.


2026-10-29 binder/feedback correction: the owner's “ok procedi” confirms Data
requests and state updates over sync, superseding the initial publication design.
GC-390 §030 records the connected adapter correction and completed verification.
No chat-specific publication or progress wire message remains in the base chat.


Local common-base integration — 2026-10-29. Owner: “Sì, verifica anche
conversation-poc e integra la chat nella base comune, preservando il lavoro
originale e controllando che funzioni nella gallery. Invoice resta fuori.”
The conversation-poc changes were reviewed and merged into the existing local
release base alongside Grid, forms, selectors and PageStore. The original core,
examples and adapter checkouts remain untouched; their imported files were
snapshotted and hash-checked. Invoice is excluded.

The opt-in chat catalogue opens /pages/92-chat/01-echo directly in the gallery
iframe. It uses the shared ChatPane/ChatPageStore and existing binder/WebSocket
channel, without AI credentials. The provider-backed trial remains separate;
this integration makes no paid provider calls and does not certify its historical
provider results anew. Remote Edit remains disabled. Runtime/prepared collection
and gallery browser builds pass. Full suites: 1,419 core JavaScript tests,
335 gallery JavaScript tests and 312 Python adapter tests. The focused core
Python chat/PageStore checks pass (20 tests).

Live Kajenn gallery checks: text echo; feedback before processing completes;
interactive Source replies with independent note/counter Data; appending replies
preserves earlier state; reset clears conversation while retaining the unsent
draft; no browser console errors. Current preview: http://127.0.0.1:61505/.
Verification receipts: /private/tmp/gramlot-chat-integration-20261029/.
Implemented and locally verified; publication and remaining public release gates
are separate. No deployment, package release or TestFlight upload was performed.
