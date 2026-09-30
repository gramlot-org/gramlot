import {SourceBag, META_ATTRS, resolveRenderTag, sourceAttributeItems, SvgBuilder} from '@jsr/genro__builders';
import {ControlAdapter} from './controls.js';
import {SVG_NS, XHTML_NS} from '../renderer/attributes.js';

const DEFAULT_TEXT = Symbol('source text');
const ATTRIBUTE_NS = {
    xmlns: 'http://www.w3.org/2000/xmlns/',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
};

// Attribute presence and native property reflection are DOM concerns. The active grammar owns
// which attributes a declaration accepts.
const BOOLEAN_PROPERTIES = new Set([
    'allowFullscreen', 'async', 'autofocus', 'autoplay', 'checked', 'controls', 'default',
    'defer', 'disabled', 'formNoValidate', 'hidden', 'inert', 'isMap', 'itemscope', 'loop',
    'multiple', 'muted', 'noModule', 'noValidate', 'open', 'playsInline', 'readOnly',
    'required', 'reversed', 'selected',
]);
const REFLECTED_PROPERTIES = new Set(['checked', 'muted', 'selected', 'value']);
const PROPERTY_NAMES = new Map([
    ['allowfullscreen', 'allowFullscreen'], ['formnovalidate', 'formNoValidate'],
    ['ismap', 'isMap'], ['nomodule', 'noModule'], ['novalidate', 'noValidate'],
    ['playsinline', 'playsInline'], ['readonly', 'readOnly'],
]);

function domPropertyName(name) {
    const camel = name.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
    return PROPERTY_NAMES.get(camel.toLowerCase()) ?? camel;
}

/**
 * Native elements in HTML documents, including embedded SVG. Grammar stays on the builder; attribute
 * names and style arrive adapted by the renderers (GramlotHtmlRenderer, GramlotSvgRenderer).
 */
export class HtmlElement {
    constructor({metadataAttributes = []} = {}) {
        this.metadataAttributes = new Set([...META_ATTRS, '_text', ...metadataAttributes]);
    }

    definition(node) {
        const builder = node.builder;
        const declaration = builder.schema[builder.schemaTag(node.nodeTag)];
        const meta = {...declaration._meta, ...node.getAttr('_meta')};
        const tag = resolveRenderTag(node.nodeTag, {
            renderTag: meta.render_tag, ns: node.getAttr('ns'),
            dialectName: builder.constructor._name,
        });
        // A foreignObject is an SVG element even when its descendants use an HTML builder.
        const namespace = tag === 'foreignObject' ? SVG_NS
            : meta.render_attributes?.xmlns ?? node.getAttr('xmlns')
            ?? (builder instanceof SvgBuilder ? SVG_NS : XHTML_NS);
        return {meta, namespace, tag};
    }

    validate(node, builder = node.builder) {
        const branch = node.value instanceof SourceBag;
        const text = branch ? node.getAttr('_text') : node.value;
        if (text != null && !['string', 'number', 'boolean'].includes(typeof text)) {
            throw new TypeError('HTML text must be scalar');
        }
        for (const [key, value] of Object.entries(node.attr)) {
            if (this.metadataAttributes.has(key)) continue;
            if (value != null && !['string', 'number', 'boolean'].includes(typeof value)) {
                throw new TypeError(`HTML attribute ${key} must be scalar`);
            }
        }
        const declaredAttrs = Object.fromEntries(Object.entries(node.attr)
            .filter(([key]) => !this.metadataAttributes.has(key)));
        const childTags = branch
            ? node.value.getNodes().map(child => child.nodeTag).filter(Boolean)
            : [];
        builder.validateNode(node, {value: text, attrs: declaredAttrs, childTags});
    }

    create(node, document, tag = null, attrs = node.attr, visible = null) {
        const {tag: defaultTag, namespace, meta} = this.definition(node);
        tag ??= defaultTag;
        const element = namespace === XHTML_NS
            ? document.createElement(tag) : document.createElementNS(namespace, tag);
        const text = document.createTextNode(this.text(node));
        if (namespace !== XHTML_NS || !meta.void) element.append(text);
        const record = {element, text, tag};
        this.update(record, node, attrs, DEFAULT_TEXT, visible);
        return record;
    }

    matches(record, node) {
        const {tag, namespace} = this.definition(node);
        return (namespace === XHTML_NS ? record.tag.toLowerCase() === tag.toLowerCase() : record.tag === tag)
            && record.element.namespaceURI === namespace;
    }

    compose(record, text, children) {
        record.text.data = text ?? '';
        for (const child of children) record.element.append(child);
    }

    /**
     * Apply `attrs` and the text; the declaration's `render_attributes` win. `visible === false`
     * sets `style.visibility = 'hidden'` after the attributes, so a `style` change keeps it; any
     * other value gives the current `style` back (V1, legacy genro_wdg.js). The `value` of a form
     * control belongs to its ControlAdapter: neither the attribute nor the property is written here.
     */
    update(record, node, attrs = node.attr, textValue = DEFAULT_TEXT, visible = null) {
        const {element, text} = record;
        const isHtml = element.namespaceURI === XHTML_NS;
        const renderAttributes = this.definition(node).meta.render_attributes ?? {};
        const previous = record.attrs ?? {};
        attrs = Object.fromEntries(sourceAttributeItems({...attrs, ...renderAttributes}));
        const controlled = ControlAdapter.classFor(element, attrs) !== null;
        if (textValue === DEFAULT_TEXT) textValue = this.text(node);
        const nextText = textValue == null ? '' : String(textValue);
        if (text.data !== nextText) text.data = nextText;
        for (const key of new Set([...Object.keys(previous), ...Object.keys(attrs)])) {
            if (this.metadataAttributes.has(key) || (controlled && key === 'value')) continue;
            const value = attrs[key];
            const attrName = key;
            const propertyName = domPropertyName(attrName);
            const isBoolean = isHtml && BOOLEAN_PROPERTIES.has(propertyName)
                && typeof element[propertyName] === 'boolean';
            const prefix = attrName === 'xmlns' ? 'xmlns'
                : (attrName.includes(':') ? attrName.split(':')[0] : '');
            const namespace = Object.hasOwn(ATTRIBUTE_NS, prefix) ? ATTRIBUTE_NS[prefix] : null;
            if (!Object.is(previous[key], value)) {
                if (value == null || (isBoolean && !value)) {
                    if (namespace) element.removeAttributeNS(namespace, attrName.split(':').at(-1));
                    else element.removeAttribute(attrName);
                } else if (namespace) element.setAttributeNS(namespace, attrName, String(value));
                else element.setAttribute(attrName, isBoolean ? '' : String(value));
            }
            if (isHtml && (isBoolean || REFLECTED_PROPERTIES.has(propertyName)) && propertyName in element) {
                const target = propertyName === 'value' ? (value == null ? '' : String(value)) : Boolean(value);
                if (element[propertyName] !== target) element[propertyName] = target;
            }
        }
        if (visible === false) {
            if (element.style.visibility !== 'hidden') element.style.visibility = 'hidden';
        } else if (record.visible === false) {
            if (attrs.style == null) element.removeAttribute('style');
            else element.setAttribute('style', String(attrs.style));
        }
        record.visible = visible;
        // Retain what was applied, including metadata, so later updates can remove it.
        record.attrs = attrs;
    }

    text(node) {
        if (node.value instanceof SourceBag) {
            return node.getAttr('_text') == null ? '' : String(node.attr._text);
        }
        return node.value == null ? '' : String(node.value);
    }
}
