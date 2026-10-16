# 235 · Localization: legacy evidence and design choices

Document ID: **GC-235**. Status: **analysis complete; design decisions pending**.
Evidence date: **2026-10-16**. [Full analysis](../../docs/future/235-localization.md).
Related: [GC-205](205-components.md#gc-205-085), [GC-200](200-system-data.md),
[GC-070 §995](../internal/070-work-status.md#gc-070-995). Internal research, no shipped API.

> **Decision update, 2026-10-16:** [GC-240](240-localization-decisions.md) records
> the subsequent `intl_str` and `pages/_metadata` decisions. Earlier recommendations
> below to retain/confirm `!!` are superseded for typed parameters. The legacy
> investigation remains evidence; its open-choice statements describe that earlier
> research checkpoint. The engine and detailed implementation remain unselected.

<a id="gc-235-005"></a>
## 005 · Authorization and conclusion

Owner requests the complete legacy Python/JS mechanism, then a decision on its
continued value or alternatives. Analysis only; no marker, engine, catalog format,
dependency or runtime implementation approved. Keep authoring convenience and
shared catalogs as candidates; do not mechanically retain regex extraction,
synchronous RPC or XML. `!!` authoring can be independent of the message engine.
Translation, display formatting and input parsing are separate responsibilities.

<a id="gc-235-010"></a>
## 010 · Evidence and limits

Legacy `genropy/genropy` commit `fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea` includes
recent fixes/optional transports, not just 2007 code. Principal inspected files
were unchanged from that commit. PoC `10478b57ce3f22e6445eb6b72eba343520cbebac`;
core baseline `c3753e25500e8b551a18650567ae612e1fadd1ed`.
[Full §010](../../docs/future/235-localization.md#gc-235-010) pins 22 sources:
`gnrlocalization.py`, page helpers/context, XML/TYTX/RPC, `gnrlang.js`, browser
locale/storage, editor/CLI, validation, formatting and tests. Read-only tracing
and isolated probes; not all legacy applications, widgets or browser integration.

<a id="gc-235-015"></a>
## 015 · Authoring and message identity

- `!!Save`: whole marked text, default source language English; unmarked Python
  text stays unchanged. `!![it]Salva` sets source language, not target language.
- `[!!Save]` translates an embedded fragment, including in markup.
- `!!{key}Text`: extraction recognizes it; current runtime loses the key (§050).
- Python `self.localize` / `self._`: immediate translation. `self._T` returns a
  `GnrLocString` with identity and retained `%` arguments, not the JS helper.
- JS `_T('Save')` adds a marker; `_T(text,true)` only translates already marked
  text. `lazy` is marker gating, not deferred/asynchronous/reactive translation.

Keys normally combine two-letter source language and `flatten(text)` (lowercase,
non-word runs replaced by underscores). Punctuation/case collide; text edits can
change identity. `GnrLocString` defaults omit the prefix produced by extraction;
old `_key` catalog imports differ. Explicit matching keys retain `%` arguments
correctly. Early interpolation loses reusable identity. No general plural/select
message engine found in these paths; DB `name_plural` is not one.

<a id="gc-235-020"></a>
## 020 · Catalog extraction, storage and editing

Core/package slots own `localization.xml` Bags: module paths contain keys with
`base` and language attributes. Regex scans `.py`/`.js`, preserves known translations,
rebuilds files/dictionary; comments may be collected, multiline/template literals
missed. Module paths are translator provenance, not runtime namespaces. Loading
merges into one dictionary: later same keys win. Unreadable XML may yield an empty Bag.

The editor offers languages/module navigation, editing, rebuild and machine
translation; save updates eligible files and current application memory. Protection
rules are traced, not security-audited. Optional translation service prepares
catalogs; `autoTranslate` protects `%` placeholders. `gnrlocalizer` is the primary
CLI. Older `gnrsitelocalize` has missing-file assumptions/hard-coded paths; do not
claim its collection workflow still operates from its mere presence.

<a id="gc-235-025"></a>
## 025 · Python: when translation actually happens

`getTranslation` returns `OK`/`NOKEY`/`NOLANG` plus text, truncating target language
to two lowercase characters. Marked-string fallback: target, or base for source
language, otherwise English/base. Missing key returns unmarked source. GnrLocString
uses English/base then retained `%` arguments; empty translations count as missing.

Page `localize`/`getRemoteTranslation` normally use `page.locale`. `result_bag`
passes `page.localize` into XML value/attribute serialization or optional TYTX
adapter translation. This affects marked response strings, not just `lbl`; it is
not proof of identical recursive treatment for all containers/transports.
Generic JSON and the separate `result_xml` branch do not pass that callback.
Server query captions/templates also call the localizer explicitly.

`gnr.windowTitle` is initialized and controlled as system Data; marked values share
the Source translation path. Serialization generally sends translated text rather
than message identity, preventing automatic client-side retranslation of that text.

<a id="gc-235-030"></a>
## 030 · JavaScript: lookup, cache and network

`_T`: blank/lazy gate -> cached `genro.locale()` first two characters -> local
storage `localsdict_<language>` keyed by original string -> page-memory dictionary
-> `getRemoteTranslation`. `OK` persists; missing translations stay in page memory.
Calls without callbacks go through `remoteCall(sync=true)`. Cold UI translation
therefore assumes a synchronous server; no complete offline catalog delivery.
Optional fetch integration not tested.

No namespace passed to storage: browser-origin cache lacks app/package/revision
identity; regions share entries; `Save` and `!!Save` have separate entries.
Inspected editor save does not invalidate browser cache; manual clearing exists.
Explicit widget calls are not universal reactive localization. Localization status
hooks exist, but the envelope's placeholder does not prove a functioning missing-key
reporting subsystem.

<a id="gc-235-035"></a>
## 035 · Language, locale and cross-frame behavior

Python locale: explicit cache, otherwise avatar locale/language or first
Accept-Language entry, English default; no full weighted negotiation. Separate
page language uses avatar language or locale's first two characters.
`gnr.language` has server/environment linkage and `changedLanguage` iframe
publish/subscribe. This propagates state, not all labels: `_T` uses cached
`gnr.locale`, Dojo locale is bootstrap configuration, earlier server text has lost
identity. `rpc_changeLocale` writes connection locale, but getter does not directly
read it. App/session reload hooks unqualified. Keep UI language, regional formatting
and time zone distinct in future decisions.

<a id="gc-235-040"></a>
## 040 · Validation, accessibility and formatted values

Validation mixes transported Python messages, JS codes/overrides/dataTemplate,
validators calling `_T`, later fallback translation and independent Dijit bundles.
Translated strings used as codes can disrupt override lookup. A single message
identity/arguments contract is a proposal, not adopted. Gramlot validation priority
remains approved (GC-205 §085); browser messages must not define app language.

Inventory all perceptible text, including tooltips, alt text, accessible names,
announcements and icon meanings. No unified accessibility/direction contract proved
by legacy marker handling; markup translation is not safe insertion by itself.
Python Babel and JS Dojo handle formatting separately; custom parsing conventions
(two-digit years, compact dates, separators) need their own review. Keep typed Data.
DB localized-column hooks and catalog-management tables are separate from UI
catalogs; no new database/service dependency belongs in core from this research.

<a id="gc-235-045"></a>
## 045 · PoC and current Gramlot boundary

PoC `number-format.js`/`display-format.js` use Intl plus explicit parsing and locale
resolution. They do not establish a shared Python/JS message catalog. Core has
reserved display attributes but no complete localization service found in inspected
source scope. Do not claim PoC behavior is shipped core. Application collection
loading remains deferred.

<a id="gc-235-050"></a>
## 050 · Keep, revise and do not copy blindly

Retain convenient marking/shared catalogs/extraction/editor as candidates. Review
language-tag truncation, collision-prone global keys, synchronous requests,
unversioned cache, lost message identity and fragment concatenation. XML is a storage
choice, not inherently defective. Dojo replacement needs parsing/precision/date tests.

Confirmed isolated discrepancies: explicit keys have unnamed runtime regex groups
lost by `groupdict()` despite named extraction groups; Python `_T` default key omits
new-catalog language prefix. No legacy/dependency fixes or Gramlot workarounds made.

<a id="gc-235-055"></a>
## 055 · Modern alternatives

[Full §055](../../docs/future/235-localization.md#gc-235-055) links official sources,
checked 2026-10-16, with trade-offs:

| Option | Role / qualification needed |
| --- | --- |
| ECMA-402 Intl | Formatting/plural categories/collation; no app catalog or general input parser. Qualify browser APIs individually. |
| gettext/Babel | Domains/context/plurals and extraction workflow; browser delivery/runtime still required. |
| ICU MessageFormat/FormatJS | Complete parameterized plural/select messages; select matching Python implementation and format subset. |
| Unicode MessageFormat 2 | Checked Unicode specification is stable, despite older ICU overview draft wording. Native availability/tooling/runtime parity unproved. |
| Fluent | Variants/terms/grouped message attributes; qualify Python/JS FTL tooling. |
| i18next | JS namespaces/interpolation/plurals; not automatically a shared Python contract. |

Recommend comparing gettext and an ICU-style workflow on real messages, with Intl
for qualified formatting; consider Fluent for translator-led variants/attributes.
Preserving `!!` does not force an old engine. Do not implement multiple engines to
avoid choosing. No dependency installed or benchmarked. W3C language metadata also
informs accessibility/direction decisions.

<a id="gc-235-060"></a>
## 060 · Owner decisions

Ask sequentially: retain `!!`? Then identity/context/namespaces; runtime language
switching versus rebuild; language/region/time-zone precedence/fallback; message
format and Python/JS parity; catalog preparation/revision/delivery; rich/plain text,
accessibility/direction; validation messages/native validity. New names follow
GC-225; no inherited globals/aliases assumed, collection mechanism stays deferred.
Proposed fixtures: labels and accessible attributes, parameterized errors, plurals,
reordered arguments, UI language different from region, script tags, RTL/user data,
missing catalogs and hosted/offline execution. Not yet implemented tests.

<a id="gc-235-065"></a>
## 065 · Verification and handoff

15 isolated Python source probes passed (markers/statuses, truncation, key defects,
collisions, retained/early arguments, scanner limitations). Nine JS `_T` VM probes
passed (marker gating, caches, RPC misses, regions/languages, stale cache), using
storage/RPC doubles. No application or browser integration claimed.
Original legacy suites could not collect: core environment lacks `unidecode`.
No installation; legacy test fixtures also require isolation because they write
inside their checkout. Temporary artifacts are `/tmp/gramlot-localization-probe.py`,
`/tmp/gramlot-localization-probe.cjs`, `/tmp/gramlot-localization-legacy-tests.log`;
full document preserves cases and pinned source functions.
No live multilingual session, browser matrix, complete TYTX, translator service or
language-switch UI verification. Analysis ready; next owner authoring decision,
not runtime implementation/publication.

<a id="gc-235-070"></a>
## 070 · Modern formatting takes precedence (2026-10-16)

Owner: "preferisco adeguarmi alla versione moderna se non c'è corrispondfenza il
codice legacy dovra essere adattato". See constitution 11.77 follow-up.

In the locale/format discussion, modern platform conventions take precedence where
there is no semantic correspondence with legacy formats. The migration changes the
legacy application declaration; Gramlot must not add format emulation solely to
preserve an incompatible legacy spelling or behavior. Document each concrete change
with old/new examples, rationale and affected cases for the Softwell team.

This resolves the compatibility priority in §050 for localized formatting. It does
not select an exact Gramlot grammar for Intl options, approve input parsing behavior,
choose a translation engine or settle retention of `!!`. Component and browser
qualification still apply. This is an approved design direction, not implemented
formatting support. Next discussion remains the translation/message contract.


<a id="gc-235-075"></a>
## 075 · Formatting implementation assignment and Toolbox evidence (2026-10-16)

Owner: "ok recuperiamo api vecchia miglioraimola nel casom diovumentiamola e
realizziamola con strumenti moderni". The accepted public name is `gramlot.format`
(GC-225 §060; constitution 11.82). Recover the useful legacy API, improve it where
necessary and document migration differences. Implementation is authorized, but
exact pattern/option coverage and modern engine selection remain open.

Legacy evidence: `gnrjs/gnr_d11/js/gnrlang.js` defines `_F(val, format, dtype)` as
`gnrformatter.asText(val, {format, dtype})`. The formatter infers a missing type,
accepts a simple format or richer formatting options, delegates numbers/dates to
Dojo and applies a final mask. Some branches render HTML or use application-specific
formats. Those branches are evidence, not implicit approval of a complete port.
The new `{}` mask direction is already recorded in GC-210 §095; do not silently
retain `%s` as an alias. No formatting runtime has been implemented by this update.

Remaining contract work before coding: inventory supported legacy cases; settle
number/date pattern coverage, locale defaults and temporal/precision behavior;
map them to modern tools; define `_F` execution context and integration with
attribute display formatting; write shared fixtures and migration examples.
Do not advertise ordinary `Intl` options as support for arbitrary date patterns.

The owner also asks whether Toolbox's natural-language dates are already in JS.
Read-only evidence from `genro-org/genro-toolbox`, local revision
`dfb7322a53a2f9030d6baaadfbb87028559672fd`, and GitHub `main` tree checked on
2026-10-16:

- Python exports `genro_toolbox.dates.parse_period(text, workdate, locale,
  pivot_year=20, locale_dir=None)` and `DatePeriod(start, end)`.
- It handles today/yesterday/tomorrow with offsets, weeks, months, quarters,
  named/numeric dates and open or closed ranges. Italian and English dictionaries
  are JSON; reference date and locale are explicit, not system globals.
- It ports legacy `decodeDatePeriod` without Babel. The guide documents intentional
  differences; the tests combine a legacy corpus with declared divergences.
- The inspected upstream tree contains the Python parser and dictionaries, but no
  JS/TS implementation or JS package. This finding applies to Toolbox, not the
  PoC: the initial broader absence claim was incorrect (see correction below).

Evidence: [Toolbox date guide](https://github.com/genro-org/genro-toolbox/blob/main/docs/user-guide/dates.md),
[parser](https://github.com/genro-org/genro-toolbox/blob/main/src/genro_toolbox/dates/period_parser.py)
and [contract tests](https://github.com/genro-org/genro-toolbox/blob/main/tests/test_period_parser.py).
A future JS port can use the same dictionaries and corpus, after ownership and
scope are agreed. Parsing text into dates is distinct from formatting typed values
for display; no parser port or remote parsing fallback is implemented here.

PoC correction — 2026-10-16: prompted by the owner's "nemmeno in poc c'era ?",
a direct inspection found `parseDateExpression(text, options)` in
`gramlot-poc/js/dom/src/date-parser/index.js`, at PoC revision
`10478b57ce3f22e6445eb6b72eba343520cbebac`. It is a DOM-independent JavaScript parser,
used by `js/dom/src/collections/symbolic-date-editor.js`, with Italian/English
relative dates, periods, ranges, civil-date arithmetic and explicit workdate.
Its API distinguishes single dates, periods and structured errors; it is not an
identical implementation of Toolbox's Python API. For example, reversed ranges
are rejected rather than inferring an end year. Porting requires comparison of
contracts, not an assumption of Python parity. The dedicated existing suite
`node --test tests/date-parser.test.js` passed 11/11 in `js/dom` on 2026-10-16.
The parser exists in the PoC; no promotion into current Gramlot core is claimed.

Port update — 2026-10-16: owner subsequently instructed "allora portiamola subito
in gramlot". PORT-0009-date-expression-parser implements the bounded JS parser in
core; GC-095 §120 documents the API and intentional Toolbox differences. This
supersedes the earlier core-unavailable status, not the investigation evidence.
The date editor, Toolbox changes and separate formatter remain outside this port.


Toolbox alignment update — 2026-10-16: owner "o procedi" approves using Python
Toolbox as the semantic reference. The JS parser now uses the same built-in
vocabulary, pivot window, month-year inference and empty-input open period.
GC-095 §120 replaces the initial PoC syntax/rules and lists retained API differences.
The original absence and PoC-preservation notes above are dated research history;
they no longer describe current runtime behavior.

<a id="gc-235-080"></a>
## 080 · Formatter pattern grammar decision (2026-10-16)

Owner answers "si" to the explicit proposal to use Unicode patterns familiar
from Dojo, including `#,##0.00` and `dd/MM/yyyy`, implemented with modern tools.
Together with 11.82 this establishes the public name `gramlot.format` and the
Unicode/LDML grammar family for number/date patterns. Do not introduce an ad hoc
pattern alphabet or assume differently cased tokens are equivalent.

This is not approval of a Dojo dependency, all historical special formats, or
full Unicode pattern coverage in the first delivery. The supported token/feature
matrix and modern engine still need definition; native Intl does not directly
accept these pattern strings. Current pending decisions: string versus object
options, typed value dispatch and precision, locale/timezone defaults, null and
mask composition, and scoped `_F` integration. The object-form examples discussed
before this confirmation remain proposals. No formatter runtime is implemented
by this documentation update.

<a id="gc-235-085"></a>
## 085 · Pattern option and numeric branches (2026-10-16)

Owner "ok" confirms `pattern` as the object option and the equivalence of the
string second argument to `{pattern: "..."}`. `format` remains the method name,
not a second spelling of the pattern option. Other options and default behavior
remain to settle; this refines the pending API shape in §080.

The owner recalls separate positive/negative/null numeric formats. Legacy evidence
in `gnrjs/gnr_d11/js/gnrlang.js`, `gnrformatter.format_N`: the actual order is
`positive;zero;negative`. The zero section is returned as literal text; an omitted
negative section defaults to minus plus the positive pattern. In `asText`, null
or undefined is converted to zero only when the supplied dtype is numeric and the
format is a string containing a semicolon; otherwise it returns empty text (except
boolean handling). This occurs before type inference/object-option unpacking.
Therefore the legacy does not establish three independent positive/negative/null
branches. Gramlot section order and whether zero and null share a branch remain
open decisions; no runtime behavior has been implemented from this observation.

Zero-case decision — 2026-10-16: owner "zero va bene" accepts zero as the special
numeric case discussed above. Do not infer approval of legacy conditional
null-to-zero conversion from this answer. The default null output, its interaction
with masks and the exact section grammar remain to settle before implementation.

Null decision — 2026-10-16: owner "si, null stringa vuota senza mask" confirms
`gramlot.format(null, ...)` returns `""` without applying the pattern or mask.
This settles the null-output/mask question above and supersedes the legacy
conditional null-to-zero behavior. Zero still follows its numeric branch.
Undefined and empty-string inputs are not implicitly included in this decision.
Remaining contract work includes typed-value dispatch, locale/timezone defaults,
exact pattern/section coverage, other empty inputs and composition rules, and
scoped helper/attribute integration. No formatter runtime implementation claimed.

Typed-value decision — 2026-10-16: owner "per ora si: sesara necessario cambieremo
poi" approves dispatch from the actual value and its TYTX typing, including the
distinction between date, datetime and timezone-bearing datetime. Strings such as
"123" or "2026-10-16" are not automatically parsed as numbers or dates. This is
the current contract rather than an irrevocable commitment; any later coercion
requires a new explicit decision. The implementation must inspect actual TYTX
representations rather than invent metadata fields or datetime heuristics.
Locale/timezone defaults, detailed pattern coverage and the remaining composition
and helper-integration rules are still open. No runtime implementation in this update.

Locale decision — 2026-10-16: owner "ok" confirms explicit call option `locale`
first, otherwise the page locale. Example:
`gramlot.format(value, {pattern: "#,##0.00", locale: "it-IT"})`.
This does not select a page metadata/Data path, locale initialization mechanism,
no-page-locale fallback or timezone default. Those must not be inferred from this
precedence decision. Timezone behavior remains the next contract discussion.

Timezone decision — 2026-10-16: owner "ok" confirms civil dates and timezone-free
datetimes retain their calendar fields without shifting. For typed datetime
instants, an explicit call timezone takes precedence over the page timezone.
This prevents civil dates changing calendar day merely through display formatting.
Option spelling, page configuration and absence handling remain to define; this
is not approval of a browser/system timezone fallback. Runtime unchanged.

Three-section decision — 2026-10-16: owner "ok" confirms the numeric order
`positive;zero;negative` as a Gramlot extension to Unicode patterns. The example
`#,##0.00;-;(#,##0.00)` with it-IT formats 12.5 as `12,50`, zero as `-`, and
-12.5 as `(12,50)`. Null bypasses both pattern and mask as already agreed.
The two-section case remains open: Unicode positive/negative differs from the
legacy positive/zero convention. Empty sections and literal separator escaping
are not decided by this confirmation. No formatter runtime implementation yet.

Two-section decision — 2026-10-16: owner "si" confirms Unicode positive/negative
semantics for two sections and Gramlot positive/zero/negative for three:
`#,##0.00;(#,##0.00)` versus `#,##0.00;-;(#,##0.00)`.
The legacy two-section positive/zero interpretation is superseded. Migration must
review such legacy declarations instead of silently reinterpreting their second
section as a zero override. Empty sections, quoted separators and mask composition
remain open. No runtime implementation is claimed by this contract update.

Mask-order decision — 2026-10-16: owner "ok" confirms the pipeline: format the
non-null value using `pattern`, then substitute the formatted result for `{}` in
`mask`. Example: `gramlot.format(1234.5, {pattern: "0.00", locale: "it-IT",
mask: "Totale: {} €"})` yields `Totale: 1234,50 €`. The null bypass remains in
force. This approval does not extend pointer-specific optional/named slot rules
to standalone masks or settle empty formatted results and literal-brace escaping.
Runtime implementation remains pending the remaining bounded formatter contract.

Empty-zero-section decision — 2026-10-16: owner "ok" confirms that the empty
middle section in `#,##0.00;;(#,##0.00)` intentionally displays zero as `""`
and bypasses the mask. Do not replace this empty section with a default numeric
pattern or interpolate it into surrounding mask text. This refines §085's mask
composition rule for this specific non-null result. Empty positive/negative
sections and empty-string input remain separate open cases; no runtime change.

Named date formats and default — 2026-10-16: owner "per le date vale l9ng short
ecc", followed by "ok", confirms `short`, `medium`, `long`, `full` and explicit
date patterns such as `dd/MM/yyyy`. Omitting `pattern` for a date selects `short`.
Named forms follow the explicit call locale or otherwise the page locale:

```javascript
gramlot.format(date) // Same date format as pattern: "short".
gramlot.format(date, "long")
gramlot.format(date, {pattern: "dd/MM/yyyy", locale: "it-IT"})
```

These are contract examples, not available runtime APIs yet. This decision does
not settle number/boolean defaults, datetime time-field inclusion, absent page
locale handling or the implementation engine. It refines the default behavior
left open above without changing civil-date/timezone rules.

Initial numeric implementation — 2026-10-16: owner authorizes a working incomplete
first slice ("basat che sia predisposto efunzioni in alcuni casi"). The public
method now supports finite JS numbers with explicit pattern/locale, numeric
sections, null bypass and `{}` masks. GC-095 §125 gives executable examples and
the complete supported subset. Earlier statements that no formatter runtime
exists are historical; the broader agreed formatter contract remains incomplete.

Temporal dispatch is blocked specifically by TYTX 0.16.2: registry.js decodes
D, DH and DHZ as Date, erasing their distinction. No Date-midnight inference or
consumer metadata wrapper is introduced. Decimal precision, page context,
non-numeric types, remaining LDML patterns and `_F`/attribute integration remain
future increments, not promised behavior of this slice.

Explicit dtype follow-up — 2026-10-16: owner confirms "ok" to inferring type
from the value with a higher-priority `dtype` option, following the legacy API.
This supersedes the temporal blocker stated above: preserving the wire type is
not a prerequisite for formatting. Initial support now includes D/H/DHZ named
styles with TYTX-compatible Date inference, explicit dtype disambiguation, short
as default, and explicit locale. DHZ requires explicit Intl `timeZone`; D/H
preserve UTC fields without shifting. Numeric L/R/N do not coerce values. GC-095
§125 states the current supported cases and remaining limits. No TYTX changes,
private metadata wrappers, or new page-context configuration are introduced.

Page context/display integration — 2026-10-16: owner authorizes Page locale and
timezone followed by declarative format/mask integration, for the intermediate
release before 0.3 web components. Python Page uses locale/time_zone, JS Page and
browser config locale/timeZone. HTTP and Worker startup carry the context, with
per-call/per-node precedence. Live HTML scalar text and _text use gramlot.format;
plain masks use the shared {} composition, including static Python/JS output.
Earlier statements that attribute integration/context are wholly absent are now
historical. Browser defaults for unspecified Page context await the owner answer.
Static Intl formatting, SVG text, advanced formats and pointer suffixes remain
outside this increment. See GC-095 §125 for executable Python-first authoring.

Browser defaults — 2026-10-16: owner "Sì, usa i valori del browser" completes
the missing-context decision above. Resolve omitted page locale/timezone from
browser Intl at startup, independently for each property; call/node overrides
Page, which overrides browser. No server environment fallback is introduced.
