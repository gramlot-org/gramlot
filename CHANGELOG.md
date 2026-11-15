# Changelog

All notable changes to Gramlot are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow
[Semantic Versioning](https://semver.org/). Releases up to 0.3.37 are described
in `.github/release-notes/`.

## [Unreleased]

### Added

- `@gramlot/gramlot/build-plugins` (Node only): `absentPackagePlugin` and
  `libraryPlugin`, the esbuild plugins of the runtime build. A host that bundles
  the core sources for the browser applies them to keep third-party libraries
  external as `@gramlot/libraries/<name>`. Since 0.3.38 such a bundle fails
  without `libraryPlugin`.

## [0.3.38] — 2026-11-15

### Changed

- A page loads the runtime and no file of a standard collection: 3 files at start
  instead of 29. `gramlot.min.js` carries the 11 standard collections and their
  grammar, composed at build time; a page composes only its declared and custom
  collections. Declared collections (`gramlots = [typst]`) and custom collections
  load as before. No page change.
- Third-party libraries of components stay out of the runtime and load on first
  use. With `local` they are served from `assets/libraries/<name>.js` of their
  collection under the import map specifier `@gramlot/libraries/<name>`, which
  the Python and JS `GramlotServer` add to the bootstrap import map. With `cdn`
  they load from jsDelivr as before.
- markdown-it loads on first use as the library `markdownIt`.

### Added

- `bundledCollections` (`@gramlot/gramlot`): the collections the runtime carries.
- `randomId` (`@gramlot/gramlot`) and `Container` (`@gramlot/gramlot/components`),
  for collections prepared outside the core.
- trayPane `autoArrange` (two-way) and `autoSize`; child option `aspectRatio`.
- floatingPane `titlebar` and `detachable`; `docked` is two-way; `collapsed` and
  `maximized` also apply while docked.
- imageUploader Crop view with a rectangle selection on the whole image, and
  `screenCapture`.
- drawingPane `aspectRatio` and `toolbar`; custom property
  `--gramlot-drawing-background`.
- chatMessages custom property `--gramlot-chat-padding`.
- Parameter-spec key `childParameter`: a child offers its value to the parent
  child parameter of the same name.
- `@codemirror/lint` 6.9.8 in the libraries manifest.
