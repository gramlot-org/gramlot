# Gramlot repository instructions

Before changing this repository, read `docs/00-constitution.md`,
`docs/01-overview.md` and `ports/README.md`. The constitution is authoritative.

- Owner 2026-09-24, constitution amendment 11.44: remove runner-specific core
  behavior; retain the provisional implementation in `examples/00-runner` using
  existing Source/Bag/lifecycle APIs. The bounded runner-local browser exception
  does not authorize new framework capabilities or general application bypasses.
  Report any blocking gap; future web components require a separate confirmed design.
- Owner 2026-09-24, constitution amendment 11.43: every decision requires explicit
  owner confirmation before implementation or recording it as approved. Agent
  proposals, interpretations, silence, working code and passing tests are not
  confirmation. Record the concrete decision, scope and owner's confirming words
  or a retrievable reference. Ask one decision question at a time and wait for
  the answer; address owner questions before proceeding. Do not ask again for an
  already explicit decision. An examples-only assignment permits changes only to
  examples; report missing framework capabilities and stop the affected work.
  It does not reopen a frozen framework release.
- Owner 2026-09-21, clarified 2026-09-22 by constitution §14: work only in Gramlot, including explicitly approved connected adapter work. Do not directly modify Builder JS or
  Bag JS repositories or their installed source copies. Read-only inspection is
  allowed. Report dependency defects for resolution in their owning projects;
  do not introduce Gramlot workarounds. Resume dependency edits only after an
  explicit owner instruction changing this boundary.
- Implement only the agreed primary path (constitution §13). Do not add compatibility
  layers, alternate representations, aliases, coercion/normalization fallbacks or
  permissive method checks for unsupported inputs without explicit owner approval.
  If the agreed class provides a method, call it directly; do not invent a substitute
  when it is missing. Gramlot rendering requires SourceBag and SourceBagNode.
- A missing capability is a defect/gap to report and fix in its owning library,
  not permission to add a consumer workaround. If the contract is unclear, stop
  that change and ask before implementing an alternative. Passing tests, old code,
  PoC behavior and hypothetical consumers are not authorization.
- Apply the same constraint to delegated agents. Review the actual diff for added
  paths and state before accepting it; each must trace to an agreed responsibility.
  Flag violations as defects, not optional cleanup. Only the owner may approve an
  exception or weaken this rule; record the exact scope in the constitution.
- Keep code and maintained technical documentation in English.
- Use docs/internal/070-work-status.md for current status and GC-110 for the sole 0.1.0 execution plan. GC-094, older handoffs, and PoC/context are historical evidence. Keep docs/internal/070-work-status.md and its docs_llm mirror current after
  meaningful progress, checks, scope changes or blockers. Proactively report
  status and the next action; distinguish implemented, verified and accepted work.
- Owner 2026-09-22: in user-facing progress and final replies, do not report Git
  status, diff summaries or lists of changed files unless asked. State the result
  and remaining work instead. If the objective is complete, say "Ho finito tutto";
  otherwise give a short remaining TODO list and ask for confirmation of the next
  phase before starting it. Do not ask again for a decision already given. When
  asked what a proposed repository change entails, name the actual change; do not
  seek write authorization if no source change is planned.
- Never pin or cap first-party Genro/Gramlot dependencies, including through
  lockfiles. Follow their upstream development/default branch or unconstrained
  package releases and refresh them during setup/update. Fix regressions instead
  of silently restoring old pins. This does not change third-party dependency policy.
- Author applications and examples in Python first. Small local JavaScript
  expressions are acceptable; reusable browser behavior belongs in Gramlot.
- Anything presented as a Gramlot application, example, demo or PoC must use
  Gramlot Source, Data Bags, bindings, controllers, resolvers and shared components.
  Expose missing framework capabilities instead of bypassing them with application
  DOM construction, manual event wiring, input scraping, ad hoc requests or a
  parallel state system.
- Keep the core independent of server and database technology. Follow the ownership
  boundaries in the constitution and do not introduce host dependencies into core.
- Check every request and proposed port against the constitution before implementation.
  Cite any conflict and stop the affected work until the owner adapts the request or
  approves an explicit amendment. LLMs and port reviewers cannot amend architecture.
- Record approved amendments in both `docs/00-constitution.md` and its `docs_llm`
  mirror, including date, changed principle and superseded decision.
- Treat `gramlot-poc` as evidence and a port-preparation laboratory. Do not bulk-copy
  it or promote prototype behavior without a bounded port and destination review.
- Persist destination feedback under the port ID. Apply reusable feedback to later
  ports; do not erase rejected approaches or unresolved differences from the record.
- Across Gramlot, use `main` as the consolidated public reference for code,
  documentation, configuration and all other maintained artifacts. Keep new work
  on `develop` until verified and accepted, then consolidate it into `main`.
  Public documentation follows `main` by default; development previews may follow
  `develop` separately. This policy does not authorize publication or deployment.
- Update paired `docs` and `docs_llm` documents together. The compact version must
  remain human-readable and preserve decisions, constraints, status and open points.
- Follow `docs/005-documentation-policy.md` across Gramlot: three-digit guide
  prefixes initially spaced by five, mirrored paths, repository namespaces and
  shared stable document/block IDs with explicit anchors. Preserve IDs across moves,
  update links and record legacy migration gaps. Core uses GC, Django GD, FastAPI GF.
- Use the classic Read the Docs theme for all Gramlot documentation sites:
  `sphinx_rtd_theme` with Sphinx, `readthedocs` with MkDocs. Follow constitution §9;
  retain project logos/status notices and the default blue/dark/light appearance.
- Do not claim APIs, runtime behavior, compatibility, releases or verification that
  the repository does not contain and test.
- Do not publish packages, create releases or deploy applications without explicit
  owner authorization.

No formal Live Object Tree semantics have been approved. Do not infer or invent them.

- Owner 2026-09-17: public gramlot-poc, gramlot-standalone, gramlot-flask and
  gramlot-nodejs are authorized; this supersedes earlier local/private restrictions.
  Source pushes do not authorize package releases or application deployments.

- Owner 2026-09-24, constitution 11.46: standalone WorkerTransport, WorkerHost and
  startup belong to gramlot-minimal. Bounded connected edits there are authorized
  for this transfer. Core retains shared Host/Page execution, Source and rendering.
