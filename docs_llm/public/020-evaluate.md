# Is Gramlot a fit?

Document ID: **GC-020**.

<a id="gc-020-005"></a>

## 005 · Who it is for

Gramlot targets Python authors of interactive forms, data tools and application interfaces. This repository implements a bounded native HTML/typed Source foundation, verified and owner-accepted as native 0.1.0. Shared controls and bindings are future work here; gramlot-poc contains richer experimental behavior. Allow for API changes.

<a id="gc-020-010"></a>

## 010 · How you build an interface

Source describes the interface; Data Bags hold state. Bindings, controllers, resolvers and shared controls are the wider model, not capabilities in this native HTML increment. Python authors the page and JavaScript runs browser rendering. A future bound input would read/write Data without application DOM wiring. Host and database choices remain independent.

<a id="gc-020-015"></a>

## 015 · What is available

This checkout contains Python/JS Page authoring, typed Source, live DOM updates and seven locally verified Host profiles. Recipes, reactive bindings, controllers, resolvers and shared components are deferred. The richer [gramlot-poc](https://github.com/gramlot-org/gramlot-poc) remains separate evidence, not a core contract. Integrations define their own scope; see [Try Gramlot](025-try.md). Owner acceptance covers this bounded native 0.1.0.

For the foundation in this checkout, read [Classes and server adapters](090-classes-and-hosts.md) and [Writing pages](095-writing-pages.md). These guides describe the bounded native 0.1.0 contract.
