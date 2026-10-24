/* @ts-self-types="./page.d.ts" */
/**
 * Server-side page base class, the `Exposed` base of the classes reached by a method path, and the
 * `registerSource` and `registerEndpoint` markers.
 *
 * @module
 */
import {GramlotBuilder} from '../builder/gramlot-builder.js';
import {NAME_SYNTAX} from '../builder/name-syntax.js';

/** The marker of a Source method and of an endpoint: `{auth}` on the method, as the Python
 * `__gramlot_source__` and `__gramlot_endpoint__` attributes. */
export const SOURCE_METHOD = Symbol('gramlot.source');
export const ENDPOINT_METHOD = Symbol('gramlot.endpoint');
const MARKERS = new Map([[SOURCE_METHOD, 'registerSource'], [ENDPOINT_METHOD, 'registerEndpoint']]);

// The name of a declared method, one segment of NAME_SYNTAX: an ASCII letter, then ASCII letters, digits and `_`.
const DECLARED_NAME = /^[A-Za-z][A-Za-z0-9_]*$/;

function declaredMethod(page, name, marker) {
    if (typeof name !== 'string' || !DECLARED_NAME.test(name)) return null;
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

/**
 * The method a request names, `{instance, method}`, or null; `method` runs with `this` = `instance`.
 * `name` is a method of `page` or a path `a.b.c.method` (NAME_SYNTAX) read from `page`: every segment
 * is a public attribute (a getter runs) whose value is an `Exposed` instance, and the last one is a
 * method declared with `marker` on the class of the object before it. Any other name, an inherited
 * member such as `constructor` included, gives null.
 */
export function resolveDeclared(page, name, marker) {
    if (!NAME_SYNTAX.matches(name)) return null;
    const segments = name.split('.');
    const methodName = segments.pop();
    let instance = page;
    for (const segment of segments) {
        instance = instance[segment];
        if (!(instance instanceof Exposed)) return null;
    }
    const method = declaredMethod(instance, methodName, marker);
    return method ? {instance, method} : null;
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

/**
 * The base of every class whose methods a request names: `Page` and the classes of the objects reached
 * from the page by a method path (`orders.list`). It holds only the markers `registerSource` and
 * `registerEndpoint`; the Python classes need no base, because `@source` and `@endpoint` are functions.
 */
export class Exposed {
    /**
     * Mark the own method `methodName` of this class as a remote Source method,
     * equivalent to Python `@source`; call it after the class.
     *
     * A declared fragment is requested from code with `gramlot.src.remoteSource` (GC-230 §035);
     * the `remote` attribute requests it declaratively (GC-095 §105).
     */
    static registerSource(methodName, {auth = null} = {}) {
        declare(this, methodName, SOURCE_METHOD, auth);
    }

    /** Mark the own method `methodName` of this class as an endpoint called with
     * `contentType: 'data'`, equivalent to Python `@endpoint`; call it after the class. */
    static registerEndpoint(methodName, {auth = null} = {}) {
        declare(this, methodName, ENDPOINT_METHOD, auth);
    }
}

/** Server-side page base; unrelated to browser view components. */
export class Page extends Exposed {
    static gramlots = [];
    static title = 'Gramlot';
    static devices = [];
    static locale = null;
    static timeZone = null;
    static installable = false;
    static appIcon = null;

    /** Default root manifest. appIcon is a 512px square PNG below the app root. */
    manifest({baseUrl = './'} = {}) {
        const {title, appIcon} = this.constructor;
        if (typeof appIcon !== 'string' || !appIcon) throw new TypeError('An installable Page needs appIcon');
        return {id: baseUrl, name: title, short_name: title, start_url: baseUrl,
            scope: baseUrl, display: 'standalone',
            icons: [{src: baseUrl + appIcon.replace(/^\/+/, ''), sizes: '512x512', type: 'image/png'}]};
    }

    static css = [];
    /** The theme of the page: null takes the base theme of the server (GramlotServer cssTheme), a theme name
     * replaces it, false loads no theme. `css` is the CSS added after the theme. */
    static css_theme = null;
    static css_requires = '';
    static js_requires = '';
    static sourceBuilder = GramlotBuilder;

    main(root) {
        throw new Error('Page.main(root) must be implemented');
    }
}
