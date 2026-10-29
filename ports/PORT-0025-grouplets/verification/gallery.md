# Base grouplet gallery qualification — 2026-10-28

Examples worktree: /Users/gporcari/Sviluppo/gramlot/worktrees/grouplets-gallery
Base: 519ef3e76d2b2ea634114404c780e052aa8351b5. Core: current grouplets worktree.
Adapter: unmodified committed develop b75f33a10db84328deff56e75499928458846a87,
extracted to /private/tmp/grouplets-gallery-py-server for local qualification.

- Gallery npm build passed.
- 8 targeted tests: 3 Python/JS main Source comparisons, 3 JSDOM behaviors,
  family inventory and naming checks.
- Endpoint/Source response parity passed, including 6 grouplet fragment cases.
- Python navigation/catalogue checks and JS inventory/sample-Data checks passed.
- The earlier full Python page pass covered 156 subtests; the initial outdated
  catalogue expectation failed and was corrected/verified by the targeted rerun.
- scripts/verify_grouplets_gallery_browser.mjs http://127.0.0.1:8795: all 3 cases
  passed in Chromium through the Python gallery, including navigation, @source
  requests, field edits, isolated/nested Data and Code tab contents. No page/HTTP errors.
- Paired documentation anchors and whitespace checks passed.

The first browser attempt used an older mutable adapter checkout that still
required Logic from every companion. The clean committed adapter already fixes
that contract. No host source/dependency patch was made. Earlier checker failures
were corrected: TYTX request decoding, lazy Code tab, Python for_ normalization,
and current catalogue count/title expectations. No application workaround.

Run with Node 22, PYTHONPATH pointing to the core and examples worktree sources,
and GRAMLOT_TEST_PYTHON pointing to the core virtual environment. Browser script
uses Playwright from the local test setup. Preview is localhost only; no release
or deployment. Remaining families/resources are outside this delivered increment.
