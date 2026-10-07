/**
 * `RouterNode`: the target a path resolves to, called with `call(kw)`.
 *
 * @module
 */
import type {Router} from './router.d.ts';
import type {ReturnValue} from './signature.d.ts';

/** Options of the `RouterNode` constructor. */
export interface RouterNodeOptions {
    /** The entry to resolve; the router's `defaultEntry` when absent. */
    entryName?: string;
    /** The resolved path. */
    path?: string | null;
    /** The path segments not consumed by the walk. */
    partial?: string[];
}

/** What `RouterNode.metadata` returns for a node with an entry. */
export interface RouterNodeMetadata {
    name: string;
    docline?: string;
    meta: Record<string, unknown>;
    result?: ReturnValue;
}

/** The entry a path resolves to, with the unconsumed segments assigned to its parameters. */
export class RouterNode {
    constructor(router: Router, options?: RouterNodeOptions);
    /** The router owning the entry. */
    router: Router;
    /** The resolved path. */
    path: string | null;
    /** `null` when the node is callable, else the error code (`'not_found'`). */
    error: string | null;
    /** `name`, `docline`, `meta` and `result` of the entry; empty when the node has no entry. */
    readonly metadata: RouterNodeMetadata | Record<string, never>;
    /**
     * Invoke the entry with `kw` and the segment values (the path wins over `kw`); returns the handler result as is.
     * A node with an error raises the class mapped in `errors` of the router `node()` was called on; arguments that do not fit the signature raise
     * its `signature_error` (TypeError by default). An exception from the handler propagates untouched.
     */
    call(kw?: Record<string, unknown>): unknown;
}
