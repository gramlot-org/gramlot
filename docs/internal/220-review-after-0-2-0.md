# 220 · Review after 0.2.0

Document ID: **GC-220**. Recorded: **2026-10-01**.

The questions the owner deferred during the Gramlot 0.2.0 workflow to a review after the release
(working rule of 2026-09-29: finish 0.2.0 accepting imperfections, then review). The list comes
from the section `## Review after 0.2.0` of the workflow notes, archived with the plan in
`/Users/gporcari/Sviluppo/gramlot/v_0.2.0/workflow-archive/` (outside the repositories). Each item
names the phase or the record where the current behavior is described.

<a id="gc-220-005"></a>
## 005 · Open

Block ID: **GC-220-005**.

- R3, one-field form: Enter in the only text field of a form whose only button has a Gramlot mechanism (and so `type="button"`) submits the form natively (HTML implicit submission) and the mechanism does not run (Phase 13 "R3 results"). Options: keep R3 as is; Gramlot blocks the submission of a form with no submit button; other.
- Python static render: `abs_datapath` of Builder (variable datapath, `#id?attr` differ from JS) (Phase 6, out of perimeter).
- `style`/`class` values neither string nor null are an error (§3.3, GC-210 §030), not implemented (Phase 6).
- Conversion of textual defaults by `dtype` (legacy `stripDataNode`) (Phase 7).
- JS positional arguments of data-elements wait for genropy/genro-builders-js#15 (Phase 3).
- `lbl`/`box` moved to 0.3.0 with the `labelbox` web component (Phase 11).
- Adapters gramlot-django, gramlot-fastapi, gramlot-flask, gramlot-kajenn deferred to after 0.2.0 (Phase 15; Q4 had all seven in 0.2.0).
- R12 reading: an author callback already running finishes, as legacy; only the Gramlot handler classes stop (Phase 14). `handleSourceEvent` returns the closing errors (Phase 14).
- A callback that removes its own node: only the Gramlot handlers stop (ControlAdapter, ButtonBinding, NativeEventBinding, R12); the author code of the callback runs to its end, so a `SET` after the removal writes, a `FIRE_AFTER` from the removed node is not tracked and fires, and a `dataFormula` whose body removed its own node still writes its result, as legacy (Phase 14 "Executor build").
- `BindingRuntime.handleSourceEvent` returns the closing errors instead of throwing them, a return value §4.4 does not name (Phase 14 "Executor build").
- `data(...)` on a Source node other than `root` does not raise the `dataSetter`/`html_data` error: `data` is the genro-builders Data Bag property there (Python `.data('.x')` returns the value, `.data('.x', 1)` a generic `TypeError`; JS `d.data is not a function`). A clear error on every node needs genro-builders to rename or change that accessor: motivated issue in the library after 0.2.0 (Phase 17).
- From the reviews of 2026-09-30 (Phase 18 notes): Fable M1, M2, M4, M6; contestations on `connect_on` by name, `Logic` bans, `handleSourceEvent`, Python `abs_datapath`.
- Standalone export of gramlot-serverless: a `Page.css` URL outside the export (`file:///themes/gramlot-base/theme.css` in `03_lists`) is blocked by its `style-src` and not packaged; gramlot-serverless resolves such CSS only with an explicit `assetRoot` (GC-215 L2, Phase 19).
- The browser pane of the Claude app lets `eval` and `new Function` run under a strict CSP; CSP checks use Playwright (Phase 15, gramlot-uvicorn report).
- `WorkerHost` of gramlot-serverless does not reject `css_requires`/`js_requires`: Q10 names only the minimal `FileHost`, and `parseRequires` is exported only by the `./server` entry, which reaches `node:fs`; `js/src/adapters/resources.js` has no imports and could get a browser-safe export (Phase 15, gramlot-serverless report).
- The standalone of gramlot-serverless has only the strict hash profile; no permissive profile and no inline check under CSP there, while Q3 names two profiles (Phase 15).
- Named `connect_on<event>` needs a dotted name, that is a `js_requires` group; with the minimal FileHost only inline code is possible for it (Phase 16, `controllers/07_events`).
- Style shortcut numbers pass without a unit (`font_size=20` → `font-size: 20`, dropped by the browser) (Phase 16).
- Naming: the core documents call the 0.1.0 profile "native HTML" in 92 files, and gramlot-uvicorn exports `NativeHtmlASGI`. gramlot-js-server dropped the prefix on 2026-10-01 (amendment 11.50); the core documents and the Python adapters are for this review (`NATIVE_ATTRIBUTES` in `js/src/renderer/attributes.js` is a different meaning: HTML attributes that are not style).
- The runner suite (`examples/00-runner/tests/`) never starts `examples/00-runner/server.mjs`: a stale `@gramlot/gramlot-js-server` in `examples/node_modules` with the old `/native` entry passed the 31 tests and failed only when the runner was started by hand (2026-10-01).

<a id="gc-220-010"></a>
## 010 · Closed since

Block ID: **GC-220-010**.

- Package names: one core, two names (`@gramlot/native-html` (former core name) in `js/package.json`, `examples/package.json`, gramlot-js-server; `@jsr/genro__gramlot` in gramlot-serverless and the WorkerHost import) — GC-215 D3; deferred by the owner at the S17 gate (2026-09-30). *Status 2026-10-02:* closed by 0.2.1 (`2e93fc3`): the core is `@gramlot/gramlot`; `examples/package.json`, `@gramlot/gramlot-js-server` and `@gramlot/gramlot-browser` use that name; no tracked file of the core or of gramlot-js-server uses `@jsr/genro__gramlot`.
- Package names: the core `js/package.json` is `@gramlot/native-html` (former core name), unpublished on any registry, used by gramlot-js-server (peer dependency) and by `examples/package.json`; gramlot-serverless uses the JSR name `@jsr/genro__gramlot`. The core runner `examples/00-runner/build-standalone.mjs` fails with `Cannot find module '@jsr/genro__gramlot'` because `examples/node_modules` has only `@gramlot/native-html` (Phase 15; for S17). *Status 2026-10-02:* closed by 0.2.1 (`2e93fc3`): the core is `@gramlot/gramlot`; `examples/package.json`, `@gramlot/gramlot-js-server` and `@gramlot/gramlot-browser` use that name; no tracked file of the core or of gramlot-js-server uses `@jsr/genro__gramlot`.
- Runner `/js/…` pages answer 500: two copies of `@gramlot/native-html` (former core name) (`gramlot-js-server/node_modules` holds 0.0.0-dev.1) (Phase 8, S14). *Status 2026-10-01:* closed in Phase 15: gramlot-js-server takes the core as a peer dependency, one instance (`ed38743`).
- No gate checks that the generated runtime (`js/dist/gramlot.js`, `src/gramlot/resources/gramlot.js`, gitignored) matches `js/src` (C07): the bundle served to gramlot-uvicorn predated `bff81ba` and lacked the Q3 message; regenerated on 2026-09-30 (Phase 15). *Status 2026-10-01:* closed in Phases 19-20: `js/tests/runtime-bundle.test.js` and the C07 check of the `Publish release` workflow.
- `html_svg` 06 Reset: since S10 a literal control `value` is a DOM property, not the `value` attribute, so a native Reset restores the browser default (range 50, empty text) and not the authored value; the 06 README says Reset restores the defaults, and `scripts/verify_examples_browser.mjs` fails there (Phase 16). Fixed in Phase 16 by owner decision (2026-09-30, `3938077`): a literal `value` is also the control default; kept here as a record. *Status 2026-10-01:* closed in Phase 16: a literal `value` is also the control default (`3938077`).
