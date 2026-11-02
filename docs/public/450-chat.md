# Chat

Document ID: **GC-450**.

<a id="gc-450-start"></a>
## Start here

`chatMessages` is the scrolling live-Source message viewport. `ChatPane` is a Python composition helper, not another grammar tag: it combines this viewport with frames, a composer, status and ordinary toolbar controls.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). Example body for `main(self, root)`:

```python
from gramlot import ChatPane

chat = ChatPane(root, datapath="assistant", height="480px")
chat.frame.top.strong("Assistant")
```

The environment needs both chat and layout. This body is the UI part; sending also requires the Page Logic delegates and PageStore below. `ChatPane` accepts a required `datapath`, optional `chat_id="main"` (a literal identifier starting with a letter, then letters/digits/underscores), and frame attributes. Each conversation uses its own Data scope. `.frame`, `.composer`, `.messages` and `.toolbar` expose existing Source containers for composition.

Companion page JavaScript:

```javascript
import {chatRender, chatSend, chatCompleted, chatReset, chatResize,
        chatPickAttachments, chatRenderAttachments, chatRemoveAttachment}
    from "@gramlot/gramlot";
export class Logic {
    chatRender(node, params) { return chatRender(this.page, node, params); }
    chatSend(node) { return chatSend(this.page, node); }
    chatCompleted(node, params) { return chatCompleted(this.page, node, params); }
    chatReset(node) { return chatReset(this.page, node); }
    chatResize(node) { return chatResize(this.page, node); }
    chatPickAttachments(node) { return chatPickAttachments(this.page, node); }
    chatRenderAttachments(node, params) { return chatRenderAttachments(this.page, node, params); }
    chatRemoveAttachment(node) { return chatRemoveAttachment(this.page, node); }
}
```

A companion PageStore supplies processing; the default hook echoes the submitted message:

```python
from gramlot import ChatPageStore

class PageStore(ChatPageStore):
    pass
```

Override `process_message(self, text)` to return a string or Gramlot SourceBag; plain Data Bags and HTML response formats are not accepted. Distinct panes need distinct `datapath` and `chat_id`; declare allowed IDs in `ChatPageStore.chat_ids` (default `("main",)`). Application integrations replace the processing hook and own credentials, permissions and persistence. Logic only delegates behavior; conversation state remains in Data/Source. The component has no provider/model/temperature parameters. A file-only export cannot execute this Python PageStore.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)


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

No additional component-specific parameters. Use the shared contracts above and ordinary Source/CSS attributes.


Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.
