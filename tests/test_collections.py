import json
from pathlib import Path
import unittest
from gramlot import GramlotBuilder

CONTROLS = json.loads((Path(__file__).parent / 'fixtures/collections/controls.json').read_text())
# Shared with js/tests/collections.test.js: a second collection that redefines statusText (Phase 18, ASTRA-03).
REDEFINED = json.loads((Path(__file__).parent / 'fixtures/collections/controls-redefined.json').read_text())


class CollectionTests(unittest.TestCase):
    def test_malformed_signature_parameters_report_their_path(self):
        for component in (False, True):
            for malformed in (42, None, 'parameter', []):
                with self.subTest(component=component, parameter=malformed):
                    builder = GramlotBuilder()
                    invalid = json.loads(json.dumps(CONTROLS))
                    entry = invalid['elements']['statusText']
                    if component:
                        entry['_meta']['component'] = True
                    entry['attributes']['parameters'].append(malformed)
                    index = len(entry['attributes']['parameters']) - 1
                    with self.assertRaises(ValueError) as error:
                        builder.load_collection(invalid)
                    self.assertIn(
                        f'statusText.attributes.parameters[{index}]: must be an object',
                        str(error.exception),
                    )
                    builder.root.div('still valid')
                    with self.assertRaises(AttributeError):
                        builder.root.statusText('not registered', required_label='Status')

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

    def test_a_later_collection_replaces_a_named_declaration_whole(self):
        """Phase 18 (ASTRA-03): the rule of genro-builders JS, the same fixture as js/tests/collections.test.js."""
        builder = GramlotBuilder()
        builder.load_collection(CONTROLS)
        builder.load_collection(REDEFINED)
        builder.root.statusText('ready')
        with self.assertRaisesRegex(ValueError, r"^Element 'statusText' does not accept 'required_label'\."):
            builder.root.statusText('ready', required_label='Status')
        document = builder._collection.to_document()
        self.assertEqual(document['elements']['statusText'], REDEFINED['elements']['statusText'])
        self.assertEqual(document['elements']['rating'], CONTROLS['elements']['rating'])
        self.assertEqual(document['grammar']['title'], 'Redefined controls')
        self.assertEqual(document['grammar']['name'], CONTROLS['grammar']['name'])
        self.assertEqual(list(document['elements']), list(CONTROLS['elements']))
