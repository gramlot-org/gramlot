import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot} from '../src/index.js';

const settle=()=>new Promise(resolve=>setImmediate(resolve));
function fixture(t) {
    const {window}=new JSDOM('<main id="gramlot-root"></main><input id="outside">',{runScripts:'dangerously'});
    window.HTMLElement.prototype.showPopover=function(){this.setAttribute('data-open','');};
    const app=new Gramlot({document:window.document,transport:false});
    t.after(()=>{app.dispose();window.close();});
    return {app,window,document:window.document};
}

test('error notice is nonmodal, safe text, expandable, deduplicated and dismissible through Source',async t=>{
    const {app,document}=fixture(t),input=document.getElementById('outside');input.focus();
    const error=new Error('<img src=x onerror="window.attack=1">',{cause:new Error('Transport failed')});
    app.src.binding.reportError(error,'Content could not be loaded');
    app.src.binding.reportError(error,'Content could not be loaded');
    await settle();
    const panel=document.querySelector('.gramlot-error-notifications');
    assert.equal(panel.getAttribute('popover'),'manual');assert.equal(panel.hasAttribute('data-open'),true);
    assert.equal(document.activeElement,input);assert.equal(document.querySelector('dialog'),null);
    assert.equal(panel.querySelectorAll('article').length,1);assert.equal(panel.querySelector('img'),null);
    assert.equal(panel.querySelector('p').textContent,error.message);
    const details=panel.querySelector('details');assert.equal(details.open,false);
    details.querySelector('summary').click();assert.equal(details.open,true);
    assert.match(details.textContent,/Transport failed/);
    panel.querySelector('button').click();assert.equal(document.querySelector('.gramlot-error-notifications'),null);
    assert.equal(app.src.source.length,0);
    app.src.binding.reportError(new Error('Retry failed'),'Content could not be loaded');await settle();
    assert.match(document.querySelector('[role=alert]').textContent,/Retry failed/);
});

test('cancellation and queued errors after disposal produce no notification',async t=>{
    const {app,document,window}=fixture(t);
    app.src.binding.reportError(new Error('Remote cancelled',{cause:new window.DOMException('Cancelled','AbortError')}),'Content');
    await settle();assert.equal(document.querySelector('[role=alert]'),null);
    app.src.binding.reportError(new Error('Pending'),'Content');app.dispose();
    await settle();assert.equal(document.querySelector('[role=alert]'),null);
});


test('error text never becomes a pointer or an expression, including titles and details',async t=>{
    const {app,document,window}=fixture(t);app.data.setItem('secret','PRIVATE DATA');
    for(const message of ['^secret','=secret','==window.attack = 1','<img src=x onerror=attack()>::HTML']) {
        const error=new Error(message);error.stack=message;
        app.src.binding.reportError(error,message);await settle();
        const notice=document.querySelector('article');
        assert.equal(notice.querySelector('strong').textContent,message);
        assert.equal(notice.querySelector('p').textContent,message);
        assert.equal(notice.querySelector('pre').textContent,message);
        assert.doesNotMatch(notice.textContent,/PRIVATE DATA/);
        notice.querySelector('button').click();
    }
    assert.equal(window.attack,undefined);
});

test('nullish rejections are displayed without an unhandled exception',async t=>{
    const {app,document}=fixture(t);
    for(const error of [null,undefined]) app.src.binding.reportError(error,'Action failed');
    await settle();
    assert.deepEqual([...document.querySelectorAll('article p')].map(p=>p.textContent),['null','undefined']);
});

test('error bursts are bounded and dismissed errors stay quiet for this page',async t=>{
    const {app,document}=fixture(t);
    for(let i=0;i<500;i++)app.src.binding.reportError(new Error(`Failure ${i}`),'Action failed');
    await settle();
    assert.equal(document.querySelectorAll('article').length,5);
    assert.equal(document.querySelector('[role=status]').textContent,'495 additional errors');
    for(const button of document.querySelectorAll('article button'))button.click();
    assert.equal(document.querySelector('.gramlot-error-notifications'),null);
    app.src.binding.reportError(new Error('Failure 0'),'Action failed');await settle();
    assert.equal(document.querySelector('[role=alert]'),null);
    app.src.binding.reportError(new Error('New failure'),'Action failed');await settle();
    assert.equal(document.querySelectorAll('article').length,1);
});
