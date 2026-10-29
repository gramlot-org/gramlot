"""Python-authored frameGrid: the shared menu system around the resident grid."""
import json
from datetime import date
from genro_bag import Bag
from gramlot import GramlotBuilder
from gramlot.collections.layout import mygramlot as layout
from gramlot.collections.grid import mygramlot as grid

builder = GramlotBuilder(collections=[json.loads(item.verify()[item.grammar]) for item in (layout, grid)])
root = builder.root.main(max_width='1100px', margin='24px auto', padding='16px')
root.h1('FrameGrid')
root.p('One grid, shared command bars. Each frame owns its rows and receives its own commands.')
themes = root.div(display='flex', flex_wrap='wrap', gap='12px', margin_bottom='20px')
for theme in ('base', 'compact', 'mimi', 'joanna', 'mela'):
    for mode in ('light', 'dark'):
        themes.a(f'{theme.title()} · {mode}', href=f'/?theme={theme}&mode={mode}')

for mode in ('values', 'attributes'):
    rows = Bag()
    for index in range(60):
        fields = dict(code=f'P{index + 1:03}', description=f'Item {index + 1}',
                      quantity=index + 1, price=12.5 + index, updated=date(2026, 10, 28))
        rows.set_item(f'r{index}', Bag(fields)) if mode == 'values' else rows.set_item(f'r{index}', None, **fields)
    root.dataSetter(f'{mode}.rows', rows)
    root.dataSetter(f'{mode}.status', 'Ready')
    frame = root.frameGrid(node_label=mode, id=f'frame-{mode}', datapath=mode,
                          storepath='.rows', rowMode=mode, searchOn=True, height='330px', margin_bottom='24px')
    frame.grid.set_attr(id=f'grid-{mode}', rowHeaders=True, rowResize=True, selfDragRows=True, selfsubscribe_update='updateFirst', selfsubscribe_remove='removeLast')
    struct = frame.grid.struct()
    struct.column('code', name='Code', width='90px')
    struct.column('description', name='Description', width='220px')
    amounts = struct.colgroup('amounts', name='Amounts')
    amounts.column('quantity', name='Quantity', dtype='L', width='100px')
    amounts.column('price', name='Price', dtype='N', format='0.00', width='120px')
    struct.column('updated', name='Updated', dtype='D', format='short', width='120px')
    frame.dataFormula('.count', 'rows.getNodes().length', rows='^.rows', _onBuilt=True)
    top = frame.top.menu(presentation='bar', aria_label=f'{mode.title()} commands',
                         padding='6px', background='var(--gramlot-surface-subtle)')
    top.menuline(group=True, overflowable=False).strong(f'Rows as {mode}')
    top.spacer(flex=1)
    actions = top.menuline(group=True, priority=20)
    actions.menuline('gridDemo:update', id=f'update-{mode}')
    actions.menuline('gridDemo:remove', id=f'remove-{mode}')
    bottom = frame.bottom.menu(presentation='bar', aria_label=f'{mode.title()} status', padding='4px 8px')
    count = bottom.menuline(group=True, overflowable=False)
    count.span('^.count', id=f'count-{mode}')
    count.span('rows · Read only')
    bottom.spacer(flex=1)
    bottom.menuline(group=True, priority=10).span('^.status', id=f'status-{mode}')

print(builder.to_tytx())
