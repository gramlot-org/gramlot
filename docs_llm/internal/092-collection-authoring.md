# 092 · Collection-driven authoring

Document ID: **GC-092**. Updated: **2026-09-22**. Current ownership follows constitution amendments 11.14, 11.16 and 11.18; the dated checks below remain historical.

<a id="gc-092-005"></a>

## 005 · One declaration format

GramlotBuilder Python and JavaScript consume `builder_grammar` version 1.1 from
the owning generic builders. HTML5 and SVG JSON are the sole native vocabulary;
there are no handwritten JS equivalents. `genro-builders-js` generates both through
the existing Python HtmlBuilder/SvgBuilder exporters (`npm run export:collections`).
Gramlot's `scripts/export_collections.py` copies these artifacts from the installed
package into `src/gramlot/collections/`; The JS package consumes its declared generic Builder exports; npm pack does not generate the installed generic Builder export. An optional source-directory argument supports local owning
checkouts. HTML remains the default; its SVG boundary now enters the registered
SVG builder. Static SVG belongs to genro-builders-js; native DOM creation and
updates belong to Gramlot's shared live renderer (GC-087 §075).

Generic Builder JS owns its collection loading and grammar rules. For the bounded Python dialect, Gramlot owns loading packaged HTML5 and additional collections, typed SourceBag registration, mixed text and atomic rejected insertion under amendment 11.16. Ordered collection composition adds or updates declared fields; omitted/null fields preserve prior values under amendment 11.14. Generic SourceBag/SourceBagNode dispatch owns navigation and declarations.
Gramlot adds mixed-text promotion and explicit builder references; recipes are deferred; it has no separate authoring facade or parameter whitelist.

<a id="gc-092-010"></a>

## 010 · Loading collections

Python (a document is a decoded JSON dictionary):

```python
builder = GramlotBuilder(collections=[controls_document])
builder.load_collection(another_document)
```

JavaScript:

```javascript
const builder = new GramlotBuilder(null, {collections: [controlsDocument]});
builder.loadCollection(anotherDocument);
```

For Python, GramlotBuilder loads its packaged default and additional 1.1 collections. JavaScript uses generic `loadGrammar`. Additional collections compose in order: additions and changes merge into named declarations, while omitted/null fields retain previous values. Failed loads leave the active schema unchanged.
No declaration from one builder instance leaks into another.

The browser runtime accepts `new Gramlot({collections: [controlsDocument], ...})`.
Recipe preprocessing is outside 0.1.0.
Collections must be explicitly available at the authoring and browser boundaries;
automatic distribution/discovery from Page metadata is not implemented here.

<a id="gc-092-015"></a>

## 015 · Validation and limits

Parameters are validated with their declared names, types, required presence,
Regex/Range/Literal constraints and signature openness. Defaults describe omitted
values; they are not inserted as Source attributes. Names such as `class_` and
`data_name` remain unchanged in Source; the DOM adapter converts their spelling.
Parent/child declarations and maximum cardinalities apply when building nodes;
minimum cardinalities require explicit final source validation.

HTML's existing signatures are open (`**kwargs`). Thus this collection does not
claim a complete HTML attribute-name checker: native custom/data attributes are
accepted according to the actual declaration. A `color` attribute is not shorthand
CSS and does not enable the deferred styling capability. No manual whitelist remains.

The DOM layer consults the active grammar and `_meta.render_tag`, so an extra
collection can map a logical element name to a custom DOM tag. This does not
register or implement a custom element: automatic class discovery/registration
and capability descriptions remain separate work.

Unknown portable types or unsupported regex constructs fail explicitly. JavaScript
regex support is a bounded interoperable subset, not arbitrary Python regex support.
HTML, SVG and CSS documents can be loaded independently in the generic loader.
Flat collection composition follows ordered add/update semantics; no removal marker is approved. SVG uses its registered subbuilder; static and live native integration is verified in GC-070.

The exported HTML content model enumerates allowed children. An additional collection may explicitly add or update named `sub_tags` child rules under amendment 11.14; omitted/null fields preserve existing rules. Automatic admission or discovery of custom elements in native containers is not implemented.

<a id="gc-092-020"></a>

## 020 · Verification and review

Integration tests use a real Python-decorated test collection exported to 1.1,
then consumed unchanged in both languages. They exercise invalid types/ranges,
required parameters, unknown parameters, parent/child rules, isolation, failed
merge, historical recipe propagation, custom render tags and Python-to-browser Source transport.
Core tests pass: Python 17/17, Node 41/41 and Bun 41/41. Generic JS owner
suite: 18/18 per runtime. DOM owner suite: 126/126 per runtime (14 pointer utility
tests run from their owning source because that legacy utility is not packaged).
Chromium passes Python/JS main, remote recipes and dynamic cleanup, plus a dedicated
additional-collection test with validation, custom render tag and canvas. Strict
Sphinx and public-boundary checks pass. See GC-070 for the current checkpoint.
Generic Python owner suite: 416 passed and the same two pre-existing failures
(XSD/Bag walk and resolver cache_time bool); focused loader/export/signature tests
pass. Loaded JSON grammars distinguish booleans from integer/float parameters,
without changing legacy decorator-built Python type checking.

Wheel and npm archives contain byte-identical HTML5 collections (117 declarations),
with no old resources/html.json. New artifacts are in
/private/tmp/collections-core-artifacts; owning Builder Python wheel is in
/tmp/genro-builders-grammar-loader-wheel. Installed JS dependencies came from
normal archive installs with restored floating manifests, without node_modules
implementation patches. Logs: /private/tmp/collections-final-*.log,
/private/tmp/collections-owner-dom-{node,bun}.log and
/private/tmp/collections-browser-custom.log.

The updated graph has core/browser verification above. The earlier complete
six-host/offline matrix was run before this collection revision and is historical;
this change does not claim a fresh rerun of every adapter. All source changes
remain local; no release, push or deployment is authorized.
