"""Experimental framing preserves ordinary page ownership and typed records."""
import asyncio
import json
from datetime import date
from decimal import Decimal
import pytest
from genro_tytx import from_tytx_iter, to_tytx
from gramlot import Page, endpoint
from gramlot.server import GramlotServer, InvalidRequest
from gramlot.server.gramlot_server import PageExpired, EndpointNotFound
from gramlot.server.selection_trial import SelectionTrialRows, prepare_selection_trial, selection_trial_lines

class TrialPage(Page):
    def main(self, root): root.p('Trial')
    @endpoint
    def rows(self):
        return SelectionTrialRows(iter([dict(id='r',price=Decimal('9007199254740993.25'),date=date(2026,10,29))]),100,1.25)
    @endpoint
    def ordinary(self): return 'ordinary'
    def private(self): return self.rows()

class Server(GramlotServer):
    def resolve_page(self,path): return TrialPage
    def resolve_resources(self,path,cls): return {'css':[],'js':[]}

def run(coro): return asyncio.run(coro)
def request(page_id,name='rows'):
    return to_tytx(dict(id='trial',pageId=page_id,contentType='data',name=name,params={}))

def test_typed_stream_and_ordinary_endpoint_dispatch():
    server=Server();page=run(server.open_page('/',owner='owner'))
    try:
        id,result=run(prepare_selection_trial(server,request(page.page_id),owner='owner',identity=None))
        frames=list(from_tytx_iter(json.loads(line) for line in selection_trial_lines(id,result)))
        assert frames[1]['record']['price']==Decimal('9007199254740993.25')
        assert frames[1]['record']['date']==date(2026,10,29)
        assert frames[-1]['count']==1 and frames[-1]['requested']==100
        assert frames[-1]['query_ms']==1.25
        for owner in (None,'different'):
            with pytest.raises(PageExpired):run(prepare_selection_trial(server,request(page.page_id),owner=owner,identity=None))
        with pytest.raises(EndpointNotFound):run(prepare_selection_trial(server,request(page.page_id,'private'),owner='owner',identity=None))
        with pytest.raises(InvalidRequest):run(prepare_selection_trial(server,request(page.page_id,'ordinary'),owner='owner',identity=None))
    finally: server.close_all()

def test_generator_failure_has_no_success_receipt():
    def records():
        yield dict(id='first')
        raise RuntimeError('private failure detail')
    frames=[json.loads(line) for line in selection_trial_lines('trial',SelectionTrialRows(records(),100,0))]
    assert [frame['kind'] for frame in frames]==['start','row','error']
    assert 'private failure detail' not in str(frames)
