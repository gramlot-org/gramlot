"""Page written in Python whose data-elements call named logic (S07, source plan §4.9).

The companion ``calcolo_aux.js`` is the root group; the ``js_requires`` groups are
served by the test host of ``js/tests/bootstrap.test.js``, since the minimal
FileHost does not interpret ``requires`` (Q10).
"""
from gramlot import Page as Base


class Page(Base):
    title = "Named logic fixture"
    js_requires = "business,gui,gnrcomponents/settingmanager"

    def main(self, root):
        order = root.div(datapath="ordine")
        order.input(value="^.prezzo")
        order.dataFormula(".sconto", func="business.calcolaSconto", prezzo="^.prezzo")
        order.dataController(func="gui.scroll", _fired="^.vai")
        order.dataFormula(".totale", func="somma", a="^.a", b="^.b")
        order.dataController(func="gnrcomponents.settingmanager.load", _fired="^.carica")
