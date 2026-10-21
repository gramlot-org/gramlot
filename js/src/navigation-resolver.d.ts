import {BagResolver} from '@genrojs/bag';
import type {Gramlot} from './gramlot.js';
export class NavigationResolver extends BagResolver {
    constructor(options: {gramlot: Gramlot; method: string; directory: string; onError: (error: Error) => void});
    abort(): void;
}
