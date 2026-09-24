# 145 · HTML/SVG examples, base theme and runner

Document ID: **GC-145**. Updated: **2026-09-24**.

[Concise counterpart](../../docs_llm/internal/145-html-svg-examples.md).
Authority: constitution amendment 11.22. This is a new local example workstream,
not a reopened 0.1.0 release plan; GC-110 remains complete.

<a id="gc-145-005"></a>
## 005 · Outcome and responsibilities

A developer starts the local runner, sees the Gramlot base-theme catalogue, and
opens twelve increasingly complex HTML/SVG examples in Python and JavaScript
iframe panels. Every example has an English README and comparable source files.

- `themes/gramlot-base/`: one CSS theme and authoring/extension documentation,
  derived from `assets/branding/theme-tokens.json` and the approved visual guide.
- `examples/00-runner/`: development launcher, list, native language panels, source
  links and initial catalogue. No duplicate HTTP/Host implementation.
- `examples/html_svg/<number>_<name>/`: `page.py`, `page.js`, `README.md`, and
  optional `style.css` for example-specific geometry/layout only.
- Existing integration repositories: environment adapters. No new core dependency
  on an ASGI server, Node adapter or database.

The runner owns code presentation. Inspector capability is not present in the
current native core and must be reported as unavailable, not simulated. Native
HTML radio controls and CSS may select iframe panels without application events.
The two language links identify exactly which iframe is navigated.

<a id="gc-145-010"></a>
## 010 · Catalogue and twelve-page progression

The initial catalogue inventories actual HTML collection declarations. Elements
requiring document/head placement or inert/media contexts are classified explicitly;
coverage must not mean inserting every tag into an invalid body. No external
services, executable sample scripts, DOM canvas drawing or invented controls.

| Folder | Content and teaching focus |
| --- | --- |
| `01_hello_world` | Page/main, heading and paragraph; minimal source. |
| `02_text_and_links` | Text hierarchy, mixed inline text, quotations, code, links. |
| `03_lists` | Ordered/unordered/nested lists, glossary, local-data loops. |
| `04_semantic_page` | Header, navigation, article, aside, footer; section methods. |
| `05_tables` | Caption, head/body/foot, row helper, local totals and scope. |
| `06_forms` | Text/password/email/number/date/color, select/multiple, textarea, radio, checkbox, range, buttons/reset/submit, labels and native states. No data endpoint. |
| `07_native_disclosure` | Native details/summary, static progress/meter, FAQ loop. |
| `08_svg_shapes` | SVG primitives, viewBox, coordinates, fills and strokes. |
| `09_svg_composition` | Groups, paths, transforms, helper methods and repeated scene objects. |
| `10_cards_with_icons` | HTML/SVG cards, nested data loops, responsive layout. |
| `11_static_report` | Summary, SVG chart, legend and table from the same local data. |
| `12_complete_page` | Event page, schedule, speakers, schematic map and FAQ; composed methods and nested loops. |

Each README covers goal, prerequisites, files, tested launch path, construction,
language differences, small exercises and limits. Examples use equivalent data
and meaningful structure; source code is handwritten in each language, not a
second declarative JSON format. Helpers are ordinary methods, not exposed remote
Source endpoints. Publication release association is recorded only after acceptance.

<a id="gc-145-015"></a>
## 015 · Theme contract

Shared palette primitives feed semantic `--gramlot-*` properties. The theme covers
HTML text, controls and layout plus SVG through inherited color and properties.
Modern CSS includes cascade layers, logical properties, fluid sizing and responsive
composition; actual supported features and browser verification are documented.
Keyboard focus, usable controls, contrast and reduced-motion preferences are part
of review. Theme variants override semantic tokens without copying example code.
Optional per-example CSS must not duplicate the shared palette or control skin.

<a id="gc-145-020"></a>
## 020 · Execution plan and acceptance

1. **Contract and plan (root):** record owner scope, paths, boundaries and evidence.
2. **Theme (Sol A):** implement the base stylesheet and extension guide.
3. **Examples (Sol B):** create twelve paired pages with explanations and authoring checks.
4. **Runner/catalogue (Sol C):** compose existing hosts, create list/iframe panels,
   catalogue and launch documentation. Steps 2–4 run in parallel against shared paths.
5. **Integration (root):** inspect actual diffs for extra paths/state, confirm source
   loading and shared CSS, run all Python/JS authoring and meaningful browser checks.
6. **Documentation and delivery (root):** synchronize inventory/status/mirrors,
   record actual checks and limitations, provide a usable local start command.

Acceptance: twelve pairs and their READMEs; catalogue coverage accounted for; one
shared theme outside examples; working runner links and iframe controls; successful
HTML/SVG render in each language; no console errors, missing local assets or
application-level DOM/fetch workarounds. Inspect desktop/narrow layouts and light/dark
presentation, native form controls, SVG namespaces, links and source views.
Do not claim a new eight-integration matrix, package installation or cross-browser
certification from these local checks. No remote mutation or release work.

<a id="gc-145-025"></a>
## 025 · Current execution evidence

Implemented locally: shared `themes/gramlot-base`, runner/catalogue, twelve
Python/JavaScript pairs, per-page READMEs and local setup instructions. The runner
composes the existing Minimal/Uvicorn and Node adapters, stages import-only route
modules in a temporary directory, and serves an explicit asset/source allowlist.
A single examples npm graph preserves the strict Page class identity.

Verified on 2026-09-24: all 14 Python and 14 JavaScript routes construct Source
(including runner and catalogue); 26 catalogue/example pages render in Chrome
154.0.8037.57 with exact Python/JavaScript DOM parity. Browser checks cover theme
loading, labels, SVG namespaces, range/reset, disclosure, iframe navigation, native
keyboard language selection, source/README links, light/dark and narrow layouts.
No page errors or failed local asset requests in the final integrated check.
Desktop/light/dark/narrow screenshots are local build evidence. Strict Sphinx and
public-document boundary/link checks pass; new README/internal links and mirrored
anchors are checked separately. These are local development checks, not a new
release, clean-machine installation, eight-host matrix or Safari/Firefox audit.

Known limits: catalogue classifies all 117 exported grammar entries, but it does
not render every entry. Document/executable/inert/media-specific declarations are
accounted for explicitly. The grammar rejects ruby `rp`/`rt` children: recorded
as a grammar gap, with no dependency-source changes or workaround. Inspector
is not implemented in native core. Source links open original files; language
frames retain independent state. Theme is repository material, not yet a
separately published package. Owner visual acceptance is pending; no publication.
