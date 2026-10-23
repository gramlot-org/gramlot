import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import buttons from '../src/components/buttons.js';

function fixture(author, storage) {
    const window = new JSDOM('<main></main>', {url: 'https://example.test/buttons'}).window;
    // jsdom lacks native popovers. Real keyboard/focus/placement checks run in browsers.
    const matches = window.Element.prototype.matches;
    window.Element.prototype.matches = function (selector) {
        return selector === ':popover-open' ? this.hasAttribute('data-test-open') : matches.call(this, selector);
    };
    window.HTMLElement.prototype.showPopover = function () { this.setAttribute('data-test-open', ''); };
    window.HTMLElement.prototype.hidePopover = function () { this.removeAttribute('data-test-open'); };
    window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
    if (storage) for (const [key, value] of storage) window.localStorage.setItem(key, value);
    const app = new Gramlot({element: window.document.querySelector('main'), transport: false});
    const builder = new GramlotBuilder();
    author(builder.root);
    app.src.startSource(builder.toTytx());
    const element = id => window.document.getElementById(id);
    const click = (id, shiftKey = false) => element(id).control.dispatchEvent(
        new window.MouseEvent('click', {bubbles: true, composed: true, shiftKey}));
    return {window, app, element, click};
}
function dropdown(root) {
    const drop = root.dropDownButton('Default', {id: 'export', persist: true, action: "this.SET('result', 'default')"});
    const menu = drop.menu();
    menu.menuline({caption: 'CSV', id: 'csv', code: 'csv', action: "this.SET('result', 'csv')"});
    menu.menuline('-');
    menu.menuline({caption: 'PDF', id: 'pdf', code: 'pdf', disabled: '^disabled', action: "this.SET('result', 'pdf')"});
}

test('built-in command grammar is portable, case insensitive and keeps html_button native', () => {
    assert.deepEqual(buttons.toDocument(), JSON.parse(readFileSync(new URL('../../src/gramlot/collections/buttons.json', import.meta.url))));
    const b = new GramlotBuilder();
    assert.equal(b.root.TOGGLEBUTTON('Toggle', {value: false}).nodeTag, 'toggleButton');
    assert.throws(() => b.root.toggleButton({value: '^x:!{}'}), /suffix/);
    const {app, element} = fixture(root => {
        root.button('Command', {id: 'command'});
        root.html_button('Native', {id: 'native'});
    });
    assert.equal(element('command').localName, 'gramlot-button');
    assert.equal(element('native').localName, 'button');
    app.dispose();
});
test('toggle LED uses boolean Data, commits before action, obeys readonly and disposes', () => {
    const {app, click, element} = fixture(root => {
        root.dataSetter({destination_path: 'enabled', value: false});
        root.toggleButton('Enabled', {id: 'toggle', value: '^enabled', readonly: '^readonly', disabled: '^disabled',
            action: "this.SET('observed', this.GET('enabled'))"});
    });
    click('toggle'); assert.equal(app.data.getItem('enabled'), true); assert.equal(app.data.getItem('observed'), true);
    assert.equal(element('toggle').control.getAttribute('aria-pressed'), 'true');
    app.data.setItem('enabled', false);
    assert.equal(element('toggle').control.getAttribute('aria-pressed'), 'false');
    app.data.setItem('readonly', true); click('toggle'); assert.equal(app.data.getItem('enabled'), false);
    app.data.setItem('readonly', false); app.data.setItem('disabled', true); click('toggle');
    assert.equal(app.data.getItem('enabled'), false);
    const control = element('toggle').control;
    app.dispose(); control.click(); assert.equal(app.data.getItem('enabled'), false);
});
test('dropdown main, normal menu selection and Shift selection share exactly one executor', () => {
    const {app, click, element} = fixture(dropdown);
    click('export'); assert.equal(app.data.getItem('result'), 'default');
    assert.equal(element('export').menu.matches(':popover-open'), false);
    click('csv'); assert.equal(app.data.getItem('result'), 'csv');
    assert.equal(element('export').commandTarget(), element('export'));
    click('export'); assert.equal(app.data.getItem('result'), 'default');
    click('pdf', true); assert.equal(app.data.getItem('result'), 'pdf');
    assert.equal(element('export').commandTarget(), element('pdf'));
    click('csv'); assert.equal(app.data.getItem('result'), 'csv');
    click('export'); assert.equal(app.data.getItem('result'), 'pdf');
    app.data.setItem('disabled', true); click('export');
    assert.equal(app.data.getItem('result'), 'pdf');
    app.dispose();
});
test('persist restores only a command code; a missing saved item uses authored default', () => {
    const first = fixture(dropdown);
    first.click('csv', true);
    const storage = Object.entries(first.window.localStorage);
    assert.equal(storage.length, 1); assert.equal(storage[0][1], 'csv');
    first.app.dispose();
    const second = fixture(dropdown, storage);
    second.click('export'); assert.equal(second.app.data.getItem('result'), 'csv'); second.app.dispose();
    const missing = fixture(root => root.dropDownButton('Default', {id: 'export', persist: true, action: "this.SET('result','default')"}), storage);
    missing.click('export'); assert.equal(missing.app.data.getItem('result'), 'default'); missing.app.dispose();
    assert.throws(() => fixture(root => root.dropDownButton('No identity', {persist: true})), /explicit id/);
});
test('menu keyboard movement excludes disabled entries and Escape restores arrow focus', () => {
    const {app, element, window} = fixture(dropdown);
    const drop = element('export');
    app.data.setItem('disabled', true);
    drop.openMenu(); assert.equal(element('csv').shadowRoot.activeElement, element('csv').control);
    element('csv').control.dispatchEvent(new window.KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true, composed: true}));
    assert.equal(element('csv').shadowRoot.activeElement, element('csv').control);
    element('csv').control.dispatchEvent(new window.KeyboardEvent('keydown', {key: 'Escape', bubbles: true, composed: true}));
    assert.equal(drop.shadowRoot.activeElement, drop.shadowRoot.querySelector('.arrow'));
    assert.equal(drop.menu.matches(':popover-open'), false);
    app.dispose();
});
test('a button disabled while ask is open cannot execute after confirmation', async () => {
    const {app, element, window, click} = fixture(root => root.button('Confirm', {id: 'ask',
        disabled: '^disabled', ask: 'Continue?', action: "this.SET('executed', true)"}));
    click('ask'); app.data.setItem('disabled', true);
    window.document.querySelector('dialog form').dispatchEvent(new window.Event('submit', {bubbles: true, cancelable: true}));
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(app.data.getItem('executed'), null);
    assert.equal(element('ask').disabled, true); app.dispose();
});

test('popup padding and separators never execute the main action', () => {
    const {app, element, window} = fixture(dropdown);
    const drop = element('export');
    drop.openMenu();
    for (const target of [drop.menu, drop.querySelector('[role=separator]')]) {
        target.dispatchEvent(new window.MouseEvent('click', {bubbles: true, composed: true}));
        assert.equal(app.data.getItem('result'), null);
    }
    app.dispose();
});

test('disabling a dropdown during a menu confirmation blocks the pending command', async () => {
    const {app, click, window} = fixture(root => root.dropDownButton('Run', {id: 'drop', disabled: '^locked'})
        .menu().menuline({caption: 'Confirm', id: 'item', code: 'item', ask: 'Proceed?', action: "this.SET('executed',true)"}));
    click('item'); app.data.setItem('locked', true);
    window.document.querySelector('dialog form').dispatchEvent(new window.Event('submit', {bubbles: true, cancelable: true}));
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(app.data.getItem('executed'), null); app.dispose();
});
test('command code remains Source-authored for every family member', () => {
    for (const name of ['button', 'toggleButton', 'dropDownButton']) {
        assert.throws(() => fixture(root => root[name]('Unsafe', {action: '^code'})), /inline code.*cannot be the pointer/);
    }
    assert.throws(() => fixture(root => root.dropDownButton('Run').menu().menuline({caption: 'Unsafe', code: 'x', action: '^code'})), /inline code.*cannot be the pointer/);
});
test('storage failure does not prevent selecting and executing the in-memory default', () => {
    const {app, window, click, element} = fixture(dropdown);
    window.Storage.prototype.setItem = () => { throw new Error('Storage denied'); };
    click('csv', true); assert.equal(element('export').commandTarget(), element('csv'));
    app.data.setItem('result', null); click('export'); assert.equal(app.data.getItem('result'), 'csv');
    app.dispose();
});
