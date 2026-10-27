# Is Gramlot a fit?

Document ID: **GC-020**.

<a id="gc-020-005"></a>

## 005 · Who it is for

Gramlot is for developers who describe an interface as a Page and keep its state
in Data Bags. Python is the first authoring path; JavaScript implements behavior
in the browser and is also available for Page authoring. You can build HTML/SVG
interfaces with form controls and components, reactive values, formulas,
controllers, endpoint calls and remote content. Start with [Try Gramlot](025-try.md).

The [Gramlot family](055-family.md) separates the core, examples and hosting
adapters. The experimental gramlot-poc is evidence for research, not the manual
for an application using these packages.

<a id="gc-020-010"></a>

## 010 · How you build an interface

**Source** is the tree of declarations: elements, attributes and behavior.
**Data** is the Bag of values used by those declarations. The **DOM** is what the
browser renders. A bound input reads and writes Data; other bindings update the
display. Application code changes Source or Data through Gramlot, without
scraping inputs or building a second DOM/state system.

The Page's `main` and exposed methods execute in the Python/JavaScript server,
or in the JavaScript Worker for a standalone page. `Logic` executes in the
browser. Each server call gets a fresh Page; Page fields are not session storage.
Learn this distinction before adding a server call.

Use `dataRpc` to receive a value, `remote` to replace an element's content with
Source, and `dataRemote` to load a Data value on demand when read. These mechanisms
have different trigger and cache rules; [Calling the server](098-server-calls.md)
and [Remote content and lazy Data](099-remote-content.md) explain them. Choosing an HTTP framework does not choose a database or ORM.

<a id="gc-020-015"></a>

## 015 · What is available

Available: Python/JavaScript Pages, typed Source, live HTML/SVG, Data bindings,
formulas/controllers and named Logic, bound form controls, input components with
validation, command buttons, border, tab and stack containers, `dataRpc`, declared
Source fragments, `remote`, the endpoint-backed `dataRemote` resolver, messages and
the application index.

Recipes, a record/form framework and database services are not provided.
The inputs collection includes endpoint-backed `dbSelect`/`dbComboBox`;
the application supplies their endpoint and database integration. An HTML form is not a record framework; the presence of
`dataRemote` does not imply every legacy resolver is available. See
[excluded declarations](097-data-binding.md#gc-095-085).

The examples teach supported slices, not every option or failure case. Read their
prerequisites and limits and check the selected environment. The reference starts
at [Classes and server adapters](090-classes-and-hosts.md); the learning route is
in [Try Gramlot](025-try.md).
