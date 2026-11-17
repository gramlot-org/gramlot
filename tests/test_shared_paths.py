from genro_bag import Bag
from genro_tytx import from_tytx
from gramlot import PageStore
import pytest


def store():
    result = PageStore()
    result.start()
    return result


def change(page, path, value):
    page.change('client', dict(path=path, evt='upd_value', value=value, attr={}))


def test_two_pages_snapshot_deltas_and_typed_source():
    shared, first, second = store(), store(), store()
    shared.data.set_item('room.messages', Bag(dict(first='Hello')))
    received=[]
    for page in (first,second):
        page.bind_path('chat.messages',shared,'room.messages',authorize=lambda:True)
        page.subscribe('client','chat',lambda wire:received.append(from_tytx(wire)))
    shared.data.set_item('room.messages.second','World')
    assert first.data.get_item('chat.messages.second') == second.data.get_item('chat.messages.second') == 'World'
    assert any(m['op']=='change' and m['path']=='messages.second' for m in received)
    builder=shared.builder.__class__()
    builder.root.div('Native Source').input(type='number', value='^.amount')
    shared.data.set_item('room.messages.panel',builder.source)
    assert type(first.data.get_item('chat.messages.panel')) is type(builder.source)
    first.close()
    shared.data.set_item('room.messages.third','Still open')
    assert second.data.get_item('chat.messages.third') == 'Still open'
    assert not shared._closed
    second.close();shared.close()


def test_readonly_and_ancestor_replacements_cannot_bypass_access():
    shared,page=store(),store()
    shared.data.set_item('messages',Bag(dict(a='original')))
    page.bind_path('chat.messages',shared,'messages',authorize=lambda:True)
    page.subscribe('client','chat',lambda _:None)
    for path in ('messages.a','messages',''):
        with pytest.raises(PermissionError):change(page,path,'forged')
    assert shared.data.get_item('messages.a')=='original'
    page.close();shared.close()


def test_writable_path_and_other_room_are_isolated():
    shared,other,first,second=store(),store(),store(),store()
    shared.data.set_item('state',Bag(dict(value=1)))
    other.data.set_item('state',Bag(dict(value=10)))
    first.bind_path('edit',shared,'state',authorize=lambda:True,writable=True)
    second.bind_path('edit',other,'state',authorize=lambda:True,writable=True)
    first.subscribe('client','edit',lambda _:None)
    change(first,'value',2)
    assert shared.data.get_item('state.value')==first.data.get_item('edit.value')==2
    assert second.data.get_item('edit.value')==10
    for x in (first,second,shared,other):x.close()


def test_revocation_clears_local_copy_and_shared_close_detaches():
    shared,page,allowed=store(),store(),[True]
    shared.data.set_item('messages',Bag(dict(a='before')))
    page.bind_path('chat',shared,'messages',authorize=lambda:allowed[0])
    allowed[0]=False
    shared.data.set_item('messages.a','after')
    assert page.data.get_item('chat') is None and not page._bound_paths
    allowed[0]=True
    page.bind_path('chat',shared,'messages',authorize=lambda:allowed[0])
    shared.close()
    assert page.data.get_item('chat') is None and not page._bound_paths
    page.close()


def test_access_denied_overlap_and_cycles():
    first,second=store(),store()
    with pytest.raises(PermissionError):first.bind_path('a',second,'b',authorize=lambda:False)
    first.bind_path('a',second,'b',authorize=lambda:True)
    with pytest.raises(ValueError):first.bind_path('a.child',second,'other',authorize=lambda:True)
    with pytest.raises(ValueError):second.bind_path('b',first,'a',authorize=lambda:True)
    first.close();second.close()


def test_server_registry_owns_shared_store_independently_of_pages():
    from concurrent.futures import ThreadPoolExecutor
    from gramlot.server import GramlotServer
    server=GramlotServer(css_theme=False)
    created=[]
    def factory():
        created.append(True)
        return PageStore()
    with ThreadPoolExecutor(4) as pool:
        stores=list(pool.map(lambda _:server.shared_store(('app','room'),factory),range(8)))
    assert len(created)==1 and all(s is stores[0] for s in stores)
    assert server.shared_store(('app','other'),factory) is not stores[0]
    with pytest.raises(ValueError):server.shared_store('unscoped',factory)
    page=store();page.bind_path('view',stores[0],'messages',authorize=lambda:True)
    server.close_shared_store(('app','room'))
    assert stores[0]._closed and not page.is_path_bound('view')
    page.close();server.close_all()
