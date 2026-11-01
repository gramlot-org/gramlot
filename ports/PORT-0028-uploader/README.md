# PORT-0028-uploader

- **Status:** bounded technical integration accepted; WebKit file-origin qualification remains open.
- **Owner scope:** “iniziamo da uploadeer”, common-base integration, 2026-11-01.
- **Inputs:** core ba85b6db, Python Uvicorn 8c5a391, Worker 2dcd0d5, examples 04193d8.
- **Destination:** common local release branches; original worktrees preserved.
- **Constitution:** Source/Data ownership, §§13–14, 11.43, 11.56; uploader decisions at GC-000 shared-uploader-design-direction and GC-385.

## Scope and destination review

The shared uploader is independent of storage technology. Application operations
return UploadTarget; Uvicorn supplies binary HTTP admission, the Worker receives
File objects and reads bounded chunks. Queue data and editable per-file metadata
are Bags. Preparation/admission retain page ownership, operation authorization,
limits, cancellation and reconciliation. Attachment list/read/remove endpoints and
image storage belong to the application. No Visual Editor or Invoice code included.

Destination corrections: attachment presentation and crop transforms now belong
to Source Bags. Native resources survive same-turn DOM relocation into a floating,
while real removal releases them. Examples use environment collections. Three
upload lessons enter feature coverage; generator entries for the already-integrated
editingStatus/rowActions and the missing Grid editing coverage mapping were repaired.

## Verification

Full core JS/Python, Uvicorn, Node server and Worker checks pass. Gallery full runs
found count/import/coverage mismatches; affected suites pass after correction.
Exact counts and rerun attribution: GC-070 uploader-consolidation-20261101.
Chromium/WebKit pass Uvicorn attachments and crop controls; Chromium verifies
per-file metadata, synthetic camera and screen cleanup. All 144 tracked input
file hashes are unchanged in the original candidates.

## Limits and open work

WebKit file-origin Worker upload fails with NotReadableError, reproduced by posting
a new File to a native Worker without Gramlot. Chromium file-origin and WebKit HTTP
both pass. This matches https://bugs.webkit.org/show_bug.cgi?id=258443. The primary
File protocol was kept; no browser-specific workaround or fallback was added.

Uvicorn transfer state is single-process and volatile; other HTTP adapters do not
implement binary uploads. Application storage and record authorization remain
application-owned. Gallery records/files live only in memory. Camera/trackpad
hardware and product/visual acceptance remain unverified. No release or deployment.

## Feedback for later ports

Check Source/Data state ownership before acceptance, including nested editors.
Treat disconnection and disposal separately: moving DOM must retain pending files
and editor state. Test actual file-origin exports in every claimed browser; mock
Worker tests cannot establish browser File security behavior. Preserve upstream
failures explicitly rather than adding an unapproved alternate transport.
