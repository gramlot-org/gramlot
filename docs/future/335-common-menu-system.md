# 335 · Common menu system

> **Provisional baseline (owner clarification, 2026-10-23):** all menu/slotbar
> choices below remain subject to hands-on evaluation and revision. Confirmation
> selects the current direction; it does not mean final acceptance or a stable API.
> See [§125](#gc-335-125), which also records the pointer-interaction baseline.

> **Current contract (2026-10-22):** §080's five-field command message is confirmed.
> §090 confirms resolver loading/invalidation and updates infrastructure status.
> §095 confirms loading, empty and error/retry presentation.
> §100 confirms disabled placeholders and diagnostics for unknown commands.
> §105 confirms parameter bindings and capture before confirmation/delay.
> §110 confirms cancellation of pending activation on entry/recipient invalidation.
> §115 confirms focus eligibility and relocation when an active entry becomes unavailable.
> §120 confirms the keyboard map and submenu navigation.
> §085 consolidates the other remaining decisions. Earlier proposal wording is historical
> where superseded by the explicit decisions in §§055–080. Runtime is pending.

> **Schema confirmed:** the owner accepts the result Bag in [§075](#gc-335-075),
> with live Data bindings for checked, disabled and hidden, or literal booleans.
> Menu projection and checked rendering remain to implement.

> **Direct resolver update:** §065 now uses a resolver owned by the menu,
> with no dataRemote or extra Data scope. [§070](#gc-335-070) records verified
> reuse of RpcResolver and the menu integration still to implement.

> **Current direction:** menu/menuline vocabulary selected; registered-key
> shorthand under review. Resolver-at-opening content is a primary use case,
> superseding the earlier late-phase recommendation. See [§060](#gc-335-060).

> **Owner confirmation, 2026-10-22:** common architecture and slotBar as its
> permanent presentation accepted. Exact API details remain proposed. See
> [§055](#gc-335-055); earlier pending wording on that relationship is superseded.

Document ID: **GC-335**. Date: **2026-10-22**.
Status: **complete architectural proposal for owner review; not implemented**.
[Concise view](../../docs_llm/future/335-common-menu-system.md).
[Legacy inventory](330-menus-and-commands.md).
[Extension packaging](325-how-to-extend-gramlot.md).
[Frame/window design](320-frames-bars-and-windows.md).

Owner scope: "ok allora progettiamo un sistema comune per menu che mantenga tutta
la potenza del legacy, ma con una realizzazione più pulita. poi a partire da quel
vediamo se riusciamo a dire che una slotbar è di fatto un menu aperto".
This approves designing the full system and evaluating the relationship, not every
API below or implementation. The earlier Source-based flex bar choice remains.

<a id="gc-335-005"></a>
## 005 · Proposed architecture

One Source hierarchy describes menu entries. Shared component capabilities handle
presentation state, entry identity and invocation; the existing ButtonBinding
remains the execution engine. There is no independent menu AST, global current
context or second bus.

| Responsibility | Proposed owner |
| --- | --- |
| Reusable command defaults | JS-owned definitions supplied by the page's gramlots |
| Authored hierarchy and instance identity | SourceBag/SourceBagNode |
| Application values and checked/selection state | Data Bags and ordinary bindings |
| Data-derived entries | A bounded menu content projection owning one generated Source branch |
| Opening context and popup chain | A menu interaction owner, scoped to this mounted menu |
| Entry invocation | Shared command binding plus the agreed selection/state operation |
| Popup placement | Existing geometry service, extended for point anchors/submenu sides |
| Persistent presentation | Flex layout with normal Source children |
| Keyboard/accessible roles | Presentation-specific interaction in the shared family |

Internal names in this table describe responsibilities, not approved new classes.
Implementation must use public Source/Bag contracts. Missing dependency primitives
are reported to the owning library, not emulated through consumer fallbacks.

<a id="gc-335-010"></a>
## 010 · Entries and identity

Keep existing menu/menuline authoring and stable item code. A namespaced registry
reference is distinct from local identity: two occurrences of invoices:save can
have different codes, bindings and senders. Source nodeId retains its existing
meaning; item code is not a replacement for nodeId.

Proposed entry kinds:

| Kind | Behavior |
| --- | --- |
| Command | Invoke one mechanism |
| Submenu | Open a child menu; does not also invoke a command |
| Checked command | Display a check; optionally perform an explicitly declared toggle |
| Exclusive choice | Display selection from a shared bound value and write this item's choice |
| Separator | Visual group boundary, never executable |
| Spacer | Fixed or elastic layout space, never focusable/executable |
| Content | Ordinary Source controls, preserving their own interaction |

These are shared semantic kinds, not a decision to add seven new public tags.
The existing menuline("-") separator remains part of the current contract.
An unnamed slotButton as spacer is still a syntax proposal, not a new accepted
fallback. Rich content remains supported in the design; it is not misclassified
as an executable item.

Reusable definitions are immutable defaults, not shared live widget instances.
Rendering the same command in two places creates two Source instances; their
Data bindings may deliberately share state.

<a id="gc-335-015"></a>
## 015 · State, selection and binding

disabled, visibility, label, icon and tooltip are ordinary instance presentation
state, with declared parameter bindings. Effective disabled includes a disabled
ancestor/owner and must be rechecked at execution. Hidden entries are omitted from
interaction without destroying application Data.

Separate three checked uses:
- A read-only check indicator reflects an expression/Data state.
- A toggle explicitly writes a bound boolean.
- An exclusive group writes one bound value; checked is derived by comparing it
  with each item's declared choice. Do not maintain an extra currentChecked state.

The proposed API must distinguish indicator and mutation intent. Merely declaring
checked does not silently write data. Favorite/star remains an independent visual
marker rather than competing for the icon or boolean selection.

Selection menus can write an item code and an explicit attribute-to-Data mapping,
covering legacy selected and selected_* capabilities. Proposal: declare the output
paths on the menu and resolve them against its declared data context, rather than
merging implicit inherited/context-target dictionaries. A selection operation can
be followed by one declared command; the writes are part of that operation,
not a second click executor. Missing mapped attributes produce an explicit
configuration diagnostic, not guessed fallback values.

MenuDiv's value/caption display follows the same bound selection state, including
external Data changes. TextboxMenu appending is a dedicated declared selection
operation/Logic method, not a special DOM write in the trigger.

<a id="gc-335-020"></a>
## 020 · Invocation, modifiers and context

Each opening captures a scoped context: opener, original target, optional
context item/path, intended recipient, event/modifiers and the opening generation.
Names and wire representation remain proposed. DOM events and live node references
stay local; RPC receives explicit serializable application arguments only.

For a frame command the recipient is the designated frame content. A tree row or
field that opened the menu is context, not automatically that recipient. Context
for a persistent bar is established at activation from its declared owner.

Proposed activation sequence for new general-menu behaviors:
1. Resolve the current entry and explicit recipient; reject hidden/disabled,
   removed or invalidated instances.
2. Submenu entries only open their child. Separators/spacers do nothing.
3. Capture invocation context, then use existing ask/delay/provider infrastructure.
4. Recheck validity and enabled state before committing a selection/toggle and
   dispatching exactly one mechanism.
5. Apply the presentation's closing rule. Command failure is reported; it does
   not automatically undo application Data or reopen a popup.

This new pre-dispatch state-commit hook is a proposed engine extension. Existing
toggleButton preparation and dropdown selection currently happen before execution;
their approved timing must not silently change. Unifying that timing, if desired,
requires a separate explicit migration decision and regressions.

Registered commands publish through the shared scoped subscription mechanism;
authored action/fire/controller/RPC retain the existing single-mechanism rule.
A registered publish command plus a second instance action is an error, not
implicit overriding or sequential double execution.

Modifier predicates govern opening or command parameters. They do not determine
a recipient by guessing. Keyboard/context-key invocation also creates a full
context even without a pointer event. Never reuse global last-target state.

<a id="gc-335-025"></a>
## 025 · Authored, Bag and lazy content

The rendering input is always Source. Each menu branch has exactly one content
owner: authored Source or a declared data projection. Do not combine manual child
edits and automatic regeneration on the same branch.

For data-backed branches, proposal:
- storepath identifies a Bag using the existing store capability and lifecycle.
- Bag node labels supply stable sibling item keys. A documented record schema
  contains kind, caption, command reference and typed presentation data.
- Nested Bag values define submenu content; resolver-backed values define lazy
  submenu content. Schema and allowed fields must be confirmed before coding.
- The projector creates/updates/removes only its owned menu Source children through
  ordinary Source APIs. Bag is authoritative for those records; generated Source
  is a derived view. Mutating generated entries directly is unsupported.
- Stable keys preserve surviving Source nodes, active focus and pending context;
  removal invalidates invocations. A full teardown on every change is not the
  proposed behavior.
- Data does not supply executable action strings, arbitrary Source tags or
  event handlers. Commands resolve registered definitions; custom UI comes from
  authored Source. Existing authored Logic/providers remain available.
- Projection is disposed with its owner; detached async results cannot mount.

Source-authored parents can include a submenu whose own branch is data-backed.
This preserves mixed static/dynamic menus without two authorities in one branch.
Existing legacy values convenience can be covered by an authoring helper producing
the same canonical Bag; exact helper syntax is open, not multiple runtime coercions.

Opening a lazy branch uses the resolver's own cache/expiry contract. Show loading,
error/retry and empty states explicitly; no second TTL cache. Late responses must
match the current opening generation, live owner and context. Shared context-
dependent resolvers must be keyed by that context or scoped per invocation.
Do not invent a new resolver protocol if the owning library cannot support this.

Bag projection is a proposed bounded capability, not already supplied by tree.
The earlier rejection of a store-rendered slotBar remains: bars keep Source
children even if a later approved content projector supplies a branch.

<a id="gc-335-030"></a>
## 030 · Opening, attachment and lifecycle

A menu has explicit invocation/attachment policy:
- popup from a menu trigger;
- submenu from one parent entry;
- context popup attached to an explicit Source target;
- persistent visible presentation.

The public attachment method and parameters remain open. Legacy modifiers,
validclass and connectedMenu are capabilities to preserve through explicit trigger
filters and Source references, not mandatory aliases or ambient DOM lookup.

An opening hook may prepare context or await content; a per-item hook may compute
presentation overrides. Proposal: hooks return documented results instead of
mutating arbitrary widgets. Merge order: registry defaults, authored parameters/
bindings, then explicitly returned opening overrides; disabled owner state always
wins. Hook result schemas are not yet approved.

Only one opening per menu instance is active. A new opening invalidates pending
results from the previous one. Separate menu instances have separate contexts.
A popup chain knows its parent/opener; dismissal releases the affected chain and
returns focus to a surviving opener where appropriate. Persisted bars stay mounted.

Removing the owner, disabling it, collapsing the window body or replacing its
Source closes descendant popups and releases listeners/resolvers. Popups opened
within a dialog remain owned by that modal interaction; they do not unblock the
background. Floating windows remain nonmodal.

Positioning supports element/point anchors, submenu side flipping, viewport
clamping, scrolling and optional width matching. Existing positionPopup handles
an element anchor above/below; it does not already implement this full contract.

singleOption execute/ask is retained as an explicit policy proposal after
filtering hidden/disabled entries. Ordinary opening remains the default.
Do not infer auto-execution from the number of raw Bag records.

<a id="gc-335-035"></a>
## 035 · Presentation profiles and the slotBar relationship

A common system can present the same entry semantics in these forms:

| Profile | Lifetime/layout | Interaction |
| --- | --- | --- |
| Popup command menu | Open on request, normally vertical | Menu focus, submenu navigation, dismiss after activation |
| Persistent command menubar | Always visible root | Menubar navigation; child menus may be popups |
| Persistent mixed bar | Always visible flex, horizontal/vertical, multiple tracks | Toolbar/control interaction; child fields retain their keys |
| Rich popup panel | Temporary container for arbitrary Source controls | Panel/control focus; not every child is a menuitem |

Recommendation: slotBar belongs to the persistent mixed-bar profile of the same
menu family. It shares definitions, entry state, context and execution, while
owning flex layout rather than an open popup. This is the precise sense in which
it can be called "an always-open menu".

It is not sufficient to set open=True on a popup: that would retain light-dismiss,
popup positioning, menu-only focus and close-on-command behavior. A display profile
changes those policies without duplicating content models or dispatch engines.

Keep slotBar/slotButton as purposeful public component declarations using shared
implementation capabilities, not aliases forwarding through permissive checks.
Whether the public API should instead be menu(presentation="bar") is an owner
decision; no automatic rename is proposed. The implementation should have one
canonical route for each approved spelling, not support both as synonyms by default.

Nested bars, multiple bars per frame region, rows/columns and free controls remain
requirements. Fixed and elastic spaces are layout entries. Collapsing a submenu
is distinct from collapsing a dialog, and a bar does not own window chrome.

<a id="gc-335-040"></a>
## 040 · Python sketches

All snippets are proposed; exact new names/fields require GC-225 review.

```python
# Existing local menu shape, extended here with PROPOSED command references.
drop = pane.dropDownButton("Actions")
menu = drop.menu()
menu.menuline("Save", code="save", command="invoices:save",
              disabled="^.locked")
menu.menuline("-")
export = menu.menuline("Export", code="export").menu()
export.menuline("PDF", code="pdf", command="invoices:exportPdf")
```

```python
# Persistent view: ordinary Source children and the same command definitions.
bar = frame.top.slotBar()
bar.slotButton("invoices:save", disabled="^.locked")
bar.slotSpacer(flex=1)
bar.slotButton("invoices:undo")
```

```python
# Proposed Bag-owned branch; content record schema still needs approval.
recent = menu.menuline("Recent", code="recent").menu(storepath=".recentActions")
```

The registered reference is not the local menu code. Existing normal/Shift
dropDownButton behavior and code persistence remain unchanged. The shown spacer
spelling is the earlier selected form; unnamed slotButton-as-spacer remains open.
Context attachment and checked mutation API are intentionally not invented in
these snippets before their naming/behavior choices are confirmed.

<a id="gc-335-045"></a>
## 045 · Full legacy coverage and intentional changes

| Legacy capability | Destination responsibility |
| --- | --- |
| Labels/icons/checked/favorite/disabled/hidden | Entry presentation, Data bindings and explicit state intent |
| Separators/fixed or elastic gaps | Nonexecuting structural entries |
| Inherited action and per-item action | Explicit owner defaults/instance configuration, one mechanism |
| selected/selected_* | Declared selection outputs and data context |
| values / Bag store / hierarchy | Canonical Bag input projection into owned Source |
| Resolver refresh / onOpeningMenu | Resolver contract and scoped opening lifecycle |
| menuItemCb / disabledItemCb / hiddenItemCb | Typed opening/item hooks and bindings |
| modifiers / validclass / context attachment | Explicit invocation filter and target |
| connectedMenu / attachTo / width alignment | Source attachment and positioning contract |
| singleOption / ask | Explicit auto-invocation policy and shared confirmation |
| Nested menus / keyboard / hover | Popup-chain and presentation interaction |
| MenuDiv / ComboMenu / TextboxMenu | Trigger and value-selection compositions |
| Draggable entries | Existing drag capability if explicitly requested; not free DOM listeners |
| Rich menu content | Source content entries and panel/mixed-bar interaction |
| slotButton.menupath / command options | Shared command references and explicit invocation parameters |

Capability preservation does not promise legacy source compatibility. Dojo
version patches, global context, label coercion fallbacks, raw HTML insertion,
implicit action overrides and double dispatch are intentionally not copied.
HTML labels, if required, must declare a sanitization policy. All deferred rows
remain visible until implemented or explicitly declined by the owner.

<a id="gc-335-050"></a>
## 050 · Qualification, implementation boundaries and decisions

Proposed delivery order:
1. Confirm common Source/entry/invocation architecture and presentation profiles.
2. Define menu ownership independent of dropDownButton; deliver local submenus
   while retaining existing split/Shift/persistence behavior.
3. Add agreed namespaced definitions, publish invocation, state/selection and
   persistent bars with arbitrary Source content.
4. Add explicit contextual opening, hooks and modal/window interactions.
5. Add Bag projection, resolver lifecycle and convenience selection compositions.

These are review slices, not authorization to start implementation. All capabilities
remain in scope; later slices are not silently discarded. Core owns reusable
behavior; adapter/example changes need their bounded scope, and dependency
gaps stay in their owning repositories.

Acceptance scenarios: same command in bar and popup uses shared definition and
Data state but distinct sender; two frames do not exchange recipients; context
changes during ask/delay never redirect execution; checked/selection writes occur
once at the agreed stage; submenu openers never execute; Bag changes preserve
surviving nodes/focus; stale resolver results are ignored; removal/disable/collapse
cleans up; popup and bar keyboard profiles do not capture field input; split
dropdown regression tests remain green. Browser qualification must include
keyboard, pointer/touch, accessibility roles, viewport placement and modal stacks.

W3C patterns are design inputs, not automatic compliance:
[menus](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/),
[toolbars](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/).
Current core skips disabled menu entries; future focus policy and any change to
the current behavior require an explicit decision. Native HTML menu is only a
semantic command-list container, not this interaction system.

First decision: accept the common Source-based menu family, with slotBar as its
persistent mixed-control presentation? Subsequent choices: registry/API,
state-commit timing, data projection schema, context attachment, rich-content/
spacer syntax and unknown-command behavior. Unknown-name ???/warning choices
remain explicitly deferred. No decision is inferred from working sketches.

Verification for this document: syntax/link/anchor checks only. GC-330 records
the earlier 35 JS + one Python baseline tests; no new runtime tests are claimed.

<a id="gc-335-055"></a>
## 055 · Confirmed architecture and Python syntax review

Owner confirms: "Sì, confermo. Ora vediamo la sintassi Python per dichiarare un
menu e usarlo anche come slotbar." The architectural question in §050 is resolved;
detailed mechanisms and APIs are not blanket-approved.

Propose menu/menuline in both presentations, with presentation="bar" selecting
the persistent flex view. This would replace the earlier slotBar/slotButton
authoring proposal for this family; explicit confirmation and GC-225 updates
are required before implementation. Do not add both spellings as default aliases.

```python
def document_commands(menu):
    menu.menuline("Save", code="save", command="documents:save",
                  disabled="^.locked")
    menu.menuline("Undo", code="undo", command="documents:undo")
    menu.menuline("-")
    export = menu.menuline("Export", code="export").menu()
    export.menuline("PDF", code="pdf", command="documents:exportPdf")

trigger = pane.dropDownButton("Actions")
document_commands(trigger.menu())

bar = frame.top.menu(presentation="bar", orientation="horizontal")
document_commands(bar)
```

Proposed syntax, not executable against the current release. The ordinary Python
function composes Source, not a second registry. Each call creates separate nodes;
the same node is not rendered in two parents. Relative bindings resolve in each
instance's declared Data context. Existing dropdown split behavior is preserved.

command selects a JS-owned definition; code identifies its local occurrence for
selection/persistence. A submenu opener cannot also dispatch a command.
presentation, orientation and command are proposed names; no default-code or
unknown-command fallback is implied. Orientation and permanence are independent.

Spacers, free-content slots, checked mutations, context attachment and Bag schema
remain in the full design and require subsequent syntax choices.

<a id="gc-335-060"></a>
## 060 · Owner syntax choice and resolver-first use case

Owner: "Sì, usiamo menu e menuline. Però se il comando è già registrato perché
devo ripetere etichetta e code? Non potremmo fare menu.menuline(\"documenti:save\")?"
The common menu/menuline vocabulary is chosen. Registered-key shorthand is the
requested direction; labels/icons/publish defaults should come from registration.
Local identity/default-code and duplicate-reference rules still need design.
This supersedes the mandatory caption/code repetition in §055's registry examples.
Existing positional captions belong to the current API; a new positional registry
contract must explicitly address their migration, never guess between a caption
and an unknown key. Keyword caption spelling remains proposed.

Owner then stresses: "nel legacy la maggior parte delle volte il contenuto era
un resolver calcolato all'apertura". This is owner evidence of application usage,
not a measured source-frequency result. Lazy opening content is a primary use case,
not an optional last-phase feature. Revise §050's sequencing accordingly: qualify
opening context, resolver lifecycle and Bag projection in the initial common-menu
vertical slice before treating the architecture as complete.

A resolver supplies entries; the command registry supplies reusable defaults for
entries referencing a registered command. Neither replaces the other. A resolver
may return explicit typed captions/disabled/checked/selection data and hierarchy,
with command references where appropriate, but not executable action strings.
Rendering still uses the owned Source projection described in §025.

Proposed semantics: capture opening context, resolve through the owning resolver
contract respecting its cache/expiry policy, project the resulting Bag, then show
entries (with explicit loading/error/empty states). Refresh/invalidation policy
must be declared; "on opening" does not silently force a network call or bypass
cache. A new opening/removal invalidates late prior responses.

For the permanent bar, initial mounting provides the opening-equivalent demand;
later refresh/context changes need explicit policy. These lifecycle defaults and
the public resolver declaration are proposals, not implemented APIs. Nested lazy
branches resolve when their submenu is requested. Preserve independent contexts
and the single Source ownership rule.

<a id="gc-335-065"></a>
## 065 · Same menu in a popup and a toolbar, with lazy submenu

Owner confirms that submenus of a toolbar are popup menus. Permanent presentation
applies only to the root; it is not inherited by descendant menus. Owner then
requests a complete Python example of both root presentations with a resolver
submenu.

**Design example, not runnable with the current release.** Page/endpoint/Bag and
RpcResolver/RemoteResolver are current foundations. framePane, Page.gramlots,
positional command references, label keyword, menu presentation/direct resolver
parameters and the Bag record schema are proposed. The project extension import
represents a package still to be built. Direct menu-owned resolution is now
owner-approved; the exact descriptor spellings remain under design.
Its four namespaced command definitions and the recipient's business handlers
are prerequisites; this example defines menu composition and resolver content,
not a document-saving/export implementation.

```python
from genro_bag import Bag
from gramlot import Page as GramlotPage, endpoint

# Project extension with the four registered commands (proposed packaging).
from documenti.widgets import documenti_gramlot


class Page(GramlotPage):
    gramlots = [documenti_gramlot]

    def main(self, root):
        root.data("document.id", 42)
        root.data("document.locked", False)

        frame = root.framePane(nodeId="document_frame")
        frame.center.contentPane(frameTarget=True).div("Document 42")

        popup = frame.top.dropDownButton("Actions").menu()
        self.document_menu(popup)

        toolbar = frame.top.menu(
            presentation="bar",
            orientation="horizontal",
        )
        self.document_menu(toolbar)

    def document_menu(self, menu):
        menu.menuline("documenti:save", disabled="^document.locked")
        menu.menuline("documenti:undo")
        menu.menuline("-")

        # The menu owns the resolver; no Data path or extra scope.
        menu.menuline(label="Export", code="export").menu(
            resolver="export_menu",
            resolver_document_id="^document.id",
            cacheTime=30,
            sync=False,
        )

    @endpoint
    def export_menu(self, document_id):
        items = Bag()
        for code, caption, command in (
            ("pdf", "PDF", "documenti:exportPdf"),
            ("csv", "CSV", "documenti:exportCsv"),
        ):
            items.setItem(
                code, None,
                kind="command",
                caption=f"{caption} - document {document_id}",
                command=command,
                parameters={"document_id": document_id},
            )
        return items
```

Both roots call the same Python composition function and receive distinct Source
nodes. The toolbar root remains visible; Export opens a popup in both cases.
Each submenu owns an independent resolver instance/cache, without authored Data
scopes or hidden dataRemote nodes. Opening either root does not load Export.
Opening Export requests its resolver and projects the returned Bag.

The menu-specific lifecycle is still to implement. The proposed consumer uses
resolve() to respect cache expiry, waits for loading when needed, and validates
opening/context ownership before projection. A valid cached result is reused.
Parameters are resolved to a snapshot; a changed context invalidates the old
instance before subsequent demand. Do not mutate RpcResolver.params and assume
its cache fingerprint automatically includes those changed endpoint arguments.

The shared document id remains application Data. Item keys are Bag node labels;
record fields, explicit command parameters and label keyword are still proposed.
Unknown registry keys never become free captions. A submenu does not inherit bar
presentation. The existing dropdown arrow opens the popup; its split behavior
is unchanged. See §070 for the source/probe evidence and remaining integration.

<a id="gc-335-070"></a>
## 070 · Direct resolver: existing implementation and bounded integration

Owner: "Sì, colleghiamo il resolver direttamente al menu. Verifica come usare i
resolver che abbiamo già e aggiornami l'esempio Python per popup e toolbar senza
dataRemote e scope aggiuntivi." Direct ownership and example update are approved;
this request does not start menu runtime implementation.

Read-only findings, core HEAD afd5a78:
- js/src/binding/remote-resolver.js: RemoteResolver extends BagResolver, shares
  async loading and expiry, and caches locally when not attached to a Bag node.
- js/src/binding/rpc-resolver.js: RpcResolver takes a binding, endpoint method and
  argument snapshot, and uses binding.node.requests plus binding.call. Its async
  constructor default is sync=false. It does not itself require dataRemote.
- js/src/binding/providers.js: dataRemote is one installer of RpcResolver on Data.
  Its automatic argument-change reload policy belongs to that provider and must
  not be copied into menu opening inadvertently.
- js/src/builder/source.js and binding/runtime.js: NodeRequests provides scheduling
  and binding.call provides transport/disposal. Reuse them rather than new fetch,
  custom AbortController queues or a new cache.
- BagResolver.cachedValue supports local caching without an attached node.
  RemoteResolver attached to a node writes the returned value into that node.
  Therefore do not attach it naively to menu Source: the returned data Bag is not
  its Source children. Ownership by the menu binding and attachment to the menu
  node's value are different operations.
- NavigationResolver and DirectoryResolver specialize navigation/filesystem
  semantics. They are evidence of reuse, not generic menu adapters.

Recommended implementation: the menu binding owns an unattached RpcResolver and
the Bag-to-Source projection. The declaration supplies method, bound parameters,
cacheTime and explicit sync=False in this example. The menu's own NodeBinding is
the request owner. No generated Data path, synthetic dataRemote, extra authoring
scope or Python-side HTTP resolver is needed.

Existing resolve() starts a request only on demand/expiry and returns the current
cache; loading exposes the pending promise. The consumer must handle both cached
and pending outcomes, including cacheTime=0, without recursive re-reading during
render. Existing refresh() forces a refresh; it must not replace resolve() on
every opening. Closing a popup invalidates that visible opening but need not
discard a still-valid cache; Source disposal closes its binding and aborts work.

A changed parameter/context snapshot requires an invalidated/replaced resolver.
An old unattached resolver can fill only its own discarded cache. Projection
must separately check current instance/context and live menu before applying.
NodeRequests serializes old/new requests on the same Source owner; do not bypass
that contract. Automatic loading of already-open changed context is a policy
still to confirm, rather than a claim about existing menu behavior.

Verification, 2026-10-22:
- 30 existing tests pass: binding-dataremote and navigation-resolver.
- A temporary probe instantiates the real RpcResolver with a real Builder Source
  owner and simulated endpoint transport. It verifies no eager call, shared
  pending reads, local Bag caching, reuse inside cache time, a fresh resolver for
  changed parameters, closed-owner gating and unchanged Source children.
- No dependency/source modifications. This proves reusable mechanisms, not
  implemented menu lifecycle, projection, focus or full concurrent-context safety.

<a id="gc-335-075"></a>
## 075 · Resolver result Bag: confirmed record schema

On 2026-10-22 the owner accepts this schema with live Data bindings for checked
and disabled, then explicitly extends the same contract to hidden in menus and
toolbars. This supersedes the earlier literal-only restriction on these fields.
Runtime implementation is still pending.

### Structure and identity

Return one Bag. Sibling order is Bag order. Each node label is the stable local
entry code; do not repeat a code attribute in that record. Labels are unique
within their parent; the hierarchical sequence of labels identifies a nested
occurrence. Registered command identity is separate and may occur more than once
under distinct local labels. Source nodeId retains its own meaning.

No lookup guesses entry type or label from a node's value:
| kind | Node value | Required record fields |
| --- | --- | --- |
| command | None | command, the namespaced or base registered key |
| separator | None | kind only |
| submenu, supplied content | Bag (possibly empty) | caption; no resolver |
| submenu, lazy content | None | caption, resolver and explicit resolver arguments |

kind is mandatory for these records. A submenu declares exactly one content
source: nested Bag or resolver. A command cannot also own children/resolver.
A separator cannot execute or own children. Unsupported combinations are schema
errors, distinct from the deferred handling of an unknown registry key.
Recursive Bags/cycles are not valid menu hierarchies.

### Entry attributes

| Attribute | Meaning/default |
| --- | --- |
| command | Registry reference for a command entry; not executable text |
| caption | Optional command-label override; otherwise registry default. Required for submenu openers |
| icon, tooltip | Optional overrides for commands; optional presentation on submenus |
| disabled | Boolean or live Data binding; default false; owner/ancestor disabled still wins |
| hidden | Boolean or live Data binding, default false; resolved true hides the entry in both popup and bar presentations |
| checked | Optional boolean or live Data binding on commands: absent means no check indicator; resolved false means unchecked; resolved true means checked |
| favorite | Optional literal boolean, default false; independent decorative marker |
| parameters | Optional serializable mapping passed as command arguments; not implicit attributes or code |
| resolver | Endpoint name on a lazy submenu |
| resolver_<name> | Explicit serializable argument values for that endpoint |
| cacheTime, sync | Existing resolver policy meanings, forwarded as in the confirmed Source declaration |

checked, disabled and hidden accept literal booleans or the normal reactive ^path syntax.
Projection preserves these declared pointers in the corresponding Source
parameters and uses the existing binding runtime. Data changes update visible
entries without recalling the resolver, in popup menus and permanent toolbars.
Pointers use the menu's normal Data context: ^document.locked is absolute;
relative pointers follow the inherited datapath. The result Bag creates no
additional Data scope. These are read bindings, not implicit writeback.
Changing hidden updates entry visibility without resolving the menu again;
true hides it and false shows it. The existing boolean hidden projection is
the foundation; menu layout and keyboard navigation must respect hidden entries.

Other boolean flags remain literal in this schema. Arbitrary Bag strings are not
interpreted as bindings or executable code. Caption is plain text; no raw HTML
or event/script fields are copied into Source. The current Command grammar
already declares disabled as a boolean read binding; menuline checked and the
Bag-to-Source projection still require implementation.

checked describes current state only. Activating a checked command publishes its
normal command; its handler owns the state change. The menu must not toggle it
independently and then run a handler that toggles again. Generic two-way toggles,
exclusive groups and selected/selected_* outputs remain separate explicit
contracts in §015; this record schema does not remove them from the project.
Literal states remain resolver snapshots. Bound states follow current Data even
when the result Bag is cached; cacheTime governs content resolution, not updates
to already projected bound fields.

Default precedence: declared registry presentation, then allowed record overrides.
Local entry identity comes from the node label. An unknown command key is not
treated as a caption; ???/warning behavior remains explicitly deferred.

### Example

The following function builds a real Bag using the current Bag API. An @endpoint
can return its result. Record consumption by menus remains proposed.

```python
from genro_bag import Bag


def document_menu_items(document_id):
    items = Bag()

    items.setItem(
        "save", None,
        kind="command",
        command="documenti:save",
        disabled="^document.locked",
        hidden="^document.hideSave",
        parameters={"document_id": document_id},
    )

    items.setItem(
        "details", None,
        kind="command",
        command="documenti:toggleDetails",
        checked="^document.detailsVisible",
        parameters={"document_id": document_id},
    )

    items.setItem("sep_export", None, kind="separator")

    # Submenu with content already present.
    formats = Bag()
    formats.setItem(
        "pdf", None,
        kind="command",
        command="documenti:exportPdf",
        parameters={"document_id": document_id},
    )
    formats.setItem(
        "csv", None,
        kind="command",
        command="documenti:exportCsv",
        disabled="^document.locked",
        parameters={"document_id": document_id},
    )
    items.setItem(
        "export", formats,
        kind="submenu",
        caption="Export",
        icon="download",
    )

    # Submenu computed only when opened.
    items.setItem(
        "versions", None,
        kind="submenu",
        caption="Previous versions",
        resolver="version_menu",
        resolver_document_id=document_id,
        cacheTime=30,
        sync=False,
    )
    return items
```

version_menu returns the same record schema, so lazy submenus can nest to any
supported depth. Literal resolver arguments here are computed values, unlike the
Source binding resolver_document_id="^document.id" in §065. No additional Data
scope or dataRemote is required.

Closing/reopening a cached submenu respects cacheTime; a permanent root does not
make descendant menus permanent or eagerly resolve their children. Empty Bag is
a valid no-items result, not a different result format. Empty/loading/error
presentation uses the agreed menu lifecycle, not synthetic command records.

### Validation and boundaries

Propose validating each received level before projecting it: supported kind,
unique local keys, value type, mutually exclusive content sources and typed fields.
Report the failing item path. Unknown attributes should be diagnosed rather than
passed wholesale to Source; full allowed fields must be finalized before runtime
implementation. Do not globally scan unknown registry names into labels.

Separators retain positions as returned; automatic trimming/compaction is not
implicitly added. Anonymous spacer syntax, rich-content entries, bindings beyond
checked/disabled/hidden and selection/radio records are pending extensions to this
schema, with capability coverage retained in §045. Any future extension needs one
explicit representation rather than type inference or fallback chains.

<a id="gc-335-080"></a>
## 080 · Shared registry and command message

The owner confirms gramlot.commands.registerGroup on 2026-10-22, then explicitly
confirms the five-field message contract: "Sì, confermo il contratto a cinque
campi." The group register method and namespaced keys retain their reviewed
shape. The contract below is approved; runtime implementation is pending.

A successful activation delivers one local message to the current designated
frame content through its existing selfsubscribe topic. Example:

```javascript
{
    sender: saveEntryNode,
    target: documentEditorNode,
    command: "documenti:save",
    parameters: {document_id: 42},
    modifiers: {shift: false, ctrl: false, alt: false, meta: false}
}
```

- sender: the actual activating menuline SourceBagNode, not its DOM element,
  menu opener or registry definition. Popup and toolbar occurrences have distinct
  senders even when they reference the same command.
- target: the live designated frameTarget SourceBagNode resolved for delivery.
  It is the content recipient, not necessarily the center region container.
- command: the full registered command key, including namespace when present.
  It is not the local Bag entry label or the subscription topic.
- parameters: an explicit serializable application-argument mapping, default {}.
  Capture a detached snapshot at activation; do not merge arbitrary record
  attributes, Data or DOM event fields into it. Argument-default merging is not
  introduced by this message contract.
- modifiers: four explicit booleans shift, ctrl, alt and meta, sampled from the
  activating pointer/keyboard event. These follow the existing button modifier
  names, mapped from shiftKey/ctrlKey/altKey/metaKey. Do not retain stale modifier
  state from menu opening; an activation without physical keys has false values.

A definition with publish: "save" sends the message to the recipient's
selfsubscribe_save handler while message.command remains "documenti:save".
Namespaced commands may deliberately share a topic; receivers can distinguish
them by command. The topic is the delivery address, not a duplicated payload field.

The normal named Logic signature remains handler(node, message), with node equal
to message.target. Handlers own Data mutations and explicit server operations;
checked is not automatically toggled by delivery.

The five fields are runtime-owned delivery metadata plus explicit arguments;
parameters cannot override sender, target, command or modifiers. The envelope
and snapshots are read-only by contract, but live Source references are not
frozen. They must not be stored as persistent Data or sent wholesale to an RPC;
server calls receive only the application's explicit serializable arguments.

No frame field or raw DOM event is added to this minimal envelope. Context-menu
opener/row context remains a separate open contract; never silently substitute it
for sender/target or auto-merge it into parameters. This confirmed contract
supersedes the earlier GC-320 payload table, including its proposed frame field.

Before delivery, recheck that sender/target are live and the entry remains visible
and enabled. Missing/duplicate recipients or invalidated activation prevent
dispatch; there is no global-topic fallback or delivery to a disposed target.
Detailed concurrent replacement/ask/delay handling remains an implementation gate.

<a id="gc-335-085"></a>
## 085 · Implementation readiness and remaining decisions

Registry loading follow-up: [GC-325 §040](325-how-to-extend-gramlot.md#gc-325-040)
records the confirmed registerCommands hook and preparation/bootstrap lifecycle.
Collection name identity, repeated-inclusion deduplication, same-name conflicts
and errors on duplicate full command keys are confirmed there. Each namespace
now has one owning collection; package formats are confirmed in GC-325 §045–050.
Dependency mapping is confirmed in [GC-325 §055](325-how-to-extend-gramlot.md#gc-325-055):
map module destinations once and derive Python imports from JS dependencies.
External-package mapping is confirmed in GC-325 §060 and symbolic browser
linking in §065. GC-325 §070 confirms a shared build fingerprint and startup
failure on mismatch; subsequent sections settle calculation/fields and the
host asset-delivery contract.
GC-325 §075 confirms SHA-256 coverage, generated fingerprint/inventory fields,
wrapper handling, staged verification and fingerprinted asset bases. Concrete
host route/integration work remains pending. GC-325 §§080–090 now confirm the
generator CLI, distribution split and launcher/generator responsibilities.
GC-325 §095 confirms theme → collections → page CSS order, waiting for all
declared stylesheets before startup and blocking startup on stylesheet failure.
GC-325 §100 confirms collection records {name, url, buildId} and verified
descriptor-backed asset exposure. GC-325 §105 confirms adapter resource APIs;
§110 confirms a fixed per-process catalogue derived from pages at startup.
GC-325 §115 is the current infrastructure readiness checklist. Sections 120–130
now settle page discovery, source css/assets and the exact generator protocol
with exit codes. Output recovery is confirmed in §135 and the concrete generator
toolchain in §140. Section 145 now confirms the bounded first Uvicorn integration
and its behavior. Infrastructure design is ready; runtime implementation remains
pending. The separate menu/window decisions below are not implicitly resolved.

Status at 2026-10-23: design only. The owner confirmed the message contract and
requested this inventory; no implementation phase has started.

### Settled contracts

- One menu/menuline family, registered-key shorthand, popup and permanent bar
  presentations; toolbar submenus are popups.
- JavaScript registration through gramlot.commands.registerGroup; Python consumes
  definitions. Base collection is implicit; gramlots adds importable collections.
- Direct menu resolver with resolver_* arguments, cacheTime and sync, without
  authored dataRemote or additional Data scopes.
- Ordered result Bag with stable local labels, explicit command/separator/submenu
  kinds, nested Bags or lazy submenu declarations (§075).
- checked, disabled and hidden accept booleans or normal reactive Data bindings;
  updates do not require resolving the menu again. Handlers own state mutation.
- The five-field message and scoped recipient contract in §080; no frame field,
  global fallback or implicit server serialization of Source references.

### Decisions needed for the first usable menu/toolbar increment

| Area | Remaining decision |
| --- | --- |
| Registry activation | Design is settled in GC-325 §040–110, including generated dependency references and artifact-consistency checks. Implementation remains pending; GC-325 §115 lists infrastructure prerequisites. |
| Definitions and arguments | Definition fields/catalogue validation are settled in GC-325 §050. Remaining: allowed instance overrides; whether command arguments can bind to Data and their snapshot timing relative to ask/delay. The envelope snapshot itself is settled; no implicit merge is approved. |
| Invalid references | Explicit behavior for unknown command keys (placeholder, warning or refusal), kept separate from malformed Bag records. The owner deferred this choice; never invent label fallback. |
| Resolver lifecycle and projection | Initial load of a resolver-backed permanent bar; parameter-change refresh behavior; loading/empty/error/retry presentation; refresh and identity-preserving Source projection. Reuse RpcResolver cache/request ownership; do not add another resolver/cache protocol. |
| Interaction and concurrency | Focus when an active item becomes hidden/disabled or disappears; disabled-entry navigation policy; popup dismissal and submenu navigation. Define cancellation when context/recipient changes during ask/delay so activation cannot be redirected. Existing split-dropdown behavior stays covered. |
| Minimum frame contract | Confirm the concrete region-accessor implementation and creation rules needed by frame.top/frame.center, including feasibility with SourceBag/Builder APIs. Designated content is already the recipient; do not reopen that choice or implement dependency workarounds. |

The proposed first increment includes the already reviewed Python example end to
end: registered commands, the same definition used in popup and toolbar, a direct
resolver submenu, reactive states and a designated frame recipient. Resolver
integration is part of that increment, superseding its earlier late-phase
placement in §050. This is a scope recommendation pending owner confirmation.

### Decisions that may be staged separately

Subject to explicit scope approval, these need not block the first increment,
but remain required project work rather than discarded legacy capabilities:

- Packaging/CLI: contracts are consolidated in GC-325 §115, separating settled
  design from remaining specifications and implementation. Full gramlots
  consumption is required for the complete extension-distribution example;
  it is not solved merely by naming the JS registry.
- Rich bars: exact spacer, nested permanent-bar and arbitrary Source-content
  syntax; multiple rows/columns and placement rules. Separators are already in
  the Bag schema. A submenu is not an implicit permanent nested bar.
- Context/selection: attachment API, opening and item hooks, row/opener context,
  selected/selected_* outputs, radio groups, singleOption and specialized menu
  compositions. These must not silently add fields to the five-field envelope.
- Windows: final dialog/floating parameter names, close guard signature and
  async/Data-write semantics, retained content/geometry policy and maximization.
  Approved modality and movable/resizable/collapsible defaults remain unchanged.

Implementation engineering (mapping approved fields to existing bindings,
subscription cleanup and tests) does not require a new product decision unless
a dependency gap or an unresolved contract changes the agreed path. Browser
qualification must cover focus, keyboard/pointer and visibility; targeted
regressions cover projection, stale results and message routing. No new runtime
behavior has been verified by this document update.


<a id="gc-335-090"></a>
## 090 · Confirmed resolver loading and invalidation

Block ID: **GC-335-090**.

Owner confirmation, 2026-10-23: "ok", replying to the concrete proposal:
"caricamento del popup all’apertura, della toolbar quando viene montata;
cambiando un parametro, invalidare il contenuto e ricaricarlo se visibile,
altrimenti alla prossima apertura."

The approved menu consumer lifecycle is:

- A resolver-backed popup requests its content when opened.
- A resolver-backed permanent toolbar requests its content when mounted.
- A resolver argument change invalidates the content. If the presentation is
  visible, reload it; otherwise defer loading until its next opening.

These triggers reuse the existing RpcResolver cache and request ownership; opening
is not an instruction to bypass cacheTime or introduce a second cache protocol.
Reactive checked/disabled/hidden updates remain independent of content resolution,
as already confirmed in §075. This decision settles loading triggers and argument
invalidation only. Loading/empty/error/retry presentation is settled in §095;
refresh projection, focus and concurrent activation policies remain to be decided. No menu runtime
implementation is introduced by this record.

Infrastructure status: the collection generator, registry activation and consumer
migration are now implemented and verified (GC-325 §150; GC-070 §1655). The
infrastructure-pending statements in §085 describe the earlier design checkpoint;
they no longer block menu work. Other menu/window decisions in §085 remain open.


<a id="gc-335-095"></a>
## 095 · Confirmed loading, empty and error presentation

Block ID: **GC-335-095**.

Owner confirmation, 2026-10-23: "ok", replying to the proposal of a discreet
loading indicator with invalidated old entries not actionable, a non-selectable
"Nessuna voce" empty result, and "Impossibile caricare" with "Riprova" on error,
without automatic retries. The same behavior applies to popup and toolbar.

- Loading shows a discreet indicator. Invalidated previous entries cannot execute.
- An empty result shows a non-selectable empty-state message ("Nessuna voce").
- A loading error shows an error message ("Impossibile caricare") and an explicit
  retry action ("Riprova"). There are no automatic retries.

This settles user-visible feedback for the resolver lifecycle in §090. It does
not decide whether previous content remains visually present while loading, the
Source projection strategy or focus relocation. Unknown command references remain
a separate decision, distinct from resolver failures and malformed Bag records.
Menu runtime implementation and browser verification remain pending.


<a id="gc-335-100"></a>
## 100 · Confirmed unknown-command behavior

Block ID: **GC-335-100**.

Owner confirmation, 2026-10-23: "ok", replying to the concrete proposal of a
visible disabled "???" entry, a console warning naming the full command key and
its menu location, and continued operation of the other menu/toolbar entries.

An entry referencing an unknown registered command is displayed as "???" and
is disabled. Emit a console warning containing the full command key and its
location in the menu. Other entries continue to work, in both popup and toolbar
presentations. No command is dispatched for the unresolved reference and no
caption-based command lookup is introduced.

This bounded policy settles the deferred unknown-registry-key decision in §§075
and 085. It does not make malformed Bag records valid or change collection
verification/startup failures. Runtime implementation and verification remain
pending; warning repetition policy and exact diagnostic formatting are not
specified by this decision.


<a id="gc-335-105"></a>
## 105 · Confirmed command parameter bindings and capture

Block ID: **GC-335-105**.

Owner confirmation, 2026-10-23: "ok", replying to the proposal that command
parameters accept fixed values and Data bindings, are captured when the entry is
activated, and retain those captured values during any confirmation or delay.
The concrete example was Save activated for document 42: a later confirmation
retains document_id=42 even if the selected document changes in the meantime.

Command parameters may contain fixed values and Data bindings. Resolve their
values at entry activation and capture the detached serializable parameter
snapshot specified in §080. Confirmation and delayed dispatch use that same
snapshot; they do not reread Data to retarget the command arguments. This applies
to both popup and toolbar command occurrences.

This decision settles parameter binding support and capture timing only. It does
not introduce argument-default merging, implicit context fields, a new binding
syntax or recursive interpretation of arbitrary strings. Concrete grammar mapping
must follow existing binding conventions. Cancellation when the sender, target
or entry eligibility changes is settled in §110; snapshotting parameters does
not authorize dispatch to an invalid recipient.
Runtime implementation and verification remain pending.


<a id="gc-335-110"></a>
## 110 · Confirmed cancellation of pending activation

Block ID: **GC-335-110**.

Owner confirmation, 2026-10-23: "ok", replying to the proposal that a command
awaiting confirmation or delayed dispatch is cancelled if its entry is removed,
disabled or hidden through binding, or its recipient is destroyed or replaced.
The proposal explicitly excludes normal popup closure after the click from
cancellation, retains the captured parameters and forbids automatic redirection
to a new recipient.

For both popup and toolbar occurrences, cancel pending activation when:

- The activating entry is removed, disabled or hidden through its state binding.
- The designated recipient is destroyed or replaced.

Normal popup dismissal after activation is presentation closure and does not
itself cancel the command. Keep the parameter snapshot from §105. Never transfer
the pending command to a replacement recipient. This settles the bounded
concurrent replacement/confirmation/delay policy left open in §080; existing
pre-delivery liveness and eligibility checks still apply.

Focus relocation and the keyboard map are settled in §§115–120. This record
does not define a new confirmation API or introduce runtime implementation.


<a id="gc-335-115"></a>
## 115 · Confirmed focus eligibility and relocation

Block ID: **GC-335-115**.

Owner confirmation, 2026-10-23: "ok", replying to the proposal that navigation
skips hidden/disabled entries, separators and spacers; an unavailable active entry
moves focus to the next usable entry, otherwise the previous one; if none remain,
the popup closes and restores focus to its opening button, whereas a toolbar
keeps focus on its container.

- Navigation skips hidden entries, disabled entries, separators and spacers.
- When the active entry disappears or becomes disabled, move focus to the next
  usable entry; if none follows, use the previous usable entry.
- If no usable entry remains after this change, close the popup and restore
  focus to its opening button. In a permanent toolbar, focus its container.

This relocation policy concerns an existing active entry becoming unavailable;
it does not replace the initially empty-result presentation in §095. It does
not define attachment/focus recovery for context menus without an opening button
or for a removed opener. Those lifecycle cases remain to specify. The keyboard
map and submenu navigation are settled in §120; rich-content interaction remains open.
No runtime implementation or browser verification is introduced by this record.


<a id="gc-335-120"></a>
## 120 · Confirmed keyboard map

Block ID: **GC-335-120**.

Owner confirmation, 2026-10-23: "ok", replying to the concrete keyboard map for
popup navigation, orientation-dependent toolbar navigation, Home/End, activation,
submenu arrows, Escape and Tab/Shift+Tab exit.

- Up/Down navigate popup entries. Toolbar navigation uses arrows along the
  toolbar orientation.
- Home/End select the first/last usable entry.
- Enter/Space execute a command or open its submenu, according to entry kind.
- In a popup, Right opens the submenu; Left closes that submenu and returns focus
  to the entry that opened it.
- Escape closes the current popup level and returns focus to its opener.
- Tab/Shift+Tab leave the menu and close its popups rather than visiting every
  entry as an individual tab stop.

Navigation respects the eligibility rules in §115. This decision does not add
arrow-key wrapping, type-ahead search, a new right-to-left policy or interception
of editing keys in arbitrary embedded controls. Rich-content interaction and
pointer opening/dismissal remain separate specifications. No menu runtime is
implemented or browser-qualified by this documentation step.


<a id="gc-335-125"></a>
## 125 · Provisional design status and pointer interaction

Block ID: **GC-335-125**.

Owner clarification, 2026-10-23: "si... tuuto quello che ti dico è provvisorio
perche ovviamente devo capire usandolo". This replies to the pointer-interaction
proposal and qualifies the menu/slotbar decisions discussed so far.

The recorded confirmations select a provisional design baseline for implementation
and hands-on evaluation. They are not final usability acceptance, a stable API
commitment or a frozen contract. Preserve their history and revise the baseline
with the owner as actual use reveals what should change. Earlier "confirmed" or
"approved" wording in this menu project must be read with this qualification.
It does not authorize unreviewed alternative behavior, an expanded implementation
scope or publication. Previously delivered collection infrastructure is not reopened
by this menu/slotbar design-status clarification.

The pointer policy selected for this provisional baseline is:

- In a toolbar, clicking the opener opens its menu; clicking it again closes it.
- Inside a popup, a submenu opens on click or pointer hover after a short delay.
- Moving the pointer from the menu into its submenu does not close it.
- Clicking outside closes all popups in the chain.
- Activating a command closes the popup chain; the permanent toolbar stays visible.

The exact hover delay is not specified. This record does not add implementation
or claim browser/user acceptance. Hands-on evaluation remains necessary before
calling the menu/slotbar behavior stable.


<a id="gc-335-130"></a>
## 130 · Provisional menuline authoring and occurrence identity

Block ID: **GC-335-130**.

Owner confirmation, 2026-10-23: "ok", replying to the proposed syntax below and
its explicit migration rule. This is the provisional baseline qualified in §125.

```python
menu.menuline("documenti:save")
menu.menuline("documenti:save", caption="Salva una copia")
menu.menuline("-")

export = menu.menuline(caption="Esporta", node_label="export")
submenu = export.menu(resolver="export_menu")
```

The first positional argument is a registered command reference, except for the
existing explicit "-" separator spelling. caption overrides a command's display
label or labels a submenu opener. node_label identifies an occurrence when an
explicit reference is needed; authors do not have to repeat a mandatory code.
The same command can occur multiple times as distinct Source nodes with distinct
parameters. Existing Source identity conventions apply; do not infer occurrence
identity from command keys or confuse it with the registered command identity.

Migrate existing positional-caption usages explicitly. Do not guess whether a
string denotes a caption or a registry key, and do not retain an implicit dual
interpretation. Unknown command references follow §100. Existing split-dropdown
behavior still requires regression coverage when its declarations are migrated.
The old examples requiring repeated caption/code in §§055–065 are superseded by
this syntax where they conflict. caption is the selected label spelling for this
path, matching the resolver Bag schema; label is not an added alias.

This record settles syntax and occurrence identity, not the remaining bar
composition or minimum frame contract. No runtime implementation is introduced.


<a id="gc-335-135"></a>
## 135 · Provisional permanent-bar composition

Block ID: **GC-335-135**.

Owner confirmation, 2026-10-23: "Ok, adottiamo questa composizione come base
provvisoria. Vediamo il contratto minimo del frame e poi passiamo alla prima
versione da provare." This accepts the explicit Source composition below under
the provisional status in §125.

```python
bar = frame.top.menu(presentation="bar", orientation="horizontal")
bar.menuline("documenti:save")
bar.spacer(size=12)  # fixed pixels
bar.menuline("documenti:undo")
search = bar.contentPane(node_label="search")
search.input(value="^document.query")
bar.spacer(flex=1)   # remaining available space
bar.menuline("documenti:close")

group = bar.contentPane(node_label="extra")
nested = group.menu(presentation="bar", orientation="vertical")
nested.menuline("documenti:toggleDetails")
```

A permanent bar contains explicit Source children: command entries, layout
spacers and ordinary contentPane containers for free controls or nested bars.
spacer(size=12) supplies twelve pixels of fixed space; spacer(flex=1) consumes
available flexible space. A spacer is not a command and never publishes.
Reuse contentPane rather than introduce a second free-content container API.
Composition stays in the Source tree and supports normal structural edits.

A nested permanent bar is explicitly declared inside its content container.
In contrast, menuline(caption="Esporta").menu(...) opens a popup submenu;
permanent presentation is not implicitly inherited by submenus. This decision
does not add slotBar/slotButton aliases or revive the earlier string DSL.
The minimum frame contract is the remaining structural decision for the first
trial version; no runtime implementation is claimed in this record.


<a id="gc-335-140"></a>
## 140 · Provisional minimum frame and authorized trial implementation

Block ID: **GC-335-140**.

Owner confirmation, 2026-10-23: "ok" to the minimum frame contract and first
trial scope. framePane reuses borderContainer layout, with top/bottom/left/right/
center authoring accessors. Access creates the region once; repeated accesses
return its actual Source node. Unused regions occupy no space. Regions have no
automatic bar and accept normal content and multiple bars. Top/bottom bars stack
vertically; left/right columns sit side by side. Center fills the remaining space.
One central content node marked frameTarget=True receives the frame commands.
A missing or duplicate recipient prevents dispatch with diagnostics. Nested frames
own their recipient; command delivery does not fall back to an outer frame.

The approved first trial includes this frame, popup/permanent menus, §135
composition, registered commands, bindings and resolver submenus, with a Python
trial page in gramlot-examples gallery and regression/browser verification.
Dialog and floating are the following increment. All choices remain provisional
per §125. Existing caption usages are explicitly migrated per §130; no release
or publication is authorized. The reusable components and behaviors belong in
core; the example remains in gramlot-examples.


<a id="gc-335-145"></a>
## 145 · First provisional implementation and verification — 2026-10-23

Block ID: **GC-335-145**.

The bounded trial authorized in §140 is implemented: framePane reuses the border
layout; region accessors create ordinary Source contentPane nodes once. menu and
menuline share popup/permanent presentation, command registration, five-field
local messages, Data-bound checked/disabled/hidden, literal captions, composition,
spacers, keyboard navigation and lazy resolver submenus. MenuBinding reuses
RpcResolver and projects validated ordered Bags into the real Source hierarchy.
ButtonBinding retains command execution, ask/delay and lifetime cancellation.
Unknown commands are visibly unavailable and diagnosed; nested frames do not
borrow an outer recipient. Existing split-dropdown captions were explicitly
migrated. No slotBar/slotButton aliases or alternate bus were introduced.

The Python integration trial lives in gramlot-examples at
src/gramlot_examples/trials/menu, added through the existing extra-catalogue
mechanism. Its prepared menu-trial collection registers documenti commands;
Page.gramlots loads it. One Python method authors both presentations. The central
content handles messages through Logic and updates Data. Export returns a lazy
Bag from the page endpoint. The trial includes bound states, an embedded input,
nested bars, confirmation, delayed invocation and an intentional resolver error.
The staged route is /pages/menu/01_menu_trial.

Verification: 3,800 core JS tests pass; 263 core Python tests and 382 subtests pass,
with the existing upstream nested-regex expected failure. Fifteen focused JS
menu regressions include Python-to-browser wire, stale RPC results, literal text,
invalid Bags, focus relocation, asynchronous opening focus, target isolation and
pending-command cancellation. Three Python authoring regressions pass. Existing
examples: 27 tests/130 subtests pass; the new trial endpoint/bootstrap test passes
separately. Python adapters: 143 pass, one optional dependency skip. Uvicorn on
127.0.0.1:8093 was exercised in a real browser for popup/bar state, registered
commands, remote submenu, keyboard invocation, confirmation and error/retry.

This is an implemented and tested provisional version, awaiting owner evaluation
through use. It is not stable-API acceptance or release authorization. Dialog and
floating remain the next increment. The wider legacy inventory (radio/exclusive
selection, selected_* outputs, pointer/context-menu anchors, MenuDiv/ComboMenu,
opening callbacks and singleOption policy) remains outside this first trial.


Gallery follow-up (2026-10-23, GC-070 §1720): the Python trial is now a six-lesson
chapter including frame regions, nested recipient isolation and a second lazy
resolver. Owner approved the discovered contentPane flex projection correction
("Sì, correggi anche il core"). Flex layout now reaches the inner slot container;
side bars appear in adjacent columns. The core regression suite passes 3,801
tests. This remains provisional, with no new public API or release acceptance.


Visual follow-up (2026-10-23, GC-070 §1725): owner requested compact aligned
menu rows, separators, checked state and side-opening submenus using the supplied
macOS screenshot as reference. The popup presentation now follows that structure;
toolbar-root popups remain below their opener, nested popup branches open beside
the row and flip when needed. No public grammar or command contract was added.
The Python popup lesson demonstrates all requested states with instructions
above the example. Focused regression and real-browser checks pass; usability
acceptance remains pending.


<a id="gc-335-150"></a>
## 150 · Parent-area opening and four presentations — 2026-10-23

Block ID: **GC-335-150**.

Owner requested the same hierarchical menu as popup, horizontal bar, vertical bar
and context menu, with instructions above every example. Following inspection of
legacy modifiers, the owner confirmed "Sì, manteniamo questa sintassi" for:

```python
area.menu()                   # Context menu: right-click or keyboard invocation.
area.menu(modifiers="*")      # Ordinary click, with no modifier keys.
area.menu(modifiers="Shift")  # Exactly Shift+click.
```

This replaces the unapproved `context=True` proposal. Modifiers select opening,
not command identity: combinations use Shift, Ctrl, Alt and Meta, separated by
commas or spaces, with exact matching. Extra pressed keys do not match; `*` is
not a wildcard. The implementation rejects unknown or repeated modifiers.
ContextMenu and Shift+F10 provide keyboard opening. Pointer opening uses the
pointer position; keyboard opening uses the parent area's bounds. Popup menus
inside menuline retain submenu opening; horizontal bars open their submenu below,
vertical bars and popup branches beside the entry, with viewport adjustment.

Attachment is to the direct parent area and is removed with the menu. Commands
still use sender, target, command, parameters and modifiers; command modifiers
come from activation, not a retained opening event. There is no new global
context state. The bounded change supersedes the parent-area context deferral in
§145. Legacy validclass, external attachment targets, automatic row/item context,
radio groups and the other deferred legacy capabilities remain outside this trial.

Implemented: core opening listeners, grammar metadata, popup geometry and vertical
bar layout. Area-attached popups use the parent's default slot; submenu popups
retain their named slot. The Python chapter's first lesson authors the same
hierarchy through one method in four presentations plus an exact-Shift area.
It demonstrates aligned icons, separators, checked Details, disabled Undo and
Data-bound Save availability, with shared Data and explicit frame recipients.

Verification: 44 focused JS regressions pass; two Python chapter tests and six
page subtests pass. Uvicorn/browser confirms the four presentations, two levels
of cascading submenu, shared checked/disabled updates, keyboard context opening,
command delivery and exact modifier matching. The full release suite was not
rerun for this bounded increment. Implemented and verified; usability acceptance
remains with the owner. No release or stable-API acceptance is implied.


<a id="gc-335-155"></a>
## 155 · Toolbar slots, groups and priority overflow — 2026-10-23

Block ID: **GC-335-155**.

Owner's toolbar references establish a first level filling its assigned region,
with commands, ordinary components (including search inputs), groups and fixed or
elastic spacers. A continuation button opens a menu for overflow content. Menus
may also contain ordinary controls; restricting overflow to command entries was
an agent proposal withdrawn before approval.

Owner requested per-slot visibility policy and priority, with groups kept together.
The owner answered "ok" to the precise first-version rule: "priorità più bassa
esce prima; a parità, si parte dal fondo; gruppi sempre indivisibili". The accepted
behavioral design is:

- Slots may remain in the toolbar or be eligible for overflow. An indivisible
  group owns its policy and priority as a unit; children do not independently
  migrate away from it.
- Lower-priority eligible units move first; ties are resolved from the end of the
  declared order. Priority selects which units move, not their display order.
- Both the remaining toolbar content and overflow content retain declaration order.
- Elastic spacers release available space before units move. Spacers do not become
  overflow entries. Items return as space becomes available, preserving control
  values and bindings.
- The overflow control itself requires space in the toolbar. Measurement and
  relocation must not duplicate commands, control state or Source ownership.

Owner additionally requested optional user-configurable slot/group visibility,
persisted in sessionStorage, explicitly "solo alla fine". Keep that as a later
optional increment, separate from automatic responsive overflow; user-hidden
content is not the same as temporarily overflowed content. Its storage identity,
customization UI and restoration policy are not yet approved.

This is a confirmed provisional behavioral design, not an implemented overflow
feature. Public grammar names and the rendering/lifecycle implementation remain
to be specified under GC-225. Owner subsequently confirmed: "Sì, se gli slot
sempre visibili non ci stanno, facciamo scorrere la toolbar senza spezzare i gruppi.
comunque tutto vaverificato". If always-visible content still exceeds available
space after eligible units overflow, the toolbar scrolls along its axis, keeping
groups intact. Here always-visible means retained in the toolbar, not guaranteed
to remain simultaneously inside the viewport. This explicitly approves scrolling;
wrapping, forced overflow of retained units and splitting groups are not approved.

All these choices remain provisional and must be verified through actual use.
Verification must exercise shrinking and growing, priority ties, indivisible
groups, fixed and elastic spacers, horizontal and vertical scrolling, access to
the overflow control, and inputs retaining value, binding and usable keyboard
focus across transitions. Focus handling during relocation still needs a concrete
contract. User acceptance must follow the browser trial; passing automated tests
alone is not usability acceptance. The existing four-presentation trial remains
the verified baseline from §150, without implemented priority overflow.


<a id="gc-335-160"></a>
## 160 · Provisional toolbar implementation — 2026-10-23

Block ID: **GC-335-160**.

Owner authorized implementation: "Esatto, procedi con la prima versione nella
gallery: sempre menu e menuline, con gruppi, spacer, priorità, overflow e
scorrimento. Poi la proviamo." This extends the current bounded core trial and
its Python gallery; it does not create a new slot/toolbar grammar or authorize
publication. The owner explicitly retains provisional acceptance through use.

The implementation now provides the behavior designed in §155:

```python
bar = frame.top.menu(presentation="bar")
editing = bar.menuline(group=True, priority=80)
editing.menuline("documenti:save", parameters=dict(id=42))
editing.menuline("documenti:undo")
bar.spacer(size=12)
bar.spacer(flex=1)
search = bar.menuline(group=True, overflowable=False)
search.input(value="^document.query", live=True)
```

menuline(group=True) contains ordinary Source children as an indivisible unit;
it cannot also execute a command. priority defaults to 0; overflowable defaults
to True. A group's policy applies to the whole group, not independently to its
members. Lower priority transfers first, ties start at the end, and displayed
order remains Source declaration order. Hidden entries do not consume space.
Fixed spacer sizes remain; elastic space is released before overflow. Separators
are not migration candidates and orphan separators are suppressed.

The toolbar fills its assigned axis. Its inner strip scrolls if retained content
cannot fit. The continuation button remains outside that scrollable strip so the
overflow menu is reachable. The same policy uses height for vertical bars.

ToolbarOverflow owns only measurement and presentation. Named slots distribute
original light-DOM nodes into the strip or popup; it never clones controls or
changes their Source parent. Registered messages still identify the original
sender and frame recipient. Inputs retain Data bindings, value and identity.
Resize observation, scheduled measurement, popup event listeners and font-change
listeners are released on removal. Nested submenus use the existing menu engine.

Trial focus behavior: opening an input-only overflow focuses its input. When a
focused control moves during resize, its popup opens and focus is restored to the
same control; returning content closes an empty overflow. Escape restores focus
to the continuation button. This needs owner usability evaluation, especially
with complex controls and resize during editing; it is not stable-API acceptance.

The Python gallery lesson /pages/menu/03_toolbar now has explanations above four
exercises: priority overflow with retained search, movable search, retained groups
with scrolling, and a vertical bar. Sliders control width/height through Data.
The width is additionally bounded by the actual preview width. Search and business
commands demonstrate binding/local delivery, not server persistence or real export.

Verification: 51 targeted JS regressions pass, including seven new overflow/group
cases; four core Python authoring tests and two chapter tests/six page subtests
pass. Real Uvicorn/browser checks cover priority transfer, group identity, input
editing inside overflow and shared value updates, submenu delivery, retained-strip
scroll geometry, vertical overflow and return. This is bounded verification, not
a repeat of the extended release suite. User visibility preferences/sessionStorage
remain deferred; no storage format or customization API was added.


<a id="gc-335-165"></a>
## 165 · Toolbar labels and larger buttons — 2026-10-23

Block ID: **GC-335-165**.

Owner approved the three modes and gallery examples: "Sì, procedi con queste tre
modalità e aggiungi gli esempi nella gallery. Nel menu di overflow manteniamo
sempre icona ed etichetta affiancate", and requested larger toolbar icons with a
subtle hover background. Implemented using the existing menu/menuline components:

```python
bar = frame.top.menu(presentation="bar", labelPosition="below", iconSize=28)
bar.menuline("documenti:save")
group = bar.menuline(group=True, labelPosition="tooltip", iconSize=32)
group.menuline("documenti:undo")
group.menuline("documenti:save", labelPosition="beside")
```

labelPosition accepts beside (default), below (small caption beneath the icon)
or tooltip (caption hidden in the bar). iconSize defaults to 24 positive CSS
pixels; the comparison uses 28. An entry inherits through the nearest group to
the menu and may override either setting. Both settings accept read bindings.
Below captions use 11 px text. Toolbar buttons have a larger hit area, subtle
hover background, keyboard focus outline and checked/expanded feedback, on both
horizontal and vertical toolbars.

Popup/overflow rows always retain icon and full caption side by side at compact
menu scale, independently of toolbar settings. The registered/authored caption
is never cleared for presentation. Explicit tooltip text takes precedence over
the command tooltip, then the caption supplies the default tooltip. Accessible
button names retain the caption; explicit aria-label is preserved. Existing blank
captions in the toolbar lesson were migrated to labelPosition="tooltip".

The Python lesson starts with three comparative examples and explanations above
them. Core verifies inheritance, occurrence overrides, reactive settings and
presentation transitions without changing command identity or caption nodes.
Verification: 53 focused JS tests, five Python authoring tests and two chapter
tests/six subtests pass. Uvicorn/browser verifies 28 px toolbar icons, 11 px below
captions, hidden tooltip-mode text with retained title, subtle hover background,
command delivery and 14 px icon/visible-caption overflow rows in the current theme.
No release suite or publication was requested. Provisional usability evaluation
and optional sessionStorage customization remain unchanged from §160.


<a id="gc-335-170"></a>
## 170. Vertical icon rail and directional chevrons

Owner requested a gallery rail with large icons, tooltips, highlighted selection,
separators and overflow, plus a right-facing chevron in vertical bars and a
down-facing chevron in horizontal bars. Implemented with menu/menuline and the
existing orientation, labelPosition, iconSize, checked, priority and overflowable
attributes; no separate slotbar or selection API was introduced.

The new Python lesson uses 32 px icons, page Data for selection, an adjustable
180–500 px frame and retained Home/Tools entries. Other entries leave by priority.
The same selection appears in the horizontal comparison. Tools and overflow show
› vertically and ▾ horizontally; popup descendants keep their side-opening cue.
Tooltip-only submenu arrows sit at the edge without displacing the centered icon.
The internal vertical overflow button spans the rail width.

Verified: 53 targeted JS tests (including both overflow chevrons), five Python
core authoring tests, two chapter tests and seven page subtests pass. Uvicorn
browser checks confirm selection updates, side placement, height-driven overflow,
full captions inside overflow and retained selection when entries return. No
browser console errors occurred. This remains a provisional example for owner
usability review; optional user customization is deferred.


<a id="gc-335-175"></a>
## 175. SVG icons, entry styling and classic menu bar (2026-10-23)

Owner confirmation: “Sì, iconSrc per SVG” and “Per la voce, con icona configurabile a parte”.
The requested toolbar selection uses background only, with reduced horizontal
padding (5 px). The rail is narrower and uses actual SVG images. icon remains
text/emoji; iconSrc is a read-bound image URL on command surfaces, registry
metadata and resolver records. It uses img with empty alt, inside the decorative
icon span, never inline SVG markup. Caption supplies the accessible control name.
An explicit occurrence icon choice replaces the registered choice; within that
choice iconSrc takes precedence. Clearing a bound source returns to the icon text.
The icon image follows iconSize in toolbars and compact sizing in popup/overflow.
SVG keeps its authored colors; entry color does not recolor the image document.

Existing caption, class_, color, width and height describe the occurrence. The
internal control inherits the occurrence color and fills its explicit dimensions.
Classes remain on the Source host, respecting shadow boundaries. No label alias,
icon registry or independent icon width/height contract was introduced.

The gallery adds a classic File/Edit/View bar, nested File → Export → Image,
checked View state, disabled entries and a styled 140 × 52 px example with a
24 px emoji. The vertical rail demonstrates 32 px SVG images and background-only
selection. Source, Data bindings and named Logic remain the authoring mechanisms.

Verification: 57 focused JS tests, six Python authoring tests, one real collection
generation/update/verification test, two gallery tests and eight page subtests
pass. Uvicorn/browser confirms image loading, 32 px rail/14 px overflow icons,
selection without a tick, popup checked toggling, nested command delivery,
independent entry dimensions/color and no console errors. Owner usability review
remains pending; no publication or user-customization storage is included.


<a id="gc-335-overflow-indicator"></a>
### Overflow indicator refinement (2026-10-23)

The owner prefers a right-facing double chevron for toolbar overflow. Its SVG
button stays at the trailing edge and carries More commands as tooltip and
accessible name. It remains distinct from the single small chevron on submenu
buttons: down in horizontal toolbars, right in vertical bars and popup menus.
The icon change does not affect overflow priority, grouping or popup placement.
