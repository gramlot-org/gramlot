/**
 * Exceptions raised by routed calls.
 *
 * @module
 */

/** A path that reaches no callable entry; `selector` is `routerName:path` or the router name alone. */
export class NotFound extends Error {
    /** `routerName:path`, or the router name alone for an empty path. */
    selector: string;
    constructor(selector: string, options?: ErrorOptions);
}
