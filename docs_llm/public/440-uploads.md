# Uploads and attachments

Document ID: **GC-440**.

<a id="gc-440-start"></a>
## Start here

Use an uploader for a file queue, an imageUploader for an editable image, or attachmentManager for an attachment list. Upload destinations remain application-owned.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-uploads).

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


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-uploader).


**Data contract.** Initialize a Bag at storepath for queue rows and progress. selectedPath writes the queue-relative row label and clears when that row is removed. Files and temporary grants stay outside Data. Preparation snapshots row metadata fields and the optional contextPath Bag separately.


**Interaction and events.** Selection and drop add files. autoUpload starts queued files, including when enabled after selection. In deferred mode manualUpload controls the Upload action. onComplete names Page Logic receiving item and result after confirmed completion.


**Composition.** Leaf control. Place ordinary metadata controls beside it and bind them to the selected row's metadata Bag. Give them an empty scope when no row is selected.


**Limits and lifecycle.** The host and application operation own authorization and storage. Check status reconciles uncertain outcomes before retry. Local preview covers safe text and raster images. File-origin WebKit Workers can fail to read selected File objects.

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


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-imageuploader).


**Data contract.** Bind value two ways and initialize a queue Bag at storepath. Crop confirmation writes a PNG data URL in browser-only mode or a displayable URL returned by the application operation in transfer mode. External value changes supersede open edits.


**Interaction and events.** Select or drop one image, move, zoom or rotate the crop, then confirm or cancel. Camera and screen capture feed the same crop path when available. Server-mode onComplete receives item and result after confirmed transfer.


**Composition.** Leaf control with its own crop dialog. Compose surrounding form controls normally and share contextPath when the upload operation needs it.


**Limits and lifecycle.** Input supports PNG, JPEG and WebP. Positive integer crop and output dimensions must have the same aspect ratio. Remote editing requires canvas-compatible URL access. Camera needs a capable device provider and permission, with a secure context for browser capture. Screen capture depends on browser support and permission. Stored files remain under application control after value is cleared.

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


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-attachmentmanager).


**Data contract.** Initialize queue and record context Bags at storepath and contextPath. Update context before ready enables queued uploads. selectedPath addresses a queue row for metadata editing. The list endpoint provides opaque attachment IDs and captions.


**Interaction and events.** The manager refreshes its list after confirmed upload, calls readMethod for preview and removeMethod for deletion. Context changes clear the old selection and discard stale responses. Failed removal retains selection and reports an error. It declares no public onComplete.


**Composition.** Leaf control composing its own multiple-file queue, list and preview. External metadata fields can bind to the selected queue row.


**Limits and lifecycle.** The application supplies operation, listMethod, readMethod and removeMethod and owns authorization and persistence. Preview responses distinguish text, image and message. Removal requires a true result.

Shared contracts: [Disabled, readonly and live updates](#gc-440-shared-state).


| Parameters | Contract |
| --- | --- |
| `operation, storepath, contextPath, listMethod, readMethod, removeMethod` | `{"dtype":"T"}` |
| `ready` | `{"binding":"read","default":false,"dtype":"B"}` |
| `accept` | `{"binding":"read","default":"","dtype":"T"}` |
| `selectedPath` | `{"binding":"twoWay","default":null,"dtype":"T","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.
