import type {Bag} from '@genrojs/bag';
import {RemoteResolver} from './binding/remote-resolver.js';
import type {Gramlot} from './gramlot.js';
export class NavigationResolver extends RemoteResolver {
    constructor(options: {gramlot: Gramlot; method: string; directory: string; onError: (error: Error) => void});
    gramlot: Gramlot;
    method: string;
    params: {directory: string};
    children: Set<NavigationResolver>;
    readonly closed: boolean;
    loading: Promise<Bag | undefined> | null;
    prepareValue(bag: Bag): Bag;
    resolve(options?: {static?: boolean}): Bag | null;
    refresh(): Promise<Bag | undefined> | null;
    startLoad(perform: (request: {controller: AbortController; method: string; params: {directory: string}; ignored: boolean}) => Promise<unknown>): Promise<unknown>;
    loadAsync(request: {controller: AbortController; method: string; params: {directory: string}}): Promise<unknown>;
    abort(): void;
}
