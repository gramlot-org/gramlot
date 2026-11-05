"""Python-first qualification for the optional Vizabi collection."""
import json
from genro_bag import Bag
from gramlot import GramlotBuilder
from gramlot.collections.layout import mygramlot as layout
from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.vizabi import mygramlot as vizabi
builder = GramlotBuilder(collections=[json.loads(c.verify()[c.grammar]) for c in (layout, inputs, vizabi)])
root = builder.root.main(max_width='1200px', margin='20px auto')
root.h1('Sales over time · Vizabi')
root.p('Each bubble is a region. Revenue, margin and units are prepared annual values.')
rows = Bag()
for year in range(2015, 2026):
    for i, region in enumerate(['North', 'South', 'East', 'West']):
        t = year - 2015
        rows.set_item(f'r{year}_{i}', None, region=region, year=year,
                      revenue=100+i*55+t*(12+i*5), margin=15+i*8+t*(2+i), units=20+i*9+t*3, group=['Coastal','Inland'][i%2])
config = Bag(dict(entityField='region', timeField='year', xField='revenue', yField='margin', sizeField='units', colorField='group', year=2015, playing=False, speed=500))
root.dataSetter('demo.rows', rows)
root.dataSetter('demo.config', config)
frame = root.framePane(height='650px')
toolbar = frame.top.contentPane(display='flex', gap='12px', flex_wrap='wrap', align_items='center', padding='6px')
toolbar.button('Play / Pause', flex_shrink=0, action="SET demo.config.playing = !GET demo.config.playing;")
toolbar.span('Year')
toolbar.numberTextBox(value='^demo.config.year', min=2015, max=2025, width='90px', flex_shrink=0)
toolbar.span('Step (ms)')
toolbar.numberTextBox(value='^demo.config.speed', min=100, max=2000, width='90px', flex_shrink=0)
for label, field in [('X','xField'),('Y','yField'),('Size','sizeField')]:
    toolbar.span(label)
    choice=toolbar.select(value=f'^demo.config.{field}', width='150px', flex_shrink=0)
    for name in ['revenue','margin','units']:
        choice.option(name.title(), value=name)
frame.center.contentPane(height='100%').vizabiBubble(id='bubble', nodeId='bubble', storepath='demo.rows', configuration='^demo.config', rowMode='attributes', libraryUrl='/optional/vizabi.js', height='100%')
print(builder.to_tytx())
