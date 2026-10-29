import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {fromTytx, toTytx} from '@genrojs/tytx';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import grouplets from '../src/components/grouplets.js';
import inputs from '../src/components/inputs.js';
import {layoutWindow} from './helpers/layout-window.js';

function wire(author) {
    const builder = new GramlotBuilder(null, {collections: [grouplets, inputs]});
    author(builder.root);
    return builder.toTytx();
}
async function settle() {
    for (let i = 0; i < 8; i++) await new Promise(resolve => setTimeout(resolve, 0));
}
async function fixture(t, author, source) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    layoutWindow(window);
    window.HTMLElement.prototype.showPopover = function () { this.setAttribute('data-test-open', ''); };
    window.HTMLElement.prototype.hidePopover = function () { this.removeAttribute('data-test-open'); };
    window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
    const calls = [];
    const app = new Gramlot({document: window.document, pageId: 'cards', collections: [grouplets, inputs],
        transport: {close() {}, dispose() {}, async call(text) {
            const {id, name, contentType, params} = fromTytx(text);
            if (name !== 'main') calls.push([name, params]);
            return toTytx({id, contentType, value: name === 'main' ? wire(author) : await source(name, params)});
        }}});
    t.after(() => { app.dispose(); window.close(); });
    await app.start(); await settle();
    return {app, window, calls, element: id => window.document.getElementById(id)};
}

test('plain card accepts authored fields without collapse or checkbox, and renders titles as text', async t => {
    const {element} = await fixture(t, root => {
        root.groupletCard({id: 'card', title: '<img src=x onerror=alert(1)>'}).input({value: 'Ada'});
    });
    const card = element('card');
    assert.equal(card.localName, 'gramlot-grouplet-card');
    assert.equal(card.heading.textContent, '<img src=x onerror=alert(1)>');
    assert.equal(card.heading.querySelector('img'), null);
    assert.equal(card.collapseButton.hidden, true);
    assert.equal(card.check.hidden, true);
    assert.equal(card.actionsButton.hidden, true);
    assert.equal(card.controlBox.hidden, false);
    assert.equal(card.querySelector('input').value, 'Ada');
});

test('card Data owns initial, external and interactive title/fold/check states independently', async t => {
    const {app, element} = await fixture(t, root => {
        for (const scope of ['billing', 'shipping']) {
            root.dataSetter({destination_path: `${scope}.title`, value: scope});
            root.dataSetter({destination_path: `${scope}.ui.closed`, value: true});
            root.dataSetter({destination_path: `${scope}.ui.checked`, value: false});
            root.groupletCard({id: scope, datapath: scope, title: '^.title', collapsible: true,
                collapsed: '^.ui.closed', checkbox: '^.ui.checked'}).input({value: '^.city'});
        }
    });
    const shipping = element('shipping'), billing = element('billing');
    assert.equal(shipping.controlBox.hidden, true);
    shipping.heading.click();
    assert.equal(app.data.getItem('shipping.ui.closed'), false);
    assert.equal(shipping.controlBox.hidden, false);
    assert.equal(billing.controlBox.hidden, true);
    shipping.check.click();
    assert.equal(app.data.getItem('shipping.ui.checked'), true);
    assert.equal(app.data.getItem('billing.ui.checked'), false);
    app.data.setItem('shipping.title', 'Goods recipient');
    assert.equal(shipping.heading.textContent, 'Goods recipient');
    shipping.collapseButton.click();
    assert.equal(app.data.getItem('shipping.ui.closed'), true);
    assert.equal(shipping.collapseButton.getAttribute('aria-expanded'), 'false');
    app.data.setItem('shipping.ui.closed', false);
    app.data.setItem('shipping.ui.checked', false);
    assert.equal(shipping.controlBox.hidden, false);
    assert.equal(shipping.check.checked, false);
});

test('nested cards fold independently and preserve fields, DOM, focus and request count', async t => {
    const {app, window, element, calls} = await fixture(t, root => {
        root.dataSetter({destination_path: 'order.closed', value: false});
        root.dataSetter({destination_path: 'order.address.closed', value: false});
        root.dataSetter({destination_path: 'order.address.city', value: 'London'});
        root.groupletCard({id: 'outer', datapath: 'order', title: 'Order', collapsible: true,
            collapsed: '^.closed', remote: 'details'});
    }, () => wire(root => root.groupletCard({id: 'inner', datapath: '.address', title: 'Address',
        collapsible: true, collapsed: '^.closed'}).input({value: '^.city'})));
    const inner = element('inner'), outer = element('outer'), input = inner.querySelector('input');
    input.value = 'Bath'; input.dispatchEvent(new window.Event('change', {bubbles: true}));
    input.focus();
    app.data.setItem('order.address.closed', true);
    assert.equal(inner.shadowRoot.activeElement, inner.collapseButton);
    assert.equal(outer.controlBox.hidden, false);
    outer.collapseButton.click(); outer.collapseButton.click();
    assert.equal(inner.controlBox.hidden, true);
    inner.heading.click();
    assert.equal(element('inner'), inner);
    assert.equal(inner.querySelector('input'), input);
    assert.equal(input.value, 'Bath');
    assert.equal(app.data.getItem('order.address.city'), 'Bath');
    assert.equal(calls.length, 1);
});

test('a remote rebuild restores card states and edits from Data without duplicated headers', async t => {
    const {app, element, calls} = await fixture(t, root => {
        root.dataSetter({destination_path: 'rev', value: 1});
        root.dataSetter({destination_path: 'contact.closed', value: true});
        root.dataSetter({destination_path: 'contact.selected', value: true});
        root.dataSetter({destination_path: 'contact.name', value: 'Ada'});
        root.grouplet({id: 'remote', remote: 'content', remote_revision: '^rev'});
    }, () => wire(root => root.groupletCard({id: 'card', datapath: 'contact', title: '^.name',
        collapsed: '^.closed', collapsible: true, checkbox: '^.selected'}).input({value: '^.name'})));
    app.data.setItem('contact.name', 'Grace');
    app.data.setItem('rev', 2); await settle();
    const card = element('card');
    assert.equal(card.heading.textContent, 'Grace');
    assert.equal(card.controlBox.hidden, true);
    assert.equal(card.check.checked, true);
    assert.equal(card.querySelector('input').value, 'Grace');
    assert.equal(card.shadowRoot.querySelectorAll('.card-header').length, 1);
    assert.deepEqual(calls.map(([, params]) => params.revision), [1, 2]);
});

test('header side and collapsible changes project without erasing Data state', async t => {
    const {app, element} = await fixture(t, root => {
        root.dataSetter({destination_path: 'ui.side', value: 'left'});
        root.dataSetter({destination_path: 'ui.enabled', value: true});
        root.dataSetter({destination_path: 'ui.closed', value: true});
        root.groupletCard({id: 'card', chromeSide: '^ui.side', collapsible: '^ui.enabled',
            collapsed: '^ui.closed'}).span('Retained');
    });
    const card = element('card');
    assert.equal(card.shell.dataset.side, 'left');
    app.data.setItem('ui.side', 'right');
    assert.equal(card.shell.dataset.side, 'right');
    app.data.setItem('ui.enabled', false);
    assert.equal(card.controlBox.hidden, false);
    assert.equal(app.data.getItem('ui.closed'), true);
    app.data.setItem('ui.enabled', true);
    assert.equal(card.controlBox.hidden, true);
});

test('removed cards cannot write Data through retained header controls', async t => {
    const {app, element} = await fixture(t, root => {
        root.dataSetter({destination_path: 'closed', value: false});
        root.dataSetter({destination_path: 'selected', value: false});
        root.groupletCard({id: 'card', nodeId: 'card', collapsible: true,
            collapsed: '^closed', checkbox: '^selected'});
    });
    const card = element('card');
    const node = app.src.binding.nodeIds.get('card');
    node.parentBag.popNode(node.label);
    card.collapseButton.click(); card.check.click();
    assert.equal(app.data.getItem('closed'), false);
    assert.equal(app.data.getItem('selected'), false);
    assert.equal(element('card'), null);
});

test('literal card states follow the shared no-write rule without a private state store', async t => {
    const {element} = await fixture(t, root => {
        root.groupletCard({id: 'card', collapsible: true, collapsed: true, checkbox: false});
    });
    const card = element('card');
    card.collapseButton.click(); card.check.click();
    assert.equal(card.controlBox.hidden, true);
    assert.equal(card.check.checked, false);
});

test('checkboxLabel is visible, reactive, clickable and hidden together with its checkbox', async t => {
    const {app, element} = await fixture(t, root => {
        root.dataSetter({destination_path: 'checked', value: false});
        root.dataSetter({destination_path: 'caption', value: 'Reviewed'});
        root.groupletCard({id: 'card', title: 'Delivery', checkbox: '^checked', checkboxLabel: '^caption'});
    });
    const card = element('card');
    assert.equal(card.checkCaption.textContent, 'Reviewed');
    assert.equal(card.check.getAttribute('aria-label'), 'Reviewed');
    card.checkCaption.click();
    assert.equal(app.data.getItem('checked'), true);
    assert.equal(card.controlBox.hidden, false);
    app.data.setItem('caption', '<b>Approved</b>');
    assert.equal(card.checkCaption.textContent, '<b>Approved</b>');
    assert.equal(card.checkCaption.querySelector('b'), null);
    assert.equal(card.check.getAttribute('aria-label'), '<b>Approved</b>');
    app.data.setItem('checked', null);
    assert.equal(card.checkLabel.hidden, true);
    app.data.setItem('checked', false);
    assert.equal(card.checkLabel.hidden, false);
    card.checkCaption.click();
    assert.equal(app.data.getItem('checked'), true);
});

test('unsupported header sides and legacy collapsed representations are rejected', () => {
    assert.throws(() => wire(root => root.groupletCard({collapsible: 'closed'})));
    const {window} = new JSDOM('');
    grouplets.register(window);
    const card = window.document.createElement('gramlot-grouplet-card');
    assert.throws(() => card.projectAttributes({chromeSide: 'bottom'}), /chromeSide/);
    assert.throws(() => card.projectAttributes({collapsed: 'closed'}), /boolean/);
    assert.throws(() => card.projectAttributes({checkbox: 'yes'}), /boolean/);
    assert.throws(() => card.projectAttributes({delitem: '==!invoiced'}), /boolean/);
    assert.throws(() => card.projectAttributes({doc: {address: 'legacy:doc'}}), /Markdown text/);
    window.close();
});

function actionsAuthor(root) {
    for (const [path, value] of Object.entries({
        'order.number':'SO-1042', 'order.shipping.city':'Bristol',
        'order.shipping.address.street':'River Road', 'order.shipping.static':'Keep',
        'order.shipping.allowed':true, 'order.shipping.ui.closed':false,
        'order.shipping.ui.checked':true, 'order.shipping.unshown':'Retained',
        'order.shippingExtra.city':'External neighbour',
    })) root.dataSetter({destination_path:path, value});
    const card = root.groupletCard({id:'shipping', nodeId:'shipping', datapath:'order.shipping',
        title:'Delivery', delitem:'^.allowed', collapsible:true, collapsed:'^.ui.closed',
        checkbox:'^.ui.checked', checkboxLabel:'Reviewed'});
    card.menu({id:'shipping-menu'}).menuline({caption:'Mark for dispatch', id:'dispatch',
        action:"this.SET('.status', 'Ready')"});
    card.input({value:'^.city'}); card.input({value:'^.city'});
    // A body editor may share a header-state pointer; Clear still preserves it.
    card.input({type:'checkbox', value:'^.ui.checked'});
    card.input({value:'=.static'});
    card.input({value:'^order.number'});
    card.input({value:'^order.shippingExtra.city'});
    card.groupletCard({title:'Address', datapath:'.address'}).input({value:'^.street'});
}
function answer(window, caption) {
    const dialog = window.document.querySelector('dialog');
    assert.ok(dialog, 'shared Source dialog is visible');
    if (caption === 'Cancel') [...dialog.querySelectorAll('button')].find(b => b.textContent === 'Cancel').click();
    else dialog.querySelector('form').dispatchEvent(new window.Event('submit', {bubbles:true,cancelable:true}));
}
test('header menu uses authored actions and a confirmed Clear limited to nested value paths', async t => {
    const {app, element, window} = await fixture(t, actionsAuthor);
    const card = element('shipping');
    card.openMenu();
    assert.equal(card.actionsMenu, element('shipping-menu'));
    assert.equal(card.actionsMenu.slot, 'card-menu');
    element('dispatch').control.click();
    assert.equal(app.data.getItem('order.shipping.status'), 'Ready');
    assert.equal(card.actionsMenu.opened, false);
    card.openMenu(); card.clearItem.control.click();
    answer(window, 'Cancel'); await settle();
    assert.equal(app.data.getItem('order.shipping.city'), 'Bristol');
    card.openMenu(); card.clearItem.control.click();
    answer(window, 'Confirm'); await settle();
    for (const path of ['city','address.street']) assert.equal(app.data.getItem(`order.shipping.${path}`), null);
    assert.equal(app.data.getItem('order.number'), 'SO-1042');
    assert.equal(app.data.getItem('order.shippingExtra.city'), 'External neighbour');
    assert.equal(app.data.getItem('order.shipping.static'), 'Keep');
    assert.equal(app.data.getItem('order.shipping.unshown'), 'Retained');
    assert.equal(app.data.getItem('order.shipping.ui.closed'), false);
    assert.equal(app.data.getItem('order.shipping.ui.checked'), true);
});
test('Clear locks reactively and rechecks its gate after confirmation; null hides only Clear', async t => {
    const {app, element, window} = await fixture(t, actionsAuthor);
    const card = element('shipping');
    const pending = card.cardActions.clear();
    app.data.setItem('order.shipping.allowed', false);
    assert.equal(card.clearItem.disabled, true);
    answer(window, 'Confirm'); await pending;
    assert.equal(app.data.getItem('order.shipping.city'), 'Bristol');
    await card.cardActions.clear();
    assert.equal(window.document.querySelector('dialog'), null);
    app.data.setItem('order.shipping.allowed', null);
    assert.equal(card.clearItem.isConnected, false);
    assert.equal(card.actionsButton.hidden, false);
    app.data.setItem('order.shipping.allowed', true);
    assert.equal(card.actionsMenu.querySelectorAll('gramlot-menu-line').length, 2);
});
test('Clear-only cards use the shared menu and removal cancels a pending confirmation', async t => {
    const {app, element, window} = await fixture(t, root => {
        root.dataSetter({destination_path:'address.city', value:'Bath'});
        root.groupletCard({id:'card', nodeId:'card', datapath:'address', delitem:true}).input({value:'^.city'});
    });
    const card = element('card'), actions = card.cardActions;
    card.openMenu();
    assert.equal(card.actionsMenu.items.length, 1);
    const pending = actions.clear();
    assert.ok(window.document.querySelector('dialog'));
    const node = app.src.binding.nodeIds.get('card');
    node.parentBag.popNode(node.label);
    await pending;
    assert.equal(window.document.querySelector('dialog'), null);
    assert.equal(app.data.getItem('address.city'), 'Bath');
    await actions.clear();
    assert.equal(window.document.querySelector('dialog'), null);
});
test('remote replacement keeps one Clear and invalidates a confirmation for the old body', async t => {
    const {app, element, window} = await fixture(t, root => {
        root.dataSetter({destination_path:'revision', value:1});
        root.dataSetter({destination_path:'address.city', value:'Bath'});
        root.groupletCard({id:'card', datapath:'address', delitem:true, remote:'fields', remote_revision:'^revision'});
    }, () => wire(root => {
        root.menu().menuline({caption:'Mark', action:"this.SET('.marked', true)"});
        root.input({value:'^.city'});
    }));
    const card = element('card');
    const pending = card.cardActions.clear();
    app.data.setItem('revision', 2); await settle();
    answer(window, 'Confirm'); await pending;
    assert.equal(app.data.getItem('address.city'), 'Bath');
    const refreshed = element('card');
    assert.equal(refreshed.actionsMenu.items.length, 2);
    const next = refreshed.cardActions.clear(); answer(window, 'Confirm'); await next;
    assert.equal(app.data.getItem('address.city'), null);
});

test('card guides render Markdown safely and remain usable while folded without Data writes or RPC', async t => {
    const {app, element, window, calls} = await fixture(t, root => {
        root.dataSetter({destination_path:'closed', value:true});
        root.groupletCard({id:'guide', title:'<b>Delivery</b>', collapsible:true, collapsed:'^closed',
            doc:'## Before dispatch\n\n- Verify **access**.\n- Call the contact.\n\n<script>window.bad = true</script>\n\n[Unsafe](javascript:alert(1))'}).input({value:'Do not change'});
    });
    const card = element('guide');
    assert.equal(card.controlBox.hidden, true);
    card.docButton.click();
    assert.equal(card.docButton.getAttribute('aria-expanded'), 'true');
    assert.equal(card.docTitle.textContent, '<b>Delivery</b>');
    assert.equal(card.docTitle.querySelector('b'), null);
    assert.equal(card.docBody.querySelector('strong').textContent, 'access');
    assert.equal(card.docBody.querySelectorAll('li').length, 2);
    assert.equal(card.docBody.querySelector('script'), null);
    assert.equal(card.docBody.querySelector('[href^="javascript:"]'), null);
    assert.equal(card.shadowRoot.activeElement, card.docClose);
    window.document.dispatchEvent(new window.KeyboardEvent('keydown', {key:'Escape', bubbles:true, cancelable:true}));
    assert.equal(card.docButton.getAttribute('aria-expanded'), 'false');
    assert.equal(card.shadowRoot.activeElement, card.docButton);
    assert.equal(app.data.getItem('closed'), true);
    assert.equal(card.querySelector('input').value, 'Do not change');
    assert.equal(calls.length, 0);
});
test('bound guide content/title refresh live and empty content hides the opener without changing another card', async t => {
    const {app, element} = await fixture(t, root => {
        root.dataSetter({destination_path:'guide.title', value:'Delivery'});
        root.dataSetter({destination_path:'guide.text', value:'Send to **Bristol**.'});
        root.groupletCard({id:'guide', title:'^guide.title', doc:'^guide.text', collapsible:true});
        root.groupletCard({id:'other', doc:'Unchanged guide'});
        root.groupletCard({id:'empty', doc:'   '});
    });
    const card=element('guide'); card.openDoc();
    app.data.setItem('guide.text', 'Send to **Bath**.');
    app.data.setItem('guide.title', 'Workshop address');
    assert.equal(card.docBody.querySelector('strong').textContent, 'Bath');
    assert.equal(card.docTitle.textContent, 'Workshop address');
    assert.equal(card.docButton.getAttribute('aria-expanded'), 'true');
    assert.equal(element('other').docBody.textContent.trim(), 'Unchanged guide');
    assert.equal(element('other').docButton.getAttribute('aria-expanded'), 'false');
    assert.equal(element('empty').docButton.hidden, true);
    app.data.setItem('guide.text', '');
    assert.equal(card.docButton.hidden, true);
    assert.equal(card.docButton.getAttribute('aria-expanded'), 'false');
    assert.equal(card.shadowRoot.activeElement, card.collapseButton);
    app.data.setItem('guide.text', 'Restored guide');
    assert.equal(card.docButton.hidden, false);
});
test('guide cleanup releases document events and remote rebuild uses current Data', async t => {
    const {app, element, window} = await fixture(t, root => {
        root.dataSetter({destination_path:'revision', value:1});
        root.dataSetter({destination_path:'help', value:'First guide'});
        root.grouplet({remote:'card', remote_revision:'^revision'});
    }, () => wire(root => root.groupletCard({id:'guide', nodeId:'guide', doc:'^help'})));
    const old=element('guide'); old.openDoc();
    app.data.setItem('help', 'Updated guide');
    app.data.setItem('revision', 2); await settle();
    assert.equal(old.isConnected, false);
    assert.equal(old.docButton.getAttribute('aria-expanded'), 'false');
    old.openDoc();
    assert.equal(old.docButton.getAttribute('aria-expanded'), 'false');
    const current=element('guide'); current.openDoc();
    assert.equal(current.docBody.textContent.trim(), 'Updated guide');
    window.document.dispatchEvent(new window.MouseEvent('pointerdown', {bubbles:true}));
    assert.equal(current.docButton.getAttribute('aria-expanded'), 'false');
    const event=new window.KeyboardEvent('keydown', {key:'Escape',bubbles:true,cancelable:true});
    window.document.dispatchEvent(event);
    assert.equal(event.defaultPrevented, false, 'closed guides retain no Escape handler');
});
test('guide opening and menu opening close the other presentation and preserve nested card states', async t => {
    const {element} = await fixture(t, root => {
        const parent=root.groupletCard({id:'outer', doc:'Outer guide', delitem:true, collapsible:true, collapsed:false});
        parent.groupletCard({id:'inner', doc:'Inner guide', collapsible:true, collapsed:true});
    });
    const outer=element('outer'), inner=element('inner');
    inner.openDoc();
    assert.equal(inner.controlBox.hidden, true);
    assert.equal(outer.controlBox.hidden, false);
    outer.openDoc();
    assert.equal(inner.docButton.getAttribute('aria-expanded'), 'false', 'moving focus to another guide dismisses the previous one');
    outer.openMenu(); outer.openDoc();
    assert.equal(outer.actionsMenu.opened, false);
    outer.openMenu();
    assert.equal(outer.docButton.getAttribute('aria-expanded'), 'false');
    assert.equal(inner.docBody.textContent.trim(), 'Inner guide');
});


test('scoped Clear participates in the common Source form registers without replacing controls', async t => {
    const {app, element, window} = await fixture(t, root => {
        root.dataSetter({destination_path:'record.name', value:'Ada'});
        root.dataSetter({destination_path:'record.reference', value:'Keep'});
        const form = root.div({node_label:'form', form:true, datapath:'record'});
        form.groupletCard({id:'card', title:'Contact', delitem:true})
            .textbox({id:'name', value:'^.name', validate_notnull:true});
    });
    const owner = app.src.builder.source.getNode('main.form');
    const state = owner.formState, field = element('name'), control = field.control;
    assert.equal(state.status.status, 'ok');
    const pending = element('card').cardActions.clear();
    answer(window, 'Confirm'); await pending; await settle();
    assert.equal(app.data.getItem('record.name'), null);
    assert.equal(app.data.getItem('record.reference'), 'Keep');
    assert.equal(state.registers.getItem('changes.name.previous'), 'Ada');
    assert.equal(state.status.status, 'error');
    assert.equal(state.accept(), false);
    assert.equal(owner.formState, state);
    assert.equal(element('name'), field);
    assert.equal(field.control, control);
    state.restore(); await settle();
    assert.equal(app.data.getItem('record.name'), 'Ada');
    assert.equal(state.status.status, 'ok');
    assert.equal(field.control, control);
});
