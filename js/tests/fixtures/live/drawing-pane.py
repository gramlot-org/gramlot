"""Core qualification fixture for the shared image annotation component."""
from urllib.parse import quote

from genro_bag import Bag
from gramlot import Page as BasePage
from gramlot.collections.drawing import mygramlot as drawing


class Page(BasePage):
    title = 'Image annotation qualification'
    gramlots = [drawing]

    def main(self, root):
        pane = root.main(max_width='960px', margin='20px auto', padding='12px')
        pane.h1('Image annotation')
        pane.p('Choose a tool and draw on the image. With Text, click the image to write or an existing label to edit it. Use Select to move or delete an annotation.')
        image = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="#e6ecf1"/><circle cx="400" cy="250" r="150" fill="#cbd9e5"/><path d="M100 250H700M400 40V460" stroke="#95a6b5" stroke-width="3"/></svg>'
        pane.dataSetter('drawing.image', 'data:image/svg+xml,' + quote(image))
        pane.dataSetter('drawing.annotations', Bag())
        pane.drawingPane(image='^drawing.image', annotations='^drawing.annotations',
                         id='drawing-pane', height='600px')
