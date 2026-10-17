/** Generate Python's input grammar from the DOM-free JS definitions. */
import {writeFile} from 'node:fs/promises';
import inputs from '../src/components/inputs.js';
import layout from '../src/components/layout.js';
await writeFile(new URL('../../src/gramlot/collections/layout.json', import.meta.url),
    JSON.stringify(layout.toDocument(), null, 2) + '\n');
await writeFile(new URL('../../src/gramlot/collections/inputs.json', import.meta.url),
    JSON.stringify(inputs.toDocument(), null, 2) + '\n');

import buttons from '../src/components/buttons.js';
await writeFile(new URL('../../src/gramlot/collections/buttons.json', import.meta.url),
    JSON.stringify(buttons.toDocument(), null, 2) + '\n');
