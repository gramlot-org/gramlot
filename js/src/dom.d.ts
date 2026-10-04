/**
 * Loose names for the browser DOM objects that Gramlot receives and returns. A JSR package may not
 * reference the `dom` library, so these are typed as `any` here; in a browser they are the objects
 * of the same name.
 *
 * @module
 */

// deno-lint-ignore no-explicit-any
/** A browser `Document`. */
export type DomDocument = any;
// deno-lint-ignore no-explicit-any
/** A browser `Element`. */
export type DomElement = any;
// deno-lint-ignore no-explicit-any
/** A browser `Node`. */
export type DomNode = any;
// deno-lint-ignore no-explicit-any
/** A browser `DocumentFragment`. */
export type DomFragment = any;
/** The part of a browser `Navigator` that sends the close beacon. */
export interface BeaconNavigator {
    /** Queue `data` for delivery to `url`; returns false when the browser refuses it. */
    sendBeacon(url: string, data?: unknown): boolean;
}
