/* @ts-self-types="./page.d.ts" */
/**
 * Server-side page base class and the `registerSource` and `registerEndpoint` markers.
 *
 * @module
 */
import {GramlotBuilder} from '../builder/gramlot-builder.js';

/** The marker of a Source method and of an endpoint: `{auth}` on the method, as the Python
 * `__gramlot_source__` and `__gramlot_endpoint__` attributes. */
export const SOURCE_METHOD = Symbol('gramlot.source');
export const ENDPOINT_METHOD = Symbol('gramlot.endpoint');
const MARKERS = new Map([[SOURCE_METHOD, 'registerSource'], [ENDPOINT_METHOD, 'registerEndpoint']]);

function declaredMethod(page, name, marker) {
    if (typeof name !== 'string' || !/^[A-Za-z][\w]*$/.test(name)) return null;
    for (let proto = Object.getPrototypeOf(page); proto; proto = Object.getPrototypeOf(proto)) {
        const descriptor = Object.getOwnPropertyDescriptor(proto, name);
        if (descriptor) return descriptor.value?.[marker] ? descriptor.value : null;
    }
    return null;
}

export function sourceMethod(page, name) {
    return declaredMethod(page, name, SOURCE_METHOD);
}

export function endpointMethod(page, name) {
    return declaredMethod(page, name, ENDPOINT_METHOD);
}

function declare(PageClass, methodName, marker, auth) {
    const register = MARKERS.get(marker);
    if (methodName === 'main') throw new TypeError(`${register} cannot declare main`);
    const method = Object.getOwnPropertyDescriptor(PageClass.prototype, methodName)?.value;
    if (typeof method !== 'function') {
        throw new TypeError(`${register} requires an own method of ${PageClass.name}: ${String(methodName)}`);
    }
    if (method[marker]) {
        throw new TypeError(`${marker === SOURCE_METHOD ? 'Source method' : 'Endpoint'} already registered: ${methodName}`);
    }
    if (method[SOURCE_METHOD] || method[ENDPOINT_METHOD]) {
        throw new TypeError(`${methodName} is declared both as Source method and endpoint`);
    }
    method[marker] = {auth};
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
     * they arrive together with the `remote` grammar attribute.
     */
    static registerSource(methodName, {auth = null} = {}) {
        declare(this, methodName, SOURCE_METHOD, auth);
    }

    /** Mark the own method `methodName` of this page class as an endpoint called with
     * `contentType: 'data'`, equivalent to Python `@endpoint`; call it after the class. */
    static registerEndpoint(methodName, {auth = null} = {}) {
        declare(this, methodName, ENDPOINT_METHOD, auth);
    }
}
