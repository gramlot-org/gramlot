import {SourceBag, META_ATTRS, resolveRenderTag, sourceAttributeItems, SvgBuilder, pointerTransform} from '@genrojs/builders';
import {ControlAdapter} from './controls.js';
import {SVG_NS, XHTML_NS} from '../renderer/attributes.js';
import {requireNoScriptAttributes, requireStyleClassAttributes} from '../renderer/attributes.js';
import {webcomponentCode} from '../webcomponent.js';

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
 * HTML elements of an HTML document, including embedded SVG elements. Grammar stays on the builder; attribute
 * names and style arrive adapted by the renderers (GramlotHtmlRenderer, GramlotSvgRenderer).
 */
export class HtmlElement {
    constructor({metadataAttributes = [], invokeScript = null, callLogic = null} = {}) {
        this.invokeScript = invokeScript;
        this.callLogic = callLogic;
        this.metadataAttributes = new Set([...META_ATTRS, '_text', ...metadataAttributes]);
    }

    definition(node) {
        const builder = node.builder;
        const declaration = builder.schema[builder.schemaTag(node.nodeTag)];
        const meta = {...declaration._meta, ...node.getAttr('_meta')};
        const tag = node.nodeTag === 'webcomponent' ? webcomponentCode(node.getAttr()) : resolveRenderTag(node.nodeTag, {
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
            if (key === 'value' && this.definition(node).meta.gramlot_component) continue;
            if (this.metadataAttributes.has(key) || ['ask', '_ask'].includes(key) || (value && typeof value === 'object' && Object.hasOwn(value, '$gramlotRef'))) continue;
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
        if (meta.gramlot_component && element.constructor.gramlotComponent?.tag !== tag) {
            throw new Error(`Component collection must be activated before rendering ${tag}`);
        }
        if (meta.gramlot_component?.dataScope) {
            element.readDataScope = () => {
                if (!node.getAttr('datapath')) throw new Error('Data scope requires an explicit datapath');
                return node.getRelativeData('.');
            };
        }
        if (meta.gramlot_component?.sourceContext) {
            element.setSourceContext({
                publish: (topic, payload) => node.publish(topic, payload),
                writeParameter: (name, value) => this.writeParameter(node, name, value),
                callLogic: (name, keywords) => this.callLogic(node, name, keywords),
            });
        }
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

    /**
     * Write `value`, produced in the DOM, through the attribute `name` of `node`: the one DOM → Data
     * rule, used by component parameters and by ControlAdapter.commit. Only a plain reactive `^`
     * pointer writes; a literal, a `=` pointer and a pointer with a suffix write nothing (no inverse
     * conversion, 11.81). A value equal (`Object.is`) to the Data value is not written, as the legacy
     * `setAttributeInDatasource` with `lazySet`: a null value on a missing path creates no Data node.
     */
    writeParameter(node, name, value) {
        const pointer = node.getAttr(name);
        if (node.pointerType(pointer) === '^' && !pointerTransform(pointer)
            && !Object.is(node.getRelativeData(pointer.slice(1)), value)) {
            node.setRelativeData(pointer.slice(1), value);
        }
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
        if (node.nodeTag === 'script') {
            for (const [name, code] of node.codeAttributes()) {
                if (node.activatedCode(name) !== code) {
                    throw new Error(`script '${node.label}': '${name}' runs only as received with the Source`);
                }
            }
        }
        const {element, text} = record;
        const isHtml = element.namespaceURI === XHTML_NS;
        const renderAttributes = this.definition(node).meta.render_attributes ?? {};
        const previous = record.attrs ?? {};
        const adapt = values => {
            requireNoScriptAttributes(node, values, node.builder.constructor.dialectPrefixes);
            requireStyleClassAttributes(node, values, node.builder.constructor.dialectPrefixes);
            return node.builder.renderer_html.adaptAttrs(values);
        };
        const parent = node.parentNode;
        if (parent?._getMeta('gramlot_component')?.childParameters) {
            const Parent = element.ownerDocument.defaultView.customElements.get(parent._getMeta('render_tag'));
            attrs = Parent.projectChild(element, attrs, {
                adapt,
                invoke: (name, code, keywords) => this.invokeScript(node, name, code, keywords),
                publish: (topic, payload) => node.publish(topic, payload),
                publishParent: (topic, payload) => parent.publish(topic, payload),
                writeParameter: (name, value) => this.writeParameter(node, name, value),
                remove: () => node.parentBag.popNode(node.label),
            });
        }
        if (this.definition(node).meta.gramlot_component) {
            if (this.definition(node).meta.gramlot_component.bagStore) {
                element.setStoreBag(node.getRelativeData(node.getAttr('storepath')));
            }
            attrs = element.projectAttributes(attrs, adapt);
        }
        attrs = Object.fromEntries(sourceAttributeItems({...attrs, ...renderAttributes}));
        const controlled = ControlAdapter.classFor(element, attrs) !== null;
        if (textValue === DEFAULT_TEXT) textValue = this.text(node);
        const nextText = textValue == null ? '' : String(textValue);
        if (text.data !== nextText) text.data = nextText;
        const keys = [...new Set([...Object.keys(previous), ...Object.keys(attrs)])];
        // The browser reads `sandbox` when `src` or `srcdoc` starts a navigation: `sandbox` is written first.
        keys.sort((a, b) => (b === 'sandbox') - (a === 'sandbox'));
        for (const key of keys) {
            if (this.metadataAttributes.has(key) || ['ask', '_ask'].includes(key) || (controlled && key === 'value')) continue;
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
