# Gramlot collection generator

Project-local build dependency for collection authors, invoked by Python's
`gramlot-builder build|check` through `@gramlot/builder/cli`. Node 22, 24 or 26 is
required. Consumers of prepared Python packages do not install this tool.

The generator reads one protocol-1 JSON request from stdin, writes one result to
stdout and diagnostics to stderr. It prepares only the caller-provided staging
directory; Python validates candidates and owns final replacement and recovery.

See [the collection guide](../../docs/future/325-how-to-extend-gramlot.md#gc-325-150)
for configuration, package imports, external dependencies, resource hosting and
exit codes. This source package is not a statement of publication on npm.
