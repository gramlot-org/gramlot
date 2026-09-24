# 150 · Base theme and HTML/SVG example guide

Document ID: **GC-150**. Updated: **2026-09-24**.

[Expanded counterpart](../../docs/internal/150-example-guide.md).

Runner ownership follows constitution 11.44: the local browser helpers and frame
launch wrappers live under `examples/00-runner`. Core only renders ordinary HTML
and handles Source lifetime. Future web components remain separately scoped.

<a id="gc-150-005"></a>
## 005 · Start with the runner

Follow the [runner setup](../../examples/00-runner/README.md). The local launcher
composes Minimal/Uvicorn and Node adapters outside the runtime package. Select a title to open/reactivate an example tab with explanation above its split preview and highlighted source.
The integration selects the language. Runner-local behavior keeps open frames.
Source/README links open original files. No synchronized example state or Inspector implementation is implied.

<a id="gc-150-010"></a>
## 010 · Learn from paired pages

The [thirteen examples](../../examples/html_svg/README.md) each provide `page.py`,
`page.js` and a README. Progress: Hello World, text, lists, semantics, tables, forms,
disclosure, SVG shapes/composition, cards, report and complete event page. Methods
and loops compose local data. Example 10 has an approved short onclick action
calling popNode on the browser Builder's Source to remove a card; the renderer
updates the DOM. No persistence, server synchronization, direct DOM manipulation,
fetch, Data binding, controllers or database. Other controls use native interactions;
submit is disabled.
The [catalogue](../../examples/00-runner/catalog/README.md) classifies actual grammar
coverage and gaps; a declaration is not evidence of an implemented behavior.

<a id="gc-150-015"></a>
## 015 · Shared theme and future themes

[`gramlot-base`](../../themes/gramlot-base/README.md) supplies the approved palette,
semantic `--gramlot-*` tokens, HTML/control styles and layout helpers. Every iframe
loads the same stylesheet; local CSS handles geometry only. Future themes live
beside it and document the same semantic contract. Light/dark preference and
explicit `data-theme` are supported; dark adaptations are not new logo colors.
Modern CSS includes cascade layers and size queries, with no legacy fallback.
[GC-145](145-html-svg-examples.md#gc-145-025) records actual browser checks.

<a id="gc-150-020"></a>
## 020 · Scope and publication

Core teaching pages are distinct from the unchanged `gramlot-examples` integration
smoke application. PoC transfers, publication, deployment and released archive
changes are excluded. [GC-070](070-work-status.md#gc-070-045) records current status.


<a id="gc-150-025"></a>
## 025 · Preview and source together

The runner opens an Introduction tab with brief usage instructions and no iframe.
Choose any title from the left list to open its example tab. Explanation appears
as rendered Markdown above the preview on the left and the integration-selected page source on the
right. Drag the divider to resize the panes, or focus it and use arrow keys; Home
and End select the permitted limits. Switching tabs preserves the preview and
split position. Code is highlighted with `hljs.highlightAuto`; the upper panel renders the original README directly. The catalogue is excluded from the runner by owner decision.

Keyboard navigation starts disabled. Enable the checkbox at the bottom of the sidebar to include example buttons and tabs in keyboard navigation and show their focus outline. The splitter and example controls retain their native keyboard behavior.

The approved Gramlot logo appears above the list. The Light/Dark selector below
the keyboard option controls the runner and all its preview frames, including
examples opened after the selection. Theme choice lasts for the runner session.

The sidebar groups examples under HTML / SVG. Select the category for its folder
README, or a child title for its example. New example panels start at 65% preview
and 35% source; the divider remains adjustable.


<a id="gc-150-025"></a>
## 025 · Live Source playground

Example 13 adds browser Builder creation, Source deletion/clear, heading and SVG
attribute updates, and a 50 ms setInterval animation. A renderer disposal callback
clears the interval when the section or page is removed. The paired page sources
and README explain each operation. Like example 10, browser actions also work in the regenerated standalone directory
opened directly from disk, offline. No Data
binding, persistence or server synchronization is implied.
