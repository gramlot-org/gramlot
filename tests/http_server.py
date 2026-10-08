"""Loopback-only reference adapter of the server protocol GC-230, for the core tests
and the browser checks. Not a production server or application demo.

``python tests/http_server.py PAGES [--prefix /mount] [--csp POLICY]`` prints its
base URL (mount prefix included) and serves until stopped. The runtime and the
themes come from the ``gramlot`` package on the path: build the runtime first.
"""
import argparse
import asyncio
import json
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from importlib.resources import files
from pathlib import Path
from secrets import token_urlsafe
from urllib.parse import unquote, urlsplit

from gramlot.server import GramlotFileServer, PageExpired, PageNotFound, ServerCapacity, SourceNotFound, runtime_asset

MAX_REQUEST_BYTES = 4096
OWNER_COOKIE = "gramlot_owner"
JSON_MEDIA_TYPE = "application/json"
MEDIA_TYPES = {".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8"}
THEMES = Path(str(files("gramlot").joinpath("resources", "themes")))


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def reply(self, status, content=b"", content_type="text/plain; charset=utf-8", headers=()):
        body = content.encode() if isinstance(content, str) else content
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        for name, value in headers:
            self.send_header(name, value)
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def owner(self):
        morsel = SimpleCookie(self.headers.get("Cookie", "")).get(OWNER_COOKIE)
        return morsel.value if morsel else None

    def static_file(self, path):
        """The file of ``path`` below the themes or the pages folder, or ``None``."""
        folder, relative = ((THEMES, path.removeprefix("/themes/")) if path.startswith("/themes/")
                            else (self.server.gramlot.pages_dir, path))
        root = Path(folder).resolve()
        real = root.joinpath(*relative.strip("/").split("/")).resolve()
        return real if real.is_relative_to(root) and real.is_file() else None

    def dispatch(self):
        url = urlsplit(self.path)
        path, prefix, gramlot = unquote(url.path), self.server.prefix, self.server.gramlot
        if prefix:
            if path == prefix:
                return self.reply(301, headers=[("Location", prefix + "/" + (f"?{url.query}" if url.query else ""))])
            if not path.startswith(prefix + "/"):
                return self.reply(404, "Not found")
            path = path[len(prefix):]
        suffix = Path(path).suffix
        if path == gramlot.runtime_url or path.startswith("/themes/") or suffix in MEDIA_TYPES:
            if self.command not in ("GET", "HEAD"):
                return self.reply(405, "Method not allowed", headers=[("Allow", "GET, HEAD")])
            if path == gramlot.runtime_url:
                return self.reply(200, runtime_asset().read_bytes(), MEDIA_TYPES[".js"])
            filename = self.static_file(path)
            if filename is None:
                return self.reply(404, "Not found")
            return self.reply(200, filename.read_bytes(), MEDIA_TYPES.get(suffix, "application/octet-stream"))
        if path in (gramlot.main_url, gramlot.source_url, gramlot.close_url):
            if self.command != "POST":
                return self.reply(405, "Method not allowed", headers=[("Allow", "POST")])
            return self.operation(path)
        if self.command != "GET":
            return self.reply(405, "Method not allowed", headers=[("Allow", "GET")])
        # As on a static host, <path>/index.html is the page <path> and /index.html the index.
        if path.endswith("/index.html"):
            path = path.removesuffix("index.html")
        owner = self.owner() or token_urlsafe(24)
        try:
            opened = asyncio.run(gramlot.open_page(path, owner=owner, prefix=prefix))
        except PageNotFound:
            return self.reply(404, "Page not found")
        except ServerCapacity:
            return self.reply(503, "Page registry capacity reached")
        headers = [("Set-Cookie", f"{OWNER_COOKIE}={owner}; Path={prefix or '/'}; HttpOnly; SameSite=Lax")]
        if self.server.csp is not None:
            headers.append(("Content-Security-Policy", self.server.csp.replace("{nonce}", opened.nonce)))
        self.reply(200, opened.html, "text/html; charset=utf-8", headers)

    def operation(self, path):
        gramlot = self.server.gramlot
        if self.headers.get("Content-Type", "").split(";")[0].strip().lower() != JSON_MEDIA_TYPE:
            return self.reply(415, "Expected application/json")
        body = self.rfile.read(int(self.headers.get("Content-Length") or 0))
        if len(body) > MAX_REQUEST_BYTES:
            return self.reply(413, "Request too large")
        try:
            payload = json.loads(body)
            if not isinstance(payload, dict) or not isinstance(payload.get("pageId"), str):
                raise ValueError("Missing pageId")
        except ValueError:
            return self.reply(400, "Invalid JSON request")
        page_id, owner = payload["pageId"], self.owner()
        if path == gramlot.close_url:
            gramlot.close_page(page_id, owner=owner)
            return self.reply(200, json.dumps({"ok": True}), JSON_MEDIA_TYPE)
        try:
            if path == gramlot.source_url:
                method, params = payload.get("method"), payload.get("params")
                if not isinstance(method, str) or not (params is None or isinstance(params, dict)):
                    return self.reply(400, "Invalid Source request")
                result = asyncio.run(gramlot.source(page_id, method, params, owner=owner))
            else:
                result = asyncio.run(gramlot.main(page_id, owner=owner))
        except (PageExpired, SourceNotFound):
            return self.reply(404, "Not found")
        self.reply(200, result, JSON_MEDIA_TYPE)

    do_GET = do_HEAD = do_POST = do_PUT = do_DELETE = dispatch


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("pages")
    parser.add_argument("--prefix", default="")
    parser.add_argument("--csp")
    args = parser.parse_args()
    http_server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    http_server.gramlot = GramlotFileServer(args.pages)
    http_server.prefix = "/" + args.prefix.strip("/") if args.prefix.strip("/") else ""
    http_server.csp = args.csp
    print(f"http://127.0.0.1:{http_server.server_port}{http_server.prefix}", flush=True)
    http_server.serve_forever()


if __name__ == "__main__":
    main()
