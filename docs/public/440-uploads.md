# Uploads and attachments

Document ID: **GC-440**.

<a id="gc-440-start"></a>
## Start here

Use an uploader for a file queue, an imageUploader for an editable image, or attachmentManager for an attachment list. Upload destinations remain application-owned.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). Example body for `main(self, root)`:

```python
root.uploader(operation="receive", storepath="uploads",
              selectedPath="^selectedUpload")
```

Initialize `uploads` as an empty Data Bag before rendering. This body requires the host/application upload operation `receive`. Queue/progress state goes into the Data Bag at `uploads`; selecting a queued file writes the bound `selectedPath`. Declaring the control does not configure storage or permissions. [Upload operations, callbacks and limits](105-components.md#gc-105-uploader). Keep the documented WebKit limitation when qualifying file-input behavior; do not claim that browser automation validates every native chooser interaction.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)


<a id="gc-440-005"></a>
<a id="gc-440-010"></a>
Types: T text, B Boolean, L integer, R real, X structured value; other codes are TYTX. Binding: read = Data to widget; write = widget to Data; twoWay = both. A dash means no declared default/binding. None is a declared value. Constraints include enum, qualification, target and annotations. Tables describe component contracts; ordinary Source/CSS attributes are shared.


## Shared parameter contracts

Each widget below links only the shared contracts it supports. A shared name can have different types, defaults or bindings; separate rows preserve those differences.


<a id="gc-440-220"></a>
<a id="gc-440-shared-value"></a>
## Values and bindings

The value type and writeback behavior depend on the control. Use a Data pointer for binding; see [Data binding](097-data-binding.md).

Applies to: [imageUploader](#gc-440-imageuploader).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `value` | T or None | None | twoWay | — | All listed above |

<a id="gc-440-225"></a>
<a id="gc-440-shared-state"></a>
## Disabled, readonly and live updates

Disabled prevents interaction; readonly preserves reading without accepting edits. live controls when edits reach Data. See [Field behavior](105-components.md#gc-105-040).

Applies to: [uploader](#gc-440-uploader), [imageUploader](#gc-440-imageuploader), [attachmentManager](#gc-440-attachmentmanager).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `disabled` | B | False | read | — | All listed above |

<a id="gc-440-335"></a>
## File uploads


<a id="gc-440-340"></a>
<a id="gc-440-uploader"></a>
### `uploader`

Shared file queue with progress, preview, selected-file metadata and application-owned upload targets.

Collection: **uploads**. Browser element: `gramlot-uploader`.

[File uploads and metadata](105-components.md#gc-105-uploader).

Shared contracts: [Disabled, readonly and live updates](#gc-440-shared-state).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `operation` | T | — | — | — |
| `storepath` | T | — | — | — |
| `contextPath` | T or None | None | — | — |
| `accept` | T | '' | read | — |
| `multiple` | B | False | read | — |
| `autoUpload` | B | True | read | — |
| `manualUpload` | B | True | read | — |
| `selectedPath` | T or None | None | twoWay | — |
| `onComplete` | T or None | None | — | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-440-345"></a>
<a id="gc-440-imageuploader"></a>
### `imageUploader`

Editable image value with local crop or an application-owned upload destination.

Collection: **uploads**. Browser element: `gramlot-image-uploader`.

[File uploads and metadata](105-components.md#gc-105-uploader).

Shared contracts: [Values and bindings](#gc-440-shared-value), [Disabled, readonly and live updates](#gc-440-shared-state).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `storepath` | T | — | — | — |
| `contextPath` | T or None | None | — | — |
| `operation` | T or None | None | — | — |
| `cropWidth` | L | 256 | — | — |
| `cropHeight` | L | 256 | — | — |
| `outputWidth` | L | 512 | — | — |
| `outputHeight` | L | 512 | — | — |
| `onComplete` | T or None | None | — | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-440-350"></a>
<a id="gc-440-attachmentmanager"></a>
### `attachmentManager`

Reusable attachment queue and list backed by application operations.

Collection: **uploads**. Browser element: `gramlot-attachment-manager`.

[File uploads and metadata](105-components.md#gc-105-uploader).

Shared contracts: [Disabled, readonly and live updates](#gc-440-shared-state).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `operation` | T | — | — | — |
| `storepath` | T | — | — | — |
| `contextPath` | T | — | — | — |
| `ready` | B | False | read | — |
| `listMethod` | T | — | — | — |
| `readMethod` | T | — | — | — |
| `removeMethod` | T | — | — | — |
| `accept` | T | '' | read | — |
| `selectedPath` | T or None | None | twoWay | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.
