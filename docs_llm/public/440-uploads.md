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

Ordinary Source/CSS attributes remain in Writing pages and Themes and CSS.
Pages inherit environment collections; Page.gramlots adds missing ones. Buttons are built in.
Contract JSON omits only undeclared keys: no default is not the same as null. dtype: T text, B Boolean, L integer, R real, X structured value; remaining codes are TYTX. binding: read = Data to widget, write = widget to Data, twoWay = both. nullable permits None; enum restricts values; annotation preserves type/regex constraints. Parameters sharing a table row have exactly the same contract. Child grammar: * allows arbitrary Source children; empty permits none. Parent None means no declared restriction.


<a id="gc-440-220"></a>
<a id="gc-440-shared-value"></a>
## Values and bindings

The value type and writeback behavior depend on the control. Use a Data pointer for binding; see [Data binding](097-data-binding.md).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `value` | `{"binding":"twoWay","default":null,"dtype":"T","nullable":true}` | imageUploader |

<a id="gc-440-225"></a>
<a id="gc-440-shared-state"></a>
## Disabled, readonly and live updates

Disabled prevents interaction; readonly preserves reading without accepting edits. live controls when edits reach Data. See [Field behavior](105-components.md#gc-105-040).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `disabled` | `{"binding":"read","default":false,"dtype":"B"}` | uploader, imageUploader, attachmentManager |

<a id="gc-440-335"></a>
## File uploads


<a id="gc-440-340"></a>
<a id="gc-440-uploader"></a>
### `uploader`

Collection: uploads. Shared file queue with progress, preview, selected-file metadata and application-owned upload targets.

Shared contracts: [Disabled, readonly and live updates](#gc-440-shared-state).


| Parameters | Contract |
| --- | --- |
| `operation, storepath` | `{"dtype":"T"}` |
| `contextPath, onComplete` | `{"default":null,"dtype":"T","nullable":true}` |
| `accept` | `{"binding":"read","default":"","dtype":"T"}` |
| `multiple` | `{"binding":"read","default":false,"dtype":"B"}` |
| `autoUpload, manualUpload` | `{"binding":"read","default":true,"dtype":"B"}` |
| `selectedPath` | `{"binding":"twoWay","default":null,"dtype":"T","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-440-345"></a>
<a id="gc-440-imageuploader"></a>
### `imageUploader`

Collection: uploads. Editable image value with local crop or an application-owned upload destination.

Shared contracts: [Values and bindings](#gc-440-shared-value), [Disabled, readonly and live updates](#gc-440-shared-state).


| Parameters | Contract |
| --- | --- |
| `storepath` | `{"dtype":"T"}` |
| `contextPath, operation, onComplete` | `{"default":null,"dtype":"T","nullable":true}` |
| `cropWidth, cropHeight` | `{"default":256,"dtype":"L"}` |
| `outputWidth, outputHeight` | `{"default":512,"dtype":"L"}` |

Child grammar: `''`; parent grammar: `None`.

<a id="gc-440-350"></a>
<a id="gc-440-attachmentmanager"></a>
### `attachmentManager`

Collection: uploads. Reusable attachment queue and list backed by application operations.

Shared contracts: [Disabled, readonly and live updates](#gc-440-shared-state).


| Parameters | Contract |
| --- | --- |
| `operation, storepath, contextPath, listMethod, readMethod, removeMethod` | `{"dtype":"T"}` |
| `ready` | `{"binding":"read","default":false,"dtype":"B"}` |
| `accept` | `{"binding":"read","default":"","dtype":"T"}` |
| `selectedPath` | `{"binding":"twoWay","default":null,"dtype":"T","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.
