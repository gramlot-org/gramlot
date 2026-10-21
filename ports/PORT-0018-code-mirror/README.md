# PORT-0018-code-mirror

- **Status:** implemented and under owner trial; no release or owner acceptance.
- **PoC evidence baseline:** `gramlot-org/gramlot-poc@10478b57ce3f22e6445eb6b72eba343520cbebac`; the inventory in GC-198 identifies inspected working files.
- **Destination revision:** working implementation, not a release revision.
- **Constitution:** shared control ownership, Source/Data applications, optional collections, Python-first examples, no dependency-source edits, no unapproved fallback path.

## Evidence and scope

PoC `js/pages/src/codemirror-component.js` and `js/dom/src/editor-dependencies.js`, inventoried in GC-198. The owner selects PoC behavior as the reference, not a legacy widget port. Confirmed contracts and bounded routine-default delegation are in GC-198 §070. Implementation authorization: “ok procedi con CodeMirror base e quello con opzioni e metti gli esempi nella gallery così li proviamo”.

The base CodeMirror 6 control uses Gramlot binding/validation. A separate reusable Source composition supplies settings and a shared drawer. The collection is optional and locally bundled, with no CDN or textarea fallback. Host-owned file persistence is excluded. No wholesale PoC copy, legacy option-object passthrough, alternate keymaps/LSP, Markdown renderer, IDE, Typst or remote editing is included.

## Destination review

Shared adapter assumptions were corrected by declaring `liveWrites`, rather than giving a non-native control a fake input type. User document transactions emit one normalized input event; native contenteditable events cannot duplicate Data writes. External real document replacement resets history silently; configuration reuses the same EditorView. Removal destroys the engine and invalidates pending creation.

The options component is Source composition, not a second editor implementation. Page exports make it available to authoring in both languages and to the gallery's browser module graph. Gallery asset manifests and license collection must include the optional editor bundle in both implementations. Initial verification found and corrected omissions in the asset manifest, module export, gallery test collection registration and a duplicate folder index; these are retained here as preparation feedback.

## Verification

See GC-198 §085, GC-070 and GC-105 §125. Tests cover binding/event count, silent replacements, history/selection preservation, read-only/disabled projection, settings, lifecycle, languages and diagnostic commands. Real Chromium checks cover both gallery examples and keyboard save/search/undo. Existing Python expected failure remains unrelated. Owner visual trial is pending; publication and deployment are separate actions.

## Feedback for later ports

Register optional collection grammar, browser bundle, assets and test fixtures together. Keep engine loading separate from Source composition exports. Use existing control and container contracts before designing new component plumbing. Distinguish in-memory Save events from host persistence; an editable source viewer does not yet authorize a filesystem write path.
