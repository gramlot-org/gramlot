/* @ts-self-types="./assets.d.ts" */
/**
 * Development mode and the runtime file to serve; Node.js and Bun only.
 *
 * @module
 */
import process from 'node:process';

const DEV_MODES = ['YES', 'DEBUG'];

/** GRAMLOT_DEV: null when unset (deploy), 'YES' or 'DEBUG'; any other value throws a TypeError. */
export function gramlotDev() {
    const value = process.env.GRAMLOT_DEV;
    if (value === undefined) return null;
    if (!DEV_MODES.includes(value)) {
        throw new TypeError(`GRAMLOT_DEV must be unset, YES or DEBUG, not ${JSON.stringify(value)}`);
    }
    return value;
}

const RUNTIME_ASSETS = ['gramlot.js', 'gramlot.min.js', 'runtime-notices.json'];

/** URL of a packaged browser asset in dist: a file: URL from npm (read with fs.readFile), an https: URL
 * from JSR (read with fetch). Without a name, the runtime to serve at the runtime URL: gramlot.js when
 * GRAMLOT_DEV=DEBUG, gramlot.min.js otherwise. Another name throws a TypeError. */
export function runtimeAsset(name = null) {
    if (name === null) name = gramlotDev() === 'DEBUG' ? 'gramlot.js' : 'gramlot.min.js';
    if (!RUNTIME_ASSETS.includes(name)) throw new TypeError(`Unknown Gramlot runtime asset: ${name}`);
    return new URL(`../../dist/${name}`, import.meta.url);
}
