# Extending Gramlot

Document ID: **GC-100**. Native 0.1.2 APIs; planned 0.2.0 changes are marked.

> **Release status.** This page describes Gramlot **0.2.0 (HTML/SVG data
> binding), in development**. 0.2.0 is an approved plan: its code is not yet
> implemented, tested or released. The latest published release is **0.1.2**.
> Text without a *0.2.0* mark describes 0.1.2 behavior.

<a id="gc-100-005"></a>

## 005 · Choose the owning layer

| What you need to extend | Owner | Current entry point |
| --- | --- | --- |
| Page contents and metadata | Application | Subclass `Page` |
| Server routing, identity and HTTP I/O | Server adapter | Python `Host`; JS `Host`/`FileHost` |
| Reusable Source macros | Deferred | No active recipe API |
| Static HTML text generation | Generic Builder JS | `HtmlBuilder` and `HtmlRenderer` |
| Reactive Source realization | Gramlot | `GramlotRenderer` (extends `RendererBase`) and `HtmlElement` |
| Serialization, types and notifications | Bag/TYTX | Their registered-type and subscription contracts |
| Source grammar and builder association | Generic Builder JS | `SourceBag`, `BuilderBase`, `RendererBase` |
| *0.2.0:* page behavior | Application | `class Logic` in the companion or a `js_requires` resource |

The class extension points above exist, but their public compatibility is not
frozen. Keep host technology out of core. Missing shared behavior belongs in its
owning library, not in an application-local substitute.

<a id="gc-100-010"></a>

## 010 · Recipes deferred

Recipes are outside the active scope. There is no recipe declaration, registry or
expansion stage in the current main/remote pipeline. Their contract will be
specified separately before implementation.

<a id="gc-100-015"></a>

## 015 · Extension contracts still to define

The following sections deliberately remain outlines:

- **Component bases and mixins:** parameters, description, requirements and cleanup contracts.
- **Third-party collection discovery:** package loading, class registration and extension of native content models.
- **Python authoring from JS descriptions:** metadata transport and generated authoring surface.
- **Controllers and resolvers:** declarations, lifecycle and Data ownership.
  *0.2.0:* the plan defines `dataFormula`, `dataController` and named logic
  ([Writing pages](095-writing-pages.md)); resolvers remain open.
- **Database adapters:** shared operations and technology-specific implementations.

Do not infer a plugin loader, package naming convention or finalized class hierarchy
from these headings. They are the questions the next increments must settle. A
new capability needs a bounded contract, an owning library and behavior tests
before a runnable user example can rely on it.

Return to [Classes and server adapters](090-classes-and-hosts.md).


Shared grammars are `builder_grammar` 1.1 JSON collections, as described in
section 025. Use the same complete document for generic class-level grammar loading
or Gramlot's per-instance collections. Executable behavior remains in implementation
methods; there is no separate JS element/abstract declaration helper API.

Generic Builder JS now bundles the HTML5 grammar and its static `HtmlBuilder` and
`HtmlRenderer`. They produce HTML text and accept the Python-compatible CSS keyword
and macro conventions. This does not add live CSS integration to Gramlot: the
reactive renderer does not yet reuse the dialect's `adaptAttrs` behavior. Source
authoring and typed grammar remain unchanged, and this boundary move adds neither
labels nor bindings.

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
*0.2.0:* Gramlot redefines `dataSetter`, `dataFormula` and `dataController` in its
own collection, `binding.json`, loaded after the HTML5 collection in Python and
JavaScript. The binding attributes it declares never reach the DOM.
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
