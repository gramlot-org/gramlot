# Themes and CSS

Document ID: **GC-096**.

[Full guide](../../docs/public/096-themes-and-css.md). Topic reference alongside
the chronological learning route, with complete Python pages, companion CSS,
captioned browser screenshots beside the relevant code, token/class catalogues and troubleshooting. Guide-scoped table
wrapping preserves the classic Read the Docs appearance. Each of twelve result
rows pairs the relevant declaration or explicitly labelled Data-state snapshot
with its capture. Rows have a narrow code column and a result column three times as wide at
1600px viewport width and above. Below that, results use the full content width
under the code. The guide content cap is 1440px; images never enlarge beyond
their 1080px source width. Full-size image inspection remains available. Complete Python pages
remain available; moved CSS declarations are not duplicated. Public rendering
omits reference metadata and numeric heading prefixes; source IDs and anchors stay. Python requires a
Python server. Interactive styling uses [Data bindings](097-data-binding.md).

<a id="gc-096-005"></a>

## 005 · Four ideas to know

Block ID: **GC-096-005**.

Themes style rendered HTML; tokens are CSS variables read with `var(...)`; classes
select rules; bindings connect Source attributes to Data. CSS is presentation,
not validation or persistence. The server loads a theme on every page before its
stylesheets: Base (`gramlot-base`) unless the server option `css_theme`/`cssTheme`
chooses another or `False` none; a page replaces it with `css_theme = "<name>"` or
loads none with `css_theme = False`. `Page.css` = stylesheets after the theme
(overlays, application CSS); a listed Base loads once. Base is the one complete core
theme; Compact, mimi, joanna are overlays loaded with `Page.css`. No `root.css()`
API. `css_requires` needs a resource host, unavailable in the current file servers.

<a id="gc-096-010"></a>

## 010 · First example: a card and its own stylesheet

Block ID: **GC-096-010**.

The full guide supplies `appearance.py` and its discovered companion
`appearance.css`: Base from the server (no `css`), `html_main`, `.example-page`, `.stack`,
`.card`, semantic status and a secondary link. CSS overrides page width/radius
and adds a scoped accent. Expected result and a width-change exercise are stated.
Before/after captures show the 72rem → 64rem width, blue leading border and
content-width button. Radius stays at Base's 0.75rem. URLs name served resources,
not filesystem paths.

<a id="gc-096-015"></a>

## 015 · Choose a theme and organize application styles

Block ID: **GC-096-015**.

Load Base → optional Compact → application CSS → same-name companion. Compact
is an overlay, not a replacement. A comparison shows reduced text/control/gap
sizes and the narrower rem-based content area at the same viewport. Density is independent of light/dark mode.
Base/Compact: root font 14/13px, line height 1.5/1.35, stack/grid gap 1/.6rem,
control minimum height 2.75rem/28px, card padding .75–1rem/.6rem, table padding
.7rem .8rem/.4rem .5rem. A shared application Page base can own the URL tuple;
subclass replacement is not automatic merging. The full guide includes a complete
inheritance example and stylesheet placement. Root-relative URLs receive mount
prefix once; relative URLs resolve against page URL. Custom hosts serve their
resources; Python is not executed by JavaScript serverless exports.

<a id="gc-096-017"></a>

## 017 · GenroPy-inspired themes

The compact proportions were checked against the live `test_invoice_pg` invoice:
Mimi fields measured 17.5px with 12px text and 10.8px labels. Gramlot uses an 18px
minimum field height, 1px × 3px padding and a 2px label gap. joanna uses a 20px
minimum with 13px text and .8em labels, following Joanna’s label ratio. Its live
invoice appearance has not been measured independently. These are desktop density
profiles, not a port of the legacy formbuilder layout. Widths remain page choices.

Choose **mimi** or **joanna** in the gallery/index Theme selector.
The selection reaches open example frames and uses the existing preference storage.
Color mode is independent.

| Profile | Legacy reference | Light appearance | Root font / field minimum |
| --- | --- | --- | --- |
| mimi | mimi.css | Titanium grays, dark navigation, blue actions, small corners | 12px / 18px |
| joanna | joanna.css | Light gray/white surfaces, softer corners, blue actions | 13px / 20px |

The profile `joanna` adapts the legacy file `joanna.css`. These profiles adapt the legacy light palettes and compact
proportions. They do not port Dojo widgets or guarantee pixel-identical layouts.
Dark palettes are Gramlot adaptations. Legacy user color variants are not
provided; Base and Compact remain available.

In an application, the server loads Base; load Compact and the profile after it:

```python
from gramlot import Page as BasePage

class Page(BasePage):
    css = (
        "/themes/gramlot-compact/theme.css",
        "/themes/mimi/theme.css",
    )
```

Use `/themes/joanna/theme.css` as the last path for joanna. JavaScript
`static css` uses the same list. Assets ship in core packages and serverless exports;
no legacy runtime or remotely downloaded font is needed.

Input components inherit theme variables into their shadow roots, including
labelbox, choices, calendar and validation messages. Shared metrics are
`--gramlot-field-height`, `--gramlot-field-padding`, `--gramlot-field-font-size`,
`--gramlot-field-line-height`, `--gramlot-label-size`, `--gramlot-label-gap`
and `--gramlot-label-color`. Field surfaces are `--gramlot-field-background` and
`--gramlot-field-readonly-background`. Colors use the existing palette, including
`--gramlot-ink`, `--gramlot-text-secondary`, `--gramlot-error` and
`--gramlot-error-background`. Override these variables in your application CSS;
explicit `lbl_*`/`box_*` Source styles retain their precedence.

Changing themes does not reconstruct components or change Data. Error indication
uses an outline and text color without changing field dimensions. Native checkboxes,
radios and sliders retain browser rendering with the theme accent color.

<a id="gc-096-020"></a>

## 020 · Customize with variables, classes or inline styles

Block ID: **GC-096-020**.

Root tokens for shared values; class-scoped tokens/rules for areas; direct CSS
for untokenized properties; bound shortcuts for individual dynamic properties;
bound class strings for coordinated appearance. Custom properties inherit, but
descendant declarations override inherited values. Root-dependent rules cannot
be changed from a child. Layers: `gramlot.reset`, `.tokens`, `.base`,
`.components`, `.utilities`. For normal declarations later layers win, unlayered
application rules outrank layered rules; specificity and order apply within a
layer. Inline styles normally win; important declarations reverse layer order
and can override normal inline styles. Avoid escalating specificity blindly.
Root font size/card padding are direct declarations; tokens affect only users
of those tokens. `rem` follows root size; fixed Compact pixel sizes do not.
Before/after captures show scoped Summary radius/gap changes and larger root
text/card padding. For the Summary variant, replace the first page's final notes
paragraph; keep the rest of its content and companion CSS.

<a id="gc-096-025"></a>

## 025 · Light and dark mode

Block ID: **GC-096-025**.

On document `<html>`, no `data-theme` follows system; `light`/`dark` select
explicit modes. Source `main(root)` is inside the host document; a panel's
`data_theme` cannot activate Base's root selectors. Ordinary pages can follow
system mode; IndexPage provides its existing shell controls. The full guide
shows unlayered light, system-dark-excluding-explicit-light, and explicit-dark
overrides for a subtle surface. An unconditional unlayered root colour override
wins in both modes. Light/dark screenshots show the same page with a final
subtle-surface card replacing the notes paragraph. Explicit host document modes
are used for capture; no application DOM manipulation is introduced.

<a id="gc-096-030"></a>

## 030 · Complete application theme variable catalogue

Block ID: **GC-096-030**.

The full guide enumerates every Base `--gramlot-*` declaration, meaning and
light/dark value; Compact changes only spacing/radius tokens. Groups:

- Colours: `brand-blue`, `brand-yellow`, `ink`, `background`, `surface`,
  `surface-subtle`, `text-secondary`, `border`, `border-control`, `navigation`,
  `navigation-text`, `action`, `action-hover`, `selected`, `success`,
  `success-background`, `warning`, `warning-background`, `error`,
  `error-background`, `focus-ring` (all with the `--gramlot-` prefix).
- Spacing `space-1/2/3/4/6/8/12`: Base .25/.5/.75/1/1.5/2/3rem;
  Compact .2/.4/.5/.6/.9/1.2/1.8rem. Some are available but unused by Base.
- Radius `radius-sm/radius/radius-lg`: Base .375/.5/.75rem;
  Compact .25/.35/.4rem.
- `font-ui`: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  `font-code`: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace.
- `page-width`: 72rem, consumed by `.example-page`.
- `shadow`: light `0 1px 2px rgb(24 35 51 / 5%), 0 8px 24px rgb(24 35 51 / 5%)`;
  dark `0 1px 2px rgb(0 0 0 / 15%), 0 8px 24px rgb(0 0 0 / 12%)`.
  Compact retains the token but removes card shadows explicitly.

Current focus detail: automatic dark sets yellow `#ffc400`; explicit dark has
no focus-token override, retaining blue `#456bc4` on a light system and the media
query's yellow on a dark system. This is documented, not corrected by this task.
`surface` is also primary-button text. Font sizes/card padding are not dedicated
tokens; no automatic font download. Index CSS reads `--sidebar-width` with 240px
fallback, written by shell resize behaviour; it is not a general design token.

<a id="gc-096-035"></a>

## 035 · Ready-made HTML styles and classes

Block ID: **GC-096-035**.

Base styles semantic HTML/forms/tables/details/dialogs/progress/meter. Classes:
`example-page`, `stack`, `grid`, `card`, `muted`, `actions` (wrapping flex row of actions, gap
`--gramlot-space-2`), `eyebrow` (small bold uppercase label above a heading), `surface-subtle`, `button`,
`button--secondary`, `button--quiet`, `status` plus `status--success/warning/error`,
`sr-only`, `example-art`, `gramlot-icon`, `gramlot-icon--stroke`. Also recognizes
`button.secondary/quiet`. Card is a query container; narrow nested grids collapse
to one column. SVG icons use currentColor and need appropriate accessible naming.
ARIA invalid/selected and status/alert styling should reflect actual semantics.
CSS styles `.hljs-*` spans but does not highlight code, open dialogs or implement
button actions. Full guide provides class meanings and Python usages.

<a id="gc-096-040"></a>

## 040 · Python styles and a reactive example

Block ID: **GC-096-040**.

`class_`/`_class` writes class; classes and style accept strings/null, not
dicts/Bags/lists. Shortcuts compose inline style and win over the same property
in `style`; null removes a shortcut property. The value of a shortcut is written with its CSS unit, as in
legacy (`width="12rem"`, `margin_top="4px"`) and copied unchanged: `width=20` gives `width: 20`, invalid CSS
that the browser ignores. `rounded` is the exception: a number is pixels (`rounded=4` → `border-*-radius: 4px`,
also `rounded_top` and the other side/corner forms). Plain-number properties (`opacity`, `z_index`) take a
number. SVG stays SVG (`svg(width=100)` valid); width/height on
img/canvas/embed and width/border on table remain HTML attributes with plain numbers.
The full guide adds a three-column Python → Source → DOM comparison: literal
color/font_size, duplicate style/shortcut precedence, and a pointer before/after a
Data update. Source snapshots are attribute excerpts, not a serialized Bag. DOM
snapshots omit unrelated declarations and may be browser-normalized. A complete
main-body color-input excerpt demonstrates Data → CSS, with Source retaining the
pointer. Shortcut precedence composes inline CSS before the browser cascade;
!important can affect computed results; null removes rather than restores a base
style property. Reverse-direction table distinguishes Data edits, literal Source
edits, DevTools DOM edits and theme-variable previews. DOM/CSS edits do not write
Source/Data or source files; later projection can overwrite them. Inspector theme
previews can be exported with Download CSS. Practice in the gallery lesson *Style and visibility* ([examples manual](https://gramlot-examples.readthedocs.io/en/latest/)).
The full `style_state.py` example uses `datapath="appearance"` for relative paths,
setters, two bound selects, a bound class,
bound width with max-width 100%, a checkbox and bound visibility. No JS file is
required. Initial/changed screenshots show Success → Warning, Narrow → Wide
and checked → unchecked Show details; these are static illustrations, not live
controls in the manual. Visibility keeps space; hidden removes
layout space. Neither is authorization. Real statuses also need meaningful text.

<a id="gc-096-045"></a>

## 045 · Application shells, frames and custom themes

Block ID: **GC-096-045**.

IndexPage lists `gramlot-index/theme.css` in `css` (Base comes from the server) and needs its documented Logic module. Standard
footer manages/persists appearance, mode and sidebar width. Iframes each load
their CSS; arbitrary children get no automatic receiver. Gallery receiver is not
a general application API. Prefer application overlay, common tokens with mode
variants, shared classes and local companions. Keep installed framework files
intact. No discovery/registry or general widget token API. Shadow roots require
component-documented hooks. Application themes do not change Read the Docs styling.

<a id="gc-096-050"></a>

## 050 · Practical rules for a maintainable application

Block ID: **GC-096-050**.

Start with semantic HTML/Base; use semantic tokens and foreground/background
pairs; scope selectors; keep reusable styles in CSS and state in Data. Check
light/dark, status labels, focus, disabled/invalid/selected states, zoom, touch,
long content, narrow screens and reduced motion. Compact's small controls require
audience-specific usability review. Prefer flexible layout and local overflow.
Modern CSS includes layers, Grid, logical properties, clamp, has, color-scheme
and container queries; no legacy fallback or universal-browser/a11y certification.

<a id="gc-096-055"></a>

## 055 · Troubleshooting

Block ID: **GC-096-055**.

Full guide maps symptoms to checks/fixes: missing Base, Compact without Base,
misnamed companions, relative URL mistakes, cascade/inline conflicts, unused
tokens, missing dark overrides, incorrect mode target, iframe isolation, invalid
binding types and stale exports. Use Network and Computed/Styles panels. Rebuild
exports after edits. Continue with GC-095 authoring and GC-090 host/resources.


<a id="gc-096-060"></a>
## 060 · Touch density across themes

Block ID: **GC-096-060**.

Touch density is a separate Base layer (`gramlot.touch`, after utilities), shared
by Base, Compact, mimi and joanna. The layer adjusts field height, padding, text,
label gap and control targets without replacing the selected palette. It is active
for `(pointer: coarse)` unless disabled, or explicitly through
`gramlot.dom.setTouchMode('on')`. Use `off` for ordinary theme sizes and `auto`
to restore detection. The root marker `data-gramlot-touch` is runtime-owned.
The touch target token is `--gramlot-touch-target`; calendar width and choice
button width use `--gramlot-calendar-width` and `--gramlot-choice-toggle-width`.
Existing field and label tokens also flow into component shadow roots.
Application inline sizing can still override ordinary CSS; declared phone
suitability is not an automatic layout conversion. See
[Touch interaction](105-components.md) for Page.devices and previews.
