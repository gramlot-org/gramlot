# 070 · Release and current development status

Document ID: **GC-070**. Updated: **2026-09-30**.

> **Naming (2026-10-02):** in the dated text of this document, "native" as the label of a release, profile, milestone, adapter, module, API or pages names the scope of the 0.1.0 milestone (no web components, no recipes). That label has no technical meaning; current documents do not use it ([GC-005 §030](../005-documentation-policy.md#gc-005-030)). "native" for browser controls, DOM events, HTML attributes, DOM operations, Bag events or platform APIs keeps its technical meaning. Dated text is not rewritten.


**Current checkpoint:** S16: qualification complete (Firefox by the owner, waivers R22, R24, L1); report [GC-215](215-qualification-0-2-0.md), see [§615](#gc-070-615). Earlier: S15bis: corrections from the review before qualification, see [§610](#gc-070-610); S15: documentation and leftovers delivered in GC-095, GC-090 and the internal documents, see [§605](#gc-070-605); S14: Q3 clear error for inline code under a strict CSP, verified in core and on Chromium and WebKit; gramlot-uvicorn, gramlot-js-server and gramlot-serverless verified from the reports of their delivery chats (2026-09-30), four blocked (deferred by the owner to after 0.2.0). See [§595](#gc-070-595).
**Binding continuation:** [GC-210](210-binding-contract.md) replaces GC-165; GC-175 is historical. S00 accepted; S01 closed by the owner with proof 11 as debt, S02 and S03 start (2026-09-28).
**Dependency fixes:** forbidden by owner decision, 2026-09-25; missing Builder behavior goes into GramlotBuilderBag/GramlotBuilderBagNode (S01). See [§495](#gc-070-495).
**Hosted CI:** core and runner workflow published; GitHub passes Python 18/18, JS 76/76 and runner 8/8. See [§400](#gc-070-400).
**Audit cleanup:** confirmed corrections implemented and locally verified; CI execution on GitHub remains pending. See [§385](#gc-070-385).
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

Current development includes the owner-requested 0.2.0 binding work (constitution
11.41), with the implementation boundaries clarified by 11.42. A Source-projection
prerequisite is implemented and tested ([§245](#gc-070-245)); the full binding flow
is not complete or accepted. The owner-confirmed [GC-210](210-binding-contract.md) supersedes the historical
GC-165/GC-170 contract-review pause; runtime phases still need individual authorization.
Runner isolation and the transfer of standalone integration to Minimal are
implemented and verified separately ([§270](#gc-070-270)); they do not change the
published artifacts or establish binding acceptance.

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
