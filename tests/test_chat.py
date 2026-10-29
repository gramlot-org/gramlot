"""Provider-free chat server contract and Python composition."""
import json
from pathlib import Path
from uuid import uuid4
import pytest
from genro_bag import Bag
from genro_tytx import from_tytx, to_tytx
from gramlot import GramlotBuilder, ChatPane, ChatPageStore


def store(cls=ChatPageStore):
    instance=cls(); events=[]
    instance.start()
    instance.subscribe("client", "chats", lambda wire: events.append(from_tytx(wire)))
    return instance,events


def send(instance,text,chat_id='main'):
    instance.change('client', dict(path=f'{chat_id}.request', evt='upd_value', attr={},
                    value=Bag(dict(id=uuid4().hex, action='send', text=text, attachments=Bag()))))


def test_echo_and_reset():
    instance,events=store()
    try:
        send(instance,'hello')
        assert [node.value for node in instance.data.get_item('chats.main.messages')]==['hello','hello']
        assert instance.data.get_item('chats.main.response.accepted') is True
        instance.data.set_item('chats.main.request', Bag(dict(id='reset', action='reset', text=None)))
        assert len(instance.data.get_item('chats.main.messages'))==0
    finally: instance.close()


def test_source_result_roundtrip_and_chat_isolation():
    class Rich(ChatPageStore):
        chat_ids=('main','other')
        def process_message(self,text):
            b=GramlotBuilder();b.root.dataSetter('.count',0)
            b.root.button('Increment').dataController(func='increment')
            return b.source
    instance,events=store(Rich)
    try:
        send(instance,'rich')
        messages=instance.data.get_item('chats.main.messages')
        restored=from_tytx(to_tytx(messages))
        assert restored.nodes[-1].value.nodes[-1].node_tag=='button'
        assert len(instance.data.get_item('chats.other.messages'))==0
        assert events[-1]['path']=='main.response'
    finally: instance.close()


def test_invalid_result_and_failure_preserve_history():
    class Invalid(ChatPageStore):
        def process_message(self,text):
            if text=='exception': raise RuntimeError('private provider detail')
            return Bag(dict(text='not approved'))
    instance,events=store(Invalid)
    try:
        for text in ('invalid','exception','   '):
            send(instance,text)
            assert instance.data.get_item('chats.main.response.accepted') is False
            assert 'private' not in instance.data.get_item('chats.main.response.error')
            assert len(instance.data.get_item('chats.main.messages'))==0
    finally: instance.close()


def test_composition_exposes_real_frames_and_customizable_regions():
    path=Path(__file__).parents[1]/'src/gramlot/collections'
    b=GramlotBuilder(collections=[json.loads((path/(name+'.json')).read_text()) for name in ('layout','chat')])
    ui=ChatPane(b.root,datapath='chat')
    ui.frame.top.h2('Chat');ui.composer.top.span('Above');ui.composer.bottom.span('Below')
    assert ui.frame.node_tag=='framePane' and ui.composer.node_tag=='framePane'
    assert ui.messages.node_tag=='chatMessages'
    assert b.to_tytx()


def test_feedback_is_emitted_during_processing_replaces_one_field_and_clears():
    class Progress(ChatPageStore):
        chat_ids = ('main', 'other')
        def process_message(self, text):
            self.feedback('Working')
            assert events[-1]['path'] == 'other.feedback'
            assert events[-1]['value'] == 'Working'
            self.feedback('Finishing')
            assert events[-1]['value'] == 'Finishing'
            if text == 'fail':
                raise RuntimeError('private')
            return text
    instance, events = store(Progress)
    try:
        send(instance, 'hello', 'other')
        feedback = [e['value'] for e in events if e.get('path') == 'other.feedback']
        assert feedback == ['Working', 'Finishing', '']
        assert len(instance.data.get_item('chats.other.messages')) == 2
        assert len(instance.data.get_item('chats.main.messages')) == 0
        send(instance, 'fail', 'other')
        assert instance.data.get_item('chats.other.feedback') == ''
        assert instance.data.get_item('chats.other.response.accepted') is False
        assert len(instance.data.get_item('chats.other.messages')) == 2
        with pytest.raises(RuntimeError, match='active'):
            instance.feedback('outside')
    finally:
        instance.close()


def test_same_text_can_be_sent_twice_but_completed_request_is_not_replayed():
    instance, _ = store()
    try:
        send(instance, 'same'); send(instance, 'same')
        assert len(instance.data.get_item('chats.main.messages')) == 4
        request = instance.data.get_item('chats.main.request')
        instance.data.set_item('chats.main.request', from_tytx(to_tytx(request)))
        assert len(instance.data.get_item('chats.main.messages')) == 4
    finally:
        instance.close()


def test_attachment_validation_and_scoped_hook():
    import base64
    from gramlot.page.chat import validate_attachments
    class Reader(ChatPageStore):
        def process_message(self, text):
            return self.request_attachments.nodes[0].value.get_item('name')
    payload = b'Hello attachment'
    files = Bag(dict(a_one=Bag(dict(name='note.txt', mediaType='text/plain', size=len(payload),
                                   data=base64.b64encode(payload).decode()))))
    instance, _ = store(Reader)
    try:
        instance.change('client', dict(path='main.request', evt='upd_value', attr={},
            value=Bag(dict(id='file', action='send', text='', attachments=files))))
        assert instance.data.get_item('chats.main.response.accepted') is True
        assert instance.data.get_item('chats.main.messages').nodes[-1].value == 'note.txt'
        assert isinstance(instance.data.get_item('chats.main.messages').nodes[0].value, type(GramlotBuilder().source))
        with pytest.raises(RuntimeError):
            _ = instance.request_attachments
        files.set_item('a_one.size', 100)
        with pytest.raises(ValueError): validate_attachments(files)
        files.set_item('a_one.size', len(payload));files.set_item('a_one.mediaType', 'application/pdf')
        with pytest.raises(ValueError): validate_attachments(files)
    finally: instance.close()


@pytest.mark.parametrize('name,media,payload', [
    ('bad.png','image/png',b'not an image'),
    ('bad.pdf','application/pdf',b'not a pdf'),
    ('bad.txt','text/plain',b'\xff\x00'),
    ('code.exe','text/plain',b'unsupported'),
])
def test_invalid_attachments_never_enter_processing(name,media,payload):
    import base64
    calls = []
    class Reader(ChatPageStore):
        def process_message(self,text):
            calls.append(text)
            return text
    instance,_=store(Reader)
    try:
        files=Bag(dict(a_one=Bag(dict(name=name,mediaType=media,size=len(payload),data=base64.b64encode(payload).decode()))))
        instance.change('client',dict(path='main.request',evt='upd_value',attr={},value=Bag(dict(id='bad',action='send',text='Read',attachments=files))))
        assert instance.data.get_item('chats.main.response.accepted') is False
        assert len(instance.data.get_item('chats.main.messages')) == 0
        assert calls == []
    finally:instance.close()
