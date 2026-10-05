# 140 · Agreed integrations and examples

Document ID: **GC-140**. Updated: **2026-10-05**.

> **Naming (2026-10-02):** in the dated text of this document, "native" as the label of a release, profile, milestone, adapter, module, API or pages names the scope of the 0.1.0 milestone (no web components, no recipes). That label has no technical meaning; current documents do not use it ([GC-005 §030](../005-documentation-policy.md#gc-005-030)). "native" for browser controls, DOM events, HTML attributes, DOM operations, Bag events or platform APIs keeps its technical meaning. Dated text is not rewritten.

[Expanded counterpart](../../docs/internal/140-integrations-and-examples.md).
Agreed inventory, not a new implementation plan. Authority: constitution §7 and its
amendments; current status: [GC-070](070-work-status.md).

<a id="gc-140-005"></a>
## 005 · Integration repositories

Integration repos own environment adapters and installation/configuration/trial
instructions. Core owns shared Page, Host, Source and browser contracts.

| Repository | Environment and responsibility |
| --- | --- |
| `gramlot-py-server` | Python; PyPI package with five adapters, one extra each (`uvicorn` for any ASGI server, `django`, `flask`, `fastapi`, `kajenn`); command `gramlot <environment> new` and `gallery`. |
| `gramlot-js-server` | JavaScript; npm packages `@gramlot/gramlot-js-server` (Node.js and Bun, command `gramlot`), `@gramlot/gramlot-serverless` (single-HTML/static-folder export, browser Worker, command `gramlot-serverless`), `@gramlot/create` (`npm create @gramlot page` or `site`). |
| `gramlot-examples` | Example pages, READMEs and gallery (PyPI `gramlot-examples`, npm `@gramlot/gramlot-examples`), served by each environment's gallery command. |

History: `gramlot-fastapi`, `gramlot-flask`, `gramlot-django`, `gramlot-kajenn`
(ex `gramlot-genro-asgi`, renamed 2026-09-26) and `gramlot-uvicorn` (ASGI heir of
`gramlot-minimal`) became `gramlot-py-server` adapters and are archived;
`gramlot-serverless` (standalone heir) joined `gramlot-js-server` on 2026-10-01 and is
archived; `gramlot-minimal`, retired 2026-09-28, is archived.

Kajenn is the former Genro ASGI, on PyPI as `kajenn`. Standalone names the browser
profile, not a repo. Python pages require Python hosting; Worker runs JS. Database
work is separate.

<a id="gc-140-010"></a>
## 010 · Agreed reference example

Historical (until 2026-10-04): Hello World in `gramlot-examples/apps/hello-world`,
equivalent Python/JS pages with real typed Source, one application with eight
execution profiles. Removed on 2026-10-04; its launchers are the quick starts of
`gramlot-py-server` (`gramlot <environment> new`) and `gramlot-js-server`
(`npm create @gramlot`). Profiles today:

- Python: Uvicorn/ASGI, FastAPI, Flask, Kajenn, Django: extras of `gramlot-py-server`.
- JavaScript: Node.js and Bun through `@gramlot/gramlot-js-server`; browser Worker through `@gramlot/gramlot-serverless`, both in `gramlot-js-server`.

Teaching suite and gallery in `gramlot-examples` (11.56); theme in core
`themes/gramlot-base` ([GC-145](145-html-svg-examples.md)). Integration repos own
adapters and launch commands; core owns shared runtime.
The retired `gramlot-minimal` had `examples/hello-world` and `examples/source-live` as focused verification
fixtures (historical, 2026-09-24), not additional feature or application commitments.

<a id="gc-140-015"></a>
## 015 · Verification and publication boundary

Original core 0.1.0: seven Chromium profiles, without Django. 0.2.0 qualification:
acceptance pages on `gramlot-uvicorn`, `gramlot-js-server` and the standalone exporter
([GC-215](215-qualification-0-2-0.md)). Today each integration repo runs its own CI
against the released core and documents its verified versions.

Published core 0.1.0 archives remain unchanged. Core on PyPI (`gramlot`), npm and JSR
(`@gramlot/gramlot`); `gramlot-py-server`, `gramlot-examples` on PyPI; `gramlot-js-server`
packages and `@gramlot/gramlot-examples` on npm. Each release needs explicit owner
authorization; no deployment implied.

<a id="gc-140-020"></a>
## 020 · What is not yet an agreed example or transfer

Database examples and APIs are not agreed yet. Historical showcase, Microblog, Django ORM,
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
