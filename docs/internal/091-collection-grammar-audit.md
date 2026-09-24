# 091 · Collection grammar export audit

Document ID: **GC-091**. Updated: **2026-09-19**.

<a id="gc-091-005"></a>

## 005 · Owner direction and scope

Collections must describe the existing element declaration contract, using the
existing grammar exporter rather than a manual restricted HTML inventory. Future
JS class definitions should supply descriptions and automatic custom-element
registration. Native elements need no custom-element registration. Element names
and implementation classes do not retain the legacy Gnr prefix.

This increment fixes Python grammar export only. It does not invent a capability
hierarchy, register components or port widgets. Styling, binding, labeling and
boxing remain capability design work. The native HTML slice passed its tests but
its manual vocabulary/authoring adapters are now under architectural revision.

<a id="gc-091-010"></a>

## 010 · Findings and owning correction

`genro-builders` already exports `builder_grammar` with abstracts/elements,
documentation, child/parent constraints, inheritance, namespace and renderer metadata.
Version 1.0 omitted node_label, collection_key and every parameter descriptor;
attributes was always null. Unannotated defaults and parameter kinds/order were
already discarded before export by runtime-oriented signature extraction.

The local owning repository now exports version 1.1. It captures the declaration
signature before removing markers and exports ordered parameters, kinds, defaults,
types, variadic openness, value/framework roles and built-in Regex/Range constraints.
Abstract signatures and inherited declarations are preserved too. Runtime call
validation is unchanged. Specification: genro-builders
`src/genro_builders/builder/GRAMMAR_FORMAT.md`.

Unknown callable validators, unsupported annotations, non-JSON defaults and
metadata cause explicit failure before overwriting the output. There is no lossy
string fallback. Named type/validator descriptors still require a consumer mapping;
they are not executable implementations. Arbitrary Python defaults are not yet
portable; this limitation is explicit rather than hidden.

<a id="gc-091-015"></a>

## 015 · Evidence and remaining work

Focused exporter/signature tests: 32 passed. Full owning-library suite: 409 passed,
2 failed. Both failures reproduce using the pre-change exporter/base/utilities:
XSD incomplete-invoice validation against Bag walk, and resolver cache_time=True
against current Bag. Baseline logs are in /private/tmp/grammar-export-baseline-tests.log;
full log in /private/tmp/grammar-export-full-tests.log. No dependency was pinned.

Generated HTML (117 declarations), SVG (58), CSS (9) version 1.1 documents in
/private/tmp/grammar-export-1.1. The installed JS generic loader retains the new
attributes/node_label/collection_key descriptors for every declaration. This check
is preservation, not execution of their validation rules.

Next: implement/verify consumer semantics for the exported constraints, establish
collection descriptions from this contract and remove Gramlot's manual html.json
and duplicate authoring validation. Native HTML/SVG support must reuse the existing
dialects. Do not claim the old first-step architectural review is accepted.

Source changes are local in
/Users/gporcari/Sviluppo/genro_ng/meta-genro-modules/sub-projects/genro-builders,
on refactor/37-datastore-root, alongside preserved older uncommitted changes.
Existing installed wheels and the earlier native-HTML archives have not been rebuilt
with this change. No commit, push, package publication or deployment occurred.
