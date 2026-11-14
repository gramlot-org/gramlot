/** Bundle the core browser runtime used by Python-authored documentation examples. */
import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
import {runtimeOptions} from './runtime-options.mjs';

const jsRoot = fileURLToPath(new URL('../', import.meta.url));
const output = fileURLToPath(new URL('../../build/docs-source/downloads/inside/runtime.js', import.meta.url));
await build({
    stdin: {
        contents: `import {Gramlot} from './src/index.js';
import inputs from './src/components/inputs.js';
const response = await fetch('./source.tytx');
if (!response.ok) throw new Error('Could not load example Source: ' + response.status);
const app = new Gramlot({element: document.getElementById('gramlot-root'), transport: false, collections: [inputs]});
app.src.startSource(await response.text());`,
        resolveDir: jsRoot,
        sourcefile: 'documentation-runtime.js',
    },
    bundle: true,
    format: 'esm',
    platform: 'browser',
    // As the runtime build: third-party libraries of components load on first use, outside the bundle.
    plugins: runtimeOptions['gramlot.js'].plugins,
    external: runtimeOptions['gramlot.js'].external,
    outfile: output,
});
