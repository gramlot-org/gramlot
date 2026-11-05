# Vizabi

Document ID: **GC-485**.

<a id="gc-485-start"></a>
## Start here

Host-provided Vizabi bubble integration; separate from chartPane engines.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-vizabi).

Supply a configuration Bag and the compatible external library URL. The host owns library delivery. This specialized integration is not a chartPane engine and is not enabled by the common gallery environment.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)


<a id="gc-485-005"></a>
<a id="gc-485-010"></a>

Ordinary Source/CSS attributes remain in Writing pages and Themes and CSS.
Pages inherit environment collections; Page.gramlots adds missing ones. Buttons are built in.
Contract JSON omits only undeclared keys: no default is not the same as null. dtype: T text, B Boolean, L integer, R real, X structured value; remaining codes are TYTX. binding: read = Data to widget, write = widget to Data, twoWay = both. nullable permits None; enum restricts values; annotation preserves type/regex constraints. Parameters sharing a table row have exactly the same contract. Child grammar: * allows arbitrary Source children; empty permits none. Parent None means no declared restriction.


<a id="gc-485-445"></a>
## Charts


<a id="gc-485-475"></a>
<a id="gc-485-vizabibubble"></a>
### `vizabiBubble`

Collection: vizabi. Specialized host-provided Vizabi bubble session observing Data Bags.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-vizabibubble).


**Data contract.** Reads the original rows and configuration Bag.


**Interaction and events.** Retains supported session configuration and releases engine resources on removal.


**Composition.** Specialized external bubble view.


**Limits and lifecycle.** Requires host-supplied libraryUrl; not a chartPane engine.


| Parameters | Contract |
| --- | --- |
| `storepath, libraryUrl` | `{"dtype":"T"}` |
| `rowMode` | `{"default":"attributes","dtype":"T"}` |
| `configuration` | `{"binding":"read","dtype":"X"}` |

Child grammar: `''`; parent grammar: `None`.
