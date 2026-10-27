import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CommandRegistry} from '../src/commands.js';
import {defineCollection} from '../src/components/registry.js';

test('collection hook has identical isolated preparation and page semantics', () => {
    const collection = defineCollection({name:'documenti', components:[], registerCommands(gramlot) {
        const group = gramlot.commands.registerGroup('documenti', {author:'Project'});
        group.register('save', {label:'Save', publish:'save', iconSrc:'/icons/save.svg'});
    }});
    const first = new CommandRegistry(), second = new CommandRegistry();
    collection.registerCommands({commands:first});
    assert.equal(second.get('documenti:save'), undefined);
    collection.registerCommands({commands:second});
    assert.deepEqual(first.toDocument(), second.toDocument());
    assert.equal(first.get('documenti:save').publish, 'save');
    assert.equal(first.toDocument().groups.documenti.commands.save.iconSrc,'/icons/save.svg');
    assert.throws(() => collection.registerCommands({commands:first}), /Duplicate command namespace/);
});

test('command collisions and executable/unsupported metadata are rejected', () => {
    const registry = new CommandRegistry(), group = registry.registerGroup('docs');
    group.register('save', {label:'Save', publish:'save'});
    assert.throws(() => group.register('save', {label:'Again', publish:'again'}), /Duplicate command/);
    assert.throws(() => group.register('bad', {label:'Bad', publish:() => {}}), /Invalid command definition/);
    assert.throws(() => group.register('extra', {label:'Extra', publish:'extra', checked:true}), /Invalid command/);
    assert.throws(() => registry.registerGroup(''), /namespace/);
});

test('resource and dependency declarations retain URL objects and reject strings', () => {
    const base = defineCollection({name:'common', components:[]});
    const url = new URL('./style.css', import.meta.url);
    const extension = defineCollection({name:'docs', components:[], dependencies:[base], css:[url], assets:{logo:url}});
    assert.equal(extension.dependencies[0], base);
    assert.equal(extension.assets.logo, url);
    assert.throws(() => defineCollection({name:'bad', components:[], css:['./style.css']}), /URL objects/);
});
