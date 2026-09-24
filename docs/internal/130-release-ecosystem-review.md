# 130 · 0.1.0 ecosystem review

Document ID: **GC-130**. Reviewed: **2026-09-23**.

**Current outcome:** the owner-approved alignment is complete; see [section 035](#gc-130-035). Earlier findings below record the initial review. Acceptance and publication remain pending.

[Concise counterpart](../../docs_llm/internal/130-release-ecosystem-review.md).

<a id="gc-130-005"></a>
## 005 · Verdict and scope

The native HTML foundation is technically a credible 0.1.0 candidate. Its class
boundaries follow the approved architecture, and the checks below pass. Do not
yet describe the whole ecosystem as release-ready: several adapters still lead
users into incompatible PoC APIs, and their main documentation contradicts the
current packages. Complete the bounded release alignment in section 030 before
acceptance. This is a review recommendation, not a new execution plan or acceptance.
[GC-110](110-native-html-readiness.md) remains the release plan.

Reviewed local source and maintained documentation in thirteen repositories:
core, FastAPI, Flask, Genro ASGI, NodeJS, standalone, examples, Django, PoC, site,
Rosetta, meta and git-app. Runtime review and fresh checks concentrate on the
seven-profile 0.1.0 path; historical applications received compatibility and
documentation triage, not full application regression testing. Bag, Builder and
TYTX were inspected at the consumed API boundary, not exhaustively re-audited.
No live website, registry or remote branch synchronization was verified here.
No runtime implementation or dependency source was changed by this review.

<a id="gc-130-010"></a>
## 010 · Architecture assessment

| Layer | Actual ownership and assessment |
| --- | --- |
| Bag / TYTX / generic Builder | Tree, events, typed transport, Source classes, grammar and static rendering stay in dependencies. Rendering consumes typed SourceBag/SourceBagNode. No ordinary-Bag rendering path was found in the reviewed pipeline. |
| Python Page / GramlotBuilder | `page/base.py` owns Page and marked Source methods; `builder.py`, `_grammar_load.py` and `_collection.py` implement the bounded Python dialect exception in constitution 11.16. The latter two modules are missing from GC-086's map. Their private Builder imports are a coupling to track, not a reason to add a fallback or rewrite dependencies. |
| JavaScript authoring | GramlotBuilder extends HtmlBuilder and consumes generic `sourceTarget`. Page declarations remain separate from browser components. |
| Browser | Gramlot coordinates startup, main/remote Source and disposal; GramlotRenderer owns observation, FIFO, mounted records, freeze and cleanup; HtmlElement owns native HTML/SVG; References owns mounted identities. The split has concrete consumers and does not need a new class hierarchy for 0.1.0. |
| Host / transport | Neutral Hosts execute fresh Page/Builder instances and own bounded page registries. MainTransport and WorkerTransport own their I/O lifetimes. JS FileHost owns filesystem loading; Python Host's directory loader is an explicitly retained 0.1.0 choice, not missing parity to fix. |
| Server adapters | Native FastAPI/Flask and ASGI/Kajenn modules translate HTTP to Host. Node/Bun share `native-fetch.mjs`. Kajenn subclasses the shared ASGI integration for its actual server asset API; it does not implement Orchestra-managed registry migration. |
| Standalone | Exporter bundles a JS Page and produces HTML through HtmlBuilder. WorkerHost executes the same Host contract at runtime. No Python compiler or second Page engine is needed. |
| Databases / richer components | Core database directory is a placeholder. PoC/Django database and component classes are evidence, not accepted 0.1.0 APIs. |

The future design is a responsibility map, not an approved final inheritance tree.
Components, recipes, controllers, resolvers, bindings and database contracts must
be specified incrementally. Do not bring legacy classes into core merely to make
the repository inventory resemble a future diagram.

<a id="gc-130-015"></a>
## 015 · Findings requiring release alignment

### R1 · High: advertised adapter entry points fail with the new core

FastAPI, Flask and Genro ASGI package exports retain their old application surface
beside the native implementation. Their CLI paths still select it:

- `gramlot-fastapi/src/gramlot_fastapi/__main__.py` imports `.application.GramlotApplication`.
- `gramlot-flask/src/gramlot_flask/cli.py` routes `serve` to `.application.mount_gramlot`.
- `gramlot-genro-asgi/src/gramlot_genro_asgi/__main__.py` imports `.application.GramlotApplication`.
- These application modules import `gramlot.builder` and further PoC modules
  absent from the clean core.

Reproduced against installed core **0.1.0** and installed adapters: importing
`gramlot_fastapi.GramlotApplication`, `gramlot_flask.mount_gramlot` and
`gramlot_genro_asgi.GramlotApplication` each raises
`ModuleNotFoundError: No module named 'gramlot.builder'`. Native imports succeed;
their eight protocol tests pass in the same assembled environment.

NodeJS similarly advertises `npm start`, which selects the historical PoC server;
the working native exports are `gramlot-nodejs/native` and `gramlot-nodejs/bun`.
This Node observation is a source trace, not the Python import reproduction.

**Required outcome:** one clearly identified 0.1.0 user path through existing native
APIs and runnable launch instructions. Decide the retained public CLI/export surface
before changing or removing old entry points. Do not add aliases or compatibility
emulation to make the old PoC APIs appear supported. Existing tests for the native
modules alone do not validate the advertised package entry points.

### R2 · High: primary documentation describes a different product

FastAPI README, SPECIFICATION, GF-010 and GF-020 still describe a checksummed
PoC 0.1.5 dependency, although its current manifest declares unconstrained `gramlot`.
The README calls clean Gramlot non-executable. Flask README/SPECIFICATION also
promise the PoC wheel; Genro ASGI README requires a sibling PoC and records an old
dependency conflict as its current baseline. NodeJS README presents only the
sibling-PoC server and says no npm installation is needed.

The native guides GF-050, GFL-025, GA-010 and GN-010 correctly describe the new
path, but do not replace those main entry points. Passing Sphinx builds cannot
detect this semantic contradiction. Core GC-025 directs readers to adapter setup,
so the inconsistency affects the core's trial path too.

**Required outcome:** make the release profile primary in README, installation,
class/module map, specification, release instructions and mirrors. Preserve PoC
material with explicit historical/experimental scope. Verify the actual commands
shown to a new user against the selected artifacts.

### R3 · Medium: Python grammar ownership is inaccurately generalized

GC-100 section 025 says both loaders compose through the generic Collection.
Python actually imports Gramlot's `._collection` module from
`page/_grammar_load.py`; JavaScript uses the generic loader. GC-086 omits both
Python helper modules. This obscures the owner's explicit 11.16 exception and
could trigger an incorrect future consolidation into Builder.

**Required outcome:** describe the Python exception and actual module split in
both documentation views; retain the approved code ownership. No refactor is
required to fix this documentation finding.

### R4 · High for an ecosystem claim: older consumers are not 0.1.0 consumers

Django remains a PoC adapter. Its manifest requests the fixed Gramlot 0.1.5 wheel
and bounds `genro-bag` below 0.22. Site installs the old 0.1.3 wheel; Rosetta's
optional dependencies and lockfile pin first-party Builder/Bag/TYTX packages and
its application uses PoC `gramlot.contrib.fastapi`. These maintained pins conflict
with constitution section 12; historical evidence is allowed, active installation
pins are not silently grandfathered by this review.

**Required outcome for 0.1.0:** explicitly exclude these consumers from the native
release compatibility matrix and separate their demonstrations from its feature
claims. Record owning-repository migration/dependency-policy work. Do not remove
pins blindly and imply that the richer applications then work with the smaller core.
Migrating Django, site and Rosetta is not a hidden prerequisite to shipping the
already agreed seven-profile foundation, nor permission to expand it now.

### R5 · Distribution preparation is incomplete, separate from local readiness

Core npm and NodeJS manifests have `private: true`; their dependent packages use
floating npm names. Adapter versions are independent development versions. These
facts do not invalidate locally packed artifacts, but a source tag alone does not
provide an ordinary npm installation path. Existing notice-distribution tasks for
NodeJS and Hello World remain recorded in GC-110; this review did not check remote
publication. No registry release is implied by successful local installation.

**Required outcome:** state which packages and versions constitute the release,
whether delivery is GitHub archives or registries, and the dependency delivery order.
Change publishing flags only for a separately approved registry release. Do not
require identical version numbers across all independent repositories by inference.

<a id="gc-130-020"></a>
## 020 · Repository disposition and documentation debt

| Repository | Disposition for this release |
| --- | --- |
| gramlot | Bounded native foundation; tests pass; R3 documentation correction and release handoff remain. |
| gramlot-fastapi | Native implementation sound in checked profile; R1/R2 entry point and documentation repair. |
| gramlot-flask | Native implementation sound in checked profile; separate PoC Microblog surface from native release. |
| gramlot-genro-asgi | Raw ASGI and Kajenn pass; update README/CLI scope; Orchestra remains excluded. |
| gramlot-nodejs | Node/Bun native profiles pass; promote native instructions over historical `npm start`. |
| gramlot-standalone | Current exporter responsibility is coherent; three checks pass; delivery and version evidence need release alignment. |
| gramlot-examples | Python/JS Hello World uses real core APIs. Repository README incorrectly calls server profiles placeholders; runnable server launchers already exist. Application README still names the server import instead of the actual browser-safe `/page` import. |
| gramlot-django | Explicitly outside the native matrix; richer Page/ORM API remains PoC. |
| gramlot-poc | Laboratory and legacy reference; its 0.1.5 numbering does not define clean core release compatibility. |
| gramlot-site | PoC 0.1.3 application and marketing content, not current core verification. Update release positioning before presenting it as the new release's site. |
| gramlot-rosetta | PoC comparison application; no migration or native-core acceptance inferred. |
| gramlot-meta | Explicit archive, not a live authoritative specification. |
| gramlot-git-app | Minimal project skeleton; no implementation acceptance or core-release gate inferred. |

Markdown mirror inventory before this report: core **37/37** with matching explicit
anchors; examples, Flask, Genro ASGI, NodeJS and standalone have corresponding
Markdown mirrors. FastAPI lacks one Markdown mirror; Django lacks eleven.
Their policies already acknowledge legacy coverage gaps. FastAPI GF-030's stable
GF anchors match; only legacy descriptive aliases differ between views.
Site and Rosetta lack mirrors for ten and nine inventoried Markdown documents.
PoC has much larger historical gaps. Inventory excludes history/archive/build
directories and does not establish semantic equivalence or RST mirror coverage.

Existing unnumbered/legacy paths must be migrated without breaking stable IDs.
Do not mass-rename historical files as a release prerequisite. Fix documents touched
by release alignment and record the rest as debt. GC-086's stale external-library
phrase about detached candidates and older present-tense investigation passages
also deserve cleanup when their guides are revised. The core showcase links still
use `#try-the-unified-showcase`, absent from the current local standalone README;
verify the intended public destination before release. No live URL failure is claimed.

<a id="gc-130-025"></a>
## 025 · Checks performed and limits

| Check | Result and boundary |
| --- | --- |
| Core Python | 17/17, current checkout and existing `.venv`, unittest discovery. |
| Core JavaScript | 75/75, current checkout, Node, `GRAMLOT_TEST_PYTHON` set explicitly. |
| Python native adapters | 8/8: FastAPI 3, Flask 3, ASGI/Kajenn 2; installed adapters with installed core 0.1.0 site-packages over the existing phase-4 Python 3.12 environment. Two dependency deprecation warnings; no test failures. |
| Seven Chromium profiles on versioned core | 7/7: Uvicorn, FastAPI, Kajenn, Flask, Node, Bun, Worker. Latest locally prepared 0.1.0 wheel/archive extracted into isolated consumer paths over the existing phase-4 dependency graph. Typed main, attributes/text, nested insertion/deletion, replacement, remote Source, freeze/unfreeze, plain-Bag rejection, disposal and server closure/Worker termination pass. |
| Standalone exporter | 3/3 from a temporary copy of current exporter source/tests against the isolated 0.1.0 JS graph; includes no build-time Page execution, failure preservation and CLI invocation. |
| Documentation | Strict Sphinx passes core, FastAPI, Flask, Django and Genro ASGI. ASGI needs installed package metadata as its configuration declares; an initial docs-only environment lacked it, then the configured installed metadata was supplied and the build passed. Core public boundary/link/search/source/mirrored-anchor check passes, seven pages. |

The versioned Chromium rerun supplements GC-110's earlier fresh installation
matrix; it is not a new network dependency refresh or fresh installer reproduction.
It does not cover every legacy suite or claim Safari/Firefox support. Initial
Chromium launch was sandbox-blocked; the permitted local rerun completed all seven.

Artifact SHA-256 evidence (identifiers, never installation pins):

- `gramlot-0.1.0-py3-none-any.whl`:
  `5c95cefb212f87a34add4bdea22c698703bc71596f38906537677314f0c55a0b`.
- `gramlot-native-html-0.1.0.tgz`:
  `7bf5418e088ca67b242780aaeff798f0ded3e150c0718fe659e31d80a1b53937`.

Temporary evidence: `/private/tmp/gramlot-review-{python,node,versioned-adapters,exporter}.log`,
`/private/tmp/gramlot-review-docs-*.log`, `/private/tmp/gramlot-review-sphinx.log`,
`/private/tmp/gramlot-review-doc-inventory.json`, and
`/private/tmp/gramlot-review-matrix/` (harness, extracted artifacts, results).
Source artifacts remain in `/private/tmp/gramlot-phase6-20260923/artifacts/`.
Retain release evidence durably when producing the actual release.

<a id="gc-130-030"></a>
## 030 · Proposed next step and 0.2.0 boundary

Request owner confirmation of one bounded alignment phase: resolve R1's public
entry-point choice, correct R2/R3 documentation and mirrors, state R4 exclusions,
and specify R5 delivery. Then validate the documented installer/launch commands
against the final artifacts and submit the native 0.1.0 for acceptance. Publishing
and deployment remain separate authorized actions.

For subsequent `develop` work, use real application trials to identify 0.1.x fixes.
Before 0.2.0 implementation, agree the next bounded contracts for Data bindings,
controller/resolver lifecycle and write ownership, then recipes/components and
database capability boundaries as selected by the owner. None of those features
or a final mixin hierarchy is approved merely by this review. GC-110 currently
records an application-driven 0.1.x correction cycle before 0.2.0 features; the
owner's desired transition can be planned without delaying 0.1.0 for future work.


<a id="gc-130-035"></a>
## 035 · Approved alignment outcome — 2026-09-23

The owner approved this bounded phase and requested a Sol subagent. The initial
findings above remain review history; this section is the current disposition.
The coordinator reviewed actual adapter exports and documentation, corrected
installer gaps found during review, and independently verified the final packages.

| Finding | Current disposition |
| --- | --- |
| R1 | Native APIs and Hello World launchers are primary. Python adapter `__all__` lists only native exports; installed explicit/star imports pass. Old modules and CLI commands are explicitly historical and remain outside native compatibility; no aliases or fallback implementation were added. |
| R2 | Adapter README, installation, architecture, release/specification entry notices, site indexes and paired guides identify the native profile. Installer examples supply all local adapters, not unresolved registry names. Full PoC test workflows are not presented as the native gate. |
| R3 | GC-100 and GC-086 now identify the Python dialect loader/local Collection and generic JS ownership. No runtime refactor. |
| R4 | Django/site/Rosetta entry notices and core trial docs exclude them from native compatibility. Their migration and first-party dependency-policy debt remain owning-repository follow-up, not newly accepted exceptions. |
| R5 | [GC-135](135-release-handoff.md) records nine artifacts, independent package versions, archive installation order and the separate publication decision. Private npm flags remain unchanged. A complete local review payload exists; external delivery is not claimed. |

Verification: all five wheels install together in a fresh Python 3.12 environment;
all four npm archives install together in a new consumer with dependencies resolved
from the declared network sources. `pip check` and native/star imports pass.
Installed core Python tests pass 17/17; rebuilt adapter native tests pass 8/8;
all four documented Python launchers return HTTP 200. Chromium again passes all
seven profiles on this final fresh graph. The documented `npx --no-install`
standalone command builds the installed example; its exported file passes live
Source/disposal checks with HTTP(S) blocked and no browser errors. Strict core
and three native Python adapter Sphinx builds pass; core public boundary/link
checks pass. No Safari/Firefox or full historical application suite claim.

The coordinator compared package source bytes with current owning sources.
The only runtime-package edits in this phase narrow three public `__all__` lists;
Page/Host/rendering/transport implementations and dependencies are unchanged.
Core 0.1.0 wheel/npm sources match the retained verified artifacts. Documentation
updates do not require another runtime rewrite or a new class hierarchy.

Local payload: `build/release-candidate/0.1.0/` in the core checkout, including
an artifact manifest. Temporary detailed evidence is under
`/private/tmp/gramlot-alignment-*` (installer/test/Sphinx logs, consumers, matrix
results and nine artifacts). The package manifest identifies the delivered hashes.
The bounded alignment is complete; native 0.1.0 owner acceptance, public-reference
consolidation and publication remain separate. No package was published or deployed.


<a id="gc-130-040"></a>
## 040 · Release closure — 2026-09-24

The owner accepted native 0.1.0 and GitHub archive distribution. The accepted
core and six native companion repositories are consolidated and published;
primary-path documentation and exports are aligned. Native adapter gates now
require imports without skipping, exclude old first-party locks and pass locally
and in GitHub CI. A pristine-source core build gap is fixed without changing
the verified runtime. The nine downloaded release packages and bundle checksums
match. See [GC-135 §040](135-release-handoff.md#gc-135-040) for the public receipt.
Excluded Django/site/Rosetta migrations and 0.2.0 features remain separate work.
