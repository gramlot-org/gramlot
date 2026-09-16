# 010 · gramlot.showcase

Document ID: **GC-010**. [Concise counterpart](../docs_llm/010-showcase.md).

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
4. The center renders the selected page. Common page selection is an in-application
   operation; returning to a common example preserves its Data within that session.
5. A bottom bar exposes Show source for the current page and the shared Inspector
   icon. Inspector inspects the live Source and Data. Source shows the actual
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
