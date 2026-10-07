/* @ts-self-types="./routing.d.ts" */
/**
 * `RoutingClass` and `registerRoute`: the base of classes whose methods are reached through routes.
 *
 * @module
 */
import {Signature} from './signature.js';
import {Router} from './router.js';

const MARKER = Symbol('gramlot.routes.marker');
const ROUTER = Symbol('gramlot.routes.router');

/** Walk from the instance's prototype to `RoutingClass.prototype`: the first own property of a name decides. */
const discoverEntries = instance => {
    const entries = new Map();
    const seen = new Set();
    for (let proto = Object.getPrototypeOf(instance); proto; proto = Object.getPrototypeOf(proto)) {
        const own = new Map();
        for (const name of Object.getOwnPropertyNames(proto)) {
            if (seen.has(name)) continue;
            seen.add(name);
            const marker = Object.getOwnPropertyDescriptor(proto, name).value?.[MARKER];
            if (!marker) continue;
            if (own.has(marker.name)) throw new Error(`handler name collision: '${marker.name}'`);
            own.set(marker.name, marker);
        }
        for (const [name, marker] of own) if (!entries.has(name)) entries.set(name, marker);
        if (proto === RoutingClass.prototype) break;
    }
    return entries;
};

/** A handler result with metadata, e.g. `mediaType`, for the dispatcher that builds the response. */
export class ResultWrapper {
    constructor(value, metadata) {
        this.value = value;
        this.metadata = metadata;
    }
}

/** True when `obj` is a `ResultWrapper`. */
export const isResultWrapper = obj => obj instanceof ResultWrapper;

/** Base class: each instance owns one `Router`, created on first access of `route`. */
export class RoutingClass {
    /** Mark the method `methodName` of this class as a route, called after the class body. */
    static registerRoute(methodName, {signature = new Signature(), docline, result, name, meta = {}} = {}) {
        const original = Object.hasOwn(this.prototype, methodName) ? this.prototype[methodName] : undefined;
        if (typeof original !== 'function') {
            throw new TypeError(`registerRoute: '${methodName}' is not a method of ${this.name}`);
        }
        if (original[MARKER]) throw new TypeError(`registerRoute applied twice to '${methodName}'`);
        const wrapper = function (kw = {}) {
            return original.call(this, signature.bind(kw));
        };
        wrapper[MARKER] = {original, signature, docline, result, name: name ?? methodName, meta};
        Object.defineProperty(this.prototype, methodName, {value: wrapper, writable: true, configurable: true});
    }

    /** The instance's router, created on first access. */
    get route() {
        this[ROUTER] ??= new Router(this, discoverEntries(this));
        return this[ROUTER];
    }

    /** Declare child branches on this instance's router. */
    addBranches(specs) {
        return this.route.addBranches(specs);
    }

    /** Wrap a handler result with metadata. */
    resultWrapper(value, metadata = {}) {
        return new ResultWrapper(value, metadata);
    }
}
