# Gramlot — visual identity and application theme

Version 0.2 · 2026-09-18. Approved logo direction, wordmark and supporting UI palette (2026-09-18).

## 1. Approved identity

Blue `#456BC4`, yellow `#FFC400`; asymmetric curved symbol and detached disc.
The name is **gramlot**, all lowercase, in **Arial Rounded MT Bold**, centered
below the symbol. Current tracking is −0.025 em. Preserve orientation and proportions.
The SVG lettering is outlined, so viewing it does not require a locally installed font.
Font files are not distributed. A UI font is a separate choice.

## 2. Asset files and limitations

- `gramlot-mark.png`: symbol on white.
- `gramlot-mark-dark.png`: symbol on navy `#182333`.
- `gramlot-logo.svg`: symbol plus outlined wordmark on white, 440 × 530.
- `gramlot-logo-dark.svg`: symbol plus outlined wordmark on navy, 440 × 530.

The SVG files are self-contained **hybrid assets**: an embedded raster symbol and
vector lettering. They are not fully vector masters. Both backgrounds are opaque.
The two generated symbol images can differ slightly in geometry and their pixels
can vary from the target solid colors. Do not place these files on arbitrary
backgrounds expecting transparency. A transparent vector symbol, monochrome mark,
favicon and optical small-size version remain future production work.

Use the symbol at 64 px or larger initially, and the full logo at 160 px or larger;
these are working recommendations, not certified minimum sizes. Inspect thin tips
and lettering at actual size. Leave at least one disc diameter around visible artwork.
Do not stretch, rotate, add shadows or recolor the logo to communicate state.

## 3. Approved supporting palette

Keep blue and yellow as the identity pair. Add midnight navy for navigation,
a slightly warm near-white for pages and slate for secondary text. Pale blue is a
selection surface. Green, amber and muted red are semantic colors, not extra logo colors.

| Token | Value |
| --- | --- |
| `brand.blue` | `#456BC4` |
| `brand.yellow` | `#FFC400` |
| `ink` | `#243449` |
| `background` | `#F7F8F5` |
| `surface` | `#FFFFFF` |
| `surface.subtle` | `#EDF1F7` |
| `text.secondary` | `#566579` |
| `border` | `#D5DCE5` |
| `border.control` | `#7A8798` |
| `navigation` | `#182333` |
| `navigation.text` | `#EDF2FA` |
| `action` | `#456BC4` |
| `action.hover` | `#3557AB` |
| `selected` | `#EAF0FC` |
| `success` | `#23745B` |
| `success.background` | `#EAF5EF` |
| `warning` | `#785000` |
| `warning.background` | `#FFF4CF` |
| `error` | `#B13D48` |
| `error.background` | `#FCEEF0` |

Use white text on blue actions, navy text on yellow, and light text on navy.
Yellow is an accent, never small text on white. Do not reuse the light-mode action
color for small link text on dark surfaces; use `#EDF2FA` with an underline there.
Pair status colors with explicit labels and icons. Decorative borders are not
sufficient as essential control boundaries; use the control token and verify its
contrast against the actual surface. See `contrast-check.json` for calculated
opaque text pairs; this is not a rendered accessibility audit.

## 4. Typography and layout

Use system sans-serif for UI text, monospace for code. Reserve Arial Rounded for
the brand name. Start with 16/24 px body, 14/21 px controls, 12/18 px metadata,
20/28 px section titles and 28/36 px page titles. Avoid dense all-caps labels.
Use spacing 4/8/12/16/24/32/48 px, radii 6–8 px, and clear keyboard focus.
Keep forms, trees and tables calm; do not repeat yellow decoration in every panel.
Use labels for loading, empty, unauthorized and failed states. Respect reduced motion.

## 5. Scope and coordination

These tokens are an owner-approved design specification, not installed Gramlot runtime defaults.
They coordinate with Kajenn through restrained surfaces and spacing while retaining
Gramlot's independent blue/yellow identity. No server or database dependency is implied.
Classic Read the Docs styling remains required by the constitution; this guide does
not replace its default typography or blue/dark/light appearance. Any future application
showcase must use Gramlot's own authoring and component mechanisms.

## 6. Production follow-up

Preserve the selected typeface, lowercase spelling and composition when preparing
true vector/transparent masters. Review at 16, 24, 32, 48, 64 and 128 px before
choosing favicon/minimum-size rules. The palette is approved; its application to real working screens still requires visual and accessibility verification.
