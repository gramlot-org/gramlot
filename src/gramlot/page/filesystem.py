"""Reusable filesystem tree Source; the host owns directory access."""
from genro_bag import Bag


def file_system_tree(parent, *, datapath, **attributes):
    """Use FileSystemLogic and set requestedRoot to open an allowed host directory."""
    pane = parent.div(datapath=datapath, class_="gramlot-filesystem", **attributes)
    for name, value in {"store": Bag(), "root": None, "requestedRoot": None,
                        "selectedPath": None, "status": ""}.items():
        pane.dataSetter(f".{name}", value)
    pane.dataController(func="fileSystemMount", _onBuilt=True)
    pane.dataController(func="fileSystemOpen", root="^.requestedRoot")
    pane.tree(storepath=".store", selectedPath="^.selectedPath", labelAttribute="caption",
              hideValues=True, class_="gramlot-filesystem-tree")
    pane.div("^.status", role="status", class_="gramlot-filesystem-status")
    return pane
