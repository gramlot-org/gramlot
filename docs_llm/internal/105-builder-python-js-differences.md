# 105 · Python and JavaScript Builder differences

Document ID: **GC-105**. Updated: **2026-09-21**.

<a id="gc-105-005"></a>

## 005 · Scope and decisions

The reference is the current Python Builder. JavaScript should behave equivalently
except for explicit differences below. This is the known-difference register, not
a claim that an exhaustive method-by-method parity audit has finished. It describes
local working implementations, not published releases. Recipes remain deferred.

Owner decisions:
- 2026-09-21: use the existing PoC separation of `format` and `mask` in JavaScript.
  Leave Python unchanged; consider a Python backport separately.
- 2026-09-21: accept the missing JavaScript TargetWrapper base class for now.
  Do not add the class merely to match the Python class inventory.

An open gap is not automatically an approved permanent exception. Update this
register when a difference is fixed, accepted, or better characterized.

<a id="gc-105-010"></a>

## 010 · Declaration and calling conventions

| ID | Python | JavaScript | Status |
| --- | --- | --- | --- |
| SYN-01 | Decorators and JSON loading declare grammar. | Canonical JSON declares grammar. | Agreed language adaptation; same grammar meaning required. |
| SYN-02 | Named arguments: `root.div('Hi', title='Greeting')`. | Attribute record: `root.div('Hi', {title:'Greeting'})`. | Language adaptation; typed objects such as Date remain values. |
| SYN-03 | Decorated component/container methods. | Methods named in static components/containers lists. | Existing implementation choice; not a JavaScript language requirement. Recipes are outside this consolidation. |
| SYN-04 | Data functions receive named arguments. | Data functions receive an argument object. | Language adaptation, not permission to change results. |

<a id="gc-105-015"></a>

## 015 · Presentation: deliberate divergence

**FMT-01 — accepted direction.** JavaScript static HTML formats scalar Source content
with `format`, `places`, `locale`, `dtype`, then wraps the result with `mask`.
The pure functions come from the reviewed PoC helpers; browser handlers and input
parsers were not ported. Example:

```javascript
root.div('^price', {format:'#,##0.00', locale:'it-IT', mask:'€ %s'});
```

With 1234.5, the content is `€ 1.234,50`. Options are consumed, not emitted as HTML
attributes. Data, formula inputs, input values and arbitrary HTML attribute values
are not formatted. Locale is explicit, inherited from Source ancestors in their
own Data scope, or supplied by the host Intl default. No browser/application locale
fallback is present in the static renderer.

Python currently applies its `%` operator to a Data-node `mask` when reading a
value for presentation, including attribute pointers. That is a different source
of metadata and a different operation; there is no automatic translation between
the two contracts. Python backport scope is not decided.

| Case | Python current behavior | JavaScript static HTML |
| --- | --- | --- |
| Decimal formatting | Data mask `€ %.2f` | Source `format:'0.00', mask:'€ %s'` |
| Mask syntax | Python percent formatting | Replace every `%s`; `%d` and `%f` remain literal text |
| Null with a mask | Python Data mask leaves null unchanged | Source mask `[%s]` displays `[]` |
| Locale and rounding | Python percent operation | Intl presentation; locale/runtime differences are possible |
| Boolean text | Python string conversion: `True` | JS string conversion: `true` |

**FMT-02 — open parity limitation.** General value-to-string conversion, including
template substitutions and container values, is not fully aligned across languages.
Do not assume byte-identical output outside the checked cases.

This static port does not mean live Gramlot formatting and bindings are implemented.

<a id="gc-105-020"></a>

## 020 · Output destinations

**OUT-01 — temporarily accepted.** Python provides a TargetWrapper base class with
`render_opts` and `full(document)`. It has no concrete subclass in the package.
JS has no corresponding base class, but already reads `renderOpts` on the destination
and can deliver the result through `.full(document)`. The delivery mechanism exists;
only the explicit base class is absent. No class addition is currently required.

**OUT-02 — open gap.** Python accepts file paths as render destinations and exposes
`rendered_target` to read the registered output file. The portable JS renderer rejects
string paths; writable objects and functions are supported. Filesystem integration
and its ownership remain to be decided; no browser filesystem shim is implied.

<a id="gc-105-025"></a>

## 025 · Other known gaps

| ID | Difference | Status |
| --- | --- | --- |
| RES-01 | JS Bag resolvers may return Promises; the synchronous Builder render path has no agreed asynchronous consumption contract. | Open. Synchronous direct resolvers use the Bag API and its cache. |
| VAL-01 | JS grammar validation supports a bounded mapping of Python types. Arbitrary Python types are not portable. | Open inventory of precise supported/rejected cases. |
| VAL-02 | JS rejects some Python regex constructs/flags, including IGNORECASE and selected character classes. | Explicit implementation restriction; not full regex equivalence. |
| DIA-01 | Python includes YAML rendering and further tools/dialects such as CSS, XSD, XSLT, configuration and DataBuilder. JS currently includes HTML/SVG and generic XML rendering. | Scope gap; adding every dialect is not authorized by this register. |

<a id="gc-105-030"></a>

## 030 · Corrected differences and verification

Locally corrected in Builder JS:
- `${name}` expansion after pointer resolution, removal of consumed inputs and
  rejection of missing names; null input becomes empty template text.
- Direct synchronous BagResolver attributes use resolve(), preserving Bag caching.
- `_wdg` from Data value reads overrides authored attributes; data-elements and
  attribute-path reads are excluded.
- Static HTML includeDatapath emits pointer metadata and stable IDs, respecting
  authored IDs (Python option: include_datapath).
- Date passed directly to root or nested element calls remains a value, rather
  than being mistaken for the attribute record.

Latest local checks: Builder **102/102**, Gramlot **63/63**, on both Node and Bun.
The local Builder archive is installed in Gramlot and browser bundles rebuilt.
Maintained first-party dependency references remain floating. No publication or
commit is implied. These checks cover their cases, not exhaustive Python parity.

[Work status](070-work-status.md) · [Consolidation plan](094-design-consolidation-plan.md)


<a id="gc-105-035"></a>

## 035 · Local 0.1.1 review

The final bounded review corrected fixed tuple validation (position and length),
removed a silently skipped temporary-file test, and verified bundled grammars
against Python exports. Builder 103/103 and Gramlot 63/63 pass on Node and Bun;
strict Sphinx documentation build passes. Package 0.1.1 is installed locally,
not published. The owning Builder repo now contains its Sphinx manual and
GBJ-020 differences register. TargetWrapper remains accepted without a JS class.

Additional recorded boundaries: runtime kwarg:attr subbuilder references are not
implemented; surplus authoring arguments are ignored rather than rejected;
whole-Source replacement retains deferred root/identity semantics. These are not
newly approved compatibility paths. Recipe consolidation remains excluded.


<a id="gc-105-040"></a>

## 040 · Superseding Python-port correction

Owner authorization reopened Builder JS for a bounded correction on 2026-09-21;
version remains 0.1.1. Removed recipes and unrequested setData/attachSource helpers,
plus prepareItem and renderer access wrappers absent from Python. Exported base
JSON from Python; restricted generic Callable descriptors to Python's rejection.
GBJ-025 in the owning repository records the module-by-module responsibility map.
100/100 tests pass on Node and Bun, strict Sphinx passes, and all three bundled
grammars match Python exports. This corrects the earlier review's missed scope
violations; it does not establish full behavioral parity. Format/mask remains an
explicitly accepted difference. Typed Source transport/Proxy mechanisms remain
language adaptations. Gramlot's installed package and consumer still need alignment.
The inherited-declaration collision is also reproducible with Python HtmlBuilder;
no unilateral JS-only collection policy was added.


<a id="gc-105-045"></a>

## 045 · Agreed collection replacement

**Collection composition decision — 2026-09-21.**
Owner confirms ordered, replacement-based composition: a later collection replaces
an earlier declaration of the same name in full. Other declarations remain.
There is no attribute-level/deep merge. Example: HTML defines div/span; a later
collection defines div/textBox; the result retains HTML span, replaces div and
adds textBox. This is an approved contract, not implemented behavior yet.

Both generic loaders currently reject conflicting definitions. Implement this in
the owning Python and JS builders, with matching semantics, not a parallel Gramlot
merge path. The previous exception reopened Builder JS only for Python-port cleanup;
permission to change both generic loaders for this new contract remains to be
confirmed. Bag JS is unaffected. Consumer alignment remains pending.



<a id="gc-105-050"></a>

## 050 · Shared Collection implementation

**Collection composition implemented in owning sources — 2026-09-21.**
Owner decisions supersede full-declaration replacement and collision rejection.
Both Builder Python and JS now export Collection: raw portable JSON, ordered
update and independent document export. Declarations may be partial. Omitted/null
fields preserve prior values; named parameters and child rules add/update; no
removal marker, author-metadata extension or HTML documentation generator was added.
A supplied signature parameter remains a complete descriptor. Existing exporters
are unchanged. Version remains Python 0.23.2 / JS 0.1.1.

Both loaders compose and validate before publishing; class/instance isolation and
abstract recompilation are verified. Removed loaded-document/declaration registries
in favor of one Collection. Preserved executable component declarations across JSON
updates; injected component roots are not required author attributes.

Checks on exact staged sources applied with hash verification: Python **443/443**,
Node/Bun **107/107**, no skipped tests. The same HTML5 JSON + partial extension
produced identical composed JSON and static HTML in Python/JS. JS strict Sphinx
passed; Python Sphinx could not start because sphinx_autodoc_typehints is absent
from the documentation environment. No dependencies were installed to conceal this.

**Open:** mixed wildcard/named child-rule composition remains rejected pending
owner clarification. A pre-existing Python include_components rendering defect
was reproduced on unchanged sources: renderer looks up the instance-only method
on the class. It is recorded, not fixed here. Gramlot's installed JS package is
still the older 0.1.1; full consumer refresh is pending removal of obsolete recipe,
attachSource and prepareItem uses. This is not completion of the 0.1.0 host matrix.
No Bag changes, exporter-output changes, version bump, commit, push or publication.



**Wildcard clarification implemented — 2026-09-21.**
Owner confirms that an existing sub_tags="*" remains "*" when a later collection
adds bare child names such as span. Applied in Python and JS; incoming syntax is
still validated, so the wildcard cannot conceal malformed rules. Combining *
with explicit child cardinalities remains undecided/rejected. Targeted checks:
16 Python, 37 Node and 8 Bun tests pass. No version change or installed-package
refresh; the previously recorded Gramlot integration work remains outstanding.



## Local consumer refresh — 2026-09-21

Builder Python 0.23.3 and JS 0.1.2 are now installed in Gramlot. The active
consumer no longer uses recipes, attachSource or prepareItem. This supersedes
the pending-installation status above. See GC-070 for verification and open items.
