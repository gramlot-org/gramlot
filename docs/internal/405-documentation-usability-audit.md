# Documentation usability and agent authoring audit

Document ID: **GC-405**.

[Concise counterpart](../../docs_llm/internal/405-documentation-usability-audit.md).

The manual supports a first bound page well, but is not yet a complete reference
for the released collections. The LLM mirrors are an archive of concise technical
documents, not an efficient application-authoring pack. Correctness, retrieval
and preservation of contracts matter more than shortening prose alone.

<a id="gc-405-005"></a>
## 005 · Scope and evidence

Audit date: 2026-11-02. Core revision: `a12b4fd4`; examples: `37f3eed`.
Owner request: assess teaching value, ease of use, reference completeness and a
structured LLM version that teaches agents Gramlot with as few tokens as possible.
This record contains findings and a proposed remediation sequence, not approval
of new product APIs or a changed publication boundary.

Method:

- Inventory all 19 public core Markdown pages, their 19 mirrors, the Sphinx
  allowlist, reference generator and root collection grammars.
- Inspect the learning entry points and representative contracts for binding,
  RPC, validation, forms, layouts, menus, editors, collections and database scope.
- Compare the examples coverage document, current example code and explanations,
  including the form-state lesson. Check public core and examples pages in the
  browser; the examples site identifies release 0.3.28.
- Count source tokens locally with `tiktoken` encoding `o200k_base`. These are
  reproducible source counts, not a claim about a particular agent's billing,
  task completion rate or context usage. Inventory and token counts precede this
  audit's own addition.

This is an expert walkthrough and static coverage audit. No novice usability
study or isolated-agent authoring trial was performed. No runtime or public
manual content was changed for this audit.

<a id="gc-405-010"></a>
## 010 · Learning and reference task walkthrough

| Reader task | Current evidence | Assessment and repair |
| --- | --- | --- |
| Run a first Python page | GC-018 gives install/run instructions, a nine-line Python example and an observable result. | Strong entry point. Preserve the small example and explicit environment. |
| Understand HTML versus components | GC-018 uses `input`; GC-105 introduces `textbox`; GC-095 explains Source and styles. | Useful comparison, but the collection setup story changes between chapters. State once whether the environment already supplies collections. |
| Reuse a block at another datapath | GC-097 explains pointers and relative paths; the gallery has composition lessons. | Contract exists. Add one prominent reusable Python helper and two calls with different datapaths, with links to the exact binding rules. |
| Configure one widget | GC-345 separates shared parameters and widget-specific tables. | Good structure for the 48 indexed components, but five component declarations are absent. A widget lookup should not require reading the whole family chapter. |
| Choose a local selector or a database selector | GC-105 describes choices and endpoint contracts. Asqueel examples and adapter material are separate. | Provide an explicit generic/method versus Asqueel-only route. Do not imply every database feature is portable or every selector needs handwritten query code. |
| Build a validated form | GC-105 covers field validation; `formState` is described in GC-340 section 110 and demonstrated in the form-state lesson. | Poor discovery: application lifecycle is buried in the component-extension guide. Put form scopes, drafts, pending checks and local acceptance together under Form and validation. |
| Build a grid, chat or Grouplet | Their prepared grammars exist, but their component entries are absent from GC-345. | Reference incomplete. Grid structure declarations also need reference coverage beyond the widget count. |
| Use menus and windows | GC-350 distinguishes menu hierarchy, dropdown button, toolbar and modal/nonmodal windows. | Strong conceptual guide; custom command registration is an advanced prerequisite. Separate a minimal built-in use case from collection-authoring instructions. |
| Configure an editor without losing state | GC-105 describes CodeMirror setters, live mode, undo preservation and configuration. | Valuable behavioral detail. Keep it in an independently retrievable editor contract, linked from the widget entry. |
| Decide what works offline or with a database | Core and host manuals distinguish responsibilities; the archive is serverless JS, not Python. | Add a concise capability matrix linking to owning manuals. Keep SQLite/Asqueel/host support factual, not inferred from example titles. |

These outcomes measure whether information can be located and applied, not whether
the UI itself is easy to use. The manual must explain the supported primary path;
it must not disguise genuinely missing framework capabilities with more examples.

<a id="gc-405-015"></a>
## 015 · Coverage and consistency findings

### Reference coverage

The root prepared collection JSON files contain **53 declarations carrying
`_meta.gramlot_component`**. GC-345 has 48 component entries:

| Collection | Declared components | Indexed components |
| --- | ---: | ---: |
| inputs | 20 | 20 |
| buttons | 6 | 6 |
| layout | 11 | 11 |
| tree | 2 | 2 |
| editors | 5 | 5 |
| typst | 1 | 1 |
| uploads | 3 | 3 |
| grid | 2 | 0 |
| chat | 1 | 0 |
| grouplets | 2 | 0 |

Missing entries are `grid`, `searchBox`, `chatMessages`, `grouplet` and
`groupletCard`. The generator explicitly selects seven collections in
`scripts/generate_widget_reference.py`; the missing three are not a Sphinx build
failure. The 48/53 ratio is **component entry coverage only**, not parameter,
behavior, collection, example or entire-framework coverage. The Grid grammar's
`struct`, `column` and `colgroup` are additional declarations outside that count.
HTML/SVG, controllers, page APIs and host/database extensions need separate
inventories; absence of `dataSelection` prose does not establish a missing
approved API to document as implemented.

### Current inconsistencies

1. GC-340 correctly says collections can be supplied once by the environment and
   inherited. The public home and GC-105/GC-345 still foreground per-page imports.
   Those declarations remain valid for an unconfigured environment; presenting
   them as the ordinary requirement creates an unnecessary mental and code cost.
2. The examples README, used as its public home, still describes five old
   families. GE-035 reports 131 lessons while the release checks cover 132 common
   Python/JavaScript lesson pairs. Its own text acknowledges selector quarantine
   entries awaiting reconciliation. It cannot yet serve as the definitive coverage
   register for the release.
3. `formState` occurs only in GC-340 among the public core guides. The reference
   entry for `editingStatus` points to general field behavior instead of the form
   lifecycle contract it consumes.
4. GC-105 is 1,816 lines covering fields, validation, layouts, trees, editors,
   windows, tray, uploads and the Visual Source editor. Short code examples do not
   compensate for an excessively broad retrieval unit.
5. Status phrases such as “development preview” and “development increment”
   remain inside public contract sections. Reconcile each against its release and
   explicit acceptance; do not simply delete all limitations.

### What already works

The first-page example is small, executable in the documented environment and
states what the reader should see. Shared parameter groups avoid repeating all
validation attributes for every widget. Effective grammar metadata supplies types,
defaults, binding directions and enums. Stable document/block anchors and mirrors
provide useful infrastructure. Named Logic, Source/Data ownership, modal behavior
and editor state preservation have substantive explanations worth retaining.

The Sphinx checks verify pages, search, source boundaries, local links and paired
anchors. They do **not** establish complete collection coverage, semantic parity
of mirrors, example correctness in every environment or successful authoring by a
new developer. Passing them is necessary but insufficient.

<a id="gc-405-020"></a>
## 020 · Measured LLM cost and information loss

| Source set | Expanded tokens | LLM tokens |
| --- | ---: | ---: |
| All 95 Markdown files in each tree | 1,110,905 | 877,759 |
| Public entry point and 18 guides | 125,825 | 89,538 |
| First page, GC-018 | 1,076 | 1,076 |
| Writing pages, GC-095 | 12,828 | 11,989 |
| Components, GC-105 | 24,956 | 24,953 |
| Widget reference, GC-345 | 17,160 | 7,299 |
| Components and collections, GC-340 | 9,239 | 3,617 |
| Bindings, GC-097 | 10,859 | 7,956 |
| RPC, GC-098 | 1,684 | 1,047 |
| Remote content, GC-099 | 3,131 | 1,908 |

All 95 expanded Markdown files have counterparts. Pair existence is not compactness
or contract equivalence. The public subset is about 29% smaller; GC-105 saves only
three tokens. The LLM work-status mirror alone costs 293,555 tokens, the constitution
80,015 and naming conventions 51,292. These maintenance records must not be the
default onboarding material for an agent writing an application. Framework
contributors still need the applicable authoritative repository instructions.

There is also **lossy compression**: the GC-345 generator retains specific parameter
names in its brief version but removes their types, defaults, binding direction
and allowed values. It omits child grammar and parent-projected child parameter
tables. The full reference contains those facts. An agent must either retrieve a
second document or guess; guessing is unacceptable. Repeated “Applies to” lists
and shared-contract links consume tokens while essential signatures are omitted.

Current staging deliberately excludes `docs_llm` from the public Sphinx site.
There is no dedicated public agent entry point in that allowlist. A repository
mirror and a discoverable, task-oriented agent manual are different deliverables.
Publishing selected LLM authoring material would need an explicit update to
GC-005 section 020; it must not accidentally publish the maintenance archive.

<a id="gc-405-025"></a>
## 025 · Proposed human and agent structure

Keep one source of API facts, with two reading paths. Preserve stable anchors when
splitting existing chapters. Do not create a second grammar or undocumented API.

The human path should have a short learning course, a collection catalogue,
widget/API reference, shared contracts and environment integration guides. Each
widget entry needs purpose, environment/collection prerequisite, smallest complete
example, specific parameters, events/actions, value/update behavior, child grammar,
limitations and direct links to runnable variants. Shared label/style/validation
contracts remain single definitions with applicability links.

For an application-authoring agent, propose:

1. **Entry/index:** environment and version scope, supported collections, task-to-
   contract links, and rules for when to load another file. Do not load all files.
2. **Essential authoring contract:** Page/main, Source versus Data, relative paths,
   binding modes, initialization, named Logic and endpoint boundaries. Include one
   complete reusable Python block rather than many partial variants.
3. **Small API cards:** canonical name and collection; typed signature/defaults;
   read/write semantics; parent/child constraints; relevant events/methods; one
   minimal example and explicit capability limits. Shared parameter families are
   referenced, not copied into every card.
4. **Task recipes:** form with pending validation, generic grid, Asqueel selector,
   toolbar, remote fragment, reusable block and offline page. Declare sample Data,
   environment and companion Logic dependencies; no hidden setup.
5. **Maintenance material separately:** historical decisions, release logs,
   experiments and framework-internal port protocols are linked only for those
   tasks. Application agents must not confuse proposals with released features.

Proposed budgets, to validate rather than promise: roughly 1,500–2,000 tokens for
the essential contract; 300–1,000 for an ordinary widget card; 1,000–3,000 for a
complex task contract. Do not split a safety-critical or behavioral rule merely to
meet a quota. Optimize **tokens required to complete a task correctly**, including
follow-up retrieval, rather than total archive size or terseness alone.

For example, a form card must retain that typed but invalid current values remain
in Data, incomplete number/date text remains in Source with the last typed Data
value retained, pending/error registers block local acceptance, and acceptance is
not database persistence. Omitting any of these to save tokens changes the model.

<a id="gc-405-030"></a>
## 030 · Completion gates and recommended order

1. **Inventory and consistency:** enumerate every collection, declaration and
   shared/host capability; classify implemented, experimental and deferred using
   owning code/contracts. Reconcile family counts, selector scope and environment
   setup. Distinguish generic, Asqueel-only, host-specific and native-only features.
2. **Reference completion:** add the five missing component entries and Grid
   structural declarations, extract a discoverable form lifecycle guide, split
   large family chapters without invalidating anchors. Mark genuine gaps explicitly.
3. **Teaching route:** give each lesson one question, one smallest example,
   observable result and a named next step. Put optional settings into variant
   tabs/blocks. Explanatory prose belongs outside the code; operational labels and
   visible bound outputs remain part of the example.
4. **Agent authoring pack:** generate compact signatures from the same metadata,
   preserve shared semantics and add task-based entry/routing. Keep current mirrors
   paired; do not delete the history to achieve a favorable token count.
5. **Qualification:** run strict Sphinx/link checks, grammar-to-reference coverage,
   typed/default/enum/child-contract parity, and compile/build representative Python
   examples with the stated environment. Use only existing contracts. Test
   representative interactions for binding, invalid/pending form state, retained
   content, generic/Asqueel boundaries and serverless limitations.

For the agent evaluation, give an isolated agent only the authoring entry point and
linked cards, without this conversation or source access. Tasks: bound HTML versus
textbox; reusable datapaths; typed form and remote validation; generic grid; state-
dependent dbSelect under the declared Asqueel environment; toolbar with submenu;
retained tab/floating content; remote data versus remote Source. Record task success,
invented APIs, hidden dependencies, unnecessary code, contract violations and total
retrieval tokens. An independent qualification runner may inspect/build the result.
Run the same tasks with the current docs for comparison. No agent delegation or
such trial was performed in this audit.

Completion means every supported declaration has a reachable reference or explicit
scope explanation, essential contract facts survive compact generation, and the
representative tasks work from the documented environment. It does not mean a
passing build alone or a favorable unmeasured usability score.

<a id="gc-405-035"></a>
## 035 · Source map and reproducibility

- `scripts/prepare_docs.py`: public selection and navigation groups.
- `scripts/check_public_docs.py`: source/link/search and paired-anchor checks.
- `scripts/generate_widget_reference.py`: selected collections and compact output.
- `src/gramlot/collections/*.json`: component metadata; do not double-count the
  packaged nested copies of these grammars.
- GC-018, GC-095, GC-097, GC-098, GC-099, GC-105, GC-340, GC-345 and GC-350:
  representative authoring and reference contracts, at the audited revision.
- `gramlot-examples/README.md`, GE-035 and
  `pages/01-inputs/07-forms_and_validation/05-form_state.{py,md}`: gallery evidence.
- Token evidence: local `/private/tmp/gramlot-doc-audit-20261102-tokens.json`.

Reproduce component counts by selecting root grammar elements with nonempty
`_meta.gramlot_component` and comparing their names with GC-345 third-level widget
headings. Reproduce token counts by encoding UTF-8 Markdown text with
`tiktoken.get_encoding('o200k_base')` at the revisions above. This audit introduces
no dependency or runtime change.


<a id="gc-405-040"></a>
## 040 · First tranche completed — 2026-11-02

Owner approval: “completa il riferimento dei componenti e rendi coerente il
percorso, preparando insieme le schede LLM compatte ma senza perdere tipi, default,
binding e vincoli”, with a human/LLM entry for each collection.

Implemented: GC-345 now covers all 53 component declarations in ten packaged
collections, plus grid struct/column/colgroup signatures. GC-410–455 provide
paired collection guides, minimal Python bodies, prerequisites, usage boundaries
and generated contracts. Home, Components and the repository maps consistently
route pages through inherited environment collections and expose form-state docs.
Shared parameters are listed once per reference with exact applicability; compact
rows factor identical contracts without dropping type/default/nullability/binding,
enum/qualification/target/annotation, child parameters or grammar restrictions.
The previous duplicate GC-345 anchors are repaired with preserved first targets
and semantic component anchors (GC-005 §035).

Verified: 14 focused Python tests cover inventory, compact-contract parity and
shared applicability, structural signatures/regexes, generation freshness, unique
paired anchors and all ten minimal Python recipes building Source. Strict Sphinx
passes; the 29-page allowlist passes local link, search, downloadable-source and
mirror-anchor checks. Existing pytest-asyncio fixture-loop deprecation is unrelated.
No new browser interaction or agent success experiment is claimed.

Measured with o200k_base: aggregate human reference 20,601 tokens, complete compact
reference 13,534 (34.3% fewer). Read one collection for smaller tasks: editors
2,225, tree 910, chat 860 tokens. These are retrieval sizes, not measured agent
success rates. Grid's compact card retains the entire structural signature JSON
and is 1,861 tokens versus the human table's 1,673; not every individual card is
smaller. Measurement: /private/tmp/gramlot-doc-reference-20261102-tokens.json.

This tranche is locally implemented and checked, not deployed. LLM pages remain
repository-only under the current public boundary. Remaining audit phases: simplify
the longer narrative chapters/variant lessons, reconcile the examples coverage
index, and qualify unfamiliar-reader/agent tasks before claiming didactic success.
