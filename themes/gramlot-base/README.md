# Gramlot Base theme

`theme.css` is a standalone application stylesheet. Include it once on a page built with Gramlot Source. It has no JavaScript, server, or database dependency. Example pages and the runner can reference this file by URL; they do not need a copy.

```html
<link rel="stylesheet" href="/themes/gramlot-base/theme.css">
```

The URL above is illustrative: the host must serve this file at that path. The theme styles semantic HTML, forms, tables, dialogs, details, code, focus states, and a few optional layout classes: `.example-page`, `.stack`, `.grid`, `.card`, `.muted`, and fluid SVG `.example-art`. Secondary button variants are `.button--secondary` and `.button--quiet`; status chips use `.status` with a semantic modifier. SVG icons can use `.gramlot-icon` (fill) or `.gramlot-icon--stroke` (stroke) and inherit `currentColor`. Supply an accessible name or mark decorative icons `aria-hidden="true"` in the application.

## Tokens and extension

The light palette follows [`assets/branding/theme-tokens.json`](../../assets/branding/theme-tokens.json) and the [visual guide](../../assets/branding/theme-guide.md). All theme variables use the `--gramlot-` prefix. The design primitives include spacing, radii, font stacks, a shadow, focus ring, and page width. Override variables after this stylesheet to customize a page or create a sibling theme:

```css
:root {
  --gramlot-page-width: 80rem;
  --gramlot-radius: 0.625rem;
}
```

Rules are grouped in cascade layers (`gramlot.reset`, `gramlot.tokens`, `gramlot.base`, `gramlot.components`, `gramlot.utilities`). Unlayered application CSS takes precedence. A new theme should provide the same semantic token names, then define its own rules instead of modifying this theme in place. `data-theme="light"` or `data-theme="dark"` on `<html>` selects an explicit mode; otherwise the operating system preference is used. Dark values are theme adaptations of the approved light palette and are not additional approved brand colors.

The logo assets in `assets/branding/` have opaque white or navy backgrounds. Choose the matching file for the surface and respect the [asset limitations](../../assets/branding/theme-guide.md#2-asset-files-and-limitations); the theme does not recolor them. The application theme does not replace the required classic Read the Docs appearance of documentation sites.

Modern evergreen browsers are the intended target. Cascade layers, `clamp()`, CSS grid, logical properties, `color-scheme`, and container queries are used; no legacy browser fallback is included. This stylesheet is an application presentation layer, not a claim that every Gramlot component or integration has been visually verified.

Syntax highlighting uses `.hljs-*` token classes mapped to the same semantic colors in light and dark mode. Python and JavaScript detection belongs to the runtime; the theme only styles the resulting code spans.

The base text size is 14px with compact headings and spacing. Runner navigation uses the approved navy navigation surface, blue selected item and yellow brand accent; these are the existing palette tokens, not new colors.
