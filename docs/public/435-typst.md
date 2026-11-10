# Typst previews

Document ID: **GC-435**.

The typst collection turns a Typst document held in a Data string into a page
preview and a PDF, inside the browser. This page answers **how to show a Typst
document and let the user download it**. The complete list of parameters is in the
[widget reference](345-widget-reference.md).

<a id="gc-435-start"></a>

## Declaring the collection

```python
from gramlot import Page as GramlotPage
from gramlot.collections.typst import mygramlot as typst


class Page(GramlotPage):
    gramlots = [typst]

    def main(self, root):
        root.typstPreview(value="^document.source", filename="report.pdf")
```

typst is not part of the standard set, because its compiler is large: a page that
uses it declares it in `gramlots`, and a base class can declare it once for all its
pages ([declaring typst](340-components-and-collections-guide.md#gc-340-050-typst)).

<a id="gc-435-005"></a>
<a id="gc-435-010"></a>
<a id="gc-435-220"></a>
<a id="gc-435-shared-value"></a>
<a id="gc-435-425"></a>
<a id="gc-435-215"></a>
<a id="gc-435-typstpreview"></a>

## Editing beside the preview

```python
form.codeMirror(value="^.content", language="typst")
form.typstPreview(value="^.content", filename="report.pdf")
```

[typstPreview](345-widget-reference.md#gc-345-typstpreview) only reads `value`. To
let the user write the document, bind a [codeMirror](430-editors.md#gc-430-codemirror)
from the editors collection to the same path.

- **Updates.** The preview compiles after a short pause in typing. While a new
  version compiles, the old one is hidden and its download disabled, so the user
  never downloads a stale document. Errors appear inside the preview.
- **Download.** The Download PDF link saves the compiled document under
  `filename`. It does not save the Typst source: storing that is up to your
  application.
- **Resources.** The compiler and five fonts are bundled, so self-contained
  documents compile offline with no server. Includes, custom assets and external
  packages are not available
  ([compiler and resources](105-components.md#gc-105-145)).
