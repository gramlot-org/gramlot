/* @ts-self-types="./index.d.ts" */
/**
 * The browser entry point of Gramlot: declarative HTML and SVG interfaces with live data binding.
 * It exports the page instance (`Gramlot`), the bootstrap that starts it, the builder and the
 * renderers, the transport, the four handlers and `gramlot.utl.inout`, and re-exports `Bag`, `BagNode` and `createDecimal` from the Bag and TYTX libraries.
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
export {Exposed, Page} from './server/page.js';
export {GramlotBuilder} from './builder/gramlot-builder.js';
export {GramlotRenderer} from './renderer/gramlot-renderer.js';
export {GramlotHtmlRenderer} from './renderer/gramlot-html-renderer.js';
export {GramlotSvgRenderer} from './renderer/gramlot-svg-renderer.js';
export {Bag, BagNode} from '@genrojs/bag';
// createDecimal and Bag are the typed literals of a page module, as in server/page.js: the import map of the browser
// resolves @gramlot/gramlot/page to this entry only.
export {createDecimal} from '@genrojs/tytx';
export {References} from './references.js';
export {HttpTransport} from './http-transport.js';
export {ServerAdapter} from './server-adapter.js';
export {RpcError} from './handlers/rpc-handler.js';
export {InOut} from './inout.js';

export {IndexPage} from './server/index-page.js';
export {IndexLogic, mountIndexPage} from './index-page-runtime.js';

export {parseDateExpression} from './date-parser/index.js';
