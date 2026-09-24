# 085 · Repository operating guide

Document ID: **GC-085**. Status: **working-tree guide; release workflow pending**.

[Expanded counterpart](../../docs/internal/085-operating-guide.md).

<a id="gc-085-005"></a>

## 005 · Start here

Read the constitution, [GC-070](070-work-status.md) and current [GC-110](110-native-html-readiness.md#gc-110-020). GC-080 is historical.
GC-045/050 are legacy inventories only, not accepted APIs or bulk-port authority.
This locally verified slice is not released/deployed. The Python wheel installs with published Builder 0.23.2; declared GitHub JS dependencies resolve maintained Builder JS 0.1.3 and browser-safe TYTX. Fresh locally packaged Uvicorn, FastAPI, Kajenn, Flask, Node, Bun and Worker pass in Chromium; see [GC-110 §3.1](110-native-html-readiness.md#gc-110-035).

<a id="gc-085-010"></a>

## 010 · Current repository map

`src/gramlot`: page/ (Page, builder, Source), server/ (Host), db/ (placeholder), collections/ (exported grammar).
`js/src`: builder, renderer, view, references.js, transport.js, worker-transport.js, Host/Page/FileHost/WorkerHost adapters and bootstrap.
`tests`/`js/tests`: contracts and fixtures. `ports`: bounded records.
`docs/internal` and mirror: internal records. `scripts`: verification helpers.
Generated build, venv, modules and caches are outputs. Do not infer future folders.

<a id="gc-085-015"></a>

## 015 · Ownership boundaries

Bag/TYTX own registered types, reconstruction, backrefs/events and native SOURCE
transport. genro-builders owns generic Python grammar/SourceBag classes; Gramlot owns Python TYTX registration and dialect loading under amendment 11.16. genro-builders-js owns
generic JS grammar, association, sourceTarget and static rendering and bundled HTML5
HtmlBuilder/HtmlRenderer, including Python-compatible CSS keywords/macros in HTML
text output. Gramlot owns GramlotRenderer, HtmlElement and live Source
rendering/lifecycle. genro-dom-js remains a reference repository, not a dependency.
Python grammar/transport/mixed text/atomic insertion belong to Gramlot under amendment 11.16. JS uses generic sourceTarget under 11.18. Recipes are deferred. Live CSS
adaptation is pending and should later reuse the HTML dialect's `adaptAttrs`; labels,
bindings, automatic recipe discovery, component inventory, database and production
hosts are absent.

<a id="gc-085-020"></a>

## 020 · Local setup and package-boundary testing

Install the declared JS dependencies with `npm --prefix js install --ignore-scripts --package-lock=false`, build runtime, then install Python with test extras (`-e .[test]`). Build assets before the Python wheel. `npm pack` now includes Gramlot LICENSE/NOTICE, bundles and generated notices; `uv build --wheel` includes resources and canonical collections. Verify consumers in new environments outside source checkouts. Current declared sources install cleanly; `install_js_artifacts.py` only reproduces older local graphs. No publication or owner acceptance follows from artifact installation.

<a id="gc-085-025"></a>

## 025 · Checks and interpretation

Set `GRAMLOT_TEST_PYTHON` to the absolute project `.venv/bin/python` for JS cross-language tests. Run Python unittest discovery, `npm --prefix js test`, `bun test js/tests/*.test.js`
and the JS build; run a generic suite only as part of separately authorized owning-project work. GC-065 gives the
Chromium fixture. GC-070 records current totals and GC-125 preserves dated evidence; GC-080 is historical. Distinguish implemented,
verified and accepted; local packages do not prove upstream availability. Main,
publication, release and deployment remain separate owner gates.

<a id="gc-085-030"></a>

## 030 · Deliberate outline for later operations

Future headings may cover accepted-upstream refresh, development acceptance,
coverage and concrete adapters only after implementation. These are navigation
placeholders, not specifications or feature claims.

JS package verification: `npm pack ./js` packages source, bundles, licenses and notices. It does not create `js/collections/`. `scripts/export_collections.py` copies canonical HTML5/SVG JSON from installed genro-builders-js; an optional path selects an owning export. Regenerate only there with `npm run export:collections` and the current Python builder importable. No independent tag list exists. `@gramlot/native-html/server` exports Host/Page/FileHost; default entry is browser runtime. Tests/build do not regenerate collections. Consumers use installed packages, not sibling imports; declared GitHub dependencies provide current generic sources.
