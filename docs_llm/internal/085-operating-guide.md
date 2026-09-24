# 085 · Repository operating guide

Document ID: **GC-085**. Updated: **2026-09-24**.
Status: **current development guide; clean core setup verified**.

[Expanded counterpart](../../docs/internal/085-operating-guide.md).

<a id="gc-085-005"></a>
## 005 · Start here

Read the [constitution](../00-constitution.md), then [GC-070](070-work-status.md)
for current decisions, implementation and verification. [GC-110](110-native-html-readiness.md#gc-110-020)
is the completed GitHub 0.1.0 release plan, not the current development plan.
The GitHub archives and JSR publication have separate evidence; neither is changed
by local development. GC-080's recipe pipeline and GC-045/050's legacy inventories
are historical references, not implementation authorization.

The current core source passes a fresh installation and tests with dependencies
from PyPI and JSR ([GC-070 §325](070-work-status.md#gc-070-325)). This is source-checkout
verification, not a new wheel/archive consumer, browser or seven-host matrix run.
The older seven-profile release checks remain dated evidence in GC-110.
Binding 0.2.0 is authorized but incomplete and paused for source/contract review;
consult [GC-165](165-binding-execution.md) and [GC-170](170-binding-source-audit.md).

<a id="gc-085-010"></a>
## 010 · Current repository map

`src/gramlot` contains Python page/server code, collections and the reserved db
area. `js/src` contains builder, renderer, view, references, HTTP transport,
Host/Page/FileHost adapters and Gramlot lifecycle. `examples/00-runner` owns the
provisional runner; `tests`/`js/tests` hold core tests, `ports` holds port records,
and `scripts` holds verification/build helpers.

Generated build outputs, virtual environments, installed modules and caches are
not source architecture. In `gramlot-minimal`, `src/worker-host.js`,
`src/worker-transport.js` and `src/standalone.js` own standalone integration.
No future component/controller/database contract is implied by a folder name.

<a id="gc-085-015"></a>
## 015 · Ownership boundaries

Bag and TYTX own Bag behavior and typed serialization. Builder owns generic
BuilderBase, SourceBag/SourceBagNode, grammar and static HTML/SVG rendering.
Gramlot's Python dialect owns collection loading, SOURCE registration, mixed text
and atomic insertion under constitution 11.16. JS consumes Builder's sourceTarget.
Core owns GramlotRenderer, HtmlElement, Source subscriptions, rendering lifecycle
and shared Host/Page execution. These shared classes are not copied into adapters.

Minimal owns WorkerHost, WorkerTransport and standalone mount, including CSS,
export asset paths and startup ordering (11.46). It consumes the existing neutral
Host through the browser-safe core `/host` export. The matching development core
and Minimal packages are required; frozen artifacts do not acquire these changes.
The provisional runner owns tabs, splitter, Markdown/highlighting and frame themes
using ordinary HTML IDs and existing Source/Bag APIs (11.44). General applications
do not inherit that bounded exception. Future web components are not implemented
or approved by this transfer. Builder/Bag source and installed copies remain
read-only unless the owner explicitly authorizes a bounded dependency change.

<a id="gc-085-020"></a>
## 020 · Local setup and package-boundary testing

Run from a fresh core checkout with Python 3.11+ and Node.js 22+. The clean check
used Python 3.12.9 and Node.js 23.11.0. Network access is needed. These commands
install the declared dependencies without local wheel paths or first-party pins:

```sh
npm --prefix js install --ignore-scripts --package-lock=false
npm --prefix js run build
python3 -m venv .venv
.venv/bin/python -m pip --isolated install --no-cache-dir --index-url https://pypi.org/simple -e '.[test]'
```

The clean check used an empty npm cache as well. Python resolved Builder 0.23.2,
Bag 0.25.1 and TYTX 0.15.0. JS resolved `@jsr/genro__builders` 0.1.5,
`@jsr/genro__bag` 0.5.3 and `@jsr/genro__tytx` 0.15.1. These are observed versions,
not install pins or claims about future resolution. `js/.npmrc` selects the JSR
npm endpoint and disables package-lock. Local dependency wheels used in the older
working venv are not prerequisites for the tested current core paths.

**Local environment observed on 2026-09-24:** this working checkout's `.venv`
still contains `genro-builders` 0.23.4 installed from
`/private/tmp/builder-template-artifacts/genro_builders-0.23.4-py3-none-any.whl`.
It is not the clean PyPI environment described above and is not a setup requirement.
The latest separate clean check resolved Builder 0.23.2, Bag 0.25.1 and TYTX 0.15.0
and passed Python 18/18 and JS 76/76. The owner-supplied independent review also
reports runner 8/8 with those Python dependencies. Earlier provenance was already
recorded in [GC-070 §320](070-work-status.md#gc-070-320); this note makes the
working-environment distinction explicit in the operating guide as well.

A pre-existing venv or node_modules directory does not establish clean installation.
Use a separate checkout copy/environment when verifying reproducibility. Setup of
the runner and adapter dependencies is separate: follow the
[runner guide](../../examples/00-runner/README.md), including its `--install-links`
installation so examples and adapters share one core identity.

For package-boundary work, build resources before packaging:

```sh
npm --prefix js run build
mkdir -p /tmp/gramlot-artifacts
(cd js && npm pack --pack-destination /tmp/gramlot-artifacts)
uv build --wheel --out-dir /tmp/gramlot-artifacts
```

This separate procedure requires `uv`; it was not part of the fresh editable-install
check above. Core prepack builds the browser bundle and runtime notices and includes
LICENSE/NOTICE. The Python wheel packages generated browser resources and collections.
Standalone bundles are generated by Minimal, not core. Test resulting packages in
new consumer environments before claiming package verification. The historical
`install_js_artifacts.py` helper is not part of current setup. Packaging does not
publish a release or establish owner acceptance.

<a id="gc-085-025"></a>
## 025 · Checks and interpretation

Run the verified core checks from the repository root:

```sh
.venv/bin/python -m unittest discover -s tests -p 'test_*.py'
GRAMLOT_TEST_PYTHON="$PWD/.venv/bin/python" npm --prefix js test
npm --prefix js run build
```

The absolute interpreter path selects the same Python environment for JS interop
tests, including tests with a different working directory. A default `python3`
without Gramlot installed is not equivalent to this setup. Do not use arbitrary
pytest discovery over temporary working files as a clean-checkout result.
The fresh check passed Python 18/18, JS 76/76 and build. Counts are dated evidence,
not permanent gates. Bun can be checked separately with
`GRAMLOT_TEST_PYTHON="$PWD/.venv/bin/python" bun test js/tests/*.test.js`; Bun was
not rerun in the isolated check. Browser, runner and adapter verification remain
separate; see [GC-070 §270](070-work-status.md#gc-070-270) for their last recorded scope.

Distinguish implementation, verification and acceptance. Local test success does
not prove published-artifact provenance, broader browser support or upstream-source
identity. Each decision requires explicit owner confirmation. Publication, release,
deployment and consolidation remain separately authorized actions.

<a id="gc-085-030"></a>
## 030 · Later operations and collection assets

Add operational contracts only after their implementation and verification. Coverage,
further adapter checks and future component work are not implied by this guide.
Core exports browser classes plus `/runtime`, `/page`, `/host` and `/server`;
`/server` includes FileHost and is not a browser-safe Worker import. Minimal owns
its `/worker-host` and `/standalone` entries. Public JSR versus local development
names are explained in [GC-090 §022](../public/090-classes-and-hosts.md#gc-090-022).

Tests and runtime builds do not regenerate collections. `export_collections.py`
copies canonical exported JSON; its default still refers to the older
`genro-builders-js` installation path, not the current JSR package path. It is not
required by the verified setup. Do not claim that default was checked or use it as
a reason to regenerate owning-library sources. Any regeneration needs its own
confirmed scope; there is no independently maintained tag list.


Before preparing a JSR release, run from the repository root:

```sh
deno run --config jsr.json --allow-read scripts/verify_jsr_examples.mjs
```

This checks all thirteen example imports, shared Page identity, typed Source and
Host cleanup through the publishing import map. After publication, verify the
actual downloaded registry payload without that local map. The current develop
checkout preserves unfinished 0.2.0 binding work; its aligned 0.1.2 metadata is a
maintenance baseline, not permission to publish this mixed development state.
Use the identified release source and explicit owner approval for publication.
