# Gramlot repository instructions

Before changing this repository, read `docs/00-constitution.md`,
`docs/01-overview.md` and `ports/README.md`. The constitution is authoritative.

- Keep code and maintained technical documentation in English.
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
