"""Test collection exported by the real generic decorator, not a Gramlot schema."""
from typing import Annotated, Literal
from genro_builders import BuilderBase
from genro_builders.builder import element, Range, Regex


class Controls(BuilderBase):
    _name = 'collection_test_controls'

    @element(sub_tags='rating[0:2]', _meta={'render_tag': 'section'})
    def ratingPanel(self, title: str = ''): ...

    @element(parent_tags='ratingPanel', _meta={'render_tag': 'gramlot-rating'})
    def rating(self, amount: Annotated[int, Range(ge=0, le=10)],
               code: Annotated[str, Regex('[A-Z]{2}')],
               mode: Literal['compact', 'full'] = 'compact', caption=''): ...

    @element(_meta={'render_tag': 'gramlot-status'})
    def statusText(self, node_value: str, required_label, optional_label=None): ...


if __name__ == '__main__':
    from pathlib import Path
    Controls.to_grammar(Path(__file__).with_suffix('.json'))
