/** Portable prepared-artifact integrity; hosts provide bytes, never filesystem paths. */
const encoder = new TextEncoder();
const wrapper = id => `export {default} from "./collection.js";\nexport const buildId = "${id}";\n`;
const pathValid = value => typeof value === 'string' && value.length > 0 &&
    !/[\\\x00-\x1f:?#%]/.test(value) && !value.split('/').some(part => !part || part === '.' || part === '..');
function validate(metadata, files) {
    if (!metadata || typeof metadata.name !== 'string' || !metadata.name ||
        !['grammar', 'commands', 'module'].every(key => pathValid(metadata[key])) ||
        !Array.isArray(metadata.css) || !metadata.css.every(pathValid) ||
        !Array.isArray(metadata.dependencies) || !metadata.dependencies.every(name => typeof name === 'string' && name.length > 0) ||
        !Array.isArray(metadata.files) || !metadata.files.every(pathValid) ||
        new Set(metadata.files).size !== metadata.files.length || !(files instanceof Map) ||
        files.size !== metadata.files.length || metadata.files.some(path => !(files.get(path) instanceof Uint8Array)) ||
        [metadata.grammar, metadata.commands, metadata.module, ...metadata.css].some(path => !files.has(path))) {
        throw new TypeError('Invalid collection artifact metadata or file inventory');
    }
}
/** Compute the version-1 framed fingerprint, normalizing only the fixed wrapper identity. */
export async function collectionBuildId(metadata, files) {
    validate(metadata, files);
    const chunks = [encoder.encode('gramlot-build-v1\0')];
    const record = (tag, value) => {
        const bytes = typeof value === 'string' ? encoder.encode(value) : value;
        chunks.push(encoder.encode(`${tag}\0${bytes.length}\0`), bytes);
    };
    for (const key of ['name', 'grammar', 'commands', 'module']) record(key, metadata[key]);
    for (const value of metadata.css) record('css', value);
    for (const value of metadata.dependencies) record('dependency', value);
    const compare = (a, b) => {
        const left = encoder.encode(a), right = encoder.encode(b);
        for (let i = 0; i < Math.min(left.length, right.length); i++) if (left[i] !== right[i]) return left[i] - right[i];
        return left.length - right.length;
    };
    for (const path of [...metadata.files].sort(compare)) {
        record('path', path);
        record('content', path === metadata.module ? wrapper('__GRAMLOT_BUILD_ID__') : files.get(path));
    }
    const input = new Uint8Array(chunks.reduce((total, chunk) => total + chunk.length, 0));
    let offset = 0;
    for (const chunk of chunks) { input.set(chunk, offset); offset += chunk.length; }
    const hash = await crypto.subtle.digest('SHA-256', input);
    return 'sha256:' + [...new Uint8Array(hash)].map(value => value.toString(16).padStart(2, '0')).join('');
}
/** Reject a changed wrapper, missing/extra file, or any content/metadata fingerprint mismatch. */
export async function verifyCollectionArtifact(metadata, files) {
    validate(metadata, files);
    if (typeof metadata.buildId !== 'string' || !/^sha256:[a-f0-9]{64}$/.test(metadata.buildId)) {
        throw new TypeError('Invalid collection buildId');
    }
    const expected = encoder.encode(wrapper(metadata.buildId)), actual = files.get(metadata.module);
    if (actual.length !== expected.length || actual.some((byte, index) => byte !== expected[index])) {
        throw new Error('Invalid collection wrapper');
    }
    if (await collectionBuildId(metadata, files) !== metadata.buildId) {
        throw new Error(`Collection fingerprint mismatch: ${metadata.name}`);
    }
}
