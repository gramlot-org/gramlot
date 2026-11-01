"""Shared local form/grid editing; no host or database service."""
import json
from genro_bag import Bag
from gramlot import GramlotBuilder
from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.grid import mygramlot as grid

builder = GramlotBuilder(collections=[json.loads(c.verify()[c.grammar]) for c in (inputs, grid)])
root = builder.root.main(node_label='page', padding='20px')
for mode in ('values', 'attributes'):
    rows = Bag()
    for i in range(1000):
        data = dict(name=f'Item {i}', amount=i + 1,
                    notes='Variable height\nSecond line\nThird line' if i % 5 == 0 else 'One line')
        if mode == 'values':
            rows.set_item(f'r{i}', Bag(data))
        else:
            rows.set_item(f'r{i}', None, **data)
    root.dataSetter(mode, Bag(dict(title='Local record', rows=rows)))
    form = root.div(node_label=mode, form=True, datapath=mode)
    form.h2(f'Editing · {mode}')
    form.textbox(value='^.title', id=f'title-{mode}', validate_notnull=True)
    form.button('Accept locally', id=f'accept-{mode}', action='this.formState.accept();')
    form.button('Restore', id=f'restore-{mode}', action='this.formState.restore();')
    g = form.grid(id=f'grid-{mode}', node_label='grid', storepath='.rows', rowMode=mode,
                  height='330px', rowHeaders=True, rowResize=True)
    s = g.struct()
    s.column('name', width='180px', edit=dict(validate_notnull=True))
    s.column('amount', dtype='L', width='140px', edit=dict(validate_min=0))
    s.column('notes', width='300px', white_space='pre-wrap', edit=dict(tag='textBoxArea'))
print(builder.to_tytx())
