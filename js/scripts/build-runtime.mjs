/** Build installed browser entry points and preserve their dependency notices. */
import {build} from 'esbuild';
import {mkdir, copyFile, cp, readFile, readdir, writeFile, rm} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundleBanner, moduleDoc} from './bundle-banner.mjs';
const root = new URL('../', import.meta.url);
const path = value => fileURLToPath(new URL(value, root));
await mkdir(path('dist/'), {recursive: true});
for (const name of ['LICENSE', 'NOTICE']) await copyFile(path(`../${name}`), path(name));
// Theme and identity files ship in the npm package (js/) and in the wheel (resources/), as in jsr.json.
const shipped = ['themes', 'assets/branding/gramlot-logo.svg', 'assets/branding/gramlot-logo-dark.svg',
    'assets/branding/gramlot-mark.png', 'assets/branding/gramlot-mark-dark.png', 'assets/branding/svg'];
for (const target of ['', '../src/gramlot/resources/']) {
    for (const folder of ['themes', 'assets']) await rm(path(`${target}${folder}`), {recursive: true, force: true});
    for (const name of shipped) {
        await mkdir(dirname(path(`${target}${name}`)), {recursive: true});
        await cp(path(`../${name}`), path(`${target}${name}`), {recursive: true});
    }
}
const options = {
    bundle: true, platform: 'browser', target: 'es2022', metafile: true,
    legalComments: 'inline',
};
const hosted = await build({...options, entryPoints: [path('src/index.js')], format: 'esm', outfile: path('dist/gramlot.js'),
    banner: {js: bundleBanner}});
// The minified runtime is served in deploy and in development without GRAMLOT_DEV=DEBUG.
await build({...options, entryPoints: [path('src/index.js')], format: 'esm', outfile: path('dist/gramlot.min.js'),
    banner: {js: bundleBanner}, minify: true, legalComments: 'eof', metafile: false});
await writeFile(path('dist/gramlot.d.ts'), `${moduleDoc}\nexport * from '../src/index.d.ts';\n`);
// Standalone startup and Worker integration now belong to gramlot-serverless.
await rm(path('dist/standalone.js'), {force: true});
await rm(path('../src/gramlot/resources/standalone.js'), {force: true});
const packages = new Map();
for (const input of new Set(Object.keys(hosted.metafile.inputs))) {
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
await mkdir(path('../src/gramlot/resources/'), {recursive: true});
for (const name of ['gramlot.js', 'gramlot.min.js', 'runtime-notices.json']) {
    await copyFile(path(`dist/${name}`), path(`../src/gramlot/resources/${name}`));
}
