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
Types: T text, B Boolean, L integer, R real, X structured value; other codes are TYTX. Binding: read = Data to widget; write = widget to Data; twoWay = both. A dash means no declared default/binding. None is a declared value. Constraints include enum, qualification, target and annotations. Tables describe component contracts; ordinary Source/CSS attributes are shared.


## Shared parameter contracts

Each widget below links only the shared contracts it supports. A shared name can have different types, defaults or bindings; separate rows preserve those differences.


<a id="gc-455-440"></a>
## Reusable fragments


<a id="gc-455-380"></a>
<a id="gc-455-grouplet"></a>
### `grouplet`

Reusable Source fragment loaded through the existing remote binding.

Collection: **grouplets**. Browser element: `gramlot-grouplet`.

[Reusable remote fragments and cards](455-grouplets.md#gc-455-start).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `remote` | T or None | — | read | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-455-385"></a>
<a id="gc-455-groupletcard"></a>
### `groupletCard`

A titled, foldable remote-content card with bound controls and an optional Markdown guide.

Collection: **grouplets**. Browser element: `gramlot-grouplet-card`.

[Reusable remote fragments and cards](455-grouplets.md#gc-455-start).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `remote` | T or None | — | read | — |
| `title` | T | '' | read | qualification="intl_str" |
| `chromeSide` | T | 'top' | read | enum=['top', 'left', 'right'] |
| `collapsible` | B | False | read | — |
| `collapsed` | B | False | twoWay | — |
| `checkbox` | B or None | None | twoWay | — |
| `checkboxLabel` | T | '' | read | qualification="intl_str" |
| `delitem` | B or None | None | read | — |
| `doc` | T | '' | read | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.
