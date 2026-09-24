# 145 · HTML/SVG examples, base theme and runner

Document ID: **GC-145**. Updated: **2026-09-24**.

[Expanded counterpart](../../docs/internal/145-html-svg-examples.md).
Authority: constitution 11.22. New local example workstream; GC-110 remains complete.

<a id="gc-145-005"></a>
## 005 · Outcome and responsibilities

- `themes/gramlot-base`: shared modern CSS from the approved brand palette, plus
  theme extension documentation. No duplicated theme in examples.
- `examples/00-runner`: catalogue, example list, persistent example tabs with explanation and iframe,
  source links and local launcher composing existing integration adapters.
- `examples/html_svg/<number>_<name>`: equivalent Python/JS Page modules, README,
  optional geometry-only CSS. No host dependencies in core runtime.

Code display belongs to the runner. Inspector remains unavailable in native core;
no PoC import or invented implementation. The integration owns language selection. Shared runtime tab behavior updates Source;
runner pages contain no DOM handlers or fetch.

<a id="gc-145-010"></a>
## 010 · Catalogue and twelve-page progression

Catalogue coverage follows actual grammar; document-only, inert and media tags need
explicit classification and valid contexts. No active scripts or canvas DOM drawing.

01 Hello World; 02 text/links/mixed content; 03 lists/loops; 04 semantic page/methods;
05 tables/row helper; 06 forms/native controls including range/buttons/states;
07 details/progress/meter; 08 SVG primitives; 09 SVG groups/paths/repeated scene;
10 HTML/SVG cards; 11 report/chart/table from shared local data; 12 composed event page.

READMEs explain goal, prerequisites, files, launch, construction, language differences,
exercises and limits. Python first; equivalent handwritten JS. Ordinary helper methods,
not remote endpoints. Static data/native HTML only; no bindings/controllers/database.

<a id="gc-145-015"></a>
## 015 · Theme contract

Approved palette, semantic `--gramlot-*` variables, cascade layers, logical properties,
fluid sizing, responsive composition, documented browser target. Cover semantic HTML,
controls and SVG. Review focus, contrast, reduced motion and light/dark presentation.
Future themes override tokens; per-example CSS does not duplicate shared skins.

<a id="gc-145-020"></a>
## 020 · Execution plan and acceptance

Root records plan/contracts; Sol agents implement theme, examples and runner in
parallel. Root reviews actual paths/state, integrates, checks authoring and browser
behavior, then updates documentation/status and delivers a usable start command.

Acceptance: twelve pairs/READMEs; catalogue coverage; shared external theme; working
runner/source links and iframes; HTML/SVG parity; no console/asset errors or DOM/fetch
workarounds. Check native controls, SVG namespaces, desktop/narrow and light/dark.
No inferred eight-host matrix, installed-package or cross-browser claims. No publish.

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
