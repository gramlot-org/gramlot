# Extending Gramlot

Document ID: **GC-100**.

<a id="gc-100-005"></a>

## 005 · Choose the owning layer

| What you need to extend | Owner | Current entry point |
| --- | --- | --- |
| Page contents and metadata | Application | Subclass `Page` |
| Server routing, identity and HTTP I/O | Server adapter | Python `GramlotServer`; JS `GramlotServer`/`GramlotFileServer`; the rules are in [Server protocol](101-server-protocol.md) |
| Server-dependent browser behaviour | Server adapter | A `ServerAdapter` subclass named in the bootstrap ([Server protocol](101-server-protocol.md#gc-101-045)) |
| Reusable Source macros | Not provided | No recipe API |
| Static HTML text generation | Generic Builder JS | `HtmlBuilder` and `HtmlRenderer` |
| Reactive Source realization | Gramlot | `GramlotRenderer` (extends `GramlotHtmlRenderer`, which extends `HtmlRenderer`), `GramlotSvgRenderer` (extends `SvgRenderer`) and `HtmlElement` |
| Serialization, types and notifications | Bag/TYTX | Their registered-type and subscription contracts |
| Source grammar and builder association | Generic Builder JS | `SourceBag`, `BuilderBase`, `RendererBase` |
| Components and their collections | Gramlot | `defineComponent`, `defineCollection` and the bases and mixins of `@gramlot/gramlot/components` ([Components](105-components.md#gc-105-025)) |
| Named behavior | Application | The `Logic` export of the page module `foo.js`, else `class Logic` in `foo_aux.js`, or a `js_requires` resource |

The class extension points above exist, but their public compatibility is not
frozen. Keep HTTP server technology out of core. Missing shared behavior belongs in its
owning library, not in an application-local substitute.

<a id="gc-100-010"></a>

## 010 · Recipes

Recipes are not provided. There is no recipe declaration, registry or expansion
stage in the main/remote pipeline.

<a id="gc-100-015"></a>

## 015 · Extension contracts still to define

These contracts are not defined yet:

- **Third-party collection discovery:** package loading, class registration and extension of the HTML5 and SVG content models.
- **Controllers and resolvers:** declarations, lifecycle and Data ownership of
  controllers and resolvers written by a third party. `dataFormula`,
  `dataController` and named logic are in
  [Data binding and controllers](097-data-binding.md); `dataRpc` is in
  [Calling the server](098-server-calls.md); `remote` and the endpoint-backed
  `dataRemote` are in [Remote content and lazy Data](099-remote-content.md).
- **Database adapters:** shared operations and technology-specific implementations.

Do not infer a plugin loader, package naming convention or finalized class hierarchy
from these headings. A new capability needs a bounded contract, an owning library and behavior tests
before a runnable user example can rely on it.

Return to [Classes and server adapters](090-classes-and-hosts.md).


Shared grammars are `builder_grammar` 1.1 JSON collections, as described in
section 025. Use the same complete document for generic class-level grammar loading
or Gramlot's per-instance collections. Executable behavior remains in implementation
methods; there is no separate JS element/abstract declaration helper API.

Generic Builder JS bundles the HTML5 grammar and its static `HtmlBuilder` and
`HtmlRenderer`. They produce HTML text and accept the Python-compatible CSS keyword
and macro conventions. The live `GramlotRenderer` extends `GramlotHtmlRenderer`,
which extends Builder's `HtmlRenderer`, so the live DOM reuses its attribute and
style adaptation.

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
A later collection replaces whole every element or abstract it names and keeps the
others; `grammar` metadata merges key by key and a null value keeps the earlier one
(the genro-builders rule, which the Python loader applies too).
Mixed wildcard/cardinality rules remain unsupported. Defaults are descriptive, not automatically inserted attributes. Browser
`Gramlot` accepts the same `collections` option.
This is explicit loading, not automatic discovery or custom-element registration.
Gramlot redefines `dataSetter`, `dataFormula` and `dataController` in its
own collection, `binding.json`, loaded after the HTML5 collection in Python and
JavaScript. The binding attributes it declares never reach the DOM.
The HTML5 collection's open parameter signatures do not become a manual attribute whitelist.
Custom children must satisfy their parent's declared content model; this API does
not automatically amend HTML child lists.


<a id="gc-100-030"></a>

## 030 · HTML void metadata

HTML void elements declare `"_meta": {"void": true}` in their collection.
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

The generic Python and JS Builders resolve explicit attribute pointer templates
(`title="^name:Customer: {}"`). Ordinary `${name}` text and a preceding backslash
remain literal. Named slots retain their referenced attributes. Static expression
suffixes (`:=`) are inert until the Gramlot browser runtime supplies its compiler.
Static HTML rendering accepts a terminal `::HTML` marker to omit escaping and
removes that marker. This is not a new live-renderer capability.


<a id="gc-100-095"></a>

## 095 · An explicitly loaded Web Component

Declare a custom element without a dedicated Python builder:

```python
pane.webcomponent(code="gramlot-poc-tree")
```

JavaScript authoring uses `pane.webcomponent({code: 'gramlot-poc-tree'})`.
`code` is a required literal custom-element name. Gramlot emits that tag, consumes
`code`, and renders declared child Source and ordinary scalar attributes. Existing
`connect_on...` declarations handle its browser events. Load and register the
component module explicitly before use; this declaration does not import it.

Object properties, such as a tree's Bag, are not HTML attributes. The provisional
inspector assigns `storeBag` in its JavaScript implementation. Generic declarative
Bag properties are not provided. The temporary tree is used by
the optional inspector; it remains a provisional tool component, not a general
application widget API.
