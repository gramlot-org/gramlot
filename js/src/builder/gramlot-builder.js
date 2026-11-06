/* @ts-self-types="./gramlot-builder.d.ts" */
/**
 * The Gramlot vocabulary and inert authoring on the shared builder grammar.
 *
 * @module
 */
import buttons from '../components/buttons.js';
import {ComponentCollection} from '../components/registry.js';
import {Bag} from '@genrojs/bag';
import {HtmlBuilder, META_ATTRS, SourceBagNode, sourceTarget} from '@genrojs/builders';
import {toTytx} from '@genrojs/tytx';
// Loading the Gramlot Source classes adds GramlotBuilderBag to the TYTX subtype
// dictionary of X, so every GramlotBuilder user can encode and decode it.
import {GramlotBuilderBag} from './source.js';
import {NAME_SYNTAX, NameSyntax} from './name-syntax.js';
import {GramlotHtmlRenderer} from '../renderer/gramlot-html-renderer.js';
// Byte copy of src/gramlot/collections/binding.json: the JS package ships js/ only.
import BINDING from './binding.json' with {type: 'json'};
import WEBCOMPONENT from './webcomponent.json' with {type: 'json'};
import {webcomponentCode} from '../webcomponent.js';
import {randomId} from '../random-id.js';
import {pointerTransform} from '@genrojs/builders';


// P19: `data` is ambiguous between the legacy data-element and the HTML5 element.
const DATA_FORBIDDEN = 'data is forbidden: write dataSetter for a Data value or html_data for the HTML5 <data> element';
// Declarations that Gramlot does not accept and that fail explicitly (source plan, section 2).
const EXCLUDED_ELEMENTS = new Set();
const EXCLUDED_ATTRIBUTES = new Set(['serverpath', 'dbenv', 'shared_id']);
const EXCLUDED_ATTRIBUTE_PREFIXES = ['formsubscribe_'];

// P18 and B8: the Data path of each data-element, which does not accept `?attr`,
// and its inline attribute, which excludes `func` on the same node, as `_if` does (Q11.1).
const DATA_PATH_ATTRIBUTES = {dataSetter: 'destination_path', dataFormula: 'result_path', dataRpc: 'result_path',
    dataRemote: 'destination_path'};
const DATA_INLINE_ATTRIBUTES = {dataFormula: 'formula', dataController: 'script'};

/** The P18 violation of a data-element's attributes, or null. */
// Builder's framework call keywords, accepted by every element.
const FRAMEWORK_ATTRIBUTES = new Set(['node_label', 'node_position', 'nodeId', 'target_id', 'datapath', 'iterate', 'store', '_tag', '_meta', 'ns']);
// Export formats of the grid:export command, in menu order, with their captions.
const EXPORT_FORMATS = {csv:'CSV', json:'JSON', tytx:'TYTX', xml:'XML', xlsx:'Excel'};
// frameGrid composes these grid attributes itself; its own parameters reach the grid too.
const FRAME_GRID_COMPOSED = new Set(['node_label', 'frameTarget', 'nodeId']);
const FRAME_GRID_PARAMETERS = new Set(['storepath', 'rowMode', 'structpath']);

/**
 * An element whose `_meta.keywordPattern` is set accepts, besides its declared attributes, only the
 * keywords matching that pattern (grid column `formula_<name>`); the error names the first other one.
 */
function keywordPatternError(spec, attrs) {
    const pattern = spec?._meta?.keywordPattern;
    if (!pattern) return null;
    const declared = new Set(spec.attributes.parameters.filter(parameter => !parameter.kind.startsWith('var_')).map(parameter => parameter.name));
    const unknown = Object.keys(attrs).find(name => !declared.has(name) && !FRAMEWORK_ATTRIBUTES.has(name) && !new RegExp(pattern).test(name));
    return unknown === undefined ? null : `unknown attribute '${unknown}'`;
}

/** frameGrid `export`: true for every format, false for none, or a comma-separated list such as 'csv,json'. */
function frameGridExportFormats(exportRows) {
    if (typeof exportRows === 'boolean') return exportRows ? Object.keys(EXPORT_FORMATS) : [];
    if (typeof exportRows !== 'string' || !exportRows.trim()) throw new TypeError('frameGrid export requires a boolean or a list of formats');
    const formats = exportRows.split(',').map(item => item.trim());
    const unknown = formats.find(item => !Object.hasOwn(EXPORT_FORMATS, item));
    if (unknown !== undefined) throw new TypeError(`frameGrid export format '${unknown}' is not one of ${Object.keys(EXPORT_FORMATS).join(', ')}`);
    return formats;
}

function dataElementError(tag, attrs) {
    if (['input', 'textarea', 'select', 'webcomponent'].includes(tag) && pointerTransform(attrs.value)) {
        return "'value' does not accept pointer suffixes; use an ordinary value pointer";
    }
    if (tag === 'html_button' && Object.keys(attrs).some(name =>
        ['action', 'ask', '_delay', 'fire'].includes(name) || name.startsWith('fire_'))) {
        return 'plain HTML button: use button for action, ask, fire or _delay';
    }
    if (Object.hasOwn(attrs, 'ask') && !['button', 'toggleButton', 'dropDownButton', 'menuline'].includes(tag)) return "'ask' is supported on buttons";
    if (Object.hasOwn(attrs, '_ask') && !['dataController', 'dataFormula', 'dataRpc'].includes(tag)) return "'_ask' requires a controller, formula or RPC";
    if (['dataSetter', 'dataRemote'].includes(tag) && Object.keys(attrs).some(name => name.startsWith('subscribe_') || name.startsWith('selfsubscribe_'))) {
        return 'topic subscriptions are supported on controllers, formulas, RPCs and rendered elements';
    }
    const pathName = DATA_PATH_ATTRIBUTES[tag];
    if (pathName && String(attrs[pathName] ?? '').includes('?')) {
        return `'${pathName}' does not accept '?attr': '${attrs[pathName]}'`;
    }
    const inlineName = DATA_INLINE_ATTRIBUTES[tag];
    if (inlineName && attrs[inlineName] != null && attrs.func != null) {
        return `'func' and '${inlineName}' cannot be declared on the same node`;
    }
    if (inlineName && attrs._if != null && attrs.func != null) {
        return "'_if' is inline and cannot be declared with 'func': write the condition in the method";
    }
    return null;
}

/** The first excluded attribute name of `attrs`, or undefined. */
function excludedAttribute(attrs) {
    return Object.keys(attrs).find(name => EXCLUDED_ATTRIBUTES.has(name)
        || EXCLUDED_ATTRIBUTE_PREFIXES.some(prefix => name.startsWith(prefix)));
}

/** Gramlot vocabulary and inert authoring on the shared builder grammar. */
export class GramlotBuilder extends HtmlBuilder {
    static _name = 'gramlot';
    static containers = ['frameGrid'];
    static _sourceClass = GramlotBuilderBag;
    // Composed on the inherited HtmlBuilder grammar; its data-elements replace Builder's.
    static { this.defineGrammar(BINDING); }
    static { this.defineGrammar(WEBCOMPONENT); }
    static { this.defineGrammar(buttons.toDocument()); }

    /** Compose real Source nodes; frame/grid/menu retain their existing runtime owners. */
    frameGrid(parent, {storepath, rowMode, structpath, searchOn = false, searchHelp = false, chart = false,
        export: exportRows = false, printRows = false, advancedTools = false, addrow = false, addrow_defaults = null,
        duprow = false, delrow = false, gridsemaphore = false, ...attrs} = {}) {
        for (const tag of ['framePane', 'grid']) {
            if (!this.schemaTag(tag)) throw new TypeError(`frameGrid requires the ${tag} collection`);
        }
        const chartOptions = {};
        for (const key of Object.keys(attrs)) if (key.startsWith('chart_')) {
            chartOptions[key.slice(6)] = attrs[key]; delete attrs[key];
        }
        const [frameAttrs, routed] = this.frameGridRoute(attrs);
        const twice = Object.keys(routed).find(name => ['storepath', 'rowMode'].includes(name) || name === 'structpath' && structpath != null);
        if (twice !== undefined) throw new TypeError(`frameGrid: '${twice}' is given twice`);
        if (chart !== false) {
            if (chart !== true && (typeof chart !== 'string' || !chart)) throw new TypeError('chart requires a boolean or chart type');
            if (!frameAttrs.datapath) throw new TypeError('A chart frameGrid requires its own datapath');
            if (!this.schemaTag('chartPane')) throw new TypeError('frameGrid requires the chartPane collection');
            if (typeof chart === 'string') chartOptions.chartType = chart;
        } else if (Object.keys(chartOptions).length) throw new TypeError('chart_* options require chart');
        const exportFormats = frameGridExportFormats(exportRows);
        for (const [name, value] of Object.entries({printRows, advancedTools, addrow, duprow, delrow, gridsemaphore})) {
            if (typeof value !== 'boolean') throw new TypeError(`frameGrid ${name} requires a boolean`);
        }
        if (addrow_defaults !== null && (!addrow || typeof addrow_defaults !== 'object' || Array.isArray(addrow_defaults))) {
            throw new TypeError('addrow_defaults requires addrow and a mapping');
        }
        if (gridsemaphore) {
            if (!frameAttrs.datapath) throw new TypeError('A gridsemaphore frameGrid requires its own datapath');
            if (!this.schemaTag('editingStatus')) throw new TypeError('frameGrid requires the editingStatus collection');
            frameAttrs.form = true;
        }
        const gridAttrs = {storepath, rowMode, ...(structpath == null ? {} : {structpath}),
            node_label: 'grid', frameTarget: true, height: '100%', width: '100%',
            // Legacy frameGrid default: the current row identity at .selectedId of the frame's own datapath.
            ...(frameAttrs.datapath ? {selectedId: '^.selectedId'} : {}), ...routed};
        if (chart !== false) gridAttrs.nodeId = randomId();
        this.validateNodeValues('grid', null, gridAttrs);
        if (searchOn !== false) this.validateNodeValues('searchBox', null, {searchOn, searchHelp});
        const frame = parent.framePane(frameAttrs);
        frame.center.grid(gridAttrs);
        const bar = frame.top.menu({presentation:'bar', node_label:'bar', aria_label:'Grid toolbar', class:'gramlot-grid-toolbar'});
        if (searchOn !== false) bar.menuline({group:true, node_label:'search', class:'gramlot-grid-search'}).searchBox({searchOn, searchHelp});
        if (addrow) bar.menuline({command:'grid:addrow', node_label:'addrow', ...(addrow_defaults === null ? {} : {parameters:{defaults:addrow_defaults}})});
        if (duprow) bar.menuline({command:'grid:duprow', node_label:'duprow'});
        if (delrow) bar.menuline({command:'grid:delrow', node_label:'delrow'});
        const exportMenu = parent => {
            const menu = parent.menuline({caption:'Export', icon:'⇩', labelPosition:'tooltip', node_label:'export'}).menu();
            for (const name of exportFormats) menu.menuline({command:'grid:export', caption:EXPORT_FORMATS[name], parameters:{format:name}, node_label:name});
        };
        if (exportFormats.length) exportMenu(bar);
        if (printRows) bar.menuline({command:'grid:printRows', node_label:'printRows'});
        if (advancedTools) {
            const tools = bar.menuline({caption:'Advanced tools', icon:'…', labelPosition:'tooltip', node_label:'advancedTools'}).menu();
            tools.menuline({command:'grid:lineNumbers', node_label:'lineNumbers'});
            if (exportFormats.length) exportMenu(tools);
            if (printRows) tools.menuline({command:'grid:printRows', node_label:'printRows'});
        }
        if (gridsemaphore) bar.menuline({group:true, node_label:'semaphore'}).editingStatus();
        if (chart !== false) {
            bar.menuline({caption:'Chart', icon:'▥', labelPosition:'tooltip', node_label:'chart', action:"this.SET('._chart.open',true)"});
            const window = frame.center.floatingPane({title:'Chart', open:'^._chart.open', width:'820px', height:'560px',
                movable:true, resizable:true, maximizable:true, node_label:'chartWindow'});
            window.frame.center.chartPane({storepath,rowMode,gridId:gridAttrs.nodeId,configpath:'._chart',
                configDefaults:new Bag(chartOptions),height:'100%'});
        }
        return frame;
    }

    /** Split frameGrid keywords: unprefixed grid parameters go to the grid, `grid_`/`frame_` force any attribute. */
    frameGridRoute(attrs) {
        const declared = tag => new Set(this.schema[tag].attributes.parameters.filter(parameter => !parameter.kind.startsWith('var_')).map(parameter => parameter.name));
        const source = new Set([...FRAMEWORK_ATTRIBUTES, ...META_ATTRS]);
        const gridNames = declared('grid'), frameNames = declared('framePane');
        const pattern = new RegExp(this.schema.grid._meta.parameterPattern);
        // A name the frame also accepts stays on the frame unless forced with grid_.
        const routed = name => (gridNames.has(name) || pattern.test(name)) && !frameNames.has(name) && !source.has(name)
            && !FRAME_GRID_COMPOSED.has(name) && !FRAME_GRID_PARAMETERS.has(name);
        const frame = {}, grid = {};
        for (const [key, value] of Object.entries(attrs)) {
            let name, target;
            if (key.startsWith('grid_')) {
                name = key.slice('grid_'.length); target = grid;
                if (FRAME_GRID_COMPOSED.has(name)) throw new TypeError(`frameGrid: '${key}' is composed by frameGrid`);
            } else if (key.startsWith('frame_')) { name = key.slice('frame_'.length); target = frame; }
            else { name = key; target = routed(key) ? grid : frame; }
            if (Object.hasOwn(target, name)) throw new TypeError(`frameGrid: '${name}' is given twice`);
            target[name] = value;
        }
        return [frame, grid];
    }

    /** Tag prefixes of the parent dialects, from the `_name` of the classes above GramlotBuilder. */
    static get dialectPrefixes() {
        const prefixes = [];
        for (let cls = Object.getPrototypeOf(GramlotBuilder); cls && cls !== Function.prototype; cls = Object.getPrototypeOf(cls)) {
            if (Object.hasOwn(cls, '_name') && cls._name) prefixes.push(`${cls._name}_`);
        }
        return prefixes;
    }

    constructor(name = null, {collections = [], auth = null, nameSyntax = NAME_SYNTAX} = {}) {
        if (!(nameSyntax instanceof NameSyntax)) throw new TypeError(`nameSyntax must be a NameSyntax, not ${nameSyntax}`);
        super(name);
        this._binding = null;
        this._auth = auth;
        this._nameSyntax = nameSyntax;
        for (const collection of collections) this.loadCollection(collection);
    }

    /** The `auth` evaluator, `rule => null | 'not_authenticated' | 'not_authorized'`, or null:
     * without it every element is serialised. */
    get auth() { return this._auth; }

    /** The NameSyntax of the method names of `remote`: the one of the server that built this builder
     * (`GramlotServer.nameSyntax`) or of the page (`Gramlot` option `nameSyntax`), the core default
     * `NAME_SYNTAX` otherwise. */
    get nameSyntax() { return this._nameSyntax; }

    /** The BindingRuntime of the Gramlot page that owns this builder, or null for authoring alone. */
    get binding() { return this._binding; }
    /** Set by Gramlot right after creating the builder (§4.3). */
    set binding(runtime) { this._binding = runtime; }

    /** Builder supplies typed slots; Gramlot owns activation, CSP and page-local _F. */
    evaluatePointerExpression(node, name, raw, expression, inputs) {
        return this.binding
            ? this.binding.inlineCompiler.compilePointerExpression(node, name, raw, expression.text)(inputs)
            : null;
    }

    /** Builder's nodeById; inside a Gramlot page it reads the nodeId map of the BindingRuntime (R06). */
    nodeById(nodeId) {
        if (!this.binding) return super.nodeById(nodeId);
        const node = this.binding.nodeIds.get(nodeId);
        if (!node) throw new Error(`nodeId not found: ${nodeId}`);
        return node.builder.wrapSource(node);
    }
    loadCollection(document) {
        this.loadGrammar(document instanceof ComponentCollection ? document.toDocument() : document);
        return this;
    }

    /**
     * Builder's schemaTag for authored names and resolved tags.
     *
     * A parent-dialect prefix reaches an element the node API shadows (`html_label`):
     * the prefixed name is returned as written and `bagCall`/`commandOnNode` resolve it,
     * because Builder's validation calls this method with resolved tags such as `data`.
     * The prefix `gramlot_` and the excluded declarations are errors.
     */
    schemaTag(name) {
        const lookup = name.toLowerCase();
        const prefixes = GramlotBuilder.dialectPrefixes;
        if (lookup.startsWith(`${GramlotBuilder._name}_`)) {
            throw new Error(`${name}: the tag prefix '${GramlotBuilder._name}_' is not accepted; use the prefix '${prefixes[0]}'`);
        }
        if (EXCLUDED_ELEMENTS.has(lookup)) throw new Error(`${name}: excluded from Gramlot`);
        const tag = this.schemaTagNames[lookup];
        if (tag) return tag;
        for (const prefix of prefixes) {
            if (lookup.startsWith(prefix) && this.schemaTagNames[lookup.slice(prefix.length)]) return lookup;
        }
        return null;
    }

    /** Builder's element call from the Proxy on a Source Bag. */
    bagCall(bag, tag, value, attrs) {
        tag = this.#authoredTag(tag);
        [value, attrs] = this.menuArguments(tag, value, attrs);
        return super.bagCall(bag, tag, value, attrs);
    }

    /** Builder's element call from the Proxy on a Source node. */
    commandOnNode(node, tag, value, attrs) {
        tag = this.#authoredTag(tag);
        [value, attrs] = this.menuArguments(tag, value, attrs);
        return super.commandOnNode(node, tag, value, attrs);
    }

    menuArguments(tag, value, attrs = {}) {
        if (tag === 'menu' && value == null) return [new GramlotBuilderBag(null, this), attrs];
        if (tag === 'menuline' && value != null && value !== '-') {
            if (Object.hasOwn(attrs, 'command')) throw new TypeError('menuline command must be declared once');
            return [null, {...attrs, command: value}];
        }
        return [value, attrs];
    }

    /** Builder's value check, plus the excluded attributes (authoring names the tag). */
    validateNodeValues(tag, value, attrs = {}) {
        if (this.schema[tag]?._meta?.gramlot_component && pointerTransform(attrs.value)) {
            throw new Error("'value' does not accept pointer suffixes");
        }
        if (tag === 'webcomponent') webcomponentCode(attrs);
        const excluded = excludedAttribute(attrs);
        if (excluded) throw new Error(`${tag}: attribute '${excluded}' is excluded from Gramlot`);
        const error = dataElementError(tag, attrs) ?? keywordPatternError(this.schema[tag], attrs);
        if (error) throw new Error(`${tag}: ${error}`);
        return super.validateNodeValues(tag, value, attrs);
    }

    /** Builder's node check, plus the excluded attributes (a Source node names tag and label). */
    validateNode(node, options = {}) {
        if (node._getMeta('gramlot_component') && pointerTransform((options.attrs ?? node.getAttr()).value)) {
            throw new Error("'value' does not accept pointer suffixes");
        }
        if (node.nodeTag === 'webcomponent') webcomponentCode(options.attrs ?? node.getAttr());
        const excluded = excludedAttribute(options.attrs ?? node.getAttr());
        if (excluded) throw new Error(`${node.nodeTag} '${node.label}': attribute '${excluded}' is excluded from Gramlot`);
        const error = dataElementError(node.nodeTag, options.attrs ?? node.getAttr())
            ?? keywordPatternError(this.schema[node.nodeTag], options.attrs ?? node.getAttr());
        if (error) throw new Error(`${node.nodeTag} '${node.label}': ${error}`);
        return super.validateNode(node, options);
    }

    /** Both button declarations occupy the native button slot in HTML content models. */
    _validateChildren(parentTag, info, tags, includeMinimum) {
        return super._validateChildren(parentTag, info,
            tags.map(tag => tag === 'html_button' ? 'button' : tag === 'html_dialog' ? 'dialog' : tag), includeMinimum);
    }

    /** Custom elements are outside the native HTML child catalogue, as components are. */
    _countsForGrammar(info) {
        return info === this.schema.button || (!info?._meta?.gramlot_component && info !== this.schema.webcomponent && super._countsForGrammar(info));
    }

    /** Builder's child insertion; a plain object `value` of `dataSetter` becomes `new Bag(value)` (P25). */
    setChild(bag, tag, value, attrs, parentOverride = null) {
        attrs = Object.fromEntries(Object.entries(attrs ?? {}).map(([key, value]) =>
            [key, sourceTarget(value) instanceof SourceBagNode ? this.reference(value) : value]));
        const plain = tag === 'dataSetter' && attrs?.value !== null && typeof attrs?.value === 'object'
            && Object.getPrototypeOf(attrs.value) === Object.prototype;
        const actual = plain ? {...attrs, value: new Bag(attrs.value)} : attrs;
        return super.setChild(bag, tag, value, actual, parentOverride);
    }

    /** The schema tag of a `schemaTag` result; `data` is forbidden (P19). */
    #authoredTag(tag) {
        if (tag === 'data') throw new Error(DATA_FORBIDDEN);
        if (this.schemaTagNames[tag.toLowerCase()] === tag) return tag;
        const prefix = GramlotBuilder.dialectPrefixes.find(prefix => tag.startsWith(prefix));
        return this.schemaTagNames[tag.slice(prefix.length)];
    }
    /** The string renderer of the Gramlot Source (static render; authoring stays inert). */
    get renderer_html() { return new GramlotHtmlRenderer(this); }

    create() { this.setup(this.data); this.main(this.root); }
    computeLogic() {} // Browser declarations are not executed by server authoring.

    /**
     * Preserve mixed leading text when a scalar element gains children. The promoted `_text` keeps
     * its type, as the Python `_promote_child_content`; the browser renderer converts it to text once.
     */
    promoteNodeValue(node, oldValue, branch) {
        const attributes = oldValue !== null && oldValue !== undefined
            ? {_text: oldValue} : null;
        node.setValue(branch, true, attributes, true);
    }

    /** Create a transportable reference descriptor for an authored node. */
    reference(node, kind = 'node') {
        node = sourceTarget(node);
        if (!(node instanceof SourceBagNode) || !['node', 'dom'].includes(kind)) {
            throw new TypeError('Reference requires an element and node/dom kind');
        }
        let id = node.getAttr('__ref');
        if (id === null || id === undefined) {
            id = randomId();
            node.setAttr({__ref: id});
        }
        return {$gramlotRef: id, kind};
    }

    /** The Source encoded as TYTX text, as the Python `to_tytx`. With an `auth` evaluator, the elements
     * whose `auth` rule it refuses are left out (GramlotBuilderBag.authorizedCopy). */
    toTytx() { return toTytx(this.auth === null ? this.source : this.source.authorizedCopy(this.auth)); }
}
