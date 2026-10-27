import {Gramlot, GramlotBuilder} from '../../../src/index.js';
import {Jodit} from 'jodit';
import editors from '../../../src/components/editors.js';

window.exerciseEditors=async()=>{
    const check=(condition,message)=>{if(!condition)throw new Error(message);};
    const app=new Gramlot({document,transport:false,collections:[editors]});
    const builder=new GramlotBuilder(null,{collections:[editors]});
    const original='<!DOCTYPE html><html><head><title>First</title><style>p{color:red}</style></head><body><p onclick="unsafe()">Original</p><script>unsafe()</script><form action="/save"><input value="keep"></form></body></html>';
    app.data.setItem('html',original);
    app.data.setItem('markdown','# Original\n');
    app.data.setItem('code','original');
    app.data.setItem('live',true);app.data.setItem('labelPosition','TL');
    for(const [tag,path] of [['htmlEditor','html'],['markdownEditor','markdown'],['codeMirror','code']])
        builder.root[tag]({id:path,value:`^${path}`,readonly:'^locked',live:'^live',height:'260px',lbl:path,lbl_position:'^labelPosition'});
    app.src.startSource(builder.toTytx());
    const hosts=['html','markdown','code'].map(id=>document.getElementById(id));
    await Promise.all(hosts.map(host=>host.ready));
    const [html,markdown,code]=hosts;
    const engines=hosts.map(host=>host.engine??host.editor);
    const frame=html.control.querySelector('iframe'), body=frame.contentDocument.body;
    const controls=hosts.map(host=>host.control);
    app.data.setItem('labelPosition','L');
    check(hosts.every((host,index)=>(host.engine??host.editor)===engines[index]),'Label layout preserves editor engines');
    check(hosts.every(host=>!host.shadowRoot.querySelector('.labelbox')),'Only renderer owns editor Labelbox');
    app.data.setItem('labelPosition','TL');
    const native=Object.values(Jodit.instances).find(instance=>instance.editor===body);
    check(native,'Real Jodit instance is registered');
    check(!frame.hasAttribute('sandbox'),'Editing uses sanitization and CSP, not the WebKit-blocking sandbox');
    check(frame.contentDocument.querySelector('meta[http-equiv="Content-Security-Policy"]').content.includes("script-src 'none'"),'Canvas blocks script execution');
    let inputs=0;html.addEventListener('input',()=>inputs++);
    // Exercise a real rich edit, then an external replacement with a different protected head/body.
    await window.focusHtml();
    const typingRange=frame.contentDocument.createRange();typingRange.selectNodeContents(body.querySelector('p'));
    const typingSelection=frame.contentWindow.getSelection();typingSelection.removeAllRanges();typingSelection.addRange(typingRange);
    await window.typeIntoHtml();
    await new Promise(resolve=>setTimeout(resolve,1200));
    check(app.data.getItem('html').includes('Typed'),'HTML typing reaches Data: '+JSON.stringify({value:app.data.getItem('html'),body:body.innerHTML,active:frame.contentDocument.activeElement?.tagName,status:html.control.querySelector('.html-editor-status').textContent}));
    const typed=app.data.getItem('html');
    check(typed.includes('<form action="/save"><input value="keep"></form>')&&!body.querySelector('form,input'),'Protected controls survive the real rich edit without becoming interactive');
    const range=frame.contentDocument.createRange();range.setStart(body.querySelector('p').firstChild,2);range.collapse(true);
    const selection=frame.contentWindow.getSelection();selection.removeAllRanges();selection.addRange(range);
    const inputCount=inputs;
    const replacement='<!DOCTYPE html><html><head><title>Second</title><style>p{color:blue}</style></head><body><p onclick="other()">Incoming</p><script>other()</script></body></html>';
    app.data.setItem('html',replacement);
    check(html.engine===engines[0]&&html.control.querySelector('iframe')===frame,'HTML engine and iframe identity');
    check(Object.values(Jodit.instances).includes(native)&&native.editor===body,'Native Jodit identity is retained');
    check(body.querySelector('p').textContent==='Incoming','HTML external content');
    check(inputs===inputCount&&app.data.getItem('html')===replacement,'HTML external update is silent');
    check(selection.anchorOffset===2,'HTML selection survives compatible content change');
    check(!body.querySelector('script')&&!body.querySelector('[onclick]'),'HTML remains inert');
    check(html.undo(),'HTML external update is undoable');
    check(app.data.getItem('html')===typed,'HTML undo retains original protected context: '+JSON.stringify({actual:app.data.getItem('html'),expected:typed,status:html.control.querySelector('.html-editor-status').textContent,body:body.innerHTML}));
    check(html.undo(),'HTML typing history survives');
    for(let n=0;n<8&&app.data.getItem('html')!==original&&html.undo();n++);
    check(app.data.getItem('html')===original,'HTML undo reaches original exact document: '+app.data.getItem('html'));
    check(html.redo(),'HTML redo survives');
    for(let n=0;n<8&&html.redo();n++);
    check(app.data.getItem('html')===replacement,'HTML redo restores new document metadata');
    // A head-only replacement must also be represented in the existing history.
    const headOnly=replacement.replace('<title>Second</title>','<title>Third</title>');
    app.data.setItem('html',headOnly);
    check(html.undo()&&app.data.getItem('html')===replacement,'HTML head-only undo');
    check(html.redo()&&app.data.getItem('html')===headOnly,'HTML head-only redo');
    code.focus();
    const focused=document.activeElement;
    app.data.setItem('html',headOnly.replace('Incoming','Silent incoming'));
    check(document.activeElement===focused,'HTML background projection does not steal focus: '+JSON.stringify({before:focused?.outerHTML.slice(0,150),after:document.activeElement?.outerHTML.slice(0,150)}));
    app.data.setItem('locked',true);
    for(const [path,value] of [['html','<p>Readonly incoming</p>'],['markdown','# Readonly incoming\n'],['code','readonly incoming']])app.data.setItem(path,value);
    check(body.querySelector('p').textContent==='Readonly incoming','HTML readonly Data projection');
    check(markdown.engine.view.state.doc.firstChild.textContent==='Readonly incoming','Markdown readonly Data projection');
    check(code.editor.view.state.doc.toString()==='readonly incoming','CodeMirror readonly Data projection');
    hosts.forEach((host,i)=>check((host.engine??host.editor)===engines[i]&&host.control===controls[i],`Stable engine ${i}`));
    check(!html.undo()&&!markdown.undo()&&!code.undo(),'Readonly blocks user history commands');
    app.data.setItem('locked',false);
    app.data.setItem('html','');
    check(html.engine===engines[0]&&app.data.getItem('html')==='','Empty HTML retains its engine and exact Data');
    await window.focusHtml();
    app.data.setItem('html','<p>Deferred</p>');
    app.data.setItem('live',false);
    const deferredRange=frame.contentDocument.createRange();deferredRange.selectNodeContents(body.querySelector('p'));
    selection.removeAllRanges();selection.addRange(deferredRange);
    await window.typeIntoHtml();
    await new Promise(resolve=>setTimeout(resolve,1200));
    check(app.data.getItem('html')==='<p>Deferred</p>','Deferred rich typing does not commit early');
    const beforeProjection=inputs;
    app.data.setItem('html','<p>External after draft</p>');
    check(app.data.getItem('html')==='<p>External after draft</p>'&&inputs===beforeProjection,'External projection does not echo a pending draft');
    check(html.engine===engines[0],'Deferred update retains the same engine');
    // Exercise Jodit's official insertion paths with untrusted markup. The fixture uses
    // actual clipboard/drop events, accepting HTML rather than opening its choice dialog.
    app.data.setItem('live',true);app.data.setItem('labelPosition','TL');
    native.options.askBeforePasteHTML=false;
    window.editorAttack=0;frame.contentWindow.editorAttack=0;
    const attack='<p>Accepted <strong>formatting</strong></p>'+
        '<img src="data:image/png;base64,broken" onerror="window.editorAttack++">'+
        '<a href="java&#x09;script:window.editorAttack++">Unsafe link</a>'+
        '<svg onload="window.editorAttack++"><script>window.editorAttack++</script></svg>'+
        '<iframe srcdoc="<script>parent.editorAttack++</script>"></iframe>'+
        '<form action="https://invalid.example/"><input autofocus></form>'+
        '<!--unknown-context--><noscript><img src=x onerror="window.editorAttack++"></noscript>';
    const inert=()=>{
        check(!body.querySelector('script,svg,math,iframe,object,embed,form,input,noscript'),'No active or embedded content in the canvas');
        check([...body.querySelectorAll('*')].every(node=>[...node.attributes].every(attr=>
            !/^on/i.test(attr.name)&&!(attr.name==='href'&&/^javascript:/i.test(node.href)))), 'No event handlers or executable links');
        check(!window.editorAttack&&!frame.contentWindow.editorAttack,'No payload executed');
    };
    const send=(type,content)=>{
        native.selection.setCursorIn(body.querySelector('p'),false);
        const data=new DataTransfer();data.setData('text/html',content);
        const event=type==='paste' ? new ClipboardEvent('paste',{clipboardData:data,bubbles:true,cancelable:true}) :
            new DragEvent('drop',{dataTransfer:data,bubbles:true,cancelable:true});
        body.dispatchEvent(event);
        check(event.defaultPrevented,'Jodit handles '+type);
    };
    for(const type of ['paste','drop']) {
        app.data.setItem('html','<p>Safe '+type+'</p>');
        send(type,'<p>Accepted <strong>formatting</strong></p>');
        inert();
        await new Promise(resolve=>setTimeout(resolve,600));
        inert();
        check(body.textContent.includes('Accepted')&&body.querySelector('strong'),'Safe pasted/dropped formatting survives '+type);
        check(app.data.getItem('html').includes('Accepted')&&!app.data.getItem('html').includes('gramlot-document-'),'Sanitized '+type+' reaches Data without internal markers');
        check(html.undo()&&!app.data.getItem('html').includes('Accepted'),'Sanitized '+type+' is undoable');
        check(html.redo()&&app.data.getItem('html').includes('Accepted'),'Sanitized '+type+' is redoable');
        inert();
        const beforeAttack=app.data.getItem('html');
        send(type,attack);
        inert();
        await new Promise(resolve=>setTimeout(resolve,600));
        inert();
        check(app.data.getItem('html')===beforeAttack,'Rejected active '+type+' does not alter Data');
        check(html.control.querySelector('.html-editor-status').textContent.includes('Active or embedded'),'Active '+type+' reports the existing Code-only constraint');
        check(html.engine===engines[0]&&native.editor===body,'Rejected '+type+' retains the instance');
        for(let n=0;n<8&&app.data.getItem('html')===beforeAttack&&html.undo();n++)inert();
        check(!app.data.getItem('html').includes('Accepted'),'Undo still reaches the preceding safe content after rejected '+type);
        for(let n=0;n<8&&html.redo();n++)inert();
        check(app.data.getItem('html')===beforeAttack,'Redo retains safe Data after rejected '+type);
    }
    // Deferred cleanup and update events must not produce late writes after disposal.
    app.dispose();
    await new Promise(resolve=>setTimeout(resolve,1100));
    check(hosts.every(host=>!(host.engine??host.editor)),'All engines disposed with Source');
    return 'identity, silent binding, selection, undo/redo, protected HTML, head-only changes, readonly, safe paste/drop, rejected active paste/drop and disposal';
};
