import test from 'node:test';
import assert from 'node:assert/strict';
import {toTytx, fromTytx} from '@genrojs/tytx';
import {Page} from '../src/server/page.js';
import {GramlotServer} from '../src/server/gramlot-server.js';
import {UploadTarget} from '../src/server/upload.js';

const envelope = (type, name, params) => toTytx({id:crypto.randomUUID(),pageId:'p',contentType:type,name,params});

test('host identity is read-only on a fresh Page and isolated in concurrent calls', async () => {
    let entered = 0, release;
    const ready = new Promise(resolve => { release = resolve; });
    class IdentityPage extends Page {
        async inspect({identity}) {
            const before = this.requestIdentity;
            assert.throws(() => {this.requestIdentity = 'forged';}, TypeError);
            if (++entered === 2) release();
            await ready;
            return {before, after:this.requestIdentity, client:identity};
        }
    }
    IdentityPage.registerEndpoint('inspect');
    const server = new GramlotServer();
    server.pages.set('p', {PageClass:IdentityPage, owner:'owner', expires:performance.now()+10000});
    const invoke = async identity => fromTytx(await server.call(envelope('data','inspect',{identity:'forged'}), {owner:'owner',identity})).value;
    const [a,b] = await Promise.all([invoke('alice'),invoke('bob')]);
    assert.deepEqual(a, {before:'alice',after:'alice',client:'forged'});
    assert.deepEqual(b, {before:'bob',after:'bob',client:'forged'});
});

test('upload operation receives the host identity, including null when absent', async () => {
    class Sink extends UploadTarget {
        constructor(identity) { super({maxBytes:0}); this.identity = identity; }
        write() {} finish() { return {state:'completed',result:this.identity}; }
        abort() { return {state:'unsaved'}; } status() { return {state:'pending'}; }
    }
    class IdentityPage extends Page { receive() { return new Sink(this.requestIdentity); } }
    IdentityPage.registerUpload('receive');
    const server = new GramlotServer({uploadsEnabled:true});
    server.pages.set('p', {PageClass:IdentityPage, owner:'owner', expires:performance.now()+10000});
    for (const identity of ['alice', null]) {
        const params = {operation:'receive', metadata:{name:'x',size:0,mediaType:'',context:{},fields:{identity:'forged'}}};
        const grant = fromTytx(await server.call(envelope('upload','prepare',params), {owner:'owner',identity})).value;
        const transfer = server.admitUpload({pageId:'p',owner:'owner',identity,...grant});
        assert.equal((await transfer.finish()).result, identity);
    }
});
