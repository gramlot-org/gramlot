# 110 · Native HTML 0.1.0 readiness plan

Document ID: **GC-110**. Updated: **2026-09-24**.

<a id="gc-110-010"></a>
## 1. Objective and constraints

Deliver a reviewed, locally installable Gramlot 0.1.0 foundation for native HTML
and live Source, suitable for subsequent bounded work. This is the current execution
plan; earlier plans remain historical evidence where superseded by the constitution.
Implementation, verification and owner acceptance are separate statuses.

Included: typed SourceBag/SourceBagNode, Python and JS Page authoring, bootstrap
through the owning HtmlBuilder, main/marked remote Source, synchronous FIFO live
updates, subtree freeze/unfreeze, cleanup, and the current host matrix.
Excluded: recipes, reactive Data binding, databases, component capabilities and
unapproved compatibility paths. Static Builder features do not imply live features.

Owner priority, 2026-09-22: reach the first release promptly with these limits
stated accurately, then add capabilities in later increments. Safari and Firefox
verification and the proposed CI grammar-drift check are follow-up work, not
additional 0.1.0 implementation gates. The local 0.1.0 gates remain reproducible
dependencies, bounded design review, the seven host profiles, accurate package
documentation and verified versioned artifacts. Publication still requires a
separate owner authorization.

Release sequence: ship the bounded 0.1.0 once its stated contract is verified,
then use real application trials to identify corrections for 0.1.1 and, if needed,
0.1.2. Once the 0.1.x correction cycle is stable, develop new capabilities for
0.2.0 on `develop`. Each increment follows the existing `develop` verification
and acceptance path before consolidation into `main`; this sequence does not
require 0.1.0 to anticipate every later correction.

Keep existing local changes. This local readiness plan does not authorize publication or deployment. Source preparation and an already authorized owning-project push are distinct from package publication, version closure and deployment; check the applicable owner instruction before external writes.
Do not modify Bag or Builder sources or installed copies under this plan. Missing
upstream capabilities require an owner decision, never a consumer workaround.
First-party dependencies remain floating; revisions/digests below are evidence,
not installation pins. Unresolved architecture stops only the affected work.

<a id="gc-110-015"></a>
## Current decision register — 2026-09-22

| Decision | State and evidence | 0.1.0 consequence |
| --- | --- | --- |
| Native HTML and live typed Source, seven hosts | Current; owner scope recorded in GC-120 §010 and this plan §1–2 | Recipes, reactive Data binding, databases and new components are deferred; old 8/8 is historical. |
| One SourceBag/SourceBagNode path; FIFO, freeze/unfreeze | Current; constitution §13 and GC-110 implementation checkpoints | No plain-Bag Source, speculative DOM rollback or tag-only mutation. Replace element type by delete/insert. |
| Ordered Collection add/update | Current; constitution 11.14 | Omitted/null fields retain definitions; explicit named child rules may be updated. |
| Python dialect ownership | Current; constitution 11.16, installed wheel check | Gramlot owns packaged grammar loading, TYTX registration, mixed text and rejected insertion for Python. |
| JavaScript generic `sourceTarget` | Current; constitution 11.18 supersedes 11.17 | Consume maintained generic Builder JS; do not duplicate its mapping in Gramlot. |
| DOM JS layer and recipes | Superseded/deferred; GC-087/080 historical, owner scope in GC-120 §010 | GramlotRenderer owns live DOM; no active recipe expansion path. |
| HTTP/close/Worker and Python loader | Current; GC-110 phase 3 and dated checkpoints | Adapter owns HTTP; HTTP close is best effort with TTL, Worker termination releases its registry; Python Host loads local pages. |
| JS Builder distribution and TYTX bundle | Resolved in owning projects; fresh GitHub install, core checks and browser build in §5 | No Builder mapping or TYTX shim in Gramlot; phase 2 review completed in §2.1. |
| Safari/Firefox and grammar drift CI | Deferred by owner; GC-110 §1 | Do not make them new 0.1.0 gates. |
| Publication/deployment | Separately authorized action; constitution §10/§14 | Local verification or source availability does not authorize package publication or deployment. |

<a id="gc-110-020"></a>
## 2. Ordered phases and completion gates

| Phase | Work and concrete deliverable | Completion gate | Status |
| --- | --- | --- | --- |
| 0. Baseline | Inventory versions, repositories, existing changes and decisions; retain evidence locations. | Current scope and historical results distinguished; no existing work lost. | Complete |
| 1. Dependency provenance | Locate source behind installed Bag/Builder/TYTX; compare upstream; build from identified owning source in fresh environments. | No indispensable anonymous temporary archive or edited installed dependency; reproducible installation documented. | Complete; Python wheel and fresh GitHub JS dependencies verified, browser bundle builds |
| 2. Implementation review | Trace bootstrap → main → typed Source → live renderer, plus remote, update, insert, delete, freeze and disposal. Review every class/state/path for ownership and real consumers. | No unapproved parallel paths, duplicated validation/rendering, or speculative rollback. Findings fixed only under agreed contracts; decisions recorded. | Complete; ownership trace and Host invariant correction in §2.1 |
| 3. Host and grammar decisions | Resolve HTTP versus shared Host duties, HTTP page closure, and Python HTML grammar distribution with concrete examples. | Owner decisions implemented in the owning layer; one documented execution contract across relevant hosts. | Complete; artifact comparison completed in §5.1 |
| 4. Current matrix | Fresh packaged installations; Python Uvicorn/FastAPI/Kajenn/Flask; JS Node/Bun/Worker. Exercise same bounded behavior. | Seven current profiles verified or explicit blockers; old eight-profile result not reused. | Complete; fresh local packages and Chromium 7/7 in §3.1 |
| 5. Documentation and packaging | Review README, public Sphinx, internal operating guide, repository maps, mirrors, exports, package contents and notices. | Documentation matches actual code; examples install without sibling-source imports; internal architecture excluded from public site. | Complete; current package/documentation evidence and external notice gaps in §5.1 |
| 6. Local version closure | After preceding gates, prepare 0.1.0 artifacts, verify installation and record final diff review, limitations and handoff. | Versioned artifacts verified; unresolved blockers clearly separate from deferred features; owner acceptance requested. | Complete locally; §6.1–6.2, owner acceptance pending |

Each phase records files changed, architectural rationale, verification evidence,
remaining questions and next action here and in GC-070. A passing test cannot close
an implementation-design finding. Do not bump merely to disguise an unfinished gate.

<a id="gc-110-025"></a>
### 2.1. Implementation and ownership review — 2026-09-23

| Path and retained state | Owner and concrete consumer | Review result |
| --- | --- | --- |
| Python and JS `Page` declarations, marked Source methods, `GramlotBuilder` and typed TYTX | Page authors use the respective Builder; neutral `Host` executes a fresh Page and Builder per main/remote request. Python owns packaged dialect loading and mixed-text insertion; JS consumes generic Builder grammar and `sourceTarget`. | One typed Source contract crosses both languages. No plain-Bag coercion or second authoring tree. |
| `Host` page registry, identity, expiry and capacity | Neutral Python/JS Host owns page records; Python host adapters, JS FileHost/Node/Bun adapters and WorkerHost consume its execution methods. HTTP parsing/close belongs to adapters; WorkerHost delegates to Host and Worker termination releases its registry. | One main/remote execution path per language. A finite-expiry invariant defect was fixed in both Hosts: nonnumeric, nonfinite or overflowing TTL and invalid capacity now fail at construction. |
| Bootstrap, `Gramlot` roots and transport | Host generates HTML without executing `main`; `Gramlot.start` loads main through MainTransport or WorkerTransport. `startSource` is the documented embedded typed-Source entry and uses the same `mountMainSource` path. | One initial Source insertion. MainTransport owns HTTP request/close; WorkerTransport owns pending messages and Worker termination. |
| Source observation, DOM records, references and pending FIFO | `GramlotRenderer` owns live DOM and subscription; generic RendererBase resolves dialect rendering, `HtmlElement` applies native HTML/SVG, `References` maps mounted identities. Public and test consumers use live updates, references and embedded/remote Source. | Candidate checks guard a Source write; per-node validation guards later direct edits. These are different boundaries, not duplicate rendering paths. No separate DOM projection or speculative rollback. |
| Remote request map and branch freeze flags | `Gramlot.remoteSource` owns latest-request cancellation and prevalidates a replacement; the renderer owns mounted-target cleanup, freeze/unfreeze and branch reconciliation. | Insert/update/delete/replacement use Source events and the same renderer. Frozen branches keep Source changes, then rebuild once; removed branches and disposal release records, references and callbacks. |
| Disposal and failure state | `Gramlot` aborts main/remote work and disposes the renderer; MainTransport best-effort closes the HTTP page, WorkerTransport terminates its Worker. Renderer cleanup aggregates callback failures after releasing records. | Failure after a Source write propagates under the approved no-rollback contract. No extra recovery state was introduced. |

Review found no unapproved parallel path, duplicate renderer or speculative rollback.
The Host correction changed `js/src/adapters/host.js` and `src/gramlot/server/host.py`
with focused regressions. Local core verification after the correction: Node 75/75
with the existing Python test environment, Python 17/17. The first direct JS host
run lacked `GRAMLOT_TEST_PYTHON` and failed only its cross-language test; the
complete rerun with that existing environment passed. These local checks do not
replace the fresh seven-profile packaged matrix in phase 4. No architecture
decision or amendment remains open for this phase.

<a id="gc-110-030"></a>
## 3. Verification and review contracts

Review responsibilities first: Bag owns tree/events/serialization capabilities;
generic Builder owns its shared grammar and static rendering; Gramlot owns bounded Python dialect loading/transport/insertion under amendment 11.16 and live
rendering and shared Page/Host contracts; engine adapters own engine integration;
standalone owns bundling, using the same JS Page execution through WorkerHost.

For each host verify bootstrap and main, typed nested Source, text/attribute update,
insertion, deletion, replacement, remote Source, freeze/unfreeze and cleanup.
Reject plain Bag as Source. No reactive Data binding is asserted. Test authoring
through installed packages, not application DOM construction or sibling imports.

Browser evidence distinguishes Chrome, Playwright WebKit, Safari and Firefox.
WebKit is not a Safari verification claim. State Safari and Firefox as unverified
for 0.1.0; do not claim support from other browser evidence. Compare Python Builder's two
previous failures in a clean dependency environment; never dismiss a new failure
merely because another environment had a similarly named failure.

<a id="gc-110-035"></a>
### 3.1. Fresh packaged seven-profile matrix — 2026-09-23

Built local wheels for current Gramlot, FastAPI, Flask, Genro ASGI and the Python
example; built current Gramlot browser/standalone bundles before rebuilding its
wheel. Packed current Gramlot JS, Node/Bun adapter and JS example. Installed the
wheels with resolved dependencies into a new Python 3.12 environment and the JS
archives with their declared dependencies into a new npm consumer. Isolated imports
resolve under those environments, not sibling source checkouts. Python dependency
check passes (49 packages); the installed Python and JS Hosts reject infinite TTL.
These are current locally built packages, not registry releases.

| Chromium profile | Result | Execution owner |
| --- | --- | --- |
| Raw ASGI/Uvicorn | Pass | Installed `NativeHtmlASGI` on Uvicorn |
| FastAPI | Pass | Installed `NativeHtmlApplication` |
| Kajenn | Pass | Installed `KajennNativeHtmlApplication` on actual `BaseServer`; this does not claim Orchestra registry integration |
| Flask | Pass | Installed `mount_native_html` |
| Node | Pass | Installed `gramlot-nodejs` native server |
| Bun | Pass | Installed `gramlot-nodejs` Bun server |
| Worker | Pass | Installed Gramlot standalone runtime and WorkerHost; no HTTP(S) requests |

Each profile passed bootstrap, one typed nested main Source, scalar/attribute
updates, insertion, nested update, deletion, replacement, marked remote Source,
freeze/unfreeze, plain-Bag Source rejection and renderer disposal without page
errors. The six server profiles also released their page registry entry after
browser disposal; the Worker transport terminated. Installed FastAPI and Flask
adapter protocol tests pass 3/3 each, and generic ASGI/Kajenn pass 2/2, covering
request ownership, remote errors, limits, assets and close routes. Evidence:
`/private/tmp/gramlot-phase4-20260923/{artifacts,logs,results.json}` and its
temporary test harness. Chromium is the browser exercised; Safari and Firefox
remain unverified. This closes the current matrix gate, not documentation,
packaging review, local 0.1.0 version closure or owner acceptance.

<a id="gc-110-040"></a>
## 4. Historical baseline and later findings

**Historical baseline recorded 2026-09-21.** The following Bag-archive concern and open-decision list were superseded by the dated resolutions in section 5 and [GC-115](115-bag-upstream-audit.md). Current phase states are only in section 2.

Core versions remain Python 0.0.0.dev1 / JS 0.0.0-dev.1. Prior local evidence:
Python 16, Node 72 and Bun 72 tests passed; installed Builders Python 0.23.4 and
JS 0.1.3. These are prior results, not a fresh-install gate. Standalone exporter
and real-browser Worker checks are complete locally; license notices remain inert
metadata with no application panel. See GC-070 for evidence and chronology.

Dependency blocker under investigation: multiple Bag JS 0.5.2 archives contain
different code. The currently working archive is in /private/tmp/gramlot-strict-source.
Its required behavior must be traced to maintained source, not preserved as a pin.
Read-only upstream check on 2026-09-21: Bag HEAD f324b05535228372f042b813b2d9d182759aca39;
Builder JS HEAD 19549f81a6171bf65d48e0447cb9f57bc1d94292.

Questions at that historical checkpoint: Python Host currently resolves files itself whereas JS has FileHost;
JS Host also handles HTTP Request/Response whereas Python adapters handle HTTP.
Worker disposal terminates its host; HTTP browser disposal does not yet close the
server page record. Python uses a packaged HTML grammar snapshot, JS inherits its
dependency's grammar. These observations are not approval of a new class hierarchy.

<a id="gc-110-050"></a>
## 5. Finish criteria

Ready means agreed code ownership, one primary path, reproducible packages, current
matrix evidence and accurate documentation. Deferred features are explicitly named.
Owner acceptance and publication are distinct; publication is outside this plan.
No claim of upstream readiness while required source changes remain unpublished.

<a id="gc-110-055"></a>
### 5.1. Documentation and package review — 2026-09-23

README, the six public guides and their concise mirrors now distinguish the
implemented native HTML core from the richer experimental PoC, reflect the fresh
GitHub dependency installation and current Chromium 7/7 matrix, and preserve the
deferred binding/controller/component limits. The internal operating guide and
repository map now route to GC-070/110 and the declared dependency path instead of
the superseded local-archive workaround. Strict Sphinx with warnings as failures
passes; public staging has exactly six guides plus README and branding. Search,
downloadable sources, local links and paired public anchors pass the boundary
check. Internal architecture and `docs_llm` are absent from the generated site.

The Gramlot JS prepack now copies the repository LICENSE and NOTICE into the JS
archive. Its 20 entries include both notices, hosted/standalone bundles, runtime
notices and targets for all seven declared exports; no internal documents or tests.
The new Python wheel has 21 entries, including LICENSE/NOTICE, browser resources and
HTML5/SVG collections. Its three browser resources match the JS archive byte for
byte; its two collections match the installed generic Builder JS export byte for
byte. Packaged code/resources contain no local absolute source paths. The phase 4
example packages ran from fresh installed environments without sibling-source
imports. No version bump, registry release or deployment occurred.

Separate owning-package observations for version closure: the installed
`genro-tytx` JS package has Apache-2.0 metadata but no LICENSE/NOTICE files, which
the generated runtime notices disclose. The locally packed `gramlot-nodejs` and
Hello World JS example archives also lack their own LICENSE/NOTICE files. These
archives belong to other repositories; this phase changed only Gramlot packaging.
On 2026-09-23 the three owning checkouts gained matching Apache-2.0 LICENSE and
package-specific NOTICE files. NodeJS and Hello World JS now declare Apache-2.0
in npm metadata; the example Python metadata also declares it. Fresh local npm
archives for all three contain both files; new TYTX and example Python wheels do
too. Evidence: `/private/tmp/gramlot-notice-repair-20260923/`. At this phase-5 checkpoint, these owning-source
changes remained local and had not been pushed or released. TYTX was subsequently
updated on GitHub; the refreshed clean-install result is recorded in §6.2. The fixes do not
alter the verified core exports or seven-host behavior, and are not acceptance or
publication decisions.

<a id="gc-110-060"></a>
### 6.1. Local 0.1.0 version closure — 2026-09-23

Python and JS manifests now declare 0.1.0. Freshly built local artifacts are
`gramlot-0.1.0-py3-none-any.whl` (21 entries) and
`gramlot-native-html-0.1.0.tgz` (20 entries). Both include LICENSE/NOTICE;
the wheel's three browser resources match the npm archive byte for byte, and
all seven JS export targets are present. A clean Python 3.12 environment
installed the wheel with declared dependencies, passed `uv pip check`, imported
`GramlotBuilder`, serialized typed Source, and found all three browser resources.
A new npm consumer installed the archive with its declared GitHub dependencies;
all seven export targets exist and the source entry points import. Core checks
pass Python 17/17 and JS 75/75 with the installed Python test environment and
MessagePack test extra. Evidence: `/private/tmp/gramlot-phase6-20260923/`.

Final scope/diff review covered the two version manifests, the SVG namespace
correction, its cross-language test, TYTX registration in the JS test subprocesses,
package entries and the previously reviewed ownership boundaries in §2.1.
The Python-origin SVG `foreignObject` now renders in the SVG namespace while its
HTML child remains XHTML. No dependency pin, second Source path, server-specific
core import or new public feature was added. `git diff --check` passes. The
versioned artifacts were not rerun through the entire seven-host Chromium matrix;
that matrix belongs to the preceding development artifacts in §3.1.

At the initial phase-6 build, the GitHub TYTX dependency lacked LICENSE/NOTICE,
so the runtime notice retained a metadata-only fallback. TYTX issue #44 later
closed with the owning-source files; §6.2 records the refreshed artifacts.
The NodeJS and Hello World notice corrections remain local. These are
owning-source distribution tasks; they are separate from the deferred
Safari/Firefox, grammar-drift CI, Data binding, recipes and database work.
No package release, deployment, source push or owner acceptance occurred in
this phase. The local 0.1.0 artifacts are ready for owner review; acceptance
and any publication decision remain with the owner.

<a id="gc-110-065"></a>
### 6.2. TYTX GitHub notice refresh — 2026-09-23

TYTX's owning repository now contains Apache-2.0 LICENSE and NOTICE (commit
`e113806`; [issue #44](https://github.com/genropy/genro-tytx/issues/44) is closed).
A fresh install of the declared `github:genropy/genro-tytx` dependency resolved
current source `ea27462`; its installed root contains both files. The initial
Gramlot build still emitted a fallback because TYTX also has `js/package.json`:
the notice collector selected that nested manifest's directory while its legal
files live at the outer package root. Gramlot now walks outward only across
manifests with the same package name before collecting legal files. This keeps
the notice attached to the package that supplied the bundled code without
changing dependency pins or runtime APIs.

A clean GitHub dependency install and rebuilt browser bundle now include the
Apache license and Softwell NOTICE in TYTX's runtime-notice entry, with no
metadata-only fallback. Core JS tests pass 75/75 against that fresh graph.
The regenerated 0.1.0 npm archive (20 entries) and Python wheel (21 entries)
contain byte-identical browser resources, including the complete notice.
Both artifacts install in new npm/Python 3.12 consumers; the Python dependency
check and typed Source smoke pass. Evidence:
`/private/tmp/gramlot-tytx-refresh-20260923/` and the updated artifacts under
`/private/tmp/gramlot-phase6-20260923/artifacts/`. NodeJS and Hello World
owning-package notice changes remain local. The seven-host Chromium matrix was
not rerun on these regenerated archives. No release, deployment or owner
acceptance occurred.

<a id="gc-110-070"></a>
### 6.3. Approved ecosystem alignment — 2026-09-23

The owner approved resolving GC-130's bounded release-alignment findings with a
Sol subagent and coordinator review. Native adapter APIs/launchers and native-only
public exports now match primary paired documentation; old PoC APIs are explicitly
outside the profile. Python dialect ownership docs are corrected, older consumers
excluded, and GC-135 records the nine-package local artifact delivery protocol.
No new runtime path, alias, version bump or dependency modification was added.

Fresh installation of all five wheels/four npm archives with network-resolved
floating dependencies passes, including pip check and native/star imports.
Installed core Python 17/17, adapter tests 8/8, four Python launcher HTTP checks,
final-graph Chromium 7/7 and exported standalone file checks pass. Strict core and
three native Python adapter Sphinx builds pass. This final-artifact matrix supplements
the earlier phase-4/6 evidence; Safari/Firefox and full PoC suites remain excluded.
See [GC-130 §035](130-release-ecosystem-review.md#gc-130-035) for review and evidence,
and [GC-135](135-release-handoff.md) for delivery. Local payload:
`build/release-candidate/0.1.0/`. The alignment is complete; acceptance, source
consolidation and external publication remain owner decisions.

### HTTP page-close lifecycle — 2026-09-22

Owner accepted the lifecycle contract and clarified that Gramlot includes connected
adapter repositories. Explicit browser disposal sends a close request;
non-persisted `pagehide` sends a JSON beacon; persisted pages remain active; TTL
handles delivery failure. Both Host bootstraps configure `closeUrl`. The Node/Bun
adapter owns HTTP parsing/routing; Python adapters pass prefixed close URLs. Hosts
retain owner-aware deletion. Core JS 74/74 and Python 16/16 pass; browser bundles
were rebuilt. Focused FastAPI 3/3, Flask 3/3 and Genro ASGI/Kajenn 2/2 tests
pass using Gramlot's verified Builder overlaid into their older environments.
Node/Bun real listener tests pass. Chrome verified explicit disposal and pagehide
server cleanup through the installed local Gramlot package on both adapters.

This is local implementation and verification, not owner acceptance or fresh
seven-profile installation. Python adapter virtualenvs still contain an older
Builder, and npm offline could not resolve an uncached Builder Git archive; the
locally packed Gramlot archive alone was installed for the Node/Bun check. An
initial automatic approval review rejected adjacent edits; the owner's explicit
clarification resolved the scope boundary. No Builder/Bag source changed, commit,
version bump, publication or deployment.

### Kajenn Orchestra registry review — 2026-09-22

The owner chose a single-process minimal Host: retain its bounded local page
registry without a reduced Orchestra copy or user/connection registers. An
eventual Orchestra-managed application is separate work and must use Orchestra's
worker-owned registers.

Read-only inspection of `kajenn-orchestra` found a different hosting model from
the current native HTML Kajenn adapter. `SpaWorker` owns linked user, connection
and page registers; page rows and user rows hold live stores. Worker events update
commander routing indexes; `SpaApplication` forwards by its `spa_connection_id`
cookie. Freeze/adopt serializes and reconstructs connection/page rows, preserving
page identity. The existing `KajennNativeHtmlApplication` mounts on
`genro_asgi.BaseServer` and retains the process-local neutral Gramlot Host
registry with a separate `gramlot_owner` cookie. Its successful profile checks
do not prove managed-app operation through Orchestra; Gramlot page records would
not follow an Orchestra user migration. Orchestra's `asgi_app` worker seam and
registry subclass hook are concrete integration points, not an approved adapter
contract. Focused Orchestra registry tests 43/43 and worker tests 26/26 pass.
No Orchestra files changed. Before claiming an Orchestra-managed profile in future work, define
page ID creation, request owner/connection identity and registry authority against
Orchestra's lifecycle; do not add a parallel state system.

### Python page loader decision — 2026-09-22

For the minimal single-process release, retain the existing directory-backed
`Host.resolve_page()` implementation. All current Python host adapters and core
fixtures construct `Host` with a pages directory. A separate Python `FileHost`
would add a class without a second concrete loading mode or consumer. This does
not change the JS `FileHost` boundary or approve arbitrary page sources.

### Python HTML grammar distribution — 2026-09-22

The existing canonical HTML5 JSON is exported by `genro-builders-js` from the
Python HtmlBuilder grammar. Gramlot's `scripts/export_collections.py` locates the
export in the installed Builder JS package and copies it into Gramlot's Python
package. Python-only deployments read that packaged resource, with no npm runtime
dependency. CI should fail when Gramlot's packaged copy differs from the installed
Builder JS export. This check is a stated CI requirement, not implemented in this
minimal increment; local artifact comparison is complete in §5.1. Do not maintain another
vocabulary or generate it on each application startup. Current installed JSON
copies are byte-identical; a fresh
Python HtmlBuilder export matches semantically (117 elements). This applies the
existing GC-087 §070 source-of-truth decision; the remaining work is release
verification, not a new architecture decision.

### Builder JS distribution and fresh installation — 2026-09-22

The owner directed the pending distribution step. The maintained generic Builder
JS 0.1.3 source was committed in its owning project and pushed to the new public
`genropy/genro-builders-js` repository at a3a58608bfb3bcf4fbc2cb4a17fb0b1a88459a03.
The former GitHub path had redirected to legacy `genro-dom-js` 0.1.0; the
declared `github:genropy/genro-builders-js` dependency now resolves the generic
0.1.3 package and exports `sourceTarget`. No Builder API/source correction, Bag
edit, package-registry publication or release was made in this step.

A fresh temporary npm installation resolves Builder at a3a5860, Bag at
f324b055 and TYTX at 6b9bf3a. Builder source tests pass 109/109 with these
dependencies. Gramlot JS core passes 74/74 with the fresh npm dependencies and
the existing Python test environment. Browser bundling fails: TYTX 0.15.0 at
6b9bf3a imports Node's `module` in its registry/encoding modules, which the
browser esbuild target cannot resolve. This was an owning-project defect at that checkpoint; no Gramlot fallback
or dependency pin was authorized. Phase 1 remained open until the later TYTX
correction and clean browser build recorded below.

### TYTX browser correction and clean GitHub check — 2026-09-22

The owner explicitly authorized a bounded TYTX owning-project correction after
the Builder source distribution. TYTX replaced Node-only `createRequire` imports
with conditional Node/browser dependency modules, added a browser-bundle regression,
and regenerated its browser artifact. Source commit c8016d4cf2d332dcdad5c523084236543f59d346
is available on the default GitHub branch. No Gramlot compatibility path, dependency
pin, Bag edit or package-registry release was added.

TYTX passes 850/850 JavaScript tests, including the browser bundle and local
cross-language HTTP exercise; its push checks pass 731/731 Python tests. A new
temporary Gramlot JS installation from the declared GitHub dependencies resolves
Builder a3a5860, Bag f324b055 and TYTX c8016d4. With the existing Python test
environment, Gramlot JS passes 74/74; the browser and standalone bundles build.
This closes dependency provenance phase 1. It does not verify the seven packaged
host profiles, phase 2 design review or 0.1.0 acceptance.

### Historical clean dependency installation — 2026-09-22

Later checkpoint on 2026-09-22: the owner requires the latest generic Builder JS
for both Gramlot development and fresh installers. Gramlot's Python dialect now
loads grammar 1.1 locally; its installed wheel passes Python core 16/16 with
published Builder 0.23.2. Gramlot JS passes 74/74 with local generic Builder JS
0.1.3, and that Builder passes 109/109 against current Bag/TYTX. The declared GitHub
dependency still resolves to legacy `genro-dom-js` 0.1.0. The local 0.1.3 source
has no remote configured, so installer availability remains the release blocker.
The initial clean-install findings below are retained as historical evidence.

A new Python 3.12 virtualenv installed Gramlot from this checkout with unconstrained
published dependencies: Bag 0.25.1, Builder 0.23.2 and TYTX 0.15.0. Installation
and `pip check` succeeded, but constructing `GramlotBuilder()` failed because
published Builder lacks `load_grammar`. The maintained Builder Python default
branch at `c6e4684` also lacks that method; the working 0.23.4 implementation is
local. A new npm installation of Gramlot's Git dependencies succeeded and resolved
Bag JS `f324b055`, TYTX `6b9bf3a` and Builder JS `19549f81`. The latter default
branch still packages `genro-dom-js` 0.1.0, without `sourceTarget`; importing the
current GramlotBuilder from this clean installation fails on that missing export.
The working Builder JS 0.1.3 implementation is local. At the time of this probe,
both paths required further work. The later Gramlot Python change above resolved
the Python failure; Builder JS distribution remains the current clean-install
blocker. These probes used `/private/tmp/gramlot-deps-audit.nRxrGR`;
no dependency source, installed copy or manifest was edited. Do not add a
Gramlot fallback or first-party pin. Identify the exact upstream changes and then
repeat the clean seven-profile matrix.

Isolation check in the same fresh environments replaced only Builder Python with
a wheel built from a temporary copy of local 0.23.4 source and Builder JS with a
tarball from local 0.1.3 source. Published/default-branch Bag and TYTX remained
installed. Python core passed 16/16; JS core passed 74/74. The first JS run failed
only because the temporary test tree omitted `tests/export_fixture.py`; after
copying that fixture, the complete run passed. This proves local Builder source
compatibility with the maintained Bag/TYTX packages, not availability of the two
Builder artifacts from maintained package/default-branch channels.

**Historical September 21 investigation below.** Its pending permissions, tag decision, host/lifecycle/grammar questions and phase-3 state were resolved by later dated checkpoints above and the current phase table in §2. Preserve the original sequence as evidence; do not execute these as open tasks.

### Execution evidence — 2026-09-21

Installed Bag JS src matches the full src tree in
/Users/gporcari/Sviluppo/gramlot/worktrees/genro-bag-js-native-html. Its HEAD equals
upstream HEAD, but its source has uncommitted changes, including the node creation
hook and tag-change events. At this September 21 checkpoint, dependency-source review authorization was pending
under constitution §14; no Bag modifications made.

Code review found Gramlot.dispose skipped transport disposal when renderer cleanup
threw. Changed the existing sequence to try/finally; no new class or fallback.
Regression verifies transport release exactly once, DOM/record cleanup and error
visibility. Current installed-environment results: Node 73, Bun 73, Python 16 pass.
Logs: /private/tmp/gramlot-readiness-{node,bun,python}.log. These do not establish
fresh-upstream installation or close the remaining design review.

### Read-only Bag review completed

[GC-115](115-bag-upstream-audit.md) identifies two required capabilities, an unused
pre-write validation subsystem and a resolver value-loss regression in local Bag.
Isolated comparison: upstream66/73 versus local73/73. Dependency edits remain
unauthorized; do not consolidate all local changes. Backrefs already pass upstream.


### Python ownership comparison — 2026-09-21

Python SourceBag declares `_node_class = SourceBagNode`; grammar dispatch assigns
the subbuilder to `child._builder` after element creation (_grammar.py). Ordinary
nodes resolve their builder from their parent. Python does not require a Bag
`_createNode` hook for this behavior.

An isolated JS candidate removes SourceBag._createNode and initializes the existing
SourceBagNode builder slot from its parent SourceBag's insertion context or builder.
This uses upstream Bag.nodeClass construction, completing ownership before synchronous
insertion subscribers execute. No new Bag hook or Gramlot workaround is needed.
Gramlot with upstream Bag:71/73 pass (the two tag-mutation cases remain). Generic
Builder candidate:107/110 pass, including insertion-observer ownership and reentrant
insertion tests; the remaining three tests explicitly require local Bag mutation
validators. These are test consumers missed by the earlier runtime-only consumer
search; they do not establish a Python-port requirement for that API.

The owning Builder repository and installed dependencies are unchanged. Automatic
approval review rejected application to the external Builder repository, interpreting
'imitate Python' as inspection rather than explicit reopening of dependency edits.
No constitutional amendment landed. Explicit permission to change Builder JS is
required before application; no Bag edit is proposed. Candidate/logs remain under
the isolated audit directory and temp/bag-upstream-review.


### Approved correction applied — 2026-09-21

After explicit owner authorization, changed the owning Builder JS repository:
SourceBagNode initializes its existing builder slot from the parent SourceBag's
insertion context or builder; removed SourceBag._createNode. Added a synchronous
insertion-observer regression and documented the Python timing difference. No Bag
source or installed copy changed, no version bump or publication.

Verified actual corrected source copied to the isolated upstream-Bag environment:
Builder Node107/110 and Bun107/110. Three remaining tests require the local Bag
mutation-validator API. Gramlot Node71/73; five SVG failures are resolved and the
two local tag-mutation API cases remain. Logs: temp/bag-upstream-review/*applied*.log.
Working installations are intentionally not refreshed: their modified Bag constructs
nodes detached, unlike upstream's parent-aware nodeClass path. No compatibility
branch was added to support that local modification. The approved source correction
is complete; clean-install readiness and tag mutation remain open.


### Tag mutation comparison with Python — 2026-09-21

Read-only verification in Gramlot's Python environment: Bag.set_item updates
node_tag on an existing node before calling set_value. If value and attributes
are unchanged, set_value emits no event. SourceBag/SourceBagNode do not override
this behavior. Bag and HtmlBuilder.source both change div to section silently;
changing value too produces upd_value with the new tag. Python set_value has no
node_tag argument. The separate system environment behaves identically.

Upstream JS therefore matches Python for this case. The local JS setValue tag
argument and tag-only notification are extensions, not Python-port parity fixes.
The earlier 'event gap' finding describes a limitation for live tag updates, not
evidence that JS Bag must be changed to match Python. Static rendering sees the
new tag when explicitly invoked; live rendering needs a notification.

No runtime changes. Historical decision request, later resolved by delete/insert: keep in-place tag mutation outside the
current live contract and use existing delete/insert for element-type replacement,
or explicitly design an additional Source-layer operation. No new API approved.


### Element replacement accepted and upstream Bag installed — 2026-09-21

Owner approved delete plus insert for live element-type replacement; in-place
tag-only updates are excluded. Updated the two Gramlot tests to exercise explicit
replacement and old-record/DOM cleanup. No new API or runtime workaround.

Installed a package built from unchanged upstream Bag HEAD f324b055 and the
corrected Builder JS sources. Verified installed Bag src file hashes equal the
upstream snapshot. First-party manifests remain floating, no lockfile or version
bump. Rebuilt browser bundles. Installed core: Node73/73, Bun73/73, Python16/16.
Evidence: temp/bag-upstream-review/installed-*.log and build.log.

This removes Gramlot's dependency on the patched Bag archive. It does not establish
a fresh published dependency graph: corrected Builder remains local. Its three
validator-specific tests remain unresolved, distinct from the now passing Gramlot
suite. Other adapters/examples have not been reinstalled by this step; the current
full host matrix and broader readiness review remain open.


### Validator cleanup completed — 2026-09-21

Owner approved the bounded Builder JS cleanup. Removed the arbitrary-veto test;
preserved insertion-subscriber ownership checks with an explicit observation count.
Replaced the veto-dependent restoration case with a genuine upstream rejection:
node_label '#missing' fails before insertion. A detached prebuilt branch retains
its original builder. Therefore previousBindings restoration has a concrete purpose
and remains; the comment now describes Bag insertion failure instead of validators.
The subscriber-error case and reentrant insertion-context cleanup remain covered.

No addMutationValidator/removeMutationValidator/_createNode references remain in
Builder source/tests. Generic Builder:109/109 Node and109/109 Bun with unchanged
upstream Bag. Strict Sphinx succeeds. Packed corrected owner sources, refreshed
Gramlot's installation and rebuilt bundles; core Node73/73 passes. No Bag changes,
new API, version bump, dependency pins, lockfile or publication. Evidence:
temp/bag-upstream-review/{builder-clean-*,gramlot-clean-node,install-clean}.log.

At this September 21 checkpoint the three validator-specific test findings and source-ownership audit closed for the reviewed scope. Host/lifecycle/grammar decisions were then open; later dated checkpoints above settle them. This checkpoint did not verify the current seven-profile matrix or published dependency availability.


### Neutral JS Host / HTTP separation completed — 2026-09-21

Moved Host.fetch parsing/routing/HTTP error mapping into the existing shared
gramlot-nodejs/src/native-fetch.mjs. Adapter ownerForRequest supplies identity;
Host retains ownership checks and page execution. Removed the Host callback and
fetch method, with no forwarding alias or new class. Node/Bun use one dispatcher;
WorkerHost remains on neutral open/main/source methods.

Moved HTTP request validation coverage to the adapter's real-listener test and
changed Hello World's host test to call main directly. Removed the core's duplicate
HTTP bridge fixture. JS browser harnesses now require GRAMLOT_TEST_URL from a
running adapter; Python harness startup remains available. Paired public host guide,
core map and adapter guide updated. Local core/adapter/example installations refreshed
from packages with unchanged upstream Bag and corrected local Builder. No pins or
lockfiles, source publication or version bump.

Verified: core Node72/Bun72 (one HTTP test moved to adapter); adapter listener on
Node and Bun; installed Hello World; Chrome Node/Bun main/remote/live Source/freeze/
unfreeze/dispose; Chrome file Worker main/remote/live/dispose with no HTTP(S).
Strict Sphinx and public-doc boundary/link/mirror checks pass. Evidence under
temp/host-http-separation. This is not the full seven-profile refreshed matrix.

HTTP ownership part of GC-093 Q4 is settled. Python filesystem loader alignment,
At this historical checkpoint, HTTP page-close lifecycle and Python grammar distribution remained open; no decision
was inferred for them. At this historical checkpoint, GC-110 phase 3 remained in progress; the current §2 table marks it complete.


<a id="gc-110-070"></a>
## 7. Owner acceptance and archive release — 2026-09-24

The owner accepted the bounded native 0.1.0 and authorized GitHub archive
distribution. All six local phases are complete; the nine verified artifacts
are the release payload. Core and native adapter sources are consolidated through
develop into main. Native adapter CI/check runners now exercise the native
protocol, lint and strict documentation; all three local runners pass.
Publication receipt belongs in GC-070 and GC-135. No registry release, application
deployment or 0.2.0 feature work is included.

Release-gate follow-up: a pristine source checkout exposed a missing generated
resource directory in the JS build; the build now creates it explicitly. Adapter
native tests require their imports (no collection skips); hooks use the active
native environment and obsolete first-party lockfiles are removed. These changes
affect build/check tooling only; the delivered runtime is unchanged.
