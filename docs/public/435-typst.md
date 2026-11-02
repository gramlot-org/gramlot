# Typst previews

Document ID: **GC-435**.

<a id="gc-435-start"></a>
## Start here

Render a Typst document using the preview component. Compiler/worker resources are separate from ordinary input and layout components.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). Example body for `main(self, root)`:

```python
root.typstPreview(value="^document.source", height="360px")
```

Load `document.source` as text before rendering, or bind an editor to the same path. Compiler resources and document assets must be available to the configured preview engine. Do not infer a server endpoint from this component declaration. [Compilation and resource contract](105-components.md#gc-105-145).

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)


<a id="gc-435-005"></a>
<a id="gc-435-010"></a>
Types: T text, B Boolean, L integer, R real, X structured value; other codes are TYTX. Binding: read = Data to widget; write = widget to Data; twoWay = both. A dash means no declared default/binding. None is a declared value. Constraints include enum, qualification, target and annotations. Tables describe component contracts; ordinary Source/CSS attributes are shared.


## Shared parameter contracts

Each widget below links only the shared contracts it supports. A shared name can have different types, defaults or bindings; separate rows preserve those differences.


<a id="gc-435-220"></a>
<a id="gc-435-shared-value"></a>
## Values and bindings

The value type and writeback behavior depend on the control. Use a Data pointer for binding; see [Data binding](097-data-binding.md).

Applies to: [typstPreview](#gc-435-typstpreview).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `value` | T | '' | read | — | All listed above |

<a id="gc-435-425"></a>
## Editors and document previews


<a id="gc-435-215"></a>
<a id="gc-435-typstpreview"></a>
### `typstPreview`

Typst document preview and optional client PDF compilation; compiler resources are separate from ordinary forms.

Collection: **typst**. Browser element: `gramlot-typst-preview`.

[Typst compiler and resource ownership](105-components.md#gc-105-145).

Shared contracts: [Values and bindings](#gc-435-shared-value).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `filename` | T | 'document.pdf' | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.
