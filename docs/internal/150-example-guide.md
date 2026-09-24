# 150 · Base theme and HTML/SVG example guide

Document ID: **GC-150**. Updated: **2026-09-24**.

[Concise counterpart](../../docs_llm/internal/150-example-guide.md).

<a id="gc-150-005"></a>
## 005 · Start with the runner

The local [runner README](../../examples/00-runner/README.md) is reached from the
[example index](../../examples/README.md). It documents the exact setup and launch
command. The native runtime has no adapter dependency: the development launcher
composes Minimal/Uvicorn and Node integration hosts outside the runtime package.

Use the Python/JavaScript language selector, then open an example in that language's
iframe. The two frames keep independent browser state. Source links open the
original files; README links explain the page. This first runner uses native radio
controls, links and CSS, not a new Gramlot tab component. It does not synchronize
frame selection or input state. Inspector remains a missing framework capability.

<a id="gc-150-010"></a>
## 010 · Learn from paired pages

Every numbered folder under `examples/html_svg` has `page.py`, `page.js` and an
English README. Start with Hello World, then text, lists, semantic composition,
tables and forms. Continue with disclosure, SVG shapes/composition, mixed cards,
a static report and a complete event page. More complex pages use ordinary methods
and loops. All data is static and local. No application DOM events, fetch, Data
bindings, controllers or database APIs are introduced. Native HTML interactions
remain native; a disabled submit example does not pretend to save data.

The initial [catalogue](../../examples/00-runner/catalog/README.md) records actual
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
