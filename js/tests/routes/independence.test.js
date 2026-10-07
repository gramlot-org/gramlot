/** The routes package imports only its own files and @genrojs/tytx; `@gramlot/gramlot/routes` exposes the public names. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync, readFileSync} from 'node:fs';
import {resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const routesDir = fileURLToPath(new URL('../../src/routes/', import.meta.url));

const stripComments = text => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');

/** Every module specifier of a source: `import ... from`, `export ... from`, bare `import 'x'`, `import('x')`. */
const specifiers = text => {
    const code = stripComments(text);
    const found = [
        ...code.matchAll(/^\s*(?:import|export)\b[^;]*?\bfrom\s*['"]([^'"]+)['"]/gm),
        ...code.matchAll(/^\s*import\s*['"]([^'"]+)['"]/gm),
        ...code.matchAll(/\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g),
    ].map(match => match[1]);
    const dynamic = [...code.matchAll(/\bimport\s*\(/g)].length;
    const literalDynamic = [...code.matchAll(/\bimport\s*\(\s*['"][^'"]+['"]\s*\)/g)].length;
    assert.equal(dynamic, literalDynamic, 'dynamic import with a non-literal specifier');
    return found;
};

const allowed = specifier => {
    if (specifier === '@genrojs/tytx') return true;
    if (!specifier.startsWith('.')) return false;
    return resolve(routesDir, specifier).startsWith(routesDir.slice(0, -sep.length) + sep);
};

test('the extractor finds every import form', () => {
    const text = "import a from './a.js';\nexport {b} from '../b.js';\nimport './c.js';\nconst d = await import('./d.js');\n// import x from 'comment';\n";
    assert.deepEqual(specifiers(text), ['./a.js', '../b.js', './c.js', './d.js']);
});

test('js/src/routes/*.js import only relative files inside js/src/routes and @genrojs/tytx', () => {
    const files = readdirSync(routesDir).filter(name => name.endsWith('.js'));
    assert.ok(files.length > 0);
    for (const file of files) {
        for (const specifier of specifiers(readFileSync(routesDir + file, 'utf8'))) {
            assert.ok(allowed(specifier), `${file} imports '${specifier}'`);
        }
    }
});

test('@gramlot/gramlot/routes exposes the public names', async () => {
    const routes = await import('@gramlot/gramlot/routes');
    for (const name of ['Signature', 'ReturnValue', 'RoutingClass', 'Router', 'RouterNode', 'NotFound', 'ResultWrapper', 'isResultWrapper']) {
        assert.ok(routes[name], name);
    }
});
