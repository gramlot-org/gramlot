import asyncio
from gramlot import Page, IndexPage, GramlotBuilder
from gramlot.server import GramlotServer, PageNotFound
import pytest

class Root(IndexPage):
    installable = True
    app_icon = '/icon.png'
    navigation = ({'key':'work','title':'Work','children':[{'key':'one','title':'One','url':'one'}]},)

class Server(GramlotServer):
    def resolve_page(self,path): return Root
    def resolve_resources(self,path,cls): return {'css':[], 'js':[]}

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

def test_source_custom_footer():
    class Custom(Root):
        def footer(self,pane):pane.p('Custom footer')
    b=GramlotBuilder();Custom().main(b.source)
    text=b.render()
    assert 'Custom footer' in text
    assert 'index-theme' not in text
    assert 'frame-one' in text
