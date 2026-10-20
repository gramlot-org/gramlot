/**
 * Conformance check of a running adapter against the server protocol GC-230, over HTTP.
 *
 * @module
 */

/** Run the checks of GC-230 §150 against the adapter at `baseUrl` (mount prefix included) with the page
 * `pagePath`; reject with an `AssertionError` naming the rule of the first failure. `pageTtl` is the `pageTtl`
 * in seconds of the server of the adapter, short for the check to be fast; with it the check also waits for the
 * renewal and the expiry of a page (GC-230 §010), about 2.5 times `pageTtl`, and without it that check is left out. */
export function checkProtocol(baseUrl: string, pagePath: string, options?: {pageTtl?: number | null}): Promise<void>;
