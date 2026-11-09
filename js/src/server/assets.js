/* @ts-self-types="./assets.d.ts" */
import {standardCollections} from '../../dist/standard-collections.js';
import {declaredCollections} from '../../dist/declared-collections.js';
/**
 * Development mode and the runtime file to serve. `gramlotDev` imports nothing from Node.js, so the
 * neutral `GramlotServer` can read it in a serverless Worker, where it is null without `process`.
 *
 * @module
 */

const DEV_MODES = ['YES', 'DEBUG'];

/** GRAMLOT_DEV: null when unset (deploy), 'YES' or 'DEBUG'; any other value throws a TypeError. */
export function gramlotDev() {
    const value = globalThis.process?.env?.GRAMLOT_DEV;
    if (value === undefined) return null;
    if (!DEV_MODES.includes(value)) {
        throw new TypeError(`GRAMLOT_DEV must be unset, YES or DEBUG, not ${JSON.stringify(value)}`);
    }
    return value;
}

const RUNTIME_ASSETS = ['gramlot.js', 'gramlot.min.js', 'gramlot-markdown.js', 'runtime-notices.json'];

/** URL of a packaged browser asset in dist: a file: URL from npm (read with fs.readFile).
 * Without a name, the runtime to serve at the runtime URL: gramlot.js when
 * GRAMLOT_DEV=DEBUG, gramlot.min.js otherwise. Another name throws a TypeError. */
export function runtimeAsset(name = null) {
    if (name === null) name = gramlotDev() === 'DEBUG' ? 'gramlot.js' : 'gramlot.min.js';
    if (!RUNTIME_ASSETS.includes(name)) throw new TypeError(`Unknown Gramlot runtime asset: ${name}`);
    return new URL(`../../dist/${name}`, import.meta.url);
}

/** The entry points of every collection the core packages: the standard set, which every page receives, and the
 * collections a page declares in `Page.gramlots` (`typst`). A host serves the collections of its page graph from
 * them, as Python reads a declared collection from its package; hosts verify the complete artifact inventories. */
export function collectionAssets() {
    return [...standardCollections, ...declaredCollections].map(collection => ({
        url: collection.module,
        file: new URL(`../../dist/components/${collection.name}/assets/index.js`, import.meta.url),
    }));
}
