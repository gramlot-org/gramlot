# 140 · Agreed integrations and examples

Document ID: **GC-140**. Updated: **2026-10-04**.

> **Naming (2026-10-02):** in the dated text of this document, "native" as the label of a release, profile, milestone, adapter, module, API or pages names the scope of the 0.1.0 milestone (no web components, no recipes). That label has no technical meaning; current documents do not use it ([GC-005 §030](../005-documentation-policy.md#gc-005-030)). "native" for browser controls, DOM events, HTML attributes, DOM operations, Bag events or platform APIs keeps its technical meaning. Dated text is not rewritten.

[Expanded counterpart](../../docs/internal/140-integrations-and-examples.md).
Agreed inventory, not a new implementation plan. Authority: constitution §7 and
11.19–11.21; current evidence: [GC-070 §040](070-work-status.md#gc-070-040).

<a id="gc-140-005"></a>
## 005 · Integration repositories

Integration repos own environment adapters and installation/configuration/trial
instructions. Core owns shared Page, Host, Source and browser contracts.

| Agreed name | Environment and responsibility |
| --- | --- |
| `gramlot-fastapi` | Python / FastAPI; integration in the original 0.1.0 delivery. |
| `gramlot-flask` | Python / Flask; integration in the original 0.1.0 delivery. |
| `gramlot-kajenn` | Python / Kajenn; depends only on Kajenn besides the core (11.48 item 5). Renamed from `gramlot-genro-asgi` on 2026-09-26. Not migrated yet: its `pyproject.toml` still declares the retired repository replaced by `gramlot-uvicorn` and `gramlot-serverless`. Migration and minimal Host contract deferred to after 0.2.0. |
| `gramlot-uvicorn` | Python / generic ASGI/Uvicorn; heir of the ASGI part of retired `gramlot-minimal` (11.48 item 5). Verified on the 0.2.0 minimal Host contract ([GC-070 §595](070-work-status.md#gc-070-595)). |
| `gramlot-js-server` | JavaScript / Node.js and Bun (`@gramlot/gramlot-js-server`, original 0.1.0 profiles) and browser Worker single-HTML packaging (`@gramlot/gramlot-serverless`, heir of the standalone part of retired `gramlot-minimal`, in `gramlot-serverless` until 2026-10-01). Both verified on the 0.2.0 minimal Host contract. |
| `gramlot-django` | Python / Django; local `NativeHtmlPages` views/URLconf. Old Page/ORM code is historical. |

Kajenn names the former Genro ASGI product; upstream distribution/import still
`genro-asgi` / `genro_asgi`. Standalone names the browser profile, not the intended
repo. Python pages require Python hosting; Worker runs JS. Database work is separate.

<a id="gc-140-010"></a>
## 010 · Agreed reference example

*Update 2026-10-04:* `apps/hello-world` was removed from `gramlot-examples`; its launchers are the quick starts of `gramlot-py-server` and `gramlot-js-server`.
Hello World is the agreed
reference application in `gramlot-examples`, with equivalent Python/JS pages and
real typed Source. One application has eight execution profiles:

- Python: Uvicorn (`gramlot-uvicorn`), FastAPI, Flask, Kajenn, Django.
- JavaScript: Node.js and Bun through `@gramlot/gramlot-js-server`; browser Worker through `@gramlot/gramlot-serverless`, both in `gramlot-js-server`.

The separate integration example owns its pages/configuration/tests; core now also
owns the approved teaching suite (§025). Integration repos own adapters; core owns
shared runtime. Use the example README for maintained launch commands.
The retired `gramlot-minimal` had `examples/hello-world` and `examples/source-live` as focused verification
fixtures (historical, 2026-09-24), not additional feature or application commitments.

<a id="gc-140-015"></a>
## 015 · Verification and publication boundary

Original core 0.1.0: seven Chromium profiles, without Django. Later local work:
Minimal (since retired)/Kajenn ownership alignment and Django protocol/install/browser
checks; not a complete eight-profile browser-matrix rerun. GC-070 records evidence.

Published core 0.1.0 archives remain unchanged. New integration packages/names and
Django alignment remain local. Checkout directory and GitHub repository names are
unchanged. Pushes, remote renames and releases await explicit owner authorization;
no registry publication or deployment.

<a id="gc-140-020"></a>
## 020 · What is not yet an agreed example or transfer

Database folders are placeholders. Historical showcase, Microblog, Django ORM,
site and Rosetta are PoC evidence, not accepted examples. No further PoC
transfer list has been agreed. Each transfer needs its own destination,
responsibility, review and acceptance checks; this inventory authorizes none.


<a id="gc-140-025"></a>
## 025 · Core teaching suite — approved 2026-09-24

The owner has selected twelve paired Python/JavaScript HTML/SVG examples inside
core, each with an explanatory README. *Update 2026-09-30:* three families in core:
`examples/html_svg` (13 pages, native), `examples/binding` (11), `examples/controllers` (9);
every example is a file page `NN_name.py`/`.js`/`.md` with same-name `.css` and logic
companion `NN_name_aux.js` where needed ([GC-145](145-html-svg-examples.md)); originally
one folder per example. A runner provides a list, language iframe
panels and an initial HTML element catalogue. The shared `gramlot-base` theme lives
outside examples under `themes`. Code viewing belongs to the runner, not each page.
This work supersedes the earlier Hello-World-only teaching scope; the integration
smoke application above is unchanged. Implementation and verification status are
tracked in [GC-145](145-html-svg-examples.md) and [GC-070](070-work-status.md#gc-070-045).
PoC transfers are set aside; no new release or publication is authorized.

*Update 2026-10-04 (constitution 11.56):* the three families, their READMEs and the
gallery page that replaces the runner live in `gramlot-examples`
(`src/gramlot_examples/pages`, `src/gramlot_examples/gallery`); the core has no
`examples/`. The theme and the logo stay in the core.


<a id="gc-140-040"></a>

## 040 · Single upstream teaching suite

Owner confirmed Gramlot as the single source for teaching pages, READMEs, runner,
logo and theme. Downstream integrations consume these through the core dependency
and own environment configuration and launchers. Updating that dependency and
restarting or regenerating exports propagates changes; copied teaching suites
are not maintained downstream. This supersedes any broader reading of the older
smoke-application ownership notes. Uniform packaging and launch rollout remains
pending. See [GC-025 §020](../public/025-try.md#gc-025-020).

*Update 2026-10-04 (constitution 11.56):* `gramlot-examples` is the single source of
teaching pages, READMEs, gallery page and catalogue; Gramlot remains the source of
framework documentation, logo and theme. Each environment serves the gallery with
its own gallery command. Dependencies run one way: core ← gramlot-examples ←
environments.
