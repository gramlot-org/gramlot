// GRAMLOT_DEV and the runtime file served at the runtime URL; Python counterpart tests/test_runtime_assets.py.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {basename} from 'node:path';
import {fileURLToPath} from 'node:url';
import {gramlotDev, runtimeAsset} from '../src/server/index.js';

/** Run `body` with GRAMLOT_DEV set to `value` (unset for undefined), then restore it. */
function withDev(value, body) {
    const saved = process.env.GRAMLOT_DEV;
    if (value === undefined) delete process.env.GRAMLOT_DEV;
    else process.env.GRAMLOT_DEV = value;
    try { return body(); }
    finally {
        if (saved === undefined) delete process.env.GRAMLOT_DEV;
        else process.env.GRAMLOT_DEV = saved;
    }
}

test('gramlotDev: unset, YES and DEBUG; any other value is a TypeError', () => {
    for (const [value, expected] of [[undefined, null], ['YES', 'YES'], ['DEBUG', 'DEBUG']]) {
        withDev(value, () => assert.equal(gramlotDev(), expected));
    }
    for (const value of ['', 'yes', '1', 'NO']) withDev(value, () => assert.throws(() => gramlotDev(), TypeError));
});

test('runtimeAsset: the readable runtime with DEBUG, the minified one otherwise', () => {
    for (const [value, name] of [[undefined, 'gramlot.min.js'], ['YES', 'gramlot.min.js'], ['DEBUG', 'gramlot.js']]) {
        withDev(value, () => {
            assert.ok(runtimeAsset() instanceof URL);
            assert.equal(basename(fileURLToPath(runtimeAsset())), name);
            assert.equal(basename(fileURLToPath(runtimeAsset('runtime-notices.json'))), 'runtime-notices.json');
        });
    }
    withDev('other', () => assert.throws(() => runtimeAsset(), TypeError));
});

test('runtimeAsset: a named asset is readable from its URL; an unknown name is a TypeError', async () => {
    const readable = await readFile(runtimeAsset('gramlot.js'), 'utf-8');
    assert.ok(readable.includes('Gramlot'));
    assert.ok((await readFile(runtimeAsset('gramlot.min.js'))).length < readable.length);
    assert.throws(() => runtimeAsset('../server/gramlot-server.js'), TypeError);
});

test('build: the minified runtime exists in dist and in the wheel resources and is smaller', async () => {
    const read = relative => readFile(new URL(relative, import.meta.url));
    const readable = await read('../dist/gramlot.js');
    for (const relative of ['../dist/gramlot.min.js', '../../src/gramlot/resources/gramlot.min.js']) {
        const minified = await read(relative);
        assert.ok(minified.includes('Gramlot'), relative);
        assert.ok(minified.length < readable.length, relative);
    }
});
