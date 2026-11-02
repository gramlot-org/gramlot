# Documentation usability and agent authoring audit

Document ID: **GC-405**.

[Expanded evidence](../../docs/internal/405-documentation-usability-audit.md).

<a id="gc-405-005"></a>
## 005 · Scope

2026-11-02; core `a12b4fd4`, examples `37f3eed`. Owner requested teaching,
reference and token-efficient agent-authoring analysis. Static inventory of 19
public pages/mirrors, grammar/reference generator, representative contract
walkthrough and public browser checks. Not a novice study or isolated-agent trial.
Recommendations below are proposals; no runtime/public manual change authorized
by this audit. Sources/tokens measured before adding the audit.

<a id="gc-405-010"></a>
## 010 · Task findings

Strong: GC-018 nine-line first page with observable result; relative bindings;
shared validation tables; GC-350 menu versus toolbar/window model; editor retained-
state contracts. Weak: environment collections versus per-page setup is inconsistent;
forms are hidden in extension guide GC-340; grid/chat/Grouplets lack reference
entries; GC-105 spans 1,816 lines. Database and offline capabilities need a clear
generic/Asqueel/host/native matrix. These are documentation findings, not claims
that the underlying GUI is unusable.

<a id="gc-405-015"></a>
## 015 · Coverage

Root prepared grammars: 53 elements with `gramlot_component` metadata; GC-345:
48 entries. Missing: grid/searchBox (grid), chatMessages (chat), grouplet/groupletCard
(grouplets). Covered: inputs20, buttons6, layout11, tree2, editors5, typst1,
uploads3. Generator explicitly selects seven collections. 48/53 is entry coverage,
not full feature/parameter coverage; struct/column/colgroup, HTML/SVG, controllers,
Page and host extensions require separate inventories. Do not document proposed
APIs as implemented because a name is absent.

Examples home describes five old families; GE-035 says131 versus release132
common lesson pairs and acknowledges unresolved selector quarantine entries.
GC-340 has the environment inheritance rule, unlike the foregrounded setup in
home/GC-105/345 (still valid for an unconfigured environment). `formState` public
references occur only in GC-340; editingStatus points to general field behavior.
Review development-status language against release/acceptance, not blanket deletion.
Existing Sphinx checks enforce links/search/sources/mirror anchors, not semantic
coverage, API parity or authoring success.

<a id="gc-405-020"></a>
## 020 · Token evidence

Encoding: o200k_base, local source counts, not billing/task usage.
95 Markdown files per tree; no missing mirrors.

| Scope | Full | LLM |
| --- | ---: | ---: |
| Whole tree | 1110905 | 877759 |
| 19 public files | 125825 | 89538 |
| GC-018 | 1076 | 1076 |
| GC-095 | 12828 | 11989 |
| GC-105 | 24956 | 24953 |
| GC-345 | 17160 | 7299 |
| GC-340 | 9239 | 3617 |
| GC-097 | 10859 | 7956 |
| GC-098 | 1684 | 1047 |
| GC-099 | 3131 | 1908 |

LLM maintenance files alone: status293555, constitution80015, naming51292 tokens.
Do not load those for routine application authoring; framework contributors still
follow applicable instructions. GC-345 compact output loses specific types,
defaults, binding modes, enum values and child contracts while retaining long
applicability lists. Public staging excludes docs_llm; publishing an agent pack
requires an explicit GC-005 section020 boundary update.

<a id="gc-405-025"></a>
## 025 · Proposed structure

One API fact source, human course/reference plus agent entry/index, essential
authoring rules, on-demand typed API cards and complete task recipes. Separate
maintenance history. Preserve stable IDs, data ownership, environment prerequisites,
binding direction, child rules, capability limits and failure/lifecycle semantics.
Shared contracts once, referenced from widgets. Proposed targets: essentials
1500–2000 tokens; ordinary card300–1000; complex task1000–3000, validated on tasks.
Optimize total tokens to correct completion, never remove behavioral facts for quota.
Form card must retain typed invalid Data versus unfinished Source draft, last typed
Data retention, pending/error save blocking and local acceptance versus persistence.

<a id="gc-405-030"></a>
## 030 · Proposed order and gates

Inventory/consistency → complete reference and discoverable forms → minimal teaching
route/variant blocks → generated compact API cards and task routing → qualification.
Keep current mirrors/history; no wholesale deletion. Gates: declaration coverage,
semantic signature/default/enum/child parity, strict links/Sphinx, stated-environment
example compilation and representative interaction checks.

Proposed isolated-agent tasks (not run): HTML/textbox; reusable datapaths; typed form
and async validation; generic grid; Asqueel dependent dbSelect; toolbar/submenu;
retained tabs/floating; remote Data versus Source. Supply entry/cards, no conversation
or source; independent runner checks results. Compare current/new docs for correct
completion, invented APIs, setup gaps, unnecessary code, violations and retrieval
tokens. No unmeasured usability grade or success claim.

<a id="gc-405-035"></a>
## 035 · Reproduce

See expanded source map. Count root collections/*.json elements with component
metadata against GC-345 widget headings; avoid nested grammar duplicates. Encode
Markdown with tiktoken o200k_base at audited revisions. Token JSON:
`/private/tmp/gramlot-doc-audit-20261102-tokens.json`. No runtime dependency added.


<a id="gc-405-040"></a>
## 040 · First tranche — 2026-11-02

Owner approved full component reference, coherent route and paired lossless compact
cards per collection. Implemented GC-345: 53/53 components, ten collections, plus
grid struct/column/colgroup. GC-410–455: paired collection recipes/contracts. Home,
Components and maps now explain environment inheritance and link form state. Shared
contracts retain applicability; compact grouping preserves types, defaults, binding,
nullable, enum, qualification, target, annotation and child/parent constraints.
Duplicate GC-345 anchors repaired; preserved first/semantic targets (GC-005 §035).

Verified 14 Python tests (inventory, exact compact facts/scopes, structural regexes,
freshness, unique paired anchors, ten Source-building recipes), strict Sphinx and
29-page source/search/local-link/mirror checks. Existing pytest-asyncio deprecation
is unrelated. No interactive browser or agent success trial claimed.

o200k_base: aggregate human 20,601 / LLM 13,534 tokens, -34.3%. Individual LLM cards:
editors 2,225; tree 910; chat 860. Grid 1,861 exceeds human 1,673 because full
structural signature JSON is retained. Evidence in
/private/tmp/gramlot-doc-reference-20261102-tokens.json. Retrieval size, not success rate.
Locally verified, not deployed; LLM repository-only. Next: longer narrative/variants,
examples coverage reconciliation, independent reader/agent task qualification.
