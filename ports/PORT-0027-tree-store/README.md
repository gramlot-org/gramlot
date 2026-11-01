# PORT-0027-tree-store

- **Status:** implemented and locally verified; owner and visual acceptance pending.
- **PoC evidence:** `gramlot-org/gramlot-poc@10478b5`, `js/dom/src/collections/storetree.js`, `js/dom/src/resolvers/rpc.js`, `src/gramlot/resolvers.py`.
- **Destination:** local common core and Python server base; original relation-tree worktrees preserved.
- **Constitution:** §§13–14, 11.43, 11.56; core remains host/database independent.

## Scope and destination review

Owner requested a generic Bag-backed lazy store, one root loader reused for node
paths and attributes, optional `child_count`, then the Asqueel/Kajenn relation tree.
Bag's registered resolver wire representation is reused. Source owns store
lifecycle; the Kajenn integration provides the opt-in endpoint and request database.
The old Genropy endpoint and PoC-specific loader are not imported. The Asqueel
endpoint permits only page-declared roots and traverses actual relation resolvers.
Owner confirmation: “ok, procedi con lo store generico e l'albero delle relazioni
Asqueel/Kajenn”. See GC-400.

## Verification and feedback

The tree and store tests exercise Python Source, inert Python-to-JS resolver wire,
root and nested lazy loading, `checked`, caching and disposal. A real Kajenn ASGI
RPC test uses an Asqueel SQLite model and expands a relation; direct traversal of
an invoice model also verified the returned wire in the JS store. Tests and final
counts are recorded in GC-070. The adapter checkout started at develop `285f031`;
its existing auth signature was aligned to the current core for the test. Two
broader adapter tests still fail for pre-existing baseline/environment differences:
the base theme in this core and a gallery/core package mismatch.

## Open work

Owner, 2026-11-01: “va nesso tutto, i tipi i gruppi i preferiti ecc”. PoC
evidence includes dtype/relation-direction badges, groups, virtual/formula and
other column hints, attribute inspection, internal-name toggle, favorites and
row interactions. Asqueel currently marks `DbTableObj.relationExplorer` as not
available. Its raw model and resolver must not be treated as proof of the full
explorer/grouping contract; the missing capability belongs to Asqueel. Generic
tree row-action syntax remains an owner-approved trial, not a finalized API.
Specialized presentation destination and names require a concrete owner decision.

Owner confirms generic tree badges/row actions and says “a me basta il relation
resolver di asqueel”: use the resolver directly, without requiring
`relationExplorer`. A real-model probe shows physical field `dtype`, `name_long`
and `group` are returned; a standalone formula column in the model was not. Do
not claim virtual-field parity from this resolver alone. Badge syntax, grouping
and favorite persistence contracts remain to be settled.

Owner then requests a relation resolver complete like Genropy legacy. Correction:
Genropy's own `RelationTreeResolver` also omits standalone virtual fields;
`relationExplorer` adds them and provides grouping and other explorer metadata.
Asqueel's resolver follows the basic structure and has legacy-comparison tests;
complete parity is not yet verified. Running those tests in the available
environment failed during collection because `psycopg` is missing. Whether the
single Asqueel resolver should itself expose the explorer additions is undecided.

Owner instead places the enrichment in the adapter (“no. er ora fallo nel nostro
adapter”); GC-000 amendment 11.105 records the bounded exception. Adapter adds
virtual/composite columns, defined groups, captions, types, direction and logical
field paths. Grouped resolvers stay lazy, visible group paths are validated and
group/field collisions are rejected. The store binds deferred resolvers inside
static group Bags. Browser and focused tests cover a grouped lazy relation, an
anomaly confirmation and a virtual field. Favorites, inspector and
complete PoC parity are still pending.

Owner confirms `badge` and `badge_color`; the generic tree renders these Bag-node
attributes and the adapter supplies type and relation-direction badges. Build,
focused tests and a browser display pass. The Source-composed row-actions trial
now supports a shared bar and button/menu Logic context; focused tests and a
browser fixture pass. Generic `treeInspect` opens a Source dialog with node
attributes and is wired into the relation tree. Favorite storage remains
undecided and the row-action trial is not yet fully qualified.

Later owner decisions implement browser-persistent favorites and per-row favorite
presentation. On 2026-11-01 the owner confirms automatic loading of a favorite's
missing relation branches with loop confirmation. The tree loads selected-path
ancestors sequentially and stops on cancel, error or selection change; retry after
cancel is supported. Real browser verification covers unloaded relation traversal,
loop cancellation, retry and confirmation. Earlier pending statements above record
historical checkpoints. Full PoC parity, visual
browser acceptance, connected adapter integration and final product acceptance
remain pending. The new store does not migrate the existing filesystem or
navigation stores. Re-evaluate metadata authorization per consuming application.

Integration feedback, 2026-11-01: the separate checkbox checkout has 114 passing
focused tests, but an isolated test shows that checking an unloaded `loop=true`
node starts its resolver without the previously required confirmation. The two
tree implementations also have four overlapping merge regions. Do not claim
integration or acceptance until the shared behavior and lazy semantics are
reconciled and tested. Kajenn now passes 31/32 tests after method headers, BOM
handling and theme assertion fixes; the remaining gallery test depends on examples
and core versions with different collection layouts. The current examples package
also exposes nested-page staging failure against the newer installed core.

The owner then approved alignment with the current core and host and chose to stop
search at loop nodes. In isolated updated clones, the tree combines the
checkbox and relation increments; a marked resolver asks before checkbox loading,
and cancellation and stale bound updates are tested. A real browser verifies the
loop checkbox and favorites. The 90-test Kajenn suite, including gallery and
HTTP conformance, passes with its test dependencies. Earlier failure counts above
are historical checkpoints. Lazy checkbox propagation, wider PoC parity and owner
acceptance remain pending.

Lazy propagation follow-up, 2026-11-01: the owner authorizes propagation to unloaded descendants and confirms using each unresolved branch path in `checkedPaths` until its checked children load. Selection propagates lazily, loop resolution still requires confirmation, and cancellation, disabled children, failed/retried loads and stale changes are covered. A real Kajenn/Asqueel browser fixture checks inheritance through an unloaded loop after confirmation. This supersedes the lazy-propagation debt above; remaining checkbox features and owner acceptance are separate.


## Common-base destination review — 2026-11-01

The owner authorizes integration into the common base with tests and preservation
of original worktrees. Earlier counts and pending integration statements above
are historical checkpoints. The aligned Tree/check integration, lazy selection,
row-actions trial and Kajenn metadata explorer are now integrated locally.
The current loop contract stops automatic search at loop nodes; explicit branch
operations use the latest approved direct resolution path (GC-225/GC-400).

Review corrected inspector lifecycle ownership (Source, never Logic), native
html_dialog selection and literal attribute display. Regression tests and
Chromium/WebKit file-origin verification cover these corrections. The full core,
Python adapters and serverless consumer were checked; exact counts and rerun
attribution are in GC-070. Original copies are preserved. Full legacy/PoC parity,
visual acceptance and publication remain separate; no Invoice application added.
