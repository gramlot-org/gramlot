# Repository map

<!-- Document ID: GC-086 -->
<a id="gc-086-005"></a>

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
│   ├── standalone.js                   Worker startup · main via message transport
│   ├── builder/
│   │   └── gramlot-builder.js          GramlotBuilder
│   ├── renderer/
│   │   └── gramlot-renderer.js         GramlotRenderer · Source live DOM lifecycle
│   ├── view/
│   │   └── html.js                     HtmlElement · native HTML/SVG DOM
│   ├── transport.js                   MainTransport · main/remote Source HTTP
│   ├── worker-transport.js            Worker messages · cancellation · termination
│   ├── references.js                  Mounted Source/DOM reference registry
│   ├── adapters/
│   │   ├── page.js                     Page · source
│   │   ├── host.js                     Host · page execution, no HTTP
│   │   ├── file-host.js                FileHost
│   │   ├── worker-host.js              WorkerHost · shared Host execution
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
