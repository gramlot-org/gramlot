import {BagResolver, BagCbResolver} from '@genrojs/bag';
import {sourceAttributeItems} from '@genrojs/builders';

/** Split an authored attribute pointer. Names exclude colon; only the first one separates. */
export function pointerTransform(value) {
    if (typeof value !== 'string' || !/^[\^=](?!=)/.test(value)) return null;
    const index = value.indexOf(':');
    if (index < 0) return null;
    const expression = value[index + 1] === '=';
    return {pointer: value.slice(0, index), expression, body: value.slice(index + (expression ? 2 : 1))};
}

const SLOT = /^\{(\??[A-Za-z_][A-Za-z0-9_]*|\?)?\}/;

function failure(node, name, message) {
    return new Error(`${node.nodeTag} '${node.label}': '${name}': ${message}`);
}

/** Templates are text. Braces delimit slots; no code or inferred expression mode. */
export function pointerTemplate(body, read) {
    let result = '', blocked = false;
    for (let i = 0; i < body.length;) {
        if (body[i] !== '{' && body[i] !== '}') { result += body[i++]; continue; }
        const match = body.slice(i).match(SLOT);
        if (!match) throw new SyntaxError('Invalid pointer template placeholder');
        const slot = match[1] ?? '';
        const optional = slot.startsWith('?');
        const value = read(optional ? slot.slice(1) : slot);
        if (value == null || (value === '' && !optional)) blocked = true;
        else result += String(value);
        i += match[0].length;
    }
    return blocked ? null : result;
}

/**
 * Replace slots only in expression code, never in quoted strings, comments or regex literals.
 * This scans lexical boundaries; InlineCompiler remains the sole JavaScript evaluator.
 * Empty objects and one-name shorthand objects coincide with slots: use explicit object members.
 */
export function pointerExpression(body) {
    const slots = [], identifiers = new Set();
    let text = '', operand = true;
    for (let i = 0; i < body.length;) {
        const start = i, c = body[i];
        if (c === '"' || c === "'" || c === '`') {
            i++;
            while (i < body.length) {
                if (body[i] === '\\') { i += 2; continue; }
                if (body[i++] === c) break;
            }
            text += body.slice(start, i); operand = false; continue;
        }
        if (body.startsWith('//', i)) {
            i = body.indexOf('\n', i); if (i < 0) i = body.length;
            text += body.slice(start, i); continue;
        }
        if (body.startsWith('/*', i)) {
            const end = body.indexOf('*/', i + 2);
            i = end < 0 ? body.length : end + 2;
            text += body.slice(start, i); continue;
        }
        if (c === '/' && operand) {
            let bracket = false; i++;
            while (i < body.length) {
                const current = body[i++];
                if (current === '\\') { i++; continue; }
                if (current === '[') bracket = true;
                else if (current === ']') bracket = false;
                else if (current === '/' && !bracket) break;
            }
            while (/[a-z]/i.test(body[i] ?? '') && i < body.length) i++;
            text += body.slice(start, i); operand = false; continue;
        }
        const slot = c === '{' ? body.slice(i).match(SLOT) : null;
        if (slot) {
            const name = slot[1] ?? '';
            if (name.startsWith('?')) throw new SyntaxError('Optional slots are supported in pointer templates only');
            text += `_pointerValues[${slots.length}]`;
            slots.push(name); i += slot[0].length; operand = false; continue;
        }
        const word = body.slice(i).match(/^[A-Za-z_$][\w$]*/);
        if (word) {
            identifiers.add(word[0]); text += word[0]; i += word[0].length;
            operand = ['return', 'typeof', 'void', 'delete', 'new', 'in', 'instanceof', 'yield', 'await'].includes(word[0]);
            continue;
        }
        text += c; i++;
        if (!/\s/.test(c)) operand = /[([{,:;=!?&|+*%~<>\/-]/.test(c);
    }
    return {text, slots, identifiers};
}

/** Source-attribute dependencies of a suffix, including referenced helper declarations. */
export function pointerDependencies(node, raw, seen = new Set()) {
    const transform = pointerTransform(raw);
    const names = [];
    if (transform?.expression) names.push(...pointerExpression(transform.body).slots.filter(Boolean));
    else if (transform) pointerTemplate(transform.body, name => { if (name) names.push(name); return ''; });
    else if (typeof raw === 'string' && raw.startsWith('==')) names.push(...pointerExpression(raw.slice(2)).identifiers);
    else if (typeof raw === 'string') names.push(...[...raw.matchAll(/(?<!\\)\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g)].map(match => match[1]));
    const attrs = new Map(sourceAttributeItems(node.getAttr()));
    for (const name of names) {
        if (seen.has(name) || !attrs.has(name)) continue;
        seen.add(name); pointerDependencies(node, attrs.get(name), seen);
    }
    return seen;
}

/** A per-resolution dependency graph; Source itself remains authored and unchanged. */
function attributeReader(node, items, context = node) {
    const values = new Map(), active = new Set(), consumed = new Set();
    const compiler = node.rootBuilder.binding?.inlineCompiler;
    // Resolve the complete Source attribute set before applying any suffix. Projection
    // and named references share these typed values; the DOM is never an input.
    const current = new Map();
    for (const [name, raw] of items) {
        if (typeof name !== 'string') continue;
        const pointer = pointerTransform(raw)?.pointer ?? raw;
        current.set(name, pointer instanceof BagResolver ? pointer.resolve()
            : node.pointerType(pointer) ? context.getRelativeData(pointer) : pointer);
    }
    const resolve = name => {
        if (values.has(name)) return values.get(name);
        if (!items.has(name)) throw failure(node, name, 'referenced Source attribute does not exist');
        if (active.has(name)) throw failure(node, name, `cyclic attribute dependency: ${[...active, name].join(' -> ')}`);
        active.add(name);
        const raw = items.get(name), transform = pointerTransform(raw);
        const leading = transform ? current.get(name) : null;
        let result;
        const read = key => {
            if (!key) return leading;
            return resolve(key);
        };
        try {
            if (transform) {
                if (transform.expression) {
                    const {text, slots} = pointerExpression(transform.body);
                    // Validate references even in static output; JavaScript only executes in the browser.
                    const inputs = slots.map(read);
                    result = compiler ? compiler.compilePointerExpression(node, name, raw, text)(inputs) : null;
                } else {
                    result = pointerTemplate(transform.body, read);
                    // A null leading pointer blocks even a constant template.
                    if (leading == null) result = null;
                }
            } else if (typeof raw === 'string' && raw.startsWith('==')) {
                const names = pointerExpression(raw.slice(2)).identifiers;
                const args = {};
                for (const key of names) if (key !== name && key !== '_F' && items.has(key)) args[key] = resolve(key);
                result = compiler ? compiler.compile(node, name, raw, [...Object.keys(args), '_F'],
                    `return (${raw.slice(2)}\n)` )({...args, _F: (value, options) => node.rootBuilder.binding.gramlot.format(value, options)}) : null;
            } else {
                result = current.get(name);
                if (typeof result === 'string' && !node._getMeta('data_element')) {
                    result = result.replace(/(\\)?\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (token, escaped, key) => {
                        if (escaped) return token.slice(1);
                        consumed.add(key); return String(resolve(key) ?? '');
                    });
                }
            }
            values.set(name, result);
            return result;
        } finally { active.delete(name); }
    };
    return {resolve, consumed, current};
}

/**
 * Builder's runtimeToEvaluate hook accepts Bag resolvers as already typed values. Use that
 * existing hook so a result beginning with ^ or = is not read a second time as a pointer.
 * These ephemeral callbacks are never installed on Source/Data or serialized.
 */
export function preparePointerItems(node, items) {
    const transformed = [...items].filter(([name, raw]) => typeof name === 'string' && pointerTransform(raw));
    if (!transformed.length) return items;
    const reader = attributeReader(node, items);
    // Keep the original declarations available until every transform has resolved.
    const results = new Map(transformed.map(([name]) => [name, reader.resolve(name)]));
    for (const [name, raw] of items) {
        if (typeof name !== 'string' || pointerTransform(raw)) continue;
        if (raw instanceof BagResolver || node.pointerType(raw)) {
            const result = reader.current.get(name);
            items.set(name, new BagCbResolver(() => result));
        }
    }
    for (const [name] of transformed) {
        const result = results.get(name);
        items.set(name, new BagCbResolver(() => result));
    }
    if (!node._getMeta('data_element')) for (const name of reader.consumed) items.delete(name);
    return items;
}

/** Resolve a control/structural attribute with the same rules as visual projection. */
export function resolvePointerAttribute(node, name, context = node) {
    const items = new Map([...Object.entries(node.getAttr()), ...sourceAttributeItems(node.getAttr())]);
    return attributeReader(node, items, context).resolve(name);
}
