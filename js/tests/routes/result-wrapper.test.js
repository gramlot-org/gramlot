/* ResultWrapper, resultWrapper and isResultWrapper. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {RoutingClass, ResultWrapper, isResultWrapper} from '../../src/routes/index.js';

// test_coverage_gaps.py:992 test_result_wrapper
test('ResultWrapper holds value and metadata and isResultWrapper recognises it', () => {
    const wrapper = new ResultWrapper('test_value', {mime: 'text/plain'});
    assert.equal(wrapper.value, 'test_value');
    assert.deepEqual(wrapper.metadata, {mime: 'text/plain'});
    assert.equal(isResultWrapper(wrapper), true);
    assert.equal(isResultWrapper('not a wrapper'), false);
    assert.equal(isResultWrapper(null), false);
    assert.equal(isResultWrapper({value: 'x', metadata: {}}), false);
});

// test_coverage_gaps.py:1002 test_routing_class_result_wrapper_method
test('resultWrapper wraps a value with metadata', () => {
    class Svc extends RoutingClass {}
    const result = new Svc().resultWrapper('content', {mediaType: 'application/json'});
    assert.ok(result instanceof ResultWrapper);
    assert.equal(result.value, 'content');
    assert.deepEqual(result.metadata, {mediaType: 'application/json'});
});

test('resultWrapper metadata defaults to an empty object', () => {
    class Svc extends RoutingClass {}
    assert.deepEqual(new Svc().resultWrapper('content').metadata, {});
});

// test_router_runtime_extras.py:193 shape: a handler returns the wrapper and the call returns it as is
test('a routed handler can return a wrapper through a node call', () => {
    class Svc extends RoutingClass {
        page() { return this.resultWrapper('<p>x</p>', {mediaType: 'text/html'}); }
    }
    Svc.registerRoute('page');
    const result = new Svc().route.node('page').call();
    assert.equal(isResultWrapper(result), true);
    assert.equal(result.metadata.mediaType, 'text/html');
});
