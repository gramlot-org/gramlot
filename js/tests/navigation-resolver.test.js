import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag, NavigationResolver} from '../src/index.js';

test('directory resolvers load one level, retain page URLs and cache independently', async () => {
    const calls = [];
    const gramlot = {rpc: {async call(type, method, params) {
        calls.push(params.directory);
        assert.equal(type, 'data');
        assert.equal(method, 'directory');
        const result = new Bag();
        if (params.directory === 'docs') {
            result.setItem('nested', null, {directory: 'docs/nested', url: '/docs/nested/index'});
        } else result.setItem('page', null, {url: '/docs/nested/page'});
        return result;
    }}};
    const errors = [];
    const root = new Bag();
    const resolver = new NavigationResolver({gramlot, method: 'directory', directory: 'docs', onError: e => errors.push(e)});
    root.setResolver('docs', resolver);
    assert.deepEqual(calls, []);
    resolver.resolve();
    await resolver.loading;
    assert.deepEqual(calls, ['docs']);
    const nested = root.getNode('docs').staticValue.getNode('nested');
    assert.equal(nested.attr.url, '/docs/nested/index');
    assert.equal(nested.staticValue, null);
    nested.resolver.resolve();
    await nested.resolver.loading;
    resolver.resolve(); nested.resolver.resolve();
    assert.deepEqual(calls, ['docs', 'docs/nested']);
    assert.equal(nested.staticValue.getNode('page').attr.url, '/docs/nested/page');
    assert.deepEqual(errors, []);
    resolver.abort();
});

test('invalid directory replies remain retryable and abort prevents late writes', async () => {
    let release, invalid = true;
    const errors = [];
    const gramlot = {rpc: {call() {
        if (invalid) { invalid = false; return Promise.resolve([]); }
        return new Promise(resolve => { release = resolve; });
    }}};
    const bag = new Bag();
    const resolver = new NavigationResolver({gramlot, method: 'directory', directory: '', onError: e => errors.push(e)});
    bag.setResolver('root', resolver);
    resolver.resolve();
    await assert.rejects(resolver.loading, /must return a Bag/);
    assert.equal(errors.length, 1);
    resolver.resolve();
    const pending = resolver.loading;
    resolver.abort();
    release(new Bag());
    await assert.rejects(pending, {name: 'AbortError'});
    assert.equal(bag.getNode('root').staticValue, null);
    assert.equal(errors.length, 1);
});


test('directories load concurrently, repeated reads share a request, and abort settles without a transport answer', async () => {
    const calls = [], releases = new Map();
    const gramlot = {rpc: {call(type, method, {directory}) {
        calls.push(directory);
        return new Promise(resolve => releases.set(directory, resolve));
    }}};
    const errors = [], bag = new Bag();
    const first = new NavigationResolver({gramlot, method:'directory', directory:'first', onError:e=>errors.push(e)});
    const second = new NavigationResolver({gramlot, method:'directory', directory:'second', onError:e=>errors.push(e)});
    bag.setResolver('first', first); bag.setResolver('second', second);
    first.resolve(); second.resolve(); first.resolve(); second.resolve();
    assert.deepEqual(calls, ['first', 'second']);
    const abandoned = first.loading;
    first.abort();
    await assert.rejects(abandoned, {name:'AbortError'});
    const value = new Bag(); value.setItem('leaf', null, {url:'/second/leaf'});
    releases.get('second')(value); await second.loading;
    second.resolve(); first.resolve();
    assert.deepEqual(calls, ['first', 'second']);
    assert.equal(bag.getNode('first').staticValue, null);
    assert.equal(bag.getNode('second').staticValue.getNode('leaf').attr.url, '/second/leaf');
    releases.get('first')(new Bag()); await Promise.resolve();
    assert.equal(bag.getNode('first').staticValue, null);
    assert.deepEqual(errors, []);
    second.abort();
});

test('closing a loaded directory aborts its descendant request and prevents later reads from restarting it', async () => {
    const calls = [], errors = [];
    const gramlot = {rpc: {async call(type, method, {directory}) {
        calls.push(directory);
        if (directory) return new Promise(() => {});
        const value = new Bag(); value.setItem('nested', null, {directory:'nested'}); return value;
    }}};
    const root = new Bag();
    const resolver = new NavigationResolver({gramlot, method:'directory', directory:'', onError:e=>errors.push(e)});
    root.setResolver('root', resolver); resolver.resolve(); await resolver.loading;
    const child = root.getNode('root').staticValue.getNode('nested').resolver;
    child.resolve(); const abandoned = child.loading;
    resolver.abort(); await assert.rejects(abandoned, {name:'AbortError'});
    child.resolve(); resolver.resolve();
    assert.deepEqual(calls, ['', 'nested']);
    assert.equal(child.loaded, false); assert.deepEqual(errors, []);
});
