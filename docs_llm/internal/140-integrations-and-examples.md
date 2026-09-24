# 140 · Agreed integrations and examples

Document ID: **GC-140**. Updated: **2026-09-24**.

[Expanded counterpart](../../docs/internal/140-integrations-and-examples.md).
Agreed inventory, not a new implementation plan. Authority: constitution §7 and
11.19–11.21; current evidence: [GC-070 §040](070-work-status.md#gc-070-040).

<a id="gc-140-005"></a>
## 005 · Integration repositories

Integration repos own environment adapters and installation/configuration/trial
instructions. Core owns shared Page, Host, Source and browser contracts.

| Agreed name | Environment and responsibility |
| --- | --- |
| `gramlot-fastapi` | Python / FastAPI; native integration in original 0.1.0 delivery. |
| `gramlot-flask` | Python / Flask; native integration in original 0.1.0 delivery. |
| `gramlot-kajenn` | Python / Kajenn; consumes Minimal ASGI. Local alignment; actual repo name remains `gramlot-genro-asgi`. |
| `gramlot-minimal` | Python / generic ASGI/Uvicorn and JS / browser Worker packaging. Local alignment; actual repo name remains `gramlot-standalone`. |
| `gramlot-nodejs` | JavaScript / Node.js and Bun; both belong here, original 0.1.0 profiles. |
| `gramlot-django` | Python / Django; local native `NativeHtmlPages` views/URLconf. Old Page/ORM code is historical. |

Kajenn names the former Genro ASGI product; upstream distribution/import still
`genro-asgi` / `genro_asgi`. Standalone names the browser profile, not the intended
repo. Python pages require Python hosting; Worker runs JS. Database work is separate.

<a id="gc-140-010"></a>
## 010 · Agreed reference example

[Hello World](../../../gramlot-examples/apps/hello-world/README.md) is the agreed
reference application in `gramlot-examples`, with equivalent Python/JS pages and
real typed Source. One application has eight execution profiles:

- Python: Uvicorn/Minimal, FastAPI, Flask, Kajenn, Django.
- JavaScript: Node.js and Bun through `gramlot-nodejs`; browser Worker through Minimal.

Examples own application pages/configuration/tests; integration repos own adapters;
core owns shared runtime. Use the example README for maintained launch commands.
Minimal's `examples/hello-world` and `examples/source-live` are focused verification
fixtures, not additional feature or application commitments.

<a id="gc-140-015"></a>
## 015 · Verification and publication boundary

Original core 0.1.0: seven Chromium profiles, without Django. Later local work:
Minimal/Kajenn ownership alignment and native Django protocol/install/browser
checks; not a complete eight-profile browser-matrix rerun. GC-070 records evidence.

Published core 0.1.0 archives remain unchanged. New integration packages/names and
Django alignment remain local. Checkout directory and GitHub repository names are
unchanged. Pushes, remote renames and releases await explicit owner authorization;
no registry publication or deployment.

<a id="gc-140-020"></a>
## 020 · What is not yet an agreed example or transfer

Database folders are placeholders. Historical showcase, Microblog, Django ORM,
site and Rosetta are PoC evidence, not accepted native examples. No further PoC
transfer list has been agreed. Each transfer needs its own destination,
responsibility, review and acceptance checks; this inventory authorizes none.
