# Menus and buttons

Document ID: **GC-415**.

<a id="gc-415-start"></a>
## Start here

One command hierarchy can appear as a popup or a toolbar. A toolbar is `menu(presentation="bar")`; its entries remain `menuline`, with ordinary Source children for embedded controls. A dropdown button is a different component.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-buttons).

This body assumes the environment has registered `documents:save` and `documents:close`. The entries inherit the registered captions/icons; commands publish to the configured target. A Save command does not itself persist Data. [Register commands and choose targets](350-menus-toolbars-and-windows.md).

The same guide covers resolver submenus, context/modifier opening, grouped overflow, priorities and icon-only presentation. Use `iconSrc` for SVG images; `icon` is text/emoji. The buttons collection is built into the base grammar.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)

## Separate commands, selected state and command presentation

Choose `button` for an application action, `toggleButton` when that action also has
a bound Boolean state, and `dropDownButton` for separate main-action and submenu
surfaces. Actions use Gramlot's existing action/Logic services. These components
do not implicitly submit an HTML form; use `html_button` for native submit/reset.
A toggle updates Data before its optional action; confirmation of that action does
not reverse the toggle. `readonly` and `disabled` prevent user toggling while
external Data continues to update its LED. See [button behavior](105-components.md#gc-105-095).

A dropdown's main surface runs its current command; its arrow opens choices.
Ordinary selection executes a command. Shift+selection executes it and installs
it as the new default, including through the keyboard. Each actionable entry needs
a unique `code`; `menuline("-")` declares a separator. With `persist=True`, provide
a stable explicit `id`: browser storage remembers the selected code for this page
URL/id, not application Data or command results. An absent saved code falls back
to the authored default. Changing the default on touch still requires Shift.

Use `menu` for the command hierarchy and `menuline` for commands, submenu parents,
separators or toolbar groups. `presentation="bar"` makes the first level a toolbar;
`orientation="vertical"` makes a rail. The same hierarchy can be authored separately
for a context popup and a toolbar. A normal context menu opens by right-click or
keyboard context action; `modifiers` declares click-based opening. Opening modifiers
are distinct from command activation modifiers. A named registry command inherits
its label/icon and publishes to its frame recipient; it does not itself save Data.
The message contains `sender`, `target`, `command`, resolved `parameters` and
activation `modifiers`. Mark exactly one central descendant `frameTarget=True`;
a nested frame has its own scope. Missing/ambiguous targets are rejected, rather
than dispatched to an implicit global action. See [command registration and routing](350-menus-toolbars-and-windows.md#gc-350-010).

Use `spacer(size=...)` for fixed separation or `spacer(flex=1)` for elastic space.
It has no command or Data write. A `menuline(group=True)` keeps embedded controls
and commands together. The visible prefix stays in declaration order; the
complete non-fitting suffix enters the vertical popup.
`icon` is text/emoji; use `iconSrc` for an SVG/image URL. `labelPosition` and
`iconSize` govern presentation independently of command identity. Bind `disabled`,
`checked` and ordinary visibility to Data as needed; `checked` on a menuline is
presentation, not an implicit toggle writer. Resolver menus require an application
endpoint and own their loading/cache contract. See [groups and overflow](350-menus-toolbars-and-windows.md#gc-350-025)
and [resolver submenus](350-menus-toolbars-and-windows.md#gc-350-030).

## Choose a component

- [`button`](#gc-415-button): An application action button using the existing action/Logic contract.
- [`toggleButton`](#gc-415-togglebutton): A command button with a bound Boolean selected state.
- [`dropDownButton`](#gc-415-dropdownbutton): Separate main-action and submenu surfaces; distinct from a menu bar.
- [`menu`](#gc-415-menu): A hierarchy presented as a popup or a permanent horizontal/vertical toolbar.
- [`menuline`](#gc-415-menuline): A command, separator, submenu parent or indivisible toolbar group.
- [`spacer`](#gc-415-spacer): Fixed or elastic space in a menu/toolbar; it does not publish a command.


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


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-button).


**Data contract.** A button has no editable value. Disabled state and icon presentation can read Data. A fire action pulses a Data path with the modifier string or true, attaches modifier and _counter metadata, and returns the value to null.


**Interaction and events.** Click or keyboard activation runs one command mechanism. Inline action receives _evt, _counter and modifier flags. A nested dataController receives _evt, button_counter and the modifier flags. A confirmation can gate execution, and _delay groups a burst from its last click.


**Composition.** Use caption content and optionally one direct dataController as the click mechanism. The controller keeps its own reactive Data inputs and initialization behavior.


**Limits and lifecycle.** Competing mechanisms or multiple direct dataControllers raise an error. Disabled or removed buttons drop pending clicks. A Gramlot button never implicitly submits its containing form.

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


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-togglebutton).


**Data contract.** Bind the boolean value two ways. Data updates the LED and pressed state. Activation commits the new boolean before invoking the command.


**Interaction and events.** Activation flips the boolean and dispatches the change used for binding, then runs the shared button command. Disabled and readonly prevent the flip and command.


**Composition.** Uses the same caption and direct controller composition as button. The LED is provided by the component.


**Limits and lifecycle.** The value represents two states. Removing the Source releases the button command binding.

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


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-dropdownbutton).


**Data contract.** The default command occurrence is local to the button. With persist enabled, local storage saves the occurrence code for the page URL and explicit button id. It does not store command text or a Data value.


**Interaction and events.** The main segment runs the default command. The arrow opens the menu. Ordinary item activation runs that item. Shift activation also makes it the main command and updates its caption and icon.


**Composition.** Author the main caption and command on the button and place the alternatives in its child menu.


**Limits and lifecycle.** Persistent buttons require an explicit id and menu occurrence codes must be unique. A missing saved code falls back to the authored default. Storage failure leaves in-memory selection usable.

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


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-menu).


**Data contract.** Menu presentation and resolver inputs can reflect Data. A resolver supplies entries through its named Logic method, with caching governed by cacheTime. The menu has no selected value of its own.


**Interaction and events.** A popup can open from its attached owner or a submenu trigger. Keyboard movement skips unavailable entries and separators. A bar distributes eligible units into overflow and returns them as space becomes available.


**Composition.** Use menuline for commands or submenus, spacer for spacing and contentPane for grouped or embedded content. A bar can be horizontal or vertical.


**Limits and lifecycle.** Opening modifiers match exactly. Popup resolver work can wait for the first opening. Invalid results preserve existing entries and superseded replies cannot replace newer results.

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


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-menuline).


**Data contract.** A menu occurrence can read disabled, hidden and checked presentation from Data. Checked is a display binding. Application Logic changes its underlying state.


**Interaction and events.** A line dispatches its command or opens its submenu. Command occurrences can carry distinct parameters. Delayed delivery captures the parameters at activation and is cancelled if the occurrence becomes unavailable.


**Composition.** Use a caption and optional icon, or give the line a child menu for a submenu. A separator or grouped presentation does not dispatch a command from its padding.


**Limits and lifecycle.** A command and submenu on the same occurrence are mutually exclusive. An unknown command does not dispatch, and nested frames keep their own command recipients.

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
| `parameters` | dict or None | — | — | annotation={"kind": "type", "module": "builtins", "name": "dict"} |
| `favorite` | B | False | — | — |

Child grammar: `*`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.

<a id="gc-415-135"></a>
<a id="gc-415-spacer"></a>
### `spacer`

Fixed or elastic space in a menu/toolbar; it does not publish a command.

Collection: **buttons**. Browser element: `gramlot-spacer`.

[Commands, hierarchy and toolbar layout](350-menus-toolbars-and-windows.md).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-spacer).


**Data contract.** size specifies fixed space in pixels. flex assigns a positive share of remaining layout space. Neither parameter represents application Data.


**Interaction and events.** The spacer is decorative and has no activation. A toolbar consumes elastic space before moving trailing units to its popup.


**Composition.** Place it between menu or toolbar items as a leaf.


**Limits and lifecycle.** size and flex are mutually exclusive. A fixed size must be finite and nonnegative. A flex factor must be finite and positive.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `size` | R or None | — | — | — |
| `flex` | R or None | — | — | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.
