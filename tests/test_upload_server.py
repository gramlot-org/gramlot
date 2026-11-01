import asyncio

from genro_tytx import from_tytx, to_tytx
from gramlot import Page, upload
from gramlot.server import GramlotServer, UploadTarget
from gramlot.server.upload import _UploadRegistry


class Memory(UploadTarget):
    def __init__(self):
        super().__init__(max_bytes=10)
        self.data = b""
        self.outcome = {"state": "pending"}

    def write(self, chunk): self.data += chunk
    def finish(self):
        self.outcome = {"state": "completed", "result": self.data.decode()}
        return self.outcome
    def abort(self):
        self.outcome = {"state": "unsaved"}
        return self.outcome
    def status(self): return self.outcome


class UploadPage(Page):
    @upload(auth="editor")
    def import_source(self, metadata): return Memory()


class Server(GramlotServer):
    def evaluate_auth(self, rule, *, owner, identity):
        return None if rule is None or identity == "editor" else "not_authorized"


def test_upload_control_requires_page_owner_and_rechecks_authorization():
    async def run():
        server = Server()
        server._uploads = _UploadRegistry()
        server._pages["p"] = (server._expiry(), UploadPage, "alice")
        envelope = {"id": "id", "pageId": "p", "contentType": "upload", "name": "prepare",
                    "params": {"operation": "import_source", "metadata": {"name": "a", "size": 2, "mediaType": "text/plain", "context": {}, "fields": {}}}}
        async def call(owner, identity):
            return from_tytx(await server.call(to_tytx(envelope), owner=owner, identity=identity))
        assert (await call("bob", "editor"))["error"]["code"] == "page_expired"
        assert (await call("alice", None))["error"]["code"] == "not_authorized"
        grant = (await call("alice", "editor"))["value"]
        from gramlot.server import NotAuthorized
        import pytest
        with pytest.raises(NotAuthorized):
            server._upload_admit(page_id="p", owner="alice", identity=None, transfer_id=grant["transferId"], token=grant["authorization"])
        transfer = server._upload_admit(page_id="p", owner="alice", identity="editor", transfer_id=grant["transferId"], token=grant["authorization"])
        await transfer.write(b"ok")
        assert await transfer.finish() == {"state": "completed", "result": "ok"}
        envelope.update(name="status", params={"transferId": grant["transferId"]})
        assert (await call("alice", "editor"))["value"] == {"state": "completed", "result": "ok"}
    asyncio.run(run())


def test_page_close_during_preparation_aborts_target():
    async def run():
        started, proceed = asyncio.Event(), asyncio.Event()
        sink = Memory()
        class SlowPage(Page):
            @upload
            async def prepare_slow(self, metadata):
                started.set()
                await proceed.wait()
                return sink
        server = Server()
        server._uploads = _UploadRegistry()
        server._pages['p'] = (server._expiry(), SlowPage, 'alice')
        request = {'id':'id', 'pageId':'p', 'contentType':'upload', 'name':'prepare',
                   'params':{'operation':'prepare_slow','metadata':{'name':'a','size':1,'mediaType':'','context':{},'fields':{}}}}
        task = asyncio.create_task(server.call(to_tytx(request), owner='alice'))
        await started.wait()
        server.close_page('p', owner='alice')
        proceed.set()
        response = from_tytx(await task)
        assert response['error']['code'] == 'page_expired'
        assert sink.outcome == {'state':'unsaved'}
        assert not server._uploads._records
    asyncio.run(run())


def test_prepare_delivers_fields_and_rejects_old_or_invalid_metadata():
    async def run():
        received = []
        class MetadataPage(Page):
            @upload
            def import_source(self, metadata):
                received.append(metadata)
                return Memory()
        server = Server()
        server._uploads = _UploadRegistry()
        server._pages["p"] = (server._expiry(), MetadataPage, "alice")
        metadata = {"name":"a", "size":2, "mediaType":"text/plain",
                    "context":{"recordId":"record-1"}, "fields":{"description":"first", "nested":{"count":2}}}
        request = {"id":"id", "pageId":"p", "contentType":"upload", "name":"prepare",
                   "params":{"operation":"import_source", "metadata":metadata}}
        async def call():
            return from_tytx(await server.call(to_tytx(request), owner="alice"))
        assert "value" in await call()
        assert received == [metadata]
        del metadata["fields"]
        assert "error" in await call()
        metadata["fields"] = "invalid"
        assert "error" in await call()
        metadata["fields"] = {}
        metadata["context"] = "invalid"
        assert "error" in await call()
        del metadata["context"]
        assert "error" in await call()
        assert len(received) == 1
    asyncio.run(run())
