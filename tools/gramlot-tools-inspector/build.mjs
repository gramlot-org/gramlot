import {build} from 'esbuild';
import {mkdir} from 'node:fs/promises';
await mkdir(new URL('./dist/', import.meta.url), {recursive: true});
await build({entryPoints: [new URL('./src/gramlot-tools-inspector.js', import.meta.url).pathname],
    outfile: new URL('./dist/gramlot-tools-inspector.js', import.meta.url).pathname,
    bundle: true, format: 'esm', target: 'es2022', external: ['@gramlot/gramlot'], loader: {'.css': 'text'}});
// Separate artifact for the generic declaration and tree contract fixture.
await build({entryPoints: [new URL('../poc/gramlot-poc-tree.js', import.meta.url).pathname],
    outfile: new URL('./dist/gramlot-poc-tree.js', import.meta.url).pathname,
    bundle: true, format: 'esm', target: 'es2022', external: ['@gramlot/gramlot'], loader: {'.css': 'text'}});
