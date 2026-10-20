/**
 * Server-side page base class, the `Exposed` base of the classes reached by a method path, and the
 * `registerSource` and `registerEndpoint` markers.
 *
 * @module
 */
import type {GramlotBuilder} from '../builder/gramlot-builder.js';

/** The marker of a Source method: `{auth}` on the method. */
export const SOURCE_METHOD: unique symbol;
/** The marker of an endpoint: `{auth}` on the method. */
export const ENDPOINT_METHOD: unique symbol;

/** The registered Source method `name` of `page`, or null. */
export function sourceMethod(page: Page, name: string): Function | null;
/** The registered endpoint `name` of `page`, or null. */
export function endpointMethod(page: Page, name: string): Function | null;
/**
 * The method a request names, or null; `method` runs with `this` = `instance`. `name` is a method of
 * `page` or a path `a.b.c.method` read from `page`: every segment is a public attribute whose value is an
 * `Exposed` instance, and the last one is a method declared with `marker`.
 */
export function resolveDeclared(page: Page, name: string, marker: typeof SOURCE_METHOD | typeof ENDPOINT_METHOD):
    {instance: Exposed, method: Function} | null;

/**
 * The base of every class whose methods a request names: `Page` and the classes of the objects reached
 * from the page by a method path (`orders.list`). It holds only the markers.
 */
export class Exposed {
    /**
     * Mark the own method `methodName` of this class as a remote Source method,
     * equivalent to the Python `@source`; call it after the class. A Source method populates
     * its `root` argument and returns nothing.
     *
     * A declared fragment is requested from code with `gramlot.src.remoteSource` (GC-230 §035);
     * the `remote` attribute requests it declaratively (GC-095 §105).
     */
    static registerSource(methodName: string, options?: {auth?: string | null}): void;
    /** Mark the own method `methodName` of this class as an endpoint called with
     * `contentType: 'data'`, equivalent to the Python `@endpoint`; call it after the class. */
    static registerEndpoint(methodName: string, options?: {auth?: string | null}): void;
}

/** Server-side page base; unrelated to browser view components. */
export class Page extends Exposed {
    /** The title of the page document. */
    static title: string;
    static devices: Array<'desktop' | 'tablet' | 'phone'>;
    static locale: string | null;
    static timeZone: string | null;
    static installable: boolean;
    static appIcon: string | null;
    manifest(options?: {baseUrl?: string}): Record<string, unknown> | Promise<Record<string, unknown>>;
    /** CSS URLs of the page, loaded after its theme. */
    static css: string[];
    /** The theme of the page: null takes the base theme of the server, a theme name replaces it, false loads none. */
    static css_theme: string | false | null;
    /** Comma-separated names of the CSS resources of the page. */
    static css_requires: string;
    /** Comma-separated names of the JS resources of the page. */
    static js_requires: string;
    /** The builder class that authors the Source of the page. */
    static sourceBuilder: typeof GramlotBuilder;
    /** The id of the page, set by the server. */
    pageId?: string;
    /** Populate the `main` Source in `root`; subclasses must implement it. */
    main(root: unknown): void | Promise<void>;
}

export {IndexPage} from "./index-page.js";
export {IndexLogic, mountIndexPage} from "../index-page-runtime.js";
export {ServerAdapter} from "../server-adapter.js";
/** The typed literals a page authors, the same names as in the browser entry point: a Bag, and an exact Decimal
 * made with `createDecimal('12.50')`. A date or a time is a `Date`; TYTX types it from its content. */
export {Bag, BagNode} from "@genrojs/bag";
export {createDecimal} from "@genrojs/tytx";
