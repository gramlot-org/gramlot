"""The Python-authored drawing fixture uses the shared prepared collection."""
import json
import runpy
from pathlib import Path

from gramlot import GramlotBuilder
from gramlot.collections.drawing import mygramlot


def test_fixture_authors_bound_drawing_pane():
    root = Path(__file__).resolve().parents[1]
    page = runpy.run_path(str(root / 'js/tests/fixtures/live/drawing-pane.py'))['Page']()
    grammar = json.loads(mygramlot.resource(mygramlot.grammar).read_text())
    dependencies = [json.loads((root / f'src/gramlot/collections/{name}.json').read_text())
                    for name in ('tree', 'inputs', 'layout')]
    builder = GramlotBuilder(collections=[*dependencies, grammar])
    page.main(builder.root)
    wire = builder.to_tytx()
    assert 'drawingPane' in wire
    assert '^drawing.image' in wire
    assert '^drawing.annotations' in wire
