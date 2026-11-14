/**
 * The modules that the runtime shares with prepared collections.
 *
 * The collection generator keeps every module of this table out of a collection bundle: an import of
 * one of them becomes a read of this table from `@gramlot/gramlot`. A page therefore holds one copy
 * of each module, and its classes keep their identity across the runtime and the collections
 * (`instanceof Bag` holds for a Bag created by a collection).
 *
 * A key is the import specifier: the package name for a library, the path relative to this
 * directory for a runtime module. The generator refuses a collection that would bundle a module of
 * the runtime missing from this table. big.js and @xmldom/xmldom are not shared: the browser runtime
 * does not ship them (see `scripts/runtime-options.mjs`).
 *
 * @module
 */
import * as genrojsBag from '@genrojs/bag';
import * as genrojsBuilders from '@genrojs/builders';
import * as genrojsToolbox from '@genrojs/toolbox';
import * as genrojsTytx from '@genrojs/tytx';
import * as decimal from 'decimal.js';
import * as msgpack from '@msgpack/msgpack';
import * as dompurify from 'dompurify';
import * as randomId from './random-id.js';
import * as format from './format.js';
import * as librariesModule from './libraries.js';
import * as mediaFrame from './media-frame.js';
import * as validationRun from './validation-run.js';
import * as rendererAttributes from './renderer/attributes.js';
import * as viewLabelbox from './view/labelbox.js';
import * as columnFilter from './stores/column-filter.js';
import * as collectionFilter from './stores/collection-filter.js';
import * as idSet from './stores/id-set.js';
import * as bagCollectionStore from './stores/bag-collection-store.js';
import * as bagCollectionView from './stores/bag-collection-view.js';
import * as bases from './components/bases.js';
import * as choices from './components/choices.js';
import * as choiceFieldStyles from './components/choice-field-styles.js';
import * as fieldState from './components/field-state.js';
import * as gridFormulas from './components/grid-formulas.js';
import * as gridStructure from './components/grid-structure.js';
import * as labelbox from './components/labelbox.js';
import * as parameters from './components/parameters.js';
import * as popup from './components/popup.js';
import * as validation from './components/validation.js';
import * as inputs from './components/inputs.js';
import * as layout from './components/layout.js';
import * as tree from './components/tree.js';
import * as grid from './components/grid.js';
import * as editors from './components/editors.js';
import * as grouplets from './components/grouplets.js';
import * as chat from './components/chat.js';
import * as charts from './components/charts.js';
import * as audio from './components/audio.js';
import * as drawing from './components/drawing.js';
import * as uploads from './components/uploads.js';
import * as containerModule from './components/container.js';
import * as gridSearchModule from './components/grid-search.js';

export const sharedModules = Object.freeze({
    '@genrojs/bag': genrojsBag,
    '@genrojs/builders': genrojsBuilders,
    '@genrojs/toolbox': genrojsToolbox,
    '@genrojs/tytx': genrojsTytx,
    'decimal.js': decimal,
    '@msgpack/msgpack': msgpack,
    'dompurify': dompurify,
    './random-id.js': randomId,
    './format.js': format,
    './libraries.js': librariesModule,
    './media-frame.js': mediaFrame,
    './validation-run.js': validationRun,
    './renderer/attributes.js': rendererAttributes,
    './view/labelbox.js': viewLabelbox,
    './stores/column-filter.js': columnFilter,
    './stores/collection-filter.js': collectionFilter,
    './stores/id-set.js': idSet,
    './stores/bag-collection-store.js': bagCollectionStore,
    './stores/bag-collection-view.js': bagCollectionView,
    './components/bases.js': bases,
    './components/choices.js': choices,
    './components/choice-field-styles.js': choiceFieldStyles,
    './components/field-state.js': fieldState,
    './components/grid-formulas.js': gridFormulas,
    './components/grid-structure.js': gridStructure,
    './components/labelbox.js': labelbox,
    './components/parameters.js': parameters,
    './components/popup.js': popup,
    './components/validation.js': validation,
    // The collections of the runtime bundle (bundled-collections.js) and the modules they share.
    './components/inputs.js': inputs,
    './components/layout.js': layout,
    './components/tree.js': tree,
    './components/grid.js': grid,
    './components/editors.js': editors,
    './components/grouplets.js': grouplets,
    './components/chat.js': chat,
    './components/charts.js': charts,
    './components/audio.js': audio,
    './components/drawing.js': drawing,
    './components/uploads.js': uploads,
    './components/container.js': containerModule,
    './components/grid-search.js': gridSearchModule,
});
