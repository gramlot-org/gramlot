import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag, Gramlot, GramlotBuilder} from '../src/index.js';
import selection from '../src/experiments/selection-trial.js';

function fixture(t) {
    t.mock.timers.enable({apis:['setTimeout']});
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const app = new Gramlot({document:window.document,transport:false,collections:[selection]});
    t.after(() => {app.dispose(); window.close();});
    const requests = [];
    t.mock.method(app, 'publish', (topic, payload) => requests.push({topic, ...payload}));
    app.data.setItem('ready', true);
    const b = new GramlotBuilder(null, {collections:[selection]});
    b.root.windowSelection({node_label:'trial',ready:'^ready',limit:'100000',seed:'^seed',
        sortedBy:'^sort',viewport:'^viewport',inbox:'^inbox',result:'^result',metrics:'^metrics',status:'^status'});
    app.src.startSource(b.toTytx());
    const tick = ms => t.mock.timers.tick(ms);
    tick(0);
    const reply = (request, {start=0,total=100000,revision=1}={}) => {
        const rows = new Bag(); rows.setItem('r'+start, null, {code:'A'});
        const frame = new Bag({request_id:request.request_id,rows,
            window:new Bag({start,total,revision,sortedBy:request.sorted_by}),threshold:1000,mode:'cachedFetch'});
        app.data.setItem('inbox', frame);
        return frame;
    };
    return {app, requests, tick, reply};
}

test('window coordinator rejects superseded replies and preserves selection debounce during scrolling', t => {
    const f = fixture(t);
    assert.equal(f.requests.length, 1);
    const first = f.requests[0];
    f.app.data.setItem('seed','parks');
    f.app.data.setItem('viewport',{start:50000,count:200});
    f.tick(0);
    assert.equal(f.requests.length,1,'old viewport cannot replace pending search');
    f.reply(first);
    assert.equal(f.app.data.getItem('result'),null);
    f.tick(200);
    assert.equal(f.requests.length,2);
    assert.equal(f.requests[1].start,0);
    assert.equal(f.requests[1].seed,'parks');
    const frame=f.reply(f.requests[1],{total:20,revision:2});
    assert.equal(f.app.data.getItem('result.count'),20);
    assert.equal(f.app.data.getItem('result.rows').length,1);
    assert.notEqual(f.app.data.getItem('result.rows'),frame.getItem('rows'),'response Bag retains ownership');
    f.app.data.setItem('viewport',{start:5,count:200});f.tick(0);
    f.app.data.setItem('viewport',{start:10,count:200});f.tick(0);
    f.reply(f.requests[2],{start:5,total:20,revision:2});
    assert.equal(f.app.data.getItem('result.window.start'),0);
    f.reply(f.requests[3],{start:10,total:20,revision:2});
    assert.equal(f.app.data.getItem('result.window.start'),10);
    f.app.data.setItem('seed','next');
    const node=f.app.src.source.getNode('main.trial');node.parentBag.popNode(node.label);
    f.tick(200);
    assert.equal(f.requests.length,4,'unmount cancels pending work');
});

test('invalid window response reports a failure without replacing the previous Bag', t => {
    const f=fixture(t);f.reply(f.requests[0]);
    const result=f.app.data.getItem('result');
    f.app.data.setItem('viewport',{start:10,count:200});f.tick(0);
    f.reply(f.requests[1],{start:10,total:5});
    assert.equal(f.app.data.getItem('result'),result);
    assert.equal(f.app.data.getItem('status'),'Failed: invalid window response');
});
