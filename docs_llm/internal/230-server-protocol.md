# 230 · Server protocol

Document ID: **GC-230**. Started: **2026-10-08** (0.2.12). This document states the
protocol between the browser runtime and every adapter that serves Gramlot pages
over HTTP. The internal technique of an adapter is free; what it exposes is this.
Each rule cites the core line that implements it: the server `GramlotServer`
(`src/gramlot/server/gramlot_server.py`, `js/src/server/gramlot-server.js`) and the
two reference adapters of the core (`tests/http_server.py`, `scripts/fixture_servers.mjs`).
The URLs are written without the mount prefix (§010).

<a id="gc-230-005"></a>

## 005 · Scope

Block ID: **GC-230-005**.

- `GramlotServer` builds the bootstrap HTML and the Sources and keeps the page
  registry; it has no HTTP engine. An adapter connects it to a framework and owns
  the HTTP layer stated here: routing, request bodies, status codes, cookies and
  headers.
- The serverless Worker transport does not use HTTP; it is outside this document.
- Owner, 2026-10-08: rules on `GramlotServer` and on the protocol, a document in
  the core and a conformance test for every adapter; the adapter technique is free.

<a id="gc-230-010"></a>

## 010 · Mount prefix

Block ID: **GC-230-010**.

- An adapter may serve Gramlot below a mount prefix (`/py`). Every URL of this
  document is then below the prefix; the adapter removes the prefix before
  dispatching and answers 404 to paths outside it.
- The prefix without its final slash answers **301** to the prefix with the slash,
  query string kept: pages link each other with relative URLs
  (`tests/http_server.py:58-63`, `scripts/fixture_servers.mjs:82-86`).
- `open_page`/`openPage` adds the prefix once to the root-relative URLs of the
  bootstrap (`/…`, not `//…`); relative and absolute URLs stay as written
  (`gramlot_server.py:40-43`, `gramlot-server.js:27`).
- The bootstrap URLs are the defaults of `GramlotServer`: runtime
  `/assets/gramlot.js`, `main` `/gramlot/main`, `source` `/gramlot/source`,
  `close` `/gramlot/close` (`gramlot_server.py:63-64`, `gramlot-server.js:34-35`).

<a id="gc-230-015"></a>

## 015 · Runtime URL

Block ID: **GC-230-015**.

- `GET` and `HEAD` of `/assets/gramlot.js` answer **200** with a `text/javascript`
  media type; any other method answers **405**.
- The file served is the one `runtime_asset()`/`runtimeAsset()` chooses:
  `gramlot.js` with `GRAMLOT_DEV=DEBUG`, `gramlot.min.js` otherwise; the URL is the
  same for both (`assets.py:16`, `assets.js:26`).

<a id="gc-230-020"></a>

## 020 · Page request

Block ID: **GC-230-020**.

- `GET` of a page path answers **200** `text/html` with the bootstrap of
  `open_page`/`openPage` (`gramlot_server.py:92-130`, `gramlot-server.js:73-104`):
  doctype, `<title>` from `Page.title`, an import map mapping
  `@gramlot/gramlot/page` to the runtime URL, the root `div` (`gramlot-root`), and a
  module script that imports `PageBootstrap` from the runtime URL and runs it with
  `{config: {pageId, mainUrl, sourceUrl, closeUrl, rootId}, resources: {css, js}}`.
- The import map and the module script carry the same nonce, 16 random bytes in
  URL-safe base64 (`gramlot_server.py:105`, `gramlot-server.js:77`).
- A page that does not exist answers **404** (`PageNotFound`). Any method other
  than `GET` on a page path answers **405**.
- As on a static host, `<path>/index.html` opens the page `<path>/` and
  `/index.html` the index (`tests/http_server.py:80-82`,
  `scripts/fixture_servers.mjs:101-102`).

<a id="gc-230-025"></a>

## 025 · Operation requests

Block ID: **GC-230-025**.

- `main`, `source` and `close` accept **POST** only (**405** otherwise) with
  `Content-Type: application/json` (**415** otherwise).
- The body is at most **4096 bytes** (**413** above) and is a JSON object with a
  string `pageId` (**400** otherwise) (`tests/http_server.py:95-107`,
  `scripts/fixture_servers.mjs:48-58`).
- `source` also carries a string `method` and optional `params`, a JSON object;
  any other `method` or `params` answers **400** (`tests/http_server.py:113-116`,
  `scripts/fixture_servers.mjs:64-67`). `GramlotServer.source` rejects the same
  input with `TypeError` (`gramlot_server.py:138-139`, `gramlot-server.js:113-115`):
  the adapter answers before calling it.

<a id="gc-230-030"></a>

## 030 · Operation responses

Block ID: **GC-230-030**.

- `main` and `source` answer **200** `application/json`; the body is the TYTX text
  of the Source built by the page method (`gramlot_server.py:142-162`,
  `gramlot-server.js:119-131`).
- `close` answers **200** `application/json` with `{"ok": true}` and removes the
  page owned by the requester (`gramlot_server.py:164-167`,
  `gramlot-server.js:133-135`); afterwards the `pageId` is unknown (§035).
- On shutdown an adapter calls `close_all()`/`closeAll()` (`gramlot_server.py:169`,
  `gramlot-server.js:138`).

<a id="gc-230-035"></a>

## 035 · Error status codes

Block ID: **GC-230-035**.

| Status | Cause | Core |
|---|---|---|
| 400 | Invalid JSON body, missing `pageId`, invalid `method`/`params` | §025 |
| 404 | `PageNotFound` (page GET); `PageExpired` (unknown, expired or unowned `pageId`); `SourceNotFound` (unknown Source method) | `gramlot_server.py:145-154`, `gramlot-server.js:122-126` |
| 405 | Method not allowed on the URL | §015, §020, §025 |
| 413 | Body above 4096 bytes | §025 |
| 415 | Body not `application/json` | §025 |
| 503 | `ServerCapacity`: the page registry is full at page GET | `gramlot_server.py:101-103`, `gramlot-server.js:64-65` |

<a id="gc-230-040"></a>

## 040 · Owner cookie

Block ID: **GC-230-040**.

- `GramlotServer` registers each page with an owner and answers `PageExpired` to
  every operation of another owner (`gramlot_server.py:145`,
  `gramlot-server.js:122`). Page IDs are not login.
- An adapter that identifies the owner by cookie names it `gramlot_owner`, sets it
  on the page response with `Path=<prefix or />; HttpOnly; SameSite=Lax`, reuses
  the value the browser already sends, and passes it as `owner` to every operation
  (`tests/http_server.py:83-90`, `scripts/fixture_servers.mjs:103-105`).
- An adapter may take the owner from its own identity system instead; without one,
  the owner is null for every request.

<a id="gc-230-045"></a>

## 045 · Content-Security-Policy

Block ID: **GC-230-045**.

- The policy belongs to the application. When an adapter is given one, it sends it
  as the `Content-Security-Policy` header of each page response, with `{nonce}`
  replaced by the bootstrap nonce of that response (`tests/http_server.py:91-92`,
  `scripts/fixture_servers.mjs:106`), so the header allows the two bootstrap scripts
  (§020).

<a id="gc-230-050"></a>

## 050 · Themes and companion files

Block ID: **GC-230-050**.

- `GET`/`HEAD` of `/themes/<path>` answer the file of the core themes whose real
  path is inside their folder, with the media type of its extension.
- `GET`/`HEAD` of a `.css` or `.js` URL answer the file whose real path is below
  the pages folder: page modules, companions `foo.css`, `foo_aux.js` and `Page.css`
  files placed there; any other file of the folder is not served
  (`gramlot_file_server.py:89`, `gramlot-file-server.js:112`;
  `tests/http_server.py:47-53`, `scripts/fixture_servers.mjs:27-37`).
- Every root-relative URL of the bootstrap `resources` answers **200** with
  `text/css` (CSS) or `text/javascript` (JS).

<a id="gc-230-055"></a>

## 055 · Conformance check

Block ID: **GC-230-055**.

`check_protocol(base_url, page_path)` (Python, `gramlot.server`,
`src/gramlot/server/conformance.py:29`) and `checkProtocol(baseUrl, pagePath)` (JS,
`@gramlot/gramlot/server`, `js/src/server/conformance.js:22`) run the list below, in
this order, over HTTP against a running adapter. `base_url` includes the mount
prefix; `page_path` names a page of the adapter. The first failure raises
`AssertionError` (Python) or rejects with `AssertionError` from `node:assert` (JS),
its message starting with the rule ID. Standard library only (`urllib`, `fetch`).

1. GC-230-010: with a prefix, `GET <prefix>` answers 301 to `<prefix>/`.
2. GC-230-020: `GET <page>` answers 200 `text/html` with the bootstrap module
   script; the import map carries its nonce.
3. GC-230-010: the bootstrap URLs are the defaults below the prefix.
4. GC-230-045: a `Content-Security-Policy` header, when present, contains
   `'nonce-<nonce>'`.
5. GC-230-040: a `gramlot_owner` cookie, when set, has `HttpOnly`,
   `SameSite=Lax` and the prefix path; later requests send it.
6. GC-230-015: `GET` of the runtime answers 200 `text/javascript`; `POST` answers 405.
7. GC-230-050: each root-relative bootstrap resource answers 200 with its media type.
8. GC-230-020: an unknown page answers 404; `POST <page>` answers 405; when
   `page_path` ends with `/`, `<page>index.html` answers the page.
9. GC-230-025: `main` answers 405 to `GET`, 415 to `text/plain`, 400 to invalid
   JSON and to a body without `pageId`, 413 above 4096 bytes.
10. GC-230-030: `main` answers 200 `application/json` with a body.
11. GC-230-040: with an owner cookie, `main` without it answers 404.
12. GC-230-035: `main` of an unknown `pageId` answers 404.
13. GC-230-025 and GC-230-035: `source` without `method` answers 400; `source` with
    array `params` answers 400; an unknown method answers 404.
14. GC-230-030: `close` answers 200 `{"ok": true}`; `main` of the closed page
    answers 404.

Not checked: the 503 of a full registry (filling it takes `max_pages` page
requests) and `HEAD`.

The core runs both checks against both reference adapters
(`tests/test_conformance.py`, `js/tests/conformance.test.js`), with and without a
mount prefix and a policy. An adapter repository runs them against its own
adapters.
