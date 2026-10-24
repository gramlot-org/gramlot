"""Optional same-name Data Bags supplement the existing Source protocol."""
import asyncio
from decimal import Decimal
from pathlib import Path
import tempfile

from genro_bag import Bag
from genro_tytx import from_tytx, to_tytx
from gramlot.server import GramlotFileServer


def response(server, page_id, name='main', kind='source'):
    return from_tytx(asyncio.run(server.call(to_tytx(dict(
        id='r', pageId=page_id, contentType=kind, name=name, params={}
    )))))


def fixture(tmp_path):
    (tmp_path / 'foo.py').write_text('''from gramlot import Page as BasePage, endpoint, source
class Page(BasePage):
    def main(self, root):
        root.input(value="^customer.name", default="Default")
        root.dataSetter("explicit", 42)
    @source
    def fragment(self, root):
        root.p("fragment")
    @endpoint
    def answer(self):
        return 7
''')
    server = GramlotFileServer(tmp_path)
    return server, asyncio.run(server.open_page('/foo')).page_id


def test_companion_typed_attributes_freshness_and_other_data_paths(tmp_path):
    server, page_id = fixture(tmp_path)
    data = Bag()
    data.set_item('customer.name', 'Ada', caption='Customer')
    data.set_item('customer.balance', Decimal('1250.50'))
    data.set_item('customer.active', True)
    (tmp_path / 'foo_data.tytx').write_text(to_tytx(data))
    reply = response(server, page_id)
    assert 'value' in reply and 'error' not in reply
    assert isinstance(reply['data'], Bag)
    assert reply['data']['customer.balance'] == Decimal('1250.50')
    assert reply['data'].get_node('customer.name').attr['caption'] == 'Customer'
    reply['data']['customer.name'] = 'Grace'
    assert response(server, page_id)['data']['customer.name'] == 'Ada'
    assert 'data' not in response(server, page_id, 'fragment')
    assert response(server, page_id, 'answer', 'data')['value'] == 7
    assert 'data' not in response(server, page_id, 'answer', 'data')
    server.close_all()


def test_missing_invalid_and_non_bag(tmp_path):
    server, page_id = fixture(tmp_path)
    assert 'data' not in response(server, page_id)
    for text in ('not TYTX', to_tytx({'name': 'Ada'}), to_tytx(None)):
        (tmp_path / 'foo_data.tytx').write_text(text)
        reply = response(server, page_id)
        assert reply['error']['code'] == 'application_error'
        assert 'value' not in reply and 'data' not in reply
    server.close_all()


def test_no_escape_or_public_data_file(tmp_path):
    server, page_id = fixture(tmp_path)
    with tempfile.TemporaryDirectory() as folder:
        outside = Path(folder) / 'secret.tytx'
        outside.write_text(to_tytx(Bag()))
        (tmp_path / 'foo_data.tytx').symlink_to(outside)
        assert 'leaves the pages folder' in response(server, page_id)['error']['message']
        assert server.companion_file('/foo_data.tytx') is None
    server.close_all()
