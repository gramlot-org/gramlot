"""Neutral host foundation: no HTTP framework, event loop or ASGI dependency."""

import importlib.util
import inspect
import json
import math
import time
from dataclasses import dataclass
from pathlib import Path
from uuid import uuid4
from genro_tytx import to_tytx
from genro_builders.contrib.html import HtmlBuilder

from ..page.base import Page, source_methods


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


class Host:
    """Subclass at the host boundary to connect routing, assets and identity.

    The default page registry is bounded, expiring and process-local. A concrete
    adapter must associate requests with their owner; page IDs are not login.
    Python page files are trusted application code, never uploaded content.
    """

    def __init__(self, pages, *, runtime_url="/assets/gramlot.js",
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
        self.pages = Path(pages).resolve()
        self.runtime_url, self.main_url = runtime_url, main_url
        self.source_url, self.close_url, self.root_id = source_url, close_url, root_id
        self.page_ttl, self.max_pages = ttl, max_pages
        self._pages = {}

    def resolve_page(self, path):
        parts = path.strip("/").split("/") if path.strip("/") else ["index"]
        if any(not part.isidentifier() or part.startswith("_") for part in parts):
            raise PageNotFound("Invalid page path")
        filename = self.pages.joinpath(*parts).with_suffix(".py").resolve()
        if not filename.is_relative_to(self.pages) or not filename.is_file():
            raise PageNotFound("Page not found")
        spec = importlib.util.spec_from_file_location(f"gramlot_page_{uuid4().hex}", filename)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        cls = getattr(module, "Page", None)
        if not isinstance(cls, type) or not issubclass(cls, Page):
            raise TypeError("Page modules must expose a subclass of gramlot.Page")
        return cls

    def _prune(self):
        now = time.monotonic()
        self._pages = {key: record for key, record in self._pages.items() if record[0] > now}

    async def open_page(self, path, *, owner=None):
        cls = self.resolve_page(path)
        self._prune()
        if len(self._pages) >= self.max_pages:
            raise HostCapacity("Page registry capacity reached")
        page_id = uuid4().hex
        config = json.dumps({"pageId": page_id, "mainUrl": self.main_url,
                             "sourceUrl": self.source_url, "closeUrl": self.close_url,
                             "rootId": self.root_id}).replace("<", "\\u003c")
        runtime = json.dumps(self.runtime_url).replace("<", "\\u003c")
        document = HtmlBuilder()
        root = document.source.html()
        head = root.head()
        head.meta(charset="utf-8")
        head.title(cls.title)
        for url in cls.css:
            head.link(rel="stylesheet", href=url)
        body = root.body()
        body.div(id=self.root_id)
        body.script(f'import {{Gramlot}} from {runtime};'
                    f'const app = new Gramlot({config});window.gramlot=app;'
                    'await app.start();', type="module")
        markup = '<!doctype html>' + document.render()
        self._pages[page_id] = (time.monotonic() + self.page_ttl, cls, owner)
        return Bootstrap(page_id, markup)

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
