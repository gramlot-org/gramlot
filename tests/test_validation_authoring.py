"""Shared validation signatures preserve typed Python declarations."""
import json
import unittest
from datetime import date
from decimal import Decimal
from importlib.resources import files
from gramlot import GramlotBuilder


class ValidationAuthoringTests(unittest.TestCase):
    def test_rules_and_typed_arguments_use_the_generated_collection(self):
        grammar = json.loads(files('gramlot').joinpath('collections/inputs.json').read_text())
        builder = GramlotBuilder(collections=[grammar])
        pane = builder.root.div(datapath='record')
        node = pane.textbox(value='^.name', validate_notnull=True, validate_case='upper',
                            validate_regex='(?:^[A-Z]+$)', validate_len='2:20',
                            validate_len_if='strict', validate_strict='^.strict',
                            validate_call='checkName', validate_onAccept='accepted',
                            validate_remote='check_name', validate_remote_limit=3,
                            validate_email_iswarning='^.warning', validate_timeout=5000)
        self.assertEqual(node.attr['validate_regex'], '(?:^[A-Z]+$)')
        self.assertEqual(node.attr['validate_remote_limit'], 3)
        amount = pane.numberTextBox(value='^.amount', dtype='N', validate_min=Decimal('1.25'))
        self.assertEqual(amount.attr['validate_min'], Decimal('1.25'))
        day = pane.dateTextBox(value='^.day', validate_max=date(2026, 12, 31))
        self.assertEqual(day.attr['validate_max'], date(2026, 12, 31))
        parameters = node.attr['_meta']['gramlot_component']['parameters']
        for rule in ('notnull', 'empty', 'case', 'len', 'min', 'max', 'email', 'regex', 'call', 'remote'):
            self.assertIn('validate_' + rule, parameters)
            self.assertIn('validate_' + rule + '_if', parameters)
            self.assertEqual(parameters['validate_' + rule + '_error']['qualification'], 'intl_str')
        self.assertIn('validate__onResult', parameters)
        self.assertNotIn('validate_nodup', parameters)
