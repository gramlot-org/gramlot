/** Canonical build options for both shipped browser runtime variants. */
import {fileURLToPath} from 'node:url';
import {bundleBanner} from './bundle-banner.mjs';

const options = {
    absWorkingDir: fileURLToPath(new URL('../', import.meta.url)),
    entryPoints: ['src/index.js'], bundle: true, platform: 'browser', target: 'es2022',
    format: 'esm', banner: {js: bundleBanner},
};

export const runtimeOptions = {
    'gramlot.js': {...options, legalComments: 'inline', metafile: true},
    'gramlot.min.js': {...options, minify: true, legalComments: 'eof'},
};
