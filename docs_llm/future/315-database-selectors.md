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
