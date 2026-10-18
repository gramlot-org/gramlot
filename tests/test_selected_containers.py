"""Portable selection grammar and the activated callback's HTML boundary."""
import json
from pathlib import Path
import unittest

from gramlot import GramlotBuilder

LAYOUT = json.loads((Path(__file__).parents[1] / "src/gramlot/collections/layout.json").read_text())


class SelectedContainersTests(unittest.TestCase):
    def test_case_insensitive_builders_accept_both_selection_bindings_and_strip_close_code(self):
        for name in ("TABCONTAINER", "stackContainer"):
            with self.subTest(name=name):
                builder = GramlotBuilder(collections=[LAYOUT])
                container = getattr(builder.root, name)(selectedPage="^page", selected="^index")
                container.CONTENTPANE(pageName="one", title="One", closable=True, onClose="return false").p("Content")
                result = builder.render()
                self.assertIn("Content", result)
                self.assertNotIn("onClose", result)
                self.assertNotIn("return false", result)

    def test_on_close_outside_a_selection_panel_is_rejected(self):
        builder = GramlotBuilder()
        builder.root.div(onClose="return true")
        with self.assertRaisesRegex(ValueError, "only supported on a tab/stack panel"):
            builder.render()

    def test_tab_presentation_enum_grammar_and_reactive_panel_metadata(self):
        builder = GramlotBuilder(collections=[LAYOUT])
        tab = builder.root.tabContainer(tabMode="^mode", tabPosition="^position")
        tab.contentPane(title="Messages", icon="✉", badge="^unread", badge_color="crimson")
        spec = LAYOUT["elements"]["tabContainer"]["_meta"]["gramlot_component"]["parameters"]
        self.assertEqual(spec["tabMode"]["enum"], ["tabs", "underline"])
        self.assertEqual(spec["tabPosition"]["enum"], ["top", "bottom", "left", "right"])
        self.assertIn("Messages", builder.render())
