# Chat

Document ID: **GC-450**.

<a id="gc-450-start"></a>
## Start here

`chatMessages` is the scrolling live-Source message viewport. `ChatPane` is a Python composition helper, not another grammar tag: it combines this viewport with frames, a composer, status and ordinary toolbar controls.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-chat).

The environment needs both chat and layout. This body is the UI part; sending also requires the Page Logic delegates and PageStore below, plus a host with PageStore WebSocket enabled. For Uvicorn, pass `websocket=True` to `create_application(pages, websocket=True)`; the default HTTP-only setup is insufficient. Kajenn also supports its explicit WebSocket option. `ChatPane` accepts a required `datapath`, optional `chat_id="main"` (a literal identifier starting with a letter, then letters/digits/underscores), and frame attributes. Each conversation uses its own Data scope. `.frame`, `.composer`, `.messages` and `.toolbar` expose existing Source containers for composition.

Companion page JavaScript:

[See the setup code in the appendix](465-widget-examples.md#gc-465-setup-chat).

A companion PageStore supplies processing; the default hook echoes the submitted message:

[See the setup code in the appendix](465-widget-examples.md#gc-465-setup-chat).

Override `process_message(self, text)` to return a string or Gramlot SourceBag; plain Data Bags and HTML response formats are not accepted. Build a SourceBag with `self.source_builder()`: in a PageStore opened by GramlotServer it returns a new builder with the collections of the page already loaded, as for `@source` methods, so the store imports no collection. Distinct panes need distinct `datapath` and `chat_id`; declare allowed IDs in `ChatPageStore.chat_ids` (default `("main",)`). Application integrations replace the processing hook and own credentials, permissions and persistence. Logic only delegates behavior; conversation state remains in Data/Source. The component has no provider/model/temperature parameters. A file-only export cannot execute this Python PageStore.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)

## A live Source viewport and a conversation composition

`chatMessages` is the collection's browser widget: a scrolling container for live Source message children. It allows ordinary Source content and declares no component-specific value, provider or send parameters. Its log role and polite live announcement support conversation reading. Choose it alone when the surrounding application already owns the composition; choose the Python `ChatPane` helper when you need the provided message area, composer, status and toolbar.

[Code for this composition is in the appendix](465-widget-examples.md#gc-465-setup-chat).

`ChatPane` requires `datapath`. It builds real Source controls and initializes conversation, draft, pending/error and attachment state in that Data scope. `.frame`, `.composer`, `.messages` and `.toolbar` expose those existing containers for composition. `chat_id` is a literal identifier starting with a letter and continuing with letters, digits or underscores. Separate panes need separate datapaths and IDs; the companion `ChatPageStore.chat_ids` must allow those IDs. The default allowed conversation is `main`.

### Sending requires Logic delegates, a PageStore and WebSocket

The Page Logic module delegates `chatRender`, `chatSend`, `chatCompleted`, `chatReset`, `chatResize`, `chatPickAttachments`, `chatRenderAttachments` and `chatRemoveAttachment` to the exported core functions. Controllers react to conversation changes, render Source children and update status; conversation state stays in Data/Source. This delegation is required wiring, not a second message store. The composer writes its draft through ordinary bindings and disables sending while pending, while picking attachments, before the conversation is ready, or when neither text nor attachments are available.

ChatPane uses `dataBinder`, which requires a PageStore WebSocket. Enable the host capability explicitly: for example, Uvicorn `create_application(pages, websocket=True)`. The default HTTP-only application cannot run this composition.

A Python PageStore subclassing `ChatPageStore` supplies processing. Its default `process_message(self, text)` echoes text; override it for application behavior. Return a string or Gramlot SourceBag, not HTML or a plain Data Bag. Build a SourceBag with `self.source_builder()`: in a PageStore opened by GramlotServer it returns a new builder with the collections of the page already loaded, as for `@source` methods, so the store imports no collection. During processing, `request_attachments` exposes the active request's attachments and `feedback(text)` updates transient status. Applications own provider integration, credentials, authorization and persistence. There are no model, provider or temperature widget parameters, and selecting the collection does not supply an AI service.

Use the complete [ChatPane, Logic and PageStore example](465-widget-examples.md#gc-465-setup-chat) when assembling the page. It needs the chat and layout collections and the normal supporting controls. A file-only export cannot execute this Python PageStore; a viewport appearing successfully does not establish that sending has a working backend.

## Choose a component

- [`chatMessages`](#gc-450-chatmessages): Scrollable live Source message viewport; ChatPane composes the conversation interface around it.


<a id="gc-450-005"></a>
<a id="gc-450-010"></a>
Types: T text, B Boolean, L integer, R real, X structured value; other codes are TYTX. Binding: read = Data to widget; write = widget to Data; twoWay = both. A dash means no declared default/binding. None is a declared value. Constraints include enum, qualification, target and annotations. Tables describe component contracts; ordinary Source/CSS attributes are shared.


## Shared parameter contracts

Each widget below links only the shared contracts it supports. A shared name can have different types, defaults or bindings; separate rows preserve those differences.


<a id="gc-450-435"></a>
## Conversations


<a id="gc-450-375"></a>
<a id="gc-450-chatmessages"></a>
### `chatMessages`

Scrollable live Source message viewport; ChatPane composes the conversation interface around it.

Collection: **chat**. Browser element: `gramlot-chat-messages`.

[ChatPane composition and server responsibilities](450-chat.md#gc-450-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chatmessages).


**Data contract.** Displays its Source children. The separate ChatPane recipe creates and binds conversation, message and draft Data. Page Logic renders strings literally and gives Source messages independent scopes.


**Interaction and events.** The viewport is a focusable scroll region with polite log announcements. ChatPane Logic owns sending, request correlation, message rendering and conditional follow-on-scroll. ChatPageStore's processing hook may return text or Gramlot Source.


**Composition.** Accepts ordinary Source children. Python ChatPane composes the viewport with frame regions, composer, toolbar, actions and controllers.


**Limits and lifecycle.** The viewport declares no send, provider or persistence parameters. The recipe needs the supporting collections, Page Logic and a working PageStore. Application code owns authorization and provider integration.

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.
