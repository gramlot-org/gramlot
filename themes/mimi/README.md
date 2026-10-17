# mimi

A Gramlot interpretation of GenroPy's `mimi` theme. The light palette
comes from `resources/common/themes/mimi.css` in GenroPy; styles are
implemented for current HTML and Gramlot components, without Dojo dependencies.
Dark mode is a new coordinated adaptation. It is not a pixel-identical port of
legacy layout widgets. Legacy user color variants are outside this increment.

Load Base, Compact and this profile in order:

```python
class Page(BasePage):
    css = ("/themes/gramlot-base/theme.css",
           "/themes/gramlot-compact/theme.css",
           "/themes/mimi/theme.css")
```

The index/gallery Theme selector applies this same CSS to the shell and frames.
Color mode is independent. CSS variables inherit into input shadow roots, including
labels, choices, calendar and validation messages. Application CSS can override the
semantic variables; component-specific Source attributes keep normal precedence.

Density refinement: live Mimi invoice fields measured 17.5px / 12px text / 10.8px labels. Gramlot Mimi uses 18px fields, joanna 20px; both use 1px × 3px padding, 2px label gap and 6px stack spacing. joanna retains its own 13px typography and Joanna .8em label ratio; only Mimi was measured in the live invoice. Override field-line-height and label-gap using the shared --gramlot-* tokens.
