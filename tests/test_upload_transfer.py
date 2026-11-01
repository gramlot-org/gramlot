import asyncio

import pytest

from gramlot.server import UploadTarget
from gramlot.server.upload import _Transfer


class Sink(UploadTarget):
    def __init__(self, *, fail_finish=False):
        super().__init__(max_bytes=10)
        self.data = b""
        self.fail_finish = fail_finish
        self.outcome = {"state": "pending"}
        self.aborts = 0

    def write(self, chunk):
        self.data += chunk

    def finish(self):
        self.outcome = {"state": "completed", "result": self.data.decode()}
        if self.fail_finish:
            raise ConnectionError("result lost after commit")
        return self.outcome

    def abort(self):
        self.aborts += 1
        if self.outcome["state"] != "completed":
            self.outcome = {"state": "unsaved"}
        return self.outcome

    def status(self):
        return self.outcome


def test_complete_and_cancel_preserves_committed_result():
    async def run():
        sink = Sink()
        transfer = _Transfer(sink, 3)
        await transfer.write(b"ab")
        await transfer.write(b"c")
        assert await transfer.finish() == {"state": "completed", "result": "abc"}
        assert await transfer.abort() == {"state": "completed", "result": "abc"}
        assert sink.aborts == 0
        with pytest.raises(RuntimeError):
            await transfer.write(b"")
    asyncio.run(run())


def test_uncertain_commit_is_reconciled_without_retry():
    async def run():
        sink = Sink(fail_finish=True)
        transfer = _Transfer(sink, 1)
        await transfer.write(b"x")
        with pytest.raises(ConnectionError):
            await transfer.finish()
        with pytest.raises(RuntimeError):
            await transfer.finish()
        assert await transfer.status() == {"state": "completed", "result": "x"}
        assert await transfer.abort() == {"state": "completed", "result": "x"}
    asyncio.run(run())


def test_declared_size_is_enforced_and_abort_cleans_partial():
    async def run():
        sink = Sink()
        with pytest.raises(ValueError):
            _Transfer(sink, 11)
        transfer = _Transfer(sink, 2)
        await transfer.write(b"a")
        with pytest.raises(ValueError):
            await transfer.write(b"bc")
        with pytest.raises(ValueError):
            await transfer.finish()
        assert await transfer.abort() == {"state": "unsaved"}
        assert sink.aborts == 1
    asyncio.run(run())


def test_pending_reconciliation_does_not_reopen_uncertain_transfer():
    class Interrupted(Sink):
        def finish(self):
            raise ConnectionError("unknown")

    async def run():
        transfer = _Transfer(Interrupted(), 0)
        with pytest.raises(ConnectionError):
            await transfer.finish()
        assert await transfer.status() == {"state": "pending"}
        with pytest.raises(RuntimeError):
            await transfer.finish()
        with pytest.raises(RuntimeError):
            await transfer.write(b"")
    asyncio.run(run())


def test_finish_and_abort_do_not_run_concurrently():
    async def run():
        started = asyncio.Event()
        proceed = asyncio.Event()

        class Slow(Sink):
            async def finish(self):
                started.set()
                await proceed.wait()
                self.outcome = {"state": "completed", "result": "saved"}
                return self.outcome

        sink = Slow()
        transfer = _Transfer(sink, 0)
        finishing = asyncio.create_task(transfer.finish())
        await started.wait()
        aborting = asyncio.create_task(transfer.abort())
        await asyncio.sleep(0)
        assert not aborting.done()
        proceed.set()
        assert await finishing == {"state": "completed", "result": "saved"}
        assert await aborting == {"state": "completed", "result": "saved"}
        assert sink.aborts == 0
    asyncio.run(run())


def test_invalid_result_does_not_enable_a_second_finish():
    class Invalid(Sink):
        def finish(self):
            return {"state": "completed"}

    async def run():
        transfer = _Transfer(Invalid(), 0)
        with pytest.raises(ValueError, match="requires a result"):
            await transfer.finish()
        with pytest.raises(RuntimeError):
            await transfer.finish()
    asyncio.run(run())


def test_registry_grant_is_bound_one_use_and_expiry_cleans_up():
    from gramlot.server.upload import _UploadRegistry

    async def run():
        clock = [0]
        registry = _UploadRegistry(capacity=1, grant_ttl=5, retention=30, clock=lambda: clock[0])
        sink = Sink()
        grant = await registry.prepare(page_id="page", owner="alice", operation="import", rule=None, target=sink, size=0)
        with pytest.raises(PermissionError):
            registry.admit(grant["transferId"], "page", "bob", grant["authorization"])
        with pytest.raises(PermissionError):
            registry.admit(grant["transferId"], "page", "alice", "wrong")
        registry.admit(grant["transferId"], "page", "alice", grant["authorization"])
        with pytest.raises(PermissionError):
            registry.admit(grant["transferId"], "page", "alice", grant["authorization"])
        clock[0] = 31
        await registry.expire()
        assert sink.aborts == 1
        with pytest.raises(PermissionError):
            registry.record(grant["transferId"], "page", "alice")
    asyncio.run(run())


def test_registry_capacity_and_unused_grant_cleanup():
    from gramlot.server.upload import _UploadRegistry

    async def run():
        clock = [0]
        registry = _UploadRegistry(capacity=1, grant_ttl=5, retention=30, clock=lambda: clock[0])
        sink = Sink()
        args = dict(page_id="p", owner="o", operation="import", rule=None, size=0)
        await registry.prepare(target=sink, **args)
        with pytest.raises(RuntimeError, match="capacity"):
            await registry.prepare(target=Sink(), **args)
        clock[0] = 5
        await registry.expire()
        assert sink.aborts == 1
        await registry.prepare(target=Sink(), **args)
    asyncio.run(run())


def test_registry_keeps_uncertain_cleanup_and_refuses_new_admission():
    from gramlot.server.upload import _UploadRegistry

    class Unknown(Sink):
        def abort(self):
            return {"state": "uncertain"}

    async def run():
        now = [0]
        registry = _UploadRegistry(capacity=1, grant_ttl=5, retention=30, clock=lambda: now[0])
        args = dict(page_id="p", owner="o", operation="import", rule=None, size=0)
        grant = await registry.prepare(target=Unknown(), **args)
        now[0] = 5
        await registry.expire()
        with pytest.raises(PermissionError):
            registry.admit(grant["transferId"], "p", "o", grant["authorization"])
        assert registry.record(grant["transferId"], "p", "o")
        with pytest.raises(RuntimeError, match="capacity"):
            await registry.prepare(target=Sink(), **args)
    asyncio.run(run())


def test_cancel_revokes_unused_grant():
    from gramlot.server.upload import _UploadRegistry

    async def run():
        registry = _UploadRegistry()
        grant = await registry.prepare(page_id='p', owner='a', operation='x', rule=None, target=Sink(), size=0)
        assert await registry.cancel(grant['transferId'], 'p', 'a') == {'state':'unsaved'}
        with pytest.raises(PermissionError):
            registry.admit(grant['transferId'], 'p', 'a', grant['authorization'])
    asyncio.run(run())


def test_completed_outcome_retention_starts_at_completion():
    from gramlot.server.upload import _UploadRegistry

    async def run():
        clock = [0]
        registry = _UploadRegistry(grant_ttl=50, retention=30, clock=lambda: clock[0])
        grant = await registry.prepare(page_id="page", owner="owner", operation="save", rule=None, target=Sink(), size=0)
        transfer = registry.admit(grant["transferId"], "page", "owner", grant["authorization"])
        clock[0] = 29
        await transfer.finish()
        clock[0] = 31
        await registry.expire()
        assert await registry.record(grant["transferId"], "page", "owner")["transfer"].status() == {"state": "completed", "result": ""}
        clock[0] = 60
        await registry.expire()
        with pytest.raises(PermissionError):
            registry.record(grant["transferId"], "page", "owner")
    asyncio.run(run())


def test_completion_racing_with_expiry_retains_outcome():
    from gramlot.server.upload import _UploadRegistry

    async def run():
        clock = [0]
        started, proceed = asyncio.Event(), asyncio.Event()

        class Slow(Sink):
            async def finish(self):
                started.set()
                await proceed.wait()
                return super().finish()

        registry = _UploadRegistry(grant_ttl=50, retention=30, clock=lambda: clock[0])
        grant = await registry.prepare(page_id='page', owner='owner', operation='save', rule=None, target=Slow(), size=0)
        transfer = registry.admit(grant['transferId'], 'page', 'owner', grant['authorization'])
        finishing = asyncio.create_task(transfer.finish())
        await started.wait()
        clock[0] = 31
        expiring = asyncio.create_task(registry.expire())
        await asyncio.sleep(0)
        proceed.set()
        await asyncio.gather(finishing, expiring)
        assert await registry.record(grant['transferId'], 'page', 'owner')['transfer'].status() == {'state':'completed', 'result':''}
    asyncio.run(run())


def test_uncertain_finish_retains_recovery_window():
    from gramlot.server.upload import _UploadRegistry

    async def run():
        clock = [0]
        registry = _UploadRegistry(grant_ttl=50, retention=30, clock=lambda: clock[0])
        grant = await registry.prepare(page_id='page', owner='owner', operation='save', rule=None, target=Sink(fail_finish=True), size=0)
        transfer = registry.admit(grant['transferId'], 'page', 'owner', grant['authorization'])
        clock[0] = 29
        with pytest.raises(ConnectionError):
            await transfer.finish()
        clock[0] = 31
        await registry.expire()
        assert await registry.record(grant['transferId'], 'page', 'owner')['transfer'].status() == {'state':'completed', 'result':''}
    asyncio.run(run())


def test_expiry_cleanup_failure_does_not_block_other_transfers():
    from gramlot.server.upload import _UploadRegistry

    class Broken(Sink):
        def abort(self):
            raise OSError('cleanup failed')

    async def run():
        clock = [0]
        registry = _UploadRegistry(capacity=2, grant_ttl=5, retention=30, clock=lambda: clock[0])
        args = dict(page_id='page', owner='owner', operation='save', rule=None, size=0)
        failed = await registry.prepare(target=Broken(), **args)
        other = Sink()
        await registry.prepare(target=other, **args)
        clock[0] = 5
        await registry.expire()
        assert other.aborts == 1
        assert registry.record(failed['transferId'], 'page', 'owner')
        await registry.prepare(target=Sink(), **args)
    asyncio.run(run())
