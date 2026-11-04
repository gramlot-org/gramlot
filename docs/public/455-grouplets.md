# Grouplets

Document ID: **GC-455**.

<a id="gc-455-start"></a>
## Start here

Reuse a Source-building method as a fragment. A grouplet provides the content host; groupletCard adds a title, folding and optional bound controls. Relative datapaths make the same fragment reusable with different Data.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-grouplets).

Define the Source endpoint on the same Page (the inputs collection supplies textbox):

[See the setup code in the appendix](465-widget-examples.md#gc-465-setup-grouplets).

The remote binding owns requests, children and cleanup. Do not add a second request from component DOM lifecycle hooks. [Remote Source contract](099-remote-content.md).

`collapsed` and `checkbox` support writeback. `checkbox=None` hides the control; `False` displays it unchecked. `delitem=None` hides Clear, `False` disables it, `True` enables it. The optional `doc` is bound Markdown for the in-card guide; empty text hides its information button. `chromeSide` only accepts top/left/right. Card folding, remote fragments and a full form/save lifecycle are distinct responsibilities; do not infer legacy GroupletForm APIs from this card.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)

## Choose a plain fragment host or a card

`grouplet` hosts reusable Source content through the existing remote binding. Use it when the parent layout supplies all visual framing. `groupletCard` adds a title, optional folding, a checkbox, actions and an in-card Markdown guide. Both accept ordinary Source children and a read-bound `remote` endpoint name. A relative `datapath` lets the same Source-building method bind different records without duplicating its implementation.

[Code for this composition is in the appendix](465-widget-examples.md#gc-465-setup-grouplets).

Implement `address` as a Page method decorated with `@source`; inside it, controls such as `pane.textbox(value="^.city")` resolve against that instance's Data scope. Include the collections used by those controls. The existing [remote Source mechanism](099-remote-content.md) owns requests, replacing children and cleanup. Do not add parallel requests in DOM lifecycle hooks. Neither fragment host establishes database loading or a save operation.

### Card state and user actions

`title` and `checkboxLabel` are read-bound internationalizable text. `chromeSide` accepts only `top`, `left` or `right`. `collapsible` enables folding; `collapsed` reads and writes the folded state, so bind it when the application needs that state in Data. `checkbox=None` hides the checkbox, whereas `checkbox=False` displays an unchecked control. Its two-way binding writes user changes. These states do not themselves define record acceptance or persistence.

`delitem=None` hides Clear, `False` shows it disabled and `True` enables it. Clear asks for confirmation and works through Source/Data bindings. It clears direct, untransformed reactive `value` pointers within the card's Data scope, preserving bound card checkbox/collapse state; it does not scrape DOM fields, remove the remote fragment or delete an application record. Do not rely on it as a general reset of unrelated Data or an undoable form operation.

`doc` reads Markdown for the card's information popup; empty text hides the information button. User changes to folding and checkbox state use their declared writeback, while `remote`, `title`, `chromeSide`, `collapsible`, `delitem` and `doc` remain read inputs. There is no additional public completion or save callback declared for these widgets. Use ordinary Source controllers for application behavior that follows bound Data changes. The [card guide](455-grouplets.md#gc-455-start) describes these controls; full form/save lifecycles and legacy GroupletForm APIs are separate responsibilities and must not be inferred from a card.

## Choose a component

- [`grouplet`](#gc-455-grouplet): Reusable Source fragment loaded through the existing remote binding.
- [`groupletCard`](#gc-455-groupletcard): A titled, foldable remote-content card with bound controls and an optional Markdown guide.


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


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-grouplet).


**Data contract.** The read-bound remote name selects a reusable Source endpoint. datapath gives each instance a scope for relative child bindings. Shared remote binding governs readiness and caching.


**Interaction and events.** Remote loading and replacement use ordinary Source lifecycle. Removal cancels pending work and suppresses late results. It declares no additional completion or save callback.


**Composition.** Accepts ordinary authored Source children and remote fragments, including nested fragments. Activate collections used by the children.


**Limits and lifecycle.** Uses the standard remote Source endpoint contract. Record loading, editing policy and persistence belong to the composed application.

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


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-groupletcard).


**Data contract.** Bind collapsed and checkbox two ways to retain changes in Data. Null checkbox hides it and false shows it unchecked. Title, label, header side, collapsible, delitem and doc are read inputs. Body bindings use the card's instance scope.


**Interaction and events.** Header controls fold and toggle the checkbox. An authored menu can supply actions. Clear asks for confirmation and rechecks its gate before clearing eligible values. The information button opens the Markdown guide. It declares no additional save or completion callback.


**Composition.** Accepts authored or remote Source body children, including nested cards. An authored menu supplies header actions.


**Limits and lifecycle.** Header side accepts top, left or right. Null delitem hides Clear, false disables it and true enables it. Clear affects direct untransformed reactive body value bindings within scope, preserving header state. Body replacement or removal invalidates pending confirmation.

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
