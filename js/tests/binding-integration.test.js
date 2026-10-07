// Phase S13: the integrated lifecycle. Exact traces (installations, defaults, lifecycle invocations,
// timers, registrations, listeners) for mount, rebuild, replacement, removal and insertion under
// freeze (P3), nested freeze and dispose; R12, the handlers of a node removed under freeze do
// nothing; a callback that removes its own node before continuing. Source plan §5.1, §5.4, §7 S13.
import test from 'node:test';
import assert from 'node:assert/strict';
import {authored, counters, delta, fullBranch, insertBranch, page, startHost} from './fixtures/lifecycle.js';

/** The node of the branch `branch` whose attribute `id` is `id`. */
function nodeById(branch, id) {
    const walk = bag => {
        for (const node of bag.getNodes()) {
            if (node.getAttr('id') === id) return node;
            const found = node.value?.getNodes ? walk(node.value) : null;
            if (found) return found;
        }
        return null;
    };
    return walk(branch.value);
}

/** Dispatch `type` on `element` as the browser would, with `init` for a KeyboardEvent. */
function dispatch(ctx, element, type, init = {}) {
    const {window} = ctx;
    const Event = type.startsWith('key') ? window.KeyboardEvent : type === 'click' ? window.MouseEvent : window.Event;
    element.dispatchEvent(new Event(type, {bubbles: true, cancelable: true, ...init}));
}

test('mount: the dataSetter, the default, _init, the build, _onBuilt, _onStart; registrations, timers and listeners', t => {
    const ctx = page(t);
    const {app, trace, clock} = ctx;
    const host = startHost(app);
    const base = counters(ctx);
    trace.length = 0;
    insertBranch(app, host, 'b1', fullBranch(1));
    // `p1` is created by the first write under it; the default follows every dataSetter (§5.1 steps 2-3).
    assert.deepEqual(trace, ['data:ins:p1', 'data:ins:p1.greeting', 'data:ins:p1.name', 'ctl:init', 'ctl:built', 'ctl:start']);
    // 10 NodeBindings (fragment, pane, setter, input, 2 radios, button, its controller, span, controller);
    // 6 `^` pointers; the `_timing` interval; 4 listeners per text or radio input, the button, the span.
    assert.deepEqual(delta(counters(ctx), base), {bindings: 10, registrations: 6, nodeIds: 1, inline: 1, records: 7,
        references: 1, elements: 6, timers: 1, listeners: 14});
    assert.equal(ctx.byId('name1').value, 'anon');
    assert.equal(ctx.byId('span1').title, 't-hello');
    trace.length = 0;
    clock.tick(1000);
    ctx.byId('name1').value = 'bart';
    dispatch(ctx, ctx.byId('name1'), 'input');
    assert.deepEqual(trace, ['ctl:timing', 'data:upd_value:p1.name']);
    assert.deepEqual(delta(counters(ctx), base), {bindings: 10, registrations: 6, nodeIds: 1, inline: 1, records: 7,
        references: 1, elements: 6, timers: 2, listeners: 14});
    clock.tick(50);
    assert.deepEqual(trace.splice(0), ['ctl:timing', 'data:upd_value:p1.name', 'ctl:node']);
    app.dispose();
});

test('rebuild of the same node: nothing installed or started again, same NodeBinding, same counters', t => {
    const ctx = page(t);
    const {app, trace} = ctx;
    const host = startHost(app);
    const branch = insertBranch(app, host, 'b1', fullBranch(1));
    const base = counters(ctx);
    const input = nodeById(branch, 'name1');
    const pane = nodeById(branch, 'pane1');
    const binding = app.src.binding.bindingFor(input);
    const element = ctx.byId('name1');
    trace.length = 0;
    // C04.1: `type` has no setter, the element is rebuilt.
    input.setAttr({type: 'search'});
    assert.notEqual(ctx.byId('name1'), element);
    assert.equal(ctx.byId('name1').value, 'anon');
    // A thaw rebuilds the whole pane once.
    const paneElement = ctx.byId('pane1');
    app.src.renderer.freeze(pane);
    app.src.renderer.unfreeze(pane);
    assert.notEqual(ctx.byId('pane1'), paneElement);
    assert.deepEqual(trace, []);
    assert.equal(app.src.binding.bindingFor(input), binding);
    assert.deepEqual(delta(counters(ctx), base), {});
    ctx.byId('name1').value = 'lisa';
    dispatch(ctx, ctx.byId('name1'), 'input');
    assert.deepEqual(trace, ['data:upd_value:p1.name']);
    app.dispose();
});

test('replacement with a new identity: the old branch closes, the new one installs and starts', t => {
    const ctx = page(t);
    const {app, trace, clock} = ctx;
    const host = startHost(app);
    const branch = insertBranch(app, host, 'b1', fullBranch(1));
    const base = counters(ctx);
    const oldController = nodeById(branch, 'button1').value.getNodes()[0];
    const oldBinding = app.src.binding.bindingFor(oldController);
    ctx.data.setItem('p1.name', null);
    trace.length = 0;
    // The same label with a new branch: `upd_value` of the fragment, new nodes (§4.4 matrix).
    branch.setValue(app.src.prepareSource(authored(fullBranch(1))));
    assert.equal(oldBinding.closed, true);
    assert.notEqual(nodeById(branch, 'button1').value.getNodes()[0], oldController);
    // The dataSetter writes the same value: no event; the default refills the emptied name.
    assert.deepEqual(trace, ['data:upd_value:p1.name', 'ctl:init', 'ctl:built', 'ctl:start']);
    assert.deepEqual(delta(counters(ctx), base), {});
    assert.equal(ctx.byId('name1').value, 'anon');
    trace.length = 0;
    clock.tick(1000);
    assert.deepEqual(trace, ['ctl:timing']);
    app.dispose();
});

test('removal under freeze: the NodeBindings close at once, the DOM and its listeners wait for the thaw', t => {
    const ctx = page(t);
    const {app, trace, clock} = ctx;
    const host = startHost(app);
    const base = counters(ctx);
    insertBranch(app, host, 'b1', fullBranch(1));
    const mounted = counters(ctx);
    app.src.renderer.freeze(host);
    trace.length = 0;
    host.value.popNode('b1');
    assert.deepEqual(trace, []);
    assert.deepEqual(delta(counters(ctx), base), {records: 7, references: 1, elements: 6, listeners: 14});
    assert.equal(counters(ctx).listeners, mounted.listeners);
    clock.tick(10000);
    assert.deepEqual(trace, []);
    app.src.renderer.unfreeze(host);
    assert.deepEqual(delta(counters(ctx), base), {});
    assert.equal(ctx.byId('pane1'), null);
    app.dispose();
});

test('P3: insertion under freeze: steps 1-5 at once, the build and _onBuilt at the thaw, _onStart after the build', t => {
    const ctx = page(t);
    const {app, trace} = ctx;
    const host = startHost(app);
    const base = counters(ctx);
    app.src.renderer.freeze(host);
    trace.length = 0;
    insertBranch(app, host, 'b1', fullBranch(1));
    assert.deepEqual(trace, ['data:ins:p1', 'data:ins:p1.greeting', 'data:ins:p1.name', 'ctl:init']);
    // The providers are registered and `_timing` runs; no element, no listener.
    assert.deepEqual(delta(counters(ctx), base), {bindings: 10, registrations: 6, nodeIds: 1, timers: 1});
    trace.length = 0;
    app.src.renderer.unfreeze(host);
    assert.deepEqual(trace, ['ctl:built', 'ctl:start']);
    assert.deepEqual(delta(counters(ctx), base), {bindings: 10, registrations: 6, nodeIds: 1, inline: 1, records: 7,
        references: 1, elements: 6, timers: 1, listeners: 14});
    trace.length = 0;
    app.src.renderer.freeze(host);
    app.src.renderer.unfreeze(host);
    assert.deepEqual(trace, []);
    app.dispose();
});

test('P3: insertion then removal under the same freeze: installed and closed, never built', t => {
    const ctx = page(t);
    const {app, trace} = ctx;
    const host = startHost(app);
    const base = counters(ctx);
    let creates = 0;
    const create = app.src.renderer.html.create.bind(app.src.renderer.html);
    app.src.renderer.html.create = (...args) => { creates++; return create(...args); };
    app.src.renderer.freeze(host);
    trace.length = 0;
    insertBranch(app, host, 'b1', fullBranch(1));
    host.value.popNode('b1');
    assert.deepEqual(trace, ['data:ins:p1', 'data:ins:p1.greeting', 'data:ins:p1.name', 'ctl:init']);
    assert.deepEqual(delta(counters(ctx), base), {});
    app.src.renderer.unfreeze(host);
    // The thaw builds the host once: section and p, nothing of the removed branch.
    assert.equal(creates, 2);
    assert.deepEqual(trace, ['data:ins:p1', 'data:ins:p1.greeting', 'data:ins:p1.name', 'ctl:init']);
    assert.deepEqual(delta(counters(ctx), base), {});
    app.dispose();
});

test('nested freeze: the inner thaw waits for the outer one, which builds the current Source once', t => {
    const ctx = page(t);
    const {app, trace} = ctx;
    const host = startHost(app);
    const branch = insertBranch(app, host, 'b1', fullBranch(1));
    const pane = nodeById(branch, 'pane1');
    const span = nodeById(branch, 'span1');
    const bindings = new Map([pane, span].map(node => [node, app.src.binding.bindingFor(node)]));
    const base = counters(ctx);
    let creates = 0;
    const create = app.src.renderer.html.create.bind(app.src.renderer.html);
    app.src.renderer.html.create = (...args) => { creates++; return create(...args); };
    app.src.renderer.freeze(host);
    app.src.renderer.freeze(pane);
    trace.length = 0;
    pane.setAttr({title: 'frozen'});
    span.setValue('changed');
    app.src.builder.wrapSource(pane).em('late', {id: 'late1'});
    app.src.renderer.unfreeze(pane);
    assert.equal(creates, 0);
    assert.equal(ctx.byId('late1'), null);
    assert.equal(ctx.byId('pane1').title, '');
    app.src.renderer.unfreeze(host);
    // section, p, pane, input, 2 radios, button, span, em: one build each.
    assert.equal(creates, 9);
    assert.equal(ctx.byId('pane1').title, 'frozen');
    assert.equal(ctx.byId('span1').textContent, 'changed');
    assert.ok(ctx.byId('late1'));
    assert.deepEqual(trace, []);
    for (const [node, binding] of bindings) assert.equal(app.src.binding.bindingFor(node), binding);
    // The em is new; the span lost the pointer of its value (R05).
    assert.deepEqual(delta(counters(ctx), base), {bindings: 1, registrations: -1, records: 1, elements: 1});
    app.dispose();
});

test('dispose: every NodeBinding, timer, registration, listener and subscription released; nothing runs after', t => {
    const ctx = page(t);
    const {app, trace, clock} = ctx;
    const host = startHost(app);
    insertBranch(app, host, 'b1', fullBranch(1));
    ctx.byId('name1').value = 'pending';
    dispatch(ctx, ctx.byId('name1'), 'input');
    assert.equal(ctx.timers.size, 2);
    trace.length = 0;
    app.dispose();
    assert.deepEqual(trace, []);
    assert.deepEqual(counters(ctx), {bindings: 0, registrations: 0, nodeIds: 0, inline: 0, records: 0, references: 0,
        elements: 0, timers: 0, listeners: 0, dataSubscribers: 0, sourceSubscribers: 0, remoteRequests: 0});
    clock.tick(10000);
    ctx.data.setItem('p1.name', 'after');
    assert.deepEqual(trace, ['data:upd_value:p1.name']);
});

test('R12: an input, a button and a connect_on<event> removed under freeze do nothing before the thaw', t => {
    const ctx = page(t);
    const {app, trace, clock, data} = ctx;
    const host = startHost(app);
    const base = counters(ctx);
    insertBranch(app, host, 'b1', root => {
        const pane = root.div({id: 'pane', datapath: 'r'});
        pane.input({id: 'text', value: '^.text', live: true, connect_onkeydown: 'this.SET(".key", event.key)'});
        pane.input({id: 'lazy', value: '^.lazy'});
        pane.input({id: 'box', type: 'checkbox', value: '^.box'});
        pane.button('fire', {id: 'fire', fire: '.fired'});
        pane.button('controller', {id: 'controlled'}).dataController({func: 'record', who: 'click'});
        pane.span('x', {id: 'span', connect_onclick: 'this.SET(".clicked", true)'});
        pane.dataController({func: 'record', who: 'watch', text: '^.text', lazy: '^.lazy', box: '^.box',
            fired: '^.fired', clicked: '^.clicked', key: '^.key', _delay: 20});
    });
    const elements = ['text', 'lazy', 'box', 'fire', 'controlled', 'span'].map(id => ctx.byId(id));
    app.src.renderer.freeze(host);
    host.value.popNode('b1');
    trace.length = 0;
    const [text, lazy, box, fire, controlled, span] = elements;
    text.value = 'typed';
    dispatch(ctx, text, 'input');
    dispatch(ctx, text, 'change');
    dispatch(ctx, text, 'compositionstart');
    dispatch(ctx, text, 'compositionend');
    dispatch(ctx, text, 'keydown', {key: 'a'});
    lazy.value = 'changed';
    dispatch(ctx, lazy, 'change');
    box.click();
    fire.click();
    controlled.click();
    span.click();
    dispatch(ctx, span, 'keydown', {key: 'Enter'});
    clock.tick(1000);
    assert.deepEqual(trace, []);
    for (const path of ['text', 'lazy', 'box', 'fired', 'clicked', 'key']) assert.equal(data.getItem(`r.${path}`), null);
    assert.equal(ctx.timers.size, 0);
    assert.deepEqual(delta(counters(ctx), base), {records: 8, elements: 7, listeners: 16});
    app.src.renderer.unfreeze(host);
    assert.deepEqual(delta(counters(ctx), base), {});
    for (const element of elements) assert.equal(element.isConnected, false);
    app.dispose();
});

test('a callback that removes its own node: the handler stops, under freeze and without', async t => {
    for (const frozen of [false, true]) {
        await t.test(frozen ? 'under freeze' : 'without freeze', t => {
            const ctx = page(t);
            const {app, trace, data} = ctx;
            const host = startHost(app);
            const base = counters(ctx);
            const remove = label => () => host.value.popNode(label);
            let removeNow = null;
            const Logic = class {};
            Object.defineProperty(Logic.prototype, 'leave', {value() { removeNow(); }, writable: true, configurable: true});
            app.src.logicRegistry.register(Logic, {group: 'lc', resource: '/lc.js'});
            insertBranch(app, host, 'input', root => {
                root.input({id: 'lazy', value: '^i.lazy'});
                root.dataController({func: 'lc.leave', v: '^i.lazy'});
            });
            insertBranch(app, host, 'fire', root => {
                root.button('two', {id: 'two', fire_a: 'f.a', fire_b: 'f.b'});
                root.dataController({func: 'lc.leave', a: '^f.a'});
            });
            data.setItem('r.ra', true);
            insertBranch(app, host, 'radio', root => {
                root.input({id: 'ra', type: 'radio', group: 'g', value: '^r.ra'});
                root.input({id: 'rb', type: 'radio', group: 'g', value: '^r.rb'});
                root.dataController({func: 'lc.leave', rb: '^r.rb'});
            });
            insertBranch(app, host, 'button', root => {
                root.button('b', {id: 'self', connect_onclick: 'this.SET("s.clicked", true)'})
                    .dataController({func: 'lc.leave'});
            });
            if (frozen) app.src.renderer.freeze(host);
            trace.length = 0;
            // A text input writes on `change`; its observer removes it; the next `change` writes nothing.
            removeNow = remove('input');
            const lazy = ctx.byId('lazy');
            lazy.value = 'first';
            dispatch(ctx, lazy, 'change');
            lazy.value = 'second';
            dispatch(ctx, lazy, 'change');
            assert.equal(data.getItem('i.lazy'), 'first');
            // `fire_a` removes the button: `fire_b` is not fired.
            removeNow = remove('fire');
            ctx.byId('two').click();
            assert.equal(trace.includes('data:upd_value:f.b') || trace.includes('data:ins:f.b'), false);
            // Choosing `rb` removes it: its peer `ra` is not written.
            removeNow = remove('radio');
            ctx.byId('rb').click();
            assert.equal(data.getItem('r.rb'), true);
            assert.equal(data.getItem('r.ra'), true);
            // The nested controller removes its button: the `connect_onclick` of the same button does not run.
            removeNow = remove('button');
            ctx.byId('self')?.click();
            assert.equal(data.getItem('s.clicked'), null);
            // `i` and `f` are created by the first write under them.
            assert.deepEqual(trace, ['data:ins:i', 'data:ins:i.lazy', 'data:ins:f', 'data:ins:f.a', 'data:ins:r.rb']);
            if (frozen) app.src.renderer.unfreeze(host);
            assert.deepEqual(delta(counters(ctx), base), {});
            app.dispose();
        });
    }
});
