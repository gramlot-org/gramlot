# PORT-0029 · Visual Editor

- **Decision:** accepted for the bounded common-base integration; no public release.
- **Owner:** 2026-11-01, explicit Visual Editor integration request recorded in
  GC-000 visual-editor-consolidation and GC-070 visual-editor-consolidation-20261101.
- **Input:** uncommitted reusable editor in visual-editor-chat worktrees; core
  baseline 1be04a2997df8f8004c4f35a37516103285aecf5, Python 285f031,
  Node/Worker 43dba05, examples 21d46c9. Shared SourcePicker additionally reviewed
  from gramlot-editor-integration 4b9e5eac4a4d33861f91d7ea6d4fb04b8439a397.
- **Destination:** local common release branches, after uploader consolidation.
  Original files preserved: 342 recorded hashes unchanged. Invoice excluded.

## Destination review

Keep one Source composition in core and thin Python-first gallery consumers.
State belongs to Source/Data; picker subscriptions and floating surfaces are
lifecycle-bound presentation resources. Logic delegates behavior and stores no
page state. Reuse SourcePicker for native editing and command interception.
Detach moves a region's DOM presentation only. Tests retain Source/Bag/control
identity, uncommitted values, bindings, and cleanup on real removal.

Accept metadata-derived required/optional parameters, contextual parent fields,
live Source/Data trees, independent instances, clipboard and bounded Source import.
Reject wholesale copying of the older runtime: preserve newer Grid behavior and
shared DOMPurify. Validate nodeId conflicts before mutation. Worker imports now
validate the same single typed pageRoot contract as Python.

Hosts own configured file access, explicit remote-edit gates, revisions, syntax
validation and saved Page.main execution. No browser-provided arbitrary path and
no automatic AI save. The Python chat launcher keeps other gallery editing off.
The optional provider harness and topic/document lookup remain application-owned.
No credentials are copied or used for the consolidation checks.
The superseded standalone chat build helper/entry pages and the empty lesson CSS
are not promoted; the maintained optional launcher composes the actual gallery.

## Verification and boundaries

See GC-070 for exact suites and evidence. Chromium/WebKit HTTP editor interactions,
detach/dock, Python/Node/Bun document operations, and Chromium file-export import/
export are verified. Serverless reuses the window runtime; the file export makes
no HTTP requests. Core and adapter documentation builds pass.

WebKit's bottom-region layout issue and file-origin Worker File-reading limitation
remain documented, with no compatibility shim. A minimal Page-only build does not
supply external collections: qualification uses the existing directory exporter
with the environment's verified collection artifacts. No alternate exporter added.

Live provider calls, physical devices and owner visual acceptance are not claimed.
Source-to-code conversion, undo/redo, sibling reordering, inspector embedding and
Node/Bun live chat remain outside this port. Original comparison/architecture notes
are not promoted as implemented behavior. No Invoice or Python compiled-page export.

## Feedback for subsequent ports

Test the real consuming page and its packaged artifacts, not just JSDOM. Import
only the prerequisite hunks from an older branch. Keep tool pages out of tests
that assume a teaching Code tab with locally authored Logic. Separate a saved
trusted Page.main preview from filesystem authorization and from an execution sandbox.


## Residual consolidation — 2026-11-02

The owner authorized review and retirement of superseded Visual Editor copies.
The bounded catalogue/host-document/iframe/attribute-table and compact UI changes
are qualified on the common base. GC-070 visual-editor-cleanup-20261102 records
fresh tests, recovery evidence, original preservation and the #81 remainder.
Keep the current preview and Python host. Full archives of the unchanged older
core and JavaScript-host copies are verified, but retirement is pending: automatic
approval review rejected core removal because another chat may still manage it.
No bypass or other removal followed. No Invoice or public deployment.
