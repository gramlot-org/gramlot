// Executable evidence for PORT-0005. This script never changes dependencies.
import { BuilderBase, SourceBag } from '../../js/node_modules/@jsr/genro__builders/src/index.js';

const strict = process.argv.includes('--strict');
const results = [];
const record = (id, expected, observed, matches) => {
  results.push({ id, expected, observed, status: matches ? 'match' : 'gap' });
};

const builder = new BuilderBase();
const scope = new SourceBag(null, builder);
builder.source.setItem('scope', scope, { datapath: 'main.form', form: true, _anchor: true, node_id: 'target' });
const node = scope.setItem('child', null, { datapath: '.child' });

// A missing method or an unexpected exception is an error in the probe itself.
const events = [];
builder.data.subscribe('port-0005-probe', {
  any: event => events.push({
    evt: event.evt,
    pathlist: event.pathlist,
    reason: event.reason,
    value: event.node.getValue(true),
    fired: event.fired ?? null,
  }),
});

node.PUT('quiet', 7);
record('put.silent', { eventCount: 0, value: 7 },
  { eventCount: events.length, value: builder.data.getItem('quiet') },
  events.length === 0 && builder.data.getItem('quiet') === 7);

events.length = 0;
node.FIRE('command', 42);
node.FIRE('command', 42);
const fireObserved = { events: [...events], storedValue: builder.data.getItem('command') };
record('fire.repeated-reset',
  { eventCount: 2, eventValues: [42, 42], storedValue: null },
  { eventCount: events.length, eventValues: events.map(event => event.value), storedValue: fireObserved.storedValue },
  events.length === 2 && events.every(event => event.value === 42) && fireObserved.storedValue === null);
record('fire.fired-metadata', { everyEventFired: true },
  { fired: events.map(event => event.fired), reasons: events.map(event => event.reason), eventTypes: events.map(event => event.evt) },
  events.length === 2 && events.every(event => event.fired === true));

const expression = '==quantity * price';
const pointerType = node.pointerType(expression);
record('expression.classification', { pointerType: null, meaning: 'inline expression, not a passive pointer' },
  { pointerType }, pointerType === null);

for (const symbol of ['FORM', 'ANCHOR', 'target']) {
  const path = `^#${symbol}.x?caption`;
  const resolved = node.absDatapath(path);
  record(`symbolic.${symbol}.attribute`, { resolved: 'main.form.x?caption' }, { resolved },
    resolved === 'main.form.x?caption');
}

builder.data.unsubscribe('port-0005-probe', { any: true });
const summary = { matched: results.filter(item => item.status === 'match').length,
  gaps: results.filter(item => item.status === 'gap').length };
process.stdout.write(`${JSON.stringify({ schema: 'gramlot.port-0005.contract-probes.v1',
  dependencies: { builder: 'installed @jsr/genro__builders', bag: 'installed @jsr/genro__bag' },
  results, summary }, null, 2)}\n`);
if (strict && summary.gaps) process.exitCode = 1;
