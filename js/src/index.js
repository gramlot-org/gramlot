/* @ts-self-types="./index.d.ts" */
/**
 * The browser entry point of Gramlot: declarative HTML and SVG interfaces with live data binding.
 * It exports the page instance (`Gramlot`), the bootstrap that starts it, the builder and the
 * renderers, the transport, the four handlers and `gramlot.utl.inout`, and re-exports `Bag` and `BagNode` from the Bag library.
 *
 * @module
 */
export {Gramlot} from './gramlot.js';
export {Handler} from './handlers/handler.js';
export {SourceHandler} from './handlers/source-handler.js';
export {RpcHandler} from './handlers/rpc-handler.js';
export {DomHandler} from './handlers/dom-handler.js';
export {UtilitiesHandler} from './handlers/utilities-handler.js';
export {PageBootstrap} from './bootstrap.js';
// A page module served for its Logic imports @gramlot/gramlot/page; the bootstrap import map points it here.
export {Page} from './server/page.js';
export {GramlotBuilder} from './builder/gramlot-builder.js';
export {GramlotRenderer} from './renderer/gramlot-renderer.js';
export {GramlotHtmlRenderer} from './renderer/gramlot-html-renderer.js';
export {GramlotSvgRenderer} from './renderer/gramlot-svg-renderer.js';
export {Bag, BagNode} from '@genrojs/bag';
export {References} from './references.js';
export {MainTransport} from './transport.js';
export {InOut} from './inout.js';
