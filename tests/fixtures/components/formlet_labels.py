"""Intrinsic layout qualification without gallery layout overrides."""
import json
from importlib.resources import files
from gramlot import GramlotBuilder
from genro_tytx import to_tytx

builder = GramlotBuilder(collections=[json.loads(files('gramlot').joinpath(
    f'collections/{name}.json').read_text()) for name in ('inputs', 'layout')])
pane = builder.root.main(padding='16px', font_family='sans-serif', font_size='16px')
form = pane.formlet(id='form', node_label='form', columns='^columns',
                    col_min_width='^minimum', lbl_position='L')
form.textbox(id='a', node_label='a', lbl='^caption', value='^name', box_padding='8px')
form.textbox(id='b', lbl='ID')
form.textbox(id='c', lbl='Surname')
form.checkbox(id='d', lbl='Zip', label='Enabled')
form.textbox(id='e', lbl='City')
form.textbox(id='f', lbl='X')
nested = pane.formlet(id='outer', lbl_position='L')
nested.textbox(id='outer-field', lbl='A very long outer label')
nested.formlet(id='nested').textbox(id='nested-field', lbl='Inner')
pane.formlet(id='explicit', lbl_position='L', lbl_width='10rem').textbox(id='fixed', lbl='Fixed')
for path, value in [('columns', 2), ('caption', 'Customer name'), ('name', 'Ada')]:
    pane.dataSetter(path, value)
print(to_tytx(builder.source))
