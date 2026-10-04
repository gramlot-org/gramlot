/**
 * The string renderer of a Gramlot Source.
 *
 * @module
 */
import {HtmlRenderer} from '@genrojs/builders';
import type {SourceBagNode} from '@genrojs/builders';

/**
 * The string renderer of a Gramlot Source. It carries the Gramlot attribute rules on the builder
 * `HtmlRenderer`: style shortcuts, the parent-dialect prefix, DOM names, `_text` as node text and
 * the document wrapper. The live `GramlotRenderer` extends it and replaces only the output.
 */
export class GramlotHtmlRenderer extends HtmlRenderer {
    /** The compiler of the `==` expressions: a string renderer has none. */
    get inlineCompiler(): unknown;
    /** HTML nodes render with this renderer; SVG nodes with one `GramlotSvgRenderer` owned by it. */
    getRender(builder: unknown): unknown;
    /** Render a node; a data-element renders nothing. */
    render(node: SourceBagNode, opts?: Record<string, unknown>): unknown;
    /** The tag and attributes of a node, with the expressions evaluated and no script attributes. */
    _handleMeta(node: SourceBagNode, runtimeAttrs: Record<string, unknown>): [string, Record<string, unknown>];
    /** Evaluate the `==` attributes and node value through the inline compiler; without one they are null. */
    evaluateExpressions(node: SourceBagNode, runtimeAttrs: Record<string, unknown>): Record<string, unknown>;
    /** The value of the node text, after the `==` evaluation. */
    expressionValue(node: SourceBagNode, item: unknown): unknown;
    /** Put the noConvertStyle attributes of a node back among its attributes. */
    restoreNativeAttributes(node: SourceBagNode, attrs: Record<string, unknown>): Record<string, unknown>;
    /** The attributes with Gramlot style shortcuts, prefixes and DOM names applied. */
    // deno-lint-ignore no-explicit-any
    adaptAttrs(attrs: any): any;
    /** The HTML string of one node. */
    renderedItem(node: SourceBagNode, item: unknown, runtimeAttrs: Record<string, unknown>,
        opts?: Record<string, unknown>): string;
    /** Finish the output; the `doctype` option prepends the doctype and wraps in `<html>` when needed. */
    finalize(result: unknown, target?: unknown, opts?: Record<string, unknown>): unknown;
}
