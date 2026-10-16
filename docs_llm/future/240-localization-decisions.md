# 240 · Localization decisions

Document ID: **GC-240**. Decision record: **2026-10-16**.
Status: **decisions recorded; deferred, non-priority, non-blocking implementation plan**.
[Full record](../../docs/future/240-localization-decisions.md).
[Evidence](235-localization.md) · [Naming](../internal/225-naming-and-proxy-conventions.md#gc-225-045) ·
[Status](../internal/070-work-status.md#gc-070-995).
Constitution 11.78; documentation only, no selected engine or implemented API.

<a id="gc-240-005"></a>
## 005 · Central decision

A signature parameter typed `intl_str` identifies localizable text. `str` remains
ordinary. `!!` is unnecessary on values passed to those typed parameters, refining
the earlier desire to preserve it. Untyped marking/legacy compatibility is not
settled. `intl_str` is the owner's semantic-type name, not standard Python or the
JavaScript Intl object; the annotation direction is now agreed (§035), with ownership still open.

<a id="gc-240-010"></a>
## 010 · Owner evidence and scope

Owner statements retained in full §010: `intl_str` in Builder/Routes signatures;
"non serve forse nemmeno !!"; SQL `name` is str, `name_long`/`name_plural` intl_str;
collection recognizes values from signatures; source language belongs to package;
Gramlot page class/folder metadata; "pages/_metadata"; metadata contains common
page properties; "label è intl_str". Owner handles the DB explanation separately.
Latest request adds the confirmed component/message scope and a deferred,
non-blocking plan (§§050–060), not runtime/dependency/DB/release work.
Modern locale/format conventions take precedence over incompatible legacy formats
under constitution 11.77, with Softwell migration documentation.

<a id="gc-240-015"></a>
## 015 · Typed text

| Parameter | Type | Value | Catalog intent |
| --- | --- | --- | --- |
| name | str | customer | Technical identifier, not translated |
| name_long | intl_str | Customer | Localizable display metadata |
| name_plural | intl_str | Customers | Localizable plural label |

This does not translate row values or decide count-dependent plural rules.
Gramlot `label` is declared intl_str in the signature that exposes it; recognition
comes from type, not parameter spelling. The owner subsequently includes the display/accessibility surfaces in §050;
the concrete signature inventory remains implementation work. Paths/codes remain
technical strings. Routes are in the typed direction, not blanket translation of
incoming user text or endpoint results. No owning-library changes authorized.

<a id="gc-240-020"></a>
## 020 · Source language and shared metadata

Source language belongs to the package context; it is distinct from target UI
language. Gramlot pages can carry class metadata and shared folder defaults at
`pages/_metadata`, with page-specific metadata possible. Exact language key and
file representation remain open; no extension chosen. Metadata is general, not
localization-only. Permitted fields, nested hierarchy, merge/overrides and absent
values still need definition across Python, Node and serverless.
Text attribution for shared components/mixins is open; the assistant's suggestion
to use the authoring package does not establish a confirmed provenance mechanism.

<a id="gc-240-025"></a>
## 025 · Collector inputs

Combine actual parameter type, original text and source-language context. Example:
`name_long: intl_str` + `Customer` + English supplies the recognition information
of `!![en]Customer`, not its old key/transport/catalog implementation.
Marker-only scanning is insufficient. Static analysis versus controlled construction
is undecided, as are positional/default arguments, unexecuted branches, computed
texts, bindings and JS logic. Never infer permission to collect arbitrary user data.
SQL model-time collection was only a suggestion.

<a id="gc-240-030"></a>
## 030 · Translation and formatting boundaries

Typing does not decide translation timing or message identity in Source/transport.
Python/JS consistency is the goal; no gettext/ICU/Fluent engine selected. No custom
engine or multi-engine wrapper implied. Formatting follows modern conventions;
exact options/parsing remain open. Gramlot owns validation; localized error
identity, the arguments API and timing still require a contract.

<a id="gc-240-035"></a>
## 035 · Shared annotation contract

Accepted design direction, not an installed API:

```python
from typing import Annotated

intl_str = Annotated[str, "intl_str"]
```

Define this alias once in a shared Genro module, usable by Builder, Routes and DB
without depending on Gramlot. The owning package/import path remains to be chosen.
The supplied value stays an ordinary string. The annotation carries the semantic
marker; the concrete source text belongs to the argument or its default, not to
the shared type definition. No string subclass or additional TYTX value type is
introduced by this direction.

An isolated local probe confirmed that Builder's existing annotation exporter
serializes this alias as an annotated `builtins.str` with a `value` metadata item
containing `intl_str`. Inspection of the JS loader shows it preserves such metadata.
This is structural support, not an implemented localization consumer. The current
CustomTypes registry is validator-oriented (portable Regex/Range); this design does
not require extending it or disguising localization as a validator.

Routes' Pydantic plugin already retains hints with `include_extras=True`. An isolated
probe confirmed that Pydantic validates the value as a string but emits only
`{"type": "string"}` in its JSON Schema. Routes must preserve/expose the semantic
qualification explicitly in its parameter description; its exact descriptor field
and any schema extension remain to be agreed in the owning project.

GC-225 §045 records the accepted names/representation direction. No installed
Builder, Routes or DB source is modified by this plan.

<a id="gc-240-040"></a>
## 040 · Open decisions before implementation

| Area | Still to decide |
| --- | --- |
| Shared type | Owning package/import path and dependency placement; JS authoring descriptor and Routes export field |
| Page/folder metadata | Language key, format/extension, permitted properties, hierarchy, override/merge and missing metadata behavior |
| Text provenance | Page versus shared component/mixin/package; stable context for extraction and lookup |
| Collection | Static versus controlled execution; defaults, positional arguments, branches and JS-only messages |
| Dynamic values | Data-bound text, user content, already localized values and explicit non-translatable display text |
| Message model | Identity/context, concrete parameter API and placeholder syntax, escaping, plurals, source edits and catalogs |
| Engine | Concrete Python and JS libraries plus shared conformance fixtures |
| Runtime | Translation timing, catalog delivery/versioning, serverless availability, language changes, fallback and diagnostics |
| Migration | Existing `!!` outside typed parameters; old catalogs and explicit source-language exceptions |

Resolve these when the workstream is scheduled, one decision at a time. They do
not block current component work. DB implementation stays with its project owner;
this planning request does not authorize dependency edits or parallel implementation.

<a id="gc-240-045"></a>
## 045 · Status and verification

**Deferred backlog: not a priority and not a blocker.** The owner requests a decision
update and future implementation plan, not execution of that plan. No version,
deadline or release gate is assigned. Current components can continue without a
localization engine; keep the planned classification visible in their design.

This change verifies paired documentation, anchors and links. The small annotation
probes in §035 establish only representation/export behavior; they do not validate
collection, translation, component integration or runtime language switching.
When the owner schedules this workstream, start with the bounded shared-contract
step in §055. Do not reopen confirmed typed recognition, the annotation direction,
separation of message parameters, or the non-blocking priority.

<a id="gc-240-050"></a>
## 050 · Components, labels and application messages

The owner confirms this scope with: "ok aggiorna il documento con queste decisioni
e fai un piano per introdurre intl_str nei builder, nelle routes, nei componenti e
nei messaggi" and explicitly adds "non è preioritario o bloccante ma teniamone
co9nto". This follows the concrete `Annotated[str, "intl_str"]` proposal and the
component/message explanation. The following decisions refine §§015–035:

| Surface | Localizable text | Kept separate |
| --- | --- | --- |
| Component descriptions | Display labels, placeholders, tooltips and accessible descriptions | IDs, code, Data paths and business values |
| `label=` / `lbl=` | The existing display parameter is declared `intl_str` in its actual signature | No automatic rule based on spelling and no new alias implied |
| Notifications/messages | User-facing message and title | Payload data and technical routing |
| Alerts/confirmations | Text, title and action-button captions | Action identifiers and event names |
| Validation/errors | User-facing error messages | Stable error codes, raw exceptions, tracebacks and diagnostic logs |

A JS-owned component description declares this semantic type once. The generated
Python Builder signature and browser metadata preserve it; authors should not
maintain two lists of localizable properties. This follows GC-205/constitution
11.76, without settling the component-description export API.

For example, the future declaration `pane.textbox(value="^.customer", lbl="Customer")`
classifies `lbl` as localizable and `value` as bound business data. It does not
translate or collect the customer's name. The example is schematic; it does not
claim a shipped textbox collection or settle other component parameters.

Messages with variable content keep the translatable template and arguments
separate: conceptually, source text "Customer {name} was saved" plus the argument
`name = "Mario Rossi"`. The sentence is localized; the name remains user data.
The braces illustrate separation, not a chosen interpolation language or public API.
Avoid concatenation that fragments messages and prevents translators from reordering
arguments. Exact placeholder, plural and escaping semantics remain open.

Errors retain a stable technical code (for example `customer_not_found`) and a
separate localizable user message. Raw exception text is not automatically translated
or exposed to the user. Gramlot's validation policy remains authoritative; localized
messages belong to that policy without duplicating browser-native validation rules.

<a id="gc-240-055"></a>
## 055 · Deferred implementation sequence

This is a proposed delivery sequence for later scheduling, not an active execution
plan. No step starts under the present documentation request. Each step needs a
bounded owner-confirmed contract before implementation.

| Step | Work and ownership | Completion evidence |
| --- | --- | --- |
| L1 · Shared type and portable contract | Choose the shared Genro package; define the accepted alias once; settle the minimal semantic descriptor consumed by Python and JS. Inventory actual display parameters in the affected libraries. | Ordinary values remain strings; the marker survives supported signature export/import; ordinary `str` remains ordinary. |
| L2 · Builder and Routes metadata | Builder preserves/classifies marked parameters, including defaults and positional arguments. Routes exposes the marker in neutral parameter metadata instead of losing it through JSON Schema generation. Keep validation and localization responsibilities separate. | Matching classification fixtures in Python/JS Builder and Routes; invalid base values follow the established string-validation contract. No incoming user text is added to a catalog merely by route validation. |
| L3 · Component descriptions | Add the semantic qualification to JS-owned descriptions and generated Python signatures for approved display fields, including existing `lbl`/`label`, placeholder, tooltip and accessible text. Keep value bindings unchanged. | One description produces matching Python/JS metadata; a component displays literal source text before translation activation; editing/binding does not collect business data. |
| L4 · Messages and errors | Inventory existing notification, alert, confirmation and validation entry points; type visible arguments; settle the message-template/arguments contract and stable error-code mapping. Do not introduce parallel APIs just for localization. | Title/body/action labels are classified; user values stay separate; one error code maps to the appropriate user-facing message; raw exceptions remain diagnostic data. |
| L5 · Collection and translation | After metadata, provenance and engine decisions: implement collection, catalog lookup/delivery and rendering integration consistently for Python, Node and serverless. Define fallback and language-change behavior explicitly. | Shared fixtures yield the same message meaning across runtimes; missing translations follow the approved policy; required catalogs are present in exports. |
| L6 · Teaching and migration | Add practical examples and Softwell migration notes covering labels, messages with parameters and validation errors; show differences from legacy markers/catalog behavior. | Examples follow release chronology, document only implemented features and include the agreed end-to-end checks. |

L1 supplies L2; L2 supplies the common contract for L3/L4; L5 needs that metadata
and the unresolved catalog/runtime decisions. L3 and L4 can be evaluated for parallel
work after the shared contract is accepted; no agents or parallel tasks are assigned.
Do not ship partial metadata support as a claim of complete localization.

Meanwhile, component design should identify display text versus values/codes and
keep those responsibilities distinct. Do not add provisional runtime markers,
collectors or translation wrappers merely to prepare for this deferred plan.

<a id="gc-240-060"></a>
## 060 · Acceptance scenarios for the future work

These are planned checks, not tests claimed as passing today:

- `name="customer"` remains technical; a typed `label="Customer"` is recognized
  without `!!`, identically in Python and JS. The same applies to an existing `lbl`.
- Positional values, named values and defaults retain the agreed classification;
  aliases/imports do not make the collector depend on parameter spelling.
- The component's JS description produces the same localization qualification in
  its Python signature; a Data-bound customer name is not extracted or translated.
- Routes keeps the marker in exported metadata while preserving ordinary string
  validation and excluding arbitrary RPC input from automatic catalog collection.
- A notification template can reorder arguments in translation without translating
  personal data; alert/confirmation captions and accessible text are covered.
- Validation uses a stable error code and a localized user message without a second
  conflicting native validation policy; logs/tracebacks remain technical output.
- Source language/provenance, missing messages, plural/escaping behavior and target
  language changes satisfy the contracts chosen before L5, including serverless.
