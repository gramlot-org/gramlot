/** The prepared grammar of the standard collections (GC-325 §165). */
import test from 'node:test';
import assert from 'node:assert/strict';
import {standardGrammar} from '../dist/standard-grammar.js';
import {GramlotBuilder, bundledCollections, defineCollection, defineComponent} from '../src/index.js';
import {GramlotServer} from '../src/server/index.js';
import {SourceHandler} from '../src/handlers/source-handler.js';
import {Container} from '../src/components/container.js';

const byName = new Map(bundledCollections.map(collection => [collection.name, collection]));
const standard = () => standardGrammar.collections.map(name => byName.get(name));

test('the prepared grammar follows the collection graph of the servers and equals the composition of each collection', () => {
    assert.deepEqual(standardGrammar.collections, new GramlotServer().collections.map(collection => collection.name));
    assert.deepEqual([...standardGrammar.collections].sort(), [...byName.keys()].sort());
    const composed = new GramlotBuilder(null, {collections: standard()});
    assert.deepEqual(standardGrammar.document, composed._collection.toDocument());
});

test('the page builder loads the prepared grammar and composes only the collections after the standard ones', () => {
    const custom = defineCollection({name: 'trial', components: [defineComponent({name: 'trialPanel', tag: 'gramlot-trial-panel',
        base: Container, subTags: '*', implementation: Base => class extends Base {}})]});
    const collections = [...standard(), custom];
    const prepared = SourceHandler.pageBuilder(collections, undefined);
    const composed = new GramlotBuilder(null, {collections});
    assert.deepEqual(prepared._collection.toDocument(), composed._collection.toDocument());
    assert.deepEqual(prepared.schemaTagNames, composed.schemaTagNames);
    assert.equal(prepared.schemaTag('trialpanel'), 'trialPanel');
    assert.equal(prepared.schemaTag('chartbar'), 'chartBar');
});

test('a page builder whose collections do not start with the standard ones composes each collection', () => {
    const collections = [byName.get('layout'), byName.get('inputs')];
    const builder = SourceHandler.pageBuilder(collections, undefined);
    assert.deepEqual(builder._collection.toDocument(), new GramlotBuilder(null, {collections})._collection.toDocument());
    assert.equal(builder.schemaTag('chartbar'), null);
});
