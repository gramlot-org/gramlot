// Attribute rules shared by GramlotHtmlRenderer, GramlotSvgRenderer and the live GramlotRenderer.
// Same table and same functions as src/gramlot/renderer/attributes.py (source plan §1 rule 10).
import {sourceAttributeItems} from '@jsr/genro__builders';

export const XHTML_NS = 'http://www.w3.org/1999/xhtml';
export const SVG_NS = 'http://www.w3.org/2000/svg';

// Binding attributes are read by the Gramlot runtime and never reach the output (source plan, S02).
// The names are the resolved ones: runtimeValues turns the keyword names `_if`/`_else` into `if`/`else`.
const BINDING_ATTRIBUTES = new Set([
    'default', 'default_value', 'live', 'group', 'visible', 'action', 'fire',
    'if', 'else', '_init', '_onStart', '_onBuilt', '_delay', '_timing', '_userChanges',
]);
const BINDING_ATTRIBUTE_PREFIXES = ['default_', 'attr_', 'fire_', 'connect_on'];

// Legacy noConvertStyle (genro_wdg.js:102-108): these attributes stay native attributes, never style.
const NATIVE_ATTRIBUTES = {
    table: ['width', 'border'],
    editor: ['height'],
    embed: ['width', 'height'],
    img: ['width', 'height'],
    canvas: ['width', 'height'],
};

// A `${name}` template reference; `\${` stays text (Builder's runtimeValues rule).
const TEMPLATE_REFERENCE = /(?<!\\)\$\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;

// Display directives of the node text: consumed by the renderer, never written as attributes.
const DISPLAY_ATTRIBUTES = ['format', 'mask', 'locale', 'places', 'dtype'];

/** The attributes of `attrs` that are not binding attributes. */
export function withoutBindingAttributes(attrs) {
    return Object.fromEntries(Object.entries(attrs).filter(([name]) => !BINDING_ATTRIBUTES.has(name)
        && !BINDING_ATTRIBUTE_PREFIXES.some(prefix => name.startsWith(prefix))));
}

/** The attributes of `attrs` whose value is neither null nor undefined. */
export function withoutNullValues(attrs) {
    return Object.fromEntries(Object.entries(attrs).filter(([, value]) => value != null));
}

/** DOM attribute names: `data_*`/`aria_*` → `data-*`/`aria-*`, `xmlns_x` → `xmlns:x`. */
export function domNames(attrs) {
    return Object.fromEntries(Object.entries(attrs).map(([name, value]) => {
        if (name.startsWith('xmlns_')) return [`xmlns:${name.slice(6)}`, value];
        if (name.startsWith('data_') || name.startsWith('aria_')) return [name.replaceAll('_', '-'), value];
        return [name, value];
    }));
}

/** The attributes of a sub-builder boundary node: no dialect adaptation, only the Gramlot filters and names. */
export function boundaryAttributes(attrs) {
    const {_meta, ...rest} = attrs;
    return domNames(withoutNullValues(withoutBindingAttributes(rest)));
}

/** `[attrs, native]`: the noConvertStyle attributes of `tag` taken out of `attrs`. */
export function splitNativeAttributes(tag, attrs) {
    const names = NATIVE_ATTRIBUTES[String(tag).toLowerCase()] ?? [];
    const rest = {};
    const native = {};
    for (const [name, value] of Object.entries(attrs)) {
        if (names.includes(name)) native[name] = value;
        else rest[name] = value;
    }
    return [rest, native];
}

/** The node text of a scalar value: booleans as `true`/`false`, as in JavaScript. */
export function textValue(value) {
    return String(value);
}

/**
 * `[item, attrs]` with the display directives consumed (HTML only).
 * `format`, `places`, `locale` and `dtype` do not format the text in 0.2.0. `mask` follows the
 * legacy rule (gnrlang.js asText): `%s` replaced by the value, no mask when the value is empty.
 */
export function displayItem(item, attrs) {
    const rest = {...attrs};
    const mask = rest.mask;
    for (const name of DISPLAY_ATTRIBUTES) delete rest[name];
    if (Array.isArray(item)) return [item, rest];
    if (typeof item === 'boolean') item = textValue(item);
    if (mask == null) return [item, rest];
    const text = item == null ? '' : textValue(item);
    return [text === '' ? text : String(mask).replaceAll('%s', () => text), rest];
}

/** The parameter names of the `${name}` templates of `value`, in order; none for a value that is not a string. */
export function templateParameters(value) {
    return typeof value === 'string' ? [...value.matchAll(TEMPLATE_REFERENCE)].map(([, name]) => name) : [];
}

/** Whether `value` is a `==` expression (Q11.2). */
export function isExpression(value) {
    return typeof value === 'string' && value.startsWith('==');
}

/**
 * Templates and `==` expressions do not mix (Q11.2): a template that uses a `==` attribute of the same
 * node is an error naming both attributes; a `${…}` inside a `==` attribute or node value is an error
 * naming it.
 */
export function requireNoExpressionTemplate(node) {
    if (isExpression(node.value) && templateParameters(node.value).length) {
        throw new Error(`${node.nodeTag} '${node.label}': the == node value contains a \${…} template, not accepted in a == expression`);
    }
    const attrs = Object.fromEntries(sourceAttributeItems(node.getAttr()));
    for (const [name, raw] of Object.entries(attrs)) {
        if (isExpression(raw) && templateParameters(raw).length) {
            throw new Error(`${node.nodeTag} '${node.label}': '${name}' contains a \${…} template, not accepted in a == expression`);
        }
        for (const param of templateParameters(raw)) {
            if (isExpression(attrs[param])) {
                throw new Error(`${node.nodeTag} '${node.label}': the template of '${name}' uses '${param}', a == expression`);
            }
        }
    }
}
