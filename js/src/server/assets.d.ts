/**
 * Development mode and the runtime file to serve; Node.js and Bun only.
 *
 * @module
 */

/** `GRAMLOT_DEV`: `null` when unset (deploy), `'YES'` or `'DEBUG'`; any other value throws a `TypeError`. */
export function gramlotDev(): 'YES' | 'DEBUG' | null;
/** URL of a packaged browser asset in `dist`: a `file:` URL from npm (read with `fs.readFile`), an `https:`
 * URL from JSR (read with `fetch`). Without a name, the runtime to serve at the runtime URL: `gramlot.js`
 * when `GRAMLOT_DEV=DEBUG`, `gramlot.min.js` otherwise. Another name throws a `TypeError`. */
export function runtimeAsset(name?: 'gramlot.js' | 'gramlot.min.js' | 'runtime-notices.json' | null): URL;
