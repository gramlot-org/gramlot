# Gramlot Compact theme

Compact is the denser alternative to Gramlot Base. It reduces typography, spacing,
headings, card padding, table cells and form controls. It shares Base's palette,
light/dark modes, focus indicators and semantic HTML rules.

Load both stylesheets, in this order. Compact contains only the size and spacing
rules that differ; it does not duplicate the Base stylesheet or import another URL.
The same resource list works with Python servers, JavaScript servers and standalone
exports using the existing `Page.css` mechanism.

```python
from gramlot import Page as BasePage

class Page(BasePage):
    css = (
        "/themes/gramlot-base/theme.css",
        "/themes/gramlot-compact/theme.css",
    )
```

```javascript
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static css = [
        '/themes/gramlot-base/theme.css',
        '/themes/gramlot-compact/theme.css',
    ];
}
```

Declare this list on a shared application Page base class to reuse it across pages.
Keep the usual native elements and classes in `main`; there is no theme-specific
builder syntax. Load only Base to use the original theme.

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
