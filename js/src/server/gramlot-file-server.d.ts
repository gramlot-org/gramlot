/**
 * A reference server on one pages folder.
 *
 * @module
 */
import {GramlotServer} from './gramlot-server.js';
import type {GramlotServerOptions} from './gramlot-server.js';
import type {Page} from './page.js';
import type {Resources} from './resources.js';

/** Options of `GramlotFileServer`: those of `GramlotServer` and `reload`. */
export interface GramlotFileServerOptions extends GramlotServerOptions {
    /** Import the page module again when it changes; `null` takes the value from `GRAMLOT_DEV`. */
    reload?: boolean | null;
}

/**
 * Minimal reference `GramlotServer` on one pages folder, with APIs shared by Node.js and Bun. Page path
 * `foo`: the file page `foo.js` first, then the folder page `foo/foo.js`. Beside the page file:
 * `foo.css` and the page logic (the `Logic` export of the page module, or `foo_aux.js`).
 */
export class GramlotFileServer extends GramlotServer {
    /** Create a server on `pagesDir`. */
    constructor(pagesDir: string, options?: GramlotFileServerOptions);
    /** The absolute pages folder. */
    get pagesDir(): string;
    /** Whether the page module is imported again when it changes; resolved in the constructor. */
    reload: boolean;
    /** Map `a/b` to `a/b.js`, else `a/b/b.js`, below the real pages folder; or raise `PageNotFound`. */
    locatePage(path: string): Promise<string>;
    /** Import the page module of `path` and return its `Page` export. */
    resolvePage(path: string): Promise<typeof Page>;
    /** `Page.css` URLs as written, then the companion CSS and the page logic. */
    resolveResources(path: string, PageClass: typeof Page): Promise<Resources>;
    /** Root-relative URL of a file below the pages folder; a file that leaves the folder raises. */
    url(filename: string): Promise<string>;
}
