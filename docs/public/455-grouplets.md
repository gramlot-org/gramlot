# Grouplets

Document ID: **GC-455**.

A grouplet is a piece of page built once, on the server, and placed wherever you
need it, each time on different Data. This page answers **how do I reuse the same
block of fields in several places, plain or inside a foldable card?** The
parameters are in the [widget reference](345-widget-reference.md).

<a id="gc-455-start"></a>

## One fragment, two places

```python
from gramlot import source

@source
def address(self, pane):
    pane.textbox(value="^.city", lbl="City")
    pane.textbox(value="^.street", lbl="Street")
```

```python
def main(self, root):
    for key in ("billing", "shipping"):
        root.div(datapath=key).groupletCard(title=key.title(), remote="address",
                                            collapsible=True)
```

`address` is a method of the page. Each card asks the server for it and shows the
fields it builds. The paths start with a dot, so the billing card writes
`billing.city` and the shipping card `shipping.city`: one method, two independent
copies. The page base of your environment already enables this collection; if it
does not, [enable it once](340-components-and-collections-guide.md#gc-340-050).

<a id="gc-455-005"></a>
<a id="gc-455-010"></a>

## Pick a component

| You want | Use |
| --- | --- |
| The fragment alone, framed by the surrounding layout | [grouplet](#gc-455-grouplet) |
| The fragment in a card with title, folding, checkbox and actions | [groupletCard](#gc-455-groupletcard) |

<a id="gc-455-440"></a>
<a id="gc-455-380"></a>
<a id="gc-455-grouplet"></a>

## A plain fragment

```python
pane = root.div(datapath="customer.address")
pane.grouplet(remote="address")
```

[grouplet](345-widget-reference.md#gc-345-grouplet) has one parameter, `remote`, the
name of the `@source` method that builds its content. It accepts ordinary Source
children too, shown until the fragment arrives, and a fragment can hold grouplets of
its own.

Loading follows the rules of every `remote` element: the request starts when the
element appears and again when a `^` pointer in `remote` changes, and removing the
element cancels it. See [remote content](099-remote-content.md#gc-095-105). Loading
and saving records stays with your application: the grouplet only shows fields.

<a id="gc-455-385"></a>
<a id="gc-455-groupletcard"></a>

## A card around the fragment

```python
pane = root.div(datapath="order.shipping")
pane.groupletCard(remote="address", title="Shipping", collapsible=True,
                  collapsed="^.folded", checkbox="^.enabled",
                  checkboxLabel="Ship to a different address", delitem=True,
                  doc="Fill in **only** if the goods go elsewhere.")
```

[groupletCard](345-widget-reference.md#gc-345-groupletcard) adds a header to the
fragment:

- **Title and side.** `title` is the header text; `chromeSide` puts the header at
  the `top` (the default), `left` or `right`.
- **Folding.** `collapsible=True` adds the fold button. `collapsed` holds the state;
  bind it to keep it in Data.
- **Checkbox.** `checkbox` shows a checkbox in the header and writes its state back.
  With `None` (the default) there is no checkbox; with `False` it is shown unticked.
  `checkboxLabel` is its text.
- **Clear.** `delitem=True` adds a Clear action to the header menu; `False` shows it
  disabled, `None` hides it. After asking for confirmation, Clear empties the fields
  of the card that are bound with a plain `^` path. It does not touch the header
  state, other Data or any stored record.
- **Guide.** `doc` is Markdown shown in a popup from an information button; empty
  text hides the button.

For actions of your own, give the card one popup menu as a child: it becomes the
header's actions menu ([menus](350-menus-toolbars-and-windows.md#gc-350-015)). The
card has no save or completion event; to react to its state, bind it to Data and use
ordinary controllers.
