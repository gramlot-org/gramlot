/**
 * Named logic of one Gramlot page (source plan §4.9, decision P21).
 *
 * Every logic file exports `class Logic`; its prototype methods are copied into a
 * `LogicGroup`: the root group for the page logic (group null), a child group
 * for each name of `js_requires` (`a/b` is the group `b` inside the group `a`).
 * The constructor of `Logic` never runs.
 */

/** Names that are never a group: `page` is the group's own member, `constructor` the prototype's. */
const RESERVED_GROUPS = new Set(['page', 'constructor']);

/** The segments of a group path; null is the root group. */
function groupSegments(group, resource) {
    if (group === null) return [];
    const segments = group.split('/');
    for (const segment of segments) {
        if (RESERVED_GROUPS.has(segment)) {
            throw new Error(`${resource}: a logic group cannot be named '${segment}' (group '${group}')`);
        }
    }
    return segments;
}

/** Words after which a `/` starts a regular expression literal, not a division. */
const REGEX_AFTER_WORDS = new Set([
    'return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void', 'throw', 'case', 'do', 'else', 'yield', 'await',
]);

/** Whether a `/` after the significant token `previous` ('' at the start) starts a regular expression literal. */
function regexStarts(previous) {
    if (/^[\w$]/.test(previous)) return REGEX_AFTER_WORDS.has(previous);
    return previous !== ')' && previous !== ']';
}

/** The index of the `/` that closes the regular expression literal opened at `start`; -1 when the line has none. */
function regexEnd(source, start) {
    let inClass = false;
    for (let index = start + 1; index < source.length; index++) {
        const char = source[index];
        if (char === '\n') return -1;
        if (char === '\\') { index++; continue; }
        if (char === '[') inClass = true;
        else if (char === ']') inClass = false;
        else if (char === '/' && !inClass) return index;
    }
    return -1;
}

/**
 * Whether a class source declares an explicit constructor: a `constructor(` member
 * (bare or quoted, not `static`) at the top level of the class body. Strings, template
 * literals, regular expression literals, comments and nested blocks are skipped, so a
 * method body that mentions the word does not count. The scan index only moves forward,
 * so the scan always ends; an unterminated `/*` is not a comment.
 */
function declaresConstructor(source) {
    let depth = 0;
    let members = '';
    let previous = '';
    for (let index = source.indexOf('{'); index < source.length; index++) {
        const char = source[index];
        if (char === '/' && source[index + 1] === '/') { index = source.indexOf('\n', index); if (index < 0) break; continue; }
        if (char === '/' && source[index + 1] === '*') {
            const close = source.indexOf('*/', index + 2);
            if (close >= 0) { index = close + 1; continue; }
        }
        if (char === '/' && regexStarts(previous)) {
            const close = regexEnd(source, index);
            if (close >= 0) { index = close; previous = ')'; continue; }
        }
        if (char === '"' || char === "'" || char === '`') {
            let end = index + 1;
            while (end < source.length && source[end] !== char) end += source[end] === '\\' ? 2 : 1;
            if (depth === 1) members += source.slice(index + 1, end) === 'constructor' ? ' constructor' : ' ""';
            index = end;
            previous = ')';
            continue;
        }
        if (/[\w$]/.test(char)) {
            let end = index + 1;
            while (end < source.length && /[\w$]/.test(source[end])) end++;
            if (depth === 1) members += source.slice(index, end);
            previous = source.slice(index, end);
            index = end - 1;
            continue;
        }
        if (!/\s/.test(char)) previous = char;
        if (char === '{') { if (++depth === 2) members += ' {}'; continue; }
        if (char === '}') { depth--; continue; }
        if (depth === 1) members += char;
    }
    return /(?<![\w$.#])(?<!\bstatic\s+)constructor\s*\(/.test(members);
}

/** The `[name, function]` pairs of a Logic class, after the §4.9 rules; errors name the resource. */
function logicMethods(logicClass, resource) {
    if (typeof logicClass !== 'function' || !/^class\b/.test(Function.prototype.toString.call(logicClass))) {
        throw new Error(`${resource}: the module exports no class Logic`);
    }
    if (Object.getPrototypeOf(logicClass) !== Function.prototype || Object.getPrototypeOf(logicClass.prototype) !== Object.prototype) {
        throw new Error(`${resource}: class Logic cannot extend another class`);
    }
    if (declaresConstructor(Function.prototype.toString.call(logicClass))) {
        throw new Error(`${resource}: class Logic cannot declare a constructor; state lives on the group or the page`);
    }
    const methods = [];
    for (const key of Reflect.ownKeys(logicClass.prototype)) {
        if (key === 'constructor') continue;
        if (typeof key === 'symbol') throw new Error(`${resource}: class Logic cannot declare symbol keys (${String(key)})`);
        const descriptor = Object.getOwnPropertyDescriptor(logicClass.prototype, key);
        if (descriptor.get || descriptor.set) throw new Error(`${resource}: class Logic cannot declare the accessor '${key}'`);
        if (typeof descriptor.value !== 'function') throw new Error(`${resource}: Logic.prototype.${key} is not a method`);
        if (key === 'page') throw new Error(`${resource}: a logic method cannot be named 'page'`);
        methods.push([key, descriptor.value]);
    }
    return methods;
}

/** Define an own, enumerable member of a group: also `__proto__` or an Object.prototype name stays a plain member. */
function defineMember(group, name, value) {
    Object.defineProperty(group, name, {value, writable: true, enumerable: true, configurable: true});
}

/** One group of named logic. Its own member is `page` only: the namespace belongs to the author. */
export class LogicGroup {
    #registry;
    #page;

    constructor(registry, page) {
        this.#registry = registry;
        this.#page = page;
    }

    /** The Gramlot instance of the group. */
    get page() {
        return this.#page;
    }
}

/** Registry of the named logic of one Gramlot instance; builds the root group as `gramlot.logic`. */
export class LogicRegistry {
    #gramlot;
    #resources = new Map();

    constructor(gramlot) {
        this.#gramlot = gramlot;
        gramlot.logic = new LogicGroup(this, gramlot);
    }

    get gramlot() {
        return this.#gramlot;
    }

    /**
     * Check the Logic classes of a page before its Gramlot instance exists (§4.12 step 2bis, Q12.2):
     * the rules of `register` over all the entries, `[{logicClass, group, resource}]`, together.
     */
    static check(entries) {
        const children = new Map();
        for (const {group, resource} of entries) {
            const segments = groupSegments(group, resource);
            for (let index = 0; index < segments.length; index++) {
                const parent = segments.slice(0, index).join('/');
                if (!children.has(parent)) children.set(parent, new Set());
                children.get(parent).add(segments[index]);
            }
        }
        for (const {logicClass, group, resource} of entries) {
            const names = children.get(group ?? '') ?? new Set();
            for (const [name] of logicMethods(logicClass, resource)) {
                if (names.has(name)) {
                    throw new Error(`${resource}: the logic method '${name}' has the name of a child group`);
                }
            }
        }
    }

    /**
     * Copy the methods of `logicClass` into the group `group` (a `js_requires` name, `a/b` nested,
     * or null for the page logic), creating the groups on the way. On an equal method name in
     * the same group the last registration wins.
     */
    register(logicClass, {group = null, resource}) {
        const segments = groupSegments(group, resource);
        const methods = logicMethods(logicClass, resource);
        let target = this.#gramlot.logic;
        for (const segment of segments) {
            const member = Object.getOwnPropertyDescriptor(target, segment)?.value;
            if (member === undefined) {
                const child = new LogicGroup(this, this.#gramlot);
                defineMember(target, segment, child);
                target = child;
            } else if (member instanceof LogicGroup) {
                target = member;
            } else {
                throw new Error(`${resource}: the group '${segment}' has the name of a logic method`);
            }
        }
        for (const [name, method] of methods) {
            if (Object.getOwnPropertyDescriptor(target, name)?.value instanceof LogicGroup) {
                throw new Error(`${resource}: the logic method '${name}' has the name of a child group`);
            }
            defineMember(target, name, method);
        }
        if (!this.#resources.has(target)) this.#resources.set(target, []);
        this.#resources.get(target).push(resource);
    }

    /**
     * `'business.calcolaSconto'` → `{group, method}`: the caller runs `method.call(group, …)`.
     * A missing name is an error naming the node and the resource; never an inline fallback.
     */
    resolve(name, node) {
        const segments = name.split('.');
        const methodName = segments.pop();
        let group = this.#gramlot.logic;
        for (let index = 0; index < segments.length; index++) {
            group = Object.getOwnPropertyDescriptor(group, segments[index])?.value;
            if (!(group instanceof LogicGroup)) {
                throw new Error(`${node.nodeTag} '${node.label}': named logic '${name}' not found: ` +
                    `no resource was registered for the group '${segments.slice(0, index + 1).join('/')}'`);
            }
        }
        const method = Object.getOwnPropertyDescriptor(group, methodName)?.value;
        if (typeof method !== 'function') {
            const resources = this.#resources.get(group) ?? [];
            const owner = segments.length ? `the group '${segments.join('/')}'` : 'the page logic';
            throw new Error(`${node.nodeTag} '${node.label}': named logic '${name}' not found: ` +
                `${owner} has no method '${methodName}' (resources: ${resources.join(', ') || 'none'})`);
        }
        return {group, method};
    }
}
