# JS-owned components and collection extensions

Document ID: **GC-040**. Status: **tested experiment; proposed design, not an accepted API**.

[Concise counterpart](../../docs_llm/internal/040-js-owned-components.md).

<a id="gc-040-005"></a>

## 005 · Question and result

Owner direction, 2026-09-18: first test authoring components only in JavaScript,
with Python consuming JSON descriptions to expose controls, and investigate how
JavaScript collections can be organized and extended by third parties.

A bounded experiment succeeded using the actual PoC builder, Source transport,
component bases, Data Bags, bindings and formula runtime. Components are authored
in JS. A generic Python loader creates authoring methods from exported JSON,
without handwritten per-component wrappers or generated Python files. Python
still authors applications; it declares controls rather than executing browser code.
This fits constitution §§2–6 and does not establish a final base-class hierarchy.

The existing PoC already generates Python declarations and JS metadata from
`js/dom/src/components/builtin-components.json`. This experiment changes the
ownership direction: descriptions accompany JS implementations; JSON becomes an
exported artifact consumed by Python. Existing source generation is not removed.

<a id="gc-040-010"></a>

## 010 · Tested flow

```text
JS component: description + implementation
    → explicit collection export
    → JSON manifest
    → generic Python declaration loader
    → Python page authors Source and bindings
    → typed Source transport
    → JS runtime loads selected implementations and renders Source
```

The test page declares a standard control and a separately authored Acme control
bound to the same Data path, plus a formula and displayed result. Acme extends the
existing ControlElement with an email input type. Native edits update Data, the
other control and the formula. Subsequent Data writes update the controls.
No application-local DOM/event/state implementation substitutes for Gramlot.

The JSON contains descriptions, not executable implementations. Build-time export
runs explicitly selected trusted JS modules without a DOM. Python only reads JSON.
The runtime separately loads the corresponding JS implementation. The experiment
compares the selected descriptions to detect mismatched manifests; it does not
establish executable-code integrity or package compatibility.

<a id="gc-040-015"></a>

## 015 · Proposed collection organization

```text
js/src/
  components/                 # Base classes and component capabilities
  collections/
    inputs/
      index.js                # Explicit list of exported components
      text-box.js             # Implementation + public description
      number-box.js
    layout/
      index.js
      border-container.js
  catalog/                    # Export, validation and runtime registration

third-party-package/
  package.json
  src/
    index.js                  # Collection identity/version and exports
    email-field.js            # Implementation + description
  dist/
    collection.json           # Generated description for Python
    index.js                  # Corresponding browser implementation
    styles.css                # If required; packaging not tested yet
```

This is a proposed package layout, not a created production tree. Shared helpers
and base classes are reused rather than copied into each collection. A collection
is a distribution/registration unit; it is not a requirement that its components
share a single superclass or that all JavaScript objects become visual controls.
Controller, recipe and service catalogues need their own contracts before using
this manifest scheme for nonvisual objects.

The experiment uses scoped collection IDs (`@standard/fields`, `@acme/fields`),
explicit versions and distinct custom-element tags. Public Python names are flat
in the selected builder: `root.demoText(...)`, `root.acmeText(...)`. Namespacing
collections alone does not prevent Python-name or DOM-tag collisions. This probe
rejects collisions; aliases and deliberate overrides are unresolved design choices.

<a id="gc-040-020"></a>

## 020 · What a third-party collection needs

Proposed minimum contract:

1. Stable collection identity, package version and compatible manifest/runtime
   versions. Concrete compatibility ranges still need a design.
2. Explicit exported components with Python-compatible declaration names, distinct
   DOM tags, parameters, values, events and allowed-child descriptions as applicable.
3. Browser entry point and any styles/assets, matched to the manifest in the same
   release artifact. JSON alone cannot supply rendering or interaction.
4. Declared dependencies and activation rules; no dependence on incidental import
   order. Dependency resolution, cycles and lazy loading are not tested here.
5. Reuse of approved framework bases/contracts, including resource ownership and
   cleanup. Third parties should not need edits to a central framework catalogue.
6. Contract tests for exported metadata, Python authoring, binding behavior and
   lifecycle in the environments the package claims to support.

Explicit application selection determines what Python exposes. The tested loader
builds a new dialect class per selection and does not mutate the base builder.
The existing JS registry is process-global, so this experiment does not prove
multiple versions of a collection can coexist on one page or across applications.
Loading third-party JS remains execution of trusted installed code, not sandboxing.

<a id="gc-040-025"></a>

## 025 · Evidence and reproducibility

PoC baseline: `10478b57ce3f22e6445eb6b72eba343520cbebac`.
Local branch: `codex/js-component-manifest` in the isolated PoC worktree
`/private/tmp/gramlot-js-component-manifest`.
Experiment files: `experiments/js-component-manifest/` in that worktree.
No production runtime was changed or ported into the core. Experiment changes
are local and uncommitted; the baseline SHA does not contain them.

Run with the PoC dependency environment:

```sh
/Users/gporcari/Sviluppo/gramlot/gramlot-poc/.venv/bin/python \
  /private/tmp/gramlot-js-component-manifest/experiments/js-component-manifest/run.py
```

The runner explicitly selects the worktree Python source, exports the JSON,
checks Python loading, builds a Python Source payload and exercises it in JS.
This local worktree reuses the original checkout's installed JS dependencies.

Verified 2026-09-18 with Python 3.14 and Node 23.11.0:

- 4 Python tests: selection/base-builder isolation, metadata propagation, invalid
  schemas/selections/reserved names and cross-collection name/tag conflicts.
- 3 Node/jsdom tests: deterministic export without DOM, invalid metadata and
  manifest/runtime mismatch rejection, full Python-to-JS interaction path.
- 4 existing PoC component-alpha tests passed, covering registration, component
  lifecycle and native input integration.

This verifies a bounded feasibility claim, not a supported version matrix,
real-browser behavior, package installation or production manifest validation.

<a id="gc-040-030"></a>

## 030 · Next decisions and limitations

The experiment supports JS-owned definitions with a JSON-driven generic Python
loader. Before a bounded core port, settle the manifest schema and ownership of
metadata inheritance, collection selection, naming/alias rules, compatibility,
asset delivery and packaging of JSON for Python-only installations.

Parameters/events are carried as metadata; runtime parameter type/default checking,
Python signatures/stubs and editor completion are not implemented. Binding strings
need explicit treatment in any future type validator. Arbitrary JS implementation
semantics cannot be inferred from JSON.

Dynamic methods avoid per-component Python source generation. Generated stubs can
later improve IDE completion without becoming a second manually maintained source
of truth. Packaging must let Python consume shipped JSON without requiring Node
on the Python server. Dependency graphs, lazy loading, upgrades and conflicting
installed versions need further probes before third-party support is claimed.
