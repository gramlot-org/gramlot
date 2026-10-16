# 240 · Localization decisions

Document ID: **GC-240**. Decision record: **2026-10-16**.
Status: **decisions recorded; deferred, non-priority, non-blocking implementation plan**.
[Concise counterpart](../../docs_llm/future/240-localization-decisions.md).
[Legacy analysis and alternatives](235-localization.md) ·
[Components](205-components.md#gc-205-085) ·
[Naming](../internal/225-naming-and-proxy-conventions.md#gc-225-045) ·
[Current status](../internal/070-work-status.md#gc-070-995).

This document records the owner's localization decisions for future Gramlot work.
Examples explain the agreed meaning; they are not available APIs or working metadata
files. Constitution 11.78 records the architectural direction. No translation engine
has been selected and no runtime implementation is authorized by this document task.

<a id="gc-240-005"></a>
## 005 · Central decision

**The parameter's declared type identifies localizable text.** Application authors
do not repeat a localization marker on every value passed to such a parameter.

The owner proposed the name `intl_str` for this semantic type in Builder and Routes
signatures. `str` continues to mean an ordinary string; it does not acquire implicit
translation behavior. `intl_str` means a string intended for localization, not a
locale identifier, an already translated value or the ECMAScript `Intl` object.
The annotation representation direction is now agreed (§035); its shared library
location is still to be decided.

The prior preference to retain legacy `!!` was refined by the subsequent typed
proposal: **`!!` is unnecessary for values whose parameter is declared `intl_str`.**
This does not approve a second marker path, nor decide how untyped text is marked.

<a id="gc-240-010"></a>
## 010 · Owner evidence and scope

The following statements are the decision evidence from this conversation, in
order. Assistant suggestions are not independent approvals.

| Owner statement | Decision / scope |
| --- | --- |
| "preferisco adeguarmi alla versione moderna se non c'è corrispondfenza il codice legacy dovra essere adattato" | Modern locale/format semantics take priority over incompatible legacy formats; migration must be documented for Softwell (constitution 11.77). |
| "potremmo definire un tipo per le stringhe localizzabili nelle firme dei builder e delle routes. intl_str" | Use signature typing as the localization declaration; the following concrete examples establish the intended distinction. |
| "ma aquesto punto non serve forse nemmeno !!" | Remove the need for a per-value marker on typed localizable parameters, as elaborated by the following collection example. |
| `name = "customer" name_long="Customer" name_plural="Customers"`; "il pimo è str gli altri 2 intl_str" | Technical identifier stays ordinary; user-facing metadata is localizable. SQL illustrates the meaning, not an instruction to modify the DB repository. |
| "il sistema di raccolta ... capire queli sono intl perche in table ho messo name log come intl" | Collection uses the parameter type to recognize an unmarked localizable value. |
| "penso che sia unattributo del package ne suo complesso" | Source language is package context rather than a repeated `[en]` string prefix. |
| "per il db lo spiego al db ... metadata della pagina ... variabile di classe ... tutte le pagine di una folders" | Gramlot pages need page/folder source-language metadata; DB coordination remains with the owner. |
| "pages/_metadata"; "si diciamo che in metadata possiamo mettere tutte le cose che accomunano certe pagine" | `_metadata` is the shared page-folder metadata location, not a localization-only file. |
| "e dovremo anche dure ad esempio che label è intl_str" | Label parameters intended for display must be declared localizable in their signatures. |
| "fai un documento sulle decisioni di localizzazione" | Record these decisions now; no runtime, dependency, DB, publishing or release work requested. |

<a id="gc-240-015"></a>
## 015 · Typed text: the SQL illustration and Gramlot pages

The owner's SQL example distinguishes three parameters:

| Parameter | Type direction | Supplied text | Collection |
| --- | --- | --- | --- |
| `name` | `str` | `customer` | Not a translation message |
| `name_long` | `intl_str` | `Customer` | Localizable message |
| `name_plural` | `intl_str` | `Customers` | Localizable message |

This classifies column metadata, not the business values stored in that column.
A customer's personal name does not become a catalog message. Also, `name_plural`
is a separately supplied label; it does not select a grammatical plural algorithm
or settle runtime count-dependent messages.

The same principle applies to Gramlot Builder parameters. Schematic Python example:

```python
# Future signature; the type's import and implementation are not defined yet.
def example_element(self, label: intl_str, code: str):
    ...

# Intended authoring: no marker is needed on label.
pane.example_element(label="Customer", code="customer")
```

The collector uses `label`'s annotation, not its spelling, to identify `Customer`
as localizable. A parameter named `label` does not magically change type in every
library. The later owner confirmation (§050) extends the scope to titles, placeholders,
tooltips and accessible descriptions; the concrete signature inventory remains
implementation work. Technical identifiers, Data paths and code strings must not
be made localizable merely because they are strings.

The owner included Routes in the signature-based direction. Which route parameters
are localizable must be declared explicitly; this does not make every incoming user
string or every endpoint result a translation message. Return-value handling and
dynamic data are unresolved. No Builder/Routes dependency modification is authorized
by this document request.

<a id="gc-240-020"></a>
## 020 · Source language and shared page metadata

A localizable parameter no longer needs `!!` to identify its purpose. Its source
language also need not be repeated as `[en]`: the language is contextual metadata.
It states the language in which the developer wrote the original text, not the
language in which the current user wants to see it.

For a package's own texts, source language belongs to that package. For Gramlot
pages, the conversation establishes page class metadata and common folder metadata
at **`pages/_metadata`**. The agreed usage is shared defaults, with a page able to
specify its own metadata. The exact metadata key and file representation are open.

Conceptual arrangement (not a file-format example):

```text
pages/
    _metadata       shared defaults, including source language English
    customers.py    uses shared defaults
    orders.py       uses shared defaults
    help.py         may declare a page-specific source language
```

`_metadata` is general: it may contain properties common to those pages. This is
not approval to inherit every Page property indiscriminately. Allowed metadata,
validation, nested-folder lookup, conflicting values, merging and missing/default
behavior must be specified. No `.py`, `.js` or `.json` extension has been chosen.
The format must eventually work coherently for Python, Node and serverless pages.

Shared components and mixins can introduce text from a different package than the
page. The assistant suggested attributing a text to the package that authored it,
but the exact provenance mechanism was not confirmed. Keep it open rather than
silently taking either the caller's locale or the Builder package's locale.

<a id="gc-240-025"></a>
## 025 · What the collector must know

The agreed recognition rule combines:

1. The actual Builder/Routes parameter signature: is the parameter `intl_str`?
2. The original supplied text, e.g. `Customer`.
3. The source-language context from the relevant package or page metadata.

For that example, the semantic input is equivalent to legacy `!![en]Customer`,
without placing marker syntax inside the application value. This equivalence concerns
recognition; it does not adopt legacy flattened keys, XML catalogs or transport-time
translation behavior.

A marker-only scanner is insufficient for this design. It must resolve the actual
signature, including positional arguments/defaults as applicable. The collection
strategy remains open: static language-aware analysis, observation during controlled
construction, or another explicitly chosen path. Earlier discussion of collecting
while constructing a SQL model was a proposal, not a chosen Gramlot implementation.

Decisions still needed include branches not executed during collection, computed
strings, values arriving through Data bindings, texts authored in JavaScript logic,
and concrete placeholder/plural semantics. Template text and variable arguments
are now explicitly separate (§050). Do not collect arbitrary customer or user-provided data
just because it is displayed in a localizable presentation field. The treatment of
those dynamic cases has to be defined before implementation.

<a id="gc-240-030"></a>
## 030 · Separation from rendering and formatting

Signature metadata tells the framework which values are intended for localization;
it does not itself choose when or where translation happens. Whether original text,
message identity and parameters survive in Source/transport is still a contract
question, particularly for changing language without rebuilding the page.

The goal discussed with the owner is consistent behavior in Python and JavaScript.
No choice between gettext, ICU/MessageFormat, Fluent or another engine has been made.
GC-235 remains the evidence and alternatives document, not a list of approved
engines. Do not infer that choosing `intl_str` requires a new custom translation
engine or a compatibility wrapper around several libraries.

Formatting of numbers/dates is separate from message translation. The owner has
chosen modern conventions over incompatible legacy formats (GC-235 §070). The
exact declarative options and parsing semantics remain open. Gramlot validation
continues to own validation rules and can guide native checks (GC-205 §085); error
message identity, the arguments API and localization timing still need a design.

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
