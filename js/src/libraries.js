/**
 * The third-party libraries of the standard components, and the function that loads one on first use.
 *
 * `libraries` is the manifest: one entry per library, keyed by its name. An entry holds
 *
 * - `packages`: the npm packages it contains, each with its exact installed version;
 * - `local`: the import specifier of the local copy, a file of the package (`echarts/dist/echarts.esm.min.mjs`)
 *   or a Gramlot engine module that bundles the packages (`./components/code-mirror-engine.js`, relative to
 *   `js/src`); the collection generator emits it as a deferred module of the collection;
 * - `url`: the same file on jsDelivr at the exact version, or `null` when the library has no ESM build that a
 *   browser can import alone (UMD builds, builds split across packages, the Typst WebAssembly);
 * - `integrity`: the SRI hash (sha384) of that file, `null` without `url`;
 * - `format`: `module` (the import gives the library), `style` (CSS text) or `script` (a UMD build evaluated as
 *   a browser script: it reads its dependencies from globals of the window and writes the library to the
 *   window property `global`).
 *
 * The page document says where the libraries come from: the bootstrap HTML of a server carries
 * `data-gramlot-library-source="cdn"` or `"local"` on its root element. A document without the marker (the
 * serverless and file exports) uses the local copies.
 *
 * @module
 */

const jsdelivr = (name, version, file) => `https://cdn.jsdelivr.net/npm/${name}@${version}/${file}`;

export const libraries = Object.freeze({
    echarts: Object.freeze({packages: {echarts: '6.1.0'}, local: 'echarts/dist/echarts.esm.min.mjs',
        url: jsdelivr('echarts', '6.1.0', 'dist/echarts.esm.min.mjs'),
        integrity: 'sha384-2svH5QplTeBKhRXWxXOJE2P6pRpgnqVq8l8U1dYXUBXvc2zJ/FMMardtnPnnCXnt', format: 'module'}),
    echartsGl: Object.freeze({packages: {'echarts-gl': '2.1.0'}, local: 'echarts-gl/dist/echarts-gl.min.js',
        url: null, integrity: null, format: 'script', global: 'echarts-gl'}),
    uplot: Object.freeze({packages: {uplot: '1.6.32'}, local: 'uplot/dist/uPlot.esm.js',
        url: jsdelivr('uplot', '1.6.32', 'dist/uPlot.esm.js'),
        integrity: 'sha384-iUdBlEO5qc07+gOz+3rq/Besyud+KVIxM+xJEuUBObxLG3C/Dlkz8OYuPUcPrCGP', format: 'module'}),
    uplotStyle: Object.freeze({packages: {uplot: '1.6.32'}, local: 'uplot/dist/uPlot.min.css',
        url: jsdelivr('uplot', '1.6.32', 'dist/uPlot.min.css'),
        integrity: 'sha384-IfV0B7MIOYuO95kO9G5ySKPz/85zqFNOAs8iy4tkK5zd9izhJAB8b7lHrwYqqmYE', format: 'style'}),
    xterm: Object.freeze({packages: {'@xterm/xterm': '6.0.0'}, local: '@xterm/xterm/lib/xterm.mjs',
        url: jsdelivr('@xterm/xterm', '6.0.0', 'lib/xterm.mjs'),
        integrity: 'sha384-8Xik+BkzF4UFDtZa8HkUiQ0FE/Xl+03xMuv69uQB3ichDzm8dWs4kPRihQxSZDiY', format: 'module'}),
    xtermFit: Object.freeze({packages: {'@xterm/addon-fit': '0.11.0'}, local: '@xterm/addon-fit/lib/addon-fit.mjs',
        url: jsdelivr('@xterm/addon-fit', '0.11.0', 'lib/addon-fit.mjs'),
        integrity: 'sha384-0/1EW6dUPoaun7dgdlOtb5Wk8x5UQRW6hYM3ihuCCnaA2Xd4HwMFcn378RpxmoAc', format: 'module'}),
    xtermStyle: Object.freeze({packages: {'@xterm/xterm': '6.0.0'}, local: '@xterm/xterm/css/xterm.css',
        url: jsdelivr('@xterm/xterm', '6.0.0', 'css/xterm.css'),
        integrity: 'sha384-n2n7twoohnW+d3myBKaUgl7DSiwidw6MkQy9oesGzkPpMjejKRR3XlnD+5yCdtBD', format: 'style'}),
    plotly: Object.freeze({packages: {'plotly.js-dist-min': '4.2.0'}, local: 'plotly.js-dist-min',
        url: null, integrity: null, format: 'module'}),
    vega: Object.freeze({packages: {vega: '6.4.0'}, local: 'vega', url: null, integrity: null, format: 'module'}),
    writeExcelFile: Object.freeze({packages: {'write-excel-file': '4.1.1'}, local: 'write-excel-file/browser',
        url: null, integrity: null, format: 'module'}),
    jodit: Object.freeze({packages: {jodit: '4.18.10'}, local: './components/jodit-engine.js',
        url: null, integrity: null, format: 'module'}),
    codemirror: Object.freeze({packages: {
        '@codemirror/autocomplete': '6.20.4', '@codemirror/commands': '6.11.1', '@codemirror/lang-css': '6.3.1',
        '@codemirror/lang-html': '6.4.12', '@codemirror/lang-javascript': '6.2.5', '@codemirror/lang-json': '6.0.2',
        '@codemirror/lang-markdown': '6.5.2', '@codemirror/lang-python': '6.2.1', '@codemirror/lang-sql': '6.10.0',
        '@codemirror/lang-xml': '6.1.0', '@codemirror/language': '6.13.1', '@codemirror/lint': '6.9.8',
        '@codemirror/search': '6.7.2', '@codemirror/state': '6.7.6', '@codemirror/view': '6.43.15',
        '@lezer/highlight': '1.2.5', 'codemirror-lang-typst': '0.6.0'},
        local: './components/code-mirror-engine.js', url: null, integrity: null, format: 'module'}),
    prosemirror: Object.freeze({packages: {
        'prosemirror-commands': '1.6.2', 'prosemirror-history': '1.4.1', 'prosemirror-keymap': '1.2.2',
        'prosemirror-markdown': '1.13.1', 'prosemirror-model': '1.25.12', 'prosemirror-state': '1.4.3',
        'prosemirror-view': '1.42.6'},
        local: './components/prose-mirror-engine.js', url: null, integrity: null, format: 'module'}),
    // The Markdown renderer of Gramlot; markdown-it itself is the runtime file gramlot-markdown.js.
    markdownIt: Object.freeze({packages: {'markdown-it': '14.3.3'}, local: './components/markdown-document.js',
        url: null, integrity: null, format: 'module'}),
    typst: Object.freeze({packages: {'@myriaddreamin/typst.ts': '0.7.0', '@myriaddreamin/typst-ts-web-compiler': '0.7.0',
        '@myriaddreamin/typst-ts-renderer': '0.7.0'},
        local: './components/typst-client.js', url: null, integrity: null, format: 'module'}),
});

/**
 * The library `name` of the manifest, for a component of `document`. `localImport` is the dynamic import of the
 * local copy written in the component (`() => import('echarts/dist/echarts.esm.min.mjs')`), so that the
 * collection generator emits the copy as a deferred module. With `data-gramlot-library-source="cdn"` on the
 * document and a `url` in the entry the library comes from jsDelivr: the import map of the bootstrap carries
 * its integrity, a style is fetched with it. Resolves with the module namespace (`module`), the CSS text
 * (`style`) or the window property `global` (`script`).
 */
export async function loadLibrary(name, document, localImport) {
    if (!Object.hasOwn(libraries, name)) throw new Error(`Unknown third-party library: ${name}`);
    const library = libraries[name];
    const cdn = library.url !== null && document.documentElement.getAttribute('data-gramlot-library-source') === 'cdn';
    if (library.format === 'style') {
        if (!cdn) return (await localImport()).default;
        const response = await document.defaultView.fetch(library.url, {integrity: library.integrity});
        if (!response.ok) throw new Error(`${name}: ${library.url} answered ${response.status}`);
        return response.text();
    }
    const module = cdn ? await import(library.url) : await localImport();
    return library.format === 'script' ? document.defaultView[library.global] : module;
}
