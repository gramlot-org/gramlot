import {Bag} from '@genrojs/bag';
import {HtmlBuilder, SourceBagNode, sourceTarget} from '@genrojs/builders';
import {toTytx} from '@genrojs/tytx';
// Loading the Gramlot Source classes adds GramlotBuilderBag to the TYTX subtype
// dictionary of X, so every GramlotBuilder user can encode and decode it.
import {GramlotBuilderBag} from './source.js';
import {GramlotHtmlRenderer} from '../renderer/gramlot-html-renderer.js';
// Byte copy of src/gramlot/collections/binding.json: the JS package ships js/ only.
import BINDING from './binding.json' with {type: 'json'};

// P19: `data` is ambiguous between the legacy data-element and the HTML5 element.
const DATA_FORBIDDEN = 'data is forbidden: write dataSetter for a Data value or html_data for the HTML5 <data> element';
// Declarations outside Gramlot 0.2.0 that fail explicitly (source plan, section 2).
const EXCLUDED_ELEMENTS = new Set(['datarpc', 'dataremote']);
const EXCLUDED_ATTRIBUTES = new Set(['serverpath', 'dbenv', 'shared_id', 'remote', '_ask', 'ask']);
const EXCLUDED_ATTRIBUTE_PREFIXES = ['subscribe_', 'selfsubscribe_', 'formsubscribe_'];

// P18 and B8: the Data path of each data-element, which does not accept `?attr`,
// and its inline attribute, which excludes `func` on the same node, as `_if` does (Q11.1).
const DATA_PATH_ATTRIBUTES = {dataSetter: 'destination_path', dataFormula: 'result_path'};
const DATA_INLINE_ATTRIBUTES = {dataFormula: 'formula', dataController: 'script'};

/** The P18 violation of a data-element's attributes, or null. */
function dataElementError(tag, attrs) {
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
    static _sourceClass = GramlotBuilderBag;
    // Composed on the inherited HtmlBuilder grammar; its data-elements replace Builder's.
    static { this.defineGrammar(BINDING); }

    /** Tag prefixes of the parent dialects, from the `_name` of the classes above GramlotBuilder. */
    static get dialectPrefixes() {
        const prefixes = [];
        for (let cls = Object.getPrototypeOf(GramlotBuilder); cls && cls !== Function.prototype; cls = Object.getPrototypeOf(cls)) {
            if (Object.hasOwn(cls, '_name') && cls._name) prefixes.push(`${cls._name}_`);
        }
        return prefixes;
    }

    constructor(name = null, {collections = []} = {}) {
        super(name);
        this._binding = null;
        for (const collection of collections) this.loadCollection(collection);
    }

    /** The BindingRuntime of the Gramlot page that owns this builder, or null for authoring alone. */
    get binding() { return this._binding; }
    /** Set by Gramlot right after creating the builder (§4.3). */
    set binding(runtime) { this._binding = runtime; }

    /** Builder's nodeById; inside a Gramlot page it reads the node_id map of the BindingRuntime (R06). */
    nodeById(nodeId) {
        if (!this.binding) return super.nodeById(nodeId);
        const node = this.binding.nodeIds.get(nodeId);
        if (!node) throw new Error(`node_id not found: ${nodeId}`);
        return node.builder.wrapSource(node);
    }
    loadCollection(document) {
        this.loadGrammar(document);
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
        if (EXCLUDED_ELEMENTS.has(lookup)) throw new Error(`${name}: excluded from Gramlot 0.2.0`);
        const tag = this.schemaTagNames[lookup];
        if (tag) return tag;
        for (const prefix of prefixes) {
            if (lookup.startsWith(prefix) && this.schemaTagNames[lookup.slice(prefix.length)]) return lookup;
        }
        return null;
    }

    /** Builder's element call from the Proxy on a Source Bag. */
    bagCall(bag, tag, value, attrs) {
        return super.bagCall(bag, this.#authoredTag(tag), value, attrs);
    }

    /** Builder's element call from the Proxy on a Source node. */
    commandOnNode(node, tag, value, attrs) {
        return super.commandOnNode(node, this.#authoredTag(tag), value, attrs);
    }

    /** Builder's value check, plus the excluded attributes (authoring names the tag). */
    validateNodeValues(tag, value, attrs = {}) {
        const excluded = excludedAttribute(attrs);
        if (excluded) throw new Error(`${tag}: attribute '${excluded}' is excluded from Gramlot 0.2.0`);
        const error = dataElementError(tag, attrs);
        if (error) throw new Error(`${tag}: ${error}`);
        return super.validateNodeValues(tag, value, attrs);
    }

    /** Builder's node check, plus the excluded attributes (a Source node names tag and label). */
    validateNode(node, options = {}) {
        const excluded = excludedAttribute(options.attrs ?? node.getAttr());
        if (excluded) throw new Error(`${node.nodeTag} '${node.label}': attribute '${excluded}' is excluded from Gramlot 0.2.0`);
        const error = dataElementError(node.nodeTag, options.attrs ?? node.getAttr());
        if (error) throw new Error(`${node.nodeTag} '${node.label}': ${error}`);
        return super.validateNode(node, options);
    }

    /** Builder's child insertion; a plain object `value` of `dataSetter` becomes `new Bag(value)` (P25). */
    setChild(bag, tag, value, attrs, parentOverride = null) {
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
            id = crypto.randomUUID().replaceAll('-', '');
            node.setAttr({__ref: id});
        }
        return {$gramlotRef: id, kind};
    }

    toTytx() { return toTytx(this.source); }
}
