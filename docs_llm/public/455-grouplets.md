# Grouplets

Document ID: **GC-455**.

<a id="gc-455-start"></a>
## Start here

Reuse a Source-building method as a fragment. A grouplet provides the content host; groupletCard adds a title, folding and optional bound controls. Relative datapaths make the same fragment reusable with different Data.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). Example body for `main(self, root)`:

```python
for key in ("billing", "shipping"):
    root.groupletCard(title=key.title(), remote="address", datapath=key,
                      collapsible=True)
```

Define the Source endpoint on the same Page (the inputs collection supplies textbox):

```python
from gramlot import source

@source
def address(self, pane):
    pane.textbox(value="^.city", lbl="City")
```

The remote binding owns requests, children and cleanup. Do not add a second request from component DOM lifecycle hooks. [Remote Source contract](099-remote-content.md).

`collapsed` and `checkbox` support writeback. `checkbox=None` hides the control; `False` displays it unchecked. `delitem=None` hides Clear, `False` disables it, `True` enables it. The optional `doc` is bound Markdown for the in-card guide; empty text hides its information button. `chromeSide` only accepts top/left/right. Card folding, remote fragments and a full form/save lifecycle are distinct responsibilities; do not infer legacy GroupletForm APIs from this card.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)


<a id="gc-455-005"></a>
<a id="gc-455-010"></a>

Ordinary Source/CSS attributes remain in Writing pages and Themes and CSS.
Pages inherit environment collections; Page.gramlots adds missing ones. Buttons are built in.
Contract JSON omits only undeclared keys: no default is not the same as null. dtype: T text, B Boolean, L integer, R real, X structured value; remaining codes are TYTX. binding: read = Data to widget, write = widget to Data, twoWay = both. nullable permits None; enum restricts values; annotation preserves type/regex constraints. Parameters sharing a table row have exactly the same contract. Child grammar: * allows arbitrary Source children; empty permits none. Parent None means no declared restriction.


<a id="gc-455-440"></a>
## Reusable fragments


<a id="gc-455-380"></a>
<a id="gc-455-grouplet"></a>
### `grouplet`

Collection: grouplets. Reusable Source fragment loaded through the existing remote binding.


| Parameters | Contract |
| --- | --- |
| `remote` | `{"binding":"read","dtype":"T","nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-455-385"></a>
<a id="gc-455-groupletcard"></a>
### `groupletCard`

Collection: grouplets. A titled, foldable remote-content card with bound controls and an optional Markdown guide.


| Parameters | Contract |
| --- | --- |
| `remote` | `{"binding":"read","dtype":"T","nullable":true}` |
| `title, checkboxLabel` | `{"binding":"read","default":"","dtype":"T","qualification":"intl_str"}` |
| `chromeSide` | `{"binding":"read","default":"top","dtype":"T","enum":["top","left","right"]}` |
| `collapsible` | `{"binding":"read","default":false,"dtype":"B"}` |
| `collapsed` | `{"binding":"twoWay","default":false,"dtype":"B"}` |
| `checkbox` | `{"binding":"twoWay","default":null,"dtype":"B","nullable":true}` |
| `delitem` | `{"binding":"read","default":null,"dtype":"B","nullable":true}` |
| `doc` | `{"binding":"read","default":"","dtype":"T"}` |

Child grammar: `*`; parent grammar: `None`.
