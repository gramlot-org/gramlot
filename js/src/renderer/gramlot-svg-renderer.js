import {SvgRenderer, svgAttributes} from '@genrojs/builders';
import {
    boundaryAttributes, domNames, requireNoScriptAttributes, textValue, withoutBindingAttributes, withoutNullValues,
} from './attributes.js';

// SVG elements written `<tag … />`, as the Python SvgRenderer of Builder (the grammar gives them no children).
const SVG_VOID_TAGS = new Set([
    'animate', 'animateMotion', 'animateTransform', 'circle',
    'ellipse', 'feBlend', 'feColorMatrix', 'feComposite',
    'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
    'feDistantLight', 'feDropShadow', 'feFlood', 'feGaussianBlur',
    'feImage', 'feMergeNode', 'feMorphology', 'feOffset',
    'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
    'feTurbulence', 'image', 'line', 'metadata', 'path', 'polygon',
    'polyline', 'rect', 'set', 'stop', 'use',
]);

/**
 * The renderer of the SVG nodes of a Gramlot Source, owned by a GramlotHtmlRenderer.
 * Attributes: Builder's `svgAttributes`, no style shortcuts, Gramlot names. Output: a string
 * under a string owner, the owner's DOM under the live GramlotRenderer.
 */
export class GramlotSvgRenderer extends SvgRenderer {
    constructor(builder, owner) {
        super(builder);
        this._owner = owner;
    }

    get owner() { return this._owner; }

    /**
     * Builder's meta on the attributes with the `==` evaluated by the owner, with no `on<event>` and no
     * `javascript:` URL; a sub-builder boundary node keeps its attributes literal, with the Gramlot filters and names.
     */
    _handleMeta(node, runtimeAttrs) {
        const evaluated = this.owner.evaluateExpressions(node, runtimeAttrs);
        requireNoScriptAttributes(node, evaluated);
        const [tag, attrs] = super._handleMeta(node, evaluated);
        return node._getMeta('subbuilder') ? [tag, svgAttributes(boundaryAttributes(attrs))] : [tag, attrs];
    }

    /** `_meta`, binding attributes and null values out; Builder's `svgAttributes`; Gramlot names. */
    adaptAttrs(attrs) {
        const {_meta, ...rest} = attrs;
        return domNames(super.adaptAttrs(withoutNullValues(withoutBindingAttributes(rest))));
    }

    /** The owner's DOM element under the live renderer; otherwise the SVG string, `_text` as node text. */
    renderedItem(node, item, runtimeAttrs, opts = {}) {
        if (this.owner.renderType === 'object') return this.owner.renderedItem(node, item, runtimeAttrs, opts);
        const {_text, ...attrs} = runtimeAttrs;
        item = this.owner.expressionValue(node, item);
        if (Array.isArray(item) && _text != null) item = [this._escapeText(textValue(_text)), ...item];
        if (SVG_VOID_TAGS.has(opts.tag)) {
            const indent = opts.pretty ? '  '.repeat(this._nodeDepth(node, opts.depthOffset ?? 0)) : '';
            return `${indent}<${opts.tag}${this._formatAttrs(attrs)} />${opts.pretty ? '\n' : ''}`;
        }
        return super.renderedItem(node, item, attrs, opts);
    }
}
