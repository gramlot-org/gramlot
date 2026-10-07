/* @ts-self-types="./utilities-handler.d.ts" */
/**
 * The page utilities of one Gramlot page, grouped by theme (`gramlot.utl`).
 *
 * @module
 */
import {Handler} from './handler.js';
import {InOut} from '../inout.js';

/** Page utilities grouped by theme. */
export class UtilitiesHandler extends Handler {
    constructor(gramlot, document) {
        super(gramlot);
        this.inout = new InOut(gramlot, document);
    }
}
