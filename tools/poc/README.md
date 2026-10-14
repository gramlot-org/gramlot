# Provisional inspector components

This area contains bounded `gramlot-poc-*` transfers under constitution 11.62.
They use the current Gramlot runtime. They do not import the PoC Application,
renderer or registry. The consuming tool explicitly loads each component.

The tree is `gramlot-poc-tree`, declared with:

```python
pane.webcomponent(code="gramlot-poc-tree")
```

The inspector JavaScript assigns its actual Bag to `storeBag`. Selection emits
`change` for a Source-declared `connect_onchange` named handler. The optional inspector composes this tree with `gramlot-poc-palette`,
`gramlot-poc-tabs` and `gramlot-poc-splitter`. They supply only the bounded shell
and layout; editing and breakpoint logic stay in the inspector’s Source/Data.
The separate Python/JS tree proof remains a contract fixture.

Contract and remaining sequence: [GC-195 §030](../../docs/internal/195-tools-inspector.md#gc-195-030).
Provenance and verification: [PORT-0006](../../ports/PORT-0006-inspector-components/README.md).
