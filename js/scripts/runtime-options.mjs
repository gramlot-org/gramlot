/** Canonical build options for both shipped browser runtime variants. */
import {fileURLToPath} from 'node:url';
import {bundleBanner} from './bundle-banner.mjs';
import {absentPackagePlugin, libraryPlugin} from '../src/build-plugins.js';

const options = {
    absWorkingDir: fileURLToPath(new URL('../', import.meta.url)),
    entryPoints: ['src/index.js'], bundle: true, platform: 'browser', target: 'es2022',
    format: 'esm', banner: {js: bundleBanner},
    external: ['@gramlot/gramlot/markdown'],
    plugins: [absentPackagePlugin, libraryPlugin],
};

export const runtimeOptions = {
    'gramlot.js': {...options, legalComments: 'inline', metafile: true},
    'gramlot.min.js': {...options, minify: true, legalComments: 'eof'},
};
