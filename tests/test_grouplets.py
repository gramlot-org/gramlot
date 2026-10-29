"""Qualify generated grouplet metadata and Python Source dispatch, without a host dependency."""
import json
from pathlib import Path
import unittest
import pytest

from genro_tytx import from_tytx, to_tytx
from gramlot import GramlotBuilder
from gramlot.collections.grouplets import mygramlot
from gramlot.server import GramlotFileServer

ROOT = Path(__file__).resolve().parents[1]


class FixtureServer(GramlotFileServer):
    def collection_url(self, collection, path):
        return f"/fixtures/{collection.name}/{path}"


class GroupletTests(unittest.IsolatedAsyncioTestCase):
    def test_prepared_metadata_is_identical_and_optional(self):
        content = mygramlot.verify()
        expected = json.loads((ROOT / 'src/gramlot/collections/grouplets.json').read_text())
        self.assertEqual(json.loads(content[mygramlot.grammar]), expected)
        self.assertEqual(mygramlot.dependencies, ())
        self.assertEqual(set(expected['elements']), {'grouplet', 'groupletCard'})
        with self.assertRaises(AttributeError):
            GramlotBuilder().root.grouplet(remote='content')
        builder = GramlotBuilder(collections=[expected])
        node = builder.root.grouplet(datapath='customer', remote='details.content', remote_id='^.id')
        self.assertEqual(node.attr['remote'], 'details.content')
        with self.assertRaises((TypeError, ValueError)):
            builder.root.grouplet(remote=42)

    def test_card_authoring_uses_the_shared_boolean_and_pointer_contract(self):
        builder = GramlotBuilder(collections=[json.loads(mygramlot.verify()[mygramlot.grammar])])
        card = builder.root.groupletCard(title='^.name', datapath='customer',
            collapsible=True, collapsed='^.ui.closed', checkbox='^.ui.checked',
            checkboxLabel='Reviewed', doc='^.guide', chromeSide='left', delitem='^.canClear', remote='details', remote_revision='^revision')
        self.assertEqual(card.attr['datapath'], 'customer')
        self.assertEqual(card.attr['collapsed'], '^.ui.closed')
        self.assertEqual(card.attr['checkboxLabel'], 'Reviewed')
        self.assertTrue(card.attr['collapsible'])
        self.assertEqual(card.attr['delitem'], '^.canClear')
        self.assertEqual(card.attr['doc'], '^.guide')
        entry = card.menu().menuline(caption='Contact', action="this.SET('.status', 'Call prepared')")
        self.assertEqual(entry.attr['caption'], 'Contact')

    async def test_card_page_dispatches_remote_source_with_the_prepared_collection(self):
        server = FixtureServer(ROOT / 'tests/fixtures/grouplets')
        self.addCleanup(server.close_all)
        page = await server.open_page('/card')
        for name in ('main', 'address_fields'):
            result = from_tytx(await server.call(to_tytx(dict(id='r', pageId=page.page_id,
                contentType='source', name=name, params={}))))
            self.assertNotIn('error', result)
            if name == 'main':
                card = result['value'].nodes[-1]
                self.assertEqual(card.node_tag, 'groupletCard')
                self.assertEqual(card.attr['remote'], 'address_fields')
                self.assertEqual(card.attr['collapsed'], '^.ui.closed')
            else:
                self.assertEqual(result['value'].nodes[0].attr['value'], '^.city')

    async def test_page_activation_and_same_named_fragment_methods(self):
        server = FixtureServer(ROOT / 'tests/fixtures/grouplets')
        self.addCleanup(server.close_all)
        page = await server.open_page('/')
        self.assertIn(mygramlot.build_id, page.html)
        self.assertIn('/fixtures/grouplets/assets/index.js', page.html)

        async def call(name, params=None):
            text = await server.call(to_tytx(dict(id='r', pageId=page.page_id,
                contentType='source', name=name, params=params or {})))
            return from_tytx(text)

        main = await call('main')
        self.assertNotIn('error', main)
        nodes = main['value'].nodes
        fragments = [n for n in nodes if n.attr.get('remote')]
        self.assertEqual([n.attr['remote'] for n in fragments], ['left.content', 'right.content'])
        self.assertEqual([n.attr['datapath'] for n in fragments], ['left', 'right'])
        for side, suffix in [('left', '!'), ('right', '?')]:
            result = await call(f'{side}.content', {'suffix': suffix})
            self.assertNotIn('error', result)
            self.assertEqual(result['value'].nodes[0].value, side.title() + suffix)
            self.assertEqual(result['value'].nodes[1].attr['value'], '^.name')
        denied = await call('left.restricted')
        missing = await call('left.missing')
        self.assertIn('error', denied)
        self.assertIn('error', missing)


@pytest.mark.parametrize('name', ['collapsed', 'collapsible', 'checkbox', 'delitem'])
@pytest.mark.xfail(strict=True, reason='genro-builders Python drops Regex validation inside a union; see PORT-0025 card receipt')
def test_python_builder_rejects_legacy_card_state_strings(name):
    """Keep the upstream authoring-validation gap visible; browser rejection is tested in JS."""
    builder = GramlotBuilder(collections=[json.loads(mygramlot.verify()[mygramlot.grammar])])
    with pytest.raises((TypeError, ValueError)):
        builder.root.groupletCard(**{name: 'closed'})
