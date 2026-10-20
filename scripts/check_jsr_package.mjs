// Check the JSR package as `jsr publish` would upload it: the files listed by a dry run are copied
// with their paths into an empty folder below js/ (so that the copy resolves the dependencies of
// js/node_modules), and the server of that copy looks up the themes.
// Run from the repository root after `npm --prefix js run build`.
import {spawnSync} from 'node:child_process';
import {cp, mkdtemp, mkdir, rm} from 'node:fs/promises';
import {dirname, join, relative} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';

const root = process.cwd();
// The dry run lists the files on standard error.
const run = spawnSync('npx', ['-y', 'jsr', 'publish', '--dry-run', '--allow-dirty'],
    {cwd: root, encoding: 'utf8', env: {...process.env, NO_COLOR: '1'}});
assert.equal(run.status, 0, run.stderr);
const output = run.stdout + run.stderr;
const files = [...output.matchAll(/file:\/\/(\S+)/g)].map(match => relative(root, fileURLToPath(`file://${match[1]}`)));
assert.ok(files.includes('js/src/server/files.js'), 'the JSR package contains js/src/server/files.js');

const copy = await mkdtemp(join(root, 'js', '.jsr-package-'));
try {
    for (const file of files) {
        await mkdir(dirname(join(copy, file)), {recursive: true});
        await cp(join(root, file), join(copy, file));
    }
    const {GramlotServer} = await import(pathToFileURL(join(copy, 'js/src/server/gramlot-server.js')));
    const server = new GramlotServer();
    for (const theme of ['gramlot-base', 'gramlot-compact']) {
        const found = await server.themeFile(`/themes/${theme}/theme.css`);
        assert.equal(found && relative(copy, found).split('\\').join('/'), `js/themes/${theme}/theme.css`, theme);
    }
    assert.equal(await server.themeFile('/themes/gramlot-base/missing.css'), null, 'missing file');
    assert.equal(await server.themeFile('/themes/../package.json'), null, 'path outside the themes folder');
    assert.equal(await server.themeFile('/themes/../../jsr.json'), null, 'path outside the package');
    console.log(`JSR package: ${files.length} files; themes found below js/themes`);
} finally {
    await rm(copy, {recursive: true, force: true});
}
