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

Owner priority, 2026-09-22: deliver the first release promptly with known limits,
then add capabilities. Safari/Firefox verification and the proposed CI grammar
drift check are follow-up work, not new 0.1.0 implementation gates. Required local
gates remain reproducible dependencies, bounded design review, seven host profiles,
accurate packaging/docs and verified 0.1.0 artifacts. Publication needs separate
owner authorization.

Release sequence: verify and ship bounded 0.1.0 with stated limits; use application
trials to correct issues in 0.1.1 and, if needed, 0.1.2. After the 0.1.x cycle,
develop new capabilities for 0.2.0 on `develop`. Corrections also follow existing
`develop` verification and acceptance before consolidation into `main`.

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
| 2. Implementation review | Trace bootstrap → main → typed Source → live renderer, plus remote, update, insert, delete, freeze and disposal. Review every class/state/path for ownership and real consumers. | No unapproved parallel paths, duplicated validation/rendering, or speculative rollback. Findings fixed only under agreed contracts; decisions recorded. | Complete; §2.1 records the trace and Host correction |
| 3. Host and grammar decisions | Resolve HTTP versus shared Host duties, HTTP page closure, and Python HTML grammar distribution with concrete examples. | Owner decisions implemented in the owning layer; one documented execution contract across relevant hosts. | Complete; artifact comparison completed in §5.1 |
| 4. Current matrix | Fresh packaged installations; Python Uvicorn/FastAPI/Kajenn/Flask; JS Node/Bun/Worker. Exercise same bounded behavior. | Seven current profiles verified or explicit blockers; old eight-profile result not reused. | Complete; fresh local packages and Chromium 7/7 in §3.1 |
| 5. Documentation and packaging | Review README, public Sphinx, internal operating guide, repository maps, mirrors, exports, package contents and notices. | Documentation matches actual code; examples install without sibling-source imports; internal architecture excluded from public site. | Complete; §5.1 records evidence and external notice gaps |
| 6. Local version closure | After preceding gates, prepare 0.1.0 artifacts, verify installation and record final diff review, limitations and handoff. | Versioned artifacts verified; unresolved blockers clearly separate from deferred features; owner acceptance requested. | Complete locally; §6.1–6.2, owner acceptance pending |

Each phase records files changed, architectural rationale, verification evidence,
remaining questions and next action here and in GC-070. A passing test cannot close
an implementation-design finding. Do not bump merely to disguise an unfinished gate.

<a id="gc-110-025"></a>
### 2.1. Implementation and ownership review — 2026-09-23

Python/JS Page and Builder author typed Source; neutral Host executes fresh pages
for main/marked remote Source. Python owns dialect loading, JS consumes generic
Builder grammar. HTTP adapters own request handling/close; WorkerHost shares Host
execution. Host owns bounded, expiring, owner-checked page records. A real invariant
defect was corrected in both Hosts: nonnumeric, nonfinite or overflowing TTL and
invalid capacity are rejected at construction.

Host bootstrap excludes main. `Gramlot.start` receives typed Source through HTTP
or Worker transport; documented `startSource` uses the same mounting path. The
renderer owns Source observation, native DOM records, references, FIFO events,
freeze/unfreeze and cleanup. Candidate checks protect writes; node checks protect
later edits. Remote requests use latest-wins cancellation and renderer-owned target
cleanup. Disposal aborts work, releases records and closes/terminates transport.
Post-write failures propagate under the approved no-rollback contract. No parallel
Source path, duplicate renderer or speculative rollback was found.

Changed JS/Python Host and focused tests. Local Node 75/75 and Python 17/17 pass;
the first direct JS run lacked the existing Python test interpreter, then the
complete configured rerun passed. The seven fresh packaged profiles remain phase 4.
No architectural decision or amendment remains open for phase 2.

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
for 0.1.0; do not infer support. Compare Python Builder's two
previous failures in a clean dependency environment; never dismiss a new failure
merely because another environment had a similarly named failure.

<a id="gc-110-035"></a>
### 3.1. Fresh packaged seven-profile matrix — 2026-09-23

Current Gramlot, FastAPI, Flask, Genro ASGI and example wheels, plus Gramlot JS,
Node/Bun and example archives, were built locally. Gramlot bundles were rebuilt
before its wheel. Fresh Python 3.12 and npm environments installed those packages
and resolved dependencies; isolated imports point into the new environments.
Python dependency check passes (49 packages), and packaged Python/JS Hosts reject
infinite TTL. No registry release is claimed.

Chromium passes 7/7: Uvicorn, FastAPI, Kajenn on actual BaseServer, Flask, Node,
Bun and Worker. Each exercised bootstrap, typed nested main Source, scalar/attribute
update, insertion, nested update, deletion, replacement, marked remote Source,
freeze/unfreeze, plain-Bag rejection and disposal without page errors. Six server
registries release the browser page; Worker terminates without HTTP(S). Installed
adapter protocol tests pass FastAPI 3/3, Flask 3/3 and generic ASGI/Kajenn 2/2.
Kajenn result does not claim Orchestra registry integration. Evidence is under
`/private/tmp/gramlot-phase4-20260923/`. Safari/Firefox and later release gates
remain open; this closes only phase 4.

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

README, six public guides and mirrors now distinguish current core from PoC,
reflect fresh dependencies/Chromium 7/7 and state deferred features. Internal
guide/map route to GC-070/110 and declared dependencies. Strict Sphinx passes;
the public boundary check verifies six guides, README, branding, search, sources,
links and paired anchors, with internal architecture excluded.

Gramlot JS prepack copies root LICENSE/NOTICE. Its 20-file archive includes both,
bundles, runtime notices and all seven exports. The 21-file Python wheel includes
LICENSE/NOTICE, browser resources matching JS bytes and HTML5/SVG collections
matching installed Builder JS bytes. No local absolute paths are packaged. Phase 4
examples ran from installed packages without sibling imports. No version bump or
publication.

Separate owning-package observations: installed JS `genro-tytx` has Apache-2.0
metadata but no LICENSE/NOTICE files; Gramlot runtime notices disclose that.
The earlier NodeJS and Hello World JS archives lacked their own LICENSE/NOTICE.
On 2026-09-23 all three owning checkouts gained Apache-2.0 LICENSE and specific
NOTICE files; NodeJS/example npm and example Python metadata now declare the
license. Fresh npm archives for all three and TYTX/example Python wheels include
both files. Evidence: `/private/tmp/gramlot-notice-repair-20260923/`. At this phase-5 checkpoint source was local; TYTX later reached GitHub.
The refreshed clean-install result is in §6.2. No acceptance follows.

<a id="gc-110-060"></a>
### 6.1. Local 0.1.0 version closure — 2026-09-23

Python/JS manifests now declare 0.1.0. Fresh local wheel (21 entries) and npm
archive (20) contain LICENSE/NOTICE; the wheel's three browser resources match
JS archive bytes and all seven JS exports exist. A clean Python 3.12 install
passes dependency check, typed Source serialization and resource inspection.
A fresh npm consumer installs declared GitHub dependencies and imports source
exports. Core Python 17/17 and JS 75/75 pass with the MessagePack test extra.
Evidence: `/private/tmp/gramlot-phase6-20260923/`.

Final scope/diff review covered manifests, package contents, the Python-origin
SVG `foreignObject` namespace correction, TYTX registration in test subprocesses
and §2.1 ownership boundaries; `git diff --check` passes. No new feature, pin or
alternate Source path. The earlier seven-host Chromium matrix was not rerun on
these versioned artifacts. The initial phase-6 build saw TYTX's metadata-only notice; issue #44 later
closed and §6.2 records the refreshed artifacts. NodeJS/Hello World notice
fixes remain local.
These distribution tasks differ from deferred browsers, grammar-drift CI and
0.2.0 features. No release, deployment, push or owner acceptance. Local
artifacts are ready for owner review.

<a id="gc-110-065"></a>
### 6.2. TYTX GitHub notice refresh — 2026-09-23

TYTX GitHub now has LICENSE/NOTICE at `e113806` (closed issue #44); a fresh
GitHub dependency install resolved `ea27462` with both files. Gramlot's initial
notice build still missed them because TYTX has nested `js/package.json` but
legal files at its outer package root. The collector now walks outward only
across same-name manifests. No pin or runtime API changed.

Fresh GitHub build includes the Apache/Softwell TYTX notice without fallback;
JS tests pass 75/75. Regenerated 0.1.0 npm archive (20 entries) and Python wheel
(21) have matching browser resources and install in clean npm/Python 3.12
consumers; Python dependency/typed Source checks pass. Evidence:
`/private/tmp/gramlot-tytx-refresh-20260923/` and updated phase-6 artifacts.
NodeJS/Hello World notice fixes remain local. The seven-host Chromium matrix
was not rerun on regenerated archives. No release, deployment or acceptance.

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

Owner accepted explicit browser disposal plus non-persisted `pagehide` beacon,
with persisted pages kept active and TTL as delivery fallback, and clarified that
Gramlot work includes connected adapter repositories. Both neutral Hosts bootstrap
`closeUrl`; Node/Bun own the HTTP route, Python adapters pass prefixed close URLs,
and Hosts check ownership. Core JS 74/74 and Python 16/16; focused FastAPI 3/3,
Flask 3/3, Genro ASGI/Kajenn 2/2 and Node/Bun real listener checks pass. Chrome
verified server cleanup on disposal and pagehide for installed local Node/Bun
packages. This is local verification, not owner acceptance or a fresh seven-profile
matrix. Python adapter tests overlaid Gramlot's verified Builder because their
virtualenvs retain an older version; npm offline could not resolve an uncached
Builder Git archive, so the locally packed Gramlot archive was installed directly
for the Node/Bun check. Initial automatic review rejected adjacent edits before
owner clarification. No Builder/Bag source change, commit, bump or publication.

### Kajenn Orchestra registry review — 2026-09-22

Owner decision: minimal Host assumes one process and keeps its bounded local page
registry. Do not copy Orchestra or add user/connection registers to Host. An
Orchestra-managed adapter is separate future work using Orchestra's worker
registers.

Orchestra worker registers link page → connection → user, hold live stores and
freeze/adopt page rows; `SpaApplication` routes through `spa_connection_id` and
commander indexes worker events. Current `KajennNativeHtmlApplication` instead
mounts on `genro_asgi.BaseServer` with Gramlot's local Host registry and separate
`gramlot_owner` cookie. Current Kajenn tests do not establish managed-app use:
Host records do not follow Orchestra migration. Orchestra offers an `asgi_app`
worker seam and registry subclass hook, but no integration contract is approved.
Read-only registry 43/43 and worker 26/26 tests pass. No Orchestra edit. Define
page IDs, owner/connection identity and registry authority if an
Orchestra-managed profile is requested.

### Python page loader decision — 2026-09-22

Retain directory-backed `Host.resolve_page()` for the minimal single-process
release. Current Python adapters and fixtures all supply a pages directory; a
separate Python `FileHost` has no second loading mode or consumer. JS `FileHost`
is unchanged.

### Python HTML grammar distribution — 2026-09-22

The canonical HTML5 JSON is exported by `genro-builders-js` from Python
HtmlBuilder. The existing `scripts/export_collections.py` copies it from the
installed Builder JS package into Gramlot's Python package. Python-only installs
read the packaged resource without npm at runtime. CI should fail when the copy
differs from Builder JS's export; this check is required but not yet implemented.
Local phase 5 artifacts match; do not add another vocabulary or runtime export. Installed
copies match byte-for-byte and Python's fresh export matches semantically (117
elements). This applies the existing GC-087 §070 decision.

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

Later checkpoint: owner requires latest generic Builder JS locally and for fresh
installers. Gramlot's Python grammar loader now passes 16/16 from its installed
wheel with published Builder 0.23.2. Gramlot JS passes 74/74 with local generic
Builder JS 0.1.3; generic Builder passes 109/109 with current Bag/TYTX. Declared
GitHub dependency still resolves to legacy `genro-dom-js` 0.1.0, while local 0.1.3
has no remote. Installer availability remains open. Original findings follow.

New Python 3.12 environment installed Gramlot with published Bag 0.25.1, Builder
0.23.2 and TYTX 0.15.0; `pip check` passed, but `GramlotBuilder()` failed because
Builder lacks `load_grammar`. Default-branch Builder Python `c6e4684` also lacks
it; working 0.23.4 is local. Fresh npm Git dependencies installed Bag JS `f324b055`,
TYTX `6b9bf3a` and Builder JS `19549f81`. That default-branch Builder JS packages
`genro-dom-js` 0.1.0 without `sourceTarget`, so GramlotBuilder import fails.
Working Builder JS 0.1.3 remains local. This was the original probe; the later
Gramlot Python change resolved its Python failure. Builder JS distribution remains
the current clean-install blocker before the host matrix.
Probes are in `/private/tmp/gramlot-deps-audit.nRxrGR`; no dependency source,
installed copy or manifest changed. No Gramlot fallback or pin.

With only locally sourced Builder Python 0.23.4 and Builder JS 0.1.3 substituted
in the fresh environments, Python core passed 16/16 and JS core 74/74. Bag/TYTX
remained published/default-branch. The first JS run omitted a copied Python test
fixture; the complete rerun passed. This establishes local compatibility, not
public Builder availability.

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
