"""Python-authored fixture for the shared ChartPane composition."""
import json
from datetime import date, datetime, timezone
from genro_bag import Bag
from gramlot import GramlotBuilder, ChartPane
from gramlot.collections.layout import mygramlot as layout
from gramlot.collections.grid import mygramlot as grid
from gramlot.collections.inputs import mygramlot as inputs

from gramlot.collections.charts import mygramlot as charts
collections = [json.loads(item.verify()[item.grammar]) for item in (layout, grid, inputs, charts)]
builder = GramlotBuilder(collections=collections)
root = builder.root.main(max_width='1100px', margin='24px auto', padding='16px')
root.h1('Sales: grid and chart')
root.p('Monthly orders: filter the grid, then choose a dimension and measure in the chart drawer.')
rows = Bag()
records = [
    ('North', 'Notebook', 12, 1440, 240), ('South', 'Monitor', 8, 1920, 360),
    ('West', 'Notebook', 15, 1800, 300), ('East', 'Keyboard', 20, 1400, 280),
    ('North', 'Monitor', 11, 2640, 495), ('South', 'Notebook', 17, 2040, 340),
    ('West', 'Keyboard', 24, 1680, 336), ('East', 'Monitor', 14, 3360, 630),
    ('North', 'Notebook', 19, 2280, 380), ('South', 'Keyboard', 27, 1890, 378),
    ('West', 'Monitor', 16, 3840, 720), ('East', 'Notebook', 22, 2640, 440),
]
for index, (region, product, units, revenue, margin) in enumerate(records):
    rows.set_item(f'r{index}', None, order=f'ORD-{index + 1:03}', date=date(2026, index + 1, 15),
                  region=region, product=product, units=units, revenue=revenue, margin=margin)
root.dataSetter('demo.chartOpen', False)
frame = root.frameGrid(node_label='sales', id='sales-frame', storepath='demo.rows', rowMode='attributes', searchOn=True, height='310px')
frame.grid.set_attr(id='sales-grid', nodeId='salesGrid')
struct = frame.grid.struct()
struct.column('order', name='Order', width='110px')
struct.column('date', name='Date', dtype='D', format='short', width='120px')
struct.column('region', name='Region', width='110px')
struct.column('product', name='Product', width='130px')
struct.column('units', name='Units', dtype='L', width='90px')
struct.column('revenue', name='Revenue', dtype='L', width='110px')
struct.column('margin', name='Margin', dtype='L', width='110px')
bar = frame.toolbar
bar.menuline(caption='Chart', iconSrc='/assets/icons/chart.svg', labelPosition='tooltip', action='SET demo.chartOpen = true;')
chart = root.floatingPane(id='chart-window', title='Sales chart', open='^demo.chartOpen', width='860px', height='430px')
configuration = Bag(dict(chartType='bar3D', captionField='order', secondCaptionField='region'))
configuration.set_item('seriesOptions.units', Bag(dict(axis='right', color='#ee6666')))
configuration.set_item('seriesOptions.revenue', Bag(dict(color='#5470c6')))
configuration.set_item('seriesOptions.margin', Bag(dict(color='#3ba272')))
pane = ChartPane(chart.frame.center, store=rows, configuration=configuration,
                 storepath='demo.rows', datapath='demo.config', gridId='salesGrid', id='sales-pane')
root.h2('Standalone chart')
metrics = Bag(dict(a=Bag(dict(team='Engineering', hours=24, tickets=8)),
                   b=Bag(dict(team='Design', hours=18, tickets=6))))
standalone = ChartPane(root, store=metrics, configuration=Bag(dict(captionField='team')),
    storepath='metrics.rows', datapath='metrics.config', rowMode='values', id='metrics-pane', height='360px')
root.h2('3D surfaces, scatter and lines')
field_rows = Bag()
for x in range(-3, 4):
    for y in range(-3, 4):
        field_rows.set_item(f'p{(x+3)*7+y+3}', None, x=x, y=y,
                            response=18-x*x-y*y, baseline=5+x*0.5+y*0.25)
field_config = Bag(dict(chartType='surface', captionField='x', secondCaptionField='y'))
field_config.set_item('seriesOptions.x', Bag(dict(selected=False)))
field_config.set_item('seriesOptions.y', Bag(dict(selected=False)))
field_pane = ChartPane(root, store=field_rows, configuration=field_config,
    storepath='field.rows', datapath='field.config', id='field-pane', height='430px')
root.h2('3D maps, paths and polygons')
geojson = dict(type='FeatureCollection', features=[
    dict(type='Feature', properties=dict(name='West'), geometry=dict(type='Polygon', coordinates=[[[0,0],[1,0],[1,1],[0,1],[0,0]]])),
    dict(type='Feature', properties=dict(name='East'), geometry=dict(type='Polygon', coordinates=[[[1,0],[2,0],[2,1],[1,1],[1,0]]])),
])
geographic_rows = Bag()
geographic_rows.set_item('west', None, territory='West', sales=8, costs=3,
    route=[[0.2,0.2,2],[0.6,0.7,4],[1.7,0.6,2]],
    polygon=[[[0.1,0.1],[0.8,0.1],[0.8,0.8],[0.1,0.8],[0.1,0.1]]])
geographic_rows.set_item('east', None, territory='East', sales=12, costs=5,
    route=[[1.7,0.2,2],[1.1,0.8,6],[0.3,0.6,2]],
    polygon=[[[1.2,0.2],[1.8,0.2],[1.8,0.8],[1.2,0.8],[1.2,0.2]]])
geographic_config = Bag(dict(chartType='map3D', captionField='territory', geometryField='route'))
geographic_config.set_item('geoJSON', geojson)
geographic_pane = ChartPane(root, store=geographic_rows, configuration=geographic_config,
    storepath='geographic.rows', datapath='geographic.config', id='geographic-pane', height='430px')
root.h2('Temporal snapshots · monthly sales', id='temporal-demo')
root.p('Choose a date field in Chart settings. Each position shows one month, without aggregating rows. Use Rank as X with lines to compare all four engines.')
temporal_rows = Bag()
for month in range(1, 13):
    for rank, region in enumerate(['North', 'South', 'East', 'West']):
        temporal_rows.set_item(f'm{month}_{rank}', None, period=date(2026, month, 15), recorded_at=datetime(2026, month, 15, 8+rank, tzinfo=timezone.utc), region=region, rank=rank,
                               revenue=1000 + rank*350 + month*(90+rank*30), margin=180+rank*50+month*20)
temporal_config=Bag(dict(engine='echarts',chartType='bar',captionField='region',timeField='period',timeStep='month',timeSpeed=0.5))
for measure in ['revenue','margin','rank']:
    temporal_config.set_item(f'seriesOptions.{measure}', Bag(dict(selected=measure=='revenue')))
ChartPane(root,store=temporal_rows,configuration=temporal_config,storepath='temporal.rows',datapath='temporal.config',id='temporal-pane',nodeId='temporalPane',height='470px')
print(builder.to_tytx())
