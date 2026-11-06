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


<a id="gc-450-005"></a>
<a id="gc-450-010"></a>

Ordinary Source/CSS attributes remain in Writing pages and Themes and CSS.
Pages inherit environment collections; Page.gramlots adds missing ones. Buttons are built in.
Contract JSON omits only undeclared keys: no default is not the same as null. dtype: T text, B Boolean, L integer, R real, X structured value; remaining codes are TYTX. binding: read = Data to widget, write = widget to Data, twoWay = both. nullable permits None; enum restricts values; annotation preserves type/regex constraints. Parameters sharing a table row have exactly the same contract. Child grammar: * allows arbitrary Source children; empty permits none. Parent None means no declared restriction.


<a id="gc-450-435"></a>
## Conversations


<a id="gc-450-375"></a>
<a id="gc-450-chatmessages"></a>
### `chatMessages`

Collection: chat. Scrollable live Source message viewport; ChatPane composes the conversation interface around it.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-chatmessages).


**Data contract.** Displays its Source children. The separate ChatPane recipe creates and binds conversation, message and draft Data. Page Logic renders strings literally and gives Source messages independent scopes.


**Interaction and events.** The viewport is a focusable scroll region with polite log announcements. ChatPane Logic owns sending, request correlation, message rendering and conditional follow-on-scroll. ChatPageStore's processing hook may return text or Gramlot Source.


**Composition.** Accepts ordinary Source children. Python ChatPane composes the viewport with frame regions, composer, toolbar, actions and controllers.


**Limits and lifecycle.** The viewport declares no send, provider or persistence parameters. The recipe needs the supporting collections, Page Logic and a working PageStore. Application code owns authorization and provider integration.

No additional component-specific parameters.


Child grammar: `*`; parent grammar: `None`.
