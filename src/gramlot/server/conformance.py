"""Conformance check of a running adapter against the server protocol GC-230, over HTTP.

The JavaScript counterpart is ``js/src/server/conformance.js``: both run the
list of GC-230 §055 in the same order.
"""
import json
import re
from http.cookies import SimpleCookie
from urllib.error import HTTPError
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener

OWNER_COOKIE = "gramlot_owner"
MAX_REQUEST_BYTES = 4096
BOOTSTRAP = re.compile(r'<script type="module" nonce="([^"]+)">import \{PageBootstrap\} from ("[^"]*");'
                       r'await new PageBootstrap\((\{.*?\})\)\.run\(\);</script>')


class _NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def _expect(rule, condition, message):
    if not condition:
        raise AssertionError(f"{rule}: {message}")


def check_protocol(base_url, page_path):
    """Run the checks of GC-230 §055 against the adapter at ``base_url`` (mount
    prefix included) with the page ``page_path``; raise ``AssertionError`` naming
    the rule of the first failure."""
    opener = build_opener(_NoRedirect)
    split = urlsplit(base_url)
    origin = f"{split.scheme}://{split.netloc}"
    prefix = split.path.rstrip("/")
    owner = {}

    def request(method, path, body=None, content_type="application/json", with_owner=True):
        headers = {"Content-Type": content_type} if body is not None else {}
        if with_owner and owner:
            headers["Cookie"] = f"{OWNER_COOKIE}={owner['value']}"
        try:
            with opener.open(Request(origin + path, data=body, method=method, headers=headers)) as response:
                return response.status, response.headers, response.read()
        except HTTPError as error:
            return error.code, error.headers, error.read()

    def post(url, payload, **options):
        return request("POST", url, json.dumps(payload).encode(), **options)

    if prefix:
        status, headers, _ = request("GET", prefix)
        _expect("GC-230-010", status == 301 and (headers["Location"] or "").endswith(prefix + "/"),
                f"GET {prefix} answers {status}, not 301 to {prefix}/")

    page_url = prefix + page_path
    status, headers, body = request("GET", page_url)
    _expect("GC-230-020", status == 200 and headers.get_content_type() == "text/html",
            f"GET {page_url} answers {status} {headers['Content-Type']}, not 200 text/html")
    html = body.decode()
    match = BOOTSTRAP.search(html)
    _expect("GC-230-020", match is not None, f"GET {page_url} has no bootstrap module script")
    nonce, runtime_url, bootstrap = match[1], json.loads(match[2]), json.loads(match[3])
    config, resources = bootstrap["config"], bootstrap["resources"]
    _expect("GC-230-020", f'<script type="importmap" nonce="{nonce}">' in html,
            "the import map does not carry the bootstrap nonce")
    expected = {"runtime": (runtime_url, "/assets/gramlot.js"), "main": (config["mainUrl"], "/gramlot/main"),
                "source": (config["sourceUrl"], "/gramlot/source"), "close": (config["closeUrl"], "/gramlot/close")}
    for name, (url, path) in expected.items():
        _expect("GC-230-010", url == prefix + path, f"bootstrap {name} URL {url}, not {prefix + path}")

    policy = headers["Content-Security-Policy"]
    if policy is not None:
        _expect("GC-230-045", f"'nonce-{nonce}'" in policy, "the Content-Security-Policy lacks the bootstrap nonce")

    for line in headers.get_all("Set-Cookie") or []:
        morsel = SimpleCookie(line).get(OWNER_COOKIE)
        if morsel is not None:
            _expect("GC-230-040", morsel["httponly"] and morsel["samesite"].lower() == "lax"
                    and morsel["path"] == (prefix or "/"),
                    f"owner cookie without HttpOnly, SameSite=Lax and Path={prefix or '/'}")
            owner["value"] = morsel.value

    status, headers, _ = request("GET", runtime_url)
    _expect("GC-230-015", status == 200 and headers.get_content_type() == "text/javascript",
            f"GET {runtime_url} answers {status} {headers['Content-Type']}, not 200 text/javascript")
    status, _, _ = request("POST", runtime_url, b"{}")
    _expect("GC-230-015", status == 405, f"POST {runtime_url} answers {status}, not 405")

    files = [(url, "text/css") for url in resources["css"]]
    files += [(entry["url"], "text/javascript") for entry in resources["js"]]
    for url, media_type in files:
        if url.startswith("/") and not url.startswith("//"):
            status, headers, _ = request("GET", url)
            _expect("GC-230-050", status == 200 and headers.get_content_type() == media_type,
                    f"GET {url} answers {status} {headers['Content-Type']}, not 200 {media_type}")

    status, _, _ = request("GET", prefix + "/gramlot-conformance-missing-page")
    _expect("GC-230-020", status == 404, f"an unknown page answers {status}, not 404")
    status, _, _ = request("POST", page_url, b"{}")
    _expect("GC-230-020", status == 405, f"POST {page_url} answers {status}, not 405")
    if page_path.endswith("/"):
        status, headers, _ = request("GET", page_url + "index.html")
        _expect("GC-230-020", status == 200 and headers.get_content_type() == "text/html",
                f"GET {page_url}index.html answers {status}, not the page {page_url}")

    page_id, main = config["pageId"], config["mainUrl"]
    status, _, _ = request("GET", main)
    _expect("GC-230-025", status == 405, f"GET {main} answers {status}, not 405")
    status, _, _ = post(main, {"pageId": page_id}, content_type="text/plain")
    _expect("GC-230-025", status == 415, f"main as text/plain answers {status}, not 415")
    status, _, _ = request("POST", main, b"{")
    _expect("GC-230-025", status == 400, f"main with invalid JSON answers {status}, not 400")
    status, _, _ = post(main, {})
    _expect("GC-230-025", status == 400, f"main without pageId answers {status}, not 400")
    status, _, _ = post(main, {"pageId": page_id, "padding": "x" * MAX_REQUEST_BYTES})
    _expect("GC-230-025", status == 413, f"main above {MAX_REQUEST_BYTES} bytes answers {status}, not 413")

    status, headers, body = post(main, {"pageId": page_id})
    _expect("GC-230-030", status == 200 and headers.get_content_type() == "application/json" and body,
            f"main answers {status} {headers['Content-Type']}, not 200 application/json with the Source")
    if owner:
        status, _, _ = post(main, {"pageId": page_id}, with_owner=False)
        _expect("GC-230-040", status == 404, f"main without the owner cookie answers {status}, not 404")
    status, _, _ = post(main, {"pageId": "0" * 32})
    _expect("GC-230-035", status == 404, f"main of an unknown page answers {status}, not 404")

    source = config["sourceUrl"]
    status, _, _ = post(source, {"pageId": page_id})
    _expect("GC-230-025", status == 400, f"Source without method answers {status}, not 400")
    status, _, _ = post(source, {"pageId": page_id, "method": "details", "params": []})
    _expect("GC-230-025", status == 400, f"Source with array params answers {status}, not 400")
    status, _, _ = post(source, {"pageId": page_id, "method": "gramlot_conformance_missing"})
    _expect("GC-230-035", status == 404, f"an unknown Source method answers {status}, not 404")

    close = config["closeUrl"]
    status, headers, body = post(close, {"pageId": page_id})
    try:
        closed = json.loads(body)
    except ValueError:
        closed = None
    _expect("GC-230-030", status == 200 and headers.get_content_type() == "application/json"
            and closed == {"ok": True}, f"close answers {status} {body!r}, not 200 {{\"ok\": true}}")
    status, _, _ = post(main, {"pageId": page_id})
    _expect("GC-230-030", status == 404, f"main after close answers {status}, not 404")
