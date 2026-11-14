from gramlot import Page as BasePage
from triangle_block import triangle


class Page(BasePage):
    def main(self, root):
        pane = root.div(datapath="example", class_="triangle-body")
        triangle(pane, 8, 6, "#3366cc")
