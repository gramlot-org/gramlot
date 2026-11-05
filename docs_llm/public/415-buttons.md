# Menus and buttons

Document ID: **GC-415**.

<a id="gc-415-start"></a>
## Start here

One command hierarchy can appear as a popup or a toolbar. A toolbar is `menu(presentation="bar")`; its entries remain `menuline`, with ordinary Source children for embedded controls. A dropdown button is a different component.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-buttons).

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


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-button).


**Data contract.** A button has no editable value. Disabled state and icon presentation can read Data. A fire action pulses a Data path with the modifier string or true, attaches modifier and _counter metadata, and returns the value to null.


**Interaction and events.** Click or keyboard activation runs one command mechanism. Inline action receives _evt, _counter and modifier flags. A nested dataController receives _evt, button_counter and the modifier flags. A confirmation can gate execution, and _delay groups a burst from its last click.


**Composition.** Use caption content and optionally one direct dataController as the click mechanism. The controller keeps its own reactive Data inputs and initialization behavior.


**Limits and lifecycle.** Competing mechanisms or multiple direct dataControllers raise an error. Disabled or removed buttons drop pending clicks. A Gramlot button never implicitly submits its containing form.

Shared contracts: [Disabled, readonly and live updates](#gc-415-shared-state), [Icons and label presentation](#gc-415-shared-icons).


| Parameters | Contract |
| --- | --- |
| `action` | `{"dtype":"T","nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-415-115"></a>
<a id="gc-415-togglebutton"></a>
### `toggleButton`

Collection: buttons. A command button with a bound Boolean selected state.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-togglebutton).


**Data contract.** Bind the boolean value two ways. Data updates the LED and pressed state. Activation commits the new boolean before invoking the command.


**Interaction and events.** Activation flips the boolean and dispatches the change used for binding, then runs the shared button command. Disabled and readonly prevent the flip and command.


**Composition.** Uses the same caption and direct controller composition as button. The LED is provided by the component.


**Limits and lifecycle.** The value represents two states. Removing the Source releases the button command binding.

Shared contracts: [Values and bindings](#gc-415-shared-value), [Disabled, readonly and live updates](#gc-415-shared-state), [Icons and label presentation](#gc-415-shared-icons).


| Parameters | Contract |
| --- | --- |
| `action` | `{"dtype":"T","nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-415-120"></a>
<a id="gc-415-dropdownbutton"></a>
### `dropDownButton`

Collection: buttons. Separate main-action and submenu surfaces; distinct from a menu bar.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-dropdownbutton).


**Data contract.** The default command occurrence is local to the button. With persist enabled, local storage saves the occurrence code for the page URL and explicit button id. It does not store command text or a Data value.


**Interaction and events.** The main segment runs the default command. The arrow opens the menu. Ordinary item activation runs that item. Shift activation also makes it the main command and updates its caption and icon.


**Composition.** Author the main caption and command on the button and place the alternatives in its child menu.


**Limits and lifecycle.** Persistent buttons require an explicit id and menu occurrence codes must be unique. A missing saved code falls back to the authored default. Storage failure leaves in-memory selection usable.

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


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-menu).


**Data contract.** Menu presentation and resolver inputs can reflect Data. A resolver supplies entries through its named Logic method, with caching governed by cacheTime. The menu has no selected value of its own.


**Interaction and events.** A popup can open from its attached owner or a submenu trigger. Keyboard movement skips unavailable entries and separators. A bar distributes eligible units into overflow and returns them as space becomes available.


**Composition.** Use menuline for commands or submenus, spacer for spacing and contentPane for grouped or embedded content. A bar can be horizontal or vertical.


**Limits and lifecycle.** Opening modifiers match exactly. Popup resolver work can wait for the first opening. Invalid results preserve existing entries and superseded replies cannot replace newer results.

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


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-menuline).


**Data contract.** A menu occurrence can read disabled, hidden and checked presentation from Data. Checked is a display binding. Application Logic changes its underlying state.


**Interaction and events.** A line dispatches its command or opens its submenu. Command occurrences can carry distinct parameters. Delayed delivery captures the parameters at activation and is cancelled if the occurrence becomes unavailable.


**Composition.** Use a caption and optional icon, or give the line a child menu for a submenu. A separator or grouped presentation does not dispatch a command from its padding.


**Limits and lifecycle.** A command and submenu on the same occurrence are mutually exclusive. An unknown command does not dispatch, and nested frames keep their own command recipients.

Shared contracts: [Disabled, readonly and live updates](#gc-415-shared-state), [Icons and label presentation](#gc-415-shared-icons).


| Parameters | Contract |
| --- | --- |
| `action, command, caption, code, tooltip` | `{"dtype":"T","nullable":true}` |
| `checked` | `{"binding":"read","dtype":"B","nullable":true}` |
| `group, favorite` | `{"default":false,"dtype":"B"}` |
| `parameters` | `{"annotation":{"kind":"type","module":"builtins","name":"dict"},"nullable":true}` |

Child grammar: `*`; parent grammar: `None`.

<a id="gc-415-135"></a>
<a id="gc-415-spacer"></a>
### `spacer`

Collection: buttons. Fixed or elastic space in a menu/toolbar; it does not publish a command.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-spacer).


**Data contract.** size specifies fixed space in pixels. flex assigns a positive share of remaining layout space. Neither parameter represents application Data.


**Interaction and events.** The spacer is decorative and has no activation. A toolbar consumes elastic space before moving trailing units to its popup.


**Composition.** Place it between menu or toolbar items as a leaf.


**Limits and lifecycle.** size and flex are mutually exclusive. A fixed size must be finite and nonnegative. A flex factor must be finite and positive.


| Parameters | Contract |
| --- | --- |
| `size, flex` | `{"dtype":"R","nullable":true}` |

Child grammar: `''`; parent grammar: `None`.
