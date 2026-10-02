# 015 · Visual identity and graphic coordination

Document ID: **GC-015**. Revision: **0.3 — 2026-10-02**.

[Paired view](../docs_llm/015-visual-identity.md).

[Graphic coordination guide](../assets/branding/theme-guide.md) · [Asset inventory](../assets/branding/README.md) · [Visual catalogue](../assets/branding/index.html).

<a id="gc-015-005"></a>

## 005 · Scope and status

Block ID: **GC-015-005**.

The owner selected the revised blue/yellow symbol direction, lowercase Arial Rounded wordmark and supporting application palette on 2026-09-18. On 2026-10-02 the owner explicitly requested a rich, complete graphic asset folder: “puoi provvedere e creare una bella cartella con tutto il necessario per un immagine grafica ? bella ricca”. This authorizes the missing vector, transparent, monochrome and favicon assets identified in the preceding audit and related graphic exports. The new reconstruction and layouts await visual acceptance. The palette remains a design specification, not an installed runtime theme or a change to documentation styling.

<a id="gc-015-010"></a>

## 010 · Artwork and provenance

Block ID: **GC-015-010**.

The historical symbol remains at `docs/_static/branding/gramlot-logo.png`; the September raster/hybrid files are in git history (commit `234c6d8`). The current single artwork master is `assets/branding/source/gramlot-master.svg`, containing vector symbol paths and the original outlined lettering. The symbol is reconstructed from the selected light raster with smooth contours and approved solid colors; it does not claim recovery of an original vector source. Light/dark and monochrome exports now share identical geometry.

The kit includes transparent SVG/PNG stacked and horizontal logos, symbols and wordmarks in six variants; browser/device/maskable icons; CSS/JSON/GPL/SVG palettes; five light/dark social formats; wallpapers and presentation backgrounds; an offline catalogue, four-page printable RGB guide, checksummed manifest and a generated ZIP (not committed). Stable root logo/mark entry points retain their original white/navy background use.

<a id="gc-015-015"></a>

## 015 · Approved logo and wordmark

Block ID: **GC-015-015**.

Preserve the curved asymmetric symbol, detached yellow disc, orientation and proportions. Use **gramlot**, all lowercase, in **Arial Rounded MT Bold**, centered below the symbol. Current tracking is −0.025 em. SVG lettering is outlined and does not require the font to be installed; font files are not distributed. Vector masters use solid blue #456BC4 and yellow #FFC400; raster edges contain antialiased pixels. Historical raster pixels may vary from those targets.

<a id="gc-015-020"></a>

## 020 · Scale, placement and backgrounds

Block ID: **GC-015-020**.

Start the symbol at 64 px and the complete logo at 160 px; inspect the thin tips and lettering at actual size. These are working recommendations, not certified minima. Keep one disc diameter of clear space around the visible contour. Choose transparent primary artwork for light surfaces, inverse for navy, or the stable root white/navy assets. Do not rotate, stretch, add shadows or use the logo as a status indicator. Monochrome variants are utility exports; browser icons are provided down to 16 px, with target-specific small-size review still required.

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

The rich kit is generated from a single fully vector master and approved tokens. Verification covers SVG structure and self-containment, preserved lettering paths, matching variant geometry, raster dimensions/transparency, links, checksums, ZIP contents, browser catalogue layout and the printable guide. New vector artwork and layouts await owner visual acceptance; platform-specific tiny-icon review, printer color conversion and palette verification on working application screens remain open. The kit does not install a runtime theme. Reproduction instructions and provenance live with the assets.
