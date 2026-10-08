/**
 * Conformance check of a running adapter against the server protocol GC-230, over HTTP.
 *
 * @module
 */

/** Run the checks of GC-230 §055 against the adapter at `baseUrl` (mount prefix included) with the page
 * `pagePath`; reject with an `AssertionError` naming the rule of the first failure. */
export function checkProtocol(baseUrl: string, pagePath: string): Promise<void>;
