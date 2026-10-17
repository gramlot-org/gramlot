"""Python consumes the generated JS component grammar, without executing JS."""
import json
from importlib.resources import files
import unittest
from gramlot import GramlotBuilder


class ComponentTests(unittest.TestCase):
    def setUp(self):
        self.grammar = json.loads(files('gramlot').joinpath('collections/inputs.json').read_text())
        self.builder = GramlotBuilder(collections=[self.grammar])
        self.pane = self.builder.root.div(datapath='form')

    def test_same_case_insensitive_names_and_render_tags(self):
        for name, tag, attrs in [
            ('TEXTBOX', 'gramlot-textbox', {'value': '^.name', 'lbl': 'Customer'}),
            ('checkBox', 'gramlot-checkbox', {'value': '^.enabled', 'label': 'Newsletter'}),
            ('radioButtonText', 'gramlot-radio-button-text', {'value': '^.choice', 'values': 'a:A,b:B'}),
            ('COMBOBOX', 'gramlot-combo-box', {'value': '^.city', 'values': 'Rome,Paris'}),
            ('CHECKBOXTEXT', 'gramlot-check-box-text', {'value': '^.choices', 'values': 'a:A,b:B'}),
        ]:
            with self.subTest(name=name):
                node = getattr(self.pane, name)(**attrs)
                self.assertEqual(node.attr['_meta']['render_tag'], tag)
        self.assertIn('<gramlot-textbox', self.builder.render())

    def test_explicit_null_keeps_its_declared_type_contract(self):
        self.pane.textbox(value=None)
        self.pane.radioButtonText(value=None)
        self.pane.checkBoxText(value=None)
        self.pane.comboBox(value=None)
        with self.assertRaises((ValueError, TypeError)):
            self.pane.checkbox(value=None)

    def test_shared_metadata_and_bound_parameters(self):
        for name in ('textbox', 'checkbox', 'radioButtonText'):
            meta = self.grammar['elements'][name]['_meta']['gramlot_component']['parameters']
            self.assertEqual(meta['lbl']['dtype'], 'T')
            self.assertEqual(meta['lbl']['qualification'], 'intl_str')
            self.assertEqual(meta['lbl_position']['default'], 'TL')
            getattr(self.pane, name)(value='^.value', lbl_position='^.position', disabled='^.disabled')
        self.pane.radioButtonText(cols='^.columns')
        self.assertNotIn('textbox', GramlotBuilder()._schema_tag_names)

    def test_literal_types_and_value_suffix_rejection(self):
        for name, attrs in [('textbox', {'value': '^name:{}px'})]:
            with self.subTest(name=name), self.assertRaises((TypeError, ValueError)):
                getattr(self.pane, name)(**attrs)

    @unittest.expectedFailure
    def test_upstream_annotated_regex_inside_union(self):
        """Builders Python still ignores Regex in a Union branch (confirmed on 0.29.0; JS rejects it).

        Direct dependency reproduction; no consumer validation workaround.
        Remove expectedFailure once upstream validates nested Annotated metadata.
        """
        from typing import Annotated, Union
        from genro_builders.builder._utilities import _check_type
        from genro_builders.builder._validators import Regex
        declaration = Union[bool, Annotated[str, Regex(r"^[\^=].+")]]
        self.assertFalse(_check_type("arbitrary", declaration, strict_json_primitives=True))

class ApplicationCollectionTests(unittest.TestCase):
    def test_application_loads_json_for_main_and_fragments_and_announces_browser_module(self):
        import asyncio
        from gramlot import Page, source
        from gramlot.server import GramlotServer
        from genro_tytx import to_tytx

        class InputsPage(Page):
            def main(self, root):
                root.textbox(value='^name', lbl='Name')

            @source
            def more(self, root):
                root.checkbox(value=False, lbl='Contact')

        class Server(GramlotServer):
            def resolve_page(self, path):
                return InputsPage

            def resolve_resources(self, path, cls):
                return {'css': [], 'js': []}

        grammar = json.loads(files('gramlot').joinpath('collections/inputs.json').read_text())
        server = Server(collections=[{'grammar': grammar, 'module': '/components/inputs.js'}])
        opened = asyncio.run(server.open_page('/', prefix='/demo'))
        self.assertIn('"collections":["/demo/components/inputs.js"]', opened.html)
        for name, tag in [('main', 'gramlot-textbox'), ('more', 'gramlot-checkbox')]:
            reply = json.loads(asyncio.run(server.call(to_tytx({
                'id':'1', 'pageId':opened.page_id, 'contentType':'source', 'name':name, 'params':{}}))))
            self.assertNotIn('error', reply)
            self.assertIn(tag, reply['value'])


class ButtonComponentTests(unittest.TestCase):
    def test_builtin_family_without_opt_in_collections(self):
        builder = GramlotBuilder()
        for name, tag, attrs in [
            ('button', 'gramlot-button', {'action': '1', 'ask': 'Continue?'}),
            ('TOGGLEBUTTON', 'gramlot-toggle-button', {'value': '^enabled', 'ask': 'Continue?'}),
            ('dropDownButton', 'gramlot-drop-down-button', {'persist': True, 'id': 'export'}),
        ]:
            with self.subTest(name=name):
                node = getattr(builder.root, name)('Caption', **attrs)
                self.assertEqual(node.attr['_meta']['render_tag'], tag)
        menu = builder.root.dropDownButton('Export').menu()
        menu.menuline('CSV', code='csv', action='1')
        menu.menuline('-')
        builder.root.html_button('Plain', type='submit')
        rendered = builder.render()
        self.assertIn('<gramlot-menu-line', rendered)
        self.assertIn('<button', rendered)
        with self.assertRaises((TypeError, ValueError)):
            builder.root.toggleButton(value='^x:{}')
