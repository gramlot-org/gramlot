import asyncio

from genro_tytx import from_tytx, to_tytx
from gramlot import Page, endpoint, upload
from gramlot.server import GramlotServer, UploadTarget
from gramlot.server.upload import _UploadRegistry


class Sink(UploadTarget):
    def __init__(self, identity):
        super().__init__(max_bytes=1)
        self.identity = identity
    def write(self, chunk): pass
    def finish(self): return {"state": "completed", "result": self.identity}
    def abort(self): return {"state": "unsaved"}
    def status(self): return {"state": "pending"}


def test_page_identity_is_host_supplied_read_only_and_isolated_between_concurrent_calls():
    async def run():
        entered = 0
        ready = asyncio.Event()
        class IdentityPage(Page):
            @endpoint
            async def inspect(self, identity):
                nonlocal entered
                trusted = self.request_identity
                entered += 1
                if entered == 2:
                    ready.set()
                await ready.wait()
                return {"before": trusted, "after": self.request_identity, "client": identity}
        server = GramlotServer()
        server._pages["p"] = (server._expiry(), IdentityPage, "owner")
        async def invoke(host_identity):
            envelope = {"id":host_identity, "pageId":"p", "contentType":"data", "name":"inspect", "params":{"identity":"forged"}}
            return from_tytx(await server.call(to_tytx(envelope), owner="owner", identity=host_identity))["value"]
        a, b = await asyncio.gather(invoke("alice"), invoke("bob"))
        assert a == {"before":"alice", "after":"alice", "client":"forged"}
        assert b == {"before":"bob", "after":"bob", "client":"forged"}
        page = IdentityPage()
        page._request_identity = "alice"
        try:
            page.request_identity = "forged"
            assert False, "identity must be read-only"
        except AttributeError:
            pass
    asyncio.run(run())


def test_upload_preparation_receives_trusted_identity_and_none_is_not_a_user():
    async def run():
        class IdentityPage(Page):
            @upload
            def receive(self, metadata):
                return Sink(self.request_identity)
        server = GramlotServer()
        server._uploads = _UploadRegistry()
        server._pages["p"] = (server._expiry(), IdentityPage, "owner")
        envelope = {"id":"i", "pageId":"p", "contentType":"upload", "name":"prepare",
                    "params":{"operation":"receive", "metadata":{"name":"x", "size":0, "mediaType":"", "context":{}, "fields":{"identity":"forged"}}}}
        grant = from_tytx(await server.call(to_tytx(envelope), owner="owner", identity="alice"))["value"]
        transfer = server._upload_admit(page_id="p", owner="owner", identity="alice", transfer_id=grant["transferId"], token=grant["authorization"])
        assert (await transfer.finish())["result"] == "alice"
        grant = from_tytx(await server.call(to_tytx(envelope), owner="owner"))["value"]
        transfer = server._upload_admit(page_id="p", owner="owner", identity=None, transfer_id=grant["transferId"], token=grant["authorization"])
        assert (await transfer.finish())["result"] is None
    asyncio.run(run())
