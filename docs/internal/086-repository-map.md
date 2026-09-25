# Repository map

<!-- Document ID: GC-086 -->
<a id="gc-086-005"></a>

**Release scope:** the tree in this section is the current release **0.1.2**. Section 010 lists the files of the 0.2.0 HTML/SVG binding plan. **The 0.2.0 parts are planned and not implemented.**


```text
gramlot/
├── src/gramlot/                         Python
│   ├── page/
│   │   ├── base.py                     Page · @source
│   │   ├── builder.py                  GramlotBuilder
│   │   ├── _grammar_load.py            Python dialect grammar loading
│   │   ├── _collection.py              Python dialect Collection composition
│   │   └── __init__.py                 Page authoring exports
│   ├── server/
│   │   ├── host.py                     Host · Bootstrap · typed host errors
│   │   ├── assets.py                   Packaged runtime assets
│   │   └── __init__.py                 Neutral hosting exports
│   ├── db/                             Database contracts — placeholder
│   ├── collections/                    Exported builder_grammar collections
│   ├── resources/                      Generated runtimes/notices
│   └── __init__.py                     Public Python exports
├── js/src/                             JavaScript
│   ├── gramlot.js                      Hosted/embedded Source bootstrap
│   ├── builder/
│   │   └── gramlot-builder.js          GramlotBuilder
│   ├── renderer/
│   │   └── gramlot-renderer.js         GramlotRenderer · Source live DOM lifecycle
│   ├── view/
│   │   └── html.js                     HtmlElement · native HTML/SVG DOM
│   ├── transport.js                   MainTransport · main/remote Source HTTP
│   ├── references.js                  Mounted Source/DOM reference registry
│   ├── adapters/
│   │   ├── page.js                     Page · source
│   │   ├── host.js                     Host · page execution, no HTTP
│   │   ├── file-host.js                FileHost
│   │   └── index.js                    Server exports
│   └── index.js                        Browser exports
├── tests/                              Python contracts · host fixtures
├── js/tests/                           JS contracts · host fixtures
├── docs/
│   ├── README.md                       Documentation entry
│   ├── 00-constitution.md              Agreed principles
│   ├── public/                         User manual
│   │   ├── 020-evaluate.md             Evaluation
│   │   ├── 025-try.md                  Trial paths
│   │   ├── 030-quality.md              Tests and coverage
│   │   ├── 090-classes-and-hosts.md     Classes · repository · hosts
│   │   ├── 095-writing-pages.md        Page authoring
│   │   └── 100-extensions.md           Extension points
│   └── internal/                       Contributor documentation
│       ├── 065-host-adapters.md        Host contracts
│       ├── 070-work-status.md          Status · TODO
│       ├── 075-builder-renderer-review.md
│       ├── 080-builder-recipe-pipeline.md
│       ├── 085-operating-guide.md      Operations
│       ├── 086-repository-map.md       This map
│       ├── 087-javascript-layer-boundaries.md
│       │                                Builder → Gramlot ownership
│       ├── 088-native-html-plan.md      Historical delivery plan
│       ├── 094-design-consolidation-plan.md
│       │                                Historical consolidation plan
│       ├── inventory/                 Inventory data
│       └── diagrams/                  Architecture diagram sources
├── docs_llm/                           Paired concise documentation
├── ports/                              Port contracts · reviews
├── scripts/                            Documentation · verification tools
├── assets/                             Branding
├── .github/workflows/                  CI
├── pyproject.toml                      Python packaging · dependencies
├── js/package.json                     JS packaging · dependencies
└── build/                              Generated bundles · documentation

External libraries
├── genro-bag                           Python Bag
├── genro-bag-js                        JS Bag · tree ownership · notifications
├── genro-tytx                          Typed serialization
├── genro-builders                      Python generic builder · SourceBag
└── genro-builders-js                   Grammar · SourceBag · static rendering · HTML5/SVG dialects
```

For current status use [GC-070](070-work-status.md) and for release execution use [GC-110](110-native-html-readiness.md#gc-110-020). GC-094 and the older ownership proposals are historical.

`genro-dom-js` remains a reference repository, but Gramlot no longer declares it as
a dependency. Its former live DOM responsibilities are represented here by
Gramlot-owned `GramlotRenderer` and `HtmlElement`. Dependency removal is verified
in fresh installations and rebuilt bundles; see GC-110 §3.1 for the current matrix.

Python dialect loading and Collection composition remain in Gramlot under
constitution amendment 11.16. JavaScript uses generic Builder loading and
Collection composition. SourceBag/SourceBagNode stay generic dependency classes
in both languages; these Python modules do not introduce a second Source type.

Standalone WorkerHost, WorkerTransport and mount now belong to gramlot-minimal
(amendment 11.46). Shared Host execution and rendering remain in core.

<a id="gc-086-010"></a>

## 010 · Planned 0.2.0 files

**Status: planned and not implemented.** The tree above is the current 0.1.2
repository. The files below do not exist yet. They come from the owner-confirmed
0.2.0 HTML/SVG binding plan of 2026-09-25; phase S00 records it as GC-210. Classes and
layer rules: [GC-045 §055](045-js-taxonomy.md#gc-045-055) and
[GC-087 §085](087-javascript-layer-boundaries.md#gc-087-085).

```text
gramlot/
├── src/gramlot/
│   ├── server/
│   │   └── resources.py                ResourceResolver · parse_requires (S06)
│   └── collections/
│       └── binding.json                Data-element and binding grammar (S02)
└── js/src/
    ├── bootstrap.js                    PageBootstrap (S07)
    ├── binding/
    │   ├── runtime.js                  BindingRuntime · NodeBinding (S03)
    │   ├── router.js                   DataRouter · DataRegistration · DataChange (S04)
    │   ├── installation.js             DataInstaller (S05)
    │   ├── providers.js                Provider · FormulaProvider · ControllerProvider (S08)
    │   ├── logic.js                    LogicRegistry · LogicGroup (S07)
    │   └── inline.js                   InlineCompiler, page runtime only (S09)
    ├── view/
    │   ├── controls.js                 ControlAdapter and subclasses · RadioGroups (S10, S11)
    │   ├── button.js                   ButtonBinding (S12)
    │   └── events.js                   NativeEventBinding (S12)
    └── adapters/
        └── resources.js                ResourceResolver · parseRequires (S06)
```

There is no planned `operations.js`. Existing files that change in 0.2.0 include
`js/src/gramlot.js`, `js/src/renderer/gramlot-renderer.js`, `js/src/view/html.js`,
`js/src/index.js`, `js/src/builder/gramlot-builder.js`,
`js/src/adapters/page.js`, `host.js`, `file-host.js`, `src/gramlot/page/base.py`,
`builder.py`, `src/gramlot/server/host.py` and `assets.py`.
