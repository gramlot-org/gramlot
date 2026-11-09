"""Terminal sessions: frames, flow control and the life of a @terminal PageStore method (#87)."""
import asyncio
import contextvars
import json
import threading
import unittest

from genro_tytx import from_tytx, to_tytx

from gramlot import Page, PageStore
from gramlot.page import terminal
from gramlot.server import GramlotServer
from gramlot.server.gramlot_server import EndpointNotFound, NotAuthenticated, PageExpired
from gramlot.server.terminal import ACK, INPUT, OUTPUT, RESIZE, TerminalClosed, TerminalSession


def ack(count):
    return bytes([ACK]) + count.to_bytes(4, "big")


def resize(rows, columns):
    return bytes([RESIZE]) + json.dumps({"Width": columns, "Height": rows}).encode()


class Sent:
    def __init__(self):
        self.frames = []

    async def __call__(self, frame):
        self.frames.append(frame)


class EmptyPage(Page):
    def main(self, root):
        root.div()


class ShellStore(PageStore):
    @terminal
    async def echo(self, session):
        while data := await session.read():
            await session.write(data)

    @terminal
    async def sizes(self, session):
        while (size := await session.resized()) is not None:
            await session.write(f"{size[0]}x{size[1]}".encode())

    @terminal(auth="admin")
    async def guarded(self, session):
        pass

    @terminal
    def blocking(self, session):
        pass


class ShellServer(GramlotServer):
    def resolve_page(self, path):
        return EmptyPage

    def resolve_page_store(self, page_class):
        return ShellStore

    def resolve_resources(self, path, cls):
        return {"css": [], "js": []}


async def settle():
    for _ in range(5):
        await asyncio.sleep(0)


class TerminalSessionTests(unittest.TestCase):
    def test_input_frames_are_read_in_order_and_close_ends_reading(self):
        async def run():
            session = TerminalSession(Sent())
            session.receive(bytes([INPUT]) + b"ls")
            session.receive(bytes([INPUT]) + b"\r")
            self.assertEqual(await session.read(), b"ls")
            self.assertEqual(await session.read(), b"\r")
            session.close()
            self.assertEqual(await session.read(), b"")
            self.assertEqual(await session.read(), b"")
            with self.assertRaises(TerminalClosed):
                await session.write(b"x")
            with self.assertRaises(TerminalClosed):
                session.receive(bytes([INPUT]) + b"x")
        asyncio.run(run())

    def test_output_is_one_frame_on_the_output_channel(self):
        async def run():
            sent = Sent()
            session = TerminalSession(sent)
            await session.write(b"\x1b[2Jhello")
            await session.write(b"")
            self.assertEqual(sent.frames, [bytes([OUTPUT]) + b"\x1b[2Jhello"])
            self.assertEqual(session.unacknowledged, 9)
        asyncio.run(run())

    def test_resize_gives_rows_and_columns(self):
        async def run():
            session = TerminalSession(Sent())
            session.receive(resize(24, 80))
            self.assertEqual(await session.resized(), (24, 80))
            self.assertEqual(session.size, (24, 80))
            waiting = asyncio.ensure_future(session.resized())
            await settle()
            session.receive(resize(50, 132))
            self.assertEqual(await waiting, (50, 132))
            waiting = asyncio.ensure_future(session.resized())
            await settle()
            session.close()
            self.assertIsNone(await waiting)
        asyncio.run(run())

    def test_writing_waits_at_the_limit_and_resumes_on_acknowledgement(self):
        async def run():
            sent = Sent()
            session = TerminalSession(sent, limit=8)
            await session.write(b"12345678")
            blocked = asyncio.ensure_future(session.write(b"9"))
            await settle()
            self.assertFalse(blocked.done())
            self.assertEqual(len(sent.frames), 1)
            session.receive(ack(3))
            await asyncio.wait_for(blocked, 1)
            self.assertEqual(sent.frames[-1], bytes([OUTPUT]) + b"9")
            self.assertEqual(session.unacknowledged, 6)
        asyncio.run(run())

    def test_close_releases_a_blocked_writer(self):
        async def run():
            session = TerminalSession(Sent(), limit=1)
            await session.write(b"a")
            blocked = asyncio.ensure_future(session.write(b"b"))
            await settle()
            session.close()
            with self.assertRaises(TerminalClosed):
                await blocked
        asyncio.run(run())

    def test_invalid_frames_are_refused(self):
        async def run():
            session = TerminalSession(Sent())
            await session.write(b"abc")
            for frame in (b"", bytes([2]) + b"x", bytes([RESIZE]) + b"{", resize(0, 80),
                          bytes([RESIZE]) + b'{"Width": 80}', bytes([ACK]) + b"\x00", ack(4)):
                with self.subTest(frame=frame), self.assertRaises(ValueError):
                    session.receive(frame)
        asyncio.run(run())

    def test_constructor_checks_its_arguments(self):
        with self.assertRaises(TypeError):
            TerminalSession(None)
        for limit in (0, -1, 1.5, True):
            with self.subTest(limit=limit), self.assertRaises(ValueError):
                TerminalSession(Sent(), limit=limit)

    def test_a_large_write_goes_in_frames_of_the_limit(self):
        async def run():
            sent = Sent()
            session = TerminalSession(sent, limit=4)
            writing = asyncio.ensure_future(session.write(b"0123456789"))
            await settle()
            self.assertEqual(sent.frames, [bytes([OUTPUT]) + b"0123"])
            session.receive(ack(4))
            await settle()
            session.receive(ack(4))
            await asyncio.wait_for(writing, 1)
            self.assertEqual([frame[1:] for frame in sent.frames], [b"0123", b"4567", b"89"])
        asyncio.run(run())

    def test_output_in_flight_never_exceeds_the_limit(self):
        async def run():
            sent = Sent()
            session = TerminalSession(sent, limit=4)
            await session.write(b"ab")
            writing = asyncio.ensure_future(session.write(b"cdef"))
            await settle()
            self.assertEqual([frame[1:] for frame in sent.frames], [b"ab", b"cd"])
            self.assertEqual(session.unacknowledged, 4)
            session.receive(ack(2))
            await asyncio.wait_for(writing, 1)
            self.assertEqual(sent.frames[-1], bytes([OUTPUT]) + b"ef")
            self.assertEqual(session.unacknowledged, 4)
        asyncio.run(run())

    def test_close_ends_every_waiting_reader(self):
        async def run():
            session = TerminalSession(Sent())
            readers = [asyncio.ensure_future(session.read()) for _ in range(3)]
            await settle()
            session.close()
            self.assertEqual(await asyncio.wait_for(asyncio.gather(*readers), 1), [b"", b"", b""])
        asyncio.run(run())

    def test_sizes_above_65535_and_unread_input_above_the_limit_are_refused(self):
        async def run():
            session = TerminalSession(Sent(), limit=4)
            session.receive(resize(65535, 65535))
            with self.assertRaises(ValueError):
                session.receive(resize(65536, 80))
            session.receive(bytes([INPUT]) + b"abc")
            with self.assertRaises(ValueError):
                session.receive(bytes([INPUT]) + b"de")
            self.assertEqual(await session.read(), b"abc")
            session.receive(bytes([INPUT]) + b"defg")
        asyncio.run(run())

    def test_close_from_another_thread_runs_on_the_session_loop(self):
        async def run():
            session = TerminalSession(Sent(), host="127.0.0.1:8000")
            self.assertEqual(session.host, "127.0.0.1:8000")
            reader = asyncio.ensure_future(session.read())
            await settle()
            thread = threading.Thread(target=session.close)
            thread.start()
            await asyncio.to_thread(thread.join)
            self.assertEqual(await asyncio.wait_for(reader, 1), b"")
            self.assertTrue(session.closed)
        asyncio.run(run())


class ServerTerminalTests(unittest.TestCase):
    def server(self):
        server = ShellServer(websocket_url="/gramlot/store", css_theme=False)
        self.addCleanup(server.close_all)
        return server

    def test_the_named_method_answers_through_the_session(self):
        async def run():
            server = self.server()
            page_id = (await server.open_page("/", owner="alice")).page_id
            sent = Sent()
            session = await server.open_terminal(page_id, "echo", send=sent, owner="alice")
            session.receive(bytes([INPUT]) + b"hi")
            await settle()
            self.assertEqual(sent.frames, [bytes([OUTPUT]) + b"hi"])
            sizes = await server.open_terminal(page_id, "sizes", send=sent, owner="alice")
            sizes.receive(resize(24, 80))
            await settle()
            self.assertEqual(sent.frames[-1], bytes([OUTPUT]) + b"24x80")
        asyncio.run(run())

    def test_the_session_knows_the_host_and_the_peer_of_its_socket(self):
        async def run():
            server = self.server()
            page_id = (await server.open_page("/", owner="alice")).page_id
            session = await server.open_terminal(page_id, "echo", send=Sent(), owner="alice",
                                                 host="localhost:8000", client="127.0.0.1")
            self.assertEqual((session.host, session.client), ("localhost:8000", "127.0.0.1"))
        asyncio.run(run())

    def test_the_method_does_not_see_the_context_variables_of_its_opener(self):
        operation = contextvars.ContextVar("operation", default=None)
        seen = []

        class ContextStore(PageStore):
            @terminal
            async def probe(self, session):
                seen.append(operation.get())

        server = self.server()
        server.resolve_page_store = lambda page_class: ContextStore

        async def run():
            page_id = (await server.open_page("/", owner="alice")).page_id
            operation.set("held")
            session = await server.open_terminal(page_id, "probe", send=Sent(), owner="alice")
            await asyncio.wait_for(session.wait_closed(), 1)
        asyncio.run(run())
        self.assertEqual(seen, [None])

    def test_closing_the_page_closes_its_sessions(self):
        async def run():
            server = self.server()
            page_id = (await server.open_page("/", owner="alice")).page_id
            session = await server.open_terminal(page_id, "echo", send=Sent(), owner="alice")
            server.close_page(page_id, owner="alice")
            self.assertTrue(session.closed)
            await settle()
            self.assertEqual(server._terminals, {})
        asyncio.run(run())

    def test_a_returning_method_closes_its_session_and_frees_the_name(self):
        async def run():
            server = self.server()
            page_id = (await server.open_page("/", owner="alice")).page_id
            session = await server.open_terminal(page_id, "echo", send=Sent(), owner="alice")
            replacing = await server.open_terminal(page_id, "echo", send=Sent(), owner="alice")
            self.assertTrue(session.closed)
            self.assertFalse(replacing.closed)
            session = replacing
            session.close()
            await asyncio.wait_for(session.wait_closed(), 1)
            await settle()
            again = await server.open_terminal(page_id, "echo", send=Sent(), owner="alice")
            self.assertFalse(again.closed)
            server.close_terminal(session)
            self.assertFalse(again.closed)
            server.close_terminal(again)
            self.assertTrue(again.closed)
        asyncio.run(run())

    def test_a_page_closed_from_a_worker_thread_closes_its_sessions_on_their_loop(self):
        async def run():
            server = self.server()
            page_id = (await server.open_page("/", owner="alice")).page_id
            session = await server.open_terminal(page_id, "echo", send=Sent(), owner="alice")
            await asyncio.to_thread(server.close_page, page_id, owner="alice")
            await asyncio.wait_for(session.wait_closed(), 1)
            await settle()
            self.assertEqual(server._terminals, {})
        loop = asyncio.new_event_loop()
        loop.set_debug(True)
        try:
            loop.run_until_complete(run())
        finally:
            loop.close()

    def test_unknown_unowned_guarded_and_synchronous_sessions_are_refused(self):
        async def run():
            server = self.server()
            page_id = (await server.open_page("/", owner="alice")).page_id
            with self.assertRaises(EndpointNotFound):
                await server.open_terminal(page_id, "missing", send=Sent(), owner="alice")
            with self.assertRaises(EndpointNotFound):
                await server.open_terminal(page_id, "main", send=Sent(), owner="alice")
            with self.assertRaises(PageExpired):
                await server.open_terminal(page_id, "echo", send=Sent(), owner="bob")
            with self.assertRaises(NotAuthenticated):
                await server.open_terminal(page_id, "guarded", send=Sent(), owner="alice")
            with self.assertRaises(TypeError):
                await server.open_terminal(page_id, "blocking", send=Sent(), owner="alice")
            self.assertEqual(server._terminals, {})
        asyncio.run(run())


class TerminalDeclarationTests(unittest.TestCase):
    def test_a_page_declares_a_terminal_of_the_standard_editors_collection(self):
        class TerminalPage(Page):
            def main(self, root):
                root.terminal(session="echo", fontSize=13, connected="^.connected", rows="^.rows",
                              columns="^.columns")

        server = ShellServer(css_theme=False)
        server.resolve_page = lambda path: TerminalPage
        self.addCleanup(server.close_all)
        page_id = asyncio.run(server.open_page("/", owner="alice")).page_id
        text = to_tytx({"id": "r1", "pageId": page_id, "contentType": "source", "name": "main", "params": {}})
        result = from_tytx(asyncio.run(server.call(text, owner="alice")))
        self.assertNotIn("error", result)
        node = result["value"].get_node("#0")
        self.assertEqual(node.node_tag, "terminal")
        self.assertEqual(node.attr["_meta"]["render_tag"], "gramlot-terminal")
        self.assertEqual(node.attr["session"], "echo")
        self.assertEqual(node.attr["connected"], "^.connected")


if __name__ == "__main__":
    unittest.main()
