"""A reusable five-region page, composed entirely through Source hooks."""
from .base import Page


class FramePage(Page):
    """Override region hooks to configure and populate their contentPane."""

    shell_id = "frame"
    datapath = None

    def main(self, root):
        shell = root.div(id=self.shell_id, datapath=self.datapath, class_="frame-page", height="100vh",
                         display="flex", flex_direction="column", min_height=0)
        frame = shell.borderContainer(node_label="frame", height="100%", flex="1",
                                      min_height=0)
        for region in ("top", "bottom", "left", "right", "center"):
            hook = getattr(self, region, None)
            if hook is not None:
                pane = frame.contentPane(region=region, node_label=region)
                hook(pane)
        self.behavior(shell)

    def center(self, pane):
        """The center exists even when a derived page leaves it empty."""

    def behavior(self, shell):
        """Optional inherited Page behavior, independent of region contents."""
