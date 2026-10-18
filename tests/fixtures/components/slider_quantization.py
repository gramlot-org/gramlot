"""Python-authored slider projection and shared numeric border binding."""
import json
from importlib.resources import files
from gramlot import GramlotBuilder
from genro_tytx import to_tytx

b = GramlotBuilder(collections=[json.loads(files('gramlot').joinpath(
    f'collections/{name}.json').read_text()) for name in ('inputs', 'layout')])
r = b.root
for path, value in [('size', 176.73), ('step', 1), ('minimum', 80), ('maximum', 300),
                    ('fraction', -0.16), ('readonly', 176.73), ('other', 141.7)]:
    r.dataSetter(path, value)
border = r.borderContainer(id='border', width='700px', height='200px')
border.contentPane(id='left', region='left', width='^size', splitter=True, minSize=80, maxSize=300).p('Retained')
border.contentPane(region='center').textbox(id='customer', value='^customer')
for name in ('horizontalSlider', 'verticalSlider'):
    getattr(r, name)(id=name, node_label=name, value='^size', min='^minimum', max='^maximum', step='^step', live=True)
r.p('^size', id='size-label')
r.horizontalSlider(id='fraction', value='^fraction', min=-0.3, max=1, step=0.1)
r.horizontalSlider(id='readonly', value='=readonly', min=80, max=300, step=1)
r.horizontalSlider(id='literal', value=176.73, min=80, max=300, step=1)
print(to_tytx(b.source))
