import {Bag} from '@genrojs/bag';
import {META_ATTRS, SourceBag} from '@genrojs/builders';
import {isExpression, withoutBindingAttributes} from '../renderer/attributes.js';
import {GramlotBuilder} from '../builder/gramlot-builder.js';
import {pointerTransform} from '@genrojs/builders';
import {resolvePointerAttribute} from './pointer.js';

/**
 * Installation of the `dataSetter`s and of the defaults of one Source branch (source plan §4.6,
 * §5.1 steps 2-3): A2, R1, R17, D1a with P15, `attr_*`.
 *
 * The installer writes the document Data directly with `data.setItem` and `setAttr`, because R1
 * distinguishes the value from the attributes. A `dataSetter` is literal: value and attributes are
 * written as authored, no pointer, `==` expression or template is resolved.
 */
export class DataInstaller {
    #runtime;

    constructor(runtime) {
        this.#runtime = runtime;
    }

    get runtime() { return this.#runtime; }

    /**
     * Steps 2-3 of §5.1 on `branch` (a SourceBagNode or a SourceBag): the installation rules of
     * `requireInstallable` are checked first (a candidate of `mountMainSource` or `remoteSource` was
     * already checked at step 1; a branch inserted by a Source event is checked here, before any
     * write), then every `dataSetter` in document order, then the defaults of the visual nodes.
     * A processed setter is consumed: close its binding and remove it from Source immediately
     * after the Data write. The renderer ignores this deletion.
     */
    install(branch) {
        const nodes = branchNodes(branch);
        const setters = this.setterNodes(branch);
        requireInstallable(branch);
        for (const node of setters) {
            this.applySetter(node);
            this.runtime.closeBranch(node);
            if (node.parentBag) node.parentBag.popNode(node.label);
        }
        this.applyDefaults(nodes.filter(node => node.nodeTag && !node._getMeta('data_element')));
    }

    /** The `dataSetter` nodes of `branch`, in document order, parent before children. */
    setterNodes(branch) {
        return branchNodes(branch).filter(node => node.nodeTag === 'dataSetter');
    }

    /**
     * R1 on one `dataSetter`; a null path (Q7) skips it. A `destination_path` written as a pointer
     * loses its symbol with the `_path` warning. A Bag payload leaves the Source node silently.
     */
    applySetter(node) {
        const path = node.absDatapath(node.pathAttribute('destination_path'));
        if (path === null) return;
        const value = node.getAttr('value') ?? null;
        const attrs = setterAttributes(node.getAttr());
        const data = this.runtime.data;
        if (value !== null) {
            data.setItem(path, value, attrs, '>', false, true, node);
            if (value instanceof Bag) node.setAttr({value: null}, false);
        } else {
            const existing = data.getNode(path);
            if (existing) {
                if (attrs) existing.setAttr(attrs, true);
            } else {
                data.setItem(path, null, attrs, '>', false, true, node);
            }
        }
    }

    /**
     * D1a with P15, node by node in document order: each `^`/`=` pointer of an attribute with a
     * default is written only when its Data is empty (null or missing path; `false`, `0`, `''` are
     * values). `default_value` wins over `default` for `value`. The `attr_*` of a node come after
     * that node's defaults.
     */
    applyDefaults(nodes) {
        for (const node of nodes) {
            const attrs = node.getAttr();
            for (const [name, pointer] of Object.entries(attrs)) {
                if (!defaultTarget(node, name, pointer)) continue;
                const fallback = name === 'value' ? attrs.default_value ?? attrs.default : attrs[`default_${name}`];
                if (fallback === null || fallback === undefined) continue;
                this.#applyDefault(node, pointer, fallback);
            }
            this.#applyDataAttributes(node, attrs);
        }
    }

    /** Write `fallback` at the pointer of `node` when the Data there is empty. */
    #applyDefault(node, pointer, fallback) {
        const absolute = node.absDatapath(pointer);
        if (absolute === null) return;
        const [path, attr = null] = absolute.split('?', 2);
        const data = this.runtime.data;
        const existing = data.getNode(path);
        if (attr === null) {
            if (existing && existing.value !== null && existing.value !== undefined) return;
            data.setItem(path, fallback, null, '>', false, true, node);
        } else if (existing) {
            const current = existing.getAttr(attr);
            if (current === null || current === undefined) existing.setAttr({[attr]: fallback}, true);
        } else {
            data.setItem(path, null, {[attr]: fallback}, '>', false, true, node);
        }
    }

    /**
     * `attr_<name>=v` sets the attribute `<name>` on the Data node of the `value` pointer (or `src`),
     * only when that Data node exists, with no emptiness check; a pointer `v` is resolved on `node`.
     */
    #applyDataAttributes(node, attrs) {
        const special = {};
        for (const [name, value] of Object.entries(attrs)) {
            if (name.startsWith('attr_')) {
                special[name.slice(5)] = pointerTransform(value) ? resolvePointerAttribute(node, name)
                    : node.pointerType(value) ? node.getRelativeData(value) : value;
            }
        }
        if (!Object.keys(special).length) return;
        const pointer = [attrs.value, attrs.src].find(value => node.pointerType(value));
        if (!pointer) return;
        const absolute = node.absDatapath(pointer);
        if (absolute === null) return;
        this.runtime.data.getNode(absolute.split('?', 1)[0])?.setAttr(special, true, true, false);
    }
}

// Names never scanned for a default: structural attributes, the defaults and `attr_*` themselves,
// and the attributes ending in `_path`, which hold a bare path.
function defaultTarget(node, name, value) {
    if (name === '_meta' || META_ATTRS.has(name) || name === 'default' || name.startsWith('default_')) return false;
    if (name.startsWith('attr_') || name.endsWith('_path')) return false;
    return node.pointerType(value) !== null;
}

/**
 * The attributes a `dataSetter` puts on its Data node, or null when it declares none: the metadata,
 * the binding attributes, every key starting with `_`, `destination_path`, `value` and the null
 * values (R17) are excluded.
 */
function setterAttributes(attr) {
    const kept = {};
    for (const [name, value] of Object.entries(withoutBindingAttributes(attr ?? {}))) {
        if (META_ATTRS.has(name) || name.startsWith('_') || name === 'destination_path' || name === 'value') continue;
        if (value === null || value === undefined) continue;
        kept[name] = value;
    }
    return Object.keys(kept).length ? kept : null;
}

/** A `dataSetter` of another dialect (inside `svg`) has Builder's grammar, not Gramlot's: an error before any write. */
function requireGramlotSetter(node) {
    const builder = node.builder;
    if (builder instanceof GramlotBuilder) return;
    throw new Error(`dataSetter '${node.label}': dataSetter is not supported inside ${builder.constructor._name}`);
}

/**
 * The installation rules of a branch (a SourceBagNode or a SourceBag), checked without effects: a
 * `dataSetter` of another dialect and a misplaced or invalid provider attribute are errors. Step 1 of
 * §5.1 runs it on a candidate (`GramlotRenderer.validateCandidate`), so a failure leaves the Source
 * as it was; `install` runs it on a branch inserted by a Source event.
 */
export function requireInstallable(branch) {
    for (const node of branchNodes(branch)) {
        if (node.nodeTag === 'dataSetter') requireGramlotSetter(node);
        requireProviderAttributes(node);
    }
}

// Provider attributes (§4.8): only a `dataFormula`, a `dataController`, a `dataRpc` or a `dataRemote`
// carries them; the lifecycle attributes not a `dataRemote`, whose resolver loads when its Data is read;
// `_onResult` and `_onError` only a `dataRpc`, `_onCalling` a `dataRpc`, a `dataRemote` or a node whose
// `remote` is a string. `_delay` also belongs to Gramlot buttons and rendered ancestors that supply their
// inherited click delay; `_delay`, `_timing` and `_userChanges` also to a node whose `remote` is a string.
const PROVIDER_ATTRIBUTES = ['_init', '_onStart', '_onBuilt', '_delay', '_timing', '_userChanges'];
const PROVIDER_TAGS = new Set(['dataFormula', 'dataController', 'dataRpc', 'dataRemote']);
const RPC_ATTRIBUTES = ['_onCalling', '_onResult', '_onError'];
const REMOTE_TRIGGER_ATTRIBUTES = ['_delay', '_timing', '_userChanges'];
// The lifecycle attributes: true, false, null or a number (a delay in ms, P22); a pointer is not read.
const LIFECYCLE_ATTRIBUTES = ['_init', '_onBuilt', '_onStart'];

/**
 * A provider attribute on any other node is an error before any write, and so is an rpc callback
 * outside a `dataRpc` and a lifecycle attribute on a `dataRemote`; so is a `==` expression in an
 * attribute of a provider node (S09: `==` belongs to the visual nodes), and a lifecycle attribute
 * whose value is not `true`, `false`, null or a number.
 */
function requireProviderAttributes(node) {
    const isSet = name => node.getAttr(name) !== null && node.getAttr(name) !== undefined;
    // A rendered node with a string `remote` has a RemoteBinding (NodeBinding.registerPointers).
    const remote = !node._getMeta('data_element') && typeof node.getAttr('remote') === 'string';
    if (node.nodeTag !== 'dataRpc') {
        const callback = RPC_ATTRIBUTES.find(name => isSet(name)
            && !(name === '_onCalling' && (node.nodeTag === 'dataRemote' || remote)));
        if (callback) {
            const owners = callback === '_onCalling' ? 'dataRpc, dataRemote and remote' : 'dataRpc';
            throw new Error(`${node.nodeTag ?? 'fragment'} '${node.label}': '${callback}' is allowed only on ${owners}`);
        }
    }
    if (PROVIDER_TAGS.has(node.nodeTag)) {
        const expression = Object.entries(node.getAttr()).find(([, value]) => isExpression(value));
        if (expression) {
            throw new Error(`${node.nodeTag} '${node.label}': '${expression[0]}' is a == expression, not accepted on ${node.nodeTag}`);
        }
        const lifecycle = node.nodeTag === 'dataRemote' ? LIFECYCLE_ATTRIBUTES.find(isSet) : null;
        if (lifecycle) {
            throw new Error(`dataRemote '${node.label}': '${lifecycle}' is not accepted on dataRemote, `
                + 'its resolver loads when the Data is read');
        }
        for (const name of LIFECYCLE_ATTRIBUTES) {
            const value = node.getAttr(name);
            if (value === null || value === undefined || typeof value === 'boolean' || typeof value === 'number') continue;
            throw new Error(`${node.nodeTag} '${node.label}': '${name}' accepts true, false, null or a number, `
                + `not ${JSON.stringify(value)}`);
        }
        return;
    }
    const name = PROVIDER_ATTRIBUTES.find(name => isSet(name)
        && !(name === '_delay' && !node._getMeta('data_element') && node.nodeTag !== 'html_button')
        && !(remote && REMOTE_TRIGGER_ATTRIBUTES.includes(name)));
    if (!name) return;
    const tags = LIFECYCLE_ATTRIBUTES.includes(name) ? 'dataFormula, dataController and dataRpc'
        : 'dataFormula, dataController, dataRpc and dataRemote';
    throw new Error(`${node.nodeTag ?? 'fragment'} '${node.label}': '${name}' is allowed only on ${tags}`);
}

/** The nodes of `branch` (a SourceBagNode or a SourceBag), depth first, in document order. */
function branchNodes(branch) {
    if (branch instanceof SourceBag) return branch.getNodes().flatMap(node => branchNodes(node));
    const nodes = [branch];
    if (branch.value instanceof SourceBag) nodes.push(...branchNodes(branch.value));
    return nodes;
}
