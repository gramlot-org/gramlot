# Is Gramlot a fit?

Document ID: **GC-020**.

> **Release status.** Describes **0.2.0 (HTML/SVG data binding)**: released 2026-09-30
> (GitHub `v0.2.0`; current patch **0.2.1**, 2026-10-01: PyPI `gramlot`, npm and JSR `@gramlot/gramlot`). Previous release:
> **0.1.2**. Unmarked text is behavior from 0.1.2.

<a id="gc-020-005"></a>

## 005 · Who it is for

Gramlot targets Python authors of interactive forms, data tools and application interfaces. This repository is the Gramlot core: release 0.2.0 (2026-09-30) has HTML/SVG pages with typed Source and HTML/SVG data binding (`dataSetter`, `^`/`=`/`==`, formulas/controllers with named logic, native controls, button controllers). Components start with 0.3.0. Core, adapters and how to choose: [The Gramlot family](055-family.md). gramlot-poc is a separate experimental runtime.

<a id="gc-020-010"></a>

## 010 · How you build an interface

Source describes the interface; Data Bags hold state. Bindings, controllers, resolvers and shared controls are the wider model, not capabilities in this increment. Python authors the page and JavaScript runs browser rendering. A future bound input would read/write Data without application DOM wiring. Host and database choices remain independent. *0.2.0:* includes bindings and controllers; resolvers and shared controls stay outside; components planned for 0.3.0.

<a id="gc-020-015"></a>

## 015 · What is available

This checkout contains Python/JS Page authoring, typed Source, live DOM updates and seven locally verified Host profiles. Recipes, reactive bindings, controllers, resolvers and shared components are deferred. The richer [gramlot-poc](https://github.com/gramlot-org/gramlot-poc) remains separate evidence, not a core contract. Integrations define their own scope; see [Try Gramlot](025-try.md). Owner acceptance covers this bounded native 0.1.0. *0.2.0:* binding syntax, differences from legacy and exclusions: [Writing pages](095-writing-pages.md).

For the foundation in this checkout, read [Classes and server adapters](090-classes-and-hosts.md) and [Writing pages](095-writing-pages.md). These guides describe the bounded 0.1.0 contract.
