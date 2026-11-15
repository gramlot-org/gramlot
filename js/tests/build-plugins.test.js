import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {absentPackagePlugin, libraryPlugin} from '@gramlot/gramlot/build-plugins';
import {libraries} from '../src/libraries.js';

const jsRoot = fileURLToPath(new URL('../', import.meta.url));

test('a host bundle of the core sources with the exported plugins keeps every library out, as the runtime build', async () => {
    // As gramlot-serverless: its own esbuild bundle of the package entry, no CSS loader, no outdir.
    const result = await build({stdin: {contents: "export * from '@gramlot/gramlot';", resolveDir: jsRoot},
        bundle: true, format: 'esm', platform: 'browser', target: 'es2022', write: false, logLevel: 'silent',
        external: ['@gramlot/gramlot/markdown'], plugins: [absentPackagePlugin, libraryPlugin]});
    const text = result.outputFiles[0].text;
    for (const name of ['xterm', 'xtermStyle', 'uplotStyle', 'jodit'].filter(name => name in libraries))
        assert.ok(text.includes(`@gramlot/libraries/${name}`), name);
    assert.doesNotMatch(text, /class Terminal\b/);
});

test('without the library plugin the same bundle fails on the CSS of a library', async () => {
    await assert.rejects(build({stdin: {contents: "export * from '@gramlot/gramlot';", resolveDir: jsRoot},
        bundle: true, format: 'esm', platform: 'browser', write: false, logLevel: 'silent',
        external: ['@gramlot/gramlot/markdown'], plugins: [absentPackagePlugin]}), /css/i);
});
