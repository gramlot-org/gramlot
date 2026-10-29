import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {collectionBuildId, verifyCollectionArtifact} from '../src/index.js';

async function artifact() {
    const root = new URL('../dist/components/inputs/', import.meta.url);
    const files = new Map();
    for (const path of ['grammar.json', 'commands.json', ...(await readdir(new URL('assets/', root), {recursive:true})).map(path => 'assets/' + path)]) {
        files.set(path, await readFile(new URL(path, root)));
    }
    const {buildId} = await import(new URL('assets/index.js', root));
    return {files, metadata:{name:'inputs',grammar:'grammar.json',commands:'commands.json',module:'assets/index.js',
        css:[],dependencies:[],files:[...files.keys()],buildId}};
}
test('shared API verifies the same prepared artifact as Python and the generator', async () => {
    const {files, metadata} = await artifact();
    assert.equal(await collectionBuildId(metadata, files), metadata.buildId);
    await verifyCollectionArtifact(metadata, files);
    const reversed = {...metadata, files:[...metadata.files].reverse()};
    assert.equal(await collectionBuildId(reversed, files), metadata.buildId);
});
test('prepared layout exposes its default collection and named component descriptors', async () => {
    const layout = await import('../dist/components/layout/assets/index.js');
    assert.equal(layout.default.name, 'layout');
    assert.ok(layout.ContentPane.base);
    assert.match(layout.buildId, /^sha256:[a-f0-9]{64}$/);
});
test('every byte, wrapper, metadata field and inventory participates in verification', async () => {
    const {files, metadata} = await artifact();
    for (const path of files.keys()) {
        const changed = new Map(files); changed.set(path, new Uint8Array([...files.get(path), 32]));
        await assert.rejects(verifyCollectionArtifact(metadata, changed), /wrapper|fingerprint mismatch/);
    }
    await assert.rejects(verifyCollectionArtifact({...metadata,name:'other'},files), /fingerprint mismatch/);
    await assert.rejects(verifyCollectionArtifact(metadata, new Map([...files, ['extra', new Uint8Array()]])), /inventory/);
    await assert.rejects(collectionBuildId({...metadata,files:[...metadata.files,'../outside']}, files), /inventory/);
});
