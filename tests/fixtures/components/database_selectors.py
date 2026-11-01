"""Python Source for browser qualification with the harness's controlled selector service."""
import json
from importlib.resources import files

from gramlot import GramlotBuilder
from genro_tytx import to_tytx

grammar = json.loads(files('gramlot').joinpath('collections/inputs.json').read_text())
builder = GramlotBuilder(collections=[grammar])
pane = builder.root.main(datapath='form', class_='example-page stack', max_width='800px')
header = pane.header()
header.h1('Customer selection')
header.p('Choose a customer or enter a free name.', class_='muted')
form = pane.section(class_='card stack', padding='24px')
fields = form.div(class_='grid', gap='24px')
template = ('<div>{name}</div>'
            '<div style="color:var(--gramlot-text-secondary);font-size:.85em;margin-top:.15em">{city}</div>')
customer = fields.div(class_='stack', gap='8px')
customer.dbSelect(id='customer', value='^.customer', method='customers', searchDelay=0,
    lbl='Customer', emptyLabel='No customer', placeholder='Search by name',
    template=template, selected_city='.city', box_c_width='100%')
customer.p('Choose a record. Name and city distinguish customers with the same name.',
           class_='muted', font_size='.8rem')
suggestion = fields.div(class_='stack', gap='8px')
suggestion.dbComboBox(id='suggestion', value='^.suggestion', method='customers', searchDelay=0,
    lbl='Free name', placeholder='Type a name or choose a suggestion',
    template=template, selected_city='.suggestion_city', box_c_width='100%')
suggestion.p('Enter keeps free text. Use arrows or the pointer to choose a suggestion.',
             class_='muted', font_size='.8rem')
required = fields.div(class_='stack', gap='8px')
required.dbSelect(id='required', value='^.required', method='customers', searchDelay=0,
    lbl='Required customer', placeholder='Select a customer',
    validate_notnull=True, template=template, box_c_width='100%')
required.p('This field requires a selection.', class_='muted', font_size='.8rem')
fields.div().textbox(id='after', value='^.after', lbl='Notes',
                     placeholder='Add a note', width='100%', box_c_width='100%')
result = form.div(class_='grid', border_top='1px solid var(--gramlot-border)', padding_top='16px')
for title, path, identity in [('Customer city', '^.city', 'selected-city'),
                              ('Suggestion city', '^.suggestion_city', 'suggestion-city')]:
    cell = result.div()
    cell.div(title, class_='muted', font_size='.8rem')
    cell.div(path, id=identity, min_height='1.5em', overflow_wrap='anywhere')
pane.p('Test data. Changes are not saved to a database.', class_='muted', font_size='.8rem')
print(to_tytx(builder.source))
