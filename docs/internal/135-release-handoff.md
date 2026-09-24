# 135 · Native 0.1.0 artifact handoff

Document ID: **GC-135**. Updated: **2026-09-24**.

[Concise counterpart](../../docs_llm/internal/135-release-handoff.md).

<a id="gc-135-005"></a>
## 005 · Delivery boundary

The delivery is a set of verified wheels and npm archives. It supports
the accepted verification scope without assuming that a registry already contains
the same packages. On 2026-09-24 the owner accepted closure and selected GitHub release archives.
This authorizes source consolidation and release assets, not PyPI/npm publication
or application deployment. A source tag alone
does not install the unpublished npm dependency graph.

Core native HTML 0.1.0 includes typed live Source, Python/JS Page authoring,
main/marked remote Source, FIFO, freeze/unfreeze and cleanup. Profiles: Uvicorn,
FastAPI, Kajenn, Flask, Node, Bun and Worker. Django, site, Rosetta and the richer
PoC runtime are excluded. Database integration, bindings, recipes, richer
components and Orchestra-managed registry migration remain later work.

<a id="gc-135-010"></a>
## 010 · Package set

These are manifest versions at this checkpoint, not an instruction to pin
first-party dependencies or assign one version to every repository.

| Owner | Distribution | Version | Role |
| --- | --- | --- | --- |
| gramlot | `gramlot` | `0.1.0` | Python authoring, Host, packaged browser assets |
| gramlot | `@gramlot/native-html` | `0.1.0` | JS authoring, Host, live runtime, Worker |
| gramlot-fastapi | `gramlot-fastapi` | `0.1.0a1` | Native FastAPI profile |
| gramlot-flask | `gramlot-flask` | `0.0.0.dev0` | Native Flask profile |
| gramlot-genro-asgi | `gramlot-genro-asgi` | `0.0.0.dev0` | Generic ASGI and Kajenn profiles |
| gramlot-nodejs | `gramlot-nodejs` | `0.0.0` | Native Node/Bun profiles |
| gramlot-standalone | `@gramlot/standalone` | `0.0.0-dev.1` | JS Worker single-HTML exporter |
| gramlot-examples | `gramlot-example-app` (Python) | `0.0.0.dev1` | Python Hello World and host launchers |
| gramlot-examples | `gramlot-example-app` (npm) | `0.0.0-dev.1` | JS Hello World and host launchers |

Core npm, NodeJS and the JS example declare `private: true`, which permits local
packing/installing but prevents npm publication. Keep those flags until a registry
release is explicitly chosen. Adapter/example versions must be recorded alongside
the core version in release notes; their current versions do not assert a stable
cross-repository API or completed legacy migration.

<a id="gc-135-015"></a>
## 015 · Prepare and install the archive set

Refresh floating first-party dependencies from their declared maintained sources
during setup/update. Keep resolver output and dependency revisions as evidence,
not as new lockfiles or installation pins. Build browser bundles before the core
wheel, because the wheel carries those generated assets. The documented core
commands are in [GC-085](085-operating-guide.md#gc-085-020).

Build order:

1. Prepare the core JS dependencies, run the browser build, pack the core npm
   archive and build the core Python wheel.
2. Build FastAPI, Flask and Genro ASGI wheels and the Python Hello World wheel.
3. Pack NodeJS, standalone and JS Hello World from their owning repositories.
4. Install all selected Python wheels together into a new environment; install
   the four JS archives together into a separate npm consumer. Explicit archive
   inputs prevent resolution of an unrelated historical Gramlot package.

For an artifact directory containing exactly these review packages:

```sh
GRAMLOT_ARTIFACTS=/absolute/path/to/review-artifacts
python3.12 -m venv /absolute/path/to/python-consumer
/absolute/path/to/python-consumer/bin/python -m pip install --upgrade \
  --upgrade-strategy eager "$GRAMLOT_ARTIFACTS"/*.whl
/absolute/path/to/python-consumer/bin/python -m pip check

mkdir -p /absolute/path/to/js-consumer
cd /absolute/path/to/js-consumer
npm init -y
npm install --package-lock=false "$GRAMLOT_ARTIFACTS"/*.tgz
```

Install selected host runtime requirements if they are not dependencies of the
chosen wheels; the Python example's `python-hosts` extra records its host set.
Do not install the old PoC wheel into the same environment. A new npm consumer
needs all four local archives while their first-party npm names are unpublished;
installing only the example or exporter is not a complete reproduction command.

<a id="gc-135-020"></a>
## 020 · Verify the user path and retain evidence

Use the installed Hello World Python modules
`gramlot_example_app.server.uvicorn`, `.fastapi`, `.kajenn` and `.flask`.
Use installed npm commands `gramlot-hello-node`, `gramlot-hello-bun` and
`gramlot-standalone build` with the browser-safe JS Page. The owning example and
adapter guides define command arguments and URLs. Application pages import
`gramlot.Page` or `@gramlot/native-html/page`.

The native adapter APIs are `NativeHtmlApplication` / `mount_native_html` on
FastAPI, `mount_native_html` on Flask, `NativeHtmlASGI` and
`KajennNativeHtmlApplication` on Genro ASGI, and `startNativeServer` from the
Node/Bun native exports. Legacy `GramlotApplication`, `mount_gramlot` and PoC
CLI/demo entry points are not clean-core aliases.

Keep package contents/exports, LICENSE/NOTICE, artifact hashes, dependency
provenance, installer logs and the checked commands with the release evidence.
Run the native protocol checks and seven-profile Chromium matrix against the
actual delivered graph after implementation changes. Keep local checkout,
isolated package, clean installation and browser verification claims distinct.
[GC-130](130-release-ecosystem-review.md#gc-130-025) identifies existing evidence
and its limits. Successful builds do not verify remote availability.

<a id="gc-135-025"></a>
## 025 · Acceptance and next development

Owner acceptance of the bounded foundation, consolidation into the public
reference and external publication are separate steps. Before publishing,
confirm package versions and delivery channel, distribute required owning-source
notice corrections, and execute the chosen channel's package checks. A registry
route additionally needs reviewed publishing metadata and dependency availability;
an archive route needs the complete artifact set and matching install instructions.

Once 0.1.0 is accepted, new work follows `develop`. Keep application-discovered
0.1.x corrections separate from 0.2.0 feature contracts. This handoff does not
approve a new component hierarchy, database API or compatibility layer.


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
