# 390 · Reusable base chat

Document ID: **GC-390**. Development implementation, 2026-10-29; not a released API.

<a id="gc-390-005"></a>
## 005 · Owner decisions and scope

The conversation-poc task explicitly approved: a base chat composed from an outer
framePane with customizable top and scrolling center, and a bottom frame whose
center holds input/send and whose top/bottom are customizable; a server hook
`process_message(self, text)` defaulting to echo; string or SourceBag results;
per-message datapath isolation with Page-owned controllers and absolute access
to shared Data. The owner then instructed “ok procedi con la chat base con echo
e un esempio di risposta con Source interattivo”. Earlier decisions and confirming
replies are recorded in gramlot-examples GE-040 §§025–045. Provider logic stays
in the server Page/application. This does not approve a provider framework or a
new transport. The optional voice-input button does not include capture or speech
recognition; an application can author a button in the composer center once it
supplies its behavior. No recording or transcription is implemented here.

<a id="gc-390-010"></a>
## 010 · Python authoring

Load both prepared collections and construct the composition:

```python
from gramlot import Page as BasePage, ChatPane, ChatPageStore
from gramlot.collections.layout import mygramlot as layout
from gramlot.collections.chat import mygramlot as chat

class Page(BasePage):
    gramlots = [layout, chat]

    def main(self, root):
        ui = ChatPane(root, datapath="assistant", height="100dvh")
        ui.frame.top.strong("Assistant")
        ui.composer.top.set_attr(height="26px")
        ui.composer.top.span("Your tools above the editor")
        ui.toolbar.span("Your model controls below the editor")

class PageStore(ChatPageStore):
    pass  # process_message returns the submitted string: no credentials needed.
```

ChatPane is a Python Source composition object, not a new Builder grammar alias.
`frame` and `composer` are real framePane Source nodes; `messages` is the scrolling
chatMessages node. The composer center contains a bound textarea and status. The send icon is in
the bottom toolbar; ui.toolbar is the Source container for application controls
beside it. The empty top defaults to 2px; set its height when authoring it.
Use its normal Source regions to add controls. No automatic settings drawer or
provider/model/effort/temperature controls are built into the base.

The Page's companion JS delegates eight named methods to core. Additional methods
for interactive messages belong to this same Page Logic:

```javascript
import {chatRender, chatSend, chatCompleted, chatReset, chatResize,
        chatPickAttachments, chatRenderAttachments, chatRemoveAttachment} from '@gramlot/gramlot';
export class Logic {
    chatRender(node, params) { return chatRender(this.page, node, params); }
    chatSend(node) { return chatSend(this.page, node); }
    chatCompleted(node, params) { return chatCompleted(this.page, node, params); }
    chatReset(node) { return chatReset(this.page, node); }
    chatResize(node) { return chatResize(this.page, node); }
    chatPickAttachments(node) { return chatPickAttachments(this.page, node); }
    chatRenderAttachments(node, params) { return chatRenderAttachments(this.page, node, params); }
    chatRemoveAttachment(node) { return chatRemoveAttachment(this.page, node); }
    increment(node) { node.SET('.count', node.getRelativeData('.count') + 1); }
}
```

<a id="gc-390-015"></a>
## 015 · Server hook and Source replies

```python
from gramlot import GramlotBuilder

class PageStore(ChatPageStore):
    def process_message(self, text):
        if text != "/source":
            return super().process_message(text)
        b = GramlotBuilder()
        panel = b.root.div()
        panel.dataSetter(".count", 0)
        panel.button("Increment").dataController(func="increment")
        panel.span("^.count")
        return b.source
```

The synchronous hook returns only str or GramlotBuilderBag (the Gramlot SourceBag
produced by GramlotBuilder). Plain Data Bags, HTML response formats and coercion
fallbacks are not accepted. Source may include images, tables, bound controls and
other components. The Page must load all collections used by its replies and
provide every referenced named controller. Explicit DOM/Source IDs remain global
and must be unique across fragments. Credentials and LLM/tool orchestration
remain outside core. Model-generated plain text is rendered literally, including
pointer-like prefixes; it is never treated as executable Source.

<a id="gc-390-020"></a>
## 020 · Data binder and lifecycle

`chat_id` defaults to main and is a literal identifier. `ChatPageStore.chat_ids`
declares allowed IDs; distinct panes use distinct datapaths and IDs. Each pane's
`.conversation` is bound to `chats.<chat_id>`, containing messages, ready, request,
response and feedback. Browser-local draft, pending, requestId, error and
messageData, attachments, picking and composerHeight are ordinary Data. Message labels are stable m_<uuid hex> values;
node values are string/Gramlot Source, with role (user/assistant) and author.
Completed replies append a user/assistant pair.

Send writes a single request Bag with id, action='send', text and attachments
(a typed Data Bag snapshot, also when empty). Reset writes id, action='reset',
text=None and the attachment snapshot; reset does not process attachments. The ordinary dataBinder synchronizes this write;
the server's chat_request dataController observes the request and executes the
hook. The server writes response as a Bag with id, submitted, accepted and error.
The bound chatCompleted controller correlates id against local requestId and
ignores other completions. The latest completed request is not executed twice;
this is not persistent deduplication or a retry protocol. No chat publication is
used. The owner explicitly superseded the earlier unpublished topic contract.

A failed hook or unsupported result preserves history and draft. Successful
completion clears submitted attachments and only a draft still matching submitted
text. Reset clears messages without discarding an unsent draft or attachments. Sending is disabled while pending
or while choosing files or before the binder's ready snapshot. Connection failure/reconnect/retry remains
the existing PageStore channel's responsibility, not a new chat delivery layer.

The shared browser projection clones typed Source, prepares/validates it through
the page renderer and inserts it with Builder. It never mounts the Data-owned
Source object directly. Each message wrapper owns the absolute path derived from
`.messageData.<label>`. Relative bindings/controller writes stay local; absolute
paths retain normal access to shared Page Data. Appending replies preserves older
Source nodes, DOM, focus and local values. Removing/resetting messages removes
their Source and local Data; renderer lifecycle releases controls/subscriptions.
Removing the viewport releases all its message Data. Projection identity metadata
is weakly owned by the viewport Source node, not a business-data mirror.

The base conversation is append/reset oriented. In-place editing/reordering of
existing responses is not an exposed chat operation. Automatic scrolling follows
only while the reader is near the bottom. No streaming, cancellation, reconnection
policy, archive, context compaction or automatic LLM history construction is added.

<a id="gc-390-025"></a>
## 025 · Verification

The provider-free Python tests cover echo, reset, Source TYTX round trip, isolation
of server chat branches, unsupported results/errors and actual frame composition.
Browser tests cover independent interactive fragments, Page controller execution,
stable DOM on append, literal text, Data-owned Source preservation, cleanup,
request correlation, draft preservation on failure and scrolled-up readers.

The separate gramlot-examples trial `trials/chat_base` supplies a real WebSocket
page with default echo and /source replies containing an image, table, counter
and note field. Live verification on 2026-10-29 confirmed echo and two Source
messages retaining independent counters (2 and 1) and independent notes.
The example runs without Anthropic/OpenAI credentials on local port 8773.
Live reset also removed the old reply; a new Source reply started at zero with
an empty note. Final regression totals: 69 JavaScript tests and 67 Python tests
plus 36 subtests; runtime/prepared collection build passed.
Implementation verification does not constitute owner acceptance or publication.


Chat appearance refinement — owner 2026-10-29 requested removing Assistant/You
headings and using subtle gray-blue versus gray backgrounds. The base chat now
omits visible author headings, preserving accessible article names. Assistant
Source/text messages share a themed gray-blue background; user messages retain
the gray bubble. The example's nested card no longer obscures the message color.
Runtime/collection rebuild and all 5 focused browser tests pass. Live echo in the
restarted port-8773 example verified both backgrounds and no visible author titles.


<a id="gc-390-030"></a>
## 030 · Transient feedback through Data

Owner 2026-10-29 requested replacing working/finishing comments without history
append or scrolling, then clarified “la chiamata dovrebbe essere che io metto la
domanda in un punto e la sync la manda al server”. The following “ok procedi”
authorized the binder correction and bounded connected gramlot-py-server work.

```python
class PageStore(ChatPageStore):
    def process_message(self, text):
        self.feedback(f"Processing {len(text)} characters…")
        # Perform the application's synchronous processing here.
        self.feedback("Finishing…")
        return text
```

feedback(text) writes chats.<chat_id>.feedback using ordinary data.set_item.
It is valid only inside this store's synchronous process_message call; a
ContextVar scopes the helper to that call and is reset in finally. The field is
cleared on success, error and reset. It is not a conversation message or LLM
history item. The composer center contains a fixed-height bound status row,
outside chatMessages and without occupying either customizable composer bar.
Updates replace its text without rebuilding messages or invoking chatRender.

The original integration gap was reproduced before editing: three updates during
two seconds of processing arrived together at 2.005/2.005/2.006 seconds.
The connected adapter correction now drains outgoing deltas in an independent
writer; Uvicorn executes synchronous store operations in a serialized worker,
while Kajenn retains its own execution/database policy. Cancellation drains a
running synchronous worker before store cleanup. This is integration-owned
scheduling, not a new core transport or application thread workaround.

Verification: 70 JavaScript tests; 69 Python tests plus 36 subtests; runtime and
prepared collection build. Adapter channel checks pass on Uvicorn and Kajenn,
including a gated controller that cannot finish until the peer receives feedback.
Live port-8773 echo and Source replies show feedback during processing, clear it
on completion, and retain working counter/note controls. The example adds 1.6
seconds of explicit demo pacing; the base echo hook adds no delay. These changes
are implemented and verified locally; owner acceptance and release are separate.


The owner's later AI/image migration request is implemented in gramlot-examples
GE-040 §060. That Page composes these same frames and handlers and overrides
process_message for providers. Images are Source replies; provider context stays
server-owned. Live natural-language generation and context recall were verified.


<a id="gc-390-035"></a>
## 035 · Compact composer and visible processing — 2026-10-29

The owner requested smaller top/bottom spaces, a rounded question input, an icon
send in the bottom toolbar, and more visible processing status. This supersedes
the initial send-in-center layout. ChatPane.editor/toolbar/sendButton expose
ordinary Source references; no new transport or control component is introduced.
The input has an 18px radius. Historical record: the bottom toolbar was initially 48px high and contains the
application controls and the built-in accessible Send icon. Empty top defaults
to zero; applications explicitly size authored top content.

A browser dataFormula derives .status from .pending and .conversation.feedback:
it shows a sending label immediately, then the server's current feedback, and
clears when processing ends. This is derived presentation Data, not simulated
server progress. The fixed status row remains outside the message scroll. The
AI example adds an animated pending indicator with reduced-motion support and
collapses its optional notice region when empty. Its composer was initially 190px high; §040 supersedes that fixed height.
Live verification showed feedback during both echo and real Anthropic processing;
send was measured as 36x36 pixels, and completion cleared feedback and the draft.


Empty composer top — owner 2026-10-29 requested only a couple of pixels when
empty. The shared top and AI notice top now use 2px when empty; the derived
status row is display:none while empty, and editor center has no top padding.
While processing, the same bound status becomes visible. This supersedes the
previous permanently reserved status height; message viewport height is unchanged.
Six focused Python composition/server checks passed.


<a id="gc-390-040"></a>
## 040 · Growing composer and attachments — 2026-10-29

Owner requested an input that grows with text, a toolbar-height bottom, and a +
for files/images. The owner confirmed “Anche PDF” to draft Data attachments,
preview/removal and server reading, including PNG/JPEG/WebP, UTF-8 text/code and
PDF. This supersedes the fixed composer height in §035. No provider code moves
into core and no upload service or persistent file store is introduced.

The editor starts at 44px, grows with lines/wrapping to 180px, then scrolls
internally. The bottom toolbar is 44px, with 36px Add and Send buttons; empty top
is 2px. chatResize measures the natural center and authored regions and writes
composerHeight through Data. It waits for mounted Source, observes size changes,
and releases its ResizeObserver/animation frame on renderer disposal. Feedback,
errors and attachment previews reserve space only when present.

The + invokes the native multiple-file chooser from shared core behavior. Files
remain browser-local in .attachments until Send snapshots them into the request.
Each a_<randomId> node contains a Bag with name, canonical mediaType, byte size
and base64 data. Images have thumbnails; other files show their names. Each has
a Remove control. No PDF viewer, editing, download archive or drag/drop is added.
UTF-8 text extensions: txt, md, csv, json, py, js, ts, jsx, tsx, html, css, sql,
yaml, yml, xml, sh, toml and log. Limits: five files, 2 MiB per image/PDF, 1 MiB per
text file, 4 MiB total. Selection is atomic; invalid selection preserves earlier
attachments. Selection cancellation and Source disposal clean up the file input.

The server validates types, sizes, base64, UTF-8 and basic image/PDF signatures
before process_message. This is format validation, not a full document parser.
During that synchronous hook, self.request_attachments returns the validated Bag;
access outside the request raises. Empty text is allowed when files are attached.
The application maps files into its provider's input format. The default hook
still echoes text; it does not interpret documents. Completed user messages are
Gramlot Source with literal text/filenames and image thumbnails. Failed requests
retain draft/files; successful sends clear submitted files; reset retains unsent
files. Provider attachments/context remain application-owned.

Verification: 11 core Python tests, 8 core JavaScript tests, 24 example Python
tests and 3 example JavaScript tests pass. Runtime/prepared collection build
passed. Live browser checks covered grow/shrink/cap, 2px empty top, 44px toolbar,
file removal, attachment-only echo, status during processing and cleared drafts.
Real Anthropic processing read synthetic PDF/text markers and a PNG color, then
consulted the PDF again on the following turn. Implemented and verified locally;
owner acceptance and publication remain separate.


<a id="gc-390-045"></a>
## 045 · Integration into the common local base


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

Final integration checks: the full core Python suite passes (348 tests and
397 subtests; one declared expected failure). Focused example checks pass
(28 chat/provider/collection tests, then 5 catalogue/base tests and 8 subtests).
Documentation identities/paired anchors and whitespace checks pass. The base
chat stylesheet now consumes the gallery theme tokens, fixing the low-contrast
prototype button without changing the original trial. Browser verification uses
Kajenn; both Kajenn and Uvicorn feedback/cleanup paths pass automated tests.
