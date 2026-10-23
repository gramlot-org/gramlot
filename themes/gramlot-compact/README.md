# Compact

Professional desktop profile, revised at the owner's request on 2026-10-23.
Neutral blue-gray, compact daily work. Controls are 28px high; body and field text are 13px. Light and dark
palettes use the same semantic roles. Existing touch targets remain larger.

```python
class Page(BasePage):
    css = ("/themes/gramlot-compact/theme.css",)
```

The server loads Base first. The gallery's existing appearance selector uses the
same canonical stylesheet. Inputs, command buttons, menus, tabs and window chrome
share existing field/button/spacing/radius tokens. Fixed Source dimensions still
win; use semantic spacing variables when a page should follow profile density.
These revised aesthetics are a development preview awaiting owner feedback.

## Historical record — before the 2026-10-23 aesthetic revision

# Gramlot Compact theme

Compact is the denser alternative to Gramlot Base. It reduces typography, spacing,
headings, card padding, table cells and form controls. It shares Base's palette,
light/dark modes, focus indicators and semantic HTML rules.

Load Compact after Base. The server loads Base as its base theme (GC-090 §030);
the page adds Compact with `Page.css`. Compact contains only the size and spacing
rules that differ; it does not duplicate the Base stylesheet or import another URL.

```python
from gramlot import Page as BasePage

class Page(BasePage):
    css = ("/themes/gramlot-compact/theme.css",)
```

```javascript
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static css = ['/themes/gramlot-compact/theme.css'];
}
```

Declare this list on a shared application Page base class to reuse it across pages.
Keep the usual native elements and classes in `main`; there is no theme-specific
builder syntax. Declare no `css` to use the original theme, Base alone.

| Setting | Base | Compact |
| --- | --- | --- |
| Root font size | 14px | 13px |
| Body line height | 1.5 | 1.35 |
| Stack/grid gap | 1rem | .6rem |
| Button and single-line field minimum height | 2.75rem | 28px |
| Card padding | .75–1rem | .6rem |
| Table cell padding | .7rem .8rem | .4rem .5rem |

Color mode is independent: `data-theme="light"` or `data-theme="dark"` on the
document root selects it, otherwise Base follows the system preference. Application
CSS outside the Gramlot cascade layers can override both themes. Browser zoom remains
available; multiline controls keep their native behavior.


For additional compact palettes, load `mimi/theme.css` or
`joanna/theme.css` after Base and Compact. Both inherit the same semantic
variables and style input components as well as ordinary HTML. See
[theme profiles](../../docs/public/096-themes-and-css.md#gc-096-017).
