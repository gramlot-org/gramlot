import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {PageBootstrap} from '../src/bootstrap.js';
import {Gramlot} from '../src/gramlot.js';
import layout from '../src/components/layout.js';
import {layoutWindow} from './helpers/layout-window.js';

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

test('bootstrap retains the activated collection object for additional tools in the same document', async () => {
    const code = `export {default} from ${JSON.stringify(new URL('../src/components/layout.js', import.meta.url).href)}; export const buildId='sha256:${'a'.repeat(64)}';`;
    const url = 'data:text/javascript,' + encodeURIComponent(code);
    const {window, bootstrap} = setup({css:[], js:[], collections:[{name:'layout', url, buildId:'sha256:'+'a'.repeat(64)}]});
    layoutWindow(window);
    window.navigator.sendBeacon = () => true;
    const original = Gramlot.prototype.start;
    Gramlot.prototype.start = async function () { this.state = 'started'; return this; };
    let app, tool;
    try {
        app = await bootstrap.run();
        assert.equal(app.getCollection('layout'), layout);
        tool = new Gramlot({document:window.document, element:window.document.createElement('div'), transport:false,
            collections:[app.getCollection('layout')]});
        assert.equal(tool.getCollection('layout'), layout);
    } finally {
        tool?.dispose(); app?.dispose(); Gramlot.prototype.start = original; window.close();
    }
});
