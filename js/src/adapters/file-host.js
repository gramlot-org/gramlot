import {realpath, stat} from 'node:fs/promises';
import {resolve, relative, isAbsolute} from 'node:path';
import {pathToFileURL} from 'node:url';
import {Host, PageNotFound} from './host.js';

/** Optional filesystem loader using APIs shared by Node.js and Bun.
 * Modules are trusted ESM application files. Runtime module caching applies.
 */
export class FileHost extends Host {
    constructor(pagesDirectory, options = {}) {
        super(options);
        this.pagesDirectory = resolve(pagesDirectory);
    }

    async resolvePage(path) {
        const parts = path.replace(/^\/+|\/+$/g, '').split('/');
        if (parts.length === 1 && !parts[0]) parts[0] = 'index';
        if (parts.some(part => !/^[\p{ID_Start}][\p{ID_Continue}]*$/u.test(part) || part.startsWith('_'))) {
            throw new PageNotFound('Invalid page path');
        }
        let filename;
        try {
            const root = await realpath(this.pagesDirectory);
            filename = await realpath(resolve(root, ...parts) + '.js');
            const rel = relative(root, filename);
            if (rel === '..' || rel.startsWith('../') || rel.startsWith('..\\') || isAbsolute(rel) ||
                !(await stat(filename)).isFile()) throw new PageNotFound('Page not found');
        } catch (error) {
            if (error instanceof PageNotFound || ['ENOENT', 'ENOTDIR'].includes(error.code)) {
                throw new PageNotFound('Page not found');
            }
            throw error;
        }
        return (await import(pathToFileURL(filename).href)).Page;
    }
}
