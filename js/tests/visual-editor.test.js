import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder, Bag} from '../src/index.js';
import inputs from '../src/components/inputs.js';
import layout from '../src/components/layout.js';
import tree from '../src/components/tree.js';
import uploads from '../src/components/uploads.js';
import {VisualEditor} from '../src/server/visual-editor.js';
import {VisualEditorLogic as Logic} from '../src/visual-editor.js';
import {SourceImport} from '../src/server/source-import.js';
class Page {
    main(root) { new VisualEditor(root, {datapath:this.dataRoot === '' ? '__editor' : 'visualEditor', dataRoot:this.dataRoot, catalogue:this.catalogue}); }
    import_source(metadata) {
        if (!metadata.name.toLowerCase().endsWith('.grmlt')) throw new Error('Expected a .grmlt file');
        return new SourceImport();
    }
}

const rootPath = 'main.visual.layout.center.design.pageRoot';
const tick = () => new Promise(resolve => setTimeout(resolve, 30));
function fixture(t, dataRoot = 'pageData', seed = true, second = false, catalogue = null) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>', {pretendToBeVisual:true});
    window.ResizeObserver = class {observe() {} unobserve() {} disconnect() {}};
    Object.defineProperty(window.document, 'fonts', {value:new window.EventTarget()});
    window.HTMLDialogElement.prototype.show = window.HTMLDialogElement.prototype.showModal = function () {this.open = true;};
    window.HTMLDialogElement.prototype.close = function () {this.open = false;};
    window.HTMLElement.prototype.showPopover = function () {};
    const collections = [inputs, layout, tree, uploads];
    const app = new Gramlot({document:window.document, transport:false, collections});
    app.src.logicRegistry.register(Logic, {group:null, resource:'visual-source-test'});
    const builder = new GramlotBuilder(null, {collections});
    const page = new Page();
    page.dataRoot = dataRoot;
    page.catalogue = catalogue;
    page.main(builder.root);
    if (second) new VisualEditor(builder.root.section({node_label:'workspace'}), {editorId:'second', datapath:'otherEditor', dataRoot:'otherData'});
    app.src.startSource(builder.toTytx());
    t.after(() => {app.dispose(); window.close();});
    const source = app.src.source;
    if (seed) {
        const page = app.src.builder.wrapSource(source.getNode(rootPath));
        page.h2('Your page');
        page.p('Example paragraph');
    }
    const node = source.getNode('main.visual');
    const call = (name, ...args) => {
        const {group, method} = app.src.logicRegistry.resolve(name, node);
        return method.call(group, node, ...args);
    };
    const drop = (tag, path = 'pageRoot') => call('dropNode', {
        item:source.getNode('main.visual.layout.center.design.' + path), path, dropValues:{'app/widget':{tag}}
    });
    return {app, source, node, window, call, drop};
}

test('catalogue keeps every installed widget once, with logical HTML and Gramlot branches', t => {
    const f = fixture(t), catalogue = f.app.data.getItem('visualEditor.catalogue');
    assert.equal(catalogue.getNode('components.commands.button').getAttr('tag'), 'button');
    assert.equal(catalogue.getNode('components.layout.containers.borderContainer').getAttr('tag'), 'borderContainer');
    assert.equal(catalogue.getNode('html.text.p').getAttr('tag'), 'p');
    const tags = [];
    const visit = bag => {for (const node of bag.getNodes()) {
        if (node.value instanceof Bag) {assert.equal(node.getAttr('tag'), null); visit(node.value);}
        else tags.push(node.getAttr('tag'));
    }};
    visit(catalogue);
    const expected = Object.entries(f.node.builder.schema).filter(([, info]) =>
        !info._meta?.data_element && !info._meta?.subbuilder && !info._meta?.container).map(([tag]) => tag);
    assert.deepEqual(tags.sort(), expected.sort());
});

test('native tree search reveals a widget below collapsed catalogue groups', async t => {
    const f = fixture(t);
    f.app.data.setItem('visualEditor.catalogueSearch', 'borderContainer');
    await new Promise(resolve => setTimeout(resolve, 300));
    const tree = f.window.document.getElementById('visual-widget-tree');
    assert.equal(tree.shadowRoot.querySelector('[data-path="components.layout.containers.borderContainer"] mark').textContent, 'borderContainer');
});

test('drop inserts immediately, selects the node and opens editable properties', async t => {
    const f = fixture(t);
    f.drop('button');
    const inserted = f.source.getNode(rootPath + '.button_0');
    assert.ok(inserted);
    assert.equal(f.app.data.getItem('visualEditor.selection'), 'pageRoot.button_0');
    await tick();
    assert.equal(f.app.data.getItem('visualEditor.insertionOpen'), false);
    assert.equal(f.app.data.getItem('visualEditor.propertiesOpen'), true);
    assert.equal(f.app.data.getItem('visualEditor.propertiesTitle'), 'button_0 [button]');
    f.app.data.setItem('visualEditor.properties.parameters._text.T', 'Open catalogue');
    f.app.data.setItem('visualEditor.properties.parameters.action.T', 'openCatalogue');
    await tick();
    assert.equal(inserted.value, 'Open catalogue');
    assert.equal(inserted.getAttr('action'), 'openCatalogue');
    const selected = f.window.document.getElementById('visual-source-tree').shadowRoot
        .querySelector('[data-path="pageRoot.button_0"]');
    assert.equal(selected.getAttribute('aria-selected'), 'true');
});

test('selection hydrates properties without changing existing nodes and edits only the current node', async t => {
    const f = fixture(t);
    const heading = f.source.getNode(rootPath + '.h2_0');
    const attrs = {...heading.getAttr()}, text = heading.value;
    f.app.data.setItem('visualEditor.selection', 'pageRoot.h2_0');
    await tick();
    assert.equal(f.app.data.getItem('visualEditor.properties.parameters._text.T'), text);
    assert.deepEqual(heading.getAttr(), attrs);
    addAttribute(f, 'pageRoot.h2_0', 'color', 'string', 'navy');
    await tick();
    assert.equal(heading.getAttr('color'), 'navy');
    f.app.data.setItem('visualEditor.selection', 'pageRoot.p_0');
    await tick();
    f.app.data.setItem('visualEditor.properties.parameters._text.T', 'Updated paragraph');
    await tick();
    assert.equal(heading.value, text);
    assert.equal(f.source.getNode(rootPath + '.p_0').value, 'Updated paragraph');
    f.app.data.setItem('visualEditor.selection', 'pageRoot.h2_0');
    await tick();
    assert.equal(f.node.GET(`.properties.attributeRows.${attributeRow(f, 'color')}.text`), 'navy');
    f.call('removeAttribute', {attributeRow:attributeRow(f, 'color'), editingPath:'pageRoot.h2_0'});
    await tick();
    assert.equal(Object.hasOwn(heading.getAttr(), 'color'), false);
    f.app.data.setItem('visualEditor.selection', 'pageRoot');
    await tick();
    assert.equal(f.app.data.getItem('visualEditor.properties.types._text'), null);
    assert.ok(f.source.getNode(rootPath + '.h2_0'));
});

test('required-only insertion asks for region, preserves the node on invalid property changes', async t => {
    const f = fixture(t);
    f.app.src.builder.wrapSource(f.source.getNode(rootPath)).borderContainer({node_label:'border'});
    f.drop('button', 'pageRoot.border');
    await tick();
    assert.equal(f.app.data.getItem('visualEditor.insertionOpen'), true);
    assert.equal(f.source.getNode(rootPath + '.border.button_0'), null);
    assert.equal(f.app.data.getItem('visualEditor.insertion.types.action'), null);
    f.call('insertWidget');
    assert.equal(f.app.data.getItem('visualEditor.error'), 'Choose region');
    f.app.data.setItem('visualEditor.insertion.parameters.region', 'center');
    f.call('insertWidget');
    await tick();
    const child = f.source.getNode(rootPath + '.border.button_0');
    assert.equal(child.getAttr('region'), 'center');
    assert.equal(f.app.data.getItem('visualEditor.selection'), 'pageRoot.border.button_0');
    f.app.data.setItem('visualEditor.properties.parameters.region', '');
    await tick();
    assert.equal(f.app.data.getItem('visualEditor.propertyError'), 'Choose region');
    assert.equal(child.getAttr('region'), 'center');
    f.drop('contentPane', 'pageRoot.border');
    f.app.data.setItem('visualEditor.insertion.parameters.region', 'center');
    f.call('insertWidget');
    assert.equal(f.app.data.getItem('visualEditor.error'), 'region is already in use');
    assert.equal(f.source.getNode(rootPath + '.border.contentPane_0'), null);
});

test('tab child creation asks only for title, then properties edit title and pageName', async t => {
    const f = fixture(t);
    f.app.src.builder.wrapSource(f.source.getNode(rootPath)).tabContainer({node_label:'tabs'});
    f.drop('formlet', 'pageRoot.tabs');
    await tick();
    assert.equal(f.app.data.getItem('visualEditor.insertionOpen'), true);
    assert.equal(f.app.data.getItem('visualEditor.insertion.types.title'), 'T');
    assert.equal(f.app.data.getItem('visualEditor.insertion.types.pageName'), null);
    assert.equal(f.app.data.getItem('visualEditor.insertion.types.columns'), null);
    f.call('insertWidget');
    assert.equal(f.app.data.getItem('visualEditor.error'), 'Choose title');
    f.app.data.setItem('visualEditor.insertion.parameters.title.T', 'Customer details');
    f.call('insertWidget');
    await tick();
    const child = f.source.getNode(rootPath + '.tabs.formlet_0');
    assert.equal(child.getAttr('title'), 'Customer details');
    assert.equal(f.app.data.getItem('visualEditor.parameterTab'), 'general');
    f.app.data.setItem('visualEditor.properties.parameters.pageName.T', 'customer');
    f.app.data.setItem('visualEditor.properties.parameters.title.T', 'Details');
    await tick();
    assert.equal(child.getAttr('pageName'), 'customer');
    const element = f.window.document.querySelector('.visual-editor-canvas gramlot-tab-container');
    assert.equal(element.shadowRoot.querySelector('[role="tab"]').textContent.trim(), 'Details');
    f.app.data.setItem('visualEditor.properties.parameters.title.T', '');
    await tick();
    assert.equal(f.app.data.getItem('visualEditor.propertyError'), 'Choose title');
    assert.equal(child.getAttr('title'), 'Details');
    f.drop('formlet', 'pageRoot.tabs');
    f.app.data.setItem('visualEditor.insertion.parameters.title.T', 'Other');
    f.call('insertWidget');
    await tick();
    f.app.data.setItem('visualEditor.properties.parameters.pageName.T', 'customer');
    await tick();
    assert.equal(f.app.data.getItem('visualEditor.propertyError'), 'pageName is already in use');
    assert.equal(f.source.getNode(rootPath + '.tabs.formlet_1').getAttr('pageName'), null);
});

test('union editors retain per-type values and update the selected Source attribute', async t => {
    const f = fixture(t);
    f.drop('formlet');
    await tick();
    const child = f.source.getNode(rootPath + '.formlet_0');
    f.app.data.setItem('visualEditor.properties.parameters.columns.L', 3);
    await tick();
    assert.equal(child.getAttr('columns'), 3);
    f.app.data.setItem('visualEditor.properties.types.columns', 'T');
    await tick();
    f.app.data.setItem('visualEditor.properties.parameters.columns.T', '120px 1fr');
    await tick();
    assert.equal(child.getAttr('columns'), '120px 1fr');
    f.app.data.setItem('visualEditor.properties.types.columns', 'L');
    await tick();
    assert.equal(child.getAttr('columns'), 3);
});

test('sidebar trees expose only page roots and page bindings share the configured Data root', async t => {
    const f = fixture(t, 'document.customerPage');
    f.app.data.setItem('document.customerPage.customer.name', 'Ada');
    f.app.data.setItem('unrelated.privateValue', 'Outside the page');
    f.app.data.setItem('visualEditor.dataSearch', 'name');
    await new Promise(resolve => setTimeout(resolve, 300));
    const tree = f.window.document.getElementById('visual-data-tree');
    assert.ok(tree.shadowRoot.querySelector('[data-path="customer.name"] mark'));
    assert.equal(tree.shadowRoot.querySelector('[data-path="visualEditor"]'), null);
    assert.equal(tree.shadowRoot.querySelector('[data-path="unrelated"]'), null);
    assert.equal(f.source.getNode('main.visual.layout.left.borderContainer_0.contentPane_0.borderContainer_0.data.tree_0').getAttr('storepath'), '*D.document.customerPage');
    const page = f.source.getNode(rootPath);
    const input = f.app.src.builder.wrapSource(page).textbox({node_label:'customerName', value:'^.customer.name'});
    await tick();
    assert.equal(input.GET('.customer.name'), 'Ada');
    input.SET('.customer.name', 'Grace');
    await tick();
    assert.equal(f.app.data.getItem('document.customerPage.customer.name'), 'Grace');
    assert.equal(f.app.data.getItem('visualEditor.customer.name'), null);
    const sourceTree = f.window.document.getElementById('visual-source-tree');
    assert.ok(sourceTree.shadowRoot.querySelector('[data-path="pageRoot"]'));
    assert.equal(sourceTree.shadowRoot.querySelector('[data-path="visual"]'), null);
    assert.equal(sourceTree.shadowRoot.querySelector('[data-path="floatingPane_0"]'), null);
});

test('moving a Source node updates the selection and properties destination', async t => {
    const f = fixture(t);
    f.app.src.builder.wrapSource(f.source.getNode(rootPath)).div({node_label:'target'});
    f.call('dropNode', {item:f.source.getNode(rootPath + '.target'), path:'pageRoot.target',
        dropValues:{'app/source':{path:'pageRoot.h2_0'}}});
    await tick();
    assert.equal(f.app.data.getItem('visualEditor.selection'), 'pageRoot.target.h2_0');
    assert.equal(f.app.data.getItem('visualEditor.properties.path'), 'pageRoot.target.h2_0');
    assert.equal(f.source.getNode(rootPath + '.target.h2_0').value, 'Your page');
});


test('activity rail controls the drawer and reopen catalogue and selected-node properties', async t => {
    const f = fixture(t);
    const frame = f.window.document.getElementById('visual-editor-frame');
    assert.equal(frame.localName, 'gramlot-frame-pane');
    const top = f.source.getNode('main.visual.layout.top');
    assert.equal(top.getAttr('region'), 'top');
    const buttons = frame.querySelector('[slot="top"]').querySelectorAll('gramlot-button');
    assert.equal(buttons.length, 7);
    const rail = f.window.document.querySelector('.visual-editor-rail');
    const command = name => rail.querySelector(`gramlot-button[aria-label="${name}"]`).shadowRoot.querySelector('button');
    command('Source / Data').click();
    await tick();
    assert.equal(f.app.data.getItem('visualEditor.navigationOpen'), 'close');
    command('Source / Data').click();
    await tick();
    assert.equal(f.app.data.getItem('visualEditor.navigationOpen'), true);
    f.app.data.setItem('visualEditor.catalogueOpen', false);
    command('Catalogue').click();
    await tick();
    assert.equal(f.app.data.getItem('visualEditor.catalogueOpen'), true);
    f.app.data.setItem('visualEditor.selection', 'pageRoot.h2_0');
    await tick();
    f.app.data.setItem('visualEditor.propertiesOpen', false);
    command('Properties').click();
    await tick();
    assert.equal(f.app.data.getItem('visualEditor.propertiesOpen'), true);
    assert.equal(f.app.data.getItem('visualEditor.properties.path'), 'pageRoot.h2_0');
});


test('tool starts with one empty selected root and its properties open', async t => {
    const f = fixture(t, 'pageData', false);
    await tick();
    const page = f.source.getNode(rootPath);
    assert.equal(page.getValue(true), null);
    assert.equal(f.app.data.getItem('visualEditor.selection'), 'pageRoot');
    assert.equal(f.app.data.getItem('visualEditor.propertiesOpen'), true);
    assert.equal(f.app.data.getItem('visualEditor.catalogueOpen'), false);
    assert.equal(f.window.document.querySelectorAll('#visual-editor-frame gramlot-button img').length, 0);
    for (const button of f.window.document.querySelectorAll('#visual-editor-frame [slot="top"] gramlot-button')) {
        assert.match(button.querySelector('.visual-tool-icon').style.maskImage, /data:image\/svg\+xml,/);
    }
});

test('download is the typed page Source alone and New resets only the edited page', async t => {
    const f = fixture(t);
    f.drop('tabContainer');
    f.drop('formlet', 'pageRoot.tabContainer_0');
    f.app.data.setItem('visualEditor.insertion.parameters.title.T', 'Details');
    f.call('insertWidget');
    await tick();
    let saved;
    f.app.utl.inout.saveText = (text, filename, type) => { saved = {text, filename, type}; };
    f.call('downloadPage');
    assert.equal(saved.filename, 'page.grmlt');
    assert.equal(saved.type, 'application/json');
    const restored = f.app.src.prepareSource(saved.text);
    assert.deepEqual(restored.getNodes().map(n => n.label), ['pageRoot']);
    assert.equal(restored.getNode('pageRoot.tabContainer_0.formlet_0').getAttr('title'), 'Details');
    assert.equal(restored.getNode('pageRoot.h2_0').value, 'Your page');
    assert.equal(restored.getNode('visual'), null);
    const catalogue = f.app.data.getItem('visualEditor.catalogue');
    f.app.data.setItem('pageData.customer.name', 'Ada');
    f.app.data.setItem('outside.keep', 'Untouched');
    f.window.document.getElementById('visual-new').shadowRoot.querySelector('button').click();
    await tick();
    assert.equal(f.source.getNode(rootPath).getValue(true), null);
    assert.equal(f.app.data.getItem('pageData').getNodes().length, 0);
    assert.equal(f.app.data.getItem('outside.keep'), 'Untouched');
    assert.equal(f.app.data.getItem('visualEditor.catalogue'), catalogue);
    assert.equal(f.app.data.getItem('visualEditor.selection'), 'pageRoot');
    assert.equal(f.app.data.getItem('visualEditor.propertiesOpen'), true);
});


test('Copy Source uses the same page-only TYTX as download and reports clipboard failure', async t => {
    const f = fixture(t);
    let downloaded, copied;
    f.app.utl.inout.saveText = text => { downloaded = text; };
    f.app.utl.inout.copyText = async text => { copied = text; };
    f.call('downloadPage');
    await f.call('copySource');
    assert.equal(copied, downloaded);
    assert.equal(f.app.data.getItem('visualEditor.fileStatus'), 'Source copied');
    const before = f.source.getNode(rootPath).getValue(true).toTytx();
    f.app.utl.inout.copyText = async () => { throw new Error('Permission denied'); };
    await f.call('copySource');
    assert.equal(f.app.data.getItem('visualEditor.fileStatus'), 'Copy failed: Permission denied');
    assert.equal(f.source.getNode(rootPath).getValue(true).toTytx(), before);
});


test('Label and Box use one compact attribute row and retain values across choices and selections', async t => {
    const f = fixture(t);
    f.drop('textbox');
    await tick();
    const first = f.source.getNode(rootPath + '.textbox_0');
    const data = f.app.data;
    assert.equal(data.getItem('visualEditor.parameterTab'), 'general');
    const button = f.window.document.querySelector('[aria-label="Edit label attributes"]');
    assert.ok(button);
    button.shadowRoot.querySelector('button').click();
    await tick();
    assert.equal(data.getItem('visualEditor.properties.lblHidden'), false);
    assert.equal(f.window.document.querySelector('.visual-labelbox-attribute').hidden, false);
    const select = f.window.document.querySelector('select[aria-label="Label attribute"]');
    assert.ok([...select.options].some(option => option.value === 'lbl_position'));
    assert.ok([...select.options].some(option => option.value === 'lbl_color'));
    select.value = 'lbl_color';
    select.dispatchEvent(new f.window.Event('change', {bubbles:true}));
    await tick();
    assert.ok(f.window.document.querySelector('.visual-labelbox-attribute gramlot-colorpicker'));
    assert.equal(first.getAttr('lbl_color'), null, 'choosing an attribute must not write a default');
    data.setItem('visualEditor.properties.parameters.lbl_color.T', '#123456');
    data.setItem('visualEditor.properties.parameters.lbl.T', 'Name');
    await tick();
    assert.equal(first.getAttr('lbl_color'), '#123456');
    assert.equal(first.getAttr('lbl'), 'Name');
    data.setItem('visualEditor.properties.lblAttribute', 'lbl_position');
    await tick();
    data.setItem('visualEditor.properties.parameters.lbl_position', 'L');
    await tick();
    assert.equal(first.getAttr('lbl_position'), 'L');
    assert.equal(first.getAttr('lbl_color'), '#123456');
    data.setItem('visualEditor.properties.lblAttribute', 'lbl_color');
    await tick();
    assert.equal(data.getItem('visualEditor.properties.parameters.lbl_color.T'), '#123456');
    data.setItem('visualEditor.properties.boxAttribute', 'box_width');
    await tick();
    data.setItem('visualEditor.properties.parameters.box_width.T', '240px');
    await tick();
    assert.equal(first.getAttr('box_width'), '240px');
    f.drop('textbox');
    await tick();
    data.setItem('visualEditor.properties.lblAttribute', 'lbl_color');
    await tick();
    data.setItem('visualEditor.properties.parameters.lbl_color.T', '#abcdef');
    await tick();
    assert.equal(first.getAttr('lbl_color'), '#123456');
    assert.equal(f.source.getNode(rootPath + '.textbox_1').getAttr('lbl_color'), '#abcdef');
    data.setItem('visualEditor.selection', 'pageRoot.textbox_0');
    await tick();
    data.setItem('visualEditor.properties.lblAttribute', 'lbl_color');
    await tick();
    assert.equal(data.getItem('visualEditor.properties.parameters.lbl_color.T'), '#123456');
    data.setItem('visualEditor.properties.parameters.lbl_color.T', '');
    await tick();
    assert.equal(first.getAttr('lbl_color'), null);
    assert.equal(first.getAttr('lbl_position'), 'L');
    assert.equal(first.getAttr('box_width'), '240px');
});


test('uploaded Source opens and an invalid Source preserves the edited page', async t => {
    const f = fixture(t);
    const builder = new GramlotBuilder();
    builder.root.div({node_label:'pageRoot'}).p('Imported design');
    const item = {value:new Bag({name:'example.grmlt'})};
    f.call('sourceUploaded', {item, result:builder.toTytx()});
    const design = f.source.getNode('main.visual.layout.center.design');
    assert.match(design.value.toTytx(), /Imported design/);
    assert.equal(f.app.data.getItem('visualEditor.filename'), 'example.grmlt');
    const before = design.value.toTytx();
    assert.throws(() => f.call('sourceUploaded', {item, result:'not-tytx'}));
    assert.equal(design.value.toTytx(), before);
    assert.match(f.app.data.getItem('visualEditor.fileStatus'), /^Open failed:/);
    const imported = f.source.getNode(rootPath + '.p_0');
    f.app.src.renderer.records.get(imported).element.click();
    await tick();
    assert.equal(f.app.data.getItem('visualEditor.selection'), 'pageRoot.p_0');
    assert.ok(f.app.src.renderer.records.get(imported).presentation.classList.contains('gramlot-source-selected'));

});

test('canvas selection allows native form focus, typing and bound Data updates', async t => {
    const f = fixture(t);
    const root = f.source.getNode(rootPath);
    const form = f.app.src.builder.wrapSource(root).formlet({node_label:'form'});
    form.textbox({node_label:'name', lbl:'Name', value:'^.name', live:true});
    await tick();
    const field = f.source.getNode(rootPath + '.form.name');
    const element = f.app.src.renderer.records.get(field).element;
    const input = element.shadowRoot.querySelector('input');
    const wire = root.parentBag.toTytx();
    let clicks = 0;
    input.addEventListener('click', () => clicks++);
    for (const type of ['pointerdown', 'click']) {
        const event = new f.window.MouseEvent(type, {bubbles:true, composed:true, cancelable:true});
        assert.equal(input.dispatchEvent(event), true, `${type} must keep native defaults`);
        assert.equal(event.defaultPrevented, false);
    }
    // JSDOM does not implement pointer focus; browser verification covers actual clicks.
    input.focus();
    input.value = 'Ada';
    input.dispatchEvent(new f.window.Event('input', {bubbles:true, composed:true}));
    await tick();
    assert.equal(clicks, 1);
    assert.equal(element.shadowRoot.activeElement, input);
    assert.equal(f.app.data.getItem('pageData.name'), 'Ada');
    assert.equal(f.node.GET('.selection'), 'pageRoot.form.name');
    assert.equal(f.node.GET('.properties.path'), 'pageRoot.form.name');
    assert.equal(root.parentBag.toTytx(), wire, 'typing changes Data, not Source');
});

test('canvas and tree share selection without Source decoration or widget actions', async t => {
    const f = fixture(t);
    const root = f.source.getNode(rootPath);
    const builder = f.app.src.builder.wrapSource(root);
    const group = builder.groupBox({node_label:'group', title:'Fields'});
    group.textbox({node_label:'name', lbl:'Name', value:'^.name'});
    builder.button('Do not run', {node_label:'command', action:'openCatalogue'});
    await tick();
    const sourceWire = root.parentBag.toTytx();
    const selected = f.source.getNode(rootPath + '.group.name');
    const record = f.app.src.renderer.records.get(selected);
    record.element.shadowRoot.querySelector('input').dispatchEvent(new f.window.MouseEvent('click', {bubbles:true, composed:true, cancelable:true}));
    await tick();
    assert.equal(f.app.data.getItem('visualEditor.selection'), 'pageRoot.group.name');
    assert.equal(f.app.data.getItem('visualEditor.properties.path'), 'pageRoot.group.name');
    assert.ok(record.presentation.classList.contains('gramlot-source-selected'));
    assert.equal(f.window.document.querySelectorAll('.visual-editor-canvas .gramlot-source-selected').length, 1);
    const tree = f.window.document.getElementById('visual-source-tree').shadowRoot;
    assert.equal(tree.querySelector('[data-path="pageRoot.group.name"]').getAttribute('aria-selected'), 'true');
    assert.equal(root.parentBag.toTytx(), sourceWire, 'selection must not change export');
    f.app.data.setItem('visualEditor.selection', 'pageRoot.h2_0');
    await tick();
    assert.ok(!record.presentation.classList.contains('gramlot-source-selected'));
    const heading = f.source.getNode(rootPath + '.h2_0');
    assert.ok(f.app.src.renderer.records.get(heading).presentation.classList.contains('gramlot-source-selected'));
    // Native class reprojection must preserve the transient selection decoration.
    heading.setAttr({class:'authored-heading'});
    await tick();
    assert.ok(f.app.src.renderer.records.get(heading).presentation.classList.contains('gramlot-source-selected'));
    assert.equal(heading.getAttr('class'), 'authored-heading');
    const command = f.app.src.renderer.records.get(f.source.getNode(rootPath + '.command'));
    command.element.shadowRoot.querySelector('button').click();
    await tick();
    assert.equal(f.app.data.getItem('visualEditor.selection'), 'pageRoot.command');
    assert.equal(f.app.data.getItem('visualEditor.catalogueOpen'), false);
    f.call('newPage');
    await tick();
    assert.equal(f.window.document.querySelectorAll('.visual-editor-canvas .gramlot-source-selected').length, 1);
    assert.ok(f.app.src.renderer.records.get(f.source.getNode(rootPath)).presentation.classList.contains('gramlot-source-selected'));
});

test('canvas selection and picking follow a document node replaced at the design path', async t => {
    const f = fixture(t);
    const center = f.source.getNode('main.visual.layout.center');
    const old = center.value.getNode('design');
    center.value.popNode('design');
    const replacement = f.app.src.builder.wrapSource(center).div({node_label:'design', class:'visual-editor-canvas'});
    replacement.div({node_label:'pageRoot', datapath:'pageData'}).h3('Replaced', {node_label:'title'});
    await tick();
    const design = f.source.getNode('main.visual.layout.center.design');
    assert.notEqual(design, old);
    f.app.data.setItem('visualEditor.selection', 'pageRoot.title');
    await tick();
    const title = f.app.src.renderer.records.get(f.source.getNode(rootPath + '.title')).presentation;
    assert.ok(title.classList.contains('gramlot-source-selected'));
    const page = f.app.src.renderer.records.get(f.source.getNode(rootPath)).presentation;
    page.dispatchEvent(new f.window.MouseEvent('click', {bubbles:true, composed:true, cancelable:true}));
    await tick();
    assert.equal(f.app.data.getItem('visualEditor.selection'), 'pageRoot');
    assert.ok(page.classList.contains('gramlot-source-selected'));
    assert.ok(!title.classList.contains('gramlot-source-selected'));
});

function saveBranch(f, path, copy = false, name = 'Contact form') {
    f.app.data.setItem('visualEditor.selection', path);
    f.call(copy ? 'copyBranch' : 'cutBranch');
    assert.equal(f.app.data.getItem('visualEditor.error'), '');
    f.app.data.setItem('visualEditor.clipboardDraft.name', name);
    f.call('saveClipboard');
    assert.equal(f.app.data.getItem('visualEditor.error'), '');
}

test('cut a populated formlet, add a group and paste repeatedly without losing fields or Data', async t => {
    const f = fixture(t), data = f.app.data;
    const root = f.app.src.builder.wrapSource(f.source.getNode(rootPath));
    const tabs = root.tabContainer({node_label:'tabs'});
    const form = tabs.formlet({node_label:'form', title:'Contact', pageName:'contact', columns:1});
    for (let i = 0; i < 5; i++) form.textbox({node_label:`field_${i}`, lbl:`Field ${i}`, value:`^.field_${i}`});
    data.setItem('pageData.field_0', 'Alice');
    saveBranch(f, 'pageRoot.tabs.form');
    assert.equal(f.source.getNode(rootPath + '.tabs.form'), null);
    assert.equal(data.getItem('pageData.field_0'), 'Alice');
    tabs.groupBox({node_label:'group', title:'Contact', pageName:'contact', lbl:'Fields'});
    data.setItem('visualEditor.selection', 'pageRoot.tabs.group');
    f.call('pasteBranch');
    assert.equal(data.getItem('visualEditor.error'), '');
    const pasted = f.source.getNode(rootPath + '.tabs.group.form');
    assert.equal(pasted.getValue(true).getNodes().length, 5);
    assert.equal(pasted.getAttr('title'), null);
    assert.equal(pasted.getAttr('pageName'), null);
    assert.equal(pasted.getValue(true).getNode('field_0').getAttr('value'), '^.field_0');
    assert.equal(data.getItem('visualEditor.selection'), 'pageRoot.tabs.group.form');
    data.setItem('visualEditor.selection', 'pageRoot.tabs.group');
    f.call('pasteBranch');
    assert.equal(data.getItem('visualEditor.error'), '');
    const duplicate = f.source.getNode(rootPath + '.tabs.group.form_1');
    assert.equal(duplicate.getValue(true).getNodes().length, 5);
    assert.notEqual(duplicate.value, pasted.value);
    duplicate.value.getNode('field_0').setAttr({lbl:'Changed'});
    assert.equal(pasted.value.getNode('field_0').getAttr('lbl'), 'Field 0');
    assert.equal(data.getItem('visualEditor.clipboard').getNodes().length, 1);
    assert.equal(data.getItem('pageData.field_0'), 'Alice');
    assert.ok(!f.source.getNode(rootPath).parentBag.toTytx().includes('Contact form'));
    await tick();
});

test('pasting into a tab asks its label; cancellation and validation leave the clipboard intact', t => {
    const f = fixture(t), data = f.app.data;
    const root = f.app.src.builder.wrapSource(f.source.getNode(rootPath));
    root.groupBox({node_label:'group', lbl:'Original'}).textbox({node_label:'name', value:'^.name'});
    root.tabContainer({node_label:'tabs'});
    saveBranch(f, 'pageRoot.group', true);
    assert.ok(f.source.getNode(rootPath + '.group'));
    const wire = data.getItem('visualEditor.clipboard').toTytx();
    data.setItem('visualEditor.selection', 'pageRoot.tabs');
    f.call('pasteBranch');
    assert.equal(data.getItem('visualEditor.insertionOpen'), true);
    f.call('insertWidget');
    assert.equal(data.getItem('visualEditor.error'), 'Choose title');
    assert.equal(f.source.getNode(rootPath + '.tabs.group'), null);
    data.setItem('visualEditor.insertion.parameters.title.T', 'New tab');
    f.call('insertWidget');
    assert.equal(data.getItem('visualEditor.error'), '');
    assert.equal(f.source.getNode(rootPath + '.tabs.group').getAttr('title'), 'New tab');
    assert.equal(data.getItem('visualEditor.clipboard').toTytx(), wire);
    f.call('newPage');
    assert.equal(data.getItem('visualEditor.clipboard').toTytx(), wire);
});

test('clipboard guards the root, preserves branches on Cancel and rejects duplicate nodeIds before mutation', t => {
    const f = fixture(t), data = f.app.data;
    f.call('cutBranch');
    assert.match(data.getItem('visualEditor.error'), /below the page root/);
    const root = f.app.src.builder.wrapSource(f.source.getNode(rootPath));
    root.groupBox({node_label:'group', nodeId:'uniqueGroup'}).textbox({node_label:'name'});
    data.setItem('visualEditor.selection', 'pageRoot.group');
    f.call('cutBranch');
    data.setItem('visualEditor.clipboardOpen', false);
    assert.ok(f.source.getNode(rootPath + '.group'));
    assert.equal(data.getItem('visualEditor.clipboard').getNodes().length, 0);
    saveBranch(f, 'pageRoot.group', true);
    const before = f.source.getNode(rootPath).parentBag.toTytx();
    data.setItem('visualEditor.selection', 'pageRoot');
    f.call('pasteBranch');
    assert.ok(data.getItem('visualEditor.error'));
    assert.equal(f.source.getNode(rootPath).parentBag.toTytx() === before, true);
    assert.equal(data.getItem('visualEditor.clipboard').getNodes().length, 1);
});

test('function keys act on branches while editable fields retain their normal clipboard behavior', async t => {
    const f = fixture(t), data = f.app.data;
    const main = f.window.document.querySelector('main[tabindex="0"]');
    data.setItem('visualEditor.selection', 'pageRoot.h2_0');
    main.dispatchEvent(new f.window.KeyboardEvent('keydown', {key:'F8', bubbles:true, cancelable:true}));
    assert.equal(data.getItem('visualEditor.clipboardOpen'), true);
    f.call('saveClipboard');
    assert.equal(f.source.getNode(rootPath + '.h2_0'), null);
    main.dispatchEvent(new f.window.KeyboardEvent('keydown', {key:'F9', bubbles:true, cancelable:true}));
    assert.equal(data.getItem('visualEditor.error'), '');
    assert.ok(f.source.getNode(rootPath + '.h2_0'));
    await tick();
    const input = f.window.document.querySelector('input[type="search"]');
    input.dispatchEvent(new f.window.KeyboardEvent('keydown', {key:'x', metaKey:true, bubbles:true, cancelable:true}));
    assert.equal(data.getItem('visualEditor.clipboardOpen'), false);
    assert.ok(f.source.getNode(rootPath + '.h2_0'));
});

test('standard clipboard shortcuts remain native even on non-editable chat text', t => {
    const f = fixture(t), data = f.app.data;
    const main = f.window.document.querySelector('main[tabindex="0"]');
    const message = f.window.document.createElement('span');
    message.textContent = 'Assistant text to copy';
    main.append(message);
    data.setItem('visualEditor.selection', 'pageRoot.h2_0');
    const clipboardOpen = data.getItem('visualEditor.clipboardOpen');
    const before = f.source.getNode(rootPath).parentBag.toTytx();
    for (const modifier of ['metaKey', 'ctrlKey']) {
        for (const key of ['c', 'x', 'v', 'F8', 'F9']) {
            const event = new f.window.KeyboardEvent('keydown', {key, [modifier]:true,
                bubbles:true, cancelable:true});
            assert.equal(message.dispatchEvent(event), true);
            assert.equal(event.defaultPrevented, false);
            assert.equal(data.getItem('visualEditor.clipboardOpen'), clipboardOpen);
            assert.equal(data.getItem('visualEditor.clipboard').getNodes().length, 0);
            assert.equal(f.source.getNode(rootPath).parentBag.toTytx(), before);
        }
    }
});

for (const target of ['panel', 'icon']) test(`native tree drag to clipboard ${target} moves by default, copies with Option and pastes saved branches`, async t => {
    const f = fixture(t), data = f.app.data, doc = f.window.document;
    await tick();
    const transfer = {effectAllowed:'all', dropEffect:'none', wires:new Map(),
        clearData() {this.wires.clear();}, setData(key, value) {this.wires.set(key, value);}, setDragImage() {}};
    const fire = (element, type, altKey = false) => {
        const event = new f.window.MouseEvent(type, {bubbles:true, composed:true, cancelable:true, altKey});
        Object.defineProperty(event, 'dataTransfer', {value:transfer});
        element.dispatchEvent(event);
    };
    const sourceRow = path => doc.getElementById('visual-source-tree').shadowRoot.querySelector(`[data-path="${path}"] .row`);
    data.setItem('visualEditor.selection', 'pageRoot.h2_0');
    await tick();
    const shelf = target === 'panel' ? doc.querySelector('.visual-clipboard') :
        doc.querySelector('.visual-editor-rail [aria-label="Clipboard"]');
    assert.equal(data.getItem('visualEditor.clipboardVisible'), false);
    fire(sourceRow('pageRoot.h2_0'), 'dragstart');
    fire(shelf, 'dragover', true);
    fire(shelf, 'drop', true);
    await tick();
    assert.equal(data.getItem('visualEditor.clipboardOpen'), true);
    assert.equal(data.getItem('visualEditor.clipboardDraft.copy'), true);
    assert.equal(data.getItem('visualEditor.clipboardVisible'), false);
    f.call('saveClipboard');
    assert.equal(data.getItem('visualEditor.clipboardVisible'), true);
    assert.ok(f.source.getNode(rootPath + '.h2_0'));
    fire(sourceRow('pageRoot.h2_0'), 'dragend');
    fire(sourceRow('pageRoot.p_0'), 'dragstart');
    fire(shelf, 'dragover');
    fire(shelf, 'drop');
    await tick();
    assert.equal(data.getItem('visualEditor.clipboardDraft.copy'), false);
    f.call('saveClipboard');
    assert.equal(f.source.getNode(rootPath + '.p_0'), null);
    assert.equal(data.getItem('visualEditor.clipboard').getNodes().length, 2);
    await tick();
    const savedRow = doc.getElementById('visual-clipboard-tree').shadowRoot.querySelector('[data-path="branch_2"] .row');
    fire(savedRow, 'dragstart');
    fire(sourceRow('pageRoot'), 'dragover');
    fire(sourceRow('pageRoot'), 'drop');
    await tick();
    assert.equal(data.getItem('visualEditor.error'), '');
    assert.ok(f.source.getNode(rootPath + '.p_0'));
    assert.equal(data.getItem('visualEditor.clipboard').getNodes().length, 2);
});

test('Worker Source import enforces file type and decodes UTF-8 across chunks', () => {
    const page = new Page();
    assert.throws(() => page.import_source({name:'wrong.txt'}), /grmlt/);
    const target = page.import_source({name:'draft.GRMLT'});
    assert.equal(target.maxBytes, 5 * 1024 * 1024);
    const builder = new GramlotBuilder();
    builder.root.div({node_label:'pageRoot'}).p('città');
    const wire = builder.toTytx();
    const bytes = new TextEncoder().encode(wire);
    const split = bytes.indexOf(0xc3) + 1;
    target.write(bytes.slice(0, split));
    target.write(bytes.slice(split));
    assert.deepEqual(target.finish(), {state:'completed',result:wire});
    assert.deepEqual(target.abort(), {state:'completed',result:wire});
    const invalidSource = page.import_source({name:'bad.grmlt'});
    invalidSource.write(new TextEncoder().encode(new Bag({pageRoot:'not Source'}).toTytx()));
    assert.throws(() => invalidSource.finish(), /pageRoot/);
    assert.deepEqual(invalidSource.abort(), {state:'unsaved'});
    const invalid = page.import_source({name:'bad.grmlt'});
    assert.throws(() => invalid.write(new Uint8Array([0xff])), TypeError);
    assert.deepEqual(invalid.abort(), {state:'unsaved'});
});

test('assistant edits use widget and parent validation and preserve populated branches', t => {
    const f=fixture(t), data=f.app.data;
    f.call('applySourceEdit',{operation:'insert',path:'pageRoot',tag:'tabContainer',label:'tabs'});
    const before=f.source.getNode(rootPath).parentBag.toTytx();
    assert.throws(()=>f.call('applySourceEdit',{operation:'insert',path:'pageRoot.tabs',tag:'formlet',label:'form'}),/title/);
    assert.equal(f.source.getNode(rootPath).parentBag.toTytx(),before);
    f.call('applySourceEdit',{operation:'insert',path:'pageRoot.tabs',tag:'formlet',label:'form',attributes:{title:'Contact'}});
    f.call('applySourceEdit',{operation:'insert',path:'pageRoot.tabs.form',tag:'textbox',label:'name',attributes:{lbl:'Name',value:'^.name'}});
    f.call('applySourceEdit',{operation:'update',path:'pageRoot.tabs.form.name',attributes:{lbl:'Full name',lbl_color:'#123456'}});
    assert.equal(f.source.getNode(rootPath+'.tabs.form.name').getAttr('lbl'),'Full name');
    assert.equal(data.getItem('visualEditor.selection'),'pageRoot.tabs.form.name');
    assert.throws(()=>f.call('applySourceEdit',{operation:'update',path:'pageRoot.tabs.form',text:'Discard children'}),/populated container/);
    f.call('applySourceEdit',{operation:'insert',path:'pageRoot',tag:'groupBox',label:'group',attributes:{lbl:'Destination'}});
    f.call('applySourceEdit',{operation:'move',path:'pageRoot.tabs.form',parent:'pageRoot.group'});
    assert.ok(f.source.getNode(rootPath+'.group.form.name'));
    assert.equal(f.source.getNode(rootPath+'.tabs.form'),null);
});

test('assistant rejects invalid targets, executable attributes and identity conflicts before mutation', t => {
    const f=fixture(t);
    f.call('applySourceEdit',{operation:'insert',path:'pageRoot',tag:'div',label:'original',attributes:{nodeId:'preserved'}});
    const before=f.source.getNode(rootPath).parentBag.toTytx();
    for(const operation of [
        {operation:'remove',path:'pageRoot'},
        {operation:'remove',path:'main.visual'},
        {operation:'insert',path:'pageRoot',tag:'div',label:'duplicate',attributes:{nodeId:'preserved'}},
        {operation:'insert',path:'pageRoot',tag:'script',label:'code',text:'alert(1)'},
        {operation:'update',path:'pageRoot.original',attributes:{connect_onclick:'doSomething'}},
    ]) {
        assert.throws(()=>f.call('applySourceEdit',operation));
        assert.equal(f.source.getNode(rootPath).parentBag.toTytx(),before);
    }
});

test('each delivered assistant operation is visible before the next and concurrent manual edits stop the run', t => {
    const f=fixture(t), data=f.app.data;
    data.setItem('visualEditor.assistantRun',new Bag({run:1,next:0,expected:f.source.getNode(rootPath).parentBag.toTytx(),blocked:false}));
    const operations=new Bag();
    operations.setItem('op_0',JSON.stringify({operation:'insert',path:'pageRoot',tag:'h2',label:'title',text:'First result'}),{run:1,index:0});
    f.call('assistantApply',{operations});
    assert.equal(f.source.getNode(rootPath+'.title').value,'First result');
    assert.match(data.getItem('visualEditor.assistantStatus'),/Applied 1/);
    f.source.getNode(rootPath+'.title').setValue('Manual correction');
    operations.setItem('op_1',JSON.stringify({operation:'update',path:'pageRoot.title',text:'Late result'}),{run:1,index:1});
    f.call('assistantApply',{operations});
    assert.equal(f.source.getNode(rootPath+'.title').value,'Manual correction');
    assert.equal(data.getItem('visualEditor.assistantRun.blocked'),true);
    assert.match(data.getItem('visualEditor.assistantStatus'),/Source changed/);
});

test('chat context retains widget parameter types and shared presentation metadata', t => {
    const f=fixture(t), data=f.app.data;
    data.setItem('visualEditor.draft','Create two columns');
    data.setItem('visualEditor.conversation',new Bag({ready:true}));
    data.setItem('visualEditor.attachments',new Bag());
    f.call('chatSend');
    const metadata=JSON.parse(data.getItem('visualEditor.assistant.context.schema'));
    assert.deepEqual(metadata.widgets.formlet.parameters.columns.dtype,['L','T']);
    assert.equal(metadata.widgets.formlet.parameters.columns.default,1);
    assert.equal(data.getItem('visualEditor.assistant.context.codeWritable'),false);
    assert.ok(metadata.commonParameters.color);
    assert.ok(metadata.widgets.tabContainer.childParameters.title);
    assert.equal(data.getItem('visualEditor.conversation.request.text'),'Create two columns');
});


for (const language of ['python','javascript']) test(`Source chat advertises writable ${language} code without switching mode`, t => {
    const f=fixture(t), data=f.app.data;
    data.setItem('visualEditor.draft','Grid from server data');
    data.setItem('visualEditor.conversation',new Bag({ready:true}));
    data.setItem('visualEditor.attachments',new Bag());
    data.setItem('visualEditor.codeDocument',new Bag({language,writable:true,content:'unchanged draft'}));
    f.call('chatSend');
    const context=data.getItem('visualEditor.assistant.context');
    assert.equal(context.getItem('mode'),'source');
    assert.equal(context.getItem('language'),language);
    assert.equal(context.getItem('codeWritable'),true);
    assert.equal(context.getItem('code'),null);
    assert.equal(data.getItem('visualEditor.codeDocument.content'),'unchanged draft');
    f.call('assistantState',{active:false});
    assert.equal(data.getItem('visualEditor.assistantStatus'),'');
});

test('two nested editor instances isolate Source, properties, clipboard, data and teardown', async t => {
    const f = fixture(t, 'pageData', true, true);
    const other = f.source.getNode('main.workspace.second');
    const call = (name, ...args) => {
        const {group, method} = f.app.src.logicRegistry.resolve(name, other);
        return method.call(group, other, ...args);
    };
    const parent = other.value.getNode('layout.center.design.pageRoot');
    call('dropNode', {item:parent, path:'pageRoot', dropValues:{'app/widget':{tag:'button'}}});
    await tick();
    assert.equal(other.GET('.selection'), 'pageRoot.button_0');
    assert.equal(f.node.GET('.selection'), 'pageRoot');
    assert.equal(f.source.getNode(rootPath + '.button_0'), null);
    other.SET('.properties.parameters._text.T', 'Second only');
    await tick();
    assert.equal(parent.value.getNode('button_0').value, 'Second only');
    call('copyBranch'); other.SET('.clipboardDraft.name', 'Second'); call('saveClipboard');
    assert.equal(other.GET('.clipboard').length, 1);
    assert.equal(f.node.GET('.clipboard').length, 0);
    f.app.data.setItem('pageData.keep', 'first');
    call('newPage');
    assert.equal(f.app.data.getItem('pageData.keep'), 'first');
    assert.equal(other.value.getNode('layout.center.design.pageRoot').value, null);
    const tree = f.window.document.getElementById('second-source-tree');
    assert.ok(tree.shadowRoot.querySelector('[data-path="pageRoot"]'));
    f.source.getNode('main.workspace').value.popNode('second');
    assert.equal(f.window.document.getElementById('second-source-tree'), null);
    f.drop('div');
    assert.ok(f.source.getNode(rootPath+'.div_0'));
});

test('Page-code assistant edits only the draft, acknowledges it, and stops after manual edits', t => {
    const f=fixture(t), node=f.node;
    const before=f.source.getNode('main.visual.layout.center.design').value.toTytx();
    node.SET('.codeDocument', new Bag({content:'old', saved:'old', revision:'r1', writable:true, busy:false}));
    node.SET('.assistantRun', new Bag({run:1, mode:'code', next:0, expected:'old', blocked:false}));
    const operations=new Bag();
    operations.setItem('first',JSON.stringify({operation:'replace_code',content:'new'}),{run:1,index:0});
    f.call('assistantApply',{operations});
    assert.equal(node.GET('.codeDocument.content'),'new');
    assert.equal(node.GET('.codeDocument.saved'),'old');
    assert.equal(node.GET('.assistant.ack.code'),'new');
    assert.equal(f.source.getNode('main.visual.layout.center.design').value.toTytx(),before);
    node.SET('.codeDocument.content','manual');
    operations.setItem('second',JSON.stringify({operation:'replace_code',content:'overwrite'}),{run:1,index:1});
    f.call('assistantApply',{operations});
    assert.equal(node.GET('.codeDocument.content'),'manual');
    assert.equal(node.GET('.assistant.ack.stop'),true);
});

test('Page-code Save retains late typing and a concurrent Source edit instead of overwriting either', async t => {
    const f=fixture(t), node=f.node;
    node.setAttr({codeDocumentKey:'page'});
    node.SET('.codeDocument',new Bag({content:'submitted',saved:'old',revision:'r1',writable:true,busy:false}));
    let resolve, request;
    f.app.rpc.call=(type,name,args)=>{request={type,name,args};return new Promise(done=>{resolve=done});};
    const pending=f.call('codeSave');
    assert.equal(node.GET('.codeDocument.busy'),true);
    node.SET('.codeDocument.content','later typing');
    f.drop('button');
    resolve({revision:'r2'});
    await pending;
    assert.deepEqual(request,{type:'data',name:'editor_document_save',args:{key:'page',content:'submitted',revision:'r1'}});
    assert.equal(node.GET('.codeDocument.content'),'later typing');
    assert.equal(node.GET('.codeDocument.saved'),'submitted');
    assert.equal(node.GET('.codeDocument.revision'),'r2');
    assert.match(node.GET('.codeDocument.status'),/Source changed/);
    assert.equal(node.GET('.codeDocument.busy'),false);
});


for (const language of ['python', 'javascript']) test(`${language} draft context and Save use the common contract`, async t => {
    const f=fixture(t), node=f.node;
    node.setAttr({codeDocumentKey:'page'});
    node.SET('.codeDocument', new Bag({language, content:'draft', saved:'original', revision:'r1', writable:true, busy:false}));
    f.call('openCode');
    node.SET('.draft','Change the page');
    node.SET('.conversation',new Bag({ready:true}));
    node.SET('.attachments',new Bag());
    f.call('chatSend');
    assert.equal(node.GET('.assistant.context.mode'),'code');
    assert.equal(node.GET('.assistant.context.language'),language);
    assert.equal(node.GET('.assistant.context.code'),'draft');
    const preview=new GramlotBuilder();
    preview.root.div({node_label:'pageRoot',datapath:'pageData'}).h2('Saved preview');
    const requests=[];
    f.app.rpc.call=async (type,name,args)=>{
        requests.push({type,name,args});
        return type==='data' ? {revision:'r2'} : preview.toTytx();
    };
    await f.call('codeSave');
    assert.deepEqual(requests.map(r=>r.name),['editor_document_save','editor_document_preview']);
    assert.equal(requests[1].args.revision,'r2');
    assert.equal(f.source.getNode(rootPath+'.h2_0').value,'Saved preview');
    assert.equal(node.GET('.codeDocument.saved'),'draft');
    assert.equal(node.GET('.codeDocument.busy'),false);
    assert.equal(node.GET('.assistantRun.blocked'),true);
});

test('a refused page-code Save preserves the draft and skips preview', async t=>{
    const f=fixture(t),node=f.node;
    node.setAttr({codeDocumentKey:'page'});
    node.SET('.codeDocument',new Bag({language:'javascript',content:'draft',saved:'old',revision:'r1',writable:true,busy:false}));
    const source=f.source.getNode('main.visual.layout.center.design').value.toTytx();
    let calls=0;
    f.app.rpc.call=async()=>{calls++;throw new Error('File changed on disk');};
    await f.call('codeSave');
    assert.equal(calls,1);
    assert.equal(node.GET('.codeDocument.content'),'draft');
    assert.equal(node.GET('.codeDocument.saved'),'old');
    assert.equal(node.GET('.codeDocument.revision'),'r1');
    assert.match(node.GET('.codeDocument.status'),/Save failed.*changed/);
    assert.equal(f.source.getNode('main.visual.layout.center.design').value.toTytx(),source);
    node.SET('.codeDocument.writable',false);
    await f.call('codeSave');
    assert.equal(calls,1);
});


test('appearance rail applies canonical themes without changing page Source, selection or drafts', async t => {
    const f=fixture(t), document=f.window.document;
    await tick();
    const before=f.source.getNode('main.visual.layout.center.design').value.toTytx(), tree=document.getElementById('visual-source-tree');
    f.node.SET('.chat.draft','Keep my instruction');
    document.querySelector('.visual-editor-rail gramlot-button[aria-label="Appearance"]').shadowRoot.querySelector('button').click();
    await tick();
    assert.equal(f.node.GET('.appearanceOpen'),true);
    for (const [profile,palette,mode] of [['compact','joanna','dark'],['mimi','mimi','light'],['base','default','light']]) {
        f.node.SET('.appearanceProfile',profile); f.node.SET('.appearancePalette',palette); f.node.SET('.appearanceMode',mode);
        await tick();
        assert.equal(document.documentElement.getAttribute('data-theme'),mode);
        assert.equal(document.querySelector('.visual-editor-shell > style').textContent,f.node.GET('.appearanceCss'));
        assert.equal(f.source.getNode('main.visual.layout.center.design').value.toTytx(),before);
        assert.equal(document.getElementById('visual-source-tree'),tree);
        assert.equal(f.node.GET('.selection'),'pageRoot');
        assert.equal(f.node.GET('.chat.draft'),'Keep my instruction');
    }
});


test('whole-page Data stays at the real root and New preserves reserved editor state', async t => {
    const f = fixture(t, '', false);
    const root = f.source.getNode(rootPath);
    assert.equal(root.getAttr('datapath'), null);
    const form = f.app.src.builder.wrapSource(root).formlet({node_label:'form'});
    form.textbox({node_label:'absolute', value:'^alfa.beta', live:true});
    form.textbox({node_label:'relative', value:'^.alfa.beta', live:true});
    await tick();
    const field = f.app.src.renderer.records.get(f.source.getNode(rootPath+'.form.absolute')).element;
    field.control.value='gino';
    field.control.dispatchEvent(new f.window.Event('input', {bubbles:true, composed:true}));
    await tick();
    assert.equal(f.app.data.getItem('alfa.beta'), 'gino');
    assert.equal(f.app.src.renderer.records.get(f.source.getNode(rootPath+'.form.relative')).element.control.value, 'gino');
    const tree = f.window.document.getElementById('visual-data-tree');
    assert.ok(tree.shadowRoot.querySelector('[data-path="alfa.beta"]'));
    assert.equal(tree.shadowRoot.querySelector('[data-path="__editor"]'),null);
    assert.equal(f.app.data.getNode('pageData'),null);
    const state = f.app.data.getItem('__editor');
    state.setItem('chat.draft','Keep this instruction');
    state.setItem('codeDocument.content','# Keep this draft');
    f.call('newPage');
    await tick();
    assert.deepEqual(f.app.data.keys(),['__editor']);
    assert.equal(f.app.data.getItem('__editor'),state);
    assert.equal(state.getItem('chat.draft'),'Keep this instruction');
    assert.equal(state.getItem('codeDocument.content'),'# Keep this draft');
    assert.equal(f.source.getNode(rootPath).getAttr('datapath'),null);
    assert.equal(f.node.GET('.selection'),'pageRoot');
    assert.equal(tree.shadowRoot.querySelectorAll('[role=treeitem]').length,0);
    const wire=f.source.getNode(rootPath).parentBag.toTytx();
    assert.ok(!wire.includes('__editor'), 'export contains only authored page Source');
});

function attributeRow(f, name) {
    return f.node.GET('.properties.attributeRows').getNodes().find(row => row.value.getItem('name') === name).label;
}
function addAttribute(f, path, name, type, text) {
    f.node.SET('.properties.attributeDraft', new Bag({name, type, text}));
    f.call('addAttribute', {editingPath:path});
}

test('More attributes edits HTML/custom values and retains children, bindings and typed Source export', async t => {
    const f = fixture(t), path = 'pageRoot';
    await tick();
    const root = f.source.getNode(rootPath), children = root.value;
    for (const [name,type,text,expected] of [
        ['kpress_slot','string','body','body'], ['data-title','string','^page.title','^page.title'],
        ['href','string','/contact','/contact'], ['id','string','site-page','site-page'],
        ['data-count','integer','3',3], ['data-visible','boolean','false',false],
        ['data-empty','string','',''], ['data-null','null','',null]
    ]) {
        addAttribute(f,path,name,type,text);
        assert.equal(f.node.GET('.propertyError'), '');
        assert.ok(Object.hasOwn(root.getAttr(),name));
        assert.equal(root.getAttr(name),expected);
        assert.equal(f.node.GET('.parameterTab'),'attributes');
    }
    assert.equal(root.value,children);
    assert.equal(root.value.getNodes().length,2);
    // Exercise the bound input controller, not just the write helper.
    const key = attributeRow(f,'kpress_slot');
    const attributeInput = f.window.document.querySelector('[aria-label="kpress_slot attribute value"]');
    assert.ok(attributeInput);
    f.node.SET(`.properties.attributeRows.${key}.text`, 'sidebar');
    await tick();
    assert.equal(root.getAttr('kpress_slot'),'sidebar');
    assert.equal(f.window.document.querySelector('[aria-label="kpress_slot attribute value"]'), attributeInput);
    f.call('removeAttribute',{attributeRow:attributeRow(f,'href'),editingPath:path});
    assert.equal(Object.hasOwn(root.getAttr(),'href'),false);
    const exported=f.app.src.prepareSource(root.parentBag.toTytx(),root.builder).getNode('pageRoot');
    assert.equal(exported.getAttr('kpress_slot'),'sidebar');
    assert.equal(exported.getAttr('data-title'),'^page.title');
    assert.equal(exported.getAttr('data-count'),3);
    assert.equal(exported.getAttr('data-visible'),false);
    assert.equal(exported.getAttr('data-null'),null);
    assert.equal(exported.value.getNodes().length,2);
});

test('More attributes rejects invalid names, duplicates, invalid scalars and conflicting nodeIds before mutation', async t => {
    const f=fixture(t); await tick();
    const root=f.source.getNode(rootPath);
    addAttribute(f,'pageRoot','id','string','first');
    const before=root.parentBag.toTytx();
    for (const [name,type,text] of [['id','string','second'],['bad name','string','x'],
        ['_meta','string','x'],['__proto__','string','x'],['data-number','integer','1.5']]) {
        addAttribute(f,'pageRoot',name,type,text);
        assert.ok(f.node.GET('.propertyError'));
        assert.equal(root.parentBag.toTytx(),before);
    }
    f.app.src.builder.wrapSource(root).div({node_label:'other',nodeId:'taken'});
    const beforeId=root.parentBag.toTytx();
    addAttribute(f,'pageRoot','nodeId','string','taken');
    assert.match(f.node.GET('.propertyError'),/nodeId/);
    assert.equal(root.parentBag.toTytx(),beforeId);
});

test('More attributes respects container rules and updates specialized forms', async t => {
    const f=fixture(t), root=f.app.src.builder.wrapSource(f.source.getNode(rootPath));
    const tabs=root.tabContainer({node_label:'tabs'});
    tabs.formlet({node_label:'form',title:'Contact',pageName:'contact'});
    tabs.formlet({node_label:'other',title:'Other',pageName:'other'});
    const path='pageRoot.tabs.form';f.node.SET('.selection',path);await tick();
    const form=f.source.getNode(rootPath+'.tabs.form');
    f.call('removeAttribute',{attributeRow:attributeRow(f,'title'),editingPath:path});
    assert.match(f.node.GET('.propertyError'),/Choose title/);
    assert.equal(form.getAttr('title'),'Contact');
    f.call('changeAttribute',{attributeRow:attributeRow(f,'pageName'),editingPath:path,value:'other'});
    assert.match(f.node.GET('.propertyError'),/already in use/);
    assert.equal(form.getAttr('pageName'),'contact');
    f.call('changeAttribute',{attributeRow:attributeRow(f,'title'),editingPath:path,value:'Updated'});
    assert.equal(form.getAttr('title'),'Updated');
    assert.equal(f.node.GET('.properties.parameters.title.T'),'Updated');
});

test('More attributes protects stale edits and preserves unsupported values', async t => {
    const f=fixture(t), root=f.source.getNode(rootPath);
    root.setAttr({'data-state':'before'});
    const command=f.app.src.builder.wrapSource(root).menu({node_label:'commands'}).menuline({node_label:'entry',parameters:{nested:true}});
    f.call('showProperties',{path:'pageRoot'});await tick();
    const key=attributeRow(f,'data-state');
    root.setAttr({'data-state':'outside'});
    f.call('changeAttribute',{attributeRow:key,editingPath:'pageRoot',value:'stale'});
    assert.match(f.node.GET('.propertyError'),/Attribute changed/);
    assert.equal(root.getAttr('data-state'),'outside');
    f.node.SET('.selection','pageRoot.commands.entry');await tick();
    const entry=f.source.getNode(rootPath+'.commands.entry'), parameters=entry.getAttr('parameters');
    f.call('removeAttribute',{attributeRow:attributeRow(f,'parameters'),editingPath:'pageRoot.commands.entry'});
    assert.match(f.node.GET('.propertyError'),/not editable/);
    assert.equal(entry.getAttr('parameters'),parameters);
    f.node.SET('.selection','pageRoot.h2_0');await tick();
    f.call('changeAttribute',{attributeRow:key,editingPath:'pageRoot',value:'wrong node'});
    assert.equal(root.getAttr('data-state'),'outside');
});


function catalogueTags(f) {
    const tags=[];
    const visit=bag=>{for(const entry of bag.getNodes()) {
        if(entry.value instanceof Bag) visit(entry.value); else tags.push(entry.getAttr('tag'));
    }};
    visit(f.node.GET('.catalogue'));return tags.sort();
}

test('HTML catalogue uses grammar membership and excludes components, webcomponent and empty categories', t => {
    const f=fixture(t,'pageData',false,false,'html'), tags=catalogueTags(f);
    for(const tag of ['a','img','div','input','html_button','html_dialog']) assert.ok(tags.includes(tag),tag);
    for(const tag of ['button','dialog','webcomponent','grid','dataController','svg']) assert.ok(!tags.includes(tag),tag);
    assert.equal(f.node.GET('.catalogue').getNode('components'),null);
});

test('explicit catalogue lists remain local and reject disallowed direct and AI insertions atomically', async t => {
    const f=fixture(t,'pageData',false,true,['div','a']);await tick();
    assert.deepEqual(catalogueTags(f),['a','div']);
    assert.ok(f.app.data.getItem('otherEditor.catalogue').getNode('components.commands.button'));
    const before=f.source.getNode(rootPath).parentBag.toTytx();
    f.drop('img');assert.match(f.node.GET('.error'),/outside the editor catalogue/);
    f.node.SET('.insertion',new Bag({parentPath:'pageRoot',tag:'button'}));f.call('insertWidget');
    assert.match(f.node.GET('.error'),/outside the editor catalogue/);
    assert.throws(()=>f.call('applySourceEdit',{operation:'insert',path:'pageRoot',tag:'button',label:'bad'}),/outside the editor catalogue/);
    assert.equal(f.source.getNode(rootPath).parentBag.toTytx(),before);
    f.drop('a');assert.equal(f.node.GET('.error'),'');assert.ok(f.source.getNode(rootPath+'.a_0'));
});

test('catalogue validates nested upload and clipboard branches before changing the current page', t => {
    const f=fixture(t,'pageData',false,false,'html');
    const b=new GramlotBuilder(), page=b.root.div({node_label:'pageRoot'});
    page.div({node_label:'nested'}).button('Not HTML');
    const wire=b.toTytx(), before=f.source.getNode(rootPath).parentBag.toTytx();
    assert.throws(()=>f.call('sourceUploaded',{item:{value:new Bag({name:'bad.grmlt'})},result:wire}),/button.*pageRoot.nested.button_0/);
    assert.equal(f.node.GET('.filename'),'page.grmlt');
    f.node.GET('.clipboard').setItem('saved',wire,{name:'Mixed branch',parentTag:'div'});
    f.node.SET('.clipboardSelection','saved');f.call('pasteBranch');
    assert.match(f.node.GET('.error'),/button.*pageRoot.nested.button_0/);
    assert.equal(f.source.getNode(rootPath).parentBag.toTytx(),before);
    assert.equal(f.node.GET('.clipboard').getItem('saved'),wire);
    const good=new GramlotBuilder();good.root.div({node_label:'pageRoot'}).a('Home',{href:'/'});
    f.call('sourceUploaded',{item:{value:new Bag({name:'good.grmlt'})},result:good.toTytx()});
    assert.equal(f.node.GET('.filename'),'good.grmlt');
});

test('SourceImport enforces the configured scope before completing an upload', t => {
    for(const [tag,allowed] of [['a',true],['button',false],['webcomponent',false]]) {
        const b=new GramlotBuilder();b.root.div({node_label:'pageRoot'})[tag]({...(tag==='webcomponent'?{code:'custom-element'}:{})});
        const upload=new SourceImport({catalogue:'html'});upload.write(new TextEncoder().encode(b.toTytx()));
        if(allowed) assert.equal(upload.finish().state,'completed');
        else {assert.throws(()=>upload.finish(),/outside the editor catalogue/);assert.notEqual(upload.status().state,'completed');}
    }
    for(const scope of ['all',{},['a']]) assert.throws(()=>new SourceImport({catalogue:scope}),/catalogue/);
});

test('saved code preview cannot bypass the catalogue constraint', async t => {
    const f=fixture(t,'pageData',false,false,'html'), before=f.source.getNode(rootPath).parentBag.toTytx();
    f.node.setAttr({codeDocumentKey:'page'});
    f.node.SET('.codeDocument',new Bag({language:'javascript',content:'draft',saved:'draft',revision:'r1',writable:true,busy:false}));
    const b=new GramlotBuilder();b.root.div({node_label:'pageRoot'}).button('Wrong widget');
    f.app.rpc.call=async()=>b.toTytx();
    await assert.rejects(f.call('codeLoadPreview',new AbortController()),/outside the editor catalogue/);
    assert.equal(f.source.getNode(rootPath).parentBag.toTytx(),before);
});

test('host load/currentSource/markSaved track only the page Source and survive replacement', async t => {
    const f=fixture(t,'pageData',false,true,'html');await tick();
    assert.equal(f.node.GET('.modified'),false);
    f.node.SET('.sourceSearch','example');f.app.data.setItem('pageData.title','Sample');
    assert.equal(f.node.GET('.modified'),false);
    const b=new GramlotBuilder();b.root.div({node_label:'pageRoot'}).a('Home',{node_label:'home',href:'/'});
    f.call('loadSource',{source:b.toTytx(),filename:'host-template.grmlt'});
    await tick();
    assert.equal(f.node.GET('.modified'),false);
    assert.equal(f.node.GET('.filename'),'host-template.grmlt');
    assert.equal(f.node.GET('.sourceSearch'),'');
    const link=f.source.getNode(rootPath+'.home');link.setAttr({href:'/updated'});
    assert.equal(f.node.GET('.modified'),true);
    assert.equal(f.app.data.getItem('otherEditor.modified'),false);
    assert.match(f.call('currentSource'),/updated/);
    assert.ok(!f.call('currentSource').includes('catalogueScope'));
    f.call('markSaved');assert.equal(f.node.GET('.modified'),false);
    link.parentBag.popNode(link.label);assert.equal(f.node.GET('.modified'),true);
    f.call('loadSource',{source:b.toTytx(),filename:'again.grmlt'});
    f.source.getNode(rootPath+'.home').setValue('Changed text');
    assert.equal(f.node.GET('.modified'),true);
    f.call('markSaved');f.call('newPage');assert.equal(f.node.GET('.modified'),true);
});

test('failed host loads preserve source, filename, selection and modified state', async t => {
    const f=fixture(t,'pageData',false,false,'html');await tick();
    f.drop('a');const before=f.call('currentSource'), selected=f.node.GET('.selection');
    const b=new GramlotBuilder();b.root.div({node_label:'pageRoot'}).button('Disallowed');
    for(const source of ['bad TYTX',b.toTytx()]) {
        assert.throws(()=>f.call('loadSource',{source,filename:'rejected.grmlt'}));
        assert.equal(f.call('currentSource'),before);
        assert.equal(f.node.GET('.filename'),'page.grmlt');
        assert.equal(f.node.GET('.selection'),selected);
        assert.equal(f.node.GET('.modified'),true);
    }
    assert.throws(()=>f.call('loadSource',{source:before,filename:''}),/filename/);
});

test('document tracking unsubscribes when its editor is removed', async t => {
    const f=fixture(t,'pageData',false);await tick();
    const unsubscribed=[], original=f.source.unsubscribe.bind(f.source);
    f.source.unsubscribe=(name,events)=>{unsubscribed.push(name);return original(name,events);};
    f.node.parentBag.popNode(f.node.label);await tick();
    assert.ok(unsubscribed.includes('visual-document'));
});

test('isolated canvas keeps live bindings and selection while CSS stays in its own document', async t => {
    const f=fixture(t,'pageData',false,false,'html');await tick();
    const page=f.app.src.builder.wrapSource(f.source.getNode(rootPath));
    page.input({node_label:'name',value:'^.name'});
    page.a('Home',{node_label:'home',href:'/'});
    f.app.data.setItem('pageData.name','Ada');await tick();
    const inputNode=f.source.getNode(rootPath+'.name');
    const before=f.call('currentSource');f.call('markSaved');
    f.call('setCanvasCss',['body { background: rgb(255, 0, 0); } a { color: rgb(0, 128, 0); }']);
    const frame=f.window.document.querySelector('iframe.visual-editor-canvas-frame');
    assert.ok(frame);
    const input=f.app.src.renderer.records.get(inputNode).element;
    assert.equal(input.ownerDocument,frame.contentDocument);
    assert.equal(f.source.getNode(rootPath+'.name'),inputNode);
    assert.equal(input.value,'Ada');
    assert.equal(frame.contentWindow.getComputedStyle(frame.contentDocument.body).backgroundColor,'rgb(255, 0, 0)');
    assert.notEqual(f.window.getComputedStyle(f.window.document.body).backgroundColor,'rgb(255, 0, 0)');
    input.value='Grace';input.dispatchEvent(new frame.contentWindow.Event('change',{bubbles:true}));
    assert.equal(f.app.data.getItem('pageData.name'),'Grace');
    const linkNode=f.source.getNode(rootPath+'.home'), link=f.app.src.renderer.records.get(linkNode).element;
    assert.ok(frame.contentDocument.body.contains(link));
    const ev=new frame.contentWindow.MouseEvent('click',{bubbles:true,cancelable:true,composed:true});
    assert.equal(link.dispatchEvent(ev),false);
    assert.equal(f.node.GET('.selection'),'pageRoot.home');
    assert.equal(f.node.GET('.modified'),false);
    assert.equal(f.call('currentSource'),before);
    f.call('setCanvasCss',['body { background: rgb(0, 0, 255); }']);
    assert.equal(frame.contentWindow.getComputedStyle(frame.contentDocument.body).backgroundColor,'rgb(0, 0, 255)');
    assert.equal(f.window.document.querySelectorAll('iframe.visual-editor-canvas-frame').length,1);
    assert.equal(f.app.src.renderer.records.get(inputNode).element, input);
    assert.equal(f.app.src.renderer.records.get(linkNode).element, link);
    assert.equal(input.value, 'Grace');
});

test('isolated destination survives page replacement and registers components for new controls', async t => {
    const f=fixture(t,'pageData',false);await tick();
    f.call('setCanvasCss',[]);
    const frame=f.window.document.querySelector('iframe.visual-editor-canvas-frame');
    const b=new GramlotBuilder(null,{collections:[inputs]});
    b.root.div({node_label:'pageRoot',datapath:'pageData'}).textbox({node_label:'name',value:'^.name'});
    f.call('loadSource',{source:b.toTytx(),filename:'form.grmlt'});await tick();
    const field=f.source.getNode(rootPath+'.name'), element=f.app.src.renderer.records.get(field).element;
    assert.equal(element.ownerDocument,frame.contentDocument);
    assert.ok(element.constructor.gramlotComponent);
    f.app.data.setItem('pageData.name','In frame');await tick();
    assert.equal(element.control.value,'In frame');
    f.call('newPage');f.drop('textbox');await tick();
    const inserted=f.app.src.renderer.records.get(f.source.getNode(rootPath+'.textbox_0')).element;
    assert.equal(inserted.ownerDocument,frame.contentDocument);
    assert.ok(inserted.constructor.gramlotComponent);
    f.node.parentBag.popNode(f.node.label);await tick();
    assert.equal(f.window.document.querySelector('iframe.visual-editor-canvas-frame'),null);
});


test('Styles and More attributes share edits and add free names with the compact row', async t => {
    const f = fixture(t), document = f.window.document;
    await tick();
    const root = f.source.getNode(rootPath);
    f.node.SET('.parameterTab', 'styles');
    const styleGrid = () => document.querySelector('[aria-label="Style attributes"]');
    const nodeGrid = () => document.querySelector('[aria-label="Node attributes"]');
    const click = (grid, label) => grid.querySelector(`gramlot-button[aria-label="${label}"]`).shadowRoot.querySelector('button').click();
    const enter = (grid, label, value) => {
        const input = grid.querySelector(`input[aria-label="${label}"]`);
        input.value = value;
        input.dispatchEvent(new f.window.Event('input', {bubbles:true}));
        return input;
    };
    click(styleGrid(), 'Add style attribute');
    assert.equal(f.node.GET('.properties.attributeDraftHidden'), false);
    enter(styleGrid(), 'New attribute name', 'border_radius');
    const value = enter(styleGrid(), 'New attribute value', '12px');
    value.dispatchEvent(new f.window.KeyboardEvent('keydown', {key:'Enter', bubbles:true, cancelable:true}));
    await tick();
    assert.equal(root.getAttr('border_radius'), '12px');
    assert.equal(f.app.src.renderer.records.get(root).element.style.borderRadius, '12px');
    assert.equal(f.node.GET('.parameterTab'), 'styles');
    assert.equal(f.node.GET('.properties.attributeDraftHidden'), true);
    const styleInput = styleGrid().querySelector('[aria-label="border_radius attribute value"]');
    styleInput.value = '24px';
    styleInput.dispatchEvent(new f.window.Event('change', {bubbles:true}));
    await tick();
    assert.equal(root.getAttr('border_radius'), '24px');
    assert.equal(nodeGrid().querySelector('[aria-label="border_radius attribute value"]').value, '24px');
    assert.equal(styleGrid().querySelector('[aria-label="border_radius attribute value"]'), styleInput);
    assert.equal(f.node.GET('.propertyError'), '');
    f.node.SET('.parameterTab', 'attributes');
    click(nodeGrid(), 'Add attribute');
    enter(nodeGrid(), 'New attribute name', 'kpress_slot');
    enter(nodeGrid(), 'New attribute value', 'body');
    click(nodeGrid(), 'Apply new attribute');
    await tick();
    assert.equal(root.getAttr('kpress_slot'), 'body');
    assert.equal(styleGrid().querySelector('[aria-label="kpress_slot attribute value"]'), null);
    assert.ok(nodeGrid().querySelector('[aria-label="kpress_slot attribute value"]'));
    click(nodeGrid(), 'Add attribute');
    enter(nodeGrid(), 'New attribute name', 'discarded');
    enter(nodeGrid(), 'New attribute value', 'nothing').dispatchEvent(
        new f.window.KeyboardEvent('keydown', {key:'Escape', bubbles:true, cancelable:true}));
    assert.equal(root.getAttr('discarded'), null);
    assert.equal(f.node.GET('.properties.attributeDraftHidden'), true);
    click(nodeGrid(), 'Remove border_radius attribute');
    await tick();
    assert.equal(Object.hasOwn(root.getAttr(), 'border_radius'), false);
    assert.equal(styleGrid().querySelector('[aria-label="border_radius attribute value"]'), null);
});
