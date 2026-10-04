// Phase S16, C07: the served runtime bundles are the build of js/src at this revision. The hosts serve
// js/dist/gramlot.js (npm package) and src/gramlot/resources/gramlot.js (Python wheel); both are
// gitignored, so nothing but this check tells a stale copy from a current one.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {bundleBanner} from '../scripts/bundle-banner.mjs';

const JS = fileURLToPath(new URL('../', import.meta.url));
const SERVED = ['dist/gramlot.js', '../src/gramlot/resources/gramlot.js'];
const sha256 = text => createHash('sha256').update(text).digest('hex');

test('C07: every served runtime bundle is the build of js/src with the installed dependencies', async () => {
    // The options of js/scripts/build-runtime.mjs, run from js/ as `npm --prefix js run build` runs it.
    const fresh = await build({
        entryPoints: ['src/index.js'], absWorkingDir: JS, bundle: true, platform: 'browser', target: 'es2022',
        format: 'esm', legalComments: 'inline', banner: {js: bundleBanner}, write: false, logLevel: 'silent',
    });
    const expected = sha256(fresh.outputFiles[0].contents);
    for (const relative of SERVED) {
        let served;
        try { served = await readFile(new URL(relative, new URL('../', import.meta.url))); }
        catch (error) { assert.fail(`${relative}: missing (${error.code}); run npm --prefix js run build`); }
        assert.equal(sha256(served), expected, `${relative} is stale: run npm --prefix js run build`);
    }
});
