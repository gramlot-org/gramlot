# 145 · HTML/SVG examples, base theme and runner

Document ID: **GC-145**. Updated: **2026-09-24**.

[Concise counterpart](../../docs_llm/internal/145-html-svg-examples.md).
Authority: constitution amendment 11.22. This is a new local example workstream,
not a reopened 0.1.0 release plan; GC-110 remains complete.

**Current ownership — 2026-09-24:** Constitution 11.44 removes the runner-specific
behaviors from core. `examples/00-runner/browser` now owns tab events, resizing,
Markdown, highlighting and theme propagation, attached by ordinary HTML IDs.
The runner is provisional; future web components are not designed or implemented
by this change. Earlier execution receipts describing shared runtime components
are historical and their ownership claims are superseded. The current suite has
thirteen examples and starts with the introduction, not the element catalogue.
Example 13, `13_live_source`, was introduced under constitution 11.39. The initial
plan and dated receipts below retain their original twelve-example counts; they
are not evidence of thirteen-page verification. Later checks, including the live
playground, are recorded in [GC-070 §270](070-work-status.md#gc-070-270).

<a id="gc-145-005"></a>
## 005 · Outcome and responsibilities

A developer starts the local runner, sees its introduction, and
opens thirteen increasingly complex HTML/SVG examples in Python and JavaScript
iframe panels. Every example has an English README and comparable source files.

- `themes/gramlot-base/`: one CSS theme and authoring/extension documentation,
  derived from `assets/branding/theme-tokens.json` and the approved visual guide.
- `examples/00-runner/`: development launcher, list, example tabs, source
  links and provisional browser behavior. No duplicate HTTP/Host implementation.
- `examples/html_svg/<number>_<name>/`: `page.py`, `page.js`, `README.md`, and
  optional `style.css` for example-specific geometry/layout only.
- Existing integration repositories: environment adapters. No new core dependency
  on an ASGI server, Node adapter or database.

The runner owns code presentation. Inspector capability is not present in the
current native core and must be reported as unavailable, not simulated.
The serving integration selects the authoring language. Runner-local JavaScript
opens/reactivates example tabs; each panel places explanation above its iframe.

<a id="gc-145-010"></a>
## 010 · Catalogue and thirteen-page progression

The initial catalogue inventories actual HTML collection declarations. Elements
requiring document/head placement or inert/media contexts are classified explicitly;
coverage must not mean inserting every tag into an invalid body. No external
services, DOM canvas drawing or invented controls. The initial twelve examples
focus on static/native HTML; example 13 adds the approved live Source actions
and SVG animation (constitution 11.39).

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
| `13_live_source` | Live Source insertion, removal and updates; SVG animation and timer cleanup. |

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
## 020 · Historical twelve-example execution plan and acceptance

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
## 025 · Historical initial execution evidence

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


<a id="gc-145-030"></a>
## 030 · Owner correction of runner behavior

The owner rejected the first runner UI. Earlier successful checks describe the
old implementation, not acceptance of its design. Constitution 11.23 supersedes
language tabs: a compact title list opens/reactivates persistent example tabs;
each panel has explanation above its iframe. The integration chooses language
through relative URLs; there is no language selector. A bounded shared runtime
HTML tab behavior owns Bag state, Source updates, keyboard interaction and cleanup.
Only the catalogue starts loaded. Corrected implementation verified locally: 80/80 JavaScript tests pass, including
open/reuse, iframe identity, keyboard navigation, isolation, cleanup, strict
declarations and Source-state restoration after renderer rebuild. Browser checks
pass for both `/py/index` and `/js/index`: integration-owned language, compact
title list, one tab per opened example, explanation above iframe, lazy loading,
no duplicate tabs, and preserved form input/page identity when switching tabs.
All 26 catalogue/example pages retain Python/JS parity; source/README links and
light/dark/narrow checks pass with no browser errors. The updated in-app runner
was reloaded and visually checked with Hello World and SVG shapes open.
This closes implementation, not owner visual acceptance or release authorization.


<a id="gc-145-035"></a>
## 035 · Introduction and split source panel

Constitution 11.24 supersedes the catalogue-first opening described above. The
initial tab contains a short runner introduction without an iframe. Example panels
show their explanation above a draggable preview/code split. The host reads the
original Python or JavaScript page source into Source text, matching its integration.
Shared runtime behavior owns splitter pointer/keyboard handling, Bag position and
Source projection. Highlight.js detects Python/JavaScript with `highlightAuto`,
escapes code text and supplies syntax spans styled by the shared theme.
Verified locally: 84/84 JavaScript tests; Chromium checks pass for both serving
integrations, exact displayed source, highlight spans, divider drag/keyboard and
preserved frame and ratio state. All 26 pages retain Python/JavaScript parity;
light/dark/narrow layouts and documentation checks pass. The in-app Python runner
was refreshed and checked. Owner visual acceptance remains separate.


<a id="gc-145-040"></a>
## Catalogue removed from runner — 2026-09-24

Owner rejects the catalogue as confusing (constitution 11.25). Removed its sidebar
entry, generated panel, host routes and served source assets. The introduction
and twelve numbered examples remain. Previous 26-page evidence is historical;
the current suite covers 24 Python/JavaScript example pages.

Verified in Chromium: both runners expose twelve titles, all 24 pages pass parity
and interaction checks, and the refreshed in-app browser starts with Hello World
in the list and Introduction selected.


<a id="gc-145-045"></a>
## Compact runner, Markdown and optional keyboard navigation — 2026-09-24

Owner requests smaller typography/spacing, original README content rendered in
the upper panel, no duplicate source/README links and an initially unchecked
keyboard-navigation option at the sidebar bottom. Implemented with Source text,
a shared sanitized Markdown view and Bag-owned tab keyboard state. The approved
palette already supplied all theme colors; the runner now emphasizes its navy
navigation, blue selection and yellow brand accent. Compact-runner checks pass for both integrations and all
24 paired pages; 85 JavaScript tests pass. The subsequent logo/theme-selector
addition (constitution 11.27) is verified: 88/88 JavaScript tests and both runners
in Chromium, including logo loading, theme propagation to existing/new frames,
keyboard opt-in and all 24 pages.


<a id="gc-145-050"></a>
## Category navigation and preview proportion — 2026-09-24

Constitution 11.28 groups the twelve examples under HTML / SVG. The category
opens its folder README as a Markdown-only tab. Preview/code starts at 65/35,
with slightly smaller code text. This establishes the category structure for
future examples without adding unimplemented binding categories. Verified:
89/89 JavaScript tests and both runners in Chromium, including category README
without iframe, twelve nested examples, initial ratio 65, retained ratio/frame
state and all 24 example pages. The in-app category view was refreshed.


<a id="gc-145-055"></a>
## Static-directory standalone runner — 2026-09-24

Owner selects a static directory for the standalone runner (constitution 11.29).
Implementation separates browser-safe runner UI from host filesystem reads; the
Minimal directory exporter bundles one Worker per Page and local assets. Core
standalone loads declared CSS. A plain static HTTP server serves the result;
there are no application endpoints or runtime Node/Python/Bun Page execution.
Verified: core JavaScript tests 90/90, strict Sphinx/public-document checks,
and Chromium acceptance of all 12 Worker pages plus the runner. Network checks
allow only local static GETs; CSS, source text, category, theme propagation,
keyboard navigation, splitter and retained input state pass. The static directory
is build/examples-standalone (about 12 MB), served locally at port 8093 and opened
in the in-app browser. This is a local preview, not a deployment.


<a id="gc-145-060"></a>
## Correction: direct local-file directory — 2026-09-24

Owner rejects the accidental HTTP requirement (constitution 11.30). The previous
static-server checks did not verify the requested local-file behavior. The revised
export packages classic bootstrap scripts with Worker text, relative page/assets
and explicit CSS resource roots. Shared theme messages validate sender-window
identity for both hosted and opaque-origin local frames. Verified in Chromium:
direct file URLs with network offline, all 12 Worker pages, zero HTTP requests,
CSS, category, source highlighting, light/dark propagation, keyboard, split and
retained state. Hosted Python/Bun regression checks also pass for all 24 pages.
Core tests: 93/93; Minimal tests: 6/6; strict documentation checks pass. The
export was regenerated at build/examples-standalone/index.html. The in-app
browser tool blocks file URLs, so local visual opening remains a user action;
this does not replace or invalidate the completed Chromium development tests.
