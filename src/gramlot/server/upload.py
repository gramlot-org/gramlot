"""Application-provided destination for an authorized upload operation.

The target owns storage and cleanup. It does not grant network access: the
server must authorize and coordinate each invocation.
"""

from abc import ABC, abstractmethod


class UploadTarget(ABC):
    """A bounded, application-owned destination for one upload.

    ``write`` receives byte chunks. ``finish``, ``abort`` and ``status`` report
    the authoritative outcome; their return values and any failure to report an
    outcome must not be interpreted as a successful save by the caller.
    Methods may return awaitables.
    """

    def __init__(self, *, max_bytes):
        if type(max_bytes) is not int or max_bytes < 0:
            raise ValueError("max_bytes must be a nonnegative integer")
        self.max_bytes = max_bytes

    @abstractmethod
    def write(self, chunk):
        """Write an incremental byte chunk."""

    @abstractmethod
    def finish(self):
        """Finish the application operation and return its outcome."""

    @abstractmethod
    def abort(self):
        """Clean up an uncommitted operation and return its outcome."""

    @abstractmethod
    def status(self):
        """Return the authoritative outcome for reconciliation."""


async def _invoke(function, *args):
    """Invoke a target method, accepting synchronous and async implementations."""
    import inspect

    result = function(*args)
    return await result if inspect.isawaitable(result) else result


def _outcome(value):
    """Check the sink's authoritative result without changing its meaning."""
    from genro_tytx import to_tytx

    if not isinstance(value, dict) or value.get("state") not in {"completed", "unsaved", "pending", "uncertain"}:
        raise ValueError("Invalid upload outcome")
    if value["state"] == "completed":
        if set(value) != {"state", "result"}:
            raise ValueError("Completed upload requires a result")
        to_tytx(value["result"])
    elif set(value) != {"state"}:
        raise ValueError("Upload outcome has unexpected fields")
    return value.copy()


class _Transfer:
    """Serialize operations on one target and retain its authoritative result.

    Admission, owner verification, expiry and registry capacity belong to the
    server that owns this object. A target failure never proves it is unsaved.
    """

    def __init__(self, target, size, on_outcome=None):
        import asyncio

        if not isinstance(target, UploadTarget):
            raise TypeError("Upload operation must return an UploadTarget")
        if type(size) is not int or size < 0 or size > target.max_bytes:
            raise ValueError("Upload size is invalid or exceeds the target limit")
        self._target = target
        self._on_outcome = on_outcome
        self._size = size
        self._received = 0
        self._sealed = False
        self._state = "pending"
        self._result = None
        self._lock = asyncio.Lock()

    def _snapshot(self):
        if self._state == "completed":
            return {"state": self._state, "result": self._result}
        return {"state": self._state}

    def _record(self, value):
        result = _outcome(value)
        self._state = result["state"]
        self._result = result.get("result")
        if self._state == "completed" and self._on_outcome is not None:
            self._on_outcome()
        return self._snapshot()

    async def write(self, chunk):
        if not isinstance(chunk, bytes):
            raise TypeError("Upload chunks must be bytes")
        async with self._lock:
            if self._state != "pending" or self._sealed:
                raise RuntimeError("Upload is not writable")
            if self._received + len(chunk) > self._size:
                raise ValueError("Received bytes exceed the declared upload size")
            try:
                await _invoke(self._target.write, chunk)
            except BaseException:
                self._state = "uncertain"
                self._sealed = True
                if self._on_outcome is not None:
                    self._on_outcome()
                raise
            self._received += len(chunk)

    async def finish(self):
        async with self._lock:
            if self._state != "pending" or self._sealed:
                raise RuntimeError("Upload cannot be finished")
            if self._received != self._size:
                raise ValueError("Received bytes do not match the declared upload size")
            self._sealed = True
            try:
                return self._record(await _invoke(self._target.finish))
            except BaseException:
                self._state = "uncertain"
                if self._on_outcome is not None:
                    self._on_outcome()
                raise

    async def abort(self):
        async with self._lock:
            if self._state in {"completed", "unsaved"}:
                return self._snapshot()
            self._sealed = True
            try:
                return self._record(await _invoke(self._target.abort))
            except BaseException:
                self._state = "uncertain"
                raise

    async def status(self):
        async with self._lock:
            if self._state in {"completed", "unsaved"}:
                return self._snapshot()
            try:
                return self._record(await _invoke(self._target.status))
            except BaseException:
                self._state = "uncertain"
                raise


class _UploadRegistry:
    """Process-local transfer registry; caller performs page and rule checks.

    Grants are single-use and deliberately separate from transfer identifiers.
    Callers must run ``expire`` and ``close_page`` on their lifecycle boundaries.
    """

    def __init__(self, *, capacity=1000, grant_ttl=300, retention=1800, clock=None):
        import time
        import asyncio

        if type(capacity) is not int or capacity < 1:
            raise ValueError("capacity must be a positive integer")
        if grant_ttl <= 0 or retention <= 0:
            raise ValueError("upload timeouts must be positive")
        self._capacity = capacity
        self._grant_ttl = grant_ttl
        self._retention = retention
        self._clock = clock or time.monotonic
        self._records = {}
        self._lock = asyncio.Lock()

    async def prepare(self, *, page_id, owner, operation, rule, target, size):
        import secrets

        async with self._lock:
            await self._expire_unlocked()
            if len(self._records) >= self._capacity:
                raise RuntimeError("Upload registry capacity reached")
            transfer_id = secrets.token_urlsafe(24)
            def retain_outcome():
                record = self._records.get(transfer_id)
                if record is not None:
                    record["expiry"] = self._clock() + self._retention
            transfer = _Transfer(target, size, on_outcome=retain_outcome)
            token = secrets.token_urlsafe(32)
            now = self._clock()
            self._records[transfer_id] = {
                "page_id": page_id, "owner": owner, "operation": operation,
                "rule": rule, "token": token, "grant_expiry": now + self._grant_ttl,
                "expiry": now + self._retention, "started": False, "transfer": transfer,
            }
            return {"transferId": transfer_id, "authorization": token}

    def _record(self, transfer_id, page_id, owner):
        record = self._records.get(transfer_id)
        if record is None or record["page_id"] != page_id or record["owner"] != owner:
            raise PermissionError("Unknown or unauthorized upload")
        return record

    def record(self, transfer_id, page_id, owner):
        return self._record(transfer_id, page_id, owner)

    def admit(self, transfer_id, page_id, owner, token):
        import secrets

        record = self._record(transfer_id, page_id, owner)
        if (record["started"] or self._clock() >= record["grant_expiry"]
                or not isinstance(token, str) or not secrets.compare_digest(record["token"], token)):
            raise PermissionError("Upload authorization is invalid or expired")
        record["started"] = True
        record["token"] = None
        record["expiry"] = self._clock() + self._retention
        return record["transfer"]

    async def cancel(self, transfer_id, page_id, owner):
        record = self._record(transfer_id, page_id, owner)
        record["started"] = True
        record["token"] = None
        return await record["transfer"].abort()

    def touch(self, transfer_id, page_id, owner):
        self._record(transfer_id, page_id, owner)["expiry"] = self._clock() + self._retention

    async def expire(self):
        async with self._lock:
            await self._expire_unlocked()

    async def _expire_unlocked(self):
        now = self._clock()
        expired = [key for key, value in self._records.items()
                   if now >= value["expiry"] or not value["started"] and now >= value["grant_expiry"]]
        for key in expired:
            record = self._records[key]
            expiry = record["expiry"]
            try:
                outcome = await record["transfer"].abort()
            except Exception:
                # Keep this outcome uncertain, without blocking unrelated transfers.
                continue
            if outcome["state"] in {"completed", "unsaved"} and record["expiry"] == expiry:
                del self._records[key]

    async def close_page(self, page_id, owner):
        async with self._lock:
            keys = [key for key, value in self._records.items()
                    if value["page_id"] == page_id and value["owner"] == owner]
            for key in keys:
                self._records[key]["started"] = True
                self._records[key]["token"] = None
            for key in keys:
                outcome = await self._records[key]["transfer"].abort()
                if outcome["state"] in {"completed", "unsaved"}:
                    del self._records[key]

    async def close_all(self):
        for page_id, owner in {(r["page_id"], r["owner"]) for r in self._records.values()}:
            await self.close_page(page_id, owner)
