# 070 · Release and current development status

Document ID: **GC-070**. Updated: **2026-10-15**.

**Inspector CSS variables:** the Styles trial and CSS download are implemented; locally verified; owner visual acceptance pending. See [§945](#gc-070-945).

**Themes and CSS guide:** GC-096 implemented and locally verified, including larger inline results with responsive code/result comparisons, reader-facing headings, the complete token catalogue and practical guidance; see [§950](#gc-070-950), [§935](#gc-070-935), [§930](#gc-070-930) and [§925](#gc-070-925).

**Graphic assets:** rich identity kit implemented and verified (2026-10-02); new vector artwork and layouts await owner visual acceptance. See [§650](#gc-070-650).

**Reusable index and root installation:** implemented and locally verified; see [§785](#gc-070-785). The stale Kajenn test environment is now updated and the full adapter suite passes.

**Next release direction:** publish/subscribe targets 0.2.18 by owner agreement (§865); legacy review and release scope remain to be defined. Other [workstream priorities and parallel assignments](../future/README.md) remain open; website/system-Data notes are retained.

**Deferred website design:** editorial HTML companions and two interactive-region modes for gramlot.org, asqueel.org and kajenn.org are recorded for later discussion (§850); no implementation started.

**Practical entry page:** GC-018 and the optional Chrome extension installation link are implemented and locally verified; publication pending (§845).

**Documentation follow-up:** all four public manuals are aligned; the examples Read the Docs site is live with 41 lessons and complete Python/JavaScript sources. Hosted documentation and CI checks passed (§840).

**Current checkpoint:** the integrated release is published and verified (§835): core 0.2.17 on PyPI/npm/JSR, examples 0.2.12 on PyPI/npm, JS server/serverless/create 0.2.9 on npm and Python server 0.2.8 on PyPI. All four release pipelines succeeded, including required tests, browser checks and clean-install gates. Teaching D1–D6 is owner-accepted (§790); additional remote/CustomTypes enforcement remains owner-deferred (11.66), Q2 is unchanged and the Date/Decimal authoring exercise is deferred pending Bag #69. Qualification details and limits are in §§825–835.

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
