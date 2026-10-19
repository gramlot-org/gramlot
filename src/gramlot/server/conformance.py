"""Conformance check of a running adapter against the server protocol GC-230, over HTTP.

The JavaScript counterpart is ``js/src/server/conformance.js``: both run the
list of GC-230 §150 in the same order.
"""
import datetime
import json
import re
from uuid import uuid4
from http.cookies import SimpleCookie
from urllib.error import HTTPError
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener

from genro_tytx import from_tytx, to_tytx

OWNER_COOKIE = "gramlot_owner"
BOM = b"\xef\xbb\xbf"
BOOTSTRAP = re.compile(r'<script type="module" nonce="([^"]+)">import \{PageBootstrap\} from ("[^"]*");'
                       r'await new PageBootstrap\((\{.*?\})\)\.run\(\);</script>')


class _NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def _expect(rule, condition, message):
    if not condition:
        raise AssertionError(f"{rule}: {message}")


def check_protocol(base_url, page_path):
    """Run the checks of GC-230 §150 against the adapter at ``base_url`` (mount
    prefix included) with the page ``page_path``; raise ``AssertionError`` naming
    the rule of the first failure."""
    opener = build_opener(_NoRedirect)
    split = urlsplit(base_url)
    origin = f"{split.scheme}://{split.netloc}"
    prefix = split.path.rstrip("/")
    owner = {}

    def request(method, path, body=None, content_type="application/json", with_owner=True, owner_value=None):
        headers = {"Content-Type": content_type} if body is not None else {}
        if with_owner and owner:
            headers["Cookie"] = f"{OWNER_COOKIE}={owner_value or owner['value']}"
        try:
            with opener.open(Request(origin + path, data=body, method=method, headers=headers)) as response:
                return response.status, response.headers, response.read()
        except HTTPError as error:
            return error.code, error.headers, error.read()

    if prefix:
        status, headers, _ = request("GET", prefix)
        _expect("GC-230-105", status == 301 and (headers["Location"] or "").endswith(prefix + "/"),
                f"GET {prefix} answers {status}, not 301 to {prefix}/")

    page_url = prefix + page_path
    status, headers, body = request("GET", page_url)
    _expect("GC-230-115", status == 200 and headers.get_content_type() == "text/html",
            f"GET {page_url} answers {status} {headers['Content-Type']}, not 200 text/html")
    html = body.decode()
    match = BOOTSTRAP.search(html)
    _expect("GC-230-115", match is not None, f"GET {page_url} has no bootstrap module script")
    nonce, runtime_url, bootstrap = match[1], json.loads(match[2]), json.loads(match[3])
    config, resources = bootstrap["config"], bootstrap["resources"]
    _expect("GC-230-115", f'<script type="importmap" nonce="{nonce}">' in html,
            "the import map does not carry the bootstrap nonce")
    _expect("GC-230-115", isinstance(config.get("rpcUrl"), str) and isinstance(config.get("closeUrl"), str)
            and isinstance(config.get("capabilities"), list),
            f"bootstrap config {config!r} lacks rpcUrl, closeUrl or a capabilities array")
    syntax = config.get("nameSyntax")
    _expect("GC-230-010", isinstance(syntax, dict) and syntax.get("kind") == "regex"
            and isinstance(syntax.get("pattern"), str) and type(syntax.get("flags")) is int,
            f"bootstrap config nameSyntax {syntax!r} is not {{kind: 'regex', pattern, flags}}")
    expected = {"runtime": (runtime_url, "/assets/gramlot.js"), "rpc": (config["rpcUrl"], "/gramlot/rpc"),
                "close": (config["closeUrl"], "/gramlot/close")}
    for name, (url, path) in expected.items():
        _expect("GC-230-105", url == prefix + path, f"bootstrap {name} URL {url}, not {prefix + path}")

    policy = headers["Content-Security-Policy"]
    if policy is not None:
        _expect("GC-230-140", f"'nonce-{nonce}'" in policy, "the Content-Security-Policy lacks the bootstrap nonce")

    for line in headers.get_all("Set-Cookie") or []:
        morsel = SimpleCookie(line).get(OWNER_COOKIE)
        if morsel is not None:
            _expect("GC-230-135", morsel["httponly"] and morsel["samesite"].lower() == "lax"
                    and morsel["path"] == (prefix or "/"),
                    f"owner cookie without HttpOnly, SameSite=Lax and Path={prefix or '/'}")
            owner["value"] = morsel.value

    status, headers, _ = request("GET", runtime_url)
    _expect("GC-230-110", status == 200 and headers.get_content_type() == "text/javascript",
            f"GET {runtime_url} answers {status} {headers['Content-Type']}, not 200 text/javascript")
    status, _, _ = request("POST", runtime_url, b"{}")
    _expect("GC-230-110", status == 405, f"POST {runtime_url} answers {status}, not 405")

    files = [(url, "text/css") for url in resources["css"]]
    files += [(entry["url"], "text/javascript") for entry in resources["js"]]
    for url, media_type in files:
        if url.startswith("/") and not url.startswith("//"):
            status, headers, _ = request("GET", url)
            _expect("GC-230-145", status == 200 and headers.get_content_type() == media_type,
                    f"GET {url} answers {status} {headers['Content-Type']}, not 200 {media_type}")

    status, _, _ = request("GET", prefix + "/gramlot-conformance-missing-page")
    _expect("GC-230-115", status == 404, f"an unknown page answers {status}, not 404")
    for method in ("POST", "HEAD", "PUT", "DELETE", "PATCH"):
        status, headers, _ = request(method, page_url, None if method == "HEAD" else b"{}")
        allowed = [item.strip() for item in (headers["Allow"] or "").split(",")]
        _expect("GC-230-115", status == 405 and "GET" in allowed and method not in allowed,
                f"{method} {page_url} answers {status} with Allow {headers['Allow']!r}, not 405 with Allow: GET")
    if page_path.endswith("/"):
        status, headers, _ = request("GET", page_url + "index.html")
        _expect("GC-230-115", status == 200 and headers.get_content_type() == "text/html",
                f"GET {page_url}index.html answers {status}, not the page {page_url}")

    page_id, rpc = config["pageId"], config["rpcUrl"]

    def envelope(content_type, name, params=None, **fields):
        return {"id": uuid4().hex, "pageId": page_id, "contentType": content_type, "name": name,
                "params": {} if params is None else params, **fields}

    def call(sent, **options):
        """POST the envelope ``sent`` to rpc; return the status, headers and decoded response."""
        status, headers, body = request("POST", rpc, to_tytx(sent).encode(), **options)
        try:
            return status, headers, body, from_tytx(body.decode())
        except ValueError:
            return status, headers, body, None

    def outcome(rule, sent, code, label, **options):
        status, _, body, received = call(sent, **options)
        error = received.get("error") if isinstance(received, dict) else None
        _expect(rule, status == 200 and isinstance(error, dict) and error.get("code") == code,
                f"{label} answers {status} {body[:200]!r}, not 200 with the outcome {code}")
        return error

    status, _, _ = request("GET", rpc)
    _expect("GC-230-120", status == 405, f"GET {rpc} answers {status}, not 405")
    for path, rule, body in (
        (rpc, "GC-230-120", to_tytx(envelope("data", "check_endpoint", {"value": "invalid-byte"})).encode()),
        (config["closeUrl"], "GC-230-125", json.dumps({"pageId": page_id, "value": "invalid-byte"}).encode()),
    ):
        for content_type in ("text/plain", "application/jsonp", "application/json-extra", ""):
            status, _, _ = request("POST", path, body, content_type=content_type)
            _expect(rule, status == 415, f"{path} as {content_type!r} answers {status}, not 415")
        # Valid JSON syntax: a replacing decoder would dispatch this body instead of rejecting it.
        invalid_utf8 = body.replace(b"invalid-byte", b"\xffnvalid-byte")
        status, _, _ = request("POST", path, invalid_utf8)
        _expect(rule, status == 400,
                f"{path} with invalid UTF-8 inside a JSON string answers {status}, not 400")
    for content_type in ("Application/JSON", "application/json; charset=utf-8", "application/json ; charset=UTF-8"):
        status, _, body, received = call(envelope("data", "check_endpoint", {"value": "media-type"}),
                                       content_type=content_type)
        _expect("GC-230-120", status == 200 and isinstance(received, dict) and received.get("value") == "media-type",
                f"rpc as {content_type} answers {status} {body[:200]!r}, not the endpoint value")
        status, _, body = request("POST", config["closeUrl"], json.dumps({"pageId": "0" * 32}).encode(),
                                  content_type=content_type)
        try:
            closed = json.loads(body)
        except ValueError:
            closed = None
        _expect("GC-230-125", status == 200 and closed == {"ok": True},
                f"close as {content_type} answers {status} {body[:200]!r}, not 200 {{\"ok\": true}}")
    # A leading byte order mark is removed by the decoding of the body (GC-230 §120).
    status, _, body = request("POST", rpc, BOM + to_tytx(envelope("data", "check_endpoint", {"value": "bom"})).encode())
    try:
        received = from_tytx(body.decode())
    except ValueError:
        received = None
    _expect("GC-230-120", status == 200 and isinstance(received, dict) and received.get("value") == "bom",
            f"rpc with a leading byte order mark answers {status} {body[:200]!r}, not the endpoint value")
    status, _, body = request("POST", config["closeUrl"], BOM + json.dumps({"pageId": "0" * 32}).encode())
    try:
        closed = json.loads(body)
    except ValueError:
        closed = None
    _expect("GC-230-125", status == 200 and closed == {"ok": True},
            f"close with a leading byte order mark answers {status} {body[:200]!r}, not 200 {{\"ok\": true}}")
    status, _, _ = request("POST", rpc, b"{")
    _expect("GC-230-120", status == 400, f"rpc with invalid JSON answers {status}, not 400")
    invalid = {"without pageId": {key: value for key, value in envelope("source", "main").items() if key != "pageId"},
               "with params null": envelope("source", "main", params=None) | {"params": None},
               "with array params": envelope("source", "main") | {"params": []},
               "with an unknown contentType": envelope("other", "main")}
    for label, sent in invalid.items():
        status, _, _, _ = call(sent)
        _expect("GC-230-120", status == 400, f"rpc {label} answers {status}, not 400")

    sent = envelope("source", "main")
    status, headers, body, _ = call(sent)
    try:
        received = json.loads(body)
    except ValueError:
        received = None
    _expect("GC-230-020", status == 200 and headers.get_content_type() == "application/json"
            and isinstance(received, dict) and received.get("id") == sent["id"]
            and received.get("contentType") == "source" and isinstance(received.get("value"), str),
            f"main answers {status} {headers['Content-Type']} {body[:200]!r}, not 200 application/json with an "
            "envelope echoing id and contentType and carrying the fragment document as a string")
    # The page belongs to the browser that opened it: a request without its cookies, or with another owner,
    # reaches it only as page_expired, and its close message leaves the page open.
    outcome("GC-230-135", envelope("source", "main"), "page_expired", "main without the cookies of the page",
            with_owner=False)
    if owner:
        outcome("GC-230-135", envelope("source", "main"), "page_expired", "main with another owner cookie",
                owner_value=owner["value"] + "x")
    status, _, _ = request("POST", config["closeUrl"], json.dumps({"pageId": page_id}).encode(), with_owner=False)
    _expect("GC-230-135", status == 200, f"close without the cookies of the page answers {status}, not 200")
    status, _, body, received = call(envelope("data", "check_endpoint", {"value": "owned"}))
    _expect("GC-230-135", status == 200 and isinstance(received, dict) and received.get("value") == "owned",
            f"after a close without the cookies of the page, check_endpoint answers {status} {body[:200]!r}: "
            "the close of another owner closed the page")

    outcome("GC-230-025", envelope("source", "main") | {"pageId": "0" * 32}, "page_expired", "main of an unknown page")
    outcome("GC-230-025", envelope("source", "gramlot_conformance_missing"), "not_found", "an unknown fragment")
    outcome("GC-230-025", envelope("data", "gramlot_conformance_missing"), "not_found", "an unknown endpoint")
    outcome("GC-230-025", envelope("data", "main"), "not_found", "data main")
    # A method path never reaches a declared method through an inherited member.
    outcome("GC-230-025", envelope("data", "constructor"), "not_found", "data constructor")
    outcome("GC-230-025", envelope("data", "constructor.prototype.check_endpoint"), "not_found",
            "data constructor.prototype.check_endpoint")
    outcome("GC-230-025", envelope("source", "constructor.prototype.check_fragment"), "not_found",
            "source constructor.prototype.check_fragment")

    status, _, body, _ = call(envelope("source", "check_fragment", {"text": "gramlot-conformance"}))
    try:
        value = json.loads(body).get("value")
    except (ValueError, AttributeError):
        value = None
    _expect("GC-230-015", status == 200 and isinstance(value, str) and "gramlot-conformance" in value,
            f"check_fragment answers {status} {body[:200]!r}, not a fragment document with its params")
    # The date crosses the wire typed (::D) and comes back as the same typed value.
    for sent_value in (3, "x", datetime.date(2020, 1, 1)):
        status, _, body, received = call(envelope("data", "check_endpoint", {"value": sent_value}))
        value = received.get("value") if isinstance(received, dict) else None
        _expect("GC-230-015", status == 200 and type(value) is type(sent_value) and value == sent_value,
                f"check_endpoint of {sent_value!r} answers {status} {body[:200]!r}, not {sent_value!r}")

    if "auth" in config["capabilities"]:
        status, _, body, received = call(envelope("data", "check_endpoint_auth"))
        error = received.get("error") if isinstance(received, dict) else None
        _expect("GC-230-030", status == 200 and isinstance(received, dict) and (
                    "value" in received if "error" not in received
                    else isinstance(error, dict) and error.get("code") in ("not_authenticated", "not_authorized")),
                f"check_endpoint_auth answers {status} {body[:200]!r}, not 200 with not_authenticated, "
                "not_authorized or a value")
    else:
        outcome("GC-230-030", envelope("data", "check_endpoint_auth"), "not_authenticated", "check_endpoint_auth")

    status, _, body, _ = call(envelope("source", "check_fragment_auth"))
    try:
        value = json.loads(body).get("value")
    except (ValueError, AttributeError):
        value = None
    _expect("GC-230-030", status == 200 and isinstance(value, str) and "check-public" in value,
            f"check_fragment_auth answers {status} {body[:200]!r}, not a fragment document")
    if "auth" not in config["capabilities"]:
        _expect("GC-230-030", "check-refused" not in value,
                f"check_fragment_auth answers {value[:200]!r}, which contains the element of the refused auth rule")

    error = outcome("GC-230-025", envelope("data", "check_endpoint_raise"), "application_error", "check_endpoint_raise")
    _expect("GC-230-025", isinstance(error.get("name"), str) and error["name"] and error.get("message") == "check",
            f"check_endpoint_raise answers the error {error!r}, not the exception name and the message 'check'")

    close = config["closeUrl"]
    status, headers, body = request("POST", close, json.dumps({"pageId": page_id}).encode())
    try:
        closed = json.loads(body)
    except ValueError:
        closed = None
    _expect("GC-230-125", status == 200 and headers.get_content_type() == "application/json"
            and closed == {"ok": True}, f"close answers {status} {body!r}, not 200 {{\"ok\": true}}")
    outcome("GC-230-125", envelope("source", "main"), "page_expired", "main after close")
