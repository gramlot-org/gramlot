// Phase S16, C07: the served runtime bundles are the build of js/src at this revision. The hosts serve
// readable and minified variants in js/dist (npm) and src/gramlot/resources (Python); all four are
// gitignored, so nothing but this check tells a stale copy from a current one.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {build} from 'esbuild';
import {runtimeOptions} from '../scripts/runtime-options.mjs';

const sha256 = text => createHash('sha256').update(text).digest('hex');

test('C07: every served runtime bundle is the build of js/src with the installed dependencies', async t => {
    // Importing the build configuration does not regenerate or repair the artifacts being checked.
    for (const [name, options] of Object.entries(runtimeOptions)) {
        const fresh = await build({...options, write: false, logLevel: 'silent'});
        const expected = sha256(fresh.outputFiles[0].contents);
        for (const folder of ['dist', '../src/gramlot/resources']) {
            const relative = `${folder}/${name}`;
            await t.test(relative, async () => {
                let served;
                try { served = await readFile(new URL(relative, new URL('../', import.meta.url))); }
                catch (error) { assert.fail(`${relative}: missing (${error.code}); run npm --prefix js run build`); }
                assert.equal(sha256(served), expected, `${relative} is stale: run npm --prefix js run build`);
            });
        }
    }
});
