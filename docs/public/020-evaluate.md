# Is Gramlot a fit?

Document ID: **GC-020**.

> **Release status.** This page describes Gramlot **0.2.0 (HTML/SVG data
> binding)**, released on 2026-09-30 (GitHub release `v0.2.0`); the current patch release is **0.2.1**
> (2026-10-01: PyPI `gramlot`, npm and JSR `@gramlot/gramlot`). The previous release is **0.1.2**.
> Text without a *0.2.0* mark describes behavior that comes from 0.1.2.

<a id="gc-020-005"></a>

## 005 · Who it is for

Gramlot is aimed at Python developers who want to describe interactive application
interfaces using Python declarations. Forms and data-oriented interfaces are useful
places to evaluate the approach. Application authors work with shared controls and
state bindings; reusable browser behavior belongs in the JavaScript framework.

This repository is the Gramlot core. Release 0.2.0 (2026-09-30) provides native
HTML and SVG pages with a typed Source and HTML/SVG data binding: initial values
with `dataSetter`, `^`/`=` pointers and `==` expressions, formulas and controllers
with named logic, native controls and button controllers. Components (shared
controls such as labelled fields) start with 0.3.0. The core, its adapters and how
to choose among them are in [The Gramlot family](055-family.md). The earlier
`gramlot-poc` is a separate experimental runtime.

<a id="gc-020-010"></a>

## 010 · How you build an interface

A Source tree describes the interface. Data Bags hold application state. Bindings
connect controls to that state, controllers react to changes and events, and
resolvers provide data through explicit contracts. Shared components supply the
controls. Python is the primary authoring language; interaction runs in JavaScript
in the browser.

For example, a bound text field reads and writes a Data path. Other declarations
can react to that value without your application scraping the input or manually
wiring DOM events. Use the current implementation’s guide for executable examples.

A server adapter supplies hosting integration. Choosing a host and choosing a
database are separate decisions; core does not require a particular server or ORM.
Bindings, controllers, resolvers and shared controls describe the wider Gramlot
model; the current native HTML increment implements typed Source and live rendering,
not those higher-level application capabilities.

*0.2.0:* bindings and controllers are part of 0.2.0. Resolvers and shared
controls stay outside it; components are planned for 0.3.0.

<a id="gc-020-015"></a>

## 015 · What is available

This development checkout contains the native HTML foundation, Python and JS
Page authoring, typed Source, live DOM updates and seven locally verified Host
profiles. Recipes, reactive Data bindings, controllers, resolvers and shared
components are not part of this increment. The richer
[gramlot-poc](https://github.com/gramlot-org/gramlot-poc) has separate examples and
tests; its behavior is not a contract for this core. Check each integration's
documented scope before using it.

*0.2.0:* [Writing pages](095-writing-pages.md) describes the binding syntax,
its differences from legacy GenroPy and its exclusions.

Continue with [Try Gramlot](025-try.md).

For the foundation in this checkout, read [Classes and server adapters](090-classes-and-hosts.md) and [Writing pages](095-writing-pages.md). These guides describe the bounded native 0.1.0 contract.
