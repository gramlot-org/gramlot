# 140 · Agreed integrations and examples

Document ID: **GC-140**. Updated: **2026-09-24**.

[Concise counterpart](../../docs_llm/internal/140-integrations-and-examples.md).

This is the shared reminder of the agreed integration repositories and reference
examples. It records responsibilities and current status, not a new implementation
plan. Authority: [constitution §7 and amendments 11.19–11.21](../00-constitution.md).
Current verification and work status: [GC-070 §040](070-work-status.md#gc-070-040).

<a id="gc-140-005"></a>
## 005 · Integration repositories

**Integration repositories**, shortened to **integration repos**, provide adapters
and instructions to install, configure and try Gramlot in their respective
environments. Core owns the shared Page, Host, Source and browser contracts;
integration repositories own environment-specific adaptation and setup.

| Agreed repository name | Environment | Responsibility and current status |
| --- | --- | --- |
| `gramlot-fastapi` | Python / FastAPI | Native FastAPI integration and setup; included in the original 0.1.0 delivery. |
| `gramlot-flask` | Python / Flask | Native Flask integration and setup; included in the original 0.1.0 delivery. |
| `gramlot-kajenn` | Python / Kajenn | Kajenn-specific integration, consuming the generic ASGI adapter from Minimal. Locally aligned; repository still named `gramlot-genro-asgi`. |
| `gramlot-minimal` | Python / Uvicorn and JavaScript / browser Worker | Generic ASGI hosting for Python and single-HTML packaging for the browser standalone profile. Locally aligned; local and GitHub repository renamed to `gramlot-minimal`. |
| `gramlot-js-server` | JavaScript / Node.js and Bun | Both server runtimes belong to this integration repository; included in the original 0.1.0 delivery. |
| `gramlot-django` | Python / Django | Native Django views and URLconf integration through `NativeHtmlPages`. Locally aligned and checked; the older Page/ORM implementation is historical. |

Kajenn is the new product name for Genro ASGI. Its upstream Python dependency still
uses the actual distribution/import names `genro-asgi` / `genro_asgi`.
Standalone remains the **browser execution profile**, rather than the intended
repository name. Python pages require a Python server; the standalone Worker runs
JavaScript pages. Database integration is a separate responsibility.

<a id="gc-140-010"></a>
## 010 · Agreed reference example

The integration smoke application is **Hello World** in
[`gramlot-examples/apps/hello-world`](../../../gramlot-examples/apps/hello-world/README.md).
It has equivalent Python and JavaScript pages, using real Gramlot typed Source and
the shared execution contracts. The execution profiles are configurations of this
same example, not eight different applications.

| Page language | Profile | Integration repository |
| --- | --- | --- |
| Python | Uvicorn with generic ASGI | `gramlot-minimal` |
| Python | FastAPI | `gramlot-fastapi` |
| Python | Flask | `gramlot-flask` |
| Python | Kajenn | `gramlot-kajenn` |
| Python | Django | `gramlot-django` |
| JavaScript | Node.js | `gramlot-js-server` |
| JavaScript | Bun | `gramlot-js-server` |
| JavaScript | Browser Worker / standalone HTML | `gramlot-minimal` |

The existing integration smoke pages, launch configurations and application tests
belong in `gramlot-examples`. The owner-approved teaching suite now lives in core
`examples/html_svg`, with its runner in `examples/00-runner` and its theme in
`themes/gramlot-base`; see [GC-145](145-html-svg-examples.md).
Reusable adapters belong in their integration repositories;
shared runtime behavior belongs in core. Installation and launch commands are
maintained in the example's README rather than duplicated here.

The Minimal repository also contains `examples/hello-world` and
`examples/source-live` as focused exporter/runtime verification fixtures. They are
not additional application commitments or an authorization to expand core features.

<a id="gc-140-015"></a>
## 015 · Verification and publication boundary

The original core 0.1.0 delivery verified seven Chromium profiles: Uvicorn, FastAPI,
Flask, Kajenn, Node.js, Bun and Worker. Later local work aligned Minimal/Kajenn
package ownership and added native Django with protocol, installed-package and
browser checks. These targeted checks are not a rerun of one complete eight-profile
browser matrix. See GC-070 for the actual evidence and remaining limits.

Core 0.1.0 archives remain published and unchanged. The new integration names,
packages and Django alignment are local development work. GitHub repository names
and local checkout directory names have not been changed. Publication, pushes,
remote renames and new releases are deferred until a new explicit owner instruction.
No registry publication or deployment is implied.

<a id="gc-140-020"></a>
## 020 · What is not yet an agreed example or transfer

Database profile directories in Hello World are placeholders, not working database
examples or accepted database APIs. Historical showcase, Microblog, Django ORM
demos, site and Rosetta material remain PoC evidence; they are not additional
accepted native examples merely because they exist in a repository.

No list of further transfers from `gramlot-poc` has been agreed. Select and review
each proposed transfer separately, naming its destination, responsibility and
acceptance checks. This reminder does not authorize any such transfer.


<a id="gc-140-025"></a>
## 025 · Core teaching suite — approved 2026-09-24

The owner has selected twelve paired Python/JavaScript HTML/SVG examples inside
core, each with an explanatory README. A runner provides a list, language iframe
panels and an initial HTML element catalogue. The shared `gramlot-base` theme lives
outside examples under `themes`. Code viewing belongs to the runner, not each page.
This work supersedes the earlier Hello-World-only teaching scope; the integration
smoke application above is unchanged. Implementation and verification status are
tracked in [GC-145](145-html-svg-examples.md) and [GC-070](070-work-status.md#gc-070-045).
PoC transfers are set aside; no new release or publication is authorized.


<a id="gc-140-040"></a>

## 040 · Single upstream teaching suite

Owner confirmed Gramlot as the single source for teaching pages, READMEs, runner,
logo and theme. Downstream integrations consume these through the core dependency
and own environment configuration and launchers. Updating that dependency and
restarting or regenerating exports propagates changes; copied teaching suites
are not maintained downstream. This supersedes any broader reading of the older
smoke-application ownership notes. Uniform packaging and launch rollout remains
pending. See [GC-025 §020](../public/025-try.md#gc-025-020).
