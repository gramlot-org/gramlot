import {GramlotBuilder} from '../builder/gramlot-builder.js';

const SOURCE_METHOD = Symbol('gramlot.source');

/** Explicit method registration, equivalent to Python @source without syntax transforms. */
export function source(method) {
    if (typeof method !== 'function') throw new TypeError('source requires a method');
    method[SOURCE_METHOD] = true;
    return method;
}

export function sourceMethod(page, name) {
    if (typeof name !== 'string' || !/^[A-Za-z][\w]*$/.test(name)) return null;
    for (let proto = Object.getPrototypeOf(page); proto; proto = Object.getPrototypeOf(proto)) {
        const descriptor = Object.getOwnPropertyDescriptor(proto, name);
        if (descriptor) return descriptor.value?.[SOURCE_METHOD] ? descriptor.value : null;
    }
    return null;
}

/** Host-side page base; unrelated to browser view components. */
export class Page {
    static title = 'Gramlot';
    static css = [];
    static sourceBuilder = GramlotBuilder;

    main(root) {
        throw new Error('Page.main(root) must be implemented');
    }
}
