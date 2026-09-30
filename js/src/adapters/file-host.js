import {realpath, stat} from 'node:fs/promises';
import {basename, dirname, extname, isAbsolute, join, relative, resolve, sep} from 'node:path';
import {pathToFileURL} from 'node:url';
import {Host, PageNotFound} from './host.js';
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

/** Minimal reference Host on one pages folder, with APIs shared by Node.js and Bun.
 * The Python counterpart is src/gramlot/server/file_host.py. Page path foo: the
 * file page foo.js first, then the folder page foo/foo.js; the file wins when both
 * exist. Beside the page file: foo.css (CSS), foo_aux.js (JS module exporting
 * Logic, group null) and foo.md (README). The _aux suffix is reserved. There are
 * no resource levels: a name in css_requires/js_requires raises
 * InvalidResourceName. Modules are trusted ESM application files; runtime module
 * caching applies.
 */
export class FileHost extends Host {
    constructor(pagesDir, options = {}) {
        super(options);
        this._pagesDir = resolve(pagesDir);
    }

    get pagesDir() { return this._pagesDir; }

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
        return (await import(pathToFileURL(await this.locatePage(path)).href)).Page;
    }

    /** Page.css URLs as written, then the companions foo.css and foo_aux.js. */
    async resolveResources(path, PageClass) {
        if (parseRequires(PageClass.css_requires).length || parseRequires(PageClass.js_requires).length) {
            throw new InvalidResourceName('requires need a Host with a resource system');
        }
        const pageFile = await this.locatePage(path);
        const stem = join(dirname(pageFile), basename(pageFile, extname(pageFile)));
        const css = [...PageClass.css], js = [];
        if (await realFile(`${stem}.css`)) css.push(await this.url(`${stem}.css`));
        if (await realFile(`${stem}_aux.js`)) js.push({url: await this.url(`${stem}_aux.js`), group: null});
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
