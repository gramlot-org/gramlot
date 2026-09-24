"""Loopback-only test adapter. Not a production server or application demo."""
import asyncio
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

from gramlot.server import Host, PageExpired

ROOT = Path(__file__).resolve().parents[1]


class FixtureHost(Host):
    def runtime(self):
        return (ROOT / "build/assets/gramlot.js").read_bytes()


host = FixtureHost(ROOT / "tests/fixtures/pages")


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def reply(self, status, content, content_type):
        body = content.encode() if isinstance(content, str) else content
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/assets/gramlot.js":
            self.reply(200, host.runtime(), "text/javascript")
        elif self.path == "/":
            self.reply(200, asyncio.run(host.open_page("/")).html, "text/html; charset=utf-8")
        else:
            self.reply(404, "Not found", "text/plain")

    def do_POST(self):
        if self.path not in ("/gramlot/main", "/gramlot/source"):
            self.reply(404, "Not found", "text/plain")
            return
        try:
            payload = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
            result = (host.main(payload["pageId"]) if self.path == "/gramlot/main" else
                      host.source(payload["pageId"], payload["method"], payload.get("params", {})))
            self.reply(200, asyncio.run(result), "application/json")
        except PageExpired:
            self.reply(404, "Unknown page", "text/plain")


if __name__ == "__main__":
    server = HTTPServer(("127.0.0.1", 0), Handler)
    print(f"http://127.0.0.1:{server.server_port}", flush=True)
    server.serve_forever()
