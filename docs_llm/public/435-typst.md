# Typst previews

Document ID: **GC-435**.

<a id="gc-435-start"></a>
## Start here

Render a Typst document using the preview component. Compiler/worker resources are separate from ordinary input and layout components.

`typst` is outside the standard set: a page that uses it declares it in `Page.gramlots` ([declaring typst](340-components-and-collections-guide.md#gc-340-050-typst)). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-typst).

Load `document.source` as text before rendering, or bind an editor to the same path. Compiler resources and document assets must be available to the configured preview engine. Do not infer a server endpoint from this component declaration. [Compilation and resource contract](105-components.md#gc-105-145).

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)


<a id="gc-435-005"></a>
<a id="gc-435-010"></a>

Ordinary Source/CSS attributes remain in Writing pages and Themes and CSS.
Pages inherit environment collections; Page.gramlots adds missing ones. Buttons are built in.
Contract JSON omits only undeclared keys: no default is not the same as null. dtype: T text, B Boolean, L integer, R real, X structured value; remaining codes are TYTX. binding: read = Data to widget, write = widget to Data, twoWay = both. nullable permits None; enum restricts values; annotation preserves type/regex constraints. Parameters sharing a table row have exactly the same contract. Child grammar: * allows arbitrary Source children; empty permits none. Parent None means no declared restriction.


<a id="gc-435-220"></a>
<a id="gc-435-shared-value"></a>
## Values and bindings

The value type and writeback behavior depend on the control. Use a Data pointer for binding; see [Data binding](097-data-binding.md).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `value` | `{"binding":"read","default":"","dtype":"T"}` | typstPreview |

<a id="gc-435-425"></a>
## Editors and document previews


<a id="gc-435-215"></a>
<a id="gc-435-typstpreview"></a>
### `typstPreview`

Collection: typst. Typst document preview with client SVG and PDF compilation; compiler resources are separate from ordinary forms.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-typstpreview).


**Data contract.** Reads the Typst source from value and the download name from filename. SVG, PDF and diagnostics stay inside the browser preview. The current Worker produces SVG and PDF for each successful preview revision.


**Interaction and events.** Changes schedule compilation after a short pause. The current result enables download and diagnostics appear in the widget. It declares no completion callback.


**Composition.** Leaf control. Pair it with codeMirror from the separate editors collection to edit the same draft.


**Limits and lifecycle.** The browser Worker uses a bundled compiler and fonts. Includes, custom assets and external packages are outside the browser preview contract. Source changes invalidate prior output immediately. Removing the last preview releases the shared Worker.

Shared contracts: [Values and bindings](#gc-435-shared-value).


| Parameters | Contract |
| --- | --- |
| `filename` | `{"binding":"read","default":"document.pdf","dtype":"T"}` |

Child grammar: `''`; parent grammar: `None`.
