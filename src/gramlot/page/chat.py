"""Provider-independent chat composition and PageStore processing hook."""
import re
import base64
import json
from contextvars import ContextVar
from uuid import uuid4
from genro_bag import Bag
from .page_store import PageStore
from .source import GramlotBuilderBag

_ACTIVE_CHAT = ContextVar("gramlot_chat_request", default=None)

_CHAT_ID = re.compile(r"^[A-Za-z][A-Za-z0-9_]*$")


class ChatPane:
    """Compose real frames. Page Logic delegates the chat* handlers to core."""

    def __init__(self, parent, *, datapath, chat_id="main", **attributes):
        if not _CHAT_ID.fullmatch(chat_id):
            raise ValueError("chat_id must be a literal identifier")
        self.frame = parent.framePane(datapath=datapath, **attributes)
        frame = self.frame
        frame.dataSetter('.conversation', Bag(dict(messages=Bag(), ready=False, request=None, response=None, feedback="")))
        frame.dataSetter('.messageData', Bag())
        frame.dataSetter('.draft', '')
        frame.dataSetter('.pending', False)
        frame.dataSetter('.requestId', '')
        frame.dataSetter('.error', '')
        frame.dataSetter('.attachments', Bag())
        frame.dataSetter('.picking', False)
        frame.dataSetter('.composerHeight', 96)
        frame.dataBinder('.conversation', f'chats.{chat_id}')
        frame.dataController(func='chatCompleted', response='^.conversation.response')
        frame.top.set_attr(height='44px')
        self.messages = frame.center.chatMessages(height='100%', min_height=0)
        self.messages.dataController(func='chatRender', messages='^.conversation.messages', _onBuilt=True)
        frame.bottom.set_attr(height='^.composerHeight', splitter=False)
        self.composer = frame.bottom.framePane(height='100%', **{'data-chat-composer': True})
        self.composer.top.set_attr(height='2px', **{'data-chat-top': True})
        self.composer.bottom.set_attr(height='44px')
        pane = self.composer.center.contentPane(overflow='hidden')
        center = pane.div(display='flex', flex_direction='column', padding='0 12px 2px', gap='4px')
        center.dataFormula('.status', 'pending ? (feedback || "Sending to the server…") : ""',
                           pending='^.pending', feedback='^.conversation.feedback', _init=True)
        center.div('^.status', node_label='chatFeedback',
                   class_='gramlot-chat-status', role='status', aria_live='polite',
                   display='^.status:={} ? "flex" : "none"',
                   **{'data-pending': '^.pending'}, height='22px', min_height='22px',
                   overflow='hidden', white_space='nowrap', text_overflow='ellipsis', font_size='13px')
        self.editor = center.textarea(value='^.draft', live=True, aria_label='Message',
                        placeholder='Write a message…', class_='gramlot-chat-editor',
                        rows=1, min_height='44px', height='44px', line_height='20px', resize='none', width='100%', box_sizing='border-box',
                        border_radius='18px', padding='10px 14px')
        previews = center.div(display='flex', gap='6px', overflow_x='auto', max_height='76px')
        previews.dataController(func='chatRenderAttachments', attachments='^.attachments', _onBuilt=True)
        center.dataController(func='chatResize', draft='^.draft', status='^.status',
                              error='^.error', attachments='^.attachments', _onBuilt=True)
        center.span('^.error', role='alert', hidden='^.error:=!{}', font_size='12px')
        actions = self.composer.bottom.div(class_='gramlot-chat-toolbar', role='toolbar',
                       **{'data-chat-toolbar': True},
                       aria_label='Chat controls', display='flex', align_items='center',
                       gap='8px', height='44px', padding='0 14px', box_sizing='border-box')
        actions.button(icon='+', aria_label='Add files or images', title='Add files or images',
                       class_='button--quiet', font_size='24px', width='36px', height='36px',
                       style='--gramlot-touch-target:36px;--gramlot-button-padding:0;--gramlot-field-height:36px;',
                       picking='^.picking', disabled='^.pending:={} || {picking}').dataController(func='chatPickAttachments')
        self.toolbar = actions.div(display='flex', align_items='center', gap='10px',
                                   flex=1, min_width=0, overflow_x='auto')
        self.sendButton = actions.button(icon='↑', aria_label='Send', title='Send message',
                       class_='gramlot-chat-send', font_size='22px', flex_shrink=0,
                       style='--gramlot-radius-sm:50%;--gramlot-button-padding:0;--gramlot-field-height:36px;',
                       width='36px', height='36px', chat_id=chat_id,
                       ready='^.conversation.ready', draft='^.draft', attachments='^.attachments', picking='^.picking',
                       disabled='^.pending:={} || {picking} || !{ready} || (!{draft}.trim() && !{attachments}.length)')
        self.sendButton.dataController(func='chatSend', chat_id=chat_id)


class ChatPageStore(PageStore):
    """One page's chats. Override process_message; provider dependencies stay outside core."""

    chat_ids = ('main',)

    def main(self, root):
        for chat_id in self.chat_ids:
            if not isinstance(chat_id, str) or not _CHAT_ID.fullmatch(chat_id):
                raise ValueError('chat_ids must contain literal identifiers')
            root.dataSetter(f'chats.{chat_id}', Bag(dict(messages=Bag(), ready=True,
                            request=None, response=None, feedback='')))
            root.dataController(func='chat_request', chat_id=chat_id,
                                request=f'^chats.{chat_id}.request')

    @property
    def request_attachments(self):
        active = _ACTIVE_CHAT.get()
        if active is None or active[0] is not self:
            raise RuntimeError('request_attachments requires an active process_message call')
        return active[2]

    def process_message(self, text):
        """Return plain text or Gramlot Source. The base implementation is echo."""
        return text

    def feedback(self, text):
        """Replace the current request's transient status through ordinary Data."""
        active = _ACTIVE_CHAT.get()
        if active is None or active[0] is not self:
            raise RuntimeError('feedback requires an active process_message call')
        if not isinstance(text, str):
            raise TypeError('feedback must be text')
        self.data.set_item(f'chats.{active[1]}.feedback', text)

    def chat_request(self, node, chat_id, request):
        if not isinstance(request, Bag):
            return
        request_id = request.get_item('id')
        action = request.get_item('action')
        text = request.get_item('text')
        if not isinstance(request_id, str) or not request_id:
            raise ValueError('Chat requests require an ID')
        base = f'chats.{chat_id}'
        previous = self.data.get_item(base+'.response')
        if isinstance(previous, Bag) and previous.get_item('id') == request_id:
            return
        accepted, error = False, ''
        attachments = request.get_item('attachments')
        token = _ACTIVE_CHAT.set((self, chat_id, attachments))
        try:
            if action == 'reset':
                self.data.set_item(base+'.messages', Bag())
                accepted = True
            elif action != 'send':
                error = 'Unknown chat action.'
            elif not isinstance(text, str) or (not text.strip() and not attachments):
                error = 'Enter a message.'
            else:
                validate_attachments(attachments)
                result = self.process_message(text)
                if not isinstance(result, (str, GramlotBuilderBag)):
                    raise TypeError('process_message must return text or Gramlot Source')
                messages = self.data.get_item(base+'.messages')
                messages.set_item('m_'+uuid4().hex, attachment_message(text, attachments),
                                  _attributes=dict(role='user', author='You'))
                messages.set_item('m_'+uuid4().hex, result, _attributes=dict(role='assistant', author='Assistant'))
                accepted = True
        except Exception:
            error = 'The server could not process the message. Your draft has been kept.'
        finally:
            _ACTIVE_CHAT.reset(token)
            self.data.set_item(base+'.feedback', '')
        self.data.set_item(base+'.response', Bag(dict(id=request_id, submitted=text,
                           accepted=accepted, error=error)))


TEXT_EXTENSIONS = frozenset(('txt', 'md', 'csv', 'json', 'py', 'js', 'ts', 'jsx', 'tsx',
                             'html', 'css', 'sql', 'yaml', 'yml', 'xml', 'sh', 'toml', 'log'))
FILE_TYPES = dict(png='image/png', jpg='image/jpeg', jpeg='image/jpeg', webp='image/webp', pdf='application/pdf',
                  **dict.fromkeys(TEXT_EXTENSIONS, 'text/plain'))


def validate_attachments(attachments):
    """Validate the one attachment wire format before application/provider code."""
    if not isinstance(attachments, Bag) or len(attachments) > 5:
        raise ValueError('Attachments require a Bag containing at most five files')
    total = 0
    for node in attachments:
        file = node.value
        if not isinstance(file, Bag):
            raise TypeError('Attachment must be a Bag')
        name, media, size, encoded = (file.get_item(k) for k in ('name', 'mediaType', 'size', 'data'))
        if not isinstance(name, str) or not name or len(name) > 255 or '/' in name or '\\' in name:
            raise ValueError('Invalid attachment name')
        if FILE_TYPES.get(name.rsplit('.', 1)[-1].lower()) != media:
            raise ValueError('Unsupported attachment type')
        limit = 1024*1024 if media == 'text/plain' else 2*1024*1024
        if type(size) is not int or not 0 < size <= limit or not isinstance(encoded, str) or len(encoded) > ((limit+2)//3)*4:
            raise ValueError('Attachment exceeds its size limit')
        raw = base64.b64decode(encoded, validate=True)
        if len(raw) != size:
            raise ValueError('Attachment size differs from content')
        total += size
        if total > 4*1024*1024:
            raise ValueError('Attachments exceed 4 MiB')
        if media == 'text/plain':
            raw.decode('utf-8', errors='strict')
            if b'\x00' in raw: raise ValueError('Binary file is not UTF-8 text')
        elif media == 'image/png' and not raw.startswith(b'\x89PNG\r\n\x1a\n'):
            raise ValueError('Invalid PNG')
        elif media == 'image/jpeg' and not raw.startswith(b'\xff\xd8\xff'):
            raise ValueError('Invalid JPEG')
        elif media == 'image/webp' and not (raw.startswith(b'RIFF') and raw[8:12] == b'WEBP'):
            raise ValueError('Invalid WebP')
        elif media == 'application/pdf' and not raw.startswith(b'%PDF-'):
            raise ValueError('Invalid PDF')


def attachment_message(text, attachments):
    if not len(attachments):
        return text
    from .builder import GramlotBuilder
    b = GramlotBuilder()
    b.root.div('=='+json.dumps(text), white_space='pre-wrap')
    for node in attachments:
        file = node.value
        b.root.div('=='+json.dumps(file.get_item('name')), font_size='13px')
        if file.get_item('mediaType').startswith('image/'):
            b.root.img(src='data:'+file.get_item('mediaType')+';base64,'+file.get_item('data'),
                       alt='=='+json.dumps(file.get_item('name')), max_width='240px', max_height='160px')
    return b.source
