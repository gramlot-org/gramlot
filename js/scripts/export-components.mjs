/** Generate Python's input grammar from the DOM-free JS definitions. */
import {writeFile} from 'node:fs/promises';
import inputs from '../src/components/inputs.js';
import layout from '../src/components/layout.js';
import tree from '../src/components/tree.js';
await writeFile(new URL('../../src/gramlot/collections/tree.json', import.meta.url),
    JSON.stringify(tree.toDocument(), null, 2) + '\n');
await writeFile(new URL('../../src/gramlot/collections/layout.json', import.meta.url),
    JSON.stringify(layout.toDocument(), null, 2) + '\n');
await writeFile(new URL('../../src/gramlot/collections/inputs.json', import.meta.url),
    JSON.stringify(inputs.toDocument(), null, 2) + '\n');

import buttons from '../src/components/buttons.js';
await writeFile(new URL('../../src/gramlot/collections/buttons.json', import.meta.url),
    JSON.stringify(buttons.toDocument(), null, 2) + '\n');

import editors from '../src/components/editors.js';
await writeFile(new URL('../../src/gramlot/collections/editors.json', import.meta.url),
    JSON.stringify(editors.toDocument(), null, 2) + '\n');

import typst from '../src/components/typst.js';
await writeFile(new URL('../../src/gramlot/collections/typst.json', import.meta.url), JSON.stringify(typst.toDocument(), null, 2) + '\n');

import grid from '../src/components/grid.js';
await writeFile(new URL('../../src/gramlot/collections/grid.json', import.meta.url), JSON.stringify(grid.toDocument(), null, 2) + '\n');
import chat from '../src/components/chat.js';
await writeFile(new URL('../../src/gramlot/collections/chat.json', import.meta.url), JSON.stringify(chat.toDocument(), null, 2)+'\n');
