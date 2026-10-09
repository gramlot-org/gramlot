"""Neutral server foundation: no HTTP framework, event loop or ASGI dependency."""

import inspect
import json
import math
import secrets
import time
import traceback
from dataclasses import dataclass
from uuid import uuid4
from genro_tytx import from_tytx, to_tytx

from ..page.base import Page, endpoint_methods, source_methods
from ..page.builder import GramlotBuilder
from .assets import gramlot_dev
from .resources import load_order


class PageExpired(LookupError):
    pass


class PageNotFound(LookupError):
    pass


class SourceNotFound(LookupError):
    pass


class EndpointNotFound(LookupError):
    pass


class NotAuthenticated(PermissionError):
    pass


class NotAuthorized(PermissionError):
    pass


class InvalidRequest(ValueError):
    pass


class ServerCapacity(RuntimeError):
    pass


# The single place the outcome codes are spelled; any other exception is application_error.
OUTCOME_CODES = {PageExpired: "page_expired", SourceNotFound: "not_found", EndpointNotFound: "not_found",
                 NotAuthenticated: "not_authenticated", NotAuthorized: "not_authorized"}


@dataclass(frozen=True)
class Bootstrap:
    page_id: str
    html: str
    nonce: str


def _prefixed(prefix, url):
    """Add the mount prefix once to a root-relative URL (``/…``, not ``//…``);
    relative and absolute URLs stay as written."""
    return prefix + url if url.startswith("/") and not url.startswith("//") else url


def _script_json(value):
    """Compact JSON for a module script, the same text as ``JSON.stringify``
    (non-ASCII characters written as they are); ``<`` escaped so the text cannot
    close the script."""
    return json.dumps(value, separators=(",", ":"), ensure_ascii=False).replace("<", "\\u003c")


def _parse_request(text):
    """Decode and check the request envelope ``{id, pageId, contentType, name, params}``."""
    try:
        request = from_tytx(text)
    except Exception as error:
        raise InvalidRequest("Request is not TYTX text") from error
    if not isinstance(request, dict):
        raise InvalidRequest("Request must be a mapping")
    for field in ("id", "pageId", "contentType", "name"):
        if not isinstance(request.get(field), str):
            raise InvalidRequest(f"Request {field} must be a string")
    if request["contentType"] not in ("source", "data"):
        raise InvalidRequest("Request contentType must be source or data")
    if not isinstance(request.get("params"), dict):
        raise InvalidRequest("Request params must be a mapping")
    return request


class GramlotServer:
    """Subclass at the server boundary to connect routing, assets and identity.

    The core never searches files: override ``resolve_page`` and
    ``resolve_resources`` in concrete integrations; ``GramlotFileServer`` implements them
    on one pages folder. The default page registry is bounded, expiring and
    process-local. A concrete adapter must associate requests with their owner;
    page IDs are not login.
    """

    def __init__(self, *, runtime_url="/assets/gramlot.js",
                 rpc_url="/gramlot/rpc", close_url="/gramlot/close",
                 root_id="gramlot-root",
                 page_ttl=1800, max_pages=1000):
        try:
            ttl = float(page_ttl) if type(page_ttl) in (int, float) else float("nan")
        except OverflowError:
            ttl = float("nan")
        if (ttl <= 0 or not math.isfinite(time.monotonic() + ttl)
                or type(max_pages) is not int or max_pages < 1):
            raise ValueError("Page TTL must be finite and positive; capacity must be a positive integer")
        self.runtime_url, self.rpc_url = runtime_url, rpc_url
        self.close_url, self.root_id = close_url, root_id
        self.page_ttl, self.max_pages = ttl, max_pages
        self._pages = {}

    def resolve_page(self, path):
        """Return the ``Page`` class of ``path``, or raise ``PageNotFound``."""
        raise PageNotFound(f"Page not found: {path}")

    def resolve_resources(self, path, cls):
        """Return ``{"css": [url], "js": [{"url": url, "group": str | None}]}``, in load
        order and without mount prefix, or raise ``PageNotFound``."""
        raise PageNotFound(f"Page resources not found: {path}")

    @property
    def capabilities(self):
        """The capabilities announced in the bootstrap; none in the base server."""
        return []

    def evaluate_auth(self, rule, *, owner):
        """Return ``None`` when a target with ``rule`` may run for ``owner``, else
        ``"not_authenticated"`` or ``"not_authorized"``. The base server knows no
        identity: any rule is closed."""
        return None if rule is None else "not_authenticated"

    def _prune(self):
        now = time.monotonic()
        self._pages = {key: record for key, record in self._pages.items() if record[0] > now}

    async def open_page(self, path, *, owner=None, prefix=""):
        """Register the page and return its bootstrap. ``prefix`` is the mount prefix
        chosen by the adapter, added once to the root-relative bootstrap URLs."""
        if not isinstance(prefix, str):
            raise TypeError("Mount prefix must be a string")
        cls = self.resolve_page(path)
        if not isinstance(cls, type) or not issubclass(cls, Page) or cls is Page:
            raise TypeError("Page modules must expose a subclass of gramlot.Page")
        resources = load_order(self.resolve_resources(path, cls))
        self._prune()
        if len(self._pages) >= self.max_pages:
            raise ServerCapacity("Page registry capacity reached")
        page_id = uuid4().hex
        nonce = secrets.token_urlsafe(16)
        # The CSS links and the JS modules reach the page through PageBootstrap (§4.12, D9);
        # the compact JSON gives the same text as the JavaScript server.
        bootstrap = _script_json({
            "config": {"pageId": page_id, "rpcUrl": _prefixed(prefix, self.rpc_url),
                       "closeUrl": _prefixed(prefix, self.close_url), "rootId": self.root_id,
                       "capabilities": self.capabilities},
            "resources": {"css": [_prefixed(prefix, url) for url in resources["css"]],
                          "js": [{"url": _prefixed(prefix, entry["url"]), "group": entry["group"]}
                                 for entry in resources["js"]]}})
        runtime = _script_json(_prefixed(prefix, self.runtime_url))
        document = GramlotBuilder()
        root = document.source.html()
        head = root.head()
        head.meta(charset="utf-8")
        head.title(cls.title)
        # A page module served for its Logic imports the core from the runtime already loaded.
        head.script(_script_json({"imports": {"@gramlot/gramlot/page": _prefixed(prefix, self.runtime_url)}}),
                    type="importmap", nonce=nonce)
        body = root.body()
        body.div(id=self.root_id)
        body.script(f'import {{PageBootstrap}} from {runtime};'
                    f'await new PageBootstrap({bootstrap}).run();', type="module", nonce=nonce)
        markup = document.render(doctype=True)
        self._pages[page_id] = (time.monotonic() + self.page_ttl, cls, owner)
        return Bootstrap(page_id, markup, nonce)

    async def call(self, text, *, owner=None):
        """Answer the request envelope ``text`` (TYTX) with the response envelope (TYTX).
        Raises only ``InvalidRequest``; every other failure is an outcome in the response,
        a value that TYTX cannot serialise included."""
        request = _parse_request(text)
        response = {"id": request["id"], "contentType": request["contentType"]}
        try:
            response["value"] = await self._run(request, owner)
            return to_tytx(response)
        except Exception as error:
            response.pop("value", None)
            response["error"] = {"code": OUTCOME_CODES.get(type(error), "application_error"),
                                 "name": type(error).__name__, "message": str(error)}
            if gramlot_dev() == "DEBUG":
                response["error"]["details"] = traceback.format_exc()
        return to_tytx(response)

    async def _run(self, request, owner):
        self._prune()
        record = self._pages.get(request["pageId"])
        if record is None or record[2] != owner:
            raise PageExpired("Unknown, expired or unowned page")
        page = record[1]()
        page.page_id = request["pageId"]
        name, params = request["name"], request["params"]
        source = request["contentType"] == "source"
        if source and name == "main":
            function, rule = page.main, None
        else:
            declared = (source_methods if source else endpoint_methods)(type(page))
            if name not in declared:
                raise SourceNotFound(f"Unknown Source method: {name}") if source else EndpointNotFound(
                    f"Unknown endpoint: {name}")
            method = declared[name]
            function = method.__get__(page, type(page))
            rule = (method.__gramlot_source__ if source else method.__gramlot_endpoint__)["auth"]
        refused = self.evaluate_auth(rule, owner=owner)
        if refused not in (None, "not_authenticated", "not_authorized"):
            raise TypeError("evaluate_auth must return None, 'not_authenticated' or 'not_authorized'")
        if refused is not None:
            raise {OUTCOME_CODES[cls]: cls for cls in (NotAuthenticated, NotAuthorized)}[refused](
                f"Access refused: {name}")
        if not source:
            result = function(**params)
            return await result if inspect.isawaitable(result) else result
        builder = page.source_builder(name)
        result = function(builder.root, **params)
        if inspect.isawaitable(result):
            result = await result
        if result is not None:
            raise TypeError("Source methods must build into root and return None")
        return to_tytx(builder.source)

    def close_page(self, page_id, *, owner=None):
        record = self._pages.get(page_id)
        if record is not None and record[2] == owner:
            del self._pages[page_id]

    def close_all(self):
        """Forget every registered page; adapters call it on shutdown."""
        self._pages = {}
