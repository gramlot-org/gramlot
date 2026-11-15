/** Canonical build options for both shipped browser runtime variants. */
import {fileURLToPath} from 'node:url';
import {bundleBanner} from './bundle-banner.mjs';

/**
 * Packages that `@genrojs/bag` and `@genrojs/tytx` import and the browser runtime does not ship
 * (gramlot-org/gramlot#84). `@genrojs/tytx` imports big.js beside decimal.js and selects decimal.js,
 * the `Decimal` of Gramlot. Both libraries parse XML with the native `DOMParser` of the window and use
 * @xmldom/xmldom only where no `DOMParser` exists: Node and the serverless Web Worker, which bundle the
 * core sources and keep both packages. The browser runtime replaces each package with a module whose
 * classes throw when constructed.
 */
const absentPackages = {
    'big.js': "export default class Big { constructor() { throw new Error('The Gramlot browser runtime has no big.js: decimals use decimal.js'); } }",
    '@xmldom/xmldom': "const absent = () => { throw new Error('The Gramlot browser runtime has no @xmldom/xmldom: XML uses the native DOMParser'); };\n" +
        'export class DOMParser { constructor() { absent(); } }\nexport class XMLSerializer { constructor() { absent(); } }',
};

const absentPackagePlugin = {
    name: 'absent-package',
    setup(build) {
        const filter = new RegExp(`^(${Object.keys(absentPackages).map(name => name.replace(/[./]/g, '\\$&')).join('|')})$`);
        build.onResolve({filter}, args => ({path: args.path, namespace: 'absent-package'}));
        build.onLoad({filter: /.*/, namespace: 'absent-package'}, args => ({contents: absentPackages[args.path], loader: 'js'}));
    },
};

const options = {
    absWorkingDir: fileURLToPath(new URL('../', import.meta.url)),
    entryPoints: ['src/index.js'], bundle: true, platform: 'browser', target: 'es2022',
    format: 'esm', banner: {js: bundleBanner},
    external: ['@gramlot/gramlot/markdown'],
    plugins: [absentPackagePlugin],
};

export const runtimeOptions = {
    'gramlot.js': {...options, legalComments: 'inline', metafile: true},
    'gramlot.min.js': {...options, minify: true, legalComments: 'eof'},
};
