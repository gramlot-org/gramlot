/**
 * The renderer of the SVG nodes of a Gramlot Source.
 *
 * @module
 */
import {SvgRenderer} from '@genrojs/builders';
import type {SourceBagNode} from '@genrojs/builders';
import type {GramlotHtmlRenderer} from './gramlot-html-renderer.js';

/**
 * The renderer of the SVG nodes of a Gramlot Source, owned by a `GramlotHtmlRenderer`.
 * Output: a string under a string owner, the owner's DOM under the live `GramlotRenderer`.
 */
export class GramlotSvgRenderer extends SvgRenderer {
    /** Create the renderer of `builder`, owned by `owner`. */
    constructor(builder: unknown, owner: GramlotHtmlRenderer);
    /** The HTML renderer that owns this one. */
    get owner(): GramlotHtmlRenderer;
    /** The tag and attributes of a node, with the expressions evaluated by the owner. */
    _handleMeta(node: SourceBagNode, runtimeAttrs: Record<string, unknown>): [string, Record<string, unknown>];
    /** The attributes with the metadata, binding attributes and null values removed, and Gramlot names. */
    // deno-lint-ignore no-explicit-any
    adaptAttrs(attrs: any): any;
    /** The owner's DOM element under the live renderer; otherwise the SVG string. */
    renderedItem(node: SourceBagNode, item: unknown, runtimeAttrs: Record<string, unknown>,
        opts?: Record<string, unknown>): string;
}
