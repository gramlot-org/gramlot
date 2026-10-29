> Current local gallery work: see §170; earlier dated sections retain their stated scope.

# 315 · Database selectors: legacy audit

Document ID: **GC-315**.
[Expanded counterpart](../../docs/future/315-database-selectors.md).

> Current status: the bounded SQLAlchemy/SQLite implementation is approved in [§050](#gc-315-050). Earlier audit sections are historical evidence, not the current implementation boundary.

<a id="gc-315-005"></a>
## 005 · Scope and evidence

Owner 2026-10-18 narrows the next investigation to dbSelect/dbComboBox and requests
the full legacy option inventory. Stores/dataRecord/dataSelection/grid remain
deferred; no API, backend or implementation approval. Genropy-first is still a
proposal. Static inspection only, no database/browser run.

Genropy working tree HEAD fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea and PoC HEAD
10478b57ce3f22e6445eb6b72eba343520cbebac; local modifications may exist. Evidence:
genro_widgets.js BaseCombo/DynamicBaseCombo/dbBaseCombo/BaseSelect/dbComboBox;
gnrstores.js GnrStoreQuery; genro_patch.js multicolumn popup; genro_frm.js
validate_select; Dojo 1.1 ComboBox/FilteringSelect; Python apphandler/db_select.py,
gnrwebstruct/dojo11.py, SQL table caption/query helpers and test dbselect page.
Expanded record supplies paths/line references. PoC September audits cross-checked
against current source and recent condition fixes. Current choice-editor/RPC
reviewed for reuse limits.

<a id="gc-315-010"></a>
## 010 · Two value contracts

dbSelect uses FilteringSelect: value is identity, display is caption. dbComboBox
uses ComboBox: value is text, including free text; selecting writes searchAttr,
normally caption. No automatic DB insertion. alternatePkey does not turn a
ComboBox into a key-valued selector. dbComboBox selected-output hook is installed
for selectedRecord/selected_* but not selectedCaption alone. Null/blank and free-
text output semantics require explicit destination agreement.

<a id="gc-315-015"></a>
## 015 · Dedicated server parameters

Python AST confirms 25 named arguments plus kwargs:
dbtable, columns, auxColumns, hiddenColumns, rowcaption, _id, _querystring,
querystring, ignoreCase, exclude, excludeDraft, condition, limit, alternatePkey,
order_by, selectmethod, applymethod, notnull, weakCondition, _storename, preferred,
emptyLabel, emptyLabel_first, emptyLabel_class, invalidItemCondition.

columns are search fields (default model queryfields/caption), auxColumns are
displayed extras, hiddenColumns returned extras; rowcaption defines caption fields
and mask. condition binds parameters; weakCondition can relax all (boolean) or
only an added soft condition (string). preferred orders/flags rows; invalidItemCondition
flags search candidates. alternatePkey affects lookup identity, exclude still
targets physical keys. limit defaults from application or 10, not paging.
notnull suppresses synthetic null row, does not replace validation. Empty choice
is added only to nonempty searches. _id/_querystring are generated protocol
arguments. _storename routes a Genropy DB store. method (browser) replaces the
service; selectmethod replaces search only; applymethod processes Genropy selection.

<a id="gc-315-020"></a>
## 020 · Browser options and output families

value; table alias; method; condition_*; selectedCaption; selectedRecord (projection
Bag, not full record); selected_<field> (auto hidden projection, optional
`destination=expression`); selectedCb; selectedSetter. Presentation: hasDownArrow,
searchDelay, autoComplete, firstMatchDisabled, auxColumns_template, connectedMenu.
store_id overrides result identity; store_caption has inconsistent downstream
support; store_record is extracted without an observed consumer. switch_<name>
intercepts a prefix regex; _set, _value, _action implement distinct behaviors.
validate_select/error and invalidItem_message are actual validation parameters.
ignorePartition/distinct/subtable, dbstore->temp_dbstore and httpMethod are backend/
transport options. Arbitrary family suffixes are not supported automatically.

<a id="gc-315-025"></a>
## 025 · Inherited controls and integrations

Shared presentation/Source: lbl/lbl_*/box_*, geometry/class/style, disabled/readOnly,
focus/accessibility, datapath/nodeId/parentForm, defaults/blankIsNull, connect_*,
subscribe_*/selfsubscribe_*, speech/shortcuts and event hooks. Common validation
includes required/text rules, remote/callback/severity/messages; DB uniqueness/
existence and grid uniqueness need separate services. Dojo input/validation/query/
label properties are not new backend capabilities. pageSize does not establish
server paging. Local BaseCombo values/storepath/fullTextSearch creation is bypassed
by DynamicBaseCombo, so these are not verified DB options.

field() supplies relation/model defaults, wdg_*/validate_*, selected defaultFrom,
checkpref, routing and zoom navigation. dbenv_*/context_* concern request context;
_hdbselect is a separate component. SQL kwargs accepted downstream are not
automatically forwarded widget parameters; default search discards where.

<a id="gc-315-030"></a>
## 030 · Search, lookup, patches and behavior to preserve deliberately

Actual legacy search: contains first field -> startswith if limit reached ->
word-boundary regex -> ILIKE on concatenated fields. Differs from comments and
agreed Gramlot prefix-then-containment direction. ignoreCase unused by default
handler; dialect parity unproven. Lookup can return caption outside condition with
eligibility error, including logically deleted rows. This never authorizes relaxing
access control. Reactive condition rechecks current key; notnull can auto-select
one candidate; shared ComboBox behavior needs explicit text/key review.

Separate initial highlight (dbSelect), inline completion, blur match and single-
choice selection. Identity cache is fixed 60s, invalidated by changeInTable; related
form captions can avoid lookup. Out-of-focus queries and condition revalidation
use synchronous paths. Reuse current asynchronous Gramlot RPC instead. Popup patch
uses columns/headers/classes/templates, fixed 400px template max-height and disables
_page. Theme/viewport-derived geometry needed.

Caveats: falsy zero identities; alternate-key/exclude mismatch; invalid flag only
in search; actual message invalidItem_message (example uses wrong name); arrow can
set unbounded limit; delay zero replaced by 300; httpMethod precedence bug;
caption alias/hook inconsistencies. These are source findings, not reproduced bugs
or promises of destination compatibility.

<a id="gc-315-035"></a>
## 035 · Illustrative legacy Python syntax

Expanded record includes unexecuted legacy dbSelect with columns/rowcaption,
auxColumns/hiddenColumns, condition_* and selected outputs; dbComboBox returning
text; selected_<field> with `destination=relation_expression`. Model names are
illustrative; snippets are not implemented Gramlot APIs. Free-text commits must
have explicit selected-output clearing semantics.

<a id="gc-315-040"></a>
## 040 · Destination recommendations and decision boundary

Propose shared choice presentation/labelbox/validation and explicit key/text value
policies; reuse RPC/TYTX/lifecycle. Existing callbackSelect string-only contract
must not be silently changed. Constitution §8 keeps advanced capabilities,
explicitly auxColumns, Genropy-specific even with shared internal rendering.
No portable SQL interpreter or implicit backend parity. Reject unsupported needs.

Required future tests: typed keys incl. 0; same-caption records; free text and
selected outputs; dependent conditions/single choice; invalid existing identity;
empty/no-match/error distinctions; hooks; exclusions/alternate key; request races/
Source deletion; keyboard/touch/themes; connection cleanup. Next: agree two-widget
contract/scope and backend. No generic store framework, record/selection loading,
grid, persistence, field()/zoom or dependency work is implicitly authorized.


<a id="gc-315-045"></a>
## 045 · First backend selected: SQLAlchemy with SQLite — 2026-10-18

Owner: “farei con sqlite e sql alchemy cosi vediamo ij versione 'nnon genropy'
fino a che punto si arriva”. The first real database qualification uses SQLite
through SQLAlchemy, without Genropy. This supersedes the Genropy-first proposal
and pending-backend statements above; the selector-only scope remains unchanged.
This choice follows constitution section 8 and does not change capability/product
boundaries or approve every option/default in the preceding contract proposal.

Evaluate the common selector contract with explicit logical-table metadata for
identity, caption and searchable/projected fields. SQLAlchemy reflection alone
cannot choose business captions or which tables/fields may be exposed. Reuse
Gramlot RPC/TYTX and current component lifecycle; do not translate arbitrary
Genropy `$`/`@` expressions or introduce a generic store framework for this trial.

Separate technical capability gaps from features deliberately reserved for
Genropy (explicitly auxColumns). SQLite feasibility does not authorize moving
such features into the common contract. Next contract revision should state
which common/optional features the SQLAlchemy implementation will qualify and
how dependent predicates are configured, before implementation. No database
experiment or new runtime implementation is claimed by this decision record.


<a id="gc-315-050"></a>
## 050 · Approved first implementation — 2026-10-18

Owner: “ok aggiorna il contratto e procedi con dbSelect e dbComboBox su SQLite
con SQLAlchemy, includendo method per endpoint dedicati. aggiungi esempi nella
gallery python e verifica i test”. This supersedes the pending implementation
boundary above. Implement and qualify the common selector path; stores,
dataRecord/dataSelection, Genropy expressions and DB/grid validation remain out.

Both inputs reuse ChoiceEditor, Labelbox, FieldState and the existing data RPC.
`dbSelect` commits a string or safe integer identity (including zero), while
`dbComboBox` commits a caption or free text, never inserting a database record.
Clearing either writes null. Invalid drafts keep the last accepted Data value.

`method` defaults to `dbSelect` and replaces the complete endpoint, including
identity resolution. A dedicated endpoint does not require `dbtable`. Requests
contain exactly one of `_querystring` or `_id`, plus dbtable when supplied,
columns/hiddenColumns/order_by, limit (10), ignoreCase (true), and parameters
from `condition_*` with the prefix removed. These are values, not SQL snippets.
The response is `{rows, identifier, caption}`; rows contain the declared identity,
a string caption and projected fields. Duplicate or invalid identities fail.
The provider registers logical tables and allowed fields on the server; browser
input cannot name an arbitrary SQL table, column or expression.

`searchDelay=300` debounces typing (zero disables the delay); explicit opening
and identity lookup are immediate. New input, dependency changes, value changes
and removal cancel obsolete work. `hasDownArrow=True` controls the opener;
`emptyLabel` supplies the empty-field hint. `autoSelect=False` on dbSelect may
select a sole eligible row when the value is empty. Readonly/disabled fields do
not auto-select. User selection passes the ordinary validation pipeline.

`selectedCaption`, `selectedRecord` and `selected_<field>` name relative Data
output paths. selectedRecord is a Bag of the returned projection, not a full
record fetch. Free text and clearing reset those outputs. Output writes use
ordinary Data notifications; they are not a database transaction. `selectedCb`
is a named Logic callback invoked after an accepted user selection and its output
writes, with value and record. Identity resolution updates outputs without
pretending it is a user selection.

Core `DatabaseSelectors` supplies the default decorated endpoint, delegating to
its configured `database.select`. `SQLAlchemySelect` in gramlot-py-server owns
registered Table metadata, SQL compilation, connections and eligibility filters.
The dedicated Page endpoint can apply additional SQLAlchemy predicates and call
that same provider. No SQLAlchemy import enters core or gramlot-examples.
Python-only database examples are an environment catalog in gramlot-py-server,
composed by the existing gallery --catalog option. They use real SQLite queries,
Source/Data bindings and ordinary Page endpoints.


<a id="gc-315-055"></a>
## 055 · Complete selector review: evidence and scope — 2026-10-28

Owner requests full dbSelect/dbComboBox review against latest legacy changes,
especially auxColumns. Review only: no correction, expanded contract, dependency
edit or dbCombo alias approved. GitHub develop was verified on 2026-10-28 at
`a135c9d949d0b014a22f57c418e83b315f85e7bf`, the 27 October merge of
[PR 1768](https://github.com/genropy/genropy/pull/1768). Feature commit
409143c4d230b858a5ea629e12f5ad756bd16119; styling/test follow-ups 20a5a2c6/623d1a60.
Exact files were downloaded because indexed source and the September local HEAD
were older. Reviewed authoring/endpoint, shared editor/validation/output binding,
provider/gallery, legacy selector/store/server, popup/CSS/formatter and example.
[Evidence](../../ports/PORT-0016-database-selectors/review-2026-10-28/README.md)
retains source hashes, probes and logs. No current full legacy browser/DB run.

<a id="gc-315-060"></a>
## 060 · Confirmed Gramlot defects

- **P1:** obsolete identity lookup completion can restart autoSelect. Clear the
  old key, type a new draft, then resolve the cancelled lookup: databaseChoices'
  continuation after `await super.resolveValue()` queries the sole candidate and
  overwrites the draft. Base request-generation checks do not guard this continuation.
- **P2:** dbComboBox Escape restores accepted text but calls
  `selectionResolved(null)`, clearing the accepted row's caption/field outputs.
- **P2:** failed lookup after an external key change leaves selectedRecord and
  selected fields from the old key. Error UI exists, but Data is inconsistent;
  an explicit unresolved-output policy is needed.
- **P2:** provider uses containment only, contrary to constitution §8's prefix
  then containment direction. Query Ada with limit 1 returns A Ada instead of
  the available Ada. GP-025's substring description is not an amendment; exact
  fallback criteria still need consistent specification.

No fixes. Existing typed keys, normal cancellation/removal, invalid-draft retention,
free-text clearing, filter/validation cancellation, two-row uniqueness probing,
allowlists and literal SQL search checks still pass.

<a id="gc-315-065"></a>
## 065 · Latest legacy auxColumns behavior and caveats

Shared DynamicBaseCombo popup behavior applies to dbSelect/dbComboBox/callbackSelect;
new example uses callbackSelect, not a DB. Default switches from columns on wrapper
horizontal overflow OR table width beyond max(field,min(2*field,30em)).
auxColumns_multiline True forces multiline; False disables it; numeric sets
fieldWidth*ratio threshold (overflow still wins), not fixed width. Template wins.
First display column is bold, falling back to row.caption only when blank; composite
caption need not be the bold line. Other fields use returned headers and omit
null/undefined/empty string, retaining zero/false. Hover uses closest tbody row;
headers align left and columns have separators. SQL/value contracts are unchanged.

Isolated exact-source helper probes confirm:

1. `_multiline` remains true across later narrow results/wider fields; no automatic
   reverse transition. Whether persistence is intended remains a legacy decision.
2. scrollableTable destructively consumes custom class attributes, so automatic
   rerender loses e.g. not_preferred_row. Invalid-item flags are separate.

Static caveats: template/multiline forces 400px max height instead of ordinary
clamp(180px,40vh,400px); deferred reopen/mobile geometry not qualified. Headers and
formatted values enter innerHTML without a plain-text escape guarantee; text
formatter returns unformatted strings unchanged. Preserve Gramlot textContent and
decide template trust explicitly. Numeric ratio lacks positive/finite validation.
Expanded counterpart gives exact source locations. These are not port instructions.

<a id="gc-315-070"></a>
## 070 · Contract comparison and decisions still required

Gramlot `columns` means projected/displayed fields; legacy `columns` means search
fields, auxColumns displayed extras. Gramlot search fields come from registration.
Current flex spans have no header/alignment/multiline/template contract. Unknown
auxColumns options can silently become residual DOM attributes without request or
presentation effect. Explicit unsupported-capability handling requires design.

selected_* only routes returned fields; unlike legacy, it does not request hidden
projection automatically. Current examples correctly declare hiddenColumns.
Enter chooses the first row in both Gramlot widgets; legacy only dbSelect enables
initial highlight. Free-text/Enter/blur policy remains distinct from autoSelect.
Gramlot eligibility lookup may show raw invalid key; legacy recovers captions
outside condition. Never relax authorization to recover presentation. emptyLabel
is a placeholder, not legacy's synthetic null row. Model expressions, alternate
keys, preferred/invalid rows, weakCondition, form/zoom/cache and search-only hooks
remain outside the bounded common port; method still replaces the entire endpoint.

The owner's subsequent correction in [§080](#gc-315-080) settles the product
scope: implement auxColumns, initially only for Kajenn; other backends lack the
capability. The previous proposal to first decide whether to implement/generalize
it is superseded. Syntax may differ from legacy, but no replacement API is yet
selected. Reuse Source/Data/RPC, ChoiceEditor/FieldState and popup geometry;
backend/model integration remains separate. Confirm the concrete syntax, result
metadata and capability signaling before adding new contracts. Existing defect
findings remain valid; their repair is not an owner-imposed prerequisite for
auxColumns design. No new store, transport, SQL parser or compatibility alias is
implied.

<a id="gc-315-075"></a>
## 075 · Verification outcome and limits

46 existing JS choice/database/validation and 3 core Python tests passed. Provider:
14 passed, 1 gallery-construction failure because current examples imports
gramlot.collections.inputs absent from reviewed core. Final run used explicit
checkout paths and SQLAlchemy-equipped interpreter; this is an integration blocker,
not a SQLite query assertion failure. Six Gramlot characterization probes reproduce
browser defects/differences; passing means observed, not repaired. Real in-memory
SQLite confirms containment/projection behavior. Two isolated legacy helper checks
confirm sticky mode/class loss with controlled geometry, not full Dojo interaction.

Review complete for source/controlled-test scope. Current full gallery/browser,
desktop/touch layout, native popup geometry, screen readers, legacy DB and owner
visual acceptance remain unverified. No correction, new approval, release or
deployment. PORT-0016 needs corrections before renewed acceptance; historical
18 October qualification remains recorded.


<a id="gc-315-080"></a>
## 080 · Owner correction: implement auxColumns for Kajenn — 2026-10-28

Owner explicitly requires auxColumns implementation, potentially with different
syntax, and limits current capability availability to the Kajenn backend. Other
backends do not have this capability. This resolves the implementation direction;
it is not necessary to ask again whether the feature belongs in the product.
Constitution amendment 11.93 records the exact confirming message.

Approved scope is the feature and initial backend, not a particular new spelling,
metadata schema or general capability-negotiation protocol. Do not claim support
for SQLAlchemy/SQLite or emulate the missing capability there. Existing common
selector behavior and the separation of hosting, database service and browser
rendering remain in force.

Current-source inspection: gramlot-py-server/db contains the SQLAlchemy provider;
the Kajenn adapter currently advertises auth, with no implemented auxColumns
provider/service in that integration. This is a concrete implementation gap to
close, not a reason to exclude the feature or claim it already works. Next design
work must specify Python authoring, backend result metadata and unsupported-backend
behavior using existing mechanisms. Runtime implementation has not started in this
scope-correction step; the earlier source hashes and tests describe the review.


<a id="gc-315-085"></a>
## 085 · Legacy server algorithm and Kajenn with Asqueel — 2026-10-28

Owner points out that legacy dbSelect had a sophisticated server method which
Kajenn can implement using Asqueel. The review must therefore start from that
service's responsibilities, not reduce auxColumns to a frontend parameter or a
static projection. The preceding syntax question remains unanswered and is not
an approved API; no dependency source edits are authorized.

The reference is DbSelectMixin.dbSelect plus dbSelect_default. Its server work
covers model-derived search/caption fields; distinct visible/hidden projections;
identity and alternate-key lookup; eligibility and recovery of display captions;
progressive search; weak conditions; preferred/invalid rows; exclusion/draft/store
policies; search/postprocessing hooks; localized headers and result metadata.
These are capabilities to map explicitly, not a promise to copy every historical
behavior or override existing authorization/search contracts.

Static inspection of local asqueel/asqueel (HEAD 3d75440, exact working-source
hashes in the port evidence) establishes:

| Responsibility | Available primitive or concrete gap |
| --- | --- |
| Query model fields, relations and formulas | Asqueel query/compiler provides projections, model references, relationship traversal, formula columns, bound parameters, order/limit and fetch terminals. |
| Row policies and request lifecycle | Draft/logical-deletion/partition read policies and per-call SessionDb exist; Kajenn owns its database/request integration. No selector-specific integration has yet been qualified. |
| Model presentation metadata | Table declarations accept caption_field, rowcaption and labels; column metadata exists. Declaring metadata does not imply the complete legacy caption service works. |
| Caption helpers | DbTableObj.rowcaption currently raises the explicit missing-feature error. No public rowcaptionDecode/getQueryFields/opTranslate definitions were found in this inspected source. |
| Legacy result conversion | Query.selection() explicitly raises UnsupportedFeatureError. Current fetch/NamedList and fetchAsBag do not establish parity with legacy selection.output('selection', caption=...) or colAttrs. |
| Search strategy, fallback and selector result metadata | Service logic still needs an explicit Kajenn implementation using the supported model/query contract; it is not supplied merely by choosing Asqueel. |

Asqueel's internal col_to_as helper is evidence of alias compilation, not an
approved public replacement for a missing table API. Missing model/library
capabilities must be specified and resolved in their owning library, not hidden
behind Gramlot/Kajenn compatibility fallbacks. Likewise, a new result contract
must be designed explicitly rather than emulating the legacy Selection object.

The intended comparison is therefore: legacy selector service → Kajenn selector
service using Asqueel → Gramlot presentation. Initial availability remains Kajenn
only, as already decided. Precise service capabilities, model prerequisites and
result semantics precede the final Python spelling. This is a source-based
feasibility map; no Asqueel/legacy DB tests, new runtime API, full parity or
implementation completion is claimed.


<a id="gc-315-090"></a>
## 090 · Owner-selected boundary: Kajenn + Asqueel, engine owned by Asqueel — 2026-10-28

Owner rejects the proposed PostgreSQL-first target and subsequent per-engine
rollout: “basta keajenn e asqueel . poi lui gestisce se postgres o altro”.
The selector service targets Kajenn + Asqueel; Asqueel handles PostgreSQL or
another supported underlying database. Constitution 11.94 records this boundary.

The proposed plan therefore has one integration path: define the advanced server
contract against legacy behavior; verify/resolve Asqueel prerequisites in their
owning project; implement the Kajenn service; connect the Gramlot selector and
auxColumns presentation; qualify the complete Kajenn/Asqueel integration.
Do not add engine dispatch, SQL-dialect branches or separate engine-specific
selector variants to Gramlot/Kajenn. Database-specific implementation and engine
qualification belong to Asqueel. Integration tests must still verify the real
service and report concrete capability gaps without claiming universal DB parity.

The existing SQLAlchemy provider is distinct from using SQLite through Asqueel;
its limited feature set does not restrict Asqueel's engine choice. Initial
auxColumns availability remains Kajenn + Asqueel. This settles the target and
ownership, not every API or the complete implementation plan. No further target
confirmation is needed. Remaining contract decisions should be addressed one at
a time; the previous Python syntax question remains unanswered.


<a id="gc-315-095"></a>
## 095 · Isolated implementation progress — 2026-10-28

Owner authorized implementation in a separate worktree; constitution 11.95
records the bounded connected Asqueel work. Core, gramlot-py-server and Asqueel
have isolated worktrees under the same task directory. The original working
checkouts remain intact. This section supersedes earlier no-runtime-work
statements for this implementation step, without rewriting the review evidence.

Implemented and verified in core:

- A cancelled identity lookup cannot resume into autoSelect over a newer draft.
- Escape in dbComboBox restores accepted text without clearing accepted selected
  outputs or notifying the selection callback again.
- A current failed identity lookup clears obsolete outputs; a stale failure cannot
  clear a newer successful selection.

Three regression cases were added. The focused choice/database/validation suite
passed 49 tests, the full JavaScript suite passed 3,716, and three core Python
authoring tests passed. Component resources were rebuilt with refreshed first-party
dependencies and without a lockfile. The SQLAlchemy prefix defect remains outside
this Kajenn/Asqueel implementation scope.

Asqueel prerequisites now implemented in its isolated worktree: operational
rowcaption precedence; model-field caption decoding/rendering; declared
queryfields; a public compiler-alias helper; literal prefix/containment predicates
whose SQL belongs to Asqueel adapters. Caption formatting is textual, not implicit
locale formatting. No legacy Selection emulation was added. Contrary to a broader
initial gap assumption, CompiledQuery.columns already provides result names,
dtypes and source paths. Those existing metadata are the intended service input;
model labels remain accessible through the model.

Verification: 33 focused Asqueel tests initially passed. The non-PostgreSQL-marked
suite reported 4,168 passed, 53 skipped, 1,419 deselected, 11 expected failures and
two generated-grammar-document failures. Regenerating the grammar resolved both;
the final focused run passed 22 tests, including eight additional compile-only
search cases across PostgreSQL, SQLite, MySQL and SQL Server. New search execution
is verified on SQLite. This is not a claim of live qualification on all engines.

Remaining, not implemented or accepted: Kajenn advanced selector service, auxColumns
rendering, capability rejection and integrated browser/RPC qualification. The
concrete authoring proposal awaiting owner response is
auxColumns="field1,field2" with auxColumns_multiline="auto" | true | false,
server column metadata and explicit unsupported-backend errors. No response to the
proposal is recorded here; implementation authorization is not recorded as approval
of its exact spelling. Subsequent service work must specify result metadata and
capability signaling, retain server-owned allowlists/conditions and authorization,
reuse existing RPC/lifecycle mechanisms and keep all database-specific SQL in
Asqueel. No source release, deployment or renewed port acceptance occurred.

<a id="gc-315-100"></a>
## 100 · Owner selects an upstream issue and HTML template — 2026-10-28

The owner's explicit answers are “fai unnissue” for Asqueel prerequisites and
“metterei template e un template html in cui mettere le colonne” for presentation.
Constitution 11.96 corrects the earlier overbroad authorization interpretation in
11.95. The direct-Asqueel-implementation statements in §095 are a historical record
of exploration, not accepted or currently active dependency work.

Opened [Asqueel #63](https://github.com/asqueel-org/asqueel/issues/63) with concrete
caption/queryfields gaps, existing CompiledQuery.columns metadata, the required
public model-to-record mapping, portable bound literal search and acceptance
criteria. Removed this task's exploratory edits from the isolated Asqueel worktree
after preserving them in the port evidence as asqueel-exploratory-unaccepted.patch.
The original Asqueel checkout remains untouched. Prior exploration test counts do
not qualify a shipped or active dependency implementation.

The chosen parameter is template and its content is HTML containing record-column
values. The auxColumns_multiline proposal is withdrawn. Proposed example:
template="<b>{name}</b><br>{city}". The record placeholder spelling is still awaiting
owner confirmation; it does not inherit Source-attribute lookup semantics merely
because GC-225 §055 uses braces. Reuse the established HTML sanitization dependency,
keep record values as text and retain the ordinary selected caption/value contract.
No new template engine or placeholder alias has been implemented.

Core lifecycle repairs remain implemented and verified. Remaining work: settle the
record placeholder grammar and advanced result/capability contract, implement
presentation independently against core fixtures, consume supported Asqueel APIs
once the upstream gap is resolved, then qualify Kajenn RPC/browser behavior.

<a id="gc-315-105"></a>
## 105 · Confirmed HTML template implemented — 2026-10-28

Owner answered “Confermo {nome}” to the concrete record-placeholder proposal.
Constitution 11.97 and GC-225 record the decision, superseding the pending
placeholder statements in §100. Both dbSelect and dbComboBox now declare the
read-bound template parameter in the shared inputs collection and Python grammar.

Example inside an ordinary Python page using an existing selector endpoint:

```python
pane.dbSelect(
    value="^.customer",
    dbtable="customers",
    hiddenColumns="city",
    template="<b>{name}</b><br>{city}",
    selectedCaption=".customer_caption",
)
```

This assumes the endpoint already returns id/caption and the name/city fields.
It illustrates shared presentation, not the unfinished Kajenn advanced service.

Behavior:

- HTML defines the result row; {name} reads an own field of that row's record.
  Slots occur in HTML text, not attributes. Field names use letters, digits and
  underscores; relation fields must use the returned projection alias.
- Missing columns produce a visible request error. NULL renders as empty text;
  zero and false remain visible. Values are inserted as text after sanitizing
  authored markup, never parsed as HTML or recursively expanded as templates.
- Existing DOMPurify is reused. Executable markup, nested interactive controls,
  identifiers, roles and focus attributes are removed from result content.
- The template replaces the default result-row presentation. Clearing a bound
  template to null restores caption/columns rendering. Changes cancel stale
  requests through the existing choice generation mechanism.
- Selection still commits the typed key for dbSelect or the ordinary caption for
  dbComboBox. selected_* outputs and selectedCaption keep their existing meaning;
  a nested template element can be clicked to select its row.
- template is a presentation parameter and is not transmitted as a database query.
  Fields must already be projected by the service, for example via hiddenColumns;
  there is no inferred SQL projection or consumer replacement for Asqueel APIs.

Verification: six new JavaScript tests cover both widgets, nested click selection,
literal hostile-looking field values, zero/false/null, missing fields, reactive
template changes and attribute-placeholder rejection. The focused choice/database
suite passed 27 tests. The full JavaScript run passed 3,719 of 3,722 tests; the three
remaining conformance tests were blocked by loopback socket permissions, then all
three passed when rerun with that permission. Four Python authoring/validation
tests passed. Runtime bundles and Python grammar were regenerated successfully.
No new real-browser visual/screen-reader qualification was run.

Implemented and verified: shared HTML template rendering and the earlier lifecycle
repairs. Not implemented/accepted: the Kajenn advanced service, auxColumns model
metadata/capability contract and integrated qualification. Asqueel #63 remains the
upstream request; this task does not edit that dependency or claim advanced backend
availability merely because shared template rendering is now available.

<a id="gc-315-110"></a>
## 110 · Consolidated coverage map — 2026-10-28

Owner requests a durable complete analysis and a proposal covering the main use
cases. The expanded counterpart has the row-by-row matrix; §§005–030 preserve the
detailed inventory. “Complete” covers the selector inheritance chain, store/popup,
25 service arguments and model/form integration, not runtime certification of all
Dojo attributes, application kwargs or databases. Latest downloaded browser/service
evidence: a135c9d949d0b014a22f57c418e83b315f85e7bf, 2026-10-27; model/authoring evidence
in §005 is older and must not be relabeled as latest.

| Legacy arguments | Current coverage and proposed disposition |
| --- | --- |
| dbtable, _id, _querystring | Basic table/search/typed-key requests exist; extend through authorized Kajenn model selections. Zero keys stay valid. |
| columns | Current projection/display, unlike legacy search fields. Recommend preserving meaning; use trusted model queryfields for search. |
| auxColumns, rowcaption | Advanced model projection/metadata and captions missing; first-package work after upstream readiness. |
| hiddenColumns | Explicit projection exists; add authorized union of selected/template requirements. |
| querystring | Omit the second text-request alias. |
| ignoreCase | Parameter exists; require actual Asqueel case behavior, not the legacy ignored flag. |
| exclude, alternatePkey | Dedicated semantics missing (basic provider has a configured identifier); propose one active identity domain for both. |
| excludeDraft, _storename | Trusted server read/routing policies; no browser database-routing API. |
| condition, weakCondition | condition_* values exist; add server hard/soft eligibility. Authorization is never relaxed. |
| limit, order_by | Basic positive limit/ordering exist; add server maximum, stable identity tie-breaker. |
| selectmethod, applymethod | Whole-method override exists; use dedicated endpoints first, defer separate public hook options. |
| notnull, emptyLabel | Validation exists, emptyLabel is currently a placeholder. Propose real optional null choice with separate placeholder. |
| emptyLabel_first, emptyLabel_class | Defer ordering/style knobs; propose a single first placement and ordinary theme mechanisms. |
| preferred, invalidItemCondition | Missing; first-package ranking and ineligible-candidate reason/commit prevention. |

Browser/inherited surface: value/key/free-text, selectedCaption/Record/selected_*
and selectedCb exist, but selected-field auto-projection does not. selectedRecord
is a projection. Keep returned aliases; defer selected_* expression syntax and
grid selectedSetter. hasDownArrow/searchDelay/readonly/disabled exist with intentional
differences from legacy. autoSelect needs qualification independent of highlight,
autoComplete and blur matching. template HTML with {name} is confirmed/implemented,
replacing proposed legacy auxColumns_template/multiline adoption.

Defer connectedMenu, store_* aliases, switch_* commands, 60-second identity cache
and form-caption reuse. No working store_record consumer was found in the legacy
chain. Existing validation/presentation stays shared. ignorePartition/distinct/
subtable require trusted supported Asqueel semantics; dbstore/dbenv_*/tenant/httpMethod
remain host responsibilities. Dojo pageSize does not establish server pagination.
field()/defaultFrom/wdg_*/checkpref*, zoom, grid and _hdbselect remain separate
integrations, recorded rather than silently included.

<a id="gc-315-115"></a>
## 115 · Proposed first package: cover normal database selection end to end

**Unapproved proposal.** Cover related-record selection and text suggestions with:

1. Shared control contract: implemented template/repairs, explicit Enter/blur rules,
   automatic requested projection, optional null choice separate from placeholder.
2. Kajenn + Asqueel service: model captions/search fields, typed/alternate identity,
   visible/hidden metadata, literal prefix then containment, stable order and limits.
3. Practical policies: exclusions, hard/soft filters, preferred/invalid rows,
   dependent-value revalidation and model draft/deletion/partition rules.
4. Python Source → Kajenn RPC → real Asqueel → browser qualification.

Reuse dedicated endpoints for customization. Cache, switches, menu, grid, zoom,
model-driven form authoring and a generic hook framework are deferred. Confirmed
target/template decisions and implemented core work do not approve this new scope.

<a id="gc-315-120"></a>
## 120 · Concrete recommended behavior, still proposed

Preserve columns as current projection/display; search uses trusted queryfields/
service configuration. Recommend rejecting simultaneous columns and auxColumns
rather than creating backend-dependent meanings or merging two display definitions.
auxColumns provides advanced model-derived display metadata. This rule is not
implemented. Projection unions identity/caption, visible/hidden, selected_* and
template fields, subject to server authorization and explicit result aliases.

Prefix search returns its eligible results; containment runs only if prefix yields
none, with the same hard filters/limit. If needed, soft-condition relaxation repeats
this sequence. Never relax authorization or model read policies. Preferred ranking
stays within a stage. No regex/fuzzy/full-text or containment top-up in this proposal.

dbSelect retains first-result highlight; Enter chooses active candidate, blur
requires an exact unambiguous eligible match. dbComboBox should preserve typed text
on Enter/blur unless the user navigated to/clicked a suggestion. Equal captions must
not guess identities. Later free text clears record outputs. Optional dbSelect
gets a genuine null choice before candidates; emptyLabel labels it and placeholder
remains the control hint. Required validation owns whether null can commit.
A current ineligible key may retain readable caption with invalid status; missing
and unauthorized records remain distinct, without authorization relaxation.

Reuse rows/identifier/caption where possible. Advanced metadata needs field keys,
labels, supported dtype/format, candidate eligibility/reason and preferred state,
plus missing-versus-ineligible lookup outcomes. Exact response names and bounded
service-availability signaling remain undecided. Unsupported options must not be
silently ignored. No global capability framework, client SQL or dependency workaround
is implied.

<a id="gc-315-125"></a>
## 125 · Execution order and acceptance gates for the proposal

1. Approve scope, then settle each contract decision and naming before code.
2. Implement shared control behavior against core-owned fixtures.
3. Review supported APIs landing through Asqueel #63; local exploratory patch is
   not a usable/accepted dependency. Step 2 can proceed independently once decided.
4. Implement Kajenn service against actual upstream APIs and real query tests.
5. Qualify Python-authored pages through RPC and browser interaction.

Acceptance includes prefix precedence at limit 1; literal wildcards/quotes; case;
zero and alternate keys; exclusion identity domain; equal captions; soft retry
preserving authorization; invalid rows blocked on click/Enter/blur; changed filters;
missing/ineligible current keys; null/free-text output clearing; literal template
injection; cancellation, failures, removal and connection cleanup; narrow viewports,
long templates, touch/keyboard and accessibility.

Existing §105 evidence is 3,722 JS tests across full run/conformance rerun, four
Python tests and a successful build. It does not verify this proposed service or
all engines. Core tests stay adapter-independent; Asqueel owns engine qualification.
The separate SQLAlchemy prefix defect remains open.

<a id="gc-315-130"></a>
## 130 · Open decisions and maintenance checklist

Next decision: first-package scope in §115. Then settle columns/auxColumns and
automatic projection; combo Enter/blur; null choice/placeholder; prefix/soft retry;
identity/exclusions; advanced metadata and bounded capability signaling, one at a
time. Do not re-ask confirmed target, engine ownership, upstream-issue direction,
HTML template or {name} syntax.

GC-070 and PORT-0016 link this current analysis. Update matrices and checks after
each increment, distinguish implementation/verification/owner acceptance, and retain
dated evidence/rejections. This request authorizes documentation/proposal only, not
new feature code, dependency edits or publication.
<a id="gc-315-135"></a>
## 135 · First-package implementation checkpoint — 2026-10-28

Owner asks “puoi provare in un suo worktree a 9imlementare ?” after the consolidated
proposal. Constitution 11.98 records implementation authorization. Work is isolated
in the database-selector-package worktree, starting from the verified template/
analysis snapshot. The previous selector worktree and original checkouts are
preserved. The scope question in §130 is settled by this instruction.

Implemented shared-control portion:

- hiddenColumns automatically includes the union of explicit hidden fields,
  selected_* output requirements and template record slots. Search and identity
  lookup use the same requested projection. Duplicate field requests are removed;
  missing requested fields produce an error. The server remains responsible for
  authorizing the projection. No guessed aliases or SQL-expression parsing.
- dbComboBox does not highlight a suggestion simply because text was typed.
  Enter and blur preserve free text, including an exact caption with no explicit
  record choice. Arrow navigation/click selects a suggestion and its projection.
  Native change followed by blur does not first commit the partial draft.
- dbSelect retains candidate highlight and typed-key selection. An exact ambiguous
  caption is rejected on blur; an explicitly chosen same-caption row keeps its
  identity.
- Optional dbSelect displays a real null choice before candidates, with emptyLabel
  (default “Clear selection”) as its label. The placeholder parameter remains the
  input hint. Required controls omit the null choice and validation refuses a clear.
  A null choice is local presentation, never a synthetic server record/key; it does
  not participate in the autoSelect candidate count.
- Clearing removes selected outputs and does not restart autoSelect. Changing
  selected-field requirements, required state or emptyLabel invalidates pending
  presentation through the existing lifecycle. Shared local choice controls retain
  their prior policy through subclass hooks.

Current backend prerequisite: Asqueel #63 is OPEN with no implementing response at
the start of this checkpoint. Its requested caption/search/mapping APIs are not
available in the inspected source. Per owner instruction, no direct Asqueel edits,
consumer substitutes or speculative Kajenn implementation were made. The advanced
service, model auxColumns metadata, server eligibility/preferred/exclusion policies
and end-to-end Kajenn qualification remain incomplete. Advanced response names and
capability signaling also need their concrete contract.

Verification: 62 focused JavaScript tests, the full 3,729-test JavaScript suite and
four Python authoring tests pass. Build/grammar regeneration succeeds. A Python
Source fixture and real-browser verification script cover the shared control with
a controlled service; this fixture is explicitly not a Kajenn/database integration.
Chromium and WebKit both pass native Enter/blur, typed-zero selection, projected
outputs, null/required choices, touch selection and 390px viewport containment
with a long template value. Browser binaries were installed in a temporary test
directory; the fixture uses neither Kajenn nor a real database. Screen-reader
interaction and the advanced service remain unqualified.

This checkpoint completes the independently implementable shared-control work,
not the entire package. Earlier §110–130 tables are the pre-implementation analysis;
the current statuses above supersede their “missing automatic projection”, “emptyLabel
as placeholder” and undecided combo-interaction entries. No acceptance or release
is implied by passing tests.
<a id="gc-315-140"></a>
## 140 · Owner rejects the visual result — 2026-10-28

Owner: “comunque ricorda che giudico anche l'effetto grafico : cosi brutto in ogni
caso non va”. Visual quality is an acceptance requirement alongside functionality,
not an optional polish step. The manually presented stress-test fixture is rejected
as a usable visual demonstration. Passing unit/browser geometry checks does not
constitute visual acceptance or complete the control's user experience.

The shown fixture used repeated long text and a bold-name/two-line template. Those
were test choices, not an approved product appearance. The screenshot also shows
Grace as the accepted value while Ada is highlighted on reopening; the proposed
correction is to distinguish reopening the current selection from a new search.
That interaction proposal is not recorded as an already implemented repair.

Before the next owner trial, prepare a coherent visual presentation with realistic
data, readable density and spacing, intentional popup dimensions and clear visual
distinctions between accepted value, active candidate and search matches. Keep
stress cases available separately. Use established Gramlot themes and component
ownership; do not invent a new visual identity from this feedback. Inspect the
actual rendered result before presenting it, and obtain owner visual acceptance.
The general criterion is confirmed; a specific redesign has not been selected.

<a id="gc-315-145"></a>
## 145 · Visual correction and reopening behavior — 2026-10-28

Owner: “coraggio vai”, following the status proposing the visual correction and
current-selection reopening fix. This authorizes that bounded implementation;
it does not constitute acceptance of the resulting appearance.

Implemented in the dedicated package worktree:
- Reopening a constrained choice without a new draft highlights its accepted key,
  including zero. If that key is absent from the returned window, no different
  candidate is highlighted. A new search retains the existing search policy.
- Shared popup typography uses the existing field-size token, readable line height,
  roomier option padding and existing corner/color tokens. The default height cap
  is 20rem, still bounded by available viewport space. The optional null row has
  secondary text and a separator; no new public parameter or theme is introduced.
- The Python Source qualification page loads gramlot-base and uses realistic
  customers, including two Mario Rossi records distinguished by city. Its HTML
  template shows a normal-weight name and a smaller secondary city. Bold was an
  authored fixture choice, not intrinsic selector behavior or search highlighting.
  Repeated long city text is isolated behind the harness's `?stress=1` test URL.

Verification: 64 focused JS tests and all 3,731 full-suite JS tests pass; four
Python authoring tests pass; build and grammar generation succeed. The added
regressions cover reopening, zero keys, new searches and a selected key absent
from the candidate window. In-app browser inspection verifies the themed result,
reopening Grazia Conti with the correct active row, clearing its city, free-text
Enter/Tab, choosing the Firenze homonym and required-menu omission of the null
row. The long-text case remains contained. Desktop and narrow stacked layouts
were visually inspected; the screenshot records the latter in the browser's dark
color scheme. These are current in-app checks, not a new Chromium/WebKit matrix
run. The earlier matrix evidence remains dated in §135.

The controlled service is a core test fixture, not Kajenn or an actual database.
Owner visual acceptance remains pending. The advanced backend and response/
capability contract remain outstanding as in §135; no Asqueel edit is authorized.

<a id="gc-315-150"></a>
## 150 · Search audit after the missing “b” result — 2026-10-28

Owner reports that typing “b” finds nothing and requests checking the server
algorithm. The active browser fixture only used startsWith on its full name field:
“Elena Bianchi” was therefore omitted. This was an incomplete controlled-service
fixture, not evidence of Kajenn behavior. The earlier visual check did not qualify
search parity.

Reinspection of local Genropy `gnrpy/gnr/web/gnrwebpage_proxy/apphandler/db_select.py`
(SHA-256 f6c398aaedc31337c36049db0cde7f140df0722b1327292ac4434092d5c87d7c)
confirms the actual dbSelect_default body at lines 327–352:
1. Tokenize input and search contains on the first configured query field.
2. If the result reaches the limit (or 50 when absent), replace it with startswith.
3. If empty, require every token at a word boundary over concatenated query fields.
4. If still empty, require every token through ILIKE containment over those fields.
The class-level description has a different order; the executable body is the
reference. Explicit query fields/model queryfields/caption fields determine the
search projection; template and auxiliary display fields do not automatically
become searchable. Every search stage retains the condition and exclusion logic.
Outer dbSelect also handles boundary stars, numeric text and weak conditions.
This is source inspection, not execution against a legacy database.

Corrected only the controlled fixture to honor the already recorded first-package
prefix-then-containment policy, with a limit, on its declared name field. It does
not emulate regex/multi-field legacy search or implement the advanced service.
Current in-app checks: “b” finds Elena Bianchi; Enter selects it and projects Trento;
“a” returns Ada Rossi without mixing in other containment matches. Added the “b”
regression to the browser qualification script and checked script syntax. No fresh
full-suite or Chromium/WebKit matrix run is claimed for this fixture-only change.
Kajenn/Asqueel implementation and qualification remain outstanding.

<a id="gc-315-155"></a>
## 155 · Next owner trial must use the real service — 2026-10-28

Owner: “ma a che punto siamo con il servizio vero kajenn e asqueel? non vorrei
continuare a provare una simulazione”. GC-070 §1805 records a fresh upstream/source
check. Asqueel #63 remains OPEN without comments; the requested APIs remain absent
from the inspected checkout. The Kajenn hosting/RPC adapter exists, but the planned
Asqueel selector service does not. The next owner-facing trial must connect the
actual stack to a database; controlled fixtures remain internal test evidence.
This priority does not authorize editing Asqueel against the prior issue-only
instruction or inventing replacement APIs in Kajenn. Integration remains unfinished.

<a id="gc-315-160"></a>
## 160 · First real Kajenn/Asqueel service — 2026-10-28

Owner: “si ma per ora puoi usare comunque il db e mettere adattamenti in kajenn
gramlot”. Constitution 11.99 records this bounded exception to the previous
consumer-adaptation prohibition. The upstream issue is no longer a blanket blocker
for an explicitly configured service.

Implemented in the dedicated sibling gramlot-py-server worktree: AsqueelSelect
uses actual AsqueelDb sessions and model queries, with trusted registration of
identity, caption, search fields, exposed fields, ordering, filters and fixed hard
eligibility. Search runs literal prefix then containment only when empty. The same
filters apply to identity lookup. Named model formula captions are tested. Browser
SQL and unexposed fields are rejected. Values remain bound; result projection uses
explicit public field aliases and the existing rows/identifier/caption response.
No per-database branch, dependency source modification or alternate client service
is introduced. The browser still uses the ordinary DatabaseSelectors.dbSelect RPC.

The Python page is hosted by Kajenn and searches an isolated real SQLite file
created/seeded through Asqueel. It uses the approved HTML template and existing
Gramlot theme. It is an illustrative database, not a simulation and not a user's
production database. The file is discarded at process exit.

Verification: 24 real database/provider/Kajenn RPC cases pass, including root and
/py mounts, data changes, zero keys, case-sensitive/insensitive literal search,
NULL and eligibility filters, exposed fields, formula captions, session exit and
page ownership. Together with catalog/staging tests, 33 tests pass. In-app browser
checks confirm “b” returns Elena Bianchi/Trento, reopening keeps the selected row,
null selection clears outputs and dbComboBox Enter/Tab retains free text.
The previously passing core tests remain dated evidence; no core runtime change
was needed for this increment.

The adapter starts from its primary HEAD 285f031, excluding unrelated pending
collection-resource changes from the earlier e7dce5d snapshot. The latter requires
core APIs absent from this selector baseline. A fresh environment uses the core
worktree and current upstream Asqueel; no first-party version pin/downgrade was
introduced. Automatic review refused cleaning the earlier worktree, so it remains
untouched after that rejection and contains the earlier provider draft/setup.

Remaining: automatic legacy model captions/queryfields and aux metadata, richer
search/policy semantics, other-engine execution and production-size performance.
Case folding follows each database's LOWER semantics. The general gallery index
has an independent core/examples mismatch; its test is not reported as passed.
The standalone real selector page and its mounted RPC are verified without that
index. Asqueel #63 remains relevant for full model capabilities, not a blocker to
this implemented explicit path. Owner acceptance is still pending.

<a id="gc-315-165"></a>
## 165 · Complete physical PostgreSQL model and customer qualification — 2026-10-29

The existing PostgreSQL test_invoice_pg is now qualified under constitution
11.100's read-only authorization. The dedicated adapter folder
`examples/test_invoice_pg` contains all 76 physical table models (808 columns),
59 foreign keys and 18 unique constraints. The full catalog retains all indexes;
247 equivalent ordinary index names map to 301 distinct model declarations.
No database data/schema writes or dependency source edits were performed.

Asqueel builds every table and executes all physical-column projections with a
false predicate. Customer qualification covers 20 physical and 19 virtual fields,
both individually and together in one SELECT. The local customer_score formula
preserves the original Python rule (10 plus 5 for nonempty email) because the
current runtime does not execute pyColumn. Other tables have physical coverage,
not their full application virtuals/methods. 3,200 customers are eligible.

The real provider passes PostgreSQL search, key lookup and unexposed-field rejection.
In-app dbSelect search for b and selected detail outputs pass; dbComboBox retains
free text on Enter/Tab and accepts an explicit suggestion. All connections enforce
read-only mode. The local page is served by examples/test_invoice_pg/serve.py;
verification.json stores statuses without row data. No production-size benchmark,
full legacy parity or owner visual acceptance is claimed. Upstream metadata and
advanced selection policies remain open; the unrelated common gallery issue is
unchanged. This completes the requested read-only model/selector trial scope.

Final checks: 33 provider/catalog tests pass; the adapter documentation checker
and both Sphinx builds pass. All local model Python files parse successfully.
These regression tests use isolated SQLite fixtures, not test_invoice_pg writes.


<a id="gc-315-170"></a>
## 170 · Separate Base and Application galleries — 2026-10-29

Constitution 11.101 records the owner's assignment. The previously approved selector package is recovered on current develop without introducing a new frontend contract. Base now uses one page in gramlot-examples with explicit physical Asqueel, SQLAlchemy and Django models in the Python integration and three dedicated PostgreSQL copies; every source row is retained. Application owns the recovered Invoice page in examples and the complete model in its Asqueel integration. Source connections remain read-only. GP-035 and GE-015 contain the reproducible commands, model specification and verification limits. GC-070 §2440 records integration evidence. No publication or owner visual acceptance is claimed.


<a id="gc-315-175"></a>
## 175 · Direct auxiliary relation projection — 2026-10-29

> **Historical record:** the per-field Asqueel registration restriction and its completion claim were corrected by constitution 11.104 and GC-315 §180. Earlier tests do not constitute owner acceptance of that restriction.

Owner instruction and scope: constitution 11.103. `dbSelect(auxColumns='@state.name')` and dbComboBox now forward the request to their configured provider. Asqueel registration exposes the relation path in its existing `columns` allowlist; it validates the path with `table.column`, compiles the projection and uses `CompiledQuery.columns` for returned keys. No model aliasColumn, private-library helper, guessed alias conversion or per-row query is needed. The Base customer model no longer defines state_name. Registered many-to-one paths can be concatenated, e.g. `@state.@country.name`; unsupported/unexposed paths and native alias collisions fail explicitly.

The existing envelope remains `{rows, identifier, caption}`. When auxColumns is supplied, `columns` and `headers` are ordered JSON arrays containing the caption and requested visible fields with matching labels. These reuse the legacy names in the current JSON protocol. Auxiliary fields do not add search fields. Current `columns` display semantics are retained; visible fields are deduplicated in caption/columns/auxColumns order. Hidden fields stay hidden. Asqueel labels use native name_short, then name_long, then the model column name. Empty results still carry metadata. Simple registered fields are also available as auxiliary projections through the existing SQLAlchemy and Django providers; those providers do not accept Asqueel relation syntax.

The browser requires the display metadata and projected values when auxColumns is requested, so an unsupported endpoint cannot silently ignore it. Default presentation uses aligned, labelled cells with wrapping inside each option; optional null choice keeps its existing presentation and keyboard behavior. An explicit HTML template retains precedence. Labels and values are rendered as text. Template/selected-field projections use returned field keys: `@state.name` is returned by Asqueel as `_state_name`, therefore `selected__state_name='.state_name'` copies it to Data without defining a model alias.

```python
pane.dbSelect(dbtable='customers', value='^.customer_id',
              auxColumns='@state.name',
              selected__state_name='.state_name')
```

The provider must expose `@state.name` in trusted registration; the browser cannot authorize arbitrary database fields. Base shares one page with runner-supplied selector parameters; its Asqueel host uses the direct path and SQLAlchemy/Django use their existing state_name projections. Application explicitly uses `auxColumns='@state.name'` with its template. The full Application model retains its pre-existing aliases for other consumers; this selector no longer depends on its state_name alias. All real database reads remain enforced read-only. This increment does not claim the complete advanced selector policies or full legacy popup/layout parity.


<a id="gc-315-180"></a>
## 180 · Model-resolved Asqueel auxiliary fields — 2026-10-29

Asqueel now resolves auxColumns directly from its model at request time. The
caller does not register each auxiliary field or relation path first. Native
compiled result names remain authoritative, including nested relation aliases;
those names can be used by template and selected-field hidden projections in the
same request. Auxiliary metadata and projections are request-local: no request
mutates the registered selector or leaves fields available to later requests.
Duplicate output names representing different expressions are refused.

Only model field/path syntax is accepted, not client SQL expressions. Asqueel
compilation errors propagate unchanged to the RPC error envelope and the browser
shows the failure. An invalid field is not an empty successful query. Ordinary
registered projections, ordering/filter configuration and eligibility predicates
retain their existing behavior. SQLAlchemy/Django still use explicitly prepared
projections and reject unsupported paths; no cross-provider relation translation
was introduced. This supersedes the per-auxiliary-field registration restriction
in GC-315 §175 and GC-070 §2450, per constitution 11.104.

The Base and Application service registrations no longer list @state.name. The
same Python pages request it through auxColumns. Implementation is in the two
invoice-galleries adapter worktrees; the current component baseline is in
invoice-galleries/runtime/gramlot. No frontend runtime change was needed for this
correction; an explicit native-error regression was added for both controls.
The older database-selector-package worktrees were left intact.

Verification: 56 focused Base Python tests pass, including 35 Asqueel/RPC and
auxiliary cases; the same 35 Asqueel cases pass from the Application worktree.
47 JavaScript selector/choice tests pass. Real PostgreSQL reads compare all 3,200
customer relation values against an independent LEFT JOIN in both Base and
Application, without relation registration. Base's native-model verification and
17 selector cases pass. Application lookup and missing-field propagation pass.
No data/schema or dependency source was changed. Broader legacy behavior and
visual acceptance remain separate from this bounded correction.

Final runtime verification: Base/Kajenn on port 61401 and Application/Kajenn on
61404 were restarted with the corrected provider and without @state.name in
registration. The browser verifies Base search, state output and dbComboBox
Enter/Tab free text, plus Application search/template/state output. SQLAlchemy
and Django servers were left running unchanged. No runtime rebuild was needed:
this increment changes Python provider behavior and adds a frontend error test,
not JavaScript runtime code. Both adapter documentation identity checks and both
Sphinx views pass. Component/provider responsibility is retained here; gallery
pages/models/dataset work remains in the dedicated gallery chat. No merge,
publication, dependency edit or owner visual acceptance is claimed.


<a id="gc-315-185"></a>
## 185 · Compact selector templates — 2026-10-29

Owner requests in chat 01a1874b-9446-7910-98f3-2a793361c1d5: compact choices
with alternating theme backgrounds, a wider template popup, and a clear display
when invoice totals are null. The follow-up in the integration chat authorizes
review and incorporation into the local candidate. No database expression syntax
or provider responsibilities change.

`templateNull` is read-bindable literal text replacing null values in template
text slots; its default is empty text. Zero, false and empty strings are preserved.
Requested columns must still exist in the response; missing columns remain a
contract error. Replacements are text nodes, never HTML or evaluated pointers.

The shared choice editor uses `--gramlot-choice-item-padding` (default `.25em .5em`)
and `--gramlot-choice-alternate-background` (default the theme subtle surface).
`--gramlot-choice-popup-min-width` controls minimum width. Database HTML templates
default to `28rem`; ordinary choices retain the field width. Popups stay within
the viewport and can scroll vertically. The Application example requests existing
Asqueel model formulas `n_invoices` and `invoiced_total`, with `templateNull='—'`.
It adds no query or aggregation language to the browser and performs no writes.

Closing the suggestion popup cancels its search and debounce timer, not an
active lookup of the committed value. Changing/clearing that value, changing
the data-source configuration, or removing the control cancels obsolete lookup.
Enter commits free text and closes pending search, including before its debounce
elapses. These lifecycle fixes preserve the existing value/projection contract.

The owner subsequently excluded the Application/Invoice gallery from the current
local release (GC-070 §2475). Its template remains a separate development example;
only the common selector behavior and independent regressions stay in the candidate.


<a id="gc-315-190"></a>
## 190 · Conditions and selected-value revalidation — owner contract, 2026-10-29

Owner: “Prima della release completiamo condition e weakCondition come nel legacy.”
After the behavior explanation, owner confirms: “Sì, manteniamo l’autoselezione del
candidato unico per dbSelect obbligatorio, come nel legacy. Aggiorna il contratto e
procedi con condition e weakCondition, con test ed esempi nella gallery.”
This extends the Base-only local release; Invoice remains excluded. Implementation,
verification and public publication are separate from this approved contract.

- condition is a parameterized eligibility expression. condition_* supplies its
  bound values, never interpolated SQL. Changes revalidate the selected identity
  and invalidate obsolete suggestion/lookup work without recreating the widget.
- weakCondition=False keeps condition mandatory. weakCondition=True makes the
  entire condition soft. A string weakCondition adds a soft expression while the
  original condition stays mandatory. Empty search results trigger a retry with
  only the soft restriction removed; a short nonempty result is not filled from
  outside the restriction. Each attempt retains prefix-then-containment search.
- Server authorization/read restrictions are never relaxed, either for search or
  for recovery of an existing caption. Browser input cannot authorize arbitrary
  expressions or grant access to records.
- An existing, readable but ineligible key stays in Data with its readable caption
  and a field error. Returning to an eligible condition clears that error. A soft
  condition alone does not invalidate the selected key. Missing/inaccessible keys
  remain recognizable without exposing inaccessible record information.
- On a condition change, an editable required dbSelect checks up to two candidates.
  Exactly one candidate is selected through the existing validation/Data writer,
  including replacement of the previous key. Zero/multiple candidates retain the
  key and run identity validation. This is distinct from the existing autoSelect
  behavior for an initially empty field. dbComboBox keeps its free-text contract;
  required dbSelect replacement is not applied to it.
- Async work exposes pending state and discards stale replies after condition/value
  changes or removal. Source/Data retain application state; Logic carries none.
  This increment does not implement the deferred form manager or save lifecycle.

Owner clarification: “certe capabilities sono asqueel only”. condition and
weakCondition are Asqueel-only capabilities; SQLAlchemy/Django reject their use
explicitly rather than translate or ignore expressions. Core owns parameter
transport and selection lifecycle, not expression interpretation. Owner further requires “deve funzionare esattamente come il legacy”. The proposed
second conditions registration is withdrawn: applications declare condition,
weakCondition and condition_* on the widget. No alternative authoring API or
cross-ORM translator is approved. Server-side expression handling must be reviewed
against that direct legacy path before claiming implementation or security parity.

The response reuses legacy errors (literal text) in the existing rows/identifier/
caption envelope for an identity found outside eligibility. Empty rows mean no
accessible identity; returned errors must not become pointers or executable code.

Required regressions: strict and both soft forms, retry ordering, immutable server
restrictions, bound parameters, condition reversal, missing/ineligible identity,
zero/one/two candidates despite a display limit of one, typed zero identity,
current-value races, async-validation cancellation, removal, unchanged widget
identity, and combo free text. Gallery uses the Base dataset, not Invoice.
