"""Bag navigation and retained page tabs on the reusable five-region frame."""
from genro_bag import Bag
from .base import source
from .frame_page import FramePage


class IndexPage(FramePage):
    title = "Application"
    shell_id = "index"
    datapath = "index"
    navigation = None

    def main(self, root):
        navigation = self.navigation
        if not isinstance(navigation, Bag):
            raise TypeError("IndexPage.navigation must be a Bag")
        root.dataSetter(f"{self.datapath}.navigation", navigation)
        root.dataSetter(f"{self.datapath}.navigationSelection", None)
        root.dataSetter(f"{self.datapath}.active", None)
        root.dataSetter(f"{self.datapath}.opened", Bag())
        super().main(root)

    def left(self, pane):
        pane.set_attr({"width": "240px", "splitter": True, "drawer": True,
                       "drawer_label": "Navigation"})
        pane.tree(node_label="tree", storepath=f"{self.datapath}.navigation",
                  labelAttribute="title", hideValues=True, selectedPath=f"^{self.datapath}.navigationSelection")

    def center(self, pane):
        pane.tabContainer(node_label="tabs", height="100%",
                          selectedPage=f"^{self.datapath}.active")

    def behavior(self, shell):
        shell.dataController(func="indexMount", _onStart=True, shell_id=self.shell_id)

    @source
    def index_panel(self, pane, selection):
        self.panel(pane, selection.get_node("#0"))

    def panel(self, pane, node):
        pane.iframe(src=node.attr["url"], title=node.attr.get("title", node.label),
                    width="100%", height="100%", border=0)
