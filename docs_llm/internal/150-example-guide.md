# 150 · Base theme and HTML/SVG example guide

Document ID: **GC-150**. Updated: **2026-09-24**.

[Expanded counterpart](../../docs/internal/150-example-guide.md).

<a id="gc-150-005"></a>
## 005 · Start with the runner

Follow the [runner setup](../../examples/00-runner/README.md). The local launcher
composes Minimal/Uvicorn and Node adapters outside the runtime package. Select a title to open/reactivate an example tab with explanation above its iframe.
The integration selects the language. Shared runtime behavior keeps open frames.
Source/README links open original files. No synchronized example state or Inspector implementation is implied.

<a id="gc-150-010"></a>
## 010 · Learn from paired pages

The [twelve examples](../../examples/html_svg/README.md) each provide `page.py`,
`page.js` and a README. Progress: Hello World, text, lists, semantics, tables, forms,
disclosure, SVG shapes/composition, cards, report and complete event page. Methods
and loops compose static local data; native controls provide native interactions.
No application DOM/fetch, bindings, controllers or database. Submit is disabled.
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
