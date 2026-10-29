> Current local gallery work: see §170; earlier dated sections retain their stated scope.

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


<a id="gc-315-055"></a>
## 055 · Complete selector review: evidence and scope — 2026-10-28

Owner requests a complete dbSelect/dbComboBox review against the very latest
Genropy legacy changes, particularly auxColumns. This is a review assignment;
it does not approve a broader database contract, runtime corrections or dependency
edits. `dbComboBox` is the actual widget name; no `dbCombo` alias is introduced.

GitHub's `genropy/genropy` develop tip was verified on 2026-10-28 as
[`a135c9d949d0b014a22f57c418e83b315f85e7bf`](https://github.com/genropy/genropy/commit/a135c9d949d0b014a22f57c418e83b315f85e7bf),
the 2026-10-27 merge of [PR 1768](https://github.com/genropy/genropy/pull/1768).
The feature commit is `409143c4d230b858a5ea629e12f5ad756bd16119`; follow-ups
`20a5a2c6502c166faced2d4fa8e29ea7c775cad2` and
`623d1a601ae2c40725defbe5c807592b2da2828e` adjust column styling and the test page.
The indexed source snapshot was older than its indexed commit metadata; therefore
the review fetched exact-revision files from GitHub rather than treating the
September local HEAD or source index as current evidence.

Inspected layers: Python authoring metadata and default endpoint; ChoiceEditor,
databaseChoices, FieldState, selected-output binding and popup positioning;
SQLAlchemy provider and its environment gallery; latest legacy DynamicBaseCombo,
dbBaseCombo/BaseSelect/dbComboBox, GnrStoreQuery, server dbSelect, popup patch,
table renderer, formatter, CSS and example page. The existing parameter inventory
in §§010–040 remains useful historical context, with the updates below.

[Review evidence](../../ports/PORT-0016-database-selectors/review-2026-10-28/README.md)
contains reproducible probes, logs, working-source SHA-256 hashes and exact remote
revision. Source review and controlled executions are distinguished from browser
qualification. No current legacy browser or production database test is claimed.

<a id="gc-315-060"></a>
## 060 · Confirmed Gramlot defects

| Priority | Finding and reproduction | Owning code and consequence |
| --- | --- | --- |
| P1 | A cancelled identity lookup can restart autoSelect. Start with key 0 and a pending lookup; clear the value, type a new draft, then complete the obsolete lookup. Its continuation starts an empty query and commits the sole result, replacing the draft. | `js/src/components/database-choices.js`, `resolveValue` after `await super.resolveValue()` (lines 102–106 in the reviewed source). The base discards stale rows, but the subclass continues without checking that its operation is still current. Ordinary request cancellation alone is insufficient. |
| P2 | Escape in dbComboBox restores the accepted text but clears its selected outputs. Pick Ada with an email, type another draft, press Escape: value/display become Ada while selectedCaption and selected_email become null. | `js/src/components/choice-editor.js`, Escape handler and unconstrained `resolveValue` (lines 63–65, 160). Resolving the retained text unconditionally calls `selectionResolved(null)`, losing the accepted row context. |
| P2 | Failed lookup retains outputs belonging to the previous key. Resolve key 0, externally change value to 99, then fail that lookup: value is 99, selectedRecord.id is still 0 and selected_email still belongs to 0. | `js/src/components/choice-editor.js`, `resolveValue` lines 156–167, and database output handling. The error is visible, but downstream bindings receive an inconsistent key/projection pair. Failure needs an explicit unresolved-output policy; the old record must not masquerade as the new selection. |
| P2 | SQLAlchemy search does not implement the constitutional prefix-then-containment direction. With names `A Ada` and `Ada`, query `Ada`, limit 1, it returns `A Ada`. | `gramlot-py-server/src/gramlot_py_server/db/sqlalchemy.py`, lines 89–98: only `instr(...) > 0`, followed by ordinary ordering/limit. A containment result can displace the available prefix result. GP-025 documents substring behavior but does not amend constitution §8. Exact fallback criteria still need to be stated consistently. |

These are reproducible observations, not fixes. In particular, the first finding
uses an already-running request completed after a later user edit; it does not
depend on a user typing before initialization microtasks can execute.

Existing strengths remain verified: typed zero/string keys, rejected drafts keeping
accepted Data, free-text clearing, ordinary request cancellation, source removal,
filter-driven validation cancellation, two-row uniqueness probing, explicit
projection/filter allowlists, parameterized literal searches and identity-type
checks. Those successes do not cover the distinct failures above.

<a id="gc-315-065"></a>
## 065 · Latest legacy auxColumns behavior and caveats

The 27 October change is a **shared popup presentation feature**, installed by
DynamicBaseCombo when auxColumns is present. It therefore concerns dbSelect,
dbComboBox and callbackSelect, rather than changing only the SQL selector.
The new example uses callbackSelect, exercising the popup without a database.

| Setting | Behavior in the retrieved implementation |
| --- | --- |
| omitted | Render columns first. Switch when the wrapper overflows horizontally **or** table width exceeds `max(fieldWidth, min(2 * fieldWidth, 30 * em))`. |
| `auxColumns_multiline=True` | Render one cell per option immediately. |
| `auxColumns_multiline=False` | Keep the column table, even when wide. |
| numeric value | Use `fieldWidth * value` as the width threshold; actual wrapper overflow still triggers conversion. This is a threshold, not a fixed menu width. |
| `auxColumns_template` | Takes precedence over automatic/forced multiline presentation. |

Multiline rows show the **first returned display column** in bold, falling back
to row.caption only when that first value is null/undefined/empty string. Remaining
display columns become `Header: value` lines; blank values disappear, but zero and
false are not blank. With a composite rowcaption, the bold line is therefore not
necessarily the complete input caption. Headers come from the result metadata;
they are not inferred from JavaScript field names.

The hover handler now finds `closest('tbody tr[id]')`, so nested template markup
maps to its option row. CSS aligns headers to the left, separates adjacent columns,
and supplies multiline typography. The control's identity/text semantics, hidden
projection, search algorithm and result transport are unchanged by this patch.

Two caveats were reproduced by executing the retrieved helpers in an isolated VM:

1. **Layout is sticky:** `_multiline` becomes true and is not reset by
   createOptions or clearResultList. A later narrow result or wider field keeps
   multiline mode for that popup instance. It is not a continuously reversible
   responsive layout. Whether this persistence is desired requires a legacy
   owner decision; do not advertise automatic return to columns.
2. **Row classes disappear on the automatic second render:** scrollableTable
   consumes `_customclasses`, `_customClasses` and `_customclasses_*` from each
   row via objectPop/objectExtract. The initial table takes them; the multiline
   rerender no longer sees them. `not_preferred_row` was reproduced disappearing.
   This also matters to empty-row/application class styling. `_is_invalid_item`
   is not consumed by this code and is a separate case.

Other source-level limits to preserve in the review, not blindly port:

- Template/multiline mode explicitly requests `400px` max height, overriding
  scrollableTable's ordinary `clamp(180px, 40vh, 400px)`. The first adaptation and
  reopen use deferred callbacks; actual short-viewport/mobile behavior is untested
  here. Gramlot already has viewport-aware popup placement.
- Generated multiline markup inserts headers and `_F` results as HTML. The text
  formatter returns an unformatted string unchanged, and scrollableTable uses
  innerHTML. This is an inherited raw-markup trust boundary, not evidence that
  arbitrary returned strings are escaped. A port must preserve Gramlot's existing
  textContent safety and obtain a separate explicit template contract.
- Numeric mode has no positive/finite validation in adaptToField. No new Gramlot
  numeric option or interpretation of invalid ratios is approved by this review.

Exact source locations at the verified revision: `genro_patch.js:504–575,605–614`,
`genro_widgets.js:5673–5700`, `genro_dom.js:1513–1625`,
`gnrlang.js:1209–1245,1292–1300`, and `07_gnr_components.css:114–207`.
The legacy test page is `inputfields/dbselect.py:193–227`.

<a id="gc-315-070"></a>
## 070 · Contract comparison and decisions still required

| Concern | Current Gramlot | Legacy/reference implication |
| --- | --- | --- |
| Identity versus text | dbSelect stores typed key; dbComboBox stores text/free text. | Preserve the separation. Equal captions do not identify a dbComboBox record. |
| Search fields | Provider registration owns `search`. Browser `columns` only projects/displays fields. | Legacy `columns` selects search fields; auxColumns selects display extras. The same name currently means different things. Do not silently reinterpret existing Gramlot declarations. |
| Popup extras | Plain flex-row spans for projected `columns`; no headers, column alignment, multiline rules or template contract. | These spans are not auxColumns parity. Presentation metadata and rendering responsibilities require a design. |
| Unknown aux options | `auxColumns` and `auxColumns_multiline` can be accepted as residual element attributes, but neither reaches the request nor changes the menu. | A probe with auxColumns=email displays only Ada. Unsupported capability can be silently ineffective; specify how the authoring/capability boundary should reject it. This does not authorize implementing it. |
| Selected fields | `selected_email` routes a returned field; it does not add email to hiddenColumns. Explicit projection is currently necessary. | Legacy adds selected fields to hiddenColumns and supports expression mappings. Current GP-025 examples explicitly request the field. Treat automatic projection as a compatibility gap/decision, not an already promised implementation. |
| Enter/highlight | Shared editor activates the first row for both widgets; Enter chooses it. | Legacy distinguishes dbSelect's first highlight from dbComboBox. Typing `Ad` then Enter currently commits `Ada`; blur may commit `Ad`. This is an interaction-policy decision, distinct from autoSelect and inline completion. |
| Identity eligibility | Registered filters apply to lookup; an ineligible key produces no row and displays its raw key with an error. | Legacy can recover caption outside condition while marking it invalid. Display recovery must not weaken authorization filters. |
| Empty option | Clear writes null; emptyLabel is a placeholder. | Legacy adds a synthetic null row with placement/class options. These are not equivalent APIs. |
| Extensions | Dedicated method handles both search and lookup. | selectmethod/applymethod, rowcaption expressions, alternate keys, preferred/invalid rows, weakCondition, model/zoom/form integration and cache policy remain outside this bounded common port. |

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

Executed against reviewed working sources:

- 46 existing JavaScript choice/database/validation tests passed.
- 3 core Python selector/validation-authoring tests passed.
- Provider suite: 14 passed; 1 failed in environment gallery construction because
  gramlot-examples imports `gramlot.collections.inputs`, absent in this core.
  Correct source paths and the SQLAlchemy-equipped interpreter were used in the
  final run. This is an integration blocker, not a failed SQLite query assertion.
- Six Gramlot characterization probes reproduced the four browser observations
  (cancelled lookup/autoSelect, Escape, failed lookup, silent aux options) and the
  projection and Enter-policy differences. Passing probes confirm current defects
  or differences, not repaired behavior.
- A real in-memory SQLite probe reproduced containment displacing a prefix match
  and verified that projected columns do not alter registered search fields.
- Two isolated legacy checks reproduced persistent multiline state and row-class
  loss on rerender, using exact downloaded methods and controlled geometry.

The review is complete within source/controlled-test scope. A full current
gallery browser qualification is not green; real desktop/touch layout, native
popover geometry, screen-reader operation, legacy database queries and visual
owner acceptance remain unverified here. No source correction, feature approval,
release or deployment was performed. PORT-0016 needs corrections before a new
acceptance claim; historical 18 October successful qualification is not erased.


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

Owner request: “fa comunque un doc di analisi su tutto e teniamolo sottomano.
per ora facciamo una proposta per coprire il grosso”. This section and §§115–130
are the current analysis/proposal entry point. They do not authorize implementing
the recommendations. Earlier inventories remain the detailed evidence.

Scope of “complete”: the selector-specific inheritance chain, browser store,
popup, 25 named server arguments, parameter families and model/form integration
have been inventoried. It is not exhaustive runtime qualification of all Dojo
or Genropy inherited controls, arbitrary application kwargs or database engines.
The latest downloaded legacy browser/service evidence is develop revision
a135c9d949d0b014a22f57c418e83b315f85e7bf (2026-10-27); the older model/authoring
inspection is identified in §005. Do not label every older observation as checked
against the latest revision.

Status terms: **implemented** means present in this isolated Gramlot worktree;
**partial** means a narrower or different contract exists; **missing** means the
legacy responsibility is absent; **separate** means another subsystem owns it.
“First package” below is a proposal, not accepted scope.

### All named legacy service arguments

| Legacy argument | Current Gramlot / integration status | Recommended disposition |
| --- | --- | --- |
| dbtable | Implemented table selector; basic provider exposes registered tables. | First package: server-authorized Asqueel table/model configuration. |
| columns | Partial: current projection/display fields; legacy search fields. | Preserve current meaning in this proposal; search fields come from the server model/configuration. Do not vary the meaning by backend. |
| auxColumns | Missing advanced metadata service; arbitrary attributes are not proof of support. | First package: Kajenn model-backed auxiliary projection/display metadata; explicitly settle its relationship to existing columns. |
| hiddenColumns | Implemented explicit extra projection in the basic provider. | First package: union with selected/template requirements, with server field authorization. |
| rowcaption | Missing model-driven caption contract. | First package after Asqueel #63; keep caption independent of HTML template. |
| _id | Implemented typed identity request, including zero; advanced policies missing. | First package: resolve identity consistently with active key and read policies. |
| _querystring | Implemented text request. | First package: bounded literal search with explicit prefix/fallback policy. |
| querystring | No second request spelling. | Omit the legacy alias; retain _querystring as the generated request field. |
| ignoreCase | Browser parameter exists; basic provider applies it. | First package: Asqueel operation with actual case semantics; do not inherit the legacy ignored-flag defect. |
| exclude | Missing dedicated selector option. | First package: typed exclusions in the active identity domain, explicitly unlike legacy physical-key behavior. |
| excludeDraft | No advanced selector authoring contract. | First package: trusted server read policy, preserving Asqueel behavior. |
| condition | Current condition_* values reach configured filters; no client SQL condition API. | First package: server-owned predicates, with reactive bound values from the browser. |
| limit | Implemented positive bounded client request; provider lacks a separately configured maximum. | First package: server maximum and stable ordering; no zero/unbounded arrow behavior. |
| alternatePkey | Basic provider has a configured identifier; no model-backed widget contract. | First package: server-approved alternate identity with uniqueness and type checks. |
| order_by | Basic provider supports authorized names and descending prefixes. | First package: trusted model/configuration ordering and identity tie-breaker. |
| selectmethod | Whole-method override exists; separate search hook missing. | Prefer existing dedicated endpoints initially; separate trusted search hook only if needed by a concrete use case. |
| applymethod | No dedicated postprocessor contract. | Trusted server customization, not an arbitrary browser-selected callable. Defer a separate public option. |
| notnull | Validation exists; legacy synthetic-empty-row behavior is absent. | First package: required/optional selection contract using existing validation. |
| weakCondition | Missing. | First package: distinct soft eligibility filter; retry cannot remove authorization or hard filters. |
| _storename | No selector routing API. | Host/server configuration responsibility; no new browser database-routing parameter. |
| preferred | Missing ranking/status metadata. | First package: preferred ordering within the chosen search stage. |
| emptyLabel | Partial: used as a placeholder today, unlike legacy empty-choice caption. | First package proposal: real null choice label; placeholder keeps its own parameter. This requires an explicit behavior change. |
| emptyLabel_first | Missing. | Defer ordering customization; propose one predictable empty-choice placement initially. |
| emptyLabel_class | Missing. | Defer legacy styling parameter; retain ordinary theme/presentation mechanisms. |
| invalidItemCondition | Missing candidate-status metadata. | First package: invalid candidates cannot commit; provide a reason and consistent identity-lookup semantics. |

### Browser options, families and inherited responsibilities

| Surface | Current coverage / gap | Proposed treatment |
| --- | --- | --- |
| value, typed keys, caption and free text | Implemented; dbSelect stores key, dbComboBox stores text. | Preserve; equal captions must not silently disambiguate distinct dbSelect keys. |
| method | Implemented whole RPC endpoint override. | Reuse existing endpoint machinery; no new transport. |
| condition_* | Implemented reactive parameters and request invalidation. | Extend server policy semantics, not browser SQL interpretation. |
| selectedCaption, selectedRecord, selected_* | Implemented projection outputs and clearing; field auto-projection missing. | First package: derive required fields and check the returned projection. selectedRecord remains a projection, not a full record loader. |
| selected_* expression/alias syntax | Legacy supports destination=expression; current mapping uses returned field names. | Keep explicit returned aliases initially; do not introduce a browser SQL parser. |
| selectedCb | Implemented callback after accepted selection. | Preserve normal change/output ordering and once-only notification on acceptance. |
| selectedSetter | Missing grid-specific output customization. | Defer with grid integration; ordinary Data writes remain the path. |
| hasDownArrow, searchDelay, readonly/disabled | Implemented shared behavior; defaults differ from legacy. | Preserve bounded queries, zero debounce and existing disabled/read-only contracts. |
| autoSelect | Implemented sole-candidate behavior with stale-request repair. | Qualify dependencies, clearing and required/optional fields; do not confuse with first-row highlight. |
| autoComplete, firstMatchDisabled | No equivalent explicit selector policy. | Settle Enter/blur/highlight behavior first; defer optional inline completion switches. |
| auxColumns_template / auxColumns_multiline | Legacy names not adopted. | Confirmed replacement: template HTML with {name} record-text slots; implemented. |
| connectedMenu / connectedArrowMenu | Generic integration not implemented for selector arrow. | Defer; arrow continues to open suggestions. |
| store_id / store_caption / store_record | Basic response declares identifier/caption; no legacy aliases. store_record had no identified consumer. | Keep one result contract; do not port unused declarations as features. |
| switch_* with _set / _value / _action | Missing. | Defer input-command language until a concrete application requires it. |
| validate_select and invalidItem_message | Ordinary selection validation exists; server invalid-item reasons missing. | First package: distinguish unresolved text, missing record and ineligible record. |
| Other validate_* and presentation attributes | Shared controls/validation own them. | Reuse and test interactions; do not duplicate labelbox, bindings or validators. |
| ignorePartition, distinct, subtable | No confirmed selector-level equivalents. | Trusted service policy only when Asqueel supports the exact operation; unsupported requests fail. |
| dbstore, dbenv_*, tenant/context and httpMethod | Legacy environment/transport surface. | Kajenn owns request environment and routing; core stays independent. No synchronous RPC. |
| Identity cache, form-caption reuse, changeInTable | Legacy has a 60-second cache and invalidation paths; current requests have lifecycle cancellation. | Defer persistent cache; first prove correct invalidation and freshness without it. |
| Pagination / Dojo pageSize | Legacy chain does not establish a real paging protocol. | Bounded suggestions initially; do not claim pagination from a limit parameter. |
| field(), defaultFrom, wdg_*, checkpref*, zoom/zoom_* | Model/form/navigation enrichment, not implemented by these controls. | Separate work; retain in inventory without expanding this selector package. |
| Grid editing / related setters / _hdbselect | Separate integrations. | Defer; do not introduce grid or hierarchical-selection semantics incidentally. |

<a id="gc-315-115"></a>
## 115 · Proposed first package: cover normal database selection end to end

**Proposal, awaiting owner approval.** Cover selecting a related record, suggesting
free text, searching model-defined fields, showing auxiliary data, writing related
outputs, dependent filters and meaningful invalid/empty states. These are functional
coverage goals, not a numerical percentage of legacy parity.

1. **Complete the shared control contract.** Keep the implemented template and
   lifecycle repairs. Set explicit Enter/blur/highlight rules; gather selected and
   template projection requirements; separate null-choice labeling from placeholder.
2. **Implement one Kajenn + Asqueel selector service.** Model captions and queryfields,
   typed identity/alternate identity, auxiliary/hidden projection, literal prefix
   search with containment fallback, stable ordering and a server-enforced limit.
3. **Add practical selection policies.** Exclusions, hard and soft eligibility,
   preferred and invalid candidates, dependent-value revalidation, and existing
   draft/deletion/partition policies. Keep authorization unconditional.
4. **Qualify the complete path.** Python-authored Source, actual Kajenn RPC,
   Asqueel query execution, selector output and real-browser interaction.

Use existing dedicated endpoints for application-specific behavior. A general
search-hook framework, new cache, command switches, grid, zoom and form-model
authoring are not prerequisites for this first package.

Already confirmed: Kajenn + Asqueel target, engine ownership in Asqueel, issue
instead of dependency edits, and template HTML with {name}. Already implemented:
shared template and three lifecycle repairs. The additional features and policies
above remain proposals.

<a id="gc-315-120"></a>
## 120 · Concrete recommended behavior, still proposed

### Search and returned fields

Retain the existing meaning of columns rather than silently turning it into legacy
search syntax. Read search fields from model queryfields / trusted server selection
configuration; a dedicated endpoint can choose another authorized search definition.
Do not add a new client SQL-expression parameter merely to mimic legacy columns.

Keep auxColumns for the advanced model-backed auxiliary selection. Before coding,
settle one nonambiguous relationship with columns: recommended first contract is
to reject simultaneous declarations rather than concatenate two independent
display specifications. Both use the same underlying projection; auxColumns adds
model-derived display metadata. This mutual-exclusion rule is proposed, not present.

Build the authorized projection from identity, caption fields, explicit visible/
hidden fields, selected_* and fields referenced by template. Reject unavailable or
unexposed fields clearly. The browser can request fields; it cannot grant access.
Returned aliases must be unambiguous for related/formula columns. Do not silently
rewrite a user field to a guessed alias.

Run a prefix search first. Only when it yields no eligible candidates, run
containment with the same hard filters and limit. If a configured soft condition
must be relaxed, repeat that search policy without the soft condition; hard
eligibility, authorization and model read policies remain. Preferred ranking is
within a stage and cannot displace prefix matches with containment matches.
Do not introduce regex/fuzzy/full-text search or fill a partial prefix result with
containment results in this first proposal.

### Selection, keyboard and empty values

- dbSelect retains first-result highlight. Enter commits the active candidate;
  blur accepts only an exact unambiguous eligible match, otherwise reports an
  invalid draft without overwriting the accepted identity.
- dbComboBox should not activate a result merely because text was typed. Enter and
  blur preserve typed text unless the user navigated to or clicked a suggestion.
  Choosing a suggestion writes its caption and associated projection.
- Distinct records with equal captions must never be guessed from display text.
  Explicit selection retains its record; later free text clears record outputs.
- Optional dbSelect offers a genuine null choice with emptyLabel as its caption,
  placed before candidates in this proposal. Required validation still owns whether
  null may commit. The null choice is not a forged record with a synthetic key.
- placeholder remains the hint inside an empty control. Clearing must clear
  projected outputs and must not restart an obsolete autoSelect request.
- A current key outside eligibility can retain its readable caption with an invalid
  state; a missing key is distinct. Unauthorized data must never be recovered by
  relaxing an eligibility condition.

### Service boundaries and response responsibilities

Preserve the existing identity/caption/rows envelope where possible. The advanced
response additionally needs explicit display descriptors (returned field key,
label, dtype/format where supported), candidate eligibility/reason and preferred
state. Identity resolution needs a clear distinction between missing and ineligible.
Exact response field names are still undecided; do not invent them in implementation.

Feature availability must be explicit: an unsupported service cannot silently
ignore auxColumns or policy arguments. Prefer a bounded selector-service contract
over a new global capabilities framework. Exact signaling is an open decision.

Server hooks and filters are trusted application configuration. Browser-supplied
values remain bound parameters. Asqueel owns field/formula resolution, SQL dialects,
read policies and sessions; Kajenn owns access checks and request lifetime; Gramlot
owns presentation and accepted-value state.

<a id="gc-315-125"></a>
## 125 · Execution order and acceptance gates for the proposal

| Step | Deliverable | Evidence required |
| --- | --- | --- |
| 1 — Contract decisions | Approve first-package scope and settle the concrete choices in §120, one decision at a time. Record naming decisions before implementation. | Reviewed examples for dbSelect/dbComboBox, fields, empty values and policy responses. |
| 2 — Shared controls | Keyboard/blur contract, projection requirement declaration and null-choice behavior. Existing template is retained. | Core-owned fixtures; equal captions, zero keys, template/output fields, cancellation, free text and required validation. No adapter dependency in core tests. |
| 3 — Upstream readiness | Supported Asqueel caption/search/mapping APIs from issue #63, with documented limits. | Review upstream implementation and execution evidence; exploratory local patch is not the dependency. |
| 4 — Kajenn service | Registered model selections and the first-package query/policy behavior. | Real service tests for search, lookup, authorization, policy retry, exclusions/alternate keys, limits and session cleanup. |
| 5 — Integrated qualification | Python-authored selector pages through Kajenn and actual Asqueel. | RPC/projection consistency plus browser keyboard, pointer/touch, narrow viewport, long HTML templates and accessibility checks. |

Steps 2 and upstream resolution are independent once their contracts are settled;
service implementation must use the APIs that actually land upstream. Qualify
concrete engines through Asqueel evidence without adding engine branches to the
consumer or claiming universal compatibility.

Acceptance scenarios must include: prefix beating containment at limit 1; literal
percent/underscore/quotes; case sensitivity; record zero; alternate keys and
exclusions in one identity domain; same-caption records; soft-filter retry preserving
authorization; invalid row blocked on click/Enter/blur; dependent-filter changes;
missing versus ineligible current record; clear/free text removing selected outputs;
template injection as literal text; superseded requests; service errors; control
removal and connection cleanup.

Current evidence remains §105: 3,722 JavaScript checks across the full run and
permitted conformance rerun, four Python checks and a successful build. Those checks
cover current core behavior, not this unimplemented proposal or end-to-end Kajenn
qualification. The independent SQLAlchemy prefix-search defect remains recorded;
this proposal does not silently expand that provider's feature scope.

<a id="gc-315-130"></a>
## 130 · Open decisions and maintenance checklist

The next decision is **whether the first package in §115 is the desired scope**.
After scope confirmation, settle the behavior choices in §120 one at a time:
columns/auxColumns relationship and automatic projection; combo Enter/blur behavior;
null choice versus placeholder; prefix/soft-filter retry order; identity/exclusion
domain; advanced response metadata and bounded feature signaling.

Do not ask again about Kajenn/Asqueel, database ownership, using an upstream issue,
HTML template, or {name} placeholders: those are already confirmed.

Keep this document at hand through the current-status link in GC-070 and the
PORT-0016 record. On each implemented increment, update the matrices and status,
cite its checks, and distinguish verified code from owner acceptance. Preserve the
dated legacy evidence and rejected approaches; do not rewrite them as current API
promises. No release, publication or dependency-source change follows from this
analysis request.
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
