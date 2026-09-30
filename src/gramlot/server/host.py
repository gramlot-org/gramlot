"""Neutral host foundation: no HTTP framework, event loop or ASGI dependency."""

import inspect
import json
import math
import secrets
import time
from dataclasses import dataclass
from uuid import uuid4
from genro_tytx import to_tytx

from ..page.base import Page, source_methods
from ..page.builder import GramlotBuilder
from .resources import load_order


class PageExpired(LookupError):
    pass


class PageNotFound(LookupError):
    pass


class SourceNotFound(LookupError):
    pass


class HostCapacity(RuntimeError):
    pass


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


class Host:
    """Subclass at the host boundary to connect routing, assets and identity.

    The core never searches files: override ``resolve_page`` and
    ``resolve_resources`` in concrete integrations; ``FileHost`` implements them
    on one pages folder. The default page registry is bounded, expiring and
    process-local. A concrete adapter must associate requests with their owner;
    page IDs are not login.
    """

    def __init__(self, *, runtime_url="/assets/gramlot.js",
                 main_url="/gramlot/main", source_url="/gramlot/source", close_url="/gramlot/close",
                 root_id="gramlot-root",
                 page_ttl=1800, max_pages=1000):
        try:
            ttl = float(page_ttl) if type(page_ttl) in (int, float) else float("nan")
        except OverflowError:
            ttl = float("nan")
        if (ttl <= 0 or not math.isfinite(time.monotonic() + ttl)
                or type(max_pages) is not int or max_pages < 1):
            raise ValueError("Page TTL must be finite and positive; capacity must be a positive integer")
        self.runtime_url, self.main_url = runtime_url, main_url
        self.source_url, self.close_url, self.root_id = source_url, close_url, root_id
        self.page_ttl, self.max_pages = ttl, max_pages
        self._pages = {}

    def resolve_page(self, path):
        """Return the ``Page`` class of ``path``, or raise ``PageNotFound``."""
        raise PageNotFound(f"Page not found: {path}")

    def resolve_resources(self, path, cls):
        """Return ``{"css": [url], "js": [{"url": url, "group": str | None}]}``, in load
        order and without mount prefix, or raise ``PageNotFound``."""
        raise PageNotFound(f"Page resources not found: {path}")

    def _prune(self):
        now = time.monotonic()
        self._pages = {key: record for key, record in self._pages.items() if record[0] > now}

    async def open_page(self, path, *, owner=None, prefix=""):
        """Register the page and return its bootstrap. ``prefix`` is the mount prefix
        chosen by the adapter, added once to the root-relative bootstrap URLs."""
        if not isinstance(prefix, str):
            raise TypeError("Mount prefix must be a string")
        cls = self.resolve_page(path)
        if not isinstance(cls, type) or not issubclass(cls, Page):
            raise TypeError("Page modules must expose a subclass of gramlot.Page")
        resources = load_order(self.resolve_resources(path, cls))
        self._prune()
        if len(self._pages) >= self.max_pages:
            raise HostCapacity("Page registry capacity reached")
        page_id = uuid4().hex
        nonce = secrets.token_urlsafe(16)
        # The CSS links and the JS modules reach the page through PageBootstrap (§4.12, D9);
        # the compact JSON gives the same text as the JavaScript host.
        bootstrap = _script_json({
            "config": {"pageId": page_id, "mainUrl": _prefixed(prefix, self.main_url),
                       "sourceUrl": _prefixed(prefix, self.source_url),
                       "closeUrl": _prefixed(prefix, self.close_url), "rootId": self.root_id},
            "resources": {"css": [_prefixed(prefix, url) for url in resources["css"]],
                          "js": [{"url": _prefixed(prefix, entry["url"]), "group": entry["group"]}
                                 for entry in resources["js"]]}})
        runtime = _script_json(_prefixed(prefix, self.runtime_url))
        document = GramlotBuilder()
        root = document.source.html()
        head = root.head()
        head.meta(charset="utf-8")
        head.title(cls.title)
        body = root.body()
        body.div(id=self.root_id)
        body.script(f'import {{PageBootstrap}} from {runtime};'
                    f'await new PageBootstrap({bootstrap}).run();', type="module", nonce=nonce)
        markup = document.render(doctype=True)
        self._pages[page_id] = (time.monotonic() + self.page_ttl, cls, owner)
        return Bootstrap(page_id, markup, nonce)

    async def main(self, page_id, *, owner=None):
        return await self._source(page_id, "main", {}, owner=owner)

    async def source(self, page_id, method, params=None, *, owner=None):
        if not isinstance(method, str) or method == "main":
            raise SourceNotFound("Unknown Source method")
        if params is not None and not isinstance(params, dict):
            raise TypeError("Source params must be a dictionary")
        return await self._source(page_id, method, params or {}, owner=owner)

    async def _source(self, page_id, method, params, *, owner=None):
        self._prune()
        record = self._pages.get(page_id)
        if record is None or record[2] != owner:
            raise PageExpired("Unknown, expired or unowned page")
        page = record[1]()
        page.page_id = page_id
        if method == "main":
            function = page.main
        else:
            declared = source_methods(type(page))
            if method not in declared:
                raise SourceNotFound(f"Unknown Source method: {method}")
            function = declared[method].__get__(page, type(page))
        builder = page.source_builder(method)
        result = function(builder.root, **dict(params))
        if inspect.isawaitable(result):
            result = await result
        if result is not None:
            raise TypeError("Source methods must build into root and return None")
        return to_tytx(builder.source)

    def close_page(self, page_id, *, owner=None):
        record = self._pages.get(page_id)
        if record is not None and record[2] == owner:
            del self._pages[page_id]
