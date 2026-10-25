import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

// Exercise the engine's real iframe event wiring with an inert third-party editor.
// Jodit's editing behavior is outside this regression: only Gramlot owns save publication.
const bundle=await build({
    entryPoints:[new URL('../src/components/jodit-engine.js',import.meta.url).pathname],
    bundle:true,write:false,format:'esm',loader:{'.css':'text'},
    plugins:[{name:'inert-jodit',setup(build){
        build.onResolve({filter:/^jodit(?:\/|$)/},({path})=>({path,namespace:'inert-jodit'}));
        build.onLoad({filter:/.*/,namespace:'inert-jodit'},({path})=>({contents:path==='jodit' ? `
            export const Jodit={make(textarea){
                const doc=textarea.ownerDocument.implementation.createHTMLDocument();
                return {editor:doc.body,value:'',history:{clear(){},canUndo(){return false},canRedo(){return false}},
                    events:{on(){},fire(){}},setReadOnly(){},destruct(){}};
            }};` : path.endsWith('.css') ? 'export default "";' : ''}));
    }}]
});
const {createHtmlEditor}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));

test('HTML iframe save shortcut respects readonly/disabled and is released on destroy',()=>{
    const {window}=new JSDOM('<body></body>');
    window.ResizeObserver=class{observe(){}disconnect(){}};
    const host=window.document.createElement('div');host.attachShadow({mode:'open'});
    host.control=window.document.createElement('div');host.shadowRoot.append(host.control);
    host.parameters={readonly:true,disabled:false};host.readControlValue=()=>'<p>Draft</p>';
    const calls=[];host.pageContext={publish:(name,payload)=>calls.push({name,payload})};
    // Capture the actual iframe document passed to the engine's event listeners.
    const original=window.document.implementation.createHTMLDocument.bind(window.document.implementation);
    let frame;
    window.document.implementation.createHTMLDocument=(...args)=>(frame=original(...args));
    const engine=createHtmlEditor(host);
    const save=()=>{const event=new window.KeyboardEvent('keydown',{key:'s',ctrlKey:true,cancelable:true});frame.dispatchEvent(event);return event;};
    try {
        assert.equal(save().defaultPrevented,true);assert.equal(calls.length,0);
        host.parameters.readonly=false;host.parameters.disabled=true;engine.configure();
        save();assert.equal(calls.length,0);
        host.parameters.disabled=false;engine.configure();save();
        assert.deepEqual(calls,[{name:'save',payload:{value:'<p>Draft</p>'}}]);
        engine.destroy();assert.equal(save().defaultPrevented,false);assert.equal(calls.length,1);
    } finally {window.close();}
});
