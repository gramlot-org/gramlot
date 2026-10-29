"""Python-first resident Bag grid qualification; no application DOM or alternate store."""
import json
from datetime import date
from pathlib import Path

from genro_bag import Bag
from gramlot import GramlotBuilder

repo = Path(__file__).resolve().parents[3]
collection = json.loads((repo / "src/gramlot/collections/grid.json").read_text())
builder = GramlotBuilder(collections=[collection])
pane = builder.root.main(datapath="demo", node_label="pane",
                         max_width="960px", margin="24px auto", padding="var(--gramlot-space-4)")
pane.h1("Grid · Bag, values and attributes")
pane.p("Read-only Bag rows. The header stays outside the scrolling body; themes supply the presentation.")
themes = pane.div(display="flex", flex_wrap="wrap", gap="var(--gramlot-space-3)", margin_bottom="var(--gramlot-space-4)")
for theme in ["base", "compact", "mimi", "joanna"]:
    for mode in ["light", "dark"]:
        themes.a(f"{theme.title()} · {mode}", href=f"/?theme={theme}&mode={mode}")

values, attributes = Bag(), Bag()
for index in range(60):
    fields = dict(code=f"P{index + 1:03}", description=f"Item {index + 1}",
                  quantity=index + 1, price=12.5 + index, available=index % 3 != 0,
                  updated=date(2026, 10, 28))
    values.set_item(f"r{index}", Bag(fields))
    attributes.set_item(f"r{index}", None, **fields)
pane.dataSetter(".values", values)
pane.dataSetter(".attributes", attributes)

for mode in ["values", "attributes"]:
    pane.h2(f"Rows stored as {mode}", margin_top="var(--gramlot-space-4)")
    grid = pane.grid(id=f"grid-{mode}", node_label=mode, storepath=f".{mode}",
                     rowMode=mode, height="250px")
    struct = grid.struct()
    struct.column("code", name="Code", width="90px")
    struct.column("description", name="Description", width="210px")
    amounts = struct.colgroup("amounts", name="Amounts")
    amounts.column("quantity", name="Quantity", dtype="L", width="100px")
    amounts.column("price", name="Price", dtype="N", format="0.00", width="120px")
    struct.column("available", name="Available", dtype="B", width="100px", align="center")
    struct.column("updated", name="Updated", dtype="D", format="short", width="130px")

actions = pane.div(display="flex", gap="12px", margin_top="20px")
actions.button("Update first row", id="update-row", action="this.SET('.values.r0.price', 99.5); this.SET('.attributes.r0?price', 99.5)")
actions.button("Remove last row", id="remove-row", action="this.GET('.values').popNode('r59'); this.GET('.attributes').popNode('r59')")
print(builder.to_tytx())
