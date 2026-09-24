# 135 · Native 0.1.0 artifact handoff

Document ID: **GC-135**. Updated: **2026-09-24**.

[Expanded counterpart](../../docs/internal/135-release-handoff.md).

<a id="gc-135-005"></a>
## 005 · Delivery boundary

On 2026-09-24 the owner accepted closure and GitHub archive delivery, including
source consolidation and release assets. PyPI/npm publication and deployment
remain excluded. A source tag alone does not supply unpublished npm dependencies.
Native scope: typed Source, Python/JS Page, main/remote, FIFO/freeze/cleanup;
Uvicorn/FastAPI/Kajenn/Flask/Node/Bun/Worker. Django/site/Rosetta/PoC, databases,
bindings/recipes/richer components and Orchestra migration are excluded.

<a id="gc-135-010"></a>
## 010 · Package set

Manifest versions: Python `gramlot` and npm `@gramlot/native-html` 0.1.0;
FastAPI 0.1.0a1; Flask and Genro ASGI 0.0.0.dev0; NodeJS 0.0.0;
standalone npm 0.0.0-dev.1; example Python 0.0.0.dev1 / npm 0.0.0-dev.1.
These identify artifacts, not first-party dependency pins or required lockstep
versions. Core npm/NodeJS/example are private: local packs work, npm publication
does not. Change flags only for an approved registry release. Record the full
version set in release notes; no stable legacy compatibility is inferred.

<a id="gc-135-015"></a>
## 015 · Prepare and install the archive set

Refresh floating first-party dependencies. Build core browser assets before its
wheel; pack core JS, then Python adapter/example wheels and NodeJS/standalone/JS
example archives. Install all selected wheels together into a new Python 3.12
environment and all four JS archives together into a new npm consumer with
`--package-lock=false`. Expanded guide gives commands; GC-085 covers core build.
Use `pip check`, install needed host runtimes from the example's `python-hosts`
requirements, and do not mix the PoC wheel. Installing the exporter/example alone
cannot resolve unpublished first-party npm names. Retain resolution evidence,
never new first-party pins or lockfiles.

<a id="gc-135-020"></a>
## 020 · Verify the user path and retain evidence

Installed Python launchers: `gramlot_example_app.server.{uvicorn,fastapi,kajenn,flask}`.
JS commands: gramlot-hello-node, gramlot-hello-bun, gramlot-standalone build.
Page imports: gramlot.Page and @gramlot/native-html/page. Native APIs:
FastAPI NativeHtmlApplication/mount_native_html; Flask mount_native_html;
ASGI NativeHtmlASGI/KajennNativeHtmlApplication; Node/Bun native startNativeServer.
Legacy GramlotApplication/mount_gramlot/PoC CLIs are not clean-core aliases.
Retain contents/exports/notices/hashes/provenance/installer logs/commands; check
the final graph and seven Chromium profiles after implementation changes.
GC-130 distinguishes checkout, isolated package, fresh install and browser evidence;
local success does not prove remote availability.

<a id="gc-135-025"></a>
## 025 · Acceptance and next development

Acceptance, public-reference consolidation and publication remain separate.
Before publishing choose package versions/channel, distribute owning notice fixes
and verify the delivery channel. Registry release needs reviewed metadata and
dependency availability; archive delivery needs complete artifacts/instructions.
After acceptance, new work follows develop; keep 0.1.x corrections separate from
bounded 0.2.0 contracts. No new class hierarchy, database API or fallback approved.


<a id="gc-135-030"></a>
## 030 · Prepared review payload and verification

The approved alignment produced nine artifacts in
`build/release-candidate/0.1.0/artifacts/`, with `artifact-manifest.json` identifying
filenames, sizes and SHA-256. The complete local review bundle is
`build/release-candidate/gramlot-native-0.1.0-review.zip`; it contains the artifact
set and installation README. These generated files are local delivery material,
not published packages or a source release.

Fresh Python 3.12 and npm consumers installed all five wheels/four archives with
network-resolved floating dependencies. Dependency checks and public imports pass;
installed core Python tests pass 17/17, native adapter tests 8/8, all four Python
launcher HTTP checks and all seven Chromium profiles pass. The documented installed
standalone export opens from file, updates typed Source and disposes its Worker
with HTTP(S) blocked. Strict core/three-adapter Sphinx checks pass. GC-130 §035
records detailed evidence and limits.

A final Hello World README link correction to the public `main` reference was
repacked and reinstalled in both consumers. Its Python/JS runtime source remained
byte-identical to the browser-tested package; no extra runtime claim is based on
the documentation-only repack. Other archive source contents were also compared
with current owning sources. Owner acceptance and external delivery remain pending.


<a id="gc-135-035"></a>
## 035 · Owner release authorization — 2026-09-24

The owner approved proceeding with native 0.1.0 closure and GitHub archives.
Earlier pending-acceptance statements above describe the review checkpoint.
The release is published from the consolidated main reference; companion source
revisions and all nine artifact hashes accompany the delivery. No dependency pins,
registry publication, deployment or new 0.2.0 implementation are authorized.
Native adapter check runners/CI are aligned to the already agreed release gate;
legacy PoC tests are retained separately. Record the public receipt after upload.


<a id="gc-135-040"></a>
## 040 · Published release receipt

[Gramlot 0.1.0](https://github.com/gramlot-org/gramlot/releases/tag/v0.1.0) was published on 2026-09-24 at 04:29:41 UTC.
Tag `v0.1.0` identifies core revision `c23929a6e6ea2869e1f3395d1c1db50cecd87bcf`.
GitHub delivers the complete bundle, all nine package archives, artifact manifest,
source provenance and bundle SHA-256. All assets were downloaded again: package
sizes/hashes, bundle hash, embedded checksums and provenance match the local delivery.
Bundle SHA-256: `46ec462d36c219d6a86f3afdaa4fd4e2ef68c7828b15bb2f22a3ac82769b871c`.

Remote checks passed: [core documentation](https://github.com/gramlot-org/gramlot/actions/runs/35955653211),
[FastAPI native](https://github.com/gramlot-org/gramlot-fastapi/actions/runs/35955657945),
[Flask native](https://github.com/gramlot-org/gramlot-flask/actions/runs/35955663036),
and [ASGI/Kajenn native](https://github.com/gramlot-org/gramlot-genro-asgi/actions/runs/35955749898).
Each native adapter matrix covers Python 3.11 and 3.12, builds current core with
floating dependencies, and validates its distributions and installed exports.

The seven participating source repositories are consolidated on main and develop.
No PyPI/npm publication or application deployment occurred. Django/site/Rosetta
remain excluded; their local explanatory notices were not pushed as part of this
release. Site/Rosetta main pushes can trigger deployment and are outside this scope.
New work belongs on develop; 0.2.0 feature scope is not yet approved.
