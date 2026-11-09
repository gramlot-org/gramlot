/** Prepared collections take the shared libraries and runtime modules from the core (GC-325 §155). */
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {generate} from '../../tools/gramlot-builder/src/generate.js';
import * as core from '@gramlot/gramlot';

const js = fileURLToPath(new URL('../', import.meta.url));
const repository = resolve(js, '..');

/** One marker string per shared library, present in the runtime bundle. */
const markers = {
    '@genrojs/bag': 'BagSerializationError',
    '@genrojs/builders': 'Cyclic attribute dependency',
    'decimal.js': '[DecimalError]',
    '@msgpack/msgpack': 'ExtensionCodec',
};

/** One marker string per library that the libraries import and the browser runtime does not ship (#84). */
const absentMarkers = {
    '@xmldom/xmldom': 'INUSE_ATTRIBUTE_ERR',
    'big.js': '[big.js]',
};

async function project(t, source) {
    const root = await mkdtemp(join(tmpdir(), 'gramlot-shared-modules-'));
    t.after(() => rm(root, {recursive: true, force: true}));
    await writeFile(join(root, 'package.json'), '{"type":"module"}');
    await mkdir(join(root, 'node_modules/@gramlot'), {recursive: true});
    await symlink(js, join(root, 'node_modules/@gramlot/gramlot'), 'dir');
    // The generator imports the collection definition in Node: an author installs the libraries it imports.
    for (const library of ['@genrojs', 'decimal.js']) await symlink(join(js, 'node_modules', library), join(root, 'node_modules', library), 'dir');
    await mkdir(join(root, 'ui'));
    await writeFile(join(root, 'ui/index.js'), source);
    const staging = join(root, 'staging');
    await mkdir(staging);
    const request = {protocolVersion: 1, operation: 'build', configPath: join(root, 'gramlot.build.json'),
        projectRoot: root, stagingDirectory: staging, externals: [],
        config: {output: './src', collections: [{entry: './ui/index.js', pythonPackage: 'sample.widgets'}]}};
    return {root, staging, run: () => generate(request)};
}

test('a collection and the core share one Bag class and the collection bundles no copy of it', async t => {
    const {staging, run} = await project(t, `import {defineCollection} from '@gramlot/gramlot/components';
import {Bag} from '@genrojs/bag';
import Decimal from 'decimal.js';
export const collectionBag = () => new Bag();
export const collectionDecimal = value => new Decimal(value);
export default defineCollection({name:'sharedprobe',components:[]});
`);
    await run();
    const assets = join(staging, 'sample/widgets/assets');
    const emitted = await readFile(join(assets, 'collection.js'), 'utf8');
    assert.match(emitted, /sharedModules/);
    for (const [library, marker] of Object.entries({...markers, ...absentMarkers})) assert.ok(!emitted.includes(marker), library);
    const collection = await import(pathToFileURL(join(assets, 'index.js')).href);
    assert.ok(collection.collectionBag() instanceof core.Bag);
    assert.equal(collection.collectionDecimal('1.5').constructor, core.sharedModules['decimal.js'].default);
});

test('the generator refuses a collection that would bundle a runtime module missing from sharedModules', async t => {
    const menus = join(js, 'src/components/menus.js');
    assert.ok(!Object.hasOwn(core.sharedModules, './components/menus.js'));
    const {run} = await project(t, `import {defineCollection} from '@gramlot/gramlot/components';
import * as menus from ${JSON.stringify(menus)};
export const used = menus;
export default defineCollection({name:'copyprobe',components:[]});
`);
    await assert.rejects(run, /Collection copyprobe bundles runtime modules missing from sharedModules: .*components\/menus\.js/);
});

test('the generator refuses a subpath of a shared library that the core does not share', async t => {
    const {run} = await project(t, `import {defineCollection} from '@gramlot/gramlot/components';
export const load = () => import('@genrojs/tytx/unshared');
export default defineCollection({name:'subpathprobe',components:[]});
`);
    await assert.rejects(run, /The runtime does not share @genrojs\/tytx\/unshared/);
});

test('shipped standard collections contain no copy of the shared libraries', async () => {
    const runtime = await readFile(join(repository, 'src/gramlot/resources/gramlot.min.js'), 'utf8');
    for (const [library, marker] of Object.entries(markers)) assert.ok(runtime.includes(marker), `runtime ${library}`);
    for (const [library, marker] of Object.entries(absentMarkers)) assert.ok(!runtime.includes(marker), `runtime ${library}`);
    const names = JSON.parse(await readFile(join(repository, 'src/gramlot/collections/standard.json'), 'utf8'));
    for (const name of names) {
        const assets = join(repository, 'src/gramlot/collections', name, 'assets');
        const files = [join(assets, 'collection.js')];
        const modules = join(assets, 'modules');
        for (const file of await readdir(modules).catch(() => [])) if (file.endsWith('.js')) files.push(join(modules, file));
        for (const file of files) {
            const text = await readFile(file, 'utf8');
            for (const [library, marker] of Object.entries({...markers, ...absentMarkers})) {
                assert.ok(!text.includes(marker), `${name}: ${library} in ${file.slice(dirname(assets).length + 1)}`);
            }
        }
    }
});
