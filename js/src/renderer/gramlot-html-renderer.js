import {HtmlBuilder, HtmlRenderer, SvgBuilder, sourceAttributeItems} from '@genrojs/builders';
import {GramlotSvgRenderer} from './gramlot-svg-renderer.js';
import {
    SVG_NS, XHTML_NS, boundaryAttributes, displayItem, domNames, isExpression, requireNoExpressionTemplate,
    requireNoScriptAttributes, splitNativeAttributes, textValue, withDataSrcdocSandbox, withoutBindingAttributes,
    withoutNullValues,
} from './attributes.js';

/**
 * The string renderer of a Gramlot Source, the same class as the Python GramlotHtmlRenderer.
 * It carries the Gramlot attribute rules on Builder's HtmlRenderer: style shortcuts, the parent-dialect
 * prefix, noConvertStyle, DOM names, `mask`, `_text` as node text and the document wrapper.
 * The live GramlotRenderer extends it and replaces only the output.
 */
export class GramlotHtmlRenderer extends HtmlRenderer {
    // noConvertStyle attributes taken out in _handleMeta, put back after adaptAttrs.
    #nativeAttributes = new WeakMap();
    // The `==` node value computed by evaluateExpressions, read when the node text is written.
    #expressionValues = new WeakMap();

    /** The compiler of the `==` expressions: a string renderer has none and writes no `==` (S09). */
    get inlineCompiler() { return null; }

    /** HTML nodes (GramlotBuilder, HtmlBuilder) → this renderer; SVG nodes → one GramlotSvgRenderer owned by it. */
    getRender(builder) {
        if (!this.renders.has(builder)) {
            if (builder instanceof HtmlBuilder) this.addRender(builder, this);
            else if (builder instanceof SvgBuilder) this.addRender(builder, new GramlotSvgRenderer(builder, this));
        }
        return super.getRender(builder);
    }

    /** A data-element renders nothing: recognized before runtimeValues (R08, revision 10). */
    render(node, opts = {}) {
        if (node._getMeta('data_element')) return null;
        return super.render(node, opts);
    }

    /**
     * Builder's meta; then the noConvertStyle attributes of the tag are set aside, because adaptAttrs
     * has no tag. A sub-builder boundary node keeps its attributes literal, with the Gramlot filters and
     * names; the `html` boundary inside SVG is a `foreignObject` in the SVG namespace. No attribute
     * makes the browser run a text: no `on<event>`, no `javascript:` URL, no `srcdoc` from Data without `sandbox`.
     */
    _handleMeta(node, runtimeAttrs) {
        const prefixes = this.builder.constructor.dialectPrefixes;
        const evaluated = this.evaluateExpressions(node, runtimeAttrs);
        requireNoScriptAttributes(node, evaluated, prefixes);
        const [tag, attrs] = super._handleMeta(node, withDataSrcdocSandbox(node, evaluated, prefixes));
        if (node._getMeta('subbuilder')) {
            const boundary = boundaryAttributes(attrs);
            if (node._getMeta('subbuilder') === 'html') boundary.xmlns = SVG_NS;
            return [tag, boundary];
        }
        const [rest, native] = splitNativeAttributes(tag, attrs);
        if (Object.keys(native).length) this.#nativeAttributes.set(node, native);
        return [tag, rest];
    }

    /**
     * Step 3 of Q11.2 on the attributes of `node` resolved by runtimeValues, for HTML and SVG nodes: every
     * `==` attribute, and a `==` node value, evaluated by the page's InlineCompiler (§4.10); without a
     * compiler they are null and nothing is written. A template using a `==` attribute is an error.
     */
    evaluateExpressions(node, runtimeAttrs) {
        requireNoExpressionTemplate(node);
        const compiler = this.inlineCompiler;
        const evaluate = (attr, expr) => (compiler ? compiler.compileExpression(node, attr, expr)(runtimeAttrs) : null);
        const attrs = {...runtimeAttrs};
        for (const [name, raw] of sourceAttributeItems(node.getAttr())) {
            if (isExpression(raw) && Object.hasOwn(attrs, name)) attrs[name] = evaluate(name, raw);
        }
        if (isExpression(node.value)) this.#expressionValues.set(node, evaluate('', node.value));
        return attrs;
    }

    /** The node text of `node`: its `==` value computed by evaluateExpressions, otherwise `item`. */
    expressionValue(node, item) {
        return isExpression(node.value) ? this.#expressionValues.get(node) ?? null : item;
    }

    /** `attrs` with the noConvertStyle attributes set aside by _handleMeta for `node`, null values excluded. */
    restoreNativeAttributes(node, attrs) {
        const native = this.#nativeAttributes.get(node);
        if (!native) return attrs;
        this.#nativeAttributes.delete(node);
        return {...attrs, ...withoutNullValues(native)};
    }

    /**
     * `_meta`, binding attributes and null values out; `html_<name>` is the literal attribute `<name>`
     * and `gramlot_<name>` an error; Builder's style shortcuts on the rest; DOM names.
     */
    adaptAttrs(attrs) {
        const {_meta, ...rest} = attrs;
        const own = `${this.builder.constructor._name}_`;
        const prefixes = this.builder.constructor.dialectPrefixes;
        const literal = {};
        const styled = {};
        for (const [name, value] of Object.entries(withoutBindingAttributes(rest))) {
            if (value == null) continue;
            if (name.startsWith(own)) {
                throw new Error(`${name}: the attribute prefix '${own}' is not accepted; use the prefix '${prefixes[0]}'`);
            }
            const prefix = prefixes.find(candidate => name.startsWith(candidate));
            if (prefix) literal[name.slice(prefix.length)] = value;
            else styled[name] = value;
        }
        return domNames({...super.adaptAttrs(styled), ...literal});
    }

    /** The HTML string of one node: noConvertStyle put back, display directives consumed, `_text` as node text. */
    renderedItem(node, item, runtimeAttrs, opts = {}) {
        let attrs;
        [item, attrs] = displayItem(this.expressionValue(node, item), this.restoreNativeAttributes(node, runtimeAttrs));
        const {_text, ...rest} = attrs;
        if (Array.isArray(item) && _text != null) item = [this._escapeText(textValue(_text)), ...item];
        const shown = node.parentNode?._getMeta('subbuilder') === 'html' ? {xmlns: XHTML_NS, ...rest} : rest;
        return super.renderedItem(node, item, shown, opts);
    }

    /** Builder's finalize; `doctype` prepends `<!doctype html>` and wraps the output in `<html>` when the root is not `html`. */
    finalize(result, target = null, opts = {}) {
        if (!opts.doctype) return super.finalize(result, target, opts);
        let text = this._composeStringFragments(result);
        const roots = this.builder.source.getNodes().filter(node => !node._getMeta('data_element'));
        if (!(roots.length === 1 && roots[0].nodeTag === 'html')) text = `<html>${text}</html>`;
        return super.finalize(`<!doctype html>${text}`, target, opts);
    }
}
