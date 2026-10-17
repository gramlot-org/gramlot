/** Optional in-page inspector. Import the same Gramlot module as the inspected page. */
import {Bag, Gramlot, GramlotBuilder} from '@gramlot/gramlot';
import {InspectorConnection, encodeScalar} from './inspector-bridge.js';
export {InspectorConnection, attachInspectorAgent} from './inspector-bridge.js';
import {editorTypes, scalarType, scalarText, parseScalar, readParameterEnums} from './editor-values.js';
import {InspectorStyles} from './inspector-styles.js';
import inspectorStyle from './gramlot-tools-inspector.css';
import '../../poc/gramlot-poc-tree.js';
import '../../poc/gramlot-poc-palette.js';
import '../../poc/gramlot-poc-tabs.js';
import '../../poc/gramlot-poc-splitter.js';

let nextId = 0;

/** Inspect one explicitly supplied Gramlot instance in a floating palette. */
export class GramlotToolsInspector extends HTMLElement {
    static observedAttributes = ['docked'];

    attributeChangedCallback() {
        if (this.#ui && !this.hasAttribute('embedded')) {
            this.#ui.src.source.getNode('main.palette').setAttr({docked: this.hasAttribute('docked') ? '' : null});
        }
    }

    #target = null;
    #connection = null;
    #connectionRelease = null;
    #targets = [];
    #selectedTarget = null;
    #ui = null;
    #mount;
    #subscriber = `gramlot-tools-inspector-${++nextId}`;
    #subscriptions = [];
    #nodes = [];
    #nodeIds = new WeakMap();
    #nextNodeId = 0;
    #pending = false;
    #generation = 0;
    #snapshot = null;
    #nextRow = 0;
    #nextBreakpoint = 0;
    #breakpointTests = new Map();
    #trees = {};
    #breakpointTarget = null;
    #styles = null;
    #styleNames = '';
    #styleRequest = 0;
    #styleDownloadUrl = null;

    constructor() {
        super();
        // Only the mounting boundary uses DOM creation. The entire palette is Source.
        this.#mount = this.ownerDocument.createElement('div');
        this.attachShadow({mode: 'open'}).append(this.#mount);
    }

    get gramlot() { return this.#target; }
    set gramlot(value) {
        if (value !== null && (!(value instanceof Gramlot) || value.state === 'disposed')) {
            throw new TypeError('gramlot must be a live Gramlot instance or null');
        }
        this.#unsubscribe();
        this.#connection = null;
        this.#targets = [];
        this.#selectedTarget = null;
        this.#target = value;
        this.#snapshot = null;
        this.#breakpointTarget = null;
        this.#breakpointTests.clear();
        if (this.#ui) {
            this.#renderTargets();
            this.#dialog().close();
            this.#dialog('breakpoints').close();
            this.#ui.data.setItem('breakpointError', '');
            this.#ui.data.setItem('selection', null);
            this.#ui.data.setItem('busy', false);
            this.#ui.data.setItem('breakpoints', new Bag());
            this.#ui.data.setItem('editor.dirty', false);
            this.#ui.data.setItem('breakpointDirty', false);
            this.#ui.data.setItem('breakpointStatus', '');
            this.#subscribe();
            this.#refresh();
            if (this.#ui.data.getItem('tab') === 'styles') this.#loadStyles();
        }
    }

    get targets() { return this.#targets.map(entry => ({...entry})); }
    set targets(entries) {
        if (!Array.isArray(entries) || entries.some(entry => typeof entry.id !== 'string' || typeof entry.title !== 'string' || !(entry.connection instanceof InspectorConnection)) || new Set(entries.map(entry => entry.id)).size !== entries.length) {
            throw new TypeError('targets requires unique id/title/InspectorConnection records');
        }
        if (!entries.length) { this.gramlot = null; return; }
        this.#targets = entries.map(entry => ({...entry}));
        this.#renderTargets();
        const chosen = entries.find(entry => entry.id === this.#selectedTarget) ?? entries[0];
        if (chosen) this.selectedTarget = chosen.id;
    }
    get selectedTarget() { return this.#selectedTarget; }
    set selectedTarget(id) {
        const entry = this.#targets.find(entry => entry.id === id);
        if (!entry) throw new Error(`Unknown inspector target: ${id}`);
        this.#selectedTarget = id;
        if (this.#ui) this.#ui.data.setItem('targetId', id);
        if (entry.connection === this.#connection) return;
        this.#unsubscribe();
        this.#target = null;
        this.#connection = entry.connection;
        this.#snapshot = null;
        this.#breakpointTarget = null;
        this.#breakpointTests.clear();
        if (this.#ui) {
            this.#dialog().close(); this.#dialog('breakpoints').close();
            this.#ui.data.setItem('selection', null);
            this.#ui.data.setItem('busy', false);
            this.#ui.data.setItem('editor.dirty', false);
            this.#ui.data.setItem('breakpointDirty', false);
            this.#subscribe(); this.#refresh();
            if (this.#ui.data.getItem('tab') === 'styles') this.#loadStyles();
        }
    }
    #renderTargets() {
        if (!this.#ui) return;
        const builder = new GramlotBuilder();
        for (const entry of this.#targets) builder.root.option(entry.title, {value: entry.id});
        this.#ui.src.source.getNode('main.palette.targetbar.targets').setValue(this.#ui.src.prepareSource(builder.source));
        this.#ui.data.setItem('singleTarget', this.#targets.length < 2);
        this.#ui.data.setItem('targetId', this.#selectedTarget ?? this.#targets[0]?.id ?? '');
    }
    #state() { return (this.#connection ?? this.#target)?.state; }
    #targetBag(root) { return this.#connection ? this.#connection[root] : root === 'data' ? this.#target.data : this.#target.src.source; }

    connectedCallback() {
        if (this.#ui) return;
        const inspector = this;
        const ui = new Gramlot({document: this.ownerDocument, element: this.#mount, transport: false});
        this.#ui = ui;
        class Logic {
            close(node, event) {
                event.stopPropagation();
                inspector.remove();
                inspector.dispatchEvent(new inspector.ownerDocument.defaultView.CustomEvent('close'));
            }
            editChanged(node) {
                const row = ui.data.getItem(`editor.rows.${node.getAttr('data-row')}`);
                row.setItem('isNull', false);
                ui.data.setItem('editor.dirty', true);
                ui.data.setItem('editor.status', 'Unsaved changes');
            }
            enumChanged(node) {
                this.editChanged(node);
                inspector.#applyEdit();
            }
            typeChanged(node) {
                const row = ui.data.getItem(`editor.rows.${node.getAttr('data-row')}`);
                row.setItem('inputType', inspector.#inputType(row.getItem('type')));
                row.setItem('text', row.getItem('type') === 'boolean' ? false : '');
                row.setItem('isNull', row.getItem('type') === 'null');
                ui.data.setItem('editor.dirty', true);
            }
            leaveRow(node, event) {
                if (event.relatedTarget && event.currentTarget.contains(event.relatedTarget)) return;
                if (ui.data.getItem('editor.dirty')) inspector.#applyEdit(() => {}, event.relatedTarget);
            }
            editKey(node, event) {
                if (event.key === 'Escape') {
                    event.preventDefault(); inspector.#loadEditor(inspector.#selected());
                } else if (event.key === 'Enter' && !event.isComposing) {
                    event.preventDefault(); inspector.#applyEdit();
                } else if (event.key === 'Backspace' && !event.repeat && !event.isComposing) {
                    const row = ui.data.getItem(`editor.rows.${node.getAttr('data-row')}`);
                    if (!row.getItem('locked') && (row.getItem('type') === 'boolean' || row.getItem('text') === '' || row.getItem('text') === null)) {
                        event.preventDefault(); row.setItem('isNull', true); row.setItem('text', null);
                        ui.data.setItem('editor.dirty', true);
                    }
                }
            }
            keepFocus(node, event) { event.preventDefault(); }
            addAttribute() {
                if (ui.data.getItem('editor.dirty')) inspector.#applyEdit(() => inspector.#addAttribute());
                else inspector.#addAttribute();
            }
            selectTarget() {
                const id = ui.data.getItem('targetId');
                const choose = () => { inspector.selectedTarget = id; };
                if (ui.data.getItem('editor.dirty')) {
                    ui.data.setItem('targetId', inspector.selectedTarget);
                    inspector.#applyEdit(choose);
                } else choose();
            }
            removeAttribute(node) {
                ui.data.setItem(`editor.rows.${node.getAttr('data-row')}.removed`, true);
                ui.data.setItem('editor.dirty', true);
                inspector.#applyEdit();
            }
            selectRoot(node) {
                const choose = () => {
                    const tab = node.getAttr('data-root');
                    ui.data.setItem('tab', tab);
                    if (tab !== 'styles') {
                        ui.data.setItem('root', tab);
                        ui.data.setItem('selection', null);
                        inspector.#snapshot = null;
                    }
                    inspector.#refresh();
                    if (tab === 'styles') inspector.#loadStyles();
                };
                if (ui.data.getItem('editor.dirty')) inspector.#applyEdit(choose);
                else choose();
            }
            refreshStyles() { inspector.#loadStyles(); }
            styleChanged(node) { ui.data.setItem(`styles.rows.${node.getAttr('data-row')}.dirty`, true); }
            setStyle(node) {
                const row = ui.data.getItem(`styles.rows.${node.getAttr('data-row')}`);
                if (node.getAttr('data-field') === 'color') row.setItem('dirty', false);
                else if (!row.getItem('dirty')) return;
                inspector.#loadStyles('setStyle', {name: row.getItem('name'), value: row.getItem(node.getAttr('data-field'))});
            }
            styleKey(node, event) {
                if (event.key === 'Enter' && !event.isComposing) { event.preventDefault(); this.setStyle(node); }
                if (event.key === 'Escape') { event.preventDefault(); inspector.#loadStyles(); }
            }
            resetStyle(node) { inspector.#loadStyles('resetStyle', {name: ui.data.getItem(`styles.rows.${node.getAttr('data-row')}.name`)}); }
            resetStyles() { inspector.#loadStyles('resetStyles'); }
            selectNode(node, event) {
                const choose = () => {
                    const entry = inspector.#nodes.find(item => item.node === event.detail.node);
                    ui.data.setItem('selection', entry?.id ?? null);
                    inspector.#loadEditor(entry); inspector.#details();
                };
                if (ui.data.getItem('editor.dirty')) {
                    inspector.#trees[ui.data.getItem('root')].selectedPath = inspector.#selected()?.path.join('.') ?? null;
                    inspector.#applyEdit(choose);
                } else choose();
            }
            openBreakpoint(node, event) {
                if (event.detail.action !== 'breakpoint') return;
                ui.data.setItem('breakpointDirty', false);
                ui.data.setItem('breakpointStatus', '');
                inspector.#breakpointTarget = {root: node.getAttr('data-root'), path: event.detail.path};
                inspector.#loadBreakpoint();
                if (!inspector.#findBreakpoint(inspector.#breakpointTarget.root, event.detail.path)) ui.data.setItem('editor.mode', 'debugger');
                ui.data.setItem('breakpointWhere', `${inspector.#breakpointTarget.root}: ${event.detail.path}`);
                inspector.#dialog().showModal();
            }
            closeBreakpoint() { inspector.#dialog().close(); inspector.#breakpointTarget = null; ui.data.setItem('breakpointDirty', false); }
            breakpointChanged() { ui.data.setItem('breakpointDirty', true); }
            setBreakpoint() { inspector.#setBreakpoint(() => {inspector.#dialog().close(); inspector.#breakpointTarget = null;}); }
            showBreakpoints() { inspector.#renderBreakpoints(); inspector.#dialog('breakpoints').showModal(); }
            closeBreakpoints() { inspector.#dialog('breakpoints').close(); }
            removeBreakpoint(node) {
                const id = node.getAttr('data-breakpoint');
                if (inspector.#connection) {
                    const config = ui.data.getItem(`breakpoints.${id}`);
                    inspector.#connection.request('breakpoint', {root: config.getItem('root'), path: config.getItem('path'), mode: '', condition: ''})
                        .then(() => {inspector.#refresh(); inspector.#renderBreakpoints();})
                        .catch(error => ui.data.setItem('breakpointError', error.message));
                    return;
                }
                ui.data.getItem('breakpoints').popNode(id);
                inspector.#breakpointTests.delete(id);
                inspector.#renderBreakpoints();
                inspector.#refresh();
            }
        }
        ui.src.logicRegistry.register(Logic, {group: 'inspector', resource: 'gramlot-tools-inspector'});
        for (const [key, value] of Object.entries({root: 'data', tab: 'data', stylesActive: false, treeActive: true, dataActive: true, sourceActive: false, targetId: '', singleTarget: true, busy: false,
            selection: null, path: '', error: '', status: '', breakpointWhere: '', breakpointLine: '', breakpointStatus: '', breakpointError: '', breakpointCount: '● 0', noBreakpoints: true})) ui.data.setItem(key, value);
        ui.data.setItem('editor', new Bag({dirty: false, disabled: true, status: '', mode: '', condition: ''}));
        ui.data.setItem('breakpoints', new Bag());
        ui.data.setItem('breakpointDirty', false);
        ui.data.setItem('styles', new Bag({status: '', busy: false, noChanges: true, noDownload: true, downloadUrl: null, rows: new Bag()}));
        const builder = new GramlotBuilder();
        const root = builder.root;
        root.style(inspectorStyle);
        const palette = this.hasAttribute('embedded')
            ? root.section({node_label: 'palette', class: 'embedded-panel', 'aria-label': 'Gramlot inspector'})
            : root.webcomponent({code: 'gramlot-poc-palette', node_label: 'palette', title: 'Gramlot inspector', docked: this.hasAttribute('docked') ? '' : null, connect_onclose: 'inspector.close'});
        const targetbar = palette.div({node_label: 'targetbar', class: 'targetbar', hidden: '^singleTarget'});
        targetbar.select({node_label: 'targets', value: '^targetId', disabled: '^busy', 'aria-label': 'Inspected page', connect_onchange: 'inspector.selectTarget'});
        const toolbar = palette.webcomponent({code: 'gramlot-poc-tabs', node_label: 'tabs', role: 'tablist', 'aria-label': 'Inspected root'});
        for (const name of ['Data', 'Source', 'Styles']) toolbar.html_button(name, {node_label: name.toLowerCase(), type: 'button', role: 'tab', 'data-root': name.toLowerCase(),
            'aria-selected': 'false', connect_onclick: 'inspector.selectRoot'});
        palette.p('^error', {role: 'alert', class: 'error'});
        const content = palette.webcomponent({code: 'gramlot-poc-splitter', node_label: 'content', hidden: '^stylesActive'});
        const trees = content.div({node_label: 'tree', slot: 'top', class: 'tree'});
        for (const name of ['data', 'source']) trees.webcomponent({code: 'gramlot-poc-tree', node_label: name, 'data-root': name,
            hidden: name === 'data' ? '^sourceActive' : '^dataActive', connect_onchange: 'inspector.selectNode', 'connect_ontree-action': 'inspector.openBreakpoint'});
        const properties = content.section({node_label: 'properties', slot: 'bottom', class: 'properties', 'aria-label': 'Selected node properties'});
        const heading = properties.div({class: 'properties-heading'});
        heading.span('Properties', {class: 'heading-label'});
        heading.html_button('^breakpointCount', {type: 'button', class: 'breakpoint-count', hidden: '^noBreakpoints',
            'aria-label': 'Active breakpoints', title: 'Active breakpoints', connect_onclick: 'inspector.showBreakpoints'});
        heading.html_button('+', {type: 'button', 'aria-label': 'Add attribute', title: 'Add attribute', disabled: '^editor.disabled',
            connect_onpointerdown: 'inspector.keepFocus', connect_onclick: 'inspector.addAttribute'});
        properties.p('^breakpointLine', {class: 'breakpoint-line'});
        properties.p('^breakpointError', {class: 'breakpoint-status', role: 'alert'});
        const editor = properties.fieldset({node_label: 'editor', disabled: '^editor.disabled'});
        editor.div({node_label: 'rows', class: 'rows'});
        properties.p('^editor.status', {role: 'status', class: 'edit-status'});
        const styles = palette.section({node_label: 'styles', class: 'styles-panel', hidden: '^treeActive', 'aria-label': 'CSS variables'});
        const stylebar = styles.div({class: 'styles-toolbar'});
        stylebar.span('Document variables');
        stylebar.html_button('Refresh', {type: 'button', disabled: '^styles.busy', connect_onclick: 'inspector.refreshStyles'});
        stylebar.html_button('Reset all', {type: 'button', disabled: '^styles.noChanges', connect_onclick: 'inspector.resetStyles'});
        stylebar.a('Download CSS', {href: '^styles.downloadUrl', download: 'theme-overrides.css', 'aria-disabled': '^styles.noDownload'});
        styles.p('Temporary preview · Enter or leave a field to apply. Closing the connection clears previews.', {class: 'styles-help'});
        styles.p('^styles.status', {role: 'status', class: 'styles-status'});
        styles.p('No --gramlot-* variables on this document root. Load a Gramlot theme, then Refresh.', {class: 'styles-empty', node_label: 'empty'});
        styles.div({node_label: 'rows', class: 'styles-rows'});
        const footer = palette.footer({class: 'path', hidden: '^stylesActive'});
        footer.span('Path: '); footer.em('^path');
        const breakpoint = palette.dialog({node_label: 'breakpoint', 'aria-label': 'Breakpoint', class: 'breakpoint-dialog', connect_oncancel: 'inspector.closeBreakpoint'});
        breakpoint.h2('^breakpointWhere');
        const mode = breakpoint.select({value: '^editor.mode', connect_onchange: 'inspector.breakpointChanged', 'aria-label': 'Breakpoint mode'});
        for (const [value, label] of [['', 'Off'], ['debugger', 'Debugger'], ['console', 'Console']]) mode.option(label, {value});
        breakpoint.input({value: '^editor.condition', live: true, connect_oninput: 'inspector.breakpointChanged', 'aria-label': 'Breakpoint condition', placeholder: 'Condition (optional)'});
        breakpoint.p('^breakpointStatus', {role: 'status', class: 'breakpoint-status'});
        const actions = breakpoint.div({class: 'dialog-actions'});
        actions.html_button('Cancel', {type: 'button', connect_onclick: 'inspector.closeBreakpoint'});
        actions.html_button('Save', {type: 'button', connect_onclick: 'inspector.setBreakpoint'});
        const list = palette.dialog({node_label: 'breakpoints', 'aria-label': 'Active breakpoints', class: 'breakpoint-dialog'});
        list.h2('Active breakpoints');
        list.div({node_label: 'entries'});
        list.div({class: 'dialog-actions'}).html_button('Close', {type: 'button', connect_onclick: 'inspector.closeBreakpoints'});
        ui.src.startSource(builder.source);
        for (const name of ['data', 'source']) this.#trees[name] = ui.dom.getDomNode(ui.src.source.getNode(`main.palette.content.tree.${name}`));
        this.#renderTargets();
        this.#subscribe();
        this.#refresh();
    }

    #dialog(name = 'breakpoint') { return this.#ui.dom.getDomNode(this.#ui.src.source.getNode(`main.palette.${name}`)); }

    disconnectedCallback() {
        this.#unsubscribe();
        this.#ui?.dispose();
        this.#ui = null;
        this.#nodes = [];
        this.#trees = {};
        this.#breakpointTarget = null;
        this.#snapshot = null;
        this.#breakpointTests.clear();
    }

    #subscribe() {
        if (this.#connection) { this.#connectionRelease = this.#connection.subscribe(() => this.#schedule()); return; }
        if (!this.#target) return;
        this.#subscriptions = [this.#target.data, this.#target.src.source];
        for (const [index, bag] of this.#subscriptions.entries()) bag.subscribe(this.#subscriber, {any: event => {
            this.#checkBreakpoints(index === 0 ? 'data' : 'source', event);
            this.#schedule();
        }});
    }

    #unsubscribe() {
        ++this.#styleRequest;
        this.#styles?.dispose();
        this.#styles = null;
        if (this.#ui) {
            this.#renderStyles([]);
            this.#ui.data.setItem('styles.busy', false);
            this.#ui.data.setItem('styles.status', '');
        }
        this.#connectionRelease?.();
        this.#connectionRelease = null;
        ++this.#generation;
        this.#pending = false;
        for (const bag of this.#subscriptions) bag.unsubscribe(this.#subscriber, {any: true});
        this.#subscriptions = [];
    }

    #schedule() {
        if (this.#pending) return;
        this.#pending = true;
        const generation = this.#generation;
        queueMicrotask(() => {
            if (generation !== this.#generation || !this.#ui) return;
            this.#pending = false;
            this.#refresh();
        });
    }

    #bag() {
        return this.#targetBag(this.#ui.data.getItem('root'));
    }

    #refresh() {
        const ui = this.#ui;
        if (!ui) return;
        try {
            this.#nodes = [];
            const root = ui.data.getItem('root');
            const tab = ui.data.getItem('tab');
            ui.data.setItem('stylesActive', tab === 'styles');
            ui.data.setItem('treeActive', tab !== 'styles');
            for (const name of ['data', 'source', 'styles']) {
                ui.src.source.getNode(`main.palette.tabs.${name}`).setAttr({'aria-selected': String(tab === name)});
            }
            if (this.#connection) {
                const configurations = new Bag();
                for (const [index, record] of this.#connection.breakpoints.entries()) configurations.setItem(`b${index}`, new Bag(record));
                ui.data.setItem('breakpoints', configurations);
                ui.data.setItem('breakpointError', this.#connection.breakpoints.filter(record => record.error).map(record => `${record.root}: ${record.path}: ${record.error}`).join('; '));
            }
            const count = ui.data.getItem('breakpoints').getNodes().length;
            ui.data.setItem('breakpointCount', `● ${count}`);
            ui.data.setItem('noBreakpoints', count === 0);
            ui.data.setItem('dataActive', root === 'data');
            ui.data.setItem('sourceActive', root === 'source');
            for (const name of ['data', 'source']) {
                const tree = this.#trees[name];
                tree.storeBag = (this.#connection || this.#target) ? this.#targetBag(name) : null;
                const breakpoints = ui.data.getItem('breakpoints').getNodes().filter(node => node.value.getItem('root') === name);
                tree.rowActions = [{id: 'breakpoint', icon: '○', label: 'Breakpoint',
                    activePaths: breakpoints.map(node => node.value.getItem('path')),
                    conditionalPaths: breakpoints.filter(node => node.value.getItem('condition').trim()).map(node => node.value.getItem('path'))}];
            }
            if (this.#target || this.#connection) this.#index(this.#bag(), []);
            this.#trees[root].selectedPath = this.#selected()?.path.join('.') ?? null;
            ui.data.setItem('error', this.#connection ? this.#connection.error || (this.#state() === 'disposed' ? 'Inspected page disconnected.' : this.#state() === 'connecting' ? 'Connecting…' : '') : this.#target ? '' : 'No Gramlot instance selected.');
            this.#details();
        } catch (error) { ui.data.setItem('error', error.message); }
    }

    async #loadStyles(type = 'styles', command = {}) {
        const ui = this.#ui;
        const request = ++this.#styleRequest;
        ui.data.setItem('styles.busy', true);
        ui.data.setItem('styles.downloadUrl', null);
        ui.data.setItem('styles.noDownload', true);
        ui.data.setItem('styles.status', '');
        try {
            if (!this.#state() || this.#state() === 'disposed' || (this.#connection && this.#state() !== 'started')) {
                throw new Error('Select a connected page before editing CSS variables');
            }
            let rows;
            if (this.#connection) {
                const connection = this.#connection;
                await connection.request(type, command);
                rows = connection.styles;
            } else {
                this.#styles ??= new InspectorStyles(this.#target.src.renderer.destination.ownerDocument);
                if (type === 'setStyle') this.#styles.set(command.name, command.value);
                if (type === 'resetStyle') this.#styles.reset(command.name);
                if (type === 'resetStyles') this.#styles.dispose();
                rows = this.#styles.snapshot();
            }
            if (this.#ui !== ui || request !== this.#styleRequest) return;
            this.#renderStyles(rows, type, command);
        } catch (error) {
            if (this.#ui === ui && request === this.#styleRequest) ui.data.setItem('styles.status', error.message);
        } finally {
            if (this.#ui === ui && request === this.#styleRequest) {
                ui.data.setItem('styles.busy', false);
                ui.data.setItem('styles.downloadUrl', this.#styleDownloadUrl);
                ui.data.setItem('styles.noDownload', !this.#styleDownloadUrl);
            }
        }
    }

    #renderStyles(rows, type = 'styles', command = {}) {
        const ui = this.#ui;
        const browser = this.ownerDocument.defaultView;
        if (this.#styleDownloadUrl) browser.URL.revokeObjectURL(this.#styleDownloadUrl);
        this.#styleDownloadUrl = null;
        const overrides = rows.filter(row => row.override);
        if (overrides.length) {
            const declarations = overrides.map(row => `  ${browser.CSS.escape(row.name)}: ${row.override} !important;`).join('\n');
            const css = `/* Gramlot overrides. Load after the theme stylesheet. */\n:root {\n${declarations}\n}\n`;
            this.#styleDownloadUrl = browser.URL.createObjectURL(new browser.Blob([css], {type: 'text/css;charset=utf-8'}));
        }
        ui.data.setItem('styles.downloadUrl', ui.data.getItem('styles.busy') ? null : this.#styleDownloadUrl);
        ui.data.setItem('styles.noDownload', ui.data.getItem('styles.busy') || !this.#styleDownloadUrl);
        const names = JSON.stringify(rows.map(row => row.name));
        const rebuild = names !== this.#styleNames;
        this.#styleNames = names;
        const builder = rebuild ? new GramlotBuilder() : null;
        const groups = new Map();
        if (rebuild) {
            // Release old bindings before replacing their rows, including native color controls.
            ui.src.source.getNode('main.palette.styles.rows').setValue(ui.src.prepareSource(new GramlotBuilder().source));
            ui.data.setItem('styles.rows', new Bag());
        }
        for (const [index, record] of rows.entries()) {
            const id = `v${index}`, path = `styles.rows.${id}`;
            const color = /^#[\da-f]{6}$/i.test(record.value) ? record.value
                : /^#[\da-f]{3}$/i.test(record.value) ? '#' + [...record.value.slice(1)].map(char => char + char).join('') : null;
            const fields = {name: record.name, text: record.override || record.value, computed: record.value, dirty: false,
                color: color ?? '#000000', noColor: color === null, unchanged: !record.override};
            if (!rebuild && ui.data.getItem(`${path}.dirty`) && !['styles', 'resetStyles'].includes(type)) {
                const acknowledged = record.name === command.name && (type === 'resetStyle' || ui.data.getItem(`${path}.text`) === command.value);
                if (!acknowledged) { delete fields.text; delete fields.dirty; }
            }
            if (rebuild) ui.data.setItem(path, new Bag(fields));
            else for (const [key, value] of Object.entries(fields)) ui.data.setItem(`${path}.${key}`, value);
            if (!rebuild) continue;
            const group = record.name.includes('-font-') ? 'Typography' : record.name.includes('-space-') ? 'Spacing'
                : /-(radius|page-width)/.test(record.name) ? 'Dimensions' : record.name.endsWith('-shadow') ? 'Effects'
                : color ? 'Colors' : 'Other';
            if (!groups.has(group)) {
                const section = builder.root.section({class: 'styles-group'});
                section.h3(group);
                groups.set(group, section);
            }
            const row = groups.get(group).div({class: 'style-row'});
            row.html_label(record.name, {for: `${this.#subscriber}-${id}`, title: record.name});
            row.input({id: `${this.#subscriber}-${id}`, value: `^${path}.text`, live: true,
                'aria-label': `${record.name} value`, title: `^${path}.computed`, 'data-row': id, 'data-field': 'text',
                connect_oninput: 'inspector.styleChanged', connect_onchange: 'inspector.setStyle', connect_onkeydown: 'inspector.styleKey', spellcheck: 'false'});
            row.input({type: 'color', value: `^${path}.color`, hidden: `^${path}.noColor`,
                'aria-label': `${record.name} color`, 'data-row': id, 'data-field': 'color', connect_onchange: 'inspector.setStyle'});
            row.html_button('↶', {type: 'button', 'aria-label': `Reset ${record.name}`, title: 'Reset variable',
                disabled: `^${path}.unchanged`, 'data-row': id, connect_onclick: 'inspector.resetStyle'});
        }
        if (rebuild) ui.src.source.getNode('main.palette.styles.rows').setValue(ui.src.prepareSource(builder.source));
        ui.data.setItem('styles.noChanges', !rows.some(row => row.override));
        ui.src.source.getNode('main.palette.styles.empty').setAttr({hidden: rows.length !== 0});
    }

    #index(bag, labels) {
        for (const node of bag.getNodes()) {
            const path = [...labels, node.label];
            if (!this.#nodeIds.has(node)) this.#nodeIds.set(node, String(++this.#nextNodeId));
            this.#nodes.push({id: this.#nodeIds.get(node), node, path});
            const value = node.getValue(true);
            if (!node.resolver && value instanceof Bag) this.#index(value, path);
        }
    }

    #details() {
        const ui = this.#ui;
        const entry = this.#selected();
        const node = entry?.node;
        ui.data.setItem('path', node ? entry.path.join('.') : '');
        const bp = node ? this.#findBreakpoint(ui.data.getItem('root'), entry.path.join('.'))?.value : null;
        ui.data.setItem('breakpointLine', bp ? `Breakpoint: ${bp.getItem('mode')} · ${bp.getItem('hits')} hits${bp.getItem('condition') ? ` · if ${bp.getItem('condition')}` : ''}` : '');
        if (!node || this.#snapshot?.node !== node || (!ui.data.getItem('editor.dirty') && !this.#unchanged())) this.#loadEditor(entry);
        else if (!this.#unchanged()) ui.data.setItem('editor.status', 'Node changed outside this draft. Press Escape to reload the cell before saving.');
    }

    #selected() { return this.#nodes.find(item => item.id === this.#ui.data.getItem('selection')); }

    #unchanged() {
        const entry = this.#selected();
        const snapshot = this.#snapshot;
        if (!entry || !snapshot || entry.node !== snapshot.node || !entry.node.parentBag ||
            !entry.node.parentBag.getNodes().includes(entry.node) || this.#state() === 'disposed') return false;
        if (this.#connection && this.#connection.nodeInfo(entry.node)?.revision !== snapshot.revision) return false;
        const attrs = entry.node.getAttr();
        return Object.is(entry.node.getValue(true), snapshot.value) && entry.node.resolver === snapshot.resolver &&
            Object.keys(attrs).length === Object.keys(snapshot.attrs).length &&
            Object.entries(snapshot.attrs).every(([name, value]) => Object.is(attrs[name], value));
    }

    #inputType(type) { return ({boolean: 'checkbox', number: 'number', integer: 'number', date: 'date', time: 'time', datetime: 'datetime-local'})[type] ?? 'text'; }

    #row(name, value, primary, locked = false) {
        const scalar = scalarType(value);
        const type = scalar === 'null' ? 'string' : scalar;
        let text = value === null ? '' : type === 'boolean' ? value : type ? scalarText(value, type) : this.#format(value);
        if (type === 'datetime') text = text.replace(/Z$/, '');
        return new Bag({name, initialName: name, initialText: text, initialType: type, text,
            type: type ?? 'readonly', inputType: this.#inputType(type), isNull: value === null,
            primary, locked: locked || !type, removed: false});
    }

    #loadEditor(entry) {
        const ui = this.#ui;
        this.#snapshot = entry ? {node: entry.node, value: entry.node.getValue(true),
            parameterEnums: ui.data.getItem('root') !== 'source' ? {} : this.#connection
                ? this.#connection.nodeInfo(entry.node).parameterEnums : readParameterEnums(entry.node),
            attrs: {...entry.node.getAttr()}, resolver: entry.node.resolver, revision: this.#connection?.nodeInfo(entry.node)?.revision} : null;
        const rows = new Bag();
        if (entry) {
            if (!(this.#snapshot.value instanceof Bag)) rows.setItem(`r${++this.#nextRow}`, this.#row('value', this.#snapshot.value, true, !!entry.node.resolver || !!this.#connection?.nodeInfo(entry.node)?.readonly));
            for (const [name, value] of Object.entries(this.#snapshot.attrs)) {
                if (name !== '_meta') rows.setItem(`r${++this.#nextRow}`, this.#row(name, value, false, !!this.#connection?.nodeInfo(entry.node)?.readonlyAttrs.has(name)));
            }
        }
        ui.data.setItem('editor.rows', rows);
        ui.data.setItem('editor.disabled', !entry || this.#state() === 'disposed');
        ui.data.setItem('editor.dirty', false);
        ui.data.setItem('editor.status', '');
        this.#renderEditor();
        this.#loadBreakpoint();
    }

    #renderEditor() {
        const builder = new GramlotBuilder();
        for (const row of this.#ui.data.getItem('editor.rows').getNodes()) {
            const data = row.value;
            if (data.getItem('removed')) continue;
            const primary = data.getItem('primary');
            const name = data.getItem('name');
            const fresh = data.getItem('initialName') === '';
            const locked = data.getItem('locked');
            const line = builder.root.div({class: 'property-row', datapath: `editor.rows.${row.label}`, 'data-row': row.label,
                connect_onfocusout: 'inspector.leaveRow'});
            const label = line.div({class: 'property-name'});
            if (fresh) label.input({value: '^.name', live: true, 'aria-label': 'New attribute name', 'data-row': row.label, connect_oninput: 'inspector.editChanged'});
            else label.span(name);
            const cell = line.div({class: 'property-value'});
            const choices = !primary && this.#snapshot.parameterEnums[name];
            const value = data.getItem('text');
            if (choices && choices.includes(value)) {
                const select = cell.select({value: '^.text', class: 'enum-value', disabled: locked,
                    'aria-label': `${name} value`, 'data-row': row.label,
                    connect_onchange: 'inspector.enumChanged', connect_onkeydown: 'inspector.editKey'});
                for (const choice of choices) select.option(choice, {value: choice});
            } else cell.input({value: '^.text', type: '^.inputType', live: true, step: data.getItem('type') === 'integer' ? '1' : 'any', disabled: locked,
                'aria-label': primary ? 'Value' : `${name || 'New attribute'} value`, 'data-row': row.label,
                title: data.getItem('isNull') ? 'Null value. Backspace on an empty cell sets null.' : 'Enter to save; Escape to revert; Backspace on an empty cell sets null.',
                connect_oninput: 'inspector.editChanged', connect_onkeydown: 'inspector.editKey'});
            if (fresh) {
                const type = cell.select({value: '^.type', 'aria-label': 'New attribute type', 'data-row': row.label, connect_onchange: 'inspector.typeChanged'});
                for (const value of editorTypes) type.option(value, {value});
            }
            if (!primary) {
                const button = cell.html_button({type: 'button', disabled: locked, 'aria-label': `Remove ${name || 'new attribute'}`, class: 'remove',
                    'data-row': row.label, connect_onpointerdown: 'inspector.keepFocus', connect_onclick: 'inspector.removeAttribute'});
                button.svg({viewBox: '0 0 24 24', 'aria-hidden': 'true', fill: 'none', stroke: 'currentColor', stroke_width: 1.5,
                    stroke_linecap: 'round', stroke_linejoin: 'round'}).path({d: 'M3 6h18M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M5 6l1 14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1l1-14M10 10v7M14 10v7'});
            }
        }
        this.#ui.src.source.getNode('main.palette.content.properties.editor.rows').setValue(this.#ui.src.prepareSource(builder.source));
    }

    #addAttribute() {
        if (!this.#snapshot) return;
        this.#ui.data.getItem('editor.rows').setItem(`r${++this.#nextRow}`, this.#row('', '', false));
        this.#ui.data.setItem('editor.status', '');
        this.#renderEditor();
        this.shadowRoot.querySelector('[aria-label="New attribute name"]').focus();
    }

    #acceptEdit(target) {
        this.#ui.data.setItem('editor.dirty', false);
        const rows = this.#ui.data.getItem('editor.rows').getNodes();
        if (rows.some(row => row.value.getItem('removed') || row.value.getItem('initialName') === '')) {
            this.#loadEditor(this.#selected());
        } else {
            this.#snapshot = {...this.#snapshot, node: target, value: target.getValue(true), attrs: {...target.getAttr()}, resolver: target.resolver,
                revision: this.#connection?.nodeInfo(target).revision};
            for (const row of rows) {
                row.value.setItem('initialText', row.value.getItem('text'));
                row.value.setItem('initialType', row.value.getItem('type'));
            }
        }
        this.#ui.data.setItem('editor.status', '');
    }

    #applyEdit(after = () => {}, focusTarget = this.shadowRoot.activeElement) {
        if (this.#ui.data.getItem('busy')) return false;
        try {
            if (!this.#unchanged()) throw new Error('Node changed or was removed. Press Escape to reload the cell before saving.');
            const attrs = Object.hasOwn(this.#snapshot.attrs, '_meta') ? {_meta: this.#snapshot.attrs._meta} : {};
            let value = this.#snapshot.value;
            for (const node of this.#ui.data.getItem('editor.rows').getNodes()) {
                const row = node.getValue(true);
                const primary = row.getItem('primary');
                const name = row.getItem('name');
                if (row.getItem('removed')) continue;
                if (!primary) {
                    if (!name.trim()) throw new Error('Enter an attribute name.');
                    if (['__proto__', 'prototype', 'constructor'].includes(name) || (name === '_meta' && !row.getItem('locked'))) throw new Error('Unsupported attribute name.');
                    if (Object.hasOwn(attrs, name)) throw new Error(`Duplicate attribute: ${name}`);
                }
                const initialName = row.getItem('initialName');
                const unchanged = row.getItem('text') === row.getItem('initialText') && row.getItem('type') === row.getItem('initialType') &&
                    (primary || Object.hasOwn(this.#snapshot.attrs, initialName));
                const text = row.getItem('text');
                const parsed = row.getItem('locked') || (unchanged && !row.getItem('isNull')) ? (primary ? value : this.#snapshot.attrs[initialName])
                    : row.getItem('isNull') || text === null ? null : parseScalar(row.getItem('type'), String(text) + (row.getItem('type') === 'datetime' ? 'Z' : ''));
                if (primary) value = parsed;
                else attrs[name] = parsed;
            }
            // Validate every draft cell before the first target write. Keep metadata and null attributes.
            const target = this.#snapshot.node;
            const changed = Object.keys(attrs).length !== Object.keys(this.#snapshot.attrs).length ||
                Object.entries(attrs).some(([name, item]) => !Object.is(item, this.#snapshot.attrs[name]));
            if (this.#connection) {
                const connection = this.#connection;
                const entry = this.#selected();
                const command = {root: this.#ui.data.getItem('root'), path: entry.path.join('.'),
                    nodeId: connection.nodeInfo(target).id, revision: this.#snapshot.revision,
                    set: Object.entries(attrs).filter(([name, item]) => name !== '_meta' && !Object.is(item, this.#snapshot.attrs[name])).map(([name, item]) => [name, encodeScalar(item)]),
                    remove: Object.keys(this.#snapshot.attrs).filter(name => name !== '_meta' && !Object.hasOwn(attrs, name))};
                if (!Object.is(value, this.#snapshot.value)) command.value = encodeScalar(value);
                this.#ui.data.setItem('busy', true);
                this.#ui.data.setItem('editor.disabled', true);
                const generation = this.#generation;
                connection.request('edit', command).then(() => {
                    if (!this.#ui || generation !== this.#generation) return;
                    this.#acceptEdit(target);
                    this.#ui.data.setItem('busy', false);
                    this.#ui.data.setItem('editor.disabled', false);
                    if (focusTarget?.isConnected && !this.shadowRoot.activeElement) focusTarget.focus();
                    this.#refresh(); after();
                }).catch(error => { if (this.#ui && generation === this.#generation) this.#ui.data.setItem('editor.status', error.message); })
                    .finally(() => { if (this.#ui && generation === this.#generation) { this.#ui.data.setItem('busy', false); this.#ui.data.setItem('editor.disabled', !this.#selected() || this.#state() === 'disposed'); } });
                return false;
            }
            if (changed) target.setAttr(attrs, true, false, false);
            if (!Object.is(value, this.#snapshot.value)) target.setValue(value);
            this.#acceptEdit(target);
            this.#refresh();
            this.#ui.data.setItem('editor.status', '');
            after();
            return true;
        } catch (error) { this.#ui.data.setItem('editor.status', error.message); return false; }
    }

    #findBreakpoint(root, path) {
        return this.#ui.data.getItem('breakpoints').getNodes().find(node => {
            const value = node.getValue(true);
            return value.getItem('root') === root && value.getItem('path') === path;
        });
    }

    #loadBreakpoint() {
        if (this.#ui.data.getItem('breakpointDirty')) return;
        const entry = this.#selected();
        const where = this.#breakpointTarget ?? (entry ? {root: this.#ui.data.getItem('root'), path: entry.path.join('.')} : null);
        const config = where ? this.#findBreakpoint(where.root, where.path)?.getValue(true) : null;
        this.#ui.data.setItem('editor.mode', config?.getItem('mode') ?? '');
        this.#ui.data.setItem('editor.condition', config?.getItem('condition') ?? '');
    }

    #setBreakpoint(after = () => {}) {
        const entry = this.#selected();
        const where = this.#breakpointTarget ?? (entry ? {root: this.#ui.data.getItem('root'), path: entry.path.join('.')} : null);
        if (!where) return false;
        const ui = this.#ui;
        const {root, path} = where;
        const mode = ui.data.getItem('editor.mode');
        const condition = ui.data.getItem('editor.condition').trim();
        const existing = this.#findBreakpoint(root, path);
        if (this.#connection) {
            const generation = this.#generation;
            this.#connection.request('breakpoint', {root, path, mode, condition}).then(() => {
                if (!this.#ui || generation !== this.#generation) return;
                ui.data.setItem('breakpointDirty', false); ui.data.setItem('breakpointStatus', '');
                this.#refresh(); after();
            }).catch(error => { if (this.#ui && generation === this.#generation) ui.data.setItem('breakpointStatus', `Breakpoint not saved: ${error.message}`); });
            return false;
        }
        try {
            if (!['', 'debugger', 'console'].includes(mode)) throw new Error('Unknown breakpoint mode');
            // Deliberately authored debug expressions, evaluated under the page's CSP.
            const test = mode && condition ? new this.ownerDocument.defaultView.Function(
                'evt', 'node', 'value', 'oldvalue', 'attrs_diff', 'reason', 'path', `"use strict"; return (${condition});`) : null;
            if (existing) {
                ui.data.getItem('breakpoints').popNode(existing.label);
                this.#breakpointTests.delete(existing.label);
            }
            if (mode) {
                const id = `b${++this.#nextBreakpoint}`;
                ui.data.getItem('breakpoints').setItem(id, new Bag({root, path, mode, condition, hits: 0}));
                if (test) this.#breakpointTests.set(id, test);
            }
            ui.data.setItem('breakpointDirty', false);
            ui.data.setItem('breakpointError', '');
            ui.data.setItem('breakpointStatus', mode ? `Breakpoint set on ${root}: ${path}` : 'Breakpoint removed');
            this.#refresh();
            after();
            return true;
        } catch (error) { ui.data.setItem('breakpointStatus', `Breakpoint not saved: ${error.message}`); return false; }
    }

    #renderBreakpoints() {
        const builder = new GramlotBuilder();
        for (const node of this.#ui.data.getItem('breakpoints').getNodes()) {
            const config = node.value;
            const row = builder.root.div({class: 'breakpoint-entry'});
            row.span(`${config.getItem('root')}: ${config.getItem('path')} · ${config.getItem('mode')} · ${config.getItem('hits')} hits`);
            row.html_button('×', {type: 'button', 'aria-label': `Remove breakpoint ${config.getItem('root')}: ${config.getItem('path')}`,
                'data-breakpoint': node.label, connect_onclick: 'inspector.removeBreakpoint'});
        }
        this.#ui.src.source.getNode('main.palette.breakpoints.entries').setValue(this.#ui.src.prepareSource(builder.source));
    }

    #checkBreakpoints(root, event) {
        if (!this.#ui) return;
        const structural = event.evt === 'ins' || event.evt === 'del';
        // Bag documents null for the parent path of a root deletion.
        const pathlist = event.pathlist === null ? [] : event.pathlist;
        for (const node of Array.isArray(event.node) ? event.node : [event.node]) {
            const path = (structural ? [...pathlist, node.label] : pathlist).join('.');
            const config = this.#findBreakpoint(root, path);
            if (!config) continue;
            const fields = {evt: event.evt, node, value: node.getValue(true), oldvalue: event.oldvalue,
                attrs_diff: event.attrs_diff, reason: event.reason, path};
            const test = this.#breakpointTests.get(config.label);
            if (test) {
                try { if (!test(fields.evt, node, fields.value, fields.oldvalue, fields.attrs_diff, fields.reason, path)) continue; }
                catch (error) { this.#ui.data.setItem('breakpointStatus', `Condition failed on ${root}: ${path}: ${error.message}`); this.#ui.data.setItem('breakpointError', `Condition failed on ${root}: ${path}: ${error.message}`); continue; }
            }
            const value = config.getValue(true);
            value.setItem('hits', value.getItem('hits') + 1);
            this.#ui.data.setItem('breakpointStatus', `Hit ${root}: ${path} (${event.evt})`);
            this.#hitBreakpoint(value.getItem('mode'), root, fields);
        }
    }

    #hitBreakpoint(mode, root, fields) {
        // Synchronous Bag subscription: the writer remains on the debugger stack.
        if (mode === 'debugger') { debugger; } // eslint-disable-line no-debugger
        else this.ownerDocument.defaultView.console.log('** Gramlot breakpoint **', root, fields);
    }

    #format(value) {
        if (value instanceof Bag) return `${value.constructor.name} (${value.getNodes().length} nodes)`;
        if (typeof value === 'string') return value;
        if (value === undefined) return 'undefined';
        if (typeof value === 'number' || typeof value === 'boolean' || value === null) return String(value);
        if (typeof value === 'bigint') return `${value}n`;
        if (value instanceof Date) return value.toISOString();
        return JSON.stringify(value, null, 2);
    }
}

customElements.define('gramlot-tools-inspector', GramlotToolsInspector);
