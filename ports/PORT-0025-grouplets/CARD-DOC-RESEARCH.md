# GroupletCard inline documentation research — 2026-10-28

## Owner request and decision status

Owner: “ok procediamo con la documentazione inline dei grouplet card, sempre
 guardando i test legacy e aggiungendo un esempio completo nella gallery”.
The requested increment and connected gallery work are authorized. The owner subsequently chooses “Primo incremento: guida nella card”. The
read-only Markdown card guide is implemented and verified; see CARD-CONTRACT.md
and verification/card-qualification.md. The shared documentation-address service
remains a distinct future resource/Kajenn contract under this explicit choice.

## Legacy behavior and evidence

Evidence: genropy a135c9d949d0b014a22f57c418e83b315f85e7bf, preserved in
`evidence/legacy-sources.tar.gz`. This archive contains both an older local-template
path and the newer shared inline-documentation system; these are distinct contracts.

- `resources/common/gnrcomponents/grouplet/grouplet_card.js`, `_docIcon` and
  `openDoc`: the header icon is keyboard accessible, stops propagation and opens
  documentation with the current card title. Address-based docs use shared
  docTrack/openDoc, requesting tooltip presentation. The local-template path
  renders when opened. The popup can be closed with Escape.
- `docSpec`/`renderDoc`: address-based content is filled using current card Data
  and doc_kw; the editor is offered scalar field names plus explicit variables.
  Extra values are merged into a copy, not written to the actual row. Missing
  fields render blank. Without the experimental flag, doc is an inline template.
- `gnrjs/tests/grouplet_card.test.js:213–257,354–363`: four documentation tests
  cover icon tracking/click/keyboard, address-based filling/variables, local
  template filling and preservation of the original Data. Replayed all four:
  **4 passed**, see verification/card-doc-legacy-tests.log. These are legacy
  baselines, not Gramlot qualification.
- `gnrpy/tests/web/grouplet_card_test.py:109–133`: older file: documentation
  resolves resource-relative images; newer documentation derives an address from
  the resource/package/table and permits an explicit override or False opt-out.
  Inspected, not newly executed.
- `projects/gnrcore/packages/test/webpages/gnrwdg/test_grouplet_card.py`, test_7_doc:
  cards authored in place and resource-backed cards have documentation; doc_kw
  supplies additional variables. Documentation mode exposes missing entries.
- `projects/gnrcore/packages/test/webpages/gnrwdg/demo_inline_docs.py`: complete
  customer form, reusable shipping/address cards and a manual/documenter setup.
- `projects/gnrcore/packages/test/docs/manual/inline_docs.md`: documents are
  addressed as kind:target:name. Published manual sections and customer Markdown
  notes are combined; normal users see icons only where content exists. Authorized
  documenters can expose missing docs and edit notes, with language, image storage
  and concurrent-edit checks. Notes are private files served through sys/ep_doc,
  not anonymous static assets. The same address has the same documentation wherever
  used. This system also covers fields, tables and pages, beyond grouplet cards.

## Existing Gramlot surfaces and gap

The core already contains Markdown rendering and a sandboxed markdownPreview,
shared popup geometry, native accessible controls, Data bindings and remote Source
loading. The new card's header can host the documentation opener without changing
collapse/review/menu behavior. Applications must continue using Source/Data and
ordinary @source methods, with no local DOM or ad hoc request code.

Targeted searches in the current core and inspected Python adapter sources found
no inlineDoc/docModeVisible/ep_doc/documentation-address service. The saved-resource
and Kajenn write contract remains open in P1-CONTRACT.md; collection assets do not
supply a writable documentation archive. Do not implement an alternate filesystem
store or imply language/permission/editing support from a local Markdown popup.

## Concrete choice and owner answer

The question sent to the owner offers:

1. First increment: doc is Markdown text, optionally Data-bound; an information
   button opens a readable popup even while the card is folded, with Escape
   closure. A complete customer/delivery lesson has contextual guidance alongside
   the real editable fields and includes its required @source methods.
2. Include the shared address-based archive now: notes, languages, permissions
   and resource/Kajenn integration. This needs the host storage/lookup contract
   before implementation, preserving core independence.

Owner selects option 1: “Primo incremento: guida nella card”. The shared archive
is therefore outside this increment by owner choice and remains in the wider
resource requirements. It has not been implemented by this local guide.

## Qualification after scope confirmation

For the card guide: authored and Data-bound content, absent/empty docs, click and
keyboard opening, Escape/focus return, folded/nested cards, isolated instances,
current title/content after edits and remote rebuild, cleanup, safe rendering and
preservation of business Data. The gallery must demonstrate actual useful guidance
rather than isolated placeholder text and must pass real browser/narrow-view checks.
If shared storage is selected, additionally qualify identity/lookup, unknown and
forbidden documents, language resolution, authorized editing, conflicting writes
and preservation of host permissions. Those mechanisms are not approved by this
research note.
