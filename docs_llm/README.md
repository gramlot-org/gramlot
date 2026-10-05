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
the integration repositories (`gramlot-py-server`, `gramlot-js-server`) and
`gramlot-examples`, the archived repositories they replace, and the boundary between
agreed examples and historical PoC material.

[GC-086 · Repository map](internal/086-repository-map.md) and
[GC-087 · JavaScript layer boundaries](internal/087-javascript-layer-boundaries.md)
are historical records of the 0.1.2 tree and the 0.2.0 plan.

## Current status

Read [GC-070](internal/070-work-status.md) for the current status and the record of
each release. These execution records are historical:
[GC-135 · Artifact handoff](internal/135-release-handoff.md) and
[GC-130 · Ecosystem release review](internal/130-release-ecosystem-review.md) (0.1.0
delivery), the [0.1.0 plan](internal/110-0-1-0-readiness.md#gc-110-020) and its
seven-profile verification, the [earlier delivery plan](internal/088-0-1-0-plan.md),
[GC-094](internal/094-design-consolidation-plan.md) and the
[0.2.0 qualification](internal/215-qualification-0-2-0.md).

## For contributors

The Gramlot PoC and older `docs/context` handoffs are evidence/laboratory material, not an operating list.

Start with the [internal operating guide](internal/085-operating-guide.md).
Keep the [work status](internal/070-work-status.md) current. Follow the
[constitution](00-constitution.md) and the [documentation policy](005-documentation-policy.md).
The remaining internal guides retain decisions and investigation evidence;
the class inventory is not an implementation plan. Internal guides and concise
mirrors are excluded from the public Sphinx manual.

[Python/JavaScript Builder differences](internal/105-builder-python-js-differences.md): explicit exceptions, open gaps and corrected differences.

- [GC-145 · HTML/SVG examples, base theme and runner](internal/145-html-svg-examples.md) (historical; the examples live in gramlot-examples, constitution 11.56)
- [GC-150 · Base theme and HTML/SVG example guide](internal/150-example-guide.md) (historical, constitution 11.56)
