/** Build installed browser entry points and preserve their dependency notices. */
import {build} from 'esbuild';
import {mkdir, copyFile, readFile, readdir, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root = new URL('../', import.meta.url);
const path = value => fileURLToPath(new URL(value, root));
await mkdir(path('dist/'), {recursive: true});
for (const name of ['LICENSE', 'NOTICE']) await copyFile(path(`../${name}`), path(name));
const options = {
    bundle: true, platform: 'browser', target: 'es2022', metafile: true,
    legalComments: 'inline',
};
const hosted = await build({...options, entryPoints: [path('src/index.js')], format: 'esm', outfile: path('dist/gramlot.js')});
const offline = await build({...options, entryPoints: [path('src/standalone.js')], format: 'iife',
    globalName: 'GramlotStandalone', outfile: path('dist/standalone.js')});
const packages = new Map();
for (const input of new Set([...Object.keys(hosted.metafile.inputs), ...Object.keys(offline.metafile.inputs)])) {
    let directory = dirname(resolve(input));
    while (directory !== dirname(directory)) {
        let metadata;
        try { metadata = JSON.parse(await readFile(resolve(directory, 'package.json'), 'utf8')); }
        catch { directory = dirname(directory); continue; }
        // A package may also carry a manifest in its JS subdirectory. Use the
        // outer package root when both manifests identify the same package, so
        // its LICENSE and NOTICE remain attached to the bundled source.
        let packageRoot = directory;
        while (packageRoot !== dirname(packageRoot)) {
            const parent = dirname(packageRoot);
            let parentMetadata;
            try { parentMetadata = JSON.parse(await readFile(resolve(parent, 'package.json'), 'utf8')); }
            catch { break; }
            if (parentMetadata.name !== metadata.name) break;
            packageRoot = parent;
            metadata = parentMetadata;
        }
        packages.set(packageRoot, {name: metadata.name ?? packageRoot, license: metadata.license});
        break;
    }
}
packages.delete(resolve(path('')));
packages.set(path('../'), {name: 'Gramlot', license: 'Apache-2.0'});
const notices = [];
for (const [directory, {name, license}] of packages) {
    const names = (await readdir(directory)).filter(name => /^(licen[cs]e|notice|copying)(\..*)?$/i.test(name)).sort();
    const text = names.length
        ? (await Promise.all(names.map(name => readFile(resolve(directory, name), 'utf8')))).join('\n\n')
        : `Package metadata declares license: ${license ?? 'unspecified'}. No LICENSE/NOTICE file is included in the installed package.`;
    notices.push({name, text});
}
notices.sort((a, b) => a.name.localeCompare(b.name));
await writeFile(path('dist/runtime-notices.json'), JSON.stringify(notices, null, 2) + '\n');
await mkdir(path('../build/assets/'), {recursive: true});
await copyFile(path('dist/gramlot.js'), path('../build/assets/gramlot.js'));
for (const name of ['gramlot.js', 'standalone.js', 'runtime-notices.json']) {
    await copyFile(path(`dist/${name}`), path(`../src/gramlot/resources/${name}`));
}
