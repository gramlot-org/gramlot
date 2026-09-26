**Native 0.1.0 acceptance — 2026-09-24:** owner accepted the bounded result recorded
in GC-110/GC-130 and authorized GitHub archives. Acceptance covers only the current
typed Source, native HTML, Page/Host, live lifecycle and seven-profile contract.
Earlier recipes, retired compilers, speculative rendering and broader PoC behavior
remain superseded or excluded; dated records below retain their original status.

# PORT-0001-native-html

**Historical port record.** Contracts, review feedback, rejected paths and dated test evidence remain here. The current 0.1.0 state is [GC-070](../../docs/internal/070-work-status.md) and the sole release plan is [GC-110](../../docs/internal/110-native-html-readiness.md#gc-110-020). Past “current”, “open” and “next” statements are local to their dated checkpoint; old eight-profile checks do not verify the seven-profile release matrix. No port acceptance is implied.

- **Status:** implemented and locally verified; owner acceptance pending
- **PoC evidence:** gramlot-org/gramlot-poc@10478b57ce3f22e6445eb6b72eba343520cbebac
- **Destination revision:** uncommitted development working tree
- **Constitution checked:** sections 2–7, 9–10

## Scope and current evidence

Python native HTML Source, TYTX JSON, browser roots, Source subscriber, one builder,
native HTML view handler, structural insert/delete/rebuild and attribute setters.
No CSS shorthand translation. Python host basics are extended by PORT-0002.
Seven browser-runtime contract tests and four Python tests passed locally; Chromium
bootstrap/main/DOM mutation checks also passed. This is development evidence only.

## Historical dependency finding and destination feedback

Owner confirmed that inserting a prebuilt nested Bag into an observed root must
automatically propagate backrefs through the incoming tree. Legacy gnrbag.js at
genropy/genropy@fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea passes this case:
setBackRef → node.setParentBag → child Bag.setBackRef.

genro-bag-js 0.4.0@faf6bef3badb389d25ea4cb3b35c5369cb7ffd8a fails it: the parentBag
setter only assigns a field. Deep insert/update events never reach the root.
Builder.buildNode currently compensates by attaching child backrefs. The owner
rejected making this a builder responsibility. This workaround is provisional and
must be removed after the upstream correction and pinned dependency update.

Owner is handling the upstream fix separately. Retest initial nested insertion,
deep mutation, replacement, detachment and disposal without the workaround before
acceptance. Do not label the current native HTML port consolidated or release it.

**Resolved — 2026-09-26:** genro-bag-js 0.5.x propagates child backrefs in the
`parentBag` setter; the workaround is removed. Future missing Builder or Bag behavior
goes into Gramlot classes (constitution 11.47 item 10).

## Legacy Python references

gnrpy/gnr/web/gnrwebstruct/base.py js_sourceNode generates __ref and pyref expressions;
gnrjs/gnr_d11/js/gnrlang.js resolves node/widget/DOM/form. The new bounded slice uses
opaque reference descriptors and node/DOM lookup, not eval or Python memory IDs.
Widget/form modes and expression compatibility are not implemented.

## Feedback for later ports

Verify dependency lifecycle contracts independently before implementing adapter
workarounds. Successful tests with a workaround do not establish upstream parity.

## Dependency update — 2026-09-19

The old dependency was taken from the PoC without first checking current releases.
That was a preparation error: the defect report applied to 0.4.0, not to the latest
release. GitHub Releases and tags now verify v0.7.1 as the latest stable release,
at 45816cb9b05c8f9d1c50a27415e6976a8740d94d. It is not published on npm.

Gramlot now declares the v0.7.1 Git tag and locks its resolved commit. The standalone
Bag contract test passes without builder assistance. The builder workaround has
been removed. All 13 JS tests pass on Node; six host/Bag tests pass on Bun; four
Python tests and Chromium Node/Bun bootstrap/mutation/disposal checks pass.
The dependency blocker described above is resolved. Owner acceptance and main
consolidation remain separate; no release or deployment was performed.

## Owner dependency policy — 2026-09-19

The owner subsequently prohibited all first-party dependency pins. The v0.7.1
pin above is superseded: manifests now follow upstream default branches for Git
and unconstrained published Python packages. The npm lockfile is removed and
lock generation disabled. Retained revisions document tests, not constraints.
