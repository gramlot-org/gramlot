/**
 * The standard collections, carried by the runtime bundle (owner direction, gramlot-org/gramlot#82).
 *
 * A page loads the runtime file and no file of a standard collection. The bundle holds no third-party
 * package: a library a component needs (ECharts, Plotly, Vega, uPlot, CodeMirror, Jodit, ProseMirror,
 * xterm, write-excel-file, markdown-it) loads on first use through `loadLibrary` from the module
 * `@gramlot/libraries/<name>` (GC-325 §160). The prepared artifact of a bundled collection reads the
 * collection from the runtime (`sharedModules`), so a page holds one copy of it.
 *
 * @module
 */
import inputs from './components/inputs.js';
import layout from './components/layout.js';
import tree from './components/tree.js';
import grid from './components/grid.js';
import editors from './components/editors.js';
import grouplets from './components/grouplets.js';
import chat from './components/chat.js';
import charts from './components/charts.js';
import audio from './components/audio.js';
import drawing from './components/drawing.js';
import uploads from './components/uploads.js';

export const bundledCollections = Object.freeze([inputs, layout, tree, grid, editors, grouplets, chat, charts, audio, drawing,
    uploads]);
