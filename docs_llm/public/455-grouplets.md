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


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-grouplet).


**Data contract.** The read-bound remote name selects a reusable Source endpoint. datapath gives each instance a scope for relative child bindings. Shared remote binding governs readiness and caching.


**Interaction and events.** Remote loading and replacement use ordinary Source lifecycle. Removal cancels pending work and suppresses late results. It declares no additional completion or save callback.


**Composition.** Accepts ordinary authored Source children and remote fragments, including nested fragments. Activate collections used by the children.


**Limits and lifecycle.** Uses the standard remote Source endpoint contract. Record loading, editing policy and persistence belong to the composed application.


| Parameters | Contract |
| --- | --- |
| `remote` | `{"binding":"read","dtype":"T","nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-455-385"></a>
<a id="gc-455-groupletcard"></a>
### `groupletCard`

Collection: grouplets. A titled, foldable remote-content card with bound controls and an optional Markdown guide.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-groupletcard).


**Data contract.** Bind collapsed and checkbox two ways to retain changes in Data. Null checkbox hides it and false shows it unchecked. Title, label, header side, collapsible, delitem and doc are read inputs. Body bindings use the card's instance scope.


**Interaction and events.** Header controls fold and toggle the checkbox. An authored menu can supply actions. Clear asks for confirmation and rechecks its gate before clearing eligible values. The information button opens the Markdown guide. It declares no additional save or completion callback.


**Composition.** Accepts authored or remote Source body children, including nested cards. An authored menu supplies header actions.


**Limits and lifecycle.** Header side accepts top, left or right. Null delitem hides Clear, false disables it and true enables it. Clear affects direct untransformed reactive body value bindings within scope, preserving header state. Body replacement or removal invalidates pending confirmation.


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
