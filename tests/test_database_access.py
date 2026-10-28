"""Host-provided database access without a core backend dependency."""
import unittest
from genro_tytx import from_tytx, to_tytx
from gramlot import Page, PageStore, endpoint
from gramlot.server import GramlotServer


class DatabaseAccessTests(unittest.IsolatedAsyncioTestCase):
    async def test_page_store_and_rpc_receive_the_host_service(self):
        class HostDatabases:
            def db(self, name=None):
                if name == 'missing':
                    raise LookupError(name)
                return name or 'default'
            def async_db(self, name=None):
                return ['async', self.db(name)]
        class HostedPage(Page):
            @endpoint
            def read(self, name=None):
                return self.db(name)
            @endpoint
            async def read_async(self):
                return self.async_db('named')
        class Store(PageStore):
            def main(self, root):
                self.data.set_item('initial', self.db('store'))
        class Server(GramlotServer):
            def resolve_page(self, path):
                return HostedPage
            def resolve_resources(self, path, cls):
                return {"css": [], "js": []}
            def resolve_page_store(self, cls):
                return Store
        server = Server()
        server._database_access = HostDatabases()
        self.addCleanup(server.close_all)
        page_id = (await server.open_page('/', owner='owner')).page_id
        store = server.page_store(page_id, owner='owner')
        self.assertEqual(store.data.get_item('initial'), 'store')
        self.assertEqual(store.async_db('store'), ['async', 'store'])
        for method, params, expected in [('read', {}, 'default'), ('read', {'name':'named'}, 'named'),
                                         ('read_async', {}, ['async','named'])]:
            result = from_tytx(await server.call(to_tytx(dict(id='r', pageId=page_id,
                contentType='data', name=method, params=params)), owner='owner'))
            self.assertEqual(result['value'], expected)
        with self.assertRaises(LookupError):
            store.db('missing')

    def test_an_unbound_host_fails_explicitly(self):
        for cls in (Page, PageStore):
            for method in ('db', 'async_db'):
                with self.subTest(cls=cls, method=method):
                    with self.assertRaisesRegex(RuntimeError, 'does not provide database access'):
                        getattr(cls(), method)()
