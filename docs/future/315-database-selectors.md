# 315 · Database selectors: legacy audit

Document ID: **GC-315**.
[Concise counterpart](../../docs_llm/future/315-database-selectors.md).

> Current status: the bounded SQLAlchemy/SQLite implementation is approved in [§050](#gc-315-050). Earlier audit sections are historical evidence, not the current implementation boundary.

<a id="gc-315-005"></a>
## 005 · Scope and evidence

Owner, 2026-10-18: start with **dbSelect and dbComboBox only**, and inspect the
complete legacy syntax/options before implementation. This supersedes the proposed
first increment combining stores, dataRecord, dataSelection and grid. Those remain
future work. No selector API, backend choice, dependency edit or implementation is
approved by this investigation. In particular, the preceding question proposing a
Genropy-first backend has not received explicit confirmation.

This is a static source audit, not browser/database qualification. Evidence is the
local Genropy working tree, HEAD `fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`, and
PoC working tree, HEAD `10478b57ce3f22e6445eb6b72eba343520cbebac`; local changes are
not represented by those HEADs. The PoC September audits were cross-checked against
current source, including recent condition-change fixes. No legacy defect is
automatically a destination compatibility requirement.

Legacy evidence (paths relative to `genropy`):

| Source | Responsibility |
| --- | --- |
| `gnrjs/gnr_d11/js/genro_widgets.js:4660` | BaseCombo, selected outputs, focus/paste |
| `gnrjs/gnr_d11/js/genro_widgets.js:5093` | DynamicBaseCombo, conditions, request arguments |
| `gnrjs/gnr_d11/js/genro_widgets.js:5316` | dbBaseCombo, model/backend arguments |
| `gnrjs/gnr_d11/js/genro_widgets.js:5538` | BaseSelect, dbSelect and dbComboBox differences |
| `gnrjs/gnr_d11/js/gnrstores.js:574` | GnrStoreQuery search, lookup, cache and switches |
| `gnrjs/gnr_d11/js/genro_patch.js:500` | Multicolumn popup and row templates |
| `dojo_libs/dojo_11/dojo_src/dijit/form/ComboBox.js:453` | ComboBox selection writes display text |
| `dojo_libs/dojo_11/dojo_src/dijit/form/FilteringSelect.js:141` | FilteringSelect writes identity |
| `gnrjs/gnr_d11/js/genro_frm.js:2387` | validate_select and error behavior |
| `gnrpy/gnr/web/gnrwebpage_proxy/apphandler/db_select.py:55` | 25 named server parameters, plus kwargs |
| `gnrpy/gnr/web/gnrwebstruct/dojo11.py:995` | Model-aware field/relationship enrichment |
| `gnrpy/gnr/sql/gnrsqltable/record.py:638` | rowcaption fields and mask |
| `gnrpy/gnr/sql/gnrsqltable/query.py:184` | Column syntax and query-field defaults |
| `projects/gnrcore/packages/test/webpages/inputfields/dbselect.py` | Basic, dependent, single-choice, race and invalid-item examples |

PoC evidence: `docs/development/dbselect-legacy-contract-2026-09-12.md`,
`dbselect-parameters-and-adapter-capabilities-2026-09-15.md`,
`js/dom/src/collections/db-select.js`, `src/gramlot/database.py`,
`src/gramlot/contrib/sqlalchemy/sqlite.py`. Current Gramlot reuse candidates are
`js/src/components/choice-editor.js`, shared labelbox/validation and RPC/TYTX.

<a id="gc-315-010"></a>
## 010 · Two value contracts

| Widget | Data value | Free text | Choosing a suggestion |
| --- | --- | --- | --- |
| dbSelect | Record identity (default primary key, optionally alternatePkey) | Not a valid record selection | Writes identity, shows caption |
| dbComboBox | Text | Allowed, subject to normal validators | Writes searchAttr text, normally caption |

Both use the same DynamicBaseCombo/dbBaseCombo search machinery. dbSelect adds
BaseSelect and Dojo FilteringSelect; dbComboBox uses Dojo ComboBox. Free text does
not create a database row. alternatePkey affects lookup/store identity, not the
fundamental ComboBox text-value contract. Different rows with equal captions are
therefore distinguishable by dbSelect value, not by dbComboBox value alone.

Selected-output hooks are inherited but not identically connected: dbComboBox
installs its setValue hook when selectedRecord or selected_* is declared;
selectedCaption alone does not install that particular hook. Porting must specify
coherent selection/clear/free-text output behavior instead of reproducing this
incidental dependency. Empty string/null normalization also involves generic
blankIsNull; a destination null contract is still to approve.

<a id="gc-315-015"></a>
## 015 · Dedicated server parameters

The 25 named arguments below were checked against the Python AST. Defaults are
signature defaults; model/application defaults may override them. **These are
legacy observations, not a new common Gramlot capability promise.**

| Parameter | Default | Meaning and qualifications |
| --- | --- | --- |
| dbtable | None | Logical `package.table`; browser also accepts table as an alias. |
| columns | None | Search fields; defaults to model queryfields then caption fields. Not the popup column list. |
| auxColumns | None | Extra displayed popup fields; enables the multicolumn popup. |
| hiddenColumns | None | Additional returned fields, without displayed columns. |
| rowcaption | None | Caption fields and mask, e.g. `$name,$code:%s (%s)`; model supplies the default. |
| _id | None | Identity lookup; legacy dispatch tests truthiness, mishandling numeric zero. Generated by the control. |
| _querystring | empty string | Generated search text. |
| querystring | None | Alternate server text argument, not a separate widget feature. |
| ignoreCase | True | Forwarded to search; the default search body does not consult it. |
| exclude | None | Excluded physical primary keys for search, string list or iterable; not applied to identity lookup. |
| excludeDraft | True | Genropy draft policy, including lookup. |
| condition | None | Genropy predicate with bound parameters; search restriction and identity eligibility. |
| limit | None | Application dbselect limit, otherwise 10; browser arrow initialization can set 0. Not a paging protocol. |
| alternatePkey | None | Alternate identity field; does not redefine exclude's physical-key interpretation. |
| order_by | None | Explicit order, table order or first displayed column; preferred ordering can precede it. |
| selectmethod | None | Replaces search algorithm with public page method; does not replace identity lookup. |
| applymethod | None | Post-processes selection; a truthy returned mapping enriches result attributes. Receives Genropy objects. |
| notnull | None | Suppresses synthetic empty choice; browser derives it from validate_notnull if absent. Not a full validator. |
| weakCondition | False | Boolean relaxes condition on no results; string adds a soft condition and retains the original hard condition on retry. Model can supply it. |
| _storename | None | Genropy database-store routing; False resets the default. Not a client collection store. |
| preferred | None | Model/explicit expression to order preferred rows and flag other rows. |
| emptyLabel | None | Caption for synthetic empty row. |
| emptyLabel_first | None | Puts empty row first instead of last. |
| emptyLabel_class | None | Styling class on empty row. |
| invalidItemCondition | None | Search expression flags an invalid row; identity lookup does not compute this flag. |

The empty row is appended only when the legacy result selection is nonempty,
notnull is false and the operation is not identity lookup. This is not equivalent
to always displaying a clear action.

<a id="gc-315-020"></a>
## 020 · Browser options and output families

| Name/family | Observed semantics |
| --- | --- |
| value | Bound key for dbSelect, bound text for dbComboBox. |
| method | Whole RPC service, default app.dbSelect; different from selectmethod/applymethod. |
| condition_* | Bound condition parameters, stripped before RPC; reactive changes trigger condition reevaluation. |
| selectedCaption | Output path receiving caption from the selected result. |
| selectedRecord | Output Bag of returned row attributes/projection; **not** a full database record. |
| selected_<field> | Output paths; requested fields are added to hiddenColumns automatically. Supports `destination=expression`, with result-alias normalization. |
| selectedCb | Selection callback with item and SourceNode context. |
| selectedSetter | Custom `(path, value)` output setter, used by grid editors. |
| hasDownArrow | Defaults false; true with no truthy limit sets limit=0. Read-only hides the arrow. |
| searchDelay | Defaults 300 ms; legacy `value || 300` prevents a numeric zero delay. |
| autoComplete | Defaults false; input completion, separate from initial popup highlight. |
| firstMatchDisabled | Disables the Dojo 1.1 blur patch's displayed-text matching attempt. |
| auxColumns_template | Custom popup row template; applied only in multicolumn path. |
| connectedMenu | Attaches a menu to the arrow instead of its usual dropdown action. |
| store_id | Identity field override, after alternatePkey; default _pkey. |
| store_caption | Sets searchAttr, but query store and selectedCaption still assume caption in places. End-to-end support is not established. |
| store_record | Extracted but no consumer found in this chain. Not a working feature claim. |
| switch_<name> | Prefix regular expression intercepting input before the query. |
| switch_<name>_set | Replaces displayed text using a Data/expression value. |
| switch_<name>_value | Replaces the selected value. |
| switch_<name>_action | Runs a callback with the regex match. Precedence is set, value, action; a bare matching switch suppresses query. |
| validate_select | Installed by BaseSelect unless explicitly declared; selection/query validity. |
| validate_select_error | Default `Not existing value`. |
| invalidItem_message | Actual validator message for an invalid candidate. |
| ignorePartition, distinct, subtable | Forwarded Genropy query/model options, not portable database promises. |
| dbstore | Rewritten as temp_dbstore, managed by request context. Distinct from _storename. |
| httpMethod | Legacy transport option; implementation precedence can turn a truthy explicit value into WSK. |

No generic `store_*` or `switch_*` suffix is automatically a supported behavior.
selected_* writes paths, not independent two-way widget values. On invalid/empty
selection, _updateSelect uses an empty row and clears corresponding outputs; exact
null/undefined handling differs between caption, fields and Bag outputs.

<a id="gc-315-025"></a>
## 025 · Inherited controls and integrations

This is an extensible Source/Dojo surface, not a finite extra dbSelect signature:

- Presentation/input: lbl, lbl_*, box_*, width/height, class/style, hidden/visible,
  disabled, readOnly, placeholder, tabindex/tabIndex, name/id/title/tip. Current
  Gramlot conventions govern the eventual port rather than adding spelling aliases.
- Source/model: datapath, nodeId, parentForm, default_value, blankIsNull, attr_*;
  connect_*, subscribe_*, selfsubscribe_*, onChange/onFocus/onBlur; speech and
  shortcuts. These are not separate database-adapter responsibilities.
- Validation: validate_notnull/empty/case/len/min/max/email/regex/call, remote
  validation and onAccept/onReject; conditional/severity/message suffixes belong
  to the common validator. validate_nodup/exist need database services and
  validate_gridnodup needs collection/grid integration. A selector port does not
  implement these simply by supporting lookup.
- Inherited Dojo: required, promptMessage, invalidMessage, constraints, regExp,
  regExpGen, tooltipPosition, trim/uppercase/lowercase/propercase, maxLength,
  intermediateChanges, query/queryExpr, pageSize, labelAttr/labelType. Dojo pageSize
  is not evidence of server paging: GnrStoreQuery does not forward its offset/count
  as an implemented page protocol, and the custom popup disables _page.
- Local BaseCombo options values/storepath/storeid/storecaption/fullTextSearch
  are consumed in a creation method bypassed by DynamicBaseCombo. Do not advertise
  them as verified database-selector options. searchAttr/store are built internally.
- Model-aware field() derives related table, alternate key, captions/labels,
  wdg_* and validate_* defaults, size, routing, defaultFrom selected fields and
  checkpref*. zoom/zoom_* and enableZoom add label navigation into related-record
  pages/palettes. These depend on application/model services, not plain SQL access.
- dbenv_*, context_dbstore and context_tenant_schema are request/environment
  mechanisms. _hdbselect is a separate hierarchical selector integration.

Server **kwargs can receive SQL options and bound values (distinct, offset,
group_by, having, for_update, relationDict, sqlparams, bagFields, joinConditions,
sqlContextName, excludeLogicalDeleted, ignorePartition, subtable, addPkeyColumn,
ignoreTableOrderBy, locale, checkPermissions, aliasPrefix). Their acceptance by
the SQL layer is not evidence that every name is forwarded by a widget. Duplicate
kwargs can conflict, and the default search explicitly discards `where`.

<a id="gc-315-030"></a>
## 030 · Search, lookup, patches and behavior to preserve deliberately

Search and lookup have different purposes. Search lists eligible candidates;
lookup can recover an existing caption outside the current condition and mark it
invalid. Lookup permits logically deleted rows while still passing draft policy.
Eligibility relaxation is not authorization relaxation.

Actual default search starts with contains on the first query field, narrows to
startswith if the limit is reached, then uses word-boundary regex and ILIKE over
the concatenated search columns if empty. It strips boundary stars and special-
cases numeric text. This differs from the class documentation and the already
agreed Gramlot standard direction (prefix then containment). The default accepts
ignoreCase without applying it explicitly. SQL-dialect parity must be tested.

Reactive condition changes invalidate lookup caches and recheck the current key.
With notnull, a query limited to two options can identify and select the sole
candidate. Otherwise the current caption can remain with an eligibility error.
Recent legacy fixes guard stale replies and clear obsolete query errors. The
sole-candidate branch also applies to dbComboBox through shared inheritance;
it must be reviewed against the ComboBox text-value contract, not blindly copied.

BaseSelect highlights the first option; dbComboBox does not enable that flag.
Highlight, inline autoComplete, blur matching and sole-candidate auto-selection
are four distinct behaviors. The port must state each rather than conflate them.

GnrStoreQuery caches identity results for a hard-coded 60 seconds and can reuse
related-record captions from form Data. changeInTable invalidates the cache.
Queries outside focus can set rpc_sync, and condition revalidation uses a
synchronous serverCall path. These synchronous paths must not become a new
Gramlot transport; the destination already uses asynchronous RPC and lifecycle
cancellation. No new transport/caching policy is approved here.

The popup patch uses returned columns/headers, row classes and optional templates;
its template path has a fixed 400px maximum height. Destination popup geometry
must derive from viewport/content and theme metrics, retaining keyboard/touch
operation. It should not import application-specific rendering or magic sizing.

Observed source caveats to turn into explicit tests/decisions:

1. Zero identities are treated as absent in legacy lookup dispatch.
2. ignoreCase is not honored by the default search body.
3. alternatePkey and exclude use different identity domains.
4. invalidItemCondition is evaluated for search but not lookup; the example's
   invalidItemCondition_message is not the consumed invalidItem_message.
5. readOnly, arrow visibility and limit are coupled; showing an arrow should not
   accidentally make a future query unbounded.
6. searchDelay=0 is overwritten; fixed cache and popup constants need appropriate
   ownership, not one public parameter for every implementation number.
7. Caption/store aliases and ComboBox selectedCaption-only hooks are inconsistent.
8. selectedRecord is a projection, not a substitute for dataRecord.

<a id="gc-315-035"></a>
## 035 · Illustrative legacy Python syntax

These snippets illustrate inspected **legacy syntax**, using illustrative model
fields. They have not been executed and are not current Gramlot examples.

```python
fb.dbSelect(
    dbtable='crm.customer', value='^.customer_id', lbl='Customer',
    columns='$code,$name,$email',
    rowcaption='$code,$name:%s - %s',
    auxColumns='$city,$email', hiddenColumns='$vat_number',
    condition='$country=:country', condition_country='^.country',
    order_by='$name,$id',
    selectedCaption='.customer_caption',
    selectedRecord='.customer_choice',
    selected_vat_number='.vat_number',
    hasDownArrow=True, searchDelay=300, limit=20,
    validate_notnull=True,
)

# Text suggestion, not a foreign-key field or automatic insertion.
fb.dbComboBox(
    dbtable='crm.customer', value='^.recipient_name', lbl='Recipient',
    columns='$name', rowcaption='$name',
    selected_email='.recipient_email',
    hasDownArrow=True, limit=20,
)

# Fetch an expression and route its normalized result alias to a Data path.
fb.dbSelect(
    dbtable='crm.customer', value='^.customer_id',
    selected_country_name='.country_name=@country.name',
)
```

For dbComboBox, selected_email is meaningful for an actual picked row; committing
free text must not falsely retain output fields from an earlier suggestion. Exact
commit/clear semantics will be specified and tested in the destination contract.

<a id="gc-315-040"></a>
## 040 · Destination recommendations and decision boundary

Propose two widgets sharing presentation, popup, labelbox, validation and choice
loading; keep key-bound and free-text value policies explicit. Reuse existing
Gramlot RPC/TYTX, Source lifecycle and current theme variables. Core callbackSelect
currently requires string codes; do not silently extend it or stringify DB keys.

Review the complete inventory by responsibility: visual options and selected
outputs, service search/lookup, backend/model extensions, and unrelated application
services. Constitution section 8 still reserves advanced capabilities, explicitly
auxColumns, to Genropy. Technical reuse of popup rendering does not change that
product boundary. Do not introduce a portable SQL interpreter or promise common
support for Genropy expressions. Unsupported requirements must fail explicitly.

Recommended contract tests: typed zero/string keys; key versus caption versus
free text; selected-output clearing; same-caption distinct rows; dependent filters
and sole-candidate behavior; identity outside eligibility; null/empty/no-match/
error distinctions; invalid search versus resolved row; custom service versus
search hook; exclusion with alternate keys; superseded requests and Source
removal; theme/touch/keyboard popup behavior and connection cleanup.

Next step: agree the two-widget contract and feature scope, using this inventory;
confirm backend separately. No stores/dataRecord/dataSelection/grid framework,
form persistence, model-driven field(), zoom, or dependency changes are implied.


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
