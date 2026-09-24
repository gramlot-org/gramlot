from gramlot import Page as BasePage
from gramlot import source


class Page(BasePage):
    title = "Native HTML contract fixture"

    def main(self, root):
        panel = root.div("homer", id="panel")
        panel.span("bart", id="child")
        root.input(value="marge", id="name")
        root.p("<literal text>", id="literal")

    @source
    def details(self, root, name="remote"):
        root.div(name)
