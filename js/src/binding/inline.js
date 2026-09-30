import {sourceAttributeItems} from '@jsr/genro__builders';
import {isExpression, templateParameters} from '../renderer/attributes.js';

/**
 * Inline code of one Gramlot page (source plan §4.10): the `formula`/`script` bodies, `_if`/`_else`
 * and the `==` expressions, compiled with `this` = the Source node. Imported only by the page runtime:
 * never by `adapters/*`, `builder/*` or a WorkerHost, so a page with named logic only runs under a
 * CSP without `'unsafe-eval'`.
 *
 * The legacy macros are a deprecated compatibility preprocessor: the regexes of `gnrlang.js`
 * (`argumentsReplace`, `macroExpand_*`, the order of `funcCreate`), with the node methods as target.
 * As in legacy, a macro inside a string or a comment is translated too.
 */

// Legacy `funcCreate` order after `argumentsReplace`: GET, SET, PUT, FIRE_AFTER, PUBLISH, FIRE.
const MACROS = [
    [null, /(\W|^)GET (?:\s*)(\^?[\w.#@$?-]+)/g, "$1this.GET('$2')"],
    [/;SET/g, /(\W|^)SET (?:\s*)(\^?[\w.#@$?-]+)(?:\s*)=(?:\s*)([^;\r\n]*)(;?)/gm, "$1this.SET('$2', $3)$4 "],
    [/;PUT/g, /(\W|^)PUT (?:\s*)(\^?[\w.#@$?-]+)(?:\s*)=(?:\s*)([^;\r\n]*)(;?)/gm, "$1this.PUT('$2', $3)$4 "],
    [/;FIRE_AFTER/g, /(\W|^)FIRE_AFTER (?:\s*)(\^?[\w.#@$?-]+)(?:\s*)=(?:\s*)([^;\r\n]*)(;?)/g, "$1this.FIRE_AFTER('$2', $3)$4 "],
    [/;FIRE_AFTER/g, /(\W|^)FIRE_AFTER (?:\s*)(\^?[\w.#@$?-]+)(?:\s*)(;?)/g, "$1this.FIRE_AFTER('$2')$3 "],
    [/;FIRE/g, /(\W|^)FIRE (?:\s*)(\^?[\w.#@$?-]+)(?:\s*)=(?:\s*)([^;\r\n]*)(;?)/g, "$1this.FIRE('$2', $3)$4 "],
    [/;FIRE/g, /(\W|^)FIRE (?:\s*)(\^?[\w.#@$?-]+)(?:\s*)(;?)/g, "$1this.FIRE('$2')$3 "],
];
const PUBLISH = /(\W|^)PUBLISH (?:\s*)(\^?[\w.#@$?-]+)/;

// Names that cannot be a parameter: they stay readable from `_kwargs` only.
const RESERVED = new Set([
    'arguments', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default',
    'delete', 'do', 'else', 'enum', 'eval', 'export', 'extends', 'false', 'finally', 'for', 'function',
    'if', 'implements', 'import', 'in', 'instanceof', 'interface', 'let', 'new', 'null', 'package',
    'private', 'protected', 'public', 'return', 'static', 'super', 'switch', 'this', 'throw', 'true',
    'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
]);

export class InlineCompiler {
    #runtime;
    // node → Map(attr → {source, text, key, run}): one compiled function per declaration.
    #cache = new Map();

    constructor(runtime) {
        this.#runtime = runtime;
    }

    get runtime() { return this.#runtime; }
    /** Number of compiled declarations. */
    get size() { return [...this.#cache.values()].reduce((total, entries) => total + entries.size, 0); }

    /**
     * The legacy macros of `source` translated to the node methods, `$n` to `arguments[n-1]`, as in
     * `gnrlang.js`. A translated declaration gets one deprecation warning; `PUBLISH` is an error.
     */
    preprocess(node, attr, source) {
        const text = source.trim();
        if (PUBLISH.test(text)) throw new Error(`${declaration(node, attr)}: the PUBLISH macro is excluded from Gramlot 0.2.0`);
        let result = text.replace(/\$(\d+)/g, (_token, n) => `arguments[${parseInt(n, 10) - 1}]`);
        for (const [separator, macro, target] of MACROS) {
            if (separator) result = result.replace(separator, `; ${separator.source.slice(1)}`);
            result = result.replace(macro, target);
        }
        if (result !== text) {
            console.warn(`${declaration(node, attr)}: legacy macros are deprecated; write this.GET(path), `
                + 'this.SET(path, value), this.PUT(path, value), this.FIRE(path, value), this.FIRE_AFTER(path, value) '
                + 'and arguments[n] in place of GET, SET, PUT, FIRE, FIRE_AFTER and $n');
        }
        return result;
    }

    /**
     * The function of the declaration `attr` of `node`: `run(values)` calls the compiled `source` with
     * `this` = node and the parameters `argNames`, each read from `values`. A name that is not a valid
     * JS identifier is not a parameter. A text starting with `function` is the function itself, as in
     * legacy. One compilation per declaration: a new text or new names compile again; the entry is
     * released when its attribute changes or is removed, and when the node's NodeBinding closes.
     */
    compile(node, attr, source, argNames) {
        let entries = this.#cache.get(node);
        if (!entries) {
            entries = new Map();
            this.#cache.set(node, entries);
            this.runtime.bindingFor(node).track(() => this.release(node));
        }
        let entry = entries.get(attr);
        if (entry?.source !== source) {
            entry = {source, text: this.preprocess(node, attr, source), key: null, run: null};
            entries.set(attr, entry);
        }
        const params = argNames.filter(isIdentifier);
        const key = params.join(',');
        if (entry.key !== key) {
            const fn = create(node, attr, entry.text, params);
            entry.key = key;
            entry.run = values => fn.apply(node, params.map(name => values[name]));
        }
        return entry.run;
    }

    /**
     * The function of the `==` expression of the attribute `attr` of `node` (`''` for the node value):
     * `run(resolved)` evaluates it on the attributes resolved by runtimeValues. Its arguments are the
     * other attributes of the node, except the other `==` (Q11.2): the resolved value, or, for an
     * attribute a template consumed, its pointer resolved from Data (D6). A consumed attribute that is
     * itself a template has no value: an expression using it is an error naming both attributes.
     */
    compileExpression(node, attr, expr) {
        const items = sourceAttributeItems(node.getAttr()).filter(([, raw]) => !isExpression(raw));
        const run = this.compile(node, attr, `return ${expr}`, items.map(([name]) => name));
        return resolved => {
            const values = {};
            for (const [name, raw] of items) {
                if (Object.hasOwn(resolved, name)) {
                    values[name] = resolved[name];
                } else if (templateParameters(raw).length) {
                    // Only a parameter can be used by name; the text of the expression is searched for it.
                    if (isIdentifier(name) && new RegExp(`(?<![\\w$])${name.replaceAll('$', '\\$')}(?![\\w$])`).test(expr)) {
                        throw new Error(`${node.nodeTag} '${node.label}': '${attr}' uses '${name}', a template consumed by `
                            + 'another template, whose value is not available; write a dataFormula');
                    }
                } else {
                    values[name] = node.pointerType(raw) ? node.getRelativeData(raw) : raw;
                }
            }
            return run(values);
        };
    }

    /**
     * Release the compiled declarations of `node`: those of the attributes `names` (Source names; `''`
     * is the node value, `_if`/`_else`/`formula`/`script` their own), or all of them when `names` is null.
     */
    release(node, names = null) {
        if (names === null) {
            this.#cache.delete(node);
            return;
        }
        const entries = this.#cache.get(node);
        if (!entries) return;
        for (const name of names) {
            entries.delete(name);
            // A `==` declaration is kept under the name runtimeValues gives the attribute (`_class` → `class`).
            for (const [resolved] of sourceAttributeItems({[name]: null})) entries.delete(resolved);
        }
    }
}

function isIdentifier(name) {
    return /^[A-Za-z_$][\w$]*$/.test(name) && !RESERVED.has(name);
}

function declaration(node, attr) {
    return `${node.nodeTag} '${node.label}' ${attr ? `'${attr}'` : 'node value'}`;
}

/**
 * The Function of `text`; a syntax error names the declaration and quotes the preprocessed text. A CSP
 * without `'unsafe-eval'` makes the browser refuse `new Function` with an EvalError (Q3): the error names
 * the declaration and points to named logic or to the permissive profile.
 */
function create(node, attr, text, params) {
    try {
        if (text.startsWith('function')) return new Function(`return (${text}\n)`)();
        return new Function(...params, `${text}\n`);
    } catch (error) {
        if (error instanceof EvalError) {
            throw new EvalError(`${declaration(node, attr)}: inline code blocked by the Content Security Policy of the page `
                + `(no 'unsafe-eval'); move the code to named logic (a method of the page companion _aux.js) `
                + `or serve the page with the permissive CSP profile, which allows 'unsafe-eval'`, {cause: error});
        }
        throw new SyntaxError(`${declaration(node, attr)}: ${error.message} in the inline code:\n${text}`, {cause: error});
    }
}
