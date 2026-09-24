from genro_tytx import to_tytx
"""Emit genuine Python TYTX to the Node contract tests."""
import json
from gramlot import GramlotBuilder

builder = GramlotBuilder()
root = builder.root
panel = root.div("homer", id="panel")
panel.span("bart", id="child")
root.input(value="marge", id="name")
reference = builder.reference(panel, "dom")
print(json.dumps({"wire": to_tytx(builder.source), "reference": reference}))
