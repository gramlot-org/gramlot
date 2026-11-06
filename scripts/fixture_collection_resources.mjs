/** Static shipped collection assets for loopback-only core qualification hosts. */
import {readFile} from 'node:fs/promises';
import {resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {standardCollections} from '../js/dist/standard-collections.js';
const bases = standardCollections.map(collection => ({
    url: collection.module.slice(0, collection.module.lastIndexOf('/assets/') + 8),
    folder: fileURLToPath(new URL(`../src/gramlot/collections/${collection.name}/assets/`, import.meta.url)),
}));
export async function fixtureCollectionResource(path) {
    const base = bases.find(base => path.startsWith(base.url));
    if (!base) return null;
    const filename = resolve(base.folder, path.slice(base.url.length));
    if (!filename.startsWith(resolve(base.folder) + sep)) return null;
    return readFile(filename);
}
