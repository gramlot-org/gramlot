# PORT-0009-date-expression-parser

- **Status:** superseded on 2026-10-25 — the parser moved to `@genrojs/toolbox`;
  Gramlot re-exports it (see the end of this record).
- **Owner authorization:** "allora portiamola subito in gramlot", 2026-10-16,
  following the PoC parser demonstration and verification.
- **PoC revision:** `gramlot-org/gramlot-poc@10478b57ce3f22e6445eb6b72eba343520cbebac`
- **Destination revision:** local working tree; no release or publication requested.
- **Constitution checked:** §§3–6, 11.43, 11.83, §13; GC-225 §065.

## Evidence

PoC `js/dom/src/date-parser/{index,civil,locales}.js`,
`js/dom/tests/date-parser.test.js` and `docs/guides/date-expression-parser.md`.
The three implementation modules were inspected individually. No editor, calendar,
DOM construction, Data writes, transport or dependencies are included.

## Scope and contract

Named JS export `parseDateExpression(text, options)` from `@gramlot/gramlot`.
Toolbox-aligned Gregorian civil strings (0001–9999), IT/EN vocabularies and numeric orders,
explicit workdate, optional locale (it-IT) and twoDigitYearAhead (20), inclusive
periods/open bounds and structured error codes. No clock/timezone/DOM access.
Use Toolbox vocabulary and normalization, including its English keyword fallback
and language-default regional date order. No remote request, Data conversion,
formatter, input widget or Python API.
The public guide GC-095 §120 describes exact rules and Toolbox differences.

## Contents

Three reviewed parser modules, declaration file, package entry exports, adapted
PoC contract tests, destination packaging/isolation tests and paired documentation.
No new dependency and no changes in Toolbox, Bag or Builders.

## Verification

> Historical record — initial PoC port. The alignment results are recorded below.

PoC baseline: 11/11 existing parser tests passed before porting.
Destination verification on 2026-10-16:

- 15 parser tests, including public export, shipped readable/minified bundles and
  Europe/Rome, America/Los_Angeles and Pacific/Kiritimati subprocess checks.
- Full JS suite: 623/623 passed, using the project's Python environment and local
  test-server permissions. Earlier attempts failed because the default Python
  lacked genro_bag and the sandbox denied localhost bind; neither required a fix.
- `npm --prefix js run build` succeeded; served runtime identity checks pass for
  JS distribution and Python resources. The parser ships through the normal root
  export and requires no new entry-point mapping or runtime dependency.
- TypeScript strict consumer check passed for union narrowing, required workdate
  and rejection of Date objects as workdate (`tsc --noEmit --strict --skipLibCheck
  --module NodeNext --moduleResolution NodeNext --target ES2022`). This checks
  consumers of the new declarations, not all existing declaration internals.
- Sphinx with warnings-as-errors and public documentation checks passed (10 pages,
  search, links, source selection, mirrored anchors). Paired sections and whitespace
  checked. No browser UI or editor verification is claimed for this pure parser.

## Differences and open questions

Owner follow-up "o procedi" authorizes Toolbox semantic alignment. Result/error
types remain JS-specific; empty input, pivot, keyword fallback and year inference
now follow Python. Custom locale loading and input editor remain separate work.
The runtime modules are no longer byte-for-byte copies of the PoC.

## Destination review

- **Result:** accepted by destination technical review within the owner-authorized scope; owner review of the completed port remains separate.
- **Scope:** standalone parser only; JS-owned runtime utility, no Python mirror.
- **Constitution conflict:** none within owner-confirmed bounded port 11.83.

## Feedback for later ports

Search PoC implementation vocabulary as well as legacy function names: the old
name-based search missed this parser. Preserve stable error codes and explicit
reference date; test public package and shipped bundle, not only direct sources.


## Toolbox alignment follow-up — 2026-10-16

Owner approval: "o procedi", following the explicit proposal to use Toolbox Python
as semantic reference and its corpus for verification. The implementation follows
`genro-org/genro-toolbox@dfb7322a53a2f9030d6baaadfbb87028559672fd`,
`src/genro_toolbox/dates/period_parser.py` and its IT/EN JSON dictionaries.
The dictionaries are embedded unchanged in the ES module (no JSON-loading runtime
requirement). Existing civil arithmetic and JS result union remain.

The upstream corpus and its divergence overlay are copied unchanged into core
fixtures with provenance. Tests require no live dependency or sibling checkout.
PoC tests whose expectations contradicted the approved alignment now assert the
Toolbox result (including rejection of unsupported PoC forms), rather than being
silently dropped. The corpus is an independent oracle, not JS-generated output.

Known surprising Toolbox rules are preserved and documented: separated numeric
month/day swapping, possible year adjustment on explicit named-month endpoints,
and retention of reversed fully explicit date ranges. The consumer owns ordered
range validation. Formatting and widget integration are not included.

Final verification (2026-10-16):

- All 2796 upstream corpus cases pass with the 432 upstream corrections applied;
  the overlay integrity check also passes. All 15 focused parser checks pass,
  including the amended PoC expectations, new forms, public bundle exports and
  timezone independence. 2812 parser-suite tests total.
- Full Gramlot JS suite: 3420/3420 pass with project Python and local test-server
  permissions. Both runtime bundles were rebuilt and pass existing identity checks.
- Upstream Python tests/test_period_parser.py and tests/x/test_x_period_parser.py:
  2835/2835 pass, run read-only with bytecode/cache writing disabled. No dependency
  source changed. This verifies the reference implementation itself.
- Strict TypeScript consumer check passes; Sphinx -W -n and public documentation
  checks pass (10 pages). Mirrored sections, fixture identity and whitespace pass.

Destination technical review: accepted within the owner-approved alignment scope.
The user-facing release remains unpublished; no editor or formatter was added.

## Move to Toolbox — 2026-10-25

Owner: "Approvo l'emendamento: scrivilo in docs e docs_llm, aggiorna i docs
correnti e committa." The parser was extracted into `@genrojs/toolbox` 0.19.0.
Gramlot depends on `@genrojs/toolbox` (>=0.19.0) and re-exports
`parseDateExpression` and its type names from `@gramlot/gramlot`.
`js/src/date-parser/`, the copied Toolbox corpus and its fixtures are removed.

Verification before removal: the Gramlot corpus test passed 2797/2797 against
`@genrojs/toolbox`; the Gramlot parser tests passed 14/14 against it. After the
change: `npm --prefix js run build` succeeded and the full JS suite passed
1036/1036. `js/tests/date-parser.test.js` now checks only the re-export and the
readable/minified bundles. Constitution entry gc-000-toolbox-date-parser.
