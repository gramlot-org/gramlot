/* @ts-self-types="./handler.d.ts" */
/**
 * The base class of the handlers of a `Gramlot` instance.
 *
 * @module
 */

/** A themed proxy of one `Gramlot` instance, holding the reference to it. */
export class Handler {
    constructor(gramlot) {
        this.gramlot = gramlot;
    }
}
