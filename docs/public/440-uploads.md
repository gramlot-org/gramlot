# Uploads and attachments

Document ID: **GC-440**.

<a id="gc-440-start"></a>
## Start here

Use an uploader for a file queue, an imageUploader for an editable image, or attachmentManager for an attachment list. Upload destinations remain application-owned.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-uploads).

Initialize `uploads` as an empty Data Bag before rendering. This body requires the host/application upload operation `receive`. Queue/progress state goes into the Data Bag at `uploads`; selecting a queued file writes the bound `selectedPath`. Declaring the control does not configure storage or permissions. [Upload operations, callbacks and limits](105-components.md#gc-105-uploader). Keep the documented WebKit limitation when qualifying file-input behavior; do not claim that browser automation validates every native chooser interaction.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)

## Choose the control by the stored result

Use `uploader` for a file queue whose progress and per-file metadata matter; use `imageUploader` for one editable image value; use `attachmentManager` for queued uploads combined with an existing attachment list, preview and removal. All three read `disabled`. Initialize each `storepath` as a Data Bag before rendering. A queue contains serializable metadata and progress, not browser File objects or upload authorization. Storage destinations, access checks and cleanup belong to the application's upload operation, not to a browser-selected path. See [upload operations and metadata](105-components.md#gc-105-uploader).

### `uploader`: prepare metadata before starting

`operation` names the application's upload operation and `storepath` identifies the queue. `accept` guides file selection, while `multiple` enables several files; server validation remains necessary. Selection and drop start uploads when `autoUpload=True`. With `autoUpload=False`, `manualUpload=True` leaves an Upload action for the user. Setting `manualUpload=False` hides and disables that action; a later transition of `autoUpload` to true starts queued files too.

`selectedPath` is a two-way binding to a row label relative to `storepath`, not an absolute filesystem path. Removing that selected row clears the selection. Each row's `metadata` Bag can back ordinary bound controls. Give an unselected metadata editor its own empty Data scope, so it does not create accidental queue rows. Edit metadata while a row is queued: automatic upload takes its snapshot immediately.

[Code for this composition is in the appendix](465-widget-examples.md#gc-465-setup-uploads).

Here `.queue` must already be a Bag and `receive` must be implemented by the application. `onComplete` names a Page Logic method receiving `item` and `result`; it is not Python source embedded in the attribute. Optional `contextPath` resolves to another Data Bag whose current contents are sent as `metadata["context"]` during preparation, separately from the row's `metadata["fields"]`. Set record context before enabling deferred uploads. Context is client input, not proof of identity.

The queue supports removal, progress and safe local text/raster previews. A connection failure with an uncertain outcome requires status reconciliation before retry; Check status exposes that step. Host recovery capabilities vary. In particular, file-origin WebKit Workers have a documented File-reading limitation; browser automation does not establish universal native chooser support. See [host and browser limitations](105-components.md#gc-105-uploader).

### `imageUploader`: confirm one cropped PNG

Bind `value` two ways to the displayed image. Without `operation`, confirmation writes a browser data URL. With an operation, the application stores the PNG and returns the displayable URL written to `value`. The required queue Bag still tracks transfer state; `contextPath` and `onComplete` serve the same upload-context/completion roles described above.

PNG, JPEG and WebP input can be selected or dropped, but confirmed output is PNG. Set positive integer `cropWidth`, `cropHeight`, `outputWidth` and `outputHeight` with matching aspect ratios. The crop editor supports moving, zooming and rotating, with keyboard and touch alternatives described in [editable images](105-components.md#gc-105-uploader). Original image/framing are retained while mounted. Editing an existing remote image requires canvas-compatible URL access, including CORS where applicable. Clearing `value` does not delete the application's stored image.

Camera capture appears only with an attached device provider supporting `camera`; browser capture requires an explicitly attached browser provider, a secure context and permission. Screen capture depends on browser support and permission. Both feed the same crop/confirmation path; cancellation preserves the current image. These are capabilities to configure, not guarantees created by an `imageUploader` declaration.

### `attachmentManager`: gate transfer on saved context

Supply `operation`, queue `storepath`, context Bag `contextPath`, and the three application endpoint names `listMethod`, `readMethod`, `removeMethod`. Bind `ready` to whether the record is ready for attachment operations. While false, selected files stay queued; update the context Bag before setting it true. The manager internally uses multiple-file automatic upload gated by `ready`, and refreshes the attachment list after completion. It has no public `onComplete` parameter. Its `selectedPath` concerns the upload queue's metadata editor, not an arbitrary persisted attachment identifier.

The list endpoint receives `context` and returns a Bag: node labels are opaque attachment IDs and `caption` attributes provide display text. Read and remove receive `context` and `selected`. Read returns a Bag with `kind` equal to `text`, `image` or `message`, plus the appropriate `text` or `src`; remove returns true after deletion. A false remove result retains selection and reports an error. Context changes clear the previous displayed selection and invalidate late results. Application endpoints own authorization, transactions and durable storage. See [the complete attachment endpoint contract](105-components.md#gc-105-uploader).

## Choose a component

- [`uploader`](#gc-440-uploader): Shared file queue with progress, preview, selected-file metadata and application-owned upload targets.
- [`imageUploader`](#gc-440-imageuploader): Editable image value with local crop or an application-owned upload destination.
- [`attachmentManager`](#gc-440-attachmentmanager): Reusable attachment queue and list backed by application operations.


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


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-uploader).


**Data contract.** Initialize a Bag at storepath for queue rows and progress. selectedPath writes the queue-relative row label and clears when that row is removed. Files and temporary grants stay outside Data. Preparation snapshots row metadata fields and the optional contextPath Bag separately.


**Interaction and events.** Selection and drop add files. autoUpload starts queued files, including when enabled after selection. In deferred mode manualUpload controls the Upload action. onComplete names Page Logic receiving item and result after confirmed completion.


**Composition.** Leaf control. Place ordinary metadata controls beside it and bind them to the selected row's metadata Bag. Give them an empty scope when no row is selected.


**Limits and lifecycle.** The host and application operation own authorization and storage. Check status reconciles uncertain outcomes before retry. Local preview covers safe text and raster images. File-origin WebKit Workers can fail to read selected File objects.

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


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-imageuploader).


**Data contract.** Bind value two ways and initialize a queue Bag at storepath. Crop confirmation writes a PNG data URL in browser-only mode or a displayable URL returned by the application operation in transfer mode. External value changes supersede open edits.


**Interaction and events.** Select or drop one image, move, zoom or rotate the crop, then confirm or cancel. Camera and screen capture feed the same crop path when available. Server-mode onComplete receives item and result after confirmed transfer.


**Composition.** Leaf control with its own crop dialog. Compose surrounding form controls normally and share contextPath when the upload operation needs it.


**Limits and lifecycle.** Input supports PNG, JPEG and WebP. Positive integer crop and output dimensions must have the same aspect ratio. Remote editing requires canvas-compatible URL access. Camera needs a capable device provider and permission, with a secure context for browser capture. Screen capture depends on browser support and permission. Stored files remain under application control after value is cleared.

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


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-attachmentmanager).


**Data contract.** Initialize queue and record context Bags at storepath and contextPath. Update context before ready enables queued uploads. selectedPath addresses a queue row for metadata editing. The list endpoint provides opaque attachment IDs and captions.


**Interaction and events.** The manager refreshes its list after confirmed upload, calls readMethod for preview and removeMethod for deletion. Context changes clear the old selection and discard stale responses. Failed removal retains selection and reports an error. It declares no public onComplete.


**Composition.** Leaf control composing its own multiple-file queue, list and preview. External metadata fields can bind to the selected queue row.


**Limits and lifecycle.** The application supplies operation, listMethod, readMethod and removeMethod and owns authorization and persistence. Preview responses distinguish text, image and message. Removal requires a true result.

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
