# 125 · Historical Gramlot execution record

Document ID: **GC-125**. Updated: **2026-09-23**.

**Historical record — do not execute past “Next” instructions.** The current checkpoint is [GC-070](070-work-status.md); the active release plan is [GC-110](110-native-html-readiness.md).

**TYTX GitHub notice refresh — 2026-09-23.**
TYTX commit `e113806` added LICENSE/NOTICE; issue #44 closed. Fresh
`github:genropy/genro-tytx` installation resolved `ea27462` and contained both.
Gramlot initially retained the metadata fallback because its notice collector
selected TYTX's nested `js/package.json`; legal files are at the same-name outer
package root. The collector now chooses that root. Fresh bundle and regenerated
0.1.0 wheel/npm archive carry the full Apache/Softwell TYTX text; resources match
byte for byte. New Python 3.12/npm consumers install them; JS 75/75 and Python
installation/dependency/typed Source checks pass. No seven-host rerun, release or
acceptance. Evidence: [GC-110 §6.2](110-native-html-readiness.md#gc-110-065) and
`/private/tmp/gramlot-tytx-refresh-20260923/`.

**Local 0.1.0 version closure — 2026-09-23.**
GC-110 phase 6 set Python/JS manifest versions to 0.1.0 and built local wheel
(21 entries) and npm archive (20). Fresh Python 3.12 and npm consumers installed
them with declared dependencies; Python dependency check, typed Source, three
byte-identical browser resources, seven JS exports and LICENSE/NOTICE pass.
Python 17/17 and JS 75/75 pass. The final check found and corrected a
Python-origin SVG `foreignObject` namespace defect and made JS test subprocesses
import Gramlot before using its TYTX registration; MessagePack test extra was
installed. The Chromium 7/7 matrix is earlier development-artifact evidence, not
a versioned-artifact rerun. TYTX GitHub LICENSE remains absent; issue #44 tracks
its owning-source fix. NodeJS/Hello World notice fixes are local. No push,
release, deployment or owner acceptance. Evidence and limits: [GC-110 §6.1](110-native-html-readiness.md#gc-110-060)
and `/private/tmp/gramlot-phase6-20260923/`.

**Owning-package notice correction — 2026-09-23.**
User requested correction of the three phase-5 external notice gaps. Added
Apache-2.0 LICENSE and package-specific NOTICE to TYTX, gramlot-nodejs and the
Hello World example owning checkouts. NodeJS and example npm metadata, and the
example Python metadata, now declare Apache-2.0. Fresh local npm archives for all
three and Python wheels for TYTX/example include both files. No code behavior,
dependency pin, package release or source push. Gramlot's normal GitHub TYTX
dependency remains at the prior source until the owning change is distributed.
Evidence: `/private/tmp/gramlot-notice-repair-20260923/` and [GC-110 §5.1](110-native-html-readiness.md#gc-110-055).

**Documentation and package review — 2026-09-23.**
GC-110 phase 5 reconciled README, six public guides/mirrors, the internal operating
guide and maps with current core and Chromium 7/7. Strict Sphinx and the public
staging/search/source/link/mirror boundary check pass. Gramlot JS prepack now copies
root LICENSE/NOTICE into its 20-file archive; all seven exports, bundles and runtime
notices are present. The 21-file Python wheel includes license/notice and browser
resources matching JS bytes plus HTML5/SVG collections matching installed Builder
JS bytes. No local absolute paths occur in packaged code/resources. Phase 4 examples
already ran from fresh installed packages. Installed TYTX JS and locally packed
NodeJS/Hello World JS archives lack their own LICENSE/NOTICE files; this is recorded
for those owning projects before external distribution. No version bump, release,
deployment or owner acceptance. See [GC-110 §5.1](110-native-html-readiness.md#gc-110-055).

**Fresh packaged seven-profile verification — 2026-09-23.**
Built current local wheels/archives, rebuilt browser assets before the Gramlot
wheel, installed in new Python 3.12/npm environments and confirmed isolated package
imports. Python dependency check passes for 49 packages; packaged Host TTL checks
pass. Chromium Uvicorn/FastAPI/Kajenn/Flask/Node/Bun/Worker passes 7/7 with typed
main/remote Source, live insert/update/delete/replacement, freeze/unfreeze, strict
Source rejection and disposal. Six server page records close; Worker terminates
without HTTP(S). Installed adapter protocol tests pass 3/3 FastAPI, 3/3 Flask and
2/2 ASGI/Kajenn. Kajenn uses BaseServer; Orchestra registry integration is not
claimed. Evidence: `/private/tmp/gramlot-phase4-20260923/`; [GC-110 §3.1](110-native-html-readiness.md#gc-110-035).
This closes phase 4 only. Safari/Firefox, phase 5/6 and owner acceptance remain open.

**Implementation and ownership review — 2026-09-23.**
GC-110 phase 2 traced Python/JS Page and Host, bootstrap/main, typed Source,
renderer events, remote replacement, freeze, disposal and transport ownership.
One typed Source and live rendering path remains; pre-write and per-node checks
protect different boundaries. No speculative rollback or new architecture decision.
Both neutral Hosts now reject non-expiring TTL and invalid capacity; focused
regressions added. Local Node 75/75 and Python 17/17 pass with the existing Python
test environment. The first direct JS host test used system Python and failed its
cross-language import; the configured full rerun passed. This is local core evidence,
not a fresh seven-profile packaged result. See [GC-110 §2.1](110-native-html-readiness.md#gc-110-025).

**TYTX browser correction and clean GitHub verification — 2026-09-22.**
Owner authorized the bounded TYTX fix. Its owning project published source commit
c8016d4 on the default branch: conditional browser/Node dependencies replace
Node-only `module` imports, with a browser regression and rebuilt artifact.
TYTX passes 850/850 JS and 731/731 Python checks. Fresh Gramlot JS installation
from GitHub resolves Builder a3a5860, Bag f324b055 and TYTX c8016d4; Gramlot
Node passes 74/74 with the existing Python test environment and browser/standalone
bundles build. Phase 1 is complete; design review, seven packaged hosts, final
artifacts and owner acceptance remain open. No package release or deployment.

**Builder JS distribution and fresh-install check — 2026-09-22.**
Owner directed the distribution of existing generic Builder JS 0.1.3 source.
The owning project committed and pushed a3a5860 to public
`genropy/genro-builders-js` `main`. The declared dependency now installs 0.1.3
with `sourceTarget`; fresh Bag/TYTX plus Builder tests pass 109/109, and fresh
Gramlot JS dependencies plus the existing Python test environment pass 74/74.
Browser bundling fails against current GitHub TYTX 0.15.0 (6b9bf3a) because its
`module` imports target Node. The old local Builder installation's 15 failures
were caused by its different Bag copy and do not reproduce with fresh upstream
Bag. No TYTX/Bag edit, Gramlot fallback, version closure or package release.
GC-070 carries the current next action.

**Original reading note:** the checkpoint at the top is current. Older dated entries
preserve evidence; their "Next" instructions are historical. Use GC-110's phase
table for the remaining release work.

**0.1.0 continuity audit — 2026-09-22; analysis complete.**

**Follow-up — repair plan prepared, 2026-09-22.** The owner requested a concrete
plan to repair continuity and resume work. [GC-120 §035](120-continuity-audit.md#gc-120-035)
now defines one documentary phase with five internal steps: authority/navigation,
current state versus history, contract/claim repair, semantic/build verification,
and a reader-tested continuation brief. Planning is complete; repair is not yet
executed. Runtime/dependencies and release scope remain unchanged. The next technical
task after repair is a read-only recheck of existing Builder JS availability through
the established dependency, then the authorized owning-project action and clean
installation. No repeated confirmation of settled decisions or routine Git summaries.

The owner requested an audit of the September 20–22 work and documents leading to
the first 0.1.0 release. [GC-120](120-continuity-audit.md) records twelve continuity
findings, the original decision sequence, document dispositions and the reliable
continuation snapshot. Entry points still select GC-094; current guides retain
retired recipe/DOM/Host paths; GC-110 and GC-115 contain superseded open questions;
Python installability and ownership are not reconciled across guides. The review
also confirms repeated questions after owner answers in the coordinator history.
GC-110 remains the execution plan; the audit is not another plan or amendment.

Verified in this audit: current local core Node 74/74 and Python 16/16; baseline
35 document/mirror pairs have matching explicit anchors and scanned local file
links resolve. These checks do not prove fresh installation or the seven-host matrix.
Runtime/dependency source and original conversation history were not changed.
Next proposed phase: documentary repair described in GC-120, pending owner
confirmation. The recorded release prerequisite remains availability of the existing
generic Builder JS through the declared dependency, followed by clean installation.

**0.1.0 package-documentation review — 2026-09-22.**

The README now describes the native HTML foundation implemented in this Gramlot
checkout and keeps the broader PoC/showcase distinct. It no longer directs readers
to the PoC as the only current implementation. The strict Sphinx build and public
documentation boundary/link/mirror check pass. This is a documentation correction,
not release acceptance. Next: make Builder JS 0.1.3 available through the declared
GitHub dependency, then verify a clean installation and the seven host profiles.
The JS package dry run includes both browser bundles, runtime notices and all
declared source exports (18 entries); it still carries the pre-release version
`0.0.0-dev.1`. The Python wheel was verified earlier in a fresh environment; the
documentation virtualenv lacks setuptools for a repeat wheel build in this check.

**Latest JS Builder distribution check — 2026-09-22.**

The owner requires one latest generic Builder JS for local and fresh installations.
Gramlot consumes the local 0.1.3 code with generic `sourceTarget`; core JS tests
pass 74/74 and the browser bundles build. Generic Builder JS passes 109/109 when
tested from an isolated copy against the same current Bag/TYTX dependencies. Its
existing local node_modules Bag copy yields 94/109 and is stale; no owning source
was changed. A fresh 0.1.3 package archive was prepared locally. The destination is
the declared `genropy/genro-builders-js` GitHub repository. The declared GitHub
dependency still resolves to legacy `genro-dom-js` 0.1.0; the 0.1.3 source checkout
has no remote configured, and `gh` authentication is invalid. A browser attempt to
inspect an organization dashboard for access was rejected by automatic approval
review because it could expose private organization content. No remote source was
published. No Builder source-code change is currently identified. Publishing the
existing 0.1.3 source through that GitHub dependency is a separate repository task;
then repeat the clean install.

**Gramlot Python authoring, 2026-09-22 — implemented and locally verified.**

Owner assigned the 0.1.0 Python Builder fix to Gramlot's dialect (constitution
amendment 11.16). GramlotBuilder now loads its packaged HTML5 grammar and additional
1.1 collections per instance, registers the existing SourceBag for typed TYTX,
preserves mixed leading text, and restores scalar parents after rejected insertion.
The unchanged 16 Python core tests pass against both published generic Builder
0.23.2 and the locally maintained 0.23.4 source. No generic dependency was edited.
The Gramlot wheel also builds and passes the same 16 tests after installation in
the fresh public-dependency environment, outside the source checkout.
This closes the Python clean-install blocker only. The maintained JS Builder source
is not yet available at the declared remote dependency. Full installed host matrix
and release review remain.

**Gramlot JavaScript dependency choice, 2026-09-22 — owner clarified.**

Owner requires the latest maintained generic Builder JS to be used both locally
and by fresh installers (constitution amendment 11.18). The temporary Gramlot-local
handle mapping was removed. Gramlot again consumes generic `sourceTarget`. The
previous 74/74 result with the local mapping is historical, not verification of
upstream availability. Latest generic Builder source was not changed. Its local
0.1.3 implementation lacks an upstream remote in this workspace; the declared
GitHub URL currently resolves to legacy `genro-dom-js` 0.1.0. Thus installer
availability is still open before the host matrix.

Inspection of the exact default-branch revision found broader incompatibility:
the repository resolves to the legacy monolithic `genro-dom-js` package. Its public
entry point has BuilderBase/SourceBag/HTML/SVG classes, but the inspected base lacks
the current `loadGrammar`, `validateNode` and `bindBuilder` contracts; it also lacks
the current typed-transport and render helper exports consumed by Gramlot. Moving
only handle identity into Gramlot is sound but does not make that revision a usable
foundation. Recreating all missing contracts in Gramlot would duplicate the generic
Builder rather than specialize it. The owner chose the latest generic Builder JS;
the maintained source must become available from the declared dependency.

**Python Builder inheritance trial — 2026-09-22.**

Read-only published Builder 0.23.2 trial: a temporary GramlotBuilder subclass of
HtmlBuilder can author native HTML/SVG. Published SourceBag is not registered with
TYTX; a temporary registration restored typed round-trip. With that registration,
the unchanged 16 Gramlot Python tests passed 9 and failed 7: three require
additional JSON collection loading, three require mixed leading text in `_text`,
and one requires rejected child insertion to leave the scalar parent unchanged.
The trial changed only a temporary Gramlot copy, not either owning repository.
Subclassing HtmlBuilder alone therefore does not preserve the agreed 0.1.0 Python
contract. Moving grammar loading, SourceBag transport registration and insertion
policy into Gramlot would change the GC-092/constitution §13 ownership boundary;
do not implement that alternative without an explicit owner decision.

**Clean dependency installation — 2026-09-22.**

In a new Python virtualenv, installing Gramlot from this checkout with floating
published dependencies succeeds but `GramlotBuilder()` fails: published
`genro-builders` 0.23.2 lacks `load_grammar`. The maintained Builder Python
default-branch HEAD also lacks it; the working source with this API is local.
Fresh npm installation of Gramlot's declared Git dependencies succeeds, resolving
Bag JS at `f324b055`, TYTX at `6b9bf3a` and Builder JS at default-branch
`19549f81`. That Builder JS checkout installs as `genro-dom-js` 0.1.0 and lacks
`sourceTarget`, so the current GramlotBuilder module cannot import. The working
Builder JS 0.1.3 source is local and not at that default-branch revision. Thus
fresh installations are not runnable even though local overlay tests pass. No
Builder/Bag/TYTX source or installed copy changed. Next: establish the exact
owning-project consolidation required for both Builders before repeating the
seven-profile matrix; do not add Gramlot compatibility code or dependency pins.
Isolation check: replacing only those Builders with artifacts built from copies
of their current local source makes Python core 16/16 and JS core 74/74 pass in
the new environments. Bag and TYTX remain published/default-branch packages.
The first JS test attempt lacked a copied Python fixture; copying it into the
temporary test tree resolved that test setup error. These results confirm local
compatibility, not public dependency availability.

**0.1.0 release priority — 2026-09-22.**

Owner wants the first release promptly with the known feature limits, followed by
incremental additions. Do not expand this milestone for Safari/Firefox verification
or CI grammar-drift automation; document those gaps. Release gates are maintained
dependency availability, bounded review, clean seven-profile verification, package
and documentation accuracy, and local 0.1.0 artifacts. Publication remains separate.
Owner's release sequence is 0.1.0 with stated limits, application trials and
corrections in 0.1.1/0.1.2 as needed, then new 0.2.0 work on `develop`. Existing
`develop` → verified/accepted → `main` policy applies to each increment.

**Kajenn Orchestra registry review — 2026-09-22 (read-only).**

Owner direction: the minimal Host assumes one process and keeps its existing
bounded local page registry. Do not add a reduced Orchestra implementation or
user/connection registers to Host. A future Orchestra-managed adapter is separate
work and must use Orchestra's worker-owned registers.

**Minimal Python host and grammar — 2026-09-22.**

The current Python consumers all use directory-backed pages, so keep
`Host.resolve_page()` in the existing Host for this release; no Python `FileHost`
class is needed. The HTML grammar source is already `genro-builders-js`'s exported
collection. `scripts/export_collections.py` copies it into the Python package for
Python-only installations. CI should fail when the packaged copy differs from the
Builder JS export; that CI check is a requirement, not yet implemented. Compare
local artifacts for this release.
The installed HTML5 copies are byte-identical, and Python's current HtmlBuilder
export is semantically identical (117 elements). No runtime npm dependency is added.

`kajenn-orchestra` has worker-local `user_items`, `connection_items` and
`page_items`; the page → connection → user chain owns live Bags, lifecycle
cascades, and freeze/adopt parcels. Commander indexes mirror routing facts from
worker events. Its `SpaApplication` routes by `spa_connection_id`, while its
hosted site calls worker `new_page`/`drop_page`. The current
`KajennNativeHtmlApplication` instead mounts directly on `genro_asgi.BaseServer`
with a separate process-local Gramlot Host registry and `gramlot_owner` cookie.
It does not register pages with Orchestra or carry Gramlot Host records through
worker migration. Thus current Kajenn verification does not establish Orchestra
readiness for managed applications. Focused Orchestra registry/worker tests pass
(43/43, 26/26); no Orchestra source changed. If an Orchestra-managed profile is
requested later, define its page identity, ownership and registry authority
against Orchestra's lifecycle. Do not duplicate registries as a workaround.

**HTTP page-close lifecycle — 2026-09-22.**

Owner accepted the internal close operation and clarified that Gramlot work includes
its connected adapter repositories. Explicit browser disposal sends an HTTP close
request; non-persisted `pagehide` sends a JSON beacon; persisted pages stay active.
Both neutral Hosts include `closeUrl`; Node/Bun route close through the shared HTTP
dispatcher, and Python adapters supply the prefixed close URL. Host checks owner;
TTL remains the fallback. Core JS 74/74 and Python 16/16 pass. Focused FastAPI
3/3, Flask 3/3, Genro ASGI/Kajenn 2/2, Node and Bun listener tests pass. Chrome
verified explicit disposal and pagehide server cleanup through installed Node/Bun
packages. Python adapter tests required the already-verified Builder from Gramlot's
environment because their own virtualenvs still contain an older Builder; clean
installation remains open. An initial automatic approval review rejected adjacent
edits; explicit owner clarification resolved that scope block. No Builder/Bag
source changed, commit, version bump, publication or deployment. Next: continue
GC-110 dependency/host/grammar review and current seven-profile matrix.

**Legacy page-close evidence and handoff — 2026-09-22.**

Genropy legacy uses `pagehide` → `onWindowUnload` → `notifyPageClosing` → `sendBeacon` to `/_beacon`; the server beacon handler drops the page and page-class cache. `beforeunload` separately handles a possible leave warning. This is evidence, not yet a Gramlot endpoint decision. Current HTTP page records still expire by TTL; page-close lifecycle, owner checks and route placement remain open. A concise continuation brief is in `temp/handoff_2026-09-22.md`. Next: settle this lifecycle contract and continue GC-110. No runtime change, version bump, or publication.

**JS Host / HTTP separation completed — 2026-09-21.**

Neutral Host no longer exposes fetch/ownerForRequest. Existing Node/Bun shared
adapter owns request parsing, routing, identity extraction and HTTP responses.
No new class or compatibility alias. Core Node72/Bun72; adapter real Node/Bun
listeners, Hello World and Chrome Node/Bun/Worker checks pass. Strict public docs
pass. Packages refreshed locally; Bag unchanged. GC-110 records remaining file
loader, HTTP page-close and Python grammar decisions; full matrix still pending.

**Builder validator cleanup completed — 2026-09-21.**

Removed the arbitrary Bag-veto test and retained meaningful ownership/subscriber
checks. Pre-insertion restoration remains justified by upstream invalid-label
rejection, now verified directly. Builder source/tests no longer reference the
local mutation-validator API or _createNode. Builder Node109/Bun109 and strict
Sphinx pass with upstream Bag. Refreshed Gramlot package installation and bundles;
core Node73 passes. No Bag changes, bump or publication. GC-115's dependency-code
findings are closed for this scope; host/lifecycle/grammar decisions and the full
current matrix remain open under GC-110.

**Validator-specific test review completed — 2026-09-21.**

Python Builder has no Bag mutation-validator registration. Of the three failing
JS tests, one is solely an arbitrary Bag veto; two combine that extension with
useful insertion-ownership/subscriber-error checks. GC-115 recommends removing the
veto-only test/parts while retaining those checks. Existing grammar rejection tests
remain relevant. _setBuilderItem's pre-insertion ownership restore is a separate
code-review item. No source or tests changed during this read-only review.

**Upstream Bag now used by core — 2026-09-21.**

Owner approved delete+insert for element-type changes. Updated the two tests using
the local tag extension and installed unchanged upstream Bag with corrected Builder
JS. Bag source hashes match upstream. Core Node73, Bun73, Python16 pass; browser
bundles rebuilt. No pins, lockfile, bump, Bag edits or publication. Local patched
Bag archive is no longer required by core. Corrected Builder publication and its
three validator-specific tests remain open, as do adapter refresh/full host matrix.

**Python tag-mutation comparison completed — 2026-09-21.**

Python Bag and Builder Source update a tag silently when value/attributes remain
unchanged; upstream JS matches. Local JS tag notification/setValue arguments are
extensions, not required for Python parity. No code changed. Decision pending on
whether live in-place tag changes belong to this step; ordinary deletion/insertion
already provide element replacement without extending Bag. See GC-115.

**Builder Source ownership correction applied — 2026-09-21.**

Owner explicitly reopened Builder JS for this correction. Removed its dependency
on Bag._createNode; SourceBagNode now initializes ownership using upstream Bag's
existing nodeClass constructor path. Added insertion-observer regression and Python
comparison docs. Bag unchanged. Against upstream Bag: Builder Node/Bun107 of110;
three failures use local Bag validators. Gramlot71 of73; the five SVG failures are
resolved, two tag API cases remain. Working installations have not been refreshed;
no fallback for the modified local Bag, bump or publication. Next: settle tag changes
and the remaining validator tests before clean-install readiness (GC-110/GC-115).

**Python ownership comparison completed — 2026-09-21.**

GC-115 now supersedes the inference that Bag needs a node-creation hook. Python
uses its Source subclasses; an isolated JS candidate using upstream nodeClass
construction resolves all five SVG failures without editing Bag. Two tag cases
remain. Builder candidate107/110; three failures explicitly depend on the local
Bag validator API. Application to owning Builder was rejected by automatic approval
review; source repositories/installations unchanged, explicit edit approval pending.

**Read-only Bag dependency review completed — 2026-09-21.**

[GC-115](115-bag-upstream-audit.md): isolated upstream Bag gives 66/73 passing
Gramlot cases versus 73/73 with local Bag. Required differences concern SVG builder
ownership before notification and tag-change events/API. Recursive backrefs already
pass upstream. The local mutation-validation subsystem has no active registration
in reviewed Gramlot/Builder consumers. Found a local regression: clearing a resolver
also clears the stored value. No dependency code changed. Consolidation must not
promote the whole local diff; bounded owning-library correction needs authorization.

**Readiness execution plan — 2026-09-21.**

[GC-110](110-native-html-readiness.md) is the current six-phase closure plan,
preceded by baseline capture. Dependency provenance is in progress; host/grammar
decisions remain open. Prior successful local tests do not establish a clean-install
result. Baseline captured; code review is in progress. Fixed transport disposal being skipped
when renderer cleanup throws, using try/finally in the existing path. Node73, Bun73,
Python16 pass in the installed environment. Bag installed sources match the local
native-html worktree, whose uncommitted changes are absent upstream. Bounded Bag
review authorization is pending under constitution §14. No bump or publication.

**Visible license panel removed — 2026-09-21.**

Owner requested removing license UI from exported applications. Standalone now
embeds attribution as inert JSON metadata in the head; no details/summary/pre
panel is added. Refreshed the installed exporter in Hello World and regenerated
Hello World and source-live HTML files. Parsed all three outputs: no details
element, body contains only the app root and startup script, metadata remains
valid and nonempty. No runtime changes, bump or publication.

**Point 1 complete: Node/npm standalone exporter and example — 2026-09-21.**

Owner approved replacing the Python command, not preserving a compatibility bridge.
The standalone repository now exposes @gramlot/standalone with one build function
and CLI: gramlot-standalone build PAGE.js -o OUTPUT.html. It bundles but does not
execute the Page, uses core WorkerHost/mount and emits the complete shell through
HtmlBuilder. The old Python provider/envelope/complete-v1 runtime path is archived
in temp/retired-standalone-exporter and removed from the active package. Historical
showcase artifacts are untouched and explicitly distinct. No DB or binding additions.

Hello World imports `/page` and uses npm run build:standalone to generate
gramlot-examples/apps/hello-world/dist/hello-world.html. Verified from the installed
standalone tarball, not sibling source imports. Three exporter tests and the existing
Hello World JS host test pass. Chrome passes the actual exported Hello World; Chrome
and Playwright WebKit pass the exported source-live page including main, Source
updates/insertion/deletion, marked remote method, Worker termination and blocked
HTTP(S), with no browser errors. Safari/Firefox remain unverified.

Updated paired standalone docs, app usage/map, and local plan. Manifests remain
floating, no lockfiles, commit, push, release or deployment. Package0.0.0-dev.1 is
a local development artifact, not a 0.1.0 release. Evidence: temp/standalone-exporter.
Next: current full host matrix (point2) and unresolved architecture/distribution
questions (points3–4); exporter migration is no longer pending.

**Standalone exporter migration started — 2026-09-21.**

Inspected the owning standalone exporter: its Python CLI calls the removed
compile_project provider and includes a complete-v1 data/multipage envelope outside
this step. Hello World JS now imports the browser-safe `/page` entry, keeping the
same page for Node/Bun/Worker. No exporter replacement has landed yet.

Owner question pending: replace the public build command with one Node/npm exporter
or retain the Python CLI. This determines packaging and whether a Python-to-Node
bridge is necessary; do not invent compatibility before the answer. The proposed
bounded exporter bundles one JS Page without build-time execution, embeds Worker
and runtime, and emits HTML through HtmlBuilder. DB, bindings, recipes and the
legacy showcase remain outside this migration.

## Historical checklist — consolidated 2026-09-21

- [x] Shared typed Source authoring and native HTML live rendering.
- [x] Synchronous FIFO; subtree freeze/unfreeze; no speculative DOM or rollback.
- [x] JS standalone Worker reuses Host/Page/main/remote Source; old compiler removed.
- [x] Attribute-only templates, escaped tokens and static ::HTML in both Builders;
  Python0.23.4 / JS0.1.3 installed locally. Script packaging blocker resolved.
- [x] Migrate the standalone product exporter and examples to the Worker contract.
- [ ] Re-run the current full host matrix; earlier eight-profile result is historical.
- [x] Implement HTTP page-close lifecycle with owner checks and TTL fallback;
  Worker disposal remains local.
- [x] Keep Python directory-backed page resolution in Host for the minimal release;
  no new loader class (GC-093 Q4).
- [x] Use the exported Builder JS collection as the source for Python's packaged
  HTML grammar (GC-093 Q6). CI drift check remains to be implemented separately.
- [ ] Establish reproducible upstream dependencies; distinguish local same-version
  Bag artifacts. No source publication is implied.
- [ ] Document Safari/Firefox as unverified for 0.1.0; track two existing Python
  Builder failures in a clean environment. Further browser verification is later work.
- [ ] Final review/acceptance and Gramlot0.1.0 bump. Core remains Python0.0.0.dev1
  / JS0.0.0-dev.1. Recipes, Data binding and DB are outside this step.

The entries below are chronological evidence; later decisions supersede earlier
blockers and pending questions. In particular, script interpolation is no longer
a blocker, and standalone no longer executes Python pages at build time.

**Approved template contract implemented; Builder patch bumps — 2026-09-21.**

Builder Python 0.23.4 and JS 0.1.3 are built and installed locally in Gramlot.
`${name}` substitutes only in attributes; a preceding backslash escapes the token
and is removed without consuming a parameter. Node values preserve template text;
pointers/resolvers still resolve. Static HTML strips a terminal ::HTML and emits
the content without escaping. This does not add raw-HTML behavior to Gramlot's live
renderer. No value-as-div-content alias was introduced.

Two Python examples now use separate pointer-valued spans instead of node-value
templates. README/rendering docs and tests updated in both owning repositories.
No first-party version pins, lockfiles, Bag source changes or publication.

Verified: Builder JS109 on Node and Bun; Python444 pass with two failures reproduced
against previous 0.23.3 in the same system environment (missing SourceBag.traverse;
Bag rejects cache_time=-1). Gramlot Node72, Bun72, Python16 pass; bundles rebuilt.
Chrome passes the Worker contract from a single HTML whose entire shell and scripts
now come through HtmlBuilder, resolving the script-template packaging blocker.
JS strict Sphinx passes; Python strict Sphinx reports two unreachable external
intersphinx inventories. Single-file exporter product migration remains pending.

Installation note: several local Bag0.5.2 archives have different contents. An initial
selection exposed failures; restored the documented gramlot-strict-source archive
without editing Bag or suppressing tests. This is local-artifact verification, not
proof of a reproducible fresh upstream installation. Evidence and artifacts are in
temp/builder-template-update; precise local package paths are recorded there.

**Legacy `::HTML` investigation — 2026-09-21.**

Read-only source investigation and minimal current-renderer checks: legacy
`gnr/core/gnrbagxml.py:504` strips `::HTML` and bypasses escaping;
`gnrhtml.py:525` uses this serializer for static HTML. Legacy JS
`gnrlang.js:973` recognizes/removes the typed-text suffix, while
`gnrdomsource.js:1640` applies innerHTML separately. Current installed Python
and JS HtmlBuilder both render `<b>Ciao</b>::HTML` as escaped markup with the
suffix still present. Gramlot live HtmlElement uses a DOM text node. No current
`::HTML` support or change is implied. Raw markup and `${...}` interpolation
are separate concerns; restoring the suffix alone would not settle template
evaluation inside scripts. Attribute-only interpolation and text/value semantics
remain under owner discussion. No runtime or dependency changes in this review.

**Worker standalone runtime implemented and verified — 2026-09-21.**

Owner approved the Worker host, excluding database work. WorkerHost reuses Host
registration/main/source; WorkerTransport owns messages and Worker lifetime.
standalone.mount prepares Gramlot before main; app.dispose terminates its Worker.
Browser-safe `/page` and `/worker-host` exports added. Python/JS build-time standalone
compilers removed from the active tree (historical copies under temp/retired-standalone).
No Builder/Bag changes, compatibility path, database or Data binding.

Verified: Node72, Bun72, Python16; rebuilt bundles; strict Sphinx and public-doc
checks pass. Logs are in temp/worker-host-verification. Actual Chrome153.0.8010.48 and
Playwright WebKit26.6 pass file-based Worker main/remote Source, live mutations and
disposal without HTTP(S). Chrome hosted regression also passes, including freeze.
Safari/Firefox remain unverified. The former eight-profile matrix is historical:
the separate standalone exporter still needs migration from the removed compiler.

Next blocker: agreed single-HTML generation through HtmlBuilder encounters template
interpolation inside script text. No production HTML workaround was added. Dependency
changes require explicit owner authorization under constitution section14. Current
Worker is a single classic bundle, not a module/fallback pair; one Page, empty Page.css.
See GC-090 section025 for use and GC-093 section120 for responsibilities and limits.
Local implementation and checks do not imply acceptance or publication.

**Standalone Worker feasibility checked — 2026-09-21.**

Accepted direction: Python pages run on Python servers; standalone executes JS
pages through a local host sharing the JS Page/main/remote Source contracts.
Existing Python standalone compilation has not yet been migrated.

Isolated probe in `temp/worker-storage-probe` runs actual Host/Page and Gramlot
through a test Worker message bridge. Installed Chrome 153.0.8010.48 and Playwright
WebKit 26.6 pass main, remote Source and Worker IndexedDB persistence after browser
restart, HTML rename and move, without HTTP(S) requests. WebKit is not Safari.
Safari automation is disabled; Firefox's downloaded build exits before startup
with “Could not find profile folder”. Neither browser is verified.

Open integration issues: browser-safe Host public entry (current barrel imports
Node FileHost), static Builder interpolation of embedded script `${...}`, production
message lifecycle and application/database identity. The probe uses direct Host/Page
source imports and a test-only literal HTML shell; these are not production fixes.
No DB adapter, production migration, Builder/Bag edits or publication. See probe
README and JSON evidence. Next: settle Worker-host scope and close browser coverage
gaps before claiming general standalone compatibility.

**Branch freeze/unfreeze implemented and verified — 2026-09-21.**

Owner settled overlap semantics: unfreeze releases a branch and all descendants;
a still-frozen ancestor keeps rendering suspended. Implemented only in GramlotRenderer
with freeze(node)/unfreeze(node). An idempotent frozen flag lives on existing mount
records. Events in frozen branches are discarded before enqueueing; other branches
retain synchronous FIFO processing. Unfreeze rebuilds current Source once, or removes
the old DOM if the root was deleted. No timer, counter, deferred-event log, new class,
Source projection, transaction, rollback or Data binding was introduced.

Shared the existing structural replacement code through a private rebuild method.
Old descendant records retain cleanup ownership while Source changes; unfreeze or
dispose releases them. Incoming replacement reference validation now excludes the
rendered descendants being replaced, which can differ from current Source during
freeze. This uses the existing mount records, not another registry or representation.

Verified: all **71 tests on Node and Bun**, including nine branch-freeze contracts
covering batching, transient insertion/deletion, both nested unfreeze orders,
independent branches, deleted frozen roots, mixed bulk deletion, references and
disposal. Chromium passes hosted bootstrap/main, Source updates, remote Source,
branch freeze/unfreeze and disposal. Bundle rebuilt; strict Sphinx and public-doc
checks pass. Full eight-host matrix was not rerun. Builder/Bag unchanged; no bump,
commit, push or publication. GC-095 section 030 documents the runtime API and limits.
The pending-overlap question below is superseded by the owner's explicit answer.

Remaining architectural review: Page execution duplication/return contract, host
boundaries, server lifetime and grammar distribution (GC-093 Q3–Q6). Binding maps
remain future work; freeze suspends rendering only and does not suppress Bag events
for other subscribers.

**Freeze/unfreeze direction approved; overlap contract pending — 2026-09-21.**

Owner approves synchronous FIFO normally and explicit subtree freeze/unfreeze,
without timers, transactions or rollback. Legacy GnrDomSourceNode uses a boolean
flag, inherited through Source ancestors; unfreeze requests rebuild. Current
legacy also releases discarded-content resources in its frozen-event path.

Prepared contract-test draft under temp/freeze-review (not active tests): final
Source rendering, independent sibling updates, transient insert/delete and disposal
of resources belonging to nodes removed while frozen. No runtime API has changed.
Proposed owner is GramlotRenderer.freeze(node)/unfreeze(node), not generic Bag or
Builder. Asked whether the first implementation should explicitly reject overlapping
frozen subtrees. Rebuilding an unfrozen parent while a child remains frozen needs
an explicit contract; do not silently choose it. Multiple independent subtrees and
idempotent repeated freeze of one node fit the discussed direction.

Next: resolve that pending scope question, implement the agreed renderer behavior,
activate the tests and verify. The previous event-driven runtime remains unchanged.

**Owner-directed removal of speculative rendering — 2026-09-21.**

Implemented the explicit decision to eliminate Q1's extra guarantee. Removed
Source Proxy projections, renderer pre-write validators, DOM setter clones,
prepared-token queues/caches, synthetic candidate nodes, stage/commit machinery
and whole-tree validation on each Bag event. Deleted source-mutation.js.
The test-only candidateValidator callback disappeared with that machinery (Q2).

Renderer subscribes only to events, resolves the affected node's ancestry, builds
inserted/replacement DOM once, updates existing setters locally and releases
subtree records/resources on deletion. Incoming main/remote Source still receives
structural validation, without constructing DOM. Rendering errors propagate after
the Source write; no Source rollback or preserved-old-DOM guarantee is offered.
Actual Source-to-DOM records and element-to-record WeakMap support traversal and
cleanup; they are not projected Source or prepared candidates. No binding added.

Verification: 62 tests pass on Node and Bun. Tests for the removed guarantee were
replaced with post-write error and event-local-work contracts; removed the custom
hook test and redundant speculative-stage test. With 100 elements, a scalar update
validates one node; an insertion validates one node and creates one element.
Chromium passes bootstrap/main, reported rendering error, nested updates, remote
Source and disposal. Bundles rebuilt; no Bag/Builder edits, dependency changes or
publication. Renderer shrank from 460 to 300 lines; 51-line projection module removed.
The earlier 8/8 matrix is historical evidence before this change, not rerun here.

Q1 and Q2 are closed by the owner's removal decision, not by inventing another
failure protocol. Remaining review topics: repeated page execution/return contract,
host boundaries, server lifecycle and grammar distribution (GC-093 Q3–Q6).

**Native HTML matrix and source-quality review — 2026-09-21.**

Implemented corrections: removed unused JS distribution grammar copies and their
copy script (129,154 bytes), preserving the generic HtmlBuilder grammar and shared
JSON test inputs; rejected JS remote source(null/undefined/main) dispatch; corrected
the repository map. No new class, workaround, recipe or dependency pin.

Verified from current local package archives in Chromium: **8/8** — raw ASGI/Uvicorn,
FastAPI, actual Kajenn BaseServer, Flask, Node, Bun, standalone Python and standalone
JS. Each passes Hello World, scalar/attribute/nested updates, insertion, replacement,
deletion, strict Source rejection and disposal. Standalone makes no HTTP requests.
Four Python profiles import no DB provider; Kajenn's registry is empty. Full core
Node/Bun tests passed after packaging cleanup (63 each); subsequent remote-method
regression and existing host tests passed (6 each), followed by the final 8/8 matrix.
The core version is unchanged; this is local minimum verification, not a release or
upstream-installability claim. Builder/Bag sources were not changed in this review.

Architecture **not accepted as clean**. GC-093 sections 100–105 contain the evidence
and six open findings: (Q1) whole-tree double validation/speculative DOM staging;
(Q2) test-only candidate-validator hook; (Q3) repeated page execution with hosted/
standalone return-value and builder-name differences; (Q4) inconsistent host/HTTP
ownership; (Q5) browser disposal does not close server pages; (Q6) Python grammar
snapshot refresh versus JS's current installed grammar. Reproduced Q1: one scalar
update among 100 elements invokes 200 validations; one insertion invokes 202
validations and creates the element twice. Existing tests do not justify this design.

Next decision: establish the intended pre-write failure contract before changing
Q1's machinery. Other open findings are problems to decide, not permission for new
abstractions. Evidence/harness: temp/matrix-review-2026-09-21; packages/logs:
/private/tmp/gramlot-matrix-review. No source pushes, release, deployment or changes
to unrelated running demo servers. The previous pending-local-matrix status below
is superseded; upstream installation and architectural acceptance remain open.

**Local Builder bumps and Gramlot refresh completed — 2026-09-21.**

- Implemented: Builder Python **0.23.3**, Builder JS **0.1.2**; built local archives
  and installed them in Gramlot's `.venv` and `js/node_modules`. The temporary
  Python host verification environment also uses 0.23.3. Maintained first-party
  dependency declarations remain unconstrained; no lockfile or publication.
- Gramlot now uses SourceBag.bindBuilder and RendererBase's renderedItem contract.
  Removed active recipe declarations/options/exports, RecipeExpander, attachSource,
  prepareItem and the duplicate collection list used only for recipe expansion.
  Structural fragment rendering remains Gramlot's responsibility.
- Updated remote fixtures and browser harness to native typed Source authoring;
  retained Source lifecycle/error tests. Collection collision tests now reject
  genuinely invalid inheritance rather than valid additive updates.
- Verified: Builder Python 444 tests; Builder JS 108 on Node and 108 on Bun;
  Gramlot Python 19, JS 63 on Node and 63 on Bun, all passing. Runtime bundles
  rebuilt; strict Sphinx/public-documentation checks pass. Chromium checks bootstrap,
  main, rejected invalid mutation, insert/update/delete/replace, remote Source and
  disposal without JS errors, using the loopback test host.
- Updated public guides to remove obsolete recipe APIs and document additive
  Collection updates. Artifacts/logs: /private/tmp/gramlot-builder-refresh and
  /private/tmp/gramlot-refresh-*. No version change to Gramlot itself.

Remaining: complete the Gramlot 0.1.0 host matrix on this dependency state;
Python Builder's previously recorded instance-only include_components rendering
issue; mixed wildcard/cardinality semantics require a decision; recipes and Data
bindings remain deferred. Python Builder Sphinx dependencies are still not
installed/verified here. No existing external demo server was restarted. This
completes the local dependency refresh, not owner acceptance of the full release.
Earlier version/installed-package statements below are historical and superseded.

**Wildcard clarification implemented — 2026-09-21.**
Owner confirms that an existing sub_tags="*" remains "*" when a later collection
adds bare child names such as span. Applied in Python and JS; incoming syntax is
still validated, so the wildcard cannot conceal malformed rules. Combining *
with explicit child cardinalities remains undecided/rejected. Targeted checks:
16 Python, 37 Node and 8 Bun tests pass. No version change or installed-package
refresh; the previously recorded Gramlot integration work remains outstanding.

**Collection composition implemented in owning sources — 2026-09-21.**
Owner decisions supersede full-declaration replacement and collision rejection.
Both Builder Python and JS now export Collection: raw portable JSON, ordered
update and independent document export. Declarations may be partial. Omitted/null
fields preserve prior values; named parameters and child rules add/update; no
removal marker, author-metadata extension or HTML documentation generator was added.
A supplied signature parameter remains a complete descriptor. Existing exporters
are unchanged. Version remains Python 0.23.2 / JS 0.1.1.

Both loaders compose and validate before publishing; class/instance isolation and
abstract recompilation are verified. Removed loaded-document/declaration registries
in favor of one Collection. Preserved executable component declarations across JSON
updates; injected component roots are not required author attributes.

Checks on exact staged sources applied with hash verification: Python **443/443**,
Node/Bun **107/107**, no skipped tests. The same HTML5 JSON + partial extension
produced identical composed JSON and static HTML in Python/JS. JS strict Sphinx
passed; Python Sphinx could not start because sphinx_autodoc_typehints is absent
from the documentation environment. No dependencies were installed to conceal this.

**Open:** mixed wildcard/named child-rule composition remains rejected pending
owner clarification. A pre-existing Python include_components rendering defect
was reproduced on unchanged sources: renderer looks up the instance-only method
on the class. It is recorded, not fixed here. Gramlot's installed JS package is
still the older 0.1.1; full consumer refresh is pending removal of obsolete recipe,
attachSource and prepareItem uses. This is not completion of the 0.1.0 host matrix.
No Bag changes, exporter-output changes, version bump, commit, push or publication.

**Collection composition decision — 2026-09-21.**
Owner confirms ordered, replacement-based composition: a later collection replaces
an earlier declaration of the same name in full. Other declarations remain.
There is no attribute-level/deep merge. Example: HTML defines div/span; a later
collection defines div/textBox; the result retains HTML span, replaces div and
adds textBox. This is an approved contract, not implemented behavior yet.

Both generic loaders currently reject conflicting definitions. Implement this in
the owning Python and JS builders, with matching semantics, not a parallel Gramlot
merge path. The previous exception reopened Builder JS only for Python-port cleanup;
permission to change both generic loaders for this new contract remains to be
confirmed. Bag JS is unaffected. Consumer alignment remains pending.

**Builder JS correction applied — 2026-09-21 (supersedes earlier closure).**
The owner explicitly reopened Builder JS for removal of features outside the
Python port contract. Version stays **0.1.1**. Bag JS and Python were not changed.
Removed generic recipes (declaration, helper, Proxy dispatch, expander/export),
setData, attachSource/replace, prepareItem and five renderer access wrappers.
Base grammar is now generated by the Python exporter alongside HTML5/SVG;
Python-unsupported Callable generic descriptors are rejected. Kept the explicitly
approved format/mask divergence and necessary JS dispatch/typed transport mechanics.
The owning repo's GBJ-025 now maps every source module to Python or an explicit
adaptation. The earlier 0.1.1 review missed these additions and was not sufficient
for architectural acceptance.

Verification on the corrected owning repository: **100/100 Node and Bun**, no
skips; strict Sphinx build passes; base/HTML5/SVG match fresh Python exports.
Tests of rejected recipe functionality were removed; Source transport and
mutation-rejection coverage was retained, with negative API checks added.
The original file set was backed up to /private/tmp/builder-before-port-correction.tar.gz.
No version bump, commit, push, release, or dependency pin.

**Still open:** Gramlot's installed archive is the previous 0.1.1 and was not
refreshed in this correction. Gramlot still imports RecipeExpander, invokes
attachSource and implements prepareItem. Remove the deferred recipe path and
align the live renderer with the Python-equivalent base before refreshing and
validating the consumer. Do not restore removed generic APIs to make tests pass.
The inherited-collection collision was reproduced in Python too; its contract
remains undecided. Full parity gaps in GC-105 remain; this audit does not claim
identical behavior for every input. The older 56/7 Gramlot diagnostic below is
historical, not validation of the corrected dependency.

**0.1.0 scope clarification — 2026-09-21.**
Owner confirms recipes are outside the current scope in both Builder and Gramlot;
they will be designed later. Do not repair the inherited recipe declaration/helper
conflict as part of 0.1.0. Builder JS/Bag JS remain read-only. Existing provisional
recipe code is not evidence of accepted support. Removing recipe processing from
the active Gramlot path remains pending; no tests have been excluded in this turn.

0.1.0 targets native HTML and live Source changes only, not reactive Data bindings.
The working GramlotBuilder now inherits HtmlBuilder; GramlotRenderer directly
inherits RendererBase, and hosted bootstrap uses the host-language HtmlBuilder.
These in-progress changes are not yet accepted or fully verified. Latest diagnostic
run: 56 passing / 7 failing JS tests, involving the collection inheritance collision
and deferred recipe behavior. Do not replace this evidence with an all-green claim.

Collection discussion remains open: identical dataSetter/dataFormula/dataController
exports are accepted when both documents were loaded, but rejected when the first
declaration is inherited from HtmlBuilder. The dependency has not been modified;
no Gramlot workaround or collection exclusion has been introduced.

**Owner work boundary — 2026-09-21.**
From now on, implementation work is confined to Gramlot. Do not directly modify
Builder JS/Bag JS repositories or installed dependency sources. Read-only review
is allowed; dependency defects must be reported, never hidden by Gramlot patches.
This supersedes earlier cross-repository implementation authorization. See
constitution §14 and AGENTS.md. No runtime change in this checkpoint.

**Builder JS final local review and patch bump — 2026-09-21.**
Prepared genro-builders-js **0.1.1** from local 0.1.0; no commit, push or release.
Reviewed source responsibilities, exports, grammar validation, typed Source,
renderers, comments, package metadata and documentation. Fixed positional tuple
validation against Python's existing contract. Replaced a grammar test silently
skipped by missing temporary files with mandatory bundled-collection checks.
HTML5/SVG JSON matches current Python exports. Removed stale comments about
shorthand grammar and alternate BagNode rendering; no new class/compatibility path.

Replaced the stale README with an entry point and created a six-page classic RTD
Sphinx manual, a differences register and a local changelog in the Builder repo.
Version comes from package.json; Node syntax floor is 18.20.0, with actual checks
on Node 23.11.0 and Bun 1.3.14. Deferred recipes and whole-Source replacement are
explicit; surplus authoring arguments are a recorded contract limitation.

Verified source and installed archive: Builder 103/103, Gramlot 63/63, on Node and
Bun; strict Sphinx build passed. Package inventory: 30 files, no dependencies or
build/temp artifacts. Installed 0.1.1 locally in Gramlot, preserved floating first-
party manifests and rebuilt bundles. Current Builder repo has no configured remote
or prior commit. The owner clarified 'bup' means bump only; earlier local-only
restriction remains. This closes the bounded review, not all Python parity gaps.

**Difference register — 2026-09-21.**
Created [GC-105](105-builder-python-js-differences.md), the paired internal register
of Python/JS Builder differences. Owner temporarily accepts the absence of the JS
TargetWrapper base class: renderOpts/full delivery already exists. Formatting is an
approved divergence; Python backport is separate. Other gaps stay explicitly open;
the register does not claim an exhaustive parity audit or authorize extra classes.
Documentation-only change; no new runtime verification claimed.

**Direct typed authoring values — 2026-09-21, fixed and verified locally.**
Fixed the Date argument defect in owning Builder JS source-bag.js splitArgs.
Only plain records (Object.prototype or null prototype) are attribute dictionaries;
Date and other class instances remain positional values. No Date-specific adapter,
conversion or extra representation was added. Root and nested authoring retain the
same Date instance and render 11/09/2026 with format='dd/MM/yyyy'. Attribute-only
calls, including null-prototype records, remain supported. This closes the Date
finding in the formatting checkpoint below.

Builder 102/102 and Gramlot 63/63 pass on Node and Bun. Local Builder archive
installed, floating manifests restored, browser bundles rebuilt. Python unchanged;
no publication or commit. Other parity gaps and deferred decisions remain open.

**Approved format/mask separation — 2026-09-21, implemented locally.**
Owner confirmed the PoC contract: format/places/locale format scalar presentation;
mask wraps that text with `%s`. Python stays unchanged; a Python backport may be
considered later. This supersedes the proposal to emulate Python percent masks.
Ported only the pure numeric/temporal formatting functions into Builder JS's HTML
renderer. No reactive handler, input parser, widget or new class was introduced.
Source options are consumed for scalar content, never input values, HTML attribute
values or Data logic. Ancestor locales resolve in their declaring Data scope.
Portable static fallback is the host Intl locale, with no browser/global application
lookup. Python Data-node mask behavior remains a known difference; it is not silently
mapped onto Source presentation. `%f` and `%d` are literal mask text, not directives.

Verified Builder 101/101 and Gramlot 63/63 on Node and Bun; installed the local
archive, restored floating manifests and rebuilt bundles. No publication or commit.
The static renderer is covered; this does not claim live Gramlot formatting/bindings
were ported. Existing scalar conversion, Intl locale and rounding differences are
explicit. Found a separate authoring defect: Date as the first positional argument
is treated as an attributes object (source-bag.js parseArgs); typed Data date reads
work. Record and resolve the owning API separately; no coercion workaround added.
Remaining parity items include YAML/other dialects, target facilities, async resolver
consumption, validators and value-to-string differences. Recipes remain deferred.

**Formatting review — 2026-09-21.**
Found existing PoC helpers `js/dom/src/display-format.js` (formatDisplay) and
`number-format.js` (formatNumber): `format` handles numeric/temporal presentation,
`places` and locale; `mask` wraps the resulting text using `%s`. Removed the newly
attempted scalar percent formatter and its two tests from Builder JS; it had not
been installed in Gramlot. The other parity corrections remain, with 97 Builder
tests passing. No PoC code was promoted. Python Builder currently uses Python `%`
on Data-node masks; PoC formatting uses explicit Source options and has different
null/metadata behavior. A shared contract and ownership must be settled before
porting, rather than adding a second formatting implementation.

**Static Builder parity — 2026-09-21, implemented and verified locally.**
The owner requested Python/JS behavioral parity with explicit known differences.
Changed the owning genro-builders-js library, without Gramlot adapters or new classes:
- runtimeValues expands `${name}` templates after pointer resolution, consumes their
  input attributes, maps null template inputs to empty text, and rejects missing names;
- direct BagResolver attributes use resolve(), leaving caching/loading to Bag;
- value reads carry Data-node `_wdg` attributes over authored attributes, excluding
  data-elements and attribute-path reads;
- static HtmlRenderer supports includeDatapath, authored-ID precedence and stable
  generated IDs, matching Python's include_datapath option.

Verification: Builder 97/97 and Gramlot 63/63, each on Node and Bun. Installed the
local archive into Gramlot and rebuilt browser bundles; floating dependency manifests
were restored. No commit, publication or deployment. Checks establish these bounded
behaviors, not complete cross-language parity.

Remaining differences: Python %-format masks (no partial formatter introduced),
Python/JS value-to-string differences including template booleans/containers,
async resolver consumption by synchronous renderers, YAML and additional dialects,
filesystem targets/readback, TargetWrapper class, and portable validator/type limits.
A direct synchronous resolver is covered; no asynchronous rendering contract was added.
Recipes remain deferred. The earlier explicit Gramlot render lifecycle question is
still unresolved and is independent of static Builder parity.

**Primary-path cleanup — 2026-09-20, implemented and verified locally.**
Removed unused renderer mount/removal hooks, the unused array-shaped renderedItem
input, optional setup/main calls despite inherited required methods, and Gramlot's
repeat Source type check after the generic typed loader already enforces it.
Standalone now requires Page inheritance as hosted pages do, validates the declared
CSS array, and uses the inherited title without a second fallback default.
Generic wrapSource now checks SourceBag/SourceBagNode explicitly; a parentBag-shaped
object is insufficient. Removed the unreachable empty-schema fallback after the
unknown-tag rejection. No class, compatibility API or alternate path was added.

Checked consumers in core and sibling examples/hosts before removing the unused
hooks. Installed Builder tests: 93/93; Gramlot: 63/63, on both Node and Bun. New
negative coverage checks unrelated page classes, invalid metadata and non-Source
handles. Browser bundles rebuilt; Python unchanged. Work remains local/uncommitted.

Next unresolved contract: Gramlot's inherited builder.render() route does not share
the event-driven renderer lifecycle (GC-093 R2); no bridge, alias or no-op was added.
The owner must settle whether Gramlot exposes explicit rendering as well as Source
events before that route changes. Recipes, Source replacement and staging-policy
redesign remain deferred. Passing checks are not broader architectural acceptance.

**Strict Source implementation — 2026-09-20, locally verified.**
Constitution §13 and AGENTS.md forbid unrequested compatibility paths. The renderer
now requires SourceBag/SourceBagNode and their builder ownership. Removed the five
ordinary-Bag access adapters, attr.tag fallback, method-presence fallbacks and the
HtmlElement fallback builder. Fragment preparation uses a genuine SourceBagNode;
no plain Bag conversion was introduced. Data Bags remain unchanged.

Corrected two defects in their owners: generic Builder no longer resets a child
Bag's backrefs after insertion; BagNode now notifies subscribers for nodeTag-only
updates through the existing event. Renderer subscription relies on Bag-owned
backref setup instead of resetting the Source's structural parent.

Verification: Bag 606/606 on Node; installed generic Builder 92/92 and Gramlot 62/62
on Node and Bun, including Python transport in the configured environment. Rebuilt
browser bundles. Negative checks reject ordinary Bag roots/branches, ordinary nodes,
attr.tag-only and unbound Source, including direct writes before mutation. Tests
support the explicit contract; they do not justify extra mechanisms. Parent reviewed
the code and a Sol agent checked for remaining compatibility paths read-only.
All work is local/uncommitted; no release, push or deployment. Recipes, their
collection-copy defect, whole-Source replacement and staging-policy design remain
deferred. See GC-093 §090 for the strict-path review.

**Native HTML record review — 2026-09-20.**
Removed unused `sourceTag` and `declaration` copies from HtmlElement mount records.
The original tag remains on the associated Source node; the grammar remains owned
by the builder. `definition()` returns only metadata, namespace and resolved tag,
and no longer accepts an unused tag override. This removes redundant state and
parameters without adding classes, compatibility paths or APIs.

Retained state has concrete readers: the resolved emitted tag and namespace select
update versus replacement; the applied-attributes snapshot removes previous DOM
attributes; the element/text references support native setters. The coordinator's
Source-node association, parent/children and cleanup callbacks support insertion,
subtree removal and disposal. DomRendererBase supplies DOM-fragment finalization;
HtmlSourceRenderer owns Bag-event coordination; HtmlElement owns native DOM handling;
GramlotRenderer adds application references. No new class split is proposed here.

Verified: all 60 Gramlot Node tests pass, including native updates, SVG and typed
Python/JS transport; browser bundles rebuilt. Removed one assertion of redundant
internal state; the test still checks the authored tag, emitted tag and DOM identity
through updates. Recipes and their collection-copy defect remain parked. This pass
leaves the already-recorded ordinary-Bag and staging policy questions unresolved;
no new failure or adoption protocol is inferred. Remaining generic Python parity
(template/presentation/resolver behavior) is recorded separately and not claimed done.

**Owner scope decision — 2026-09-20:** recipes remain outside the current work.
Their addition will be addressed later. Park the duplicate collection state used
for recipe child construction with that future work; it is neither a current blocker
nor an active implementation task. Preserve the finding without designing a fix or
claiming recipe support consolidated. This scope decision does not request deletion
of the existing provisional code. Current review remains focused on the minimal
builder, shared JSON grammars and pure-HTML rendering.

**Builder responsibility review — 2026-09-20: bounded corrections complete.**
Reviewed BuilderBase, grammar loading, Source authoring handles and RendererBase
against the Python implementation and actual Gramlot callers. A Sol agent audited
grammar/state ownership read-only; the parent reviewed the findings and changed code.

Implemented in generic Builder JS:
- Removed the uncached fallback in `wrapSource`: attached nodes delegate to their
  owning builder's existing handle cache; detached inputs remain unchanged.
- Removed the unused `isBag` duck-typing helper, unused import and stale renderer comment.
- Loading a grammar no longer changes document identity: `new GramlotBuilder('main')`
  retains `main`, instead of silently becoming `html` during default collection loading.
- One internal JSON serializer compares object content independently of member order
  for both documents and shared declarations. Removed the JS-only top-level ordering
  rejection; exact required keys remain checked. Array order and changed values still
  matter. This matches Python loading and adds no public API or registry.

Retained responsibilities: SourceBag adds builder ownership/authoring to Bag;
BuilderBase owns grammar and Data; RendererBase owns portable traversal/dialect
selection, with concrete XML/HTML/SVG output in subclasses. Loaded collection
identity and declaration identity serve distinct conflict checks; compiled schemas
and tag maps serve lookup. No additional class or inheritance layer was introduced.

**Unresolved duplication, demonstrated:** GramlotBuilder keeps a second `collections`
list for recipe child construction. Calling `builder.loadGrammar(extra)` makes
`reviewPanel` available on the parent while `new GramlotBuilder(null,
{collections: builder.collections})` cannot find it. This is a real divergent path,
not a solved capability. Keep it in the deferred recipe review; no new collection
accessor, replacement API or recipe protocol was inferred. Static template/presentation/
resolver parity with Python also remains incomplete: JS does not yet implement the
Python `div(w='^mywidth', width='${w}px')` resolution behavior.

Verification after local archive installation: generic builder **91/91** and Gramlot
**60/60** on both Node and Bun, including Python/JS typed transport. The two added
regressions cover name preservation and JSON comparison (including real conflicts).
Gramlot's installed explicit-name example passes; browser bundles were rebuilt.
Python sources were not changed. No pins, lockfiles, commits, publication or deployment.
Whole-Source replacement, ordinary-Bag policy, staging policy, recipes, live CSS
and the broader host matrix remain outside this correction. Broader port acceptance
remains revision-requested. Next review area: the collection ownership duplication
when recipe work resumes; remaining Python parity is recorded, not claimed complete.

**Completed locally — unnecessary declaration API removed (2026-09-20).**
Removed `defineDeclarations()`, the exported `element`/`abstract`/`container`/`component`
helpers, alias descriptors and their private declaration state from genro-builders-js.
No replacement API, registry or PoC copy was introduced. `defineGrammar()` now
requires the same complete `builder_grammar` 1.1 JSON accepted by `loadGrammar()`;
the existing four base declarations moved unchanged to `collections/base.json`.
Class loading serves HtmlBuilder/SvgBuilder; instance loading serves Gramlot collections.
Existing inherited static component/container arrays only associate same-name
executable methods. Python decorators/exporter and deferred recipes remain unchanged.

The installed local dependency and Gramlot browser bundles were refreshed. Parent
review checked the production implementation and absence of the deleted exports,
private state and shorthand grammar path. Canonical HTML/SVG JSON is byte-identical
across the owning package, installed dependency and Gramlot copies; no dependency
pin or lockfile was introduced. Installed verification: generic builder **89/89**
and Gramlot **60/60**, separately on Node and Bun, including Python/JS transport.
Three obsolete alias/declaration tests were removed, one canonical-format rejection
test added; remaining grammar fixtures use canonical JSON. These checks confirm
preserved behavior, not a justification for adding APIs. Python source is unchanged.

This completes the requested removal, not the broader architectural consolidation.
Whole-Source replacement remains owner-deferred; ordinary-Bag compatibility and
projection/staging ownership remain unresolved. Recipes, live CSS and host-matrix
expansion remain deferred. Work remains local, uncommitted and unpublished; broader
PORT-0004 acceptance remains revision-requested.

Documentation verification: strict Sphinx build and all seven public pages pass;
updated paired document anchors agree.

**Historical necessity audit — superseded by the removal above.**

**Owner directive — necessity before API refinement (2026-09-20).**
Every additional class/API must name its concrete responsibility, actual consumers,
and why an existing mechanism cannot satisfy it. Tests authored for an API are not
independent evidence that it belongs in the architecture. Do not retain additions
merely because they work, and do not invent consumers to justify them.

The question about cumulative versus replacing defineDeclarations calls is withdrawn:
it is premature until the API itself is justified. No owner decision on that
behavior is requested now. Shared collection grammar remains builder_grammar JSON;
executable behavior lives in implementation methods. Earlier permission for JS-only
declarations is not evidence that every declaration helper/API is necessary.

Read-only consumer audit: core Python/JS plus JS source in gramlot-examples,
gramlot-standalone, gramlot-nodejs, gramlot-fastapi and gramlot-flask. No operational
consumer of defineDeclarations was found in that scope. Generic HtmlBuilder and
SvgBuilder use defineGrammar with imported JSON; Gramlot uses loadGrammar for its
instance collections. Generic BASE_GRAMMAR also uses defineGrammar with an inline
object. Generic tests and README exercise defineDeclarations; this is not proof of
an application need. No claim is made about uninspected external consumers.

Next review must justify or reject the programmatic grammar declaration path and
its helper exports before refining their semantics. A method-binding responsibility
may be legitimate; that does not automatically justify a second grammar notation.
Verification: strict Sphinx build and all seven public documentation pages pass.
This audit changed documentation only.
No declaration APIs were removed and no replacement registry was designed in this
audit. Source replace policy remains separately deferred at the owner's request.

**Owner decision — 2026-09-20: defer whole-Source replacement policy.**
Keep `attachSource(source, {replace: true})` unchanged for now. The known defect
remains open: replacing the source can leave the structural root attached to the
old Bag; transferring between builders can also duplicate cached target IDs.
Gramlot main/remote does not use this option. Neither removal nor a new adoption,
identity-remapping or root-transfer contract is approved. Revisit with the owner
later; this deferred choice does not block independent review work.

**Historical checkpoint (then current) — attribute ownership, emitted tags and component inheritance:**
HtmlElement now retains the attributes it actually applied, including render_attributes
and SVG spelling, and owns that snapshot. The coordinator no longer overwrites it
with raw Source attributes. Removing metadata-only attributes now removes them from
the DOM; an overridden Source attribute is restored. Failed detached validation
leaves the mounted snapshot unchanged. No second snapshot/cache or lifecycle added.

One generic resolveRenderTag function serves RendererBase and Gramlot's native
handler. The coordinator passes the resolved tag to creation and retains the authored
sourceTag separately. Example: del_ authors a real <del>; attribute/text updates keep
the same DOM element. Literal non-keyword underscores remain literal. Tag aliases,
existing ns prefixes and ordinary-Bag grammar metadata use the same resolution;
namespace URI selection is unchanged.

Generic component declarations now compose each class's own mappings and static
array base-to-child. Child declarations override parent mappings without losing
unrelated inherited components. Component case collisions fail before instance
schema publication. Parent review corrected the agent's first merge order, which
let a parent static array overwrite a child's declared mapping. Containers and
components share one class-chain traversal; no new classes or caches were added.

Verified final installed local graph: generic JS91 and core JS60 on Node and Bun;
bundles rebuilt. Python code/grammar did not change; prior Python435 is historical.
Artifacts/logs: /private/tmp/gramlot-attr-review/. Dependencies remain floating;
all work remains local, uncommitted and unpublished. Broader port remains
revision-requested, not accepted.

Open: repeated defineDeclarations/defineGrammar calls on one class currently discard
prior own elements/components, unlike retained container declarations. Owner choice
between cumulative declaration and replacement semantics is pending; no change made.
Whole-Source replacement remains explicitly deferred by the owner. Ordinary-Bag
compatibility and projection/staging policy also remain unresolved; no new contracts
were inferred. Recipes, live CSS and host-matrix expansion stay deferred.

**Earlier checkpoint — SVG reuses XML serialization (owner approved):**
Python and JS SvgRenderer now extend XmlRenderer. Removed both SVG void-tag lists
and duplicate element serialization. Empty nodes render as paired tags; scalar
metadata content is preserved. Attribute aliases and namespace handling remain.
Python normalizes booleans to lowercase immediately before delegating attribute
formatting to XML, preserving HTML-to-SVG boundaries where adapt_attrs is skipped.
The first agent proposal normalized booleans only in adapt_attrs; parent review
caught and corrected that boundary regression before completion.

No XML header is emitted by default; explicit doc_header/docHeader uses the shared
XML finalizer. Native grammar documents did not change. Gramlot still owns the
reactive DOM and required no new renderer code. Installed the local JS archive and
rebuilt browser bundles; floating dependencies and absence of lockfiles preserved.
Verified generic JS87 and core JS58 on Node and Bun; strengthened SVG boundary
regression also passes. Strict Sphinx build and all seven public pages pass.
Canonical, installed and packaged collection bytes match. Artifacts and root logs:
/private/tmp/gramlot-svg-xml/. Final Python full suite: 435 passed using the owning
builder source and /private/tmp/gc088-python-hosts.XDzTXQ/venv/bin/python with Bag
0.25.1. The agent first used global Python with Bag0.21.0 (433 passed, two dependency
API failures); root repeated the full suite in the established environment instead
of patching code for the stale dependencies. Final log: python-full.log in the
same artifact directory. Future agents must receive the explicit interpreter.

SVG content loss and HTML void vocabulary duplication are now corrected. Remaining
review decisions concern whole-Source adoption/IDs, ordinary-Bag compatibility and
projection/staging complexity. No new lifecycle, recipe or CSS behavior was added.
The broader port remains revision-requested; this checkpoint is not full parity,
host-matrix acceptance or publication. All changes remain local and uncommitted.

**Earlier checkpoint — HTML void semantics moved to grammar:** owner approved
using existing `_meta` rather than renderer-owned tag lists. The 13 Python HTML
void declarations now carry `_meta={"void": True}`; the existing exporter preserves
it in canonical builder_grammar 1.1 JSON. Python static HtmlRenderer, JS static
HtmlRenderer and Gramlot HtmlElement consume this metadata. All three HTML void-tag
lists were removed. An ordinary empty leaf remains paired; sub_tags='' does not
imply void. No new class, grammar version, serializer or SVG semantics introduced.

Canonical JSON was regenerated from Python, installed locally and copied unchanged
into Gramlot's Python/JS resources; browser bundles rebuilt. Verification: Python
export/roundtrip tests21 and HTML/load/indentation tests21; installed generic JS85 on
Node and Bun. Core full run had57 passes and one new test-authoring error: that test
used class declarations, which Gramlot's collection replacement does not expose.
It now uses the documented collections API; the final renderer file passes9/9 on
Node and Bun, including a void alias absent from the old lists. Generic HTML file
was also rechecked after strengthening its alias regression. No product workaround
was introduced for the test. Logs/archive: /private/tmp/gramlot-html-void/.

Documentation verification: strict Sphinx build and all seven public pages pass;
paired anchors and packaged collection bytes match.

The HTML vocabulary duplication finding is resolved. SVG scalar-content loss and
its static serializer decision remain open, as do source adoption/ID ownership and
broader lifecycle/compatibility review. No port acceptance, source publication,
package release or host-matrix completion is claimed. Dependencies remain floating.

**Earlier checkpoint — bounded design corrections verified, review still open:**
generic JS now rejects contradictory variadic signatures, follows Python's public
declaration-name boundary, and composes container aliases through one cache-free
inheritance walk. Alias rebinding fails before grammar mutation; subclass method
overrides remain valid. Removed unused pointer.js duplication.

One Source attribute-normalization function now serves both SourceBagNode and the
live DOM handler: `_class` becomes `class`, literal `foo_` stays literal, and Source
metadata does not leak into native attributes during creation or update. Structural
replacement completes even when disposal callbacks throw, then reports the cleanup
error; committed Source, DOM and mount records remain aligned.

Verified the installed local archive graph: generic JS84 and Gramlot JS57, both on
Node and Bun; bundles rebuilt. Logs/archive: /private/tmp/gramlot-design-review/.
First-party manifest references remain floating; no lockfile, commit or publication.
Earlier Python431/Bag605/Chrome checks remain historical, not new runs.

Open decisions: SVG static serialization currently drops scalar content on tags
incorrectly classified as void (e.g. metadata('license')). Reusing XmlRenderer
would remove duplicate serialization and emit paired empty tags; owner confirmation
of that spelling change is pending. HTML void knowledge is duplicated in static
and DOM handlers and is absent from exported JSON; sub_tags='' alone cannot encode
void semantics. attachSource({replace:true}) retains a stale structural root and
can duplicate target IDs when transferring between builders. No replacement/adoption
policy has been invented. Ordinary-Bag compatibility and projection/staging
complexity remain review findings. Recipes, live CSS and host expansion stay deferred.
See GC-093 §045. Broader port status remains revision-requested, not accepted.

**Earlier checkpoint — static and live SVG adapted (owner authorized both):**
canonical SVG JSON feeds the registered JS SvgBuilder and its static SvgRenderer.
Gramlot's existing HtmlSourceRenderer owns one transaction/record map for HTML and
SVG; its native element collaborator creates SVG nodes with createElementNS and
uses the same exported SVG attribute adapter as the static renderer. No new live
renderer class, grammar copy, coordinator or traversal was added.

Corrected the owning Python SVG-to-HTML declaration: foreignObject remains SVG,
while the entered HTML children carry XHTML namespace. Regenerated canonical JSON.
The generic Bag now exposes detached candidate creation; SourceBag initializes
ownership through that hook before validators/subscribers see an insertion.
A proposed per-insert class and a hidden-attribute workaround were rejected.
One existing binding plan handles branches, including rejection rollback and
reentrant inserts. Remote preparation carries the target dialect through the
existing pipeline; recipe design remains deferred.

Verified with the final local graph: generic JS79 and Gramlot JS55 on both Node
and Bun; Python builder full431; Bag605 in its owning checkout. Chrome verified
Python typed Source, SVG/HTML namespaces, direct insertion, attribute update with
DOM identity preserved, disposal and no page errors. Bundles rebuilt; canonical
collection copies identical; floating dependency manifests preserved. Logs and
builder archive: /private/tmp/gramlot-svg/; Bag archive: /private/tmp/gramlot-svg-bag/.
Python verification uses the current owning source, not the previous host wheel.
This closes the bounded SVG adaptation, not full builder parity, host-matrix
acceptance or publication. Next: return to the remaining generic-builder review
and subsequent host consolidation. Data bindings/new recipes/CSS capabilities
and broader collection extensions are not part of this SVG increment.

**SVG adaptation review — both paths authorized:** the owner calls for
adapting existing SVG rendering, not designing an unrelated implementation.
Read-only review reproduced two concrete problems: JS `GramlotBuilder.root.svg()`
raises `No builder registered with name 'svg'`; Python
`svg.html().div("Hello")` renders foreignObject in the XHTML namespace because
SvgExtensions.html exports that xmlns on the boundary itself. SVG foreignObject
must stay in the SVG namespace; its HTML contents use XHTML (W3C SVG 2 embedded
content). The incorrect metadata is already in the canonical JSON: no JS-only
correction or second vocabulary has been introduced.

Existing reusable mechanisms: old DOM JS SvgRenderer uses createElementNS;
generic RendererBase has addRender/getRender for dialect renderer selection.
Default selection currently requests the child builder's default renderer, which
is insufficient to guarantee object output in a live DOM traversal. Decisions
about static versus live integration must remain explicit; the earlier plan
deferred reactive SVG. Owner subsequently authorized both static builder SVG and live Gramlot SVG.
The following findings describe the pre-change review; the verified SVG
checkpoint at the top supersedes this former in-progress status.

**Historical checkpoint (then current) — generic declarations and ownership reviewed:** fixed
mounted-dialect minimum validation and ID lookup; both now use node.builder.
Python keyword escapes are shared between JS Source attributes and renderer tags;
legitimate trailing underscores stay literal. Class inheritance now preserves raw
declarations and compiles them through one resolver, so abstract overrides update
inherited elements without changing the parent. Strict decoding and resolution are
separate steps; no second instance grammar state or component overlay was added.

Python's documented transitive abstract inheritance is now resolved recursively in
its owning grammar code, with unchanged literal export and instance-local element
caching. Broader checks exposed two existing Bag API mismatches: validate_source
now uses Bag.traverse(), and the infinite-cache test uses the current negative TTL
contract (same cache assertion). No Bag fallback, compatibility shim or pin added.

Verified: installed generic72/core51 on Node and Bun; Python full suite430 passed
against installed genro-bag 0.25.1. Bundles rebuilt. Artifacts/logs:
`/private/tmp/gramlot-declaration-review/`. Python code is verified from its source
checkout; the running Hello World still uses its prior installed wheel. Full
port/host acceptance and publication are not claimed.

**Owner clarification — one native grammar source:** portable JSON works in
Python and JavaScript; JS declarations remain JS-only. HTML and SVG use exclusively
the exported JSON vocabulary, without parallel handwritten declarations. This
supersedes the earlier JSON-only-versus-JS API question; no blanket API removal
was requested. Recipe work remains deferred; null conversion remains DOM-only.

Implemented: one export command in genro-builders-js generates html5.json (117
elements) and svg.json (58 elements, 2 abstracts) via the existing Python exporters.
Gramlot's packaging script copies those canonical files, and JS packaging copies
the same bytes. HTML is unchanged. SVG was missing from the distributed collections
and is now included; no SVG builder registration or live SVG support is implied.
Verified complete export equality, installed-package byte equality and grammar
loading/authoring/static XML output in Python, Node and Bun. HTML static output
also checked in Node/Bun. Local archive/checks: /private/tmp/gramlot-json-collections/.
The preceding full-suite checkpoint remains valid history, not a new full-suite run.
Next: continue the generic builder review; SVG renderer integration and the host
matrix remain separate pending work. No publication or overall port acceptance.

**Latest CSS decision — verified, no runtime change:** prefer the compact macro
when it conflicts with its expanded property: `rounded=4` wins over
`border_top_left_radius='20px'`. Python and installed JS already produce `4px`
in both authoring orders. GC-087 §065 resolves this reviewed case; it does not
specify precedence for unrelated macro/sub-parameter collisions. Recipe work
remains deferred. Null-to-empty conversion remains DOM-only.

**Latest owner correction — null becomes empty at the DOM boundary only:** the
previous static-HTML interpretation was incorrect. Reverted the added null coercion
in both Python and generic JS HtmlRenderer, its static regressions and README claim.
No new static null policy is approved. Gramlot's existing HtmlElement already maps
null Source text and null input values to empty DOM text/value. No new runtime
class or path is needed. Added one native Source-to-DOM regression covering creation,
updates, preserved DOM identity, null retained in Source, and zero/false preserved.

Verified installed archive: generic65/core51 on both Node and Bun; 14 focused Python
HTML checks. Generic JS packaged sources match the pre-misinterpretation checkpoint.
Bundles rebuilt. Artifacts: `/private/tmp/gramlot-dom-null/`. This verifies direct
Source-to-DOM behavior, not a new Data binding implementation or host-matrix result.
Recipes remain deferred. Further work follows existing builder decisions; unresolved
CSS macro/direct precedence is now resolved by the compact-form decision above.

**Historical implementation (then current) — ordinary grammar declarations:** class definitions and
instance collection loading now compile case-insensitive tag names through one
function. A subclass may override the exact inherited name, but `Item` plus `item`
is rejected before changing grammar state. This fixes a reproduced discrepancy
with Python, with no new class or declaration API. Installed local package checks:
generic65 Node/65 Bun and core50 Node/50 Bun, plus 14 focused Python HTML checks;
browser bundles rebuilt. Artifacts: `/private/tmp/gramlot-grammar-review/`.

**Static HTML review — bounded correction verified:** HtmlBuilder/HtmlRenderer
ownership is coherent. Python and JS no longer split CSS declarations at semicolons
inside quoted/escaped values, comments or nested functions/groups. Explicit width
still overrides style. This is a declaration-splitting correction, not a complete
CSS parser or a changed precedence policy. No new class or dependency was added.
The reviewed explicit macro/direct CSS collision is resolved by the owner's
compact-form precedence decision (GC-087 §065). The owner's null-to-empty
rule concerns the DOM boundary only (latest checkpoint above), not Python/static
serialization. Recipes are deferred and do not block any of this work.

**Historical checkpoint (then current) — named sub-builders:** generic Builder JS now supports
explicit class registration, host-local per-dialect instances, shared Data, active
node/branch dialects, default-renderer dispatch, root `node_id` lookup/target IDs,
and named typed-Source reconstruction. One SourceBag binding traversal serves
transport and prebuilt branches; a proposed duplicate/fallback path was rejected
and removed. No new runtime class, wire format or browser engine.

Verified against the installed local npm archive: generic62 Node/62 Bun; core50
Node/50 Bun; browser bundles rebuilt. This is bounded static named dispatch, not
complete generic-builder acceptance. SVG assets, runtime `kwarg:attr` references
and live sub-builder events remain outside this slice. The running Python Hello
World still uses the previous wheel. Artifacts: `/private/tmp/gramlot-subbuilder/`.

**Owner scope update, 2026-09-20 — recipes deferred:** keep only the possibility
of a Source macro/authoring shortcut. Do not define or implement its contract now.
The earlier root/override/parameter discussions below are retained as history,
not current acceptance criteria or prerequisites. Existing recipe code is
provisional; it is not being accepted, extended or removed by this deferral.
Continue the generic builder and ordinary native HTML authoring/static rendering.

Next: review ordinary HTML authoring and static rendering against Python, with
attention to class responsibilities and grammar inheritance; fix only established
contract defects. Recipe API questions no longer block this work.

**Latest correction — CSS precedence:** explicit CSS keywords and `style_*`
escapes now override `style` regardless of order in the Python and JS HTML renderers.
Existing non-conflicting style properties are retained; macro composition is unchanged.
Verified: 13 focused Python checks and 55 generic checks each on Node and Bun.
Local JS artifact refreshed, installed precedence verified and bundles rebuilt. Running Python Hello World remains on
its previous wheel; this correction does not imply live CSS support in Gramlot.

**Latest implementation — bundled HTML5 (GC-087 §045, GC-094 §115):** Builder JS
now includes HtmlBuilder, static HtmlRenderer and the shared Python-exported HTML5
JSON grammar (117 declarations, format 1.1). CSS keyword/macros belong to that
renderer; generic RendererBase remains CSS-agnostic. Class JSON declarations use
the existing parser, preserving HtmlBuilder subclass extensions. Gramlot now owns
HtmlElement and DomRendererBase; its DOM JS dependency is removed from source,
manifest, installed graph and rebuilt notices. The DOM repository remains reference.

Verified: generic54 Node/54 Bun; core50 Node/50 Bun after package-manager
installation of local npm artifacts. Hosted/offline bundles rebuilt. The installed
Python grammar export matches the bundled JSON exactly. Static rendering needs no
browser globals. This is implemented/verified, not overall design acceptance.
Live CSS reuse is still pending. SVG sub-builder rendering fails explicitly pending
generic dispatch. CSS precedence is now fixed in Python and JS: explicit attributes always win
over `style` (GC-087 §050). Running Hello World still uses the previous wheel.
Artifacts/logs: `/private/tmp/gramlot-html-static/`. No commits/push/publication.

**Historical priority (then current) — Builder JS first:** the owner now asks to consolidate the
generic JS builder before building the remaining layers on it. The reference is
the current Python builder with JSON grammar. Bootstrap migration, further DOM/
Gramlot work and the host matrix wait for this foundation; see GC-094 §105.

**Latest implementation — reactive ownership:** generic Builder JS no longer has
handler state, segmented Data, Source subscriptions, live patch planning or WC
activation. Static Data is instance-owned, both pointer forms resolve once, and
component expansion has no live writeback side effects. Component schema/maps now
belong to each instance. Gramlot owns the relocated HtmlSourceRenderer and mutation
projection; the stateless helpers have also moved into Gramlot (§115). Old Application/BuilderHandler
are removed from its root exports and distribution list, with historical source
retained for review. No legacy reactive engine was bulk-ported into Gramlot.

Verified: generic46 Node/46 Bun; core50 Node/50 Bun, including relocated live tests;
browser bundles rebuilt. Current source/dependency graph follows the new boundary.
The running installed Python Hello World remains on the previous wheel; no new
real-browser/host-matrix claim. Full builder parity remains open, including
sub-builders, declaration inheritance, templates/presentation/resolvers and the
complete callable declaration contract. GC-094 §110 records review limitations.
All work remains local and uncommitted; dependencies remain floating.

**Latest owner clarification:** Builder JS is to follow the current Python builder,
with JSON grammar and arbitrary dialects/static outputs. HTML and Gramlot's reactive
object rendering are specializations, not the generic base's premise. GC-087 §030
records this; database/invoice implementations are examples, not added scope.
The owner confirmed HTML text as static output and identified bootstrap generation
as a possible use. Hosts still assemble that HTML directly; migration has not been
implemented or verified. Builder-first execution and remaining gaps are recorded
in GC-094 §105; bootstrap migration is deferred until foundation closure.

**Historical plan (then current):** [GC-094](094-design-consolidation-plan.md). Execute only existing
owner decisions; report unresolved problems instead of inventing solutions.
GC-094 §085 withdraws the earlier native-failure question gates. A final response
without a question must mean the requested work is complete; interim updates do
not end execution (owner instruction, 2026-09-20).

| Phase | Current state | Concrete result / remaining work |
| --- | --- | --- |
| 0 · Contract inventory | Recorded | Classes, subscriber payloads and actual consumers in GC-094 §075–080 |
| 1 · Generic foundations | Active priority; partial implementation verified | Generic rendering/grammar corrections in GC-094 §105; reactive ownership correction implemented under GC-087 §035; full Python parity remains open |
| 2 · DOM lifecycle | Pending | Current implementation still contains overlapping preparation/validation paths; no new failure policy approved |
| 3 · Gramlot integration | Pending | Mechanical module placement cleanup completed independently; renderer lifecycle unresolved |
| 4 · Page/Host | Pending | Existing execution/lifetime divergences remain recorded |
| 5 · Single-host closure | Pending design closure | Current installed artifact/browser refreshed after bounded changes; architecture not accepted |
| 6 · Host/offline matrix | Pending | Requires single-host review; previous matrix is historical |
| 7 · Local acceptance | Pending | No owner acceptance, commits, pushes or publication |

**Owner decision received:** reactive coordination belongs to Gramlot; it is being
removed from Builder JS. Removing the DOM JS dependency is now approved, with
the repository retained as reference (GC-087 §040). GC-087 §035
supersedes the previous Application-compatibility question. Do not preserve a
reactive engine in the generic base or bulk-port the old one into Gramlot.

Previous core source changes: recipe expansion reuses an already-expanded branch;
sourceBagToTytx/sourceBagFromTytx moved unchanged to SourceBag's module. HTTP transport
now lives in js/src/transport.js; mounted references in js/src/references.js.
Root exports and class names are preserved; misleading folders/forwarding imports
removed. No new class or execution path. Details: GC-094 §090/095.

Code review was followed by generic22 Node/22 Bun and core45 Node/45 Bun checks.
Bundles were rebuilt. The current wheel is installed and FastAPI/Uvicorn browser main/remote/dynamic
checks plus Hello World pass (§100). Hello World is running at localhost:8000. The prior implementation checkpoints below are history, not current
phase acceptance. All changes remain local and uncommitted.

<a id="gc-125-005"></a>

## 005 · Current milestone

Consolidate the minimum portable Python/JS foundation for native HTML Source
construction and dynamic updates. The host serves bootstrap HTML first; the
browser prepares Data and Source roots and the Source subscriber before requesting
main. Its returned Bag insertion must trigger initial DOM construction through
the same renderer used for later changes.

**Status: implemented development slice, not yet a closed or accepted milestone.**
Work is uncommitted on codex/developer-docs. It has not been consolidated into
develop/main, released or deployed. Node/Bun server bridges are reusable adapters with tested installed launchers.
The upstream Bag backref issue is no longer blocking this work.

<a id="gc-125-010"></a>

## 010 · Completed and verified

- [x] Inspect legacy source subscription, insertion/deletion/rebuild and bootstrap.
- [x] Identify legacy Python __ref/pyref mechanism; implement bounded opaque
  node/DOM references without evaluating generated JavaScript expressions.
- [x] Implement Python native HTML Source authoring and TYTX serialization.
- [x] Implement browser bootstrap, prepared roots and main-to-Source insertion.
- [x] Implement one renderer coordinator with a delegated HTML view handler.
- [x] Cover ordered insertion, recursive cleanup, native attribute/property setters
  and structural replacement; keep unrelated host DOM intact.
- [x] Implement Python Host and adapter-owned Page base, async/sync main and page IDs.
- [x] Implement matching JS Host/Page, FileHost and JS Source authoring.
- [x] Verify Node and Bun host contracts and Chromium HTTP bootstrap/main behavior.
- [x] Upgrade the stale Bag JS dependency; verify nested events without a builder
  workaround and remove that workaround.
- [x] Apply owner policy: no first-party version bounds, Git tag/commit pins or
  lockfiles; refresh owned dependencies during setup/update.
- [x] Record ports and paired internal host documentation.
- [x] Separate public Sphinx manual from internal architecture; add documentation,
  project status and license badges. Hosted coverage badges remain pending.
- [x] Replace the hand-written authoring path with Python and JavaScript
  `GramlotBuilder` dialects over the generic builder grammars.
- [x] Associate `GramlotRenderer` with the generic JavaScript `RendererBase` and
  expand detached main/remote recipe trees before active Source insertion.
- [x] Add explicit Python `@source` discovery and registered SourceBag TYTX
  transport preserving labels, mixed text, parameters and opaque references.

- [x] Complete portable grammar 1.1 export and generate the shared HTML5 collection
  (117 declarations); remove the manual HTML whitelist.
- [x] Load and validate that format in Python and JS GramlotBuilder through the
  owning generic builders; merge additional collections with collision checks
  and instance isolation.
- [x] Verify shared collection constraints, Python-to-JS rendering, custom tag
  mapping, recipe inheritance and identical wheel/npm collection contents.

Historical collection verification (superseded by the top checkpoint): core Python 17/17, Node 41/41, Bun 41/41;
generic JS 18/18 and DOM 126/126 per runtime. Generic Python: 416 passed and
two reproduced baseline failures (see GC-092). Browser checks cover Python/Node
main, remote recipes, dynamic changes and an additional collection.
The complete six-host/two-standalone matrix passed before this revision and
must be refreshed before closing the current slice.

<a id="gc-125-015"></a>

## 015 · Local completion and remaining gates

- [x] Generic Python/JS renderer review and native transport/authoring contracts.
- [x] Extract generic Builder JS and concrete DOM renderer under GC-087 ownership.
- [x] Remove the browser loader shim; implement browser dependencies in TYTX.
- [x] Remove transitive owned dependency constraints in durable Bag worktrees.
- [x] Rebuild final artifacts and verify Node/Bun, four Python hosts and standalone.
- [x] Reconcile paired documentation, maps, port feedback and handoff.
- [x] Validate current native HTML Source and example Hello World on FastAPI/Uvicorn.
- [x] Resolve GC-093 authoring ownership and native-HTML failed-write findings.
- [x] Recheck final artifacts on FastAPI/Uvicorn: Hello World, rejected invalid
  Source write, nested changes, remote recipes and disposal in Chromium.
- [ ] Review this single-host result with the owner before expanding verification.
- [ ] Then refresh the six-host/two-standalone installed-artifact matrix after the
  collection changes.
- [ ] Owner review of collection loading, repository organization and documentation;
  acceptance of this bounded HTML slice.
- [ ] Future authorized development commits, upstream source availability and a
  fresh floating upstream install; then accepted main consolidation.
- [ ] Separate follow-up: JS-first coverage collection and CI reporting, keeping
  Python coverage distinct. No hosted coverage badge status is claimed.

Owner instruction: retain all changes locally for review. Passing tests do not
constitute owner acceptance or authorize publishing sources, packages or deployments.

<a id="gc-125-020"></a>

## 020 · Later steps, not silently added to step 1

- [ ] **Step 2:** translate convenience attributes such as color/background to CSS.
- [ ] Export descriptions from JS element definitions and automate custom-element
  registration; define collection discovery/distribution.
- [ ] Define how additional collections extend native-container child constraints.
- [ ] Define component capabilities and their composition: styling, binding,
  labeling and boxing; distinguish Source expansion from runtime behavior.
- [x] Integrate native mixed HTML/SVG rendering, including the SVG-to-HTML
  boundary, dynamic mutations and remote destination dialect (GC-094 §155).
- [ ] Complete the agreed view/controller/model organization as each responsibility
  lands; the present folders are a starting slice, not the final class hierarchy.
- [ ] Port Data bindings, application controllers, resolvers and shared capabilities
  through their own bounded contracts. Data root preparation alone is not binding.
- [ ] Add richer Python-reference consumers when components/controllers need them;
  legacy widget/form modes and expression compatibility are currently absent.
- [ ] Add database integrations and further server engines in their owning projects.

<a id="gc-125-025"></a>

## 025 · Updating this list

Update this file and its mirror after each meaningful implementation, verification,
scope change or discovered blocker. Tell the owner what changed and what comes
next without waiting for a status request. Retain the distinction between
implemented, tested and accepted. This is an in-task working list, not a scheduled
background automation or authorization to publish, deploy or expand scope.


<a id="gc-125-030"></a>

## 030 · Historical execution checkpoints

The following notes preserve earlier decisions, rejected approaches and intermediate
results. Their present-tense statements and next actions are historical. Sections
005–015 and GC-089 define current status; PORT-0004 records the resolved review.

Current execution: the owner-approved builder, renderer and recipe direction is
implemented and locally verified in the combined working trees. Upstream dependency
acceptance and owner review remain. No rendering of detached expansions, CSS shorthand,
first-party dependency pins, publication or deployment is included.

Owner review, 2026-09-19: PORT-0003 requires revision. Passing tests of the snapshot/hydration adapter do not establish the intended ownership contract. Replace ordinary-Bag snapshots and coercion with registered SourceBag TYTX transport. Bag/TYTX own typed reconstruction and events; generic builders own SourceBag registration, builder association and recipes; Gramlot owns its dialect, DOM renderer and host pipeline. Existing TYTX outer encoding already preserves registered root and branch types in JSON and MessagePack (direct JS probe passed). Implementation and cross-language verification are in progress.

Typed ownership revision verified: core Python 9/9, Node 25/25, Bun 25/25;
generic Python builder 403/403 and JS builder 117/117. Chromium passes against
Python, Node and Bun hosts, including native node tags/scalars, remote recipes and
disposal. Packages were installed from local generic-builder artifacts, with normal
JS dependency installation (no source symlinks). No Bag/TYTX protocol modifications
were needed: root and branch types use their existing registry. SourceBag registration
belongs to generic Python/JS builders; JS builder binding preserves identities and
insertion publishes a fully tagged node. Gramlot no longer snapshots or hydrates.
Next: consolidate the two generic-builder changes upstream, verify a clean floating
installation, then complete destination acceptance. No publish or push performed.


Documentation organization, 2026-09-19: added a repository documentation entry
(`docs/README.md`), paired internal operating guide GC-085, and public draft
chapters GC-090 (repository/classes/hosts), GC-095 (pages) and GC-100 (extensions).
Only these three additional public chapters enter the explicit Sphinx allowlist;
internal operational and inventory material remains excluded from site/search/sources.
No future code directories or speculative class implementations were added.
Strict Sphinx build and the seven-page public boundary/link/mirror check pass.
The documented Python main/@source authoring and JS recipe snippets execute against
the installed development libraries. User review of the proposed reading order and
repository map is pending; production-host and extension-discovery chapters remain
explicitly incomplete. Next: review this small documentation structure, then complete
upstream dependency consolidation before claiming a reproducible public quickstart.

Added GC-086: a standalone repository map containing only the current logical tree and external-library locations, with a paired mirror and documentation-index link. Paths checked against the checkout; no runtime changes.

Gramgit application direction: owner identified legacy gnrgh as reference. Read-only inspection of its menu, organization views and GitHub client under the local gnrgh clone confirms organizations, repositories, branches/commits, issues/PRs and related users/artifacts. Proposed first application slice: organization list → organization repositories → repository details. This is a proposal, not an accepted port or implemented application. Later synchronization, OAuth and local Git operations require separate scope. No external GitHub calls or application repository creation performed.

Created owner-requested private GitHub repositories gramlot-org/gramlot-git-app (progressive gnrgh successor) and gramlot-org/gramlot-example-app (reference application structure). Each starts with a README; no application functionality or dependency pins introduced. Local sibling checkouts are clean on develop, tracking the published origin/develop branch; main remains the default reference. Next: define the first bounded application skeleton and host choice.

Example application skeleton, 2026-09-19: owner clarified scope as folder structure/placeholders only. gramlot-example-app now has one pages/index.py (Page.main authors a single Hello World h1), server slots uvicorn/fastapi/kajenn/flask/nodejs/bun, and db slots sqlalchemy/genropy (GnrApp.db)/bagdb. No host/database integrations, connections or matrix support claimed. Native Host.main/typed Source authoring check passes. README and paired application map distinguish implemented page from placeholders. Changes remain local on develop.

Example application packaging, 2026-09-19: added pyproject.toml for distribution gramlot-example-app and src/gramlot_example_app package. Moved the single page and server/db placeholders inside the installable package; replaced requirements.txt with unconstrained project dependency gramlot. Updated both application maps and README. Standard isolated pip wheel build and temporary wheel install passed; imported the installed page outside the checkout, verified its sole Hello World node and all nine packaged placeholders. No CLI or running host/database integration claimed; no package publication.

Equivalent application pages, 2026-09-19: example-app now has Python pages/index.py and JS js/pages/index.js, each producing one Hello World h1. Python neutral Host test passes; the JS package consumer test passes on Node and Bun through FileHost.fetch, typed Source, Gramlot/jsdom rendering and disposal. No database or Python worker is used by the JS page. Python host placeholders now cover Uvicorn/FastAPI/Kajenn/Flask; JS placeholders cover Node/Bun. Production network integrations remain unimplemented. Core JS gained explicit package browser/server exports, FileHost export and packaging of the canonical HTML vocabulary; all25 core JS tests pass. The example consumes package archives, with a temporary local transitive builder install until upstream consolidation; no sibling source imports or manifest pins. Updated application map/README describe this limitation.

Standalone audit, 2026-09-19: gramlot-standalone owns offline packaging. Its existing PoC showcase is a directory/ZIP export with bundled assets and embedded Source; RPC reports unavailable. Re-ran13 packager tests and showcase archive integrity check (12HTML pages/local assets): passed. These are not new browser-runtime acceptance checks. Generic single-file command still requires missing gramlot.standalone.compile_project and intentionally fails without output. Its documented ordinary-Bag hydration requirement predates the current typed SourceBag contract and must be revised before integration, not copied. Current example-app has no standalone integration. Candidate first slice: the same HelloWorld with embedded native Source and no network; Python authors at build time, JS authors can bundle for browser execution. No database is required, and no broad offline feature set is implied.

Repository renamed by owner request to gramlot-org/gramlot-examples (private). Local checkout is now /Users/gporcari/Sviluppo/gramlot/gramlot-examples, origin updated, develop and all uncommitted work preserved. This repository is a collection of example applications; the existing Hello World package names are unchanged. Moving individual examples under apps/ remains pending; historical entries above retain their original repository name.

Sol execution review, 2026-09-19: Bag/TYTX audit finds no missing protocol/event
behavior; no Bag implementation change is required. Generic JS now explicitly
tests SourceBag JSON and MessagePack; suite118/118 passes. Core Python code is
organized into page/ (Page, source decorator, GramlotBuilder, Source), server/
(Host), and db/ (README placeholder). Root Page/Source/GramlotBuilder imports stay
stable; pre-release Host import moves to gramlot.server. Core Python9/9 passes
from an installed wheel outside the checkout; JS25/25 and strict documentation
checks pass. Example collection now contains apps/hello-world with independent
Python/JS package manifests and unchanged package names; Python/Node/Bun tests
pass1/1 each. Paired maps and operating/user docs updated.

Remaining consolidation question: genro-dom-js has an older retirement notice
pointing to the PoC migration; owner has been asked whether to retain this repo as
the separate generic builder or use genro-builders-js. No upstream push or merge
performed. The Python remote codex/sourcebag-tytx branch uses XS, differing from
the locally verified shared SOURCE identifier: reconcile deliberately before
consolidation; do not blindly merge. Clean floating consumer installation remains
pending generic-library consolidation. Production hosts, DB and standalone were
not expanded beyond their approved placeholder/investigation scope.

Ownership correction, 2026-09-19: verified owner-requested retirement notice dated2026-09-09 in genro-dom-js/CLAUDE.md and PoC workspace-map. JS builder/renderer development had moved into the framework then named Gramlot (now gramlot-poc). The historical repository was retained for recovery, not an independent active upstream. Therefore the prior plan to consolidate new JS work upstream in genro-dom-js is withdrawn. Generic JS builder and specialized Gramlot layers remain separate responsibilities within the destination Gramlot repository; their necessary code/tests must be reviewed and ported there, preserving historical/user edits. The newly introduced genro-dom-js dependency and local JS modifications require correction under that ownership decision. Python genro-builders and Bag/TYTX are separate dependencies, unaffected by this JS retirement. No migration or deletion performed in this clarification.

Generic JS authoring gap identified: Python genro-builders implements element/abstract/container/component decorators. Historical JS builder and PoC instead compile explicit defineGrammar({elements,abstracts}) data and register component methods through static components arrays. Gramlot JS currently uses that explicit grammar API; there is no matching element/abstract decorator authoring API. The separate generic JS builder extraction must define/test this declaration surface and its semantic parity before claiming parity with Python. Existing grammar consumption and rendering tests do not cover decorator-based authoring. No new decorator API implemented in this investigation.

Architecture consolidation, 2026-09-19: GC-087 is authoritative for the logical
boundary. Bag JS/TYTX own structure, events and typed transport; generic Builder JS
owns grammar, authoring, SourceBag, recipes and only a DOM-neutral RendererBase;
each dialect owns its concrete renderer. DOM JS owns HTML/DOM rendering, updates
and cleanup; Gramlot adds application pages, components, bindings, controllers and
host coordination. Current genro-dom-js remains mixed, its base finalize still uses
DocumentFragment, and GramlotRenderer remains in core. No extraction, repository
choice, dependency removal or code movement occurred. Next: settle physical
ownership and specify the base/DOM renderer migration.


<a id="gc-125-035"></a>

## 035 · Superseded status snapshots

The following text is retained as chronology. Its present-tense statements and
next actions are superseded by the current phase table at the top of this document.

**Module ownership cleanup, 2026-09-20:** HTTP transport now lives in js/src/transport.js;
mounted references in js/src/references.js. Removed misleading controller/model
module placement and direct Bag re-export indirection, retaining public exports and
behavior. No new class or execution path. Maps updated; bundles rebuilt; existing
Node/Bun checks pass. This independent mechanical cleanup does not close phase 1
or resolve the deferred renderer/host questions. See GC-094 §095. The installed
Python host wheel/browser matrix is not newly verified.


**Historical implementation (then current) — phase 1, 2026-09-20:** removed redundant recursive
copying of already-expanded recipe branches in genro-builders-js, using existing
Bag ownership operations. Source serialization helpers now live with SourceBag;
package exports remain unchanged. No new abstraction or behavior. GC-094 §090
records files, rationale and limits. Code review followed by generic Node/Bun and
core Node checks passed. Phase 1 remains active; the host bundle/matrix is not newly
verified. Open design issues stay in the final problem list. All changes local.


**Latest owner correction:** proceed only within existing decisions; collect
unresolved problems for the final report instead of designing speculative solutions
or making them prerequisite questions. GC-094 §085 overrides earlier Q1–Q5 gates.
The native DOM failure question is withdrawn; neither proposed behavior is approved.
Phase-0 inventories are recorded. Next work is limited to settled responsibilities;
new failure guarantees and lifecycle protocols remain unresolved. No runtime change
in this correction.


**Historical execution plan (then current):** [GC-094](094-design-consolidation-plan.md), prepared
2026-09-20 from owner decisions and the implementation-quality review. It replaces
GC-088 as the proposed next-work sequence; it does not turn review recommendations
into approved architecture. Owner authorized execution on settled decisions, with
questions before uncertain design choices. Phase-0 inventories are recorded; bounded phase-1 implementation is active (§090).

| Phase | State | Deliverable / gate |
| --- | --- | --- |
| 0 · Concrete contracts | Inventory recorded | Inventories recorded in GC-094 §075–080; unresolved issues reported, extra gates withdrawn (§085) |
| 1 · Generic foundations | Active, partial | Recipe duplicate copy removed; Source codecs relocated; existing consumers preserved |
| 2 · DOM lifecycle | Pending | One event/update path and explicit failure/cleanup semantics |
| 3 · Gramlot integration | Pending | Typed Source/recipes/references through public owner APIs |
| 4 · Page/Host | Pending | Shared execution, neutral host and explicit lifetime |
| 5 · Single-host closure | Pending | Code review, docs, installed FastAPI result, owner checkpoint |
| 6 · Host/offline matrix | Pending | Six hosts and two standalone profiles after checkpoint |
| 7 · Local acceptance | Pending | Reviewed local delivery; no publication authorization |

Phase 0 progress: class responsibilities and native subscriber payloads traced from
implementation; bootstrap/main/remote/direct mutation paths documented. Existing
DOM Application/BuilderHandler are public consumers of the older reactive APIs,
so those cannot be deleted wholesale. Static and dynamic rendering may legitimately
be distinct operations (GC-075); Q2 concerns their contracts, not forbidding static
rendering. Sol consumer audit is complete and independently checked (GC-094 §080).
Known exported reactive consumers must be preserved during migration; unseen
external consumers remain unknown. The earlier Q1 question is withdrawn by the latest owner correction;
its underlying issue is reserved for the final report. No runtime changes/tests.

Earlier implemented/verified checkboxes below are historical evidence, not closure
of these design phases. Immediate next work: phase 0, not another runtime patch.



**Historical priority (then current) — implementation quality, 2026-09-20:** owner requested a
code-only architecture review, excluding test results as evidence of design quality.
[GC-093 section 040](093-class-design-review.md#gc-093-040) records eight findings:
overloaded generic bases, incompatible inherited renderer contracts, multiple
validation/preparation paths, implicit identity/projection contracts, recipe ownership
leaks, duplicated page execution, misleading names and unclear mixin boundaries.
**Architectural revision requested.** Earlier functional completion does not close
these findings. Next: simplify the base/renderer contract, then the Source pipeline,
then Host/Page and names. Host-matrix expansion remains deferred. No implementation
changes were made during this review; all existing changes remain local.

**Historical collection integration (then current), 2026-09-20:** GramlotBuilder Python and JS now
load exported builder_grammar 1.1 collections through their generic libraries.
The manual HTML inventory has been removed from Gramlot and the DOM validator.
Core after the ownership revision: Python 19/19, Node 45/45, Bun 45/45;
generic JS 22/22 and DOM 127/127 on
both runtimes. Real-browser main/remote/dynamic checks and custom collection
rendering pass. See [GC-092](092-collection-authoring.md) for API and limits.

**Class review, 2026-09-20:** [GC-093](093-class-design-review.md) records the
class inventory, removals and unresolved ownership defects. Removed Source
compatibility wrappers, the renderer's Builder alias and the configuration-only
HtmlElement subclass; removed public authoring .bag. Gramlot now preserves the
generic builder's original Source root and shares its Data Bag.
After cleanup, Python 17/17, JS 41/41, FastAPI 2/2 and both real-browser
FastAPI checks pass against the rebuilt wheel.
The three authoring/pre-write findings are now addressed for native HTML:
see GC-093 section030 for the precise mutation contract and remaining limits.
Core Python19, Node45 and Bun45 pass; generic JS22, DOM127 per runtime, Bag JS604
Node pass. Generic Python has422 passing tests and two unchanged baseline failures.
Host/lifecycle review remains open; the full matrix stays deferred.

**Owner priority, 2026-09-20:** finish and validate the source implementation on
FastAPI/Uvicorn before expanding to the host matrix. Current local artifacts are
installed in the Python host environment. Real Chromium passes both the example
Hello World and the native-HTML fixture (bootstrap/main, nested insertion,
updates, deletion/replacement, remote recipe and disposal), without JS errors.
Core Python 17/17, JS 41/41 and FastAPI native adapter tests 2/2 pass.
Cross-language JS tests explicitly use the updated Python host environment;
the default system Python lacks the current Gramlot/SourceBag installation.
The browser harness accepts GRAMLOT_TEST_URL to exercise an actual adapter.
The full host matrix remains deferred until this single-host review is complete.
All changes stay local; no owner acceptance or upstream publication is implied.

The following native-HTML delivery counts predate collection integration.

**Historical handoff (then current), 2026-09-19:** local native HTML implementation and final
six-host plus Python/JS standalone browser matrix are complete. Core tests:
Python 14/14, Node 36/36, Bun 36/36; generic Builder 12/12 per runtime;
DOM 124/124 per runtime. All agents finished. Owner explicitly requested keeping
all changes local for review: no commits/pushes/remote creation/release/deployment.
See [GC-089](089-native-html-handoff.md) for repositories, evidence and next steps.
Acceptance, upstream installation and develop/main consolidation remain open.

**Next:** phase 0 of GC-094. Source publication and a fresh upstream install
remain separate future actions; local-only review remains in force.


**2026-09-23 — Ecosystem release review:** GC-130 records thirteen-repository local review, coherent bounded core ownership, incompatible legacy adapter entry points and stale primary documentation. Core Python 17/17, Node 75/75, native Python adapters 8/8, exporter 3/3 and strict core/four-adapter documentation builds pass. The latest 0.1.0 wheel/archive pass all seven Chromium profiles over existing dependencies, supplementing earlier fresh-install evidence. Native release alignment and owner acceptance remain pending; no runtime changes, release or deployment. See [GC-130](130-release-ecosystem-review.md).


**2026-09-23 — Approved release alignment completed:** Sol handled connected
adapter/example documentation and native public-export alignment; coordinator
review corrected installer instructions and verified exact packages. Fresh Python/npm
installations, pip check, native/star imports, installed Python 17/17, native
adapters 8/8, four launcher HTTP checks, Chromium 7/7 and standalone file checks
pass. Strict core/three-adapter docs pass. GC-130 §035 closes native entry/doc
findings; GC-135 describes nine local artifacts. Legacy consumer migration and
pin-policy debt remain separate, as do owner acceptance/publication. No release.
