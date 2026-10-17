import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {layoutWindow} from './helpers/layout-window.js';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import inputs from '../src/components/inputs.js';
import layout, {Formlet} from '../src/components/layout.js';
import {defineComponent, defineCollection} from '../src/components/registry.js';
import {parseChoices} from '../src/components/choices.js';

function fixture(t, author, extra = []) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    layoutWindow(window);
    window.HTMLElement.prototype.showPopover = function () {};
    window.HTMLElement.prototype.hidePopover = function () {};
    window.HTMLElement.prototype.scrollIntoView = function () {};
    const collections = [inputs, layout, ...extra];
    const app = new Gramlot({document: window.document, transport: false, collections});
    const b = new GramlotBuilder(null, {collections});
    author(b.root, app); app.src.startSource(b.toTytx());
    t.after(() => {app.dispose(); window.close();});
    return {app, window, host: id => window.document.getElementById(id),
        fire: (el, type) => el.dispatchEvent(new window.Event(type, {bubbles: true}))};
}

for (const widget of ['textbox', 'textBoxArea', 'passwordbox']) {
    test(`${widget}: uncommitted draft survives own/inherited presentation, IME still accepts external Data`, t => {
        const f = fixture(t, (root, app) => {
            app.data.setItem('name', 'Ada'); app.data.setItem('position', 'TL'); app.data.setItem('color', 'red');
            const form = root.formlet({node_label: 'form', lbl_color: '^color'});
            form[widget]({id: 'field', value: '^name', lbl: 'Name', lbl_position: '^position'});
        });
        const host = f.host('field'), input = host.control;
        input.focus(); input.value = 'Grace'; f.fire(input, 'input'); input.setSelectionRange(1, 3);
        f.app.data.setItem('position', 'L'); f.app.data.setItem('color', 'blue');
        assert.equal(input.value, 'Grace'); assert.equal(f.app.data.getItem('name'), 'Ada');
        assert.equal(host.shadowRoot.activeElement, input); assert.equal(input.selectionStart, 1);
        f.fire(input, 'change'); assert.equal(f.app.data.getItem('name'), 'Grace');
        input.value = 'Draft'; f.fire(input, 'input'); f.app.data.setItem('name', 'External');
        assert.equal(input.value, 'External');
        f.fire(input, 'compositionstart'); input.value = 'Composing'; f.fire(input, 'input');
        f.app.data.setItem('name', 'Server'); assert.equal(input.value, 'Composing');
        f.fire(input, 'compositionend'); assert.equal(input.value, 'Server');
    });
}

test('formlet resolves its own expressions once and only refreshes unmasked inherited defaults', t => {
    globalThis.componentReviewCount = 0;
    t.after(() => {delete globalThis.componentReviewCount;});
    const f = fixture(t, (root, app) => {
        app.data.setItem('cols', 2); app.data.setItem('color', 'red');
        const form = root.formlet({id: 'form', node_label: 'form', columns: '^cols',
            color: '^color', lbl_color: '==(globalThis.componentReviewCount++, color)'});
        form.textbox({id: 'field', lbl: 'Field', value: 'Ada'});
        form.textbox({id: 'override', lbl: 'Own', lbl_color: 'navy'});
        form.formlet({node_label: 'nested', lbl_color: 'green'}).textbox({id: 'nested', lbl: 'Nested'});
        form.p('Ordinary content', {id: 'content'});
    });
    assert.equal(globalThis.componentReviewCount, 1);
    const mutations = new Map();
    for (const id of ['field', 'override', 'nested']) {
        const element = f.host(id), project = element.projectAttributes;
        element.projectAttributes = function (...args) {
            mutations.set(id, (mutations.get(id) ?? 0) + 1); return project.apply(this, args);
        };
    }
    f.app.data.setItem('cols', 1);
    assert.equal(globalThis.componentReviewCount, 2); assert.equal(mutations.size, 0);
    f.app.data.setItem('color', 'blue');
    assert.equal(globalThis.componentReviewCount, 3); assert.deepEqual([...mutations], [['field', 1]]);
    assert.equal(f.host('field').fieldLabel.style.color, 'blue');
    assert.equal(f.host('nested').fieldLabel.style.color, 'green');
    const form = f.app.src.source.getNode('main.form');
    f.app.src.builder.wrapSource(form).textbox({id: 'late', node_label: 'late', lbl: 'Late'});
    assert.equal(globalThis.componentReviewCount, 3); assert.equal(f.host('late').fieldLabel.style.color, 'blue');
    form.value.popNode('late');
    f.app.data.setItem('color', 'purple'); assert.equal(f.host('late'), null);
    form.value.getNode('nested').setAttr({lbl_color: null});
    assert.equal(f.host('nested').fieldLabel.style.color, 'purple');
});

test('presentation capability survives a different component name, copy scope belongs only to groupBox', t => {
    const form = defineComponent({...Formlet, name: 'fieldPanel', tag: 'test-field-panel'});
    const extra = defineCollection({name: 'review', components: [form]});
    const f = fixture(t, (root, app) => {
        app.data.setItem('position', 'L');
        root.fieldPanel({id: 'panel', lbl_position: '^position'}).textbox({id: 'field', lbl: 'Name'});
        root.groupBox({id: 'group', datapath: 'customer'});
    }, [extra]);
    assert.equal(f.host('field').box.dataset.position, 'L');
    f.app.data.setItem('position', 'TR'); assert.equal(f.host('field').box.dataset.position, 'TR');
    assert.equal('readDataScope' in f.host('panel'), false);
    assert.equal(typeof f.host('group').readDataScope, 'function');
});

test('both choice groups honor reactive readonly and unlock without losing their value', t => {
    const f = fixture(t, (root, app) => {
        app.data.setItem('locked', true); app.data.setItem('radio', 'a'); app.data.setItem('checks', 'a');
        root.radioButtonText({id: 'radio', value: '^radio', values: 'a:Alpha,b:Beta', readonly: '^locked'});
        root.checkBoxText({id: 'checks', value: '^checks', values: 'a:Alpha,b:Beta', readonly: '^locked'});
    });
    for (const id of ['radio', 'checks']) {
        const input = f.host(id).control.querySelector('input[value=b]');
        assert.equal(input.disabled, true); input.click(); assert.equal(f.app.data.getItem(id), 'a');
    }
    f.app.data.setItem('locked', false);
    f.host('radio').control.querySelector('input[value=b]').click();
    f.host('checks').control.querySelector('input[value=b]').click();
    assert.equal(f.app.data.getItem('radio'), 'b'); assert.equal(f.app.data.getItem('checks'), 'a,b');
});

test('copy failure, retry and completion leave consistent feedback; removal cancels late feedback', async t => {
    const f = fixture(t, (root, app) => {
        app.data.setItem('customer.name', 'Ada'); root.groupBox({id: 'group', node_label: 'group', copy: true, datapath: 'customer'});
    });
    const group = f.host('group');
    Object.defineProperty(f.window.navigator, 'clipboard', {value: {writeText: async () => {throw Error('denied');}}});
    await group.copyData(); assert.match(group.copyButton.title, /denied/);
    f.window.navigator.clipboard.writeText = async () => {};
    await group.copyData(); assert.equal(group.copyButton.title, 'Copy TYTX');
    assert.equal(group.status.textContent, 'Copied TYTX');
    await assert.rejects(group.copyData('YAML'), /TYTX or JSON/);
    let finish;
    f.window.navigator.clipboard.writeText = () => new Promise(resolve => {finish = resolve;});
    const copying = group.copyData(); f.app.src.source.popNode('main.group'); finish(); await copying;
    assert.equal(group.status.textContent, '');
});

test('local option grammar is shared across groups and text selectors without empty-code fallbacks', t => {
    assert.deepEqual(parseChoices(''), []);
    assert.deepEqual(parseChoices('a:Alpha,b:Caption: detail'), [{id:'a',caption:'Alpha'},{id:'b',caption:'Caption: detail'}]);
    for (const values of ['a:A,,b:B', ':Empty', 'a:A,a:Again']) assert.throws(() => parseChoices(values), /choice code/);
    const f = fixture(t, root => {
        root.radioButtonText({id:'group',values:'a:Alpha,b:Caption: detail'});
        root.filteringSelect({id:'select',values:'a:Alpha,b:Caption: detail'});
    });
    const captions = [...f.host('group').control.querySelectorAll('label span')].map(el => el.textContent);
    assert.deepEqual(f.host('select').loadChoices({_querystring:''}).map(row => row.caption), captions);
});
