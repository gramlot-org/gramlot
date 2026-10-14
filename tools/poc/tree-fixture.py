"""Python-authored first-slice qualification page, not a gallery example."""
from gramlot import GramlotBuilder

builder = GramlotBuilder()
pane = builder.root.section(node_label="pane", class_="inspector-editor")
bar = pane.div(class_="tabs")
bar.button("Data", type="button", connect_onclick="inspector.data")
bar.button("Source", type="button", connect_onclick="inspector.source")
pane.webcomponent(code="gramlot-poc-tree", node_label="tree",
                  connect_onchange="inspector.select", **{"connect_ontree-action": "inspector.action"})
pane.p("^selection", class_="path")
print(builder.to_tytx())
