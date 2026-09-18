# Gramlot

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/branding/gramlot-logo-dark.svg">
    <img src="assets/branding/gramlot-logo.svg" alt="gramlot" width="220">
  </picture>
</p>

Gramlot is a framework for declarative application interfaces authored primarily
in Python and executed by a JavaScript browser runtime.

This repository is in its clean bootstrap stage. It currently contains the
authoritative product constitution, product overview and port-review protocol.
It does **not** yet contain an installable package, browser runtime or supported
application API. Runtime claims begin only when reviewed code and its tests are
accepted here.

Start with:

- [Product constitution](docs/00-constitution.md)
- [Product overview](docs/01-overview.md)
- [Visual identity and graphic coordination](docs/015-visual-identity.md)
- [Common showcase contract](docs/010-showcase.md)
- [Port protocol](ports/README.md)
- [Documentation build and Read the Docs setup](docs/02-documentation.md)

The living laboratory and historical evidence remain in
[`gramlot-org/gramlot-poc`](https://github.com/gramlot-org/gramlot-poc). Code enters
this repository through bounded, reviewed ports; PoC behavior is evidence rather
than automatic product behavior.

Across Gramlot, `main` is the consolidated public reference for code, documentation,
configuration and other maintained artifacts. New work proceeds on `develop` and
reaches `main` after verification and acceptance, with contract, implementation,
tests and documentation aligned where applicable. Public documentation follows
`main` by default; development previews may follow `develop` separately.

Gramlot is licensed under the Apache License 2.0.
