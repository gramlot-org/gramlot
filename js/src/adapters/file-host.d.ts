/**
 * A reference host on one pages folder.
 *
 * @module
 */
import {Host} from './host.js';
import type {HostOptions} from './host.js';
import type {Page} from './page.js';
import type {Resources} from './resources.js';

/**
 * Minimal reference `Host` on one pages folder, with APIs shared by Node.js and Bun. Page path
 * `foo`: the file page `foo.js` first, then the folder page `foo/foo.js`. Beside the page file:
 * `foo.css` and the page logic (the `Logic` export of the page module, or `foo_aux.js`).
 */
export class FileHost extends Host {
    /** Create a host on `pagesDir`. */
    constructor(pagesDir: string, options?: HostOptions);
    /** The absolute pages folder. */
    get pagesDir(): string;
    /** Map `a/b` to `a/b.js`, else `a/b/b.js`, below the real pages folder; or raise `PageNotFound`. */
    locatePage(path: string): Promise<string>;
    /** Import the page module of `path` and return its `Page` export. */
    resolvePage(path: string): Promise<typeof Page>;
    /** `Page.css` URLs as written, then the companion CSS and the page logic. */
    resolveResources(path: string, PageClass: typeof Page): Promise<Resources>;
    /** Root-relative URL of a file below the pages folder; a file that leaves the folder raises. */
    url(filename: string): Promise<string>;
}
