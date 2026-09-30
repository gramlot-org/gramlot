/** Resource names and bootstrap load order; no file lookup and no HTTP engine.
 * The Python counterpart is src/gramlot/server/resources.py; both apply the same
 * rules. css_requires/js_requires names are interpreted by a Host with a resource
 * system, not by the core.
 */
/** One segment of a resource or page name. */
export const SEGMENT = /^[A-Za-z0-9_-]+$/;
const EXTENSION = /^[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)+$/;
// Unicode White_Space property (U+FEFF excluded); the Python parser strips the same characters.
export const SPACES = '\u0009\u000a\u000b\u000c\u000d \u0085  ' +
    '           ' +
    '    　';

/** A page declares its resources in an invalid way. */
export class InvalidResourceName extends Error {}

function checkName(name) {
    if (name.includes(':')) throw new InvalidResourceName(`Resource name "${name}": 'name:media' is not supported`);
    const segments = name.split('/');
    if (segments.some(segment => EXTENSION.test(segment))) {
        throw new InvalidResourceName(`Resource name "${name}": names have no extension`);
    }
    if (!segments.every(segment => SEGMENT.test(segment))) {
        throw new InvalidResourceName(`Invalid resource name "${name}": use '/'-separated segments ` +
            "of letters, digits, '_' or '-'");
    }
}

/** Strip the SPACES characters at both ends, as Python str.strip(SPACES). */
function stripSpaces(text) {
    let start = 0, end = text.length;
    while (start < end && SPACES.includes(text[start])) start++;
    while (end > start && SPACES.includes(text[end - 1])) end--;
    return text.slice(start, end);
}

/** Parse css_requires/js_requires: comma-separated resource names.
 * Spaces around a name (SPACES), empty tokens and later duplicates are ignored.
 */
export function parseRequires(text) {
    if (typeof text !== 'string') throw new InvalidResourceName('Resource requirements must be a comma-separated string');
    const names = [];
    for (const token of text.split(',')) {
        const name = stripSpaces(token);
        if (!name || names.includes(name)) continue;
        checkName(name);
        names.push(name);
    }
    return names;
}

/** Keep each key once, in its last position. */
function lastOccurrence(items, key) {
    const last = new Map(items.map((item, index) => [key(item), index]));
    return items.filter((item, index) => last.get(key(item)) === index);
}

/** {css: [url], js: [{url, group}]} with each URL once, in its last position.
 * The same JS URL with two different groups raises InvalidResourceName (C03):
 * it is the same file declared under two names.
 */
export function loadOrder(resources) {
    const groups = new Map();
    for (const entry of resources.js) {
        if (!groups.has(entry.url)) groups.set(entry.url, entry.group);
        const group = groups.get(entry.url);
        if (group !== entry.group) {
            throw new InvalidResourceName(`JS resource "${entry.url}" is declared with two groups: ` +
                `${JSON.stringify(group)} and ${JSON.stringify(entry.group)}`);
        }
    }
    return {css: lastOccurrence(resources.css, url => url), js: lastOccurrence(resources.js, entry => entry.url)};
}
