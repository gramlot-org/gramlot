"""Terminal sessions: binary frames between a ``terminal`` component and a PageStore method (#87).

A frame is one binary WebSocket message. Its first byte is the channel, the rest is the payload:

- ``INPUT`` (0), browser to server: the bytes of the keys.
- ``OUTPUT`` (1), server to browser: the bytes the terminal writes.
- ``RESIZE`` (4), browser to server: JSON ``{"Width": columns, "Height": rows}``.
- ``ACK`` (5), browser to server: a 32-bit big-endian count of output bytes the terminal has written.

Channels 0, 1 and 4 and the resize JSON follow the Kubernetes exec protocol. ``ACK`` is Gramlot's: the
session stops sending output while the bytes sent and not yet acknowledged reach ``limit``.
"""
import asyncio
import json

INPUT, OUTPUT, RESIZE, ACK = 0, 1, 4, 5
LIMIT = 1 << 20


class TerminalClosed(ConnectionError):
    pass


class TerminalSession:
    """One open terminal. The PageStore method reads it and writes it; the adapter feeds it the frames
    of the browser with ``receive`` and sends the frames it produces with ``send``, an async callable
    that takes ``bytes``."""

    def __init__(self, send, *, limit=LIMIT):
        if not callable(send):
            raise TypeError("A terminal session requires a send callable")
        if type(limit) is not int or limit < 1:
            raise ValueError("The terminal limit must be a positive integer")
        self._send = send
        self.limit = limit
        self.size = None
        self._unacknowledged = 0
        self._input = asyncio.Queue()
        self._window = asyncio.Event()
        self._window.set()
        self._resized = asyncio.Event()
        self._closed = asyncio.Event()

    @property
    def closed(self):
        return self._closed.is_set()

    @property
    def unacknowledged(self):
        """Output bytes sent and not yet acknowledged by the browser."""
        return self._unacknowledged

    async def read(self):
        """The next bytes of input; ``b""`` once the session is closed."""
        if self.closed and self._input.empty():
            return b""
        data = await self._input.get()
        return data

    async def write(self, data):
        """Send ``data`` as output. Waits while ``limit`` bytes are unacknowledged; a caller that reads
        its process only after ``write`` returns stops reading it for that time."""
        if not isinstance(data, (bytes, bytearray, memoryview)):
            raise TypeError("Terminal output must be bytes")
        data = bytes(data)
        while True:
            if self.closed:
                raise TerminalClosed("The terminal session is closed")
            if self._unacknowledged < self.limit:
                break
            await self._window.wait()
        if not data:
            return
        self._unacknowledged += len(data)
        if self._unacknowledged >= self.limit:
            self._window.clear()
        await self._send(bytes([OUTPUT]) + data)

    async def resized(self):
        """The next size ``(rows, columns)`` the browser sends; ``None`` once the session is closed."""
        if not self._resized.is_set():
            waiter = asyncio.ensure_future(self._resized.wait())
            closed = asyncio.ensure_future(self._closed.wait())
            try:
                await asyncio.wait((waiter, closed), return_when=asyncio.FIRST_COMPLETED)
            finally:
                waiter.cancel()
                closed.cancel()
        if not self._resized.is_set():
            return None
        self._resized.clear()
        return self.size

    def receive(self, frame):
        """Apply one frame of the browser. A frame on an unknown channel or with an invalid payload is a
        ``ValueError``; the adapter closes the socket."""
        if self.closed:
            raise TerminalClosed("The terminal session is closed")
        if not isinstance(frame, (bytes, bytearray)) or not frame:
            raise ValueError("A terminal frame is a nonempty binary message")
        channel, payload = frame[0], bytes(frame[1:])
        if channel == INPUT:
            if payload:
                self._input.put_nowait(payload)
        elif channel == RESIZE:
            try:
                size = json.loads(payload)
            except ValueError as error:
                raise ValueError("A resize frame carries JSON") from error
            if (not isinstance(size, dict) or set(size) != {"Width", "Height"}
                    or any(type(size[key]) is not int or size[key] < 1 for key in size)):
                raise ValueError("A resize frame carries a positive Width and Height")
            self.size = (size["Height"], size["Width"])
            self._resized.set()
        elif channel == ACK:
            if len(payload) != 4:
                raise ValueError("An acknowledgement carries a 32-bit count")
            count = int.from_bytes(payload, "big")
            if count > self._unacknowledged:
                raise ValueError("Acknowledged more output than was sent")
            self._unacknowledged -= count
            if self._unacknowledged < self.limit:
                self._window.set()
        else:
            raise ValueError(f"Unknown terminal channel: {channel}")

    def close(self):
        """Close the session: ``read`` returns ``b""``, ``resized`` returns ``None``, ``write`` raises
        ``TerminalClosed``. Repeated calls do nothing."""
        if self.closed:
            return
        self._closed.set()
        self._window.set()
        self._input.put_nowait(b"")

    async def wait_closed(self):
        await self._closed.wait()
