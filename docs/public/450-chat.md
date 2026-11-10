# Chat

Document ID: **GC-450**.

The chat collection holds the message area of a conversation. This page answers
**how do I put a chat on a page, and what must my application provide so that
sending a message gets an answer?** The parameters are in the
[widget reference](345-widget-reference.md).

<a id="gc-450-start"></a>

## A chat in three parts

A working chat needs three pieces, all on the same page:

1. the **layout**, built in `main` with the `ChatPane` helper;
2. the page's **Logic**, which hands the chat events to the core functions;
3. a **PageStore** on the server, which answers each message.

The host must also run PageStore over WebSocket: with Uvicorn,
`create_application(pages, websocket=True)`. A page exported as plain files has no
server, so it can show the chat but not answer it. The page base of your environment
already enables this collection; if it does not,
[enable it once](340-components-and-collections-guide.md#gc-340-050).

<a id="gc-450-005"></a>
<a id="gc-450-010"></a>

## Pick a component

| You want to | Use |
| --- | --- |
| A complete chat: messages, composer, send button | `ChatPane`, built around [chatMessages](#gc-450-chatmessages) |
| Only the scrolling message area, in your own layout | [chatMessages](#gc-450-chatmessages) |

<a id="gc-450-435"></a>
<a id="gc-450-375"></a>
<a id="gc-450-chatmessages"></a>

## The layout

In `main`, `ChatPane` builds a frame with the messages in the centre and a composer
below:

```python
from gramlot import ChatPane

chat = ChatPane(root, datapath="assistant", height="480px")
```

 `datapath` is required: the conversation, the
draft and the attachments live there. `chat.frame`, `chat.messages`, `chat.composer`
and `chat.toolbar` are ordinary containers where you add your own items, for example
a title in `chat.frame.top`. [Complete example](465-widget-examples.md#gc-465-setup-chat).

The message area is a [chatMessages](345-widget-reference.md#gc-345-chatmessages): a
scrolling region that screen readers announce as a log. It has no parameters of its
own and accepts any Source children, so you can also use it alone in a layout you
build yourself.

Two chats on one page need different `datapath` values and different `chat_id`
values (a name such as `support`; the default is `main`).

## The page Logic

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

The Logic only passes each event to the core function of the same name; the
conversation itself stays in Data. The send button is disabled while a message is
pending, while files are being picked and when there is nothing to send.

## The answer, on the server

```python
from gramlot import ChatPageStore

class PageStore(ChatPageStore):
    chat_ids = ("main",)

    def process_message(self, text):
        self.feedback("Thinking…")
        return f"You wrote: {text}"
```

`process_message` receives the text and returns the answer: a string, or Source
built with `self.source_builder()`. Without an override it repeats the message back.
While it works, `self.feedback(text)` updates the status line and
`self.request_attachments` is a Bag of the files sent with the message (at most
five). `chat_ids` lists
the chats the store accepts.

The chat contains no AI service and no model settings: calling a provider, keeping
its credentials, deciding who may chat and storing conversations are your
application's job, inside `process_message`.
