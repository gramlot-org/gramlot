import asyncio
from gramlot import Page, FramePage, IndexPage, GramlotBuilder
from genro_bag import Bag
from importlib.resources import files
import json
import re
from gramlot.server import GramlotServer, PageNotFound
import pytest

class Root(IndexPage):
    installable = True
    app_icon = '/icon.png'
    navigation = Bag()

class Server(GramlotServer):
    def resolve_page(self,path): return Root
    def resolve_resources(self,path,cls): return {'css':[], 'js':[]}

def css_links(server):
    return json.loads(re.search(r'"css":(\[.*?\])', asyncio.run(server.open_page('/')).html).group(1))

def test_the_frame_inherits_the_host_theme_without_a_hardcoded_index_theme():
    class Listing(Server):
        def resolve_resources(self,path,cls): return {'css':list(cls.css), 'js':[]}
    assert IndexPage.css == ()
    assert css_links(Listing()) == ['/themes/gramlot-base/theme.css']
    assert css_links(Listing(css_theme='mimi')) == ['/themes/mimi/theme.css']
    assert css_links(Listing(css_theme=False)) == []

def test_manifest_mount_and_root_only():
    server=Server()
    manifest=asyncio.run(server.page_manifest(prefix='/demo'))
    assert manifest['icons'][0]['src']=='/demo/icon.png'
    assert manifest['scope']=='/demo/'
    assert not server._pages
    assert 'href="/demo/app.webmanifest"' in asyncio.run(server.open_page('/',prefix='/demo')).html
    assert 'rel="manifest"' not in asyncio.run(server.open_page('/child')).html

def test_override_and_disabled():
    class Custom(Root):
        def manifest(self,*,base_url='./'):
            return {**super().manifest(base_url=base_url),'description':'custom'}
    server=Server();server.resolve_page=lambda path:Custom
    assert asyncio.run(server.page_manifest())['description']=='custom'
    server.resolve_page=lambda path:Page
    with pytest.raises(PageNotFound):asyncio.run(server.page_manifest())

def test_source_custom_bottom():
    class Custom(Root):
        def bottom(self, pane):
            pane.set_attr({"height": "100px", "drawer": "close"})
            pane.p('Custom bottom')
    collections = [json.loads(files('gramlot').joinpath(f'collections/{name}.json').read_text()) for name in ('layout', 'tree')]
    b = GramlotBuilder(collections=collections)
    assert Custom().main(b.source) is None
    text = b.render()
    assert 'Custom bottom' in text
    assert 'index-theme' not in text
    assert 'iframe' not in text


def test_frame_regions_inherit_and_omit_undefined_hooks():
    class Parent(FramePage):
        def top(self, pane): pane.p('Title')
    class Child(Parent):
        def right(self, pane): pane.p('Tools')
    collections = [json.loads(files('gramlot').joinpath('collections/layout.json').read_text())]
    b = GramlotBuilder(collections=collections)
    Child().main(b.source)
    shell = b.source.nodes[0]
    assert [n.attr['region'] for n in shell.value.get_node('frame').value.nodes] == ['top', 'right', 'center']


def test_panel_receives_selected_node():
    selection = Bag(); selection.set_item('one', None, url='/one', title='One')
    b = GramlotBuilder(); Root().index_panel(b.source, selection)
    assert b.source.nodes[0].attr['src'] == '/one'
