import {BagResolver} from '@genrojs/bag';

/** Shared asynchronous cache. Concrete resolvers own scheduling and cancellation. */
export abstract class RemoteResolver extends BagResolver {
    constructor(options: {cacheTime?: number; onError: (error: Error) => void});
    onError: (error: Error) => void;
    loading: Promise<unknown> | null;
    loaded: boolean;
    writing: boolean;
    abstract readonly closed: boolean;
    /** Return cached data immediately; an expired read schedules a refresh. */
    resolve(options?: {static?: boolean}): unknown;
    /** Resolve with the synchronous BagResolver contract. */
    resolveSync(options?: Parameters<BagResolver['resolve']>[0]): unknown;
    /** Null when closed or when the concrete scheduler declines a load. */
    refresh(): Promise<unknown> | null;
    prepareValue(value: unknown): unknown;
}
