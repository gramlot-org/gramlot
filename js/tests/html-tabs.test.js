import assert from 'node:assert/strict';
import test from 'node:test';
import {JSDOM} from 'jsdom';
import {HtmlBuilder, SourceBag} from 'genro-builders-js';
import {GramlotRenderer} from '../src/renderer/gramlot-renderer.js';

function fixture(keys = ['catalog', 'e01', 'e02']) {
    const document = new JSDOM('<main id="root"></main>').window.document;
    const builder = new HtmlBuilder();
    const branch = () => new SourceBag(null, builder);
    const add = (parent, label, tag, value = '', attrs = {}) =>
        builder.setChild(parent, tag, value, {node_label: label, ...attrs});
    const shell = add(builder.source, 'shell', 'div', branch(), {data_gramlot_tabs: 'catalog'});
    const sidebar = add(shell.value, 'sidebar', 'aside', branch());
    const tabs = add(shell.value, 'tabs', 'div', branch(), {role: 'tablist'});
    const panels = add(shell.value, 'panels', 'div', branch());
    const nodes = new Map();
    for (const key of keys) {
        const active = key === 'catalog';
        const open = add(sidebar.value, `open_${key}`, 'button', key,
            {data_gramlot_open: key, aria_current: active ? 'page' : null});
        const tab = add(tabs.value, `tab_${key}`, 'button', key,
            {data_gramlot_tab: key, role: 'tab', id: `tab-${key}`,
                aria_controls: `panel-${key}`, aria_selected: String(active),
                tabindex: active ? 0 : -1, hidden: !active});
        const panel = add(panels.value, `panel_${key}`, 'section', branch(),
            {data_gramlot_panel: key, role: 'tabpanel', id: `panel-${key}`,
                aria_labelledby: `tab-${key}`, hidden: !active});
        add(panel.value, `description_${key}`, 'p', `Description ${key}`);
        const frame = add(panel.value, `frame_${key}`, 'iframe', '',
            {data_gramlot_frame: key, data_gramlot_src: key, src: active ? key : null});
        nodes.set(key, {open, tab, panel, frame});
    }
    return {document, builder, shell, nodes};
}

function mount(f) {
    return new GramlotRenderer(f.builder, f.builder.source,
        f.document.getElementById('root')).mount();
}

function click(element, document) {
    element.dispatchEvent(new document.defaultView.MouseEvent('click', {bubbles: true}));
}

test('sidebar opens each tab once, reactivates it and preserves the iframe', () => {
    const f = fixture();
    const renderer = mount(f);
    const document = f.document;
    const e01 = f.nodes.get('e01');
    assert.equal(e01.frame.getAttr('src'), null);
    click(document.querySelector('[data-gramlot-open="e01"]'), document);
    const frame = document.querySelector('[data-gramlot-frame="e01"]');
    assert.equal(frame.getAttribute('src'), 'e01');
    assert.equal(e01.frame.getAttr('src'), 'e01');
    assert.equal(document.querySelector('[data-gramlot-panel="e01"]').hidden, false);
    assert.equal(document.querySelector('[data-gramlot-panel="catalog"]').hidden, true);
    assert.equal(document.querySelector('[data-gramlot-tab="e01"]').getAttribute('aria-selected'), 'true');
    assert.equal(document.querySelector('[data-gramlot-open="e01"]').getAttribute('aria-current'), 'page');
    click(document.querySelector('[data-gramlot-open="e02"]'), document);
    assert.equal(document.querySelector('[data-gramlot-tab="e01"]').hidden, false);
    click(document.querySelector('[data-gramlot-tab="e01"]'), document);
    assert.equal(document.querySelector('[data-gramlot-frame="e01"]'), frame);
    assert.equal(document.querySelector('[data-gramlot-panel="e01"]').hidden, false);
    renderer.dispose();
});

test('tab keyboard selects opened tabs and moves focus', () => {
    const f = fixture();
    const renderer = mount(f);
    const document = f.document;
    click(document.querySelector('[data-gramlot-open="e01"]'), document);
    click(document.querySelector('[data-gramlot-open="e02"]'), document);
    const tab = document.querySelector('[data-gramlot-tab="e02"]');
    tab.focus();
    tab.dispatchEvent(new document.defaultView.KeyboardEvent('keydown', {key: 'Home', bubbles: true}));
    assert.equal(document.activeElement, document.querySelector('[data-gramlot-tab="catalog"]'));
    assert.equal(document.querySelector('[data-gramlot-panel="catalog"]').hidden, false);
    document.activeElement.dispatchEvent(new document.defaultView.KeyboardEvent('keydown',
        {key: 'ArrowLeft', bubbles: true}));
    assert.equal(document.activeElement, tab);
    renderer.dispose();
});

test('renderer rebuild restores active and opened tabs from Source', () => {
    const f = fixture();
    const renderer = mount(f);
    const document = f.document;
    click(document.querySelector('[data-gramlot-open="e01"]'), document);
    click(document.querySelector('[data-gramlot-open="e02"]'), document);
    assert.equal(f.shell.getAttr('data_gramlot_tabs'), 'e02');
    renderer.freeze(f.shell);
    renderer.unfreeze(f.shell);
    assert.equal(document.querySelector('[data-gramlot-panel="e02"]').hidden, false);
    assert.equal(document.querySelector('[data-gramlot-tab="e01"]').hidden, false);
    assert.equal(document.querySelector('[data-gramlot-frame="e01"]').getAttribute('src'), 'e01');
    click(document.querySelector('[data-gramlot-tab="e01"]'), document);
    assert.equal(f.shell.getAttr('data_gramlot_tabs'), 'e01');
    assert.equal(document.querySelector('[data-gramlot-panel="e01"]').hidden, false);
    assert.equal(document.querySelectorAll('[data-gramlot-tab="e01"]').length, 1);
    renderer.dispose();
});

test('tab instances stay isolated and listeners end with Source cleanup', () => {
    const first = fixture(), second = fixture();
    const a = mount(first), b = mount(second);
    const oldButton = first.document.querySelector('[data-gramlot-open="e01"]');
    const laterButton = first.document.querySelector('[data-gramlot-open="e02"]');
    click(oldButton, first.document);
    assert.equal(first.nodes.get('e01').frame.getAttr('src'), 'e01');
    assert.equal(second.nodes.get('e01').frame.getAttr('src'), null);
    first.builder.source.popNode('shell');
    click(laterButton, first.document);
    assert.equal(first.nodes.get('e02').frame.getAttr('src'), null);
    a.dispose();
    b.dispose();
});

test('malformed or duplicate declarations are rejected', () => {
    const missing = fixture();
    missing.nodes.get('e01').tab.setAttr({aria_controls: 'wrong'});
    assert.throws(() => mount(missing), /Invalid HTML tab declaration/);
    const duplicate = fixture();
    const extra = new SourceBag(null, duplicate.builder);
    duplicate.builder.setChild(extra, 'button', 'duplicate',
        {node_label: 'duplicate', data_gramlot_open: 'e01'});
    duplicate.shell.value.setItem('extra', extra);
    assert.throws(() => mount(duplicate), /duplicate data_gramlot_open/);
});
