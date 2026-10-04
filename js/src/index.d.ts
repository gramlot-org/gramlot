/**
 * The browser entry point of Gramlot: declarative HTML and SVG interfaces with live data binding.
 * It exports the page instance (`Gramlot`), the bootstrap that starts it, the builder and the
 * renderers, the transport and `gramlot.inout`, and re-exports `Bag` and `BagNode` from the Bag library.
 *
 * @module
 */
export {Gramlot} from './gramlot.js';
export type {GramlotOptions, GramlotState} from './gramlot.js';
export {PageBootstrap} from './bootstrap.js';
export type {PageBootstrapOptions, PageResources} from './bootstrap.js';
export {Page, source} from './adapters/page.js';
export {GramlotBuilder} from './builder/gramlot-builder.js';
export {GramlotRenderer} from './renderer/gramlot-renderer.js';
export {GramlotHtmlRenderer} from './renderer/gramlot-html-renderer.js';
export {GramlotSvgRenderer} from './renderer/gramlot-svg-renderer.js';
export {Bag, BagNode} from '@genrojs/bag';
export {References} from './references.js';
export type {SourceReference} from './references.js';
export {MainTransport} from './transport.js';
export type {Fetcher} from './transport.js';
export {InOut} from './inout.js';
export type {BeaconNavigator, DomDocument, DomElement, DomFragment, DomNode} from './dom.d.ts';
