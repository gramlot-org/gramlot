// Attribute rules shared by GramlotHtmlRenderer, GramlotSvgRenderer and the live GramlotRenderer.
// Same table and same functions as src/gramlot/renderer/attributes.py (source plan §1 rule 10).
import {sourceAttributeItems} from '@genrojs/builders';
import {applyMask} from '../format.js';

export const XHTML_NS = 'http://www.w3.org/1999/xhtml';
export const SVG_NS = 'http://www.w3.org/2000/svg';

// Binding attributes are read by the Gramlot runtime and never reach the output (source plan, S02).
// The names are the resolved ones: runtimeValues turns the keyword names `_if`/`_else` into `if`/`else`.
const BINDING_ATTRIBUTES = new Set([
    'default', 'default_value', 'live', 'group', 'visible', 'action', 'fire', 'ask', '_ask', '_ask_if', '_ask_title', '_ask_onCancel',
    'if', 'else', '_init', '_onStart', '_onBuilt', '_delay', '_timing', '_userChanges',
    'remote', '_cachedRemote', '_onRemote', '_onCalling', 'onClose', 'onEnd', 'onDrag', 'onDrop', 'dropTargetCb', 'onDragEnd',
    'dropTarget', 'dropTypes', 'dragTags', 'dropTags', 'effectAllowed', 'dropEffect', 'dragClass',
]);
const BINDING_ATTRIBUTE_PREFIXES = ['default_', 'attr_', 'fire_', 'connect_on', 'subscribe_', 'selfsubscribe_', 'formsubscribe_', 'remote_'];

// Legacy noConvertStyle (genro_wdg.js:102-108): these attributes stay native attributes, never style.
const NATIVE_ATTRIBUTES = {
    table: ['width', 'border'],
    editor: ['height'],
    embed: ['width', 'height'],
    img: ['width', 'height'],
    canvas: ['width', 'height'],
};

// Display directives of the node text: consumed by the renderer, never written as attributes.
const DISPLAY_ATTRIBUTES = ['format', 'mask', 'locale', 'timeZone', 'places', 'dtype'];

// Output URL attributes, including the native form action authored as html_action.
const URL_ATTRIBUTES = new Set(['href', 'src', 'data', 'action', 'formaction', 'xlink:href', 'xlink_href']);

/** The attributes of `attrs` that are not binding attributes. */
export function withoutBindingAttributes(attrs) {
    return Object.fromEntries(Object.entries(attrs).filter(([name, value]) => !(value && typeof value === 'object' && Object.hasOwn(value, '$gramlotRef')) && !BINDING_ATTRIBUTES.has(name)
        && !BINDING_ATTRIBUTE_PREFIXES.some(prefix => name.startsWith(prefix))));
}

/** Validate resolved style/class before composition, including literal dialect attributes. */
export function requireStyleClassAttributes(node, attrs, prefixes = []) {
    for (const [name, value] of Object.entries(attrs)) {
        const prefix = prefixes.find(candidate => name.startsWith(candidate)) ?? '';
        const bare = name.slice(prefix.length);
        if (['style', 'class', '_class'].includes(bare) && value != null && typeof value !== 'string') {
            throw new TypeError(`${node.nodeTag} '${node.label}': '${name}' must be a string or null`);
        }
    }
}

/**
 * No attribute of `attrs` (resolved, `==` evaluated) makes the browser run a text outside InlineCompiler:
 * a name starting with `on` and longer than it, the form of the native event handlers, is an error pointing
 * to `connect_on<event>`; a `javascript:` URL is an error pointing to `connect_onclick`. Every such name is
 * refused, not a list of events, so an event a browser adds is refused too. The names are read without
 * the dialect `prefixes` (`html_`).
 */
export function requireNoScriptAttributes(node, attrs, prefixes = []) {
    if (node.nodeTag === 'script') {
        const executable = [['', node.staticValue], ...sourceAttributeItems(node.getAttr()).filter(([name]) =>
            ['src', 'href', 'xlink:href', 'xlink_href', '_text'].includes(name.slice((prefixes.find(prefix => name.startsWith(prefix)) ?? '').length).toLowerCase()))];
        for (const [name, value] of executable) {
            if (node.pointerType(value) || isExpression(value)) {
                throw new Error(`script '${node.label}': '${name}' must be literal Source; script code and URLs cannot come from Data`);
            }
        }
    }
    if (attrs.onEnd != null && (node.nodeTag.toLowerCase() !== 'transformpane' || !node._getMeta('gramlot_component')?.parameters?.onEnd)) {
        throw new Error('onEnd is only supported on transformPane');
    }
    if (attrs.onClose != null && !node.parentNode?._getMeta('gramlot_component')?.childParameters?.onClose) {
        throw new Error('onClose is only supported on a tab/stack panel');
    }
    for (const [name, value] of Object.entries(withoutNullValues(withoutBindingAttributes(attrs)))) {
        const prefix = prefixes.find(candidate => name.startsWith(candidate));
        const bare = prefix ? name.slice(prefix.length) : name;
        if (/^on./i.test(bare)) {
            throw new Error(`${node.nodeTag} '${node.label}': '${name}' has the form of a native event handler, run by `
                + `the browser outside Gramlot; write connect_${bare} for an event, or rename the attribute`);
        }
        if (URL_ATTRIBUTES.has(bare.toLowerCase()) && isJavascriptUrl(value)) {
            throw new Error(`${node.nodeTag} '${node.label}': '${name}' holds a javascript: URL, run by the browser `
                + 'as code; write connect_onclick or the action of a button instead');
        }
    }
}

/** Whether `value` is a `javascript:` URL as the URL parser reads it: tabs and newlines removed, leading controls and spaces trimmed. */
function isJavascriptUrl(value) {
    return typeof value === 'string' && /^javascript:/i.test(value.replace(/[\t\n\r]/g, '').replace(/^[\u0000-\u0020]+/, ''));
}

/**
 * `attrs` of an `iframe` whose `srcdoc` comes from Data, with an empty `sandbox` first: the browser shows
 * the HTML of a datum and runs nothing of it. `srcdoc` comes from Data when it is a `^`/`=` pointer, a `==`
 * expression, or when the node value is a pointer, whose datum can carry
 * `srcdoc` in its `_wdg`. The declaration decides, so the iframe has `sandbox` while `srcdoc` is still null.
 * A `sandbox` declared in the Source stays as declared; a literal `srcdoc` gets none. The names are read
 * without the dialect `prefixes` (`html_`); `sandbox` takes the prefix of `srcdoc`.
 */
export function withDataSrcdocSandbox(node, attrs, prefixes = []) {
    if (node.nodeTag !== 'iframe') return attrs;
    const bare = name => {
        const prefix = prefixes.find(candidate => name.startsWith(candidate)) ?? '';
        return [prefix, name.slice(prefix.length).toLowerCase()];
    };
    const declared = Object.fromEntries(sourceAttributeItems(node.getAttr()));
    const srcdoc = [...Object.keys(declared), ...Object.keys(attrs)].find(name => bare(name)[1] === 'srcdoc');
    if (srcdoc === undefined || Object.keys(declared).some(name => bare(name)[1] === 'sandbox')) return attrs;
    if (node.pointerType(node.value) === null && !(Object.hasOwn(declared, srcdoc)
        && (node.pointerType(declared[srcdoc]) !== null || isExpression(declared[srcdoc])))) return attrs;
    const rest = Object.fromEntries(Object.entries(attrs).filter(([name]) => bare(name)[1] !== 'sandbox'));
    return {[`${bare(srcdoc)[0]}sandbox`]: '', ...rest};
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
 * The live page supplies its formatter; string renderers retain unformatted values.
 * Plain masks use the same {} composition as the formatter, skipping empty text.
 */
export function displayItem(item, attrs, format = null) {
    const rest = {...attrs};
    const {mask, format: pattern, locale, timeZone, dtype, places} = rest;
    for (const name of DISPLAY_ATTRIBUTES) delete rest[name];
    const display = value => {
        if (format && pattern != null) {
            if (places != null) throw new RangeError('places is not implemented; specify precision in format');
            return format(value, {pattern, mask, ...(locale == null ? {} : {locale}),
                ...(timeZone == null ? {} : {timeZone}), ...(dtype == null ? {} : {dtype})});
        }
        if (typeof value === 'boolean') value = textValue(value);
        if (mask == null) return value;
        const text = value == null ? '' : textValue(value);
        return text === '' ? text : applyMask(text, mask);
    };
    if (Array.isArray(item)) {
        if (Object.hasOwn(rest, '_text')) rest._text = display(rest._text);
        return [item, rest];
    }
    return [display(item), rest];
}

/** Whether `value` is a `==` expression (Q11.2). */
export function isExpression(value) {
    return typeof value === 'string' && value.startsWith('==');
}
