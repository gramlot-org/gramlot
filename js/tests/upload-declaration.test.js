import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Page, UPLOAD_METHOD, uploadMethod, endpointMethod, resolveDeclared} from '../src/server/page-base.js';

test('upload registration is separate, inherited, and respects shadows', () => {
    class Base extends Page { importSource(metadata) { return metadata; } }
    Base.registerUpload('importSource', {auth: 'editor'});
    class Child extends Base {}
    class Shadow extends Base { importSource() {} }
    assert.deepEqual(uploadMethod(new Child(), 'importSource')[UPLOAD_METHOD], {auth: 'editor'});
    assert.equal(endpointMethod(new Child(), 'importSource'), null);
    assert.ok(resolveDeclared(new Child(), 'importSource', UPLOAD_METHOD));
    assert.equal(uploadMethod(new Shadow(), 'importSource'), null);
    assert.throws(() => Base.registerEndpoint('importSource'), /conflicting declarations/);
});
