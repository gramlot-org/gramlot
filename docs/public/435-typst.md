# Typst previews

Document ID: **GC-435**.

<a id="gc-435-start"></a>
## Start here

Render a Typst document using the preview component. Compiler/worker resources are separate from ordinary input and layout components.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-typst).

Load `document.source` as text before rendering, or bind an editor to the same path. Compiler resources and document assets must be available to the configured preview engine. Do not infer a server endpoint from this component declaration. [Compilation and resource contract](105-components.md#gc-105-145).

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)

## Choosing and using the preview

`typstPreview` is a document reader/compiler surface, rather than a text editor. Use it when a Data string already contains Typst source and the user needs to inspect the document or download its PDF. To edit that string, place `codeMirror` from the separate `editors` collection beside the preview and bind both to the same Data path. The editor writes the draft; `typstPreview.value` reads it. `filename` controls the download name and can also read a binding; downloading does not save the source document.

[Code for this composition is in the appendix](465-widget-examples.md#gc-465-setup-typst).

Initialize `.content` as text. Include both collections in the environment Page when using this pair; importing a collection descriptor alone does not activate it. See [collection setup](340-components-and-collections-guide.md#gc-340-050) and [the Typst contract](105-components.md#gc-105-145).

### Updates, diagnostics and resource limits

Changes to the Typst text schedule browser compilation after a short pause. The current Worker compiles both SVG and PDF for every successful revision; downloading retrieves that PDF rather than starting a separate compilation. The widget immediately hides the previous SVG and disables the previous PDF link, so a user cannot download an apparently current document while a newer draft is compiling. Diagnostics appear in the widget. Late compilation results cannot replace a newer revision. There is no declared completion callback or Data writeback parameter: use the bound source as application state, rather than treating the downloaded PDF as a saved Data value.

The collection bundles its compiler, renderer and five fonts, and shares a browser Worker between previews. Self-contained documents can compile offline; the initial component does not supply includes, custom assets or external packages. Missing resources produce diagnostics. Removing the last preview releases the Worker. The module is large, so select this optional collection only where needed. A browser preview declaration does not create a server compilation endpoint or execute Python recipes. Compiler-version differences and export restrictions are documented in [compiler and resource ownership](105-components.md#gc-105-145).

## Choose a component

- [`typstPreview`](#gc-435-typstpreview): Typst document preview with client SVG and PDF compilation; compiler resources are separate from ordinary forms.


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

Typst document preview with client SVG and PDF compilation; compiler resources are separate from ordinary forms.

Collection: **typst**. Browser element: `gramlot-typst-preview`.

[Typst compiler and resource ownership](105-components.md#gc-105-145).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-typstpreview).


**Data contract.** Reads the Typst source from value and the download name from filename. SVG, PDF and diagnostics stay inside the browser preview. The current Worker produces SVG and PDF for each successful preview revision.


**Interaction and events.** Changes schedule compilation after a short pause. The current result enables download and diagnostics appear in the widget. It declares no completion callback.


**Composition.** Leaf control. Pair it with codeMirror from the separate editors collection to edit the same draft.


**Limits and lifecycle.** The browser Worker uses a bundled compiler and fonts. Includes, custom assets and external packages are outside the browser preview contract. Source changes invalidate prior output immediately. Removing the last preview releases the shared Worker.

Shared contracts: [Values and bindings](#gc-435-shared-value).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `filename` | T | 'document.pdf' | read | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.
