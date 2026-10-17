"""Python-first framework fixture; browser harness supplies explicit collection activation."""
import json
from importlib.resources import files
from gramlot import GramlotBuilder
from genro_tytx import to_tytx

grammar = json.loads(files('gramlot').joinpath('collections/inputs.json').read_text())
builder = GramlotBuilder(collections=[grammar])
pane = builder.root.main(datapath='form', padding='20px', font_family='system-ui')
pane.h1('Shared input components')
pane.p('One labelbox and binding contract for text, a checkbox and radio groups.')
pane.textbox(id='customer', value='^.customer', lbl='Customer', lbl_position='^position',
             placeholder='Name', live=True, box_c_width='260px', lbl_color='navy',
             box_margin_bottom='16px', readonly='^readonly')
pane.div().checkbox(id='newsletter', value='^.newsletter', lbl='Contact', label='Newsletter',
                    box_margin_bottom='16px')
for name in ('shipping', 'alternative'):
    pane.div().radioButtonText(id=name, value=f'^.{name}',
                              values='standard:Standard,express:Express,pickup:Pickup',
                              lbl=name.capitalize(), cols=3, box_margin_bottom='16px')
for path, value in [('position', 'TL'), ('readonly', False), ('form.customer', 'Ada'),
                    ('form.newsletter', False), ('form.shipping', 'standard'),
                    ('form.alternative', 'pickup')]:
    pane.dataSetter(destination_path=path, value=value)
print(to_tytx(builder.source))
