/* @ts-self-types="./errors.d.ts" */
/**
 * Exceptions raised by routed calls.
 *
 * @module
 */

/** A path that reaches no callable entry; `selector` is `routerName:path` or the router name alone. */
export class NotFound extends Error {
    constructor(selector, options) {
        super(`Entry '${selector}' not found`, options);
        this.name = 'NotFound';
        this.selector = selector;
    }
}
