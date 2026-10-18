"""Border composition and draft retention, independent of the gallery."""
import json
from datetime import date
from importlib.resources import files
from gramlot import GramlotBuilder
from genro_tytx import to_tytx

b = GramlotBuilder(collections=[json.loads(files('gramlot').joinpath(
    f'collections/{name}.json').read_text()) for name in ('inputs', 'layout')])
root = b.root
root.dataSetter('name', 'Ada')
root.dataSetter('drawerLabel', '')
root.dataSetter('drawerClass', '')
root.dataSetter('design', 'headline')
root.dataSetter('rounded', 24)
root.dataSetter('shade', '#ccd2da')
root.dataSetter('appointment', date(2026, 10, 18))
root.dataSetter('delivery', 'standard')
border = root.borderContainer(id='border', height='460px', width='100%', design='^design', rounded='^rounded', border='2px solid #8192aa')
for side in ('top', 'bottom', 'left', 'right'):
    panel = border.contentPane(id=side, region=side, width='180px', height='50px',
        splitter=True, minSize=30, maxSize=300, drawer=True,
        drawer_title=side, drawer_label='^drawerLabel', drawer_class='^drawerClass',
        drawer_style='--gramlot-drawer-reveal-width:24px;--gramlot-drawer-reveal-height:80px;', 
        splitter_background='^shade', background='#e5ebf3')
    if side == 'left':
        panel.textbox(id='draft', value='^name', lbl='Name', validate_len='2:8')
    else:
        panel.p(side)
center = border.borderContainer(id='nested', region='center', rounded='^rounded', border='2px solid #8192aa')
center.contentPane(region='top', height='30px').p('Nested header')
body = center.contentPane(region='center')
body.p('Persistent center')
body.iframe(id='frame', srcdoc='<p>Retained iframe</p>', height='100px')
body.dateTextBox(id='popup-date', value='^appointment', lbl='Appointment', width='220px')
body.filteringSelect(id='popup-choice', value='^delivery', lbl='Delivery',
    values='standard:Standard,express:Express,pickup:Pick up,scheduled:Scheduled,evening:Evening,weekend:Weekend', width='220px')
print(to_tytx(b.source))
