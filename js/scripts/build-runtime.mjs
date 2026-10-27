/** Build installed browser entry points and preserve their dependency notices. */
import './export-components.mjs';
import {generate} from '../../tools/gramlot-builder/src/generate.js';
import {mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {typstInputs} from './build-typst.mjs';
import {build} from 'esbuild';
import {mkdir, copyFile, cp, readFile, readdir, writeFile, rm} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {moduleDoc} from './bundle-banner.mjs';
import {runtimeOptions} from './runtime-options.mjs';
const root = new URL('../', import.meta.url);
const path = value => fileURLToPath(new URL(value, root));
const compactStyle = await readFile(path('../themes/gramlot-compact/theme.css'), 'utf8');
const appearanceStyles = {base:'', compact:compactStyle};
for (const name of ['mimi', 'joanna', 'mela']) {
    appearanceStyles[name] = compactStyle + '\n' + await readFile(path(`../themes/${name}/theme.css`), 'utf8');
}
await writeFile(path('src/index-page-styles.js'), '// Generated from canonical themes; edit themes/, not this file.\nexport const appearanceStyles = ' + JSON.stringify(appearanceStyles) + ';\n');
await mkdir(path('dist/'), {recursive: true});
for (const name of ['LICENSE', 'NOTICE']) await copyFile(path(`../${name}`), path(name));
// Theme and identity files ship in the npm package (js/) and in the wheel (resources/).
const shipped = ['themes', 'assets/branding/gramlot-logo.svg', 'assets/branding/gramlot-logo-dark.svg',
    'assets/branding/app-icon.png', 'assets/branding/gramlot-mark.png', 'assets/branding/gramlot-mark-dark.png', 'assets/branding/svg'];
for (const target of ['', '../src/gramlot/resources/']) {
    for (const folder of ['themes', 'assets']) await rm(path(`${target}${folder}`), {recursive: true, force: true});
    for (const name of shipped) {
        await mkdir(dirname(path(`${target}${name}`)), {recursive: true});
        await cp(path(`../${name}`), path(`${target}${name}`), {recursive: true});
    }
}
// Page-side optional agent is independent of the application runtime bundle.
await build({entryPoints: [path('../tools/gramlot-tools-inspector/src/inspector-agent.js')],
    outfile: path('tools/inspector-agent.js'), bundle: true, format: 'esm',
    platform: 'browser', target: 'es2022'});
// Optional inspector artifact: shipped separately, never imported by the runtime entry.
await build({entryPoints: [path('../tools/gramlot-tools-inspector/src/gramlot-tools-inspector.js')],
    outfile: path('tools/gramlot-tools-inspector.js'), bundle: true, format: 'esm',
    target: 'es2022', external: ['@gramlot/gramlot'], loader: {'.css': 'text'}});
const hosted = await build({...runtimeOptions['gramlot.js'], outfile: path('dist/gramlot.js')});
// Both distributions ship the same prepared collection artifacts and fingerprint.
const staging = await mkdtemp(join(tmpdir(),'gramlot-core-collections-'));
try {
    const names = ['inputs','layout','tree','editors','typst'];
    const config = {output:'../src', collections:names.map(name=>({
        entry:`./src/components/${name}.js`,pythonPackage:`gramlot.collections.${name}`}))};
    const result = await generate({protocolVersion:1,operation:'build',
        configPath:path('gramlot.build.json'),projectRoot:path(''),stagingDirectory:staging,config,externals:[]});
    for (const record of result.collections) {
        const prepared = join(staging,...record.pythonPackage.split('.'));
        const python = path(`../src/gramlot/collections/${record.name}`);
        const javascript = path(`dist/components/${record.name}`);
        // Generated artifact directories must not retain files from an older inventory.
        await rm(python,{recursive:true,force:true});await rm(javascript,{recursive:true,force:true});
        await mkdir(python,{recursive:true});await mkdir(javascript,{recursive:true});
        await cp(prepared,python,{recursive:true});
        await cp(prepared,javascript,{recursive:true});
    }
} finally { await rm(staging,{recursive:true,force:true}); }
// The minified runtime is served in deploy and in development without GRAMLOT_DEV=DEBUG.
await build({...runtimeOptions['gramlot.min.js'], outfile: path('dist/gramlot.min.js')});
await writeFile(path('dist/gramlot.d.ts'), `${moduleDoc}\nexport * from '../src/index.d.ts';\n`);
// Standalone startup and Worker integration now belong to gramlot-serverless.
await rm(path('dist/standalone.js'), {force: true});
await rm(path('../src/gramlot/resources/standalone.js'), {force: true});
Object.assign(hosted.metafile.inputs, typstInputs);
const packages = new Map();
for (const input of new Set(Object.keys(hosted.metafile.inputs))) {
    let directory = dirname(resolve(runtimeOptions['gramlot.js'].absWorkingDir, input));
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
