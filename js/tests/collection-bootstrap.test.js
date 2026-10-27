import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {PageBootstrap} from '../src/bootstrap.js';

function setup(resources) {
    const {window}=new JSDOM('<!doctype html><div id="gramlot-root"></div>',{url:'http://example.test/'});
    const bootstrap=new PageBootstrap({config:{pageId:'test'},resources,document:window.document});
    let closed=0;bootstrap.closePage=()=>{closed++;};
    return {window,bootstrap,closed:()=>closed};
}

test('stylesheet failure prevents activation and closes the registered page',async()=>{
    const {window,bootstrap,closed}=setup({css:['/missing.css'],js:[],collections:[]});
    const running=bootstrap.run();
    assert.equal(window.gramlot,undefined);
    window.document.querySelector('link').dispatchEvent(new window.Event('error'));
    await assert.rejects(running,/missing.css: stylesheet load failed/);
    assert.equal(closed(),1);
});

test('a bad fingerprint rejects the graph before any collection activates',async()=>{
    const marker='__gramlot_activation_probe';globalThis[marker]=0;
    const code=`export const buildId='sha256:${'b'.repeat(64)}';export default {name:'docs',register(){globalThis.${marker}++;}};`;
    const url='data:text/javascript,'+encodeURIComponent(code);
    const {bootstrap}=setup({css:[],js:[],collections:[{name:'docs',url,buildId:'sha256:'+'a'.repeat(64)}]});
    await assert.rejects(bootstrap.run(),/identity mismatch/);
    assert.equal(globalThis[marker],0);delete globalThis[marker];
});

test('old URL-only bootstrap format is rejected instead of accepted as a fallback',async()=>{
    const {bootstrap}=setup({css:[],js:[],collections:['/collection.js']});
    await assert.rejects(bootstrap.run(),/Invalid or duplicate collection bootstrap record/);
});

test('closing during CSS loading cancels startup without waiting for a load event',async()=>{
    const {window,bootstrap,closed}=setup({css:['/slow.css'],js:[],collections:[]});
    const running=bootstrap.run();window.dispatchEvent(new window.Event('pagehide'));
    assert.equal(await running,null);assert.equal(closed(),1);
    window.document.querySelector('link').dispatchEvent(new window.Event('error'));
});
