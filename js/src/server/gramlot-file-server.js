/* @ts-self-types="./gramlot-file-server.d.ts" */
/**
 * A reference server on one pages folder.
 *
 * @module
 */
import {realpath, stat} from 'node:fs/promises';
import {basename, dirname, extname, isAbsolute, join, relative, resolve, sep} from 'node:path';
import {pathToFileURL} from 'node:url';
import {gramlotDev} from './assets.js';
import {GramlotServer, PageNotFound} from './gramlot-server.js';
import {InvalidResourceName, SEGMENT, parseRequires} from './resources.js';

const inside = (filename, folder) => {
    const rel = relative(folder, filename);
    return rel === '' || !(rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel));
};

// RFC 3986 unreserved characters stay literal, as with Python urllib.parse.quote(safe='').
const encodeSegment = segment => encodeURIComponent(segment)
    .replace(/[!'()*]/g, character => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);

/** Real path of filename, or null when it does not exist. */
async function realFile(filename) {
    try {
        const real = await realpath(filename);
        return (await stat(real)).isFile() ? real : null;
    } catch (error) {
        if (['ENOENT', 'ENOTDIR'].includes(error.code)) return null;
        throw error;
    }
}

/** Minimal reference GramlotServer on one pages folder, with APIs shared by Node.js and Bun.
 * The Python counterpart is src/gramlot/server/gramlot_file_server.py. Page path foo: the
 * file page foo.js first, then the folder page foo/foo.js; the file wins when both
 * exist. Beside the page file: foo.css (CSS) and foo.md (README). The page logic
 * (group null) is the Logic export of the page module itself, else foo_aux.js
 * (JS module exporting Logic); both at once raise an Error. The page module then
 * reaches the browser, so its imports must resolve there too. The _aux suffix is
 * reserved. There are
 * no resource levels: a name in css_requires/js_requires raises
 * InvalidResourceName. Modules are trusted ESM application files. Without reload
 * the runtime module cache applies, keyed by the real path
 * of the page module; with reload the page module is imported again
 * when its modification time changes. reload null takes the value from GRAMLOT_DEV
 * (true for YES and DEBUG, false when unset); an explicit boolean wins.
 */
export class GramlotFileServer extends GramlotServer {
    constructor(pagesDir, {reload = null, ...options} = {}) {
        super(options);
        this._pagesDir = resolve(pagesDir);
        this.reload = reload ?? gramlotDev() !== null;
    }

    get pagesDir() { return this._pagesDir; }

    /** The import URL of a page module from its real path, so a symlinked page runs once;
     * with reload it carries the modification time. */
    async _moduleUrl(pageFile) {
        const real = await realpath(pageFile);
        const url = pathToFileURL(real).href;
        return this.reload ? `${url}?v=${(await stat(real)).mtimeMs}` : url;
    }

    /** Map a/b to a/b.js, else a/b/b.js, below the real pages folder. */
    async locatePage(path) {
        const trimmed = path.replace(/^\/+|\/+$/g, '');
        const parts = trimmed ? trimmed.split('/') : ['index'];
        if (parts.some(part => !SEGMENT.test(part)) || parts.at(-1).endsWith('_aux')) {
            throw new PageNotFound('Invalid page path');
        }
        let root;
        try {
            root = await realpath(this.pagesDir);
        } catch (error) {
            if (['ENOENT', 'ENOTDIR'].includes(error.code)) throw new PageNotFound('Page not found');
            throw error;
        }
        const name = `${parts.at(-1)}.js`;
        for (const candidate of [join(root, ...parts.slice(0, -1), name), join(root, ...parts, name)]) {
            const real = await realFile(candidate);
            if (real && inside(real, root)) return candidate;
        }
        throw new PageNotFound('Page not found');
    }

    async resolvePage(path) {
        return (await import(await this._moduleUrl(await this.locatePage(path)))).Page;
    }

    /** Page.css URLs as written, then the companion foo.css and the page logic. */
    async resolveResources(path, PageClass) {
        if (parseRequires(PageClass.css_requires).length || parseRequires(PageClass.js_requires).length) {
            throw new InvalidResourceName('requires need a GramlotServer with a resource system');
        }
        const pageFile = await this.locatePage(path);
        const stem = join(dirname(pageFile), basename(pageFile, extname(pageFile)));
        const css = [...PageClass.css], js = [];
        if (await realFile(`${stem}.css`)) css.push(await this.url(`${stem}.css`));
        const logic = [];
        // The module is already in the runtime cache: resolvePage imported it with the same URL.
        if ('Logic' in await import(await this._moduleUrl(pageFile))) logic.push(await this.url(pageFile));
        if (await realFile(`${stem}_aux.js`)) logic.push(await this.url(`${stem}_aux.js`));
        if (logic.length === 2) throw new Error(`Two logic modules for one page: ${logic.join(' and ')}`);
        if (logic.length) js.push({url: logic[0], group: null});
        return {css, js};
    }

    /** Root-relative URL of a file below the pages folder, one encoded segment per
     * folder; a file whose real path leaves the folder raises an Error. */
    async url(filename) {
        const root = await realpath(this.pagesDir);
        const parts = relative(root, filename).split(sep);
        if (!inside(await realpath(filename), root)) {
            throw new Error(`Resource leaves the pages folder: ${parts.join('/')}`);
        }
        return '/' + parts.map(encodeSegment).join('/');
    }
}
