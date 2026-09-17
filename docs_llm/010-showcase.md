# 010 · gramlot.showcase

Document ID: **GC-010**. [Expanded counterpart](../docs/010-showcase.md).

<a id="gc-010-005"></a>
## 005 · Identity and rollout

`gramlot.showcase` is the common, growing demonstration catalogue for Gramlot.
This is a product name, not a claim that a Python import or published package
already exists. The owner chose FastAPI as the first implementation on 2026-09-16.
Other hosts follow after the initial implementation is reviewed. Initial target
hosts are FastAPI, Django, Flask, Genro ASGI and Node.js.

Showcase has the same common pages, interactions and visual identity in each host.
Each host also retains its own examples, such as Bakery, Polls or Microblog.
Those applications do not become common showcase entries merely by being hosted
in the same repository. The catalogue grows through explicit additions with
behavior and source examples that can be verified in each supported environment.

<a id="gc-010-010"></a>
## 010 · Presentation contract

Use real Gramlot Source and shared components:

1. A borderContainer provides the common frame.
2. The header displays the actual Gramlot logo, `gramlot.showcase`, and the active
   hosting mode. Identify SPA examples accurately.
3. A left tree lists pages. Distinguish common Showcase entries from host-specific
   examples. Do not display fictitious available examples for an unconfigured host.
4. The center uses a Gramlot tabContainer with closable tabs. Each example is
   an iframe declared in Source, loading its own Gramlot application, Source and
   Data Bags. Selecting an already open page activates that tab without replacing
   its iframe. Closing a tab destroys its iframe; reopening starts a fresh instance.
5. Each center page has discreet Show source and shared Inspector controls at
   its own bottom, not in a toolbar belonging to the primary frame. The Inspector belongs to the iframe application and sees only that example's live Source and Data, not sibling pages or the navigation shell. Source shows the actual
   authoring code; it must not be a separately maintained illustrative snippet.
6. Keep the frame and common examples visually consistent, polished and usable at
   narrow viewport widths. Preserve accessible labels and keyboard interaction.

The framework owns rendering, event integration and state binding. Applications
must not implement their own DOM, fetch paths, event listeners or parallel state
systems to imitate these components. Missing capabilities are explicit framework
work, not host-specific UI shortcuts.

<a id="gc-010-015"></a>
## 015 · Code and ownership

Keep common page declarations and their catalogue independent of host and database
libraries. FastAPI owns mounting, serving and host-specific integration only. The
first implementation may be incubated in gramlot-fastapi with these boundaries;
its location does not grant FastAPI ownership of shared framework capabilities.
A future reviewed extraction establishes the shared distribution/import contract.
Do not invent that API or introduce a dependency from Gramlot core to an adapter.

Use readable page classes and small, named methods for shell, navigation, content,
footer and source presentation. Separate example logic from the common frame.
Apply the same organisation to JavaScript authoring. Python is primary; the
approved Node PoC exception allows an equivalent JavaScript implementation.

The long-term intent is one shared Python implementation consumed by Python hosts,
with a JavaScript equivalent preserving the common catalogue and observable
behavior. Avoid separate copies that silently diverge. The distribution mechanism
and cross-language contract are not yet implemented or accepted by this document.

<a id="gc-010-020"></a>
## 020 · Acceptance and status

For the first slice, demonstrate basic binding, an action and a reactive formula
without requiring a database. Verify page selection and state retention, source
selection and open/close, Inspector open/close, host identity and logo rendering.
Tests must exercise real Gramlot runtime behavior; a generated HTML shell alone
is insufficient. Keep host-specific demos working. Record the exact verified host
and runtime revision, limitations and untested hosts.

Status: owner-approved direction; FastAPI implementation is the first candidate.
No cross-host equivalence, core package, published release or other-host rollout
is claimed. Future ports preserve catalogue semantics, frame, source provenance
and Inspector behavior. Host-specific examples can differ and remain clearly
separate. Publication and deployment need separate owner authorization.

Owner clarification, 2026-09-16: iframe application isolation supersedes the
initial shared-runtime stackContainer candidate. The outer frame owns navigation
and tabs only. Each example owns its source viewer and discreet Inspector lens
at the bottom of its own center document. Same-origin iframes provide runtime
separation, not a hostile-code security boundary.

Inside each iframe, use a resizable Gramlot split layout: the running example on
the left and its actual Python source on the right, initially visible. A discreet
Show source toggle hides or restores the source pane. The child Inspector remains
local to that iframe; source presentation must not bring other examples into its
Source or Data trees.

Owner convention, 2026-09-16: showcase examples put application data below
`data_root` and identify their live Source container as `source_root`. Inspector
configuration uses the independent options `data_root` and `source_root` to select
those origins. The scoped views edit the original live Bags. Auxiliary source
viewer/toolbar state and declarations stay outside both origins. Without explicit
origins the shared Inspector retains whole-application behavior; an invalid
explicit origin must not silently expose the whole application.


<a id="gc-010-025"></a>
## 025 · Teaching progression and shared ownership

Owner clarification, 2026-09-16: teach one concept per short English example.
Group the navigation tree into a progressive course: Hello world and binding;
labels and reactive label attributes; input widgets; value formatting and masks;
labeled containers and formlet; validation; a small combined form. Explain only
implemented behavior, including when a field commits its edited value. Do not
confuse a display mask with an input constraint.

The common base prepares the example workspace before calling the author's
`main(self, root)`. That root is already the example's scoped container. The
first lesson should contain only `root.h1('Hello world')`; workspace setup,
source viewing and Inspector configuration are not lesson code. Show the real
executed authoring method, not an independently maintained abbreviated snippet.

Common declarations, lesson order, text and visual resources belong to Gramlot,
not FastAPI. Python hosts should consume the same implementation with minimal
hosting configuration. Node.js lessons use actual JavaScript authoring with the
same learning objectives. Standalone Python-derived and JavaScript versions are
requested delivery targets. This direction does not claim those targets are
already implemented or verified; document each mode's actual status separately.
