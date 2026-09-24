# 085 · Repository operating guide

Document ID: **GC-085**. Status: **current working-tree guide; accepted release workflow pending**.

[Concise counterpart](../../docs_llm/internal/085-operating-guide.md).

<a id="gc-085-005"></a>

## 005 · Start here

This guide is the internal entry point for working on the current Gramlot core.
Read the [constitution](../00-constitution.md) first, then the current
[work status, GC-070](070-work-status.md) and the
[current 0.1.0 plan, GC-110](110-native-html-readiness.md#gc-110-020). [GC-080](080-builder-recipe-pipeline.md) records the retired recipe pipeline.
The legacy [taxonomy, GC-045](045-js-taxonomy.md) and
[census, GC-050](050-js-taxonomy-census.md) are reference inventories; they do not
describe accepted classes or authorize bulk ports.

The checkout is an implemented, locally verified development slice. It is not an
accepted release, deployed application or complete framework. The Python wheel
installs with published generic Builder 0.23.2; the declared GitHub JS dependencies
now resolve the maintained generic Builder JS 0.1.3 and browser-safe TYTX source.
Current locally packaged Uvicorn, FastAPI, Kajenn, Flask, Node, Bun and Worker
profiles pass in Chromium; see [GC-110 §3.1](110-native-html-readiness.md#gc-110-035).

<a id="gc-085-010"></a>

## 010 · Current repository map

```text
src/gramlot/
  page/builder.py        Python GramlotBuilder dialect
  page/base.py           Page base and explicit @source exposure
  server/host.py         Page loading, bootstrap, main and remote Source calls
  db/                    Reserved database contract area
  collections/html5.json  Exported builder_grammar 1.1 collection
js/src/
  builder/               Gramlot builder integration
  renderer/              GramlotRenderer live Source and DOM lifecycle
  view/                  Native HtmlElement creation/update policy
  references.js          Mounted Source/DOM references
  transport.js           Browser main/remote transport
  worker-transport.js    Standalone Worker messaging
  adapters/              Neutral JS Host/Page, FileHost and WorkerHost
  gramlot.js             Browser application bootstrap
tests/                    Python contract tests and page fixtures
js/tests/                 Node/Bun/jsdom contracts and fixtures
ports/                    Bounded port records
docs/internal/            Full internal architecture and operating records
docs_llm/internal/        Concise paired internal records
scripts/                  Documentation and browser verification helpers
```

Generated `build/`, virtual environments, installed modules and cache directories
are outputs, not source architecture. No future component, controller, database or
production-adapter folders should be inferred from this map.

<a id="gc-085-015"></a>

## 015 · Ownership boundaries

`genro-bag` and `genro-tytx` own Bag structure, registered type transport,
reconstruction, backrefs and events. Their existing protocol carries the registered
`SOURCE` root/branches, scalar values and structural node tags.

`genro-builders` owns the generic Python `BuilderBase` and SourceBag/SourceBagNode classes. Gramlot registers the existing Python SourceBag with TYTX and loads its dialect collections under amendment 11.16. `genro-builders-js` owns generic JS grammar, SourceBag,
builder association, `sourceTarget`, static rendering and the bundled HTML5 dialect:
`HtmlBuilder` and `HtmlRenderer` produce HTML text and support the Python-compatible
CSS keyword and macro conventions. Gramlot owns reactive browser realization:
`GramlotRenderer`, `HtmlElement`, Source subscriptions, live
records and update/cleanup coordination. `genro-dom-js` is retained as a reference
repository but is no longer a Gramlot dependency.

Gramlot owns its Python `GramlotBuilder` dialect responsibilities under constitution 11.16, its JavaScript dialect, `GramlotRenderer` and host/page coordination. Recipes are deferred; no active browser expansion path exists. Python declarations do
not execute browser behavior. The current dynamic slice does not include CSS shorthand,
automatic recipe-module discovery, the component inventory, application bindings,
labels, database integration or production hardening. The static HTML dialect's CSS
attribute adaptation is not wired into live rendering; that later work is expected
to reuse the dialect's `adaptAttrs` policy. Bounded host adapters live outside core.
Source authoring and the typed grammar contract are unchanged by this ownership move.

<a id="gc-085-020"></a>

## 020 · Local setup and package-boundary testing

For development from the declared dependency sources:

```sh
npm --prefix js install --ignore-scripts --package-lock=false
npm --prefix js run build
python3 -m venv .venv
.venv/bin/python -m pip install -e '.[test]'
```

Python and JS dependencies have passed clean installation. To check the package
boundary, build current browser assets before the Python wheel, then pack both
local core distributions:

```sh
npm --prefix js run build
(cd js && npm pack --pack-destination /tmp/gramlot-artifacts)
uv build --wheel --out-dir /tmp/gramlot-artifacts
```

The npm prepack rebuilds hosted/standalone bundles and runtime notices and copies
Gramlot LICENSE/NOTICE into its archive. The Python wheel contains the generated
browser resources and exported HTML5/SVG collections. Install these archives into
new environments outside the source tree, as in GC-110 §3.1. The archived
`scripts/install_js_artifacts.py` helper is for reproducing older local dependency
graphs; it is not required by the current declared GitHub installation. Packaging
and installation do not publish or accept a release.

<a id="gc-085-025"></a>

## 025 · Checks and interpretation

Run the core checks from this repository:

```sh
.venv/bin/python -m unittest discover -s tests -p 'test_*.py'
GRAMLOT_TEST_PYTHON="$PWD/.venv/bin/python" npm --prefix js test
GRAMLOT_TEST_PYTHON="$PWD/.venv/bin/python" bun test js/tests/*.test.js
npm --prefix js run build
```

When an owning-library correction is separately authorized, run its suite in that owning project. This Gramlot work keeps Builder and Bag source read-only. Use [GC-065](065-host-adapters.md) for the current Chromium fixture command
and host limitations. Current verified totals are in GC-070, with dated evidence in GC-125; totals
change as tests are added, so passing an older count does not establish acceptance.

Classify outcomes explicitly: implemented means code exists; verified means named
checks passed against identified local artifacts; accepted requires destination
review and the repository's development-line gate. A local package install proves
the package boundary, not upstream availability. Publication, releases, deployment
and consolidation into `main` remain separate owner-authorized actions.

<a id="gc-085-030"></a>

## 030 · Deliberate outline for later operations

Add operational detail here only when its owning implementation lands and is
verified. Candidate headings are dependency refresh from accepted upstream,
development-line acceptance, coverage reporting, and concrete adapter checks.
They are placeholders for navigation, not specifications, commitments or evidence
that the features exist.

JS package verification: `npm pack ./js` packages source, bundles, licenses and notices. It does not create `js/collections/`. `scripts/export_collections.py` copies canonical HTML5/SVG JSON from the installed genro-builders-js package; an optional directory argument selects an owning checkout export. Regenerate only in genro-builders-js with `npm run export:collections` and the current Python builder importable. There is no independently maintained tag list. `@gramlot/native-html/server` exports Host/Page/FileHost; the default entry remains the browser runtime. `npm test` and `npm run build` in js do not regenerate collections. Test package consumers without repository-relative imports; the declared GitHub dependencies provide the current generic sources.
