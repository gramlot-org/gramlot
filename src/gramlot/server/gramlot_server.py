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

from ..page.base import Page, resolve_declared
from ..page.builder import GramlotBuilder
from ..page.name_syntax import NAME_SYNTAX
from .assets import gramlot_dev
from .resources import SEGMENT, InvalidResourceName, load_order


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


def _theme_name(value):
    """Whether ``value`` names a theme: one segment of letters, digits, ``_`` or ``-`` (a folder of ``themes/``)."""
    return isinstance(value, str) and SEGMENT.fullmatch(value) is not None


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

    ``css_theme`` is the base theme of every page, the name of a folder of the core themes
    (``/themes/<name>/theme.css``), or ``False`` for no base theme; a page replaces it with
    ``Page.css_theme``. The methods shared by every adapter, whatever its transport, are
    ``decode_body`` (the request body), ``call`` (the request envelope), ``close`` (the close
    message), ``open_page`` and ``close_all``.
    """

    def __init__(self, *, runtime_url="/assets/gramlot.js",
                 rpc_url="/gramlot/rpc", close_url="/gramlot/close",
                 root_id="gramlot-root",
                 page_ttl=1800, max_pages=1000, collections=(), css_theme="gramlot-base"):
        if css_theme is not False and not _theme_name(css_theme):
            raise ValueError(f"The base theme must be a theme name or False, not {css_theme!r}")
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
        self.collections = tuple(collections)
        self.css_theme = css_theme

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

    @property
    def name_syntax(self):
        """The ``NameSyntax`` of the method names a request may carry, announced in the bootstrap
        (``nameSyntax``) and given to the builders of the pages. The core resolves dotted paths from
        the page (``NAME_SYNTAX``); a subclass may narrow it, and a subclass with another syntax
        resolves its names itself."""
        return NAME_SYNTAX

    @property
    def server_adapter(self):
        """The URL of the module whose default export is the ``ServerAdapter`` class of the browser
        (GC-230 §010), or ``None`` for the HTTP ``ServerAdapter`` of the core runtime. The module
        imports the core from ``@gramlot/gramlot/page``, which the import map points at the runtime."""
        return None

    def evaluate_auth(self, rule, *, owner, identity):
        """Return ``None`` when a target with ``rule`` may run for ``owner`` with ``identity`` (the
        identity the adapter passed with the call, ``None`` when it passed none), else
        ``"not_authenticated"`` or ``"not_authorized"``. The base server knows no identity: any rule
        is closed."""
        return None if rule is None else "not_authenticated"

    def _auth_outcome(self, rule, owner, identity):
        """``evaluate_auth`` with its result checked: a value other than ``None``,
        ``"not_authenticated"`` and ``"not_authorized"`` is a ``TypeError``."""
        refused = self.evaluate_auth(rule, owner=owner, identity=identity)
        if refused not in (None, "not_authenticated", "not_authorized"):
            raise TypeError("evaluate_auth must return None, 'not_authenticated' or 'not_authorized'")
        return refused

    def _prune(self):
        now = time.monotonic()
        self._pages = {key: record for key, record in self._pages.items() if record[0] > now}

    async def page_manifest(self, *, prefix=""):
        """Return the root app manifest without creating a page session."""
        cls = self.resolve_page("/")
        if cls.installable is not True:
            raise PageNotFound("The root page is not installable")
        result = cls().manifest(base_url=prefix + "/")
        if inspect.isawaitable(result):
            result = await result
        if not isinstance(result, dict):
            raise TypeError("Page.manifest must return a JSON object")
        try:
            json.dumps(result, allow_nan=False)
        except (TypeError, ValueError) as error:
            raise TypeError("Page.manifest must return a JSON object") from error
        return result

    def theme_css(self, cls):
        """The CSS URL of the theme of the page class ``cls``, in a list, or an empty list:
        ``Page.css_theme`` when it is a theme name, no theme when it is ``False``, the base
        theme of the server (``css_theme``) when it is ``None``. Another value raises
        ``InvalidResourceName``."""
        theme = self.css_theme if cls.css_theme is None else cls.css_theme
        if theme is False:
            return []
        if not _theme_name(theme):
            raise InvalidResourceName(f"Page.css_theme must be None, False or a theme name, not {theme!r}")
        return [f"/themes/{theme}/theme.css"]

    async def open_page(self, path, *, owner=None, prefix=""):
        """Register the page and return its bootstrap. ``prefix`` is the mount prefix
        chosen by the adapter, added once to the root-relative bootstrap URLs. As on a
        static host, ``<path>/index.html`` opens the page ``<path>/`` and ``/index.html``
        the index. The CSS of the page is its theme (``theme_css``), then the CSS of
        ``resolve_resources``, each URL once in its last position."""
        if not isinstance(prefix, str):
            raise TypeError("Mount prefix must be a string")
        if path.endswith("/index.html"):
            path = path.removesuffix("index.html")
        cls = self.resolve_page(path)
        if not isinstance(cls, type) or not issubclass(cls, Page) or cls is Page:
            raise TypeError("Page modules must expose a subclass of gramlot.Page")
        resolved = self.resolve_resources(path, cls)
        resources = load_order({**resolved, "css": [*self.theme_css(cls), *resolved["css"]]})
        self._prune()
        if len(self._pages) >= self.max_pages:
            raise ServerCapacity("Page registry capacity reached")
        page_id = uuid4().hex
        # Registered before the bootstrap is written, and removed if writing it fails, as in JavaScript.
        self._pages[page_id] = (time.monotonic() + self.page_ttl, cls, owner)
        try:
            nonce = secrets.token_urlsafe(16)
            # The CSS links and the JS modules reach the page through PageBootstrap (§4.12, D9);
            # the compact JSON gives the same text as the JavaScript server.
            bootstrap = _script_json({
                "config": {"pageId": page_id, "rpcUrl": _prefixed(prefix, self.rpc_url),
                           "closeUrl": _prefixed(prefix, self.close_url), "rootId": self.root_id,
                           "capabilities": self.capabilities, "nameSyntax": self.name_syntax.to_dict(),
                           **({"devices": list(cls.devices)} if cls.devices else {}),
                           **({"locale": cls.locale} if cls.locale is not None else {}),
                           **({"timeZone": cls.time_zone} if cls.time_zone is not None else {})},
                "resources": {**({"collections": [_prefixed(prefix, item["module"]) for item in self.collections]}
                                 if self.collections else {}),
                              "css": [_prefixed(prefix, url) for url in resources["css"]],
                              "js": [{"url": _prefixed(prefix, entry["url"]), "group": entry["group"]}
                                     for entry in resources["js"]],
                              **({"serverAdapter": _prefixed(prefix, self.server_adapter)}
                                 if self.server_adapter is not None else {})}})
            runtime = _script_json(_prefixed(prefix, self.runtime_url))
            document = GramlotBuilder()
            root = document.source.html()
            head = root.head()
            head.meta(charset="utf-8")
            head.meta(name="viewport", content="width=device-width,initial-scale=1")
            head.title(cls.title)
            if path.strip("/") in ("", "index") and cls.installable is True:
                head.link(rel="manifest", href=prefix + "/app.webmanifest")
            # A page module served for its Logic imports the core from the runtime already loaded.
            head.script(_script_json({"imports": {"@gramlot/gramlot/page": _prefixed(prefix, self.runtime_url)}}),
                        type="importmap", nonce=nonce)
            body = root.body()
            body.div(id=self.root_id)
            body.script(f'import {{PageBootstrap}} from {runtime};'
                        f'await new PageBootstrap({bootstrap}).run();', type="module", nonce=nonce)
            markup = document.render(doctype=True)
        except BaseException:
            self.close_page(page_id, owner=owner)
            raise
        return Bootstrap(page_id, markup, nonce)

    def decode_body(self, data):
        """The text of a request body, ``data`` as bytes: UTF-8, a leading byte order mark removed
        (GC-230 §120). Bytes that are not UTF-8 raise ``InvalidRequest``."""
        try:
            return data.decode("utf-8-sig")
        except UnicodeDecodeError as error:
            raise InvalidRequest("Request body is not UTF-8") from error

    async def call(self, text, *, owner=None, identity=None):
        """Answer the request envelope ``text`` (TYTX) with the response envelope (TYTX).
        Raises only ``InvalidRequest``; every other failure is an outcome in the response,
        a value that TYTX cannot serialise included. ``identity`` is the identity of this
        call (for example the avatar of a login), read only by ``evaluate_auth``; the server
        keeps nothing of it."""
        request = _parse_request(text)
        response = {"id": request["id"], "contentType": request["contentType"]}
        try:
            response["value"] = await self._run(request, owner, identity)
            return to_tytx(response)
        except Exception as error:
            response.pop("value", None)
            response["error"] = {"code": OUTCOME_CODES.get(type(error), "application_error"),
                                 "name": type(error).__name__, "message": str(error)}
            if gramlot_dev() == "DEBUG":
                response["error"]["details"] = traceback.format_exc()
        return to_tytx(response)

    async def _run(self, request, owner, identity):
        """Run the fragment or endpoint of a checked request: the value of the response. ``name`` is
        ``main``, a method of the page or a path ``a.b.c.method`` read from the page
        (``resolve_declared``) that ``name_syntax`` matches; the ``auth`` of the method's marker is
        its only authorization."""
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
            marker = "__gramlot_source__" if source else "__gramlot_endpoint__"
            declared = resolve_declared(page, name, marker) if self.name_syntax.matches(name) else None
            if declared is None:
                raise SourceNotFound(f"Unknown Source method: {name}") if source else EndpointNotFound(
                    f"Unknown endpoint: {name}")
            instance, method = declared
            function = method.__get__(instance, type(instance))
            rule = getattr(method, marker)["auth"]
        refused = self._auth_outcome(rule, owner, identity)
        if refused is not None:
            raise {OUTCOME_CODES[cls]: cls for cls in (NotAuthenticated, NotAuthorized)}[refused](
                f"Access refused: {name}")
        if not source:
            result = function(**params)
            return await result if inspect.isawaitable(result) else result
        builder = page.source_builder(name, auth=lambda element_rule: self._auth_outcome(element_rule, owner, identity),
                                      name_syntax=self.name_syntax)
        for collection in self.collections:
            builder.load_collection(collection["grammar"])
        result = function(builder.root, **params)
        if inspect.isawaitable(result):
            result = await result
        if result is not None:
            raise TypeError("Source methods must build into root and return None")
        return builder.to_tytx()

    def close(self, text, *, owner=None):
        """Close the page named by the close message ``text``, ``{"pageId": str}`` as JSON, when
        ``owner`` owns it (GC-230 §125); an unknown or unowned page is left as it is. A text that is
        not JSON, or whose ``pageId`` is not a string, raises ``InvalidRequest``."""
        try:
            message = json.loads(text)
        except ValueError as error:
            raise InvalidRequest("Close message is not JSON") from error
        if not isinstance(message, dict) or not isinstance(message.get("pageId"), str):
            raise InvalidRequest("Close message pageId must be a string")
        self.close_page(message["pageId"], owner=owner)

    def close_page(self, page_id, *, owner=None):
        record = self._pages.get(page_id)
        if record is not None and record[2] == owner:
            del self._pages[page_id]

    def close_all(self):
        """Forget every registered page; adapters call it on shutdown."""
        self._pages = {}
