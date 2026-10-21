"""Python-first qualification fixture for the first loaded-Bag tree increment."""
import json
from pathlib import Path
from gramlot import GramlotBuilder
from genro_bag import Bag

root = Path(__file__).resolve().parents[3]
collections = [
    json.loads((root / f"src/gramlot/collections/{name}.json").read_text())
    for name in ("tree", "buttons")
]
builder = GramlotBuilder(collections=collections)
pane = builder.root.main(datapath="demo", node_label="pane", font_family="system-ui",
                         max_width="660px", margin="32px auto", padding="20px")
pane.h1("Bag tree")
pane.p("Loaded branches, live captions and selection connected to Data.")
pane.dataSetter(".nodes", Bag({
    "documents": {"readme": "Welcome", "notes": "Notes"},
    "settings": {"theme": "Light", "language": "English"},
    "status": "Ready",
}))
pane.dataSetter(".selection", None)
pane.tree(id="minimal-tree", node_label="tree", storepath=".nodes",
          labelAttribute="caption", hideValues=True, selectedPath="^.selection")
pane.p("Selected path")
pane.code("^.selection", id="selected-path")
actions = pane.div(margin_top="20px", display="flex", gap="8px", flex_wrap="wrap")
actions.button("Select notes", id="select-notes",
               action="this.SET('.selection', 'documents.notes')")
actions.button("Add document", id="add-document",
               action="this.SET('.nodes.documents.new_document', 'New text')")
actions.button("Rename caption", id="rename-caption",
               action="this.SET('.nodes.documents.notes?caption', 'Meeting notes')")
actions.button("Clear selection", id="clear-selection",
               action="this.SET('.selection', null)")
print(builder.to_tytx())
