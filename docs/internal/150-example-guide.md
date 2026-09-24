# 150 · Base theme and HTML/SVG example guide

Document ID: **GC-150**. Updated: **2026-09-24**.

[Concise counterpart](../../docs_llm/internal/150-example-guide.md).

Runner ownership follows constitution 11.44: the local browser helpers and frame
launch wrappers live under `examples/00-runner`. Core only renders ordinary HTML
and handles Source lifetime. Future web components remain separately scoped.

<a id="gc-150-005"></a>
## 005 · Start with the runner

The local [runner README](../../examples/00-runner/README.md) is reached from the
[example index](../../examples/README.md). It documents the exact setup and launch
command. The native runtime has no adapter dependency: the development launcher
composes Minimal/Uvicorn and Node integration hosts outside the runtime package.

Select a title in the left list to open or reactivate its example tab. Each panel
contains teaching text above its preview iframe and highlighted source code. The serving integration determines the
language; relative frame URLs stay under it. Open examples preserve frame state. Source links open the
original files; README links explain the page. The provisional runner owns activation and keyboard navigation through HTML IDs. Teaching pages declare Source; the runner has the bounded
page-local event exception in constitution 11.44. It does not synchronize example input state. Inspector remains a missing framework capability.

<a id="gc-150-010"></a>
## 010 · Learn from paired pages

Every numbered folder under `examples/html_svg` has `page.py`, `page.js` and an
English README. Start with Hello World, then text, lists, semantic composition,
tables and forms. Continue with disclosure, SVG shapes/composition, mixed cards,
a static report and a complete event page. More complex pages use ordinary methods
and loops. Initial data is local. Example 10 adds an explicitly approved short
JavaScript onclick action: remove a labelled card from the browser Builder's
Source using popNode, then let Gramlot update the DOM. It demonstrates live Source
without persistence or server synchronization. No fetch, Data bindings, controllers
or database APIs are introduced. Other native HTML interactions
remain native; a disabled submit example does not pretend to save data.

The selectable [catalogue](../../examples/00-runner/catalog/README.md) records actual
HTML grammar coverage and classifies document-level, inert and unsupported behavior
explicitly. A grammar declaration alone does not prove a runtime feature exists.

<a id="gc-150-015"></a>
## 015 · Shared theme and future themes

[`themes/gramlot-base`](../../themes/gramlot-base/README.md) contains the CSS and
theme authoring guide. It consumes the approved brand palette and defines semantic
`--gramlot-*` tokens, HTML/control styles and optional layout classes. The same
stylesheet is served to every page and the runner; iframe documents load it
explicitly because styles do not cross frame boundaries. Per-example CSS handles
local geometry, never a duplicate color palette or control skin.

Future themes belong beside `gramlot-base` and document the same semantic token
contract. Light/dark presentation follows user preference, with an explicit
`data-theme` option. Dark adaptations are not new approved logo colors. Modern
CSS uses [cascade layers](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer)
and [size container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@container);
no legacy browser compatibility layer is provided. Actual verification is recorded
in [GC-145](145-html-svg-examples.md#gc-145-025), not inferred from feature support.

<a id="gc-150-020"></a>
## 020 · Scope and publication

This teaching suite lives in the core checkout. The separate `gramlot-examples`
Hello World remains the integration smoke application. PoC transfers, package
publication, deployment and changes to immutable 0.1.0 archives are excluded.
See [GC-070](070-work-status.md#gc-070-045) for current implementation and checks.


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
