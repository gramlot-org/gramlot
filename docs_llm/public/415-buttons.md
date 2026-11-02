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

Ordinary Source/CSS attributes remain in Writing pages and Themes and CSS.
Pages inherit environment collections; Page.gramlots adds missing ones. Buttons are built in.
Contract JSON omits only undeclared keys: no default is not the same as null. dtype: T text, B Boolean, L integer, R real, X structured value; remaining codes are TYTX. binding: read = Data to widget, write = widget to Data, twoWay = both. nullable permits None; enum restricts values; annotation preserves type/regex constraints. Parameters sharing a table row have exactly the same contract. Child grammar: * allows arbitrary Source children; empty permits none. Parent None means no declared restriction.


<a id="gc-415-220"></a>
<a id="gc-415-shared-value"></a>
## Values and bindings

The value type and writeback behavior depend on the control. Use a Data pointer for binding; see [Data binding](097-data-binding.md).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `value` | `{"binding":"twoWay","default":false,"dtype":"B"}` | toggleButton |

<a id="gc-415-225"></a>
<a id="gc-415-shared-state"></a>
## Disabled, readonly and live updates

Disabled prevents interaction; readonly preserves reading without accepting edits. live controls when edits reach Data. See [Field behavior](105-components.md#gc-105-040).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `disabled` | `{"binding":"read","default":false,"dtype":"B"}` | button, toggleButton, dropDownButton, menuline |
| `readonly` | `{"binding":"read","default":false,"dtype":"B"}` | toggleButton |

<a id="gc-415-245"></a>
<a id="gc-415-shared-icons"></a>
## Icons and label presentation

icon holds text or an emoji; iconSrc loads an image such as SVG. iconSize sizes the icon; labelPosition controls label presentation on menus and toolbars. See [Menus and toolbars](350-menus-toolbars-and-windows.md).

| Parameters | Contract | Applies to |
| --- | --- | --- |
| `icon, iconSrc` | `{"binding":"read","default":"","dtype":"T"}` | button, toggleButton, dropDownButton, menuline |
| `labelPosition` | `{"binding":"read","default":"beside","dtype":"T","enum":["beside","below","tooltip"]}` | menu |
| `iconSize` | `{"binding":"read","default":24,"dtype":"R"}` | menu |
| `labelPosition` | `{"binding":"read","dtype":"T","enum":["beside","below","tooltip"],"nullable":true}` | menuline |
| `iconSize` | `{"binding":"read","dtype":"R","nullable":true}` | menuline |

<a id="gc-415-315"></a>
## Buttons, menus and toolbars


<a id="gc-415-110"></a>
<a id="gc-415-button"></a>
### `button`

Collection: buttons. An application action button using the existing action/Logic contract.

Shared contracts: [Disabled, readonly and live updates](#gc-415-shared-state), [Icons and label presentation](#gc-415-shared-icons).


| Parameters | Contract |
| --- | --- |
| `action` | `{"dtype":"T","nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-415-115"></a>
<a id="gc-415-togglebutton"></a>
### `toggleButton`

Collection: buttons. A command button with a bound Boolean selected state.

Shared contracts: [Values and bindings](#gc-415-shared-value), [Disabled, readonly and live updates](#gc-415-shared-state), [Icons and label presentation](#gc-415-shared-icons).


| Parameters | Contract |
| --- | --- |
| `action` | `{"dtype":"T","nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-415-120"></a>
<a id="gc-415-dropdownbutton"></a>
### `dropDownButton`

Collection: buttons. Separate main-action and submenu surfaces; distinct from a menu bar.

Shared contracts: [Disabled, readonly and live updates](#gc-415-shared-state), [Icons and label presentation](#gc-415-shared-icons).


| Parameters | Contract |
| --- | --- |
| `action` | `{"dtype":"T","nullable":true}` |
| `persist` | `{"default":false,"dtype":"B"}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-415-125"></a>
<a id="gc-415-menu"></a>
### `menu`

Collection: buttons. A hierarchy presented as a popup or a permanent horizontal/vertical toolbar.

Shared contracts: [Icons and label presentation](#gc-415-shared-icons).


| Parameters | Contract |
| --- | --- |
| `presentation` | `{"default":"popup","dtype":"T","enum":["popup","bar"]}` |
| `orientation` | `{"default":"horizontal","dtype":"T","enum":["horizontal","vertical"]}` |
| `modifiers, resolver` | `{"dtype":"T","nullable":true}` |
| `cacheTime` | `{"default":-1,"dtype":"R"}` |
| `sync` | `{"default":false,"dtype":"B"}` |

Child grammar: `menuline,spacer,contentPane`; parent grammar: `None`.

<a id="gc-415-130"></a>
<a id="gc-415-menuline"></a>
### `menuline`

Collection: buttons. A command, separator, submenu parent or indivisible toolbar group.

Shared contracts: [Disabled, readonly and live updates](#gc-415-shared-state), [Icons and label presentation](#gc-415-shared-icons).


| Parameters | Contract |
| --- | --- |
| `action, command, caption, code, tooltip` | `{"dtype":"T","nullable":true}` |
| `checked` | `{"binding":"read","dtype":"B","nullable":true}` |
| `group, favorite` | `{"default":false,"dtype":"B"}` |
| `priority` | `{"default":0,"dtype":"R"}` |
| `overflowable` | `{"default":true,"dtype":"B"}` |
| `parameters` | `{"annotation":{"kind":"type","module":"builtins","name":"dict"},"nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-415-135"></a>
<a id="gc-415-spacer"></a>
### `spacer`

Collection: buttons. Fixed or elastic space in a menu/toolbar; it does not publish a command.


| Parameters | Contract |
| --- | --- |
| `size, flex` | `{"dtype":"R","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.
