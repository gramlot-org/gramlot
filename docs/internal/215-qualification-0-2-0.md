# 215 · Gramlot 0.2.0 qualification (S16)

Document ID: **GC-215**. Recorded: **2026-09-30**.

> **Historical record (2026-09-29 – 2026-10-02):** describes the 0.2.0 qualification (S16) before the release; 0.2.0 was published on 2026-09-30; not the current state. Current: [GC-070](070-work-status.md).

> **Naming (2026-10-02):** in the dated text of this document, "native" as the label of a release, profile, milestone, adapter, module, API or pages names the scope of the 0.1.0 milestone (no web components, no recipes). That label has no technical meaning; current documents do not use it ([GC-005 §030](../005-documentation-policy.md#gc-005-030)). "native" for browser controls, DOM events, HTML attributes, DOM operations, Bag events or platform APIs keeps its technical meaning. Dated text is not rewritten.

**Current outcome:** the qualification of S16 is complete (2026-09-30). Every mandatory row
passed or carries an owner waiver: R20 passed after the fix in gramlot-serverless
(`b79a80d`, 19/19); R22, R24 and L1 are waived by the owner (§035); the Firefox rows (§025)
passed, run by the owner from the Terminal app. Nothing is published (source plan §7 S16).

[Concise counterpart](../../docs_llm/internal/215-qualification-0-2-0.md).
[Contract](210-binding-contract.md) · [Current status](070-work-status.md#gc-070-615) ·
report form of [GC-130 §025](130-release-ecosystem-review.md#gc-130-025).

<a id="gc-215-005"></a>
## 005 · Revision, environment and versions

Block ID: **GC-215-005**.

| Item | Value |
| --- | --- |
| Source plan | `v_0.2.0/piano-unico-0.2.0.md` revision 11, SHA-256 prefix `5ca51670`; §7 S16 and §8 |
| Core revision | branch `wf/gramlot-0-2-0-binding` at `f0e2a6b` plus the Phase 19 changes committed with this report (three tests, the lifecycle fixture exports, this report and GC-070 §615) |
| Package versions | Python `gramlot` 0.1.2, npm `@gramlot/native-html` 0.1.2: the version stays 0.1.2 until the owner authorizes 0.2.0 (S17) |
| Machine | macOS (Darwin 27.0.0, arm64) |
| Runtimes | Python 3.12.9, Node 23.11.0, npm 10.9.2, Bun 1.3.14 |
| Browsers | Playwright `playwright-core` 1.63.0 (from `gramlot-rosetta/node_modules`): Chromium 153.0.8010.12 (`chromium-1243`), WebKit 26.6 (`webkit-2359`), Firefox 155.0 (`firefox-1543`, owner run) |
| Python dependencies resolved in the clean venv | genro-bag 0.27.0, genro-builders 0.27.0, genro-tytx 0.16.0, genro-toolbox 0.14.0, msgpack 1.2.3; `pip check`: no broken requirements |
| JS dependencies resolved in the clean npm folders | `@jsr/genro__bag` 0.10.0, `@jsr/genro__builders` 0.4.0, `@jsr/genro__tytx` 0.16.0; dev: esbuild 0.28.2, jsdom 27.0.1 |
| Latest published (checked 2026-09-30) | PyPI genro-bag 0.27.0, genro-builders 0.27.0, genro-tytx 0.16.0; JSR `latest` genro__bag 0.10.0, genro__builders 0.4.0, genro__tytx 0.16.0: the clean environments resolved the latest versions |
| Adapter revisions (run, not edited) | gramlot-uvicorn `abdf54b` (local branch `s06-filehost`), gramlot-js-server `1214ac0` (`develop`), gramlot-serverless `5d5a65e` (`develop`); all three trees clean before and after the runs |

<a id="gc-215-010"></a>
## 010 · Artifacts, runtime bundle and C07

Block ID: **GC-215-010**.

Artifacts built from this branch into `/private/tmp/gramlot-s16/artifacts/` (SHA-256,
identifiers, never installation pins):

- `gramlot-0.1.2-py3-none-any.whl`: `e915ce6a87d417197e34a87f706fac00666d1b669efc10268f49dd71c056217b`;
- `gramlot-0.1.2.tar.gz`: `f0ae4ab106b78a32bf491662cd2135c73763dda9e34f7f2394de12f5c53b5e83`;
- `gramlot-native-html-0.1.2.tgz`: `6a938906c0a40a08e08d8099da70d0270ec454a90ead01f1ba54e4bcc87d4b41`.

Commands: `npm --prefix js run build`; `buildenv/bin/python -m build --sdist --wheel --outdir
/private/tmp/gramlot-s16/artifacts /Users/gporcari/Sviluppo/gramlot/gramlot` (a separate venv
with the PyPI `build` package: in the core `.venv`, `python -m build` imports the repository
`build/` folder instead); `npm pack --pack-destination /private/tmp/gramlot-s16/artifacts` in `js/`.

Served runtime bundle: `js/dist/gramlot.js`, `src/gramlot/resources/gramlot.js`, the copy in the
wheel and the copy in the npm package have SHA-256
`a35d468f42f715b5fb7904b976f87b140149643a4896d90988195ed0908fc807`, the esbuild build of `js/src`
at this revision.

C07 check: `js/tests/runtime-bundle.test.js` builds `js/src/index.js` with the options of
`js/scripts/build-runtime.mjs` and fails when either served bundle is missing or differs, naming
the stale file. It is enrolled in `npm --prefix js test`. At the start of the phase it failed on
the bundles present in the checkout (SHA-256 `f09e64e9…`, built at 16:58 before commit `3aec35a`
removed two `wf:phase-18:new` comments): the check detected a real stale copy. After
`npm --prefix js run build` it passes.

<a id="gc-215-015"></a>
## 015 · Mandatory rows

Block ID: **GC-215-015**.

Evidence logs are in `/private/tmp/gramlot-s16/logs/` under the name given in the row.

| Row | Command | Outcome |
| --- | --- | --- |
| R01 Python suite, checkout | `.venv/bin/python -m unittest discover -s tests` | 72 tests OK (`checkout-python.log`) |
| R02 JS suite, checkout, enrolled contracts included | `GRAMLOT_TEST_PYTHON=$PWD/.venv/bin/python npm --prefix js test` | 451/451 (`checkout-js.log`), including `binding-contracts/gramlot-quiet-write.test.mjs` and `upstream-regressions/builder-symbolic-attribute.test.mjs` |
| R03 Examples suite, checkout | `npm --prefix examples test` | 31/31 (`checkout-examples.log`) |
| R04 Clean environments: install | `zsh /private/tmp/gramlot-s16/qualify-clean.sh` (new venv, wheel with `[test]` from PyPI; new npm consumer with the tgz and `@jsr:registry=https://npm.jsr.io`; no lock file) | installed; `pip check` clean; the consumer imports `@gramlot/native-html`, `/server`, `/page`, `/host`, `/runtime` (`clean-pip-*.txt`, `clean-npm-consumer*.txt`, `clean-npm-imports.log`) |
| R05 Python suite on the installed wheel | same script: the repository `tests/` beside the sdist tree, run by the clean venv | 72 tests OK (`clean-python.log`) |
| R06 JS suite on the packaged sources | same script: `js/` is the npm package with `js/tests` copied in, dependencies installed fresh | 451/451 (`clean-js.log`); the C07 check passes on the packaged `dist/gramlot.js` and the sdist bundle |
| R07 Examples suite in the clean tree | same script | 31/31 (`clean-examples.log`) |
| R08 Counters, two fixtures | `js/tests/qualification-counters.test.js` (in R02 and R06) | pass: one write on `active.x` with 1 and with 200 unconnected branches gives the same work: 4 router candidates, 4 deliveries, 2 text mutations, the same Data trace; the standing counters differ (bindings 11 / 1006, registrations 8 / 804, records 9 / 805, elements 8 / 804) |
| R09 §8.1 story, real Page/Host/TYTX/PageBootstrap path | `js/tests/qualification-story.test.js` (in R02 and R06) | pass on the Python page (Python `FileHost` in a child process) and on the JS page (JS `FileHost`); the two give identical records; eight checks, exact trace and counters in §020 |
| R10 C07 bundle check | `js/tests/runtime-bundle.test.js` (in R02 and R06) | pass after the rebuild; failed on the stale bundle found at start (§010) |
| R11 Binding in real browsers | `node scripts/verify_binding_browser.mjs $PW chromium` and `… webkit` | Chromium 153.0.8010.12 PASS, WebKit 26.6 PASS (`binding-*.log`): editing, temporal types (WebKit gives `text` for `month` and `week`), booleans, button R3, R12, strict CSP with the Q3 error |
| R12 Worker host in real browsers | `node scripts/verify_worker_host_browser.mjs $PW chromium` and `… webkit` | Chromium PASS, WebKit PASS (`worker-*.log`) |
| R13 Examples runner in a real browser, Node host | `PORT=8765 .venv/bin/python examples/00-runner/serve.py`; `node scripts/verify_examples_browser.mjs http://127.0.0.1:8765 $PW $CHROMIUM` | Chromium PASS: 64 pages, `/py` and `/js`, language parity (`examples-chromium-node.log`) |
| R14 Examples runner, Bun host | same with `JS_RUNTIME=bun PORT=8766` | Chromium PASS: 64 pages (`examples-chromium-bun.log`) |
| R15 gramlot-uvicorn tests | new venv `/private/tmp/gramlot-s16/hosts/uvicorn-venv`: `pip install <core wheel> "…/gramlot-uvicorn[test,uvicorn]"`; `PYTHONDONTWRITEBYTECODE=1 python -m pytest -p no:cacheprovider -q` in the checkout | 5 passed (`uvicorn-pytest.log`) |
| R16 gramlot-uvicorn acceptance pages | `hosts/serve_py.py` (adapter behind a front that strips `/py`, prefix `/py`), `node acceptance.mjs $PW <engine> http://127.0.0.1:8781/py,strict` and `…8782/py,permissive` | Chromium and WebKit PASS: strict CSP (`script-src 'nonce-{nonce}'; object-src 'none'; base-uri 'none'`): `avvio` with its companion (`ok: init`, sentinel 1), `03_lists` `Page.css` loaded, inline refused with the Q3 error; permissive (plus `'unsafe-eval'`): the §8.1 story 1-8, inline runs (`acceptance-*-8781.log`, `-8782.log`) |
| R17 gramlot-js-server tests, Node and Bun | `npm test`; `bun test test/native.test.mjs` | Node 7/7, Bun 5/5 (`js-server-node.log`, `js-server-bun.log`) |
| R18 gramlot-js-server browser harness | `node test/native-browser.mjs node|bun $PW $CHROMIUM` | Chromium PASS on Node and Bun (`js-server-browser-*.log`) |
| R19 gramlot-js-server acceptance pages, Node and Bun | `hosts/serve_js.mjs` run by `node` (ports 8783/8784) and by `bun` (8785/8786), prefix `/js`; `acceptance.mjs` as R16 | Chromium and WebKit PASS on both runtimes, same pages and checks as R16 (`acceptance-*-878[3-6].log`) |
| R20 gramlot-serverless tests | `npm test` | PASS 19/19 after `b79a80d` (the two assertions aligned to "Unknown Source method"; re-run by the coordinating chat on 2026-09-30); first run 17/19 (§030 D1) |
| R21 gramlot-serverless standalone, strict CSP | `node scripts/verify_worker_sentinel_browser.mjs $PW chromium` and `… webkit` (in the serverless checkout) | Chromium PASS, WebKit PASS: `avvio` under the hash CSP, window sentinel 1, Worker sentinel 0, altered script blocked (`serverless-sentinel-*.log`) |
| R22 §8.1 story on the standalone export | `node ../gramlot-serverless/src/cli.js build examples/controllers/09_end_to_end.js -o …/standalone/c09.html`; `node acceptance.mjs $PW <engine> …/standalone/c09.html` | **blocked** (§030 D2) |
| R23 Core runner standalone build | in the clean tree only: `npm install --no-save "@gramlot/native-html@file:…/gramlot/js" "@jsr/genro__gramlot@file:…/gramlot/js"`, `node 00-runner/build-standalone.mjs /private/tmp/gramlot-s16/runner-standalone`, `node scripts/verify_standalone_runner.mjs file:///private/tmp/gramlot-s16/runner-standalone/ $PW $CHROMIUM` | Chromium PASS: 12 Worker pages offline, no HTTP requests (`standalone-runner*.log`); needs both package names on one checkout (§030 D3) |
| R24 Four deferred adapters | — | gramlot-django, gramlot-fastapi, gramlot-flask, gramlot-kajenn: not run, deferred by the owner on 2026-09-29 (GC-070 §595); waiver requested (§035) |
| R25 Firefox | §025 | PASS: F1-F9 on Firefox 155.0, run by the owner from the Terminal app (2026-09-30) |

`$PW` is `/Users/gporcari/Sviluppo/gramlot/gramlot-rosetta/node_modules/playwright-core/index.mjs`;
`$CHROMIUM` is the `chromium-1243` executable in `~/Library/Caches/ms-playwright/`. The
acceptance driver `acceptance.mjs` and the host launchers under `/private/tmp/gramlot-s16/hosts/`
are scratch files of this qualification: every action is real typing or a click, `page.evaluate`
only reads; the pages are copies of `examples/controllers/09_end_to_end`, `examples/html_svg/03_lists`,
`js/tests/fixtures/logic/avvio` (the JS copy imports `@gramlot/native-html/page`) and a one-line
inline page.

<a id="gc-215-020"></a>
## 020 · The §8.1 story: checks, trace and counters

Block ID: **GC-215-020**.

`js/tests/qualification-story.test.js` opens `examples/controllers/09_end_to_end` on the
`FileHost` of each language with the folder as mount prefix, loads the bootstrap HTML the host
wrote into jsdom, and runs `PageBootstrap`: it writes the two CSS links (`Page.css`, then the
same-name `.css`), imports the companion `_aux.js`, starts Gramlot; `main` and `remoteSource`
travel as TYTX through `MainTransport`, answered by the host; the page closes on a real
`pagehide`. Nothing is registered or wired by hand.

| Step | Checks | Data trace | DOM |
| --- | --- | --- | --- |
| 1 first render | caption `The story of a page` (the later duplicate setter), quantity 2 (default), total 2, `r` 28, green fill, `small` checked | `ins` of `story`, `settings`, `settings.caption`, `upd_value settings.caption` (duplicate), `ins` of `size`, `gift`, `live`, `quantity`, `total`, `radius`, `color` | one insertion of the page into the root; no element corrected after the mount |
| 2 editing | `input` with `live` false writes nothing, `change` writes; after the `live` checkbox, `input` writes | `settings.caption`, `live`, `settings.caption` | two caption text changes |
| 3 formula and controller | quantity 6 → total 6, `r` 44; gift → total 11, `r` 64, red fill | `quantity`, `total`, `radius`, `gift`, `total`, `radius`, `color` | text of `total`, `r`, text, `r`, `fill` |
| 4 radio | `large` → Data `small` false and `large` true, DOM checked flags alike, total 23 | `size.large`, `total`, `radius`, `size.small` | text of `total`, `r` |
| 5 button | Shift click → `Pressed 1 times`, `with Shift`; second click → `Pressed 2 times`, `without modifiers` | `ins presses`, `ins modifiers`, then two updates: one controller call per click | four text changes |
| 6 remoteSource | the branch's own setters are visible at its first render | `ins extras`, `extras.title`, `extras.items` | the `extras` section rebuilt; no text corrected |
| 7 freeze and thaw | under freeze a Data change reaches the built title inside the frozen branch (freeze suspends structural rebuild only, GC-210 §010 V1); the removed note keeps its element; one thaw removes it | `extras.title`, `quantity`, `total`, `radius`, `color` | title and total texts, `r`, `fill`; at the thaw the frozen section is rebuilt |
| 8 page close | `pagehide` → Gramlot disposed, close beacon, the host page closed (`main` answers "Unknown, expired or unowned page"); a Data write afterwards changes nothing | only the test's own write | the elements removed |

Counters (`bindings`, `registrations`, `records`): 52, 18, 39 through steps 1-5; 56, 20, 41
after the remote branch; 55, 20, 40 after the removal; after the close bindings, registrations,
node ids, inline cache, records, timers, DOM listeners and remote requests are 0.

The same story runs in real browsers on every verified host (R16, R19: Chromium and WebKit):
real typing and clicks, Shift click and Enter on the button, and step 8 by navigating away,
with a control request that `main` answers 200 while the page is open and refuses it after the
close.

<a id="gc-215-022"></a>
## 022 · Acceptance families of source §8

Block ID: **GC-215-022**.

| Family | Covered by (all green in R02, R06 unless named) |
| --- | --- |
| A01 roots and identity | `binding-lifetime`, `bag-contract`, `source-extension-contract`, `runner-isolation` |
| A02 authoring | `binding-authoring`, `test_binding_authoring.py`, `test_python_builder.py`, `collections`, `test_collections.py` |
| A03 initialization | `data-installation`, `binding-defaults`, story step 1 |
| A04 paths | `binding-projection`, `binding-router`, `gramlot-quiet-write`, `builder-symbolic-attribute` |
| A05 routing | `binding-router`, `binding-integration`, R08 |
| A06 projection | `binding-projection`, `style-shortcuts`, `renderer`, `html-source-renderer`, `test_renderers.py` |
| A07 SVG | `svg`, `binding-projection`, story (circle `r` and `fill`), R11-R19 in Chromium and WebKit |
| A08 writes | `binding-writes` |
| A09 providers | `binding-providers`, `binding-inline` |
| A10 timing and start | `binding-timing`, `binding-integration`, `bootstrap` |
| A11 editing | `native-controls`, R11 (real typing, caret, IME, temporal types) in Chromium and WebKit, story step 2 |
| A12 booleans | `boolean-controls`, R11, story step 4 |
| A13 clicks and events | `button-controller`, `native-events`, R11 (R3 in forms), story step 5 |
| A14 dynamic Source, FIFO, freeze | `source-pipeline`, `freeze`, `embedded-source`, `live-source-validation`, story steps 6-7 |
| A15 Host contract and resources | `host`, `page-resources`, `test_page_resources.py`, `test_source_host.py`, R15-R21 |
| A16 execution and CSP | `binding-inline` (Q3 under a real engine refusal), `bootstrap` (no string evaluation), `named-logic`, R11, R16, R19, R21 |
| A17 errors and lifetime | `render-failure`, `binding-cleanup` (100 cycles), `page-close`, story step 8 |
| A18 distribution and documentation | R04-R07, R10, R23, §010; `prepare_docs.py`, Sphinx `-W`, `check_public_docs.py` pass |

Firefox is not yet part of any family (§025).

<a id="gc-215-025"></a>
## 025 · Firefox rows, to be run by the owner

Block ID: **GC-215-025**.

From the macOS Terminal app:

```sh
zsh /private/tmp/gramlot-s16/firefox.sh 2>&1 | tee /private/tmp/gramlot-s16/logs/firefox.log
```

The script runs, each with `firefox` as engine: F1 `node scripts/verify_binding_browser.mjs $PW
firefox`; F2 `node scripts/verify_worker_host_browser.mjs $PW firefox`; F3 in the serverless
checkout `node scripts/verify_worker_sentinel_browser.mjs $PW firefox`; then it starts the three
hosts on ports 8881-8886 and runs `node /private/tmp/gramlot-s16/acceptance.mjs $PW firefox <base>`
for F4 uvicorn strict, F5 uvicorn permissive (story), F6/F7 Node strict/permissive, F8/F9 Bun
strict/permissive, and stops the hosts. Port 8091 is not touched. The executor ran the same
script with `chromium` as argument: nine rows PASS, no process left. The rows F1-F9 are filled
by the coordinating chat from the owner's output.

| Row | Outcome |
| --- | --- |
| F1 binding (`verify_binding_browser.mjs`) | PASS, Firefox 155.0: editing, controls, radio and checkbox, button R3 traces, R12 under freeze, strict CSP (named logic runs, inline raises Q3, script without nonce blocked) |
| F2 Worker host (`verify_worker_host_browser.mjs`) | PASS, Firefox 155.0 |
| F3 serverless standalone strict CSP (`verify_worker_sentinel_browser.mjs`) | PASS, Firefox 155.0: window sentinel 1, Worker sentinel 0, altered script blocked |
| F4 gramlot-uvicorn strict | PASS, Firefox 155.0: `avvio`, `Page.css`, inline refused (Q3) |
| F5 gramlot-uvicorn permissive | PASS, Firefox 155.0: story 1-8, inline runs |
| F6 gramlot-js-server Node strict | PASS, Firefox 155.0 |
| F7 gramlot-js-server Node permissive | PASS, Firefox 155.0: story 1-8, inline runs |
| F8 gramlot-js-server Bun strict | PASS, Firefox 155.0 |
| F9 gramlot-js-server Bun permissive | PASS, Firefox 155.0: story 1-8, inline runs |

Run by the owner from the macOS Terminal app on 2026-09-30 (log `/private/tmp/gramlot-s16/logs/firefox.log`, 18:19); a first run started from the Claude app failed at launch on every row (`Could not find profile folder`) and is not a Gramlot result.

<a id="gc-215-030"></a>
## 030 · Defects and limits found (not fixed here)

Block ID: **GC-215-030**.

- **D1, gramlot-serverless tests** (R20; fixed in that repository, `b79a80d`, 19/19): `tests/standalone.test.js:53` and `:105` expect
  `/Source method not found/`; the core now raises `SourceNotFound('Unknown Source method')`,
  the Python message, since Phase 18 (Fable R4a, `c9744e6`). The adapter's tests pin the old
  text; gramlot-js-server was aligned in `1214ac0`, gramlot-serverless was not. Row blocked;
  the fix belongs to that repository.
- **D2, the §8.1 story on the standalone export** (R22): the export builds; the page fails at
  start with the Q3 `EvalError` (`dataFormula 'dataFormula_0' 'formula'`) because the standalone
  has the strict hash profile only and `09_end_to_end` uses inline formulas; the Worker is then
  disposed. The same page runs under the permissive profile of the hosted adapters (R16, R19).
  The review list already records the missing permissive profile of the standalone. Row
  blocked: a story page with named logic only, or a permissive standalone profile, is an owner
  decision.
- **D3, two package names for one core** (R23): with only `@jsr/genro__gramlot` linked, the
  runner export starts no page: "Page modules must export a subclass of Page", because the
  example pages import `@gramlot/native-html/page` and the WorkerHost `@jsr/genro__gramlot/host`,
  two copies. Linking both names to one checkout makes it pass. The package-name decision is S17.
- **D4, stale runtime bundle in the checkout** (§010): found by the new C07 check at the start
  of the phase; rebuilt.
- **L1, Chromium-only scripts**: `verify_examples_browser.mjs`, `verify_standalone_runner.mjs`
  and the gramlot-js-server `test/native-browser.mjs` launch Chromium only; their rows have no
  WebKit or Firefox run. The hosted pages they open are covered in WebKit by R16 and R19.
- **L2, standalone `Page.css`**: the standalone `03_lists` export links
  `file:///themes/gramlot-base/theme.css`, blocked by its `style-src` and outside the export;
  gramlot-serverless resolves such CSS only with an explicit `assetRoot`.

<a id="gc-215-035"></a>
## 035 · Waivers requested from the owner

Block ID: **GC-215-035**.

The owner grants or refuses each; the coordinating chat records the answer here.

| Row | Request | Owner |
| --- | --- | --- |
| R20 / D1 | close S16 with gramlot-serverless at 17/19, the fix delivered in that repository | refused (2026-09-30): no waiver; the two assertions are aligned in gramlot-serverless and the row is re-run |
| R22 / D2 | close S16 without the §8.1 story on the standalone export | granted (2026-09-30): the standalone has the strict profile only by decision; the story passes on the three hosted adapters under the permissive profile; the permissive standalone profile is in the review after 0.2.0 |
| R24 | the four adapters deferred on 2026-09-29 stay out of the qualification | granted (2026-09-30): the owner's deferral of 2026-09-29 |
| L1 | WebKit and Firefox not run for the three Chromium-only scripts | granted (2026-09-30): the pages they open are covered in WebKit by R16 and R19 and in Firefox by F4-F9 |
| F1-F9 | only if the owner does not run §025 | not needed: the owner runs §025 from the Terminal app |

<a id="gc-215-040"></a>
## 040 · Evidence

Block ID: **GC-215-040**.

Temporary evidence under `/private/tmp/gramlot-s16/`: `logs/` (every row), `artifacts/` (the
three artifacts), `clean/` (venv, consumer, test tree), `hosts/` (venv of gramlot-uvicorn,
scratch pages, host launchers), `standalone/`, `runner-standalone/`, `qualify-clean.sh`,
`acceptance.mjs`, `firefox.sh`. The commands in this report keep those original paths.

**Retained (2026-10-01):** the logs of every row (`logs/`, 64 files, including the owner's
Firefox run), the scripts (`qualify-clean.sh`, `firefox.sh`, `acceptance.mjs`,
`debug-standalone.mjs`) and the host launchers (`hosts/serve_py.py`, `hosts/serve_js.mjs`)
are copied to `/Users/gporcari/Sviluppo/gramlot/v_0.2.0/qualification-evidence/` (the owner's
workspace, next to the source plan, outside the repositories). The virtual environments and
test installs are not kept; the artifacts of `artifacts/` carried version 0.1.2 and are
superseded by the 0.2.0 artifacts of the GitHub release `v0.2.0` (§045).

<a id="gc-215-045"></a>
## 045 · Release status

Block ID: **GC-215-045**.

| Stage | Status |
| --- | --- |
| Implemented | yes: branch `wf/gramlot-0-2-0-binding`, Phases 1-19 closed (`ac5c08f`) |
| Accepted | yes: owner, 2026-09-30 (GC-070 §620) |
| Packaged | yes, locally (2026-09-30, version 0.2.0 authorized by the owner): `gramlot-0.2.0-py3-none-any.whl` sha256 `79e48b9e996721c842bb43400e9270d7d5e56561480c5eee0cf2f2ce047b38ec`, `gramlot-0.2.0.tar.gz` sha256 `5717f9bb63a9a0efef28a71adf9a9da69bc1b0200051676993d3d792613c609e`, `gramlot-native-html-0.2.0.tgz` (`npm pack` of `js/`) sha256 `2a13efcc1efe8358776783cd6071b83745f82742a1de08cfd60c0ceb57e7bcd1`; C07 re-check: the runtime bundle inside the wheel and the npm package equals the fresh build of `js/src` (sha256 `a35d468f42f715b5fb7904b976f87b140149643a4896d90988195ed0908fc807`), `js/tests/runtime-bundle.test.js` passes; suites Python OK, JS 451/451, examples 31/31. The published artifacts are built by the release workflow from the tag |
| Published | yes (2026-09-30, owner authorization): tag `v0.2.0` on `main` (`eabf2f0`); workflow "Publish release" run 36761273989 (validate, full CI, build with the C07 check, GitHub release, PyPI; the PyPI job re-run once after a network timeout to `upload.pypi.org`); GitHub release `v0.2.0` with wheel, sdist, `gramlot-native-html-0.2.0.tgz` and `SHA256SUMS`; PyPI `gramlot` 0.2.0 (trusted publisher `gramlot-org/gramlot`, `publish.yml`, environment `release`, with attestations); JSR `@genro/gramlot` 0.2.0 published by the owner from a clean clone of the tag (runtime sha256 `a35d468f…`, as the release artifacts) |
| Distributed | available from PyPI, JSR and the GitHub release; the adapters are not yet pushed |
