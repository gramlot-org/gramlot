"""Independent Python qualification for the card's ordinary remote Source body."""
from gramlot import Page as BasePage, source
from gramlot.collections.grouplets import mygramlot


class Page(BasePage):
    gramlots = [mygramlot]

    def main(self, root):
        root.dataSetter('address.city', 'London')
        root.dataSetter('address.ui.closed', False)
        root.dataSetter('address.ui.checked', False)
        root.groupletCard(title='Delivery', datapath='address', collapsible=True,
            collapsed='^.ui.closed', checkbox='^.ui.checked', chromeSide='left',
            remote='address_fields')

    @source
    def address_fields(self, root):
        root.input(value='^.city')
