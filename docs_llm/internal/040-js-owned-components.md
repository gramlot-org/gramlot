# JS-owned components and collection extensions

Document ID: **GC-040**. Status: **tested experiment; proposed, not accepted API**.

[Full counterpart](../../docs/internal/040-js-owned-components.md).

<a id="gc-040-005"></a>

## 005 · Question and result

Owner 2026-09-18: test JS-only component definitions, JSON-driven Python authoring
and third-party collections. Successful bounded probe uses actual PoC runtime;
Python applications remain Python-authored. Existing JSON→generated Python/JS
catalogue remains unchanged; probe exports JS-owned metadata and loads it into a
generic Python builder dialect without generated or handwritten control wrappers.
Constitution §§2–6 respected; no final hierarchy approved.

<a id="gc-040-010"></a>

## 010 · Tested flow

JS implementation/description → explicit export → JSON → Python loader → Python
Source/bindings → typed transport → actual JS controls. Standard and Acme controls
share Data; Acme subclasses the existing ControlElement with email input type.
Native edits update Data, the other field and a Python-declared formula; Data
writes update controls. No substitute application UI/state machinery.
Trusted build-time JS runs without DOM; Python reads JSON only. Runtime separately
loads matching JS. Description comparison detects mismatch, not code integrity.

<a id="gc-040-015"></a>

## 015 · Proposed collection organization

Shared bases in components/, collections/<family>/index.js plus component modules
owning code/description, export/validation in catalog/. Third-party package ships
JS entry, generated collection.json and optional assets. Layout is proposed.
Collections organize distribution, not inheritance; nonvisual catalogues need
separate contracts. Scoped collection IDs/versions do not prevent flat Python
name or DOM-tag collisions. Probe rejects conflicts; aliases/overrides unresolved.

<a id="gc-040-020"></a>

## 020 · What a third-party collection needs

Proposed minimum: stable identity/version and compatibility rules; names/tags and
parameter/value/event/child metadata; matching JS/JSON/assets; explicit dependencies
and activation; shared lifecycle contracts; authoring/binding/lifecycle tests.
No framework catalogue edit should be necessary. Explicit Python selection makes
isolated dialects. JS registry remains global: coexisting versions not proven.
Third-party JS is trusted installed code, not sandboxed by JSON.

<a id="gc-040-025"></a>

## 025 · Evidence and reproducibility

PoC baseline `10478b57ce3f22e6445eb6b72eba343520cbebac`; local branch
codex/js-component-manifest, worktree /private/tmp/gramlot-js-component-manifest.
Uncommitted experiment in experiments/js-component-manifest/ is not in baseline.
Use PoC venv Python to run its run.py; worktree source is explicit and existing
JS dependencies reused. No production runtime modified or core code ported.
2026-09-18 Python 3.14/Node 23.11.0: 4 Python tests, 3 Node/jsdom tests, 4 existing
component-alpha tests passed. Tests cover selection/isolation, metadata/errors,
conflicts, no-DOM export, mismatch and actual cross-language binding/formula path.
Not real-browser, installation, version-matrix or production-validator evidence.

<a id="gc-040-030"></a>

## 030 · Next decisions and limitations

Settle schema, metadata inheritance, selection/names/aliases, compatibility and
JS/JSON/asset packaging before a core port. JSON must ship for Python installations
without Node. Parameters/events are metadata only: type/default validation, stubs,
IDE completion unimplemented; binding strings need explicit type treatment.
Generated optional stubs must derive from the same description. Dependencies,
lazy loading, upgrades and version coexistence still need probes. No general
third-party package support or arbitrary JS semantic inference is claimed.
