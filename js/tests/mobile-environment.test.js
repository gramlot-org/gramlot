import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {MobileEnvironment} from '../src/mobile-environment.js';
test('outer viewport owns edges, child viewport does not duplicate them; repeated install shares ownership',()=>{
 const dom=new JSDOM('<meta name="viewport" content="width=device-width,initial-scale=1"><main id="root"></main><iframe></iframe>');
 const doc=dom.window.document,root=doc.getElementById('root');
 const parent=MobileEnvironment.install({document:doc,root});
 assert.equal(root.getAttribute('data-gramlot-viewport'),'root');
 assert.equal(doc.querySelector('meta').content,'width=device-width,initial-scale=1,viewport-fit=cover');
 assert.equal(MobileEnvironment.install({document:doc,root}),parent);
 const childDoc=doc.querySelector('iframe').contentDocument;
 const child=MobileEnvironment.install({document:childDoc,root:childDoc.body});
 assert.equal(childDoc.body.getAttribute('data-gramlot-viewport'),'child');
 assert.ok(parent.style.textContent.includes('[data-gramlot-viewport="root"]'));
 child.dispose();parent.dispose();assert.equal(root.hasAttribute('data-gramlot-viewport'),false);assert.equal(doc.querySelector('style'),null);dom.window.close();
});
test('system indicator appearance follows the declared theme and releases its listeners',async()=>{
 const dom=new JSDOM('<html style="color-scheme:dark"><head></head><body><main></main></body></html>');const win=dom.window;
 const media=new win.EventTarget();media.matches=false;win.matchMedia=()=>media;
 const env=MobileEnvironment.install({document:win.document,root:win.document.querySelector('main')}),values=[];
 env.subscribeAppearance(value=>values.push(value.dark));assert.deepEqual(values,[true]);
 win.document.documentElement.style.colorScheme='light';await new Promise(r=>setTimeout(r,0));assert.deepEqual(values,[true,false]);
 env.dispose();win.document.documentElement.style.colorScheme='dark';await new Promise(r=>setTimeout(r,0));assert.deepEqual(values,[true,false]);win.close();
});


test('runtime export shares the page environment; integration release preserves core ownership', async () => {
 const {Gramlot,MobileEnvironment:PublicEnvironment}=await import('../src/index.js');
 assert.equal(PublicEnvironment,MobileEnvironment);
 const dom=new JSDOM('<main id="gramlot-root"></main>');
 const window=dom.window,document=window.document,root=document.querySelector('main');
 const media=new window.EventTarget();media.matches=false;window.matchMedia=()=>media;
 const page=new Gramlot({document,transport:false});
 const environment=PublicEnvironment.install({document,root});
 assert.equal([...document.querySelectorAll('style')].filter(style=>style.textContent.includes('[data-gramlot-viewport]')).length,1);
 let updates=0;const release=environment.subscribeAppearance(()=>updates++);
 release();assert.equal(updates,1);assert.equal(root.getAttribute('data-gramlot-viewport'),'root');
 assert.ok(environment.style.isConnected);
 page.dispose();assert.equal(environment.style.isConnected,false);window.close();
});
