# PORT-0017-bag-tree

- **Status:** minimum tree and gallery/resolver increment implemented and specifically verified; owner visual acceptance pending.
- **PoC revision:** `gramlot-org/gramlot-poc@10478b57ce3f22e6445eb6b72eba343520cbebac`.
- **Destination revision:** working implementation based on `d01bf3dc6389ad9bca91ef0f4bdbaafbfcc10242`; no accepted revision yet.
- **Constitution points checked:** §§3–9,13–14; amendments 11.43 and 11.56.

## Evidence

[GC-197](../../docs/internal/197-legacy-tree.md) inventories legacy and PoC evidence,
including PoC `js/dom/src/collections/storetree.js` and its IDE/filesystem use.
The provisional core inspector tree is evidence, not the implementation copied
into this port. GC-197 §055 retains the individual owner confirmations.

Owner direction: “per ora facciamo funzionare u tree mi imale e poi aggiungiamo
pian paino tutto”. This prioritizes a working minimum over the rowActions trial.
“prevediamo icona vero ?” recalls the already included node-icon feature.

## Scope and contract

The first increment renders a loaded Data Bag through `tree(storepath=...)`.
storepath is a plain absolute or datapath-relative path resolving to a Bag.
The component displays labels/labelAttribute, manually expands/collapses loaded
branches and provides two-way selectedPath. External selection opens loaded
ancestors; a missing selected path neither selects another node nor rewrites Data.
Without a reactive selection pointer, user selection stays local.

Live structure and caption-attribute changes are routed through the existing
BindingRuntime/DataRouter subscription. NodeBinding owns one subtree registration
and the renderer supplies the Bag through bagStore/setStoreBag. Source removal
and disposal release registration; changing storepath rebinds it.
Open-state identity uses BagNode objects; replacing the store resets expansion.
Labels are text. Empty Bags/scalars are leaves. Non-Bag stores are errors.
Keyboard navigation and focus use tree roles and a single visible tab stop.

No resolver loads, icon callbacks, hideValues, advanced selection outputs,
onSelected publication, badge or rowActions behavior is implemented yet.
Those confirmed options remain incremental work; checkbox/search remain deferred.
There is no second store representation, generic repeater, alternate event bus
or modification to Builder/Bag sources.

## Proposed contents

`js/src/components/tree.js`, its package/JSR export and generated Python collection;
bounded bagStore integration in registry, binding runtime/router and renderer;
`js/tests/tree-components.test.js`; Python core qualification fixture
`tests/fixtures/components/tree.py` and its Chromium/WebKit harness
`tools/gramlot-tools-inspector/tests/minimal-tree-browser.mjs`.
Paired GC-197, GC-225 and GC-070 retain scope, names and status.

## Verification

- Nine tree tests cover hierarchy/selection, nested changes, route replacement,
  multiple instances, cleanup, capability metadata and no resolver evaluation.
- Final focused run: 51 passing tests across tree, router, components,
  conformance and rebuilt runtime artifacts.
- Python Source browser qualification passes Chromium and WebKit for disclosure,
  Data selection/clear, insertion/caption changes, keyboard and disposal.
  Desktop/mobile screenshots inspected.
- Broader repository run leaves four Source-identity failures unresolved:
  nodeId DOM leakage in two tests and symbolic #target resolution in two tests.
  GC-070 §1515 distinguishes these from repaired environment/build failures.
  Full-suite success is not claimed.

Reproduce browser review:
`node tools/gramlot-tools-inspector/tests/minimal-tree-browser.mjs --serve`.
This is a core qualification fixture, not an example-gallery dependency.

## Differences and open questions

This is an adaptation to current Source/component contracts, not a bulk PoC port.
Only loaded branches participate; directory resolvers require the later resolver
increment. getIconClass invocation, badge/HTML details, identifier edge cases and
remaining option contracts retain their recorded open questions in GC-197.
The minimal recursive rendering does not claim virtualization or large-tree
performance qualification. Owner visual acceptance is still outstanding.

## Destination review

- **Result:** pending owner review.
- **Accepted scope/revision or requested changes:** none recorded yet.
- **Constitution conflict:** none identified for the bounded implementation.

## Feedback for later ports

Normal value-pointer subscriptions exclude descendant attribute changes. A
Bag-backed visual store needs an explicit subtree registration through the existing
router; adding direct component subscriptions would duplicate ownership.
Qualify captions after attribute-only updates, store replacement, Source rebind and
disposal. Keep Python authoring in the browser test and separate feature inclusion
decisions from implementation/acceptance. Dependency identity defects remain with
their owning libraries; passing tree tests does not resolve those defects.


## 2026-10-20 — gallery, icons and lazy sections

Owner requests suitable classes, showing the tree in the gallery, using it for
navigation, and resolver-backed sections. GC-197 §065 supersedes the initial
no-icons/no-resolver boundary above. Tree now exposes structural/state classes and
CSS parts, folder/file icons and manual resolver expansion. Gallery navigation is
an ordinary Bag with dataRemote section values, in both Python and JS. Example
w26 demonstrates this component. Tab selection, retained content, remount, retry
and mobile remain covered; default icons do not implement getIconClass yet.

Both server import maps expose the existing core module at the same runtime URL
as the page module; collection builds externalize it, preserving Bag identity.
No second runtime, alternate store duck typing or dependency edits are introduced.
The existing index runtime receives the navigation Bag through an explicit option;
ordinary existing link-based IndexPage consumers keep their current contract.

All 66 focused core checks, 22 gallery integration checks, 28 Python checks and
Chromium/WebKit sequences on the Python and Node galleries pass. GC-070 §1520
retains the wider Source-identity and guided-demo failures. Resolver-specific
limits and subsequent options remain in GC-197 §065; full legacy compatibility,
visual acceptance, release and deployment are not claimed.

Reusable feedback: a separately built component must share the runtime's Bag
constructor. Qualify this in a real hosted gallery, not only a single merged test
bundle. Test remount with already loaded navigation and failed selection retries,
and replace obsolete anchor-based test navigation with actual tree disclosure.


### Navigation autoCollapse — 2026-10-20

Owner: “fai nella navigaxione il tree auto collapse”. The shared tree implements opt-in autoCollapse, enabled in Python and JS gallery navigation. Opening a branch closes its siblings; external selection applies the same rule to revealed ancestors. Cached values, selection and descendant expansion survive collapse; late resolver completion cannot reopen it. GC-197 §070 and GC-070 §1525 record the bounded contract and verification: 14 tree / 21 focused core tests, 22 gallery integration tests, six Python tests, and Chromium/WebKit on both local hosts. Full-suite success and owner visual acceptance remain unclaimed.


### Presentation increment — 2026-10-20

Owner-confirmed hideValues=False, computed text/HTML labels, node/caption classes and custom icon callbacks are implemented. GC-197 §§075–080 and GC-105 §120 record the contract and the separate legacy drag/drop investigation. Gallery w26–w28 share the new tree directory group. Core JS: 3,590 pass, including 19 tree checks. Gallery JS: 143 pass. Focused core plus examples Python: 37 pass and 132 subtests, with the pre-existing upstream Regex/Union expected failure. Drag/drop remains a proposal awaiting its own contract; no full legacy compatibility or publication is claimed.


### Internal drag/drop foundation — 2026-10-20

The owner authorizes internal drag implementation, excluding external drag for now. This supersedes the earlier presentation checkpoint’s description of drag/drop as an entirely unapproved proposal: options 1–29 now have recorded approvals in GC-197 §080, with callback schema/order and error policy still open. GC-197 §085 and GC-070 §1540 record the bounded first implementation (declarative eligibility only), 28 passing focused checks, the root-scope question and the TYTX unsupported-value gap. Renderer events, tree row integration and gallery drag examples are not implemented or accepted yet. Preserve the existing presentation work.


### General drag preparation — 2026-10-20

Owner confirms method(sourceNode, {dragValues, item, path}) for onDrag. Shared local preparation, real Logic invocation, reactive enablement, veto and the tree row adapter are implemented; native gesture/drop/cross-window transport is not. GC-197 §090 and GC-070 §1545 contain scope and verification (3,606 JS tests across the main run and the permitted localhost conformance rerun, 33 Python checks with one existing expected failure). No dependency edits, replacement serialization, automatic Bag moves or new gallery drag demo. Owner acceptance and remaining contracts are pending.


### General drop action and target check — 2026-10-20

Owner-approved onDrop and dropTargetCb envelopes are implemented through named Logic, including awaited actions, strict boolean eligibility, Data-driven tree updates and consumed runtime metadata. GC-197 §095 and GC-070 §1550 record 57 passing focused JS tests, 26 passing Python Builder tests and a successful bundle build. These are invocation steps, not a completed native gesture pipeline or a gallery demo. Error policy, typed dispatch/order, cross-window membership, lifecycle publish details and the transport gap remain open.


Native internal drag increment — 2026-10-21. The shared renderer now implements the general local gesture cycle, with tree row context, TYTX snapshots, eligibility/revalidation, preview/feedback, application-owned Data actions and the confirmed onDragEnd/endDrag ordering. Gallery w29 demonstrates two Bag trees. See GC-070 §1560 and GC-197 §100 for checks and remaining scope. Browser page rendering is verified; a successful real browser drop is still unverified because automated drags delivered dragover only to the origin. Cross-window transport, typed handlers and custom Source previews remain pending. No owner acceptance, release or deployment is claimed.


### Intermediate release qualification — 2026-10-21

The owner authorizes the intermediate tree/page/gallery release. Chromium and
WebKit now both complete a real native drag between the two gallery Bags,
including the resulting Data update and rendered child; this resolves the browser
verification limitation recorded above. Navigation caching and cancellation are
aligned with the current core without requiring a dataRemote node. The guide is
in GC-095 §110. Cross-window transport, external drops, typed handlers and other
unimplemented legacy options remain outside this release. GC-070 §1585 records
qualification; a candidate version is not a publication receipt.
