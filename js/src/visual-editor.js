import {VisualEditorCanvas} from './visual-editor-canvas.js';
import {validateCatalogue, catalogueAllows, validateCatalogueSource} from './visual-editor-catalogue.js';
import {editorTypes, scalarType, scalarText, parseScalar} from './editor-values.js';
import {SourcePicker} from './source-picker.js';
import {appearanceStyles, paletteStyles} from './index-page-styles.js';
import {toolIcons} from './visual-editor-icons.js';
import {Bag} from '@genrojs/bag';
import {chatRender, chatSend, chatCompleted, chatReset, chatResize, chatPickAttachments, chatRenderAttachments, chatRemoveAttachment} from './chat.js';

export function visualEditorScope(node) {
    for (let scope = node; scope; scope = scope.parentNode) {
        if (scope.getAttr('visualEditorId')) return scope;
    }
    throw new Error('Operation requires a VisualEditor Source ancestor');
}
function sourceRoot(node) { return visualEditorScope(node).fullpath.split('.').slice(1).join('.') + '.layout.center.design'; }
function editorData(node) { return visualEditorScope(node).absDatapath('.'); }
function editorField(node, name) {
    return node.rootBuilder.binding.nodeIds.get(visualEditorScope(node).getAttr('visualEditorId') + name);
}
// Catalogue taxonomy: the schema remains authoritative for the available tags.
const catalogueSections = [
    ['html.structure', 'Structure', 'main header footer nav section article aside div address search'],
    ['html.text', 'Text and headings', 'h1 h2 h3 h4 h5 h6 hgroup p span a b strong i em small s u mark abbr cite code pre blockquote q br wbr hr time data dfn kbd samp var bdi bdo ruby rt rp sub sup ins del_'],
    ['html.lists', 'Lists', 'ul ol li dl dt dd'],
    ['html.forms', 'Forms', 'form input textarea select selectedcontent option optgroup datalist label fieldset legend output progress meter html_button'],
    ['html.tables', 'Tables', 'table caption colgroup col thead tbody tfoot tr th td'],
    ['html.media', 'Media and embedded content', 'img picture source audio video track canvas iframe embed object param map area'],
    ['html.interaction', 'Disclosure and menus', 'details summary html_dialog html_menu'],
    ['html.document', 'Document and metadata', 'html head body title base meta link style script noscript template slot'],
    ['components.layout.containers', 'Containers', 'borderContainer contentPane framePane stackContainer tabContainer'],
    ['components.layout.windows', 'Windows', 'dialog floatingPane'],
    ['components.layout.composition', 'Composition', 'formlet groupBox trayPane transformPane'],
    ['components.inputs.text', 'Text', 'textbox textBoxArea passwordbox'],
    ['components.inputs.choices', 'Choices', 'checkbox radioButton radioButtonText checkBoxText filteringSelect comboBox callbackSelect dbSelect dbComboBox'],
    ['components.inputs.numbers', 'Numbers and colors', 'numberTextBox horizontalSlider verticalSlider colorpicker'],
    ['components.inputs.dates', 'Dates and times', 'dateTextBox timeTextBox dateCalendar'],
    ['components.commands', 'Buttons and menus', 'button toggleButton dropDownButton menu menuline spacer'],
    ['components.data', 'Trees and grids', 'tree grid searchBox'],
    ['components.editors', 'Editors and previews', 'codeMirror htmlEditor htmlPreview markdownEditor markdownPreview typstPreview']
];
const sectionTitles = {html:'HTML', components:'Gramlot', 'components.layout':'Layout', 'components.inputs':'Inputs'};
const styleParameters = Object.fromEntries(['class','style','width','height','padding','margin','color','background']
    .map(name => [name, {dtype:'T', nullable:true}]));
// These prefixes belong to the renderer's existing Labelbox attribute contract.
const labelboxParameters = Object.fromEntries(['lbl_', 'box_'].flatMap(prefix =>
    Object.entries(styleParameters).map(([name, spec]) => [prefix + name, spec])));
const parameterThemes = [
    ['general', 'General'], ['behaviour', 'Behaviour'], ['validation', 'Validation'],
    ['styles', 'Styles'], ['container', 'Container']
];
const editableTypes = ['T','B','L','R','N','D','H'];
function parameterTheme(name, parentFields) {
    if (/^(lbl|box)(_|$)/.test(name)) return 'general';
    if (parentFields.has(name)) return 'container';
    if (name.startsWith('validate_')) return 'validation';
    if (Object.hasOwn(styleParameters, name) || /^(icon|tab)/.test(name) ||
        ['design','labelPosition','switch_color','orientation'].includes(name)) return 'styles';
    if (/^(on[A-Z]|get[A-Z]|drag|drop)/.test(name) ||
        ['action','command','disabled','readonly','live','beforeClose','open','collapsed','closable','movable','resizable','collapsible','maximizable','maximized','persist','autoCollapse','openOnClick'].includes(name)) return 'behaviour';
    return 'general';
}

const specifications = (node, tag, current = null) => {
    const info = node.builder.schema[tag];
    if (!info) throw new Error(`Unknown widget: ${tag}`);
    const component = info._meta?.gramlot_component;
    const textContent = (!current || !(current.getValue(true) instanceof current.builder.source.constructor)) &&
        (!component || (component.command && !Object.hasOwn(component.parameters, 'caption')));
    return {...(textContent ? {_text:{dtype:'T', nullable:true}} : {}), ...styleParameters, ...(component?.labelbox ? labelboxParameters : {}), ...(component?.parameters ?? {}),
        ...(node._getMeta('gramlot_component')?.childParameters ?? {})};
};

export class VisualEditorLogic {
    chatRender(node, params) { return chatRender(this.page, node, params); }
    chatCompleted(node, params) {
        chatCompleted(this.page, node, params);
        if (node.GET(`${editorData(node)}.assistant.active`)) node.SET('.pending', true);
    }
    chatReset(node) { return chatReset(this.page, node); }
    chatResize(node) { return chatResize(this.page, node); }
    chatPickAttachments(node) { return chatPickAttachments(this.page, node); }
    chatRenderAttachments(node, params) { return chatRenderAttachments(this.page, node, params); }
    chatRemoveAttachment(node) { return chatRemoveAttachment(this.page, node); }
    chatSend(node) {
        if (node.GET('.pending') || !node.GET('.conversation.ready') || !node.GET('.draft')?.trim()) return;
        const editor = visualEditorScope(node);
        const mode = editor.GET('.editingMode');
        const wire = node.builder.source.getNode(sourceRoot(node)).value.toTytx();
        const content = mode === 'code' ? editor.GET('.codeDocument.content') : wire;
        if (mode === 'code' && !editor.GET('.codeDocument.writable')) { node.SET('.error', 'Page code editing is disabled by the host'); return; }
        const run = (editor.GET('.assistantRun.run') ?? 0) + 1;
        const scope = editor.GET('.catalogueScope');
        const schema = {commonParameters:styleParameters, labelboxParameters, widgets:{}};
        for (const [tag, info] of Object.entries(node.builder.schema)) {
            if (!catalogueAllows(scope, tag, info._meta ?? {})) continue;
            if (info._meta?.data_element || info._meta?.subbuilder || info._meta?.container) continue;
            const component = info._meta?.gramlot_component;
            schema.widgets[tag] = {parameters:component?.parameters ?? {}, labelbox:!!component?.labelbox,
                childParameters:component?.childParameters ?? {}};
        }
        editor.SET('.assistantRun', new Bag({run, mode, next:0, expected:content, blocked:false}));
        editor.SET('.assistantStatus', 'Waiting for editing instructions…');
        editor.SET('.assistant.context', new Bag({run, mode, language:editor.GET('.codeDocument.language') ?? null, codeWritable:editor.GET('.codeDocument.writable') === true, code:mode === 'code' ? content : null, source:wire, selected:editor.GET('.selection'), schema:JSON.stringify(schema)}));
        return chatSend(this.page, node);
    }
    assistantState(node, {active}) {
        if (active === false) {
            node.SET(`${editorData(node)}.chat.pending`, false);
            const editor = visualEditorScope(node);
            if (editor.GET('.assistantRun.next') === 0) editor.SET('.assistantStatus', '');
        }
    }
    assistantApply(node, {operations}) {
        if (!(operations instanceof Bag)) return;
        const editor = visualEditorScope(node);
        for (const entry of operations.getNodes()) {
            if (entry.attr.run !== editor.GET('.assistantRun.run') || entry.attr.index < editor.GET('.assistantRun.next')) continue;
            const page = node.builder.source.getNode(sourceRoot(node)).value;
            const mode = editor.GET('.assistantRun.mode');
            const before = mode === 'code' ? editor.GET('.codeDocument.content') : page.toTytx();
            let applied = false, stop = false, error = '';
            try {
                if (editor.GET('.assistantRun.blocked')) {
                    stop = true;
                    throw new Error('The document was replaced during editing');
                }
                if (entry.attr.index !== editor.GET('.assistantRun.next')) {
                    stop = true;
                    throw new Error('Editing sequence is incomplete');
                }
                if (before !== editor.GET('.assistantRun.expected')) {
                    stop = true;
                    throw new Error('Source changed during the request. Remaining edits stopped; send a new instruction.');
                }
                const operation = JSON.parse(entry.value);
                if (mode === 'code') {
                    if (operation.operation !== 'replace_code' || typeof operation.content !== 'string') throw new Error('Expected a Page code draft operation');
                    if (!editor.GET('.codeDocument.writable') || editor.GET('.codeDocument.busy')) throw new Error('Page code draft is not editable now');
                    editor.SET('.codeDocument.content', operation.content);
                    editor.SET('.codeDocument.status', 'AI draft · Save to apply');
                    editor.SET('.codeOpen', true);
                } else this.applySourceEdit(editor, operation);
                applied = true;
                editor.SET('.assistantRun.expected', mode === 'code' ? editor.GET('.codeDocument.content') : page.toTytx());
                editor.SET('.assistantStatus', `Applied ${entry.attr.index + 1}: ${mode === 'code' ? 'Page code draft' : operation.operation + ' ' + operation.path}`);
            } catch (caught) {
                error = caught.message;
                if ((mode === 'code' ? editor.GET('.codeDocument.content') : page.toTytx()) !== before) stop = true;
                editor.SET('.assistantRun.blocked', stop);
                editor.SET('.assistantStatus', `${stop ? 'Editing stopped' : 'Rejected'}: ${error}`);
            }
            editor.SET('.assistantRun.next', entry.attr.index + 1);
            editor.SET('.assistant.ack', new Bag({run:entry.attr.run, index:entry.attr.index,
                applied, stop, error, mode, code:mode === 'code' ? editor.GET('.codeDocument.content') : null, source:page.toTytx(), selected:editor.GET('.selection')}));
        }
    }
    applySourceEdit(node, operation) {
        const {operation:action, path, parent:parentPath, tag, label, attributes = {}, text} = operation;
        const validPath = value => typeof value === 'string' && /^pageRoot(?:\.[A-Za-z_][A-Za-z0-9_]*)*$/.test(value);
        if (!validPath(path) || (action === 'move' && !validPath(parentPath))) throw new Error(`Use dot-separated paths inside pageRoot: ${JSON.stringify(path)}`);
        if (!['insert','update','remove','move'].includes(action)) throw new Error('Unknown Source editing operation');
        if (['remove','move'].includes(action) && path === 'pageRoot') throw new Error('The page root is protected');
        if (action === 'insert' && (typeof label !== 'string' || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(label))) throw new Error('Choose an explicit node label');
        if (!attributes || typeof attributes !== 'object' || Array.isArray(attributes)) throw new Error('Expected scalar attributes');
        for (const [name, value] of Object.entries(attributes)) {
            if (name.startsWith('_') || /^(connect_|on[A-Z]|script$|formula$|action$|func$|remote_)/.test(name) ||
                ['constructor','prototype'].includes(name) || (value !== null && typeof value === 'object') ||
                (typeof value === 'string' && (value.startsWith('==') || value.includes(':='))))
                throw new Error(`Unsupported generated attribute: ${name}`);
        }
        if (text !== undefined && typeof text !== 'string') throw new Error('Text must be literal text');
        const design = node.builder.source.getNode(sourceRoot(node)), app = node.rootBuilder.binding.gramlot;
        const candidate = app.src.prepareSource(design.value.toTytx(), design.builder);
        const target = candidate.getNode(path);
        if (!target) throw new Error('The Source target no longer exists');
        let changed = target;
        if (action === 'insert') {
            if (!node.builder.schema[tag] || ['script','style','iframe','object','embed'].includes(tag) ||
                node.builder.schema[tag]._meta?.data_element) throw new Error('Choose a visual widget from the catalogue');
            if (target.value instanceof candidate.constructor && target.value.getNode(label)) throw new Error('This node label is already in use');
            changed = target.builder.commandOnNode(target, tag, text ?? null, {...attributes, node_label:label});
        } else if (action === 'update') {
            if (text !== undefined && target.value instanceof candidate.constructor) throw new Error('Text cannot replace a populated container');
            const attrs = {...target.getAttr()};
            for (const [name, value] of Object.entries(attributes)) {
                if (value === null) delete attrs[name]; else attrs[name] = value;
            }
            target.setAttr(attrs, true, false, false);
            if (text !== undefined) target.setValue(text);
        } else if (action === 'remove') target.parentBag.popNode(target.label);
        else {
            if (Object.keys(attributes).length || text !== undefined) throw new Error('Move and property edits must be separate operations');
            if (parentPath === path || parentPath.startsWith(path + '.')) throw new Error('Cannot move a node into itself');
            const parent = candidate.getNode(parentPath);
            if (!parent) throw new Error('The destination no longer exists');
            if (parent.value instanceof candidate.constructor && parent.value.getNode(target.label)) throw new Error('The destination already contains this label');
            changed = this.appendBranch(parent, target, target.label);
        }
        const validateChildren = parent => {
            if (!(parent.value instanceof candidate.constructor)) return;
            parent.builder.validateChildren(parent.nodeTag, parent.value.getNodes().map(child => child.nodeTag));
            for (const child of parent.value.getNodes()) {
                for (const [name, spec] of Object.entries(specifications(parent, child.nodeTag, child)))
                    this.validateParameter(parent, child, name, spec, child.getAttr(name));
                validateChildren(child);
            }
        };
        candidate.getNodes().forEach(validateChildren);
        validateCatalogueSource(visualEditorScope(node).GET('.catalogueScope'), candidate);
        app.src.renderer.validateCandidate(candidate, {replacingNode:design});
        const current = node.builder.source.getNode(`${sourceRoot(node)}.${path}`);
        let selected = path;
        if (action === 'insert') {
            this.appendBranch(current, changed, label);
            selected = `${path}.${label}`;
        } else if (action === 'update') {
            current.setAttr({...changed.getAttr()}, true, false, false);
            if (text !== undefined) current.setValue(text);
        } else if (action === 'remove') {
            selected = path.slice(0, path.lastIndexOf('.'));
            current.parentBag.popNode(current.label);
        } else {
            this.applyDrop(node, {item:node.builder.source.getNode(`${sourceRoot(node)}.${parentPath}`),
                path:parentPath, dropValues:{'app/source':{path}}});
            selected = `${parentPath}.${current.label}`;
        }
        node.SET('.sourceSearch', '');
        node.SET('.selection', selected);
    }

    // Editor view resources live in the editor node's _internal (GC-225) and reach the design root by its
    // path; selection itself remains in the Data Bag.
    initializeCanvasSelection(node) {
        const renderer = node.rootBuilder.binding.renderer;
        const editor = visualEditorScope(node), css = editor.GET('.canvasCss'), path = sourceRoot(editor);
        if (css != null) this.applyCanvasCss(editor, css);
        const previous = editor._internal.canvasSelection;
        previous?.dispose();
        const canvas = editor._internal.canvasDocument;
        const picker = new SourcePicker({renderer, source:editor.builder.source, path,
            ...(canvas ? {canvas:canvas.body} : {}),
            onSelect:selected => {
                const design = editor.builder.source.getNode(path);
                editor.SET('.sourceSearch', '');
                editor.SET('.selection', selected.fullpath.slice(design.fullpath.length + 1));
            }});
        editor._internal.canvasSelection = picker;
        if (!previous) renderer.onDispose(editor.builder.source.getNode(path).parentNode, () => {
            delete editor._internal.canvasSelection; delete editor._internal.canvasDocument;
        });
        this.highlightSelection(node);
    }
    applyCanvasCss(node, texts) {
        if (!Array.isArray(texts) || texts.some(text => typeof text !== 'string'))
            throw new TypeError('canvas CSS must be a list of CSS texts');
        const editor = visualEditorScope(node);
        let canvas = editor._internal.canvasDocument;
        if (!canvas) {
            canvas = editor._internal.canvasDocument = new VisualEditorCanvas({app:editor.rootBuilder.binding.gramlot, editor,
                design:editor.builder.source.getNode(sourceRoot(editor))});
        }
        canvas.setCss(texts);
    }
    setCanvasCss(node, texts) {
        const editor = visualEditorScope(node);
        this.applyCanvasCss(editor, texts);
        editor.SET('.canvasCss', texts);
        this.initializeCanvasSelection(editor);
    }
    highlightSelection(node) {
        const design = node.builder.source.getNode(sourceRoot(node));
        const path = node.GET('.selection');
        visualEditorScope(node)._internal.canvasSelection?.select(path ? design.staticValue.getNode(path) : null);
    }

    clipboardShortcut(node, event) {
        if (event.defaultPrevented || event.repeat || node.GET('.clipboardOpen') || node.GET('.insertionOpen') || node.GET('.uploadOpen')) return;
        if (event.composedPath().some(element => element.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName))) return;
        const key = event.key.toLowerCase();
        const action = key === 'f8' ? 'cutBranch' : key === 'f9' ? 'pasteBranch' : null;
        if (!action || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
        event.preventDefault();
        this[action](node);
    }
    clipboardModifiers(node, event) {
        node.SET('.clipboardDropEffect', event.altKey ? 'copy' : 'move');
    }
    cutBranch(node) { this.beginClipboard(node, node.GET('.selection'), false); }
    copyBranch(node) { this.beginClipboard(node, node.GET('.selection'), true); }
    dropClipboard(node, {dropValues, dropEffect}) {
        this.beginClipboard(node, dropValues['app/source'].path, dropEffect === 'copy');
    }
    prepareClipboard(node, {path, dragValues}) {
        node.SET('.sourceDropEffect', 'copy');
        dragValues['app/clipboard'] = {path};
    }
    branchSnapshot(node, path) {
        const design = node.builder.source.getNode(sourceRoot(node));
        const source = node.rootBuilder.binding.gramlot.src.prepareSource(design.getValue(true).toTytx(), design.builder);
        const branch = source.getNode(path);
        if (!branch) throw new Error('The Source branch no longer exists');
        const check = current => {
            if (current.resolver) throw new Error('Resolver-backed branches cannot be stored in this trial');
            if (current.value instanceof node.builder.source.constructor) current.value.getNodes().forEach(check);
        };
        check(branch);
        const result = new node.builder.source.constructor(null, branch.builder);
        branch.parentBag.popNode(branch.label);
        result.setItem(branch.label, branch.getValue(true), {...branch.getAttr()}, '>', false, false,
            'editor', false, true, null, branch.nodeTag);
        return result.toTytx();
    }
    beginClipboard(node, path, copy) {
        node.SET('.error', '');
        try {
            if (!path || path === 'pageRoot') throw new Error('Choose a branch below the page root');
            const branch = node.builder.source.getNode(`${sourceRoot(node)}.${path}`);
            if (!branch) throw new Error('The Source branch no longer exists');
            const wire = this.branchSnapshot(node, path);
            node.SET('.clipboardDraft', new Bag({path, copy, name:branch.label, wire,
                parentTag:branch.parentNode.nodeTag}));
            node.SET('.clipboardOpen', true);
        } catch (error) { node.SET('.error', error.message); }
    }
    saveClipboard(node) {
        node.SET('.error', '');
        try {
            const name = node.GET('.clipboardDraft.name')?.trim();
            if (!name) throw new Error('Choose a name for the branch');
            const path = node.GET('.clipboardDraft.path');
            const wire = node.GET('.clipboardDraft.wire');
            const copy = node.GET('.clipboardDraft.copy');
            const branch = node.builder.source.getNode(`${sourceRoot(node)}.${path}`);
            if (!copy && (!branch || this.branchSnapshot(node, path) !== wire))
                throw new Error('The branch changed; select it again before cutting');
            const shelf = node.GET('.clipboard');
            let index = 1;
            while (shelf.getNode(`branch_${index}`)) index++;
            const key = `branch_${index}`;
            // Store the complete snapshot before removing any live Source.
            shelf.setItem(key, wire, {name, parentTag:node.GET('.clipboardDraft.parentTag')});
            node.SET('.clipboardSelection', key);
            node.SET('.clipboardVisible', true);
            if (!copy) {
                node.SET('.selection', path.slice(0, path.lastIndexOf('.')));
                branch.parentBag.popNode(branch.label);
            }
            node.SET('.clipboardOpen', false);
            node.SET('.fileStatus', `${copy ? 'Copied' : 'Cut'}: ${name}`);
        } catch (error) { node.SET('.error', error.message); }
    }
    pasteBranch(node) {
        node.SET('.error', '');
        try { this.beginPaste(node, node.GET('.clipboardSelection'), node.GET('.selection')); }
        catch (error) { node.SET('.error', error.message); }
    }
    beginPaste(node, key, path) {
        const saved = key ? node.GET('.clipboard').getNode(key) : null;
        if (!saved) throw new Error('Choose a saved branch in the clipboard');
        const parent = path ? node.builder.source.getNode(`${sourceRoot(node)}.${path}`) : null;
        if (!parent) throw new Error('Choose a destination in the Source tree');
        const source = node.rootBuilder.binding.gramlot.src.prepareSource(saved.getValue(true), parent.builder);
        validateCatalogueSource(visualEditorScope(node).GET('.catalogueScope'), source);
        const branch = source.getNodes()[0];
        parent.builder.validateParent(branch.nodeTag, parent.nodeTag);
        const body = parent.getValue(true);
        parent.builder.validateChildren(parent.nodeTag, [...(body instanceof node.builder.source.constructor
            ? body.getNodes().map(child => child.nodeTag) : []), branch.nodeTag]);
        const attrs = {...branch.getAttr()};
        const own = parent.builder.schema[branch.nodeTag]._meta?.gramlot_component?.parameters ?? {};
        const previous = parent.builder.schema[saved.getAttr('parentTag')]?._meta?.gramlot_component?.childParameters ?? {};
        for (const name of Object.keys(previous)) if (!(name in own)) delete attrs[name];
        branch.setAttr(attrs, true, false, false);
        node.SET('.insertion', new Bag({parentPath:path, tag:branch.nodeTag, clipboard:source.toTytx()}));
        const entries = specifications(parent, branch.nodeTag);
        const required = Object.entries(entries).filter(([name, spec]) => spec.required &&
            (attrs[name] == null || attrs[name] === '' || spec.unique));
        if (!required.length) { this.finishPaste(node); return; }
        const fields = editorField(node, 'InsertFields');
        fields.getValue(true).clear();
        const root = node.builder.wrapSource(fields);
        root.p(`Paste ${saved.getAttr('name')} into ${parent.label} [${parent.nodeTag}]`, {class:'visual-editor-hint'});
        const form = root.formlet({columns:2, gap:'4px 6px', lbl_position:'TL', box_c_width:'100%', align_items:'start'});
        for (const [name, spec] of required) this.parameterField(node, form, branch.nodeTag, name, spec, 'insertion', spec.default);
        node.SET('.insertionOpen', true);
    }
    appendBranch(parent, branch, label) {
        const Source = parent.builder.source.constructor;
        let body = parent.getValue(true);
        if (!(body instanceof Source)) {
            const previous = body;
            body = new Source(null, parent.builder);
            parent.builder.promoteNodeValue(parent, previous, body);
        }
        branch.parentBag.popNode(branch.label);
        body.setItem(label, branch.getValue(true), {...branch.getAttr()}, '>', false, false,
            'editor', false, true, null, branch.nodeTag);
        return body.getNode(label);
    }
    finishPaste(node) {
        const path = node.GET('.insertion.parentPath');
        const parent = node.builder.source.getNode(`${sourceRoot(node)}.${path}`);
        if (!parent) throw new Error('The destination no longer exists');
        const app = node.rootBuilder.binding.gramlot;
        const source = app.src.prepareSource(node.GET('.insertion.clipboard'), parent.builder);
        validateCatalogueSource(visualEditorScope(node).GET('.catalogueScope'), source);
        const branch = source.getNodes()[0];
        const attrs = {...branch.getAttr()};
        for (const [name, spec] of Object.entries(specifications(parent, branch.nodeTag))) {
            if (!spec.required) continue;
            const type = node.GET(`.insertion.types.${name}`);
            const value = node.GET(`.insertion.parameters.${name}${spec.enum ? '' : type ? '.' + type : ''}`);
            if (value != null) attrs[name] = value;
            this.validateParameter(parent, null, name, spec, attrs[name]);
        }
        branch.setAttr(attrs, true, false, false);
        const body = parent.getValue(true);
        let label = branch.label, index = 1;
        while (body instanceof node.builder.source.constructor && body.getNode(label)) label = `${branch.label}_${index++}`;
        // Validate the prospective page, including duplicate IDs, before touching the live branch.
        const design = node.builder.source.getNode(sourceRoot(node));
        const candidate = app.src.prepareSource(design.getValue(true).toTytx(), design.builder);
        const candidateParent = candidate.getNode(path);
        candidateParent.builder.validateParent(branch.nodeTag, candidateParent.nodeTag);
        const children = candidateParent.getValue(true);
        candidateParent.builder.validateChildren(candidateParent.nodeTag, [...(children instanceof node.builder.source.constructor
            ? children.getNodes().map(child => child.nodeTag) : []), branch.nodeTag]);
        const inserted = this.appendBranch(candidateParent, branch, label);
        validateCatalogueSource(visualEditorScope(node).GET('.catalogueScope'), candidate);
        app.src.renderer.validateCandidate(candidate, {replacingNode:design});
        this.appendBranch(parent, inserted, label);
        node.SET('.insertionOpen', false);
        node.SET('.sourceSearch', '');
        node.SET('.selection', `${path}.${label}`);
        node.SET('.fileStatus', 'Branch pasted');
    }

    openCode(node) {
        const editor = visualEditorScope(node);
        editor.SET('.codeOpen', true);
        editor.SET('.editingMode', 'code');
    }
    async codeSave(node) {
        const editor = visualEditorScope(node), doc = editor.GET('.codeDocument');
        if (doc.getItem('busy') || !doc.getItem('writable')) return;
        const content = doc.getItem('content'), revision = doc.getItem('revision');
        let saved = false;
        if (content === doc.getItem('saved')) return;
        const request = new AbortController();
        const release = this.page.src.renderer.onDispose(editor, () => request.abort());
        doc.setItem('busy', true); doc.setItem('status', 'Saving Page code…');
        const design = editor.value.getNode('layout.center.design'), source = design.value.toTytx();
        try {
            const result = await this.page.rpc.call('data', 'editor_document_save', {
                key:editor.getAttr('codeDocumentKey'), content, revision
            }, {signal:request.signal});
            if (request.signal.aborted) return;
            doc.setItem('revision', result.revision); doc.setItem('saved', content); saved = true;
            doc.setItem('status', 'Page code saved');
            if (source !== design.value.toTytx()) {
                doc.setItem('status', 'Page code saved; Source changed meanwhile. Use Preview saved to replace it.');
            } else await this.codeLoadPreview(editor, request);
        } catch (error) {
            if (!request.signal.aborted) doc.setItem('status', `${saved ? 'Page code saved; preview failed' : 'Save failed'}: ${error.message}`);
        } finally {
            release();
            if (!request.signal.aborted) doc.setItem('busy', false);
        }
    }
    async codePreview(node) {
        const editor = visualEditorScope(node), doc = editor.GET('.codeDocument');
        if (doc.getItem('busy')) return;
        const request = new AbortController();
        const release = this.page.src.renderer.onDispose(editor, () => request.abort());
        doc.setItem('busy', true);
        try { await this.codeLoadPreview(editor, request); }
        catch (error) { if (!request.signal.aborted) doc.setItem('status', `Preview failed: ${error.message}`); }
        finally { release(); if (!request.signal.aborted) doc.setItem('busy', false); }
    }
    async codeLoadPreview(editor, request) {
        const doc = editor.GET('.codeDocument'), design = editor.value.getNode('layout.center.design');
        const before = design.value.toTytx();
        const wire = await this.page.rpc.call('source', 'editor_document_preview', {
            key:editor.getAttr('codeDocumentKey'), revision:doc.getItem('revision'), data_root:editor.GET('.dataRoot')
        }, {signal:request.signal});
        if (request.signal.aborted) return;
        if (design.value.toTytx() !== before) throw new Error('Source changed while preparing preview; it was retained');
        const candidate = this.page.src.prepareSource(wire, design.builder);
        validateCatalogueSource(editor.GET('.catalogueScope'), candidate);
        this.page.src.renderer.validateCandidate(candidate, {replacingNode:design});
        if (editor.GET('.assistantRun')) editor.SET('.assistantRun.blocked', true);
        editor.SET('.selection', null);
        design.setValue(candidate, true, {_text:null}, true);
        editor.SET('.selection', 'pageRoot');
        doc.setItem('status', doc.getItem('content') === doc.getItem('saved') ? 'Saved Page code · preview updated' : 'Preview updated from saved page code; newer draft retained');
    }
    newPage(node) {
        if (node.GET('.assistantRun')) node.SET('.assistantRun.blocked', true);
        node.SET('.selection', null);
        node.SET('.insertionOpen', false);
        node.SET('.error', '');
        const design = node.builder.source.getNode(sourceRoot(node));
        design.getValue(true).clear();
        const dataRoot = node.GET('.dataRoot');
        if (dataRoot) node.SET(dataRoot, new Bag());
        else for (const entry of node.rootBuilder.data.getNodes()) {
            if (entry.label !== '__editor') node.rootBuilder.data.popNode(entry.label);
        }
        node.builder.wrapSource(design).div({node_label:'pageRoot', ...(dataRoot ? {datapath:dataRoot} : {})});
        node.SET('.filename', 'page.grmlt');
        node.SET('.fileStatus', '');
        node.SET('.sourceSearch', '');
        node.SET('.dataSearch', '');
        node.SET('.selection', 'pageRoot');
    }
    async copySource(node) {
        node.SET('.fileStatus', '');
        try {
            await node.rootBuilder.binding.gramlot.utl.inout.copyText(this.currentSource(node));
            node.SET('.fileStatus', 'Source copied');
        } catch (error) { node.SET('.fileStatus', `Copy failed: ${error.message}`); }
    }
    downloadPage(node) {
        node.rootBuilder.binding.gramlot.utl.inout.saveText(this.currentSource(node), node.GET('.filename'), 'application/json');
    }

    openUpload(node) { node.SET('.uploadOpen', true); }
    sourceUploaded(node, {item, result}) {
        try {
            this.loadSource(node, {source:result, filename:item.value.getItem('name')});
            node.SET('.fileStatus', 'Source opened');
            node.SET('.uploadOpen', false);
        } catch (error) {
            node.SET('.fileStatus', `Open failed: ${error.message}`);
            throw error;
        }
    }
    initializeDocument(node) {
        const editor = visualEditorScope(node), source = editor.builder.source;
        const prefix = sourceRoot(editor).split('.');
        const subscription = `${editor.getAttr('visualEditorId')}-document`;
        editor.SET('.modified', false);
        source.subscribe(subscription, {any:event => {
            if (prefix.every((part, index) => event.pathlist[index] === part)) editor.SET('.modified', true);
        }});
        editor.rootBuilder.binding.renderer.onDispose(editor, () => source.unsubscribe(subscription, {any:true}));
    }
    currentSource(node) {
        const editor = visualEditorScope(node);
        return editor.builder.source.getNode(sourceRoot(editor)).getValue(true).toTytx();
    }
    markSaved(node) { visualEditorScope(node).SET('.modified', false); }
    loadSource(node, {source, filename}) {
        const editor = visualEditorScope(node);
        if (typeof source !== 'string') throw new TypeError('source must be Source TYTX');
        if (typeof filename !== 'string' || !filename.trim()) throw new TypeError('filename must be a non-empty string');
        const app = editor.rootBuilder.binding.gramlot;
        const target = editor.builder.source.getNode(sourceRoot(editor));
        const candidate = app.src.prepareSource(source, target.builder);
        const roots = candidate.getNodes();
        if (roots.length !== 1 || roots[0].label !== 'pageRoot') throw new Error('Expected one pageRoot Source');
        validateCatalogueSource(editor.GET('.catalogueScope'), candidate);
        app.src.renderer.validateCandidate(candidate, {replacingNode:target});
        if (editor.GET('.assistantRun')) editor.SET('.assistantRun.blocked', true);
        editor.SET('.selection', null);
        target.setValue(candidate, true, {_text:null}, true);
        editor.SET('.filename', filename);
        editor.SET('.insertionOpen', false);
        editor.SET('.sourceSearch', '');
        editor.SET('.selection', 'pageRoot');
        this.markSaved(editor);
    }
    toggleNavigation(node) { node.SET('.navigationOpen', node.GET('.navigationOpen') === 'close' ? true : 'close'); }
    openCatalogue(node) { node.SET(`${editorData(node)}.catalogueOpen`, true); }
    openProperties(node) { this.showProperties(node, {path:node.GET('.selection')}); }
    sourceLabel(node, {item}) { return {text:`${item.label} [${item.nodeTag}]`}; }
    dropNode(node, event) {
        node.SET('.error', '');
        try { this.applyDrop(node, event); }
        catch (error) { node.SET('.error', error.message); }
    }
    insertWidget(node) {
        node.SET('.error', '');
        try { this.applyInsert(node); }
        catch (error) { node.SET('.error', error.message); }
    }
    initializeEditorAppearance(node) {
        const editor = visualEditorScope(node);
        const document = node.rootBuilder.binding.renderer.destination.ownerDocument;
        editor.SET('.appearanceProfile', 'compact');
        editor.SET('.appearancePalette', 'joanna');
        editor.SET('.appearanceMode', document.documentElement.getAttribute('data-theme') || 'dark');
    }
    applyEditorAppearance(node, {profile, palette, mode}) {
        if (!profile || !palette || !mode) return;
        if (!Object.hasOwn(appearanceStyles, profile) || !Object.hasOwn(paletteStyles, palette) || !['light','dark'].includes(mode))
            throw new Error('Choose a declared theme, palette and color mode');
        const editor = visualEditorScope(node);
        editor.SET('.appearanceCss', appearanceStyles[profile] + '\n' + paletteStyles[palette]);
        node.rootBuilder.binding.renderer.destination.ownerDocument.documentElement.setAttribute('data-theme', mode);
    }
    initializeEditor(node, {dataRoot}) {
        const scope = node.GET('.catalogueScope');
        validateCatalogue(scope);
        if (Array.isArray(scope)) for (const tag of scope) {
            if (!node.builder.schema[tag]) throw new Error(`Unknown catalogue tag: ${tag}`);
        }
        node.SET('.editingMode', 'source');
        node.SET('.clipboard', new Bag());
        node.SET('.clipboardVisible', false);
        node.SET('.clipboardDropEffect', 'move');
        node.SET('.sourceDropEffect', 'move');
        node.SET('.dataRoot', dataRoot);
        node.SET('.filename', 'page.grmlt');
        node.SET('.fileStatus', '');
        node.SET('.selection', 'pageRoot');
        if (dataRoot) {
            if (node.GET(dataRoot) == null) node.SET(dataRoot, new Bag());
        } else {
            // Existing parent-path syntax gives the canvas the actual Data root.
            // This context belongs to the editor, outside the exported page Source.
            const context = editorData(node);
            const parents = context.split('.').map(() => '#parent').join('.');
            node.builder.source.getNode(sourceRoot(node)).setAttr({datapath:`${context}.${parents}`});
        }
        const catalogue = new Bag();
        const groups = new Map([['', catalogue]]);
        const ensureGroup = (path, caption) => {
            if (groups.has(path)) return groups.get(path);
            const segments = path.split('.'), label = segments.pop(), parentPath = segments.join('.');
            const parent = ensureGroup(parentPath, sectionTitles[parentPath]);
            const bag = new Bag();
            parent.setItem(label, bag, {caption});
            groups.set(path, bag);
            return bag;
        };
        for (const [path, caption, tags] of catalogueSections) {
            if (tags.split(' ').some(tag => node.builder.schema[tag] && catalogueAllows(scope, tag, node.builder.schema[tag]._meta ?? {}))) ensureGroup(path, caption);
        }
        for (const [tag, info] of Object.entries(node.builder.schema).sort(([a], [b]) => a.localeCompare(b))) {
            if (!catalogueAllows(scope, tag, info._meta ?? {})) continue;
            if (info._meta?.data_element || info._meta?.subbuilder || info._meta?.container) continue;
            const root = info._meta?.gramlot_component ? 'components' : 'html';
            const section = catalogueSections.find(([path, , tags]) => path.startsWith(root + '.') && tags.split(' ').includes(tag));
            const path = section ? section[0] : `${root}.other`;
            ensureGroup(path, section ? section[1] : 'Other elements').setItem(tag, null, {caption:tag, tag});
        }
        node.SET('.catalogue', catalogue);
    }
    prepareWidget(node, {item, dragValues}) {
        node.SET('.sourceDropEffect', 'copy');
        if (!item.attr.tag) return false;
        dragValues['app/widget'] = {tag:item.attr.tag};
    }
    prepareSource(node, {path, dragValues}) {
        node.SET('.sourceDropEffect', 'move');
        dragValues['app/source'] = {path};
    }
    applyDrop(node, {item, path, dropValues}) {
        if (dropValues['app/clipboard']) {
            this.beginPaste(node, dropValues['app/clipboard'].path, path);
            return;
        }
        if (dropValues['app/source']) {
            const sourcePath = `${sourceRoot(node)}.${dropValues['app/source'].path}`;
            const targetPath = `${sourceRoot(node)}.${path}`;
            const moving = node.builder.source.getNode(sourcePath);
            if (!moving || sourcePath === `${sourceRoot(node)}.pageRoot`) throw new Error('The page root cannot be moved');
            validateCatalogueSource(visualEditorScope(node).GET('.catalogueScope'), moving.parentBag);
            if (moving.resolver) throw new Error('Resolver-backed Source nodes cannot be moved in this trial');
            if (sourcePath === targetPath || targetPath.startsWith(sourcePath + '.')) throw new Error('A node cannot be moved into itself');
            const parent = item, origin = moving.parentBag, Source = node.builder.source.constructor;
            if (moving.builder !== parent.builder) throw new Error('Nodes cannot cross builder dialects');
            const body = parent.getValue(true);
            const children = body instanceof Source ? body.getNodes().filter(child => child !== moving) : [];
            if (body instanceof Source && body !== origin && body.getNode(moving.label)) throw new Error('The target already contains this label');
            const childSpecs = parent._getMeta('gramlot_component')?.childParameters ?? {};
            for (const [name, spec] of Object.entries(childSpecs)) {
                const value = moving.getAttr(name);
                if (spec.required && value == null) throw new Error(`The moved node requires ${name}`);
                if (spec.enum && value != null && !spec.enum.includes(value)) throw new Error(`Invalid ${name}`);
                if (spec.unique && value != null && children.some(child => child.getAttr(name) === value)) throw new Error(`${name} is already in use`);
            }
            parent.builder.validateParent(moving.nodeTag, parent.nodeTag);
            parent.builder.validateChildren(parent.nodeTag, [...children.map(child => child.nodeTag), moving.nodeTag]);
            if (body === origin) origin.move(origin.getNodes().indexOf(moving), children.length);
            else {
                const destination = body instanceof Source ? body : new Source(null, parent.builder);
                if (!(body instanceof Source)) parent.builder.promoteNodeValue(parent, body, destination);
                const saved = {label:moving.label, tag:moving.nodeTag, value:moving.getValue(true), attrs:{...moving.getAttr()}};
                origin.popNode(saved.label);
                destination.setItem(saved.label, saved.value, saved.attrs, destination.getNodes().length,
                    false, false, 'editor', false, true, null, saved.tag);
            }
            node.SET('.selection', `${path}.${moving.label}`);
            return;
        }
        const tag = dropValues['app/widget'].tag;
        this.validateCatalogueTag(node, tag);
        item.builder.validateParent(tag, item.nodeTag);
        const body = item.getValue(true);
        item.builder.validateChildren(item.nodeTag, [...(body instanceof node.builder.source.constructor ? body.getNodes().map(child => child.nodeTag) : []), tag]);
        const entries = specifications(item, tag);
        const required = Object.entries(entries).filter(([, spec]) => spec.required);
        node.SET('.insertion', new Bag());
        node.SET('.insertion.parentPath', path);
        node.SET('.insertion.tag', tag);
        if (!required.length) { this.applyInsert(node); return; }
        const fields = editorField(node, 'InsertFields');
        fields.getValue(true).clear();
        const root = node.builder.wrapSource(fields);
        root.p(`Insert ${tag} into ${item.label} [${item.nodeTag}]`, {class:'visual-editor-hint'});
        const form = root.formlet({columns:2, gap:'4px 6px', lbl_position:'TL', box_c_width:'100%', align_items:'start'});
        for (const [name, spec] of required) this.parameterField(node, form, tag, name, spec, 'insertion', spec.default);
        node.SET('.insertionOpen', true);
    }
    showProperties(node, {path}) {
        const fields = editorField(node, 'EditorFields');
        fields.getValue(true).clear();
        node.SET('.propertyError', '');
        node.SET('.properties', new Bag());
        if (!path) { node.SET('.propertiesOpen', false); return; }
        const current = node.builder.source.getNode(`${sourceRoot(node)}.${path}`);
        if (!current) { node.SET('.propertiesOpen', false); return; }
        const parent = current.parentNode;
        const entries = specifications(parent, current.nodeTag, current);
        node.SET('.properties.path', path);
        this.attributeRows(node, current);
        node.SET('.propertiesTitle', `${current.label} [${current.nodeTag}]`);
        node.SET('.propertiesHeight', `${Math.min(300, Math.max(180, 80 + Math.ceil(Object.keys(entries).filter(name => parameterTheme(name, new Set()) === 'general').length / 2) * 38))}px`);
        const root = node.builder.wrapSource(fields);
        if (path !== 'pageRoot') root.p(path, {class:'visual-editor-destination'});
        const parentFields = new Set(Object.keys(parent._getMeta('gramlot_component')?.childParameters ?? {}));
        const groups = new Map(parameterThemes.map(([key]) => [key, []]));
        for (const entry of Object.entries(entries)) groups.get(parameterTheme(entry[0], parentFields)).push(entry);
        node.SET('.parameterTab', parameterThemes.find(([key]) => groups.get(key).length)[0]);
        const tabs = root.tabContainer({selectedPage:`^${editorData(node)}.parameterTab`, class:'visual-parameter-tabs',
            tabMode:'underline', height:'100%', min_height:0, flex:1});
        for (const [key, title] of parameterThemes) {
            if (!groups.get(key).length) continue;
            const panel = tabs.contentPane({pageName:key, title, overflow:'auto', padding:'4px', min_height:0,
                ...(key === 'styles' ? {nodeId:visualEditorScope(node).getAttr('visualEditorId') + 'StyleAttributes'} : {})});
            if (key === 'styles') { this.attributeFields(node, panel, current, 'styles'); continue; }
            if (key === 'container') panel.p(`Child parameters of ${parent.nodeTag}`, {class:'visual-editor-hint'});
            if (key === 'behaviour' && Object.hasOwn(entries, 'action')) panel.p('action: use a named Logic method, for example openCatalogue.', {class:'visual-editor-hint'});
            if (key === 'behaviour' && current.nodeTag === 'borderContainer') panel.p('persist remembers splitter sizes and requires a stable container id.', {class:'visual-editor-hint'});
            const form = panel.formlet({columns:2, gap:'4px 6px', lbl_position:'TL', box_c_width:'100%', align_items:'start'});
            if (key === 'general' && current._getMeta('gramlot_component')?.labelbox) {
                this.labelboxFields(node, form, current, entries);
            }
            let advanced;
            const fieldOrder = ([, spec]) => {
                const types = Array.isArray(spec.dtype) ? spec.dtype : [spec.dtype];
                if (!spec.enum && !types.some(type => editableTypes.includes(type))) return 2;
                return spec.dtype === 'B' ? 1 : 0;
            };
            for (const [name, spec] of [...groups.get(key)].sort((a, b) => fieldOrder(a) - fieldOrder(b))) {
                if (current._getMeta('gramlot_component')?.labelbox && /^(lbl|box)(_|$)/.test(name)) continue;
                let target = form;
                if (key === 'validation' && /(_if|_error|_warning|_iswarning)$/.test(name)) {
                    if (!advanced) {
                        const details = panel.details({class:'visual-validation-advanced'});
                        details.summary('Conditions and messages');
                        advanced = details.formlet({columns:2, gap:'4px 6px', lbl_position:'TL', box_c_width:'100%', align_items:'start'});
                    }
                    target = advanced;
                }
                const value = name === '_text' ? current.getValue(true) : current.getAttr(name);
                this.parameterField(node, target, current.nodeTag, name, spec, 'properties', value ?? spec.default);
            }
        }
        const more = tabs.contentPane({nodeId:visualEditorScope(node).getAttr('visualEditorId') + 'MoreAttributes', pageName:'attributes', title:'More attributes', overflow:'auto', padding:'4px', min_height:0});
        this.attributeFields(node, more, current);
        node.SET('.propertiesOpen', true);
    }
    attributeRows(node, current) {
        const rows = new Bag();
        for (const [name, value] of Object.entries(current.getAttr())) {
            if (name === '_meta') continue;
            const type = scalarType(value);
            const text = type ? scalarText(value, type) : '[non-scalar value]';
            rows.setItem(`r${rows.length}`, new Bag({name, type:type ?? 'readonly', text, original:text}));
        }
        node.SET('.properties.attributeRows', rows);
        node.SET('.properties.attributeDraft', new Bag({name:'', type:'string', text:''}));
        node.SET('.properties.attributeDraftHidden', true);
    }
    attributeFields(node, panel, current, scope = 'attributes') {
        const path = node.GET('.properties.path');
        const base = `${editorData(node)}.properties`;
        const renderer = node.rootBuilder.binding.gramlot.src.renderer;
        const parentFields = new Set(Object.keys(current.parentNode._getMeta('gramlot_component')?.childParameters ?? {}));
        const list = panel.div({class:'visual-editor-attribute-list', 'aria-label':scope === 'styles' ? 'Style attributes' : 'Node attributes'});
        const heading = list.div({class:'visual-editor-attribute-row visual-editor-attribute-heading'});
        heading.span('Attribute', {class:'visual-editor-attribute-name'});
        const headingValue = heading.div({class:'visual-editor-attribute-value'});
        headingValue.span('Value');
        headingValue.button('+', {action:'beginAttribute', editingPath:path,
            'aria-label':scope === 'styles' ? 'Add style attribute' : 'Add attribute', title:'Add attribute', class:'visual-editor-attribute-command'});
        for (const row of node.GET('.properties.attributeRows').getNodes()) {
            const name = row.value.getItem('name'), type = row.value.getItem('type'), key = row.label;
            if (scope === 'styles' && parameterTheme(name, parentFields) !== 'styles' && !renderer._isStyleContribution(name)) continue;
            const editable = type !== 'readonly';
            const line = list.div({class:'visual-editor-attribute-row'});
            line.span(name, {class:'visual-editor-attribute-name', title:name});
            const cell = line.div({class:'visual-editor-attribute-value'});
            cell.input({value:`^${base}.attributeRows.${key}.text`, disabled:!editable,
                'aria-label':`${name} attribute value`, title:editable ? type : 'Non-scalar values are read-only'});
            cell.button('×', {action:'removeAttribute', attributeRow:key, editingPath:path, disabled:!editable,
                'aria-label':`Remove ${name} attribute`, title:`Remove ${name}`, class:'visual-editor-attribute-command'});
            // Both tabs bind the same row; one controller owns each write.
            if (editable && scope === 'attributes') line.dataController({func:'changeAttribute', value:`^${base}.attributeRows.${key}.text`,
                attributeRow:key, editingPath:path, _userChanges:true});
        }
        const add = list.div({class:'visual-editor-attribute-row', hidden:`^${base}.attributeDraftHidden`,
            connect_onkeydown:'attributeDraftKey'});
        const nameCell = add.div({class:'visual-editor-attribute-name'});
        nameCell.input({value:`^${base}.attributeDraft.name`, live:true, 'aria-label':'New attribute name', placeholder:'Attribute name'});
        const valueCell = add.div({class:'visual-editor-attribute-value'});
        valueCell.input({value:`^${base}.attributeDraft.text`, live:true, 'aria-label':'New attribute value', placeholder:'Value'});
        const types = valueCell.select({value:`^${base}.attributeDraft.type`, 'aria-label':'New attribute type'});
        for (const type of editorTypes) types.option(type, {value:type});
        valueCell.button('✓', {action:'addAttribute', editingPath:path, 'aria-label':'Apply new attribute', title:'Apply (Enter)', class:'visual-editor-attribute-command'});
        valueCell.button('×', {action:'cancelAttribute', 'aria-label':'Cancel new attribute', title:'Cancel (Escape)', class:'visual-editor-attribute-command'});
    }
    beginAttribute(node, {editingPath}) {
        const editor = visualEditorScope(node);
        if (editingPath !== editor.GET('.selection')) return;
        editor.SET('.properties.attributeDraft', new Bag({name:'', type:'string', text:''}));
        editor.SET('.properties.attributeDraftHidden', false);
        editor.SET('.propertyError', '');
    }
    cancelAttribute(node) {
        visualEditorScope(node).SET('.properties.attributeDraftHidden', true);
    }
    attributeDraftKey(node, event) {
        if (event.isComposing || !['Enter', 'Escape'].includes(event.key)) return;
        event.preventDefault();
        event.stopPropagation();
        const editor = visualEditorScope(node);
        if (event.key === 'Escape') this.cancelAttribute(editor);
        else this.addAttribute(editor, {editingPath:editor.GET('.properties.path')});
    }
    addAttribute(node, {editingPath}) {
        const editor = visualEditorScope(node);
        if (editingPath !== editor.GET('.selection')) return;
        editor.SET('.propertyError', '');
        try {
            const draft = editor.GET('.properties.attributeDraft');
            const name = draft.getItem('name');
            if (!name || !/^[^\s"'<>/=]+$/.test(name)) throw new Error('Enter a valid attribute name.');
            if (['_meta', '__proto__', 'constructor', 'prototype'].includes(name)) throw new Error('Unsupported attribute name.');
            const current = editor.builder.source.getNode(`${sourceRoot(editor)}.${editingPath}`);
            if (!current) throw new Error('The selected Source node no longer exists');
            if (Object.hasOwn(current.getAttr(), name)) throw new Error(`Duplicate attribute: ${name}`);
            const value = parseScalar(draft.getItem('type'), String(draft.getItem('text') ?? ''));
            this.writeAttribute(editor, current, editingPath, name, value, false);
        } catch (error) { editor.SET('.propertyError', error.message); }
    }
    changeAttribute(node, {attributeRow, editingPath, value}) {
        this.editAttribute(node, {attributeRow, editingPath, value, remove:false});
    }
    removeAttribute(node, {attributeRow, editingPath}) {
        this.editAttribute(node, {attributeRow, editingPath, remove:true});
    }
    editAttribute(node, {attributeRow, editingPath, value, remove}) {
        const editor = visualEditorScope(node);
        if (editingPath !== editor.GET('.selection')) return;
        editor.SET('.propertyError', '');
        try {
            const row = editor.GET('.properties.attributeRows').getItem(attributeRow);
            if (!row || row.getItem('type') === 'readonly') throw new Error('This attribute is not editable');
            const name = row.getItem('name');
            if (['_meta', '__proto__', 'constructor', 'prototype'].includes(name)) throw new Error('Unsupported attribute name.');
            const current = editor.builder.source.getNode(`${sourceRoot(editor)}.${editingPath}`);
            if (!current) throw new Error('The selected Source node no longer exists');
            const attrs = current.getAttr(), type = scalarType(attrs[name]);
            if (!Object.hasOwn(attrs, name) || type !== row.getItem('type') || scalarText(attrs[name], type) !== row.getItem('original'))
                throw new Error('Attribute changed; select the node again before editing.');
            const parsed = remove ? null : parseScalar(type, String(value ?? ''));
            this.writeAttribute(editor, current, editingPath, name, parsed, remove, row);
        } catch (error) { editor.SET('.propertyError', error.message); }
    }
    writeAttribute(editor, current, path, name, value, remove, row = null) {
        const attrs = {...current.getAttr()};
        if (remove) delete attrs[name]; else attrs[name] = value;
        const specs = specifications(current.parentNode, current.nodeTag, current);
        if (specs[name]) this.validateParameter(current.parentNode, current, name, specs[name], remove ? null : value);
        const design = editor.builder.source.getNode(sourceRoot(editor)), app = editor.rootBuilder.binding.gramlot;
        const candidate = app.src.prepareSource(design.getValue(true).toTytx(), design.builder);
        candidate.getNode(path).setAttr(attrs, true, false, false);
        validateCatalogueSource(editor.GET('.catalogueScope'), candidate);
        app.src.renderer.validateCandidate(candidate, {replacingNode:design});
        current.setAttr(attrs, true, false, false);
        if (row && !remove) {
            const text = scalarText(value, row.getItem('type'));
            row.setItem('original', text);
            row.setItem('text', text);
            const type = editor.GET(`.properties.types.${name}`);
            if (specs[name]?.enum) editor.SET(`.properties.parameters.${name}`, value);
            else if (type) editor.SET(`.properties.parameters.${name}.${type}`, value);
        } else {
            const tab = editor.GET('.parameterTab') === 'styles' ? 'styles' : 'attributes';
            this.showProperties(editor, {path});
            editor.SET('.parameterTab', tab);
        }
    }
    toggleLabelboxAttributes(node, {prefix}) {
        node.SET(`.properties.${prefix}Hidden`, !node.GET(`.properties.${prefix}Hidden`));
    }
    labelboxFields(node, form, current, entries) {
        for (const prefix of ['lbl', 'box']) {
            const title = prefix === 'lbl' ? 'Label' : 'Box';
            const section = form.div({class:'visual-labelbox-section', grid_column:'1 / -1'});
            const heading = section.div({class:'visual-labelbox-heading'});
            if (prefix === 'lbl') this.parameterField(node, heading, current.nodeTag, 'lbl', entries.lbl,
                'properties', current.getAttr('lbl'));
            else heading.span(title, {class:'visual-labelbox-title'});
            heading.button({iconSrc:toolIcons.properties, title:`Edit ${title.toLowerCase()} attributes`,
                'aria-label':`Edit ${title.toLowerCase()} attributes`, class:'button--quiet',
                action:'toggleLabelboxAttributes', prefix});
            const choices = Object.entries(entries).filter(([name]) => name.startsWith(prefix + '_'));
            node.SET(`.properties.${prefix}Hidden`, true);
            node.SET(`.properties.${prefix}Attribute`, '');
            const row = section.div({class:'visual-labelbox-attribute', hidden:`^${editorData(node)}.properties.${prefix}Hidden`});
            const select = row.select({'aria-label':`${title} attribute`, value:`^${editorData(node)}.properties.${prefix}Attribute`});
            select.option('Which attribute?', {value:''});
            for (const [name] of choices) select.option(name.slice(prefix.length + 1), {value:name});
            row.div({node_label:'attributeValue'}).span('');
            row.dataController({func:'renderLabelboxAttribute', _init:true,
                parameterName:`^${editorData(node)}.properties.${prefix}Attribute`, editingPath:node.GET('.properties.path')});
        }
    }
    renderLabelboxAttribute(node, {parameterName, editingPath}) {
        const target = node.parentBag.getNode('attributeValue');
        target.getValue(true).clear();
        if (!parameterName || editingPath !== node.GET('.selection')) return;
        const current = node.builder.source.getNode(`${sourceRoot(node)}.${editingPath}`);
        const spec = specifications(current.parentNode, current.nodeTag, current)[parameterName];
        this.parameterField(node, node.builder.wrapSource(target), current.nodeTag, parameterName, spec,
            'properties', current.getAttr(parameterName) ?? spec.default, true);
    }
    parameterField(node, form, tag, name, spec, scope, value, compact = false) {
        const label = name === 'lbl' ? 'Label' : name === '_text' && node.builder.schema[tag]._meta?.gramlot_component?.command ? 'caption' : name === '_text' ? 'Text' : name;
        const parameterPath = `${editorData(node)}.${scope}.parameters.${name}`;
        if (spec.enum) {
            node.SET(parameterPath, value ?? '');
            const select = form.select({lbl:compact ? null : label, lbl_position:'TL', value:`^${parameterPath}`, 'aria-label':name});
            select.option('', {value:''});
            for (const option of spec.enum) select.option(String(option), {value:option});
            if (scope === 'properties') form.dataController({func:'changeProperty', value:`^${parameterPath}`,
                _userChanges:true, parameterName:name, editingPath:node.GET('.properties.path')});
            return;
        }
        const types = Array.isArray(spec.dtype) ? spec.dtype : spec.dtype ? [spec.dtype] : [];
        const supported = types.filter(type => editableTypes.includes(type));
        if (!supported.length) { form.p(`${label}: no editor is available for this declared type`, {class:'visual-editor-hint', grid_column:'1 / -1'}); return; }
        let type = '';
        if (value == null) type = supported.length === 1 ? supported[0] : '';
        else if (typeof value === 'boolean' && supported.includes('B')) type = 'B';
        else if (typeof value === 'string' && supported.includes('T')) type = 'T';
        else if (typeof value === 'number') type = supported.find(code => ['L','R','N'].includes(code)) ?? '';
        else if (value instanceof Date) type = supported.find(code => ['D','H'].includes(code)) ?? '';
        else if (supported.length === 1 && supported[0] === 'N') type = 'N';
        if (value != null && !type) { form.p(`${label}: the current value is not editable with these scalar types`, {class:'visual-editor-hint', grid_column:'1 / -1'}); return; }
        node.SET(`${editorData(node)}.${scope}.types.${name}`, type);
        for (const code of supported) node.SET(`${parameterPath}.${code}`, code === type ? value ?? null : null);
        const wide = !compact && (types.length > 1 || /^(tooltip|_text|action|placeholder|value)$|(_error|_warning|_if)$/.test(name));
        const row = form.div({class:'visual-parameter-field', grid_column:wide ? '1 / -1' : 'auto',
            grid_template_columns:types.length > 1 ? 'minmax(100px, 1fr) minmax(0, 2fr)' : 'minmax(0, 1fr)', align_items:'start'});
        if (types.length > 1) {
            const choice = row.select({lbl:`${label} type`, lbl_position:'TL', value:`^${editorData(node)}.${scope}.types.${name}`, 'aria-label':`${name} type`});
            choice.option('Not set', {value:''});
            for (const code of types) choice.option(editableTypes.includes(code) ? code : `${code} (unavailable)`, {value:code, disabled:!editableTypes.includes(code)});
            if (scope === 'properties') row.dataController({func:'changePropertyType', type:`^${editorData(node)}.${scope}.types.${name}`,
                _userChanges:true, parameterName:name, editingPath:node.GET('.properties.path')});
        }
        row.div({node_label:'input'}).span('');
        row.dataController({func:'renderParameterInput', _init:true, type:`^${editorData(node)}.${scope}.types.${name}`,
            parameterName:name, parameterLabel:label, scope, compact, multiple:types.length > 1});
    }
    renderParameterInput(node, {type, parameterName, parameterLabel, scope, multiple, compact}) {
        const target = node.parentBag.getNode('input');
        target.getValue(true).clear();
        if (!type) return;
        const parent = node.builder.wrapSource(target);
        const label = multiple ? `${parameterLabel} (${type})` : parameterLabel;
        const binding = `^${editorData(node)}.${scope}.parameters.${parameterName}.${type}`;
        const attrs = {lbl:compact ? null : label, lbl_position:'TL', value:binding, 'aria-label':label};
        if (type === 'B') parent.checkbox(attrs);
        else if (['L','R','N'].includes(type)) parent.numberTextBox({...attrs, dtype:type});
        else if (type === 'D') parent.dateTextBox(attrs);
        else if (type === 'H') parent.timeTextBox(attrs);
        else if (type === 'T' && /^(lbl|box)_color$/.test(parameterName)) parent.colorpicker(attrs);
        else if (type === 'T') parent.textbox(attrs);
        else throw new Error(`No parameter editor for ${type}`);
        if (scope === 'properties') parent.dataController({func:'changeProperty', value:binding, _userChanges:true,
            parameterName, editingPath:node.GET('.properties.path')});
    }
    changePropertyType(node, {type, parameterName, editingPath}) {
        this.changeProperty(node, {parameterName, editingPath, value:type ? node.GET(`.properties.parameters.${parameterName}.${type}`) : null});
    }
    changeProperty(node, {value, parameterName, editingPath}) {
        if (editingPath !== node.GET('.selection')) return;
        node.SET('.propertyError', '');
        try {
            const current = node.builder.source.getNode(`${sourceRoot(node)}.${editingPath}`);
            if (!current) throw new Error('The selected Source node no longer exists');
            if (parameterName !== '_text' && Object.is(current.getAttr(parameterName), value)) return;
            const specs = specifications(current.parentNode, current.nodeTag, current);
            const spec = specs[parameterName];
            if (!spec) throw new Error(`Unknown parameter: ${parameterName}`);
            this.validateParameter(current.parentNode, current, parameterName, spec, value);
            if (parameterName === '_text') current.setValue(value ?? '');
            else {
                const attrs = {...current.getAttr()};
                if (value == null || value === '') delete attrs[parameterName];
                else attrs[parameterName] = value;
                current.setAttr(attrs, true, false, false);
            }
            this.attributeRows(node, current);
            for (const [field, scope] of [['MoreAttributes', 'attributes'], ['StyleAttributes', 'styles']]) {
                const panel = editorField(node, field);
                panel.getValue(true).clear();
                this.attributeFields(node, node.builder.wrapSource(panel), current, scope);
            }
        } catch (error) { node.SET('.propertyError', error.message); }
    }
    validateParameter(parent, current, name, spec, value) {
        const empty = value == null || value === '';
        if (spec.required && empty) throw new Error(`Choose ${name}`);
        if (!empty && spec.enum && !spec.enum.includes(value)) throw new Error(`Invalid ${name}`);
        const children = parent.getValue(true);
        if (!empty && spec.unique && children instanceof parent.builder.source.constructor &&
            children.getNodes().some(child => child !== current && child.getAttr(name) === value)) throw new Error(`${name} is already in use`);
    }
    validateCatalogueTag(node, tag) {
        const scope = visualEditorScope(node).GET('.catalogueScope');
        if (!catalogueAllows(scope, tag, node.builder.schema[tag]?._meta ?? {}))
            throw new Error(`Tag ${tag} is outside the editor catalogue`);
    }
    applyInsert(node) {
        if (node.GET('.insertion.clipboard')) { this.finishPaste(node); return; }
        const path = node.GET('.insertion.parentPath');
        const parent = node.builder.source.getNode(`${sourceRoot(node)}.${path}`);
        if (!parent) throw new Error('The target Source node is no longer available');
        const tag = node.GET('.insertion.tag');
        this.validateCatalogueTag(node, tag);
        const attrs = {};
        for (const [name, spec] of Object.entries(specifications(parent, tag)).filter(([, spec]) => spec.required)) {
            const type = node.GET(`.insertion.types.${name}`);
            const value = node.GET(`.insertion.parameters.${name}${spec.enum ? '' : type ? '.' + type : ''}`);
            this.validateParameter(parent, null, name, spec, value);
            attrs[name] = value;
        }
        const created = parent.builder.commandOnNode(parent, tag, null, attrs);
        node.SET('.insertionOpen', false);
        node.SET('.selection', `${path}.${created.label}`);
    }
}
