/**
 * The base class of the handlers of a `Gramlot` instance.
 *
 * @module
 */
import type {Gramlot} from '../gramlot.js';

/** A themed proxy of one `Gramlot` instance, holding the reference to it. */
export class Handler {
    /** The page this handler belongs to. */
    gramlot: Gramlot;
    /** Create the handler of `gramlot`. */
    constructor(gramlot: Gramlot);
}
