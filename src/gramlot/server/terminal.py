"""Terminal sessions: binary frames between a ``terminal`` component and a PageStore method (#87).

A frame is one binary WebSocket message. Its first byte is the channel, the rest is the payload:

- ``INPUT`` (0), browser to server: the bytes of the keys.
- ``OUTPUT`` (1), server to browser: the bytes the terminal writes.
- ``RESIZE`` (4), browser to server: JSON ``{"Width": columns, "Height": rows}``.
- ``ACK`` (5), browser to server: a 32-bit big-endian count of output bytes the terminal has written.

Channels 0, 1 and 4 and the resize JSON follow the Kubernetes exec protocol; a size is 1 to 65535, as
there. ``ACK`` is Gramlot's: the session stops sending output while the bytes sent and not yet
acknowledged reach ``limit``, and output sent and not yet acknowledged never exceeds ``limit``. Input
not yet read may not exceed ``limit`` either.
"""
import asyncio
import json
from collections import deque

INPUT, OUTPUT, RESIZE, ACK = 0, 1, 4, 5
LIMIT = 1 << 20
MAX_SIZE = 65535


class TerminalClosed(ConnectionError):
    pass


class TerminalSession:
    """One open terminal. The PageStore method reads it and writes it; the adapter feeds it the frames
    of the browser with ``receive`` and sends the frames it produces with ``send``, an async callable
    that takes ``bytes``. ``host`` is the ``Host`` header of the socket request and ``client`` the
    address of its peer, each ``None`` when the adapter does not know it.

    The session belongs to the event loop running when it is created. ``close`` may be called from
    another thread: it then runs on that loop."""

    def __init__(self, send, *, limit=LIMIT, host=None, client=None):
        if not callable(send):
            raise TypeError("A terminal session requires a send callable")
        if type(limit) is not int or limit < 1:
            raise ValueError("The terminal limit must be a positive integer")
        self._loop = asyncio.get_running_loop()
        self._send = send
        self.limit = limit
        self._host = host
        self._client = client
        self.size = None
        self._unacknowledged = 0
        self._input = deque()
        self._unread = 0
        self._input_ready = asyncio.Event()
        self._window = asyncio.Event()
        self._window.set()
        self._resized = asyncio.Event()
        self._closed = asyncio.Event()

    @property
    def closed(self):
        return self._closed.is_set()

    @property
    def host(self):
        """The ``Host`` header of the socket request, or ``None``."""
        return self._host

    @property
    def client(self):
        """The address of the socket's peer (``"127.0.0.1"``, ``"::1"``, …), or ``None``."""
        return self._client

    @property
    def unacknowledged(self):
        """Output bytes sent and not yet acknowledged by the browser."""
        return self._unacknowledged

    async def read(self):
        """The next bytes of input; ``b""`` once the session is closed."""
        while True:
            if self._input:
                data = self._input.popleft()
                self._unread -= len(data)
                return data
            if self.closed:
                return b""
            self._input_ready.clear()
            await self._input_ready.wait()

    async def write(self, data):
        """Send ``data`` as output, in frames that keep the unacknowledged bytes within ``limit``. Waits
        while ``limit`` bytes are unacknowledged; a caller that reads its process only after ``write`` returns stops reading it
        for that time."""
        if not isinstance(data, (bytes, bytearray, memoryview)):
            raise TypeError("Terminal output must be bytes")
        data = bytes(data)
        if self.closed:
            raise TerminalClosed("The terminal session is closed")
        offset = 0
        while offset < len(data):
            while True:
                if self.closed:
                    raise TerminalClosed("The terminal session is closed")
                if self._unacknowledged < self.limit:
                    break
                await self._window.wait()
            chunk = data[offset:offset + self.limit - self._unacknowledged]
            offset += len(chunk)
            self._unacknowledged += len(chunk)
            if self._unacknowledged >= self.limit:
                self._window.clear()
            await self._send(bytes([OUTPUT]) + chunk)

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
            if self._unread + len(payload) > self.limit:
                raise ValueError("Unread terminal input exceeds the limit")
            if payload:
                self._input.append(payload)
                self._unread += len(payload)
                self._input_ready.set()
        elif channel == RESIZE:
            try:
                size = json.loads(payload)
            except ValueError as error:
                raise ValueError("A resize frame carries JSON") from error
            if (not isinstance(size, dict) or set(size) != {"Width", "Height"}
                    or any(type(size[key]) is not int or not 1 <= size[key] <= MAX_SIZE for key in size)):
                raise ValueError(f"A resize frame carries a Width and Height from 1 to {MAX_SIZE}")
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

    def _on_loop(self, function):
        """Run ``function`` now on the session's loop, or schedule it there from another thread."""
        try:
            running = asyncio.get_running_loop()
        except RuntimeError:
            running = None
        if running is self._loop:
            function()
        else:
            self._loop.call_soon_threadsafe(function)

    def close(self):
        """Close the session: ``read`` returns ``b""``, ``resized`` returns ``None``, ``write`` raises
        ``TerminalClosed``. Repeated calls do nothing. From another thread the close runs on the
        session's loop."""
        self._on_loop(self._close)

    def _close(self):
        if self.closed:
            return
        self._closed.set()
        self._window.set()
        self._input_ready.set()

    async def wait_closed(self):
        await self._closed.wait()
