/**
 * The page utilities of one Gramlot page, grouped by theme (`gramlot.utl`).
 *
 * @module
 */
import type {DomDocument} from '../dom.d.ts';
import type {Gramlot} from '../gramlot.js';
import type {InOut} from '../inout.js';
import {Handler} from './handler.js';

/** Page utilities grouped by theme. */
export class UtilitiesHandler extends Handler {
    /** The `gramlot.utl.inout` object: send, receive, save and download Data branches. */
    inout: InOut;
    /** Create the utilities of `gramlot`. */
    constructor(gramlot: Gramlot, document: DomDocument);
}
