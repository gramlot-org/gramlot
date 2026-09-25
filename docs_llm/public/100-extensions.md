# Extending Gramlot

Document ID: **GC-100**. Native 0.1.2 APIs; planned 0.2.0 changes are marked.

> **Release status.** Describes **0.2.0 (HTML/SVG data binding), in development**:
> an approved plan, not yet implemented, tested or released. Latest published
> release: **0.1.2**. Unmarked text is 0.1.2.

<a id="gc-100-005"></a>

## 005 · Choose the owning layer

| Need | Owner / entry point |
| --- | --- |
| Page content/metadata | Application `Page` subclass |
| Routing, identity, HTTP | Python `Host`; JS `Host`/`FileHost` adapter |
| Reusable Source macros | Deferred; no active recipe API |
| Static HTML text | Generic HtmlBuilder + HtmlRenderer |
| Reactive DOM | GramlotRenderer (extends RendererBase) + HtmlElement |
| Types, serialization, notifications | Bag/TYTX contracts |
| Source grammar/association | Generic SourceBag, BuilderBase, RendererBase |
| *0.2.0:* page behavior | Application `class Logic` in companion or `js_requires` resource |

These extension points exist but compatibility is not frozen. Keep host technology
out of core; implement missing shared behavior in its owning library, not locally.

<a id="gc-100-010"></a>

## 010 · Recipes deferred

Recipes are outside the active scope. There is no recipe declaration, registry or
expansion stage in the current main/remote pipeline. Their contract will be
specified separately before implementation.

<a id="gc-100-015"></a>

## 015 · Extension contracts still to define

Open outlines: component/mixin parameters and cleanup; third-party collection
naming/registration/discovery/collisions; Python authoring from JS descriptions;
controller/resolver lifecycle and Data ownership (*0.2.0:* `dataFormula`,
`dataController` and named logic defined, [GC-095 055](095-writing-pages.md);
resolvers open); shared versus technology-specific
database operations. These headings define no plugin loader, package convention or
final hierarchy. Each capability needs a bounded contract, owner and behavior tests
before examples rely on it.

Return to [Classes and server adapters](090-classes-and-hosts.md).


Shared grammars are `builder_grammar` 1.1 JSON collections, as described in
section 025. Use the same complete document for generic class-level grammar loading
or Gramlot's per-instance collections. Executable behavior remains in implementation
methods; there is no separate JS element/abstract declaration helper API.

Builder JS bundles the HTML5 grammar and static HtmlBuilder/HtmlRenderer, producing
HTML text with Python-compatible CSS keyword/macro conventions. Gramlot live
rendering does not yet reuse the dialect's `adaptAttrs`; this move changes neither
Source/typed grammar authoring nor the absence of labels and bindings.

Main/remote Source blocks are validated at reception, then inserted into the
observed Source. DOM construction starts from the emitted Bag event. Direct writes
update only the affected node/subtree; there is no speculative DOM, whole-tree
revalidation per event or Source rollback when rendering fails.


<a id="gc-100-025"></a>

## 025 · Loading declarative collections

Loading a collection preserves the builder document name. Object-member order in
JSON does not change a declaration; array order and differing values still matter.

Both GramlotBuilder implementations accept additional `builder_grammar` 1.1 JSON
objects: Python `GramlotBuilder(collections=[document])`, JavaScript
`new GramlotBuilder(null, {collections: [document]})`. The default HTML5 collection
is generated from the owning grammar. Later documents use the same format.

JavaScript uses the generic Builder loader and `Collection`. Python GramlotBuilder
loads and composes its packaged dialect through Gramlot's `page/_grammar_load.py`
and `page/_collection.py`, under the approved Python authoring boundary. Both
paths validate declared parameters and structural constraints and isolate instances.
Omitted/null fields preserve previous values; supplied fields update them. Named
parameters and child rules combine by name; nested metadata merges recursively.
An existing wildcard remains open when a later collection adds bare child names.
Mixed wildcard/cardinality rules remain unsupported. Defaults are descriptive, not automatically inserted attributes. Browser
`Gramlot` accepts the same `collections` option.
This is explicit loading, not automatic discovery or custom-element registration.
*0.2.0:* Gramlot redefines `dataSetter`/`dataFormula`/`dataController` in its own
`binding.json` collection, loaded after HTML5 in Python and JS; its binding attributes never reach the DOM.
Native HTML's open parameter signatures do not become a manual attribute whitelist.
Custom children must satisfy their parent's declared content model; this API does
not automatically amend HTML child lists.


<a id="gc-100-030"></a>

## 030 · HTML void metadata

Native HTML void elements declare `"_meta": {"void": true}` in their collection.
The owning Python element declarations export this metadata unchanged to JSON.
Python and JavaScript static HTML renderers use it to omit the end tag; Gramlot's
DOM handler uses it to omit the element's text child. No renderer maintains a
separate HTML void-tag list. Metadata does not become a DOM attribute.

`sub_tags: ""` prohibits child elements; it does not imply void output. For example,
`br` is void, while an empty `textarea` still renders `<textarea></textarea>`.
`void` is an HTML semantic, not SVG's optional empty-element abbreviation.


<a id="gc-100-035"></a>

## 035 · Shared XML serialization for SVG

The Python and JavaScript `SvgRenderer` classes specialize `XmlRenderer` for SVG
attribute spelling. They reuse XML composition, escaping, namespaces and optional
document headers. SVG has no list of void elements: an empty rectangle renders
`<rect></rect>`, and `metadata("license")` retains its text as
`<metadata>license</metadata>`.

Python keeps lowercase `true`/`false` attribute values, including at HTML-to-SVG
dialect boundaries. `stroke_width` still maps to `stroke-width` within SVG.
No XML header is emitted by default; a standalone rendering may explicitly request
`doc_header=True` in Python or `docHeader: true` in JavaScript. This concerns static
markup. Gramlot continues to own reactive DOM rendering.


<a id="gc-100-090"></a>

## 090 · Static templates and raw HTML

The generic Python and JS Builders interpolate `${name}` only in attributes.
A preceding backslash escapes a token; node content is not interpolated.
Static HTML rendering accepts a terminal `::HTML` marker to omit escaping and
removes that marker. This is not a new live-renderer capability.
