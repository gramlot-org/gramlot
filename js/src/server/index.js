/* @ts-self-types="./index.d.ts" */
/**
 * The server entry point of Gramlot: the server-side `Page` and `GramlotServer` classes, the file-based
 * reference server and the resource name helpers. It is not part of the browser entry point.
 *
 * @module
 */
// Server entry point: deliberately not re-exported by the browser entry point.
export {Page} from './page.js';
export {GramlotServer, PageExpired, PageNotFound, SourceNotFound, ServerCapacity} from './gramlot-server.js';
export {GramlotBuilder} from '../builder/gramlot-builder.js';
export {GramlotFileServer} from './gramlot-file-server.js';
export {gramlotDev, runtimeAsset} from './assets.js';
export {checkProtocol} from './conformance.js';
export {InvalidResourceName, parseRequires} from './resources.js';
