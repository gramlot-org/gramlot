/**
 * Resource names and bootstrap load order; no file lookup and no HTTP engine.
 *
 * @module
 */

/** One segment of a resource or page name. */
export const SEGMENT: RegExp;

/** The Unicode White_Space characters stripped around resource names. */
export const SPACES: string;

/** A page declares its resources in an invalid way. */
export class InvalidResourceName extends Error {
    name: 'InvalidResourceName';
}

/** Parse `css_requires` or `js_requires`: comma-separated resource names, without duplicates. */
export function parseRequires(text: string): string[];

/** The CSS and JS resources of a page. */
export interface Resources {
    /** CSS URLs. */
    css: string[];
    /** JS module URLs with their Logic group. */
    js: {url: string; group: string | null}[];
}

/** The resources with each URL once, in its last position; one JS URL with two groups raises. */
export function loadOrder(resources: Resources): Resources;
