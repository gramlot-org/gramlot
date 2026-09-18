# 015 · Visual identity and graphic coordination

Document ID: **GC-015**. Revision: **0.2 — 2026-09-18**.

[Paired view](../docs/015-visual-identity.md).

[Graphic coordination guide](../assets/branding/theme-guide.md) · [Asset inventory](../assets/branding/README.md).

<a id="gc-015-005"></a>

## 005 · Scope and status

Block ID: **GC-015-005**.

The owner selected the revised blue/yellow symbol direction and lowercase Arial Rounded wordmark on 2026-09-18. The owner also approved the supporting application palette on 2026-09-18. It is a design specification, not an installed runtime theme or a change to documentation styling.

<a id="gc-015-010"></a>

## 010 · Artwork and provenance

Block ID: **GC-015-010**.

The historical symbol remains at `docs/_static/branding/gramlot-logo.png`. Current assets are in `assets/branding/`: `gramlot-mark.png`, `gramlot-mark-dark.png`, `gramlot-logo.svg` and `gramlot-logo-dark.svg`. The new symbols are raster refinements of the original. The SVG logos embed those raster images and contain outlined lettering; they are not fully vector masters. Backgrounds are opaque white or navy (#182333), and the two symbol variants can differ slightly in geometry.

<a id="gc-015-015"></a>

## 015 · Approved logo and wordmark

Block ID: **GC-015-015**.

Preserve the curved asymmetric symbol, detached yellow disc, orientation and proportions. Use **gramlot**, all lowercase, in **Arial Rounded MT Bold**, centered below the symbol. Current tracking is −0.025 em. SVG lettering is outlined and does not require the font to be installed; font files are not distributed. Blue #456BC4 and yellow #FFC400 are approved design targets, not guaranteed values of every raster pixel.

<a id="gc-015-020"></a>

## 020 · Scale, placement and backgrounds

Block ID: **GC-015-020**.

Start the symbol at 64 px and the complete logo at 160 px; inspect the thin tips and lettering at actual size. These are working recommendations, not certified minima. Keep one disc diameter of clear space around the visible contour. Match the opaque background of the chosen asset. Do not rotate, stretch, add shadows or use the logo as a status indicator. Transparent, monochrome and favicon exports remain open.

<a id="gc-015-025"></a>

## 025 · Brand and interface colors

Block ID: **GC-015-025**.

Approved supporting colors: midnight navy #182333 for navigation; warm near-white #F7F8F5 for pages; white #FFFFFF for surfaces; ink #243449 for text; slate #566579 for supporting text; pale blue #EAF0FC for selections. Semantic accents: green #23745B, amber #785000 and muted red #B13D48, paired with labels/icons. Use dark ink on yellow, white on blue actions and light text on navy. Do not use yellow text on white. The complete palette and eight calculated text-pair contrast checks are in `assets/branding/theme-tokens.json` and `contrast-check.json`; all eight exceed 4.5:1. This is not a rendered accessibility audit.

<a id="gc-015-030"></a>

## 030 · Typography, spacing and components

Block ID: **GC-015-030**.

Reserve Arial Rounded for the wordmark. Proposed UI typography is system sans-serif, with monospace for code: body 16/24 px, controls 14/21, metadata 12/18, sections 20/28 and page titles 28/36. Spacing: 4/8/12/16/24/32/48 px; radii: 6–8 px. Keep keyboard focus visible, label operational states, support reduced motion and verify narrow-screen layouts. These are proposals, not existing component guarantees.

<a id="gc-015-035"></a>

## 035 · Documentation and implementation boundaries

Block ID: **GC-015-035**.

Classic Read the Docs remains mandatory under the constitution, with its default typography and blue/dark/light appearance. The application palette does not override it. Gramlot stays independent of Kajenn and all server/database adapters. Future applications must use Gramlot Source, Data Bags, bindings/controllers and shared components. This asset work adds no runtime API or theme.

<a id="gc-015-040"></a>

## 040 · Verification and remaining decisions

Block ID: **GC-015-040**.

The exported logos were visually reviewed on white/navy backgrounds; lettering is stored as paths, assets are self-contained, and token JSON plus contrast calculations were checked. Full vector/transparent masters, monochrome and favicon variants, optical small-size tests and verification of the palette on working UI screens remain pending. No deployment or publication is included. The English coordination guide, offline reference sheet and machine-readable tokens live together in `assets/branding/`.
