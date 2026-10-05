# 140 · Agreed integrations and examples

Document ID: **GC-140**. Updated: **2026-10-05**.

> **Naming (2026-10-02):** in the dated text of this document, "native" as the label of a release, profile, milestone, adapter, module, API or pages names the scope of the 0.1.0 milestone (no web components, no recipes). That label has no technical meaning; current documents do not use it ([GC-005 §030](../005-documentation-policy.md#gc-005-030)). "native" for browser controls, DOM events, HTML attributes, DOM operations, Bag events or platform APIs keeps its technical meaning. Dated text is not rewritten.

[Concise counterpart](../../docs_llm/internal/140-integrations-and-examples.md).

This is the shared reminder of the integration repositories and reference
examples. It records responsibilities and current status, not a new implementation
plan. Authority: [constitution §7 and its amendments](../00-constitution.md).
Current work status: [GC-070](070-work-status.md).

<a id="gc-140-005"></a>
## 005 · Integration repositories

**Integration repositories**, shortened to **integration repos**, provide adapters
and instructions to install, configure and try Gramlot in their respective
environments. Core owns the shared Page, Host, Source and browser contracts;
integration repositories own environment-specific adaptation and setup.

| Repository | Environment | Responsibility |
| --- | --- | --- |
| `gramlot-py-server` | Python / Uvicorn or any ASGI server, Django, Flask, FastAPI, Kajenn | One PyPI package with five adapters, one extra each (`uvicorn`, `django`, `flask`, `fastapi`, `kajenn`), and the command `gramlot <environment> new` and `gallery`. |
| `gramlot-js-server` | JavaScript / Node.js and Bun; browser Worker | Three npm packages: `@gramlot/gramlot-js-server` (`server/`, both server runtimes, command `gramlot`), `@gramlot/gramlot-serverless` (`serverless/`, single-HTML and static-folder export, Worker integration for the browser standalone profile, command `gramlot-serverless`) and `@gramlot/create` (`npm create @gramlot page` or `site`). |
| `gramlot-examples` | Python and JavaScript pages | The example pages, their READMEs and the gallery (PyPI `gramlot-examples`, npm `@gramlot/gramlot-examples`), served by the gallery command of each environment. |

History: the repositories `gramlot-fastapi`, `gramlot-flask`, `gramlot-django`,
`gramlot-kajenn` (renamed from `gramlot-genro-asgi` on 2026-09-26) and
`gramlot-uvicorn` (heir of the ASGI part of `gramlot-minimal`) became the adapters of
`gramlot-py-server` and are archived. `gramlot-serverless` (heir of the standalone
part of `gramlot-minimal`) joined `gramlot-js-server` on 2026-10-01 and is archived.
`gramlot-minimal`, retired on 2026-09-28, is archived.

Kajenn is the new product name for Genro ASGI; it is published on PyPI as `kajenn`.
Standalone remains the **browser execution profile**, rather than a repository
name. Python pages require a Python server; the standalone Worker runs JavaScript
pages. Database integration is a separate responsibility.

<a id="gc-140-010"></a>
## 010 · Agreed reference example

Historical (until 2026-10-04): the integration smoke application was **Hello World**
in `gramlot-examples/apps/hello-world`, with equivalent Python and JavaScript pages,
using real Gramlot typed Source and the shared execution contracts. The execution
profiles were configurations of this same example, not eight different
applications. `apps/hello-world` was removed from `gramlot-examples` on 2026-10-04;
its launchers are the quick starts of `gramlot-py-server` (`gramlot <environment>
new`) and `gramlot-js-server` (`npm create @gramlot`). The profiles, with today's
integration:

| Page language | Profile | Integration today |
| --- | --- | --- |
| Python | Uvicorn with generic ASGI | `gramlot-py-server`, extra `uvicorn` |
| Python | FastAPI | `gramlot-py-server`, extra `fastapi` |
| Python | Flask | `gramlot-py-server`, extra `flask` |
| Python | Kajenn | `gramlot-py-server`, extra `kajenn` |
| Python | Django | `gramlot-py-server`, extra `django` |
| JavaScript | Node.js | `gramlot-js-server` (`@gramlot/gramlot-js-server/node`) |
| JavaScript | Bun | `gramlot-js-server` (`@gramlot/gramlot-js-server/bun`) |
| JavaScript | Browser Worker / standalone HTML | `gramlot-js-server` (`@gramlot/gramlot-serverless`) |

The owner-approved teaching suite and the gallery that replaces its runner live in
`gramlot-examples` (constitution 11.56); the theme stays in core
`themes/gramlot-base`; see [GC-145](145-html-svg-examples.md). Reusable adapters
belong in their integration repositories; shared runtime behavior belongs in core.
Installation and launch commands are maintained in each integration repository
rather than duplicated here.

The retired `gramlot-minimal` repository contained `examples/hello-world` and
`examples/source-live` as focused exporter/runtime verification fixtures (historical,
2026-09-24). They were not additional application commitments or an authorization to
expand core features.

<a id="gc-140-015"></a>
## 015 · Verification and publication boundary

The original core 0.1.0 delivery verified seven Chromium profiles: Uvicorn, FastAPI,
Flask, Kajenn, Node.js, Bun and Worker. The 0.2.0 qualification verified the
acceptance pages on `gramlot-uvicorn`, `gramlot-js-server` and the standalone
exporter ([GC-215](215-qualification-0-2-0.md)). Today each integration repository
runs its own CI against the released core and documents its verified versions.

Core 0.1.0 archives remain published and unchanged. The core is published on PyPI
(`gramlot`) and on npm and JSR (`@gramlot/gramlot`); `gramlot-py-server` and
`gramlot-examples` on PyPI; the packages of `gramlot-js-server` and
`@gramlot/gramlot-examples` on npm. Each release still requires an explicit owner
authorization; no deployment is implied.

<a id="gc-140-020"></a>
## 020 · What is not yet an agreed example or transfer

Database examples and database APIs are not agreed yet. Historical showcase,
Microblog, Django ORM demos, site and Rosetta material remain PoC evidence; they
are not additional accepted examples merely because they exist in a repository.

No list of further transfers from `gramlot-poc` has been agreed. Select and review
each proposed transfer separately, naming its destination, responsibility and
acceptance checks. This reminder does not authorize any such transfer.


<a id="gc-140-025"></a>
## 025 · Core teaching suite — approved 2026-09-24

The owner has selected twelve paired Python/JavaScript HTML/SVG examples inside
core, each with an explanatory README. *Update 2026-09-30:* the suite has three
families in core, `examples/html_svg` (thirteen pages, native HTML/SVG),
`examples/binding` (eleven) and `examples/controllers` (nine); every example is a file
page `NN_name.py`, `NN_name.js`, `NN_name.md` with a same-name `.css` and logic
companion `NN_name_aux.js` where needed ([GC-145](145-html-svg-examples.md)); the
original layout was one folder per example. A runner provides a list, language iframe
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
