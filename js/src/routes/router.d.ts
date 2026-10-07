/**
 * `Router`: the single router of a `RoutingClass` instance.
 *
 * @module
 */
import type {RoutingClass, RouteMarker} from './routing.d.ts';
import type {Parameter, ParameterSpec, TytxCode} from './signature.d.ts';
import type {RouterNode} from './router-node.d.ts';

/** A child branch: an already-built `RoutingClass` instance under a name. */
export interface BranchSpec {
    name: string;
    instance: RoutingClass;
}

/** Error code to the exception class a `RouterNode` call raises. */
export interface RouterErrors {
    not_found: new (selector: string, options?: ErrorOptions) => Error;
    signature_error: new (selector: string, options?: ErrorOptions) => Error;
}

/** One entry of the `nodes()` tree. */
export interface EntryInfo {
    name: string;
    /** The `docline` option; `''` when absent. */
    doc: string;
    parameters: Parameter[];
    meta: Record<string, unknown>;
    /** Present only when a `ReturnValue` was given. */
    result?: {type?: TytxCode | Record<string, ParameterSpec>; mediaType?: string; docline?: string};
}

/** The tree `nodes()` returns; `{}` when the router has neither entries nor non-empty branches. */
export interface RouterTree {
    name?: string;
    description?: string | null;
    /** The static `docline` of the instance's class; `null` when absent. */
    ownerDoc?: string | null;
    entries?: Record<string, EntryInfo>;
    routers?: Record<string, RouterTree>;
}

/** The router of one instance: the instance, the entries discovered on its class chain, its child branches. */
export class Router {
    /** The instance this router belongs to. */
    instance: RoutingClass;
    /** Entry name to the marker of the registered method. */
    entries: Map<string, RouteMarker>;
    /** The router name used in error selectors: `'route'`. */
    name: string;
    /** The entry a path ending on this router resolves to: `'index'` by default. */
    defaultEntry: string;
    /** Free text shown by `nodes()`; `null` by default. */
    description: string | null;
    /** Error code to exception class, applied to every path `node()` resolves from this router; `signature_error` defaults to TypeError, which re-raises the bind error. */
    errors: RouterErrors;
    constructor(instance: RoutingClass, entries: Map<string, RouteMarker>);
    /**
     * Declare child branches: one `{name, instance}` spec, an array or any iterable of them.
     * A non-string or duplicate name, another form or a non-`RoutingClass` instance raise a TypeError;
     * an instance bound to another parent, or that is this router's owner or one of its ancestors, raises an Error.
     */
    addBranches(specs: BranchSpec | Iterable<BranchSpec>): void;
    /** The node a path resolves to by best match: entries and branches, else the reached router's `defaultEntry`. */
    node(path: string): RouterNode;
    /** The tree of this router; `entries` and `routers` are omitted when empty. */
    nodes(): RouterTree;
}
