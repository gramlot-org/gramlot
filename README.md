# Gramlot

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
- [Common showcase contract](docs/010-showcase.md)
- [Port protocol](ports/README.md)

The living laboratory and historical evidence remain in
[`gramlot-org/gramlot-poc`](https://github.com/gramlot-org/gramlot-poc). Code enters
this repository through bounded, reviewed ports; PoC behavior is evidence rather
than automatic product behavior.

`main` is the consolidated line. New development proceeds on `develop` and reaches
`main` only after its contract, implementation, tests and documentation agree.

Gramlot is licensed under the Apache License 2.0.
