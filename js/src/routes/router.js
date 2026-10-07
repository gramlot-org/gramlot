/* @ts-self-types="./router.d.ts" */
/**
 * `Router`: the single router of a `RoutingClass` instance.
 *
 * @module
 */
import {NotFound} from './errors.js';
import {RouterNode} from './router-node.js';

const CHILDREN = Symbol('gramlot.routes.children');
const PARENT = Symbol('gramlot.routes.parent');

/** The neutral description of one entry: name, doc, parameters, meta and, when a `ReturnValue` was given, its `result` block. */
const describeEntry = ({name, docline = '', signature, meta, result}) => {
    const info = {name, doc: docline, parameters: signature.parameters, meta};
    if (result) info.result = {type: result.type, mediaType: result.mediaType, docline: result.docline};
    return info;
};

/** The router of one instance: the instance, the entries discovered on its class chain, its child branches. */
export class Router {
    constructor(instance, entries) {
        this.instance = instance;
        this.entries = entries;
        this.name = 'route';
        this.defaultEntry = 'index';
        this.description = null;
        this.errors = {not_found: NotFound, signature_error: TypeError};
        this[CHILDREN] = new Map();
    }

    /** Declare child branches: one `{name, instance}` spec, an array or any iterable of them. */
    addBranches(specs) {
        for (const spec of specs?.[Symbol.iterator] ? [...specs] : [specs]) {
            const {name, instance: child} = spec ?? {};
            if (typeof name !== 'string') throw new TypeError('branch: name must be a string');
            if (this[CHILDREN].has(name)) throw new TypeError(`Branch name collision: ${name}`);
            if (Object.keys(spec).some(key => key !== 'name' && key !== 'instance')) {
                throw new TypeError(`Branch '${name}': only the {name, instance} form is supported`);
            }
            if (typeof child !== 'object' || child === null || !(child.route instanceof Router)) {
                throw new TypeError(`Branch '${name}': 'instance' must be a RoutingClass instance`);
            }
            for (let owner = this.instance; owner; owner = owner[PARENT]) {
                if (owner === child) throw new Error(`Branch '${name}': instance is this router's owner or one of its ancestors`);
            }
            if (child[PARENT] && child[PARENT] !== this.instance) {
                throw new Error(`Branch '${name}': instance already bound to another parent`);
            }
            this[CHILDREN].set(name, child.route);
            child[PARENT] ??= this.instance;
        }
    }

    /** The node a path resolves to by best match: entries and branches, else the reached router's `defaultEntry`. */
    node(path) {
        const stripped = path.replace(/^\/+|\/+$/g, '');
        if (!stripped) return new RouterNode(this, {path: '', errors: this.errors});
        const parts = stripped.split('/');
        const pathlist = [];
        let router = this;
        let lastRouter;
        let head;
        while (parts.length && router) {
            lastRouter = router;
            head = parts.shift();
            pathlist.push(head);
            if (router.entries.has(head)) {
                return new RouterNode(router, {entryName: head, partial: parts, path: pathlist.join('/'), errors: this.errors});
            }
            router = router[CHILDREN].get(head);
        }
        if (router) return new RouterNode(router, {path: pathlist.join('/'), errors: this.errors});
        return new RouterNode(lastRouter, {partial: [head, ...parts], path: pathlist.slice(0, -1).join('/'), errors: this.errors});
    }

    /** The tree of this router: `{name, description, ownerDoc, entries, routers}`, `entries` and `routers` omitted when empty, `{}` when both are. */
    nodes() {
        const entries = Object.fromEntries([...this.entries.values()].map(entry => [entry.name, describeEntry(entry)]));
        const routers = {};
        for (const [name, child] of this[CHILDREN]) {
            const tree = child.nodes();
            if (Object.keys(tree).length) routers[name] = tree;
        }
        const hasEntries = Object.keys(entries).length > 0;
        const hasRouters = Object.keys(routers).length > 0;
        if (!hasEntries && !hasRouters) return {};
        const {constructor} = this.instance;
        const tree = {
            name: this.name,
            description: this.description,
            ownerDoc: Object.hasOwn(constructor, 'docline') ? constructor.docline : null,
        };
        if (hasEntries) tree.entries = entries;
        if (hasRouters) tree.routers = routers;
        return tree;
    }
}
