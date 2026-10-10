from gramlot import Page as BasePage
from gramlot import endpoint, source


class Page(BasePage):
    title = "Contract fixture"

    def main(self, root):
        panel = root.div("homer", id="panel")
        panel.span("bart", id="child")
        root.input(value="marge", id="name")
        root.p("<literal text>", id="literal")

    @source
    def check_fragment(self, root, text="check"):
        root.span(text)

    @source
    def check_fragment_auth(self, root):
        root.span("check-public")
        root.div(auth="admin").span("check-refused")

    @endpoint
    def check_endpoint(self, value):
        return value

    @endpoint(auth="admin")
    def check_endpoint_auth(self):
        return "allowed"

    @endpoint
    def check_endpoint_raise(self):
        raise ValueError("check")
