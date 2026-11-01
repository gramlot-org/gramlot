from gramlot import Page as BasePage
from gramlot.collections.uploads import mygramlot as uploads
from genro_bag import Bag
class Page(BasePage):
    gramlots = [uploads]
    def main(self, root):
        root.dataSetter('queue', Bag())
        root.uploader(id='preview-uploader', operation='unused', storepath='queue', multiple=True, autoUpload=False)
