/**
 * Server-side page base class and the `registerSource` and `registerEndpoint` markers.
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

/** Server-side page base; unrelated to browser view components. */
export class Page {
    /** The title of the page document. */
    static title: string;
    /** CSS URLs of the page. */
    static css: string[];
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
    /**
     * Mark the own method `methodName` of this page class as a remote Source method,
     * equivalent to the Python `@source`; call it after the class. A Source method populates
     * its `root` argument and returns nothing.
     *
     * Source methods (`@source`, `registerSource`, `remoteSource`) are not yet part of the page-writing API:
     * they arrive together with the `remote` grammar attribute.
     */
    static registerSource(methodName: string, options?: {auth?: string | null}): void;
    /** Mark the own method `methodName` of this page class as an endpoint called with
     * `contentType: 'data'`, equivalent to the Python `@endpoint`; call it after the class. */
    static registerEndpoint(methodName: string, options?: {auth?: string | null}): void;
}
