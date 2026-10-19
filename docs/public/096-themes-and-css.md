# Themes and CSS

Document ID: **GC-096**.

```{raw} html
<style>
/* Wrap reference cells within this guide's Read the Docs content column. */
#themes-and-css .wy-table-responsive table.docutils td,
#themes-and-css .wy-table-responsive table.docutils th { white-space: normal; }
/* Keep code and its rendered result together, without changing RTD typography. */
body:has(#themes-and-css) .wy-nav-content { max-width: 1440px; }
#themes-and-css .container:has(> figure) {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.5rem;
  margin: 1.5rem 0 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e1e4e5;
}
#themes-and-css .container:has(> figure) > * { min-width: 0; }
#themes-and-css .container > figure { margin: 0; }
#themes-and-css .container > figure img { max-width: 1080px; }
#themes-and-css .container pre { white-space: pre-wrap; overflow-wrap: anywhere; }
@media (min-width: 1600px) {
  #themes-and-css .container:has(> figure) {
    grid-template-columns: minmax(16rem, 1fr) minmax(0, 3fr);
    align-items: start;
  }
}
</style>
```

Use this guide to give a Gramlot application a consistent appearance, then adapt
it without copying the framework's stylesheets. Start with the working Python
page below; use the catalogues when you need a particular variable or class.

Each visual comparison shows the Python example running in a browser, with a
caption explaining the change. On wide screens, results take three quarters of
the comparison row. When space is limited, the result uses the full width below
the code so its details stay readable. Images use the same desktop viewport and scale;
click an image to inspect it at full size. They are static screenshots: run the
Python page to try its controls yourself.

This is a topic guide alongside the [learning route](025-try.md).
The first examples use HTML Source and CSS; the interactive example adds
[Data bindings](097-data-binding.md). Python pages run on a Python server. If you
have no project yet, follow [the quick route](018-quickstart.md).

- <a href="#gc-096-010">Build your first styled page</a>.
- <a href="#gc-096-015">Choose Base or Compact and share application CSS</a>, or try the <a href="#gc-096-017">GenroPy-inspired profiles</a>.
- <a href="#gc-096-020">Understand overrides</a> and <a href="#gc-096-025">light/dark mode</a>.
- <a href="#gc-096-030">Look up variables</a> and <a href="#gc-096-035">ready-made classes</a>.
- <a href="#gc-096-040">Connect appearance to Data</a>.
- <a href="#gc-096-050">Apply good practices</a> or <a href="#gc-096-055">diagnose a problem</a>.

<a id="gc-096-005"></a>

## 005 · Four ideas to know

Block ID: **GC-096-005**.

| Idea | Meaning | Example |
| --- | --- | --- |
| Theme | A stylesheet that supplies common colours, typography and element styles. | Gramlot Base styles buttons and inputs. |
| Token | A named CSS variable reused by several rules. Read it with `var(...)`. | `var(--gramlot-surface)` is a panel background. |
| Class | A name attached to an element, matched by a CSS selector. | Python `class_="card"` matches CSS `.card`. |
| Binding | A connection from a Source attribute to a value in Data. | `class_="^.status_class"` follows a Data string. |

Python declares the elements through Source. The browser applies CSS to the
rendered HTML. CSS controls presentation; Data, bindings and controllers control
application state and behaviour. A stylesheet does not create a controller,
validate a form or save its values.

The server loads a theme on every page, before the page's stylesheets: Gramlot
Base (`gramlot-base`) unless the server chooses another with its `css_theme`
option (`cssTheme` in JavaScript) or none with `False`. A page replaces it with
`css_theme = "<name>"`, or loads none with `css_theme = False`. `Page.css` lists
the stylesheets loaded after the theme: overlays such as Compact and application
CSS. A page that still lists Base in `Page.css` loads it once. There is no
`root.css()` API. `css_requires` names resources in a resource host; it is not a
replacement for stylesheet URLs in the current file servers.

The core ships one complete theme, Base. Compact, mimi and joanna are overlays:
load them with `Page.css`, after Base.

<a id="gc-096-010"></a>

## 010 · First example: a card and its own stylesheet

Block ID: **GC-096-010**.

In an existing Python project, put these two files in its pages folder:

```text
pages/
    appearance.py
    appearance.css
```

**`pages/appearance.py` — complete page:**

```python
from gramlot import Page as BasePage


class Page(BasePage):
    title = "Appearance"

    def main(self, root):
        main_content = root.html_main(class_="example-page stack")
        main_content.h1("Your workspace")
        main_content.p("A small page styled with Gramlot Base.", class_="muted")
        pane = main_content.section(class_="card stack workspace")
        pane.h2("Project notes")
        pane.p("Keep the theme's colours and customize the layout.")
        pane.span("Ready", class_="status status--success")
        pane.a("Read the notes", href="#notes", class_="button button--secondary")
        main_content.p("Your project notes go here.", id="notes")
```

### See the result: before and after companion CSS

::::{container}

:::{container}

**Base alone**

The complete Python page above declares no stylesheet: the server loads Base.
Leave out the companion stylesheet.

:::

```{figure} assets/themes/appearance-before.jpg
:alt: Base alone: wide card with a full-width secondary button and no blue accent.
:width: 100%

**Before — Base alone.** Run the Python page without `appearance.css`: the
content uses Base's 72rem maximum width and the button stretches across the card.
```

::::

::::{container}

:::{container}

**Add pages/appearance.css**

Complete companion stylesheet. Keep the Python page unchanged.

```css
:root {
  --gramlot-page-width: 64rem;
  --gramlot-radius-lg: 0.75rem;
}

.workspace {
  border-inline-start: 4px solid var(--gramlot-brand-blue);
}

.workspace .button {
  justify-self: start;
}
```

:::

```{figure} assets/themes/appearance-after.jpg
:alt: Companion CSS: narrower card with a blue left border and a content-width button.
:width: 100%

**After — add the companion CSS alongside.** The maximum width becomes 64rem,
the card gains a blue leading border, and `justify-self: start` makes the button
fit its content. The 0.75rem radius keeps Base's existing corner shape.
```

::::

Open the `appearance` page through your project's server. You should see a
centred content area with a heading and a rounded card, a green Ready badge and a link styled as a
secondary button. The link moves to the notes; there is no JavaScript to write.
The colours follow the operating system's light/dark preference.

**Why it works:** the server loads Base. The file server discovers the same-name
`appearance.css` and loads it afterwards. `.card` supplies the surface and border;
`.stack` spaces its children; `.workspace` adds only the page-specific accent.
Change `64rem` to `48rem`, reload, and the page becomes narrower on wide screens.
The theme's width rule still leaves gutters on a small screen.

Use your server's page URL and reload/restart procedure. A CSS file is a served
resource, not a filesystem path in `Page.css`.

<a id="gc-096-015"></a>

## 015 · Choose a theme and organize application styles

Block ID: **GC-096-015**.

Base is the complete stylesheet. Compact is an overlay: it keeps Base's colours
and changes density. Compare the first example, which declares no `css`, with one
`css` declaration that adds Compact:

Load Base first, Compact second. Both can be light or dark: **density** and
**colour mode** are separate choices.

::::{container}

:::{container}

**Base**

Keep the first example's Python content and companion CSS, with no `css`
declaration: the server loads Base.

:::

```{figure} assets/themes/appearance-after.jpg
:alt: Base with the companion stylesheet: larger text, spacing and controls.
:width: 100%

**Base — the first example.** Keep the same Python content and companion CSS
for this comparison.
```

::::

::::{container}

:::{container}

**Base + Compact**

Add one Page.css declaration; keep the companion CSS.

```python
css = ("/themes/gramlot-compact/theme.css",)
```

:::

```{figure} assets/themes/compact.jpg
:alt: The same page with Compact: smaller text, shorter button and tighter spacing.
:width: 100%

**Base + Compact — add one stylesheet URL.** Text, controls and gaps become
smaller. The 64rem content area also narrows because one rem changes from 14px
to 13px. The companion CSS still supplies the accent and corner radius.
```

::::

| Setting | Base | Base + Compact |
| --- | --- | --- |
| Root font size | 14px | 13px |
| Body line height | 1.5 | 1.35 |
| Stack/grid gap | 1rem | .6rem |
| Button/single-line field minimum height | 2.75rem | 28px |
| Card padding | .75–1rem, responsive | .6rem |
| Table cell padding | .7rem .8rem | .4rem .5rem |

For several pages, keep shared overrides in one application stylesheet and the
URL list on a shared Python Page base. Here is a complete page module illustrating
inheritance; move the base class into your application's importable Python
package when sharing it across modules:

```python
from gramlot import Page as BasePage


class ApplicationPage(BasePage):
    css = (
        "/themes/gramlot-compact/theme.css",
        "/application.css",
    )


class Page(ApplicationPage):
    def main(self, root):
        main_content = root.html_main(class_="example-page stack")
        main_content.h1("Orders")
        main_content.p("This page inherits the application's stylesheet list.")
```

Put `application.css` in the served pages folder for the file-server layout, or
configure that URL through your host's asset facilities. A page's same-name CSS
still follows the explicit list. A subclass that replaces `css` replaces the
inherited list; include the common URLs when adding another stylesheet.

The loading sequence is **Base → optional Compact → shared application CSS →
same-name page CSS**. Loading order resolves otherwise equal rules; it does not
override cascade layers, specificity or inline styles (next section).

Root-relative URLs such as `/application.css` receive the application's mount
prefix once. Relative URLs resolve against the page URL, and absolute URLs remain
as written. See [resources and companion files](090-classes-and-hosts.md).
The adapters serve packaged themes at `/themes/…`; a custom host must serve them.
Python pages require Python hosting; JavaScript serverless exports package the
declared styles for their JavaScript pages.

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

Use the smallest change that expresses your intention:

| You want to change… | Use | Reason |
| --- | --- | --- |
| A shared surface, font or radius | A token on `:root` | Every rule using that token stays consistent. |
| One area of the application | A class and, where useful, tokens on that class | The change is scoped to that area. |
| Layout or a property with no token | A CSS rule | Not every size in Base is tokenized. |
| One dynamic property driven by Data | A bound style shortcut | Gramlot updates the rendered property. |
| Several visual properties together | A bound class string | CSS keeps responsibility for the appearance. |

### Change one part of the page

Inside `main` in the first example, replace the final notes paragraph with this
second card:

```python
        pane = main_content.section(class_="card stack summary", id="notes")
        pane.h2("Summary")
        pane.p("Only this card has tighter corners and more space between rows.")
```

Compare the inherited values with a scoped override in the companion CSS:

Custom properties inherit. The card and its children see these values; other
cards keep their existing values. A descendant's own declaration takes precedence
over an inherited value. Root-dependent rules, such as the `html` font size,
cannot be changed by setting a variable on a child card.

::::{container}

:::{container}

**Inherited values**

The first example already sets the radius. Add no .summary override yet.

```css
:root {
  --gramlot-radius-lg: 0.75rem;
}

/* Base supplies this spacing token: */
/* --gramlot-space-4: 1rem */
```

:::

```{figure} assets/themes/summary-before.jpg
:alt: Two cards before the scoped override, both with rounded corners and the default row gap.
:width: 100%

**Before — add the Summary card without the `.summary` CSS rule.** Both cards
inherit the page's radius and spacing values.
```

::::

::::{container}

:::{container}

**Override only Summary**

Append this rule to appearance.css. It affects only the Summary card.

```css
.summary {
  --gramlot-radius-lg: 0.25rem;
  --gramlot-space-4: 1.5rem;
}
```

:::

```{figure} assets/themes/summary-after.jpg
:alt: Only the Summary card has tighter corners and a larger gap between its heading and text.
:width: 100%

**After — add the two scoped variables.** Summary gets a 0.25rem corner radius
and a 1.5rem row gap. The Project notes card above keeps its previous appearance.
```

::::

### Understand the cascade

Base declares five layers, in order:

```css
@layer gramlot.reset, gramlot.tokens, gramlot.base,
       gramlot.components, gramlot.utilities;
```

Reset establishes basic sizing; tokens define variables; base styles text and
elements; components style controls; utilities supply classes such as `.card`.
For normal declarations, a later layer wins over an earlier layer. Normal
application CSS **outside a layer** wins over these layered rules, even when the
theme selector is more specific. Within the same layer, specificity and then
source order resolve otherwise competing declarations.

For application overrides, start with ordinary unlayered CSS as in the examples.
Avoid adding `!important` to make a rule work: it reverses layer precedence and
makes later overrides harder. Inline styles normally beat stylesheet rules;
an important declaration can beat a normal inline declaration. Check the browser's
Computed/Styles panel before increasing specificity.

### A property without a variable

Base's root font size and card padding are CSS declarations, not dedicated tokens.
For larger application text and more generous card padding, append the declarations
shown next to the second result:

::::{container}

:::{container}

**Default text size**

Keep the original companion stylesheet and Base's card padding.

```css
/* From Base; no new override needed. */
html { font-size: 14px; }
```

:::

```{figure} assets/themes/appearance-after.jpg
:alt: The first example with Base's 14px root font size and default card padding.
:width: 100%

**Before — the first example with its companion CSS.** Base uses a 14px root
font size and its default responsive card padding.
```

::::

::::{container}

:::{container}

**Increase text and padding**

Append these two rules to the original companion stylesheet.

```css
html { font-size: 16px; }
.workspace { padding: 1.5rem; }
```

:::

```{figure} assets/themes/larger-text.jpg
:alt: Larger text and more padding inside the card after the two CSS declarations.
:width: 100%

**After — append the two declarations alongside.** Text grows and the card gains
more inner space. Sizes expressed in rem grow too: the 64rem content area is
now 1024px instead of 896px at this viewport.
```

::::

`rem` follows the root font size; `em` follows the relevant element's font size.
Compact also contains fixed pixel sizes, so changing the root font does not scale
every control dimension. Changing a token affects only rules that actually use it.

<a id="gc-096-025"></a>

## 025 · Light and dark mode

Block ID: **GC-096-025**.

Base chooses its palette on the document's `<html>` element:

| Document root | Result |
| --- | --- |
| No `data-theme` attribute | Follow `prefers-color-scheme` from the system/browser. |
| `data-theme="light"` | Explicit light palette. |
| `data-theme="dark"` | Explicit dark palette. |

The `root` passed to `main` builds application Source inside the host document.
It is not that document's `<html>`. Adding `data_theme="dark"` to a `div` does
not activate Base's root selectors. Ordinary pages can simply follow the system.
For the selector of the index shell, see [IndexPage](095-writing-pages.md#gc-095-110)
and the application-shell section below. Do not add application DOM manipulation to switch modes.

### Customize a surface in both modes

Add this to `application.css` or to the first example's companion CSS:

```css
:root {
  --gramlot-surface-subtle: #eef2f8;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --gramlot-surface-subtle: #26364a;
  }
}

:root[data-theme="dark"] {
  --gramlot-surface-subtle: #26364a;
}
```

The first rule supplies the light value. The media query supplies automatic dark
mode unless Light was explicitly selected. The last rule handles explicit Dark
even on a light system. The CSS is unlayered, so it overrides Base and Compact.
The sample colours are application choices, not additions to Gramlot's brand palette.

In the first example, replace the final notes paragraph with this surface:

```python
        pane = main_content.section(class_="card surface-subtle", id="notes")
        pane.p("This surface changes with the colour mode.")
```

::::{container}

:::{container}

**Light surface rule**

This part of the complete stylesheet above supplies the light value. The host document uses Light mode.

```css
:root {
  --gramlot-surface-subtle: #eef2f8;
}
```

:::

```{figure} assets/themes/surface-light.jpg
:alt: Light mode: white project card and pale blue-grey custom surface below it.
:width: 100%

**Light — custom subtle surface `#eef2f8`.** The lower card uses the new
surface token; the rest of the page retains Base's light palette.
```

::::

::::{container}

:::{container}

**Dark surface rules**

These parts of the same stylesheet supply automatic and explicit dark values. The capture uses explicit Dark.

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --gramlot-surface-subtle: #26364a;
  }
}

:root[data-theme="dark"] {
  --gramlot-surface-subtle: #26364a;
}
```

:::

```{figure} assets/themes/surface-dark.jpg
:alt: Dark mode: dark project card, light text and a blue-grey custom surface below it.
:width: 100%

**Dark — custom subtle surface `#26364a`.** The same Python and CSS use the
dark override. These captures use the host document's explicit Light and Dark
modes; no page-side DOM code is needed.
```

::::

A single unlayered `:root` colour override wins in **both** modes unless you also
provide dark overrides. Test text, controls and focus on every surface you change.

<a id="gc-096-030"></a>

## 030 · Complete application theme variable catalogue

Block ID: **GC-096-030**.

These are all the `--gramlot-*` variables declared by Base. Compact changes only
the spacing and radius variables listed below. The catalogue describes the checked-in
stylesheets, including their current limitations; it is not a new component API.

### Colours

The dark column applies to both automatic and explicit dark mode. Brand colours
do not change. Use semantic names such as `--gramlot-error` for meaning, instead
of hard-coding a red in each component.

| Variable | Light | Dark | Intended use |
| --- | --- | --- | --- |
| `--gramlot-brand-blue` | `#456bc4` | same | Brand accents, selected navigation, native control accent. |
| `--gramlot-brand-yellow` | `#ffc400` | same | Highlights and brand accents. |
| `--gramlot-ink` | `#243449` | `#edf2fa` | Main text. |
| `--gramlot-background` | `#f7f8f5` | `#111b29` | Body background. |
| `--gramlot-surface` | `#ffffff` | `#1b293b` | Cards/controls; also primary-button text. |
| `--gramlot-surface-subtle` | `#edf1f7` | `#24354b` | Code, table headers and quieter surfaces. |
| `--gramlot-text-secondary` | `#566579` | `#bdc9d9` | Supporting text and placeholders. |
| `--gramlot-border` | `#d5dce5` | `#44566d` | Decorative borders and separators. |
| `--gramlot-border-control` | `#7a8798` | `#9bacbf` | Control boundaries. |
| `--gramlot-navigation` | `#182333` | `#0b1420` | Navigation background, used by IndexPage. |
| `--gramlot-navigation-text` | `#edf2fa` | same | Text on navigation surfaces. |
| `--gramlot-action` | `#456bc4` | `#91adf4` | Links, primary buttons and highlighted code. |
| `--gramlot-action-hover` | `#3557ab` | `#b3c6fa` | Hovered actions. |
| `--gramlot-selected` | `#eaf0fc` | `#283c61` | Selection and hovered table rows. |
| `--gramlot-success` | `#23745b` | `#89d4b7` | Success text and status badges. |
| `--gramlot-success-background` | `#eaf5ef` | `#163c34` | Success badge background. |
| `--gramlot-warning` | `#785000` | `#ffdc86` | Warning text and badges. |
| `--gramlot-warning-background` | `#fff4cf` | `#483718` | Warning badge background. |
| `--gramlot-error` | `#b13d48` | `#ffb3bb` | Error text, alerts and invalid fields. |
| `--gramlot-error-background` | `#fceef0` | `#4d2630` | Error badge background. |
| `--gramlot-focus-ring` | `#456bc4` | See note | Keyboard-focus outline. |

**Focus-ring detail:** automatic dark mode sets `#ffc400`. The explicit-dark block
currently does not override the focus token: explicit Dark on a light system keeps
`#456bc4`; on a dark system the media query supplies `#ffc400`. Do not assume those
two cases are identical when checking focus contrast.

### Spacing and corners

Values are the same in light and dark. The number in a spacing token is a scale
name, not a pixel count. Base uses a 14px root; Compact uses 13px.

| Variable | Base | Compact | Use |
| --- | --- | --- | --- |
| `--gramlot-space-1` | `.25rem` | `.2rem` | Small separation, such as below labels. |
| `--gramlot-space-2` | `.5rem` | `.4rem` | Button content gap and caption spacing. |
| `--gramlot-space-3` | `.75rem` | `.5rem` | Available scale step for application CSS. |
| `--gramlot-space-4` | `1rem` | `.6rem` | Stack/grid gap and form-child spacing. |
| `--gramlot-space-6` | `1.5rem` | `.9rem` | Available scale step for application CSS. |
| `--gramlot-space-8` | `2rem` | `1.2rem` | Available scale step for application CSS. |
| `--gramlot-space-12` | `3rem` | `1.8rem` | Available scale step for application CSS. |
| `--gramlot-radius-sm` | `.375rem` | `.25rem` | Controls and inline code. |
| `--gramlot-radius` | `.5rem` | `.35rem` | Code blocks, details and fieldsets. |
| `--gramlot-radius-lg` | `.75rem` | `.4rem` | Cards and dialogs. |

Some scale steps are provided for reuse without being consumed by Base itself.
Card padding and many heading/table dimensions use direct CSS values; changing
the spacing scale alone does not change all whitespace.

### Fonts, width and shadow

| Variable | Base value | Compact | Use |
| --- | --- | --- | --- |
| `--gramlot-font-ui` | `system-ui, -apple-system, BlinkMacSystemFont, sans-serif` | same | Body and inherited control font. |
| `--gramlot-font-code` | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` | same | Code and preformatted text. |
| `--gramlot-page-width` | `72rem` | same | Maximum width of `.example-page`; not every container. |
| `--gramlot-shadow` | Light/dark values below | same token | Card and dialog shadow; Compact explicitly removes the card shadow. |

```css
/* Base light */
--gramlot-shadow: 0 1px 2px rgb(24 35 51 / 5%),
                 0 8px 24px rgb(24 35 51 / 5%);
/* Base dark, automatic or explicit */
--gramlot-shadow: 0 1px 2px rgb(0 0 0 / 15%),
                 0 8px 24px rgb(0 0 0 / 12%);
```

These last declarations are reference values: put a chosen declaration inside
a selector when using it in a stylesheet. The theme does not download fonts.
If you introduce a web font, serve it through your application's assets and
declare its `@font-face` before using its family name.

The separate `gramlot-index` stylesheet also reads `--sidebar-width` with a
`240px` fallback. IndexPage's resize behaviour writes that value on its shell;
it is shell layout state, not another general `--gramlot-*` design token.

<a id="gc-096-035"></a>

## 035 · Ready-made HTML styles and classes

Block ID: **GC-096-035**.

Base already styles headings, paragraphs, links, lists, code, blockquotes, forms,
buttons, tables, details, dialogs, progress and meter. Start with meaningful HTML
elements. Styling a dialog does not open it or supply an application dialog API.
An ordinary anchor with `.button` remains a link; keep its `href` meaningful.

| Class | What it does | Python usage inside `main` |
| --- | --- | --- |
| `example-page` | Centred content with responsive gutters and maximum width. | `root.html_main(class_="example-page")` |
| `stack` | Grid with vertically spaced children; clears their block margins. | `root.div(class_="stack")` |
| `grid` | Responsive columns, normally at least 18rem when space permits. | `root.div(class_="grid")` |
| `card` | Bordered surface, padding, rounded corners and a query container. | `root.section(class_="card")` |
| `muted` | Supporting text colour. | `root.p("Optional", class_="muted")` |
| `surface-subtle` | Quieter background. | `root.div(class_="surface-subtle")` |
| `button` | Button appearance for a suitable element, such as a link. | `root.a("Notes", href="#notes", class_="button")` |
| `button--secondary` | Outlined/surface action variant. | `root.button("Preview", class_="button--secondary")` |
| `button--quiet` | Low-emphasis action variant. | `root.button("Cancel", class_="button--quiet")` |
| `status` + `status--success`, `status--warning` or `status--error` | Rounded badge with semantic colours. | `root.span("Pending", class_="status status--warning")` |
| `sr-only` | Visually hidden text that remains available to assistive technology. | `root.span("Additional information", class_="sr-only")` |
| `example-art` | Fluid SVG illustration width. | Apply to the SVG root. |
| `gramlot-icon` | Small SVG icon filled with `currentColor`. | Apply to the SVG root. |
| `gramlot-icon--stroke` | Stroke-based SVG icon; combine with `gramlot-icon` for its size. | Apply both to the SVG root. |

The stylesheet also recognizes `button.secondary` and `button.quiet`. The
`button--…` spelling used above works for button-like links too, when combined
with `.button`. The table illustrates presentation; plain buttons have no
application action until one is declared through Gramlot.

A `.card` is an inline-size query container. A `.grid` inside a sufficiently
narrow card becomes one column through a container query. You can also write
application media queries for layouts that depend on viewport width.

`aria-invalid="true"` marks a field's error border; `aria-selected="true"`
styles a selected table row. `role="status"` and `role="alert"` get semantic
text colours. Set these attributes for their actual meaning, not only to obtain
a colour. `.hljs-*` classes style already-highlighted code spans; CSS does not
perform syntax highlighting.

<a id="gc-096-040"></a>

## 040 · Python styles and a reactive example

Block ID: **GC-096-040**.

Use `class_` in Python to write the HTML `class` attribute; `_class` is also
supported. Multiple classes are one space-separated string. `style` is a CSS
string. Neither `style` nor `class` accepts a dictionary or Bag; a resolved
`None` removes the attribute.

Inside `main`, these declarations illustrate a one-off style and shortcuts:

```python
        root.p("A small note", style="font-style: italic;")
        root.div("A sized panel", width="12rem", padding="1rem", rounded=8)
        root.div("One composed style", style="color: red;", color="blue")
```

The last element is blue: a shortcut wins over the same property in `style`.
Explicit CSS units make dimensions easier to read. Shortcuts include `font_size`,
`margin_top`, `padding_*`, `border_*` and the general `style_*` form. A null
shortcut removes its property from the composed inline style. SVG presentation
attributes remain SVG attributes, not HTML style shortcuts. `width`/`height` on
`img`, `canvas` and `embed`, and `width`/`border` on `table`, remain HTML attributes.
The [binding reference](097-data-binding.md#gc-095-070) gives the full rules.

### Follow one style from Python to the browser

Read the columns from left to right. **Source is the declaration; DOM is the rendered
result.** Source entries below are readable attribute excerpts, not a Bag serialization
or a second API. DOM entries show only the relevant inline declarations; browsers
may normalize colors to `rgb(...)` and change spacing/order.

| Python inside `main` | Source node attributes | Rendered DOM style |
| --- | --- | --- |
| `pane.div("Hello", color="red", font_size="18px")` | `color: "red"`, `font_size: "18px"` | `style="color: red; font-size: 18px;"` |
| `pane.div("Hello", style="color: red; padding: 8px", color="blue")` | `style: "color: red; padding: 8px"`, `color: "blue"` | `style="color: blue; padding: 8px;"` |
| `pane.div("Hello", color="^text_color")` with Data `text_color = "red"` | `color: "^text_color"` | `style="color: red;"` |
| The same bound node after Data `text_color = "green"` | Still `color: "^text_color"` | `style="color: green;"` |

`color="red"` becomes a CSS declaration, not a `color="red"` HTML attribute on the
div. `font_size` becomes `font-size`. The Source keeps the original attributes:
Gramlot composes the browser's inline style without rewriting the declaration.

Try the binding with this excerpt inside `main(root)`:

```python
pane = root.div()
pane.html_label("Text color", for_="text-color")
pane.input(id="text-color", type="color", value="^text_color")
pane.div("Watch my color", id="style-demo", color="^text_color")
pane.dataSetter("text_color", "#ff0000")
```

Choose a color: the native control writes its `value` to Data, and the div's `color`
binding projects that Data into CSS. The Source of the div still says
`color="^text_color"`. This is two bindings sharing Data, not CSS writing back to Data.

**Which value wins?** Gramlot first composes the inline style: an explicit shortcut
wins over the same property in the `style` string; unrelated properties remain.
For example, blue wins over red in the second row, but padding stays 8px. Afterwards,
the browser applies the CSS cascade, including stylesheets and `!important` rules.
The computed color can therefore differ from the inline declaration; inspect both
in browser DevTools. A null shortcut removes its property from the composed style;
it is not a request to restore that property from the original `style` string.

### What happens in the reverse direction?

| What you edit | What changes | What does not happen automatically |
| --- | --- | --- |
| A bound color input, or the corresponding Data value | Data changes; the binding updates the DOM style | The Source pointer is not replaced by the color |
| A literal Source style attribute in Gramlot's Source inspector | The renderer projects the new declaration | The Python file is not edited or saved |
| An element's inline CSS in browser DevTools | The rendered DOM changes for that inspection | Source and Data are not rewritten |
| A stylesheet rule or an inspector **Styles** theme variable | The cascade changes the appearance of elements that use it | Gramlot does not reconstruct per-node Source attributes or Data values |

A direct DOM edit is a debugging experiment. A later projection of the affected
style can overwrite it; reloading rebuilds the page from its declarations. There is
no automatic inverse mapping: a computed color might come from a shortcut, an inline
style, a class, inheritance or a theme variable. Gramlot cannot infer which original
authoring choice you intended to change. To keep a change, edit the appropriate
Python/JS declaration, stylesheet or application data through its normal persistence.
Inspector Styles previews are temporary; **Download CSS** exports their theme overrides.

Practice the same steps in the gallery lesson *Style and visibility*, listed in the
[examples manual](https://gramlot-examples.readthedocs.io/en/latest/).

### Let Data select a class and a width

Save this complete page as `pages/style_state.py`. It needs only Base, which the
server loads, so no `css`, companion CSS or JavaScript file is required:

```python
from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        main_content = root.html_main(class_="example-page stack", datapath="appearance")
        main_content.dataSetter(".status_class", "status status--success")
        main_content.dataSetter(".panel_width", "16rem")
        main_content.dataSetter(".show_details", True)

        main_content.h1("Appearance follows Data")
        main_content.html_label("Badge appearance", for_="status-choice")
        choices = main_content.select(id="status-choice", value="^.status_class")
        choices.option("Success", value="status status--success")
        choices.option("Warning", value="status status--warning")
        choices.option("Error", value="status status--error")
        main_content.span("Preview", class_="^.status_class")

        main_content.html_label("Panel width", for_="width-choice")
        widths = main_content.select(id="width-choice", value="^.panel_width")
        widths.option("Narrow", value="16rem")
        widths.option("Wide", value="24rem")
        pane = main_content.section(
            class_="card", width="^.panel_width", max_width="100%"
        )
        pane.p("This panel follows the selected width.")

        label = main_content.html_label()
        label.input(type="checkbox", value="^.show_details")
        label.span(" Show details")
        main_content.p("The layout keeps this space when hidden.",
                       visible="^.show_details")
```

Select Warning: the badge changes colour. Select Wide: the card widens, bounded
by the available width. Clear Show details: the text becomes invisible but its
space remains. `visible=False` uses CSS visibility; `hidden=True` instead removes
the element from layout. These are presentation choices, not access controls.

::::{container}

:::{container}

**Initial Data values**

These declarations initialize the complete Python page above.

```python
main_content.dataSetter(
    ".status_class", "status status--success"
)
main_content.dataSetter(".panel_width", "16rem")
main_content.dataSetter(".show_details", True)
```

:::

```{figure} assets/themes/state-before.jpg
:alt: Initial controls: Success, Narrow and checked Show details, with a green badge and narrow panel.
:width: 100%

**Initial state — Success, Narrow, Show details checked.** The green preview
uses `status--success`; the card is 16rem wide and the details text is visible.
```

::::

::::{container}

:::{container}

**Change the bound values**

Select Warning and Wide, then clear Show details. These are the resulting Data values, not extra Python code; the existing class, width and visible bindings update the result.

```text
appearance.status_class = "status status--warning"
appearance.panel_width = "24rem"
appearance.show_details = False
```

:::

```{figure} assets/themes/state-after.jpg
:alt: Changed controls: Warning, Wide and unchecked Show details, with a yellow badge, wider panel and no details text.
:width: 100%

**After changing the controls — Warning, Wide, Show details unchecked.** Data
selects `status--warning` and a 24rem width; the details become invisible while
retaining their layout space. The wider card also needs fewer lines of text.
```

::::

`datapath="appearance"` groups this example's Data under `appearance`; the leading
dot in `.status_class` resolves inside that group. `dataSetter` supplies initial
values. The `^` bindings keep Source attributes and
controls connected to those Data paths. No input scraping, DOM listener or manual
class mutation is needed. This exercise isolates styling; a real status label
should also describe the actual state in words.

<a id="gc-096-045"></a>

## 045 · Application shells, frames and custom themes

Block ID: **GC-096-045**.

`IndexPage` is the existing reusable application shell. Its `css` lists
`gramlot-index/theme.css`; Base comes from the server, as for every page. The
shell's standard footer manages the theme (Base, Compact, mimi, joanna) and the
Light/Dark choice. Its behaviour remembers these choices and the sidebar width. Follow the complete
[IndexPage setup](095-writing-pages.md#gc-095-110),
including its browser Logic module; importing a CSS file alone does not supply
the shell's behaviour.

Each iframe is a separate document: each child page loads its own theme and its
own `Page.css`.
Parent styles do not cross the frame boundary, and the shell does not automatically
install a colour-mode receiver in arbitrary children. The gallery has its own
frame-side integration. Do not copy its internal messaging into an application
and treat it as a general theme API.

For a custom application theme, start with Base plus one shared stylesheet:

1. Keep semantic token names so existing element styles can reuse your values.
2. Put shared values on `:root`, with explicit light and dark rules where needed.
3. Add application classes for layouts and visual patterns used across pages.
4. Keep same-name page CSS for local details.
5. Test the result with real content, both modes and keyboard focus.

Keep the framework's installed files intact. An application overlay can live in
the application; a separately maintained replacement theme must define the tokens
and element styles it promises. Do not load Compact on its own: it is not such
a replacement. This guide does not introduce automatic theme discovery or a
component styling registry.

Custom-element shadow trees have their own styling boundary. Ordinary document
selectors do not reach their internals; use only the styling hooks documented by
that component. There is no general Gramlot widget token contract beyond the
styles described here. Application themes also do not change the public manual's
Read the Docs theme.

<a id="gc-096-050"></a>

## 050 · Practical rules for a maintainable application

Block ID: **GC-096-050**.

1. **Start with semantic HTML and Base.** Add classes when the visual role needs
   a name. A short rule that changes layout is easier to maintain than a copied
   button or input stylesheet.
2. **Keep meaning in tokens.** Use `--gramlot-error` for errors and
   `--gramlot-text-secondary` for supporting text. Change foreground/background
   pairs together. `--gramlot-surface` also supplies primary-button text, so a
   surface change needs a button check.
3. **Scope page rules.** Prefer `.workspace .button` to an application-wide
   `button` rule when only that page's buttons should change. Avoid generated DOM
   structure and IDs as a styling contract.
4. **Keep reusable styles in CSS.** Inline shortcuts are useful for a single
   computed dimension; use classes for reusable appearances. Do not expect a
   normal stylesheet rule to override a bound inline style.
5. **Use mode-aware colours.** A fixed light background can make dark-mode text
   unreadable. Check automatic mode and explicit Light/Dark separately. Do not
   communicate a status through colour alone; include text and, where useful, icons.
6. **Preserve usability.** Keep visible keyboard focus and associated field labels.
   Try zoom, long labels, narrow screens and touch. Compact's smaller controls
   suit dense interfaces only when the resulting targets remain usable for your
   audience. Base respects reduced-motion preferences; custom animations should too.
7. **Use flexible dimensions.** Prefer `max-inline-size`, wrapping and responsive
   grids to fixed page widths or heights. Give wide tables/code their own overflow
   container rather than hiding clipped content.
8. **Keep styling separate from behaviour.** State belongs in Data; bindings and
   controllers project it. Hiding content does not protect it or replace server
   authorization. A status colour does not implement validation.
9. **Verify the rendered result.** Check computed variables, labels, focus,
   disabled/invalid/selected states, both modes and all supported layouts. A theme
   file or a successful build is not an accessibility or cross-browser audit.

Modern browser features used by the styles include cascade layers, logical
properties, `clamp()`, Grid, `:has()`, `color-scheme` and container queries. There
is no legacy-browser fallback in the theme. Qualify the browsers your application
supports instead of assuming universal compatibility.

<a id="gc-096-055"></a>

## 055 · Troubleshooting

Block ID: **GC-096-055**.

| Symptom | Check | What to do |
| --- | --- | --- |
| Everything looks unstyled | Network response for the Base URL; rendered stylesheet links. | Check `css_theme` of the server and of the page, and that the host serves the packaged themes at `/themes/`. |
| Compact is incomplete | Whether Base loads first. | Load both files in the documented order. |
| Companion CSS is missing | Page and CSS names, folder and response status. | Put `appearance.css` beside `appearance.py`; reload/restart as your server requires. |
| A nested page cannot find shared CSS | Whether a relative URL resolves under the nested route. | Use the intended root-relative URL and let the host apply its mount prefix. |
| A rule is crossed out | Layers, specificity, inline style and `!important` in DevTools. | Correct the rule's scope or remove a conflicting authored inline property. |
| A variable seems to do nothing | Whether the target rule actually uses it and which element defines it. | Use the catalogue; add a direct CSS rule for untokenized properties. |
| Dark mode has a light patch | Unconditional application colour overrides. | Supply the matching dark rules, including explicit and system modes. |
| `data_theme` on a panel does nothing | Base's mode selector targets the document root. | Follow system mode or the documented shell setup; do not add nested `<html>`. |
| A parent theme does not style a frame | Child document's stylesheet list and integration. | Load themes in the child; mode synchronization is separate. |
| A style/class binding errors | The resolved value's type. | Supply a CSS/class string or null, not a dict/Bag/list. |
| New styles are absent from an export | Exported CSS and browser cache. | Regenerate the export after changing sources; verify the served bytes. |

For the underlying authoring rules, continue with [Writing pages](095-writing-pages.md).
For resource URLs, packaging and host responsibilities, see
[Classes and server adapters](090-classes-and-hosts.md).


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
