/* @ts-self-types="./page.d.ts" */
/**
 * Server-side page base class and the `registerSource` marker.
 *
 * @module
 */
import {GramlotBuilder} from '../builder/gramlot-builder.js';

const SOURCE_METHOD = Symbol('gramlot.source');

export function sourceMethod(page, name) {
    if (typeof name !== 'string' || !/^[A-Za-z][\w]*$/.test(name)) return null;
    for (let proto = Object.getPrototypeOf(page); proto; proto = Object.getPrototypeOf(proto)) {
        const descriptor = Object.getOwnPropertyDescriptor(proto, name);
        if (descriptor) return descriptor.value?.[SOURCE_METHOD] ? descriptor.value : null;
    }
    return null;
}

/** Server-side page base; unrelated to browser view components. */
export class Page {
    static title = 'Gramlot';
    static css = [];
    static css_requires = '';
    static js_requires = '';
    static sourceBuilder = GramlotBuilder;

    main(root) {
        throw new Error('Page.main(root) must be implemented');
    }

    /**
     * Mark the own method `methodName` of this page class as a remote Source method,
     * equivalent to Python `@source`; call it after the class.
     *
     * Source methods (`@source`, `registerSource`, `remoteSource`) are not yet part of the page-writing API:
     * they arrive together with the `remote` grammar attribute and `@endpoint`.
     */
    static registerSource(methodName) {
        const method = Object.getOwnPropertyDescriptor(this.prototype, methodName)?.value;
        if (typeof method !== 'function') {
            throw new TypeError(`registerSource requires an own method of ${this.name}: ${String(methodName)}`);
        }
        if (method[SOURCE_METHOD]) throw new TypeError(`Source method already registered: ${methodName}`);
        method[SOURCE_METHOD] = true;
    }
}
