# Joanna

Professional desktop profile, revised at the owner's request on 2026-10-23.
Balanced density, warm neutral surfaces and blue accent. Controls are 32px high; body and field text are 14px. Light and dark
palettes use the same semantic roles. Existing touch targets remain larger.

```python
class Page(BasePage):
    css = ("/themes/gramlot-compact/theme.css", "/themes/joanna/theme.css")
```

The server loads Base first. The gallery's existing appearance selector uses the
same canonical stylesheet. Inputs, command buttons, menus, tabs and window chrome
share existing field/button/spacing/radius tokens. Fixed Source dimensions still
win; use semantic spacing variables when a page should follow profile density.
These revised aesthetics are a development preview awaiting owner feedback.

## Historical record — before the 2026-10-23 aesthetic revision

# joanna

A Gramlot interpretation of GenroPy's `joanna` theme. The light palette
comes from `resources/common/themes/joanna.css` in GenroPy; styles are
implemented for current HTML and Gramlot components, without Dojo dependencies.
Dark mode is a new coordinated adaptation. It is not a pixel-identical port of
legacy layout widgets. Legacy user color variants are outside this increment.

The server loads Base (its base theme, GC-090 §030); load Compact and this profile after it:

```python
class Page(BasePage):
    css = ("/themes/gramlot-compact/theme.css",
           "/themes/joanna/theme.css")
```

The index/gallery Theme selector applies this same CSS to the shell and frames.
Color mode is independent. CSS variables inherit into input shadow roots, including
labels, choices, calendar and validation messages. Application CSS can override the
semantic variables; component-specific Source attributes keep normal precedence.

Density refinement: live Mimi invoice fields measured 17.5px / 12px text / 10.8px labels. Gramlot Mimi uses 18px fields, joanna 20px; both use 1px × 3px padding, 2px label gap and 6px stack spacing. joanna retains its own 13px typography and Joanna .8em label ratio; only Mimi was measured in the live invoice. Override field-line-height and label-gap using the shared --gramlot-* tokens.
