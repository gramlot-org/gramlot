// Temporary diagnostic for the present destination gap. Remove when Data routing lands.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {GramlotBuilder} from '../../js/src/builder/gramlot-builder.js';
import {GramlotRenderer} from '../../js/src/renderer/gramlot-renderer.js';

const require = createRequire(new URL('../../js/package.json', import.meta.url));
const {JSDOM} = require('jsdom');

test('current destination does not refresh mounted Source after a Data-only write', () => {
    const builder = new GramlotBuilder();
    builder.data.setItem('message', 'before');
    builder.root.p('^message');
    const document = new JSDOM('<main></main>').window.document;
    const renderer = new GramlotRenderer(builder, builder.source, document.querySelector('main')).mount();
    assert.equal(document.querySelector('p').textContent, 'before');
    builder.data.setItem('message', 'after');
    assert.equal(document.querySelector('p').textContent, 'before');
    renderer.dispose();
});
