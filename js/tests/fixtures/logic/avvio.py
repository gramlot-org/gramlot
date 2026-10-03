"""Page written in Python whose formula runs at ``_init`` through its companion (S08).

The ``Logic`` export of ``avvio.js`` beside it is served by the minimal FileHost as the root
group (its ``Page`` export stays unused), and it counts its calls on
``globalThis.gramlotSentinel``: opening the page on a host runs nothing.
"""
from gramlot import Page as Base


class Page(Base):
    title = "Provider fixture"

    def main(self, root):
        root.div("^pronto", id="pronto")
        root.dataFormula("pronto", func="prepara", base="=base", _init=True)
        root.dataSetter("base", "ok")
