# Vizabi

Document ID: **GC-485**.

<a id="gc-485-start"></a>
## Start here

Host-provided Vizabi bubble integration; separate from chartPane engines.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-vizabi).

Supply a configuration Bag and the compatible external library URL. The host owns library delivery. This specialized integration is not a chartPane engine and is not enabled by the common gallery environment.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)

### Specialized host integration

The host provides the compatible library at libraryUrl and the configuration Bag. A session observes
rows and writes supported configuration changes into Data. It releases subscriptions and the external
view on removal. Do not treat this as an additional chartPane engine or infer database access.

## Choose a component

- [`vizabiBubble`](#gc-485-vizabibubble): Specialized host-provided Vizabi bubble session observing Data Bags.


<a id="gc-485-005"></a>
<a id="gc-485-010"></a>
Types: T text, B Boolean, L integer, R real, X structured value; other codes are TYTX. Binding: read = Data to widget; write = widget to Data; twoWay = both. A dash means no declared default/binding. None is a declared value. Constraints include enum, qualification, target and annotations. Tables describe component contracts; ordinary Source/CSS attributes are shared.


## Shared parameter contracts

Each widget below links only the shared contracts it supports. A shared name can have different types, defaults or bindings; separate rows preserve those differences.


<a id="gc-485-445"></a>
## Charts


<a id="gc-485-475"></a>
<a id="gc-485-vizabibubble"></a>
### `vizabiBubble`

Specialized host-provided Vizabi bubble session observing Data Bags.

Collection: **vizabi**. Browser element: `gramlot-vizabi-bubble`.

[Host-provided bubble charts](485-vizabi.md#gc-485-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-vizabibubble).


**Data contract.** Reads the original rows and configuration Bag.


**Interaction and events.** Retains supported session configuration and releases engine resources on removal.


**Composition.** Specialized external bubble view.


**Limits and lifecycle.** Requires host-supplied libraryUrl; not a chartPane engine.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `storepath` | T | — | — | — |
| `rowMode` | T | 'attributes' | — | — |
| `configuration` | X | — | read | — |
| `libraryUrl` | T | — | — | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.
