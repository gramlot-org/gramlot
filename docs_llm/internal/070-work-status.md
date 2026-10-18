# 070 · Release and current development status

Document ID: **GC-070**. Updated: **2026-10-18**.

**Release preparation:** JavaScript gallery aligned with Python, packaged Python/Node/offline qualification and inspector CI prepared; publication remains pending. See [§1395](#gc-070-1395).

**Current checkpoint:** the 0.3 component release is published and verified from the public registries: seventeen inputs, labelbox, formlet/groupBox, command buttons, themes/touch and the complete field-validation engine. Final cross-host qualification and publication receipts are in [§1175](#gc-070-1175) and [§1185](#gc-070-1185).

**Website expansion:** 30-page welcome site and six-chapter guided tour implemented and locally verified; owner review/publication pending. Optional presenter-video storyboard drafted; see [§1300](#gc-070-1300).

**Inspector CSS variables:** the Styles trial and CSS download are implemented; locally verified; owner visual acceptance pending. See [§945](#gc-070-945).

**Themes and CSS guide:** GC-096 implemented and locally verified, including larger inline results with responsive code/result comparisons, reader-facing headings, the complete token catalogue and practical guidance; see [§950](#gc-070-950), [§935](#gc-070-935), [§930](#gc-070-930) and [§925](#gc-070-925).

**Graphic assets:** rich identity kit implemented and verified (2026-10-02); new vector artwork and layouts await owner visual acceptance. See [§650](#gc-070-650).

**Reusable index and root installation:** implemented and locally verified; see [§785](#gc-070-785). The stale Kajenn test environment is now updated and the full adapter suite passes.

**Hosted galleries:** Python and Node galleries are live on gallery-py.gramlot.dev and gallery-js.gramlot.dev, each with the verified offline ZIP download and automatic updates after successful releases of the four repositories; see [§1190](#gc-070-1190) and [§1195](#gc-070-1195).

**Mobile gallery:** published and verified on both public galleries and the downloaded serverless ZIP in Chromium and WebKit. See [§1205](#gc-070-1205), [§1210](#gc-070-1210) and the English-label correction in [§1215](#gc-070-1215).

**Next workstream:** container analysis for 0.4 is complete, including legacy Dojo and Genro patches; the proposed contract awaits owner review. See [§1230](#gc-070-1230). No new container runtime has been implemented.

**Deferred website design:** editorial HTML companions and two interactive-region modes for gramlot.org, asqueel.org and kajenn.org are recorded for later discussion (§850); no implementation started.

**Practical entry page:** GC-018 and the optional Chrome extension installation link are published in the public manual; see §845 for the original implementation checkpoint.

**Documentation follow-up:** all four public manuals are aligned and built from the release sources. The examples manual contains 71 lessons and complete Python/JavaScript sources; its embedded component lessons were rebuilt after serverless publication (§1185).

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
[GC-110](110-0-1-0-readiness.md#gc-110-020) is the completed release plan; [GC-125](125-execution-history.md) preserves historical evidence. PoC and old handoffs are not startup instructions.

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

Implemented: strict Source, native live renderer, shared Page/Host, Worker, adapter HTTP and close lifecycle. HTTP close is best effort with TTL; Worker termination releases its registry. Python dialect loading/TYTX/mixed text/insertion is Gramlot-owned (11.16); JS uses generic `sourceTarget` (11.18); Collection add/update follows 11.14. Bag source is unchanged upstream; tag replacement uses delete/insert.

2026-09-22 checks: Python 16/16 and installed wheel 16/16 with published Builder 0.23.2. Owner-authorized generic Builder JS 0.1.3 source is available at the declared GitHub dependency on `main` (a3a5860); it passes 109/109 with fresh Bag/TYTX. Fresh Gramlot JS dependencies resolve it, and core Node passes 74/74 with the existing Python test environment. Owner-authorized TYTX correction c8016d4 is now on GitHub; a second clean install passes Gramlot JS 74/74 and builds the browser bundle. TYTX passes 850/850 JS and 731/731 Python checks. Seven-host verification remains open; old 8/8 is historical.

2026-09-23 phase 2 review complete: one typed Source/rendering path and approved ownership confirmed; neutral JS/Python Hosts now reject TTLs that cannot expire and invalid capacity. Local core Node 75/75 and Python 17/17 pass. [GC-110 §2.1](110-0-1-0-readiness.md#gc-110-025) records paths, rationale and limits.

2026-09-23 phase 4 complete: fresh local wheels/archives installed in new Python 3.12/npm environments; Chromium Uvicorn, FastAPI, Kajenn, Flask, Node, Bun and Worker 7/7. Same bounded Source/main/remote/live/freeze/disposal checks, six server page closures and Worker termination pass. Installed adapter protocol tests: FastAPI 3/3, Flask 3/3, ASGI/Kajenn 2/2. [GC-110 §3.1](110-0-1-0-readiness.md#gc-110-035) records evidence and limits; no release or Safari/Firefox claim.

2026-09-23 phase 5 complete: public/internal docs and mirrors match current core and 7/7; strict Sphinx and public checks pass. Gramlot JS archive carries LICENSE/NOTICE, seven exports and bundles; Python wheel resources/collections match their owners. Local TYTX, NodeJS and Hello World notice corrections now pack into npm archives and relevant Python wheels. [GC-110 §5.1](110-0-1-0-readiness.md#gc-110-055) records evidence. At that checkpoint the changes were local; TYTX's later GitHub correction is verified in [GC-110 §6.2](110-0-1-0-readiness.md#gc-110-065).

Phase 6 is complete locally: Python/JS 0.1.0 manifests, fresh wheel/npm installs,
resource/export checks, Python 17/17 and JS 75/75 pass. At that phase-6 checkpoint the Chromium matrix had not been rerun on versioned artifacts; later GC-130 alignment below closes that verification gap. See [GC-110 §6.1](110-0-1-0-readiness.md#gc-110-060).

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

Update both views after progress. Separate implemented, local, clean-installed and accepted status; append dated evidence to GC-125. Report result and next action without routine Git summaries.

<a id="gc-070-030"></a>
## 030 · Historical execution checkpoints

The former chronology, decisions, rejected paths, artifacts and counts are preserved in [GC-125](125-execution-history.md).

<a id="gc-070-035"></a>
## 035 · Superseded status snapshots

GC-094 phases and eight-profile checks in GC-125 are historical, not current release gates.


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

**Decided:** owner, 2026-09-25: no genro-builders/genro-bag fixes; the earlier planned
dependency fixes are withdrawn and gate nothing. `GramlotBuilderBag` and
`GramlotBuilderBagNode` (`js/src/builder/source.js`) supply silent PUT, router-marked
FIRE, NodeBinding-tracked FIRE_AFTER and absDatapath (variable datapath, symbolic
?attr); SET/GET/setRelativeData/getRelativeData stay Builder's. P17 updated; semantic
state stays in NodeBinding. See [GC-210 §018](210-binding-contract.md#gc-210-018),
constitution 11.47 item 10.

**Implemented:** documentation only; classes planned for S01, not implemented.

**Remaining:** S01 proves all browser paths (JS authoring, sourceBagFromTytx,
bindBuilder, insertion, remoteSource) yield the Gramlot classes, no prototype
mutation or Builder/Bag change, and measures Bag.fromTytx null-attribute loss (any
solution after owner approval). S04/S08 wait for no external release. Both nested
tests stay out of CI until silent PUT and symbolic ?attr exist (S01). S01 needs its
own owner authorization.

<a id="gc-070-500"></a>
## 500 · Live renderer reuses Builder by inheritance — 2026-09-25

Block ID: **GC-070-500**.

**Decided:** owner, 2026-09-25: reuse Builder by inheritance. `GramlotRenderer
extends RendererBase` → `GramlotHtmlRenderer extends HtmlRenderer`; new
`GramlotSvgRenderer extends SvgRenderer` for SvgBuilder nodes, delegating
`renderedItem`. Inherited `adaptAttrs` brings legacy style shortcuts into 0.2.0;
Gramlot adds `_meta` removal, null style drop, `data_`/`aria_`/`xmlns_` names, legacy
`noConvertStyle`. No `format`/`mask`/`places` in the live renderer. Phase S03bis
between S03 and S04. See [GC-210 §030](210-binding-contract.md#gc-210-030),
constitution 11.47 item 11.

**Implemented:** documentation only.

**Remaining:** S03bis needs owner authorization, after S03. Python `renderer_html`
and `data_role` stay in the static-site analysis.

<a id="gc-070-505"></a>
## 505 · Binding example family phase — 2026-09-26

Block ID: **GC-070-505**.

**Decided:** owner, 2026-09-26: `html_svg` stays native, only `css` → `css_requires`
in S15 (examples 10/13 unchanged). New S14bis between S14 and S15: binding family with
some `html_svg` examples rewritten plus examples for 0.2.0 features. Names: generic
`div` in `pane`; `html_main` in `main_content`; never `page` for an element. P7
confirmed (`css_requires`/`js_requires`). See [GC-210 §060](210-binding-contract.md#gc-210-060).

**Implemented:** documentation only.

**Remaining:** family name to confirm; S14bis needs owner authorization, after S14.

<a id="gc-070-510"></a>
## 510 · S00 accepted; Python renderers and example families — 2026-09-26

Block ID: **GC-070-510**.

**Accepted:** owner accepted S00 on 2026-09-26 (11.47, GC-210, GC-005 IDs, historical
notes, §§065–080 inventories). Nested regressions stay out of CI until S01.

**Decided:** owner, 2026-09-26: Python/JS asymmetries are errors; Python may render
static HTML/SVG; S03bis adds Python `GramlotHtmlRenderer`/`GramlotSvgRenderer`, same
naming rule, `_text` as text, doctype/`<html>` option, symmetry test (11.47 item 11).
S14bis: `examples/binding` and `examples/controllers` ([GC-210 §060](210-binding-contract.md#gc-210-060)).
PORT-0001 records the resolved backref correction.

**Implemented:** documentation only.

**Remaining:** S01 brief and authorization; S03bis settles JS string rendering with
Gramlot adaptAttrs.

<a id="gc-070-515"></a>
## 515 · S01 feasibility gate: Gramlot Source classes and dependency hooks — 2026-09-26

Block ID: **GC-070-515**.

**Implemented:** `js/src/builder/source.js`: `GramlotBuilderBag` (nodeClass) and
`GramlotBuilderBagNode` with silent PUT, FIRE_AFTER returning a cancel function,
absDatapath with variable datapath (empty gives null) and symbolic ?attr. SET, GET,
set/getRelativeData and FIRE stay Builder's. Empty Python counterparts in
`src/gramlot/page/source.py`. Nested regressions pass through the Gramlot classes,
assertions unchanged, enrolled in npm test/CI. New source-extension-contract test;
bag-contract and test_python_builder extended. No Builder/Bag/prototype change.

**Verified:** before Python 18/18, JS 76/76, expanded 81 with 4 known failures; after
Python 24/24, JS 102/102, runner 8/8. Probe facts: identity as Map key after
insertion/references; legacy data(path, value) silently yields HTML5 data (Python
drops the value, JS spreads the string); value attribute Bag/scalar/array roundtrip
in four directions, null not authored; fromTytx drops null attributes (both);
doTrigger=false silent but autocreated intermediates emit ins/autocreate; fired emits
only on change then resets; setAttr/?attr stringify reason; main mount keeps identity
and main-prefixed paths; runtimeValues/pointers/static-only _resolveLogicFunc as
recorded; RendererBase.render throws on unknown `${name}` in scripts and on relative
pointers without datapath. No other Data subscriber.

**Stopped at the gate:** Builder hardcodes SourceBag for the JS root/promotion and
Python root; TYTX matches exact constructors and SOURCE belongs to SourceBag, so no
path yields Gramlot classes without a new decision. FIRE mark needs the node→runtime
reach left open by GC-087 §085. Relative variable datapath has no defined resolution
(legacy recurses); explicit error.

**Accepted:** not yet. **Remaining:** owner decisions; S02/S03 need authorization.


<a id="gc-070-520"></a>
## 520 · S01 proof 11 debt: library alignment and Gramlot Source subtype — 2026-09-28

Block ID: **GC-070-520**.

**Decided:** owner, 2026-09-28: S01 closed without proof 11 (debt); S02/S03 may start.
Wire (owner 2026-09-26): suffix stays the type, every Bag class travels as `::X`,
`__cls` on branch (row attributes) and root (payload) only when the class differs from
the inherited one, payload alone decides the root, names = real class names (`Bag`,
`SourceBag`, `GramlotBuilderBag`), `SOURCE` gone. Genro dependencies use `>=` (owner,
2026-09-28).

**Implemented:** genro-tytx 0.16.0, genro-bag 0.26.0, genro-builders 0.24.0 (`>=`);
JS Bag 0.9.0, Builder 0.2.1, TYTX 0.16.0 (`js/package.json` `>=`; `jsr.json` caret,
Deno 2.9.6 rejects `>=` in `jsr:` specifiers); exact `minimumDependencyAge` exclusions
in both forms. Python `SOURCE` registration removed. `source.py`/`source.js` add
`GramlotBuilderBag` to the TYTX subtype dictionary of `X` (read, collision check, set),
loaded by the builder modules. Proof 11 tests replace the "today" probes; proof 10
probe records literal `${...}` in data-element attributes. Bundle regenerated.

**Verified:** before (old versions) Python 24/24, JS 102/102, runner 8/8; new versions
before edits: 7 JS transport failures from `SOURCE`, two "today" probes and the proof 10
template probe record superseded behavior. After: Python 26/26, JS 106/106, runner 8/8.
A `GramlotBuilderBag` Source keeps the Gramlot classes Python ↔ JS, through
`sourceBagFromTytx`, `bindBuilder`, insertion, `remoteSource`; same wire from Python and
JS. `deno publish --dry-run` succeeds with caret import map and exact exclusions.

**Not closed:** GramlotBuilder authoring still yields `SourceBag` (Builder root in both
languages, JS scalar promotion, no documented class hook; Python branches follow the
parent class, JS promotion does not): owner decision. Runner tests import `js/src`;
`examples/node_modules` still holds old packaged Gramlot JS and libraries. Authoring
closed in [§525](#gc-070-525).

**Accepted:** not yet.

<a id="gc-070-525"></a>
## 525 · S01 proof 11 closed: the builder declares the Source class — 2026-09-28

Block ID: **GC-070-525**.

**Decided:** owner, 2026-09-28: builder declares the Source class, Source declares the
node class (legacy `domSrcFactory`). genro-builders `_source_class` (#46, PR #47);
genro-builders-js `static _sourceClass` (#5, PR #6), JS promotion follows the parent
class as in Python. Gramlot uses it by inheritance. `jsr.json` keeps the caret (Deno
rejects `>=` in `jsr:` specifiers).

**Implemented:** genro-builders 0.25.0 (`>=0.25.0`); JS Builder 0.3.0 (`js/package.json`
`>=0.3.0`, `jsr.json` `^0.3.0`). `GramlotBuilder._source_class = GramlotBuilderBag`
(Python), `static _sourceClass = GramlotBuilderBag` (JS); no Builder method rewritten;
builder modules import from `source.py`/`source.js`, not the reverse. "Authoring today"
probes become proof 11 authoring tests: `_sourceroot`, root, nested branches, scalar
promotion are Gramlot classes in both languages; wire `__cls: "GramlotBuilderBag"` on
the payload only; same wire from Python and JS. Bundle regenerated.

**Verified:** before Python 26/26, JS 106/106, runner 8/8; new versions before edits:
Python 26/26, JS 105/106 ("authoring today" probe: promotion follows the parent). After:
Python 26/26, JS 106/106, runner 8/8. `deno publish --dry-run` succeeds.

**Not closed:** `examples/node_modules` still holds old packaged Gramlot JS and libraries
([§520](#gc-070-520)).

**Accepted:** not yet.

<a id="gc-070-530"></a>
## 530 · S00bis: plan revisions 7–10 transcribed — 2026-09-28

Block ID: **GC-070-530**.

**Decided:** owner, 2026-09-28 (R03): revision 7–10 decisions enter the authoritative
documents before S06, documents only. Gate: number 11.48; revisions 9–10 rules (D4,
`==` arguments/template chain, D8, D9, Q7 in relative accessors and `PUT`, static
Python setter render, Q13) and Q9 release facts included; 11.47 items 8, 10, 11 also
superseded.

**Implemented:** documents only. Amendment 11.48 in both views; "Superseded in part
by 11.48" notes on 11.45–11.47 (text kept). GC-210 §005 hashes of plan revision 10
and the current register; §§010, 015, 018, 045, 055, 060, 075 aligned, superseded
entries historical; §045 current contract = minimal Host contract and FileHost,
level lookup historical (kajenn theory). No code, test or dependency change.

**Verified:** `prepare_docs.py`, Sphinx `-W --keep-going -n` and `check_public_docs.py`
pass before and after.

**Not closed:** S15 residues (`SOURCE`, `gramlot-minimal`, old example layout).

**Accepted:** not yet; owner approval of 11.48 pending.

<a id="gc-070-535"></a>
## 535 · S06: minimal Host contract and minimal FileHost — 2026-09-28

Block ID: **GC-070-535**.

**Decided:** unified plan rev. 10 §2 Host contract, §4.12, Q10, Q12.1, C03, D8
(owner, 2026-09-28). Gate: `html_svg` as file pages in `examples/html_svg/`
(`NN_name.py/.js/.md/.css`), no `examples/pages`/`resources` from `1b5905c`; local
branch `kajenn-resources` on `1b5905c`, not pushed; `gramlot-uvicorn` not edited here.

**Implemented:** neutral Python/JS `Host` without folder or file lookup;
`resolve_page`/`resolvePage` and `resolve_resources`/`resolveResources` raise
`PageNotFound`; `open_page(path, *, owner=None, prefix="")`/`openPage(path, {owner,
prefix})` → `Bootstrap(page_id, html, nonce)`/`{pageId, html, nonce}`, prefix once on
`/…` URLs only. Core load order: each URL once, last position; one JS URL with two
groups → `InvalidResourceName` (C03). New `server/resources.py`,
`adapters/resources.js` (`SPACES`, `InvalidResourceName`,
`parse_requires`/`parseRequires`, load order). New Python `FileHost(pages_dir)`, JS
`FileHost(pagesDir)`: file page before folder page, `*_aux` rejected, escaping paths
rejected, `Page.css` then `foo.css`, `foo_aux.js` (group null); any requires name →
`InvalidResourceName` ("requires need a Host with a resource system"). `Page` gains
`css_requires`/`js_requires`; `css` stays (Q10). Examples, runner catalogue page,
runner, standalone build and verify scripts on same-name files.

**Verified:** `tests/test_page_resources.py` (15) and `js/tests/page-resources.test.js`
(11, Python/JS cross test) pass; Python 42/42, JS 119/119, runner 8/8. Kajenn-symbol
`git grep` exits 1. Runner `/js/e03` and `/js/e06` without console errors; theme and
companion `/js/e06.css` served.

**Not closed:** `/py/e03` waits for the linked `gramlot-uvicorn` delivery (R02; it
still calls `Host(pages, …)`). Standalone export uses the JSR 0.1.2 core without
companion lookup; its build adds the same-name stylesheet to `Page.css`. Other
adapters: S14.

**Accepted:** not yet; closes after the `gramlot-uvicorn` delivery and the owner's checks.


<a id="gc-070-540"></a>
## 540 · S03: Builder's Data root, semantic lifetime and Source event intake — 2026-09-29

Block ID: **GC-070-540**.

**Decided:** plan revision 11, §2 Data, §4.3, §4.4, §5.2, P4, P17, P24, R04, R07 (owner,
2026-09-29); amendment 11.49. Gate answers: `GramlotRenderer` requires `{binding}`;
`mount()` and the options `html`/`references` removed; `ins` and a new `SourceBag`
value open one `NodeBinding` per branch node, no registrations.

**Implemented:** §4.3 construction order in `Gramlot`; `main` line removed. New
`binding/runtime.js` (`BindingRuntime`, `NodeBinding`), `binding/logic.js`
(`LogicRegistry`, root `LogicGroup` as `gramlot.logic`). `attach()` subscribes once on
Builder's wrapper (`builder.data.parent`), creates nothing. `receive` per §5.2: events
on a node under construction ignored on arrival; semantic work always, also under
freeze; structural work outside frozen branches. `remoteSource` through the target's
`NodeBinding` (P24). `dispose`: binding before renderer. R07: only
`GramlotBuilderBag`/`GramlotBuilderBagNode` accepted.

**Verified:** `js/tests/binding-lifetime.test.js` (19); renderer tests on
`new Gramlot({element, transport: false})`. Python 54 OK, JS 150/150, runner 8/8.

**Accepted:** not yet; waits for the owner's checks at the gate.

<a id="gc-070-545"></a>
## 545 · S03bis: renderers by inheritance from Builder, Python and JS — 2026-09-29

Block ID: **GC-070-545**.

**Decided:** plan §3.3 (P6), S03bis, §1 rule 10; class chain (owner, 2026-09-28); gate
decisions 2026-09-29: Builder's Python/JS string differences normalized by Gramlot
(empty SVG `<rect … />`, SVG-namespace `foreignObject` with XHTML child, null not
written, no `format`/`places` formatting, legacy `mask`), noConvertStyle via
`_handleMeta`, `html_` literal and `gramlot_` error, `_text` as text, `doctype` option.

**Implemented:** JS `GramlotHtmlRenderer extends HtmlRenderer` (string),
`GramlotRenderer extends GramlotHtmlRenderer` (DOM), `GramlotSvgRenderer extends
SvgRenderer` (owned, delegates to the live renderer); Python `GramlotHtmlRenderer`,
`GramlotSvgRenderer`; `renderer_html` in both; shared `renderer/attributes.{js,py}`;
`html.js` DOM only; hosts use `GramlotBuilder` and `render(doctype=True)`.

**Verified:** `js/tests/style-shortcuts.test.js` (6, symmetry included),
`tests/test_renderers.py` (12). Python 66 OK, JS 156/156, runner 8/8.

**Accepted:** not yet; waits for the owner's checks at the gate.

<a id="gc-070-550"></a>
## 550 · S04: Data router and projection — 2026-09-29

Block ID: **GC-070-550**.

**Decided:** plan §2 (variable/relative datapath, symbolic paths, Q7, `_path`), §3.3,
§4.4, §4.5, §4.11bis, P1, R05, R06, R14, R15, R16; gate decisions 2026-09-29: `visible`,
symbolic `#…` datapath, duplicate `node_id` error, null lookups for removed nodes,
`datapath` pointer in the parent context, Python static render out of scope.

**Implemented:** `router.js` (`DataRouter`, `DataRegistration`, `DataChange`; trie,
levels, `?attr`, R14, R15); runtime map `node_id → node`, `rebindBranch`; `NodeBinding`
registrations and `receive`; `GramlotRenderer.project`, `getDomNode`,
`getBaseSourceNode` (also on `Gramlot`); `GramlotBuilderBagNode` relative variable and
symbolic datapath, Q7, `_path`; `GramlotBuilder.nodeById` on the map.

**Verified:** `binding-router.test.js` (13), `binding-projection.test.js` (26).
Python 66 OK, JS 195/195, runner 8/8.

**Accepted:** not yet; waits for the owner's checks at the gate.

<a id="gc-070-555"></a>
## 555 · S05: installation of `dataSetter` and defaults — 2026-09-29

Block ID: **GC-070-555**.

**Decided:** plan §2 (A2, R1, R17, D1a, `attr_*`, literal `dataSetter`, Q7), P2, P3, P5,
P8, P15, P25, §4.6, §5.1 steps 2-4; gate decisions 2026-09-29: attributes replaced only
when the setter declares some, `dataSetter` inside `svg` an error, defaults after all
setters, `default_value` before `default`, `attr_*` after the node's defaults, error
closes the new NodeBindings without rollback, stamp `installed`, only a Bag payload leaves
the Source node; `dtype` conversion of defaults out of scope.

**Implemented:** `installation.js` (`DataInstaller`); installer run by
`handleSourceEvent` for `ins` and a new branch value, after the `node_id` map, before the
registrations; `NodeBinding.hasStamp`/`stamp`;
`GramlotBuilderBagNode.pathAttribute` (`_path` warning for a pointer `destination_path`).

**Verified:** `data-installation.test.js` (22), `binding-defaults.test.js` (15), fixtures
in `test_binding_authoring.py` and `transport-interop.test.js`. Python 67 OK, JS 233/233,
runner 8/8.

**Accepted:** not yet; waits for the owner's checks at the gate.

## 560 · S07: browser bootstrap and named logic — 2026-09-29

Block ID: **GC-070-560**.

**Decided:** plan P20, P21, §4.3, §4.9, §4.12, Q12.2, D8, D9, C02; gate decisions
2026-09-29: same compact bootstrap JSON in both hosts, page closed during the imports →
no `Gramlot` and a close beacon, failed import or Logic check → rejection naming the
resource with CSS kept and page closed, `resolve` → `{group, method}`, accessors, symbol
keys, `extends` and groups `page`/`constructor` refused, CSP as a static check (browser
CSP in S14), `inline.js` graph test in S09.

**Implemented:** `bootstrap.js` (`PageBootstrap`), exported by `index.js`;
`LogicRegistry.check`/`register`/`resolve` in `logic.js`; both hosts write
`await new PageBootstrap({config, resources}).run()` and no `<link>`s, prefix once on
root-relative CSS and JS URLs.

**Verified:** `named-logic.test.js` (10), `bootstrap.test.js` (9, real imports, Python
Source resolved through the real bootstrap), fixtures in `js/tests/fixtures/logic/`,
host bootstrap tests updated. Python 68 OK, JS 254/254, runner 8/8.

**Accepted:** not yet; waits for the owner's checks at the gate.

## 565 · S08: providers and timers — 2026-09-29

Block ID: **GC-070-565**.

**Decided:** plan P12, P20, P22, D7, B7, §4.7, §4.8, §5.1, Q2, Q8, Q9, R13, R15; gate
decisions 2026-09-29: `_onBuilt` after the branch build (thaw under freeze), `_onStart`
at page start or after `_onBuilt`, `FIRE` fires on an equal value, null → `true`, reset
in a `finally`; `_userChanges` filters Data triggers only; provider attributes elsewhere
are an installation error; null `result_path` raises; inline bodies raise until S09;
`genro-bag>=0.27.0`.

**Implemented:** `providers.js` (`Provider`, `FormulaProvider`, `ControllerProvider`);
provider creation and rebinding in `NodeBinding`; `_init`, `branchBuilt`, `pageStarted`
in `BindingRuntime`; `GramlotBuilderBagNode.FIRE` (also on `?attr`, as legacy `fireEvent`) and tracked
`FIRE_AFTER`; the renderer
skips nodes of queued Source events (P4).

**Verified:** `binding-writes.test.js` (13), `binding-providers.test.js` (26, with P5, P4
and the Python Source through the real bootstrap), `binding-timing.test.js` (12, virtual
clock). Python 68 OK, JS 305/305, runner 8/8.

**Accepted:** not yet; waits for the owner's checks at the gate.

## 570 · S09: inline in the page only, and the macro preprocessor — 2026-09-29

Block ID: **GC-070-570**.

**Decided:** plan §2, §4.10, Q11.1, Q11.2, D5, D6; gate decisions 2026-09-29: only
`inline.js` is exempted from the CSP scan; named-logic pages never compile; `inline.js`
unreachable from `adapters/*` and `builder/gramlot-builder.js`; parameters `_kwargs`,
`_node`, `_triggerpars`, `_reason`, then identifier attributes; `PUBLISH` raises; `_if`
with `func` raises at authoring; `==` in renderer `_handleMeta` (attributes and node
value), string renderers write no `==`; `==` on providers raises; template chains raise.

**Implemented:** `inline.js` (`InlineCompiler`: `preprocess`, `compile`,
`compileExpression`, `release`); `_if`/`_else` and inline bodies in `Provider.invoke`;
`evaluateExpressions`/`expressionValue` in the Python and JS renderers.

**Verified:** `binding-inline.test.js` (26); CSP scan and named-logic probe in
`bootstrap.test.js`; Python authoring cases. Python 69 OK, JS 332/332, runner 8/8.

**Accepted:** not yet; waits for the owner's checks at the gate.

## 575 · S10: native editing — 2026-09-29

Block ID: **GC-070-575**.

**Decided:** P1, §4.11, Q5 matrix, `live`, C04.1, D7; gate decisions 2026-09-29: text-like
input types are text; `hidden`/`file` have no adapter, `checkbox`/`radio` are S11, buttons
S12; invalid `number` draft keeps the Data, empty → null; `live` → `input` for text,
`textarea`, `number`, `range`, else `change`; IME waits for `compositionend`; literal and
`=` values write nothing; synchronous origin flag, typed equality; `html.js` never writes a
control's `value`; first projection after `compose`, `select` re-projected when options
change; `type`/`multiple`/`group` rebuild, also from Data, at thaw under freeze.

**Implemented:** `view/controls.js` (`ControlAdapter` and six subclasses); adapter attach,
detach, projection and rebuild in `GramlotRenderer`; `HtmlElement.update` skips a
control's `value`.

**Verified:** `native-controls.test.js` (21); `verify_binding_browser.mjs` passes Chromium
153 and WebKit 26.6; Firefox 155 does not start on macOS 27.0, not verified. Python 69 OK,
JS 353/353, runner 8/8.

**Accepted:** not yet; waits for the owner's checks at the gate.

## 580 · S11: checkbox and radio — 2026-09-29

Block ID: **GC-070-580**.

**Decided:** D4, P11, C04.2; gate decisions 2026-09-29: group scope = nearest Source form
(`formId`/`form=true`) or the page; generated `name` = renderer instance id + form + group,
written at attach, removed at detach; authored `name` with `group` raises; no `name` in
string renders; radio without `group` is standalone; literal and `=` values write nothing;
truthiness for non-boolean Data, null off, only `true`/`false` written on `change`;
`checked` with a `^` value raises; several `true` at mount raise; `false` only to `^` peers,
through the anti-echo guard.

**Implemented:** `CheckboxControl`, `RadioControl` (extends `CheckboxControl`),
`RadioGroups` in `view/controls.js`; `GramlotRenderer.instanceId` and `radioGroups`. Choice:
`true` on the button, then `false` on bound peers that are on, in join order (legacy dijit); a Data
`true` after the first projection runs the same loop.

**Verified:** `boolean-controls.test.js` (18); `native-controls.test.js` updated;
`verify_binding_browser.mjs` S11 cases pass Chromium 153 and WebKit 26.6; Firefox run by the
owner. Python 69 OK, JS 371/371, runner 8/8.

**Accepted:** not yet; waits for the owner's checks at the gate.

## 585 · S12: button and events — 2026-09-29

Block ID: **GC-070-585**.

**Decided:** B7, P9, P10, R3 provisional, R11, R12; gate decisions 2026-09-29: `ButtonBinding`
only for `<button>`; `type="button"` only with a mechanism, also when it appears later, author
`type` stays; one direct `dataController` child, several or two mechanisms raise at mount or
Source change; `fire` = `eventToString` string or `true`, `modifier`/`_counter` on the Data
node; `fire_<name>` fires `'<name>'`; controller gets `_evt`, `button_counter`, `button_*`
(not author arguments); `action` inline, `this` = button, `event`/`_counter`/`modifiers`;
`connect_on<event>` lower-cased, dotted `group.method` named, else inline; disabled does
nothing; mechanism before `connect_onclick`; `stopPropagation` only with a mechanism.

**Implemented:** `view/button.js` `ButtonBinding`, `view/events.js` `NativeEventBinding`,
created in `renderedItem`, detached through `record.cleanup`, followed in `project`;
`NodeBinding.clickCount`/`countClick`; click arguments in `Provider.readArguments`;
`FIRE(path, value, attributes)`; `fire` wins over `fire_*` (legacy).

**Verified:** `button-controller.test.js` (19), `native-events.test.js` (11), R08 expects
`type="button"`; `verify_binding_browser.mjs` R3 cases pass Chromium 153 and WebKit 26.6.
Python 69 OK, JS 401/401, runner 8/8.

**Accepted:** not yet; the owner confirms or revises R3.

## 590 · S13: integrated lifecycle — 2026-09-29

Block ID: **GC-070-590**.

**Decided:** P3, P4, R12, §5.1, §5.4; gate 2026-09-29: defects found by the new tests are fixed
in the binding modules and recorded; Chromium and WebKit by the executor, Firefox in S16; open
questions follow legacy, else the source plan, and go to the review after 0.2.0.

**Implemented:** five fixes: `ControlAdapter` of a closed node writes nothing (R12), a radio
removed by its own write turns no peer off, a `fire_*` that removes its button stops the rest;
`BindingRuntime.dispose` clears the `node_id` map; `handleSourceEvent` returns the closing
errors and `receive` removes the DOM before throwing them (also `clear()` and replacement); a
failed first render removes the records its children made.

**Verified:** `binding-integration.test.js` (traces of mount, rebuild, replacement, removal and
insertion under freeze, nested freeze, dispose; R12; self-removing callbacks) and
`binding-cleanup.test.js` (expired `remoteSource`, errors in validation, installation, first
render, provider, cleanup; 100 cycles back to baseline), fixture `tests/fixtures/lifecycle.js`;
`verify_binding_browser.mjs` R12 passes Chromium 153 and WebKit 26.6. Python 69 OK, JS
422/422, runner 8/8.

**Accepted:** not yet; the phase waits for the owner's checks at the gate.

<a id="gc-070-595"></a>
## 595 · S14: adapters on the minimal contract, strict CSP — 2026-09-29

Block ID: **GC-070-595**.

**Decided:** Q3, Q4; gate 2026-09-29: gramlot-uvicorn, gramlot-js-server, gramlot-serverless
verified in 0.2.0, each in its own chat and repository with the owner's authorization there,
locally with this branch's core linked, no push before core 0.2.0; gramlot-django, -fastapi,
-flask, -kajenn deferred to after 0.2.0; acceptance page `js/tests/fixtures/logic/avvio.py`/
`avvio.js` + `avvio_aux.js`, plus `examples/html_svg/03_lists` for `Page.css`; adapter
repositories not edited from here.

**Implemented:** Q3: a browser `EvalError` from `new Function` (CSP without `'unsafe-eval'`)
becomes an `InlineCompiler` `EvalError` naming node and attribute, pointing to named logic in
`_aux.js` or the permissive CSP profile, browser error as `cause`; every inline declaration.

**Verified:** `binding-inline.test.js` Q3 test under `node --disallow-code-generation-from-strings`
(named logic computes; `script`, `formula`, `==`, `action`, `connect_onclick` raise Q3, nothing
written); `verify_binding_browser.mjs` strict-CSP `file://` shell (meta `script-src 'nonce-…'`,
no `'unsafe-eval'`): script without nonce blocked, named logic on real typing, inline `script`
and `action` raise Q3, `script-src eval` violation; Chromium 153 and WebKit 26.6 PASS, Firefox
from the owner's Terminal or S16. Python 69 OK, JS 423/423, runner 8/8.

| Adapter | Status | Reason or report |
|---|---|---|
| gramlot-uvicorn | verified | report 2026-09-30: `s06-filehost` `08a6029`+`abdf54b` unpushed; 5 tests; serves only `.css`/`_aux.js` inside the pages folder (`FileHost.url` rule), rest 404; `content_security_policy` with `{nonce}`, HTML only; `avvio` and `03_lists` started with `/py`, strict and permissive, Playwright Chromium; `git grep` exit 1; after the runtime regeneration of 2026-09-30, strict `/py/inline` fails with the Q3 `EvalError` naming node and attribute (Chromium 153) |
| gramlot-js-server | verified | report 2026-09-30: `develop` `941e60f` (rename)+`ed38743`+`e5d21c8`+`1214ac0` (Phase 18: 404 on `SourceNotFound`) unpushed; peer dependency, core linked `--no-save`, one instance, runner 500 gone; `FileHost` default, `mountPath` prefix, `contentSecurityPolicy` with `{nonce}`; `.css`/`_aux.js` inside the pages folder, rest 404, other methods 405; Node 7/7, Bun 5/5; `avvio` started with `/app` strict and permissive, inline fails under strict with the core error; runner `/js/e03`, `/js/index` started on Node; `git grep` exit 1 |
| gramlot-serverless | verified | report 2026-09-30: `develop` `2451143`+`5d5a65e`+`b79a80d` unpushed; gramlot >=0.2.0, builders >=0.4.0, node >=22, core `cb46c20` linked; 19/19; `resolveResources`, window-only `_aux` bundle, `PageBootstrap` subclass; Worker sentinel 0, window 1 (Chromium, WebKit); no `inline.js` in the WorkerHost bundle; hash CSP on final bytes, altered copy blocked; `http_equiv` meta defect fixed; `git grep` exit 1; Firefox in S16 |
| gramlot-django | blocked | deferred by the owner to after 0.2.0; excluded from S16 |
| gramlot-fastapi | blocked | deferred by the owner to after 0.2.0; excluded from S16 |
| gramlot-flask | blocked | deferred by the owner to after 0.2.0; excluded from S16 |
| gramlot-kajenn | blocked | deferred by the owner to after 0.2.0; excluded from S16 |

**Accepted:** by the owner on 2026-09-30: the three delivery chats reported, their rows are
filled, S14 is closed.

<a id="gc-070-600"></a>
## 600 · S14bis: example families `binding` and `controllers` — 2026-09-30

Block ID: **GC-070-600**.

**Decided:** §7 S14bis; owner 2026-09-26 (families, `html_svg` unchanged); gate 2026-09-30:
binding versions of `html_svg` 06, 08, 12 are new pages; Python first with JS equivalent;
naming conventions; D11 (only what the minimal `FileHost` serves).

**Implemented:** `examples/binding/` (11 pages: pointers, variable datapath, setters and
defaults, editing and `live`, checkbox/radio, style/visibility shortcuts, bound SVG, freeze,
bound 06/08/12) and `examples/controllers/` (9 pages: formula, controller and timing, named
logic in `NN_name_aux.js`, `==` and inline, node methods, button controller and `fire`,
`connect_on<event>`, `remoteSource`, §8.1 story). Catalog of three families read by both runner
pages, launcher and behaviour; companions staged and shown; standalone export `html_svg` only.

**Verified:** `examples/00-runner/tests/examples.test.js` (every JS page mounted in JSDOM on its
host path, README behaviour) and `runner.test.js`; runner 30/30. `verify_examples_browser.mjs`
extended: every example on `/py` and `/js` in Chromium 153 with DOM parity and in the runner
iframe, no page or console errors. Its pre-existing `html_svg` 06 Reset check fails since S10,
not run (phase notes).

**Accepted:** not yet; the phase waits for the owner's checks at the gate.

<a id="gc-070-605"></a>
## 605 · S15: documentation and leftovers — 2026-09-30

Block ID: **GC-070-605**.

**Decided:** plan §7 S15; gate 2026-09-30: no new public guide (`prepare_docs.py`
unchanged); 0.2.0 content in GC-095 and GC-090; `html_data` for the HTML5 element, `data(...)`
forbidden; current text replaces `gramlot-minimal` with `gramlot-uvicorn` and `gramlot-serverless`,
dated blocks keep it; historical blocks annotated, not rewritten; `_grammar_load.py`,
`_collection.py`, `html5.json` stay (genropy/genro-builders#51 open).

**Implemented:** GC-095 (status, examples by route, `html_data`, type matrix and `live`, R3 as
accepted plus one-field form effect, `fire` with `fire_*`, `connect_on<event>`, cleanup and
closing errors, differences from legacy, migration from 0.1.x). GC-090 (status, `PageBootstrap`
`{config, resources}`, mount prefix, companion rule, CSP profiles in new §035, export shape of
`gramlot-serverless`, package names in new §040 (removed at the gate check, S17), adapters verified and deferred). GC-020, 025,
030, 100 aligned. Leftovers: `gramlot-minimal` in constitution §7/§14, 11.19, 11.37, GC-140,
085, 086, 087, 175, overview, GC-025; old example layout in constitution 11.22, GC-145, 150,
140, 065 §030, GC-210 §060; GC-045 §055 (Python has the counterpart classes) and GC-085
versions; `SOURCE` annotations in GC-070 §315, GC-088, 089, 125, PORT-0003, PORT-0004 and
amendment 11.16.

**Verified:** `prepare_docs`, `sphinx -W`, `check_public_docs` pass; `git grep -iE
'gramlot[-_/]minimal'` in `docs`/`docs_llm` finds only dated blocks and explicit "retired"
statements. Python 69 OK, JS 424/424, runner 31/31. No code changed.

**Accepted:** not yet; waits for the owner's checks at the gate.

<a id="gc-070-610"></a>
## 610 · S15bis: corrections from the review before qualification — 2026-09-30

Block ID: **GC-070-610**.

**Decided:** owner 2026-09-30, reviews of `5035228`: one correction per finding (ASTRA-01..07,
Fable R1+R6, R3, R4 a/b, R5, M3), each with a regression test failing before the fix, Python and
JS where the rule exists in both; rules in [GC-210 §090](210-binding-contract.md#gc-210-090).

**Implemented:** terminating `Logic` constructor scan; resolved projection for `type`,
`multiple`, `group`, `live`, `visible`; installation rules at validation, failed `main` leaves
the Source, clear error for a node without NodeBinding; whole-entry collection replacement in
Python; radios follow the form owner, closed peers ignored; failed first projection cleaned up;
typed `_text`; `FIRE_AFTER` path check at the call; JS `SourceNotFound` and null `params`;
lifecycle values; one definition per language of namespaces and segment rule. GC-090, 095,
100 updated.

**Verified:** Python 72 OK, JS 441/441, runner 31/31; JS build; `verify_binding_browser.mjs`
PASS on Chromium 153 and WebKit 26.6; `prepare_docs`, `sphinx -W`, `check_public_docs` pass.
Open elsewhere: `gramlot-js-server` does not map `SourceNotFound` to 404.

**Accepted:** not yet; waits for the owner's checks at the gate.

<a id="gc-070-615"></a>
## 615 · S16: qualification — 2026-09-30

Block ID: **GC-070-615**.

**Decided:** gate 2026-09-30: report GC-215 (form of GC-130 §025); rows A01-A18, full suites,
Chromium/WebKit, §8.1 story through the real bootstrap, C07 check, two-fixture counters, hosts;
clean environments from this branch's artifacts; Firefox by the owner; defects recorded only.

**Implemented:** enrolled tests `qualification-story`, `qualification-counters`,
`runtime-bundle` (C07) in `js/tests/`; lifecycle fixture exports its trackers; report
[GC-215](215-qualification-0-2-0.md).

**Verified:** GC-215 §015: Python 72, JS 451/451, examples 31/31 in checkout and clean
environments; Chromium 153 and WebKit 26.6 rows pass; uvicorn 5, js-server Node 7 and Bun 5.
Blocked: gramlot-serverless 17/19 (error text changed in S15bis), story on the standalone
(strict only). C07 found a stale bundle at start; rebuilt.

**Accepted:** qualification complete (Firefox passed, R20 fixed `b79a80d`, waivers R22/R24/L1); release acceptance is S17.

<a id="gc-070-620"></a>
## 620 · S17: owner acceptance of Gramlot 0.2.0 — 2026-09-30

Block ID: **GC-070-620**.

**Accepted:** owner, 2026-09-30 ("si accetto", chat `wf:gramlot-0-2-0-binding`, `ac5c08f`, after GC-215). Not an authorization of version change, pushes or publication (each separate). D3 package names deferred after 0.2.0; `/quality-check` skipped (two whole-code reviews plus verifier on Phases 18-19). Status: implemented, accepted, version 0.2.0 authorized and packaged locally (C07 re-check); published 2026-09-30: `v0.2.0`, GitHub release, PyPI 0.2.0, JSR 0.2.0 (GC-215 §045).

<a id="gc-070-625"></a>
## 625 · Adapters pushed with their own CI after 0.2.0 — 2026-10-01

Block ID: **GC-070-625**.

Owner, 2026-10-01: each adapter carries its own CI, coverage, docs build and standard files (brief for the three verified adapters). Verified on the remotes: gramlot-uvicorn `580bb40` (CI success: published core on 3.11/3.12, core main, docs; `gramlot>=0.2.0`; Codecov 81%; RTD to import); gramlot-js-server `8c30641` (CI success: core main Node 22 and Bun, docs; no published-core job while `@gramlot/native-html` is unpublished, D3; RTD imported); gramlot-serverless `a70fe59` (CI success: published core 0.2.0 from JSR, core main with sentinel, docs; RTD to import). Core CI on main passed with the new adapter main branches; the core has the same standard since `7cfc51a`. Open: shared `GS` namespace of uvicorn/serverless; D3.

<a id="gc-070-630"></a>
## 630 · User documentation of the adapters — 2026-10-01

Block ID: **GC-070-630**.

Owner, 2026-10-01: adapter docs for readers new to Gramlot; Gramlot and the repository table once in core GC-055 (`d96ebf7`), linked by the adapters. Verified: gramlot-uvicorn `9723fa2` (GS-105…140, `tests/test_examples.py`), gramlot-js-server `2742ead` (files 005…040, GN-105…140, `test/quickstart.test.mjs` Node/Bun), gramlot-serverless `fc06286` (GS-105…140, `tests/quickstart.test.js` + Chromium script); CI green, Read the Docs published, internal notes in `docs/internal/`. Core CI on main green after the pushes. Open: guide file numbering differs across repositories; shared `GS` namespace; D3.

<a id="gc-070-635"></a>
## 635 · Package names and registries, release 0.2.1 — 2026-10-01

Block ID: **GC-070-635**.

Owner, 2026-10-01: JS packages on npm and JSR; same package name on both, only scope differs; genro modules on npm under `genrojs`. D3 closed with `@gramlot/gramlot`. core npm+JSR `@gramlot/gramlot` 0.2.1 (`@genro/gramlot` archived); bag `@genrojs/bag` / `@genro/bag` 0.10.1; builders `@genrojs/builders` / `@genro/builders` 0.4.1; tytx `@genrojs/tytx` / `@genro/tytx` 0.16.1. Source imports npm names, `jsr.json` maps to `jsr:@genro/*` (one copy per registry). genro modules moved to `genro-org`. gramlot-js-server peer `@gramlot/gramlot >=0.2.1` (`11e5db2`). `publish.yml`: tag → PyPI, npm, JSR. Open: gramlot-serverless still imports `@jsr/genro__gramlot` until its rename after the core's npm publication.

<a id="gc-070-640"></a>
## 640 · The standalone exporter joins gramlot-js-server — 2026-10-01

Block ID: **GC-070-640**.

Owner, 2026-10-01: gramlot-serverless joins gramlot-js-server ("va bene js server in effetti il worker è uj server"); names "server" and "browser", no `native` prefix ("accetto il tuo suggerimento"). Amendment 11.50. Workspace: `server/` `@gramlot/gramlot-js-server` (`/node`, `/bun`, `startServer`), `browser/` `@gramlot/gramlot-browser` (command `gramlot-browser`); commits `05efadd` (subtree), `9cbbd11`, `b3a6e6e`, `d706973`, `c0ca2bd`. Core `18880bb`, `0569d4d`: runner, Worker check and CI use one checkout. Verified 2026-10-01: clean clone with core 0.2.1 from npm (server 6/6 Node and Bun, browser 20/20, three Chromium checks), linked core `main` (sentinel, server browser harness Node/Bun), core Python OK, JS 451/451, runner 31/31, runner pages 200. §635 open item closed (`8ed1fc3`). Registries (owner, 2026-10-01, "ok"): the two packages on npm only; a JSR install maps the core to `@jsr/gramlot__gramlot` behind the alias `@gramlot/gramlot`, so a JSR adapter would bring a second core copy, and the browser package resolves the core by name. The core stays on npm and JSR. Open: npm publication of the two packages; archive of `gramlot-serverless` and its Read the Docs.

<a id="gc-070-645"></a>
## 645 · The native label is removed — 2026-10-02

Block ID: **GC-070-645**.

Owner, 2026-10-02: "native HTML" "è completamente fuorviante"; it named only the 0.1.0 scope (no web components, no recipes). Rule [GC-005 §030](../005-documentation-policy.md#gc-005-030), constitution 11.51. Code/tests/scripts `cdc33d9` (`source-contract.test.js`, `test_source_host.py`, `verify_page_browser.mjs`, fixture titles, docstring); file names `cefa532` (`088-0-1-0-plan`, `089-0-1-0-handoff`, `110-0-1-0-readiness`, `PORT-0001-0-1-0`, `PORT-0004-0-1-0-delivery`; IDs/anchors unchanged); current documents `7757c1d`; naming notes `022acff`. Verified 2026-10-02: Python 72 OK, JS 451/451, runner 31/31 and on port 8091, page and Worker browser checks PASS in Chromium, Sphinx `-W`, public docs check. Outside: Python adapters until gramlot-py-server; core `examples/` and gramlot-examples with the move of the examples; gramlot-site.

**Open:** gramlot-js-server documents (GN-010, GS-020); core publication.


<a id="gc-070-650"></a>
## 650 · Rich graphic identity kit — 2026-10-02

Block ID: **GC-070-650**.

**Authorized:** owner requested a rich, complete graphic folder after the audit of
missing vector/transparent/monochrome/favicon assets; exact words in
[GC-015](../015-visual-identity.md#gc-015-005) and `assets/branding/source/README.md`.
Preserve September symbol, blue/yellow, lowercase outlined Arial Rounded lettering
and approved tokens. No architecture amendment or runtime theme change.

**Implemented:** `assets/branding/` kit (ZIP generated by `source/build_assets.py`, not committed): single vector master;
four artwork forms × six variants; transparent PNGs; browser/device/maskable icons;
palettes; five light/dark social formats; wallpapers and presentation backgrounds;
catalogue, four-page PDF guide, rebuild script, manifest; originals in git history (`234c6d8`).
Root white/navy assets now use vector geometry. Reconstructed symbol; original
lettering paths unchanged.

**Verified:** SVG self-containment, PNG dimensions/alpha/bounds, exact shared variant
geometry, maskable safe circles, five ICO frames; reference silhouette IoU 98.956%.
Local links, hashes, ZIP integrity/content, paired anchors and PDF pages pass.
PDF renders and 1440px desktop/390px mobile catalogue reviewed: no missing images,
overflow or script errors. Strict Sphinx/public-documentation checker pass (8 pages).

**Accepted:** creation authorized; reconstructed artwork and new layouts await owner
visual acceptance. Tiny icons need target-specific checks; press work needs a printer
profile/proof. Kit delivered; no publication, consolidation or runtime theme implied.


<a id="gc-070-655"></a>
## 655 · Serverless name and packaged theme and logo, release 0.2.2 — 2026-10-02

Block ID: **GC-070-655**.

Owner, 2026-10-02: `@gramlot/gramlot-browser` → `@gramlot/gramlot-serverless` ("gramlot-serverless forse è il piu semplice"), ahead of gramlot-py-server, "così chiudiamo tutta la parte js"; core 0.2.2 carries theme and logo in every package. Constitution 11.52. gramlot-js-server 0.2.2: rename `ca0e102`, release `0965fff`, tag `v0.2.2`; both packages published by hand from the tag after the npm job failed (`EALLOWGIT`: npm 12 reads `dist/NAME.tgz` as a GitHub shorthand), fix `ca60072`; `@gramlot/gramlot-browser` deprecated, then unpublished. Core: runner/scripts/CI and the same fix (gramlot-org/gramlot#7, `4e0eefc`, merge `1db63c5`); theme and logo in npm, PyPI, JSR (`b9ada8d`: `themes/`, four stable entry points and `svg/` of `assets/branding/`; JSR without the rest of the kit; paths [GC-090 §023](../public/090-classes-and-hosts.md#gc-090-023)); documents `e51989c`. Verified 2026-10-02: Python 72 OK, JS 451/451, runner 31/31 and on port 8091, Worker browser check PASS in Chromium; npm pack, wheel (`importlib.resources`) and JSR dry run carry the same 30 files; Sphinx `-W`, public docs check.

**Open:** gramlot-examples `apps/hello-world` still depends on `@gramlot/gramlot-browser`, no longer on npm.

<a id="gc-070-660"></a>
## 660 · Inline code activated by the received Source — 2026-10-03

Block ID: **GC-070-660**.

Owner, 2026-10-03: inline stays everywhere, also serverless ("credo sia necessario accettare unsafe e fare il possibile per prevenire"); activation in one place, the reception of the Source, in the Gramlot Source classes; no new wire type. Approved during the work: test migration (A.3), refusal of `on*` and `javascript:`, `connect-src *` in the single file "until the CSP grammar arrives". Constitution 11.53. Core `feat/inline-code-activation`: `0cb54f1` activation in `Gramlot.prepareSource` (`GramlotBuilderBagNode.activateCode`; `InlineCompiler` compiles only the activated text), pointer in a code attribute refused at reception, `on*`/`javascript:` refused by the JS renderers, live-Source tests mount a separate Source (`js/tests/fixtures/mount.js`); `c9584ab` same attribute rule in the Python renderers, contract test of a Python Source with inline; `06637d9` documents and 11.53; `f2eb977` the pages of `verify_binding_browser.mjs` mount a received Source. Rules: [GC-090 §035](../public/090-classes-and-hosts.md#gc-090-035), [GC-095 §065](../public/095-writing-pages.md#gc-095-065). gramlot-js-server `feat/serverless-inline-code`: `312d4fc` single-file CSP with `'unsafe-eval'` and `connect-src *`, example `serverless/examples/inline-code`, `verify_inline_browser.mjs` in both CI jobs; `902c5e3` its guides. Verified 2026-10-03: Python 76 OK, JS 461/461, examples 31/31; runner on 8091 with the new core in both integrations (`c01`, `c02`, `c04`, `c06`, `c07`, `c09`), no errors; js-server with the new core in a temporary worktree: server 6/6, serverless 20/20, Chromium checks PASS; `verify_binding_browser.mjs` PASS in Chromium, strict CSP included.

**Open:** the `serverless` directory export sets no CSP. Closed: `iframe` `srcdoc` from Data (665); released as 0.2.3 (gramlot-org/gramlot#9).

<a id="gc-070-665"></a>
## 665 · An iframe srcdoc from Data is sandboxed — 2026-10-03

Block ID: **GC-070-665**.

Owner, 2026-10-03 ("ok"): `iframe` `srcdoc` from Data → `sandbox=""` (all restrictions); author's `sandbox` kept; literal `srcdoc` none. Rejected: literal-only `srcdoc` (no preview), DOMPurify (runtime dependency, rules to maintain). Approved during the work ("vai"): declaration decides, not the value; live element writes `sandbox` first; pointer node value counts as Data (Builder applies its datum's `_wdg` over a literal `srcdoc`); examples 10 and 13 → `connect_onclick` (recorded in 11.54), their browser checks join the CI. Constitution 11.54. Core `feat/srcdoc-sandbox`: `f6876cc` `withDataSrcdocSandbox`/`with_data_srcdoc_sandbox` in both `_handleMeta`, `HtmlElement.update` writes `sandbox` first; `103ca15` tests (same Sources Python/JS, `SrcdocSandboxTests`, `js/tests/srcdoc-sandbox.test.js`, four iframes in `verify_binding_browser.mjs`); `ae04748` example 13 → `connect_onclick` (its `onclick` stopped the page since 0.2.3), `c4dbbfc` the same for example 10; `0b14e33` documents and 11.54; `f9cdb31` core CI: Playwright Chromium, `verify_binding_browser.mjs`, runner with Uvicorn, `verify_live_cards.mjs`, `verify_live_playground.mjs`. Rules: [GC-090 §035](../public/090-classes-and-hosts.md#gc-090-035), [GC-095 §065](../public/095-writing-pages.md#gc-095-065). Verified 2026-10-03: Python 81 OK, JS 466/466, examples 31/31; `verify_binding_browser.mjs` PASS in Chromium 153 and WebKit 26.6 (Data `srcdoc` script never runs, also after Data/Source changes; declared `allow-scripts` and literal run; fails without the rule); runner on 8093, both integrations (`e01`, `e06`, `e12`, `e13`, `b01`, `b05`, `c01`, `c04`, `c06`, `c07`, `c09`); `verify_live_cards.mjs` (`e10`) and `verify_live_playground.mjs` (`e13`) PASS on `/py` and `/js`, both failing before the fix. `5a554ea` 11.54 item 4 and this record; release 0.2.4: version in `pyproject.toml`, `js/package.json`, `jsr.json`, release notes v0.2.4.

**Open:** same `onclick` fix in gramlot-examples (own chat); new CI steps first run on the pull request.

<a id="gc-070-670"></a>
## 670 · One page module with Page and Logic; gramlot.inout — 2026-10-03

Block ID: **GC-070-670**.

Owner, 2026-10-03, brief 1 (`decisioni_gallery-scaffold`): JS page = one module exporting `Page` and `Logic`; beside a Python page the logic module is `foo.js`; `foo_aux.js` admitted; data functions in `gramlot.inout`. Approved during the work ("ok"): import map for `@gramlot/gramlot/page` (server bundle rejected: esbuild in a Python host, second core copy); both logic modules = error; core `examples/` and runner to the module form; runner serves example modules as JS; `inout` formats (`sendHttp` JSON object, email subject = page title); `gramlot.inout` = browser runtime for Python and JS pages (owner correction). Constitution 11.55. Core `feat/page-module-inout`: `3d207e0` JS `FileHost` takes the module's `Logic`, Python takes `foo.js` beside `foo.py`, else `foo_aux.js`, both = error; import map with the bootstrap nonce in `openPage`/`open_page`; runtime exports `Page`, `source`; fixture `avvio` in module form; inline CSP error names the page's class `Logic`. `a92b142` 33 core examples export `Page` and `Logic`, four `NN_name_aux.js` moved in; runner shows the module, stages a one-line `{route}_aux.js` re-exporting `Logic` from the example URL, serves example modules as JS. `c7656bf` `verify_page_module_browser.mjs` (both forms, Node and Python loopback hosts, strict CSP). `a561ff6` merge of develop (0.2.4, no conflict). `4fc0fab` `js/src/inout.js`, `js/tests/inout.test.js`. `d99de9d` `verify_inout_browser.mjs`. Rules: [GC-090 §030](../public/090-classes-and-hosts.md#gc-090-030), [GC-095 §060](../public/095-writing-pages.md#gc-095-060), [GC-095 §095](../public/095-writing-pages.md#gc-095-095). Verified 2026-10-03 (CI layout, gramlot-js-server `main`): Python 83 OK, JS 475/475, examples 31/31; Chromium 153 and WebKit 26.6: `verify_page_module_browser.mjs` PASS (fails without the import map), `verify_inout_browser.mjs` PASS (email text and 2000 limit, real POST and 500, `save`/`restore` with date and decimal via real download and file chooser, JSON/XML, inline and `Logic` calls); Chromium: `verify_page_browser.mjs`, `verify_binding_browser.mjs`, `verify_examples_browser.mjs` (64 pages, runner on 8197) PASS. Upstream: `Bag.toXml` (`@genrojs/bag` 0.10.1) writes dates with `Date.toString()`, genro-org/genro-bag-js#10; the XML check reads text and numbers only. This record, documents, 11.55; release 0.2.5: version in `pyproject.toml`, `js/package.json`, `jsr.json`, release notes v0.2.5.

**Open:** gramlot-js-server and gramlot-py-server serve `.css` and `_aux.js` only; the module form with a server needs their `.js` rule (briefs 3, 4). gramlot-examples → module form in brief 2. XML date text waits for genro-org/genro-bag-js#10.

<a id="gc-070-680"></a>
## 680 · The examples and their runner leave the core — 2026-10-04

Block ID: **GC-070-680**.

Owner: "tutti gli esempi vanno messi nel repo esempi e collegati opportunamente" (2026-10-02), gallery model of 2026-10-02; 2026-10-04 six-phase plan approved phase by phase ("vai"): workflow `Core tests`; trigger `codex/core-runner-ci` (absent branch) removed; `file:` branch of the live checks removed (static export belongs to serverless); the four Worker checks of `verify_worker_host_browser.mjs` missing in serverless move to its `verify_export_browser.mjs` instead of opening an issue. Constitution 11.56. Core `chore/examples-out` (from develop `78ea747`): `eb96c6b` qualification story (GC-210 §065) on `js/tests/fixtures/qualification/09_end_to_end`, imports from `js/src`, page module by package self-reference; `866ef3f` `verify_live_cards.mjs`, `verify_live_playground.mjs` on `js/tests/fixtures/live/` through the core Python and JS FileHost (`scripts/fixture_hosts.mjs`), CI without `serve.py` and gramlot-uvicorn; `072a818` CI `Core tests` without gramlot-js-server/gramlot-uvicorn checkouts and runner steps; `fe02793` removes `examples/` (138 files), `verify_examples_browser.mjs`, `verify_jsr_examples.mjs`, `verify_standalone_runner.mjs`, `verify_worker_host_browser.mjs` and `js/tests/fixtures/worker`, `jsr.json` without `examples/html_svg/**`, `codecov.yml` without `examples/**`; `e00f211` README, CONTRIBUTING, GC-025/030/055/090/095 point at gramlot-examples and the gallery commands; this record, 11.56, AGENTS.md, `docs/01-overview.md`, GC-085, GC-140, GC-145, GC-150, indexes. gramlot-js-server `test/worker-export-checks` (from develop `683a4b9`): `4855370` `verify_export_browser.mjs` adds live attribute, `clear()`, state `disposed`, `transport.main` rejected after dispose. Verified 2026-10-04 without `examples/node_modules`: Python 83 OK, JS 475/475 (c8); Chromium 153: binding, page module, inout, live cards and live playground (Python and JS hosts) PASS; Sphinx `-W` and `check_public_docs.py` PASS; js-server: `verify_export_browser.mjs` PASS in Chromium 153 and WebKit 26.6 (`hello-world`, `source-live`), serverless 32/32; no `deno`, JSR dry run not executed. Downstream coverage: gramlot-examples (`examples.test.js`, `gallery.test.js`, `verify_pages_browser.mjs`, `verify_e10_e13_browser.mjs`, published core), gramlot-js-server (`verify_export_browser.mjs`, `verify_gallery_browser.mjs`).

**Open:** push, PRs and merge of both branches (coordinating chat); GitHub CI of `chore/examples-out`; JSR package without `examples/html_svg` from the next release.


<a id="gc-070-685"></a>
## 685 · Release 0.2.6 — 2026-10-04

Block ID: **GC-070-685**.

`64df3fd` (PR #14) `.d.ts` declarations for the five JS entry points, module docs, README example; `20e713b` overrides aligned with `@genrojs/builders` 0.4.2; `20a677f` version 0.2.6, floors bag 0.10.3, builders 0.4.2, tytx 0.16.2, release notes. Carries §680 (PR #12, merged 2026-10-04); §680 open points closed: branches merged, `Core tests` and `Documentation` pass on `main` (`b9b2feb`), JSR 0.2.6 has no `examples/` file. Published 2026-10-04: GitHub v0.2.6 (wheel, sdist, npm package, `SHA256SUMS`), PyPI, npm, JSR 0.2.6 (checked 2026-10-05).

<a id="gc-070-690"></a>
## 690 · Documentation coherence pass — 2026-10-05

Block ID: **GC-070-690**.

Owner goal, 2026-10-05: "l'insieme Gramlot deve essere pulito, coerente e senza doc che possano creare confusione". Decisions: (1) current release version only in the README and its badge, no "current patch release" in guides; (2) historical documents keep their text, with a top banner (dates, content, current pointer), only broken links fixed; (3) `css_requires`/`js_requires` need a resource Host; `FileHost` and current adapters have none and raise for any name; the resource system comes with genro-kajenn, part of Genro (GenroPy successor on Kajenn, Gramlot, Asqueel), replacing `gramlot-kajenn` as named host; (4) `gramlot-examples` is public, links allowed.

Branch `docs/coherence` (from develop `18c51aa`): `24f3b66` README carries the current release and badge, guides say 0.2.0 is released; `1a522cf` `gramlot-py-server`/`gramlot-js-server` replace archived repos (README, AGENTS.md, overview, GC-005, public guides, GC-140, GC-085), Python adapter names `Application`, `Pages`, `mount_pages`, `create_application`, serverless floor `>=0.2.5`, current JS dependencies in GC-085; `f4b8327` page module primary, `foo_aux.js` alternative (README, GC-055, GC-090, GC-100); `51a7402` genro-kajenn in GC-065, GC-210; `6e66eed` banners on GC-010, 045, 060, 065, 086, 087, 215, GC-175 runner link → text; `f99d495` `docs/02-documentation.md`: seven public guides, `Core tests` coverage, GC-055 = The Gramlot family since 2026-10-01, GC-020 bindings/controllers in core; `4accfb9` theme README, `pyproject.toml` description = `js/package.json`. This record; amendment 11.57 (§7 = current integration repos, decisions 1–3); release 0.2.7 (manifests, notes v0.2.7, README). Verified 2026-10-05: Python 83 OK, JS 475/475 (`GRAMLOT_TEST_PYTHON`), docs build `-W` and `check_public_docs.py` PASS, no broken relative links.

**Closed:** GC-055 reused on 2026-10-01 against GC-005 §010 item 4; owner decision of 2026-10-05: The Gramlot family keeps it, explicit exception in GC-005 §010 item 4 and `docs/02-documentation.md` §4.


<a id="gc-070-695"></a>
## 695 · Released ecosystem audit — 2026-10-12

Block ID: **GC-070-695**.

> **Historical record (2026-10-12):** the audit below records its original
> observations. Chronology correction (2026-10-13): "later the same day" in
> the release-evidence paragraph refers to October 12, the audit day, not
> October 10. The October 10 Source-element auth entry remains correct.
> Current work: [§745](#gc-070-745).

Owner request: "esamina situazione completa gramlot e gli ultimi lavori svolti".
Observed implementation and checks only; no new decision, acceptance or release authorization.

Delivered October 7–10: routes removed; browser proxies src/rpc/dom/utl;
GramlotServer/GramlotFileServer and GRAMLOT_DEV with Python/JS parity; GC-230
single RPC envelope, endpoints, HttpTransport, default-deny auth and dataRpc;
server-side exclusion of refused Source elements and removal of accepted auth attributes.
Python integration implements Kajenn avatar-tag auth; examples c09–c11 demonstrate dataRpc;
both integration repositories aligned their auth conformance fixtures.
Delivered October 12: declarative remote (node method remote(name, …), RemoteBinding)
and dataRemote (RpcResolver on a genro-bag resolver, RemoteProvider) in core 0.2.16
(PRs #43–#46; constitution 11.59, GC-095 §105); examples 0.2.11 adds c12–c14, Chromium
check of the three pages on both servers passes; no protocol change.

GitHub latest releases checked October 12: core v0.2.15, py-server v0.2.7,
js-server v0.2.8, examples v0.2.10, all published October 10; later that day core
v0.2.16 and examples v0.2.11 were published. Registry artifacts not downloaded. At core 9463c45, local Python 125/125 and JS 523/523 pass, zero
skips, using existing dependencies. Initial sandbox localhost-bind failures vanish
with listener access. No fresh installation or browser qualification performed.
Latest October 10 main CI passes for core tests/documentation and all three
connected product repositories. Full counterpart gives release and CI links.
No open PR in the four repositories; no reachable active phased plan.

The 0.2.16 scope of temp/perimetro-0-2-x.md (remote/dataRemote on the existing
envelope and Bag resolver) is implemented and released; out of it by decision: lazy
loading by DOM visibility, _waitingMessage, the tbody merge, _resolved, _fired, the alias
data(path, remote=…).
The 0.3.0 notes cover component authoring, JSON collections, inputs and containers,
exclude database widgets and leave gridbox/label wrapping open. Their no-server-call
rationale predates 0.2.14; exclusions do not change automatically.

GC-220 and the October 1 residual report require item-by-item reassessment, not
blanket closure or promotion to current defects. README no longer cites server.main (corrected with this update: the browser
requests POST /gramlot/rpc, answered by server.call); the workspace README release table
is updated to the October 12 versions. Core open issues: #1
pre-rendering/hydration, #2 desktop/mobile; none returned for the three connected
product repositories. Devtools not requalified; Site/Rosetta remain PoC consumers.

Next: the next scope is the owner's to decide (Kajenn extended client with WebSocket,
push, serverpath; 0.3.0 components; CSP as grammar); GC-220 and the residual report
remain debt inventories to reassess item by item.


<a id="gc-070-700"></a>
## 700 · Technical review before the next scope — 2026-10-12

Block ID: **GC-070-700**.

Owner requested contradictions, duplication and prerequisites for the next phase.
Core 729c542 reviewed with binding/renderer, Python/JS server contracts, relevant
Node/Bun dispatch and docs. No runtime source fix, design approval or publication.

Reproduced:
1. P1: cached remote A mounted → B pending → Data back to A → B answer mounts B.
   `binding/remote.js:48-56` skips the call without cancelling the pending B.
2. P2: the remote cache omits the fragment name and retains mutable parameters.
   Changing a ^remote name with equal params leaves the old fragment; mutating
   a child of a ^Bag parameter also leaves it unchanged (`sameValue` identity).
3. P1: Chromium starts the same bundle on localhost but fails on an ordinary
   HTTP hostname: `crypto.randomUUID` is unavailable. BindingRuntime:33,
   renderer:51 and builder references use it; RpcHandler's getRandomValues
   implementation does not fix startup. Reproduced with a local mapped hostname.
4. P2: actual Node/Bun dispatcher accepts application/jsonp (200), rejects
   Application/JSON (415), and replaces invalid UTF-8 inside a JSON string,
   passing it to an endpoint (200). Python rejects decoding errors. Adapter-owned
   correction, and conformance input coverage, required; adapters unchanged.
5. P2: GC-220 style/class mismatch reconfirmed. GC-210:458 says string/null;
   Python emits lists/dicts as text, JS live rejects them; both accept class_=7.

Contract questions, not newly approved triggers: clearing a ^remote name does not
abort its pending response; live setAttr(remote_id=2) does not refresh content
built with remote_id=1. GC-095 specifies startup/Data triggers, not these cases.

Maintenance: cancellation repeated in SourceHandler, Provider and RpcResolver;
provider/code/control attributes enumerated across grammar, activation,
installation, runtime and rendering; common Provider holds rpc/resolver-only state
while subclasses expose kind only. Review responsibility before components or
new transports; no blanket deduplication or new manager justified. Python/JS
separation is intentional; binding JSON copies are equal.

Coverage/docs: C07 checks readable bundles only, although servers default to
minified ones. GC-070 §015 retains stale S00/pre-binding instructions; GC-230
"Realised by" blurs planned Kajenn extensions with implemented auth; §695's
"later the same day" after October 10 is wrong for October 12 releases.

Checks: Python129 pass; JS554 pass plus one stale-generated-bundle failure;
normal build then C07 passes. Existing Chromium binding/lifecycle/CSP/srcdoc
check passes. Docs preparation, strict Sphinx, public links/boundaries, mirror
anchors and binding JSON equality pass. Diagnostic scripts/logs are local ignored
files in temp/review-20261012; full counterpart lists evidence and locations.
Not a complete adapter/browser matrix, dependency refresh or package download
qualification. Other GC-220 items are not promoted to newly reproduced defects.

Recommendation: fix cache/startup/HTTP defects, reconcile style/class, decide the
two remote lifecycle cases before further features. No implementation phase begun.

<a id="gc-070-705"></a>
## 705 · Proposed stabilization plan — 2026-10-12

Block ID: **GC-070-705**.

> **Current contract correction (2026-10-13):** declarative `remote` has a fixed
> method name (constitution 11.60, [§755](#gc-070-755)). Earlier reactive-name
> observations, exercises and Q1 are historical records, not current requirements.
> Q1 is outside contract; Q2 remains open only for otherwise permitted Source edits.

Owner: "ok : pianifica", after §700. Planning authorized and complete; the plan
was initially proposed; the owner subsequently authorized phase 1 with "si"
(§710), then phase 2 with "si" (§720) and phase 3 with "vai con la 3" on October 13
(§725). Phases 4–6 remain proposals;
no release or deployment authorization.
GC-110 remains the sole completed 0.1.0 execution plan.
Record implementation, checks and acceptance separately after each phase.

Sequence update, 2026-10-13: owner places §735 teaching/documentation work before
phase 4; stabilization phases keep their numbers. §735 D2 takes the overlapping
phase 5 editorial corrections; responsibility review and Q1/Q2 stay in phase 5.

1. **Remote cache.** RemoteBinding, SourceHandler and binding-remote tests.
   Regressions: A mounted/B pending/back to A/late B; changed remote name with
   equal params; nested Bag mutation. Current declaration must win on a cache
   hit; identity includes name and stable parameter state. Inspect Bag contracts
   before choosing comparison/copy representation; confirm new representation
   or naming decisions, no upstream edits or substitute Bag model. Preserve
   unchanged-cache no-call behavior, latest request, removal and false `_if`.
   Exit: three failures reproduced before correction, then all relevant tests
   pass. Empty names/direct Source changes excluded pending Q1/Q2.
2. **HTTP startup and bundles.** Browser identifiers in BindingRuntime,
   GramlotRenderer and GramlotBuilder: one agreed HTTP-capable strategy, with
   RpcHandler as existing evidence; no API fallback chain. Real-browser ordinary
   HTTP hostname test covers startup/render/reference creation, localhost
   control, HTTPS if available (otherwise disclose). C07 covers readable and
   minified JS/Python copies using canonical build configuration. Exit: all four
   artifacts match, HTTP startup/reference creation and default minified mount
   pass. Any new helper follows GC-225 and its confirmation rule.
3. **HTTP parity.** Core Python/JS conformance inputs; proposed connected work
   confined to gramlot-js-server dispatcher, tests and paired docs. Exact JSON
   media type case-insensitive with parameters; wrong/missing/lookalike type415;
   invalid UTF-8 inside valid JSON400 before dispatch, for RPC and close. Same
   cases against existing Python adapters and actual Node/Bun adapters. Exit:
   matching semantics and no endpoint/close effect on rejected input; missing
   Bun is an unverified gate. No new envelope or core-to-adapter dependency.
4. **Style/class.** Apply existing GC-210 string/null rule in Gramlot-owned
   Python static and JS static/live handling. Reject lists/maps/booleans/numbers;
   preserve strings, shortcuts, deferred bindings and null removal. Test initial
   values/reactive updates where applicable. Exit: parity and renderer/binding
   checks pass. No coercion, widened contract or upstream workaround.
5. **Responsibilities and docs.** Map cancellation ownership and provider/control
   attributes to their contracts; report drift. No generic manager or automatic
   Provider rewrite; any extraction requires a concrete benefit and approved
   responsibility/name. Intentional Python/JS counterparts remain legitimate.
   Correct unsupported variable remote names in runtime/tests (§760), following
   constitution 11.60. Evaluate the owner's signature pointer-permission proposal;
   settle design/ownership before implementation. Q1 is outside contract. Q2 still
   asks whether otherwise permitted live Source edits trigger re-evaluation and how
   addition/removal works; record confirmation before that contract/code change.
   Correct §015 historical labeling, §695 chronology, GC-230 planned/delivered
   Kajenn wording with mirrors/IDs preserved. Exit: contradictions disposed of;
   remote questions confirmed with checks/docs or explicitly deferred by owner.
6. **Qualification.** Rebuild then full Python/JS suites on final state; Chromium
   binding/remote/HTTP tests and minified mount; affected Node/Bun integration
   and Python conformance; strict docs/public checks, mirror anchors, binding
   grammar parity. Refresh first-party dependencies during setup/update, no
   pins. Review actual diff for unauthorized paths/state/names/ownership.
   Exit: defects in agreed scope closed, gates evidenced, missing environments
   disclosed, debt and owner acceptance recorded. No release/version bump,
   deployment, new features, example migration or broad refactor.

Phase 1 implemented and locally verified, with TYTX comparison confirmed by
owner "ok"; evidence in §715. Phase 2 subsequently authorized and locally verified
(§720). Phase 3 subsequently authorized and locally verified (§725). D1 inventory
is complete (§740); D2 was subsequently authorized and implemented (§745). Complete and obtain acceptance of teaching
work before proposing phase 4. Later phases and Q1/Q2 remain proposals.

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

Owner "ok" confirms the question "Confermi il confronto sul testo TYTX già usato
nelle richieste? Evita riferimenti mutabili, ma un diverso ordine delle chiavi può
causare una richiesta aggiuntiva." This approves TYTX comparison and the stated
key-order consequence, not Q1/Q2, later phases or publication.

RemoteBinding compares name and TYTX parameters captured before sending; only a
mounted response updates the cache. Cache hits abort pending requests through the
existing controller. Three original failures now pass: A/B/A late response,
reactive name change and nested Bag mutation. Five added tests cover object,
array, date and Bag-attribute mutations while pending, unchanged repeats and
reordered object keys. Removed the old recursive comparison; no clone model,
upstream edits, public API, generic manager or alternate transport. Private
lastName follows existing lastParams spelling/ownership. GC-095 mirrors updated.

Checks: remote/cleanup/lifetime49 pass; full JS563 pass with no skips (includes
C07); Python129 pass after enabling localhost listeners (initial sandbox bind
PermissionError cascaded into URL errors; no workaround); Chromium153 existing
binding/controls/lifecycle/CSP/srcdoc script passes. Cache-specific checks are
Node/JSDOM, not a browser matrix. Build, strict Sphinx, public docs, paired anchors
and whitespace checks pass. Minified C07 coverage remains phase 2 work.
Logs in /private/tmp/gramlot-phase1-{tytx,js,python-verified,browser,build,docs}.log;
initial sandbox log gramlot-phase1-python.log. No dependency refresh, registry
artifact qualification or full integration matrix claimed.

Phase 1 implemented and locally verified; result acceptance remains pending.
Next proposed action: owner authorization for phase 2 HTTP startup and served
bundle variants. No next phase, release or deployment performed. Different object
key order can cause another request under the explicitly confirmed rule.

<a id="gc-070-720"></a>
## 720 · Stabilization phase 2 implemented and verified — 2026-10-13

Block ID: **GC-070-720**.

> **Historical record:** phase 2 closure checkpoint. The owner subsequently
> authorized phase 3 with "vai con la 3"; its completion and next action are in §725.

Owner "si" answers "Confermi il passaggio alla fase 2: avvio su HTTP e verifica dei
bundle minificati?" Scope: §705 phase 2 only; no adapter changes, later phase,
publication or deployment.

BindingRuntime subscription, renderer instanceId and builder references now use
16 getRandomValues bytes as 32 hex characters, the existing RpcHandler strategy.
No optional fallback, runtime helper or public API; generation remains with its
existing owners. Reference reuse and radio isolation preserved; server-only
identifier paths unchanged. C07 checks readable/minified copies in JS and Python
resources, importing canonical runtime-options.mjs data also used by the build.
Configuration import does not rebuild artifacts. Build notice paths resolve from
its configured working directory. Build-data camelCase and existing
verify_*_browser.mjs script naming patterns retained.

Before correction: browser localhost4 pass, ordinary HTTP hostname4 fail with
missing crypto.randomUUID. New core browser script serves all four actual local
artifacts; asserts secure context/API availability, mounts typed Source, checks
node/DOM reference creation/resolution/stability, reactive Data, two-page/radio
isolation. After correction: 8/8 pass in Chromium153. Added to Core tests workflow;
no hosted result yet. C07 detected all four stale pre-rebuild copies and passes
after build; minified gap closed without claiming published artifacts were checked.

Final checks: JS567 pass/no skips (four C07 subtests), Python129 pass, Chromium
runtime-origin8 pass, existing binding/lifecycle/CSP/srcdoc pass; build, whitespace,
mirror anchors, strict Sphinx and public docs pass. Logs: /private/tmp/gramlot-phase2-
{browser-before,bundle-stale,build,bundle,browser,js,python,binding,docs}.log.
HTTPS not tested: localhost is only a secure-context control. No dependency refresh,
registry packages, other browser or full adapter matrix qualified.

Phase 2 implemented and locally verified. Next: obtain owner authorization for
phase 3 HTTP input parity, including bounded gramlot-js-server corrections.

<a id="gc-070-725"></a>
## 725 · Stabilization phase 3 implemented and verified — 2026-10-13

Block ID: **GC-070-725**.

Owner "vai con la 3" authorizes §705 phase 3 and bounded js-server work. No new
RPC envelope, core-to-adapter dependency, publication or deployment.

Node/Bun dispatcher: exact application/json media type (case-insensitive, trimmed,
semicolon parameters allowed); missing/empty/lookalike types415. Fatal UTF-8
validation before RPC/close: invalid bytes400 without endpoint invocation/page
closure; valid multibyte text accepted. New shared core Python/JS conformance
checks both paths, positive media types and negative malformed bodies, followed
by valid calls proving page survival. Core Node reference fixture had the same
invalid-byte replacement defect and is corrected. No Python adapter edits.
GC-230 and both adapter reference views updated. Eighteen adapter boundary cases
also cover truly absent headers, response semantics and absence of side effects.

Before: 8/16 initial boundary cases failed; Node reference conformance failed
UTF-8 cases, Python reference passed. Installed adapter core0.2.14 then failed
newer auth conformance, not the corrected HTTP boundary. Linked current core
using npm --no-save --package-lock=false --ignore-scripts file specifier; no
manifest/lockfile/source-copy changes or old-version restoration. Link remains
for local verification. Both runtimes pass full current Python/JS conformance
at / and /js. No registry or hosted CI qualification claimed.

Final: core JS567/Python129; Node33/Bun33; all pass. Python adapter conformance:
10 parametrized tests pass on Uvicorn/Django/Flask/FastAPI/Kajenn, root and
mount/policy, two pages each. Chromium153 browser and gallery harnesses pass
on Node and Bun (33 installed examples each). Core strict docs/public checks,
adapter paired guides and both Sphinx views, anchors/whitespace pass.
Intermediate Bun under concurrent documentation builds timed out; isolated full
rerun passed with unchanged 5-second timeouts/source. Retain this environment
sensitivity in the record. Temporary Playwright entry selects installed Chromium;
no product workaround. Logs /private/tmp/gramlot-phase3-*.log; expanded record
lists them, including bun-current (failed timeout) and bun-final (33 pass).

Phase 3 implemented and locally verified. Next: owner authorization for phase 4
style/class string/null parity. Remote lifecycle decisions and responsibility
review remain separately gated.

<a id="gc-070-730"></a>
## 730 · Documentation and example coverage review — 2026-10-13

Block ID: **GC-070-730**.

Owner asks whether docs/examples show and explain everything clearly. Local
review: substantial coverage, but incomplete and inconsistent. No corrections,
example behavior changes or phase 4 authorization implied; no online site audit.

Current examples catalogue: 38 = HTML/SVG13 + binding11 + controllers14;
every entry has .py/.js/.md. RPC, errors, unauthenticated refusal, remote and
Data resolvers are represented. Issues:
- JS/Python adapter guides still call Source methods/remote future APIs, conflicting
  with GC-095 §105 and c12–c14 (expanded view lists paths).
- GC-095 introduction stops at c08/§100 despite c09–c14/§105; GC-020's dated
  0.2.0 scope excludes resolvers without a pointer to current dataRemote.
- c13 README omits phase 1's name/successful-mount/TYTX/cancellation rules;
  "Requests" actually counts _onRemote mounts. Browser test observes that counter,
  not transport calls. No demo of late response, changed name or Bag mutation.
- c14 explains cacheTime choices but demonstrates only 5 and argument changes;
  expiry/read, zero, error and cancellation are not distinct demo exercises.
- GC-095 admits no examples for js_requires groups, named connect_on handlers,
  _userChanges, _onBuilt, #ANCHOR, inout. Common pages have no inout; separate
  integration tutorials may. c11 auth is refusal without identity, not full
  authenticated allow/deny or Source exclusion.

Phase 3's installed gallery was 32 common pages (controllers c01–c08) plus one
runtime-specific = 33. It did not reverify latest c09–c14. Current examples script
has checks for them and dated earlier release evidence exists; no fresh 38-page
run in this content review. This does not invalidate phase 3's HTTP-specific
checks. Sphinx/mirrors/links do not prove pedagogical completeness or clarity.

Recommend reconciled entry points, corrected c13 terminology, a feature→guide→
example→test coverage map, explicit omissions and qualification of the current
catalogue, plus a learner-path editorial walkthrough. Proposal only.

<a id="gc-070-735"></a>
## 735 · Documentation alignment and teaching examples plan — 2026-10-13

Block ID: **GC-070-735**.

> **Current contract correction (2026-10-13):** declarative `remote` has a fixed
> method name (constitution 11.60, [§755](#gc-070-755)). Earlier reactive-name
> observations, exercises and Q1 are historical records, not current requirements.
> Q1 is outside contract; Q2 remains open only for otherwise permitted Source edits.

Owner: "ok pianifica il lavoro per allineare la documentazione e completare gli
esempi, prima di passare alla fase 4"; "l'importante è l'aspetto didattico per chin
deve usare gli esempi per apprendere". Planning authorized and complete; priority
is learning, before phase 4. Owner "\ùprocedi" subsequently authorized D1,
completed/checked in §740. Owner "si" then authorized D2 (§745). D3–D6
execution and teaching acceptance remain pending.

Outcome: a developer starts a page, understands Source/Data and browser/server
roles, predicts a change and builds a small page. Coverage concerns the agreed,
implemented author-facing scope, not every HTML tag/internal detail.

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

**Proposed teaching standard:** each example has an objective/prerequisites,
environment/opening instructions and initial state, Python-first code explanation
with equivalent JS and execution location, guided action/expected result/reason,
a small prediction or modification exercise with its answer, a likely mistake,
limitations/reference/next lesson. Explain new terms; one new idea in basic
lessons, composed ideas in advanced ones. UI labels describe actual measurements.
Separate advanced timing/errors; no internal-guide prerequisites or application
instrumentation that conceals the framework.

**D1 — Coverage and learning path.** Map all 38 entries and supported author APIs
(GC-090/095/100, binding/server contracts, active adapter guides) to contract,
guide, objective, example/exercise, check, language/environment and gap disposition.
Statuses: covered, explanation incomplete, missing demonstration, environment-only,
deferred, blocked. Original concept map (now a secondary index): setup/first page → HTML/SVG → Data/paths →
controls → formulas/controllers/Logic → events/lifecycle → RPC/errors → remote
Source → Data resolvers/cache → complete page. Essential path plus advanced
material; one Python setup first (proposed Uvicorn), other environments separately.
Preserve existing keys. Deliver matrix, prerequisite map and bounded revision/new
lesson list with destinations before D2–D5. Names follow GC-225/GE-010; missing
conventions require owner decision. Exit: every topic/example has a learning role
or explicit exclusion, no unresolved lesson scope or unsupported coverage claim.

**D2 — Guides.** Reconcile core orientation/GC-090/095, examples introductions and
active adapter writing/reference/troubleshooting guides; remote is no longer
future work, dataRemote does not imply all resolver features. Explain common
concepts centrally, link instead of duplicating contracts/suites. Preserve dated
text with Historical record banners and current pointers. Take phase 5 editorial
items (§015, §695 chronology, GC-230 planned/delivered Kajenn), using dated
corrections where necessary. Paired docs/anchors preserved; current releases only
in README/badge, development cache fixes clearly separated from published behavior.
Exit: coherent setup → lesson → reference without internal-history prerequisites.

**D3 — Existing lessons.** Apply the teaching standard to all 38 explanations,
pages, family introductions and cross-links; preserve equivalent Python/JS and
show Python's Logic companion. Prioritize c09–c14. c13: label mounts correctly,
explain last-successful-mount name/TYTX-parameter identity, key-order limitation
and cancellation; verify skipped calls independently from _onRemote counts.
Advanced exercises: delayed A/B/A and Bag mutation. The originally proposed
name-change exercise is excluded by the owner decision in §755. c14: first read,
response, expiry then read (not automatic TTL refresh), zero/one-time cache,
reactive arguments, failures and supported cancellation/lifetime. Do not invent
callbacks/error UI or reuse dataRpc-only callbacks. Exit: guided trial/self-check
per page, accurate explanation; exposed runtime defects block affected exercises.

**D4 — Missing coverage.** Follow D1, extending existing lessons or adding focused
ones: _userChanges exact-path versus container/child writes (programmatic exact-path
writes also trigger); named connect_on/context requires dotted resource groups and
an external resource-host lesson, not the common gallery (D1 corrections, §740);
_onBuilt versus _onStart/order/cleanup; #ANCHOR versus relative paths; inout typed
save/restore/export and other supported operations with local fixtures or explicit
manual checks, no real email/external-service effects. Auth: default refusal,
Source omission versus browser visibility; authenticated allow/deny only through
an existing environment identity integration, no new login system. Common resource
lessons use Page.css/same-name CSS/Logic; named requires/groups need genro-kajenn,
not the kajenn adapter or FileServer. Work outside the four Gramlot repositories
requires separate authorization. Exit: supported common gaps demonstrated and
checked; environment-specific/blocked/deferred items have destination/status/next
action for owner review. A limitation note does not count as a working example.

**D5 — Complete page.** Retain the earlier local-only stage, then revisit the
same page in later release stages, showing the code replaced by each new feature. Prefer extending an existing complete/end-to-end lesson:
initial Data, editing, computed value, action, server response, error. Related
variations explain choosing dataRpc/remote/dataRemote without forcing all into one
large page. A learner changes a requirement using previous lessons and checks the
result. Only approved Source/Bags/bindings/controllers/server APIs, no hidden
helpers or parallel state. Exit: equivalent Python/JS, no unexplained prerequisite.

**D6 — Qualification and editorial walkthrough.** Establish installed core/examples
state, refresh first-party dependencies at setup/update without pins/source-copy
edits. Run all current catalogue entries (including c09–c14 and additions) with
Python/JS tests and Chromium; derive expected entries from catalogue, detect skips,
assert behavior. Verify gallery delivery on Node/Bun, five Python adapters and
Worker/static export for supported scope. Record per-environment commands, entries,
outcomes and exclusions; check changed setup instructions in a clean local setup.
Examples checks stay downstream, never core-to-examples dependencies. Deterministic
race tests plus browser checks; local file/download/mail verification and manual
limits recorded. Required repo documentation/build checks, paired anchors/links,
package assets when changed. Independently walk reader instructions from setup to
complete page: rendering, source visibility, prerequisites, results, mistakes,
links; correct and recheck. Agent review is not novice-user evidence. Present
beginner, cache/remote and complete-page lessons for owner's didactic review.
Exit: contradictions closed, no unexplained gap, checks accounted for; blocked or
unavailable items explicitly disposed of, teaching acceptance separate from tests.

**Boundaries:** core guides/contracts; examples repo common pages/READMEs/catalogue/
gallery; Python/JS server repos environment setup/examples/checks. No runtime,
dependency-source, authentication/resource system, gallery component, release,
deployment or external-service action authorized. Style/class: teach agreed
string/null, report pending phase 4 parity; no coercion or false fix claim.
Q1/Q2 empty-name/direct Source changes stay undecided. Development corrections
are not published releases. Record implemented/verified/blocked/accepted after
each authorized step. D6 acceptance precedes separate phase 4 authorization;
phase 5 retains responsibility/Q1/Q2 and phase 6 final technical qualification
with affected teaching rechecks. GC-110 not reopened.

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

Owner "\ùprocedi" authorized D1 after the explicit request to start the coverage
map/learning path. D1 complete, proposed deliveries not yet accepted or implemented.
D2 subsequently authorized and completed (§745); D3–D6 and stabilization phase 4 remain gated.

Evidence: current catalogue, all 38 READMEs, Python attributes, relevant paired
source/test bodies, GC-090/095/100, binding/server contracts, integration tutorials.
Checkout references: core729c542153ed, examples4c494800521b, py-server783de4298618,
js-servere14a9b867741 plus existing local stabilization changes. Evidence IDs, not
pins. No new runtime/browser/install tests, external service or deployed-site audit.

Expanded [§740](../../docs/internal/070-work-status.md#gc-070-740) contains the
per-capability matrix and source links. G90/G95/G100 below are public guide IDs;
sections preserve their stable numbers. Authority: constitution §§3/9/13,
11.48–59; GC-210 010–050 with supersessions, GC-225 and GC-230 010–045.
Teaching labels: C narrow slice covered; E explanation/exercise incomplete;
M common runnable demo missing; H environment-specific; B known mismatch/open
contract; F deferred; R advanced reference outside common gallery. No label
asserts tests were rerun or novice comprehension was established.

All 38 have Python opening/Source checks (P) and browser startup checks (L).
Additional inspected checks: J = JS/jsdom keyed behavior, b01–b11/c01–c14;
W = real-browser interaction b08/c03/c08–c14; S = Python endpoint/fragment
c09–c14; V = dedicated e10/e13 browser script. Sources: examples tests/test_pages.py,
tests/examples.test.js, scripts/verify_pages_browser.mjs and
scripts/verify_e10_e13_browser.mjs. Optional J/W dispatch can silently omit a new
behavior case: D6 must check expected keys. Startup alone is not behavior coverage.

### All 38 lessons and proposed prerequisites/exercises

Every row is E for the full proposed teaching standard, even where its narrow
feature slice is C. Add prerequisite, answer/reason, mistake and next links in D3.
All paths resolve through catalogue key to pages/<family>/<folder>.py/.js/.md;
no copied teaching suite. Exercise column describes the target, not completed work.

| Key | Prerequisite | Target exercise / learning role | Extra checks |
| --- | --- | --- | --- |
| e01 | Python/setup | Add paragraph, edit/reload, explain main and Source/DOM. | — |
| e02 | e01 | Inline text/local link, safe literal text and destination. | — |
| e03 | e01 | Fourth list record; build-time loop, count after reload. | — |
| e04 | e02 | Article/navigation target, semantic landmarks. | — |
| e05 | e03 | Add row and predict fixed total. | — |
| e06 | e02 | Edit/Reset native defaults; labels, disabled Submit. | — |
| e07 | e03 | Expand details, change static meter. | — |
| e08 | e01 | Move SVG coordinate, explain viewBox/paint. | — |
| e09 | e03/e08 | Add group, predict transform. | — |
| e10 | e03/e08/c07 basics | Remove Source card, reload; distinguish node_label/node_id/id. | V |
| e11 | e05/e08 | Change dataset, reconcile chart/table/summary. | — |
| e12 | e04/e07/e09 | Static capstone, add session/speaker/map stop. | — |
| e13 | e10/c07/lifecycle intro | Live Source update/removal, animation cleanup. | V |
| b01 | e01/e03/setter intro | ^ versus = first; relative/#node_id/#FORM/?attr later; add #parent/#ANCHOR. | J |
| b02 | b01/b04 | Rename/switch/return record; advanced null-context boundary. | J |
| b03 | b01 | Later setter, zero/default, null R1 versus runtime write. | J |
| b04 | e06/b01 | input/change timing, numeric null, multi-select/Data types. | J |
| b05 | b04 | Radio booleans, absent values, programmatic choice/isolation. | J |
| b06 | b04 | Shortcut precedence, null removal, visible/hidden; phase 4 remains B. | J |
| b07 | e08/b04 | Bind cy range, predict movement/units. | J |
| b08 | c03/c06/e10 | Freeze/delete/change Data/thaw, immediate semantic cleanup. | J/W |
| b09 | e06/b03–b05 | Static versus bound record, file/password/Reset limits. | J |
| b10 | e08/b07 | Add cx binding; reactive SVG practice. | J |
| b11 | e12/b05–b07 | Bound title/speaker/map/FAQ, layout space. | J |
| c01 | b03/b04 | VAT then quantity, ^ triggers/= rereads, chains later. | J |
| c02 | c01 | Effects first; firing/debounce/interval and path filter later. | J |
| c03 | c01/c02 effects | Named Logic, price120→108, arguments/this/browser. | J/W |
| c04 | c03 | Score threshold and ==; optional inline/CSP topic. | J |
| c05 | c02/c06 basics | PUT/GET/SET timeline, equal FIRE and delayed-fire cleanup. | J |
| c06 | c02 basics/c03 | Click modifiers, one mechanism, Enter/type/disabled limits. | J |
| c07 | c03/c06 | Declaring node/event target/removal; named group form is H. | J |
| c08 | b03–b05/b07/b08/c03/c06 | Lifecycle capstone; D5 RPC result/error after c09/c11. | J/W |
| c09 | c03/c06/execution model | Price12.5/rate22→15.25; endpoint versus main/Worker. | J/W/S |
| c10 | c02 timing/c09 | Quantity12→96 after debounce; add delayed race/timeout. | J/W/S |
| c11 | c06/c09 | Errors preserve result; add Source omission; positive auth H. | J/W/S |
| c12 | c09/b01 | Chair/12 stock fragment; Source versus Data, advanced nesting. | J/W/S |
| c13 | c12/b02 | Equal category/cache, mounts versus calls, advanced races. | J/W/S |
| c14 | c09/c10/c12 distinction | Read/menu/argument change, then TTL/zero/once and errors. | J/W/S |

### Capability dispositions and executable evidence

- **Structure/setup (C/E/H):** G90 015–030, G95 005/025/070 and adapter tutorials.
  e01–e12 cover Page/main/HTML/SVG/loops/helpers. D2 explains Source/Data/DOM,
  fresh Page per call, gallery versus editable project, reload, Python/browser
  Logic. e02/e08 add safe text, namespaces/foreignObject; naming escapes and
  node_label/node_id/id explained. Page.css/companions/load order/public imports
  link c03 and adapter setup. Source/renderer/svg/page-resources/bootstrap specs.
- **Data/paths (C/E/M):** G95 040–050, GC-210 018/035. b02/b03 show dict→Bag;
  add lists/string literals/null R1/attributes/no reinstall. b03 defaults include
  0/false/empty string and default_<attr>/attr_*. b01 covers ^/=, relative/absolute,
  ?attr, #node_id/#FORM; #parent/#ANCHOR missing despite guide completeness claim.
  b02 adds null-context read=null/write error. Bare _path fields and forbidden
  ?attr destinations get validation callouts. Installation/defaults/projection/
  source-extension and Python authoring tests; c01 distinguishes provider rereads.
- **Controls/projection (C/E/M/B):** G95 070/GC-210 030. b04/b09 add lexical dates,
  numeric empty/invalid drafts, missing option, multiple values, IME, input/change,
  correction/rebuild; b05 group isolation/invalid initial booleans. e06/b09 compare
  native Reset and bound fields/file limitations. b06 string/null rule still B
  for phase 4 invalid-type parity; no coercion. Teach CSS/native width difference,
  null, visible/hidden; b07/b10 reactive SVG. Native/boolean-controls, projection,
  style-shortcuts and Python renderer specs.
- **Templates/mask/==/srcdoc (M except c04 ==):** constitution 11.48 items7/11,
  11.54, GC-210 010, G95 065, G100 090 static-only description. New projection
  lesson: Gramlot ${name} differs from language templates, attributes only,
  escaping/missing names, mask text and empty values, forbidden expression chains;
  safe Data HTML preview/default sandbox. GC-210 030 wrongly still excludes mask.
  Projection/inline/srcdoc-sandbox/Python renderer specs; D2 public explanation.
- **Providers/Logic (C/E/M):** G95 055–065/080. c01/c02 calculate versus effects;
  c03 root named methods/signatures/this/state/errors and strict CSP. c01 _if/_else
  exists; remote/dataRemote conditional demos missing. _onBuilt absent, _init/
  _onStart partly shown; new lifecycle lesson shows trace/removal/freeze, no repeat
  on thaw. c02 advanced delay ms/timing seconds/delayed startup; _userChanges must
  demonstrate exact-node versus container/child, not human versus program origin.
  Programmatic node writes pass (providers.js receive, D2a test). Providers,
  named-logic, bootstrap, timing, lifecycle/cleanup tests.
- **Writes/buttons/events (C/E/H):** G95 065/075. c05 GET/SET/PUT/FIRE/FIRE_AFTER
  needs value/event timeline and cancelled timer; c06/c11 need explicit one-click
  mechanism, disabled behavior, modifiers, type/Enter/propagation. c07 inline
  handler targets/removal. Named connect_on recognizes dotted group.method
  (view/events.js); root func spelling is not a named-event equivalent. Resource
  host required, no fake group/alias. Writes/lifetime/button/native-event tests.
- **Live Source/lookup/lifetime (C/E/M):** G95 030/035/075/080. e10/e13/b08/c08
  show mutations/freeze. Advanced ordering after events/Logic, delete+insert type
  change and immediate semantic cleanup under frozen DOM; lookup/null-return
  exercise with gramlot.dom, no direct DOM mutation. Freeze/live-source/lifetime/
  projection tests.
- **Inline/CSP (E):** constitution11.53, G90 035/G95 065. c04 needs actionable
  named alternative and rejected examples for Data-as-code/native onclick/later
  inserted text. Actual environment policy matters; strict project skeleton and
  gallery inline lessons differ. Inline/embedded-source/bootstrap specs.
- **Data exchange (M common, H/E GS-135):** G95 095; inout tests. New common
  lesson: typed save/restore versus JSON/XML export, correct user gesture, missing
  Bag/error. Advanced sendMail limit/user sends, sendHttp JSON/status/connect-src
  and difference from dataRpc; local receiving fixture/manual limits, no real
  external sends. GS-135 already teaches some operations, do not claim total absence.
- **RPC (C/E/M):** constitution11.58, GC-230 015/025/035, G95 100. c09–c11 cover
  endpoint/kwargs/basic value/callbacks/debounce/errors. Add scalar/Bag/null,
  reactive method/no result_path, deterministic latest-wins/timeout/removal,
  transport versus application errors; values do not activate code, Page is fresh.
  RPC/server/Python specs; current c10 checks debounce, not reordered replies.
- **Auth (C/M/H):** G95 100/GC-230 030. c11 common anonymous refusal; add protected
  Source omission, not CSS hiding. Existing Kajenn avatar-tag implementation and
  test_auth_capability_evaluates_the_avatar_tags in tests/kajenn/test_kajenn.py
  cover anonymous/denied/allowed/logout. Adapter-owned GP-505 lesson can reuse
  Basic-auth/site setup; no new login system. Identity differs from owner cookie;
  Kajenn auth does not provide genro-kajenn resource hosting.
- **Remote (C/E/M/B):** constitution11.59, G95 105, §715. c12 fragment/startup/
  ^params, retained initial content; add name/nesting/removal/failure and _if/_else.
  c13 counts mounts, not requests; last successful name+TYTX snapshot and pending
  abort on hit, key-order limitation. Advanced A/B/A, Bag mutation, independent
  request count. Local fix is not promised in published packages. Errors surface
  in console, no invented _onError. binding-remote/source-pipeline specs.
- **dataRemote (C/E/M):** G95 105. c14 lazy/read/reactive arg basics; add read
  coalescing, TTL expiry then read, zero silent notification and one-time cache;
  _if removal/reactivation, abort/unchanged value on failure. No unsupported lifecycle
  callbacks. binding-dataremote tests specify these cases.
- **Composition (E):** c08 currently local lifecycle, not “every piece” of updated
  controllers. D5 adds c09/c11 server result/error step, with c12/c14 alternatives
  linked rather than forced into one large app; J/W behavior checks to extend.
- **Resources (H/M):** G90 030/constitution11.57. Requires/groups/named native
  events await separate genro-kajenn delivery outside four-repo scope. FileServer
  and current adapters do not supply it; tests of registration are not a host.
- **Advanced reference (R/H):** G100 025/030/035/090 collections, grammar/void,
  static HTML/XML/::HTML; G90/G95 015 custom host/bootstrap/transport/startSource/
  direct remoteSource/rpc.call. Existing collections/renderers/source-pipeline/
  handler/transport/conformance fixtures support reference walkthroughs, not a
  new beginner gallery or manual-request shortcut. Static raw HTML is not live.
  G90/GC-230 lifecycle/owner/TTL/close/prefix/assets/CSP remain adapter guides and
  setup checks. No deployment needed.
- **Deferred/blocked (F/B):** G95 085/G100 010/015 recipes/components/db/records/
  unsupported declarations; explicit boundaries, no application substitutes.
  §705 Q1/Q2 empty remote names/direct Source edits stay undecided; style/class
  phase 4 stays pending. No completeness percentage that hides these gaps.

### Route and bounded delivery

Entry proposal: GP-020/105 Python/Uvicorn gallery then editable new project;
required extras, saved-file reload, public JS Logic and CSP difference explained.
Node/Bun/Worker are linked alternatives, not Python prerequisites. No commands
rerun in D1. The following D1 concept route is historical as a primary order;
the owner now requires release chronology (§745). Retain it as a supporting
index, and preserve the earlier c08 stage. Essential units:
1. e01/e03 structure and build-time iteration.
2. e06/b01 basics/b04 native editing and Data.
3. b03/c01/c02 concepts/c03 named logic (timing/inline detail deferred).
4. c06/c09/c11 click, value, visible error.
5. c12 Source replacement versus Data result.
6. D5 revised c08; SVG/freeze optional tracks after b07/b08.

Branches: e02/e04/e05/e07 HTML; e08→e09→e11 SVG/static; e12→b11 capstone;
b05/b06→b09 forms; b07→b10 reactive SVG; c03/c06→c07→e10→e13→b08 Source/lifetime;
c05 writes after click/effects; c04 optional inline; b01 symbols→b02→c12→c13
contexts/cache; c09/c10→c14 lazy Data. Never require all 38 before building a page.
Each trial has a predicted answer/reason and clear before/after observation.

- D2 core: affected GC-020/025/030/055/090/095/100, overview/index, template/mask
  coverage/GC-210 contradiction, b01 overclaim and already assigned historical
  §015/§695/GC-230 corrections; mirrors. Examples: pages/family READMEs, GE-010,
  catalogue descriptions/reading links in existing gallery. No UI component.
- D2 adapters: Python GP-005/010/015/020/105/120 and affected framework guides;
  JS introduction/tutorial/writing/reference/troubleshooting/serverless guides.
  Correct stale remote claims and link shared explanations, preserve setup ownership.
- D3: all 38 teaching passes, c09–c14/b01/b03/b08/c08 first; bounded extensions to
  b01/b02/b03/b04, c02/c06/c10–c14 as mapped, optional advanced sections.
- D4 proposes three unallocated paired slots under controllers using GE-010
  NN_name keys/convention: c15 15_lifecycle (c03/c06/b08: hooks/cleanup/lookup),
  c16 16_attribute_projection (b01/b06/c04: template/mask/safe preview),
  c17 17_data_exchange (b09/c03/c06: save/restore/export, advanced transport).
  Names/files not implemented or accepted. Cache/RPC extend existing lessons.
- D4 Kajenn: GP-505 plus existing avatar test/site for environment lesson;
  no new auth implementation, follow owning repo instructions. Resource-group/
  named-event demonstration remains separate external genro-kajenn work.
- D5 c08: explained stages, RPC result/error, learner modification/self-check;
  preserve local lifecycle, SVG/freeze optional, compare c12/c14 alternatives.

Bounded proposal: 38 revised + 3 new = 41 common pages, not 41 implemented.
Environment pages separate; collections/static/custom hosting stay references.
Missing external resource demos/phase4/Q1/Q2 are explicit open dispositions.

D1 also corrected two §735 proposals (_userChanges and named connect_on), found
positive Kajenn auth evidence, templates/mask/srcdoc and symbolic-path gaps, the
GC-210 mask contradiction and stale c08 wording. Installed JS adapter still has
32 common examples; no qualification of current 38 implied.

Verification: catalogue/114 counterpart paths, 38 inventory rows/prerequisite
references/three unoccupied proposed keys, paired anchors/local references. No
example/adapter/runtime changed. Next: owner confirmation for D2; later lesson
changes need their own authorization, D6 evidence and didactic acceptance precede
stabilization phase 4.

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

Owner requested private gramlot-meta for shared development guidance and work
with fporcari. Reused the existing private
[repository](https://github.com/gramlot-org/gramlot-meta). Published 169 dated
snapshots (local analyses/plans/handoffs, worktree proposals, GC-196/future pairs),
paired GM-010 onboarding and GM-015 catalogue, provenance/source-state/SHA-256.
Preserved all originals and 655 earlier archive files. Canonical product authority
unchanged; no automatic sync or draft approval. Excluded recovery/session dumps,
dependencies, runtime code, environments, databases, packages and operational logs.

Verified: 824 hashes, 169 exact source copies, maintained guide links and three
paired anchor sets. Historical link gaps recorded. Both remote branches contain
`8c84920`; main is default; repository is private. fporcari has read access;
write access was asked separately, not assumed or changed. Shared collection
published; GC-196 port-scope review still pending. No runtime/release change.


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

Owner delegated the single-object publish choice, then requested complete syntax
preparation while implementing only part initially. Constitution 11.68 / GC-225
§040 now record selected `publish(topic, payload)` object shape, not all options.
[GM-020](https://github.com/gramlot-org/gramlot-meta/blob/main/docs/020-publish-subscribe-port.md)
and mirror in private meta contain 12 sections: decision ledger, callbacks/handles,
payload/provider context, Python/JS declarations, page/node/form scopes, complete
local/frame/window/page/user routing proposal, lifecycle/errors/typed/server
boundaries, intentional legacy differences, staged plan and chronological lessons.

Recommended first slice: page-local controller/formula; later node/rendered/button/
RPC, related browsers, server delivery; forms depend on framework form contract.
Scope/details still need review. Deferred capabilities must reject explicitly,
not silently no-op/fall back. No messaging runtime implemented.
Verified matching anchors/links, Python parsing, five JS syntax-only checks and
meta guide pairs. Shared proposal `28f5efe`; no runtime tests or release claim.
Core documentation only. Shared onboarding now records verified owner-authorized
fporcari write permission.


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

Owner authorized the correction after analysis of gramlot-py-server issue #16:
"puoi correggere?". Kajenn consumes `index` as a route selector; the adapter lost
that segment when reconstructing paths from route arguments. `Application.index`
now uses the request path already relative to the mount; `_RuntimeAssets.index`
forwards the unchanged request. No core or dependency contract changes.

Ten regression cases cover root/mounted applications, `index`/ordinary folders
including `assets/`, bootstrap URLs, JS/CSS, GET/HEAD, method/file rejection and
symlink escape. Before: six failures, four passing controls. After: 25 Kajenn
module tests and all 102 repository tests pass, plus Ruff/whitespace checks.
Environment: Kajenn 0.5.0, genro-routes 0.30.1, released core 0.2.17. One upstream
Starlette/httpx deprecation warning. Implemented and locally verified; owner
acceptance and source delivery/publication remain separate. No browser run or release.

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


<a id="gc-070-1185"></a>
## 1185 · Component release published and installed — 2026-10-17

The owner-authorized release in §1180 is published. All four release workflows
completed successfully, including their required test, browser, documentation,
package and installation gates:

| Repository / packages | Release | Successful workflow |
| --- | --- | --- |
| Core, Python and JavaScript | 0.3.0 | [39045160604](https://github.com/gramlot-org/gramlot/actions/runs/39045160604) |
| Shared examples, Python and JavaScript | 0.3.0 | [39046014939](https://github.com/gramlot-org/gramlot-examples/actions/runs/39046014939) |
| JS server, serverless and create | 0.2.11 | [39046309522](https://github.com/gramlot-org/gramlot-js-server/actions/runs/39046309522) |
| Python server, all five adapters | 0.2.9 | [39046314006](https://github.com/gramlot-org/gramlot-py-server/actions/runs/39046314006) |

Core is on PyPI, npm and JSR; examples are on PyPI and npm; integrations are on
PyPI/npm respectively. GitHub releases and version tags identify the published
sources. The JSR publish receipt is the successful official workflow log; a local
metadata request returning HTTP 403 is not counted as independent verification.

Release qualification corrected obsolete browser fixtures without weakening the
contract: html_button tests native submission, while Gramlot button does not
implicitly submit. The examples CI harness now loads declared collections/assets
and exercises each of w01–w25 in both authoring languages. Its final run passes all
71 Python and 71 JavaScript lesson behaviors. A transient npm propagation failure
in the JS integration was rerun successfully after examples became available.
No published package version was overwritten.

Fresh isolated installations from PyPI and npm resolve the released core, examples
and integrations. Python pip check reports no broken requirements. All 25 component
lesson interactions pass against both installed Python and Node galleries, including
relative w25 bindings, invalid drafts and asynchronous validation. These checks use
registry artifacts rather than linked working copies. The previously recorded local
Chromium/WebKit matrix and the expected upstream Builder failure remain as qualified
in §1175; no Firefox pass is claimed.

All four Read the Docs projects built successfully from their release sources.
After serverless publication, examples stable and latest were rebuilt as 35212135
and 35212142 so embedded lessons use the collection-aware exporter. The public
stable w25 page renders its components and completes remote validation, updating
both the field and accepted Data to NEWNAME. Public manuals contain 71 lessons
with Python and JavaScript sources. No separate DevTools extension release is
included in this release scope.


<a id="gc-070-1190"></a>
## 1190 · Hosted Python/Node galleries and offline download — 2026-10-17

Owner requests container-hosted Python and Node galleries with a serverless
archive available from both, then confirms: “Sì, usa gallery-py e gallery-js”.
Published https://gallery-py.gramlot.dev/ and https://gallery-js.gramlot.dev/ on
the existing Hetzner host, in the independent gramlot-galleries Compose project.
Python/Uvicorn and Node listen on host loopback ports 19182 and 19183. nginx
provides HTTPS and the same /downloads/gramlot-gallery-serverless.zip on both
origins. DNS and the new certificate were created for these two names only;
existing applications, deployment accounts and their configuration are preserved.
Certbot's existing active timer and nginx reload hook cover certificate renewal.

The gallery footer has an optional native download link. Python and Node gallery
commands accept --serverless-download; class properties are serverless_download_url
and serverlessDownloadUrl, following existing language conventions. The host owns
the static archive; there is no per-request export, new core API or DOM workaround.
Omission keeps ordinary local galleries unchanged. These bounded additions and
paired guides are local development changes packaged into the deployment images;
no replacement npm/PyPI release or source push was performed for this deployment.

Deployment assets/runbook are in the workspace deploy/galleries directory and
/opt/gramlot-galleries on the host. The Python image is
sha256:1eacf3d9d8e46e70755fcf425bfdcff96153f38c785275a60b1f0bd69a90ee1a;
the Node image is
sha256:6c1821999966b618934f983cbb6b4c1cb901990cd4eb0dc79c39ea5b8067efd5.
Both run as non-root with read-only filesystems, bounded temporary storage and
resource limits. Updates are manual; no automatic deployment credentials or jobs
were introduced.

The shared ZIP contains the published serverless gallery and 72 examples, a README
and exact package-version receipt. It is 26,606,055 bytes with SHA256
f86cb02b1a5342d323cfbb93e74754aee57eb80d05460f3239deb1a5d71cf856.
Users unzip it and open index.html; page/endpoint execution uses JavaScript Workers,
not a bundled Python or Node server. Both public downloads match that checksum.

Verification: gallery JS suite and 17 Python tests pass; adapter gallery/CLI tests
pass; all paired manuals build and their identity/link checks pass. The 25 component
interactions pass against each real container and from the offline directory.
Public HTTPS checks verify the visible footer link and w25 invalid-draft/last-valid-
Data behavior with asynchronous validation on both origins. Both container health
checks pass. The release versions and registry receipts in §1185 remain unchanged.


<a id="gc-070-1195"></a>
## 1195 · Automatic gallery updates after releases — 2026-10-17

Owner: “si confermo, dopo ogni release dei quattro repo. procedi anche a includere il link di download nei pacchetti ufficiali”. This supersedes §1190's manual-update policy. The bounded deployment is owned by gramlot-examples/deploy/galleries; core runtime and dependency direction are unchanged.

The host checks public stable releases every ten minutes, requiring successful publication workflows and matching npm/PyPI versions in all four repositories. It builds both containers and the ZIP from uncapped official packages, checks resolved versions against the release set, verifies candidate browsers and offline output, then promotes both upstreams and one immutable ZIP through nginx. Failure restores the preceding nginx configuration. No GitHub SSH credential or webhook listener is introduced.

Published and verified: official download-link patches (examples 0.3.1, JS packages 0.2.12, Python server 0.2.10) and the first automatic deployment. Core remains 0.3.0. Local checks pass: examples JavaScript and 17 Python tests; Python adapter suite 102; JS server 33, serverless 35, scaffold 3, plus Bun; deployment gate/archive/rollback tests 12. Both adapter manuals compile successfully. Initial test-environment restrictions were resolved by allowing local sockets and refreshing the old examples Python environment from official packages.

All three release pipelines succeeded (examples 39059652682, JS 39059940631, Python 39059937448). The Python browser job was retried after the new examples wheel propagated to the package index; no dependency was pinned or downgraded. The final automation commit c8b6f12 also passes both branch CI runs.

The enabled systemd timer and service are gramlot-galleries-update.timer/service. First registry-only generation 20261017T190256Z is active on slot 1 (loopback 19184/19185). Both containers are healthy. Browser checks pass on both candidates, the offline file export and both public HTTPS origins: all 25 component lessons start, textbox binding and invalid-draft/async-validation interactions work, and the hosted footer link is present. Both public ZIP downloads match SHA256 60413953c15faac5e180fb8525efbcb55ce509c260b3f4aa59898487d3431518. The preceding manual containers stopped only after promotion succeeded; their images/config/archive remain available.

The updater records current.json and per-generation receipts on the host, excludes simultaneous updates, reuses already verified release checks, and bounds only its dedicated BuildKit cache. No unrelated service or cache is changed. Existing page sessions may require a reload after a deployment. Instructions and tested automation are maintained in gramlot-examples/deploy/galleries; the updater does not automatically replace its own control scripts.

<a id="gc-070-1200"></a>
## 1200 · New public welcome website — 2026-10-17

Owner requested www.gramlot.org from scratch, using design skills, including
validation, server choices, current/planned widgets, gallery language differences,
inspector, comparisons and official repo/manual links; no Rosetta. Bounded work
in gramlot-site/welcome; no framework or gallery-updater changes.

Seven static English pages, searchable 22-component catalogue, dedicated
validation page and actual gallery screenshots. Historical README/pipeline remain
labelled as history; prior README note preserved. Published HTTPS generation
20261017T192720Z at /var/www/gramlot-site/current. SHA256:
c905bc77c6118a41148e2b09675a67df1aab23b813248a287728471e23d97544.
Only www nginx serving changed. Prior config/container retained; other hosts,
certificates, gallery services and timer unchanged. Immediate reload probe first
restored the old config; retry awaited worker transition and succeeded.

Local/public Chromium + WebKit: all seven pages at 390/768/1440, images, overflow,
menu/Escape, search, disclosures pass. No-JS mobile navigation/catalogue pass.
Static links/fragments/assets/metadata, sitemap/robots/redirects and true 404 pass.
External manuals/repos/gallery/download links checked; two npm pages block HEAD.
Comparisons cite primary docs. Implemented, verified and published; visual owner
acceptance pending. CI-triggered gallery updating remains a separate proposal.


Homepage visual follow-up — owner found the validation-error hero unclear.
Replaced it with an actual valid Customer group from gallery w20 and its textbox
Python declaration. The complete form is visible without crop or overlay; the
validation error screenshot remains on the dedicated validation page. Chromium
and WebKit desktop/mobile checks and static checks pass; public HTTPS hero/image
and example link verified. Deployed generation 20261017T193724Z; previous
20261017T192720Z retained for rollback.


<a id="gc-070-1205"></a>
## 1205 · Responsive gallery — 2026-10-17

Owner-approved scope: full-width example, off-canvas navigation and separate
Esempio / Codice / Inspector views in both Python and JS galleries, preserving
Data. Below 1024 CSS pixels the existing panels switch presentation; the same
iframe and inspector remain mounted. Navigation closes on selection (including
the current page), backdrop or Escape and manages keyboard focus/inert content.
Wider windows restore desktop sidebar preferences. Normal preview now uses
automatic touch detection; explicit Mobile preview still forces touch sizing.

Owned core additions: Python/JS server HTML declares the device-width viewport
(already present in serverless); the optional inspector supports dynamic
`docked` presentation and hiding without disconnecting. Touch presentation has
larger rows, tabs and splitter, with visible breakpoint affordances on devices
without hover. No Builder/Bag/adapter source changes or parallel page state.

Verification: core Node suite 3,541 passed in sandbox; the only three failures
were loopback permission denials and all three conformance tests passed when
rerun with local-network permission (3,544 total). Core Python server tests
16 passed. Inspector 30 tests plus Chromium/WebKit existing browser qualification
pass. Examples Node suite 98 passed; targeted gallery rerun 29 passed.
Python declaration regression and full example suite: 18 tests passed. Real Chromium and WebKit on Python (8235) and Node
(8237) pass 320/390/768/1023px, full-width panels, drawer dismissal, same iframe
and Data, inspector edits/selection, rejected widget draft retention, and a
round trip to desktop. Existing desktop layout/resize/preferences qualification
also passes on both hosts and engines. WebKit is not a physical iOS Safari test.

Implemented and verified locally; owner visual acceptance and a coordinated
core/examples release remain pending. Hosted galleries and their downloadable
ZIP still use published packages. No release, push or production deployment was
performed for this increment. Preview URLs: http://127.0.0.1:8235/ (Python),
http://127.0.0.1:8237/ (Node).


Release authorization — 2026-10-17: owner confirmed “si procedi con bump, commit, push e pubblicazione di core ed esempi e verifica che si aggiornino entrambe le gallery online e lo zip serverless”. Core patch and examples patch publication, main consolidation, hosted-gallery update and regenerated serverless ZIP are authorized. Release and deployment verification are complete; §1210 supersedes the earlier publication-pending statement for this coordinated increment.


<a id="gc-070-1210"></a>
## 1210 · Responsive gallery publication receipts — 2026-10-17

Historical record. Owner authorization is recorded in §1205. Published core
0.3.1 on PyPI, npm and JSR, and examples 0.3.2 on PyPI and npm. Release commits
are `af01784` and `772bee2`, respectively; both were consolidated into main and
pushed with their annotated version tags. No adapter release was required.

- [Core release and assets](https://github.com/gramlot-org/gramlot/releases/tag/v0.3.1),
  [successful publication](https://github.com/gramlot-org/gramlot/actions/runs/39065912112).
- [Examples release and assets](https://github.com/gramlot-org/gramlot-examples/releases/tag/v0.3.2),
  [successful publication](https://github.com/gramlot-org/gramlot-examples/actions/runs/39066293003).

All required release tests pass. The examples Python 3.11 job initially ran
before the new core propagated to its PyPI index; the failed job and the same
branch checks passed on retry without code changes. Downloaded release checksums
pass; core wheel/npm runtimes match, as do examples wheel/npm gallery styles.

The existing hosted updater promoted generation `20261017T202810Z`, slot 0,
after checking the resolved package versions, all 25 component pages, binding,
validation and remote validation in Python, Node and file-based serverless, then
repeating hosted checks through both public HTTPS origins. An earlier attempt
resolved the old examples wheel while PyPI was propagating and stopped before
promotion. Previous generation `20261017T190256Z` remains available for rollback.
The update timer was restored and is active; deployment used the existing
service, not a new CI-triggered deployment mechanism.

Both https://gallery-py.gramlot.dev/ and https://gallery-js.gramlot.dev/ serve the
new core/examples versions. Downloads from both hosts are identical, 27,153,602
bytes, SHA-256:
`c1bfe0e4f37afa95ed6f41f63d87ee1d6067c48fd811b79ef0f9b294cd8cbc3b`.
The archive's actual packaged-version receipt includes core 0.3.1, examples
0.3.2, Python server 0.2.10 and JS server/serverless 0.2.12.

Post-publication Chromium and WebKit checks pass against both public galleries
and the downloaded ZIP opened directly with `file://`: 320/390/768/1023px,
full-width example/code/inspector, drawer dismissal, the same iframe and Data,
inspector edit/selection, rejected input draft retention and desktop round trip.
The browser qualification now waits for the asynchronous gallery mount before
checking initial visibility and recognizes file-based example paths. This is a
test-only follow-up; released runtime artifacts are unchanged. WebKit engine
qualification is not a physical iPhone/iPad Safari test. Release, deployment and
verification are complete.


<a id="gc-070-1215"></a>
## 1215 · English gallery labels — 2026-10-17

Owner requested all gallery labels in English and publication to both hosted
galleries and the serverless ZIP. Python/JS gallery captions and paired guides
now use Example / Code / Inspector and Normal / Mobile. Core component-guide
references are aligned; no core runtime or dependency change.

Completed: examples 0.3.3 published on PyPI/npm from commit `2c0d148` and tag
`v0.3.3`, consolidated on main. Local tests: 98 JavaScript and 18 Python passed.
All release CI gates passed, including browser checks of every page and docs:
[publication run](https://github.com/gramlot-org/gramlot-examples/actions/runs/39067766196).
Downloaded wheel/npm checksums and their English gallery captions were verified.

Both public galleries now run generation `20261017T204807Z`, with core 0.3.1,
examples 0.3.3 and unchanged server integrations. A first installation attempt
resolved the old wheel during PyPI propagation and stopped before promotion;
the successful attempt passed all 25 component-page/binding/validation checks
on Python, Node, offline files and public HTTPS. Previous generation retained;
update timer active.

Both public ZIPs are identical (27,153,615 bytes), SHA-256
`2bec23b2b92184edc67f4c398779dc595e837393d69eb2eecd515406af4414d5`.
Chromium and WebKit checks passed on both public galleries and the downloaded
ZIP opened with file://, explicitly asserting Example / Code / Inspector and
Normal / Mobile, as well as the existing mobile/desktop state-preservation
checks. Physical iOS testing remains outside this verification. Publication
and deployment are complete.


<a id="gc-070-1220"></a>
## 1220 · CI-triggered gallery updates — 2026-10-17

Owner authorized replacing the ten-minute timer with deployment directly after
successful publication in all four repositories. Published matching independent
workflow_run workflows; core does not depend on an integration checkout/action.
The server updater queues concurrent events with its file lock and handles
duplicate events as no-ops. A bounded wait retries only registry/readiness and
installed-version races; build/browser failures remain visible failures.

Local verification: 21 deployment/security-entry tests passed; Python adapter
102 tests; JS server 33 Node and 33 Bun tests, serverless 35, create 3. Workflow
YAML, publication gates and shell syntax pass. Documentation updated.

Owner explicitly approved the restricted infrastructure access: “Sì, autorizzo
questo accesso ristretto”. This resolves the preceding automatic approval-review
block. Restricted access is installed and verified: separate repository keys,
main-only deployment environments, forced command, no command arguments, shell,
uploads or forwarding. Server scripts match the reviewed repository hashes.

All four manual CI probes succeeded: core [39070151062](https://github.com/gramlot-org/gramlot/actions/runs/39070151062),
examples [39070153518](https://github.com/gramlot-org/gramlot-examples/actions/runs/39070153518),
Python server [39070155739](https://github.com/gramlot-org/gramlot-py-server/actions/runs/39070155739),
and JS server [39070158048](https://github.com/gramlot-org/gramlot-js-server/actions/runs/39070158048).
Re-running only the idempotent npm job of the existing core publication skipped
its already-published package and generated a real successful `workflow_run`
deployment: [39070194955](https://github.com/gramlot-org/gramlot/actions/runs/39070194955).
These were unchanged-release no-ops, confirming the event and restricted access
without rebuilding an already verified generation or republishing packages.

The old timer was disabled and removed: systemd reports `not-found` / `inactive`.
The manual operator service remains available. Production generation remains
`20261017T204807Z`. Both public ZIP downloads passed integrity/version checks
and have SHA-256 `2bec23b2b92184edc67f4c398779dc595e837393d69eb2eecd515406af4414d5`.
Implementation and operational verification are complete; no package bump was
needed. CI/operations changes are published on main and develop in all four repos.


<a id="gc-070-1230"></a>
## 1230 · Container analysis for 0.4 — 2026-10-18

Block ID: **GC-070-1230**.

Owner requested analysis of legacy/Dojo and PoC border, tab and stack containers, then clarified that layout/selection should use dimensions and visibility without replacing or reparenting content, Source or business Data. This presentation constraint is recorded in the constitution; detailed APIs remain proposed.

The paired [GM-035 analysis and proposal](https://github.com/gramlot-org/gramlot-meta/blob/develop/docs/035-containers-0-4.md) is prepared locally in the private shared repository (not yet pushed by this task). It traces Python Source construction, Genro wrappers and installed patches, vendored Dojo geometry/selection/close/load behavior, PoC differences, modern CSS responsibilities and a staged qualification plan. Ordinary legacy selection already retains widgets; actual Genro header close instead pops Source, bypassing the upstream closeChild path. CSS can replace recursive geometry propagation without introducing a content-state cache.

Verification: the existing PoC stack/container suites passed 22 tests, zero failures (jsdom); source revisions and paths are recorded in GM-035. This is not new core/browser qualification. A concrete integration gap is the current input-value-specific ControlAdapter: panel-selection bindings need a bounded core design, not an application bridge.

Completed: investigation and proposed contract. Pending: owner review of the public surface, then implementation and browser/cross-host qualification. No new runtime, dependency edit, release or deployment in this increment.


Container follow-up, 2026-10-18: owner requests preserving legacy drawer behavior and analysis of splitter_* and framePane. GM-035 §060 records verified drawer open/close, fixed-versus-draggable handle and drawer_* forwarding, plus Python autoslots and browser frame-to-border expansion. Region metadata belongs to the parent layout relationship, not exclusively contentPane. The exact legacy splitter_* forwarding implementation remains unlocated; no parameter list is claimed verified. No runtime implementation.


Container syntax review, 2026-10-18: GM-035 §065 now retains the owner-confirmed legacy parameters, drawer and framePane. Verified the source-viewer Python example's drawer position/size/class/style controls and the wrapper's style precedence/callback handling. Generic splitter_* is no longer a required port surface, following the owner's clarification. Complete Python review examples prepared and syntax checked; no implementation started.


Container simplification, 2026-10-18: owner chooses always-live resizing without a public liveSplitters parameter. Paired GM-035 contract and Python review examples updated and syntax checked; historical Dojo behavior retained as evidence. Runtime implementation remains pending.


Border-first scope, 2026-10-18: paired GM-035 §075 includes splitter_* customization alongside drawer_* and focuses the proposed first increment on borderContainer; tab/stack/frame follow. Always-live resizing remains unchanged. Checked README and Python/JS manifests: 0.3.1 is current and marked released; 0.3.2 is only a proposed next patch, not a version change. Contract examples syntax checked; implementation still pending syntax review.

<a id="gc-070-1235"></a>
## 1235 · BorderContainer first increment — 2026-10-18

Block ID: **GC-070-1235**.

Owner explicitly authorized borderContainer for the intended 0.3.2 increment,
including always-live splitters, splitter_* customization, legacy drawers,
connected gallery examples and tests. This supersedes the implementation-pending
status in §1230 for this bounded scope only; tab/stack/framePane remain deferred.

Implemented: layout collection borderContainer/contentPane, nested CSS grid
regions, headline/sidebar, numeric splitter limits, pointer capture and keyboard
resizing, open/closed fixed or draggable drawers, drawer_* placement/style and
activated drawer_onclick, optional session-cookie sizes with stable container id.
Resolved Source attributes supply parent-owned region configuration; normal
layout/toggle/resize preserves mounted content, iframe contexts, drafts and Data.
No dependency source edits, duplicate Data writer or application DOM workaround.
Public contract: GC-105 §100. Destination record: PORT-0014.

Review found and fixed a bundle-boundary defect: a module-local region WeakMap
cannot be shared implicitly between the runtime and separately bundled layout
collection. Projection now enters the registered component class's static
projectChild method and keeps state in the collection. The core browser verifier
loads that collection as a separate module, matching the production bootstrap.
A second review fixed aria-disabled inheritance that blocked reopening a drawer.

Verification: core JavaScript full suite 3,548 passed; Python 165 passed, one
pre-existing expected failure and 264 subtests. Four focused border tests cover
Source-driven updates, drafts, all-axis keyboard bounds, fixed drawers, callbacks,
placement and cookie restore. Chromium and WebKit passed four-direction live drag,
nested geometry, drawer cycles, retained invalid drafts/Data/iframe contexts,
viewport resize, keyboard and reactive styles. The browser check is added to CI.

Gallery: l01 Border regions and drawers and l02 Nested borders and layout designs,
Python first with equivalent JavaScript. Full gallery suites: 100 JavaScript and
18 Python tests passed (87 Python subtests). Both new examples passed editing and
layout interactions on Python, Node and file:// serverless in both browsers
(12 combinations). Core public docs build with warnings as errors and link/anchor
checks passed; examples docs passed for 73 lessons and two paired guides.
Local serverless verification refreshed an obsolete installed exporter to the
current local adapter checkout; no adapter source changes were necessary.

Implemented and locally verified; visual owner acceptance remains separate.
The Python gallery is available locally at http://127.0.0.1:8243/ under Border
layouts. No version bump, commit, push, package publication or deployment was
performed by this increment. Target 0.3.2 remains unreleased.

<a id="gc-070-1240"></a>
## 1240 · Rounded nested border qualification — 2026-10-18

Block ID: **GC-070-1240**.

Owner requested: “ok aggiungi l'esempio con rounded, container annidati e drawer sui quattro lati e verifica che angoli, splitter e popup funzionino bene prima di chiudere la 0.3.2”. Added gallery l03, Rounded borders and popups, Python first and equivalent JavaScript, with explicit 24px outer / 16px inner radii, headline/sidebar selection, four live splitters/drawers, calendar, filteringSelect and validation feedback. It uses existing Source/Data and components; no application DOM wiring or new rounded-mode API.

No production runtime correction was needed: existing border clipping respects CSS radii, and native top-layer popovers remain interactive beyond rounded ancestors. The JavaScript example's initial civil date was corrected to UTC midnight to follow the existing date contract. Documentation records that popup placement remains bounded by the browsing viewport, including an iframe.

Verification: extended the existing CI core browser fixture with outer/nested radii and real popup controls. Chromium and WebKit pass all four corner hit tests, previous four-axis live drag/keyboard/iframe/draft checks, drawer reopening and calendar-day selection outside the inner rounded outline. Dedicated gallery verifier passes Python, Node and file:// serverless in both browsers (six combinations), including both layout designs, four-sided live resize, drawer cycles, calendar controls beyond the inner outline, choice commit, top-layer validation message, rejected draft/Data retention and narrow-screen handle reopening. Screenshots inspected for desktop calendar and narrow layout. Full gallery suites: 101 JS tests and 18 Python tests with 88 subtests, all passing. Public docs checks pass: core 11 pages; gallery 74 lessons/two paired guides. Full-gallery l03 navigation passed with no browser errors.

Local gallery http://127.0.0.1:8243/ now includes l03 under Border layouts. Implemented and verified; owner visual acceptance is separate. No release bump, publication or deployment performed.

<a id="gc-070-1245"></a>
## 1245 · Border visual feedback and shared rounded binding — 2026-10-18

Block ID: **GC-070-1245**.

Owner's four-point feedback asks for removing the outer blue menu-selection frame,
a slightly inset rounded dropdown, distinguishable regions, drawer styling checked
against legacy, and `rounded='^rounded'` driven by a slider for outer/inner borders.
Implemented the bounded visual follow-up; no publication authorization inferred.

Legacy evidence: GenroPy fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea,
gnrjs/gnr_d11/css/gnrbase_css/09_gnr_dialogs_forms.css lines 66–127, plus
resources/common/gnrcomponents/source_viewer/source_viewer.py lines 33–37.
Drawer handles attach to the separator, omit the joined border and round only the
protruding corners. Gramlot now uses that shape, slim unlabelled handles and compact
labelled tabs with theme-controlled font/padding. Explicit drawer_* styling remains
available. This replaces the initial generic rounded-button presentation.

ChoiceEditor and native-select focus is a neutral inset indicator. Shared popup
geometry accepts an inset; ChoiceEditor defaults to 2px per side through a theme
token. Native operating-system select popup sizing is unchanged; l02/l03 use the
existing filteringSelect for predictable popup styling. All three layout examples
now distinguish side/header/footer surfaces from their center with theme colors.

The Builder already implements rounded as a numeric-pixel style macro. No new
macro or dependency change: l03 explicitly binds both borders to the same Data
value and a live horizontalSlider, including zero. This does not introduce
implicit radius inheritance. Tests check both radii and stable element identity.

Verification: core full JS suite 3,548 passed. Gallery full suites 101 JS and
18 Python tests passed (88 subtests). Extended core browser qualification passes
Chromium/WebKit. Gallery l01/l02 pass Python/Node on both engines; updated l03
passes Python/Node/file:// serverless on both engines, including slider keyboard
changes, matching radii, neutral focus, popup inset, corner clipping, live drag,
retained drafts and four drawer reopening on a narrow viewport. Mimi/Joanna
screenshots reviewed. Public documentation builds and checks pass: core 11 pages,
gallery 74 lessons/two paired guides.

Local gallery restarted at http://127.0.0.1:8243/. Implementation and local
verification complete; visual owner acceptance remains separate. No version bump,
commit/push, package publication or deployment in this follow-up.


<a id="gc-070-1250"></a>
## 1250 — Discreet container controls and explicit region boundaries (2026-10-18)

Owner request: gallery section “containers”, thin/discreet drawer handles with
hover tooltips rather than buttons, less invasive default splitters, and visible
region borders instead of relying on similar grey backgrounds. This supersedes
the visible text tabs used in the first gallery examples of §1245.

Implemented: the gallery section is **Containers** (the layout collection and
route keys remain stable). Shared defaults are 1px separator lines and 4×28px
drawer grips, rotated by side. Transparent hit areas retain pointer/touch access;
the touch target does not enlarge the painted grip. Existing drawer_title sets
the tooltip; otherwise it describes the open/close operation. Explicit
splitter_*/drawer_* styles and opt-in drawer_label remain supported. Python and
JavaScript examples l01–l03 use tooltip grips and explicit region boundary lines.

Verified: 3,548 core JS tests; 101 gallery JS tests; 18 gallery Python tests with
88 subtests. Chromium/WebKit pass core border qualification, including thin
geometry, tooltip text, larger touch hit targets, live resizing, keyboard,
retained draft/Data/iframe, rounded clipping and top-layer popups. Gallery
l01–l03 pass Python/Node browser checks; l03 passes file:// serverless on both
engines. Actual gallery section title and default geometry verified; Mimi light
and Joanna dark screenshots inspected. Gallery documentation build/check passes
for 74 lessons and two paired guides.

Local gallery refreshed at http://127.0.0.1:8243/. Implementation and verification
complete; owner visual acceptance remains separate. No version bump, commit,
push, release or deployment in this follow-up.


<a id="gc-070-1255"></a>
## 1255 — Drag the splitter from its drawer handle (2026-10-18)

Owner request: “c'è un'attesa psicologica di poter draggare lo splitter anche
trascinando la relativa etichettina” (spelling normalized). An open region with
splitter=True now accepts live resizing from its drawer grip or label. The
existing region drag lifecycle owns capture and cleanup. A 4px axial threshold
separates click jitter from dragging; releasing a drag does not toggle the drawer
or invoke drawer_onclick. Ordinary click and keyboard activation still toggle;
closed drawers and splitter=False retain ordinary click behavior. No new API.

Verified: all 3,548 core JS tests and four focused border tests pass. Extended
Chromium/WebKit qualification covers live handle drags on all four sides, no
release toggle, subsequent click, Enter activation and 2px click jitter without
resize, alongside existing draft/Data/iframe and popup checks. The actual local
gallery also passes handle drag/click checks in Mimi light and Joanna dark after
rebuilding its separate layout collection bundle. Local gallery remains on 8243.
No version bump, commit/push, publication or deployment.


<a id="gc-070-1260"></a>
## 1260 — Keep narrow navigation open for section browsing (2026-10-18)

Owner report: in narrow/auto-hiding navigation, clicking a section closed the
sidebar and made its examples inconvenient to reach. Fixed in the shared gallery
mobile presentation: section-summary links are excluded from page-link dismissal,
and selecting a category introduction keeps the menu open and does not move focus
to the covered content. Example selection/reselection, Escape and backdrop still
close navigation. Desktop index behavior and iframe/Data ownership are unchanged.

Verification: all 102 gallery JS tests pass, including a regression covering new
and active section selection, native summary collapse/expand and example
selection/reselection. Full mobile browser qualification passes Chromium/WebKit
against Python (8243) and Node (8244), covering 320–1023px, section browsing,
view changes, inspector editing, retained Data/drafts/iframe and desktop return.
Gallery bundles rebuilt; paired GE-010 §205 updated. No release or deployment.


<a id="gc-070-1265"></a>
## 1265 — Pull closed drawers open and inflate handles on hover (2026-10-18)

Owner feedback: closed drawers could not be dragged; requested enlarging the
handle on hover with a “gonfiare” transition. This supersedes the closed-drawer
click-only limit in §1255 for regions with splitter=True. Pulling the handle
inwards opens and sizes the region from its collapsed extent, respecting the
existing size limits. Opening invokes drawer_onclick once; release does not
re-toggle. Splitter=False remains a fixed-size click drawer.

Shared CSS grows the grip towards the content over 160ms (subtler scaling for
explicit text labels), without changing layout tracks; reduced-motion disables
the transition. The closed resizable handle also has the resizing cursor.
No additional public parameters or application Data state.

Verification: all 3,548 core JS tests pass. Extended Chromium/WebKit browser
qualification covers closed-drawer dragging on all four sides, live opening and
sizing, stable release, hover growth without layout change and reduced-motion,
plus the earlier click/keyboard/draft/iframe/popup checks. Gallery collection
bundles rebuilt; actual gallery checked in Mimi light and Joanna dark, including
pulling the closed handle open. Local gallery restarted on 8243. No release,
version bump, commit/push or deployment.


<a id="gc-070-1270"></a>
## 1270 — Themeable drawer variants and gallery lesson (2026-10-18)

Owner instruction: “ok procedi con le variabili css e aggiungi nella gallery
esempi con icona, testo ruotato e testo che compare quando la maniglia si gonfia
in hover, senza spostare il contenuto. su touch lascialo visibile”.

Implemented in the shared BorderContainer: configurable resting dimensions,
opacity, hover scales, timing/easing, hit target and reveal dimensions, alongside
existing colors/font/padding/radius tokens. Existing drawer_class selects
shared drawer-rotated and drawer-reveal presentations; drawer_label supplies an
emoji or text. The stable inner label span supports clipping/fade independently
of the pointer target. Hover/focus only animates the handle. Native touch media
and the existing Mobile-preview touch token keep reveal text visible.
Reduced-motion disables both growth and fade. Explicit drawer_* styling remains
supported; no alternative component, event state or application DOM wiring.

Gallery l04, Drawer icons and labels, provides equivalent Python/JavaScript
pages with an icon, rotated text and vertical/horizontal hover-reveal handles.
It includes a closed drawer and a retained editable value. CSS customization is
shown in Source and documented in GC-105/GE-010 and their compact mirrors; names
are recorded in GC-225. Gallery now has 75 lessons and 76 routes including index.

Verification: 3,548 core JS tests; 103 gallery JS tests; 18 gallery Python tests
with 89 subtests, all passed. Core Chromium/WebKit qualification covers reactive
label/class projection, theme size overrides, reveal, keyboard operation, touch
media/preview, stable geometry and existing drag/popup/data behavior. Gallery
l04 passes Python, Node and file:// serverless on both engines; full gallery
Normal/Mobile checks preserve iframe identity and Data in Mimi light and Joanna
dark. Screenshots inspected. Public documentation builds/checks pass: core 11
pages; gallery 75 lessons and two paired guides.

Local Python gallery refreshed on 8243; Node verification gallery on 8244.
Implementation and verification complete, visual owner acceptance separate.
No version bump, commit/push, publication or deployment.

<a id="gc-070-1275"></a>
## 1275. Borderless reveal grips — 2026-10-18

Owner correction: "vedo soltanto l'etichettuna grigia ... se ci vado sopra si gonfia fino a mostrare il testo", "non metterei mai un bordo", and "non vorrei il doppio bordo". All four Python l04 handles now rest as gray grips, reveal on hover/focus and stay visible on touch. Removed handle inset stroke and blue focus outline; expansion/contrast signal keyboard focus. CSS relative color derives white captions on dark fills and dark gray on pale fills, with the existing explicit color override. The search symbol is monochrome so it follows that color. Removed duplicate example region borders alongside the splitter.

Owner testing scope: "d'ora in avanti fai sempre solo le prove inpython ... fino ... release finale". Iterative verification uses the Python gallery only; Node/serverless qualification and JS example alignment are deferred until final release preparation. No publication authorized. Current visual correction awaits owner acceptance.

Verification: Python gallery 8243 passed Chromium and WebKit checks for all four grips, no border/shadow/outline, dark/light automatic contrast, stable content geometry and Data, closed-handle dragging, keyboard, real touch and Normal/Mobile preview. Screenshot reviewed. No Node or serverless run.

2026-10-18 follow-up: owner requests thinner rotated labels with more space at their ends. Shared rotated-reveal padding is now 8px 2px; Python l04 uses 20px by 88px expanded grips. Desktop rest remains caption-hidden; touch or keyboard focus intentionally reveals it.

The owner also requests a slightly smaller presentation; Python l04 sets the existing drawer font-size token to 11px (was 12px), retaining the mouse/touch hit area.

Padding/scale follow-up verified on Python gallery 8243 in Chromium and WebKit: reveal/contrast, fixed content geometry, retained Data, keyboard/drag and touch/Mobile preview passed. Desktop captions are hidden at rest; screenshot reviewed. No Node/serverless qualification.

<a id="gc-070-1280"></a>
## 1280. Separate drawer icon and caption — 2026-10-18

Owner: "ok separa drawer_icon e drawer_label: icona sempre visibile e testo a comparsa con drawer-reveal. aggiorna il contratto e l'esempio nella gallery python". Source projection now separates drawer_icon from styling and drawer_label; a stable icon span stays visible while the caption reveals. The icon-size CSS token reserves its resting area. Existing label-hover-scale also controls reveal zoom (subtle 1.04 default, 1 disables zoom independently of expansion). Python l04 shows persistent search icon plus revealing Search caption with zoom disabled. JS example alignment remains deferred to final qualification as recorded above.

Verified on Python gallery 8243 with Chromium and WebKit: icon visible before/during/after caption reveal; zoom disabled at scale 1 while width still expands; no content movement or Data loss; closed drag, keyboard, touch and preview checks passed. Screenshot reviewed. No Node/serverless tests or publication.

<a id="gc-070-1285"></a>
## 1285. Simple drawer authoring defaults — 2026-10-18

Owner explicitly confirms drawer_minimize and asks to implement the agreed defaults, update the contract and Python gallery. Parent-owned drawer_minimize is boolean/read-bound, default false. Ordinary captions are small, visible, intrinsically sized and rotated automatically on lateral regions. Minimized captions reveal on hover/focus, stay visible on touch, and never hide the independent icon. Internal presentation classes now derive from Source parameters rather than author class strings. Explicit CSS remains optional.

Python l04 compares default left/bottom captions with minimized top/right captions and a persistent search icon, removing all presentation classes and CSS sizing from the page. Updated constitutional/public/naming contracts. Python-only Chromium and WebKit verification passed: visible/default versus hidden/minimized captions, rotation, icon, contrast, zoom opt-out, retained geometry/Data, keyboard, closed drawer dragging and touch/preview behavior. Screenshot reviewed. JS example alignment/final environment qualification are deferred until final release preparation. Visual owner acceptance and release remain separate.

<a id="gc-070-1290"></a>
## 1290. Nested regions Python playground — 2026-10-18

Owner requests opening l04 and adding a highly dynamic example with many nested border containers, widgets and sliders driving region sizes. l04 was opened in the existing Python gallery. New Python development lesson l05 contains five borderContainers across three levels, seven compact size sliders with reactive pixel labels, shared rounded/design/minimize controls, textbox validation, radio choices, switches, date/calendar, filteringSelect, number editor and shared notes. Ordinary regions.* Data paths feed width/height through :{}px. No new regions API or manual application DOM/events was introduced. Splitter dragging remains local geometry rather than writing slider Data back, explicitly explained in the lesson.

The Python catalogue now has 76 lessons / 77 routes. This new lesson has no JS counterpart yet: Python-first iteration was requested; final Node/serverless alignment is a release prerequisite. No publication performed.

Python gallery Chromium/WebKit checks pass: five containers render, all seven sliders reach both numeric geometry limits, invalid customer draft stays in the widget while Data preserves its accepted value, notes and component/DOM identity survive resizing and ancestor drawer toggles; radius and minimize remain reactive. Screenshot reviewed. Durable browser qualification is in the examples repository's verify_nested_regions_browser.mjs. Awaiting owner's visual feedback, without beginning another phase.


<a id="gc-070-1295"></a>
## 1295. Stack/tab selection and legacy notification analysis — 2026-10-18

Owner asks to investigate stackContainer/tabContainer while reviewing the Python border gallery, recalling legacy container publishes. Read-only runtime investigation completed; paired GM-035 §085–090 records evidence and unapproved proposals. No new container implementation or event API approval.

Legacy Stack owns selection and Tab extends it; PoC reverses that hierarchy and hides the tab bar for Stack. Legacy container-local hiding/showing/selected publishes differ from Dojo's internal widget topics. selected may be emitted separately for each bound selection attribute, an incidental duplication to avoid reproducing without an explicit contract. Border publishes pane-local closable_change for the separate closable-side mechanism; splitter completion writes a bound regions Bag and triggers fakeResize, leading to global gnrWindowResize. The inspected drawer handler only invokes optional drawer_onclick; it does not unconditionally publish a drawer event.

Proposed direction: shared selection responsibility, retained mounted panels, selectedPage/pageName and selected grammar, existing Gramlot publish/subscribe/controller integration, explicit distinction between incoming commands and outgoing state notifications. Border event names/payloads/timing and regions-Bag orchestration remain to review with the owner. Current l05 regions.* paths are ordinary Data bindings and do not receive splitter writes. No runtime changes or new test runs for this documentation-only analysis. Python gallery visual review remains ongoing; Node/serverless alignment and release qualification remain deferred.


<a id="gc-070-1300"></a>
## 1300 · Public website editorial expansion — 2026-10-18

Owner requests a much larger site, progressive explanations/demo, serverless offline forms and JSON-to-PDF handoff, binding, controllers, remote blocks and endpoints; also expresses interest in an AI presenter video. Bounded gramlot-site editorial work only; no new framework capability, PDF service or deployment authorized.

Implemented 30 English pages in welcome: original seven, six tour chapters, eight feature articles, three scenarios, three hubs, serverless, start and questions. Internal homepage calls to action, next-step links and keyboard-native predictions keep the learning journey on site. Illustrations are labelled; actual gallery captures and external working lessons remain distinct. Evidence: GC-095/105/025, gallery lessons and GS-135. Explicit boundaries: JavaScript-only Worker pages; TYTX draft round trips versus JSON interchange; PDF receiver/output handling are application work; no automatic persistence/sync or complete PDF product. No new runtime behavior or promotion of unreleased containers.

Verified: static links/anchors/assets/metadata, sitemap and homepage reachability; Chromium/WebKit each pass 90 responsive checks (390/768/1440), 30 no-JS routes, full tour, keyboard disclosures, navigation and filtering. Representative screenshots inspected; 14/14 official guide/gallery destinations HTTP 200; installed 42-file build matches preview. Repeated WebKit local navigation may validly return HTTP 304, handled by the checker alongside rendered-content verification. No framework tests required for editorial-only changes.

Eight-scene English video script/storyboard drafted (~140 seconds). HeyGen discovered/suggested, not connected; no generated/uploaded video. Implemented and locally verified; owner editorial/visual acceptance, publication and optional video provider/presenter choices remain pending. Public generation unchanged; no commits, pushes, releases or deployment. Next: owner preview review and explicit publication confirmation.


<a id="gc-070-1305"></a>
## 1305. Compact touch drawer captions — 2026-10-18

Owner: “ok correggi solo l'errore: etichette compatte a riposo anche su mobile, mantenendo zoom e transizione quando interagisco. verifica nella gallery python”. The defect conflated touch caption visibility with fixed hover-expanded dimensions. Reveal handles now size to their text, bounded by existing reveal dimensions; centering follows their actual box. Icons keep their reserved area and the larger invisible touch target is unchanged. Hover/focus/press retain zoom and transitions. Transient drawer data-active bridges touch pointer capture clearing :active, with release/cancel/lost-capture/leave cleanup. No region state, mobile overlay, auto-collapse or Data behavior changes.

Built core and gallery assets; verified only the Python gallery at port 8243. Chromium and WebKit pass the extended verify_drawer_handles_browser.mjs: compact readable rest geometry, real Chromium touch press/release, WebKit press and touch tap, hover zoom in Mobile preview, normal-mode reveal, keyboard, closed-handle dragging, icon/contrast, stable field geometry, iframe identity and retained Data. Preview covers mimi/light and joanna/dark; nested l05 checks all four outer labels. Screenshots reviewed. Horizontal l05 labels now measure about 17px high instead of 28px; lateral labels about 17px wide instead of 20px, with text-sized length instead of a fixed 88px. No Node/serverless gallery tests, publication or release.


<a id="gc-070-1310"></a>
## 1310. Border container notifications — 2026-10-18

Owner confirms closable_change for drawers and splitter_resize, asks for implementation, a Python gallery example, and subsequent tab/stack planning. Implemented through the existing Source publish/subscribe service: pane-local closable_change carries {open, region} after an effective visibility change; border-local splitter_resize carries {region, size, previousSize} after a live gesture ends or a keyboard resize step. Sizes are measured pixel strings. Startup, no-ops, intermediate moves and programmatic size changes do not publish completion. Cancellation retains the live size and publishes its completion after capture/drag cleanup. No regions-Bag writeback or new global event bus.

GC-105 §105 and GC-225 document the approved contract and internal responsibilities. Python l06 demonstrates both subscriptions in dataController, counts, payloads, Data-driven hiding, live splitters and retained invalid drafts. Core and gallery bundles rebuilt. Python-gallery Chromium/WebKit checks cover click, Data updates, no-ops, timing, keyboard limits, closed-handle drag, pointer cancellation and retained Data/DOM/draft identity. Nested l05 and handle l04 regression checks pass in both engines. The core suite also passes all 3,548 tests with the project Python environment and local fixture-server permissions. Initial environment-only failures were resolved by using the project Python and allowing local fixture servers. Only Python gallery was exercised; JS/serverless alignment remains deferred to final release qualification.

Tab/stack remain planning only in GM-035: a common mounted-panel selection responsibility, stack without a hidden tab bar, tab adding its presentation, legacy selection names and existing subscriptions. Selection-event payload/order, initial notification and structural close semantics remain proposals for owner review. No new selection API is recorded as approved. No release or publication; visual acceptance remains separate.


<a id="gc-070-1315"></a>
## 1315. Tab and stack containers — 2026-10-18

Owner explicitly confirms closable removes panel Source but retains Data, and requests implementation and Python-gallery examples. The reviewed contract is recorded in GC-105 §110, GC-225 and the constitution; PORT-0015 records bounded legacy/PoC review. SelectedContainer provides mounted-panel selection; tabContainer adds the strip while stackContainer creates none. named/index bindings agree, hiding/showing and selected notifications follow the documented order, and startup/no-op handling avoids duplicate publications. Closable tabs run an activated synchronous onClose veto, publish closing, delete Source, resolve selection, then publish closed. Application Data remains untouched. Close code is scoped to selection panels and never emitted as a DOM attribute.

Python l07 demonstrates dual selection bindings, subscriptions/event log, retained invalid drafts, close veto, surviving notes Data and a nested border. l08 demonstrates Data-driven stack selection without tabs. Both are compact and responsive; gallery now has 79 lessons / 80 routes. The catalogue tests now reflect those routes and verify optional Logic modules only when declared (l05–l08 intentionally have no JS companion during Python-first iteration). All Python route Source responses are still checked. JavaScript/serverless example alignment remains a final-release prerequisite.

Verified: 3,555 core JavaScript tests pass; Python 167 pass with one existing expected failure and 266 passing subtests; 18 Python gallery tests pass. Durable Chromium/WebKit l07/l08 checks cover initial/event ordering, both bindings, veto, close/removal, accepted Data plus rejected draft and DOM identity, nested border, keyboard, narrow viewport and touch-emulated taps. Border l06 regression passes both browsers. Mobile screenshots reviewed. Core/gallery bundles rebuilt. Initial broad Python discovery touched retired temp tests; official tests/ scope and local fixture-server permissions were used for the successful suite.

Implemented and verified, awaiting owner visual acceptance. No commit, push, version bump, package publication or hosted deployment. FramePane, incoming switchPage command topics, asynchronous close guards and alternate tab-strip positions remain outside this increment.


<a id="gc-070-1320"></a>
## 1320. Tab theme refinement and slider-selected stack — 2026-10-18

Owner requests more careful presentation, especially mimi/joanna, and a two-panel stack controlled by a slider. Tab entries now use compact theme-owned height, spacing, rounded upper corners, a coherent selected entry and integrated close control. Keyboard focus remains visible and touch targets retain their existing size. Python l08 binds a 0/1 horizontalSlider to selected, alongside selectedPage, with details and review/preferences panels. No application DOM wiring or panel recreation.

Verified: seven selected-container core tests, eighteen Python gallery tests, Chromium/WebKit Python l07/l08 selection/close/draft/Data/identity checks and touch checks. Gallery settings exercised mimi/joanna in both light/dark modes; screenshots reviewed. Bundles rebuilt and Python gallery restarted on 8243. Visual acceptance remains with the owner. No release/publication or JS/serverless gallery qualification.

Owner additionally requests underline-only tabs, all four strip positions, icons and reactive badges. These capabilities are requested, but their parameter names/defaults remain a proposal pending confirmation; current implementation still has top tabs only. Legacy Dojo TabContainer uses tabPosition (top/bottom/left-h/right-h); modern left/right spelling and tabMode are proposals. Publish inspector remains deferred while container presentation is reviewed.


<a id="gc-070-1325"></a>
## 1325. Reactive tab presentation — 2026-10-18

Owner explicitly approves tabMode, tabPosition, icons and reactive badges, with a Python-gallery example and mimi/joanna visual care. GC-105 §115, GC-225 and the constitution record the contract. tabMode=tabs/underline and tabPosition=top/bottom/left/right use typed read bindings and generated Builder enum metadata. CSS positions the same strip and panels; vertical keyboard navigation and aria-orientation follow the axis. Stable icon/caption/badge spans update from parent-owned panel metadata. Null/empty hides the badge, zero stays visible; arbitrary text is escaped. No panel recreation or selection notifications for presentation-only changes. Theme tokens cover density, shape, indicator, badges and side-strip bounds.

Python l07 now has responsive compact controls for mode, position, unread count, badge color and icon, together with existing selection/close/draft tests. l08 retains its 0/1 slider. Core: 3,556 JS tests pass; Python: 168 passed, one existing expected failure, 266 passing subtests. Gallery: 18 Python tests pass. Chromium/WebKit qualify all eight mode/position combinations, mimi/joanna light/dark, reactive inactive-tab metadata, keyboard, retained invalid drafts and Data/DOM identity, and 390px touch layouts. Screenshots inspected. Initial Python sandbox-only failures were resolved by enabling local fixture server permissions; a browser navigation test was corrected to avoid collapsing an already-open section.

Implemented and verified; owner visual acceptance pending. Python gallery remains on port 8243. No version bump, publication, deployment or JS/serverless gallery qualification. Publish Inspector remains deferred.


<a id="gc-070-1330"></a>
## 1330. Catalogue-sized iframe stack preview — 2026-10-18

Owner replaces the two-panel slider example with one miniature iframe per demo. Python l08 now reads the common gallery catalogue and declares 78 stack panels, excluding only itself to prevent recursion. The slider binds to selected; selectedPage and a normal selected subscription provide the demo key/title. CSS scales iframe content to 50%; native lazy loading leaves scheduling to the browser. Visited frames retain their independent documents and Data. No new component/runtime behavior or application DOM wiring. The title is now Demo thumbnails in a stack.

Verified: 18 Python gallery tests pass. Dedicated Chromium/WebKit checks confirm catalogue count, self-exclusion, slider endpoints, a bound input retained across panel changes, stable iframe/window/document identity, actual half-scale geometry and no outer horizontal overflow at 390px. Initial visual checks caught transform_origin being composed as a transform function (the example now declares standard transform-origin explicitly in style), the container's normal max-width constraint (explicitly removed for the double-sized frame), and the slider's intrinsic width (now shrinking). Screenshots reviewed. All changes remain Python-gallery development work; no release/publication or JS/serverless checks.


<a id="gc-070-1335"></a>
## 1335. Drawer carousel with debounced center preview — 2026-10-18

Owner requests a borderContainer drawer containing the carousel, with a delay after stopping before showing the selected demo in the center. Python l08 composes existing borderContainer, two stackContainers and dataController(_delay=350). The miniature follows the slider immediately. The center retains the previous demo until the debounce fires, then sets that demo's bound src and selectedPage. Unvisited center iframes have no src; visited URLs/documents stay in place. The thumbnail and full-size views are explicitly independent page instances. No core API, manual event wiring, application timer or DOM state cache was introduced. The existing drawer frees center space on narrow screens without remounting either stack.

Verified on Chromium/WebKit: 78 preview/full pairs, slider endpoints, actual half scale, delayed center assignment, skipped intermediate src URLs, retained edits and document identity in both independent instances, narrow layout and drawer close/reopen. Eighteen Python gallery tests pass. Desktop/mobile screenshots reviewed. Python-only development; no release/publication.


<a id="gc-070-1340"></a>
## 1340. Container gallery and readable lessons — 2026-10-18

The Python gallery now composes navigation, center and code with borderContainer/contentPane, shared live splitters and drawer handles. Each preview uses tabContainer with Example/Explanation; the existing iframe remains mounted. The artificial Mobile preview panel is removed; actual narrow-screen navigation, code and Inspector views remain. The shared index service has an explicit containerLayout integration option: it delegates geometry to components, observes existing closable_change/splitter_resize notifications and retains its existing page/theme/preferences responsibilities. Plain IndexPage retains its previous splitter layout. No new component API, duplicated drag engine or application state cache was added.

The eight container lessons now include detailed Try it / How it works explanations. l01 concentrates on region sizing, l02 contains editable customer/state/notes, and l04 is a dedicated four-drawer workspace with search, filters, customer details and shared output. More complex l05–l08 retain their existing interactions. This is a container-focused enrichment, not a rewrite of every input/HTML demo.

Verification: 18 Python gallery tests and six core index tests pass. Chromium/WebKit verify drawer and toolbar synchronization, splitter resizing, switching Explanation/Example and demos without losing iframe/document identity or bound edits, mimi/joanna presentation, and narrow navigation/code/Inspector views. Screenshots reviewed. Python development preview pending owner visual acceptance; shared gallery changes require the already deferred JS/serverless authoring alignment before final release. No release/publication.


<a id="gc-070-1345"></a>
## 1345. First guided drawer lesson — 2026-10-18

Owner-approved Python-only l04 tour: the gallery composes a bottom contentPane drawer with Source-authored Start/Resume, Pause, Stop, Back, Next, Voice and narration-speed controls. Eight declarative steps are authored in Python; gallery-owned sequencing writes explicit example Data paths. Existing drawer bindings and closable_change controllers keep the manual controls usable. No synthetic DOM input, publish recording, application request or core narration service was introduced.

Automatic steps wait for optional English narration to finish, then allow observation time. Pause cancels narration; resume re-reads the current explanation without reapplying its action. Back reviews text only. Stop keeps values. Leaving the example/tab, opening another mobile view, closing the guide or hiding the document pauses playback. Listeners, timers and speech are released on disposal. Missing voices/errors keep captions usable. Voice availability/quality depends on the browser and operating system.

Implemented and verified: 18 Python tests, four deterministic player tests and Chromium/WebKit integration for all steps, retained Data/document identity, pause/resume, review, speech completion/cancellation, mimi/joanna and narrow views. Speech integration uses a controlled synthesis double; audible quality remains for the owner's trial. The workspace now fits the preview height so Output stays visible above the guide. Existing gallery regression checks also pass in Chromium/WebKit. Python development preview pending visual acceptance; no release or expansion to other examples.


<a id="gc-070-1350"></a>
## 1350. Tutorial explanations and minimized drawer default — 2026-10-18

Owner requests welcoming beginner-oriented lessons, a smaller uncut teaching handle, and minimized captions as the general drawer default. drawer_minimize now defaults to True; explicit False and reactive bindings remain supported. Icons stay visible; touch captions remain readable and compact, with existing interaction zoom. The Guide handle uses existing scoped CSS variables for an 18px icon and a short caption; no special core rendering path.

Eight Python container lessons and their family introduction now teach through concrete tasks, observable outcomes and explanations of Data, bindings, regions, nested layouts, events and stack selection. The drawer narration is rewritten in the same voice, with longer reading pauses. These lessons are ordinary readable text in Explanation, not a duplicate source listing. Full Python remains in Code. This increment does not claim the remaining gallery families have been rewritten.

Verification: five border-container tests include omitted/explicit/bound minimize and icon retention. Eighteen Python tests pass. Chromium/WebKit exercise the guided sequence, retained Data, themes and narrow views; dedicated visual checks measure the compact Guide grip and confirm its caption is uncut on hover. No publication; Python preview awaits owner feedback.


<a id="gc-070-1355"></a>
## 1355. Thin drawer grips with unified icon and caption — 2026-10-18

Owner corrects the presentation contract: minimizing must reduce cross-axis thickness, with icon and caption hidden/revealed together. Replaced the independent square icon slot with one internal flowing content group. Default resting thickness remains 4px; expanded content is text-sized within 20px cross-axis bounds. Upright icons precede automatically oriented captions, without imposing a square minimum. Theme variables retain control; pointer hit areas remain separate. Explicit non-minimized presentation and compact readable touch captions remain supported.

Removed the gallery's temporary icon-size/reveal-size overrides so Guide and navigation handles use the common behavior. Five core border tests pass. Python-gallery Chromium/WebKit checks measure both orientations at rest and on hover, ensure complete caption visibility, and exercise click/drag with retained iframe identity. Touch contexts in both engines confirm visible combined content within 20px thickness; the guided-tour regressions also pass. No release/publication; awaiting owner visual feedback.


<a id="gc-070-1360"></a>
## 1360. Source inspector structural editing and history — 2026-10-18

Owner-approved scope: Source hover/focus +/−, a child-insertion dialog, branch drag and Undo/Redo. Implemented in the shared optional inspector and target-side agent. The catalog comes from the selected Builder's installed HTML/component grammar. Root removal, cycles, duplicate sibling labels and invalid nesting are rejected. Native tree dragging emits a named-Logic intent; actual Source mutations use public Builder/Bag APIs. Data has no structural controls.

The target-owned journal reverses Source/Data value and attribute changes, insertion, complete subtree removal, reordering and reparenting. Restoration retains metadata, binding expressions and sibling position. Connected pages keep separate histories across selector changes; local detach or connection close clears the journal. External conflicts are reported without overwriting application writes. Reparenting can recreate rendered components; application effects such as controllers or requests are not transactions and are not rolled back. Styles preview/reset and breakpoint configuration retain their separate lifecycle. Live edits do not save Python definitions.

Verified: 38 inspector unit/integration tests; Chromium and Playwright WebKit local and MessagePort UI sequences for HTML/widget/container insertion, invalid input, attributes, native drag/reorder, subtree deletion, repeated Undo/Redo, keyboard focus, live two-way bindings and conflict refusal. Existing browser editing/breakpoint/CSP/palette tests, opaque-frame bridge tests and Styles preview/reset/export tests also pass in both engines. The Styles fixture was aligned with the already-current Base theme token count and explicit html_button declaration. Optional tool and package artifacts rebuilt; Source editing screenshot reviewed. No dependency edits, publication or deployment. Implementation and checks complete; owner visual acceptance is pending.


<a id="gc-070-1365"></a>
## 1365. Adversarial review of containers and gallery integration — 2026-10-18

Owner asks for a thorough review of recent work for duplication, inconsistent
behavior, arbitrary constants and adherence to Gramlot's architecture. This is
an analysis phase: no implementation fixes, new API decisions, release or
publication are approved by this entry. Prior verification remains historical
evidence; it does not cover the reproduced gaps below.

Scope: border/drawer and selected containers; parent/renderer integration;
Python gallery composition, mobile presentation, guided lesson and layout
examples; connected themes/popup changes; the new inspector structural history
and its interaction with containers. JavaScript/serverless gallery qualification
remains deferred by the owner. The inspector's entire pre-existing feature set
was not requalified in this review.

### Reproduced findings

- **R01 / P1 — Inspector insertion leaves invalid container Source.**
  `InspectorHistory.insert()` invokes the Builder with empty attributes
  (`tools/gramlot-tools-inspector/src/inspector-history.js`, insert).
  Inserting contentPane into a borderContainer throws
  `Invalid border region: undefined`, but the Source child count increases
  from 1 to 2 and the inserted child has no region. Undo recovers it.
  Parent-specific required metadata must be collected/validated before the
  mutation; inventing an implicit region is not an approved solution. The
  generic HTML topology tests do not exercise this component constraint.
- **R02 / P2 — Tab keyboard order diverges from Source/display order.**
  `selected-container.js`, renderTabs keydown handler, iterates the insertion
  order of `#tabs`; moving existing entries in the DOM does not reorder that Map.
  Reproduction: Source.move(2, 0) changes visible order from Alpha/Beta/Gamma to
  Gamma/Alpha/Beta, but Home still selects Alpha. Navigation must use the same
  current ordered records as rendering. This matters with the newly supported
  inspector branch reordering.
- **R03 / P2 — Drawer background and automatic foreground have different
  sources.** `border-container.js` computes contrast from --drawer-background,
  while drawer_background is projected as an inline background property.
  On the Python l04 page, drawer_background='#eeeeee' produces background
  rgb(238,238,238) with white text. Both authoring paths must feed the same
  effective color before deriving contrast; an explicit foreground still wins.
- **R04 / P2 — Font customization can clip drawer captions.** The minimized
  reveal cross-axis default is capped at 20px independently of the font/padding.
  On Python l04, the default 11px font fits (17px client/scroll width), but
  --gramlot-drawer-font-size:18px gives 20px client width and 23px scroll width.
  Default geometry should derive from content/font/padding; explicit maximums
  may remain opt-in constraints. Requiring a theme to coordinate several
  independent tokens is not the automatic behavior the owner requested.
- **R05 / P2 — Guided review and execution share one cursor.** Back calls show()
  and changes position; resumed automatic advancement reads position+1 and can
  execute an already-applied action again. Reproduction: Next twice, Back,
  edit the target value, Resume, advance the timer: the edit is overwritten by
  the already-executed second step. The existing test checks only immediately
  after Resume and pauses before that timer. Review-only navigation needs a
  distinct execution cursor or a clearly confirmed replay contract; do not
  silently interpret review as replay.

### Structural cleanup findings (not additional proven runtime failures)

- **R06 — The gallery conversion is incomplete.** Example/Explanation uses
  tabContainer, but open-page tabs in page.py/index-page-runtime and source-file
  tabs in gallery.js still maintain their own selection, keyboard and hiding
  loops. Mobile keeps a separate Bag and restores some preferences by reading
  rendered data-* attributes. These are existing services reused during the
  approved transition, not evidence that example business Data are duplicated;
  nevertheless the gallery is not yet the fully declarative reference that the
  new components should make possible. Consolidate state ownership and migrate
  the remaining tab behavior instead of extending these parallel loops.
- **R07 — Parent component responsibilities leak into generic renderer code.**
  html.js, gramlot-renderer.js and Python/JS attribute filtering each name tab /
  stack / border tags explicitly. Parent metadata projection, callbacks and
  selection writes should converge on one reviewed component contract rather
  than requiring another set of renderer branches for every new container.
  This is a proposed architecture cleanup, not authorization to invent a new
  generic plugin/proxy API during a bug fix.
- **R08 — Presentation and qualification need consolidation.** Drawer CSS
  retains overridden labelled-handle width/height/padding rules alongside the
  newer unified-content rules. Gallery CSS retains selectors for the old shell
  alongside its container composition. Breakpoint 1023 appears in both JS and
  CSS; drawer icon gap and some tab geometry are fixed values. Audit active
  selectors, centralize semantic defaults and keep theme-sensitive dimensions
  derivable. Several new browser/history tests are densely compressed, which
  makes missing transitions and combinations harder to notice. Rewrite their
  setup/actions/assertions clearly and cover the five reproductions above.

### Parameterization assessment

Existing good choices: shared SelectedContainer for tab/stack semantics; stable
slotted panels; Source-owned structural closing; existing publish/subscribe;
Python examples using bindings and dataControllers; shared popup positioning;
CSS theme tokens; gallery-owned tutorial sequencing as explicitly authorized.
DOM creation inside a web component is its implementation responsibility, not an
application workaround. Observer/timer/drag handles are legitimate lifecycle
state, not duplicated application Data.

Do not turn every number into an authoring parameter. Demo sizes, slider bounds,
350ms carousel delay and per-step seconds already belong to the authored lesson.
Theme colors, spacing, typography and interaction presentation need coherent
semantic variables and useful derived defaults. The first guided lesson's l04
association and named controls are acceptable within its expressly bounded
scope; before extending to other lessons, move lesson identity, paths and voice
language into one lesson configuration rather than copying conditionals. Do not
create a general replay engine without a separate approved design.

### Verification and next step

Read-only qualification reran 13 core border/selection tests, 4 guided-player
unit tests and 7 inspector-history tests: **24 passed**. Additional temporary
probes reproduced R01, R02 and R05 using the actual Source/Bag/runtime/player;
Chromium against the Python gallery reproduced R03/R04. Reloading the example
iframe correctly stopped the guide and restored availability; that suspected
lifecycle defect was rejected. These checks are not a claim of complete suite
or audible narration qualification. No Node/serverless gallery was exercised.

Review complete. Fixes remain pending owner instruction. Recommended order:
R01-R05 regressions and repairs, then the bounded R06-R08 consolidation with any
new component-interface decision reviewed before implementation. Retain Python
preview-only verification until the owner accepts the final release phase.


<a id="gc-070-1370"></a>
## 1370. Three-minute introduction with live Source editing — 2026-10-18

Owner: “bene, aggiorna la demo e il video di 3 minuti mostrando anche l’aggiunta di un elemento, lo spostamento di un ramo e l’undo, sempre con Michael e in modo graduale”. Local production revision 5 uses three small Python-authored pages with actual Gramlot Source/Data/bindings and the updated optional inspector. The standalone launcher reuses the existing gallery tool integration and the page's runtime constructors; no dependency-source edits or simulated application mutations.

The 180-second cut introduces Source/Data, a literal div, a pointer and a shared input before the inspector at 1:50. The final demonstration adds a div via + and the dialog, gives it literal text, drags the bound div inside it, then undoes the move. Recorded assertions confirm the subtree positions, retained ^message pointer and unchanged Data. Michael (Kokoro am_michael, English) narrates all chapters. The persistent diagram, code excerpts, cursor halo/click pulses and step cards are editorial overlays; dialogs and real application results remain visible. No avatar or embedded subtitles.

Verified: all six scene recordings have no page errors; full MP4 decode, 180 seconds, H.264/AAC, 1600×900, six chapters, measured audio peak -2 dBFS; player playback/seeking and mobile width; 14 final frames visually reviewed. Source edit actions align with their measured sentence timings. Local artifact: /Users/gporcari/.codex/visualizations/2026/10/18/01a14e31-2853-7731-9f18-4ec18414ef69/gramlot-intro-video-v5/index.html. The shared screenplay is updated and revision 4 preserved. The local demo is served at http://127.0.0.1:8261/. Production complete, owner editorial review pending; no site publication or deployment.

### Editorial revision 6 — 2026-10-18

Owner requested a larger inspector in the final sequence, the female voice, and a better Source/Data diagram ("Nella parte finale ingrandirei l’inspector", "mettere quella femminile", "non possiamo ... fare qualcosa di piu bello?"). Local revision 6 applies those editorial changes to the existing real recordings: a 1.7x inspector close-up preserves the Source rows, toolbar, edited property and path while omitting empty property space; the running page remains alongside it. The Add dialog is enlarged separately and the recorded pointer movements are mapped into the reframed view. The diagram now uses a Source tree, a Screen window and a Data path/value with distinct colors and directional connections. Application behavior is unchanged.

Heart (Kokoro af_heart, American English, from the original voice comparison) replaces Michael throughout. All 42 sentences retain the prior action-aligned start/end times using pitch-preserving tempo adjustment. Verified: 180-second H.264/AAC output, 1600×900, six chapters, complete decode without errors, audio peak -2 dBFS / mean -18.8 dBFS, browser playback/seeking and mobile width. All chapters and the enlarged dialog, destination branch, moved div and Undo result were visually reviewed. Local player: /Users/gporcari/.codex/visualizations/2026/10/18/01a14e31-2853-7731-9f18-4ec18414ef69/gramlot-intro-video-v6/index.html. Revision 5 and its screenplay are preserved. Editorial production is complete; owner acceptance remains pending. No publication or deployment.


<a id="gc-070-1375"></a>
## 1375. Review repairs and structural consolidation — 2026-10-18

Owner: “ok procedi con le cinque correzioni e poi con la pulizia strutturale, mantenendo automatismi e default sensati. aggiungi i test mancanti e verifica nella gallery python”. This authorizes R01–R08 from §1365; the constitution and GC-225 record the bounded responsibility changes.

Implemented:

- R01: required child attributes come from the parent component declaration. The inspector asks for an explicit unused border region and validates insertion/reparenting before changing Source. Rejected operations leave Source and edit history unchanged; valid insertion supports Undo/Redo locally and through the page bridge.
- R02: keyboard traversal follows current Source indices after panel reorder, matching visual order while retaining the mounted controls.
- R03/R04: drawer_background feeds the same color used for automatic foreground contrast. Explicit color still wins. Natural icon/caption/font/padding measurements determine reveal dimensions; explicit reveal limits remain optional. Measurements belong to the internal region, so Source style projection cannot erase them. Compact touch rest, zoom, transitions and the outer hit target remain intact.
- R05: galleryGuide.executed records the last applied action independently of the explanation position. Back/Next review and Resume never reapply an already executed action. Stop/completion followed by Start still explicitly restarts the lesson.
- R06: the Python gallery uses tabContainer for open pages, Example/Explanation and Python/Logic files. galleryIndex is the shared Data scope for selection, opened pages, responsive views and preferences. The existing HTML IndexPage composition remains available; no application Data are cloned and iframe loading remains lazy.
- R07: childParameters and sourceContext consolidate the existing parent projection, callback argument and Source-write responsibilities. Generic renderer/Builder filtering no longer dispatches by border/tab/stack tag names. No new application authoring API or dependency-source modifications.
- R08: removed overridden drawer dimensions and obsolete gallery selectors; intrinsic geometry replaces fixed cross-axis limits; icon/caption spacing is a theme token. The responsive service reads a CSS flag instead of repeating the breakpoint. Compressed history/guide tests were reformatted and obsolete drawer browser expectations replaced with the current contract.

Verification: the complete core JavaScript suite passed 3,558 tests. Core Python passed 168 tests and 266 subtests, with one existing expected failure and 60 deprecation warnings. Inspector unit suite passed 39 tests; local and bridged structural insertion/Undo/Redo passed in Chromium and WebKit. Guide unit suite passed five tests including resumed-timer replay regression. Python gallery tests passed 18 tests and 93 subtests, including all routes and shared-container authoring.

Python browser qualification covers drawer contrast and larger typography on both axes, reactive Source styling, closed-handle dragging, touch press/rest, retained Data, guided playback/review/cancellation, page and source-file tabs, mobile Example/Code/Inspector, and unchanged iframe identity. Mimi/Joanna desktop and phone captures were visually inspected. Speech timing uses deterministic synthesis doubles; audible voice quality is not claimed. Final Chromium/WebKit reruns passed for all four Python browser probes (container gallery, guided playback, intrinsic drawer styling and gallery grips). The final focused core checks passed 14 container tests and 11 index/bundle tests; public documentation validation passed (11 pages, search, sources, local links and mirrored anchors). No outstanding repair from R01–R08 remains in the approved Python scope.

Implemented and verified work remains distinct from owner visual acceptance. Preview: http://127.0.0.1:8256/. JavaScript/serverless gallery authoring and qualification remain explicitly deferred; shared browser assets are not ready to publish against the previous JS shell. No release, commit, push or deployment in this repair phase.


<a id="gc-070-1380"></a>
## 1380. Visible tab comparisons in the Python gallery — 2026-10-18

Owner: “mi sembrano troppo pochi esempi ... vari tipi di tab ... posizione ... sopra sotto sinistra destra ... se non mostri delle varianti non capisco”. Implemented the already supported scope in Python l07: eight simultaneously visible working cards (tabs/underline × top/bottom/left/right), exact authoring options, icons, reactive badges and shared Profile/Message Data with independent panel selection. The existing interactive selection/closing editor remains below. No application DOM construction or bespoke browser behavior.

Verified: four Python page tests and 93 route subtests; Chromium and WebKit checked each variant in mimi/light and joanna/dark, preserved/shared edits, correct horizontal/vertical orientation and no phone page overflow. Captures were visually reviewed. Preview: http://127.0.0.1:8257/l07. JavaScript/serverless qualification remains deferred; no release/publication.

Remaining request: alignment along the tab strip (left/center/right horizontally, top/center/bottom vertically) has no supported API. Proposed tabAlign=start/center/end, default start, in one pending owner question under §11.43. No core implementation or approved contract for that proposal yet. Continue that affected part only after the owner's answer; no example-only shadow-DOM or CSS workaround.

### Editorial revision 7 — 2026-10-18

Owner requested an animated input → Data → div schema, selectable or faster playback, and the inspector progression "1) cambio dei dati 2) cambio qualcosa nel source 3) aggiungo un attributo come il colore ... solo poi aggiungo o sposto i nodi ... un crescendo". Revision 7 retains a 180-second master with shorter early pauses and a newly recorded 76-second inspector sequence starting at 1:35. The actual demo edits message to Hello again, replaces the div pointer with Welcome, restores ^message, adds color=#4169c8, adds a section, moves the original div into it, and undoes the move. The enlarged view includes both property rows and the resulting page.

The chapter-four diagram animates recorded values from input to Data and then to div. Its explanatory timing is explicitly expanded for readability; the real application remains immediate. Heart narrates all 41 sentence slots. The player provides 0.75×, 1×, 1.15×, 1.25×, 1.5× and 2×, defaults to 1.15× (about 2:37 viewing time), and preserves voice pitch. Verified: actual browser edits and DOM/binding/color assertions, no page errors, complete 180-second H.264/AAC decode at 1600×900, six chapters, audio peak -2 dBFS, player playback/seeking, all speed choices and mobile width. Fifteen final frames and the binding/crescendo close-ups were visually reviewed. Local player: /Users/gporcari/.codex/visualizations/2026/10/18/01a14e31-2853-7731-9f18-4ec18414ef69/gramlot-intro-video-v7/index.html. Revision 6 and its screenplay are preserved. Production complete; owner review pending; no publication or deployment.


<a id="gc-070-1385"></a>
## 1385. Tab alignment and visible comparisons — 2026-10-18

Owner confirmed “Sì, aggiungi tabAlign”, resolving §1380's pending API question. tabContainer now declares read-bound tabAlign=start/center/end, default start, independently of mode and side. CSS safe justification aligns horizontal/vertical strips while preserving access to overflowed entries. Parameter changes retain Source, Data, mounted editors and selection; invalid enum values are rejected. The exported collection grammar, constitution, GC-225 and public component contract are aligned.

Python l07 contains 14 working comparisons: the existing eight mode/side combinations plus six horizontal/vertical alignment cards, constructed by one shared page helper. Its interactive editor adds the bound alignment selector. Captions show the Python options; fields remain shared Data with independent panel selection.

Verified: ten selected-container tests, including default/invalid values and live alignment without draft loss or selection notifications; eleven collection/bundle checks; four Python page tests and 93 route subtests. Chromium and WebKit verified geometric alignment for both modes/all four sides/all three alignments in mimi/light and joanna/dark, safe overflow with Home/End, shared values, all 14 cards and phone width. Captures reviewed visually. Public documentation validation passed. Preview: http://127.0.0.1:8257/l07.

Approved scope implemented and verified; owner visual acceptance remains separate. No remaining tabAlign decision. JavaScript/serverless gallery alignment remains deferred by the owner; no release/publication.


<a id="gc-070-1390"></a>
## 1390. Release readiness and inspector review — 2026-10-18

Owner asked what remains for release and whether the inspector changes are sound. Read-only implementation review covered Source insertion/removal/reparenting, edit history, local/MessagePort command paths and tree drag feedback; no implementation changes or publication were authorized in this review.

Fresh verification: 39 inspector unit tests passed. Structural browser qualification passed all four Chromium/WebKit × local/bridge cases, including insertion, attributes, native drag/reorder, deletion, Undo/Redo, binding restoration and conflict guards. Styles qualification passed Chromium/WebKit. General inspector qualification passed Chromium and WebKit, including scalar editing, breakpoints, CSP rejection, keyboard/move/resize and reconnection; Chromium also verified debugger pause/writer stack. Firefox failed before executing assertions because its local browser process could not open the temporary profile, including a retry with /private/tmp. Firefox qualification remains unverified; this is not evidence of an application assertion failure. No new blocking implementation defect was identified in the inspected scope.

Release preparation remains: align JavaScript gallery authoring with the verified Python shell/examples before publishing their shared assets; then qualify packaged Python/Node/serverless artifacts and the downloadable ZIP. Python-only gallery verification remains in force until the owner starts the final release phase. The core CI workflow currently does not execute the separate inspector unit/structural/styles suites; adding them is recommended before release. The Chrome extension bundles the shared inspector, so delivering these changes there requires its own refreshed build and qualification, not only publishing core. Final version metadata/release notes, consolidation and publication remain separate authorized steps. No claim of a fresh complete core suite or release-artifact qualification in this review.


<a id="gc-070-1395"></a>
## 1395. Cross-host release preparation and inspector CI — 2026-10-18

Owner answered “si” to “Passiamo alla preparazione finale, iniziando dall’allineamento JavaScript e dalla CI?”. This authorizes final JavaScript/serverless alignment after the Python-first review, superseding the temporary qualification deferrals in §§1375–1390. It does not publish packages or deploy the galleries.

Implemented: the JavaScript gallery now authors the same shared border/tab containers, eight layout lessons, fourteen tab comparisons and guided drawer controls as Python. Nine parity tests compare actual Source trees, bindings and controllers. The carousel gets its route map from the gallery exporter, so the offline version uses relative HTML paths and retains visited live frames; hosted Python and Node expose the common catalogue resource. The documentation generator no longer requires the removed expandable tutorial block. Gallery reconstruction retains selection and opened Source panels. Core CI now has a separate inspector job for unit, general browser, structural local/bridge and style suites. The Chrome extension was rebuilt against the shared inspector, with an additional protocol test for insertion and Undo/Redo.

Fresh local verification:

- Core: 3,559 JavaScript tests; 168 Python tests and 266 subtests, with one existing expected failure and 60 deprecation warnings.
- Examples: 106 tests under Node and 106 under Bun; 18 Python tests and 93 subtests. Includes nine Python/JavaScript Source parity checks and reconstructed-gallery behavior.
- Adapters: 33 Node-server and 35 serverless tests. Inspector: 39 unit tests; Chromium/WebKit structural, general and styling evidence remains as in §1390. Extension: five unit tests, 22 browser checks and eight real DevTools checks passed.
- Installed local wheels and npm archives were used for fresh Python and Node galleries. All 80 common pages start/render in Chromium and WebKit across Python, Node and file:// serverless. The first complete matrix had one 15-second network-idle timeout on Chromium's offline carousel, without page errors; an isolated repeat with the same timeout passed. Separate carousel interactions passed on all six host/browser combinations, including delayed loading, relative file routes, unchanged iframe identity and retained edits.
- Container gallery interactions, fourteen tab variants, mimi/joanna, mobile Example/Code/Inspector views, guided playback and Data retention passed in Chromium and WebKit. Speech sequencing uses deterministic browser doubles, not an audible voice-quality claim.
- Core public documentation, all 79 example lessons and paired adapter/extension guides build and validate. Candidate gallery and extension ZIPs were assembled and checked for archive integrity; the gallery contains 80 examples including its environment-specific lesson.

Firefox remains unqualified locally: the browser fails before application assertions with its temporary-profile startup error (§1390). The new CI job includes Firefox on Linux, but its remote result is pending a source push; no claim that hosted CI has already run. Package versions remain unchanged in these unpublished candidate archives. Final version metadata/release notes, consolidation, push, release publication and online gallery/ZIP rollout are the remaining release steps requiring owner authorization. No release or deployment occurred in this preparation.


<a id="gc-070-1400"></a>
## 1400. Gallery footer and settings dismissal — 2026-10-18

Owner: “lo toglerei. inoltre se apro l'ingranaggio e clicco fuori vorrei si chiudesse”. Both Python and JavaScript indices omit the serverless ZIP link, even when the deployment supplies its URL. Archive generation and the independent download endpoint are unchanged. Deployment browser qualification now checks absence of the index link instead of requiring it.

The native auto popover already dismisses outside clicks in the parent document. Iframe interactions do not bubble there, so the existing gallery settings service closes the popover when focus enters an iframe, after focus has settled in the next animation frame. Its blur listener and pending animation frame are released on disposal. No separate popup state or application-specific event code is introduced. The attempted CSS backdrop approach was removed after full-browser qualification showed it did not solve iframe dismissal.

Verified: five Python gallery-page tests and fifteen JavaScript gallery tests. Chromium and WebKit on the Python preview at port 8257 verify theme/label settings, clicks inside, outside on the main page and inside an example iframe, Escape/Close, retained field values, persistence and narrow viewport dismissal. GE-010 and its mirror record the updated contract. Reload the preview to load the new gallery bundle. No publication/deployment; release candidates assembled in §1395 must be regenerated with this subsequent UI change before publication.


<a id="gc-070-1405"></a>
## 1405. Published containers, gallery and Inspector releases — 2026-10-18

Owner explicitly authorized bump, commit, push and publication after green CI, regeneration of the serverless ZIP and verification of both hosted galleries. Published releases: Gramlot 0.3.2 (Python/npm/JSR), gramlot-examples 0.3.4 (Python/npm), gramlot-js-server/serverless/create 0.2.13 (npm), and Gramlot DevTools 0.1.4 (GitHub ZIP). The unchanged Python adapter remains 0.2.10. Each release followed successful CI on its source revision; publication workflows repeated their required checks. Public main contains the released work. The independent c23 website lesson being developed concurrently was deliberately excluded and remains local work.

CI qualification exposed and repaired test infrastructure gaps before publication: portable temporary screenshot paths for Linux; drawer assertions on the shared icon/caption content and its animated maximum dimensions; Python installation before cross-language parity; and eight container behavior checks with catalogue routes in the two test servers. The complete examples browser suite passes against both Python and JavaScript. Inspector qualification passes on Chromium, Firefox and WebKit in Linux, resolving the local Firefox-startup verification gap from §1390. No dependency pins, skipped checks or runtime compatibility workarounds were introduced. The hosted settings test also waits for preference restoration after navigation; the package behavior was already correct.

Successful publication runs: core 39132821685, examples 39134005640, JavaScript/serverless 39134746023 and DevTools 39133393250. The JSR registry accepted 0.3.2 during a slow first attempt; its interrupted job was retried, recognized the existing version, and completed successfully. npm/PyPI propagation was allowed to finish before dependent releases. CI-triggered deployment runs 39133650279, 39134332959 and 39135036999 succeeded. The remote verifier was rebuilt for the approved removal of the footer download link before deploying examples 0.3.4.

Both https://gallery-py.gramlot.dev/ and https://gallery-js.gramlot.dev/ run generation `20261018T141451Z`, with core 0.3.2, examples 0.3.4, JavaScript/serverless 0.2.13 and Python adapter 0.2.10. Both download endpoints return the identical, intact regenerated archive, SHA-256 `2c89c42a99277d557c2fc154fc522c73690dddd8ffe0db3143e6bfe81f6eb780`; its versions.json matches the deployment receipt. The deployment checks 25 widget pages, binding, validation, remote validation, public URLs and archive hashes. Additional Chromium/WebKit checks cover online settings, iframe outside-click dismissal, themes, retained edits and delayed carousel previews. The two indices display Python and JavaScript source respectively and omit the ZIP link. The official extracted ZIP also passes settings and retained-carousel checks from file:// in Chromium/WebKit. The DevTools download has an intact ZIP and manifest version 0.1.4. No Chrome Web Store submission was performed.

Release and online rollout are complete. Future changes resume on develop; the separately developed c23 lesson and other unrelated local work are outside these released artifacts.


### Create gallery tabs on first selection — 2026-10-18

Owner: “si procedi così per entrambe le gallery: crea il tab solo al click, riusa quello già aperto e poi verifica quanto migliorano i tempi”, clarified “in pratica al cloch devi aggiungere al source il pane con l'iframe giuso”. Publication explicitly authorized: “Sì, pubblica e aggiorna le gallery”, in response to the bounded corrective-release question for core/examples and CI deployment.

The generic index accepts deferred entry creation, deduplicates pending selections and retains opened entries; the gallery creates its pane/iframe and code Source on first selection through the existing remoteSource lifecycle. Initial Source contains only navigation and Introduction. Older replies cannot override the latest selection. Reopening retains iframe identity and example Data. No dependency implementation, Source activation contract, cache policy or other feature is changed.

Qualification: core index 7 tests; examples Python 19 and JavaScript 110 tests; full core JS 3564 checks including successful reruns of 3 loopback-dependent and 5 rebuilt-artifact checks. Chromium/WebKit pass both hosted candidates and offline tab creation/reuse, code, inspector and mobile presentation. Online l04 guided playback passes; offline guided playback has an existing file-origin limitation reproduced in the preceding export.

Three interleaved cold/repeat browser pairs per environment on the same remote server, identical gzip/cache and 1 CPU/512 MiB limits: Python index median 2654→1311 ms cold, 2194→971 ms repeat; JavaScript 2435→1282 and 1921→766 ms. First example after click takes about 1.3 s versus 0.8–0.9 s because its Source is now built on demand; combined index plus first example remains faster. Initial panes 85→1, iframes 79→0. Small controlled samples are not performance guarantees. Evidence: examples deploy/galleries/reports/2026-10-18-lazy-tabs.json.

Release preparation uses isolated copies to exclude concurrent database-selector work and the unpublished c23 website lesson. The isolated release core passes all 3560 JavaScript tests and 168 Python tests plus 266 subtests (one existing expected failure); loopback conformance checks pass with listener permission. Publication followed the successful release gates; final public results are recorded below.


Publication and public verification completed: Gramlot core 0.3.3 is on PyPI/npm/JSR; examples 0.3.5 is on PyPI/npm. Both release workflows and both resulting gallery-update workflows succeeded. Examples Bun initially encountered PyPI propagation; its failed job and downstream publication were rerun successfully. JSR completed normally. Public generation `20261018T172328Z` uses unchanged Python adapter 0.2.10 and JS/serverless 0.2.13. The regenerated ZIP is intact, contains the matching version receipt and excludes unpublished c23; SHA-256 `463e77d11904f77d8f468dd43f3ca15d03f8e2178b47f353a3ab99e977761640`.

Chromium/WebKit pass both public hosts and the extracted official ZIP for on-demand Source, identity/Data retention, code/explanations, inspector and mobile. Guided playback is verified online; the pre-existing file-origin limitation is unchanged. Both HTTPS hosts return gzip, reject the old generation validator with 200 and return 304 for the new one.

Public HTTPS medians over three cold/repeat pairs per host: Python index 2149→1461 ms cold and 1763→819 ms repeat; JavaScript 1944→1465 and 1076→882 ms. First selection is now about 1.3 s versus 0.6–0.7 s; reopening takes about 50–60 ms and no new lesson request. These sequential public samples show a smaller gain than the controlled candidate comparison. Combined index plus first example is nearly unchanged for Python cold, improves for Python repeat, and is slower for JavaScript in this sample. This tradeoff must remain explicit; index improvements do not imply that every end-to-end path is faster. Full evidence and CI URLs are in the examples measurement report.

Private comparison containers/proxy and local test servers/tunnels are closed. Release source was prepared in isolated copies, preserving concurrent database-selector and c23 work. Implemented, verified and owner-authorized publication is complete.
