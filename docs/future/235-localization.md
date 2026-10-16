# 235 · Localization: legacy evidence and design choices

Document ID: **GC-235**. Status: **analysis complete; design decisions pending**.
Evidence date: **2026-10-16**. [Concise counterpart](../../docs_llm/future/235-localization.md).
Related: [components](205-components.md#gc-205-085),
[system Data](200-system-data.md), [current status](../internal/070-work-status.md#gc-070-995).
This is internal research, not documentation of an implemented Gramlot API.

> **Decision update, 2026-10-16:** [GC-240](240-localization-decisions.md) records
> the subsequent `intl_str` and `pages/_metadata` decisions. Earlier recommendations
> below to retain/confirm `!!` are superseded for typed parameters. The legacy
> investigation remains evidence; its open-choice statements describe that earlier
> research checkpoint. The engine and detailed implementation remain unselected.

<a id="gc-235-005"></a>
## 005 · Authorization and conclusion

Owner: "parti dal legacy, identiofica il meccanismo completo sia python che js e
 decidiamo se mantiene una validita o se ci sono sistemi diversi".
The requested scope is analysis of Python and JavaScript localization followed by
an owner decision. No engine, marker, catalog format, dependency or runtime port is
approved. This research precedes the textual component API discussion.

**Assessment:** retain the useful authoring model and shared catalog workflow;
do not copy the whole implementation. The `!!` marker is an authoring convention,
not a reason to retain regex extraction, synchronous translation RPC or an XML
catalog. A modern message engine can coexist with familiar authoring if explicitly
chosen. Translation, localized formatting and localized input parsing are separate
responsibilities. `Intl` addresses formatting and linguistic operations; it is not
an application translation catalog.

<a id="gc-235-010"></a>
## 010 · Evidence and limits

The legacy checkout is `genropy/genropy` at
`fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`. This is the current legacy lineage,
including recent repairs and optional transports, not an untouched 2007 snapshot.
The principal localizer/page/JS/RPC files were unchanged from that commit when read.
PoC snapshot: `10478b57ce3f22e6445eb6b72eba343520cbebac`.
Core baseline: `c3753e25500e8b551a18650567ae612e1fadd1ed`.

| Reference | Inspected responsibility |
| --- | --- |
| [L1][L1] | Python localizer, catalog loader and extractor |
| [L2][L2] | Page language, locale, helpers and system Data |
| [L3][L3] | RPC response serialization |
| [L4][L4] | XML value and attribute translation |
| [L5][L5] | String serialization callback |
| [L6][L6] | Optional TYTX response serialization |
| [L7][L7] | JavaScript _T, formatting, parsing and storage keys |
| [L8][L8] | Browser locale and storage helpers |
| [L9][L9] | RPC synchronous call and localization status |
| [L10][L10] | Catalog editor, rebuild and save |
| [L11][L11] | Catalog maintenance CLI |
| [L12][L12] | Python locale formatting and parsing |
| [L13][L13] | Flattening and text templates |
| [L14][L14] | Validation rules and message selection |
| [L15][L15] | Validation message resolution and tooltip |
| [L16][L16] | Dojo locale configuration |
| [L17][L17] | Legacy localization tests |
| [L18][L18] | Legacy locale tests |
| [L19][L19] | Localized database column hook |
| [L20][L20] | Database operator and relation captions |
| [L21][L21] | Older missing-string CLI |
| [L22][L22] | Dojo Italian validation messages |

Source tracing covers the authoring-to-catalog-to-rendering paths, maintenance,
locale context, validation and formatting boundaries. It does not certify every
legacy application, third-party widget, database localization handler or browser.
Isolated executable checks and the unavailable integration tests are in §065.

<a id="gc-235-015"></a>
## 015 · Authoring and message identity

The legacy accepts these forms ([L1][L1], [L2][L2], [L7][L7]):

| Form | Meaning and current evidence |
| --- | --- |
| `lbl='!!Save'`, `title='!!Customers'` | Mark the whole string; implicit source language is `en`. Ordinary unmarked Python strings are not translated. |
| `'!![it]Salva'` | Mark text with an explicit two-character source language. The source language is not the requested destination language. |
| `'Prefix [!!Save] suffix'` | Translate embedded fragments; surrounding text remains unchanged. This is also used in markup. |
| `'!!{save_button}Save'` | Explicit key recognized by extraction, but the current runtime regex loses it; see §050. Do not present this as a working path. |
| `self.localize(text, language=...)`, `self._(...)` | Immediate server-side translation of marked text. |
| `self._T(text, lockey=...)` | Return `GnrLocString`, a `str` subclass carrying lookup identity and optional formatting arguments for later translation. This is not the JS function of the same name. |
| `_T('Save')` in JS | Explicit client request; it adds `!!` if the string has no marker. |
| `_T(text, true)` in JS | Only translate marked input; `lazy` means marker-gated, not asynchronous or a reactive translation object. |

`flatten()` lowercases and replaces each run of non-word characters with `_`.
Ordinary catalog keys are `<source-language>_<flattened-text>`; e.g. `en_save`.
Punctuation can collapse: `A-B` and `A B` both become `a_b`. Case also collapses.
This is convenient automatic identification but not a collision-free identifier or
an explicit semantic context. Changing source text can change its key.

`GnrLocString.__mod__` retains the original key and `%` arguments, so a translated
template can be formatted after lookup. However its default key is just `flatten`
without the source-language prefix, while current extraction adds that prefix.
Explicit matching keys work in the isolated probe; plain `self._T('Save')` is not
proved equivalent to `'!!Save'` with a newly extracted catalog. Older catalogs with
`_key` entries use a different import branch, explaining part of this historical
coexistence. Do not silently add aliases to Gramlot to reproduce it.

Interpolating `'!!Hello %s' % name` before lookup loses the reusable template key.
Translating a whole message with named arguments is preferable to concatenating
translated fragments: word order and agreement can differ by language. No general
plural/select message engine was found in the inspected localizer and `_T` paths.
Database `name_plural` metadata is not such an engine.

<a id="gc-235-020"></a>
## 020 · Catalog extraction, storage and editing

`AppLocalizer` builds slots for core Python/JS/common/mobile resources and each
installed package. Slots carry destination folder, source language and protection
metadata. Each slot has `localization.xml`, a Bag organized by module path with
leaf attributes such as `base`, `it`, `en` and other translations ([L1][L1]).

`updateLocalizationFiles()` scans `.py` and `.js` using `LOCREGEXP`. It recognizes
marked quoted literals, embedded markers and literal `_T(...)` calls. It preserves
known translation attributes by key, rebuilds module entries and writes the XML,
then rebuilds the in-memory dictionary. This is lexical extraction, not Python/JS
syntax analysis: comments can be collected, template literals are missed, multiline
literals are missed by the current pattern, and dynamically composed messages are
not statically discoverable. These cases were checked in isolation.

Loading flattens module entries into one application dictionary. Core is loaded
before package slots, and dictionary updates make later matching keys win. Module
paths help translators find usages but are not runtime namespaces. A package can
therefore overwrite another package's same key; explicit component/app catalog
ownership needs a new decision. Missing/unreadable XML can become an empty Bag.

The localization editor ([L10][L10]) provides package/module navigation, language
columns, editable translations, rebuilding and optional machine translation.
Saving applies changed keys to eligible catalog files and updates the current
application dictionary. Developer/protection distinctions control which files are
updated in that workflow. This trace is not a security audit of the editor.

Machine translation is a separate optional service. `autoTranslate()` protects
`%` placeholders with temporary tokens; block translation has its own loop. This
is catalog preparation, not a machine translation service called for every label.
The primary CLI is `gnrlocalizer` ([L11][L11]). The older `gnrsitelocalize` tool
([L21][L21]) expects missing-string files and contains a hard-coded package path;
its presence is not evidence that the current page path still writes those files.

<a id="gc-235-025"></a>
## 025 · Python: when translation actually happens

The shared application localizer returns `{status, translation}`. Status is `OK`,
`NOKEY` or `NOLANG`. Requested languages are truncated to two lowercase characters.
For ordinary marked strings, a found target wins; missing target falls back to the
base when the target equals the source language, otherwise English then base.
Missing keys return the source text without the marker. The `GnrLocString` branch
uses English then base for a missing target and formats retained arguments after
lookup. An empty translation is treated as missing ([L1][L1]).

A page exposes `localize`/`_` and the public `getRemoteTranslation` method. Both
normally select `page.locale`; `getRemoteTranslation` also returns the status.
The main Source response and remote Bag responses pass through
`rpc.result_bag()` ([L2][L2], [L3][L3]):

```text
Python marked labels / titles / messages
  -> Source or response Bag
  -> result_bag
  -> XML translate_cb=page.localize
     OR optional TYTX adapter translator=page.localize
  -> translated strings delivered to the browser
```

The XML serializer applies the callback to string values and attributes via the
class catalog ([L4][L4], [L5][L5]). This is a serialization facility, not a special
case for `lbl`; it can also affect marked data strings. It does not imply arbitrary
nested Python containers receive identical recursive localization. The optional
TYTX adapter explicitly passes a translator ([L6][L6]); actual new-Bag adapter
recursion is a separate integration concern, not tested here.

Generic `result_json()` does not install the same callback. Likewise `result_xml()`
does not pass the translation callback in the inspected branch. Therefore do not
claim all response formats automatically translate. Explicit server translation is
also used for query/operator captions, relation labels and document templates
([L13][L13], [L20][L20]).

`gnr.windowTitle` is initialized from the page title and linked to a title controller;
a marked value travels through the same Source serialization. Once translated,
the browser generally receives the result, not retained message identity/arguments.
Changing a client language path cannot reconstruct these original declarations.

<a id="gc-235-030"></a>
## 030 · JavaScript: lookup, cache and network

`_T` ([L7][L7]) does the following:

1. Return blank input unchanged. If `lazy` is true, return unmarked input unchanged.
2. Read `genro.locale()`, default to English and take the first two characters.
3. Look for the original input string in local storage `localsdict_<language>`.
4. If absent, look in the page-memory dictionary with the same language key.
5. Add `!!` if necessary and call `getRemoteTranslation`.
6. Persist successful `OK` results; keep missing-key/language fallback results only
   in page memory. Return the resulting string.

`genro.serverCall()` without a callback reaches `remoteCall()` with `sync=true`
([L8][L8], [L9][L9]). `_T` assumes an immediate return. A cold catalog can therefore
require a synchronous request for each distinct missing string. This is not a
self-contained offline browser catalog, even though warm cached messages work.
The optional fetch/transport configuration was not integration-tested here.

The call does not pass a storage namespace; the helper leaves the key unchanged.
The cache is browser-origin scoped, not keyed by application/package/catalog
revision. Two region variants share the same language key. `'Save'` and `'!!Save'`
use separate raw-string entries. Successful cached translations have no catalog
revision in this path; the inspected editor save path does not invalidate those
browser entries. Manual local-storage clearing exists in development/preferences.

Client widgets and dialogs call `_T` explicitly at various creation/presentation
points; it is not a universal reactive translation wrapper for every DOM attribute.
`genro._pageLocals` is initialized per page. Localization status hooks also exist
(`_TRD_`, `_localizerStatus`, `gnr.localizerStatus`), but the envelope contains a
placeholder in the inspected code; no working automatic missing-key dashboard is
claimed from these hooks alone.

<a id="gc-235-035"></a>
## 035 · Language, locale and cross-frame behavior

Python `page.locale` uses a cached explicit value if set; otherwise avatar locale,
avatar language, or the first `Accept-Language` entry, with English as default.
It strips quality parameters from that first header entry, rather than negotiating
the full weighted list. Region spelling is normalized to the legacy underscore
form. `page.language` separately prefers avatar language or the locale's first two
characters and stores it in the page environment ([L2][L2]).

The page declares `gnr.locale` and `gnr.language`; the latter has server/environment
integration. A controller publishes `changedLanguage` to iframes and subscribers
set their `gnr.language`. This proves language-state propagation, not general
retranslation. `genro.locale()` caches `gnr.locale`, `_T` uses that cached locale,
and Dojo is configured separately from `page.locale` at bootstrap ([L8][L8],
[L16][L16]). In the traced path, changing `gnr.language` does not invalidate that
cache or rerender every already translated label.

`rpc_changeLocale()` writes `connection.locale`; the current `page.locale` getter
does not read that property directly. Application-specific reload/session hooks
would need separate qualification. Do not promise instant language switching from
this legacy method. Separate UI language, regional formatting and time zone in the
Gramlot decision rather than assuming they are interchangeable.

<a id="gc-235-040"></a>
## 040 · Validation, accessibility and formatted values

Legacy validation combines several message paths ([L14][L14], [L15][L15]):

- Python-declared `validate_*_error`/warning strings can be translated in transport.
- JavaScript validators return codes, messages or structured results. Message
  selection tries specific error keys, then warning/error overrides, and applies
  `dataTemplate` parameters.
- Some rules call `_T` directly: `validate_len` returns translated length messages.
- The later error presenter has a fallback-code map and calls `_T` on the result.
- Dojo/Dijit also has its own localized validation bundles ([L22][L22]).

This is evidence of overlap, not one normalized error identity protocol: translating
a string and then using it as an error code can interfere with code-based override
lookup. Gramlot's approved validation priority (GC-205 §085) should inform the
future design, but a message-ID/arguments representation is only a proposal here.
Do not use browser `validationMessage` as a guaranteed application-language catalog;
a Gramlot-owned message can still be passed to native validity mechanisms.

For perceptible UI, inventory labels, titles, descriptions, placeholders, tooltips,
validation/ask text, accessible names, alternative text, live announcements and
icon-only control meanings. Ordinary translated string attributes can carry some of
these, but the traced legacy localizer does not establish a unified accessibility
or directionality contract. Language metadata and text direction must be handled
explicitly, not inferred solely from visible labels. Localized HTML fragments do
not by themselves establish safe markup/argument insertion.

Formatting is already separate in legacy. Python `gnrlocale` uses Babel for numbers,
dates and times and supplies parsing helpers; `page.toText` passes the page locale.
JS `_F`/formatter and conversion functions use Dojo number/currency/date formatting
and parsing ([L7][L7], [L12][L12]). Parsing includes deliberate conventions such as
compact dates and two-digit-year handling: replacing the formatter does not replace
this input behavior automatically. Keep typed Data separate from display text.

Localized database columns are another mechanism: model declarations can invoke a
package's `handleLocalizedColumn` hook ([L19][L19]). The `uke.localization` table
imports catalogs for management. Neither means the application UI localizer must
use a database. Editorial multilingual content, automatic machine translation and
UI catalogs should not be conflated or turned into core host dependencies.

<a id="gc-235-045"></a>
## 045 · PoC and current Gramlot boundary

PoC already uses `Intl.NumberFormat` and `Intl.DateTimeFormat` in its
[number formatting][P1] and [display formatting][P2] modules. It contains explicit
numeric parsing and locale resolution from nodes/ancestors/application/document.
This is useful port evidence for presentation, not a complete shared Python/JS
message-catalog implementation. No `_T`/gettext-style catalog service was found in
the inspected `js/dom/src` and Python `src` scope.

Current core retains display attributes including `locale`, but its attribute
projection documentation explicitly says format/locale/places/dtype do not perform
formatting in the original binding stage. No complete localization service was
found in inspected `js/src` and `src/gramlot`. Do not advertise PoC formatting or this
research as a shipped localization feature. Collection loading remains deferred;
localization must not silently decide that application API.

<a id="gc-235-050"></a>
## 050 · Keep, revise and do not copy blindly

| Mechanism | Assessment and Softwell impact |
| --- | --- |
| Mark text where it is authored | Keep the convenience as a candidate; preserving `!!` avoids widespread label rewrites. Marker retention is still an owner decision. |
| Shared catalogs for Python and JS | Keep the goal; select one message contract and cross-runtime tests. |
| Extraction and translator editor | Keep workflow; use language-aware extraction/tooling, source references and missing/obsolete checks. |
| Language-tag truncation | Replace deliberately if regional/script variants are required; existing two-letter catalogs need defined negotiation. |
| Flattened global keys | Need collision/context handling and catalog ownership; changing IDs requires migration, not silent remapping. |
| Current explicit `{key}` marker | Reproducible legacy discrepancy: extraction captures named groups, runtime `TRANSLATION` has unnamed key groups and uses `groupdict()`, losing the explicit key. Document before porting. |
| Python `_T` default keys | Reproducible mismatch with new extractor prefixes; audit real uses/old catalog import before deciding compatibility. |
| Synchronous client lookup | Do not reproduce as the normal browser path; propose preloaded/bundled catalogs for serverless and asynchronous preparation for hosted pages. |
| Cache without catalog revision/domain | Needs explicit scope and invalidation policy. Do not carry stale translations across releases. |
| Server consumes message identity early | Works for one-language render; reactive language changes need retained identity or a deliberate rebuild policy. |
| Fragment concatenation and ad hoc `%`/templates | Prefer complete parameterized messages and language-aware plurals; migration changes must be shown to Softwell. |
| Dojo formatting/parsing | Owner prioritizes modern formatting where legacy semantics do not correspond (§070); adapt legacy declarations. Separately qualify parsing, Decimal precision and dates/time zones. |
| XML Bag catalog | Storage choice, not intrinsically invalid; evaluate translator tooling and exports before replacing it. |

No dependency or legacy fixes were made. Findings describe the inspected revision;
they are not justification for adding compatibility code to Gramlot without approval.

<a id="gc-235-055"></a>
## 055 · Modern alternatives, checked against primary sources

These options occupy different layers and are not all mutually exclusive.

| Candidate | What it supplies | Gramlot trade-off / missing qualification |
| --- | --- | --- |
| Native ECMAScript `Intl` | Locale-aware numeric/date/list formatting, plural categories, collation and related facilities | Use as a candidate foundation; it does not provide app message catalogs or a general localized input parser. Browser support must be checked per used API. |
| gettext + Babel tooling | Python catalogs, domains, contextual/plural lookup; extraction/catalog maintenance including JS source | Familiar mature Python workflow. Need explicit browser distribution/runtime and matching semantics; `%` interpolation alone does not supply arbitrary grammar selection. |
| ICU MessageFormat / FormatJS | Whole messages with parameters, plural and select branches; a JS implementation using internationalization APIs | Strong candidate for rich validation/dialog messages. Choose and test a Python counterpart and exact format subset; do not assume every ICU implementation is interchangeable. |
| Unicode MessageFormat 2 | Standardized dynamic-message data model/syntax, selection and formatting | The checked Unicode document is stable, but that is not proof of native browser availability or Python/JS library parity. Requires a bounded implementation/tooling evaluation. |
| Fluent | Messages, terms, language-dependent variants and message attributes | Particularly relevant to a control with label/title/accessible text. Translator-friendly flexibility; requires FTL tooling and Python/JS runtime qualification. |
| i18next | JS catalog organization, namespaces, interpolation and plural handling | Useful browser/app ecosystem, but not a Python-shared contract by itself. Adapter/engine choice remains a design cost. |

Sources, consulted 2026-10-16:

- [ECMA-402 Internationalization specification](https://tc39.es/ecma402/): native facilities; no general message catalog service.
- [Python gettext](https://docs.python.org/3/library/gettext.html): contextual/domain/plural lookup and per-instance translations.
- [Babel message catalogs](https://babel.pocoo.org/en/latest/messages.html): source extraction and catalog workflow.
- [ICU messages](https://unicode-org.github.io/icu/userguide/format_parse/messages/): complete messages, plural/select, formatting and quoting.
- [FormatJS Intl MessageFormat](https://formatjs.github.io/docs/intl-messageformat/): JS message formatting.
- [Unicode LDML Part 9](https://www.unicode.org/reports/tr35/tr35-messageFormat.html): stable MessageFormat specification; check draft status of individual features. The older ICU overview still calls its successor a draft, so use the Unicode specification for status, not that sentence.
- [Fluent selectors](https://projectfluent.org/fluent/guide/selectors.html) and [attributes](https://projectfluent.org/fluent/guide/attributes.html): message variants and associated interface attributes.
- [i18next plurals](https://www.i18next.com/translation-function/plurals) and [namespaces](https://www.i18next.com/principles/namespaces): language plural categories and resource grouping.
- [W3C language declarations](https://www.w3.org/International/questions/qa-html-language-declarations): document/element language metadata; language and direction are separate.

Recommendation, not approval: retain convenient explicit marking, establish one
message contract shared by Python and JS, prepare catalogs before UI use, and use
native formatting where qualified. Compare a gettext workflow with an ICU-style
message workflow on actual Gramlot examples before selecting a library. Consider
Fluent if translator-owned variants and grouped perceptible attributes are important.
Do not implement several engines or a generic adapter hierarchy just to postpone
this choice. No library was installed or benchmarked in this analysis.

<a id="gc-235-060"></a>
## 060 · Decisions to take with the owner

Ask one at a time, starting with authoring compatibility; this is not an approved API.

1. Keep legacy `!!` marking for ordinary declarative text? Decide JS/Python explicit
   helper spelling separately under GC-225; do not assume old globals or aliases.
2. Message identity: source text, explicit ID/context, collection/application scope,
   collision handling and extraction of generated/dynamic messages.
3. Runtime language changes: reload/rebuild or update existing UI while retaining
   focus, draft values and component state? Define cross-frame propagation.
4. Language negotiation, regional formatting, time zone and missing-translation
   policy; explicit app/user/request precedence and serverless defaults.
5. Message format/engine and parameters/plurals; same fixtures on Python and JS.
6. Catalog preparation, distribution, revision and optional translator workflow;
   existing application collection selection stays deferred until explicitly reopened.
7. Plain versus rich text, accessible attributes, language/direction metadata and
   safe parameter insertion. Which icons/shortcuts/layout aspects are localized?
8. Validation integration: stable rule result plus message parameters versus rendered
   text; when messages update and how native validity receives them.

A bounded comparison should include: a static label; a title/tooltip/accessible
name; minimum-length error with a number; zero/one/many results; a reordered named
parameter sentence; English UI with Italian numeric conventions; a language with
additional plural categories; regional/script tags; RTL mixed with user data;
missing catalogs; hosted and offline/serverless use. These are proposed acceptance
cases, not coverage claims.

<a id="gc-235-065"></a>
## 065 · Verification and handoff

- **15 Python isolated source probes passed.** Executed the original parsed
  `TRANSLATION`, `LOCREGEXP`, `flatten`, `GnrLocString` and `getTranslation` bodies
  with a small injected catalog, without initializing the application. Confirmed
  marked/unmarked/embedded translation, missing statuses, regional truncation,
  explicit-key discrepancy, punctuation collision, default `_T` mismatch, retained
  `%` arguments, early-interpolation failure, comment extraction, missed JS template
  literals and multiline text.
- **9 JS isolated source probes passed.** Executed the exact `_T` function in a
  Node VM with storage/RPC test doubles. Confirmed marker gating, cold lookup,
  persistent hits, region sharing, distinct raw-string entries, page-only fallback
  cache, repeated misses, language-key changes and stale persistent translations.
  This does not exercise actual browser storage, Dojo XHR or rendered components.
- Existing legacy localization/locale suites were attempted with the current core
  environment and legacy PYTHONPATH. Collection stopped on missing `unidecode`.
  No dependencies were installed and no full legacy-test success is claimed.
  Those fixtures also create state inside the legacy checkout; any rerun must use
  an isolated setup rather than write to the source checkout for this research.
- Temporary reproducibility artifacts: `/tmp/gramlot-localization-probe.py`,
  `/tmp/gramlot-localization-probe.cjs`,
  `/tmp/gramlot-localization-legacy-tests.log`. The cases and original function
  references above remain the durable evidence if temporary files are removed.
- No live multilingual legacy session, cross-browser support matrix, translator
  service, complete TYTX localization or language-switch UI was verified. The
  architectural conclusions distinguish traced behavior from recommendations.

Analysis is ready for owner review. Next is the first authoring decision in §060,
not implementation, a dependency change, release or a new component phase.

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

[L1]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrpy/gnr/app/gnrlocalization.py

[L2]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrpy/gnr/web/gnrwebpage.py

[L3]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrpy/gnr/web/gnrwebpage_proxy/rpc.py

[L4]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrpy/gnr/core/gnrbagxml.py

[L5]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrpy/gnr/core/gnrclasses.py

[L6]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrpy/gnr/web/gnrbagtransport.py

[L7]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrjs/gnr_d11/js/gnrlang.js

[L8]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrjs/gnr_d11/js/genro.js

[L9]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrjs/gnr_d11/js/genro_rpc.js

[L10]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/projects/gnrcore/packages/sys/webpages/localizationeditor.py

[L11]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrpy/gnr/dev/cli/gnrlocalizer.py

[L12]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrpy/gnr/core/gnrlocale.py

[L13]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrpy/gnr/core/gnrstring.py

[L14]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrjs/gnr_d11/js/genro_frm.js

[L15]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrjs/gnr_d11/js/gnrdomsource.js

[L16]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrpy/gnr/web/gnrwebpage_proxy/frontend/dojo_base.py

[L17]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrpy/tests/app/gnrlocalization_test.py

[L18]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrpy/tests/core/gnrlocale_test.py

[L19]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrpy/gnr/sql/gnrsqlmodel/model.py

[L20]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrpy/gnr/sql/adapters/_gnrbaseadapter.py

[L21]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/gnrpy/gnr/dev/cli/gnrsitelocalize.py

[L22]: https://github.com/genropy/genropy/blob/fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea/dojo_libs/dojo_11/dojo_src/dijit/form/nls/it/validate.js

[P1]: https://github.com/gramlot-org/gramlot-poc/blob/10478b57ce3f22e6445eb6b72eba343520cbebac/js/dom/src/number-format.js
[P2]: https://github.com/gramlot-org/gramlot-poc/blob/10478b57ce3f22e6445eb6b72eba343520cbebac/js/dom/src/display-format.js


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
