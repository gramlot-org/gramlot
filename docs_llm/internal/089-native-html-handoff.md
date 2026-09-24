# 089 · Historical native HTML handoff

Document ID: **GC-089**. Historical 2026-09-19/20 handoff; do not execute its “Resume here” instructions. Read [GC-070](070-work-status.md) and [GC-110](110-native-html-readiness.md#gc-110-020) for current work. Updated: **2026-09-19**.

**Latest checkpoint 2026-09-20:** collection integration is implemented and
verified. Python/JS GramlotBuilder load builder_grammar 1.1 through generic loaders;
the manual HTML vocabulary is removed. Core17 Python/41 Node/41 Bun, generic JS18
per runtime, DOM126 per runtime, and real-browser collection tests pass. Python
owner416 pass plus two known baseline failures. Read
[GC-092](092-collection-authoring.md) for current API, artifacts and limits.
Old artifacts below predate this revision. No commit/push; owner review next.

**Later owner review:** the original native HTML slice is being revised for
collection ownership: its manual HTML vocabulary and authoring adapters are not
accepted. The owning Python grammar exporter has since been extended locally.
Read [GC-091](091-collection-grammar-audit.md) before resuming; earlier artifacts
listed below do not contain this exporter update.

**Resume here.** The local native HTML implementation and final installed-consumer
browser matrix are complete. Owner review and source consolidation remain open.
The owner explicitly selected **“Mantieni tutto locale per revisione”** on
2026-09-19. Do not commit, push, create remote repositories, publish packages or
deploy as a continuation of this delivery without renewed authorization.

This document is self-contained for another account. Repository code and maintained
documentation are English; converse with the owner in Italian. The previous agents
have finished. Their sessions, temporary environments and account credentials are
not prerequisites for resuming work.

<a id="gc-089-005"></a>

## 005 · Read first and preserve

Read `AGENTS.md`, `docs/00-constitution.md`, `docs/01-overview.md`,
`docs/005-documentation-policy.md` and `ports/README.md` before changes.
The constitution is authoritative; an architectural conflict requires an explicit
owner amendment. No formal Live Object Tree semantics have been approved.

Read GC-087 for layer ownership, GC-088 for the plan, GC-070 for the ongoing TODO,
GC-086 for the repository map and PORT-0004-native-html-delivery for review evidence.
This handoff supersedes their earlier in-progress execution claims where stated.
Do not treat historical baseline counts as final verification.

All work remains local and largely uncommitted. Several repositories already had
unrelated edits before this task. Do not reset, clean, bulk-stage or overwrite them.
The intended eventual policy is develop for new work and main for verified,
accepted consolidation; current branches below are historical working state,
not authorization to commit directly to main.

Never pin/cap owned Genro/Gramlot dependencies, including transitive manifests and
lockfiles. Fix regressions at their owning library. No application DOM construction,
manual event wiring or transport shortcuts may substitute for missing framework
capabilities. Do not introduce production auth, DB, widgets or bindings implicitly.

<a id="gc-089-010"></a>

## 010 · Settled architecture and implemented flow

Dependency direction: **Gramlot → DOM JS → Builder JS → Bag/TYTX**.

- Bag/TYTX own trees, parent references, subscriptions and registered typed codecs.
- `genro-builders-js` owns generic declarations, SourceBag, builder association,
  RecipeExpander and a DOM-neutral RendererBase. A future SQL dialect can reuse it.
- `genro-dom-js` owns HTML declarations, DomRendererBase, HtmlSourceRenderer,
  native HtmlElement, DOM ordering, setters, replacement and recursive cleanup.
- Gramlot specializes the builder/renderer, adds application references/metadata,
  and coordinates page, host, main, remote Source and embedded startup.
- Host adapters own HTTP/engine integration. Standalone owns offline packaging.
  Application repositories contain declarations/configuration, not another runtime.

The host resolves/imports a page, creates a page ID and serves HTML plus packaged
runtime. Gramlot prepares Data and Source roots and subscribes before main.
Python/JS main returns typed Source; detached recipe expansion and candidate DOM
preparation happen before insertion into live Source. That insertion triggers the
same renderer event path used by later insert/delete/update operations.

There is one registered SourceBag wire suffix: **SOURCE**, not XS. No ordinary Bag
coercion conceals missing registration. Python and JS roots/branches round-trip
through JSON and MessagePack. Native attributes/properties use setters when possible;
scalar text updates preserve the element. Structural changes rebuild detached.
Opaque `__ref` references are registry metadata and do not leak into HTML attributes.

Main/remote preparation failure preserves existing Source, DOM and reference identity.
Prepared candidates are consumed once. This is not a universal rollback guarantee
for arbitrary user lifecycle side effects or already-fired raw Bag mutations.

Plain ESM declaration helpers cover element/abstract/container/component; no new
JavaScript decorator transpilation requirement was introduced. Recipe expansion
is generic; Gramlot places it in main/remote preprocessing.

<a id="gc-089-015"></a>

## 015 · Durable repositories and local state

Paths below are on the current machine. HEADs identify the inspected baseline,
not dependency pins. Dirty entry counts are not file counts: untracked directories
can contain many files. Inspect each diff before consolidation.

| Repository path | Branch / baseline HEAD | Delivered work |
| --- | --- | --- |
| `/Users/gporcari/Sviluppo/gramlot/gramlot` | codex/developer-docs / 234c6d8 | Core Python/JS, packaged runtimes, tests, maps/manuals |
| `/Users/gporcari/Sviluppo/gramlot/gramlot-nodejs` | main / 4580437 | Shared Fetch dispatch, actual Node/Bun listeners |
| `/Users/gporcari/Sviluppo/gramlot/gramlot-fastapi` | main / ec7004c | Clean-core native HTML FastAPI adapter |
| `/Users/gporcari/Sviluppo/gramlot/gramlot-flask` | main / b56563a | Clean-core native HTML Flask adapter |
| `/Users/gporcari/Sviluppo/gramlot/gramlot-genro-asgi` | main / 1cfe730 | Neutral ASGI/Uvicorn and actual Kajenn adapters |
| `/Users/gporcari/Sviluppo/gramlot/gramlot-standalone` | main / 37ffeb5 | Explicit native-html-v1 Python/JS compiler profile |
| `/Users/gporcari/Sviluppo/gramlot/gramlot-examples` | develop / 65255ee | One Hello World in Python/JS and six launch profiles |
| `/Users/gporcari/Sviluppo/genro_ng/meta-genro-modules/sub-projects/genro-builders-js` | develop / no initial commit | New independent local generic JS repository; no remote |
| `/Users/gporcari/Sviluppo/genro_ng/meta-genro-modules/sub-projects/genro-dom-js` | main / 2d83956 | Generic extraction, concrete reactive renderer |
| `/Users/gporcari/Sviluppo/genro_ng/meta-genro-modules/sub-projects/genro-tytx` | main / 6b9bf3a | Actual conditional browser/Node dependency loading |
| `/Users/gporcari/Sviluppo/genro_ng/meta-genro-modules/sub-projects/genro-builders` | refactor/37-datastore-root / c6e4684 | Python Source registration and unconstrained direct deps |
| `/Users/gporcari/Sviluppo/gramlot/worktrees/genro-bag-js-native-html` | codex/native-html-dependencies / f324b05 | Current Bag JS metadata only: floating TYTX, no lockfile |
| `/Users/gporcari/Sviluppo/gramlot/worktrees/genro-bag-native-html` | codex/native-html-dependencies / 6673479 | Current Python Bag metadata only: unconstrained owned deps |

The two Bag worktrees deliberately preserve stale/dirty original checkouts.
Their runtime code was unchanged. Transfer these worktrees with their Git common
repositories if moving machines; a worktree `.git` file alone is not a repository.
New Builder JS lives inside a parent repository tree but is now its own Git repo.
TYTX has unrelated pre-existing `.enhancer/` content; DOM and core have earlier
unrelated documentation edits. Preserve them.

<a id="gc-089-020"></a>

## 020 · Code entry points

In core:

- `src/gramlot/page/`: Page base, GramlotBuilder, authoring/remote declarations.
- `src/gramlot/server/host.py`: neutral host and precise framework exceptions.
- `src/gramlot/server/assets.py`: packaged runtime resources; no sibling fallback.
- `src/gramlot/standalone.py`: bounded compiler; JS authoring delegates to installed
  JS package at build time. Missing capabilities fail explicitly.
- `js/src/gramlot.js`: prepared roots, main/remote/embedded pipeline.
- `js/src/renderer/gramlot-renderer.js`: thin DOM renderer specialization.
- `js/src/view/html.js`: DOM HtmlElement with Gramlot metadata configuration.
- `js/src/model/source.js`: application reference registry/validation.
- `js/src/standalone.js`: JS compilePage and embedded mount with transport disabled.
- `js/scripts/build-runtime.mjs`: hosted ESM, offline IIFE and actual package notices;
  bundles copied to Python resources before wheel construction.
- `scripts/install_js_artifacts.py`: normal npm installation of local archives,
  temporary artifact overrides, restored floating manifest, no node_modules patching.
- `setup.py`: wheel guard rejects missing runtime/notices assets.

TYTX now uses conditional `#dependencies` browser/Node modules. The old Gramlot
`js/src/model/browser-modules.js` shim and esbuild module alias were removed.
Browser imports use actual dependency implementations; Node keeps optional loading.
DOM old generic import paths re-export Builder JS rather than duplicating SourceBag.

The examples package has `apps/hello-world`, equivalent Python and JS page files,
Python host launch modules and JS Node/Bun launchers. DB folders remain placeholders.
The separate Git application is a future application, not part of this HTML delivery.

<a id="gc-089-025"></a>

## 025 · Verification actually completed

Final graph includes the owner TYTX fix, floating Bag metadata, generic extraction
and DOM scalar setter fix. Local npm archives were installed normally, with temporary
artifact overrides; no dependency implementation was patched in node_modules.

| Scope | Recorded result |
| --- | --- |
| Core | Python 14/14; Node 36/36; Bun 36/36 |
| Generic Builder JS | Node 12/12; Bun 12/12; no DOM globals |
| DOM JS | Node 124/124; Bun 124/124 |
| TYTX | Node 692/692; browser bundle test 1; Bun registry/MessagePack subset 39 |
| Standalone | 16/16 |
| Existing adapter regression gates | FastAPI 61 passed, 3 skipped; Flask 16 passed, 1 skipped; Genro-ASGI 3 passed, 1 skipped |
| Final installed Python host Chromium matrix | Uvicorn, FastAPI, Flask, Kajenn: one Hello World, no page errors, clean disposal |
| Final installed JavaScript host Chromium matrix | Node/Bun actual listener fixtures and installed Hello World launchers passed |
| Final standalone Chromium matrix | Python/JS: typed mutations, disposal, one file navigation, zero external requests/errors with network blocked |

Core tests include actual Python↔JS JSON/MessagePack typed root and branch transport,
recipe preprocessing, invalid render preparation, references, text setters,
insertion/deletion/order/replacement and cleanup. Six hosted profiles initialized
no DB provider. Kajenn imports its abstract DB handler contract but its database
registry remains empty. Listener cleanup was checked.

These are bounded local results, not universal compatibility or production readiness.
The existing broad standalone capability gate remains strict. native-html-v1 supports
one HTML page and explicitly rejects remote source operations and page CSS assets.
The older PoC showcase is a different artifact/profile.

Strict core Sphinx/public-boundary checks passed after handoff creation: seven
public pages, search, sources, local links and mirrored anchors; diff check passed.
Repeat documentation checks after further edits. Tests need not be repeated
merely to save/review documentation; rerun after relevant code/dependency changes.

<a id="gc-089-030"></a>

## 030 · Reproduction and temporary evidence

Temporary paths can disappear and are not the maintained deliverable. Rebuild from
the durable repositories above when needed. Do not assume current remote releases
already contain these changes: generic JS has no remote and upstream Python Builder
lacks the local registration used here.

Final local artifacts:

- `/private/tmp/gc088-artifacts/gramlot-native-html-portable.tgz`
- `/private/tmp/gc088-artifacts/gramlot-0.0.0.dev1-py3-none-any.whl`
- `/private/tmp/gc088-agent-builder-archives/genro-builders-js-0.1.0.tgz`
- `/private/tmp/gc088-artifacts/genro-dom-js-text-final.tgz`
- `/private/tmp/gc088-agent-tytx-artifacts/genro-tytx-0.15.0.tgz`
- `/private/tmp/gc088-artifacts/genro-bag-js-floating.tgz`
- `/private/tmp/gc088-artifacts/genro_bag-0.25.1-py3-none-any.whl`
- `/private/tmp/gc088-artifacts/genro_builders-0.23.2-py3-none-any.whl`
- `/private/tmp/gc088-artifacts/gramlot-nodejs-0.0.0.tgz`
- `/private/tmp/gc088-artifacts/gramlot-example-app-0.0.0-dev.1.tgz`

Final core wheel SHA-256:
`d8dde20d0ee108ac6e6a590bcf52559c54848dbb2e00e7cf32d52a67978d5d2a`.
Its installed hosted bundle matched source byte-for-byte (573,820 bytes), SHA-256
`600e88bf90c8f94b35efea423a2ef4899b90c64ca164673e7d68670f145e08de`.
Final standalone artifact hashes and build evidence are in standalone GS-020.

Core logs: `/private/tmp/gc088-final-node36.log`,
`/private/tmp/gc088-final-bun36.log`, `/private/tmp/gc088-final-python14.log`.
Final JS consumer: `/private/tmp/gc088-root-final-consumer`.
Python host environment: `/private/tmp/gc088-python-hosts.XDzTXQ/venv`.

Read package scripts and `scripts/install_js_artifacts.py --help` before rebuilding.
Build libraries/artifacts in dependency order, install the graph, build the core
runtime, then build/install core wheels and adapter/example artifacts. The local
installer uses content-addressed archive copies: npm may otherwise reuse stale
same-name/version tarballs. Do not solve this by editing node_modules or pinning
maintained first-party manifests. Install the Python MessagePack optional dependency
for the real binary interoperability test.

Persistent browser checks live in core `scripts/verify_native_html_browser.mjs`,
Node adapter `test/native-browser.mjs`, examples Hello World
`scripts/verify_python_browser.mjs` and `js/tests/browser.mjs`, and standalone
`scripts/verify_native_html_browser.mjs`. Inspect their arguments on the new account.
Playwright/Chromium and Node/Bun executable paths are machine-specific.
Browser/listener checks may need sandbox network/process permission.

Documentation validation from core:

```sh
python3 scripts/prepare_docs.py
.venv/bin/python -m sphinx -W --keep-going -b html build/docs-source build/docs-site
python3 scripts/check_public_docs.py
git diff --check
```

<a id="gc-089-035"></a>

## 035 · Remaining work and next-account checklist

1. Confirm access to every durable working tree. On another machine, transfer the
   uncommitted tracked AND untracked sources, not only Git remotes or patches.
   Generated ignored runtime assets can be rebuilt; do not transfer credentials.
2. Review the local implementation against GC-087/088 and PORT-0004. Distinguish
   owner acceptance from passing tests. Do not restart completed extraction work.
3. Documentation reconciliation completed after handoff: GC-070/088 current
   summaries, GC-087 verification status, PORT-0004 resolved feedback and compact
   GC-025 standalone statement. Historical plan baselines are labelled explicitly.
4. Strict Sphinx, public boundary/link/mirror checks and diff checks passed after
   reconciliation. Rerun after future documentation changes. Preserve paired
   docs/docs_llm paths, IDs and anchors and internal/public separation.
5. With future explicit authorization, prepare bounded commits on development
   branches, preserving unrelated edits. Create/restore the generic JS remote,
   publish dependency sources in order and verify a fresh floating upstream install.
   The old generic repository name previously redirected to DOM; check ownership
   and availability before remote creation. Do not assume the URL already works.
6. Only after verification and owner acceptance consolidate into main. No package
   release or deployment is authorized. Local review is the current stopping point.
7. Separate subsequent work: JS-first coverage and CI/reporting, CSS shorthand step 2,
   components/collections, bindings/controllers/resolvers, DB integrations (BagDB
   first was discussed), Git application. These are not silently part of this slice.

No active agent or background task is required to finish the local delivery.
The user asked to use Sol for delegated implementation, with coordinator review.
Use that model if new parallel subtasks are explicitly requested/authorized.
