# Documentation map

## For application developers

Start with [Classes and server adapters](public/090-classes-and-hosts.md), then
[Writing pages](public/095-writing-pages.md) and [Extending Gramlot](public/100-extensions.md).
These chapters describe the released core and explicitly mark gaps. They describe
release **0.2.0 (HTML/SVG data binding)**, released on 2026-09-30; each chapter marks
0.2.0 behavior. The repository README states the current release.
[Evaluate](public/020-evaluate.md), [Try](public/025-try.md) and
[Quality](public/030-quality.md) distinguish the core from the experimental PoC.

## Repository map

[GC-140 · Agreed integrations and examples](internal/140-integrations-and-examples.md):
the six integration repositories, Hello World profiles, local/publication status
and the boundary between agreed examples and historical PoC material.

[Current repository map](internal/086-repository-map.md). The agreed target JavaScript
ownership boundaries and the local split are recorded in
[GC-087](internal/087-javascript-layer-boundaries.md).

## Current execution

[GC-135 · Artifact handoff](internal/135-release-handoff.md): package set, local archive installation, verification and publication boundary.

[GC-130 · Ecosystem release review](internal/130-release-ecosystem-review.md): architecture assessment, current release-alignment findings and versioned-artifact checks.

[Current 0.1.0 plan](internal/110-0-1-0-readiness.md#gc-110-020). Read [GC-070](internal/070-work-status.md) for the current checkpoint. [GC-094](internal/094-design-consolidation-plan.md) is historical.
The [earlier delivery plan](internal/088-0-1-0-plan.md) is historical evidence;
GC-110 records the current review and seven-profile verification.

## For contributors

The Gramlot PoC and older `docs/context` handoffs are evidence/laboratory material, not the 0.1.0 operating list.

Start with the [internal operating guide](internal/085-operating-guide.md).
Keep the [work status](internal/070-work-status.md) current. Follow the
[constitution](00-constitution.md) and the [documentation policy](005-documentation-policy.md).
The remaining internal guides retain decisions and investigation evidence;
the class inventory is not an implementation plan. Internal guides and concise
mirrors are excluded from the public Sphinx manual.

[Python/JavaScript Builder differences](internal/105-builder-python-js-differences.md): explicit exceptions, open gaps and corrected differences.

- [GC-145 · HTML/SVG examples, base theme and runner](internal/145-html-svg-examples.md) (historical; the examples live in gramlot-examples, constitution 11.56)
- [GC-150 · Base theme and HTML/SVG example guide](internal/150-example-guide.md) (historical, constitution 11.56)
