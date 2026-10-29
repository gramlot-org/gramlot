"""Core qualification fixture for the optional grouplets collection."""
from gramlot import Page as BasePage, source
from gramlot.collections.grouplets import mygramlot


class Details:
    def __init__(self, label):
        self.label = label

    @source
    def content(self, root, suffix=""):
        root.span(self.label + suffix)
        root.input(value="^.name")

    @source(auth="admin")
    def restricted(self, root):
        root.span("restricted")


class Page(BasePage):
    gramlots = [mygramlot]

    def __init__(self):
        self.left = Details("Left")
        self.right = Details("Right")

    def main(self, root):
        root.dataSetter("left.name", "Ada")
        root.dataSetter("right.name", "Grace")
        root.grouplet(id="left", datapath="left", remote="left.content", remote_suffix="!")
        root.grouplet(id="right", datapath="right", remote="right.content", remote_suffix="?")
