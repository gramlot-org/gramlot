# 190 · Public websites: editorial HTML and interactive regions

Document ID: **GC-190**. Status: **deferred discussion; design pending**.

<a id="gc-190-005"></a>
## 005 · Use case, proposals and open decisions

Block ID: **GC-190-005**.

Owner: "annotati queste cose perche ci torneremo su". Discussion record only:
no implemented API, implementation-plan acceptance, port or publication authority.

Immediate sites: **gramlot.org**, **asqueel.org**, **kajenn.org**. The owner wants
indexable/searchable editorial content plus rich Gramlot examples. HTML can be
written directly or with an editor, stored in files or a database, then served.
The proposed **foo.py + foo.html** companion is independently authored content,
not necessarily a snapshot equivalent to the dynamic page. The later, narrower
proposal dedicates only a div inside the editorial HTML to the Gramlot root.
An iframe is optional; remote Source is a separate runtime mechanism.

Owner distinguishes two modes explicitly ("il bottone espandi della miniatura
attiva la pagina"):

- **Thumbnail:** reduced, not interactive; Expand activates the page at normal
  size. 0.25 was illustrative. Preview generation/resource-loading timing undecided.
- **Normal-size region:** predefined area, already usable; Expand enlarges it.
  Preserving the same instance and state is the working suggestion.

Expansion may hide/remove editorial HTML. Reversible hiding with a return control
was suggested, not approved as an exact UI/lifecycle contract. Keep activation of
a thumbnail distinct from expansion of an already-active region.

Earlier alternatives: equivalent initial HTML replaced by a prepared hidden
Gramlot page (replacement, not true DOM hydration), and declarative Shadow DOM
for isolation. Neither is required by persistent editorial HTML with an interactive
region. Shadow DOM crawler coverage/style loading remains to qualify.

Legacy evidence: `Genropy/genropy/resources/common/gnrcomponents/htmlchunkeditor.py`,
`ChunkEditor.htmlchunk_htmlChunk`, stores a loaded/default template in
`gnr.htmlchunk.<nodeId>.content`, applies browser `dataTemplate` to `innerHTML`,
and offers rich-text editing/user-object persistence. It is not already the
proposed initial server-rendering solution; no port specification is approved.

Open: Page companion/root/bootstrap contract, body fragment versus document,
JS authoring counterpart, storage and allowed HTML/editing permissions, preview
activation/expansion/return/focus, public URLs and metadata, whether internal search
is required. Proposed head ownership by Page remains undecided. Preserve core
independence from storage/hosts. Replacement, if pursued, must address user input,
duplicate IDs and repeated effects.

Static Python/JS HTML renderers exist; ordinary HTTP bootstrap sends an empty root
for browser rendering. No companion-HTML path or hydration was added. Future tests:
editorial content in the initial response and with JS disabled; mode-specific
activation/expansion and preserved state. Rendering alone guarantees no indexing.


**Parallelism:** editorial content and legacy HtmlChunk analysis can proceed
alongside system-Data and component design. Shared Page/bootstrap/server contract
changes require coordination across core and both integration repositories.
This card does not require true hydration or a general component framework.
