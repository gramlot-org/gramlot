import json
from pathlib import Path
import unittest
from gramlot import GramlotBuilder

CONTROLS = json.loads((Path(__file__).parent / 'fixtures/collections/controls.json').read_text())


class CollectionTests(unittest.TestCase):
    def test_complete_html_collection_and_declared_structure(self):
        builder = GramlotBuilder()
        builder.root.canvas('fallback', id='canvas')
        builder.root.template().span('template body')
        with self.assertRaises((ValueError, KeyError)):
            builder.root.ul().div('not a list item')
        with self.assertRaises((ValueError, KeyError)):
            builder.root.br().span('invalid')

    def test_future_collection_validates_exported_signature_and_parent(self):
        builder = GramlotBuilder(collections=[CONTROLS])
        panel = builder.root.ratingPanel(title='Ratings')
        node = panel.rating(amount=4, code='IT', caption='Score')
        self.assertEqual(node.node_tag, 'rating')
        self.assertEqual(node.attr['_meta']['render_tag'], 'gramlot-rating')
        for attrs in [dict(code='IT'), dict(amount=11, code='IT'),
                      dict(amount='4', code='IT'), dict(amount=4, code='invalid'),
                      dict(amount=4, code='IT', mode='other'),
                      dict(amount=4, code='IT', extra=True)]:
            with self.assertRaises((ValueError, TypeError)):
                panel.rating(**attrs)
        with self.assertRaises(ValueError):
            builder.root.rating(amount=1, code='IT')
        with self.assertRaises((ValueError, TypeError)):
            builder.root.statusText('ready')
        builder.root.statusText('ready', required_label='Status')

    def test_extra_collection_is_instance_local_and_load_failure_atomic(self):
        left, right = GramlotBuilder(), GramlotBuilder()
        left.load_collection(CONTROLS)
        left.root.statusText('ready', required_label='Status')
        with self.assertRaises(AttributeError):
            right.root.statusText('ready', required_label='Status')
        invalid = json.loads(json.dumps(CONTROLS))
        invalid['elements']['statusText']['inherits_from'] = 'missing'
        with self.assertRaises((ValueError, TypeError)):
            left.load_collection(invalid)
        left.root.statusText('still ready', required_label='Status')
