/**
 * File lookup of the Node.js and Bun servers, shared by `GramlotServer` (the core themes) and
 * `GramlotFileServer` (the pages folder). The Python counterpart is src/gramlot/server/files.py.
 * It imports Node.js modules: `GramlotServer` loads it on first use, so the Worker bundle of the
 * neutral server holds no Node.js import.
 *
 * @module
 */
import {realpath, stat} from 'node:fs/promises';
import {isAbsolute, join, relative, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

/** The themes folder of the installed core (the `themes` folder of the npm package). */
export const THEMES = fileURLToPath(new URL('../../themes/', import.meta.url));

/** Whether `filename` is `folder` or below it. */
export const inside = (filename, folder) => {
    const rel = relative(folder, filename);
    return rel === '' || !(rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel));
};

/** Real path of filename, or null when it does not exist. */
export async function realFile(filename) {
    try {
        const real = await realpath(filename);
        return (await stat(real)).isFile() ? real : null;
    } catch (error) {
        if (['ENOENT', 'ENOTDIR'].includes(error.code)) return null;
        throw error;
    }
}

/** The real path of the `/`-separated `path` below `folder` when it is a file whose real path stays inside the
 * real `folder`, else null; a path with a NUL character names no file. */
export async function fileBelow(folder, path) {
    if (path.includes('\0')) return null;
    const root = await realpath(folder);
    const real = await realFile(join(root, ...path.split('/').filter(Boolean)));
    return real && inside(real, root) ? real : null;
}
