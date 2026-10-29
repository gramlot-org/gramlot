# Grouplet research index

> **Transfer update:** active identities are GC-360/PORT-0025. [Worktree baseline](worktree-baseline.json), [JS baseline receipt](worktree-js-tests.log), [Python baseline receipt](worktree-python-tests.log), [original plan](pre-transfer-plan.tar.gz) and [historical planning context](historical-planning-context.tar.gz) preserve the comparison with current development.

Research snapshot: 28 October 2026. Start with [GC-360](../../../docs/future/360-grouplets-implementation-plan.md), [port review](../README.md) and [worktree handoff](../HANDOFF.md).

## Sources

- [Historical local legacy snapshot manifest](local-legacy-manifest.json) and [135-file archive](local-legacy-sources.tar.gz), separate from the current upstream snapshot.
- [Archive replay receipt](archive-replay-tests.log) and [documentation verification receipt](documentation-checks.txt).
- [Complete source catalogue and Python API signatures](SOURCE-INDEX.md).
- [Source hashes and immutable URLs](source-manifest.json); [226-file source archive](legacy-sources.tar.gz).
- [Example method and Python surface inventory](python-surface.json).
- [JS regression case names](test-cases.txt), [188-pass Node receipt](node-tests.log), [Python collection errors](python-tests.log).
- [Historical architecture](historical-groupletgrid-architecture.md), [historical store design](historical-groupletgrid-store-integration.html), [exact Git blob provenance](historical-provenance.json). These originals are Historical record, not approved Gramlot contracts.
- [Six historical PoC notes/cards](historical-poc-notes.tar.gz), [secondary local references](secondary-inventory.json).
- [Indexed history including 247 commit messages](indexed-history.json).
- [Relevant meeting-summary extract](meeting-extracts.json): secondary AI-generated notes, not owner decisions.
- [Inspected Gramlot baseline](gramlot-baseline.json); [evidence checksums](checksums.json).

## Coverage and reproduction

The full current upstream archive was searched with rg, then rechecked with --no-ignore --hidden; no additional source matches were missed. Search term: case-insensitive grouplet; union with all grouplet-named tree entries. Runtime dependencies and license were added for replay. The upstream recursive tree was not truncated. Local Genropy Documentation, genropy_meta, genropy_projects, genropy-claude-skills and genro-pantry were searched, together with Gramlot PoC/meta and archived copies. Copies are indexed separately, not counted as distinct implementations.

GitHub search: repo:genropy/genropy grouplet in:title,body,comments, 74 results, incomplete_results=false. All returned conversation comments and inline PR comments were paginated. Commit search is the available Sourcerer index, not a complete Git object-history traversal. Thirty known Genropy Developers summaries were read; only the grouplet-specific extract is retained. No private application source or unrelated meeting material is included.

Unindexed/deleted/inaccessible material remains outside verified coverage. The selective source archive is not a full Genropy Python environment. No browser/database qualification is claimed.

## GitHub discussion catalogue

[Full search results and bodies](github-search.json), [conversation comments](github-comments.json), [inline PR review comments](github-review-comments.json). States below were retrieved on 28 October, not inferred from code.

| Number | Kind | State | Subject |
| --- | --- | --- | --- |
| [560](https://github.com/genropy/genropy/pull/560) | PR | closed | feat(grouplets): add grouplet system for modular form fragments |
| [565](https://github.com/genropy/genropy/pull/565) | PR | closed | fix(grouplets): improvements after grouplet usage |
| [567](https://github.com/genropy/genropy/pull/567) | PR | closed | feat(grouplets): improvements after real-world grouplet usage |
| [582](https://github.com/genropy/genropy/pull/582) | PR | closed | fix: resolve rootNode scoping issue in quickDialog close_action |
| [587](https://github.com/genropy/genropy/pull/587) | PR | closed | feat(grouplet): topic grids, wizard, panel and template auto-discovery |
| [648](https://github.com/genropy/genropy/pull/648) | PR | closed | feat(grouplet): move component into dedicated folder, add mobile app connection |
| [661](https://github.com/genropy/genropy/pull/661) | PR | closed | feat: replace tree branch PNG icons with CSS triangles and refactor app preferences to grouplet panel |
| [681](https://github.com/genropy/genropy/pull/681) | PR | closed | fix(preferences): GroupletForm datapath separation and error-only indicator |
| [682](https://github.com/genropy/genropy/pull/682) | PR | closed | Style modernization: CSS variables, Dojo cleanup, theme system (#671) |
| [708](https://github.com/genropy/genropy/pull/708) | PR | closed | feat(#677): centralized errorHandler with toast notifications and traceback viewer |
| [714](https://github.com/genropy/genropy/pull/714) | PR | closed | Add expandbox widget and improve grouplet system |
| [734](https://github.com/genropy/genropy/pull/734) | PR | closed | fix(#686): restore custom rpcmethod in document store load |
| [771](https://github.com/genropy/genropy/issues/771) | Issue | closed | feat(wizard): add sidebar layout option to groupletWizard |
| [794](https://github.com/genropy/genropy/issues/794) | Issue | open | Support _packages pattern for grouplet resource override |
| [897](https://github.com/genropy/genropy/issues/897) | Issue | open | [TASK] groupletGrid: MVC store-ready — GroupletDataStore |
| [898](https://github.com/genropy/genropy/issues/898) | Issue | closed | [TASK] groupletGrid: migrate DnD to genro.dom.* helpers + dedup wire methods |
| [899](https://github.com/genropy/genropy/issues/899) | Issue | open | [TASK] groupletGrid: adopt wdgByDtype/widgetFromField in struct adapter |
| [900](https://github.com/genropy/genropy/issues/900) | Issue | closed | [TASK] groupletGrid: introduce GroupletDataStore (model façade) |
| [905](https://github.com/genropy/genropy/pull/905) | PR | closed | feat(groupletGrid): new widget for Bag-driven repeatable mini-forms |
| [909](https://github.com/genropy/genropy/issues/909) | Issue | open | Grouplet family: surface silent failures and identifier collisions |
| [910](https://github.com/genropy/genropy/issues/910) | Issue | open | RFC: should grouplet accept a client-side handler (handlerJs=)? |
| [912](https://github.com/genropy/genropy/pull/912) | PR | open | docs(grouplet): For Dummies tour of the grouplet family |
| [914](https://github.com/genropy/genropy/pull/914) | PR | closed | fix(groupletGrid): serialize template loader RPC for dynamic mixin support |
| [915](https://github.com/genropy/genropy/pull/915) | PR | closed | fix(groupletGrid): isolate sibling bagStore on workspace controller path |
| [998](https://github.com/genropy/genropy/issues/998) | Issue | closed | [BUG] groupletWizard step save crashes: relation nodes lost in the step form's record copy |
| [1095](https://github.com/genropy/genropy/issues/1095) | Issue | open | [FEATURE] groupletWizard: terminal state as a resource, initial step, and no reposition on a self-triggered reload |
| [1113](https://github.com/genropy/genropy/pull/1113) | PR | closed | fix(web): bagField without resource no longer raises UnboundLocalError |
| [1152](https://github.com/genropy/genropy/pull/1152) | PR | closed | perf(gnrjs): path-indexed trigger dispatch, per-handler caches and bag hot paths |
| [1182](https://github.com/genropy/genropy/pull/1182) | PR | closed | fix: make the relative storage service usable |
| [1297](https://github.com/genropy/genropy/pull/1297) | PR | closed | fix(widgets): let dijit see a lightButton mousedown |
| [1300](https://github.com/genropy/genropy/issues/1300) | Issue | closed | Trigger index: drop subscriptions of lost nodes with a visible error |
| [1301](https://github.com/genropy/genropy/pull/1301) | PR | closed | fix(gnrjs): drop the subscriptions of content discarded under a frozen node |
| [1402](https://github.com/genropy/genropy/issues/1402) | Issue | closed | [BUG] Localization scanner drops the section of a module sharing its basename with another file (grouplet.py / grouplet.js) |
| [1403](https://github.com/genropy/genropy/pull/1403) | PR | closed | fix(localization): keep a section per file for modules sharing a basename |
| [1418](https://github.com/genropy/genropy/issues/1418) | Issue | closed | groupletWizardForm: the first Next on a new record can leave the next step disabled |
| [1436](https://github.com/genropy/genropy/issues/1436) | Issue | closed | [BUG] updateRemoteContent re-entered before its in-flight lock: two fetches race and a stale content can be mounted last |
| [1437](https://github.com/genropy/genropy/pull/1437) | PR | closed | fix(gnrjs): take the remote content lock before anything that can re-enter |
| [1439](https://github.com/genropy/genropy/issues/1439) | Issue | closed | [FEATURE] groupletGrid card mode: declarative formulas= and a totals= footer band |
| [1440](https://github.com/genropy/genropy/pull/1440) | PR | closed | feat(grouplet): groupletGrid card mode gets formulas= and a totals= band |
| [1464](https://github.com/genropy/genropy/issues/1464) | Issue | closed | [BUG] Item memory store on a whole record rewrites it and loses change tracking |
| [1466](https://github.com/genropy/genropy/issues/1466) | Issue | closed | [FEATURE] groupletPanel: mandatory grouplets marked in the menu and blocking the outer form |
| [1468](https://github.com/genropy/genropy/issues/1468) | Issue | closed | [BUG] GroupletForm loadOnBuilt: entering a wizard step asks about pending changes the build itself made |
| [1473](https://github.com/genropy/genropy/issues/1473) | Issue | closed | [FEATURE] groupletGrid totals: a row count entry and hidden= per entry |
| [1474](https://github.com/genropy/genropy/pull/1474) | PR | closed | feat(grouplet): a row count and hidden= per entry in the groupletGrid totals |
| [1476](https://github.com/genropy/genropy/issues/1476) | Issue | closed | Form keeps invalid fields and change entries of torn down widgets |
| [1477](https://github.com/genropy/genropy/pull/1477) | PR | closed | fix(form): a torn down widget no longer keeps the form invalid or changed |
| [1495](https://github.com/genropy/genropy/pull/1495) | PR | closed | fix(gnrjs): the trigger index drops the subscriptions of discarded nodes and reports them |
| [1497](https://github.com/genropy/genropy/pull/1497) | PR | closed | grouplet wizard: saves only through its own steps |
| [1498](https://github.com/genropy/genropy/issues/1498) | Issue | closed | [BUG] groupletWizard: closing the dialog drops the current step's unsaved changes without asking |
| [1499](https://github.com/genropy/genropy/issues/1499) | Issue | closed | [BUG] wizardConfirm leaves the record flagged as confirmed when the save does not run |
| [1506](https://github.com/genropy/genropy/issues/1506) | Issue | closed | [FEATURE] groupletWizard: per-step summary in the stepper and save on selected steps |
| [1507](https://github.com/genropy/genropy/issues/1507) | Issue | closed | [BUG] A failed build in the source trigger queue freezes every later build of the page |
| [1508](https://github.com/genropy/genropy/pull/1508) | PR | closed | fix(gnrjs): a failed build in the source trigger queue no longer freezes the page |
| [1518](https://github.com/genropy/genropy/issues/1518) | Issue | closed | [BUG] MultiButton buttons still queued for build keep the previous selection |
| [1533](https://github.com/genropy/genropy/issues/1533) | Issue | closed | [FEATURE] Choice tiles widget for grouplet wizard steps |
| [1537](https://github.com/genropy/genropy/issues/1537) | Issue | closed | [FEATURE] groupletGrid: phantom row, entry row and template rows with multi-selection |
| [1542](https://github.com/genropy/genropy/issues/1542) | Issue | closed | [BUG] groupletGrid fillParent demo pages render empty |
| [1544](https://github.com/genropy/genropy/issues/1544) | Issue | closed | [FEATURE] groupletGrid entry row: say which required field is missing on Enter |
| [1560](https://github.com/genropy/genropy/issues/1560) | Issue | closed | [BUG] Nested source teardown leaves discarded descendant subscriptions indexed |
| [1577](https://github.com/genropy/genropy/issues/1577) | Issue | closed | [FEATURE] multiButton minimal option for the light text-button look |
| [1617](https://github.com/genropy/genropy/issues/1617) | Issue | open | [TASK] Redesign the dynamic field form and fix its bugs |
| [1665](https://github.com/genropy/genropy/issues/1665) | Issue | closed | [BUG] Mixin metadata mutation corrupts already-bound RPC names and breaks nested GroupletGrid templates |
| [1673](https://github.com/genropy/genropy/pull/1673) | PR | closed | feat(adm): hosting preference keys read-only in the workspace preference page |
| [1714](https://github.com/genropy/genropy/issues/1714) | Issue | open | [FEATURE] groupletChoice with multiple selection |
| [1729](https://github.com/genropy/genropy/pull/1729) | PR | closed | feat(grouplet): groupletCard with its chrome band; grid drag opens a slot where the rows land |
| [1730](https://github.com/genropy/genropy/pull/1730) | PR | closed | fix(clipboard,grouplet): a refused copy is reported; row tools sit side by side |
| [1731](https://github.com/genropy/genropy/pull/1731) | PR | closed | feat(doc): one documentation address for grouplets, fields and handbook pages |
| [1733](https://github.com/genropy/genropy/pull/1733) | PR | closed | fix(grouplet_grid): copied rows keep every row of their nested grids |
| [1735](https://github.com/genropy/genropy/pull/1735) | PR | closed | feat(grouplet_grid): defaultRow ==expressions and additem_focus |
| [1736](https://github.com/genropy/genropy/pull/1736) | PR | closed | feat(doc): docs as Markdown in a documentation storage, edited in place by documenters |
| [1738](https://github.com/genropy/genropy/pull/1738) | PR | closed | feat(doc): the "?" opens the published manual's section in a help panel |
| [1753](https://github.com/genropy/genropy/pull/1753) | PR | closed | feat(doc): help tooltips, a resizable help panel with the manual in place, inline docs demo and guide |
| [1763](https://github.com/genropy/genropy/issues/1763) | Issue | closed | [BUG] groupletGrid phantom card wraps every field twice when the grid loads with stored rows |
| [1764](https://github.com/genropy/genropy/pull/1764) | PR | closed | fix: labledbox no longer wraps its content twice when rebuilt |
