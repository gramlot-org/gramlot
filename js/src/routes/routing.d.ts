/**
 * `RoutingClass` and `registerRoute`: the base of classes whose methods are reached through routes.
 *
 * @module
 */
import type {Signature, ReturnValue} from './signature.d.ts';
import type {Router, BranchSpec} from './router.d.ts';

/** What `registerRoute` records on the wrapper that replaces a method. */
export interface RouteMarker {
    /** The method as written in the class. */
    original: (kw: Record<string, unknown>) => unknown;
    signature: Signature;
    docline?: string;
    result?: ReturnValue;
    /** The entry name. */
    name: string;
    meta: Record<string, unknown>;
}

/** Options of `registerRoute`. */
export interface RouteOptions {
    /** The declared parameters; no parameters when absent. */
    signature?: Signature;
    docline?: string;
    result?: ReturnValue;
    /** The entry name; the method name when absent. */
    name?: string;
    meta?: Record<string, unknown>;
}

/** A handler result with metadata, e.g. `mediaType`, for the dispatcher that builds the response. */
export class ResultWrapper {
    value: unknown;
    metadata: Record<string, unknown>;
    constructor(value: unknown, metadata: Record<string, unknown>);
}

/** True when `obj` is a `ResultWrapper`. */
export function isResultWrapper(obj: unknown): obj is ResultWrapper;

/** Base class: each instance owns one `Router`, created on first access of `route`. */
export class RoutingClass {
    /**
     * Mark the method `methodName` of this class as a route, called after the class body.
     * The method must be an own method of the class and not already registered, else a TypeError.
     * The method receives one object of named values, checked against the signature, also on a direct call.
     */
    static registerRoute(methodName: string, options?: RouteOptions): void;
    /** The instance's router, created on first access. */
    readonly route: Router;
    /** Declare child branches on this instance's router. */
    addBranches(specs: BranchSpec | Iterable<BranchSpec>): void;
    /** Wrap a handler result with metadata. */
    resultWrapper(value: unknown, metadata?: Record<string, unknown>): ResultWrapper;
}
