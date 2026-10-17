# 070 · Release and current development status

Document ID: **GC-070**. Updated: **2026-10-17**.

**Current checkpoint:** the intermediate formatting/pointer release is published (§1000). The approved 0.3 component increments are implemented locally: seventeen inputs, labelbox, formlet/groupBox, command buttons, themes/touch and the complete field-validation engine. Final cross-host, package and documentation qualification has passed; see [§1175](#gc-070-1175). No 0.3 publication has occurred.

**Inspector CSS variables:** the Styles trial and CSS download are implemented; locally verified; owner visual acceptance pending. See [§945](#gc-070-945).

**Themes and CSS guide:** GC-096 implemented and locally verified, including larger inline results with responsive code/result comparisons, reader-facing headings, the complete token catalogue and practical guidance; see [§950](#gc-070-950), [§935](#gc-070-935), [§930](#gc-070-930) and [§925](#gc-070-925).

**Graphic assets:** rich identity kit implemented and verified (2026-10-02); new vector artwork and layouts await owner visual acceptance. See [§650](#gc-070-650).

**Reusable index and root installation:** implemented and locally verified; see [§785](#gc-070-785). The stale Kajenn test environment is now updated and the full adapter suite passes.

**Next workstream:** the 0.3 closing checks are complete; obtain release authorization before bump, consolidation and publication. Translation services, DB/grid/store work and broader containers remain separate workstreams; see [GC-245 §110](../future/245-components-0-3-plan.md#gc-245-110).

**Deferred website design:** editorial HTML companions and two interactive-region modes for gramlot.org, asqueel.org and kajenn.org are recorded for later discussion (§850); no implementation started.

**Practical entry page:** GC-018 and the optional Chrome extension installation link are implemented and locally verified; publication pending (§845).

**Documentation follow-up:** all four public manuals are aligned; the examples Read the Docs site is live with 41 lessons and complete Python/JavaScript sources. Hosted documentation and CI checks passed (§840).

**Historical record — integrated release checkpoint (§835):** core 0.2.17 on PyPI/npm/JSR, examples 0.2.12 on PyPI/npm, JS server/serverless/create 0.2.9 on npm and Python server 0.2.8 on PyPI. All four release pipelines succeeded, including required tests, browser checks and clean-install gates. Teaching D1–D6 is owner-accepted (§790); additional remote/CustomTypes enforcement remains owner-deferred (11.66), Q2 is unchanged and the Date/Decimal authoring exercise is deferred pending Bag #69. Qualification details and limits are in §§825–835.

**Release 0.2.6 (published 2026-10-04):** type declarations of the JavaScript package; the examples and the runner out of the core. See [§685](#gc-070-685). Released before: 0.2.5 (2026-10-03, page module and `gramlot.inout`, [§670](#gc-070-670)), 0.2.4 ([§665](#gc-070-665)), 0.2.3 ([§660](#gc-070-660)), 0.2.2 ([§655](#gc-070-655)).

**Examples out of the core (merged 2026-10-04, released in 0.2.6):** `examples/` and the runner are removed; the core tests itself on its own fixtures; constitution amendment 11.56. See [§680](#gc-070-680).

> **Naming (2026-10-02):** in the dated text of this document, "native" as the label of a release, profile, milestone, adapter, module, API or pages names the scope of the 0.1.0 milestone (no web components, no recipes). That label has no technical meaning; current documents do not use it ([GC-005 §030](../005-documentation-policy.md#gc-005-030)). "native" for browser controls, DOM events, HTML attributes, DOM operations, Bag events or platform APIs keeps its technical meaning. Dated text is not rewritten.


**0.2.0 checkpoint (2026-09-30, historical):** S16: qualification complete (Firefox by the owner, waivers R22, R24, L1); report [GC-215](215-qualification-0-2-0.md), see [§615](#gc-070-615). Earlier: S15bis: corrections from the review before qualification, see [§610](#gc-070-610); S15: documentation and leftovers delivered in GC-095, GC-090 and the internal documents, see [§605](#gc-070-605); S14: Q3 clear error for inline code under a strict CSP, verified in core and on Chromium and WebKit; gramlot-uvicorn, gramlot-js-server and gramlot-serverless verified from the reports of their delivery chats (2026-09-30), four blocked (deferred by the owner to after 0.2.0). See [§595](#gc-070-595).
**Binding continuation:** [GC-210](210-binding-contract.md) replaces GC-165; GC-175 is historical. S00 accepted; S01 closed by the owner with proof 11 as debt, S02 and S03 start (2026-09-28).
**Dependency fixes:** forbidden by owner decision, 2026-09-25; missing Builder behavior goes into GramlotBuilderBag/GramlotBuilderBagNode (S01). See [§495](#gc-070-495).
**Hosted CI checkpoint — 2026-10-05 (historical; current evidence in §695):** the `Core tests` workflow (Python, JavaScript with coverage, Chromium checks on core fixture pages, no runner) and the `Documentation` workflow pass on `main` (`b9b2feb`, checked 2026-10-05). The earlier core and runner workflow is history ([§400](#gc-070-400)).
**Audit cleanup:** confirmed corrections implemented and locally verified; they are on `main`, whose hosted CI passes. See [§385](#gc-070-385).
**Release source availability:** public source tags verified; N3 closed. See [§380](#gc-070-380).
[Concise counterpart](../../docs_llm/internal/070-work-status.md).

This is the current checkpoint. [GC-110](110-0-1-0-readiness.md#gc-110-020) is the completed release plan; [GC-125](125-execution-history.md) preserves dated execution history. The PoC and old handoffs are evidence, not startup instructions.

**Decision review — 2026-09-24:** Amendment 11.43 requires explicit owner confirmation
for every decision. Examples-only requests do not reopen frozen framework work.
Earlier runner/core decision attribution remains under review; see [§255](#gc-070-255).

**Runner isolation — 2026-09-24:** Runner UI behavior now lives in the runner and
uses ordinary HTML IDs. HTTP and current offline checks pass; the final comparison
identified remaining standalone core extensions. The owner assigns their relocation
to gramlot-minimal and confirms moving the standalone-only Worker integration there.
The transfer is implemented and verified. See [§270](#gc-070-270).

<a id="gc-070-005"></a>
## 005 · Released baseline and current development

The accepted GitHub 0.1.0 archives provide HTML pages, typed Source,
Python/JS Page execution, live updates, freeze/unfreeze and cleanup. Reactive Data
binding is outside that frozen release scope. Safari/Firefox and grammar-drift CI
were not acceptance gates for those archives.

Separately, JSR `@genro/gramlot` 0.1.0 publication and installed-artifact checks are
recorded in [§195](#gc-070-195). The GitHub archive verification and the JSR receipt
are separate evidence; the shared version number does not establish identical
contents or a source-commit match for JSR.

The owner-requested 0.2.0 binding work (constitution 11.41, boundaries 11.42) was
qualified ([GC-215](215-qualification-0-2-0.md)), accepted by the owner and released
on 2026-09-30; patch releases followed (see the header of this document). The
owner-confirmed [GC-210](210-binding-contract.md) superseded the historical
GC-165/GC-170 contract-review pause. Runner isolation and the transfer of standalone
integration to Minimal ([§270](#gc-070-270)) are history: the runner left the core
with amendment 11.56, and Minimal is archived.

<a id="gc-070-010"></a>
## 010 · Historical implementation and verification checkpoints

The entries below preserve their dated scope. Pending acceptance/publication and
"no runtime changes" describe those checkpoints, not the current state in §005
and §015. Later decisions and verification are recorded in the linked sections.

- Implemented: strict typed Source, native HTML live rendering, shared Page/Host execution, Worker standalone, adapter-owned HTTP and page-close lifecycle. HTTP close is best effort with TTL; Worker termination releases its own registry. Neutral Host has no HTTP fetch dispatcher.
- Implemented: Python dialect grammar/transport/mixed-text/atomic insertion responsibilities under constitution 11.16; JavaScript consumes generic Builder `sourceTarget` under 11.18. Ordered Collection composition follows 11.14. Bag uses unchanged upstream source; element-type replacement uses delete/insert.
- Verified on 2026-09-22: core Python 16/16, installed Python wheel 16/16 with published Builder 0.23.2, and generic Builder JS 0.1.3 109/109 with freshly installed GitHub Bag/TYTX. The owner-authorized 0.1.3 source is now at `genropy/genro-builders-js` on `main` (a3a5860). A fresh Gramlot JS dependency installation resolves that source and passes core Node 74/74 with the existing Python test environment. The owner-authorized TYTX browser correction is available on GitHub at c8016d4. A second clean GitHub installation resolves it; Gramlot JS passes 74/74 and its browser bundle builds. TYTX passes 850/850 JS and 731/731 Python checks. These checks do not verify the seven-host matrix.
- Older eight-profile results are dated historical evidence in [GC-125](125-execution-history.md). The current matrix has seven profiles: Uvicorn, FastAPI, Kajenn, Flask, Node, Bun and Worker.
- GC-110 phase 2 implementation/ownership review is complete (2026-09-23). Both neutral Hosts now reject TTLs that cannot expire and invalid registry capacities. Local core checks pass Node 75/75 and Python 17/17; the reviewed state and limits are recorded in [GC-110 §2.1](110-0-1-0-readiness.md#gc-110-025).
- GC-110 phase 4 is complete (2026-09-23): newly built local Python wheels and JS archives installed in fresh Python 3.12/npm environments; Chromium passes Uvicorn, FastAPI, Kajenn, Flask, Node, Bun and Worker (7/7). The same bounded Source, remote, live update, freeze and disposal checks pass; server page closure and Worker termination pass. Installed adapter protocol checks pass FastAPI 3/3, Flask 3/3, ASGI/Kajenn 2/2. See [GC-110 §3.1](110-0-1-0-readiness.md#gc-110-035). This is not a registry release or Safari/Firefox verification.
- GC-110 phase 5 is complete (2026-09-23): public/internal documentation and mirrors now match the implemented core and 7/7 evidence; strict Sphinx and public boundary/link checks pass. Gramlot JS archive includes its LICENSE/NOTICE, all seven exports and bundles; Python wheel resources/collections match their owning packages byte for byte. Separate TYTX, NodeJS and Hello World notice gaps were corrected in local owning checkouts; new npm archives and relevant Python wheels include both files. See [GC-110 §5.1](110-0-1-0-readiness.md#gc-110-055). At that checkpoint those source changes were local; TYTX's later GitHub correction is verified in [GC-110 §6.2](110-0-1-0-readiness.md#gc-110-065).
- GC-110 phase 6 is complete locally (2026-09-23): Python/JS manifests and fresh wheel/npm archive are 0.1.0. Clean Python 3.12/npm installations and package contents pass; Python 17/17 and JS 75/75 pass after the SVG namespace correction. At that phase-6 checkpoint the earlier Chromium 7/7 matrix had not been rerun on versioned artifacts; the later GC-130 alignment below closes that verification gap. See [GC-110 §6.1](110-0-1-0-readiness.md#gc-110-060).

2026-09-23 ecosystem review: [GC-130](130-release-ecosystem-review.md) confirms the bounded core ownership and reports incompatible PoC entry points in current adapter packages, stale primary documentation and older-consumer exclusions. Rechecked core Python 17/17, Node 75/75, native Python adapters 8/8, standalone exporter 3/3 and strict Sphinx for core plus four adapters. The latest local 0.1.0 wheel/archive also pass Chromium 7/7 over the existing dependency graph; this is a versioned-artifact rerun, not a new clean network installation. No runtime changes or acceptance.

2026-09-23 approved alignment completed: native-only Python adapter public exports and paired primary documentation now agree with core 0.1.0. Fresh network-resolved installation of all five wheels/four npm archives passes; installed core Python 17/17, native adapters 8/8, four launcher HTTP checks, final-graph Chromium 7/7 and standalone file checks pass. Strict core/three native adapter Sphinx checks pass. Local payload is in `build/release-candidate/0.1.0`; owner acceptance and publication remain pending. See [GC-130 §035](130-release-ecosystem-review.md#gc-130-035).

<a id="gc-070-015"></a>
## 015 · Release evidence, open work and next action

> **Historical record (2026-09-24–2026-09-28):** release evidence and S00
> instructions below describe that checkpoint, not current work. Current:
> [§745](#gc-070-745). Do not resume from the old S00 instruction.

**GitHub archives — 2026-09-24:** native 0.1.0 was accepted and published as the
[archive set](https://github.com/gramlot-org/gramlot/releases/tag/v0.1.0).
[GC-135 §040](135-release-handoff.md#gc-135-040) records the nine downloaded
packages, checksums, source provenance and CI checks for that delivery. GC-110's
release execution is complete; these checks are not evidence for later changes.

**JSR — 2026-09-24:** [§195](#gc-070-195) separately records publication of
`@genro/gramlot` 0.1.0 and installed-artifact verification. The earlier statement
that no registry publication occurred describes only the GitHub closure checkpoint.
JSR artifact-to-commit traceability remains a separate open report item; neither
GitHub provenance nor current local tests close it.

**Development:** S00 transcribes the confirmed 0.2.0 contract in GC-210 and
constitution 11.47. Root/ownership, Source-only delivery, canonical dataSetter
vocabulary and R1 are settled; R3 is provisional for S12 tests. Q2–Q5 remain for
their phases. Full reactive binding is not implemented or accepted. Runner/standalone
ownership remediation in §270 and published 0.1.x evidence retain their scope.
Current verification and the enrollment decision gate are in §490. Stop after S00
report; later implementation, acceptance and publication are separate decisions.

<a id="gc-070-020"></a>
## 020 · Deferred scope and pending binding decisions

**Historical scope note:** GC-210 now settles the 0.2.0 contract; the earlier
review gates below are superseded. Only Q2–Q5 and recorded implementation questions
remain open for their consuming phases. Frozen 0.1.0 exclusions remain unchanged.

Recipes, databases, richer general components and broader browser support are not
added to the frozen 0.1.0 scope by historical plans. Binding is separately authorized
0.2.0 development, not an entirely deferred feature: its remaining contracts require
review under GC-165/GC-170 before implementation resumes. The example runner's
provisional behaviors do not constitute an approved future web-component API.

<a id="gc-070-025"></a>
## 025 · Updating this checkpoint

Update this file and its mirror after meaningful progress, checks, scope changes or blockers. Separate implemented, locally verified, clean-installed and owner-accepted states. Append dated evidence to GC-125 without promoting old “current” or “next” text. Report result, remaining work and next action without routine Git summaries.

<a id="gc-070-030"></a>
## 030 · Historical execution checkpoints

The former GC-070 chronology, including original decisions, rejected paths, artifacts and test counts, is preserved in [GC-125](125-execution-history.md). Its past-tense and present-tense snapshots are historical.

<a id="gc-070-035"></a>
## 035 · Superseded status snapshots

Earlier GC-094 phase states and eight-profile checkpoints are in [GC-125](125-execution-history.md); they do not define the current release gate.


<a id="gc-070-040"></a>
## 040 · Integration repository reorganization — 2026-09-24

Owner approved the six integration repositories, minimal/Kajenn reorganization
and native Django alignment (constitution 11.19–11.20). Implementation is local:
minimal owns the unchanged generic ASGI adapter plus browser/Worker packaging;
Kajenn imports minimal and exposes its host integration; Django uses ordinary
views/URLconf with the neutral core Host. Hello World has five Python host profiles
and uses the new local package names. The original core 0.1.0 assets are unchanged.

Verified locally: installed minimal ASGI protocol with Kajenn imports blocked;
exporter 3/3 and installed CLI/Chromium file-origin live Source/Worker without
HTTP(S); Kajenn native checks 2/2, Ruff, strict Sphinx, wheel imports and sdist
mirror contents; Hello World Python/JS checks and all five installed Python profile
imports; Django installed page/asset and Chromium heading/disposal smoke. Django native tests pass 3/3, covering lifecycle/ownership, request rejection,
capacity and application error mapping; Ruff, strict docs and package builds pass.
Its local CI configuration now builds core browser assets before installation
and checks the installed native wheel; it has not been executed remotely. Core strict Sphinx
and public link/search/mirror checks pass. This is targeted integration evidence,
not a newly rerun full eight-profile browser matrix.

The owner deferred all integration GitHub publication until further reviewed PoC
transfer/cleanup (constitution 11.21), superseding the earlier Django publication
instruction. No push, remote rename, tag, release, registry publication or deployment
was performed. Physical repository paths and GitHub names remain unchanged; minimal
and Kajenn are local development package identities. Future Kajenn CI needs the
minimal source to be published; it is not remotely verified in this local phase.

Next phase, requiring owner-selected scope: review the remaining PoC transfers and
cleanup. Historical modules are evidence, not approved core capabilities. Publication
requires a new explicit owner instruction after those steps.

Owner-requested reminder: [GC-140](140-integrations-and-examples.md) records the
six integration repositories, the agreed Hello World application and its eight
execution profiles, plus publication and historical-example boundaries. No further
PoC transfer list has been agreed. This is documentation only; runtime and
verification results above are unchanged.


<a id="gc-070-045"></a>
## 045 · Core HTML/SVG examples — 2026-09-24

Owner authorizes the [GC-145](145-html-svg-examples.md) local workstream: twelve
paired examples, shared `themes/gramlot-base`, and `examples/00-runner` with an
HTML catalogue, list and iframe panels. PoC work is set aside. Three Sol agents completed theme, examples and runner; root reviewed and integrated
the work. Verified 26 catalogue/example pages in Chromium with exact Python/JS DOM
parity, native controls, keyboard language switching, iframe navigation, source/README
links and light/dark/narrow layouts. Strict Sphinx and documentation checks pass.
The catalogue inventories all 117 grammar entries, with non-rendered contexts and
the ruby annotation grammar gap explicit. Owner visual acceptance remains pending.
Code viewing belongs to the runner; missing Inspector capability remains explicit.
No publication or changes to the already released archives are authorized.


<a id="gc-070-050"></a>
## 050 · Runner correction — 2026-09-24

Owner rejected the earlier runner presentation: language tabs and sidebar cards
were not the intended interface. The corrected contract is a compact title list
and persistent example tabs, each with explanation above the iframe. The serving
integration selects the language. Implemented and verified: 80/80 JavaScript tests, both integration-specific
runners in Chromium, and all 26 example/catalogue pages. Checks include one tab
per example, explanation above iframe, lazy loading and preserved form state on
reactivation. The in-app browser was refreshed and checked. Earlier browser tests
did not establish owner acceptance of the old UX; corrected visual acceptance
remains with the owner.
See constitution amendment 11.23.


<a id="gc-070-055"></a>
## 055 · Runner introduction and split source — 2026-09-24

Owner refines the runner under constitution 11.24: an introduction-only first tab,
all examples in the left list, and explanation above a resizable preview/source
pair in each example tab. Source follows the serving integration and uses
`hljs.highlightAuto`. Implemented and verified: 84/84 JavaScript tests and both runners in Chromium.
Browser checks cover exact source text, syntax highlighting, divider drag/keyboard,
retained frame state and split position, plus all 26 paired pages and light/dark/narrow
layouts. Strict Sphinx and public documentation checks pass. No publication or owner visual acceptance is implied.


<a id="gc-070-060"></a>
## Catalogue removed from runner — 2026-09-24

Owner rejects the catalogue as confusing (constitution 11.25). Removed its sidebar
entry, generated panel, host routes and served source assets. The introduction
and twelve numbered examples remain. Previous 26-page evidence is historical;
the current suite covers 24 Python/JavaScript example pages.

Verified in Chromium: both runners expose twelve titles, all 24 pages pass parity
and interaction checks, and the refreshed in-app browser starts with Hello World
in the list and Introduction selected.


<a id="gc-070-065"></a>
## Compact runner, Markdown and optional keyboard navigation — 2026-09-24

Owner requests smaller typography/spacing, original README content rendered in
the upper panel, no duplicate source/README links and an initially unchecked
keyboard-navigation option at the sidebar bottom. Implemented with Source text,
a shared sanitized Markdown view and Bag-owned tab keyboard state. The approved
palette already supplied all theme colors; the runner now emphasizes its navy
navigation, blue selection and yellow brand accent. The compact runner passed both integration browser checks
and all 24 example pages; 85 JavaScript tests and strict documentation checks pass.
Subsequent owner request adds the approved Gramlot logo and a light/dark selector
controlling both runner and iframe documents. Verified: 88/88 JavaScript tests;
both runners and all 24 pages in Chromium. Checks cover rendered Markdown,
keyboard opt-in, loaded logo, light/dark changes on existing and newly opened
iframes, retained form/split state and narrow layouts.


<a id="gc-070-070"></a>
## Category navigation and preview proportion — 2026-09-24

Constitution 11.28 groups the twelve examples under HTML / SVG. The category
opens its folder README as a Markdown-only tab. Preview/code starts at 65/35,
with slightly smaller code text. This establishes the category structure for
future examples without adding unimplemented binding categories. Verified:
89/89 JavaScript tests and both runners in Chromium, including category README
without iframe, twelve nested examples, initial ratio 65, retained ratio/frame
state and all 24 example pages. The in-app category view was refreshed.


<a id="gc-070-075"></a>
## Concise teaching introduction — 2026-09-24

Owner requests lower tabs with slightly smaller labels and a short, learner-facing
category README. Removed the repeated example inventory and setup details from
that README; setup remains in the runner guide. Tabs now use a compact minimum
height and smaller type. No runtime behavior changed.

Verified in the refreshed in-app runner: category text renders as three short
paragraphs; tab height is about 25px with 11.9px labels at the default text scale.


<a id="gc-070-080"></a>
## Local Bun runner trial — 2026-09-24

Owner requests a Bun-served trial. Launcher now accepts explicit JS_RUNTIME=node
or bun (default node). Bun 1.3.14 runs the JavaScript host at the local trial
URL http://127.0.0.1:8092/js/index; Uvicorn remains the development gateway for
shared assets and forwarding. Chromium verifies both runners and all 24 pages,
including category navigation, source highlighting, splitter and theme changes.
The Bun JavaScript runner is open in the in-app browser. No deployment.


<a id="gc-070-085"></a>
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

Minimal exporter tests: 6/6 pass, including directory packaging and rejected
invalid routes/assets. The installed exporter matches the verified source.


<a id="gc-070-090"></a>
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


<a id="gc-070-095"></a>

## 095 · Minimal repository rename — 2026-09-24

Owner authorized completing the repository rename. The local directory is now
`gramlot-minimal`, and GitHub confirms `gramlot-org/gramlot-minimal`. Origin,
package metadata, runner setup instructions and local package dependency now use
the new name. The Python editable installation was regenerated at the new path.
Both existing profiles remain: Python/ASGI/Uvicorn and Browser/Worker standalone.
Verified after the move: ASGI protocol test 1/1, exporter tests 6/6, complete
12-example runner directory export, and GitHub repository identity. No source
push, package publication, release or deployment was performed. Earlier dated
records retain the former repository name as historical evidence.


<a id="gc-070-100"></a>

## 100 · Shared example ownership documented — 2026-09-24

Owner confirmed the upstream/downstream teaching model. GC-025 section 020 and
constitution amendment 11.31 define Gramlot as the single maintained source for
example pages, READMEs, runner, logo and theme. Six downstream READMEs and paired
native guides explain their hosting responsibility and dependency-update/restart
or re-export cycle. Generated assets are outputs; copied teaching suites are
not independently maintained. Uniform example packaging and launch commands
remain pending implementation and verification; this change documents policy only.

Verified: strict core Sphinx/public-doc checks; strict Flask docs and docs_llm,
FastAPI docs, Django docs and Kajenn docs builds; matching, unique anchors in
eight updated guide pairs. FastAPI/Django/Kajenn docs_llm have no standalone
Sphinx configuration and were checked as Markdown mirrors. Minimal/Node guides
were checked as Markdown pairs. No external Read the Docs deployment or source
publication was performed.


<a id="gc-070-105"></a>

## 105 · TYTX JSR feasibility dry-run — 2026-09-24

Owner explicitly requested preparing and running a JSR dry-run in genro-tytx.
A bounded `jsr.json` uses candidate name `@genro/tytx`, existing version 0.15.0,
and actual entry point `js/src/index.js`. No implementation, dependency or
consumer changes were made. `bunx jsr publish --dry-run --allow-dirty` succeeds
with two warnings: unanalyzable optional dynamic imports and a JavaScript entry
point without type declarations. Scope ownership and published-package behavior
are not verified by this dry-run. Runtime/package portability must be checked
before publication; no account, package upload, commit or push was performed.
Builder and Bag remain outside this bounded authorization.


<a id="gc-070-110"></a>

## 110 · TYTX prepublication verification — 2026-09-24

Owner requested completing the checks before publication. Existing source passes
857/857 Node tests and all six Bun suites when run in separate processes. A
single combined Bun invocation fails (Python server startup and shared test
state), so no combined-suite compatibility is claimed. A locally packed npm
archive installed in a temporary consumer passes 857/857 Node tests. Four Bun
suites pass there; browser-bundle dynamic import and Python HTTP server startup
fail in that installed-fixture layout and need diagnosis. This archive is not
the JSR-generated compatibility artifact. JSR dry-run warnings about dynamic
optional imports and absent declarations remain unresolved. Publication is not
ready: validate JSR dependency resolution/browser conditions and the installed
Bun checks first. No library implementation or published package was changed.
Evidence: /private/tmp/tytx-install-6oi1hd2g and /private/tmp/tytx-bun-*.log.


<a id="gc-070-115"></a>

## 115 · JavaScript server integration renamed — 2026-09-24

Owner renamed the Node/Bun integration to gramlot-js-server. Local repository,
GitHub repository, origin, development package, runner dependency and current
Hello World imports use the new name. Native and bun entry points are preserved
under that package; no old-name alias is introduced. Refreshed runner dependency
installation and real-listener tests pass on Node and Bun (1 each). Historical
release artifacts retain their names. No source push, release or deployment.
TYTX prepublication correction remains authorized and pending; this rename was
the owner's requested intervening task.


<a id="gc-070-120"></a>

## 120 · TYTX prepublication corrections verified — 2026-09-24

Owner authorized correcting the identified TYTX issues. Literal optional imports
replace computed specifiers without changing absent-codec behavior. Public type
declarations cover the existing entry point. Browser test artifacts use a unique
canonical temporary directory; Python HTTP fixtures use an ephemeral port with
startup diagnostics. Node and Bun each pass all 857 tests together, both in the
checkout and from a freshly installed local npm archive. Strict installed-consumer
TypeScript checks and absent-codec checks pass. JSR dry-run succeeds without
warnings. The JSR-generated compatibility artifact remains untested until an
authorized publication; conditional browser mapping needs that final verification.
TYTX records evidence in JSR-VALIDATION.md. No publication, push, release or
consumer migration occurred. Previous failed checks are superseded by this run.


<a id="gc-070-125"></a>

## 125 · TYTX published; JSR artifact defect discovered — 2026-09-24

Owner authorized ecosystem publication/migration and authenticated JSR. TYTX
0.15.0 was published as @genro/tytx. A clean install from npm.jsr.io reveals
that the generated package has an empty dependencies map, optional bare imports
rewritten to nonexistent relative paths, and the Node branch selected for
#dependencies. Decimal silently falls back to Number and MessagePack fails.
Do not migrate consumers to this artifact. Local archive and dry-run success
did not establish JSR artifact correctness. Owner requested changing README's
npm badge to JSR; the local README now uses the official JSR badge. Published
0.15.0 retains its prior README. A packaging correction and a fresh published
artifact test are required before proceeding to Bag/Builder and other consumers.
The decision to include all codecs in the JSR package has been requested.


<a id="gc-070-130"></a>

## 130 · TYTX JSR correction published and verified — 2026-09-24

Owner approved always including all JavaScript codecs. TYTX 0.15.1 replaces
optional dynamic codec imports and conditional package imports with one static
graph and declared dependencies. Published with owner authentication. A clean
consumer installed from npm.jsr.io contains all four codec dependencies and
passes 857/857 Node tests and 857/857 Bun tests, including browser bundling and
Python HTTP round trips. The published README includes the JSR badge. Version
0.15.0 is defective and must not be adopted; 0.15.1 is the verified JSR artifact.
Evidence: /private/tmp/tytx-jsr-node.log and /private/tmp/tytx-jsr-bun.log.
Remaining ecosystem migration proceeds to Bag, then its dependants; no other
package has yet been published or switched to JSR in this migration.


<a id="gc-070-135"></a>

## 135 · Bag JSR publication blocked by version policy — 2026-09-24

Bag 0.4.1 preparation consumes TYTX from JSR and uses Web Crypto with the
owner-approved Node 22 minimum. Node/Bun source tests each pass 529/529.
Publication failed: the npm alias wildcard was rewritten without a constraint.
The native JSR import map was then tested with the official Deno publisher,
which rejects `jsr:@genro/tytx@*` as missing-constraint as well. The earlier
wrapper dry-run did not establish server acceptance. Bag is not published.
Owner decision requested for a JSR exception to section 12: a minimum dependency
version >=0.15.1 without an upper cap, excluding the defective TYTX 0.15.0.
Do not silently pin, cap or bypass the publisher's validation. Bag has no public
TypeScript declarations; allow-slow-types acknowledges that separate limitation.


<a id="gc-070-140"></a>

## 140 · Minimum-only JSR range unsupported — 2026-09-24

Owner approved >=0.15.1 without an upper bound (amendment 11.34). Deno 2.6.7
rejects this native specifier; isolated `deno info --no-config --no-lock` with
Deno 2.9.6 confirms the same invalid-specifier failure. No Bag publication.
Requested a further owner decision on compatible caret ranges, e.g. ^0.15.1.
The updated publisher also blocks freshly published TYTX via dependency-age
policy. Auto-review rejected persisting minimumDependencyAge=0; no such change
was applied. Do not bypass that rejection. Existing versions remain unchanged.


<a id="gc-070-145"></a>

## 145 · Compatible JSR ranges approved and checked — 2026-09-24

Owner approved caret ranges for JSR dependencies (amendment 11.35). Bag now
declares TYTX ^0.15.1 in both its native JSR import map and npm alias. A Deno
2.9.6 dry-run succeeds in a temporary staging directory with an operation-local
minimumDependencyAge=0; the repository security configuration remains unchanged.
The temporary setting was removed afterward: JSR includes jsr.json in the
publication, so that validation copy must not be published with the exception.
CLI --min-dep-age=0 and preinstallation did not prevent publish from enforcing
its default 24-hour age policy. Repeating with the original config and manual
node_modules still fails on freshly published TYTX. Bag remains unpublished;
source test evidence is still 529/529 on Node and Bun from the previous run.
Remaining: complete publication with the repository configuration once dependency
age permits it or a verified nonpersistent publisher override is found; verify
the actual artifact before migrating downstream packages.


<a id="gc-070-150"></a>

## 150 · Bag publication retry still blocked by dependency age — 2026-09-24

Owner requested retry. The original-config dry-run at 10:14 UTC again rejects
TYTX ^0.15.1 under Deno's default 24-hour dependency age policy. Public npm.jsr.io
metadata reports TYTX 0.15.1 published at 2026-09-24T09:22:19.240Z, making it
eligible after 2026-09-25 11:22:19 Europe/Rome. No publication was attempted after
the failed dry-run; Bag remains unpublished. Next: retry after this threshold,
publish with owner authentication and verify the installed artifact.


<a id="gc-070-155"></a>

## 155 · Targeted cooldown exception awaiting precise authorization — 2026-09-24

Deno documents minimumDependencyAge object form with age and exact package
exclusions. Proposed Bag setting: age P1D, exclude jsr:@genro/tytx and
npm:@jsr/genro__tytx. Auto-review rejected applying the persistent setting:
the owner's request to avoid delays was not considered specific authorization
for its future security impact. No Bag edit or dry-run occurred. Requested
explicit approval for this exact setting; third-party protection remains intact.


<a id="gc-070-160"></a>

## 160 · Genro cooldown exemption applied; Bag awaiting JSR authentication — 2026-09-24

Owner explicitly approved scope-wide exemptions after clarifying JSR-only
publication. Bag retains P1D for external packages and excludes jsr:@genro/*
and npm:@jsr/genro__*. Original-repository Deno dry-run passes; the age blocker
is resolved without disabling third-party protection. Publication of @genro/bag
0.4.1 is started and awaits owner JSR authentication. It is not yet published.
Bag has no public TypeScript declarations; the publisher's slow-types warning
remains acknowledged. Next: inspect publication result and verify actual JSR
artifact before migrating Builder and subsequent dependants.


<a id="gc-070-165"></a>

## 165 · Bag published and actual JSR artifact verified — 2026-09-24

Owner authenticated publication; @genro/bag 0.4.1 is published on JSR. A clean
consumer install from npm.jsr.io passes 529/529 tests under Node and 529/529
under Bun. Only copied test imports were adjusted to the generated TYTX npm
name so registry registration shares the same TYTX instance as published Bag;
production artifact sources were not modified. An initial test harness using
a second TYTX alias failed due to duplicate registry instances, then passed
with the matching published dependency name. Evidence: /private/tmp/bag-jsr-artifact-
node.log and bag-jsr-artifact-bun.log. Next: Builder migration, then dependants.


<a id="gc-070-170"></a>

## 170 · Builder prepared; JSR package creation pending — 2026-09-24

Owner requests Builder followed by Gramlot. Builder 0.1.4 uses verified JSR
Bag ^0.4.1 and TYTX ^0.15.1 with consistent npm.jsr.io identities, Node 22 minimum
and the approved scope cooldown exception. Node and Bun each pass 109/109 tests;
Deno dry-run passes. Owner authentication succeeded but @genro/builders does not
yet exist: publisher waits for creation in the owner's JSR account. No Builder
publication success yet.

Gramlot preparation switches JS source/tests and dependencies to the same JSR
identities and adds a root JSR manifest for @genro/gramlot 0.1.0 with existing
entry points and shared theme/example assets. This is preparation only: install,
build, dry-run, artifact coverage and full tests await published Builder. Existing
GitHub release archives remain unchanged. No Gramlot publication is claimed.


<a id="gc-070-175"></a>

## 175 · Builder verified; Gramlot exposed Bag baseline mismatch — 2026-09-24

Builder 0.1.4 published; its clean JSR install passes 109/109 Node and Bun tests.
Gramlot's JSR migration exposed a provenance error: Bag JSR 0.4.1 was prepared
from main 0.4.0 rather than the native-HTML consolidated 0.5.2 line required by
Gramlot. With the correct Python test interpreter, 15 Gramlot tests still fail
on branch observation/detachment. Do not publish Gramlot with this dependency.

Bag preparation now incorporates only committed src/tests/docs differences from
main to codex/native-html-dependencies (f324b05); uncommitted mutation-validator
experiments are excluded. Version 0.5.3 retains JSR packaging and Web Crypto.
All 589 tests pass on Node and Bun; warning tests use explicit capture/restoration
instead of Bun's unsupported node:test mock API. Dry-run passes; publication
awaits owner authentication. Initial auto-review rejection of cross-repo edits
was resolved by showing the existing explicit authorization in amendment 11.33.

Gramlot build succeeds. Its dry-run now resolves explicit highlight.js subpaths
but is blocked by external DOMPurify ^3.4.16's age. Keep external cooldown in
force. Next: verify published Bag 0.5.3, update/publish Builder's compatible Bag
range, retest Gramlot with corrected dependencies and complete its dry-run.


<a id="gc-070-180"></a>

## 180 · Bag 0.5.3 verified; Builder 0.1.5 awaits authentication — 2026-09-24

Bag 0.5.3 published; its actual JSR artifact passes 589/589 Node and Bun tests.
Builder 0.1.5 updates its Bag range to ^0.5.3 and passes 109/109 tests on both
runtimes plus the Deno dry-run. Mixed Deno/npm node_modules caused a local
msgpack installation failure; a clean registry installation resolved it without
production source changes. Builder publication now awaits JSR authentication.
Gramlot manifests are prepared for Bag ^0.5.3 / Builder ^0.1.5. Reinstall and
retest after Builder publication. External DOMPurify 3.4.16 age threshold is
2026-09-24 17:29:57 Europe/Rome; its protection has not been weakened.


<a id="gc-070-185"></a>

## 185 · Builder 0.1.5 verified; Gramlot runtime checks pass — 2026-09-24

Builder 0.1.5 published and actual registry artifact passes 109/109 Node and
Bun tests. Gramlot installed Bag ^0.5.3 and Builder ^0.1.5 from JSR: 93/93 Node
tests pass using the project Python environment, and browser build succeeds.
Bun initially differed only in its JSON Blob MIME charset parameter; the beacon
test now asserts the MIME essence while still checking exact JSON body content.
Node's two beacon tests pass after that test-only change; the full Bun suite
passes 93/93. Production beacon behavior is unchanged.

Gramlot is not published. Full JSR dry-run and actual publication/artifact tests
remain outstanding: the last dry-run stopped at external DOMPurify ^3.4.16 age
policy, eligible at 17:29:57 Europe/Rome today. Do not claim complete registry
readiness or that this is the final possible publisher issue before it passes.


<a id="gc-070-190"></a>

## 190 · Gramlot publication started with approved temporary DOMPurify — 2026-09-24

Owner explicitly accepts temporary DOMPurify 3.4.15 to accelerate publication,
after disclosure that 3.4.16 fixes two IN_PLACE vulnerabilities. Gramlot's
Markdown view sanitizes strings with the HTML profile and uses neither IN_PLACE
nor custom hooks. Both manifests specify 3.4.15 for this release; update to
3.4.16 in a subsequent release after 17:30 Europe/Rome. This is a pending task,
not an automatically scheduled action. No external cooldown exemption was added.

With 3.4.15 installed, Gramlot passes 93/93 Node tests, 93/93 Bun tests, build
and JSR dry-run. Explicit publish unignore rules include exported js/dist
bundles. Publisher warnings: no public .d.ts and FileHost's dynamic import
is intentionally an absolute file URL resolved at runtime, not a bare import
requiring rewriting. Installed-artifact host tests remain required.

Publication @genro/gramlot 0.1.0 is started and awaits owner JSR authentication
and package creation if absent. It is not yet confirmed published. Next: verify
publication and actual registry artifact, including entry points and runtime.


<a id="gc-070-195"></a>

## 195 · Gramlot 0.1.0 published and installed artifact verified — 2026-09-24

Owner created @genro/gramlot and authenticated. JSR confirms successful 0.1.0
publication. A clean npm.jsr.io consumer contains Bag ^0.5.3, Builder ^0.1.5,
TYTX ^0.15.1 and the explicitly approved DOMPurify 3.4.15. Its actual runtime
sources pass 93/93 Node and 93/93 Bun tests, including FileHost and Python/JS
interop with the existing Python environment. Test-only fixture setup copies
the suite/export script and points two test grammar imports at the repository's
Python grammar fixture; published production sources are unchanged.

All six module entry points import successfully, the standalone-runtime IIFE
exposes GramlotStandalone, and the package contains gramlot-base/theme.css and
the HTML/SVG example README. Standalone bundle smoke is a Node global-context
evaluation, not a new full browser/offline acceptance run. Evidence lives in
/private/tmp/gramlot-artifact-node.log and gramlot-artifact-bun.log.

Requested Builder then Gramlot JSR publication is complete. Remaining separate
follow-up: upgrade DOMPurify to 3.4.16 in a subsequent Gramlot release after the
24-hour threshold, then verify again. Other integration consumer migrations and
other Genro packages remain outside this completed publication pair. No source
push, deployment, npmjs.com release or scheduled future action occurred.


<a id="gc-070-200"></a>

## 200 · Standalone ZIP distribution decision — 2026-09-24

Owner confirms gramlot-minimal releases as the home of the generated standalone
example ZIP. Core owns all teaching sources and links to the Minimal download;
Minimal owns exporting and packaging. Recorded in constitution 11.37 and GC-025.
The existing core GitHub release was inspected: its native ZIP is a package
bundle, not the twelve-example standalone runner. No ready-to-use runner ZIP
has been published in this work. Remaining: refresh exporter consumers, build
and verify the archive, publish it with version provenance, then add a direct
asset link. This checkpoint records the decision, not delivery completion.


<a id="gc-070-205"></a>

## 205 · README consistency follow-up — 2026-09-24

Owner reports that Bag JS lacks the README badges present in TYTX and asks to
record these presentation details for later harmonization. Pending follow-up:
compare TYTX, Bag JS, Builder JS and Gramlot README conventions; agree a shared
badge set and consistent ordering, installation guidance and documentation links.
Use JSR package badges for this distribution path and only display CI, coverage
or compatibility badges backed by actual project evidence. Check current README
contents before editing; the reported mismatch is not yet independently verified.
No README changes or publication performed in this checkpoint. This is a deferred
presentation task, not a new runtime gate for 0.1.0.


<a id="gc-070-210"></a>

## 210 · Live Source card removal trial — 2026-09-24

Owner requests × buttons removing cards with existing Builder/Source APIs.
Example 10 now declares stable page/cards/card labels and the same short onclick
expression in Python and JavaScript. It calls the browser Builder SourceBag's
popNode; no direct DOM removal, binding or application listener is introduced.
Constitution 11.38 records the bounded exception. README and runner description
explain the action and its limits.

Chromium checks pass on the hosted Python and JavaScript profiles: middle-card
Source deletion and DOM removal, renderer record cleanup, unchanged sibling DOM
identity, removal of all cards, keyboard activation and reload restoration.
The regenerated standalone directory renders but deletion fails: its CSP
script-src self/file/blob blocks inline event handlers. This is an unresolved
standalone integration gap, not a Source reactivity defect. CSP was not weakened.
The example README documents this limitation; the trial is not a universally
verified or published update. scripts/verify_live_cards.mjs reproduces both the
hosted passes and the offline failure. Public documentation checks pass.


<a id="gc-070-215"></a>

## 215 · Rich live Source playground and interval animation — 2026-09-24

Owner requests a richer page and a small setInterval animation. Added example 13
in paired Python/JavaScript, README and CSS, registered in the runner catalog and
local launcher. It creates list elements with Builder.wrapSource, removes/clears
Source children, changes heading text and SVG fill, and animates circle cx every
50 ms using SourceNode.setAttr. renderer.onDispose clears the interval on section
removal and whole-page disposal. Constitution 11.39 records this bounded inline
script/action exception; no general bindings or controllers were added.

Chromium hosted Python and JavaScript checks pass, including add/remove/clear,
empty-list removal, re-add after clear, heading/color changes, Source/DOM animation
agreement, and interval cleanup on section and page disposal. Verification is in
scripts/verify_live_playground.mjs. Syntax/public documentation checks pass.
Local trial runner: http://127.0.0.1:8095 (e13). Standalone CSP still blocks inline
scripts/actions, documented in the README; no standalone acceptance or publication
is claimed. The previously agreed ZIP delivery remains pending.


<a id="gc-070-220"></a>

## 220 · Standalone inline actions and animation verified offline — 2026-09-24

Owner explicitly directs removal of the directory export CSP. Minimal now omits
that meta tag; existing exporter assertions were aligned. Core standalone assigns
its existing browser-global Gramlot instance before main insertion, matching
hosted bootstrap and allowing example scripts to register their timer cleanup.
Examples install configuration now selects npm.jsr.io for @jsr dependencies;
local core/Minimal packages were refreshed rather than editing installed sources.

Verified Chromium direct file URLs with browser offline: example 10 card deletion,
Source/DOM cleanup, sibling identity and keyboard; example 13 creation, deletion,
clear, text/color changes, animation and interval cleanup on section/page disposal.
Core standalone tests pass 7/7; Minimal directory exporter tests pass 3/3; public
documentation checks pass. Rebuilt build/examples-standalone including all thirteen
examples and updated explanatory text, preserving the old generated directory in
a temporary backup. No package publication or ZIP upload occurred. This resolves
the CSP limitations recorded in 210/215; amendment 11.40 records owner direction.


<a id="gc-070-225"></a>

## 225 · Binding 0.2.0 design preparation — 2026-09-24

Owner requests read-only PoC recovery and deliberate design before introducing
binding. PORT-0005-data-binding records inspected evidence, current Builder/Data
primitives, proposed boundaries, test contract and unresolved decisions. Existing
Gramlot.data shares Builder.data; no new datastore is needed. Missing work includes
reactive projection/writeback and an agreed initial Data delivery contract. The PoC
handler/application cannot be copied as a unit without importing unrelated features.
No runtime binding implementation, dependency changes, branch consolidation or
approval of a final API occurred. Next discuss initialization, path semantics,
writeback timing/types and the bounded 0.2.0 scope with the owner. Prior 0.1.0
integration/ZIP follow-ups remain open and are not completed by this investigation.


<a id="gc-070-230"></a>

## 230 · Parallel binding recovery and legacy comparison — 2026-09-24

Owner requests agents for complete recovery and GenroPy legacy as reference for
maximum similarity. Three Sol agents audited pointers/paths, reactivity/lifecycle,
and initial Data/writeback. Reviewed reports are retained under PORT-0005 with
source/test references. Recovered earlier owner syntax/legacy compatibility
choices; replaced the premature reduced design sketch with an evidence matrix.
PoC supports both setup Data and declarative data setters; these are not an
arbitrary either/or choice. Expressions, volumes, symbolic tails, moving paths,
fired and typed input semantics require explicit compatibility reconciliation.

Executed focused PoC checks: 42 pointer/path/expression, 35 writeback/embryo/null,
27 reactive/local-logic/branch tests, all passing (104 total). Root reproduced
current static-read/no-reactive-update behavior and upstream expression/path gaps.
Legacy evidence was inspected, not executed. No runtime implementation, branch
consolidation, dependency edit, publication or final 0.2.0 API approval occurred.
Next: derive executable compatibility contracts from this inventory, then settle
only unresolved differences and the order of bounded 0.2.0 implementation.


<a id="gc-070-235"></a>

## 235 · Maintainable binding implementation proposal — 2026-09-24

Owner requests a maintainable implementation direction. Paired GC-155 proposes
ownership boundaries, one Data-to-view update route, initial-data contract gates,
six incremental deliverables and compatibility cases, based on PORT-0005 evidence.
Generic pointer/expression semantics remain in Builder, values/events in Bag;
Gramlot adds dependency tracking and native writeback around its existing renderer.
No alternate syntax, duplicated parser or second render loop is proposed.

This is a design artifact, not runtime implementation or final API approval.
Unresolved transport/initialization and legacy differences stay explicit. Existing
upstream edit authorization covers JSR migration, not new binding feature changes;
record a scope extension before such writes. Preparing develop still requires
preserving/consolidating the current 0.1.0 working baseline. No branch mutation,
package change, new runtime tests or publication occurred in this checkpoint.


<a id="gc-070-240"></a>

## 240 · End-to-end legacy SourceNode investigation — 2026-09-24

Owner requests accurate investigation of the whole flow, explicitly including
relative/symbolic SourceNode context, GET/SET/PUT/FIRE, delayed operations and
formula/controller together. Three Sol audits plus root lifecycle investigation
are preserved under PORT-0005 and synthesized in paired GC-160. GC-155 now marks
formula/controller/delay as initial scope and module names as provisional.

Confirmed material gaps include published PUT emitting despite reason=false,
fired metadata missing, macro syntax vs methods, expressions/path resolution,
movable subscriptions and startup/delay differences. Legacy _init/_onStart/_onBuilt
and global/node/provider timers are distinct. No runtime changes were made.

Executed focused PoC suites: 33 SourceNode, 24 delayed/logic, separate 8 provider
(overlapping); legacy bag_mixin 34 pass and frozen-discard vm harness 8 pass.
Combined legacy comparison has 39 pass and 7 fail; adapter construction prevents
one fireItem comparison, so it is not evidence of semantic mismatch. Failures
remain explicit. No full legacy browser or destination parity claim. Paired
anchors/local report links and public doc checks pass. Next derive executable
compatibility cases, diagnose comparison failures and settle actual deviations
before approving the implementation boundaries and upstream scope.


<a id="gc-070-245"></a>
## 245 · Binding execution, API attribution and upstream issue — 2026-09-24

Owner requests GC-165's detailed plan and Sol implementation. Two Sol agents
implemented contract probes and the resolved Source-projection prerequisite.
The latter reuses Builder runtimeValues for updates and preserves live input
selection on unchanged values. Four focused tests pass; after the missing-text
edge correction the complete JS suite passes 97/97. Build and public documentation
checks pass. Input selection checks use JSDOM, not a new browser acceptance run.

Owner then clarifies the proper boundary: Gramlot can specialize Python/JS Builder
base classes. Existing Bag doTrigger=false is verified to suppress events; a
Gramlot quiet PUT contract is not proof of a Bag defect. Missing legacy fired
metadata and == evaluation are not established upstream contract violations.
No blanket Bag/Builder modification requirement remains (amendment 11.42).

A public-API reproducer proves symbolic #FORM/#ANCHOR/#id paths lose ?caption
while the equivalent direct attribute read succeeds: three failing cases.
Reported with the complete runnable test at
https://github.com/genropy/genro-builders-js/issues/1 . No Bag issue was opened
without a demonstrated contract defect. The quiet-write comparison is kept
separately under js/tests/binding-contracts, outside the ordinary suite; it is a
Gramlot target, not an upstream regression assertion. Dependencies remain untouched.

Next: revise implementation assignments around Gramlot subclasses and existing APIs;
settle initial Data/vocabulary contracts and continue the complete provider/binding
flow. Full binding, upstream resolution and release acceptance remain unfinished.


<a id="gc-070-250"></a>
## 250 · Preventive source audit before further binding work — 2026-09-24

Owner challenges historical segmented-Data documentation and requests a preventive
audit of the documents informing implementation. GC-170 records the source classes,
reviewed scope, original conversation provenance, corrected claims and remaining
decisions. GC-155/160/165 and all PORT-0005 reports now prominently link the audit;
active plans no longer require PoC volumes or generic-library changes for every
legacy difference. They recognize Gramlot subclass specialization explicitly.

Original first-pages records 33,39–41 show assistant statements that old JS segments
were retained temporarily and path alignment remained open, not owner adoption.
User 34 approves browser reactivity only; 42 asks for explanation; 987 proposes
page-owned Data as a question. None authorizes deriving a full current contract
from a historical manual. All five local archive JSON hashes match their manifest.
The four inspected legacy JS source files have no tracked local edits. These
checks establish provenance bounds, not exhaustive history or product acceptance.

Implementation remains paused for review of the corrected basis. No runtime changed
in this audit. Current Data namespace, initialization, provider startup and detailed
legacy deviations remain unsettled; do not promote proposal tables into requirements.
Existing symbolic-attribute issue remains valid public-API evidence. No additional
Bag/Builder defect or upstream edit is inferred. Next review the Data model with
the owner using current intent and API contracts, not PoC manual assertions.

<a id="gc-070-255"></a>
## 255 · Explicit owner confirmation rule — 2026-09-24

Owner explicitly requires confirmation of every decision and clarifies that an
examples-only assignment cannot reopen the frozen 0.1.0 framework. Constitution
11.43 and repository instructions record this rule, its evidence requirement and
one-question-at-a-time review. Agent-written claims of approval are not independent
owner evidence. Existing explicit instructions do not need repeated confirmation.

The rule is owner-approved and recorded in both documentation views. No runtime
change or acceptance of disputed runner/core choices follows. Remaining work:
review their attribution against original owner confirmations, report unsupported
choices and discuss unresolved decisions individually before affected implementation.

<a id="gc-070-260"></a>
## 260 · Frozen-core reopening provenance check — 2026-09-24

Owner explicitly requested verifying when the frozen core was reopened. Inspected
original user/assistant messages and tool records in task `01a0cd3b-1cfb-7c82-9cbd-22bd0dc63fa3`
("Revisiona release 0.1.0"), local rollout dated 2026-09-23T09-46-38. Times below
are Europe/Rome (UTC+02:00), all on 2026-09-24; line numbers identify JSONL records.
These findings establish provenance, not new owner decisions or implementation scope.

- 06:11:49, user record 654: "procedi" answers the explicit request at record 644
  to close 0.1.0 and distribute GitHub archives. The assistant reports publication
  at 06:31:40 (1065), with the future 0.2.0 scope still undefined.
- 08:34:34, user record 2528: "procedi a sistemare" follows agreement on runner
  layout, example tabs, explanations and iframes (2498–2521). Those messages do
  not explicitly approve moving tab behavior into the framework.
- 08:38:42, assistant tool record 2579 writes amendment 11.23, including the
  assignment to Gramlot's reusable browser layer. No intervening owner confirmation
  of that architectural assignment appears in the inspected exchange. Treat that
  assignment's owner attribution as unsubstantiated, not as authorization proved
  by the amendment itself. This identifies a concrete scope expansion during
  runner work; it is not a claim to have timed every earlier source change.
- 15:16:24, user record 6948 explicitly requests opening develop for 0.2.0 binding
  work and introducing the Data Bag concept. This is a new development scope,
  not retroactive approval of the morning's core-component additions.
- 16:06:31, user record 7414 requests recovering PoC evidence and deciding how to
  introduce binding cleanly; 17:11:55, user record 7960 explicitly requests the
  detailed plan and Sol implementation of the necessary work.

Separate JSR migration/publication requests are present (including records 5128,
6130 and 6212); they are not evidence of explicit approval for the earlier runner
architecture. No blanket reopening of frozen 0.1.0 for new runner components was
found in this task. This is a bounded conversation audit, not an exhaustive search
of every owner conversation. No runtime changed. Further remediation decisions
remain subject to explicit owner confirmation, one at a time.

<a id="gc-070-265"></a>
## 265 · Runner behavior removed from core; Minimal startup relocation pending — 2026-09-24

Owner explicitly directs removing runner-specific core additions and retaining the
provisional behavior inside the runner where possible, pending future web components.
Owner then confirms ordinary HTML IDs as the way to connect local events. Amendment
11.44 records that bounded scope and page-local exception; no future component API
is approved here.

Implemented: core no longer imports or mounts tabs, splitters, Markdown/highlighting
or runner theme synchronization. Their dependencies and browser behavior now belong
to `examples/00-runner`; HTML IDs connect page-local events, Bag state and Source
updates. Existing renderer disposal releases listeners and pointer capture. Runner
launch wrappers append its frame-theme script without changing the teaching pages.
Core JSR packaging excludes the provisional runner; no registry artifact is changed.

Verified: Python 17/17; core JS 83/83, including two isolation tests; runner 8/8.
The previous 16 core marker/component tests are replaced by local behavior checks,
not retained as an approved framework API. Core bundles contain none of marked,
highlight.js or DOMPurify. Chromium 154 passes 24 Python/JS page parity checks,
both HTTP runners (IDs, tabs, retained iframe input, themes, splitter, keyboard and
reattachment), and the live playground's Source updates/timer cleanup in both hosts.
A direct-file offline export passes 12 Worker pages and runner interactions.
Strict Sphinx and public documentation checks pass. Runner dependencies were
installed using the documented --install-links mode to share one Gramlot identity;
no sibling repository source was changed.

The final frozen-release comparison found additional standalone-related core changes:
WorkerHost accepts nonempty Page.css; standalone mount loads/disposes styles and
resolves assetRoot; it exposes the app before startup. These remain present, and
the passing offline verification relies on them. The owner subsequently assigns
these responsibilities to gramlot-minimal, explicitly correcting the proposed
runner destination (amendment 11.45). Read-only inspection confirms that Minimal
currently imports core standalone mount and cannot independently orchestrate startup
through the existing package exports: WorkerTransport is internal. Proposal pending
owner confirmation: export that existing class without changing its behavior so
Minimal can use the core transport. No runtime or adapter changes were made for
this relocation yet. HTTP runner isolation is implemented and verified; complete
frozen-core restoration is not claimed. No release, publication or acceptance is
implied.


<a id="gc-070-270"></a>
## 270 · Standalone integration transferred to Minimal — 2026-09-24

Owner explicitly directs standalone-only WorkerTransport into the standalone host,
then requests implementation. Amendment 11.46 supersedes the pending export proposal
in 11.45 and the pending boundary in section 265. Read-only consumer search found
only standalone mount and its tests using WorkerTransport.

Implemented: Minimal owns WorkerTransport, WorkerHost and mount, including existing
CSS, export-root and pre-start app handling. Its single-file and directory exporters
use these local modules. Core retains shared Host/Page and rendering, exposing the
existing neutral Host via browser-safe /host. Former development core standalone
exports and bundled standalone resource are removed without compatibility aliases.
Tests move with the integration; Minimal's bundle notices include its own license.
Published artifacts remain unchanged; consumers need the matching development pair.

Verified: core JS 76/76, core Python 17/17, Minimal JS 13/13 and runner 8/8 pass.
Chromium 154 passes the twelve-page offline runner check plus the thirteenth live
playground (Source updates, SVG animation and timer cleanup). A separate real Worker
check passes main/remote Source, live mutations, disposal and pending-request cleanup
without HTTP. Strict Sphinx and public documentation checks pass. Offline artifact:
build/minimal-transfer-verified. Initial offline results using stale npm file copies
were discarded; both installed development packages were reinstalled and the final
checks above use their new ownership and exports. The published releases remain
unchanged; no release, publication or owner acceptance is implied.


<a id="gc-070-275"></a>
## 275 · Report items 2 and 3: current-state documentation corrected — 2026-09-24

Owner confirms the proposed documentary correction for report items 2 and 3.
Sections 005/015/020 now distinguish accepted GitHub archives, the separate JSR
publication receipt, authorized but incomplete/paused binding development, and
verified runner/Minimal remediation. Section 010 is explicitly historical.
GC-025 names the GitHub archive delivery scope and separately identifies JSR;
both document pairs preserve existing block IDs and dated evidence.

Sources: publication receipt §195; binding request constitution 11.41 and boundary
clarification 11.42; partial implementation §245; current pause GC-165/GC-170;
runner/Minimal verification §270. No new runtime or release claim is introduced.
Other report items, including artifact provenance and installation/package naming,
remain outside this approved correction. Strict Sphinx and public documentation
checks pass; paired block anchors are preserved. No runtime tests were needed for
this documentation-only correction.


<a id="gc-070-280"></a>
## 280 · Report item 16: npm lockfile policy restored — 2026-09-24

Owner confirms restoring package-lock=false in the core JS npm configuration,
consistent with the existing first-party dependency rule. The examples already
have this setting. Verified with npm config get package-lock in each directory:
both report false. Neither project has a package-lock.json or npm-shrinkwrap.json
at its root. No dependency installation or runtime change was needed. Other report
items remain separate pending decisions.


<a id="gc-070-285"></a>
## 285 · Report B1: validate signature objects before inspecting them — 2026-09-24

Owner confirms the B1 fix. Signature loading now checks each parameter with the
existing object validator before computing variadic flags or the component root.
Invalid non-object parameters raise ValueError with the indexed parameter path,
rather than AttributeError. No parameter coercion or alternate representation is
introduced. The later validation loop reuses the already checked objects.

Regression evidence: eight subcases (number, null, string and array; ordinary and
component signatures) reproduced AttributeError before the fix and pass afterward.
They also check that a failed load leaves existing HTML usable and does not register
the invalid collection. The complete Python suite passes 18/18.

Separate follow-up found while testing: updating an already loaded collection reads
incoming parameter names in _collection._merge before object validation; malformed
parameters produce TypeError there. This is a distinct earlier merge path, not the
B1 signature-loader path. Evidence was observed using load_collection on an existing
controls test fixture, not in a current application. Owner subsequently clarifies
that current use includes only the base collections, with no new collections.
Defer this synthetic malformed-update case; no implementation is planned now.
The approved and verified B1 signature-loader fix remains in place.


<a id="gc-070-290"></a>
## 290 · Report B4: transport errors identify the operation — 2026-09-24

Owner confirms correcting the HTTP transport failure message. MainTransport.main
and .source now explicitly pass their operation to the shared request helper;
non-successful HTTP responses report main failed or source failed respectively,
retaining the HTTP status. Network payloads and routes are unchanged.

The existing transport test asserts both exact error messages for HTTP 403.
Complete core JS suite passes 76/76; browser runtime build passes. Other report
items remain pending separate decisions. The malformed collection-update case
in section 285 remains deferred as directed by the owner.


<a id="gc-070-295"></a>
## 295 · Report item 14: current example count corrected — 2026-09-24

Owner confirms updating current descriptions to thirteen examples while preserving
historical counts. The examples entry README, GC-025 runner ZIP description and
GC-145 progression now agree with catalog.json. GC-145 includes 13_live_source,
its amendment 11.39 provenance and the later checks in section 270; the initial
plan and execution evidence are explicitly historical. Original twelve-example
receipts and limited browser-check counts are unchanged.

Verified: all thirteen catalog entries have page.py, page.js and README.md;
strict Sphinx and public documentation checks pass. No runtime changes. Remaining
report findings require their own confirmed scope.


<a id="gc-070-300"></a>
## 300 · Report item 12: public and local package names distinguished — 2026-09-24

Owner confirms clarifying the public guide's package names. GC-090 section 022
identifies @genro/gramlot for JSR via jsr add and @gramlot/native-html for the local
file dependency; the published Page import and packaged runtime reference now use
the public name. The following Minimal standalone examples are explicitly local
development examples requiring the matching core/Minimal pair. Original archives
retain their own manifest/README and are not presented as the new development pair.

Verified against jsr.json, js/package.json, examples/package.json and JSR's official
npm compatibility documentation. No fresh registry artifact installation is claimed.
Strict Sphinx and public documentation checks pass; paired anchors agree. No source,
package manifest, alias or published artifact changed for this correction.


<a id="gc-070-305"></a>
## 305 · Report item 13: current repository names clarified — 2026-09-24

Owner confirms verifying and correcting current repository names while preserving
historical and planned names. README and GC-025 use gramlot-js-server; the offline
showcase links target gramlot-minimal. Overview and constitution distinguish the
approved gramlot-kajenn destination from the inspected gramlot-genro-asgi checkout
and configured origin. Section 14 explains historical names without rewriting the
dated decisions. Historical archive commands and the 2026-09-17 visibility record
in AGENTS remain unchanged.

Evidence: GitHub API confirms gramlot-org/gramlot-js-server and gramlot-minimal,
both defaulting to main, and returns 200 for Minimal's examples/showcase on main.
Local remotes match these two names. Unauthenticated API requests for both Kajenn
names return 404; this does not prove absence or confirm a rename. Remote Kajenn
availability/rename remains unverified. No repository or remote configuration was
renamed. Strict Sphinx and public documentation checks pass; paired block anchors
are preserved. Remote Kajenn verification is the remaining limitation for this item.


<a id="gc-070-310"></a>
## 310 · Report item 15: completed release plan clarified — 2026-09-24

Owner requests verification, then explicitly confirms correcting only GC-110's
summary and final phase status. Original conversation evidence: task
01a0cd3b-1cfb-7c82-9cbd-22bd0dc63fa3, assistant proposal at session record 644
asks to close 0.1.0 using GitHub archives; user record 654 replies “procedi” on
2026-09-24 at 04:11:49 UTC. GC-135 sections 035/040 record authorization and delivery.

GC-110 now identifies itself as the completed GitHub release plan and phase 6 links
to that evidence. Dated checkpoints retain their historical scope. PORT-0001,
PORT-0002 and PORT-0004 already distinguish bounded release acceptance from old
port states; PORT-0003 includes recipes excluded from the release. No blanket port
acceptance was found or inferred, and no port status was changed. Pending port
statuses are not automatically converted to accepted. Strict Sphinx and public
documentation checks pass; paired anchors are preserved.


<a id="gc-070-315"></a>
## 315 · Report item 6: misleading Builder compatibility comments corrected — 2026-09-24

Owner confirms a comments-only correction. GramlotBuilder now describes SOURCE
registration as Gramlot's typed transport responsibility under amendment 11.16,
and required-parameter validation as enforcement of the loaded grammar. References
to older Builder releases are removed; no compatibility branch or implementation
change is introduced. The original duplication/ownership violation claim remains
withdrawn, not converted into a source-removal task. Other observations about
private dependency APIs are outside this correction.

*Superseded 2026-09-28 (constitution 11.48 item 8, [GC-070 §520](070-work-status.md#gc-070-520)): the `SOURCE` suffix is gone. A Bag of any class travels as `::X` and `__cls` names its class. The text above is the record of 2026-09-24.*

Verified that the Python AST, excluding docstrings, is identical before and after.
No runtime tests were needed for this comments/docstring-only edit.


<a id="gc-070-320"></a>
## 320 · Report item 5: environment verification only — 2026-09-24

Owner confirms read-only verification, not dependency replacement. The exact
GC-085 check commands pass Python 18/18 and JS 76/76 when GRAMLOT_TEST_PYTHON
selects the absolute repository venv interpreter. Default python3 is the pyenv
3.12.9 interpreter and cannot import gramlot; this does not invalidate the documented
explicit-interpreter command. The prior pytest/relative-path allegations remain
withdrawn.

Observed environment: editable Gramlot 0.1.0; Python Builder 0.23.4 installed from
/private/tmp/builder-template-artifacts/genro_builders-0.23.4-py3-none-any.whl (still
present); Bag 0.25.1 installed from /private/tmp/gc088-artifacts/genro_bag-0.25.1-py3-none-any.whl
(now absent); TYTX 0.15.0 has no direct_url metadata. GC-085 instead describes
published Builder 0.23.2 and GitHub Builder JS 0.1.3. Actual JS dependencies are
JSR Bag 0.5.3, Builder 0.1.5 and TYTX 0.15.1. npm also reports old decoration
packages as extraneous in core node_modules; they are not declared core dependencies.

Current local success is not clean-install reproducibility evidence. GC-085 also
retains outdated release/standalone ownership descriptions. No packages, environment
or guide were changed during this verification. A fresh isolated install and guide
correction remain separate proposed work; report item 5 is not closed.


<a id="gc-070-325"></a>
## 325 · Report item 5: isolated clean core installation verified — 2026-09-24

Owner confirms a new temporary environment without changing the existing one.
Copied current core source, tests and manifests to
/private/tmp/gramlot-clean-check-rxoazghw, excluding installed modules, virtual
environments, caches and generated runtime resources. This tests the current
working sources, not a historical commit or published Gramlot artifact.

Installed Python requirements with pip --isolated --no-cache-dir from PyPI in a
new venv; installed declared JS dependencies with a fresh npm cache, ignoring
install scripts and disabling package-lock. Built browser resources from the new
JS installation before running checks. No local dependency wheels or sibling
sources were supplied.

Resolved Python: Builder 0.23.2, Bag 0.25.1, TYTX 0.15.0; none has local direct_url
metadata. Resolved JS: JSR Bag 0.5.3, Builder 0.1.5, TYTX 0.15.1, plus declared
test/build dependencies, without the old extraneous decoration packages.
Verification: Python 18/18, JS 76/76 with the documented absolute
GRAMLOT_TEST_PYTHON, and runtime build pass. The local Builder 0.23.4 wheel and
missing temporary Bag wheel are not required by these tested core paths.

Logs and environment records remain in the temporary directory (pip-install.log,
npm-install.log, build.log, python-tests.log, js-tests.log, python-environment.json,
js-environment.txt). This establishes current-source core installation/test
reproducibility, not a new browser/adapter matrix or registry-artifact acceptance.
Existing venv and node_modules are unchanged. GC-085's stale JS/version/release
and ownership descriptions still need a separately confirmed documentary update.


<a id="gc-070-330"></a>
## 330 · Report item 5: operating guide aligned with verified setup — 2026-09-24

Owner confirms updating GC-085 after the isolated clean check. Both views now
record the actual PyPI/JSR setup, observed versions without pins, absolute Python
interpreter selection and 18 Python/76 JS test results. They separate this source
check from packaging, Bun, browser and adapter evidence; distinguish frozen release
from development; and place WorkerHost/WorkerTransport/startup in Minimal and
provisional UI in the runner. Existing environments remain unchanged.

Strict Sphinx and public documentation checks pass. GC-085's local targets and
explicit anchors were checked directly; paired block IDs remain unchanged.
The original clean-core-install concern is resolved within the verified source
scope. Published-artifact provenance remains a separate report item. During guide
review, the old default package path in export_collections.py was noted as a
separate tooling limitation; this helper is not needed for setup and was not changed.


<a id="gc-070-335"></a>
## 335 · Report item 7: bounded Python/JS Host comparison — 2026-09-24

Owner confirms analysis only. Executable probes use the current core Python Host
and JS FileHost, temporary page modules and decoded Source results. Results:

- Valid named parameters yield the same text (Ada). Python passes keyword arguments;
  JS passes one parameter object. Both omitted parameters and an empty object yield
  the same default text. The language calling conventions are not themselves defects.
- Explicit None is accepted as empty params in Python; explicit null raises TypeError
  in JS. This is a real input-contract difference, not a failed valid-object request.
- Missing exposed methods raise Python SourceNotFound and JS PageNotFound. Existing
  JS tests explicitly expect PageNotFound for invalid/main dispatch; changing it is
  a contract decision. Read-only adapter inspection finds both missing-method types
  mapped to HTTP 404, but no new HTTP parity test was performed.
- Two page opens execute the Python module twice (load counts 1,2); JS FileHost reuses
  its imported module (1,1). GC-065 already states ESM caching/no live reload. This
  differs from fresh Page instantiation per Source request, present in both Hosts.

The word Equivalent in GC-090's Responsibility column is ambiguous, not proof of
identical input/error/loading behavior. GC-095's keyword-argument description is
explicitly about Python; it is not a JS promise. GC-065's Host method list omits
source despite its implementation. Proposed correction: document these boundaries
and complete the method list, with no automatic runtime alignment. Pending owner
confirmation. This is the report's bounded comparison, not an exhaustive Host audit.
Probe scripts/results: /private/tmp/gramlot-host-review.py,
/private/tmp/gramlot-host-review.mjs and gramlot-host-review-{python,js}.json.
No production source, guide or dependency changed during this analysis.


<a id="gc-070-340"></a>
## 340 · Report item 7: Host differences documented without runtime alignment — 2026-09-24

Owner confirms the documentary correction following the probes in section 335.
GC-090 section 017 describes the shared execution role and the different parameter
calling conventions, explicit-null handling, missing-method errors and file-module
loading. Fresh Page/builder instances per Source request are distinguished from
module caching. The Worker loader is not equated with FileHost. GC-065 now includes
source in the Host operation list with both language signatures and a link to the
comparison. No production behavior or contract implementation changed.

Strict Sphinx and public documentation checks pass; paired block IDs and the new
comparison anchor agree. The ambiguity reported in item 7 is resolved by documenting
the verified differences, not by claiming exhaustive parity or changing error/input
semantics. Other report items remain separate.


<a id="gc-070-345"></a>
## 345 · Report item 1: published artifact provenance verified — 2026-09-24

Owner confirms verification only. Retrieved immutable JSR 0.1.0 metadata, its
20 js/src files and jsr.json, plus the GitHub release metadata, source-provenance.json
and gramlot-native-html-0.1.0.tgz. All 23 downloaded evidence files match their
registry manifest or GitHub asset SHA-256 digests. Evidence and comparison JSON
are retained under /private/tmp/gramlot-jsr-provenance.

GitHub release publication: 2026-09-24 04:29:41 UTC. Its provenance identifies
c23929a6e6ea2869e1f3395d1c1db50cecd87bcf, also the commit reached by peeling the
annotated v0.1.0 tag. All 14 JS source files in the downloaded npm archive match
that commit byte for byte. Archive digest:
7bf5418e088ca67b242780aaeff798f0ded3e150c0718fe659e31d80a1b53937.

JSR @genro/gramlot 0.1.0 publication: 2026-09-24 11:48:34.965257 UTC; manifest
contains 93 files. Of its 20 JS sources, 5 match the GitHub tag, 9 differ and 6
runner component files are absent from the tag. Against current HEAD, 5 match,
10 differ and 5 are absent. No history for jsr.json or the five additional
markdown/highlight/theme/split/message component files appears under git rev-list
--all. Thus no matching commit was found in available local refs; this is not an
exhaustive claim about inaccessible remote refs or unreachable Git objects.

Publication authorization is verified in original task
01a0cd3b-1cfb-7c82-9cbd-22bd0dc63fa3: user record 6130 requests Builder then Gramlot,
6212 asks to publish Gramlot, 6669 accepts the temporary DOMPurify choice, and 6733
confirms package creation. These messages authorize publication; they do not prove
separate approval of every included architectural change. The later agent summary
6834 explicitly left source consolidation pending.

Conclusion: GitHub and JSR share version 0.1.0 but are different deliveries.
The GitHub JS archive has verified tag provenance. JSR publication was authorized,
but artifact-to-commit traceability remains unresolved. A present-day commit of
changed source would not retroactively establish the publishing commit. No source,
release, tag or remote was changed. Public wording correction remains proposed.


<a id="gc-070-350"></a>
## 350 · Complete the deferred DOMPurify update and recover JSR evidence — 2026-09-24

Owner rejects a documentation-only disposition of item 1 and requests investigation
and repair, recalling the 17:30 dependency wait. Original user record 6669 in task
01a0cd3b-1cfb-7c82-9cbd-22bd0dc63fa3 approves temporary DOMPurify 3.4.15 and asks
for an upgrade after 17:30. npm metadata confirms 3.4.16 was published on
2026-09-23 at 15:29:57.247 UTC; the 24-hour threshold elapsed on September 24 at
17:29:57.247 Europe/Rome. Current time check was September 24 19:56 UTC. The
published JSR manifest really declares 3.4.15; its publication was not waiting
until 17:30, because the owner-approved older version allowed it to proceed.

Completed the deferred dependency update where it now belongs: examples/package.json
and the examples installation use DOMPurify 3.4.16. Core no longer declares this
runner dependency. Eight runner tests pass, including Markdown sanitization;
rebuilt build/runner-dompurify-3416 passes the 12-page offline runner check and the
13th live playground, including animation/timer cleanup. No publication or version
bump was performed; the existing JSR 0.1.0 still contains its original dependency.

Read-only git ls-remote confirms public main/develop at aa264979588176e6a4e806fc827def5dbf391b1b,
preceding JSR source consolidation; the peeled release tag remains c23929a.
Recovered all 93 JSR 0.1.0 files and verified every size/SHA-256 against the registry
manifest. Local evidence bundle: build/jsr-provenance/gramlot-jsr-0.1.0-recovered.zip,
SHA-256 7448c2d4f0beeeec2123d2aef74c23f7fceac5ff608bb5b10b37b6c091d5f104.
Adjacent metadata preserves comparisons, registry timestamps and remote refs.
This is a reconstructed published snapshot, not a discovered original publishing
commit. Recording it in Git is a separate pending decision. No README change,
history rewrite, tag movement, push or registry change was made. Item 1's historical
commit traceability is not closed by the dependency update.


<a id="gc-070-355"></a>
## 355 · Verified 0.1.1 candidate; binding stays in 0.2.0 — 2026-09-24

Owner requests “facciamo 0.1.1” and confirms “si il binding va nella 0.2.0”.
An isolated candidate based on 9d77c3f plus the current approved corrections lives
at `/Users/gporcari/.codex/worktrees/release-0-1-1/gramlot`. The original development
checkout retains the binding Source-projection/caret prerequisite and its tests.
The candidate excludes that runtime delta, the four binding baseline tests and
binding contract/upstream regression probes. Binding planning records remain
historical evidence; binding execution remains paused.

Candidate versions are 0.1.1 in Python, the local JS manifest and JSR metadata.
It contains the approved runner/Minimal ownership split, audit corrections and
runner DOMPurify 3.4.16. Its wheel build check now requires only core-owned assets;
it no longer requires the standalone runtime moved to Minimal. Matching local
Minimal and JS-server source copies were used to verify examples.

Verified on the isolated candidate:

- Python 18/18, repeated 18/18 after installing its built wheel; JavaScript 72/72.
- Runner 8/8; Chromium direct-file offline checks pass 12 examples plus the live
  playground (Source insert/delete/clear/text/SVG, animation and timer cleanup).
- Python wheel/sdist and JS archive built. Packaged JS/Python source bytes and
  hosted runtime match the candidate; core archives omit the standalone runtime.
- JSR publish dry-run passes. Strict Sphinx and public documentation checks pass.

Artifacts and SHA256SUMS are under the candidate's `build/release-candidate/0.1.1`.
These are candidate checks, not a rerun of the seven-host installed-artifact
matrix, not Safari/Firefox verification and not package publication. Minimal
remains a matching development companion, not a newly published release.
Owner confirmed consolidation. The isolated 0.1.1 source is committed as
`ba868c4ba061bfd4afceec4613b2810598ec73a4` on `codex/release-0.1.1`.
Artifacts were rebuilt from that revision; source snapshot, SHA256SUMS and
`release-receipt.json` are in the candidate artifact directory. The original
binding implementation is preserved. Publication remains pending confirmation. No original tag or published 0.1.0 artifact was changed. The proposed
new constitutional amendment was not applied after automatic approval review
rejected adding it without explicit confirmation of its text; existing approved
ownership rules continue to govern the candidate.


<a id="gc-070-360"></a>
## 360 · JSR 0.1.1 published; bundled example import defect — 2026-09-24

Owner explicitly approved JSR publication after source consolidation.
`@genro/gramlot` 0.1.1 is published at https://jsr.io/@genro/gramlot@0.1.1
from source commit `ba868c4ba061bfd4afceec4613b2810598ec73a4`.
All 74 downloaded registry files match the registry checksums. Their contents
match that candidate with the publisher's import rewrites; generated hosted
runtime bytes are unchanged. Direct imports from published core, `/page` and
`/host` pass using the existing first-party dependency-age exclusions.
The local release receipt and published manifest preserve this evidence.

Post-publication inspection found a defect missed by the successful dry-run:
the 13 bundled example `page.js` files import `./@gramlot/native-html/page`,
a nonexistent relative target produced from the local package name. The core's
Genro imports are correctly rewritten to JSR specifiers. The successful offline
runner checks used local packages and do not establish that these registry example
files execute. Published examples require correction in a subsequent release;
no such version or publication is authorized yet. Do not claim the entire published
payload is defect-free. Binding remains excluded and preserved for 0.2.0.


<a id="gc-070-365"></a>
## 365 · 0.1.2 example import correction prepared — 2026-09-24

Owner confirms preparing 0.1.2 to correct the bundled example imports found after
0.1.1 publication. The JSR import map now resolves the examples' existing
`@gramlot/native-html/page` specifier to `./js/src/adapters/page.js` in this same
package. No runtime behavior, application code or dependency source is changed.
Binding stays outside this maintenance candidate and remains reserved for 0.2.0.

New release check: run `deno run --config jsr.json --allow-read
scripts/verify_jsr_examples.mjs` before publishing. It imports all 13 shipped
examples using the actual JSR configuration, checks their shared Page identity,
builds nonempty typed Source through Host and closes every registered page.
All 13 pass. A negative run with the previous import map fails on the first example's
unresolved import, proving this check detects the original failure. The 0.1.2 JSR
publish dry-run also passes. These are pre-publication checks, not inspection of
a registry artifact that does not yet exist. After publication, download and
compare the registry files and execute the examples from that published payload.

Python, local JavaScript and JSR version metadata are 0.1.2. Candidate archives
and their source revision will be recorded in `build/release-candidate/0.1.2`.
Publication requires the owner's separate confirmation; no 0.1.2 registry upload
has been performed. The historical 0.1.1 defect remains recorded in section 360.

Prepared source revision: `47de64c67151095f14744d355b494d1f4488d49e`. Candidate archives, source snapshot and SHA256SUMS are built and checked.


<a id="gc-070-370"></a>
## 370 · JSR 0.1.2 published and registry examples verified — 2026-09-24

Owner explicitly confirmed publication. `@genro/gramlot` 0.1.2 is published at
https://jsr.io/@genro/gramlot@0.1.2 from source revision
`47de64c67151095f14744d355b494d1f4488d49e`.
Downloaded all 74 published files and verified their sizes and SHA-256 checksums.
Contents match the identified candidate after the configured publisher import
rewrites; generated hosted runtime bytes match exactly.

All 13 downloaded example modules now import `../../../js/src/adapters/page.js`.
They pass shared Page identity, nonempty typed Source generation through Host and
page cleanup without the local import map. The catalog supplies only the list of
example folders; executable example/core modules come from the downloaded registry
payload. Direct registry imports of core, `/page` and `/host` also pass.
This closes the bundled example import defect recorded for 0.1.1 in section 360.
The local 0.1.2 release receipt includes source revision, artifact hashes and the
published manifest. Binding remains outside this release, preserved for 0.2.0.
No Python registry release, Minimal package release or application deployment was
performed. The existing seven-host/Safari/Firefox verification limits still apply.


<a id="gc-070-375"></a>
## 375 · Local develop aligned with maintenance corrections — 2026-09-24

Owner confirms local develop alignment with 0.1.2 corrections and documentation,
preserving unfinished binding work for 0.2.0. The core-only wheel asset check,
Python/JS/JSR version metadata, Page import mapping and JSR example verification
script now match release source 47de64c. Runtime and binding code were not replaced.
README distinguishes runner-owned Markdown/DOMPurify and the mixed development
checkout from the published release. GC-025 and its mirror assign standalone
Worker integration/exporter to Minimal; GC-085 and its mirror document the JSR
example check and release boundary.

Verified: Python 18/18, JavaScript 76/76, JSR example imports/typed Source/cleanup
13/13, runtime build, wheel build, strict Sphinx and seven-page public docs checks.
All 52 protected source, test and binding-record files retain their pre-alignment
SHA-256 values, including the binding prerequisite and four baseline tests.
The development environment lacks the Python build frontend; the frontend in the
isolated release environment built this checkout without changing its virtualenv.
Wheel inspection exposed a stale `build/lib/gramlot/resources/standalone.js` from
an earlier build. Removed that generated file and rebuilt: the verified wheel now
contains the matching hosted runtime and no standalone asset. Build success alone
is insufficient evidence of package contents when stale build outputs exist.

The aligned 0.1.2 metadata identifies the maintenance baseline. This checkout also
contains unfinished 0.2.0 binding and is NOT the published 0.1.2 source, which
remains 47de64c. The wheel in `build/develop-alignment-check` is a verification
artifact, not a release candidate. Sections 355/365 describe the isolated release
candidate at their historical checkpoints. No commit, push, tag, new publication,
dependency refresh or port acceptance was performed in this local alignment.
Public availability of release revisions (N3) and other audit observations remain
separate open tasks.


<a id="gc-070-380"></a>
## 380 · Release source revisions publicly available; N3 closed — 2026-09-24

Owner asks to resolve the remaining source-availability issue N3. Published the
existing `codex/release-0.1.2` branch and annotated source tags to origin:

- [v0.1.1](https://github.com/gramlot-org/gramlot/tree/v0.1.1) points to
  `ba868c4ba061bfd4afceec4613b2810598ec73a4`, the published JSR 0.1.1 source.
- [v0.1.2](https://github.com/gramlot-org/gramlot/tree/v0.1.2) points to
  `47de64c67151095f14744d355b494d1f4488d49e`, the published JSR 0.1.2 source.

Remote tag targets were checked against the recorded release source commits.
The branch includes the existing publication receipts. These are public source
references for already published JSR versions, not new package publications or
GitHub release asset sets. No main/develop consolidation, binding changes or
0.1.0 tag movement was performed. N3 is closed; other audit tasks remain separate.


<a id="gc-070-385"></a>
## 385 · Confirmed audit cleanup and disputed findings — 2026-09-24

Owner authorizes corrections to confirmed findings and asks that disagreements
be reported explicitly. Added a local Core tests workflow for Python 3.12 and
Node 22 on main/develop pushes, pull requests and manual dispatch. It installs
floating dependencies, builds runtime resources before installing Python, selects
the Python executable explicitly and runs both core suites. No coverage or hosted
CI success is claimed; the workflow has not been pushed or run on GitHub.

Renamed HTML rendering `defaults` to `renderAttributes` without changing precedence.
Runner routes and folder paths now come from catalog.json, removing FOLDER_NAMES
and independent route numbering. In the grammar loader, one field set replaces
the identical allowed/required sets. Collection remains responsible for envelope
and format validation; redundant loader checks were removed, preserving declaration
validation and atomic application. No new Collection capability was introduced.

Verification: local Python 18/18, JS 76/76 and runner 8/8; all 13 paired runner
routes match catalog keys/folders and existing files. Invalid grammar formats are
still rejected and subsequent valid authoring succeeds. A fresh scratch copy with
registry dependencies also passes runtime build, Python 18/18 and JS 76/76.
Workflow YAML and shell syntax pass local checks; this is not a GitHub-hosted Linux
run. Strict Sphinx and public documentation checks pass. Binding source and tests
are preserved; html.js differs only in the reviewed local variable rename.

Findings not treated as defects: 5a describes an unsupported interpreter setup
rather than failure of the documented command; 5b correctly identifies an older
local-wheel environment but the clean install does not require it; 13's destination
name caveat is already present; 15 quotes explicitly historical port statuses and
cannot establish missing current acceptance; B5 identifies private-style members
without an applicable prohibition or demonstrated failure; B9 identifies differing
copyright years without evidence they are incorrect. No dependency environment,
port acceptance, copyright policy or Builder API was changed. No push or release
was performed in this cleanup.


<a id="gc-070-390"></a>
## 390 · Environment note made explicit in GC-085 — 2026-09-24

Follow-up review confirms the audit corrections and fresh-install test results.
GC-085 and its mirror now explicitly record the existing development venv's
Builder 0.23.4 temporary wheel, separately from the verified clean PyPI setup
with Builder 0.23.2, Bag 0.25.1 and TYTX 0.15.0. Section 320 already held the
local provenance; the operating guide now links it and records the clean evidence.
Removed the unused `root = doc` alias in the grammar loader; Python 18/18 passes.

The local Core tests workflow is still uncommitted and has not run on GitHub.
Runner tests are outside its current core-only scope. The local 76-test JS count
includes untracked binding-lifecycle-baseline and runner-isolation tests; a hosted
CI claim must identify the committed source and tests actually executed, not copy
the working-tree count. Publishing source and testing it on GitHub remain pending;
no binding implementation or release artifact changed in this follow-up.


<a id="gc-070-395"></a>
## 395 · Core and runner CI publication authorized — 2026-09-24

Owner explicitly confirms completing CI with the runner, publishing it and
verifying execution on GitHub. An isolated development integration branch,
`codex/core-runner-ci`, captures the current working sources and tests, including
the binding baseline and runner-isolation tests. This branch is development work,
not a 0.1.x release or binding acceptance. Published release tags remain unchanged.

The workflow uses Python 3.12 and Node 22, builds resources before Python install,
selects the Python interpreter for JS tests and installs the examples' declared
file dependencies from public Minimal/JS Server main checkouts. It runs the core
Python, core JS and runner unit suites. The adapter checkouts supply dependencies;
this does not verify their hosted/standalone behavior. A push on the CI integration
branch triggers the first run. Expected local counts are 18 Python, 76 core JS
and 8 runner tests; hosted execution and outcome remain pending at this checkpoint.


<a id="gc-070-400"></a>
## 400 · Published core and runner CI passes on GitHub — 2026-09-24

The owner-authorized workflow is published on `codex/core-runner-ci` and its first
[GitHub run 36058922420](https://github.com/gramlot-org/gramlot/actions/runs/36058922420)
completed successfully on source revision
`edce6cb2b8fd4bbc2ceda720bc8d3ec42b79a324`.

Verified on GitHub Ubuntu with Python 3.12 and Node 22: resource build, fresh
Python package installation, Python 18/18, JavaScript 76/76 and runner 8/8.
Python dependencies resolved from PyPI include Builder 0.23.2, Bag 0.25.1 and
TYTX 0.15.0. Both previously untracked JS test files are present in the committed
snapshot (runner-isolation inherited from the release branch, binding baseline
included in this development commit). The counts refer to actual hosted results.

Minimal and JS Server main checkouts satisfy the examples' declared dependencies;
only runner unit behavior is asserted, not host integration or standalone exports.
The workflow is available for push on main/develop and the CI integration branch,
pull requests and manual dispatch. It must be integrated into main/develop before
those branches gain this workflow; neither branch was merged in this task.
Coverage and real-browser/adapter matrix checks remain outside this workflow.

The isolated CI branch preserves the current unfinished binding work for 0.2.0;
this is not a new package release or binding acceptance. Original working-tree
binding sources remain intact; published 0.1.x source tags were not moved.
The CI publication and first hosted verification requested in section 395 are complete.


<a id="gc-070-405"></a>
## 405 · Owner-approved CI integration into develop and main — 2026-09-24

Owner confirms proceeding with integration after the successful hosted CI run.
Develop advances to the complete tested development snapshot, including its
unfinished 0.2.0 binding prerequisite and tests. Main advances from the verified
0.1.2 release source and receipts, adding the approved audit corrections and CI.
Main excludes binding runtime changes and the four binding baseline tests.
The original development files matched the tested snapshot before integration;
no uncommitted source work was discarded. Published release tags remain unchanged.

Both branches contain the Core and runner tests workflow and all tests appropriate
to their source. Expected counts are Python 18, JS 76 and runner 8 on develop;
Python 18, JS 72 and runner 8 on main. Fresh GitHub executions for these integrated
branches remain pending at this checkpoint; the earlier successful run in section
400 verifies the CI integration snapshot only. No package publication or binding
acceptance is implied by integrating the workflow. Historical checkpoint statements
about pending integration are superseded by this entry.


<a id="gc-070-410"></a>
## 410 · Integrated main/develop CI verified on GitHub — 2026-09-24

All four post-integration GitHub runs succeeded:

| Branch and tested revision | Core/runner tests | Documentation |
| --- | --- | --- |
| main `76321ac969062f4bb8fd89cbb58072596a5dca2f` | [36059477892](https://github.com/gramlot-org/gramlot/actions/runs/36059477892): Python 18/18, JS 72/72, runner 8/8 | [36059477783](https://github.com/gramlot-org/gramlot/actions/runs/36059477783): passed |
| develop `361dcca571fd00737eb28cd0640f2ea535680ae9` | [36059479696](https://github.com/gramlot-org/gramlot/actions/runs/36059479696): Python 18/18, JS 76/76, runner 8/8 | [36059479702](https://github.com/gramlot-org/gramlot/actions/runs/36059479702): passed |

Core and runner CI is now present and verified on both branches. The four-test JS
difference is the explicit unfinished binding baseline retained on develop for
0.2.0; main contains the maintenance runtime without those binding changes.
Both run the runner-isolation checks and eight runner unit tests. Runtime source
comparison confirms the intended binding boundary. Documentation builds and public
link/boundary checks also passed on GitHub for each tested revision.

This completes the authorized integration and branch-specific verification.
No package was republished and no release tag moved. Browser/host integration and
coverage collection remain outside the bounded CI suites. This result receipt is
a documentation-only follow-up to the exact verified revisions listed above.


<a id="gc-070-415"></a>
## 415 · Binding-focused continuation handoff prepared — 2026-09-24

Owner requests a complete handoff focused on binding. [GC-175](175-binding-handoff.md)
and its concise counterpart collect the current source baseline, binding-versus-
maintenance boundary, approved direction, unresolved decisions, code map, diagnostic
results, commands, hosted evidence and next-step review sequence. The binding
planning documents and PORT-0005 now link that checkpoint without rewriting their
historical investigations. This is documentation, not authorization to resume
paused implementation or adopt a Data/initialization/provider contract.

Reverified for the handoff: binding prerequisite 4/4; current-nonreactivity 1/1
(the passing diagnostic confirms missing Data-to-DOM reactivity); dependency probes
1 match/6 gaps; symbolic attribute regression 0/3 and quiet-write comparison 1/2.
These diagnostic failures are expected observations outside the passing npm suite,
not six newly established upstream defects. Builder issue #1 remains OPEN when
checked on GitHub. No runtime/dependency source was changed by this handoff.


<a id="gc-070-420"></a>
## 420 · Builder-owned Data rechecked against Python and JS — 2026-09-24

Owner clarification in the current conversation: "il nostro punti di partenza è
il builder python da cui abbiamo ricavato il builder js ... non dal poc".
The owner also states that the multi-builder application model was discarded.
The PoC handler's remaining segmentation is not the design basis.

Read-only inspection of the installed genro_builders Python base/source and
@jsr/genro__builders JS base/source confirms that each document builder creates
its own Data Bag; SourceNode.data returns that same Bag. Dialect sub-builders
receive the host builder's identical Data Bag. Absolute paths have no automatic
builder-name prefix; relative paths use Source datapath ancestry. Both Gramlot
subclasses inherit this ownership. Gramlot's browser constructor separately adds
an empty main child to the shared app.data/builder.data Bag; the Builder bases do
not require that child.

Verification: six executable assertions passed in Python and six in JS using
Gramlot subclasses with a non-main builder name: node/Builder Bag identity,
unchanged absolute path, relative path composition, GET, SET and absence of an
automatically created builder-name segment. Sub-builder sharing was inspected
in source, not exercised by these probes. No dependency or runtime edits made.
This corrects the investigation basis; it does not establish reactive binding,
initial delivery or approval to remove Gramlot's main child. Next review should
start from these actual Builder contracts. Binding implementation remains paused.


<a id="gc-070-425"></a>
## 425 · Stable Data subscription root confirmed — 2026-09-24

Owner confirmation in the current conversation: "si devi gestirein analogia a
source", following the clarification that the outer Data/Source container keeps
the subscription active. Approved scope: Data must have a stable outer container
for observation, analogous to Source, so replacement of the contained document
Data does not replace the subscription owner. This is not multi-builder Data
segmentation. Python/JS Builder document-relative addressing remains the basis.

Observed source: legacy GenroClient places _data under _dataroot.main and subscribes
to _dataroot; legacy GnrSrcHandler subscribes to its stable _main Source root.
Current Gramlot subscribes its renderer to app.source and inserts the received
Source under main. Its app.data currently equals builder.data and contains an
empty main child; it does not yet install a Data binding subscription.

Recorded and accepted: stable outer Data subscription ownership as above.
Not implemented by this checkpoint: Data root restructuring, reactive dispatch
or replacement lifecycle. The public app.data versus builder.data relationship
must be stated explicitly before changing it; the confirmed analogy does not
select that API shape. Next decision: whether app.data continues exposing the
Builder's document Data while an internal root owns the main node/subscriptions.
No new runtime or dependency changes, and no new runtime checks in this checkpoint.


<a id="gc-070-430"></a>
## 430 · Gramlot owns the Data subscription and routing — 2026-09-25

Owner decision in the current conversation: "a questo punto dire che se ne
occupa gramlot ?", followed by "ok deciso" after the explicit responsibility
summary. Confirmed scope: Gramlot owns the subscription on the stable outer Data
root and routes events to the interested SourceNodes. The Builder retains access
to the document Data Bag and value/path resolution; each SourceNode retains its
specific reaction. This follows the inspected legacy split: GenroClient subscribes
to _dataroot, its Source handler identifies recipients, and SourceNodes react.
The starting contract is the Python Builder and its JS derivative, not the obsolete
PoC multi-builder segmentation.

Accepted: subscription/routing ownership and the existing stable-root principle
from section 425. No new routing class, event protocol, scheduling semantics,
public root property names or initial-delivery shape is approved by this decision.
The app.data versus builder.data exposure question from section 425 remains open.
Implementation remains paused for the remaining bounded contract decisions.
This checkpoint records the decision only; no runtime changes or new runtime tests.


<a id="gc-070-435"></a>
## 435 · Document Data beneath the stable main node confirmed — 2026-09-25

Owner confirmation: "ok allora va bene", in the current conversation immediately
after the explicit clarification that the stable container is retained, its main
node contains the document Data Bag, and gramlot.data and builder.data both refer
to that inner Bag. The main container is structural and is excluded from authored
Data paths such as cliente.nome. This closes the exposure question in sections
425 and 430; it does not restore PoC per-builder segmentation. Gramlot owns the
outer-root subscription and routing as accepted in section 430. SourceNodes keep
using the shared Builder Data contract. The owner also directs continuing without
adding a Builder parent reference for now.

Accepted structure: stable outer Data root -> main node -> document Data Bag;
gramlot.data === builder.data === that document Bag. This is a recorded contract,
not a claim that the runtime has been changed. Current code still adds an empty
main child inside builder.data, and therefore needs alignment with the accepted
structure. No subscription/router implementation, initialization authoring API,
initial transport shape or replacement scheduling is established by this receipt.
Next contract review: Python/JS initial Data declarations, followed by host-neutral
delivery. No runtime changes or new runtime tests in this documentation checkpoint.


<a id="gc-070-440"></a>
## 440 · Source-authored initial Data recovered from PoC — 2026-09-25

> **2026-09-25 supersession note:** The dated `.data(path, value)` choice below is superseded by owner-confirmed
> dataSetter(destination_path, value) in constitution 11.47 and GC-210. Preserve the
> original receipt; it is not the current API.

Owner chooses initial Data declarations: "i dati vengono passati con .data
(path, valorre...", then directs "sono cose gia scritte . vedi il poc come lo
gestiva e procediamo". The review therefore recovers the existing declaration
behavior instead of inventing a Page.setup API. This does not reinstate the
obsolete PoC segmented Data model.

Read-only evidence: PoC src/gramlot/grammar/logic.py LogicDeclarations.data calls
dataSetter, creating a nonvisual Source declaration with destination, value and
user attributes. Explicit None is retained. The JS authoring facade maps the same
call to dataSetter. PoC js/dom/src/logic/runtime.js prepares fresh setters before
control defaults and rendering; it resolves destination through SourceNode,
writes the declared value and user attributes, and marks the declaration installed.
An ordinary rerender does not reapply an installed setter. Inserted branches are
prepared before their first patch. The declaration travels in Source, so this
mechanism itself needs no separate initial-Data transport envelope.

Verification: reran the two existing PoC local-logic tests selected by
'branch preparation|inserted branch': 2/2 passed. They cover explicit null before
defaults, inserted-branch initialization and preservation of edited values on
rerender. Other setter cases are source observations, not newly executed tests.

Current Python and JS Builder bases already provide dataSetter grammar/execution;
Gramlot authoring is intentionally inert and its renderer still needs nonvisual
installation handling. The generic HTML data tag/property collision must be
handled in Gramlot's authoring specialization, as the PoC facade did, without
editing dependency sources or bulk-copying that facade. No new runtime behavior
was implemented in this recovery step. Next bounded implementation is the chosen
.data declaration and its nonvisual branch initialization using the accepted
single-document Data structure; provider startup/timing remains separate review.


<a id="gc-070-445"></a>
## 445 · Legacy data arguments and PoC differences checked — 2026-09-25

> **2026-09-25 supersession note:** The observed legacy null/attribute skip below is historical; 0.2.0 R1 preserves
> existing value while applying declaration attributes. See GC-210 and constitution 11.47.

Owner requests checking the legacy parameters before proceeding. Inspected
Genropy gnrpy/gnr/web/gnrwebstruct/base.py:data (line 793), matching the older
sourcerer clone gnrwebstruct.py:data (line 872), and browser genro_src.js:moveData
(line 602). The Python signature is data(self, *args, **kwargs). Two positional
arguments supply path/value; one argument without kwargs supplies value with no
explicit path; one with kwargs supplies path and null value. No positional
arguments leaves path/value null. dict values become Bags. The emitted Source
has tag data, attribute path, and the value as child content, not as a value
attribute. Other kwargs are carried as attributes. serverpath/_serverpath are
special: server context registration and canonical serverpath in Source.

Browser moveData resolves path through SourceNode. It writes only if the Data
node is absent or the declared value is non-null. Thus explicit null does not
overwrite an existing value, unlike the inspected PoC setter. It consumes
serverpath and shared_id/shared_* for server/shared-object services; a truthy
remote routes to dataRemote rather than ordinary initialization. These are
legacy observations, not authorization to add server synchronization or services.

Seven assertions passed on the extracted original Python data method with
stubbed child/Page/Bag dependencies: argument dispatch, attributes, dict-to-Bag
construction and _serverpath handling. This is not a full legacy integration
run. Browser conditions were inspected, not browser-tested in this checkpoint.

This qualifies section 440: PoC is not an exact legacy implementation. Its
Source dataSetter destination/value shape and null-overwrite semantics must
not be silently adopted as legacy parity. Runtime implementation remains paused
on those concrete differences; no upstream or runtime edits were made.


<a id="gc-070-450"></a>
## 450 · Legacy Data browser flow traced and exercised — 2026-09-25

> **2026-09-25 supersession note:** The legacy probe and per-level stripping below are unchanged evidence. R1 fixes
> legacy null attribute loss and A2 installs the whole branch before DOM (GC-210).

Owner rejects the prior parameter-only investigation as incomplete and requests
following the legacy JS flow. The [full trace](../../ports/PORT-0005-data-binding/legacy-data-declaration-flow.md)
now follows main delivery, Source insertion/build/stripData, payload transfer,
parameter processing, Bag events, Data routing, SourceNode reactions and cleanup.
It distinguishes ordinary data from provider/resolver branches and records the
initial global Data subscription being installed after initial Source construction.

The retained read-only diagnostic executes original legacy Bag/SourceNode/handler
methods: 22 assertions passed, including payload identity/backrefs, null metadata
preservation, literal values, root merge, actual routing, origin suppression and
cleanup. DOM/RPC/topic endpoints are stubbed; startup/remote behavior is source
inspection, not end-to-end verification. An isolated remote handoff probe observes
undefined method for data(remote=...) versus the correct method for direct
 dataRemote(method=...); this is not permission to patch legacy or add a workaround.

Corrections to §440/445: ordinary data is transferred from Source, not copied;
null with an existing node skips attributes too; ^ metadata is initially raw;
legacy stripping is per build level and includes control defaults, not the PoC
all-setters-first pass. The report preserves the exact PoC differences. No binding
runtime was changed or accepted by these observations. Next review must use this
flow rather than claim PoC initialization is already legacy-equivalent.


<a id="gc-070-455"></a>
## 455 · Independent 0.2.0 release proposal — 2026-09-25

The owner requested two independent, detailed HTML5/SVG binding release proposals,
prepared separately and outside the repository. One proposal was completed first;
the second was not read before both were finished. Comparison was deferred.

The completed proposal covers scope and exclusions, approved ownership versus new
proposals, legacy compatibility, eleven execution phases, observable acceptance
cases, native control/SVG contracts, lifecycle, host/browser checks and separate
publication gates. It retains the public-API specialization/selector dependency
gate. It is a proposal, not an approved execution plan or a constitutional
amendment. Runtime is unchanged. No release-wide test run or release claim is made.

Owner refinement: native edit timing is controlled by a flag. The owner answered
"si" to the default question: omitting the flag means false, so Data updates on
committed changes rather than during typing. Owner confirmations recorded on
2026-09-25: `live` is the edit-timing flag, default false (the owner answered "si"
to both default and naming questions). After the actual legacy freeze/Data paths
were inspected, the owner answered "ok" to retaining controller and existing-element
binding reactions while freezing structural rebuilds. Removed nodes still require
immediate cleanup. An earlier broader visual-freeze proposal is superseded. Both
constitution views record the bounded extension; no runtime implementation or
release verification is claimed.


<a id="gc-070-460"></a>
## 460 · Independent binding plans frozen and exchange prepared — 2026-09-25

At the owner's request both independent plans were frozen as read-only copies with
recorded hashes, outside the repository. A written comparison, answers and open
questions were exchanged between the two plans. No runtime changed and no
synthesized plan was approved at this point.

The owner explicitly recognizes the earlier recorded decisions on page-only eval,
WorkerHost as server, named logic, bootstrap/companion, nonce and js_requires/css_requires.
The exchange treats those as owner decisions, with detailed execution contracts
still to be incorporated into the synthesis. New diagnostics: 9 Bag/Builder
assertions and 12 cross-language array assertions passed; one existing renderer
precedence test passed; the three known symbolic-selector tests still fail.

Two independent scope proposals were then prepared and compared. The comparison
separated the complete local HTML/SVG binding scope from deferred components,
stores, forms and remote Data, distinguished current convergence from historical
plan differences and isolated the remaining scope choices without approving them.
No implementation or final synthesis was started.


<a id="gc-070-465"></a>
## 465 · Closed 0.2.0 scope and second independent implementation plan — 2026-09-25

The owner declared the 0.2.0 perimeter closed, referring to section 1 and both final
updates of the common scope draft. These final decisions supersede earlier scope
proposals: full-branch data before construction, later duplicate wins,
defaults/attr_* after data, exact _userChanges filter, Boolean value-bound
checkbox/radio, visible mapped to visibility, primary nested button controller and
css_requires replacing Page.css.

A second independent implementation plan was prepared with 17 phases (files,
activities, acceptance tests, completion criteria, dependencies, difficulty),
plus residual contract/authorization gates and their blocked phases. It was frozen
read-only with a recorded hash. Phase fields, acyclic dependencies and decision
references were verified. The plan was a proposal, not an accepted synthesis.
No runtime implementation or new product test execution occurred.


<a id="gc-070-470"></a>
## 470 · Implementation-plan comparison — 2026-09-25

The two independent implementation plans were compared. The comparison
distinguishes convergence, behavioral conflicts, phase/test gaps and corrections.
One plan's historical seven-profile attribution was wrong: GC-130 lists Kajenn,
not Django; the synthesis must preserve Kajenn and identify Django qualification
separately.

The proposed synthesis combines early semantic lifetime and complete phase gates
with precise public-API/FIRE/trigger probes. Null duplicate initialization,
notifications to existing observers during branch installation, button alternatives
and deferred behavior still needed explicit resolution. No synthesis was approved,
no runtime changed and no new product tests were run.


<a id="gc-070-475"></a>
## 475 · Independent synthesis proposals — 2026-09-25

Two independent synthesis proposals were prepared from the two frozen plans and
their comparison. One has 18 fully specified phases. Named providers/native
editing are decoupled from inline compiler implementation; full integration still
requires both. Kajenn is restored and Django qualification is separately identified.
Semantic lifetime precedes registration; deferred inspector and automatic button
disable remain outside mandatory binding work. Proposed behavior resolutions were
not owner approvals. No implementation or product tests were started.


<a id="gc-070-480"></a>
## 480 · Synthesis version 2 — 2026-09-25

After comparing the syntheses, the owner requested an updated version 2. Version 2
adopts router/projection development before the installer while retaining
full-branch data-before-DOM runtime ordering and a separate inline compiler phase.
It includes explicit acceptance cases for null declarations, existing observers
during branch installation and attribute-specific visual anti-echo. Kajenn remains
in the host inventory; Django qualification is distinguished from historical
evidence. Constitution amendments and the technical decision register are
complementary. All 18 phase field sets and acyclic ordering were verified. No
scope or implementation approval is inferred; no runtime implementation or product
tests were started.


<a id="gc-070-485"></a>
## 485 · Remaining synthesis differences and recommendations — 2026-09-25

The remaining differences between the two syntheses were documented with
recommendations, acceptance examples and affected phases. The three remaining
behavioral differences are explicit null writes, automatic warnings for valid
duplicate data declarations, and implicit button-event cancellation. Shared open
contracts and editorial corrections are separate. Recommendations remained
unapproved, including explicit null overwrite and preserving native button
defaults. No implementation or product tests were started. The owner then approved
the unified plan transcribed in GC-210 (see §490).


<a id="gc-070-490"></a>
## 490 · S00: binding contract, baseline and inventories — 2026-09-25

Block ID: **GC-070-490**.

**Implemented:** documentary S00 scope only: constitution 11.47, paired GC-210,
version-series ID allocation in GC-005, canonical declaration vocabulary and
historical supersession notes. Retained pre-existing freeze decision, dated
receipts, legacy evidence/probe; excluded unrelated GC-180/185. No runtime,
existing-test assertion or dependency edits. Eight-host/read-only inventory,
positive-test migration map and end-to-end fixture design are in GC-210 §§065–075.
GC-210 is aligned with unified plan revision 3 and its later additions (§012 added).

**Verified:** initial develop HEAD cbd80deed1b097ffbe778d05cb092c8338c5a9e7 matches
the brief. Python 18/18 and ordinary JavaScript 76/76 pass before edits. Expanded
npm discovery runs 81 tests: 77 pass, 4 fail (quiet PUT emits ins; FORM/ANCHOR/target
lose ?caption). Exact versions and failures are in GC-210 §080. This is not full
binding verification. The enrollment patch is prepared separately and withheld
under the brief's red-CI gate pending owner decision; no expectations were weakened.
After documentation edits, Python 18/18 and ordinary JavaScript 76/76 pass again.
Strict Sphinx/public boundary checks pass (7 pages); 11 edited document pairs have
matching anchors and valid local links. Legacy probe and GC-180/185 byte hashes
are unchanged. Commands, grep classification and full suite output are in the
S00 final report.

**Accepted:** owner confirmed the plan's decisions/proposals on 2026-09-25 and
explicitly authorized S00. This transcription and its delivery have not yet been
accepted after review. Baseline test success is not product acceptance.

**Remaining:** review S00 amendment/contract and decide red-CI enrollment; S01 must
verify dependency hooks before dependent implementation. Q2–Q5 remain assigned to
S08/S14/S10. P20 excludes result_path from kwargs, and S06 depends on S00 only, as in
the current plan. No arbitrary resolution or dependency workaround is authorized.
No S01 or connected-repository phase starts here. One S00 commit, no push; write
the S00 final report outside the repository and stop, as requested.


<a id="gc-070-495"></a>
## 495 · Gramlot source classes replace dependency fixes — 2026-09-25

Block ID: **GC-070-495**.

**Decided:** owner decision, 2026-09-25: fixes to genro-builders and genro-bag are
forbidden for Gramlot. The earlier planned dependency fixes are withdrawn and no
longer gate any phase. Missing Builder behavior goes into `GramlotBuilderBag` and
`GramlotBuilderBagNode` in `js/src/builder/source.js`: silent PUT, FIRE marked for
the router, FIRE_AFTER with a NodeBinding-tracked timer, absDatapath with variable
datapath and symbolic ?attr. SET, GET, setRelativeData and getRelativeData remain
Builder's. P17 now uses these classes; node semantic state stays in NodeBinding for
now. Recorded in [GC-210 §018](210-binding-contract.md#gc-210-018) and constitution
11.47 item 10.

**Implemented:** documentation only. The two classes are not implemented; they are
planned for S01. No runtime, test or dependency edits.

**Remaining:** S01 proves that JS authoring, `sourceBagFromTytx`, `bindBuilder`,
insertion and `remoteSource` produce the Gramlot classes, without prototype
mutation or Builder/Bag changes. S01 measures the `Bag.fromTytx` null-attribute
loss; any solution needs owner approval. S04 and S08 no longer wait for external
releases. The two nested tests stay out of CI until GramlotBuilderBagNode provides
silent PUT and symbolic ?attr (S01). S01 still requires its own owner authorization.

<a id="gc-070-500"></a>
## 500 · Live renderer reuses Builder by inheritance — 2026-09-25

Block ID: **GC-070-500**.

**Decided:** owner decision, 2026-09-25: Gramlot reuses Builder classes by
inheritance and never re-implements them. `GramlotRenderer extends RendererBase`
becomes `GramlotHtmlRenderer extends HtmlRenderer`; new `GramlotSvgRenderer extends
SvgRenderer` serves SvgBuilder nodes and delegates `renderedItem`. The inherited
`adaptAttrs` brings the legacy style shortcuts into 0.2.0. Gramlot adds `_meta`
removal, null style drop, `data_`/`aria_`/`xmlns_` names and the legacy
`noConvertStyle` attributes. `format`/`mask`/`places` stay out of the live renderer.
New phase S03bis, between S03 and S04. Recorded in
[GC-210 §030](210-binding-contract.md#gc-210-030) and constitution 11.47 item 11.

**Implemented:** documentation only. No runtime or test edits.

**Remaining:** S03bis needs its own owner authorization, after S03. The Python
`renderer_html` and `data_role` naming stay in the static-site analysis.

<a id="gc-070-505"></a>
## 505 · Binding example family phase — 2026-09-26

Block ID: **GC-070-505**.

**Decided:** owner decision, 2026-09-26: `examples/html_svg` stays native HTML/SVG
without binding and receives only the mechanical `css` → `css_requires` migration
in S15; examples 10 and 13 stay unchanged. New phase S14bis, between S14 and S15,
adds a binding example family: some `html_svg` examples rewritten with binding, plus
the examples needed for 0.2.0 features. Example names: a generic `div` in `pane`,
the `main` tag as `html_main` held in `main_content`, never `page` for an element.
P7 is confirmed: `css_requires`/`js_requires` stay. Recorded in
[GC-210 §060](210-binding-contract.md#gc-210-060).

**Implemented:** documentation only.

**Remaining:** the family name is to be confirmed. S14bis needs its own owner
authorization, after S14.

<a id="gc-070-510"></a>
## 510 · S00 accepted; Python renderers and example families — 2026-09-26

Block ID: **GC-070-510**.

**Accepted:** the owner accepted S00 on 2026-09-26 after review: constitution 11.47,
GC-210, GC-005 ID allocation, historical notes on GC-155–175 and PORT-0005, and the
GC-210 §§065–080 inventories. The nested regressions stay out of CI until S01.

**Decided:** owner decisions, 2026-09-26:
- asymmetries between Python and JS are errors. The Python GramlotBuilder may render
  static HTML/SVG; S03bis delivers Python `GramlotHtmlRenderer`/`GramlotSvgRenderer`
  with the same naming rule as JS, `_text` as text, and a render option that adds
  `<!doctype html>` and `<html>`. A symmetry test compares Python and JS output.
  Constitution 11.47 item 11;
- S14bis produces two example families, `examples/binding` and `examples/controllers`
  ([GC-210 §060](210-binding-contract.md#gc-210-060));
- PORT-0001 records the resolved backref correction.

**Implemented:** documentation only.

**Remaining:** S01 brief and owner authorization. S03bis settles how JS offers string
rendering with Gramlot adaptAttrs.

<a id="gc-070-515"></a>
## 515 · S01 feasibility gate: Gramlot Source classes and dependency hooks — 2026-09-26

Block ID: **GC-070-515**.

**Implemented:** `js/src/builder/source.js` with `GramlotBuilderBag extends SourceBag`
(`nodeClass` returns `GramlotBuilderBagNode`) and `GramlotBuilderBagNode extends
SourceBagNode`: silent `PUT` (Bag `doTrigger=false`, reason = the node);
`FIRE_AFTER(path, value = true, delay = 10)`, which returns a cancel function to the
caller; `absDatapath` with variable datapath (absolute or symbolic pointer; empty or
null value gives a null path) and `?attr` kept on symbolic paths. `SET`, `GET`,
`setRelativeData`, `getRelativeData` and `FIRE` remain Builder's. Empty Python
counterparts in `src/gramlot/page/source.py` (`_node_class`). The two nested
regressions now reach `PUT`/`absDatapath` through the Gramlot classes, with their
assertions unchanged, and are enrolled in `npm test` and CI with the S00 patch.
New `js/tests/source-extension-contract.test.js`; extended `bag-contract.test.js` and
`tests/test_python_builder.py`. No Builder, Bag, prototype or `index.js` change.

**Verified:** before edits Python 18/18, JavaScript 76/76, expanded discovery 81 with
the 4 known failures. After: Python 24/24, JavaScript 102/102 (the 4 former failures
pass), runner 8/8. Probes: Python → TYTX → `sourceBagFromTytx`/`bindBuilder` keeps node
identity as a Map key after insertion and reference resolution; the legacy
`data(path, value)` call silently builds the HTML5 `data` element (Python drops the
second argument; JavaScript spreads the string into index attributes); the `value`
attribute keeps Bag, scalar and array in four directions, while a null `value` is not
authored; `Bag.fromTytx` drops null attributes in Python and JavaScript; `doTrigger=false`
is silent for insert/update/attributes, but autocreated intermediate nodes still emit
`ins` with reason `autocreate`; a fired write emits only when the value changes, then
resets to null silently; `setAttr` and `?attr` writes stringify the reason, value
events keep it; `root.setItem('main', builder.data)` keeps identity and backrefs, with
`main`-prefixed paths; `runtimeValues`, `pointers()` and the static-only
`_resolveLogicFunc` behave as recorded; `RendererBase.render` on data-elements throws
for an unknown `${name}` template in a script string and for a relative pointer without
a datapath. No other Data subscriber exists in Builder or Gramlot.

**Stopped at the gate (owner questions):** Builder hardcodes `new SourceBag` for the
JavaScript document root and scalar promotion (`builder-base.js:121-125, 308`) and the
Python root (`base.py:389-390`); TYTX encodes by exact constructor, the `SOURCE` suffix
belongs to `SourceBag`, and decoded branches are `SourceBag`. No path produces the
Gramlot classes without a new decision (own wire suffix, post-decode copy or
re-implemented construction). The `FIRE` router mark needs the node-to-runtime
reach that GC-087 §085 leaves open. A relative variable datapath (`'^.foo'`) has no
defined resolution (the legacy code recurses) and raises an explicit error.

**Accepted:** not yet; the delivery awaits review and owner decisions.

**Remaining:** owner decisions on the gate questions; S02/S03 start only with their
own authorization.


<a id="gc-070-520"></a>
## 520 · S01 proof 11 debt: library alignment and Gramlot Source subtype — 2026-09-28

Block ID: **GC-070-520**.

**Decided:** owner, 2026-09-28: S01 is closed without proof 11, kept as debt; S02 and
S03 may start. Wire decisions of 2026-09-26 apply: the TYTX suffix stays the type; a
Bag of any class travels as `::X`; `__cls` names the class on a branch (row attributes)
and on a root (payload), only when it differs from the inherited class; only the
payload decides the root class; symbolic names are the real class names (`Bag`,
`SourceBag`, `GramlotBuilderBag`); `SOURCE` disappears. Genro dependencies use `>=`
lower bounds (owner, 2026-09-28).

**Implemented:** dependencies on genro-tytx 0.16.0, genro-bag 0.26.0, genro-builders
0.24.0 (`pyproject.toml`, `>=`); `@jsr/genro__bag` 0.9.0, `@jsr/genro__builders` 0.2.1,
`@jsr/genro__tytx` 0.16.0 (`js/package.json`, `>=`; `jsr.json` import map with caret
ranges, because Deno 2.9.6 rejects `>=` in a `jsr:` specifier). `jsr.json`
`minimumDependencyAge.exclude` lists the exact names in both forms. Gramlot no longer
registers `SourceBag` under `SOURCE` (`src/gramlot/page/builder.py`). Python
`source.py` and JS `source.js` add `GramlotBuilderBag` to the TYTX subtype dictionary
of `X` (read, collision check, set again, as Builder does for `SourceBag`); both
builder modules load them. The proof 11 tests replace the "not Gramlot classes today"
probes; the proof 10 probe now records that `${...}` stays literal in data-element
attributes (genro-builders-js 0.2.1). The runtime bundle is regenerated.

**Verified:** before edits, old versions: Python 24/24, JavaScript 102/102, runner 8/8.
New versions before Gramlot edits: 7 JavaScript transport cases fail on the `SOURCE`
registration; the two proof 11 "today" probes and the proof 10 template probe fail
because they recorded superseded behavior. After: Python 26/26, JavaScript 106/106,
runner 8/8. A `GramlotBuilderBag` Source keeps `GramlotBuilderBag`/
`GramlotBuilderBagNode` Python → JS and JS → Python, through `sourceBagFromTytx`,
`bindBuilder`, insertion and `remoteSource`; Python and JavaScript write the same wire
for the same Source. `deno publish --dry-run` (Deno 2.9.6) succeeds with the caret
import map and the exact exclusions.

**Not closed:** GramlotBuilder authoring still creates `SourceBag`. Builder
instantiates it for the document root (Python and JS) and for JS scalar promotion,
with no documented class hook; Python branches follow the parent Bag class, JS
promotion does not. Owner decision required. The runner tests import `js/src`; the
packaged copies in `examples/node_modules` still hold the old Gramlot JS and libraries.
The authoring point is closed in [§525](#gc-070-525).

**Accepted:** not yet; the delivery awaits review.

<a id="gc-070-525"></a>
## 525 · S01 proof 11 closed: the builder declares the Source class — 2026-09-28

Block ID: **GC-070-525**.

**Decided:** owner, 2026-09-28: as in legacy `domSrcFactory`, the builder declares the
class of its Source and the Source declares the class of its nodes. genro-builders adds
`_source_class` (issue #46, PR #47). genro-builders-js adds `static _sourceClass`
(issue #5, PR #6); JS scalar promotion follows the class of the parent Bag, as in
Python. Gramlot uses the attribute by inheritance. `jsr.json` keeps the caret: Deno
rejects `>=` in a `jsr:` specifier (technical exception to the `>=` rule).

**Implemented:** genro-builders 0.25.0 (`pyproject.toml`, `>=0.25.0`);
`@jsr/genro__builders` 0.3.0 (`js/package.json`, `>=0.3.0`; `jsr.json`,
`jsr:@genro/builders@^0.3.0`). `GramlotBuilder` declares
`_source_class = GramlotBuilderBag` (`src/gramlot/page/builder.py`) and
`static _sourceClass = GramlotBuilderBag` (`js/src/builder/gramlot-builder.js`). No
Builder method is rewritten. The builder modules import the class from `source.py` and
`source.js`; the source modules do not import the builder modules. The "authoring
today" probes become the proof 11 authoring tests: `_sourceroot`, the document root,
nested branches and scalar promotion hold `GramlotBuilderBag`/`GramlotBuilderBagNode`
in Python and JS. The GramlotBuilder wire carries `__cls: "GramlotBuilderBag"` on the
payload and no `__cls` on the rows; Python and JS write the same wire for the same
authored Source. The runtime bundle is regenerated.

**Verified:** before edits: Python 26/26, JavaScript 106/106, runner 8/8. New versions
before Gramlot edits: Python 26/26; JavaScript 105/106, the "authoring today" probe
fails because JS promotion now follows the parent class. After: Python 26/26,
JavaScript 106/106, runner 8/8. `deno publish --dry-run` (Deno 2.9.6) succeeds with
the caret import map.

**Not closed:** the runner tests import `js/src`; the packaged copies in
`examples/node_modules` still hold the old Gramlot JS and libraries ([§520](#gc-070-520)).

**Accepted:** not yet; the delivery awaits review.

<a id="gc-070-530"></a>
## 530 · S00bis: plan revisions 7–10 transcribed — 2026-09-28

Block ID: **GC-070-530**.

**Decided:** owner, 2026-09-28 (R03): before S06, the decisions of unified-plan
revisions 7–10 enter the authoritative documents in a documents-only phase, S00bis.
Gate decisions of the same date: amendment number 11.48; scope includes the rules of
revisions 9 and 10 (D4, `==` arguments and template chain, D8, D9, Q7 in
`getRelativeData`/`setRelativeData`/`PUT`, static Python render of setters, Q13) and
the Q9 release facts; supersessions also of 11.47 items 8, 10 and 11.

**Implemented:** documentation only. Constitution amendment 11.48 in both views,
with "Superseded in part by 11.48" notes on 11.45, 11.46 and 11.47, whose text stays
as history. GC-210 §005 records the SHA-256 of plan revision 10 and of the current
owner-decision register; §§010, 015, 018, 045, 055, 060 and 075 are aligned with
revision 10, with superseded entries marked historical. §045 now states the minimal
Host contract and the minimal FileHost as the current contract; the `_resources`
level lookup is historical, kept as gramlot-kajenn theory. No code, test or
dependency changed.

**Verified:** `python scripts/prepare_docs.py`, `python -m sphinx -W --keep-going -n
-b html build/docs-source build/docs-site` and `python scripts/check_public_docs.py`
pass before and after the edits.

**Not closed:** residues assigned to S15 stay (historical `SOURCE` citations,
`gramlot-minimal` in older core documents, old example layout).

**Accepted:** not yet; the owner reads and approves amendment 11.48.

<a id="gc-070-535"></a>
## 535 · S06: minimal Host contract and minimal FileHost — 2026-09-28

Block ID: **GC-070-535**.

**Decided:** unified plan revision 10, §2 "Bootstrap e contratto dell'Host", §4.12,
Q10, Q12.1, C03, D8 (owner, 2026-09-28). Gate decisions of the same date: the
`html_svg` examples become file pages directly in `examples/html_svg/`
(`NN_name.py`, `.js`, `.md`, `.css`); `examples/pages/` and `examples/resources/` of
`1b5905c` are not taken; branch `kajenn-resources` is created locally on `1b5905c`
and not pushed; the executor does not edit `gramlot-uvicorn`.

**Implemented:** the neutral `Host` in Python and JavaScript takes no folder and
searches no files; `resolve_page`/`resolvePage` and `resolve_resources`/
`resolveResources` raise `PageNotFound`. `open_page(path, *, owner=None, prefix="")`/
`openPage(path, {owner, prefix})` returns `Bootstrap(page_id, html, nonce)`/
`{pageId, html, nonce}`; the prefix is added once to root-relative URLs only (links,
runtime, main, Source, close). The core applies the load order on what the host
returns: each URL once, in its last position; one JS URL with two groups raises
`InvalidResourceName` (C03). New `server/resources.py` and `adapters/resources.js`
hold `SPACES`, `InvalidResourceName`, `parse_requires`/`parseRequires` and the load
order. New `FileHost(pages_dir)` in Python and the JavaScript `FileHost(pagesDir)`
resolve the file page before the folder page, reject `*_aux` and paths leaving the
pages folder, and add `Page.css` then `foo.css` and `foo_aux.js` (group null). A name
in `css_requires`/`js_requires` raises `InvalidResourceName` ("requires need a Host
with a resource system"). `Page` gains `css_requires = ""` and `js_requires = ""`;
`css` stays (Q10). The `html_svg` examples and the runner catalogue page use
same-name files; the runner, the standalone build and the verification scripts
follow the new layout.

**Verified:** new `tests/test_page_resources.py` (15 tests) and
`js/tests/page-resources.test.js` (11 tests, Python/JS cross test of parser,
descriptors, links and load order) pass; Python 42/42, JS 119/119 and runner 8/8
pass. `git grep` of the gramlot-kajenn symbols in active code exits 1. The runner
opens `/js/e03` and `/js/e06` with no console errors; `/js/e06` links the theme and
the companion `/js/e06.css`, both served.

**Not closed:** `/py/e03` waits for the linked `gramlot-uvicorn` delivery (R02):
today it calls `Host(pages, …)`, which the neutral Host no longer accepts. The
standalone export uses the JSR 0.1.2 core, which has no companion lookup; its build
adds the same-name stylesheet to `Page.css`. The other adapters stay for S14.

**Accepted:** not yet; the phase closes after the `gramlot-uvicorn` delivery and the
owner's checks.


<a id="gc-070-540"></a>
## 540 · S03: Builder's Data root, semantic lifetime and Source event intake — 2026-09-29

Block ID: **GC-070-540**.

**Decided:** unified plan revision 11, §2 Data, §4.3, §4.4, §5.2, P4, P17, P24, R04, R07
(owner, 2026-09-29), recorded as amendment 11.49 (Builder's outer Data root). Gate
answers of the same date: `GramlotRenderer` requires the `{binding}` option;
`GramlotRenderer.mount()` and the constructor options `html` and `references` are
removed; in S03 the `ins` event and a new `SourceBag` value open one `NodeBinding` per
node of the branch, with no registrations.

**Implemented:** `Gramlot` builds, in the order of §4.3, `LogicRegistry` (root
`LogicGroup` as `gramlot.logic`), `GramlotBuilder`, `BindingRuntime`, `data`,
`binding.attach()`, `source` and the renderer with `{binding}`; the line
`this.data.setItem('main', new Bag())` is removed. New `js/src/binding/runtime.js`
(`BindingRuntime`, `NodeBinding`) and `js/src/binding/logic.js` (`LogicRegistry`,
`LogicGroup`). `BindingRuntime.attach()` subscribes once on Builder's wrapper
(`root`, read through `builder.data.parent`) and creates nothing; `handleSourceEvent`
opens and closes the `NodeBinding`s of the event matrix. `GramlotRenderer.receive`
follows §5.2: an event on a node under construction is ignored on arrival, every
other event is queued; semantic work runs for every event, also under freeze;
structural work only outside frozen branches. `remoteSource` admissibility, response
validity and cancellation use the target's `NodeBinding` (P24). `dispose` closes the
binding before the renderer. Only `GramlotBuilderBag` with `GramlotBuilderBagNode`
nodes is accepted as initial, embedded, remote or inserted Source (R07).

**Verified:** new `js/tests/binding-lifetime.test.js` (19 tests: identities, one
subscription on `_dataroot`, isolation, `NodeBinding` counter, stable roots, rebuild
versus semantic lifetime, deletion under freeze, repeated dispose, closing part of the
event matrix, FIFO ordering of reentrant mutations, R04 cases, P24 rebuild/freeze/
removal, R07 rejections); the renderer tests moved to `new Gramlot({element,
transport: false})`. Python 54 OK, JS 150/150, runner 8/8.

**Accepted:** not yet; the phase waits for the owner's checks at the gate.

<a id="gc-070-545"></a>
## 545 · S03bis: renderers by inheritance from Builder, Python and JS — 2026-09-29

Block ID: **GC-070-545**.

**Decided:** unified plan §3.3 (P6), S03bis, §1 rule 10; class chain of the owner
(2026-09-28); gate decisions of 2026-09-29 in the phase notes: Builder's Python/JS
string differences normalized by Gramlot's classes (empty SVG element `<rect … />`,
`foreignObject` in the SVG namespace with an XHTML child, null values not written,
`format`/`places`/`locale`/`dtype` do not format the text and `mask` follows the
legacy rule), noConvertStyle taken out in `_handleMeta` and put back after the
adaptation, the prefix `html_` literal and `gramlot_` an error, `_text` as node text,
the `doctype` render option.

**Implemented:** JS `GramlotHtmlRenderer extends HtmlRenderer` (string) and
`GramlotRenderer extends GramlotHtmlRenderer` (live DOM); `GramlotSvgRenderer extends
SvgRenderer`, one instance per SVG builder owned by the HTML renderer, delegating its
output to the live renderer. Python `GramlotHtmlRenderer(HtmlRenderer)` and
`GramlotSvgRenderer(SvgRenderer)` with the same rules; `GramlotBuilder.renderer_html`
returns `GramlotHtmlRenderer` in both languages. The attribute functions shared by the
renderers are in `renderer/attributes.js` and `renderer/attributes.py`. `html.js` no
longer renames attributes or applies `svgAttributes`. The Python and JS hosts build
their document with `GramlotBuilder` and `render(doctype=True)`.

**Verified:** new `js/tests/style-shortcuts.test.js` (6 tests, including the symmetry
test: the same Sources rendered by Python and JS give identical strings) and
`tests/test_renderers.py` (12 tests). Python 66 OK, JS 156/156, runner 8/8.

**Accepted:** not yet; the phase waits for the owner's checks at the gate.

<a id="gc-070-550"></a>
## 550 · S04: Data router and projection — 2026-09-29

Block ID: **GC-070-550**.

**Decided:** unified plan §2 (variable and relative variable datapath, symbolic paths,
null path Q7, `_path` suffix), §3.3 (P6, `visible`, `mask`), §4.4, §4.5, §4.11bis,
P1, R05, R06, R14, R15, R16; gate decisions of 2026-09-29 in the phase notes: `visible`
false → `style.visibility = 'hidden'`, null → the current `style` back; a `#…` datapath,
written or read from Data, is symbolic; a duplicate `node_id` in a received Source is an
error; `getDomNode`/`getBaseSourceNode` give null for a node no longer in the Source,
also under freeze; the `datapath` pointer is read in the parent's context; the Python
static render is out of this phase.

**Implemented:** new `js/src/binding/router.js` (`DataRouter`, `DataRegistration`,
`DataChange`): trie by segment, levels `node`/`container`/`child`, `?attr`
registrations with ancestor replacement (R14), one delivery per registration (R15),
`autocreate` ignored, fired events not delivered at level `child`, candidates copied
before delivery. `BindingRuntime` creates the router, feeds it from the one Data
subscription, owns the `node_id → node` map (R06) and runs `rebindBranch`;
`NodeBinding` registers the `^` pointers of `pointers()` when a branch opens, rebinds on
Source changes and on its variable datapath, and projects through
`renderer.project(node, change)`. `GramlotRenderer.project` replaces the update block;
`getDomNode` and `getBaseSourceNode` on the renderer and on `Gramlot`. `GramlotBuilderBagNode`:
relative variable datapath read in the parent's context, symbolic datapath, Q7 in
`getRelativeData`/`setRelativeData`/`PUT` and in `runtimeToEvaluate`, `_path`
attributes never registered. `GramlotBuilder.nodeById` reads the runtime map.

**Verified:** new `js/tests/binding-router.test.js` (13 tests) and
`js/tests/binding-projection.test.js` (26 tests). Python 66 OK, JS 195/195, runner 8/8.

**Accepted:** not yet; the phase waits for the owner's checks at the gate.

<a id="gc-070-555"></a>
## 555 · S05: installation of `dataSetter` and defaults — 2026-09-29

Block ID: **GC-070-555**.

**Decided:** unified plan §2 (A2, R1, R17, D1a, `attr_*`, literal `dataSetter`, Q7),
P2, P3, P5, P8, P15, P25, §4.6, §5.1 steps 2-4; gate decisions of 2026-09-29 in the phase
notes: a setter value replaces the attributes of an existing Data node when the setter
declares attributes and keeps them when it declares none; a `dataSetter` inside `svg` is
an error before any write; defaults after all setters of the branch, node by node,
`default_value` before `default`, `attr_*` after the node's defaults; metadata, binding
attributes and `_` keys never reach the Data node; an installation error closes the new
NodeBindings without a Data rollback; stamp `installed`, no reinstallation at rebuild or
thaw; only a Bag payload leaves the Source node. `dtype` conversion of textual defaults
stays out of this phase.

**Implemented:** new `js/src/binding/installation.js` (`DataInstaller`: `install`,
`setterNodes`, `applySetter`, `applyDefaults`). `BindingRuntime` creates the installer
and runs it inside `handleSourceEvent`, for `ins` and for a new branch value, after the
`node_id` map is published and before the registrations; on an error it closes the
NodeBindings opened for the branch. `NodeBinding.hasStamp`/`stamp`. `GramlotBuilderBagNode.pathAttribute`
gives a `destination_path` written as a pointer as a bare path, with the one `_path` warning.

**Verified:** new `js/tests/data-installation.test.js` (22 tests) and
`js/tests/binding-defaults.test.js` (15 tests), fixtures in `tests/test_binding_authoring.py`
and `js/tests/transport-interop.test.js`. Python 67 OK, JS 233/233, runner 8/8.

**Accepted:** not yet; the phase waits for the owner's checks at the gate.

## 560 · S07: browser bootstrap and named logic — 2026-09-29

Block ID: **GC-070-560**.

**Decided:** unified plan P20, P21, §4.3, §4.9, §4.12, Q12.2, D8, D9, C02; gate decisions
of 2026-09-29 in the phase notes: both hosts write the same compact bootstrap JSON; the
bootstrap listens to `pagehide` during the imports and, when the page closes before
`start()`, creates no `Gramlot` and sends the close beacon; a failed import or a failed
Logic check rejects naming the resource, keeps the CSS links and closes the server page;
`LogicRegistry.resolve` returns `{group, method}`; the §4.9 rules also refuse accessors,
symbol keys, a `Logic` that extends a class and the group names `page` and
`constructor`; the CSP criterion is a static check of the source graph and of the
runtime bundle (the real browser CSP belongs to S14); the `inline.js` import-graph test
moves to S09.

**Implemented:** new `js/src/bootstrap.js` (`PageBootstrap`: CSS links, all JS imports
awaited with relative URLs resolved against the document, check 2bis, `new Gramlot`,
registration in received order, `window.gramlot`, `start()`), exported by
`js/src/index.js` and so by the runtime bundle. `js/src/binding/logic.js`:
`LogicRegistry.check`, `register`, `resolve`, groups nested by `/`. `host.py` and
`adapters/host.js` no longer write `<link>`s: the script is
`import {PageBootstrap} from <runtime>; await new PageBootstrap({config, resources}).run()`,
with the mount prefix once on the root-relative CSS and JS URLs.

**Verified:** new `js/tests/named-logic.test.js` (10 tests) and `js/tests/bootstrap.test.js`
(9 tests, real imports in jsdom; a Source written in Python resolves every `func` through
the real bootstrap); fixtures in `js/tests/fixtures/logic/`; the bootstrap tests of
`host.test.js`, `page-resources.test.js` (with a Python/JS test of the same bootstrap
HTML), `test_page_resources.py`, `test_source_host.py` and `test_python_builder.py`
follow the new script. Python 68 OK, JS 254/254, runner 8/8.

**Accepted:** not yet; the phase waits for the owner's checks at the gate.

## 565 · S08: providers and timers — 2026-09-29

Block ID: **GC-070-565**.

**Decided:** unified plan P12, P20, P22, D7, B7, §4.7, §4.8, §5.1, Q2, Q8, Q9, R13, R15;
gate decisions of 2026-09-29 in the phase notes: `_onBuilt` after the build of the branch
that contains it (at thaw under freeze), `_onStart` when the page becomes `started` or
right after `_onBuilt` for a branch inserted later; the `FIRE` override fires with an
equal value, writes `true` for null and resets to null in a `finally`; `_userChanges`
filters only Data triggers; provider attributes on any other node are an error at
installation; a formula on a null `result_path` raises at every invocation; an inline
body registers and raises when invoked; the builders constraints stay `^0.4.0`, genro-bag
rises to `>=0.27.0`.

**Implemented:** new `js/src/binding/providers.js` (`Provider`, `FormulaProvider`,
`ControllerProvider`: `^` registrations, `_delay` debounce, `_timing` interval,
`_userChanges`, kwargs of P20 with `_node`, `_triggerpars`, `_reason`, named bodies
through `LogicRegistry.resolve`). `NodeBinding` creates the provider at §5.1 step 4 and
re-registers it at every rebinding; `BindingRuntime` runs `_init` (step 5), and
`branchBuilt`/`pageStarted` run `_onBuilt` and `_onStart` (steps 7-8), called by the
renderer and by `Gramlot`. `GramlotBuilderBagNode.FIRE` (Q8, D4, P12, R10) and
`FIRE_AFTER` tracked on the node's `NodeBinding`; `FIRE` on `?attr` fires the attribute and
keeps the node value, as legacy `fireEvent`. The renderer builds no node brought by a
Source event still in the queue and no node already built with its ancestor (P4).
`pyproject.toml` requires `genro-bag>=0.27.0`.

**Verified:** new `js/tests/binding-writes.test.js` (13 tests), `binding-providers.test.js`
(26 tests, with the S05 cases P5 and P4, and the S07 case: a Python Source calls named
logic through the real bootstrap; the companion is registered before the first `_init`;
opening the page on the JS and Python hosts runs no logic) and `binding-timing.test.js`
(12 tests, `node:test` virtual clock); new fixtures `avvio.py`, `avvio.js`, `avvio_aux.js`.
Tests that pinned the pre-S08 state changed in `binding-authoring.test.js`,
`binding-projection.test.js` and `data-installation.test.js`. Python 68 OK, JS 305/305,
runner 8/8.

**Accepted:** not yet; the phase waits for the owner's checks at the gate.

## 570 · S09: inline in the page only, and the macro preprocessor — 2026-09-29

Block ID: **GC-070-570**.

**Decided:** unified plan §2 (inline only in the page runtime, compatibility macro
preprocessor, deprecated), §4.10, Q11.1, Q11.2, D5, D6; gate decisions of 2026-09-29 in
the phase notes: `inline.js` is the only file exempted from the CSP scan, and a page with
named logic only never calls the compiler; `inline.js` is not reachable from
`adapters/*` and `builder/gramlot-builder.js`; inline parameters `_kwargs`, `_node`,
`_triggerpars`, `_reason`, then the attributes that are valid JS identifiers; a syntax
error names node and attribute and quotes the preprocessed text; a text starting with
`function` is the function itself; `PUBLISH` is an error; `_if` with `func` is an
authoring error in Python and JS; `==` is evaluated in `_handleMeta` of the renderers,
for attributes and the node value, and the string renderers write no `==`; a `==` on a
`dataFormula`/`dataController` attribute is an installation error; a template chain used
by `==`, and a template using a `==`, are errors.

**Implemented:** new `js/src/binding/inline.js` (`InlineCompiler`: `preprocess` with the
legacy regexes of `gnrlang.js` targeting the node methods and one deprecation warning per
declaration, `compile` with one compilation per declaration released at the node close,
`compileExpression` with the D6 arguments). `Provider.invoke` runs `_if`/`_else` (D5) and
inline bodies through `BindingRuntime.inlineCompiler`. `GramlotHtmlRenderer.evaluateExpressions`
and `expressionValue`, used by the HTML and SVG renderers, Python and JS; the live renderer
evaluates, the string renderers drop. `DataInstaller` rejects `==` on providers;
`dataElementError`/`data_element_error` reject `_if` with `func`.

**Verified:** new `js/tests/binding-inline.test.js` (26 tests: D5, Q11.1, legacy truthiness, the four gate fixes, Q11.2, D6,
revision 10, template chain, parity name/inline, macros, macro in a string, syntax error,
one compilation per declaration, cleanup, import graph); `bootstrap.test.js` CSP scan with
the `inline.js` exemption and a named-logic page that never calls `Function`;
`binding-providers.test.js` gate decision 7 now runs inline bodies;
`tests/test_binding_authoring.py` covers `_if` with `func` and the Python string renderer.
Python 69 OK, JS 332/332, runner 8/8.

**Accepted:** not yet; the phase waits for the owner's checks at the gate.

## 575 · S10: native editing — 2026-09-29

Block ID: **GC-070-575**.

**Decided:** unified plan P1, §4.11, the Q5 matrix (owner, 2026-09-28), `live`, C04.1, D7;
gate decisions of 2026-09-29 in the phase notes: `password`, `email`, `url`, `tel`,
`search` are text; `hidden` and `file` have no adapter, `checkbox`/`radio` belong to S11
and the button types to S12; an invalid `number` draft leaves the Data unchanged and an
empty field writes null; `live` writes on `input` for text, `textarea`, `number` and
`range`, and `select`, `color` and the temporal types always write on `change`; no write
during an IME composition, the write per `live` at `compositionend`, a Data change during
the composition projected at its end; a literal or `=` value writes nothing; the origin of
a write is a synchronous flag of the adapter and the equality test compares typed values;
`html.js` writes neither the `value` property nor the `value` attribute of a control; the
first projection runs after `compose`, and a `select` is projected again when its options
change; `type`, `multiple` and `group` rebuild the element, from the Source and from Data,
under freeze at the thaw.

**Implemented:** new `js/src/view/controls.js` (`ControlAdapter` with `TextControl`,
`NumberControl`, `RangeControl`, `SelectControl`, `TemporalControl`, `ColorControl`).
`GramlotRenderer.renderedItem` attaches the adapter after `compose` and detaches it through
`record.cleanup`; `project` hands the resolved `value` to the adapter, rebuilds a control
whose `type`, `multiple` or `group` changed, and projects a `select` again when an option
changes; `HtmlElement.update` skips the `value` of a control. An input type the browser
does not know is its text state. A multiple `select` with a non-array value raises.

**Verified:** new `js/tests/native-controls.test.js` (21 tests: every Q5 row both ways with
empty and invalid values, `live` and its change without rebuild, literal, `=` and `?attr`
values, P1 caret and typed equality, controller correction, `title`/`class` during typing,
synthetic IME, Q7 from the listener, C04.1 and D7 rebuilds with the same NodeBinding and
under freeze, detach at removal); `binding-authoring.test.js` no longer expects a `value`
attribute on a control. New `scripts/verify_binding_browser.mjs` (bundled runtime from
`js/`, `file://` shell, real typing) passes on Chromium 153 and WebKit 26.6; Firefox 155
(`firefox-1543`) exits at start with "Could not find profile folder" on macOS 27.0 and is
not verified. Python 69 OK, JS 353/353, runner 8/8.

**Accepted:** not yet; the phase waits for the owner's checks at the gate.

## 580 · S11: checkbox and radio — 2026-09-29

Block ID: **GC-070-580**.

**Decided:** unified plan D4, P11, C04.2 (owner, 2026-09-28); gate decisions of
2026-09-29 in the phase notes: a group is the `group` value within the nearest Source
ancestor with `formId` or `form=true` (as `#FORM`), or within the page when there is none;
the generated `name` joins an instance id owned by the renderer, the form and the group;
the adapter writes the `name` at attach and removes it at detach; an authored `name` with
`group` raises; the string renderers write no `name`; a radio without `group` is a
standalone boolean; a literal or `=` value sets the initial state and never writes; a
non-boolean Data value is shown with JS truthiness and null is off; only `true`/`false`
are written, on `change`; an authored `checked` with a `^` value raises; several `true` in
one group at mount raise; the `false` writes go only to the peers bound with `^`, through
the same anti-echo guard as the main write.

**Implemented:** `js/src/view/controls.js`: `CheckboxControl`, `RadioControl` (a subclass
of `CheckboxControl`) and `RadioGroups` (`join`, `leave`, `peers`); `checkbox` and `radio`
now have an adapter, so `HtmlElement.update` no longer writes their `value`.
`GramlotRenderer` owns an `instanceId` and creates the page's `RadioGroups`. Choosing a
button writes `true` on it, then `false` on the bound peers that are on, in join order
(the order and the rule of the legacy dijit `RadioButton`); a `true` from the Data after the
first projection runs the same peer loop; the peers follow the user's choice even when a recipient of the first
write turns the chosen button off again. `html.js` is unchanged.

**Verified:** new `js/tests/boolean-controls.test.js` (18 tests: checkbox both ways with
truthiness, null and literal/`=` values, the two-sources error, D1 text → checkbox through
`^.tipo` with the same NodeBinding, click order `true` then `false`, C04.2 from code with
the observers of A notified once, group rebuild after a code write, the mount conflict and
the rebuilt button already on, bound and unbound peers, standalone radio, the two-names
error and no `name` in the string render, form scope, two pages in one document, buttons
added and removed, rebinding, a controller that refuses the choice);
`native-controls.test.js` updated for the S11 adapters. `scripts/verify_binding_browser.mjs`
adds checkbox click and Space, radio click, arrow keys and Space, `SET` from code, group
rebuild and two instances; it passes on Chromium 153 and WebKit 26.6. Firefox is run by the
owner from the macOS Terminal app. Python 69 OK, JS 371/371, runner 8/8.

**Accepted:** not yet; the phase waits for the owner's checks at the gate.

## 585 · S12: button and events — 2026-09-29

Block ID: **GC-070-585**.

**Decided:** unified plan B7, P9, P10, R3 (provisional), R11, R12 (owner, 2026-09-28);
gate decisions of 2026-09-29 in the phase notes: only the `<button>` tag gets a
`ButtonBinding`, `input type=button/submit/reset/image` stay native; `type="button"` only on a
button with a Gramlot mechanism, also when the mechanism appears later, an authored `type`
stays; the nested controller is a direct `dataController` child, several of them or two
mechanisms raise at mount or at the Source change; `fire` fires the modifier string of legacy
`eventToString` or `true`, with `modifier` and `_counter` on the Data node; `fire_<name>` fires
`'<name>'`; the controller receives `_evt`, `button_counter` and the `button_*` modifier
booleans, which are not author arguments; `action` is inline with `this` = the button and
receives `event`, `_counter`, `modifiers` and the button attributes; `connect_on<event>` lower-cases
the event name, a dotted `group.method` is named logic, any other value inline; a disabled
button runs nothing and counts nothing; the button mechanism runs before a `connect_onclick`
of the same element; `stopPropagation` only with a mechanism.

**Implemented:** new `js/src/view/button.js` (`ButtonBinding`) and `js/src/view/events.js`
(`NativeEventBinding`), created in `GramlotRenderer.renderedItem` and detached through
`record.cleanup`; `project` checks the button mechanism again and makes the listeners follow the
`connect_on<event>` attributes; a `dataController` inserted in a button checks its mechanism.
`NodeBinding.clickCount`/`countClick` keep the counter for the node's whole semantic life, so a
rebuild keeps it. `Provider.readArguments` adds the click arguments for `{kind: 'click'}`.
`GramlotBuilderBagNode.FIRE(path, value, attributes)` writes the attributes with the fired
value, with the reset guarantee of S08. `fire` wins over `fire_*` on the same button (legacy
chain).

**Verified:** new `js/tests/button-controller.test.js` (19 tests: R11 on text, span, SVG icon
and synthetic keyboard activation; ancestor `connect_onclick`; controller kwargs; B7; counter
across a rebuild; `action`; `fire` and `fire_*`; P10 at mount and at a Source change; R3 `type`;
disabled; removal during a callback; R12 under freeze; listener error; R3 side effects in a
form, with a parent controller, with author listeners, Enter/Space keydown) and
`js/tests/native-events.test.js` (11 tests); `binding-authoring.test.js` R08 now expects
`type="button"` on the button with a nested controller. `scripts/verify_binding_browser.mjs`
adds the R3 side effects with real clicks and keys; it passes on Chromium 153 and WebKit 26.6.
Python 69 OK, JS 401/401, runner 8/8.

**Accepted:** not yet; the owner reads the R3 results in the phase notes and confirms or
revises R3.

## 590 · S13: integrated lifecycle — 2026-09-29

Block ID: **GC-070-590**.

**Decided:** unified plan P3, P4, R12, §5.1, §5.4; gate decisions of 2026-09-29 in the phase
notes: every defect the new tests find is fixed in the binding modules and recorded with the
test that proves it; Chromium and WebKit are run by the executor, Firefox belongs to S16; a
question the source plan does not settle follows legacy, otherwise the source plan, and is
listed for the review after 0.2.0.

**Implemented:** five defects fixed. A `ControlAdapter` of a node removed under freeze no
longer writes the Data on `input`, `change` or `compositionend` (R12); a radio whose write
removed it no longer turns its peers off, and a peer removed under freeze is left alone; a
`fire_*` that removes its button stops the remaining `fire_*`. `BindingRuntime.dispose` clears
the `node_id` map. `BindingRuntime.handleSourceEvent` completes the event when a disposer fails
and returns the closing errors, and `GramlotRenderer.receive` removes the DOM of every removed
node before throwing them, so a failing disposer no longer leaves elements, records and
listeners behind, also for `clear()` and for a replacement. A failed first render removes the
records its children made before the error (listeners, controls, radio groups, references).

**Verified:** new `js/tests/binding-integration.test.js` (exact traces of Data writes,
lifecycle invocations, registrations, timers and listeners for mount, rebuild, replacement,
removal and insertion under freeze, nested freeze and dispose; R12 with `input`, `change`,
`click`, `keydown` on a removed input, button and `connect_on<event>`; a callback that removes
its own node) and `js/tests/binding-cleanup.test.js` (expired `remoteSource`; errors in
validation, installation, first render, provider and cleanup; a failing disposer; 100 mount
and removal cycles with every counter back to its baseline), on the shared fixture
`js/tests/fixtures/lifecycle.js`. `scripts/verify_binding_browser.mjs` adds R12 with real
typing, clicks and keys on a branch removed under freeze; it passes on Chromium 153 and WebKit
26.6. Python 69 OK, JS 422/422, runner 8/8.

**Accepted:** not yet; the phase waits for the owner's checks at the gate.

<a id="gc-070-595"></a>
## 595 · S14: adapters on the minimal contract, strict CSP — 2026-09-29

Block ID: **GC-070-595**.

**Decided:** unified plan Q3 and Q4 (owner, 2026-09-28); gate decisions of 2026-09-29 in the
phase notes: gramlot-uvicorn, gramlot-js-server and gramlot-serverless are verified in 0.2.0,
each delivered in its own chat on its repository with the owner's authorization given there,
verified locally with the core of this branch linked, with no push until the core 0.2.0 is
published; gramlot-django, gramlot-fastapi, gramlot-flask and gramlot-kajenn are deferred by
the owner to after 0.2.0; the acceptance page is the core fixture
`js/tests/fixtures/logic/avvio.py`/`avvio.js` with its companion `avvio_aux.js`, plus
`examples/html_svg/03_lists` for `Page.css`. The adapter repositories are not edited from this
repository.

**Implemented:** Q3 clear error. When the browser refuses `new Function` with an `EvalError`
(a CSP without `'unsafe-eval'`), the `InlineCompiler` raises an `EvalError` that names the node
and the attribute, points to named logic in the page companion `_aux.js` or to the permissive
CSP profile, and keeps the browser error as `cause`. It covers every inline declaration:
`formula`, `script`, `_if`/`_else`, `==`, `action` and `connect_on<event>`.

**Verified:** `js/tests/binding-inline.test.js` adds a Q3 test under a real engine refusal (a
Node process started with `--disallow-code-generation-from-strings`): named logic computes;
`script`, `formula`, `==`, button `action` and `connect_onclick` raise the Q3 error naming node
and attribute; nothing is written. `scripts/verify_binding_browser.mjs` adds a second
`file://` shell with a strict CSP (meta `script-src 'nonce-…'`, no `'unsafe-eval'`): the
nonce scripts run, a script without the nonce is blocked, named logic computes on real typing,
an inline `script` and an inline button `action` raise the Q3 error, the page reports the
`script-src eval` violation. It passes on Chromium 153 and WebKit 26.6; Firefox runs from the
owner's Terminal app or in S16. Python 69 OK, JS 423/423, runner 8/8.

Adapters (one row each; the three pending rows are filled by the coordinating chat from the
report of each delivery chat):

| Adapter | Status | Reason or report |
|---|---|---|
| gramlot-uvicorn | verified | delivery chat report of 2026-09-30, checked by the coordinating chat: local branch `s06-filehost`, commits `08a6029` and `abdf54b`, unpushed; 5 tests passed, tests aligned to the `PageBootstrap` document; GET/HEAD serve only `.css` and `_aux.js` below the pages folder, real path inside the folder as in `FileHost.url`, everything else 404; `Page.css` URLs outside the folder stay application assets; parameter `content_security_policy` with the `{nonce}` placeholder, header on HTML responses only; `avvio` (with `avvio_aux.js`) and `03_lists` (with `Page.css`) reach `state: 'started'` with prefix `/py` and no console errors under the strict (`script-src 'nonce-{nonce}'; object-src 'none'; base-uri 'none'`) and the permissive (plus `'unsafe-eval'`) profile, in Playwright Chromium; `git grep -iE 'gramlot_minimal\|@gramlot/minimal' -- src tests` exit code 1. The Q3 message was first not seen because the served runtime predated `bff81ba`; with the runtime regenerated on 2026-09-30, Playwright Chromium 153 on `/py/inline` under the strict header gives `state: 'failed'`, the inline code does not run, and the page error is the Q3 `EvalError` naming `dataController 'dataController_0' 'script'` and pointing to `_aux.js` or the permissive profile (`cause` is checked by `js/tests/binding-inline.test.js`) |
| gramlot-js-server | verified | delivery chat report of 2026-09-30, checked by the coordinating chat: branch `develop`, commits `941e60f` (the 2026-09-24 rename from `gramlot-nodejs`, committed separately with the owner's ok), `ed38743`, `e5d21c8` and `1214ac0` (Phase 18: 404 "Unknown Source method" on the new JS `SourceNotFound`, as gramlot-uvicorn; tests for `main`, `missing`, `constructor`), unpushed; `@gramlot/native-html` moved to `peerDependencies` (`"*"`), core linked with `npm install --no-save ../gramlot/js`, so server and pages share one instance and the runner `/js/…` 500 is gone; `src/native-fetch.mjs` builds `new FileHost(pages, options)` when no host is passed and passes `mountPath` as the `prefix` of `openPage`; option `contentSecurityPolicy` with the `{nonce}` placeholder, header on HTML pages; GET/HEAD serve only `.css` and `_aux.js` whose real path is inside the pages folder, other files 404, other methods 405 as in gramlot-uvicorn; `Page.css` URLs outside the folder stay application assets; `npm test` 7/7 on Node, `bun test test/native.test.mjs` 5/5; the browser harness passes on Node and Bun: `avvio` with prefix `/app` reaches `state: 'started'` under the strict and the permissive profile, the inline page starts under the permissive profile and fails under the strict one with the core error naming the node; core runner on port 8091 with Node: `/js/e03` and `/js/index` reach `state: 'started'` with no errors (runner on Bun not tried); `git grep -iE 'gramlot_minimal\|@gramlot/minimal' -- src test` exit code 1 |
| gramlot-serverless | verified | delivery chat report of 2026-09-30, checked by the coordinating chat: branch `develop`, commits `2451143`, `5d5a65e` and `b79a80d` (Phase 19: tests aligned to "Unknown Source method"), unpushed; dependencies `@jsr/genro__gramlot >=0.2.0`, `@jsr/genro__builders >=0.4.0`, node `>=22`, core `cb46c20` linked with `npm install --no-save`; `npm test` 19/19; `WorkerHost` implements `resolveResources`, `foo_aux.js` is a separate window-only bundle (blob URL in the single HTML), `PageBootstrap` subclass closes through the `WorkerTransport`; the core `scripts/verify_worker_host_browser.mjs` and the new `scripts/verify_worker_sentinel_browser.mjs` pass on Chromium 153 and WebKit 26.6: with the core page `avvio` the window sentinel is 1 and the Worker sentinel 0; the esbuild metafile of the `WorkerHost` bundle has no `binding/inline.js`; `script-src` holds the sha256 of the final script bytes plus `blob:`, no `'unsafe-inline'` or `'unsafe-eval'`, a copy with one added byte is blocked; defect found and fixed: with genro-builders 0.4.0 the CSP meta was written as `http_equiv` and ignored by the browser; `git grep -iE 'gramlot_minimal\|@gramlot/minimal' -- src tests` exit code 1. Firefox from the owner's Terminal app or in S16 |
| gramlot-django | blocked | deferred by the owner to after 0.2.0 (gate 2026-09-29); its path is excluded from the S16 qualification |
| gramlot-fastapi | blocked | deferred by the owner to after 0.2.0 (gate 2026-09-29); its path is excluded from the S16 qualification |
| gramlot-flask | blocked | deferred by the owner to after 0.2.0 (gate 2026-09-29); its path is excluded from the S16 qualification |
| gramlot-kajenn | blocked | deferred by the owner to after 0.2.0 (gate 2026-09-29); its path is excluded from the S16 qualification |

**Accepted:** by the owner on 2026-09-30: the three delivery chats reported, their rows are
filled, S14 is closed.

<a id="gc-070-600"></a>
## 600 · S14bis: example families `binding` and `controllers` — 2026-09-30

Block ID: **GC-070-600**.

**Decided:** unified plan §7 S14bis; owner decisions of 2026-09-26 (families `binding` and
`controllers`; `html_svg` stays native HTML/SVG without binding) and gate decisions of
2026-09-30 in the phase notes: the examples "rewritten with binding" are new pages in
`examples/binding/` with the content of `html_svg` 06, 08 and 12; every example is a file page,
Python first with its JavaScript equivalent; the naming conventions of §7 S14bis; D11, the
runner uses only what the minimal `FileHost` serves.

**Implemented:** `examples/binding/` with eleven pages (pointers `^`, `=`, relative, `#node_id`,
`#FORM`, `?attr`; variable datapath; `dataSetter` and defaults with `attr_*`; native editing and
`live` from a pointer; checkbox and radio; `visible`, `hidden`, `class`, `style` and reactive
style shortcuts; bound SVG; freeze; forms, SVG shapes and the complete page of `html_svg` 06,
08 and 12 with binding) and `examples/controllers/` with nine pages (`dataFormula` with `=`,
`_if`/`_else`, `_init`; `dataController` with `_fired`, `_delay`, `_timing`, `_onStart`; named
logic in a companion `NN_name_aux.js`; `==` expressions and inline `action`; `SET`, `GET`, `PUT`,
`FIRE`, `FIRE_AFTER`; button with nested controller, counter, modifiers, `fire` and
`fire_<name>`; `connect_on<event>`; `remoteSource` with a `@source` method; the end-to-end story
of §8.1). `catalog.json` lists the three families; the Python and JavaScript runner pages, the
launcher and the runner behaviour read them; the launcher copies a logic companion beside the
staged page, and the code pane shows it. The standalone export keeps the `html_svg` family only.

**Verified:** new `examples/00-runner/tests/examples.test.js` mounts every JavaScript page of
the two families in JSDOM through its host path (Source from `main`, companion registered as the
root group, `remoteSource` answered by the Page's Source method) and checks the behaviour its
README describes; `runner.test.js` adds the families and the companion pane. Runner 30/30.
`scripts/verify_examples_browser.mjs`, extended to the two families, opens every example on
`/py` and `/js` in Chromium 153 with Python/JavaScript DOM parity (radio group names compared
without the instance id), then opens each one again in the runner iframe: no page error, no
console error, no failed local asset. The pre-existing `html_svg` 06 Reset check of that script
fails since S10 and was not run (phase notes).

**Accepted:** not yet; the phase waits for the owner's checks at the gate.

<a id="gc-070-605"></a>
## 605 · S15: documentation and leftovers — 2026-09-30

Block ID: **GC-070-605**.

**Decided:** unified plan §7 S15; gate decisions of 2026-09-30 in the phase notes: no new
public guide (`prepare_docs.py` and its `PUBLIC_PAGES` unchanged); the 0.2.0 content goes
into GC-095 and GC-090; `html_data` for the HTML5 element, `data(...)` forbidden;
`gramlot-minimal` in current text replaced by its heirs (`gramlot-uvicorn`,
`gramlot-serverless`), dated blocks keep it; historical blocks are annotated with a
pointer to the current rule, never rewritten; the code files of
`src/gramlot/page/_grammar_load.py`, `src/gramlot/page/_collection.py` and
`src/gramlot/collections/html5.json` stay (genropy/genro-builders#51 is still open).

**Implemented:** public guides. GC-095: release status, examples by route (`b01`-`b11`,
`c01`-`c09`), `html_data`, the Data representation of each native control (type matrix) and
the `live` rule, R3 as accepted with the one-field form effect, `fire` with `fire_*`,
`connect_on<event>` naming, cleanup and closing errors, intentional differences from legacy
and migration from 0.1.x. GC-090: release status, `PageBootstrap` and its `{config,
resources}`, the mount prefix, the companion rule of the adapters, the CSP profiles (new §035:
strict and permissive, the Q3 error), the export shape of `gramlot-serverless`, package names
(new §040, removed at the gate check of 2026-09-30: package names stay for S17), the adapters verified and deferred. GC-020, GC-025, GC-030 and GC-100 aligned to
the same status and to the heirs of Minimal. Leftovers. `gramlot-minimal`: constitution §7
and §14, amendments 11.19 and 11.37 (superseded-in-part marks), GC-140, GC-085, GC-086,
GC-087, GC-175, overview, GC-025 (the showcase link is kept as historical). Old example
layout: constitution 11.22 layout note, GC-145, GC-150, GC-140 §025, GC-065 §030 (the
original plan is marked history; the implemented contract is stated first), GC-210 §060
(S14 update and S15 delivery notes). GC-045 §055 (question 8 closed: Python has the
counterpart classes; observed versions updated) and GC-085 (versions). GC-065 status lines
and GC-086, GC-087 §085 aligned to 0.2.0 as implemented. Historical blocks with `SOURCE`:
GC-070 §315, GC-088, GC-089, GC-125, PORT-0003, PORT-0004 and amendment 11.16 annotated
with the current rule (the `SOURCE` suffix is gone, constitution 11.48 item 8).

**Verified:** `python scripts/prepare_docs.py`, `python -m sphinx -W --keep-going -n -b html
build/docs-source build/docs-site` and `python scripts/check_public_docs.py` pass; `git
grep -iE 'gramlot[-_/]minimal' -- docs docs_llm` finds only dated blocks (amendments with a
superseded mark, GC-070 entries, the GC-210 register and historical inventory) and explicit
statements that the repository is retired. Python 69 OK, JS 424/424 (with
`GRAMLOT_TEST_PYTHON` set to the project `.venv`), runner 31/31. No code changed.

**Accepted:** not yet; the phase waits for the owner's checks at the gate.

<a id="gc-070-610"></a>
## 610 · S15bis: corrections from the review before qualification — 2026-09-30

Block ID: **GC-070-610**.

**Decided:** owner, 2026-09-30, after two independent reviews of `5035228`: one correction
per finding (ASTRA-01 to ASTRA-07, Fable R1 with R6, R3, R4 a and b, R5, M3), each with a
regression test that fails before the fix, in Python and JavaScript where the rule exists in
both; the deferred findings stay in the plan notes for the review after 0.2.0. The rules are
recorded in [GC-210 §090](210-binding-contract.md#gc-210-090).

**Implemented:** the constructor scan of `Logic` always ends and skips regular expression
literals; `type`, `multiple`, `group`, `live` and `visible` come from the resolved projection
(`==` included); the installation rules run at the validation of the candidate, a failed
installation of `main` removes it from the Source, and an update on a node without NodeBinding
names node and tag; successive collections replace a named declaration whole in Python as in
JS; radios follow their form owner and ignore closed peers at the join; a failed first
projection is cleaned up with its listeners; promoted `_text` stays typed; `FIRE_AFTER` checks
the path at the call; the JS Host has `SourceNotFound` and accepts null `params`; lifecycle
attributes accept true, false, null or a number; namespace URIs and the segment rule are
defined once per language. Public guides GC-090, GC-095 and GC-100 updated where they
described the old behaviour.

**Verified:** Python 72 OK, JS 441/441 (with `GRAMLOT_TEST_PYTHON` set to the project
`.venv`), runner 31/31; `npm --prefix js run build`; `scripts/verify_binding_browser.mjs` PASS
on Chromium 153.0.8010.12 and WebKit 26.6; `prepare_docs.py`, Sphinx `-W` and
`check_public_docs.py` pass. Open outside this repository: `gramlot-js-server` maps only
`PageExpired` and `PageNotFound` to 404, not the new JS `SourceNotFound`.

**Accepted:** not yet; the phase waits for the owner's checks at the gate.

<a id="gc-070-615"></a>
## 615 · S16: qualification — 2026-09-30

Block ID: **GC-070-615**.

**Decided:** gate decisions of 2026-09-30 in the plan notes: report GC-215 in the form of
GC-130 §025; mandatory rows for the families A01-A18, the full suites, Chromium and WebKit, the
§8.1 story through the real bootstrap, the C07 bundle check, counters with two fixtures and the
hosts; clean environments from the artifacts of this branch; Firefox run by the owner; defects
recorded, not fixed.

**Implemented:** three enrolled tests in `js/tests/`: `qualification-story.test.js` (the §8.1
story on the Python and the JS page through `FileHost`, TYTX and `PageBootstrap`, eight checks,
exact trace, counters), `qualification-counters.test.js` (one write costs the same with 1 and
with 200 unconnected branches), `runtime-bundle.test.js` (C07: a served bundle that is not the
build of `js/src` fails the suite). The lifecycle fixture exports its timer and listener
trackers. The report is [GC-215](215-qualification-0-2-0.md).

**Verified:** see GC-215 §015: Python 72 OK, JS 451/451, examples 31/31 in the checkout and in
the clean environments (latest published genro versions, no pins); Chromium 153 and WebKit 26.6
for binding, Worker host, the three hosted adapters with strict and permissive CSP and the
story in the browser; gramlot-uvicorn 5, gramlot-js-server Node 7 and Bun 5 pass. Blocked:
gramlot-serverless tests 17/19 (the core error text changed in S15bis), the story on the
standalone export (strict profile only). The C07 check found the served bundle stale at the
start of the phase; rebuilt.

**Accepted:** the qualification is complete (2026-09-30): Firefox F1-F9 passed from the
owner's Terminal run; R20 passed after `b79a80d` in gramlot-serverless; the owner granted the
waivers R22, R24, L1 and refused R20 (GC-215 §035). The release acceptance is S17.

<a id="gc-070-620"></a>
## 620 · S17: owner acceptance of Gramlot 0.2.0 — 2026-09-30

Block ID: **GC-070-620**.

**Accepted:** the owner accepted the Gramlot 0.2.0 release on 2026-09-30 ("si accetto", in the
coordinating chat `wf:gramlot-0-2-0-binding`, after the qualification of GC-215 and on branch
`wf/gramlot-0-2-0-binding` at `ac5c08f`). The acceptance covers the implemented and qualified
code; it does not authorize the version change, the consolidation pushes or the publication,
each of which needs its own owner authorization (source plan §7 S17).

**Decided with the acceptance:** the package-name question (GC-215 D3: `@gramlot/native-html`
and `@jsr/genro__gramlot` for one core) is deferred to after 0.2.0; `/quality-check` is not run
before `/finalize-workflow`, because two independent reviews of the whole code (2026-09-30,
Phase 18 notes) and a verifier on Phases 18 and 19 took its place; the sequence is version,
finalize on `develop`, push, merge into `main`, publication, then the adapter pushes.

**Status:** implemented yes; accepted yes; version 0.2.0 authorized by the owner (2026-09-30) and packaged locally with the C07 re-check; published on 2026-09-30 as tag `v0.2.0`, GitHub release, PyPI `gramlot` 0.2.0 and JSR `@genro/gramlot` 0.2.0 (GC-215 §045).

<a id="gc-070-625"></a>
## 625 · Adapters pushed with their own CI after 0.2.0 — 2026-10-01

Block ID: **GC-070-625**.

**Decided:** the owner asked each downstream repository to carry its own CI, coverage,
documentation build and standard files, as `gramlot-devtools` does; one brief for the three
verified adapters (coordinating chat, 2026-10-01).

**Implemented and verified by the coordinating chat on the remotes:**

| Adapter | `main` = `develop` | CI on `main` | Notes |
|---|---|---|---|
| gramlot-uvicorn | `580bb40` | success: published core on Python 3.11 and 3.12, core main, documentation | `gramlot>=0.2.0`; Codecov 81% (154 statements); Read the Docs to import |
| gramlot-js-server | `8c30641` | success: core main on Node 22 and Bun, documentation | no published-core job while `@gramlot/native-html` is unpublished (D3); Read the Docs imported, first build passed |
| gramlot-serverless | `a70fe59` | success: published core (`@jsr/genro__gramlot` 0.2.0 from the registry), core main with the Worker sentinel, documentation | Read the Docs to import |

Each repository has `tests.yml`, `codecov.yml` (Codecov upload with OIDC), Sphinx for the
paired `docs`/`docs_llm` guides with `.readthedocs.yaml`, `NOTICE`, `CLAUDE.md`,
`CONTRIBUTING.md` and a README with CI, Codecov, Read the Docs and license badges. The core CI
on `main`, dispatched after each push, passed with the new adapter `main` branches. The core
itself carries the same standard since `7cfc51a` (tests and coverage badges, Codecov per
runtime, `CONTRIBUTING.md`, `CLAUDE.md`).

**Open:** gramlot-uvicorn and gramlot-serverless share the `GS` document namespace with the
same Document IDs since the split of `gramlot-minimal` (to be renamed after 0.2.0); D3.

<a id="gc-070-630"></a>
## 630 · User documentation of the adapters — 2026-10-01

Block ID: **GC-070-630**.

**Decided:** the owner asked for adapter documentation written for a reader who does not know
Gramlot; the definition of Gramlot and the table of the repositories live once in the core page
GC-055 (`docs/public/055-family.md`, `d96ebf7`) and the adapters link it (brief of 2026-10-01).

**Implemented and verified by the coordinating chat on the remotes and on Read the Docs:**

| Adapter | `main` = `develop` | CI on `main` | Published guides | Quick-start test |
|---|---|---|---|---|
| gramlot-uvicorn | `9723fa2` | success | GS-105…GS-140 (Introduction, Tutorial, Writing pages, Configuration, Deployment, Reference, Troubleshooting) | `tests/test_examples.py` runs the README page |
| gramlot-js-server | `2742ead` | success | files 005…040, IDs GN-105…GN-140 | `test/quickstart.test.mjs` on Node and Bun |
| gramlot-serverless | `fc06286` | success | GS-105…GS-140 | `tests/quickstart.test.js` and `scripts/verify_quickstart_browser.mjs` (Chromium) |

Each README opens with one sentence on Gramlot and the link to GC-055, says what the repository
is, when to choose it and what it does not do, and shows a quick-start page that a test runs.
The former internal notes moved to `docs/internal/`, out of the published sites. The core CI on
`main`, run again after the three pushes, passed.

**Open:** guide file numbers differ between the repositories (gramlot-js-server 005…040 with IDs
GN-105…GN-140; the others 105…140); the shared `GS` namespace of gramlot-uvicorn and
gramlot-serverless; D3.

<a id="gc-070-635"></a>
## 635 · Package names and registries, release 0.2.1 — 2026-10-01

Block ID: **GC-070-635**.

Owner, 2026-10-01: JavaScript packages on npm and JSR ("tenerli entrambi"); one package name on
both registries, only the scope differs ("@gramlot/gramlot no ?"); genro modules on npm under the
existing organization `genrojs` ("userei genrojs"). D3 is closed with `@gramlot/gramlot`.

| Package | npm | JSR |
| --- | --- | --- |
| core | `@gramlot/gramlot` 0.2.1 | `@gramlot/gramlot` 0.2.1 (`@genro/gramlot` archived) |
| bag | `@genrojs/bag` 0.10.1 | `@genro/bag` 0.10.1 |
| builders | `@genrojs/builders` 0.4.1 | `@genro/builders` 0.4.1 |
| tytx | `@genrojs/tytx` 0.16.1 | `@genro/tytx` 0.16.1 |

The source imports the npm names; `jsr.json` maps them to `jsr:@genro/*`, so each registry's
package depends on one copy of Bag, Builders and TYTX from the same registry. The genro modules
moved from `genropy` to `genro-org` on 2026-10-01. gramlot-js-server takes the core as peer
`@gramlot/gramlot >=0.2.1` (`11e5db2`). `publish.yml` publishes the tag to PyPI, npm and JSR.

**Open:** gramlot-serverless still imports `@jsr/genro__gramlot` until its rename, after the npm
publication of the core.

<a id="gc-070-640"></a>
## 640 · The standalone exporter joins gramlot-js-server — 2026-10-01

Block ID: **GC-070-640**.

Owner, 2026-10-01, to reduce the downstream repositories: gramlot-serverless joins
gramlot-js-server ("va bene js server in effetti il worker è uj server"); names "server" and
"browser", without the `native` prefix ("accetto il tuo suggerimento"). Amendment 11.50.

- gramlot-js-server is an npm workspace: `server/` is `@gramlot/gramlot-js-server` (entry points
  `/node` and `/bun`, `startServer`), `browser/` is `@gramlot/gramlot-browser` (command
  `gramlot-browser`). History imported with `git subtree` (`05efadd`); layout `9cbbd11`; PoC
  showcase removed `b3a6e6e`; names `d706973`; PoC server removed `c0ca2bd`.
- Core: the runner, `scripts/verify_worker_host_browser.mjs` and CI use the two packages from one
  `gramlot-js-server` checkout (`18880bb`, `0569d4d`).
- Verified on 2026-10-01: clean clone with `@gramlot/gramlot` 0.2.1 from npm, server 6/6 on Node
  and Bun, browser 20/20, three Chromium checks of the exporter; with the core `main` linked, the
  sentinel check and the server browser harness on Node and Bun; core Python OK, JavaScript
  451/451, runner 31/31, Worker host and standalone runner in Chromium; runner pages `/js/e01`,
  `/js/b01`, `/js/c01`, `/py/b01` answer 200.
- The open item of §635 is closed: the exporter imports `@gramlot/gramlot` (gramlot-serverless
  `8ed1fc3`).

Registries (owner, 2026-10-01, "ok"): the two packages are published on npm only. A JSR install
maps the core to `@jsr/gramlot__gramlot` behind the alias `@gramlot/gramlot` (verified with
`npx jsr add @gramlot/gramlot`), so a JSR adapter would bring a second copy of the core next to
the one the pages import, and `@gramlot/gramlot-browser` resolves the core by name at build time.
The core stays on npm and JSR.

**Open:** npm publication of the two packages; archive of `gramlot-org/gramlot-serverless` and of
its Read the Docs project.

<a id="gc-070-645"></a>
## 645 · The native label is removed — 2026-10-02

Block ID: **GC-070-645**.

Owner, 2026-10-02: the label "native HTML" "è completamente fuorviante". It named only
the scope of the 0.1.0 milestone (no web components, no recipes). Rule:
[GC-005 §030](../005-documentation-policy.md#gc-005-030); constitution amendment 11.51.

- Code, tests and scripts (`cdc33d9`): `js/tests/source-contract.test.js`,
  `tests/test_source_host.py`, `scripts/verify_page_browser.mjs`; fixture titles
  "Contract fixture" and "Worker page"; package docstring.
- Documentation file names (`cefa532`): `088-0-1-0-plan.md`, `089-0-1-0-handoff.md`,
  `110-0-1-0-readiness.md`, `ports/PORT-0001-0-1-0/`, `ports/PORT-0004-0-1-0-delivery/`;
  IDs and anchors unchanged.
- Current documents (`7757c1d`); naming note in the dated records (`022acff`).
- Verified on 2026-10-02: Python 72 OK, JavaScript 451/451, runner 31/31, runner on port
  8091, `verify_page_browser.mjs` and `verify_worker_host_browser.mjs` PASS in Chromium,
  Sphinx with `-W` and the public documentation check.

Outside this change: the Python adapters (`NativeHtmlASGI`, `mount_native_html`,
`native_html.py`) until gramlot-py-server; the core `examples/` and gramlot-examples with
the move of the examples; gramlot-site, outside the framework.

**Open:** gramlot-js-server documents (GN-010, GS-020); publication of the core.


<a id="gc-070-650"></a>
## 650 · Rich graphic identity kit — 2026-10-02

Block ID: **GC-070-650**.

**Authorized scope:** after the audit identified hybrid SVGs and missing vector,
transparent, monochrome and favicon assets, the owner requested: “puoi provvedere
e creare una bella cartella con tutto il necessario per un immagine grafica ? bella
ricca”. The scope completes the existing identity kit, preserving the September
blue/yellow symbol, lowercase outlined Arial Rounded lettering and approved tokens.
No architecture amendment or runtime theme change is involved.

**Implemented:** the `assets/branding/` kit (the ZIP `assets/gramlot-brand-kit.zip` is generated by
`source/build_assets.py` and not committed): one vector master; stacked/horizontal logo, symbol
and wordmark in six variants; transparent PNG sizes; browser, device and maskable
icons; palette formats; five social layouts in light/dark; wallpapers and slide
backgrounds; offline catalogue, printable four-page guide, rebuild script and
checksummed manifest. The original raster/hybrid files stay in git history (`234c6d8`); they are not
committed again.
Stable root logo entry points now contain vector paths and retain their white/navy
background use. The symbol is reconstructed from the selected raster, not recovered
from a pre-existing vector file. Original lettering paths remain unchanged.

**Verified:** all generated SVGs parse and contain no raster/external/active content;
PNG dimensions, alpha, unclipped bounds and shared variant geometry agree; maskable
safe circles and five ICO frames pass. Reference silhouette overlap is 98.956%
(IoU). Local HTML/Markdown links, all SHA-256 hashes, ZIP CRC/membership/content,
paired anchors and the four PDF pages pass. Reviewed the PDF renders and catalogue
at 1440px desktop and 390px mobile; no missing image, horizontal overflow or script
error. Strict Sphinx and the public-documentation checker pass (8 pages).

**Acceptance:** the owner authorized creation; visual acceptance of the reconstructed
symbol and new layouts is pending. Target-platform tiny-icon checks and printer-specific
CMYK/spot-color production proofs remain contextual reviews. The kit is delivered;
no publication, consolidation or installed application theme is implied.


<a id="gc-070-655"></a>
## 655 · Serverless name and packaged theme and logo, release 0.2.2 — 2026-10-02

Block ID: **GC-070-655**.

Owner, 2026-10-02: `@gramlot/gramlot-browser` becomes `@gramlot/gramlot-serverless`
("gramlot-serverless forse è il piu semplice"), ahead of gramlot-py-server, "così
chiudiamo tutta la parte js"; the core 0.2.2 carries the theme and the logo files in
every package. Constitution amendment 11.52.

- gramlot-js-server 0.2.2: rename `ca0e102` (`browser/` → `serverless/`, command
  `gramlot-serverless`), release `0965fff`, tag `v0.2.2`. `@gramlot/gramlot-serverless`
  0.2.2 and `@gramlot/gramlot-js-server` 0.2.2 are on npm, published by hand from the
  tag: the npm job of `publish.yml` failed with `EALLOWGIT`, because npm 12 reads
  `dist/NAME.tgz` as a GitHub shorthand. Fix `ca60072` (`./dist/NAME.tgz`).
  `@gramlot/gramlot-browser` was deprecated and then unpublished from npm.
- Core: runner, scripts and CI on the new name and the same `publish.yml` fix
  (gramlot-org/gramlot#7, `4e0eefc`, merge `1db63c5`). Theme and logo files in the npm,
  PyPI and JSR packages (`b9ada8d`): `themes/`, the four stable entry points of
  `assets/branding/` and `assets/branding/svg/`; JSR no longer carries the rest of the
  identity kit. Paths: [GC-090 §023](../public/090-classes-and-hosts.md#gc-090-023).
  Current documents (`e51989c`).
- Verified on 2026-10-02: Python 72 OK, JavaScript 451/451, runner 31/31 and on port
  8091, `verify_worker_host_browser.mjs` PASS in Chromium; `npm pack`, the wheel
  (read with `importlib.resources`) and the JSR dry run carry the same 30 files; Sphinx
  with `-W` and the public documentation check.

**Open:** gramlot-examples `apps/hello-world` still depends on `@gramlot/gramlot-browser`,
which is no longer on npm.

<a id="gc-070-660"></a>
## 660 · Inline code activated by the received Source — 2026-10-03

Block ID: **GC-070-660**.

Owner, 2026-10-03: inline code stays and is available everywhere, also in the file
without a server ("credo sia necessario accettare unsafe e fare il possibile per
prevenire"); the code is activated in one place only, the reception of the Source, in
the Gramlot Source classes; no new wire type. Approved during the work: the test
migration (A.3), the refusal of `on*` attributes and `javascript:` URLs, and
`connect-src *` in the single file "until the CSP grammar arrives". Constitution
amendment 11.53.

- Core `feat/inline-code-activation`: `0cb54f1` activation in `Gramlot.prepareSource`
  (`GramlotBuilderBagNode.activateCode`, `InlineCompiler` compiles only the activated
  text), pointer in a code attribute refused at reception, `on*`/`javascript:` refused
  by the JS renderers; the tests that wrote inline code in the live Source mount a
  separate Source (`js/tests/fixtures/mount.js`). `c9584ab` the same attribute rule in
  the Python renderers and a contract test of a Python Source with inline code.
  `06637d9` documents and amendment 11.53. `f2eb977` the pages of
  `scripts/verify_binding_browser.mjs` mount a received Source.
  Rules: [GC-090 §035](../public/090-classes-and-hosts.md#gc-090-035),
  [GC-095 §065](../public/095-writing-pages.md#gc-095-065).
- gramlot-js-server `feat/serverless-inline-code`: `312d4fc` single-file CSP with
  `'unsafe-eval'` and `connect-src *`, example `serverless/examples/inline-code` and
  `verify_inline_browser.mjs` in both CI jobs; `902c5e3` its guides.
- Verified on 2026-10-03: Python 76 OK, JavaScript 461/461, examples 31/31; runner on
  port 8091 with the new core in both integrations (`c01`, `c02`, `c04`, `c06`, `c07`,
  `c09`), no console or server errors; gramlot-js-server with the new core in a
  temporary worktree: server 6/6, serverless 20/20, Chromium checks PASS
  (`verify_inline_browser`, `verify_export_browser` ×2, sentinel, quick start);
  `verify_binding_browser.mjs` PASS in Chromium, strict CSP check included.

**Open:** the directory export of `serverless` sets no CSP. Closed: the `iframe`
`srcdoc` from Data (section 665); released as 0.2.3 (gramlot-org/gramlot#9).

<a id="gc-070-665"></a>
## 665 · An iframe srcdoc from Data is sandboxed — 2026-10-03

Block ID: **GC-070-665**.

Owner, 2026-10-03 ("ok"): an `iframe` whose `srcdoc` comes from Data gets
`sandbox=""`, all restrictions; a `sandbox` declared by the author is kept as declared;
a literal `srcdoc` gets none. Rejected: `srcdoc` only literal (no HTML preview), DOMPurify
sanitizing (a runtime dependency and rules to maintain). Approved during the work
("vai"): the declaration decides, not the value; `sandbox` written first by the live
element; a pointer node value counts as Data, because Builder applies the `_wdg` of its
datum over a literal `srcdoc`. Owner, 2026-10-03: examples 10 and 13 pass to
`connect_onclick`, recorded in 11.54, and their browser checks join the CI.
Constitution amendment 11.54.

- Core `feat/srcdoc-sandbox`: `f6876cc` `withDataSrcdocSandbox` and
  `with_data_srcdoc_sandbox` in `_handleMeta` of both renderers, next to the script
  attribute check; `HtmlElement.update` writes `sandbox` first. `103ca15` tests: the
  same Sources in Python and JavaScript (`style-shortcuts.test.js`), Python
  `SrcdocSandboxTests`, live `js/tests/srcdoc-sandbox.test.js`, and four iframes in
  `scripts/verify_binding_browser.mjs`. `ae04748` example 13 uses `connect_onclick`: its
  `onclick` stopped the page since 0.2.3; `c4dbbfc` the same for example 10. `0b14e33`
  documents and amendment 11.54. `f9cdb31` the core CI job installs Playwright Chromium
  and runs `verify_binding_browser.mjs`, then the runner with the Uvicorn integration
  and `verify_live_cards.mjs`, `verify_live_playground.mjs`. Rules:
  [GC-090 §035](../public/090-classes-and-hosts.md#gc-090-035),
  [GC-095 §065](../public/095-writing-pages.md#gc-095-065).
- Verified on 2026-10-03: Python 81 OK, JavaScript 466/466, examples 31/31;
  `verify_binding_browser.mjs` PASS in Chromium 153 and WebKit 26.6: the script of a
  `srcdoc` from Data does not run, also after a Data change and after a Source change
  from a literal `srcdoc`; a declared `allow-scripts` and a literal `srcdoc` run; without
  the rule the check fails. Runner on port 8093 with the new core in both integrations
  (`e01`, `e06`, `e12`, `e13`, `b01`, `b05`, `c01`, `c04`, `c06`, `c07`, `c09`);
  `verify_live_cards.mjs` (`e10`) and `verify_live_playground.mjs` (`e13`) PASS on
  `/py` and `/js`, both failing before the fix.
- `5a554ea` item 4 of 11.54 (examples 10 and 13) and this record. Release 0.2.4:
  version in `pyproject.toml`, `js/package.json` and `jsr.json`; release notes v0.2.4.

**Open:** the same `onclick` correction in gramlot-examples, done in its own chat; the
new CI steps run for the first time on the pull request.

<a id="gc-070-670"></a>
## 670 · One page module with Page and Logic; gramlot.inout — 2026-10-03

Block ID: **GC-070-670**.

Owner, 2026-10-03, brief 1 of the gallery and project-creation plan
(`decisioni_gallery-scaffold`): a JavaScript page is one module that exports `Page` and
`Logic`; beside a Python page the logic module is `foo.js`; `foo_aux.js` stays admitted;
the data functions live in `gramlot.inout`. Approved during the work ("ok"): an import
map resolves `@gramlot/gramlot/page` in the browser (a server bundle rejected: esbuild in
a Python host, a second core copy); both logic modules together are an error; the core
`examples/` pass to the module form, with their runner; the runner serves the example
modules as JavaScript; `gramlot.inout` formats (`sendHttp` posts a JSON object; the email
subject is the page title); `gramlot.inout` is part of the browser runtime for Python and
JavaScript pages (owner correction). Constitution amendment 11.55.

- Core `feat/page-module-inout`: `3d207e0` `FileHost.resolveResources` takes the page
  module's `Logic`, `FileHost.resolve_resources` takes `foo.js` beside `foo.py`, else
  `foo_aux.js`, both an error; `openPage`/`open_page` write the import map with the
  bootstrap nonce; `js/src/index.js` exports `Page` and `source` into the runtime; the
  fixture `avvio` passes to the module form; the CSP error of inline code names the
  page's class `Logic`. `a92b142` the 33 core examples export `Page` and `Logic`, the four
  `NN_name_aux.js` move into their module; the runner shows the module, stages a one-line
  `{route}_aux.js` that re-exports `Logic` from the example URL, and serves the example
  modules as JavaScript. `c7656bf` `scripts/verify_page_module_browser.mjs`: both forms on
  a Node and a Python loopback host under a strict CSP. `a561ff6` merge of develop (0.2.4,
  no conflict). `4fc0fab` `js/src/inout.js` (`InOut`, `gramlot.inout`) and
  `js/tests/inout.test.js`. `d99de9d` `scripts/verify_inout_browser.mjs`. Rules:
  [GC-090 §030](../public/090-classes-and-hosts.md#gc-090-030),
  [GC-095 §060](../public/095-writing-pages.md#gc-095-060),
  [GC-095 §095](../public/095-writing-pages.md#gc-095-095).
- Verified on 2026-10-03, in a copy with the CI layout (gramlot-js-server `main`):
  Python 83 OK, JavaScript 475/475, examples 31/31. In Chromium 153 and WebKit 26.6:
  `verify_page_module_browser.mjs` PASS (module form and `_aux` form, JS and Python
  hosts, one runtime request, the logic module imported; without the import map the
  module form fails); `verify_inout_browser.mjs` PASS (email text and the 2000-character
  limit, a real POST and a 500, `save`/`restore` with date and decimal through a real
  download and file chooser, JSON and XML export, calls from inline code and from
  `Logic`). In Chromium: `verify_page_browser.mjs`, `verify_binding_browser.mjs` and
  `verify_examples_browser.mjs` (64 pages, runner on port 8197 with both integrations)
  PASS.
- Upstream: `Bag.toXml` of `@genrojs/bag` 0.10.1 writes a date with `Date.toString()`,
  unlike genro-bag (ISO): genro-org/genro-bag-js#10. The XML check of
  `verify_inout_browser.mjs` reads text and numbers only.
- This record, the documents and amendment 11.55. Release 0.2.5: version in
  `pyproject.toml`, `js/package.json` and `jsr.json`; release notes v0.2.5.

**Open:** gramlot-js-server and gramlot-py-server serve `.css` and `_aux.js` only; the
module form with a server needs their `.js` rule (briefs 3 and 4). gramlot-examples
passes to the module form in brief 2. The XML date text waits for
genro-org/genro-bag-js#10.

<a id="gc-070-680"></a>
## 680 · The examples and their runner leave the core — 2026-10-04

Block ID: **GC-070-680**.

Owner: "tutti gli esempi vanno messi nel repo esempi e collegati opportunamente"
(2026-10-02) and the gallery model of 2026-10-02. On 2026-10-04 the owner approved a
six-phase plan and each phase ("vai"); decisions taken on the way: the workflow is
renamed `Core tests`; the trigger of the absent branch `codex/core-runner-ci` goes; the
`file:` branch of the live checks goes (the static export belongs to serverless); the
four Worker checks of `verify_worker_host_browser.mjs` that serverless lacked move to
its `verify_export_browser.mjs` instead of opening an issue. Constitution amendment 11.56.

- Core `chore/examples-out` (from develop `78ea747`): `eb96c6b` the qualification story
  (GC-210 §065) runs on `js/tests/fixtures/qualification/09_end_to_end` and imports
  `PageBootstrap` and `FileHost` from `js/src`; the page module resolves
  `@gramlot/gramlot/page` by package self-reference. `866ef3f` `verify_live_cards.mjs`
  and `verify_live_playground.mjs` start the Python and JavaScript FileHost of the core
  on `js/tests/fixtures/live/` (`scripts/fixture_hosts.mjs`); CI no longer starts
  `serve.py` nor installs gramlot-uvicorn. `072a818` CI `Core tests` without checkouts of
  gramlot-js-server and gramlot-uvicorn and without the runner steps. `fe02793` removes
  `examples/` (138 files), `verify_examples_browser.mjs`, `verify_jsr_examples.mjs`,
  `verify_standalone_runner.mjs`, `verify_worker_host_browser.mjs` and its fixture
  `js/tests/fixtures/worker`; `jsr.json` no longer includes `examples/html_svg/**`,
  `codecov.yml` no longer ignores `examples/**`. `e00f211` README, CONTRIBUTING, GC-025,
  GC-030, GC-055, GC-090 and GC-095 point at gramlot-examples and the gallery commands.
  This record, amendment 11.56, AGENTS.md, `docs/01-overview.md`, GC-085, GC-140, GC-145, GC-150 and
  the indexes.
- gramlot-js-server `test/worker-export-checks` (from develop `683a4b9`): `4855370`
  `serverless/scripts/verify_export_browser.mjs` also checks a live attribute, `clear()`
  of the remote Source target, the state `disposed` and the rejection of
  `transport.main` after dispose.
- Verified on 2026-10-04 in the worktree, without `examples/node_modules`: Python 83 OK,
  JavaScript 475/475 (with c8); in Chromium 153 `verify_binding_browser.mjs`,
  `verify_page_module_browser.mjs`, `verify_inout_browser.mjs`, `verify_live_cards.mjs`
  and `verify_live_playground.mjs` (Python and JavaScript hosts) PASS; Sphinx `-W` and
  `check_public_docs.py` PASS. gramlot-js-server: `verify_export_browser.mjs` PASS in
  Chromium 153 and WebKit 26.6 on `hello-world` and `source-live`; serverless 32/32.
  `deno` was not available: the JSR dry run was not executed.
- Coverage moved downstream: the example pages, the gallery and e10/e13 against the
  published core in gramlot-examples (`examples.test.js`, `gallery.test.js`,
  `verify_pages_browser.mjs`, `verify_e10_e13_browser.mjs`); the static export in
  gramlot-js-server (`verify_export_browser.mjs`, `verify_gallery_browser.mjs`).

**Open:** push, pull requests and merge of the two branches (coordinating chat); the
CI of `chore/examples-out` on GitHub; the JSR package without `examples/html_svg` from
the next release.


<a id="gc-070-685"></a>
## 685 · Release 0.2.6 — 2026-10-04

Block ID: **GC-070-685**.

- `64df3fd` (pull request #14): hand-written `.d.ts` declarations for the five entry
  points of the JavaScript package, module docs, the README example. `20e713b` aligns
  the Gramlot overrides with the declarations of `@genrojs/builders` 0.4.2. `20a677f`
  version 0.2.6, dependency floors `@genrojs/bag` 0.10.3, `@genrojs/builders` 0.4.2,
  `@genrojs/tytx` 0.16.2, release notes v0.2.6.
- The release carries the removal of the examples and the runner (§680, pull request
  #12, merged 2026-10-04). The open points of §680 are closed: both branches are
  merged, `Core tests` and `Documentation` pass on `main` (`b9b2feb`), and the JSR
  package 0.2.6 has no `examples/` file.
- Published 2026-10-04: GitHub release v0.2.6 (wheel, sdist, npm package,
  `SHA256SUMS`), PyPI `gramlot` 0.2.6, npm and JSR `@gramlot/gramlot` 0.2.6 (registries
  checked 2026-10-05).

<a id="gc-070-690"></a>
## 690 · Documentation coherence pass — 2026-10-05

Block ID: **GC-070-690**.

Owner goal, 2026-10-05: "l'insieme Gramlot deve essere pulito, coerente e senza doc che
possano creare confusione". Owner decisions of the same date for this pass:

1. The current release version is written in one place per repository: the README and
   its badge. The guides no longer state "the current patch release".
2. Historical documents stay, with a banner at the top that names their dates, what they
   describe and the current document. Their dated text is not rewritten; only broken
   links are fixed.
3. `css_requires`/`js_requires` need a Host with a resource system. `FileHost` and the
   current adapters have none and raise an error for any name. The resource system comes
   with genro-kajenn, part of Genro, the framework that succeeds GenroPy (built on
   Kajenn, Gramlot and Asqueel); it replaces `gramlot-kajenn` as the named resource host.
4. `gramlot-examples` is public: links to it are allowed.

Branch `docs/coherence` (from develop `18c51aa`):

- `24f3b66` the README carries the current release (0.2.6 at that commit) and its badge;
  the status lines of the public guides, the overview, the documentation map and the
  build guide say that 0.2.0 is released.
- `1a522cf` `gramlot-py-server` and `gramlot-js-server` replace the archived adapter
  repositories in the README, AGENTS.md, the overview, GC-005, the public guides,
  GC-140 and GC-085; Python adapter names `Application`, `Pages`, `mount_pages`,
  `create_application`; serverless floor `@gramlot/gramlot >=0.2.5`; GC-085 records the
  current JavaScript dependencies.
- `f4b8327` the page module with `Page` and `Logic` is the primary page logic in the
  README, GC-055, GC-090 and GC-100; `foo_aux.js` stays the alternative.
- `51a7402` genro-kajenn as the future resource host in GC-065 and GC-210.
- `6e66eed` banners on GC-010, GC-045, GC-060, GC-065, GC-086, GC-087 and GC-215; the
  GC-175 link to the removed runner guide becomes text.
- `f99d495` `docs/02-documentation.md` counts seven public guides, describes the coverage of `Core tests`
  and records that GC-055 names The Gramlot family since 2026-10-01; GC-020 states that
  bindings and controllers are in the core.
- `4accfb9` the theme README names the adapters that serve `/themes/`; `pyproject.toml`
  takes the description of `js/package.json`.
- This record; constitution amendment 11.57 (§7 replaced by the current integration
  repositories, decisions 1–3 above); release 0.2.7: version in `pyproject.toml`,
  `js/package.json` and `jsr.json`, release notes v0.2.7, README version and badge.

Verified 2026-10-05 in the worktree: Python 83 OK; JavaScript 475/475 with
`GRAMLOT_TEST_PYTHON` set; `prepare_docs.py`, Sphinx `-W` and `check_public_docs.py`
PASS; no broken relative link in `docs/`, `docs_llm/`, README, AGENTS.md and the theme
README.

**Closed:** GC-055 was assigned again on 2026-10-01 although GC-005 §010 item 4 forbids
reusing a retired ID. Owner decision of 2026-10-05: The Gramlot family keeps GC-055, as
an explicit exception recorded in GC-005 §010 item 4 and in `docs/02-documentation.md` §4.


<a id="gc-070-695"></a>
## 695 · Released ecosystem audit — 2026-10-12

Block ID: **GC-070-695**.

> **Historical record (2026-10-12):** the audit below records its original
> observations. Chronology correction (2026-10-13): "later the same day" in
> the release-evidence paragraph refers to October 12, the audit day, not
> October 10. The October 10 Source-element auth entry remains correct.
> Current work: [§745](#gc-070-745).

Inspection requested by the owner: "esamina situazione completa gramlot e gli ultimi lavori svolti".
This records observed implementation and verification, not a new architecture decision,
owner acceptance, release authorization or closure of historical debt.

### Delivered work since the previous checkpoint

- October 7: routes left the core; browser responsibilities were organised under
  `gramlot.src`, `gramlot.rpc`, `gramlot.dom` and `gramlot.utl` (release notes 0.2.9–0.2.10).
- October 8: `Host`/`FileHost` became `GramlotServer`/`GramlotFileServer`, with
  aligned Python/JS functionality, `GRAMLOT_DEV`, readable/minified runtimes and
  protocol conformance checks (0.2.12).
- October 9: the single RPC envelope, `source`/`data`, declared endpoints,
  `HttpTransport`, default-deny auth and `dataRpc` landed (0.2.14; constitution 11.58,
  GC-230). `/gramlot/rpc` replaces the old main/source routes.
- October 10: server serialization removes refused Source elements with their
  subtrees and strips `auth` from accepted elements (0.2.15; PR #40, issue #34).
  Both integration repositories subsequently aligned their conformance fixtures.
  Python integration includes Kajenn avatar-tag auth; examples include c09–c11 for dataRpc.
- October 12: declarative `remote` (node method `remote(name, …)`, `RemoteBinding`) and
  `dataRemote` (`RpcResolver` on a genro-bag resolver, `RemoteProvider`) landed in 0.2.16
  (PRs #43–#46; constitution 11.59, GC-095 §105); examples 0.2.11 adds c12–c14 and the
  Chromium check of the three pages on the Python and JS servers passes. No protocol change:
  js-server 0.2.8 and py-server 0.2.7 stay valid.

### Evidence checked on October 12

GitHub latest-release responses at audit time identified core [v0.2.15](https://github.com/gramlot-org/gramlot/releases/tag/v0.2.15),
Python integration [v0.2.7](https://github.com/gramlot-org/gramlot-py-server/releases/tag/v0.2.7),
JS integration [v0.2.8](https://github.com/gramlot-org/gramlot-js-server/releases/tag/v0.2.8)
and examples [v0.2.10](https://github.com/gramlot-org/gramlot-examples/releases/tag/v0.2.10),
all published October 10; later the same day core [v0.2.16](https://github.com/gramlot-org/gramlot/releases/tag/v0.2.16) and examples [v0.2.11](https://github.com/gramlot-org/gramlot-examples/releases/tag/v0.2.11) were published. Registry payloads were not downloaded or requalified.

Local core at `9463c45`: `PYTHONPATH=src .venv/bin/python -m unittest discover -s tests`
passes 125 tests; `GRAMLOT_TEST_PYTHON="$PWD/.venv/bin/python" npm --prefix js test`
passes 523, with zero skips. Initial sandbox runs could not bind localhost; rerunning
with local listener access passed. Existing installed dependencies were used; this
is not a fresh dependency installation or a new browser qualification.

Latest main CI runs on October 10 pass: core
[tests](https://github.com/gramlot-org/gramlot/actions/runs/38039338739) and
[documentation](https://github.com/gramlot-org/gramlot/actions/runs/38039338720),
[Python integration](https://github.com/gramlot-org/gramlot-py-server/actions/runs/38052421294),
[JS integration](https://github.com/gramlot-org/gramlot-js-server/actions/runs/38028348713)
and [examples](https://github.com/gramlot-org/gramlot-examples/actions/runs/38026993134).
No open PR was returned for these four repositories. No active phased plan was
found by the workflow resolver or its reachable-plan inventory.

### Remaining work and document drift

- The 0.2.16 scope recorded in `temp/perimetro-0-2-x.md` (declarative `remote`,
  remote parameters, `dataRemote` on a Bag resolver over the existing RPC envelope) is
  implemented and released (above); out of it by decision: `lazy` loading by DOM
  visibility, `_waitingMessage`, the `tbody` merge, `_resolved`, `_fired`, the alias
  `data(path, remote=…)`.
- `temp/perimetro-0-3-0.md` records component authoring, JSON collections, inputs
  and containers; database widgets stay excluded. Details such as `gridbox` and
  label wrapping remain open. Its rationale that server calls lack a contract
  predates 0.2.14; this does not automatically reopen excluded scope.
- GC-220 and the October 1 local residual-check report remain historical debt
  inventories, not a fresh list of reproduced defects. Reassess each item before
  closing it or treating it as a current blocker.
- README no longer mentions `server.main(pageId)` (corrected with this update: the
  browser requests `POST /gramlot/rpc`, answered by `server.call`); the workspace README
  release table is updated to the October 12 versions.
- Core open issues returned by GitHub: #1 pre-rendering/hydration and #2
  desktop/mobile platforms. The three connected product repositories return no
  open issues. Issue counts do not replace the local design and debt records.
- Devtools has later work than the older PoC applications, but this audit does
  not qualify it against the current core. Site and Rosetta still identify
  themselves as PoC consumers; they are not current-core application evidence.

Next action: the next scope is the owner's to decide (the Kajenn extended client with
WebSocket, push and `serverpath`; the 0.3.0 components; CSP as grammar); GC-220 and the
residual-check report remain debt inventories to reassess item by item.


<a id="gc-070-700"></a>
## 700 · Technical review before the next scope — 2026-10-12

Block ID: **GC-070-700**.

Owner requested a complete analysis of contradictions, duplication and work to
revisit before the next phase. Reviewed core `729c542`, the current Python and JS
contracts, binding/renderer lifecycle, server/auth/transport boundaries, relevant
Node/Bun adapter dispatch and the documentation. This is an analysis: no runtime
source fix, architectural amendment, acceptance or publication is included.

### Reproduced defects

1. **P1 — Cached remote content can contradict current Data.**
   `js/src/binding/remote.js:48-56` compares the current parameters with the last
   mounted response and returns before cancelling a different request in flight.
   Reproduction: A mounted → B requested and held → Data changed back to A → B
   answered. The Data is A but the mounted fragment is B. The latest Data state
   does not win. Resolve before building further remote-dependent features.
2. **P2 — Remote cache identity is incomplete and mutable.**
   The same code does not include the fragment name in its cache key: a `^remote`
   name changing from `first` to `second` with unchanged params leaves `first`
   mounted and sends no request. It also retains live parameter references;
   `sameValue` returns true on identical object references (`:68`). With a
   `remote_filter='^filter'` Bag parameter and `_cachedRemote`, changing
   `filter.id` from A to B sends no new request and leaves A displayed. The
   declared reactive name/parameter behavior needs regression coverage together
   with the request race above.
3. **P1 — Page startup fails on an ordinary HTTP hostname.**
   `js/src/binding/runtime.js:33` calls `crypto.randomUUID()`; the renderer (`:51`)
   and builder references also use it. Chromium 153 was exercised against one
   local server through `127.0.0.1` and a mapped `gramlot-audit.test` hostname.
   Localhost starts; the ordinary HTTP origin reports `isSecureContext=false`,
   `crypto.randomUUID` undefined, and fails before mounting. RpcHandler already
   uses `getRandomValues` explicitly for this environment; that does not fix the
   earlier construction paths. This matters for LAN/remote HTTP development.
4. **P2 — Node/Bun HTTP input handling diverges from GC-230 and Python.**
   `gramlot-js-server/server/src/fetch.mjs:104-107` uses a prefix match for the
   media type and `Request.text()` for decoding. Direct Request/Response probes
   of the actual dispatcher with a real core server return 200 for
   `application/jsonp`, 415 for `Application/JSON`, and 200 for a JSON envelope
   containing byte `0xff` inside a string: the endpoint receives the replacement
   character. Python adapters split the media type and reject decoding errors.
   The correction belongs to gramlot-js-server; extend conformance inputs so
   both implementations exercise the same boundary. Adapter sources unchanged.
5. **P2 — Existing style/class contract debt remains reproducible.**
   GC-210 states "String or null only" (`:458`). Python static rendering accepts
   `class_=['a']` and `style={'color': 'red'}` and prints their Python string
   representations; live JavaScript rejects them as non-scalar. Both accept
   numeric `class_=7`, also outside that written rule. This confirms a GC-220
   item, not a new decision to change the contract. Reconcile validation before
   extending component attribute handling.

### Behavior requiring a contract decision

Two further probes show observable gaps, kept separate from the confirmed defects:

- A `^remote` name set to null leaves an earlier request active and its late
  response still mounts (`remote.js:36`). The null-name cancellation rule is not
  explicitly stated in GC-095 §105; settle it instead of inventing one.
- A live `setAttr({remote_id: 2})` after a literal `remote_id: 1` rebinds but sends
  no request; the DOM stays at 1 (`binding/runtime.js:289-301`). Likewise the
  addition/removal of the remote declaration needs an explicit live-Source
  rule. GC-095 currently promises start and reactive Data triggers; do not
  silently turn this observation into an approved additional trigger contract.

### Duplication and verification concerns

- Request cancellation/completion is implemented separately in SourceHandler,
  Provider's dataRpc branch and RpcResolver. Different owners have legitimate
  lifetimes, so a broad replacement with a generic manager is not justified by
  this review. Review their common cancellation invariants before another
  transport is added; the cached remote race shows why skipping a request must
  still account for the previous one.
- Provider tags and control/code-attribute rules are enumerated across grammar,
  runtime, installation, provider, Source activation and renderer filtering.
  Provider also owns the rpc-only and resolver-only fields in a common class;
  the four subclasses supply only their `kind`. These are concrete maintenance
  concerns for the component phase, not proof that all common code is wrong.
  A bounded responsibility review is preferable to an unapproved new abstraction.
- Python/JS implementations are intentionally separate; shared behavior tests
  matter more than textual deduplication. The binding grammar copies match byte
  for byte, and docs/docs_llm have matching Markdown mirrors and explicit anchors.
- C07 (`js/tests/runtime-bundle.test.js:13`) verifies the two readable bundles,
  not either `gramlot.min.js`, although the default server asset is minified.
  Its claim of checking every served runtime is too broad. This is a coverage
  gap, not evidence that the published minified release is broken.
- GC-070 §015 still contains unmarked pre-binding instructions ("Full reactive
  binding is not implemented", "Stop after S00"). GC-230's capability table
  labels future Kajenn extensions "Realised by", although the inspected
  adapter announces only auth and the latest status lists the extended client
  as a future scope. Distinguish planned ownership from delivered capability.
  Section 695 also says "later the same day" after October 10 for releases
  actually published October 12. These are semantic inaccuracies that Sphinx
  and link checks cannot detect; this review records rather than rewrites them.

### Verification and evidence

- Python suite: 129 passed.
- JavaScript suite: 554 passed, one failure in C07 because the local generated
  readable bundle was stale. Ran `npm --prefix js run build`, then reran C07:
  passed. No runtime source was changed. This is local generated-output drift,
  not evidence of a failed hosted CI or published package.
- Existing Chromium binding check: passed (native controls, lifecycle, CSP,
  and Data srcdoc sandbox), using the current source bundle. The separate HTTP
  hostname startup probe fails as described above.
- Documentation staging, Sphinx `-W --keep-going -n`, public boundary/link check,
  Markdown mirror/anchor comparison and binding grammar byte comparison pass.
- Diagnostic scripts: local ignored `temp/review-20261012/remote-cases.mjs`,
  `http-startup.mjs`, `adapter-inputs.mjs`; logs retained beside them. Six remote
  and startup expectations fail: three cache defects, the confirmed startup
  failure, and the two contract questions above. The stock suite does not cover
  these combinations. The HTTP dispatcher probes are separate.
- This did not requalify every adapter/browser combination, refresh first-party
  dependencies or inspect downloaded registry artifacts. Historical GC-220
  findings not reproduced here remain historical evidence, not newly confirmed defects.

Recommendation: correct the reproduced cache/startup/HTTP defects and close the
style/class contract mismatch before expanding the framework; settle the two
remote lifecycle questions, then choose the next feature scope. Duplication
cleanup must follow agreed responsibilities; this review approves no refactor.

<a id="gc-070-705"></a>
## 705 · Proposed stabilization plan — 2026-10-12

Block ID: **GC-070-705**.

> **Current contract correction (2026-10-13):** declarative `remote` has a fixed
> method name (constitution 11.60, [§755](#gc-070-755)). Earlier reactive-name
> observations, exercises and Q1 are historical records, not current requirements.
> Q1 is outside contract; Q2 remains open only for otherwise permitted Source edits.

**Authorization and state.** Following the review in §700, the owner said
"ok : pianifica". This authorizes preparation of this plan. The sequence below
was initially a proposal. The owner subsequently authorized phase 1 with "si";
see §715 for completed implementation and checks. The owner authorized phase 2
on October 13 with "si" (§720), then phase 3 with "vai con la 3" (§725).
Phases 4–6 remain proposals, and no
amendment, release or deployment is authorized. GC-110 remains the sole completed
0.1.0 execution plan; this proposal does not reopen it.

**Sequence update, 2026-10-13:** the owner requested the teaching/documentation
work planned in §735 before phase 4. This inserts that work without renumbering
the stabilization phases. The overlapping editorial corrections from phase 5
are handled by §735 D2; phase 5 retains responsibility review and Q1/Q2.

**Objective.** Bring the reproduced behavior back into agreement with existing
contracts before adding components or extended transports. Each phase needs
its own observable result and verification. Record implementation, verification
and owner acceptance separately in this checkpoint and its mirror.

### Phase 1 — Remote cache correctness

Implemented and locally verified; owner confirmed the TYTX comparison with "ok".
Evidence and acceptance state: §715.

Scope: `js/src/binding/remote.js`, the existing request ownership in
`js/src/handlers/source-handler.js`, and `js/tests/binding-remote.test.js`.

- Turn the three reproduced cache failures into deterministic regressions:
  A mounted → B pending → Data back to A → B answered; a changed reactive remote
  name with equal parameters; a nested mutation of a Bag parameter.
- Preserve the current declaration as the winning state even when a cache hit
  skips a call. Include the remote name in request identity and prevent cached
  parameters from changing when live Data changes.
- Inspect the owning Bag's existing value/copy/equality contracts before selecting
  the concrete comparison representation. Do not invent a parallel Bag model,
  silently add coercions or edit Bag/Builder; report a missing upstream capability.
  Any new representation or naming decision must be confirmed before implementation.
- Retain the current no-extra-call behavior for an unchanged name and unchanged
  parameters, and cancellation on target removal and false `_if`.

Exit: all three regressions fail on the reviewed implementation and pass on the
correction; unchanged-cache, ordinary latest-request, removal and `_if` tests pass.
Empty names and direct Source attribute changes are excluded pending the decisions
below. No generic request manager is part of this phase.

### Phase 2 — Browser startup over HTTP and served bundles

Authorized by owner "si" on October 13; implemented and locally verified in §720.

Scope: browser identifier creation in BindingRuntime, GramlotRenderer and
GramlotBuilder, using RpcHandler's existing HTTP-capable identifier strategy as
evidence; bundle production and `js/tests/runtime-bundle.test.js`.

- Remove the browser construction dependency on secure-context-only randomUUID
  through one agreed primary strategy supported on ordinary HTTP. No optional
  API detection/fallback chain. Preserve uniqueness and existing identifier uses.
- Add a real-browser regression on a non-loopback HTTP hostname. Exercise startup,
  rendering and builder reference creation, rather than only constructing a mock
  crypto object. Retain the localhost control; check HTTPS when a test origin is
  available and report any untested origin explicitly.
- Extend C07 to both readable and minified runtime copies in the JS and Python
  package resources. Use the canonical build configuration for each variant.

Exit: startup and reference creation pass on the ordinary HTTP origin; all four
served artifacts match their source build; the default minified runtime mounts
the fixture. A new helper name, if needed, must follow GC-225 and its decision rule.

### Phase 3 — HTTP input parity in the owning integration

Authorized by owner "vai con la 3" on October 13; implemented and locally verified in §725.

Core scope: shared server conformance inputs in Python/JS and their tests.
Authorized connected scope: only the HTTP dispatcher, regression tests
and paired documentation in `gramlot-js-server`. No adapter dependency in core.

- Require the exact JSON media type, case-insensitively and with ordinary media
  type parameters; reject lookalikes such as `application/jsonp` with 415.
- Reject invalid UTF-8 with 400 before endpoint execution, including a bad byte
  inside otherwise valid JSON. Apply the boundary to RPC and page-close dispatch.
- Exercise positive JSON inputs, mixed-case media type, charset parameters,
  wrong/missing media type and invalid bytes against the same expected outcomes.
  First prove the new conformance cases against the existing Python adapters.

Exit: matching status/body semantics, with no endpoint call or page closure on
invalid input; the actual Node and Bun adapters pass their relevant integration
checks. Missing Bun availability must be reported as an unverified gate, not a pass.
Do not introduce stricter unrelated protocol rules or change the RPC envelope.

### Phase 4 — Style/class contract parity

Scope: Gramlot-owned Python HTML attribute handling and JS static/live rendering;
`tests/test_renderers.py`, `js/tests/style-shortcuts.test.js` and the corresponding
renderer tests. GC-210's existing string/null contract is the reference.

- Reject list, mapping, boolean and numeric style/class values consistently;
  do not stringify them or widen the contract. Preserve legitimate strings,
  existing style shortcuts and the documented meaning of null.
- Cover initial rendering, reactive updates and null removal where applicable,
  distinguishing deferred binding expressions from evaluated attribute values.

Exit: the same valid/invalid cases agree across Python static, JS static and
JS live rendering; existing renderer and binding checks pass. Report an upstream
responsibility conflict rather than patching a dependency or adding a workaround.

### Phase 5 — Responsibility review, remote decisions and documentation

> **Scope update (2026-10-14):** additional remote-method enforcement and
> CustomTypes integration are deferred by the owner (constitution 11.66, §820).
> The responsibility review continues; Q2 remains undecided and unchanged.

- Inventory request ownership/cancellation in SourceHandler, Provider and
  RpcResolver. Identify common invariants and actual drift; preserve distinct
  lifetimes. Any extraction must have a concrete duplication benefit and an
  owner-approved responsibility/name before coding. A generic manager or a
  rewrite of Provider inheritance is not a default deliverable.
- Map provider tags and code/control attributes to their authoritative grammar
  or owning contract. Report any conflicting enumerations and propose only
  bounded corrections. Intentional Python/JS counterparts are not duplicate
  architecture; protect their behavioral parity.
- Correct the unsupported variable remote method in runtime/tests (§760), in
  accordance with the fixed-method decision (constitution 11.60). Evaluate the
  owner's proposed pointer-acceptance metadata in builder signatures; settle its
  design/ownership before implementation. Q1 is outside contract, not an open
  cancellation decision. **Q2** remains open: should live Source edits to otherwise
  permitted remote declarations or parameters trigger re-evaluation, and what
  lifecycle applies to addition/removal? Record the owner's explicit decision
  before changing that contract; no live-Source trigger policy is presumed.
- Mark stale S00 instructions in §015 as historical; correct §695's October 12
  chronology; distinguish planned Kajenn extension ownership from delivered
  capabilities in GC-230. Update each affected mirror and preserve historical IDs.

Exit: identified contradictions have an explicit disposition, and each remote
question is either confirmed with tests/docs or explicitly deferred by the owner.
This phase cannot silently implement an unresolved lifecycle rule. The repeated
code review may legitimately conclude that no extraction is warranted.

### Phase 6 — Integrated qualification and handoff

After the source corrections: rebuild bundles, then run the full core Python and
JavaScript suites on that same final state. Run the relevant Chromium binding,
remote and HTTP-startup checks, including the minified asset; run the affected
Node/Bun adapter and Python conformance checks. Refresh first-party dependencies
when performing setup/update; never pin them to recover a passing result.

Prepare documentation, run strict Sphinx and public-document checks, compare
mirror IDs/anchors and the paired binding grammars. Check the actual correction
diff for unapproved alternate paths, state, naming and dependency ownership.

Exit: no reproduced defect remains in the agreed scope, all required gates have
results, and no unavailable environment is reported as verified. Record remaining
debt, owner acceptance and next scope explicitly. No version bump, package release,
deployment, new component, extended Kajenn transport, example migration or broad
refactor is included in this plan.

**Next action:** D2 implemented and locally verified (§745); request D3.
Historical D1 checkpoint: inventory complete (§740); authorization was then requested for D2
guide alignment. Complete and obtain acceptance of the teaching work
before proposing phase 4 (style/class contract parity). The other phases and
the two lifecycle proposals have not been accepted merely by being written here.

<a id="gc-070-710"></a>
## 710 · Stabilization phase 1 in progress — 2026-10-12

Block ID: **GC-070-710**.

> **Historical record:** intermediate checkpoint; the comparison decision and
> completion are recorded in §715. The pending statements below describe that checkpoint.

Owner replied "si" to: "Confermi di iniziare dalla fase 1, limitata ai tre difetti
della cache remote?" This authorizes the three cache corrections in §705 only.
No subsequent phase or unresolved remote lifecycle rule is authorized.

Three regression tests reproduce the reviewed defects before correction: 13 pass,
3 fail in binding-remote. The pending B response no longer mounts after returning
to cached A; the fragment name now participates in the mounted-cache identity.
The existing AbortController/current-request mechanism handles cancellation; no
new request manager, alternate transport, public name or dependency edit.
GC-095 and its mirror clarify the corrected cache behavior.

Verification so far: binding-remote, binding-cleanup and binding-lifetime together
43 pass, 1 fail (nested Bag parameter mutation). Normal bundle build and C07 pass.
Phase 1 is incomplete; this is not a full-suite or browser qualification.

Bag inspection: the installed Bag.deepcopy() recursively copies Bags but retains
non-Bag values by reference; Bag.equalTo() does not supply general structural
comparison for mutable objects in values/attributes. This is the documented API,
not a newly proved upstream defect. A consumer-side substitute Bag model is excluded.

Pending owner decision, asked in this task: cache the existing TYTX serialization
of name/parameters and compare serialized content. This would avoid mutable
references; differing object-key order may cause another request. The alternative
is retaining order-independent object equality, whose concrete strategy still
requires agreement. No TYTX cache representation has been implemented or recorded
as accepted. §705 requires confirmation of a new comparison representation under
constitution 11.43; finish independent corrections while this decision is pending.

Evidence logs: /private/tmp/gramlot-phase1-before.log (three reproduced failures),
/private/tmp/gramlot-phase1-current.log (43 pass, 1 fail),
/private/tmp/gramlot-phase1-build.log and /private/tmp/gramlot-phase1-bundle.log.
Next: receive the comparison decision, finish the Bag correction, rerun the
phase's required checks and report before proposing phase 2.

<a id="gc-070-715"></a>
## 715 · Stabilization phase 1 implemented and verified — 2026-10-12

Block ID: **GC-070-715**.

> **Historical record:** phase 1 closure checkpoint. The owner subsequently
> authorized phase 2 with "si"; its completion and the current next action are in §720.

**Owner decision.** After authorizing phase 1 with "si" (§710), the owner replied
"ok" to the concrete question: "Confermi il confronto sul testo TYTX già usato
nelle richieste? Evita riferimenti mutabili, ma un diverso ordine delle chiavi può
causare una richiesta aggiuntiva." This confirms TYTX parameter comparison,
including the stated object-key-order behavior. It does not settle the empty-name
or live-Source questions, approve a later phase or authorize publication.

**Implemented.** RemoteBinding compares the fragment name and the TYTX text of
parameters captured before sending the request. Only a successfully mounted
response becomes the cached request. A cache hit aborts any pending request via
the existing controller; late answers cannot displace the retained fragment.
The old local recursive value comparison is removed. No clone model, Bag/Builder
edit, public API, generic request manager or alternative transport was added.
The private lastName field follows the existing lastParams spelling and ownership;
there is no new class, proxy or public naming convention.

**Regression evidence.** The three original regressions failed before correction
(§710) and now pass: A mounted/B pending/back to A/late B; changed reactive fragment
name; nested Bag parameter change. Additional cases cover objects, arrays, dates
and mutable Bag attributes changed while a response is pending, then an unchanged
repeat. The confirmed reordered-object-key behavior has its own regression.
Existing unchanged-cache, failed-request retry, latest request, removal and false
_if checks remain passing. GC-095 and its mirror document the resulting contract.

**Checks on the corrected source and rebuilt runtime:**

- Remote, cleanup and lifetime tests: 49/49 pass.
- Full JavaScript suite: 563/563 pass, no skips, including current C07.
- Full Python suite: 129/129 pass. The first sandboxed attempt failed because HTTP
  fixtures could not bind localhost (PermissionError and cascading URL errors);
  the rerun with listener access passes. No test or source workaround was applied.
- Existing Chromium 153 binding script: passes controls, lifecycle, CSP and srcdoc.
  The new cache regressions are covered by the Node/JSDOM suite; this browser run
  is not a remote-specific browser matrix or phase 2 HTTP-origin qualification.
- Runtime build, strict Sphinx, public documentation checks, paired document
  anchors and patch whitespace checks pass. C07 still has its previously recorded
  minified-coverage gap; phase 2 retains that work.

Logs: /private/tmp/gramlot-phase1-tytx.log, gramlot-phase1-js.log,
gramlot-phase1-python-verified.log, gramlot-phase1-browser.log,
gramlot-phase1-build.log and gramlot-phase1-docs.log (all under /private/tmp).
The initial sandbox diagnostic remains gramlot-phase1-python.log.

**State and next action.** Phase 1 implementation and local verification complete;
owner acceptance of the result remains pending. Next proposed phase is HTTP
startup and all served bundle variants (§705 phase 2), requiring owner authorization.
No release, deployment or subsequent phase was performed. Object-key order can
cause an extra request by the confirmed rule; no dependency refresh, installed
registry-artifact qualification or full integration matrix is claimed.

<a id="gc-070-720"></a>
## 720 · Stabilization phase 2 implemented and verified — 2026-10-13

Block ID: **GC-070-720**.

> **Historical record:** phase 2 closure checkpoint. The owner subsequently
> authorized phase 3 with "vai con la 3"; its completion and next action are in §725.

**Authorization.** Owner answered "si" to "Confermi il passaggio alla fase 2:
avvio su HTTP e verifica dei bundle minificati?" This authorizes §705 phase 2;
no later phase, adapter change, publication or deployment is implied.

**Implementation.** BindingRuntime's Data subscription, GramlotRenderer's page
identifier and GramlotBuilder's reference identifiers use 16 random bytes from
crypto.getRandomValues, rendered as 32 hexadecimal characters. This is the existing
RpcHandler strategy, available on ordinary HTTP without an optional fallback.
Generation stays local to the three existing owners; no runtime helper, new
public API or naming convention is introduced. Reference reuse and per-page radio
isolation are preserved. Server-only identifier paths were not part of this fix.

C07 now independently checks the readable and minified variants in js/dist and
src/gramlot/resources. Build and test import the same runtime-options.mjs data;
importing it does not build or overwrite the artifacts under examination.
The build's dependency-notice paths resolve from that configured working directory.
The added build configuration and browser verification script follow the existing
build-data camelCase and verify_*_browser.mjs script naming patterns.

**Regression evidence.** The new verify_runtime_browser.mjs serves the actual
four shipped local artifacts to Chromium, using a local hostname mapping for
an ordinary HTTP origin. Before the source correction, localhost passed 4/4
and gramlot-runtime.test failed 4/4 with crypto.randomUUID unavailable. The test
asserts secure-context/API availability, mounts typed Source, creates and resolves
node/DOM references, checks reference stability, reactive Data updates and isolation
between two pages (including generated radio names). It now passes all 8 cases.
The existing Core tests workflow invokes this regression; hosted CI was not run
or observed for these local changes.

C07 also rejected all four pre-rebuild artifacts, identifying each as stale.
After the normal build, the four artifact subtests and their parent pass. This
closes the minified-coverage gap recorded in §700 and §715, without asserting
anything about already published package contents.

**Verification:**

- Full JavaScript suite: 567/567 pass, no skips; includes four C07 artifact subtests.
- Full Python suite: 129/129 pass, using localhost listener access.
- Chromium 153 shipped-runtime checks: 8/8 pass (four artifacts × two HTTP origins).
- Existing Chromium binding/controls/radio/lifecycle/CSP/srcdoc check: passes.
- Normal runtime build, patch whitespace, paired document anchors, strict Sphinx
  and public-documentation checks: pass.

Logs in /private/tmp: gramlot-phase2-browser-before.log (original HTTP failures),
gramlot-phase2-bundle-stale.log (all four stale detections), gramlot-phase2-build.log,
gramlot-phase2-bundle.log, gramlot-phase2-browser.log, gramlot-phase2-js.log,
gramlot-phase2-python.log, gramlot-phase2-binding.log and gramlot-phase2-docs.log.

**Limits and next action.** HTTPS was not exercised; no configured TLS test origin
was used. The localhost secure-context control is not claimed as an HTTPS test.
No dependency refresh, registry-artifact qualification, other browser or full
adapter matrix was performed. Phase 2 implementation and local verification are
complete. Present the result before phase 3, whose HTTP input parity work includes
a bounded correction in gramlot-js-server and requires owner authorization.

<a id="gc-070-725"></a>
## 725 · Stabilization phase 3 implemented and verified — 2026-10-13

Block ID: **GC-070-725**.

**Authorization.** The owner said "vai con la 3" after the proposal to align HTTP
inputs, including bounded gramlot-js-server corrections. Scope remains §705 phase 3;
no new RPC envelope, host dependency in core, publication or deployment.

**Implemented.** The Node/Bun dispatcher parses the exact media type before any
semicolon, trims it and compares case-insensitively to application/json. Missing,
empty and prefix-lookalike types are rejected with 415. Both RPC and close bodies
are decoded with fatal UTF-8 validation; malformed bytes answer 400 before invoking
an endpoint or closing a page. Valid multibyte UTF-8, mixed-case media types and
charset parameters remain accepted. Core's Node reference fixture had the same
replacing-decoder issue, exposed by the new conformance cases; it now rejects
invalid UTF-8 as well. No Python adapter source needed correction.

Both core conformance implementations now exercise the same new cases for RPC
and close: rejected text/plain, lookalikes and empty types; malformed bytes within
otherwise valid JSON; accepted mixed-case types, whitespace and charset parameters.
The subsequent valid calls also check that a rejected close has not removed the
page. Adapter regressions additionally cover genuinely absent headers, valid
multibyte bodies, error responses, endpoint invocation counts and page survival.
Core GC-230 and both adapter reference views document the boundary.

**Evidence and environment.** Before correction, 8 of the first 16 adapter
boundary tests failed; the reference-node conformance runs failed on replacement
of invalid UTF-8. Existing Python reference conformance passed. Adapter setup held
core 0.2.14: cross-checking it with today's complete conformance failed the later
Source-auth rule, after the new HTTP checks passed. Linked the current local core
through npm install --no-save --package-lock=false --ignore-scripts with its local
file specifier; no manifest/lockfile change or dependency-source patch. Both runtimes
then passed the complete current Python and JS conformance, at / and /js. The local
link remains the verification environment; no old dependency version was restored.

Final verification:

- Full core JavaScript: 567/567; full core Python: 129/129.
- Full server adapter suites on current core: Node 33/33, Bun 33/33. These include
  18 HTTP boundary cases (nine inputs × RPC/close), quick start and gallery tests.
- Current Python and JS conformance on actual Node and Bun: both mount cases pass.
- Five existing Python adapters: Uvicorn, Django, Flask, FastAPI and Kajenn;
  10 parametrized conformance tests pass (root and mount/policy, each on two pages).
- Chromium 153 browser harness and gallery harness pass for both Node and Bun;
  each installed gallery checks 33 examples, page/frame/theme and named logic.
- Core strict Sphinx/public checks, adapter paired-guide validation and both
  Sphinx views, mirrored anchors and whitespace checks pass.

An intermediate Bun run concurrent with the documentation builds exceeded existing
5-second test timeouts and produced follow-on runner errors. The complete isolated
rerun passed 33/33 with unchanged timeouts and sources; retain the failed run as
an environment-sensitive verification limit, not a silently removed test. Playwright
used the installed Chromium executable through a temporary launcher entry; product
sources were not adapted to the test environment.

Evidence in /private/tmp/gramlot-phase3-*.log: adapter-before, reference-before,
python-reference, python-adapters, node-current, bun-current (timeout run), bun-final,
node-conformance, bun-conformance, js, python, node-browser, bun-browser,
node-gallery, bun-gallery, adapter-docs and docs. Temporary conformance/Playwright
launchers are beside them. No hosted CI or registry-package qualification claimed.

**Next action.** Phase 3 implementation and local verification complete. Present
results and obtain authorization for phase 4: the existing style/class string/null
contract across Python static, JS static and JS live rendering. Remaining remote
lifecycle decisions and broader responsibility review retain their separate gates.

<a id="gc-070-730"></a>
## 730 · Documentation and example coverage review — 2026-10-13

Block ID: **GC-070-730**.

Owner asked whether documentation and examples are perfect, show everything and
explain everything clearly. This is a local content/coverage review, not approval
to start phase 4 or edit the examples/integration documentation. Conclusion:
the collection has substantial coverage but is neither complete nor fully aligned.
No editorial correction or example behavior change was performed in this review.

**Inventory.** Current gramlot-examples catalogue contains 38 common pages:
13 HTML/SVG, 11 binding and 14 controllers. Every entry has its Python page,
JavaScript counterpart and same-name Markdown explanation. Existing examples
include RPC successes/errors, unauthenticated endpoints, remote fragments and
Data resolvers; these are real coverage, not missing features.

**Concrete issues:**

- Current adapter guides still say Source methods/remote are not yet part of the
  page-writing API and will arrive with remote. Examples: gramlot-js-server
  docs/015-writing-pages.md:105 and docs/030-reference.md:72; gramlot-py-server
  docs/010-writing-pages.md:118, plus its introduction and per-framework guides.
  This contradicts the current core GC-095 §105 and examples c12–c14.
- Core GC-095's introductory example list still stops at c08 and its release
  overview stops at §100, although §105 and c09–c14 now exist. GC-020's overview
  remains framed around 0.2.0 and excludes resolvers without directing the reader
  to the subsequent dataRemote capability. Preserve dated facts but clarify
  the present scope and entry-point navigation.
- c13's explanation still compares parameters to the last request, omitting
  name, successful mount, TYTX comparison and cancellation on a cache hit agreed
  in phase 1. Its visible "Requests" count is incremented by _onRemote: it counts
  mounted fragments, not actual HTTP calls. Its browser assertion checks that
  mount counter, not an independent transport request count. The sample does
  not demonstrate delayed responses, reactive name changes or Bag mutation.
- c14 explains cacheTime variants but demonstrates only cacheTime=5 and argument
  changes. It does not provide a distinct exercise for expiry followed by a read,
  cacheTime=0, endpoint failure or cancellation. These are demonstration gaps;
  they do not imply the core lacks tests or implementations for those rules.
- GC-095 explicitly lists features without examples: js_requires groups,
  named connect_on handlers, _userChanges, _onBuilt, #ANCHOR and gramlot.utl.inout.
  The common pages contain no inout calls. This is not a claim that separate
  integration tutorials contain no inout examples. The common auth example c11
  demonstrates unauthenticated refusal, not an authenticated allow/deny scenario
  or Source-element exclusion.

**Verification boundary.** The phase 3 adapter gallery run used its installed
catalogue: 13 HTML/SVG + 11 binding + 8 controllers = 32 common examples, plus one
runtime-specific page, hence 33 reported. It does not reverify c09–c14 in the
current 38-page catalogue. The current examples browser script explicitly checks
those pages, and earlier dated release checks remain evidence; this review did
not rerun all 38 on the corrected core. Phase 3's HTTP-specific tests retain their
own verified scope. Sphinx/link/mirror checks establish structural consistency,
not explanation accuracy, complete feature coverage or reader comprehension.
No online documentation deployment was inspected during this local review.

**Recommendation, not a newly approved phase.** Reconcile core/adapter entry
points and dated statements; update c13's terminology and contract; map supported
features to guide sections, demonstrations and behavior tests; explicitly mark
uncovered/deferred cases; qualify the current catalogue on the intended core.
Use an editorial walkthrough of the learner path (setup → first page → Data →
controllers → RPC → remote → errors) in addition to automated tests. No blanket
claim of "everything explained" is justified before those checks.

<a id="gc-070-735"></a>
## 735 · Documentation alignment and teaching examples plan — 2026-10-13

Block ID: **GC-070-735**.

> **Current contract correction (2026-10-13):** declarative `remote` has a fixed
> method name (constitution 11.60, [§755](#gc-070-755)). Earlier reactive-name
> observations, exercises and Q1 are historical records, not current requirements.
> Q1 is outside contract; Q2 remains open only for otherwise permitted Source edits.

**Owner instruction:** "ok pianifica il lavoro per allineare la documentazione e
completare gli esempi, prima di passare alla fase 4" and "l'importante è l'aspetto
didattico per chin deve usare gli esempi per apprendere". This authorizes planning,
sets teaching quality as the priority and places this work before stabilization
phase 4. It does not authorize implementation of the proposals below. Planning is
complete. The owner subsequently authorized D1 with "\ùprocedi"; its completed
inventory and verification are in §740. The owner subsequently authorized D2
with "si" and clarified the chronological teaching structure (§745). D3–D6
execution and owner acceptance of the teaching work remain pending.

**Outcome.** A developer can start a page, understand Source/Data and browser/server
responsibilities, change an example deliberately, predict its result and build a
small page using the same mechanisms. Completion means evidenced coverage of the
agreed, implemented author-facing scope, with explicit exclusions; it does not
mean demonstrating every HTML element or internal implementation detail.

### Chronological teaching structure — owner clarification, 2026-10-13

Release sequence is the primary learning structure. A recurring example is an
intentional comparison: retain its earlier stage and then show which code the new
feature replaces or eliminates, why, and whether the visible result is unchanged.
Do not silently modernize the earlier lesson into the later one. Prerequisite maps
and concept indexes support this sequence. Package versions have independent
numbering; name the core milestone separately from the example package's release.
Current catalogue entries are maintained pages, not frozen runnable snapshots.

This supersedes the earlier proposal to use a cross-release concept route as the
primary order. D3 labels and preserves the stages; D4 places each gap at the release
where its feature entered; D5 returns to the same complete page in later stages;
D6 checks the before/after claims as well as the final result. No runtime or gallery
schema change, new example key or additional phase is authorized by this clarification.

### Teaching standard proposed for every example

Use a short, consistent explanation, with Python first and equivalent JavaScript:

1. A concrete learning objective and prerequisites, linking earlier examples.
2. Where it runs, how to open it, and what appears initially.
3. The relevant declarations explained, identifying which code runs on the server
   and which runs in the browser. Explain new terms before using them.
4. A guided action, its expected visible result and why it happens in Source/Data.
5. A small modification or prediction exercise, followed by its expected outcome
   or explanation so the learner can check understanding without guessing.
6. A likely mistake, the relevant limitation, reference link and next lesson.

Keep basic lessons focused on one new idea; compose already explained ideas in
advanced lessons. Separate ordinary use from advanced timing/failure cases. Match
UI labels and explanation to what is actually measured. Avoid making internal
test instrumentation part of the application or requiring internal documents to
follow the beginner path. Code, screenshots if used, and prose must agree.

### D1 — Coverage inventory and learning path

Map every supported author-facing capability to its authoritative contract,
current guide section, example, learning objective, exercise, observable check,
language/environment and gap status. Start with all 38 catalogue entries and
GC-090/095/100, supported binding/server contracts and active adapter guides;
do not infer completeness just from the previously identified missing examples.
Classify each row as covered, explanation incomplete, demonstration missing,
environment-specific, deferred or blocked, with a concrete disposition.

Original topic map (secondary index after the owner clarification above):
setup and first page → static HTML/SVG → Data and paths →
reactive controls → formulas/controllers and named Logic → events/lifecycle →
RPC and errors → remote Source → Data resolvers/cache → a complete small page.
Offer a short essential path, then advanced exercises and reference material.
Use one reproducible Python setup first (proposed: Uvicorn), with separate
JavaScript/other-environment instructions; avoid presenting every setup choice at
once. Reuse stable example keys and links, without renumbering the collection.

Deliverable: the coverage matrix, prerequisite map and bounded list of lessons
to revise/add, including explicit destinations and contract references. Allocate
new names only through GC-225 and GE-010 conventions; missing conventions require
an owner decision. Present the inventory before implementing D2–D5.

Exit: every existing example and supported topic has an assigned learning role
or explicit exclusion; no unexplained coverage claim or unresolved example scope.

### D2 — Reconcile guides and entry points

Align core public orientation, GC-090/095, examples introductions and Python/JS
adapter writing/reference/troubleshooting guides. Remove current statements that
call implemented remote APIs future work; distinguish remote Source from lazy
Data and from unrelated, still deferred resolver features. Explain Source/Data/DOM
and Page/Logic once in the appropriate guide and link to that explanation.
Adapter guides own setup/environment differences; they link shared teaching
material instead of maintaining copied suites or duplicate framework contracts.

Preserve dated historical text under a Historical record banner with a current
pointer. Absorb the editorial items previously assigned to §705 phase 5: §015's
obsolete instructions, §695's chronology and GC-230's planned/delivered Kajenn
claims, using dated corrections where necessary rather than rewriting history.
Update paired documents and preserve anchors. Current release numbers remain in
repository READMEs/badges; distinguish published behavior from local development
corrections, especially phase 1 cache behavior, without implying a new release.

Exit: a reader can navigate setup → lesson → reference without conflicting
instructions, hidden prerequisites or dependency on internal migration records.

### D3 — Make the existing examples teachable

Review all 38 pages and their explanations against the teaching standard. Improve
family introductions, descriptions and cross-links within the existing gallery.
Keep the Python/JavaScript behavior equivalent and show the Logic companion when
the Python page needs browser code. Preserve useful visual presentation without
adding decorative behavior that hides the lesson.

Prioritize c09–c14. For c13, label _onRemote counts as mounted fragments; describe
cache identity as name plus the TYTX snapshot of parameters of the successfully
mounted response. Explain that this is a last-result cache, including the
key-order limitation. Verify skipped requests through independent test observation,
not by treating mount counts as network counts. Put delayed A/B/A responses,
Bag mutation in advanced exercises with observable results. The originally
proposed name-change exercise is excluded by the owner decision in §755.

For c14, separate declaration, first read, response and later refresh. Show expiry
followed by another read (expiry alone is not a timer refresh), cacheTime=0 and
one-time caching, reactive arguments, failures and lifetime/cancellation using only
the supported contract. Do not attach dataRpc-only callbacks to dataRemote or
invent an error UI API to make the exercise possible.

Exit: each page has a guided trial and self-check; explanations match the actual
behavior, and advanced cases do not overload introductory lessons. Any exposed
runtime defect is recorded and the affected exercise is blocked, not worked around.

### D4 — Fill the demonstrated coverage gaps

Use the D1 matrix to add a focused lesson only when extending an existing one
would mix unrelated concepts. Candidate work, subject to that inventory:

| Topic | Learning result and placement constraint |
| --- | --- |
| Named connect_on handlers | Explain dotted group.method dispatch and its resource-group prerequisite in c07; the runnable named-event lesson belongs with genro-kajenn resources, not the common FileServer gallery (D1 finding, §740). |
| _userChanges | Compare writes to the exact registered path with replacement of its container or changes below it; programmatic writes to the exact path also trigger. This is path-level filtering, not user-versus-code detection (D1 correction, §740). |
| _onBuilt and lifecycle | Observe the supported order and removal/cleanup behavior; distinguish it from _onStart. |
| #ANCHOR and paths | Resolve symbolic and relative paths without confusing Data, Source and DOM identity. |
| gramlot.utl.inout | Save/restore typed Data and export it; cover other supported operations with explicit environment requirements, local fixtures or guided manual checks, without real email or external-service side effects. |
| auth | Explain default refusal, protected Source omission and the distinction from browser visibility; authenticated allow/deny belongs in an environment with an existing identity integration, not a new login system in common examples. |
| Resources | Teach Page.css and same-name CSS/Logic in the common gallery. Named css_requires/js_requires and groups require genro-kajenn's resource host; the kajenn adapter alone does not supply it. Record that separate dependency rather than adding resource loading to FileServer or the current adapters. |

Each supported common capability must end with a working demonstration and check;
environment-specific and unavailable capabilities need an explicit location/status
and next action, never a false "covered" mark. Scope outside the four Gramlot
repositories requires separate authorization. If an approved capability cannot be
demonstrated with existing APIs, stop that affected work and report its owner.

Exit: each identified gap is demonstrated or explicitly blocked/deferred for owner
review. A known limitation alone does not count as completed example coverage.

### D5 — A guided complete page

Revisit an existing complete-page/end-to-end example in later release stages,
preserving its earlier local-only stage and comparing the code at each step. Compose a small, domain-neutral page in explained steps: initial Data, editing,
computed result, a user action, a server answer and an error outcome. Explain when
to choose dataRpc, remote or dataRemote through related variations rather than
forcing all three into one oversized page. Use only Source, Bags, bindings,
controllers and the supported server contracts.

The learner should be able to change one requirement (for example a filter or
computed field) from the material already taught. Include an expected result and
explain the reasoning. Reuse earlier examples instead of introducing hidden helper
code, a parallel state system or an application framework solely for the tutorial.

Exit: the complete exercise needs no unexplained API or internal guide; both
language versions illustrate the same application responsibilities.

### D6 — Runtime qualification and editorial walkthrough

First establish the actual installed core/examples state in every test environment,
refreshing first-party dependencies during setup/update without pins or edits to
installed source. Run all current catalogue entries, including c09–c14 and new
ones, through the examples repository's Python/JS checks and real Chromium pages.
Derive the expected list from the catalogue and fail on omitted entries; the old
33-page adapter result is not an adequate target. Check behavior, not just loading.

Verify gallery delivery on Node/Bun, the five Python adapters and Worker/static
export for their supported scope. Keep an explicit per-environment checklist of
executed examples, commands, outcomes and unsupported cases. Validate changed
adapter instructions from a clean local setup. Tests of teaching examples stay
downstream; core CI never depends on examples/adapters. Exercise timing races
deterministically in tests and check real browser behavior separately. Interactive
file/download/mail flows get safe local checks plus recorded manual limits.

Run each repository's required documentation/build checks, paired anchors/links
and package-content checks when teaching assets change. Do a separate editorial
walkthrough from installation through the final exercise using only reader-facing
instructions. Check rendering of explanations, source visibility, prerequisites,
expected outcomes, common mistakes and links in the gallery. Record findings and
recheck corrected steps. An agent walkthrough is not evidence of novice-user
comprehension; present representative beginner, remote/cache and complete-page
lessons for the owner's didactic review.

Exit: no unresolved contradiction in the agreed scope, no unexplained missing
example, all required checks accounted for, and teaching acceptance recorded
separately from automated results. Unavailable checks or blocked topics remain
visible and require explicit disposition before declaring this work complete.

### Boundaries and return to stabilization

Core owns framework guides and contracts; gramlot-examples owns common teaching
pages, READMEs, catalogue and gallery; gramlot-py-server and gramlot-js-server own
environment setup and integration-specific examples/checks. D1–D6 do not authorize
core runtime work, dependency-source changes, an authentication/resource system,
new gallery components, release, deployment or external service actions.

Phase 4's style/class mismatch stays visible: teach only the agreed string/null
path and record the pending parity correction, without normalizing invalid values
or claiming it is fixed. Q1/Q2 from §705 stay unresolved; exercises must not choose
empty-name or direct Source-mutation semantics on the owner's behalf. Existing
runtime corrections must be distinguished from published artifacts in the evidence.

After each authorized step, update this status and mirror with implemented,
verified, blocked and accepted work. D6 acceptance precedes a separate request to
start phase 4. Phase 5 retains technical responsibility review/Q1/Q2; phase 6 still
qualifies the final stabilization changes and reruns affected teaching checks as
needed. This does not duplicate or reopen the completed GC-110 release plan.

**Next action:** D1–D3 implemented and locally verified (§740–750). The owner
excluded variable remote methods (§755); there is no blocked name exercise to
complete. Ask to start D4; D5/D6, owner acceptance and stabilization phase 4 remain
pending. Track the unsupported runtime/test behavior separately as a technical
nonconformity, not an authoring extension.

<a id="gc-070-740"></a>
## 740 · Teaching coverage inventory and learning path (D1) — 2026-10-13

Block ID: **GC-070-740**.

> **Current contract correction (2026-10-13):** declarative `remote` has a fixed
> method name (constitution 11.60, [§755](#gc-070-755)). Earlier reactive-name
> observations, exercises and Q1 are historical records, not current requirements.
> Q1 is outside contract; Q2 remains open only for otherwise permitted Source edits.

**Authorization and result.** Owner "\ùprocedi" answers the request to start D1
(coverage map and learning path). D1 is completed as a local source/documentation
inventory. This does not authorize D2–D6 or stabilization phase 4. Proposed lesson
destinations below are reviewable work items, not accepted implementations.

### Evidence and reading conventions

Inspected the catalogue, all 38 example READMEs, Python declaration attributes,
relevant paired source and test bodies, GC-090/095/100, binding/server contracts
and active integration tutorials. Recorded checkout reference points: core
`729c542153ed`, examples `4c494800521b`, Python server `783de4298618`, JS server
`e14a9b867741`, plus existing local stabilization changes. These identify evidence,
not dependency pins or claims about the deployed documentation. No browser, runtime
suite, installation or external service was run for D1.

Source index: [example catalogue](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/catalog.json),
[teaching pages](https://github.com/gramlot-org/gramlot-examples/tree/main/src/gramlot_examples/pages),
[example tests](https://github.com/gramlot-org/gramlot-examples/tree/main/tests),
[browser checks](https://github.com/gramlot-org/gramlot-examples/tree/main/scripts).
The catalogue resolves each stable key to `pages/<family>/<folder>.py`, `.js`,
`.md` and any `.css`; D3 destinations in the inventory mean those existing files
and their catalogue description, not copied examples in core or adapters.

Guide keys below: **G90** = [GC-090](../public/090-classes-and-hosts.md), **G95** =
[GC-095](../public/095-writing-pages.md), **G100** =
[GC-100](../public/100-extensions.md); numbers identify their existing sections.
Authorities: constitution §§3, 9, 13 and amendments 11.48–59;
[GC-210](210-binding-contract.md) §§010–050, with later supersessions;
[GC-225](225-naming-and-proxy-conventions.md); [GC-230](230-server-protocol.md)
§§010–045. An obsolete sentence is not authority over a later approved rule.

Coverage labels: **C** = the stated narrow teaching slice exists; **E** = an
example exists but its explanation/exercise is incomplete; **M** = no runnable
common demonstration of this slice; **H** = environment-specific; **B** = blocked
by an unresolved contract/known mismatch; **F** = deferred feature; **R** =
advanced reference, explicitly outside the common application-gallery curriculum.
These labels concern teaching, not feature implementation or test success.

Existing check labels (read, not rerun): **P** = Python `tests/test_pages.py`
opening and Source; **L** = Chromium `scripts/verify_pages_browser.mjs` startup for
both languages; **J** = the keyed behavioral case in `tests/examples.test.js`
(JS/jsdom); **W** = keyed real-browser interaction in `verify_pages_browser.mjs`;
**S** = Python endpoint/fragment cases in `test_pages.py`; **V** = dedicated
`verify_e10_e13_browser.mjs`. P/L cover all 38; J covers b01–b11 and c01–c14;
W covers b08, c03, c08–c14; S covers c09–c14; V covers e10/e13.
Most pages therefore have no dedicated real-browser exercise beyond startup.
The current W/J dispatch uses optional keyed checks: a new catalogue entry can
pass startup without receiving a behavioral check. D6 must detect that omission.

### Existing 38 lessons: role, prerequisites and observable exercise

Every row needs D3's concise prerequisite, explained outcome, mistake and next-step
links; **E** does not mean the existing example is unusable. Exercises below are
the concrete D3 target, not a claim that the current README already teaches them.
Prerequisites refer to earlier concepts, not necessarily numerical catalogue order.

| Key / lesson | Prerequisites | Learning objective and observable exercise | Guide | Existing checks beyond P/L; disposition |
| --- | --- | --- | --- | --- |
| e01 Hello World | Python basics; setup | Add a second paragraph, reload and locate its Source declaration and rendered text; explain main(root). | G95 005–010 | E: first lesson; explain edit/run/reload loop. |
| e02 Text and links | e01 | Add an inline emphasis and local link; navigate to its target and distinguish literal text from markup. | G95 005 | E: explicit expected structure and external-link limit. |
| e03 Lists | e01 | Add a fourth record; predict and count the generated items; distinguish Python iteration from browser reactivity. | G95 005 | E: establish data-at-build-time vocabulary. |
| e04 Semantic page | e02 | Add an article and navigation target; follow the link and identify landmarks. | G95 005 | E: optional HTML composition branch. |
| e05 Tables | e03 | Add a row and recompute the total on reload; no reactive update is implied. | G95 005 | E: expected arithmetic and heading/caption roles. |
| e06 Forms | e02 | Edit then Reset; compare restored authored values; explain labels and disabled Submit. | G95 070 | E: distinguish native form behavior from Data binding. |
| e07 Native disclosure | e03 | Expand a question and change a fixed meter value; identify browser behavior without a controller. | G95 005, 070 | E: optional native HTML branch. |
| e08 SVG shapes | e01 | Move a shape by one coordinate and explain viewBox, geometry and paint. | G95 025 | E: include expected movement, not just code comparison. |
| e09 SVG composition | e03, e08 | Add a grouped object; predict how its local transform positions all children. | G95 025 | E: advanced SVG composition. |
| e10 Cards with icons | e03, e08; c07 event basics | Remove the middle card; Source/DOM counts decrease and reload restores it. | G95 035, 075 | V; E: move to advanced Source path, explain node_label versus node_id/id. |
| e11 Static report | e05, e08 | Change one record; reconcile table, summary and chart after reload. | G95 005, 025 | E: static composition checkpoint. |
| e12 Complete page | e04, e07, e09 | Add a session, speaker and map stop consistently; explain helper methods without assuming a booking service. | G95 005, 025 | E: optional static capstone. |
| e13 Live Source | e10, c07; lifecycle introduction | Add/update/remove nodes; remove animation and observe timer cleanup, distinguishing semantic removal from DOM operations. | G95 035, 080 | V; E: advanced, not prerequisite to first binding lesson. |
| b01 Pointers | e01, e03; brief setter introduction | Change caption: ^ follows, = keeps initial projection; then inspect relative, #node_id, #FORM and ?attr reads. | G95 040, 045 | J; E: split basic and symbolic exercises; add #parent/#ANCHOR in D4. |
| b02 Variable datapath | b01, b04 | Rename Alan, select Grace and return; edited record persists in Data; advanced empty-context read/write case. | G95 040 | J; E: explain record context and null-path boundary. |
| b03 Setters/defaults | b01 | Remove the later setter, then set quantity to zero; predict value versus default; compare null installation with a runtime write. | G95 045–050 | J; E: include literal strings, attributes and no reinstall. |
| b04 Native editing | e06, b01 | Compare change/input timing, clear a number, select multiple values and inspect Data types. | G95 070 | J; E: a small type table and native edge-case exercises. |
| b05 Checkbox/radio | b04 | Choose Team then Basic; predict booleans, initially absent values and per-page grouping. | G95 070 | J; E: programmatic change and instance-isolation explanation. |
| b06 Style/visibility | b04 | Compare CSS shortcut precedence, null removal, visible and hidden by observing layout. | G95 070 | J; E/B: teach agreed strings/null; phase 4 rejection parity still pending. |
| b07 Bound SVG | e08, b04 | Add a cy range; predict SVG movement from Data without reconstructing DOM. | G95 025, 070 | J; E: give expected range/position and units. |
| b08 Freeze | c03, c06, e10 | Freeze, delete, change Data, thaw; Source changes immediately, rendered structure updates at thaw. | G95 030, 080 | J/W; E: explain immediate handler cleanup under frozen DOM. |
| b09 Forms with binding | e06, b03–b05 | Compare static values with the bound record; explain file/password and why native Reset is absent. | G95 045, 070 | J; E: guided static-to-reactive comparison. |
| b10 SVG with binding | e08, b07 | Bind circle cx to a new range and predict its position; compare with the static original. | G95 025, 070 | J; E: optional visual practice. |
| b11 Complete bound page | e12, b05–b07 | Edit title, hide a speaker, select a map stop; explain why visible leaves layout space. | G95 040, 070 | J; E: bound composition checkpoint. |
| c01 Formula | b03, b04 | Change VAT alone, then quantity; explain ^ trigger versus = reread and result chaining. | G95 055 | J; E: separate first formula from _if/_else and chain exercises. |
| c02 Controller | c01 | Validate a field, fire twice, type rapidly and stop an interval; distinguish effects, debounce milliseconds and timing seconds. | G95 055, 065 | J; E: basic effects first; timing and _userChanges advanced. |
| c03 Named logic | c01; c02 effects concept | Move equivalent behavior to Logic; 120 becomes 108, explain function arguments/this and browser execution. | G95 060; G90 030 | J/W; E: recommended implementation immediately after concepts, before complex inline code. |
| c04 Inline expressions | c03 | Cross score 50 and observe text/class/disabled changes; distinguish == from pointers and JS templates. | G95 065 | J; E: optional inline/CSP lesson, not the default authoring path. |
| c05 Node methods | c02, c06 click basics | PUT then GET then SET: distinguish stored Data from projection; fire equal values and cancel a delayed fire by removal. | G95 065 | J; E: explicit value/event timeline. |
| c06 Button controller | c02 basics, c03 | Click with Shift and compare counters/modifiers; explain one mechanism and form submission defaults. | G95 075 | J; E: add negative combination and Enter/type caveat. |
| c07 Events | c03, c06 | Click a descendant and inspect declaring node versus event target; remove it and verify the listener stops. | G95 075 | J; E/H: inline common lesson; named dotted handlers require resource groups. |
| c08 End-to-end story | b03–b05, b07, b08, c03, c06 | Predict initial values and run the seven-step lifecycle; extend in D5 with a server result and error after c09/c11. | G95 080, 100 | J/W; E: currently no RPC/remote despite broad “every piece” wording. |
| c09 Endpoint | c03, c06; server/browser distinction | Change price/rate and reload; 12.5 and 22 produce 15.25; distinguish endpoint call from main request. | G95 100 | J/W/S; E: explain kwargs, typed result and Worker versus HTTP transport. |
| c10 Call on change | c02 timing, c09 | Type 12: after debounce result becomes 96; advanced delayed-answer/timeout exercise proves latest wins. | G95 100 | J/W/S; E: current checks demonstrate debounce, not reordered replies. |
| c11 Call on click | c06, c09 | Trigger application_error and not_authenticated; output remains unchanged; add server-side protected Source omission. | G95 100; G90 020 | J/W/S; E/H: authenticated allow/deny is a Kajenn lesson. |
| c12 Remote | c09, b01 | Select Chair: replace the fragment with Chair/12 in stock; contrast Source and an endpoint value. | G95 015, 105 | J/W/S; E: explain nested fragments and removal/error boundary as advanced cases. |
| c13 Cached remote | c12, b02 | Lamp→Spotlight retains rules; Chair mounts new rules; compare mount count and independently observed request count. | G95 105 | J/W/S; E: fix inaccurate label/cache explanation, then advanced cache races. |
| c14 Data remote | c09, c10, c12 distinction | Read menu then change table; separate first-read trigger, response and later reads; add explicit cache-mode exercises. | G95 105 | J/W/S; E: current demonstration only cacheTime=5 plus argument change. |

### Capability-to-guide/demo/check matrix

The following rows cover the current application authoring surface and explicitly
classify the advanced APIs advertised by G90/G100. Tests named here are core files
under `js/tests/` unless a Python/adapter path is given. They are evidence that a
case has an executable specification, not evidence of a new D1 test run. Each
row's observation is the required teaching/self-check target for D3–D6.

| Capability slice | Contract / current guide | Current demo and coverage | Concrete disposition and observable check |
| --- | --- | --- | --- |
| Installation, gallery, edit/reload, development mode | G90 017/022; GP-020/105; GN-110; GS-135 | H/E: environment tutorials; e01 has no self-contained setup | D2 links one Python/Uvicorn route plus JS alternatives; distinguish gallery browsing from editable local page. Check clean start and one saved change; adapter project/tutorial tests. |
| Page/main, typed Source, Data versus DOM, fresh server Page per call | Constitution §§3–4; G90 015–020; G95 005–010 | C for static build e01–e12; E for execution model | D2/e01/c09 diagram and trace; page fields are not session persistence. Source contract and server tests. |
| HTML/SVG nesting, loops/helpers, labels, naming escapes | G95 005/025; GC-225 | C/E: e01–e12 | D3 explains html_main/html_label/class_/for_, node_label/node_id/id; static/DOM tests plus exercises above. |
| Literal text, native data_/aria_/xmlns_, SVG namespaces/foreignObject | G95 025/070; GC-210 030 | E: text/SVG examples; M for focused dialect-boundary exercise | Extend e02/e08; demonstrate safe text and HTML inside SVG; svg/source/renderer tests. |
| Page.css, companion stylesheet/module, public Logic imports | G90 030; G95 060 | C/E: every Page.css, c03; H: adapter tutorial companions | D2 explain ready URLs, CSS order, module visibility and browser-safe imports. page-resources/bootstrap tests. |
| css_requires/js_requires and named resource groups | Constitution 11.57; G90 030 | H/M: no resource host in common gallery | Reference-only prerequisite plus external genro-kajenn delivery; no fake group registration or adapter loader. page-resources/named-logic specs do not supply that host. |
| Literal dataSetter, dict→Bag, list/string preservation, null R1 and Data attributes | G95 045; GC-210 035 | C for basic b02/b03; E for boundaries | Extend b03: 7 followed by null stays 7, runtime SET null differs, pointer-looking strings stay literal. data-installation/binding-defaults/Python authoring tests. |
| Defaults/default_value/default_<attr>/attr_* and installation order | G95 050/080 | C/E: b03/c08 | b03 before/after prediction incl. 0/false/empty string; no reinstallation on thaw. binding-defaults/installation tests. |
| ^ versus =, relative/absolute and ?attr paths | G95 040 | C/E: b01/c01 | b01 basic route first, then compare projection-time = with provider rereads. binding-projection/providers tests. |
| #node_id/#FORM versus #parent/#ANCHOR | G95 040; GC-210 012/018 | C for first pair b01; M for latter pair | Extend b01 advanced pane: nested context and anchor read same named field from different origins. G95's “every ... symbolic origin” claim is inaccurate. projection/source-extension tests. |
| Variable datapath and null context | G95 040; GC-210 018 | C for b02 selection; M for empty context | b02: empty selection reads null, attempted write is explicitly rejected; no silent replacement. binding-projection Q7 cases. |
| Bare destination/result paths, forbidden ?attr destinations | G95 040/045/055/100/105 | E: bare paths used, invalid cases not taught | D2 callout/b03 exercise; authoring validation tests; deprecated prefix stripping is not the teaching path. |
| Text, number/range, temporal, select/multiple, color value types | G95 070; GC-210 050 | C/E: b04/b09; no full boundary walkthrough | b04 advanced empty/invalid/missing-option/IME cases; lexical date, no Date coercion; native-controls tests. |
| live timing, correction echo, type/multiple rebuild | G95 070 | C for live b04; E/M for correction/rebuild | b04 compare input/change and a controller correction after c03; native-controls/projection tests. |
| Checkbox/radio booleans, group isolation and conflicting initial true | G95 070 | C/E: b05 | Guided same-path programmatic choice and two-page isolation; boolean-controls tests. |
| Literal/default reset versus bound fields; unsupported file/hidden adapters | G95 070 | C/E: e06/b09 | Side-by-side Reset explanation; file input is not persistent Data. native-controls tests. |
| Style/class/null, shortcuts and native-attribute exceptions | G95 070; GC-210 030 | E/B: b06, phase 4 mismatch | Use strings/null; add width-on-canvas versus CSS and null removal. Invalid-type parity remains phase 4, not a tutorial fix. style-shortcuts/projection/Python renderer tests. |
| visible versus hidden, SVG reactive geometry/paint | G95 070 | C/E: b06/b07/b10/b11 | Predict layout space and movement; projection/svg tests plus J. |
| Attribute ${name} templates, escaping, missing parameters, text mask | Constitution 11.48 items 7/11; GC-210 010; G100 090 only covers static templates | M: no common template/mask lesson | Add a focused projection lesson and public explanation; distinguish Python f-string/JS template literal from Gramlot template. mask supports live text despite stale GC-210 030 exclusion. projection/inline/Python renderer tests. |
| == expressions and ordering/restrictions with templates | G95 065; GC-210 010 | C/E: c04; M for template interaction | c04 links new projection lesson; demonstrate one allowed dependency and documented chain error. binding-inline tests. |
| Formula versus controller, ^/= triggers and result chains | G95 055 | C/E: c01–c03 | Basic calculation/effect first, immediately followed by equivalent named Logic; providers tests. |
| Named root Logic, arguments/this, state, constructors/missing names | G95 060; G90 030 | C/E: c03/c08 | c03 field modification and separate error callout; no guessed inline fallback. named-logic/bootstrap tests. |
| _if/_else and permitted inline context | G95 055/065/100/105 | C c01; M remote/dataRemote conditional demo | Add bounded advanced c12/c14 gates; keep each declaration's supported controls explicit. providers/remote/dataremote tests. |
| _init/_onBuilt/_onStart and lifecycle/removal | G95 055/080 | C partial c02/c08; M _onBuilt | New lifecycle lesson with ordered trace, removal and freeze; no re-run on thaw. lifecycle/timing/cleanup tests. |
| _delay milliseconds, _timing seconds and delayed startup | G95 055 | C/E: c02/c10; M delayed startup comparison | Separate timing exercises, cancellation on removal and clock-unit labels. binding-timing tests. |
| _userChanges path-level filtering | G95 055; providers.js receive; D2a test | M | Extend c02: same-path edit AND SET trigger; containing/descendant changes do not. Not an identity/input-origin filter. |
| GET/SET/PUT/FIRE/FIRE_AFTER, equal-value delivery and cleanup | G95 065 | C/E: c05 | Value/notification timeline and removal before delayed fire. binding-writes/lifetime tests. |
| Nested button controller/RPC, action/fire alternatives, modifiers | G95 075/100 | C/E: c06/c11 | Add one-mechanism error, disabled click, explicit type and Enter boundary; button-controller tests. |
| Inline native events, descendant target and cleanup | G95 075 | C/E: c07/e10/e13 | c07 self-check declaring node versus target/removal; native-events tests. |
| Named connect_on events | G95 075; view/events.js NAMED_LOGIC | H/M | Dotted group.method required; root func='method' does not translate to a named connect_on value. c07 boundary explanation; actual grouped demonstration waits for resource-host work. |
| Source insert/update/delete/type replacement; freeze and lifetime | G95 030/035/080 | C/E: e10/e13/b08/c08 | Advanced route after events/Logic; delete+insert for type change, immediate semantic cleanup under freeze. live-source/freeze/lifetime tests. |
| Source↔DOM lookup and null results | G95 075; G90 015 | M | Add diagnostic exercise to e13/lifecycle lesson using gramlot.dom, no DOM mutation. binding-projection lookup tests. |
| Inline activation, strict/permissive CSP, no Data-as-code/native onclick | Constitution 11.53; G90 035; G95 065 | E: c04 explanation; no guided refusal demo | D2/c04 explain safe rejected snippet, named alternative and environment profile. binding-inline/embedded-source/bootstrap checks; keep examples usable. |
| Data-bound srcdoc sandbox versus literal srcdoc | Constitution 11.54; G95 065 | M | Projection lesson safe preview with sandbox observation; default remains restrictive. srcdoc-sandbox tests; no arbitrary-code exercise. |
| Data save/restore TYTX versus JSON/XML export | G95 095 | M common; H/E GS-135 tutorial | New data-exchange common lesson using Logic and real file choice; preserve types, show why export is not restore. inout tests plus file/download browser checks. |
| sendMail limits and sendHttp JSON/status/CSP | G95 095 | H/E GS-135; M common | Same exchange lesson's advanced appendix; local receiving fixture in adapter for HTTP, no real message sends; distinguish HTTP POST from dataRpc. inout tests. |
| Endpoint declaration, kwargs, scalar/Bag/null and data-only result | Constitution 11.58; GC-230 015/035; G95 100 | C/E c09 | c09 typed-result variation; Page fresh per call, no implicit server session. RPC/server/Python tests. |
| dataRpc result_path, ^/= method/args, callbacks, debounce | G95 100 | C/E c09–c11 | Explain callback ordering/actual sent parameters; add method/no-result-path variation. binding-rpc tests. |
| Latest-wins, timeout, deletion, transport versus application errors | G95 100; GC-230 025 | M for guided races/timeout; C for c11 application error | Advanced c10/c11, deterministic delayed responses in tests, visible latest result/unchanged result on error. binding-rpc tests. |
| auth on endpoints and Source elements, default closed | G95 100; GC-230 030 | C c11 endpoint refusal; M Source omission | Extend c11: protected subtree is absent from response, not hidden in CSS; controlled source inspection. server/conformance tests. |
| Authenticated allowed/denied/logout, ownership versus identity | GC-230 030; GP-505 | H: Kajenn already implements avatar tags; common demos absent | Bounded Kajenn lesson with existing Basic-auth/site configuration, no new login implementation; tests/kajenn/test_kajenn.py has all three outcomes and logout. |
| remote fragments, startup/reactive name/params, retained content, nesting | Constitution 11.59; G95 105 | C/E c12 | Advanced nested-fragment/name exercise; distinguish Data response and replacement Source. binding-remote/source-pipeline tests. |
| Last-successful remote cache, TYTX snapshot, abort on cache hit | G95 105; §715 owner decision | E: c13 inaccurate; unreleased correction | Update c13 wording/count; A/B/A and Bag mutation exercises, independent request observation; binding-remote regressions. Do not claim registry behavior matches local fixes. |
| remote _if/_else/_onRemote, failure and removal | G95 105 | C _onRemote c13; M others | Advanced c12/c13 show retained contents and console failure, no invented _onError. binding-remote tests. |
| dataRemote lazy read, coalescing, cacheTime and notification differences | Constitution 11.59; G95 105 | C basic c14; M cache-mode/read exercises | c14 explicit reads before/during/after TTL, zero without event, one-time mode; dataremote tests. |
| dataRemote reactive replacement, _if, abort, unchanged value on failure | G95 105 | C argument change c14; M rest | Advanced c14 compare value/requests; failure visible in console, no lifecycle callbacks. binding-dataremote tests. |
| Composition and choosing RPC/remote/resolver | G95 100/105 | E: c08 has local lifecycle only | D5 staged extension with RPC result/error; compare alternatives by linking c12/c14, not a forced all-features application. J/W plus new behavior checks. |
| Custom collections, grammar metadata, static HTML/XML/raw HTML | G100 025/030/035/090 | R: no common gallery page | Advanced reference walkthrough in G100 with existing Python/JS collection/renderer fixtures as evidence; explain static ::HTML is not live raw HTML. No new component/plugin API. |
| startSource, direct remoteSource/rpc.call, custom server/bootstrap/transport | G90 020/025; G95 015; GC-230 | R/H: integration/developer APIs, not first application lessons | Link tested source-pipeline, handlers, transport/conformance fixtures from reference; adapters own setup/custom host explanation. Do not make manual requests a tutorial shortcut. |
| Server owner, registry/expiry/close, mount prefix, runtime/CSP/assets | G90 017/020/030/035; GC-230 010 and HTTP part | H/E: existing adapter guides/tests | D2 align descriptions and troubleshooting; D6 mount-prefix/setup/gallery checks in owning repos. No deployment performed. |
| Recipes/widgets/database/form records, unsupported declarations | G95 085; G100 010/015 | F | Explicit exclusion/next capability boundary, not an incomplete lesson to simulate. HTML form does not imply a record framework. |
| Remote empty-name and direct Source attribute mutation lifecycle | §705 Q1/Q2 | B | Owner decisions remain separate; no lesson chooses their semantics. |

### Learning route and prerequisites

> **Historical proposal (D1):** the concept route below is retained as an index,
> superseded as the primary order by the owner's release-chronology clarification
> in §745. D5 must retain the earlier local c08 stage when introducing a later one.

**Entry.** The proposed default is the existing Python Uvicorn setup (GP-020,
GP-105), with two explicit activities: open the gallery, then create an editable
page with `gramlot uvicorn new`. The gallery is a viewer, not an editor that saves
the displayed sources. Explain where to edit, how reload works and why Python
uses browser Logic from JavaScript. State required gallery extras and that gallery
inline examples may need a different CSP from the strict new-project skeleton.
Node/Bun and Worker directions are alternatives reached by links, not additional
requirements for a Python learner. Do not claim the commands were rerun in D1.

**Essential route, in learning units:**

1. Setup → e01 → e03: declare structure and understand build-time iteration.
2. e06 → b01 (basic pointers/setter introduction) → b04: native input versus Data.
3. b03 → c01/c02 (calculation versus effect only) → c03: initialization and named
   behavior; leave controller clocks and inline-expression detail for later.
4. c06 → c09 → c11: user action, value returned by a page method and visible error.
5. c12: deliberately choose to replace Source instead of receiving a value.
6. D5's revised c08 guided page: combine taught concepts; its SVG/freeze sections
   are optional tracks linked to b07/b08, rather than hidden prerequisites.

**Branching practice:** e02/e04/e05/e07 for HTML; e08→e09→e11 for SVG/static
composition; e12→b11 for a static-to-bound capstone; b05/b06→b09 for form and
layout practice; b07→b10 for reactive SVG. c03/c06→c07→e10→e13 then b08 is the
advanced Source/lifecycle route. c05 follows click/effect concepts; c04 is the
optional inline route. b01 symbolic exercises→b02→c12→c13 covers contexts/cache;
c09/c10→c14 covers lazy Data. Timing, lifecycle, projection and data exchange
follow their prerequisites below. No route requires learning all 38 first.

Each lesson points backward to its prerequisite and forward to one next action.
“Try it” must include an answer: for example VAT alone does not recompute gross;
the next quantity change does. Numeric examples need concrete expected values;
visual ones need explicit before/after observations. Use short explanations,
small steps and the minimum code needed; do not replace instruction with API lists.

### Bounded delivery list for D2–D5

- **D2, core:** GC-020/025/030/055/090/095/100 and overview/index entry points as
  affected by the matrix; current-versus-historical scope, vocabulary, public
  template/mask explanation, b01 coverage claim, default setup and references.
  Align the conflicting mask exclusion in GC-210 with its already approved rule;
  keep §735's previously assigned §015/§695/GC-230 editorial items. Paired views.
- **D2, examples:** existing pages README and three family READMEs, GE-010 and
  catalogue descriptions; publish the reading order as prose/links in the existing
  gallery, without a new navigation component or key renumbering.
- **D2, integrations:** gramlot-py-server GP-005/010/015/020/105/120 and the
  affected Django/Flask/FastAPI/Kajenn guides; gramlot-js-server introduction,
  tutorial, writing/reference/troubleshooting and serverless guides. Correct stale
  remote statements and link shared concepts; maintain adapter setup ownership.
- **D3:** all 38 rows receive the teaching-standard pass, prioritizing c09–c14,
  b01/b03 and b08/c08. Extend existing b01/b02/b03/b04, c02/c06/c10/c11/c12/c13/c14
  with the bounded exercises above; mark optional advanced sections explicitly.
- **D4:** propose three new paired lesson slots at the end of controllers, using
  GE-010's next keys and `NN_name` convention: **c15 `15_lifecycle`** (c03/c06/b08
  prerequisites: ordered hooks, cleanup and lookup), **c16 `16_attribute_projection`**
  (b01/b06/c04: templates, mask and safe srcdoc), **c17 `17_data_exchange`**
  (b09/c03/c06: typed local save/restore, export, advanced transport appendix).
  These names/keys are proposals for D4, not allocated files. Basic RPC/cache
  exercises extend the current examples instead of generating many near-duplicates.
- **D4, Kajenn:** use existing GP-505 and its avatar-auth test fixture to explain
  authenticated allow/deny and Source filtering in an adapter-owned lesson.
  Keep it out of the common catalogue; implementation must read that repo's
  instructions and reuse its existing site/auth configuration. Resource groups
  and named native-event handlers remain an explicitly separate genro-kajenn
  deliverable, outside current execution scope, not replaced with a fake host.
- **D5:** extend c08 in steps with the c09/c11 RPC pattern, a displayed result,
  error and independent learner change; keep local lifecycle and optional SVG/
  freeze identifiable. Explain alternative remote/dataRemote designs through
  c12/c14 links. Expected results and checks accompany each step.

This bounds the common catalogue proposal at **38 revised + 3 new = 41** pages,
not 41 currently implemented pages. Existing environment-specific pages remain
separate. Custom collections/static rendering/custom hosts are advanced reference
walkthroughs, not extra common gallery pages. Missing resource-host demonstrations,
phase 4 parity and Q1/Q2 retain explicit open statuses; the plan does not call them
covered merely to reach a completeness percentage.

### Corrections discovered during D1 and acceptance boundary

1. Corrected §735's proposed _userChanges exercise: G95 §055 and
   `binding-providers.test.js` D2a explicitly allow programmatic writes to the exact
   path. The comparison is node/container/child, not human/program origin.
2. Corrected §735's named-connect_on destination: `view/events.js` recognizes
   dotted identifiers; the common root Logic path used by func is not an equivalent
   named-event spelling. No resource host or new alias is authorized.
3. Found positive Kajenn auth evidence, refining the previous generic environment
   prerequisite: `_KajennFileServer` announces auth and evaluates request avatars;
   `tests/kajenn/test_kajenn.py::test_auth_capability_evaluates_the_avatar_tags`
   covers anonymous, denied, allowed and subsequent anonymous calls. Resource
   hosting remains absent; these are different capabilities.
4. Found unrepresented templates/mask/srcdoc and incomplete pointer coverage, plus
   the stale GC-210 §030 mask exclusion. Reconcile from constitution 11.48 and
   tests, not by proposing new semantics. c08's “every piece” statement also needs
   narrowing until its RPC extension actually exists.
5. Reconfirmed the installed JS adapter catalogue has 32 common entries, not the
   38 in the current examples source. D6 must verify the actual catalogue and
   behavioral coverage, not reuse a historical passing count.

**D1 verification:** catalogue keys/paths and all 114 .py/.js/.md counterparts;
38 inventory rows, prerequisite references and three unoccupied proposed keys;
paired anchors and local document references. Source/test inspection establishes
coverage only; it does not prove behavior, visual quality or novice comprehension.
No example, adapter or runtime implementation changed during D1.

**Subsequent action:** the owner authorized D2 with "si"; see §745. D2 aligns guides and
navigation; D3–D5 change teaching pages only after their own authorization. D6
records runnable coverage and owner didactic acceptance before phase 4 is proposed.

<a id="gc-070-745"></a>
## 745 · Guide alignment and chronological teaching (D2) — 2026-10-13

Block ID: **GC-070-745**.

**Authorization.** After D1, the owner answered "si" to starting D2. During D2 the
owner clarified: "la cosa importante è mantenere pero la costruzione cronologica.
ovvero le varie sezi9oni ripercorrono la sequenza delle release. quindi lo stesso
esempio ptrebbe tornare piu volte per mostrare come le features in piu riducano il
codice necessario". This explicitly establishes chronological product teaching,
including recurring examples and explained code reduction. It does not authorize
D3–D6, stabilization phase 4, runtime changes or a new gallery representation.

**Implemented and locally verified; owner acceptance pending.** Core orientation and reference
entry points distinguish current capabilities, historical milestones and local
unpublished cache corrections. The primary route follows core 0.1.x, 0.2.0,
0.2.5, the intervening naming changes, 0.2.14, 0.2.15 and 0.2.16. Existing
form/SVG comparisons (e06→b09, e08→b10, e12→b11) anchor the repeated-example
approach; they are not claimed to be frozen old-package snapshots or to already
include every before/after exercise. The page module and remote/RPC guidance link
shared contracts; setup stays with the owning integration. Gallery introductions
make chronology primary and prerequisites secondary. c08 remains a local story;
a later server-connected revision must preserve that earlier teaching stage.

Historical records retain their text with explicit banners/corrections; §695's
"later the same day" refers to October 12, while Source auth landed October 10.
GC-230 distinguishes implemented Kajenn auth from planned Genro resource/extended
services. GC-210 no longer excludes the approved mask behavior. The public reference
retains section IDs, release labels and earlier renderer history with clear labels.

**Limits and next action.** D2 updates documentation and catalogue descriptions,
not example application code. D3 must revise the 38 lesson explanations and make
release-specific comparisons explicit; D4 fills gaps, D5 develops later revisions
of the complete page, and D6 qualifies the resulting teaching sequence in real
environments. Neither complete teaching coverage nor owner acceptance is claimed.
**Verification (2026-10-13).** Core staging, strict Sphinx (`-W --keep-going -n`)
and public-boundary check pass: 8 public pages, search/download sources, local
links and mirrored anchors. Both Python integration views build successfully
(14 paired guides, 80 identities); both JS integration views build successfully
(22 paired guides, 122 identities). An additional D2 check preserves the anchors
of 33 changed paired guides and resolves 507 local/cross-repository references.
Catalogue structure, keys and order are unchanged; only b08/c08 descriptions
changed. Existing build-gallery suites pass in JS and Python: 9 tests each.
The gallery's own Markdown renderer renders all four revised introductions with
the release table and route links intact. Chromium inspection of the core route
revealed that the theme's wide table hid comparison text behind horizontal
scrolling; the route now uses readable milestone paragraphs, retaining the theme.

These checks verify D2 documentation and catalogue assembly. They are not a new
runtime qualification of the 38 example pages, a clean-install check, a hosted
site update or owner teaching acceptance; those remain D6 work. No application
source, dependency or gallery schema changed in D2. Current source milestones
were checked against guides and local history (core v0.2.16 and examples v0.2.11
both dated October 12), not newly queried registry payloads.

**Next action:** present D2 and ask to start D3, revising the 38 lessons in their
release stages with explicit before/after comparisons. Do not start phase 4.

**Subsequent action:** the owner explicitly authorized D3; its results and the
reactive-name teaching limitation are recorded in §750.

<a id="gc-070-750"></a>
## 750 · Existing lesson revision (D3) — 2026-10-13

Block ID: **GC-070-750**.

> **Current contract correction (2026-10-13):** declarative `remote` has a fixed
> method name (constitution 11.60, [§755](#gc-070-755)). Earlier reactive-name
> observations, exercises and Q1 are historical records, not current requirements.
> Q1 is outside contract; Q2 remains open only for otherwise permitted Source edits.

**Authorization.** Owner: "si procedi con la 3, mantenendo la sequenza delle release
e mostrando come le nuove funzionalità semplificano gli stessi esempi". Scope:
revise all 38 existing lessons, their explanations and cross-links; make bounded
example corrections and verify the described behavior. Preserve release progression,
earlier examples and Python/JS equivalents. New lessons (D4), a later complete-page
extension (D5), full ecosystem teaching qualification (D6) and stabilization phase 4
are not started by this authorization. No framework/dependency edits are authorized.

**Implemented and locally verified; owner didactic acceptance pending.** All 38
existing lesson explanations now identify the core release stage, goal,
prerequisites, edit/run instructions, execution location, guided trial with
expected results, an exercise with its answer, limits and next links. Earlier
pages remain separate. Comparisons include e06→b09, e08→b10, e12→b11, local
controllers→endpoints, and endpoints→remote Source/lazy Data. They distinguish
less synchronization/request coordination from added functionality; no universal
line-count reduction or pixel-identical rewrite is claimed. Family introductions,
catalogue descriptions and paired GE-010 explain this learning structure.

Bounded page changes: b08's button now says "Increment Data count"; c13 labels
successful mounts "Mounted fragments" and independently observes transport calls
in tests; c14 adds a named Logic read action and a separate Data snapshot so the
learner can observe first read, stored value and later response. The Python and
JavaScript declarations remain equivalent. No framework, adapter or dependency
implementation was changed by D3.

**Historical record — superseded by §755: the exercise was classified as blocked.** The planned name-changing
c13 exercise cannot use the public `remote(name, ...)` helper: both
`src/gramlot/page/source.py` and `js/src/builder/source.js` reject `"^method"` as a
name before Source reaches the browser. The runtime supports reactive remote
attributes and the phase-1 tests cover them, but that does not establish this
helper's authoring path. Removed the non-executable exercise and documented the
limitation in c13 and paired GC-095 §105. This is an exposed core authoring/runtime
discrepancy, not teaching coverage. No direct-attribute workaround, new helper
contract or framework fix is authorized by this examples task. The affected
exercise stays blocked pending owner/core contract review; Q1/Q2 stay undecided.
The remaining c13 advanced trials clearly require the local unpublished cache
correction. This refines the proposed name exercise in §735 and the broad runtime
coverage row in §740; neither should be read as proof of helper support.

**Verification (2026-10-13):**

- Existing-installation JavaScript suite: 49 passed; Python suite: 14 passed.
  Chromium through the repository's FileServer fixtures starts all 38 pages in
  each language (76 starts), checks named Logic, endpoints and fragments, and
  observes c13/c14 transport separately from visible state. Restored c13 status
  assertions also pass in the targeted Node check and both browser languages.
- Seven additional local-development JS exercise checks pass: delayed mounted
  A/pending B/back to A, mutated Bag snapshot, lazy reads with cacheTime 5/0/null,
  conditional cancellation/re-enable/disposal, and failed endpoint retention.
  These checks use temporary copies of the existing examples against the local
  core; they are not installed-release or full integration-matrix evidence.
- All 38 lessons render with the gallery's Marked/DOMPurify renderer. Reviewed
  representative b09/c13/c14 panels with the gallery/theme styles at 1200px and
  390px; comparison and final sections remain reachable through the existing
  scrolling panel. This is a documentation-layout preview, not mobile gallery
  qualification. All 220 inspected local/cross-repository references resolve;
  stable paired anchors and catalogue keys/order are preserved. Strict Sphinx
  (`-W --keep-going -n`) and the public-boundary check also pass after the helper
  limitation clarification: 8 public pages, search, sources and local links.
- Gallery bundle build passes. npm dry-run contents include all 38 READMEs;
  an offline-built Python wheel contains all 38 READMEs and their 76 Python/JS
  source counterparts byte for byte, plus the gallery bundle. No clean install,
  dependency refresh, publication or deployment is claimed.

**Remaining work / next action:** D3's proposed variable-name exercise was
removed as outside contract by the owner's subsequent decision (§755). Present
D3 for didactic review, then ask to start D4's missing-topic lessons. D5's later complete-page
revision, D6's real-environment qualification and didactic acceptance, and
stabilization phase 4 remain separate and unstarted. The beginner and executable
advanced lessons are revised; complete framework teaching coverage is not claimed.

<a id="gc-070-755"></a>
## 755 · Fixed remote method: owner clarification — 2026-10-13

Block ID: **GC-070-755**.

**Decision and authority.** Owner: "il metodo per il momento NON puo essere variabile: non lo ea nel legacy e se un domani lo volessimo ammettere sar5a per una decisione esplicita".
Recorded in paired constitution amendment 11.60. The method of declarative
`remote` is a fixed literal identifier; Data binding may vary parameters, not the
method. No future variable-method feature is approved. The helper's rejection is
correct; the previous suggestion to extend it and the D3 "blocked" classification
were mistaken. The name-changing lesson is excluded, not deferred for completion.
Q1's reactive-name-clearing premise is invalid for the current contract. Q2 is
still separate; no new live Source mutation contract is approved.

**Implemented documentation correction.** Paired GC-095, teaching plan/status
and c13 now teach a fixed method with variable parameters. Earlier audit and
phase-1 test observations remain historical evidence under an explicit correction;
they do not authorize a variable method. The release sequence and earlier/later
example comparisons remain intact. This decision does not start D4 or any later
phase.

**Remaining technical nonconformity.** `js/src/binding/remote.js` still resolves
the `remote` attribute with runtime values; `js/tests/binding-remote.test.js`
contains two positive reactive-name cases, including the cache regression added
in phase 1. These behaviors/tests must be aligned with the fixed-method contract
in the core's technical correction work. Do not extend the public helper or treat
passing positive tests as acceptance. This clarification updated documentation;
runtime implementation and tests have not been changed or requalified here.

**Verification.** Documentation-only checks: paired constitution/guide/status
anchors and matching decision records; strict Sphinx and public-boundary/local-link
checks. D3's existing runtime checks retain their earlier scope; no new runtime
verification or release is claimed.

**Next action.** D4 remains the next teaching step, awaiting its own authorization.
Carry the fixed-method runtime/test correction into the technical review without
reopening the settled decision or adding a variable-method design. The owner
subsequently requested the concrete TODO and proposed signature metadata (§760).

<a id="gc-070-760"></a>
## 760 · Remote correction backlog and builder-signature proposal — 2026-10-13

Block ID: **GC-070-760**.

**Owner instruction:** "si mettilo come cosa da sistemare. potrebbe essere un
attributo della signatura dei builders dire se si accetta un pointer o no".
Record the fixed-method correction as technical work to perform. The signature
metadata is the owner's proposed design direction to evaluate, not an approved
field name, default policy or implementation. Constitution 11.60 already settles
the remote contract; that decision does not need to be asked again.

**TODO — stabilization phase 5, responsibility/contract review:**

- Align the remote runtime and its tests with the fixed literal method. Reject
  pointer-valued names, including `^` and `=`, before resolution/subscription or
  dispatch. Preserve variable parameters, cache behavior and cancellation for
  valid declarations. Replace the two positive reactive-name tests with checks of
  the approved rejection and the supported fixed-name/variable-parameter path.
- Evaluate whether pointer acceptance belongs in each builder parameter's
  signature metadata. Define ownership and the one authoritative declaration;
  account for Python/JS authoring, serialization and runtime reception so direct
  Source input cannot bypass the contract. `remote(...)` is currently a handwritten
  Source-node helper, so an element-signature field alone would not cover it
  without a defined mapping to the resulting `remote` attribute.
- Before implementation, settle the metadata name through GC-225, its meaning
  and behavior when absent, and whether one permission covers both `^` and `=`.
  Keep the rule separate from the value's type: accepting a string does not by
  itself mean accepting a Data pointer. This proposal does not authorize changes
  to other APIs' existing pointer contracts.

**Read-only evidence.** The installed Python Builder grammar format (§4.3) and
its loader, and JS Builder's `src/grammar-loader.js`, describe parameter name,
kind, role, annotation and default metadata; no pointer-acceptance field exists
in that inspected descriptor. The JS loader checks exact parameter keys, so a
new field requires coordinated format/export/loader support in the owning Builder
projects, not an extra key silently added only in Gramlot. Current Gramlot remote
helpers enforce a literal identifier separately. No dependency source was edited.

**Completion criteria.** Python and JS reject prohibited pointer names consistently;
received Source cannot call a method selected through Data; valid fixed-method
calls still react to allowed parameters; relevant cache/cancellation checks pass.
The ownership/design and documentation agree, and the runtime nonconformity is
closed with evidence. Required Builder work must be handled in its owning project
under the existing explicit authorization boundary, with no consumer workaround.

**Status:** recorded, not implemented. This is technical follow-up after the
teaching sequence; D4 and subsequent phases have not started. Verification here
covers matching records/anchors and plan links only, not runtime behavior.

**Upstream issue (2026-10-13).** Owner: "metti in issue su builders per dire se puo
essere o noi poiinter". Opened and read back
[genro-org/genro-builders #56 — Declare whether builder parameters accept Data pointers](https://github.com/genro-org/genro-builders/issues/56).
The issue records the signature metadata proposal, the fixed-method Gramlot case,
Python/JS format and validation coordination, open design choices and acceptance
criteria. No field spelling, omitted-field policy or variable remote method is
approved by filing it. The Gramlot runtime/test correction remains tracked here;
no implementation or dependency source change was made. Checked both Builder
issue lists before filing; no matching existing issue was identified.

<a id="gc-070-765"></a>
## 765 · Missing-topic teaching examples (D4) — 2026-10-13

Block ID: **GC-070-765**.

**Authorization.** Owner: "ok procedi con D4, mantenendo la sequenza delle release
e l'aspetto didattico degli esempi". Implement the bounded D1/D4 delivery: c15
lifecycle, c16 attribute projection, c17 data exchange, focused additions to
existing lessons. The adapter-owned Kajenn guide/test was subsequently
explicitly authorized and completed as recorded below. Stable keys are
retained; catalogue placement and lesson links follow core release chronology.
D5/D6 and stabilization phase 4 remain separate. Remote method names stay fixed;
Builder #56 and the runtime correction remain technical follow-up, not D4 work.

**Implemented locally.** The common catalogue has 41 paired Python/JS pages.
New c15 follows `_init`/`_onBuilt`/`_onStart`, timer ownership, freeze/removal and
read-only Source/DOM lookup; c16 separates 0.2.0 templates/mask from 0.2.3 bound
srcdoc sandbox; c17 revisits the form record with 0.2.5 TYTX save/restore, JSON/XML
export and mail-text preview (public utility path since 0.2.10). The existing
keys stay stable: c15/c16/c17 precede c09 in the menu, and c08 now links to c15.
Earlier examples remain available for comparison. b01 adds `#ANCHOR` and the
Data-path cancellation segment `.#parent`; c02 adds exact-path `_userChanges`
comparisons for input, SET, containing and descendant changes; c11 contrasts
refused Source omission with a delivered hidden branch. c03 explains the companion
stylesheet exercise and existing resource ownership. Paired public guides and
catalogue documentation reflect the actual teaching route and its limits.

**Teaching checks.** All 41 READMEs retain release stage, prerequisites, execution
location, guided predictions, a source-change exercise with an answer, and limits.
Examples compare reduced coordination with earlier versions of the same problem;
they do not claim that every later interactive page has fewer total lines.
New source uses Source/Data, named Logic and framework InOut; no application
file picker, direct DOM mutation, request transport or parallel state was added.

**Verified on the existing local dependency graph.** Examples: JavaScript 52/52,
Python 15/15; Chromium started all 41 pages through each language's FileServer
(82 page/language combinations) and checked the new interactions, existing RPCs
and fragments. Real browser downloads/file choice passed TYTX restoration,
JSON/XML export and rejection of exported JSON as a restore file. A separate
both-language freeze/removal trial confirmed immediate timer cleanup with retained
frozen DOM and absent Source. All 41 lessons rendered through the gallery's actual
Marked/DOMPurify pipeline; the three new page previews were visually inspected.
Gallery build, npm dry-run manifest and Python wheel contents passed; all 41
lesson files are present in their respective language distributions. The lesson,
guide and status audit checked stable keys, chronological menu order, paired
anchors and 426 local/cross-repository references. Core strict Sphinx and the public
documentation boundary/local-link/mirrored-anchor check passed. These are local
checks, not a fresh installation, full integration matrix or owner acceptance.

**Blocked date exercise — owning library.** A nested JavaScript Date in an object
passed to `dataSetter` becomes an empty Bag. Minimal read-only reproduction with
the installed `@genrojs/bag`: `new Bag({when: new Date('2026-10-03T09:30:00Z')})`
yields a Bag, not a Date, at `when`. The c17 baseline therefore demonstrates
string/number/boolean/null/nested-Bag values only. Its date/decimal extension is
explicitly unverified and blocked; no date-from-string or alternate construction
workaround was added. This is object-to-Bag initialization evidence, not proof
that InOut's typed-date round trip fails. The owning-library contract/correction
and paired initialization checks remain follow-up; no dependency source or new
upstream issue was changed by D4.

**Kajenn authorization resolved and delivery verified (2026-10-13).** After
automatic approval review required separate repository permission, the owner
answered the bounded guide/test question: "Sì, autorizzo guida e test Kajenn".
Implemented the paired GP-505-030 walkthrough and the Source-auth test using the
existing `auth_site` identity configuration. c11 now links to the walkthrough.
The lesson preserves endpoint rules (0.2.14), then Source rules (0.2.15), with
prerequisites, predictions, four request identities, an exercise/answer and limits.
It distinguishes owner cookies from request identity and Source omission from
visibility; it adds no login system or adapter runtime change.

**Kajenn verification.** The initial installed core was 0.2.14: its endpoint test
passed but Source filtering failed because that release precedes the capability.
Updated only the local verification environment from the published unconstrained
`gramlot` package to 0.2.16; no manifest, pin, dependency source or compatibility
path was introduced. All 15 tests in `tests/kajenn/test_kajenn.py` then passed,
including anonymous → refused Bob → allowed Ada → anonymous for both endpoint
and Source outcomes. The guide explains the 0.2.15 prerequisite and environment
update. The adapter documentation check validated 14 paired guides, 81 stable
identities and both strict Sphinx builds. This qualifies the controlled test
walkthrough, not a browser login/logout UI or the complete adapter matrix.

**Other boundaries.** Named resource groups/native named-event exercises need
genro-kajenn and remain reference-only; no replacement resource host or login
system was authored. Mail/HTTP are the c17 advanced appendix pointing to existing
local/intercepted verification fixtures, not a new external-service demonstration.
No real mail or external HTTP action was run. Framework behavior, Builder #56,
the fixed-remote runtime correction and undecided Source mutation semantics were
not changed in this phase.

**Status and next action.** Common D4 work and the authorized Kajenn portion
are implemented and locally verified. The date initialization extension remains
blocked on its owning library; complete D4 coverage/owner acceptance is not
claimed. D5's later complete-page revision and D6's real-environment/clean-setup
qualification and teaching acceptance remain pending, as does stabilization
phase 4. Retain the date gap explicitly and obtain the owner's instruction before
starting the next phase. The former Kajenn permission blocker is resolved.

<a id="gc-070-770"></a>
## 770 · Complete-page teaching progression (D5) — 2026-10-13

Block ID: **GC-070-770**.

**Authorization.** The owner answered "1ok" to the explicit proposal to proceed
with D5, the didactic evolution of the complete example, retaining the date
initialization problem as tracked work. Scope: the agreed c08 extension using
c09/c11's dataRpc pattern, visible result/error, independent learner exercise
and links to the later remote/dataRemote alternatives. Keep the local 0.2.0
stage and optional SVG/freeze identifiable; preserve the release learning order.
D6, stabilization phase 4 and dependency corrections are not started by this
authorization.

**Implemented.** c08 preserves the original local declarations and named Logic,
with visible 0.2.0 labels and an identifiable optional freeze exercise. A separate
0.2.14 section appends `Request quote`, a Page `quote` endpoint, bound result/error
fields and small success/error callbacks. Arguments use `=` and are read on click;
there is no automatic quote on initial load or field edits. The endpoint validates
quantity and returns an arithmetic result; failure preserves the last successful
quote and recovery clears the error. Python and JS author the same exercise.
No order persistence or production pricing contract is implied.

**Teaching progression.** c08 remains at its original catalogue position for the
first local pass. c11 and GC-025 direct the learner back to its later section
after endpoint basics, before the separately labelled 0.2.15 Source-auth stage.
The README preserves the original local trial, adds a four-step quote/error/
recovery trial, and explains the distinction between a live local preview and a
server snapshot. Its source-change exercise adds a delivery charge only to the
endpoint; the local result stays unchanged. An explicit comparison explains that
new functionality adds code while `dataRpc` removes the need for application
transport/result-copying code. The two arithmetic calculations are deliberately
retained for this comparison, not a proposed shared production pricing design.
Later remote/dataRemote responsibilities remain links to c12/c14, not additional
mechanisms forced into this page. Stable keys, filenames and catalogue order stay
unchanged; paired guides and catalogue explanations match the new lesson.

**Verified locally.** JavaScript 52/52 and Python 15/15 pass. The original c08
checks remain, including local formula/radio/paint, button modifiers, freeze and
page disposal; its named Logic is unchanged. Added checks cover no quote calls
during local work, fresh click arguments, scalar result, zero/empty-quantity
refusal, retained result and error clearing on recovery. Chromium started all 41
pages through each language's FileServer (82 combinations), including c08's local
and later endpoint interactions. The rendered c08 page was visually inspected.
The independent +4 exercise also passed in Chromium through both languages on
temporary copies: local total 11, quote 15, then refusal retaining 15. Those
modified copies were not installed as the delivered examples.

Gallery build, npm dry-run manifest and wheel content checks pass. All 41 READMEs
render through the gallery's actual Markdown pipeline. The audit checks 431
local/cross-repository references, paired anchors, unchanged catalogue keys/order
and the scoped c08 description/explanation updates. Core strict Sphinx and the
public-documentation boundary/link/mirrored-anchor check passed. These checks use
the current local dependencies; the full integration/clean-setup teaching matrix
belongs to D6.

**Status and next action.** D5 is implemented and locally verified, awaiting owner
teaching acceptance. Propose D6 for real-environment qualification, clean setup
and the final didactic review; do not start it or stabilization phase 4 without
authorization. The owner-approved tracked gap from D4 remains explicit: nested
Date initialization through JavaScript object-to-Bag conversion needs its owning
library. No dependency or core runtime change, commit, publication or deployment
was made for D5.

<a id="gc-070-775"></a>
## 775 · Teaching qualification and editorial walkthrough (D6) — 2026-10-13

Block ID: **GC-070-775**.

**Authorization.** Owner "ok" confirms the explicit proposal for D6: integration
environment checks and final didactic review before stabilization phase 4.
Implement verification and reader-facing corrections only; preserve the release
sequence. Core/dependency runtime changes, release/publication and phase 4 remain
outside scope. Owner teaching acceptance is separate from automated checks.

**Implemented and verified; owner review pending.** Every common catalogue entry
now requires an observable browser check; an omitted check fails immediately.
The same exported `verifyExample` assertions were reused by the integration
qualification. They cover static structure, editing/bindings, named Logic,
endpoints, fragments/cache, lifecycle, projection and local file exchange.
No runtime or dependency source was changed for D6.

**Provenance.** Fresh environments resolved unconstrained first-party releases;
no lockfile, pin or installed-source patch was introduced. Python 3.14.6 resolved
core 0.2.16, genro-bag 0.27.0, genro-builders 0.28.0 and Kajenn 0.4.7. Node
23.11.0 / Bun 1.3.14 resolved core 0.2.16, @genrojs/bag 0.10.3 and
@genrojs/builders 0.5.0. These are dated observations, not installation pins.
The gallery lane installed locally built teaching candidates: examples 0.2.11
with 41 common entries, Python adapters 0.2.7 and JS server/serverless 0.2.8.
Their versions do not imply that registry packages contain this unaccepted work.
Source baselines: core `729c542`, examples `4c49480`, Python adapters `783de42`,
JS server `e14a9b8`, plus the local work recorded in this status.

The separate generated-project lane installed registry dependencies in a fresh
Python environment shared by all five adapter extras, and separate npm projects
for `page` and `site`. Python resolved core 0.2.16 / adapters 0.2.7 / Kajenn 0.4.7.
This is not five isolated minimal-extra installations. No earlier virtualenv or
node_modules tree was reused for either clean lane.

**Integration checklist (Chromium, local delivery).** Common keys, in the exact
verified menu order: `e01–e13`, `b01–b11`, `c01–c08`, `c15`, `c16`, `c17`,
`c09–c14`. Each row executed every common key, not a sample. Each server adds its
own `<environment>-01`; Worker adds `serverless-01` and `serverless-02`.

| Environment | Mounted delivery: all page behaviors | Gallery | No-prefix additional checks |
| --- | --- | --- | --- |
| Uvicorn | 42/42, `/py` | pass | 4/4 |
| Django | 42/42, `/py` | pass | 4/4 |
| Flask | 42/42, `/py` | pass | 4/4 |
| FastAPI | 42/42, `/py` | pass | 4/4 |
| Kajenn | 42/42, `/py` | pass | 4/4 |
| Node | 42/42, `/js` | pass | 4/4 |
| Bun | 42/42, `/js` | pass | 4/4 |
| Worker/static | 43/43, `file:` export | pass | not applicable |

Total: 337 page/environment behavior checks (328 common + 9 environment pages),
plus 28 no-prefix checks. The latter execute `e01`, `c08`, `c17` and the local
`<environment>-01`. Gallery checks cover exact catalogue/order, README rendering,
Python/JS/Logic source visibility, logo, iframe startup and theme propagation;
server prefixes also return the expected redirect. c13 counts source-call
request envelopes through HTTP or Worker messages, separately from mounts.
Unexpected browser errors, failed responses and external HTTP requests fail the
qualification. External requests were not used.

**Commands and retained evidence.** Session artifacts are under
`/private/tmp/gramlot-d6` (local evidence, not a published report or hosted CI).
`matrix.mjs` starts the installed CLIs, calls the shared example assertions,
checks galleries and closes the services. Final runs:

```sh
node /private/tmp/gramlot-d6/matrix.mjs uvicorn django flask
node /private/tmp/gramlot-d6/matrix.mjs fastapi kajenn node
node /private/tmp/gramlot-d6/matrix.mjs bun worker
node /private/tmp/gramlot-d6/matrix.mjs worker
```

The final Worker-only JSON supersedes the first Worker gallery result: the test
initially tried to read a `file:` iframe through its parent and hit the browser's
origin boundary. The corrected test reads each Playwright frame in its own
context; no browser security setting or product code was changed. The final
per-key JSON reports are `matrix-uvicorn-django-flask.json`,
`matrix-fastapi-kajenn-node.json`, the Bun row of `matrix-bun-worker.json`, and
`matrix-worker.json`. CLI forms exercised by that harness:

```sh
gramlot <uvicorn|django|flask|fastapi|kajenn> gallery --port <port> --mount /py
gramlot <node|bun> gallery --port <port> --mount /js
gramlot-serverless gallery <output-folder>
```

The seven HTTP galleries were restarted without `--mount` for the root checks.
A preliminary b02 check also used an input assertion on a paragraph; the selector
assertion was corrected and the whole affected run repeated. Neither diagnostic
attempt is counted as a product defect or as passing evidence.

**Clean setup/editorial walkthrough.** The five documented Python `new` flows,
then each generated start command, pass initial display, changing Ada to Grace
through a binding, and changing the Python source to Mira followed by restart.
`npm create @gramlot page` and `site` pass installation/build and browser use
through Node, Bun and their file export: 11/11 setup/delivery cases overall.
The site starts at its menu; selecting Registration opens the editable form.
The final setup report is `setup-results.json`; a preliminary test that incorrectly
expected that form at the menu was corrected and all three site cases rechecked.
The gallery is a source viewer: editing happens in the generated project.

Walked the public setup and release route, then e01/b01, c13 and c08 using their
reader-facing prerequisites, predictions, exercises and answers. c08 keeps its
local 0.2.0 trial and is revisited after c09/c11 for the labelled 0.2.14 quote;
Source authorization remains 0.2.15, then remote/lazy Data 0.2.16. Existing keys
are unchanged. The comparison explains reduced coordination code without
pretending that added functionality always reduces total line count. Rendered
Python and Worker galleries were visually inspected. This technical/editorial
walkthrough is not proof of beginner comprehension; these representative lessons
still require the owner's didactic review.

**Corrections found by the clean checks.** Current Kajenn exposes
`ServerApplication` from `kajenn.server_app`; the earlier environment exposed
`kajenn_server_app`. Updated only the already authorized Kajenn guide pair and
test import, using the existing identity system. No extra package or adapter
fallback was added. The auth tests verify anonymous / staff / admin / anonymous
Source filtering with the same page owner. Bun's default five-second test limit
was incompatible with c14's intentional 5.1-second expiry observation; the page
behavior tests now explicitly allow ten seconds. The ordinary documented Bun
command subsequently passed; the lesson's cache duration and runtime are unchanged.

**Checks.** `npm test`: 52/52; `bun test ./tests`: 52/52; Python examples unittest:
15/15. Both FileServer browser commands pass with the final shared checker:
41 Python + 41 JS pages, plus e10/e13 Source identity/removal and timer cleanup
on both servers. The focused local-development core tests
`binding-rpc.test.js`, `binding-remote.test.js`, `binding-dataremote.test.js` and
`binding-timing.test.js` pass 60/60, including deterministic timing/race tests.
This is distinct from the released-core integration lane. Existing positive
reactive-method-name tests are technical nonconformities from §760, not approval
of variable methods.

Python README, Kajenn, Uvicorn tutorial and five project tests pass 23/23 on the
clean environment. They emit 223 dependency deprecation warnings on Python 3.14;
these do not imply an adapter runtime failure. Python guide/anchor validation
passes 14 pairs / 81 identities; JS server/serverless passes 22 pairs / 122
identities; strict Sphinx builds pass for both guide views. All 41 READMEs render
through the gallery Markdown pipeline. The final teaching audit passes 41 lesson structures, Python/JS pairs, release
order, stable anchors, 434 local/cross-repository references and packaged contents;
gallery bundle and local npm/wheel builds are checked separately from publishing.
Core strict Sphinx passes; public-documentation verification passes all eight
published-guide pages, search/source boundaries, local links and mirrored anchors.

**Limits and next action.** Keep c17's owning-library nested-Date initialization
defect and absent date/decimal extension visible (§765). Reproduced again with
the freshly installed @genrojs/bag 0.10.3: the nested value is a Bag, not a Date.
No dependency workaround was added. Named resources/events need the separate genro-kajenn resource host;
mail and HTTP examples use only local/intercepted fixtures or references, with no
external delivery. OS-specific file-picker/mail-client interaction and novice
comprehension are not automated acceptance claims. Advanced c13/c14 cache/error/
lifetime behavior is qualified by the local development tests only to their tested
scope, not by this released-core matrix. Fixed-method runtime/test alignment and
builder pointer policy (§760), style/class parity (phase 4) and otherwise permitted
Source mutation semantics (Q2) remain separate technical work.

D6's implemented checks and editorial corrections are verified; owner didactic
acceptance, including explicit disposition of the remaining teaching limits, is
pending. Present e01→b01, c13 and c08 for that review. A local Uvicorn review
gallery is available at `http://127.0.0.1:8185/` during this session. Do not start stabilization
phase 4 until D6 acceptance and its separate authorization. No commit, publication
or deployment is part of this qualification.

**Owner review finding — Python source visibility.** The owner screenshot of e10
shows the Python heading immediately followed by the Logic heading and the full
JavaScript Page listing. The Python gallery appends two heading/pre pairs, but
its code pane grid defines only two explicit rows; the implicit JS rows can
consume the space intended for Python. The Logic pane also displays the entire
shared JS module, including the equivalent Page, even when `Logic` is empty (e10).
The earlier source assertions checked text presence, not usable visible height;
the visual walkthrough missed this defect. The prior source-visibility claim is
therefore insufficient. D6 remains unaccepted: correct the presentation and
verify Python readability and the meaning of the Logic pane before closing it.
The owner asked why JS was visible; no new presentation design is approved by
that question alone.

**Source-tab correction authorized.** Owner: "si dovrebbero essere com un tab".
Scope: source-file tabs in the existing gallery, Python initially selected for
Python pages, separate accurately labelled JavaScript module, one visible source
at a time. Use the gallery's existing ordinary HTML ID and local behavior
conventions (GE-010 §030); no new core component or dependency change.
Implemented separate source tabs with Python initially selected in Python
and JavaScript initially selected in JS/Worker galleries. Short labels keep
both choices visible at desktop widths; filenames are available on hover.
The complete JavaScript module is labelled JavaScript rather than Logic; a
separate JS `_aux.js` companion retains its Logic tab. Hidden panels leave the
layout, so the primary source no longer collapses. Selection uses Source
attributes and the existing gallery event/disposal ownership. It does not
reload the example iframe or reorder lessons.

Added a source-tab regression covering selection, keyboard navigation, return
to an opened lesson, retained iframe and listener disposal. Node 53/53, Bun
53/53 and Python 15/15 pass. The new downstream
`scripts/verify_gallery_browser.mjs` checks real visible width/height, one source
at a time, source switching, keyboard and scroll/preview preservation. All 41
common lessons pass through each of Python, Node and file-based Worker galleries
(123 layout cases). These focused checks supplement the earlier eight-environment
behavior matrix; that full matrix was not rerun for this presentation-only change.
The final labels were also checked in the user's local review gallery, left on
e10 with Python selected. Gallery bundle, wheel/npm contents and original
package manifest pass, as do 41 Markdown renders and the 434-reference/paired
anchor audit. No release, deployment or runtime/dependency change.

The reported visual defect is resolved. Owner didactic acceptance of D6 and the
previously recorded teaching limits remain separate; phase 4 is not started.

**Owner refinement — environment-specific source and optional Logic tab.**
Owner: "preferirei che i server python vedssero il codice python e quelli js il
codice js mentre logic se c’è si chiama log.js ed e il secondo tab".
The first tab must show only the environment’s authoring language. A second
`log.js` tab is wanted only where meaningful Logic exists (currently b08, c02,
c03, c08, c15, c17 and c14). It must not show the alternative Page as Logic.
Clarification requested: whether `log.js` is a display label or a new physical
module naming contract. Current FileServer accepts Logic in the page module or
a same-stem `_aux.js`; a `log.js` file convention cannot be inferred from it.
No dependent runtime or source-extraction change has been made pending that
answer. The existing source tabs remain the last verified implementation, not
acceptance of the refined presentation.

**Owner clarified the source contract and label.** A Python author attaches a JS
module containing browser logic; a JS author may put Page and Logic in one module.
Shared example modules are a teaching-source convenience, not a requirement on
Python applications. In the Python gallery show only the actual Logic class from
that shared module, not its alternative JS Page. The owner corrected `log` to
`logic`: the requested second-tab label is `logic.js`. Keep JS galleries showing
their JS page module, with an optional Logic companion view when separate.

A syntax-parser approach has been prepared for exact source-range extraction,
including empty-class suppression and nested/comment/string cases. Automatic
approval review rejected `npm install --save-dev --package-lock=false acorn` in
the examples repository: it judged a new persistent dependency outside D6's
approved boundary. No dependency or display change from this approach was applied.
The proposed exception is Acorn as an examples-gallery build dependency only,
bundled into its existing browser formatter; no core/adapter dependency or runtime
contract change. A reviewable extractor and regression cases are staged in
`/private/tmp/gramlot-d6/logic-proposal/`; they are not claimed verified without
the parser. Request explicit owner authorization before applying this exception.

**Parser proposal withdrawn; requested presentation implemented.** The owner
challenged the parser proposal ("ma perche un parser ??? che ti viene in mente ???").
No Acorn installation or dependency change was made. The source viewer now uses
the existing shared-example layout: one final `export class Logic` declaration.
A regression imports all 41 actual modules and compares each displayed nonempty
excerpt to the original exported class source. Node supplies the source-preserving
reference even in Bun tests because Bun rewrites imported source; Node is already
required by both gallery-build CI jobs. This is a bounded teaching-file convention,
not a JavaScript parser or a change to the runtime's supported modules.

Python pages initially show only their Python source. `logic.js` appears for the
seven nonempty classes (b08, c02, c03, c08, c15, c17, c14); it contains only the
Logic declaration, never the alternative JS Page. Empty Logic tabs are hidden
and omitted from keyboard navigation. JS/Worker pages retain their complete JS
module; separately provided Logic companions use the optional second tab. The
real files and their runtime loading are unchanged. Display text is always read
from its original Source node, so gallery reattachment also handles empty Logic.
The guide pair and affected lessons now explain the excerpt and environment
boundary. This supersedes the earlier whole-JS-module tab in Python.

Verified: Node 55/55, Bun 55/55, Python 15/15; browser visibility/content checks
41/41 on each Python, Node and Worker gallery (123 cases), including the exact
seven-versus-34 optional-tab split. Gallery build, package contents, 41 Markdown
renders and the 434-reference/mirrored-anchor audit pass. The user's local gallery
was refreshed and c03's `logic.js` tab visibly shows `export class Logic` and its
methods, without Page. The parser proposal is closed and needs no authorization.
D6 owner didactic acceptance and earlier teaching limits remain pending; phase 4
is not started.


Owner visual feedback, 2026-10-13: "padding eccessivi font eccessivi" and
"la barra laterale ... dovrebbe avere uno splitter o essere piu larga" authorize
a compact gallery and wider sidebar. Applied the wider-sidebar option, without
adding another splitter: 240px desktop, 180px at <=800px, 140px at <=640px.
Consolidated the overlapping gallery CSS rules; UI 13px, code 12px, smaller logo,
26px navigation rows, explicit compact source-tab heights and a 28vh explanation
limit. The existing frame bridge inserts preview-only compact CSS as a Source
style node and disposes it with its script; direct pages and core theme are
unchanged. No new framework capability, dependency or adapter runtime change.

Verified: gallery lifecycle/source-tab tests 16/16; delivered galleries 41/41 on
Python and Node (82 cases). Final Pointers preview fields are 28px high with 13px
text in both environments. Desktop sidebar labels fit one row; whole-document
horizontal overflow is absent at 1280, 800 and 640px. Source and long lesson
regions remain scrollable. Rebuilt standalone export with the same assets; this
turn did not open file:// in the integrated browser, whose URL policy rejects it.
Python :8185 and Node :8187 review galleries are refreshed. Visual acceptance
remains with the owner. The earlier requested removal of environment Quick start
sections from the galleries is still pending; this CSS work does not close it.
D6 owner didactic acceptance remains pending and phase 4 has not started.


Owner instruction, 2026-10-13: "ok togli anche le sezioni Quick start da tutte
le gallerie, lasciandole nella documentazione dei server". Removed the five
Python and two Node/Bun built-in quick-start catalogues and their duplicated
gallery pages; removed only serverless-01 from the standalone catalogue. Server
READMEs, tutorials, scaffold templates and their quick-start tests are retained.
Standalone serverless-02 (Registration form) remains an application example.
Existing explicit --catalog support is unchanged. Updated gallery expectations,
browser harnesses and paired integration/example guides. No HTTP/runtime contract,
core or dependency change and no publication.

Verified: Python gallery/README checks 15/15 (including all five adapters), Node
server/standalone gallery and quick-start checks 9/9, Bun gallery/quick-start 5/5.
Both server documentation trees and their concise mirrors build with strict
checks. Live Python :8185 and Node :8187 galleries show exactly the three common
families and 41 examples; no setup section. Rebuilt both local standalone review
exports with 42 examples (41 common + Registration form), without serverless-01.
The integrated browser still forbids file://; no new standalone browser run is
claimed. The Quick start removal TODO is complete. D6 owner teaching acceptance
and previously recorded teaching limits remain open; phase 4 is not started.


Owner teaching feedback, 2026-10-13: descriptions should briefly explain what a
page contains and teaches; every section must state which library features it
uses. Added short visible introductions and a Uses line to all 41 lessons, plus
feature boundaries in the three family introductions. Release chronology, stable
catalogue order and comparisons of returning forms/SVG/pages are unchanged.
Later browser actions in e10/e13, local controllers in b08 and multi-release
controller pages remain explicitly identified. Maintained text stays English.

The initial replacement proposal was rejected by automatic review because it
would discard the existing detailed teaching material. The applied conservative
alternative preserves every original lesson/family body inside a native More
detail disclosure, closed by default. No lesson exercises, prerequisites or
limitations were removed. Paired GE-010 and the shared reading route describe
this short-introduction/optional-detail presentation.

Verified: all 41 Markdown lessons render through the existing sanitizing pipeline
with their original headings, answers and release labels; all visible lesson
summaries are under 135 words and contain the feature scope. In the live Node
gallery e06 has a 139px introduction with no internal scroll at 1280x800; More
detail opens the original notes and closes again. Updated both local serving
copies and rebuilt both standalone review exports. Example code is unchanged.
D6 teaching acceptance remains with the owner; phase 4 has not started.


**2026-10-14 — Additional compact application theme.** Owner request:
"vorrei poter avere piu temi gia da subito non solo per chiaro e scuro ma anche
per fissare dimensioni padding ecc. vorrei un tema piu compatto oltre a quello
presente". This authorizes an additional application stylesheet; it does not
start stabilization phase 4 or introduce a runtime theme API.

Implemented `themes/gramlot-compact/theme.css`, following the sibling theme layout
of constitution 11.22 and the Base theme extension guide. Compact loads after Base
in the existing `Page.css` list, shares its color and semantic rules, and overrides
only density: 13px root typography, 1.35 body line height, 28px minimum single-line
controls/buttons, smaller gaps, headings, cards, table cells and native disclosures.
Base is unchanged. No CSS imports, duplicated color palette, server dependencies,
new builder attributes or dynamic theme registry are needed. The list can live on
a shared application Page base class. Paired GC-095 and both theme READMEs explain
selection; the binding-release exclusion now explicitly refers to a runtime theme
API, to avoid contradicting the existing CSS themes.

Verified: Chromium Base/Compact × light/dark, native field editing and keyboard
focus; no horizontal document overflow at 320/640/1280px on a Gramlot Source form
and table fixture. At 760px the input is 38.5px in Base and 28px in Compact; card
padding is 11.4px and 7.8px respectively. Build passes, 23 resource/runtime tests
pass with the repository Python environment, and strict public Sphinx plus local
links/mirrored anchors pass (8 pages). npm and Python resource copies match the
canonical CSS. Standalone single-file and directory exports both build and include
the expected CSS; these exports were not browser-opened. The existing esbuild
import.meta/iife warning appears in the standalone build, outside CSS scope.

The gallery's earlier local compact styling and light/dark selector are unchanged;
selecting Base/Compact interactively in the gallery is not implemented by this
stylesheet addition. Owner visual acceptance remains pending; no publication.


**2026-10-14 — Gallery appearance selector and sidebar splitter.** Owner confirmed:
"si mettili uno sotto l'alytro. metti anche uno splitter alla colonna di sinistra".
The shared Python and JS gallery now puts Theme (Base/Compact) above Color mode
(Light/Dark); defaults remain Compact/Light. This completes the interactive
selection left open in the preceding record. The canonical Compact stylesheet is
embedded at gallery build time from the core package, replacing the old authored
frame-style duplicate. Source style nodes enable/disable it via media; the existing
parent/frame protocol carries appearance and color, validating both and accepting
only the owning window. Styles and listeners are cleaned up with their Source.
Core runtime and example teaching code are unchanged.

A sidebar separator supports pointer drag and Left/Right, Home/End; Source owns its
width and ARIA state. Bounds are 120px to min(460px, 60vw), with viewport resizing
clamping the current width. Width survives lesson/theme switches and Source
reattachment, but is not stored across reloads. Pointer capture is released on
removal, and frames do not capture pointer input during a drag. Both splitters
share the existing gallery drag lifecycle. Fixed a test-discovered cleanup error by
placing the gallery style inside its Source branch and avoiding Source updates on
a node already being disposed. Paired GE-010 describes these behaviors.

Verified: 57 JavaScript and 16 Python example tests pass, including message origin
validation, theme independence, no frame replacement, Source freeze/reattachment,
sidebar bounds and removal during drag. Live Python (8185) and Node (8187) show both
selectors; Base fields measure about 38.5px and Compact fields 28px. Node drag moved
the sidebar to 300px; End reached 460px, viewport narrowing clamped it with no
horizontal overflow. Entered form text survived theme/color changes. Both browser
console error lists were empty. Standalone gallery export rebuilt with 42 examples;
file browsing remains unverified. Screenshot: /private/tmp/gramlot-gallery-theme-splitter.png.
No release/publication; D6 owner acceptance and phase 4 remain separate.


**2026-10-14 — Persist gallery display preferences.** Owner request: "vorrei che
il tema scelto e la larghezza della colonna sinistra venissero ricordati anche
quando ricarico la pagina". The gallery now stores appearance, color mode and
preferred sidebar width in browser localStorage, under
`gramlot.gallery.preferences:<gallery pathname>` (origin isolation belongs to the
browser). Restore updates Source controls/selected options, the local Bag, theme
style and sidebar ARIA. A narrow viewport clamps only the visible width, preserving
the desired width for a later wider viewport. User changes write the preference;
initial rendering and viewport resize do not overwrite it. Invalid saved values
are ignored without coercion; storage denial/quota errors leave the current UI
usable without introducing another persistence mechanism. No example data, open
tabs or other settings are stored. Paired GE-010 documents this behavior.

Verified: 21 gallery tests pass, including a fresh gallery restore and theme delivery
to newly opened frames, narrow/wide viewport behavior, malformed stored values and
storage SecurityError/QuotaExceededError. Live reload on Node 8187 and Python 8185
restored Base/Dark/130px; a newly opened Node form inherited Dark and Base's 38.5px
field height. Restored Compact/Light/280px afterward and confirmed those values
survived another Node reload. Standalone export rebuilt with 42 examples at
/private/tmp/gramlot-gallery-controls-static/index.html and includes the same
browser code; file-origin persistence has not been browser-qualified and requires
localStorage to be allowed by the browser. No server or core runtime change,
publication or phase-4 work. Screenshot: /private/tmp/gramlot-gallery-saved-preferences.png.


**2026-10-14 — Owner defers c17 Date/Decimal coverage.** The owner requested:
"per il moeto bnell esempio non mettere una data oppure inizializza la bag in un altro modo".
Keep the existing Python/JavaScript record with strings, number, boolean, null and
nested address; no alternate initialization or consumer workaround is introduced.
The lesson introduction now describes those values without presenting the upstream
defect as a prerequisite. The detailed limit and paired gallery guides link to
[genro-bag #69](https://github.com/genro-org/genro-bag/issues/69), opened at the
owner's request in the Python project with explicit coordination of the JS fix.
Read-only reproduction with JS Bag 0.10.3/TYTX 0.16.2 showed that constructor
ingestion and object-input fromJson lose Date/Decimal types; setItem followed by
Bag TYTX round-trip preserves them. Python Bag 0.27.0 dictionary ingestion keeps
both types. The deferred extension no longer blocks D6 teaching acceptance; the
upstream defect remains open. This does not accept D6 as a whole or authorize
stabilization phase 4. The executable c17 examples remain unchanged.


**2026-10-14 — Gallery settings footer.** Owner requested moving Theme, Color
mode and Keyboard navigation into a footer of the gallery shell. Both Python
and JavaScript declarations now place these controls in one full-width footer
below the sidebar and workspace. Compact inline groups wrap on narrow screens;
the sidebar retains its splitter and gains navigation space. Existing control
IDs, events and preference persistence are unchanged. Paired GE-010 and the
introductory text describe the new location.

Verified: gallery/browser build, 30 JS gallery/build tests and three Python
gallery-page tests pass. Live Python 8185 and Node 8187 show the footer. Node
1280x800 uses a 35px footer; the narrow Python viewport wraps the controls. Theme
and color changes, keyboard opt-in and theme/color restoration after reload were
checked in Node; no browser console errors were reported. Keyboard opt-in retains
its existing non-persistent behavior. Screenshot: /private/tmp/gramlot-gallery-footer.png.
This UI change does not authorize stabilization phase 4 or close D6 acceptance.

<a id="gc-070-780"></a>

## 780 · Dedicated inspector Web Component — 2026-10-14

Block ID: **GC-070-780**.

**Approved scope:** constitution 11.61 records the owner's request for a separate,
optional `gramlot-tools-inspector` Web Component in this repository, independently
of the Chrome extension and the future general component architecture. Work is in
the dedicated `codex/gramlot-tools-inspector` worktree; no unrelated uncommitted
changes from the coordinating checkout were imported.

**Implemented, not yet owner-accepted:** `tools/gramlot-tools-inspector/` contains a
private tool package, its separate build and a floating, resizable palette. Its UI
uses an independent Gramlot instance, Source, Data and named logic within Shadow
DOM. It observes an explicitly supplied `Gramlot` through public Data/Source Bag
APIs and shows trees, cached values and attributes. Selection and collapsed state
follow node identities. Inspection performs no target writes or resolver execution.
Closing/retargeting releases subscriptions; disconnect disposes the UI. The core
has no import or dependency on the tool. The Chrome extension and all dependencies
remain unmodified. Contract and setup: [GC-195](195-tools-inspector.md#gc-195-005).

**Verified in the dedicated worktree:** six Node tests PASS; separate tool build
PASS; real Chromium and Playwright WebKit checks PASS (Data/Source selection and
live updates, property view, keyboard movement, pointer dragging, native resize,
close/reconnect, and script CSP without unsafe-eval or unsafe-inline). The fixture
permits inline styles for bound position attributes. The Chromium screenshot was
visually inspected. These checks use the worktree's current core; they do not
qualify local changes in the coordinating checkout or claim a full core regression.

**Remaining qualification:** Firefox could not launch its installed Playwright
binary: "Could not find profile folder". The failure occurs before loading the
fixture, also with /private/tmp and an explicit worktree profile. Its browser test
remains available and is not weakened or silently skipped. Branded Safari and
file-origin/single-file export have not been tested. WebKit PASS does not substitute
for Safari. No target editing, debugger, cross-origin frame bridge, automatic gallery
integration or general Web Component framework is part of this implementation.

**Initial handoff:** review the component in its worktree, then qualify additional
browsers before claiming them. The integration review below supersedes this
handoff; owner acceptance and releases remain separate actions.
No commit, push, release or deployment was performed.


**Integration review completed — 2026-10-14:** the owner explicitly requested
review/integration and a footer icon targeting the selected example (11.61).
The tool is now integrated into the coordinating checkout, with the optional npm
entry `@gramlot/gramlot/tools/inspector`. The core runtime does not import it.
The palette's CSS is embedded in that optional artifact; it no longer needs an
adjacent stylesheet. Close emits a component event for the gallery launcher.

The Python and JS gallery footer now opens the tool in the selected preview.
Switching examples closes the old palette and opens the new one; introductions
disable the button. The existing gallery frame bridge carries only validated
open/close messages. Runtime constructors come from the running example, avoiding
a second bundled core; no adapter or dependency source was modified. Review found
and fixed an incorrect Source builder reference in this binding and initial palette
clipping in narrow previews. A regression executes the actual frame bundle with
the example runtime, tests live values and the Close event. All component internals
use Source/Data/named Logic; the gallery glue remains within its existing bounded
DOM/event integration responsibility. No general component architecture is added.

**Verified after integration:** core and gallery builds PASS; six component unit
tests PASS; 32 gallery/build JS tests PASS; three Python gallery tests PASS; five
core runtime-bundle checks PASS. Optional artifact exists and the served core
bundles contain no inspector. Chromium and Playwright WebKit component checks PASS
again after the final CSS/build changes. Real in-app browser checks cover the Node
and Python launchers, live Data observation, selected-example targeting and Close
synchronization. Static export regenerated all 42 examples; its Inspector and Source
tree were verified through a local HTTP static server without console errors.
Screenshot: `/private/tmp/gramlot-gallery-inspector.png`.

**Limits and next action:** integration is implemented and verified, awaiting owner
acceptance. Direct `file://`, branded Safari and Firefox remain unqualified (the
previous Firefox launcher failure is recorded above). Static export still emits
the existing esbuild warning about server assets' `import.meta` in IIFE output;
this did not prevent export or the tested static gallery. This task adds no shortcut,
package publication, release, commit or push, and does not start stabilization phase 4.


**Owner correction completed — editing and breakpoints, 2026-10-14:** following
"nell inspectorb manca la parte di editing sotto" and "anche i breakpoint", the
component now places a typed property editor below the Data/Source tree. This
supersedes the read-only implementation noted above; constitution 11.61 and GC-195
§025 record the scope. Draft fields use the inspector Data Bag and named Logic.
Apply validates cells and checks the selected node snapshot before public Bag
writes; Revert reloads it. Scalar attributes can be added, renamed and removed;
null attributes, unchanged value identity and schema metadata are preserved.
Supported values: string, finite number, safe integer, boolean, null, UTC Date/time/
datetime. Decimal, other objects, arrays, Bag branches, resolver values and `_meta`
remain read-only; this is not full editing parity with every DevTools scalar type.

Data and Source path breakpoints provide debugger/console modes, optional conditions,
exact-path matching, hit counts and removal. Checks run synchronously in the Bag
notification, retaining the writer stack. Conditions obey page CSP; invalid/blocked
compilation preserves an existing breakpoint and evaluation errors do not abort the
target write. Close/retarget releases subscriptions and clears configuration.
Browser debugger controls still own pause/resume/stepping; no privileged extension
API, dependency-source modification or general component framework was added.

Verification: 14 component/scalar tests PASS; 32 gallery/build checks PASS; five
core runtime-bundle checks PASS; core/tool/gallery builds PASS. Chromium and WebKit
browser tests PASS for Data/Source edits, console breakpoints, CSP rejection and
existing move/resize/reconnect behavior. Chromium additionally verified a real
Debugger pause/resume with the Bag writer in its stack. Node gallery UI verified
Data edits and a console hit; Python gallery verified a Source edit. Static export
regenerated 42 examples; its Source edit and console breakpoint were verified via
HTTP, with no console errors. Screenshot:
`/private/tmp/gramlot-inspector-editor-breakpoints.png`.

Still unqualified: branded Safari, Firefox and direct file-origin execution. WebKit
is not Safari. Implementation and these checks are complete for this correction;
owner acceptance and any later extension of the editor's type coverage remain
separate. No commit, push, release or deployment; stabilization phase 4 is unchanged.


**2026-10-14 — Provisional tree, first slice (constitution 11.62):** owner confirmed
`pane.webcomponent(code='gramlot-poc-tree')`, the staged plan and the explicit JS
Bag connection. The prior palette appearance is rejected, not accepted merely
because its editing/breakpoint tests passed. Implemented the generic declaration
in both languages, static/live tag rendering, literal-code validation and the
optional tree subset in `tools/poc/`. Named Logic receives selection through
`connect_onchange`; Bag transfer is the actual `storeBag` property. This slice is
not yet substituted into the gallery inspector.

Verification: 570/570 core JS tests, 133/133 core Python tests, 19/19 inspector/tool
unit tests pass. The first browser slice passes Chromium and Playwright WebKit for
both Python-authored TYTX and JS Source: rendering, selection, live updates, Source
inspection and row-action delivery. Reviewed screenshot:
`/private/tmp/gramlot-poc-tree-python.png`. Initial full-suite failures were local
server sandbox restrictions and stale generated runtime bundles; rebuilt bundles
and reran with local-server authorization. No remaining test failure.
The public Sphinx build and link/mirrored-anchor check also pass.

Pending: owner review of this tree, remaining provisional layout components, full
DevTools properties-grid/editing/breakpoint composition, visual comparison and
integrated three-gallery verification. Branded Safari, Firefox and direct-file
qualification remain unclaimed. Contract, sequence and provenance: GC-195 §030–035
and PORT-0006-inspector-components. No commit, push, release or deployment.


**2026-10-14 — Full provisional inspector composition (supersedes the first-slice
pending list above):** owner answered "ok" after the first tree review and proposed
full composition. Implemented `gramlot-poc-palette`, `gramlot-poc-tabs` and
`gramlot-poc-splitter`, isolated beside the tree in `tools/poc/`. The optional
inspector now declares all four via `webcomponent(code=...)` and retains
Source/Data/named Logic for its Properties grid, editing, breakpoint dialogs/list
and path footer. No PoC runtime, registry, duplicate core or dependency-source edits.

The interface follows the DevTools reference: compact label-only tree, underline
tabs, horizontal divider, grey property labels, editable value cells, + and hover
trash. Existing names/types stay fixed. Row exit/Enter commits; Escape reloads.
Focus survives commits between existing cells. Breakpoint dots target their own
row without changing selection; active dots, count/list (including deleted paths)
and selected-path hits remain available. The prior large form UI is replaced.

Verification: 20/20 tool/scalar/tree unit tests and 5/5 core runtime-bundle tests
pass. Core/tool/gallery builds pass; static export regenerated 42 examples.
Chromium and WebKit pass the real-browser fixture: Data/Source edits, typed
attribute add/remove, focusout commit, strict-CSP condition rejection, console
breakpoints, move/resize/splitter by pointer/keyboard and reconnect. Chromium also
verifies debugger pause/resume with the Bag writer frame still present.
Both engines pass Python 8185, Node 8187 and direct-file serverless integration:
Data/Source edits, breakpoint console hit and footer closure. Node was restarted
to replace its in-memory old assets. Visual review screenshot:
`/private/tmp/gramlot-inspector-devtools-style.png`.

Firefox qualification could not start: the installed Playwright Firefox exits with
"Could not find profile folder", including a retry with `/private/tmp` as its temp
root. Branded Safari remains untested; WebKit is not Safari. Decimal and unsupported
object editing remain read-only, as in the existing editor contract; this is not a
claim of full DevTools API parity. Final owner visual acceptance is separate.
The scoped implementation/integration is complete. No commit, push, release or
deployment; phase 4 has not started. Contracts/provenance: GC-195 and PORT-0006.


**2026-10-14 — Side-by-side density correction:** the owner supplied a screenshot
with the palette and extension together. Reference CSS confirms a remaining
mismatch: the extension tree inherits 11px from its inspector container, whereas
the provisional tree fixed 13px; the Properties heading inherited the palette’s
13px instead of the reference 11px. Both now use 11px; property cells align to
20px rows/19px inputs. Browser page zoom still affects an in-page tool independently
of DevTools zoom; no counter-zoom transform or browser-zoom override is introduced.

Density correction checks: 20/20 tool tests pass; Chromium and WebKit browser
qualification passes. Core/tool/gallery builds and the 42-example static export
were refreshed; Node 8187 restarted to serve the new in-memory assets.


**2026-10-14 — Single gallery palette and explicit page connections:** owner
confirmed "Sì, palette unica e collegamento completo" after requesting the same
shell/example selector as DevTools. Constitution 11.62 extends the former 11.61
open/close-only boundary. GC-195 §040 and GC-225 §035 record the names and contract.

Implemented one palette in the gallery shell. Its selector offers the shell and
the visible example; gallery tab changes follow the new example, while a manual
shell choice leaves that example visible. Introduction keeps shell inspection.
Explicit MessagePorts join registered frames to the palette. Page-side agents
read cached values, validate node identity/revision before edits, preserve unedited
values/metadata, and run conditions/breakpoints in the owning realm and writer
stack. Hidden examples retain their breakpoint configurations until reload or
palette close. No dependency source edits or automatic frame discovery.

The red breakpoint dot is in the left gutter, visible only on hover/keyboard
focus, never pinned by selection or an active breakpoint. The properties grid
preserves focus across remote commits. Tabs use string ARIA selection values and
the expected blue underline. Browser qualification exposed excessive redraws
while applying a large shell snapshot on WebKit: the provisional tree now
coalesces Bag event bursts, with a regression check for a 300-node update and
queued-render cancellation on disconnect. Unchanged snapshot attributes are not
rewritten in the panel copy.

Verification: 25/25 tool tests, 62/62 gallery tests and 5/5 runtime-bundle tests
pass. Chromium/WebKit pass the independent opaque-frame bridge fixture (Data and
Source editing, shell/child isolation, focus, page CSP and disconnect cleanup);
Chromium also verifies debugger pause/resume with the actual child writer stack.
Both engines pass integrated Python 8185, Node 8187 and direct-file serverless:
selector, shell and example edits, breakpoint console hits, hidden-tab preservation,
Introduction, close and reopen. Local-tool browser checks also pass, including
hover-only red/left actions, active-tab underline, dragging, resizing and keyboard.
Core/tool/gallery assets and the 42-example static export were rebuilt; the local
servers were refreshed. Public documentation link/mirrored-anchor checks pass.
Visual capture: `/private/tmp/gramlot-inspector-shell-selector.png`.

The requested scope is implemented and verified; final owner visual acceptance is
separate. Firefox remains unqualified because the installed Playwright browser
fails before page load with "Could not find profile folder". WebKit is not branded
Safari. Existing Decimal/object read-only limits remain; full DevTools API parity
is not claimed. No commit, push, release or deployment; phase 4 has not started.


Final-asset check: Chromium and WebKit also pass frame reload/reconnection and
active-tab blue underline on all three galleries, with no page errors. The local
Python launch must include the core and examples checkout `src` directories in
`PYTHONPATH`; without them its virtualenv resolves older installed packages. The
running 8185 server was corrected to use those explicit checkout paths. No package
installation or dependency-source change was needed.


**2026-10-14 — Breakpoint indicator states corrected at owner request:** this
supersedes the preceding hover-only active-state description. The left indicator
is a grey outlined circle on hover/keyboard focus when inactive. A set breakpoint
stays visible: red without a condition, yellow with a condition. Removing it
restores the inactive appearance. `conditionalPaths` accompanies `activePaths` in
the provisional tree descriptor, derived from existing breakpoint configuration.
Constitution, GC-195, GC-225, tool and gallery guides record the correction.

Verified: 25/25 tool tests; Chromium and WebKit browser checks cover the grey ring,
red/yellow persistent states, condition removal and breakpoint removal, in addition
to existing editor and CSP checks. Integrated Chromium checks pass on Python 8185,
Node 8187 and direct-file serverless through the real frame connection. Assets
and 42-example static export rebuilt; Node 8187 restarted. Scope complete; no
commit, push, release or deployment.


**2026-10-14 — Collapsible palette and header proportions:** owner requested a
collapsible floating palette, centered title and proportionate upper typography,
with a screenshot showing the previous oversized tabs. Constitution 11.62's
extension and GC-225 record the bounded `collapsed` contract. The left −/+ button
collapses to the title bar and restores the original size. Contents stay mounted,
so selection, breakpoints and live updates survive. Movement remains available
while collapsed; resize is hidden. The centered title has balanced left/right
controls. Header and tabs now use 11px, matching the tree/selector; tabs are 25px high.

Verification: 25/25 tool tests pass. Chromium and WebKit verify collapse/keyboard
restore, preserved dimensions, movement, continued updates, centered title and tab
font size, along with the existing editing/breakpoint checks. Chromium integration
passes Python 8185, Node 8187 and file serverless, including preserved selection
and conditional breakpoint indicators. Core/gallery assets and the 42-example
static export were refreshed; Node restarted. Visual checks:
`/private/tmp/inspector-expanded.png`, `/private/tmp/inspector-collapsed.png`.
Scope complete; no commit, push, release or deployment.


**2026-10-14 — Header alignment follow-up:** owner requested title on the left
and collapse/close together on the right, superseding the preceding centered title.
Updated the palette, guide mirrors and visual assertion. Verification: 25/25 tool
tests and Chromium/WebKit browser checks pass, including alignment, collapse,
restore, movement and close. Shared gallery assets and static export rebuilt;
Node 8187 restarted. Scope complete; no commit, push or release.


<a id="gc-070-785"></a>

## 785 · Reusable index and root installation — 2026-10-14

Block ID: **GC-070-785**.

Owner approval: constitution 11.63 records the overridable root manifest,
property-based opt-in and reusable index; the owner confirmed "Sì, schede con
iframe come nella galleria". Implemented and locally verified; visual/owner
acceptance remains with the owner. No release, publication or deployment.

Implemented:

- Core Python/JS `IndexPage` and `IndexLogic`: grouped navigation, lazy iframe
  tabs reused on reselection, fixed logo slot, sidebar splitter and replaceable
  or extensible footer. Standard Base/Compact, Light/Dark and sidebar width keep
  per-origin/path preferences; keyboard navigation remains a per-page choice.
- Root `installable`, `app_icon`/`appIcon`, default overridable `manifest` and
  `page_manifest`/`pageManifest`. Python's five adapters and Node expose plain
  GET/HEAD `app.webmanifest`; disabled roots return 404 and other verbs 405.
  Root bootstrap only; no page session, RPC registration or user data.
- Serverless directory export materializes the JSON and icon; a single-file
  export explicitly rejects an installable root. File execution still works;
  installation uses HTTPS or localhost. No service worker or offline cache.
- All galleries extend the reusable index while keeping catalogue, Markdown,
  source viewer and inspector in gramlot-examples. The footer has installation
  instructions and a native prompt button only when the browser supplies one.
- GC-095 §110 provides an independent Python-first application, its one-line
  Logic companion, the JS equivalent, footer customization and manifest override.
  Connected guides and their mirrors describe each environment. `_gramlot`
  system Data, fire services/mixins and legacy window-title behavior stay deferred.

Verification:

- Core: 131 Python tests passed in the first run; its five conformance cases
  then passed with local-server permission (the initial failure was socket
  sandboxing). JavaScript: 572 passed, then all three conformance tests passed
  with local-server permission; 575 cases in total. Includes new manifest,
  navigation, footer replacement, preference restoration and prompt/disposal tests.
- Examples: 16 Python tests plus 53 subtests; 62 JavaScript tests pass. Node:
  33 tests pass. Serverless: 34 tests pass, including refusal of single-file
  installation without overwriting existing output.
- Python adapters: 77 tests pass excluding `tests/kajenn/test_kajenn.py`.
  Correction after owner review (2026-10-14): `kajenn.server_app` was NOT removed.
  The installed Kajenn is 0.4.1, where the package is `kajenn_server_app`.
  Upstream commit `72c665afc096a1232f78711a6bcd6c476767eb1e` (2026-10-10),
  first included in v0.4.5, moved it to `kajenn.server_app` without an alias.
  The test imports the newer API; the local dependency is stale. The earlier
  attribution to an obsolete test was incorrect. Refresh the environment's
  Kajenn and rerun the full suite; do not introduce a compatibility import.
  The five new real-HTTP manifest cases pass, including on installed Kajenn 0.4.1.
  This was the initial verification limit; the follow-up below resolves it.
- Chromium and WebKit: all three galleries, direct-file serverless, theme
  propagation, iframe reuse and inspector opening pass. Chromium reports no
  manifest/installability errors for the three served galleries. Installation
  into the operating system was not performed; WebKit automation is not a
  claim of testing Safari's actual Add to Dock command.
- Independent IndexPage on Node and direct-file serverless passes both engines.
  The Python example copied verbatim from GC-095 also passes both engines,
  including its companion, footer, child iframe, manifest and served icon.
- Core public Sphinx build, links and paired anchors pass; both views of Node,
  serverless and Python server documentation build without warnings.

Local previews refreshed: Python 8185, Node 8187, static serverless 8189; static
export at `/private/tmp/gramlot-gallery-controls-static`. The separate example
qualification used temporary port 8190. This work does not close stabilization
phase 4 or the owner's didactic acceptance.


**2026-10-14 — Kajenn environment refresh:** owner requested the update and
asked whether 0.5.0 was available. PyPI and GitHub's latest published release
both report 0.4.7 (GitHub release published 2026-10-13); no v0.5 tag was returned
at verification time. Updated only gramlot-py-server's local virtual environment
from Kajenn 0.4.1 to 0.4.7, also installing kajenn-kbus 0.1.2. The import
`kajenn.server_app.ServerApplication` now resolves without code changes or aliases.
The complete five-adapter suite passes: **92 tests**, including authentication
and all five manifest cases. `pip check` finds no broken requirements. The only
test warning is an existing Starlette/httpx deprecation, unrelated to Kajenn.
The environment mismatch is resolved; no dependency pin, test exclusion or
source compatibility workaround was added.


**2026-10-14 — Kajenn 0.5.0 follow-up:** a fresh owner-requested check now finds
0.5.0 on both PyPI and GitHub (release published at 18:27:12 UTC). Completed the
already authorized environment update from 0.4.7 to 0.5.0. The full five-adapter
suite again passes: **92 tests**, including authentication and manifest; `pip
check` reports no broken requirements. The same existing Starlette/httpx
warning remains. No application code or dependency constraints changed.


<a id="gc-070-790"></a>

## 790 · Stabilization phase 4 — Style/class parity — 2026-10-14

Block ID: **GC-070-790**.

Owner confirmation: replied "ok" to accepting the gallery/documentation and
starting phase 4; after asking what phase 4 meant, confirmed "ok" again following
the explanation of string/null validation. Teaching acceptance is therefore
recorded; phase 4 implementation is complete and locally verified. This does not
start phase 5 or authorize a release.

Python and JavaScript Gramlot renderers now validate resolved `style`/`class`
values before Builder's attribute/style composition. The internal shared guard
also covers literal `html_style`/`html_class`, `_class`, SVG nodes, sub-builder
boundaries and metadata-provided render attributes. Lists/arrays, mappings,
booleans and numbers are rejected. Style shortcuts keep their own existing
contract, including numeric widths and other legitimate values. No upstream
Builder/Bag edits, aliases or type coercions were introduced.

Static renderers still defer inline `==` expressions; live rendering validates
the evaluated result. The same guard runs on initial rendering, Data projection
and Source attribute edits. Invalid updates leave the last displayed attribute
unchanged; there is no rollback of the triggering Data/Source write. A later
valid string or null resumes projection without replacing the DOM node.

Verification: before the fix the new Python matrix exposed 90 failing subcases;
new JavaScript checks reproduced missing or inconsistent rejection. After the
fix, **139 Python tests plus 252 subtests** and **580 JavaScript tests** pass
across the full core suites. Chromium and WebKit each pass 18 invalid Data
projections plus valid-value recovery, null removal and stable element identity
against the rebuilt runtime. Public documentation builds with warnings as errors,
and all eight published pages pass local-link and mirrored-anchor checks.
The Python suite's warnings exercise existing deprecated `_class`/`_if` spellings;
these are unrelated to the validation correction.

Next: request phase 5 (responsibility review and fixed remote method/pointer-policy
follow-up). Its unresolved live remote Source semantics require the owner's
explicit decision before implementation. Final cross-environment qualification
remains phase 6. No commit, push, release or deployment was performed.


**2026-10-14 — Builder pointer policy resolved upstream:** owner clarified
"per i pointer nei builder è stato risolto". Read-only verification confirms
[genro-builders #56](https://github.com/genro-org/genro-builders/issues/56) is
closed (2026-10-13), and main contains the Python CustomTypes guide and the JS
custom-types contract tests. The earlier phase-5 design TODO in §760 is superseded:
do not reopen the field/default-policy design or invent a pointer flag.

The delivered solution is `CustomTypes` with reusable named constraints, e.g.
`ct.no_pointer`, applied to original input before runtime resolution or pointer
discovery. A grammar 1.2 catalog carries the constraint to JavaScript; ordinary
strings retain their existing behavior. Builder tests cover authoring, edited and
serialized Source. A handwritten helper must attach the constraint to the actual
Source attribute (`remote` for Gramlot's remote method), not only validate its
argument. Upstream documentation explicitly leaves Gramlot integration to Gramlot.

Remaining phase-5 work is to adopt that existing contract in Gramlot and verify
the fixed remote method, alongside the responsibility review. This inspection
found older core test installations (Python genro-builders 0.27.0; JS builders
0.4.2), not evidence that current upstream is missing the feature. No dependency
update, framework implementation or phase-5 start occurred in this clarification.
Evidence: upstream `docs/builders/custom-types.md` and JS
`tests/custom-types.test.js` on main. No Builder or Bag source was edited.


<a id="gc-070-795"></a>
## 795 · CustomTypes adoption: dependency qualification — 2026-10-14

Block ID: **GC-070-795**.

Owner confirmation: "ok", following the upstream pointer-policy resolution in
§790. Scope: adopt the delivered Builder constraint for the fixed remote method;
reactive parameters remain supported. This does not decide live Source mutation
semantics or authorize changes to Builder/Bag sources.

Phase 5 started with a dependency refresh. Python now uses genro-builders 0.28.1,
genro-bag 0.28.0 and genro-tytx 0.16.2. The npm update installs Builders 0.5.0,
Bag 0.10.3 and TYTX 0.16.2. The new Python Bag serializes row parent paths as
arrays; npm Bag 0.10.3 expects strings. A minimal Bag containing only `name: Ada`
fails Python-to-JavaScript decoding with `Missing or undecodable TYTX parent
branch`, without importing Gramlot.

Read-only upstream inspection found Bag JS main at 0.11.0 (observed commit
6aea9bfd923a0ea66529e773e01aab78920cbdb7). Installing that branch locally through
npm, without a lockfile or saved version pin, makes the minimal interchange pass.
However, Builders JS 0.5.0, including its upstream main package manifest, requires
`@genrojs/bag: ^0.10.3`. npm therefore retains a second Bag 0.10.3 beneath Builders;
importing both throws `TYTX suffix 'X' is already registered for Bag`. This
upstream dependency range must be aligned in its owning repository. No installed
source patch, override, old-version pin or Gramlot transport workaround was added.

Independent core correction: the instance grammar loader now copies its schema
with the existing `deepcopy()` API. `Bag(source=existing_bag)` is no longer a
supported constructor call. All six focused collection/copy tests and eight
subtests pass, including instance isolation, atomic failure and whole-declaration
replacement. The full Python suite now has 137 passing tests and 252 passing
subtests, with two failures retained for explicit review:

- P25 promises nested lists remain lists; new Bag population converts them into
  Bags. Do not silently change Gramlot's documented P25 or introduce a converter.
- The historical null-attribute probe expects deserialization to drop nulls;
  the new Bag preserves them. This is changed upstream behavior, not proof of a
  new Gramlot failure, and needs its legacy probe/documentation reconciled.

Before the JS main install, the full JS run reported 550/580 passing tests; after
it, duplicate Bag registration prevents 49 test files from loading (10 tests
pass). These are different runs, not a comparable regression count. Runtime
bundles were rebuilt during qualification; the current local environment is not
qualified for use or release. Earlier §790 green results apply to its earlier
dependency set, not this refreshed installation.

The CustomTypes grammar mapping and fixed-remote runtime correction remain
unimplemented. Resume after the dependency alignment and P25 contract review;
then cover authoring, received/edited Source and valid variable parameters.
No new issue, commit, push, release or deployment was performed. No Builder/Bag
source was edited. Local evidence: `/private/tmp/phase5-python-after-copy.log`,
`/private/tmp/phase5-js-baseline.log`, `/private/tmp/phase5-js-upstream-main.log`,
`/private/tmp/phase5-collection-check.log`, and `/private/tmp/phase5-bag-wire.json`.


<a id="gc-070-800"></a>
## 800 · Recursive authoring contract aligned — 2026-10-14

Block ID: **GC-070-800**.

Owner correction: "se inizializzi una bag da un json è perche vuoi creare una
bag dello stesso contenuto logico. per questo il default e recursive"; explicit
scope: "ok procedi ad aggiornare documentazione e test per il comportamento
ricorsivo". Constitution 11.64 records this clarification and supersedes the
nested-list clause of 11.47 item 2/P25. The P25 mismatch reported in §795 was an
outdated Gramlot expectation, not a Bag defect or a remaining design blocker.

Maintained authoring guides and the P25 contract now describe default recursive
Bag population: nested dictionaries and lists become Bags, preserving order and
scalar leaf values, including empty containers. Direct literal list values and
JSON strings are outside the dictionary/plain-object conversion trigger and keep
their existing behavior. No runtime converter or dependency-source change was
introduced.

Python authoring/transport checks and the four-direction Python/JS fixture now
assert nested Bag types, sequence order, dictionaries inside lists, further nested
lists, false/null leaves and empty lists. Direct list and JSON-string checks
remain. Verification: all 16 Python binding-authoring tests plus 23 subtests pass;
JavaScript syntax validation passes; strict Sphinx build and all eight public
pages' link/mirrored-anchor checks pass. The targeted JS P25 test cannot start:
Builders' nested Bag 0.10.3 and root Bag 0.11.0 both register TYTX suffix X. Its
runtime assertions and cross-language round trips are therefore still unverified
in this environment; no successful JS run is claimed.

Remaining phase-5 work: resolve the separate upstream Builders JS dependency
alignment, rerun the cross-language tests, reconcile the unrelated legacy null
probe, and resume fixed-remote/CustomTypes integration. The recursive-population
documentation/test update is complete. No commit, push or publication was made.
Evidence: `/private/tmp/recursive-authoring-python.log`,
`/private/tmp/recursive-authoring-js.log`, `/private/tmp/recursive-docs.log`.


<a id="gc-070-805"></a>
## 805 · Builders JS Bag alignment verified locally — 2026-10-14

Block ID: **GC-070-805**.

Owner: "ok procedi, ti autorizzo a correggere la dipendenza in Builders JS e poi
aggiorna Gramlot e verifica i test". Constitution 11.65 records the bounded
exception to the dependency-edit restriction.

Builders JS was corrected in its owning checkout
`/Users/gporcari/Sviluppo/genro_ng/meta-genro-modules/sub-projects/genro-builders-js`,
starting from current upstream main. npm and JSR now require Bag >=0.11.0 and TYTX
>=0.16.2 without upper caps. Its tracked dependency lock was removed and ignored;
CI/setup use `npm install --no-package-lock`, with the npm cache keyed by the
package manifest. README installation guidance matches. No Builder runtime or
Bag source was changed. All 150 Builders JS tests pass with published Bag 0.11.0
and TYTX 0.16.2.

The corrected Builders checkout was packed locally and installed into Gramlot
without saving the temporary archive as a dependency or creating a lockfile.
`npm ls` confirms a single shared Bag 0.11.0 and a single TYTX 0.16.2 instance,
including through Builders 0.5.0. Gramlot npm/JSR minimum requirements now name
Bag 0.11.0, Builders 0.5.0 and TYTX 0.16.2 without upper caps. Python requirements
match the verified Bag 0.28.0, Builders 0.28.1 and TYTX 0.16.2. Runtime bundles were
rebuilt from that dependency set.

The two historical dependency probes expecting TYTX null-attribute loss now
assert preservation, matching both current Bags. No transport workaround or
setter-rule change was introduced: R17 authoring checks still pass. The recursive
P25 tests from §800 now pass through all four Python/JavaScript transport paths.

Verification: **150 Builders JS tests; 580 Gramlot JavaScript tests; 139 Python
tests plus 254 subtests; eight Chromium runtime-origin checks** all pass. Browser
checks cover debug/minified bundles in both package locations, localhost and an
ordinary HTTP origin, mount, Data binding, references and instance isolation.
The Python warnings concern existing deprecated `_class`/`_if` spellings, not
failed checks. HTTPS, JSR installation and hosted CI were not exercised here.

Important distribution boundary: the corrected Builders archive still carries
its existing 0.5.0 version and is used only for local verification. The published
Builders 0.5.0 still has the old requirement; reinstalling it from the registry
would reintroduce the conflict. A separately authorized version bump/publication
is needed before the correction is available to normal external installations.
No commit, push, version bump, package release or deployment was performed.

The dependency correction requested here is complete and locally verified. The
remaining phase-5 fixed-remote/CustomTypes implementation and undecided live Source
semantics are separate work; this verification does not claim they are complete.
Evidence: `/private/tmp/builders-bag-tests.log`,
`/private/tmp/gramlot-bag-js-final.log`, `/private/tmp/gramlot-bag-python-final.log`,
`/private/tmp/gramlot-bag-browser.log`; local verification archive:
`/private/tmp/gramlot-builders-bag-verification/genrojs-builders-0.5.0.tgz`.


<a id="gc-070-810"></a>
## 810 · Builders JS release: npm published, JSR decision pending — 2026-10-14

Block ID: **GC-070-810**.

Owner explicitly authorized the Builders JS version bump, commit, push and
publication. Commit `05b505bef79b8eac55c0be5758c0c37587d95049` and tag `v0.5.1`
were pushed to upstream main. All 150 tests pass locally and hosted Test CI
succeeded. Publish run 38630263058 passed its test and npm jobs; npm
`@genrojs/builders@0.5.1` is published and its dependency metadata is verified.
Gramlot now installs that registry artifact and shares Bag 0.11.0 with it.
After rebuilding the runtime, all 580 Gramlot JavaScript tests pass against the
published artifact (`/private/tmp/gramlot-builders-051-registry-tests.log`).

JSR publication failed before uploading: its package specifier grammar rejects
`>=0.11.0`. A local 0.5.2 repair draft with wildcard JSR ranges was checked with
`npx jsr publish --dry-run`; JSR also rejects `*` as a missing version constraint.
No 0.5.2 commit/tag/publication has occurred. A question is pending with the owner
because the repository rule forbids first-party upper caps: permit bounded ranges
only in JSR (`^0.11.0` for Bag, `^0.16.2` for TYTX), or retain npm-only publication.
No exception is inferred from the failed publication or the earlier release request.
The wildcard draft is not a valid release and must be resolved before continuation.

Evidence: [publish run](https://github.com/genro-org/genro-builders-js/actions/runs/38630263058),
[Test CI](https://github.com/genro-org/genro-builders-js/actions/runs/38630263817),
`/private/tmp/builders-052-jsr-dry.log`, and
`/private/tmp/gramlot-builders-051-registry-tree.log`.


<a id="gc-070-815"></a>
## 815 · Builders JS 0.5.2 published on npm and JSR — 2026-10-14

Block ID: **GC-070-815**.

Owner confirmed "Sì, eccezione solo per JSR" for Bag `^0.11.0` and TYTX `^0.16.2`;
constitution 11.65 records the bounded exception. The earlier wildcard draft was
replaced by those approved constraints. npm retains minimum-only ranges. README,
changelog and JSR metadata reflect the final release configuration. JSR dry-run
passed, as did all 150 Builders JS tests.

Commit `7984db59e7eeef63fcc2b22adc5092505a00d0fb` and tag `v0.5.2` are on upstream
main. [Publish run 38631140108](https://github.com/genro-org/genro-builders-js/actions/runs/38631140108)
succeeded in all three jobs (test, npm, JSR); the independent
[Test run 38631141935](https://github.com/genro-org/genro-builders-js/actions/runs/38631141935)
also succeeded. Registry metadata confirms npm `@genrojs/builders@0.5.2` and JSR
`@genro/builders@0.5.2`, both latest. The partially published 0.5.1 was not rewritten.
The Builders checkout has no uncommitted changes.

Gramlot's minimum npm requirement is now Builders >=0.5.2. Its JSR imports use the
approved JSR-only bounded form for this alignment (Builders ^0.5.2, Bag ^0.11.0,
TYTX ^0.16.2). Installing the published npm 0.5.2 with a fresh cache succeeded;
`npm ls` confirms one Bag 0.11.0 and one TYTX 0.16.2 shared with Builders.
After rebuilding runtime bundles, all **580 Gramlot JS tests pass** against the
published artifact, including the four-direction recursive P25 cases. Python and
browser checks from §805 were not repeated for this metadata-only release repair.

The authorized Builders bump/commit/push/publication and Gramlot dependency update
are complete. No Gramlot commit, release or deployment was made. Fixed-remote/
CustomTypes implementation and live Source semantics remain separate phase-5 work.
Evidence: `/private/tmp/builders-052-jsr-final-dry.log`,
`/private/tmp/builders-052-tests.log`, `/private/tmp/builders-052-npm-latest.json`,
`/private/tmp/builders-052-jsr-receipt.json`, `/private/tmp/gramlot-builders-052-tests.log`.

<a id="gc-070-820"></a>
## 820 · Phase 5 — Responsibility review and scoped deferral — 2026-10-14

Block ID: **GC-070-820**.

**Authority and scope.** The owner instructed "allora lascia stare questo punto
e prcedi col resto", after declining the common-attribute Builder extension and
stating that documenting the unsupported dynamic remote method is enough for now.
Constitution 11.66 records the deferral of additional enforcement/CustomTypes
integration. Existing helpers and runtime behavior are unchanged; a dynamic
method is not thereby supported. Q2 (live Source declaration edits) remains an
open contract decision: this review adds no trigger or lifecycle semantics.

### Request ownership

| Owner | Lifetime and effect | Cancellation and completion |
| --- | --- | --- |
| `SourceHandler.remoteSource` | One replacement per mounted target NodeBinding; validates incoming Source before replacing children | Superseding requests and node removal abort; request identity, signal, page state and binding state guard the mount; `finally` releases tracking and deletes only the matching map entry |
| `RemoteBinding` | Declarative parameters, condition, last successfully mounted cache and callback | Delegates transport/mount to SourceHandler; a false condition or cache hit cancels the pending request; failure does not overwrite the last successful cache |
| `Provider` for `dataRpc` | One triggered endpoint call per provider, optional result-path write and callbacks | Latest call wins; removal aborts; timeout races the call even if transport ignores its signal; superseded/closed calls cannot write or invoke completion callbacks |
| `Provider` for `dataRemote` and `RpcResolver` | Provider installs/replaces the resolver; resolver loads on reads, coalesces pending reads and applies cacheTime | Uninstall aborts its load and removes only the resolver it owns; resolver checks the signal even after an answer arrives; failure leaves the last value unchanged |
| `RpcHandler.call` | Shared envelope, request identity and typed response/error decoding | Passes the owner's signal to the transport; does not choose the owner's lifetime or Data/Source effect |

The shared invariants are ownership of the result, suppression of late answers,
cleanup on node removal and preservation of the last valid contents on failure.
Timers, callbacks, Source replacement and lazy Data loading have different
contracts. Similar AbortController/finally code is not evidence that one generic
request manager would be simpler. **Review conclusion:** no extraction or Provider
hierarchy rewrite is warranted by the inspected paths; none was implemented.
A false `dataRpc` condition only suppresses that invocation, whereas declarative
`remote` explicitly cancels in-flight work and `dataRemote` uninstalls its resolver.
Those different semantics must not be homogenized by a refactor.

### Provider and attribute ownership

| Declaration/table | Authoritative purpose | Review disposition |
| --- | --- | --- |
| Python `collections/binding.json`, packaged JS `builder/binding.json` | Five data elements and their signatures; `data_element` metadata | Byte-identical; `dataSetter` installs values, the other four have providers |
| `BindingRuntime.PROVIDERS` | Four concrete provider dispatch targets | Matches the grammar's executable providers; excluding dataSetter is intentional |
| `installation.js` provider/lifecycle/RPC lists | Received-Source placement rules; lifecycle restrictions; callbacks only on dataRpc | Same four provider tags; dataRemote intentionally has no startup lifecycle trigger |
| `providers.js` control attributes | Exclude control fields from endpoint/body arguments | Execution contract, not the HTML filtering list; includes resolved `if`/`else`, method, timeout and cacheTime |
| `source.js` code-attribute lists | Activate only declared inline code on received Source | Formula/controller bodies, RPC callbacks and remote controls have distinct roles; this is not a provider dispatch registry |
| Python/JS builder Data-path/inline maps | P18 path restrictions and mutually exclusive inline/named bodies | Corresponding mappings agree; no new grammar metadata is needed |
| Python/JS renderer binding filters | Keep runtime-only attributes out of DOM output | Matching names/prefixes; provider-only controls need not become universal HTML filters because provider nodes do not render |

No conflicting provider enumeration was found in these inspected paths. The
lists overlap because they answer different questions; replacing them with a
single new registry is not justified. Existing behavioral tests remain the parity
checks, rather than tests that merely copy the implementation's constants.

### Documentation, verification and next gate

The earlier editorial work already marks §015's S00 instructions historical,
corrects §695's chronology and distinguishes delivered Kajenn avatar auth from
planned genro-routes integration in GC-230. Public GC-095 and its mirror now
explicitly distinguish helper rejection from incomplete direct/edited Source
validation; no universal rejection is claimed.

**167 targeted JavaScript tests pass**, covering RPC, remote, dataRemote,
Source pipeline, providers, installation, inline code, authoring and lifecycle.
The first invocation used the system Python and failed subprocess imports; rerun
with the repository `.venv/bin` on PATH passed all cases without exclusions or
source changes. Evidence: `/private/tmp/gramlot-phase5-review-tests.log`.
The two existing dynamic-remote-name tests still characterize incidental runtime
behavior; they do not approve that API or prove enforcement of the literal-method
contract. Their correction is part of the owner's deferred item.

Strict Sphinx, public documentation checks (eight pages, search, sources and
local links), paired anchors for the three edited document pairs, binding grammar
byte identity, Python/JS Data-path/body maps and renderer binding filters pass.
Documentation log: `/private/tmp/gramlot-phase5-docs.log`.

The remaining responsibility review is complete, with no new runtime defect
reproduced in the reviewed supported cases. Owner acceptance and the phase-6
integrated qualification remain separate. Q2 is still undecided; it must not be
reported as implemented, tested to an agreed rule or implicitly accepted.
No new runtime architecture, dependency extension, release or deployment.

<a id="gc-070-825"></a>
## 825 · Phase 6 — Integrated qualification — 2026-10-14

Block ID: **GC-070-825**.

**Authority:** owner replied "ok" to proceeding with phase 6, the final integrated
qualification of core, browsers and servers. Qualification is complete in the
agreed scope. Acceptance, versioning and publication remain separate actions.
The remote enforcement deferral in 11.66 remains in force; Q2 is undecided and
unchanged, not a new lifecycle feature delivered by these checks.

### Corrections exposed by qualification

- **Multiple-select initialization:** b09 put `topics: ['html']` inside the
  initial record. Recursive Bag population correctly made it a nested Bag,
  while a multiple select requires an array. Both Python and JS examples now
  initialize `.topics` with a direct list-valued dataSetter. The lesson explains
  the distinction; regression checks cover initial selection and editing.
  No Bag conversion policy or control coercion was changed.
- **Typed Restore boundary:** the current `Bag.fromTytx` can populate a Bag from
  an untyped object/array. Using it in Restore therefore accepted a JSON export
  and replaced the target with the wrong logical structure. InOut now decodes
  with TYTX and requires a Bag root before writing Data, preserving the existing
  Save/Restore contract. Tests reject malformed JSON, plain objects, arrays,
  null/scalars and Bag JSON exports, retaining the original branch identity;
  typed date/datetime/decimal round trips still pass. GC-095 and its mirror
  state the boundary. No dependency source or permissive alternate path added.
- **Verification harnesses:** the Python page-browser check now supplies the
  existing fixture folder and calls its registered `check_fragment`; the
  Node/Bun gallery check uses IndexPage's current logo/color selectors. These
  correct stale test references, not application behavior.

### Verified final state

Runtime bundles were rebuilt after the Restore correction. Full core suites
then passed on that state; C07 verifies all four readable/minified artifacts.

| Gate | Result |
| --- | --- |
| Core JavaScript | 580 passed |
| Core Python (`pytest tests`) | 139 passed, 254 subtests passed |
| Python adapters against this core (`PYTHONPATH=core/src`) | 92 passed across Uvicorn, Django, Flask, FastAPI and Kajenn, including HTTP conformance/auth/manifest |
| Node and Bun adapter suites | 33 passed each |
| Serverless / project templates | 34 / 3 passed |
| Examples JS / Python | 62 / 16 passed; Python also 53 subtests |
| Chromium examples interactions | 41 Python and 41 JavaScript pages passed, including b09 multiple selection, c17 failed restore preservation, endpoints, remote fragments and local file exchange |
| Chromium hosted galleries | Node and Bun: 41 pages each, frame/theme propagation and named Logic |
| Chromium runtime origins | 8 checks: all four bundles on localhost and ordinary HTTP |
| Chromium HTTP page checks | Python remote Source/freeze/disposal; Node/Bun mounted paths and CSP; four Python/JS module/companion cases |
| Chromium live Source fixtures | Python and JS cards/playground: removal, sibling identity, insertion/text/SVG, animation and timer cleanup |
| Chromium and WebKit | Native binding/CSP/srcdoc, style/class rejection/recovery on the minified bundle (18 invalid projections per engine), typed InOut file round trips and errors |
| Chromium serverless browser | Quick start runs from one file and directory export without HTTP(S) |
| Documentation | Strict Sphinx; eight public pages, search/sources/local links; 55 document mirror pairs and anchors; both paired grammars byte-identical |

Reviewed the stabilization corrections against their agreed responsibilities:
TYTX cache snapshots/latest-wins belong to remote binding, HTTP-origin identifiers
to the existing runtime owners, HTTP input checks to adapters and shared
conformance fixtures, style/class checks to renderers, typed Restore to InOut.
No new generic manager, common-attribute Builder extension, fallback Source type
or dependency-source patch was introduced by qualification.

### Environment and limits

The server test installations were stale. Refreshed Python Bag/Builders/TYTX to
0.28.0/0.28.1/0.16.2 and JS Bag/Builders/TYTX to 0.11.0/0.5.2/0.16.2, without
first-party pins or lockfiles. JS tests resolve local core and examples checkouts;
Python adapter tests explicitly resolve this core source. The first JS setup
used the wrong examples package path and temporarily selected old nested copies;
correcting the link to the examples repository root removed the manifest failures.
The initial Bun errors disappeared with that correction. Playwright was installed
for the complete examples browser run. A bare pytest invocation also collected
retired code in `temp/`; the complete official suite is `pytest tests`.

Python adapter `pip check` passes with Kajenn 0.5.0. The core development virtual
environment still contains the obsolete installed `gramlot-kajenn 0.0.0.dev0`,
whose `genro-asgi`/`gramlot-minimal` dependencies are missing; it is not a core
requirement and was not used for qualification. This environment-cleanup debt
is not reported as a clean-environment installation check. Existing deprecated
attribute/Starlette warnings and serverless bundler import.meta warnings remain;
the tested paths pass. No real Safari UI, Firefox, HTTPS deployment, OS app
installation or clean release-artifact installation was newly qualified.

Evidence: `/private/tmp/gramlot-phase6-*.log`, notably `js`, `python-pytest`,
`py-adapters`, `bun`, `js-workspace`, `examples-tests`, `examples-python`,
`examples-browser`, `node-gallery`, `bun-gallery`, `browser-runtime`,
`style-browser`, `inout` and `docs`. Logs are local evidence, not released assets.

Next: owner acceptance and, if requested separately, release preparation.
The Date/Decimal authoring exercise remains deferred pending Bag #69; this does
not contradict successful typed Save/Restore. No commit, push, bump, publication
or deployment was performed by phase 6.


<a id="gc-070-830"></a>
## 830 · Integrated release preparation (2026-10-14)

Owner authorization: “ok” in reply to preparing the release after §825. This
covers preparation and verification; publication remains a separate approval.

Prepared candidates: core 0.2.17 (Python/npm/JSR), examples 0.2.12 (Python/npm),
JS server/serverless/create 0.2.9 and Python server 0.2.8. Package versions,
minimum dependencies, generated project requirements and release notes are
aligned. README notices explicitly distinguish prepared from published versions.
No first-party upper bound or lockfile was added; the approved JSR-only caret
exception remains in force. The deferred remote enforcement and Q2 are unchanged.

Packaging checks found the optional inspector missing from the JSR publish set;
added its generated bundle, its export, the index runtime export and app icon,
with an explicit self-import mapping to this core. Python metadata now includes
the README. All eleven wheel/sdist/npm archives contain licenses and exclude
local agent directories, node_modules, caches and credentials. Runtime, theme,
icon and gallery bundle bytes agree across the corresponding Python/npm archives.

Additional qualification:

- Fresh Python environment installed the three candidate wheels and all five
  adapter extras: `pip check` clean; all 92 adapter tests pass without a core
  source override. Kajenn resolves to 0.5.0. The obsolete package in the old
  development environment (§825) is absent from this installation.
- Fresh npm installation from all five candidate tarballs resolves without local
  checkout links or dependency errors. Generated serverless gallery succeeds.
- Chromium checks these installed Node and direct-file serverless galleries:
  native multiple selection, inspector Source tab, no page errors; hosted
  manifest/icon and the materialized static manifest pass.
- Workspace suites: server 33 and serverless 34 pass; the three generator tests
  pass after updating the expected core minimum. Inspector: 25 tests pass;
  Chromium and WebKit verify editing, breakpoints, CSP, keyboard, drag, resize
  and reconnection; Chromium also verifies debugger pause with writer stack.
- Python distribution metadata passes strict Twine checks. JSR dry-run passes
  with `--allow-dirty` for the uncommitted candidate (no publication). It retains
  warnings for dynamic imports and JavaScript entry points without declarations.
- Firefox inspector qualification could not start: the local headless browser
  reports a missing profile. No Firefox, branded Safari or OS app-installation
  result is claimed here. Prior §825 coverage remains applicable.

Artifacts and SHA-256 inventory: `/private/tmp/gramlot-release-candidate/`.
Detailed local evidence: `/private/tmp/gramlot-release-*.log` and the candidate
`RELEASE-CANDIDATE.md`. No commit, push, tag, registry publication or deployment
was performed during preparation. Next: owner authorization for release
consolidation/publication, in dependency order core → examples → servers.


<a id="gc-070-835"></a>
## 835 · Integrated release published (2026-10-15)

Owner authorization: “ok” to “Procedo con commit, push e pubblicazione?” after
§830; renewed as “Sì, riprova e completa il rilascio” after two automatic
approval-review deadlines interrupted read-only status checks. Scope: consolidate
verified work on main, commit, push, tag and publish the four connected releases.

| Repository | Release | Registries | Successful publishing workflow |
| --- | --- | --- | --- |
| Core | 0.2.17 | PyPI, npm, JSR | [38641715360](https://github.com/gramlot-org/gramlot/actions/runs/38641715360) |
| Examples | 0.2.12 | PyPI, npm | [38689407064](https://github.com/gramlot-org/gramlot-examples/actions/runs/38689407064) |
| JS server, serverless, create | 0.2.9 | npm, all three packages | [38689661132](https://github.com/gramlot-org/gramlot-js-server/actions/runs/38689661132) |
| Python server | 0.2.8 | PyPI | [38690143904](https://github.com/gramlot-org/gramlot-py-server/actions/runs/38690143904) |

All workflows, including their required verification jobs, completed successfully.
PyPI confirms both wheel and source archives for all three Python packages; npm
confirms the five exact versions and latest tags. The JSR publishing job records
successful publication of @gramlot/gramlot@0.2.17; a local metadata request was
403, so it is not claimed as an independent JSR read check. GitHub releases carry
the built distributions and SHA-256 inventories. Develop was merged with the
existing main history and both branches were pushed without force-pushing them.

### Corrections encountered while publishing

- The initial core workflow 38641516590 stopped before build/publication because
  pytest was missing from the test extra. Added pytest and switched both the test
  and coverage commands to the complete pytest suite (139 tests, 254 subtests
  locally). Updated only the unpublished tag and reran the workflow successfully.
- Python and serverless gallery verifiers still used old gallery logo/theme
  selectors. Updated them to the shared IndexPage selectors. All 42 serverless
  pages pass from disk; the five Python galleries pass. The initial local FastAPI
  and serverless timeouts did not reproduce in the diagnostic reruns or final CI.
- The first JS server publishing attempt could not install the newly published
  examples while npm propagation was incomplete. After confirming npm visibility,
  reran the failed jobs; the complete workflow and publication passed.
- Python clean-install checks still opened the removed environment Quick start
  routes. They now assert HTTP 404 while retaining the generated-project and e01
  browser checks. The corrected Uvicorn clean install passed locally; final CI
  passed clean installs for all five adapters, Python 3.11/3.12 adapter tests,
  documentation and browser galleries. Updated only the unpublished Python tag
  before the successful complete rerun; no published version was replaced.

Evidence is in the linked workflows and `/private/tmp/gramlot-publish-*.log`.
The development-only `.claude/` directory was not committed or distributed.
Earlier environment/browser limits in §§825–830 remain: no new branded Safari,
Firefox inspector or OS app-installation qualification. Remote enforcement is
owner-deferred, Q2 remains undecided, and the Date/Decimal authoring exercise
remains deferred pending Bag #69. The integrated release itself is complete.


<a id="gc-070-840"></a>
## 840 · Documentation alignment and examples manual (2026-10-15)

Owner instruction: “ok allinea tutto e configura read the docs anche per gli esempi”.
Scope: align the four repositories' README/manual claims with the published
releases, and configure and publish the examples manual. The owner created the
Read the Docs project (“l'ho fatto io”); its initial build 35158970 failed because
the repository configuration had not yet been pushed.

Corrected the server README qualification tables, Python core dependency floors,
obsolete development-only claims for the index, manifest, webcomponent and remote
cache corrections, and examples dependency/lesson status. Historical qualification
records and deferred work retain their meaning. Added cross-links to the examples
manual; no runtime behavior or package version changed.

The examples manual stages 48 public pages: README, two paired GE guides, learning
introduction, three family introductions and all 41 catalogue lessons. Navigation
keeps catalogue/release order. Source files are included with Python first; lesson
Markdown remains beside the executable pages. The classic Read the Docs theme and
logo are shared with the family. Configuration builds from main without importing
the application runtime. CI checks the complete page set, search scope, local links,
anchors and paired guide anchors. Local clean Sphinx builds pass with warnings as
errors for all four repositories (including the two server concise views). Browser
inspection confirms lesson navigation, expandable detail and highlighted sources.

Required pre-commit checks: Node server 33, serverless 34, create 3 and Bun 33 pass.
Python adapters: 92 pass after refreshing the local environment from stale core
0.2.16/examples 0.2.9 to the published dependencies. The initial five manifest
failures were from that old environment; no test or runtime workaround was added.
Publication completed after explicit owner confirmation: “Sì, commit e push sui
quattro repository”. The initial automatic approval review rejected the push for
lack of explicit publication authorization; that confirmation resolved the block.
All changes were committed and pushed to develop and main without force pushes.
No package release or tag was changed.

Published source revisions: core 16f7c40 (manual changes), examples 465dff9,
JS server 97121fe, Python server dddb26e. The final JS correction also aligns the
reference dependency floors with package metadata. Successful hosted checks:
core documentation 38693133205 and tests 38693133132; examples 38693112586;
JS server 38693403786; Python server 38693125040. All required jobs passed.

Read the Docs examples build [35159090](https://app.readthedocs.org/projects/gramlot-examples/builds/35159090/)
succeeded on 465dff9. The public [examples manual](https://gramlot-examples.readthedocs.io/en/latest/)
was opened and verified. Updated core, Python and JS reference pages were also
verified online. The public manual follows main through latest, as required by
GC-005. Read the Docs additionally attempted an automatic stable build (35159093)
from the existing release tag, which predates the documentation configuration;
that historical-tag build fails for the absent YAML. It does not block latest,
and the published tag was deliberately not rewritten. A future release tag will
include the new configuration. Package-registry README snapshots likewise retain
their original release contents; this work updates GitHub and the live manuals.


<a id="gc-070-845"></a>
## 845 · Practical entry page and optional Chrome DevTools link (2026-10-15)

Owner confirmation: "ok per collegamento e istruzioni" and "si in pratica deve
esserci nella doc di gramot una pagibetta pratica per chi ha fretta di provcare e
capire". Amendment 11.67 allows documentation links and installation instructions
for the separately maintained Chrome extension; it introduces no runtime dependency.

Implemented GC-018, a short public entry page linked from the README, the learning
guide and the public navigation. It compares Python/Uvicorn, Node.js and serverless,
links to the owning server repositories for installation and CLI instructions,
suggests Hello World, Forms and Native editing in teaching order, and directs the
reader to project creation. The optional extension section covers release ZIP,
extraction, unpacked loading, file-URL permission and reloading. GC-025 retains the
chronological release route. Expanded/concise copies and the public page allowlist
are aligned. The DevTools repository's documentation rule records the same bounded
exception.

Verified locally: Sphinx with warnings as errors and the public boundary/link/
anchor checks pass (nine pages including the README). Both DevTools documentation
views also build with warnings as errors. Documentation only; no runtime or package
version changes. These follow-up edits have not been committed or published.


<a id="gc-070-850"></a>
## 850 · Public websites: editorial HTML and interactive regions (2026-10-15, deferred)

Retained at the owner's request: "annotati queste cose perche ci torneremo su".
The detailed discussion now lives in [GC-190](../future/190-public-websites.md).
It covers the three public sites, HTML companions, a bounded dynamic root,
thumbnail activation versus expansion of an active region, legacy HtmlChunk,
and unanswered questions. This stable checkpoint is retained; no implementation
was started or authorized by the note.

<a id="gc-070-855"></a>
## 855 · Future-work directory and next-phase selection (2026-10-15)

Owner requested a directory for future work, parallel candidates and choosing the
next phase. [The future-work index](../future/README.md) collects separate cards
for public websites (GC-190), system Data/actions (GC-200) and general components
(GC-205), plus references to existing deferred items and the documentation delivery.
Each card distinguishes requirements, proposals, dependencies, possible parallel
work and completion evidence. The earlier GC-070 §850 link remains valid.
No priority or implementation phase was approved by organizing the backlog. The
initial website-first recommendation was subsequently withdrawn at the owner's
clarification; see §860.

Verified: paired card paths/anchors, relative links and documentation whitespace.
Internal planning material only; public documentation staging is unchanged.


<a id="gc-070-860"></a>
## 860 · Owner workstream inventory; priorities remain open (2026-10-15)

Owner corrected the proposed next-phase choice: "no. volevo elencarti i possibili
filoni per decidere priorita o parallelizzazione" (spelling normalized).
The website-first suggestion is withdrawn. The future-work index now preserves
his numbered groups: (1) legacy publish/subscribe, including interframe and
separate pages/users; (2) final Gramlot component definition, with (2.1) inputs and
(2.2) border/tab and other layouts; (3) database connections, with (3.1) dataRecord,
dataSelection and db selection; (4) stores; (5) store-based tree/grid widgets.

This is an inventory, not an approved execution sequence, architecture or assignment
to parallel workers. Existing website and system-Data notes remain available.
Compare scope, shared contracts and dependencies after the owner finishes listing
candidates. No implementation or next phase has started.

Verified: mirrored index/component card, preserved anchors, relative link targets
and whitespace. Internal documentation only.


<a id="gc-070-865"></a>
## 865 · Publish/subscribe release direction (2026-10-15)

Owner: "idealmente per finire la parte di data controller formula ecc farei la
publish e subscribe" (spelling normalized), then "si la 0.2.18 potrebbe gestire
publish e subscribe". Record **0.2.18 as the target for publish/subscribe**.
This supersedes the entirely unprioritized state of §860 for this workstream only.

The requested investigation includes the legacy pattern, interframe communication
and separate pages/users. Which of those belongs in the first release remains
undecided; do not infer a transport, delivery policy, authorization model or API.
Next: inspect the legacy and propose a bounded contract and verification scope.
The broader component/database/store workstreams retain their pending priorities.
No implementation, package-version change, commit/push or release is performed
or authorized by this planning record. Current published versions are unchanged.

Verified: matching planning statements and stable anchors in both views.

<a id="gc-070-870"></a>
## 870 · Detailed legacy publish/subscribe analysis (2026-10-15)

Owner requested an extremely detailed analysis of legacy publish/subscribe and its
interaction with dataControllers, then a separate decision on the porting plan.
The request includes local, interframe and cross-user communication from the
previous workstream discussion.

[GC-196](196-legacy-publish-subscribe.md) now records the source investigation at
GenroPy revision `fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`: local Dojo delivery,
Python declarations, provider argument construction and precedence, Data/formula/RPC
interaction, fire/reset, lifecycle, node/form scope, frame/window routing, system
`gnr.publisher`, queued datachanges, WebSocket routes, user stores and shared objects.
It separates observed behavior, reproduced quirks, inactive proposal code and
unverified deployment behavior. Complete isolated reproduction programs and pinned
source references are retained in the expanded document.

Verification: 21 focused JavaScript probes and 4 extracted Python-method probes
pass; the existing legacy Source lifecycle suite passes 8/8. This is not browser,
network, authentication or multi-user deployment qualification. The paired document
and future-work index were checked for anchors, links and evidence consistency.

Status: analysis delivered, owner review pending. No runtime implementation,
Builder/Bag changes, architectural amendment, release bump or publication.
**Next:** discuss and confirm the porting scope/contract after owner review; the
0.2.18 direction remains a target, not an approved full local/interframe/cross-user
feature set or an execution plan.

<a id="gc-070-875"></a>
## 875 · Private shared development guidance (2026-10-15)

Owner requested a private `gramlot-meta` repository in the Gramlot workspace to
share development guidance previously outside version control, after requesting
collaboration with fporcari. The existing private repository was reused:
[gramlot-org/gramlot-meta](https://github.com/gramlot-org/gramlot-meta).

Published a dated collection of 169 documents: workspace guidance, Astra/Claude
analyses, historical 0.2.0 plans, ignored core/DevTools documentation, original
PoC notes, pending worktree documents, GC-196 and the future-work pairs. Added
paired GM-010 onboarding and GM-015 catalogue with provenance, source state and
SHA-256 records. The 655 prior snapshots and all source originals remain intact.
No ownership transfer or automatic synchronization; core constitution and product
contracts remain canonical in their owning repositories. Historical drafts are
not promoted into approved plans. Recovery/session dumps, dependencies, runtime
source, environment files, databases, packages and operational logs are excluded.

Verified: all 824 archive hashes, all 169 new source-copy comparisons, maintained
guide links and the three guide pairs' stable anchors. Historical source-link gaps
are recorded separately. Both remote branches contain commit `8c84920`; main is
the default reference and GitHub confirms repository privacy. fporcari has read
access; no collaborator permission change was performed. Write access was offered
as a separate question and is not assumed.

Status: shared collection published. Publish/subscribe implementation scope and
port plan still await owner review of GC-196; no runtime or release change.


<a id="gc-070-880"></a>
## 880 · Publish/subscribe access point named (2026-10-15)

Owner resumed the porting discussion, asked whether messaging uses an object on
Gramlot, and answered "si" to the explicit `gramlot.subscriptions` name/access-point
question. Recorded the bounded naming decision in constitution 11.68 and GC-225
§040, including the exception to the three-letter proxy rule. Both views agree.

Only the name/access point is accepted. The illustrative methods, payload contract,
Source declaration syntax, dispatch and cleanup semantics and first-release scope
remain proposals/open decisions. The earlier page-only versus interframe question
has not been answered. No runtime implementation, dependency changes or release.
Next: settle the remaining contract one decision at a time, using GC-196 evidence.

Verification: paired amendment, naming and status records checked for identical
scope and matching stable anchors. Runtime tests do not apply to this decision-only
record; no behavior is claimed as implemented or verified.


<a id="gc-070-885"></a>
## 885 · Complete messaging syntax prepared for staged porting (2026-10-15)

Owner delegated the single-object publication choice ("sei tu che sai come
funzionava. quindi se ti sembra corretto procedi pure") and then explicitly
requested documentation of the complete syntax even if only part is implemented
initially. Recorded the selected `publish(topic, payload)` object shape as a
follow-up to constitution 11.68 / GC-225 §040, without approving every option.

Prepared [GM-020](https://github.com/gramlot-org/gramlot-meta/blob/main/docs/020-publish-subscribe-port.md)
and its compact counterpart in the private shared repository: twelve paired
sections cover the accepted decision ledger, callback/handle surface, payload and
provider argument proposals, Python/JS Source declarations, page/node/form scopes,
local/parent/frame/window/page/user destinations, lifecycle/errors, typed transport
boundaries, server-side proposal, legacy differences, implementation slices and
chronological teaching. Accepted naming/payload decisions remain distinct from
proposed scope/routing/dispatch behavior. No runtime feature is claimed available.

The recommended first slice is page-local dispatch with dataController/formula;
node/rendered/button/RPC extensions, related browsers and server delivery follow
separately, with framework-form support dependent on its own component contract.
All future syntax must be rejected explicitly until its capability is implemented;
no no-op routes or implicit local fallback. Exact implementation scope and the
remaining detailed semantics still need owner review of the prepared contract.

Verification: 12 matching anchors, maintained document links, Python snippet
parsing and five JavaScript syntax-only checks. Existing and new meta guide pairs
also match. These are documentation checks, not runtime or transport qualification.
The proposal is shared in gramlot-meta at `28f5efe`; core has documentation-only
updates and no code or dependency changes. fporcari's previously authorized write
access was verified, and the shared onboarding now reflects that permission.


<a id="gc-070-890"></a>
## 890 · Legacy object-reference investigation (2026-10-15)

Owner requested the important legacy "jsref" deviation before proceeding with
messaging. Found the concrete `js_sourceNode()` / `js_widget` / `js_domNode` /
`js_form` authoring helpers and browser `pyref`, at legacy revision
`fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`. Python adds a `__ref` attribute and emits
`==pyref(...)`; passing a GnrStructData directly as a child keyword value invokes
js_sourceNode automatically. This conversion is shallow. Browser attribute
resolution obtains the real current Source/widget/DOM/form object in that page.

Real dialog/login examples use the helpers, including subscription controllers.
Declared attributes are resolved after raw message payload fields are merged:
payload strings do not automatically gain expression evaluation. Local live-object
references and remote serialization are distinct. Missing/unbuilt targets have no
implicit readiness wait; generated references are not durable remote identities.

Recorded paired GM-025 in private gramlot-meta, linked from GM-020 as an open
reference-authoring design dependency. The single-object payload does not exclude
live local field values. No final Gramlot reference syntax, generic eval support,
transport mechanism or runtime implementation is approved by this investigation.
Verified 7 Python and 9 JS assertions on original extracted code, with controlled
Source lookup in a VM. Not full browser/network/serialization qualification.
Source locations/revision and assertion cases are retained in GM-025; guide
anchors and local links checked. No legacy or Gramlot runtime changes.


<a id="gc-070-895"></a>
## 895 · Object-reference restoration included in messaging scope (2026-10-15)

Owner explicitly required restoration of the legacy reference convenience within
subscribe. Constitution 11.69 records the functional scope: authored references,
automatic direct-node arguments and client object resolution for controllers;
Source/DOM in the initial local slice, component/form references tied to their
own contracts. Detailed helper syntax and timing/error semantics remain pending.

Read-only comparison found the existing Gramlot reference infrastructure:
`GramlotBuilder.reference(node, kind)`, descriptor `$gramlotRef`/`kind`, renderer
`References` and `gramlot.dom.reference`. Current kinds are node/dom; existing
cleanup/replacement/mounted checks must be reused. The missing author-argument
integration must not become a second registry or generic expression evaluator.
Updated GM-020's decision ledger, first-slice requirements and tests, and GM-025's
approved follow-up, distinguishing existing behavior from work still to implement.

Verification: two Python SourceTests and two selected JS source-contract tests
pass, covering Source transport, reference resolution, replacement and deletion.
These verify the existing foundation, not the new convenience or messaging.
No runtime/dependency changes, no completed port or release claim.


<a id="gc-070-900"></a>
## 900 · Public publish entry point corrected (2026-10-15)

Owner explicitly prefers `gramlot.publish`, with the subscription service used
internally, potentially named `_subscriptions`. Constitution 11.70 and GC-225
§040 supersede the earlier public service access point. GM-020 examples and
acceptance ledger follow the correction; subscribe/unsubscribe placement remains
proposed. No runtime changes or implementation test claims. Verified paired
anchors and removed the contradictory prohibition of `gramlot.publish` from the
maintained proposal; historical records remain historical.


<a id="gc-070-905"></a>
## 905 · Direct messaging methods and private service confirmed (2026-10-15)

Owner confirmed `gramlot.subscribe` and `gramlot.unsubscribe` alongside
`gramlot.publish`, with the exact private property `_subscriptions`. Updated
constitution 11.70, GC-225 §040 and paired GM-020. Node-targeted publication syntax
remains explicitly open for the next discussion; no proposal becomes accepted by
this naming decision. Documentation consistency checks only; no runtime changes.


<a id="gc-070-910"></a>
## 910 · Action and ask included in controller design (2026-10-15)

Owner requires button action, ask and chained button/controller/ask in the same
messaging/controller design (11.71). Legacy inspection confirms button `action`
with `ask`, nested controller activation via fireNode, and provider `_ask` before
execution, including subscription triggers. String confirmation and parameter
collection differ; results become run arguments with `_askResult`. A literal
chain `.ask()` was not established in the inspected legacy source/examples.
GM-020 records design coverage and qualification cases; exact syntax/implementation
remain pending. Source inspection and paired-document checks only, no runtime changes.


<a id="gc-070-915"></a>
## 915 · Messaging release plan prepared for owner review (2026-10-15)

Owner requested a logical plan for the 0.2.18 target before proceeding. Paired
GM-030 in private gramlot-meta proposes: settle contracts; authored references;
local page/node messaging; provider/button actions; ask; teaching/qualification.
GM-010 links the plan; GM-020 retains the complete wider syntax and roadmap.

Recommended release boundary is local messaging with references, actions and ask;
interframe/windows/server/users and framework-form/widget scopes are documented
future work. This boundary and the remaining detailed signatures are proposals,
not owner-approved by the act of planning. Start by confirming the boundary, then
node-target syntax; evaluate fluent ask and conditional behavior with the common
provider flow. Missing dialog/input capability must be addressed explicitly.

Verified paired plan anchors, local links, decision/proposal distinctions and the
phase dependency sequence. Runtime inspection confirms existing references and
nested provider activation, with ask/subscription declarations still excluded.
No runtime edits, new runtime test results, package publication or deployment.


<a id="gc-070-920"></a>
## 920 · Parent/child messaging added to release proposal (2026-10-15)

Owner prefers interframe in 0.2.18 so the primary page and its children can talk
in both directions. Revised paired GM-030: explicit direct parent/selected-child
exchange, followed by ask and qualification; seven phases. GM-010/020 linked
coverage updated. Unrelated windows, server/users, recursive broadcast and remote
live-object identity remain outside this bounded proposal. Frame addressing,
transport/connection, readiness, serialization and lifecycle require decisions.

Qualification includes child isolation, both directions, controller activation,
reload/close and unexpected senders, across Python/Node/serverless (including
file exports) and actual browsers. No automatic inspector bridge reuse or claim
that local Source/DOM references cross frames. Checked plan mirrors and anchors;
no runtime edits or new runtime tests. The full plan remains proposed for review.


<a id="gc-070-925"></a>
## 925 · Public themes and CSS guide (2026-10-15)

Owner instruction in the themes/CSS documentation chat: "Crea una guida completa
ai temi e ai CSS nel manuale pubblico, con catalogo delle variabili, esempi in
Python e best practice per personalizzare un'applicazione", emphasizing clear
explanations and examples. Scope is documentation of existing styling, without
new theme APIs or runtime changes.

Implemented paired GC-096 with a practical reading route, complete Python pages
and companion CSS, expected results, Base/Compact setup, shared application CSS,
cascade and scope, explicit/system colour modes, all 35 Base tokens, optional
classes, reactive styles, shell/frame boundaries, best practices and troubleshooting.
The guide enters the public Sphinx allowlist and navigation, with README/GC-095
entry links. Documentation-map/build-policy references and the concise view agree.

Verified all seven Python blocks by executing their declarations; checked complete
token-name coverage against Base. Chromium checks through the core's loopback test
server pass for Base, companion overrides, automatic dark mode, inherited Compact,
reactive class/width/visibility, narrow layout and no page errors. The interactive
snippet explicitly scopes its relative Data paths with datapath="appearance";
the initial missing-context draft was corrected before delivery. Public Sphinx
build passes with warnings treated as errors; generated pages, search, downloadable
sources, local links and paired anchors pass. Desktop/mobile manual screenshots
and rendered example screenshots were inspected. Guide-scoped table wrapping keeps
all nine reference tables within the desktop content column, preserving the
classic Read the Docs colours and typography. This is bounded Chromium evidence,
not an accessibility or cross-browser certification.

Existing CSS detail documented: explicit dark on a light system retains the blue
focus token, whereas automatic dark sets yellow. No theme/runtime correction is
part of this delivery. Guide implemented and locally verified; owner acceptance
and publication remain separate. No deployment or release performed.


<a id="gc-070-930"></a>
## 930 · Visual results in the CSS guide (2026-10-15)

Owner request in the themes/CSS documentation chat: "Negli esempi vorrei vedere
anche il risultato grafico, non solo il codice, così si capisce subito cosa
cambia quando personalizziamo i CSS." Scope: illustrate the existing guide with
actual rendered results and show the updated local manual.

Implemented six captioned comparisons using ten browser captures: Base before/
after companion CSS, Base/Compact, scoped Summary tokens, larger root text/card
padding, light/dark subtle surface, and initial/changed reactive controls.
Twelve figures reuse the common baseline and link to full-size images. Captions
name the corresponding declarations, mode or selected controls and their effects;
static screenshots are explicitly distinguished from running the Python page.
Paired guide, image allowlist and build/capture documentation updated.

Verified each capture visually. The examples ran through the core loopback test
host from temporary files extracted from the guide, using Gramlot Python Source
and Data bindings. The reactive capture follows real select/checkbox actions.
No runtime/theme edits, permanent core example app, or manual DOM construction.
Sphinx strict build passes; public-page/search/source/link/mirrored-anchor checks
pass for ten pages. In the rendered manual all twelve figures load, have alt text
and stay within the content column, without horizontal page overflow. The first
comparison was opened and inspected in the local browser preview. Implemented
and locally verified; owner acceptance and publication remain separate.


<a id="gc-070-935"></a>
## 935 · Code beside results and reader-facing headings (2026-10-15)

Owner request: "Mettiamo codice e risultato grafico affiancati, così si vede subito
quale modifica CSS produce quel risultato." The owner also asked whether the
visible `050`/`Block ID: GC-096-050` references are needed. They remain stable source
identities; the rendered manual omits their standalone labels and heading prefixes.

Implemented twelve code/result rows in GC-096, keeping complete Python examples,
placing the relevant declarations beside their captures, and explicitly labelling
the changed reactive Data values as a state snapshot rather than Python code.
Rows use two columns at desktop widths and stack on narrow screens. Full-size
image links remain. Sphinx renders clean titles in both headings and navigation;
numbered sources, mirrors, source downloads, section IDs and explicit anchors stay.
No framework or application theme changes. A new README link to GC-095 used a raw
HTML fragment MyST could not resolve; it now links to the authoring guide, matching
the other README entry and restoring the strict build.

Verified: strict Sphinx build and public-doc boundary/link/mirrored-anchor checks
pass for ten pages. Browser inspection confirms all twelve pairs have loaded images,
two columns at desktop size and a single column in the narrow preview, without
horizontal page overflow. The visible guide and its navigation have no metadata
labels or numeric heading prefixes. Desktop screenshot inspected; temporary
viewport override reset. Paired build notes and guide summary updated. Implemented
and locally verified; owner acceptance and publication remain separate.


<a id="gc-070-940"></a>
## 940 · Legacy-shaped messaging and native ask implemented (2026-10-15)

Owner authorized implementation after requesting legacy syntax preservation;
constitution 11.72 records that instruction, postMessage-only interframe calls
and explicit acceptance of native dialog/fields. GM-020/030 and their mirrors now
replace the superseded third-argument routing/scope proposal with the executable
contract and deferred grammar. PORT-0007 records the bounded port.

Implemented page publish/subscribe/unsubscribe over private _subscriptions;
legacy string/descriptor publication, Source self-topics, page/self declarations
on controllers/formulas/RPCs and rendered nodes. Existing Provider owns precedence,
filters, delays, cancellation and execution. Python/JS direct authored Source
arguments use the existing reference registry, including non-DOM controller nodes.
Live Source/DOM objects are rejected before frame/RPC serialization. No dependency
source changes, compatibility aliases, form framework or server/user bus.

Frame connections use postMessage exclusively with exact source/origin, readiness
and session checks. Local delivery is synchronous before asynchronous forwarding;
no queue or automatic retransmission. File/sandbox origins, load/reconnect,
pagehide/pageshow and Source-owned frame removal are covered. Native ask uses
Source/Data fields and named internal Logic, preserves legacy ask/_ask conditions,
removes temporary state and prevents execution after cancellation/owner disposal.
Fluent .ask, legacy widgets, unrelated windows and recursive broadcasts remain out.

Added chronological development examples c18/c19 in gramlot-examples: revisit c06
with page messages, self receivers/references and ask, then direct parent/child
exchange. Python authored first with equivalent JS/shared Logic. GC-095 §115 and
README link document the development feature without changing release numbers.

Verified: core JavaScript 601/601; Python 139 plus 250 subtests; examples JavaScript
64/64 and Python 16 plus 55 subtests. Core-owned browser harness passes on Chromium
and Playwright WebKit, HTTP and file, including opaque child frames, typed values,
reference routing, receiver controller, native modal confirmation/Escape and
reload/disposal. Both lessons pass in Chromium and WebKit through Python/Uvicorn,
Node and serverless directory export. WebKit coverage is not a claim of testing
the installed Safari app; other Python adapters and Bun were not run for these
new lessons. Core strict Sphinx/public-document checks pass. The examples strict
Sphinx build and validation of 43 lessons, paired guides and local links pass.

Verification found and fixed: file URL origin mismatch in Chromium, asymmetric
ready handshake after load, live-object serialization, non-DOM controller reference
registration and iframe connection cleanup. New regression tests preserve these
cases. Full pytest was rerun against maintained tests, not archived temp material;
fixture servers ran with loopback permission and an absolute Python interpreter.

Implemented and locally verified; owner acceptance and publication remain separate.
No version bump, package release or deployment. Next: owner review of this bounded
0.2.18 implementation, then an explicitly authorized release if accepted.


<a id="gc-070-945"></a>

## 945 · Inspector CSS variable trial (2026-10-15)

Owner: "si ma anche solo un modo di editare le variabili css", then "proviamo"
for the bounded proposal; constitution 11.73. The third Styles tab is implemented
for existing document-root --gramlot-* variables, grouped fields, hexadecimal
colour pickers, live temporary previews and individual/all reset. Local and
explicit MessagePort targets share tool-owned preview sheets. Removing the sheet
reveals the current cascade without rewriting application Source or CSS files.

Implemented and locally verified: 25/25 inspector/tool Node tests pass; the
optional package artifact builds. Chromium and WebKit pass the Styles fixture
(Base/Compact, 35 Base variables, text/colour edits, syntax rejection, references,
reset against the current cascade, Source preservation, independent preview
sheets, close/reconnect and empty state). The opaque-frame bridge checks pass in
both engines, including target isolation, retained previews across selection,
command rejection, close cleanup and preservation of another row's draft while
a reply is delayed. Existing Data/Source/editor/breakpoint browser checks also
pass in both engines. Documentation pairs have matching unique anchors.

The colour picker follows the existing Gramlot change-event contract; other CSS
values remain editable as text. Preview conflicts follow the ordinary cascade;
inline-important or descendant declarations may win. Root variables only. No
Firefox or branded Safari qualification is claimed for this trial. The standalone
Source fixture is available with `tests/styles-browser.mjs --serve` from the tool
folder; no integration-repository changes or publication were made. Visual
capture: `/private/tmp/gramlot-inspector-styles-chromium.png`.

Owner visual acceptance is pending. Persistence, theme selection and
individual-element styling remain deferred; the next action is the owner's trial.

Owner layout correction: "metti in colonna 1 il nome var in 2 il valore in 3
il picker". Compact rows now use aligned name, value, colour picker, and reset
columns, following the owner's clarification "metti il reset dopo il picker". Computed values move to field tooltips. Tool and optional
package builds pass; the Styles browser checks pass again in Chromium and
WebKit. Updated screenshot inspected and local preview refreshed. Owner visual
acceptance remains pending.


**Download follow-up (2026-10-15).** Owner "ok" to downloading only modified
variables as `theme-overrides.css`; recorded in constitution 11.73. Implemented
a Source-declared download link backed by a tool-owned Blob URL from applied
overrides. Expressions and preview priorities are retained. No defaults or
unapplied drafts, endpoint, theme selector or bridge command. URL cleanup covers
replacement/reset/retarget/close; downloads are unavailable during requests.
Verified: 25/25 Node tests, tool and optional package builds, Chromium/WebKit
Styles download/reapplication and opaque-frame download isolation pass. Pending
requests disable download. Screenshot inspected; local preview updated. Owner
visual acceptance remains separate.


<a id="gc-070-950"></a>
## 950 · Larger inline CSS results (2026-10-15)

Owner request: "Le immagini affiancate al codice sono un po' piccole: possiamo
renderle più leggibili, così si vedono bene le differenze senza doverle aprire
ogni volta?" Adjusted GC-096 presentation: at viewport widths of 1600px and above,
code/result columns use a 1:3 ratio; below that threshold results occupy the full
content width under the code. The guide content cap grows to 1440px. Images keep
their original pixels and aspect ratio and never enlarge beyond 1080px. Paired
guide/build descriptions updated; existing examples and application CSS unchanged.

Verified strict Sphinx build and ten-page public-doc checks. Browser measurement
at 1280px: preview width 861px (previously 489px), all images loaded, no horizontal
page overflow. At 1760px: code/result widths 328/984px, no overflow; screenshot
visually inspected. Temporary viewport reset and the user's guide refreshed.
Implemented and locally verified; owner visual acceptance remains separate.


<a id="gc-070-955"></a>
## 955 · Read the Docs inspector embed trial (2026-10-15)

Owner request: "Facciamo una prova con un esempio serverless incorporato in una
pagina del manuale di gramlot-examples e verifichiamo che funzioni su Read the
Docs. ad esempio dove parliamo del inspector". Scope: one existing Pointers
example and the existing gallery inspector, exported with the public serverless
build tool and served within the examples manual version. No core/runtime changes,
CDN dependency or package release. The trial is on develop pending owner acceptance.

Implemented in an isolated examples checkout to preserve unrelated ongoing work.
Local verification: strict Sphinx build, all 41 lesson links/anchors and search
coverage pass. Chrome loads the nested iframe, runs the Worker, updates the
heading through the Caption input, and updates the example through inspector
Data > settings.caption > Value. Native browser input confirms both directions.
Read the Docs build [35170555](https://app.readthedocs.org/projects/gramlot-examples/builds/35170555/)
succeeded for examples commit `0e8cb9c854d4727bd55badd170e58614272b3a26`.
[Examples CI](https://github.com/gramlot-org/gramlot-examples/actions/runs/38758754933)
also passed for that commit.
Hosted Chrome verification passed: Caption input updates the heading and symbolic
binding; inspector Data > settings.caption > Value updates those same outputs and
the input; Source expands main and its children. No page console errors were
captured. The example runtime and assets are served by Read the Docs itself.
The [live trial](https://gramlot-examples.readthedocs.io/en/develop/docs/010-gallery.html#ge-010-042)
is implemented and verified on develop. Owner acceptance and consolidation into
main remain separate from this completed trial.


**Compact embed follow-up (2026-10-15).** Owner: "bene. eviterei tutta la pagina
contorno e fareu solo un blocchetto dove c'è l'esempio e senz ail codive a fianco".
The manual export now runs Pointers directly, with only an Inspector button above
it. The existing inspector palette attaches to that example; gallery navigation
and the adjacent source pane are absent. No core/runtime changes. Local Chrome
verification confirms inspector Data edits update the example; strict Sphinx and
all public documentation checks pass, and all 62 examples tests pass.
Examples develop commit `0fa91e1` passed CI run `38761416321`. Read the Docs build
`35171072` successfully published the same commit (retry after build `35170994`
failed during RTD upload, with all build commands already successful). Fresh HTTP
responses contained the compact Pointers HTML and Worker, but browsers retained
the previous gallery from cache. Following the owner's screenshot, the manual
playground is now exported under `playgrounds/b01/`, separate from every former
gallery asset path, and both the iframe and open-in-tab link use that location.
The clean strict Sphinx build and all public page/link/anchor checks pass. Examples
develop commit `6e063c5` passed CI run `38763870748` and Read the Docs build
`35171361`. Hosted in-app browser verification passed: the manual iframe shows
only Pointers and its Inspector button; Caption edits update the heading and
symbolic binding, Inspector Data edits update those same outputs and the input,
and the Source tab displays the source tree. Opening and closing the Inspector
also works. The runtime and assets remain served entirely by Read the Docs.
The compact embed is implemented and verified on develop. Owner acceptance and
consolidation into main remain separate; main remains unchanged.


**Gallery inspector icon (2026-10-15).** Owner requested a small emoji instead of
the large inspector button. Python and JavaScript gallery footers now show only
🔍 in a 28 × 28 px transparent button, retaining the Inspector accessible name,
Open inspector tooltip, keyboard focus and pressed state. This shared gallery
source also serves the serverless export; existing exports need regeneration.
Verified: Python gallery page tests (3), JS gallery build tests (9), JavaScript
syntax and whitespace checks. Chromium on the Python preview confirms dimensions,
emoji, accessible label and palette opening. The separate inspector work is still
in progress; the owner requested waiting and including it in the 0.2.18 release.
No release or publication was performed for this UI change.


<a id="gc-070-960"></a>
## 960 · One inspector shared with Chrome DevTools (2026-10-15)

Owner confirmation: "sì facciamo un unico inspector condiviso anche nei devtools".
Constitution 11.74 authorizes this bounded core/extension integration. Implemented
on develop; owner visual acceptance and consolidation remain separate.

The extension imports the optional Gramlot inspector in embedded presentation:
Data, Source, Styles, property editing, breakpoints and CSS download are the same
implementation used in the page. The shared page agent has a separate optional
package entry, with no bundled Bag or runtime. Chrome discovery, frame visibility
and transport remain in gramlot-devtools. Its vendored PoC inspector, editor and
Source subtype codec are removed. Core has no dependency on the extension and
no new runtime discovery hook. No release, publication or deployment was made.

Shared fixes retain snapshot sibling order/node identity, avoid duplicate CSS
saves when leaving an Enter-confirmed field (which interrupted remote downloads),
release old colour bindings before replacing rows, and give separately loaded
agents unique subscription IDs so in-page and DevTools connections can coexist.
The Chrome host keeps successful breakpoint settings across reconnects, while
CSS previews are cleared on frame change, reload or panel close. Inspector copies
use supported scalar descriptors and omit `_meta`; they are not Source subtype
wire clones. Unsupported values stay read-only and resolvers remain unevaluated.

Verified: core and extension builds; 27 shared-tool unit tests and five extension
unit tests; shared UI, opaque-frame connection and Styles/download fixtures in
Chromium and WebKit; MV3 feasibility without evaluation; all 22 routed extension
checks and eight checks inside real Chromium DevTools; both extension manual
builds with strict Sphinx and paired identities. The Styles panel was visually
checked, including name/value/picker/reset and Download CSS. The extension has
no unexpected browser errors. Tests also cover stale edits, live updates,
Source DOM effects, frame isolation, worker restart, back/forward cache,
conditional breakpoints, debugger writer stack, cleanup and independent agents.

Firefox's installed headless executable failed at startup (profile folder error);
this change is not Firefox-qualified. Chromium/WebKit do not qualify branded
Chrome/Safari, and direct file-origin extension behavior is not newly qualified.
The new package entry is available from the built local checkout; existing npm
packages and release ZIPs are unchanged. Reload the unpacked extension from its
rebuilt dist directory and reopen DevTools to use the shared inspector.


**All lesson embeds (2026-10-15).** Owner: "Bene, facciamo lo stesso anche per gli
altri esempi del manuale, ciascuno con il suo blocchetto per l'inspector usa solo
uan emoji piccoal com e statamessa nell pagina indice". Extend the approved
serverless manual presentation to every catalogue lesson and use the index's 🔍
icon-only Inspector control (28px, accessible name retained). The documentation
build now exports all 41 current examples, including their original Logic and
same-name stylesheets, and inserts one lazy iframe before each lesson's details.
The source remains below the lesson. No example behavior, core/runtime or adapter
changes. All 62 examples tests and the strict Sphinx build pass; coverage checks
verify one matching iframe per lesson, every export and all local links/anchors.
Local browser checks confirm named Logic, endpoint execution and remote selection
updates in the Worker. Develop commit 4008b78 passed CI run 38765864272 and Read
the Docs build 35171705. Hosted HTTP checks verified all 41 lesson iframe targets
and all 41 standalone exports. In the hosted c03 lesson, changing price to 120
updated the result to 108; the compact Inspector opened and closed successfully.
The development preview is implemented and verified; main consolidation remains
subject to owner acceptance.


**Dark-theme verification (2026-10-15).** Owner asked to test the reported
invisible inspector trees in dark mode. No rendering change was made. The current
shared inspector does not reproduce the defect: 36 geometry/contrast checks pass
for Data and Source, normal and selected rows, covering Base light, Base dark,
system dark and Compact dark in Chromium/WebKit, plus the actual routed extension
panel with a dark inspected page and dark system preference. Measured label
contrast is 6.12:1–10.37:1. Screenshots were visually reviewed.
A separate real-DevTools check selects Dark, reloads the frontend and confirms
`chrome.devtools.panels.themeName === 'dark'`: both trees remain visible with
`rgb(56, 65, 75)` text over the panel's white background. The inspector intentionally
keeps its existing light presentation; this verifies visibility under dark host
themes, not a new dark inspector design. The result covers the current locally
built shared inspector, not earlier released extension archives or arbitrary
application stylesheet overrides. Branded Chrome/Safari were not separately run.


<a id="gc-070-965"></a>
## 965 · Integrated release preparation (2026-10-15)

Owner: "ok procedi con la revisione conclusiva e poi chiudi la release 0.2.18 con
bump versione, commit, push e pubblicazione", followed by "aspetta e mettiamo
anche inspector" and "possiamo chiudere la release 0.2.18 con tutto dentro?".
The shared inspector work is complete. Scope includes core messaging/ask/references,
shared inspector/agent and Styles, teaching documentation and examples, and the
corresponding Chrome extension. No store submission or application deployment.

Final review found and fixed unconditional crypto.randomUUID calls in the new
frame sessions and native ask dialog. They now use the established getRandomValues
pattern so ordinary HTTP still works. The shipped-runtime qualification now opens,
confirms and cleans up ask on both localhost and an ordinary HTTP origin. Messaging
browser qualification is also part of CI. npm and JSR both export inspector-agent.

Verified locally: 601 core JS tests, 139 Python tests and 250 subtests; 27 shared
tool unit tests; inspector UI, opaque-frame bridge and Styles/download tests in
Chromium and WebKit; HTTP/file messaging in both engines; eight shipped-runtime
origin checks; extension unit, routed panel and real Chromium DevTools checks.
The complete manual and examples are being consolidated with the previously
completed serverless lesson embeds. Publication is pending, not yet confirmed.
Firefox installed here fails to start (profile folder error); branded Safari and
Chrome are not separately qualified. Deferred messaging/widget features remain
explicit in GC-095 §115. No dependency source changes or alternate APIs introduced.


**Publication completed (2026-10-15).** Core 0.2.18 is published on PyPI, npm,
JSR and GitHub; release pipeline 38771000459 passed every job. Core release commit
is b8c95d2. DevTools 0.1.3 uses the shared inspector; pipeline 38771526377 passed
and the published ZIP was downloaded and checked for integrity, manifest version,
panel/agent entries and absence of the feasibility test page.

Examples 0.2.14 is published on PyPI, npm and GitHub (pipeline 38772203488).
The 0.2.13 tag remains as an unpublished attempt: initial registry propagation
blocked dependency installation, and the required all-pages browser suite exposed
missing c18/c19 registrations. The dedicated checks already passed; they now share
verifyExample with the complete suite. Version 0.2.14 preserves the old tag and
passes all 43 pages on both Python/JS servers, Node/Bun, Python 3.11/3.12,
documentation and packaging. Both new lesson embeds also pass Chromium/WebKit.

Read the Docs latest builds succeeded for core (35172507), examples (35172728)
and DevTools (35172617), on the corresponding release commits. Source changes,
paired guides, quick start, CSS guide, shared inspector, examples and compact
emoji control are consolidated on main/develop. No package from the server adapter
repositories changed; they consume the core/examples packages. No Chrome Web Store
submission or application deployment was performed. The release is complete;
future scope and browser qualification limits above remain explicit.


<a id="gc-070-970"></a>

## 970 · Plain and delayed buttons — 0.2.19 release

Owner approved on 2026-10-15: `html_button` plain, `button` with Gramlot behavior,
legacy `_delay`, and missing examples (constitution 11.75). Implemented distinct
Source identity/static and live HTML output; native submit/reset/explicit events;
trailing click delay, burst counters, inherited delay and lifecycle cancellation.
No Builder/Bag changes. Existing immediate button behavior remains.

Examples c20 covers core 0.2.18 action/ask, conditional confirmations and local
Source/DOM references; c21 demonstrates subsequent plain/delayed button additions.
Both are Python-first with equivalent JS and short didactic descriptions.
Verified: 608 core JS tests, 137 Python tests; 32 focused button/ask checks
repeated after final cleanup. Examples: 66 JS checks (including the corrected
Logic-count assertion), 16 Python tests. c20/c21 pass Chromium and WebKit on
Python, Node and direct-file serverless pages. Strict Sphinx and links/anchors
pass: 10 core pages, 45 lessons and two paired example guides.
The user's Uvicorn gallery on localhost:8195 now uses the development sources;
c20/c21 and navigation are verified there in Chromium. Native Safari and Firefox
are not claimed. See [PORT-0008](../../ports/PORT-0008-plain-and-delayed-buttons/README.md).
Implementation and verification complete. Owner authorized publication with
"pubblichiamo" on 2026-10-15. Releasing core 0.2.19 and examples 0.2.15;
official publication completed successfully. Existing 0.2.18 artifacts remain unchanged.

Core tag v0.2.19 is `86d4024d5f4d3512f316f966e600f88cfa772613`; workflow
38782280286 passed verification, artifact build, GitHub release, PyPI, npm and JSR.
Examples tag v0.2.15 is `f3b92bf55690eb7aaac9d983592aaaebbadf337d`; workflow
38783025449 passed all 45 pages on Python/Node, Node/Bun tests, Python 3.11/3.12,
documentation, build and PyPI/npm publication. Its first browser job stopped at
installation because one PyPI edge still lacked core 0.2.19; rerunning that job
passed without code changes. Latest release Python qualification: 140 pytest tests
and 255 subtests. Published wheel/npm archives contain the new grammar/lessons;
core runtime bytes match across the distributions.

Read the Docs built the release commits successfully: core stable 35174149;
examples latest 35174219 and stable 35174220. Release commits and tags are pushed
on main/develop. The server adapters and DevTools packages are unchanged.


<a id="gc-070-975"></a>

## 975 · Component contract research, awaiting API decisions (2026-10-15)

Owner: "ok procedi con l'analisi di legacy e poc e prepara il documento sul
contratto dei componenti, poi decidiamo le API". Completed the read-only comparison
of legacy authoring/widget adapters, PoC descriptions/bases/inputs/layout and current
Gramlot binding/lifecycle. [GC-205](../future/205-components.md#gc-205-015) now holds
the evidence snapshot, proposed responsibilities, behavior matrix, pilot acceptance
cases and ordered owner decision register. APIs and implementation remain unapproved.

Findings: distinguish Python composition and Source expansion from browser controls;
reuse current Source/Data rather than porting PoC Application. Resolve draft/echo/IME,
property channels, lifecycle and child selection explicitly. The GC-040 experiment's
recorded worktree is absent, so it was not reproduced. Constitution 11.14 describes
additive collection merge; later GC-210 §090 records a 2026-09-30 owner decision
for whole-declaration replacement, matching current ASTRA-03 tests. Reconcile the
historical wording with that later record before collection override design; this
research changes neither policy nor dependencies.

Verified: 4/4 existing PoC component-alpha tests, 35/35 existing core collection,
native-control and webcomponent tests (corrected local Python environment). Legacy
is source-traced, not live-browser tested. Paired documentation anchors and local
links checked, six pinned source references verified against Git objects; strict
Sphinx and public documentation checks pass (10 pages). Public boundary preserved.
No runtime changes, new API, release number or publication. Next: owner review of GC-205, starting with component
responsibilities and description ownership, then a bounded implementation plan.


<a id="gc-070-980"></a>

## 980 · Component description ownership approved (2026-10-15)

Owner confirmed "si" to one JS module holding component description and implementation,
generated JSON for Builders, and no manually duplicated Python definition. Recorded
in constitution 11.76 and [GC-205 §075](../future/205-components.md#gc-205-075).
Python consumes metadata without browser code execution or a server-side Node
requirement. Exact exports/schema/names/bases, collection selection and asset loading
remain open; no runtime implementation or publication is claimed or authorized.
Owner then clarified that collection requirements belong to the application and
explicitly deferred the concrete mechanism. Recorded in constitution 11.76 and
GC-205 §075; page-level selection remains an unaccepted proposal. Paired records
and anchors checked. Next: individual component parameters and value/edit contract;
collection declaration/loading design stays deferred.


<a id="gc-070-985"></a>

## 985 · Modern platform direction and legacy compatibility (2026-10-16)

Owner requires modern HTML/CSS/JavaScript implementations, compatibility where
feasible, and documented, motivated differences for the Softwell team. Recorded in
constitution 11.77 and [GC-205 §080](../future/205-components.md#gc-205-080).
The component comparison now requires platform evidence, concrete benefits,
semantic differences, migration instructions and qualification before adoption.
The maxlength/validation overlap remains a design question, not an approved mapping.
No runtime changes or browser compatibility claims. Paired records, anchors and
new local links verified. Next: apply this direction to input parameters/binding/
events; collection selection/loading remains explicitly deferred.


<a id="gc-070-990"></a>

## 990 · Gramlot validation priority (2026-10-16)

Owner clarified that Gramlot validation has priority and may automatically guide
native browser constraints where usable. Recorded in constitution 11.77 follow-up
and [GC-205 §085](../future/205-components.md#gc-205-085). The design explanation
makes the overlap explicit and avoids duplicate application declarations; concrete
attribute mappings and validation/commit behavior remain open. Documentation only,
no runtime implementation or new browser verification. Next: settle the textual
input validation contract before implementing its native integration.


<a id="gc-070-995"></a>

## 995 · Legacy localization analysis (2026-10-16)

Owner requested the complete legacy Python/JS mechanism before choosing localization
APIs. [GC-235](../future/235-localization.md) traces marking/identity, extraction and
catalog editing, server serialization, client caches/synchronous RPC, locale and
language propagation, validation, accessibility and formatting boundaries. It compares
Intl, gettext/Babel, ICU/MessageFormat, Fluent and i18next against official sources.

15 isolated Python and 9 JS source probes passed. They confirm explicit-key/default
key discrepancies and cache/extraction limits; no legacy code was changed. Full
legacy suites could not collect because the current environment lacks `unidecode`;
no dependency installation or live browser qualification claimed. Paired anchors,
local links and pinned evidence paths verified. Analysis complete, no runtime/API
implementation or release. Next: decide whether to retain legacy `!!` marking, then
message identity and runtime language behavior; collection loading remains deferred.


Follow-up, 2026-10-16: owner prioritizes modern locale/format conventions when there
is no legacy correspondence; legacy application code must be adapted. Recorded in
constitution 11.77 and [GC-235 §070](../future/235-localization.md#gc-235-070).
Document migration for Softwell instead of adding legacy-format emulation. Exact
formatting grammar, parsing and translation marker/engine remain open. Paired
records and links verified; documentation only, no runtime tests required.


Decision checkpoint, 2026-10-16: [GC-240](../future/240-localization-decisions.md)
records the owner's signature-driven localization direction. `intl_str` identifies
localizable parameters (`label`, and SQL `name_long`/`name_plural` as the semantic
example); ordinary `str` remains unmarked technical/ordinary text. Typed parameters
no longer require `!!`. Source language is contextual; Gramlot page classes and
`pages/_metadata` provide page/shared metadata direction. The DB work stays with
its owner. Constitution 11.78 and GC-225 §045 record scope and names.

The earlier next step of confirming `!!` is superseded for typed parameters.
Collector/type implementation, metadata format/hierarchy and translation engine
remain undecided; no runtime change. Paired documents/anchors/local links and strict
public documentation checks passed. Next: settle type ownership/representation and
signature exposure before implementation; do not reopen confirmed authoring choices.


### Local gallery recovery — 2026-10-16

Owner reported missing publish/subscribe content and the Styles inspector in the
local galleries. The processes on ports 8185 (Python) and 8187 (Node) had started
on October 14 and still returned 404 for `/c18`; the newer 8195/8197 processes
served it. Restarted 8185/8187 with their existing commands and Python source paths.
The restarted Node process exposed a second local setup defect: examples resolved
an installed core 0.2.18 while the server resolved the workspace core 0.2.19,
causing `Page modules must export a subclass of Page`. Aligned the examples' local
core package link to the same workspace core and preserved the previous package
in a temporary backup. No runtime source or dependency manifest was changed.

Verified HTTP 200 for `/`, `/c18`, `/c19`, `/c20`, `/c21` on both ports. In both
browser galleries, clicking Publish in the c18 iframe produced `Hello (saved)`;
the shared inspector exposes Data, Source and Styles. These are local development
startup/dependency checks, not a new release or a full regression-suite run.
Localization and component design decisions remain unchanged.

### Explicit update instructions — 2026-10-16

Owner reported that a collaborator recovered the gallery inspector after an npm
refresh and requested clear update instructions. GC-018 §025 now routes readers
to GP-020 §025 (published Python packages), GN-110 §035 (npm hosts/exports) and
GE-010 §050 (source builds). Each README links the update path. Instructions
separate packaged bundles from checkout builds, require explicit package updates,
core-before-examples build order, a shared physical core for linked JS packages,
server restart or complete export regeneration, and version/path/UI verification.
The collaborator's exact npm command was not supplied; no unverified diagnosis of
that machine is asserted. The separate extension update remains explicit.

Verification: all four documentation checks/builds passed, including both server
views and the core's 10-page public-site/link/anchor check. Commands were reviewed
against the current CLI/build scripts and npm/pip documentation; no package update
or source build was executed on a collaborator's environment. Runtime is unchanged;
no package release or documentation publication was performed.

Publication follow-up, 2026-10-16: owner authorized "ok fai commit e push sui
quattro repo e pubblica le istruzioni su Read the Docs". The update guides and
README links were committed and pushed to both develop and main: core b78866c,
examples 927a46f, JS server f813c02, Python server a87a95f. Read the Docs latest
builds 35186589, 35186591, 35186594 and 35186597 respectively finished successfully
on those exact commits. Server pre-commit checks passed: Python 92; Node 33;
Bun 33; serverless 34; create 3. The Python run emitted one upstream Starlette
httpx deprecation warning. This is documentation publication, without package
version bumps, package releases or changes to the ongoing localization design.

Public browser verification also confirmed the new sections on all four latest
manuals: GC-018 §025, GE-010 §050, GN-110 §035 and GP-020 §025. Direct automated
HTML requests returned 403, so the published content was verified in the browser.

Localization planning follow-up — 2026-10-16: owner requests recording the accepted
annotation/component/message decisions and a future plan, explicitly non-priority
and non-blocking. GC-240 §§035–060 now records the shared Annotated-string direction,
JS component metadata/generated Python signatures, `lbl`/labels/accessibility text,
notifications/alerts/confirmations and validation/errors, separate templates/arguments
and stable technical error codes. Shared package and descriptor details, collector,
metadata, engine and runtime policy remain open. The staged plan covers shared type,
Builder/Routes, components, messages, translation and teaching; it is not activated.
Constitution 11.78 follow-up, GC-225 and the component/backlog cards agree. No dependency,
runtime, DB or release changes. Next localization action only when the owner schedules
it: choose the shared package and precise descriptor contract; current work can proceed.

Documentation verification for this follow-up: six full/compact document pairs
have matching explicit anchor sets and existing relative link targets; whitespace
checks pass. No runtime tests were run for this documentation-only update.


### Kajenn folder-page routing correction — 2026-10-16

Owner requested the analysis of gramlot-py-server issue #16, then authorized the
proposed adapter correction with "puoi correggere?" in the same conversation.
The reproduced defect consumed `index` as a route selector: `/ui/index/index.js`
reached companion lookup as `index.js`. Configured assets below `assets/index/`
and folder pages there had the same loss. This matches the documented genro-routes
selector behavior; the adapter incorrectly treated remaining route arguments as
the complete file path.

Implemented in gramlot-py-server: `Application.index` uses Kajenn's request path,
which is already relative to the application mount. `_RuntimeAssets.index`
forwards the same request without reconstructing its path. Existing HTTP, core
page, routing-library and dependency contracts remain unchanged.

Verified against installed Kajenn 0.5.0, genro-routes 0.30.1 and released Gramlot
0.2.17: ten regression cases cover root/mounted applications, `index`/ordinary
folders, both below `assets/` too, bootstrap resource URLs, JS/CSS content and
media types, GET/HEAD, method rejection, missing/forbidden files and symlink escape.
Before the fix, six affected cases failed and four controls passed; after it,
all 25 Kajenn module tests and all 102 repository tests pass. Ruff and whitespace
checks pass. One upstream Starlette/httpx deprecation warning remains.
Implementation and local verification are complete; owner acceptance and any
source delivery/publication remain separate. No browser run or new release claimed.

Delivery follow-up: owner accepted the correction and requested "ok allora commit
e push e aggiorna". Added `httpx2` to the adapter repository's test extra and
installed httpx2 2.13.1 locally. Existing direct `httpx` consumers retain their
dependency. The full 102-test suite passes without warnings; Ruff passes.
Correction and test dependency update are committed as `469aa68` in
`gramlot-org/gramlot-py-server` on `develop`. No package release or deployment.

Labelbox contract follow-up — 2026-10-16: owner confirms shared labelbox, lbl_/box_
with label/control container subdivisions, and reactive lbl_position using
TL/TC/TR/L/R/BL/BC/BR with default TL. GC-205 §090 records prefix routing, framework
binding ownership, preserved input identity/focus/selection and deferred intl_str.
GC-225 §050 and constitution 11.79 record names and exact owner evidence. The input
API, invalid-value commit policy, missing/invalid position handling and detailed
layout remain open. Documentation only; implementation and runtime tests not started.
Verification: all four full/compact pairs have matching explicit anchors and
existing relative link targets; whitespace checks pass. No runtime behavior is claimed.

Style teaching follow-up — 2026-10-16: owner requests a side-by-side Python, Source
and DOM explanation in the public guide and gallery. GC-096 §040 and gallery b06
now show literal and bound style attributes, unchanged Source pointers after Data
updates, shortcut precedence versus the CSS cascade, and the limits of reverse
editing. Examples use existing native controls; no application/runtime code or new
API is introduced. Matching compact core guide updated. Strict Sphinx builds and
link/anchor checks pass: core 10 pages; examples 45 lessons and 2 paired guides.
Existing style-shortcuts suite passes 11/11. Generated HTML contains the comparison
tables and inverse-direction explanation. Browser visual verification was not
performed: the file URL was blocked by browser policy. Documentation is locally
verified, not published; no version bump, commit or push was requested.


### Python adapter quick bugfix release — 2026-10-16

Owner requested publication after the Kajenn issue #16 correction, selected
"no farei 0.2.8.1", and confirmed "per i bugfix al volo mi va bene la 4 cifra".
Constitution 11.80 records the fourth numeric segment for this Python package's
quick bugfix releases. Prepared version 0.2.8.1, README and release notes;
102 tests pass without warnings, Ruff and both documentation builds pass.
The wheel and sdist build successfully; version ordering, wheel metadata,
py.typed, the routing correction and httpx2 test-extra dependency are verified.
Published successfully on GitHub and PyPI: tag `v0.2.8.1`, commit `e101b925d7b82058edc47e698a1f89982b153f6c`,
consolidated on main/develop. Official release workflow
[38875820015](https://github.com/gramlot-org/gramlot-py-server/actions/runs/38875820015)
passed all jobs, including the Python 3.11/3.12 adapter matrix, browser and
clean-install checks, documentation, core-main, artifact build and publication.
The downloaded GitHub wheel/sdist hashes match SHA256SUMS and the actual PyPI
artifacts; published wheel metadata, routing fix, py.typed and httpx2 test extra
are verified. Release complete; no application deployment or dependency-source edit.

Pointer mask design follow-up — 2026-10-16: owner chooses the general pointer suffix
`:xxxx`, with `{}` as the placeholder, and the same placeholder for `mask` instead
of `%s`. Applies to every supported pointer kind/consumer, not only styles.
GC-210 §095, GC-225 §055 and constitution 11.81 record the decision and unresolved
parser/escape/null/typing/write-back/composition details. Runtime and public examples
remain unchanged; localization is unrelated and still deferred. Next: settle those
semantics before implementing the shared pointer behavior, without CSS-only handling.

Pointer transform contract follow-up — 2026-10-16: owner confirms `:` for text
templates, `:=` for expressions, `{}` for the pointer value and `{name}` for other
resolved attributes on the same Source node. Updated GC-210 §095, GC-225 §055 and
constitution 11.81 follow-up in both views. Explicit delimiter selects the mode;
`#`, content-based inference and always-evaluate proposals are superseded. Examples
cover units, another bound attribute and boolean readonly; Data stays unchanged by
projection. Remaining parser/escape/dependency/static/write-back details are listed.
No runtime or public-example changes; next work is the remaining contract decisions,
not implementation inferred from this documentation request.
Verification: explicit anchor sets match across all four updated pairs; the two
current contract sections match in both views; whitespace checks pass. No runtime
tests were run for this documentation-only change.

Pointer transform scope correction — 2026-10-16: owner explicitly excludes widget
value from both suffix modes. GC-210 §095, GC-225 §055 and constitution 11.81 record
attribute use, rejection of transformed widget values and preservation of plain value
bindings. Inverse widget-value conversion is removed from the open decisions. This
supersedes unrestricted consumer scope, not all writable attribute bindings. No runtime
implementation; remaining grammar/null/dependency/static-rendering decisions still open.
Verification: updated contract/naming sections match across both views; whitespace
checks pass. No runtime tests for this documentation-only clarification.

Pointer transform null decision — 2026-10-16: owner confirms template null pass-through
without interpolation, expression evaluation with typed null, and preservation of
zero/false as valid inputs. GC-210 §095 and constitution 11.81 updated in both views.
Empty strings, missing/null named references and the remaining grammar/dependency/static
rules stay open. Documentation only; runtime unchanged.

Pointer transform missing-attribute decision — 2026-10-16: owner confirms an explicit
node/attribute diagnostic for absent `{name}` attributes in both suffix modes; no
silent empty text. GC-210 §095 and constitution 11.81 aligned in both views. Null
existing attributes and missing Data paths remain distinct open cases. Documentation
only; runtime unchanged. Paired contract sections and whitespace checks verified.

Pointer transform null-attribute decision — 2026-10-16: owner confirms that a null
referenced attribute makes the template result null, while expressions receive typed
null normally. Updated GC-210 §095 and constitution 11.81 in both views. Missing
Source attributes still error; empty strings and missing Data paths remain open.
Documentation only; paired contract sections and whitespace checks verified.

Pointer template required-value decision — 2026-10-16: owner approves required slots
`{}`/`{name}` by default and explicit empty-string admission with `{?}`/`{?name}`.
Null still yields null; missing attributes still error; zero/false remain valid.
Contract, naming and constitution updated in both views. The output when required
empty text blocks composition remains to decide; expression inputs are unchanged.
Documentation only. Paired contract/naming sections and whitespace checks verified.

Pointer template required-empty result — 2026-10-16: owner confirms null for the
whole template when a required slot contains empty text. GC-210 §095, GC-225 §055
and constitution 11.81 updated in both views. This closes the required-empty output
decision; optional empty strings still interpolate. Remaining grammar/dependency/static
questions remain open. Documentation only; paired sections and whitespace verified.

Formatting direction and Toolbox check — 2026-10-16: owner authorizes recovering,
improving, documenting and implementing the legacy formatting API with modern tools.
Public name `gramlot.format` recorded in GC-225 §060 and constitution 11.82;
GC-235 §075 records scope, legacy evidence and remaining contract decisions.
Runtime implementation is still pending pattern/option/temporal scope and engine
selection. Toolbox `parse_period` exists in Python with IT/EN dictionaries and a
legacy corpus; the inspected upstream main tree has no JS implementation. No
Toolbox files changed, no parser port started. Documentation pairs and whitespace
checked; runtime tests were not run for this research/documentation update.

PoC parser correction — 2026-10-16: `parseDateExpression` already exists in the
PoC date-parser module and is used by its symbolic-date editor. The earlier
absence claim was too broad: Toolbox main has only Python, while the PoC has JS.
GC-235 §075 corrected in both views. Existing parser tests passed 11/11; no
runtime or dependency edits. A bounded port and Python/JS contract comparison
remain necessary before claiming core availability. Paired correction text and
whitespace verified.

Date-expression parser port — 2026-10-16: owner "allora portiamola subito in gramlot"
authorizes PORT-0009. Implemented the reviewed PoC parser as named export
`parseDateExpression` from `@gramlot/gramlot`, with declarations and normal runtime
bundle inclusion. No dependencies, editor/calendar, Data writes, Python parser or
formatter added. GC-095 §120 documents the complete contract and Toolbox differences;
GC-225 §065 and constitution 11.83 record names and scope. Verification: 15 parser
checks, full JS suite 623/623, build and bundle identity, three process timezones,
strict TypeScript consumer fixture, Sphinx -W -n and 10-page public documentation
checks all pass. Paired sections and whitespace verified. Implemented and locally
verified; owner acceptance/release/publication not claimed. The separate formatting
assignment and future editor integration remain outside this completed parser port.

Toolbox parser semantic alignment — 2026-10-16: owner "o procedi" confirms the
proposal to use Toolbox Python behavior and its reference corpus. Implemented
missing named dates, articles, named-month last/next, quarter forms, English keyword
fallback, year inference, empty open periods and the Python two-digit-year window.
Existing JS names/results remain; incompatible PoC-only forms are rejected. IT/EN
dictionaries match the inspected Toolbox revision. Corpus/declared divergence files
are copied unchanged, without a runtime or CI dependency on Toolbox. The public
GC-095 §120 guide documents exact rules, surprising reference behavior, migration
and retained API differences; constitution 11.83 and GC-225 §065 record the decision.
Verification: 2796 reference cases, 2812 parser-suite tests, 3420 full JS tests and
2835 read-only upstream Python tests pass; build/bundle checks, strict TypeScript
consumer check, Sphinx -W -n, public documentation and paired/whitespace checks pass.
PORT-0009 destination technical review accepts the bounded alignment. Implemented
and locally verified; publication and completed-work owner acceptance are not
claimed. Custom locale loading, date editor and the separate formatter remain out
of this task's scope.

Formatter Unicode pattern decision — 2026-10-16: owner confirms Unicode/LDML
number/date pattern conventions (`#,##0.00`, `dd/MM/yyyy`) for `gramlot.format`.
Constitution 11.82 follow-up and GC-235 §080 updated in both views. Grammar family
accepted; token coverage, engine, option shape, type/default/null/mask semantics
and `_F` integration still open. Documentation only; runtime unchanged. Paired
sections and whitespace checked; no runtime tests repeated.

Formatter pattern option — 2026-10-16: owner confirms `pattern` in the second-
argument options object; the short string form is equivalent. Constitution 11.82,
GC-225 and GC-235 §085 updated in both views. Legacy numeric branch evidence is
recorded: positive/zero/negative, with conditional null-to-zero conversion before
type inference. Gramlot's branch semantics remain under discussion. Documentation
only; paired additions and whitespace verified, no runtime tests repeated.

Formatter zero-case decision — 2026-10-16: owner "zero va bene" accepts the
special numeric zero case. Constitution 11.82 and GC-235 §085 updated in both
views. Null handling remains open; no implicit null-to-zero conversion approved.
Documentation only; paired additions and whitespace verified.

Formatter null decision — 2026-10-16: owner explicitly confirms empty text for
null, bypassing pattern and mask. Constitution 11.82 and GC-235 §085 updated in
both views; zero remains distinct. Typed dispatch, defaults and bounded formatting
coverage remain open. Documentation only; paired additions and whitespace verified.

Formatter typed-value decision — 2026-10-16: owner provisionally accepts dispatch
from actual values/TYTX typing and no implicit number/date parsing of strings.
Constitution 11.82 and GC-235 §085 updated in both views. A later change requires
an explicit decision; locale/timezone defaults and remaining formatting contract
work stay open. Documentation only; paired additions and whitespace verified.

Formatter locale precedence — 2026-10-16: owner confirms explicit `locale` option
over page locale, which is used when the option is omitted. Constitution 11.82 and
GC-235 §085 updated in both views. Locale configuration/absence and timezone policy
remain open. Documentation only; paired additions and whitespace verified.

Formatter timezone decision — 2026-10-16: owner confirms unshifted civil dates and
timezone-free datetimes; typed instants display in explicit timezone, otherwise
page timezone. Constitution 11.82 and GC-235 §085 updated in both views. Option
spelling/configuration/absence and remaining pattern details stay open.
Documentation only; paired additions and whitespace verified.

Formatter three-section decision — 2026-10-16: owner confirms numeric
positive/zero/negative order for three sections, as a Gramlot Unicode-pattern
extension. Constitution 11.82 and GC-235 §085 updated in both views. Two-section
meaning, empty sections and quoting remain open. Documentation only; paired
additions and whitespace verified.

Formatter two-section decision — 2026-10-16: owner confirms Unicode
positive/negative for two sections; the three-section Gramlot extension remains
positive/zero/negative. The legacy two-section positive/zero meaning is explicitly
superseded and needs migration guidance. Constitution 11.82 and GC-235 §085
updated in both views; paired additions and whitespace verified. Runtime unchanged.

Formatter mask-order decision — 2026-10-16: owner confirms pattern first, then
mask with `{}` holding the formatted result. Null bypasses both as already agreed.
Constitution 11.82 and GC-235 §085 updated in both views. Other mask grammar and
non-null empty-result rules remain open. Documentation only; paired additions and
whitespace verified, no runtime tests repeated.

Formatter empty-zero-section decision — 2026-10-16: owner confirms an empty
zero section produces empty text and skips the mask. Constitution 11.82 and
GC-235 §085 updated in both views; no implicit default replaces the empty section.
Documentation only; paired additions and whitespace verified. Formatter pattern
coverage, engine and remaining context/composition details remain to settle.

Formatter date-default decision — 2026-10-16: owner confirms named date formats
`short`, `medium`, `long`, `full`, explicit date patterns and `short` when the
pattern is omitted. Constitution 11.82 and GC-235 §085 updated in both views.
Documentation only; paired additions and whitespace verified. Formatter engine,
bounded coverage and remaining context/composition decisions remain pending.

Formatter initial numeric slice — 2026-10-16: implemented after the owner's
request to deliver working cases without waiting for complete coverage.
`Gramlot.format` supports finite JS numbers, explicit pattern/locale, decimal
precision/grouping through Intl.NumberFormat, Unicode positive/negative sections,
Gramlot positive/zero/negative sections, null and empty-zero mask bypass, and
`{}` mask composition. TypeScript declarations and GC-095 §125 document exactly
this subset. No rendering-attribute or pointer-suffix behavior changes.

Verified: five focused integration tests, all 3,425 JS tests, runtime bundle
identity, strict TypeScript consumer check, Sphinx with warnings as errors,
public documentation checks (10 pages) and paired additions/whitespace. The
first full run encountered three sandbox-denied fixture-server binds; rerunning
with local-server permission passed completely. No browser visual test claimed.

Remaining: page locale/timezone configuration and shorthand context, date/time
formatting, Decimal/BigInt and non-numeric inputs, advanced patterns, helper and
attribute integration. TYTX 0.16.2 erases D/DH/DHZ distinction on decoding; the
temporal blocker is demonstrated in a regression test and documented without a
consumer workaround or dependency edit. Broader design acceptance remains as
recorded in GC-235; this numeric implementation is verified, not owner-reviewed
or published. No version bump, commit, push or release performed.

Formatter dtype and temporal styles — 2026-10-16: owner explicitly confirms
inference with `dtype` taking precedence. Implemented D/H/DHZ interpretation of
Date, matching TYTX inference when dtype is absent, with short/medium/long/full
styles (default short), D date fields, H time fields, DHZ date+time and explicit
timeZone. D/H keep UTC fields. Numeric L/R/N validate matching number inputs.
Null and mask behavior remain unchanged. This supersedes the earlier temporal
blocker: no dependency change is necessary for the newly approved interpretation
contract. Explicit date patterns, timezone-free datetimes and page context remain
pending, along with the previously documented advanced-format limits.

Verified: 8 focused formatting tests, 3,428/3,428 full JS tests including rebuilt
runtime bundles, TypeScript consumer checking, strict Sphinx and 10-page public
documentation validation. Temporal tests cover the same midnight Date as D versus
DHZ, all named styles, invalid/mismatched types, default short, and identical
results under Europe/Rome, America/Los_Angeles and Pacific/Kiritimati process
zones. Paired documentation and whitespace verified. Implemented and verified;
not yet owner-reviewed or published. No TYTX edits or release actions.

Page formatting context and display integration — 2026-10-16: implemented the
owner's requested intermediate-release increment, with web components retained
for 0.3. Page.locale and Python Page.time_zone / JS Page.timeZone reach HTTP and
Worker bootstraps. Browser instances resolve missing fields from browser Intl at
startup, as explicitly confirmed by "Sì, usa i valori del browser". Precedence
is call/node > Page > browser. No implicit server context or _gramlot Data
initialization protocol was introduced.

Live HTML scalar text and _text now call the same gramlot.format engine before
mask composition. Data/format/mask/locale/timeZone/dtype pointer changes reproject
without rewriting typed Data or rebuilding the element. Editable value remains
under its native binding contract. Plain masks share {} composition in the
browser and static Python/JS output. Removed legacy %s substitution; migrated
the two affected controller examples and the relevant lesson while preserving
release chronology. The separate preexisting style-lesson work is untouched.

Verified: all 3,434 core JS tests; 42 focused Python tests plus 155 subtests;
35 serverless tests; 66 example tests; strict TypeScript consumer check; core
Sphinx/public docs and both serverless documentation builds with stable-ID
validation. Real Chromium and WebKit checks passed both single-file and directory
serverless exports, page context overriding a different browser context, explicit
instant zone, civil dates, and input-driven formatting/masks with numeric Data
preserved and no page errors. Export bundling still emits the previously known
import.meta/IIFE warning, without failing these checks. Source whitespace and
paired documentation additions verified. Runtime bundles rebuilt locally.

Current limits: static renderers still consume but do not apply Intl format;
SVG display formatting, pointer suffixes, _F, advanced number/date patterns and
Decimal remain incomplete. Changing browser-instance context properties after
startup does not trigger global reprojection; node-level context pointers do.
This increment is implemented and verified, not yet owner-reviewed/published.
No version bump, commit, push or package release was performed.


Pointer path-name decision — 2026-10-16: owner restricts path segment names to
ASCII letters, digits and underscore (`[A-Za-z0-9_]+`). Recorded in constitution
11.81, GC-210 §095 and GC-225 §055, with paired mirrors. Existing addressing
operators remain syntax; the first colon starts the transform, with no colon-in-name
escape. Inspection reproduced the currently permissive behavior (a colon-bearing
Data label resolves through GramlotBuilder); validation and suffix execution are
still pending. No Bag dependency changes or release actions. Corrected the stale
GC-210 claim that node-text masks still use %s; masks already use {}.


Bag path-contract issue — 2026-10-16: created
[genro-bag #73](https://github.com/genro-org/genro-bag/issues/73), requesting
Python/JavaScript documentation of ASCII letters, digits and underscore in ordinary
path segment names. Owner clarified that runtime validation is not required; callers
using unsupported characters may encounter side effects. This supersedes the previous
status statement treating validation as required pending work. Constitution and
contracts aligned in both documentation views. Pointer implementation remains pending;
no Bag source edits or release actions were performed.


Attribute pointer transforms — 2026-10-16: implemented the authorized read-first
algorithm: split at the first colon, resolve the original pointer, then interpolate
`:` text or evaluate `:=` with typed arguments in the existing InlineCompiler.
`{}` and `{name}` are supported; named reads retain the attribute's normal
projection. `{?}` / `{?name}` allow empty template strings, not null. Null output,
zero/false, missing-attribute errors and cycles follow the documented contract.
The owner clarified there is no blanket exclusion of datapath/*_path; variable
contexts, provider arguments, computed result paths and remote parameters use the
same sequence. Widget value suffixes are rejected; ordinary editing stays unchanged.
`_F` is local to pointer/== expressions and calls the page's format/mask engine.

No second JavaScript evaluator, application proxy, global helper, dependency edit
or inverse parsing was added. Python/JS static templates use available Data;
expressions stay browser-owned and inert in static output. The existing Python
static variable-datapath limitation remains. Literal-brace escapes and slots inside
JS literals are outside this increment; normal string mask arguments are preserved.
Following the owner's request not to block on marginal cases, these limits are
recorded rather than broadening the implementation.

The new gallery c22 lesson follows c21 in release order, with Python/JS twins:
CSS width, boolean readonly, text format/mask and expression-local _F. Earlier
lessons retain their release scope. Core public/contract docs and mirrors explain
the same progression. Legacy ${name} templates retain their existing behavior.

Verified: 3,452/3,452 full JS tests after rebuilding runtime bundles; 157 core Python
tests and 255 subtests (plus the focused rerun after named-attribute projection);
67 example JS tests and 16 example Python tests with 58 subtests. Chromium and
WebKit passed real single-file and directory serverless exports: editing drives
width, readonly, format/mask and _F while Data retains its type. Existing export
import.meta/IIFE warnings remain, with no browser page errors. Core strict Sphinx
and its 10-page public documentation check passed; example strict Sphinx and
46 lessons/two paired guides, links, anchors and search checks passed.

Implemented and verified for the intermediate release; not yet owner-reviewed or
published. No bump, commit, push or release action. Advanced formatter patterns and
the previously recorded formatter limits remain separate work; Web Components
remain the subsequent 0.3 workstream.


Source attribute snapshot correction — 2026-10-16: owner clarifies that named
references must read the Source node, with all attribute inputs brought current
before use. Inspection confirmed no DOM read existed, but referenced bindings
could be read again during projection. Python/JS now capture all current attribute
inputs before suffix transformation, and projection reuses them. This is local to
one resolution, not a second Data store; authored Source remains unchanged.
A regression test modifies DOM attributes and verifies that Source/Data still
control the result, with named and unrelated attribute bindings read once per
resolution. Python verifies the same single-read behavior.

Verified after rebuilding runtime bundles: 3,453 JS tests, 158 Python tests plus
255 subtests, strict Sphinx and public-documentation validation. Paired contract,
constitution, naming and authoring guide updated. Implemented and verified; no
release action or dependency modification.


Intermediate release preparation — 2026-10-16: owner authorizes "procedi" in
response to bump, commit, push and publication of the verified increment. Prepare
core 0.2.20, examples 0.2.16 and JS integration 0.2.10 in dependency order. Python
integration has no pending source change and needs no package release. Existing
core and companion verification remains the release baseline; publication results
will be recorded after registry/CI confirmation. Local .claude settings are not
part of the release.

<a id="gc-070-1000"></a>
## 1000 · Intermediate formatting and pointer release — 2026-10-16

Owner authorization: "procedi" in response to the request to bump, commit, push
and publish the verified increment. This covers core 0.2.20, examples 0.2.16 and
JS integration 0.2.10, in dependency order. The unchanged Python integration
requires no new package version. Components remain the subsequent 0.3 workstream.

Core 0.2.20: the [release pipeline](https://github.com/gramlot-org/gramlot/actions/runs/38918818020)
passed all gates and published the [GitHub release](https://github.com/gramlot-org/gramlot/releases/tag/v0.2.20),
PyPI, npm and JSR distributions. PyPI/npm metadata confirms the version; the JSR
publish job confirms publication. Local JSR metadata retrieval is unavailable
(HTTP 403), so that endpoint is not claimed as an independent verification.

Examples 0.2.16: the [release pipeline](https://github.com/gramlot-org/gramlot-examples/actions/runs/38920430051)
passed Python 3.11/3.12, Node/Bun, documentation and the complete Chromium gallery
check. The new c22 behavior check exercises width templates, boolean expressions,
format/mask and local _F while checking numeric Data. It was added after the
required gate correctly rejected the missing browser-suite registration. The
[GitHub release](https://github.com/gramlot-org/gramlot-examples/releases/tag/v0.2.16)
and PyPI/npm publications succeeded; both registries expose 0.2.16. The dependent
JS integration release started only after npm made the examples installable.

Core and examples Read the Docs builds succeeded at their released commits.
Earlier npm dependency-install failures occurred before the new core package
became visible; verification was rerun successfully against the released package,
without dependency pins or relaxed checks.

JS integration 0.2.10: the [release pipeline](https://github.com/gramlot-org/gramlot-js-server/actions/runs/38921763094)
passed both released-core and core-main suites, Node/Bun contracts, Chromium
server/serverless galleries, CLI template generation and documentation. The first
runner was retried after slow system-package downloads during browser setup;
no test was skipped or weakened. The [GitHub release](https://github.com/gramlot-org/gramlot-js-server/releases/tag/v0.2.10)
contains all three tarballs and checksums. npm accepted @gramlot/gramlot-js-server,
@gramlot/gramlot-serverless and @gramlot/create 0.2.10. Public npm metadata now
confirms all three versions and their latest tags. Read the Docs succeeded at
the released integration commit.

Local final documentation verification passed strict Sphinx and the ten-page
public source/link/anchor check. No component or localization service
implementation is implied by this release. Formatter limits remain documented
in the release notes: advanced patterns and Decimal support are incomplete;
static rendering does not run Intl or JavaScript expressions.


<a id="gc-070-1005"></a>
## 1005 · Component 0.3 plan and radio review — 2026-10-16

Owner requests the 0.3 plan, explicitly including callbackSelect and its random-data
example; textbox with shared labelbox is the starting point, with multiple control
shapes reviewed together. Radio buttons/groups were added to the design review at
the owner's request, using legacy syntax where dedicated PoC components are absent.

[GC-245](../future/245-components-0-3-plan.md) records ownership, proposed hierarchy,
explicit mixins/stateful collaborators, metadata inheritance, selected-collection
registration, staged gates and chronological teaching. PoC bases/registry/editors,
GC-040's historical probe, current core binding/radios, legacy radioButton and
radioButtonText, and the HTML standard were inspected. No new runtime or component
browser tests were executed. The legacy lowercase radiogroup helper is deprecated;
current native radio semantics are not changed by the proposed group component.

Paired section anchors, the plan’s local links and whitespace checks passed.
The planning review is complete; architecture/API proposals await concrete owner
review. Next is P0's JS definition and Python signature sketch, comparing textbox,
checkbox and radio group before implementation. No dependency edits, publication
or agent delegation occurred.


Follow-up, 2026-10-16: the textbox/checkbox/radio-group JS and Python sketch was
shown to the owner. The owner corrected widget naming: identical names across
languages, preferably case-insensitive. Recorded in constitution 11.84 and GC-225;
GC-245 no longer requires snake/camel translation for widgets. Read-only inspection
confirmed case-insensitive schema lookup in installed Python Builders
(`builder/source_bag.py`) and JS Builders (`src/builder-base.js`). No dependency or
runtime code changed. The proposed component-definition API remains under review.
Verification: paired naming/decision records and whitespace checked; runtime tests
not needed for this documentation correction.


<a id="gc-070-1010"></a>
## 1010 · First input components and shared labelbox — 2026-10-16

Owner accepted the concrete JS/Python definition sketch and requested implementation
of textbox/labelbox qualified by checkbox and radioButtonText. Constitution 11.84,
GC-225 and GC-245 §055 record approval. Implemented defineComponent/defineCollection,
NativeControl/ChoiceGroup, Labelbox/FieldState, explicit realm-local registration
and DOM-free JSON export consumed by Python. Widget names match across languages
and use the existing case-insensitive Builder lookup. intl_str qualification is
retained without a translation engine. Existing ControlAdapter owns commits, IME,
reactive context and cleanup; the component does not access the Data Bag.

The labelbox supports eight reactive positions, shared prefix routing and renderer
style conversion, preserves the inner control/focus/caret and maintains accessible
label/group association. Checkbox and radioButtonText exercise different control
shapes. Radio options share native grouping inside each instance's shadow tree.
Python's grammar loader now supplies the upstream nullable-name information so
explicit None remains accepted only by nullable signatures.

Verified: full core JS suite 3461/3461; Python 162 passed + 259 subtests, with one
expected failure reproducing the upstream nested-Regex/Union issue. The focused
component suite subsequently passed all 9 cases including shared Data and reactive
datapath rebinding. Python-first browser qualification passed Chromium and WebKit;
screenshots reviewed, native radio arrow keys and group isolation included.
The public component guide passed the strict Sphinx build. The first sandboxed
full-suite attempts could not bind conformance servers and had stale bundles;
regeneration and authorized local-server runs resolved those environmental failures.

Open dependency defect: Python Builders 0.28.1 ignores Regex nested in a Union,
so a bool/int-or-pointer authoring signature can accept arbitrary literal strings;
JS rejects them. Direct regression: test_upstream_annotated_regex_inside_union.
No dependency edit, weakening of the declared schema or consumer workaround was
introduced. Fix belongs to Builders; full invalid-input parity is not claimed.

[GC-105](../public/105-components.md) documents actual usage, activation, export,
limits and component authoring. PORT-0010-input-components records the bounded
review. Implemented and locally verified; owner runtime review and broader 0.3
work remain. No version bump, commit, publication or gallery integration occurred.
Next: owner review of the first three-control increment before expanding the input
family, callbackSelect or application-wide collection configuration.


Follow-up, 2026-10-16: owner classifies the nested-Regex/Union discrepancy as an
edge case and authorizes opening the upstream issue ("ok ma è un edge case. apri
pure l'issue"). Filed [Builders Python #59](https://github.com/genro-org/genro-builders/issues/59)
with the minimal reproduction, expected branch-local validation and JS parity.
Track it as non-blocking for the component work; the known limitation and direct
expected-failure regression remain explicit until upstream resolves it.

<a id="gc-070-1015"></a>
## 1015 · Input collection loading and gallery examples — 2026-10-16

Owner confirms "Sì, collega inputs all’avvio della gallery", then requests the
JS + generated JSON collection connection and three labelbox examples. The gallery
selects inputs explicitly at application startup. Core servers load its generated
grammar for main and remote Source; PageBootstrap imports/registers the browser
module before mounting. All five Python adapters forward the configuration; Node
and serverless consume the same gallery declaration. The directory exporter embeds
collection modules for offline file opening.

The new chronological components section contains w01 textbox/shared text/live and
readonly, w02 checkbox/lbl versus label/disabled, and w03 two independent radio groups
with bound column count. All demonstrate reactive label positioning; textbox also
shows lbl_, box_, box_l_ and box_c_ style routing. Python and JS sources are paired.

Verification: core JS 3463 passed; core Python 163 passed, 259 subtests and one known
upstream expected failure; examples JS 70 passed and Python 16 passed/61 subtests;
JS server 33 passed, serverless 35 passed; Python adapters 102 passed. Browser checks
pass in Chromium and WebKit for Python, Node and the file:// serverless export:
three controls, Data writes, mirrored values, label positions and gallery frames.
WebKit is not a Safari application test. Visual review of the radio example completed.

No dependency patches, version bump, commit, push or publication. The upstream
Builders issue #59 remains nonblocking. Owner trial/acceptance and the rest of the
0.3 component family remain next work; this requested gallery increment is complete.

Documentation gate: strict core Sphinx build passes. The examples manual builds
49 interactive lessons, including the three components; paired guide identities,
search scope and all local links/anchors pass. Host guide pairs retain stable IDs.

Gallery code splitter follow-up — 2026-10-16: the owner requests resizing the
source panel. The existing preview/code divider already had pointer/keyboard
behavior but lacked the shared index-divider styling. Python and JS gallery pages
now apply that class and a drag tooltip, restoring the visible handle and resize
cursor without another splitter implementation. The 23 gallery tests pass; actual
widen/narrow dragging passes in Chromium and WebKit on Python, Node and file://
serverless galleries. Local galleries restarted and the static export rebuilt.


Gallery frame follow-up — 2026-10-16: the owner requests a top title/toolbar,
independent Navigation/Code toggles, a full-height right code sidebar symmetric
to navigation, smaller code and breathing room at the edge. Implemented in
Python and JavaScript gallery Source; IndexPage adds the optional `header(shell)`
hook and its runtime owns both sidebar controls, resizing and stored preferences.
The former per-example preview/code splitter is replaced by one right separator.
Code uses 11px text, inner padding and an inset scroll viewport. Hidden panes
release space without replacing the example iframe or resetting its source tabs.
Introduction/category pages suppress code without changing the user's preference.

Verification: 71 examples JS tests, 5 core index tests and 6 Python index/gallery
tests pass. Chromium and WebKit pass pointer/keyboard resizing, sidebar toggles,
full-height alignment, retained iframe values, and restored widths/visibility in
Python, Node and the file:// static export (six scenarios). A reusable gallery
browser regression is stored in gramlot-examples/scripts/verify_gallery_layout.mjs.
Preview servers remain on 8205 (Python) and 8207 (Node); static export rebuilt.
No version bump or publication in this increment. Ready for the owner's visual trial.


Radio example slider follow-up — 2026-10-16: owner reports that the Columns
slider stops in the middle. A hard limit at 2 was not reproduced: click, keyboard
and continuous drag reach 3 in Chromium and WebKit. The measured usability defect
was vertical movement of the slider when the radio group changed row count.
The Python and JS examples now declare controls above the groups and show the
bound column count beside the label; no control/runtime workaround was added.
The browser regression checks full mouse drags 3 → 1 → 3, the numeric Data value,
visible count and unchanged slider Y position. All six Python/Node/file:// cases
pass in Chromium and WebKit. Local previews restarted and static export rebuilt.
The owner's exact reported middle-stop remains unconfirmed; this change removes
the observed layout instability.

Radio example compact sizing — 2026-10-16: owner requests controls that do not fill the entire row. Python/JS now declare a 16rem range, 8rem position selector, 24rem control card and 36rem radio card, all capped at 100% of available width through ordinary Source style attributes. Browser verification covers retained bindings and full slider travel on Python, Node and serverless in Chromium/WebKit; visual review confirms the compact arrangement.

Textbox/checkbox compact sizing — 2026-10-16: owner explicitly requests the same compact sizing as the radio example. Both Python/JS versions now use 24rem maximum control cards, 32rem maximum field cards and 8rem selectors. Cards take available width up to their cap; this also corrects the radio example to avoid intrinsic grid expansion from fixed widths. Chromium visual checks at 1200px and overflow checks at 360px pass for textbox and checkbox. Previews and static export updated; ordinary Source style declarations only.


<a id="gc-070-1020"></a>
## 1020 · Simple inputs with labelbox — 2026-10-16

Owner-authorized first block implemented: textBoxArea, passwordbox, radioButton,
colorpicker, horizontalSlider and verticalSlider. The collection now contains nine
controls. All use the existing component bases/mixins, binding lifecycle and
auto-registration; Python consumes the regenerated JSON. Numeric range metadata
supports literal integers/fractions and reactive min/max/step. Single radios reuse
the renderer's boolean RadioGroups and add cross-shadow arrow navigation.

Compact Python/JS gallery lessons w04–w09 cover shared values, live/commit,
reactive label positions and disabling. Cards are capped at 24rem. Preview servers
8205 (Python) and 8207 (Node) run the updated collection; the static export is rebuilt.
GC-105 §040 documents native limits and GC-245 §065 tracks this bounded increment.

Verification: 3,467 core JS tests and 163 core Python tests pass (one existing
expected failure for Builders nested Regex/Union, 259 Python subtests). The focused
component/native-control set passes 61 tests. Gallery tests pass 77 JS tests and
16 Python tests (67 subtests), including every new Python route. Chromium and
WebKit pass all nine controls on Python, Node and file:// serverless: shared values,
live/commit, radio arrow selection, full range dragging, disabled state and 360px
layout without overflow. Core and examples Sphinx builds succeed with warnings
as errors. Desktop screenshots reviewed for textarea, radios, vertical slider and
gallery embedding. Color tests dispatch native value events; the OS picker is not
automated. Vertical Home/End follow browser-native writing-mode differences,
explicitly documented. No forced native behavior replacement was introduced.

Verification setup notes: the first Python core run lacked local-socket permission;
rerunning with permission passed. The first gallery Python run imported installed
packages; rerunning with the current core/examples source paths passed. Neither
was a product defect. The gallery count assertion was updated from 50 to 56 routes.

Implemented and verified for owner trial; visual acceptance remains with the owner.
No bump, commit, push or publication requested/performed in this increment.
Next blocks remain typed editors and selection controls (including callbackSelect
with random options), then their agreed validation work. Do not treat this as
completion of the full 0.3 input collection.


Typed editor block started — 2026-10-16: owner authorizes numeric/date/time editors
and explicitly chooses PoC-style text entry with Gramlot formatting. Investigation
of numberTextBox/dateTextBox/timeTextBox confirms draft/committed-value separation
and existing reusable date-expression parsing. Portable Builder signatures reject
datetime.date, datetime.time and decimal.Decimal; the Python core loader is also
missing those named types. Explicit authorization for a bounded owning-library
extension is pending (AGENTS dependency boundary). No implementation workaround,
dependency edit or publication performed. See GC-245 §070 for the reproduction
and selected direction. Next: resolve the signature prerequisite, then implement
and qualify typed editing plus compact cross-host gallery examples.


Typed editor contract correction — 2026-10-16: owner confirms shared dtype codes
for exported component signatures (GC-245 §075, constitution 11.84 follow-up).
The previous named-class extension proposal is superseded. Decision recorded in
both mirrors; runtime and collection JSON remain unchanged. Next: establish dtype
support in the owning grammar/type interfaces, then wire the component export and
complete the authorized numeric/date/time editors and gallery examples. Do not
report these editors or dtype export as already implemented. No dependency changes
or publication performed in this decision-record update.


<a id="gc-070-1025"></a>
## 1025 · Typed input editors and portable dtype signatures — 2026-10-16

Owner authorization: "ok procedi con il supporto dei dtype nei builder e poi
completa gli input numerici, date e orari con labelbox ed esempi compatti nella
gallery". This follows the explicit PoC-style text editor choice and the dtype
contract correction (GC-245 §075). Implemented locally; owner visual acceptance
and publication remain separate.

Builder Python/JS now load `{kind: 'dtype', dtype: code}` through their existing
TYTX registries; Python exports registered domain annotations as dtype descriptors.
All component parameter metadata uses dtype, with independent nullable/binding and
intl_str qualification. Core's Python loader consumes the same grammar. No changes
to Bag/TYTX or conversions to strings/Number are used to bypass typed signatures.

The inputs collection now includes numberTextBox, dateTextBox and timeTextBox:
shared TypedEditor/Labelbox/FieldState, locale-aware numeric drafts, exact Decimal,
existing natural-language date parser, civil time with seconds/milliseconds,
formatting through the page, live/commit, Enter/Escape and invalid draft feedback.
Empty typed input writes null. D/H retain civil meaning without timezone shifts.
Renderer display directives remain available to component parameters. Decimal
services come from the page runtime, so a separately bundled collection uses the
same TYTX identity. GC-105 §045–050 documents supported syntax and current limits.

Gallery lessons w10–w12 are compact (24rem), Python-first with equivalent JS,
reactive label placement and shared values. The numeric JS page imports Bag inside
async Page.main, retaining Page and Logic in one module without a host-only import
executing in browser Logic. Python/Node previews are 8205/8207; the file export is
`/tmp/gramlot-components-gallery-static`. These are local development previews.

Verification:
- Builders JS: 151 tests pass, including dtype validation and value identity.
- Builders Python: all 75 grammar export/load tests pass. The attempted full
  dependency suite could not collect three unrelated XML/XSLT modules because
  this environment lacks lxml; no full Builder Python-suite claim is made.
- Core: 3473 JavaScript tests pass; 163 Python tests pass, one existing expected
  failure for upstream nested Regex/Union validation, 259 subtests.
- Gallery: 80 JavaScript and 16 Python tests pass; 70 Python subtests.
- Chromium/WebKit: all three typed pages pass on Python, Node and file://, including
  invalid/null edits, Decimal beyond 2^53, natural date words, time precision,
  readonly, labelbox and 360px overflow checks. Desktop screenshot reviewed.
- Core and example Sphinx builds pass with warnings treated as errors.

No bump, release or publication. Coordinated development installs need the edited
Builder JS plus rebuilt core and gallery; the public package versions do not yet
include this work. Remaining 0.3 work includes selection families/callbackSelect,
full validation and later store-based controls; no calendar/time popup or spinner
is claimed in this bounded text-editor increment.


<a id="gc-070-1030"></a>
## 1030 · Local and callback choices — 2026-10-16

Owner requested the next block and confirmed "Sì, confermo questa API" to
filteringSelect with values and callbackSelect with a named Logic callback.
Implemented both over shared ChoiceEditor/NativeControl, Labelbox and FieldState.
The existing Logic registry invokes (node, kw); _querystring/_id and the
{rows, identifier, caption} envelope retain the confirmed PoC contract. No new
callback evaluator, endpoint or dependency change is introduced.

The controls keep query drafts out of Data, commit string codes, resolve captions,
handle invalid/empty edits, keyboard/mouse selection and pending/error states.
Responses cannot replace newer searches/external selections or survive disposal.
Portable inputs grammar contains both declarations. GC-105 §055 explains use and
limits; GC-245 §085 records the bounded delivery. Native select stays unchanged.

Gallery w13/w14 are Python-first with JS twins: compact cards, shared labelbox,
readonly and a Data Bag of 100 random records generated once by a startup
controller. Repeated queries reuse those records. Python 8205, Node 8207 and the
static gallery in /tmp/gramlot-components-gallery-static were rebuilt.

Verification:
- Core JS: 3478 passed, including five focused choice tests for initial lookup,
  Data writes, reactivity, keyboard, invalid/null, asynchronous races, failures and
  disposal. Core Python: 163 passed, one existing expected failure, 259 subtests.
- Gallery JS: 82 passed. Gallery Python: 16 passed, 72 subtests. The catalogue has
  60 examples plus its index. Tests check stable random records and caption lookup.
- Chromium and WebKit: both pages pass on Python, Node and file://, including
  real popup interaction, shared value, readonly/labelbox and 360px no-overflow.
  The desktop callback screenshot was reviewed.
- Core and examples Sphinx builds pass with warnings treated as errors. The
  example playground bundle still emits its existing import.meta/IIFE warnings;
  the browser qualification has no page errors.

Implemented and automatically verified, awaiting owner visual acceptance. No
version bump, commit, push or publication. Other choice families (comboBox,
checkBoxText), store/DB providers, full validation and the optional regeneration
reset policy remain outside this block. No additional phase has been started.


<a id="gc-070-1035"></a>
## 1035 · Remaining local choices completed — 2026-10-16

Owner authorizes comboBox/checkBoxText with "procedi", then confirms
"Sì, stringa di codici come nel PoC" for checkBoxText: comma-separated codes or
null when no option is selected. This resolves the initial value-contract question.

Implemented comboBox as the free-text ChoiceEditor/localChoices policy: unlisted
text, suggestion captions, null/empty distinction and normal live/IME binding.
checkBoxText uses ChoiceGroup's multiple policy with stable selected-code order,
shared Data, reactive values/columns/labelbox, readonly/disabled and keyboard focus.
The runtime binding remains the sole Data writer. Portable metadata keeps dtype T
and nullable/twoWay independently; both Python and JS use the same widget names.
No new dependency, callback evaluator or application state system was introduced.

Compact Python-first gallery w15/w16 have JS twins. Python 8205, Node 8207 and the
file:// static output in /tmp/gramlot-components-gallery-static were rebuilt.
GC-105 §§060–065 documents the contracts; GC-245 §090 records delivery scope.

Verification:
- Core JS: 3482 passed, including shared radio/select regression coverage and
  free-text, IME, ordered multiple selection, null, locks, focus and disposal tests.
- Core Python: 163 passed, one existing expected failure, 261 subtests; generated
  signatures include case-insensitive comboBox/checkBoxText and explicit null.
- Gallery JS: 84 passed. Gallery Python: 16 passed, 74 subtests. The catalogue
  now contains 62 examples plus the index.
- Chromium and WebKit: both new lessons pass on Python, Node and file://, including
  keyboard/mouse input, shared values, null/empty, readonly, labelbox and 360px
  no-overflow. The desktop group screenshot was reviewed.
- Core and examples Sphinx builds pass with warnings treated as errors. The
  playground build retains the previously recorded import.meta/IIFE warnings.

Implemented and verified locally; owner visual acceptance is still separate.
No version bump, commit, push or publication. The accepted inline/free-text choice
block is complete. Calendar, basic shared validation, theme refinement and final
collection qualification remain later work. PoC checkbox popup/store-backed
options are not part of this increment; no additional phase was started.


<a id="gc-070-1040"></a>
## 1040 · Calendar and date editor integration — 2026-10-16

Owner approved dateCalendar and dateTextBox calendar=True default / calendar=False opt-out. Implemented shared civil-date calendar, Labelbox, typed D binding, keyboard month/day navigation, null clearing, readonly/disabled, popup cleanup and external Data refresh. Generated Python grammar matches JS descriptors. Gallery w17 compares inline calendar, popup and text-only editing; w11 demonstrates the opt-out. Core checks: 3487 JS tests; Python 163 passed, one existing xfail, 261 subtests. Gallery: 85 JS tests; Python 16 passed and 75 subtests. Chromium and WebKit pass on Python 8205, Node 8207 and the file:// serverless export; compact layout was visually reviewed. Core and examples Sphinx builds pass with warnings treated as errors. The selected date remains typed through the adapter (including live mode), avoiding short-year caption reparsing; Python TYTX dateCalendar authoring is covered. Local development only, no release. Remaining wider 0.3 work: agreed basic validation, theme refinement and final distribution qualification.


<a id="gc-070-1045"></a>
## 1045 · Shared required/length validation — 2026-10-17

Implemented the owner-confirmed rejected-draft policy for validate_notnull and validate_len with customizable messages. FieldState shares messages/ARIA/native validity; conversion and choice checks run before rule acceptance, while ControlAdapter remains the only writer. Declared component parameters use resolved Source values before HTML-specific filtering; no dependency edits. Invalid drafts survive equal Data projections and label changes; different external Data replaces them. Existing live/change/IME timing is retained. Generated Python metadata and compact gallery w18 are included. Core suite: 3493 JS tests; Python 163 passed, one existing xfail and 261 subtests. Gallery: 86 JS tests; Python 16 passed and 76 subtests. Final focused component tests: 38 passed. Chromium and WebKit pass on Python 8205, Node 8207 and the file:// serverless export; compact error presentation visually reviewed. Core and examples Sphinx builds pass with warnings treated as errors. No publication; owner visual acceptance remains separate. Remaining 0.3 work: themes, extension/distribution proof and final qualification. Full validation and form orchestration remain outside this increment.


<a id="gc-070-1050"></a>
## 1050 · Floating validation feedback — 2026-10-17

Owner rejected inline messages that move following controls and requested red
invalid fields with disappearing floating messages. Legacy inspection confirmed
Error state plus dijit tooltip (not inline layout); legacy Tundra used yellow,
whereas the owner explicitly requests red here. FieldState now owns a manual
native popover, four-second dismissal, Escape/scroll/resize hiding, focus/hover
redisplay and cleanup. Error state/accessibility text and last-valid Data survive
dismissal. WebKit changes native input dimensions when background/border styling
is changed, so the red indication uses an external outline and text color only.

Core suite: 3494 JS tests passed; final focused validation: 7 passed; gallery: 86 passed. Browser checks
pass on Chromium and WebKit for Python 8205, Node 8207 and file:// serverless,
including unchanged field height and following-control position, red indication,
timeout/reopen, recovery, Data separation and compact layout. Screenshots reviewed.
Python runtime/signatures are unchanged. Core and gallery documentation builds pass.
Gallery test harness now supplies jsdom's missing popover methods, while actual
rendering is tested in browsers. No publication. Remaining 0.3 work is unchanged:
shared theme refinement and final extension/distribution qualification.


<a id="gc-070-1055"></a>
## 1055 · GenroPy-inspired theme families — 2026-10-17

Implemented genropy-mimi and genropy-gioanna (legacy file joanna.css), using legacy
light palette/proportion references and separate Gramlot dark adaptations. Base and
Compact remain available. Canonical core theme assets ship through the existing
build. Shared input shadow styling consumes semantic palette/field/label tokens;
calendar, choices and validation popovers follow the theme. Explicit Source styles
retain precedence. Index/gallery Python and JS selectors expose both profiles;
existing frame messages and preference storage synchronize them without navigation
or rebuilding controls. Theme CSS replaces the previous profile instead of stacking
active profiles. No dependency edits or publication.

Verified: 3494 core JS tests; final index tests 6 passed (including new profile
replacement/persistence check); Python 163 passed, 1 preexisting xfail, 261 subtests;
gallery 86 JS tests. Chromium and WebKit pass both theme profiles in light/dark on
Python 8205, Node 8207 and file:// serverless: actual shadow styles, Data editing,
calendar, choices, error messages and hosted persistence. Validation browser checks
also pass all six environments, including no error-induced layout shift. Light
screenshots reviewed; visual fidelity remains an owner review, not a pixel-parity
claim. Core/gallery docs cover usage and tokens. Remaining wider 0.3 work: final
extension/distribution qualification and any owner-requested visual refinements.


<a id="gc-070-1060"></a>

## 1060 · Gallery settings and legacy visual reference (2026-10-17)

Owner requested a footer gear for shared settings and provided the Demetra manual
as evidence of an application theme layered over a GenroPy base. Implemented in
gramlot-examples: native popover containing theme/color, keyboard navigation, label
position and installation instructions. Label overrides travel to owned preview
frames by postMessage and update Source attributes; the example-default choice
restores authored pointers. The choice persists independently per gallery origin
and path. Only the dedicated textbox/labelbox lesson retains its local position
selector; later component lessons focus on their specific behavior.

Verified: 88 gallery JS tests; 16 Python tests with 76 subtests; documentation build;
six Chromium/WebKit × Python/Node/file-export settings checks (open/close, no layout
shift, theme/color, lazy frames, pointer restoration, persistence and narrow viewport).
Visual comparison of Demetra manual pages 5–7 is recorded under PORT-0010. It does
not establish pixel parity or live interaction equivalence. No core runtime,
dependency or release change. Local implementation verified; owner visual acceptance
and wider 0.3 qualification remain separate.

Additional verification: all six existing input-family browser runs and all six Mimi/Gioanna theme runs passed after moving the controls into Settings. Core and gallery documentation builds passed with warnings treated as errors.


<a id="gc-070-1065"></a>

## 1065 · Live invoice theme comparison awaiting login (2026-10-17)

Owner authorized comparing test_invoice_pg visually and adjusting Gramlot theme
field/label sizes and spacing. Started the existing GenroPy daemon on localhost
40404 and test_invoice_pg on 127.0.0.1:8210 without editing the legacy repository
or application records. The page loads Mimi and requires authentication; a Chrome
tab is open and the owner was asked to sign in. No form-page visual equivalence
is claimed and no theme changes have been made in this follow-up yet.

Preliminary browser measurements at normal scale: legacy login field 23.69px high,
12px text, 4px radius (login-specific padding); Gramlot Mimi 24px / 12px / 3px,
label 11.04px and label gap 3px; Gramlot Gioanna 26px / 13px / 6px, label 11.96px
and gap 3.25px. Login dimensions must not be generalized to invoice forms. Legacy
form CSS uses 6px formbuilder spacing, normal label weight and theme-specific
label ratios (.9em default, .8em Joanna). Next: after login, inspect actual invoice
form fields and adjust shared theme tokens with browser regression checks.


<a id="gc-070-1070"></a>

## 1070 · Live invoice density refinement verified (2026-10-17)

Owner opened the invoice in test_invoice_pg and authorized the visual comparison
and theme adjustments. Inspected that authenticated invoice in Chrome, including
locked and enabled fields, then restored its locked state without changing records.
Live Mimi: 17.5px fields, 12px text, 10.8px labels, 1px top/3px left field padding,
4px corners and 4px formbuilder cell spacing (3px in the totals area).

Implemented: Mimi 18px minimum fields / .9em labels; Gioanna 20px / .8em labels,
retaining their separate 12px/13px typography and palettes. Both use 1px × 3px
field padding, 2px label gap and 6px stack spacing. Field line-height and label
spacing/color are shared CSS tokens read inside component shadow roots. The date
calendar button matches field height. Base/Compact density remains unchanged.
This is a proportional adaptation, not a layout/formbuilder port; Joanna's own
live invoice was not measured. WebKit may render an input one pixel above the
CSS minimum because of native font metrics.

Verified: 39 component/typed/calendar/choice/validation tests; all six theme browser
runs (Chromium/WebKit × Python/Node/file-export), covering actual compact geometry,
light/dark, Data editing, calendar, choice popup, validation with no layout shift,
and hosted persistence. Documentation build passes with warnings treated as errors.
Python 8205, Node 8207 and the local serverless export were rebuilt/refreshed.
Local implementation verified; owner visual acceptance and the wider 0.3 release
remain separate. No publication performed.


<a id="gc-070-1075"></a>

## 1075 · Theme names simplified (2026-10-17)

Owner: “per i temi chiamali mimi e joanna ma non mettere genropy davanti”.
Canonical IDs, selector captions and theme directories are now `mimi` and `joanna`.
Updated Python/JS index pages, gallery build and selectors, public documentation
and tests. Historical decisions above retain their original names; the naming
correction supersedes them. No compatibility aliases were added. Existing saved
preview preferences with old IDs require selecting the renamed theme again.
Core and gallery assets rebuilt, Python/Node galleries restarted, serverless
export refreshed. Index tests: 6 JS + 3 Python; gallery tests: 26 JS + 3 Python.
No publication requested or performed.

Rename verification also passed all six Chromium/WebKit × Python/Node/file theme checks and both documentation builds.


<a id="gc-070-1080"></a>

## 1080 · Relative date reference corrected (2026-10-17)

Owner reported that ieri on October 17 yielded October 15. The gallery date
lessons w11/w17 explicitly fixed workdate to October 16; that override is removed
from Python and JS. The component also failed to supply a default workdate to the
pure parser. dateTextBox now supplies the browser's local date at each parse when
workdate is omitted, matching calendar Today; an explicit workdate still wins.
The initial field value does not determine the reference day. Parser API unchanged.

Regression coverage fixes the clock in tests only: October 17 gives ieri=16,
oggi=17, domani=18; advancing the clock to October 18 without rebuilding the field
makes ieri=17. Existing explicit-workdate tests remain. Eleven typed/calendar unit
tests passed. Gallery browser checks use a fixed test clock rather than modifying
example declarations. Python/Node galleries and serverless export refreshed.

Verified all 12 browser runs: typed editors and calendar, Chromium/WebKit × Python/Node/file export. Local correction complete; no release or publication performed.


<a id="gc-070-1085"></a>

## 1085 · Quieter editor assistance and error presentation (2026-10-17)

Owner requested avoiding unrelated macOS suggestions, a shorter fading validation
message and a red field background instead of the error border. NativeControl now
sets autocomplete/autocorrect/autocapitalize off and spellcheck false on internal
text/password inputs and textarea. These are browser hints, not a guarantee against
external OS/password-manager suggestions. Filtering/callback list behavior remains.
FieldState uses error-background and error text, retaining normal focus indication;
the floating message stays for 1800ms, fades for 200ms, then closes. Reduced-motion
preferences disable the animation. Escape/scroll/resize/disposal hide immediately.
Reopening cancels the old timer/fade. Data acceptance and validation rules unchanged.

Verified 23 validation/typed/choice unit tests, including timer phases/cleanup and
assistance attributes. Core documentation build passes. Gallery and runtime assets
rebuilt; hosted galleries restarted and local file export refreshed. Local change,
no publication. Browser qualification is recorded below when complete.

Browser qualification completed: all 12 validation/theme runs passed (Chromium/WebKit × Python/Node/file export), including error background, unchanged geometry, timeout/reopen, assistance attributes, dark mode and persistence.


<a id="gc-070-1090"></a>
## 1090 · Touch density and same-page mobile previews (2026-10-17)

Owner authorized touch mode, a page suitability declaration, and Normale/Mobile gallery controls while retaining the same example and Data. Implemented Page.devices (desktop/tablet/phone; empty is undeclared), HTTP/Worker propagation and frozen gramlot.devices. Existing gramlot.dom.setTouchMode controls automatic coarse-pointer detection or explicit on/off; shared theme tokens size input shadow controls, choice rows and calendars without changing palette.

Gallery preview controls retain the iframe and URL, use Source-owned presentation attributes, and send the selected touch mode over the existing owned-frame settings bridge. Mobile is at most 390 CSS pixels; Normale uses available width and ordinary density. Accepted Data and rejected input drafts survive switches, as does each example's mode when changing tabs. w01/w17/w18 demonstrate device declarations. Metadata is informational, and the preview does not emulate an OS keyboard or certify real-device compatibility.

Verified: 51 selected core JS tests (the server subprocess test was rerun successfully with the project Python interpreter), 4 Python core tests, 27 gallery JS tests, 3 Python gallery tests and 12 standalone tests. Browser checks passed on Python 8205, Node 8207 and file-based serverless in Chromium and WebKit: six preview cases plus two automatic-touch checks; six theme regression cases also passed. Visual review confirmed compact chrome, centered mobile preview and larger fields without a page replacement. Core, gallery and server documentation builds passed, including core public-link/mirror checks and both adapter documentation trees.

Implemented and verified locally; final owner visual acceptance remains separate. No release or publication performed. Running galleries and the local static export contain the updated runtime and examples.


<a id="gc-070-1095"></a>
## 1095 · Gallery left-label alignment (2026-10-17)

Owner: “ok applicalo agli esempi della gallery: quando scelgo label a sinistra voglio etichette allineate a destra e campi allineati, senza aspettare il formlet”. Implemented only in the existing gallery preview settings bridge: position L applies an 8rem label column, right-aligned text, consistent padding and a flexible control column through existing Source labelbox attributes. Other positions restore original layout declarations; Example also restores the original position/pointer. No core component API or formlet was introduced.

Verified locally: all 27 gallery JS tests passed, including repeated overrides and restoration of authored styles/pointers. Six browser cases passed across Python 8205, Node 8207 and file-based serverless in Chromium/WebKit, measuring textarea/textbox/checkbox alignment and checking mobile fit, unchanged Data/text and original padding restoration. Visual review of the mobile textarea lesson confirms the requested alignment. The galleries and static export were refreshed; no publication was requested.


2026-10-17 refinement to GC-070 §1095: owner requested 1–2 additional pixels to the right of left-position labels. Gallery LEFT_LABEL_LAYOUT now uses box_l_padding="0px 2px 0px 0px". The common columns and restoration behavior are unchanged. Browser assets rebuilt; no new API or publication.


<a id="gc-070-1100"></a>
## 1100 · Popup icons inside the field (2026-10-17)

Owner requested popup icons inside the right edge of widgets instead of external buttons. dateTextBox now overlays its real calendar button within the input bounds, with no separate border/background, and reserves padding only when calendar is enabled. Choice triggers use the same inside-field geometry and field font sizing. Explicit internal control selectors ensure base input styles cannot override the required text padding. Touch targets remain inside the input; readonly, disabled and keyboard behavior are retained.

Verified: 14 calendar/choice JS tests passed; six calendar browser regression cases checked editing, typed dates, natural text, keyboard, null, readonly and opt-out across Python, Node and serverless in Chromium/WebKit. Six additional browser cases measured both triggers and text padding in Base/Compact/mimi/joanna, normal and touch modes, and checked opening/Escape and calendar=False. Visual review confirmed the icon inside the field. Core documentation builds passed. Gallery inputs bundles, running servers and static export were rebuilt; no publication.


<a id="gc-070-1105"></a>
## 1105 · Formlet, groupBox copy and switch (2026-10-17)

Owner authorized this bounded port, including default TYTX copy with JSON menu
and compact gallery lessons. Implemented a separate layout collection with
portable container grammar, slotted formlet/groupBox, Source-scoped reactive
lbl_*/box_* defaults, explicit field overrides and stable controls/drafts on
layout-only updates. GroupBox reads only its explicit Data scope, serializes TYTX
or values-only JSON, and reports clipboard errors without changing Data.
Checkbox variant="switch" reuses the native boolean binding and labelbox.

Python-first gallery w19/w20/w21 and matching JS pages are connected on Python,
Node and serverless. Gallery settings adjust field labels without changing group
headings. The JS typed example imports Bag through Gramlot's public export, like
the existing numeric lesson, keeping the same runtime type registry.

Verified: 3503 core JS tests (3500 in the sandbox plus the three socket-based
conformance tests rerun successfully outside it); 5 core Python component tests
and 6 subtests, with one pre-existing expected upstream failure; 92 gallery JS
tests; 4 gallery Python tests and 79 subtests. Six Chromium/WebKit cases cover all
three gallery environments, layout/draft/focus retention, copy actions and typed
wire payloads, responsive mobile fit, switch keyboard/binding/readonly. A separate
Chromium check writes and reads actual clipboard TYTX and JSON. The cross-browser
action tests isolate clipboard permission with a test writer; actual Safari
clipboard permissions remain browser-controlled. Core and gallery docs build
successfully. Visual review corrected dark group header contrast and confirmed
compact desktop/touch layouts.

Implemented and verified locally; owner visual acceptance is separate. Running
galleries 8205/8207 and the temporary static export are updated. No release or
publication. See PORT-0011 and GC-105 §085 for scope and exclusions.


<a id="gc-070-1110"></a>
## 1110 · Adversarial component review (2026-10-17)

Owner requested review of duplication, non-parametric code, inconsistencies and
arbitrary constants before building more components. Reviewed the input/layout
collections, shared mixins, renderer/adapter integration and theme behavior.
[Detailed findings and reproducible probes](../../ports/PORT-0011-formlet-group-box/review-2026-10-17.md)
are retained under PORT-0011 and cross-referenced by PORT-0010.

Six defects reproduced: plain textbox drafts lost on direct label updates;
repeated ancestor evaluation and unnecessary formlet descendant projection;
readonly ignored by radioButtonText; root formlet gap token overridden; switch
thumb geometry not following its height token; stale copy error title after
successful retry. Four additional cleanup findings cover duplicate parameter
projection, renderer coupling to concrete tags/child grammar, repeated popup
placement and constants, and diverging local-option parsers.

47 existing targeted tests passed, including Python grammar fixtures; source
probes reproduced four findings and Chromium measurements reproduced two theme
findings. This review is not a full-repository or all-browser qualification.
Production behavior is unchanged; only review records/probes were added.
Both ports are revision-requested. The local implementation and prior verification
remain, but cleanup and regression coverage are incomplete. Next proposed work is
to correct these issues before adding more components; no new architecture/API,
publication or acceptance is implied by this review.


<a id="gc-070-1115"></a>
## 1115 · Component review corrections verified (2026-10-17)

Owner authorized corrections and cleanup of every point in the adversarial review,
with missing tests and complete verification before adding components. R1–R10 are
implemented and verified locally. The [review closing table](../../ports/PORT-0011-formlet-group-box/review-2026-10-17.md#review-corrections)
retains evidence and the mapping from each defect to its correction.

Shared component value projection now preserves uncommitted text during direct or
inherited presentation changes and retains real Data/IME updates. Formlet caches
own resolved defaults and refreshes only unmasked consumers of changed defaults;
columns-only changes no longer reproject fields or repeatedly evaluate ancestors.
ChoiceGroup owns readonly for both radio and checkbox groups. Formlet theme gaps,
switch dimensions, copy recovery and popup lifecycle/sizing are corrected.
projectParameters, parseChoices and positionPopup remove duplicated operations;
explicit presentationDefaults/dataScope metadata replaces tag/child-grammar
coupling. The obsolete presentationOnly project argument was removed.

Verification: 3511 core JS tests passed; 163 core Python tests and 261 subtests
passed, with one pre-existing expected upstream Builder regex failure. Gallery:
92 JS tests; 4 Python tests and 79 subtests passed. Eight new regression cases plus
the expanded Python grammar fixture cover the functional failures and structural
contracts. Chromium/WebKit measure all four themes with touch off/on, geometry,
popup bounds/cleanup and transient errors; six gallery cases pass on Python,
Node and serverless. Screenshots inspected. Docs build and whitespace checks pass.

Core/gallery assets and the 68-page static export are rebuilt; galleries 8205 and
8207 restarted with regenerated metadata. The corrective assignment is complete.
Both port records retain the initial review and verified resolution. Owner visual
acceptance and publication remain separate; no new component or release added.


<a id="gc-070-1120"></a>
## 1120 · Button component and button-bar analysis (2026-10-17)

Owner accepts the button/gramlot-button direction while retaining html_button,
then requests legacy syntax analysis including dropdown, LED/state buttons and
the multiButton bar (alternative/sticky items, dropdowns, add/remove, leading and
trailing objects). [GC-310](../future/310-buttons-and-button-bars.md) records the
Python declarations, JS/Dojo execution, menu and bar composition, present core
boundaries and proposed port stages. The source audit distinguishes toggle from
radio, and local Bag removal from database deletion. Actual MultiButton generates
lightButton items; arbitrary dropdown/side-subtree composition is an explicit new
requirement, not falsely attributed to that implementation.

Analysis complete; no runtime change, tests or publication claimed. The previously
verified R1–R10 corrections remain complete. Final extended API/scope and sequence
are pending owner review; this added direction precedes 0.3 package qualification.


Scope follow-up (2026-10-17): owner defers button bars to containers and chooses
a single dropdown with separate main action/arrow, changeable action+label and
optional persistence. GC-310 §040 supersedes the earlier split-family/bar proposal.
Analysis/contract update only; no runtime changes or tests required. Remaining:
consolidate the bounded button API and persistence behavior before implementation.


<a id="gc-070-1125"></a>
## 1125 · Command components and gallery — 2026-10-17

Owner: “ok aggiorna il contratto e procedi con button, toggle con led e dropdown unico con questa logica e persist, lasciando fuori la bottoniera. aggiungi gli esempi nella gallery”. GC-310 §045 supersedes §1120's pending API status.

Implemented: built-in button/gramlot-button, toggleButton with boolean Data and LED, unified dropDownButton with main action and menu arrow, menu/menuline, normal execute versus Shift execute-and-select, code-only persistence. Generated JSON gives Python the same definitions. Shared ButtonBinding owns all action/ask/delay/controller dispatch; html_button retains native form behavior. Native shell/dialog/example controls were adjusted accordingly. No dependency edit or publication.

Verified: 3521 JS core tests; 164 Python tests and 264 subtests with one existing expected upstream failure. Ten focused command tests; real Chromium/WebKit fixtures cover keyboard, persistence, visible LED, ask, four themes and touch. Gallery w22–w24 passed in Python 8205, Node 8207 and static serverless (six browser runs). Gallery JS 95 tests and Python 16 tests/82 subtests pass. Public doc checker and Sphinx -W pass. PORT-0012 records the bounded port and review feedback.

Remaining: owner visual review of w22/w23/w24 before broader 0.3 acceptance. Button bars/nested menus stay deferred. No bump, commit, push or publication performed.


<a id="gc-070-1130"></a>
## 1130 · Builder upstream changes identified — 2026-10-17

Owner: “nel frattempo builder ha fatto modifiche di cui devi tenere conto”. Read-only upstream inspection identifies Python 0.29.0 at 20487ed (PR #61) and JS 0.6.0 at de3957c (PR #22). Their migration guides document shared dtype signatures, explicit pointer suffixes, dependency discovery, and literal ordinary ${name} text without helper consumption. JS exposes evaluatePointerExpression(node, name, raw, expression, inputs); static rendering remains inert.

The current core environment still installs Python 0.28.1 and JS 0.5.2. The §1125 qualification therefore applies to those installed dependencies, not yet to the new Builder versions. Gramlot still duplicates pointer parsing/resolution in page/pointer.py and binding/pointer.js, including automatic ${name} interpolation. Merely updating the package would leave overlapping responsibility.

Next bounded consumer migration: refresh both Builder packages; use their shared parsing/resolution/dependency APIs; connect the existing activation/CSP-aware InlineCompiler and local _F through the expression hook; retain Gramlot-specific subscriptions, variable datapath, value restrictions, format/mask and lifecycle. Re-evaluate local dtype grammar loading against the new base capability, update GC-210/public guidance and test the complete runtime/gallery before release. Upstream repositories and installed source copies were not edited; no dependency refresh, consumer migration or new-version compatibility has yet been claimed.


<a id="gc-070-1135"></a>
## 1135 · Builder alignment and duplicate removal — 2026-10-17

Owner: “si procedi con l'allineamento ai nuovi builder, togli le duplicazioni e verifica tutti i test e gli esempi della gallery”. Supersedes the pending consumer migration in §1130.

Implemented:
- Refreshed Python Builder to 0.29.0 and JS Builder to 0.6.0; raised the unbounded minimum requirements. The existing JSR-only bounded-range exception uses ^0.6.0.
- Removed Gramlot's Python pointer module and duplicate JS pointer parser, template engine and expression scanner. Ordinary projection uses Builder runtime resolution; the page hook compiles activated expressions with local `_F`, including HTML/SVG subbuilders.
- Retained Gramlot-owned structural reads (parent-context variable datapath, null contexts, provider/path attributes) and subscriptions. A regression covers transformed attributes across a selected context becoming null and returning, without reading the Data root.
- Replaced the Python signature/dtype decoder with Builder's declaration compiler. Gramlot retains instance-collection composition, which Python Builder does not yet expose. Built-in button metadata is loaded with the class grammar, like HTML and binding declarations.
- Retired automatic `${name}` interpolation and consumption checks; literal text/backslashes survive. JavaScript template literals inside authored code remain JS. Migrated c16 in Python/JS and its lesson/tests to explicit pointer suffixes with retained named attributes.
- Rebuilt the core and gallery artifacts, refreshed the Python gallery environment and serverless export. Updated paired public/internal contracts and the constitution; upstream repositories/installed source were not patched.

Verified: full core JavaScript suite (3,522 tests); Python suite (164 tests and 264 subtests, with the existing upstream nested-Annotated/Union Regex expected failure still present on Builder 0.29.0); gallery suites (95 JS, 16 Python plus 82 subtests). Core real-browser button/review qualifications and eight gallery interaction scripts pass in Chromium/WebKit across Python, Node and serverless: inputs, typed editors, filtering/callback choices, local choices, calendar, validation, layouts and commands. Public documentation checks and Sphinx warnings-as-errors build pass.

Final isolated whole-gallery sweep passed: 71/71 pages (index plus 70 catalogue examples) in each of six combinations: Chromium/WebKit × Python/Node/serverless, 426 page checks total. Each page starts and renders without browser errors; c16 also verifies reactive title and retained customer projection. The first reused-page WebKit sweep produced navigation-abort noise; isolated pages finish startup requests before checking and closing. The repeatable verifier is in gramlot-examples/scripts/verify_all_gallery_pages_browser.mjs. Gallery documentation also passes Sphinx warnings-as-errors and link checks for 70 lessons/two paired guides. A duplicate development anchor for command components was corrected to GE-010 §195, preserving the original §150 choice-component anchor.

No version bump, commit, push or publication. Broader 0.3 release acceptance remains separate.


<a id="gc-070-1140"></a>
## 1140 · Inspector native controls after button migration — 2026-10-17

Owner reported the property-delete icon below its row with an unreadable dark background. The inspector still authored its internal commands with `button`, now a themed webcomponent: native-button CSS no longer reached the actual control. Its tabs, property actions, breakpoint dialogs and style commands now use `html_button` with their existing explicit `connect_on` handlers. The trash icon is centered with inline flex; hover/focus visibility and deletion behavior remain unchanged.

Verified: reproduced the inherited dark background before the fix; all 27 inspector unit tests and Chromium/WebKit browser qualifications pass after rebuilding. The browser regression checks a dark application's inherited tokens, a white add control, a transparent visible trash control, icon/row vertical alignment and attribute deletion. Core distributable inspector artifacts and the local gallery bundle rebuilt. No release or publication.


<a id="gc-070-1145"></a>
## 1145 · Inspector enumerations and checkbox mode — 2026-10-17

Owner: “se ci sono valori predefiniti l'inspector dovrebbe avere una tendina”; naming preference “piu che variant forse mi piacerebbe 'mode'”. Checkbox presentation is now `mode="checkbox"` (default) or `mode="switch"`, with the same reactive binding; gallery recipes and public documentation are aligned. GroupBox's separate `lbl_variant` remains unchanged.

Component descriptors expose string enumerations through `enum`, included in generated Python/JS metadata. Checkbox mode, labelbox position and groupBox header variant reuse those lists. The inspector reads them from actual Source metadata and transports them through its existing bridge. Existing literal enum attributes use native selects, committing changes immediately; pointers remain text. No inferred choices from the DOM, separate inspector choice tables or compatibility aliases.

Verified: 29 inspector tests (including repeated enum changes locally and through MessagePort, preservation of pointers and ordinary editing); 17 component/layout tests including generated Python grammar and reactive mode. Inspector browser qualifications and gallery layout/switch checks pass in Chromium and WebKit. In the live Python gallery, changing mode from switch to checkbox and back updates the actual widget while retaining its checked Data. Rebuilt core and gallery artifacts; restarted Python gallery on 8205. No release or publication. The owner's question about switch color was answered; using `color` for the active track is only a proposal, not implemented.


<a id="gc-070-1150"></a>
## 1150 · Reactive switch color — 2026-10-17

Owner proposed `switch_color` and confirmed “ok perfetto”. Implemented as a nullable, read-bound checkbox parameter in the shared descriptor/generated grammar. In switch mode it overrides the existing active-track token on the internal control; null/omission removes that override. The off state, other instances and ordinary text color remain unchanged. Gallery w21 uses a purple Data-bound color in both Python and JS.

Verified: 18 component/layout tests, including portable Python grammar, reactive color updates, null reset, mode changes, instance isolation, unchanged text color and boolean Data. Chromium/WebKit gallery checks verify actual purple/red active backgrounds, unchanged off background and restoration of the theme against another switch. Core/gallery bundles rebuilt; Python gallery restarted on 8205. No publication. This completes the previously proposed color capability from §1145.


<a id="gc-070-1155"></a>
## 1155 · Gallery Left-preview label spacing — 2026-10-17

Owner reported excessive spacing between left labels and controls in the formlet example. The gallery's Left override supplied an 8rem label track while the formlet's inherited lbl_width remained 6rem, leaving an extra 2rem (24px in the reproduced view). The gallery override now sets lbl_width to 100% of its label track alongside the existing right alignment and 2px padding. Its existing Source snapshot restores authored/inherited widths when leaving the override; core labelbox and theme spacing are unchanged.

Verified: browser regression failed before the fix (29.25px actual versus 5.25px intended separation) and passes afterward in Chromium/WebKit. It also verifies restoration of the formlet's 6rem label width. All 27 gallery tests pass, including restoration of a bound lbl_width. Existing textarea/textbox/checkbox alignment, mobile fit and Data-retention checks pass. Gallery bundle rebuilt for the running Python server. No release or publication.


<a id="gc-070-1160"></a>
## 1160 · Intrinsic formlet label columns — 2026-10-17

Owner: “ok fai adattare automaticamente la larghezza delle label nel formlet alla più larga per ogni colonna, mantenendo i campi allineati. lbl_width solo se esplicito e togli le larghezze fisse dalla gallery”. Implemented in the library: FormletLabels measures directly slotted Labelbox fields in each rendered column, right-aligns left labels and aligns control boxes. Explicit lbl_width overrides remain; automatic widths are internal CSS state, never Source/Data. Intrinsic label observation, slot changes and batched animation-frame measurement handle growing/shrinking labels, font/theme changes, responsive columns and removal. Disconnect releases observers/listeners/frames; nested formlets remain independent. Calculated width tokens reset at each labelbox to prevent inheritance leaks.

Gallery preview now overrides only lbl_position. Grouped input examples use real formlets, and fixed label widths were removed from Python and JS recipes. Authored padding and other styles are preserved. This supersedes the fixed-column workaround in §1155: useful automatic layout belongs to the library, not demonstration-specific compensation.

Verified: 27 focused component/layout tests, including observer batching and disconnect/reconnect cleanup. The full JS suite passed 3,521 tests in the sandbox; the remaining 3 local-server conformance tests passed when rerun with network permissions (3,524 total, no unresolved failure). Gallery: all 95 JS and 16 Python tests pass. Python-first core browser qualification passes Chromium/WebKit for independent column maxima, label growth/shrink/empty/removal, CSS font changes, responsive layout, nested isolation, explicit widths, retained draft/focus/caret and unchanged Data. Gallery browser checks pass both engines for textarea/textbox/checkbox alignment, mobile fit, restored authored presentation, formlet editing, group copy and switch behavior. Separate gallery collection bundles are covered, not just the single-bundle fixture. Core/gallery artifacts rebuilt and Python gallery restarted at 8205. No commit, release or publication. Implementation is verified locally; owner visual acceptance remains pending.


<a id="gc-070-1165"></a>
## 1165 · Full field validation — 2026-10-17

Owner confirms the complete engine, leaving DB/grid to their own scope. Local rules, transformations, conditional execution, warnings, named/activated callbacks, asynchronous existing RPC, result notifications and stale-reply cancellation are implemented. Generated component grammar is shared with Python. Gallery w25 supplies compact Python/JS examples including an actual endpoint. No form persistence or publication. Qualification is recorded below. See PORT-0013 and GC-105 §076.


Qualification complete: the full JS suite passes 3,543 tests with local-server permissions. The final additional constrained-selection regression passes in the 20-test validation-engine suite (3,544 total covered tests). Python: 146 tests covered; the five HTTP conformance tests required an unrestricted rerun and pass, with the one pre-existing expected Builder failure unchanged. Gallery: 96 JS and 16 Python tests pass, including accepted/rejected endpoint responses. Chromium and WebKit pass the Python gallery's full-engine lesson and the existing basic-validation regression: real RPC, normalization, warning/blocking modes, callbacks, invalid draft/Data separation, tooltip expiry/reopening and no layout shift. Sphinx strict build and public documentation checks pass. Core/gallery bundles rebuilt; Python gallery remains available on 8205, new lesson /w25.

Adversarial follow-up addressed obsolete replies after input/IME, rebinding, external Data, rule/lock changes, disposal and Escape; typed candidates stay uncommitted until acceptance. Unknown selected captions and invalid normalized types are rejected. Returned Bag patches apply only on acceptance. The existing command toggle path retains synchronous acceptance and action ordering. Literal regexes with a leading anchor use ordinary noncapturing grouping to avoid Source's leading-^ pointer grammar; the gallery and guide show the correct declaration.

This completes the approved field-engine scope locally. DB/grid validators and form persistence remain separate as agreed. No commit, package release or publication; owner acceptance of the visible result remains pending.


<a id="gc-070-1170"></a>
## 1170 · Validation playground formlet — 2026-10-17

Owner requests a dedicated validation page with a labelled group and a formlet containing different widgets. Gallery w25 now composes one groupBox and one formlet with intrinsically aligned left labels: required/length text, normalized code, fallback text, bounded number, warning controls, conditional length, local/remote callbacks, multiline notes, required date and required filteringSelect. An expandable accepted-Data panel shows the retained values independently of rejected drafts. Python and JavaScript recipes and the lesson text agree; no framework behavior or form-save service was added.

Verified: all 96 gallery JavaScript and 16 Python tests pass. Chromium and WebKit checks pass for the group/formlet structure, required name/date/selection, multiline length, existing rules and actual Python endpoint RPC. The initial page screenshot was visually reviewed for compact grouping and aligned fields. Python gallery restarted on port 8205; /w25 is ready for owner review. No publication.


Copy follow-up (owner: “mettimi il copy nel groupbox”): w25 enables the existing groupBox copy control, TYTX by default and JSON through its menu. The explicit `profile` Bag is the copied scope; drafts remain outside Data. Python and JS authoring use explicit profile pointers. Chromium/WebKit verify both serialization results with an intercepted clipboard (no real clipboard overwritten), plus the full lesson validation/RPC checks; the focused JS example test passes.

**Historical observation, superseded by §1175:** when trialling relative pointers under a page `datapath="profile"` and a nested group datapath, the strict checkbox writes profile.strict but the email warning parameter does not refresh. Absolute profile pointers refresh correctly. This needs an isolated core binding reproduction before any framework change; do not interpret the working example as qualification of that relative-binding case.


Calendar icon follow-up — owner reports the date picker trigger looks like a white square. Replaced the font-dependent grid glyph with a small decorative inline SVG calendar (binding rings, header and date marks), using currentColor and relative size. The existing accessible button name, inside-right placement, disabled state and popup behavior are preserved across themes. Five calendar component tests pass; Chromium and WebKit verify the visible icon, popup opening and Escape closing. Gallery assets rebuilt and local server refreshed. No publication.


<a id="gc-070-1175"></a>
## 1175 · Corrected relative example and final 0.3 qualification — 2026-10-17

Owner: “ok correggi l'esempio togliendo quel datapath inutile, rimetti i pointer
relativi e poi procedi con le verifiche finali per chiudere la 0.3”. Removed the
unnecessary datapath="." declaration. The w25 groupBox owns datapath="profile";
its formlet fields use ^.field, conditions use the same context and callbacks use
node.SET('.validation_status', ...). The outside accepted-Data panel retains its
explicit profile paths. The copied scope is still the profile Bag.

This corrects the diagnosis in §1170: the failed trial introduced a redundant dot
context and double-dot paths. Ordinary inherited relative pointers work; switching
the example to absolute pointers was unnecessary. No general relative-binding
release blocker is established and no Builder change or consumer workaround is
part of this correction.

Full suites pass: 3,544 JavaScript core tests; 146 Python tests with one pre-existing
expected Builder failure; 96 JavaScript and 16 Python gallery tests. The calendar
SVG reuses the existing SVG_NS constant, satisfying the namespace ownership test.
A stale browser fixture now uses the approved checkbox mode parameter.

All nine gallery interaction scripts and full validation/RPC checks pass on Python,
Node and serverless in Chromium and WebKit. Core adversarial component, intrinsic
formlet and command-button browser checks pass both engines. w25 TYTX/JSON copy
passes again with clipboard interception. Inspector: 29 unit tests and Chromium/
WebKit browser checks pass. Firefox cannot launch its local profile, so it is not
qualified by this run; this is an environment limitation, not a passed product test.

Fresh core/gallery wheels and npm archives install in isolated temporary environments
using registry dependencies. Python dependency consistency and all installed-page
construction tests pass; installed JS collection metadata, assets and gallery Source
construction pass. Candidate archives retain the current versions: no bump or
publication has been performed. Whole-catalogue smoke and strict documentation
checks are recorded below when complete.

Final receipts: all 72 common pages start and render without browser errors on
Python, Node and serverless in Chromium and WebKit (432 page runs). The additional
serverless-only page passes both engines. Strict Sphinx builds and documentation
checks pass: 11 core public pages; 71 gallery lessons and two paired guides, with
search, sources, local links and mirrored anchors verified. The serverless build
warns about import.meta in the exported server-only runtimeAsset helper; that helper
and its URL expression are removed from the generated tested Worker bundle. No
warning suppression or workaround was introduced.

The approved local correction and final qualification are complete. Remaining
release actions are version bump, final owner acceptance, commit/consolidation,
push and package publication, when explicitly authorized. Known limits remain the
pre-existing expected Python Builder failure and the local Firefox launch issue;
no failing product test remains in the completed qualification.


<a id="gc-070-1180"></a>
## 1180 · Component release authorized — 2026-10-17

Owner answered “si” to “Procedo con bump, commit, push e pubblicazione?” after
completion of §1175. Release scope: core and examples 0.3.0; connected JS packages
0.2.11 and Python adapters 0.2.9. This authorizes consolidation of the verified
increments into main, tags, package publication and the associated public manuals.
Dependency minimums reflect the new collection-loading API without upper caps.
Local integration suites pass: all five Python adapters (102 tests), the JS
workspace suites and Bun. Publication results will be recorded separately.

Release-gate follow-up: the first CI run stopped before packaging/publication on
an obsolete native-submit browser fixture. The native declaration now uses
html_button; command type=submit explicitly verifies that no implicit submission
occurs, as documented in GC-105. All core CI browser harnesses pass locally after
this fixture correction. Integration gallery harnesses now open Settings before
changing the theme. Node/Bun gallery checks pass. The unpublished version tag is
recreated on this corrected verification commit; no registry version is replaced.
