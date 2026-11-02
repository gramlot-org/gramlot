# Menus and buttons

Document ID: **GC-415**.

<a id="gc-415-start"></a>
## Start here

One command hierarchy can appear as a popup or a toolbar. A toolbar is `menu(presentation="bar")`; its entries remain `menuline`, with ordinary Source children for embedded controls. A dropdown button is a different component.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). Example body for `main(self, root)`:

```python
bar = root.menu(presentation="bar")
bar.menuline("documents:save")
bar.spacer(flex=1)
bar.menuline("documents:close")
```

This body assumes the environment has registered `documents:save` and `documents:close`. The entries inherit the registered captions/icons; commands publish to the configured target. A Save command does not itself persist Data. [Register commands and choose targets](350-menus-toolbars-and-windows.md).

The same guide covers resolver submenus, context/modifier opening, grouped overflow, priorities and icon-only presentation. Use `iconSrc` for SVG images; `icon` is text/emoji. The buttons collection is built into the base grammar.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)


<a id="gc-415-005"></a>
<a id="gc-415-010"></a>
Types: T text, B Boolean, L integer, R real, X structured value; other codes are TYTX. Binding: read = Data to widget; write = widget to Data; twoWay = both. A dash means no declared default/binding. None is a declared value. Constraints include enum, qualification, target and annotations. Tables describe component contracts; ordinary Source/CSS attributes are shared.


## Shared parameter contracts

Each widget below links only the shared contracts it supports. A shared name can have different types, defaults or bindings; separate rows preserve those differences.


<a id="gc-415-220"></a>
<a id="gc-415-shared-value"></a>
## Values and bindings

The value type and writeback behavior depend on the control. Use a Data pointer for binding; see [Data binding](097-data-binding.md).

Applies to: [toggleButton](#gc-415-togglebutton).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `value` | B | False | twoWay | — | All listed above |

<a id="gc-415-225"></a>
<a id="gc-415-shared-state"></a>
## Disabled, readonly and live updates

Disabled prevents interaction; readonly preserves reading without accepting edits. live controls when edits reach Data. See [Field behavior](105-components.md#gc-105-040).

Applies to: [button](#gc-415-button), [toggleButton](#gc-415-togglebutton), [dropDownButton](#gc-415-dropdownbutton), [menuline](#gc-415-menuline).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `disabled` | B | False | read | — | All listed above |
| `readonly` | B | False | read | — | [toggleButton](#gc-415-togglebutton) |

<a id="gc-415-245"></a>
<a id="gc-415-shared-icons"></a>
## Icons and label presentation

icon holds text or an emoji; iconSrc loads an image such as SVG. iconSize sizes the icon; labelPosition controls label presentation on menus and toolbars. See [Menus and toolbars](350-menus-toolbars-and-windows.md).

Applies to: [button](#gc-415-button), [toggleButton](#gc-415-togglebutton), [dropDownButton](#gc-415-dropdownbutton), [menu](#gc-415-menu), [menuline](#gc-415-menuline).

| Parameter | Type | Default | Binding | Constraints | Applies to |
| --- | --- | --- | --- | --- | --- |
| `icon` | T | '' | read | — | [button](#gc-415-button), [toggleButton](#gc-415-togglebutton), [dropDownButton](#gc-415-dropdownbutton), [menuline](#gc-415-menuline) |
| `iconSrc` | T | '' | read | — | [button](#gc-415-button), [toggleButton](#gc-415-togglebutton), [dropDownButton](#gc-415-dropdownbutton), [menuline](#gc-415-menuline) |
| `labelPosition` | T | 'beside' | read | enum=['beside', 'below', 'tooltip'] | [menu](#gc-415-menu) |
| `iconSize` | R | 24 | read | — | [menu](#gc-415-menu) |
| `labelPosition` | T or None | — | read | enum=['beside', 'below', 'tooltip'] | [menuline](#gc-415-menuline) |
| `iconSize` | R or None | — | read | — | [menuline](#gc-415-menuline) |

<a id="gc-415-315"></a>
## Buttons, menus and toolbars


<a id="gc-415-110"></a>
<a id="gc-415-button"></a>
### `button`

An application action button using the existing action/Logic contract.

Collection: **buttons**. Browser element: `gramlot-button`.

[Commands, hierarchy and toolbar layout](350-menus-toolbars-and-windows.md).

Shared contracts: [Disabled, readonly and live updates](#gc-415-shared-state), [Icons and label presentation](#gc-415-shared-icons).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `action` | T or None | — | — | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-415-115"></a>
<a id="gc-415-togglebutton"></a>
### `toggleButton`

A command button with a bound Boolean selected state.

Collection: **buttons**. Browser element: `gramlot-toggle-button`.

[Commands, hierarchy and toolbar layout](350-menus-toolbars-and-windows.md).

Shared contracts: [Values and bindings](#gc-415-shared-value), [Disabled, readonly and live updates](#gc-415-shared-state), [Icons and label presentation](#gc-415-shared-icons).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `action` | T or None | — | — | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-415-120"></a>
<a id="gc-415-dropdownbutton"></a>
### `dropDownButton`

Separate main-action and submenu surfaces; distinct from a menu bar.

Collection: **buttons**. Browser element: `gramlot-drop-down-button`.

[Commands, hierarchy and toolbar layout](350-menus-toolbars-and-windows.md).

Shared contracts: [Disabled, readonly and live updates](#gc-415-shared-state), [Icons and label presentation](#gc-415-shared-icons).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `action` | T or None | — | — | — |
| `persist` | B | False | — | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-415-125"></a>
<a id="gc-415-menu"></a>
### `menu`

A hierarchy presented as a popup or a permanent horizontal/vertical toolbar.

Collection: **buttons**. Browser element: `gramlot-menu`.

[Commands, hierarchy and toolbar layout](350-menus-toolbars-and-windows.md).

Shared contracts: [Icons and label presentation](#gc-415-shared-icons).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `presentation` | T | 'popup' | — | enum=['popup', 'bar'] |
| `orientation` | T | 'horizontal' | — | enum=['horizontal', 'vertical'] |
| `modifiers` | T or None | — | — | — |
| `resolver` | T or None | — | — | — |
| `cacheTime` | R | -1 | — | — |
| `sync` | B | False | — | — |

Child grammar: `menuline,spacer,contentPane`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-415-130"></a>
<a id="gc-415-menuline"></a>
### `menuline`

A command, separator, submenu parent or indivisible toolbar group.

Collection: **buttons**. Browser element: `gramlot-menu-line`.

[Commands, hierarchy and toolbar layout](350-menus-toolbars-and-windows.md).

Shared contracts: [Disabled, readonly and live updates](#gc-415-shared-state), [Icons and label presentation](#gc-415-shared-icons).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `action` | T or None | — | — | — |
| `command` | T or None | — | — | — |
| `caption` | T or None | — | — | — |
| `code` | T or None | — | — | — |
| `checked` | B or None | — | read | — |
| `tooltip` | T or None | — | — | — |
| `group` | B | False | — | — |
| `priority` | R | 0 | — | — |
| `overflowable` | B | True | — | — |
| `parameters` | dict or None | — | — | annotation={"kind": "type", "module": "builtins", "name": "dict"} |
| `favorite` | B | False | — | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-415-135"></a>
<a id="gc-415-spacer"></a>
### `spacer`

Fixed or elastic space in a menu/toolbar; it does not publish a command.

Collection: **buttons**. Browser element: `gramlot-spacer`.

[Commands, hierarchy and toolbar layout](350-menus-toolbars-and-windows.md).

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `size` | R or None | — | — | — |
| `flex` | R or None | — | — | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.
