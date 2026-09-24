# 145 · HTML/SVG examples, base theme and runner

Document ID: **GC-145**. Updated: **2026-09-24**.

[Expanded counterpart](../../docs/internal/145-html-svg-examples.md).
Authority: constitution 11.22. New local example workstream; GC-110 remains complete.

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

- `themes/gramlot-base`: shared modern CSS from the approved brand palette, plus
  theme extension documentation. No duplicated theme in examples.
- `examples/00-runner`: introduction, example list, persistent example tabs with explanation and iframe,
  source links and local launcher composing existing integration adapters.
- `examples/html_svg/<number>_<name>`: equivalent Python/JS Page modules, README,
  optional geometry-only CSS. No host dependencies in core runtime.

Code display belongs to the runner. Inspector remains unavailable in native core;
no PoC import or invented implementation. The integration owns language selection. Runner-local handlers use ordinary HTML
IDs and update Source; core has no runner-specific behavior.

<a id="gc-145-010"></a>
## 010 · Catalogue and thirteen-page progression

Catalogue coverage follows actual grammar; document-only, inert and media tags need
explicit classification and valid contexts. The initial twelve examples avoid active
scripts and canvas DOM drawing; example 13 adds approved live Source actions and
SVG animation (constitution 11.39).

01 Hello World; 02 text/links/mixed content; 03 lists/loops; 04 semantic page/methods;
05 tables/row helper; 06 forms/native controls including range/buttons/states;
07 details/progress/meter; 08 SVG primitives; 09 SVG groups/paths/repeated scene;
10 HTML/SVG cards; 11 report/chart/table from shared local data; 12 composed event page;
13 live Source insertion/removal/updates, SVG animation and timer cleanup.

READMEs explain goal, prerequisites, files, launch, construction, language differences,
exercises and limits. Python first; equivalent handwritten JS. Ordinary helper methods,
not remote endpoints. The first twelve focus on static data/native HTML; example 13
demonstrates live Source. These examples do not establish full Data binding support.

<a id="gc-145-015"></a>
## 015 · Theme contract

Approved palette, semantic `--gramlot-*` variables, cascade layers, logical properties,
fluid sizing, responsive composition, documented browser target. Cover semantic HTML,
controls and SVG. Review focus, contrast, reduced motion and light/dark presentation.
Future themes override tokens; per-example CSS does not duplicate shared skins.

<a id="gc-145-020"></a>
## 020 · Historical twelve-example execution plan and acceptance

Root records plan/contracts; Sol agents implement theme, examples and runner in
parallel. Root reviews actual paths/state, integrates, checks authoring and browser
behavior, then updates documentation/status and delivers a usable start command.

Acceptance: twelve pairs/READMEs; catalogue coverage; shared external theme; working
runner/source links and iframes; HTML/SVG parity; no console/asset errors or DOM/fetch
workarounds. Check native controls, SVG namespaces, desktop/narrow and light/dark.
No inferred eight-host matrix, installed-package or cross-browser claims. No publish.

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
