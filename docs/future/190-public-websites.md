# 190 · Public websites: editorial HTML and interactive regions

Document ID: **GC-190**. Status: **deferred discussion; design pending**.

<a id="gc-190-005"></a>
## 005 · Use case, proposals and open decisions

Block ID: **GC-190-005**.

**Status:** discussion retained at the owner's request, not an implemented API or
an approved implementation plan. Owner: "annotati queste cose perche ci torneremo
su". No runtime change, port, release or deployment is authorized by this note.

### Owner use case and proposed authoring

The immediate sites are **gramlot.org**, **asqueel.org** and **kajenn.org**. They
need indexable, searchable editorial content and rich examples using Gramlot.
The owner proposes writing HTML directly, optionally with an HTML editor, saving
it in the filesystem or a database and serving that content. Editing is an
administration concern, separate from a visitor reading the page.

The concrete filesystem proposal is a companion **foo.html** for **foo.py**:
"ogni pagina foo.py possa avere una foo.html che viene servita inizialmente".
This HTML may be authored independently; it must not be assumed to be an equivalent
snapshot of the dynamic Source. The owner then identifies the narrower composition:
"dedicare solo una parte della pagina alla parte dinamica ovvero il div che ospita
la radice". Editorial HTML surrounds a region into which Gramlot mounts the dynamic
page. An iframe is not required for that composition; iframe examples and remote
Source remain separate available mechanisms.

### Two presentation modes explicitly distinguished by the owner

Owner correction: "se è come miniatura non è usabile se invece occupa una zona
predefinita a zoom normale allora puo avere il bottone espandi, il bottone espandi
della miniatura attiva la pagina" (spelling normalized for readability).

- **Thumbnail:** a reduced preview, not a usable interactive page. Expand activates
  the page and presents it at normal size. A scale of 0.25 was an example, not a
  fixed setting. How the preview is produced and when runtime resources load remain
  to be designed.
- **Embedded interactive region:** a predefined area at normal scale, already
  active and usable. Expand enlarges this existing page; the proposed behavior is
  to preserve its instance, values and state rather than restart it.

The owner also proposes letting expansion hide or remove the surrounding HTML.
The working suggestion is reversible hiding with a return-to-explanation control;
that exact control, layout and collapse lifecycle have not been confirmed. Do not
collapse the thumbnail activation case into the already-active-region case.

### Alternatives discussed, not selected for immediate implementation

Earlier exploration considered initial equivalent HTML beside a hidden Gramlot
root, replaced only when the dynamic page is ready. That is replacement, not DOM
hydration. True hydration would reuse the existing DOM. Declarative Shadow DOM was
also considered for isolating the initial copy; crawler coverage and style loading
need separate qualification. Neither alternative is required by the later proposal
of persistent editorial HTML with a bounded interactive region.

The legacy component found in
`Genropy/genropy/resources/common/gnrcomponents/htmlchunkeditor.py`,
`ChunkEditor.htmlchunk_htmlChunk`, loads stored/default HTML, keeps it under
`gnr.htmlchunk.<nodeId>.content`, combines it with data through browser-side
`dataTemplate(tpl, data)` and assigns `innerHTML`. It includes a rich-text editing
and user-object persistence path. This is evidence for editable HTML chunks, not
an existing server-rendering/hydration solution or an approved port specification.

### Questions to settle when resuming

- The Page contract for companion discovery, missing files, the dynamic root and
  bootstrap activation. The suggested body-fragment form (head/title/resources
  supplied by Page) is not yet a confirmed API; the JavaScript equivalent is also
  undecided.
- How filesystem/database content is loaded, who may edit it and what HTML is
  allowed. Core must remain independent of a database or hosting technology.
- How previews, activation, expansion, return, sizing and focus work. If content
  is ever replaced, preserve user input and avoid duplicate IDs, requests or
  controller side effects.
- Public URLs, links, titles and metadata for each editorial page. Internal site
  search is a separate requirement to clarify, not implied by crawler indexing.

Current evidence: Python and JS have static HTML renderers; the ordinary HTTP
bootstrap still creates an empty root populated in the browser. This discussion
has not added a companion-HTML server path or hydration. Future checks should
verify useful editorial content in the initial HTTP response and with JavaScript
disabled, then activation/expansion behavior and state preservation in the selected
mode. Do not promise search-engine indexing merely from rendering HTML.


**Parallelism:** editorial content and legacy HtmlChunk analysis can proceed
alongside system-Data and component design. Shared Page/bootstrap/server contract
changes require coordination across core and both integration repositories.
This card does not require true hydration or a general component framework.
