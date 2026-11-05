import test from 'node:test';
import assert from 'node:assert/strict';
import {lowerResourceReferences} from '../../tools/gramlot-builder/src/resource-references.js';

test('prepared resource declarations share emitted URLs without original paths', () => {
    const source = `const license = new URL('./license.txt', import.meta.url);\nexport default {assets:{license}, read:()=>license.href};`;
    const result = lowerResourceReferences(source, 'file:///private/project/chart.js',
        {'file:///private/project/license.txt':'assets/files/hash-license.txt'});
    assert.match(result, /collectionResources\["assets\/files\/hash-license.txt"\]/);
    assert.doesNotMatch(result, /file:\/\/\/private|new URL/);
    assert.match(result, /read:\(\)=>license.href/);
});

test('resource lowering leaves unrelated constructors and literal text untouched', () => {
    const source = `const collectionResources = "new URL('./license.txt', import.meta.url)";\nconst remote = new URL('./other.txt', import.meta.url);\nconst selected = new URL('./license.txt', import.meta.url);`;
    const result = lowerResourceReferences(source, 'file:///project/chart.js',
        {'file:///project/license.txt':'assets/files/license.txt'});
    assert.match(result, /import collectionResources_ from/);
    assert.ok(result.includes(`const remote = new URL('./other.txt', import.meta.url)`));
    assert.ok(result.includes(`"new URL('./license.txt', import.meta.url)"`));
});
