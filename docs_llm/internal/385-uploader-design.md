# 385 · Shared uploader — implementation readiness

Document ID: **GC-385**. Date: **2026-10-30**.
Status: integrated into the common base with local verification; see §080 for the unresolved WebKit file-origin limitation. This document distinguishes implemented paths from proposed later capabilities.

<a id="gc-385-005"></a>

## 005 · Confirmed scope and evidence

The owner asks to delegate uploader work for the visual Source editor. The original
thread, **Inventaria gli uploader legacy di Genropy**
(`01a1876d-e384-7c92-8abb-8599c230162d`, 2026-10-29), records these decisions:

- Design for server and serverless; implement the server route first.
- First integration: Python ASGI/Uvicorn in gramlot-py-server.
- A dedicated binary transfer channel coordinated with Gramlot; do not encode the
  file into the existing TYTX RPC body.
- The server resolves the destination through an authorized application operation.
- Prepare using metadata and temporary authorization, then transfer the binary
  with a fresh authorization check.
- Retry after a confirmed unsaved outcome. Reconcile an unknown outcome before
  retrying. Cancellation interrupts transfer and asks for temporary cleanup; a
  committed result must still be reported accurately.
- Work in separate worktrees. Shared contracts precede implementation steps.

On 2026-10-30 the owner confirms “Sì, entrambe le modalità”: the first UI
includes immediate start after choice/drop and explicit start through Upload,
sharing the same queue and transfer engine. This closes the final unanswered
UI-scope question from the original thread.
The owner rejected the visual editor's separate readText proposal and requested
an uploader. The client API and server boundary were subsequently confirmed;
wire and lifecycle details are specified during implementation.

<a id="gc-385-010"></a>

## 010 · Baseline and real gaps

Core worktree: `work/gramlot-uploader`, revision `afd5a78d`.
Python integration worktree: `work/gramlot-uploader-py-server`, revision `285f031`.
Both match their local develop reference at this inspection. Newer uncommitted
work in other worktrees is not incorporated. No dependency setup was performed.
The editor currently runs a newer core; integration must compare required files
and qualifications before bringing this increment into that runtime.

| Existing code | Meaning for the uploader |
| --- | --- |
| `js/src/renderer/drag-drop.js` | Admits internal renderer gestures only; it is not an external file drop implementation. |
| `js/src/inout.js` | restore reads local TYTX into Data. It is not an uploader or a Source loading API. |
| `js/src/components/registry.js` | Component metadata is JS-owned and generates the Python declaration contract. |
| `js/src/components/tree.js` | Existing sourceContext and callLogic integration can host named callbacks without application DOM wiring. |
| `js/src/http-transport.js` | Ordinary RPC uses fetch; it does not expose streamed upload progress or the new binary channel. |
| `src/gramlot/server/gramlot_server.py` | Owns page identity, expiry and declared-method authorization; page objects are recreated for each call. Transfer state cannot live only on a Page instance. |
| adapter `src/gramlot_py_server/uvicorn.py` | Routes rpc/close as JSON and collects the full body. Binary reception needs a separate bounded streaming branch. |

GC-230 and constitution 11.58 currently define all messages as envelopes. The
approved binary direction must become an explicit bounded addition: control and
outcome messages stay typed; binary bytes travel separately. No new route or
capability spelling has been approved yet. The ASGI-first decision narrows the
adapter rollout; other adapters must not claim upload support before their own
implementation and conformance checks.

<a id="gc-385-015"></a>

## 015 · Proposed first public surface

The owner confirmed the client declaration on 2026-10-30 in Codex chat
**Inventaria gli uploader legacy di Genropy**, answering “ok” to the concrete
declaration below. The server and transport contracts remain proposals. Component vocabulary follows existing camelCase authoring tags,
PascalCase classes and gramlot-prefixed kebab-case custom-element names.

Confirmed authoring tag: `uploader`. The descriptor and DOM spellings `Uploader` /
`gramlot-uploader` follow the existing component naming convention.
It owns acquisition and one queue. A future grid/dialog composes the same queue;
it must not copy transfer logic. A separate uploads collection keeps the feature
optional. The initial serverless representation reported that transfer was unavailable; the Worker transport now implements it;
it does not pretend to persist data or introduce a local-file alternative.

Proposed parameters:

| Name | Responsibility |
| --- | --- |
| operation | Declared application upload operation; never a client-chosen filesystem path. |
| storepath | Data Bag branch containing queue metadata, progress and outcomes. File/Blob objects remain component-owned browser resources. |
| accept | Picker/drop hint, e.g. `.grmlt`; server policy independently validates the content. |
| multiple | Whether the acquisition UI accepts one file or several. |
| autoUpload | Proposed spelling for the confirmed two modes: start after acceptance, or retain queued files until explicit start. |
| disabled | Prevent further acquisition and starts; does not silently discard active transfers. |
| onComplete | Named Logic callback after a confirmed per-file completed outcome, using Source-context invocation. |

Confirmed client declaration:

```python
pane.uploader(
    operation="import_source",
    storepath=".uploads",
    accept=".grmlt",
    multiple=False,
    autoUpload=True,
    onComplete="sourceUploaded",
)
```

`autoUpload=False` keeps accepted files queued until the user presses Upload.
`operation` names the declared server application operation; it is not an URL or
storage path. `onComplete` names page Logic; the proposed callback arguments are
`item` (the queue BagNode) and `result` (the operation's typed result). It does not
replace the page Source automatically. This declaration introduces no mode alias,
local-reading alternative or second queue. The server declaration in §040 has also been confirmed.

No mandatory generic max-size default is proposed: the operation supplies the
server's actual per-file/count policy during preparation. Client checks provide
feedback but are not the authorization boundary. Exact policy fields, empty-file
handling, metadata fields and event payloads still require confirmation.

The queue exposes stable item identity, original filename, byte length, declared
media type, status, transferred bytes, result and structured error. It does not
serialize native File objects, access tokens or physical temporary paths. Proposed
states are queued, preparing, uploading, processing, completed, rejected, failed,
cancelling, cancelled and uncertain. Progress at 100% transitions to processing,
not completed. Command names and legal state transitions remain to be fixed with
the API, including removal/disposal and retry concurrency.

<a id="gc-385-020"></a>

## 020 · Proposed server/transport boundary

The core owns a logical upload operation registry and transfer session lifecycle,
reusing page ownership, expiry and declared authorization checks. The application
owns policy and the final destination/result. The adapter receives binary chunks
and applies transport-level limits. The browser component owns selected files and
observable queue state. No global storage system is added to Gramlot.

The first HTTP realization is proposed as one independently correlated transfer
per file. A preparation result identifies the authorized transfer and gives the
browser an expiring transfer authorization. The binary request transmits bytes;
its declared metadata was already supplied during preparation. The server checks
page ownership, authorization, declared limits and actual received bytes before
processing. The exact HTTP verbs, URLs, token lifetime, replay policy and registry
retention are open; they are not inferred from the prototype.

Preparation, status, cancellation and application results are logical operations.
They must be specified once for Python and JS servers, even though the first
adapter rollout is ASGI. Their placement in GC-230 control envelopes is a contract
decision. A generic application endpoint must not be made into an undeclared
backdoor for binary transfer. Stored transfer state belongs to a server-owned
registry, not ephemeral Page objects.

A receiving sink is supplied by the host/application service: bounded incremental
writes, finalize with a typed result, abort cleanup. Whether the first concrete
sink stages to a temporary file or directly to application storage remains open.
No client-provided destination path becomes authority. Closing/expiring a page
must revoke unused grants and apply the confirmed cancellation/cleanup policy.
A lost response after finalize must be recoverable by status reconciliation.

<a id="gc-385-025"></a>

## 025 · The visual editor consumer

The editor downloads `.grmlt` as TYTX of a GramlotBuilderBag containing exactly
one pageRoot, without its own controls or Data. For upload, the application
operation validates the file and returns the Source wire as its typed result;
loading the Source is the editor's responsibility, not the uploader's.

The editor consumer must prepare the wire with `prepareSource(wire, builder)` and
validateCandidate before replacing the design subtree. A malformed/unsupported
file must leave the current Source intact. Returning a Source value inside Data
does not activate it. The server must not execute an uploaded Python/JavaScript
module to import a `.grmlt` file. Source callbacks still refer to the destination
page's installed Logic and collections; uploaded Source is not a package format.

This is the proposed first application integration. Server preservation of the
uploaded file, user-visible filenames, import limits and the exact result shape
remain decisions. This scope does not authorize a file-picker workaround inside
the visual editor.

<a id="gc-385-030"></a>

## 030 · Verification map before implementation

| Layer | Contract checks |
| --- | --- |
| Acquisition | Click, keyboard, drop from OS, same file selected twice, picker cancellation, accept/count/size feedback, stable IDs independent of names. |
| Queue and lifecycle | File/Blob never enters Data; legal transitions; serializable snapshots; independent instances; Source disposal releases file references and invalidates late callbacks. |
| Typed callbacks | Named Logic receives the agreed outcome once; rejected/uncertain states do not masquerade as completion. |
| Server control | Wrong owner, expired page, undeclared/unauthorized operation, exhausted limits, expired/reused/revoked grant, status/cancel ownership. |
| Binary reception | Chunked body, omitted/misleading length, actual limit overrun, disconnect, empty file according to policy, partial cleanup, transport prefix/CSP. |
| Outcome recovery | Lost response before/after commit, status reconciliation, no blind retry, cancellation race with commit, page expiry during upload. |
| Editor | Export/import round-trip of tags/attributes/typed values; one pageRoot; no editor state; invalid Source leaves the current design unchanged. |
| Regression | Existing RPC conformance, internal drag/drop, Data bindings, collection export and Python/JS authoring parity. |

Run core tests only on core fixtures. ASGI integration tests own HTTP streaming
and request identity. A real browser/ASGI trial must verify progress, cancellation
and one `.grmlt` round-trip; mocks alone do not establish the path works. The first ASGI path and a Source round-trip have been exercised; see GC-070 for exact verification and outstanding work.

<a id="gc-385-035"></a>

## 035 · Next decision and delivery gate

Both start modes and the client declaration in §015 are confirmed by the owner.
The server operation boundary and bounded extension to GC-230 are also confirmed. Internal
implementation details derivable from those accepted contracts do not need
separate owner questions. Then implement the first approved slice. The sequence must not turn each
internal function into an owner decision, but public names, transport boundaries
and unsupported alternatives cannot be silently chosen.


<a id="gc-385-040"></a>

## 040 · Minimal server declaration proposal

The owner confirmed this server boundary on 2026-10-31 ("ok" in Codex chat Inventaria gli uploader legacy di Genropy). It refines §020 and deliberately
keeps HTTP route spelling out of application declarations. Existing `@source`
and `@endpoint` mark explicitly exposed instance methods and carry an optional
`auth` rule. Upload preparation should follow that model with `@upload(auth=...)`;
its JS marker would be `Exposed.registerUpload` by GC-225. An upload method is
not implicitly callable as a Data endpoint or Source method. Existing declared
method paths, inheritance/shadowing and authorization resolution still apply.

Proposed application declaration:

```python
from gramlot import Page, upload

class EditorPage(Page):
    @upload(auth="edit_source")
    def import_source(self, metadata):
        # This application service checks quotas/content policy and resolves the
        # authorized destination. It returns an UploadTarget, never a client path.
        return self.source_imports.prepare(metadata, page_id=self.page_id)
```

`source_imports` in this example is an application-owned service, not a new
Gramlot proxy or built-in. The operation runs at preparation, after page ownership
and declared authorization checks. It receives a fixed metadata record containing
`name`, `size`, `mediaType` and `fields`; these are untrusted claims. Application configuration
and destination identity are resolved on the server. No generic client options
or arbitrary filesystem destination are introduced in the first API.

The proposal adds only a declaration marker and one server-side abstract contract,
`UploadTarget`, returned by the preparation method. It combines the per-transfer
policy and sink rather than adding separate Policy, Grant and Sink application
classes. The transfer registry and temporary authorization remain runtime-owned.

| Boundary | Proposed contract |
| --- | --- |
| Configuration | `UploadTarget.max_bytes` is a required nonnegative per-file byte ceiling. The service can reject preparation using the actual declared size, file type, owner quota or application context. Declared size is checked again against the received total. Zero-byte files are permitted only if application policy accepts them. |
| Authorization | The existing `auth` rule is evaluated at preparation and again before admitting the binary stream. Status and cancellation require the same page/owner and operation authorization; an expired or closed page never permits a new transfer. No stored client identity substitutes for current identity. |
| Sink | The target implements the required `write(chunk)`, `finish()`, `abort()` and `status()` operations. The server invokes them; the browser cannot call them directly. These methods may be synchronous or awaitable, matching existing server invocation conventions. There is no missing-method fallback. |
| Result | `finish`, `abort` and `status` return one authoritative outcome: `{"state": "completed", "result": value}`, `{"state": "unsaved"}`, `{"state": "pending"}` or `{"state": "uncertain"}`. `value` must be TYTX-serializable. Completed results are retained for reconciliation; the editor receives its Source wire through this result. |

`write` receives bounded byte chunks and returns no application result. `finish`
means the complete declared body was received and the application may commit or
process it. The target owns any temporary file/object and its cleanup; the core
adds no storage directory or persistence default. For the .grmlt service, the
application can stage the file, validate/decode it, release staging resources and
return Source wire without preserving an uploaded artifact.

`abort` must clean up an uncommitted transfer. It cannot undo or conceal a completed
commit; it returns the completed result in that case. `status` is needed when the
outcome of a sink operation is uncertain, not only when an HTTP response was lost.
A target may report uncertain until its application can determine the outcome.
No runtime retry may resubmit that file as a new operation while it is uncertain.
The explicit unsaved state permits a fresh preparation; it does not silently
retry business logic. The registry serializes per-transfer operations, never runs
abort concurrently with finish, and stores outcomes before replying. A failed or
interrupted finish does not establish that the file was unsaved.

The four sink methods are the minimum proposed contract supporting the already
confirmed retry/cancellation semantics for an application-selected destination.
They are not a promise of durable crash recovery. Multi-process and restart
recovery require a durable owner for transfer state; the first server must state
its supported deployment lifecycle before implementation is accepted. Reusing the
existing process-local page registry does not justify advertising cross-worker or
restart recovery.

### Public decisions versus implementation details

The public review can cover this declaration as one coherent server boundary:
`@upload`, the metadata fields, `UploadTarget` policy/methods/outcomes, the typed
result, and the explicit binary/control addition to GC-230. The owner need not
choose private class decomposition, token randomness implementation, buffer size,
lock mechanism or local test utilities. Those derive from the accepted limits and
lifecycle and must be tested. Transport routes/capability discovery, policy for
expiry/retention, supported process lifecycle and the exact control envelope are
observable cross-language contracts: record them together in the transport
specification rather than silently treating them as private implementation.

The client declaration and the server boundary are confirmed. This approval covers the bounded first ASGI/Uvicorn implementation; unconfirmed wire and lifecycle details remain to be specified and reviewed.

### Targeted contract tests

- A method marked only as upload is accepted by upload preparation and rejected
  by ordinary Source/Data invocation. Unmarked methods and invalid method paths
  are rejected. Inherited declarations, shadowing and conflicting markers follow
  the existing explicit-exposure rules; JS registration has the same contract.
- A successful preparation invokes the application exactly once with the fixed
  metadata and current page identity, then registers the returned target. Refused
  authorization invokes neither application preparation nor sink methods.
- Authorization is rechecked before binary admission. Wrong owner, expired page,
  revoked grant and changed authorization leave the target uncommitted; cleanup
  is scheduled through the authoritative lifecycle.
- Metadata cannot select an absolute path, another operation or arbitrary server
  arguments. Policy is server-owned; actual body overflow and declared/received
  size mismatch prevent finish and clean partial data.
- Target chunks remain bounded. The receiver does not assemble the complete
  binary body in memory or encode it into TYTX. Empty files follow the operation
  policy. Transport disconnect and write failure preserve cleanup evidence.
- finish success reaches the callback once even when the binary response is lost
  and status is polled repeatedly. Result serialization is checked before exposing
  completed state; serialization failure after commit must not enable a retry.
- abort before finish confirms unsaved; abort after a completed finish returns the
  completed result. A finish/abort race is serialized. An uncertain sink outcome
  blocks retry until status reports completed or confirmed unsaved.
- No File, credentials, sink object or temporary path enters the queue Data Bag.
  The .grmlt application result can round-trip Source wire; uploader completion
  does not execute or mount the returned Source.

These are proposed acceptance tests, not implemented or executed tests.


<a id="gc-385-045"></a>

## 045 · First wire and lifecycle contract — implementation in progress

The owner asked to proceed with a complete first version on 2026-10-31, followed by review and consolidation. The precise implemented state and limitations are recorded in GC-230 and GC-070. HTTP uses one binary request per file.

1. The existing TYTX RPC envelope gains `contentType: "upload"`; `name` is one
   of `prepare`, `status`, `cancel`. The envelope still supplies `id` and
   `pageId`. Prepare parameters contain `operation` and `metadata` (`name`,
   `size`, `mediaType`, `fields`); the server resolves the marked operation on the page,
   checks owner and auth, and returns a transfer ID and an unguessable temporary
   authorization. Neither token nor binary enters Data.
2. Bootstrap advertises an `upload` capability and a mount-prefixed binary URL
   only when the adapter implements it. The browser posts the file bytes as
   `application/octet-stream` to that URL, with the transfer ID, page ID and
   one-use authorization in request headers. XHR provides upload progress and
   abort; binary data is never encoded into TYTX. The server verifies current
   page ownership, operation authorization and token before consuming the body,
   and enforces the declared length and target limit on received chunks.
3. Status and cancel take the transfer ID, recheck owner/page/auth and return
   the target outcome in the existing TYTX response envelope. An unconfirmed
   commit remains uncertain until authoritative status reports otherwise; it
   is never blindly resent. Cancel serializes with finalization and returns the
   actual result if finalization already completed.
4. Initial deployment is explicitly single-process and in-memory, like the
   page registry. No survival of a server restart or cross-worker recovery is
   claimed. The authorization expires after five minutes; completed and
   unresolved outcome records remain for 30 minutes while the page is valid.
   Admission is bounded to 1,000 retained transfers per server by default;
   exhausted capacity fails explicitly, without evicting uncertain outcomes.
   Once retention expires or a process restarts, an unresolved outcome cannot
   be safely retried automatically and the UI must say so. Page expiry or
   closure blocks further transfers and status calls: recovery after that point
   is application-specific. Expiry and shutdown must abort and clean uncommitted
   targets, without concealing a committed result.
5. Each transfer is correlated independently. Immediate and explicit start use
   the same queue. The target's `write`, `finish`, `abort`, `status` are
   serialized per transfer; all application output is validated before being
   exposed. A failure during finalization or outcome serialization is uncertain
   until reconciled. No arbitrary browser destination or storage path is accepted.

The timeout, limits, header names, method and URL must be documented and tested
as public adapter contracts. Their exact spellings are to be recorded alongside
GC-230 and GC-225 if this proposal is accepted. Cross-origin behavior, large
files, chunked resume, durable sessions, multiple workers and standalone transfer
are outside this first realization and must not be claimed.


<a id="gc-385-050"></a>

## 050 · Per-file metadata — approved 2026-11-01

The previously approved preparation record contained exactly `name`, `size` and
`mediaType`. To carry arbitrary per-file metadata without inventing a second
queue, use a `metadata` Data Bag under each queue row. Application forms
edit this Bag before the upload starts; preparation snapshots it as
a `fields` mapping in the same metadata record. The same shape is used
for every upload, including an empty mapping. The application operation receives
the mapping and is responsible for validating its names and values. File
objects, temporary grants and server-selected destinations never enter it.

Owner confirmed the extension on 2026-11-01: “Sì, confermo. Procedi con i metadati per file e poi con le altre funzionalità mancanti.” An editable metadata grid remains
separate: the current grid lacks a generic cell-editing contract, so a specific
metadata editor must not silently invent one or bypass Gramlot bindings.


<a id="gc-385-055"></a>

## 055 · Worker transfer — approved 2026-11-01

Owner confirmed on 2026-11-01 that the application upload operation runs in the Worker. Confirmed binary transport: the browser passes the selected `File` through Worker structured cloning after the shared prepare operation; the Worker reads it in bounded chunks and writes them to the application target. The file and authorization remain outside Data. Progress and the final outcome return to the shared queue; cancellation and status retain the existing authoritative-outcome semantics. Each admitted transfer is bound to its page and one-use authorization, with the application authorization checked at admission. No automatic retry follows an uncertain outcome. Closing a page requests cleanup; Worker termination loses in-memory transfer status and cannot prove that an external application operation was unsaved. This transport does not claim persistence, successful cancellation, or bounded memory of application-provided targets. Exact message names and chunk size are implementation details; owner confirmed the transport on 2026-11-01 (“ok”). The Worker implementation and browser verification are recorded in GC-070.


<a id="gc-385-060"></a>

## 060 · Application-defined per-file form

Owner confirmed on 2026-11-01 (“Sì, va bene. Procedi così e poi continua con le altre funzionalità mancanti.”) a list and a form for the selected file using application-declared fields and ordinary bindings. `selectedPath` follows the existing Tree selection convention: the selected row label relative to the uploader store, or null. Applications use the existing reactive datapath to bind controls to the row's `metadata`; manual start lets the user edit before the preparation snapshot. The application chooses and validates fields and may disable editing outside `queued`. This does not add cell editing to Grid or a second metadata store.


<a id="gc-385-065"></a>

## 065 · Attachment manager first version — historical proposal

Legacy evidence: Genropy's attachment manager combines a parent-record reference, an attachment table, application storage, metadata, a list/grid and preview. The Gramlot core has no attachment table or storage service; its database boundary delegates persistence to providers.

Proposed first version: an application-owned attachment service authorizes every operation for a specific **already saved** parent record. A Gramlot view uses the shared uploader and its application-defined metadata form, presents the service's attachment list and permits authorized preview and removal. The browser sends an opaque record identifier, never a filesystem destination; the application resolves the record, attachment identity and storage. A new unsaved parent keeps attachment upload unavailable until its first save. Completed uploads return an opaque attachment identity and refreshed metadata. The application must decide and test consistency and cleanup across storage and its own transaction boundary; the framework does not claim atomic file/database transactions. Serverless storage remains application-provided. Temporary attachments to unsaved records are a later design, not part of this first version.

Owner confirmed the unsaved-record behavior on 2026-11-01 (“Sì, carichiamoli dopo il salvataggio”): keep selected files in the browser queue and upload after the parent is saved. The shared uploader supports this with `manualUpload=False` and a bound `autoUpload` that becomes true after save. An application-owned gallery demonstration implements record save, attachment list, text/raster preview and deletion with per-page in-memory storage for both ASGI and Worker; it is temporary and not a production persistence service. The reusable component and its application-operation contract were subsequently confirmed and implemented (§080); the example remains temporary and does not supply a durable storage or database model.


<a id="gc-385-070"></a>

## 070 · Attachment record authorization — identity confirmed

The owner confirmed that a new record's files stay in the browser queue until the record is saved. A bound `autoUpload` can transition from false to true after the application sets the saved-record metadata, starting queued files. That metadata is untrusted and does not prove access to a record.

The server checks a declared operation rule using the host's per-call identity. Owner confirmed on 2026-11-01 (“Sì, identità fornita dall’host (consigliato)”) that the fresh application Page receives the same trusted identity and performs record-specific checks. The Python Page exposes `request_identity`; JavaScript exposes `requestIdentity`. Uvicorn accepts an application-configured `identity_provider`; without one, identity is absent. Page ownership separates browser sessions and is not an authenticated application identity.

Confirmed boundary: the host supplies the authenticated identity to the fresh Page for each operation; the application service uses that trusted value to authorize the particular saved record before listing, uploading, reading or deleting attachments. An absent identity never becomes an authenticated user. Gramlot does not define users, login, permissions, database schema or storage. The Page context is per call and is not kept on a shared server object or accepted from client metadata. Python and JavaScript execution contracts and adapter capabilities must be specified consistently before implementation. A framework-mandated record check at binary admission and completion was rejected by the owner on 2026-11-01; applications may perform additional checks when their requirements call for them. The per-request Page identity and Uvicorn provider are implemented and tested. No mandatory target recheck is added.


<a id="gc-385-075"></a>

## 075 · Target authorization recheck — rejected 2026-11-01

For record-specific upload permission, the Page operation can validate its
trusted per-call identity when preparing a target; the existing operation-level
`auth` rule is checked again during binary admission. Neither check currently
revalidates the application's selected record during a later binary request.

Proposal: every application UploadTarget implements a required authorization
operation receiving the host identity of the current request. The framework
invokes it before accepting binary bytes and again immediately before finish;
the target consults current application permissions for its record. The
application may explicitly permit an anonymous public operation. A refused or
failed check never grants upload or implies a successful save; cleanup and
uncertain outcomes retain the existing rules. A storage/database transaction
may still need its own atomic permission check at commit. Python and JavaScript
target contracts would change together, and existing application targets would
need an explicit implementation. The owner rejected this proposal on 2026-11-01: “ma nondai... questa è paranoia”. No mandatory hook is implemented. Applications may add checks themselves; the operation-level auth rule still runs at admission.


<a id="gc-385-080"></a>

## 080 · Reusable attachments — confirmed 2026-11-01

Owner confirmed “Sì, operazioni dell’applicazione”: the reusable manager composes the shared upload queue with application-provided list, read and remove endpoints. The application upload operation receives the shared context and per-file fields separately. The application owns the record model, persistence, authorization and storage transaction; the component supplies no database or fixed storage directory.

Files selected before save remain in the browser queue until `ready` becomes true. The current context is snapshotted on each preparation. The component clears its display on context changes and ignores stale responses. Its application endpoint contract is recorded in the implementation update below. The gallery example remains in memory and does not demonstrate durable persistence.


<a id="gc-385-085"></a>

## 085 · Legacy editable-image audit — evidence, 2026-11-01

Read-only inspection of Genropy `gnrjs/gnr_d11/js/genro_widgets.js`
(`uploadable`, lines 5778–6276; `img`, 6277) and the examples in
`projects/gnrcore/packages/test/webpages/html/img.py` and
`components/drop_uploader.py`. This is historical implementation evidence,
not approval of a Gramlot API or proof that every legacy path works.

- `img` inherits `uploadable`; selection/drop can update its bound `src` with a
  data URL (`upload_folder='*'` or editable with no folder) or upload to the
  configured server folder/filename and use the returned URL. A plain-text URL
  drop also sets `src`. It enforces an optional file-size limit and refuses
  changes when its form reports locked. The configured extensions default to
  png/jpg/jpeg/gif/svg on the legacy drop path.
- With an existing image, an options dialog offers upload and clearing;
  data-URL mode additionally offers Croppie editing, and `takePicture` adds a
  camera action. Clearing `src` and `src_back` is not server-file deletion.
  Server deletion in the example is a separate application RPC.
- The fixed `crop_*` frame and the old drag/Shift-drag/Alt-drag path keep
  `v_x`, `v_y`, `v_z`, `v_r`, `v_w`, `v_h` in the URL and render with CSS; they
  do not by themselves rewrite the stored image. Croppie editing of a data URL
  produces new pixel data on confirmation; `src_back` can retain the original.
  These are different representations.
- The camera flow uses `getUserMedia`, canvas and Croppie, with `capture`
  selecting front/rear when supported. It is offered here in data-URL mode.
  The inspected error handler references an undefined `e`, and this path does
  not visibly stop media tracks; runtime behavior and cleanup need qualification.
- The source under review declares `embed` as `baseHtml`, not `uploadable`,
  despite a legacy example describing similar attributes. Do not assume parity
  without a separate execution trace.

Gramlot already has the shared upload queue with local raster/text previews,
`transformPane` for bound visual transforms, and a separate `DeviceHandler`
camera capability returning a photo URL and format through a provider. None of
these is currently an editable image uploader or a pixel-crop contract. Reuse
the queue and device capabilities where their contracts fit; define how local
image values, transformed pixels, upload destinations and provider photo URLs
meet before implementation.


<a id="gc-385-090"></a>

## 090 · Editable image direction — confirmed 2026-11-01

The owner confirmed (“si il ritaglio nell'url per certi versi era comodo ma forse troppo complicato”) that editing keeps the original and framing parameters separately and creates the cropped image only on confirmation. Crop parameters encoded in the URL are not the primary representation. Reuse the approved upload engine and existing transform vocabulary where applicable. The owner also states that some images belong in the database and others in server storage. Both can use the application-owned binary upload target; Gramlot does not choose the application storage technology. Owner also confirmed browser-only image editing (“Sì, anche nel browser”). The browser and application upload result representations and the device-provider camera integration are recorded below.


The internal image crop module now implements a non-mutating rasterizer and
a private edit session. The session retains the original separately from
`x`/`y`/`zoom`/`rotate`, supports reset and cancellation, and only produces a
new Blob on confirmation. A late render cannot commit after cancel or a changed
transform. Output format and dimensions are supplied by its caller; unsupported
format conversion is rejected instead of silently changing the format. The component integrates this session with the shared upload engine.


The internal crop dialog composes the session with a preview and accessible
position, zoom and rotation controls, reset, confirmation and cancellation.
It returns the new Blob and transform to its caller; it does not write a Data
value or choose a storage destination. Chromium and WebKit tests exercise the
controls, and unit tests cover failed encoding and cancellation of a late
result. It is exposed through the Source component described below.


Image result binding — owner confirmed “Sì, va bene” and “procedi”: browser-only editing writes a data URL to the bound Data value; a server upload returns a displayable URL. `imageUploader` uses `operation=None` for browser-only editing and an application upload operation for server storage; `storepath` must address a Bag. Its initial output is PNG, and the crop and output dimensions must have the same aspect ratio. The original and transform are retained during the component lifetime; reopening a previously stored URL starts with that image. Remote editing requires a CORS-enabled image. Camera integration remains open.


Direct image manipulation — owner requested legacy-style drag with modifiers and touch gestures. The framing dialog supports mouse drag to move, Shift-drag vertically to zoom and Alt-drag vertically to rotate; one touch moves, two touches move, pinch and rotate. Pointer transitions are rebased without jumps; keyboard controls remain available and confirmation produces the crop. Chromium and WebKit passed real mouse interactions; Chromium passed a browser-dispatched two-touch test. Physical mobile devices remain unverified.


Trackpad — owner confirmed “ok”: a control-wheel pinch over the crop frame changes zoom, while ordinary wheel scrolling is not intercepted. Browser gesture events change zoom and rotation, and duplicate wheel events are ignored while that native gesture is active. Chromium browser-generated pinch and synthetic WebKit gesture events passed; physical trackpad and Safari remain to be checked.


Chrome trackpad rotation — owner confirmed “ok”: Alt plus trackpad scroll rotates the image without clicking; control-wheel pinch continues to zoom. Ordinary scroll is not intercepted and a simultaneous native browser gesture is not counted twice.


Image editor presentation — 2026-11-01: owner requests removal of sliders and lighter, translucent or external handles. The handles are outside the image with a low-emphasis treatment, and the focused preview and handles support keyboard adjustments. This supersedes the prior slider placement.


Shared upload context — owner confirmed “Sì, contesto condiviso”: the application can provide a shared Data Bag addressed by `contextPath`. At each preparation the current Bag is copied to the separate `context` mapping; absent `contextPath` produces an empty mapping. `fields` remains per-file and is never overwritten. The preparation record has `name`, `size`, `mediaType`, `fields`, and `context` for all uploads. Both server implementations validate the same required mapping. Context is application input, not identity; application storage remains application-owned.

The `contextPath` behavior is shared by `uploader` and `imageUploader` using the same context reader and upload engine. The attachment example verifies the saved record against this context; it remains a temporary demonstration rather than a persistent provider.


Image camera acquisition — owner confirmed “Sì, usa lo stesso editor”: when an attached device provider advertises camera, `imageUploader` fires the existing camera capture event, reads its successful photo URL and opens the existing crop dialog. Confirmation follows the same browser/application upload path. Cancel, denial, removal and stale results preserve the current value. There is no new camera API or automatic browser provider; provider photo URLs must be usable by canvas. Physical camera and native provider qualification remain open.


Reusable attachment manager — owner confirmed “Sì, operazioni dell’applicazione”. `attachmentManager` composes the shared uploader and application operations. `operation` names the existing upload, `listMethod`, `readMethod` and `removeMethod` name application endpoints, `contextPath` addresses a shared Bag and `ready` indicates that the parent is saved. The uploader retains files until ready; endpoints receive a context mapping and read/remove additionally receive `selected` (opaque attachment ID). List returns a Bag with attachment IDs as node labels and text `caption` attributes; read returns a Bag with `kind` (`text`, `image`, or `message`) and the corresponding `text` or image `src`; remove returns true only after the application completes removal; a false result leaves the selection intact and reports an error. The application owns durable storage, actual authorization and transactional cleanup.


Browser camera — owner confirmed “Sì, anche nel browser”. The explicitly attached `BrowserCameraProvider` implements the existing camera capability. It obtains video only on capture, returns the captured image through the existing photo URL contract and stops tracks on capture, cancel, page disposal and late permission resolution. Browser image selection implements the same provider contract. The gallery explicitly installs the provider when none is attached. ASGI, Worker directory and Worker single-file browser checks passed with a simulated camera; physical hardware remains unverified.

Screen capture — owner confirmed “Sì, usa lo stesso editor”: the browser selects a display, window or tab, one frame is captured and the display stream is stopped before the existing crop dialog. The confirmed result uses the existing browser/application destination and configured aspect ratio. Cancellation and late streams are cleaned up. Chromium qualified a real synthetic test tab; simulated streams qualified local and application destinations on ASGI and Worker. Other browser/OS combinations remain unverified.

Review corrections — 2026-11-01: simultaneous status checks share one reconciliation; completion logic runs once. A completed or newly uncertain transfer receives its recovery window at that outcome, including when completion races expiration. Failed Python expiry cleanup retains the unresolved transfer and does not prevent processing other transfers. The work still requires isolation from unrelated worktree changes before integration.


<a id="gc-385-080"></a>
## 080 · Common-base integration review — 2026-11-01

The owner requested starting uploader consolidation (“iniziamo da uploadeer”).
Core candidate ba85b6db, Uvicorn 8c5a391, Worker 2dcd0d5 and examples 04193d8
were integrated into the common base, preserving their original worktrees.
Earlier pending statements in this document are historical checkpoints.

The destination review moved attachment list/selection/preview/status and crop
transforms to Source-owned Bags. File handles, decoded images, subscriptions and
request cancellation remain resources. DOM relocation preserves the live component
and its queue; true removal still releases resources. Three gallery lessons use
existing environment collections and are listed in feature coverage.

Full checks and attribution are recorded in GC-070 and PORT-0028-uploader.
Uvicorn passed Chromium/WebKit qualification. Worker upload passed Chromium from
file and WebKit when served by HTTP. **WebKit opened from file cannot currently
read the posted File inside its opaque-origin Worker**: the isolated native probe
also throws NotReadableError. See [WebKit bug 258443](https://bugs.webkit.org/show_bug.cgi?id=258443).
This is an unresolved platform limitation, not a successful qualification or an
approved alternate wire protocol. The existing failure path reports an unsaved
transfer. No compatibility branch was added.

Application storage/auth, single-process transfer-registry lifetime, lack of
restart recovery and physical-device qualification remain the limits described
above. Technical integration does not approve Visual Editor, Invoice, publication
or production deployment of the demonstration storage.
