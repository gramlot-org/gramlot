"""Transform authoring and callback isolation in Python rendering."""
import json
import unittest
from importlib.resources import files
from gramlot import GramlotBuilder


class TransformPaneTests(unittest.TestCase):
    def test_transform_keeps_children_and_consumes_named_callback(self):
        collection = json.loads(files("gramlot").joinpath("collections/layout.json").read_text())
        builder = GramlotBuilder(collections=[collection])
        pane = builder.root.transformPane(x="^x", y="^y", rotate="^rotate", zoom="^zoom", min=0.5, max=3, step=0.01, onEnd="scaleEnded")
        pane.img(src="photo.jpg")
        rendered = builder.render()
        self.assertIn("gramlot-transform-pane", rendered)
        self.assertIn("photo.jpg", rendered)
        self.assertNotIn("onEnd", rendered)

    def test_on_end_is_rejected_on_ordinary_html(self):
        builder = GramlotBuilder()
        builder.root.div(onEnd="scaleEnded")
        with self.assertRaisesRegex(ValueError, "onEnd is only supported on transformPane"):
            builder.render()
