"""Neutral server foundation: no HTTP framework, event loop or ASGI dependency."""

from urllib.parse import quote
from copy import deepcopy
from ..collection import collection_graph, page_collections

import inspect
import json
import math
import secrets
import time
import traceback
from dataclasses import dataclass
from uuid import uuid4
from genro_bag import Bag
from genro_tytx import from_tytx, to_tytx

from ..page.base import Page, resolve_declared
from ..page.builder import GramlotBuilder
from ..page.page_store import PageStore
from ..page.name_syntax import NAME_SYNTAX
from .assets import gramlot_dev
from .files import THEMES, file_below
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
    message), ``open_page``, ``close_all`` and ``theme_file`` (the file of a ``/themes/`` URL).

    A page expires ``page_ttl`` seconds after its last use: opening it and every call that names
    it for its owner move the expiry to now plus ``page_ttl`` (GC-230 §010).
    """

    def __init__(self, *, runtime_url="/assets/gramlot.js",
                 rpc_url="/gramlot/rpc", close_url="/gramlot/close",
                 root_id="gramlot-root",
                 page_ttl=1800, max_pages=1000, collections=(), css_theme="gramlot-base",
                 websocket_url=None):
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
        self._page_stores = {}
        self._database_access = None
        self._page_channels = {}
        self.websocket_url = websocket_url
        self.collections = collection_graph(collections)
        self._environment_pages = {}
        self._collection_documents = {}
        self._prepared_grammars = {}
        self.css_theme = css_theme

    def resolve_page(self, path):
        """Return the ``Page`` class of ``path``, or raise ``PageNotFound``."""
        raise PageNotFound(f"Page not found: {path}")

    def iter_page_classes(self):
        """Enumerate trusted classes for process startup; providers must implement this."""
        raise NotImplementedError('The host must enumerate its trusted page classes')

    def collection_url(self, collection, path):
        """Map a registered package resource to a root-relative host URL."""
        raise NotImplementedError('The host must expose verified collection resources')

    def page_collections(self, cls):
        return collection_graph((*self.collections, *page_collections(cls)))

    def _environment_page(self, cls):
        """Bind the environment's collections without mutating the imported Page class."""
        if not self.collections:
            return cls
        if cls not in self._environment_pages:
            self._environment_pages[cls] = type(cls.__name__, (cls,), {
                "__module__": cls.__module__, "gramlots": self.page_collections(cls),
            })
        return self._environment_pages[cls]

    def _collection_document(self, collection):
        """Verify an immutable descriptor once per server, retaining only its grammar."""
        if collection not in self._collection_documents:
            content = collection.verify()
            self._collection_documents[collection] = json.loads(content[collection.grammar])
        return self._collection_documents[collection]

    def _load_collections(self, builder, collections):
        """Reuse compilation, never the mutable schema or Source of another request."""
        if not collections:
            return
        initial = builder._collection.to_document() if builder._collection is not None else None
        key = (type(builder), collections, json.dumps(initial, allow_nan=False))
        prepared = self._prepared_grammars.get(key)
        if prepared is None:
            for collection in collections:
                builder.load_collection(self._collection_document(collection))
            prepared = (builder._schema.deepcopy(), dict(builder._schema_tag_names),
                        deepcopy(builder._collection))
            self._prepared_grammars[key] = prepared
        else:
            schema, names, collection = prepared
            builder._schema = schema.deepcopy()
            builder._schema_tag_names = dict(names)
            builder._collection = deepcopy(collection)

    def resolve_page_store(self, page_class):
        """The PageStore class of this page; a plain server provides an empty store."""
        return PageStore

    def page_store(self, page_id, *, owner):
        """Get and renew a live store only for the registered page's owner."""
        self._prune()
        record = self._pages.get(page_id)
        if record is None or owner is None or record[2] != owner:
            raise PageExpired("Unknown, expired or unowned page")
        self._pages[page_id] = (self._expiry(), *record[1:])
        return self._page_stores[page_id]

    def connect_page_channel(self, page_id, send, *, owner):
        """Register an adapter's outbound channel until the page closes."""
        self.page_store(page_id, owner=owner)
        if not callable(send):
            raise TypeError("Page channel requires a send callback")
        if page_id in self._page_channels:
            raise ValueError("Page already has a channel")
        self._page_channels[page_id] = send

    def publish_to_page(self, topic, payload, *, source_page_id, page_id, owner):
        """Enqueue an event for a connected browser page of the source's owner."""
        if not isinstance(page_id, str) or not page_id:
            raise InvalidRequest("Publication page_id must be a nonempty string")
        if not isinstance(topic, str) or not topic:
            raise InvalidRequest("Publication topic must be a nonempty string")
        if not isinstance(payload, dict) or any(not isinstance(key, str) for key in payload):
            raise InvalidRequest("Publication payload must contain named data")
        self.page_store(source_page_id, owner=owner)
        self.page_store(page_id, owner=owner)
        send = self._page_channels.get(page_id)
        if send is None:
            raise PageExpired("Page has no connected channel")
        send(to_tytx(dict(op="publish", pageId=page_id, topic=topic, payload=payload,
                         metadata={"pageId": source_page_id})))

    def prepare_publish(self, text, *, owner):
        """Validate publication; return an acceptance wire and deferred subscriber dispatch."""
        try:
            message = from_tytx(text)
        except Exception as error:
            raise InvalidRequest("Publication is not TYTX text") from error
        if not isinstance(message, dict) or message.get("op") != "publish":
            raise InvalidRequest("Expected a publication envelope")
        if not isinstance(message.get("id"), str) or not message["id"]:
            raise InvalidRequest("Publication id must be a nonempty string")
        response = {"id": message["id"], "contentType": "data"}
        dispatch = None
        try:
            if set(message) - {"op", "id", "pageId", "targetPageId", "topic", "payload"}:
                raise InvalidRequest("Unknown publication fields")
            for field in ("pageId", "topic"):
                if not isinstance(message.get(field), str) or not message[field]:
                    raise InvalidRequest(f"Publication {field} must be a nonempty string")
            target = message.get("targetPageId", message["pageId"])
            if not isinstance(target, str) or not target:
                raise InvalidRequest("Publication targetPageId must be a nonempty string")
            payload = message.get("payload")
            if not isinstance(payload, dict) or any(not isinstance(key, str) for key in payload):
                raise InvalidRequest("Publication payload must contain named data")
            # Neither a destination ID nor client-supplied data replaces the sender's owner.
            self.page_store(message["pageId"], owner=owner)
            destination = self.page_store(target, owner=owner)
            metadata = {"pageId": message["pageId"]}
            dispatch = lambda: destination.publish(message["topic"], payload, metadata=metadata)
            response["value"] = "ok"
        except Exception as error:
            response["error"] = {
                "code": "invalid_request" if isinstance(error, InvalidRequest)
                else OUTCOME_CODES.get(type(error), "application_error"),
                "name": type(error).__name__, "message": str(error)}
            if gramlot_dev() == "DEBUG":
                response["error"]["details"] = traceback.format_exc()
        return to_tytx(response), dispatch

    def resolve_resources(self, path, cls):
        """Return ``{"css": [url], "js": [{"url": url, "group": str | None}]}``, in load
        order and without mount prefix, or raise ``PageNotFound``."""
        raise PageNotFound(f"Page resources not found: {path}")

    def resolve_data(self, path):
        """Optional initial Data Bag for this page path; absent in the neutral server."""
        return None

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

    def _expiry(self):
        """The expiry of a page used now: ``page_ttl`` seconds from now."""
        return time.monotonic() + self.page_ttl

    def _prune(self):
        now = time.monotonic()
        for page_id, record in list(self._pages.items()):
            if record[0] <= now:
                self.close_page(page_id, owner=record[2])

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

    def theme_file(self, path):
        """The file of the URL path ``path`` (``/themes/<path>``, mount prefix removed,
        percent-decoded) when its real path is a file inside the themes folder of the core
        (``gramlot/resources/themes``), else ``None`` (GC-230 §145). The adapter adds the HTTP
        part (methods, media types, headers)."""
        if not path.startswith("/themes/"):
            return None
        return file_below(THEMES, path.removeprefix("/themes/"))

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
        cls = self._environment_page(cls)
        selected = self.page_collections(cls)
        for collection in selected:
            self._collection_document(collection)
        resolved = self.resolve_resources(path, cls)
        collection_css = [self.collection_url(c, path) for c in selected for path in c.css]
        resources = load_order({**resolved, "css": [*self.theme_css(cls), *collection_css, *resolved["css"]]})
        collection_records = [{"name": c.name, "url": _prefixed(prefix, self.collection_url(c, c.module)),
                               "buildId": c.build_id} for c in selected]
        self._prune()
        if len(self._pages) >= self.max_pages:
            raise ServerCapacity("Page registry capacity reached")
        page_id = uuid4().hex
        # Registered before the bootstrap is written, and removed if writing it fails, as in JavaScript.
        self._pages[page_id] = (self._expiry(), cls, owner, path)
        try:
            store_class = self.resolve_page_store(cls)
            if self.websocket_url is not None or store_class is not PageStore:
                if not isinstance(store_class, type) or not issubclass(store_class, PageStore):
                    raise TypeError("PageStore must subclass gramlot.PageStore")
                store = store_class()
                store._database_access = self._database_access
                self._page_stores[page_id] = store
                store._publish_to_page = lambda topic, payload, target: self.publish_to_page(
                    topic, payload, source_page_id=page_id, page_id=target, owner=owner)
                await self._invoke(store.start)
            nonce = secrets.token_urlsafe(16)
            # The CSS links and the JS modules reach the page through PageBootstrap (§4.12, D9);
            # the compact JSON gives the same text as the JavaScript server.
            bootstrap = _script_json({
                "config": {"pageId": page_id, "rpcUrl": _prefixed(prefix, self.rpc_url),
                           "closeUrl": _prefixed(prefix, self.close_url), "rootId": self.root_id,
                           "capabilities": self.capabilities, "nameSyntax": self.name_syntax.to_dict(),
                           **({"websocketUrl": _prefixed(prefix, self.websocket_url)}
                              if self.websocket_url is not None else {}),
                           **({"devices": list(cls.devices)} if cls.devices else {}),
                           **({"locale": cls.locale} if cls.locale is not None else {}),
                           **({"timeZone": cls.time_zone} if cls.time_zone is not None else {})},
                "resources": {"collections": collection_records,
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
            head.script(_script_json({"imports": {"@gramlot/gramlot/page": _prefixed(prefix, self.runtime_url),
                                                "@gramlot/gramlot": _prefixed(prefix, self.runtime_url),
                                                "@gramlot/gramlot/components": _prefixed(prefix, self.runtime_url),
                                                **{"@gramlot/collections/" + quote(item["name"], safe="-_.!~*'()"):
                                                   item["url"] for item in collection_records}}}),
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
            if request["contentType"] == "source" and request["name"] == "main":
                data = self.resolve_data(self._pages[request["pageId"]][3])
                if data is not None:
                    if not isinstance(data, Bag):
                        raise TypeError("Initial page data must be a Bag")
                    response["data"] = data
            return to_tytx(response)
        except Exception as error:
            response.pop("value", None)
            response.pop("data", None)
            response["error"] = {"code": OUTCOME_CODES.get(type(error), "application_error"),
                                 "name": type(error).__name__, "message": str(error)}
            if gramlot_dev() == "DEBUG":
                response["error"]["details"] = traceback.format_exc()
        return to_tytx(response)

    async def _invoke(self, function, *args, **kwargs):
        """Execute page/store code; adapters may supply their native worker policy."""
        result = function(*args, **kwargs)
        return await result if inspect.isawaitable(result) else result

    async def _run(self, request, owner, identity):
        """Run the fragment or endpoint of a checked request: the value of the response. ``name`` is
        ``main``, a method of the page or a path ``a.b.c.method`` read from the page
        (``resolve_declared``) that ``name_syntax`` matches; the ``auth`` of the method's marker is
        its only authorization. A call that names a page of its owner that has not expired renews the
        page, whatever the outcome of the method; any other call renews nothing (GC-230 §010)."""
        self._prune()
        record = self._pages.get(request["pageId"])
        if record is None or record[2] != owner:
            raise PageExpired("Unknown, expired or unowned page")
        self._pages[request["pageId"]] = (self._expiry(), *record[1:])
        page = record[1]()
        page._database_access = self._database_access
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
            return await self._invoke(function, **params)
        builder = page.source_builder(name, auth=lambda element_rule: self._auth_outcome(element_rule, owner, identity),
                                      name_syntax=self.name_syntax)
        self._load_collections(builder, self.page_collections(type(page)))
        result = await self._invoke(function, builder.root, **params)
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
            self._page_channels.pop(page_id, None)
            store = self._page_stores.pop(page_id, None)
            if store is not None:
                store.close()

    def close_all(self):
        """Forget every registered page; adapters call it on shutdown."""
        self._pages = {}
        self._page_channels.clear()
        for store in self._page_stores.values():
            store.close()
        self._page_stores.clear()
