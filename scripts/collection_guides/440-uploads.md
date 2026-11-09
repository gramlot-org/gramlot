# Uploads and attachments

Document ID: **GC-440**.

The uploads collection lets the user send files to your application: a queue of
files, a single cropped image, or the attachments of a record. This page answers
**which upload component fits the result you want to keep, and what your
application has to provide**. The complete list of parameters is in the
[widget reference](345-widget-reference.md).

<a id="gc-440-start"></a>

## A file queue

```python
from genro_bag import Bag


def main(self, root):
    pane = root.div(datapath="import")
    pane.dataSetter(".queue", Bag())
    pane.uploader(operation="receive", storepath=".queue",
                  selectedPath="^.selected", multiple=True)
```

`receive` is an upload operation of your page: a method marked `@upload` that
returns the target where the file goes. The server, not the browser, chooses that
destination and checks the content. `import.queue` must be a Bag before the page
renders; the uploader fills it with one row per file, holding its name, progress and
state, never the file itself. The page base of your environment already enables this
collection; if it does not,
[enable it once](340-components-and-collections-guide.md#gc-340-050)
([upload operations](105-components.md#gc-105-uploader)).

<a id="gc-440-005"></a>
<a id="gc-440-010"></a>
<a id="gc-440-220"></a>
<a id="gc-440-shared-value"></a>
<a id="gc-440-225"></a>
<a id="gc-440-shared-state"></a>
<a id="gc-440-335"></a>

## Pick a component by the result

| You want to keep | Use | The Data receives |
| --- | --- | --- |
| Files sent to your application, with progress | [uploader](#gc-440-uploader) | a queue of rows |
| One image, cropped by the user | [imageUploader](#gc-440-imageuploader) | the image URL in `value` |
| The attachments of a record | [attachmentManager](#gc-440-attachmentmanager) | a queue; the list comes from your server |

All three accept `disabled`.

<a id="gc-440-340"></a>
<a id="gc-440-uploader"></a>

## Sending files

```python
form.uploader(operation="receive", storepath=".queue", accept=".pdf,.csv",
              multiple=True, autoUpload=False, onComplete="fileReceived")
```

[uploader](345-widget-reference.md#gc-345-uploader) starts each file as soon as it
is chosen or dropped. With `autoUpload=False` the files wait for the user to press
Upload; `manualUpload=False` also hides that button, so your code starts them by
setting `autoUpload` to true. `accept` only guides the file chooser: the server still
checks the content. `onComplete` names a method of your page's `Logic` that receives
`item` and `result` when a file has arrived.

- **Fields for each file.** Each row has a `metadata` Bag, sent to the operation with
  the file. Bind `selectedPath` and point ordinary fields at the selected row to let
  the user fill it in before the upload starts
  ([metadata form](105-components.md#gc-105-uploader)).
- **Fields for all files.** `contextPath` names a Bag, such as the id of the saved
  record, sent along with every file of the component.
- **Uncertain outcome.** When the connection drops during a transfer, Check status
  asks the server what happened before the user retries.

<a id="gc-440-345"></a>
<a id="gc-440-imageuploader"></a>

## One image

```python
form.imageUploader(value="^.photo", storepath=".photoQueue",
                   operation="save_image", cropWidth=256, cropHeight=256,
                   outputWidth=512, outputHeight=512)
```

[imageUploader](345-widget-reference.md#gc-345-imageuploader) takes a PNG, JPEG or
WebP image, lets the user move, zoom and rotate it in a crop frame, and stores the
confirmed PNG. Without `operation`, `value` receives the image itself as a data URL;
with one, your application stores it and `value` receives the URL it returns. The
crop and output sizes must have the same proportions. Where a camera or screen
capture is available, the user can take the image from there
([editable images](105-components.md#gc-105-uploader)). Clearing `value` does not
delete the stored file.

<a id="gc-440-350"></a>
<a id="gc-440-attachmentmanager"></a>

## Attachments of a record

```python
form.attachmentManager(operation="receive", storepath=".files",
                       contextPath=".record", ready="^.saved",
                       listMethod="listAttachments", readMethod="readAttachment",
                       removeMethod="removeAttachment")
```

[attachmentManager](345-widget-reference.md#gc-345-attachmentmanager) combines a
file queue with the list of files already attached, a preview and removal. While
`ready` is false, as for a record not yet saved, chosen files wait in the queue; put
the record in the `contextPath` Bag, then set `ready` to true and they are sent.
The three methods are server endpoints of your page: the list returns a Bag of
attachments with their `caption`, read returns a text or image for the preview, and
remove returns true once the file is deleted. Who may see or delete what is decided
there ([attachment endpoints](105-components.md#gc-105-uploader)).
